// TypeScript file
class OpenQMJinjieWindow extends BaseCtrlWnd {
    controlDataTable: any;
    name: string;
    mLayoutPath: any;
    scroll: any
    timerList: any
    actIndex: number
    cellIndex: number

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.name = params[2] || "jinjie"                  //全民进阶
        this.mLayoutPath = params[3]
        this.actIndex = PayActivityIndex.NEW_SERVER_ALL_STAGE_UP
        this.timerList = {}
        this.cellIndex = - 1
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mElemList["group_wnd"])
        this.mElemList[this.name].top = 0;
		this.mElemList[this.name].bottom = -5

        var elemInfo = [
            {["name"]: this.name + "go_tl",     ["title"]: Localize_cns("OPENSERVER_TXT5"), ["color"]: gui.Color.lime, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickLabelGo },
            
		]
		UiUtil.initElem(elemInfo, this.mElemList[this.name], this.mElemList, this)

        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)

        // this.mElemList[this.name + "time_rd"].setAlignFlag(gui.Flag.RIGHT)
        // this.mElemList[this.name + "stage_rd"].setAlignFlag(gui.Flag.RIGHT);
        // this.mElemList[this.name + "stage_rd"].visible = false
        // this.mElemList["name_txt"].textColor = gui.Color.ublack;
        // this.mElemList["go_tl"].textColor = gui.Color.ublack;

        AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + "00:00:00"), "ht_22_cc_stroke", "gold")
        // AddRdContent(this.mElemList[this.name + "stage_rd"], String.format(Localize_cns("OPENSERVER_TXT27"), "#lime" + 9), "ht_22_cc_stroke", "white")

        let group = <eui.Group>this.mElemList[this.name + "scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)
        RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.refreshCurStage, this)

        this.mElemList[this.name].visible = true
        this.onRefresh()

        this.applyActInfo()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)
        UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.refreshCurStage, this)

        this.mElemList[this.name].visible = false
        
        for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}
        this.cellIndex = - 1
    }

    onRefresh() {
        let list = []
        let gainedList = []
        let info = ActivitySystem.getInstance().getOperateActivityInfo(this.actIndex) || []
        //{self.reachList, serverDay, utils.getTomorrow()}  reachList  --{[index]=count}   达成人数，空为0
        let dayIndex = info[1] || -1
        let overTime = info[2] || GetServerTime()

        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.actIndex) || {}
        // [[奖励档次]=是否领取]   1领取了，没有这个index，表示没有领取，可否领取要客户端判断

        let l = GameConfig.NewServerAllStageUpConfig[dayIndex] || []
        for (let k in l) {
            let v = l[k]
            if (playerInfo[v.prizeIndex] == 1) {           //已领取
                table_insert(gainedList, v)    
            } else {
                table_insert(list, v)
            }
        }
        table_sort(list, function(a, b) {return a.prizeIndex - b.prizeIndex})
        table_sort(gainedList, function(a, b) {return a.prizeIndex - b.prizeIndex})
        table_merge(list, gainedList)
        
        for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}
        
        let group = <eui.Group>this.mElemList[this.name + "scroll_group"]
        let scroll = this.scroll
		scroll.clearItemList();
		this.controlDataTable = {}
		let hasNum = list.length
		for (let k = 0; k < list.length; k++) {
			let v = list[k]
			let [window, flag] = scroll.getItemWindow(k, group.width - 3, 145, 3, 0, 0)

            if (flag == true) {
			    this.initItemWindow(window)
            }
			this.refreshItemWindow(window, v)
		}

        //活动时间
        let tick = function(delay) {
            let leftTime = overTime - GetServerTime()
            if (leftTime < 0) {
                if (this.timerList["tick"]) {
                    KillTimer(this.timerList["tick"])
                    delete this.timerList["tick"] 
                }

                leftTime = 0
            }
            AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + getFormatDiffTime(leftTime)), "ht_22_cc_stroke", "gold")
        }
        if (this.timerList["tick"] == null) {
            this.timerList["tick"] = SetTimer(tick, this, 200, true)
        }

        this.refreshCurStage()
    }

    //刷新当前等阶
    refreshCurStage() {
        let funInfo = FunSystem.getInstance().getFunInfoWithType(this.cellIndex)
        if (funInfo == null) return
        let typeStage = funInfo.stage
        AddRdContent(this.mElemList[this.name + "stage_rd"], String.format(Localize_cns("OPENSERVER_TXT3"), "#nor" + String.format(Localize_cns("OPENSERVER_TXT4"), typeStage)), "ht_22_cc_stroke", "gold")
    
    }

    initItemWindow(window) {
        let name = this.name + window.name

		let mElemInfo: any = [
			{ ["index_type"]: gui.Grid9Image,   ["name"]: name + "_bg",         ["image"]: "ty_uiDi03", ["font"]: "ht_20_cc_stroke", ["x"]: 0, ["y"]: 0, ["w"]: window.width, ["h"]: window.height, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Image,        ["name"]: name + "_tlbg",       ["image"]: "kfhd_textDi01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 10, ["w"]: 336, ["h"]: 32, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_tl",         ["title"]: Localize_cns("OPENSERVER_TXT6"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 12, ["w"]: 336, ["h"]: 28, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: gui.Button,       ["name"]: name + "_go",         ["title"]: Localize_cns("OPENSERVER_TXT7"), ["font"]: "ht_28_cc_stroke", ["image"]: "ty_tongYongBt3",  ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 65, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo},
            { ["index_type"]: gui.Button,       ["name"]: name + "_gain",       ["title"]: Localize_cns("OPENSERVER_TXT8"), ["font"]: "ht_28_cc_stroke", ["image"]: "ty_tongYongBt16", ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 65, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGain},
            

		]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
        for (let i = 0; i < 4; i++) {
            this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox" + i, 20 + 85 * i, 50, window)
        }
    }

    refreshItemWindow(window, config) {
        let name = this.name + window.name

        let info = ActivitySystem.getInstance().getOperateActivityInfo(this.actIndex) || []
        //{self.reachList, serverDay, utils.getTomorrow()}  reachList  --{[index]=count}   达成人数，空为0
        let reachList = info[0] || []

        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.actIndex)
        // [[奖励档次]=是否领取]   1领取了，没有这个index，表示没有领取，可否领取要客户端判断
        let funIndex = cellOptionsIndex[config.stageUp]
        if (this.cellIndex == -1) {
            this.cellIndex = funIndex
        }
        // let funInfo = FunSystem.getInstance().getFunInfoWithType(funIndex)
        // let stage = 0
        // if (funInfo != null) {
        //     stage = funInfo.stage
        // }
        //let state = funInfo.stage >= config.cond ? 1 : 0

        let reachNum = checkNull(reachList[config.prizeIndex], 0)
        this.mElemList[name + "_tl"].text = config.tips + "(" + reachNum + "/" + config.cond[0] + ")"
        let prize = AnalyPrizeFormat(config.prize)
        for (let k = 0; k < 4; k++) {
            if (prize[k]) {
                this.mElemList[name + "itemBox" + k].updateByEntry(prize[k][0], prize[k][1], prize[k][2])
                this.mElemList[name + "itemBox" + k].setVisible(true)
            } else {
                this.mElemList[name + "itemBox" + k].setVisible(false)
            }

        }

        this.mElemList[name + "_go"].visible = false
        this.mElemList[name + "_gain"].visible = false
        this.mElemList[name + "_gain"].enabled = false
        if (playerInfo[config.prizeIndex] != null) {                    //config.cond = [人数, 等阶]
            if (playerInfo[config.prizeIndex] == 0) {                  //可领取，未领取
                this.mElemList[name + "_gain"].visible = true
                this.mElemList[name + "_gain"].enabled = true
                this.mElemList[name + "_gain"].text = Localize_cns("OPENSERVER_TXT8")

                this.controlDataTable[name + "_gain"] = config.prizeIndex
            } else if (playerInfo[config.prizeIndex] == 1) {           //已领取
                this.mElemList[name + "_gain"].visible = true
                this.mElemList[name + "_gain"].text = Localize_cns("OPENSERVER_TXT9")
            }
        } else {                                            //客户端判断
            if (reachNum >= config.cond[0]) {
                this.mElemList[name + "_gain"].visible = true
                this.mElemList[name + "_gain"].enabled = true
                this.mElemList[name + "_gain"].text = Localize_cns("OPENSERVER_TXT8")

                this.controlDataTable[name + "_gain"] = config.prizeIndex
            } else {
                this.mElemList[name + "_go"].visible = true
                this.controlDataTable[name + "_go"] = config.stageUp
            }
        }
    }
    
    applyActInfo() {
        RpcProxy.call("C2G_SendOperateAndPlayerData", this.actIndex)
    }
    
    onActivityUpdate(args) {
        if (args.actIndex != this.actIndex) {
            return
        }

        this.onRefresh()
    }

    ////////////////////////////////////////////////
    onClickLabelGo(args) {
        if (this.cellIndex == -1) return
        let cellName = cellOptionsName[this.cellIndex - 1]
        ExecuteActivityFrameFunction(cellName)
    }

    onClickGo(args) {
        let name = args.target.name

        if (this.controlDataTable[name] == null) {
            return
        }
        
        let cellName = this.controlDataTable[name]
        ExecuteActivityFrameFunction(cellName)
    }

    onClickGain(args) {
        let name = args.target.name

        if (this.controlDataTable[name] == null) {
            return
        }
        
        let index = this.controlDataTable[name]
        RpcProxy.call("C2G_GetOperateActivityPrize", this.actIndex, [index])
    }
}