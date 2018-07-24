// TypeScript file
class BossGlobalKillRankFrame extends ActivityRankBaseFrame {
    bossIndex: number;
    static BOSS_RANK_TYPE: number = 1

    public initObj(...params: any[]) {
        this.bossIndex = 0
    }

    public onLoad(): void {
        super.onLoad()

        this.mElemList["my_rank0"].visible = false
        this.mElemList["my_rank1"].visible = false
        this.mElemList["my_rank2"].visible = false

        this.mElemList["tl1"].text = Localize_cns("BOSS_TXT56")
        this.mElemList["tl2"].text = Localize_cns("BOSS_TXT57")
        this.mElemList["tl4"].text = Localize_cns("BOSS_TXT58")

    }

    public onUnLoad(): void {
        super.onUnLoad()
    }

    public onShow(): void {
        super.onShow()
        this.refreshFrame()
        //RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)

        this.mElemList["label_wndName"].text = Localize_cns("BOSS_TXT55")
        RpcProxy.call("C2G_GetActivityRank", OrdinaryActivityIndex.WorldPlayerBoss, [this.bossIndex, BossGlobalKillRankFrame.BOSS_RANK_TYPE])                 //参数1为击杀记录
    }

    public onHide(): void {
        super.onHide()
        //UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
        this.mLayoutNode.visible = (false)
    }

    // initItemWindow(window) {
	// 	let name = window.name
    //     super.initItemWindow(window)

    //     this.mElemList[name + "reward_rd"].visible = false      //战力位隐藏
    //     this.mElemList[name + "_name"].x = this.mElemList[name + "_name"].x + 30
    //     this.mElemList[name + "_star"].x = this.mElemList[name + "_star"].x - 40
	// }

	refreshItemWindow(window, config, index) {
		let name = window.name

        //[os.time(), plr:getName(), plr:getForce()]
        this.mElemList[name + "_rank"].text = index + 1
        this.mElemList[name + "_name"].text = config[1]
        this.mElemList[name + "_force"].text = MakeLongNumberShort(config[2])
        this.mElemList[name + "_star"].text = getFormatTimeSec(config[0])
	}

    genConfigList() {
        let list = []
        let l = GetActivity(ActivityDefine.Boss).getActBossRankInfo(OrdinaryActivityIndex.WorldPlayerBoss) || []
        for (let i = 0; i < l.length; i++) {
            let v = l[i]
            let [bossIndex, tType] = v.appendix
            if (tType == BossGlobalKillRankFrame.BOSS_RANK_TYPE) {
                if (this.bossIndex == bossIndex) {
                    list = v.data
                }
            }
        }
        return list
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