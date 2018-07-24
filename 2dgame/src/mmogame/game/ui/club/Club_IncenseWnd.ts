// TypeScript file
class Club_IncenseWnd extends BaseCtrlWnd {
    mElemList;
    scroll: UIScrollList;

    public initObj(...params: any[]) {

    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList

        var elemInfo = [
            { ["name"]: "worship_btn0", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.worshipClicked },
            { ["name"]: "worship_btn1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.worshipClicked },
            { ["name"]: "worship_btn2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.worshipClicked },

            { ["name"]: "reward_btn0", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.rewardClicked },
            { ["name"]: "reward_btn1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.rewardClicked },
            { ["name"]: "reward_btn2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.rewardClicked },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let group = <eui.Group>this.mElemList["record_wnd"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 10, 40, group.width - 20, group.height - 40, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.GET_CLUB_INFO, this.refreshFrame, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        RegisterEvent(EventDefine.CLUB_RENQI_INFO, this.refreshFrame, this)
        this.mElemList["group2"].visible = true
        this.mElemList["title"].text = Localize_cns("CLUB_TXT5")
        this.mElemList["btn_tips"].visible = false
        RpcProxy.call("C2G_FactionRenqiInfo")
        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.GET_CLUB_INFO, this.refreshFrame, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        UnRegisterEvent(EventDefine.CLUB_RENQI_INFO, this.refreshFrame, this)
        this.mElemList["group2"].visible = false
    }

    refreshFrame() {
        let clubInfo = ClubSystem.getInstance().getCurClubInfo()
        if (clubInfo == null) {
            return
        }

        let level = clubInfo.level

        let renqiData = ClubSystem.getInstance().getClubRenqiInfo()

        if (renqiData == null)
            return;

        let todayRenqiExp = renqiData.renqiExp //香火值
        let todayRenqiCount = renqiData.renqiCount //上香次数
        let renqiRecordList:any[] = renqiData.renqiRecord//上香记录

        let expConfig = GameConfig.FactionExpConfig[level] //经验上限

        let incList: any[] = []
        JsUtil.arrayInstert(incList, GameConfig.FactionRenqiCondConfig[opFactionConfig.RenqiFunds]) //现银上香
        JsUtil.arrayInstert(incList, GameConfig.FactionRenqiCondConfig[opFactionConfig.RenqiGold])//元宝上香
        JsUtil.arrayInstert(incList, GameConfig.FactionRenqiCondConfig[opFactionConfig.RenqiBindGold]) //绑元上香

        let colorList = [gui.Color.royalblue, gui.Color.darkgoldenrod, gui.Color.darkviolet]
        for (let i = 0; i < 3; i++) {
            let config = incList[i]

            this.mElemList["inc_txt" + i].text = config.name
            this.mElemList["inc_txt" + i].textColor = colorList[i]

            let str = String.format(Localize_cns("CLUB_TXT82"), config.facExp, config.facContribute, config.facRenqi)
            let color =
                AddRdContent(this.mElemList["inc_rd" + i], str, "ht_18_cc", "ublack", 3)

            this.mElemList["worship_rd" + i].setAlignFlag(gui.Flag.H_CENTER)
            AddRdContent(this.mElemList["worship_rd" + i], String.format(Localize_cns("CLUB_TXT34"), config.needMoney) + GetMoneyIcon(config.moneyUnit), "ht_18_cc", "gray")
        }

        let todataWorShipText = todayRenqiExp + "/" + expConfig.renqi
        let todataWorShipCountText = todayRenqiCount + "/" + expConfig.renqiTimes
        AddRdContent(this.mElemList["today_worship_rd"], String.format(Localize_cns("CLUB_TXT37"), todataWorShipText), "ht_20_cc", "ublack")
        AddRdContent(this.mElemList["today_worship_count_rd"], String.format(Localize_cns("CLUB_TXT38"), todataWorShipCountText), "ht_20_cc", "ublack")

        //更新进度条
        UiUtil.updateProgress(this.mElemList["exp_progress"], todayRenqiExp, expConfig.renqi)

        let isShangXiang = getSaveRecord(opSaveRecordKey.facRenqiSet) || 0
        this.mElemList["worship_btn0"].enabled = isShangXiang == 0
        this.mElemList["worship_btn1"].enabled = isShangXiang == 0
        this.mElemList["worship_btn2"].enabled = isShangXiang == 0

        let dailyRecord = getSaveRecord(opSaveRecordKey.facDailyRenqiPrize) || []
        for (let i in GameConfig.FactionRenqiPrizeConfig) {
            let config = GameConfig.FactionRenqiPrizeConfig[i]
            let hadGet = dailyRecord[i] == 1

            this.mElemList["reward_btn" + (tonumber(i) - 100)].enabled = !hadGet
        }

        this.scroll.clearItemList()

        //最后上香的，在前面
        let recordList = renqiRecordList.reverse()
        let group = <eui.Group>this.mElemList["record_wnd"]
        for (let i = 0; i < recordList.length; i++) {
            let v = recordList[i]
            let [window, flag] = this.scroll.getItemWindow(i, group.width - 20, 20, 0, 0, 0)
            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v)
        }
        this.scroll.refreshScroll()
    }

    initItemWindow(window) {
        let name = window.name
        let w = window.width
        let h = window.height

        var Info = [
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_record", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h },
        ]
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
    }

    refreshItemWindow(window, data) {
        let name = window.name

        let [time, plrid, pname, type] = data

        let timeStr = getFormatTimeEx(time)
        let typeName = ""
        let colorList = ["#royalblue", "#darkgoldenrod", "#darkviolet"]
        let color = "#orange"
        if (type == opFactionConfig.RenqiFunds) {
            typeName = Localize_cns("CLUB_TXT71")
            color = colorList[0]
        } else if (type == opFactionConfig.RenqiBindGold) {
            typeName = Localize_cns("CLUB_TXT72")
            color = colorList[2]
        } else if (type == opFactionConfig.RenqiGold) {
            typeName = Localize_cns("CLUB_TXT73")
            color = colorList[1]
        }

        AddRdContent(this.mElemList[name + "_record"], String.format(Localize_cns("CLUB_TXT39"), timeStr, pname, color, typeName), "ht_20_cc", "ublack")
    }

    worshipClicked(args) {
        let name = args.target.name
        let index = name.replace(/[^0-9]/ig, "")
        let type = tonumber(opFactionConfig.RenqiFunds) + tonumber(index)

        let config = GameConfig.FactionRenqiCondConfig[type]
        let moneyUnit = config.moneyUnit
        let needMoney = config.needMoney
        let ownMoney = GetHeroMoney(moneyUnit)

        if (ownMoney < needMoney) {
            MsgSystem.addTagTips(GetHeroMoneyStr(moneyUnit) + Localize_cns("NO_MONEY"))
            return
        }

        RpcProxy.call("C2G_FactionRenqiSet", type) //上香类型
    }

    rewardClicked(args) {
        let name = args.target.name
        let index = name.replace(/[^0-9]/ig, "")
        let type = tonumber(opFactionConfig.RenqiFunds) + tonumber(index)

        let config = GameConfig.FactionRenqiPrizeConfig[type]
        let needRenQi = config.renqi

        let renqiData = ClubSystem.getInstance().getClubRenqiInfo() || {}
        let ownRenQi = renqiData.renqiExp || 0 //香火值

        let dailyRecord = getSaveRecord(opSaveRecordKey.facDailyRenqiPrize) || []

        if (ownRenQi >= needRenQi && dailyRecord[type] != 1) {
            RpcProxy.call("C2G_FactionRenqiPrize", type) //领取奖励
        } else {
            MsgSystem.addTagTips(needRenQi + Localize_cns("CLUB_TXT111"))
        }
    }

    //红点提示
    refreshClubDotTips() {
        for (let i in GameConfig.FactionRenqiPrizeConfig) {
            if (GuideFuncSystem.getInstance().checkIncensePrize(i)) {
                this.mParentWnd.createDotTipsUI(this.mElemList["reward_btn" + (tonumber(i) - 100)])
            }
        }
    }
}