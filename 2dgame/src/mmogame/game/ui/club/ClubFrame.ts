class ClubFrame extends BaseWnd {
	tabWndList: UITabWndList
	tabIndex: number
	dungeonIndex:number

	public initObj(...params: any[]) {
		this.dungeonIndex = -1
		this.mLayoutPaths = ["resource/layouts/club/ClubLayout.exml", "resource/layouts/team/TeamGroupLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

			{ ["name"]: "btn_tips", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRule },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let tabInfoList = [
			{ name: "radio1", wnd: Club_HallWnd.newObj(this.mLayoutNode, this) },
			{ name: "radio2", wnd: Club_IncenseWnd.newObj(this.mLayoutNode, this) },
			{ name: "radio3", wnd: Club_FuBenWnd.newObj(this.mLayoutNode, this) },
			{ name: "radio4", wnd: Club_SkillWnd.newObj(this.mLayoutNode, this) },
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

		this.tabWndList.setSelectedCallback(this.refreshDotTips, this)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;

		if (this.tabIndex != null) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}

		this.tabWndList.setWndVisible(true);

		//帮派信息
        RpcProxy.call("C2G_FactionMemberRefresh")
        RpcProxy.call("C2G_FactionInfoRefresh")
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);

		this.tabIndex = null
	}

	setTitle(str: string) {
		this.mElemList["title"].text = str
	}

	onClickRule() {
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
		wnd.showWithActivity("clubRule")
	}

	updateWnd() {
		if (this.isVisible() && this.tabWndList.getTabIndex() == 2) {
			this.tabWndList.getCurrentWnd().refreshFrame()
		}
	}

	//自定义红点继承实现
	refreshDotTipsImp() {
		this.tabWndList.getCurrentWnd().refreshClubDotTips()
	}

	showWithIndex(index,dungeonIndex?) {
		this.tabIndex = index;
		if(dungeonIndex!=null){	//副本index
			this.dungeonIndex = dungeonIndex
		}
		this.showWnd();
	}
}