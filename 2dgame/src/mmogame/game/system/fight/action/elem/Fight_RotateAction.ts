class Fight_RotateAction extends Fight_BaseAction{

	targetName:string;

	srcValue:number;
	dstValue:number;

	bFilpX:boolean;
	bFilpY:boolean;

	targetNameList:string[];
	

	public initObj(...args:any[]):void{
		this.targetName = checkNull(this.elemInfo.param1 , "caster")
		
		this.srcValue = checkNull(this.elemInfo.param2 , 0)
		this.dstValue = checkNull(this.elemInfo.param3 , 0)
		
		this.bFilpX = checkNull(this.elemInfo.param4 , false)
		this.bFilpY = checkNull(this.elemInfo.param5 , false)
		
		this.targetNameList = splitString(this.targetName, ",")
		
		this.srcValue = this.getRotateByCaster(this.srcValue)
		this.dstValue = this.getRotateByCaster(this.dstValue)
	}


	updateTransform(){
		var callback = function(actor, index){
			var s = this.srcValue + this.timeProcess * (this.dstValue - this.srcValue)
			actor.setRotate(s)
			actor.setFlipXY(this.bFilpX, this.bFilpY)
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
			actor.setRotate(this.dstValue )
		}
		this.iteratorActorList(callback, this.targetNameList)
	}
}