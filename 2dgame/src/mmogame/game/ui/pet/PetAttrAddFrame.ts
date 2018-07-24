class PetAttrAddFrame extends BaseWnd {
    petId: number;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/pet/PetAttrAddLayout.exml"]

        this.petId = -1
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        //this.setFullScreen(true)
        this.initSkinElemList();
        this.setAlignCenter(true, true)

        var elemInfo = [
            { ["name"]: "btn_close", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["actor_view"] = UIActorView.newObj(this.mLayoutNode, "actor_view", 60, 150, this.mElemList["actor_wnd"])

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

        this.mElemList["actor_view"].clearView()
    }

    refreshFrame() {
        let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(this.petId)
        let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)

        //更新战力
        let force = GetForceMath(GetSumPetProperty())
        DrawNumberStringImage(this.mElemList["force_num"], "zhanLi_", "z" + force, 0, 0, -3)

        let str = ""
        //更新激活总属性
        var effect = GetSumPetLvProperty()
        str = GetPropertyName(objectField.UNIT_FIELD_MAX_HP) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]
        AddRdContent(this.mElemList["hp_rd"], str, "ht_20_cc", "ublack")
        str = GetPropertyName(objectField.UNIT_FIELD_ATTACK) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]
        AddRdContent(this.mElemList["att_rd"], str, "ht_20_cc", "ublack")
        str = GetPropertyName(objectField.UNIT_FIELD_DEFENCE) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]
        AddRdContent(this.mElemList["def_rd"], str, "ht_20_cc", "ublack")

        //更新资质总属性
        var effect = GetSumPetGrowProperty()
        str = GetPropertyName(objectField.UNIT_FIELD_MAX_HP) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]
        AddRdContent(this.mElemList["grow_hp_rd"], str, "ht_20_cc", "ublack")
        str = GetPropertyName(objectField.UNIT_FIELD_ATTACK) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]
        AddRdContent(this.mElemList["grow_att_rd"], str, "ht_20_cc", "ublack")
        str = GetPropertyName(objectField.UNIT_FIELD_DEFENCE) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]
        AddRdContent(this.mElemList["grow_def_rd"], str, "ht_20_cc", "ublack")

        //更新模型
        this.updateActorModel()
    }

    updateActorModel() {
        let modeID = GetPetModel(this.petId)
        this.mElemList["actor_view"].updateByPlayer(modeID)
    }

    showPetAttrAddWithId(petId) {
        this.petId = petId
        this.showWnd()
    }
}