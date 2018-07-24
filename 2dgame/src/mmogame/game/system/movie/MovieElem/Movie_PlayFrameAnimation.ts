/*
作者:
    panjunhua
	
创建时间：
   2014.12.3(周三)

意图：
   

公共接口：
   
*/
/*
class Movie_PlayFrameAnimation extends Movie_Elem {
	registerEvent
	frameName
	public initObj(...args: any[]): void {
		this.frameName = args[0].var
	}

	onBegin() {
		RegisterEvent(EventDefine.UI_HIDE, this.checkEvent, this) //记录刷新
		TLog.Debug("Movie_PlayFrameAnimation.onBegin show", this.frameName)
		//Icon_OpenLoadedWindows(this.frameName)
		 WngMrg.getInstance().showWindow(this.frameName)
		this.registerEvent = true
	}

	destory() {
		let wnd = WngMrg.getInstance().getWindow(this.frameName)
		if (wnd.isVisible()) {
			wnd.hideWnd()
		}
		if (this.registerEvent) {
			UnRegisterEvent(EventDefine.UI_HIDE, this.checkEvent, this)
			this.registerEvent = false
		}
	}


	checkEvent(args) {
		if (this.frameName == args.window.classname) {
			TLog.Debug("Movie_PlayFrameAnimation.checkEvent", args.window.classname, this.frameName)
			this.finish()
		}
	}

	onTick(delay) {

	}

	onFinish() {
		UnRegisterEvent(EventDefine.UI_HIDE, this.checkEvent, this) //记录刷新
		//TLog.Debug("Movie_PlayFrameAnimation.onFinish")
		//io.read()
		let wnd = WngMrg.getInstance().getWindow(this.frameName)
		if (wnd.isVisible()) {
			wnd.hideWnd()
		}
		this.registerEvent = false
	}
}*/