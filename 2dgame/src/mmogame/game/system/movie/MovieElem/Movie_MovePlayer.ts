/*
作者:
    lintianfeng
	
创建时间：
   2013.10.28(周一)

意图：
   

公共接口：
   
*/

/*
class Movie_MovePlayer extends Movie_Elem {
	SPEED_RATIO = 10

	playId
	speed
	bCamera
	saveSpeed
	dir
	coorType

	mapX
	mapY
	public initObj(...args: any[]): void {
		this.playId = args[0].var
		this.speed = args[0].speed || 1
		this.bCamera = args[0].camera
		this.saveSpeed = 1
		this.dir = args[0].dir || null

		//坐标系类型
		this.coorType = args[0].coor || "map"		//"map"/"view"
		if (this.coorType == "map") {
			let mapPos = SceneManager.getInstance().cellXYtoMapXY(args[0].x, args[0].y)
			this.mapX = mapPos.x
			this.mapY = mapPos.y
		} else {
			this.mapX = args[0].x
			this.mapY = args[0].y
		}

	}

	onBegin() {
		let player = MovieSystem.getInstance().getPlayer(this.playId)
		if (!player) {
			this.finish()
			return
		}
		if (this.bCamera) {
			SceneManager.getInstance().cameraLinkActor(player)
		}
		this.saveSpeed = player.getMoveSpeed()
		player.setMoveSpeed(this.speed * this.SPEED_RATIO)


		let beginPos = SceneManager.getInstance().getCameraViewBeginXY()
		let begin_x = beginPos.x
		let begin_y = beginPos.y
		if (this.coorType == "view") {
			this.mapX = this.mapX + begin_x
			this.mapY = this.mapY + begin_y
		}
		//if(player.isVisible()==false ){
		//player.setVisible(true)
		//}
		player.wantToGo(this.mapX, this.mapY, true)
		//TLog.Debug("Movie_MovePlayer.onBegin",this.playId)
	}

	onTick(delay) {
		let player = MovieSystem.getInstance().getPlayer(this.playId)
		let pos = player.getMapXY()
		let x = pos.x, y = pos.y
		//TLog.Debug("Movie_MovePlayer.onTic",x,y,this.mapX,this.mapY,this.playId)
		if (this.mapX > x - 20 && this.mapX < x + 20) {
			if (this.mapY > y - 20 && this.mapY < y + 20) { //|| player.isState(characterState.actionState_idle) ){
				this.finish()
			}
		}
	}

	destory() {

	}

	onFinish() {
		//TLog.Debug("Movie_MovePlayer.onFinish",this.playId)
		let player = MovieSystem.getInstance().getPlayer(this.playId)
		//TLog.Debug_r(player)
		if (!player) {
			return
		}

		player.setMoveSpeed(this.saveSpeed)
		player.moveStop()
		player.setMapXY(this.mapX, this.mapY)
		if (this.dir) {
			player.setDir(this.dir)
		}
		if (this.bCamera) {
			SceneManager.getInstance().cameraUnLinkActor()
			let mapPos = player.getMapXY()
			SceneManager.getInstance().lookAtCenter(mapPos.x, mapPos.y)
		}
	}
}*/