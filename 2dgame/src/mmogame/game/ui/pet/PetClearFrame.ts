class PetClearFrame extends BaseWnd {
	petId: number;
	lockList: any[];
	cost: number;

	isOnWash: boolean;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/pet/PetClearLayout.exml"]

		this.petId = -1
		this.lockList = []
		this.cost = 0
		this.isOnWash = false
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "wash_btn", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickLowWash },
			{ ["name"]: "high_wash_btn", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickHighWash },
			{ ["name"]: "exchange_btn", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickExchange },

			{ ["name"]: "btn_close", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

			{ ["name"]: "auto", ["color"]: gui.Color.saddlebrown },
			{ ["name"]: "btn_tips", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTipsClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		AddRdContent(this.mElemList["clear_tips_rd"], Localize_cns("PET_TXT7"), "ht_20_cc", "ublack", 3)

		for (let i = 0; i < 6; i++) {
			let checkBox = <eui.CheckBox>this.mElemList["lt_check" + i]
			checkBox.addEventListener(egret.TouchEvent.CHANGE, this.onClickCheckBox, this)

			this.mElemList["skillBox_lt_" + i] = UISkillBox.newObj(this.mLayoutNode, "skillBox_lt_" + i, 0, 0, this.mElemList["lt_wnd" + i])

			this.mElemList["rt_check" + i].touchEnabled = false

			this.mElemList["skillBox_rt_" + i] = UISkillBox.newObj(this.mLayoutNode, "skillBox_rt_" + i, 0, 0, this.mElemList["rt_wnd" + i])
		}

		this.mElemList["prop_rd"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["high_prop_rd"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["skill_lock_rd"].setAlignFlag(gui.Flag.H_CENTER)

		this.mElemList["discount_wnd"].visible = false
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.ITEM_UPDATE, this.refreshItem, this)
		RegisterEvent(EventDefine.PET_UPDATE, this.refreshClearFrame, this)
		this.mLayoutNode.visible = true;
		this.refreshFrame()

		this.refreshDotTips()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ITEM_UPDATE, this.refreshItem, this)
		UnRegisterEvent(EventDefine.PET_UPDATE, this.refreshClearFrame, this)
		this.mLayoutNode.visible = false;
		this.isOnWash = false
	}

	refreshClearFrame() {
		this.isOnWash = false
		this.refreshFrame()
	}

	refreshFrame() {
		if (this.petId <= 0) return;

		let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(this.petId)
		let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)

		//当前技能列表
		let curList = petConfigInfo.passiveskill
		if (petNetInfo.passskilllist && size_t(petNetInfo.passskilllist) > 0) {
			curList = petNetInfo.passskilllist
		}

		//洗练技能列表
		let washList = petNetInfo.washskilllist || []

		for (let i = 0; i < 6; i++) {
			//当前技能
			if (curList[i]) {
				let skillId = curList[i]
				this.mElemList["skillBox_lt_" + i].updatePetSkill(skillId)
				this.mElemList["lt_check" + i].visible = true

				let info = SkillSystem.getInstance().getPetSkillInfo(skillId)
				let config = GameConfig.SkillDescribeConfig[skillId]
				let quality = config[1].Quality
				let color = GetQualityColorStr(quality, false)
				let sName = SkillSystem.getInstance().getSkillName(skillId)
				let sDes = SkillSystem.getInstance().getSkillDes(skillId)
				let str = "#" + color + sName + "#br#saddlebrown" + sDes
				AddRdContent(this.mElemList["lt_rd" + i], str, "ht_18_cc", "saddlebrown", 5)
			} else {
				this.mElemList["lt_check" + i].visible = false
				this.mElemList["skillBox_lt_" + i].lock()
				AddRdContent(this.mElemList["lt_rd" + i], Localize_cns("NOT_OPEN"), "ht_18_cc", "saddlebrown")
			}

			//洗练技能
			if (washList[i]) {
				let skillId = washList[i]
				this.mElemList["skillBox_rt_" + i].updatePetSkill(skillId)
				this.mElemList["rt_check" + i].visible = true

				let info = SkillSystem.getInstance().getPetSkillInfo(skillId)
				let config = GameConfig.SkillDescribeConfig[skillId]
				let quality = config[1].Quality
				let color = GetQualityColorStr(quality, false)
				let sName = SkillSystem.getInstance().getSkillName(skillId)
				let sDes = SkillSystem.getInstance().getSkillDes(skillId)
				let str = "#" + color + sName + "#br#saddlebrown" + sDes
				AddRdContent(this.mElemList["rt_rd" + i], str, "ht_18_cc", "ublack", 5)
			} else {
				this.mElemList["rt_check" + i].visible = false
				this.mElemList["skillBox_rt_" + i].lock()
				AddRdContent(this.mElemList["rt_rd" + i], Localize_cns("NOT_OPEN"), "ht_18_cc", "ublack")
			}
		}

		//锁定
		this.initLockWnd()

		//消耗材料
		this.refreshItem()
	}

	//更新材料
	refreshItem() {
		let washConfig = GameConfig.FunSkillWashConfig[cellOptionsName[cellOptionsIndex.PetSkill - 1]][this.petId]
		let lowId = washConfig.itemid
		let highId = washConfig.highitemid
		let lowCount = ItemSystem.getInstance().getItemCount(lowId)
		let lowLimit = washConfig.itemnum
		let highCount = ItemSystem.getInstance().getItemCount(highId)
		let highLimit = washConfig.highitemnum
		let lowcolor = lowCount >= lowLimit ? "#green" : "#red"
		let highcolor = highCount >= highLimit ? "#green" : "#red"
		AddRdContent(this.mElemList["prop_rd"], GetTagIcon(lowId) + lowcolor + lowCount + "/" + lowLimit, "ht_22_cc", "saddlebrown")
		AddRdContent(this.mElemList["high_prop_rd"], GetTagIcon(highId) + highcolor + highCount + "/" + highLimit, "ht_22_cc", "saddlebrown")
	}

	//初始化锁定技能
	initLockWnd() {
		let str = IGlobal.setting.getRoleSetting(UserSetting.TYPE_STRING, "petSkillLock") || ""
		let config = table_load(str) || {}
		this.lockList = config[this.petId] || []

		let checkCount = 0
		for (let i in this.lockList) {
			let lockIndex = tonumber(this.lockList[i]) - 1
			if (this.mElemList["lt_check" + lockIndex]) {
				checkCount = checkCount + 1
				this.mElemList["lt_check" + lockIndex].selected = true
				this.mElemList["lt_check" + lockIndex].source = "cw_jiNengSuo03"
				this.mElemList["rt_check" + lockIndex].source = "cw_jiNengSuo03"
			}
		}
		this.cost = elemWashSkillOptions[cellOptionsIndex.PetSkill].LockSpend[checkCount - 1] || 0
		this.setWashActivityCost()
		AddRdContent(this.mElemList["skill_lock_rd"], String.format(Localize_cns("PET_TXT8"), checkCount, this.cost), "ht_22_cc", "ublack")
	}

    //洗练活动打折
	setWashActivityCost() {
		let list = GetOpenOperateActivityList()
		if (table_isExist(list, PayActivityIndex.PET_WASH)) {
			this.mElemList["discount_wnd"].visible = true
			let dataConfig = GameConfig.SkillWashActivityConfig
			for (let _ in dataConfig) {
				this.cost = this.cost * dataConfig[_].discount
				this.mElemList["discount_txt"].text = (dataConfig[_].discount* 10) + Localize_cns("CARNIVAL_DISCOUNT")
				return
			}
		} else {
			this.mElemList["discount_wnd"].visible = false
		}
	}

	//更新锁定技能数量
	refreshLockWnd() {
		this.lockList = []

		let checkCount = 0

		let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(this.petId)
		let list = petConfigInfo.passiveskill

		for (let i = 0; i < size_t(list); i++) {
			let checkBox = <eui.CheckBox>this.mElemList["lt_check" + i]
			if (checkBox.selected) {
				checkCount = checkCount + 1
				JsUtil.arrayInstert(this.lockList, i + 1)

				this.mElemList["rt_check" + i].source = "cw_jiNengSuo03"
			} else {
				this.mElemList["rt_check" + i].source = "cw_jiNengSuo02"
			}
		}
		this.cost = elemWashSkillOptions[cellOptionsIndex.PetSkill].LockSpend[checkCount - 1] || 0
		this.setWashActivityCost()
		AddRdContent(this.mElemList["skill_lock_rd"], String.format(Localize_cns("PET_TXT8"), checkCount, this.cost), "ht_22_cc", "ublack")

		let str = IGlobal.setting.getRoleSetting(UserSetting.TYPE_STRING, "petSkillLock") || ""
		let config = table_load(str) || {}
		config[this.petId] = this.lockList
		IGlobal.setting.setRoleSetting(UserSetting.TYPE_STRING, "petSkillLock", table_save(config))
	}

	//////////////////////////////////////////////////
	onClickCheckBox(event: egret.TouchEvent) {
		this.refreshLockWnd()
	}

	//低级洗练
	onClickLowWash(args) {
		let washConfig = GameConfig.FunSkillWashConfig[cellOptionsName[cellOptionsIndex.PetSkill - 1]][this.petId]
		let lowId = washConfig.itemid
		let lowCount = ItemSystem.getInstance().getItemCount(lowId)
		let lowLimit = washConfig.itemnum

		let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(this.petId)
		let autoBuy = this.mElemList["auto_check"].selected ? 1 : 0
		//当前技能列表
		let curList = petConfigInfo.passiveskill
		if (size_t(curList) == size_t(this.lockList)) {
			MsgSystem.addTagTips(Localize_cns("PET_SKILL_LOCK"))
			return
		}

		//锁定技能钱不够
		if (GetHeroMoney(opItemUnit.CURRENCY) < this.cost) {
			MsgSystem.addTagTips(Localize_cns("COPY_TXT16"))
			return
		}

		if (lowCount < lowLimit) {
			//自动购买
			if (autoBuy) {
				let price = ShopSystem.getInstance().getBindYBItemPrice(1, lowId)
				let needYB = price * lowLimit + this.cost
				//锁定技能的钱
				if (GetHeroMoney(opItemUnit.CURRENCY) >= needYB) {
					var petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)
					//洗练技能列表
					var washList = petNetInfo.washskilllist || []

					var endQuality = 0
					for (let i in washList) {
						let skillId = washList[i]
						let info = SkillSystem.getInstance().getPetSkillInfo(skillId)
						let config = GameConfig.SkillDescribeConfig[skillId]
						let quality = config[1].Quality
						if (this.lockList.indexOf(tonumber(i) + 1) == -1 && quality >= opPetQuality.purple && quality > endQuality) {
							endQuality = quality
						}
					}

					if (endQuality) {
						let color = GetQualityColorStr(endQuality, true)
						let str = String.format(Localize_cns("PET_TXT44"), color, Localize_cns("QUALITY_TXT" + endQuality))

						let formList = {
							[opPetQuality.purple]: ConfirmFrom.PET_CLEAR_SKILL_PURPLE,
							[opPetQuality.gold]: ConfirmFrom.PET_CLEAR_SKILL_GOLD,
							[opPetQuality.red]: ConfirmFrom.PET_CLEAR_SKILL_RED,
							[opPetQuality.color]: ConfirmFrom.PET_CLEAR_SKILL_CAI,
						}

						let _this = this
						var callback: IDialogCallback = {
							onDialogCallback(result: boolean, userData): void {
								if (result) {
									RpcProxy.call("C2G_ACTOR_PET_SKILL_WASH", _this.petId, 0, autoBuy, _this.lockList)

								}
							}
						}
						MsgSystem.confirmDialog(str, callback, formList[endQuality])
						return
					}

					if (!this.isOnWash) {
						this.isOnWash = true
						RpcProxy.call("C2G_ACTOR_PET_SKILL_WASH", this.petId, 0, autoBuy, this.lockList)

					}
				} else {
					ExecuteMainFrameFunction("chongzhi")
				}
				return
			}
			//MsgSystem.addTagTips(Localize_cns("MATRIAL_NOENGOUGH"))
			let quickWnd = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
			quickWnd.onShowWnd(lowId, lowLimit);
			return
		}

		var petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)
		//洗练技能列表
		var washList = petNetInfo.washskilllist || []

		var endQuality = 0
		for (let i in washList) {
			let skillId = washList[i]
			let info = SkillSystem.getInstance().getPetSkillInfo(skillId)
			let config = GameConfig.SkillDescribeConfig[skillId]
			let quality = config[1].Quality
			if (this.lockList.indexOf(tonumber(i) + 1) == -1 && quality >= opPetQuality.purple && quality > endQuality) {
				endQuality = quality
			}
		}

		let formList = {
			[opPetQuality.purple]: ConfirmFrom.PET_CLEAR_SKILL_PURPLE,
			[opPetQuality.gold]: ConfirmFrom.PET_CLEAR_SKILL_GOLD,
			[opPetQuality.red]: ConfirmFrom.PET_CLEAR_SKILL_RED,
			[opPetQuality.color]: ConfirmFrom.PET_CLEAR_SKILL_CAI,
		}

		if (endQuality) {
			let color = GetQualityColorStr(endQuality, true)
			let str = String.format(Localize_cns("PET_TXT44"), color, Localize_cns("QUALITY_TXT" + endQuality))
			let _this = this
			var callback: IDialogCallback = {
				onDialogCallback(result: boolean, userData): void {
					if (result) {
						RpcProxy.call("C2G_ACTOR_PET_SKILL_WASH", _this.petId, 0, autoBuy, _this.lockList)

					}
				}
			}
			MsgSystem.confirmDialog(str, callback, formList[endQuality])
			return
		}

		if (!this.isOnWash) {
			this.isOnWash = true
			RpcProxy.call("C2G_ACTOR_PET_SKILL_WASH", this.petId, 0, autoBuy, this.lockList)

		}
	}

	//高级洗练
	onClickHighWash(args) {
		if (this.isOnWash) {
			return
		}

		let washConfig = GameConfig.FunSkillWashConfig[cellOptionsName[cellOptionsIndex.PetSkill - 1]][this.petId]
		let highId = washConfig.highitemid
		let highCount = ItemSystem.getInstance().getItemCount(highId)
		let highLimit = washConfig.highitemnum

		let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(this.petId)
		let autoBuy = this.mElemList["auto_check"].selected ? 1 : 0
		//当前技能列表
		let curList = petConfigInfo.passiveskill
		if (size_t(curList) == size_t(this.lockList)) {
			MsgSystem.addTagTips(Localize_cns("PET_SKILL_LOCK"))
			return
		}

		//锁定技能钱不够
		if (GetHeroMoney(opItemUnit.CURRENCY) < this.cost) {
			MsgSystem.addTagTips(Localize_cns("COPY_TXT16"))
			return
		}

		if (highCount < highLimit) {
			//自动购买
			if (autoBuy) {
				let price = ShopSystem.getInstance().getBindYBItemPrice(1, highId)
				let needYB = price * highLimit + this.cost
				if (GetHeroMoney(opItemUnit.CURRENCY) >= needYB) {
					var petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)
					//洗练技能列表
					var washList = petNetInfo.washskilllist || []

					var endQuality = 0
					for (let i in washList) {
						let skillId = washList[i]
						let info = SkillSystem.getInstance().getPetSkillInfo(skillId)
						let config = GameConfig.SkillDescribeConfig[skillId]
						let quality = config[1].Quality
						if (this.lockList.indexOf(tonumber(i) + 1) == -1 && quality >= opPetQuality.purple && quality > endQuality) {
							endQuality = quality
						}
					}

					let formList = {
						[opPetQuality.purple]: ConfirmFrom.PET_CLEAR_SKILL_PURPLE,
						[opPetQuality.gold]: ConfirmFrom.PET_CLEAR_SKILL_GOLD,
						[opPetQuality.red]: ConfirmFrom.PET_CLEAR_SKILL_RED,
						[opPetQuality.color]: ConfirmFrom.PET_CLEAR_SKILL_CAI,
					}

					if (endQuality) {
						let color = GetQualityColorStr(endQuality, true)
						let str = String.format(Localize_cns("PET_TXT44"), color, Localize_cns("QUALITY_TXT" + endQuality))
						let _this = this
						var callback: IDialogCallback = {
							onDialogCallback(result: boolean, userData): void {
								if (result) {
									RpcProxy.call("C2G_ACTOR_PET_SKILL_WASH", _this.petId, 1, autoBuy, _this.lockList)

								}
							}
						}
						MsgSystem.confirmDialog(str, callback, formList[endQuality])
						return
					}

					if (!this.isOnWash) {
						this.isOnWash = true
						RpcProxy.call("C2G_ACTOR_PET_SKILL_WASH", this.petId, 1, autoBuy, this.lockList)

					}
				} else {
					ExecuteMainFrameFunction("chongzhi")
				}
				return
			}
			//MsgSystem.addTagTips(Localize_cns("MATRIAL_NOENGOUGH"))
			let quickWnd = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
			quickWnd.onShowWnd(highId, highLimit);
			return
		}

		var petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)
		//洗练技能列表
		var washList = petNetInfo.washskilllist || []

		var endQuality = 0
		for (let i in washList) {
			let skillId = washList[i]
			let info = SkillSystem.getInstance().getPetSkillInfo(skillId)
			let config = GameConfig.SkillDescribeConfig[skillId]
			let quality = config[1].Quality
			if (this.lockList.indexOf(tonumber(i) + 1) == -1 && quality >= opPetQuality.purple && quality > endQuality) {
				endQuality = quality
			}
		}

		let formList = {
			[opPetQuality.purple]: ConfirmFrom.PET_CLEAR_SKILL_PURPLE,
			[opPetQuality.gold]: ConfirmFrom.PET_CLEAR_SKILL_GOLD,
			[opPetQuality.red]: ConfirmFrom.PET_CLEAR_SKILL_RED,
			[opPetQuality.color]: ConfirmFrom.PET_CLEAR_SKILL_CAI,
		}

		if (endQuality) {
			let color = GetQualityColorStr(endQuality, true)
			let str = String.format(Localize_cns("PET_TXT44"), color, Localize_cns("QUALITY_TXT" + endQuality))
			let _this = this
			var callback: IDialogCallback = {
				onDialogCallback(result: boolean, userData): void {
					if (result) {
						RpcProxy.call("C2G_ACTOR_PET_SKILL_WASH", _this.petId, 1, autoBuy, _this.lockList)

					}
				}
			}
			MsgSystem.confirmDialog(str, callback, formList[endQuality])
			return
		}

		if (!this.isOnWash) {
			this.isOnWash = true
			RpcProxy.call("C2G_ACTOR_PET_SKILL_WASH", this.petId, 1, autoBuy, this.lockList)

		}
	}

	//替换技能
	onClickExchange(args) {
		let petNetInfo = PetSystem.getInstance().getPetInfo(this.petId)

		//洗练技能列表
		let washList = petNetInfo.washskilllist || []
		if (size_t(washList) == 0) {
			MsgSystem.addTagTips(Localize_cns("PET_TXT43"))
			return
		}

		let _this = this
		var callback: IDialogCallback = {
			onDialogCallback(result: boolean, userData): void {
				if (result) {
					RpcProxy.call("C2G_ACTOR_PET_SKILL_ACCEPT", _this.petId)
				}
			}
		}
		MsgSystem.confirmDialog(Localize_cns("PET_TXT45"), callback)
	}

	//红点提示
	refreshDotTipsImp() {
		let washConfig = GameConfig.FunSkillWashConfig[cellOptionsName[cellOptionsIndex.PetSkill - 1]][this.petId]
		let lowId = washConfig.itemid
		let highId = washConfig.highitemid
		let lowCount = ItemSystem.getInstance().getItemCount(lowId)
		let lowLimit = washConfig.itemnum
		let highCount = ItemSystem.getInstance().getItemCount(highId)
		let highLimit = washConfig.highitemnum

		if (lowCount >= lowLimit) {
			this.createDotTipsUI(this.mElemList["wash_btn"])
		}

		if (highCount >= highLimit) {
			this.createDotTipsUI(this.mElemList["high_wash_btn"])
		}
	}

	onTipsClick() {
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
		wnd.showWithActivity("petSkillRule")
	}

	//////////////////////////////////////////////////
	showClearWithPet(petId) {
		this.petId = petId
		this.showWnd()
	}
}