// TypeScript file
class WonderBuyFrame extends BaseWnd {
    config
    index
    count

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/ShopItemBuyLayout.exml"]
        this.count = 1
    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.width = 640
        this.mLayoutNode.height = 532
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_buy", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBtnBuyClick },

            { ["name"]: "btn_add", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAddClick },
            { ["name"]: "btn_add10", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAddClick },
            { ["name"]: "btn_add50", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAddClick },

            { ["name"]: "btn_reduce", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onReduceClick },
            { ["name"]: "btn_reduce10", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onReduceClick },
            { ["name"]: "btn_reduce50", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onReduceClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["itemBox"] = UIItemBox.newObj(this.mLayoutNode, "itemBox", 0, 2, this.mElemList["group_item"])

        this.mElemList["rd_cost"].setAlignFlag(gui.Flag.CENTER_CENTER)
    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true
        this.mLayoutNode.setDoModal(true)
        this.count = 1
        this.onRefresh()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        this.mLayoutNode.setDoModal(false)
    }

    onRefresh() {
        if (!this.config) {
            return
        }
        let itemList = AnalyPrizeFormat(this.config.item)
        let itemId = itemList[0][0]
        let itemCount = itemList[0][1] 
        let itemName = ItemSystem.getInstance().getItemName(itemId)

        this.mElemList["itemBox"].updateByEntry(itemId, itemCount)

        let nameStr = Localize_cns("SHOP_TXT4")

        let limitCount = this.config.limitCount
        let dataInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.index) || {}
        let recordList = (this.config.limitDay == 1) ? (dataInfo[0] || {}) : (dataInfo[1] || {})

        let useCount = recordList[this.config.index] || 0

        if (limitCount != 0) {
            nameStr = "#green(" + useCount + "/" + limitCount + ")"
        }
        AddRdContent(this.mElemList["rd_name"], itemName + "#br#br" + nameStr, "ht_20_cc", "ublack")

        //描述
        let itemConfig = GameConfig.itemConfig[itemId]
        let des = itemConfig.description || Localize_cns("SHOP_TXT7")

        AddRdContent(this.mElemList["rd_des"], des, "ht_20_cc", "ublack")

        this.onRefreshSelectNum()
    }

    onRefreshSelectNum() {
        this.mElemList["label_num"].text = this.count

        let costIcon = GetMoneyIcon(this.config.unit)
        //价格
        let totalPrice = this.config.newPrice * this.count
        AddRdContent(this.mElemList["rd_cost"], Localize_cns("SHOP_TIPS_TXT2") + costIcon + "X" + totalPrice, "ht_20_cc", "ublack")
    }

    onAddClick(args: egret.Event) {
        let btnName = args.target.name
        let btnCount = 0
        if (btnName == "btn_add") {
            btnCount = 1
        } else if (btnName == "btn_add10") {
            btnCount = 10
        } else {
            btnCount = 50
        }

        let limitCount = this.config.limitCount
        let dataInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.index) || {}
        let recordList = (this.config.limitDay == 1) ? (dataInfo[0] || {}) : (dataInfo[1] || {})
        let useCount = recordList[this.config.index] || 0
        limitCount = limitCount - useCount

        if (this.count + btnCount > limitCount) {
            btnCount = limitCount - this.count
        }

        let costMoney = this.config.newPrice * (this.count + btnCount)
        let hadMoney = GetHeroMoney(this.config.unit)

        if (costMoney > hadMoney) {
            return
        } else {
            this.count = this.count + btnCount
        }

        this.onRefreshSelectNum()
    }

    onReduceClick(args: egret.Event) {
        let btnName = args.target.name
        let btnCount = 0
        if (btnName == "btn_reduce") {
            btnCount = -1
        } else if (btnName == "btn_reduce10") {
            btnCount = -10
        } else if (btnName == "btn_reduce50") {
            btnCount = -50
        }

        this.count = (this.count + btnCount) > 1 ? (this.count + btnCount) : 1

        this.onRefreshSelectNum()
    }

    onBtnBuyClick() {
        RpcProxy.call("C2G_DoOperateActivity", this.index, [this.config.index, this.count])
        this.hideWnd()
    }

    ////////////////////////////////////////////////
    showWithData(config, actIndex) {
        this.config = config
        this.index = actIndex
        this.showWnd()
    }
}