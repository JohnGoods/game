class Fight_FadeAction extends Fight_BaseAction{

	targetName:string;
	new_interval:number;
	alive_interval:number;
	max_count:number;
	targetNameList:string[];

	public initObj(...args:any[]):void{
		this.targetName = checkNull(this.elemInfo.param1 , "caster")
		
		this.new_interval = checkNull(this.elemInfo.param2 , 10)
		this.alive_interval = checkNull(this.elemInfo.param3 , 1000)
		this.max_count = 50
		
		this.targetNameList = splitString(this.targetName, ",")
	}


	onPlay(){
		var callback = function(actor, index){
			actor.createFade(this.new_interval, this.alive_interval, this.max_count)
		}
		
		if(this.iteratorActorList(callback, this.targetNameList) == false){
			this.finish()
		}
	}

	onFinish(){

		function callback(actor, index){
			actor.clearFade()
		}
		
		if(this.iteratorActorList(callback, this.targetNameList) == false){
			this.finish()
		}
	}
}
