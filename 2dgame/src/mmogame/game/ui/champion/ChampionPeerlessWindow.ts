// TypeScript file
class ChampionPeerlessWindow extends BaseCtrlWnd {
	mElemList;

	controlData

	check_timer

	round_Table

	public initObj(...params: any[]) {
		this.controlData = {}
	}

	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList

		var elemInfo = [
			{ ["name"]: "btn_baoming", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.baoMingClick },
			{ ["name"]: "shop_frist", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onShopClick },
			{ ["name"]: "btn_tips", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTipsClick },
		]

		for (let k = 1; k <= 4; k++) {
			for (let i = 1; i <= 8; i++) {
				let label: eui.Label = this.mElemList["label_" + k + "_" + i]
				let image: eui.Image = this.mElemList["dot_" + k + "_" + i]
				if (label && image) {
					table_insert(elemInfo, { ["name"]: "label_" + k + "_" + i, ["messageFlag"]: true })
					table_insert(elemInfo, { ["name"]: "dot_" + k + "_" + i, ["messageFlag"]: true })
				}
			}
		}

		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let bottom_list: eui.List = this.mElemList["list_bottom"]
		bottom_list.itemRenderer = itemRender.PlayerCombatInfoItem

		let top_list: eui.List = this.mElemList["list_top"]
		top_list.itemRenderer = itemRender.PlayerSevertInfo
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateWnd, this)
		this.mElemList["peerless_wnd"].visible = true
		this.mElemList["title"].text = Localize_cns("JJC_TXT2")
		this.onRefreh()
		this.addBtnListener()

		RpcProxy.call("C2G_WorldOne_CanInsertGame")
		/*let osDate = GetServerDate()
		let wday = osDate.wday
		if(wday == 1 && (osDate.hour >= 21 || (osDate.hour == 20 && osDate.min >= 55))){
			RpcProxy.call("C2G_WorldOne_HaixuanInfo")
		}
		RpcProxy.call("C2G_WorldOne_SixteenInfo")*/
		RpcProxy.call("C2G_WorldOne_BetPlayInfo")
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateWnd, this)
		this.mElemList["peerless_wnd"].visible = false
		this.removeBtnListener()
		if (this.check_timer != null) {
			KillTimer(this.check_timer)
			this.check_timer = null
		}
	}

	updateWnd(args) {
		if (args) {
			let oldpro = args.oldProperty.saveRecord[opSaveRecordKey.WorldOneInsertIndex] || []
			let oldVal = oldpro[0] || 0
			let newpro = args.newProperty.saveRecord[opSaveRecordKey.WorldOneInsertIndex] || []
			let newVal = newpro[0] || 0
			if (oldVal == newVal) return
		}

		this.onRefreh()
	}

	onRefreh() {

		this.mElemList["part_register"].visible = false
		this.mElemList["part_audition"].visible = false
		this.mElemList["part_round_16"].visible = false

		let check = GetActivity(ActivityDefine.Champion).checkPlayerState()
		if (check == null) return
		if (check <= 1) {
			this.refreshPartRegister(check)
		} else if (check == 2) {
			this.refreshPartAudition()
		} else if (check == 3) {
			this.refreshPartRound()
		}
		let osDate = GetServerDate()
		if (this.check_timer = null && osDate.hour <= 20 && osDate.min < 55 && osDate.wday != 6 && osDate.wday != 0) {
			this.check_timer = SetTimer(this.onTick, this, 1000, true)
		}

		this.mElemList["group_qu"].visible = check > 1
		if (check > 1) {
			let levelType = getSaveRecord(opSaveRecordKey.WorldOneInsertIndex)
			let qu_text = ""
			if (levelType != null) {
				qu_text = Localize_cns("JJC_COMBAT_AREA_TXT" + levelType)
			}

			this.mElemList["label_qu"].text = qu_text
		}
	}

	refreshPartRegister(check) {
		this.mElemList["part_register"].visible = true
		let btn: gui.Button = this.mElemList["btn_baoming"]
		btn.enabled = check == 1
		//let osDate = GetServerDate()
		let levelType = getSaveRecord(opSaveRecordKey.WorldOneInsertIndex)
		if (levelType != null) {
			btn.text = Localize_cns("JJC_TXT32")
		} else {
			btn.text = Localize_cns("JJC_TXT17")
		}
		let ruleConfig = GameConfig.RuleDescriptionConfig["PeerlessRule"]
		let str = ""
		for (let k = 1; k <= size_t(ruleConfig); k++) {
			let v: string = ruleConfig[k].des
			if (k == 3) {
				v = "#lime" + v + "#rf"
			}
			if (k == 1) {
				str += v
			} else if (k >= 6 && k <= 18 && k != 12) {
				str += "#br#space" + v
			} else {
				str += "#br#br" + v
			}

		}

		AddRdContent(this.mElemList["rd_tips"], str, "ht_20_cc_stroke", "aliceblue")
	}

	refreshPartAudition() {
		let auditionInfo = GetActivity(ActivityDefine.Champion).getAuditionInfo()
		if (size_t(auditionInfo) == 0) return
		this.mElemList["part_audition"].visible = true

		let topList = auditionInfo.playerList || []
		let top_list: eui.List = this.mElemList["list_top"]
		UiUtil.updateList(top_list, topList)

		let bottomList = auditionInfo.player || []
		let bottom_list: eui.List = this.mElemList["list_bottom"]
		UiUtil.updateList(bottom_list, bottomList);

	}
	refreshPartRound() {
		let round = GetActivity(ActivityDefine.Champion).getNowRound() //到哪个环节
		let winNum = peerlessWinNum[round] //赢多少次

		let list = GetActivity(ActivityDefine.Champion).getRoundInfo()
		if (size_t(list) == 0 || size_t(list) < 16) return
		this.mElemList["part_round_16"].visible = true

		let guanjun
		let showList = splitListByCount(list, 2)
		for (let k = 0; k < showList.length; k++) {
			let config = showList[k]
			for (let index = 1; index <= size_t(config); index++) {
				let v = config[index - 1]
				let tempWinNum = peerlessWinNum[v.roundIndex]
				if (tempWinNum >= 4) {
					guanjun = v
				}
				let true_index = k * 2 + index
				this.refreshPlayerInfo(v, winNum, true_index)
			}
		}

		this.refreshBtnUI(winNum)
		this.refreshIconDot()
		this.refreshYaImage()

		//如果是冠军
		let image: eui.Image = this.mElemList["image_player_icon"]
		if (guanjun != null) {
			let guanjun_info = guanjun.playerInfo
			let sex = guanjun_info.sex || 1
			let vaction = guanjun_info.vocation || 10002
			image.source = GetProfessionIcon(vaction, sex)
			image.width = 72
			image.height = 72
			image.top = 283
			image.scaleX = 1.2
			image.scaleY = 1.2
			this.mElemList["label_winner"].text = GetServerPlayerName(guanjun.serverId, guanjun.serverGroupId, guanjun_info.name)
		} else {
			image.source = "txdy_paiming"
			image.width = 70
			image.height = 80
			image.top = 289
			image.scaleX = 1
			image.scaleY = 1
		}
		let isChampion = winNum >= 4
		this.mElemList["label_winner"].visible = isChampion
		this.mElemList["image_final"].visible = isChampion
		
		//存储分组的数据
		this.refreshControlData(list)

		//刷新赛程信息
		if (round >= peerlessOptions.round_one) {
			this.mElemList["group_des_bottom"].visible = false
			return
		}
		this.mElemList["group_des_bottom"].visible = true
		let str = ""
		if (round < peerlessOptions.round_four) {
			str = Localize_cns("JJC_ROUND_" + round) + Localize_cns("JJC_ROUND_JINSHENG") + Localize_cns("JJC_ROUND_" + (round + 1))
		} else {
			str = Localize_cns("JJC_ROUND_" + (round + 1))
		}
		this.mElemList["label_round_num"].text = str
		let osDate = GetServerDate()
		let weekDay = osDate.wday
		let timeStr = String.format(Localize_cns("JJC_ROUND_TIME"), GetNumberToStr(weekDay))
		this.mElemList["label_round_time"].text = timeStr

	}

	refreshControlData(list) {
		this.controlData = {}

		for (let winNum = 0; winNum <= 4; winNum++) {
			let dataList = []
			let round = winNum + 1
			for (let k in list) {
				let v = list[k]
				let tempWinNum = peerlessWinNum[v.roundIndex]
				if (tempWinNum >= winNum) {
					table_insert(dataList, v)
				}
			}
			if (dataList.length <= 1) return
			let dataYaZhuList = splitListByCount(dataList, 2)
			for (let k = 1; k <= dataYaZhuList.length; k++) {
				let dataKey = "" + round + k
				let v = dataYaZhuList[k - 1]
				this.controlData[dataKey] = v
			}
		}

	}
	//刷新16强的胜利情况
	refreshPlayerInfo(config, needNum, k) {
		///特殊处理
		let winNum = peerlessWinNum[config.roundIndex]

		let label: eui.Label = this.mElemList["label_name_" + k]

		let id = GetHeroProperty("id")
		let fontColot = gui.Color.aliceblue
		if (config.id == id) {
			fontColot = gui.Color.deepskyblue
		}
		label.textColor = fontColot
		label.text = GetServerPlayerName(config.serverId, config.serverGroupId, config.playerInfo.name)
		//刷新图片
		for (let index = 1; index <= 4; index++) {
			let image: eui.Image = this.mElemList["image_" + index + "_" + k]
			image.visible = false
			if (winNum >= needNum && index <= (needNum + 1)) {
				image.visible = true
			}
		}

		let bg_image: eui.Image = this.mElemList["image_bg_" + k]
		//刷新底图
		if (winNum >= needNum) {
			bg_image.source = "txdy_roleNameDi01"
		} else {
			bg_image.source = "txdy_roleNameDi02"
		}
	}
	//刷新查看按钮
	refreshBtnUI(needNum) {
		for (let k = 1; k <= 4; k++) {
			for (let i = 1; i <= 8; i++) {
				let btn: eui.Image = this.mElemList["look_" + k + "_" + i]
				let label: eui.Label = this.mElemList["label_" + k + "_" + i]
				let group: eui.Group = this.mElemList["group_" + k + "_" + i]
				if (!btn || !label || !group) continue
				if (needNum >= k) {
					label.visible = false
					btn.source = "ty_bt_xinXi01"
				} else {
					label.visible = true
					btn.source = "ty_tongYongBt11"
				}
				group.visible = k <= (needNum + 1)
			}
		}
	}
	//是否灰化按钮
	refreshBtnEnabled() {
		let check = 0
		let stakeInfo = GetActivity(ActivityDefine.Champion).getStakeInfo()
		if (stakeInfo[1] != null) {
			check = stakeInfo[0]
		}
		let b = check >= 1
		for (let k = 1; k <= 4; k++) {
			for (let i = 1; i <= 8; i++) {
				let btn: eui.Image = this.mElemList["look_" + k + "_" + i]
				if (btn == null) continue
				if (btn.source != "ty_tongYongBt11") {
					UiUtil.grayComponent(btn, false)
					continue
				}
				UiUtil.grayComponent(btn, b)

			}
		}
	}
	//刷新押注
	refreshYaImage() {
		let check = 0
		let stakeInfo = GetActivity(ActivityDefine.Champion).getStakeInfo()
		if (stakeInfo[1] != null) {
			check = stakeInfo[0]
		}
		for (let k = 1; k <= 16; k++) {
			let image: eui.Image = this.mElemList["image_yiya_" + k]
			image.visible = k == check
		}
		this.refreshBtnEnabled()

	}
	//刷新红点
	refreshIconDot() {
		let round = GetActivity(ActivityDefine.Champion).getNowRound() //到哪个环节
		let winNum = peerlessWinNum[round + 1] || 0
		if (winNum == null) return
		let check = GuideFuncSystem.getInstance().checkPeerless()
		for (let k = 1; k <= 4; k++) {
			for (let i = 1; i <= 8; i++) {
				let image: eui.Image = this.mElemList["dot_" + k + "_" + i]
				if (image) {
					image.visible = (check && winNum == k)
				}
			}
		}
	}

	//添加按钮事件
	addBtnListener() {
		for (let k = 1; k <= 4; k++) {
			for (let i = 1; i <= 8; i++) {
				let btn: eui.Image = this.mElemList["look_" + k + "_" + i]
				if (btn) {
					btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lookClick, this)
				}
			}
		}

	}
	//移除按钮事件
	removeBtnListener() {
		for (let k = 1; k <= 4; k++) {
			for (let i = 1; i <= 8; i++) {
				let btn: eui.Image = this.mElemList["look_" + k + "_" + i]
				if (btn) {
					btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.lookClick, this)
				}
			}
		}
	}

	///---------响应事件
	baoMingClick(args) {
		RpcProxy.call("C2G_WorldOneJoinGame")
	}

	onShopClick() {
		let wnd: ShopPeerlessFrame = WngMrg.getInstance().getWindow("ShopPeerlessFrame")
		wnd.showWithIndex(0)
	}

	onTipsClick() {
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
		wnd.showWithActivity("PeerlessRule")
	}

	lookClick(args) {
		let name = args.target.name
		let index = name.replace(/[^0-9]/ig, "");

		let config = this.controlData[index]
		let btn: eui.Image = this.mElemList[name]
		if (!config || size_t(config) < 2 || !btn) return
		let playerInfoList = [config[0], config[1]]
		if (btn.source == "ty_tongYongBt11") {
			let wnd: PeerlessStakeFrame = WngMrg.getInstance().getWindow("PeerlessStakeFrame")
			wnd.onShowWnd(playerInfoList)
		} else {
			let wnd: PeerlessCombatTipsFrame = WngMrg.getInstance().getWindow("PeerlessCombatTipsFrame")
			wnd.onShowWnd(playerInfoList)
		}

	}


	///////////---------定时器
	onTick() {
		let osDate = GetServerDate()
		if (osDate.hour == 20 && osDate.min > 55) {//每天的20：55主动发送协议，刷新界面
			if (this.check_timer != null) {
				KillTimer(this.check_timer)
				this.check_timer = null
				let info = GetActivity(ActivityDefine.Champion).checkPlayerState()
				if (info == 2) {
					RpcProxy.call("C2G_WorldOne_HaixuanInfo")
				} else if (info == 3) {
					RpcProxy.call("C2G_WorldOne_SixteenInfo")
				}
			}
		}
	}

}

