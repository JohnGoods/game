class CampaignSingleWindow extends BaseCtrlWnd {
	record: any;
	firstRecord: any;
	timer: number;

	public initObj(...params: any[]) {

	}

	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList

		let list: eui.List = this.mElemList["single_scroll"]
		list.itemRenderer = itemRender.CampaignSingleItem

		let rd: gui.RichDisplayer = this.mElemList["my_pass_time"]
		rd.setAlignFlag(gui.Flag.RIGHT)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.EXCITE_LIMIT_CAMPAIGN, this.onRefresh, this)
		this.mElemList["single_group"].visible = true
		this.sendRequest()
		this.onRefresh()

		let scroller: gui.Scroller = this.mElemList["single_scroller"]
		scroller.viewport.scrollV = 0
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.EXCITE_LIMIT_CAMPAIGN, this.onRefresh, this)
		this.mElemList["single_group"].visible = false

		if (this.timer) {
			KillTimer(this.timer)
			this.timer = null
		}
	}

	sendRequest() {
		RpcProxy.call("C2G_ExciteData", "campaignSingle")

		RpcProxy.call("C2G_ExciteData", "campaignFirst")
	}

	onRefresh() {
		this.record = CampaignSystem.getInstance().getLimitPassData() || {}
		this.firstRecord = CampaignSystem.getInstance().getFirstPassData() || {}

		var rd: gui.RichDisplayer = this.mElemList["my_pass_time"]
		let time = 7 * 24 * 3600 - (GetServerTime() - GetServerOpenTime())
		AddRdContent(rd, Localize_cns("CAMPAIGN_TXT33") + getFormatDiffTime(time), "ht_20_cc_stroke", "white")

		var rd: gui.RichDisplayer = this.mElemList["my_pass_rd0"]
		let campaignId = CampaignSystem.getInstance().getCurOpenCampaign()
		let campaignName = CampaignSystem.getInstance().getCampaignName(campaignId)
		AddRdContent(rd, Localize_cns("CAMPAIGN_TXT21") + "#lime" + campaignName, "ht_20_cc_stroke", "white")

		let configList = CampaignSystem.getInstance().getSinglePassConfig()

		table_sort(configList, function (a, b) {

			let stateA = 1
			let stateB = 1
			//0不可领取, 1可以领取, 2特殊奖励可领取 3已经领取
			let record1 = CampaignSystem.getInstance().getLimitPassData() || {}
			let infoA = record1[a.campaignId] || []
			let infoB = record1[b.campaignId] || []

			let record2 = CampaignSystem.getInstance().getFirstPassData() || {}
			let linQuA = record2[a.campaignId] || 0
			let linQuB = record2[b.campaignId] || 0

			if (infoA[0] == 3 && CampaignSystem.getInstance().getCurOpenCampaign() >= a.campaignId && linQuA == 3) {
				stateA = 0
			} else if (infoA[0] == 0 && infoA[1] <= GetServerTime() && linQuA == 3) {
				stateA = 0
			}

			if (infoB[0] == 3 && CampaignSystem.getInstance().getCurOpenCampaign() >= b.campaignId && linQuB == 3) {
				stateB = 0
			} else if (infoB[0] == 0 && infoB[1] <= GetServerTime() && linQuB == 3) {
				stateB = 0
			}

			if (infoA[0] == 0 && infoA[1] <= GetServerTime() && CampaignSystem.getInstance().getCurOpenCampaign() >= a.campaignId && linQuA == 0) {
				stateA = 0
			}

			if (infoB[0] == 0 && infoB[1] <= GetServerTime() && CampaignSystem.getInstance().getCurOpenCampaign() >= b.campaignId && linQuB == 0) {
				stateB = 0
			}

			if (infoA[0] == 0 && infoA[1] <= GetServerTime() && linQuA == 3) {
				stateA = 0
			}

			if (infoB[0] == 0 && infoB[1] <= GetServerTime() && linQuB == 3) {
				stateB = 0
			}

			if (stateB == stateA) {
				return a.campaignId - b.campaignId
			} else {
				return stateB - stateA
			}
		})

		let dataList = []
		for (let i in configList) {
			let t: any = {}
			t.data = configList[i]
			t.self = this
			table_insert(dataList, t)
		}

		let list: eui.List = this.mElemList["single_scroll"]
		UiUtil.updateList(list, dataList)

		if (this.timer) {
			KillTimer(this.timer)
			this.timer = null
		}

		let callback = function () {
			this.onRefresh()
		}
		this.timer = SetTimer(callback, this, 1000, false)
	}
}

