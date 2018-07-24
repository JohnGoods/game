class MarryTipFrame extends BaseWnd {
	playerInfo
	petBox1: UIPetBox;
	petBox2: UIPetBox;

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/sanshengsanshi/MarryTipLayout.exml"]
	}

    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		//this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true, true)
		var elemInfo = [
			{ ["name"]: "btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
		this.petBox1 = UIPetBox.newObj(this, "petBox1", -10, -10, this.mElemList["role1_group"], 0.8)
		this.petBox2 = UIPetBox.newObj(this, "petBox2", -10, -10, this.mElemList["role2_group"], 0.8)
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

	onRefresh(){
		let myName = GetHeroProperty("name")
		let myVocation = GetHeroProperty("vocation")
		let sexId = GetHeroProperty("sexId")
		this.mElemList["role1_name1"].text = myName
		this.mElemList["role1_name2"].text = this.playerInfo[0]
		this.petBox1.updateRoleInfo(myVocation, sexId)
		this.petBox2.updateRoleInfo(this.playerInfo[2], this.playerInfo[1])
	}

	onClick(){
		//打开房屋界面
		this.hideWnd()
		let wnd = WngMrg.getInstance().getWindow("SanShengSanShiFrame")
		wnd.showWithIndex(1)
	}

	setAndOpenFrame(playerInfo){
		this.playerInfo = playerInfo
		this.showWnd()
	}
}