class ShopShenChongFunWindow extends BaseCtrlWnd {
    mElemList;
    select: any;
    type

    timer

    public initObj(...params: any[]) {

    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        this.select = 0

        let rd_access: gui.RichDisplayer = this.mElemList["rd_access"]
        AddRdContent(rd_access, Localize_cns("ACCESS_TXT2"), "ht_20_cc", "lime")

    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ACTOR_ROLE_TAOZHUANG_UPDATE, this.onRefresh, this)
        RegisterEvent(EventDefine.SHOP_FUN_UPDATE, this.onRefresh, this)
        RegisterEvent(EventDefine.ITEM_UPDATE, this.updateCostWnd, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCostWnd, this)
        this.mElemList["rd_access"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAccessClick, this)
        this.mElemList["group_tempcell"].visible = true;
        this.mElemList["group_equip"].visible = false;
        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ACTOR_ROLE_TAOZHUANG_UPDATE, this.onRefresh, this)
        UnRegisterEvent(EventDefine.SHOP_FUN_UPDATE, this.onRefresh, this)
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.updateCostWnd, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCostWnd, this)
        this.mElemList["rd_access"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAccessClick, this)
        this.mElemList["group_tempcell"].visible = false;
        if(this.timer != null){
            KillTimer(this.timer)
            this.timer = null
        }
    }

    updateCostWnd() {
        let groupNameList = [
            ShopSystem.SHOP_SHENCHONG, ShopSystem.SHOP_ZHUANGBAN
        ]

        let index = this.mParentWnd.tabWndList.getTabIndex()
        let groupName = groupNameList[index]
        this.mElemList["group_access"].visible = index == 0
        this.mElemList["btn_tips"].visible = index == 0
        this.mElemList["group_richang"].visible = false
        this.mElemList["rd_limit"].visible = true
        // let judgeLimit = [
        //     opJudgeJieSuo.RANKINGNUM, opJudgeJieSuo.RANKINGNUM,
        //     opJudgeJieSuo.CONVOYNUM, opJudgeJieSuo.ANSWERNUM
        // ]

        let shopEntry = ShopSystem.getInstance().getShopEntryByGroupName(groupName)
        let limitStrList = [
            Localize_cns("SHOP_HAD_TXT3"), Localize_cns("SHOP_HAD_TXT3"),
            Localize_cns("SHOP_HAD_TXT4"), Localize_cns("SHOP_HAD_TXT5"),
        ]
        let hadStr = ShopSystem.getInstance().getShopCostItemStr(groupName)
        AddRdContent(this.mElemList["rd_had"], hadStr, "ht_20_cc")

        let rd : gui.RichDisplayer = this.mElemList["rd_limit"]
        let tempInfo = ShopSystem.getInstance().getShopCutDayInfo(shopEntry)
       // rd.visible = tempInfo != null
        if(tempInfo == null) return
        if (this.timer == null) {
            let cutDay = tempInfo.cutDay
            let day_t = tempInfo.day
            let smallCut = day_t[0][1]
            let callBack = function () {
                let day = GetServerDay()
                while (day > cutDay) {
                    day -= cutDay
                }
                while (day > smallCut) {
                    day -= smallCut
                }
                let count = smallCut - day
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
        //let hadLimit = ShopSystem.getInstance().getHeroJudge(judgeLimit[index])
        //let limitStr = limitStrList[index] + hadLimit

        //AddRdContent(this.mElemList["rd_limit"], "#lime" + limitStr, "ht_20_cc")

    }

    onRefresh(args?) {

        let groupNameList = [
            ShopSystem.SHOP_SHENCHONG, ShopSystem.SHOP_ZHUANGBAN
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

    onAccessClick() {
        let wnd: GoodsAsseceFrame = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
        wnd.onShowWnd(60046)
    }
}