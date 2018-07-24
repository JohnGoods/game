// TypeScript file

class StrongholdResFrame extends BaseWnd {
	strongholdIndex: number
	timer: number
	_list: any

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/stronghold/StrongholdResLayout.exml"]
		this._list = []
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0]
		this.initSkinElemList()
		//this.setAlignCenter(true, true)
		this.setFullScreen(true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		]
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let list: eui.List = this.mElemList["list"]
		list.itemRenderer = itemRender.StrongholdResListItem

		//this.mElemList["rd_tips"].setAlignFlag(gui.Flag.CENTER_CENTER)
		AddRdContent(this.mElemList["rd_tips"], Localize_cns("STRONGHOLD_TEXT19"), "ht_20_cc", "ublack")
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.STRONGHOLD_UPDATE, this.refreshFrame, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshRobAndOccupyCount, this)
		this.mLayoutNode.visible = true
		this.refreshRobAndOccupyCount()
		this.refreshFrame()
		KillTimer(this.timer)
		this.timer = SetTimer(this.refreshList, this, 1000, true)
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.STRONGHOLD_UPDATE, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshRobAndOccupyCount, this)
		this.mLayoutNode.visible = false
		KillTimer(this.timer)
	}

	refreshRobAndOccupyCount() {
		let robCount = StrongholdConfig.robCount - (getSaveRecord(opSaveRecordKey.strongholdRobCount) || 0)
		this.mElemList["lab_robCount"].text = Localize_cns("STRONGHOLD_TEXT5") + robCount + "/" + StrongholdConfig.robCount

		let occupyCount = StrongholdConfig.occupyCount - (getSaveRecord(opSaveRecordKey.strongholdCount) || 0)
		this.mElemList["lab_occupyCount"].text = Localize_cns("STRONGHOLD_TEXT34") + occupyCount + "/" + StrongholdConfig.occupyCount
	}

	refreshFrame() {
		let info = GetActivity(ActivityDefine.Stronghold).getStrongholdInfoByIndex(this.strongholdIndex)
		if (info == null) {
			return
		}
		let titleName = GameConfig.StrongholdConfig[this.strongholdIndex].name
		let curNum = info[1]
		let maxNum = GameConfig.StrongholdConfig[this.strongholdIndex].occuCount
		this.mElemList["lab_title"].text = titleName + "(" + curNum + "/" + maxNum + ")"

		//info.occupyList - key start from 0 or 1
		let list = []
		if (info.occupyList[0] && size_t(info.occupyList[0]) != 0) {
			for (let i = 0; i < maxNum; i++) {
				list[i] = info.occupyList[i] || []
				list[i].index = i + 1
				list[i].sameMemberNum = 0
				list[i].self = this
			}
		} else {
			for (let i = 1; i <= maxNum; i++) {
				list[i - 1] = info.occupyList[i] || []
				list[i - 1].index = i
				list[i - 1].sameMemberNum = 0
				list[i - 1].self = this
			}
		}

		let tempList = []
		let count = 0
		for (let k in list) {
			let v = list[k]
			if (v[0] && size_t(v[0]) != 0 && v[0][7] != 0) {
				count = 1
				if (tempList[v[0][7]]) {
					count += tempList[v[0][7]]
				}
				tempList[v[0][7]] = count
				list[k].sameMemberNum = count
			}
		}

		// TLog.Debug("-------------------1111111111----occupyList--- ")
		// print_r(list)
		this._list = list
		this.refreshList()
	}

	refreshList() {
		let elist: eui.List = this.mElemList["list"]
		UiUtil.updateList(elist, this._list)
	}

	showWithIndex(index) {
		this.strongholdIndex = index
		this.showWnd()
	}
}

module itemRender {
	export class StrongholdResListItem extends eui.ItemRenderer {
		mElemList: any
		nameToInfo: any

