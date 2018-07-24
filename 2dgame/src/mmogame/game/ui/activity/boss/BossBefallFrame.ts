// TypeScript file
class BossBefallFrame extends BaseWnd {
    controlDataTable: any;
    scroll: UIScrollList;
    chapterIndex: number;
    curCheckIndex: number;                          //默认为0，表示当前章节的关卡的顺序序号，这里不是关卡的索引
    actorViewList:any;
    showState: number;                              //默认为0，1为显示记录状态
    mApplyRecordIndex: number;                      //是否要申请挑战记录，-1值时需要发申请

    static OPEN_ONEKEY_INDEX: number = 11

    public initObj(...params: any[]) {
        this.chapterIndex = 1
        this.curCheckIndex = -1
        this.showState = 0
        this.mApplyRecordIndex = -1
        this.mLayoutPaths = ["resource/layouts/boss/BossBefallLayout.exml", "resource/layouts/team/TeamGroupLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();
        this.setFullScreen(true)
        this.controlDataTable = {}

        this.actorViewList = {}

        let mElemInfo: any = [
             { ["index_type"]: gui.Button, ["name"]: "btn_close_top", ["title"]: null,  ["color"]: gui.Color.white, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
             { ["index_type"]: gui.Button, ["name"]: "btn_back", ["title"]: null,  ["color"]: gui.Color.white,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
             { ["index_type"]: gui.Button, ["name"]: "sweap_btn", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSweap },
             { ["index_type"]: gui.Button, ["name"]: "oneKey_sweap_btn", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickOnekeySweap },
             { ["index_type"]: gui.Button, ["name"]: "pre_btn",     ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPre },
             { ["index_type"]: gui.Button, ["name"]: "next_btn",    ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNext },
             { ["index_type"]: gui.Button, ["name"]: "jie_shop_btn",    ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickShop },
         ]
         UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this);
        
        this.mElemList["team_ctrl"] = UITeamGroup.newObj(this.mLayoutNode, this, this.mElemList["team_group"], this.mLayoutPaths[1], "team_com")
        this.mElemList["team_ctrl"].setJoinTeam(false)
        this.mElemList["team_ctrl"].setJoinRobot(false)
        
        let group = <eui.Group>this.mElemList["scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_HORIZON)

        for (let i = 0; i < 6; i++) {
            this.mElemList["rare_itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, "rare_itemBox" + i, 80 + 80 * i, 12, this.mElemList["item_group"])
        }
        this.mElemList["tips_rd"].setAlignFlag(gui.Flag.CENTER_CENTER);

        this.mElemList["link_record"] = UILinkView.newObj(this.mLayoutNode, "link_record", 0, 0, this.mElemList["link_group"])
        this.mElemList["link_record"].setContent(Localize_cns("BOSS_TXT76"))
        this.mElemList["link_record"].setCallBack(this.onClickRecord, this)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        //RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)

        this.mLayoutNode.visible = (true)
        // let ctrl = <UITeamGroup>this.mElemList["team_ctrl"]
        // ctrl.showWnd()
        this.applyActInfo()
    }

    public onHide(): void {
        //UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
        this.mLayoutNode.visible = (false)
        this.mElemList["team_ctrl"].hideWnd()
        this.clearActorView()
        // this.chapterIndex = 1
        this.curCheckIndex = -1
        this.showState = 0
        this.mApplyRecordIndex = -1
    }

    clearActorView(){
        for(let k in this.actorViewList){
            let view:UIActorView = this.actorViewList[k]
            view.clearView()
        }
        // this.actorViewList = {}
    }

    initItemWindow(window) {
		let name = window.name
        if (this.mElemList[name + "_bg"]) {
            return
        }
		let mElemInfo: any = [
			{ ["index_type"]: gui.Grid9Image,   ["name"]: name + "_bg",     ["title"]: null, ["font"]: null, ["image"]: "boss_bossDi02", ["autoScale"]:true, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 185, ["h"]: 311, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCard },

            { ["index_type"] : eui.Label,		["name"] : name +"_name",	["title"]: String.format(Localize_cns("BOSS_TXT33"), "一", 3),   		["font"] : "ht_22_cc",   ["color"] : gui.Color.ublack,		["x"] : 0,     ["y"] : 12,		["w"] : 185,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
			{ ["index_type"]: eui.Group,        ["name"]: name + "_iconGroup",["title"]: null, ["font"]: null,         ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 10, ["h"]: 10, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null, ["messageFlag"] : true, },
            { ["index_type"] : eui.Image,		["name"] : name +"_finish",	["image"]: "boss_text01",   		["font"] : "ht_22_lc",   ["color"] : gui.Color.ublack,		["x"] : 40,    ["y"] : 120,		["w"] : 0,["h"] : 0,	 ["fun_index"] : null, ["messageFlag"] : true,},
            { ["index_type"] : eui.Image,		["name"] : name +"_firstIcon",	["image"]: "bh_text04",   		["font"] : "ht_22_lc",   ["color"] : gui.Color.ublack,		["x"] : 14,    ["y"] : 200,		["w"] : 0,["h"] : 0,	 ["fun_index"] : null, ["messageFlag"] : true,},
            { ["index_type"] : eui.Label,		["name"] : name +"_cantFightTips",	["title"]: Localize_cns("BOSS_TXT47"),   ["font"] : "ht_20_cc_stroke",   ["color"] : gui.Color.lime,		["x"] : 0,     ["y"] : 210,		["w"] : 185,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
			{ ["index_type"] : eui.Label,		["name"] : name +"_staticPrizeTips",["title"]: Localize_cns("BOSS_TXT49"),   ["font"] : "ht_20_cc_stroke",   ["color"] : gui.Color.lime,		["x"] : 0,     ["y"] : 210,		["w"] : 185,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
			
            { ["index_type"] : gui.Button,      ["name"]: name + "_gain",   ["title"]: Localize_cns("BOSS_TXT34"), ["font"]: "ht_22_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 30, ["y"]: 230, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGain },
			// { ["index_type"] : gui.Button,      ["name"]: name + "_sweap",  ["title"]: Localize_cns("COPY_TXT7"), ["font"]: "ht_22_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 30, ["y"]: 230, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSweap },
			// { ["index_type"] : eui.Label,		["name"] : name +"_tips",	["title"]: Localize_cns("BOSS_TXT26"),   		["font"] : "ht_22_lc",          ["color"] : gui.Color.saddlebrown,		["x"] : 400, ["y"] : 15,		["w"] : 200,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
            { ["index_type"]: gui.Grid9Image,   ["name"]: name + "_check",  ["title"]: null, ["font"]: null, ["image"]: "ty_xuanZhongKuang01", ["autoScale"]:true, ["color"]: gui.Color.white, ["x"]: -18, ["y"]: -15, ["w"]: 215, ["h"]: 340, ["messageFlag"] : true, },
			
		]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
		//ui_util.CreateDrawRectPtr(this.mElemList[name +"_dec"], gui.Color32Half.green)
		//AddRdContent(this.mElemList[name + "_dec"], Localize_cns("CHAT_ERROE_JINYAN"), "ht_20_cc", "zongse")
        this.actorViewList[name + "_icon"] = UIActorView.newObj(this.mLayoutNode, name + "_icon", 90, 200, this.mElemList[name + "_iconGroup"])
        //this.mElemList[name + "_icon"].updateByPlayer(20001)

        //[0] [1]为首通奖励  [2]为领取宝箱后固定显示
        let posList = [30, 100, 65]
        for (let i = 0; i < 3; i++) {
            let x = posList[i]
            this.mElemList[name + "_item" + i] = UIItemBox.newObj(this.mLayoutNode, name + "_item" + i, x, 235, window, 0.7)
        }
	}

  

	refreshItemWindow(window, config, index) {
		let name = window.name
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.LifeAndDeathBoss)
        // {
        //         maxIndex: 历史最大进度
        //         remainCount: 剩余帮助次数,
        //         prizeRecord: {[bossIndex]:value (0x1领取了战斗 0x2领取了宝箱奖励)}   opLifeAndDeathPrizeValueConfig
        // }
        let maxIndex = -1
        let prizeRecord = {}
        let remainCount = 0
        if (actInfo && actInfo.prizeRecord) {
            maxIndex = actInfo.maxIndex
            prizeRecord = actInfo.prizeRecord
            remainCount = actInfo.remainCount
        }

        for (let i = 0; i < 3; i++) {
            this.mElemList[name + "_item" + i].setVisible(false)
        }
        this.mElemList[name + "_finish"].visible = false
        this.mElemList[name + "_gain"].visible = false
        this.mElemList[name + "_staticPrizeTips"].visible = false
        this.mElemList[name + "_firstIcon"].visible = false
        this.mElemList[name + "_cantFightTips"].visible = false

        this.mElemList[name + "_name"].text = config.read
        //模型
        let monsterModelId = GetMonsterModel(config.entryId)
        this.actorViewList[name + "_icon"].updateByPlayer(monsterModelId)
        let value = prizeRecord["-" + config.index]
        if (config.index == maxIndex + 1) {                                                                                         //当前关（历史上未通过）
            this.mElemList[name + "_firstIcon"].visible = true
            if (this.curCheckIndex < 0) {
                this.curCheckIndex = index
            }

            let list = AnalyPrizeFormat(config.firstItemShow || [])
            for (let i = 0; i < 2; i++) {
                let [entryId, count] = list[i]
                this.mElemList[name + "_item" + i].setVisible(true)
                this.mElemList[name + "_item" + i].updateByEntry(entryId, count)
            }
        } else if (config.index <= maxIndex) {
            if ((value & opLifeAndDeathPrizeValueConfig.fightPrize) == opLifeAndDeathPrizeValueConfig.fightPrize) {                 //当天已打胜过，已领取战胜的奖励
                this.mElemList[name + "_finish"].visible = true

                if ((value & opLifeAndDeathPrizeValueConfig.boxPrize) != opLifeAndDeathPrizeValueConfig.boxPrize) {                 //历史已通关，可领宝箱
                    this.mElemList[name + "_gain"].visible = true
                    this.controlDataTable[name + "_gain"] = config
                } else {
                    let list = AnalyPrizeFormat(config.afterBoxItemShow || [])
                    let [entryId, count] = list[0]
                    this.mElemList[name + "_item2"].setVisible(true)
                    this.mElemList[name + "_item2"].updateByEntry(entryId, count)
                }
            } else {                                                                                                                //当天没打过，没扫荡
                this.mElemList[name + "_staticPrizeTips"].visible = true
                let list = AnalyPrizeFormat(config.afterBoxItemShow || [])
                let [entryId, count] = list[0]
                this.mElemList[name + "_item2"].setVisible(true)
                this.mElemList[name + "_item2"].updateByEntry(entryId, count)

                this.controlDataTable[name + "_sweap"] = true                           //用于refreshCheckCard，表示可以扫荡操作
            }
        } else {
            this.mElemList[name + "_cantFightTips"].visible = true
            let list = AnalyPrizeFormat(config.firstItemShow || [])
            for (let i = 0; i < 2; i++) {
                let [entryId, count] = list[i]
                this.mElemList[name + "_item" + i].setVisible(true)
                this.mElemList[name + "_item" + i].updateByEntry(entryId, count)
            }
            this.controlDataTable[name + "_cannotFight"] = true                           //用于refreshCheckCard，表示可以不能打
        }

        this.controlDataTable["bossCardList"] = checkNull(this.controlDataTable["bossCardList"], [])
        table_insert(this.controlDataTable["bossCardList"], [window, config])
        this.controlDataTable[name + "_bg"] = this.controlDataTable["bossCardList"].length - 1
        // AnalyPrizeFormat

        if (index == 0) {
            AddRdContent(this.mElemList["tips_rd"], String.format(Localize_cns("BOSS_TXT50"), remainCount, 10), "ht_18_cc", "ublack", 5)
        }
	}

    onRefresh() {
        let list = []
        for (let _ in GameConfig.BossBefallConfig) {
            let v = GameConfig.BossBefallConfig[_]
            if (v.chapterIndex == this.chapterIndex) {
                table_insert(list, v)
            }
        }
        table_sort(list, function(a, b) {return a["index"] - b["index"]})

        let group = <eui.Group>this.mElemList["scroll_group"]
        let scroll = this.scroll
		scroll.clearItemList();
        this.clearActorView()
		this.controlDataTable = {}
		let hasNum = list.length
		for (let k = 0; k < list.length; k++) {
			let v = list[k]
            let [window, flag] = scroll.getItemWindow(k, 185, group.height, 50, 5, 3)

            if (flag == true) {
			    this.initItemWindow(window)
            }
			this.refreshItemWindow(window, v, k)
		}
        //章节标题
        this.mElemList["label_wndName"].text = ""
        let config = list[0]
        if (config) {
            this.mElemList["label_wndName"].text = config.chapterName
        }

        this.refreshCheckCard()
    }

    refreshCheckCard() {
        if (this.showState && this.showState > 0) {
            let ctrl = <UITeamGroup>this.mElemList["team_ctrl"]
            ctrl.hideWnd()

            this.mElemList["sweap_group"].visible = false
            this.mElemList["record_group"].visible = true
            this.refreshRecord()
        } else {
            this.mElemList["record_group"].visible = false
            this.onRefreshCheckCard()
        }
    }

    refreshRecord() {
        if (!this.controlDataTable["bossCardList"]) {
            return
        }

        this.curCheckIndex = this.curCheckIndex % this.controlDataTable["bossCardList"].length
        if (this.curCheckIndex < 0) {
            this.curCheckIndex = 0
        }

        let [_, c] = this.controlDataTable["bossCardList"][this.curCheckIndex]
        let checkBossIndex = c.index

        //记录数据
        let recordInfo = GetActivity(ActivityDefine.Boss).getActBossInfo(OrdinaryActivityIndex.LifeAndDeathBoss, checkBossIndex) || {}
        //{
        //      firstServerData=[[prlId, name, force, time, round], [prlId1, name1, force1, time, round1]],
        //      roundData=[[prlId, name, force, time, round], [prlId1, name1, force1, time, round1]],
        // }
        this.refreshRecordText(recordInfo.firstServerData || [], 0)
        this.refreshRecordText(recordInfo.roundData || [], 1)

        //关卡信息
        let config = null
        let wName = ""
        for (let i = 0; i < this.controlDataTable["bossCardList"].length; i++) {
            let [window, v] = this.controlDataTable["bossCardList"][i]
            let name = window.name

            if (i == this.curCheckIndex) {
                this.mElemList[name + "_check"].visible = true
            } else {
                this.mElemList[name + "_check"].visible = false
            }

            if (v.index == checkBossIndex) {
                config = v
                wName = name
            }
        }
        //
        if (!config) {
            return
        }
        let list = AnalyPrizeFormat(config.itemShow || [])
        for (let i = 0; i < 6; i++) {
            if (list[i]) {
                this.mElemList["rare_itemBox" + i].setVisible(true)

                let [entryId, count] = list[i]
                this.mElemList["rare_itemBox" + i].updateByEntry(entryId, count)
            } else {
                this.mElemList["rare_itemBox" + i].setVisible(false)
            }
        }
        this.mElemList["cur_name"].text = config.read

        //申请记录
        if (this.mApplyRecordIndex < 0) {
            this.mApplyRecordIndex = checkBossIndex
            RpcProxy.call("C2G_GetBossIndexData", OrdinaryActivityIndex.LifeAndDeathBoss, checkBossIndex)
        }
    }

    refreshRecordText(record, index) {
        let memberTxt = null
        let roundTxt = null
        let timeTxt = null

        for (let i = 0; i < record.length; i++) {
            // [prlId, name, force, time, round1]
            let v = record[i]
            if (memberTxt != null) {
                memberTxt = memberTxt + Localize_cns("DUNHAO")
            }
            memberTxt = (memberTxt || "") + v[1]

            if (roundTxt == null) {
                roundTxt = String.format(Localize_cns("BOSS_TXT75"), v[4])
            }
            if (timeTxt == null) {
                timeTxt = getFormatTimeEx(v[3])
            }
        }

        this.mElemList["record_team" + index].text = memberTxt || ""
        this.mElemList["record_round" + index].text = roundTxt || ""
        this.mElemList["record_time" + index].text = timeTxt || ""
    }

    onRefreshCheckCard() {
        if (!this.controlDataTable["bossCardList"]) {
            return
        }

        this.curCheckIndex = this.curCheckIndex % this.controlDataTable["bossCardList"].length
        if (this.curCheckIndex < 0) {
            this.curCheckIndex = 0
        }

        let [_, c] = this.controlDataTable["bossCardList"][this.curCheckIndex]
        let checkBossIndex = c.index

        let ctrl = <UITeamGroup>this.mElemList["team_ctrl"]
        if (TeamIsState(OrdinaryActivityIndex.LifeAndDeathBoss) == true) {                      //组队中不刷新
            let info = TeamSystem.getInstance().getTeamActData()
            checkBossIndex = info[1]
        }

        let config = null
        let wName = ""
        for (let i = 0; i < this.controlDataTable["bossCardList"].length; i++) {
            let [window, v] = this.controlDataTable["bossCardList"][i]
            let name = window.name

            if (i == this.curCheckIndex) {
                this.mElemList[name + "_check"].visible = true
            } else {
                this.mElemList[name + "_check"].visible = false
            }

            if (v.index == checkBossIndex) {
                config = v
                wName = name
            }
        }
        //
        if (!config) {
            return
        }

        if (this.controlDataTable[wName + "_sweap"]) {
            this.mElemList["sweap_group"].visible = true
            ctrl.hideWnd()

            this.controlDataTable["sweap_btn"] = config
            this.controlDataTable["oneKey_sweap_btn"] = config
        } else {
            this.mElemList["sweap_group"].visible = false
            ctrl.showWnd()
            ctrl.setTeamActivityData([OrdinaryActivityIndex.LifeAndDeathBoss, config.index])
            ctrl.setHandler(UITeamGroup.CHECK_QUICK_JOIN, this.checkCardFight, this, [this.controlDataTable[wName + "_cannotFight"], config])
            ctrl.setHandler(UITeamGroup.CHECK_CREATE_TEAM, this.checkCardFight, this, [this.controlDataTable[wName + "_cannotFight"], config])
        }

        let list = AnalyPrizeFormat(config.itemShow || [])
        for (let i = 0; i < 6; i++) {
            if (list[i]) {
                this.mElemList["rare_itemBox" + i].setVisible(true)

                let [entryId, count] = list[i]
                this.mElemList["rare_itemBox" + i].updateByEntry(entryId, count)
            } else {
                this.mElemList["rare_itemBox" + i].setVisible(false)
            }
        }
        this.mElemList["cur_name"].text = config.read
    }

    checkCardFight(param) {                      //flag是否不能打
        let [flag, config] = param
        if (flag == true) {
            MsgSystem.addTagTips(Localize_cns("BOSS_TXT51"))
            return false
        } else {
            if (GetHeroProperty("level") < config.level) {                  //等级不足
                MsgSystem.addTagTips(String.format(Localize_cns("BOSS_TXT52"), config.level))
                return false
            }
        }

        return true
    }

    applyActInfo() {
        RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.LifeAndDeathBoss)
    }

    updateWnd() {
        this.onRefresh()
        this.scroll.moveToScrollIndex(this.curCheckIndex, false)
    }

    updateFightRecord() {
        if (this.showState && this.showState > 0) {
            this.refreshRecord()
        }
    }

     //////////////////////////////////////////
	onClickGain(args) {
        let name = args.target.name
        if (this.controlDataTable[name] == null) {
            return
        }

        let config = this.controlDataTable[name]
        let list = AnalyPrizeFormat(config.boxShow || [])

        let callBack = function(config) {
            if (GetHeroMoney(opItemUnit.CURRENCY) < config.bindCurrency) {
                let formatStr = Localize_cns(ItemUnitName[opItemUnit.CURRENCY])
                MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
                ExecuteMainFrameFunction("chongzhi")
                return
            }
		    RpcProxy.call("C2G_GetActivityStagePrize", OrdinaryActivityIndex.LifeAndDeathBoss, [config.index])
        }

        let wnd = WngMrg.getInstance().getWindow("ItemBoxPreviewFrame")
        wnd.showPreviewFrame(list, opItemUnit.CURRENCY, config.bindCurrency, callBack, this, config)
	}

    onClickSweap(args) {
        if (CheckActivityState() == false) {
            return
        }
        
        if (CheckFightState() == true) {
            return
        }
        
        if (CheckBeiBaoEquipWillFull()) {
            return
        }

        let name = args.target.name
        if (this.controlDataTable[name] == null) {
            return
        }

        let config = this.controlDataTable[name]
        let index = config.index
		RpcProxy.call("C2G_SweepBossActivity", OrdinaryActivityIndex.LifeAndDeathBoss, index)
    }

    onClickOnekeySweap(args) {
        if (CheckActivityState() == false) {
            return
        }
        
        if (CheckFightState() == true) {
            return
        }
        
        if (CheckBeiBaoEquipWillFull()) {
            return
        }
        
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.LifeAndDeathBoss)
        // {
        //         maxIndex: 历史最大进度
        //         remainCount: 剩余帮助次数,
        //         prizeRecord: {[bossIndex]:value (0x1领取了战斗 0x2领取了宝箱奖励)}   opLifeAndDeathPrizeValueConfig
        // }
        let maxIndex = -1
        if (actInfo && actInfo.prizeRecord) {
            maxIndex = actInfo.maxIndex
        }
        if (maxIndex < BossBefallFrame.OPEN_ONEKEY_INDEX) {
            MsgSystem.addTagTips(Localize_cns("BOSS_TXT62"))
            return
        }

        RpcProxy.call("C2G_SweepBossActivityEx", OrdinaryActivityIndex.LifeAndDeathBoss, [])
    }

    onClickCard(args) {
        let name = args.target.name
        if (this.controlDataTable[name] == null) {
            return
        }

        let index = this.controlDataTable[name]
        if (index == this.curCheckIndex) {
            return
        }
        this.curCheckIndex = index
        this.mApplyRecordIndex = -1
        this.refreshCheckCard()
    }

    onClickPre(args) {
        this.scroll.moveRelativeItemWindow(-3, true)
    }

    onClickNext(args) {
        this.scroll.moveRelativeItemWindow(3, true)
    }

    onClickShop(args){
        let wnd : ShopFunFrame = WngMrg.getInstance().getWindow("ShopFunFrame")
        wnd.onShowWnd(ShopSystem.SHOP_DELINE)
    }

    onClickRecord(args) {
        if (!this.showState) {
            this.showState = 1
            this.refreshCheckCard()
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    setChapter(chapterIndex) {
        this.chapterIndex = chapterIndex
    }

    setCampChapter(index) {                         //通过指定关卡索引确定章节和checkIndex
        if (GameConfig.BossBefallConfig[index] == null) {
            return
        }

        this.chapterIndex = GameConfig.BossBefallConfig[index].chapterIndex
        let list = []
        for (let _ in GameConfig.BossBefallConfig) {
            let v = GameConfig.BossBefallConfig[_]
            if (v.chapterIndex == this.chapterIndex) {
                table_insert(list, v)
            }
        }
        table_sort(list, function(a, b) {return a.index - b.index})
        this.curCheckIndex = tonumber(table_getIndex(list, GameConfig.BossBefallConfig[index]))
    }

    showWithChapter(chapterIndex) {
        this.setChapter(chapterIndex)
        this.showWnd()
        // this.doCommand("setChapter", chapterIndex)
    }

    showWidthCampId(index) {
        this.setCampChapter(index)
        this.showWnd()
        // this.doCommand("setCampChapter", index)
    }

    showFrameState(chapterIndex, state) {                 //0或1
        this.setChapter(chapterIndex)
        this.showState = state

        this.showWnd()
    }
}