// TypeScript file
class Wonder_MysteryShopWnd extends BaseCtrlWnd {
	name: string;
	mLayoutPath: any;

	activityIndex

	public initObj(...params: any[]) {
		this.name = params[2]
		this.mLayoutPath = params[3]
		this.activityIndex = PayActivityIndex.SHOP_MIRACULOUS
	}

	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mElemList["group_wnd"])

		let list: eui.List = this.mElemList[this.name + "scroll"]
		list.itemRenderer = itemRender.WonderMysteryShopItem

		this.mElemList[this.name + "reset_time"].textColor = gui.Color.green
		this.mElemList[this.name + "reset_tips"].textColor = gui.Color.green
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mElemList[this.name].visible = true
		this.onRefresh()
		this.updateWnd()
	}

	public onHide(): void {
		this.mElemList[this.name].visible = false
	}

	onRefresh() {
		let actInfo = ActivitySystem.getInstance().getOperateActivityInfo(this.activityIndex) || []
		let day = actInfo[1]
		let dataConfig = GameConfig.ShopsplendidConfig[day]
		let dataList = []
		let count = 0
		let t: any[] = []
		for (let i in dataConfig) {
			let data = dataConfig[i]
			data.self = this
			if (count == 2) {
				table_insert(t, data)
				table_insert(dataList, t)
				count = 0
				t = []
			} else {
				table_insert(t, data)
				count = count + 1
			}
		}
		if (size_t(t) > 0) {
			table_insert(dataList, t)
		}

		let list: eui.List = this.mElemList[this.name + "scroll"]
		UiUtil.updateList(list, dataList)
	}

	updateWnd() {
		let actInfo = ActivitySystem.getInstance().getOperateActivityInfo(this.activityIndex) || []
		let diffTime = actInfo[0] || 0
		if (diffTime > 0) {
			diffTime = diffTime - GetServerTime()
		}
		let timeObj = simple_transform_time1(diffTime)
		this.mElemList[this.name + "reset_time"].text = String.format(Localize_cns("WONDER_SHOP_TXT2"), timeObj.day, timeObj.hours, timeObj.mins)
	}
}

module itemRender {
	export class WonderMysteryShopItem extends eui.ItemRenderer {
		mElemList: any;
		constructor() {
			super();
			this.mElemList = {}

			let mElemInfo = []

			for (let i = 0; i < 3; i++) {
				table_insert(mElemInfo, { ["index_type"]: eui.Group, ["name"]: "group" + i, ["x"]: 10 + 180 * i, ["y"]: 0, ["w"]: 170, ["h"]: 280 })
				table_insert(mElemInfo, { ["index_type"]: gui.Grid9Image, ["name"]: "bg" + i, ["parent"]: "group" + i, ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 5, ["w"]: 170, ["h"]: 270 })
			}
			UiUtil.createElem(mElemInfo, this, this.mElemList, this)

			mElemInfo = []
			for (let i = 0; i < 3; i++) {
				this.mElemList["itemBox" + i] = UIItemBox.newObj(this, "itemBox" + i, 50, 15, this.mElemList["group" + i])

				table_insert(mElemInfo, { ["index_type"]: gui.Grid9Image, ["name"]: "dazhe_bg" + i, ["parent"]: "group" + i, ["image"]: "ty_zheKouDi", ["x"]: 5, ["y"]: -2, ["w"]: 43, ["h"]: 80 })
				table_insert(mElemInfo, { ["index_type"]: eui.Label, ["name"]: "dazhe_txt" + i, ["parent"]: "dazhe_bg" + i, ["title"]: "", ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.white, ["x"]: 5, ["y"]: 0, ["w"]: 33, ["h"]: 72 })
				table_insert(mElemInfo, { ["index_type"]: gui.Grid9Image, ["name"]: "reset_icon" + i, ["parent"]: "group" + i, ["image"]: "jchd_buChongZhi", ["x"]: 93, ["y"]: -2, ["w"]: 80, ["h"]: 72, ["messageFlag"]: true })

				table_insert(mElemInfo, { ["index_type"]: gui.Grid9Image, ["name"]: "yuanbao_bg" + i, ["parent"]: "group" + i, ["image"]: "xyhl_biaoTiDi01", ["x"]: 6, ["y"]: 100, ["w"]: 158, ["h"]: 32 })
				table_insert(mElemInfo, { ["index_type"]: eui.Label, ["name"]: "yuanbao_txt" + i, ["parent"]: "yuanbao_bg" + i, ["title"]: Localize_cns("YUANBAO"), ["font"]: "ht_20_cc", ["color"]: gui.Color.yellow, ["x"]: 0, ["y"]: 6, ["w"]: 158, ["h"]: 20 })

				table_insert(mElemInfo, { ["index_type"]: gui.RichDisplayer, ["name"]: "old_price_rd" + i, ["parent"]: "group" + i, ["x"]: 0, ["y"]: 138, ["w"]: 170, ["h"]: 26 })
				table_insert(mElemInfo, { ["index_type"]: eui.Rect, ["name"]: "line" + i, ["parent"]: "old_price_rd" + i, ["color"]: gui.Color.ublack, ["x"]: 10, ["y"]: 12, ["w"]: 150, ["h"]: 2 })
				table_insert(mElemInfo, { ["index_type"]: gui.RichDisplayer, ["name"]: "new_price_rd" + i, ["parent"]: "group" + i, ["x"]: 0, ["y"]: 162, ["w"]: 170, ["h"]: 26 })

				table_insert(mElemInfo, { ["index_type"]: gui.Button, ["name"]: "buy_btn" + i, ["parent"]: "group" + i, ["title"]: Localize_cns("SHOP_TXT5"), ["font"]: "ht_22_cc_stroke", ["color"]: gui.Color.white, ["image"]: "ty_tongYongBt16", ["x"]: 26, ["y"]: 188, ["w"]: 117, ["h"]: 51, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onClickBuy })
				table_insert(mElemInfo, { ["index_type"]: eui.Label, ["name"]: "limit_txt" + i, ["parent"]: "group" + i, ["title"]: "", ["font"]: "ht_18_cc", ["color"]: gui.Color.green, ["x"]: 0, ["y"]: 240, ["w"]: 170, ["h"]: 26 })
			}
			UiUtil.createElem(mElemInfo, this, this.mElemList, this)

			for (let i = 0; i < 3; i++) {
				this.mElemList["old_price_rd" + i].setAlignFlag(gui.Flag.H_CENTER)
				this.mElemList["new_price_rd" + i].setAlignFlag(gui.Flag.H_CENTER)
			}
		}

