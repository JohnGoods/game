class BossGlobalWindow extends BaseCtrlWnd {
    controlDataTable: any;
    timerList: any;
    actorViewList:any;

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.timerList = {};
        
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        this.actorViewList = {}

        var elemInfo = [
             { ["name"]: "quanming_restore_left", ["title"]: String.format(Localize_cns("BOSS_TXT9"), "00:00"), ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null }, //图鉴
             { ["name"]: "quanmin_boss_set", ["title"]: Localize_cns("BOSS_TXT10"), ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSetting },
             { ["name"]: "quanmin_chall_add", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAdd },
        //     { ["name"]: "ug_btn_embattle", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickEmbattle },
        //     { ["name"]: "ug_btn_natural", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNatural },
        //     { ["name"]: "ug_btn_changename", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickChangeName },
        //     { ["name"]: "up_add_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAddition },
        //     { ["name"]: "upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickUpgrade },
        //     { ["name"]: "auto_upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAutoUpgrade }, //自动升级
        //     { ["name"]: "active_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickActive },
         ];

         UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        let list: eui.List = this.mElemList["quanmin_list"]
        list.itemRenderer = itemRender.BossGlobalListItem

        AddRdContent(this.mElemList["quanmin_chall_countrd"], String.format(Localize_cns("BOSS_TXT8"), "11/123"), "ht_22_cc", "ublack")
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        // RegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        // RegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["quanmin_group"].visible = true
        this.mElemList["label_wndName"].text = Localize_cns("BOSS_TXT2")

        this.applyActInfo()
        //this.refreshFrame()
    }

    public onHide(): void {
        // UnRegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        // UnRegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["quanmin_group"].visible = false

        for (let _ in this.timerList) {
            let timer = this.timerList[_]
            KillTimer(timer)
        }
        this.timerList = {}
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
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.WorldPlayerBoss)
        // {
        //         npcList: {[npcIndex]:{refreshTime: 123 否则为0, plrCount: 123 争夺人数, hpPercent: 0.5 boss血量百分比}},
        //         fightCount: 总战斗次数,
        //         refreshTime: 我的次数刷新时间,
        //         remainCount: 我的剩余战斗次数,
        // }
        let npcList = {}
        if (actInfo && actInfo.npcList) {
            npcList = actInfo.npcList
        }
        

        let list = []//[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ,1 ]
        let listNotOpen = []
        let finishList = []
        let heroLevel = GetHeroProperty("level")
        for (let k in GameConfig.BossGlobalConfig){
            let v = GameConfig.BossGlobalConfig[k]
            if(heroLevel >= v.level - 10) {
                if (heroLevel >= v.level) {
                    let bossConfig = npcList[v.index]
                    if (bossConfig != null && bossConfig.refreshTime >= GetServerTime()) {                     //已杀
                        table_insert(finishList, [this, v])
                    } else {
                        table_insert(list, [this, v])
                    }
                } else {
                    if (listNotOpen.length <= 0) {
                        table_insert(listNotOpen, [this, v])
                    }
                }
            }
        }
        table_sort(list, function(a, b) {return b[1].level - a[1].level})
        table_sort(listNotOpen, function(a, b) {return b[1].level - a[1].level})
        table_sort(finishList, function(a, b) {return b[1].level - a[1].level})
        table_merge(list, listNotOpen)
        table_merge(list, finishList)

        for (let _ in this.timerList) {
            let timer = this.timerList[_]
            KillTimer(timer)
        }
        this.timerList = {}

        this.clearActorView()
        let eList: eui.List = this.mElemList["quanmin_list"]
        UiUtil.updateList(eList, list);

        //挑战次数
        let leftCount = 0
        var refreshTime = 0
        if (actInfo) {
            leftCount = actInfo.remainCount
            refreshTime = actInfo.refreshTime
        }
        AddRdContent(this.mElemList["quanmin_chall_countrd"], String.format(Localize_cns("BOSS_TXT8"), leftCount + "/" + 10), "ht_22_cc", "ublack")
        this.mElemList["quanmin_chall_add"].visible = leftCount <= 0

        if (refreshTime > 0) {
            let tick = function(delay) {
                let leftTime = refreshTime - GetServerTime()
                if (leftTime < 0) {
                    leftTime = 0
                    this.applyActInfo()

                    if (this.timerList["freshTime"]) {
                        KillTimer(this.timerList["freshTime"])
                        delete this.timerList["freshTime"] 
                    }
                }
                this.mElemList["quanming_restore_left"].text = String.format(Localize_cns("BOSS_TXT9"), getFormatDiffTime(leftTime))
            }
            this.timerList["freshTime"] = SetTimer(tick, this, 200, true)
        } else {
            this.mElemList["quanming_restore_left"].text = ""
        }
    }

    applyActInfo() {
        RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.WorldPlayerBoss)
    }

    updateWnd() {
        this.refreshFrame()
    }
    ////////////////////////////////////////////////////////////////////////////////////
    onClickSetting() {
        WngMrg.getInstance().showWindow("BossGlobalRemindFrame")
    }

    onClickAdd(args) {
        let buyCount = checkNull(getSaveRecord(opSaveRecordKey.buyWorldBossCount), 0)                   //已购买次数
        let canCount = VipSystem.getInstance().getWorldBossBuyCount()
        var callback: IDialogCallback = {
			onDialogCallback(result: boolean, userData): void {
				if (result == true) {
                    if (buyCount >= canCount) {
                        MsgSystem.addTagTips(Localize_cns("BOSS_TXT65"))
                    } else {
                        if (GetHeroProperty("gold") < 50) {
                            MsgSystem.addTagTips(Localize_cns("DIAMAND_NOENGOUGH"))
                            ExecuteMainFrameFunction("chongzhi")
                            return
                        }
                    
                        RpcProxy.call("C2G_BuyActivityRemainFightCount", OrdinaryActivityIndex.WorldPlayerBoss, {})
                    }
				}
			}
		}
        MsgSystem.confirmDialog(String.format(Localize_cns("BOSS_TXT64"), 50, 3, canCount - buyCount, GetHeroProperty("VIP_level"), canCount), callback, null)
    }
}

