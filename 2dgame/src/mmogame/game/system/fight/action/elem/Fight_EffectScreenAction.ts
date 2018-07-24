class Fight_EffectScreenAction extends Fight_BaseAction{

	varName:string;
	targetName:string;

	effectId:number;
	speed:number;
	posType:string;
	offset_x:number;
	offset_y:number;

	layerType:string;

	screenEffect:Effect;

	public initObj(...args:any[]):void{
		this.varName = checkNull(this.elemInfo.param1 , "") //定义变量
		
		this.effectId = this.elemInfo.param2
		this.speed = checkNull(this.elemInfo.param3 , 1)
		this.offset_x = checkNull(this.elemInfo.param4 , 0)
		this.offset_y = checkNull(this.elemInfo.param5 , 0)
		this.layerType = checkNull(this.elemInfo.param6 , "")
		
		this.screenEffect = null
		
		if(this.fightResult){
			this.speed = this.fightResult.getActionSpeed(this.speed)
		}
	}


	onPlay(){
		TLog.Assert(this.screenEffect == null)
	
		if(this.casterActor == null){
			this.finish()
			return
		}
		
		var pos:any = {}
		pos.x = this.offset_x
		pos.y = this.offset_y
		
		var layer = map.Camera.SCREEN_BACKGROUND
		if(this.layerType == "fg"){
			layer = map.Camera.SCREEN_FOREGROUND;
		}
		
		//自动析构，不用保存实例
		this.screenEffect = EffectManager.getInstance().createScreenEffect(this.effectId, pos.x, pos.y, layer)
		this.screenEffect.setAnimSpeed(this.speed)
		this.screenEffect.setDir(this.casterActor.getDir() )
		
		if(this.varName != ""){
			this.fightResult.addActionObject(this.varName, this.screenEffect)//用于其他action使用
		}
	}

	onFinish(){
		if(this.screenEffect == null){
			return
		}
		
		if(this.varName != ""){
			this.fightResult.removeActionObject(this.varName, this.screenEffect)
		}
		this.screenEffect.deleteObj()
		this.screenEffect = null
	}


	onTick(delay){
		if(this.screenEffect){
			this.screenEffect.update(delay)
		}
	}
}