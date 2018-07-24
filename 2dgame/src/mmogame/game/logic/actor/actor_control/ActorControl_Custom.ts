class ActorControl_Custom extends ActorControlBase{

	customCallback:Function;
	customObj:any;
	totalTime:number;
	param:any;

	 //子类复写 初始化函数
    public initObj(...args:any[]):void{
        this.customCallback = args[0]
		this.customObj = args[1]
		
		var totalTime = args[2]
		this.param = args[3]
		
		this.setMaxTime(totalTime)
    }
    //子类复写 析构函数
    protected destory(): void{
        
    }

	onBegin(actor:Actor){

	}

	onUpdate(actor:Actor, delay:number){
		if(! this.customCallback || ! this.customObj ){
			return true
		}
		
		return this.customCallback.call(this.customObj, this.delayTime / this.maxTime, this.param, actor)
	}

	onFinish(actor:Actor){
		
	}
}