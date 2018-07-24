class Fight_CameraMoveAction extends Fight_BaseAction{
	fromPosType:string;
	fromOffx:number;
	fromOffy:number;

	toPosType:string;
	toOffx:number;
	toOffy:number;

	moveSpeed:number;
	moveStayDuring:number;




	viewCenterX:number;
	viewCenterY:number;
	fromPos:any;
	toPos:any;

	moveFinish:boolean;
	moveStayTime:number;
	moveTime:number;


	moveDuring:number;
	normalDir:any;

	cameraId:number;


	public initObj(...args:any[]):void{
		this.fromPosType = checkNull(this.elemInfo.param1 , "caster")
		this.fromOffx = checkNull(this.elemInfo.param2 , 0)
		this.fromOffy = checkNull(this.elemInfo.param3 , 0)
		
		this.toPosType = checkNull(this.elemInfo.param4 , "targetList")
		this.toOffx = checkNull(this.elemInfo.param5 , 0)
		this.toOffy = checkNull(this.elemInfo.param6 , 0)
		
		this.moveSpeed = checkNull(this.elemInfo.param7 , 0) //每秒移动像素
		this.moveStayDuring = checkNull(this.elemInfo.param8 , 0)


		if(this.moveSpeed == 0){
			this.moveSpeed = 1
		}
		
		if(this.fromPosType != "any"){
			var point = this.getOffsetByCaster(this.fromOffx, this.fromOffy)
			this.fromOffx =point.x
			this.fromOffy = point.y 
		}else{
			var point = this.getAbsoluteXYByCaster(this.fromOffx, this.fromOffy)
			this.fromOffx = point.x
			this.fromOffy = point.y
		}
		
		
		if(this.toPosType != "any"){
			var point = this.getOffsetByCaster(this.toOffx, this.toOffy)
			this.toOffx = point.x
			this.toOffy = point.y
		}else{
			var point = this.getAbsoluteXYByCaster(this.fromOffx, this.fromOffy)
			this.fromOffx = point.x
			this.fromOffy = point.y
		}
		
		if(this.fightResult){
			this.moveSpeed 				= this.fightResult.getActionSpeed(this.moveSpeed)
			this.moveStayDuring		= this.fightResult.getActionDuration(this.moveStayDuring)
		}
	}


	getMapPosByType(posType, offx, offy){
		var mapPos:any = {}
	
		if(posType == "caster"){
			mapPos = this.casterActor.getPositionXY()
			mapPos.x = mapPos.x + offx
			mapPos.y = mapPos.y + offy
			
		}else if(posType == "targetList"){
			var targetActor = this.fightResult.getActionObjectByName("targetList")[0]
			if(targetActor == null){
				targetActor = this.casterActor
			}
			mapPos = targetActor.getPositionXY()
			mapPos.x = mapPos.x + offx
			mapPos.y = mapPos.y + offy
			
		}else if(posType == "any"){
			mapPos = SceneManager.getInstance().screenXYtoMapXY(offx, offy)
		}
		return mapPos
	}


	onPlay(){
		if(this.casterActor == null){
			this.finish()
			return
		}
		
		var sceneMgr:SceneManager = SceneManager.getInstance()

		var point = sceneMgr.getCameraXY();

		this.viewCenterX = point.x
		this.viewCenterY = point.y
		
		this.fromPos = this.getMapPosByType(this.fromPosType, this.fromOffx, this.fromOffy)
		this.toPos = this.getMapPosByType(this.toPosType, this.toOffx, this.toOffy)
		this.moveFinish = false
		this.moveStayTime = 0
		this.moveTime = 0
		
		var vecDir = MathUtil.pSub(this.toPos, this.fromPos)
		var length = MathUtil.pGetLength( vecDir )
		if(length == 0){
			this.moveFinish = true
			return
		}
		
		//需要移动的时间
		this.moveDuring = (length / this.moveSpeed) * 1000 //-化成毫秒
		
		this.normalDir = {}
		this.normalDir.x = vecDir.x / length
		this.normalDir.y = vecDir.y / length
		
		this.cameraId = sceneMgr.startCameraMove()
	}


	onTick(delay){
		if(this.moveFinish){
			this.moveStayTime = this.moveStayTime + delay
			
			if(this.moveStayTime >= this.moveStayDuring){
				this.finish()
			}
			
			return
		}
		
		this.moveTime = this.moveTime + delay
		if(this.moveTime > this.moveDuring){
			this.moveTime = this.moveDuring
			
			this.moveFinish = true
		}
		
		var x = this.fromPos.x + (this.normalDir.x * this.moveSpeed) * (this.moveTime/1000)
		var y = this.fromPos.y + (this.normalDir.y * this.moveSpeed) * (this.moveTime/1000)
		
		SceneManager.getInstance().updateCameraMove(this.cameraId, x, y)
	}


	onFinish(){
		if(this.cameraId){
			SceneManager.getInstance().stopCameraMove(this.cameraId)
			this.cameraId = null
		}
	}
}