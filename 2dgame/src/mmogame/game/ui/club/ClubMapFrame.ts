// TypeScript file

class ClubMapFrame extends BaseWnd {

	taskWnd: ClubMapTaskWindow;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/club/ClubMapLayout.exml"]

	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreenRaw(true)
		this.initSkinElemList();

		this.mLayoutNode.setLayer(gui.GuiLayer.Bottom)
		this.mLayoutNode.touchEnabled = false;

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.leaveClubMap },

			//帮会召集 帮会收购
			{ ["name"]: "convene_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickConvene },
			{ ["name"]: "purchase_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPurchase },

			{ ["name"]: "map_wnd", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickMapWnd }
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		this.taskWnd = ClubMapTaskWindow.newObj(this.mLayoutNode, this)

		this.mElemList["map_name"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["map_xy"].setAlignFlag(gui.Flag.H_CENTER)
	}

	public onUnLoad(): void {
		this.resetClubMap()
	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_MOVE, this.refreshMapPos, this)
		RegisterEvent(EventDefine.HERO_ENTER_MAP, this.refreshMapPos, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshDotTips, this)
		this.mLayoutNode.visible = true;
		this.moveToBack()
		this.refreshDotTips()
		this.refreshFrame();
		this.taskWnd.showWnd()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_MOVE, this.refreshMapPos, this)
		UnRegisterEvent(EventDefine.HERO_ENTER_MAP, this.refreshMapPos, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshDotTips, this)
		this.mLayoutNode.visible = false;
		this.taskWnd.hideWnd()
	}

	resetClubMap() {
		let coltCheck = <eui.CheckBox>this.mElemList["colt_check"]
        let intrCheck = <eui.CheckBox>this.mElemList["intr_check"]
		coltCheck.selected = false
		intrCheck.selected = false
		this.taskWnd.cancelAnim()

        let a = GetActivity(ActivityDefine.ClubMap)
		a.autoType = {}
	}

	refreshFrame() {

	}

	leaveClubMap() {
		let a = GetActivity(ActivityDefine.ClubMap)
		a.requestStop()
	}

	onClickConvene() {
		MsgSystem.confirmDialog_YES(Localize_cns("CLUB_TXT103"))
	}

	onClickPurchase() {
		ExecuteMainFrameFunction("shougou")
	}

	onClickMapWnd() {
		ExecuteMainFrameFunction("ditu")
	}

	refreshMapPos(args) {
		let target = GetHero()
		let x = 0
		let y = 0
		if (target) {
			x = target.getCellX()
			y = target.getCellY()
		}
		else {
			var heroPoint = GetHero().getCellXY()
			x = heroPoint.x
			y = heroPoint.y
		}

		let mapId = MapSystem.getInstance().getMapId()

		AddRdContent(this.mElemList["map_name"], Localize_cns("CLUB_TXT10"), "ht_24_cc_stroke", "white")

		for (let _ in GameConfig.MapEnterList) {
			let config = GameConfig.MapEnterList[_]

			if (config.inMapId == mapId) {
				AddRdContent(this.mElemList["map_name"], config.inMapName, "ht_24_cc_stroke", "white")
			}
		}

		AddRdContent(this.mElemList["map_xy"], "[" + x + "," + y + "]", "ht_20_cc_stroke", "lime")
	}

	startAnim() {
		this.taskWnd.startAnim()
	}

	endAnim() {
		this.taskWnd.endAnim()
	}

	//自定义红点继承实现
	refreshDotTipsImp() {
		this.taskWnd.refreshDotTips()
	}
}