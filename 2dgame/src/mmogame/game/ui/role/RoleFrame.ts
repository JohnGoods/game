class RoleFrame extends BaseWnd {
    tabWndList: UITabWndList
    tabIndex: number
	Player : Player
    
    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/role/RoleLayout.exml"]
        this.tabIndex = -1
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		 	{ ["name"]: "btn_tips", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTipsClick },
			{ ["name"]: "anim_wnd", ["messageFlag"]: true }
				];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let tabInfoList = [
			{ name: "equips", wnd: RoleEquipsWindow.newObj(this.mLayoutNode, this) },
			{ name: "skills", wnd: RoleSkillsWindow.newObj(this.mLayoutNode, this) },
			{ name: "zuoqi", wnd: RoleMountsWindow.newObj(this.mLayoutNode, this) },
			{ name: "chibang", wnd: RoleWingsWindow.newObj(this.mLayoutNode, this) },
			
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

		this.tabWndList.setSelectedCallback(this.refreshDotTips, this)
	}
    public onUnLoad(): void {
		
	}

	public onShow(): void {
		RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.refreshDotTips, this)
		//RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		//RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = true;
		if (this.tabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}
		this.tabWndList.setWndVisible(true);
       

		//隐藏直升一阶
		// let day = GetServerDay()
		// this.mElemList["btn_M_shootUp"].visible = (day <= 8)
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.refreshDotTips, this)
		//UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		//UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);
		
		let funActor:UIActorView = this.mElemList["fun_model"]
		if(funActor){
			funActor.clearView()
		}
		
		let actorView:UIActorView = this.mElemList["actorview"]
		if(actorView){
			actorView.clearView()
		}
		FunUITools.clearActorData(this)
	}

	/*onRefresh(){
		let wnd = this.tabWndList.getCurrentWnd()
        if (wnd) {
            wnd.onRefresh()
        }
		//隐藏直升一阶
		let day = GetServerDay()
		this.mElemList["btn_M_shootUp"].visible = (day <= 8)
		
	}*/
    ////////////////////红点提示/////////////////////
	//自定义红点继承实现
	refreshDotTipsImp() {
		FunUITools.refreshDanDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshEquipDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshSkillDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshUpgradeDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshSkinDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshShootUpDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshFunPrizeDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		this.refreshIconDot()
	}

	getDotTipsArgsImp(checkParam) {
		let args: any = {}
		args.index = this.tabWndList.getTabIndex()
		args.type = this.tabWndList.getCurrentWnd().type
		return args
	}

	refreshIconDot(){
		for(let k = 1; k <= 4; k++){
			let check = GuideFuncSystem.getInstance().checkFabao(k)
			if(check){
				this.createDotTipsUI(this.mElemList["fabao_" + k])
			}
		}
	}

	onTipsClick(){
        let wnd = this.tabWndList.getCurrentWnd()
        if(wnd){
            wnd.onTipsClick()
        }
    }

	 showWithIndex(index) {
        this.tabIndex = index;
        this.showWnd();
    }
}