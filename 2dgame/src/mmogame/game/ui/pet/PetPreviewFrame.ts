// TypeScript file
/*
作者:
    yangguiming 
	
创建时间：
   2017.02.16(周五)

意图：
   伙伴信息界面
公共接口：
   
*/
class PetPreviewFrame extends BaseWnd {
	petId: number;
	petInfo: any;

	public initObj(...args: any[]): void {
		this.mLayoutPaths = ["resource/layouts/pet/PetPreviewLayout.exml"]
	}

	onLoad() {
		this.createFrame()
	}

	onUnLoad() {


	}

	onShow() {
		this.mLayoutNode.visible = true
		this.mLayoutNode.setDoModal(true);
		this.setAlignCenter(true, true)

		if (this.petId) {
			this.mElemList["sk_skill_group"].visible = true
			this.mElemList["fly_skill_group"].visible = false
			this.refreshBaseFrame()
		} else if (this.petInfo) {
			if (CheckIsFlyPet(this.petInfo.entryid)) { //飞升技能
				this.mElemList["sk_skill_group"].visible = false
				this.mElemList["fly_skill_group"].visible = true
				this.refreshFlyFrame()
			} else {
				this.mElemList["sk_skill_group"].visible = true
				this.mElemList["fly_skill_group"].visible = false
				this.refreshFrame()
			}
		} else {
			this.hideWnd()
		}
	}

	onHide() {
		this.mLayoutNode.visible = false
		this.mLayoutNode.setDoModal(false);

		this.mElemList["actor_view"].clearView()

		this.petId = null
		this.petInfo = null
	}

