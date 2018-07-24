/*
作者:
    yangguiming
	
创建时间：
   2013.6.24(周一)

意图：
   任务系统

公共接口：



	//TaskStatus = //按优先级排序，数值越大，约优先表现
	//{
	//	NONE 			: -1,	//木有
	//	UNFINISH	: 1, 	//未完成
	//	NPC_FIND	: 2,	//寻找NPC所需	
	//	ACCPET		: 3,	//可接
	//	FINISH		: 4,	//完成
	//}
	//返回当前NPC任务状态
	getNpcTaskStatus( npcEntryId){
	getEssentialResList( taskId, resType){					//resType("item"/"pet")   返回所需资源列表（可能为空）：{[entryId] : count, [entryId] : count}
  getDynamicNpcName( taskId, entryId){
*/

class TaskSystem extends BaseSystem {

	TaskList: any;
	TimeId: any;

	finishTaskList: number[];
	taskNpcInfoList: any[];
	taskNpcId: number[];
	staticNpcList: number[];

	public initObj(...args: any[]): void {
		this.onClear()

		RegisterEvent(EventDefine.ACTOR_GOTFUCOS, this.onActorGotFocus, this)
		//RegisterEvent(EventDefine.ITEM_UPDATE, this.onItemListUpdate, this)
		//RegisterEvent(EventDefine.PET_LIST_UPDATE, this.onPetListUpdate, this)

		RegisterEvent(EventDefine.NPC_ENTER_MAP, this.onNpcEnterMap, this)
		RegisterEvent(EventDefine.TASK_UPDATELIST, this.onTaskListUpdate, this)
		RegisterEvent(EventDefine.HERO_LEVELUP, this.onHeroUpLevel, this)

		RegisterEvent(EventDefine.HERO_ENTER_MAP, this.onHeroEnterMap, this)
		RegisterEvent(EventDefine.NPC_LEAVE_MAP, this.onNpcLeaveMap, this)

		//RegisterEvent(EventDefine.ITEM_UPDATE, this.onItemListUpdate, this)
		//TaskListener.getInstance().init()
	}


	destory() {

	}

	prepareResource(workQueue) {
		// workQueue.addWorkUnit(createClosureWorkUnit( function(this)
		// 													TaskHeroConfig = readCSV("data\\config\\Task\\task_hero_config.csv")
		// 													NPCMask = readCSV("data\\config\\Task\\NPCMask.csv")
		// 													GoddessKissConfig = readCSV("data\\config\\Task\\GoddessKiss.csv") //女神之吻
		// 													DynamicTipsConfig = readCSV("data\\config\\Task\\auxiliary\\DynamicTips.csv")
		// 											}, this) 
		// 										)

		// this.initResource(workQueue)
		GameConfig.initTaskSystemCsv(workQueue);
	}

	onClear() {
		this.TaskList = {}
		this.TimeId = null
		this.finishTaskList = []

		this.taskNpcInfoList = []
		this.taskNpcId = []
		this.staticNpcList = []

		TaskListener.getInstance().onClear()

		//this.task_time = {}
	}


	addTask(task) {
		let taskId = task.getId()

		if (this.TaskList[taskId]) {
			TLog.Warn("TaskSystem.addTask %d alreadey exsit", taskId)
		}

		this.TaskList[taskId] = task

		this._onTaskListChange()
	}

	removeTask(taskId) {
		if (this.TaskList[taskId] == null) {
			TLog.Warn("TaskSystem.removeTask %d ! exsit", taskId)
		}

		delete this.TaskList[taskId]
		this._onTaskListChange()
	}

	updateTask(tasklist) {
		for (let _ in tasklist) {
			let task = tasklist[_]

			if (this.TaskList[task.getId()]) {
				let oldTask = this.TaskList[task.getId()]
				this.TaskList[task.getId()] = task
				FireEvent(EventDefine.TASK_UPDATE, TaskUpdateEvent.newObj(oldTask, task))
			} else {
				this.TaskList[task.getId()] = task
			}
		}

		this._onTaskListChange()
	}

	updateFinishTaskList(taskId) {
		let notRecordTaskType = [
			taskType.FactionTask,
			taskType.FactionItemTask,
			taskType.FactionPubTask,
		]

		let tType = this.getTaskType(taskId)
		if (table_isExist(notRecordTaskType, tType)) {
			return
		}

		if (!table_isExist(this.finishTaskList, taskId)) {
			JsUtil.arrayInstert(this.finishTaskList, taskId)
			//开功能
			GuideSystem.getInstance().updateHeroFunc()
		}
	}

	commitTask(npcId, taskId) {
		RpcProxy.call("C2G_TaskCommit", tonumber(taskId))
	}

	cancelTask(taskId) {
		RpcProxy.call("C2G_TaskCancel", tonumber(taskId))
	}

	////////////////////////////////////////////////////////////////////

	getTask(taskId) {
		return this.TaskList[taskId]
	}

	getTaskList() {
		return this.TaskList
	}

	getFinishTaskList() {
		return this.finishTaskList
	}

	getTaskRef(taskId) {
		return GameConfig.TaskConfig[taskId]
	}

