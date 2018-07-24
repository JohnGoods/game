// TypeScript file
class GodEquipCuilianWindow extends BaseCtrlWnd {
    
    public initObj(...params: any[]) {
		 
	}

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		var elemInfo = [
			{ ["name"]: "select_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSelectClick },
			{ ["name"]: "upgrade_level_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUpgradeClick },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
		// this.mElemList["world_level_rd"].setAlignFlag(gui.Flag.H_CENTER)
        

	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		// RegisterEvent(EventDefine.XIYOU_WELFARE, this.onRefresh, this)
		// RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
        this.mElemList["cuilian_group"].visible = true;  
        this.onRefresh()
	}

	public onHide(): void {
		// UnRegisterEvent(EventDefine.XIYOU_WELFARE, this.onRefresh, this)
		// UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mElemList["cuilian_group"].visible = false;
	}

    onRefresh(){
		let curEquipIndex = this.mParentWnd.selectIndex

	}

    onSelectClick(){

    }

    onUpgradeClick(){
        
    }
}
