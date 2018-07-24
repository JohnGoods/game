class ChampionRankFrame extends ActivityRankBaseFrame {
	scroll: UIScrollList;
	rankList:any[] ;

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
		this.mElemList["label_wndName"].text = Localize_cns("JJC_TXT8")
		this.mElemList["tl4"].text = Localize_cns("JJC_TXT9")
		this.mElemList["reward_rd"].visible = true
		this.mElemList["my_rank1"].text = ""
		this.mElemList["my_rank2"].text = ""
		this.sendRankRequire()
		this.refreshInfo()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.refresh, this)
		this.mElemList["reward_rd"].visible = false
		super.onHide()
		this.mLayoutNode.visible = false;
	}

	refreshInfo(){
		let a = GetActivity(ActivityDefine.Champion)
        let info = a.getChampionInfo()
		let rank = info.rank
		let rewardInfo = this.getDailyPrizeItemList(rank)
		if(rewardInfo == null){
			AddRdContent(this.mElemList["reward_rd"],"" , "ht_20_cc", "zongse")
			return
		}
		let point = rewardInfo.point
		let bindCurrency = rewardInfo.bindCurrency
		let rdText = point+"#BIND_YUANBAO"+bindCurrency+"#JJC_POINT"
		AddRdContent(this.mElemList["reward_rd"],rdText, "ht_20_cc", "zongse")
	}

	refresh(info){
		this.rankList = info.ranklist
		super.refreshFrame()
	}

	refreshItemWindow(window, config) {
		let name = window.name
		let info = config 
		
		this.mElemList[name + "_star"].visible = false
		this.mElemList[name + "reward_rd"].visible = true

		let rankNum = info[0] || 1
		this.mElemList[name + "_rank"].text = rankNum
		this.mElemList[name + "_name"].text = info[2] || ""
		this.mElemList[name + "_force"].text = info[3] || 0
		
		let rewardInfo = this.getDailyPrizeItemList(rankNum)
		if(rewardInfo == null){
			AddRdContent(this.mElemList[name + "reward_rd"],"" , "ht_20_cc", "zongse")
			return
		}
		let point = rewardInfo.point
		let bindCurrency = rewardInfo.bindCurrency
		let rdText = bindCurrency+"#BIND_YUANBAO"+point+"#JJC_POINT"
		AddRdContent(this.mElemList[name + "reward_rd"],rdText , "ht_20_cc", "zongse")
		// let [enable, des, str] = FastJumpSystem.getInstance().checkFastJump(config[0], config[1])
		// this.mElemList[name + "_option"].enabled = (enable)
		// AddRdContent(this.mElemList[name + "_dec"], des, "ht_24_cc", "zongse")
		// this.controlDataTable[name + "_option"] = config

		// this.mElemList[name + "_block"].visible = (!enable)
		// if (enable == false) {
		// 	this.controlDataTable[name + "_block"] = str
		// }

		 if (config[1] == GetHeroProperty("id")) {
            this.myRank = rankNum
            this.myConfig = config
        }
	}

	refreshHeroRank() {
        if (!this.myRank) {
            this.mElemList["my_rank0"].text = String.format(Localize_cns("OPENSERVER_TXT10"), Localize_cns("OPENSERVER_TXT11"))

            return
        }
        
        this.mElemList["my_rank0"].text = String.format(Localize_cns("OPENSERVER_TXT10"), this.myRank)
        return
    }

	//计算每日奖励
    getDailyPrizeItemList(rank) {
        for (let i in GameConfig.ChampionPrizeConfig) {
            let v = GameConfig.ChampionPrizeConfig[i]
            if (rank >= v.rankUp && rank <= v.rankDown) {
                return v
            }
        }
        return null
    }

	genConfigList() {
        return this.rankList
    }

	//发送协议获取排行数据
	sendRankRequire() {
		RpcProxy.call("C2G_RoleRank", configRankType.RANK_JJC,1)
		// let message = GetMessage(opCodes.C2G_ROLE_RANK)
		// message.rankType = configRankType.RANK_JJC
		// message.index = 1
		// SendGameMessage(message)
	}
}