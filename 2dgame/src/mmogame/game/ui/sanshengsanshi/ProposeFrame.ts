class ProposeFrame extends BaseWnd {
    tabWndList: UITabWndList
	radioConfig;
	index : number
	name:string
	roleId:number
	roleSex:number

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/sanshengsanshi/ProposeLayout.exml"]
		this.index = 1
	}

    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		// this.mLayoutNode.setDoModal(true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "select_btn1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			{ ["name"]: "select_btn2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			{ ["name"]: "select_btn3", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },	
			{ ["name"]: "marry_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onMarryClick },	
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
		for(let i = 1;i<4;i++){
			//setAlignFlag(gui.Flag.CENTER_CENTER)
			this.mElemList["select"+i].visible = false
			this.mElemList["marry_rd"+i].setAlignFlag(gui.Flag.CENTER_CENTER)
			// let str = "#BIND_YUANBAO"+6666
			// AddRdContent(this.mElemList["marry_rd"+i], str, "ht_20_cc_stroke", "white")
			for(let j = 1;j<5;j++){
				this.mElemList["proposeItemBox_"+ i +"_"+j] = UIItemBox.newObj(this.mLayoutNode, "proposeItemBox_"+ i +"_"+j, 72 * (j-1), 0, this.mElemList["proposeItem"+i], 0.9)
			}
		}
	}

    public onUnLoad(): void {    
		
	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		this.index = 1
		this.onRefresh()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;

	}

	onRefresh(){
		
		let config = GameConfig.MarriageConfig
		for(let i = 1;i<4;i++){
			let goldText = "#YUANBAO"
			if(i == 1){
				goldText = "#BIND_YUANBAO"
			}
			
			let info = config[i+99]
			let prizeList = info.prize
			let itemList = AnalyPrizeFormat(prizeList)
			for(let j = 1;j<5;j++){
				let v = itemList[j-1]
				if(v){
					this.mElemList["proposeItemBox_"+ i +"_"+j].updateByEntry(v[0], v[1])
				}else{
					this.mElemList["proposeItemBox_"+ i +"_"+j].updateByEntry(-1)
				}
			}

			let str = info.cost + goldText
			AddRdContent(this.mElemList["marry_rd"+i], str, "ht_20_cc_stroke", "white")
		}
		
		for(let i = 1;i<4;i++){
			this.mElemList["select"+i].visible = (this.index == i)
		}

		let name = this.name
		AddRdContent(this.mElemList["name_rd"], name, "ht_24_cc", "lime")
	}

	onClick(args){
		let name = args.target.name
		let index = name.replace(/[^0-9]/ig, "")
		index = tonumber(index)
		this.index = index
		this.onRefresh()
	}

	onMarryClick(){
		//call
		//"C2G_Proposal":"uint32;uint32;uint8",	--被求婚者Id, 求婚类型, 1丈夫 2妻子
		//判断是否够消耗先
		let config = GameConfig.MarriageConfig
		let info = config[tonumber(this.index) + 99]
		if(info == null){
			return
		}
		let cost =  info.cost
		if(this.index == 1){
			let bindGold = GetHeroProperty("bindGold")
			if(bindGold<cost){
				MsgSystem.addTagTips(Localize_cns("LUCKY_TXT3"))
				ExecuteMainFrameFunction("chongzhi")
				return
			}
		}else{
			let curGold= GetHeroProperty("gold")
			if(curGold<cost){
				MsgSystem.addTagTips(Localize_cns("LUCKY_TXT4"))
				ExecuteMainFrameFunction("chongzhi")
				return
			}
		}

		let roleId = this.roleId
		let _type = this.index + 99 // this.index + 99? 100 101 102
		let roleSex = this.roleSex	//希望成为什么
		RpcProxy.call("C2G_Proposal",roleId,_type,roleSex)
		// MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT42"))
		this.hideWnd()
	}

	onShowAndSetData(name,roleId,roleSex){
		this.name = name
		this.roleId = roleId
		this.roleSex = roleSex
		this.showWnd()
	}
}