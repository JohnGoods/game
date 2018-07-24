class BossWildWindow extends BaseCtrlWnd {
    controlDataTable: any;
    actorViewList:any;
    dotTipsButton: any;

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.actorViewList = {}
        this.dotTipsButton = []
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        // var elemInfo = [
        //     { ["name"]: "ug_pokedex_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPokedex }, //图鉴
        //     { ["name"]: "ug_force_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickForceBtn },
        //     { ["name"]: "ug_btn_show", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickShow },
        //     { ["name"]: "ug_btn_embattle", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickEmbattle },
        //     { ["name"]: "ug_btn_natural", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNatural },
        //     { ["name"]: "ug_btn_changename", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickChangeName },
        //     { ["name"]: "up_add_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAddition },
        //     { ["name"]: "upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickUpgrade },
        //     { ["name"]: "auto_upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAutoUpgrade }, //自动升级
        //     { ["name"]: "active_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickActive },
        // ];

        // UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        let list: eui.List = this.mElemList["yewai_list"]
        list.itemRenderer = itemRender.BossWildListItem
        
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        // RegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        // RegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["yewai_group"].visible = true
        this.mElemList["label_wndName"].text = Localize_cns("BOSS_TXT16")

        this.applyActInfo()
        //this.refreshFrame()
    }

    public onHide(): void {
        // UnRegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        // UnRegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["yewai_group"].visible = false
        this.clearActorView()
    }

    clearActorView(){
        for(let k in this.actorViewList){
            let view:UIActorView = this.actorViewList[k]
            view.clearView()
        }
        this.actorViewList = {}
    }
    
    refreshFrame() {
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.WildBoss)
        // {
        //         npcList: {[npcIndex]:[refreshTime, status]},         [下次刷新的时间戳，opBossActivityConfig[OrdinaryActivityIndex.WildBoss]]
        // }
        let npcList = {}
        if (actInfo && actInfo.npcList) {
            npcList = actInfo.npcList
        }

        let list = []//[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ,1 ]
        let notOpenList = []
        let finishList = []
        let heroLevel = GetHeroProperty("level")
        for (let k in GameConfig.BossWildConfig){
            let v = GameConfig.BossWildConfig[k]
            if (heroLevel >= v.level) {
                let bossConfig = npcList[v.index]
                if (bossConfig != null && bossConfig[1] == opBossActivityConfig[OrdinaryActivityIndex.WildBoss].killStatus) {                       //已击杀
                    table_insert(finishList, [this, v])
                } else {
                    table_insert(list, [this, v])
                }
            } else {
                table_insert(notOpenList, [this, v])
            }
            
        }
        table_sort(list, function(a, b) {return b[1].level - a[1].level})
        table_sort(notOpenList, function(a, b) {return b[1].level - a[1].level})
        table_sort(finishList, function(a, b) {return b[1].level - a[1].level})
        table_merge(list, notOpenList)
        table_merge(list, finishList)

        this.dotTipsButton = []
        this.clearActorView()
        let eList: eui.List = this.mElemList["yewai_list"]
        UiUtil.updateList(eList, list);
    }

    applyActInfo() {
        RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.WildBoss)
    }

    refreshDotTipsImp() {
        for (let k in this.dotTipsButton) {
            let wnd = this.dotTipsButton[k]
            this.mParentWnd.createDotTipsUI(wnd, true)
        }
    }

    updateWnd() {
        this.refreshFrame()
    }
}

module itemRender {
    export class BossWildListItem extends eui.ItemRenderer {
        mElemList: any;
        controlDataTable: any;