	getTaskName(taskId) {
		let taskRef = this.getTaskRef(taskId)
		if (taskRef == null) {
			return "ErrorTask:" + tostring(taskId)
		}

		return taskRef.TaskName
	}

	getTaskType(taskId) {
		let task = this.getTask(taskId)
		if (task) {
			return task.getType()
		}

		let taskRef = this.getTaskRef(taskId)
		if (taskRef == null) {
			return -1
		}

		return taskRef.TaskType
	}

	getTaskTypeName(taskId) {
		let taskRef = this.getTaskRef(taskId)
		if (taskRef == null) {
			return "Error"
		}

		return taskRef.TaskTypeName
	}

	isTaskFailed(taskId) {
		let task = this.TaskList[taskId]
		if (task == null) {
			TLog.Error("TaskSystem.isTaskFailed taskId:%d", taskId)
			return false
		}
		return task.isFailed()
	}

	isTaskFinish(taskId) {
		let task = this.TaskList[taskId]
		if (task == null) {
			TLog.Error("TaskSystem.isTaskFinish taskId:%d", taskId)
			return false
		}
		return task.isFinish()
	}

	isTaskInTime(taskId) {
		let task = this.TaskList[taskId]
		if (task == null) {
			TLog.Error("TaskSystem.isTaskInTime taskId:%d", taskId)
			return false
		}
		return task.isInTime()
	}

	isTaskExsit(taskId) {
		return this.TaskList[taskId] != null
	}

	isTaskTypeExsit(taskType) {
		let haveTask = false
		for (let _ in this.TaskList) {
			let task = this.TaskList[_]

            let finish = task.getPropertyInfo().finish
			for (let tType in finish) {
				if (tType == taskType) {
					haveTask = true
					break
				}
			}
		}

		return haveTask
	}

	//是否有可接任务的对话
	isAccpetTaskTalk(talkId, npcEntryId) {

		let refInfo = GameConfig.TaskAcceptNpcConfig[npcEntryId]
		if (refInfo) {
			let dialogRef = GameConfig.DialogBoxConfig[talkId]
			if (dialogRef && dialogRef[DIALOG_FUNCTION_NODEID]) {
				//let talkRef = dialogRef[DIALOG_FUNCTION_NODEID]
				return TaskChecker.getInstance().checkOpList(refInfo[talkId].Accept, true)//默认显示
			}
		}

		return false

	}

	//是否任务正在寻找的NPC
	isTaskFindNpc(taskId, npcEntryId) {
		return TaskChecker.getInstance().checkFindNpc(taskId, npcEntryId)
	}

	//任务是否已完成过
	isTaskHasFinished(taskId) {
		let flag = table_isExist(this.finishTaskList, taskId)
		return flag
	}

	//检查关卡是否当前任务关卡
	// isTaskCampaign(taskId, campaignId) {
	// 	//默认为false, campaignId为空时表示完成条件为通关即返回true
	// 	let flag = false
	// 	let task = this.TaskList[taskId]

	// 	if (task) {
	// 		let taskInfo = task.getPropertyInfo()
	// 		let condition = "CAMPAIGN"
	// 		if (taskInfo.finish && taskInfo.finish[condition]) {
	// 			if (campaignId == null) {
	// 				flag = taskInfo.finish[condition]
	// 			} else if (taskInfo.finish[condition] == campaignId) {
	// 				flag = true
	// 			}
	// 		}
	// 	}

	// 	return flag
	// }
	//////////////////////////////////////////////////-
	// isTaskItemGive( taskId){
	// 	let giveType = TaskItemType.NONE

	// 	let task = this.TaskList[taskId]
	// 	if(! task ){
	// 		return false, giveType
	// 	}
	// 	let taskInfo = task.getPropertyInfo()

	// 	if(! taskInfo.finish ){
	// 		return false, giveType
	// 	}

	// 	let give = false
	// 	for(let deal_index in taskInfo.finish){
	// 			let v = taskInfo.finish[deal_index]

	// 		if(deal_index == taskField.FIELD_FINISH_COLLECTITEM ){ //检查是收集物品的
	// 			let itemId = next( v )
	// 			let itemRef = ItemSystem.getInstance().getItemTemplateInfo(itemId)
	// 			if(itemRef.type != opItemType.ITEM_TYPE_TASK ){ //不是任务物品，就可以打开界面
	// 				giveType = TaskItemType.ITEM
	// 				give = true 
	// 				break
	// 			}
	// 		}else if(deal_index == taskField.FIELD_FINISH_COLLECTPET ){ //收集宠物
	// 			giveType = TaskItemType.PET
	// 			give = true 
	// 			break
	// 		}
	// 	}

	// 	if(give ){  //检查一次任务是否完成,不完成就不打开
	// 		give = this.isTaskFinish(taskId)
	// 	}

	// 	if(giveType == TaskItemType.ITEM ){//物品
	// 		if(taskInfo.data && taskInfo.data[taskField.FIELD_FINISH_GIVE_RES] ){ //已经提交了，就不打开了
	// 			give = false
	// 		}
	// 	}else if(giveType == TaskItemType.PET ){//宠物
	// 		if(taskInfo.data && taskInfo.data[taskField.FIELD_FINISH_GIVE_PET] ){ //已经提交了，就不打开了
	// 			give = false
	// 		}
	// 	}

