class LianYaoAccessPathFrame extends BaseWnd {
	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/lucky/LianYaoAccessPathLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();
        this.setAlignCenter(true, true)
		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "pay_record", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPayClicked },
			{ ["name"]: "kuafu", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onKuaFuClicked },
			{ ["name"]: "wulinmengzhu", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onWuLiClicked },
			{ ["name"]: "richanghuodong", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onDailyClicked },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
		this.mElemList["item"] = UIItemBox.newObj(this.mLayoutNode, "item", 4, 3,this.mElemList["item"] , 0.9)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		this.onRefresh()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
	}

	onRefresh() {
		this.mElemList["item"].updateByEntry(60046)
	}

	onPayClicked() {
		WngMrg.getInstance().showWindow("DailyPayFrame");
		this.hideWnd()
	}

	onKuaFuClicked() {
		MsgSystem.addTagTips(Localize_cns("UNIMPLEMENT_TIPS"))
	}

	onWuLiClicked() {
		MsgSystem.addTagTips(Localize_cns("UNIMPLEMENT_TIPS"))
	}

	onDailyClicked() {
		ExecuteMainFrameFunction("richang")
		this.hideWnd()
	}
}