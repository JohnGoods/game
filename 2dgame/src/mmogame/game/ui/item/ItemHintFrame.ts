class ItemHintFrame extends BaseWnd {
	logicItem: Item;
	timerList: any;

	public initObj(...params: any[]) {
		this.timerList = {}
		this.mLayoutPaths = ["resource/layouts/item/ItemHintLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.initSkinElemList();
		this.setAlignCenter(true, true);

		this.mElemList["equip_box"] = UIItemBox.newObj(this.mLayoutNode, "equip_box", 0, 0, this.mElemList["e_box"])
		this.mElemList["equip_box"].setItemHintEnable(false)
		this.mElemList["item_box"] = UIItemBox.newObj(this.mLayoutNode, "item_box", 0, 0, this.mElemList["i_box"])
		this.mElemList["item_box"].setItemHintEnable(false)

		this.mElemList["com_wnd"].visible = false
		this.mElemList["role_wnd"].visible = false

		this.mElemList["i_timeCounter"].setAlignFlag(gui.Flag.RIGHT)

		this.mElemList["use_wnd"].visible = false
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.hideWnd, this)
		this.mLayoutNode.visible = true;
		this.mLayoutNode.setDoModal(true)
		this.refreshFrame()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.hideWnd, this)
		UiUtil.unRegisterTouchOutsideEvent(this.hideWnd, this)
		this.mLayoutNode.visible = false;
		this.mLayoutNode.setDoModal(false)

		for (let _ in this.timerList) {
			KillTimer(this.timerList[_])
		}
		this.timerList = {}
	}

	refreshFrame() {
		let itemType = this.logicItem.getRefProperty("type")
		for (let _ in this.timerList) {
			KillTimer(this.timerList[_])
		}
		this.timerList = {}

		if (itemType == opItemType.ITEM_TYPE_GOODS) {
			this.mElemList["equip_wnd"].visible = false
			this.mElemList["item_wnd"].visible = true
			this.updateNormalItem()
		} else {
			this.mElemList["equip_wnd"].visible = true
			this.mElemList["item_wnd"].visible = false
			this.updateEquipItem()
		}
	}

	updateNormalItem() {
		if (!this.logicItem) {
			return
		}
		this.mElemList["item_box"].updateByItem(this.logicItem)
		let name = this.logicItem.getRefProperty("name")
		let count = ItemSystem.getInstance().getItemCount(this.logicItem.entryId)
		let describ = this.logicItem.getRefProperty("description")
		let quality = this.logicItem.getRefProperty("quality") || 1
		let color = GetQualityColorStr(quality)
		let str = "#" + color + name
		let isSpecial = false
		for (let _ in SpecailItemId) {
			if (SpecailItemId[_] == this.logicItem.entryId) {
				isSpecial = true
			}
		}

		if (!isSpecial) { //不显示拥有
			str = str + "#br#yellow" + Localize_cns("ITEM_TXT30") + count
		}

		AddRdContent(this.mElemList["i_des"], str, "ht_24_cc_stroke", "white", 15)
		AddRdContent(this.mElemList["i_explain"], describ, "ht_24_cc_stroke", "navajowhite", 8)

		//有效期
		if (this.logicItem.getProperty("lost_effect_time") != null) {
			let endTime = this.logicItem.getProperty("lost_effect_time")
			let tick = function (delay) {
				let leftTime = endTime - GetServerTime()
				if (leftTime < 0) {
					if (this.timerList["lost_effect_time"]) {
						KillTimer(this.timerList["lost_effect_time"])
						delete this.timerList["lost_effect_time"]
					}

					AddRdContent(this.mElemList["i_timeCounter"], String.format(Localize_cns("COMMON_TXT11"), "#red" + Localize_cns("COMMON_TXT12")), "ht_22_cc_stroke", "white")
				} else {
					AddRdContent(this.mElemList["i_timeCounter"], String.format(Localize_cns("COMMON_TXT11"), "#red" + getFormatDiffTime(leftTime)), "ht_22_cc_stroke", "white")
				}
			}
			if (this.timerList["lost_effect_time"] == null) {
				this.timerList["lost_effect_time"] = SetTimer(tick, this, 200, true)
			}
		} else {
			AddRdContent(this.mElemList["i_timeCounter"], "", "ht_22_cc_stroke", "white")
		}

		let unionCount = this.logicItem.getRefProperty("isbag") || 0
		if (unionCount > 0) {
			if (count > unionCount) {
				this.mElemList["label_num"].text = unionCount
			} else {
				this.mElemList["label_num"].text = count
			}
		} else {
			this.mElemList["label_num"].text = 1
		}
	}

	updateEquipItem() {
		if (!this.logicItem) {
			return
		}
		this.mElemList["equip_box"].updateByItem(this.logicItem)
		let name = this.logicItem.getRefProperty("name")
		//部位//类型
		let subtype = this.logicItem.getRefProperty("subtype")
		//等级//需求
		let uselevel = this.logicItem.getRefProperty("uselevel")
		//职业只有通用

		let itemType = this.logicItem.getRefProperty("type")
		if (itemType == opItemType.COMMON_EQUIP) {
			let stageStr = this.logicItem.getRefProperty("name")
			let level = this.logicItem.getProperty("add_num") || 0
			let quality = this.logicItem.getProperty("quality") || opEquipQuality.gray
			let color = GetQualityColorStr(quality)

			//名称
			let str = "#" + color + stageStr
			if (level > 0) {
				str = str + "#yellow+" + level
			}
			AddRdContent(this.mElemList["e_name"], str, "ht_24_cc_stroke", "white")

			//需求和类型
			str = "#yellow" + Localize_cns("ITEM_TXT31") + "#navajowhite" + uselevel + Localize_cns("PET_TXT10") + "#br"
			str = str + "#yellow" + Localize_cns("ITEM_TXT32") + "#navajowhite" + (GameConfig.FunEquipCaseList[subtype] || "")
			AddRdContent(this.mElemList["e_des"], str, "ht_24_cc_stroke", "white", 15)

			let force = this.updateCommonEquipProperty() || 0

			//战力
			this.mElemList["e_batch"].beginDraw();
			this.mElemList["e_batch"].drawNumberString("zhanLi_", "z" + force, 0, 0, -3)
			this.mElemList["e_batch"].endDraw();

			//更新评分
			let forceLab = <eui.Label>this.mElemList["e_force"]
			forceLab.textColor = gui.Color.yellow
			forceLab.text = Localize_cns("ITEM_TXT37") + force
		} else {
			let quality = this.logicItem.getProperty("quality") || opEquipQuality.gray
			let color = GetQualityColorStr(quality)
			//名称
			if (quality >= opEquipQuality.red) {
				name = String.format(Localize_cns("GOD_EQUIP_TXT17"), name)
			}
			let str = "#" + color + name
			AddRdContent(this.mElemList["e_name"], str, "ht_24_cc_stroke", "white")

			//部位等级职业
			str = "#yellow" + Localize_cns("ITEM_TXT33") + "#navajowhite" + GetRoleEquipTypeName(subtype) + "#br"
			str = str + "#yellow" + Localize_cns("ITEM_TXT34") + "#navajowhite" + uselevel + "#br"
			str = str + "#yellow" + Localize_cns("ITEM_TXT35") + "#navajowhite" + Localize_cns("ITEM_TXT36")
			AddRdContent(this.mElemList["e_des"], str, "ht_24_cc_stroke", "white", 3)

			let force = this.updateRoleEquipProperty() || 0

			//战力
			this.mElemList["e_batch"].beginDraw();
			this.mElemList["e_batch"].drawNumberString("zhanLi_", "z" + force, 0, 0, -3)
			this.mElemList["e_batch"].endDraw();

			//更新评分
			let forceLab = <eui.Label>this.mElemList["e_force"]
			forceLab.textColor = gui.Color.yellow
			forceLab.text = Localize_cns("ITEM_TXT37") + force
		}
	}

	updateCommonEquipProperty() {
		this.mElemList["com_wnd"].visible = true
		this.mElemList["role_wnd"].visible = false

		let quality = this.logicItem.getProperty("quality") || opEquipQuality.purple //最低紫色
		let add_num = this.logicItem.getProperty("add_num") || 0

		this.updateFrameSize(add_num)

		//更新基础属性
		var effects = GetFunEquipBaseProperty(this.logicItem.entryId, quality)
		let baseStr = "#yellow" + Localize_cns("ITEM_BASE_ATTR")
		for (let k in effects) {
			let proName = GetPropertyName(abilityNameToIndex[k])
			let proValue = effects[k]
			baseStr = baseStr + "#br" + "#navajowhite" + proName + proValue
		}
		AddRdContent(this.mElemList["com_base"], baseStr, "ht_24_cc_stroke", "white", 7)

		//更新附加属性
		var effects = GetFunEquipAddProperty(this.logicItem.entryId, quality)
		let addStr = "#yellow" + Localize_cns("ITEM_ADD_ATTR")
		for (let i = 0; i < add_num; i++) {
			for (let k in effects) {
				let proName = GetPropertyName(abilityNameToIndex[k])
				let proValue = effects[k]
				addStr = addStr + "#br" + "#navajowhite" + proName + proValue
			}
		}

		let bg = this.mElemList["equip_wnd_bg"]
		if (add_num > 0) {
			AddRdContent(this.mElemList["com_add"], addStr, "ht_24_cc_stroke", "white", 7)
			this.mElemList["com_add"].visible = true
			this.mElemList["add_line"].visible = true

			UiUtil.setWH(bg, 450, 360 + 30 * add_num)
		} else {
			this.mElemList["com_add"].visible = false
			this.mElemList["add_line"].visible = false

			UiUtil.setWH(bg, 450, 300)
		}

		UiUtil.setWH(this.mLayoutNode, 450, bg.height)

		return GetForceMath(GetFunEquipProperty(this.logicItem.entryId, quality, add_num))
	}

	updateRoleEquipProperty() {
		this.mElemList["com_wnd"].visible = false
		this.mElemList["role_wnd"].visible = true

		let quality = this.logicItem.getProperty("quality") || opEquipQuality.gray

		//更新基础属性
		let baseStr = "#yellow" + Localize_cns("ITEM_BASE_ATTR")
		let effects = GetRoleEquipBaseProperty(this.logicItem.entryId, quality)
		for (let k in effects) {
			let proName = GetPropertyName(abilityNameToIndex[k])
			let proValue = effects[k]
			baseStr = baseStr + "#br" + "#navajowhite" + proName + proValue
		}
		AddRdContent(this.mElemList["role_base"], baseStr, "ht_24_cc_stroke", "white", 7)

		// AddRdContent(this.mElemList["role_add"], "", "ht_24_cc_stroke", "white", 7)
		let best = this.logicItem.propertyInfo.best_attribute
		this.mElemList["jp_line"].visible = true

		let bg = this.mElemList["equip_wnd_bg"]	//440
		//320
		UiUtil.setWH(bg, 450, 460)

		//极品属性
		if (best) {
			let addStr = "#yellow" + Localize_cns("ITEM_JP_ATTR")
			for (let k in best) {
				let proName = GetPropertyName(best[k][0])
				let proValue = Math.ceil(best[k][1] * best[k][2])
				addStr = addStr + "#br" + "#navajowhite" + proName + proValue
			}
			AddRdContent(this.mElemList["role_add"], addStr, "ht_24_cc_stroke", "white", 7)
		} else {
			let addStr = "#yellow" + Localize_cns("ITEM_JP_ATTR") + "#br"
			addStr = addStr + Localize_cns("ITEM_JP_ATTR1")
			for (let i = 0; i < 3; i++) {
				addStr = addStr + "#br" + "#navajowhite" + "？？？：" + "？？？？"
			}
			AddRdContent(this.mElemList["role_add"], addStr, "ht_24_cc_stroke", "white", 7)
			UiUtil.setWH(bg, 450, 490)
		}

		if (this.logicItem.propertyInfo.quality < 6 || this.logicItem.propertyInfo.quality == null) {
			AddRdContent(this.mElemList["role_add"], "", "ht_24_cc_stroke", "white", 7)
			this.mElemList["jp_line"].visible = false
			UiUtil.setWH(bg, 450, 320)
		}

		//穿戴装备/////////////////////////////////////////////////////////////////////////
		if (!RoleSystem.getInstance().isRoleEquipWearing(this.logicItem)) {

			//装备技能
			let config = RoleSystem.getInstance().getRoleEquipSkill(this.logicItem.entryId, quality)
			if (config && size_t(config) > 0) {
				UiUtil.setWH(bg, 450, bg.height + 50)
				this.mElemList["sk_line"].visible = true
				UiUtil.setXY(this.mElemList["sk_line"], 0, bg.height - 260)
				UiUtil.setXY(this.mElemList["role_sk"], 15, bg.height - 240)
				this.mElemList["role_sk"].visible = true
				let skStr = "#gray" + config.Des + "#space" + config.CondDes
				AddRdContent(this.mElemList["role_sk"], skStr, "ht_24_cc_stroke", "white", 7)
			}

			return GetForceMath(effects)
		}

		//强化属性
		let QHEffects = GetForgeCellProperty(elemForgeNames[0], this.logicItem.getRefProperty("subtype")) || {}
		if (size_t(QHEffects) > 0) {
			UiUtil.setWH(bg, 450, bg.height + 110)
			this.mElemList["qh_line"].visible = true
			UiUtil.setXY(this.mElemList["qh_line"], 0, bg.height - 315)

			this.mElemList["role_qh"].visible = true
			UiUtil.setWH(this.mElemList["role_qh"], 380, 80)
			UiUtil.setXY(this.mElemList["role_qh"], 15, bg.height - 295)

			let addStr = "#yellow" + Localize_cns("FORGE_TXT15")
			for (let k in QHEffects) {
				let proName = GetPropertyName(abilityNameToIndex[k])
				let proValue = QHEffects[k]
				addStr = addStr + "#br" + "#navajowhite" + proName + proValue
			}
			AddRdContent(this.mElemList["role_qh"], addStr, "ht_24_cc_stroke", "white", 7)

			table_effect_add(effects, QHEffects)
		} else {
			this.mElemList["qh_line"].visible = false
			this.mElemList["role_qh"].visible = false
		}

		//精炼属性
		let JLEffects = GetForgeCellProperty(elemForgeNames[1], this.logicItem.getRefProperty("subtype")) || {}
		if (size_t(JLEffects) > 0) {
			UiUtil.setWH(bg, 450, bg.height + 110)
			this.mElemList["jl_line"].visible = true
			UiUtil.setXY(this.mElemList["jl_line"], 0, bg.height - 315)

			this.mElemList["role_jl"].visible = true
			UiUtil.setWH(this.mElemList["role_jl"], 380, 80)
			UiUtil.setXY(this.mElemList["role_jl"], 15, bg.height - 295)

			let addStr = "#yellow" + Localize_cns("FORGE_TXT16")
			for (let k in JLEffects) {
				let proName = GetPropertyName(abilityNameToIndex[k])
				let proValue = JLEffects[k]
				addStr = addStr + "#br" + "#navajowhite" + proName + proValue
			}
			AddRdContent(this.mElemList["role_jl"], addStr, "ht_24_cc_stroke", "white", 7)

			table_effect_add(effects, JLEffects)
		} else {
			this.mElemList["jl_line"].visible = false
			this.mElemList["role_jl"].visible = false
		}

		//锻炼属性
		let DLEffects = GetForgeCellProperty(elemForgeNames[2], this.logicItem.getRefProperty("subtype")) || {}
		if (size_t(DLEffects) > 0) {
			UiUtil.setWH(bg, 450, bg.height + 110)
			this.mElemList["dl_line"].visible = true
			UiUtil.setXY(this.mElemList["dl_line"], 0, bg.height - 315)

			this.mElemList["role_dl"].visible = true
			UiUtil.setWH(this.mElemList["role_dl"], 380, 80)
			UiUtil.setXY(this.mElemList["role_dl"], 15, bg.height - 295)

			let addStr = "#yellow" + Localize_cns("FORGE_TXT17")
			for (let k in DLEffects) {
				let proName = GetPropertyName(abilityNameToIndex[k])
				let proValue = DLEffects[k]
				addStr = addStr + "#br" + "#navajowhite" + proName + proValue
			}
			AddRdContent(this.mElemList["role_dl"], addStr, "ht_24_cc_stroke", "white", 7)

			table_effect_add(effects, DLEffects)
		} else {
			this.mElemList["dl_line"].visible = false
			this.mElemList["role_dl"].visible = false
		}

		//宝石属性
		let BSEffects = GetForgeCellProperty(elemForgeNames[3], this.logicItem.getRefProperty("subtype")) || []
		if (size_t(BSEffects) > 0) {
			UiUtil.setWH(bg, 450, bg.height + 160)
			this.mElemList["bs_line"].visible = true
			UiUtil.setXY(this.mElemList["bs_line"], 0, bg.height - 365)

			this.mElemList["role_bs"].visible = true
			UiUtil.setWH(this.mElemList["role_bs"], 380, 140)
			UiUtil.setXY(this.mElemList["role_bs"], 15, bg.height - 345)

			// let BSEffects = [
			// 	{ maxhp: 100 },
			// 	{ maxhp: 100 },
			// 	{ maxhp: 100 },
			// 	{ maxhp: 100 }
			// ]
			let addStr = ""
			for (let i in BSEffects) {
				let effect = BSEffects[i]
				table_effect_add(effects, effect)
				for (let k in effect) {
					let proName = GetPropertyName(k, "")
					let proValue = effect[k]
					if (proValue == 0) {
						addStr = addStr + "#gray" + proName + Localize_cns("FORGE_TXT19") + "#br"
					} else {
						addStr = addStr + "#magenta" + proName + String.format(Localize_cns("FORGE_TXT20"), proValue) + "#br"
					}
				}
			}
			AddRdContent(this.mElemList["role_bs"], addStr, "ht_24_cc_stroke", "white", 7)
		} else {
			this.mElemList["bs_line"].visible = false
			this.mElemList["role_bs"].visible = false
		}

		//装备技能
		let config = RoleSystem.getInstance().getRoleEquipSkill(this.logicItem.entryId, quality)
		if (config && size_t(config) > 0) {
			UiUtil.setWH(bg, 450, bg.height + 40)
			this.mElemList["sk_line"].visible = true
			UiUtil.setXY(this.mElemList["sk_line"], 0, bg.height - 260)
			UiUtil.setXY(this.mElemList["role_sk"], 15, bg.height - 240)
			this.mElemList["role_sk"].visible = true
			let isActive = RoleSystem.getInstance().checkRoleEquipSkillActive(config.Condition, config.Param[0][0])
			let skStr = config.Des
			if (isActive) {
				skStr = "#magenta" + skStr + "#space" + Localize_cns("FORGE_LEVEL_TRUE")
			} else {
				skStr = "#gray" + skStr + "#space" + config.CondDes
			}
			AddRdContent(this.mElemList["role_sk"], skStr, "ht_24_cc_stroke", "white", 7)
		}

		UiUtil.setWH(bg, 450, bg.height)

		UiUtil.setWH(this.mLayoutNode, 450, bg.height)

		return GetForceMath(effects)
	}

	updateFrameSize(num) {
		let addH = 32
		this.mLayoutNode.height = this.mLayoutNode.height + 60 + (num - 1) * addH
		let addRd = <gui.RichDisplayer>this.mElemList["com_add"]
		addRd.height = addRd.height + (num - 1) * addH
	}

	useItemRefresh() {
		UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.hideWnd, this)
		this.mElemList["use_wnd"].visible = true
		let bg = this.mElemList["item_wnd_bg"]
		UiUtil.setWH(bg, 450, this.mLayoutNode.height)

		this.mElemList["btn_cut"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickCut, this)
		this.mElemList["btn_plus"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickPlus, this)
		this.mElemList["btn_min"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMin, this)
		this.mElemList["btn_max"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMax, this)
		this.mElemList["btn_use"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickUseItem, this)

		UiUtil.registerTouchOutsideEvent(this.hideWnd, this, [this.mLayoutNode])
	}

	onClickCut() {
		let count = tonumber(this.mElemList["label_num"].text)
		count = count - 1
		if (count < 1) {
			count = 1
		}
		this.mElemList["label_num"].text = count
	}

	onClickPlus() {
		let count = tonumber(this.mElemList["label_num"].text)
		count = count + 1
		let ownCount = this.logicItem.getProperty("count")
		if (count > ownCount) {
			count = ownCount
		}
		this.mElemList["label_num"].text = count
	}

	onClickMin() {
		this.mElemList["label_num"].text = 1
	}

	onClickMax() {
		this.mElemList["label_num"].text = this.logicItem.getProperty("count")
	}

	onClickUseItem() {
		let count = tonumber(this.mElemList["label_num"].text)
		SendUseItemMessage(this.logicItem, count)
		this.hideWnd()
	}

	//////////////////////////////////////////////////////////////
	showItemHint(logicItem) {
		this.logicItem = logicItem
		this.showWnd()
	}

	//使用物品
	useItemHint(logicItem) {
		this.showItemHint(logicItem)
		this.doCommand("useItemRefresh")
	}
}