	// 	return give, giveType
	// }

	//是否可以放弃任务
	//////////////////////////////////////////////////////////////////////////////////////////////-
	// canGiveUp(taskId) {
	// 	let configInfo = GameConfig.TaskConfig[taskId]
	// 	if (configInfo == null) {
	// 		return false
	// 	}
	// 	if (configInfo.Cancel == null || configInfo.Cancel == 0) {
	// 		return false
	// 	} else if (configInfo.Cancel == 1) {
	// 		return true
	// 	}

	// 	return false
	// }
	//////////////////////////////////////////////////////////////////////////////////////////////-
	_onTaskListChange() {
		//1.检查物品、宠物数量。因为服务器不主动通知
		TaskChecker.getInstance().checkSubTaskUpdate(TASK_CHECK_ALL_SUBTASK, true)

		//2.检查定时器
		// let shouldTimer = false
		// for(let taskId in this.TaskList){
		// 		let task = this.TaskList[taskId]

		// 	let taskInfo = task.getPropertyInfo()
		// 	if(taskInfo.init && taskInfo.init[taskField.FIELD_INIT_TIME] ){ //有倒计时任务
		// 		shouldTimer = true
		// 		break;
		// 	}
		// }

		// if(shouldTimer ){
		// 	if(this.TimeId == null ){
		// 		this.TimeId = SetTimer(this.OnVpTickEvent, this, 1000)
		// 	}
		// }else{	
		// 	if(this.TimeId ){
		// 		KillTimer(this.TimeId)
		// 		this.TimeId = null
		// 	}
		// }

		FireEvent(EventDefine.TASK_UPDATELIST, null)
	}

	// OnVpTickEvent( delay){

	// 	let refresh_trace = false
	// 	for(let taskId in this.TaskList){
	// 			let task = this.TaskList[taskId]

	// 		let taskInfo = task.getPropertyInfo()

	// 		if(taskInfo.init && taskInfo.init[taskField.FIELD_INIT_TIME] ){ //有倒计时任务
	// 			refresh_trace = true
	// 			let fail = false

	// 			if(task.isFailed() ){
	// 				refresh_trace = false
	// 				fail = true
	// 			}

	// 			this.task_time[taskId] = this.task_time[taskId] || {}

	// 			if(! task.isInTime() ){
	// 				refresh_trace = false
	// 				if(! this.task_time[taskId]["pass_time"] ){  //fist_time存在，说明任务过时是发生在上一次登录游戏的时候，不执行
	// 					this.task_time[taskId]["pass_time"] = true
	// 					//TaskListenSystem.OnPassTimeTask(taskId)
	// 					FireEvent(EventDefine.TASK_OVERTIME, TaskEvent.newObj(taskId))
	// 					refresh_trace = true
	// 				}
	// 			}

	// 			if(fail && ! this.task_time[taskId]["fail"] ){ //失败只通知一次
	// 				this.task_time[taskId]["fail"] = true
	// 				FireEvent(EventDefine.TASK_FAILED, TaskEvent.newObj(taskId))
	// 			}

	// 			if(refresh_trace ){
	// 				break
	// 			}

	// 		}
	// 	}


	// 	if(refresh_trace ){
	// 		FireEvent(EventDefine.TASK_TIMER_UPDATE, null)
	// 	}

	// }

	////////////////////////////////////////////////////////////////////////////////////////////////////////
	onActorGotFocus(args) {
		let actor = args.actor
		let clickTimes = args.times

		//点击NPC的是NPC
		if (actor.getActorType() == actor_Type.ACTOR_TYPE_NPC) {

			let npcPos = actor.getCellXY()
			let heroPos = GetHero().getCellXY()

			let entryId = actor.getProperty("entryId")
			let npcRef = GameConfig.npcConfig[entryId]
			if (npcRef == null) {
				return
			}
			let directTalk = checkNull(npcRef.directTalk, 0)
			//如果超过了谈话最大距离，则跑过去
			if (directTalk != 1 && MathUtil.checkScope(heroPos.x, heroPos.y, npcPos.x, npcPos.y, NPCTALK_MAX_SCOPE) == false) {
				if (CheckHeroCanGo()) {
					let mapId = MapSystem.getInstance().getMapId()
					Command_FindWayToTalkNpc(mapId, npcPos.x, npcPos.y, NPCTALK_MIN_SCOPE, actor.getEntryId(), actor.getId(), [AutoActionType.NULL, null, null, null])
				}
			} else {
				Task_ShowNpcDialogWithNpc(actor.getId())
			}

		}
	}

	// onItemListUpdate(args) {
	// 	//if(args.store == storeOptions.PACKET ){
	// 	let flag = TaskChecker.getInstance().checkSubTaskUpdate(taskField.FIELD_FINISH_COLLECTITEM, true)
	// 	flag = TaskChecker.getInstance().checkSubTaskUpdate(ClientTaskField.FIELD_FINISH_COLLECTITEM, true) || flag
	// 	if (flag) {
	// 		FireEvent(EventDefine.TASK_UPDATELIST, null) //有变化了，就是任务可以被更新了
	// 	}
	// 	//}
	// }


