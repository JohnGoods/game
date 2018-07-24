class DailyGhostFrame extends BaseWnd {
    npcId
    actor: UIActorView

    static FULL_STAR = 7
    static UPSTAR_NEED_COUNT = 50

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/DailyGhostLayout.exml"]

    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        // this.mLayoutNode.setLayer(gui.GuiLayer.Top)
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_challenge", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onChallengeClick },
            { ["name"]: "btn_upstar", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUpStar },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["rd_2"].setAlignFlag(gui.Flag.RIGHT_CENTER)

        this.actor = UIActorView.newObj(this.mLayoutNode, "actor_view", 0, 0, this.mElemList["actor"])

    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.BOSSACTIVITY_INFO, this.onRefresh, this)
        this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true)
        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.BOSSACTIVITY_INFO, this.onRefresh, this)
        this.mLayoutNode.visible = false;
        //this.mLayoutNode.setDoModal(false)
        this.actor.clearView()
        this.npcId = null
    }

    onRefresh(args?) {
        // if(!this.npcId || !this.star){
        //     return
        // }

        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.ZhongKuiDemon)


        if (size_t(actInfo) == 0) return

        //let activeList = {}
        if(this.npcId == null){
            let npcList = actInfo.npcList
            for (let k in npcList) {
                let v = npcList[k]
                let osTime = GetServerTime()
                if ((v <= osTime)) {
                // activeList[k] = v
                    this.npcId = tonumber(k)
                    break
                }
            }
        }   
        if(this.npcId == null)
            return;
        

        //rd_1
        let guankaId = CampaignSystem.getInstance().getCurOpenCampaign()
        let guankaName = CampaignSystem.getInstance().getCampaignName(guankaId)

        let str1 = String.format(Localize_cns("DAILY_BOSS_TXT1"), this.npcId, guankaName)
        AddRdContent(this.mElemList["rd_1"], str1, "ht_20_cc", "ublack")

        let str2 = String.format(Localize_cns("DAILY_BOSS_TXT3"))
        AddRdContent(this.mElemList["rd_2"], str2, "ht_20_cc", "ublack")

        let config = GameConfig.ZhongKuiDemonConfig[this.npcId]
        let desStr = ""
        let desRight = ""
        let star = actInfo.star
        let starRatio = config.star
        for (let k in starRatio) {

            if (tonumber(k) % 2 != 0) {
                desStr += String.format(Localize_cns("DAILY_BOSS_TXT2"), k, FormatNumberInt(starRatio[k] * 100) + "%") + "#br"
            } else {
                desRight += String.format(Localize_cns("DAILY_BOSS_TXT2"), k, FormatNumberInt(starRatio[k] * 100) + "%") + "#br"
            }
        }
        // let str2 = Localize_cns("DAILY_BOSS_TXT2")
        AddRdContent(this.mElemList["rd_des"], desStr, "ht_20_cc", "ublack")
        AddRdContent(this.mElemList["rd_right"], desRight, "ht_20_cc", "ublack")

        let prizeConfig = GameConfig.ZhongKuiMonsterConfig[config.index]
        let level = GetHeroProperty("level")
        let list = GetActivity(ActivityDefine.Boss).getZhongKuiMonsterList(level, prizeConfig)
        let tempPrizeList = AnalyPrizeFormat(list.prize)
        let prizeList: any = {}
        for (let k in tempPrizeList) {
            let prize = tempPrizeList[k]
            prizeList[k] = [prize[0], prize[1] * starRatio[star]]
        }
        this.onRefreshPrize(prizeList)

        let monsterId = GetMonsterModel(config.entryId)

        this.actor.updateByPlayer(monsterId)
        this.onRefreshStar(star)

    }

    onRefreshPrize(list) {
        for (let i = 0; i < size_t(list); i++) {
            let config = list[i]
            if (!this.mElemList["prizeBox" + i]) {
                this.mElemList["prizeBox" + i] = UIItemBox.newObj(this.mLayoutNode, "prizeBox" + i, 0, 0, this.mElemList["group_prize"])
            }
            this.mElemList["prizeBox" + i].updateByEntry(config[0], config[1])
        }
    }

    ///刷新
    onRefreshStar(num) {
        for (let i = 1; i <= num; i++) {
            this.mElemList["image_" + i].source = "ty_star01"
        }
        if (num < DailyGhostFrame.FULL_STAR) {
            for (let i = num + 1; i <= 7; i++) {
                this.mElemList["image_" + i].source = "ty_starDi01"
            }
        }
    }


    //--------------响应事件
    onChallengeClick() {
        if (this.npcId == null) return
        RpcProxy.call("C2G_CreateBossFight", OrdinaryActivityIndex.ZhongKuiDemon, this.npcId) //"C2G_CreateBossFight":"uint16;uint16",  --创建战斗 activityIndex,npcIndex
        this.hideWnd()
        // let wnd : DailyFrame = WngMrg.getInstance().getWindow("DailyFrame")
        // if(wnd.isVisible() == true){
        //     wnd.hideWnd()
        // }
    }

    onUpStar() {
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.ZhongKuiDemon)
        if (actInfo.star >= DailyGhostFrame.FULL_STAR) {
            MsgSystem.addTagTips(Localize_cns("DAILY_UPSTAR"))
            return
        }
        let needUnit = opItemUnit.BIND_CURRENCY
        let needCount = DailyGhostFrame.UPSTAR_NEED_COUNT
        let had = GetHeroMoney(needUnit)
        let t: IDialogCallback = {
            onDialogCallback(result: boolean, userdata): void {
                if (result == true) {
                    if (had < needCount) {
                        let formatStr = Localize_cns(ItemUnitName[needUnit])
                        MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
                        return
                    }
                    RpcProxy.call("C2G_AddZhongKuiStar")
                }
            }
        }
        MsgSystem.confirmDialog(Localize_cns("DAILY_UPSTAR_TIPS"), t, null)

    }

    ///---------接口
    onShowWnd(npcId) {
        this.npcId = npcId
        // this.star = star
        this.showWnd()
    }
}// TypeScript file