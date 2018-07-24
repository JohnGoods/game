// TypeScript file
class CampaignBossFrame extends BaseWnd {
    campaignId: number;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/campaign/CampaignBossLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();
        this.setFullScreen(true)

        let mElemInfo: any = [
            { ["name"]: "btn_close", ["title"]: null, ["color"]: gui.Color.white,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["color"]: gui.Color.white,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "help_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickHelp },
            { ["name"]: "fight_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFight },
        ]
        UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["link_view"] = UILinkView.newObj(this.mLayoutNode, "link_view", 0, 0, this.mElemList["link_wnd"])
        this.mElemList["link_view"].setContent(Localize_cns("CAMPAIGN_TXT7"))
        this.mElemList["link_view"].setCallBack(this.onClickRank, this)

        this.mElemList["actor_view"] = UIActorView.newObj(this.mLayoutNode, "actor_view", 60, 150, this.mElemList["actor_wnd"])

        //通关奖励
        this.mElemList["passItemBox"] = UIItemBox.newObj(this.mLayoutNode, "passItemBox", 0, 0, this.mElemList["pass_item_wnd"])

        //概率掉落
        for (let i = 0; i < 5; i++) {
            this.mElemList["dropItemBox" + i] = UIItemBox.newObj(this.mLayoutNode, "dropItemBox" + i, 0, 0, this.mElemList["drop_item_wnd"])
        }

        this.mElemList["fight_btn"].visible = false
        this.mElemList["fight_tips"].visible = false

        this.mElemList["help_btn"].visible = false
        
        //通关记录
        this.mElemList["link_record"] = UILinkView.newObj(this.mLayoutNode, "link_record", -10, 15, this.mElemList["video_group"])
        this.mElemList["link_record"].setDefaultFont("ht_22_cc_stroke")
        this.mElemList["link_record"].setLine(true, gui.Color.ublack)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.CAMPAIGN_MINE, this.refreshFrame, this)
        RegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.refreshRank, this)
        RegisterEvent(EventDefine.COMBAT_END, this.refreshFrame, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateHelpRd, this)
        RegisterEvent(EventDefine.CAMPAIGN_VEDIO, this.updateVedioInfo, this)
        this.mLayoutNode.visible = (true)
        this.sendRankRequire() //请求排名数据
        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.CAMPAIGN_MINE, this.refreshFrame, this)
        UnRegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.refreshRank, this)
        UnRegisterEvent(EventDefine.COMBAT_END, this.refreshFrame, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateHelpRd, this)
        UnRegisterEvent(EventDefine.CAMPAIGN_VEDIO, this.updateVedioInfo, this)
        this.mLayoutNode.visible = (false)
        let actorview = <UIActorView>this.mElemList["actor_view"]
        actorview.clearView()
    }

    refreshRank(info) {
        let rankList = info.ranklist
        let list = []
        for (let i = 0; i < 3; i++) { //更新前三
            if (rankList[i]) {
                let t: any = {}
                t.name = rankList[i][3]
                t.pass = rankList[i][0]
                table_insert(list, t)
            }
        }

        this.updateSmallRank(list)
    }

    refreshFrame() {
        this.campaignId = CampaignSystem.getInstance().getCurOpenCampaign()
        if (!this.campaignId) {
            return
        }

        this.mElemList["camp_name"].text = CampaignSystem.getInstance().getCampaignName(this.campaignId)

        this.updateHelpRd()

        this.updatePassWnd()

        this.updateActorModel()

        //更新掉落物品
        let prizeList = AnalyPrizeFormat(CampaignSystem.getInstance().getCampaignPrize(this.campaignId))
        for (let i = 0; i < 5; i++) {
            let v = prizeList[i]
            if (v) {
                this.mElemList["dropItemBox" + i].updateByEntry(v[0], v[1])
            }
        }
        this.updateVedioInfo()

        //挑战状态更新
        let isCanBattle = CampaignSystem.getInstance().bossCampaitnBattle()
        if (isCanBattle) {
            this.mElemList["fight_btn"].visible = true
            this.mElemList["fight_tips"].visible = false

            this.mElemList["help_btn"].visible = true
        } else {
            this.mElemList["fight_btn"].visible = false
            this.mElemList["fight_tips"].visible = true

            this.mElemList["help_btn"].visible = false

            let needMine = CampaignSystem.getInstance().getNeedMine(this.campaignId)
            let curMine = CampaignSystem.getInstance().getCurMine()
            this.mElemList["fight_tips"].text = String.format(Localize_cns("CAMPAIGN_TXT11"), needMine - curMine)
            this.mElemList["fight_tips"].textColor = gui.Color.ublack

            this.mElemList["video_group"].visible = false
        }

        
    }

    updateVedioInfo(){
        let videoInfo = CampaignSystem.getInstance().getVideoInfo()
        this.mElemList["video_group"].visible = false
        if(videoInfo && videoInfo[1]){
            this.mElemList["video_group"].visible = true
            this.mElemList["video_btn"].text = videoInfo[0]
            this.mElemList["passpower"].text = String.format(Localize_cns("FIGHT_TXT13"),MakeLongNumberShort(videoInfo[1]))
            // this.mElemList["passname"].text = String.format(Localize_cns("FIGHT_TXT14"), videoInfo[0])
            this.mElemList["link_record"].setContent("#nor" + String.format(Localize_cns("FIGHT_TXT14"), videoInfo[0]))
            this.mElemList["link_record"].setCallBack(this.onClickRecord, this, [videoInfo[2], videoInfo[3]])
        }
    }

    //更新前三
    updateSmallRank(list) {
        let colorStr = ["#orange", "#magenta", "#cyan"]
        let rankStr = ""
        let nameStr = ""
        let passStr = ""
        for (let i = 0; i < 3; i++) {
            let v = list[i]
            if (v) {
                rankStr += colorStr[i] + (tonumber(i) + 1) + "#br"
                nameStr += colorStr[i] + v.name + "#br"
                passStr += colorStr[i] + v.pass + Localize_cns("CAMPAIGN_TXT10") + "#br"
            }
        }

        AddRdContent(this.mElemList["rank_rd"], rankStr, "ht_24_cc_stroke", "white", 6)
        AddRdContent(this.mElemList["name_rd"], nameStr, "ht_24_cc_stroke", "white", 6)
        AddRdContent(this.mElemList["pass_rd"], passStr, "ht_24_cc_stroke", "white", 6)
    }

    //求助信息
    updateHelpRd() {
        let needHelpCount = getSaveRecord(opSaveRecordKey.campaignGetHelpCount)
        let helpCount = getSaveRecord(opSaveRecordKey.campaignHelpCount)
        let request = defaultValue.CAMPAIGN_NEED_HELP - needHelpCount
        let requestLimit = defaultValue.CAMPAIGN_NEED_HELP
        let help = defaultValue.CAMPAIGN_HELP - helpCount
        let helpLimit = defaultValue.CAMPAIGN_HELP
        let str = String.format(Localize_cns("CAMPAIGN_TXT9"), request, requestLimit, help, helpLimit)
        AddRdContent(this.mElemList["help_rd"], str, "ht_20_cc", "ublack", 3)
    }

    //更新通关奖励和进度
    updatePassWnd() {
        let sum = 0
        let num = 0

        let campId = 0
        for (let i = this.campaignId - 1; i >= 1001; i--) {
            let config = CampaignSystem.getInstance().getCampaignGift(i)
            if (config && size_t(config) > 0) {
                campId = i
                break
            } else {
                sum = sum + 1
                num = num + 1
            }
        }

        let giftConfig = null
        for (let i = this.campaignId; i <= 3980; i++) {
            sum = sum + 1
            let config = CampaignSystem.getInstance().getCampaignGift(i)
            if (config && size_t(config) > 0) {
                giftConfig = CampaignSystem.getInstance().getCampaignGift(i)
                break
            }
        }

        if (giftConfig) {
            let gift = AnalyPrizeFormat(giftConfig)
            this.mElemList["passItemBox"].updateByEntry(gift[0][0], gift[0][1])
        }

        UiUtil.updateProgress(this.mElemList["pass_imb"], num, sum)
    }

    //更新ActorView
    updateActorModel() {
        let modeID = GetCampaignBossModel(this.campaignId)

        let actorview = <UIActorView>this.mElemList["actor_view"]
        let actor = actorview.updateByPlayer(modeID)
        let ratio = GameConfig.ModelConfig[modeID].scale || 1
        actor.setScale(ratio * 1.5)
    }

    //////////////////////////////////////////
    onClickFight(args) {
        if (CheckActivityState() == false) {
            return
        }
        
        if (CheckBeiBaoEquipWillFull()) {
            return
        }

        if (CheckFightState() == true) {
            return
        }

        RpcProxy.call("C2G_CampaginFight", this.campaignId, 0)
        this.hideWnd()
    }

    onClickHelp(args) {
        let request = defaultValue.CAMPAIGN_NEED_HELP - (getSaveRecord(opSaveRecordKey.campaignGetHelpCount))
        if(request == defaultValue.CAMPAIGN_NEED_HELP){
            MsgSystem.addTagTips(Localize_cns("CAMPAIGN_TXT16"))
            return
        }
        let wnd = WngMrg.getInstance().getWindow("CampaignBossQiuZhuFrame")
        wnd.showAndSetData()
    }

    onClickRank(args) {
        // let wnd = WngMrg.getInstance().getWindow("CampaignRankFrame")
        // wnd.showWnd()

        let wnd = WngMrg.getInstance().getWindow("CampaignRecordFrame")
		wnd.showWithIndex(0)
    }
    
    onClickRecord(data) {
        let [roleId, videoId] = data || [null, null]
        if (videoId == null) {
            RpcProxy.call("C2G_GetPlayerInfoByID", roleId)
            return// MsgSystem.addTagTips(Localize_cns("FIGHT_TXT16"))
        }
        GetFightVideo(videoId, roleId)
    }

    sendRankRequire() {
        RpcProxy.call("C2G_RoleRank", configRankType.RANK_CAMPAIGN,1)
        // let message = GetMessage(opCodes.C2G_ROLE_RANK)
        // message.rankType = configRankType.RANK_CAMPAIGN
        // message.index = 1
        // SendGameMessage(message)
    }
}