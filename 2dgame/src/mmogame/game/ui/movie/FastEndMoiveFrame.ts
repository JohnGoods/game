/* 
作者: 
panjunhua

创建时间： 
2014.11.4(周二) 

意图： 


公共接口： 

*/
//modify:yangguiming
// class FastEndMoiveFrame extends BaseWnd {
// 	public initObj(...args: any[]): void {
// 		RegisterEvent(EventDefine.STATE_ACTIVE, this.onStateActive, this)
// 		RegisterEvent(EventDefine.MOVIE_BEGIN, this.onLoginStateWnd, this)
// 	}

// 	destory() {
// 		UnRegisterEvent(EventDefine.STATE_ACTIVE, this.onStateActive, this)
// 		UnRegisterEvent(EventDefine.MOVIE_BEGIN, this.onLoginStateWnd, this)
// 	}

// 	onLoad() {
// 		this.create_frame()
// 	}

// 	onUnLoad() {

// 	}

// 	onShow() {
// 		this.mLayoutNode.visible = (true)


// 		RegisterEvent(EventDefine.MOVIE_END, this.onStateDeActive, this)
// 		//TLog.Debug("FastEndMoiveFrame.onShow")
// 	}

// 	onHide() {
// 		this.mLayoutNode.visible = (false)
// 		UnRegisterEvent(EventDefine.MOVIE_END, this.onStateDeActive, this)
// 	}

// 	create_frame() {


// 		let width = 158, height = 100

// 		UiUtil.setWH(this.mLayoutNode, 158, 100)
// 		this.mLayoutNode.top = 10
// 		this.mLayoutNode.right = 0


// 		this.mElemList = {}
// 		let mElemInfo: any = [
// 			{ ["index_type"]: gui.Button, ["name"]: "fastEnd", ["image"]: "ty_skipAnNiu", ["title"]: "", ["font"]: "ht_18_cc", ["color"]: gui.Color.white, ["right"]: 0, ["y"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFastEnd },
// 			{ ["index_type"]: gui.AnimBox, ["name"]: "autoAnim",  ["parent"]: "fastEnd",  ["x"]:  -10, ["y"]: -15, ["w"]: 115, ["h"]: 70, ["messageFlag"] : true },
// 			//{["index_type"] : gui.ControlType.Label,						["name"] : "fastText", 				["parent"] : "fastEnd",			["image"] : "", ["title"] : Localize_cns("MOVIE_TXT1"), ["font"] : "ht_24_cc_stroke_saddlebrown",	["color"] : gui.Color.white,		["x"] : 0, ["y"] : 0, ["w"] : 180, ["h"] : 66, ["messageFlag"] : true,},

// 		]
// 		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)

// 		this.mElemList["autoAnim"].setAnimName("xinShouKuang")
// 		this.mLayoutNode.setLayer(gui.GuiLayer.Top)
// 		//this.mElemList["fastText"]:SetHandleMessageFlag(true)

// 		//ui_util.CreateDrawRectPtr(this.mLayoutNode, gui.Color32Half.green)
// 	}

// 	onClickFastEnd(args) {
// 		MovieSystem.getInstance().fastEnd()
// 	}

// 	onStateDeActive(args) {
// 		//TLog.Debug("FastEndMoiveFrame.onStateDeActive")
// 		this.hideWnd()
// 	}

// 	onStateActive(args) {
// 		if (GAME_MODE != GAME_NORMAL) {
// 			return
// 		}
// 		let [isMovie, movieName] = MovieSystem.getInstance().isPlayingMovie()
// 		//TLog.Debug("FastEndMoiveFrame.onStateActive",args.stateType,movieName)
// 		if (args.stateType == state_type.COMBAT_STORY_STATE) {
// 			this.hideWnd()
// 		} else if ((isMovie && args.stateType == state_type.COMBAT_BASE_STATE) || args.stateType == state_type.LIVE_STORY_STATE) {
// 			//this.showWnd()
// 			//TLog.Debug("11")
// 			//TLog.Debug("get record",Config.getInstance().getRoleSetting("int",movieName,0))
// 			if ((!movieName) || (!isMovie)) {
// 				this.hideWnd()
// 				return
// 			}
// 			if (IGlobal.setting.getRoleSetting(UserSetting.TYPE_NUMBER, movieName, 0) == 0 && movieName != START_MOVIE_NAME) {
// 				this.hideWnd()
// 			} else {

// 				this.showWnd()
// 			}
// 		}
// 	}
// 	onLoginStateWnd(args) {
// 		//TLog.Debug("FastEndMoiveFrame.onLoginStateWnd")
// 		if (GAME_MODE != GAME_NORMAL) {
// 			return
// 		}
// 		this.showWnd()
// 	}
// }