module itemRender {
	export class PlayerCombatInfoItem extends eui.ItemRenderer {
		mElemList: any;
		constructor() {
			super();
			this.mElemList = {}
			let mElemInfo: any = [

				{ ["index_type"]: eui.Group, ["name"]: "group", ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: 533, ["h"]: 30, },
				{ ["index_type"]: eui.Label, ["name"]: "ju", ["parent"]: "group", ["title"]: "", ["font"]: "ht_20_lc_stroke", ["image"]: null, ["color"]: gui.Color.aliceblue, ["x"]: 40, ["y"]: 5, ["w"]: 140, ["h"]: 20, ["messageFlag"]: true },
				{ ["index_type"]: gui.RichDisplayer, ["name"]: "combat", ["parent"]: "group", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: null, ["color"]: gui.Color.aliceblue, ["x"]: 196, ["y"]: 5, ["w"]: 300, ["h"]: 20, ["messageFlag"]: true },
				{ ["index_type"]: eui.Label, ["name"]: "flag", ["parent"]: "group", ["title"]: "", ["font"]: "ht_20_lc_stroke", ["image"]: null, ["color"]: gui.Color.aliceblue, ["x"]: 450, ["y"]: 5, ["w"]: 300, ["h"]: 20, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLookClick },

			];
			UiUtil.createElem(mElemInfo, this, this.mElemList, this);

		}

