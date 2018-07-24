// TypeScript file
class OpenSCTuangouWindow extends BaseCtrlWnd {
    controlDataTable: any;
    name: string;
    mLayoutPath: any;
    scroll: any
    tabWndList: UITabWndList;
    wndListDefine: any
    timerList: any;
    radioBtnList: any;

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.timerList = {}
        this.radioBtnList = {}
        this.name = params[2] || "tuangou"                  //首充团购
        this.mLayoutPath = params[3]
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mElemList["group_wnd"])
        this.mElemList[this.name].top = 0;
		this.mElemList[this.name].bottom = -5

        var elemInfo = [
            {["name"]: this.name + "go_tl",     ["title"]: Localize_cns("OPENSERVER_TXT26"), ["color"]: gui.Color.lime, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo },
            
		]
		UiUtil.initElem(elemInfo, this.mElemList[this.name], this.mElemList, this)

        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)

        // this.mElemList[this.name + "time_rd"].setAlignFlag(gui.Flag.RIGHT)
        // this.mElemList[this.name + "stage_rd"].setAlignFlag(gui.Flag.RIGHT);
        // this.mElemList["name_txt"].textColor = gui.Color.ublack;
        // this.mElemList["go_tl"].textColor = gui.Color.ublack;

        AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + "00:00:00"), "ht_22_cc_stroke", "gold")
        AddRdContent(this.mElemList[this.name + "stage_rd"], String.format(Localize_cns("OPENSERVER_TXT25"), "#orange" + 9), "ht_24_cc_stroke", "white")

        let group = <eui.Group>this.mElemList[this.name + "tuan_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_HORIZON)
        this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList)

        this.wndListDefine = {
            [0]: OpenTuangouItemWnd.newObj(this.mLayoutNode, this, "fir"),
            [1]: OpenTuangouItemWnd.newObj(this.mLayoutNode, this, "sec"),
            [2]: OpenTuangouItemWnd.newObj(this.mLayoutNode, this, "thr"),
            [3]: OpenTuangouItemWnd.newObj(this.mLayoutNode, this, "four"),
            [4]: OpenTuangouItemWnd.newObj(this.mLayoutNode, this, "five"),
            [5]: OpenTuangouItemWnd.newObj(this.mLayoutNode, this, "six"),
            [6]: OpenTuangouItemWnd.newObj(this.mLayoutNode, this, "seven"),
            [7]: OpenTuangouItemWnd.newObj(this.mLayoutNode, this, "eight"),
            [8]: OpenTuangouItemWnd.newObj(this.mLayoutNode, this, "nine"),
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onHeroUpdate, this)

        this.mElemList[this.name].visible = true
        this.onRefresh()
		this.tabWndList.setWndVisible(true)
        
        this.applyActInfo()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onHeroUpdate, this)

        this.mElemList[this.name].visible = false
		this.tabWndList.setWndVisible(false)
        
        for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}
    }

    onRefresh() {
        this.refreshActList()
    }

    //初始化活动（按钮）列表
    refreshActList() {
        let list = []//[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ,1 ]
        let temp = []
        for (let k in GameConfig.NewServerAllBuyConfig) {
            table_insert(temp, tonumber(k))
        }
        table_sort(temp, function(a, b) {return a - b})
        for (let i = 0; i < temp.length; i++) {
            table_insert(list, {index: i, title: String.format(Localize_cns("OPENSERVER_TXT29"), temp[i]), keyWord: temp[i]})
        }

        let group = <eui.Group>this.mElemList[this.name + "tuan_group"]
        let scroll = this.scroll
		scroll.clearItemList();
        this.tabWndList.clearTabWnd()
		this.controlDataTable = {}
        this.radioBtnList = {}
		let hasNum = list.length
		for (let k = 0; k < list.length; k++) {
			let v = list[k]
			let [window, flag] = scroll.getItemWindow(k, 106, 38, 0, 0, 0)

            if (flag == true) {
			    this.initRadioItemWindow(window, v)
            }
            this.refreshRadioItemWindow(window, v)
		}
    }

    refreshActTime() {
        for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}

        //活动时间
        let info = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NEW_SERVER_ALL_BUY) || []
        let overTime = info[2] || GetServerTime()                   //[self.reachList, serverDay, overTime]   reachList[index] = 达到数量 index为表示为档位表的第二关键字
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

        //当前充值数
        let charYuanBao = getSaveRecord(opSaveRecordKey.dailyRecharge) || 0                   //每日（当天）充值
        let hadRecharge = GetRmbFromGold(charYuanBao)
        AddRdContent(this.mElemList[this.name + "stage_rd"], String.format(Localize_cns("OPENSERVER_TXT21"), "#orange" + hadRecharge), "ht_22_cc_stroke", "white")
    
    }

    initRadioItemWindow(window, config) {
		let name = window.name

		let mElemInfo: any = [
            { ["index_type"]: eui.RadioButton,   ["name"]: name + "_btn", ["image"]: "mrcz_biaoQian02", ["title"]: config.title, ["color"]: gui.Color.white, ["font"]: "ht_18_cc_stroke",["image_down"]: "mrcz_biaoQian01", ["x"]: 0, ["y"]: 0, ["w"]: window.width, ["h"]: window.height, ["event_name"]: null, ["fun_index"]: null},

		]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
		//ui_util.CreateDrawRectPtr(this.mElemList[name +"_dec"], gui.Color32Half.green)
		//AddRdContent(this.mElemList[name + "_dec"], Localize_cns("CHAT_ERROE_JINYAN"), "ht_20_cc", "zongse")

        // if (this.tabWndList == null) {
        //     this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, [{name: name + "_btn", wnd: BaseCtrlWnd.newObj(this.mLayoutNode, this)}])
        // }

        // this.tabWndList.insertTabWnd(name + "_btn", this.wndListDefine[config.index])
        // let wnd = this.wndListDefine[config.index]
        // wnd.setFirstKeyWord(config.keyWord)
	}

    refreshRadioItemWindow(window, config) {
        let name = window.name

        this.tabWndList.insertTabWnd(name + "_btn", this.wndListDefine[config.index])
        let wnd = this.wndListDefine[config.index]
        wnd.setFirstKeyWord(config.keyWord)

        this.radioBtnList[config.keyWord] = window
    }

    refreshDotTips() {
        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_ALL_BUY) || []          //玩家信息
        let info = playerInfo[1] || []
        for (let k in this.radioBtnList) {
            let radioBtn = this.radioBtnList[k]
            this.mParentWnd.hideDotTipsUI(radioBtn)

            let l = GameConfig.NewServerAllBuyConfig[k] || []
            for (let _ in l) {
                let config = l[_]
                if (info[config.prizeIndex] != null) {
                    if (info[config.prizeIndex] == 0) {                  //可领取，未领取
                        this.mParentWnd.createDotTipsUI(radioBtn, true, null)
                    }
                }
            }
        }
    }

    applyActInfo() {
        RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NEW_SERVER_ALL_BUY)
    }

    onActivityUpdate(args) {
        if (args.actIndex != PayActivityIndex.NEW_SERVER_ALL_BUY) {
            return
        }

        this.refreshActTime()
        //刷新批次红点
        this.refreshDotTips()
    }

    onHeroUpdate(args) {
        if (args.oldProperty.gold == args.newProperty.gold) {
            return
        }

        this.refreshActTime()
    }
    ////////////////////////////////////////////////
    onClickGo(args) {
        ExecuteMainFrameFunction("chongzhi")
    }

    
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
class OpenTuangouItemWnd extends BaseCtrlWnd {
    controlDataTable: any;
    name: string;
    scroll: UIScrollList;
    fkeyWord: number

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.fkeyWord = 0
        this.name = params[2] || "item"                  //首充团购
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        let group = <eui.Group>this.mElemList[this.mParentWnd.name + "scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)

        this.scroll.setVisible(true)
        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)
        this.scroll.setVisible(false)

    }

    onRefresh() {
        let list = []
        let gainedList = []
        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_ALL_BUY) || []          //玩家信息
        let record = playerInfo[1] || {}
        let l = GameConfig.NewServerAllBuyConfig[this.fkeyWord] || []
        for (let k in l) {
            let v = l[k]
            if (record[v.prizeIndex] == 1) {           //已领取
                table_insert(gainedList, v)    
            } else {
                table_insert(list, v)
            }
        }
        table_sort(list, function(a, b) {return a.prizeIndex - b.prizeIndex})
        table_sort(gainedList, function(a, b) {return a.prizeIndex - b.prizeIndex})
        table_merge(list, gainedList)
        
        let group = <eui.Group>this.mElemList[this.mParentWnd.name + "scroll_group"]
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
    }

    initItemWindow(window) {
        let name = this.name + window.name

		let mElemInfo: any = [
			{ ["index_type"]: gui.Grid9Image,   ["name"]: name + "_bg",         ["image"]: "ty_uiDi03", ["font"]: "ht_20_cc_stroke", ["x"]: 0, ["y"]: 0, ["w"]: window.width, ["h"]: window.height, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Image,        ["name"]: name + "_tlbg",       ["image"]: "kfhd_textDi01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 10, ["w"]: 336, ["h"]: 32, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_tl",         ["title"]: Localize_cns("OPENSERVER_TXT6"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 12, ["w"]: 336, ["h"]: 28, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: gui.Button,       ["name"]: name + "_go",         ["title"]: Localize_cns("OPENSERVER_TXT7"), ["font"]: "ht_28_cc_stroke", ["image"]: "ty_tongYongBt3",  ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 65, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo},
            { ["index_type"]: gui.Button,       ["name"]: name + "_gain",       ["title"]: Localize_cns("OPENSERVER_TXT8"), ["font"]: "ht_28_cc_stroke", ["image"]: "ty_tongYongBt16", ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 65, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGain},
            { ["index_type"]: gui.RichDisplayer,["name"]: name + "_rd",         ["title"]: null, ["font"]: "ht_16_cc", ["color"]: gui.Color.ublack, ["x"]: 20, ["y"]: 60, ["w"]: 230, ["h"]: 60, ["messageFlag"]: true},
                

		]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
        this.mElemList[name + "itemBox"] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox", 275, 50, window)
        AddRdContent(this.mElemList[name + "_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + 0), "ht_22_cc_stroke", "gold")
    }

    refreshItemWindow(window, config) {
        let name = this.name + window.name

        //[哪天的记录， {[奖励档次]=是否领取}]   0没有领取，1领取了，没有这个index，表示没有达成
        //[self.reachList, serverDay, overTime]   reachList[index] = 达到数量 index为表示为档位表的第二关键字
        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_ALL_BUY) || []          //玩家信息
        let actInfo = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NEW_SERVER_ALL_BUY) || []
        let reachNum = 0
        if (actInfo[0] != null && actInfo[0][config.prizeIndex] != null) {
            reachNum = actInfo[0][config.prizeIndex]
        }
        let info = playerInfo[1] || []
        
        this.mElemList[name + "_tl"].text = "(" + reachNum + "/" + this.fkeyWord + ")"
        AddRdContent(this.mElemList[name + "_rd"], config.tips, "ht_20_cc", "ublack")
        
        let itemShow = AnalyPrizeFormat(config.prize)
        let [entryId, count, quality] = itemShow[0]
        this.mElemList[name + "itemBox"].updateByEntry(entryId, count, quality)

        this.mElemList[name + "_go"].visible = false
        this.mElemList[name + "_gain"].visible = false
        this.mElemList[name + "_gain"].enabled = false
        if (info[config.prizeIndex] != null) {
            if (info[config.prizeIndex] == 0) {                  //可领取，未领取
                this.mElemList[name + "_gain"].visible = true
                this.mElemList[name + "_gain"].enabled = true
                this.mElemList[name + "_gain"].text = Localize_cns("OPENSERVER_TXT8")

                this.controlDataTable[name + "_gain"] = config.prizeIndex
            } else if (info[config.prizeIndex] == 1) {           //已领取
                this.mElemList[name + "_gain"].visible = true
                this.mElemList[name + "_gain"].text = Localize_cns("OPENSERVER_TXT9")
            }
        } else {                                            //未达成
            this.mElemList[name + "_go"].visible = true
        }
    }
    
    onActivityUpdate(args) {
        if (args.actIndex != PayActivityIndex.NEW_SERVER_ALL_BUY) {
            return
        }

        this.onRefresh()
    }

    ////////////////////////////////////////////////////////////////
    onClickGo(args) {
        ExecuteMainFrameFunction("chongzhi")
    }

    onClickGain(args) {
        let name = args.target.name

        if (this.controlDataTable[name] == null) {
            return
        }
        
        let index = this.controlDataTable[name]
        RpcProxy.call("C2G_GetOperateActivityPrize", PayActivityIndex.NEW_SERVER_ALL_BUY, [index])
    }
    ///////////////////////////////////////////////////////////////////
    setFirstKeyWord(fKeyWord) {
        this.fkeyWord = fKeyWord
    }
}