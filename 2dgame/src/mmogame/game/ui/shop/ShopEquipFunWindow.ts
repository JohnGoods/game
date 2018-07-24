class ShopEquipFunWindow extends BaseCtrlWnd {
    mElemList;
    select: any;
    type

    public initObj(...params: any[]) {

    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        this.select = 0

    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ACTOR_ROLE_TAOZHUANG_UPDATE, this.onRefresh, this)
        RegisterEvent(EventDefine.SHOP_FUN_UPDATE, this.onRefresh, this)
        RegisterEvent(EventDefine.ITEM_UPDATE, this.updateCostWnd, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCostWnd, this)
        this.mElemList["group_tempcell"].visible = true;
        this.mElemList["group_equip"].visible = false;

        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ACTOR_ROLE_TAOZHUANG_UPDATE, this.onRefresh, this)
        UnRegisterEvent(EventDefine.SHOP_FUN_UPDATE, this.onRefresh, this)
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.updateCostWnd, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCostWnd, this)
        this.mElemList["group_tempcell"].visible = false;
    }

    updateCostWnd() {
        let groupNameList = [
            ShopSystem.SHOP_ZHUANGBEI, ShopSystem.SHOP_LEIYIN, ShopSystem.SHOP_BANGHUI, ShopSystem.FULI_BANGHUI
        ]

        let index = this.mParentWnd.tabWndList.getTabIndex()
        let groupName = groupNameList[index]
        //显示头部 ----消耗品 通关条件等
        this.mElemList["group_access"].visible = false
        this.mElemList["group_richang"].visible = false
        if (index == 3) {
            this.mElemList["rd_limit"].visible = false
        } else {
            this.mElemList["rd_limit"].visible = true
            let hadLimit = ShopSystem.getInstance().getHeroJudge(opJudgeJieSuo.GAMECASENUM)
            let limitStr = Localize_cns("SHOP_HAD_TXT1") + hadLimit
            if (index == 2) {
                limitStr = Localize_cns("SHOP_HAD_TXT2")
            }

            AddRdContent(this.mElemList["rd_limit"], "#lime" + limitStr, "ht_20_cc")
        }

        let hadStr = ShopSystem.getInstance().getShopCostItemStr(groupName)
        AddRdContent(this.mElemList["rd_had"], hadStr, "ht_20_cc")

    }

    onRefresh(args?) {
        let groupNameList = [
            ShopSystem.SHOP_ZHUANGBEI, ShopSystem.SHOP_LEIYIN, ShopSystem.SHOP_BANGHUI, ShopSystem.FULI_BANGHUI
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

        if(!args){
            this.restoreViewXY()
        }
    }

    restoreViewXY(){
        let scroller : eui.Scroller = this.mElemList["scroller"]
        let viewport = scroller.viewport
        viewport.scrollH = 0
        viewport.scrollV = 0
        scroller.stopAnimation()
    }
}

module itemRender {
    export class ShopItemRender extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}

            let name = "item"

            for (let i = 1; i <= 2; i++) {
                let x = 290 * (i - 1)
                this.mElemList[name + "_shopBox" + i] = UIShopBox.newObj(this, name + "_shopBox" + i, x, 0)
            }

        }

        protected dataChanged(): void {
            let config = this.data
             let name = "item"
            for (let i = 1; i <= 2; i++) {
                let v = config[i - 1]
                if (v) {
                    this.mElemList[name + "_shopBox" + i].setVisible(true)
                    this.mElemList[name + "_shopBox" + i].updateByEntry(v.shopEntry, v.Index)
                } else {
                    this.mElemList[name + "_shopBox" + i].setVisible(false)
                }
            }

        }

    }


}