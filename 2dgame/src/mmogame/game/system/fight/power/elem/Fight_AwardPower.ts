/*
作者:
    liuziming

创建时间：
    2014.09.02(星期二) 

意图：
  

公共接口：

*/
class Fight_AwardPower extends Fight_BasePower {
	public initObj(...args: any[]): void {

	}

	//onPlay(){
	//	//不实现就自动finish
	//}

	onFinish() {
		//if(this.effect != powerEffects.EFFECT_DROP_ITEM ){
		//	return
		//}

		let award = FightSystem.getInstance().createAward(this.actorId)
		award.setVisible(false)

		if (this.effect == powerEffects.EFFECT_DROP_GOLD) {
			award.setAwardData("money", this.actorId, this.powerInfo.value)
			//player.doCommand(ActorCommand.ShowAwardModel, info.name)
		} else if (this.effect == powerEffects.EFFECT_DROP_ITEM) {
			award.setAwardData("item", this.actorId, this.powerInfo.itemId, this.powerInfo.quality)
			//player.doCommand(ActorCommand.ShowAwardModel, info.name)
		}
	}
}