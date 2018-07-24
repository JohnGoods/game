/*
作者:
    liuziming
	
创建时间：
   2013.10.28(周一)

意图：
  NPC对话逻辑控制
	接受TaskDialogue管理的窗口必须提供接口
		updateDialog( sayerId, content, functionRef, list){
公共接口：
   
*/

class TaskDialogue extends TClass {

	//dialogueFrame:any[];
	saveDate:any;
	curWindow:TaskDialogFrame;
	//curIndex:number;
	//jumpData:any;

	entryId:number;

	//inLastDialog:boolean;
	npcId:number;

	
	closeCallback:Function;
	callbackObj:any;

	//flag:number;

	//optionList:any[]

	public initObj(...args: any[]): void {
		this.initDialogueData()
		this.saveDate = {}
	}

	destory() {

	}

	////////////////////////////////////////////////////////////////////////
	initDialogueData() {
		// this.dialogueFrame =[]
		// let str: any = [ "TaskDialogFrame", "TaskDialogFrame","TaskDialogFrame"]
		// for (let _ = 0; _ < str.length; _++) {
		// 	let v = str[_]

		// 	let window = WngMrg.getInstance().getWindow(v)
		// 	if (!window) {
		// 		TLog.Warn("TaskDialogue.initDialogueData the window: %s is ! exist!", v)
		// 	}
		// 	window.loadWnd()
		// 	JsUtil.arrayInstert(this.dialogueFrame, window)
		// }

		let window = WngMrg.getInstance().getWindow("TaskDialogFrame")
		window.loadWnd()

		this.entryId = -1
		this.npcId = -1
		this.curWindow = window
		//this.curIndex = 0						//10表示关闭状态
		//this.jumpData = {}
	}

	 showDramaState(talkId, entryId, nodeId) {
	// 	//if(HeroIsTeamMemNotAway() ){
	// 	//	return
	// 	//}
		nodeId = checkNull(nodeId , 1)

	 	if (type(entryId) == "number") {
	 		this.entryId = entryId
	 	} else if (type(entryId) != "") {
	 		this.entryId = tonumber(GetStringSplitBySchool(entryId))
	 	}

	 	if (type(talkId) == "number") {

	 	} else {
	 		talkId = tonumber(GetStringSplitBySchool(talkId))
	 	}

	 	let npc = ActorManager.getInstance().getNpcWithEntryId(entryId)
	 	if (npc) {
	 		this.npcId = npc.getId()
	 	}
	// 	//this.curIndex = 2
	 	this.recive_npc_talk(talkId, nodeId)
	 }

	onDialogTranslateWord(args:gui.GUITranslateWordEvent) {
		// tolua.cast(args, "gui::GUITranslateWordEvent")
		let word = args.getTranslateWord()
		args.setTranslateWord(TaskExecutor.getInstance().executeGetReplaceWord(word, 0))
	}

