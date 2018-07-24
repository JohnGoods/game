/*
作者:
    lintianfeng
	
创建时间：
   2013.10.28(周一)

意图：
   

公共接口：
   
*/
/*
class Movie_MoveCamera extends Movie_Elem {
	mapX
	mapY
	max_time
	nowX
	nowY

	beginX
	beginY;

	offset_x
	offset_y

	public initObj(...args: any[]): void {
		//let mapInstance = gb.map_sys.GetMap()
		//this.begin_x = mapInstance.GetViewBeginX()
		//this.begin_y = mapInstance.GetViewBeginY()

		let mapPos = SceneManager.getInstance().cellXYtoMapXY(args[0].x, args[0].y)
		this.mapX = mapPos.x, this.mapY = mapPos.y
		this.max_time = args[0].time || 2000
		this.nowX = 0
		this.nowY = 0
	}

	onBegin() {
		SceneManager.getInstance().cameraUnLinkActor()
		let pos = SceneManager.getInstance().getCameraXY()
		this.beginX = pos.x, this.beginY = pos.y
		this.offset_x = this.mapX - this.beginX
		this.offset_y = this.mapY - this.beginY
		this.nowX = this.beginX
		this.nowY = this.beginY
	}

	onTick(delay) {
		let bit = delay / this.max_time
		if (this.mapX == this.nowX && this.mapY == this.nowY) {
			this.finish()
		} else {
			this.nowX = this.nowX + bit * this.offset_x
			this.nowY = this.nowY + bit * this.offset_y
			if (this.mapX > this.beginX) {
				if (this.nowX > this.mapX) {
					this.nowX = this.mapX
				}
			} else {
				if (this.nowX < this.mapX) {
					this.nowX = this.mapX
				}
			}

			if (this.mapY > this.beginY) {
				if (this.nowY > this.mapY) {
					this.nowY = this.mapY
				}
			} else {
				if (this.nowY < this.mapY) {
					this.nowY = this.mapY
				}
			}
			SceneManager.getInstance().lookAtCenter(this.nowX, this.nowY)
		}
		//let mapInstance = gb.map_sys.GetMap()
	}

	destory() {
		SceneManager.getInstance().cameraLinkActor(GetHero())
	}

	onFinish() {
		SceneManager.getInstance().lookAtCenter(this.mapX, this.mapY)
	}
}*/