class StateManager extends TClass{

    currentState:BaseState;
    currentMainState:BaseState;
    currentSubState:BaseState;

    statelist:any;
    substatelist:any;

	//子类复写 初始化函数
    public initObj(...params:any[]):void{
        this.currentState 		= 	null 	//当前状态
        this.currentMainState = 	null		//当前主状态
        this.currentSubState 	= 	null		//当前子状态

        this.statelist = {}				//主状态列表
        this.substatelist = {}		//子状态列表	
        
        StateManagerStaticInit(this) // 注册状态
    }
    //子类复写 析构函数
    public destory(): void{
        
    }

    onClear(){
        if(this.currentMainState ){		//当前主状态
            this.currentMainState.Deactive()
            this.NotifyStateDeactive(this.currentMainState.GetStateType())
        }
        if(this.currentSubState != null ){
            this.currentSubState.Deactive()
            this.NotifyStateDeactive(this.currentSubState.GetStateType())
        }
        this.currentState 		= 	null 	//当前状态
        this.currentMainState = 	null		//当前主状态
        this.currentSubState 	= 	null		//当前子状态
    }

    registerMainState(statetype:number, state:BaseState){
        state.mStateType = statetype;
        this.statelist[statetype] = state
    }

     registerSubState(statetype:number, state:BaseState){
        state.mStateType = statetype;
        this.substatelist[statetype] = state
    }


    ActiveState(statetype:number){
        if(this.statelist[statetype] == null){
            TLog.Error("StateManager.ActiveState statetype:"+statetype+" not found")
            return
        }
        
        if(this.currentMainState !=this.statelist[statetype]){
        
            //旧的子状态结束
            if(this.currentSubState !=null){			
                this.currentSubState.Deactive()
                this.NotifyStateDeactive(this.currentSubState.GetStateType())
                this.currentSubState = null
            }
            
            //旧的主状态结束
            if(this.currentMainState !=null){
                this.currentMainState.Deactive()
                this.NotifyStateDeactive(this.currentMainState.GetStateType())
                this.currentMainState = null
            }
            
            //新的状态开始
            this.currentMainState = this.statelist[statetype]
            this.currentMainState.Activate()
            this.currentState = this.currentMainState
            
            this.NotifyStateActive(this.currentMainState.GetStateType())
        }
    }

    ActiveSubState(statetype:number){
        TLog.Debug("StateManager.ActiveSubState:", statetype, this.substatelist[statetype])
        if(this.substatelist[statetype] == null ){
            TLog.Error("StateManager.ActiveSubState statetype:"+statetype+" not found")
            return
        }
        
        if(this.currentMainState == null ){
            TLog.Error("StateManager.ActiveSubState currentState == null")
            return
        }
                
        if(this.currentSubState != this.substatelist[statetype] ){
            //通过当前主状态,检查是否接受子状态的加载	
            if(this.currentMainState.EnableSubState(statetype) == false ){
                TLog.Error("StateManager.ActiveSubState statetype:"+statetype+" can't add to state:"+this.currentState.GetStateType())
                return
            }
            
            if(this.currentSubState != null ){
                this.currentSubState.Deactive()
                this.NotifyStateDeactive(this.currentSubState.GetStateType())
            }
                    
            this.currentSubState = this.substatelist[statetype]			
            this.currentSubState.Activate()
            this.currentState = this.currentSubState//当前状态是子状态
            
            this.NotifyStateActive(this.currentSubState.GetStateType())
            
        }
        
    }


     DeactiveSubState(statetype:number){

        if(this.substatelist[statetype] == null || this.currentSubState == null ){
            TLog.Error("StateManager.DeactiveSubState statetype:"+statetype+" not found")
            //Log.Error("StateManager.DeactiveSubState statetype:"+statetype+" not found")
            return
        }
            
        if(this.currentSubState.GetStateType() != statetype ){
            TLog.Error("StateManager.DeactiveSubState currentSubState:"+this.currentSubState.GetStateType()+" is not "+statetype)
            //Log.Error("StateManager.DeactiveSubState currentSubState:"+this.currentSubState.GetStateType()+" is not "+statetype)
            return
        }
    
        this.currentSubState.Deactive() 
        this.currentState = this.currentMainState
        this.NotifyStateDeactive(this.currentSubState.GetStateType())  
        this.NotifyStateActive(this.currentState.GetStateType())
        
        this.currentSubState = null 
     }


     GetCurrentStateType():number{
         if(! this.currentState ){
            return state_type.BASE_STATE
         }
        
        return this.currentState.GetStateType()
     }

     IsTheSubState(statetype:number):boolean{
        var bRet = false
        var currentSubState = this.currentSubState
        if(currentSubState && currentSubState == this.substatelist[statetype] ){
            bRet = true
        }
        return bRet
     }

     NotifyStateActive(statetype:number){
         FireEvent(EventDefine.STATE_ACTIVE, StateEvent.newObj(statetype))
     }

      NotifyStateDeactive(statetype:number){
         FireEvent(EventDefine.STATE_DEACTIVE, StateEvent.newObj(statetype))
     }


     OnEvent(eventname:string, args:egret.TouchEvent){
        if(this.currentMainState == null ){
            TLog.Error("StateManager.OnEvent %s", eventname)
            return
        }
        
        //子状态先处理，看消息是否拦截
        var bBlock = false
        if(this.currentSubState ){
            var func = this.currentSubState[eventname]
            if(func ){
                bBlock = func.call(this.currentState,args) //return true 就拦截
            }
        }
        
        if(bBlock == false ){
            var func = this.currentMainState[eventname]
            if(func ){
                func.call(this.currentState,args)
            }
        } 
     }
}