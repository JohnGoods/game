// TypeScript file
class CampaignBossQiuZhuFrame extends BaseWnd {
    campaignId: number;
    lastSendTime :number

    public initObj(...params: any[]) {
        this.lastSendTime = -1
        this.mLayoutPaths = ["resource/layouts/campaign/CampaignBossQiuZhuLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();
        // this.setFullScreen(true)
        this.setAlignCenter(true, true)

        let mElemInfo: any = [
            { ["name"]: "btn_close", ["title"]: null, ["color"]: gui.Color.white, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "word_help", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onWorldHelp },
            { ["name"]: "club_help", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClubHelp },
        ]
        UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this);
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = (true)
        this.refreshFrame()
    }

    public onHide(): void {
        this.mLayoutNode.visible = (false)
    }

    refreshFrame(){

    }

    onWorldHelp(){
        if (CheckActivityState() == false) {
            return
        }
        
        if (CheckBeiBaoEquipWillFull()) {
            this.hideWnd()
            return
        }

        if (CheckFightState() == true) {
            return
        }
        this.sendHyperLinkText(channelType.WORLD)
    }
   
    onClubHelp(){
        if (CheckActivityState() == false) {
            return
        }
        
        if (CheckBeiBaoEquipWillFull()) {
            this.hideWnd()
            return
        }

        if (CheckFightState() == true) {
            return
        }
        //判断公会
        if (GetHeroProperty("faction") == 0) {
            MsgSystem.addTagTips(Localize_cns("CLUB_TXT130"))
            return
        }
        this.sendHyperLinkText(channelType.FACTION)     
    }

     sendHyperLinkText(type) {
        let curSendTime = GetCurMillSec()
		if (this.lastSendTime > 0 && curSendTime - this.lastSendTime < 15000) {
			MsgSystem.addTagTips(Localize_cns("CAMPAIGN_TXT18"))
			return
		}
        MsgSystem.addTagTips(Localize_cns("CHAT_TXT9"))
		this.lastSendTime = curSendTime	
        let campaignId = CampaignSystem.getInstance().getCurOpenCampaign()
        let str = GameConfig.HyperLinkConfig[channelOption.C_QIUZHU].des
        if (str) {
            // let myName = GetHeroProperty("name")
            let targetId = campaignId
            let myId = GetHeroProperty("id")
            let campaignName = CampaignSystem.getInstance().getCampaignName(campaignId)
            let hyperLinkText = String.format(str, campaignName, XmlConverter.LinkSign, myId, targetId, XmlConverter.LinkSign)
            let message = GetMessage(opCodes.C2G_CHANNEL_SEND)
            message.channel = type
            message.data = hyperLinkText
            SendGameMessage(message)
            

            this.hideWnd()
        }
    }

    showAndSetData(){
        this.showWnd()
    }
}