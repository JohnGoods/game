class BossSingleWindow extends BaseCtrlWnd {
    controlDataTable: any;
    actorViewList:any

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.actorViewList = {}
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

        let list: eui.List = this.mElemList["geren_list"]
        list.itemRenderer = itemRender.BossSingleListItem
        
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        // RegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        // RegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["geren_group"].visible = true
        this.mElemList["label_wndName"].text = Localize_cns("BOSS_TXT1")

        RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.PersonBoss)
        //this.refreshFrame()
    }

    public onHide(): void {
        // UnRegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        // UnRegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["geren_group"].visible = false
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
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.PersonBoss)     //已杀的BOSS放在后面
        let npcList = {}
        if (actInfo && actInfo.npcList) {
            npcList = actInfo.npcList
        }

        let heroLevel = GetHeroProperty("level")
        let list = []//[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ,1 ]
        let finishList = []
        for (let k in GameConfig.BossSingleConfig){
            let v = GameConfig.BossSingleConfig[k]
            if(v.level - 10 <= heroLevel){
                let count = v.chance
                if (npcList[v.index]) {
                    count = count - npcList[v.index]
                }
                if (count <= 0) {
                    table_insert(finishList, [this, v])
                } else {
                    table_insert(list, [this, v])
                }
            }
        }
        table_sort(list, function(a, b) {return a[1].level - b[1].level})
        table_sort(finishList, function(a, b) {return a[1].level - b[1].level})
        list = table_merge(list, finishList)
        
        this.clearActorView()
        let eList: eui.List = this.mElemList["geren_list"]
        UiUtil.updateList(eList, list);
    }

    updateWnd() {
        this.refreshFrame()
    }
}

