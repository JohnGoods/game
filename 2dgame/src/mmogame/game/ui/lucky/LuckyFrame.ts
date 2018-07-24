class LuckyFrame extends BaseWnd {
	tabWndList: UITabWndList
	radioConfig;
	activityIndex: number
	isAnimation = false
	index;
	curTabIndex;
	tabInfoList

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/lucky/LuckyLayout.exml"]
		this.curTabIndex = -1
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		//this.mLayoutNode.setDoModal(true)

		this.mElemList["group_tab1"].visible = false;
		this.mElemList["group_tab2"].visible = false;
		this.mElemList["group_tab3"].visible = false;
		this.mElemList["first_item_group"].visible = false;

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "lucky_btn1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			{ ["name"]: "lucky_btn2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			{ ["name"]: "lucky_btn3", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			{ ["name"]: "btn_shop", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onShopClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		//判断活动是否开启
		this.tabInfoList = []
		this.mElemList["radio1"].visible = false;
		this.mElemList["radio2"].visible = false;
		this.mElemList["radio3"].visible = false;
		this.disposeData()

		// let tabInfoList = [
		// 	{ name: "radio1", wnd: XunbaoWindow.newObj(this.mLayoutNode, this) },
		// 	{ name: "radio2", wnd: LuckyWindow.newObj(this.mLayoutNode, this) },
		// ]

		// for(let i = 0; i<size_t(this.tabInfoList) ;i++){
		// 	this.mElemList["radio"+(i+1)].visible = true;
		// }

		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, this.tabInfoList)

		for (let i = 1; i < 4; i++) {
			let rd = this.mElemList["lucky_rd" + i]
			rd.setAlignFlag(gui.Flag.H_CENTER)
		}

		//this.tabWndList.setSelectedCallback(this.test, this)
	}

	disposeData() {
		let config = [
			{ ["activityIndex"]: PayActivityIndex.PET_LOTTERY_A, ["wnd"]: XunbaoWindow.newObj(this.mLayoutNode, this), ["text"]: Localize_cns("LUCKY_TXT1") },
			{ ["activityIndex"]: PayActivityIndex.PET_LOTTERY, ["wnd"]: LuckyWindow.newObj(this.mLayoutNode, this), ["text"]: Localize_cns("LUCKY_TXT2") },
			// {["activityIndex"]:PayActivityIndex.GOD_PET_TURN,["wnd"]: GodPetTurntableWindow.newObj(this.mLayoutNode, this),["text"]:Localize_cns("LUCKY_TXT11")},
			{ ["activityIndex"]: PayActivityIndex.C_LIEHUN, ["wnd"]: null, check: this.onLieHunClick, ["text"]: Localize_cns("SHENHUN_TITLE_TXT3") },
		]
		let list = []
		let index = 1
		for (let i = 0; i < size_t(config); i++) {
			let info = config[i]
			let activityIndex = info.activityIndex
			let check = false
			//钟馗猎魂特殊处理
			if (activityIndex == PayActivityIndex.C_LIEHUN) {
				let level = GetHeroProperty("level")
				check = level >= playerOptions.shenhun
			}else{
				check = ActivitySystem.getInstance().checkActivityIsOpen(activityIndex)
			}
			if (check) {
				// if(true){
				info["name"] = "radio" + index
				table_insert(list, info)
				index = index + 1
			}
		}
		this.tabInfoList = list
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = true;
		this.isAnimation = false
		this.onRefresh()
		this.tabWndList.setWndVisible(true);
		this.setBtnEnable(true)

		for (let i = 0; i < 3; i++) {
			let info = this.tabInfoList[i]
			if (info) {
				this.mElemList["radio" + (i + 1)].visible = true
				this.mElemList["radio" + (i + 1)].label = info.text
			} else {
				this.mElemList["radio" + (i + 1)].visible = false
				this.mElemList["radio" + (i + 1)].label = ""
			}
		}
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);
	}

	onRefresh() {
		if (this.activityIndex == PayActivityIndex.PET_LOTTERY_A) {
			this.mElemList["lucky_btn1"].text = Localize_cns("LUCKY_TXT6")
			this.mElemList["lucky_btn2"].text = Localize_cns("LUCKY_TXT7")
			this.mElemList["lucky_btn3"].text = Localize_cns("LUCKY_TXT6")
		} else if (this.activityIndex == PayActivityIndex.PET_LOTTERY) {
			this.mElemList["lucky_btn1"].text = Localize_cns("LUCKY_TXT8")
			this.mElemList["lucky_btn2"].text = Localize_cns("LUCKY_TXT9")
			this.mElemList["lucky_btn3"].text = Localize_cns("LUCKY_TXT8")
		}
		if (this.curTabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.curTabIndex)
			this.curTabIndex = -1
		}
	}

	initItemWindow(window, data) {

	}

	refreshItemWindow(window, data) {

	}

	setBtnEnable(b: boolean) {
		// this.mElemList["btn_close_top"].enabled = b
		// this.mElemList["btn_close"].enabled = b
		// if(this.mElemList["radio1"]){
		this.mElemList["radio1"].enabled = b
		// }
		// if(this.mElemList["radio2"]){
		this.mElemList["radio2"].enabled = b
		// }
		// if(this.mElemList["radio3"]){
		this.mElemList["radio3"].enabled = b
		// }
	}

	onClick(args) {
		if (this.radioConfig == null)
			return;
		let name = args.target.name
		let index = name.replace(/[^0-9]/ig, "")	//选择的是第几个按钮
		index = tonumber(index)
		let info = this.radioConfig[index - 1] || null
		if (info == null) {
			return
		}

		if (this.isAnimation == true) {
			return
		}

		let bindGold = GetHeroProperty("bindGold")
		let curGold = GetHeroProperty("gold")
		// let config = info.config[index]
		let typeS = info[1]
		let needNum = info[2]
		if (typeS == opItemUnit.BIND_CURRENCY) {
			if (needNum > bindGold) {
				MsgSystem.addTagTips(Localize_cns("LUCKY_TXT3"))
				return
			}
		} else if (typeS == opItemUnit.CURRENCY) {
			if (needNum > curGold) {
				MsgSystem.addTagTips(Localize_cns("LUCKY_TXT4"))
				return
			}
		}
		this.index = index

		//背包满
		if (CheckBeiBaoEquipWillFull()) {
			return
		}
		this.setBtnEnable(false)
		RpcProxy.call("C2G_DoOperateActivity", this.activityIndex, [index])	//抽奖
	}

	onShopClick() {
		let wnd: ShopShenChongFrame = WngMrg.getInstance().getWindow("ShopShenChongFrame")
		wnd.showWithIndex(0)
	}

	onLieHunClick() {
		let wnd: LieHunFrame = WngMrg.getInstance().getWindow("LieHunFrame")
		wnd.showWnd()
		return false
	}

	showWithIndex(activityIndex) {
		this.disposeData()
		let index = -1
		for (let i = 0; i < size_t(this.tabInfoList); i++) {
			let info = this.tabInfoList[i]
			if (activityIndex == info.activityIndex) {
				index = i
				break
			}
		}
		if (index != -1) {
			this.curTabIndex = index
		}
		this.showWnd()
	}
}