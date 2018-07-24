// TypeScript file
class FunPrizeFrame extends BaseWnd {
	select: number;
	tabgroup: eui.RadioButtonGroup;
	configList: any;
	btnList: any[]
	itemList: any[]

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/funPrize/FunPrizeLayout.exml"]

		this.btnList = []
		this.itemList = []
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		var list: eui.List = this.mElemList["btn_list"]
		list.itemRenderer = itemRender.FunPrizeBtnList

		var list: eui.List = this.mElemList["item_list"]
		list.itemRenderer = itemRender.FunPrizeItemList

		this.tabgroup = new eui.RadioButtonGroup()

		this.configList = FunSystem.getInstance().getFunPrizeConfig()

		if (this.select == null) {
			for (let _ in this.configList) {
				this.select = tonumber(_)
				return
			}
		}
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = true;
		this.refreshFrame()

		this.resetBtnList()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = false;
	}

	refreshFrame() {
		this.refreshBtnList()
		this.refreshItemList()
	}

	refreshBtnList() {
		if (!this.configList) {
			return
		}

		let btnList = []
		for (let _ in this.configList) {
			let t: any = {}
			t.data = _
			t.self = this
			table_insert(btnList, t)
		}

		let list: eui.List = this.mElemList["btn_list"]
		UiUtil.updateList(list, btnList)

		this.btnList = btnList
	}

	resetBtnList() {
		if (size_t(this.btnList) <= 0) {
			return
		}

		let pos = 0
		for (let i in this.btnList) {
			if (this.select == this.btnList[i].data) {
				pos = tonumber(i)
			}
		}

		let scroller = <eui.Scroller>this.mElemList["btn_scroller"]
		scroller.validateNow();
		if (pos > 8) {
			scroller.viewport.scrollV = scroller.viewport.contentHeight - scroller.viewport.height;
		} else {
			scroller.viewport.scrollV = 0
		}
	}

	refreshItemList() {
		if (!this.configList[this.select]) {
			return
		}
		let dataList = []
		for (let lv in this.configList[this.select]) {
			let t: any = {}
			t.data = this.configList[this.select][lv]
			t.self = this
			table_insert(dataList, t)
		}

		table_sort(dataList, function (a, b) {
			let record = getSaveRecord(opSaveRecordKey.tempCellPrize) || {}
			let isGetA = 0
			if (record[cellOptionsIndex[a.data.Name]]) {
				isGetA = record[cellOptionsIndex[a.data.Name]][a.data.Level] || 0
			}

			let isGetB = 0
			if (record[cellOptionsIndex[b.data.Name]]) {
				isGetB = record[cellOptionsIndex[b.data.Name]][b.data.Level] || 0
			}

			//0未达成, 1可以拿, 2已经拿了
			if (isGetA == isGetB) {
				return a.data.Level - b.data.Level
			} else {
				let t = { [0]: 1, [1]: 0, [2]: 2 }
				return t[isGetA] - t[isGetB]
			}
		})

		let list: eui.List = this.mElemList["item_list"]
		UiUtil.updateList(list, dataList)

		this.itemList = dataList
	}

	////////////////////////////////////////////////
	showWithType(mType) {
		this.select = mType
		if (this.isVisible()) {
			this.moveToFront()
		} else {
			this.showWnd()
		}
	}
}

module itemRender {
	export class FunPrizeBtnList extends eui.ItemRenderer {
		mElemList: any;
		constructor() {
			super();
			this.mElemList = {}

			let imageName = "sd_biaoQian02"
			let imageDownName = "sd_biaoQian01"
			let width = 155, height = 71

			let mElemInfo = [
				{ ["index_type"]: eui.Group, ["name"]: "group", ["x"]: 0, ["y"]: 0, ["w"]: 155, ["h"]: 78 },
				{ ["index_type"]: eui.RadioButton, ["name"]: "btn", ["parent"]: "group", ["image"]: imageName, ["image_down"]: imageDownName, ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPrize },
				{ ["index_type"]: eui.Label, ["name"]: "text", ["parent"]: "group", ["title"]: "", ["color"]: gui.Color.white, ["font"]: "ht_24_cc_stroke", ["x"]: 5, ["y"]: 21, ["w"]: 150, ["h"]: 30, ["messageFlag"]: true },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "dot", ["parent"]: "group", ["image"]: "zjm_hongDian01", ["x"]: 115, ["y"]: 0, ["w"]: 40, ["h"]: 40, ["messageFlag"]: true },
			]
			UiUtil.createElem(mElemInfo, this, this.mElemList, this)

			this.mElemList["dot"].visible = false
		}

