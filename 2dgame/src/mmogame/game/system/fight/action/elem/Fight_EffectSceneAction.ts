class Fight_EffectSceneAction extends Fight_BaseAction{

	varName:string;
	targetName:string;

	effectId:number;
	speed:number;
	posType:string;
	offset_x:number;
	offset_y:number;


	sceneEffect:Effect;

	public initObj(...args:any[]):void{
		this.varName = checkNull(this.elemInfo.param1 , "") //定义变量
	
		this.effectId = this.elemInfo.param2
		this.speed = checkNull(this.elemInfo.param3 , 1)
		this.posType = checkNull(this.elemInfo.param4 , "casterMid")
		this.offset_x = checkNull(this.elemInfo.param5 , 0)
		this.offset_y = checkNull(this.elemInfo.param6 , 0)
		this.bLastFrameDelay = checkNull(this.elemInfo.param7 , false)
		this.bLastFrameLoop = checkNull(this.elemInfo.param8 , false)
		
		//因为编辑器以攻击者在左边处理
		//所以如果角色是右边，就要调整偏移

		var pos = null;
		if(this.posType != "any"){
			pos = this.getOffsetByCaster(this.offset_x, this.offset_y)
		}else{
			pos = this.getAbsoluteXYByCaster(this.offset_x, this.offset_y)
		}
		this.offset_x = pos.x
		this.offset_y = pos.y;
		this.setAutoSendAttack(true)
		
		if(this.fightResult){
			this.speed = this.fightResult.getActionSpeed(this.speed)
		}
	}


	getPosByType(){
		
	
		var pos:any = {}
		
		if(this.posType == "any"){
			pos = SceneManager.getInstance().screenXYtoMapXY(this.offset_x, this.offset_y)
		
		}else if(this.posType == "sceneMid"){

			var viewSize = SceneManager.getInstance().getCameraViewSize();

			pos = SceneManager.getInstance().screenXYtoMapXY(viewSize.w/2, viewSize.h/2)
			pos.x = pos.x + this.offset_x
			pos.y = pos.y + this.offset_y
		}else{
			if(this.casterActor == null){
				return null
			}
			
			var side = this.casterActor.getSide()
			var actor_list = GetFightActorList()
			var mapx = 0
			var mapy = 0
			var count = 0		
			
			if(this.posType == "targetMid"){

				for(var k in actor_list){
					var actor = actor_list[k];
					if(actor.getSide() != side && actor.getPos() <= DEFAULT_FIGHT_ACTOR_COUNT * 2){//敌方
						var pos = actor.getPositionXY()
						mapx = mapx + pos.x
						mapy = mapy + pos.y
						
						count = count + 1
					}
				}
				
			}else if(this.posType == "casterMid"){

				for(var k in actor_list){
					var actor = actor_list[k];
					if(actor.getSide() == side && actor.getPos() <= DEFAULT_FIGHT_ACTOR_COUNT * 2){ //我方
						var pos = actor.getPositionXY()
						mapx = mapx + pos.x
						mapy = mapy + pos.y
						
						count = count + 1
					}
				}
				
			}
			
			if(count == 0){
				return null
			}
			
			pos.x = mapx / count + this.offset_x
			pos.y = mapy / count + this.offset_y
			
		}
		
		pos = SceneManager.getInstance().mapXYtoCellXY(pos.x, pos.y)
		return pos
	}


	onPlay(){
		TLog.Assert(this.sceneEffect == null)
		
		var pos = this.getPosByType()
		if(! pos){
			this.finish()
			return
		}
		
		//自动析构，不用保存实例
		var listener = {this_index : this, function_index : this.handleAnimNotify}
		this.sceneEffect = EffectManager.getInstance().createSceneEffect(this.effectId, pos.x, pos.y, false, ! this.bLastFrameDelay)
		this.sceneEffect.addAnimListener(listener)
		this.sceneEffect.setAnimSpeed(this.speed)
		this.sceneEffect.setDir(this.casterActor.getDir() )
		if(this.casterActor == g_pauseSkillCaster){
			this.sceneEffect.changeTopMapLayer()
		}
		
		//this.sceneeffect.changeMapLayer(this.casterActor.getMapLayer() )
		
		if(this.varName != ""){
			this.fightResult.addActionObject(this.varName, this.sceneEffect)//用于其他action使用
		}
	}


	onFinish(){
		if(this.sceneEffect == null){
			return
		}
		
		if(this.varName != ""){
			this.fightResult.removeActionObject(this.varName, this.sceneEffect)
		}
		this.sceneEffect.deleteObj()
		this.sceneEffect = null
	}


	onTick(delay){
		
	}
}