	////////////////////////////////////////////////////////////////////////////////
	//对话逻辑
	////////////////////////////////////////////////////////////////////////////////
	talkWithNpc(npcId, entryId) {													//DIALOG_FUNCTION_NODEID节点不可隐藏
		// if (this.curWindow.isVisible() ){
		// 	this.inLastDialog = true
		// }

		this.closeCallback = null
		this.callbackObj = null

		let npc = ActorManager.getInstance().getNpc(npcId)
		let npcInfo = null
		if(npc ){
			npcInfo = npc.getPropertyInfo()
		}
		
		if(npcInfo && npcInfo.param[opNPCOptions.BATTLE] && npcInfo.param[opNPCOptions.BATTLE] != 0 ){
				//MsgSystem.ConfirmDialog_YES(Localize_cns("NPC_FIGHTING"))
				MsgSystem.addTagTips(Localize_cns("NPC_FIGHTING"))
		}

		// if(!CheckHeroCanGo() ){
		// 	return
		// }


		//this.resetData()		//刷新一下状态，避免队伍状态下的冲突

		
		let npcObject = ActorManager.getInstance().getNpc(npcId)
		if(npcObject == null ){
			//TLog.Error("TaskDialogue.talkWithNpc npcID:%s ! exsit", tostring(npcId))
			//return
		}else{
			entryId = npcObject.getEntryId()
		}

		let npcRef = ActorManager.getInstance().getNpcRefWithEntryId(entryId)
		if (npcRef == null) {
			TLog.Error("TaskDialogue.talkWithNpc entryID:%s ! exsit", tostring(entryId))
			return
		}

		if (npcRef.talkInTeam == 1 && HeroIsCaptain()) {
			let message = GetMessage(opCodes.C2G_TASK_TEAM_TALK)
			message.npcId = npcId
			SendGameMessage(message)
		}

		this.npcId = checkNull(npcId, -1)			//NPC实例ID
		this.entryId = entryId	//Npc配置ID

		let [opList, opStatusList] = this.getOpTalkList(entryId)
		let [taskList, taskStatusList] = TaskSystem.getInstance().getTaskTalkList(entryId)

		//彩蛋检查
		// let [bEasterEgg, newDiscribe] = EasterEggSystem.getInstance().showEasterEggDialog(EasterEggTypeList.FIELD_NPC_TALK, entryId)
		// if(bEasterEgg && newDiscribe != null ){
		// 	// let box_info = GameConfig.DialogBoxConfig[opList[0]][DIALOG_FUNCTION_NODEID]
		// 	// let talkNpcId = tonumber( box_info.NpcIds)
		// 	// talkNpcId = TaskSystem.getInstance().getCommitTaskNpc(talkNpcId, -1)

		// 	let tlist:any = []
		// 	this.insertCloseInst(tlist)
		// 	this.adjustDialogBox(tlist, this.on_func_list_click, newDiscribe, entryId, OptionType.none)
		// 	return
		// }

		let taskSystem = TaskSystem.getInstance()
		TLog.Debug(String.format("talkWithNpc opList.length == %d && taskList.length == %d ){", size_t(opList), size_t(taskList)))

		//this.changeDialogFrame(2)
		if (opList.length == 1 && taskList.length == 0) {
			let op = opList[0]

			let talkRef = GameConfig.DialogBoxConfig[op][DIALOG_FUNCTION_NODEID]
			//如果功能对话结点有DIALOG_FUNCTION_NODEID对话点，而且跳转不为0
			let go = talkRef.NextNode1[0]
			if (go != 0 || talkRef.type == 1) {
				this.recive_npc_talk(op, DIALOG_FUNCTION_NODEID)
				return
			}
		}

		let tlist = []
		if(taskList.length == 1){																		// 无（有）功能，只有一个任务
  			this.recive_npc_talk(taskList[0], this.getTaskStartNode(taskList[0], entryId))
		  }else if(opList.length > 0 || taskList.length > 1){				// 有功能列表，或临时功能列表，或任务2个以上
			//任务列表
			for (let i = 0; i < taskList.length; i++) {
				let taskId = taskList[i]

				let t: any = {}
				t.args = [ taskId, this.getTaskStartNode(taskId, entryId) ]
				t.title = taskSystem.getTaskName(taskId)
				t.status = taskStatusList[i] //如果有状态，就有值
				t.opType = OpType.task
				JsUtil.arrayInstert(tlist, t)
			}

			//功能对话列表
			for (let i = 0; i < opList.length; i++) {
				let taskId = opList[i]

				let talkRef = GameConfig.DialogBoxConfig[taskId][DIALOG_FUNCTION_NODEID]
				let t: any = {}
				t.args = [ taskId, DIALOG_FUNCTION_NODEID ]
				t.title = talkRef.Option1
				t.status = opStatusList[i] //如果有状态，就有值
				t.opType = OpType.func
				JsUtil.arrayInstert(tlist, t)
			}

			//关闭指令
			this.insertCloseInst(tlist)
			this.adjustDialogBox(tlist, this.on_func_list_click, npcRef.discribe, entryId, OptionType.special)

		// } else if (taskList.length == 1) {																		// 无功能，只有一个任务
		// 	this.recive_npc_talk(taskList[0], this.getTaskStartNode(taskList[0], entryId))

		} else {//无功能和任务

			let tlist = []
			this.insertCloseInst(tlist)
			if(npcRef.discribe && npcRef.discribe != ""){
				this.adjustDialogBox(tlist, this.on_func_list_click, npcRef.discribe, entryId, OptionType.none) //木有功能列表
			}
		}
	}



