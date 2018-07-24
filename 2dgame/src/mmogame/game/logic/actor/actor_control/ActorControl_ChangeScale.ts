class ActorControl_ChangeScale extends ActorControlBase{

	targetScale:number;
	curScale:number;
	originScale:number;
	isRestory:boolean;
	changeSpeed:number;

	public initObj(...args:any[]):void{
		var time_ = args[0]
		this.targetScale = args[1]
		this.curScale = args[2]
		this.originScale = args[2]
		this.isRestory = args[3] || false
		
		this.changeSpeed = (this.targetScale - this.curScale) / time_
		
		this.setMaxTime(time_)
	}

	onBegin(actor:Actor){

	}

	onUpdate(actor:Actor, delay:number){
		this.curScale = this.curScale + this.changeSpeed * this.delayTime
	
		actor.setScale(this.curScale)
		return false
	}

	onFinish(actor:Actor){
		if(this.isRestory){
			actor.setScale(this.originScale)
		}
	}
}