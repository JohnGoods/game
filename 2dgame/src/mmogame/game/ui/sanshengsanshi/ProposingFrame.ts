class ProposingFrame extends BaseWnd {
	marryInfo
	type
    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/sanshengsanshi/ProposingLayout.exml"]
	}

    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		//this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true, true)

		var elemInfo = [
			{ ["name"]: "btn_ok", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onOkClick },
			{ ["name"]: "btn_no", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onNoClick },
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
		this.mElemList["msg_rd1"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["msg_rd2"].setAlignFlag(gui.Flag.H_CENTER)
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
	//this.marryInfo	
	// {spouse:getId(), 
	// spouse:getName(),
	// spouse:getVocation(),
	// spouse:getSex(), 
	// spouse:getVipLevel(), 
	// spouse:getForce(), 
	// spouse:getLevel(),
	// facId}	
	   let qiuhunId = this.marryInfo[0]
       let _type = this.type
	   let name = this.marryInfo[1]
	   let typeText = Localize_cns("SANSHENG1_TXT"+_type)
	   AddRdContent(this.mElemList["msg_rd1"],String.format(Localize_cns("SANSHENG_TXT3"),name), "ht_24_cc", "zongse",6)
	   AddRdContent(this.mElemList["msg_rd2"],String.format(Localize_cns("SANSHENG_TXT40"),typeText), "ht_24_cc", "zongse",6)	
	}

	onOkClick(){
		RpcProxy.call("C2G_PromiseMarry",this.marryInfo[0],this.type,1)
		this.hideWnd()
	}

	onNoClick(){
		RpcProxy.call("C2G_PromiseMarry",this.marryInfo[0],this.type,0)
		this.hideWnd()
	}

	setAndOpenFrame(marryInfo,type){
		// this.id = id
		// this.name = name
		
		this.marryInfo = marryInfo
		this.type = type
		this.showWnd()
	}
}