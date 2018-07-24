// TypeScript file
class BossWildFrame extends BaseWnd {
    bossIndex: number
    timerList: any
    controlDataTable: any

    public initObj(...params: any[]) {
        this.timerList = {}
        this.controlDataTable = {}
        this.mLayoutPaths = ["resource/layouts/boss/BossWildLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();
        this.setFullScreen(true)

        let mElemInfo: any = [

            { ["name"]: "btn_fight",  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFight },
            { ["name"]: "btn_cooldown",  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCooldown },
            { ["index_type"]: gui.Button, ["name"]: "btn_close_top", ["title"]: null,  ["color"]: gui.Color.white,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["index_type"]: gui.Button, ["name"]: "btn_back", ["title"]: null,  ["color"]: gui.Color.white, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        
            { ["name"]: "consum_add", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAddMaterial},
            {["name"]: "boss_hp_pro", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: "boss_loadingDi01", ["thumbImage"]: "boss_loading01", ["color"]: gui.Color.white, },
        ]
        UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this);

        // let mElemInfo: any = [
		// 	{["index_type"]: gui.ProgressBar,   ["name"]: "boss_pro", ["title"]: "", ["font"]: null, ["image"]: "boss_loadingDi01", ["thumbImage"]: "boss_loading01", ["color"]: gui.Color.white, ["x"]: 90, ["y"]: 300, ["w"]: 174, ["h"]: 21, },
            
		// ]
		// UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)
        // let imb = this.mElemList["boss_pro"]
        // UiUtil.updateProgress(imb, 50, 100)
        this.mElemList["boss_model"] = UIActorView.newObj(this.mLayoutNode, "boss_model", 100, 100, this.mElemList["boss_model_group"])
        //this.mElemList["boss_model"].updateByPlayer(20001)

        this.mElemList["belong_to_rd"].setAlignFlag(gui.Flag.H_CENTER)
        this.mElemList["consum_rd"].setAlignFlag(gui.Flag.RIGHT)

        AddRdContent(this.mElemList["boss_level_rd"], Localize_cns("BOSS_TXT28"), "ht_20_cc", "ublack")
        AddRdContent(this.mElemList["enter_request_rd"], Localize_cns("BOSS_TXT29"), "ht_20_cc", "ublack")
        AddRdContent(this.mElemList["escape_time_rd"], Localize_cns("BOSS_TXT30"), "ht_20_cc", "ublack")
        AddRdContent(this.mElemList["belong_to_rd"], Localize_cns("BOSS_TXT31"), "ht_20_cc", "white")
        AddRdContent(this.mElemList["rule_rd"], Localize_cns("BOSS_TXT32"), "ht_18_cc", "ublack")

        for (let i = 0; i < 5; i++) {
            this.mElemList["normal_itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, "normal_itemBox" + i, 150 + 85 * i, 10, this.mElemList["item_group"])
        }
        for (let i = 0; i < 5; i++) {
            this.mElemList["rare_itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, "rare_itemBox" + i, 150 + 85 * i, 95, this.mElemList["item_group"])
        }

        this.mElemList["belong_to_rd"].addEventListener(gui.RichDisplayer.RichDisplayerLinkCmdEvent, this.onClickHyperLink, this)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)

        this.mLayoutNode.visible = (true)
        this.refreshFrame()

        if (this.bossIndex != null) {
            RpcProxy.call("C2G_GetBossIndexData", OrdinaryActivityIndex.WildBoss, this.bossIndex)
        }
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        this.mLayoutNode.visible = (false)

        for (let _ in this.timerList) {
            let timer = this.timerList[_]
            KillTimer(timer)
        }
        this.timerList = {}

        this.mElemList["boss_model"].clearView()
    }




    refreshFrame() {
        for (let _ in this.timerList) {
            let timer = this.timerList[_]
            KillTimer(timer)
        }
        this.timerList = {}
        this.controlDataTable = {}

        if (this.bossIndex == null) {
            return
        }
        let bossInfo = GetActivity(ActivityDefine.Boss).getActBossInfo(OrdinaryActivityIndex.WildBoss, this.bossIndex)
        // {occupierData: [plrId, name, sex, roleEntryId, overTime], status: opBossActivityConfig[OrdinaryActivityIndex.WildBoss], runTime: runTime, hpPercent=hpPercent}
        //percent:0~1
        if (bossInfo == null) {
            return
        }
        
        //血量
        let func = function(num, maxNum) {
            return Math.floor(bossInfo.hpPercent * 100) + "%"
        }
        UiUtil.updateProgress(this.mElemList["boss_hp_pro"], bossInfo.hpPercent * 10000, 10000, func)
        
        let config = GameConfig.BossWildConfig[this.bossIndex]
        if (config == null) {
            return
        }
        //boss模型
        let monsterModelId = GetMonsterModel(config.entryId)
        this.mElemList["boss_model"].updateByPlayer(monsterModelId)

        //boss名字
        let monName = ""
        let fontColor = gui.Color.white
        let conf = GameConfig.MonsterConfig[config.entryId]
        if (conf) {
            monName = conf.Name
            fontColor = GetQualityColorGui(conf.quality)
        }
        this.mElemList["boss_name"].text = monName
        this.mElemList["boss_name"].textColor = fontColor

        AddRdContent(this.mElemList["boss_level_rd"], String.format(Localize_cns("BOSS_TXT28"), config.level), "ht_20_cc", "ublack")

        this.mElemList["btn_fight"].enabled = true
        //进入条件
        if (bossInfo.status == opBossActivityConfig[OrdinaryActivityIndex.WildBoss].killStatus) {
            AddRdContent(this.mElemList["enter_request_rd"], String.format(Localize_cns("BOSS_TXT29"), "#red" + Localize_cns("BOSS_TXT43")), "ht_20_cc", "ublack")
            AddRdContent(this.mElemList["escape_time_rd"], String.format(Localize_cns("BOSS_TXT30"), Localize_cns("BOSS_TXT45")), "ht_20_cc", "ublack")

            this.mElemList["btn_fight"].enabled = false
        } else {
            AddRdContent(this.mElemList["enter_request_rd"], String.format(Localize_cns("BOSS_TXT29"), Localize_cns("BOSS_TXT44")), "ht_20_cc", "ublack")

            if (bossInfo.status == opBossActivityConfig[OrdinaryActivityIndex.WildBoss].runStatus) {
                AddRdContent(this.mElemList["escape_time_rd"], String.format(Localize_cns("BOSS_TXT30"), Localize_cns("BOSS_TXT46")), "ht_20_cc", "ublack")
                this.mElemList["btn_fight"].enabled = false
            } else {
                var runTime = bossInfo.runTime
                let tick = function(delay) {
                    let leftTime = runTime - GetServerTime()
                    if (leftTime >= 0) {
                        AddRdContent(this.mElemList["escape_time_rd"], String.format(Localize_cns("BOSS_TXT30"), getFormatDiffTimeSimple(leftTime)), "ht_20_cc", "ublack")
                    } else {
                        AddRdContent(this.mElemList["escape_time_rd"], String.format(Localize_cns("BOSS_TXT30"), Localize_cns("BOSS_TXT46")), "ht_20_cc", "ublack")
                        this.mElemList["btn_fight"].enabled = false

                        if (this.timerList["escape"]) {
                            KillTimer(this.timerList["escape"])
                            delete this.timerList["escape"] 
                        }
                    }
                }
                if (!this.timerList["escape"]) {
                    this.timerList["escape"] = SetTimer(tick, this, 200, true)
                }
            }
        }

        let itemShow = AnalyPrizeFormat(config.itemShow)
        for (let i = 0; i < 5; i++) {
            if (itemShow[i]) {
                let [entryId, count] = itemShow[i]
                this.mElemList["normal_itemBox" + i].setVisible(true)
                this.mElemList["normal_itemBox" + i].updateByEntry(entryId, count)
            } else {
                
                this.mElemList["normal_itemBox" + i].setVisible(false)
            }
            
        }
        let rareItemShow = AnalyPrizeFormat(config.rareItemShow)
        for (let i = 0; i < 5; i++) {
            if (rareItemShow[i]) {
                let [entryId, count, quality] = rareItemShow[i]
                this.mElemList["rare_itemBox" + i].setVisible(true)
                this.mElemList["rare_itemBox" + i].updateByEntry(entryId, count, quality)
            } else {
                
                this.mElemList["rare_itemBox" + i].setVisible(false)
            }
        }

        //当前归属
        if (bossInfo.occupierData && size_t(bossInfo.occupierData) > 0) {
            let iconName = GetActorImageName(bossInfo.occupierData[3], bossInfo.occupierData[2])
            this.mElemList["rule_icon"].source = iconName

            var overTime = bossInfo.occupierData[4]
            var plrName = bossInfo.occupierData[1]
            var id = bossInfo.occupierData[0]
            let rd = this.mElemList["belong_to_rd"]
            let tick = function(delay) {
                let leftTime = overTime - GetServerTime()
                 rd.clear()
                if (leftTime >= 0) {
                    let text = String.format(Localize_cns("BOSS_TXT31"),XmlConverter.LinkSign, 0, id,plrName , XmlConverter.LinkSign , "(" + getFormatDiffTimeSimple(leftTime) + ")")
                    let xml = ChannelHyperlinkMrg.getInstance().analyzeHyperLink(text,"white","cyan")

                    rd.addXmlString(xml)
                    // AddRdContent(this.mElemList["belong_to_rd"],xml , "ht_20_cc_stroke", "white")
                } else {
                    let text = String.format(Localize_cns("BOSS_TXT31"),XmlConverter.LinkSign, 0, id,plrName , XmlConverter.LinkSign ,"")
                    let xml = ChannelHyperlinkMrg.getInstance().analyzeHyperLink(text,"white","cyan")
                    rd.addXmlString(xml)
                    // AddRdContent(this.mElemList["belong_to_rd"],xml , "ht_20_cc_stroke", "white")

                    if (this.timerList["belong"]) {
                        RpcProxy.call("C2G_GetBossIndexData", OrdinaryActivityIndex.WildBoss, this.bossIndex)

                        KillTimer(this.timerList["belong"])
                        delete this.timerList["belong"] 
                    }
                }
            }
            if (!this.timerList["belong"]) {
                this.timerList["belong"] = SetTimer(tick, this, 200, true)
            }
        } else {
            this.mElemList["rule_icon"].source = ""
            AddRdContent(this.mElemList["belong_to_rd"], "", "ht_20_cc_stroke", "white")
        }

        //消耗描述
        let consumList = AnalyPrizeFormat(config.consum || [])
        let saveRecord = getSaveRecord(opSaveRecordKey.wildBossConsumeRecord) || {}             //[index]=1  1表示当前这个野外boss消耗过物品
        if (consumList.length > 0 && saveRecord[config.index] != 1) {
            let [entryId, count] = consumList[0]
            let hasCount = ItemSystem.getInstance().getItemCount(entryId)
            let itemName = ItemSystem.getInstance().getItemName(entryId)
            AddRdContent(this.mElemList["consum_rd"], itemName + ":#lime" + hasCount + "/" + count, "ht_24_cc_stroke", "white")
            this.mElemList["consum_add"].visible = true

            this.controlDataTable["consum_add"] = [entryId, hasCount, count]
            this.controlDataTable["btn_fight"] = [entryId, hasCount, count]
        } else {
            AddRdContent(this.mElemList["consum_rd"], "", "ht_20_cc_stroke", "ublack")
            this.mElemList["consum_add"].visible = false
        }
        
        //是否冷却中
        
        let endTime = getSaveRecord(opSaveRecordKey.wildBossCoolTime) || 0
        let tick = function(delay) {
            let leftTime = endTime - GetServerTime()
            if (leftTime >= 0) {
                this.mElemList["btn_cooldown"].visible = true
                this.mElemList["btn_fight"].visible = false
            } else {
                this.mElemList["btn_cooldown"].visible = false
                this.mElemList["btn_fight"].visible = true

                if (this.timerList["cooldown"]) {
                    KillTimer(this.timerList["cooldown"])
                    delete this.timerList["cooldown"] 
                }
            }
        }
        if (!this.timerList["cooldown"]) {
            this.timerList["cooldown"] = SetTimer(tick, this, 200, true)
        }
    }

    updateWnd() {
        this.refreshFrame()
    }

     //////////////////////////////////////////
	geRenCheck() {
		return true
	}

    quanMinCheck() {
        return true
    }

    onClickFight(args) {
        if (this.bossIndex == null) {
            return
        }

        if (CheckActivityState() == false) {
            return
        }
        
        if (CheckBeiBaoEquipWillFull()) {
            return
        }

        if (CheckFightState() == true) {
            return
        }
        
        //检查消耗
        if (this.controlDataTable[args.target.name]) {
            let [entryId, hasCount, count] = this.controlDataTable[args.target.name]
            if (hasCount < count) {
                let itemName = ItemSystem.getInstance().getItemName(entryId)
                MsgSystem.addTagTips(String.format(Localize_cns("BOSS_TXT61"), itemName))
                
                let quickWnd = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
                quickWnd.onShowWnd(entryId, count - hasCount);
                return
            }
        }
        RpcProxy.call("C2G_CreateBossFight", OrdinaryActivityIndex.WildBoss, this.bossIndex)
    }

    onClickCooldown(args) {
        let endTime = getSaveRecord(opSaveRecordKey.wildBossCoolTime) || 0
        if (endTime <= GetServerTime()) {
            return
        }

        let sTime = simple_transform_time1(endTime - GetServerTime())
        let tStr = String.format(Localize_cns("BOSS_TXT68"), sTime.mins, sTime.secs)
        
        var callback: IDialogCallback = {
            onDialogCallback(result: boolean, userData): void {
                if (result == true) {
                    RpcProxy.call("C2G_ClearTimeWait", OrdinaryActivityIndex.WildBoss, {})
                }
            }
        }
        MsgSystem.confirmDialog(String.format(Localize_cns("BOSS_TXT67"), Math.ceil((endTime - GetServerTime()) / opBossActivityConfig[OrdinaryActivityIndex.WildBoss].waitTimeToGold), tStr), callback, null)
    }

    onClickAddMaterial(args) {
        let name = args.target.name
        if (this.controlDataTable[name] == null) {
            return
        }

        let [entryId, hasCount, count] = this.controlDataTable[name]
        let quickWnd = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
        quickWnd.onShowWnd(entryId, 1);
    }

    //响应超链接点击
	onClickHyperLink(args: gui.GUIHyperlinkEvent) {
		let linkContent = args.getHyperlink()
        ChannelHyperlinkMrg.getInstance().hyperLinkClick(linkContent)
	}


    ////////////////////////////公共接口
    showWildFrame(bossIndex) {
        if (bossIndex != null) {
            this.bossIndex = bossIndex
            this.showWnd()
        }
    }
}