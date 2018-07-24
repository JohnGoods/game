class Fight_SpiritCDPower extends Fight_BasePower{
	public initObj(...args:any[]):void{

	}


	onFinish(){
		if(this.powerInfo.ahead){
			return FireEvent(EventDefine.COMBAT_FIGHT_SPIRIT_CD, FunnalCDEvent.createObj(this.powerInfo.side, this.powerInfo.time))
		}
	}
}