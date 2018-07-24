class Fight_BreakPower extends Fight_BasePower{
	public initObj(...args:any[]):void{

	}


	onFinish(){
		//打断技能
		var actor = GetFightActor(this.actorId)
		if(actor){
			var number_info:any = {}
			number_info.Type = "break"
			number_info.textList = ["break"]
			actor.doCommand(ActorCommand.ShowCombatNumber, number_info, 200)
			//actor:breakSkill()
		}
	}
}