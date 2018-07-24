// TypeScript file
class ClubEventRecordFrame extends BaseWnd {
	scroll: UIScrollList;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/club/ClubEventRecordLayout.exml"]
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
		RegisterEvent(EventDefine.CLUB_EVENT_RECORD, this.refreshFrame, this)
		this.mLayoutNode.visible = true;
		this.mLayoutNode.setDoModal(true)

		RpcProxy.call("C2G_FactionRecord")

		this.refreshFrame()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.CLUB_EVENT_RECORD, this.refreshFrame, this)
		this.mLayoutNode.visible = false;
		this.mLayoutNode.setDoModal(false)
	}

	refreshFrame() {
		let recordInfo = ClubSystem.getInstance().getClubEventInfo()
		if (!recordInfo) {
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

		let time = record[0]
		let id = record[1]
		let rname = record[2]
		let type = record[3]
		let param = record[4]
		let str = ""
		str = getFormatTime(time) + "#space_10" + getFormatTimeSec(time) + "#br"
		let des = GameConfig.FactionRecordConfig[type].des
		if (type == opFacRecord.LevelUP) {
			str = str + String.format(des, param)
		} else if (type == opFacRecord.Appoinit) {
			let pos = opOfficeToStr[param]
			str = str + String.format(des, rname, Localize_cns(pos))
		} else {
			str = str + String.format(des, rname)
		}

		AddRdContent(this.mElemList["rd_" + name], str, "ht_24_cc", "ublack", 3)
	}
}