module itemRender {
	export class CampaignSingleItem extends eui.ItemRenderer {
		mElemList: any;
		constructor() {
			super();
			this.mElemList = {}

			let mElemInfo = [
				{ ["index_type"]: eui.Group, ["name"]: "group", ["x"]: 0, ["y"]: 0, ["w"]: 555, ["h"]: 280 },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["parent"]: "group", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 555, ["h"]: 275, ["messageFlag"]: true },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "title_bg", ["parent"]: "group", ["image"]: "fldt_biaoTiDi01", ["x"]: 10, ["y"]: 6, ["w"]: 410, ["h"]: 32, ["messageFlag"]: true },
				{ ["index_type"]: gui.RichDisplayer, ["name"]: "title_rd", ["parent"]: "group", ["x"]: 10, ["y"]: 12, ["w"]: 410, ["h"]: 30 },

				//倒计时
				{ ["index_type"]: eui.Group, ["name"]: "time_group", ["x"]: 430, ["y"]: 43, ["w"]: 108, ["h"]: 80 },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "time_bg", ["parent"]: "time_group", ["image"]: "ty_textDi09", ["x"]: 0, ["y"]: 0, ["w"]: 108, ["h"]: 80 },
				{ ["index_type"]: eui.Label, ["name"]: "time_txt", ["parent"]: "time_group", ["title"]: Localize_cns("CAMPAIGN_TXT22"), ["font"]: "ht_22_cc", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 10, ["w"]: 108, ["h"]: 30 },
				{ ["index_type"]: gui.BatchImage, ["name"]: "time_batch", ["parent"]: "time_group", ["x"]: 0, ["y"]: 42, ["w"]: 108, ["h"]: 30 },

				{ ["index_type"]: eui.Label, ["name"]: "pass_num", ["parent"]: "time_group", ["title"]: "", ["font"]: "ht_20_cc", ["color"]: gui.Color.ublack, ["x"]: -20, ["y"]: -30, ["w"]: 148, ["h"]: 30, ["messageFlag"]: true },

				//已领取
				{ ["index_type"]: gui.Grid9Image, ["name"]: "time_icon", ["parent"]: "group", ["image"]: "gk_yiDaCheng", ["x"]: 430, ["y"]: 43, ["w"]: 109, ["h"]: 75 },

				//可领取
				{ ["index_type"]: gui.Button, ["name"]: "get_btn", ["parent"]: "group", ["image"]: "ty_tongYongBt16", ["title"]: Localize_cns("ACTIVITY_PAY_TXT6"), ["font"]: "ht_22_cc_stroke", ["color"]: gui.Color.white, ["x"]: 427, ["y"]: 60, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGet },

				{ ["index_type"]: gui.Grid9Image, ["name"]: "dot1", ["parent"]: "get_btn", ["image"]: "zjm_hongDian01", ["x"]: 77, ["y"]: 0, ["w"]: 40, ["h"]: 40, ["messageFlag"]: "true" },

				//////////////////////////////////////个人首通
				{ ["index_type"]: gui.Grid9Image, ["name"]: "first_title_bg", ["parent"]: "group", ["image"]: "fldt_biaoTiDi01", ["x"]: 10, ["y"]: 133, ["w"]: 200, ["h"]: 32, ["messageFlag"]: true },
				{ ["index_type"]: eui.Label, ["name"]: "first_title", ["parent"]: "group", ["title"]: Localize_cns("CAMPAIGN_TXT20"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 135, ["w"]: 180, ["h"]: 30 },

				//未达成
				{ ["index_type"]: eui.Label, ["name"]: "first_not_txt", ["parent"]: "group", ["title"]: Localize_cns("ACTIVITY_PAY_TXT70"), ["font"]: "ht_24_cc", ["color"]: gui.Color.saddlebrown, ["x"]: 427, ["y"]: 200, ["w"]: 117, ["h"]: 30 },

				//已领取
				{ ["index_type"]: gui.Grid9Image, ["name"]: "first_time_icon", ["parent"]: "group", ["image"]: "gk_yiDaCheng", ["x"]: 430, ["y"]: 173, ["w"]: 109, ["h"]: 75 },

				//可领取
				{ ["index_type"]: gui.Button, ["name"]: "first_get_btn", ["parent"]: "group", ["image"]: "ty_tongYongBt16", ["title"]: Localize_cns("ACTIVITY_PAY_TXT6"), ["font"]: "ht_22_cc_stroke", ["color"]: gui.Color.white, ["x"]: 427, ["y"]: 190, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickLinQu },

				{ ["index_type"]: gui.Grid9Image, ["name"]: "dot2", ["parent"]: "first_get_btn", ["image"]: "zjm_hongDian01", ["x"]: 77, ["y"]: 0, ["w"]: 40, ["h"]: 40, ["messageFlag"]: "true" },
			]
			UiUtil.createElem(mElemInfo, this, this.mElemList, this)

