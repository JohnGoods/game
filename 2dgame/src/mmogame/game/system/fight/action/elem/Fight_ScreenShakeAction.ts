
class Fight_ScreenShakeAction extends Fight_BaseAction{

	dir:number;
	scope:number;
	rate:number;

	shakeId:number;

	public initObj(...args:any[]):void{
		//this.shakeType = this.elemInfo.param1 , 0
		this.dir = checkNull(this.elemInfo.param1 , 0)
		this.scope = checkNull(this.elemInfo.param2 , 10) //幅度
		this.rate = checkNull(this.elemInfo.param3 , 0) //每秒震动次数
		if(this.rate <= 0){
			this.rate = 10
		}
		
		if(this.fightResult){
			this.rate = this.fightResult.getActionSpeed(this.rate)
		}
	}


	onPlay(){
		this.shakeId = SceneManager.getInstance().startShakeScreen(this.dir, this.scope, this.rate, this.casterActor)
	}

	onFinish(){
		SceneManager.getInstance().stopShakeScreen(this.shakeId)
	}
}