	showWithTaskId(taskId:number, closeCallback?:Function, thisObj?:any){
		this.npcId = -1			//NPC实例ID
		this.closeCallback = closeCallback
		this.callbackObj = thisObj


		let taskRef = TaskSystem.getInstance().getTaskRef(taskId)
		let taskNpcId = tonumber(taskRef.NpcIds)//当前是领取任务的NPC
		this.entryId = taskNpcId	//Npc配置ID

		this.recive_npc_talk(taskId, this.getTaskStartNode(taskId, taskNpcId))
	}



	getOpTalkList(npcEntryId) {
		//1.获取NPC对话节点
		let npcRef = ActorManager.getInstance().getNpcRefWithEntryId(npcEntryId)
		let taskSystem = TaskSystem.getInstance()

		//检查谈话节点是不是可以显示的
		let talkOpList = []
		let statusList = []
		for (let _ = 0; _ < npcRef.talkOpList.length; _++) {
			let taskId = npcRef.talkOpList[_]

			let dialogRef = GameConfig.DialogBoxConfig[taskId]
			if (dialogRef && dialogRef[DIALOG_FUNCTION_NODEID]) {
				let talkRef = dialogRef[DIALOG_FUNCTION_NODEID]
				let ret = TaskChecker.getInstance().checkOpList(talkRef.Show, true) //如果可以显示，显示
				if (ret) {
					JsUtil.arrayInstert(talkOpList, taskId)

					let status = TaskStatus.NONE
					if (GameConfig.TaskAcceptNpcConfig[npcEntryId]) {
						if (!taskSystem.isAccpetTaskTalk(taskId, npcEntryId)) {
							JsUtil.arrayRemove(talkOpList)
						} else {
							status = TaskStatus.ACCPET
						}
					}

					if (table_isExist(talkOpList, taskId)) {
						JsUtil.arrayInstert(statusList, status)
					}

				}
			}
		}

		return [talkOpList, statusList]
	}

	//找到对话的开始节点
	getTaskStartNode(taskId, npcEntryId) {
		let nodeId = 10000
		let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
		let isFinish = TaskSystem.getInstance().isTaskFinish(taskId)
		TLog.Debug("TaskDialogue.getTaskStartNode the npc is:", npcEntryId)
		//找到对话的最顶结点
		if (GameConfig.DialogBoxConfig[taskId]) {
			for (let _k in GameConfig.DialogBoxConfig[taskId]) {
				let k = tonumber(_k)

				let v = GameConfig.DialogBoxConfig[taskId][k]

				let talkNpcId = tonumber(GetStringSplitBySchool(v.NpcIds))
				talkNpcId = TaskSystem.getInstance().getCommitTaskNpc(talkNpcId, taskId)

				if (npcEntryId == talkNpcId && k < nodeId) {
					nodeId = k
				}

			}
			//找不到nodeId,仍保留原值
			if (nodeId == 10000) {
				for (let _k in GameConfig.DialogBoxConfig[taskId]) {
					let k = tonumber(_k)
					let v = GameConfig.DialogBoxConfig[taskId][k]
					if (v.NpcIds == "" && k < nodeId) {	//默认NpcIds置空是表示该节点对应任务动态npc
						nodeId = k
					}
				}
			}
		}

		return nodeId
	}

	executeDialogOp(taskId, nodeId, index) {
		let talkRef = GameConfig.DialogBoxConfig[taskId][nodeId]
		let op_table = talkRef["Operation"+index]//处理指令
		if (op_table == null) {
			return
		}

		let operation = op_table[0] || 0

		let param = op_table['param']
		if (operation != 0) {
			TLog.Debug("TaskDialogue.executeDialogOp GameConfig.DialogBoxConfig[%d][%d][Operation%d] operation:%s", taskId, nodeId, index, operation)
			return TaskExecutor.getInstance().executeNpcDialogOp(operation, this.npcId, taskId, nodeId, param)
		}
	}

