// TypeScript file
class ClubStoreFrame extends BaseWnd {
	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/club/ClubStoreLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

			{ ["name"]: "part_record_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRecord},
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let list: eui.List = this.mElemList["scroll"]
		list.itemRenderer = itemRender.ClubStoreItem

		AddRdContent(this.mElemList["tips_rd"], String.format(Localize_cns("CLUB_STORE_TXT3"), opFactionDefaultValue.BASE_WARE_HOUSE_MAX), "ht_22_cc", "white", 5)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.CLUB_REPO_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = true;

		RpcProxy.call("C2G_FactionWareHouseItemList")

		GuideFuncSystem.getInstance().setReadState(GuideFuncSpace.GuideFuncReadTypeDefine.CLUB_STORE, 1)

		this.refreshFrame()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.CLUB_REPO_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = false;
	}

	refreshFrame() {
		let infoList = ClubSystem.getInstance().getClubStoreItemList() || []
		// if (size_t(infoList) == 0) {
		// 	return
		// } 

		let dataList = []
		for (let _ in infoList) {
			let t: any = {}
			t.data = infoList[_]
			t.self = this
			table_insert(dataList, t)
		}

		let list: eui.List = this.mElemList["scroll"]
		UiUtil.updateList(list, dataList)
	}

	onClickRecord() {
		let wnd = WngMrg.getInstance().getWindow("ClubPartRecordFrame")
		wnd.showWnd()
	}
}

module itemRender {
	export class ClubStoreItem extends eui.ItemRenderer {
		mElemList: any;
		constructor() {
			super();
			this.mElemList = {}

			let mElemInfo = [
				{ ["index_type"]: eui.Group, ["name"]: "group", ["x"]: 0, ["y"]: 0, ["w"]: 560, ["h"]: 105 },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["parent"]: "group", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 560, ["h"]: 100 },
				{ ["index_type"]: gui.RichDisplayer, ["name"]: "detail_rd", ["parent"]: "group", ["x"]: 115, ["y"]: 10, ["w"]: 400, ["h"]: 90, ["messageFlag"]: true },
				{ ["index_type"]: gui.Button, ["name"]: "part_btn", ["parent"]: "group", ["title"]: Localize_cns("CLUB_STORE_TXT5"), ["font"]: "ht_22_cc_stroke", ["color"]: gui.Color.white, ["image"]: "ty_tongYongBt3", ["x"]: 420, ["y"]: 28, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.partItem },
			]
			UiUtil.createElem(mElemInfo, this, this.mElemList, this)

			this.mElemList["itemBox"] = UIItemBox.newObj(this, "itemBox", 20, 10, this.mElemList["group"])
		}

		protected dataChanged(): void {
			let item: Item = this.data.data
			let self = this.data.self

			let itemId = item.entryId
			let itemName = ItemSystem.getInstance().getItemName(itemId)

			this.mElemList["itemBox"].updateByEntry(itemId, item.getProperty("count"))

			let time = item.getProperty("store_time")
			let timeStr = getFormatTime(time)

			let source = "CLUB_STORE_SOURCE" + item.getProperty("source")

			let str = String.format(Localize_cns("CLUB_STORE_TXT4"), itemName, timeStr, Localize_cns(source))
			AddRdContent(this.mElemList["detail_rd"], str, "ht_24_cc", "white", 3)
		}

		partItem() {
			let info = this.data.data
			let self = this.data.self

			if (!ClubSystem.getInstance().isHaveClubJurisdiction()) {
				MsgSystem.addTagTips(Localize_cns("CLUB_STORE_TXT10"))
				return
			}

			let wnd = WngMrg.getInstance().getWindow("ClubPartFrame")
			wnd.showWithItem(info)
		}
	}
}