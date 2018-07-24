// TypeScript file
class PetFlyUpgradeWindow extends BaseCtrlWnd {
	petId: number

	isAuto: boolean     //自动升级

	public initObj(...params: any[]) {
		this.isAuto = false
	}

	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList

		let mElemInfo = [
			{ ["name"]: "tips_txt", ["title"]: Localize_cns("PET_FLY_TXT4"), ["font"]: "ht_20_cc_stroke_zongse", ["color"]: gui.Color.red },

			{ ["name"]: "upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickUpgrade },
			{ ["name"]: "auto_upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAutoUpgrade },

			{ ["name"]: "force_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickProperty },
		]
		UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this)

		this.mElemList["effect_upgrade"] = UIActorView.newObj(this.mLayoutNode, "effect_upgrade", 60, 30, this.mElemList["actor_wnd"])

		this.mElemList["actor_view"] = UIActorView.newObj(this.mLayoutNode, "actor_view", 60, 150, this.mElemList["actor_wnd"])

		this.mElemList["itemBox"] = UIItemBox.newObj(this.mLayoutNode, "itemBox", 0, 0, this.mElemList["material_wnd"])

		for (let i = 0; i < 3; i++) {
			this.mElemList["skillBox_" + i] = UISkillBox.newObj(this.mLayoutNode, "skillBox_" + i, 0, 0, this.mElemList["skill_wnd" + i])
		}

		this.mElemList["name_rd"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["elem_rd"].setAlignFlag(gui.Flag.H_CENTER)

		this.mElemList["full_lv_txt"].visible = false
		this.mElemList["tips_txt"].visible = false
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		RegisterEvent(EventDefine.PET_UPDATE, this.updateFrame, this)
		RegisterEvent(EventDefine.PET_FLY_UPGRADE_ERROR, this.resetUpgradeBtnState, this)
		this.mElemList["upgrade_group"].visible = true
		this.petId = this.mParentWnd.petId
		this.resetUpgradeBtnState()
		this.onRefresh()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		UnRegisterEvent(EventDefine.PET_UPDATE, this.updateFrame, this)
		UnRegisterEvent(EventDefine.PET_FLY_UPGRADE_ERROR, this.resetUpgradeBtnState, this)
		this.mElemList["upgrade_group"].visible = false

		this.mElemList["effect_upgrade"].clearView()
		this.mElemList["actor_view"].clearView()
	}

	updateFrame(args) {
		this.onRefresh()

		if (args.oldInfo.flystageexp != args.newInfo.flystageexp) { //升级中
			if (this.isAuto) {
				this.sendUpgradeWithCheck()
			}

			let funType = cellOptionsIndex.PetFly
			let growList = PetSystem.getInstance().getPetGrowList(funType, this.petId)
			let stage = growList[0]
			let curExp = growList[1]
			let needExp = growList[2]
			if (stage > 0 && curExp == 0) {
				this.mElemList["effect_upgrade"].updateByOnceEffect(effectIndex.FeiSheng)
			} else {
				let growInfo = PetSystem.getInstance().getPetGrowInfo(funType, this.petId)
				if ((stage == (size_t(growInfo.maxexp) - 1)) && curExp >= needExp) { //满级
					this.mElemList["effect_upgrade"].updateByOnceEffect(effectIndex.FeiSheng)
				}
			}
		}
	}

	onRefresh() {
		this.mParentWnd.refreshDotTips()

		let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(this.petId)
		let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId) || {}

		// if (!petNetInfo) {
		// 	return
		// }

		let funType = cellOptionsIndex.PetFly
		let growList = PetSystem.getInstance().getPetGrowList(funType, this.petId)
		let stage = growList[0]
		let curExp = growList[1]
		let needExp = growList[2]

		this.mElemList["tips_txt"].visible = !(stage > 0)

		//更新战力
		let force = size_t(petNetInfo) > 0 ? petNetInfo.force : GetForceMath(GetPetProperty(this.petId))
		DrawNumberStringImage(this.mElemList["force_batch"], "zhanLi_", "z" + force, 0, 0, -3)

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

		//等阶
		this.mElemList["level_txt"].text = stage
		this.mElemList["stage_txt"].text = Localize_cns("PET_TXT10")

		//更新模型
		if (petConfigInfo.flymodel) {
			this.updateActorModel()
		}

		//更新经验 
		UiUtil.updateProgress(this.mElemList["exp_progress"], curExp, needExp)

		//消耗材料
		let growInfo = PetSystem.getInstance().getPetGrowInfo(funType, this.petId)
		let itemId = growInfo.itemid
		this.mElemList["itemBox"].updateByEntry(itemId)
		let itemName = ItemSystem.getInstance().getItemName(itemId)
		let itemCount = ItemSystem.getInstance().getItemCount(itemId) || 0
		let needCount = growInfo.itemnum
		let color = GetQualityColorStr(quality)
		let itemcolor = itemCount >= needCount ? "#greenyellow" : "#red"
		AddRdContent(this.mElemList["card_rd"], "#" + color + itemName + Localize_cns("PET_TXT23") + itemcolor + "（" + itemCount + "/" + needCount + "）", "ht_24_cc_stroke", "white", 10)

		if ((stage == (size_t(growInfo.maxexp) - 1)) && curExp >= needExp) { //满级
			this.mElemList["auto_upgrade_btn"].visible = false
			this.mElemList["upgrade_btn"].visible = false
			this.mElemList["full_lv_txt"].visible = true

			stage = stage + 1

			this.mElemList["level_txt"].text = stage
			UiUtil.updateProgress(this.mElemList["exp_progress"], 1, 1)
			this.mElemList["full_lv_txt"].text = String.format(Localize_cns("PET_FLY_TXT8"), petConfigInfo.name)
		} else {
			this.mElemList["auto_upgrade_btn"].visible = size_t(petNetInfo) > 0
		    this.mElemList["upgrade_btn"].visible = size_t(petNetInfo) > 0
			this.mElemList["full_lv_txt"].visible = false
		}

		//更新技能
		let skillList = petConfigInfo.flyskill
		for (let i = 0; i < 3; i++) {
			if (skillList[i]) {
				this.mElemList["skillBox_" + i].updatePetSkill(skillList[i])
				if ((i + 1) > stage) {
					this.mElemList["skillBox_" + i].setLock(true, (i + 1) + Localize_cns("PET_FLY_TXT5"))
				} else {
					this.mElemList["skillBox_" + i].setLock(false, "")
				}
			}
		}
	}

	updateActorModel() {
		let modeID = GetPetFlyModel(this.petId)
		let actorview = <UIActorView>this.mElemList["actor_view"]
		let actor: Actor = actorview.updateByPlayer(modeID)
	}

	resetUpgradeBtnState() {
		this.mElemList["auto_upgrade_btn"].text = Localize_cns("PET_AUTO_UPGRADE")
		this.mElemList["upgrade_btn"].enabled = true
		this.isAuto = false
	}

	sendUpgradeWithCheck() {
		let funType = cellOptionsIndex.PetFly
		let growInfo = PetSystem.getInstance().getPetGrowInfo(funType, this.petId)

		let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)

		let itemId = growInfo.itemid
		let itemName = ItemSystem.getInstance().getItemName(itemId)
		let itemCount = ItemSystem.getInstance().getItemCount(itemId) || 0

		if (itemCount > 0) {
			RpcProxy.call("C2G_PET_FLY_STAGE_UP", this.petId)
		} else {
			MsgSystem.addTagTips(Localize_cns("MATRIAL_NOENGOUGH"))
			this.resetUpgradeBtnState()
		}
	}