	// onPetListUpdate(args) {
	// 	if (TaskChecker.getInstance().checkSubTaskUpdate(taskField.FIELD_FINISH_COLLECTPET, true)) {
	// 		FireEvent(EventDefine.TASK_UPDATELIST, null) //有变化了，就是任务可以被更新了
	// 	}
	// }


	onNpcEnterMap(args) {
		let npc = args.actor
		let info = npc.getPropertyInfo()
		// if(info.param[opNPCOptions.TYPE] && info.param[opNPCOptions.TYPE] == opNpcType.JINGYAN_PAOPAO ){
		// 	npc.changePartColorShader("body", MathUtil.random(0,27))
		// }

		if (info.param[opNPCOptions.TIME]) {
			npc.doCommand(ActorCommand.setTimeCountDown, true, info.param[opNPCOptions.TIME])
		} else {
			//npc.doCommand(ActorCommand.setTimeCountDown, false, 0)
		}

		if (info.param[opNPCOptions.BATTLE]) {
			let visible = false
			if (info.param[opNPCOptions.BATTLE] != 0) {
				visible = true
			}
			npc.doCommand(ActorCommand.SetCombatMarkVisible, visible, true)
		}

		//npc.doCommand(ActorCommand.SetNpcHeadFrameVisible, true, null)

		//
		this.insertNewTaskNpcId(npc.getId())
	}

	onTaskListUpdate() {
		let nearByNpcList = ActorManager.getInstance().getNpcList()
		for (let id in nearByNpcList) {
			let npc = nearByNpcList[id]

			npc.doCommand(ActorCommand.SetNpcHeadFrameVisible, true, null)
		}

		//
		let list = []
		for (let taskId in this.getTaskList()) {
			let _ = this.getTaskList()[taskId]

			JsUtil.arrayInstert(list, taskId)

			if (!this.updateTaskTrace(taskId)) {
				this.removeTaskNpc(taskId)
			}
		}

		return this.onUpdateTaskNpcList(list)
	}

	onHeroUpLevel(args) {
		this.onTaskListUpdate()
	}

	// getEssentialResList(taskId, resType) {
	// 	let task = this.TaskList[taskId]
	// 	if (!task) {
	// 		return
	// 	}

	// 	let taskInfo = task.getPropertyInfo()
	// 	let resList = null
	// 	if (taskInfo.finish[taskField.FIELD_FINISH_COLLECTITEM] && resType == "item") {
	// 		resList = taskInfo.finish[taskField.FIELD_FINISH_COLLECTITEM]
	// 	} else if (taskInfo.finish[taskField.FIELD_FINISH_COLLECTPET] && resType == "pet") {
	// 		resList = taskInfo.finish[taskField.FIELD_FINISH_COLLECTPET]
	// 	} else {
	// 		return
	// 	}

	// 	return resList
	// }

	// isTaskCanShow(mainType, secType, taskId, acceptList) {
	// 	let canShow = true
	// 	if (mainType == TaskMainType.Branch) {
	// 		if (GetHeroProperty("level") < secType) {
	// 			canShow = false
	// 		} else if (table_isExist(this.finishTaskList, taskId)) {
	// 			canShow = false
	// 		}
	// 	} else {
	// 		//let flag = false
	// 		canShow = TaskChecker.getInstance().checkOpList(acceptList, false)

	// 		//for(let npcEntryId in GameConfig.TaskAcceptNpcConfig){
	// 		//	let list = GameConfig.TaskAcceptNpcConfig[npcEntryId]
	// 		//
	// 		//	for(let talkId in list){
	// 		//	let v = list[talkId]
	// 		//
	// 		//		if(v.TaskIdList[mainType] && v.TaskIdList[mainType][secType] ){
	// 		//			if(TaskChecker.getInstance().checkOpList(v.Accept, false) ){		//默认显示
	// 		//				flag = true
	// 		//				break 																												//只要有一项的条件满足即跳出（两重）循环
	// 		//			}
	// 		//		}
	// 		//	}
	// 		//	
	// 		//	if(flag ){
	// 		//		canShow = true
	// 		//		break
	// 		//	}
	// 		//}
	// 	}

	// 	return canShow
	// }

	//部下任务和修行任务
	// getSortPetTaskIdList() {
	// 	let sortList = []
	// 	let typeList = [TaskMainType.Main, TaskMainType.Finish, TaskMainType.Branch, TaskMainType.Common, TaskMainType.Drama]
	// 	let breakFlag = 0
	// 	let checkTypeList = [
	// 		taskType.Fengmo,
	// 		// taskType.Special,
	// 		// taskType.OptionTask,
	// 		// taskType.FactionTask,
	// 		// taskType.FactionItemTask,
	// 		// taskType.FactionPubTask,
	// 	]

	// 	for (let taskId in this.getTaskList()) {
	// 		let _ = this.getTaskList()[taskId]

	// 		if (table_isExist(checkTypeList, this.getTaskType(taskId))) {
	// 			if (TaskSystem.getInstance().isTaskFinish(taskId)) {
	// 				JsUtil.arrayInstert(sortList, { ["taskId"]: taskId, ["state"]: TaskStatus.FINISH })
	// 			} else {
	// 				JsUtil.arrayInstert(sortList, { ["taskId"]: taskId, ["state"]: TaskStatus.UNFINISH })
	// 			}
	// 		}
	// 	}