			for (let i = 0; i < 5; i++) {
				this.mElemList["itemBox" + i] = UIItemBox.newObj(this, "itemBox" + i, 10 + 82 * i, 43, this.mElemList["group"])
				this.mElemList["itemBox" + i].setVisible(false)
			}

			for (let i = 0; i < 5; i++) {
				this.mElemList["firstItemBox" + i] = UIItemBox.newObj(this, "firstItemBox" + i, 10 + 82 * i, 172, this.mElemList["group"])
				this.mElemList["firstItemBox" + i].setVisible(false)
			}

			// mElemInfo = [ //额外奖励文字
			// 	{ ["index_type"]: gui.Grid9Image, ["name"]: "exp_icon", ["parent"]: "group", ["image"]: "gk_eiWaiJiangLi", ["x"]: 10 + 82 * 4, ["y"]: 40, ["w"]: 82, ["h"]: 24, ["messageFlag"]: true },
			// ]
			// UiUtil.createElem(mElemInfo, this, this.mElemList, this)

			this.mElemList["time_group"].visible = false
			this.mElemList["time_icon"].visible = false
			this.mElemList["get_btn"].visible = false

			this.mElemList["dot1"].visible = false
			this.mElemList["dot2"].visible = false

			this.mElemList["first_not_txt"].visible = false
			this.mElemList["first_time_icon"].visible = false
			this.mElemList["first_get_btn"].visible = false

