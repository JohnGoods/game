/*
作者:
    liuziming
	
创建时间：
   2014.12.25(周四)

意图：
   
公共接口：
   
*/
/*
class Movie_SetPlayerXY extends Movie_Elem {
	playerId
	x
	y
	public initObj(...args: any[]): void {
		this.playerId = args[0].var
		this.x = args[0].x || 0
		this.y = args[0].y || 0
	}

	onBegin() {
		this.finish()
	}

	onTick(delay) {

	}

	destory() {

	}

	onFinish() {
		let player = MovieSystem.getInstance().getPlayer(this.playerId)
		if (!player) {
			return
		}

		player.setMapXY(this.x, this.y)
	}

}*/