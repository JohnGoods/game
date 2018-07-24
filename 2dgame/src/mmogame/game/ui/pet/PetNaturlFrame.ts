class PetNaturlFrame extends BaseWnd {
    petId: number;
    isAuto: boolean;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/pet/PetNaturlLayout.exml"]

        this.isAuto = false
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

            { ["name"]: "up_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickUpgrade },
            { ["name"]: "auto_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAutoUpgrade },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["actor_view"] = UIActorView.newObj(this.mLayoutNode, "actor_view", 0, 0, this.mElemList["actor_wnd"])

        this.mElemList["itemBox"] = UIItemBox.newObj(this.mLayoutNode, "itemBox", 0, 0, this.mElemList["item_wnd"])

        this.mElemList["name_rd"].setAlignFlag(gui.Flag.H_CENTER)
        this.mElemList["elem_rd"].setAlignFlag(gui.Flag.H_CENTER)

        this.mElemList["max_txt"].visible = false
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        this.mLayoutNode.visible = true;
        this.isAuto = false
        this.mElemList["auto_btn"].text = Localize_cns("PET_AUTO_UPGRADE")
        this.mElemList["up_btn"].enabled = true

        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        this.mLayoutNode.visible = false;
        this.mElemList["actor_view"].clearView()
    }

    refreshFrame() {
        this.refreshDotTips()

        let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(this.petId)
        let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)

        //资质
        let funType = cellOptionsIndex.Pet
        let growInfo = PetSystem.getInstance().getPetGrowInfo(funType, this.petId)

        //更新资质战力
        let force = GetForceMath(GetPetGrowProperty(this.petId))
        DrawNumberStringImage(this.mElemList["force_num"], "zhanLi_", "z" + force, 0, 0, -3)

        //更新类型（金木水火土）
        let elemType = petConfigInfo.type
        let elemStr = GetElemIcon(elemType)
        let elemValue = petConfigInfo.typeNum
        let elemColor = GetElemColor(elemType)
        AddRdContent(this.mElemList["elem_rd"], "#" + elemStr + "#" + elemColor + elemValue, "ht_24_cc", "ublack")

        //更新资质等级 当前等级经验 当前等级需要经验
        let growList = PetSystem.getInstance().getPetGrowList(funType, this.petId)
        let level = growList[0]
        let curExp = growList[1]
        let needExp = growList[2]

        this.mElemList["level_txt"].text = Localize_cns("NATURL_" + level)
        this.mElemList["level_txt"].textColor = GetQualityColorGui(level + 2, false)

        //更新品质和名称
        let quality = petConfigInfo.quality
        let sr = petConfigInfo.sr
        let icon = GetPetSRIcon(sr)
        let name = petNetInfo.name || petConfigInfo.name
        AddRdContent(this.mElemList["name_rd"], "#" + icon + name, "ht_24_cc_stroke", "white")

        //actor_view
        this.updateActorModel()

        let str = ""
        //资质属性
        var effect = GetPetGrowProperty(this.petId)
        str = GetPropertyName(objectField.UNIT_FIELD_MAX_HP) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]
        AddRdContent(this.mElemList["hp_rd"], str, "ht_24_cc", "ublack")
        str = GetPropertyName(objectField.UNIT_FIELD_ATTACK) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]
        AddRdContent(this.mElemList["att_rd"], str, "ht_24_cc", "ublack")
        str = GetPropertyName(objectField.UNIT_FIELD_DEFENCE) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]
        AddRdContent(this.mElemList["def_rd"], str, "ht_24_cc", "ublack")

        //更新进度条
        UiUtil.updateProgress(this.mElemList["exp_progress"], curExp, needExp)

        //更新消耗材料
        let itemId = growInfo.itemid
        this.mElemList["itemBox"].updateByEntry(itemId)
        let itemName = ItemSystem.getInstance().getItemName(itemId)
        let itemCount = ItemSystem.getInstance().getItemCount(itemId) || 0
        let needCount = growInfo.itemnum
        let color = GetQualityColorStr(quality)
        let itemcolor = itemCount >= needCount ? "#greenyellow" : "#red"
        AddRdContent(this.mElemList["card_rd"], "#" + color + itemName + Localize_cns("PET_TXT23") + itemcolor + "（" + itemCount + "/" + needCount + "）", "ht_24_cc_stroke", "white", 10)

        if (this.isAuto && itemCount > 0) {
            this.sendUpgradeRequest()
        }

        if ((level == size_t(growInfo.maxexp) - 1) && curExp >= needExp) { //满级
            this.mElemList["up_btn"].visible = false
            this.mElemList["auto_btn"].visible = false
            this.mElemList["max_txt"].visible = true
            return
        }

        if (this.isAuto) {
            this.checkAutoUpgrade()
        }
    }

    updateActorModel() {
        let modeID = GetPetModel(this.petId)
        this.mElemList["actor_view"].updateByPlayer(modeID)
    }

    onClickUpgrade(args) {
        if (this.isAuto) {
            this.mElemList["auto_btn"].text = Localize_cns("PET_AUTO_UPGRADE")
            this.mElemList["up_btn"].enabled = true
            this.isAuto = false
        }

        this.checkAutoUpgrade()
    }

    onClickAutoUpgrade(event: egret.TouchEvent) {
        this.isAuto = !this.isAuto

        if (this.isAuto) {
            this.mElemList["auto_btn"].text = Localize_cns("STOP")
            this.mElemList["up_btn"].enabled = false

            this.checkAutoUpgrade()
        } else {
            this.mElemList["auto_btn"].text = Localize_cns("PET_AUTO_UPGRADE")
            this.mElemList["up_btn"].enabled = true
        }
    }

    checkAutoUpgrade() {
        let funType = cellOptionsIndex.Pet
        let growInfo = PetSystem.getInstance().getPetGrowInfo(funType, this.petId)
        //let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(this.petId)
        let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)

        let itemId = growInfo.itemid
        let itemName = ItemSystem.getInstance().getItemName(itemId)
        let itemCount = ItemSystem.getInstance().getItemCount(itemId) || 0

        if (itemCount > 0) {
            this.sendUpgradeRequest()
        } else {
            MsgSystem.addTagTips(Localize_cns("MATRIAL_NOENGOUGH"))
            this.mElemList["auto_btn"].text = Localize_cns("PET_AUTO_UPGRADE")
            this.mElemList["up_btn"].enabled = true
            this.isAuto = false
        }
    }

    sendUpgradeRequest() {
        RpcProxy.call("C2G_ACTOR_PET_GROW_UP", this.petId)
    }

    // stopAutoNaturl() {
    //     // this.refreshFrame()
    // }

    refreshDotTipsImp() {
        if (GuideFuncSystem.getInstance().checkPetNaturl(this.petId)) {
            this.createDotTipsUI(this.mElemList["up_btn"])
            this.createDotTipsUI(this.mElemList["auto_btn"])
        }
    }

    ///////////////////////////////////
    onShowWithPetId(petId) {
        this.petId = petId
        this.showWnd()
    }
}