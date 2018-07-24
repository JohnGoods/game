class ShopEquipWindow extends BaseCtrlWnd {
    mElemList;
    select: any;
    scroll: UIScrollList
    type
    index
    equipScroll: UIScrollList

    public initObj(...params: any[]) {
    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;


        let group: eui.Group = this.mElemList["equip_shop"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "equipScroll", 0, 0, group.width, group.height, group)

        let equipGroup: eui.Group = this.mElemList["equip_shop_scroll"]
        this.equipScroll = UIScrollList.newObj(this.mLayoutNode, "equipScroll", 0, 0, equipGroup.width, equipGroup.height, equipGroup)


        this.select = -1

        let t: gui.RichDisplayer = this.mElemList["rd_access"]
        t.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAccessClick, this)

    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.SHOP_FUN_UPDATE, this.onRefresh, this)
        RegisterEvent(EventDefine.ITEM_UPDATE, this.updateCostWnd, this)
        this.mElemList["group_tempcell"].visible = false
        this.mElemList["group_equip"].visible = true;
        this.onRefresh()
        //   this.onRefreshItemShow(
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.SHOP_FUN_UPDATE, this.onRefresh, this)
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.updateCostWnd, this)
        this.mElemList["group_equip"].visible = false;
        this.select = -1
    }


    updateCostWnd() {
        let groupName = ShopSystem.SHOP_ZHUANGBEI
        this.mElemList["group_richang"].visible = false
        this.mElemList["group_access"].visible = true
        this.mElemList["rd_had"].visible = true
        this.mElemList["rd_limit"].visible = true
        let hadLimit = ShopSystem.getInstance().getHeroJudge(opJudgeJieSuo.GAMECASENUM)
        let limitStr = "#white" + Localize_cns("SHOP_HAD_TXT1") + "#lime" + hadLimit
        AddRdContent(this.mElemList["rd_limit"], limitStr, "ht_20_cc")

        AddRdContent(this.mElemList["rd_access"], "#lime" + Localize_cns("ACCESS_TXT2"), "ht_20_cc")
        this.mElemList["rd_access"].width = this.mElemList["rd_access"].getLogicWidth()
        this.mElemList["rd_access"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAccessClick, this)

        let hadStr = ShopSystem.getInstance().getShopCostItemStr(groupName)
        AddRdContent(this.mElemList["rd_had"], hadStr, "ht_20_cc")

        this.checkDot()
        this.checkItemDot()
    }


    onRefresh(args?) {
        let groupName = ShopSystem.SHOP_ZHUANGBEI
        let equipEntry = ShopSystem.getInstance().getShopEntryByGroupName(groupName)
        if (equipEntry == null) return

        this.mElemList["title"].text = ShopSystem.getInstance().getShopNameByEntry(equipEntry)
        let showlist = ShopSystem.getInstance().getShopEquipItemList()
        let scroll = this.scroll
        //scroll.clearItemList()
        for (let k = 0; k < size_t(showlist); k++) {

            let entry = showlist[k]
            let [window, flag] = scroll.getItemWindow(k, 155, 71, 0, 0)
            if (flag == true) {
                this.initBtnItemWindow(window)
            }
            this.refreshBtnItemWindow(window, entry)
        }
        scroll.refreshScroll(true, true)
        if (!args) {
            scroll.restoreViewXY()
        }

        //频道单选
        var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
        radioGroup.addEventListener(eui.UIEvent.CHANGE, this.onBtnClick, this);
        for (let i = 0; i < size_t(showlist); i++) {
            let radioBtn = <eui.RadioButton>this.mElemList["group" + i + "_radio"]
            radioBtn.group = radioGroup;
            radioBtn.value = i
        }

        if (this.select == -1) {
            this.select = 0
        }

        let radioBtn: eui.RadioButton = this.mElemList["group" + this.select + "_radio"]
        radioBtn.selected = true
        this.type = showlist[this.select]
        this.onRefreshItemShow(args)

        //更新材料
        this.updateCostWnd()

        this.checkDot()

    }
    initBtnItemWindow(window) {
        let name = window.name
        var elemInfo = [
            { ["index_type"]: eui.RadioButton, ["name"]: name + "_radio", ["image"]: "sd_biaoQian02", ["image_down"]: "sd_biaoQian01", ["shortSelected"]: true, ["font"]: "ht_22_cc", ["color"]: gui.Color.ublack, ["color_down"]: gui.Color.white, ["x"]: -8, ["y"]: 0, ["w"]: 155, ["h"]: 71, ["event_name"]: null, ["fun_index"]: null },
            { ["index_type"]: eui.Image, ["name"]: name + "_redDot", ["image"]: "zjm_hongDian01", ["color_down"]: gui.Color.white, ["x"]: 103, ["y"]: 0, ["w"]: 40, ["h"]: 40, },
        ]
        UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this, window)
    }

    refreshBtnItemWindow(window, entry) {
        let name = window.name
        this.mElemList[name + "_radio"].label = ShopSystem.getInstance().getShopNameByEntry(entry)
        this.mElemList[name + "_redDot"].visible = false
    }

    onRefreshItemShow(args?) {

        let list = ShopSystem.getInstance().getShopItemList(this.type)

        let scroll = this.equipScroll
        //if(this.type == 0){
        scroll.clearItemList()
        //}
        for (let k = 0; k < size_t(list); k++) {
            let config = list[k]
            let [window, flag] = scroll.getItemWindow(k, 393, 130, 0, 0)
            if (flag == true) {
                this.initEquipItemWindow(window)
            }
            this.refreshEquipItemWindow(window, config)
        }

        scroll.refreshScroll(true, true)
        if (!args) {
            scroll.restoreViewXY()
        }

        this.checkItemDot()
    }

    initEquipItemWindow(window) {
        let name = window.name

        let mElemInfo = [

            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_equip_bg", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "ty_uiDi03", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 393, ["h"]: 130, ["messageFlag"]: true },
            { ["index_type"]: eui.Label, ["name"]: name + "_equip_name", ["titile"]: "", ["font"]: "ht_20_lc", ["image"]: "", ["color"]: gui.Color.ublack, ["x"]: 109, ["y"]: 29, ["w"]: 200, ["h"]: 20, ["messageFlag"]: true },
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_cost_bg", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "ty_textDi01", ["color"]: gui.Color.white, ["x"]: 109, ["y"]: 55, ["w"]: 100, ["h"]: 35, ["messageFlag"]: true },
            { ["index_type"]: eui.Group, ["name"]: name + "_equip_item", ["title"]: "", ["font"]: "ht_20_cc", ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 20, ["w"]: 80, ["h"]: 80, },
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_equip_cost", ["parent"]: name + "_cost_bg", ["titile"]: "", ["font"]: "ht_20_cc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 3, ["w"]: 90, ["h"]: 20, ["messageFlag"]: true },
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_equip_limit", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 281, ["y"]: 29, ["w"]: 200, ["h"]: 20, ["messageFlag"]: true },
            { ["index_type"]: gui.Button, ["name"]: name + "_btn_buy", ["title"]: Localize_cns("SHOP_TXT5"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt2", ["color"]: gui.Color.white, ["x"]: 281, ["y"]: 54, ["w"]: 94, ["h"]: 49, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBuyClick },
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_equip_force", ["title"]: "", ["font"]: "ht_16_cc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 90, ["w"]: 200, ["h"]: 30, ["messageFlag"]: true },
            //红点
            { ["index_type"]: eui.Image, ["name"]: name + "_equip_redDot", ["parent"]: name + "_btn_buy", ["title"]: "", ["font"]: "ht_16_cc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 54, ["y"]: 0, ["w"]: 40, ["h"]: 40, ["messageFlag"]: true },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)

        this.mElemList[name + "_equipBox"] = UIItemBox.newObj(this.mLayoutNode, name + "_equipBox", 0, 0, this.mElemList[name + "_equip_item"])

        this.mElemList[name + "_equip_limit"].visible = false
        this.mElemList[name + "_equip_force"].visible = false
        this.mElemList[name + "_equip_cost"].setAlignFlag(gui.Flag.CENTER_CENTER)
    }

    refreshEquipItemWindow(window, config) {
        let name = window.name
        let id = config.itemEntry
        let item = GameConfig.itemConfig[id]
        let equipName = ""
        let shopEntry = config.shopEntry
        let shopIndex = config.Index
        let itemInfo: any = {}
        itemInfo.entry = id
        itemInfo.quality = config.quality || 1
        let this_item = <Item>Item.newObj(itemInfo)
        //是否装备
        this.mElemList[name + "_equip_force"].visible = false
        this.mElemList[name + "_equip_redDot"].visible = false
        if (shopEntry == 5) {
            equipName = item.name
        } else {

            let subtype = this_item.getRefProperty("subtype")
            equipName = item.name + String.format("(Lv.%d)", this_item.getRefProperty("level"))

            //角色装备战力
            let roleEquip = RoleSystem.getInstance().getRoleEquipItem(subtype)
            let eForce = 0
            if (roleEquip != null) {
                eForce = roleEquip.force
            }
            //item战力
            let itemPro = GetRoleEquipBaseProperty(this_item.entryId, this_item.getProperty("quality"))
            let itemForce = GetForceMath(itemPro)

            let rd_force: gui.RichDisplayer = this.mElemList[name + "_equip_force"]

            let isEcced = itemForce > eForce
            rd_force.visible = isEcced

            if (isEcced) { //超过身上战力
                let addStr = String.format(Localize_cns("SHOP_TXT6"), itemForce - eForce) + "#JIANTOU_UP"
                AddRdContent(rd_force, addStr, "ht_16_cc")

                let price = config.price * config.discout
                let had = 0
                if (config.money != 0) {
                    had = GetHeroMoney(config.money)
                } else {
                    had = ItemSystem.getInstance().getItemCount(config.unit)
                }
            }

        }
        this.mElemList[name + "_equip_name"].text = equipName
        this.mElemList[name + "_equipBox"].updateByEntry(this_item.entryId, config.buyNumber, this_item.getProperty("quality"))
        //判断有没有限制
        let judgeStr = ShopSystem.getInstance().getJudgeSuoLimit(shopEntry, shopIndex)
        if (judgeStr != "") {
            let condition = config[judgeStr]
            let check = ShopSystem.getInstance().getJudgeIsEnough(judgeStr, condition)
            if (check) {
                this.mElemList[name + "_equip_limit"].visible = false
            } else {
                this.mElemList[name + "_equip_limit"].visible = true
                let rdStr = String.format(ShopSystem.getInstance().getJudgeStr(judgeStr), condition)
                AddRdContent(this.mElemList[name + "_equip_limit"], rdStr, "ht_20_cc")
            }
        } else {
            let limit = ShopSystem.getInstance().getLimitTwice(shopEntry, shopIndex)
            if (limit != 0) {
                let hadBuyInfo = ShopSystem.getInstance().getShopPosInfo(shopEntry, shopIndex) || {}
                let hadBuy = hadBuyInfo.count || 0
                let limitStr = "#darkgreen" + String.format(Localize_cns("SHOP_TXT2"), hadBuy, limit)
                if (hadBuy >= limit) {
                    limitStr = Localize_cns("SHOP_TXT3")
                }
                AddRdContent(this.mElemList[name + "_equip_limit"], limitStr, "ht_20_cc")
                this.mElemList[name + "_equip_limit"].visible = true
            } else {
                this.mElemList[name + "_equip_limit"].visible = false
            }
        }
        let costItemIcon
        if (config.money != 0) {
            costItemIcon = GetMoneyIcon(config.money)
        } else {
            costItemIcon = GetTagIcon(config.unit)
        }
        let str = "#orange" + config.price
        AddRdContent(this.mElemList[name + "_equip_cost"], costItemIcon + str, "ht_20_cc")
    }


    /////响应事件
    onBtnClick(event: egret.Event) {
        var radioGroup: eui.RadioButtonGroup = event.target;
        let radiobtn = radioGroup.selection
        let showlist = ShopSystem.getInstance().getShopEquipItemList()
        this.select = radiobtn.value
        this.type = showlist[this.select]
        this.onRefreshItemShow()
    }


    onBuyClick(args: egret.Event) {
        let name = args.target.name
        let index = name.replace(/[^0-9]/ig, "");
        this.index = tonumber(index)
        let list = ShopSystem.getInstance().getShopItemList(this.type)
        if (list == null || list[this.index] == null) return
        let shopConfig = list[this.index]
        let tempConfig = GameConfig.ShopCommodityConfig[shopConfig.shopEntry][shopConfig.Index]
        let limitTimes = ShopSystem.getInstance().getLimitTwice(shopConfig.shopEntry, shopConfig.Index)
        if (limitTimes != 0) {
            let hadBuy = 0
            let buyInfo = ShopSystem.getInstance().getShopPosInfo(shopConfig.shopEntry, shopConfig.Index)
            if (buyInfo != null) {
                hadBuy = buyInfo.count || 0
            }
            if (hadBuy >= limitTimes) {
                MsgSystem.addTagTips(Localize_cns("SHOP_TIPS_TXT3"))
                return
            }
        }

        let wnd = WngMrg.getInstance().getWindow("ShopItemBuyFrame")
        wnd.onShowWnd(this.type, list[this.index].Index || 1)
    }

    onAccessClick() {
        let wnd: ShopGoldSmeltFrame = WngMrg.getInstance().getWindow("ShopGoldSmeltFrame")
        wnd.showWnd()
    }

    ///自定义红点
    checkDot() {
        let showlist = ShopSystem.getInstance().getShopEquipItemList() || []
        let scroll = this.scroll
        for (let k = 0; k < size_t(showlist); k++) {
            let entry = showlist[k]
            if(entry < ShopSystem.CHECK_ENTRY_START || this.type > ShopSystem.CHECK_ENTRY_END) continue
            let [window, flag] = scroll.getItemWindow(k, 155, 71, 0, 0)
            if (flag == true) {
                continue
            }
            let check = GuideFuncSystem.getInstance().checkShopEquip(entry) 
            this.mElemList[window.name + "_redDot"].visible = check
        }
    }

    checkItemDot() {
        let scroll = this.equipScroll
        let list = ShopSystem.getInstance().getShopItemList(this.type)
        if(this.type < ShopSystem.CHECK_ENTRY_START || this.type > ShopSystem.CHECK_ENTRY_END) return
        for (let k = 0; k < size_t(list); k++) {
            let tempInfo = list[k]
            let [window, flag] = scroll.getItemWindow(k, 393, 130, 0, 0)
            if (flag == true) {
                continue
            }
            let check = GuideFuncSystem.getInstance().checkShopEquipSingle(tempInfo)
            this.mElemList[window.name + "_equip_redDot"].visible = check
        }
    }
}