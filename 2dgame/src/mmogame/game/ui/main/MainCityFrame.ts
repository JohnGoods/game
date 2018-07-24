class MainCityFrame extends BaseWnd {
	controlData: any;
	timerConfig
	timerList;
	timerLableList;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/MainCityLayout.exml"]
		this.timerList = {}
		this.timerLableList = {}
		this.timerConfig = [

			{ index: PayActivityIndex.EVERY_MIXACCU_RECHARGE, timerCallCheck: this.MeiRiCheck, timerCall: this.MeiRiCall },
			{ index: PayActivityIndex.DAILY_EXPENSIVE_GIFT, timerCallCheck: this.TodayGiftCheck, timerCall: this.TodayGiftCall },
			{ index: PayActivityIndex.STAGE_UP, timerCallCheck: this.stageUpCheck, timerCall: this.stageUpCall },
			{ index: PayActivityIndex.C_LUCKY, timerCallCheck: this.LuckyCheck, timerCall: this.LuckyCall },
			{ index: PayActivityIndex.GOD_PET_INCOME, timerCallCheck: this.godPetComeCheck, timerCall: this.godPetComeCall },
			// {index:PayActivityIndex.C_LUCKY_A,timerCallCheck:this.LuckyCheck,timerCall:this.LuckyCall},
			{ index: PayActivityIndex.NEW_SERVER_INST_ZONES, timerCallCheck: this.openCheck, timerCall: this.openCall },
			{ index: PayActivityIndex.NORMAL_INST_ZONES, timerCallCheck: this.norInstZonesCheck, timerCall: this.norInstZonesTick },
			{ index: PayActivityIndex.C_SHOP_SHENMI, timerCallCheck: this.checkShopShenMi, timerCall: this.shopShenMTick },
		]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		this.mLayoutNode.setLayer(gui.GuiLayer.Bottom)

		var elemInfo = [
			{ ["name"]: "club_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClubClick },
			{ ["name"]: "champion_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onChampionClick },
			{ ["name"]: "boss_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBoss },
			{ ["name"]: "activity_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onActivityClick },
			{ ["name"]: "fuben_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onFubenClick },
			{ ["name"]: "judian_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickJudian },

			{ ["name"]: "btn_yuanbao", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onYuanBaoClick },
			{ ["name"]: "btn_equip", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onEquipClick },
			{ ["name"]: "btn_pet", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPetClick },
			{ ["name"]: "btn_jingji", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onJingJiClick },
			{ ["name"]: "btn_tianxian", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTianXianClick },
			{ ["name"]: "btn_marry", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onMarryClick },
			{ ["name"]: "btn_suit", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSuitClick },

			{ ["name"]: "btn_friends", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onFriendsClick },
			{ ["name"]: "cross_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onCrossClick },

			{ ["name"]: "btn_xingling", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onXingLingClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
	}

	public onUnLoad(): void {

	}

	public onShow(): void {

		RegisterEvent(EventDefine.PAY_ACTIVITY_LIST, this.refreshFrame, this)

		this.mLayoutNode.visible = true;
		let wnd = WngMrg.getInstance().getWindow("MainFrame")
		if (wnd.isVisible() == true) {
			wnd.setChatViewerVisible(false)
		}

		this.refreshFrame()

		this.checkXingLing()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PAY_ACTIVITY_LIST, this.refreshFrame, this)

		this.mLayoutNode.visible = false;
		let wnd = WngMrg.getInstance().getWindow("MainFrame")
		if (wnd.isVisible() == true) {
			wnd.setChatViewerVisible(true)
		}

		for(let i in this.timerList){
			KillTimer(this.timerList[i])
		}
		this.timerList = {};
	}


	public refreshFrame() {
		let parentGroup: eui.Group = this.mElemList["group_actList"]
		parentGroup.removeChildren()

		this.controlData = {}

		let uiConfigList: any[] = GetOpenActivityUiConfig("MainCity")
		for (let conf of uiConfigList) {
			let config = table_copy(conf)
			if (conf.dynamicConfig) {
				let [flag, c] = conf.dynamicConfig(conf)
				if (flag == true) {
					config = c
				} else {
					continue
				}
			}
			let uiElemList = [];

			let elem3 = { ["index_type"]: eui.Group, ["name"]: "bg" + config.index, ["image"]: "", ["x"]: 0, ["y"]: 0 }
			uiElemList.push(elem3)
			let elem = { ["index_type"]: gui.Button, ["name"]: "dynamicButotn" + config.index, ["parent"]: "bg" + config.index, ["image"]: config.image, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickActivityButton, }
			uiElemList.push(elem)
			UiUtil.createElem(uiElemList, this.mLayoutNode, this.mElemList, this, parentGroup)

			//定时器
			if (config.timer) {
				let uiElemList1 = []
				let elem1 = { ["index_type"]: gui.Grid9Image, ["name"]: "time" + config.index, ["parent"]: "bg" + config.index, ["image"]: "zjm_shiJianDi01", ["color"]: gui.Color.white, ["x"]: 8, ["y"]: -10, ["w"]: 75, ["h"]: 19, ["messageFlag"]: true }
				let elem2 = { ["index_type"]: eui.Label, ["name"]: "timeLabel" + config.index, ["parent"]: "time" + config.index, ["title"]: "", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.lime, ["x"]: 0, ["y"]: 0, ["w"]: 75, ["h"]: 19, ["messageFlag"]: true }
				uiElemList1.push(elem1)
				uiElemList1.push(elem2)
				UiUtil.createElem(uiElemList1, this.mLayoutNode, this.mElemList, this, parentGroup)

				let func: Function = null
				let funcheck: Function = null
				for (let _ in this.timerConfig) {
					let timerConfig = this.timerConfig[_]
					if (config.index == timerConfig.index) {
						func = timerConfig.timerCall
						funcheck = timerConfig.timerCallCheck
					}
				}

				// this.timerLableList["timeBg" + config.index] = "time" + config.index
				this.timerLableList["dynamicButotn" + config.index] = "timeLabel" + config.index

				let timerIsNeedSet = false
				if (funcheck != null) {
					timerIsNeedSet = funcheck.call(this)
				}

				// if(this.timerList["time" + config.index] == null && func!=null && timerIsNeedSet){
				// 	this.mElemList["time" + config.index].visible = true
				if(this.timerList["time" + config.index]){
					KillTimer(this.timerList["time" + config.index])
				}
				this.timerList["time" + config.index] = SetTimer(func, this, 1000, true);
				// }else if(!timerIsNeedSet){
				// 	this.mElemList["time" + config.index].visible = false

				// 	if(this.timerList["time" + config.index]){
				// 		KillTimer(this.timerList["time" + config.index])
				// 	}
				// }
				this.mElemList["timeLabel" + config.index].visible = false
				this.mElemList["time" + config.index].visible = false
			}

			this.controlData["dynamicButotn" + config.index] = config
		}
	}




	public onClubClick(): void {

		ExecuteMainFrameFunction("gonghui")
	}

	public onChampionClick(): void {
		ExecuteMainFrameFunction("jingjichang")
	}


	public onClickBoss() {
		let wnd = WngMrg.getInstance().getWindow("BossMainFrame")
		wnd.showBossFrame(0)
	}

	public onActivityClick() {
		ExecuteMainFrameFunction("huodong")
	}

	public onFubenClick() {
		ExecuteMainFrameFunction("fuben")
	}

	public onClickJudian() {
		ExecuteMainFrameFunction("judian")
	}

	///Bottom

	public onYuanBaoClick() {
		ExecuteMainFrameFunction("yuanbaoshangdian")
	}

	public onEquipClick() {
		if (GetHeroProperty("level") < 40) {
			MsgSystem.addTagTips(String.format(Localize_cns("GUIDE_TXT3"), 40))
			return
		}
		ExecuteMainFrameFunction("zhuangbeishangdian")
	}

	public onPetClick() {
		ExecuteMainFrameFunction("chongwushangdian")
	}

	public onJingJiClick() {
		ExecuteMainFrameFunction("jingjishangdian")
	}

	public onTianXianClick() {
		let checkList = CheckMainFrameFunction(GuideFuncDefine.FIELD_FUNC_TIANXIAN)
		if (!checkList[0]) {
			MsgSystem.addTagTips(checkList[1])
			return
		}
		ExecuteMainFrameFunction("tianxian")
	}

	//三生三世
	public onMarryClick() {
		ExecuteMainFrameFunction("sanshengsanshi")
	}

	public onSuitClick() {
		let wnd: RoleSuitFrame = WngMrg.getInstance().getWindow("RoleSuitFrame")
		wnd.showWnd()
	}

	public onFriendsClick() {
		ExecuteMainFrameFunction("haoyou")
	}

	public onCrossClick() {
		ExecuteMainFrameFunction("global")
	}

	public onXingLingClick() {
		ExecuteMainFrameFunction("xingling")
	}

	public onClickActivityButton(args: egret.TouchEvent) {
		let name = args.target.name
		let config = this.controlData[name]

		ExecuteActivityIndex(config.index)
	}

	///
	LuckyCheck() {
		// let serverTime = GetServerTime()
		// let tomorrowTime = GetTomorrowTime(serverTime)
		// let day = GetServerDay()
		// if(serverTime < tomorrowTime && day >= 9){
		return true
		// }
		// return false
	}

	LuckyCall() {
		let index = PayActivityIndex.C_LUCKY
		let luckyInfo = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.PET_LOTTERY)
		if (luckyInfo == undefined) {
			return
		}
		let overTime = luckyInfo.remainTime
		let bg = this.mElemList["time" + index]
		let name = this.timerLableList["dynamicButotn" + index]
		let lable = this.mElemList[name]
		if (lable == null) {
			return
		}
		bg.visible = false
		let serverTime = GetServerTime()
		let day = GetServerDay()
		if (serverTime < overTime && day >= 9) {
			let timeDiffcuf = overTime - serverTime
			let timeText = getFormatDiffTimDayHour(timeDiffcuf)
			lable.text = timeText
			bg.visible = true
			lable.visible = true
		} else {
			KillTimer(this.timerList["time" + index])
		}

	}



	MeiRiCheck() {
		return true
	}

	//每日充值
	MeiRiCall() {
		let index = PayActivityIndex.EVERY_MIXACCU_RECHARGE
		let bg = this.mElemList["time" + index]
		let name = this.timerLableList["dynamicButotn" + index]
		let lable = this.mElemList[name]
		if (lable == null) {
			return
		}
		bg.visible = false
		let serverTime = GetServerTime()
		let tomorrowTime = GetTomorrowTime(serverTime)
		let day = GetServerDay()
		if (serverTime < tomorrowTime) {
			let timeDiffcuf = tomorrowTime - serverTime
			let timeText = getFormatDiffTimDayHour(timeDiffcuf)
			lable.text = timeText
			bg.visible = true
			lable.visible = true
		} else {
			KillTimer(this.timerList["time" + index])
		}

	}

	TodayGiftCheck() {
		return true
	}

	//今日豪礼
	TodayGiftCall() {
		let index = PayActivityIndex.DAILY_EXPENSIVE_GIFT
		let bg = this.mElemList["time" + index]
		let name = this.timerLableList["dynamicButotn" + index]
		let lable = this.mElemList[name]
		if (lable == null) {
			return
		}
		bg.visible = false
		let serverTime = GetServerTime()
		let tomorrowTime = GetTomorrowTime(serverTime)
		let day = GetServerDay()
		if (serverTime < tomorrowTime) {
			let timeDiffcuf = tomorrowTime - serverTime
			let timeText = getFormatDiffTimDayHour(timeDiffcuf)
			lable.text = timeText
			bg.visible = true
			lable.visible = true
		} else {
			KillTimer(this.timerList["time" + index])
		}
	}


	stageUpCheck() {
		return true
	}

	stageUpCall() {
		let index = PayActivityIndex.STAGE_UP
		let bg = this.mElemList["time" + index]
		let name = this.timerLableList["dynamicButotn" + index]
		let lable = this.mElemList[name]
		if (lable == null) {
			return
		}
		bg.visible = false
		let serverTime = GetServerTime()
		let tomorrowTime = GetTomorrowTime(serverTime)
		let day = GetServerDay()
		if (serverTime < tomorrowTime) {
			let timeDiffcuf = tomorrowTime - serverTime
			let timeText = getFormatDiffTimDayHour(timeDiffcuf)
			lable.text = timeText
			bg.visible = true
			lable.visible = true
		} else {
			KillTimer(this.timerList["time" + index])
		}
	}

	godPetComeCheck() {
		return true
	}

	godPetComeCall() {
		let index = PayActivityIndex.GOD_PET_INCOME
		let name = this.timerLableList["dynamicButotn" + index]
		let lable = this.mElemList[name]
		let bg = this.mElemList["time" + index]
		let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(index)
		if (activityInfo == null) {
			return
		}
		let overTime = activityInfo[0]
		if (lable == null) {
			return
		}
		bg.visible = false
		let serverTime = GetServerTime()
		if (serverTime < overTime) {
			let timeDiffcuf = overTime - serverTime
			let timeText = getFormatDiffTimDayHour(timeDiffcuf)
			lable.text = timeText
			bg.visible = true
			lable.visible = true
		} else {
			KillTimer(this.timerList["time" + index])
		}

	}

	//开服活动
	openCheck() {
		let info = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NEW_SERVER_INST_ZONES) || []             //[serverDay, utils.getTomorrow()]
		let overTime = info[1] || GetServerTime()

		if (overTime <= GetServerTime()) {
			return false
		}
		return true
	}

	openCall() {
		let index = PayActivityIndex.NEW_SERVER_INST_ZONES
		let name = this.timerLableList["dynamicButotn" + index]
		let lable = this.mElemList[name]
		let bg = this.mElemList["time" + index]
		if (lable == null) {
			return
		}
		bg.visible = false
		lable.visible = false
		let info = ActivitySystem.getInstance().getOperateActivityInfo(index) || []             //[serverDay, utils.getTomorrow()]
		let overTime = info[1] || GetServerTime()

		let leftTime = overTime - GetServerTime()
		if (leftTime > 0) {
			let day = Math.floor(leftTime / opTime.Day)
			let t = simple_transform_time1(leftTime % opTime.Day)
			let timeStr = String.format("%d:%02d:%02d", day, t.hours, t.mins)
			//let timeStr = String.format(Localize_cns("OPENSERVER_TXT35"), t.hours, t.mins)
			lable.text = timeStr
			lable.visible = true
			bg.visible = true
			lable.visible = true
		} else {
			// KillTimer(this.timerList["time" + index])
		}
	}

	//开服活动
	norInstZonesCheck() {
		let info = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NORMAL_INST_ZONES) || []             //[serverDay, utils.getTomorrow()]
		let overTime = info[1] || GetServerTime()

		if (overTime <= GetServerTime()) {
			return false
		}
		return true
	}

	norInstZonesTick() {
		let index = PayActivityIndex.NORMAL_INST_ZONES
		let name = this.timerLableList["dynamicButotn" + index]
		let lable = this.mElemList[name]
		let bg = this.mElemList["time" + index]
		if (lable == null) {
			return
		}
		bg.visible = false
		lable.visible = false
		let info = ActivitySystem.getInstance().getOperateActivityInfo(index) || []             //[serverDay, utils.getTomorrow()]
		let overTime = info[1] || GetServerTime()

		let leftTime = overTime - GetServerTime()
		if (leftTime > 0) {
			let day = Math.floor(leftTime / opTime.Day)
			let t = simple_transform_time1(leftTime % opTime.Day)
			let timeStr = String.format("%d:%02d:%02d", day, t.hours, t.mins)
			//let timeStr = String.format(Localize_cns("OPENSERVER_TXT35"), t.hours, t.mins)
			lable.text = timeStr
			lable.visible = true
			bg.visible = true
			lable.visible = true
		} else {
			// KillTimer(this.timerList["time" + index])
		}
	}

	//神秘商店
	checkShopShenMi() {
		return true
	}

	shopShenMTick() {
		let index = PayActivityIndex.C_SHOP_SHENMI
		let name = this.timerLableList["dynamicButotn" + index]
		let lable = this.mElemList[name]
		let bg = this.mElemList["time" + index]
		if (lable == null) {
			return
		}
		bg.visible = true
		lable.visible = true

		let day = GetServerDay()
		while (day > 16) {
			day -= 16
		}
		while (day > 8) {
			day -= 8
		}
		let count = 8 - day
		let formatStr = ""
		let osDate = GetOSDate()
		let timeStr = ""
		if(count == 0){
			timeStr = String.format("%02d:%02d", 23 - osDate.hour, 60 - osDate.min)
		}else{
			timeStr = String.format("%d:%02d:%02d", count, 23 - osDate.hour, 60 - osDate.min)
		}
		//let timeStr = String.format(Localize_cns("OPENSERVER_TXT35"), t.hours, t.mins)
		lable.text = timeStr
	}


	//星灵开启
	checkXingLing() {
		let creatTime = RoleSystem.getInstance().getRoleCreateTime()
		let endTime = GetTomorrowTime(creatTime)
		let osTime = GetServerTime()
		let check = osTime >= endTime
		if (g_isExaming == true){//审核版本,星灵不开放
			check = false;
		}
		this.mElemList["btn_xingling"].visible =  check
	}
}