class CommandManager extends TClass{

	commandQueue:CommandQueue;

	 //子类复写 初始化函数
    public initObj(...params:any[]):void{

		this.commandQueue = CommandQueue.newObj();
		RegisterEvent(EventDefine.STATE_DEACTIVE, this.onStateDeActive, this)
  		RegisterEvent(EventDefine.HERO_RESET_POSITION, this.onHeroResetPosition, this)
        
    }
    //子类复写 析构函数
    protected destory(): void{
        this.commandQueue.deleteObj()
    }

	start(){
		this.commandQueue.start()
	}

	clear(){
		this.commandQueue.clear()
	}

	insertCommandFront( command){
		this.commandQueue.pushFront(command)
	}

	appendCommandTail( command){
		if(command == null ){
			return
		}
		this.commandQueue.pushBack(command)
	}


	onStateDeActive( args:StateEvent){
		//因为战斗或者其他原因，导致主角停止了
		if(args.stateType == state_type.COMBAT_BASE_STATE ){
			this.commandQueue.restartCurrentCommand() 
		}
	}

	onHeroResetPosition( args:core.EventArgs){
		//this.commandQueue.restartCurrentCommand() //刷新当前队列
		if(StateManager.getInstance().GetCurrentStateType() == state_type.LIVE_BASE_STATE ){
			this.clear()
		}
	}

	isCommandQueueEmpty(){
		return this.commandQueue.isEmpty()
	}
}