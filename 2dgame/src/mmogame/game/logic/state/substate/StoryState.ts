class StoryState extends BaseState{
	//子类复写 初始化函数
    public initObj(...params:any[]):void{
        this.mStateType = params[0];
    }
    //子类复写 析构函数
    protected destory(): void{
        
    }
}