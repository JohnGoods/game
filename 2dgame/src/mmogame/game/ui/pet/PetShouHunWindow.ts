class PetShouHunWindow extends BaseCtrlWnd {
	mElemList;
	soulType: number;
	soulInfo: any;
	select: number;

	equipList: any[];

	isAuto: boolean;

	public initObj(...params: any[]) {
		this.soulType = cellOptionsIndex.PetSouHun
		this.soulInfo = {}
		this.select = 1
	}

	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;

		var elemInfo = [
			{ ["name"]: "left_btn", ["title"]: null, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onClickRefreshBtn },
			{ ["name"]: "right_btn", ["title"]: null, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onClickRefreshBtn },

			{ ["name"]: "btn_property_dan", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickProperty },

			{ ["name"]: "turn_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickTurn },
			{ ["name"]: "btn_upgrade", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickUpgrade },
			{ ["name"]: "btn_auto_upgrade", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAutoUpgrade },

			{ ["name"]: "wear_equip_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickWearEquip },

			{ ["name"]: "btn_search", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSearch },

			{ ["name"]: "btn_shootUp", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickShootUp },

			{ ["name"]: "fun_prize_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFunPrize },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		this.mElemList["btn_shootUp"].visible = (false)

		this.mElemList["actor_sh_pet"] = UIActorView.newObj(this.mLayoutNode, "actor_sh_pet", 0, 0, this.mElemList["pet_sh_wnd"])
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshUseItem, this)
		RegisterEvent(EventDefine.PET_FUN_INFO_REFRESH, this.refreshFrame, this)
		RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.updateFrame, this)
		RegisterEvent(EventDefine.FUN_AUTO_FAIL, this.stopAutoUpgrade, this)

		this.mElemList["soul_group"].visible = true
		this.mElemList["actor_sh_pet"].setVisible(true)

		FunUITools.resetUpgradeBtnState(this.soulType, this, "btn_auto_upgrade", "btn_upgrade")

		this.refreshFrame()

		FunUITools.updateShootUpBtnState(this.soulType, this)

		FunUITools.checkExpDan(this.soulType, this)
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshUseItem, this)
		UnRegisterEvent(EventDefine.PET_FUN_INFO_REFRESH, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.updateFrame, this)
		UnRegisterEvent(EventDefine.FUN_AUTO_FAIL, this.stopAutoUpgrade, this)
		this.mElemList["soul_group"].visible = false

		this.mElemList["actor_sh_pet"].clearView()
		this.mElemList["actor_sh_pet"].setVisible(false)
	}

	updateFrame() {
		this.refreshFrame()

		if (this.isAuto) {
			let info = FunSystem.getInstance().getFunInfoWithType(this.soulType)
			if (info && info.stageexp == 0) {
				FunUITools.resetUpgradeBtnState(this.soulType, this, "btn_auto_upgrade", "btn_upgrade")
			} else {
				FunUITools.upgradeAutoFunctionCheck(this.soulType, this, "btn_auto_upgrade", "btn_upgrade")
			}
		}
	}

	initShouHunWnd() {
		this.mElemList["title"].text = Localize_cns("PET_TXT3")

		this.mElemList["PetTongLin_checkbox"].visible = false
		this.mElemList["PetSouHun_checkbox"].visible = true

		this.mElemList["name_wnd"].visible = true

		this.mElemList["skill_pic"].source = "cw_text13"
		this.mElemList["equip_pic"].source = "cw_text14"

		this.mElemList["turn_btn"].visible = false
		this.mElemList["turn_icon"].visible = false
		this.mElemList["group_add_force"].visible = false

		let list = FunUITools.checkWearEquip(this.soulType, this)
		this.mElemList["wear_equip_btn"].visible = size_t(list) > 0
		this.equipList = list
	}

	refreshFrame() {
		this.initShouHunWnd()

		let soulInfo: any = {}
		soulInfo = FunSystem.getInstance().getFunInfoWithType(this.soulType)

		if (soulInfo == null || soulInfo.showIndex == 0) {
			return
		}

		this.soulInfo = soulInfo

		//更新战力
		FunUITools.updateForceNum(this.soulType, this)

		//更新actor
		this.select = soulInfo.stage || 1
		this.updateRefreshState("", this.select)
		this.refreshActorWnd()

		//更新技能
		FunUITools.updateSkillWnd(this.soulType, this)

		//更新装备
		FunUITools.updateEquipWnd(this.soulType, this)

		//更新进度条
		FunUITools.updateExpProgress(this.soulType, this)

		//消耗材料
		FunUITools.updateNeedMaterial(this.soulType, this)

		//满级检测
		FunUITools.checkFullLevel(this.soulType, this, "btn_auto_upgrade", "btn_upgrade", "soul_full_lv_txt")
	}

	refreshUseItem() {
		FunUITools.updateNeedMaterial(this.soulType, this)
	}

	refreshActorWnd() {
		//更新名字
		FunUITools.updateActorName(this.soulType, this, this.select)

		//选中阶数
		FunUITools.updateActorStage(this.soulType, this, this.select)

		//更新actorview
		let combatList = PetSystem.getInstance().getEmbattlePosList()
		let info = combatList[opPetCombatPos.Battle] || combatList[opPetCombatPos.Prepare1] || combatList[opPetCombatPos.Prepare2]
		if (info) {
			let petActor = <UIActorView>this.mElemList["actor_sh_pet"]
			petActor.updateByPlayer(GetPetModel(info.entryid))
		}

		FunUITools.updateActorModel(this.soulType, this, this.select)

		//幻化
		let stage = this.soulInfo.stage || 1
		if (this.select >= stage + 1) {   //预览
			this.mElemList["turn_btn"].visible = false
			this.mElemList["turn_icon"].visible = false
			this.mElemList["group_add_force"].visible = true

			FunUITools.updateAddForceNum(this.soulType, this)
		} else {
			let curshape = this.soulInfo.curshape //当前外形索引
			if (curshape && curshape == this.select) {
				this.mElemList["turn_btn"].visible = false
				this.mElemList["turn_icon"].visible = true
				this.mElemList["group_add_force"].visible = false
			} else {
				this.mElemList["turn_btn"].visible = true
				this.mElemList["turn_icon"].visible = false
				this.mElemList["group_add_force"].visible = false
			}
		}
	}

	updateRefreshState(name, stage) {
		let leftBtn = <gui.Button>this.mElemList["left_btn"]
		let rightBtn = <gui.Button>this.mElemList["right_btn"]
		leftBtn.enabled = true
		rightBtn.enabled = true

		if (name == "left_btn") {
			this.select = this.select - 1
		} else if (name == "right_btn") {
			this.select = this.select + 1
		} else {

		}

		if (this.select <= 1) {
			this.select = 1
			leftBtn.enabled = false
			rightBtn.enabled = true
		}

        let stageMax = FunSystem.getInstance().getFunMaxLevel(this.soulType)
		if ((stage == stageMax && this.select == stage) || (stage != stageMax && this.select >= stage + 1)) {
			leftBtn.enabled = true
			rightBtn.enabled = false
		}
	}

	////////////////////////////////////响应事件//////////////////////////////////
	onClickRefreshBtn(event: egret.TouchEvent) {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			let target = event.target
			let name = target.name
			let stage = this.soulInfo.stage || 1

			this.updateRefreshState(name, stage)

			this.refreshActorWnd()
		}
	}

	//幻化
	onClickTurn(event: egret.TouchEvent) {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.sendTurnRequest(this.soulType, this.select)
		}
	}

	//升阶
	onClickUpgrade(event: egret.TouchEvent) {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.upgradeFunction(this.soulType, this, "btn_auto_upgrade", "btn_upgrade")
		}
	}

	//自动升阶
	onClickAutoUpgrade(event: egret.TouchEvent) {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.upgradeAutoFunction(this.soulType, this, "btn_auto_upgrade", "btn_upgrade")
		}
	}

	//属性丹
	onClickProperty(event: egret.TouchEvent) {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.openPropertyFrame(this.soulType)
		}
	}

	//换装
	onClickWearEquip(event: egret.TouchEvent) {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.oneKeyWearEquip(this.soulType, this, this.equipList)
		}
	}

	onClickSearch() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.openFunPropertyFrame(this.soulType, this.select)
		}
	}

	stopAutoUpgrade(args) {
		if (args.funType == this.soulType) {
			FunUITools.upgradeAutoFunctionCheck(this.soulType, this, "btn_auto_upgrade", "btn_upgrade")
		}
	}

	onTipsClick() {
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
		wnd.showWithActivity("shouhunRule")
	}

	onClickShootUp() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.useShootUpItem(this.soulType, this)
		}
	}

	onClickFunPrize() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.openUpgradeFunPrize(this.soulType)
		}
	}

	//红点提示
	refreshPetDotTips() {

	}
}