	createFrame() {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.initSkinElemList();

		var elemInfo = [
			//返回
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onHideClick },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onHideClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		this.mElemList["actor_view"] = UIActorView.newObj(this.mLayoutNode, "actor_view", 0, 0, this.mElemList["actor_wnd"])

		//主动技能
		this.mElemList["skillBox_Active"] = UISkillBox.newObj(this.mLayoutNode, "skillBox_Active", 0, 0, this.mElemList["sk_wnd"])

		//被动技能
		for (let i = 0; i < 6; i++) {
			this.mElemList["skillBox_" + i] = UISkillBox.newObj(this.mLayoutNode, "skillBox_" + i, 0, 0, this.mElemList["sk_wnd" + i])
		}

		this.mElemList["name_rd"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["sk_name"].setAlignFlag(gui.Flag.H_CENTER)

		for (let i = 0; i < 6; i++) {
			this.mElemList["sk_name" + i].setAlignFlag(gui.Flag.H_CENTER)
		}

		for (let i = 0; i < 3; i++) {
			this.mElemList["skillFlyBox_" + i] = UISkillBox.newObj(this.mLayoutNode, "skillFlyBox_" + i, 0, 0, this.mElemList["skill_wnd" + i])
			this.mElemList["fly_skill_name" + i].setAlignFlag(gui.Flag.H_CENTER)
		}

		this.mElemList["qua_group"].visible = false
	}

	refreshBaseFrame() {
		let data = PetSystem.getInstance().getPetEntryInfo(this.petId)
		//let netData = PetSystem.getInstance().getPetInfo(this.petId)

		//更新战力
		let force = GetForceMath(GetPetBaseProperty(this.petId))
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
		AddRdContent(this.mElemList["name_rd"], "#" + icon + name, "ht_24_cc_stroke", "white")

		this.mElemList["qua_group"].visible = CheckPetIsGod(this.petId)

		//更新主动技能
		let skillId = data.skillid
		let skillName = SkillSystem.getInstance().getSkillName(skillId)
		let skillDes = SkillSystem.getInstance().getSkillDes(skillId)
		AddRdContent(this.mElemList["sk_name"], skillName, "ht_24_cc_stroke", "white")
		this.mElemList["skillBox_Active"].updatePetSkill(skillId)
		AddRdContent(this.mElemList["sk_des_rd"], skillDes, "ht_20_cc", "ublack", 3)
		let rd: gui.RichDisplayer = this.mElemList["sk_des_rd"]
		if (rd.getLogicRowCount() > 2) {
			AddRdContent(this.mElemList["sk_des_rd"], skillDes, "ht_16_cc", "ublack", 3)
		}

		//更新被动技能(可洗练)
		let passSkillList = data.passiveskill || []
		for (let i = 0; i < 6; i++) {
			let passSkillId = passSkillList[i]
			if (passSkillId) {
				this.mElemList["sk_pic" + i].visible = true
				this.mElemList["sk_name" + i].visible = true
				this.mElemList["skillBox_" + i].updatePetSkill(passSkillId)

				let skillName = SkillSystem.getInstance().getSkillName(passSkillId)
				AddRdContent(this.mElemList["sk_name" + i], skillName, "ht_24_cc_stroke", "white")
			}
			else {
				this.mElemList["skillBox_" + i].lock()
				this.mElemList["sk_pic" + i].visible = false
				this.mElemList["sk_name" + i].visible = false
			}
		}

		let str = ""
		//属性
		var effect = GetPetBaseProperty(this.petId)
		str = GetPropertyName(objectField.UNIT_FIELD_MAX_HP) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]
		AddRdContent(this.mElemList["hp_rd"], str, "ht_24_cc", "ublack")
		str = GetPropertyName(objectField.UNIT_FIELD_ATTACK) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]
		AddRdContent(this.mElemList["att_rd"], str, "ht_24_cc", "ublack")
		str = GetPropertyName(objectField.UNIT_FIELD_DEFENCE) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]
		AddRdContent(this.mElemList["def_rd"], str, "ht_24_cc", "ublack")

		//更新模型
		this.updateActorModel()
	}

	refreshFrame() {
		let data = PetSystem.getInstance().getPetEntryInfo(this.petInfo.entryid)
		let netData = this.petInfo

		//更新战力
		DrawNumberStringImage(this.mElemList["force_num"], "zhanLi_", "z" + netData.force)

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
		AddRdContent(this.mElemList["name_rd"], "#" + icon + name, "ht_24_cc_stroke", "white")

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
		//属性
		var effect = GetPetProperty(this.petInfo.entryid, netData)
		str = GetPropertyName(objectField.UNIT_FIELD_MAX_HP) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]
		AddRdContent(this.mElemList["hp_rd"], str, "ht_24_cc", "ublack")
		str = GetPropertyName(objectField.UNIT_FIELD_ATTACK) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]
		AddRdContent(this.mElemList["att_rd"], str, "ht_24_cc", "ublack")
		str = GetPropertyName(objectField.UNIT_FIELD_DEFENCE) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]
		AddRdContent(this.mElemList["def_rd"], str, "ht_24_cc", "ublack")

		//更新模型
		this.updateActorModelByInfo()
	}

	refreshFlyFrame() {
		let data = PetSystem.getInstance().getPetEntryInfo(this.petInfo.entryid)
		let netData = this.petInfo

		//更新战力
		DrawNumberStringImage(this.mElemList["force_num"], "zhanLi_", "z" + netData.force)

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
		AddRdContent(this.mElemList["name_rd"], "#" + icon + name, "ht_24_cc_stroke", "white")

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

		//更新飞升技能
		let funType = cellOptionsIndex.PetFly
		let growList = PetSystem.getInstance().getPetGrowList(funType, this.petInfo.entryid, this.petInfo)
		let stage = growList[0]
		let curExp = growList[1]
		let needExp = growList[2]
		let growInfo = PetSystem.getInstance().getPetGrowInfo(funType, this.petInfo.entryid)
		if ((stage == (size_t(growInfo.maxexp) - 1)) && curExp >= needExp) { //满级
			stage = stage + 1
		}
		
		let skillList = data.flyskill
		for (let i = 0; i < 3; i++) {
			if (skillList[i]) {
				this.mElemList["skillFlyBox_" + i].updatePetSkill(skillList[i])
				if ((i + 1) > stage) {
					this.mElemList["skillFlyBox_" + i].setLock(true, (i + 1) + Localize_cns("PET_FLY_TXT5"))
				} else {
					this.mElemList["skillFlyBox_" + i].setLock(false, "")
				}
				//技能名称
				let flyskillName = SkillSystem.getInstance().getSkillName(skillList[i])
				let flyskillNameColor = GetQualityColorStr(SkillSystem.getInstance().getSkillQuality(skillList[i]))
				AddRdContent(this.mElemList["fly_skill_name" + i], flyskillName, "ht_24_cc_stroke", flyskillNameColor)
			}
		}

		let str = ""
		//属性
		var effect = GetPetProperty(this.petInfo.entryid, netData)
		str = GetPropertyName(objectField.UNIT_FIELD_MAX_HP) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]
		AddRdContent(this.mElemList["hp_rd"], str, "ht_24_cc", "ublack")
		str = GetPropertyName(objectField.UNIT_FIELD_ATTACK) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]
		AddRdContent(this.mElemList["att_rd"], str, "ht_24_cc", "ublack")
		str = GetPropertyName(objectField.UNIT_FIELD_DEFENCE) + "#green" + effect[IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]
		AddRdContent(this.mElemList["def_rd"], str, "ht_24_cc", "ublack")

		//更新模型
		this.updateActorModelByInfo()
	}

	updateActorModelByInfo() {
		let modeID = GetPetModel(this.petInfo.entryid)

		this.mElemList["actor_view"].updateByPlayer(modeID)
	}

	updateActorModel() {
		let modeID = GetPetModel(this.petId)

		this.mElemList["actor_view"].updateByPlayer(modeID)
	}

	onHideClick() {
		FireEvent(EventDefine.ACTIVITY_RESET, null);
		this.hideWnd()
	}

	///////////////////////////////////////////////////////////
	showWithPetEntry(petId) {  //宠物初始属性
		this.petId = petId
		this.showWnd()
	}

	showWithPetInfo(petInfo) {  //宠物真实属性
		this.petInfo = petInfo
		// this.petId = petInfo.entryid
		this.showWnd()
	}

}