class FightLostFrame extends FightEndBaseFrame {
	controlDataTable: any
	scroll: UIScrollList;
	prizelist: any;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/fight/FightLostLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.initSkinElemList();
		this.setFullScreen(true)
		this.setAlignCenter(true, true)

		var elemInfo: any[] = [
			{ ["name"]: "exit_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onReturn },
			{ ["name"]: "shouchong_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onFirstPayClick },
			{ ["name"]: "meiri_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onEveryDayFirstPayClick },
			{ ["name"]: "chongwu_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPetClick },
			{ ["name"]: "zhuangbei_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onEquipClick },
			{ ["name"]: "skill_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSkillClick },
			{ ["name"]: "gain_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onReturn },
		];

		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let group = <eui.Group>this.mElemList["scroll_group"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)

		this.mElemList["shouchong_btn"].visible = false
		this.mElemList["meiri_btn"].visible = false
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		// RegisterEvent(EventDefine.TEAM_MEMBER_NOTICE, this.onTeamMemNotice, this)

		super.onShow()
		this.mLayoutNode.visible = true;
		GameSound.getInstance().playEffect(SystemSound.effect_fail)

		this.refreshFrame()
	}

	public onHide(): void {
		super.onHide()

		// UnRegisterEvent(EventDefine.TEAM_MEMBER_NOTICE, this.onTeamMemNotice, this)
		this.mLayoutNode.visible = false;
	}

	refreshFrame() {
		let firstPayIsOpen = ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.FIRST_PAY)
		this.mElemList["shouchong_btn"].visible = (firstPayIsOpen == true)
		this.mLayoutNode["btn_group"].x = 80
		if (!firstPayIsOpen) {
			//{oldValue:0, reachList:[0,1,2,0]}--[1]=0没达成 [1]=1,可领取 [1]=2领取了
			let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.EVERY_MIXACCU_RECHARGE)
			let isGet = false
			if (playerInfo && playerInfo[1]) {
				let info = playerInfo[1]
				if (info[100] == 1 && info[4800] == 1) {
					isGet = true //每日首冲都领取了
				}
			}
			this.mElemList["meiri_btn"].visible = !isGet
			if (isGet) {
				this.mLayoutNode["btn_group"].x = 20
			}
		}


		//竞技场特殊处理
		if (this.param && this.param.fightType == opFightResultType.JJC) {

			this.mElemList["label_title"].visible = false
			this.mElemList["btn_group"].visible = false
			this.mElemList["exit_btn"].visible = false

			this.mElemList["champion_group"].visible = true

			this.prizelist = []
			if (this.param && this.param.commonList) {
				//金币
				if (this.param.commonList.funds && this.param.commonList.funds > 0) {
					table_insert(this.prizelist, [SpecailItemId.FUNDS, this.param.commonList.funds])
				}
				//绑定元宝
				if (this.param.commonList.bindCurrency && this.param.commonList.bindCurrency > 0) {
					table_insert(this.prizelist, [SpecailItemId.B_GOLD, this.param.commonList.bindCurrency])
				}
				//元宝
				if (this.param.commonList.currency && this.param.commonList.currency > 0) {
					table_insert(this.prizelist, [SpecailItemId.GOLD, this.param.commonList.currency])
				}
				//经验
				if (this.param.commonList.plrExp && this.param.commonList.plrExp > 0) {
					table_insert(this.prizelist, [SpecailItemId.EXP, this.param.commonList.plrExp])
				}
				//帮贡
				if (this.param.commonList.facContribute && this.param.commonList.facContribute > 0) {
					table_insert(this.prizelist, [SpecailItemId.BANGGONG, this.param.commonList.facContribute])
				}

				for (let _ in this.param.commonList.itemList) {
					let v = this.param.commonList.itemList[_]
					table_insert(this.prizelist, v)
				}
			}
			let list1 = []
			var t = []
			this.prizelist.forEach(v => {
				table_insert(t, v)
				if (size_t(t) == 4) {
					table_insert(list1, t)
					t = []
				}
			})
			if (t.length > 0) {
				table_insert(list1, t)
			}

			let group = <eui.Group>this.mElemList["scroll_group"]
			let scroll = this.scroll
			scroll.clearItemList();
			this.controlDataTable = {}
			for (let k = 0; k < list1.length; k++) {
				let v = list1[k]
				let [window, flag] = scroll.getItemWindow(k, group.width - 3, 100, 3, 5, 0)

				if (flag == true) {
					this.initItemWindow(window)
				}
				this.refreshItemWindow(window, v)
			}

			//排名
			if (this.param && this.param.commonList) {
				this.mElemList["history_rank"].text = this.param.commonList.bestRank || 0
				let curRank = this.param.commonList.plrRank || 0
				let upRank = this.param.commonList.rankUp || 0
				this.mElemList["cur_rank_rd"].setAlignFlag(gui.Flag.V_CENTER)
				AddRdContent(this.mElemList["cur_rank_rd"], curRank + "#JIANTOU_UP#lime" + upRank, "ht_24_cc_stroke", "white")
				let money = this.param.commonList.bindCurrency || 0
				this.mElemList["prize_rd"].setAlignFlag(gui.Flag.V_CENTER)
				AddRdContent(this.mElemList["prize_rd"], "#BIND_YUANBAO" + money, "ht_24_cc_stroke", "white")
			}
		}
	}

	initItemWindow(window) {
		let name = window.name

		let mElemInfo: any = []

		for (let i = 0; i < 4; i++) {
			table_insert(mElemInfo, { ["index_type"]: eui.Label, ["name"]: name + "_name_" + i, ["title"]: "", ["font"]: "ht_22_cc_stroke", ["color"]: gui.Color.white, ["x"]: 30 + 110 * i, ["y"]: 87, ["w"]: 100, ["h"]: 30, ["messageFlag"]: true })
			this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox" + i, 40 + 110 * i, 5, window)
		}
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
	}

	refreshItemWindow(window, config) {
		let name = window.name

		for (let i = 0; i < 4; i++) {
			if (config[i]) {
				let [entryId, count, quality] = config[i]
				this.mElemList[name + "itemBox" + i].setVisible(true)
				this.mElemList[name + "itemBox" + i].updateByEntry(entryId, count, quality)

				this.mElemList[name + "_name_" + i].text = ItemSystem.getInstance().getItemName(entryId)
				this.mElemList[name + "_name_" + i].textColor = GetQualityColorGui(quality || ItemSystem.getInstance().getItemTemplateInfoValue(entryId, "quality"))
				this.mElemList[name + "_name_" + i].visible = true
			} else {
				this.mElemList[name + "itemBox" + i].setVisible(false)
				this.mElemList[name + "_name_" + i].visible = false
			}
		}
	}


	////////////////////////////////////////////////////////////公共接口///////////////////////////////////////////
	getCurFightType() {
		if (this.param) {
			return this.param.fightType
		}
		else {
			return null
		}
	}

	addReCallHandler(obj, callBack, param) {
		//this.specHandler = { obj, callBack, param }
	}
	////////////////////////////////////////////////////////////-响应函数//////////////////////////////////////////////////////////////////////
	autoHideTick(leftTime) {
		this.mElemList["exit_btn"].text = Localize_cns("FIGHT_TXT12") + "(" + Math.floor(leftTime / 1000) + ")"
	}

	onReturn(args) {
		// if (HeroIsInTeam() == true) {
		// 	if (HeroIsCaptain() == false) {
		// 		return MsgSystem.addTagTips(Localize_cns("TEAM_TXT34"))
		// 	} else {
		// 		CaptainSendNotice(0, TeamNoticeTag.HideFightResult)
		// 	}
		// }

		//let fightType = this.param.fightType
		this.endShowCombatEnd()
		// if (fightType == opFightType.FIGHT_TYPE_DAILY) {
		//     // let wnd = WngMrg.getInstance().getWindow("SkyTowerFrame")
		//     // if (wnd.isVisible()) {
		//     //     wnd.showAllMenu()
		//     // }
		// }
	}

	starShowCombatEnd() {

		return this.showWnd()
	}


	// onTeamMemNotice(args) {
	// 	if(TeamIsFollowState() == false ){
	// 		return
	// 	}

	// 	let fightType = this.param.fightType
	// 	//if(args.key != OrdinaryActivityIndex.NULL ){
	// 	if(args.value ==  TeamNoticeTag.HideFightResult ){							//不填也可以，先作标识
	// 		this.endShowCombatEnd()
	//         let wnd = WngMrg.getInstance().getWindow("SkyTowerFrame")
	//         if (wnd.isVisible()) {
	//             wnd.showAllMenu()
	//         }	
	// 		return
	// 	}
	// 	//}
	// }

	onClickFightRecord(args) {
		WngMrg.getInstance().showWindow("FightRecordFrame")
	}

	onFirstPayClick() {
		this.hideWnd()
		//判断有没有充值>1000
		//>就不显示这个按钮
		let wnd = WngMrg.getInstance().getWindow("TouZiFrame")
		wnd.showWithIndex(PayActivityIndex.FIRST_PAY)
	}

	onEveryDayFirstPayClick() {
		WngMrg.getInstance().showWindow("DailyPayFrame")
	}

	onPetClick() {
		this.hideWnd()
		ExecuteMainFrameFunction("chongwu")
	}

	onEquipClick() {
		this.hideWnd()
		ExecuteMainFrameFunction("zhuangbeishangdian")
	}
	onSkillClick() {
		this.hideWnd()
		let info = RoleSystem.getInstance().getRecvList()
		if (size_t(info) == 0) return;
		let levelList = info["skilllevellist"]
		let wnd = WngMrg.getInstance().getWindow("RoleSkillsSettingFrame");
		wnd.onShowWnd(levelList);
	}



}