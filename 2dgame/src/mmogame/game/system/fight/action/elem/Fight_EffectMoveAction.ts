class Fight_EffectMoveAction extends Fight_BaseAction{
	varName:string;
	targetName:string;

	effectId:number;
	speed:number;
	bAutoRotate:boolean;
	useType:string;

	effectList:Effect[];

	public initObj(...args:any[]):void{
		this.varName = checkNull(this.elemInfo.param1 , "")//定义变量
		
		this.effectId = this.elemInfo.param2
		this.speed = checkNull(this.elemInfo.param3 , 1	)
		this.bAutoRotate = checkNull(this.elemInfo.param4 , false)
		
		this.useType = checkNull(this.elemInfo.param5 , "one") //默认是场景的，创建一个
		
		if(this.fightResult){
			this.speed = this.fightResult.getActionSpeed(this.speed)
		}
	}


	createOnceEffect(){
		var effect = EffectManager.getInstance().createSceneEffect(this.effectId, 0, 0, false)
		effect.setAnimSpeed(this.speed)
		//effect.changeTopMapLayer( )
		if(this.casterActor == g_pauseSkillCaster){
			effect.changeTopMapLayer()
		}
		effect.setMoveAutoRotate(this.bAutoRotate)
		effect.setDir(this.casterActor.getDir() ) //人物特效需要根据人物面向设置
		if(this.varName != ""){
			this.fightResult.addActionObject(this.varName, effect)//用于其他action使用
		}
		
		effect.setPositionXY(-100, -100)
		this.effectList.push(effect);
	}


	onPlay(){
		TLog.Assert(this.effectList == null)
		this.effectList = []
		
		if(this.casterActor == null){
			this.finish()
			return
		}

		
		if(this.useType == "multi"){
			var callback = function(actor, index){
				this.createOnceEffect()
			}
			if(this.iteratorActorList(callback, ["targetList"]) == false){
				this.finish()
			}
		}else if(this.useType == "one"){
			this.createOnceEffect()
		}else{
			this.finish()
		}
	}


	onFinish(){

		this.effectList.forEach(effect=>{
			if(this.varName != ""){
				this.fightResult.removeActionObject(this.varName, effect)
			}
			effect.deleteObj()
		})

		this.effectList = null
	}

	onTick(delay){

		this.effectList.forEach(v=>{
			v.update(delay)
		});

	}
}