		protected dataChanged(): void {
			let controlDataList: any = {}
			for (let i = 0; i < 3; i++) {
				let data = this.data[i]
				if (!data) {
					this.mElemList["group" + i].visible = false
					continue
				}
				this.mElemList["group" + i].visible = true

				let self = data.self

				let oldPrice = data.oldPrice
				let newPrice = data.newPrice
				let discount = Math.floor(newPrice * 10 / oldPrice)
				this.mElemList["dazhe_txt" + i].text = String.format(Localize_cns("OPENSERVER_TXT28"), discount)

				this.mElemList["reset_icon" + i].visible = data.limitDay > 1

				let itemList = AnalyPrizeFormat(data.item)
				let itemId = itemList[0][0]
				let itemCount = itemList[0][1]
				this.mElemList["itemBox" + i].updateByEntry(itemId, itemCount)
				
				this.mElemList["yuanbao_txt" + i].text = ItemSystem.getInstance().getItemName(itemId)

				AddRdContent(this.mElemList["old_price_rd" + i], String.format(Localize_cns("WONDER_SHOP_TXT3"), oldPrice), "ht_20_cc", "ublack")
				AddRdContent(this.mElemList["new_price_rd" + i], String.format(Localize_cns("WONDER_SHOP_TXT4"), newPrice), "ht_20_cc", "darkgoldenrod")

				let dataInfo = ActivitySystem.getInstance().getOperatePlayerInfo(self.activityIndex) || {}
				let recordList = (data.limitDay == 1) ? (dataInfo[0] || {}) : (dataInfo[1] || {})

				let useCount = recordList[data.index] || 0
				let limitCount = data.limitCount
				this.mElemList["limit_txt" + i].text = String.format(Localize_cns("WONDER_SHOP_TXT5"), useCount, limitCount)

				controlDataList["buy_btn" + i] = data
			}

			this.data.controlDataList = controlDataList
		}

		onClickBuy(event: egret.TouchEvent) {
			let btnName = event.target.name
			if (!this.data.controlDataList) {
				return
			}

			let data = this.data.controlDataList[btnName]

			if (!data) {
				return
			}

			let self = data.self
			let ownMoney = GetHeroMoney(opItemUnit.CURRENCY)
			let needMoney = data.newPrice
			if (ownMoney < needMoney) {
				ExecuteMainFrameFunction("chongzhi")
				return
			} else {
				let dataInfo = ActivitySystem.getInstance().getOperatePlayerInfo(self.activityIndex) || {}
				let recordList = (data.limitDay == 1) ? (dataInfo[0] || {}) : (dataInfo[1] || {})

				let useCount = recordList[data.index] || 0
				let limitCount = data.limitCount

                let count = limitCount - useCount
				if (count > 1) { //批量购买
					let wnd = WngMrg.getInstance().getWindow("WonderBuyFrame")
					wnd.showWithData(data, self.activityIndex)
				} else if (count == 1) {
					RpcProxy.call("C2G_DoOperateActivity", self.activityIndex, [data.index, 1])
				} else {
					MsgSystem.addTagTips(Localize_cns("BOSS_TXT65"))
				}
			}
		}
	}
}