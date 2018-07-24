class MainContentFrame extends BaseWnd {
	wndList: any
	campaignId: number;
	rankAcitivityConfig;
	activityStartTime;
	activityCheck: boolean
	activityStartConfig;
	curActivityIndex;
	curActivityUIClose;
	chatTimer;
	chatNum;
	chatConfig;

	tiannvShow

	tianNvTimer
	tastTimer: number;

	freeTimer: number;

	campTimer: number;

	//xl_timer

	public initObj(...params: any[]) {

		this.mLayoutPaths = ["resource/layouts/MainContentLayout.exml"]
		this.rankAcitivityConfig =
			[{ index: 1, image: "zjm_Bt41" },
			{ index: 2, image: "zjm_Bt31" },
			{ index: 3, image: "zjm_Bt40" },
			{ index: 4, image: "zjm_Bt42" },
			{ index: 5, image: "zjm_Bt43" },
			{ index: 6, image: "zjm_Bt44" },
			{ index: 7, image: "zjm_Bt45" },
			{ index: 8, image: "zjm_Bt46" },
			]
		this.activityStartTime = null
		this.activityCheck = false
		this.activityStartConfig = [
			{ "ordinaryActivityIndex": OrdinaryActivityIndex.DATI, text: Localize_cns("ACTIVITY_START_TXT1"), call: this.onAnswerClicked },
			{ "ordinaryActivityIndex": OrdinaryActivityIndex.GlobalMine, text: Localize_cns("ACTIVITY_START_TXT2"), call: this.onEnterGlobalMine },
			{ "ordinaryActivityIndex": OrdinaryActivityIndex.WuLin, text: Localize_cns("ACTIVITY_START_TXT3"), call: this.onEnterWuLin },
			{ "ordinaryActivityIndex": OrdinaryActivityIndex.Stronghold, text: Localize_cns("ACTIVITY_START_TXT4"), call: this.onEnterTiangong },
		]
		this.curActivityUIClose = false

		this.chatConfig = [
			Localize_cns("CHAT_TXT10"),
			Localize_cns("CHAT_TXT11"),
			Localize_cns("CHAT_TXT12"),
			Localize_cns("CHAT_TXT13"),
		]

		let randomIndex = MathUtil.random(0, (size_t(this.chatConfig) - 1))
		this.chatNum = randomIndex

		this.tianNvTimer = null
		this.tiannvShow = true


	}

	creatChatTip() {
		let chatConfig = this.chatConfig
		if (this.chatTimer == null) {
			let tick = function (delay) {
				if (this.chatNum > (size_t(chatConfig) - 1)) {
					this.chatNum = 0
				}
				let text = chatConfig[this.chatNum]
				Chat_AddChannelMsg(channelType.SYSTEM, text)
				this.chatNum = this.chatNum + 1
			}
			this.chatTimer = SetTimer(tick, this, 1000 * 60 * 30, true)
		}
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreenRaw(true)
		this.initSkinElemList();

		this.mLayoutNode.touchEnabled = false;
		this.mLayoutNode.setLayer(gui.GuiLayer.Bottom)
		this.wndList = {}

		var elemInfo = [

			//背包和日常
			// { ["name"]: "btn_bag", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBeiBaoClick },
			// { ["name"]: "btn_daily", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onDailyClick },


			{ ["name"]: "btn_txdy", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTxdyClick },
			{ ["name"]: "capture_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCapture },
			{ ["name"]: "house_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickHouse },
			{ ["name"]: "rank_activity_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.opActivityRank },
			{ ["name"]: "capture_anim", ["messageFlag"]: true },

			{ ["name"]: "activity_go_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onActivityGoClick },
			{ ["name"]: "activity_close_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onActivityCloseClick },

			{ ["name"]: "tn_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGold },
			{ ["name"]: "tn_close_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.closeTianNvTip },

			{ ["name"]: "tn_btn2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGold },

			{ ["name"]: "tast_end_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.closeTianNvEnd },
			{ ["name"]: "recharge_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRecharge },

			//{ ["name"]: "xl_btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.closeXingLing },
			{ ["name"]: "xl_btn_charge", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickXingLing },

			{ ["name"]: "btn_activity_rank", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickActivityRank },

		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		this.mElemList["map_name"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["map_xy"].setAlignFlag(gui.Flag.H_CENTER)

		this.wndList["task"] = MainTaskWnd.newObj(this.mLayoutNode, this)
		this.wndList["preview"] = MainPreviewWnd.newObj(this.mLayoutNode, this)//yangguiming 暂时屏蔽
		this.wndList["fight"] = MainFightWnd.newObj(this.mLayoutNode, this)
		this.wndList["activity"] = MainActivityWnd.newObj(this.mLayoutNode, this)

		let group = <eui.Group>this.mElemList["preview_wnd"]
		group.touchEnabled = false

		RegisterEvent(EventDefine.COMBAT_BEGIN, this.onCombatBegin, this)
		RegisterEvent(EventDefine.STATE_ACTIVE, this.onStateActive, this)
		RegisterEvent(EventDefine.ACTIVITY_STATE_LIST, this.checkActivity, this)

		this.mElemList["map_tips"].visible = false

		this.mElemList["tast_wnd"].visible = false
		this.mElemList["tn_close_btn"].visible = false

		DelayEvecuteFunc(10 * 1000, this.creatChatTip, this)

		this.mElemList["guanggao_group"].visible = false
		this.mElemList["guanggao_group2"].visible = false

		this.mElemList["camp_time"].textColor = gui.Color.lime
	}

	// test(){


	// 	UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.test, this)
	// }

	public onUnLoad(): void {
		UnRegisterEvent(EventDefine.COMBAT_BEGIN, this.onCombatBegin, this)
		UnRegisterEvent(EventDefine.STATE_ACTIVE, this.onStateActive, this)
		UnRegisterEvent(EventDefine.ACTIVITY_STATE_LIST, this.checkActivity, this)


		for (let k in this.wndList) {
			let w = this.wndList[k]
			w.deleteObj()
		}
		this.wndList = null;

		if (this.chatTimer) {
			KillTimer(this.chatTimer)
			this.chatTimer = null
		}

		if (this.tianNvTimer) {
			KillTimer(this.tianNvTimer)
			this.tianNvTimer = null
		}

		if (this.tastTimer) {
			KillTimer(this.tastTimer)
			this.tastTimer = null
		}

		if (this.freeTimer) {
			KillTimer(this.freeTimer)
			this.freeTimer = null
		}

		if (this.campTimer) {
			KillTimer(this.campTimer)
			this.campTimer = null
		}

		this.tiannvShow = true

		RoleSystem.getInstance().clearTastTime()
	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_ENTER_GAME, this.passCampaign, this)
		RegisterEvent(EventDefine.PEERLESS_UPDATE, this.refreshPeerless, this)
		RegisterEvent(EventDefine.CAMPAIGN_MINE, this.refreshMapPos, this)
		RegisterEvent(EventDefine.HERO_ENTER_MAP, this.refreshMapPos, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		//RegisterEvent(EventDefine.COMBAT_BEGIN, this.resetTianNvTip, this)
		//RegisterEvent(EventDefine.COMBAT_END, this.resetTianNvTip, this)

		RegisterEvent(EventDefine.CAMPAIGN_PASS, this.passCampaign, this)
		RegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.refreshCampaignRecord, this)

		// RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.test, this)
		this.mLayoutNode.visible = true;
		this.moveToBack()

		this.wndList["task"].showWnd()
		this.wndList["preview"].showWnd()
		this.wndList["fight"].showWnd()
		this.wndList["activity"].showWnd()
		this.mElemList["activity_start_group"].visible = true

		this.refreshFrame()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_ENTER_GAME, this.passCampaign, this)
		UnRegisterEvent(EventDefine.PEERLESS_UPDATE, this.refreshPeerless, this)
		UnRegisterEvent(EventDefine.CAMPAIGN_MINE, this.refreshMapPos, this)
		UnRegisterEvent(EventDefine.HERO_ENTER_MAP, this.refreshMapPos, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		//UnRegisterEvent(EventDefine.COMBAT_BEGIN, this.resetTianNvTip, this)
		//UnRegisterEvent(EventDefine.COMBAT_END, this.resetTianNvTip, this)

		UnRegisterEvent(EventDefine.CAMPAIGN_PASS, this.passCampaign, this)
		UnRegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.refreshCampaignRecord, this)

		this.activityCheck = false
		this.curActivityUIClose = false
		this.mLayoutNode.visible = false;

		this.wndList["task"].hideWnd()
		this.wndList["preview"].hideWnd()
		this.wndList["fight"].showWnd()
		this.wndList["activity"].hideWnd()
		this.mElemList["activity_start_group"].visible = false

		this.closeTianNvTip()
		//this.closeXingLing()

		if (this.activityStartTime) {
			KillTimer(this.activityStartTime)
			this.activityStartTime = null
		}

		if (this.tianNvTimer) {
			KillTimer(this.tianNvTimer)
			this.tianNvTimer = null
		}

		if (this.tastTimer) {
			KillTimer(this.tastTimer)
			this.tastTimer = null
		}

		if (this.freeTimer) {
			KillTimer(this.freeTimer)
			this.freeTimer = null
		}

		if (this.campTimer) {
			KillTimer(this.campTimer)
			this.campTimer = null
		}
	}

	// resetTianNvTip() {
	// 	this.tiannvShow = true
	// 	this.closeTianNvTip()
	// 	this.showTianNvTip()
	// }

	refreshFrame() {
		this.mElemList["map_tips"].visible = GuideFuncSystem.getInstance().checkPassPrize()
		//开服冲榜
		let day = GetServerDay()
		this.mElemList["btn_activity_rank"].visible = (day <= 8)

		//房子按钮
		this.mElemList["house_btn"].visible = false
		let house = getSaveRecord(opSaveRecordKey.hourseExp)
		if (size_t(house) != 0) {
			this.mElemList["house_btn"].visible = true
		}
		//捕捉按钮
		let record = checkNull(getSaveRecord(opSaveRecordKey.capturePet), [])
		if (!record[0]) {
			this.mElemList["capture_btn"].visible = false
			this.mElemList["capture_anim"].visible = false
		} else {
			this.mElemList["capture_btn"].visible = true
			this.mElemList["capture_anim"].visible = true

			let animBox: gui.AnimBox = this.mElemList["capture_anim"]
			animBox.setAnimName("yuan")
			animBox.reset()
			animBox.play()
		}

		//排行活动按钮
		// this.mElemList["rank_activity_wnd"].visible = false
		// let openDay = GetServerDay()
		// let [flag, str] = CheckMainFrameFunction("zhucheng")
		// if (openDay <= 8 && flag == true) {
		// 	for (let _ in this.rankAcitivityConfig) {
		// 		let config = this.rankAcitivityConfig[_]
		// 		if (openDay == config.index) {
		// 			this.mElemList["rank_activity_wnd"].visible = true
		// 			this.mElemList["rank_activity_btn"].source = config.image
		// 			break
		// 		}
		// 	}
		// }

		this.refreshMapPos(null)

		this.refreshGift()

		//活动每次打开界面 进来一次吧
		if (this.activityCheck == false) {
			this.checkActivity()
			this.activityCheck = true
		}
		// let timeState = GetActivityTimeState(OrdinaryActivityIndex.DATI)
		// this.mElemList["activity_start_group"].visible = (timeState.state  == ActivityTimeState.ONGOING)

		this.showTianNvTip()

		this.refreshPeerless()

		//this.checkXingLing()
		//this.passCampaign()
	}

	checkActivity() {
		for (let i = 0; i < size_t(this.activityStartConfig); i++) {
			let config = this.activityStartConfig[i]
			let ordinaryActivityIndex = config.ordinaryActivityIndex
			let timeState = GetActivityTimeState(ordinaryActivityIndex)
			let text = config.text
			this.mElemList["answer_text"].text = text
			this.mElemList["activity_start_group"].visible = (timeState.state == ActivityTimeState.ONGOING)
			if (timeState.state == ActivityTimeState.ONGOING) {
				this.curActivityIndex = ordinaryActivityIndex

				if (this.activityStartTime) {
					KillTimer(this.activityStartTime)
					this.activityStartTime = null
				}
				this.activityStartTime = SetTimer(this.tick, this, 1000, true)
				break
			} else {
				if (this.activityStartTime) {
					KillTimer(this.activityStartTime)
					this.activityStartTime = null
				}
			}
		}
	}

	tick() {
		let group = this.mElemList["activity_start_group"]
		let ordinaryActivityIndex = this.curActivityIndex
		let timeState = GetActivityTimeState(ordinaryActivityIndex)
		group.visible = (timeState.state == ActivityTimeState.ONGOING)
		if (this.curActivityUIClose == true) {
			group.visible = false
		}
		if (timeState.state != ActivityTimeState.ONGOING) {
			if (this.activityStartTime) {
				group.visible = false
				KillTimer(this.activityStartTime)
				this.activityStartTime = null
			}
			this.curActivityUIClose = false
		}
	}

	refreshGift() {
		let record = getSaveRecord(opSaveRecordKey.campaignGifts) || {}
		let btn = <gui.Button>this.mElemList["btn_map"]
		if (size_t(record) == 0) {
			btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickPrize, this)
			btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMapWnd, this)
		} else {
			for (let campaignId in record) {
				if (record[campaignId] == 1) {
					this.campaignId = tonumber(campaignId)
					btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMapWnd, this)
					btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickPrize, this)
					return
				}
			}
		}
	}

	refreshPeerless() {
		//天下第一
		let check = GetActivity(ActivityDefine.Champion).checkIsRegister()
		this.mElemList["btn_txdy"].visible = check
	}

	//////////////////--------响应事件

	onClickPrize() {
		let wnd = WngMrg.getInstance().getWindow("CampaginPrizeFrame")
		wnd.showWithCampaignId(this.campaignId)
	}

	//背包
	// onBeiBaoClick(args) {
	// 	ExecuteMainFrameFunction("beibao")
	// }
	// onDailyClick(args) {
	// 	ExecuteMainFrameFunction("richang")
	// }

	onClickHouse() {
		WngMrg.getInstance().showWindow("HousePrizeShowFrame");
		//RpcProxy.call("C2G_HourseExp")
	}

	onClickMapWnd() {
		ExecuteMainFrameFunction("ditu")
	}

	onClickCapture(args) {
		if (HeroIsInTeam() == true) {
			let txt = ""

			let actInfo = TeamSystem.getInstance().getTeamActData()
			if (actInfo) {
				if (OrdinaryActivityName[actInfo[0]]) {
					txt = OrdinaryActivityName[actInfo[0]]
				}
			}
			return MsgSystem.addTagTips(String.format(Localize_cns("FIGHT_TXT15"), Localize_cns(txt)))
		}
		RpcProxy.call("C2G_CreateBossFight", OrdinaryActivityIndex.CapturePet, 0)
	}

	onCombatBegin() {
		let [fightType, _] = FightSystem.getInstance().getCurFightType()
		if (fightType == opFightResultType.PATROL) {
			this.showWnd()
		} else {
			this.hideWnd()
		}
	}

	onTxdyClick() {
		let wnd: ChampionFrame = WngMrg.getInstance().getWindow("ChampionFrame")
		wnd.showWithIndex(1)
	}

	onCombatEnd() {
		// let mapId = MapSystem.getInstance().getMapId()
		if (StateManager.getInstance().GetCurrentStateType() != state_type.LIVE_BASE_STATE) {
			return
		}
		this.showWnd()
	}

	onStateActive() {
		if (StateManager.getInstance().GetCurrentStateType() == state_type.LIVE_BASE_STATE) {
			this.showWnd()
		} else if (StateManager.getInstance().GetCurrentStateType() == state_type.COMBAT_BASE_STATE) {
			this.onCombatBegin()
		} else {
			this.hideWnd()
		}
	}

	refreshMapPos(args) {
		let mapId = MapSystem.getInstance().getMapId()
		AddRdContent(this.mElemList["map_name"], "", "ht_24_cc_stroke", "white")

		for (let _ in GameConfig.MapEnterList) {
			let config = GameConfig.MapEnterList[_]

			if (config.inMapId == mapId) {
				AddRdContent(this.mElemList["map_name"], config.inMapName, "ht_24_cc_stroke", "white")
			}
		}

		let campId = CampaignSystem.getInstance().getCurOpenCampaign()
		if (campId && GameConfig.CampaignConfig[campId]) { //更新关卡进度
			AddRdContent(this.mElemList["map_xy"], GameConfig.CampaignConfig[campId].indexName, "ht_20_cc_stroke", "lime")
		} else { //更新坐标
			// let target = args.actor
			// let x = target.getCellX()
			// let y = target.getCellY()

			// AddRdContent(this.mElemList["map_xy"], "[" + x + "," + y + "]", "ht_20_cc_stroke", "lime")
		}
	}

	passCampaign() {
		RpcProxy.call("C2G_ExciteData", "campaignSingle")
		RpcProxy.call("C2G_ExciteAllServerFirstCamp")
		this.sendRankRequire()
	}

	refreshActivityBtn() {
		//开服7天关闭
		if (GetServerDay() > 7) {
			return false
		}

		var recordList = CampaignSystem.getInstance().getLimitPassData() || {}
		var configList = CampaignSystem.getInstance().getSinglePassConfig()

		//通关奖励领取检测//(全部领取不再显示)
		let firstList = CampaignSystem.getInstance().getFirstPassData() || {}

		for (let i in configList) { //个人限时首通 
			let config = configList[i]
			let record = recordList[config.campaignId] || []
			let getState = record[0] || 0
			let endTime = record[1] || 0
			if (getState == 1 || getState == 2) { //可领取
				return true
			} else if (getState == 0 && endTime > GetServerTime() && CampaignSystem.getInstance().getCurOpenCampaign() < config.campaignId) { //未领取 有时间 未通过
				return true
			}

			let linQuState = firstList[config.campaignId] || 0
			if (linQuState == 1 || linQuState == 2) { //可领取
				return true
			} else if (linQuState == 0 && CampaignSystem.getInstance().getCurOpenCampaign() < config.campaignId) { //未领取 未通过
				return true
			}
		}

		return false
	}

	refreshCampaignRecord(info) {
		if (!this.refreshActivityBtn()) {
			this.mElemList["rank_activity_wnd"].visible = false
			return
		}
		this.mElemList["rank_activity_wnd"].visible = true

		let campaignId = 0 //显示的关卡
		let limitTime = 0 //显示限制时间

		var recordList = CampaignSystem.getInstance().getLimitPassData() || {}
		var configList = CampaignSystem.getInstance().getSinglePassConfig()
		for (let i in configList) {
			let config = configList[i]
			let record = recordList[config.campaignId] || []
			let getState = record[0] || 0
			let endTime = record[1] || 0
			if (getState == 0 && endTime > GetServerTime() && CampaignSystem.getInstance().getCurOpenCampaign() < config.campaignId) {
				campaignId = config.campaignId
				limitTime = endTime
				break
			}
		}

		if (campaignId > 0) {
			let campaignInfo = GameConfig.CampaignConfig[campaignId] || {}
			this.mElemList["camp_name"].text = campaignInfo.chapterName
			this.mElemList["camp_index"].text = campaignInfo.indexName
			if (limitTime > GetServerTime()) {
				this.mElemList["camp_time"].text = ""
				this.mElemList["camp_time"].visible = true

				if (this.campTimer) {
					KillTimer(this.campTimer)
					this.campTimer = null
				}

				let callback = function () {
					this.mElemList["camp_time"].text = getFormatDiffTime(limitTime - GetServerTime())
					if (limitTime <= GetServerTime()) {
						KillTimer(this.campTimer)
						this.campTimer = null
						this.mElemList["camp_time"].visible = false

						this.passCampaign()
					}
				}
				this.campTimer = SetTimer(callback, this, 1000)
			} else {
				this.mElemList["camp_time"].visible = false
			}
		} else {
			this.mElemList["camp_time"].text = ""
			//通关奖励领取检测//(全部领取不再显示)
			let firstList = CampaignSystem.getInstance().getFirstPassData() || {}
			for (let i in configList) {
				let config = configList[i]
				let record = firstList[config.campaignId] || 0
				if (record == 0 && CampaignSystem.getInstance().getCurOpenCampaign() < config.campaignId) {
					let campaignInfo = GameConfig.CampaignConfig[config.campaignId] || {}
					this.mElemList["camp_name"].text = campaignInfo.chapterName
					this.mElemList["camp_index"].text = campaignInfo.indexName
					return
				}
				else if (record == 1 || record == 2) {
					let campaignInfo = GameConfig.CampaignConfig[config.campaignId] || {}
					this.mElemList["camp_name"].text = campaignInfo.chapterName
					this.mElemList["camp_index"].text = campaignInfo.indexName
					return
				}
			}
		}
	}

	sendRankRequire() {
		RpcProxy.call("C2G_RoleRank", configRankType.RANK_CAMPAIGN, 1)
		// let message = GetMessage(opCodes.C2G_ROLE_RANK)
		// message.rankType = configRankType.RANK_CAMPAIGN
		// message.index = 1
		// SendGameMessage(message)
	}

	opActivityRank() {
		// if (ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.NEW_SERVER_STAGE_UP_RANK)) {
		// 	let wnd = WngMrg.getInstance().getWindow("OpenServerMainFrame");
		// 	wnd.showActFrame(PayActivityIndex.NEW_SERVER_STAGE_UP_RANK)
		// }

		let wnd = WngMrg.getInstance().getWindow("CampaignRecordFrame")
		wnd.showWithIndex(0)
	}

	//答题
	onActivityGoClick() {
		let ordinaryActivityIndex = this.curActivityIndex
		for (let i = 0; i < size_t(this.activityStartConfig); i++) {
			let config = this.activityStartConfig[i]
			if (config.ordinaryActivityIndex == ordinaryActivityIndex) {
				let func: Function = config.call
				if (func) {
					func.call(this)
				}
				break
			}
		}
	}

	// checkXingLing() {
	// 	let endTime = getSaveRecord(opSaveRecordKey.xingLingTiYan) || 0
	// 	let visible = false
	// 	if (endTime >= GetServerTime()) {
	// 		visible = true

	// 	}
	// 	if (FightSystem.getInstance().isFight()) {
	// 		visible = false
	// 	}
	// 	this.mElemList["group_xingling"].visible = visible
	// 	if (visible == false) return
	// 	let check = this.mElemList["guanggao_group"].visible || this.mElemList["guanggao_group2"].visible
	// 	let top = 150
	// 	if (check) {
	// 		top = 316
	// 	}
	// 	this.mElemList["group_xingling"].top = top

	// 	if (this.xl_timer == null) {
	// 		let callback = function () {
	// 			let diffTime = endTime - GetServerTime()
	// 			let timeObj = simple_transform_time(diffTime)
	// 			let mins = String.format("%02d", timeObj.mins)
	// 			let secs = String.format("%02d", timeObj.secs)
	// 			DrawNumberStringImage(this.mElemList["xl_bImage"], "daZhanLi02_", mins + "m" + secs, 0, 0, 0)
	// 		}
	// 		this.xl_timer = SetTimer(callback, this, 1000)
	// 	}


	// }

	showTianNvTip() {
		let level = GetHeroProperty("level")
		let vip = VipSystem.getInstance().GetVipLevel()

		let endTime = RoleSystem.getInstance().getTastTime()
		if (endTime > 0 && endTime <= GetServerTime()) {
			let fightSystem: FightSystem = FightSystem.getInstance()
			if (fightSystem.isFight()) {
				this.mElemList["tast_end_group"].visible = false
			} else {
				if (vip < 7 && level < 100) {
					this.mElemList["tast_end_group"].visible = true
				}
			}
		}

		let endTime1 = getSaveRecord(opSaveRecordKey.firstRechareTiannv) || 0
		if (endTime1 > GetServerTime()) {

			RoleSystem.getInstance().setTastTime(endTime1)
			// if (!this.tiannvShow) {
			// 	return
			// }

			//战斗中不显示
			let fightSystem: FightSystem = FightSystem.getInstance()
			if (fightSystem.isFight()) {
				this.mElemList["guanggao_group"].visible = false
				this.tiannvShow = true
				return
			}

			this.mElemList["tn_close_btn"].visible = false
			this.mElemList["guanggao_group"].visible = true
			this.tiannvShow = false

			if (this.tastTimer) {
				return
			}

			let callback = function () {
				let diffTime = endTime1 - GetServerTime()
				if (diffTime >= 0) {
					let timeObj = simple_transform_time(diffTime)
					let mins = String.format("%02d", timeObj.mins)
					let secs = String.format("%02d", timeObj.secs)
					DrawNumberStringImage(this.mElemList["tast_batch"], "daZhanLi02_", mins + "m" + secs, 0, 0, 0)
					this.mElemList["tast_wnd"].visible = true
				} else {
					RpcProxy.call("C2G_RemoveLimitTianNv")

					let endTime2 = getSaveRecord(opSaveRecordKey.firstRechareTiannv) || 0
					if (endTime2 <= GetServerTime()) {
						if (this.tastTimer) {
							KillTimer(this.tastTimer)
							this.tastTimer = null
						}
						this.mElemList["guanggao_group"].visible = false
					}
				}
			}
			this.tastTimer = SetTimer(callback, this, 1000, true)
		} else {
			if (vip >= 4 && vip < 7 && level < 100 && this.tiannvShow == true) {
				this.tiannvShow = false
				this.mElemList["tn_close_btn"].visible = true
				this.mElemList["guanggao_group"].visible = true

				let _this = this
				let tick = function (delay) {
					if (_this.tianNvTimer) {
						KillTimer(_this.tianNvTimer)
						_this.tianNvTimer = null
					}
					_this.closeTianNvTip()
				}
				this.tianNvTimer = SetTimer(tick, this, 10 * 1000)
			}
		}

		//免费体验
		if (!this.mElemList["guanggao_group"].visible) {
			this.startFreeTast()
		} else {
			if (this.freeTimer) {
				KillTimer(this.freeTimer)
				this.freeTimer = null
			}
			this.mElemList["guanggao_group2"].visible = false
		}
	}

	startFreeTast() {
		let endTime = getSaveRecord(opSaveRecordKey.FreeTianNv) || 0

		if (endTime <= GetServerTime()) {
			if (this.mElemList["guanggao_group2"].visible) {
				this.mElemList["guanggao_group2"].visible = false
			}
			return
		}

		//战斗中不显示
		let fightSystem: FightSystem = FightSystem.getInstance()
		if (fightSystem.isFight()) {
			this.mElemList["guanggao_group2"].visible = false
			return
		}

		this.mElemList["guanggao_group2"].visible = true

		if (this.freeTimer) {
			return
		}

		let callback = function () {
			let diffTime = endTime - GetServerTime()
			if (diffTime >= 0) {
				let timeObj = simple_transform_time(diffTime)
				let mins = String.format("%02d", timeObj.mins)
				let secs = String.format("%02d", timeObj.secs)
				DrawNumberStringImage(this.mElemList["tast_batch2"], "daZhanLi02_", mins + "m" + secs, 0, 0, 0)
			} else {
				let newEndTime = getSaveRecord(opSaveRecordKey.firstRechareTiannv) || 0
				if (newEndTime <= GetServerTime()) {
					if (this.freeTimer) {
						KillTimer(this.freeTimer)
						this.freeTimer = null
					}
					this.mElemList["guanggao_group2"].visible = false
				}
			}
		}
		this.freeTimer = SetTimer(callback, this, 1000, true)
	}

	onActivityCloseClick() {
		this.mElemList["activity_start_group"].visible = false
		this.curActivityUIClose = true
	}

	closeTianNvTip() {
		if (this && this.mElemList && this.mElemList["guanggao_group"]) {
			this.mElemList["guanggao_group"].visible = false
		}
	}

	closeTianNvEnd() {
		this.mElemList["tast_end_group"].visible = false
		RoleSystem.getInstance().clearTastTime()
	}

	// closeXingLing() {
	// 	this.mElemList['group_xingling'].visible = false
	// 	if (this.xl_timer != null) {
	// 		KillTimer(this.xl_timer)
	// 		this.xl_timer = null
	// 	}
	// }

	onClickRecharge() {
		ExecuteMainFrameFunction("chongzhi")
	}

	onClickGold(args) {
		ExecuteMainFrameFunction("chongzhi")
	}

	//前往答题
	onAnswerClicked() {
		ExecuteMainFrameFunction("dati")
	}

	//跨服争霸
	onEnterGlobalMine() {
		ExecuteMainFrameFunction("wakuang")
	}

	//武林大会
	onEnterWuLin() {
		ExecuteMainFrameFunction("wulin")
	}

	//天宫boss
	onEnterTiangong() {
		ExecuteMainFrameFunction("judian")
	}

	//星灵
	onClickXingLing() {
		let wnd: XingLingFrame = WngMrg.getInstance().getWindow("XingLingFrame")
		wnd.showWnd()
	}

	onClickActivityRank() {
		WngMrg.getInstance().showWindow("ActivityRankFrame");
	}
}