		protected dataChanged(): void {
			let playerInfo = this.data

			let juText = Localize_cns("JJC_TXT3") + GetNumberToStr(playerInfo.index) + Localize_cns("JJC_TXT22")
			this.mElemList["ju"].text = juText
			let combatText = Localize_cns("JJC_TXT23") + "#lime" + GetServerPlayerName(playerInfo.serverId, playerInfo.serverGroupId, playerInfo.name)
			AddRdContent(this.mElemList["combat"], combatText, "ht_20_lc_stroke")

			let fontColot = gui.Color.red
			let flagText = Localize_cns("ESCORT_RECORD_TXT3")
			if (playerInfo.flag == 1) {
				fontColot = gui.Color.lime
				flagText = Localize_cns("JJC_TXT29")
			}
			this.mElemList["flag"].textColor = fontColot
			this.mElemList["flag"].text = flagText

		}

		onLookClick(args) {

		}
	}
}

module itemRender {
	export class PlayerSevertInfo extends eui.ItemRenderer {
		mElemList: any;
		constructor() {
			super();
			this.mElemList = {}
			let mElemInfo: any = [
				{ ["index_type"]: eui.Label, ["name"]: "paiming", ["image"]: "", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.aliceblue, ["x"]: 32, ["y"]: 0, ["w"]: 91, ["h"]: 30, },
				{ ["index_type"]: eui.Label, ["name"]: "name", ["image"]: "", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.aliceblue, ["x"]: 116, ["y"]: 0, ["w"]: 290, ["h"]: 30, },
				{ ["index_type"]: eui.Label, ["name"]: "jifen", ["image"]: "", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.lime, ["x"]: 401, ["y"]: 0, ["w"]: 91, ["h"]: 30, },
			];

			UiUtil.createElem(mElemInfo, this, this.mElemList, this);

		}

		protected dataChanged(): void {
			let config = this.data

			let paiming_text = config.index + ""
			this.mElemList["paiming"].text = paiming_text

			let name_text = GetServerPlayerName(config.serverId, config.serverGroupId, config.name)
			this.mElemList["name"].text = name_text

			let jifen_text = config.paiming
			this.mElemList["jifen"].text = jifen_text
		}

	}
}