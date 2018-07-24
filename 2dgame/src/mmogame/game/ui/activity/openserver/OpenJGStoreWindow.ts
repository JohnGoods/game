// TypeScript file
class OpenJGStoreWindow extends BaseCtrlWnd {
    controlDataTable: any;
    name: string;
    mLayoutPath: any;
    scroll: any
    timerList: any

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.name = params[2] || "jgs"                  //折扣商店
        this.timerList = {}
        this.mLayoutPath = params[3]
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mElemList["group_wnd"])
        this.mElemList[this.name].top = 0;
		this.mElemList[this.name].bottom = -5

        var elemInfo = [
            // {["name"]: this.name + "go_tl",     ["title"]: Localize_cns("OPENSERVER_TXT5"), ["color"]: gui.Color.lime, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo },
            
		]
		UiUtil.initElem(elemInfo, this.mElemList[this.name], this.mElemList, this)

        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)

        // this.mElemList[this.name + "time_rd"].setAlignFlag(gui.Flag.RIGHT)
        // this.mElemList["name_txt"].textColor = gui.Color.ublack;
        // this.mElemList["go_tl"].textColor = gui.Color.ublack;

        AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space#little_space" + "00:00:00"), "ht_22_cc_stroke", "gold")
        
        let group = <eui.Group>this.mElemList[this.name + "scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, this.name + "_s", 0, 0, group.width, group.height, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onHeroUpdate, this)

        this.mElemList[this.name].visible = true
        this.onRefresh()

        this.applyActInfo()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onHeroUpdate, this)

        this.mElemList[this.name].visible = false
        
        this.mElemList[this.name].visible = false
        for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}
    }

    onRefresh() {
        let list = []
        let info = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT) || []
        let dayIndex = info[0] || -1
        let overTime = info[1] || GetServerTime()
        let l = GameConfig.NewServerShopDiscountConfig[dayIndex] || []
        let tempList = []

        let condList = []               //记录当前阶和下一阶
        let nowStage = -1
        for (let k in l) {
            let v = l[k]

            if (nowStage < 0) {
                //限购
                let funType = cellOptionsIndex[v.stageUp]
                let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
                if(funInfo != null){
                    nowStage = funInfo.stage
                }
            }
            if (v.cond <= nowStage) {
                if (condList[0] != null  && condList[0] < v.cond) {
                    condList[0] = v.cond
                } else if (condList[0] == null) {
                    condList[0] = v.cond
                }
            } else {
                if (condList[1] != null && condList[1] > v.cond) {
                    condList[1] = v.cond
                } else if (condList[1] == null) {
                    condList[1] = v.cond
                }
            }
            table_sort(condList, function(a, b) {return a - b})                     //保证[不大于当前阶 下一阶]
        }
        for (let k in l) {
            let v = l[k]
            if (table_isExist(condList, v.cond) == true) {
                table_insert(tempList, v)
            }
        }
        table_sort(tempList, function(a, b) {return a.index - b.index})
        list = splitListByCount(tempList, 2)
        
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
			let [window, flag] = scroll.getItemWindow(k, group.width - 3, 180, 3, 0, 0)

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
    }

    initItemWindow(window) {
        let name = this.name + window.name
        if (this.mElemList[name + "_group0"]) {
            // return
        }

		let mElemInfo: any = [
            //左边
			{ ["index_type"]: eui.Group,        ["name"]: name + "_group0",     ["title"]: null, ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 10, ["h"]: 10, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: gui.Grid9Image,   ["name"]: name + "_bg0",        ["parent"]: name + "_group0", ["image"]: "ty_uiDi03", ["font"]: "ht_20_cc_stroke", ["x"]: 0, ["y"]: 5, ["w"]: window.width / 2 - 5, ["h"]: window.height - 5, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Group,        ["name"]: name + "_itemGroup0", ["parent"]: name + "_group0", ["title"]: null, ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 50, ["w"]: 10, ["h"]: 10, ["event_name"]: null, ["fun_index"]: null},
            
            { ["index_type"]: gui.Grid9Image,   ["name"]: name + "_tlbg0",      ["parent"]: name + "_group0", ["image"]: "kfhd_textDi01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 10, ["w"]: 250, ["h"]: 32, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_tl0",        ["parent"]: name + "_group0", ["title"]: Localize_cns("OPENSERVER_TXT6"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 12, ["w"]: 250, ["h"]: 28, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Image,        ["name"]: name + "_jgbg0",      ["parent"]: name + "_group0", ["image"]: "ty_zheKouDi", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 0, ["w"]: 43, ["h"]: 80, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_jg0",        ["parent"]: name + "_group0", ["title"]: String.format(Localize_cns("OPENSERVER_TXT28"), 6), ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.white, ["x"]: 15, ["y"]: 0, ["w"]: 33, ["h"]: 70, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true},
            { ["index_type"]: gui.Button,       ["name"]: name + "_buy0",       ["parent"]: name + "_group0", ["title"]: Localize_cns("OPENSERVER_TXT15"), ["font"]: "ht_22_cc_stroke", ["image"]: "ty_tongYongBt6",  ["color"]: gui.Color.white, ["x"]: 120, ["y"]: 129, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBuy},
            { ["index_type"]: eui.Image,        ["name"]: name + "_icon00",     ["parent"]: name + "_group0", ["image"]: "ty_zuanShiIcon01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 228, ["y"]: 50, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Image,        ["name"]: name + "_icon10",     ["parent"]: name + "_group0", ["image"]: "ty_zuanShiIcon01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 228, ["y"]: 80, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_price00",    ["parent"]: name + "_group0", ["title"]: String.format(Localize_cns("OPENSERVER_TXT16"), 4000), ["font"]: "ht_22_rc", ["color"]: gui.Color.ublack, ["x"]: 90, ["y"]: 55, ["w"]: 135, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_price10",    ["parent"]: name + "_group0", ["title"]: String.format(Localize_cns("OPENSERVER_TXT17"), 3000), ["font"]: "ht_22_rc", ["color"]: gui.Color.orange, ["x"]: 90, ["y"]: 81, ["w"]: 135, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_unlocktl0",  ["parent"]: name + "_group0", ["title"]: Localize_cns("OPENSERVER_TXT20"), ["font"]: "ht_22_cc", ["color"]: gui.Color.red, ["x"]: 0, ["y"]: 135, ["w"]: window.width / 2 - 5, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: gui.Grid9Image,   ["name"]: name + "_line0",      ["parent"]: name + "_group0", ["image"]: "cz_uiLine02", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 110, ["y"]: 70, ["w"]: 125, ["h"]: 1, ["event_name"]: null, ["fun_index"]: null},
            
            //右边
            { ["index_type"]: eui.Group,        ["name"]: name + "_group1",     ["title"]: null, ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: window.width / 2 + 5, ["y"]: 0, ["w"]: 10, ["h"]: 10, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: gui.Grid9Image,   ["name"]: name + "_bg1",        ["parent"]: name + "_group1", ["image"]: "ty_uiDi03", ["font"]: "ht_20_cc_stroke", ["x"]: 0, ["y"]: 5, ["w"]: window.width / 2 - 5, ["h"]: window.height - 5, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Group,        ["name"]: name + "_itemGroup1", ["parent"]: name + "_group1", ["title"]: null, ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 50, ["w"]: 10, ["h"]: 10, ["event_name"]: null, ["fun_index"]: null},
            
            { ["index_type"]: gui.Grid9Image,   ["name"]: name + "_tlbg1",      ["parent"]: name + "_group1", ["image"]: "kfhd_textDi01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 10, ["w"]: 250, ["h"]: 32, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_tl1",        ["parent"]: name + "_group1", ["title"]: Localize_cns("OPENSERVER_TXT6"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 12, ["w"]: 250, ["h"]: 28, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Image,        ["name"]: name + "_jgbg1",      ["parent"]: name + "_group1", ["image"]: "ty_zheKouDi", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 0, ["w"]: 43, ["h"]: 80, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_jg1",        ["parent"]: name + "_group1", ["title"]: String.format(Localize_cns("OPENSERVER_TXT28"), 6), ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.white, ["x"]: 15, ["y"]: 0, ["w"]: 33, ["h"]: 70, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true},
            { ["index_type"]: gui.Button,       ["name"]: name + "_buy1",       ["parent"]: name + "_group1", ["title"]: Localize_cns("OPENSERVER_TXT15"), ["font"]: "ht_22_cc_stroke", ["image"]: "ty_tongYongBt6",  ["color"]: gui.Color.white, ["x"]: 120, ["y"]: 129, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBuy},
            { ["index_type"]: eui.Image,        ["name"]: name + "_icon01",     ["parent"]: name + "_group1", ["image"]: "ty_zuanShiIcon01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 228, ["y"]: 50, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Image,        ["name"]: name + "_icon11",     ["parent"]: name + "_group1", ["image"]: "ty_zuanShiIcon01", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 228, ["y"]: 80, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_price01",    ["parent"]: name + "_group1", ["title"]: String.format(Localize_cns("OPENSERVER_TXT16"), 4000), ["font"]: "ht_22_rc", ["color"]: gui.Color.ublack, ["x"]: 90, ["y"]: 55, ["w"]: 135, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_price11",    ["parent"]: name + "_group1", ["title"]: String.format(Localize_cns("OPENSERVER_TXT17"), 3000), ["font"]: "ht_22_rc", ["color"]: gui.Color.orange, ["x"]: 90, ["y"]: 81, ["w"]: 135, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: eui.Label,        ["name"]: name + "_unlocktl1",  ["parent"]: name + "_group1", ["title"]: Localize_cns("OPENSERVER_TXT20"), ["font"]: "ht_22_cc", ["color"]: gui.Color.red, ["x"]: 0, ["y"]: 135, ["w"]: window.width / 2 - 5, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null},
            { ["index_type"]: gui.Grid9Image,   ["name"]: name + "_line1",      ["parent"]: name + "_group1", ["image"]: "cz_uiLine02", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 110, ["y"]: 70, ["w"]: 125, ["h"]: 1, ["event_name"]: null, ["fun_index"]: null},
            
		]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
        for (let i = 0; i < 2; i++) {
            this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox" + i, 0, 0, this.mElemList[name + "_itemGroup" + i])

            let mElemInfo1: any = [
                { ["index_type"]: eui.Label,        ["name"]: name + "_xianshi" + i,       ["title"]: Localize_cns("OPENSERVER_TXT18"), ["font"]: "ht_18_cc", ["color"]: gui.Color.red, ["x"]: 5, ["y"]: 25, ["w"]: 20, ["h"]: 60, ["messageFlag"]: true},
                { ["index_type"]: gui.RichDisplayer,        ["name"]: name + "_xiangou" + i,       ["title"]: String.format(Localize_cns("OPENSERVER_TXT19"), 2, 5), ["font"]: "ht_16_cc", ["color"]: gui.Color.ublack, ["x"]: -20, ["y"]: 85, ["w"]: 120, ["h"]: 28, ["messageFlag"]: true},
                
            ]
            this.mElemList[name + "itemBox" + i].createElem(mElemInfo1, this.mElemList, this)
            this.mElemList[name + "_xiangou" + i].setAlignFlag(gui.Flag.CENTER_CENTER)
        }
    }

    refreshItemWindow(window, configList) {
        let name = this.name + window.name
        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT) || []
        //[[index] = count, ...]        index为对应商品档次，count为已购买次数，空为0

        for(let k = 0 ; k < 2; k++){
            let config = configList[k]
            if(config){
                this.mElemList[name + "_group" + k].visible = true

                let prize = AnalyPrizeFormat(config.item)
                let entryId = prize[0][0]
                let fontColor = GetItemFontGUIColor(entryId)
                this.mElemList[name + "_tl" + k].textColor = fontColor
                this.mElemList[name + "_tl" + k].text = config.tips

                let endTime = null
                if (config.limitTime) {
                    endTime = GetTodayTime(GetServerTime()) + config.limitTime
                }
                this.mElemList[name + "itemBox" + k].updateByEntry(entryId, prize[0][1], null, null, endTime)

                //限时
                if(endTime != null){
                    this.mElemList[name + "_xianshi" + k].visible = false
                }else{
                    this.mElemList[name + "_xianshi" + k].visible = true
                }

                //限购
                let funType = cellOptionsIndex[config.stageUp]
                let nowStage = 0
                let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
                if(funInfo != null){
                    nowStage = funInfo.stage
                }
                if(nowStage < config.cond){                                 //等阶条件
                    this.mElemList[name + "_unlocktl" + k].visible = true
                    this.mElemList[name + "_buy" + k].visible = false
                    this.mElemList[name + "_xiangou" +  k].visible = false
                    this.mElemList[name + "_unlocktl" + k].text = String.format(Localize_cns("CARNIVAL_UNLOCK_TIANXIAN_ENOUGH"), Localize_cns(cellOptionsName[funType - 1]),config.cond)
                }else{
                    this.mElemList[name + "_unlocktl" + k].visible = false
                    this.mElemList[name + "_buy" + k].visible = true
                    this.mElemList[name + "_xiangou" +  k].visible = true
                    let count = playerInfo[config.index] || 0
                    let text = String.format(Localize_cns("OPENSERVER_TXT19"), count , config.limitCount)
                    if(count >= config.limitCount){
                        //count = config.limitCount
                        text = Localize_cns("SHOP_TXT3")
                        this.mElemList[name + "_buy" + k].visible = false
                    }
                    this.controlDataTable[name + "_buy" + k] = config
                    AddRdContent(this.mElemList[name + "_xiangou" +  k], text, "ht_16_cc" ,"ublack")
                }

                this.mElemList[name + "_price0" + k].text = String.format(Localize_cns("OPENSERVER_TXT16"), config.oldPrice)
                this.mElemList[name + "_price1" + k].text = String.format(Localize_cns("OPENSERVER_TXT17"), config.newPrice)

                //折购
                if (config.newPrice < config.oldPrice) {
                    this.mElemList[name + "_jgbg" + k].visible = true
                    this.mElemList[name + "_jg" + k].visible = true

                    let disCount = Math.ceil((config.newPrice / config.oldPrice) * 10)
                    this.mElemList[name + "_jg" + k].text = String.format(Localize_cns("OPENSERVER_TXT28"), disCount)
                } else {
                    this.mElemList[name + "_jgbg" + k].visible = false
                    this.mElemList[name + "_jg" + k].visible = false
                }
            }else{
                this.mElemList[name + "_group" + k].visible = false
            }
        }
    }
    
    applyActInfo() {
        RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT)
    }
    
    onActivityUpdate(args) {
        if (args.actIndex != PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT) {
            return
        }

        this.onRefresh()
    }

    onHeroUpdate(args) {
        if (args.oldProperty.gold == args.newProperty.gold) {
            return
        }

        this.onRefresh()
    }

    ////////////////////////////////////////////////
    onClickBuy(args) {
        let name = args.target.name

        if (this.controlDataTable[name] == null) {
            return
        }
        
        let config = this.controlDataTable[name]
        let index = config.index
        if(GetHeroMoney(opItemUnit.CURRENCY) < config.newPrice){
            let formatStr = Localize_cns(ItemUnitName[opItemUnit.CURRENCY]) 
            MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"),formatStr))
            ExecuteMainFrameFunction("chongzhi")
            return 
        }
        RpcProxy.call("C2G_DoOperateActivity", PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT, [index])
    }
}