/*
作者:
    lintianfeng
	
创建时间：
   2013.10.28(周一)

意图：
   

公共接口：
   
*/
/*
class Movie_CreatePlayer extends Movie_Elem {
	body: number;
	x: number;
	y: number;
	name: string;
	id: string
	dir: number;
	nameColor: string;
	visible: boolean
	public initObj(...args: any[]): void {
		this.body = args[0].id || 0				//即modelId
		this.x = args[0].x || 0
		this.y = args[0].y || 0
		this.name = args[0].name
		this.id = args[0].var
		this.dir = args[0].dir || 2
		this.nameColor = args[0].nameColor || "springgreen"
		this.visible = args[0].visible
	}

	destory() {
		//if(MovieSystem.getInstance().getPlayer(this.id) ){
		//	MovieSystem.getInstance().deletePlayer(this.id)
		//}
	}

	onBegin() {
		let info: any = {}
		//TLog.Debug("onBegin",this.id)
		if (this.id != "hero") {
			info.body = this.body
			info.name = this.name
			info.id = this.id
		} else {
			info.body = GetHeroModel()
			info.name = GetHeroProperty("name")
			if (!info.name) {
				let loginInfo:LoginRole = LoginSystem.getInstance().getLoginRoleInfo()
				if (loginInfo && loginInfo.name) {
					info.name = loginInfo.name
				} else {
					TLog.Error("loginInfo.name	null ")
					info.name = ""
				}
				TLog.Debug("Movie_CreatePlayer getName ", info.name)
			}
			info.id = "hero"
			//info.cellx, info.celly=GetHero().getMapXY()
			//info.dir = hero.getDir()
			//TLog.Debug_r(GetHeroPropertyInfo())

		}
		info.cellx = this.x
		info.celly = this.y
		info.dir = this.dir
		info.nameColor = this.nameColor
		//TLog.Debug("Movie_CreatePlayer.onBegin",info.name)
		MovieSystem.getInstance().createPlayer(info, info.cellx, info.celly)
		if (this.visible == false) {
			let player = MovieSystem.getInstance().getPlayer(this.id)
			if (player) {
				player.setVisible(this.visible)
			}
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