        constructor() {
            super();
            this.mElemList = {}
            this.controlDataTable = {}
            let w = 558
            let h = 210

            let mElemInfo: any = [
                { ["index_type"]: gui.Grid9Image,   ["name"]: "_bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["autoScale"]:true, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Image,        ["name"]: "_iconbg",   ["title"]: null, ["font"]: null, ["image"]: "boss_bossDi01",        ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 40, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Group,        ["name"]: "_iconGroup",["title"]: null, ["font"]: null,         ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 10, ["h"]: 10, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Group,        ["name"]: "link_group",   ["title"]: null, ["font"]: null,      ["color"]: gui.Color.white, ["x"]: 180, ["y"]: 160, ["w"]: 240, ["h"]: 30, },
                { ["index_type"]: eui.Image,        ["name"]: "_refreshed",   ["title"]: null, ["font"]: null, ["image"]: "boss_text04",        ["color"]: gui.Color.white, ["x"]: 60, ["y"]: 170, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Image,        ["name"]: "_block",   ["title"]: null, ["font"]: null, ["image"]: "boss_text01",        ["color"]: gui.Color.white, ["x"]: 40, ["y"]: 60, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Image,        ["name"]: "_escape",   ["title"]: null, ["font"]: null, ["image"]: "boss_text05",        ["color"]: gui.Color.white, ["x"]: 60, ["y"]: 170, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: gui.Grid9Image,   ["name"]: "_namebg", ["title"]: null, ["font"]: null, ["image"]: "ty_textDi07",    ["autoScale"]:true,["color"]: gui.Color.white, ["x"]: 180, ["y"]: 5, ["w"]: 200, ["h"]: 45, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"] : eui.Label,		["name"] : "_name",	["title"]: Localize_cns("ROLE_TXT32"),   		["font"] : "ht_20_cc_stroke",   ["color"] : gui.Color.white,		["x"] : 180, ["y"] : 15,		["w"] : 200,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                
                { ["index_type"]: gui.Grid9Image,   ["name"]: "_refreshTipsBg", ["title"]: null, ["font"]: null, ["image"]: "ty_textDi08",    ["autoScale"]:true,["color"]: gui.Color.white, ["x"]: 180, ["y"]: 55, ["w"]: 350, ["h"]: 55, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"] : eui.Label,		["name"] : "_refreshTips",   ["title"]: Localize_cns("FORGE_LEVEL_EFFECT_NEXT"),   		["font"] : "ht_20_lc",          ["color"] : gui.Color.ublack,		["x"] : 185, ["y"] : 55,		["w"] : 340,["h"] : 55,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"]: gui.Grid9Image,   ["name"]: "_fleeTipsBg", ["title"]: null, ["font"]: null, ["image"]: "ty_textDi08",    ["autoScale"]:true,["color"]: gui.Color.white, ["x"]: 180, ["y"]: 115, ["w"]: 350, ["h"]: 30, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"] : eui.Label,		["name"] : "_fleeTips",   ["title"]: Localize_cns("BOSS_TXT41"),   		["font"] : "ht_20_lc",          ["color"] : gui.Color.ublack,		["x"] : 185, ["y"] : 117,		["w"] : 340,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                
                { ["index_type"] : eui.Label,		["name"] : "_nextTime",	["title"]: String.format(Localize_cns("BOSS_TXT15"), "00:00"),   		["font"] : "ht_20_lc",          ["color"] : gui.Color.green,		["x"] : 190, ["y"] : 160,		["w"] : 200,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"] : eui.Label,		["name"] : "_et",	        ["title"]: String.format(Localize_cns("BOSS_TXT18"), 90),   		["font"] : "ht_20_rc",          ["color"] : gui.Color.brown,		["x"] : 300, ["y"] : 160,		["w"] : 230,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"]: gui.Button,       ["name"]: "_enter",  ["title"]: Localize_cns("BOSS_TXT17"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt3", ["autoScale"]:true,["color"]: gui.Color.white, ["x"]: 420, ["y"]: 150, ["w"]: 100, ["h"]: 50, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickEnter, },

            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)
            //ui_util.CreateDrawRectPtr(this.mElemList["_dec"], gui.Color32Half.green)
            //AddRdContent(this.mElemList["_dec"], Localize_cns("CHAT_ERROE_JINYAN"), "ht_20_cc", "zongse")
            this.mElemList["_enter"].visible = false
            this.mElemList["monViewer"] = UIActorView.newObj(this, "monViewer", 100, 170, this.mElemList["_iconGroup"])

            //通关记录
            this.mElemList["link_record"] = UILinkView.newObj(this, "link_record", 0, 5, this.mElemList["link_group"])
            // this.mElemList["link_record"].setContent(Localize_cns("BOSS_TXT76"))
            // this.mElemList["link_record"].setCallBack(this.onClickRecord, this)
            this.mElemList["link_record"].setDefaultFont("ht_22_cc_stroke")
            this.mElemList["link_record"].setLine(true, gui.Color.ublack)
        }

        protected dataChanged(): void {
            let name = this.hashCode
            let self = this.data[0]
            let config = this.data[1]

            this.controlDataTable = {}
            //红点
            self.mParentWnd.hideDotTipsUI(this.mElemList["_enter"])
            table_remove(self.dotTipsButton, this.mElemList["_enter"])
            //wndbase
            if (self.actorViewList[name] == null) {
                self.actorViewList[name] = this.mElemList["monViewer"]
            }

            let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.WildBoss)
            // {
            //         npcList: {[npcIndex]:[refreshTime, status, hpPercent (0.15), occupierData]},         [下次刷新的时间戳，opBossActivityConfig[OrdinaryActivityIndex.WildBoss]]
            // }
            let npcList = {}
            if (actInfo && actInfo.npcList) {
                npcList = actInfo.npcList
            }

            this.mElemList["_refreshed"].visible = false
            this.mElemList["_block"].visible = false
            this.mElemList["_escape"].visible = false
            this.mElemList["_et"].visible = false
            this.mElemList["_enter"].visible = false
            this.mElemList["_nextTime"].visible = false
            // this.mElemList["_res_fight"].visible = false

            let monsterModelId = GetMonsterModel(config.entryId)
            this.mElemList["monViewer"].updateByPlayer(monsterModelId)

            let monName = ""
            let conf = GameConfig.MonsterConfig[config.entryId]
            let fontColor = gui.Color.white
            if (conf) {
                monName = conf.Name
                fontColor = GetQualityColorGui(conf.quality)
            }
            this.mElemList["_name"].text = monName + String.format(Localize_cns("BOSS_TXT59"), config.level)
            this.mElemList["_name"].textColor = fontColor

            this.mElemList["_refreshTips"].text = Localize_cns("BOSS_TXT40") + config.refreshDes

            if (GetHeroProperty("level") < config.level) {
                this.mElemList["_et"].visible = true
                this.mElemList["_et"].text = String.format(Localize_cns("BOSS_TXT18"), config.level)
                return
            }
            
            let bossConfig = npcList[config.index]
            if (!bossConfig) {
                return
            }

            this.mElemList["_nextTime"].visible = true
            this.mElemList["_nextTime"].text = String.format(Localize_cns("BOSS_TXT15"), getFormatTimeSec(bossConfig[0]))
            if (bossConfig[1] == opBossActivityConfig[OrdinaryActivityIndex.WildBoss].killStatus) {                       //已击杀
                this.mElemList["_block"].visible = true
                this.mElemList["_enter"].visible = true
            } else if (bossConfig[1] == opBossActivityConfig[OrdinaryActivityIndex.WildBoss].runStatus) {                //已逃跑
                this.mElemList["_escape"].visible = true
            } else if (bossConfig[1] == opBossActivityConfig[OrdinaryActivityIndex.WildBoss].existStatus) {              //已刷出
                this.mElemList["_refreshed"].visible = true
                this.mElemList["_enter"].visible = true
                
                this.mElemList["_nextTime"].visible = false

                let endTime = getSaveRecord(opSaveRecordKey.wildBossCoolTime) || 0
				if (endTime - GetServerTime() < 0) {
					let consumList = AnalyPrizeFormat(config.consum || [])
                    let saveRecord = getSaveRecord(opSaveRecordKey.wildBossConsumeRecord) || {}             //[index]=1  1表示当前这个野外boss消耗过物品
                    if (consumList.length > 0 && saveRecord[config.index] != 1) {
                        let [entryId, count] = consumList[0]
                        let hasCount = ItemSystem.getInstance().getItemCount(entryId)
                        let itemName = ItemSystem.getInstance().getItemName(entryId)
                        if (hasCount >= count) {
                            self.mParentWnd.createDotTipsUI(this.mElemList["_enter"], true)
                            table_insert(self.dotTipsButton, this.mElemList["_enter"])
                        }
                    } else {
                        self.mParentWnd.createDotTipsUI(this.mElemList["_enter"], true)
                        table_insert(self.dotTipsButton, this.mElemList["_enter"])
                    }
				}
                
            }
            this.controlDataTable["_enter"] = config.index

            //占领
            let record = bossConfig[3] //通关录像
            this.mElemList["link_record"].setVisible(false)
            if(record && size_t(record) > 0){
                let plrId = record[0]
                let name = record[1]
                this.mElemList["link_record"].setVisible(true)
                this.mElemList["link_record"].setContent("#nor" + String.format(Localize_cns("BOSS_TXT77"), name))
                this.mElemList["link_record"].setCallBack(this.onClickRecord, this, plrId)
            }
        }
        /////////////////////////////////////////////////
        onClickEnter(args) {
            let name = args.target.name

            if (this.controlDataTable[name] == null) {
                return
            }

            let index = this.controlDataTable[name]
            
            let wnd = WngMrg.getInstance().getWindow("BossWildFrame")
            wnd.showWildFrame(index)
        }

        onClickRecord(plrId) {
            RpcProxy.call("C2G_GetPlayerInfoByID", plrId)
        }
    }
}