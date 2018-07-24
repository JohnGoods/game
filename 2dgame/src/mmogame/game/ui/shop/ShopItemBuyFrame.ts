class ShopItemBuyFrame extends BaseWnd {
    shopEntry
    pos
    num


    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/ShopItemBuyLayout.exml"]
        this.num = 1

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
        //UiUtil.registerTouchOutsideEvent(this.hideWnd, this, [this.mLayoutNode])
        this.mLayoutNode.visible = true
        this.mLayoutNode.setDoModal(true)
        this.onRefresh()
    }

    public onHide(): void {
        //UiUtil.unRegisterTouchOutsideEvent(this.hideWnd, this)
        this.mLayoutNode.visible = false;
        this.mLayoutNode.setDoModal(false)
    }

    onRefresh() {
        this.num = 1

        ////装备跟非装备
        if (this.shopEntry >= 5 && this.shopEntry <= 16) {
            this.mElemList["group_equip"].visible = true
        } else {
            this.mElemList["group_equip"].visible = false
        }

        let tempConfig = GameConfig.ShopCommodityConfig[this.shopEntry][this.pos]
        let itemId = tempConfig.itemEntry
        let itemConfig = GameConfig.itemConfig[itemId]
        let name = itemConfig.name
        let count = tempConfig.buyNumber
        let quality = tempConfig.quality
        let limitTice = ShopSystem.getInstance().getLimitTwice(this.shopEntry, this.pos)

        let hadBuy = 0
        let tempInfo = ShopSystem.getInstance().getShopPosInfo(this.shopEntry, this.pos)
        if (tempInfo != null) {
            hadBuy = tempInfo.count
        }
        //item
        this.mElemList["itemBox"].updateByEntry(itemId, count, quality)
        let nameStr = Localize_cns("SHOP_TXT4")

        if (limitTice != 0) {
            nameStr = "#green(" + hadBuy + "/" + limitTice + ")"
        }
        AddRdContent(this.mElemList["rd_name"], name + "#br#br" + nameStr, "ht_20_cc", "ublack")
        //描述
        let des = itemConfig.description || Localize_cns("SHOP_TXT7")

        AddRdContent(this.mElemList["rd_des"], des, "ht_20_cc", "ublack")
        //num
        this.onRefreshSelectNum()


    }

    onRefreshSelectNum() {
        this.mElemList["label_num"].text = this.num

        let tempConfig = GameConfig.ShopCommodityConfig[this.shopEntry][this.pos]
        let count = tempConfig.buyNumber
        let costIcon
        if (tempConfig.money != null && tempConfig.money != 0) {
            costIcon = GetMoneyIcon(tempConfig.money)
        } else {
            costIcon = GetTagIcon(tempConfig.unit)
        }
        //价格
        let totalPrice = tempConfig.price* tempConfig.discount * this.num
        AddRdContent(this.mElemList["rd_cost"], Localize_cns("SHOP_TIPS_TXT2") + costIcon + "X" + totalPrice, "ht_20_cc", "ublack")
    }


    //////////////响应
   /* onAddClick(args: egret.Event) {
        let btnName = args.target.name
        let tempConfig = GameConfig.ShopCommodityConfig[this.shopEntry][this.pos]
        // let count = tempConfig.buyNumber
        let limitTice = ShopSystem.getInstance().getLimitTwice(this.shopEntry, this.pos)
        if (limitTice == 0) {
            this.num += 1
        } else {
            let cost = tempConfig.price * (this.num + 1)
            let had = 0
            if (tempConfig.unit != 0) {
                had = ItemSystem.getInstance().getItemCount(tempConfig.unit)
            } else {
                had = GetHeroMoney(tempConfig.money)
            }
            if (had >= cost)
                this.num += 1
            if (this.num > limitTice) this.num = limitTice
        }
        this.onRefreshSelectNum()
    }
*/
    onAddClick(args: egret.Event) {
        let btnName = args.target.name
        let btnCount = 0
        if(btnName == "btn_add"){
            btnCount = 1
        }else if(btnName == "btn_add10"){
            btnCount = 10
        }else{
            btnCount = 50
        }
        let tempConfig = GameConfig.ShopCommodityConfig[this.shopEntry][this.pos]
        // let count = tempConfig.buyNumber
        let limitTice = ShopSystem.getInstance().getLimitTwice(this.shopEntry, this.pos)
        let cost = tempConfig.price * (this.num + btnCount)
        let had = 0
        if (tempConfig.unit != 0) {
            had = ItemSystem.getInstance().getItemCount(tempConfig.unit)
        } else {
            had = GetHeroMoney(tempConfig.money)
        }
        let addCount = limitTice
        let buyInfo = ShopSystem.getInstance().getShopPosInfo(this.shopEntry, this.pos)
        let restCount = limitTice
        if(buyInfo != null){
            restCount -= buyInfo.count || 0
        }
        if (had >= cost) {
            this.num += btnCount
        } else {
            addCount = Math.floor((had - tempConfig.price * this.num) / tempConfig.price)
            if (addCount < 0) addCount = 0
            this.num += addCount
        }
        if (limitTice != 0) {
            if (this.num > restCount) this.num = restCount
        }

        this.onRefreshSelectNum()
    }

   /* onAdd50Click(args: egret.Event) {
        let btnName = args.target.name
        let tempConfig = GameConfig.ShopCommodityConfig[this.shopEntry][this.pos]
        // let count = tempConfig.buyNumber
        let limitTice = ShopSystem.getInstance().getLimitTwice(this.shopEntry, this.pos)
        if (limitTice == 0) {
            this.num += 10
        } else {
            let cost = tempConfig.price * (this.num + 50)
            let had = 0
            if (tempConfig.unit != 0) {
                had = ItemSystem.getInstance().getItemCount(tempConfig.unit)
            } else {
                had = GetHeroMoney(tempConfig.money)
            }
            if (had >= cost) {
                this.num += 50
            } else {
                let addCount = Math.floor((had - tempConfig.price * this.num) / tempConfig.price)
                if (addCount < 0) addCount = 0
                this.num += addCount
            }

            if (this.num > limitTice) this.num = limitTice
        }

        this.onRefreshSelectNum()
    }*/


    onReduceClick(args: egret.Event) {
        let btnName = args.target.name

        if (btnName == "btn_reduce") {
            if ((this.num - 1) <= 0) return
            this.num -= 1
            this.onRefreshSelectNum()
        } else if (btnName == "btn_reduce10") {
            if ((this.num - 10) <= 0) return
            this.num -= 10
            this.onRefreshSelectNum()
        } else if (btnName == "btn_reduce50") {
            if ((this.num - 50) <= 0) return
            this.num -= 50
            this.onRefreshSelectNum()
        }


    }

    onBtnBuyClick() {
        let tempConfig = GameConfig.ShopCommodityConfig[this.shopEntry][this.pos]
        let had
        // let count = tempConfig.buyNumber
        let cost = tempConfig.price * this.num
        let id = tempConfig.unit
        let unit = tempConfig.money
        let limitKey = ShopSystem.getInstance().getJudgeSuoLimit(tempConfig.shopEntry, tempConfig.Index)
        if (limitKey != "") {
            let isEnough = ShopSystem.getInstance().getJudgeIsEnough(limitKey, tempConfig[limitKey])
            if (isEnough == false) {
                MsgSystem.addTagTips(Localize_cns("SHOP_NOT_UNLOCK"))
                return
            }
        }

        if (unit != 0) {
            had = GetHeroMoney(unit)
            if (had < cost) {
                let formatStr = Localize_cns(ItemUnitName[unit])
                MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
                return
            }
        } else {
            had = ItemSystem.getInstance().getItemCount(id)
            if (had < cost) {
                let name = GameConfig.itemConfig[id].name
                MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), name))
                return
            }
        }

        // "C2G_SHOP_BUT_ITEM":"uint32;uint32;uint32",
        RpcProxy.call("C2G_SHOP_BUT_ITEM", this.shopEntry, this.pos, this.num)

        this.hideWnd()
    }


    ////----------------接口
    onShowWnd(shopEntry, index, ) {
        this.shopEntry = shopEntry
        this.pos = index
        this.showWnd()
    }
}