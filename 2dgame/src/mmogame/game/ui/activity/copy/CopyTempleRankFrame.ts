// TypeScript file
class CopyTempleRankFrame extends ActivityRankBaseFrame {
    rankList: any

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
        //RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)

        this.mElemList["label_wndName"].text = Localize_cns("COPY_TXT21")
        this.mElemList["tl4"].text = Localize_cns("CAMPAIGN_TXT2")
        this.mElemList["my_rank1"].text = Localize_cns("CAMPAIGN_TXT3")

        this.mElemList["reward_rd"].visible = false
        this.sendRankRequire()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.refresh, this)
        super.onHide()
        //UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
        this.mLayoutNode.visible = (false)
    }

	refreshItemWindow(window, config, index) {
		let name = window.name
        
        // [maxNpcIndex, force, plr:getId(), plr:getName()]
        this.mElemList[name + "_rank"].text = index + 1
        this.mElemList[name + "_name"].text = config[3]
        this.mElemList[name + "_force"].text = MakeLongNumberShort(config[1])

        let gConfig = GameConfig.CopyTempleConfig[config[0]]
        if (gConfig) {
            this.mElemList[name + "_star"].text = String.format(Localize_cns("COPY_TXT17"), gConfig.order)
        } else {
            this.mElemList[name + "_star"].text = config[0]
        }

        
        if (config[2] == GetHeroProperty("id")) {
            this.myRank = index + 1
            this.myConfig = config
        }
	}

    genConfigList() {
        return this.rankList
    }

    refresh(info){
		this.rankList = info.ranklist
		super.refreshFrame()
	}

    refreshHeroRank() {
        if (!this.myRank) {
            this.mElemList["my_rank1"].text = ""
            this.mElemList["my_rank2"].text = ""
            this.mElemList["my_rank0"].text = String.format(Localize_cns("OPENSERVER_TXT10"), Localize_cns("OPENSERVER_TXT11"))

            return
        }
        this.mElemList["my_rank1"].text = Localize_cns("COPY_TXT27")
        
        let gConfig = GameConfig.CopyTempleConfig[this.myConfig[0]]
        if (gConfig) {
            this.mElemList["my_rank2"].text = String.format(Localize_cns("COPY_TXT17"), gConfig.order)
        }

        this.mElemList["my_rank0"].text = String.format(Localize_cns("OPENSERVER_TXT10"), this.myRank)
        return
    }

    //发送协议获取排行数据
	sendRankRequire() {
        RpcProxy.call("C2G_RoleRank", configRankType.RANK_SMALL_THUNDER,1)
		// let message = GetMessage(opCodes.C2G_ROLE_RANK)
		// message.rankType = configRankType.RANK_SMALL_THUNDER
		// message.index = 1
		// SendGameMessage(message)
	}
     //////////////////////////////////////////
     
}