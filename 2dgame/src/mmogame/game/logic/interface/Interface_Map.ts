// TypeScript file




//////////////////////////////////////-
//命令队列

function addCommand_DelayTime(mapId, delayTime){
	var commandFactory = CommandFactory.getInstance()
	var commandManager = CommandManager.getInstance()
	
	
	if(MapSystem.getInstance().getMapId() != mapId && delayTime && delayTime > 0 ){
		var delayTimeCommand = commandFactory.createCommandDelayTime(delayTime)
		commandManager.appendCommandTail(delayTimeCommand)
	}
	
}

function Command_Move( cellx:number, celly:number, delayTime?:number){
	var commandFactory:CommandFactory = CommandFactory.getInstance()
	var commandManager:CommandManager = CommandManager.getInstance()
	
	var mapId = MapSystem.getInstance().getMapId()
	//cellx ,celly = HeroMoveTransform(cellx,celly)
	
	var moveCommand 		 = commandFactory.createCommandMove(mapId, cellx, celly, 0)
	
	// var delayTimeCommand = null
	// if(delayTime && delayTime > 0 ){
	// 	delayTimeCommand = commandFactory.createCommandDelayTime(delayTime)
		
	// }
	
	commandManager.clear()
	addCommand_DelayTime(-1, delayTime)
	commandManager.appendCommandTail(moveCommand)
	commandManager.start()
}


function Command_FindWayToGo( mapId, cellx, celly, scope, args?){
	var commandFactory = CommandFactory.getInstance()
	var commandManager = CommandManager.getInstance()
	
	var moveCommand 		 = commandFactory.createCommandFindWay(mapId, cellx, celly, scope, args)
	
	commandManager.clear()
	addCommand_DelayTime(mapId, MOVE_DELAY_TIME)
	commandManager.appendCommandTail(moveCommand)
	commandManager.start()
}

 function Command_FindWayToTalkNpc( mapId, cellx, celly, scope, npcEntry, npcId?, args?){
	var commandFactory = CommandFactory.getInstance()
	var commandManager = CommandManager.getInstance()
	
	var moveCommand 		 = commandFactory.createCommandFindWay(mapId, cellx, celly, scope, args)
	var talkCommand = commandFactory.createCommandTalkNpc(npcEntry, npcId)
	
	commandManager.clear()
	addCommand_DelayTime(mapId, MOVE_DELAY_TIME)
	commandManager.appendCommandTail(moveCommand)
	commandManager.appendCommandTail(talkCommand)
	commandManager.start()
}

function Command_FindWayToAutoFight( mapId, cellx, celly, scope){
	let commandFactory = CommandFactory.getInstance()
	let commandManager = CommandManager.getInstance()
	
	let moveCommand 		 = commandFactory.createCommandFindWay(mapId, cellx, celly, scope)
	let autoFightCommand = commandFactory.createCommandAutoRun()
	
	commandManager.clear()
	addCommand_DelayTime(mapId, MOVE_DELAY_TIME)
	commandManager.appendCommandTail(moveCommand)
	commandManager.appendCommandTail(autoFightCommand)
	commandManager.start()
}

function Command_AutoRun(){
	let commandFactory = CommandFactory.getInstance()
	let commandManager = CommandManager.getInstance()
	
	let autoRunCommand 		 = commandFactory.createCommandAutoRun()
	
	commandManager.clear()
	commandManager.appendCommandTail(autoRunCommand)
	commandManager.start()
}

function Command_JumpMapToTalkNpc(mapId, targetCellx, targetCelly, cellx, celly, scope, npcEntry, opCode, args){
	var commandFactory = CommandFactory.getInstance()
	var commandManager = CommandManager.getInstance()
	
	var jumpCommand		= commandFactory.createCommandJumpMap(mapId, targetCellx, targetCelly, opCode)
	var moveCommand 	= commandFactory.createCommandFindWay(mapId, cellx, celly, scope, args)// school.taskId)
	var talkCommand 	= commandFactory.createCommandTalkNpc(npcEntry)
	
	commandManager.clear()
	commandManager.appendCommandTail(jumpCommand)
	addCommand_DelayTime(mapId, MOVE_DELAY_TIME)
	commandManager.appendCommandTail(moveCommand)
	commandManager.appendCommandTail(talkCommand)
	commandManager.start()
}

