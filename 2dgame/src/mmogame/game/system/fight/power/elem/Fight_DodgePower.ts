class Fight_DodgePower extends Fight_BasePower{
	public initObj(...args:any[]):void{

	}


	onFinish(){
		var typeList = {
							[powerEffects.EFFECT_NOTARGET] : ["nagative", "nagative"],
							[powerEffects.EFFECT_DODGE] : ["dodge", "shanbi"],
							[powerEffects.EFFECT_MISS] : ["dodge", "shanbi"],
						}
	
		if(typeList[this.powerInfo.effect]){
			//直接显示闪避文字
			var actor = GetFightActor(this.actorId)
			if(actor){
				var number_info:any = {}
				number_info.Type = typeList[this.powerInfo.effect][0]
				number_info.textList = [typeList[this.powerInfo.effect][1]]
				actor.doCommand(ActorCommand.ShowCombatNumber, number_info, 200)

				if (this.powerInfo.effect == powerEffects.EFFECT_DODGE) {
					actor.changeAttackedState(null, null, this.playSomeSound)
				}
			}
		}
	}
}