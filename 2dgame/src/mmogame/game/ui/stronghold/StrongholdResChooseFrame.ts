// TypeScript file

class StrongholdResChooseFrame extends BaseWnd {
	itemList: any
	itemSelectedIndex: number
	strongholdIndex: number
	selectedIndex: number

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/stronghold/StrongholdResChooseLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0]
		this.initSkinElemList()
		this.setAlignCenter(true, true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_confirm", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickConfirm },
		]
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		for (let i = 1; i <= 5; i++) {
			let x = 30 + 105 * (i - 1)
			this.mElemList["itemBox_" + i] = UIItemBox.newObj(this, "itemBox_" + i, x, 0, this.mElemList["group_itemList"])
		}

		let list: eui.List = this.mElemList["list_item"]
		list.itemRenderer = itemRender.StrongholdAllResListItem
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true
		
		let titleName = GameConfig.StrongholdConfig[this.strongholdIndex].name
		this.mElemList["lab_title"].text = titleName

		this.itemSelectedIndex = this.itemSelectedIndex ? this.itemSelectedIndex : 1
		this.initResList()
		this.refreshFrame()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false
	}

	initResList() {
		this.itemList = []
		for (let i in GameConfig.StrongholdItemConfig) {
			let v = GameConfig.StrongholdItemConfig[i]
			v.selected = false
			v.self = this
			table_insert(this.itemList, v)
		}

		let func = function (a, b) {
			return a.index - b.index
		}
		table_sort(this.itemList, func)
	}

	refreshFrame() {
		for (let i in this.itemList) {
			let v = this.itemList[i]
			v.selected = false
		}
		let flag = CampaignSystem.getInstance().isCampaignPass(this.itemList[this.itemSelectedIndex - 1].campaId)
		if (flag) {
			this.itemList[this.itemSelectedIndex - 1].selected = true
		} else {
			this.itemList[0].selected = true
		}

		for (let i = 1; i <= 5; i++) {
			let itemList = this.itemList[this.itemSelectedIndex - 1].itemList
			let entryId = itemList[i - 1]
			if (entryId && entryId > 0) {
				this.mElemList["itemBox_" + i].setVisible(true)
				this.mElemList["itemBox_" + i].updateByEntry(entryId)
			} else {
				this.mElemList["itemBox_" + i].setVisible(false)
			}
		}

		let n = 4
		let _n = Math.ceil(size_t(this.itemList) / 2)
		if (_n >= 4) {
			n = _n
		}
		let splitItemList = splitListByCount(this.itemList, n)
		let list: eui.List = this.mElemList["list_item"]
		UiUtil.updateList(list, splitItemList)
	}

	onClickConfirm() {
		RpcProxy.call("C2G_StrongholdOccupy", this.strongholdIndex, this.selectedIndex, 1, this.itemList[this.itemSelectedIndex - 1].index)
		this.hideWnd()
	}

	showWithIndex(index1: number, index2: number) {
		this.strongholdIndex = index1
		this.selectedIndex = index2
		this.showWnd()
	}
}

module itemRender {
	export class StrongholdAllResListItem extends eui.ItemRenderer {
		mElemList: any
		maxCol: number
		totalNum: number

		constructor() {
			super()
			this.mElemList = {}

			this.totalNum = size_t(GameConfig.StrongholdItemConfig)
			this.maxCol = 4
			let _n = Math.ceil(this.totalNum / 2)
			if (_n >= 4) {
				this.maxCol = _n
			}

			for (let i = 1; i <= this.maxCol; i++) {
				let x = 145 * (i - 1)
				let y = 5

				let mElemInfo = [
					{ ["index_type"]: eui.Group, ["name"]: "group" + i, ["x"]: x, ["y"]: y, ["w"]: 140, ["h"]: 150 },
					{ ["index_type"]: gui.Grid9Image, ["name"]: "bg" + i, ["parent"]: "group" + i, ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 140, ["h"]: 150 },
					{ ["index_type"]: eui.ToggleButton, ["name"]: "selectedBtn" + i, ["parent"]: "group" + i, ["image"]: "ty_xuanZheDi01", ["image_down"]: "ty_xuanZhe01", ["x"]: 51, ["y"]: 90, ["w"]: 45, ["h"]: 46, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSelect },
					//{ ["index_type"]: gui.RichDisplayer, ["name"]: "tips" + i, ["parent"]: "group" + i, ["x"]: 10, ["y"]: 95, ["w"]: 100, ["h"]: 45 },
					{ ["index_type"]: eui.Label, ["name"]: "tips" + i, ["parent"]: "group" + i, ["title"]: "", ["font"]: "ht_18_cc", ["color"]: gui.Color.ublack, ["x"]: 10, ["y"]: 95, ["w"]: 120, ["h"]: 45, ["messageFlag"]: true },
				]
				UiUtil.createElem(mElemInfo, this, this.mElemList, this)
				this.mElemList["itemBox" + i] = UIItemBox.newObj(this, "itemBox" + i, 30, 10, this.mElemList["group" + i])

				//this.mElemList["tips" + i].setAlignFlag(gui.Flag.CENTER_CENTER)
			}
		}

		protected dataChanged(): void {
			let data = this.data
			for (let i = 1; i <= this.maxCol; i++) {
				let v = data[i - 1]
				if (v) {
					let flag = CampaignSystem.getInstance().isCampaignPass(v.campaId)
					if (flag) {
						this.mElemList["tips" + i].visible = false
						this.mElemList["selectedBtn" + i].visible = true
						this.mElemList["selectedBtn" + i].selected = v.selected
					} else {
						let camName = CampaignSystem.getInstance().getCampaignName(v.campaId)
						//AddRdContent(this.mElemList["tips" + i], Localize_cns("STRONGHOLD_TEXT2") + "#br" + camName, "ht_18_cc", "ublack")
						this.mElemList["tips" + i].text = Localize_cns("STRONGHOLD_TEXT2") + "\n" + camName

						this.mElemList["selectedBtn" + i].visible = false
						this.mElemList["tips" + i].visible = true
					}
					this.mElemList["itemBox" + i].updateByEntry(v.entryId)
					this.mElemList["group" + i].visible = true
				} else {
					this.mElemList["group" + i].visible = false
				}
			}
		}

		onClickSelect(args: egret.Event) {
			let btn: eui.ToggleButton = args.target
			if (!btn.selected) {
				btn.selected = true
				return
			}

			let name = this.name
			let rowIndex = name.replace(/\D/ig, "")
			let tname = args.target.name
			let tIndex = tname.replace(/\D/ig, "")
			let index = tonumber(rowIndex) * this.maxCol + tonumber(tIndex)
			let self = this.data[0].self
			self.itemSelectedIndex = index

			self.refreshFrame()
		}
	}
}