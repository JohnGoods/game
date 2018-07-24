// TypeScript file
class CampaignRankFrame extends ActivityRankBaseFrame {

    scroll: UIScrollList;
    rankList: any[];

    public initObj(...params: any[]) {
        this.rankList = []
    }

    public onLoad(): void {
        super.onLoad()
    }

    public onUnLoad(): void {
        super.onUnLoad()
    }

    public onShow(): void {
        RegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.refresh, this)
        super.onShow()

        this.mElemList["label_wndName"].text = Localize_cns("CAMPAIGN_TXT1")
        this.mElemList["tl4"].text = Localize_cns("CAMPAIGN_TXT2")
		this.mElemList["my_rank1"].text = ""
		this.mElemList["my_rank2"].text = ""

        this.sendRankRequire()
        this.refreshInfo()
    }

    public onHide(): void {
        super.onHide()
        UnRegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.refresh, this)
        this.mLayoutNode.visible = (false)
    }

    refresh(info) {
        this.rankList = info.ranklist
        super.refreshFrame()
    }

    refreshInfo(){ //更新自己的数据
        let campId = CampaignSystem.getInstance().getCurOpenCampaign()
        let pass = GameConfig.CampaignConfig[campId].next - 1 - 1
		AddRdContent(this.mElemList["reward_rd"], Localize_cns("COPY_TXT27") + pass + Localize_cns("CAMPAIGN_TXT10"), "ht_20_cc", "zongse")
	}

    refreshItemWindow(window, config, index) {
		let name = window.name
		let info = config 
		
		this.mElemList[name + "_star"].visible = false
		this.mElemList[name + "reward_rd"].visible = true

        let rankNum = tonumber(index) + 1
		this.mElemList[name + "_rank"].text = rankNum
		this.mElemList[name + "_name"].text = info[3] || ""
        this.mElemList[name + "_force"].text = Math.round(info[1]) || 0

        let pass = info[0] || 0
		AddRdContent(this.mElemList[name + "reward_rd"], pass + Localize_cns("CAMPAIGN_TXT10"), "ht_22_cc", "green")

        if (config[2] == GetHeroProperty("id")) {
            this.myRank = index + 1
            this.myConfig = config
        }
	}

    genConfigList() {
        return this.rankList
    }

    refreshHeroRank() {
        if (!this.myRank) {
            this.mElemList["my_rank0"].text = String.format(Localize_cns("OPENSERVER_TXT10"), Localize_cns("OPENSERVER_TXT11"))

            return
        }
        
        this.mElemList["my_rank0"].text = String.format(Localize_cns("OPENSERVER_TXT10"), this.myRank)
        return
    }

    //////////////////////////////////////////
    //发送协议获取排行数据
    sendRankRequire() {
        RpcProxy.call("C2G_RoleRank", configRankType.RANK_CAMPAIGN,1)
        // let message = GetMessage(opCodes.C2G_ROLE_RANK)
        // message.rankType = configRankType.RANK_CAMPAIGN
        // message.index = 1
        // SendGameMessage(message)
    }
}