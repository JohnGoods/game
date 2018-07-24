class LianYaoBonusFrame extends BaseWnd {
	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/lucky/LianYaoBonusLayout.exml"]
		
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();
        this.setAlignCenter(true, true)
		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
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
	}

	onRefresh() {
        let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.GOD_PET_TURN)
        if(activityInfo == null){
            return
        }
		let index = activityInfo.gType
		let config = GameConfig.GodPetTurnConfig[index]
		let rdText = ""
		for(let _ in config){
			let info = config[_]
			let entryId = info.prize[0][1]
			let itemConfig = ItemSystem.getInstance().getItemTemplateInfo(entryId)
			let itemName = itemConfig.name
			// let probability = Math.ceil(info.probability)
			let gailv = Math.floor(info.probability * 100)
			let str = String.format(Localize_cns("LUCKY_TXT15"),itemName,gailv) +"%#br"
			rdText = rdText + str
		}
		AddRdContent(this.mElemList["rd"], rdText, "ht_20_cc", "white",2)
	}
}