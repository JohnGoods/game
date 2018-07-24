// TypeScript file
class OpenDragonStarWindow extends BaseCtrlWnd {
    controlDataTable: any;
    name: string;
    mLayoutPath: any;
    scroll: any
    timerList: any
    actIndex: number
    handlerList: any
    keyWord: string                                 //跳转关键字

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.name = params[2] || "dragon"                  //龙宫星级
        this.mLayoutPath = params[3]
        this.actIndex = PayActivityIndex.NEW_SERVER_MISSION
        this.timerList = {}
        this.keyWord = null

        this.handlerList = {
            ["click"]: {
                ["campaignBoss"]: {callback: this.onClickCommon, params: "guanka", dParam: null},                                //关卡BOSS
                ["champion"]: {callback: this.onClickCommon, params: "jingjichang", dParam: null},                                    //竞技场排行
                ["dragonBoss"]: {callback: this.onClickCommon, params: "longwang", dParam: "fuben"},                                //神龙宝藏
                ["dragonBossStar"]: {callback: this.onClickCommon, params: "longwang", dParam: "fuben"},                                //神龙宝藏星数
                ["thunderTemple"]: {callback: this.onClickCommon, params: "xiaoleiyinsi", dParam: "fuben"},                                //小雷音寺
                ["heavenTrial"]: {callback: this.onClickCommon, params: "tiantingshilian", dParam: "fuben"},                                //天庭试炼
                ["materialBoss"]: {callback: this.onClickCommon, params: "fuben", dParam: "fuben"},                                //材料副本
                ["XianLv"]: {callback: this.onClickCommon, params: "xianlv", dParam: null},                                     //XianLv
            },

            ["des"]: {
                ["campaignBoss"]: {callback: this.genActDes_CampBoss, params: null},                                //关卡BOSS
                ["champion"]: {callback: this.genActDes_Champion, params: null},                                    //竞技场排行
                ["dragonBoss"]: {callback: this.genActDes_Dragon, params: null},                                //神龙宝藏
                ["dragonBossStar"]: {callback: this.genActDes_DragonStar, params: null},                                //神龙宝藏星数
                ["thunderTemple"]: {callback: this.genActDes_Temple, params: null},                                //小雷音寺
                ["heavenTrial"]: {callback: this.genActDes_Heaven, params: null},                                //天庭试炼
                ["materialBoss"]: {callback: this.genActDes_Materia, params: null},                                //材料副本
                ["XianLv"]: {callback: this.genActDes_XianLv, params: null},                                     //XianLv
            }
        }
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mElemList["group_wnd"])
        this.mElemList[this.name].top = 0;
		this.mElemList[this.name].bottom = -5

        var elemInfo = [
            {["name"]: this.name + "go_tl",     ["title"]: Localize_cns("OPENSERVER_TXT24"), ["color"]: gui.Color.lime, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo },
            
		]
		UiUtil.initElem(elemInfo, this.mElemList[this.name], this.mElemList, this)

        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)

        // this.mElemList[this.name + "time_rd"].setAlignFlag(gui.Flag.RIGHT)
        // this.mElemList[this.name + "stage_rd"].setAlignFlag(gui.Flag.RIGHT);
        // this.mElemList["name_txt"].textColor = gui.Color.ublack;
        // this.mElemList["go_tl"].textColor = gui.Color.ublack;

        AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + "00:00:00"), "ht_22_cc_stroke", "gold")
        AddRdContent(this.mElemList[this.name + "stage_rd"], String.format(Localize_cns("OPENSERVER_TXT23"), "#nor" + String.format(Localize_cns("OPENSERVER_TXT4"), 9)), "ht_22_cc_stroke", "gold")

        let group = <eui.Group>this.mElemList[this.name + "scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)

        this.mElemList[this.name].visible = true
        this.onRefresh()

        this.applyActInfo()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)

        this.mElemList[this.name].visible = false
        
        for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}
        this.keyWord = null
    }

    onRefresh() {
        let list = []
        let gainedList = []
        let info = ActivitySystem.getInstance().getOperateActivityInfo(this.actIndex) || []             //[serverDay, utils.getTomorrow()]
        let dayIndex = info[0] || -1
        let overTime = info[1] || GetServerTime()

        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.actIndex) || []
        // [prizeRecord, shedule]  --[{[index]=1}, 进度]
        let record = playerInfo[0] || {}

        let l = GameConfig.NewServerMissionConfig[dayIndex] || []
        for (let k in l) {
            let v = l[k]
            if (record[v.index] == 1) {           //已领取
                table_insert(gainedList, v)    
            } else {
                table_insert(list, v)
            }
        }
        table_sort(list, function(a, b) {return a.index - b.index})
        table_sort(gainedList, function(a, b) {return a.index - b.index})
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

        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.actIndex) || []
        // [prizeRecord, shedule]  --[{[index]=1}, 进度]
        let info = playerInfo[0] || {}
        let index = checkNull(playerInfo[1], -1)
        if (this.keyWord == null) {
            this.keyWord = config.mission
        }
        let str = String.format(Localize_cns("OPENSERVER_TXT36"), "#nor--")
        if (this.handlerList["des"][config.mission] != null) {
            let callback = this.handlerList["des"][config.mission].callback
            let params = this.handlerList["des"][config.mission].params

            str = callback.call(this, index, params)
        }
        AddRdContent(this.mElemList[this.name + "stage_rd"], str, "ht_22_cc_stroke", "gold")

        this.mElemList[name + "_tl"].text = config.tips
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
        if (info[config.index] != null) {
            if (info[config.index] == 0) {                  //可领取，未领取
                this.mElemList[name + "_gain"].visible = true
                this.mElemList[name + "_gain"].enabled = true
                this.mElemList[name + "_gain"].text = Localize_cns("OPENSERVER_TXT8")

                this.controlDataTable[name + "_gain"] = config.index
            } else if (info[config.index] == 1) {           //已领取
                this.mElemList[name + "_gain"].visible = true
                this.mElemList[name + "_gain"].text = Localize_cns("OPENSERVER_TXT9")
            }
        } else {                                            //未达成
            this.mElemList[name + "_go"].visible = true
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
    onClickGo(args) {
        if (this.keyWord == null) {
            return
        }

        if (this.handlerList["click"][this.keyWord] != null) {
            let callback = this.handlerList["click"][this.keyWord].callback
            let params = this.handlerList["click"][this.keyWord].params
            let dParam = this.handlerList["click"][this.keyWord].dParam
            callback.call(this, params, dParam)
        }
    }

    onClickGain(args) {
        let name = args.target.name

        if (this.controlDataTable[name] == null) {
            return
        }
        
        let index = this.controlDataTable[name]
        RpcProxy.call("C2G_GetOperateActivityPrize", this.actIndex, [index])
    }

    ////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    onClickCommon(params, defaultParam?) {
        let [flag, str] = CheckMainFrameFunction(params)
        if (flag == false) {                    //未开启
            MsgSystem.addTagTips(str)

            if (defaultParam != null) {
                ExecuteMainFrameFunction(defaultParam)
            }
            return
        }

        ExecuteMainFrameFunction(params)
    }

    ////////////////////////////////////////返回描述性文字/////////////////////////
    genActDes_CampBoss(index, params?) {                //关卡bossID
        let name = CampaignSystem.getInstance().getCampaignName(index)
        if (name == "") {
            return String.format(Localize_cns("OPENSERVER_TXT36"), "#nor--")
        } else {
            return String.format(Localize_cns("OPENSERVER_TXT36"), "#nor" + name)
        }
    }

    genActDes_Champion(index, params?) {                //竞技场排行
        //index 名次
        return String.format(Localize_cns("OPENSERVER_TXT36"), "#nor" + String.format(Localize_cns("OPENSERVER_TXT37"), index))
    }
    
    genActDes_Dragon(index, params?) {                //神龙宝藏
        //index 活动关卡索引
        if (GameConfig.CopyDragonConfig[index] != null) {
            return String.format(Localize_cns("OPENSERVER_TXT36"), "#nor" + String.format(Localize_cns("OPENSERVER_TXT38"), GameConfig.CopyDragonConfig[index].chapterName))
        } else {
            return String.format(Localize_cns("OPENSERVER_TXT36"), "#nor--")
        }
    }
    
    genActDes_DragonStar(index, params?) {                //神龙宝藏星数
        //index 星星数
        return String.format(Localize_cns("OPENSERVER_TXT36"), "#nor" + String.format(Localize_cns("OPENSERVER_TXT39"), index))
    }
    
    genActDes_Temple(index, params?) {                //小雷音寺
        //index 活动关卡索引
        if (GameConfig.CopyTempleConfig[index] != null) {
            return String.format(Localize_cns("OPENSERVER_TXT36"), "#nor" + String.format(Localize_cns("OPENSERVER_TXT40"), GameConfig.CopyTempleConfig[index].copyName))
        } else {
            return String.format(Localize_cns("OPENSERVER_TXT36"), "#nor--")
        }
    }
    
    genActDes_Heaven(index, params?) {                //天庭试炼
        //index 活动关卡索引
        if (GameConfig.CopyHeavenConfig[index] != null) {
            return String.format(Localize_cns("OPENSERVER_TXT36"), "#nor" + String.format(Localize_cns("OPENSERVER_TXT41"), GameConfig.CopyHeavenConfig[index].layerName))
        } else {
            return String.format(Localize_cns("OPENSERVER_TXT36"), "#nor--")
        }
    }
    
    genActDes_Materia(index, params?) {                //材料副本
        //index 挑战次数
        return String.format(Localize_cns("OPENSERVER_TXT36"), "#nor" + String.format(Localize_cns("OPENSERVER_TXT42"), index))
    }
    
    genActDes_XianLv(index, params?) {                //XianLv
        //index 总等阶
        return String.format(Localize_cns("OPENSERVER_TXT36"), "#nor" + String.format(Localize_cns("OPENSERVER_TXT43"), index))
    }
}