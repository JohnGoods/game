// TypeScript file
class PetFlyFrame extends BaseWnd {
	tabWndList: UITabWndList
	tabIndex: number

	petId: number

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/pet/PetFlyLayout.exml"]

		this.tabIndex = -1
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
			{ name: "tab0", wnd: PetFlyUpgradeWindow.newObj(this.mLayoutNode, this) },
			//{ name: "tab1", wnd: PetFlyRecoveryWindow.newObj(this.mLayoutNode, this) },
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
		if (this.tabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}

		this.refreshFrame()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;

		this.tabWndList.setWndVisible(false);
	}

	refreshFrame() {
		
	}

	refreshDotTipsImp() {
		this.tabWndList.getCurrentWnd().refreshPetFlyDotTips()
	}

	////////////////////////////////////////////
	showWithPetId(entryId) {
		this.petId = entryId
		this.showWnd()
	}
}