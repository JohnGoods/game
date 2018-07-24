class RoleFATFrame extends BaseWnd {
    tabWndList: UITabWndList
    tabIndex: number
	select;
	stage;
	jiHuoList;
    controlList;
    unreal;
    actor
    skinIndex 
    
    
    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/role/RoleFATLayout.exml"]
        this.tabIndex = -1
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_unreal", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUnrealClick},
			{ ["name"]: "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLeftClick },
            { ["name"]: "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRightClick },
			{ ["name"]: "btn_search", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSearchClick },
				];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		this.mElemList["rd_1"].setAlignFlag(gui.Flag.CENTER_TOP);
        this.mElemList["rd_2"].setAlignFlag(gui.Flag.LEFT_CENTER);
        this.mElemList["rd_3"].setAlignFlag(gui.Flag.LEFT_CENTER);
        //this.mElemList["rd_4"].setAlignFlag(gui.Flag.LEFT_CENTER);

		this.mElemList["itemBox"] = UIItemBox.newObj(this.mLayoutNode, "itemBox",0, -2, this.mElemList["group_rd2"])
		//this.mElemList["btn_unreal"].visible = false;

		for(let i = 1; i <= 5; i++){
			this.mElemList["group" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickSkin, this)
		}
		let tabInfoList = [
			{ name: "shizhuang", wnd: RoleFunTitleWindow.newObj(this.mLayoutNode, this) },
			{ name: "chenghao", wnd: RoleFunTitleWindow.newObj(this.mLayoutNode, this) },
			
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

        this.tabWndList.setSelectedCallback(this.refreshDotTips, this)

        this.actor = UIActorView.newObj(this.mLayoutNode, "_actor", 0, 0, this.mElemList["actor"])

        this.mElemList["link_view"] = UILinkView.newObj(this.mLayoutNode, "link_view", 0, 0, this.mElemList["link_group"])
	}
    public onUnLoad(): void {
        
	}

	public onShow(): void {
      //  RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true)
		this.tabWndList.setWndVisible(true);
       

		if (this.tabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}
	}

	public onHide(): void {
      //  UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = false;
        //this.mLayoutNode.setDoModal(false)
		this.tabWndList.setWndVisible(false);
		//let actorView:UIActorView = this.mElemList["actor"]
	    this.actor.clearView()
	}
    
    ///----------响应事件
	onLeftClick(event : egret.TouchEvent) {
        let wnd = this.tabWndList.getCurrentWnd()
        if(wnd){
            wnd.onLeftClick(event)
            this.refreshDotTips()
        }
    }
    onRightClick(event : egret.TouchEvent) {
        let wnd = this.tabWndList.getCurrentWnd()
        if(wnd){
            wnd.onRightClick(event)
            this.refreshDotTips()
        }
    } 
    
    onSearchClick(event : egret.TouchEvent){
        let wnd = this.tabWndList.getCurrentWnd()
        if(wnd){
            wnd.onSearchClick(event)
        }
    }

    onUnrealClick(event :egret.TouchEvent){
        let wnd = this.tabWndList.getCurrentWnd()
        if(wnd){
            wnd.onUnrealClick(event)
        }
	}
	
    showWithIndex(index) {
        this.tabIndex = index;
        this.showWnd();
    }
    
    onShowWnd(index, skinIndex){
        this.tabIndex = index
        this.skinIndex = skinIndex || -1
        this.showWnd()
    }

	onClickSkin(event: egret.TouchEvent) {
        let wnd = this.tabWndList.getCurrentWnd()
        if(wnd){
            wnd.onClickSkin(event)
        }
    }

    	////////////////////红点提示/////////////////////
	//自定义红点继承实现
	refreshDotTipsImp() {
        this.refreshIconDot()
        this.refreshBtnDot()
	}

    refreshIconDot(){
        let wnd = this.tabWndList.getCurrentWnd()
        if(wnd){
            wnd.refreshIconDot()
        }
	}

    refreshBtnDot(){
        let wnd = this.tabWndList.getCurrentWnd()
        if(wnd){
            wnd.refreshBtnDot()
        }
    }
}