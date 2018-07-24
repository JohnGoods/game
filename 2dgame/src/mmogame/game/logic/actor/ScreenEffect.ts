/*
作者:
    yangguiming
	
创建时间：
    2014.10.30(星期四) 

意图：
  屏幕特效

公共接口：
	
*/



class ScreenEffect extends Effect {
	screenLayer: number;
	bEnterCamera: boolean;

	public initObj(...args: any[]): void {
		this.setAnimNotifyEnable(false)
		this.setTouchEnable(false)

		this.bEnterCamera = false
		this.screenLayer = 0
	}

	destory() {
		if (this.bEnterCamera) {
			SceneManager.getInstance().removeScreenEffect(this)
		}
	}

	getActorType() {
		return actor_Type.ACTOR_TYPE_EFFECT
	}

	enterMap(layer) {
		TLog.Assert(false) //镜头特效不能进入地图
	}

	leaveMap() {
		TLog.Assert(false)
	}


	onAnimOneCycle(action_id) {

	}

	setScreenLayer(layer) {
		this.screenLayer = layer
	}

	getScreenLayer() {
		return this.screenLayer
	}


	onEnterCamera() {
		TLog.Assert(!this.bEnterCamera)
		this.bEnterCamera = true
	}

	onLeaveCamera() {
		TLog.Assert(this.bEnterCamera)
		this.bEnterCamera = false
	}

	setPositionXY(x, y) {

		let sx = x + IGlobal.stageWidth / 2
		let sy = y + IGlobal.stageHeight / 2
		super.setPositionXY( sx, sy)
	}

	getPositionXY() {
		let sp = super.getPositionXY()
		sp.x = sp.x - IGlobal.stageWidth / 2
		sp.y = sp.y - IGlobal.stageHeight / 2
		return sp 
	}
}