class XianLvFrame extends BaseWnd {
	tabWndList: UITabWndList
	tabIndex: number
	xianlvListBox: UIXianLvListBox
	selectId
	zhanLi;
	pos;
	xianLvActor: UIActorView
	auto


	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/xianlv/XianLvLayout.exml"]
		this.tabIndex = -1
		this.auto = false
	}
	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();


		var elemInfo = [
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "roman_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRomanClick },
			{ ["name"]: "state_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onStateClick },
			{ ["name"]: "btn_look", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLookClick },
			{ ["name"]: "add_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAddClick },

			{ ["name"]: "btn_jiHuo", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onJiHuoClick },
			{ ["name"]: "top_right_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRightClick },
			{ ["name"]: "top_left_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLeftClick },
			{ ["name"]: "btn_tips", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTipsClick },

			{ ["name"]: "anim_wnd", ["messageFlag"]: true }
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let tabInfoList = [
			{ name: "xianLv", wnd: XianLvXianLvWindow.newObj(this.mLayoutNode, this), check: this.xianlvClick, obj: this },
			{ name: "fazhen", wnd: XianLvZhenFaWindow.newObj(this.mLayoutNode, this), check: this.fazhenClick, obj: this },
			{ name: "xianwei", wnd: XianLvXianWeiWindow.newObj(this.mLayoutNode, this), check: this.xianweiClick, obj: this },
			{ name: "shengXing", wnd: XianLvShengXingWindow.newObj(this.mLayoutNode, this), check: this.shengxingClick, obj: this },
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

		this.tabWndList.setSelectedCallback(this.refreshDotTips, this)

		this.mElemList["material_rd"].setAlignFlag(gui.Flag.LEFT_CENTER)
		this.mElemList["rd_starCost"].setAlignFlag(gui.Flag.LEFT_CENTER)
		this.mElemList["rd_skill_star"].setAlignFlag(gui.Flag.CENTER_CENTER)

		let group = <eui.Group>this.mElemList["xianLv_group"]
		this.xianlvListBox = UIXianLvListBox.newObj(this.mLayoutNode, "xianLv", 0, 0, group.width, group.height, group)

		//this.selectId = this.xianlvListBox.setXianLvList()
		this.selectId = 0
		this.xianlvListBox.setClickListner(this.autoReceiveSelect, this)
		this.mElemList["skillBox3"] = UISkillBox.newObj(this.mLayoutNode, "skillBox3", 0, 0, this.mElemList["skill_image"])

		this.mElemList["link_view"] = UILinkView.newObj(this.mLayoutNode, "link_view", 0, 0, this.mElemList["link_wnd"])
		//this.mElemList["link_view"].setCallBack(this.onClickGain, this)

		let t: gui.RichDisplayer = this.mElemList["rd_way"]
		t.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWayClick, this)

		this.xianLvActor = UIActorView.newObj(this.mLayoutNode, "xianlvActor_view", 0, 0, this.mElemList["xianLvActor_wnd"])

	}
	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.refreshDotTips, this)
		RegisterEvent(EventDefine.ACTOR_XIANLV_LIST_UPDATE, this.updateWnd, this)
		this.mLayoutNode.visible = true;
		this.selectId = this.xianlvListBox.setXianLvList()
		this.tabWndList.setWndVisible(true);

		if (this.tabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}


		//隐藏直升一阶
		let day = GetServerDay()
		this.mElemList["btn_shootUp"].visible = (day <= 8)
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.refreshDotTips, this)
		UnRegisterEvent(EventDefine.ACTOR_XIANLV_LIST_UPDATE, this.updateWnd, this)
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);
		this.xianLvActor.clearView()

		let actorView: UIActorView = this.mElemList["fun_model"]
		if (actorView) {
			actorView.clearView()
		}
		FunUITools.clearActorData(this)

	}

	updateWnd() {
		//this.selectId = this.xianlvListBox.setXianLvList()
		let wnd = this.tabWndList.getCurrentWnd()
		if (wnd && wnd.refreshWithId) {
			wnd.refreshWithId(this.selectId)
		}
	}

	showWithIndex(index) {
		this.tabIndex = index;
		this.showWnd();
	}

	autoReceiveSelect(xianLv) {
		this.selectId = xianLv.Id
		//this.onRefresh()
		this.refreshDotTips()
		let wnd = this.tabWndList.getCurrentWnd()
		if (wnd && wnd.refreshWithId) {
			wnd.refreshWithId(this.selectId)
			if (wnd.resetUpgradeBtnState) {
				wnd.resetUpgradeBtnState()
			}
		}
	}

	///--------------btn响应事件
	onStateClick() {
		let name = this.mElemList["state_btn"].text
		if (name == Localize_cns("XIANLV_TXT3")) {
			let wnd: XianLvFightFrame = WngMrg.getInstance().getWindow("XianLvFightFrame")
			wnd.onShowWnd(this.selectId)
		} else if (name == Localize_cns("XIANLV_TXT2")) {
			RpcProxy.call("C2G_ACTOR_XIANLV_COMBAT_SET", this.selectId, 0)
		}
	}
	onAddClick() {
		let name = GameConfig.ActorXianLvConfig[this.selectId].name
		let wnd = WngMrg.getInstance().getWindow("XianLvPropertyFrame")
		wnd.onShowWnd(this.selectId)
	}

	onJiHuoClick() {
		RpcProxy.call("C2G_ACTOR_XIANLV_UNLOCK", this.selectId)
	}
	onRomanClick() {
		let wnd = WngMrg.getInstance().getWindow("XianLvQiYuanFrame")
		wnd.showWnd()
	}
	onLeftClick() {
		this.xianlvListBox.leftMove()
		this.refreshDotTips()
	}

	onRightClick() {
		this.xianlvListBox.rightMove()
		this.refreshDotTips()
	}


	onLookClick() {
		let wnd = WngMrg.getInstance().getWindow("XianLvAttributeFrame")
		wnd.onShowWnd(this.selectId)
	}


	onSkillClick(id, level, userdata) {
		let wnd = WngMrg.getInstance().getWindow("XianLvSkillDesFrame")
		wnd.onShowWnd(id, level)
	}

	onWayClick() {
		let wnd: ShopYuanBaoFrame = WngMrg.getInstance().getWindow("ShopYuanBaoFrame")
		wnd.showWithIndex(3)
	}

	//////radiobutton
	xianlvClick() {
		return true
	}

	fazhenClick() {
		return true
	}

	xianweiClick() {
		//MsgSystem.addTagTips(Localize_cns("45级开启"))
		return true
	}

	shengxingClick() {
		return true
	}


	////////////////////红点提示/////////////////////
	//自定义红点继承实现
	refreshDotTipsImp() {
		FunUITools.refreshDanDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshEquipDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshSkillDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshUpgradeDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshShootUpDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshFunPrizeDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		this.refreshIconDot()
	}

	getDotTipsArgsImp(checkParam) {
		let args: any = {}
		args.index = this.tabWndList.getTabIndex()
		args.type = this.tabWndList.getCurrentWnd().type
		args.xianlvId = this.selectId
		return args
	}

	onTipsClick() {
		let wnd = this.tabWndList.getCurrentWnd()
		if (wnd) {
			wnd.onTipsClick()
		}
	}

	refreshIconDot() {
		let index = this.tabWndList.getTabIndex()
		this.xianlvListBox.onRefreshDotTips(this, index)
	}
}