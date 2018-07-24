class RoleFaBaoFrame extends BaseWnd {
    tabWndList: UITabWndList
    tabIndex: number
	selectIndex : number
	actor : UIActorView
    
    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/role/RoleFaBaoLayout.exml"]
        this.tabIndex = -1
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_quality", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onQualityClick },
			{ ["name"]: "btn_tips", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTipsClick },
			{ ["name"]: "image_select_1", ["messageFlag"] :true },
			{ ["name"]: "image_select_2", ["messageFlag"] :true },
			{ ["name"]: "image_select_3", ["messageFlag"] :true },
			{ ["name"]: "image_select_4", ["messageFlag"] :true },
			
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let tabInfoList = [
			{ name: "fabao1", wnd: FaBaoFaBaoWindow.newObj(this.mLayoutNode, this) },
			{ name: "tab_2", wnd: FaBaoUpgradeWindow.newObj(this.mLayoutNode, this) },
			{ name: "tab_3", wnd: FaBaoDaZaoWindow.newObj(this.mLayoutNode, this) },
			{ name: "tab_4", wnd: FaBaoFenJieWindow.newObj(this.mLayoutNode, this) },
			
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)
		this.tabWndList.setSelectedCallback(this.refreshDotTips, this)

		this.actor = UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["actor"])

		for(let k = 1; k <= 4 ; k++){
			let group : eui.Group = this.mElemList["fabao_" + k]
			group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFaBaoClick, this)
		}
	}
    public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.ACTOR_ROLE_FABAO_UPDATE, this.onRefresh, this)
		RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = true;
		this.tabWndList.setWndVisible(true);
       

		if (this.tabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ACTOR_ROLE_FABAO_UPDATE, this.onRefresh, this)
		UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);
		this.actor.clearView()
		
	}

	onRefresh(){
		let wnd = this.tabWndList.getCurrentWnd()
		if(wnd){
			wnd.onRefresh()
		}
	}
	////--------刷新元宝显示
	refreshFaBaoItem(){

		let fabaoInfo = RoleSystem.getInstance().getFaBaoInfo() //"talismanLevelList:table", "talismanlist:table"
		if(fabaoInfo == null) return 
		let levelList = fabaoInfo["talismanLevelList"]	
		if(levelList == null) return 
		for(let k = 1; k <= 4; k++){
			let item  : Item = RoleSystem.getInstance().getFaBaoItem(k)
			let source = ""
			let name = Localize_cns("FABAO_NAME")
			let qualityImage = ""
			if(item == null){
				let level = GetHeroProperty("level")
				let vip = GetHeroProperty("VIP_level")
				let VIPUnLockList = opTailsmanPosLimit.VIPUnLockList
			
				let levelUnLockList = opTailsmanPosLimit.levelUnLockList
				let unLock = false
				source = "ty_faBaoDi_suo0" + k
				name = ""
				if (level >= levelUnLockList[k - 1] || vip >= VIPUnLockList[k - 1]) {
					source = "ty_faBaoDi_weizhuangbei"
					name = Localize_cns("FABAO_NAME")
				}
				this.mElemList["image_sprite_" + k].source = source
				this.mElemList["label_level_" + k].visible = false
				this.mElemList["level_bg_" + k].visible = false
				if (name != "") {
					this.mElemList["name_" + k].textColor = gui.Color.white
					this.mElemList["name_" + k].text = name
					this.mElemList["name_" + k].visible = true //name_bg_2
					this.mElemList["name_bg_" + k].visible = true
				}else{
					this.mElemList["name_" + k].visible = false
					this.mElemList["name_bg_" + k].visible = false
				}
				continue
			}
			source = GetFaBaoIcon(item.entryId)
			qualityImage = GetFaBaoQualutyImage(item.getProperty("quality") || 1)
			this.mElemList["image_sprite_" + k].addEventListener(egret.TouchEvent.TOUCH_TAP,this.onOpenTipsClick, this)
			name  = item.getName()
			this.mElemList["image_di_" + k].source = qualityImage
			this.mElemList["image_sprite_" + k].source = source
			this.mElemList["label_level_" + k].visible = true
			this.mElemList["level_bg_" + k].visible = true
			this.mElemList["label_level_" + k].text = levelList[k + opTalismanEquipPos.begin - 1] || 0
			let fontColor = GetQualityColorGui(item.getProperty("quality"))
			//if(fontColor == gui.Color.purple){
			//	fontColor = gui.Color.deeppink
			//}
			//if(fontColor == gui.Color.blue){
			//	fontColor = gui.Color.lightskyblue
			//}
			this.mElemList["name_" + k].textColor = fontColor
			this.mElemList["name_" + k].text = name
		}
	}


	///--------------响应事件
	onQualityClick(){
		let wnd : RoleFaBaoQualityFrame = WngMrg.getInstance().getWindow("RoleFaBaoQualityFrame")
		wnd.showWithIndex(0)
	}

	onFaBaoClick(args : egret.Event){
		let wnd = this.tabWndList.getCurrentWnd()
        if (wnd) {
			if(wnd.onFaBaoClick == null) return 
            wnd.onFaBaoClick(args)
        }
	}

	onOpenTipsClick(args ){
		let name = args.target.name
		let index  = name.replace(/[^0-9]/ig, "")
		if (this.selectIndex != index) return;
		let item  : Item = RoleSystem.getInstance().getFaBaoItem(tonumber(index)) 
		if(item == null) return 
		let wnd : FaBaoItemTipsFrame = WngMrg.getInstance().getWindow("FaBaoItemTipsFrame")
		wnd.onShowHeroFaBao(item, true, tonumber(index))
		//wnd.onLinkShow(tonumber(index))
	}


	onTipsClick(){
		let wnd = this.tabWndList.getCurrentWnd()
        if (wnd) {
            wnd.onTipsClick()
        }
	}


	 showWithIndex(index, seletIndex?) {
        this.tabIndex = index;
		this.selectIndex = seletIndex || 1
        this.showWnd();
    }

	//////////////---------------自定义红点
	refreshDotTipsImp(){
		this.refreshIconDot()
	}

	refreshIconDot(){
		for(let k = 1; k <= 4; k++){
			let check = GuideFuncSystem.getInstance().checkFabao(k)
			if(check){
				this.createDotTipsUI(this.mElemList["fabao_" + k])
			}
		}
	}
}