		constructor() {
			super()
			this.mElemList = {}
			this.nameToInfo = {}

			let mElemInfo = [
				{ ["index_type"]: eui.Group, ["name"]: "playerGroup", ["x"]: 0, ["y"]: 5, ["w"]: 570, ["h"]: 220 },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "pBg", ["parent"]: "playerGroup", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 570, ["h"]: 220, ["messageFlag"]: true },

				{ ["index_type"]: eui.Image, ["name"]: "playerIconBg", ["parent"]: "playerGroup", ["bAdapteWindow"]: true, ["image"]: "ty_renWuKuang01", ["x"]: 2, ["y"]: 18, ["w"]: 120, ["h"]: 120, ["messageFlag"]: true },
				{ ["index_type"]: eui.Image, ["name"]: "playerIcon", ["parent"]: "playerGroup", ["bAdapteWindow"]: true, ["image"]: "zctx_90001", ["x"]: 0, ["y"]: 18, ["w"]: 120, ["h"]: 120, ["messageFlag"]: true },

				{ ["index_type"]: gui.Grid9Image, ["name"]: "nameBg", ["parent"]: "playerGroup", ["image"]: "ty_textDi08", ["x"]: 120, ["y"]: 7, ["w"]: 175, ["h"]: 36, ["messageFlag"]: true },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "levelBg", ["parent"]: "playerGroup", ["image"]: "ty_textDi08", ["x"]: 120, ["y"]: 44, ["w"]: 175, ["h"]: 36, ["messageFlag"]: true },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "clubNameBg", ["parent"]: "playerGroup", ["image"]: "ty_textDi08", ["x"]: 120, ["y"]: 81, ["w"]: 175, ["h"]: 36, ["messageFlag"]: true },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "powerBg", ["parent"]: "playerGroup", ["image"]: "ty_textDi08", ["x"]: 120, ["y"]: 118, ["w"]: 175, ["h"]: 36, ["messageFlag"]: true },
				{ ["index_type"]: eui.Label, ["name"]: "name", ["parent"]: "playerGroup", ["title"]: "", ["font"]: "ht_20_lc", ["color"]: gui.Color.ublack, ["x"]: 125, ["y"]: 7, ["w"]: 175, ["h"]: 36 },
				{ ["index_type"]: eui.Label, ["name"]: "level", ["parent"]: "playerGroup", ["title"]: "", ["font"]: "ht_20_lc", ["color"]: gui.Color.ublack, ["x"]: 125, ["y"]: 44, ["w"]: 175, ["h"]: 36 },
				{ ["index_type"]: eui.Label, ["name"]: "clubName", ["parent"]: "playerGroup", ["title"]: "", ["font"]: "ht_18_lc", ["color"]: gui.Color.ublack, ["x"]: 125, ["y"]: 81, ["w"]: 175, ["h"]: 36 },
				{ ["index_type"]: eui.Label, ["name"]: "power", ["parent"]: "playerGroup", ["title"]: "", ["font"]: "ht_20_lc", ["color"]: gui.Color.darkgoldenrod, ["x"]: 125, ["y"]: 118, ["w"]: 175, ["h"]: 36 },

				{ ["index_type"]: gui.Grid9Image, ["name"]: "itemBg", ["parent"]: "playerGroup", ["image"]: "ty_textDi09", ["x"]: 300, ["y"]: 9, ["w"]: 260, ["h"]: 145 },
				{ ["index_type"]: gui.RichDisplayer, ["name"]: "kaicaiTime", ["parent"]: "playerGroup", ["x"]: 400, ["y"]: 44, ["w"]: 180, ["h"]: 35, ["messageFlag"]: true },
				{ ["index_type"]: gui.RichDisplayer, ["name"]: "protectTime", ["parent"]: "playerGroup", ["x"]: 400, ["y"]: 74, ["w"]: 180, ["h"]: 35, ["messageFlag"]: true },
				{ ["index_type"]: gui.Button, ["name"]: "robBtn", ["parent"]: "playerGroup", ["image"]: "ty_tongYongBt2", ["autoScale"]: true, ["title"]: Localize_cns("STRONGHOLD_TEXT6"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 426, ["y"]: 74, ["w"]: 100, ["h"]: 40, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRob },
				{ ["index_type"]: gui.Button, ["name"]: "cheliBtn", ["parent"]: "playerGroup", ["image"]: "ty_tongYongBt2", ["autoScale"]: true, ["title"]: Localize_cns("STRONGHOLD_TEXT8"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 426, ["y"]: 74, ["w"]: 100, ["h"]: 40, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCheli },

				{ ["index_type"]: gui.Grid9Image, ["name"]: "ratioBg", ["parent"]: "playerGroup", ["image"]: "ty_textDi08", ["x"]: 10, ["y"]: 160, ["w"]: 550, ["h"]: 50 },
				//{ ["index_type"]: gui.RichDisplayer, ["name"]: "ratioText", ["parent"]: "playerGroup", ["x"]: 20, ["y"]: 164, ["w"]: 530, ["h"]: 42, ["messageFlag"]: true },
				{ ["index_type"]: eui.Label, ["name"]: "ratioText", ["parent"]: "playerGroup", ["title"]: "", ["font"]: "ht_20_lc", ["color"]: gui.Color.indigo, ["x"]: 20, ["y"]: 164, ["w"]: 530, ["h"]: 42, ["messageFlag"]: true },

				{ ["index_type"]: eui.Group, ["name"]: "noPlayerGroup", ["x"]: 0, ["y"]: 5, ["w"]: 570, ["h"]: 220 },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "npBg", ["parent"]: "noPlayerGroup", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 570, ["h"]: 220, ["messageFlag"]: true },
				{ ["index_type"]: gui.RichDisplayer, ["name"]: "noPlayerTips", ["parent"]: "noPlayerGroup", ["x"]: 80, ["y"]: 80, ["w"]: 340, ["h"]: 60, ["messageFlag"]: true },
				{ ["index_type"]: gui.Button, ["name"]: "occupyBtn", ["parent"]: "noPlayerGroup", ["image"]: "ty_tongYongBt6", ["title"]: Localize_cns("STRONGHOLD_TEXT9"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 426, ["y"]: 90, ["w"]: 100, ["h"]: 40, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickOccupy },
			]
			UiUtil.createElem(mElemInfo, this, this.mElemList, this)

			this.mElemList["itemBox"] = UIItemBox.newObj(this, "itemBox", 312, 39, this.mElemList["playerGroup"])

			this.mElemList["noPlayerTips"].setAlignFlag(gui.Flag.CENTER_CENTER)
			AddRdContent(this.mElemList["noPlayerTips"], Localize_cns("STRONGHOLD_TEXT14"), "ht_22_cc", "ublack")
			// UiUtil.forTestDrawBg(this.mElemList["kaicaiTime"])
		}

		protected dataChanged(): void {
			let data = this.data
			let self = this.data.self
			let playerInfo = data[0] || []
			this.mElemList["playerGroup"].visible = false
			this.mElemList["noPlayerGroup"].visible = true

			if (size_t(playerInfo) != 0) {
				this.mElemList["noPlayerGroup"].visible = false
				this.mElemList["playerGroup"].visible = true

				this.mElemList["playerIcon"].source = GetProfessionIcon(playerInfo[2], playerInfo[3])
				this.mElemList["name"].text = playerInfo[1]
				this.mElemList["level"].text = Localize_cns("STRONGHOLD_TEXT21") + playerInfo[4]
				this.mElemList["clubName"].text = Localize_cns("STRONGHOLD_TEXT20") + (playerInfo[8] == "" ? Localize_cns("STRONGHOLD_TEXT12") : playerInfo[8])
				this.mElemList["power"].text = Localize_cns("STRONGHOLD_TEXT13") + playerInfo[6]

				let serverTime = GetServerTime()
				let _leftTime = data[2] + GameConfig.StrongholdConfig[self.strongholdIndex].pTime * 60
				let _hours = Math.floor(_leftTime / 3600)
				let _mins = Math.floor(_leftTime / 60) - _hours * 60
				let _secs = _leftTime - _hours * 3600 - _mins * 60
				let leftTime = _leftTime + (6 - _mins % 6) * 60 - _secs - serverTime//剩余开采时间
				if (leftTime <= 0) {
					AddRdContent(this.mElemList["kaicaiTime"], "", "ht_18_cc_stroke", "white")
				} else {
					AddRdContent(this.mElemList["kaicaiTime"], Localize_cns("STRONGHOLD_TEXT10") + "#space_10#lime" + getFormatDiffTime(leftTime), "ht_18_cc_stroke", "white")
				}

				this.mElemList["robBtn"].visible = false
				this.mElemList["cheliBtn"].visible = false
				this.mElemList["protectTime"].visible = true
				if (serverTime - data[2] < GameConfig.StrongholdConfig[self.strongholdIndex].protect) {
					let ptime = data[2] + GameConfig.StrongholdConfig[self.strongholdIndex].protect - serverTime//剩余保护时间
					AddRdContent(this.mElemList["protectTime"], Localize_cns("STRONGHOLD_TEXT7") + "#space_10 " + getFormatDiffTime(ptime), "ht_18_cc_stroke", "yellow")
				} else {
					this.mElemList["protectTime"].visible = false
					if (playerInfo[0] != GetHeroProperty("id")) {
						this.mElemList["cheliBtn"].visible = false
						this.mElemList["robBtn"].visible = true
					}
				}
				if (playerInfo[0] == GetHeroProperty("id")) {
					this.mElemList["protectTime"].visible = false
					this.mElemList["robBtn"].visible = false
					this.mElemList["cheliBtn"].visible = true
				}

				let stype = GameConfig.StrongholdConfig[self.strongholdIndex].stype
				let baseVal = GameConfig.StrongholdItemConfig[1].efficiency[stype]//默认基础值
				if (size_t(data[1]) != 0) {
					baseVal = data[1][1]
				}
				let levelRatio = 0//等级加成
				for (let _ in StrongholdConfig.levelRatio) {
					let _v = StrongholdConfig.levelRatio[_]
					if (playerInfo[4] >= _v.min && playerInfo[4] <= _v.max) {
						levelRatio = _v.ratio
						break
					}
				}
				let vipRatio = 0//vip加成
				if (playerInfo[0] == GetHeroProperty("id")) {
					let vipRatioConfig = StrongholdConfig.vipRatio[stype]
					for (let _ in vipRatioConfig) {
						let _v = vipRatioConfig[_]
						if (playerInfo[5] >= _v.min && playerInfo[5] <= _v.max) {
							vipRatio = _v.ratio
							break
						}
					}
				}
				let facRatio = StrongholdConfig.facRatio[stype] * data.sameMemberNum//公会加成

				let maxUsedTime = GameConfig.StrongholdConfig[self.strongholdIndex].pTime * 60
				let usedTime = serverTime - data[2] > maxUsedTime ? maxUsedTime : serverTime - data[2]
				let curVal = baseVal * (usedTime / 60) * (1 + levelRatio + vipRatio + facRatio)
				let finalVal = baseVal * (maxUsedTime / 60) * (1 + levelRatio + vipRatio + facRatio)

				let itemEntryId = size_t(data[1]) == 0 ? GameConfig.StrongholdItemConfig[1].entryId : data[1][0]
				this.mElemList["itemBox"].updateByEntry(itemEntryId, Math.floor(curVal))

				let vipRatioText = vipRatio > 0 ? String.format(Localize_cns("STRONGHOLD_TEXT24"), playerInfo[5], Math.floor(vipRatio * 100)) : ""
				let facRatioText = facRatio > 0 ? String.format(Localize_cns("STRONGHOLD_TEXT25"), Math.floor(facRatio * 100)) : ""
				let itemName = ItemSystem.getInstance().getItemName(itemEntryId)
				let str = String.format(Localize_cns("STRONGHOLD_TEXT23"), itemName, Math.floor(finalVal))

				if (vipRatioText != "") {
					str += "（" + vipRatioText
					if (facRatioText != "") {
						str += "，" + facRatioText + "）"
					} else {
						str += "）"
					}
				} else {
					if (facRatioText != "") {
						str += "（" + facRatioText + "）"
					}
				}
				//AddRdContent(this.mElemList["ratioText"], Localize_cns("STRONGHOLD_TEXT11") + "#br" + str, "ht_20_cc", "indigo")
				this.mElemList["ratioText"].text = str

				this.nameToInfo[data.index] = [itemName, curVal, playerInfo[7]]
			}
		}

		onClickRob(args: egret.Event) {
			let data = this.data
			let self = data.self
			let index = data.index

			let robCount = StrongholdConfig.robCount - (getSaveRecord(opSaveRecordKey.strongholdRobCount) || 0)
			if (robCount <= 0) {
				return MsgSystem.addTagTips(Localize_cns("STRONGHOLD_TEXT26"))
			}

			let itemName = this.nameToInfo[data.index][0]
			let curVal = this.nameToInfo[data.index][1]
			let clubId = this.nameToInfo[data.index][2]

			if (curVal > 0) {
				let str = String.format(Localize_cns("STRONGHOLD_TEXT48"), itemName, Math.floor(curVal * StrongholdConfig.robRatio))
				if (clubId > 0 && clubId == GetHeroProperty("faction")) {
					str += Localize_cns("STRONGHOLD_TEXT49")
				}
				let t: IDialogCallback = {
					onDialogCallback(result: boolean, userData): void {
						if (result == true) {
							RpcProxy.call("C2G_StrongholdOccupy", self.strongholdIndex, index, 2, 0)
						}
					}
				}
				MsgSystem.confirmDialog(str + Localize_cns("STRONGHOLD_TEXT52"), t)
				return
			}
			RpcProxy.call("C2G_StrongholdOccupy", self.strongholdIndex, index, 2, 0)
		}

		onClickCheli(args: egret.Event) {
			let self = this.data.self
			let index = this.data.index
			let t: IDialogCallback = {
				onDialogCallback(result: boolean, userData): void {
					if (result == true) {
						RpcProxy.call("C2G_StrongholdEvacuate", self.strongholdIndex, index)
					}
				}
			}
			MsgSystem.confirmDialog(Localize_cns("STRONGHOLD_TEXT22") + Localize_cns("STRONGHOLD_TEXT52"), t)
		}

		onClickOccupy(args: egret.Event) {
			let occupyCount = StrongholdConfig.occupyCount - (getSaveRecord(opSaveRecordKey.strongholdCount) || 0)
			if (occupyCount <= 0) {
				return MsgSystem.addTagTips(Localize_cns("STRONGHOLD_TEXT32"))
			}
			let self = this.data.self
			let index = this.data.index
			let wnd = WngMrg.getInstance().getWindow("StrongholdResChooseFrame")
			wnd.showWithIndex(self.strongholdIndex, index)
		}
	}
}