class PetUpgradeWindow extends BaseCtrlWnd {
    mElemList;
    petId: number;
    scroll: UIScrollList;
    showTimer: number;
    isAuto: boolean;
    isAutoYB: boolean;

    animId: number;
    listener: any;

    timer: number;

    public initObj(...params: any[]) {
        this.petId = 0
        this.isAuto = false
        this.isAutoYB = false
        this.animId = 0
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        var elemInfo = [
            { ["name"]: "ug_pokedex_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPokedex }, //图鉴
            { ["name"]: "ug_force_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickForceBtn },
            { ["name"]: "ug_btn_show", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickShow },
            { ["name"]: "ug_btn_embattle", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickEmbattle },
            { ["name"]: "ug_btn_natural", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNatural },
            { ["name"]: "ug_btn_changename", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickChangeName },
            { ["name"]: "up_add_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAddition },
            { ["name"]: "upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickUpgrade },
            { ["name"]: "auto_upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAutoUpgrade }, //自动升级
            { ["name"]: "active_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickActive },

            { ["name"]: "top_left_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickLeft },
            { ["name"]: "top_right_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRight },

            { ["name"]: "union_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickUnion },

            //飞升
            { ["name"]: "fly_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFly },

            { ["name"]: "ug_skill_txt", ["messageFlag"]: true },
        ];

        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["link_view"] = UILinkView.newObj(this.mLayoutNode, "link_view", 0, 0, this.mElemList["link_wnd"])
        //this.mElemList["link_view"].setCallBack(this.onClickGain, this)

        this.mElemList["up_actor_view"] = UIActorView.newObj(this.mLayoutNode, "up_actor_view", 60, 150, this.mElemList["ug_actor_wnd"])

        let group = <eui.Group>this.mElemList["skill_wnd"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_HORIZON)

        this.mElemList["skillBox"] = UISkillBox.newObj(this.mLayoutNode, "skillBox", 0, 0, this.mElemList["ug_skill_bg"])

        this.mElemList["itemBox"] = UIItemBox.newObj(this.mLayoutNode, "itemBox", 180, 40, this.mElemList["unactive_exp_wnd"])

        this.mElemList["elem_rd"].setAlignFlag(gui.Flag.H_CENTER)
        this.mElemList["ug_name_rd"].setAlignFlag(gui.Flag.H_CENTER)
        this.mElemList["exp_material_rd"].setAlignFlag(gui.Flag.H_CENTER)
        this.mElemList["ug_sum_pet"].setAlignFlag(gui.Flag.RIGHT)

        this.mElemList["ug_sign_wnd"].visible = false
        this.mElemList["ug_level_wnd"].visible = false

        this.mElemList["full_lv_txt"].visible = false

        this.mElemList["qua_group0"].visible = false

        this.mElemList["limit_level_txt"].visible = false

        this.mElemList["fly_btn"].visible = false
    }

    public onUnLoad(): void {
        if (this.showTimer) {
            GameTimer.getInstance().killTimer(this.showTimer)
            this.showTimer = null
        }
    }

    public onShow(): void {
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        RegisterEvent(EventDefine.PET_UPDATE, this.updateFrame, this)
        RegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["top_group"].visible = true
        this.mElemList["upgrade_group"].visible = true

        this.mElemList["title"].text = Localize_cns("PET_TXT1")

        this.resetUpgradeBtnState()

        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        UnRegisterEvent(EventDefine.PET_UPDATE, this.updateFrame, this)
        UnRegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["top_group"].visible = false
        this.mElemList["upgrade_group"].visible = false
        this.mElemList["up_actor_view"].clearView()

        this.animId = 0

        if (this.timer) {
            KillTimer(this.timer)
            this.timer = null
        }
    }

    updateFrame(args) {
        this.refreshFrame()

        if (args.oldInfo.stageexp != args.newInfo.stageexp) { //升级中
            if (this.isAuto) {
                //开服九日内
                if (GetServerDay() < 9) {
                    let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)
                    if (petNetInfo && petNetInfo.stageexp == 0) {
                        this.resetUpgradeBtnState()
                    } else {
                        this.sendUpgradeWithCheck()
                    }
                } else {
                    this.sendUpgradeWithCheck()
                }
            }

            this.startAnim()
        }
    }

    refreshFrame() {
        //if (this.petId <= 0) {
        this.petId = this.mParentWnd.selectId
        //}

        let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(this.petId)
        let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)

        let unlock = false

        //宠物激活
        if (petNetInfo) {
            unlock = true
        }

        //更新战力
        let force = petNetInfo ? petNetInfo.force : GetForceMath(GetPetProperty(this.petId))
        DrawNumberStringImage(this.mElemList["ug_force_num"], "zhanLi_", "z" + force, 0, 0, -3)

        //更新类型（金木水火土）
        let elemType = petConfigInfo.type
        let elemStr = GetElemIcon(elemType)
        let elemValue = petConfigInfo.typeNum
        let elemColor = GetElemColor(elemType)
        AddRdContent(this.mElemList["elem_rd"], "#" + elemStr + "#" + elemColor + elemValue, "ht_24_cc", "ublack")

        //未激活和等级
        if (unlock) {
            this.mElemList["ug_sign_wnd"].visible = false
            this.mElemList["ug_level_wnd"].visible = true
            this.mElemList["ug_level_txt"].text = petNetInfo.stage
            this.mElemList["ug_stage_txt"].text = Localize_cns("PET_TXT9")
        } else {
            this.mElemList["ug_sign_wnd"].visible = true
            this.mElemList["ug_level_wnd"].visible = false
        }

        //更新模型
        if (!this.isAuto) {
            this.updateActorModel()
        }

        //更新品质和名称
        let quality = petConfigInfo.quality
        let sr = petConfigInfo.sr
        let icon = GetPetSRIcon(sr)
        let name = petConfigInfo.name
        let nameColor = GetQualityColorStr(quality)
        if (unlock && petNetInfo.name != null && petNetInfo.name != "") {
            name = petNetInfo.name
        }
        AddRdContent(this.mElemList["ug_name_rd"], "#" + icon + "#" + nameColor + name, "ht_24_cc_stroke", "white")

        //神宠
        this.mElemList["qua_group0"].visible = CheckPetIsGod(this.petId)

        //飞升
        let flyskill = petConfigInfo.flyskill || []
        this.mElemList["fly_btn"].visible = size_t(flyskill) > 0

        //更新技能
        if (unlock) {
            this.mElemList["active_up_wnd"].visible = true
            this.mElemList["skill_wnd"].visible = false

            //更新上阵按钮的状态
            let combatPos = petNetInfo.combatpos || opPetCombatPos.Rest
            let btn = <gui.Button>this.mElemList["ug_btn_embattle"]
            if (combatPos == opPetCombatPos.Rest) { //休息
                btn.text = Localize_cns("PET_SIGN_TXT2")
                btn.source = "ty_tongYongBt8"
            } else { //出战 备战
                btn.text = Localize_cns("PET_SIGN_TXT1")
                btn.source = "ty_tongYongBt7"
            }

            //更新主动技能
            this.mElemList["skillBox"].updatePetSkill(petConfigInfo.skillid)
        } else {
            this.mElemList["active_up_wnd"].visible = false
            this.mElemList["skill_wnd"].visible = true

            let activeSkillId = petConfigInfo.skillid
            let passiveSkillList = petConfigInfo.passiveskill
            let skillList = []
            JsUtil.arrayInstert(skillList, activeSkillId)
            for (let i in passiveSkillList) {
                JsUtil.arrayInstert(skillList, passiveSkillList[i])
            }
            let scroll = this.scroll
            scroll.clearItemList()
            for (let k = 0; k < size_t(skillList); k++) {
                let skillId = skillList[k]
                let [window, flag] = scroll.getItemWindow(k, 90, 90, 0, 0)
                if (flag == true) {
                    this.initItemWindow(window)
                }
                this.refreshItemWindow(window, skillId, k)
            }
            scroll.refreshScroll()
        }

        //更新总战力和激活宠物总数
        force = s_GetSumPetForce() || GetForceMath(GetSumPetProperty())
        AddRdContent(this.mElemList["ug_sum_force"], Localize_cns("PET_TXT17") + force, "ht_22_cc", "ublack")
        let activeList = PetSystem.getInstance().getPetActiveList()
        let count = size_t(activeList)
        AddRdContent(this.mElemList["ug_sum_pet"], Localize_cns("PET_TXT18") + count, "ht_22_cc", "ublack")

        //更新加成按钮
        if (unlock) {
            this.mElemList["up_add_btn"].visible = true
        } else {
            this.mElemList["up_add_btn"].visible = false
        }

        if (unlock) {
            this.mElemList["active_exp_wnd"].visible = true
            this.mElemList["unactive_exp_wnd"].visible = false

            let key = cellOptionsName[cellOptionsIndex.Pet - 1]
            let stage = petNetInfo.stage
            let maxExp = GameConfig.FunUpgradeStageConfig[key][stage].maxexp
            let curExp = petNetInfo.stageexp
            //满级
            if (stage >= size_t(GameConfig.FunUpgradeStageConfig[key])) {
                UiUtil.updateProgress(this.mElemList["ug_exp_pro"], 100, 100)
                this.mElemList["upgrade_btn"].visible = false
                this.mElemList["auto_upgrade_btn"].visible = false
                this.mElemList["full_lv_txt"].visible = true
                this.mElemList["full_lv_txt"].text = String.format(Localize_cns("PET_TXT40"), petConfigInfo.name)

                //更新升级消耗材料
                let material = FunSystem.getInstance().getFunUpgradeMaterial(cellOptionsIndex.Pet, stage)
                let str = Localize_cns("PET_TXT4") + "#space_10"
                let itemColor = "#green"
                str = str + GetTagIcon(material.itemId) + itemColor + "-" + "/" + "-" + "#space_10"
                let moneyColor = "#green"
                str = str + GetMoneyIcon(material.moneyUnit) + moneyColor + "-"
                AddRdContent(this.mElemList["exp_material_rd"], str, "ht_24_cc", "ublack")

                this.resetUpgradeBtnState()
            } else {
                this.mElemList["upgrade_btn"].visible = true
                this.mElemList["auto_upgrade_btn"].visible = true
                this.mElemList["full_lv_txt"].visible = false

                //更新经验进度条
                UiUtil.updateProgress(this.mElemList["ug_exp_pro"], curExp, maxExp)

                //更新升级消耗材料
                let material = FunSystem.getInstance().getFunUpgradeMaterial(cellOptionsIndex.Pet, stage)
                let str = Localize_cns("PET_TXT4") + "#space_10"
                let ownCount = ItemSystem.getInstance().getItemCount(material.itemId)
                let itemColor = ownCount >= material.itemNum ? "#green" : "#red"
                str = str + GetTagIcon(material.itemId) + itemColor + ownCount + "/" + material.itemNum + "#space_10"
                let moneyColor = GetHeroProperty("funds") >= material.money ? "#green" : "#red"
                str = str + GetMoneyIcon(material.moneyUnit) + moneyColor + material.money
                AddRdContent(this.mElemList["exp_material_rd"], str, "ht_24_cc", "ublack")
            }
        } else {
            this.mElemList["active_exp_wnd"].visible = false
            this.mElemList["unactive_exp_wnd"].visible = true

            //更新未激活和材料
            let itemId = petConfigInfo.itemid
            let useLevel = ItemSystem.getInstance().getItemUseLevel(itemId) || 0
            let heroLevel = GetHeroProperty("level")
            let itemName = ItemSystem.getInstance().getItemName(itemId)
            let itemCount = ItemSystem.getInstance().getItemCount(itemId) || 0
            let needCount = petConfigInfo.itemnum
            let color = GetQualityColorStr(quality, true)
            this.mElemList["itemBox"].updateByEntry(itemId)
            let itemColor = itemCount >= needCount ? "#lime" : "#red"
            AddRdContent(this.mElemList["active_card_rd"], "#" + color + itemName + Localize_cns("PET_TXT23") + itemColor + "（" + itemCount + "/" + needCount + "）", "ht_24_cc_stroke", "white", 10)

            if (heroLevel >= useLevel) { //满足使用等级
                this.mElemList["limit_level_txt"].visible = false

                if (itemCount == 0) {//没有物品显示获取方式
                    this.mElemList["active_btn"].visible = false

                    if (GameConfig.FunTipsConfig[itemId]) {
                        let linkConfig = GameConfig.FunTipsConfig[itemId][1]
                        if (linkConfig) {
                            this.mElemList["link_view"].updateByEntry(itemId)
                        }
                    }

                    this.mElemList["link_view"].setVisible(true)
                } else {//有物品显示激活按钮
                    this.mElemList["active_btn"].visible = true

                    this.mElemList["link_view"].setVisible(false)
                }
            } else {
                this.mElemList["active_btn"].visible = false
                this.mElemList["link_view"].setVisible(false)
                this.mElemList["limit_level_txt"].visible = true
                this.mElemList["limit_level_txt"].text = String.format(Localize_cns("PET_TXT47"), useLevel)
                if (itemCount >= needCount) {
                    GuideFuncSystem.getInstance().setReadState(GuideFuncSpace.GuideFuncReadTypeDefine.PET_ACTIVE, this.petId)
                }
            }
        }
    }

    initItemWindow(window) {
        let name = window.name

        this.mElemList["skillBox_" + name] = UISkillBox.newObj(this.mLayoutNode, "skillBox_" + name, 0, 0, window, 0.9)
    }

    refreshItemWindow(window, skillId, k) {
        let name = window.name

        this.mElemList["skillBox_" + name].updatePetSkill(skillId)
    }

    updateActorModel() {
        if (this.animId == this.petId) {
            return
        }

        let modeID = GetPetModel(this.petId)

        let funType = cellOptionsIndex.PetFly
		let growList = PetSystem.getInstance().getPetGrowList(funType, this.petId)
		let stage = growList[0]
		let curExp = growList[1]
		let needExp = growList[2]
        if (stage > 0) {
            modeID = GetPetFlyModel(this.petId)
        }

        let actorview = <UIActorView>this.mElemList["up_actor_view"]
        let actor: Actor = actorview.updateByPlayer(modeID)

        this.animId = this.petId

        if (this.timer) {
            KillTimer(this.timer)
            this.timer = null
        }

        let callback = function () {
            if (this.listener) {
                actor.removeAnimListener(this.listener)
                this.listener = null
            }

            actor.changeAction("attack")

            let resetAction = function (args) {
                if (args == "end") {
                    actor.changeAction("idle")
                    actor.removeAnimListener(this.listener)
                    this.listener = null;
                }
            }
            this.listener = { this_index: this, function_index: resetAction, notify_name: "end" }
            actor.addAnimListener(this.listener)

            if (this.timer) {
                KillTimer(this.timer)
                this.timer = null
            }
        }
        this.timer = SetTimer(callback, this, 1000)
    }

    /////////////////////////////响应函数/////////////////////////////
    onClickPokedex(event: egret.TouchEvent) {
        WngMrg.getInstance().showWindow("PetListFrame")
    }

    onClickForceBtn(event: egret.TouchEvent) {
        let wnd = WngMrg.getInstance().getWindow("PetAttributeFrame")
        wnd.showPetAttributeWithId(this.petId)
    }

    //展示
    onClickShow(event: egret.TouchEvent) {
        if (this.showTimer) {
            GameTimer.getInstance().killTimer(this.showTimer)
            this.showTimer = null
        }

        let petName = PetSystem.getInstance().getPetName(this.petId)
        let quality = PetSystem.getInstance().getPetQuality(this.petId)
        let text = GameConfig.HyperLinkConfig[channelOption.C_PET_SHOW].des
        let str = String.format(text, XmlConverter.LinkSign, GetHeroProperty("id"), this.petId, quality, petName, XmlConverter.LinkSign)
        ChannelHyperlinkMrg.getInstance().sendHyperLinkMessage(str)

        // ChatInChannelFrame.getInstance().gotItemToDisplay(str)

        let limit = 60
        this.mElemList["ug_btn_show"].touchEnabled = false
        this.mElemList["ug_btn_show"].source = "ty_tongYongBt8"
        this.mElemList["ug_btn_show"].text = limit + "s"
        this.showTimer = GameTimer.getInstance().setTimer(function (this, delay) {
            limit = limit - 1
            this.mElemList["ug_btn_show"].text = limit + "s"
            if (limit <= 0) {
                GameTimer.getInstance().killTimer(this.showTimer)
                this.showTimer = null
                this.mElemList["ug_btn_show"].source = "ty_tongYongBt7"
                this.mElemList["ug_btn_show"].text = Localize_cns("ZHANSHI")
                this.mElemList["ug_btn_show"].touchEnabled = true

                limit = 60 //注意重置时间
            }
        }, this, 1000)
    }

    //上阵 休息
    onClickEmbattle(event: egret.TouchEvent) {
        let info = PetSystem.getInstance().getPetInfo(this.petId)
        if (info) {
            let combatPos = info.combatpos || opPetCombatPos.Rest
            if (combatPos == opPetCombatPos.Rest) { //休息
                let wnd = WngMrg.getInstance().getWindow("PetEmbattleFrame")
                wnd.showWithPetId(this.petId)
            } else { //出战 备战
                //直接休息           
                RpcProxy.call("C2G_ACTOR_PET_COMBAT_SET", this.petId, opPetCombatPos.Rest)
            }
        }
    }

    //资质
    onClickNatural(event: egret.TouchEvent) {
        let wnd = WngMrg.getInstance().getWindow("PetNaturlFrame")
        wnd.onShowWithPetId(this.petId)
    }

    //改名
    onClickChangeName(event: egret.TouchEvent) {
        let wnd = WngMrg.getInstance().getWindow("PetChangeNameFrame")
        wnd.onShowWithPetId(this.petId)
    }

    //属性加成
    onClickAddition(event: egret.TouchEvent) {
        let wnd = WngMrg.getInstance().getWindow("PetAttrAddFrame")
        wnd.showPetAttrAddWithId(this.petId)
    }

    onClickUpgrade(event: egret.TouchEvent) {
        if (this.isAuto) {
            this.resetUpgradeBtnState()
        }

        this.sendUpgradeWithCheck()
    }

    onClickAutoUpgrade(event: egret.TouchEvent) {
        this.isAuto = !this.isAuto

        if (this.isAuto) {
            this.mElemList["auto_upgrade_btn"].text = Localize_cns("STOP")
            this.mElemList["upgrade_btn"].enabled = false

            this.sendUpgradeWithCheck()
        } else {
            this.mElemList["auto_upgrade_btn"].text = Localize_cns("PET_AUTO_UPGRADE")
            this.mElemList["upgrade_btn"].enabled = true
        }
    }

    sendUpgradeWithCheck() {
        let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)
        let curStage = petNetInfo.stage
        let curExp = petNetInfo.stageexp
        //消耗材料
        let itemId = GameConfig.FunUpgradeStageConfig[cellOptionsName[cellOptionsIndex.Pet - 1]][petNetInfo.stage].itemid
        let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)
        let needItemCount = GameConfig.FunUpgradeStageConfig[cellOptionsName[cellOptionsIndex.Pet - 1]][petNetInfo.stage].itemnum

        //消耗货币
        let moneyUnit = GameConfig.FunUpgradeStageConfig[cellOptionsName[cellOptionsIndex.Pet - 1]][petNetInfo.stage].moneyunit
        let ownMoney = GetHeroMoney(moneyUnit)
        let costMoney = GameConfig.FunUpgradeStageConfig[cellOptionsName[cellOptionsIndex.Pet - 1]][petNetInfo.stage].money

        //判断货币是否足够
        if (ownMoney < costMoney) {
            //直接弹出对应的货币购买界面
            WngMrg.getInstance().showWindow("MoneyChargeFrame")

            this.resetUpgradeBtnState()
            return
        }

        let autoBuy = this.mElemList["auto_box"].selected ? 1 : 0
        //判断材料是否足够
        if (ownItemCount < needItemCount) {
            //自动购买
            if (autoBuy) {
                var count = needItemCount - ownItemCount
                var byPrice = ShopSystem.getInstance().getBindYBItemPrice(2, itemId)
                if (byPrice) {
                    if (GetHeroMoney(opItemUnit.BIND_CURRENCY) >= (count * byPrice)) {
                        this.mElemList["pet_upgrade_anim" + curStage + curExp] = UIUpgradeAnim.newObj(this.mLayoutNode, "pet_upgrade_anim" + curStage + curExp, 0, 0, this.mElemList["pet_anim_wnd"])
                        this.mElemList["pet_upgrade_anim" + curStage + curExp].startAnim(10)
                        RpcProxy.call("C2G_ACTOR_PET_UPGRADE", this.petId, autoBuy)
                    } else {
                        if (!this.isAutoYB) {
                            let _this = this
                            let callback: IDialogCallback = {
                                onDialogCallback(result: boolean, userData): void {
                                    if (result) {
                                        let ybPrice = ShopSystem.getInstance().getBindYBItemPrice(1, itemId)
                                        if (ybPrice) {
                                            let needCount = Math.ceil((count * byPrice - GetHeroMoney(opItemUnit.BIND_CURRENCY)) / byPrice)
                                            let needYB = needCount * ybPrice
                                            if (GetHeroMoney(opItemUnit.CURRENCY) >= needYB) {
                                                _this.mElemList["pet_upgrade_anim" + curStage + curExp] = UIUpgradeAnim.newObj(_this.mLayoutNode, "pet_upgrade_anim" + curStage + curExp, 0, 0, _this.mElemList["pet_anim_wnd"])
                                                _this.mElemList["pet_upgrade_anim" + curStage + curExp].startAnim(10)
                                                RpcProxy.call("C2G_ACTOR_PET_UPGRADE", _this.petId, autoBuy)

                                                _this.isAutoYB = true
                                            } else {
                                                MsgSystem.addTagTips(Localize_cns("COPY_TXT16"))
                                                ExecuteMainFrameFunction("chongzhi")
                                                _this.resetUpgradeBtnState()
                                            }
                                        }
                                    } else {
                                        _this.resetUpgradeBtnState()
                                    }
                                }
                            }
                            MsgSystem.confirmDialog(Localize_cns("PET_TXT38"), callback)
                        } else {
                            let ybPrice = ShopSystem.getInstance().getBindYBItemPrice(1, itemId)
                            if (ybPrice) {
                                let needCount = Math.ceil((count * byPrice - GetHeroMoney(opItemUnit.BIND_CURRENCY)) / byPrice)
                                let needYB = needCount * ybPrice
                                if (GetHeroMoney(opItemUnit.CURRENCY) >= needYB) {
                                    this.mElemList["pet_upgrade_anim" + curStage + curExp] = UIUpgradeAnim.newObj(this.mLayoutNode, "pet_upgrade_anim" + curStage + curExp, 0, 0, this.mElemList["pet_anim_wnd"])
                                    this.mElemList["pet_upgrade_anim" + curStage + curExp].startAnim(10)
                                    RpcProxy.call("C2G_ACTOR_PET_UPGRADE", this.petId, autoBuy)

                                    // this.isAutoYB = true
                                } else {
                                    MsgSystem.addTagTips(Localize_cns("COPY_TXT16"))
                                    ExecuteMainFrameFunction("chongzhi")
                                    this.resetUpgradeBtnState()
                                }
                            }
                        }
                    }
                }
                return
            }

            //弹出材料购买界面
            //新手跳过
            if (GuideSystem.getInstance().isFinishGuide()) {
                let quickWnd = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
                quickWnd.onShowWnd(itemId, needItemCount - ownItemCount);
            }

            this.resetUpgradeBtnState()
        } else {
            this.mElemList["pet_upgrade_anim" + this.petId + curStage + curExp] = UIUpgradeAnim.newObj(this.mLayoutNode, "pet_upgrade_anim" + this.petId + curStage + curExp, 0, 0, this.mElemList["pet_anim_wnd"])
            this.mElemList["pet_upgrade_anim" + this.petId + curStage + curExp].startAnim(10)
            RpcProxy.call("C2G_ACTOR_PET_UPGRADE", this.petId, autoBuy)
        }
    }

    //失败停止升级
    stopAutoUpgrade() {
        this.sendUpgradeWithCheck()
    }

    resetUpgradeBtnState() {
        this.mElemList["auto_upgrade_btn"].text = Localize_cns("PET_AUTO_UPGRADE")
        this.mElemList["upgrade_btn"].enabled = true
        this.isAuto = false
        this.isAutoYB = false
    }

    //激活
    onClickActive(event: egret.TouchEvent) {
        RpcProxy.call("C2G_ACTOR_PET_UNLOCK", this.petId)
    }

    onClickLeft() {
        this.mParentWnd.petListBox.leftMove()
    }

    onClickRight() {
        this.mParentWnd.petListBox.rightMove()
    }

    onClickUnion() {
        ExecuteMainFrameFunction("hecheng")
    }

    //飞升
    onClickFly() {
        let wnd = WngMrg.getInstance().getWindow("PetFlyFrame")
        wnd.showWithPetId(this.petId)
    }

    onClickGain() {
        let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(this.petId)
        let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)

        if (petNetInfo) {
            return
        } else {
            let itemId = petConfigInfo.itemId
            let linkConfig = GameConfig.FunTipsConfig[itemId]
            if (linkConfig && linkConfig.approach) {
                //执行链接
            }
        }
    }

    startAnim() {

    }

    //红点提示
    refreshPetDotTips() {
        this.dotTipsEmbattle()
        this.dotTipsUpgrade()
        this.doTipsNaturl()
        this.doTipsActive()
        this.doTipsFly()
    }

    dotTipsEmbattle() {
        //宠物布阵
        let petId = this.mParentWnd.getPetId()
        let petInfo = PetSystem.getInstance().getPetInfo(petId)
        if (!petInfo) {
            return
        }

        let combatList = PetSystem.getInstance().getEmbattlePosList()
        if (size_t(combatList) < 3 && petInfo.combatpos == opPetCombatPos.Rest) {
            this.mParentWnd.createDotTipsUI(this.mElemList["ug_btn_embattle"])
        }
    }

    dotTipsUpgrade() {
        //宠物升级
        let petId = this.mParentWnd.getPetId()
        let petInfo = PetSystem.getInstance().getPetInfo(petId)
        if (!petInfo) {
            return
        }

        if (GuideFuncSystem.getInstance().checkPetUpgrade(petId)) {
            this.mParentWnd.createDotTipsUI(this.mElemList["upgrade_btn"])
            this.mParentWnd.createDotTipsUI(this.mElemList["auto_upgrade_btn"])
        }
    }

    doTipsNaturl() {
        //宠物资质
        let petId = this.mParentWnd.getPetId()
        if (GuideFuncSystem.getInstance().checkPetNaturl(petId)) {
            this.mParentWnd.createDotTipsUI(this.mElemList["ug_btn_natural"])
        }
    }

    doTipsActive() {
        //宠物激活
        let petId = this.mParentWnd.getPetId()
        if (GuideFuncSystem.getInstance().checkPetActive(petId)) {
            this.mParentWnd.createDotTipsUI(this.mElemList["active_btn"])
        }
    }

    doTipsFly() {
        //宠物飞升
        let petId = this.mParentWnd.getPetId()
        if (GuideFuncSystem.getInstance().checkPetFly(petId)) {
            this.mParentWnd.createDotTipsUI(this.mElemList["fly_btn"])
        }
    }

    onTipsClick() {
        let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
        wnd.showWithActivity("petUpgradeRule")
    }

    /////////////////////////////////////////////////////////////
    refreshFrameWithIndex(petId) {
        this.petId = petId

        this.resetUpgradeBtnState()

        this.refreshFrame()
    }
}