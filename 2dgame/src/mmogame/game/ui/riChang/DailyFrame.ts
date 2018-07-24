class DailyFrame extends BaseWnd {
    tabWndList: UITabWndList
    tabIndex: number
    npcIndex

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/DailyLayout.exml"]
        this.tabIndex = -1
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			
		//	{ ["name"]: "btn_kill", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onKillClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let tabInfoList = [
			{ name: "tab0", wnd: DailyXiangYaoWindow.newObj(this.mLayoutNode, this) , check:this.xiangYaoClick, obj:this},			
			{ name: "tab1", wnd: DailyZuDuiWindow.newObj(this.mLayoutNode, this), check:this.zuDuiClick, obj:this },
			{ name: "tab2", wnd: DailySanBaiWindow.newObj(this.mLayoutNode, this) , check:this.sanBaiClick, obj:this},
			{ name: "xiyoulilian", wnd: DailyXiYouWindow.newObj(this.mLayoutNode, this), check:this.xiYouClick, obj:this },
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

		this.tabWndList.setSelectedCallback(this.refreshDotTips, this)
	}
    public onUnLoad(): void {
	
	}


	public onShow(): void {
		RegisterEvent(EventDefine.ACTIVITY_STATE_LIST, this.checkDouble, this)
		this.mLayoutNode.visible = true;
		this.tabWndList.setWndVisible(true);
        //this.mLayoutNode.setDoModal(true)
		if (this.tabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}

		RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.ZhongKuiDemon)
		RpcProxy.call("C2G_ZUDUILILIAN_GOCOMBAT")  
		RpcProxy.call("C2G_MEIRISANBAI_MonsterNum") 
		let check = CheckMainFrameFunction(GuideFuncDefine.FIELD_FUNC_XIYOULILIAN)
		if(check[0]){
			RpcProxy.call("C2G_XiyouLilian_Info")
		}	 

		//双倍奖励
        this.checkDouble()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ACTIVITY_STATE_LIST, this.checkDouble, this)
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);
		//this.mLayoutNode.setDoModal(false)
	}

	updateWnd(){
		let wnd = this.tabWndList.getCurrentWnd()
        if (wnd) {
            wnd.updateWnd()
        }
		this.refreshDotTips()
	}

	////---------------检查
	xiangYaoClick(){
		return true
	}
	
	zuDuiClick(){
		return true
	}

	sanBaiClick(){
		return true
	}

	xiYouClick(){
		return true
	}

	///
	checkDouble() {
        let checkDouble = GuideFuncSystem.getInstance().checkDailyZuDuiIsDouble()
        if (checkDouble) {
            this.mElemList["image_double"].visible = true
        } else {
            this.mElemList["image_double"].visible = false
        }
    }


	/////////////自定义红点
	refreshDotTipsImp(){
		let wnd = this.tabWndList.getCurrentWnd()
		let index = this.tabWndList.getTabIndex()
        if (wnd && (index != 3)) {
            wnd.updateWnd()
			this.refreshBtnDots()
        }
	}

	refreshBtnDots(){
		let index = this.tabWndList.getTabIndex()
		let check = false
		if(index == 0){
			check = GuideFuncSystem.getInstance().checkDailyXiangYao()
		}else if(index == 1){
			check = GuideFuncSystem.getInstance().checkDailyZuDui()
		}else{
			check = GuideFuncSystem.getInstance().checkDailySanBai()
		}

		if(check){
			if(index == 2){
				this.createDotTipsUI(this.mElemList["btn_kill"])
			}else{
				this.createDotTipsUI(this.mElemList["btn_oneKey"])
			}	
		}
	}

	////////////////////外部显示
	showWithIndex(index){
		this.tabIndex = index
		this.showWnd()
	}
}// TypeScript file