		protected dataChanged(): void {
			let self = this.data.self
			if (self.tabgroup) {
				this.mElemList["btn"].group = self.tabgroup
			}

			this.mElemList["text"].text = Localize_cns(cellOptionsName[this.data.data - 1])

			if (tonumber(this.data.data) == self.select) {
				this.mElemList["btn"].selected = true
			}

			this.mElemList["dot"].visible = false
			if (GuideFuncSystem.getInstance().checkFunPrize(this.data.data)) {
				this.mElemList["dot"].visible = true
			}
		}

		onClickPrize() {
			let self = this.data.self
			self.select = tonumber(this.data.data)
			self.refreshItemList()

			self.mElemList["item_scroller"].viewport.scrollV = 0
		}
	}
}

module itemRender {
	export class FunPrizeItemList extends eui.ItemRenderer {
		mElemList: any;
		constructor() {
			super();
			this.mElemList = {}

			let mElemInfo = [
				{ ["index_type"]: eui.Group, ["name"]: "group", ["x"]: 0, ["y"]: 0, ["w"]: 420, ["h"]: 135 },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["parent"]: "group", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 420, ["h"]: 130, ["messageFlag"]: true },

				{ ["index_type"]: gui.Grid9Image, ["name"]: "title_bg", ["parent"]: "group", ["image"]: "sc_biaoTiDi01", ["x"]: 20, ["y"]: 5, ["w"]: 240, ["h"]: 32, ["messageFlag"]: true },
				{ ["index_type"]: eui.Label, ["name"]: "title", ["parent"]: "group", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 6, ["w"]: 240, ["h"]: 30, ["messageFlag"]: true },

				{ ["index_type"]: gui.Button, ["name"]: "btn", ["parent"]: "group", ["title"]: Localize_cns("CLUB_TXT50"), ["font"]: "ht_22_cc_stroke", ["color"]: gui.Color.white, ["image"]: "ty_tongYongBt3", ["x"]: 290, ["y"]: 50, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGet },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "dot", ["parent"]: "btn", ["image"]: "zjm_hongDian01", ["x"]: 77, ["y"]: 0, ["w"]: 40, ["h"]: 40, ["messageFlag"]: true },
				{ ["index_type"]: eui.Label, ["name"]: "txt", ["parent"]: "group", ["title"]: Localize_cns("ACTIVITY_PAY_TXT70"), ["font"]: "ht_24_cc", ["color"]: gui.Color.saddlebrown, ["x"]: 286, ["y"]: 63, ["w"]: 117, ["h"]: 30 },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "image", ["parent"]: "group", ["image"]: "bh_text02", ["x"]: 290, ["y"]: 56, ["w"]: 120, ["h"]: 39 },
			]
			UiUtil.createElem(mElemInfo, this, this.mElemList, this)

			for (let i = 0; i < 3; i++) {
				this.mElemList["itemBox_" + i] = UIItemBox.newObj(this, "itemBox_" + i, 15 + 85 * i, 40, this.mElemList["group"])
				this.mElemList["itemBox_" + i].setVisible(false)
			}

			this.mElemList["btn"].visible = false
			this.mElemList["txt"].visible = false
			this.mElemList["image"].visible = false

			this.mElemList["dot"].visible = false
		}

		protected dataChanged(): void {
			let config = this.data.data
			let self = this.data.self

			this.mElemList["btn"].visible = false
			this.mElemList["txt"].visible = false
			this.mElemList["image"].visible = false

			this.mElemList["title"].text = String.format(Localize_cns("FUN_PRIZE_TXT2"), Localize_cns(config.Name), config.Level)

			let itemList = AnalyPrizeFormat(config.prize)
			for (let i = 0; i < 3; i++) {
				this.mElemList["itemBox_" + i].setVisible(false)
				if (itemList[i]) {
					this.mElemList["itemBox_" + i].setVisible(true)
					this.mElemList["itemBox_" + i].updateByEntry(itemList[i][0], itemList[i][1])
				}
			}

			let record = getSaveRecord(opSaveRecordKey.tempCellPrize) || {}
			let isGet = null
			if (record[self.select]) {
				isGet = record[self.select][config.Level]
			}

			//let funInfo = FunSystem.getInstance().getFunInfoWithType(self.select)

			//1可以拿，2已经拿了
			this.mElemList["dot"].visible = false
			if (isGet == 1) {
				this.mElemList["btn"].visible = true
				this.mElemList["dot"].visible = true
			} else if (isGet == 2) {
				this.mElemList["image"].visible = true
			} else {
				this.mElemList["txt"].visible = true
			}
		}

		onClickGet() {
			let config = this.data.data
			let self = this.data.self
			if (cellOptionsName[self.select - 1] == config.Name) {
				RpcProxy.call("C2G_TEMPCELLFUN_STAGEUP_PRIZE", self.select, config.Level)
			}
		}
	}
}