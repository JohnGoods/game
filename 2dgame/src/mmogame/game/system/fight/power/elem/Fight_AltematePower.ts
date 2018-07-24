/*
作者:
    liuziming

创建时间：
    2014.09.02(星期二) 

意图：
  

公共接口：

*/

class Fight_AltematePower extends Fight_BasePower{
public initObj(...args:any[]):void {
	
}

//onPlay(){
//	
//}

onFinish(){
	//替补fightActor创建前需要手动转化side
	let side = FightSystem.getInstance().transferFightSide(this.powerInfo.side)

	let actor = GetFightActorByPos(side, this.powerInfo.pos)
	if(actor ){
		actor.setSide(0)
		actor.changeDieState()
		FightSystem.getInstance().getShowSystem().stopShowResult(actor.getCombatId())
		FightSystem.getInstance().removeFighter(actor.getCombatId())
	}
	
	let fightActorInfo = table_copy(this.powerInfo)
	if(side == fightSide.FIGHT_LEFT ){
		FightSystem.getInstance().removeAltemate(fightActorInfo.entry)
	}
	return FightSystem.getInstance().addFighterList([fightActorInfo])
}
}