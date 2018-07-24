class HouseWindow extends BaseCtrlWnd {
	mElemList;
	houseLevel:number
	houseExp:number
	soulType
	oneKey:boolean

	public initObj(...params: any[]) {
		this.soulType = cellOptionsIndex.PetTongLin
		this.oneKey = false
	}

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		var elemInfo =[
				{["name"] : "upgrade_btn",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onUpgrade1Click},
				{ ["name"]: "all_upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAllUpgradeClick },
				{ ["name"]: "see_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSeeClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		for(let i = 1;i<3;i++){
			this.mElemList["actorview"+i] = UIActorView.newObj(this.mLayoutNode, "actorview"+i, 0, 0, this.mElemList["group_actorview"+i])
		}
		this.setCountDown(0)
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		this.mElemList["group2"].visible = true;
		this.mElemList["title"].text = Localize_cns("SANSHENG_TXT8")
		RegisterEvent(EventDefine.HOUSE_UPDATE, this.onRefresh, this)
		RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		RegisterEvent(EventDefine.HOUSE_ADVANCE_UPDATE, this.onRefreshAdvance, this)	//成功
		RegisterEvent(EventDefine.FUN_AUTO_FAIL, this.stopAutoUpgrade, this)
		RpcProxy.call("C2G_UpdateHourse")
		this.oneKey = false
		this.setBtnState()
		this.onRefresh()
	}

	public onHide(): void {
		this.mElemList["group2"].visible = false;
		UnRegisterEvent(EventDefine.HOUSE_UPDATE, this.onRefresh, this)
		UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		UnRegisterEvent(EventDefine.HOUSE_ADVANCE_UPDATE, this.onRefreshAdvance, this)
		UnRegisterEvent(EventDefine.FUN_AUTO_FAIL, this.stopAutoUpgrade, this)
		for(let i = 1 ; i<3;i++){ 
			let actorView:UIActorView = this.mElemList["actorview"+i]
			actorView.clearView()
		}	
	}
	
	onRefresh() {
		let houseInfo = ActivitySystem.getInstance().getHouseInfo()
		let image = "sss_fangWu01"
		this.mElemList["house_bg"].source = image
		if(houseInfo == null){
			return
		}	
		let _type = houseInfo.houseData.type || 100
		if(_type == 101){
			image = "sss_fangWu02"
		}else if(_type == 102){
			image = "sss_fangWu03"
		}
		this.mElemList["house_bg"].source = image
		let stage = houseInfo.houseData.stage || 1 
		if(stage == 0){
			stage = 1
		}
		this.mElemList["group2_bottom_group"].visible = (stage!=15)
		this.mElemList["house_max_tip"].visible = (stage >= 15)
		
		this.houseLevel = stage
		this.houseExp = houseInfo.houseData.stageexp || 0
		this.mElemList["house_text"].text = Localize_cns(("SANSHENG_TXT"+_type))
		this.mElemList["advance_text"].text = String.format(Localize_cns("SANSHENG_TXT6"),stage)
		let power = houseInfo.power
		this.setCountDown(power)
		// this.onRefreshMyView(houseInfo.playerInfo.plrAppear)
		// this.onRefreshOtherView(houseInfo.playerInfo.spouseAppear)
		let myInfo = houseInfo.playerInfo.plrAppear
		let otherInfo = houseInfo.playerInfo.spouseAppear
		this.onRefreshView(myInfo,otherInfo)
		this.onRefreshNeedItem()	
    }

	//如果是一键升阶,继续做进阶的逻辑
	onRefreshAdvance(){
		if(this.oneKey){
			let houseInfo = ActivitySystem.getInstance().getHouseInfo()
			let curStage = houseInfo.houseData.stage || 1 	//等级
			
			let config = GameConfig.FunUpgradeStageConfig
			let houseConfig = config["Hourse"]
			let curInfo = houseConfig[curStage]
			//消耗材料
        	let itemId = curInfo.itemid
        	let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)
        	let needItemCount = curInfo.itemnum

        	//消耗货币
        	let moneyUnit = curInfo.moneyunit
        	let ownMoney = GetHeroMoney(moneyUnit)
        	let costMoney = curInfo.money
			let buyCount = needItemCount - ownItemCount

			let isCanUpgrade = true
			let isNeedBuyGold = false

			if (ownMoney < costMoney) {
				isNeedBuyGold  = true
       	 	}

			if (ownItemCount < needItemCount) {
				isCanUpgrade = false
        	}

			if(isNeedBuyGold){
				this.oneKey = false
				this.setBtnState()
				MsgSystem.addTagTips(Localize_cns("NO_MONEY"))
				return
			}

			let index = 0
			let boxSelect = false
			if(this.mElemList["buy_checkbox"].selected){
				boxSelect = true
				index = 1
			}

			if(boxSelect){
				this.upgradeAni()
				RpcProxy.call("C2G_HourseUpdate",index)
			}else{
				if(isCanUpgrade){
					this.upgradeAni()
					RpcProxy.call("C2G_HourseUpdate",index)
				}else{
					this.oneKey = false
					this.setBtnState()
					let quickWnd : GoodsAsseceFrame = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
            		quickWnd.onShowWnd(itemId, buyCount);
					return
				}
			}
		}
	}

	stopAutoUpgrade(){
		if(this.oneKey){
			this.oneKey = false
			this.setBtnState()
		}
	}

	onRefreshNeedItem(){
		//消耗材料
		let level = this.houseLevel
		
		let config = GameConfig.FunUpgradeStageConfig
		let houseConfig = config["Hourse"]
		if(level>=size_t(houseConfig)){
			AddRdContent(this.mElemList["need_rd1"],"" , "ht_20_cc", "white")
			AddRdContent(this.mElemList["need_rd2"],"" , "ht_20_cc", "white")
			return
		}
		
		let curInfo = houseConfig[level]
		//消耗材料
		let itemId = curInfo.itemid
		let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)	//0
		let needItemCount = curInfo.itemnum	//2

		let str = ""
		let needColor = "#green"
		if(needItemCount > ownItemCount){
			needColor = "#red"
		}
		str = String.format(Localize_cns("SANSHENG_TXT10"),needColor+ownItemCount+"/"+needItemCount)
		AddRdContent(this.mElemList["need_rd1"],str ,"ht_20_cc", "ublack")
		
		needColor = "#green"
        //消耗货币
        let moneyUnit = curInfo.moneyunit
        let ownMoney = GetHeroMoney(moneyUnit) 	//322164
        let costMoney = curInfo.money	//1300
		if(costMoney > ownMoney){
			needColor = "#red"
		}

		str = String.format(Localize_cns("SANSHENG_TXT11"),needColor+costMoney+"#rf")
		AddRdContent(this.mElemList["need_rd2"],str ,"ht_20_cc", "ublack")

		let cur = this.houseExp
		let max = curInfo.maxexp
		let progress =  CastType<eui.ProgressBar>(this.mElemList["exp_progress"]);
		let maxTip = this.mElemList["max_tip"]
		if(level>=15){	//房子最高等级 没读配置表
			progress.labelDisplay.visible = false
			maxTip.visible = true
		}else{
			maxTip.visible = false
			progress.labelDisplay.visible = true
			UiUtil.updateProgress(progress, cur, max)
		}
		
		
		
		// let labelFunction1 = (0:100) => string
		// progress.labelFunction = labelFunction1;
	}

	setCountDown(num) {
        let imageBox:gui.BatchImage = this.mElemList["countdown"]
        imageBox.beginDraw();
		imageBox.drawNumberString("zhanLi_", num, 0, 0)
		imageBox.endDraw();
    }

	onRefreshView(myInfo,otherInfo){
		for(let i = 1;i<3;i++){
			let roleGroup = this.mElemList["role"+i]
			roleGroup.visible = false
			let info = null
			if(i == 1){
				info = myInfo
			}else{
				info = otherInfo
			}
			if(info){
				roleGroup.visible = true
				let model = GetProfessionModel(info.vocation,info.sexId)
				let actorView:UIActorView = this.mElemList["actorview"+i]
				actorView.updateByPlayerAppearInfo(info)
			}
		}
	}


	//升阶先点这个
	onUpgrade1Click(){
		let isMarry = (GetHeroProperty("spouseId")>0)	//是否结婚
		if(!isMarry){
			MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT12"))
			return
		}

		let curStage = this.houseLevel
		let config = GameConfig.FunUpgradeStageConfig
		let houseConfig = config["Hourse"]
		let curInfo = houseConfig[curStage]
		//消耗材料
        let itemId = curInfo.itemid
        let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)
        let needItemCount = curInfo.itemnum

        //消耗货币
        let moneyUnit = curInfo.moneyunit
        let ownMoney = GetHeroMoney(moneyUnit)
        let costMoney = curInfo.money
		let buyCount = needItemCount - ownItemCount

		let isCanUpgrade = true
		let isNeedBuyGold = false

		if (ownMoney < costMoney) {
			isNeedBuyGold  = true
        }

		if (ownItemCount < needItemCount) {
			isCanUpgrade = false
        }

		if(isNeedBuyGold){
			MsgSystem.addTagTips(Localize_cns("NO_MONEY"))
			return
		}

		let index = 0
		//点击自动购买
		if(this.mElemList["buy_checkbox"].selected){
			index = 1
			this.upgradeBuyTip()
		}else{
			if(isCanUpgrade){
				this.upgradeAni()
				RpcProxy.call("C2G_HourseUpdate",index)
			}else{
				let quickWnd : GoodsAsseceFrame = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
            	quickWnd.onShowWnd(itemId, buyCount);
				return
			}
		}
	}

	//自动进阶
	onAllUpgradeClick(){
		if(this.oneKey){
			this.oneKey = false
			this.setBtnState()
			return
		}


		let isMarry = (GetHeroProperty("spouseId")>0)	//是否结婚
		if(!isMarry){
			MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT12"))
			return
		}

		let curStage = this.houseLevel
		let config = GameConfig.FunUpgradeStageConfig
		let houseConfig = config["Hourse"]
		let curInfo = houseConfig[curStage]
		//消耗材料
        let itemId = curInfo.itemid
        let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)
        let needItemCount = curInfo.itemnum

        //消耗货币
        let moneyUnit = curInfo.moneyunit
        let ownMoney = GetHeroMoney(moneyUnit)
        let costMoney = curInfo.money
		let buyCount = needItemCount - ownItemCount

		let isCanUpgrade = true
		let isNeedBuyGold = false

		if (ownMoney < costMoney) {
			isNeedBuyGold  = true
        }

		if (ownItemCount < needItemCount) {
			isCanUpgrade = false
        }

		if(isNeedBuyGold){
			MsgSystem.addTagTips(Localize_cns("NO_MONEY"))
			return
		}


		let index = 0
		let boxSelect = false
		if(this.mElemList["buy_checkbox"].selected){
			boxSelect = true
			index = 1
		}
	
		//选择了自动购买 不判断购买逻辑
		if(boxSelect){
			//要写确认 今日不再提示
			this.oneKey = true
			this.upgradeBuyTip()
		}else{
			if(isCanUpgrade){
				this.oneKey = true
				this.upgradeAni()
				RpcProxy.call("C2G_HourseUpdate",index)
			}else{
				let quickWnd : GoodsAsseceFrame = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
            	quickWnd.onShowWnd(itemId, buyCount);
				return
			}
		}

		this.setBtnState()
	}

	setBtnState(){
		if(this.oneKey){
			this.mElemList["all_upgrade_btn"].text = Localize_cns("STOP")
        	this.mElemList["upgrade_btn"].enabled = false
		}else{
			this.mElemList["all_upgrade_btn"].text = Localize_cns("PET_AUTO_UPGRADE")
        	this.mElemList["upgrade_btn"].enabled = true
		}
	}

	onSeeClick(){
		WngMrg.getInstance().showWindow("HousePowerInfoFrame");
	}

	upgradeAni(){
		this.mElemList["upgrade_anim"] = UIUpgradeAnim.newObj(this.mLayoutNode, "upgrade_anim", 0, 0, this.mElemList["anim_wnd"])
        this.mElemList["upgrade_anim"].startAnim(10)
	}

	upgradeBuyTip(){
		let str = Localize_cns("SANSHENG_TXT43")
		this.mElemList["upgrade_anim"] = UIUpgradeAnim.newObj(this.mLayoutNode, "upgrade_anim", 0, 0, this.mElemList["anim_wnd"])
        let node = this.mElemList["upgrade_anim"]
		// this.mElemList["upgrade_anim"].startAnim(10)
		var t: IDialogCallback = {
            onDialogCallback(result: boolean, userData): void {
                if (result == true) {
                    node.startAnim(10)
					RpcProxy.call("C2G_HourseUpdate",1)
                }
            }
        }
        MsgSystem.confirmDialog(str, t,ConfirmFrom.BUY_HOUSE_ITEM)
	}
 }