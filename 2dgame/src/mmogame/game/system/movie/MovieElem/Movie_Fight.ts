/*
作者:
    lintianfeng
	
创建时间：
   2013.10.29(周二)

意图：
   

公共接口：
   
*/
/*
class Movie_Fight extends Movie_Elem {
	fightId
	mapID
	ignoreRun
	public initObj(...args: any[]): void {
		this.fightId = args[0].fightId
		this.show_max_time = 1000 * 60 * 60
		this.mapID = args[0].map || 50009

		this.ignoreRun = args[0].ignoreRun || true
	}

	destory() {

	}

	onBegin() {
		//let message = GetMessage(opCodes.C2G_ROLE_TEAM_COMBAT)
		//message.fight_id = this.fightId
		//SendGameMessage(message)
		//TaskExecutor.getInstance().executeNpcDialogOp(DialogOpDefine.FIELD_START_FIGHT, 40001, this.fightId, null, null)
		RegisterEvent(EventDefine.COMBAT_END, this.onCombatEnd, this)
		MovieSystem.getInstance().hideAllPlayer()
		MovieSystem.getInstance().hideAllEffect()

		FightSystem.getInstance().showClientFight(this.fightId, this.mapID, this.ignoreRun)

	}

	onTick(delay) {

	}

	onFinish() {
		UnRegisterEvent(EventDefine.COMBAT_END, this.onCombatEnd, this)
		StateManager.getInstance().ActiveSubState(state_type.LIVE_STORY_STATE)
		//FireEvent(EventDefine.PRECEDURE_DEACTIVE, PrecedureEvent.newObj(PRECEDURE_GAME))
		MovieSystem.getInstance().hideAllPeople()
		MovieSystem.getInstance().showAllPlayer()
		MovieSystem.getInstance().showAllEffect()
	}

	onCombatEnd(args) {
		this.finish()
	}
}*/