/*
作者:
    yangguiming
	
创建时间：
   2013.6.29(周六)

意图：
   任务执行器，对TaskExecutor_XXXXHandler的统一管理

公共接口：

	executeNpcDialogOp( op, npcId, talkId, nodeId, param){//执行对话框操作
	executeGetReplaceWord( name, param){	//获取被替代的字符串,param可能是taskId，可能是0，针对不同的替换字
	////////////////////////////////////////////////////////////////////////////	
	//任务追踪，返回xml
	getTraceListener( func, this_index, userData){//回调的管理器
	TaskExecutor.executeTraceTask = fucntion(this, taskId, listener)//任务跟踪
	executeTracePrize( taskId, listener){//任务奖励
	////////////////////////////////////////////////////////////////////////////	
	//任务超链接响应
  genTalkNpcLink( mapId, x, y, npcId){
	genStopLink( mapId, x, y, npcId){
	genAutoRunLink( mapId, x, y){
	genFarWayStopLink( mapId, x, y){
	
	executeLink( linkStr){
*/


class TaskExecutor extends TClass {
	interiorHandler: any;
	specialHandleReCall: any;
	public initObj(...args: any[]): void {
		// this.schoolXunLuo = null
		this.interiorHandler = {}

		//RegisterEvent(EventDefine.HERO_ENTER_MAP, this.onEntryMap, this)
		RegisterEvent(EventDefine.TASK_FINISH, this.onTaskFinish, this)
	}

	destory() {

	}

	////////////////////////////////////////////////////////////////////////////
	executeNpcDialogOp(op, npcId, talkId, nodeId, param) {
		this._executeNpcDialogOp(op, npcId, talkId, nodeId, param)
	}

	////////////////////////////////////////////////////////////////////////////
	executeGetReplaceWord(word, param) {
		return this._executeGetReplaceWord(word, param)
	}

	////////////////////////////////////////////////////////////////////////////
	getTraceListener(func, this_index, userData) {
		let listener: any = {}
		listener.func = func
		listener.this_index = this_index
		listener.userData = userData
		return listener
	}

	executeTraceTask(taskId, listener) {
		if (listener == null) {
			return false
		}

		if (listener.func == null) {
			return false
		}

		return this._excuteTaskTrace(taskId, listener)
	}


	executeTracePrize(taskId, listener) {
		if (listener == null) {
			return
		}

		if (listener.func == null) {
			return
		}
		this._executeTracePrize(taskId, listener)

	}

	////////////////////////////////////////////////////////////////////////////
	//NPC谈话
	genTalkNpcLink(npcEntryId, taskId) {
		TLog.Debug("GenTalkNpcLink", npcEntryId, taskId)
		return String.format("%d;{%d,%d}", TaskLinkType.NPC_TALK, npcEntryId, taskId)//"1;{40000,41000}"
	}

	//站直
	//genStopLink( mapId, x, y, npcId){
	//	return String.format("%d;%d;%s(%d;%d)", mapId, TaskLinkType.STOP, "Stop", x, y)//"10007;4;Stop(60;60)"
	//}

	//自动遇怪
	genAutoRunLink(mapId, x, y) {
		return String.format("%d;{%d,%d,%d}", TaskLinkType.XUNLUO, mapId, x, y)//"5;{50000,120,20}"
	}

	//指定像素停止NPC
	//genFarWayStopLink( mapId, x, y){
	//	return String.format("%d;%d;%s(%d;%d)", mapId, TaskLinkType.FARWAY_STOP, "FarWayStop", x, y)//"10007;4;FarWayStop(60;60)"
	//}

	//设定内部回调索引

	getInteriorHandler(taskId, func, param) {
		this.interiorHandler[taskId] = [func, param ]

		return String.format("%d;%d", TaskLinkType.EXECUTE_OPERATE, taskId)
	}

