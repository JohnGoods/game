// TypeScript file
class PartComputeFrame extends BaseWnd {
    itemInfo: Item
    memberInfo

    count

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/club/PartComputeLayout.exml"]

        this.count = 1
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        this.mLayoutNode.verticalCenter = -100

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

            { ["name"]: "sure_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.partItem },

            { ["name"]: "btn_cut1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCutOne },
            { ["name"]: "btn_cut10", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCutTen },
            { ["name"]: "btn_plus1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPlusOne },
            { ["name"]: "btn_plus10", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPlusTen },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["itemBox"] = UIItemBox.newObj(this.mLayoutNode, "itemBox", 0, 0, this.mElemList["item_wnd"])
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;

        this.count = 1

        this.refreshFrame()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
    }

    refreshFrame() {
        let itemId = this.itemInfo.entryId
        let itemName = ItemSystem.getInstance().getItemName(itemId)
        let itemDes = ItemSystem.getInstance().getItemTemplateInfoValue(itemId, "description")

        this.mElemList["itemBox"].updateByEntry(itemId)
        AddRdContent(this.mElemList["item_name_rd"], itemName, "ht_24_cc", "darkgoldenrod", 5)
        AddRdContent(this.mElemList["item_des_rd"], itemDes, "ht_22_cc", "ublack", 3)

        this.updateCount()
    }

    updateCount() {
        this.mElemList["count_txt"].text = this.count
    }

    onClickCutOne() { //-1
        this.count = this.count - 1
        if (this.count <= 0) {
            this.count = 1
        }
        this.updateCount()
    }

    onClickCutTen() { //-10
        this.count = this.count - 10
        if (this.count <= 0) {
            this.count = 1
        }
        this.updateCount()
    }

    onClickPlusOne() { //+1
        this.count = this.count + 1
        if (this.count > this.itemInfo.getProperty("count")) {
            this.count = this.itemInfo.getProperty("count")
        }
        this.updateCount()
    }

    onClickPlusTen() { //+10
        this.count = this.count + 10
        if (this.count > this.itemInfo.getProperty("count")) {
            this.count = this.itemInfo.getProperty("count")
        }
        this.updateCount()
    }

    partItem() {
        if (this.count > this.itemInfo.getProperty("count")) {
            this.count = this.itemInfo.getProperty("count")
        }

        if (this.count < 1) {
            this.count = 1
        }

        //发送奖励
        RpcProxy.call("C2G_FactionAllocaItem", this.itemInfo.id, this.count, this.memberInfo.id)

        this.hideWnd()
    }

    /////////////////////////////////////////////////////////////////
    showWithData(itemInfo, memberInfo) {
        this.itemInfo = itemInfo
        this.memberInfo = memberInfo
        this.showWnd()
    }
}