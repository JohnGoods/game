// TypeScript file

class StrongholdRecordFrame extends BaseWnd {

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/stronghold/StrongholdRecordLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0]
		this.initSkinElemList()
		//this.setAlignCenter(true, true)
		this.setFullScreen(true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			//{ ["name"]: "btn_get", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGet },
		]
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let list: eui.List = this.mElemList["list"]
		list.itemRenderer = itemRender.StrongholdRecordListItem
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.STRONGHOLD_RECORD_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = true
		this.refreshFrame()
		RpcProxy.call("C2G_StrongholdRecord")
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.STRONGHOLD_RECORD_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = false
	}

	refreshFrame() {
		let wnd = WngMrg.getInstance().getWindow("StrongholdFrame")
		if (wnd.isVisible()) {
			wnd.removeRecordDot()
		}
		let _list = GetActivity(ActivityDefine.Stronghold).getStrongholdRecordList()
		//this.mElemList["btn_get"].visible = (size_t(list) != 0)
		let func = function (a, b) {
			return a[1] - b[1]
		}
		table_sort(_list, func)
		let list = []
		for (let i = size_t(_list) - 1; i >= 0; i--) {
			table_insert(list, _list[i])
		}
		let elist: eui.List = this.mElemList["list"]
		UiUtil.updateList(elist, list)
	}

	// onClickGet() {

	// }
}

module itemRender {
	export class StrongholdRecordListItem extends eui.ItemRenderer {
		mElemList: any

		constructor() {
			super()
			this.mElemList = {}

			let mElemInfo = [
				{ ["index_type"]: eui.Group, ["name"]: "group", ["x"]: 0, ["y"]: 0, ["w"]: 570, ["h"]: 110 },
				{ ["index_type"]: gui.RichDisplayer, ["name"]: "text1", ["parent"]: "group", ["x"]: 10, ["y"]: 10, ["w"]: 550, ["h"]: 35, ["messageFlag"]: true },
				{ ["index_type"]: gui.RichDisplayer, ["name"]: "text2", ["parent"]: "group", ["x"]: 10, ["y"]: 45, ["w"]: 465, ["h"]: 45, ["messageFlag"]: true },
				{ ["index_type"]: gui.Button, ["name"]: "revengeBtn", ["parent"]: "group", ["image"]: "ty_tongYongBt6", ["title"]: Localize_cns("ESCORT_RECORD_TXT1"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 480, ["y"]: 47, ["w"]: 84, ["h"]: 41, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRevenge },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "line", ["parent"]: "group", ["image"]: "cz_uiLine03", ["x"]: 0, ["y"]: 94, ["w"]: 570, ["h"]: 16, ["messageFlag"]: true },
			]
			UiUtil.createElem(mElemInfo, this, this.mElemList, this)
		}

		protected dataChanged(): void {
			let data = this.data
			// time, sid, type, roleid, rolename, itemid, get, total, fuchou ing, Fuchou ed
			AddRdContent(this.mElemList["text1"], getFormatTimeEx(data[0]), "ht_20_cc", "ublack")
			let itemName = ItemSystem.getInstance().getItemName(data[5])
			let str = ""
			if (data[2] == StrongholdConfig.recordType.fininsh) {
				this.mElemList["revengeBtn"].visible = false
				str = String.format(Localize_cns("STRONGHOLD_TEXT3"), data[1], itemName, Math.floor(data[6]))
			} else if (data[2] == StrongholdConfig.recordType.robbedSucc) {
				this.mElemList["revengeBtn"].visible = true
				str = String.format(Localize_cns("STRONGHOLD_TEXT27"), data[4], itemName, Math.floor(data[6]))
			} else if (data[2] == StrongholdConfig.recordType.robbedFail) {
				this.mElemList["revengeBtn"].visible = false
				str = String.format(Localize_cns("STRONGHOLD_TEXT33"), data[4])
			}
			AddRdContent(this.mElemList["text2"], str, "ht_20_cc", "ublack")
		}

		onClickRevenge(args: egret.Event) {
			let data = this.data
			if (GetHeroProperty("id") == data[3]) {
				return MsgSystem.addTagTips(Localize_cns("STRONGHOLD_TEXT51"))
			}
			RpcProxy.call("C2G_StrongholdRevenge", GetHeroProperty("id"), data[3], data[0])
		}
	}
}