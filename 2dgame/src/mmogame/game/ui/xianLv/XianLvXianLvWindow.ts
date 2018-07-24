class XianLvXianLvWindow extends BaseCtrlWnd {
	mElemList
	selectId;
	auto: boolean;
	isAutoYB: boolean;

	xianLvActor

	animId: number;
    listener: any;

    timer: number;

	public initObj(...params: any[]) {
		this.auto = false
		this.isAutoYB = false
		this.animId = 0
	}
	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		this.xianLvActor = this.mParentWnd.xianLvActor
		this.mLayoutNode = this.mParentWnd.mLayoutNode;
		this.selectId = this.mParentWnd.selectId

		let elemInfo = [
			{ ["name"]: "btn_up1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUpClick },
			{ ["name"]: "btn_autoUp1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAutoClick },
		]

		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.ACTOR_XIANLV_UPDATE, this.onUpdateRefresh, this)
		//RegisterEvent(EventDefine.ACTOR_XIANLV_LIST_UPDATE, this.onUpdateRefresh, this)
		RegisterEvent(EventDefine.ITEM_UPDATE, this.updateCost, this)
		this.mElemList["group_xianLv"].visible = true;

		this.mElemList["label_wndName"].text = Localize_cns("XianLv")//Localize_cns("ROLE_TXT13");

		this.onRefresh()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ACTOR_XIANLV_UPDATE, this.onUpdateRefresh, this)
		//UnRegisterEvent(EventDefine.ACTOR_XIANLV_LIST_UPDATE, this.onUpdateRefresh, this)
		UnRegisterEvent(EventDefine.ITEM_UPDATE, this.updateCost, this)
		this.mElemList["group_xianLv"].visible = false;
		this.auto = false

		this.resetUpgradeBtnState()

		this.animId = 0

        if (this.timer) {
            KillTimer(this.timer)
            this.timer = null
        }
	}

	refreshWithId(id) {
		this.selectId = id
		this.onRefresh()
	}

	updateCost() {
		//消耗,消耗。。%s#JINBI#rf%d,,
		if(this.selectId == null) return
		let level = 1
		if (XianLvSystem.getInstance().isExit(this.selectId)) {
			level = XianLvSystem.getInstance().getLevel(this.selectId)
		}
		let upgradeConfig = GameConfig.FunUpgradeStageConfig["XianLv"][level]
		let needItem = GameConfig.itemConfig[upgradeConfig.itemid]//upgradeConfig.itemid
		let hadCount = ItemSystem.getInstance().getItemCount(upgradeConfig.itemid)
		let needCount = upgradeConfig.itemnum
		let str = hadCount + "/" + needCount
		if (hadCount >= needCount) {
			str = "#green" + str;
		} else {
			str = "#red" + str
		}

		str += GetMoneyIcon(upgradeConfig.moneyunit)
		if(GetHeroMoney(upgradeConfig.moneyunit) < upgradeConfig.money){
			str  += "#red"
		}else{
			str += "#green"
		}

		let costStr = Localize_cns("ROLE_TXT10") + GetTagIcon(upgradeConfig.itemid) + str + upgradeConfig.money
		AddRdContent(this.mElemList["rd_cost"], costStr, "ht_24_cc", "ublack")
	}


	onUpdateRefresh() {
		this.onRefresh()

		if (this.auto) {
			let exp = XianLvSystem.getInstance().getExpById(this.selectId) || 0
			if (exp == 0) {
				this.resetUpgradeBtnState()
			} else {
				this.sendUpgradeWithCheck()
			}
		}
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
		this.mElemList["btn_up1"].visible = true
		this.mElemList["btn_autoUp1"].visible = true

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
		let fightCount = XianLvSystem.getInstance().getFightCount() || 0
		let addStr = String.format(Localize_cns("XIANLV_TXT1"), zhanLiTotal, size_t(jiHuoList), fightCount)
		AddRdContent(this.mElemList["add_rd"], addStr, "ht_20_cc", "ublack")

		let xianlvConfig = GameConfig.ActorXianLvConfig[this.selectId]

		let skillId = xianlvConfig["skilllist"]


		this.mElemList["skillBox3"].setTipsListner(this.mParentWnd.onSkillClick, this, this.selectId)
		this.mElemList["skillBox3"].updateXianLvSkill(skillId, star)
		//actor
		if (this.xianLvActor == null) {
			this.xianLvActor = UIActorView.newObj(this.mLayoutNode, "xianlvActor_view", 0, 0, this.mElemList["xianLvActor_wnd"])
		}
		if (!this.auto) {
			this.updateActorModel()
		}

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
			this.mElemList["upgrade_wnd"].visible = true
			let upgradeConfig = GameConfig.FunUpgradeStageConfig["XianLv"][level]
			if (level == size_t(GameConfig.FunUpgradeStageConfig["XianLv"])) {
				UiUtil.updateProgress(this.mElemList["xianLv_progress"], 1, 1)
				this.mElemList["btn_up1"].visible = false
				this.mElemList["btn_autoUp1"].visible = false
				this.mElemList["manji_label"].visible = true
				this.mElemList["manji_label"].text = String.format(Localize_cns("PET_TXT41"), GameConfig.ActorXianLvConfig[this.selectId].name)

				let costStr = Localize_cns("ROLE_TXT10") + GetTagIcon(upgradeConfig.itemid)+ "#darkgreen" + 0 + "/" + 0 + GetMoneyIcon(upgradeConfig.moneyunit) + upgradeConfig.money
				AddRdContent(this.mElemList["rd_cost"], costStr, "ht_24_cc", "ublack")

				this.resetUpgradeBtnState()
				return
			}
			this.mElemList["manji_label"].visible = false
			//经验条xianLv_progress
			let curExp = XianLvSystem.getInstance().getExpById(this.selectId)
			let maxEXP = upgradeConfig.maxexp
			UiUtil.updateProgress(this.mElemList["xianLv_progress"], curExp, maxEXP)

			this.updateCost()

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

	updateActorModel() {
		 if (this.animId == this.selectId) {
            return
        }

		let modeID = GetXianlvModel(this.selectId)
		let actor: Actor = this.xianLvActor.updateByPlayer(modeID)

		this.animId = this.selectId

		if (this.timer) {
            KillTimer(this.timer)
            this.timer = null
        }

		let callback = function () {
            if (this.listener) {
                actor.removeAnimListener(this.listener)
                this.listener = null
            }

            actor.changeAction("attack")

            let resetAction = function (args) {
                if (args == "end") {
                    actor.changeAction("idle")
                    actor.removeAnimListener(this.listener)
                    this.listener = null;
                }
            }
            this.listener = { this_index: this, function_index: resetAction, notify_name: "end" }
            actor.addAnimListener(this.listener)

            if (this.timer) {
                KillTimer(this.timer)
                this.timer = null
            }
        }
        this.timer = SetTimer(callback, this, 1000)
	}

	//重置状态
	resetUpgradeBtnState() {
		this.mElemList["btn_autoUp1"].text = Localize_cns("PET_AUTO_UPGRADE")
		this.mElemList["btn_up1"].enabled = true
		this.auto = false
		this.isAutoYB = false
	}

	sendUpgradeWithCheck() {
		let level = XianLvSystem.getInstance().getLevel(this.selectId)
		let exp = XianLvSystem.getInstance().getExpById(this.selectId)

		let upgradeConfig = GameConfig.FunUpgradeStageConfig["XianLv"]

		let needItemid = upgradeConfig[level].itemid
		let needItemNum = upgradeConfig[level].itemnum
		let had = ItemSystem.getInstance().getItemCount(needItemid)

		//消耗货币
		let moneyUnit = upgradeConfig[level].moneyunit
		let ownMoney = GetHeroMoney(moneyUnit)
		let costMoney = upgradeConfig[level].money

		let auto = this.mElemList["cBox_auto"].selected == true ? 1 : 0
		//判断货币是否足够
		if (ownMoney < costMoney) {
			//直接弹出对应的货币购买界面
			WngMrg.getInstance().showWindow("MoneyChargeFrame")

			this.resetUpgradeBtnState()
			return
		}

		if (had < needItemNum) {
			//自动购买
			if (auto) {
				var count = needItemNum - had
				var byPrice = ShopSystem.getInstance().getBindYBItemPrice(2, needItemid)
				if (byPrice) {
					if (GetHeroMoney(opItemUnit.BIND_CURRENCY) >= (count * byPrice)) {
						RpcProxy.call("C2G_ACTOR_XIANLV_UPGRADE", this.selectId, auto)
						this.mElemList["xl_upgrade_anim" + this.selectId + level + exp] = UIUpgradeAnim.newObj(this.mLayoutNode, "xl_upgrade_anim" + this.selectId + level + exp, 0, 0, this.mElemList["xl_anim_wnd"])
						this.mElemList["xl_upgrade_anim" + this.selectId + level + exp].startAnim(10)
					} else {
						if (!this.isAutoYB) {
							let _this = this
							let callback: IDialogCallback = {
								onDialogCallback(result: boolean, userData): void {
									if (result) {
										let ybPrice = ShopSystem.getInstance().getBindYBItemPrice(1, needItemid)
										if (ybPrice) {
											let needCount = Math.ceil((count * byPrice - GetHeroMoney(opItemUnit.BIND_CURRENCY)) / byPrice)
											let needYB = needCount * ybPrice
											if (GetHeroMoney(opItemUnit.CURRENCY) >= needYB) {
												RpcProxy.call("C2G_ACTOR_XIANLV_UPGRADE", _this.selectId, auto)
												_this.mElemList["xl_upgrade_anim" + _this.selectId + level + exp] = UIUpgradeAnim.newObj(_this.mLayoutNode, "xl_upgrade_anim" + _this.selectId + level + exp, 0, 0, _this.mElemList["xl_anim_wnd"])
												_this.mElemList["xl_upgrade_anim" + _this.selectId + level + exp].startAnim(10)

												_this.isAutoYB = true
											} else {
												MsgSystem.addTagTips(Localize_cns("COPY_TXT16"))
												ExecuteMainFrameFunction("chongzhi")
												_this.resetUpgradeBtnState()
											}
										}
									} else {
										_this.resetUpgradeBtnState()
									}
								}
							}
							MsgSystem.confirmDialog(Localize_cns("PET_TXT38"), callback)
						} else {
							let ybPrice = ShopSystem.getInstance().getBindYBItemPrice(1, needItemid)
							if (ybPrice) {
								let needCount = Math.ceil((count * byPrice - GetHeroMoney(opItemUnit.BIND_CURRENCY)) / byPrice)
								let needYB = needCount * ybPrice
								if (GetHeroMoney(opItemUnit.CURRENCY) >= needYB) {
									RpcProxy.call("C2G_ACTOR_XIANLV_UPGRADE", this.selectId, auto)
									this.mElemList["xl_upgrade_anim" + this.selectId + level + exp] = UIUpgradeAnim.newObj(this.mLayoutNode, "xl_upgrade_anim" + this.selectId + level + exp, 0, 0, this.mElemList["xl_anim_wnd"])
									this.mElemList["xl_upgrade_anim" + this.selectId + level + exp].startAnim(10)

									//this.isAutoYB = true
								} else {
									MsgSystem.addTagTips(Localize_cns("COPY_TXT16"))
									ExecuteMainFrameFunction("chongzhi")
									this.resetUpgradeBtnState()
								}
							}
						}
					}
				}
				return
			}

			//弹出材料购买界面
			if (GuideSystem.getInstance().isFinishGuide()) {
				let quickWnd = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
				quickWnd.onShowWnd(needItemid, needItemNum - had);
			}

			this.resetUpgradeBtnState()
		} else {
			RpcProxy.call("C2G_ACTOR_XIANLV_UPGRADE", this.selectId, auto)
			this.mElemList["xl_upgrade_anim" + this.selectId + level + exp] = UIUpgradeAnim.newObj(this.mLayoutNode, "xl_upgrade_anim" + this.selectId + level + exp, 0, 0, this.mElemList["xl_anim_wnd"])
			this.mElemList["xl_upgrade_anim" + this.selectId + level + exp].startAnim(10)
		}
	}

	onTipsClick() {
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
		wnd.showWithActivity("xianlvRule")
	}

	onUpClick(event: egret.TouchEvent) {
		if (this.auto) {
			this.resetUpgradeBtnState()
		}

		this.sendUpgradeWithCheck()
	}


	//失败停止升级
	stopAutoUpgrade() {
		this.sendUpgradeWithCheck()
	}

	//自动更新
	onAutoClick(event: egret.TouchEvent) {
		this.auto = !this.auto

		if (this.auto) {
			this.mElemList["btn_autoUp1"].text = Localize_cns("STOP")
			this.mElemList["btn_up1"].enabled = false

			this.sendUpgradeWithCheck()
		} else {
			this.mElemList["btn_autoUp1"].text = Localize_cns("PET_AUTO_UPGRADE")
			this.mElemList["btn_up1"].enabled = true
		}
	}
}