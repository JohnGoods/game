// TypeScript file
class ChampionArenaWindow extends BaseCtrlWnd {
    mElemList;
    timer: number;
    record: number;
    info: any;

    public initObj(...params: any[]) {
        this.timer = null
        this.record = 0
        this.info = {}
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList

        var elemInfo = [
            { ["name"]: "btn_rank", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRankClick },
            { ["name"]: "btn_challenge", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onChallengeClick },
            { ["name"]: "btn_shop", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickShop },
            { ["name"]: "buy_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBuy },

            { ["name"]: "ms_pic", ["messageFlag"]: true },
            { ["name"]: "tips_txt", ["color"]: gui.Color.lime },
        ]

        for (let i = 0; i < 5; i++) {
            JsUtil.arrayInstert(elemInfo, { ["name"]: "floor" + i, ["title"]: null, ["messageFlag"]: true })
            JsUtil.arrayInstert(elemInfo, { ["name"]: "group_" + i, ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFighter })

            this.mElemList["ui_actor_" + i] = UIActorView.newObj(this.mLayoutNode, "ui_actor_" + i, 50, 100, this.mElemList["actor_view" + i])
        }
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        for (let i = 0; i < 2; i++) {
            this.mElemList["itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, "itemBox" + i, 0, 0, this.mElemList["prize_wnd" + i])
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.startChallengeCount, this)
        RegisterEvent(EventDefine.CHAMPION_REFRESH, this.refreshFrame, this)
        this.mElemList["arena_wnd"].visible = true
        this.mElemList["title"].text = Localize_cns("JJC_TXT1")
        this.sendArenaRequest()
        //this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.startChallengeCount, this)
        UnRegisterEvent(EventDefine.CHAMPION_REFRESH, this.refreshFrame, this)
        this.mElemList["arena_wnd"].visible = false

        this.clearCoodTime()

        for (let i = 0; i < 5; i++) {
            this.mElemList["ui_actor_" + i].clearView()
        }
    }

    sendArenaRequest() {
        RpcProxy.call("C2G_GetChampionData")
    }

    refreshFrame() {
        let a = GetActivity(ActivityDefine.Champion)
        let info = a.getChampionInfo()
        this.info = info || {}

        //更新挑战次数
        this.startChallengeCount()

        //更新玩家数据
        let list = info.list
        table_sort(list, function (a, b) { return a.rank - b.rank })
        for (let i in list) {
            this.updateActorWnd(list[i], i)
        }

        //更新自己排名
        let rank = info.rank
        DrawNumberStringImage(this.mElemList["batch_rank"], "vip_", rank)
        this.mElemList["ms_pic"].visible = rank < 4200
        //更新自己战力
        let force = info.force
        DrawNumberStringImage(this.mElemList["batch_force"], "zhanLi_", "l" + force)
        //更新自己的奖励
        let prize = a.getDailyPrizeItemList()
        if (prize) {
            let point = prize.point
            let pointIcon = prize.pointIcon
            let bind = prize.bindCurrency
            let bindIcon = prize.bindIcon
            this.mElemList["itemBox0"].updateByEntry(bindIcon, bind)
            this.mElemList["itemBox1"].updateByEntry(pointIcon, point)
        }
    }

    startChallengeCount() {
        let count = (getSaveRecord(opSaveRecordKey.championTimes) == null) ? defaultValue.CHAMPION_CHALLENGE_COUNT : getSaveRecord(opSaveRecordKey.championTimes)
        this.record = getSaveRecord(opSaveRecordKey.championTime)//服务器记录的倒计时

        this.clearCoodTime()

        //是否满
        let str = ""
        if (count >= defaultValue.CHAMPION_CHALLENGE_COUNT) {
            str = String.format(Localize_cns("JJC_TXT5"), count)
        } else {
            this.timer = GameTimer.getInstance().setTimer(this.updateChallengeWnd, this, 200)

            str = String.format(Localize_cns("JJC_TXT5"), count)
            str = str + "#br#white" + getFormatDiffTime(this.record - GetServerTime())
        }
        AddRdContent(this.mElemList["count_rd"], str, "ht_24_cc_stroke", "white", 3)
    }

    updateChallengeWnd(delay) {
        let a = GetActivity(ActivityDefine.Champion)
        let info = a.getChampionInfo()
        let count = (getSaveRecord(opSaveRecordKey.championTimes) == null) ? defaultValue.CHAMPION_CHALLENGE_COUNT : getSaveRecord(opSaveRecordKey.championTimes)
        let record = this.record - GetServerTime()

        let str = ""
        if (record <= 0) {
            this.clearCoodTime()
            str = String.format(Localize_cns("JJC_TXT5"), count)
        } else {
            str = String.format(Localize_cns("JJC_TXT5"), count)
            str = str + "#br#white" + getFormatDiffTime(record)
        }
        AddRdContent(this.mElemList["count_rd"], str, "ht_24_cc_stroke", "white", 3)
    }

    clearCoodTime() {
        if (this.timer) {
            GameTimer.getInstance().killTimer(this.timer)
            this.timer = null
        }
    }

    updateActorWnd(info, index) {
        //更新排名
        DrawNumberStringImage(this.mElemList["batch_rank" + index], "vip_", info.rank)

        //更新战力
        DrawNumberStringImage(this.mElemList["batch_force" + index], "zhanLi_", "z" + info.force)

        //更新actor_view
        this.updateActorModel(info.role, info.sex, index)

        //更新名字
        this.mElemList["name" + index].text = info.name
    }

    updateActorModel(voc, sex, index) {
        let modeID = GetProfessionModel(voc, sex)
        this.mElemList["ui_actor_" + index].updateByPlayer(modeID)
    }

    onClickFighter(args: egret.TouchEvent) {
        let name = args.target.name
        let index = name.replace(/[^0-9]/ig, "");
        if (!this.info) {
            return
        }
        let list = this.info.list || []
        let info = list[index]

        if (CheckFightState() == true) {
            return
        }
        
        if (CheckActivityState() == false) {
            return
        }

        if (info) {
            if (info.id == GetHeroProperty("id")) {
                MsgSystem.addTagTips(Localize_cns("JJC_TXT7"))
            } else {
                // let a = GetActivity(ActivityDefine.Champion)
                // let aInfo = a.getChampionInfo()
                let count = (getSaveRecord(opSaveRecordKey.championTimes) == null) ? defaultValue.CHAMPION_CHALLENGE_COUNT : getSaveRecord(opSaveRecordKey.championTimes)
                if (count > 0) {
                    RpcProxy.call("C2G_ChampionFight", info.rank, info.name, info.id)
                } else {
                    MsgSystem.addTagTips(Localize_cns("JJC_TXT12"))
                }
            }
        }
    }

    onRankClick() {
        WngMrg.getInstance().showWindow("ChampionRankFrame");
    }

    onChallengeClick() {
        WngMrg.getInstance().showWindow("ChampionRecordFrame");
    }

    onClickShop() {
        let wnd = WngMrg.getInstance().getWindow("ShopJingJiFrame");
        wnd.showWithIndex(0);
    }

    onClickBuy() {
        // let a = GetActivity(ActivityDefine.Champion)
        // let aInfo = a.getChampionInfo()
        // let count = (getSaveRecord(opSaveRecordKey.championTimes) == null) ? defaultValue.CHAMPION_CHALLENGE_COUNT : getSaveRecord(opSaveRecordKey.championTimes)

        // 已购买次数
        let buyCount = getSaveRecord(opSaveRecordKey.buyChampionTimesCount) || 0
        // vip可购买次数
        let vipCount = VipSystem.getInstance().GetVipChampionTime()

        let price = ChampionConfig.rmbList[Math.floor(buyCount / ChampionConfig.buyTimeStep)]

        let [nextVip, nextVipCount] = VipSystem.getInstance().getNextVipTimeWithLv(GetHeroProperty("VIP_level") + 1, "buyChampionCount")

        let str = ""
        if (nextVip == GetHeroProperty("VIP_level")) {
            str = String.format(Localize_cns("JJC_TXT14"), price, defaultValue.CHAMPION_CHALLENGE_COUNT, vipCount - buyCount)
        } else {
            str = String.format(Localize_cns("JJC_TXT13"), price, defaultValue.CHAMPION_CHALLENGE_COUNT, vipCount - buyCount, nextVip, nextVipCount - vipCount)
        }

        var t: IDialogCallback = {
            onDialogCallback(result: boolean, userData): void {
                if (result == true) {
                    let ownYB = GetHeroMoney(opItemUnit.CURRENCY)
                    if (ownYB < 500) {
                        MsgSystem.addTagTips(Localize_cns("COPY_TXT16"))
                    }
                    else {
                        RpcProxy.call("C2G_ChampionBuyFightCount")
                    }
                }
            }
        }
        MsgSystem.confirmDialog(str, t)

    }
}