	// 	let this_ = this;

	// 	function sortInTime(a, b) {
	// 		let taskIdA = a.taskId
	// 		let taskIdB = b.taskId
	// 		let taskTimeA = this_.getTask(taskIdA).getTime()
	// 		let taskTimeB = this_.getTask(taskIdB).getTime()

	// 		//return taskTimeA>taskTimeB
	// 		return taskTimeB - taskTimeA
	// 	}

	// 	table_sort(sortList, sortInTime)
	// 	return sortList
	// }

	//所有任务
	// getSortAllTaskIdList() {
	// 	let sortList = []
	// 	let typeList = [TaskMainType.Main, TaskMainType.Finish, TaskMainType.Branch, TaskMainType.Common, TaskMainType.Drama]
	// 	let breakFlag = 0

	// 	for (let taskId in this.getTaskList()) {
	// 		let _ = this.getTaskList()[taskId]

	// 		if (TaskSystem.getInstance().isTaskFinish(taskId)) {
	// 			JsUtil.arrayInstert(sortList, { ["taskId"]: taskId, ["state"]: TaskStatus.FINISH })
	// 		} else {
	// 			JsUtil.arrayInstert(sortList, { ["taskId"]: taskId, ["state"]: TaskStatus.UNFINISH })
	// 		}
	// 	}

	// 	let this_ = this;
	// 	function sortInTime(a, b) {
	// 		let taskIdA = a.taskId
	// 		let taskIdB = b.taskId
	// 		let taskTimeA = this_.getTask(taskIdA).getTime()
	// 		let taskTimeB = this_.getTask(taskIdB).getTime()
	// 		return taskTimeB - taskTimeA
	// 	}

	// 	table_sort(sortList, sortInTime)
	// 	return sortList
	// }

	//非部下任务、非修行任务
	getSortTaskIdList() {
		let sortList: any = []
		let typeList: any = [TaskMainType.Main, TaskMainType.Finish, TaskMainType.Branch, TaskMainType.Common, TaskMainType.Drama]
		let breakFlag = 0
		let checkTypeList: any = [
			taskType.Fengmo,
			//taskType.Special,
			//taskType.OptionTask,
			//taskType.FactionTask,
			//taskType.FactionItemTask,
			//taskType.FactionPubTask,
		]

		for (let taskId_ in this.TaskList) {
			let taskId = tonumber(taskId_)
			let _ = this.TaskList[taskId]

			if (!table_isExist(checkTypeList, this.getTaskType(taskId))) {
				if (TaskSystem.getInstance().isTaskFinish(taskId)) {
					JsUtil.arrayInstert(sortList, { ["taskId"]: taskId, ["state"]: TaskStatus.FINISH })
				} else {
					JsUtil.arrayInstert(sortList, { ["taskId"]: taskId, ["state"]: TaskStatus.UNFINISH })
				}
			}
		}

		let this_ = this;

		function sortInTime(a, b) {
			let taskIdA = a.taskId
			let taskIdB = b.taskId
			let taskTimeA = this_.getTask(taskIdA).getTime()
			let taskTimeB = this_.getTask(taskIdB).getTime()
			return taskTimeB - taskTimeA
		}

		table_sort(sortList, sortInTime)
		return sortList
	}

	getDynamicNpcName(taskId, entryId) {
		let npcRef = ActorManager.getInstance().getNpcRefWithEntryId(entryId)

		let name = npcRef.name || ""
		let mapId = npcRef.map
		let cellX = npcRef.x, cellY = npcRef.y

		if (taskId && this.isTaskExsit(taskId)) {
			let taskInfo = this.getTask(taskId).getPropertyInfo()
			if (taskInfo.data && taskInfo.data["INIT_FACTION_NPC"]) { //动态NPC
				let initData = taskInfo.data["INIT_FACTION_NPC"][entryId]
				if (initData && initData[0]) {
					//name = initData[7]
					mapId = initData[0]
					cellX = initData[1], cellY = initData[2]
				}
			}
		}

		return [name, mapId, cellX, cellY]
	}


	getOpTalkList(npcEntryId) {
		//1.获取NPC对话节点
		let npcRef = ActorManager.getInstance().getNpcRefWithEntryId(npcEntryId)

		//检查谈话节点是不是可以显示的
		let talkOpList: any = {}
		let markList = []
		if (!npcRef) {
			TLog.Debug("NpcHeadFrame.getOpTalkList: ){ npcRef is ! exist!, npc:%d", npcEntryId)
			return [talkOpList, markList]
		}
		for (let _ = 0; _ < npcRef.talkOpList.length; _++) {
			let talkId = npcRef.talkOpList[_]

			let dialogRef = GameConfig.DialogBoxConfig[talkId]
			//TLog.Debug("npcRef.talkOpList",talkId,  dialogRef, dialogRef[DIALOG_FUNCTION_NODEID])
			if (dialogRef && dialogRef[DIALOG_FUNCTION_NODEID]) {
				let talkRef = dialogRef[DIALOG_FUNCTION_NODEID]
				let ret = TaskChecker.getInstance().checkOpList(talkRef.Show, true) //如果可以显示，显示
				if (ret && talkRef.funcType && talkRef.funcType != 0) {
					talkOpList[talkRef.funcType] = talkId
					JsUtil.arrayInstert(markList, talkRef.funcType)

					if (GameConfig.TaskAcceptNpcConfig[npcEntryId]) {
						if (!this.isAccpetTaskTalk(talkId, npcEntryId)) {
							delete talkOpList[talkRef.funcType]
							JsUtil.arrayRemove(markList)
						}
					}
				}
			}
		}
		table_sort(markList)
		return [talkOpList, markList]
	}