module itemRender {
    export class BossGlobalListItem extends eui.ItemRenderer {
        mElemList: any;
        controlDataTable: any;

        constructor() {
            super();
            this.mElemList = {}
            this.controlDataTable = {}
            let w = 549
            let h = 190

            let mElemInfo: any = [
                { ["index_type"]: gui.Grid9Image,   ["name"]: "_bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["autoScale"]:true, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Image,        ["name"]: "_iconbg",   ["title"]: null, ["font"]: null, ["image"]: "boss_bossDi01",        ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 20, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Group,        ["name"]: "_iconGroup",["title"]: null, ["font"]: null,         ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 10, ["h"]: 10, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                // { ["index_type"]: eui.Image,        ["name"]: "_icon",   ["title"]: null, ["font"]: null, ["image"]: "tz_Bt01",        ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 50, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                {["index_type"]: gui.ProgressBar,   ["name"]: "_hp_imb", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: "boss_loadingDi01", ["thumbImage"]: "boss_loading01", ["color"]: gui.Color.white, ["x"]: 5, ["y"]: 150, ["w"]: 174, ["h"]: 21, },
                { ["index_type"]: eui.Image,        ["name"]: "_block",   ["title"]: null, ["font"]: null, ["image"]: "boss_fengYin01",        ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 70, ["w"]: 0, ["h"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                

                { ["index_type"]: gui.Grid9Image,   ["name"]: "_namebg", ["title"]: null, ["font"]: null, ["image"]: "ty_textDi07",    ["autoScale"]:true,["color"]: gui.Color.white, ["x"]: 180, ["y"]: 5, ["w"]: 200, ["h"]: 45, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"] : eui.Label,		["name"] : "_name",	["title"]: Localize_cns("ROLE_TXT32"),   		["font"] : "ht_20_cc_stroke",   ["color"] : gui.Color.white,		["x"] : 180, ["y"] : 15,		["w"] : 200,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"] : eui.Label,		["name"] : "_left",	["title"]: Localize_cns("BOSS_TXT11"),   		["font"] : "ht_20_lc",          ["color"] : gui.Color.green,		["x"] : 190, ["y"] : 50,		["w"] : 200,["h"] : 25,	 ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRank },
                { ["index_type"] : eui.Label,		["name"] : "_itemtl",	["title"]: Localize_cns("BOSS_TXT6"),   		["font"] : "ht_20_lc",          ["color"] : gui.Color.ublack,		["x"] : 190, ["y"] : 75,		["w"] : 200,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"]: gui.Button,       ["name"]: "_enter",  ["title"]: Localize_cns("BOSS_TXT7"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt6", ["autoScale"]:true,["color"]: gui.Color.white, ["x"]: 435, ["y"]: 110, ["w"]: 100, ["h"]: 50, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFight, },
                
                { ["index_type"]: eui.Group,        ["name"]: "_res_group",  ["x"]: 380, ["y"]: 0, ["w"]: 50, ["h"]: 50, ["event_name"]: null, ["fun_index"]: null, },
                { ["index_type"]: eui.Label,        ["name"]: "_res_time",   ["parent"]: "_res_group",  ["title"]: String.format(Localize_cns("BOSS_TXT13"), "00:00"), ["font"]: "ht_20_lc", ["color"]: gui.Color.ublack, ["x"]: 20, ["y"]: 10, ["w"]: 200, ["h"]: 25, },
                { ["index_type"]: eui.Image,        ["name"]: "_res_consumIcon", ["parent"]: "_res_group",  ["image"]: "",        ["x"]: 70, ["y"]: 80, ["w"]: 30, ["h"]: 30, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null, ["autoScale"]: true},
                { ["index_type"]: eui.Label,		["name"]: "_res_consum",	    ["parent"]: "_res_group",["title"]: "X20",   ["font"] : "ht_20_lc",          ["color"] : gui.Color.ublack,["x"] : 100, ["y"] : 85,["w"] : 200,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"] : eui.Label,		["name"] : "_openTips",["title"]: Localize_cns("BOSS_TXT39"),   		["font"] : "ht_20_cc",          ["color"] : gui.Color.ublack,		["x"] : 430, ["y"] : 80,		["w"] : 120,["h"] : 25,	 ["fun_index"] : null, ["messageFlag"] : true,},
                { ["index_type"]: gui.Button,       ["name"]: "_res_fight",  ["parent"]: "_res_group",  ["title"]: Localize_cns("BOSS_TXT14"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt6", ["autoScale"]:true,["color"]: gui.Color.white, ["x"]: 41, ["y"]: 115, ["w"]: 120, ["h"]: 50, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRestore, },
                
            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)
            //ui_util.CreateDrawRectPtr(this.mElemList["_dec"], gui.Color32Half.green)
            //AddRdContent(this.mElemList["_dec"], Localize_cns("CHAT_ERROE_JINYAN"), "ht_20_cc", "zongse")
            for (let i = 0; i < 3; i++) {
                this.mElemList["itemBox" + i] = UIItemBox.newObj(this, "itemBox" + i, 180 + 80 * i, 100)
            }
            this.mElemList["monViewer"] = UIActorView.newObj(this, "monViewer", 90, 150, this.mElemList["_iconGroup"])
            //this.mElemList["_icon"].updateByPlayer(20001)

            this.mElemList["_enter"].visible = false
            // num = MathUtil.clamp(num, 0, maxNum)
            let imb = this.mElemList["_hp_imb"]
            UiUtil.updateProgress(imb, 50, 100)
        }

        protected dataChanged(): void {
            let name = this.hashCode
            let self = this.data[0]
            let config = this.data[1]

            this.controlDataTable = {}
            //wndbase
            if (self.actorViewList[name] == null) {
                self.actorViewList[name] = this.mElemList["monViewer"]
            }

            let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.WorldPlayerBoss)
            // {
            //         npcList: {[npcIndex]:{refreshTime: 123 否则为0, plrCount: 123 争夺人数, hpPercent: 0.5 boss血量百分比}},
            //         fightCount: 总战斗次数,
            //         refreshTime: 我的次数刷新时间,
            //         remainCount: 我的剩余战斗次数,
            // }
            let npcList = {}
            if (actInfo && actInfo.npcList) {
                npcList = actInfo.npcList
            }

            this.mElemList[ "_res_group"].visible = false
            this.mElemList[ "_openTips"].visible = false
            this.mElemList[ "_enter"].visible = false
            this.mElemList[ "_hp_imb"].visible = false
            this.mElemList[ "_block"].visible = false
            // this.mElemList[ "_res_fight"].visible = false

            let monsterModelId = GetMonsterModel(config.entryId)
            this.mElemList["monViewer"].updateByPlayer(monsterModelId)

            let monName = ""
            let fontColor = gui.Color.white
            let conf = GameConfig.MonsterConfig[config.entryId]
            if (conf) {
                monName = conf.Name
                fontColor = GetQualityColorGui(conf.quality)
            }
            this.mElemList["_name"].text = config.bossName//mon "(" + config.level + ")"
            this.mElemList["_name"].textColor = fontColor

            let list = AnalyPrizeFormat(config.itemShow)
            for (let i = 0; i < 3; i++) {
                let iteminfo = list[i]
                if (iteminfo == null) {
                    this.mElemList[ "itemBox" + i].setVisible(false)
                } else {
                    this.mElemList[ "itemBox" + i].setVisible(true)
                    this.mElemList[ "itemBox" + i].updateByEntry(iteminfo[0], iteminfo[1], iteminfo[2])
                }
            }

            let bossConfig = npcList[config.index]
            if (!bossConfig) {
                return
            }
            //刷新时间（次数）
            if (bossConfig.refreshTime > GetServerTime()) {
                this.mElemList[ "_left"].text = Localize_cns("BOSS_TXT12")
                this.controlDataTable[ "_left"] = [1, config.index]                               //1表示查看击杀记录
                this.mElemList[ "_block"].visible = true

                
                if (GetHeroProperty("level") < config.level) {
                    this.mElemList[ "_openTips"].visible = true
                    this.mElemList[ "_openTips"].text = String.format(Localize_cns("BOSS_TXT39"), config.level)
                } else {
                    //消耗复活怪物
                    let reEntryId = -1
                    let count = 0
                    if (config.consum[0]) {
                        reEntryId = config.consum[0][0]
                        count = config.consum[0][1]
                    }
                    this.mElemList[ "_res_consum"].text = "X" + count
                    this.mElemList[ "_res_consumIcon"].source = GetItemIcon(reEntryId)

                    if (bossConfig.refreshTime >= GetServerTime()) {
                        this.mElemList[ "_res_group"].visible = true
                        this.controlDataTable[ "_res_fight"] = config

                        let tick = function(delay) {
                            let leftTime = bossConfig.refreshTime - GetServerTime()
                            if (leftTime >= 0) {
                                this.mElemList[ "_res_time"].text = String.format(Localize_cns("BOSS_TXT13"), getFormatDiffTime(leftTime))
                            } else {
                                self.applyActInfo()
                                
                                if (self.timerList[name]) {
                                    KillTimer(self.timerList[name])
                                    delete self.timerList[name]
                                }
                            }
                        }
                        if (!self.timerList[name]) {
                            self.timerList[name] = SetTimer(tick, this, 200, true)
                        }
                        
                    }
                }
            } else {
                let imb = this.mElemList[ "_hp_imb"]
                imb.visible = true
                let func = function(num, maxNum) {
                    return Math.floor(bossConfig.hpPercent * 100) + "%"
                }
                UiUtil.updateProgress(imb, bossConfig.hpPercent * 10000, 10000, func)
                this.mElemList[ "_left"].text = String.format(Localize_cns("BOSS_TXT11"), bossConfig.plrCount)
                this.controlDataTable[ "_left"] = [2, config.index]                               //2表示现时有多少人正在击杀

                if (GetHeroProperty("level") < config.level) {
                    this.mElemList[ "_openTips"].visible = true
                    this.mElemList[ "_openTips"].text = String.format(Localize_cns("BOSS_TXT39"), config.level)
                    this.mElemList[ "_hp_imb"].visible = false
                } else {
                    this.mElemList[ "_enter"].visible = true
                    this.mElemList[ "_hp_imb"].visible = true
                }
            }
        
            this.controlDataTable[ "_enter"] = config.index
        }
        ////////////////////////////////////////////////////////////////////////////////////
        onClickRank(args) {
            let name = args.target.name

            if (this.controlDataTable[name] == null) {
                return
            }

            let [tType, index] = this.controlDataTable[name]
            if (tType == 1) {                                       //击杀记录
                let wnd = WngMrg.getInstance().getWindow("BossGlobalKillRankFrame")
                wnd.showKillRankFrame(index)
            } else if (tType == 2) {                                //争夺人数
                let wnd = WngMrg.getInstance().getWindow("BossGlobalHarmRankFrame")
                wnd.showKillRankFrame(index)
            }
        }

        onClickFight(args) {
            let name = args.target.name

            if (CheckActivityState() == false) {
                return
            }
            
            if (this.controlDataTable[name] == null) {
                return
            }

            if (CheckBeiBaoEquipWillFull()) {
                return
            }

            if (CheckFightState() == true) {
                return
            }

            //检查挑战次数
            let leftCount = 0
            let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.WorldPlayerBoss)
            if (actInfo) {
                leftCount = actInfo.remainCount
                if (leftCount <= 0) {
                    MsgSystem.addTagTips(Localize_cns("BOSS_TXT63"))
                    return
                }
            }

            let index = this.controlDataTable[name]
            RpcProxy.call("C2G_CreateBossFight", OrdinaryActivityIndex.WorldPlayerBoss, index)
        }
        
        onClickRestore(args) {
            let name = args.target.name

            if (this.controlDataTable[name] == null) {
                return
            }

            let config = this.controlDataTable[name]
            if (GetHeroProperty("VIP_level") < config.reviveVipLevel) {
                MsgSystem.addTagTips(String.format(Localize_cns("BOSS_TXT60"), config.reviveVipLevel))
                return
            }
            
            if (config.consum[0]) {
                let reEntryId = config.consum[0][0]
                let needCount = config.consum[0][1]

                let count = ItemSystem.getInstance().getItemCount(reEntryId)
                if (count < needCount) {
                    let name = ItemSystem.getInstance().getItemName(reEntryId)
                    MsgSystem.addTagTips(String.format(Localize_cns("BOSS_TXT61"), name))
                    return
                }
            }

            //检查挑战次数
            let leftCount = 0
            let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.WorldPlayerBoss)
            if (actInfo) {
                leftCount = actInfo.remainCount
                if (leftCount <= 0) {
                    MsgSystem.addTagTips(Localize_cns("BOSS_TXT63"))
                    return
                }
            }

            let index = config.index
            RpcProxy.call("C2G_ReviveActivityBoss", OrdinaryActivityIndex.WorldPlayerBoss, index)
        }

    }
}