// TypeScript file
class Wonder_PetClearWnd extends BaseCtrlWnd {
	name: string;
	mLayoutPath: any;

	activityIndex

	public initObj(...params: any[]) {
		this.name = params[2]
		this.mLayoutPath = params[3]
		this.activityIndex = PayActivityIndex.PET_WASH
	}

	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mElemList["group_wnd"])

		let list: eui.List = this.mElemList[this.name + "scroll"]
		list.itemRenderer = itemRender.WonderPetWashItem

		let linkview: UILinkView = UILinkView.newObj(this.mLayoutNode, "link_view", 0, 0, this.mElemList[this.name + "link_wnd"])
		linkview.setContent(Localize_cns("WONDER_WASH_TXT1"))
		linkview.setCallBack(this.onClickLink, this)

		AddRdContent(this.mElemList[this.name + "wash_tips"], Localize_cns("WONDER_WASH_TXT4"), "ht_20_cc", "ublack")
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mElemList[this.name].visible = true
		this.onRefresh()
	}

	public onHide(): void {
		this.mElemList[this.name].visible = false
	}

	onRefresh() {
		let dataInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex) || {}
		let dataConfig = GameConfig.SkillWashActivityConfig
		let dataList = []
		for (let i in dataConfig) {
			let data = dataConfig[i]
			data.self = this
			table_insert(dataList, data)
		}
		table_sort(dataList, function (a, b) {
			let prizeInfo = dataInfo[0] || {}
			let prizeA = prizeInfo[a.washNum] || 0
			let prizeB = prizeInfo[b.washNum] || 0
			if (prizeA == prizeB) {
				return a.washNum - b.washNum
			} else {
				let t = { [0]: 2, [1]: 1, [2]: 3 }
				return t[prizeA] - t[prizeB]
			}
		})

		let list: eui.List = this.mElemList[this.name + "scroll"]
		UiUtil.updateList(list, dataList)

		this.updateWnd()
	}

	updateWnd() {
		let actInfo = ActivitySystem.getInstance().getOperateActivityInfo(this.activityIndex) || []
		let dataInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex) || {}

		let diffTime = actInfo[0] || 0
		if (diffTime > 0) {
			diffTime = diffTime - GetServerTime()
		}
		let timeObj = simple_transform_time1(diffTime)
		let str = String.format(Localize_cns("WONDER_SHOP_TXT2"), timeObj.day, timeObj.hours, timeObj.mins)
		let record = dataInfo[1] || 0
		str = str + "#space" + String.format(Localize_cns("WONDER_WASH_TXT2"), record)

		AddRdContent(this.mElemList[this.name + "time_rd"], str, "ht_20_lc_stroke", "lime")
	}

	onClickLink() {
		let wnd = WngMrg.getInstance().getWindow("PetFrame")
		wnd.showWithIndex(1)
	}
}

module itemRender {
	export class WonderPetWashItem extends eui.ItemRenderer {
		mElemList: any;
		constructor() {
			super();
			this.mElemList = {}

			let mElemInfo = [
				{ ["index_type"]: eui.Group, ["name"]: "group", ["x"]: 0, ["y"]: 0, ["w"]: 550, ["h"]: 155 },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["parent"]: "group", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 550, ["h"]: 150 },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "title_bg", ["parent"]: "group", ["image"]: "fldt_biaoTiDi01", ["x"]: 10, ["y"]: 8, ["w"]: 336, ["h"]: 32 },
				{ ["index_type"]: eui.Label, ["name"]: "title", ["parent"]: "title_bg", ["title"]: "", ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 2, ["w"]: 336, ["h"]: 30 },
				{ ["index_type"]: gui.Button, ["name"]: "get_btn", ["parent"]: "group", ["title"]: Localize_cns("ACTIVITY_PAY_TXT6"), ["font"]: "ht_22_cc_stroke", ["color"]: gui.Color.white, ["image"]: "ty_tongYongBt3", ["x"]: 400, ["y"]: 70, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGet },
				{ ["index_type"]: eui.Label, ["name"]: "state_txt", ["parent"]: "group", ["title"]: Localize_cns("INVEST_TXT5"), ["font"]: "ht_26_cc", ["color"]: gui.Color.saddlebrown, ["x"]: 400, ["y"]: 70, ["w"]: 117, ["h"]: 30, ["messageFlag"]: true },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "lq_icon", ["parent"]: "group", ["image"]: "bh_text02", ["x"]: 400, ["y"]: 70, ["w"]: 120, ["h"]: 39, ["messageFlag"]: true},
				{ ["index_type"]: gui.Grid9Image, ["name"]: "point", ["parent"]: "get_btn", ["image"]: "zjm_hongDian01", ["x"]: 77, ["y"]: 0, ["w"]: 40, ["h"]: 40, ["messageFlag"]: true }
			]
			UiUtil.createElem(mElemInfo, this, this.mElemList, this)

			for (let i = 0; i < 4; i++) {
				this.mElemList["itemBox" + i] = UIItemBox.newObj(this, "itemBox" + i, 10 + 90 * i, 52, this.mElemList["group"])
				this.mElemList["itemBox" + i].setVisible(false)
			}

			this.mElemList["point"].visible = false

			this.mElemList["get_btn"].visible = false
			this.mElemList["state_txt"].visible = false
			this.mElemList["lq_icon"].visible = false
		}

		protected dataChanged(): void {
			let self = this.data.self
			let itemList = AnalyPrizeFormat(this.data.prize)
			let limit = this.data.washNum

			let dataInfo = ActivitySystem.getInstance().getOperatePlayerInfo(self.activityIndex) || {}
			let prizeInfo = dataInfo[0] || {}
			let record = dataInfo[1] || 0
			let isGet = prizeInfo[this.data.washNum] || 0

			for (let i = 0; i < 4; i++) {
				if (itemList[i]) {
					let itemId = itemList[i][0]
					let itemCount = itemList[i][1]
					this.mElemList["itemBox" + i].updateByEntry(itemId, itemCount)
					this.mElemList["itemBox" + i].setVisible(true)
				} else {
					this.mElemList["itemBox" + i].setVisible(false)
				}
			}

			this.mElemList["title"].text = String.format(Localize_cns("WONDER_WASH_TXT3"), limit)

			//0未达成 1可以领取 2已经领取
			this.mElemList["point"].visible = false
			this.mElemList["get_btn"].visible = false
			this.mElemList["state_txt"].visible = false
			this.mElemList["lq_icon"].visible = false
			if (isGet == 0) {
				this.mElemList["state_txt"].visible = true
			} else if (isGet == 1) {
				this.mElemList["get_btn"].visible = true

				this.mElemList["point"].visible = true
			} else if (isGet == 2) {
				this.mElemList["lq_icon"].visible = true
			} else {
				
			}
		}

		onClickGet() {
			let self = this.data.self
			let limit = this.data.washNum
			let dataInfo = ActivitySystem.getInstance().getOperatePlayerInfo(self.activityIndex) || {}
			let prizeInfo = dataInfo[0] || {}
			let record = dataInfo[1] || 0
			let isGet = prizeInfo[this.data.washNum] || 0

			if (isGet != 1) {
				return
			}
			RpcProxy.call("C2G_GetOperateActivityPrize", self.activityIndex, [this.data.washNum])
		}
	}
}