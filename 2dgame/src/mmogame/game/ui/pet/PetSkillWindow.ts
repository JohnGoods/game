class PetSkillWindow extends BaseCtrlWnd {
	mElemList;
	petId: number;

	public initObj(...params: any[]) {
		this.petId = -1
	}

	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;

		var elemInfo = [
			{ ["name"]: "sk_clear_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickClear }, //图鉴

			{ ["name"]: "sk_act_pic1", ["messageFlag"]: true },
			{ ["name"]: "sk_act_pic2", ["messageFlag"]: true },
			{ ["name"]: "sk_name", ["messageFlag"]: true },

			{ ["name"]: "sk_star_wnd", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickStarWnd },
		];

		let maxStart = elemWashSkillOptions[cellOptionsIndex.PetSkill].MaxStart
		for (let i = 0; i < maxStart; i++) {
			table_insert(elemInfo, { ["name"]: "start" + i, ["messageFlag"]: true })
		}

		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		// this.mElemList["skill_link"] = UILinkView.newObj(this.mLayoutNode, "skill_link", 0, 0, this.mElemList["wash_link"])
		// this.mElemList["skill_link"].setCallBack(this.onClickGain, this)

		//主动技能
		this.mElemList["skillBox_Active"] = UISkillBox.newObj(this.mLayoutNode, "skillBox_Active", 0, 0, this.mElemList["sk_wnd"])

		//被动技能
		for (let i = 0; i < 6; i++) {
			this.mElemList["skillBox_" + i] = UISkillBox.newObj(this.mLayoutNode, "skillBox_" + i, 0, 0, this.mElemList["sk_wnd" + i])
		}

		this.mElemList["sk_actor_view"] = UIActorView.newObj(this.mLayoutNode, "sk_actor_view", 60, 150, this.mElemList["sk_actor_wnd"])

		this.mElemList["sk_name_rd"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["sk_name"].setAlignFlag(gui.Flag.H_CENTER)

		for (let i = 0; i < 6; i++) {
			this.mElemList["sk_name" + i].setAlignFlag(gui.Flag.H_CENTER)
		}
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
		this.mElemList["top_group"].visible = true
		this.mElemList["skill_group"].visible = true

		this.mElemList["title"].text = Localize_cns("PET_TXT1")

		this.refreshFrame()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
		this.mElemList["top_group"].visible = false
		this.mElemList["skill_group"].visible = false

		this.mElemList["sk_actor_view"].clearView()
	}

	refreshFrame() {
		//if (this.petId <= 0) {
		this.petId = this.mParentWnd.getPetId()
		//}

		let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(this.petId)
		let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId) //注意获得才会显示技能否则显示升级解锁界面

		if (petNetInfo == null) {
			return
		}

		//更新战斗力
		let force = GetForceMath(GetPetProperty(this.petId))
		DrawNumberStringImage(this.mElemList["sk_force_num"], "zhanLi_", "z" + force, 0, 0, -3)

		//更新类型（金木水火土）
		let elemType = petConfigInfo.type
		let elemStr = GetElemIcon(elemType)
		let elemValue = petConfigInfo.typeNum
		let elemColor = GetElemColor(elemType)
		AddRdContent(this.mElemList["sk_elem_rd"], "#" + elemStr + "#" + elemColor + elemValue, "ht_24_cc", "ublack")

		//神宠 名称 品质
		let quality = petConfigInfo.quality
		let name = petConfigInfo.name
		this.mElemList["qua_group"].visible = CheckPetIsGod(this.petId)
		let sr = petConfigInfo.sr
		let quaIcon = GetPetSRIcon(sr)
		let nameColor = GetQualityColorStr(quality)
		AddRdContent(this.mElemList["sk_name_rd"], "#" + quaIcon + "#" + nameColor + name, "ht_24_cc_stroke", "white")

		//更新主动技能
		let skillId = petConfigInfo.skillid
		var skillName = SkillSystem.getInstance().getSkillName(skillId)
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
		let passSkillList = petConfigInfo.passiveskill || []
		if (petNetInfo && size_t(petNetInfo.passskilllist) > 0) {
			passSkillList = petNetInfo.passskilllist
		}
		for (let i = 0; i < 6; i++) {
			let passSkillId = passSkillList[i]
			if (passSkillId) {
				this.mElemList["sk_pic" + i].visible = true
				this.mElemList["sk_name" + i].visible = true
				this.mElemList["skillBox_" + i].updatePetSkill(passSkillId)

				var skillName = SkillSystem.getInstance().getSkillName(passSkillId)
				var skillNameColor = GetQualityColorStr(SkillSystem.getInstance().getSkillQuality(passSkillId))
				AddRdContent(this.mElemList["sk_name" + i], skillName, "ht_24_cc_stroke", skillNameColor)
			}
			else {
				this.mElemList["skillBox_" + i].lock()
				this.mElemList["sk_pic" + i].visible = false
				this.mElemList["sk_name" + i].visible = false
			}
		}

		//更新星级
		let washSkillNum = petNetInfo.washskillnum || 0 //已洗练次数
		let star = PetSystem.getInstance().getPetSkillStart(washSkillNum)
		let maxStart = elemWashSkillOptions[cellOptionsIndex.PetSkill].MaxStart
		for (let i = 0; i < maxStart; i++) {
			if (star >= i + 1) {
				this.mElemList["start" + i].source = "ty_star01"
			} else {
				this.mElemList["start" + i].source = "ty_starDi01"
			}
		}

		//更新模型
		this.updateActorModel()
	}

	updateActorModel() {
		let modeID = GetPetModel(this.petId)
		this.mElemList["sk_actor_view"].updateByPlayer(modeID)
	}

	onClickClear(args) {
		let wnd = WngMrg.getInstance().getWindow("PetClearFrame")
		wnd.showClearWithPet(this.petId)

		this.checkFirstWash()
	}

	checkFirstWash() {
		if (IGlobal.setting.getRoleSetting(UserSetting.TYPE_BOOLEAN, "petSkillWash", false)) {
			return false
		} else {
			let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
			wnd.showWithActivity("petSkillRule")
			IGlobal.setting.setRoleSetting(UserSetting.TYPE_BOOLEAN, "petSkillWash", true)
			return true
		}
	}

	//红点提示
	refreshPetDotTips() {
		//宠物洗练
		let petId = this.mParentWnd.getPetId()
		let petInfo = PetSystem.getInstance().getPetInfo(petId)
		if (!petInfo) {
			return
		}

		let washConfig = GameConfig.FunSkillWashConfig[cellOptionsName[cellOptionsIndex.PetSkill - 1]][petId]
		let lowId = washConfig.itemid
		let highId = washConfig.highitemid
		let lowCount = ItemSystem.getInstance().getItemCount(lowId)
		let lowLimit = washConfig.itemnum
		let highCount = ItemSystem.getInstance().getItemCount(highId)
		let highLimit = washConfig.highitemnum

		if (lowCount >= lowLimit || highCount >= highLimit) {
			this.mParentWnd.createDotTipsUI(this.mElemList["sk_clear_btn"])
		}
	}

	onTipsClick() {
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
		wnd.showWithActivity("petSkillRule")
	}

	onClickStarWnd() {
		let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)
		let washSkillNum = petNetInfo.washskillnum || 0 //已洗练次数
		let str = String.format(Localize_cns("PET_TXT46"), washSkillNum)
		MsgSystem.confirmDialog_YES(str)
	}

	/////////////////////////////////////////////////////////////
	refreshFrameWithIndex(petId) {
		this.petId = petId
		let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)
		if (petNetInfo) {  //注意获得才会显示技能否则显示升级解锁界面
			this.refreshFrame()
		} else {
			let wnd = this.mParentWnd.tabWndList.getWndWithIndex(0)
			wnd.refreshFrameWithIndex(petId)
		}
	}
}