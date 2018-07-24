class GlobalTeamWindow extends BaseCtrlWnd {
    controlDataTable: any;
    chapterIndex: number;
    curCheckIndex: number;
    actorViewList:any;
    sRefreshCount: number;

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.curCheckIndex = -1
        this.actorViewList = {}
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        let mElemInfo: any = [

             { ["name"]: "kfzd_left_count", ["title"]: Localize_cns("GLOBAL_TXT3") },
             { ["index_type"]: gui.Button, ["name"]: "kfzd_pre_btn",     ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPre },
             { ["index_type"]: gui.Button, ["name"]: "kfzd_next_btn",    ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNext },
             { ["name"]: "kfzd_prize_tips", ["messageFlag"]: true, },
         ]
         UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this);
        
        this.mElemList["team_ctrl"] = UITeamGroup.newObj(this.mLayoutNode, this, this.mElemList["kfzd_team_group"], this.mParentWnd.mLayoutPaths[1], "team_com")
        
        let list: eui.List = this.mElemList["kfzd_list"]
        list.itemRenderer = itemRender.GlobalTeamListItem
        list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemTapHandler, this);

        for (let i = 0; i < 6; i++) {
            this.mElemList["kfzd_rare_itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, "kfzd_rare_itemBox" + i, 80 + 80 * i, 12, this.mElemList["kfzd_item_group"])
        }
        // this.mElemList["tips_rd"].setAlignFlag(gui.Flag.CENTER_CENTER);
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        //RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)

        this.mElemList["kfzd_group"].visible = true
        this.mElemList["label_wndName"].text = Localize_cns("GLOBAL_TXT2")

        this.sRefreshCount = -1                             //记录数据更新-刷新 次数

        this.refreshFrame()
        this.applyActInfo()

        this.scrollToIndex(this.curCheckIndex)
    }

    public onHide(): void {
        //UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
        this.mElemList["kfzd_group"].visible = false
        this.mElemList["team_ctrl"].hideWnd()
        this.clearActorView()
        this.curCheckIndex = -1
    }

    clearActorView(){
        for(let k in this.actorViewList){
            let view:UIActorView = this.actorViewList[k]
            view.clearView()
        }
        this.actorViewList = {}
    }

    refreshFrame() {
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.ServerTeam)
        // {
        //         remainCount: 剩余收益次数,
        //         npcIndexList: {[npcIndex]:1
        // }
        let npcIndexList = {}
        if (actInfo && actInfo.npcIndexList) {
            npcIndexList = actInfo.npcIndexList
        }

        let list = []
        let maxLevel = 0
        for (let _ in GameConfig.GlobalTeamConfig) {
            let v = GameConfig.GlobalTeamConfig[_]
            table_insert(list, [this, v])
        }
        table_sort(list, function(a, b) {return a[1]["index"] - b[1]["index"]})
        if (this.curCheckIndex < 0) {
            let passedMaxIndex = 0

            for (let i = 0; i < list.length; i++) {
                let v = list[i][1]

                //找出最高可挑战等级
                if (v.level > maxLevel) {
                    if (this.sRefreshCount < 0) {
                        if (v.level <= GetHeroProperty("level")) {
                            if (npcIndexList[v.index] != 1) {                       //未挑战过
                                maxLevel = v.level
                                this.curCheckIndex = i
                            }

                            passedMaxIndex = i
                        }
                    }
                }
            }

            if (this.curCheckIndex < 0) {
                this.curCheckIndex = passedMaxIndex
            }
        }
        // let list = [1, 1, 1, 1, ,1 ,1 ,1 ,1 ,1 ,1]
        this.clearActorView()
		this.controlDataTable = {}
        let eList: eui.List = this.mElemList["kfzd_list"]
        UiUtil.updateList(eList, list);
        eList.selectedIndex = this.curCheckIndex

        this.refreshCheckCard()
    }

    refreshCheckCard() {
        let eList: eui.List = this.mElemList["kfzd_list"]
        // if (!this.controlDataTable["bossCardList"]) {
        //     return
        // }

        // this.curCheckIndex = this.curCheckIndex % this.controlDataTable["bossCardList"].length
        let [_, config] = eList.selectedItem
        let flag = false

        let ctrl = <UITeamGroup>this.mElemList["team_ctrl"]
        if (TeamIsState(OrdinaryActivityIndex.ServerTeam) == true) {                      //组队中不刷新
            let info = TeamSystem.getInstance().getTeamActData()
            flag = config.index != info[1]
        }

        //
        if (flag == true) {
            return
        }

        ctrl.showWnd()
        ctrl.setTeamActivityData([OrdinaryActivityIndex.ServerTeam, config.index])
        ctrl.setHandler(UITeamGroup.CHECK_QUICK_JOIN, this.checkCardFight, this, [config.level > GetHeroProperty("level"), config])
        ctrl.setHandler(UITeamGroup.CHECK_CREATE_TEAM, this.checkCardFight, this, [config.level > GetHeroProperty("level"), config])

        let list = AnalyPrizeFormat(config.itemShow || [])
        for (let i = 0; i < 6; i++) {
            if (list[i]) {
                this.mElemList["kfzd_rare_itemBox" + i].setVisible(true)

                let [entryId, count, quality, addNum] = list[i]
                this.mElemList["kfzd_rare_itemBox" + i].updateByEntry(entryId, count, quality, addNum)
            } else {
                this.mElemList["kfzd_rare_itemBox" + i].setVisible(false)
            }
        }
        this.mElemList["kfzd_cur_name"].text = config.read
    }

    applyActInfo() {
        RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.ServerTeam)
    }

    scrollToIndex(index) {
        let viewport = this.mElemList["kfzd_scroll"].viewport
        viewport.validateNow();

        this.mElemList["kfzd_scroll"].scrollToXY(index * 197, 0, false)
    }
    
    updateWnd() {
        this.refreshFrame()
        
        if (this.sRefreshCount < 0) {
            this.sRefreshCount = this.sRefreshCount + 1
        }
    }
    ///////////////////////////////////////////////////////////

    checkCardFight(param) {                      //flag是否不能打
        let [flag, config] = param
        if (flag == true) {
            MsgSystem.addTagTips(String.format(Localize_cns("GLOBAL_TXT4"), config.level))
            return false
        }

        return true
    }

     //////////////////////////////////////////
    onClickPre(args) {
        let viewport = this.mElemList["kfzd_scroll"].viewport
        viewport.validateNow();

        this.mElemList["kfzd_scroll"].scrollToXY(viewport.scrollH - 300, 0, true)
    }

    onClickNext(args) {
        let viewport = this.mElemList["kfzd_scroll"].viewport
        viewport.validateNow();

        this.mElemList["kfzd_scroll"].scrollToXY(viewport.scrollH + 300, 0, true)
    }

    onItemTapHandler(args) {
        let list: eui.List = args.target
        let rendererList = list.$children || []
        for (let k in rendererList) {
            let v = <any>rendererList[k]
            v.mElemList["_check"].visible = false
        }
        let v = <any>list.$indexToRenderer[list.selectedIndex]
        v.mElemList["_check"].visible = true

        this.refreshCheckCard()
    }
    //////////////////////////////////////////////////////////////////////////////
    updateTabWnd(index) {
        if (GameConfig.GlobalTeamConfig[index] == null) {
            return
        }
        
        let list = []
        for (let _ in GameConfig.GlobalTeamConfig) {
            let v = GameConfig.GlobalTeamConfig[_]
            table_insert(list, v)
        }
        table_sort(list, function(a, b) {return a["index"] - b["index"]})
        this.curCheckIndex = tonumber(table_getIndex(list, GameConfig.GlobalTeamConfig[index]))
        this.refreshFrame()
        this.scrollToIndex(this.curCheckIndex)
        // this.doCommand("setCampChapter", index)
    }
}

