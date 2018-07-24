class Fight_ScaleAction extends Fight_BaseAction{
	targetName:string;

	srcScale:number;
	dstScale:number;

	targetNameList:string[];

	public initObj(...args:any[]):void{
		this.targetName = checkNull(this.elemInfo.param1 , "caster")
		
		this.srcScale = checkNull(this.elemInfo.param2 , 1)
		this.dstScale = checkNull(this.elemInfo.param3 , 1)
		
		this.targetNameList = splitString(this.targetName, ",")
	}


	updateTransform(){
		var callback = function(actor, index){
			var s = this.srcScale + this.timeProcess * (this.dstScale - this.srcScale)
			actor.setScale(s)
		}
		
		if(this.iteratorActorList(callback, this.targetNameList) == false){
			this.finish()
		}
	}

	onPlay(){
		this.updateTransform()
	}

	onTick(){
		this.updateTransform()
	}

	onFinish(){
		var callback = function(actor, index){
			actor.setScale(this.dstScale)
		}
		this.iteratorActorList(callback, this.targetNameList)
	}
}
