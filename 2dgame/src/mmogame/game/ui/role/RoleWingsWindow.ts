class RoleWingsWindow extends BaseCtrlWnd {
	mElemList;
	select: any;
	list: any;
	unreal: any;
	recvList: any;
	endIndex: any
	isEnough;
	type

	isAuto: boolean;

	public initObj(...params: any[]) {
		this.type = cellOptionsIndex.HeroWing
	}
	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;

		var elemInfo = [

			{ ["name"]: "btn_skin", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSkinClick },
			{ ["name"]: "btn_M_search", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSearchClick },
			{ ["name"]: "btn_property_dan", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPropertyClick },
			{ ["name"]: "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLeftClick },
			{ ["name"]: "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRightClick },
			{ ["name"]: "btn_M_unreal", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUnrealClick },
			{ ["name"]: "btn_upgrade", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUpClick },
			{ ["name"]: "btn_auto_upgrade", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAutoUpClick },
			{ ["name"]: "btn_equip", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onEquipClick },
			{ ["name"]: "btn_shootUp", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickShootUp },
			{ ["name"]: "fun_prize_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFunPrize },
		];

		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		this.select = 0;

		this.mElemList["btn_shootUp"].visible = (false)

		this.mElemList["rd_add_force"].setAlignFlag(gui.Flag.CENTER_CENTER);


		this.mElemList["name_txt"].textColor = gui.Color.ublack;
		this.mElemList["stage_txt"].textColor = gui.Color.ublack;



	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateMartiral, this)
		RegisterEvent(EventDefine.PET_FUN_INFO_REFRESH, this.onRefresh, this)
		RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.updateFrame, this)
		RegisterEvent(EventDefine.FUN_AUTO_FAIL, this.stopAutoUpgrade, this)
		RegisterEvent(EventDefine.PET_FUN_TOP_UPDATE, this.updateTopWnd, this)
		this.mElemList["group_mounts"].visible = true;
		this.mElemList["label_wndName"].text = Localize_cns("ROLE_TXT14");
		this.mElemList["HeroRide_checkbox"].visible = false
		this.mElemList["HeroWing_checkbox"].visible = true
		this.mElemList["image_skill"].source = "cb_text01"
		this.mElemList["image_equip"].source = "cb_text02"
		this.mElemList["actor"].visible = true
		FunUITools.resetUpgradeBtnState(this.type, this, "btn_auto_upgrade", "btn_upgrade")
		this.onRefresh()
		this.onRefreshTop()
		FunUITools.updateShootUpBtnState(this.type, this)

		FunUITools.checkExpDan(this.type, this)
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateMartiral, this)
		UnRegisterEvent(EventDefine.PET_FUN_INFO_REFRESH, this.onRefresh, this);
		UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.updateFrame, this);
		UnRegisterEvent(EventDefine.FUN_AUTO_FAIL, this.stopAutoUpgrade, this)
		UnRegisterEvent(EventDefine.PET_FUN_TOP_UPDATE, this.updateTopWnd, this)
		this.mElemList["group_mounts"].visible = false;
		this.mElemList["actor"].visible = false
		if (this.mElemList["actorview"]) {
			this.mElemList["actorview"].clearView()
		}

		this.select = null
	}

	updateMartiral() {
		FunUITools.updateNeedMaterial(this.type, this)
	}

	updateTopWnd(args? : FunTurnUpdateEvent) {
		if(args && args.funIndex == this.type && args.isLevelUp){
			this.select = null
		}
		this.onRefreshTop()
	}

	updateFrame() {
		this.onRefresh()

		if (this.isAuto) {
			let info = FunSystem.getInstance().getFunInfoWithType(this.type)
			if (info && info.stageexp == 0) {
				FunUITools.resetUpgradeBtnState(this.type, this, "btn_auto_upgrade", "btn_upgrade")
			} else {
				FunUITools.upgradeAutoFunctionCheck(this.type, this, "btn_auto_upgrade", "btn_upgrade")
			}
		}
	}

	onRefresh() {
		let info = FunSystem.getInstance().getFunInfoWithType(this.type)
		if (size_t(info) == 0) return;
		//本级经验 现在经验
		FunUITools.updateExpProgress(this.type, this)

		//消耗
		FunUITools.updateNeedMaterial(this.type, this)

		//更新战力
		FunUITools.updateForceNum(this.type, this)

		//装备
		let equiplist = FunUITools.checkWearEquip(this.type, this)
		if (size_t(equiplist) == 0) {
			this.mElemList["btn_equip"].visible = false
		} else {
			this.mElemList["btn_equip"].visible = true
		}

		//技能装备
		this.onInitItemBox()

		//满级检测
		FunUITools.checkFullLevel(this.type, this, "btn_auto_upgrade", "btn_upgrade", "full_lv_txt")
	}
	onRefreshTop() {

		this.recvList = FunSystem.getInstance().getFunInfoWithType(this.type)
		if (size_t(this.recvList) == 0) return;
		let info = this.recvList;

		this.list = GameConfig.FunShapeConfig[cellOptionsName[this.type - 1]];
		let stage = info.stage
		this.endIndex = stage + 1;
		this.unreal = info.curshape
		this.select = this.select || stage
		let arr = this.list;
		if (size_t(arr) == 0) return;
		let index = this.select;

		if (arr[this.select]) {
			//更新名字，阶数
			FunUITools.updateActorName(this.type, this, this.select)
			FunUITools.updateActorStage(this.type, this, this.select)
		}

		this.mElemList["group_M_effect"].visible = false;
		this.mElemList["turn_icon"].visible = false;
		this.mElemList["btn_M_unreal"].visible = false;
		this.mElemList["btn_right"].enabled = true
		this.mElemList["btn_left"].enabled = true


		if (index == this.unreal) {
			this.mElemList["turn_icon"].visible = true;
		} else if (index == this.endIndex) {
			this.mElemList["group_M_effect"].visible = true;
			this.mElemList["btn_right"].enabled = false
			FunUITools.updateAddForceNum(this.type, this)
		} else {
			this.mElemList["btn_M_unreal"].visible = true;

		}

		if (this.select == 1) {
			this.mElemList["btn_left"].enabled = false
		}

		let maxLevel = FunSystem.getInstance().getFunMaxLevel(this.type)
		if (this.select >= maxLevel) {
			this.mElemList["btn_right"].enabled = false
		}

		//更新actorview

		if (this.mElemList["actorview"] == null) {
			this.mElemList["actorview"] = <UIActorView>UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["actor"])
		}
		let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			rideShapeId: playerInfo.rideShapeId,
			wingShapeId: this.list[this.select].Shape,
		}
		modelList["vocation"] = playerInfo.vocation
		modelList["sexId"] = playerInfo.sexId
		this.mElemList["actorview"].updateByPlayerAppearInfo(modelList)
	}

	onInitItemBox() {

		FunUITools.updateEquipWnd(this.type, this)
		//更新技能 
		FunUITools.updateSkillWnd(this.type, this)

	}
	onSkillClick(event: egret.TouchEvent) {
		let name = event.target.name
		let index = name.replace(/[^0-9]/ig, "")

	}
	public onSkinClick(): void {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.openSkinsFrame(this.type)
		}
	}

	public onSearchClick(): void {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.openFunPropertyFrame(this.type, this.select)
		}
	}

	public onUnrealClick(): void {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			//this.unreal = this.select;
			//this.onRefreshTop();
			FunUITools.sendTurnRequest(this.type, this.select)
		}
	}


	public onRightClick(): void {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			if (this.select == this.endIndex || this.select == -1) return;
			this.select = this.select + 1;
			this.onRefreshTop();
		}
	}
	public onLeftClick(): void {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			if (this.select == 1 || this.select == -1) return;
			this.select = this.select - 1;
			this.onRefreshTop();
		}
	}
	public onPropertyClick(): void {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.openPropertyFrame(this.type)
		}
	}
	onUpClick() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.upgradeFunction(this.type, this, "btn_auto_upgrade", "btn_upgrade")
		}
	}
	onAutoUpClick() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.upgradeAutoFunction(this.type, this, "btn_auto_upgrade", "btn_upgrade")
		}
	}


	onEquipClick() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			let equiplist = FunUITools.checkWearEquip(this.type, this)
			if (size_t(equiplist) == 0) return
			FunUITools.oneKeyWearEquip(this.type, this, equiplist)
		}
	}

	stopAutoUpgrade(args) {
		if (args.funType == this.type) {
			FunUITools.upgradeAutoFunctionCheck(this.type, this, "btn_auto_upgrade", "btn_upgrade")
		}
	}

	onTipsClick() {
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
		wnd.showWithActivity("wingRule")
	}

	onClickShootUp() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.useShootUpItem(this.type, this)
		}
	}

	onClickFunPrize() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 3) {
			FunUITools.openUpgradeFunPrize(this.type)
		}
	}
}