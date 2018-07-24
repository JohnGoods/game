class Fight_CameraTraceAction extends Fight_BaseAction{

	zoomType:string;
	offX:number;
	offY:number;

	traceZoomActorId:number;
	cameraId:number;
	bTraceActor:boolean;


	public initObj(...args:any[]):void{
		this.zoomType = checkNull(this.elemInfo.param1 , "caster")
		this.offX = checkNull(this.elemInfo.param2 , 0)
		this.offY = checkNull(this.elemInfo.param3 , 0)
		
		//TLog.Debug("this.elemInfo.param4 ", this.elemInfo.param4 )
		this.bTraceActor = checkNull(this.elemInfo.param4, true);

		var pos = null;
		if(this.zoomType != "any"){
			pos = this.getOffsetByCaster(this.offX, this.offY)
		}else{
			pos = this.getAbsoluteXYByCaster(this.offX, this.offY)
		}

		this.offX = pos.x;
		this.offY = pos.y;
	
	}



	onPlay(){
		if(this.casterActor == null){
			this.finish()
			return
		}
		
		this.traceZoomActorId = null
		
		var sceneMgr = SceneManager.getInstance()
		if(this.zoomType == "caster"){
			this.traceZoomActorId = this.casterActor.getCombatId()
			
		}else if(this.zoomType == "targetList"){
			var targetActor = this.fightResult.getActionObjectByName("targetList")[0]
			if(targetActor == null){
				this.finish()
				return
			}
			this.traceZoomActorId = targetActor.getCombatId()
			
		}else if(this.zoomType == "any"){
			var cx, cy = sceneMgr.screenXYtoMapXY(this.offX, this.offY)
			sceneMgr.lookAtCenter(cx, cy)
		}else{
			this.finish()
			return
		}
		
		this.cameraId = sceneMgr.startCameraMove()

		TLog.Debug("this.bTraceActor", this.bTraceActor)
		if(this.bTraceActor == false  ){
			let actor:FightActor = this.fightResult.getActionObject(this.traceZoomActorId)
			if(actor ){
				let pos = actor.getPositionXY()
				SceneManager.getInstance().updateCameraMove(this.cameraId, pos.x + this.offX, pos.y + this.offY)
			}
		}
	}


	onTick(delay){
		if(this.traceZoomActorId && this.bTraceActor){
			var bFinish = true
			
			var sceneMgr = SceneManager.getInstance()
			var actor = this.fightResult.getActionObject(this.traceZoomActorId)
			
			if(actor){
				var cpoint = actor.getPositionXY();
				sceneMgr.updateCameraMove(this.cameraId, cpoint.x + this.offX, cpoint.y + this.offY)
				bFinish = false
			}
			
			if(bFinish){
				this.finish()
			}
			
		}
	}


	onFinish(){
		if(this.traceZoomActorId){
			SceneManager.getInstance().stopCameraMove(this.cameraId)
			this.traceZoomActorId = null
		}
	}
}