	getJumpTalkNode(taskId, nodeId, index) {
		let talkRef = GameConfig.DialogBoxConfig[taskId][nodeId]
		let option = talkRef["NextNode"+index]

		let go = 0
		if (option != null) {
			for (let i = 0; i < option.length; i++) {
				let isFix = true
				if (type(option[i]) == "object") {
					//TLog.Debug("go:", option[i][0], "cond:", option[i][1])
					go = option[i][0]
					if (option[i][1]) {
						isFix = TaskChecker.getInstance().checkOpList(option[i][1], false) //跳转检查
					}
				} else {
					go = option[i]
				}

				if (isFix) {
					break
				}
			}
		}

		TLog.Debug("TaskDialogue.getJumpTalkNode GameConfig.DialogBoxConfig[%d][%d][NextNode%d] go:%d", taskId, nodeId, index, go)
		return go
	}

	closeFrame() {
		if(this.closeCallback){
			DelayEvecuteFunc(0, this.closeCallback, this.callbackObj)
			//this.closeCallback.call(this.callbackObj)
			this.closeCallback = null;
			this.callbackObj = null;
		}
		//this.resetData()
		this.curWindow.hideWnd();
		//return FireEvent(EventDefine.TASK_DIALOG_TRANSFORM, TaskDialogEvent.newObj(10))
	}

	recive_npc_talk(taskId, nodeId) {        //NPC任务对话
		//TLog.Debug("TaskDialogue.recive_npc_talk==================", taskId, nodeId, oldNodeId)
		if (nodeId == DIALOG_NOJUMP_NODEID) {
			return
		}

		if (nodeId == 0) {  //对话ID被0，关闭对话框
			// if (!this.inLastDialog) {
			// 	return this.closeFrame()
			// } else {
			// 	this.inLastDialog = false
			// 	return
			// }
			this.closeFrame()
			return 
		}

		//第一步检测
		let dialogRef = GameConfig.DialogBoxConfig[taskId]
		if (dialogRef == null) {
			TLog.Error("TaskDialogue.recive_npc_talk GameConfig.DialogBoxConfig[%s] ! exsit", tostring(taskId))
			return
		}
		//第二步检测
		let talkRef = dialogRef[nodeId]
		if (talkRef == null) {
			TLog.Error("TaskDialogue.recive_npc_talk GameConfig.DialogBoxConfig[%s][%s] ! exsit", tostring(taskId), tostring(nodeId))
			return
		}

		if (talkRef.type == 1) {		// 隐形节点
			this.executeDialogOp(taskId, nodeId, 1)
			let go = this.getJumpTalkNode(taskId, nodeId, 1)
			this.recive_npc_talk(taskId, go)
			return
		}

		if (nodeId == -1) {
			this.refresh_dialog_box(taskId, nodeId, true)
		} else {
			this.refresh_dialog_box(taskId, nodeId)
		}
	}