	////////////////////////////////////////////////////////////////////////////////
	executeLink(linkStr: string) {
		TLog.Debug("TaskExecutor.executeLink %s", linkStr)

		let endPos = linkStr.indexOf(";")
		//let _, endPos = string.find(linkStr, ";")
		if (endPos == -1) {
			return
		}


		let type = tonumber(linkStr.substring(0, endPos));
		let param = linkStr.substring(endPos + 1);
		let scope = NPCTALK_MIN_SCOPE //寻路距离

		if (type == TaskLinkType.NPC_TALK) {
			let [entryId, taskId] = StringUtil.stringMatch(param, /{(.+),(.+)}/)
			//自动寻路与npc对话
			//let entryId, taskId = string.match(param, "{(.+),(.+)}")
			entryId = tonumber(GetStringSplitBySchool(entryId))
			taskId = tonumber(taskId)

			Task_ShowNpcDialogWithEntry(entryId)

			// let [name, mapId, cellX, cellY] = TaskSystem.getInstance().getDynamicNpcName(taskId, entryId)
			// //Command_FindWayToTalkNpc(mapId, cellX, cellY, scope, entryId, null, {AutoActionType.FINDWAY_TASK, "(" +GameConfig.MapConfig[mapId].mapName +":" +name +")", taskId})
			// let [defaultCellX, defaultCellY] = [cellX - 10, cellY - 10]

			// let targetPos = MapSystem.getInstance().getMapEnterCellXY(mapId, defaultCellX, defaultCellY)

			// Command_JumpMapToTalkNpc(mapId, targetPos.x, targetPos.y, cellX, cellY, scope, entryId, opCodes.C2G_TASK_GUIDE_JUMP, [AutoActionType.FINDWAY_TASK, "(" + GameConfig.MapConfig[mapId].mapName + ":" + name + ")", taskId])
		} else if (type == TaskLinkType.GOTO_POSITION) {													//自动寻路到某地点
			if(CheckHeroCanGo() == false ){
				return
			}
			let [mapId, cellX, cellY, taskId] = StringUtil.stringMatch(param, /{(.+),(.+),(.+),(.+)}/)

			mapId = tonumber(GetStringSplitBySchool(mapId))
			cellX = tonumber(GetStringSplitBySchool(cellX))
			cellY = tonumber(GetStringSplitBySchool(cellY))
			taskId = tonumber(taskId)

			Command_FindWayToGo(mapId, cellX, cellY, 0, [AutoActionType.FINDWAY_TASK, "(" + GameConfig.MapConfig[mapId].mapName + ":" + cellX + "," + cellY + ")", taskId])
		} else if (type == TaskLinkType.FIND_NPC) {																//自动寻路到npc
			let [entryId, taskId] = StringUtil.stringMatch(param, /{(.+),(.+)}/)
			entryId = tonumber(GetStringSplitBySchool(entryId))
			taskId = tonumber(taskId)
			Task_ShowNpcDialogWithEntry(entryId)

			// let name, mapId, cellX, cellY = TaskSystem.getInstance().getDynamicNpcName(taskId, entryId)
			// Command_FindWayToGo(mapId, cellX, cellY, scope, [AutoActionType.FINDWAY_NORMAL, "(" + GameConfig.MapConfig[mapId].mapName + ":" + name + ")", taskId])
		} else if (type == TaskLinkType.JUMP_RUN_TALK) {													//跳转地图后寻npc对话
			let [entryId, targetCellX, targetCellY, taskId] = StringUtil.stringMatch(param, /{(.+),(.+),(.+),(.+)}/)
			entryId = tonumber(GetStringSplitBySchool(entryId))
			targetCellX = tonumber(GetStringSplitBySchool(targetCellX))
			targetCellY = tonumber(GetStringSplitBySchool(targetCellY))
			taskId = tonumber(taskId)

			Task_ShowNpcDialogWithEntry(entryId)

			// let name, mapId, cellX, cellY = TaskSystem.getInstance().getDynamicNpcName(taskId, entryId)
			// Command_JumpMapToTalkNpc(mapId, targetCellX, targetCellY, cellX, cellY, scope, entryId, opCodes.C2G_TASK_GUIDE_JUMP, [AutoActionType.FINDWAY_TASK, "(" + GameConfig.MapConfig[mapId].mapName + ":" + name + ")", taskId])
		} else if (type == TaskLinkType.XUNLUO) {																	//自动遇敌，巡逻
			if(CheckHeroCanGo() == false ){
				return
			}
			
			let [mapId_, cellX_, cellY_] = StringUtil.stringMatch(param, /{(.+),(.+),(.+)}/)
			let mapId = tonumber(GetStringSplitBySchool(mapId_))
			let cellX = tonumber(GetStringSplitBySchool(cellX_))
			let cellY = tonumber(GetStringSplitBySchool(cellY_))

			if (mapId == 0 && cellX == 0 && cellY == 0) {
				let heroPos = GetHero().getCellXY()
				cellX = heroPos.x, cellY = heroPos.y
				mapId = MapSystem.getInstance().getMapId()
			}

			//Command_FindWayToAutoFight(mapId, cellX, cellY, scope)
		} else if (type == TaskLinkType.ITEM_TIPS) {															//打开物品提示框
			let entryId = tonumber(param)

			let item = ItemSystem.getInstance().getItemLogicInfoByEntry(entryId, storeOptions.PACKET)

			if (!item) {
				//-模拟一个物品的数据
				//item = {}
				let propertyInfo: any = {}
				propertyInfo.entry = entryId
				propertyInfo.count = 1

				propertyInfo.equip_quality = opEquipQuality.White
				item = Item.newObj(propertyInfo)
			}

			let dataList: any = { ["logicItem"]: item, ["petInfo"]: null, ["source"]: "shop", ["spaceX"]: 0, ["spaceY"]: 0, }
			ItemSystem.getInstance().showItemHint(dataList)
		} else if (type == TaskLinkType.PET_TIPS) {																//打开宠物提示框
			let entryId = tonumber(param)
			let petConfig = GameConfig.PetConfig

			if (!petConfig[entryId]) {
				return
			}

			let window = WngMrg.getInstance().getWindow("PetTipsFrame")
			window.showWnd()
			window.setPet(petConfig[entryId])
		} else if (type == TaskLinkType.EXECUTE_OPERATE) {
			let taskId = tonumber(param)
			if (this.interiorHandler[taskId]) {
				let func = this.interiorHandler[taskId][0]
				let param = this.interiorHandler[taskId][1] || null
				func(param)

				
			}
		} else if (type == TaskLinkType.ADD_TIPS) {
			MsgSystem.addTagTips(Localize_cns("PLEASE_FIND_NPC_YOURSELF"))
		} else if (type == TaskLinkType.SHOW_TIPS) {
			//let channel, msgString = string.match(param, "{(.+),(.+)}")
			let [channel, msgString] = StringUtil.stringMatch(param, /{(.+),(.+)}/)
			channel = tonumber(channel) || 2

			if (msgString != null && msgString != "") {
				return MsgSystem.selectShowHandle(channel, msgString)
			}
		}
	}

