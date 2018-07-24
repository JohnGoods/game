// TypeScript file

class ClubDonateFrame extends BaseWnd {

	subWndList: any;
	tabIndex: string;

	emptyView: UIEmptyView;


	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/club/ClubDonateLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		//this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true, true)

		this.mLayoutNode.verticalCenter = -100

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let listBox: eui.List = this.mElemList["list_donate"]
		listBox.itemRenderer = itemRender.ClubPeopleDonateItem

		this.mElemList["link_view0"] = UILinkView.newObj(this.mLayoutNode, "link_view0", 0, 0, this.mElemList["link_wnd0"])
		this.mElemList["link_view0"].setContent(Localize_cns("CLUB_TXT6"))
		this.mElemList["link_view0"].setCallBack(this.onClickLink0, this)

		this.mElemList["link_view1"] = UILinkView.newObj(this.mLayoutNode, "link_view1", 0, 0, this.mElemList["link_wnd1"])
		this.mElemList["link_view1"].setContent(Localize_cns("CLUB_TXT10"))
		this.mElemList["link_view1"].setCallBack(this.onClickLink1, this)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.ITEM_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = true;
		this.mLayoutNode.setDoModal(true);
		this.refreshFrame();
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ITEM_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = false;
		this.mLayoutNode.setDoModal(false);
	}

	refreshFrame() {
		let list = ItemSystem.getInstance().getFactionMaterial()
		let listbox: eui.List = this.mElemList["list_donate"];
		UiUtil.updateList(listbox, list);
	}

	onClickLink0() {
		let wnd = WngMrg.getInstance().getWindow("ClubFrame")
		if (wnd.isVisible()) {
			wnd.tabWndList.changeTabWithIndex(2)
		} else {
			wnd.showWithIndex(2)
		}

		this.hideWnd()
	}

	onClickLink1() {
		this.hideWnd()
		let a = GetActivity(ActivityDefine.ClubMap)
		a.requestStart()
	}
}

module itemRender {
	export class ClubPeopleDonateItem extends eui.ItemRenderer {
		mElemList: any;
		constructor() {
			super();
			this.mElemList = {}

			let width = 530, height = 110

			let Info: any = [
				//背景
				{ ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 10, ["y"]: 0, ["w"]: width, ["h"]: height, ["event_name"]: null, ["fun_index"]: null, },

				{ ["index_type"]: eui.Label, ["name"]: "itemName", ["parent"]: "bg", ["title"]: "", ["font"]: "ht_24_lc", ["color"]: gui.Color.saddlebrown, ["x"]: 110, ["y"]: 25, ["w"]: 150, ["h"]: 25, ["messageFlag"]: true },
				{ ["index_type"]: eui.Label, ["name"]: "des", ["parent"]: "bg", ["title"]: "", ["font"]: "ht_24_lc", ["color"]: gui.Color.saddlebrown, ["x"]: 110, ["y"]: 60, ["w"]: 150, ["h"]: 25, ["messageFlag"]: true },

				{ ["index_type"]: gui.Button, ["name"]: "donate_btn", ["bAdapteWindow"]: true, ["image"]: "ty_tongYongBt3", ["x"]: 410, ["y"]: 30, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onDonateClick, },
				{ ["index_type"]: eui.Label, ["name"]: "donate_text", ["parent"]: "donate_btn", ["title"]: Localize_cns("CLUB_TXT45"), ["font"]: "ht_20_cc_stroke", ["image"]: null, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 117, ["h"]: 51, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
			]
			UiUtil.createElem(Info, this, this.mElemList, this)

			this.mElemList["itemBox"] = UIItemBox.newObj(this.mElemList, "itemBox", 15, 15, this.mElemList["bg"])
		}

		protected dataChanged(): void {
			let item: Item = this.data

			this.mElemList["itemName"].text = item.getRefProperty("name")
			this.mElemList["des"].text = item.getRefProperty("description")

			this.mElemList["itemBox"].updateByItem(item)
			this.mElemList["itemBox"].setCountVisible(false)
		}

		onDonateClick(args) {
			let item: Item = this.data
			RpcProxy.call("C2G_FactionDonation", item.entryId)
		}
	}
}