	//////////////////////////刷新对话框
	refresh_dialog_box(taskId, nodeId, isFunc?) {
		let box_info = GameConfig.DialogBoxConfig[taskId][nodeId]
		let flag = checkNull(isFunc, false)
		//table_TLog.Debug(box_info)
		//io.read()
		//插入对话内容
		let tlist = []
		//若表单中的Option..i中含有内容
		//根据表单,设置选项的数量和title
		for (let i = 1; i <= DIALOG_OPTION_MAX_COUNT; i++) {
			if (box_info["Option" + tostring(i)]) {
				//title是表单中Option1
				let title = GetStringSplitBySchool(box_info["Option" + tostring(i)], GetHeroProperty("race"), 3)
				// if ((title == Localize_cns("Role_school_qingyimen") && GetHeroProperty("sexId") != 1) || (title == Localize_cns("Role_school_moyundong") && GetHeroProperty("sex") != 2)) {
				// 	title = null
				// }
				//如果不为空
				//if (title && string_util.check_blank_connet(title)) {
				if(title != ""){
					let t: any = {}
					//任务id,对话节点,计数
					t.args = [ taskId, nodeId, i ]
					t.title = title
					t.status = TaskStatus.NONE //如果有状态，就有值
					if (flag) {
						t.opType = OpType.func
					} else {
						t.opType = OpType.normal
					}
					JsUtil.arrayInstert(tlist, t)
				}
			}
		}

		TLog.Debug("TaskDialogue.refresh_dialog_box btnlist: %d", tlist.length)

		//! used
		let frameType = box_info.frametype - 1

		//this.changeDialogFrame(frameType)

		//没有选项
		if (tlist.length == 0) {
			let defaultOp:any = {}
			defaultOp.args = [ taskId, nodeId ]
			tlist.push(defaultOp);
			//this.setJumpData([ taskId, nodeId ] )
			//通知TaskDialogFrame
			//this.curWindow.setFrameJumpData([ taskId, nodeId ])
		} else {
			//插入关闭按钮title,保持结构
			this.insertCloseInst(tlist)
		}

		let talkNpcId = tonumber(GetStringSplitBySchool(box_info.NpcIds, GetHeroProperty("school"), 12))
		talkNpcId = TaskSystem.getInstance().getCommitTaskNpc(talkNpcId, taskId)
		this.adjustDialogBox(tlist, this.on_option_btn_click, box_info.Content, talkNpcId, OptionType.normal)
	}

	getChoiceData(args) {
		//tolua.cast(args, "gui::GUIMouseEvent")
		if ( this.npcId != -1 && this.entryId != -1 ) {
			let npc = ActorManager.getInstance().getNpc(this.npcId);
			if(npc == null){
				let npcRef = ActorManager.getInstance().getNpcRefWithEntryId(this.entryId)
				//MsgSystem.addTagTips(String.format(Localize_cns("TEAM_DIALOG_FARAWAYNPC"), npcRef.name))
				return [true, 0, 0, 0]
			}
		}

		// let data = this.jumpData[this.curIndex][tostring(args.window)]
		//TLog.Debug("33333333333333333333333", args.window.GetName())
		let data = args; 
		let taskId = data[0]
		let nodeId = data[1]
		let index = checkNull(data[2], 1)//功能按钮的跳转，以NextNode1跳转
		let npcId = data["npcId"]

		return [true, taskId, nodeId, index, npcId]
	}

	//点击选项回调
	on_func_list_click(args) {
		let [flag, taskId, nodeId, index] = this.getChoiceData(args)
		if (!flag) {
			return
		}
		//modify:movie
		// if (StateManager.getInstance().GetCurrentStateType() == state_type.LIVE_STORY_STATE) {
		// 	MovieSystem.getInstance().endPlay()
		// }

		if (taskId == 0 && nodeId == 0) {
			this.recive_npc_talk(taskId, 0)	//关闭
			return
		}


		if (nodeId == DIALOG_FUNCTION_NODEID) {
			this.onHandleClickEvent(taskId, nodeId, index)
			return
		}

		this.recive_npc_talk(taskId, nodeId)
	}

