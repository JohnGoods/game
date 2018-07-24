class XianLvShengXingWindow extends BaseCtrlWnd {
	mElemList;
	selectId
	xianLvActor


	public initObj(...params: any[]) {

	}
	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		this.mLayoutNode = this.mParentWnd.mLayoutNode;
		this.xianLvActor = this.mParentWnd.xianLvActor
		this.selectId = this.mParentWnd.selectId

		var elemInfo = [

			{ ["name"]: "btn_shengXing", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onShengXingClick },
		];

		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)



	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.ACTOR_XIANLV_UPDATE, this.onRefresh, this)
		//RegisterEvent(EventDefine.ACTOR_XIANLV_LIST_UPDATE, this.onRefresh, this)
		RegisterEvent(EventDefine.ITEM_UPDATE, this.updateMaterial, this)
		this.mElemList["group_xianLv"].visible = true;
		this.mElemList["label_wndName"].text = Localize_cns("XianLv");

		this.onRefresh()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ACTOR_XIANLV_UPDATE, this.onRefresh, this)
		//UnRegisterEvent(EventDefine.ACTOR_XIANLV_LIST_UPDATE, this.onRefresh, this)
		UnRegisterEvent(EventDefine.ITEM_UPDATE, this.updateMaterial, this)
		this.mElemList["group_xianLv"].visible = false;

	}

	refreshWithId(id) {
		this.selectId = id
		this.onRefresh()
	}

	onRefresh() {

		this.selectId = this.mParentWnd.selectId

		this.mElemList["up_star_wnd"].visible = false
		this.mElemList["star_wnd"].visible = false
		this.mElemList["upgrade_wnd"].visible = false
		this.mElemList["wei_jiHuo"].visible = false
		this.mElemList["unlock_wnd"].visible = false
		this.mElemList["state_btn"].visible = false
		this.mElemList["btn_jiHuo"].visible = false
		this.mElemList["stage_wnd"].visible = false
		this.mElemList["name_rd"].visible = false

		//common
		//
		let level = 1
		if (XianLvSystem.getInstance().isExit(this.selectId)) {
			level = XianLvSystem.getInstance().getLevel(this.selectId)
		}
		this.mElemList["stage_xianLv"].text = level + Localize_cns("ROLE_TXT39");
		//战力

		let star = XianLvSystem.getInstance().getStar(this.selectId) || 1
		let star_str = ""
		for (let i = 1; i <= 7; i++) {
			// let source = star >= i ? "ty_star01" : "ty_starDi01"
			// let image : eui.Image = this.mElemList["image_star_" + i]
			// image.source = source
			let tem = star >= i ? "#STAR": "#STAR_DI"
			star_str += tem + "#br"
		}
		AddRdContent(this.mElemList["rd_star"], star_str, "ht_20_cc")
		//rd_add
		let jiHuoList = XianLvSystem.getInstance().getJiHuoList()


		let zhanLiTotal = XianLvSystem.getInstance().getTotalForce()


		let fightList = XianLvSystem.getInstance().getFightList()
		let addStr = String.format(Localize_cns("XIANLV_TXT1"), zhanLiTotal, size_t(jiHuoList), size_t(fightList))
		AddRdContent(this.mElemList["add_rd"], addStr, "ht_20_cc", "ublack")

		let xianlvConfig = GameConfig.ActorXianLvConfig[this.selectId]

		let skillId = xianlvConfig["skilllist"]


		this.mElemList["skillBox3"].setTipsListner(this.mParentWnd.onSkillClick, this, this.selectId)
		this.mElemList["skillBox3"].updateXianLvSkill(skillId, star)

		//actor
		if (this.xianLvActor == null) {
			this.xianLvActor = UIActorView.newObj(this.mLayoutNode, "xianlvActor_view", 0, 0, this.mElemList["xianLvActor_wnd"])
		}
		//if (!this.auto) {
		this.xianLvActor.updateByPlayer(GetXianlvModel(this.selectId))
		//}


		//判断是否激活
		if (XianLvSystem.getInstance().isExit(this.selectId)) {
			this.mElemList["star_wnd"].visible = true
			this.mElemList["stage_wnd"].visible = true

			let zhanli = XianLvSystem.getInstance().getForce(this.selectId)
			if(zhanli == 0){
				zhanli = GetForceMath(GetXianLvProperty(this.selectId))
			}
			DrawNumberStringImage(this.mElemList["bImage_xianLv"], "zhanLi_", "z" + zhanli, 0, 0, -3)
			let jieStr = String.format(Localize_cns("ROLE_TXT39"), level)
			this.mElemList["stage_xianLv"].text = jieStr
			//state_btn
			this.mElemList["state_btn"].visible = true
			let isFight = false
			for (let k in fightList) {
				if (tonumber(k) == this.selectId && fightList[k] != 0) {
					isFight = true
				}
			}
			if (isFight) {
				this.mElemList["state_btn"].source = "ty_tongYongBt8"
				this.mElemList["state_btn"].text = Localize_cns("XIANLV_TXT2")
			} else {
				this.mElemList["state_btn"].source = "ty_tongYongBt7"
				this.mElemList["state_btn"].text = Localize_cns("XIANLV_TXT3")
			}

			//如果是升星
			for (let i = 1; i <= 2; i++) {
				if (!this.mElemList["skillBox" + i]) {
					this.mElemList["skillBox" + i] = UISkillBox.newObj(this.mLayoutNode, "skillBox" + i, 0, 0, this.mElemList["upstar_skill" + i])
				}
				this.mElemList["skillBox" + i].updateXianLvSkill(skillId, star + i - 1)
				this.mElemList["skillBox" + i].setTipsListner(this.mParentWnd.onSkillClick, this, this.selectId)
			}
			if (star >= 7) {
				this.mElemList["upstar_skill2"].visible = false
				this.mElemList["image_jiantou"].visible = false
				this.mElemList["label_manji"].visible = true
				if (this.mElemList["upStarItemBox"]) {
					this.mElemList["upStarItemBox"].setVisible(false)
				}
				this.mElemList["upstar_skill1"].x = 60
				this.mElemList["rd_upStarCost"].visible = false
				this.mElemList["btn_shengXing"].visible = false
			} else {
				this.mElemList["upstar_skill2"].visible = true
				this.mElemList["image_jiantou"].visible = true
				this.mElemList["upstar_skill1"].x = 0
				this.mElemList["label_manji"].visible = false
				if (this.mElemList["upStarItemBox"]) {
					this.mElemList["upStarItemBox"].setVisible(true)
				}
				this.mElemList["rd_upStarCost"].visible = true
				this.mElemList["btn_shengXing"].visible = true
			}

			this.mElemList["up_star_wnd"].visible = true
			this.updateMaterial()

		} else {
			this.mElemList["unlock_wnd"].visible = true
			this.mElemList["wei_jiHuo"].visible = true
			this.mElemList["link_wnd"].visible = true
			let costId = GameConfig.ActorXianLvConfig[this.selectId].itemid
			let count = GameConfig.ActorXianLvConfig[this.selectId].itemnum
			let name = GameConfig.itemConfig[costId].name
			//
			if (!this.mElemList["costItemBox"]) {
				this.mElemList["costItemBox"] = UIItemBox.newObj(this.mLayoutNode, "costItemBox", 0, 45, this.mElemList["group_unlock"])
			}
			this.mElemList["costItemBox"].updateByEntry(costId)

			//rd_access rd_starCost
			let had = ItemSystem.getInstance().getItemCount(costId)
			let tempStr = String.format(Localize_cns("XIANLV_TXT7"), had, count)

			if (had >= count) {
				tempStr = "#green" + tempStr
				this.mElemList["btn_jiHuo"].visible = true
				this.mElemList["link_view"].setVisible(false)
			} else {
				tempStr = "#red" + tempStr
				this.mElemList["link_view"].setVisible(true)
				let linkConfig = GameConfig.FunTipsConfig[costId][1]
				if (linkConfig) {
					this.mElemList["link_view"].updateByEntry(costId)
				}
			}
			let quality = GameConfig.ActorXianLvConfig[this.selectId].quality
			let nameColor = GetQualityColorStr(quality)
			name = "#" + nameColor + name
			let starStr = String.format(Localize_cns("XIANLV_TXT6"), name, tempStr)
			AddRdContent(this.mElemList["rd_starCost"], starStr, "ht_24_cc_stroke", "white")

			let proList = GetXianLvProperty(this.selectId)
			let zhanLi = GetForceMath(proList)
			DrawNumberStringImage(this.mElemList["bImage_xianLv"], "zhanLi_", "z" + zhanLi, 0, 0, -3)
		}


	}

	updateMaterial() {
		let itemid = GameConfig.FunUpStarConfig["XianLv"][this.selectId].itemid
		let star = XianLvSystem.getInstance().getStar(this.selectId)
		let upStartConfig = GameConfig.FunLevelNumConfig["XianLvStartUp"][star]
		if (upStartConfig != null && upStartConfig) {
			this.mElemList["group_access"].visible = true
			let itemnum = upStartConfig.num
			let had = ItemSystem.getInstance().getItemCount(itemid)
			let itemName = GameConfig.itemConfig[itemid].name

			if (!this.mElemList["upStarItemBox"]) {
				this.mElemList["upStarItemBox"] = UIItemBox.newObj(this.mLayoutNode, "upStarItemBox", 40, 45, this.mElemList["up_star_wnd"])
			}
			this.mElemList["upStarItemBox"].updateByEntry(itemid)

			let hadStr = tostring(had)
			if (had >= itemnum) {
				hadStr = "#lime" + hadStr

			} else {
				hadStr = "#red" + hadStr
			}
			let quality = GameConfig.ActorXianLvConfig[this.selectId].quality
			let nameColor = GetQualityColorStr(quality, true)
			itemName = "#" + nameColor + itemName
			let costStr = String.format(Localize_cns("XIANLV_TXT4"), itemName, itemnum, hadStr)
			AddRdContent(this.mElemList["rd_upStarCost"], costStr, "ht_24_cc_stroke", "white")

			AddRdContent(this.mElemList["rd_way"], Localize_cns("XIANLV_TXT5"), "ht_24_cc", "green")
		}else{
			this.mElemList["group_access"].visible = false
		}
	}

	///btn_响应事件
	onShengXingClick() {
		this.selectId = this.mParentWnd.selectId
		let itemid = GameConfig.FunUpStarConfig["XianLv"][this.selectId].itemid
		let star = XianLvSystem.getInstance().getStar(this.selectId)
		let upStartConfig = GameConfig.FunLevelNumConfig["XianLvStartUp"][star]
		if (upStartConfig == null) return false
		let itemnum = upStartConfig.num
		let had = ItemSystem.getInstance().getItemCount(itemid)
		if (had < itemnum) {
			let itemName = GameConfig.itemConfig[itemid].name
			MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), itemName))
			return
		}

		RpcProxy.call("C2G_ACTOR_XIANLV_UP_START", this.selectId)

	}

	onTipsClick() {
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
		wnd.showWithActivity("xianlvRule")
	}
}