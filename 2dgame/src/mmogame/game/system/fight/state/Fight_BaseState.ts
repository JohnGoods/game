class Fight_BaseState extends Fight_BaseElem{

	stateInfo:any;
	actorId:any;

	 //子类复写 初始化函数
    public initObj(...args:any[]):void{
       	this.fightResult = args[0]
		this.stateInfo = args[1]
		
		this.actorId = this.stateInfo.target
    }
    
}