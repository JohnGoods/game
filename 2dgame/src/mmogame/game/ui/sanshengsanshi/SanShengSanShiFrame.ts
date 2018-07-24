class SanShengSanShiFrame extends BaseWnd {
    tabWndList: UITabWndList
	radioConfig;
	activityIndex : number
	tabIndex:number
	masterIndex:number
	marryIndex:number

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/sanshengsanshi/SanShengLayout.exml"]
		this.tabIndex = -1
		this.masterIndex = -1
		this.marryIndex = -1
	}

    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
        this.initSkinElemList();
		// this.mLayoutNode.setDoModal(true)

		this.mElemList["group1"].visible = false;
		this.mElemList["group2"].visible = false;
		this.mElemList["group3"].visible = false;
		this.mElemList["btn_rule"].visible = false;
		this.mElemList["weiwang_shop"].visible = false;
		this.mElemList["marry_rule"].visible = false;

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			
			// { ["name"]: "lucky_btn2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			// { ["name"]: "lucky_btn3", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let tabInfoList = [
			{ name: "radio1", wnd: MarryWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab1Click, },
			{ name: "radio2", wnd: HouseWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab2Click, },
			{ name: "radio3", wnd: MasterWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab3Click, },
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

		// for (let i = 1; i<4; i++) {
		// 	let rd = this.mElemList["lucky_rd"+i]
		// 	rd.setAlignFlag(gui.Flag.H_CENTER)
		// }
	}

    public onUnLoad(): void {    
		
	}

	public onShow(): void {
		// RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = true;
		// this.onRefresh()
		RpcProxy.call("C2G_UpdateHourse")	//房子信息 为了不让他可以跳过去...
		this.tabWndList.setWndVisible(true);
		if((GetHeroProperty("spouseId")>0) && GetHeroProperty("spouseId")!=null){
			this.marryIndex = 1
		}

		this.onRefresh()
	}

	public onHide(): void {
		// UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);
		this.masterIndex = -1
		this.marryIndex = -1
	}

	onRefresh(){
		if (this.tabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
			this.tabIndex = -1
		}else if(this.marryIndex != -1){
			this.tabWndList.changeTabWithIndex(this.marryIndex)
		}
	}

	initItemWindow(window,data){
	
	}

	refreshItemWindow(window, data){

	}

	onClick(args){
		let name = args.target.name
		let index = name.replace(/[^0-9]/ig, "")	//选择的是第几个按钮
		index = tonumber(index)
		let info = this.radioConfig[index-1] || null
		if(info == null){
			return
		}

		let bindGold = GetHeroProperty("bindGold")
		let curGold= GetHeroProperty("gold")
		// let config = info.config[index]
		let typeS =  info[1]
		let needNum = info[2]
		if(typeS == opItemUnit.BIND_CURRENCY){
			if(needNum > bindGold){
				MsgSystem.addTagTips(Localize_cns("LUCKY_TXT3"))
				return
			}
		}else if(typeS == opItemUnit.CURRENCY){
			if(needNum > curGold){
				MsgSystem.addTagTips(Localize_cns("LUCKY_TXT4"))
				return
			}
		}

		RpcProxy.call("C2G_DoOperateActivity",this.activityIndex,[index])	//抽奖
	}

	onTab1Click(){
		return true
	}

	onTab2Click(){
		let houseInfo = ActivitySystem.getInstance().getHouseInfo()
		if(houseInfo && houseInfo.houseData && houseInfo.houseData.stage){
			if(houseInfo.houseData.stage != 0){
				return true
			}	 
		}
		MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT35"))
		return false
	}

	onTab3Click(){
		return true
	}

	showWithIndex(index,masterIndex) {
        this.tabIndex = index;
		if(index == 2 && masterIndex!=null){
			this.masterIndex = masterIndex
		}
        this.showWnd();
    }
}