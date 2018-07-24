class PetGodWindow extends BaseCtrlWnd {
	mElemList;
	scroll: UIPetListBox;
	list: any[];

	public initObj(...params: any[]) {
		this.list = []
	}

	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList

		let group = <eui.Group>this.mElemList["scroll_wnd"]
		this.scroll = UIPetListBox.newObj(this.mLayoutNode, "pet_scroll", 0, 6, group.width, group.height, group)
		this.scroll.setClickListner(this.onClickHead, this)

		//主动技能
		this.mElemList["skillBox_Active"] = UISkillBox.newObj(this.mLayoutNode, "skillBox_Active", 0, 0, this.mElemList["sk_wnd"])

		//被动技能
		for (let i = 0; i < 6; i++) {
			this.mElemList["skillBox_" + i] = UISkillBox.newObj(this.mLayoutNode, "skillBox_" + i, 0, 0, this.mElemList["sk_wnd" + i])
		}

		this.mElemList["actor_view"] = UIActorView.newObj(this.mLayoutNode, "actor_view", 60, 150, this.mElemList["actor_wnd"])

		this.mElemList["name_rd"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["sk_name"].setAlignFlag(gui.Flag.H_CENTER)

		for (let i = 0; i < 6; i++) {
			this.mElemList["sk_name" + i].setAlignFlag(gui.Flag.H_CENTER)
		}
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mElemList["pet_wnd2"].visible = true
		this.refreshFrame()
	}

	public onHide(): void {
		this.mElemList["pet_wnd2"].visible = false
		this.list = []

		this.mElemList["actor_view"].clearView()
	}

	refreshFrame() {
		this.scroll.setGodPetList()

		let list = PetSystem.getInstance().getPetGodList()
		this.refreshSelectFrame(list[this.scroll.select])
	}

	onClickHead(petId) {
		this.refreshSelectFrame(petId)
	}

	refreshSelectFrame(petId) {
		let data = PetSystem.getInstance().getPetEntryInfo(petId)
		let netData = PetSystem.getInstance().getPetInfo(petId)

		//更新战力
		let force = GetForceMath(GetPetLvProperty(petId))
		DrawNumberStringImage(this.mElemList["force_num"], "zhanLi_", "z" + force)

		//更新类型（金木水火土）
		let elemType = data.type
		let elemStr = GetElemIcon(elemType)
		let elemValue = data.typeNum
		let elemColor = GetElemColor(elemType)
		AddRdContent(this.mElemList["elem_rd"], "#" + elemStr + "#" + elemColor + elemValue, "ht_24_cc", "ublack")

		//更新名字和品质
		let name = data.name
		let quality = data.quality
		let sr = data.sr
		let icon = GetPetSRIcon(sr)
		let nameColor = GetQualityColorStr(quality)
		AddRdContent(this.mElemList["name_rd"], "#" + icon + "#" + nameColor + name, "ht_24_cc_stroke", "white")

		//更新主动技能
		let skillId = data.skillid
		let skillName = SkillSystem.getInstance().getSkillName(skillId)
		let skillDes = SkillSystem.getInstance().getSkillDes(skillId)
		var skillNameColor = GetQualityColorStr(SkillSystem.getInstance().getSkillQuality(skillId))
		AddRdContent(this.mElemList["sk_name"], skillName, "ht_24_cc_stroke", skillNameColor)
		this.mElemList["skillBox_Active"].updatePetSkill(skillId)
		AddRdContent(this.mElemList["sk_des_rd"], skillDes, "ht_20_cc", "ublack", 3)
		let rd: gui.RichDisplayer = this.mElemList["sk_des_rd"]
		if (rd.getLogicRowCount() > 2) {
			AddRdContent(this.mElemList["sk_des_rd"], skillDes, "ht_16_cc", "ublack", 3)
		}

		//更新被动技能(可洗练)
		let passSkillList = data.passiveskill || []
		if (netData && size_t(netData.passskilllist) > 0) {
			passSkillList = netData.passskilllist
		}
		for (let i = 0; i < 6; i++) {
			let passSkillId = passSkillList[i]
			if (passSkillId) {
				this.mElemList["sk_pic" + i].visible = true
				this.mElemList["sk_name" + i].visible = true
				this.mElemList["skillBox_" + i].updatePetSkill(passSkillId)

				let skillName = SkillSystem.getInstance().getSkillName(passSkillId)
				var skillNameColor = GetQualityColorStr(SkillSystem.getInstance().getSkillQuality(passSkillId))
				AddRdContent(this.mElemList["sk_name" + i], skillName, "ht_24_cc_stroke", skillNameColor)
			}
			else {
				this.mElemList["skillBox_" + i].lock()
				this.mElemList["sk_pic" + i].visible = false
				this.mElemList["sk_name" + i].visible = false
			}
		}

		 let str = ""
        //资质属性
        var effect = GetPetLvProperty(petId)
        str = GetPropertyName(objectField.UNIT_FIELD_MAX_HP) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]
        AddRdContent(this.mElemList["hp_rd"], str, "ht_24_cc", "ublack")
        str = GetPropertyName(objectField.UNIT_FIELD_ATTACK) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]
        AddRdContent(this.mElemList["att_rd"], str, "ht_24_cc", "ublack")
        str = GetPropertyName(objectField.UNIT_FIELD_DEFENCE) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]
        AddRdContent(this.mElemList["def_rd"], str, "ht_24_cc", "ublack")


		//获取途径

		//更新模型
		this.updateActorModel(petId)
	}

	updateActorModel(petId) {
		let modeID = GetPetModel(petId)
		this.mElemList["actor_view"].updateByPlayer(modeID)
	}

	refreshDotTips() {
		
	}
}