	//点击选项回调
	on_option_btn_click(args) {

		let [flag, taskId, nodeId, index] = this.getChoiceData(args)
		//TLog.Debug("on_option_btn_click", flag, taskId, nodeId)
		if (!flag) {
			return
		}

		//modify:movie
		// if (StateManager.getInstance().GetCurrentStateType() == state_type.LIVE_STORY_STATE) {
		// 	MovieSystem.getInstance().endPlay()
		// }
		if (taskId == 0 && nodeId == 0) {
			this.recive_npc_talk(taskId, 0)
			return
		}

		//TLog.Debug("1")
		//执行当前对话点指令
		//TLog.Debug("on_option_btn_click taskId:%d, nodeId:%d index:%d", taskId, nodeId, index)


		this.onShowTimer()
		if (this.saveDate.showTimer == null) {
			this.saveDate.showTimer = SetTimer(this.onShowTimer, this, 1)
			this.saveDate.taskId = taskId
			this.saveDate.nodeId = nodeId
			this.saveDate.index = index
		}
	}
	onShowTimer(dt?) {
		if (this.saveDate.showTimer) {
			KillTimer(this.saveDate.showTimer)
			this.saveDate.showTimer = null
			let taskId = this.saveDate.taskId
			let nodeId = this.saveDate.nodeId
			let index = this.saveDate.index
			this.onHandleClickEvent(taskId, nodeId, index)
			this.saveDate = {}
		}
	}
	// onClickDialog(args) {
	// 	//TLog.Debug(" TaskDialogue.onClickDialog: size of this.jumpData:%d", this.jumpData.length)

	// 	let [flag, taskId, nodeId, index, npcId] = this.getChoiceData(args)
	// 	if (!flag) {
	// 		return
	// 	}
	// 	if (taskId == 0 && nodeId == 0) {
	// 		this.recive_npc_talk(taskId, 0)
	// 		return
	// 	}

	// 	this.npcId = npcId || this.npcId

	// 	this.onHandleClickEvent(taskId, nodeId, index)
	// }


	onHandleClickEvent(taskId, nodeId, index) {
		this.executeDialogOp(taskId, nodeId, index)
		let go = this.getJumpTalkNode(taskId, nodeId, index)
		return this.recive_npc_talk(taskId, go)
	}

	// changeDialogFrame(index) {
	// 	this.curIndex = index

	// 	//if(index % 2 == 0 ){									//剧情对话的两种模式选择2为上空白下黑、4为上限均由黑边
	// 	//	this.dialogueFrame[this.curIndex]:setAppearState(index)
	// 	//}
	// 	this.curWindow = this.dialogueFrame[this.curIndex]
	// 	//FireEvent(EventDefine.TASK_DIALOG_TRANSFORM, TaskDialogEvent.newObj(this.curIndex))
	// }

	adjustDialogBox(list, functionRef, content, entryId, flag) {
		
		//this.flag = flag
		if (!entryId || entryId == "") {
			let npc = ActorManager.getInstance().getNpc(this.npcId)
			if (npc) {
				entryId = npc.getProperty("entryId")
			} else {
				entryId = this.entryId
			}
		}

		//更新NPC名字
		//this.optionList = []

		//调用TaskDialogFrame.updateDialog
		//FireEvent(EventDefine.TASK_DIALOG_TRANSFORM, TaskDialogEvent.newObj(this.curIndex))
		
		this.curWindow.updateDialog(entryId, content, list , this.npcId, functionRef, this)

		// if (size_t(this.optionList) != 0) {
		// 	if (entryId) {
		// 		TLog.Debug(String.format("TaskOptionActive +The npcEntryId is : %d, opType: %d, talkId: %d, nodeId: %d", entryId, flag, list[0].args[0], list[0].args[0]))
		// 	}

		// 	FireEvent(EventDefine.TASK_OPTION_ACTIVE, TaskOptionEvent.newObj(this.optionList, this.entryId, [ this.flag, list[0].args[0], list[0].args[0] ]))   //选项列表，npcEntryId，{选项组类型，talkId，nodeId}
		// }
		
	}

	// addOption(opBtn, index, oArgs) {
	// 	if (this.flag == OptionType.normal) {
	// 		opBtn.index = index
	// 	} else {
	// 		opBtn.index = oArgs
	// 	}

	// 	JsUtil.arrayInstert(this.optionList, opBtn)
	// }

	// resetData() {
	// 	//this.curWindow = null
	// 	//this.curIndex = 10
	// 	this.jumpData = null
	// }


	// setJumpData(args) {
	// 	this.jumpData = args;
	// }

	insertCloseInst(list) {
		let t: any = {}
		t.args = [ 0, 0]
		t.title = Localize_cns("TASK_DIALOG_GUANBI")

		JsUtil.arrayInstert(list, t)
	}
}

