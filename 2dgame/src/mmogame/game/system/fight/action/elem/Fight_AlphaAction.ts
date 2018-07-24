
class Fight_AlphaAction extends Fight_BaseAction{

	targetName:string;
	srcValue:number;
	dstValue:number;

	targetNameList:string[];
	init:boolean;

	public initObj(...args:any[]):void{
		this.targetName = checkNull(this.elemInfo.param1 , "caster") //可能以逗号隔开
	
		this.srcValue = checkNull(this.elemInfo.param2 , 1)
		this.dstValue = checkNull(this.elemInfo.param3 , 1)
		
		this.targetNameList = this.targetName.split(',');
		
		this.init = false
	}


	updateTransform(){
		function callback(actor, index){
			var colorInfo = {["alpha"] : 255}
			if(actor.classname == "FightActor"){
				colorInfo = actor.getActorColor()
			}
			var s = this.srcValue + this.timeProcess * (this.dstValue - this.srcValue)
			actor.setAlpha(s * colorInfo.alpha)
			
			if(this.init == false){
				if(actor.classname == "FightActor"){
					actor.setAlphaFlag(1)
				}
			}
		}
		
		if(this.iteratorActorList(callback, this.targetNameList) == false){
			this.finish()
		}
		
		this.init = true
	}


	onPlay(){
		this.updateTransform()
	}

	onFinish(){
		function callback(actor, index){
			var colorInfo = {["alpha"] : 255}
			if(actor.classname == "FightActor"){
				colorInfo = actor.getActorColor()
			}
			actor.setAlpha(this.dstValue * colorInfo.alpha)
			
			if(this.init == true){
				if(actor.classname == "FightActor"){
					actor.setAlphaFlag(-1)
				}
			}
		}
		this.iteratorActorList(callback, this.targetNameList)
	}


	onTick(delay){
		this.updateTransform()
	}
}