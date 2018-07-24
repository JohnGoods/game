// TypeScript file

class ClubActiveFrame extends BaseWnd {
	tabWndList: UITabWndList
	tabIndex: number

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/club/ClubActiveLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let tabInfoList = [
			{ name: "tab1", wnd: ClubActive_InfoWnd.newObj(this.mLayoutNode, this) },
			{ name: "tab2", wnd: ClubActive_PrizeWnd.newObj(this.mLayoutNode, this) },
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)
		this.tabWndList.setSelectedCallback(this.refreshDotTips, this)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		RegisterEvent(EventDefine.CLUB_PLAYER_ACTIVE_INFO, this.refreshFrame, this)
		this.mLayoutNode.visible = true;

		this.tabWndList.setWndVisible(true);

        this.tabIndex = 0
		if (this.tabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}

		this.refreshFrame();

		RpcProxy.call("C2G_FactionPlayerActiveInfo")
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.CLUB_PLAYER_ACTIVE_INFO, this.refreshFrame, this)
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);
	}

	refreshFrame() {
		this.refreshDotTips()
	}

	//红点提示
	refreshDotTipsImp() {
		this.tabWndList.getCurrentWnd().refreshDotTips()

		if (GuideFuncSystem.getInstance().checkClubActiveUpgrade()) {
			this.createDotTipsUI(this.mElemList["tab1"])
		}

		for (let i in GameConfig.FactionActiveDailyiPrizeConfig) {
			if (GuideFuncSystem.getInstance().checkClubActivePrize(i)) {
				this.createDotTipsUI(this.mElemList["tab2"])
				break
			}
		}
	}
}