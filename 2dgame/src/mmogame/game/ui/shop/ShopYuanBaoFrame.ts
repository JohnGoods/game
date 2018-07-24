class ShopYuanBaoFrame extends BaseWnd {
    tabWndList: UITabWndList
    tabIndex: number

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/ShopLayout.exml"]
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
			{ name: "tab1", wnd: ShopYuanBaoFunWindow.newObj(this.mLayoutNode, this) },
			{ name: "tab2", wnd: ShopYuanBaoFunWindow.newObj(this.mLayoutNode, this) },
			{ name: "tab3", wnd: ShopYuanBaoFunWindow.newObj(this.mLayoutNode, this) },
			{ name: "tab4", wnd: ShopYuanBaoFunWindow.newObj(this.mLayoutNode, this) },
			
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)
		this.tabWndList.setSelectedCallback(this.refreshDotTips, this)
		 let groupNameList = [
			ShopSystem.SHOP_YUANBAO,ShopSystem.SHOP_BANGYUAN, ShopSystem.SHOP_CHONGWU, ShopSystem.SHOP_XIANLV
		]

		for(let i = 1; i <= 4; i++ ){
			let entry =  ShopSystem.getInstance().getShopEntryByGroupName(groupNameList[i-1])
			this.mElemList["tab" + i].label = ShopSystem.getInstance().getShopNameByEntry(entry)
		}

		this.mElemList["rd_had"].setAlignFlag(gui.Flag.RIGHT_CENTER)
		this.mElemList["rd_access"].setAlignFlag(gui.Flag.LEFT_CENTER)
		this.mElemList["rd_limit"].setAlignFlag(gui.Flag.LEFT_CENTER)

		let list: eui.List = this.mElemList["fun_list"]
        list.itemRenderer = itemRender.ShopItemRender
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
		RpcProxy.call("C2G_SHOP_SELL_LIST")
		RpcProxy.call("C2G_SHOP_ConditionInfo")
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		//this.mLayoutNode.setDoModal(false)
		this.tabWndList.setWndVisible(false);
		
	}

	 showWithIndex(index) {
        this.tabIndex = index;
        this.showWnd();
    }
}