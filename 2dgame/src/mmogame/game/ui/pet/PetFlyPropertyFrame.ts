// TypeScript file
class PetFlyPropertyFrame extends BaseWnd {
	petId

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/pet/PetAttrAddLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setAlignCenter(true, true)
		this.initSkinElemList();

		this.mLayoutNode.setDoModal(true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		this.mElemList["actor_view"] = UIActorView.newObj(this.mLayoutNode, "actor_view", 60, 150, this.mElemList["actor_wnd"])

		this.mElemList["name_rd"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["elem_rd"].setAlignFlag(gui.Flag.H_CENTER)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		this.refreshFrame()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
	}

	refreshFrame() {
		if (!this.petId) {
			return
		}

		let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(this.petId)
		let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId) || {}

		// if (!petNetInfo) {
		// 	return
		// }

		let petName = PetSystem.getInstance().getPetName(this.petId)
		this.mElemList["title"].text = petName + Localize_cns("PET_FLY_TXT9")
		this.mElemList["property_icon"].source = "cw_text19"

		this.mElemList["elem_rd"].visible = true
		this.mElemList["qua_group"].visible = true
		this.mElemList["name_rd"].visible = true
		this.mElemList["level_wnd"].visible = true

		let funType = cellOptionsIndex.PetFly
		let growList = PetSystem.getInstance().getPetGrowList(funType, this.petId)
		let stage = growList[0]
		let curExp = growList[1]
		let needExp = growList[2]

		//更新战力
		let force = size_t(petNetInfo) > 0 ? petNetInfo.force : GetForceMath(GetPetProperty(this.petId))
		DrawNumberStringImage(this.mElemList["force_num"], "zhanLi_", "z" + force, 0, 0, -3)

		//五行
		let elemType = petConfigInfo.type
		let elemStr = GetElemIcon(elemType)
		let elemValue = petConfigInfo.typeNum
		let elemColor = GetElemColor(elemType)
		AddRdContent(this.mElemList["elem_rd"], "#" + elemStr + "#" + elemColor + elemValue, "ht_24_cc", "ublack")

		//sr和名称
		let quality = petConfigInfo.quality
		let sr = petConfigInfo.sr
		let icon = GetPetSRIcon(sr)
		let name = petConfigInfo.name
		let nameColor = GetQualityColorStr(quality)
		if (petNetInfo.name != null && petNetInfo.name != "") {
			name = petNetInfo.name
		}
		AddRdContent(this.mElemList["name_rd"], "#" + icon + "#" + nameColor + name, "ht_24_cc_stroke", "white")

		//神宠
		this.mElemList["qua_group"].visible = CheckPetIsGod(this.petId)

		let growInfo = PetSystem.getInstance().getPetGrowInfo(funType, this.petId)
		if ((stage == size_t(growInfo.maxexp) - 1) && curExp >= needExp) { //满级
			stage = stage + 1
		}

		//等阶
		this.mElemList["level_txt"].text = stage
		this.mElemList["stage_txt"].text = Localize_cns("PET_TXT10")

		//更新模型
		if (petConfigInfo.flymodel) {
			this.updateActorModel()
		}

		let str = ""
		//更新激活总属性
		var effect = GetSumPetLvProperty()
		str = GetPropertyName(objectField.UNIT_FIELD_MAX_HP) + "#green" + (effect[IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]] || 0)
		AddRdContent(this.mElemList["hp_rd"], str, "ht_20_cc", "ublack")
		str = GetPropertyName(objectField.UNIT_FIELD_ATTACK) + "#green" + (effect[IndexToabilityName[objectField.UNIT_FIELD_ATTACK]] || 0)
		AddRdContent(this.mElemList["att_rd"], str, "ht_20_cc", "ublack")
		str = GetPropertyName(objectField.UNIT_FIELD_DEFENCE) + "#green" + (effect[IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]] || 0)
		AddRdContent(this.mElemList["def_rd"], str, "ht_20_cc", "ublack")

		//更新飞升宠物总属性
		var effect = GetPetFlyGrowProperty(this.petId)
		str = GetPropertyName(objectField.UNIT_FIELD_MAX_HP) + "#green" + (effect[IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]] || 0)
		AddRdContent(this.mElemList["grow_hp_rd"], str, "ht_20_cc", "ublack")
		str = GetPropertyName(objectField.UNIT_FIELD_ATTACK) + "#green" + (effect[IndexToabilityName[objectField.UNIT_FIELD_ATTACK]] || 0)
		AddRdContent(this.mElemList["grow_att_rd"], str, "ht_20_cc", "ublack")
		str = GetPropertyName(objectField.UNIT_FIELD_DEFENCE) + "#green" + (effect[IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]] || 0)
		AddRdContent(this.mElemList["grow_def_rd"], str, "ht_20_cc", "ublack")
	}

	updateActorModel() {
		let modeID = GetPetFlyModel(this.petId)
		let actorview = <UIActorView>this.mElemList["actor_view"]
		let actor: Actor = actorview.updateByPlayer(modeID)
	}

	showWithPetId(entryId) {
		this.petId = entryId
		this.showWnd()
	}
}