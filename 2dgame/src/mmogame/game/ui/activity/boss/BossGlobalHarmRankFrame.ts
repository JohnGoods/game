// TypeScript file
class BossGlobalHarmRankFrame extends ActivityRankBaseFrame {
    bossIndex: number;
    static BOSS_HARM_RANK_TYPE: number = 2

    public initObj(...params: any[]) {
        
    }

    public onLoad(): void {
        super.onLoad()

        this.mElemList["my_rank1"].visible = false
        this.mElemList["my_rank2"].visible = false
        this.mElemList["tl3"].visible = false

        this.mElemList["tl2"].x = this.mElemList["tl2"].x + 30
        this.mElemList["tl4"].x = this.mElemList["tl4"].x - 40

        this.mElemList["tl4"].text = Localize_cns("BOSS_TXT54")

    }

    public onUnLoad(): void {
        super.onUnLoad()
    }

    public onShow(): void {
        super.onShow()
        this.refreshFrame()
        //RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)

        this.mElemList["label_wndName"].text = Localize_cns("BOSS_TXT53")
        RpcProxy.call("C2G_GetActivityRank", OrdinaryActivityIndex.WorldPlayerBoss, [this.bossIndex, BossGlobalHarmRankFrame.BOSS_HARM_RANK_TYPE])     
    }

    public onHide(): void {
        super.onHide()
        //UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
        this.mLayoutNode.visible = (false)
    }

    initItemWindow(window) {
		let name = window.name
        super.initItemWindow(window)

        this.mElemList[name + "reward_rd"].visible = false      //战力位隐藏
        this.mElemList[name + "_force"].visible = false      //战力位隐藏
        this.mElemList[name + "_name"].x = this.mElemList[name + "_name"].x + 30
        this.mElemList[name + "_star"].x = this.mElemList[name + "_star"].x - 40
	}

	refreshItemWindow(window, config, index) {
		let name = window.name

        //[plrId, plrName, damage]
        this.mElemList[name + "_rank"].text = index + 1
        this.mElemList[name + "_name"].text = config[1]
        this.mElemList[name + "_star"].text = MakeLongNumberShort(config[2])

        if (config[0] == GetHeroProperty("id")) {
            this.myRank = index + 1
            this.myConfig = config
        }
	}

    genConfigList() {
        let list = []
        let l = GetActivity(ActivityDefine.Boss).getActBossRankInfo(OrdinaryActivityIndex.WorldPlayerBoss) || []
        for (let i = 0; i < l.length; i++) {
            let v = l[i]
            let [bossIndex, tType] = v.appendix
            if (tType == BossGlobalHarmRankFrame.BOSS_HARM_RANK_TYPE) {
                if (this.bossIndex == bossIndex) {
                    list = v.data
                }
            }
        }
        return list
    }

    refreshHeroRank() {
        if (!this.myRank) {
            return this.mElemList["my_rank0"].text = String.format(Localize_cns("OPENSERVER_TXT10"), Localize_cns("OPENSERVER_TXT11"))
        }

        return this.mElemList["my_rank0"].text = String.format(Localize_cns("OPENSERVER_TXT10"), this.myRank)
    }

    updateWnd() {
        this.refreshFrame()
    }
     //////////////////////////////////////////
     showKillRankFrame(bossIndex) {
         this.bossIndex = bossIndex
         this.showWnd()
     }
}