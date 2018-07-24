class ShopFunFrame extends BaseWnd {
    mElemList;
    select: any;
    groupName

    judgeList

    timer

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

        this.judgeList = {
            [ShopSystem.SHOP_SINGLE]: [opJudgeJieSuo.SINGLENUM, "SHOP_HAD_TXT9"], //个人boss
            [ShopSystem.SHOP_GLOBAL]: [opJudgeJieSuo.GLOBALNUM, "SHOP_HAD_TXT10"], //全民boss
            [ShopSystem.SHOP_DELINE]: [opJudgeJieSuo.DELINENUM, "SHOP_HAD_TXT11"], //生死劫
            [ShopSystem.SHOP_MATERIAL]: [opJudgeJieSuo.MATNUM, "SHOP_HAD_TXT12"], //材料副本
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ACTOR_ROLE_TAOZHUANG_UPDATE, this.onRefresh, this)
        RegisterEvent(EventDefine.SHOP_FUN_UPDATE, this.onRefresh, this)
        RegisterEvent(EventDefine.ITEM_UPDATE, this.updateCostWnd, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCostWnd, this)
        this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true)
        this.onRefresh()
        RpcProxy.call("C2G_SHOP_SELL_LIST")
        RpcProxy.call("C2G_SHOP_ConditionInfo")
        RpcProxy.call("C2G_FashionSuit_Info")
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ACTOR_ROLE_TAOZHUANG_UPDATE, this.onRefresh, this)
        UnRegisterEvent(EventDefine.SHOP_FUN_UPDATE, this.onRefresh, this)
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.updateCostWnd, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCostWnd, this)
        this.mLayoutNode.visible = false;
        //this.mLayoutNode.setDoModal(false)
        //this.groupName = null

        if (this.timer != null) {
            KillTimer(this.timer)
            this.timer = null
        }
    }

    updateCostWnd() {
        let groupName = this.groupName
        let judgeList = this.judgeList[groupName]
        let limitStr = ""
        let rd = this.mElemList["rd_limit"]
        if (judgeList != null) {
            let judgeLimit = judgeList[0]
            let hadLimit = ShopSystem.getInstance().getHeroJudge(judgeLimit) || 0
            limitStr = "#lime" + Localize_cns(judgeList[1]) + hadLimit
            AddRdContent(rd, limitStr, "ht_20_cc")
        } else if (groupName == ShopSystem.SHOP_ZHUANGBAN) {
            if (this.timer == null) {
                let callBack = function () {
                    let day = GetServerDay()
                    while (day > 9) {
                        day -= 9
                    }
                    while (day > 3) {
                        day -= 3
                    }
                    let count = 3 - day
                    let formatStr = ""
                    let osDate = GetOSDate()
                    if (count == 0) {
                        formatStr = String.format(Localize_cns("LUCKY_PRIZE_SEC"), 23 - osDate.hour, 59 - osDate.min, 60 - osDate.sec)
                    } else {
                        formatStr = String.format(Localize_cns("LUCKY_PRIZE_DAY"), count, 23 - osDate.hour, 60 - osDate.min)
                    }
                    let limitStr = Localize_cns("SHOP_HAD_TXT15") + "#red" + formatStr
                    AddRdContent(rd, limitStr, "ht_20_cc")
                }

                this.timer = SetTimer(callBack, this, 1000, true)
            }
        }

        let hadStr = ShopSystem.getInstance().getShopCostItemStr(groupName)
        AddRdContent(this.mElemList["rd_had"], hadStr, "ht_20_cc")
    }

    onRefresh() {
        if (this.groupName == null) return
        let groupName = this.groupName
        let shopEntry = ShopSystem.getInstance().getShopEntryByGroupName(groupName)
        if (shopEntry == null) return

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


    ////////---------
    onShowWnd(groupName) {
        this.groupName = groupName || ""
        if (this.groupName == "") return
        this.showWnd()
    }
}