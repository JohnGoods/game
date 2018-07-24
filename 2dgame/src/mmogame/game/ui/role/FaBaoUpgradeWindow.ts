class FaBaoUpgradeWindow extends BaseCtrlWnd {
	mElemList;
	actor: UIActorView
	select: number
	needId
	needNum


	public initObj(...params: any[]) {

	}
	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		this.actor = this.mParentWnd.actor
		var elemInfo = [
			{ ["name"]: "btn_up", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUpClick },

		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		this.mElemList["upgradeBox"] = UIItemBox.newObj(this.mLayoutNode, "upgradeBox", 30, 210, this.mElemList["shengji"])
		/*let group:eui.Group = this.mElemList["group_scroll"]

		let layout:eui.LayoutBase = new eui.VerticalLayout()
		group.layout = layout*/
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mElemList["group_fabao"].visible = true;
		this.mElemList["shengji"].visible = true;
		this.mElemList["title"].text = Localize_cns("FABAO_TITLE_TXT2");

		this.onRefresh();
	}

	public onHide(): void {
		this.mElemList["group_fabao"].visible = false;
		this.mElemList["shengji"].visible = false
		this.actor.clearView()
		this.mElemList["no_count_fabao"].visible = false
	}

	onRefresh() {
		this.mParentWnd.refreshFaBaoItem()
		let fabaoInfo = RoleSystem.getInstance().getFaBaoInfo() //"talismanLevelList:table", "talismanlist:table"
		if (fabaoInfo == null) return
		let levelList = fabaoInfo["talismanLevelList"]
		if (levelList == null) return
		let force = fabaoInfo["force"]
		DrawNumberStringImage(this.mElemList["bImage"], "zhanLi_", "z" + force, 0, 0, -3)

		this.select = this.mParentWnd.selectIndex || 1
		this.mElemList["btn_quality"].visible = true
		let playerInfo = GetHeroPropertyInfo()
		let actorView: UIActorView = this.actor
		actorView.updateByPlayerAppearInfo(playerInfo)
		//如果没有法宝，不能升级
		let equipItem: Item = RoleSystem.getInstance().getFaBaoItem(this.select)

		let list = ItemSystem.getInstance().getFaBaoItemList()
		if (size_t(list) == 0 && equipItem == null) {
			this.mElemList["no_count_fabao"].visible = true
		} else {
			this.mElemList["no_count_fabao"].visible = false
		}
		if (levelList[this.select + opTalismanEquipPos.begin - 1] == null || equipItem == null) { //没有解锁，就不显示
			this.mElemList["shengji"].visible = false
			this.mElemList["fabao"].visible = true

			return
		}
		this.mElemList["upgradeBox"].setVisible(true)
		this.mElemList["shengji"].visible = true
		this.mElemList["fabao"].visible = false
		let stage = levelList[this.select + opTalismanEquipPos.begin - 1] || 0
		let upConfig = GameConfig.TalismanEquipUpConfig[stage]
		let itemid = upConfig.entryId
		this.needId = itemid
		let count = upConfig.needNum
		let percent = upConfig.percentage

		let nextConfig = GameConfig.TalismanEquipUpConfig[stage + 1]
		if (nextConfig == null) {
			this.mElemList["upgradeBox"].setVisible(false)
			AddRdContent(this.mElemList["rd_had"], "#lime" + Localize_cns("ROLE_TXT31"), "ht_20_lc_stroke")
		}

		let item = equipItem.entryId
		let quality = equipItem.getProperty("quality")
		let effectConfig = GameConfig.TalismanEquipEffectConfig[item][quality]
		let config = table_effect(effectConfig.effects)
		let desStr1 = String.format("#watchet" + Localize_cns("FABAO_UPGRADE_TXT1"), percent * 100) + "#br#rf"
		for (let k in config) {
			let v = config[k]
			desStr1 += GetPropertyName(k) + "#lime" + FormatNumberInt(v) + "+" + FormatNumberInt(v * percent) + "#br#rf"
		}
		let desStr2 = ""
		if (nextConfig != null) {
			let nextPercent = nextConfig.percentage
			desStr2 = String.format("#watchet" + Localize_cns("FABAO_UPGRADE_TXT1"), nextPercent * 100) + "#br#rf"
			for (let k in config) {
				let v = config[k]
				desStr2 += GetPropertyName(k) + "#lime" + FormatNumberInt(v) + "+" + FormatNumberInt(v * nextPercent) + "#br#rf"
			}
		}

		if (size_t(effectConfig.skillattt) != 0) {
			let effectJudgeConfig = effectConfig.skillattt

			let propertyConfig = {}
			let nextPropertyConfig = {}
			let nextLevel = 0
			let isNext = false
			for (let k in effectJudgeConfig) {
				let judgeConfig = effectJudgeConfig[k]
				if (isNext) {
					nextPropertyConfig = judgeConfig[2]
					nextLevel = judgeConfig[0]
					break
				}
				if (judgeConfig[0] <= stage && judgeConfig[1] >= stage) {
					propertyConfig = judgeConfig[2]
					isNext = true
				}


			}
			//let formatList = []
			let formatStr = effectConfig.skillTips
			let data = propertyConfig[0]
			let isFloat = MathUtil.isFloat(data)
			let temp = ""
			let tempNext = ""
			if (isFloat) {
				let format =FormatNumber2f( data * 100) + "%"
				temp = String.format(formatStr, format, propertyConfig[1])
				if (nextLevel != 0) {
					let formatnext =FormatNumber2f( nextPropertyConfig[0] * 100) + "%"
					tempNext = String.format(formatStr, formatnext, nextPropertyConfig[1]) + "#red" + String.format(Localize_cns("FABAO_NEXT_LEVEL_JIHUO"), nextLevel)
				}

			} else {
				temp = String.format(formatStr, data, propertyConfig[1])
				if (nextLevel != 0) {
					tempNext = String.format(formatStr, nextPropertyConfig[0] , nextPropertyConfig[1]) + "#red" + String.format(Localize_cns("FABAO_NEXT_LEVEL_JIHUO"), nextLevel)
				}
			}

			desStr1 += effectConfig.skillName + "：" + temp
			if (nextLevel != 0) {
				desStr2 += effectConfig.skillName + "：" + tempNext
			} else {
				desStr2 = "#lime" + Localize_cns("FORGE_MANJI")
			}
		}


		AddRdContent(this.mElemList["rd_effect_1"], desStr1, "ht_20_lc")
		if (nextConfig != null) {
			this.mElemList["upgradeBox"].updateByEntry(itemid)
			let hadStr = "#" + GetItemFontColor(itemid) + GameConfig.itemConfig[itemid].name + "#red*" + count
			let had = ItemSystem.getInstance().getItemCount(itemid)

			this.needNum = count - had
			hadStr += "#br#br#rf" + Localize_cns("ITEM_TXT30") + "#green" + had

			AddRdContent(this.mElemList["rd_had"], hadStr, "ht_20_lc_stroke")
		}else{
			desStr2 = "#lime" + Localize_cns("ROLE_TXT31")
		}
		AddRdContent(this.mElemList["rd_effect_2"], desStr2, "ht_20_lc")
	}

	////////------------响应事件
	onFaBaoClick(args: egret.Event) {
		let name = args.target.name
		let index = name.replace(/[^0-9]/ig, "")

		this.select = tonumber(index)
		this.mParentWnd.selectIndex = this.select

		for (let k = 1; k <= 4; k++) {
			this.mElemList["image_select_" + k].visible = false
		}
		this.mElemList["image_select_" + this.select].visible = true

		this.onRefresh()
	}

	onUpClick() {
		if (this.mElemList["cBox_upgrade"].selected == true) {
			RpcProxy.call("C2G_EquipTalismanUp", this.select + opTalismanEquipPos.begin - 1, 1)
			return
		}

		if (this.needNum > 0) {
			if (this.needId == null || this.needNum == null) return
			let wnd: GoodsAsseceFrame = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
			wnd.onShowWnd(this.needId, this.needNum)
			return
		}
		RpcProxy.call("C2G_EquipTalismanUp", this.select + opTalismanEquipPos.begin - 1, 0)
	}

	onTipsClick() {
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
		wnd.showWithActivity("fabaoRule")
	}
}