/* 
作者: 
lintianfeng

创建时间： 
2014.2.18(周二) 

意图： 


公共接口： 

*/
//modify:yangguiming
// class FullBalckFrame extends BaseWnd {


// 	bgAlphaChang1: AlphaAction
// 	bgAlphaChange2: AlphaAction
// 	gradualChange: boolean;
// 	callBackFunc: Function;
// 	callBackObj: any;

// 	blackTime: number;
// 	saveHideTime: number;


// 	public initObj(...args: any[]): void {
// 		this.mElemList = {}
// 		this.gradualChange = null

// 		this.callBackFunc = null
// 		this.callBackObj = null

// 		this.blackTime = 200
// 		this.saveHideTime = 200
// 	}

// 	onLoad() {
// 		this.create_frame()
// 	}

// 	onUnLoad() {
// 		//this.bgAlphaChange2 = null
// 	}

// 	onShow() {
// 		//TLog.Debug("FullBalckFrame.onShow",this.gradualChange)	
// 		//TLog.Debug("FullBalckFrame.onShow",this.showCount,this.gradualChange)
// 		this.mLayoutNode.visible = (true)
// 		if (this.gradualChange) {
// 			this.mLayoutNode.alpha = 0
// 			//TLog.Debug("FullBalckFrame.onShow",22222222222222222)		
// 			this.bgAlphaChang1.run()
// 		} else {
// 			this.mLayoutNode.alpha = 1
// 		}
// 	}

// 	onHide() {
// 		this.mLayoutNode.visible = (false)
// 	}

// 	create_frame() {

// 		this.setFullScreen(true)
// 		this.mLayoutNode.setLayer(gui.GuiLayer.Top)

// 		let ElemInfo: any = [
// 			//{["index_type"] : gui.ControlType.Label,  					["name"] : "wnd1", 			["scale_image"] : "ty_UIBg01", ["x"] : 0, 	["y"] : 0, 	 ["w"] : 640,  ["h"] : 960,  ["event_name"] : null, ["fun_index"] : null,},  						
// 			{ ["index_type"]: eui.Rect, ["name"]: "wnd", ["color"]: gui.Color.ublack, ["alpha"]: 1, ["x"]: 0, ["y"]: 0, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: null, ["fun_index"]: null, ["touchChildren"]: true, },
// 		]
// 		UiUtil.createElem(ElemInfo, this.mLayoutNode, this.mElemList, this)

// 		this.mLayoutNode.touchChildren = false;

// 		let data1: any = { ["alpha"]: 255 }
// 		this.bgAlphaChang1 = AlphaAction.newObj(this.mLayoutNode, this.blackTime, data1, this.refreshFrame, this)
// 		let data2: any = { ["alpha"]: 0 }
// 		this.bgAlphaChange2 = AlphaAction.newObj(this.mLayoutNode, this.blackTime, data2, this.onChangeEnd, this)

// 	}



// 	refreshFrame() {
// 		if (this.callBackFunc) {
// 			this.callBackFunc.call(this.callBackObj)
// 			this.callBackFunc = null
// 			this.callBackObj = null
// 		}
// 	}
// 	onCloseFrame() {
// 		this.mLayoutNode.visible = (false)
// 		this.gradualChange = null
// 	}

// 	fastFinishAlphaChange() {
// 		//TLog.Debug("FullBalckFrame.fastFinishAlphaChange",this.bgAlphaChang1,this.bgAlphaChang2)
// 		if (this.bgAlphaChang1 && this.bgAlphaChang1.isRunning()) {
// 			this.bgAlphaChang1.finish()
// 		}
// 		if (this.bgAlphaChange2 && this.bgAlphaChange2.isRunning()) {
// 			this.bgAlphaChange2.finish()
// 		}
// 	}

// 	playAlphaChange(index) {
// 		if (index == 2 && this.gradualChange) {
// 			//TLog.Debug("FullBalckFrame.playAlphaChange",22222222222222222)	
// 			if (!this.mLayoutNode) {
// 				this.showWnd()
// 			}
// 			this.mLayoutNode.alpha = 1
// 			let data2: any = { ["alpha"]: 0 }
// 			let time = this.saveHideTime || 200
// 			this.bgAlphaChange2 = AlphaAction.newObj(this.mLayoutNode, time, data2, this.onChangeEnd, this)
// 			this.bgAlphaChange2.run()
// 		}
// 	}

// 	playChangeHide(time) {
// 		//TLog.Debug("FullBalckFrame.playChangeHide",time,this.mLayoutNode) 
// 		if (time) {
// 			if (!this.mLayoutNode) {
// 				this.showWnd()
// 			}
// 			this.mLayoutNode.alpha = 1
// 			let data2: any = { ["alpha"]: 0 }
// 			this.saveHideTime = time
// 			this.bgAlphaChange2 = AlphaAction.newObj(this.mLayoutNode, time, data2, this.onChangeEnd, this)
// 			//TLog.Debug("FullBalckFrame.FullBalckFrame.playChangeHide",22222222222222222)		
// 			this.bgAlphaChange2.run()
// 			//TLog.Debug("FullBalckFrame.playChangeHide",time) 
// 		}
// 	}


// 	setWindowTYpe(change, blackTime, callBack, callBackObj) {
// 		//TLog.Debug("FullBalckFrame.setWindowTYpe",change,blackTime,callBack,callBackObj)
// 		this.gradualChange = change || null
// 		this.blackTime = blackTime || 200
// 		let data1: any = { ["alpha"]: 255 }
// 		this.bgAlphaChang1 = AlphaAction.newObj(this.mLayoutNode, this.blackTime, data1, this.refreshFrame, this)
// 		let data2: any = { ["alpha"]: 0 }
// 		this.bgAlphaChange2 = AlphaAction.newObj(this.mLayoutNode, this.blackTime, data2, this.onChangeEnd, this)

// 		this.callBackFunc = callBack || null
// 		this.callBackObj = callBackObj || null

// 	}

// 	onChangeEnd() {
// 		//TLog.Debug("FullBalckFrame.onChangeEnd")
// 		this.hideWnd()
// 	}
// }