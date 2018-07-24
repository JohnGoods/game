// TypeScript file
class CampaginPrizeFrame extends BaseWnd {
    campaignId: number;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/campaign/CampaignPrizeLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();
        this.setAlignCenter(true, true)
        this.mLayoutNode.setDoModal(true)

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

            { ["name"]: "btn_get", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGet },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["tips_rd"].setAlignFlag(gui.Flag.H_CENTER)

        this.mElemList["itemBox"] = UIItemBox.newObj(this.mLayoutNode, "itemBox", 0, 0, this.mElemList["item_wnd"])
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;

        this.refreshFrame()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
    }

    refreshFrame() {
        this.updateTipsRd()

        let giftConfig = CampaignSystem.getInstance().getCampaignGift(this.campaignId)

        if (giftConfig) {
            let gift = AnalyPrizeFormat(giftConfig)
            this.udpateItemWnd(gift[0][0], gift[0][1])
        }
    }

    //通关提示
    updateTipsRd() {
        let name = CampaignSystem.getInstance().getCampaignName(this.campaignId)
        let str = String.format(Localize_cns("CAMPAIGN_TXT14"), name)
        AddRdContent(this.mElemList["tips_rd"], str, "ht_24_cc", "ublack")
    }

    //更新奖励
    udpateItemWnd(entryId, count) {
        let itemName = ItemSystem.getInstance().getItemName(entryId)
        this.mElemList["itemBox"].updateByEntry(entryId, count)
        let itemConfig = ItemSystem.getInstance().getItemTemplateInfo(entryId)
        let color = GetQualityColorGui(itemConfig.quality)
        this.mElemList["item_name"].text = itemName
        this.mElemList["item_name"].textColor = color
    }

    onClickGet() {        
        RpcProxy.call("C2G_ITEM_CAMPAGIN_GIFT_BUY", this.campaignId)

        this.hideWnd()
    }

    /////////////////////////////////////////////////////////////
    showWithCampaignId(campaignId) {
        this.campaignId = campaignId
        this.showWnd()
    }
}