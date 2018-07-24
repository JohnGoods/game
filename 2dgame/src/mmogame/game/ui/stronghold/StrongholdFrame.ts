// TypeScript file

class StrongholdFrame extends BaseWnd {

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/stronghold/StrongholdLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0]
		this.setFullScreenRaw(true)
		this.initSkinElemList()

		this.mLayoutNode.setLayer(gui.GuiLayer.Bottom)
		this.mLayoutNode.touchEnabled = false

		var elemInfo = [
			{ ["name"]: "btn_close", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.leaveStronghold },

			{ ["name"]: "btn_map", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickMap },
			{ ["name"]: "btn_record", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRecord },
			{ ["name"]: "btn_hecheng", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickHecheng },

			{ ["name"]: "btn_rule", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRule },
			{ ["name"]: "btn_fujin", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFujin },

			{ ["name"]: "img_guwu", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGuwu },
			{ ["name"]: "img_shuairuo", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickShuairuo },
		]
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let list: eui.List = this.mElemList["list_playerList"]
		list.itemRenderer = itemRender.StrongholdPlayerListItem
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_MOVE, this.refreshMapPos, this)
		RegisterEvent(EventDefine.HERO_ENTER_MAP, this.refreshMapPos, this)
		RegisterEvent(EventDefine.PLAYER_ENTER_MAP, this.refreshFujinFrame, this)
		RegisterEvent(EventDefine.PLAYER_LEAVE_MAP, this.refreshFujinFrame, this)
		RegisterEvent(EventDefine.STRONGHOLD_KEY_STATUS_UPDATE, this.refreshFrame, this)
		RegisterEvent(EventDefine.STRONGHOLD_RECORD_UPDATE, this.refreshRecordDot, this)
		RegisterEvent(EventDefine.STRONGHOLD_CLUB_NUM_UPDATE, this.refreshClubJoinNumBuff, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshAttackPlayerDebuff, this)
		this.mLayoutNode.visible = true
		this.moveToBack()
		this.mElemList["btn_fujin"].selected = false
		this.mElemList["group_playerList"].visible = false
		this.refreshFrame()
		this.refreshRecordDot()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_MOVE, this.refreshMapPos, this)
		UnRegisterEvent(EventDefine.HERO_ENTER_MAP, this.refreshMapPos, this)
		UnRegisterEvent(EventDefine.PLAYER_ENTER_MAP, this.refreshFujinFrame, this)
		UnRegisterEvent(EventDefine.PLAYER_LEAVE_MAP, this.refreshFujinFrame, this)
		UnRegisterEvent(EventDefine.STRONGHOLD_KEY_STATUS_UPDATE, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.STRONGHOLD_RECORD_UPDATE, this.refreshRecordDot, this)
		UnRegisterEvent(EventDefine.STRONGHOLD_CLUB_NUM_UPDATE, this.refreshClubJoinNumBuff, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshAttackPlayerDebuff, this)
		this.mLayoutNode.visible = false
	}

	refreshFujinFrame() {
		if (this.mElemList["group_playerList"].visible == false) {
			return
		}

		let list = []
		let playerList = ActorManager.getInstance().getPlayerList()
		for (let _ in playerList) {
			let player = playerList[_]
			table_insert(list, player)
		}
		let elist: eui.List = this.mElemList["list_playerList"]
		UiUtil.updateList(elist, list)
	}

	refreshFrame() {
		let info = GetActivity(ActivityDefine.Stronghold).getStrongholdKeyInfo()
		if (info[0]) {
			this.mElemList["group_btn"].visible = true
			//this.mElemList["group_playerList"].visible = true
			//this.mElemList["group_buff"].visible = true
			this.mElemList["group_statusInfo"].visible = true
			if (info[1] == "" || info[2] == "") {
				AddRdContent(this.mElemList["rd_info"], Localize_cns("STRONGHOLD_TEXT45"), "ht_22_cc_stroke", "white")
			} else {
				AddRdContent(this.mElemList["rd_info"], String.format(Localize_cns("STRONGHOLD_TEXT46"), info[1], info[2]), "ht_22_cc_stroke", "white")
			}
			this.refreshClubJoinNumBuff()
			this.refreshAttackPlayerDebuff()
		} else {
			this.mElemList["group_btn"].visible = false
			this.mElemList["group_playerList"].visible = false
			this.mElemList["group_buff"].visible = false
			this.mElemList["group_statusInfo"].visible = false
		}
	}

	refreshClubJoinNumBuff() {
		let n = GetActivity(ActivityDefine.Stronghold).getClubJoinNum()
		if (n > 0) {
			this.mElemList["group_buff"].visible = true
			this.mElemList["group_guwu"].visible = true
			let val = n * StrongholdConfig.clubBuffFactor
			if (val > StrongholdConfig.clubBuffMaxFactor) {
				val = StrongholdConfig.clubBuffMaxFactor
			}
			this.mElemList["lab_guwu"].text = String.format(Localize_cns("STRONGHOLD_TEXT54"), val * 100)
		} else {
			this.mElemList["group_guwu"].visible = false
		}
	}

	refreshAttackPlayerDebuff() {
		let info = GetActivity(ActivityDefine.Stronghold).getStrongholdKeyInfo()
		let n = getSaveRecord(opSaveRecordKey.strongholdKillCurse) || 0
		if (info[0] && n > 0) {
			this.mElemList["group_buff"].visible = true
			this.mElemList["group_shuairuo"].visible = true
			let val = n * StrongholdConfig.debuffFactor
			if (val > StrongholdConfig.debuffMaxFactor) {
				val = StrongholdConfig.debuffMaxFactor
			}
			this.mElemList["lab_shuairuo"].text = String.format(Localize_cns("STRONGHOLD_TEXT55"), val * 100)
		} else {
			this.mElemList["group_shuairuo"].visible = false
		}
	}

	leaveStronghold() {
		// let func = function(str) {
		// 	let t: IDialogCallback = {
		// 		onDialogCallback(result: boolean, userData): void {
		// 			if (result == true) {
		// 				let a = GetActivity(ActivityDefine.Stronghold)
		// 				a.requestStop()
		// 			}
		// 		}
		// 	}
		// 	MsgSystem.confirmDialog(str, t)
		// }

		// let heroInfo = GetHeroPropertyInfo()
		// if (bit.band(heroInfo.status, opStatusType.STATUS_TYPE_TICKET) == opStatusType.STATUS_TYPE_TICKET) {
		// 	func(Localize_cns("STRONGHOLD_TEXT44"))
		// 	return
		// }

		// let info = GetActivity(ActivityDefine.Stronghold).getStrongholdKeyInfo()
		// if (info[0]) {
		// 	func(Localize_cns("STRONGHOLD_TEXT47"))
		// 	return
		// }

		let a = GetActivity(ActivityDefine.Stronghold)
		a.requestStop()
	}

	onClickMap() {
		WngMrg.getInstance().showWindow("StrongholdMapFrame")
	}

	onClickRecord() {
		WngMrg.getInstance().showWindow("StrongholdRecordFrame")
	}

	onClickHecheng() {
		ExecuteMainFrameFunction("hecheng")
	}

	onClickRule() {
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
		wnd.showWithActivity("strongholdBossRule")
	}

	onClickFujin() {
		if (this.mElemList["btn_fujin"].selected) {
			this.mElemList["group_playerList"].visible = true
			this.refreshFujinFrame()
		} else {
			this.mElemList["group_playerList"].visible = false
		}
	}

	refreshMapPos(args) {
		let target = GetHero()
		let x = 0
		let y = 0
		if (target) {
			x = target.getCellX()
			y = target.getCellY()
		}
		else {
			var heroPoint = GetHero().getCellXY()
			x = heroPoint.x
			y = heroPoint.y
		}

		this.mElemList["lab_mapxy"].text = "[" + x + "," + y + "]"
	}

	onClickGuwu() {
		let n = GetActivity(ActivityDefine.Stronghold).getClubJoinNum()
		if (n > 0) {
			let val = n * StrongholdConfig.clubBuffFactor
			if (val > StrongholdConfig.clubBuffMaxFactor) {
				val = StrongholdConfig.clubBuffMaxFactor
			}
			MsgSystem.confirmDialog_YES(String.format(Localize_cns("STRONGHOLD_TEXT56"), n, val * 100))
		}
	}

	onClickShuairuo() {
		let info = GetActivity(ActivityDefine.Stronghold).getStrongholdKeyInfo()
		let n = getSaveRecord(opSaveRecordKey.strongholdKillCurse) || 0
		if (info[0] && n > 0) {
			let val = n * StrongholdConfig.debuffFactor
			if (val > StrongholdConfig.debuffMaxFactor) {
				val = StrongholdConfig.debuffMaxFactor
			}
			MsgSystem.confirmDialog_YES(String.format(Localize_cns("STRONGHOLD_TEXT57"), n, val * 100))
		}
	}

	refreshDotTipsImp() {
		this.refreshRecordDot()
	}

	refreshRecordDot() {
		if (GuideFuncSystem.getInstance().checkStrongholdBeRobbed()) {
			this.createDotTipsUI(this.mElemList["btn_record"])
		}
	}

	removeRecordDot() {
		this.hideDotTipsUI(this.mElemList["btn_record"])
	}

}

