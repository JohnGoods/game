

//战斗中（挂机不算）
function IsFightState(){
	let fightSystem:FightSystem = FightSystem.getInstance()

	if(fightSystem.isFight() == false)
		return false
	
	let [fightType,_] = fightSystem.getCurFightType()
	if(fightType == opFightResultType.PATROL)
		return false
	
	return true
}


//检查战斗操作，弹出提示
function CheckFightState(){
	if(IsFightState()){
		MsgSystem.addTagTips(Localize_cns("FIGHT_TXT10"))
		return true
	}
	return false
}



//立刻结束战斗(如果是非挂机战斗，不能结束)
function CheckEndFightNow(){
	if(CheckFightState()){
		return false
	}

	let fightSystem:FightSystem = FightSystem.getInstance()
	if(fightSystem.isFight()== true){
		FightSystem.getInstance().clearUpFightState()
	}

	return true
}

//强制结束所有战斗，包括挂机、非挂机、捕抓
function ForceEndFightNow(){
	let fightSystem:FightSystem = FightSystem.getInstance()
	if(fightSystem.isFight()== true){
		FightSystem.getInstance().clearUpFightState()
	}

	ChangePatrolState(false) //停止巡逻
	let message = GetMessage(opCodes.C2G_FIGHT_DRAWDONE)
	SendGameMessage(message)
}