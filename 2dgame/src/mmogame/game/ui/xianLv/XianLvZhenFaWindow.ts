class XianLvZhenFaWindow extends BaseCtrlWnd {
	mElemList;
	select: any;
	list: any;
	unreal: any;
	recvList: any;
	endIndex: any
	isEnough;
	Actor: UIActorView
	type

	isAuto: boolean;

	public initObj(...params: any[]) {
		this.type = cellOptionsIndex.XianLvFaZhen

	}
	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;

		var elemInfo = [
			{ ["name"]: "btn_property_dan", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPropertyClick },
			{ ["name"]: "btn_search", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSearchClick },
			{ ["name"]: "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLeftClick },
			{ ["name"]: "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRightClick },
			{ ["name"]: "btn_unreal", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUnrealClick },
			{ ["name"]: "btn_upgrade", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUpClick },
			{ ["name"]: "btn_auto_upgrade", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAutoUpClick },
			{ ["name"]: "btn_equip", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onEquipClick },
			{ ["name"]: "btn_shootUp", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickShootUp },
			{ ["name"]: "fun_prize_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFunPrize },
		];

		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		this.select = 0;

		this.mElemList["btn_shootUp"].visible = (false)

		this.mElemList["material_rd"].setAlignFlag(gui.Flag.LEFT_BOTTOM)
		this.mElemList["rd_add_force"].setAlignFlag(gui.Flag.CENTER_CENTER);
		this.mElemList["name_txt"].textColor = gui.Color.ublack;
		this.mElemList["stage_txt"].textColor = gui.Color.ublack;

		this.Actor = UIActorView.newObj(this.mElemList, "xianLvActor", 0, 0, this.mElemList["actor"])
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.PET_FUN_INFO_REFRESH, this.onRefresh, this)
		RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.updateFrame, this)
		RegisterEvent(EventDefine.FUN_AUTO_FAIL, this.stopAutoUpgrade, this)
		RegisterEvent(EventDefine.PET_FUN_TOP_UPDATE, this.updateTopWnd, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCost, this)
		this.mElemList["group_zhenFa"].visible = true;
		this.mElemList["label_wndName"].text = Localize_cns("XIANLV_TXT11");
		this.mElemList["XianLvXianWei_checkbox"].visible = false;
		this.mElemList["XianLvFaZhen_checkbox"].visible = true;
		this.mElemList["image_skill"].source = "xl_text08"
		this.mElemList["image_equip"].source = "xl_text09"
		this.mElemList["actor_wnd"].visible = true
		this.mElemList["actor"].visible = true
		FunUITools.resetUpgradeBtnState(this.type, this, "btn_auto_upgrade", "btn_upgrade")
		this.onRefresh()
		this.onRefreshTop()
		FunUITools.updateShootUpBtnState(this.type, this)

		FunUITools.checkExpDan(this.type, this)
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PET_FUN_INFO_REFRESH, this.onRefresh, this);
		UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.updateFrame, this);
		UnRegisterEvent(EventDefine.FUN_AUTO_FAIL, this.stopAutoUpgrade, this)
		UnRegisterEvent(EventDefine.PET_FUN_TOP_UPDATE, this.updateTopWnd, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCost, this)
		this.mElemList["group_zhenFa"].visible = false;
		this.mElemList["actor_wnd"].visible = false
		this.mElemList["actor"].visible = false
		this.Actor.clearView()
		this.select = null
		this.isAuto = false
	}

	updateTopWnd(args? : FunTurnUpdateEvent) {
		if(args && args.funIndex == this.type && args.isLevelUp){
			this.select = null
		}
		this.onRefreshTop()
	}

	updateCost(){
		FunUITools.updateNeedMaterial(this.type, this)
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
		let templist = FunUITools.checkWearEquip(this.type, this)
		if (size_t(templist) == 0) {
			this.mElemList["btn_equip"].visible = false
		} else {
			this.mElemList["btn_equip"].visible = true
		}

		//
		this.onInitItemBox();

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

		this.mElemList["group_effect"].visible = false;
		this.mElemList["turn_icon"].visible = false;
		this.mElemList["btn_unreal"].visible = false;
		this.mElemList["btn_right"].enabled = true
		this.mElemList["btn_left"].enabled = true

		if (index == this.unreal) {
			this.mElemList["turn_icon"].visible = true;
		} else if (index == this.endIndex) {
			this.mElemList["group_effect"].visible = true;
			this.mElemList["btn_right"].enabled = false
			FunUITools.updateAddForceNum(this.type, this)
		} else {
			this.mElemList["btn_unreal"].visible = true;

		}

		if (this.select == 1) {
			this.mElemList["btn_left"].enabled = false
		}

		let maxLevel = FunSystem.getInstance().getFunMaxLevel(this.type)
		if (this.select >= maxLevel) {
			this.mElemList["btn_right"].enabled = false
		}
		//更新actorview
		FunUITools.updateActorModel(this.type, this, this.select)

		let playerInfo = GetHeroPropertyInfo()
		let xianlvId = playerInfo.xianlvShapeId
		let modelId = GetXianlvModel(xianlvId)
		if (xianlvId != null && xianlvId != 0) {
			this.Actor.updateByPlayer(modelId)
		}
	}

	onInitItemBox() {

		FunUITools.updateEquipWnd(this.type, this)
		//更新技能 
		FunUITools.updateSkillWnd(this.type, this)

	}


	public onUnrealClick(): void {
		if (this.mParentWnd.tabWndList.getTabIndex() == 1) {
			//this.unreal = this.select;
			//this.onRefreshTop();
			FunUITools.sendTurnRequest(this.type, this.select)
		}
	}


	public onRightClick(): void {
		if (this.mParentWnd.tabWndList.getTabIndex() == 1) {
			if (this.select == this.endIndex || this.select == -1) return;
			this.select = this.select + 1;
			this.onRefreshTop();
		}
	}
	public onLeftClick(): void {
		if (this.mParentWnd.tabWndList.getTabIndex() == 1) {
			if (this.select == 1 || this.select == -1) return;
			this.select = this.select - 1;
			this.onRefreshTop();
		}
	}
	public onPropertyClick(): void {
		if (this.mParentWnd.tabWndList.getTabIndex() == 1) {
			FunUITools.openPropertyFrame(this.type)
		}
	}

	public onSearchClick(): void {
		if (this.mParentWnd.tabWndList.getTabIndex() == 1) {
			FunUITools.openFunPropertyFrame(this.type, this.select)
		}
	}

	onUpClick() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 1) {
			FunUITools.upgradeFunction(this.type, this, "btn_auto_upgrade", "btn_upgrade")
		}
	}
	onAutoUpClick() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 1) {
			FunUITools.upgradeAutoFunction(this.type, this, "btn_auto_upgrade", "btn_upgrade")
		}
	}
	onEquipClick() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 1) {
			let templist = FunUITools.checkWearEquip(this.type, this)
			FunUITools.oneKeyWearEquip(this.type, this, templist)
		}
	}

	stopAutoUpgrade(args) {
		if (args.funType == this.type) {
			FunUITools.upgradeAutoFunctionCheck(this.type, this, "btn_auto_upgrade", "btn_upgrade")
		}
	}

	onTipsClick() {
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
		wnd.showWithActivity("fazhenRule")
	}

	onClickShootUp() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 1) {
			FunUITools.useShootUpItem(this.type, this)
		}
	}

	onClickFunPrize() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 1) {
			FunUITools.openUpgradeFunPrize(this.type)
		}
	}
}