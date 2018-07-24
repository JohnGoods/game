class DailyZuDuiWindow extends BaseCtrlWnd {
    mElemList


    public initObj(...params: any[]) {

    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        var elemInfo = [
            { ["name"]: "btn_oneKey", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onOneKeyClick },

            { ["name"]: "btn_kill", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onKillClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["rd_2_twice"].setAlignFlag(gui.Flag.LEFT_CENTER)
        this.mElemList["rd_2_des"].setAlignFlag(gui.Flag.CENTER_CENTER)


    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mElemList["group_xiangYao"].visible = true;
        this.mElemList["title"].text = Localize_cns("DAILY_TXT2")

        this.onRefresh()

    }

    public onHide(): void {
        this.mElemList["group_xiangYao"].visible = false;

        this.mElemList["image_double_btn"].visible = false
        this.mElemList["image_double_radio"].visible = false
    }

    updateWnd() {
        this.onRefresh()
    }

    onRefresh() {

        let actInfo = GetActivity(ActivityDefine.Boss).getLiLianInfo()
        //  this.mElemList["group_xiangYao"].visible = true;
        if (size_t(actInfo) == 0) {
            return
        }

        /*if(actInfo.isDouble == 0){
            this.mElemList["image_double_btn"].visible = false
            this.mElemList["image_double_radio"].visible = false
        }else{
            this.mElemList["image_double_btn"].visible = true
            this.mElemList["image_double_radio"].visible = true
        }*/

        let index = this.mParentWnd.tabWndList.getTabIndex()

        let image = "rc_ztBg02"
        this.mElemList["image_bg"].source = image

        for (let i = 1; i <= 3; i++) {
            if (i != (index + 1)) {
                this.mElemList["group_" + i + "_prize"].visible = false
                this.mElemList["group_rd_" + i].visible = false
            } else {
                this.mElemList["group_" + i + "_prize"].visible = true
                this.mElemList["group_rd_" + i].visible = true
            }

        }

        //
        let had = actInfo.twice
        let maxvalue = dailyOptions.zuduiMaxNum
        let realTwice = actInfo.realTwice || 0
        let twiceStr = Localize_cns("DAILY_TXT15") + "#lime" + realTwice + "/" + maxvalue
        AddRdContent(this.mElemList["rd_2_twice"], twiceStr, "ht_24_cc_stroke")

        let desStr = Localize_cns("DAILY_TXT16")
        AddRdContent(this.mElemList["rd_2_des"], desStr, "ht_20_cc")

        let value = 0
        let maxProValue = dailyOptions.zuduiMaxCount
        if (had >= maxProValue) {
            value = maxProValue
        } else {
            value = had
        }

        UiUtil.updateProgress(this.mElemList["progress"], value, maxProValue)
        let proStr = String.format(Localize_cns("ESCORT_TXT5"), value, maxProValue)
        this.mElemList["label_pro"].text = proStr

        let isget = actInfo.state == 1 ? true : false
        let state1 = true
        let state2 = true
        let name1 = Localize_cns("DAILY_TXT9") //"一键完成"
        let name2 = Localize_cns("DAILY_TXT10") //"前往击杀"

        if (had >= 30) {
            state2 = false
        }

        if (isget) {
            name1 = Localize_cns("DAILY_TXT11") //"已领取"
            state1 = false
        } else {
            if (actInfo.isVip == 1 || had >= 10) {
                name1 = Localize_cns("FIGHT_TXT9")
            }
        }


        this.mElemList["btn_oneKey"].text = name1
        this.mElemList["btn_kill"].text = name2

        this.mElemList["btn_oneKey"].enabled = state1
        this.mElemList["btn_kill"].enabled = state2

        //双倍奖励
        /*if(actInfo.isDouble == 1){
            this.mElemList["double_prize"].visible = true
        }else{
            this.mElemList["double_prize"].visible = false
        }
        */

        //奖励
        let tempConfig = GetActivity(ActivityDefine.Boss).getDataConfigByLevel(GetHeroProperty("level"), GameConfig.TeamaDventureConfig)
        if (tempConfig == null) return
        let list = AnalyPrizeFormat(tempConfig.prize)
        let prizeName = "zudui"

        for (let i = 1; i <= size_t(list); i++) {
            let prizeItem = list[i - 1]
            if (!this.mElemList[prizeName + "prizeBox" + i]) {
                this.mElemList[prizeName + "prizeBox" + i] = UIItemBox.newObj(this.mLayoutNode, prizeName + "prizeBox" + i, 0, 0, this.mElemList["group_2_prize"])
            }
            this.mElemList[prizeName + "prizeBox" + i].updateByEntry(prizeItem[0], prizeItem[1])
        }

    }

    onKillClick(args: egret.TouchEvent) {
        let name = args.target.name
        let index = this.mParentWnd.tabWndList.getTabIndex()
        if (index != 1) return
        let wnd: GlobalMainFrame = WngMrg.getInstance().getWindow("GlobalMainFrame")
        wnd.showGlobalFrame(0)
        this.mParentWnd.hideWnd()
        return
    }


    onOneKeyClick(args) {
        let index = this.mParentWnd.tabWndList.getTabIndex()
        if (index != 1) return
        let name = args.target.name

        if (this.mElemList[name].text == Localize_cns("FIGHT_TXT9")) {
            RpcProxy.call("C2G_ZUDUILILIANW_GetPrize")
            RpcProxy.call("C2G_ZUDUILILIAN_GOCOMBAT")
            return
        }
        let actInfo = GetActivity(ActivityDefine.Boss).getLiLianInfo()
        let tempConfig = GetActivity(ActivityDefine.Boss).getDataConfigByLevel(GetHeroProperty("level"), GameConfig.TeamaDventureConfig)
        if (tempConfig == null) {
            return
        }
        let VIP_level = GetHeroProperty("VIP_level")
        if (VIP_level < tempConfig.needVip) {
            MsgSystem.addTagTips(String.format(Localize_cns("DAILY_TXT14"), tempConfig.needVip))
            return
        }
        let costMoneey = (dailyOptions.zuduiMaxCount - actInfo.twice) * (tempConfig.needNum / dailyOptions.zuduiMaxCount)
        let showTips = String.format(Localize_cns("DAILY_ONEKEY_VIP"), costMoneey)
        let t: IDialogCallback = {
            onDialogCallback(result: boolean, userdata): void {
                if (result == true) {
                    if (GetHeroMoney(tempConfig.unity) < costMoneey) {
                        let formatStr = Localize_cns(ItemUnitName[tempConfig.unity])
                        MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
                        return
                    }
                    RpcProxy.call("C2G_ZUDUILILIANW_YIJIAN")
                    RpcProxy.call("C2G_ZUDUILILIAN_GOCOMBAT")
                }
            }
        }
        
        MsgSystem.confirmDialog(showTips, t, null)
    }
} // TypeScript file