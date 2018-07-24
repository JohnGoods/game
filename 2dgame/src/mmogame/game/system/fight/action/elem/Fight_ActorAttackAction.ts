class Fight_ActorAttackAction extends Fight_ActorPlayAnimAction{
	public initObj(...args:any[]):void{
	}


	onEnterState(actor):boolean{
		var loop = true
		if(this.bLastFrameDelay){
			loop = false
		}
		
		if(actor.isAttackState() ){
			var animSpeed = actor.getAnimSpeed()
			actor.changeAction(this.action, animSpeed, loop)
			return true
		}
		
		return 	actor.changeAttackState(this.action, loop)
	}

	onLeaveState(actor){
		//进入和退出的state必须是同一个，否则不能进入idle
		if(actor.isAttackState() ){
			actor.changeIdleState()
		}
	}
}