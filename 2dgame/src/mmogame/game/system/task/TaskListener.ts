/*
作者:
    liuziming
	
创建时间：
   2013.8.01(周四)

意图：
   

公共接口：
   
*/


class TaskListener extends BaseSystem {
	finishTask: any;
	failTask: any;
	overTimeTask: any;
	taskListenerList: any;

	public initObj(...args: any[]): void {
		this.finishTask = {}
		this.failTask = {}
		this.overTimeTask = {}
		this.taskListenerList = {}

		RegisterEvent(EventDefine.TASK_ACCPET, this.onRecvNewTask, this)
		RegisterEvent(EventDefine.TASK_UPDATELIST, this.onTaskListUpdate, this)
		RegisterEvent(EventDefine.TASK_FINISH, this.onTaskFinish, this)
		RegisterEvent(EventDefine.TASK_FAILED, this.onTaskFail, this)
		//RegisterEvent(EventDefine.TASK_OVERTIME, this.onTaskOverTime, this)

		RegisterEvent(EventDefine.TASK_COMMIT_FINISH, this.onCommitTaskFinished, this)
		RegisterEvent(EventDefine.TASK_COMMIT_FAILED, this.onCommitTaskFailed, this)
		RegisterEvent(EventDefine.TASK_COMMIT_CANCEL, this.onCommitTaskCanceled, this)

		RegisterEvent(EventDefine.TASK_UPDATE, this.onTaskUpdate, this)
		RegisterEvent(EventDefine.TASK_FIGHT_END, this.onSpecialHandler, this)
	}

	resetStatus(taskId) {
		this.finishTask[taskId] = false
		this.failTask[taskId] = false
		this.overTimeTask[taskId] = false
		this.taskListenerList[taskId] = false
	}

	onClear() {
		this.finishTask = {}
		this.failTask = {}
		this.overTimeTask = {}
		this.taskListenerList = {}
	}

	//监听新接任务事件
	onRecvNewTask(args) {  //新接
		let taskId = args.taskId
		this.taskListenerList[taskId] = true
		//this.AddTaskMoveListener(taskId)
		this.CommonCheckListenTask(taskId, TaskListenType.NEWTASK)
	}

	//监听任务更新事件
	onTaskListUpdate(args) {
		let taskList = TaskSystem.getInstance().getTaskList()
		for (let _taskId in taskList) {
			let taskId = tonumber(_taskId)
			let task = taskList[taskId]

			if (this.taskListenerList[taskId]) {
				if (task.isFinish()) {
					if (!this.finishTask[taskId]) {
						this.finishTask[taskId] = true
						FireEvent(EventDefine.TASK_FINISH, TaskEvent.newObj(taskId))
					}
				}

				if (task.isFailed()) {
					if (!this.failTask[taskId]) {
						this.failTask[taskId] = true
						FireEvent(EventDefine.TASK_FAILED, TaskEvent.newObj(taskId))
					}
				}

				if (!task.isInTime()) {
					if (!this.overTimeTask[taskId]) {
						this.overTimeTask[taskId] = true
						FireEvent(EventDefine.TASK_OVERTIME, TaskEvent.newObj(taskId))
					}
				}
			} else if (!task.isFinish() && !task.isFailed() && task.isInTime()) {
				this.taskListenerList[taskId] = true
			}

			//this.CommonCheckListenTask(taskId, TaskListenType.UPDATETASK)
		}
	}

	//监听任务完成事件
	onTaskFinish(args) {
		let taskId = args.taskId
		this.CommonCheckListenTask(taskId, TaskListenType.FINISHTASK)
	}

	//监听任务失败事件
	onTaskFail(args) {
		let taskId = args.taskId
		this.CommonCheckListenTask(taskId, TaskListenType.FAILTASK)
	}

	//任务过时处理（失败另外处理）
	onPassTimeTask(args) {
		let taskId = args.taskId
		this.CommonCheckListenTask(taskId, TaskListenType.PASSTIMETASK)
	}

	//监听任务服务器响应完成事件
	onCommitTaskFinished(args) {
		let taskId = args.taskId
		this.resetStatus(taskId)
		this.CommonCheckListenTask(taskId, TaskListenType.COMMITTASKFINISH)
	}

