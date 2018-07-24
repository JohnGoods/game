class FightFrame extends BaseWnd {
	mElemList: any;
	wndList: any;
	timerList: any;
	contrlDataTable: any;
	firstFight: any
	mLayoutNodeTop: gui.LayoutNode;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/FightLayout.exml", "resource/layouts/fight/FightPrizePreviewLayout.exml", "resource/layouts/fight/FightGlobalBossLayout.exml"]
		this.wndList = {}
		this.timerList = {}
		this.contrlDataTable = {}
		this.firstFight = null								//是否第一次打（胜）
	}

	public onLoad(): void {
		//this.mElemList = this.mParentWnd.mElemList
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.initSkinElemList();
		this.setFullScreenRaw(true)
		this.mLayoutNode.setLayer(gui.GuiLayer.Bottom)

		var elemInfo = [
			{ ["name"]: "fight_forceend", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickForceend },
		]
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)


		this.mLayoutNodeTop = this.createLayoutNode(this.classname + "_Top")

		let mElemInfo2: any = [
			{ ["index_type"]: gui.AnimBox, ["name"]: "fight_start", ["title"]: null, ["image"]: null, ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["top"]: 280, ["event_name"]: gui.AnimBox.AnimEndEvent, ["fun_index"]: this.onAnimEnd, ["messageFlag"]: true },
		]
		UiUtil.createElem(mElemInfo2, this.mLayoutNodeTop, this.mElemList, this)
		this.mLayoutNodeTop.percentWidth = 100;
		this.mLayoutNodeTop.percentHeight = 100;
		this.mLayoutNodeTop.setLayer(gui.GuiLayer.Top)
		this.mLayoutNodeTop.touchEnabled = false;

		// this.mElemList["task_wnd"].visible = false
		// this.mElemList["auto_wnd"].visible = false
		// this.mElemList["preview_wnd"].visible = false
		//this.mElemList["msg_wnd"].visible = false

		let commonWnd = FightPrizePrevieWindow.newObj(this.mLayoutNode, this, "comm")
		this.wndList = {
			// [opFightResultType.CAMPAGIN]: FightCampaignWindow.newObj(this.mLayoutNode, this),
			[opFightResultType.DRAGON]: FightCopyDragonWindow.newObj(this.mLayoutNode, this),
			[opFightResultType.CAPTURE]: FightCapttureWindow.newObj(this.mLayoutNode, this),

			[opFightResultType.CAMPAGINBOSS]: commonWnd,			//关卡BOSS
			//[opFightResultType.FACTIONMAP]: commonWnd,				//帮派地图
			[opFightResultType.LIFEANDDEATH]: commonWnd,			//生死劫
			[opFightResultType.FACTION_BOSS]: commonWnd,			//帮会妖怪
			[opFightResultType.MATERIAL]: commonWnd, 				//材料副本
			[opFightResultType.THUNDER_TEMPLE]: commonWnd,			//小雷音寺
			[opFightResultType.HEAVEN_TRIAL]: commonWnd,			//天庭试炼
			[opFightResultType.GLOBAL_TEAM]: commonWnd,				//跨服组队
			[opFightResultType.PERSONAL_BOSS]: commonWnd,			//个人boss
			[opFightResultType.WORLD_BOSS]: FightGlobalBossWindow.newObj(this.mLayoutNode, this, "boss"),				//全民boss
			[opFightResultType.WILD_BOSS]: commonWnd,				//野外boss
			[opFightResultType.WILD_BOSS_PVP]: commonWnd,				//野外bossPVP
			[opFightResultType.FACT_INST_ZONES]: commonWnd,			//帮会副本
			[opFightResultType.ZHONG_KUI_DEMON]: commonWnd,			//钟馗
			[opFightResultType.ESCORT]: commonWnd,					//西游护送
			[opFightResultType.JJC]: FightPrizePrevieWindow.newObj(this.mLayoutNode, this, "comm", false),						//竞技场
			[opFightResultType.NERW_SERVER_ZONES]: commonWnd,							//新服副本
			[opFightResultType.GLOBAL_MINE]: FightCampaignWindow.newObj(this.mLayoutNode, this),
			[opFightResultType.WU_LIN_MENG_ZHU]: commonWnd,					//武林盟主
			[opFightResultType.WORLD_ONE_PVP]: commonWnd,            //天下第一
			[opFightResultType.STRONGHOLD]: commonWnd,            //据点
		}

		RegisterEvent(EventDefine.COMBAT_BEGIN, this.onCombatBegin, this)
		RegisterEvent(EventDefine.COMBAT_END, this.onCombatEnd, this)
	}

	public onUnLoad(): void {
		UnRegisterEvent(EventDefine.COMBAT_BEGIN, this.onCombatBegin, this)
		UnRegisterEvent(EventDefine.COMBAT_END, this.onCombatEnd, this)
	}

	public onShow(): void {
		RegisterEvent(EventDefine.COMBAT_FIGHT_ROUND_UPDATE, this.onFightRoundUpdate, this)
		// this.mElemList["combat_group"].visible = true
		// this.mElemList["chat_wnd"].visible = true

		this.mLayoutNode.visible = true
		this.mLayoutNodeTop.visible = true
		this.mElemList["fight_start"].visible = false
		this.moveToBack()

		if (GAME_MODE == GAME_TEST) {
			this.wndList[opFightResultType.WORLD_BOSS].showWnd()
			return
		}

		this.refresh()

		this.checkForceEnd()
		// this.showStarAnim()
		// let tick = function(delay) {
		// 	this.mElemList["fight_forceend"].visible = true
		// }
		// this.timerList["forceend"] = SetTimer(tick, this, 2000, false)
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.COMBAT_FIGHT_ROUND_UPDATE, this.onFightRoundUpdate, this)

		this.mLayoutNode.visible = false
		this.mLayoutNodeTop.visible = false
		// this.mElemList["combat_group"].visible = false
		// this.mElemList["chat_wnd"].visible = false

		for (let _ in this.timerList) {
			let timer = this.timerList[_]
			KillTimer(timer)
		}
		this.timerList = {}

		this.firstFight = null

		for (let _ in this.wndList) {
			let wnd = this.wndList[_]
			if (wnd.isVisible()) {
				wnd.hideWnd()
			}
		}
	}

	public onCombatBegin(): void {
		this.showWnd()
	}

	public onCombatEnd(): void {
		this.hideWnd()
	}


	refresh() {
		this.contrlDataTable = {}
		this.onFightRoundUpdate(null)

		if (FightSystem.getInstance().isFight() == true) {
			let [fightType, _] = FightSystem.getInstance().getCurFightType()
			let flag = -1

			for (let _ in this.wndList) {
				let fType = tonumber(_)
				let v = this.wndList[_]

				if (fType == fightType) {
					flag = fType						//有战斗中的特殊界面显示
				} else {
					v.hideWnd()
				}
			}

			if (flag != -1) {
				let wnd = this.wndList[flag]

				if (FightSystem.getInstance().isFightVideo() == false) {
					wnd.showWnd()
				} else {
					wnd.hideWnd()
				}
			}
			// if (flag < 0) {
			// 	this.refreshNormal(true)
			// } else {
			// 	this.refreshNormal(false)

			// 	let wnd = this.wndList[flag]
			// 	wnd.showWnd()
			// }
		} else {
			//this.refreshNormal(true)

		}
	}

	onFightRoundUpdate(args) {
		let [curRound, maxRound] = FightSystem.getInstance().getCurShowFightRound()

		//捕捉只有一回合
		let [fightType, _] = FightSystem.getInstance().getCurFightType()
		if (fightType == opFightResultType.CAPTURE) {
			curRound = 1
			maxRound = 1
		} else if (fightType == opFightResultType.DRAGON) { //龙王宝藏
			maxRound = 10
		} else if (fightType == opFightResultType.ESCORT) { //西游护送
			maxRound = 30
		} else if (fightType == opFightResultType.JJC) { //竞技场
			maxRound = 30
		} else if (fightType == opFightResultType.WILD_BOSS_PVP) {//野外BOSS PVP
			maxRound = 30
		} else if (fightType == opFightResultType.GLOBAL_MINE) {//跨服争霸
			maxRound = 30
		} else if (fightType == opFightResultType.WU_LIN_MENG_ZHU) {//武林盟主
			maxRound = 30
		} else if (fightType == opFightResultType.WORLD_ONE_PVP) {//天下第一
			maxRound = 30
		} else if (fightType == opFightResultType.STRONGHOLD) {//据点
			maxRound = 30
		} else { //其他
			maxRound = 5
		}

		let batchImage = this.mElemList["fight_round_bam"]
		DrawNumberStringImage(batchImage, "zhanLi_", curRound + "f" + maxRound)
		// batchImage.beginDraw();
		// batchImage.drawNumberString("zhanLi_", curRound + "z" + maxRound);
		// batchImage.endDraw();
		this.checkForceEnd()

	}

	checkForceEnd() {
		//先简单检查跳过规则，具体看禅道
		let [curRound, maxRound] = FightSystem.getInstance().getCurShowFightRound()
		let [fightType, index] = FightSystem.getInstance().getCurFightType()

		delete this.contrlDataTable["fight_forceend"]

		let check = false
		let vipLevel = GetHeroProperty("VIP_level") || 0
		let level = GetHeroProperty("level") || 0
		if (fightType == opFightResultType.WORLD_BOSS) {//全民boss
			check = true
			if ((vipLevel < 5) && (level < 70)) {
				this.contrlDataTable["fight_forceend"] = Localize_cns("COPY_TXT37")
			}
		} else if (fightType == opFightResultType.WILD_BOSS) { //野外boss
			check = curRound >= 3
		} else if (fightType == opFightResultType.WILD_BOSS_PVP) {//野外BOSS PVP
			check = curRound >= 4
		} else if (fightType == opFightResultType.JJC) { //竞技场
			check = curRound >= 4
		} else if (fightType == opFightResultType.ESCORT) { //西游护送
			check = curRound >= 4
		} else if (fightType == opFightResultType.DRAGON) { //龙王宝藏
			let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.DragonBoss)
			if (this.firstFight == null) {
				this.firstFight = true								//是否第一次打（胜）
				if (!actInfo || !actInfo.npcList) {

				} else if (actInfo.npcList[index]) {
					if ((actInfo.npcList[index] & opDragonBossIndexConfig.oneStar) == opDragonBossIndexConfig.oneStar
						|| (actInfo.npcList[index] & opDragonBossIndexConfig.twoStar) == opDragonBossIndexConfig.twoStar
						|| (actInfo.npcList[index] & opDragonBossIndexConfig.threeStar) == opDragonBossIndexConfig.threeStar) {

						this.firstFight = false
					}
				}
			}
			//首次通关
			if (this.firstFight == true) {
				check = curRound >= 4
			} else {
				check = true;
				//第二次“跳过”按钮开始就出现，前3回合判断vip或者等级，第四回合直接跳过
				if (curRound < 4 && (vipLevel < 5 && level < 70)) {
					this.contrlDataTable["fight_forceend"] = Localize_cns("COPY_TXT37")
				}
			}
		} else if (fightType == opFightResultType.GLOBAL_MINE) { //跨服争霸
			check = curRound >= 3
		} else if (fightType == opFightResultType.WU_LIN_MENG_ZHU) { //武林盟主
			check = curRound >= 4
		} else if (fightType == opFightResultType.STRONGHOLD) { //据点
			check = curRound >= 4
		}
		if (FightSystem.getInstance().isFightVideo() == true) {						//录像可以直接跳转
			check = true
		}

		// check = check && (GetHeroProperty("level") >= 70)				//70级以上才可以显示
		this.mElemList["fight_forceend"].visible = check
	}

	showStarAnim() {
		let animBox: gui.AnimBox = this.mElemList["fight_start"]

		let animName = "BOSS"
		let info = IGlobal.animSet.getAnimInfo(animName)
		if (info == null) {
			TLog.Error("FightFrame.showStarAnim %s", animName)
			return
		}

		animBox.visible = true
		animBox.setAnimName(animName)//("guide_arrow_left")//(param[""])//
		// animBox.setAnimInterval(this.animSpeed)
		animBox.reset()
		animBox.play()
		animBox.width = info.w
		animBox.height = info.h
		animBox.setLoop(false)

		//表演完开始特效再开始表演
		FightSystem.getInstance().beginSuspend()
	}

	//////////////////////////////////////////////////////
	onClickForceend(args) {
		let name = args.target.name
		if (this.contrlDataTable[name] == null) {
			FightSystem.getInstance().forceEndFight()
			return
		} else {
			let str = this.contrlDataTable[name]
			MsgSystem.addTagTips(str)
			return
		}
	}

	onAnimEnd(args) {
		this.mElemList["fight_start"].pause()
		this.mElemList["fight_start"].visible = false

		FightSystem.getInstance().endSuspend()
	}
	// refreshNormal(visible: boolean=true) {
	// 	if (visible == true) {
	// 		this.mElemList["map_wnd"].visible = true
	// 		//this.mElemList["preview_wnd"].visible = true
	// 		//this.mElemList["wing_rank_btn"].visible = true
	// 		this.mElemList["func_wnd"].visible = true
	// 		// this.mElemList["task_wnd"].visible = true
	// 		// this.mElemList["auto_wnd"].visible = true
	// 		// this.mElemList["msg_wnd"].visible = true
	// 	} else {
	// 		this.mElemList["map_wnd"].visible = false
	// 		//this.mElemList["preview_wnd"].visible = false
	// 		//this.mElemList["wing_rank_btn"].visible = false
	// 		this.mElemList["func_wnd"].visible = false
	// 		// this.mElemList["task_wnd"].visible = false
	// 		// this.mElemList["auto_wnd"].visible = false
	// 		// this.mElemList["msg_wnd"].visible = false
	// 	}
	// }


}
