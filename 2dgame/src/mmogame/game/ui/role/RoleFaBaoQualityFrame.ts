class RoleFaBaoQualityFrame extends BaseWnd {
    tabWndList: UITabWndList
    tabIndex: number
	scroll : UIScrollList
    
    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/role/RoleFaBaoQualityLayout.exml"]
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
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let tabInfoList = [
			{ name: "tab_0", wnd: FaBaoQualityWindow.newObj(this.mLayoutNode, this) },
			{ name: "tab_1", wnd: FaBaoQualityWindow.newObj(this.mLayoutNode, this) },
			{ name: "tab_2", wnd: FaBaoQualityWindow.newObj(this.mLayoutNode, this) },
			
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

		let titleList = [
			Localize_cns("FABAO_QUALITY_TXT6"), Localize_cns("FABAO_QUALITY_TXT6"), Localize_cns("FABAO_QUALITY_TITLE"), 
		]
		for(let k = 0; k <= 2; k++){
			let text = titleList[k]
			this.mElemList["tab_" + k].label = text
		}

        let group : eui.Group = this.mElemList["scroll"]
        this.scroll =  UIScrollList.newObj(this.mLayoutNode, "fabao_scroll", 0, 0, group.width, group.height, group)
	}
    public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		//this.mLayoutNode.setDoModal(true)
		this.tabWndList.setWndVisible(true);
    
		if (this.tabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);
		//this.mLayoutNode.setDoModal(false)
	}

    showWithIndex(index) {
        this.tabIndex = index;
        this.showWnd();
    }

}