	//////////////////////////////////////////////////////////////////////////////////////////////
	// setSchoolXunLuoState( linkStr){
	// 	let schoolXunLuo = this.schoolXunLuo
	// 	this.schoolXunLuo = linkStr

	// 	if(schoolXunLuo != linkStr ){
	// 		FireEvent(EventDefine.GUIDE_ACTIVATE_BUTTON, TaskGuideEvent.newObj(linkStr))
	// 	}
	// }

	// getSchoolXunLuoState(){
	// 	return this.schoolXunLuo
	// }

	// onEntryMap(){
	// 	if(! this.schoolXunLuo ){
	// 		return
	// 	}

	// 	let mapId = tonumber(string.match(this.schoolXunLuo, "(%d);"))
	// 	if(MapSystem.getInstance().getMapId() == mapId ){
	// 		this.setSchoolXunLuoState(null)
	// 	}
	// }

	onTaskFinish(args) {
		if (this.interiorHandler[args.taskId]) {
			delete this.interiorHandler[args.taskId]
		}
	}





	_executeGetReplaceWord(word, param) {     //格式：关键词;{arg1,[,arg2]}_taskId
		if (word == null) {
			TLog.Error("TaskExecutor._executeGetReplaceWord word == null")
			return "null"
		}

		let [keyword, argStr] = StringUtil.stringMatch(word, /(.+);(.+)/)

		//let keyword, argStr = string.match(word, "(.+);(.+)")
		let taskId = tonumber(checkNull(StringUtil.stringMatch(argStr || "", /_(\d+)$/), [])[0]) || 0

		if (taskId != 0 && !TaskSystem.getInstance().isTaskExsit(taskId)) {
			TLog.Error("TaskExecutor._executeGetReplaceWord the taskId:%s ! exsit", tostring(taskId))
			return word
		}

		for (let key in TaskReplaceWordSpace.TaskReplaceWordHandler) {
			let funcRef = TaskReplaceWordSpace.TaskReplaceWordHandler[key]

			if (key == keyword) {
				return funcRef.call(this, word, taskId, argStr, param)
			}
		}

		TLog.Error("TaskExecutor._executeGetReplaceWord word:%s ! exsit", tostring(word))
		return word
	}




