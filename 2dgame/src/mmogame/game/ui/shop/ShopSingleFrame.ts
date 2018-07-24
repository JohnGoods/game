class ShopSingleFrame extends BaseWnd {
    mElemList;
    select: any;
    type

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/ShopFunLayout.exml"]
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

        this.select = -1

        this.mElemList["rd_had"].setAlignFlag(gui.Flag.RIGHT_CENTER)
        this.mElemList["rd_limit"].setAlignFlag(gui.Flag.LEFT_CENTER)

        let list: eui.List = this.mElemList["fun_list"]
        list.itemRenderer = itemRender.ShopItemRender
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.SHOP_FUN_UPDATE, this.onRefresh, this)
        RegisterEvent(EventDefine.ITEM_UPDATE, this.updateCostWnd, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCostWnd, this)
        this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true)
        this.onRefresh()
        RpcProxy.call("C2G_SHOP_SELL_LIST")
        RpcProxy.call("C2G_SHOP_ConditionInfo")
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.SHOP_FUN_UPDATE, this.onRefresh, this)
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.updateCostWnd, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCostWnd, this)
        this.mLayoutNode.visible = false;
        //this.mLayoutNode.setDoModal(false)
    }

    updateCostWnd() {
        let judgeLimit = opJudgeJieSuo.SINGLENUM
        let groupName = ShopSystem.SHOP_SINGLE
        let hadLimit = ShopSystem.getInstance().getHeroJudge(judgeLimit) || 0
        let limitStr = Localize_cns("SHOP_HAD_TXT9") + hadLimit

        AddRdContent(this.mElemList["rd_limit"], "#lime" + limitStr, "ht_20_cc")

        let hadStr = ShopSystem.getInstance().getShopCostItemStr(groupName)
        AddRdContent(this.mElemList["rd_had"], hadStr, "ht_20_cc")
    }

    onRefresh() {
        let groupName = ShopSystem.SHOP_SINGLE
        let shopEntry = ShopSystem.getInstance().getShopEntryByGroupName(groupName)
        if (shopEntry == null) return
        this.type = shopEntry

        this.updateCostWnd()
        let list = ShopSystem.getInstance().getShopItemList(shopEntry)

        this.mElemList["title"].text = ShopSystem.getInstance().getShopNameByEntry(shopEntry)

        let fun_list: eui.List = this.mElemList["fun_list"]
        let showList = splitListByCount(list, 2)
        UiUtil.updateList(fun_list, showList);

        this.restoreViewXY()
    }

    restoreViewXY() {
        let scroller: eui.Scroller = this.mElemList["scroller"]
        let viewport = scroller.viewport
        viewport.scrollH = 0
        viewport.scrollV = 0

    }
}