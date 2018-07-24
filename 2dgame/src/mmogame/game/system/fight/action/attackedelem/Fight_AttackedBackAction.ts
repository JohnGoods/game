class Fight_AttackedBackAction extends Fight_BaseAction {

	targetName:string;
	targetNameList:string[];

	height:number;
	offx:number;
	totalTime:number;
	rotate:number;
	holdTime:number;

	changeColor:boolean;
	colorR:number;
	colorG:number;
	colorB:number;

	controlMap:any;

	 public initObj(...args:any[]):void{
		this.targetName = this.elemInfo.param1 || "targetList"
		this.targetNameList = splitString(this.targetName, ",")
		
		this.height = checkNull(this.elemInfo.param2 , 100) 					//击飞高度
		this.offx = checkNull(this.elemInfo.param3 , -100) 						//偏移位置（正数为对于站位向前，负数为向后）
		this.totalTime = checkNull(this.elemInfo.param4 , 500) 				//击退时间（单位：毫秒）
		this.rotate = checkNull(this.elemInfo.param5 , 90)						//旋转角度（角度制）
		this.holdTime = checkNull(this.elemInfo.param6 , 0)						//落地后停留时间（单位：毫秒）
		
		this.changeColor = this.elemInfo.param7 || false		//是否变色
		this.colorR = checkNull(this.elemInfo.param8 , 1)							//红色
		this.colorG = checkNull(this.elemInfo.param9 , 1)							//绿色
		this.colorB = checkNull(this.elemInfo.param10 , 1)						//蓝色
	 }

	 onPlay(){
		 this.controlMap = {}
	
		var callback = function(actor:FightActor, index){
			if(this.fightResult.isActorResultEffect(actor.getCombatId(), powerEffects.EFFECT_DODGE) == false && actor.changeBeatBackState("")){
				
				var pos = actor.getMapXY();

				var fromX = pos.x;
				var fromY = pos.y
				var toX = fromX + this.offx
				if(actor.getSide() == fightSide.FIGHT_RIGHT){
					toX = fromX - this.offx
				}
				
				var toY = fromY + this.height
				
				//上升
				var control = ActorControl_Custom.newObj(this.updateActorPosition, this, this.totalTime, [newPos(toX, toY), newPos(fromX, fromY)])
				
				//下降
				//var dropControl = AcotControl_VariableMotion.new(400,
				//																	toX, toY, fromX, fromY, this.genPointList, {this, cc.p(toX, toY), cc.p(fromX, fromY)})
				
				//sequenceControl:setFinishCallback(this.onKnockFinish, this)
				
				actor.addControl(control)
				//actor.setAutoPerspectEnable(false) //忽视透视效果
				actor.doCommand(ActorCommand.SetShadowVisible, false, null)	//隐藏阴影
				actor.setSpellPreState(null, false)
				actor.setKnockFlyContrl(control, characterState.actionState_beatback)
				
				if(this.changeColor == true){
					//actor.changeShader(map.IRenderActor.Shader_ColorPure)
					//GetHero():setAlpha(250)
					actor.setColor(255 * this.colorR, 255 * this.colorG, 255 * this.colorB)
				}
				
				this.controlMap[actor.hashCode] = control
			}
			
		}
		
		this.iteratorActorList(callback,  this.targetNameList)
		
		if(size_t(this.controlMap) == 0){
			this.finish()
		}
	 }

	 onTick(delay){
		 //for _, v in pairs(this.controlMap) do
		 for(var k in this.controlMap){
			 var v = this.controlMap[k];
			if(v.isFinish() == true){
				this.holdTime = this.holdTime - delay					//停留时间
				break;
			}
		}
		
		if(this.holdTime < 0){
			this.finish()
		}
	 }


	 onFinish(){
		 var callback = function(actor:FightActor, index){
			if(actor.isBeatBackState()){
				actor.changeIdleState()
			}
			
			var control = this.controlMap[actor.hashCode]
			if(control){
				actor.removeControl(control)
				control.finish(actor)
				control.deleteObj()
			}
			
			actor.setKnockFlyContrl()
			actor.setAutoPerspectEnable(true)
			actor.doCommand(ActorCommand.SetShadowVisible, true, null)	//隐藏阴影
			actor.setSpellPreState(null, true)
			actor.setRotate(0)
			//actor.changeShader(map.IRenderActor.Shader_Normal)
			//this.setAlpha(255)
			actor.setColor(255, 255, 255)
			
			var pos = actor.getFighterCurMapXY()
			actor.setMapXY(pos.x, pos.y)
		}
		this.iteratorActorList(callback,  this.targetNameList)
		this.controlMap = {}
	 }

	 updateActorPosition(t, param, actor){
		var fromX = param[1].x, fromY = param[1].y;
		var toX= param[0].x , toY = param[0].y;
		
		var curX = fromX + MathUtil.easeOutCubic(t, 0, toX - fromX, 1)//fromX + (toX - fromX) * t
		
		var curY = 0
		var r = 0.5
		if(t < r){
			curY = fromY - MathUtil.easeOutQuad(t, 0, this.height, r)
		}else{
			curY = fromY - this.height + MathUtil.easeOutQuad(t - r, 0, this.height, r)
		}
		//curY = fromY
		
		var rotate = this.rotate
		var r1 = 1
		var r2 = 0.6
		
		if(t < r1){
			rotate = rotate * (t / r1)
		}else if(t < r2){
			rotate = rotate
		}else{
			rotate = rotate + (90 - rotate) * ((t - r2) / (1 - r2))
		}
		
		var dir = ActorDirMap.Left
		if(actor.getSide() == fightSide.FIGHT_LEFT){
			rotate = -1 * rotate
			dir = ActorDirMap.Right
		}
		actor.setMapXY(curX, curY)
		actor.setDir(dir)
		actor.setRotate(rotate)
		
		return false
	 }
}