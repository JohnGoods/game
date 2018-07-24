class MainFightWnd extends BaseCtrlWnd {
    select: boolean;
    campaignId: number;

    public initObj(...params: any[]) {
        this.select = false
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList

        var elemInfo = [
            { ["name"]: "fire_wnd0", ["messageFlag"]: true },
            { ["name"]: "fire_wnd1", ["messageFlag"]: true },
            { ["name"]: "fire_wnd2", ["messageFlag"]: true },

            { ["name"]: "auto_tip", ["messageFlag"]: true },

            //{ ["name"]: "auto_pic", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBoss },
            { ["name"]: "auto_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAuto },
            { ["name"]: "enter_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickEnterMap },

            { ["name"]: "level_lab", ["messageFlag"]: true },
            { ["name"]: "map_lab", ["messageFlag"]: true },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        for (let i = 0; i < 3; i++) {
            this.mElemList["fire" + i].visible = false
        }

        //let btn = <gui.Button>this.mElemList["auto_pic"]
        //btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBoss, this)

        this.mElemList["auto_wnd"].visible = false
        this.mElemList["enter_wnd"].visible = false
        this.mElemList["auto_tip"].visible = false
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshGift, this)
        RegisterEvent(EventDefine.CAMPAIGN_MINE, this.enterNewMap, this)
        RegisterEvent(EventDefine.HERO_ENTER_MAP, this.enterNewMap, this)
        RegisterEvent(EventDefine.CAMPAIGN_MINE, this.refreshFireWnd, this)
        RegisterEvent(EventDefine.COMBAT_FIGHT_LOST, this.fightLost, this)
        RegisterEvent(EventDefine.COMBAT_BEGIN, this.fightBegin, this)
        RegisterEvent(EventDefine.COMBAT_END, this.refreshFireWnd, this)
        this.mElemList["auto_wnd"].visible = true

        this.enterNewMap()

        this.refreshFireWnd()

        this.refreshGift()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshGift, this)
        UnRegisterEvent(EventDefine.CAMPAIGN_MINE, this.enterNewMap, this)
        UnRegisterEvent(EventDefine.HERO_ENTER_MAP, this.enterNewMap, this)
        UnRegisterEvent(EventDefine.CAMPAIGN_MINE, this.refreshFireWnd, this)
        UnRegisterEvent(EventDefine.COMBAT_FIGHT_LOST, this.fightLost, this)
        UnRegisterEvent(EventDefine.COMBAT_BEGIN, this.fightBegin, this)
        UnRegisterEvent(EventDefine.COMBAT_END, this.refreshFireWnd, this)
        this.mElemList["auto_wnd"].visible = false
    }

    enterNewMap() {
        let btn = <gui.Button>this.mElemList["auto_pic"]

        let config = GameConfig.MapEnterList
        let curMapId = MapSystem.getInstance().getMapId()
        // let curMapIndex = MapSystem.getInstance().getMapIndex(curMapId)
        // if (curMapIndex == 0) {
        //     return
        // }

        let campaignId = CampaignSystem.getInstance().getCurOpenCampaign()
        if (!campaignId) {
            return
        }

        if (!GameConfig.CampaignConfig[campaignId]) {
            return
        }
        
        let mapId = GameConfig.CampaignConfig[campaignId].mapId

        let mapIndex = MapSystem.getInstance().getMapIndex(mapId)
        let preInfo = config[mapIndex] || {}

        // let nextInfo = config[tonumber(curMapIndex) + 1] //下一张地图进入的任务条件
        // let curInfo = config[tonumber(curMapIndex)]

        // let finishTask = TaskSystem.getInstance().getTask(curInfo.finishTaskId) //接到关卡最终任务
        // let isTaskFinish = false
        // if (finishTask) {
        //     isTaskFinish = finishTask.isFinish()
        // }

        //let isTaskExsit = TaskSystem.getInstance().isTaskExsit(nextInfo.taskId) //接到进入地图任务

        if (mapId != curMapId) {
            this.mElemList["auto_wnd"].visible = false
            this.mElemList["enter_wnd"].visible = true
            this.mElemList["level_lab"].text = "Lv." + GetHeroProperty("level") + "/" + preInfo.level
            this.mElemList["map_lab"].text = Localize_cns("SANSHENG_TXT29") + preInfo.inMapName || ""

            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBoss, this)
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickEnterMap, this)

            this.select = false
        } else {
            this.mElemList["auto_wnd"].visible = true
            this.mElemList["enter_wnd"].visible = false

            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickEnterMap, this)
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBoss, this)
        }

        if (this.select) {
            this.mElemList["auto_btn"].source = "zjm_Bt33_xz"
        } else {
            this.mElemList["auto_btn"].source = "zjm_Bt33"
        }

        if (GetHeroProperty("level") < 20) {
            this.fightLost()
        }
    }

    refreshFireWnd() {
        let fightSystem: FightSystem = FightSystem.getInstance()

        if (fightSystem.isFight())
            return

        let curmine = CampaignSystem.getInstance().getCurMine()
        let needmine = CampaignSystem.getInstance().getNeedMine()

        for (let i = 0; i < 3; i++) {
            this.mElemList["fire" + i].visible = (i < curmine)
            this.mElemList["fire_wnd" + i].visible = (i < needmine)
        }

        this.mElemList["auto_tip"].visible = (curmine == needmine)
    }

    refreshGift() {
        let record = getSaveRecord(opSaveRecordKey.campaignGifts) || {}
        let btn = <gui.Button>this.mElemList["auto_pic"]
        if (size_t(record) == 0) {
            btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickPrize, this)
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBoss, this)
        } else {
            for (let campaignId in record) {
                if (record[campaignId] == 1) {
                    this.campaignId = tonumber(campaignId)
                    btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBoss, this)
                    btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickPrize, this)
                    return
                }
            }
        }
    }

    onClickBoss() {
        ExecuteMainFrameFunction("guanka")
    }
    onClickPrize() {
        let wnd = WngMrg.getInstance().getWindow("CampaginPrizeFrame")
        wnd.showWithCampaignId(this.campaignId)
    }

    fightLost() {
        this.select = false
        this.mElemList["auto_btn"].source = "zjm_Bt33"
        CampaignSystem.getInstance().setAutoSelect(this.select)
    }

    fightBegin() {
        // 当进入关卡BOSS、自动战斗、巡逻战斗以外的战斗时，取消自动战斗状态
        let [fightType, _] = FightSystem.getInstance().getCurFightType()
        if (fightType == opFightResultType.PATROL || fightType == opFightResultType.CAMPAGINBOSS ) {
            if (this.select) {
                this.mElemList["auto_btn"].source = "zjm_Bt33_xz"
            } else {
                this.mElemList["auto_btn"].source = "zjm_Bt33"
            }
            CampaignSystem.getInstance().setAutoSelect(this.select)
        } else {
            this.fightLost()
        }
    }

    onClickAuto() {
        //20级开启
        if (GetHeroProperty("level") < 20) {
            MsgSystem.addTagTips(String.format(Localize_cns("GLOBAL_TXT6"), 20))
            return
        }

        this.select = !this.select

        if (this.select && CheckBeiBaoEquipWillFull()) {
            this.select = !this.select
            return
        }

        if (this.select) {
            this.mElemList["auto_btn"].source = "zjm_Bt33_xz"
        } else {
            this.mElemList["auto_btn"].source = "zjm_Bt33"
        }
        CampaignSystem.getInstance().setAutoSelect(this.select)
    }

    onClickEnterMap() {
        ExecuteMainFrameFunction("ditu")
    }
}