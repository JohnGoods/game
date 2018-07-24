class Fight_DieState extends Fight_BaseState{
	 public initObj(...args:any[]):void{
	 }


	 onPlay(){

	 }


	 onFinish(){
		 var actor:FightActor = GetFightActor(this.actorId)
		if(actor){
			actor.changeDieState()
			actor.startAttackedColor(50)
			FireEvent(EventDefine.COMBAT_FIGHTER_DEAD, CombatFighterEvent.createObj(this.actorId))
			//actor:setVisible(false)
		}
	 }

}