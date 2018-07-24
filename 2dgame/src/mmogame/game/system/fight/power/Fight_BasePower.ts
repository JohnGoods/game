class Fight_BasePower extends Fight_BaseElem{

	powerInfo:any;
	actionCallBack:Function;
	powerAction:any;
	playSomeSound:string;

	effect:number;
	actorId:number;


	public initObj(...args:any[]):void{
		// body
		this.fightResult = args[0]
		this.powerInfo = args[1]
		this.actionCallBack = args[2] || null
		this.powerAction = args[3]
		this.playSomeSound = args[4] || false
		
		this.effect = this.powerInfo.effect
		this.actorId = this.powerInfo.target
	}

	finish(){
		if(super.finish()){
			if(this.actionCallBack){
				var func = this.actionCallBack
				return func(this.powerAction)
			}
		}
	}
}