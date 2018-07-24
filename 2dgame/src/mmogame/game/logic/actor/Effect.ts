class Effect extends Actor{


	effectId:number;
	bindCharacter:Character;

	showTims:number;
	curTimes:number;

	combatId:number;
	bAutoBindDelete:boolean;
	bindBone:string;

	caster:any;

	loadError:boolean;


	public initObj(...params:any[]):void{
		this.actorType = actor_Type.ACTOR_TYPE_EFFECT;

		this.setTouchEnable(false);

		this.showTims = 0;
		this.curTimes = 0;

		this.effectId = params[0];
		this.bindCharacter = null;
		this.combatId = 0;

		this.caster = null;

		this.bindBone = "";

		this.loadError = false;
		this.bAutoBindDelete = true;

		this.setAnimNotifyEnable(true)
		this.setUpdateAnimAlways(true)
	}

	destory(){
		if(this.bindCharacter){
			this.bindCharacter.doCommand(ActorCommand.RemoveEffect, this, false)
			this.bindCharacter = null
		}
	}

	getEffectId():number{
		return this.effectId
	}
	
	setBindCharacter(character:Character){
		this.bindCharacter = character
	}

	setShowTimes(times:number){
		this.showTims = times
		this.curTimes = 0
		
		// if times ~= 0 then
		// 	this:removeOptimizeFlag(map.IRenderActor.OPTIMIZE_UPDATE_ONSEE)
		// end
	}

	setCombatId(combatId:number):void{
		this.combatId = combatId
	}

	getCombatId():number{
		return this.combatId
	}


	onAnimOneCycle(action_id:string){
		super.onAnimOneCycle(action_id)
		if(this.showTims != 0){
			this.curTimes = this.curTimes + 1
			
			if(this.curTimes >= this.showTims){
				if (this.isAutoBindDelete()) {
					this.deleteObj();
				} else {
					if(this.bindCharacter){
						this.bindCharacter.doCommand(ActorCommand.RemoveEffect, this, false)
						this.bindCharacter = null
					}
				}
			}
		}
	}


	setCaster(caster){
		this.caster = caster;
	}

	getCaster(){
		return this.caster;
	}


	setAutoBindDelete(b:boolean){
		this.bAutoBindDelete = b
	}

	isAutoBindDelete():boolean{
		return this.bAutoBindDelete
	}

	setBindBone(bone:string){
		if(bone == ""){
			bone = "bottom"
		}
		this.bindBone = bone
	}

	getBindBone():string{
		return this.bindBone
	}


	isLoadError():boolean{
		return this.loadError;
	}

}