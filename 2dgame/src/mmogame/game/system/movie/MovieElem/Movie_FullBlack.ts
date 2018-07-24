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
class Movie_FullBlack extends Movie_Elem {
	maxTime
	blackType
	blackTime
	time
	window
	public initObj(...args: any[]): void {
		this.maxTime = args[0].var || 1000
		this.blackType = args[0].blackType || false
		this.blackTime = args[0].blackTime || 200
		this.time = 0
	}

	onBegin() {
		this.time = 0
		let value = null
		if (this.blackType != false) {
			value = 1
		}
		this.window = WngMrg.getInstance().getWindow("FullBalckFrame")
		this.window.setWindowTYpe(value, this.blackTime)
		this.window.showWnd()
	}

	onTick(delay) {
		this.time = this.time + delay
		let maxTime = this.maxTime
		if (this.time > maxTime) {
			this.finish()
		}
	}

	destory() {

	}

	onFinish() {
		if (this.blackType != false) {
			//this.window.unLoadWnd()
			this.window.playAlphaChange(2)
		} else {
			this.window.hideWnd()
		}
	}
}*/