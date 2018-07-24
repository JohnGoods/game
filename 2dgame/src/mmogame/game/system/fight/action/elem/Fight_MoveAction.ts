class Fight_MoveAction extends Fight_BaseAction{

	targetName:string;

	
	fromPosType:string;
	fromOffx:number
	fromOffy:number

	toPosType:string;
	toOffx:number
	toOffy:number

	moveType:number;
	moveSpeed

	coffx1:number
	coffy1:number
	coffx2:number
	coffy2:number

	crandom:number;

	targetNameList:string[];
	controlMap:any;
	yDir:number

	finishMoveCount:number;


	public initObj(...args:any[]):void{
		this.targetName = checkNull(this.elemInfo.param1 , "caster")

		//any caster targetList
		this.fromPosType = checkNull(this.elemInfo.param2 , "caster")
		this.fromOffx = checkNull(this.elemInfo.param3 , 0)
		this.fromOffy = checkNull(this.elemInfo.param4 , 0)
		
		this.toPosType = this.elemInfo.param5 , "targetList"
		this.toOffx = checkNull(this.elemInfo.param6 , 0)
		this.toOffy = checkNull(this.elemInfo.param7 , 0)
		
		this.moveType = checkNull(this.elemInfo.param8 , ENUM_FIGHT_MOVE_TYPE.MOVE_LINE_TIME)
		this.moveSpeed = checkNull(this.elemInfo.param9 , 500)//每1秒移动X像素
		
		this.coffx1 =checkNull( this.elemInfo.param10 , 0)//控制点1
		this.coffy1 = checkNull(this.elemInfo.param11 , 0)
		this.coffx2 = checkNull(this.elemInfo.param12 , 0)//控制点2
		this.coffy2 = checkNull(this.elemInfo.param13 , 0) 
		
		this.crandom =checkNull( this.elemInfo.param14 , 0) 
		this.yDir =checkNull( this.elemInfo.param14 , 1) 
		if(this.crandom > 0){
			this.coffx1 = this.coffx1 + MathUtil.random(this.crandom)
			this.coffy1 = this.coffy1 + MathUtil.random(this.crandom)
			this.coffx2 = this.coffx2 + MathUtil.random(this.crandom)
			this.coffy2 = this.coffy2 + MathUtil.random(this.crandom)
		}
		
		//因为编辑器以攻击者在右边处理
		//所以如果角色是左边，就要调整偏移

		var fromPos;
		if(this.fromPosType != "any"){
			fromPos = this.getOffsetByCaster(this.fromOffx, this.fromOffy)
		}else{
			fromPos = this.getAbsoluteXYByCaster(this.fromOffx, this.fromOffy)
		}
		this.fromOffx = fromPos.x
		this.fromOffy = fromPos.y;

		var toPos;
		if(this.toPosType != "any"){
			toPos = this.getOffsetByCaster(this.toOffx, this.toOffy)
		}else{
			toPos = this.getAbsoluteXYByCaster(this.toOffx, this.toOffy)
		}
		this.toOffx = toPos.x
		this.toOffy = toPos.y;
		
		var pos = this.getOffsetByCaster(this.coffx1, this.coffy1)
		this.coffx1 = pos.x
		this.coffy1 = pos.y

		pos = this.getOffsetByCaster(this.coffx2, this.coffy2)
		this.coffx2 = pos.x
		this.coffy2 = pos.y


		this.targetNameList = splitString(this.targetName, ",")
		this.controlMap = {}
		
		if(this.fightResult){
			this.moveSpeed = this.fightResult.getActionSpeed(this.moveSpeed)
		}
	}


	getMapPosByType(targetList,index, posType, offx, offy){
		
		var targetPos:any = null
		targetPos = this.casterActor.getPositionXY()
		
		var traceActor = null
		var flag = true
		
		if(posType == "any"){
			
			targetPos = SceneManager.getInstance().screenXYtoMapXY(offx, offy)
			
		}else if(posType == "targetList"){
			var targetActor = targetList[index]
			if(targetActor == null){
				targetActor =targetList[0] //如果为空，则选择第一个
				
				if(targetActor == null){ //如果连一个目标都没有
					targetActor = this.casterActor
				}
			}
			//默认放在目标前方
			let [dx, dy] = [70 * Math.cos(Math.PI / 2 + FIGHT_MAP_ANGLE * 2.3), 70 * Math.sin(Math.PI / 2 + FIGHT_MAP_ANGLE * 2.3)]
			let pos = this.getOffsetByCaster(dx, dy, this.yDir)

			targetPos = targetActor.getPositionXY()
			targetPos.x = targetPos.x + offx + pos.x
			targetPos.y = targetPos.y + offy + pos.y
			
			traceActor = targetActor
		}else if(posType == "casterOrigin"){
			
			targetPos = this.fightResult.getCasterOriginXY()
			targetPos.x = targetPos.x + offx
			targetPos.y = targetPos.y + offy
			
		}else if(posType == "backLine"){
			var actor_list = GetFightActorList()
			var mapx = 0
			var mapy = 0
			var count = 0		

			for(var k in actor_list){
				var actor = actor_list[k]
				if(actor.isDeadState() == false && actor.getSide() != this.casterActor.getSide() && actor.getPos() < 19 && actor.getPos() > 12){//敌方
					let pos = actor.getPositionXY()
					mapx = mapx + pos.x
					mapy = mapy + pos.y
					
					count = count + 1
				}
			}

			if(count == 0){
				for(var k in actor_list){
					var actor = actor_list[k]
					if(actor.isDeadState() == false && actor.getSide() != this.casterActor.getSide() && actor.getPos() < 13){//敌方
						let pos = actor.getPositionXY()
						mapx = mapx + pos.x
						mapy = mapy + pos.y
						
						count = count + 1
					}
				}	
			}
			
			var ox, of = this.getOffsetByCaster(50, 30, this.yDir)
			targetPos.x = mapx / count + offx - ox
			targetPos.y = mapy / count + offy
			
		}else if(StringUtil.stringMatch(posType, /target(\d+)/)){
			targetList = this.fightResult.getActionObjectByName(posType)
			var targetActor = targetList[0]
			if(targetActor){
				targetPos = targetActor.getPositionXY()
				targetPos.x = targetPos.x + offx
				targetPos.y = targetPos.y + offy
				
				traceActor = targetActor
			}else{
				flag = false
			}
		}else{ //caster
			//default value	
			targetPos.x = targetPos.x + offx
			targetPos.y = targetPos.y + offy
			
			traceActor = this.casterActor
		}
		
		return [targetPos, traceActor, flag]
	}


	onPlay(){
		if(this.casterActor == null){
			this.finish()
			return
		}
		
		//如果是施法者还要坚持是不是冲刺状态
		// if(this.targetName == "caster"){
		// 	if(this.casterActor.isRushState() == false){
		// 		TLog.Error("caster isn't Rush State skillId:%d", this.fightResult.result.spellId)
		// 		this.finish()
		// 		return
		// 	}
			
		// }
		
		var objectList:any[] = this.getActionObjectList(this.targetNameList)
		if(objectList.length == 0){
			this.finish()
			return
		}
		
		this.finishMoveCount = 0
		
		var thiz = this;
		var GetTraceActor = function(id){
			return thiz.fightResult.getActionObject(id)
		}
		
		var targetList = this.fightResult.getActionObjectByName("targetList")
		
		//for index, object in ipairs(objectList) do
		for(var index = 0; index < objectList.length; index++){
			var object:Actor = objectList[index];
			
			var ret = this.getMapPosByType(targetList, index, this.fromPosType, this.fromOffx, this.fromOffy)
			var ret2 = this.getMapPosByType(targetList, index, this.toPosType, this.toOffx, this.toOffy)


			var fromPos = ret[0]
			var toPos = ret2[0], traceActor = ret2[1], flag = ret2[2]
			
			if(flag){
				object.setMapXY(fromPos.x, fromPos.y)
				
				var control = null
				//移动方式
				if(this.moveType == ENUM_FIGHT_MOVE_TYPE.MOVE_LINE_TIME){//直线移动
					control = ActorControl_LineMoveTime.newObj(this.during, fromPos.x, fromPos.y, toPos.x, toPos.y)
					
				}else if(this.moveType == ENUM_FIGHT_MOVE_TYPE.MOVE_TRACE){//追踪
					if(traceActor == null){
						control = ActorControl_LineMoveTime.newObj(this.during, fromPos.x, fromPos.y, toPos.x, toPos.y)
					}else{
						control = ActorControl_TraceMove.newObj(this.moveSpeed, traceActor.getCombatId(), GetTraceActor, this.toOffx, this.toOffy)
					}
					
				}else if(this.moveType == ENUM_FIGHT_MOVE_TYPE.MOVE_CURVE){//曲线
					
					var cx1 = this.coffx1 + fromPos.x
					var cy1 = this.coffy1 + fromPos.y
					var cx2 = this.coffx2 + fromPos.x
					var cy2 = this.coffy2 + fromPos.y
					
					control = ActorControl_CurveMove.newObj(this.moveSpeed, fromPos.x, fromPos.y, toPos.x, toPos.y,
																			cx1, cy1, cx2, cy2)
				}else if(this.moveType == ENUM_FIGHT_MOVE_TYPE.MOVE_INSTANT){//瞬移	
					this.finishMoveCount = this.finishMoveCount + 1//直接完成
					object.setMapXY(toPos.x, toPos.y)
				}
				
				//object:faceToXY(toPos.x, toPos.y)
				
				if(control){
					control.setFinishCallback(this.onMoveFinish, this)
					object.addControl(control)
					this.controlMap[object.hashCode] = control
				}
			}else{
				this.finishMoveCount = this.finishMoveCount + 1
			}
		}
		
		if(this.finishMoveCount >= objectList.length){
			this.finish()
		}
	}


	onMoveFinish(actor){
		this.finishMoveCount = this.finishMoveCount + 1
	}


	onTick(delay){
		var targetList = this.getActionObjectList(this.targetNameList)
		
		if(this.finishMoveCount >= targetList.length){
			this.finish()
			return
		}
	}


	onFinish(){
		var targetList = this.getActionObjectList(this.targetNameList)


		targetList.forEach((object:Actor)=>{
			var control = this.controlMap[object.hashCode]
			if(control){
				object.removeControl(control)
				control.finish(object)
				control.deleteObj()
			}
		})
		
		this.controlMap = {}
	}
}