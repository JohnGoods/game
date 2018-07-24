
class Fight_AttackedPlayAnimAction extends Fight_BaseAction{

	targetName:string;
	targetNameList:string[];

	action:string;
	speed:number;
	height:number;
	soundSwitch:boolean;

	listenActor:FightActor;
	listener:any;
	

	public initObj(...args:any[]):void{
		this.targetName = this.elemInfo.param1 || "targetList"
		this.targetNameList = splitString(this.targetName, ",")
		// body
		this.action = this.elemInfo.param2 || "attacked"
		this.speed = this.elemInfo.param3 || 1
		this.bLastFrameDelay = this.elemInfo.param4 || false
		this.soundSwitch = this.elemInfo.param5 || false
		
		if(this.fightResult){
			this.speed = this.fightResult.getActionSpeed(this.speed)
		}
	}


	onPlay(){
		TLog.Assert(this.listenActor == null)
		
		var loop = true
		if(this.bLastFrameDelay){
			loop = false
		}
		
		var callback = function(actor, index){
			if(actor.isKnockFlyState() || actor.isDeadState()){
				actor.changeAction(this.action, this.speed, loop)
				actor.startAttackedColor()
				
				//受击音效分性别　1女2男
				let [_, config] = GetFightActorConfig(actor)
				if(config && config.sex != 0){
					//let config = configinfo[1]
					var mus = SystemSound.effect_shouji_nv
					if(config.sex == 2){
						mus = SystemSound.effect_shouji_nan
					}
					GameSound.getInstance().playEffect(mus)
				}else{
					GameSound.getInstance().playEffect(SystemSound.effect_shouji)	
				}

				
			}else if(actor.changeAttackedState(this.action, loop, this.soundSwitch)){
				actor.setAnimSpeed(this.speed)
				
				if(this.listenActor == null){
					this.listenActor = actor
					let listener = {this_index : this, function_index : this.handleAnimNotify}
					this.listenActor.addAnimListener(listener)
				}
			}
		}
		
		if(this.iteratorActorList(callback, this.targetNameList) == false){
			this.finish()
		}
		
		//没人处理
		if(this.listenActor == null){
			this.finish()
		}
	}


	onFinish(){
		var callback = function(actor, index){
			if(actor.isAttackedState()){
				actor.changeIdleState()
			}
			
			if(this.listenActor == actor){
				this.listenActor.removeAnimListener(this.listener)
			}
			
			var powerList = this.fightResult.getDamagePowerList(actor.getCombatId())
			return this.fightResult.createPowerList(powerList, null, null, true)
		}
		
		this.iteratorActorList(callback,  this.targetNameList)
		this.listenActor = null
		this.listener = null
	}
}