	//监听任务服务器响应失败事件
	onCommitTaskFailed(args) {
		let taskId = args.taskId
		this.resetStatus(taskId)
		this.CommonCheckListenTask(taskId, TaskListenType.COMMITTASKFAILED)
	}

	//监听任务服务器响应取消事件
	onCommitTaskCanceled(args) {
		let taskId = args.taskId
		this.resetStatus(taskId)
		this.CommonCheckListenTask(taskId, TaskListenType.COMMITTASKCANCEL)
	}

	//监听任务动态信息更新事件
	onTaskUpdate(args) {
		let oldTask = args.oldTask
		let newTask = args.newObjTask

		//if(newTask.isFinish() ){					//完成任务的话就不处理
		//return
		//}

		TLog.Debug("TaskListener.onTaskUpdate:taskId:%d, TaskListenType:%d~~", newTask.getId(), TaskListenType.UPDATETASK)
		this.CommonCheckListenTask(newTask.getId(), TaskListenType.UPDATETASK, oldTask.getPropertyInfo(), newTask.getPropertyInfo())
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////-
	//除了完成和走路监听外的其他监听公共函数
	CommonCheckListenTask(taskId, listen_type, oldInfo?, newInfo?) {
		let typeStr = GameConfig.TaskKeyMapping[TaskKeyType.LISTENTYPE][listen_type].value				//转中文

		TLog.Debug("TaskListener.CommonCheckListenTask the keyStr is :", typeStr, listen_type)
		if (GameConfig.TaskConfig[taskId] && GameConfig.TaskConfig[taskId].Listen && GameConfig.TaskConfig[taskId].Listen[typeStr]) {
			let newListener = GameConfig.TaskConfig[taskId].Listen[typeStr]//完成任务的监听
			for (let funcStr in newListener) {
				let param = newListener[funcStr]

				let [flag, funcIndex] = TaskSystem.getInstance().getTaskOpFromStr(TaskKeyType.LISTEN, funcStr)
				let handleFunc: Function = TaskListenSpace.TaskListenHandle[funcIndex];
				if (flag && handleFunc) {
					if (listen_type == TaskListenType.UPDATETASK) {
						handleFunc.call(this, taskId, param, oldInfo, newInfo)
					} else {
						handleFunc.call(this, taskId, param);
					}
				}
			}
			return true//有处理监听
		}
		return false //没有监听
	}



	//////////////////////////////////////////////特殊事件处理//////////////////////////////
	onSpecialHandler(args) {
		let taskId = args.taskId
		let typeStr = TaskListenType[GameConfig.TaskKeyMapping[TaskKeyType.LISTENTYPE][TaskListenType.SPECIALHANDLER].value]				//转中文

		if (GameConfig.TaskConfig[taskId] && GameConfig.TaskConfig[taskId].Listen && GameConfig.TaskConfig[taskId].Listen[typeStr]) {
			let newListener = GameConfig.TaskConfig[taskId].Listen[typeStr]//完成任务的监听
			for (let funcStr in newListener) {
				let param = newListener[funcStr]

				let [flag, funcIndex] = TaskSystem.getInstance().getTaskOpFromStr(TaskKeyType.LISTEN, funcStr)
				let handleFunc: Function = TaskListenSpace.TaskListenHandle[funcIndex];
				if (flag && handleFunc) {
					handleFunc.call( taskId, param, args)
				}
			}
		}
	}

}


module TaskListenSpace{

export let TaskListenHandle: any = {}

////-公共索引////////////////////////////////////////////////////////////////////////////////////
function executeLink(taskId, param) {
	TaskExecutor.getInstance().executeLink(param)
}
TaskListenHandle[TaskListenDefine.FIELD_COMMON_EXECUTELINK] = executeLink

function showDialogNode(taskId, param) {
	TaskDialogue.getInstance().showDramaState(param[0], param[1], param[2])
}
TaskListenHandle[TaskListenDefine.FIELD_COMMON_SHOWUP_DIALOG] = showDialogNode

//modify:movie
// function playMovie(taskId, param) {
// 	if (param == null || param == "") {
// 		return
// 	}

// 	MovieSystem.getInstance().beginPlay(param)
// }
// TaskListenHandle[TaskListenDefine.FIELD_COMMON_PLAY_MOVIE] = playMovie

function showTips(taskId, param) {
	MsgSystem.selectShowHandle(param[0], param[1])
}
TaskListenHandle[TaskListenDefine.FIELD_COMMON_SHOW_TIPS] = showTips


function showTaskTrace( taskId, param){
	let channel = checkNull(param[0] , 2)				//默认弹幕
	
	function _taskTraceListener( tparam, userData){
		let str = tparam.content
		return MsgSystem.selectShowHandle(channel, userData.title +":" +str +param[1])
	}
	
	let t:any = {}
	t.title = TaskSystem.getInstance().getTaskName(taskId)
	let listener = TaskExecutor.getInstance().getTraceListener(_taskTraceListener, this, t)
	TaskExecutor.getInstance().executeTraceTask(taskId, listener)
}
TaskListenHandle[TaskListenDefine.FIELD_COMMON_SHOW_TASKTRACE] = showTaskTrace

function acceptTypeTask(taskId, param) {
	let message = GetMessage(opCodes.C2G_TASK_APPLY)
	message.npcId = 0
	message.taskType = param
	SendGameMessage(message)
}
TaskListenHandle[TaskListenDefine.FIELD_COMMON_APPLY_TYPETASK] = acceptTypeTask

function addFightWinRecall(taskId, param) {
	//H5不自动弹关卡
	// let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// let campaignId = taskInfo.finish["CAMPAIGN"] || 0
	// if (campaignId == 0) {
	// 	return
	// }

	// function func() {
	// 	//组队时不给回调打开关卡界面权限，因为非活动类的关卡功能只能以打开关卡界面作为“活动”开始的标准，每打一场关卡自动退出关卡“活动”
	// 	if (HeroIsInTeam() == true) {
	// 		return
	// 	}

	// 	CampaignSystem.getInstance().setCurCampaign(campaignId)
	// 	let mapId = GameConfig.CampaignConfig[campaignId].mapId
	// 	WngMrg.getInstance().getWindow("CopyCardFrame").showCopyCard(mapId, null, campaignId)
	// }

	// FightSystem.getInstance().addEndFightHandler(func)
}
TaskListenHandle[TaskListenDefine.FIELD_COMMON_FIGHT_WIN_RECALL] = addFightWinRecall


function fengmoDailyPro( taskId, param){
	function func(){
		let curTimes = getSaveRecord(opSaveRecordKey.taskCount[taskType.Fengmo]) || 0
		let totalTimes = taskConfig[taskType.Fengmo].maxPrizeCount
		let channelId = checkNull(param[0] , 17)
		
		let color = "#red"
		if(curTimes >= totalTimes ){
			color = "#cyan"
		}
		MsgSystem.selectShowHandle(channelId, Localize_cns("TASK_TXT1") +color +"(" +curTimes +"/" +totalTimes +")")
	}
	DelayEventEvecuteFunc(EventDefine.HERO_INFO_UPDATE, func, this)
}
TaskListenHandle[TaskListenDefine.FIELD_COMMON_FENGMO_DAILY_PRO] = fengmoDailyPro


function showGuideDramaTips( taskId, param){
	let args:any = {["window_y"]:70, ["rightType"]:true, ["content"]:param ,["guideType"]:10,["clickClose"]:true}
	GuideSystem.getInstance().executeAction(GuideListenDefine.FIELD_ACTION_DRAMATIPS, args, GenLocalGuideIndex(), 1)
}
TaskListenHandle[TaskListenDefine.FIELD_COMMON_GUIDE_DRAMA_TIPS] = showGuideDramaTips

////////////////////////////////////////////////////////////////////////////////////////////////-
//-新接任务
//function taskWithNpcAccept( taskId, param){
//	if(GameConfig.npcConfig[tonumber(param)] ){
//		let npcRef = GameConfig.npcConfig[tonumber(param)]
//		
//		let mapId = npcRef.map
//		let link = mapId +";1;" +param +"(0;0)"
//		TaskExecutor.getInstance().executeLink(link, taskId)
//	}
//}
//TaskListenHandle[TaskListenDefine.FIELD_ACCEPT_TALK_To_NPC] = taskWithNpcAccept

//function openAppointDialog( taskId, param){
//	TaskDialogue.getInstance().showDramaState(param[1], param[0], param[2])
//}
//TaskListenHandle[TaskListenDefine.FIELD_ACCEPT_AUTO_CLOSE_DIALOG] = openAppointDialog

//function playMovie( taskId, param){
//	if(param == null || param == "" ){
//		return
//	}
//	
//	MovieSystem.getInstance().beginPlay(param)
//}
//TaskListenHandle[TaskListenDefine.FIELD_ACCEPT_PLAY_MOVIE] = playMovie

//function openBaishiUI( taskId, param){
//	TaskExecutor.getInstance().executeLink("1;5;1")
//}
//TaskListenHandle[TaskListenDefine.FIELD_ACCEPT_OPEN_BAISHI_UI] = openBaishiUI

//-任务完成
//function talkWithNpc( taskId, param){
//	if(ActorManager.getInstance().getNpcWithEntryId(tonumber(param)) ){
//		npc = ActorManager.getInstance().getNpcWithEntryId(tonumber(param))
//		npcId = npc.getId()
//		Task_ShowNpcDialogWithNpc(npcId)
//	}
//}
//TaskListenHandle[TaskListenDefine.FIELD_TALK_To_NPC] = talkWithNpc

function autoCommitTask(taskId, param) {
	let npc = ActorManager.getInstance().getNpcWithEntryId(param)
	let npcId = npc == null && 0 || npc.getId()

	let message = GetMessage(opCodes.C2G_TASK_COMMIT)
	message.npcId = npcId
	message.taskId = taskId
	SendGameMessage(message)
}
TaskListenHandle[TaskListenDefine.FIELD_AUTO_COMMIT_TASK] = autoCommitTask

//女神之吻任务
function commitGoddessKissTask(taskId, param) {
// 	//WngMrg.getInstance().showWindow("GoddessKissFrame")
// 	let wnd1 = WngMrg.getInstance().getWindow("GoddessKissImgFrame")
// 	wnd1.showWithChapterId(param)
	let wnd2 = WngMrg.getInstance().getWindow("GoddessKissAnimFrame")
 	wnd2.showWithChapterId(param, true)
}
TaskListenHandle[TaskListenDefine.FIELD_COMMIT_GODDESSKISS_TASK] = commitGoddessKissTask

//任务更新
function xunluoOpenDialog(taskId, param, oldInfo, newInfo) {
	let oldCount = oldInfo.data[taskField.FIELD_FINISH_PVE_COUNT] || 0
	let newCount = newInfo.data[taskField.FIELD_FINISH_PVE_COUNT] || 0

	if (newCount > oldCount) {
		TaskListenHandle[TaskListenDefine.FIELD_COMMON_SHOWUP_DIALOG](taskId, param)
	}
}
TaskListenHandle[TaskListenDefine.FIELD_UPDATE_XUNLUO] = xunluoOpenDialog

function commitResFindNpc(taskId, param, oldInfo, newInfo) {
	let isCommitItem = (!oldInfo.data[taskField.FIELD_FINISH_GIVE_RES]) && newInfo.data[taskField.FIELD_FINISH_GIVE_RES]
	let isCommitPet = (!oldInfo.data[taskField.FIELD_FINISH_GIVE_PET]) && newInfo.data[taskField.FIELD_FINISH_GIVE_PET]
	param = tonumber(tostring(param))

	if (isCommitItem || isCommitPet) {
		if (param == "COMMIT_NPC") {
			param = TaskSystem.getInstance().getCommitTaskNpc(2, taskId)
		}

		if (GameConfig.npcConfig[param]) {
			let npcRef = GameConfig.npcConfig[param]

			let mapId = npcRef.map
			let link = mapId + ";1;" + param + "(0;0)"
			TaskListenHandle[TaskListenDefine.FIELD_COMMON_EXECUTELINK](taskId, link)
		}
	}
}
TaskListenHandle[TaskListenDefine.FIELD_UPDATE_COMMIT_RES] = commitResFindNpc

function answerQuestionDialog(taskId, param, oldInfo, newInfo) {
	if (oldInfo.data["ANSWER_RESULT"] != null || newInfo.data["ANSWER_RESULT"] == null) {
		return
	}
	let newResult = newInfo.data["ANSWER_RESULT"] || false				//默认是false

	if (param["correct"] && newResult == true) {
		let list = param["correct"]
		return TaskListenHandle[TaskListenDefine.FIELD_COMMON_SHOWUP_DIALOG](taskId, list)
	} else if (param["incorrect"] && newResult == false) {
		let list = param["incorrect"]
		return TaskListenHandle[TaskListenDefine.FIELD_COMMON_SHOWUP_DIALOG](taskId, list)
	}
}
TaskListenHandle[TaskListenDefine.FIELD_UPDATE_ANSWER_QUESTION] = answerQuestionDialog

function collectOn(taskId, param, oldInfo, newInfo) {
	let entryId = tonumber(newInfo.finish[taskField.FIELD_FINISH_FINDNPC_COUNT][0])
	let count = newInfo.finish[taskField.FIELD_FINISH_FINDNPC_COUNT][1]

	let curNum = newInfo.data[taskField.FIELD_FINISH_FINDNPC_COUNT] != null && newInfo.data[taskField.FIELD_FINISH_FINDNPC_COUNT][entryId] || 0
	let preNum = oldInfo.data[taskField.FIELD_FINISH_FINDNPC_COUNT] != null && oldInfo.data[taskField.FIELD_FINISH_FINDNPC_COUNT][entryId] || 0

	if (curNum <= preNum || curNum >= count) {
		return
	}

	return TaskExecutor.getInstance().executeLink(param)
}
TaskListenHandle[TaskListenDefine.FIELD_UPDATE_COLLECT_ON] = collectOn

function collectTips(taskId, param, oldInfo, newInfo) {
	let entryId = tonumber(newInfo.finish[taskField.FIELD_FINISH_FINDNPC_COUNT][0])
	let count = newInfo.finish[taskField.FIELD_FINISH_FINDNPC_COUNT][1]

	let curNum = newInfo.data[taskField.FIELD_FINISH_FINDNPC_COUNT] != null && newInfo.data[taskField.FIELD_FINISH_FINDNPC_COUNT][entryId] || 0
	let preNum = oldInfo.data[taskField.FIELD_FINISH_FINDNPC_COUNT] != null && oldInfo.data[taskField.FIELD_FINISH_FINDNPC_COUNT][entryId] || 0

	if (curNum <= preNum || curNum >= count) {
		return
	}
	MsgSystem.selectShowHandle(param[0], param[1])
}
TaskListenHandle[TaskListenDefine.FIELD_UPDATE_COLLECT_TIPS] = collectTips

//服务器响应完成任务
//function showDialog( taskId, param){
//	TaskDialogue.getInstance().showDramaState(param[1], param[0], param[2])
//}
//TaskListenHandle[TaskListenDefine.FIELD_COMMITTASKFINISH_SHOW_DIALOG] = showDialog

function acceptTask(taskId, param) {
	// if (type(param) == "string") {
	// 	param = GetStringSplitBySchool(param, GetHeroProperty("race"), 3)
	// }

	let message = GetMessage(opCodes.C2G_TASK_ACCEPT)
	message.npcId = 0
	message.taskId = param
	SendGameMessage(message)
}
TaskListenHandle[TaskListenDefine.FIELD_COMMITTASKFINISH_ACCEPT_TASK] = acceptTask

//function acceptTypeTask( taskId, param){
//	let message = GetMessage(opCodes.C2G_TASK_APPLY)
//	message.npcId	= 0
//	message.taskType = param
//	SendGameMessage(message)
//}
//TaskListenHandle[TaskListenDefine.FIELD_COMMITTASKFINISH_ACCEPT_TYPETASK] = acceptTypeTask


//任务战斗结束（暂时只有战败才有相应）
function openDialogue(taskId, param, args) {
	taskId = args.taskId
	let npcId = args.npcId
	let npcEntryId = param[1]
	let npc = ActorManager.getInstance().getNpc(npcId)
	if (npc) {
		npcEntryId = npc.getEntryId()
	}

	TaskDialogue.getInstance().showDramaState(param[0] == 0 && taskId || param[0], npcEntryId, param[2])
}
TaskListenHandle[TaskListenDefine.FIELD_SPECIALHANDLER_OPENDIA] = openDialogue

//打开邀请回顾窗口
function openInviteReviewFrame(taskId, param) {
	let wnd = WngMrg.getInstance().getWindow("PetInviteReviewFrame")
	wnd.setLastTask(taskId)
	wnd.showReviewFrame()
}
TaskListenHandle[TaskListenDefine.FIELD_PET_INVITE_REVIEW_HANDLE] = openInviteReviewFrame

}