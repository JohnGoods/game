class TianNvXianQiWindow extends BaseCtrlWnd {
	mElemList;
    select:any;
	list:any;
	unreal:any;
    recvList:any;
	endIndex:any
	isEnough;
	type

	isAuto: boolean;
	
	public initObj(...params: any[]) {
		this.type = cellOptionsIndex.TianNvXianQi
	}
    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
	
		var elemInfo = [
			{ ["name"]: "btn_property_dan", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPropertyClick },
			{ ["name"]: "btn_search", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSearchClick },
			{ ["name"]: "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLeftClick },
			{ ["name"]: "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRightClick },
			{ ["name"]: "btn_unreal", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUnrealClick },
			{ ["name"]: "btn_upgrade", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUpClick },
			{ ["name"]: "btn_auto_upgrade", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAutoUpClick },
			{ ["name"]: "btn_equip", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onEquipClick },
			{ ["name"]: "fun_prize_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFunPrize },
			];
			
		 UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
		 
         this.select = 0;
	  

		 this.mElemList["rd_add_force"].setAlignFlag(gui.Flag.CENTER_CENTER);
		 this.mElemList["stage_txt"].textColor = gui.Color.ublack;

		
		
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		RegisterEvent(EventDefine.PET_FUN_INFO_REFRESH, this.onRefresh, this)
		RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.updateFrame, this)
		RegisterEvent(EventDefine.FUN_AUTO_FAIL, this.stopAutoUpgrade, this)
		RegisterEvent(EventDefine.PET_FUN_TOP_UPDATE, this.updateTopWnd, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCost, this)
		this.mElemList["group_tiannv"].visible = true;
		this.mElemList["label_wndName"].text = Localize_cns("TIANNV_TITLE_TXT2");
		this.mElemList["TianNv_checkbox"].visible = false
		this.mElemList["TianNvXianQi_checkbox"].visible = true
		this.mElemList["TianNvHuaNian_checkbox"].visible = false
		this.mElemList["TianNvLingQi_checkbox"].visible = false
		FunUITools.resetUpgradeBtnState(this.type, this, "btn_auto_upgrade", "btn_upgrade")
		this.onRefresh()
		this.onRefreshTop()
		FunUITools.checkExpDan(this.type, this)
		this.mElemList["xianqi_icon"].visible = true
		this.mElemList["actor_wnd"].visible = false
		//this.mElemList["tiannv_actor"].visible = false

		this.mElemList["image_skill"].source = "tn_text03"
		this.mElemList["image_equip"].source = "tn_text04"
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PET_FUN_INFO_REFRESH, this.onRefresh, this);
		UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.updateFrame, this);
		UnRegisterEvent(EventDefine.FUN_AUTO_FAIL, this.stopAutoUpgrade, this)
		UnRegisterEvent(EventDefine.PET_FUN_TOP_UPDATE, this.updateTopWnd, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateCost, this)
		this.mElemList["group_tiannv"].visible = false;

		/*if(this.mElemList["fun_model"]){
			this.mElemList["fun_model"].clearView()
		}*/

		this.mElemList["xianqi_icon"].visible = false
		this.mElemList["actor_wnd"].visible = true
		//this.mElemList["tiannv_actor"].visible = true
		this.isAuto = false
		this.select = null
	}

	updateTopWnd(args? : FunTurnUpdateEvent) {
		if(args && args.funIndex == this.type && args.isLevelUp){
			this.select = null
		}
		this.onRefreshTop()
	}

	updateCost(){
		FunUITools.updateNeedMaterial(this.type, this)
	}


	updateFrame() {
		this.onRefresh()

		if (this.isAuto) {
			let info = FunSystem.getInstance().getFunInfoWithType(this.type)
			if (info && info.stageexp == 0) {
				FunUITools.resetUpgradeBtnState(this.type, this, "btn_auto_upgrade", "btn_upgrade")
			} else {
				FunUITools.upgradeAutoFunctionCheck(this.type, this, "btn_auto_upgrade", "btn_upgrade")
			}
		}
	}
    
	onRefresh(){
		let info = FunSystem.getInstance().getFunInfoWithType(this.type)
		if (size_t(info) == 0) return;
		this.mElemList["btn_skin"].visible = false
		
        //this.onRefreshTop();
		//本级经验 现在经验
		FunUITools.updateExpProgress(this.type, this)
        
		//消耗
		FunUITools.updateNeedMaterial(this.type, this)
        
		//更新战力
		FunUITools.updateForceNum(this.type,this)
		
		//
		this.onInitItemBox();
		
		let templist = FunUITools.checkWearEquip(this.type, this)
		if(size_t(templist) == 0){
			this.mElemList["btn_equip"].visible = false
		}else{
			this.mElemList["btn_equip"].visible = true
		}

		//满级检测
		FunUITools.checkFullLevel(this.type, this, "btn_auto_upgrade", "btn_upgrade", "full_lv_txt")

	}
   onRefreshTop(){

	   	let info = FunSystem.getInstance().getFunInfoWithType(this.type)
		if (size_t(info) == 0) return;
		this.list = GameConfig.FunShapeConfig[cellOptionsName[this.type - 1]];
		let stage = info.stage
		this.endIndex = stage + 1;
		this.unreal = info.curshape
		this.select = this.select || stage
		let arr = this.list;
		if (size_t(arr) == 0) return;
		let index = this.select

		if(arr[this.select]){
		    //更新名字，阶数
			FunUITools.updateActorStage(this.type, this, this.select)
		}

	    this.mElemList["group_effect"].visible = false;
		this.mElemList["turn_icon"].visible = false;
		this.mElemList["btn_unreal"].visible =false;
		this.mElemList["btn_right"].enabled = true
		this.mElemList["btn_left"].enabled = true

        if(index == this.unreal ){
		   this.mElemList["turn_icon"].visible = true;
        }else if (index == this.endIndex ) {
		   this.mElemList["group_effect"].visible = true;
		   this.mElemList["btn_right"].enabled = false
		   FunUITools.updateAddForceNum(this.type, this)
		}else{
			this.mElemList["btn_unreal"].visible =true;

		}

		if(this.select == 1){
			this.mElemList["btn_left"].enabled = false
	//	}else if(this.select == this.endIndex){		
		}
		this.mElemList["btn_left"].visible = true
		this.mElemList["btn_right"].visible = true
		
		let maxLevel = FunSystem.getInstance().getFunMaxLevel(this.type)
		if (this.select >= maxLevel){
			this.mElemList["btn_right"].enabled = false
		}

		//更新actorview
		//FunUITools.updateActorModel(this.type, this, this.select)
		//更新actorview
		let image = GetShapeImage(arr[this.select].Shape)
		let tiannvId = FunSystem.getInstance().getTianNvId()
		this.mElemList["tiannv_actorView"].updateByPlayer(tiannvId)
		this.mElemList["xianqi_icon"].source = image
   }
  
   onInitItemBox(){
	   
      FunUITools.updateEquipWnd(this.type, this)
	  //更新技能 
	  let typelist = [
		//  cellOptionsIndex.TianNv ,
	      cellOptionsIndex.TianNvXianQi ,
	    //  cellOptionsIndex.TianNvHuaNian ,
	    //  cellOptionsIndex.TianNvLingQi 
	  ]
      this.mElemList["fun_skill_wnd1"].visible = false
      this.mElemList["fun_skill_wnd2"].visible = true
	  FunUITools.updateTianNvSkillWnd(typelist, this, this.mElemList["fun_skill_wnd2"], "lingqiskill")

	  for(let i = 0; i < size_t(typelist); i++){
		  this.mElemList["lingqiskill" + i].setClickCallBack(this.onShowFunFrame, this, [typelist, i])
	  }
	   
   }
  
   onShowFunFrame(list){
       let typelist = [
		  cellOptionsIndex.TianNv ,
	      cellOptionsIndex.TianNvXianQi ,
	      cellOptionsIndex.TianNvHuaNian ,
	      cellOptionsIndex.TianNvLingQi 
	  ]
	    let wnd = WngMrg.getInstance().getWindow("FunSkillFrame")
		wnd.showWithTypeListAndIndex(typelist, 1)
   }

    public onUnrealClick():void{
		if(this.mParentWnd.tabWndList.getTabIndex() == 1){
			//this.unreal = this.select;
        	//this.onRefreshTop();
			FunUITools.sendTurnRequest(this.type, this.select)
		}  
	}


	public onRightClick(): void {
		if(this.mParentWnd.tabWndList.getTabIndex() == 1){
			if(this.select == this.endIndex || this.select == -1 )  return;
			this.select = this.select +1;
			this.onRefreshTop();
		}
	}
	public onLeftClick(): void {
		if(this.mParentWnd.tabWndList.getTabIndex() == 1){
			if(this.select == 1 || this.select == -1) return;
			this.select = this.select - 1;
			this.onRefreshTop();
		}
	}
	public onPropertyClick():void{
		if(this.mParentWnd.tabWndList.getTabIndex() == 1){
			FunUITools.openPropertyFrame(this.type)	
		}
	}
	onUpClick(){
		if(this.mParentWnd.tabWndList.getTabIndex() == 1){
			FunUITools.upgradeFunction(this.type, this, "btn_auto_upgrade", "btn_upgrade")
		}
	}
	onAutoUpClick(){
		if(this.mParentWnd.tabWndList.getTabIndex() == 1){
			FunUITools.upgradeAutoFunction(this.type, this, "btn_auto_upgrade", "btn_upgrade")
		}
	}

	onEquipClick(){
		if(this.mParentWnd.tabWndList.getTabIndex() == 1){
			let templist = FunUITools.checkWearEquip(this.type, this)
			FunUITools.oneKeyWearEquip(this.type, this, templist)
		}
	}

	public onSearchClick():void{
	   if(this.mParentWnd.tabWndList.getTabIndex() == 1){
			FunUITools.openFunPropertyFrame(this.type, this.select)
		}
	}

	stopAutoUpgrade(args) {
		if (args.funType == this.type) {
			FunUITools.upgradeAutoFunctionCheck(this.type, this, "btn_auto_upgrade", "btn_upgrade")
		}
	}

	onTipsClick(){
        let wnd  = WngMrg.getInstance().getWindow("RuleDescribeFrame")
        wnd.showWithActivity("xianqiRule")
    }

	onClickFunPrize() {
		if (this.mParentWnd.tabWndList.getTabIndex() == 1) {
			FunUITools.openUpgradeFunPrize(this.type)
		}
	}
}