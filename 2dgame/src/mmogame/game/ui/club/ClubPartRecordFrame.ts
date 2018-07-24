// TypeScript file
class ClubPartRecordFrame extends BaseWnd {
	scroll: UIScrollList;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/club/ClubPartRecordLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true, true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 15, 15, 490, 590, this.mElemList["scroll_wnd"])
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.REFRESH_ALLOR_RECORD, this.refreshFrame, this)
		this.mLayoutNode.visible = true;
		this.mLayoutNode.setDoModal(true)

		RpcProxy.call("C2G_FactionAllocaItemRecord")

		this.refreshFrame()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.REFRESH_ALLOR_RECORD, this.refreshFrame, this)
		this.mLayoutNode.visible = false;
		this.mLayoutNode.setDoModal(false)
	}

	refreshFrame() {
		let recordInfo = ClubSystem.getInstance().getClubPartRecordList() || []
		if (size_t(recordInfo) == 0) {
			return
		}

		this.scroll.clearItemList()

		for (let i in recordInfo) {
			let record = recordInfo[i]
			let [window, flag] = this.scroll.getItemWindow(tonumber(i), 490, 70, 0, 0, 0)
			if (flag == true) {
				this.initItemWindow(window)
			}
			this.refreshItemWindow(window, record)
		}
	}

	initItemWindow(window) {
		let name = window.name

		let Info = [
			{ ["index_type"]: gui.RichDisplayer, ["name"]: "rd_" + name, ["title"]: null, ["x"]: 10, ["y"]: 0, ["w"]: 470, ["h"]: 70, ["messageFlag"]: true },
			{ ["index_type"]: gui.Grid9Image, ["name"]: "line_" + name, ["title"]: null, ["image"]: "cz_uiLine01", ["x"]: 0, ["y"]: 54, ["w"]: 490, ["h"]: 16, ["messageFlag"]: true },
		]
		UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
	}

	refreshItemWindow(window, record) {
		let name = window.name

		// {name,memName, itemEntryId, count, time}
		let controlName = record[0]
		let acceptName = record[1]
		let itemId = record[2]
		let itemCount = record[3]
		let time = record[4]

		let itemName = ItemSystem.getInstance().getItemName(itemId)

		let str = String.format(Localize_cns("CLUB_STORE_TXT9"), getFormatTimeEx(time), controlName, itemCount, itemName, acceptName)

		AddRdContent(this.mElemList["rd_" + name], str, "ht_22_cc", "ublack", 5)
	}
}