module itemRender {
	export class StrongholdPlayerListItem extends eui.ItemRenderer {
		mElemList: any

		constructor() {
			super()
			this.mElemList = {}

			let mElemInfo = [
				{ ["index_type"]: eui.Group, ["name"]: "group", ["x"]: 0, ["y"]: 0, ["w"]: 170, ["h"]: 60, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPlayer },
				{ ["index_type"]: eui.Label, ["name"]: "levelName", ["parent"]: "group", ["title"]: "", ["font"]: "ht_18_lc", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 4, ["w"]: 170, ["h"]: 20, ["messageFlag"]: true },
				{ ["index_type"]: eui.Label, ["name"]: "clubName", ["parent"]: "group", ["title"]: "", ["font"]: "ht_18_lc", ["color"]: gui.Color.navajowhite, ["x"]: 0, ["y"]: 24, ["w"]: 170, ["h"]: 20, ["messageFlag"]: true },
				//{ ["index_type"]: eui.Label, ["name"]: "power", ["parent"]: "group", ["title"]: "", ["font"]: "ht_18_lc", ["color"]: gui.Color.navajowhite, ["x"]:0, ["y"]: 45, ["w"]: 170, ["h"]: 20, ["messageFlag"]: true },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "line", ["parent"]: "group", ["image"]: "cz_uiLine03", ["x"]: 0, ["y"]: 44, ["w"]: 170, ["h"]: 16, ["messageFlag"]: true },
			]
			UiUtil.createElem(mElemInfo, this, this.mElemList, this)
		}

		protected dataChanged(): void {
			let data = this.data
			let info = data.getPropertyInfo()
			this.mElemList["levelName"].text = "Lv." + info.level + "  " + info.name
			this.mElemList["clubName"].text = info.factionName == "" ? Localize_cns("STRONGHOLD_TEXT12") : info.factionName
			//this.mElemList["power"].text = Localize_cns("STRONGHOLD_TEXT13") + "6666666"
		}

		onClickPlayer() {
			let data = this.data
			let info = data.getPropertyInfo()
			GetActivity(ActivityDefine.Stronghold).attackPlayer(info.id, info)
		}

	}
}