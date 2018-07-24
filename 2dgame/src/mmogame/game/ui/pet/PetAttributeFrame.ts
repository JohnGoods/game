class PetAttributeFrame extends BaseWnd {
    petId: number;
    Player: Player;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/pet/PetAttributeLayout.exml"]

        this.petId = -1
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();
        this.setAlignCenter(true, true)

        var elemInfo = [
            { ["name"]: "btn_close", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["elem_rd"].setAlignFlag(gui.Flag.H_CENTER)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.mLayoutNode.setDoModal(true)
        this.refreshFrame()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        this.mLayoutNode.setDoModal(false)
        if (this.Player) {
            let actorview = this.mElemList["actor_view"]
            this.Player.leaveViewer(actorview)
            this.Player.deleteObj()
            this.Player = null
        }
    }

    refreshFrame() {
        if (this.petId <= 0) return;

        let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(this.petId)
        let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)

        this.mElemList["title"].text = petConfigInfo.name + Localize_cns("PET_TXT11")

        //更新战力
        let force = GetForceMath(GetPetProperty(this.petId))
        DrawNumberStringImage(this.mElemList["force_num"], "zhanLi_", "z" + force, 0, 0, -3)

        //更新类型（金木水火土）
        let elemType = petConfigInfo.type
        let elemStr = GetElemIcon(elemType)
        let elemValue = petConfigInfo.typeNum
        let elemColor = GetElemColor(elemType)
        AddRdContent(this.mElemList["elem_rd"], "#" + elemStr + "#" + elemColor + elemValue, "ht_24_cc", "ublack")

        //更新品质和名称
        let quality = petConfigInfo.quality
        let sr = petConfigInfo.sr
        let icon = GetPetSRIcon(sr)
        let name = petConfigInfo.name
        if (petNetInfo && petNetInfo.name != null && petNetInfo.name != "") {
            name = petNetInfo.name
        }
        AddRdContent(this.mElemList["name_rd"], "#" + icon + name, "ht_24_cc_stroke", "white")

        let str = ""
        //更新升级属性
        var effect = GetPetLvProperty(this.petId)
        str = GetPropertyName(objectField.UNIT_FIELD_MAX_HP) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]
        AddRdContent(this.mElemList["hp_rd"], str, "ht_20_cc", "ublack")
        str = GetPropertyName(objectField.UNIT_FIELD_ATTACK) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]
        AddRdContent(this.mElemList["att_rd"], str, "ht_20_cc", "ublack")
        str = GetPropertyName(objectField.UNIT_FIELD_DEFENCE) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]
        AddRdContent(this.mElemList["def_rd"], str, "ht_20_cc", "ublack")

        //更新资质属性
        var effect = GetPetGrowProperty(this.petId)
        str = GetPropertyName(objectField.UNIT_FIELD_MAX_HP) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]
        AddRdContent(this.mElemList["grow_hp_rd"], str, "ht_20_cc", "ublack")
        str = GetPropertyName(objectField.UNIT_FIELD_ATTACK) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]
        AddRdContent(this.mElemList["grow_att_rd"], str, "ht_20_cc", "ublack")
        str = GetPropertyName(objectField.UNIT_FIELD_DEFENCE) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]
        AddRdContent(this.mElemList["grow_def_rd"], str, "ht_20_cc", "ublack")

        if (petNetInfo) {
            //等级
            this.mElemList["level_wnd"].visible = true
            this.mElemList["sign_wnd"].visible = false
            this.mElemList["pet_level"].text = petNetInfo.stage
            this.mElemList["pet_stage"].text = Localize_cns("PET_TXT9")
        } else {
            this.mElemList["level_wnd"].visible = false
            this.mElemList["sign_wnd"].visible = true
        }

        this.updateActorModel()
    }

    updateActorModel() {
        let modeID = GetPetModel(this.petId)
        let actorview = this.mElemList["actor_view"]
        let actor = this.Player || Player.newObj()
        actor.loadModel(modeID)
        actor.changeAction("idle", 1.0, true);
        actor.setPositionXY(0, 70)
        actor.enterViewer(actorview)

        //缩放
        actor.setScale(1.0)
        //方向
        actor.setDir(3)
    }

    showPetAttributeWithId(petId) {
        this.petId = petId
        this.showWnd()
    }
}