module itemRender {
    export class BossSingleListItem extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}
            let w = 556
            let h = 190

            let mElemInfo: any = [
                { ["index_type"]: gui.Grid9Image,   ["name"]: "_bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["autoScale"]:true, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Image,        ["name"]: "_iconbg",   ["title"]: null, ["font"]: null, ["image"]: "boss_bossDi01",        ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 20, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Group,        ["name"]: "_iconGroup",["title"]: null, ["font"]: null,         ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 10, ["h"]: 10, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                //{ ["index_type"]: eui.Image,        ["name"]: name + "_icon",   ["title"]: null, ["font"]: null, ["image"]: "tz_Bt01",        ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 50, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: gui.Grid9Image,   ["name"]: "_namebg", ["title"]: null, ["font"]: null, ["image"]: "ty_textDi07",    ["autoScale"]:true,["color"]: gui.Color.white, ["x"]: 180, ["y"]: 5, ["w"]: 200, ["h"]: 45, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"] : eui.Label,		["name"] : "_name",	["title"]: Localize_cns("ROLE_TXT32"),   		["font"] : "ht_20_cc_stroke",   ["color"] : gui.Color.white,		["x"] : 180, ["y"] : 15,		["w"] : 200,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"] : eui.Label,		["name"] : "_left",	["title"]: Localize_cns("BOSS_TXT5"),   		["font"] : "ht_20_lc",          ["color"] : gui.Color.green,		["x"] : 190, ["y"] : 50,		["w"] : 200,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"] : eui.Label,		["name"] : "_itemtl",	["title"]: Localize_cns("BOSS_TXT6"),   		["font"] : "ht_20_lc",          ["color"] : gui.Color.ublack,		["x"] : 190, ["y"] : 75,		["w"] : 200,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"] : eui.Label,		["name"] : "_openTips",["title"]: Localize_cns("BOSS_TXT39"),   		["font"] : "ht_20_cc",          ["color"] : gui.Color.ublack,		["x"] : 430, ["y"] : 80,		["w"] : 120,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"]: eui.Image,        ["name"]: "_finish", ["title"]: null, ["font"]: null, ["image"]: "boss_text01", ["color"]: gui.Color.white, ["x"]: 435, ["y"]: 40, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true, },
                { ["index_type"]: gui.Button,       ["name"]: "_enter",  ["title"]: Localize_cns("BOSS_TXT7"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt6", ["autoScale"]:true,["color"]: gui.Color.white, ["x"]: 435, ["y"]: 110, ["w"]: 100, ["h"]: 50, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFight, },
                { ["index_type"]: gui.Button,       ["name"]: "_sweap",  ["title"]: Localize_cns("COPY_TXT7"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt6", ["autoScale"]:true,["color"]: gui.Color.white, ["x"]: 435, ["y"]: 110, ["w"]: 100, ["h"]: 50, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSweap, },

            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)
            //ui_util.CreateDrawRectPtr(this.mElemList[name +"_dec"], gui.Color32Half.green)
            //AddRdContent(this.mElemList[name + "_dec"], Localize_cns("CHAT_ERROE_JINYAN"), "ht_20_cc", "zongse")
            for (let i = 0; i < 3; i++) {
                this.mElemList["itemBox" + i] = UIItemBox.newObj(this, "itemBox" + i, 180 + 85 * i, 100)
            }
            this.mElemList["monViewer"] = UIActorView.newObj(this, "monViewer", 90, 150, this.mElemList["_iconGroup"])
        }

        protected dataChanged(): void {
            let name = this.hashCode
            let self = this.data[0]
            let config = this.data[1]

            //wndbase
            if (self.actorViewList[name] == null) {
                self.actorViewList[name] = this.mElemList["monViewer"]
            }

            let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.PersonBoss)
            //killCount: number
            //npcList: {[npcIndex]=count}, 各个BOSS可挑战次数
            //killRecord: {[npcIdex]=1}, 有打过，用于判断是否可以扫荡
            let npcList = {}
            let recordList = {}
            if (actInfo && actInfo.npcList) {
                npcList = actInfo.npcList
                recordList = actInfo.killRecord || {}
            }

            this.mElemList["_finish"].visible = false
            this.mElemList["_enter"].visible = false
            this.mElemList["_sweap"].visible = false
            this.mElemList["_openTips"].visible = false

            let monsterModelId = GetMonsterModel(config.entryId)
            this.mElemList["monViewer"].updateByPlayer(monsterModelId)

            let monName = GetMonsterName(config.entryId)
            
            this.mElemList["_name"].text = config.bossName//monName + "(" + config.level + ")"
            let list = AnalyPrizeFormat(config.itemShow)
            for (let i = 0; i < 3; i++) {
                let iteminfo = list[i]
                if (iteminfo == null) {
                    this.mElemList["itemBox" + i].setVisible(false)
                } else {
                    this.mElemList["itemBox" + i].setVisible(true)
                    this.mElemList["itemBox" + i].updateByEntry(iteminfo[0], iteminfo[1], iteminfo[2])
                }
            }

            //剩余次数
            let count = config.chance
            if (npcList[config.index]) {
                count = count - npcList[config.index]
            }
            this.mElemList["_left"].text = Localize_cns("BOSS_TXT5") + count
            //可挑战、已杀怪、未开启
            if (GetHeroProperty("level") < config.level) {
                this.mElemList["_openTips"].visible = true
                this.mElemList["_openTips"].text = String.format(Localize_cns("BOSS_TXT39"), config.level)
            } else if (count <= 0) {
                this.mElemList["_finish"].visible = true
            } else {
                if (GetHeroProperty("level") - config.level >= config.sweepLevel && recordList[config.index] == 1) {
                    this.mElemList["_sweap"].visible = true
                } else {
                    this.mElemList["_enter"].visible = true
                }
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////
        onClickFight(args) {
            let config = this.data[1]
            if (CheckActivityState() == false) {
                return
            }
            
            if (CheckBeiBaoEquipWillFull()) {
                return
            }

            if (CheckFightState() == true) {
                return
            }
            
            let index = config.index
            RpcProxy.call("C2G_CreateBossFight", OrdinaryActivityIndex.PersonBoss, index)
        }

        onClickSweap(args) {
            let config = this.data[1]
            if (CheckActivityState() == false) {
                return
            }
            
            if (CheckBeiBaoEquipWillFull()) {
                return
            }

            if (CheckFightState() == true) {
                return
            }

            let index = config.index
            RpcProxy.call("C2G_SweepBossActivity", OrdinaryActivityIndex.PersonBoss, index)
        }

    }
}