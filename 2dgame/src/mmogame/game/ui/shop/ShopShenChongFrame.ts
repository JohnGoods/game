class ShopShenChongFrame extends BaseWnd {
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
            { ["name"]: "btn_tips", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTipsClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["tab3"].visible = false
        this.mElemList["tab4"].visible = false

        let tabInfoList = [
            { name: "tab1", wnd: ShopShenChongFunWindow.newObj(this.mLayoutNode, this) },
            { name: "tab2", wnd: ShopShenChongFunWindow.newObj(this.mLayoutNode, this) },
            //{ name: "tab3", wnd: ShopJingJiFunWindow.newObj(this.mLayoutNode, this) },
            //{ name: "tab4", wnd: ShopJingJiFunWindow.newObj(this.mLayoutNode, this) , check: this.daTiClick, obj: this},

        ]
        this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

        let groupNameList = [
            ShopSystem.SHOP_SHENCHONG, ShopSystem.SHOP_ZHUANGBAN
        ]

        for (let i = 1; i <= 2; i++) {
            let entry = ShopSystem.getInstance().getShopEntryByGroupName(groupNameList[i - 1])
            this.mElemList["tab" + i].label = ShopSystem.getInstance().getShopNameByEntry(entry)
        }

        this.mElemList["rd_had"].setAlignFlag(gui.Flag.RIGHT_CENTER)
        this.mElemList["rd_access"].setAlignFlag(gui.Flag.LEFT_CENTER)
        this.mElemList["rd_limit"].setAlignFlag(gui.Flag.LEFT_CENTER)

        let list: eui.List = this.mElemList["fun_list"]
        list.itemRenderer = itemRender.ShopItemRender

        this.mElemList["group_access"].x = 284
        //RpcProxy.call("C2G_EnterEscortActivity")
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
        this.tabWndList.setWndVisible(false);
        //this.mLayoutNode.setDoModal(false)

    }

    onTipsClick(){
        let wnd  = WngMrg.getInstance().getWindow("RuleDescribeFrame")
        wnd.showWithActivity("ShenchongRule")
    }

    ///////////////////--------------
    showWithIndex(index) {
        this.tabIndex = index;
        this.showWnd();
    }
}