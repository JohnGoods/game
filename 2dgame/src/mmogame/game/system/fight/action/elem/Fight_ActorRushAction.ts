class Fight_ActorRushAction extends Fight_ActorPlayAnimAction{
	public initObj(...args:any[]):void{
	}


	onEnterState(actor):boolean{
		return 	actor.changeRushState(this.action)
	}

	onLeaveState(actor){
		if(actor.isRushState()){
			actor.changeIdleState()
		}
	}
}