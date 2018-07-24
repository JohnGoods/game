class Fight_CameraZoomAction extends Fight_BaseAction{

	srcValue:number;
	dstValue:number;
	zoomDuringTime:number;
	moveStayDuring:number;


	cameraId:number;
	zoomTime:number;

	public initObj(...args:any[]):void{
		this.srcValue = checkNull(this.elemInfo.param1 , 1) 
		this.dstValue = checkNull(this.elemInfo.param2 , 1 )
		
		this.zoomDuringTime = checkNull(this.elemInfo.param3 , 1)
		
		if(this.fightResult){
			this.moveStayDuring		= this.fightResult.getActionDuration(this.zoomDuringTime)
		}
	}


	onPlay(){
		var sceneMgr = SceneManager.getInstance()
		this.cameraId = sceneMgr.startCameraZoom()
		this.zoomTime = 0
	}

	onTick(delay){
		this.zoomTime = this.zoomTime + delay
		if(this.zoomTime > this.zoomDuringTime){
			this.zoomTime = this.zoomDuringTime
		}
		
		var s = this.srcValue + this.zoomTime /this.zoomDuringTime  * (this.dstValue - this.srcValue)
		SceneManager.getInstance().updateCameraZoom(this.cameraId, s)
	}

	onFinish(){
		SceneManager.getInstance().stopCameraZoom(this.cameraId)
	}
}