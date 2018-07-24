/* 
作者: 
  lintianfeng 

创建时间： 
  2014.1.04(周六) 

意图： 
	说话窗口，上下黑框

公共接口： 

*/
/*
class Movie_Speak extends Movie_Elem {
	playId
	text
	hideBust
	modelOffx
	modelOffy
	max_time
	time
	filp
	public initObj(...args: any[]): void {
		this.playId = args[0].var
		this.text = args[0].text
		this.hideBust = args[0].bOnce || null
		this.modelOffx = args[0].modelOffx
		this.modelOffy = args[0].modelOffy
		this.max_time = args[0].showTime || 3000
		this.filp = checkNull(args[0].filp, false)				//半身像是否正反
		this.time = 0
		//TLog.Debug("init",args[0].bOnce)
	}

	onBegin() {
		this.showFrame()
	}

	onTick(delay) {
		//this.time = this.time + delay
		//if(this.time > this.max_time ){
		//	this.finish()
		//}
	}

	destory() {

	}

	onFinish() {
		//WngMrg.getInstance().hideWindow("MovieDramaFrame")
		//let window = WngMrg.getInstance().getWindow("MovieDramaFrame")
		//window.hideDialog()
		
		//window.hideWnd()
	}

	//////////////////////////////////////////////////////
	showFrame() {
		let player = MovieSystem.getInstance().getPlayer(this.playId)
		if (!player) {
			return
		}

		//TLog.Debug("dir",player.getDir())
		let modeId
		let dir = player.getDir()
		let name = player.getProperty("name")
		if (player.classname == "FightActor") {
			let [config, _] = GetFightActorConfig(player)

			modeId = GetActorModel(player.getProperty("entry"), player.getProperty("sexId"))
			if (config && config.Name) {
				name = config.Name
			}
		} else {
			modeId = player.getProperty("body")
			if (this.playId == "hero") {
				modeId = "player"
				//let info = LoginSystem.getInstance().GetsaveLoginName()
				//TLog.Debug_r(info)
				//TLog.Debug("name",name,GetHeroPropertyInfo("name"))
				//io.read()
			}
		}

		//TLog.Debug("showFrame modeId",modeId, this.playId,name,player.classname)
		//let window = WngMrg.getInstance().getWindow("MovieDramaFrame")
		//window.showSpeaking(name, this.text, modeId, dir, this.hideBust, this.modelOffx, this.modelOffy, this.filp)
	}
}*/