function Command_JumpMapToGo(mapId, targetCellx, targetCelly, cellx, celly, scope, opCode, args){
	var commandFactory = CommandFactory.getInstance()
	var commandManager = CommandManager.getInstance()
	
	var jumpCommand		= commandFactory.createCommandJumpMap(mapId, targetCellx, targetCelly, opCode)
	var moveCommand 	= commandFactory.createCommandFindWay(mapId, cellx, celly, scope, args)// school.taskId)
	
	commandManager.clear()
	commandManager.appendCommandTail(jumpCommand)
	addCommand_DelayTime(mapId, MOVE_DELAY_TIME)
	commandManager.appendCommandTail(moveCommand)
	commandManager.start()
}

function Command_MoveToCallback(cellx, celly, scope, delayTime, handle, obj, param?){
	let commandFactory = CommandFactory.getInstance()
	let commandManager = CommandManager.getInstance()
	
	let mapId = MapSystem.getInstance().getMapId()
	//let jumpCommand		= commandFactory.createCommandJumpMap(mapId, targetCellx, targetCelly, opCode)
	let moveCommand 	= commandFactory.createCommandFindWay(mapId, cellx, celly, scope)// school.taskId)
	let delayTimeCommand = commandFactory.createCommandDelayTime(delayTime)
	let callbackCommand = commandFactory.createCommandCallBack(handle, obj, param)
	
	commandManager.clear()
	//commandManager.appendCommandTail(jumpCommand)
	commandManager.appendCommandTail(moveCommand)
	commandManager.appendCommandTail(delayTimeCommand)
	commandManager.appendCommandTail(callbackCommand)
	commandManager.start()
}

function Command_MoveStop(){
	var commandManager = CommandManager.getInstance()
	commandManager.clear()
	HeroMoveStop();
}

//////////////////////////////////////

function _CheckHeroCanGoInterval():boolean{
	if(GetHero().isMoveable() == false ){
		TLog.Warn("Hero.isMoveable return false!")
		return false
	}

	if(IsCrossServer() && ! IsInGlobalActvity("legion") && ! IsInGlobalActvity("globalUnionWar") ){
		return false
	}
	return true;
}

function CheckHeroCanGo():boolean{
	if(_CheckHeroCanGoInterval() == false)
		return false;
	// if(GetActivity(ActivityDefine.Robber).isAutoFight()){
	// 	MsgSystem.addTagTips(Localize_cns("ROBBER_TXT300"))
	// 	return false;
	// }
	
	return true
}

function HeroMoveTo(cellx:number, celly:number):boolean{
    if(! _CheckHeroCanGoInterval() ){
		return false
	}
	
	return GetHero().wantToGoByCell(cellx, celly)
}


function HeroMoveStop(){
	GetHero().moveStop();
}



function HeroEmptyCommandStop(){
	GetHero().moveStop()

	let pos = GetHero().getCellXY();
	Command_Move(pos.x, pos.y)
}

function FindWayToGo(targetMapId, cellx ,celly){				//可以跳转地图
	if(! _CheckHeroCanGoInterval() ){
		return false
	}
	
	return MapSystem.getInstance().findWayToGo(targetMapId, cellx, celly)
	
}


function AutoRunFight(){
	
	
}



function FindNpcToCallback(npcEntryId, callback, obj, param?){
	TLog.Assert(callback)

	let npcRef = GameConfig.npcConfig[npcEntryId] 
	if(npcRef == null ){
		TLog.Error("FindNpcToTalk npcConfig[%s]== null", npcEntryId)
		return
	}

	let mapId = MapSystem.getInstance().getMapId()
	if(mapId != ZHUCHENG_MAPID ){
		MsgSystem.addTagTips(String.format(Localize_cns("MAP_TXT1"),npcRef.name)) 
		return
	}
	Command_MoveToCallback(npcRef.x, npcRef.y, 5, 200, callback, obj, param)
}



function ChangePatrolState(b: boolean) {
	if (b == true) {				//开启自动挂机
		MapSystem.getInstance().setAutoState(true)
		//Command_AutoRun()
	} else {						//关闭自动挂机
		MapSystem.getInstance().setAutoState(false)
		//Command_MoveStop()
	}
}