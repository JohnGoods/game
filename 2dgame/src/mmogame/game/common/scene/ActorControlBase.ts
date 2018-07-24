class ActorControlBase extends TClass{

	maxTime:number;
	delayTime:number;
	callback:Function;
	thisObj:any;

	mFinish:boolean;
	mBegin:boolean;


	 //子类复写 初始化函数
    public initObj(...params:any[]):void{
        this.maxTime = 0
		this.delayTime = 0
		
		this.callback = null
		this.thisObj = null
		
		this.mFinish = false
		this.mBegin = false
    }
    //子类复写 析构函数
    protected destory(): void{
        
    }


	setFinishCallback(callback, thisObj){
		this.callback = callback
		this.thisObj = thisObj
	}

	begin(actor:Actor){
		if(this.mBegin == true){
			return
		}
		
		this.mBegin = true
		this.mFinish = false
		this.onBegin(actor)
	}

	finish(actor){
		if(! this.mBegin || this.mFinish){
			return
		}
		this.mFinish = true
		
		this.onFinish(actor)
		if(this.callback){
			this.callback.call(this.thisObj, actor)
		}
	}

	isBegin(){
		return this.mBegin
	}

	isFinish(){
		return this.mFinish
	}


	update(actor, delay){
		if(this.mBegin == false || this.mFinish){
			return
		}
		
		this.delayTime = this.delayTime + delay
		if(this.maxTime > 0){
			if(this.delayTime > this.maxTime){
				this.finish(actor)
				return true
			}
		}
		
		if(this.onUpdate(actor, delay)){
			this.finish(actor)
			return true
		}
		
		return false
	}


	setMaxTime(maxTime:number){
		this.maxTime = maxTime
	}

	////////////////////////////////////////////////////////////////////////
	//必须继承

	onBegin(actor:Actor){

	}

	onUpdate(actor:Actor, delay:number){
		
	}

	onFinish(actor:Actor){
		
	}
}