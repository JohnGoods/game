class PetFrame extends BaseWnd {
	tabWndList: UITabWndList
	tabIndex: number
	petConfig: any;
	controlList: any[];
	petListBox: UIPetListBox;
	selectId: number;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/pet/PetLayout.exml"]

		this.tabIndex = -1

		this.petConfig = null
		this.controlList = []
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_tips", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTipsClick },
			{ ["name"]: "anim_wnd", ["messageFlag"]: true }
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let tabInfoList = [
			{ name: "tab1", wnd: PetUpgradeWindow.newObj(this.mLayoutNode, this) },
			{ name: "tab2", wnd: PetSkillWindow.newObj(this.mLayoutNode, this), check: this.skillCheck, obj: this },
			{ name: "tongling", wnd: PetTongLinWindow.newObj(this.mLayoutNode, this) },
			{ name: "shouhun", wnd: PetShouHunWindow.newObj(this.mLayoutNode, this) },
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

		this.tabWndList.setSelectedCallback(this.refreshDotTips, this)

		let group = <eui.Group>this.mElemList["pet_group"]
		this.petListBox = UIPetListBox.newObj(this.mLayoutNode, "pet", 0, 6, group.width, group.height, group)
		this.petListBox.setClickListner(this.autoReceiveSelect, this)
	}

	public onUnLoad(): void {

	}

	setPetList(){
		this.petListBox.setPetList();
	}

	public onShow(): void {
		RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.refreshDotTips, this)
		RegisterEvent(EventDefine.PET_UPDATE, this.setPetList, this)
        RegisterEvent(EventDefine.PET_LIST_UPDATE, this.setPetList, this)
		this.mLayoutNode.visible = true;

		this.selectId = this.petListBox.setPetList()
		this.tabWndList.setWndVisible(true);

		if (this.tabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}

		this.refreshFrame()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.refreshDotTips, this)
		UnRegisterEvent(EventDefine.PET_UPDATE, this.setPetList, this)
        UnRegisterEvent(EventDefine.PET_LIST_UPDATE, this.setPetList, this)
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);

		this.petConfig = null
		this.controlList = []

		this.petListBox.clearPetList()

		let actorView:UIActorView = this.mElemList["fun_model"]
		if(actorView){
			actorView.clearView()
		}
		FunUITools.clearActorData(this)
	}

	refreshFrame() {
		
	}

	autoReceiveSelect(petId) {
		this.selectId = petId

		let curIndex = this.tabWndList.getTabIndex()
		if (curIndex == 1) { //需要判断技能是否开启
			let petInfo = PetSystem.getInstance().getPetInfo(petId)
			if (petInfo == null) {
				this.tabWndList.changeTabWithIndex(0)
			}
		}

		this.tabWndList.getCurrentWnd().refreshFrameWithIndex(petId)
	}

	//////////////////////////////////////////
	skillCheck() {
		if (this.selectId) {
			let info = PetSystem.getInstance().getPetInfo(this.selectId)
			if (info) { //已经解锁
				return true
			} else { //没有解锁
				return false
			}
		} else {
			return false
		}
	}

	getPetId() {
		return this.selectId
	}

	////////////////////红点提示/////////////////////
	//自定义红点继承实现
	refreshDotTipsImp() {
		FunUITools.refreshDanDotTips(this.tabWndList.getCurrentWnd().soulType, this.tabWndList.getCurrentWnd())
		FunUITools.refreshEquipDotTips(this.tabWndList.getCurrentWnd().soulType, this.tabWndList.getCurrentWnd())
		FunUITools.refreshSkillDotTips(this.tabWndList.getCurrentWnd().soulType, this.tabWndList.getCurrentWnd())
		FunUITools.refreshUpgradeDotTips(this.tabWndList.getCurrentWnd().soulType, this.tabWndList.getCurrentWnd())
		FunUITools.refreshShootUpDotTips(this.tabWndList.getCurrentWnd().soulType, this.tabWndList.getCurrentWnd())
		FunUITools.refreshFunPrizeDotTips(this.tabWndList.getCurrentWnd().soulType, this.tabWndList.getCurrentWnd())

		this.tabWndList.getCurrentWnd().refreshPetDotTips()

		this.petListBox.refreshPetDotTips(this, this.tabWndList.getTabIndex())
	}

	// getDotTipsArgsImp(checkParam) {
	// 	let args: any = {}
	// 	args.index = this.tabWndList.getTabIndex()
	// 	args.type = this.tabWndList.getCurrentWnd().soulType
	// 	args.petId = this.selectId
	// 	return args
	// }

	onTipsClick(){
        let wnd = this.tabWndList.getCurrentWnd()
        if(wnd){
            wnd.onTipsClick()
        }
    }

	//////////////////////////////////////////
	showWithIndex(index) {
		this.tabIndex = index;
		this.showWnd();
	}
}