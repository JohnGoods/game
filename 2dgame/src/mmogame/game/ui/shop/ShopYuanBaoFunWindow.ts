class ShopYuanBaoFunWindow extends BaseCtrlWnd {
    mElemList;
    select: any;
    scroll: UIScrollList
    type

    public initObj(...params: any[]) {

    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        this.select = 0

        let rd_xianlv: gui.RichDisplayer = this.mElemList["rd_xianlv"]
        let rd_richang: gui.RichDisplayer = this.mElemList["rd_richang"]
        AddRdContent(rd_xianlv, Localize_cns("SHOP_XIANLV_ACCESS_TXT3"), "ht_20_cc_stroke")
        AddRdContent(rd_richang, Localize_cns("SHOP_HAD_TXT6"), "ht_20_cc_stroke")

        let norma_pos = 110
        let norma_pos_2 = 210
        let norma__h = 20

        let now_h = rd_xianlv.getLogicHeight()
        let now_l = rd_xianlv.getLogicWidth()

        let norma_l_2 = 320 //仙侣

        let now_pos = (norma_pos * now_l) / norma_l_2
        let now_pos_2 = (norma_pos_2 * now_l) / norma_l_2

        this.mElemList["touch_group_1"].x = now_pos
        this.mElemList["touch_group_2"].x = now_pos_2

        let rect_l = 60
        let now_rect_l = (now_h * rect_l) / norma__h
        let now_rect_h = (now_h * 2) / norma__h

        this.mElemList["touch_group_1"].width = now_rect_l
        this.mElemList["rect_1"].height = now_rect_h
        this.mElemList["rect_1"].y = now_h
        this.mElemList["touch_group_2"].width = now_rect_l
        this.mElemList["rect_2"].height = now_rect_h
        this.mElemList["rect_2"].y = now_h

        let norma_l = 330    //日常
        let richang_pos = 130

        let richang_logic_l = rd_richang.getLogicWidth()
        let richang_logic_h = rd_richang.getLogicHeight()

        let now_richang_pos = (richang_logic_l * richang_pos) / norma_l

        let rect_richang_l = 149
        let now_rect_richang = (richang_logic_h * rect_richang_l) / norma__h
        let rect_richang_h = (richang_logic_h * 2) / norma__h


        this.mElemList["touch_group_3"].x = now_richang_pos
        this.mElemList["touch_group_3"].width = now_rect_richang
        this.mElemList["rect_3"].y = richang_logic_h
        this.mElemList["rect_3"].height = rect_richang_h
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.SHOP_FUN_UPDATE, this.onRefresh, this)
        RegisterEvent(EventDefine.ITEM_UPDATE, this.updateCostWnd, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCostWnd, this)
        this.mElemList["group_tempcell"].visible = true;
        this.mElemList["group_equip"].visible = false;


        this.mElemList["touch_group_1"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onXianLvClick1, this)
        this.mElemList["touch_group_2"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onXianLvClick2, this)
        this.mElemList["touch_group_3"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAccessClick, this)

        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.SHOP_FUN_UPDATE, this.onRefresh, this)
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.updateCostWnd, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCostWnd, this)

        this.mElemList["touch_group_1"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onXianLvClick1, this)
        this.mElemList["touch_group_2"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onXianLvClick2, this)
        this.mElemList["touch_group_3"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAccessClick, this)

        this.mElemList["group_tempcell"].visible = false;
        this.mElemList["group_xianlv"].visible = false
    }

    updateCostWnd() {
        let groupNameList = [
            ShopSystem.SHOP_YUANBAO, ShopSystem.SHOP_BANGYUAN, ShopSystem.SHOP_CHONGWU, ShopSystem.SHOP_XIANLV
        ]

        let index = this.mParentWnd.tabWndList.getTabIndex()
        let groupName = groupNameList[index]
        this.mElemList["rd_limit"].visible = false
        this.mElemList["group_richang"].visible = false
        this.mElemList["group_access"].visible = false
        this.mElemList["group_xianlv"].visible = false

        if (index == 3) {
            this.mElemList["group_xianlv"].visible = true
        }
        if (index == 2) {
            this.mElemList["group_richang"].visible = true
        }
        let hadStr = ShopSystem.getInstance().getShopCostItemStr(groupName)
        AddRdContent(this.mElemList["rd_had"], hadStr, "ht_20_cc")
    }

    onRefresh(args?) {

        let groupNameList = [
            ShopSystem.SHOP_YUANBAO, ShopSystem.SHOP_BANGYUAN, ShopSystem.SHOP_CHONGWU, ShopSystem.SHOP_XIANLV
        ]

        let index = this.mParentWnd.tabWndList.getTabIndex()
        let groupName = groupNameList[index]
        let shopEntry = ShopSystem.getInstance().getShopEntryByGroupName(groupName)
        if (shopEntry == null) return
        this.type = shopEntry

        this.updateCostWnd()

        let list = ShopSystem.getInstance().getShopItemList(shopEntry)
        this.mElemList["title"].text = ShopSystem.getInstance().getShopNameByEntry(shopEntry)

        let fun_list: eui.List = this.mElemList["fun_list"]
        let showList = splitListByCount(list, 2)
        UiUtil.updateList(fun_list, showList);

        if (!args) {
            this.restoreViewXY()
        }
    }

    restoreViewXY() {
        let scroller: eui.Scroller = this.mElemList["scroller"]
        let viewport = scroller.viewport
        viewport.scrollH = 0
        viewport.scrollV = 0
        scroller.stopAnimation()
    }


    ///------------响应事件
    onAccessClick() {
        if (GetHeroProperty("level") < 40) {
            MsgSystem.addTagTips(String.format(Localize_cns("GUIDE_TXT3"), 40))
            return
        }
        let wnd: DailyFrame = WngMrg.getInstance().getWindow("DailyFrame")
        wnd.showWithIndex(2)
    }

    onXianLvClick1() {
        let wnd: CampaignBossFrame = WngMrg.getInstance().getWindow("CampaignBossFrame")
        wnd.showWnd()
    }

    onXianLvClick2() {
        let wnd: LuckyFrame = WngMrg.getInstance().getWindow("LuckyFrame")
        wnd.showWithIndex(PayActivityIndex.PET_LOTTERY_A)
    }
}