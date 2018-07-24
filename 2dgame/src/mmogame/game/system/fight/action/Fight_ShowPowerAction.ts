class Fight_ShowPowerAction extends Fight_BaseAction{
	soundSwitch:boolean;
	appointTarget:string;

	public initObj(...args:any[]):void{
		this.soundSwitch = checkNull(this.elemInfo.param1 , false)
	
		this.appointTarget = checkNull(this.elemInfo.param2 , null)			//"target1"
	}


	onPlay(){
		if(! this.appointTarget){
			this.fightResult.showNextPower(this.soundSwitch)
		}else{
			var target = this.fightResult.getActionObjectByName(this.appointTarget)
			
			var actor = target[0]
			if(actor){
				this.fightResult.showTargetPower(actor, this.soundSwitch)
			}
		}
		this.finish()
	}
}