class BaseState extends TClass{

	mStateType:number;
	//子类复写 初始化函数
    public initObj(...params:any[]):void{
        this.mStateType = -1;
    }
    //子类复写 析构函数
    protected destory(): void{
        
    }

	GetStateType():number{
		return this.mStateType
	}

	Activate(){
		
	}

	Deactive(){
		
	}

	EnableSubState(statetype:number):boolean{
		return false;
	}

	OnVpMouseDownEvent(args:egret.TouchEvent){
		return this.onMouseDown(args);
	}

	OnVpMouseMoveEvent(args:egret.TouchEvent){
		return this.onMouseMove(args);
	}

	OnVpMouseUpEvent(args:egret.TouchEvent){
		return this.onMouseUp(args);
	}


	////////////////////-子类重载//////////////////////-
	onMouseDown(args:egret.TouchEvent):boolean{
		return true;
	}

	onMouseMove(args:egret.TouchEvent):boolean{
		return true;
	}

	onMouseUp(args:egret.TouchEvent):boolean{
		return true;
	}
}