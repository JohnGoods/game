// TypeScript file

class ClubCreatFrame extends BaseWnd {
	selectIndex: any;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/club/ClubCreatLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		this.setAlignCenter(true, true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onCreatSelectClick },
			{ ["name"]: "btn_2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onCreatSelectClick },
			{ ["name"]: "creat_club_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onCreatClubClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		this.mElemList["club_rd1"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["club_rd2"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["info_rd1"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["info_rd2"].setAlignFlag(gui.Flag.H_CENTER)

		let edit = <eui.EditableText>this.mElemList["edit_input"]
		edit.text = "";

		let moneyList = [
			opCreateNeedMoney.POOR,
			opCreateNeedMoney.RICH,
		]

		let vipList = [
			opCreateNeedVIP.POOR,
			opCreateNeedVIP.RICH,
		]
		//创建信息
		let str = ""
		for (let i = 1; i <= 2; i++) {
			str = String.format(Localize_cns("CLUB_TXT76"), i, vipList[i - 1], GameConfig.FactionExpConfig[i].maxCount)
			AddRdContent(this.mElemList["info_rd" + i], str, "ht_22_cc", "ublack", 3)
			//消耗元宝
			AddRdContent(this.mElemList["club_rd" + i], String.format(Localize_cns("CLUB_TXT56"), moneyList[i - 1]), "ht_22_cc", "ublack")
		}
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		RegisterEvent(EventDefine.UPDATE_CLUB_MEINFO, this.isExitWnd, this)
		this.mLayoutNode.setDoModal(true);
		this.selectIndex = 1
		this.refreshFrame();
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		UnRegisterEvent(EventDefine.UPDATE_CLUB_MEINFO, this.isExitWnd, this)
		this.mLayoutNode.setDoModal(false);
	}

	refreshFrame() {
		this.mElemList["btn_1"].source = "bh_textDi02"
		this.mElemList["btn_2"].source = "bh_textDi02"
		if (this.selectIndex == 1) {
			this.mElemList["btn_1"].source = "bh_textDi03"
		} else {
			this.mElemList["btn_2"].source = "bh_textDi03"
		}
	}

	onCreatSelectClick(args) {
		let name = args.target.name
		if (name == "btn_2") {
			this.selectIndex = 2
		} else {
			this.selectIndex = 1
		}
		this.refreshFrame()
	}

	onCreatClubClick(args) {
		// let name = args.target.name

		// let content = this.mElemList["edit_input"].text
		// console.log("this.selectIndex=======================>"+this.selectIndex);
		// console.log("content=======================>"+content);
		// if (content.length == 0) {
		// 	MsgSystem.addTagTips(Localize_cns("CLUB_TXT53"))
		// }else if(content.length > 6)  {
		// 	MsgSystem.addTagTips(Localize_cns("CLUB_TXT54"))
		// }else{
		// 	//发协议
		// 	//检测消耗条件之后
		// 	let gold = GetHeroProperty("gold")
		// 	let isCanCreat = true
		// 	if(isCanCreat){
		// 		//facName, facIntroduction, logoFaction
		// 		let facName = content
		// 		let facIntroduction = ""
		// 		let logoFaction = "1"
		// 		RpcProxy.call("C2G_FactionCreate",facName,facIntroduction,logoFaction)
		// 	}
		// }

		this.testCreat()
	}

	isExitWnd(args) {
		let event = ClubSystem.getInstance().getRoleClubInfo()
		if (event.facId != 0) {
			//MsgSystem.addTagTips("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
			let wnd = WngMrg.getInstance().getWindow("ClubListFrame")
			if (wnd.isVisible()) {
				wnd.hideWnd()
			}
			// daiyouhua
			let wnd1 = WngMrg.getInstance().getWindow("ClubCreatFrame")
			if (wnd1.isVisible()) {
				wnd1.hideWnd()
			}
			//特效
			//GameSound.getInstance().playEffect(SystemSound.effect_MakeLegion)
			//打开帮派界面
			WngMrg.getInstance().showWindow("ClubFrame")
		}
	}

	testCreat() {
		let name = this.mElemList["edit_input"].text
		let heroInfo = GetHeroPropertyInfo()

		if (heroInfo["gold"] < opFactionBaseOptions.CREATE_GOLD) {
			// let wnd = WngMrg.getInstance().getWindow("QuickGainFrame")
			// let itemConfig: any = [["zuanshi", 0], ["ClubCreateFrame"]]
			// wnd.showQuickGainFrame(itemConfig)
			MsgSystem.addTagTips(Localize_cns("DIAMAND_NOENGOUGH"))
			ExecuteMainFrameFunction("chongzhi")
			this.hideWnd()
			return
		}
		if (heroInfo["faction"] != 0) {
			MsgSystem.addTagTips(Localize_cns("LEGIONHINT7"))
			return
		}


		//是否为空
		if (name == "") {
			MsgSystem.confirmDialog_YES(Localize_cns("CLUB_TXT24"))
			return
		}


		if (/^\d+$/.test(name)) {
			MsgSystem.confirmDialog_YES(Localize_cns("LEGIONHINT56"))
			return
		}

		//TODO:敏感字检测
		if (WordFilter.checkword(name) == false) {
			MsgSystem.confirmDialog_YES(Localize_cns("LEGIONHINT57"))
			return false
		}

		//长度
		let len = name.length
		if (len > NAME_LENGTH_LIMIT) {
			MsgSystem.confirmDialog_YES(Localize_cns("CLUB_TXT54"))//String.format(Localize_cns("LEGIONHINT58"), NAME_LENGTH_LIMIT))
			return
		}

		let facName = name
		let facIntroduction = ""
		let logoFaction = 1
		let level = this.selectIndex

		let vipLv = GetHeroProperty("VIP_level")
		if (level == 1) {
			if (vipLv < opCreateNeedVIP.POOR) {
				let str = String.format(Localize_cns("CLUB_TXT118"), opCreateNeedVIP.POOR, level)
				MsgSystem.addTagTips(str)
			} else {
				RpcProxy.call("C2G_FactionCreate", facName, facIntroduction, logoFaction, level)
			}
		} else if (level == 2) {
			if (vipLv < opCreateNeedVIP.RICH) {
				let str = String.format(Localize_cns("CLUB_TXT118"), opCreateNeedVIP.RICH, level)
				MsgSystem.addTagTips(str)
			} else {
				RpcProxy.call("C2G_FactionCreate", facName, facIntroduction, logoFaction, level)
			}
		}



	}
}