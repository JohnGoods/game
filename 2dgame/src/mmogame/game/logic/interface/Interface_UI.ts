// TypeScript file

function Task_ShowNpcDialogWithNpc(npcId){
	FaceToHero(npcId)
	let dialog = TaskDialogue.getInstance()
	dialog.talkWithNpc(npcId)
}

function Task_ShowNpcDialogWithEntry(entryId){
	let window = TaskDialogue.getInstance()
	window.talkWithNpc(-1, entryId)
}


////////////////////////////////////////////////////
function Chat_AddChannelMsg(channel, msg){
	let packet 			= MessageLogic.ChannelMsgPacket.newObj()
	packet.roleId	 		= GetHeroProperty("id")
	packet.name		 		= GetHeroProperty("name")//name
	packet.channel 		= channel
	packet.sexId	 		= checkNull( GetHeroProperty("sexId") , 1)
	packet.data 	 		= msg
	packet.vocation = GetHeroProperty("vocation")
	packet.timestamp = GetServerTime()
	ChannelMrg.getInstance().addChannelMsg(channel, packet)
}


function UI_GetWindowByInfo(info){
	
	let window = WngMrg.getInstance().getWindow(info.rootWindow)
	if(window ){
		return window.getWindowByInfo(info)
	}else{
		TLog.Error("UI_GetWindowByInfo can ! find Window %s ", info.rootWindow)
		return null
	}
}

function UI_IntersectWithStageXY(stageX: number, stageY: number, window) {
	return core.EgretUtil.hitTestRect(window, stageX, stageY)
}