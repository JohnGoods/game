// TypeScript file
class CarnivalMountUpgradeWindow extends BaseCtrlWnd {
    controlDataTable: any;
    name: string;
    mLayoutPath: any;
    scroll: UIScrollList

    activityIndex
    cellIndex
    timer

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.name = params[2] || "zqjinjie"                  //天仙进阶
        this.mLayoutPath = params[3]
        this.activityIndex = PayActivityIndex.EVERY_STAGE_A
        this.cellIndex = - 1
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mElemList["group_wnd"])

        var elemInfo = [
            { ["name"]: this.name + "go_tl", ["title"]: Localize_cns("OPENSERVER_TXT5"), ["color"]: gui.Color.lime, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLabelGo },

        ]
        UiUtil.initElem(elemInfo, this.mElemList[this.name], this.mElemList, this)

        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)

        // this.mElemList[this.name + "time_rd"].setAlignFlag(gui.Flag.RIGHT)
        this.mElemList[this.name + "stage_rd"].setAlignFlag(gui.Flag.RIGHT);

        let group = <eui.Group>this.mElemList[this.name + "scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        // RegisterEvent(EventDefine.COMBAT_FIGHT_ROUND_UPDATE, this.onFightRoundUpdate, this)
        this.mElemList[this.name].visible = true
        this.onRefresh()
       // RpcProxy.call("C2G_SendOperateAndPlayerData", this.activityIndex)

        if (this.timer == null) {
            this.timer = SetTimer(this.onTick, this, 1000, true)
        }
    }

    public onHide(): void {
        // UnRegisterEvent(EventDefine.COMBAT_FIGHT_ROUND_UPDATE, this.onFightRoundUpdate, this)

        this.mElemList[this.name].visible = false

        if (this.timer != null) {
            KillTimer(this.timer)
            this.timer = null
        }
        this.cellIndex = -1
    }

    onRefresh() {
        let tempList = GetActivity(ActivityDefine.Carnival).getCarnivalUpgrade(this.activityIndex, GameConfig.StageLevelUpAConfig)
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

        let funInfo = FunSystem.getInstance().getFunInfoWithType(this.cellIndex)
        if (funInfo == null) return
        let typeStage = funInfo.stage
        AddRdContent(this.mElemList[this.name + "stage_rd"], String.format(Localize_cns("OPENSERVER_TXT3"), "#nor" + String.format(Localize_cns("OPENSERVER_TXT4"), typeStage)), "ht_22_cc_stroke", "gold")
    }

    initItemWindow(window) {
        let name = window.name
        let wndName = "_zuoqi_"
        name += wndName
        let mElemInfo: any = [
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["image"]: "ty_uiDi03", ["font"]: "ht_20_cc_stroke", ["x"]: 0, ["y"]: 0, ["w"]: window.width, ["h"]: window.height, ["event_name"]: null, ["fun_index"]: null },
            { ["index_type"]: eui.Image, ["name"]: name + "_tlbg", ["image"]: "kfhd_textDi01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 10, ["w"]: 336, ["h"]: 32, ["event_name"]: null, ["fun_index"]: null },
            { ["index_type"]: eui.Label, ["name"]: name + "_tl", ["title"]: Localize_cns("CARNIVAL_UNLOCK_TIANXIAN_JIE"), ["font"]: "ht_20_cc", ["color"]: gui.Color.ublack, ["x"]: 10, ["y"]: 12, ["w"]: 336, ["h"]: 28, ["event_name"]: null, ["fun_index"]: null },
            { ["index_type"]: gui.Button, ["name"]: name + "_go", ["title"]: Localize_cns("OPENSERVER_TXT7"), ["font"]: "ht_28_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 65, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo },
            { ["index_type"]: eui.Image, ["name"]: name + "_dot", ["image"]: "zjm_hongDian01", ["parent"]: name + "_go", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 77, ["y"]: 0, ["w"]: 40, ["h"]: 40, ["event_name"]: null, ["fun_index"]: null },
            //{ ["index_type"]: gui.Button,       ["name"]: name + "_gain",       ["title"]: Localize_cns("OPENSERVER_TXT8"), ["font"]: "ht_28_cc_stroke", ["image"]: "ty_tongYongBt16", ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 65, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Image, ["name"]: name + "_get", ["image"]: "bh_text02", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 65, ["w"]: 120, ["h"]: 39, ["event_name"]: null, ["fun_index"]: null },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)

        for (let k = 0; k < 4/*size_t(prize)*/; k++) {
            this.mElemList[name + "itemBox" + k] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox" + k, 20 + 80 * k, 50, window)
        }
    }

    refreshItemWindow(window, config) {
        let name = window.name
        let wndName = "_zuoqi_"
        name += wndName
        let prize = AnalyPrizeFormat(config.prize)
        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex)
        // let infoList = []
        let funIndex = cellOptionsIndex[config.stageUp]
        if (this.cellIndex == -1) {
            this.cellIndex = funIndex
        }
        let funInfo = FunSystem.getInstance().getFunInfoWithType(funIndex)
        let stage = 0
        if (funInfo != null) {
            stage = funInfo.stage
        }
        //let state = funInfo.stage >= config.cond ? 1 : 0
        
        this.mElemList[name + "_tl"].text = String.format(Localize_cns("CARNIVAL_UNLOCK_XIANWEI_JIE"), Localize_cns(cellOptionsName[funIndex - 1]), config.cond)
        for (let k = 0; k < 4; k++) {
            if (prize[k]) {
                this.mElemList[name + "itemBox" + k].updateByEntry(prize[k][0], prize[k][1])
                this.mElemList[name + "itemBox" + k].setVisible(true)
            } else {
                this.mElemList[name + "itemBox" + k].setVisible(false)
            }

        }
        this.mElemList[name + "_dot"].visible = false
        if (playerInfo[config.index] != null && playerInfo[config.index]) {
            this.mElemList[name + "_go"].visible = false
            this.mElemList[name + "_get"].visible = true
        } else {
            this.mElemList[name + "_go"].visible = true
            this.mElemList[name + "_get"].visible = false
            
            if (stage < config.cond) {
                this.mElemList[name + "_go"].text = Localize_cns("OPENSERVER_TXT7")
                this.mElemList[name + "_go"].source = "ty_tongYongBt3"
            } else {
                this.mElemList[name + "_go"].text = Localize_cns("CLUB_TXT50")
                this.mElemList[name + "_go"].source = "ty_tongYongBt16"
                this.mElemList[name + "_dot"].visible = true
            }
        }
    }

    ////////////////////////////////////////////////
    onClickGo(args) {
        let name = args.target.name
        let index = name.replace(/[^0-9]/ig, "");
        let config = this.controlDataTable[index]
        if (config == null) return
        let btn: gui.Button = this.mElemList[name]
        if (btn.text == Localize_cns("OPENSERVER_TXT7")) {
            let cellName = config.stageUp
            ExecuteActivityFrameFunction(cellName)
        } else {
            RpcProxy.call("C2G_GetOperateActivityPrize", this.activityIndex, [config.index])
        }
    }

    onLabelGo() {
        if (this.cellIndex == -1) return
        let cellName = cellOptionsName[this.cellIndex - 1]
        ExecuteActivityFrameFunction(cellName)
    }

    ////-----------定时器
    onTick() {
        let osTime = GetServerTime()
        let tomorrowTime = GetTomorrowTime(osTime)
        let diffTime = getFormatDiffTime(tomorrowTime - osTime)
        AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + diffTime), "ht_20_lc")
    }
}