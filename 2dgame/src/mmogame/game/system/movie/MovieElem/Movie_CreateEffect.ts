/*
作者:
    lintianfeng
	
创建时间：
   2013.10.28(周一)

意图：
   删除特效

公共接口：
   
*/
/*
class Movie_CreateEffect extends Movie_Elem {
	effectId: number;
	x: number
	y: number
	bOnce: boolean;
	id: string;
	coorType: string;
	dir: number;
	effect: Effect;

	public initObj(...args: any[]): void {
		this.effectId = args[0].id
		this.x, this.y = args[0].x, args[0].y				//cellXY
		this.bOnce = args[0].bOnce
		this.id = args[0].var
		this.coorType = args[0].coor || "map"
		this.dir = args[0].dir || null
		this.effect = null
	}

	destory() {
		if (this.effect) {
			MovieSystem.getInstance().removeEffect(this.id)
		}
	}

	onBegin() {
		if (this.coorType == "view") {
			let pos = SceneManager.getInstance().screenXYtoMapXY(this.x, this.y)
			let mapPos = SceneManager.getInstance().mapXYtoCellXY(pos.x, pos.y)
			this.x = mapPos.x
			this.y = mapPos.y;
		}
		this.effect = MovieSystem.getInstance().createEffect(this.effectId, this.x, this.y, this.bOnce, this.id)
		if (this.dir) {
			TLog.Debug("setDir", this.dir)
			this.effect.setDir(this.dir)
		}
		this.finish()

	}

	//onTick( delay){
	//	
	//}

	onFinish() {

	}
}
*/