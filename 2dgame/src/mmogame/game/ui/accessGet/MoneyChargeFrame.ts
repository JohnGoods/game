// TypeScript file
class MoneyChargeFrame extends BaseWnd {
	itemEnough
	twice
	item
	//static  MONEY_CHARGE  = 60045 //银两兑换令
	//static  MONEY_CHARGE_COUNT = 1  //银两兑换令次数
	//static  MONEY_CHARGE_CURREY_COUNT = 10   //消耗元宝数量

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/role/MoneyChargeLayout.exml"]

	}
	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.mLayoutNode.width = 447
		this.mLayoutNode.height = 324
		this.setAlignCenter(true, true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_charge", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onChargeClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
		this.mElemList["rd_money"].setAlignFlag(gui.Flag.LEFT_CENTER)
		this.mElemList["rd_cost"].setAlignFlag(gui.Flag.LEFT_CENTER)
	}
	public onUnLoad(): void {

	}

	public onShow(): void {
		UiUtil.registerTouchOutsideEvent(this.hideWnd, this, [this.mLayoutNode])
		RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = true;
		this.onRefresh();
	}

	public onHide(): void {
		UiUtil.unRegisterTouchOutsideEvent(this.hideWnd, this)
		UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = false;
	}
	onRefresh() {

		this.itemEnough = false
		this.twice = false
		//rd_money
		let guankaId = CampaignSystem.getInstance().getCurOpenCampaign() || 1001
		let zhangjieId = GameConfig.CampaignConfig[guankaId]["chapterId"]
		let money = GameConfig.AutoFightMonsterConfig[zhangjieId]["funds"]
		money = money * 2 * 60 * 4
		let moneyStr = String.format(Localize_cns("ACCESS_MONEY_GET"), money)
		AddRdContent(this.mElemList["rd_money"], moneyStr, "ht_24_cc", "saddlebrown")

		//rd_cost
		let needId = exchangeFundOptions.itemid
		let had = ItemSystem.getInstance().getItemCount(needId)
		if (had <= 0) {
			needId = opItemUnit.CURRENCY
			had = GetHeroMoney(needId)
		}
		this.item = needId
		let checkItem = needId == exchangeFundOptions.itemid
		let judge = checkItem ? exchangeFundOptions.itemnum : exchangeFundOptions.gold
		this.itemEnough = had >= judge ? true : false
		let icon = ""
		if(checkItem){
			icon = GetTagIcon(needId)
		}else{
			icon = GetMoneyIcon(needId)
		}
		let yuanBaoStr = String.format(Localize_cns("ACCESS_MONEY_COST"), icon + had, judge)
		AddRdContent(this.mElemList["rd_cost"], yuanBaoStr, "ht_24_cc", "saddlebrown")

		//label_num
		let num = getSaveRecord(opSaveRecordKey.rmbGoldToFundsCount) || 0

		let total = VipSystem.getInstance().getRechargeMoneyTwice() || 0
		let twice = total - num
		this.twice = num >= total ? false : true
		let numStr = String.format(Localize_cns("ACCESS_TXT4"), twice)
		this.mElemList["label_num"].textColor = "ublack"
		this.mElemList["label_num"].text = numStr;

		//label_vip
		let vip = GetHeroProperty("VIP_level") || 0
		let text = String.format(Localize_cns("ACCESS_TXT5"), vip + 1)
		if (vip == exchangeFundOptions.maxVipNum) {
			text = Localize_cns("ACCESS_MAX_VIP")
		}
		this.mElemList["label_vip"].text = text
	}
	public onChargeClick(): void {
		if (this.itemEnough == false) {
			let showTips = Localize_cns("ACCESS_NOT_ENOUGH")
			if (GetMoneyIcon(this.item) != "") {
				let formatStr = Localize_cns(ItemUnitName[this.item])
				showTips = String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr)
			}
			MsgSystem.addTagTips(showTips)
			return
		}
		if (this.twice == false) {
			MsgSystem.addTagTips(Localize_cns("ACCESS_NOT_TWICE"))
			return
		}
		RpcProxy.call("C2G_EXCHANGE_FUNDS")
	}

}