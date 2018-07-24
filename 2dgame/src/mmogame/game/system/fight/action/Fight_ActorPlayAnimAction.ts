class Fight_ActorPlayAnimAction extends Fight_BaseAction{

	action:string;
	speed:number;

	bLastFrameDelay:boolean;
	pauseFrameEvent:any;
	target:string;

	bResetAnim:boolean;
	listener:any;

	public initObj(...args:any[]):void{
		// body
		this.action = this.elemInfo.param1 || "attack"
		this.speed = this.elemInfo.param2 || 1
		this.bLastFrameDelay = this.elemInfo.param3 || false
		this.pauseFrameEvent = this.elemInfo.param4
		this.bLastFrameLoop = this.elemInfo.param5 || false
		this.target	= this.elemInfo.param6 || null
		
		this.setAutoSendAttack(true)
		
		if(this.fightResult){
			this.speed = this.fightResult.getActionSpeed(this.speed)
		}
	}

	onPlay(){
		//是否已发送了攻击帧，如果没有，则在结束的时候发一次
		
		this.bResetAnim = false
		
		if(! this.casterActor){
			this.finish()
			return
		}
		
		if(this.target){
			var target = this.fightResult.getActionObjectByName(this.target)
			if(! target[0]){
				return this.finish()
			}
		}
		
		//this.bSendAttack = false
		this.listener = null
		//this.usePauseSkill = false
		
		var actor = this.casterActor
		
		var bFinish = true
		
		var combatId = actor.getCombatId()
		this.setAutoFinishActor(combatId)
		
		if(this.onEnterState(actor) == true){
			actor.setAnimSpeed(this.speed)
			this.listener = {this_index : this, function_index : this.handleAnimNotify}
			actor.addAnimListener(this.listener)
			
			bFinish = false
		}else{
			//打断技能了
			this.fightResult.breakSkill()
		}
		
		
		if(bFinish){
			this.finish()//如果找不到actor
		}
	}

	onFinish(){
		if(this.casterActor){
			this.onLeaveState(this.casterActor)
			if(this.listener){
				this.casterActor.removeAnimListener(this.listener);
				this.listener = null;
			}
			
			if(this.bResetAnim){
				this.casterActor.setAnimPause(false)
				this.bResetAnim = false
			}
		}
	}

	//////////////////////////////////////////////////////////////
	onEnterState(actor):boolean{
		return false;
	}

	onLeaveState(actor){

	}


	handleAnimNotify(notify, actor:FightActor){
		//不是当前动作的
		if(actor.getActionId() != this.action)
			return;

		if(this.bResetAnim == false){
			if(this.pauseFrameEvent && this.pauseFrameEvent == notify){
				this.bResetAnim = true
				this.casterActor.setAnimPause(true)   
			}
		}
		
		super.handleAnimNotify(notify, actor)
	}
}