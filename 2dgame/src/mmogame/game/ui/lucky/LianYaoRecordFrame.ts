class LianYaoRecordFrame extends BaseWnd {
	activityIndex:number;
	scroll: UIScrollList;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/lucky/LianYaoRecordLayout.exml"]
		this.activityIndex = PayActivityIndex.GOD_PET_TURN
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();
        this.setAlignCenter(true, true)
		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let list: eui.List = this.mElemList["list_group"]
        list.itemRenderer = itemRender.LianYaoRecordItem
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
		// let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex)
        let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(this.activityIndex)
        if(activityInfo == null){
            return
        }
		let reachList = activityInfo.reachList
		let maxNum = 10	//限制

		let list = []
		for(let i = 0; i < size_t(reachList); i++){
			if(i < maxNum){
				table_insert(list,reachList[i])
			}
		}

		let list_record: eui.List = this.mElemList["list_group"]
        UiUtil.updateList(list_record, list);
	}

}


module itemRender {
    export class LianYaoRecordItem extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}
            let name = this.name
            let w = 450
            let h = 45

            let mElemInfo: any = [
				{ ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["title"]: null, ["font"]: null, ["image"]: "", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, },
                { ["index_type"]: gui.Grid9Image, ["name"]: "line", ["title"]: null, ["font"]: null, ["image"]: "cz_uiLine01", ["color"]: null, ["x"]: 10, ["y"]: 30, ["w"]: 430, ["h"]: 16, },
                { ["index_type"]: gui.RichDisplayer, ["name"]:  "rd", ["title"]: "", ["font"]: "ht_24_cc", ["color"]: gui.Color.white, ["x"]: 15, ["y"]: 5,["w"]: 430, ["h"]: 24, ["messageFlag"]: true },
            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)
        }

        protected dataChanged(): void {
            let v = this.data;
			let rd = this.mElemList["rd"]
			let name = v[0]
			let entryId =  v[1]
			let itemConfig = ItemSystem.getInstance().getItemTemplateInfo(entryId)
			let itemName = itemConfig.name
			let color = "#" + GetQualityColorStr(itemConfig.quality)
			let str = color + itemName
			let rdStr = String.format(Localize_cns("LUCKY_TXT14"),name,str)
        	AddRdContent(rd, rdStr, "ht_20_cc_stroke", "white")
        }
    }
}