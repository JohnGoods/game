class LimitedSaleTipsFrame extends BaseWnd {

    scroll: UIScrollList
    saleInfo
    num



    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/activity/LimitedSaleTipsLayout.exml"]
        this.num = 1
    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.width = 640
        this.mLayoutNode.height = 410
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_buy", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBuyClick },

            { ["name"]: "btn_add", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAddClick },
            { ["name"]: "btn_add10", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAddClick },
            { ["name"]: "btn_add50", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAddClick },

            { ["name"]: "btn_reduce", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onReduceClick },
            { ["name"]: "btn_reduce10", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onReduceClick },
            { ["name"]: "btn_reduce50", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onReduceClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["itemBox"] = UIItemBox.newObj(this.mLayoutNode, "itemBox", 280, 79)

        this.mElemList["rd_cost"].setAlignFlag(gui.Flag.CENTER_CENTER)
    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.check, this)
        this.mLayoutNode.visible = true;
        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.check, this)
        this.mLayoutNode.visible = false;
        this.saleInfo = null
        this.num = 1
    }

    check(){
        let playerInfo = getSaveRecord(opSaveRecordKey.FallenGoodGiftShop) || {}
        let saleInfo = this.saleInfo
        let maxCount = saleInfo.limitCount
        let hadPoint = playerInfo[saleInfo.index]
        if(hadPoint >= maxCount){
            this.hideWnd()
        }
    }

    onRefresh() {

        if (this.saleInfo == null) return

        let item = AnalyPrizeFormat(this.saleInfo.item)
        this.mElemList["itemBox"].updateByEntry(item[0][0], item[0][1])

        this.refreshNum()
    }

    refreshNum() {
        this.mElemList["label_num"].text = this.num
        let str = GetMoneyIcon(this.saleInfo.unit) + this.saleInfo.newPrice * this.num
        AddRdContent(this.mElemList["rd_cost"], str, "ht_20_cc", "ublack")
    }

    //////////////////////

    onAddClick(args: egret.Event) {
        let name = args.target.name
        if (this.saleInfo == null) return
        let saleInfo = this.saleInfo
        let maxCount = saleInfo.limitCount

        let playerInfo = getSaveRecord(opSaveRecordKey.FallenGoodGiftShop) || {}
        let hadPoint = playerInfo[saleInfo.index] || 0
        maxCount -= hadPoint
        let price = saleInfo.newPrice

        let heroMoney = GetHeroMoney(saleInfo.unit)
        let ratio = 1
        if (name == "btn_add") {
            ratio = 1
        } else if (name == "btn_add10") {
            ratio = 10
        } else {
            ratio = 50
        }
        //let addNum = maxCount + 0
        if (heroMoney < price * (this.num + ratio)) {
            this.num = Math.floor(heroMoney / price)
        }else{
            this.num += ratio
        }
       
        //this.num += addNum
        if (this.num > maxCount) this.num = maxCount
        if (this.num <= 0) this.num = 1
        this.refreshNum()

    }

    onReduceClick(args: egret.Event) {
        let name = args.target.name
        if (name == "btn_reduce") {
            this.num -= 1
        } else if (name == "btn_reduce10") {
            this.num -= 10
        } else {
            this.num -= 50
        }

        if (this.num <= 0) {
            this.num = 1
        }

        this.refreshNum()
    }

    onBuyClick() {
        if (this.saleInfo == null || this.saleInfo.index == null) return

        if (GetHeroMoney(this.saleInfo.unit) < this.saleInfo.newPrice) {
            let formatStr = Localize_cns(ItemUnitName[this.saleInfo.unit])
            MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
            return
        }

        RpcProxy.call("C2G_DoOperateActivity", PayActivityIndex.Fallen_Good_Gift_SHOP, [this.saleInfo.index, this.num])

    }

    //////////////-------------
    onShowWnd(saleInfo) {
        if (!saleInfo) return
        this.saleInfo = saleInfo
        this.showWnd()
    }
}