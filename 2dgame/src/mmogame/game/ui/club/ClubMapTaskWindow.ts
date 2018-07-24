// TypeScript file
class ClubMapTaskWindow extends BaseCtrlWnd {
    timer: number;
    hideAction: MoveAction;
    showAction: MoveAction;
    isHide: boolean;

    public initObj(...params: any[]) {
        this.isHide = false
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        let ElemInfo = [
            //一键完成
            { ["name"]: "colt_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onekeyCollect },
            { ["name"]: "intr_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onekeyInstrusion },

            //领取
            { ["name"]: "colt_get_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGetCollectPrize },
            { ["name"]: "intr_get_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGetInstrusionPrize },

            //重置
            { ["name"]: "colt_reset_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.resetCollectTask },
            { ["name"]: "intr_reset_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.resetInstrusionTask },

            { ["name"]: "control_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.startMoveAction },

            { ["name"]: "gray_wnd", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.goOnAnim }
        ]
        UiUtil.initElem(ElemInfo, this.mLayoutNode, this.mElemList, this)

        var data: any = { ["startX"]: 0, ["startY"]: 0, ["endX"]: -200, ["endY"]: 0, ["moveType"]: "inertional", }
        this.hideAction = MoveAction.newObj(this.mElemList["task_wnd"], 300, data, null, this)

        var data: any = { ["startX"]: -200, ["startY"]: 0, ["endX"]: 0, ["endY"]: 0, ["moveType"]: "inertional", }
        this.showAction = MoveAction.newObj(this.mElemList["task_wnd"], 300, data, null, this)

        for (let i = 0; i < 3; i++) {
            this.mElemList["colt_item" + i] = UIItemBox.newObj(this.mLayoutNode, "colt_item" + i, 0, 0, this.mElemList["colt_prize_wnd"], 0.75)
            this.mElemList["intr_item" + i] = UIItemBox.newObj(this.mLayoutNode, "intr_item" + i, 0, 0, this.mElemList["intr_prize_wnd"], 0.75)
        }

        let coltCheck = <eui.CheckBox>this.mElemList["colt_check"]
        let intrCheck = <eui.CheckBox>this.mElemList["intr_check"]
        coltCheck.addEventListener(egret.TouchEvent.CHANGE, this.changeColtCheck, this)
        intrCheck.addEventListener(egret.TouchEvent.CHANGE, this.changeIntrCheck, this)
        coltCheck.selected = false
        intrCheck.selected = false

        this.mElemList["colt_cost"].setAlignFlag(gui.Flag.RIGHT)
        this.mElemList["intr_cost"].setAlignFlag(gui.Flag.RIGHT)

        this.mElemList["task_group"].touchEnabled = false;

        this.mElemList["colt_progress"].visible = false

        this.mElemList["colt_ctrl_wnd"].visible = false
        this.mElemList["colt_get_wnd"].visible = false
        this.mElemList["colt_reset_wnd"].visible = false

        this.mElemList["gray_wnd"].visible = false
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        this.mElemList["task_group"].visible = true
        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        this.mElemList["task_group"].visible = false
        this.hideAction.deleteObj()
        this.showAction.deleteObj()

        this.cancelAnim()

        this.mElemList["colt_check"].selected = false
        this.mElemList["intr_check"].selected = false
    }

    refreshFrame() {
        if (this.isHide) {
            UiUtil.setXY(this.mElemList["task_wnd"], -200, 0)
        } else {
            UiUtil.setXY(this.mElemList["task_wnd"], 0, 0)
        }

        let clubInfo = ClubSystem.getInstance().getCurClubInfo()
        if (!clubInfo) {
            return
        }

        //完成次数
        let recordList = getSaveRecord(opSaveRecordKey.facMapTaskFinishCount) || []
        let coltTime = recordList[opFactionMapTaskType.Collect] || 0
        let coltLimit = GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Collect][clubInfo.level].maxCount
        let intrTime = recordList[opFactionMapTaskType.Monster] || 0
        let intrLimit = GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Monster][clubInfo.level].maxCount

        //奖励记录
        let prizeList = getSaveRecord(opSaveRecordKey.facMapTaskPrizeGet) || []
        let coltRecord = prizeList[opFactionMapTaskType.Collect] || 0
        let intrRecord = prizeList[opFactionMapTaskType.Monster] || 0

        this.mElemList["colt_title"].text = String.format(Localize_cns("CLUB_TXT32"), coltTime, coltLimit)
        this.mElemList["intr_title"].text = String.format(Localize_cns("CLUB_TXT33"), intrTime, intrLimit)

        let coltItem = AnalyPrizeFormat(GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Collect][clubInfo.level].prizeAll)
        let intrItem = AnalyPrizeFormat(GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Monster][clubInfo.level].prizeAll)

        //奖励物品
        for (let i = 0; i < 3; i++) {
            if (coltItem[i]) {
                this.mElemList["colt_item" + i].updateByEntry(coltItem[i][0], coltItem[i][1])
                this.mElemList["colt_item" + i].setVisible(true)
            } else {
                this.mElemList["colt_item" + i].setVisible(false)
            }

            if (intrItem[i]) {
                this.mElemList["intr_item" + i].updateByEntry(intrItem[i][0], intrItem[i][1])
                this.mElemList["intr_item" + i].setVisible(true)
            } else {
                this.mElemList["intr_item" + i].setVisible(false)
            }
        }

        //采集任务刷新逻辑
        if (coltTime == coltLimit) { //采集任务完成
            this.mElemList["colt_ctrl_wnd"].visible = false
            //领取记录判断
            if (coltRecord == 0) { //没有领取
                this.mElemList["colt_get_wnd"].visible = true
                this.mElemList["colt_reset_wnd"].visible = false
                this.mElemList["colt_cost"].clear()
            } else {
                this.mElemList["colt_get_wnd"].visible = false
                this.mElemList["colt_reset_wnd"].visible = true
                this.mElemList["colt_cost"].setAlignFlag(gui.Flag.H_CENTER)
                AddRdContent(this.mElemList["colt_cost"], "#BIND_YUANBAO" + GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Collect][clubInfo.level].resetMoney, "ht_20_cc", "orange")
            }
        } else { //采集任务未完成
            this.mElemList["colt_ctrl_wnd"].visible = true
            this.mElemList["colt_get_wnd"].visible = false
            this.mElemList["colt_reset_wnd"].visible = false
            this.mElemList["colt_cost"].setAlignFlag(gui.Flag.RIGHT)
            AddRdContent(this.mElemList["colt_cost"], "#YUANBAO" + GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Monster][clubInfo.level].finishMoney, "ht_20_cc", "orange")
        }

        //小怪任务刷新逻辑
        if (intrTime == intrLimit) { //小怪任务完成
            this.mElemList["intr_ctrl_wnd"].visible = false
            //领取记录判断
            if (intrRecord == 0) { //没有领取
                this.mElemList["intr_get_wnd"].visible = true
                this.mElemList["intr_reset_wnd"].visible = false
                this.mElemList["intr_cost"].clear()
            } else {
                this.mElemList["intr_get_wnd"].visible = false
                this.mElemList["intr_reset_wnd"].visible = true
                this.mElemList["intr_cost"].setAlignFlag(gui.Flag.H_CENTER)
                AddRdContent(this.mElemList["intr_cost"], "#BIND_YUANBAO" + GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Monster][clubInfo.level].resetMoney, "ht_20_cc", "orange")
            }
        } else { //小怪任务未完成
            this.mElemList["intr_ctrl_wnd"].visible = true
            this.mElemList["intr_get_wnd"].visible = false
            this.mElemList["intr_reset_wnd"].visible = false
            this.mElemList["intr_cost"].setAlignFlag(gui.Flag.RIGHT)
            AddRdContent(this.mElemList["intr_cost"], "#YUANBAO" + GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Monster][clubInfo.level].finishMoney, "ht_20_cc", "orange")
        }

