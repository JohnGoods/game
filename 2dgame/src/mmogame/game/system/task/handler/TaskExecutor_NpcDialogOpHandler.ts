/*
作者:
    yangguiming
	
创建时间：
   2013.6.29(周六)

意图：
   执行对话框的指令

公共接口：
   
*/
ImportType(DialogOpDefine)

module TaskDialogOpSpace{

function saveTalkNode(npcId, talkId, nodeId,  param){
	//TLog.Warn("saveTalkNode Deprecated...")
	let message = GetMessage(opCodes.C2G_TASK_NODE)
	message.npcId = npcId
	message.taskId = talkId
	message.nodeId = nodeId
	SendGameMessage(message)
}

function commitTask(npcId, talkId, nodeId,  param){
	TaskSystem.getInstance().commitTask(npcId, param || talkId)
}

function startFight(npcId, talkId, nodeId,  param){
	let entryId = 0
	let npc = ActorManager.getInstance().getNpc(npcId)
	if(npc != null ){
		entryId = npc.getEntryId()
	}
	
	function callback( args){
		let message = GetMessage(opCodes.C2G_TASK_FIGHT)
		message.npcId = entryId
		message.taskId = param || talkId
		SendGameMessage(message)
		
		FireEvent(EventDefine.TASK_DIALOGOP, TaskOpEvent.newObj(talkId, DialogOpDefine.FIELD_START_FIGHT, nodeId))
	}
				
	if(HeroIsInTeam() == false ){
		if(CampaignSystem.getInstance().isExsitArray(BattleQueueType.Campaign) ){
			let wnd = WngMrg.getInstance().getWindow("CommonEmbattleFrame")
			wnd.showWithListener({}, callback, null, BattleQueueType.Campaign)
			
		}
	}else{					//组队中
		if(HeroIsCaptain() == true ){
			let wnd = WngMrg.getInstance().getWindow("CommonEmbattleTeamFrame")
			wnd.showCommonEmbattleTeamFrame(callback, {}, {})
		}else{
			MsgSystem.addTagTips(Localize_cns("TEAM_TXT34"))
		}
	}
}

function findNpc(npcId, talkId, nodeId,  param){
	let npcInfo = ActorManager.getInstance().getNpc(npcId)
	if(! npcInfo ){
		return
	}   
	let message = GetMessage(opCodes.C2G_TASK_NPC)
	message.npcId = npcInfo.entryId
	message.taskId = talkId
	SendGameMessage(message)
}


function cancelTask(npcId, talkId, nodeId,  param){
	TaskSystem.getInstance().cancelTask(param || talkId)
}

function applyBranchTask(npcId, talkId, nodeId,  param){
	let taskTypeRef = GameConfig.TaskConfig[param]
	if(taskTypeRef ){
		let canAccept = TaskChecker.getInstance().checkOpList(taskTypeRef.Accept, true)
		if(! canAccept ){
			return
		}
	}

	npcId = npcId < 0 ? 0 : npcId

	let message = GetMessage(opCodes.C2G_TASK_APPLY)
	message.npcId	= npcId
	message.taskType = param
	SendGameMessage(message)
}

// function applyActivity(npcId, talkId, nodeId,  param){
	
// 	let message = GetMessage(opCodes.C2G_TASK_APPLY_ACTIVITY)
// 	message.npcId	= npcId
// 	message.activityId = param
// 	message.activityType = TaskSystem.getInstance().getTaskType(message.activityId)
// 	SendGameMessage(message)
// }

// function clickBubbleNpc(npcId, talkId, nodeId, param){
// 	let message = GetMessage(opCodes.C2G_CLICK_JINGYANPAOPAO)
// 	message.npcId = npcId
// 	SendGameMessage(message)
// }

function clickCurNpc(npcId, talkId, nodeId, param){
	Task_ShowNpcDialogWithNpc(npcId)
}


function playMovie(npcId, talkId, nodeId, param){
	if(param == null || param == "" ){
		return
	}
	
	//modify:movie
	//MovieSystem.getInstance().beginPlay(param)
}


function beginClientFight(npcId, talkId, nodeId, param){
	FightSystem.getInstance().showClientFight(param)
}


function exeMainFunction(npcId, talkId, nodeId, param){
	TLog.Debug("exeMainFunction", param)
	ExecuteMainFrameFunction(param || "")
}



function hideWindow(npcId, talkId, nodeId, param){
	param = param || [];
	for(let _ in param ){
			let name = param[_]
	
		WngMrg.getInstance().hideWindow(name)
	}
}

function collectTask(npcId, talkId, nodeId, param) {
	let wnd = WngMrg.getInstance().getWindow("ClubMapFrame")
	if (wnd.isVisible()) {
		wnd.startAnim()
	}	
}

function instrusionTask(npcId, talkId, nodeId, param) {
	RpcProxy.call("C2G_FactionMapTaskFinishOnce", opFactionMapTaskType.Monster)
}

function zhongKuiTask(npcId, talkId, nodeId, param){
	let wnd : DailyGhostFrame = WngMrg.getInstance().getWindow("DailyGhostFrame")
	if(param){
		wnd.onShowWnd(param)
	}
	
}

function wulinTask(npcId, talkId, nodeId, param){
	let index = 1
	let level = ActivitySystem.getInstance().getWulinLevel()
	let info = []
	info[0] = 1
	info[1] = npcId
	info[2] = level
	RpcProxy.call("C2G_WuLinMengZhuFight", info)
}

function clickStronghold(npcId, talkId, nodeId, param){
	let index = GetActivity(ActivityDefine.Stronghold).getIndexByNpcId(npcId)
	if (index) {
		RpcProxy.call("C2G_StrongholdUpdate", index)
		let wnd = WngMrg.getInstance().getWindow("StrongholdResFrame")
		wnd.showWithIndex(index)
	}
}

function clickStrongholdKey(npcId, talkId, nodeId, param) {
	if (GetHeroProperty("faction") <= 0) {
		return MsgSystem.addTagTips(Localize_cns("STRONGHOLD_TEXT41"))
	}
	RpcProxy.call("C2G_StrongholdPickKey", npcId)
}

function clickStrongholdBoss(npcId, talkId, nodeId, param) {
	let heroInfo = GetHeroPropertyInfo()
	if (bit.band(heroInfo.status, opStatusType.STATUS_TYPE_TICKET) != opStatusType.STATUS_TYPE_TICKET) {
		return MsgSystem.addTagTips(Localize_cns("STRONGHOLD_TEXT37"))
	}
	let info = getSaveRecord(opSaveRecordKey.robberTicket) || []
	let stime = info[1] ? info[1] : 0
	if (GetServerTime() - stime < 120) {
		return MsgSystem.addTagTips(Localize_cns("STRONGHOLD_TEXT38"))
	}
	RpcProxy.call("C2G_StrongholdFightBoss", npcId)
}

function clickStrongholdBox(npcId, talkId, nodeId, param) {
	let boxRecord = getSaveRecord(opSaveRecordKey.strongholdBossBoxRecord) || 0
	if (boxRecord >= 1) {
		return MsgSystem.addTagTips(Localize_cns("STRONGHOLD_TEXT42"))
	}
	RpcProxy.call("C2G_StrongholdBossBox", npcId)
}

export let DialogOpHandler:any = {
	[DialogOpDefine.FIELD_SAVE_NODE] 		: saveTalkNode		,
	[DialogOpDefine.FIELD_COMMIT_TASK] 	: commitTask     ,
	[DialogOpDefine.FIELD_START_FIGHT] 	: startFight     ,
	[DialogOpDefine.FIELD_FIND_NPC] 		: findNpc        ,
	[DialogOpDefine.FIELD_CANCEL_TASK] 	: cancelTask     ,
	[DialogOpDefine.FIELD_APPLY_TASk] 	: applyBranchTask,
	
    [DialogOpDefine.FIELD_CLUB_MAP_COLLECT_TASK]  : collectTask,
    [DialogOpDefine.FIELD_CLUB_MAP_INSTRUSION_TASK] : instrusionTask,

	[DialogOpDefine.FIELD_ZHONGKUI_TASK] : zhongKuiTask,

	[DialogOpDefine.FIELD_WULIN_TASK] 	: wulinTask,
	
	
	[DialogOpDefine.FIELD_CLIENT_FIGHT]							: beginClientFight,

	
	[DialogOpDefine.FIELD_HIDE_FRAME]					: hideWindow,//关闭指定界面 param={"frame1", "frame2"}
	[DialogOpDefine.FIELD_STRONGHOLD_NPC] : clickStronghold,
	[DialogOpDefine.FIELD_STRONGHOLD_KEY] : clickStrongholdKey,
	[DialogOpDefine.FIELD_STRONGHOLD_BOSS] : clickStrongholdBoss,
	[DialogOpDefine.FIELD_STRONGHOLD_BOX] : clickStrongholdBox,
}

}