module itemRender {
    export class GlobalTeamListItem extends eui.ItemRenderer {
        mElemList: any;
        controlDataTable: any;

        constructor() {
            super();
            this.mElemList = {}
            this.controlDataTable = {}
            let w = 185
            let h = 320

            let mElemInfo: any = [
                { ["index_type"]: gui.Grid9Image,   ["name"]: "_bg",     ["title"]: null, ["font"]: null, ["image"]: "boss_bossDi02", ["autoScale"]:true, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 185, ["h"]: 311, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCard, ["messageFlag"] : true},

                { ["index_type"] : eui.Label,		["name"] : "_name",	["title"]: String.format(Localize_cns("BOSS_TXT33"), "一", 3),   		["font"] : "ht_22_cc",   ["color"] : gui.Color.ublack,		["x"] : 0,     ["y"] : 12,		["w"] : 185,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"]: eui.Group,        ["name"]: "_iconGroup",["title"]: null, ["font"]: null,         ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 10, ["h"]: 10, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null, ["messageFlag"] : true, },
                // { ["index_type"] : eui.Image,		["name"] : "_finish",	["image"]: "boss_text01",   		["font"] : "ht_22_lc",   ["color"] : gui.Color.ublack,		["x"] : 40,    ["y"] : 120,		["w"] : 0,["h"] : 0,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"] : eui.Image,		["name"] : "_firstIcon",	["image"]: "bh_text04",   		["font"] : "ht_22_lc",   ["color"] : gui.Color.ublack,		["x"] : 14,    ["y"] : 200,		["w"] : 0,["h"] : 0,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"] : eui.Label,		["name"] : "_cantFightTips",	["title"]: Localize_cns("GLOBAL_TXT4"),   ["font"] : "ht_20_cc_stroke",   ["color"] : gui.Color.red,		["x"] : 0,     ["y"] : 210,		["w"] : 185,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"] : eui.Label,		["name"] : "_staticPrizeTips",["title"]: Localize_cns("BOSS_TXT49"),   ["font"] : "ht_20_cc_stroke",   ["color"] : gui.Color.lime,		["x"] : 0,     ["y"] : 210,		["w"] : 185,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                
                // { ["index_type"] : gui.Button,      ["name"]: "_gain",   ["title"]: Localize_cns("BOSS_TXT34"), ["font"]: "ht_22_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 30, ["y"]: 230, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGain },
                // { ["index_type"] : gui.Button,      ["name"]: "_sweap",  ["title"]: Localize_cns("COPY_TXT7"), ["font"]: "ht_22_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 30, ["y"]: 230, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSweap },
                // { ["index_type"] : eui.Label,		["name"] : "_tips",	["title"]: Localize_cns("BOSS_TXT26"),   		["font"] : "ht_22_lc",          ["color"] : gui.Color.saddlebrown,		["x"] : 400, ["y"] : 15,		["w"] : 200,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"]: gui.Grid9Image,   ["name"]: "_check",  ["title"]: null, ["font"]: null, ["image"]: "ty_xuanZhongKuang01", ["autoScale"]:true, ["color"]: gui.Color.white, ["x"]: -18, ["y"]: -15, ["w"]: 215, ["h"]: 340, ["messageFlag"] : true, },
                
            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)
            //ui_util.CreateDrawRectPtr(this.mElemList[name +"_dec"], gui.Color32Half.green)
            //AddRdContent(this.mElemList["_dec"], Localize_cns("CHAT_ERROE_JINYAN"), "ht_20_cc", "zongse")
            this.mElemList["monViewer"] = UIActorView.newObj(this, "monViewer", 90, 200, this.mElemList["_iconGroup"])
            this.mElemList["monViewer"].setTouchEnable(false)
            this.addEventListener("touchTap", this.onClickCard, this)
            //this.mElemList["_icon"].updateByPlayer(20001)

            //[0] [1]为首通奖励  通关奖励（重复挑战）
            let posList = [30, 100]
            for (let i = 0; i < 2; i++) {
                let x = posList[i]
                this.mElemList["_item" + i] = UIItemBox.newObj(this, "_item" + i, x, 235, null, 0.7)
            }
        }

        protected dataChanged(): void {
            let name = this.hashCode
            let self = this.data[0]
            let config = this.data[1]

            //wndbase
            if (self.actorViewList[name] == null) {
                self.actorViewList[name] = this.mElemList["monViewer"]
            }

            let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.ServerTeam)
            // {
            //         remainCount: 剩余收益次数,
            //         npcIndexList: {[npcIndex]:1
            // }
            let npcIndexList = {}
            let remainCount = 0
            if (actInfo && actInfo.npcIndexList) {
                npcIndexList = actInfo.npcIndexList
                remainCount = actInfo.remainCount
            }
            this.controlDataTable = {}

            for (let i = 0; i < 2; i++) {
                this.mElemList["_item" + i].setVisible(false)
            }
            // this.mElemList["_finish"].visible = false
            // this.mElemList["_gain"].visible = false
            this.mElemList["_staticPrizeTips"].visible = false
            this.mElemList["_firstIcon"].visible = false
            this.mElemList["_cantFightTips"].visible = false

            this.mElemList["_name"].text = config.read
            //模型
            let monsterModelId = GetMonsterModel(config.entryId)
            this.mElemList["monViewer"].updateByPlayer(monsterModelId)

            //状态分析
            if (config.level > GetHeroProperty("level")) {                              //未开启
                this.mElemList["_cantFightTips"].visible = true
                this.mElemList["_cantFightTips"].text = String.format(Localize_cns("GLOBAL_TXT4"), config.level)
                let list = AnalyPrizeFormat(config.firstItemShow || [])
                for (let i = 0; i < 2; i++) {
                    if (list[i]) {
                        let [entryId, count] = list[i]
                        this.mElemList["_item" + i].setVisible(true)
                        this.mElemList["_item" + i].updateByEntry(entryId, count)
                    }
                }

            } else if (npcIndexList[config.index]) {                                      //已通过（历史）
                this.mElemList["_staticPrizeTips"].visible = true

                let list = AnalyPrizeFormat(config.fixedItemShow || [])
                for (let i = 0; i < 2; i++) {
                    if (list[i]) {
                        let [entryId, count] = list[i]
                        this.mElemList["_item" + i].setVisible(true)
                        this.mElemList["_item" + i].updateByEntry(entryId, count)
                    }
                }
            } else {                                                                    //未首通
                this.mElemList["_firstIcon"].visible = true

                let list = AnalyPrizeFormat(config.firstItemShow || [])
                for (let i = 0; i < 2; i++) {
                    if (list[i]) {
                        let [entryId, count] = list[i]
                        this.mElemList["_item" + i].setVisible(true)
                        this.mElemList["_item" + i].updateByEntry(entryId, count)
                    }
                }
            }

            self.controlDataTable["bossCardList"] = checkNull(self.controlDataTable["bossCardList"], [])
            let indexKey = null
            for (let k in self.controlDataTable["bossCardList"]) {
                let v = self.controlDataTable["bossCardList"][k]
                if (v[0] == this) {
                    self.controlDataTable["bossCardList"][k] = [this, config]
                    indexKey = tonumber(k)
                    break
                }
            }
            if (indexKey == null) {
                table_insert(self.controlDataTable["bossCardList"], [this, config])
                this.controlDataTable[name] = self.controlDataTable["bossCardList"].length - 1
            } else {
                this.controlDataTable[name] = indexKey
            }
            
            // AnalyPrizeFormat

            self.mElemList["kfzd_left_counter"].text = remainCount + "/" + opBossActivityConfig[OrdinaryActivityIndex.ServerTeam].defaultRemainCount
            self.refreshCheckCard()

            let euiList: eui.List = <eui.List>this.parent
            this.mElemList["_check"].visible = euiList.$indexToRenderer[euiList.selectedIndex] == this
        }
        ////////////////////////////////////////////////////////////////////////////////////
        onClickCard(args) {
            let name = args.target.hashCode
            if (this.controlDataTable[name] == null) {
                return
            }

            let self = this.data[0]
            let index = this.controlDataTable[name]
            if (index == self.curCheckIndex) {
                return
            }
            self.curCheckIndex = index
            self.refreshCheckCard()
        }

        onClickRule(args) {
            let wnd  = WngMrg.getInstance().getWindow("RuleDescribeFrame")
            wnd.showWithActivity("globalTeamRule")
        }
    }
}