			this.mElemList["title_rd"].setAlignFlag(gui.Flag.H_CENTER)
		}

		protected dataChanged(): void {
			let config = this.data.data
			let self = this.data.self

			this.mElemList["time_group"].visible = false
			this.mElemList["time_icon"].visible = false
			this.mElemList["get_btn"].visible = false

			this.mElemList["dot1"].visible = false

			this.mElemList["dot2"].visible = false

			this.mElemList["time_batch"].visible = true

			this.mElemList["pass_num"].text = ""

			UiUtil.setXY(this.mElemList["time_txt"], 0, 10)

			let str = ""
			// var timeObj = simple_transform_time(config.limitTime)
			// if (timeObj.hours > 0) {
			// 	str = str + timeObj.hours + Localize_cns("CAMPAIGN_TXT23")
			// }
			// if (timeObj.mins > 0) {
			// 	str = str + timeObj.mins + Localize_cns("CAMPAIGN_TXT24")
			// }
			// if (timeObj.secs > 0) {
			// 	str = str + timeObj.secs + Localize_cns("CAMPAIGN_TXT27")
			// }

			//str = "#lime" + str + "#white" + String.format(Localize_cns("CAMPAIGN_TXT25"), CampaignSystem.getInstance().getCampaignName(config.campaignId))
			str = String.format(Localize_cns("CAMPAIGN_TXT30"), config.rank, CampaignSystem.getInstance().getCampaignName(config.campaignId))
			let rd: gui.RichDisplayer = this.mElemList["title_rd"]
			AddRdContent(rd, str, "ht_20_cc_stroke", "white")

			let itemList = AnalyPrizeFormat(config.prize)
			//table_insert(itemList, AnalyPrizeFormat(config.expPrize)[0])
			for (let i = 0; i < 5; i++) {
				if (itemList[i]) {
					this.mElemList["itemBox" + i].updateByEntry(itemList[i][0], itemList[i][1])
					this.mElemList["itemBox" + i].setVisible(true)
				} else {
					this.mElemList["itemBox" + i].setVisible(false)
				}
			}

			itemList = AnalyPrizeFormat(config.passPrize)
			for (let i = 0; i < 5; i++) {
				if (itemList[i]) {
					this.mElemList["firstItemBox" + i].updateByEntry(itemList[i][0], itemList[i][1])
					this.mElemList["firstItemBox" + i].setVisible(true)
				} else {
					this.mElemList["firstItemBox" + i].setVisible(false)
				}
			}

			//0不可领取, 1可以领取, 2特殊奖励可领取 3已经领取
			let info = self.record[config.campaignId] || []
			let isGet = info[0] || 0
			if (isGet == 0) {
				this.mElemList["time_group"].visible = true

				let endTime = info[1] || (config.limitTime + RoleSystem.getInstance().getRoleCreateTime()) //结束时间
				if (endTime > GetServerTime()) {
					endTime = endTime - GetServerTime()
					this.mElemList["time_txt"].text = Localize_cns("CAMPAIGN_TXT22")
				} else {
					endTime = 0 //已经结束
					this.mElemList["time_txt"].text = Localize_cns("ACTIVITY_PAY_TXT70")
					this.mElemList["time_batch"].visible = false
					UiUtil.setXY(this.mElemList["time_txt"], 0, 27)

					this.mElemList["first_not_txt"].visible = false
					this.mElemList["first_time_icon"].visible = false
					this.mElemList["first_get_btn"].visible = false

					//个人首通
					//0不可领取, 1可以领取, 2特殊奖励可领取 3已经领取
					let isLinQu = self.firstRecord[config.campaignId] || 0
					if (isLinQu == 0) {
						this.mElemList["first_not_txt"].visible = true
					} else if (isLinQu == 1 || isLinQu == 2) {
						this.mElemList["first_get_btn"].visible = true
						this.mElemList["dot2"].visible = true
					} else if (isLinQu == 3) {
						this.mElemList["first_time_icon"].visible = true
					}

					return
				}

				var timeObj = simple_transform_time(endTime)
				let timeStr = String.format("%02d", timeObj.mins) + "m" + String.format("%02d", timeObj.secs)
				if (timeObj.hours > 0) {
					timeStr = timeObj.hours + "m" + String.format("%02d", timeObj.mins) + "m" + String.format("%02d", timeObj.secs)
				}

				DrawNumberStringImage(this.mElemList["time_batch"], "daZhanLi02_", timeStr, 0, 0, 0)

				//显示已经通过的人数
				let passNum = info[2] || 0
				if (passNum > 35 && passNum <= 70) {
					passNum = 35 + Math.ceil((passNum - 35) / 5)
				} else if (passNum > 70 && passNum <= 130) {
					passNum = 42 + Math.ceil((passNum - 70) / 10)
				} else if (passNum > 130) {
					passNum = 48
				}
				this.mElemList["pass_num"].text = Localize_cns("CAMPAIGN_TXT31") + passNum

			} else if (isGet == 1 || isGet == 2) {
				this.mElemList["get_btn"].visible = true
				this.mElemList["dot1"].visible = true
			} else if (isGet == 3) {
				this.mElemList["time_icon"].visible = true
			}

			this.mElemList["first_not_txt"].visible = false
			this.mElemList["first_time_icon"].visible = false
			this.mElemList["first_get_btn"].visible = false

			//个人首通
			//0不可领取, 1可以领取, 2特殊奖励可领取 3已经领取
			let isLinQu = self.firstRecord[config.campaignId] || 0
			if (isLinQu == 0) {
				this.mElemList["first_not_txt"].visible = true
			} else if (isLinQu == 1 || isLinQu == 2) {
				this.mElemList["first_get_btn"].visible = true
				this.mElemList["dot2"].visible = true
			} else if (isLinQu == 3) {
				this.mElemList["first_time_icon"].visible = true
			}
		}

		onClickGet() {
			let config = this.data.data
			let self = this.data.self

			RpcProxy.call("C2G_ExciteGetPrize", "campaignSingle", config.campaignId)
		}

		onClickLinQu() {
			let config = this.data.data
			let self = this.data.self

			RpcProxy.call("C2G_ExciteGetPrize", "campaignFirst", config.campaignId)
		}
	}
}