	getTaskTalkList(npcEntryId) {
		let taskList = this.getTaskList()

		let statusList = []
		let talkList = []
		let loop = 0

		//检查此NPC和身上的任务有没对话
		for (let k in taskList) {
			let v = taskList[k]

			//TLog.Debug("taskId:", k, "DialogConfig:", GameConfig.DialogBoxConfig[k])
			let dialogRef = GameConfig.DialogBoxConfig[k]
			let taskRef = GameConfig.TaskConfig[k]

			if (dialogRef && taskRef) {
				for (let s in dialogRef) {
					let t = dialogRef[s]

					loop = loop + 1
					// let talkNpcId = tonumber(GetStringSplitBySchool(t.NpcIds)) //当前谈话NPC
					// let taskNpcId = tonumber(GetStringSplitBySchool(taskRef.NpcIds))//当前是领取任务的NPC
					let talkNpcId = tonumber(t.NpcIds) //当前谈话NPC
					let taskNpcId = tonumber(taskRef.NpcIds)//当前是领取任务的NPC
					let taskInfo = v.getPropertyInfo()

					if (taskInfo.data["COMMIT_NPC"] && taskInfo.data["COMMIT_NPC"] == npcEntryId) {
						talkNpcId = npcEntryId
						taskNpcId = npcEntryId
					}

					if (talkNpcId == npcEntryId && taskNpcId == npcEntryId) {
						if (!table_isExist(talkList, k)) {
							JsUtil.arrayInstert(talkList, k)

							let status = this.isTaskFinish(k) && TaskStatus.FINISH || TaskStatus.UNFINISH
							table_insert(statusList, status) //NPC寻找
						}
					}

				}
			}
		}

		//检查此NPC是不是任务所需的NPC
		for (let taskId in taskList) {
			let _ = taskList[taskId]

			if (this.isTaskFindNpc(taskId, npcEntryId)) {
				if (!table_isExist(talkList, taskId)) {
					table_insert(talkList, taskId)
					table_insert(statusList, TaskStatus.NPC_FIND) //NPC寻找
				}
			}
		}

		return [talkList, statusList]
	}

	getCommitTaskNpc(npcId, taskId) {							//动态提交任务npc
		if (npcId != DIALOG_OBJECT_COMMIT_NPC || !this.getTask(taskId)) {
			return npcId
		}

		let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
		if (taskInfo.data["COMMIT_NPC"]) {
			return tonumber(taskInfo.data["COMMIT_NPC"])
		} else {
			return null
		}
	}

	//////////////////////////////////-任务相关NPC处理//////////////////////////-
	updateTaskTrace(taskId) {
		let t: any = {}
		let listener = TaskExecutor.getInstance().getTraceListener(this.onTaskTraceListener, this, t)
		return TaskExecutor.getInstance().executeTraceTask(taskId, listener)
	}

	onTaskTraceListener(param, userData) {
		if (param.link != null && param.link != "") {
			return this.updateNpcList(param.link, param.taskId)
		}

		return false
	}

	updateNpcList(linkStr: string, taskId: number) {

		let endPos = linkStr.indexOf(";")
		let type = tonumber(linkStr.substring(0, endPos));
		let param = linkStr.substring(endPos + 1);
		// let _, endPos = string.find(linkStr, ";")
		// let type = tonumber(string.sub(linkStr, 1, endPos - 1))

		//let param = string.sub(linkStr, endPos + 1, -1)
		let scope = NPCTALK_MIN_SCOPE //寻路距离
		let entryId = 0

		if (type != TaskLinkType.NPC_TALK) {
			if (this.TaskList[taskId] && GameConfig.TaskConfig[taskId] && GameConfig.TaskConfig[taskId].NpcIds && GameConfig.TaskConfig[taskId].NpcIds != "") {
				entryId = tonumber(GameConfig.TaskConfig[taskId].NpcIds)
			} else {
				return false
			}
		} else {

			let resultList = StringUtil.stringMatch(param, /{(.+),(.+)}/);
			entryId = tonumber(resultList[0])
			taskId = tonumber(resultList[1])
		}

		if (!GameConfig.npcConfig[entryId] || !GameConfig.npcConfig[entryId].visiblecon
			|| !GameConfig.npcConfig[entryId].visiblecon.task) {

			return false
		}
		if (!table_isExist(GameConfig.npcConfig[entryId].visiblecon.task, taskId)) {
			return false
		}

		let [name, mapId, cellX, cellY] = TaskSystem.getInstance().getDynamicNpcName(taskId, entryId)
		let e = null
		for (let k in this.taskNpcInfoList) {
			let elem = this.taskNpcInfoList[k]

			if (tonumber(k) == taskId) {
				if (elem.entryId == entryId) {
					if (elem.mapId == mapId) {
						if (elem.cellX == cellX) {
							if (elem.cellY == cellY) {
								e = elem
								break
							}
						}
					}
				}
			}
		}

		if (e == null) {
			e = {
				["entryId"]: entryId,
				["mapId"]: mapId,
				["cellX"]: cellX,
				["cellY"]: cellY,
				["name"]: name,
				["uId"]: 0,
			}
			this.taskNpcInfoList[taskId] = e
		}

		if (mapId == MapSystem.getInstance().getMapId()) {
			this.createTaskNpc(e)
		}
		return true
	}