	onClickUpgrade() {
		if (this.isAuto) {
			this.resetUpgradeBtnState()
		}

		this.sendUpgradeWithCheck()
	}

	onClickAutoUpgrade() {
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

	onClickProperty() {
		let wnd: PetFlyPropertyFrame = WngMrg.getInstance().getWindow("PetFlyPropertyFrame")
		wnd.showWithPetId(this.petId)
	}

	refreshPetFlyDotTips() {
		if (GuideFuncSystem.getInstance().checkPetFly(this.petId)) {
			this.mParentWnd.createDotTipsUI(this.mElemList["auto_upgrade_btn"])
			this.mParentWnd.createDotTipsUI(this.mElemList["upgrade_btn"])
		}
	}
}

///////////////////////////////////////宠物飞升回收////////////////////////////////////////////

// class PetFlyRecoveryWindow extends BaseCtrlWnd {
// 	radioGroup: eui.RadioButtonGroup

// 	public initObj(...params: any[]) {

// 	}

// 	public onLoad(): void {
// 		this.mElemList = this.mParentWnd.mElemList

// 		let mElemInfo = [
// 			{ ["name"]: "recovery_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.recoveryPet },

// 			{ ["name"]: "item_name", ["title"]: "", ["font"]: "ht_18_cc_stroke", ["color"]: gui.Color.yellow },
// 			{ ["name"]: "money_name", ["title"]: "", ["font"]: "ht_18_cc_stroke", ["color"]: gui.Color.yellow },
// 		]

// 		UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this)

// 		this.mElemList["itemBox_material"] = UIItemBox.newObj(this.mLayoutNode, "itemBox_material", 0, 0, this.mElemList["item_wnd"])
// 		this.mElemList["itemBox_money"] = UIItemBox.newObj(this.mLayoutNode, "itemBox_money", 0, 0, this.mElemList["money_wnd"])

// 		this.radioGroup = new eui.RadioButtonGroup()
// 		this.radioGroup.addEventListener(egret.TouchEvent.CHANGE, this.onUpdate, this)

// 		AddRdContent(this.mElemList["recovery_tips"], Localize_cns("PET_FLY_TXT6"), "ht_22_cc", "green")
// 	}

// 	public onUnLoad(): void {

// 	}

// 	public onShow(): void {
// 		RegisterEvent(EventDefine.PET_UPDATE, this.onRefresh, this)
// 		this.mElemList["recovery_group"].visible = true
// 		this.onRefresh()
// 	}

// 	public onHide(): void {
// 		UnRegisterEvent(EventDefine.PET_UPDATE, this.onRefresh, this)
// 		this.mElemList["recovery_group"].visible = false
// 	}

// 	onRefresh() {
// 		let list = PetSystem.getInstance().getFlyRecoveryList()

// 		let group: eui.Group = this.mElemList["recovery_wnd"]
// 		group.removeChildren()

// 		let mElemInfo = []
// 		for (let i in list) {
// 			table_insert(mElemInfo, { ["index_type"]: eui.Group, ["name"]: "pet_wnd" + i, ["x"]: 0, ["y"]: 0, ["w"]: 100, ["h"]: 135 })
// 		}
// 		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, group)

// 		for (let i in list) {
// 			this.mElemList["recoveryItem" + i] = RecoveryItem.newObj(this.mLayoutNode, "recoveryItem" + i, 0, 0, this.mElemList["pet_wnd" + i], this.radioGroup)
// 			this.mElemList["recoveryItem" + i].updateByData(list[i])
// 		}

// 		this.onUpdate()
// 	}

// 	onUpdate() {
// 		let petId = this.radioGroup.selectedValue
// 		if (!petId) {
// 			let list = PetSystem.getInstance().getFlyRecoveryList()
// 			petId = list[0]
// 			if (petId) {
// 				this.radioGroup.selectedValue = petId
// 			}
// 		}

// 		let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(petId)
// 		let petNetInfo = PetSystem.getInstance().getPetInfo(petId)

// 		let itemId = 60192
// 		let moneyId = 60055

// 		let itemNum = 0
// 		let moneyNum = 0

// 		if (petNetInfo) {
// 			let flystage = petNetInfo.flystage || 0
// 			let flystageexp = petNetInfo.flystageexp || 0
// 			for (let stage = flystage; stage >= 0; stage--) {
// 				let config = GameConfig.FunUpgradeStageConfig["PetFly"][stage]
// 				if (stage == flystage) {
// 					let count = flystageexp / config.expcell
// 					itemNum += count * config.itemnum
// 					moneyNum += count * config.money
// 				} else {
// 					let count = config.maxexp / config.expcell
// 					itemNum += count * config.itemnum
// 					moneyNum += count * config.money
// 				}
// 			}
// 		}

// 		this.mElemList["itemBox_material"].updateByEntry(itemId)
// 		this.mElemList["itemBox_money"].updateByEntry(moneyId)

// 		this.mElemList["item_name"].text = ItemSystem.getInstance().getItemName(itemId) + "*" + itemNum
// 		this.mElemList["money_name"].text = ItemSystem.getInstance().getItemName(moneyId) + "*" + MakeLongNumberShort(moneyNum)
// 	}

// 	recoveryPet() {
// 		let petId = this.radioGroup.selectedValue
// 		if (petId) {
// 			RpcProxy.call("C2G_PET_FLY_RECOVER", petId)
// 		} else {
// 			MsgSystem.addTagTips(Localize_cns("PET_FLY_TXT7"))
// 		}
// 	}

// 	refreshPetFlyDotTips() {

// 	}
// }

// class RecoveryItem extends TClass {
// 	mParentNode
// 	name
// 	mElemList

// 	public initObj(...args: any[]): void {
// 		this.mParentNode = args[0]
// 		this.name = args[1]
// 		let x = args[2]
// 		let y = args[3]

// 		let parentWnd = args[4]

// 		let radioGroup = args[5]

// 		this.mElemList = {}

// 		this.mElemList[this.name + "petBox"] = UIPetBox.newObj(this.mParentNode, this.name + "petBox", 10, 10, parentWnd)

// 		let mElemInfo = [
// 			{ ["index_type"]: eui.Group, ["name"]: this.name + "group", ["x"]: 0, ["y"]: 0, ["w"]: parentWnd.width, ["h"]: parentWnd.height, ["messageFlag"]: true },
// 			{ ["index_type"]: eui.RadioButton, ["name"]: this.name + "radio", ["image"]: "ty_xuanZheDi01", ["image_down"]: "ty_xuanZhe01", ["x"]: 60, ["y"]: 0, ["w"]: 45, ["h"]: 46 },

// 			{ ["index_type"]: eui.Label, ["name"]: this.name + "name", ["parent"]: this.name + "group", ["title"]: "", ["font"]: "ht_18_cc_stroke", ["color"]: gui.Color.white, ["x"]: -25, ["y"]: 95, ["w"]: parentWnd.width + 50, ["h"]: 20, ["messageFlag"]: true },
// 			{ ["index_type"]: eui.Label, ["name"]: this.name + "level", ["parent"]: this.name + "group", ["title"]: "", ["font"]: "ht_18_cc_stroke", ["color"]: gui.Color.yellow, ["x"]: 0, ["y"]: 118, ["w"]: parentWnd.width, ["h"]: 20, ["messageFlag"]: true },
// 		]
// 		UiUtil.createElem(mElemInfo, this.mParentNode, this.mElemList, this, parentWnd)

// 		this.mElemList[this.name + "radio"].group = radioGroup
// 	}

// 	updateByData(petId) {
// 		let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(petId)
// 		let petNetInfo = PetSystem.getInstance().getPetInfo(petId)

// 		if (!petNetInfo) {
// 			return
// 		}

// 		this.mElemList[this.name + "radio"].value = petId

// 		this.mElemList[this.name + "petBox"].updateByEntry(petId)

// 		this.mElemList[this.name + "name"].text = petConfigInfo.name
// 		this.mElemList[this.name + "level"].text = "Lv." + petNetInfo.flystage
// 	}
// }