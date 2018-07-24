class DailySanBaiWindow extends BaseCtrlWnd {
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

        for (let k = 1; k <= 3; k++) {
            this.mElemList["group_" + k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPrizeClick, this)
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mElemList["group_xiangYao"].visible = true;
        this.mElemList["title"].text = Localize_cns("DAILY_TXT3")

        this.onRefresh()
    }

    public onHide(): void {
        this.mElemList["group_xiangYao"].visible = false;
    }


    updateWnd() {
        this.onRefresh()
    }

    onRefresh() {

        let actInfo = GetActivity(ActivityDefine.Boss).getSanBaiInfo()
        //  this.mElemList["group_xiangYao"].visible = true;
        if (size_t(actInfo) == 0) {
            return
        }

        let index = this.mParentWnd.tabWndList.getTabIndex()

        let image = "rc_ztBg03"
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
        let had = actInfo.curhuan
        let twiceStr = String.format(Localize_cns("DAILY_TXT8"), had)
        AddRdContent(this.mElemList["rd_1_twice"], twiceStr, "ht_20_cc")

        let maxvalue = dailyOptions.sanbaiMaxCount
        had = MathUtil.clamp(had, 0, maxvalue)
        UiUtil.updateProgress(this.mElemList["progress"], had, maxvalue)
        let proStr = String.format(Localize_cns("ESCORT_TXT5"), had, maxvalue)
        this.mElemList["label_pro"].text = proStr

        let state = actInfo.state
        for (let k = 1; k <= 3; k++) {
            this.mElemList["image_select_" + k].visible = false
            this.mElemList["sanbai_prize_get_" + k].visible = false
        }
        //领取
        if (state != 0) {
            this.mElemList["sanbai_prize_get_" + state].visible = true
        }
        //选中
        if (state != 3) {
            this.mElemList["image_select_" + (state + 1)].visible = true
        }

        let canOneKey = (had == dailyOptions.sanbaiMaxCount) ? true : false
        let state1 = true
        let state2 = false
        let name1 = Localize_cns("DAILY_TXT9") //"一键完成"
        let name2 = Localize_cns("DAILY_TXT13") //"领取"

        if (had >= dailyOptions.sanbaiFirstCount && had < dailyOptions.sanbaiSecondCount && state < 1) {
            state2 = true
        } else if (had >= dailyOptions.sanbaiSecondCount && had < dailyOptions.sanbaiMaxCount && state < 2) {
            state2 = true
        } else if (had >= dailyOptions.sanbaiMaxCount && state < 3) {
            state2 = true
        }

        if (canOneKey) {
            state1 = false
        }

        for (let k = 1; k <= state; k++) {
            this.mElemList["sanbai_prize_get_" + k].visible = true
        }

        if (actInfo.isVip == 1) {
            if (state != 3) {
                state2 = true
            } else {
                state2 = false
            }
            state1 = false
        }

        if (state == 3) {
            name2 = Localize_cns("DAILY_TXT11")
        }
        this.mElemList["btn_oneKey"].text = name1
        this.mElemList["btn_kill"].text = name2

        this.mElemList["btn_oneKey"].enabled = state1
        this.mElemList["btn_kill"].enabled = state2

        //双倍奖励
        /*if(actInfo.prizeRatio == 2){
            this.mElemList["double_prize"].visible = true
        }else{
            this.mElemList["double_prize"].visible = false
        }*/

    }

    /////btn响应事件
    onKillClick(args) {
        let index = this.mParentWnd.tabWndList.getTabIndex()
        if (index != 2) return
        RpcProxy.call("C2G_MEIRISANBAI_Get")
    }


    onOneKeyClick(args) {
        let index = this.mParentWnd.tabWndList.getTabIndex()
        if (index != 2) return
        let actInfo = GetActivity(ActivityDefine.Boss).getSanBaiInfo()
        let tempConfig = GetActivity(ActivityDefine.Boss).getDataConfigByLevel(GetHeroProperty("level"), GameConfig.EveryDaySanBaiConfig)
        if (tempConfig == null) {
            return
        }
        let config = tempConfig[actInfo.state + 1]
        let VIP_level = GetHeroProperty("VIP_level")
        if (VIP_level < config.needVip) {
            MsgSystem.addTagTips(String.format(Localize_cns("DAILY_TXT14"), config.needVip))
            return
        }
        let ratio = config.needNum / dailyOptions.sanbaiMaxCount
        let costMoneey = Math.ceil ((dailyOptions.sanbaiMaxCount - actInfo.curhuan) * ratio)
        let showTips = String.format(Localize_cns("DAILY_ONEKEY_VIP"), costMoneey)
        let t: IDialogCallback = {
            onDialogCallback(result: boolean, userdata): void {
                if (result == true) {
                    if (GetHeroMoney(config.unity) < costMoneey) {
                        let formatStr = Localize_cns(ItemUnitName[config.unity])
                        MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
                        return
                    }
                    RpcProxy.call("C2G_MEIRISANBAI_YIJIAN")
                    RpcProxy.call("C2G_MEIRISANBAI_MonsterNum")
                }
            }
        }
        MsgSystem.confirmDialog(showTips, t, null)
    }

    onPrizeClick(args) {
        let name = args.target.name
        let index = name.replace(/[^0-9]/ig, "");

        let wnd: DailyPrizeTipsFrame = WngMrg.getInstance().getWindow("DailyPrizeTipsFrame")

        wnd.onShowWnd(tonumber(index))
    }
} // TypeScript file