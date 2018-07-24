class CopyTempleWindow extends BaseCtrlWnd {
    controlDataTable: any;
    maxIndex: number
    rankList: any
    timerList: any

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.maxIndex = 11
        this.rankList = []
        this.timerList = {}
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        var elemInfo = [
            { ["name"]: "leiyin_fight_btn",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFight },
            { ["name"]: "leiyin_rank_tl0",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRank },
            { ["name"]: "leiyin_shop",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickShop },
             
            { ["name"]: "leiyin_auto_check", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAutoChange },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let txt = ""
        let colorList = ["#orange", "#magenta", "#cyan"]
        //通关奖励
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                this.mElemList["leiyin_itemBox_" + i + "_" + j] = UIItemBox.newObj(this.mLayoutNode,  "leiyin_itemBox_" + i + "_" + j, 10 + 82 * j, 105, this.mElemList["leiyin_copy_group" + i])
            }

            this.mElemList["leiyin_icon" + i] = UIActorView.newObj(this.mLayoutNode, "leiyin_icon" + i, 71, 60, this.mElemList["leiyin_copy_mon_group" + i])
            //this.mElemList["leiyin_icon" + i].updateByPlayer(20001)

            txt = txt + colorList[i] + String.format(Localize_cns("COPY_TXT19"), Localize_cns("COPY_TXT18"), 199) + "#br"
        }

        AddRdContent(this.mElemList["leiyin_rank_rd"], txt, "ht_20_cc_stroke", "white", 5)

        
        //通关记录
        this.mElemList["leiying_link_record"] = UILinkView.newObj(this.mLayoutNode, "leiying_link_record", -10, 15, this.mElemList["video_group2"])
        // this.mElemList["leiying_link_record"].setContent(Localize_cns("BOSS_TXT76"))
        // this.mElemList["leiying_link_record"].setCallBack(this.onClickRecord, this)
        this.mElemList["leiying_link_record"].setDefaultFont("ht_22_cc_stroke")
        this.mElemList["leiying_link_record"].setLine(true, gui.Color.ublack)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.refresh, this)
        // RegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        // RegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["leiyin_group"].visible = true
        this.mElemList["label_wndName"].text = Localize_cns("COPY_TXT3")
        
        if (FightSystem.getInstance().getFightResultState() == FightSystem.FIGHT_RESULT_STATE_WIN) {
            this.mElemList["leiyin_auto_check"].selected = true
        }

        this.refreshFrame()
        this.applyActInfo()
        this.refreshAutoFight()
        this.sendRankRequire()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.refresh, this)
        // UnRegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        // UnRegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["leiyin_group"].visible = false

        for (let i = 0; i < 3; i++) {
            this.mElemList["leiyin_icon" + i].clearView()
        }

        for (let _ in this.timerList) {
            let v = this.timerList[_]
            KillTimer(v)
        }
        this.timerList = {}
        this.mElemList["leiyin_auto_check"].selected = false
    }
    
    refreshFrame() {
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.SmallThunderTemple)
        // {
        //         maxIndex: 最新通关关卡
        // }
        let maxIndex = 10
        if (actInfo && actInfo.maxIndex != null && actInfo.maxIndex != 0) {
            maxIndex = actInfo.maxIndex
        }
        this.maxIndex = maxIndex

        let list = []
        for (let _ in GameConfig.CopyTempleConfig) {
            let config = GameConfig.CopyTempleConfig[_]
            table_insert(list, config)
        }
        table_sort(list, function(a, b) {return a.index - b.index})
        
        let flag = false
        let t = []
        for (let i = 0; i < list.length; i++) {
            table_insert(t, list[i])

            if (flag == false) {
                if (GameConfig.CopyTempleConfig[maxIndex + 1]) {
                    if (list[i].index == maxIndex + 1) {
                        flag = true
                    }
                } else {
                    if (list[i].index == maxIndex) {
                        flag = true
                    }
                }
            }

            if (t.length == 3) {
                if (flag == true) {
                    break
                }
                t = []
            }
        }

        if (flag == false) {
            this.maxIndex = -1
            this.mElemList["leiyin_fight_btn"].visible = false
            
            this.mElemList["leiyin_auto_check"].visible = false
            this.mElemList["leiyin_auto_tl"].visible = false
            this.mElemList["leiyin_auto_check"].selected = false
            this.refreshAutoFight()
        } else {
            this.mElemList["leiyin_fight_btn"].visible = true
            this.mElemList["leiyin_fight_btn"].enabled = true
            this.mElemList["leiyin_auto_check"].visible = true
            this.mElemList["leiyin_auto_tl"].visible = true

            if (GameConfig.CopyTempleConfig[maxIndex + 1] == null) {
                this.mElemList["leiyin_fight_btn"].text = Localize_cns("COPY_TXT39")
                this.mElemList["leiyin_fight_btn"].enabled = false

                this.mElemList["leiyin_auto_check"].visible = false
                this.mElemList["leiyin_auto_tl"].visible = false
                this.mElemList["leiyin_auto_check"].selected = false
                this.refreshAutoFight()
            } else {
                this.mElemList["leiyin_fight_btn"].text = Localize_cns("COPY_TXT40")
            }
        }

        for (let i = 0; i < 3; i++){
            if (t[i]) {
                this.mElemList["leiyin_copy_group" + i].visible = true

                let config = t[i]
                let monsterModelId = GetMonsterModel(config.entryId)
                this.mElemList["leiyin_icon" + i].updateByPlayer(monsterModelId)

                let l = AnalyPrizeFormat(config.showItem)
                for (let j = 0; j < 2; j++) {
                    if (!l[j]) {
                        this.mElemList["leiyin_itemBox_" + i + "_" + j].setVisible(false)
                    } else {
                        let [entryId, count] = l[j]
                        this.mElemList["leiyin_itemBox_" + i + "_" + j].setVisible(true)
                        this.mElemList["leiyin_itemBox_" + i + "_" + j].updateByEntry(entryId, count)
                    }
                }

                this.mElemList["leiyin_copy_name" + i].text = config.copyName
                this.mElemList["leiyin_copy_pass" + i].visible = config.index <= maxIndex
            } else {
                this.mElemList["leiyin_copy_group" + i].visible = false
            }
        }

        this.mElemList["video_group2"].visible = false
        if (actInfo) {
            let minStageClearForce = actInfo.minStageClearForce //通关录像
            if(minStageClearForce && size_t(minStageClearForce) != 0){
                let minStageClearForceData = minStageClearForce
                this.mElemList["video_group2"].visible = true
                this.mElemList["leiying_video_btn"].text = minStageClearForceData[0]
                this.mElemList["leiying_power"].text = String.format(Localize_cns("FIGHT_TXT13"),MakeLongNumberShort(minStageClearForceData[1]))
                // this.mElemList["leiying_name"].text = String.format(Localize_cns("FIGHT_TXT14"), minStageClearForceData[0])
                this.mElemList["leiying_link_record"].setContent("#nor" + String.format(Localize_cns("FIGHT_TXT14"), minStageClearForceData[0]))
                this.mElemList["leiying_link_record"].setCallBack(this.onClickRecord, this, [minStageClearForceData[2], minStageClearForceData[3]])
            }
        }

        this.refresh()
    }

    refresh(info?){
        if (info) {
            if (info.ranktype == configRankType.RANK_SMALL_THUNDER) {
		        this.rankList = info.ranklist
            }
        }
        
        // [maxNpcIndex, force, plr:getId(), plr:getName()]
        let txt = ""
        for (let i = 0; i < 3; i++) {
            let v = this.rankList[i]
            if (v) {
                let config = GameConfig.CopyTempleConfig[v[0]]
                txt = txt + String.format(Localize_cns("COPY_TXT19"), v[3], config.order) + "#br"
            }
        }

        AddRdContent(this.mElemList["leiyin_rank_rd"], txt, "ht_20_cc_stroke", "white", 5)
	}

    updateWnd() {
        this.refreshFrame()
    }

    applyActInfo() {
        RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.SmallThunderTemple)
    }
    
    refreshAutoFight() {
        if (this.mElemList["leiyin_auto_check"].selected == true) {                       //勾选了自动挑战
            if (!this.timerList["autoFight"]) {                                              //自动挑战
                let endTime = GetServerTime() + 10

                let tick = function (delay) {
                    //结算界面还在时不倒计时
                    if (FightSystem.getInstance().getFightResultState() == FightSystem.FIGHT_RESULT_STATE_WIN) {
                        endTime = GetServerTime() + 10
                        return
                    }

                    let leftTime = endTime - GetServerTime()
                    let reset = false
                    if (leftTime < 0) {
                        reset = this.onClickFight({ target: { name: "leiyin_fight_btn" } })
                        leftTime = 0

                        if (this.timerList["autoFight"]) {
                            KillTimer(this.timerList["autoFight"])
                            delete this.timerList["autoFight"]
                        }
                    }

                    if (reset) {
                        this.mElemList["leiyin_auto_check"].selected = false
                        this.mElemList["leiyin_auto_tl"].text = Localize_cns("COPY_TXT46")
                    } else {
                        this.mElemList["leiyin_auto_tl"].text = String.format(Localize_cns("COPY_TXT47"), leftTime)
                    }
                }
                this.timerList["autoFight"] = SetTimer(tick, this, 200, true)
            }
        } else {
            if (this.timerList["autoFight"]) {
                KillTimer(this.timerList["autoFight"])
                delete this.timerList["autoFight"]
            }
            this.mElemList["leiyin_auto_tl"].text = Localize_cns("COPY_TXT46")
        }
    }
    
    //发送协议获取排行数据
	sendRankRequire() {
        RpcProxy.call("C2G_RoleRank", configRankType.RANK_SMALL_THUNDER,1)
		// let message = GetMessage(opCodes.C2G_ROLE_RANK)
		// message.rankType = configRankType.RANK_SMALL_THUNDER
		// message.index = 1
		// SendGameMessage(message)
	}
    ///////////////////////////////////////////////////////////////////////
    onClickFight(args) {
        if (CheckActivityState() == false) {
            return
        }
        
        if (CheckFightState() == true) {
            return
        }
        
        if (CheckBeiBaoEquipWillFull()) {
            return
        }
        
        RpcProxy.call("C2G_CreateBossFight", OrdinaryActivityIndex.SmallThunderTemple, this.maxIndex + 1)
    }

    onClickRank(args) {                           //击杀记录
        WngMrg.getInstance().showWindow("CopyTempleRankFrame")
    }

    onClickShop(args){
        let wnd : ShopEquipFrame = WngMrg.getInstance().getWindow("ShopEquipFrame")
        wnd.showWithIndex(0)
    }

    onClickRecord(data) {
        let [roleId, videoId] = data || [null, null]
        if (videoId == null) {
            RpcProxy.call("C2G_GetPlayerInfoByID", roleId)
            return// MsgSystem.addTagTips(Localize_cns("FIGHT_TXT16"))
        }
        GetFightVideo(videoId, roleId)
    }
    
    onAutoChange(args) {
        this.refreshAutoFight()
    }
}