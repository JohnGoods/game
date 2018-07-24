class ChampionRecordFrame extends BaseWnd {
	scroll: UIScrollList;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/champion/ChampionRecordLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		//this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true, true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let group = <eui.Group>this.mElemList["scroll_wnd"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		this.mLayoutNode.setDoModal(true)
		this.refreshFrame()

		RpcProxy.call("C2G_ChampionRecordData")
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		this.mLayoutNode.setDoModal(false)
	}

	refreshFrame() {
		let group = <eui.Group>this.mElemList["scroll_wnd"]

		this.scroll.clearItemList()

        let activity = GetActivity(ActivityDefine.Champion)
		let list = activity.getChampionRecord() || []
		for (let i = 0; i < size_t(list); i++) {
			let v = list[i]
			let [window, flag] = this.scroll.getItemWindow(i, group.width, 61, 0, 0, 0)
			if (flag == true) {
				this.initItemWindow(window)
			}
			this.refreshItemWindow(window, v, i)
		}
		this.scroll.refreshScroll()
	}

	initItemWindow(window) {
		let name = window.name
		let w = window.width
		let h = window.height

		let elemInfo = [
			{ ["index_type"]: gui.Grid9Image, ["name"]: "bg_" + name, ["title"]: null, ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h },
			//结果
			{ ["index_type"]: gui.RichDisplayer, ["name"]: "result_rd_" + name, ["title"]: null, ["x"]: 10, ["y"]: h/2 - 18, ["w"]: 110, ["h"]: 36 },
			//挑战对象
			{ ["index_type"]: gui.RichDisplayer, ["name"]: "name_rd_" + name, ["title"]: null, ["x"]: 130, ["y"]: h/2 - 10, ["w"]: 200, ["h"]: 24 },
			//时间
			{ ["index_type"]: gui.RichDisplayer, ["name"]: "time_rd_" + name, ["title"]: null, ["x"]: 290, ["y"]: h/2 - 10, ["w"]: 240, ["h"]: 24 },
		]
		UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this, window)

		this.mElemList["time_rd_" + name].setAlignFlag(gui.Flag.RIGHT)
	}

    //{mIsWin, tId, tName, rankUp, os.time()}
	refreshItemWindow(window, data, index) {
		let name = window.name

        let str = ""
		let move = data[3] || 0
		if (data[0] == 1) { //胜
			if (move == 0) {
				str = "#WIN#lime" + Localize_cns("JJC_TXT15")
			} else {
				str = "#WIN#lime" + move
			}
		} else {
			str = "#LOST#lime" + move
		}

		AddRdContent(this.mElemList["result_rd_" + name], str, "ht_24_cc", "ublack")

		let playerName = data[2]
		AddRdContent(this.mElemList["name_rd_" + name], Localize_cns("JJC_TXT11") + playerName, "ht_20_cc", "ublack")

		let time = data[4]
		AddRdContent(this.mElemList["time_rd_" + name], getFormatTime(time) + " " + getFormatTimeSec(time), "ht_20_cc", "ublack")
	}
}