	getNewTaskNpcId() {
		let minId = IsolationCharacterId.TaskNpcBegin
		for (let i = IsolationCharacterId.TaskNpcBegin; i >= IsolationCharacterId.TaskNpcEnd; i--) {
			if (!table_isExist(this.taskNpcId, i)) {
				minId = i
				break
			}
		}
		return minId
	}

	insertNewTaskNpcId(id) {
		if (id > IsolationCharacterId.TaskNpcBegin || id < IsolationCharacterId.TaskNpcEnd) {
			return
		}

		if (!table_isExist(this.taskNpcId, id)) {
			JsUtil.arrayInstert(this.taskNpcId, id)
		}
	}

	removeTaskNpcId(id) {
		table_remove(this.taskNpcId, id)

		if (table_remove(this.staticNpcList, id)) {
			let k = null
			for (let key in this.taskNpcInfoList) {
				let elem = this.taskNpcInfoList[key]

				if (elem.uId == id) {
					k = key
					break
				}
			}

			if (k) {
				delete this.taskNpcInfoList[k]
			}
		} else {
			for (let _ in this.taskNpcInfoList) {
				let elem = this.taskNpcInfoList[_]

				if (elem.uId == id) {
					elem.uId = 0
					//return
				}
			}
		}
	}

	removeTaskNpc(taskId) {
		if (!this.taskNpcInfoList[taskId]) {
			return
		}

		let id = this.taskNpcInfoList[taskId].uId
		delete this.taskNpcInfoList[taskId]

		if (id == 0) {
			return
		}

		//this.removeTaskNpcId(id)
		//
		for (let _ in this.taskNpcInfoList) {
			let elem = this.taskNpcInfoList[_]

			if (elem.uId == id) {
				return
			}
		}

		if (!table_isExist(this.staticNpcList, id)) {
			return ActorManager.getInstance().deleteNpc(id)
		}
	}

	createTaskNpc(elem, autoSave?) {
		if (table_isExist(this.taskNpcId, elem.uId)) {
			return
		}
		//自动保存的类型已经检测过重复性了
		let [flag, id] = this.isExsitTaskNpcInfo(elem.entryId, elem.mapId, elem.cellX, elem.cellY, true)
		if (autoSave || id == 0) {
			if (elem.uId == 0) {
				elem.uId = this.getNewTaskNpcId()
			}

			let npcRef = GameConfig.npcConfig[elem.entryId]

			let npcInfo: any = {}
			npcInfo["cellx"] = elem.cellX
			npcInfo["celly"] = elem.cellY
			npcInfo["dir"] = checkNull(npcRef.o, 1)
			npcInfo["entryId"] = elem.entryId
			npcInfo["id"] = elem.uId
			npcInfo["image"] = npcRef.model
			npcInfo["name"] = elem.name
			npcInfo["param"] = {}
			npcInfo["taskInfo"] = {}

			if (autoSave) {
				JsUtil.arrayInstert(this.taskNpcInfoList, elem)
			}
			return ActorManager.getInstance().createNpc(npcInfo)
		} else if (!autoSave) {
			elem.uId = id
		}
	}

	isExsitTaskNpcInfo(entryId, mapId, cellX, cellY, checkId?) {
		let flag = false
		let id = 0

		for (let _ in this.taskNpcInfoList) {
			let elem = this.taskNpcInfoList[_]

			if (elem.entryId == entryId) {
				if (elem.mapId == mapId) {
					if (elem.cellX == cellX) {
						if (elem.cellY == cellY) {
							flag = true

							if (checkId) {
								if (elem.uId != 0) {
									id = elem.uId
									break
								}
							} else {
								break
							}
						}
					}
				}
			}
		}

		//table_TLog.Debug(this.taskNpcInfoList)
		return [flag, id]
	}

	onHeroEnterMap(args) {
		for (let _ in this.taskNpcInfoList) {
			let elem = this.taskNpcInfoList[_]

			if (elem.mapId == MapSystem.getInstance().getMapId()) {
				this.createTaskNpc(elem)
			}
		}

		return this.refreshLocalNpc()
	}

	onNpcLeaveMap(args) {
		let id = args.actor.getId()

		//TLog.Debug("4444444444444444", args.actor.getProperty("entryId"))
		return this.removeTaskNpcId(id)
	}

