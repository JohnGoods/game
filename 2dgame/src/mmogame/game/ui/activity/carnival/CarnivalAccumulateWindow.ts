// TypeScript file
class CarnivalAccumulateWindow extends BaseCtrlWnd {
    controlDataTable: any;
    name: string;
    mLayoutPath: any;
    scroll: UIScrollList

    activityIndex
    timer

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.name = params[2] || "leiji"                  //累积充值
        this.mLayoutPath = params[3]
        this.activityIndex = PayActivityIndex.MIX_ACCU_RECHARGE
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mElemList["group_wnd"])

        var elemInfo = [
            { ["name"]: this.name + "go_tl", ["title"]: Localize_cns("OPENSERVER_TXT22"), ["color"]: gui.Color.lime, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLabelGo },

        ]
        UiUtil.initElem(elemInfo, this.mElemList[this.name], this.mElemList, this)


        let group = <eui.Group>this.mElemList[this.name + "scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
        this.mElemList[this.name].visible = true
        this.onRefresh()
       // RpcProxy.call("C2G_SendOperateAndPlayerData", this.activityIndex)
        if (this.timer == null) {
            this.timer = SetTimer(this.onTick, this, 1000, true)
        }
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
        this.mElemList[this.name].visible = false

        if (this.timer != null) {
            KillTimer(this.timer)
            this.timer = null
        }
    }

    onRefresh(args?) {
        if(args){
            let oldVal = args.oldProperty.saveRecord
			let newVal = args.newProperty.saveRecord
            if(oldVal[opSaveRecordKey.dailyRecharge] == newVal[opSaveRecordKey.dailyRecharge]) return 
        }

        let tempList = GetActivity(ActivityDefine.Carnival).getCarnivalUpgrade(this.activityIndex, GameConfig.AccuBuyRechargeConfig)
        if (tempList == null) return
        let list = tempList

        let group = <eui.Group>this.mElemList[this.name + "scroll_group"]
        let scroll = this.scroll
        scroll.clearItemList();
        this.controlDataTable = {}
        let hasNum = list.length
        for (let k = 0; k < list.length; k++) {
            let v = list[k]
            let [window, flag] = scroll.getItemWindow(k, group.width - 3, 145, 3, 0, 0)
            this.controlDataTable[k] = v
            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v)
        }
        scroll.refreshScroll(true, true)
        scroll.restoreViewXY()

        /*let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex)
        if(playerInfo == null) return 
        let hadRecharge = GetRmbFromGold(playerInfo[2] || 0)*/
        let charYuanBao = getSaveRecord(opSaveRecordKey.dailyRecharge) || 0
        let hadRecharge = GetRmbFromGold(charYuanBao)
        AddRdContent(this.mElemList["leijistage_rd"], String.format(Localize_cns("OPENSERVER_TXT25"), hadRecharge), "ht_20_lc")

    }

    initItemWindow(window) {
        let name = window.name
        let wndName = "_leiji_"
        name += wndName
        let mElemInfo: any = [
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["image"]: "ty_uiDi03", ["font"]: "ht_20_cc_stroke", ["x"]: 0, ["y"]: 0, ["w"]: window.width, ["h"]: window.height, ["event_name"]: null, ["fun_index"]: null },
            { ["index_type"]: eui.Image, ["name"]: name + "_tlbg", ["image"]: "kfhd_textDi01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 10, ["w"]: 336, ["h"]: 32, ["event_name"]: null, ["fun_index"]: null },
            { ["index_type"]: eui.Label, ["name"]: name + "_tl", ["title"]: Localize_cns("OPENSERVER_TXT6"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 12, ["w"]: 336, ["h"]: 28, ["event_name"]: null, ["fun_index"]: null },
            { ["index_type"]: gui.Button, ["name"]: name + "_go", ["title"]: Localize_cns("OPENSERVER_TXT7"), ["font"]: "ht_28_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 65, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo },
            { ["index_type"]: eui.Image, ["name"]: name + "_dot", ["image"]: "zjm_hongDian01", ["parent"]: name + "_go", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 77, ["y"]: 0, ["w"]: 40, ["h"]: 40, ["event_name"]: null, ["fun_index"]: null },
            { ["index_type"]: eui.Image, ["name"]: name + "_get", ["image"]: "bh_text02", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 65, ["w"]: 120, ["h"]: 39, ["event_name"]: null, ["fun_index"]: null },


        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
        for (let i = 0; i < 4; i++) {
            this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox" + i, 20 + 85 * i, 50, window)
        }
        // this.mElemList[name + "itemBox" + 2].updateByEntry(60057, 1000)
    }

    refreshItemWindow(window, config) {
        let name = window.name
        let wndName = "_leiji_"
        name += wndName
        let prize = AnalyPrizeFormat(config.prize)
        let netInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex)
        let playerInfo = netInfo[1] || {}
        let charYuanBao = getSaveRecord(opSaveRecordKey.dailyRecharge) || 0
        let hadRecharge = GetRmbFromGold(charYuanBao)
        let need = GetRmbFromGold(config.point)
        let state = hadRecharge >= need ? 1 : 0

        this.mElemList[name + "_tl"].text = String.format(Localize_cns("CARNIVAL_UNLOCL_RECHARGE_JIE"), need)
        for (let k = 0; k < 4; k++) {
            if (prize[k]) {
                this.mElemList[name + "itemBox" + k].updateByEntry(prize[k][0], prize[k][1])
                this.mElemList[name + "itemBox" + k].setVisible(true)
            } else {
                this.mElemList[name + "itemBox" + k].setVisible(false)
            }

        }
        this.mElemList[name + "_dot"].visible = false
        if (playerInfo[config.point] != null && playerInfo[config.point] != 0) {
            this.mElemList[name + "_go"].visible = false
            this.mElemList[name + "_get"].visible = true
        } else {
            this.mElemList[name + "_go"].visible = true
            this.mElemList[name + "_get"].visible = false

            if (state == 0) {
                this.mElemList[name + "_go"].text = Localize_cns("OPENSERVER_TXT7")
                this.mElemList[name + "_go"].source = "ty_tongYongBt3"
            } else {
                this.mElemList[name + "_go"].text = Localize_cns("CLUB_TXT50")
                this.mElemList[name + "_dot"].visible = true
                this.mElemList[name + "_go"].source = "ty_tongYongBt16"
            }
        }
    }

    ////////////////////////////////////////////////
    onClickGo(args) {
        let name = args.target.name
        let index = name.replace(/[^0-9]/ig, "");
        let btn: gui.Button = this.mElemList[name]
        let config = this.controlDataTable[index]
        if (config == null) return
        if (btn.text == Localize_cns("OPENSERVER_TXT7")) {
            let wnd: PayFrame = WngMrg.getInstance().getWindow("PayFrame")
            wnd.showWnd()
            this.mParentWnd.hideWnd()
        } else {
            RpcProxy.call("C2G_GetOperateActivityPrize", this.activityIndex, [config.point])
        }
    }

    onLabelGo() {
        let wnd: PayFrame = WngMrg.getInstance().getWindow("PayFrame")
        wnd.showWnd()
        this.mParentWnd.hideWnd()
    }

    ////-----------定时器
    onTick() {
        let osTime = GetServerTime()
        let tomorrowTime = GetTomorrowTime(osTime)
        let diffTime = getFormatDiffTime(tomorrowTime - osTime)
        AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + diffTime), "ht_20_lc")
    }
}