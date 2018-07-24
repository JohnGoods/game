
class ActorControl_Sequence extends ActorControlBase{

	controlList:ActorControlBase[];
	index:number;

	public initObj(...args:any[]):void{
		this.controlList = [];
	}

	destory(){
		this.controlList.forEach(v=>{
			v.deleteObj();
		})
		this.controlList = null;
	}


	onBegin(actor:Actor){
		if(this.controlList.length == 0){
			this.finish(actor)
			return
		}
		
		this.index = 0;
		var control = this.controlList[this.index]
		control.begin(actor)
	}

	onUpdate(actor:Actor, delay:number):boolean{
		var control = this.controlList[this.index]
		control.update(actor, delay)
		
		if(control.isFinish()){
			this.index = this.index + 1
			if(this.index >= this.controlList.length){
				return true
			}
			
			var nextControl = this.controlList[this.index]
			nextControl.begin(actor)
		}
		
		return false 
	}

	onFinish(actor:Actor){
		this.controlList.forEach(v=>{
			v.begin(actor);
			v.finish(actor);
		})

	}

	addControl(control:ActorControlBase){
		TLog.Assert(control != this);
		JsUtil.arrayPush(this.controlList, control)
	}
}