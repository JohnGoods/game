class ActorCmdComponent extends TClass{
	realActor:map.LogicSprite
	owner:Actor;
	handlerList:any;

	//子类复写 初始化函数
    public initObj(...params:any[]):void{
        this.owner = params[0]
		this.realActor = this.owner.realActor
		this.handlerList = {}
    }
    //子类复写 析构函数
    protected destory(): void{
        
    }

	addCommandHandler(cmdId:number, functionRef:(param1:any, param2:any)=>void){
		if(this.handlerList[cmdId]){
			TLog.Warn("ActorCmdComponent.addCommandHandler %d already exsit", cmdId)
			return
		}
		this.handlerList[cmdId] = functionRef
	}

	onCommand(cmdId:number, param1:any, param2:any){
		if(this.handlerList[cmdId]){
			this.handlerList[cmdId].call(this, param1, param2)
		}
	}

	onAppearChange(){

	}

}