// TypeScript file
class ClubActive_PrizeWnd extends BaseCtrlWnd {
	mElemList;
	scroll: UIScrollList;
	list: any[];

	public initObj(...params: any[]) {

	}

	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList

		let group = <eui.Group>this.mElemList["prize_wnd"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "prize_scroll", 10, 5, group.width - 20, group.height - 10, group)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		this.mElemList["prize_wnd"].visible = true
		this.refreshFrame()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		this.mElemList["prize_wnd"].visible = false
	}

	refreshFrame() {
		let prizeCfgList = []
		let prizeConfig = GameConfig.FactionActiveDailyiPrizeConfig
		for (let k in prizeConfig) {
			let config = prizeConfig[k]
			prizeCfgList.push(config)
		}

		prizeCfgList.sort(function (a, b) {
			let dailyExp = getSaveRecord(opSaveRecordKey.facDailyActiveExp) || 0 //每日活跃经验
			let prizeRecord = getSaveRecord(opSaveRecordKey.facDailyActivePrize) || {}

			let AState = 1
			if (dailyExp < a.dailyExp) { //未达成
				AState = 1
			} else if (prizeRecord[a.ID] == null) { //已达成，未领取
				AState = 0
			} else {
				AState = 2
			}

			let BState = 1
			if (dailyExp < b.dailyExp) { //未达成
				BState = 1
			} else if (prizeRecord[b.ID] == null) { //已达成，未领取
				BState = 0
			} else {
				BState = 2
			}

			if (AState == BState) {
				return a.dailyExp - b.dailyExp
			} else {
				return AState - BState
			}
		})

		this.scroll.clearItemList()
		this.list = prizeCfgList

		let group = <eui.Group>this.mElemList["prize_wnd"]
		for (let i = 0; i < size_t(prizeCfgList); i++) {
			let v = prizeCfgList[i]
			let [window, flag] = this.scroll.getItemWindow(i, group.width - 20, 130, 0, 0, 0)
			if (flag == true) {
				this.initItemWindow(window)
			}
			this.refreshItemWindow(window, v)
		}
	}

	initItemWindow(window) {
		let name = window.name
		let w = window.width
		let h = window.height
		let Info = [
			{ ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h },
			{ ["index_type"]: gui.RichDisplayer, ["name"]: name + "_rd", ["x"]: 10, ["y"]: 10, ["w"]: 400, ["h"]: 30 },
			{ ["index_type"]: gui.Grid9Image, ["name"]: name + "_lq_icon", ["image"]: "bh_text02", ["x"]: 400, ["y"]: 45, ["w"]: 120, ["h"]: 39 },
			{ ["index_type"]: eui.Label, ["name"]: name + "_wdc_lb", ["title"]: Localize_cns("CLUB_TXT51"), ["font"]: "ht_30_cc", ["color"]: gui.Color.saddlebrown, ["x"]: 390, ["y"]: 50, ["w"]: 120, ["h"]: 30 },
			{ ["index_type"]: gui.Button, ["name"]: name + "_lq_btn", ["title"]: Localize_cns("CLUB_TXT50"), ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt1", ["color"]: gui.Color.white, ["x"]: 380, ["y"]: 40, ["w"]: 147, ["h"]: 55, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGet },
		]
		UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)

		for (let i = 0; i < 4; i++) {
			this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mElemList, name + "itemBox" + i, 10 + 86 * i, 45, window)
		}

		this.mElemList[name + "_lq_icon"].visible = false
		this.mElemList[name + "_wdc_lb"].visible = false
		this.mElemList[name + "_lq_btn"].visible = false
	}

	refreshItemWindow(window, config) {
		let name = window.name

		for (let i = 0; i < 4; i++) {
			let itemBox: UIItemBox = this.mElemList[name + "itemBox" + i]
			if (config.prize[i]) {
				let prize = AnalyPrizeFormat(config.prize)[i]
				itemBox.setVisible(true)
				itemBox.updateByEntry(prize[0], prize[1])
			} else {
				itemBox.setVisible(false)
			}
		}

		let dailyExp = getSaveRecord(opSaveRecordKey.facDailyActiveExp) || 0 //每日活跃经验
		let prizeRecord = getSaveRecord(opSaveRecordKey.facDailyActivePrize) || {}

		if (dailyExp < config.dailyExp) { //未达成
			this.mElemList[name + "_lq_icon"].visible = false
			this.mElemList[name + "_wdc_lb"].visible = true
			this.mElemList[name + "_lq_btn"].visible = false

		} else if (prizeRecord[config.ID] == null) { //已达成，未领取
			this.mElemList[name + "_lq_icon"].visible = false
			this.mElemList[name + "_wdc_lb"].visible = false
			this.mElemList[name + "_lq_btn"].visible = true
		} else {//已达成，已领取
			this.mElemList[name + "_lq_icon"].visible = true
			this.mElemList[name + "_wdc_lb"].visible = false
			this.mElemList[name + "_lq_btn"].visible = false
		}

		let str = String.format(Localize_cns("CLUB_TXT68"), config.dailyExp, dailyExp, config.dailyExp)
		AddRdContent(this.mElemList[name + "_rd"], str, "ht_24_cc", "ublack")
	}

	onClickGet(event: egret.TouchEvent) {
		let name = event.target.name
		let index = name.replace(/[^0-9]/ig, "")
		if (this.list[index] && this.list[index].ID) {
			RpcProxy.call("C2G_FactionPlayerDailyActivePrize", this.list[index].ID)
		}
	}

	//红点提示
	refreshDotTips() {
		for (let i in GameConfig.FactionActiveDailyiPrizeConfig) {
			if (GuideFuncSystem.getInstance().checkClubActivePrize(i)) {
				let group = <eui.Group>this.mElemList["prize_wnd"]
				let [window, flag] = this.scroll.getItemWindow(tonumber(i) - 100, group.width - 20, 130, 0, 0, 0)
				this.mParentWnd.createDotTipsUI(this.mElemList[window.name + "_lq_btn"])
			}
		}
	}
}