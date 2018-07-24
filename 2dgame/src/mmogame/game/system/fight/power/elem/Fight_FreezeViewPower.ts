
class Fight_FreezeViewPower extends Fight_BasePower{
	public initObj(...args:any[]):void{

	}


	onFinish(){
		var windowIndex = this.powerInfo.target
		FireEvent(EventDefine.COMBAT_GUIDE_FREEZE, CombatFreezeEvent.createObj(true, windowIndex))
	}
}