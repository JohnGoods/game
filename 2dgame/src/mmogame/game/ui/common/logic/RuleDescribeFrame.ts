// TypeScript file
/*
作者:
    liuziming
	
创建时间：
   2017.01.10(周二)

意图：
   
公共接口：
   
*/
class RuleDescribeFrame extends BaseWnd {
	activity: string;
	templetParam: any;

	public initObj(...args: any[]): void {
		this.mLayoutPaths = ["resource/layouts/RuleDescribeLayout.exml"]
	}

	onLoad() {
		this.createFrame()
	}

	onUnLoad() {

	}

	onShow() {
		this.mLayoutNode.visible = true;
		this.refreshFrame()
	}

	onHide() {
		this.mLayoutNode.visible = false;

		this.activity = null
		this.templetParam = null
	}

	////////////////////////////////////////////////////////////////////-
	createFrame() {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.mLayoutNode.setDoModal(true);
		this.initSkinElemList();

		var elemInfo = [

			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickReturn },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickReturn },

		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		this.mLayoutNode.horizontalCenter = 0;
		this.mLayoutNode.verticalCenter = 0;
		//this.mElemList = ui_util.SetLookAndFeelWindow("Frame/Template02", this.mRootFrame, 600, 880, 0, 0)
		//this.mElemList["return"]:SubscribeEvent(gui.Window.MouseUpEvent, this.onReturn, this)

		//let mElemInfo:any = {
		//									{["index_type"] : gui.ControlType.Label,						["name"] : "bg",  	["title"] : null ,   		["font"] : null,   ["scale_image"] : "ty_UIBg02",		["color"] : gui.Color.white,		["x"] : 30, ["y"] : 30,		["w"] : 540,["h"] : 710,	["event_name"] : gui.Window.MouseLongDownEvent, ["fun_index"] : null},
		//										{["index_type"] : gui.ControlType.Label,						["name"] : "title", ["parent"] : "bg", 	["title"] : Localize_cns("COMMON_TXT1") ,   		["font"] : "ht_28_cc",   ["scale_image"] : "",		["color"] : gui.Color.white,		["x"] : 0, ["y"] : 10,		["w"] : 540,["h"] : 30,	["event_name"] : gui.Window.MouseLongDownEvent, ["fun_index"] : null},
		//										{["index_type"] : gui.ControlType.RichDisplayer,		["name"] : "rd",  	["parent"] : "bg",	["title"] : null ,   		["font"] : null,   ["scale_image"] : "",		["color"] : gui.Color.white,		["x"] : 10, ["y"] : 50,		["w"] : 520,["h"] : 650,	["event_name"] : gui.Window.MouseLongDownEvent, ["fun_index"] : null},
		//									
		//									}
		//ui_util.CreateElem(mElemInfo, this.mRootFrame, this.mElemList, this)
		////ui_util.CreateDrawRectPtr(this.mElemList["rd"], gui.Color32Half.green)
		//
		////
		////let name = "scrollWidget"
		////let window = UIScrollList.newObj(this.mRootFrame)
		////this.scroll = window
		////
		////let pos:any = {x : 20, y : 130, w : 605, h : 700}
		////window.createScrollWidget(name, this.mElemList, pos)
		////function AddRdContent(rd, content, ft, color, dis, rffont, setBottom, addNew){
		//	
		//let path = "SecondMenuFrame/data"
		//let window = this.mRootWindow.GetChildFromPath(path, string.len(path))
		//this.frameAction = FrameExplodeAction.newObj(this.mRootFrame, window, null, null, this.hideWnd, this)
	}

	refreshFrame() {
		let rd = this.mElemList["rd"]
		rd.clear()
		let rules = GameConfig.RuleDescriptionConfig[this.activity]
		if (rules) {
			for (let k = 1; k < 100; k++) {
				let v = rules[k]
				if (v == null) {
					break
				}
				if (k == 1) {
					if (v.title && v.title != "") {
						this.mElemList["title"].text = (v.title)
					} else {
						this.mElemList["title"].text = (Localize_cns("COMMON_TXT1"))
					}
				}

				if (v.templet == 1) {
					for (let _ = 0; _ < this.templetParam.length; _++) {
						let pack = this.templetParam[_]

						AddRdContent(rd, String.format(v.des, pack), "ht_22_cc", "ublack", 2, "#ublack", null, true)
					}

					AddRdContent(rd, "#br", null, null, null, null, null, true)
				} else {
					AddRdContent(rd, v.des + "#br", "ht_22_cc", "ublack", 0, "#ublack", null, true)
				}
			}
		}
	}

	////////////////////////////////////////////////////////////-响应函数//////////////////////////////////////////////////////////////////////
	onClickReturn(args) {
		return this.hideWnd()
	}

	showWithActivity(activity, templetParam) {
		this.activity = activity
		this.templetParam = templetParam

		return this.showWnd()
	}
}