	_executeTracePrize(taskId, listener) {
		let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
		if (!taskInfo) { return }
		if (!taskInfo.prize) { return }//没有奖励

		//物品、金币、经验
		let buf: any = {}
		buf.xml = ""
		buf.isXml = true
		let str = ""
		if (taskInfo.prize["ITEM"] || taskInfo.prize["BINDITEM"]) {
			let param = taskInfo.prize["ITEM"] || taskInfo.prize["BINDITEM"]
			//只显示第一个物品
			let info = param[0]
			let entryId = info[0]
			let num = info[1]

			buf.xml = "#ublack_ul|6;" + entryId + "|" + ItemSystem.getInstance().getItemName(entryId)
			if (num > 1) {
				buf.xml = buf.xml + "#ublack x" + num
			}

			buf.xml = buf.xml + "#space"
		}

		if (taskInfo.prize["FUNDS"]) {
			let param = taskInfo.prize["FUNDS"]
			buf.xml = buf.xml + "#PRIZE_JINBI#ublack" + param + "#space"
		}

		if (taskInfo.prize["PLREXP"]) {
			let param = taskInfo.prize["PLREXP"]
			buf.xml = buf.xml + "#PRIZE_JINBI#ublack" + param
		}
		listener.func(listener.this_index, buf, listener.userData)
	}


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	_excuteTaskTrace(taskId, listener) {
		if (GameConfig.TaskConfig[taskId] == null) {
			//throw()
			TLog.Error("TaskExecutor._excuteTaskTrace  TaskConfig[taskId] == null")
			return false
		}


		if (!this.specialHandleReCall) { //特殊处理上交物品类，同时显示交任务目标
			this.specialHandleReCall = {}
			this.specialHandleReCall["finish"] = {//[taskField.FIELD_FINISH_COLLECTITEM]:true, 
				//[taskField.FIELD_FINISH_COLLECTPET]:true,
				//[taskField.FIELD_FINISH_ARRIVE_POINT]:true,
				//[taskField.FIELD_FINISH_FIGHTWIN]:true,
				["FEIXINGQ_QUESTION"]: true,						//不执行完成回调
				["QUESTION"]: true,
			}
			this.specialHandleReCall["init"] = { [taskField.FIELD_INIT_NOT_TIME_OUT]: true }
		}

		let task = TaskSystem.getInstance().getTask(taskId)
		if (!task) {
			return false
		}
		let taskInfo = task.getPropertyInfo()


		let traceHandle = TaskTraceSpace.TaskTrackHandler;

		for (let k in this.specialHandleReCall["finish"]) {
			let v = this.specialHandleReCall["finish"][k]

			if (taskInfo.finish[k]) {
				for (let deal_index in taskInfo.finish) {
					let _ = taskInfo.finish[deal_index]

					let handleFunc:Function = traceHandle[deal_index];
					if (handleFunc) {
						return handleFunc.call(this, taskId, listener) || false
					}
				}
				return false
			}
		}

		if (TaskChecker.getInstance().checkFinish(taskId)) {//如果完成了任务，显示交任务的NPC
			return TaskTraceSpace.finishReCall(taskId, listener) || false
		}

		task = TaskSystem.getInstance().getTask(taskId)
		taskInfo = task.getPropertyInfo()
		let flag = false

		if (taskInfo.finish) {
			for (let deal_index in taskInfo.finish) {
				let _ = taskInfo.finish[deal_index]

				let handleFunc:Function = traceHandle[deal_index];
				if (handleFunc) {
					flag = flag || handleFunc.call(this, taskId, listener)
				}
			}

			if (taskInfo.init && taskInfo.init[taskField.FIELD_INIT_TIME]) { //限时
				let handleFunc:Function = traceHandle[taskField.FIELD_INIT_TIME];
				flag = flag || handleFunc.call(this, taskId, listener)
			}

		}

		return flag
	}


	
	_executeNpcDialogOp( opStr, npcId, talkId, nodeId, param){
		let [flag, op] = TaskSystem.getInstance().getTaskOpFromStr(TaskKeyType.DIALOGOP, opStr)
		if(! flag ){
			return
		}
		
		//if(op <= DialogOpDefine.FILED_TASK_WITHOUTNPC_BEGIN || op >= DialogOpDefine.FILED_TASK_WITHOUTNPC_END ){
		//	let npc = ActorManager.getInstance().getNpc(npcId)
		//	if(npc == null ){
		//		TLog.Warn("TaskExecutor._executeNpcDialogOp npcID:%d ! exsit", npcId)
		//		//return 
		//	}
		//}
		
		//
		let functionRef = TaskDialogOpSpace.DialogOpHandler[op]
		if(functionRef ){
			functionRef.call(this, npcId, talkId, nodeId, param)
		}else{
			TLog.Error("TaskExecutor._executeNpcDialogOp op:%d ! exsit, %s", op, opStr)
		}
		
	}
}