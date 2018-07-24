class DailyXiangYaoWindow extends BaseCtrlWnd {
    mElemList
    timer;
    refreshTime
    npcIndex
    
    activeList

    public initObj(...params: any[]) {
        this.activeList = []
    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        this.timer = null

        var elemInfo = [
            { ["name"]: "btn_oneKey", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onOneKeyClick },

            { ["name"]: "btn_kill", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onKillClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)


        this.mElemList["rd_1_twice"].setAlignFlag(gui.Flag.LEFT_CENTER)
        this.mElemList["rd_1_time"].setAlignFlag(gui.Flag.RIGHT_CENTER)


    }

    public onUnLoad(): void {

    }

    public onShow(): void {

        this.mElemList["group_xiangYao"].visible = true;
        this.mElemList["title"].text = Localize_cns("DAILY_TXT1")
        this.onRefresh()

    }

    public onHide(): void {
        this.mElemList["group_xiangYao"].visible = false;

        if (this.timer != null) {
            KillTimer(this.timer)
            this.timer = null
        }
    }

    updateWnd() {
        this.onRefresh()
    }

    onRefresh() {

        let index = this.mParentWnd.tabWndList.getTabIndex()

        let image = "rc_ztBg01"
        this.mElemList["image_bg"].source = image

        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.ZhongKuiDemon)
        //  this.mElemList["group_xiangYao"].visible = true;
        if (size_t(actInfo) == 0) {
            return
        }


        for (let i = 1; i <= 3; i++) {
            if (i != (index + 1)) {
                this.mElemList["group_" + i + "_prize"].visible = false
                this.mElemList["group_rd_" + i].visible = false
            } else {
                this.mElemList["group_" + i + "_prize"].visible = true
                this.mElemList["group_rd_" + i].visible = true
            }

        }

        let activeList = {}
        let unActiveList = {}
        let npcList = actInfo.npcList
        for (let k in npcList) {
            let v = npcList[k]
            let osTime = GetServerTime()
            if ((v <= osTime)) {
                activeList[k] = v
            } else {
                unActiveList[k] = v
            }
        }

        this.activeList = activeList
        for (let k in unActiveList) {
            let tempTime = unActiveList[k]
            if (this.refreshTime == null) {
                this.refreshTime = tempTime
                this.npcIndex = tonumber(k)
            }
            if (this.refreshTime > tempTime) {
                this.refreshTime = tempTime
                this.npcIndex = tonumber(k)
            }
        }
        this.mParentWnd.npcIndx = this.npcIndex

        if (this.refreshTime == null || this.refreshTime - GetServerTime() <= 0) {
            let nowTime = GetServerTime()
            let time_t = GetServerDate(nowTime)
            let min = time_t.min
            if (min < 30) {
                min = 30
            } else {
                min = 0
                time_t.hour += 1
            }
            this.refreshTime = GetTodayTime(nowTime, time_t.hour, min, 0)
        }
        //
        let had = size_t(activeList)
        let twiceStr = String.format(Localize_cns("DAILY_TXT8"), had)
        AddRdContent(this.mElemList["rd_1_twice"], twiceStr, "ht_24_cc_stroke")


        //奖励
        let config = GetActivity(ActivityDefine.Boss).getDataConfigByLevel(GetHeroProperty("level"), GameConfig.ZhongKuiGetItemConfig)
        let list = AnalyPrizeFormat(config.prize)
        let prizeName = "xiangYao"

        for (let i = 1; i <= size_t(list); i++) {
            let v = list[i - 1]
            if (!this.mElemList[prizeName + "prizeBox" + i]) {
                this.mElemList[prizeName + "prizeBox" + i] = UIItemBox.newObj(this.mLayoutNode, prizeName + "prizeBox" + i, 0, 0, this.mElemList["group_1_prize"])
            }
            this.mElemList[prizeName + "prizeBox" + i].updateByEntry(v[0], v[1])
        }


        let value = actInfo.killCount
        let maxvalue = dailyOptions.xiangyaoMaxCount
        if (value >= dailyOptions.xiangyaoMaxCount) {
            value = dailyOptions.xiangyaoMaxCount
        }

        UiUtil.updateProgress(this.mElemList["progress"], value, maxvalue)
        let proStr = String.format(Localize_cns("ESCORT_TXT5"), value, maxvalue)
        this.mElemList["label_pro"].text = proStr

        let isget = actInfo.prizeFlag == 1 ? true : false
        let state1 = true
        let state2 = true
        let name1 = Localize_cns("DAILY_TXT9") //"一键完成"
        let name2 = Localize_cns("DAILY_TXT10") //"前往击杀"

        if (had == 0) {
            state2 = false
        }

        if (isget) {
            name1 = Localize_cns("DAILY_TXT11") //"已领取"
            state1 = false
        } else if (value >= dailyOptions.xiangyaoMaxCount) {
            name1 = Localize_cns("DAILY_TXT13")
        }


        this.mElemList["btn_oneKey"].text = name1
        this.mElemList["btn_kill"].text = name2

        this.mElemList["btn_oneKey"].enabled = state1
        this.mElemList["btn_kill"].enabled = state2


        if (this.timer == null && this.onRefreshTime != null) {
            this.timer = SetTimer(this.onRefreshTime, this, 1000, true)
        }
    }
    onRefreshTime() {
        //
        let time = this.refreshTime
        if (time == null) {
            return
        }
        let refreshTime = time - GetServerTime()
        if (refreshTime <= 0) {
            if (this.timer != null) {
                KillTimer(this.timer)
                this.timer = null
                this.refreshTime = null
                RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.ZhongKuiDemon)
                return
            }
        }
        let str = getFormatDiffTime(refreshTime)
        let timeStr = String.format(Localize_cns("DAILY_TXT12"), str)
        AddRdContent(this.mElemList["rd_1_time"], timeStr, "ht_24_cc_stroke")
    }

    /////btn响应事件

    onKillClick(args) {
        let index = this.mParentWnd.tabWndList.getTabIndex()
        if (index != 0) return
        let wnd = WngMrg.getInstance().getWindow("DailyGhostFrame")
        wnd.showWnd()
    }


    onOneKeyClick(args) {
        let index = this.mParentWnd.tabWndList.getTabIndex()
        if (index != 0) return
        
        if (CheckFightState() == true) {
            return
        }
        
        if (CheckBeiBaoEquipWillFull()) {
            return
        }
        
        if (CheckActivityState() == false) {
            return
        }

        let name = args.target.name
        let btnName = this.mElemList[name].text
        if (btnName == Localize_cns("DAILY_TXT9")) {
            let vip = GetHeroProperty("VIP_level")
            let config = GetActivity(ActivityDefine.Boss).getDataConfigByLevel(GetHeroProperty("level"), GameConfig.ZhongKuiGetItemConfig)
            if (vip < config.needVip) {
                MsgSystem.addTagTips(String.format(Localize_cns("DAILY_TXT14"), config.needVip))
                return
            }

            let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.ZhongKuiDemon)
            if(!actInfo || !this.activeList ) return 
            let rest = dailyOptions.xiangyaoMaxCount - actInfo.killCount
            let costMoneey = rest * config.needNum /dailyOptions.xiangyaoMaxCount
            let showTips = String.format(Localize_cns("DAILY_ONEKEY_VIP"), costMoneey)
            let t: IDialogCallback = {
                onDialogCallback(result: boolean, userdata): void {
                    if (result == true) {
                        if (GetHeroMoney(config.unity) < costMoneey) {
                            let formatStr = Localize_cns(ItemUnitName[config.unity])
                            MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
                            return
                        }
                        RpcProxy.call("C2G_SweepBossActivity", OrdinaryActivityIndex.ZhongKuiDemon, 1)
                    }
                }
            }
            
            MsgSystem.confirmDialog(showTips, t, null)

        } else if (btnName == Localize_cns("DAILY_TXT13")) {
            RpcProxy.call("C2G_GetActivityStagePrize", OrdinaryActivityIndex.ZhongKuiDemon, 1)
        }

    }

} // TypeScript file