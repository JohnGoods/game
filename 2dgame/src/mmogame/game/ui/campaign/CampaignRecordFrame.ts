class CampaignRecordFrame extends BaseWnd {
	tabWndList: UITabWndList
	tabIndex: number

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/campaign/CampaignRecordLayout.exml"]

		this.tabIndex = 0
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
			{ name: "tab0", wnd: CampaignSingleWindow.newObj(this.mLayoutNode, this) },
			{ name: "tab1", wnd: CampaignRankWindow.newObj(this.mLayoutNode, this) },
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

		this.tabWndList.setSelectedCallback(this.refreshDotTips, this)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;

		this.tabWndList.setWndVisible(true);

		this.tabIndex = 0
		this.tabWndList.changeTabWithIndex(this.tabIndex)

		this.refreshFrame()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);

	}

	refreshFrame() {
		let boolSingle = this.checkSingle()
		this.tabWndList.setTabVisible(0, boolSingle)

		if (boolSingle) {

		} else {
			this.tabIndex = 1
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}
	}

	checkSingle() {
		//开服7天关闭
		if (GetServerDay() > 7) {
			return false
		}

		var recordList = CampaignSystem.getInstance().getLimitPassData() || {}
		var configList = CampaignSystem.getInstance().getSinglePassConfig()

		//通关奖励领取检测//(全部领取不再显示)
		let firstList = CampaignSystem.getInstance().getFirstPassData() || {}

		for (let i in configList) { //个人限时首通
			let config = configList[i]
			let record = recordList[config.campaignId] || []
			let getState = record[0] || 0
			let endTime = record[1] || 0
			if (getState == 1 || getState == 2) { //可领取
				return true
			} else if (getState == 0 && endTime > GetServerTime() && CampaignSystem.getInstance().getCurOpenCampaign() < config.campaignId) { //未领取 有时间 未通过
				return true
			}

			let linQuState = firstList[config.campaignId] || 0
			if (linQuState == 1 || linQuState == 2) { //可领取
				return true
			} else if (linQuState == 0 && CampaignSystem.getInstance().getCurOpenCampaign() < config.campaignId) { //未领取 有时间 未通过
				return true
			}

		}

		return false
	}

	//////////////////////////////////////////
	showWithIndex(index) {
		this.tabIndex = index;
		this.showWnd();
	}
}