class Fight_ScreenBlackAction extends Fight_BaseAction{

	type:number;
	pauseCtrl:boolean;
	bHideUI:boolean;

	public initObj(...args:any[]):void{
		//施法者可见，施法者和受法者可见，受法者可见，和全不可见四类
		this.type = checkNull(this.elemInfo.param1 , 0)
		
		this.bHideUI = this.elemInfo.param2 || false //隐藏界面

		this.pauseCtrl = false
	}

	onPlay(){
		//是否已发送了攻击帧，如果没有，则在结束的时候发一次
		
		if(! this.casterActor){
			this.finish()
			return
		}
		
		this.pauseCtrl = FightSystem.getInstance().beginPauseSkillShow(this.casterActor, this.type)	

		if(this.bHideUI){
			IGlobal.guiManager.setUIVisible(false);
		}
	}

	onFinish(){
		if(this.casterActor && this.pauseCtrl == true){
			FightSystem.getInstance().stopPauseSkillShow(this.casterActor)
		}

		if(this.bHideUI){
			IGlobal.guiManager.setUIVisible(true);
		}
	}
}