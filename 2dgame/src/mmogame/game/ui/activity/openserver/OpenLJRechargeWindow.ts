// TypeScript file
class OpenLJRechargeWindow extends BaseCtrlWnd {
    controlDataTable: any;
    name: string;
    mLayoutPath: any;
    scroll: any
    timerList: any;

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.timerList = {}
        this.name = params[2] || "ljr"                  //累积充值
        this.mLayoutPath = params[3]
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mElemList["group_wnd"])
        this.mElemList[this.name].top = 0;
		this.mElemList[this.name].bottom = -5

        var elemInfo = [
            {["name"]: this.name + "go_tl",     ["title"]: Localize_cns("OPENSERVER_TXT22"), ["color"]: gui.Color.lime, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo },
            
		]
		UiUtil.initElem(elemInfo, this.mElemList[this.name], this.mElemList, this)

        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)

        // this.mElemList[this.name + "time_rd"].setAlignFlag(gui.Flag.RIGHT)
        // this.mElemList[this.name + "stage_rd"].setAlignFlag(gui.Flag.RIGHT);
        // this.mElemList["name_txt"].textColor = gui.Color.ublack;
        // this.mElemList["go_tl"].textColor = gui.Color.ublack;

        AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + "00:00:00"), "ht_22_cc_stroke", "gold")
        AddRdContent(this.mElemList[this.name + "stage_rd"], String.format(Localize_cns("OPENSERVER_TXT21"), "#orange" + 9), "ht_24_cc_stroke", "white")

        let group = <eui.Group>this.mElemList[this.name + "scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, this.name + "_s", 0, 0, group.width, group.height, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshHeroUpdate, this)
        RegisterEvent(EventDefine.UI_HIDE, this.onUIHide, this)

        this.mElemList[this.name].visible = true
        this.onRefresh()

        this.applyActInfo()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshHeroUpdate, this)
        UnRegisterEvent(EventDefine.UI_HIDE, this.onUIHide, this)

        this.mElemList[this.name].visible = false
        for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}
    }

    onRefresh() {
        let list = []//[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ,1 ]
        let gainedList = []
        let info = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE) || []
        let dayIndex = info[0] || -1
        let overTime = info[1] || GetServerTime()
        
        //[哪天的记录， {[奖励档次]=是否领取}]   0没有领取，1领取了，没有这个index，表示没有达成
        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE) || []          //玩家信息
        let record = {}
        if (playerInfo) {
            if (dayIndex == playerInfo[0]) {
                record = playerInfo[1]
            }
        }
        let l = GameConfig.NewServerAccRechargeConfig[dayIndex] || []
        for (let k in l) {
            let v = l[k]
            if (record[v.point] == 1) {           //已领取
                table_insert(gainedList, v)    
            } else {
                table_insert(list, v)
            }
        }
        table_sort(list, function(a, b) {return a.point - b.point})
        table_sort(gainedList, function(a, b) {return a.point - b.point})
        table_merge(list, gainedList)
        
        let group = <eui.Group>this.mElemList[this.name + "scroll_group"]
        let scroll = this.scroll
		scroll.clearItemList();
		this.controlDataTable = {}
        for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}
        
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

        this.refreshHeroUpdate()
    }

    refreshHeroUpdate() {        
        //当前充值数
        let dailyPayCount = getSaveRecord(opSaveRecordKey.dailyRecharge) || 0                   //每日（当天）充值
        let hadRecharge = GetRmbFromGold(dailyPayCount)
        AddRdContent(this.mElemList[this.name + "stage_rd"], String.format(Localize_cns("OPENSERVER_TXT21"), "#orange" + hadRecharge), "ht_22_cc_stroke", "white")
    }

    initItemWindow(window) {
        let name = window.name

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
        // this.mElemList[name + "itemBox" + 2].updateByEntry(60057, 1000)
    }

    refreshItemWindow(window, config) {
        let name = window.name

        this.mElemList[name + "_tl"].text = config.title // config.point + config.title

        let itemShow = AnalyPrizeFormat(config.prize)
        for (let i = 0; i < 4; i++) {
            if (itemShow[i]) {
                let [entryId, count, quality] = itemShow[i]
                this.mElemList[name + "itemBox" + i].setVisible(true)
                this.mElemList[name + "itemBox" + i].updateByEntry(entryId, count, quality)
            } else {
                this.mElemList[name + "itemBox" + i].setVisible(false)
            }
        }

        //[哪天的记录， {[奖励档次]=是否领取}]   0没有领取，1领取了，没有这个index，表示没有达成
        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE) || []          //玩家信息
        let actInfo = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE) || []
        let dayIndex = actInfo[0] || -1
        let info = {}
        if (playerInfo) {
            if (dayIndex == playerInfo[0]) {
                info = playerInfo[1]
            }
        }

        this.mElemList[name + "_go"].visible = false
        this.mElemList[name + "_gain"].visible = false
        this.mElemList[name + "_gain"].enabled = false
        if (info[config.point] != null) {
            if (info[config.point] == 0) {                  //可领取，未领取
                this.mElemList[name + "_gain"].visible = true
                this.mElemList[name + "_gain"].enabled = true
                this.mElemList[name + "_gain"].text = Localize_cns("OPENSERVER_TXT8")

                this.controlDataTable[name + "_gain"] = config.point
            } else if (info[config.point] == 1) {           //已领取
                this.mElemList[name + "_gain"].visible = true
                this.mElemList[name + "_gain"].text = Localize_cns("OPENSERVER_TXT9")
            }
        } else {                                            //未达成
            this.mElemList[name + "_go"].visible = true
        }
    }

    applyActInfo() {
        RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE)
    }

    onActivityUpdate(args) {
        if (args.actIndex != PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE) {
            return
        }

        this.onRefresh()
    }

    onUIHide(args) {
        if (args.window.classname == "PayFrame") {
            this.applyActInfo()
        }
    }
    ////////////////////////////////////////////////
    onClickGo(args) {
        ExecuteMainFrameFunction("chongzhi")
    }

    onClickGain(args) {
        let name = args.target.name

        if (this.controlDataTable[name] == null) {
            return
        }
        
        let index = this.controlDataTable[name]
        RpcProxy.call("C2G_GetOperateActivityPrize", PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE, [index])
    }
}