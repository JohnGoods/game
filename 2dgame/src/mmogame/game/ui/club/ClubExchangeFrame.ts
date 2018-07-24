// TypeScript file
class ClubExchangeFrame extends BaseWnd {
    timer: number;

    array: any[];

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/club/ClubExchangeLayout.exml"]

        this.array = []
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        //this.setFullScreen(true)
        this.initSkinElemList();
        this.setAlignCenter(true, true)

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

            { ["name"]: "reset_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickReset },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        for (let i = 0; i < 4; i++) {
            this.mElemList["itemBox_" + i] = UIItemBox.newObj(this.mLayoutNode, "itemBox_" + i, 0, 0, this.mElemList["item_pos" + i])

            this.mElemList["cost_name_rd" + i].setAlignFlag(gui.Flag.LEFT)
            this.mElemList["cost_count_rd" + i].setAlignFlag(gui.Flag.RIGHT)

            let btn = <gui.Button>this.mElemList["exchange_btn" + i]
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickExchange, this)
        }

        AddRdContent(this.mElemList["reset_rd"], "#YUANBAO 180", "ht_24_cc", "saddlebrown")
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        RegisterEvent(EventDefine.CLUB_EXCHANGE, this.refreshFrame, this)
        this.mLayoutNode.setDoModal(true)
        this.mLayoutNode.visible = true;

        RpcProxy.call("C2G_FactionExchangeItemList", 0)

        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        UnRegisterEvent(EventDefine.CLUB_EXCHANGE, this.refreshFrame, this)
        this.mLayoutNode.setDoModal(false)
        this.mLayoutNode.visible = false;

        if (this.timer) {
            KillTimer(this.timer)
            this.timer = null
        }
    }

    refreshFrame() {
        this.refreshDotTips()

        let exchangeInfo = GetActivity(ActivityDefine.ClubMap).getExchangeData()

        let array = exchangeInfo.array || []
        let count = exchangeInfo.count || 0
        let time = exchangeInfo.time || 0

        this.array = array

        if (time == 0) {
            return
        }

        //更新按钮状态
        let record = getSaveRecord(opSaveRecordKey.facExchange) || {}
        for (let i in opExchangItem) {
            let key = opExchangItem[i]
            if (record[key] == 1) {
                this.mElemList["exchange_btn" + (key - 100)].enabled = false
                this.mElemList["exchange_btn" + (key - 100)].text = Localize_cns("EXCHANGE_TXT2")
            } else {
                this.mElemList["exchange_btn" + (key - 100)].enabled = true
                this.mElemList["exchange_btn" + (key - 100)].text = Localize_cns("EXCHANGE_TXT1")
            }
        }


        for (let i = 0; i < 4; i++) {
            if (array[i]) {
                this.mElemList["item_wnd" + i].visible = true
                this.refreshExchangeItem(array[i], i)
                let config = GameConfig.FactionExchangeConfig[array[i]].exchange
                this.refreshExchangeCostItem(config, i)
            } else {
                this.mElemList["item_wnd" + i].visible = false
            }
        }

        //更新倒计时和次数
        if (this.timer) {
            KillTimer(this.timer)
            this.timer = null
        }

        let _this = this
        this.timer = SetTimer(function () {
            let left = time - GetServerTime()
            if (left < 0) {
                left = 0
                KillTimer(this.timer)
                this.timer = null
                RpcProxy.call("C2G_FactionExchangeItemList", 0)
            }

            let str = String.format(Localize_cns("CLUB_TXT108"), getFormatDiffTime(left), count)
            AddRdContent(_this.mElemList["refresh_rd"], str, "ht_24_cc", "saddlebrown", 5)
        }, this, 500, false)
    }

    refreshExchangeItem(itemId, index) {
        let itemName = ItemSystem.getInstance().getItemName(itemId)
        let itemQuality = ItemSystem.getInstance().getItemTemplateInfoValue(itemId, "quality")
        if (this.mElemList["itemBox_" + index]) {
            this.mElemList["itemBox_" + index].updateByEntry(itemId)
        }

        if (this.mElemList["item_name" + index]) {
            this.mElemList["item_name" + index].text = itemName
            this.mElemList["item_name" + index].textColor = GetQualityColorGui(itemQuality, false)
        }
    }

    refreshExchangeCostItem(itemConfig, index) {
        let itemList = AnalyPrizeFormat(itemConfig)
        let nameStr = ""
        let countStr = ""
        for (let i in itemList) {
            let item = itemList[i]
            let itemId = item[0]
            let itemCount = item[1]
            let ownCount = ItemSystem.getInstance().getItemCount(itemId)
            let itemName = ItemSystem.getInstance().getItemName(itemId)
            let color = ownCount >= itemCount ? "#green" : "#red"
            nameStr = nameStr + itemName + "#br"
            countStr = countStr + color + ownCount + "/" + itemCount + "#br" + "#saddlebrown"
        }

        if (this.mElemList["cost_name_rd" + index]) {
            AddRdContent(this.mElemList["cost_name_rd" + index], nameStr, "ht_18_cc", "saddlebrown", 3)
        }

        if (this.mElemList["cost_count_rd" + index]) {
            AddRdContent(this.mElemList["cost_count_rd" + index], countStr, "ht_18_cc", "saddlebrown", 3)
        }
    }

    onClickExchange(event: egret.TouchEvent) {
        let name = event.target.name
        let index = name.replace(/[^0-9]/ig, "");

        if (this.array[index]) {
            if (GuideFuncSystem.getInstance().checkClubExchange(index)) {
                RpcProxy.call("C2G_FactionExchangeItem", this.array[index], tonumber(index) + 100)
            } else {
                MsgSystem.addTagTips(Localize_cns("CLUB_TXT123"))
            }
        }
    }

    onClickReset() {
        var callback: IDialogCallback = {
            onDialogCallback(result: boolean, userData): void {
                if (result == true) {
                    RpcProxy.call("C2G_FactionExchangeItemList", 1)
                }
            }
        }
        MsgSystem.confirmDialog(Localize_cns("CLUB_TXT109"), callback, null)
    }

    //红点提示
    refreshDotTipsImp() {
        for (let i = 0; i < 4; i++) {
            if (GuideFuncSystem.getInstance().checkClubExchange(i)) {
                this.createDotTipsUI(this.mElemList["exchange_btn" + i])
            }
        }
    }
}