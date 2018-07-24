class EffectManager extends TClass{
	//子类复写 初始化函数
    public initObj(...params:any[]):void{
        
		
    }
    //子类复写 析构函数
    protected destory(): void{
        
    }


	_initEffect(effect:Effect, loop?:boolean){
		var effectId = effect.getEffectId()
		var modelId = 9002
		var bError = false
		var speed = 1.0
		//print("effectId", EffectConfig[effectId], effectId)

		TLog.Assert(effectId != null);
		
		var effectRef = GameConfig.EffectConfig[effectId]
		if(effectRef != null){
			if(effectRef.sound != ""){
				GameSound.getInstance().playEffect(effectRef.sound)
			}
			
			if(effectRef.speed && effectRef.speed != 0 ){
				speed = effectRef.speed
			}
			modelId = effectRef.model
		}else{
			TLog.Error("initeffect.%s  not exsit", tostring(effectId))
			bError = true
		}
		
		effect.loadModel(modelId)
		effect.changeAction("", speed, loop) //播放默认动作

		effect.loadError = bError;

		return bError
	}

	createEffect(effectId:number, loop:boolean){
		var effect = Effect.newObj(effectId);
		var bError = this._initEffect(effect, loop)
		return effect
	}

	//_createScreenEffect()

	createSceneEffect(effectId, cellx ,celly, isOnce, loop){
		var effect = this.createEffect(effectId, loop)
		effect.setCellXY(cellx ,celly)
		effect.enterMap()//场景特效需要enterMap
		if(isOnce){
			effect.setShowTimes(1)//一次特效
		}
		return effect
	}

	//一次特效（播放一次自动销毁）
	createBindOnceEffect(effectId, character, boneParam){
		var effect = this.createBindEffect(effectId, character, boneParam, true)
		effect.setShowTimes(1)//一次特效
		return effect
	}

	//buffer特效
	createBindEffect( effectId, character, boneParam, loop){
		var effect = this.createEffect(effectId, loop)
		character.doCommand(ActorCommand.AddEffect, effect, boneParam)
		return effect
	}

	//删除buffer特效
	removeBindEffect(character, effect){
		character.doCommand(ActorCommand.RemoveEffect, effect, true)
	}


	createScreenEffect(effectId:number, x:number, y:number, layer:number){
		if(layer == null){
			//layer = map.ICamera.eScreenLayer_Background
			layer= 0;
		}

		var effect = ScreenEffect.newObj(effectId)
		this._initEffect(effect)

		effect.setPositionXY(x ,y)
		effect.setScreenLayer(layer)
		
		SceneManager.getInstance().addScreenEffect(effect)
		return effect
	}

}