        let a = GetActivity(ActivityDefine.ClubMap)
        let checkType = a.getCheckType()
        this.mElemList["colt_check"].selected = checkType[opFactionMapTaskType.Collect]
        this.mElemList["intr_check"].selected = checkType[opFactionMapTaskType.Monster]
    }

    changeColtCheck(event: egret.TouchEvent) {
        if (this.mElemList["colt_check"].selected) {
            let a = GetActivity(ActivityDefine.ClubMap)
            a.autoCollect()
        } else {
            let a = GetActivity(ActivityDefine.ClubMap)
            a.cancelAuto(opFactionMapTaskType.Collect)

            this.goOnAnim()
        }
    }

    changeIntrCheck(event: egret.TouchEvent) {
        if (this.mElemList["intr_check"].selected) {
            let a = GetActivity(ActivityDefine.ClubMap)
            a.autoInstrusion()
        } else {
            let a = GetActivity(ActivityDefine.ClubMap)
            a.cancelAuto(opFactionMapTaskType.Monster)
        }
    }

    startMoveAction(event: egret.TouchEvent) {
        if (this.hideAction.isRunning() || this.showAction.isRunning()) {
            return
        }

        this.isHide = !this.isHide

        if (this.isHide) {
            this.hideAction.run()
        } else {
            this.showAction.run()
        }
    }

    onekeyCollect(args) {
        let clubInfo = ClubSystem.getInstance().getCurClubInfo()
        let str = String.format(Localize_cns("CLUB_TXT102"), GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Collect][clubInfo.level].finishMoney)
        let _this = this
        var t: IDialogCallback = {
            onDialogCallback(result: boolean, userData): void {
                if (result) {
                    let myRmb = GetHeroProperty("gold")
                    if (myRmb < GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Collect][clubInfo.level].finishMoney) {
                        ExecuteMainFrameFunction("chongzhi")
                    } else {
                        RpcProxy.call("C2G_FactionMapTaskOneKey", opFactionMapTaskType.Collect)
                        _this.cancelAnim()
                    }
                }
            }
        }
        MsgSystem.confirmDialog(str, t, null)
    }

    onekeyInstrusion(args) {
        let clubInfo = ClubSystem.getInstance().getCurClubInfo()
        let str = String.format(Localize_cns("CLUB_TXT102"), GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Monster][clubInfo.level].finishMoney)
        var t: IDialogCallback = {
            onDialogCallback(result: boolean, userData): void {
                if (result) {
                    let myRmb = GetHeroProperty("gold")
                    if (myRmb < GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Monster][clubInfo.level].finishMoney) {
                        ExecuteMainFrameFunction("chongzhi")
                    } else {
                        RpcProxy.call("C2G_FactionMapTaskOneKey", opFactionMapTaskType.Monster)
                    }
                }
            }
        }
        MsgSystem.confirmDialog(str, t, null)
    }

    onGetCollectPrize() {
        RpcProxy.call("C2G_FactionMapTaskPrize", opFactionMapTaskType.Collect)
    }

    onGetInstrusionPrize() {
        RpcProxy.call("C2G_FactionMapTaskPrize", opFactionMapTaskType.Monster)
    }

    resetCollectTask() {
        let needMoney = opClubTaskReset.CostMoney
        let moneyUnit = opClubTaskReset.CostMoneyUnit
        let ownMoney = GetHeroMoney(moneyUnit)

        let [level, count] = VipSystem.getInstance().getClubTaskResetTime()
        let vipLv = GetHeroProperty("VIP_level") || 0

        let record = getSaveRecord(opSaveRecordKey.facMapTaskResetCount) || {}
        let useCount = record[opFactionMapTaskType.Collect] || 0
        let color = ownMoney >= needMoney ? "#lime" : "#red"
        let str = ""
        if (vipLv < level) {
            str = String.format(Localize_cns("CLUB_TXT125"), color, needMoney, 0, level, count)
        } else {
            str = String.format(Localize_cns("CLUB_TXT126"), color, needMoney, count - useCount)
        }

        var callback: IDialogCallback = {
            onDialogCallback(result: boolean, userData): void {
                if (result == true) {
                    if ((count - useCount > 0) && ownMoney >= needMoney) {
                        RpcProxy.call("C2G_FactionMapTaskReset", opFactionMapTaskType.Collect)
                    } else {
                        if (count - useCount <= 0) {
                            if (vipLv < level) {
                                MsgSystem.addTagTips(Localize_cns("VIP_UPGRADE_TIPS"))
                            } else {
                               MsgSystem.addTagTips(Localize_cns("VIP_UPGRADE_TIPS1")) 
                            }
                        } else if (ownMoney < needMoney) {
                            MsgSystem.addTagTips(GetHeroMoneyStr(moneyUnit) + Localize_cns("NO_MONEY"))
                        }
                    }
                }
            }
        }
        MsgSystem.confirmDialog(str, callback)
    }

    resetInstrusionTask() {
        let needMoney = opClubTaskReset.CostMoney
        let moneyUnit = opClubTaskReset.CostMoneyUnit
        let ownMoney = GetHeroMoney(moneyUnit)

        let [level, count] = VipSystem.getInstance().getClubTaskResetTime()
        let vipLv = GetHeroProperty("VIP_level") || 0

        let record = getSaveRecord(opSaveRecordKey.facMapTaskResetCount) || {}
        let useCount = record[opFactionMapTaskType.Monster] || 0
        let color = ownMoney >= needMoney ? "#lime" : "#red"
        let str = ""
        if (vipLv < level) {
            str = String.format(Localize_cns("CLUB_TXT127"), color, needMoney, 0, level, count)
        } else {
            str = String.format(Localize_cns("CLUB_TXT128"), color, needMoney, count - useCount)
        }

        var callback: IDialogCallback = {
            onDialogCallback(result: boolean, userData): void {
                if (result == true) {
                    if ((count - useCount > 0) && ownMoney >= needMoney) {
                        RpcProxy.call("C2G_FactionMapTaskReset", opFactionMapTaskType.Monster)
                    } else {
                        if (count - useCount <= 0) {
                            MsgSystem.addTagTips(Localize_cns("VIP_UPGRADE_TIPS"))
                        } else if (ownMoney < needMoney) {
                            MsgSystem.addTagTips(GetHeroMoneyStr(moneyUnit) + Localize_cns("NO_MONEY"))
                        }
                    }
                }
            }
        }
        MsgSystem.confirmDialog(str, callback)
    }

    ///////////////////////////////////////////////////////////////////
    startAnim() {
        this.mElemList["colt_progress"].visible = true
        this.mElemList["gray_wnd"].visible = true

        if (this.timer) {
            KillTimer(this.timer)
            this.timer = null
        }

        let count = 0
        this.timer = SetTimer(function (delay) {
            UiUtil.updateProgress(this.mElemList["colt_progress"], count, 80)
            if (count < 80) {
                count += 1
            } else {
                this.endAnim()
            }
        }, this, 80, false)
    }

    endAnim() {
        if (this.timer) {
            KillTimer(this.timer)
            this.timer = null
        }

        this.mElemList["colt_progress"].visible = false
        this.mElemList["gray_wnd"].visible = false
        if (!CheckFightState() == true) {
            RpcProxy.call("C2G_FactionMapTaskFinishOnce", opFactionMapTaskType.Collect)
        }
        UiUtil.updateProgress(this.mElemList["colt_progress"], 0, 100)
    }

    cancelAnim() {
        if (this.timer) {
            KillTimer(this.timer)
            this.timer = null
        }

        this.mElemList["colt_progress"].visible = false
        this.mElemList["gray_wnd"].visible = false
        UiUtil.updateProgress(this.mElemList["colt_progress"], 0, 100)
    }

    goOnAnim() {
        this.cancelAnim()

        let timer = null
        let hero: Hero = GetHero()
        let oldCellX = hero.getCellX()
        let oldCellY = hero.getCellY()
        let callback = function () {
            let cellX = hero.getCellX()
            let cellY = hero.getCellY()
            if (oldCellX == cellX && oldCellY == cellY) {
                if (this.mElemList["colt_check"].selected) {
                    let a = GetActivity(ActivityDefine.ClubMap)
                    a.autoCollect()
                } else if (this.mElemList["intr_check"].selected) {
                    let a = GetActivity(ActivityDefine.ClubMap)
                    a.autoInstrusion()
                }
            }

            KillTimer(timer)
            timer = null
        }
        timer = SetTimer(callback, this, 500)
    }

    //红点提示
    refreshDotTips() {
        //帮会地图任务完成未领奖
        let btnList = ["colt_get_btn", "intr_get_btn"]
        for (let i in opFactionMapTaskType) {
            let taskType = opFactionMapTaskType[i]
            if (GuideFuncSystem.getInstance().checkClubTaskFinish(taskType)) {
                let btnName = btnList[tonumber(taskType) - 100]
                this.mParentWnd.createDotTipsUI(this.mParentWnd.mElemList[btnName])
            }
        }
        //帮会地图可兑换
        for (let i = 0; i < 4; i++) {
            if (GuideFuncSystem.getInstance().checkClubExchange(i)) {
                this.mParentWnd.createDotTipsUI(this.mParentWnd.mElemList["purchase_btn"])
                break
            }
        }
    }
}