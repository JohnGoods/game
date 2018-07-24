class Fight_AttackedPower extends Fight_BasePower{
	public initObj(...args:any[]):void{

	}


	onFinish(){
		var actor = GetFightActor(this.actorId)
		if(actor){
			actor.changeAttackedState(null, null, this.playSomeSound)
		}
	}
}