	onUpdateTaskNpcList(list) {
		let tempList = table_copy(this.taskNpcInfoList)

		for (let taskId in tempList) {
			let elem = tempList[taskId]

			if (!table_remove(list, taskId)) {
				this.removeTaskNpc(taskId)
			}
		}
	}

	refreshLocalNpc() {
		//this.staticNpcList = {}
		let mapId = MapSystem.getInstance().getMapId()
		if (!mapId || mapId == 0) {
			return
		}

		for (let _ in GameConfig.npcConfig) {
			let npcRef = GameConfig.npcConfig[_]

			//if(mapId == npcRef.map && npcRef.clientCreate != -1 ){
			if (mapId == npcRef.map) {
				//if(mapId == npcRef.map ){
				if (npcRef.visible == 0) {//1表示该NPC由服务器创建

					if (npcRef.visiblecon && npcRef.visiblecon.showTime) {
						let timeStr = splitString(npcRef.visiblecon.showTime, "~")
						let showTime = StringUtil.getTimeFromString(timeStr[0])
						let endTime = StringUtil.getTimeFromString(timeStr[1])

						let curTime = GetServerTime()
						if (curTime >= showTime && curTime < endTime) {
							let t: any = {}
							t.entryId = npcRef.id
							t.mapId = npcRef.map
							t.cellX = npcRef.x
							t.cellY = npcRef.y
							t.name = npcRef.name
							t.uId = 0
							//TLog.Debug("22222222222222222", t.name)
							this.createTaskNpc(t, true)

							if (t.uId != 0) {
								JsUtil.arrayInstert(this.staticNpcList, t.uId)
							}
						}
					} else {
						if (!npcRef.visiblecon || !npcRef.visiblecon.task) {
							let [falg, _] = this.isExsitTaskNpcInfo(npcRef.id, npcRef.map, npcRef.x, npcRef.y)
							if (!falg) {
								let t: any = {}
								t.entryId = npcRef.id
								t.mapId = npcRef.map
								t.cellX = npcRef.x
								t.cellY = npcRef.y
								t.name = npcRef.name
								t.uId = 0
								//TLog.Debug("22222222222222222", t.name)
								this.createTaskNpc(t, true)

								if (t.uId != 0) {
									JsUtil.arrayInstert(this.staticNpcList, t.uId)
								}
							}
						}
					}
				}
			}
		}
	}


	// isNpcVisible(entryId, mapId) {
	// 	let npcRef = GameConfig.npcConfig[entryId]
	// 	if (npcRef == null) {
	// 		return false
	// 	}

	// 	if (mapId == null) {
	// 		mapId = MapSystem.getInstance().getMapId()
	// 	}

	// 	//不是本地图的，或者x,y同时未0的
	// 	if (npcRef.map != mapId || (npcRef.x == 0 && npcRef.y == 0)) {
	// 		return false
	// 	}

	// 	if (npcRef.visible == 1) {				//服务器创建
	// 		return false
	// 	}


	// 	let bVisible = true

	// 	//检查任务
	// 	if (npcRef.visiblecon.task) {
	// 		let bTaskShow = false
	// 		for (let taskId in this.TaskList) {
	// 			let v: Task = this.TaskList[taskId]

	// 			if (table_isExist(npcRef.visiblecon.task, v.getId())) {
	// 				bTaskShow = true
	// 				break
	// 			}
	// 		}

	// 		bVisible = bTaskShow
	// 	}

	// 	//检查时间
	// 	if (bVisible && npcRef.visiblecon.showTime) {
	// 		let timeStr = splitString(npcRef.visiblecon.showTime, "~")
	// 		let startTime = StringUtil.getTimeFromString(timeStr[0])
	// 		let endTime = StringUtil.getTimeFromString(timeStr[1])

	// 		let curTime = GetServerTime()
	// 		if (curTime < startTime || curTime > endTime) {
	// 			bVisible = false
	// 		}
	// 	}

	// 	//检查位置
	// 	let scope = npcRef.showScope || 0
	// 	if (bVisible && scope > 0) {
	// 		let heroPos = GetHero().getCellXY()
	// 		//let npcx, npcy = npcRef.x, npcRef.y
	// 		if (MathUtil.checkNormScope(heroPos.x, heroPos.y, npcRef.x, npcRef.y, scope) == true) {
	// 			bVisible = true
	// 		} else {
	// 			bVisible = false
	// 		}
	// 	}

	// 	return bVisible
	// }




	getTaskOpFromStr(keyType, opStr) {
		if (type(opStr) != "string") {
			return [false, null]
		}
		TLog.Debug("TaskSystem.getTaskOpFromStr %s %s", keyType, opStr)
		let opKey = GameConfig.TaskKeyMapping[keyType][opStr].value

		let defineList: any = {}
		if (keyType == TaskKeyType.CHECK) {
			defineList = TaskOpDefine
		} else if (keyType == TaskKeyType.DIALOGOP) {
			defineList = DialogOpDefine
		} else if (keyType == TaskKeyType.LISTEN) {
			defineList = TaskListenDefine
		}

		let op = defineList[opKey] || null
		if (!op) {
			TLog.Debug("TaskSystem.getTaskOpFromStr the TaskKey is ! exsit:%s", opStr)
			return [false, op]
		}

		return [true, op]
	}
}