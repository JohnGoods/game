/*
作者:
    liuziming
	
创建时间：
   2017.08.04(周五)

意图：
   剧情表演时黑色背景
公共接口：
   
*/
//modify:yangguiming
// class MovieBackGroundFrame extends BaseWnd {
// 	controlDataTable
// 	contrlList
// 	timerList
// 	reactClick
// 	public initObj(...args: any[]): void {
// 		this.controlDataTable = {}
// 		this.contrlList = {}
// 		this.timerList = {}
// 	}

// 	onLoad() {
// 		this.createFrame()
// 	}

// 	onUnLoad() {
// 		for (let _ in this.contrlList) {
// 			let v = this.contrlList[_]

// 			v.deleteObj()
// 		}

// 		this.contrlList = {}
// 		this.controlDataTable = {}
// 	}

// 	onShow() {
// 		this.reactClick = false
// 		this.mLayoutNode.visible = (true)
// 		this.refreshFrame()
// 	}

// 	onHide() {
// 		this.mLayoutNode.visible = (false)

// 		for (let _ in this.timerList) {
// 			let timer = this.timerList[_]

// 			KillTimer(timer)
// 		}
// 		this.timerList = {}
// 	}

// 	////////////////////////////////////////////////////////////////////-
// 	createFrame() {

// 		this.setFullScreen(true)
// 		this.mLayoutNode.setLayer(gui.GuiLayer.Top)

// 		let ElemInfo: any = [
// 			//{["index_type"] : gui.ControlType.Label,  					["name"] : "wnd1", 			["scale_image"] : "ty_UIBg01", ["x"] : 0, 	["y"] : 0, 	 ["w"] : 640,  ["h"] : 960,  ["event_name"] : null, ["fun_index"] : null,},  						
// 			{ ["index_type"]: eui.Rect, ["name"]: "wnd", ["color"]: gui.Color.ublack, ["alpha"]: 1, ["x"]: 0, ["y"]: 0, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: null, ["fun_index"]: null, ["touchEnabled"]: false, },
// 		]
// 		UiUtil.createElem(ElemInfo, this.mLayoutNode, this.mElemList, this)
		
// 		this.mLayoutNode.touchChildren = false;
// 		this.mLayoutNode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickFrame, this)
// 	}

// 	refreshFrame() {

// 	}

// 	////////////////////////////////////////////////////////////-响应函数//////////////////////////////////////////////////////////////////////
// 	onReturn(args) {
// 		return this.hideWnd()
// 	}

// 	onClickFrame(args) {
// 		if (this.reactClick == false) {
// 			return
// 		}

// 		MovieSystem.getInstance().skipNextElem()
// 	}

// 	////////////////////////////////////////////////////////////公共接口////////////////////////////////
// 	setClickEnable(enable) {
// 		this.reactClick = enable
// 	}
// }