class MainFrame extends BaseWnd {
	//mChatViewr: UIChatViewer;
	new_chat_wnd:UIMainChatViewer;
	fast_chat_wnd:UIMainFastChat;
	//mCombatWnd: BaseCtrlWnd;
	// isFirstPlay:boolean
	tab_btn_list: any;
	
	npcList


	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/MainLayout.exml"]
		// this.isFirstPlay = false
		this.npcList = []
		
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreenRaw(true);

		this.initSkinElemList();

		this.mLayoutNode.touchEnabled = false;
		//this.mLayoutNode.setLayer(gui.GuiLayer.Bottom)

		var elemInfo = [

			{ ["name"]: "btn_playerDetails", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPlayerDetailsClick },

			//VIP和排行
			{ ["name"]: "vip_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickVip },
			{ ["name"]: "rank_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRank },

			{ ["name"]: "copper_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCopper },
			{ ["name"]: "silver_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSilver },
			{ ["name"]: "gold_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGold },
			{ ["name"]: "hide_fast_chat_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFastChatClose },
			
			{ ["name"]: "role_exp", ["messageFlag"]: true },
			{ ["name"]: "role_exp_txt", ["messageFlag"]: true },

		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		//this.mChatViewr = UIChatViewer.newObj(this, this.mLayoutNode, "chatviewer", 0, 0, this.mElemList["chat_wnd"]);
		//this.mCombatWnd = MainCombatWindow.newObj(this.mLayoutNode, this)

		this.new_chat_wnd = UIMainChatViewer.newObj(this, this.mLayoutNode, "new_chat_wnd", 0, 0, this.mElemList["new_chat_wnd"]);
		this.fast_chat_wnd = UIMainFastChat.newObj(this, this.mLayoutNode, "fast_chat_wnd", 0, 0, this.mElemList["fast_chat_wnd"]);
		


		this.mElemList["name_rd"].setAlignFlag(gui.Flag.LEFT_CENTER)

		let radioGroup = new eui.RadioButtonGroup()
		for (let i = 0; i < 6; i++) {
			let elem = <eui.RadioButton>this.mElemList["tab" + i]
			elem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTab, this)
			elem.group = radioGroup
			elem.value = i
		}

		//注册事件
		let tab_btn_list: any = {
			tab0: { keyfunc: null, callback: null },
			tab1: { keyfunc: "zhucheng", funcname: "MainCityFrame" },
			tab2: { keyfunc: "jiaose", funcname: "RoleFrame" },
			tab3: { keyfunc: "duanzao", funcname: "ForgeFrame" },
			tab4: { keyfunc: "xianlv", checkname: this.onCheckXianLv, callback: this.onXianLvClick },
			tab5: { keyfunc: "chongwu", funcname: "PetFrame" },
		}
		this.tab_btn_list = tab_btn_list

		//选中第一个
		this.mElemList["tab0"].selected = true
		this.fast_chat_wnd.setVisible(false)

		//this.refreshCombat()
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		RegisterEvent(EventDefine.DAILYACTIVITY_INFO, this.checkNpc, this)
		//RegisterEvent(EventDefine.COMBAT_BEGIN, this.onCombatBegin, this)

		//this.mChatViewr.setVisible(false)
		this.mElemList["new_chat_wnd_group"].visible = true
		// this.mElemList["new_chat_wnd_test"].show()
		this.new_chat_wnd.setVisible(true)
		this.mLayoutNode.visible = true;
		this.moveToBack()

		if (GAME_MODE == GAME_NORMAL) {
			this.refreshFrame();
		}
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.DAILYACTIVITY_INFO, this.checkNpc, this)
		//UnRegisterEvent(EventDefine.COMBAT_BEGIN, this.onCombatBegin, this)

		//this.mChatViewr.setVisible(false)
		this.new_chat_wnd.setVisible(false)
		this.mLayoutNode.visible = false;
		this.mElemList["new_chat_wnd_group"].visible = false
	}

	refreshFrame() {
		let heroInfo = GetHeroPropertyInfo()
		if (heroInfo == null) return;
		//let loginNum = getSaveRecord(opSaveRecordKey.login)
		let canGainGifts = getSaveRecord(opSaveRecordKey.canGainNewRoleGifts)

		//if(heroInfo.level <= 1 && loginNum == 1 && this.isFirstPlay == false){
		if (canGainGifts == 1) {
			// if(true){
			WngMrg.getInstance().showWindow("FirstLoginFrame");
		}

		//更新coin
		this.mElemList["copper_txt"].text = MakeLongNumberShort(heroInfo.funds)
		this.mElemList["silver_txt"].text = MakeLongNumberShort(heroInfo.bindGold)
		this.mElemList["gold_txt"].text = MakeLongNumberShort(heroInfo.gold)

		//更新头像window
		this.mElemList["btn_playerDetails"].source = GetProfessionIcon(heroInfo.vocation, heroInfo.sexId)
		let level = heroInfo.level
		let levelStr = "Lv." + level
		// if (level >= playerOptions.maxLevel || level == 0) {
		// 	levelStr = Localize_cns("ROLE_TXT31")
		// }
		AddRdContent(this.mElemList["name_rd"], levelStr + "#space_10" + heroInfo.name, "ht_20_cc", "ublack")

		let force = GetHeroProperty("force") || 0
		this.mElemList["force_batch"].beginDraw();
		this.mElemList["force_batch"].drawNumberString("zhanLi_", force, 0, 0, -3)
		this.mElemList["force_batch"].endDraw();

		let vipBatch = <gui.BatchImage>this.mElemList["vip_batch"]
		let offx = (1 - heroInfo.VIP_level.toString().length) * 8
		vipBatch.beginDraw();
		vipBatch.drawNumberString("vip_", heroInfo.VIP_level, offx, 0)
		vipBatch.endDraw();

		//更新经验
		let limitExp = RoleSystem.getInstance().getLevelupExp()
		let curExp = heroInfo.exp
		let proText = heroInfo.exp + "/" + limitExp
		// if (level >= playerOptions.maxLevel || level == 0) {
		// 	curExp = limitExp = 1
		// 	proText = Localize_cns("ROLE_TXT31")
		// }
		UiUtil.updateProgress(this.mElemList["role_exp"], curExp, limitExp, null, 1000)

		this.mElemList["role_exp_txt"].text = proText

		this.checkNpc()
		this.new_chat_wnd.refreshFastChat()
	}

	// refreshCombat() {
	// 	let combatWnd = WngMrg.getInstance().getWindow("FightFrame")
	// 	if (!combatWnd.isVisible()) {
	// 		combatWnd.showWnd()
	// 		//this.mCityWnd.hideWnd()
	// 		WngMrg.getInstance().hideWindow("MainCityFrame")
	// 	}
	// }

	// refreshCity() {
	// 	let cityWnd = WngMrg.getInstance().getWindow("MainCityFrame")
	// 	let combatWnd = WngMrg.getInstance().getWindow("FightFrame")

	// 	if (cityWnd.isVisible()) {
	// 		this.refreshCombat()
	// 	} else {
	// 		combatWnd.hideWnd()
	// 		cityWnd.showWnd()
	// 	}
	// }

	hideRegistWnd(name) {
		// if (MainAutoHideUI[name] && WngMrg.getInstance().isVisible(name)) {
		// 	return true
		// }
		if (CheckMainAutoHideUI[name]) return false

		let isVisible = WngMrg.getInstance().isVisible(name)


		for (let registname in MainAutoHideUI) {
			WngMrg.getInstance().hideWindow(registname)
		}
		return isVisible
	}

	// onCombatBegin(args) {
	// 	if (args.fightType != opFightResultType.PATROL) {
	// 		this.refreshCombat()
	// 	}
	// }

	/////////////////////////响应事件//////////////////////////
	onClickTab(event: egret.TouchEvent) {
		let target = event.target
		let v = this.tab_btn_list[target.name]

		if (v.checkname) {
			v.funcname = v.checkname(this)
		}

		if (this.hideRegistWnd(v.funcname)) return;

		if (v == null) {
			TLog.Error("onClickMoreSubBtn %s", target.name)
			return
		}

		if (v.callback) {
			v.callback.call(this, event);
			return;
		}

		if (ExecuteMainFrameFunction(v.keyfunc)) {

		}

		if (v.keyfunc == null) {
			this.checkNpc()
		}
	}

	onClickCopper(args) {
		let wnd: MoneyChargeFrame = WngMrg.getInstance().getWindow("MoneyChargeFrame")
		wnd.showWnd()
	}

	onClickSilver(args) {

	}

	onClickGold(args) {
		ExecuteMainFrameFunction("chongzhi")
	}

	//玩家详情
	onPlayerDetailsClick(args) {
		ExecuteMainFrameFunction("wanjia")
	}

	onXianLvClick(event: egret.TouchEvent) {
		let checkList = CheckMainFrameFunction(GuideFuncDefine.FIELD_FUNC_TIANNV)

		if (checkList[0] == true) {
			let wnd: CommonOpenTipsFrame = WngMrg.getInstance().getWindow("CommonOpenTipsFrame")
			if (wnd.isVisible() == true) {
				wnd.hideWnd()
				return
			}
			let window: eui.Component = event.target
			let point = core.EgretUtil.nodeToStageXY(event.target, 0, 0)
			// let stageX = event.stageX
			// let stageY = event.stageY
			wnd.onShowWnd(4, point.x - window.width / 2, point.y - window.height)
			return
		}
		ExecuteMainFrameFunction("xianlv")
	}

	onClickVip(args) {
		// WngMrg.getInstance().showWindow("TenGiftFrame");
		ExecuteMainFrameFunction("VIP")
	}

	onClickRank(args) {
		ExecuteMainFrameFunction("paihangbang")
	}

	onCheckXianLv() {
		let checkList = CheckMainFrameFunction(GuideFuncDefine.FIELD_FUNC_TIANNV)
		if (!checkList[0]) {
			return "XianLvFrame"
		} else {
			return "CommonOpenTipsFrame"
		}
	}

	///////////////////////////////////////////////////////
	getDotTipsArgsImp(checkParam) {

	}

	getDotTipsOffsetImp(parentWnd:eui.Component):{x:number, y:number}{
        let curName = parentWnd.name;
        let tabNameList = ["tab0", "tab1", "tab2","tab3", "tab4", "tab5"]

        if(tabNameList.indexOf(curName) != -1){
            return {x:0, y:4}
        }
        return null;
	}

	///////////////////////////////////////////////////////
	setHeadGroupVisible(b: boolean) {
		this.mElemList["head_group"].visible = b
		this.mElemList["coin_group"].visible = b
	}

	/////////////////////////////////////////////
	setChatViewerVisible(visible: boolean) {
		//this.mChatViewr.setVisible(visible)
		this.new_chat_wnd.setVisible(visible)
		this.mElemList["new_chat_wnd_group"].visible = visible
		//here
		// if(!visible){
		// this.mChatViewr.scroll.clearItemList();
		// }
	}


	//////////////////--------------------------------
	checkNpc() {
		let check = CheckMainFrameFunction("richang")
		if (check[0] == false) return
		if (!MapSystem.getInstance().isGuanKaMap()) return
		let npcList = GetActivity(ActivityDefine.Boss).getZhongKuiActNpcList()
		if (npcList == null) return
		//if(size_t(this.npcList) != size_t(npcList)){
		for (let k in npcList) {
			let v = GameConfig.ZhongKuiDemonConfig[tonumber(k)].entryId
			//let npc = this.getNpc(v)
			/*if(npc){
				this.removeInstrusionNpc(v)
			}else{*/
			this.createInstrusionTask(v)
			//}
		}
		//}
	}
	//随机取点
	getRandLocalPosition(npcId) {
		let mapid = MapSystem.getInstance().getMapId()
		let config = GameConfig.MapEnterList
		let pos = []
		for (let k in config) {
			let v = config[k]
			if (v.inMapId == mapid) {
				pos = v.pos
				break
			}
		}

		let index = 11
		let npcConfig = GameConfig.ZhongKuiDemonConfig
		for (let k in npcConfig) {
			let v = npcConfig[k]
			if (v.entryId == npcId) {
				index = v.index
				break
			}
		}

		return pos[index - 11] || [11, 11]
	}

	getNpc(entryId) {
		let uid = this.npcList[entryId]
		if (!uid) return null
		return ActorManager.getInstance().getNpc(uid)
	}

	//创建小怪npc
	createInstrusionTask(npcId?) {

		if (!npcId) return
		let npc = this.getNpc(npcId)
		if (npc) {
			return
		}

		//战斗中
		if (FightSystem.getInstance().isFight() == true) {
			return
		}
		let pos = this.getRandLocalPosition(npcId)
		let npcInfo: any = {}
		npcInfo["cellx"] = pos[0]
		npcInfo["celly"] = pos[1]
		npcInfo["dir"] = 3
		npcInfo["entryId"] = npcId
		let uid = GenCharaterId()
		npcInfo["id"] = uid
		npcInfo["name"] = ""
		npcInfo["param"] = {}
		npcInfo["taskInfo"] = {}
		this.npcList[npcId] = uid
		ActorManager.getInstance().createNpc(npcInfo)
	}

	setChatContent(content:string){
		this.new_chat_wnd.setChatContent(content)
	}

	setFastChatIsVisible(flag){
		this.mElemList["hide_fast_chat_btn"].visible = flag
		this.fast_chat_wnd.setVisible(flag)
	}

	onClickFastChatClose(){
		this.setFastChatIsVisible(false)
	}
}