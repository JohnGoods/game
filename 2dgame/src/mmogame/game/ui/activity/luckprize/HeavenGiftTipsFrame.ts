class HeavenGiftTipsFrame extends BaseWnd {
	heavenInfo

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/activity/HeavenGiftTipsLayout.exml"]

	}
	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.mLayoutNode.width = 640
        this.mLayoutNode.height = 365
        this.setAlignCenter(true, true)		
        this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)


	}
	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		this.onRefresh()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
        this.heavenInfo = null
	}

    onRefresh(){

        if(this.heavenInfo == null) return

        let prize = AnalyPrizeFormat(this.heavenInfo.prize)

        for(let k = 0; k < prize.length; k++){
            let prizeInfo = prize[k]
            if(this.mElemList["itemBox_" + k] == null){
                this.mElemList["itemBox_" + k] = UIItemBox.newObj(this.mLayoutNode, "itemBox_" + k, 80* k, 0, this.mElemList["group_item"])
            }
            this.mElemList["itemBox_" + k].updateByEntry(prizeInfo[0], prizeInfo[1])
        }
    }

    ///---------------------
    onShowWnd(heavenInfo){
        this.heavenInfo = heavenInfo
        this.showWnd()
    }
}