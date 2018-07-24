class Fight_BaseElem extends TClass{

	fightResult:FightResult;
	startTime:number;
	during:number;

	bBegin:boolean;
	bFinish:boolean;
	

	autoFinishActorId:number;
	timestamp:number;
	time:number;
	timeProcess:number;


	 //子类复写 初始化函数
    public initObj(...params:any[]):void{
        this.fightResult = null
		//开始时间和持续时间都是表单读写好了
		this.startTime = -1
		this.during = 0		
		this.reset()
    }
    //子类复写 析构函数
    protected destory(): void{
        this.finish()
    }


	reset(){
		if(this.bBegin == false){
			return
		}
		
		if(this.bFinish == false){
			//print(this.classname, this.autoFinishDelayTime)
			//assert(false)
			this.finish()
		}
		
		this.bBegin = false
		this.bFinish = false
		
		this.autoFinishActorId = -1
		
		this.timestamp = 0		//时间轴
		this.time = 0					//自开始后的时间
		this.timeProcess = 0
	}



	setTimeStamp(startTime, during){
		if(this.fightResult){
			if(startTime > 0){
				startTime = this.fightResult.getActionDuration(startTime)
			}
			during	= this.fightResult.getActionDuration(during)
		}
		
		this.during = during
		this.startTime = startTime
	}


	play(){
		if(this.bFinish == true){
			return false
		}
		
		if(this.bBegin == false){
			this.bBegin = true
			//PROFILE_START("Fight_BaseElem.play"..this.classname)
			this.onPlay()
			//PROFILE_STOP("Fight_BaseElem.play"..this.classname)
			return true
		}
		return false
	}


	tick(delay){
			
		this.timestamp = this.timestamp + delay
		
		//检查大于开始时间
		if(this.bBegin == false){
			if(this.startTime >= 0){
				
				if(this.timestamp >= this.startTime){
					this.play()
				}else{
					return
				}
				
			}else{
				return
			}
		}
		
		if(this.bFinish == true){
			return
		}
		
		this.time = this.time + delay
		this.timeProcess = this.during <= 0 ? 1 : this.time / this.during
		if(this.timeProcess >= 1){
			this.timeProcess = 1
		}
		
			//大于结束时间，则结束
		if(this.timeProcess >= 1){
			this.finish()
			return
		}
		
		
		if(this.autoFinishActorId >= 0){
			var actor = GetFightActor(this.autoFinishActorId)
			if(actor == null){
				this.finish()
				return
			}
		}
		
		this.onTick(delay)
	}



	finish(){
		if(this.bBegin == false){
			return false
		}
		if(this.bFinish == false){
			this.bFinish = true
			//PROFILE_START("Fight_BaseElem.finish"..this.classname)
			this.onFinish()
			//PROFILE_STOP("Fight_BaseElem.finish"..this.classname)
			return true
		}
		return false
	}


	sendEventBase(elem_name, event_name){
		var event:any = {}
		event.elem_name = elem_name
		event.event_name = event_name
		
		this.fightResult.recElemResult(event)
	}


	isFinish(){
		return this.bFinish
	}


	isBegin(){
		return this.bBegin
	}


	getResult(){
		return this.fightResult
	}

	// 继承函数
	onPlay(){
		//默认是直接关闭了,除非重载
		this.finish()
	}


	onTick(delay){

	}

	onFinish(){

	}


	setAutoFinishActor(actorId){
		this.autoFinishActorId = actorId
	}
}