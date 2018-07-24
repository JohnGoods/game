class GoldSmeltFrame extends BaseWnd {
	mElemList;
    select:any;
    scroll:UIScrollList
    controlData 

    static GOLD_EQUIP_FENJIE_ITEM = 60007
    //static GOLD_EQUIP_ITEM_QUALITY = 5
	
	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/godEquip/GoldSmeltLayout.exml"]
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.mLayoutNode.width = 600
        this.mLayoutNode.height = 728
        this.setAlignCenter(true, true)
		this.initSkinElemList();

        var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "tip1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGoVipClicked },
            
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        let list: eui.List = this.mElemList["item_list"]
        list.itemRenderer = itemRender.ShopGoldSmeltItem
        
      /*  let group: eui.Group = this.mElemList["group_scroll"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)*/
        
        this.select = -1

        this.mElemList["rd_had"].setAlignFlag(gui.Flag.LEFT_CENTER)
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
        RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
        this.mLayoutNode.visible = true;
		//this.mLayoutNode.setDoModal(true)
        this.onRefresh()
    }

	public onHide(): void {
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
        this.mLayoutNode.visible = false;
		//this.mLayoutNode.setDoModal(false)
	}

    onRefresh(){
        
        let hadStr = "#SHENZHUANG" + ItemSystem.getInstance().getItemCount(GoldSmeltFrame.GOLD_EQUIP_FENJIE_ITEM)
        AddRdContent(this.mElemList["rd_had"], hadStr, "ht_24_cc")

        let showList = ItemSystem.getInstance().getGoldEquipSmeltList(opEquipQuality.red)
        
        let item_list: eui.List = this.mElemList["item_list"]
        UiUtil.updateList(item_list, showList);
    }
    onGoVipClicked(){
        ExecuteMainFrameFunction("chongzhi")
    }
}