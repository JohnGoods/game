class MarryInformFrame extends BaseWnd {
    tabWndList: UITabWndList
	radioConfig;
	activityIndex : number
	info:any[]

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/sanshengsanshi/MarryInformLayout.exml"]
	}

    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		//this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true,false);


		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "giveGiftBtn1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			{ ["name"]: "giveGiftBtn2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			{ ["name"]: "giveGiftBtn3", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
		for(let i=1;i<4;i++){
			this.mElemList["item_Box"+ i] = UIItemBox.newObj(this.mLayoutNode, "item_Box"+ i, 0, 0, this.mElemList["item_group"+i], 0.9)
			this.mElemList["gits_rd"+i].setAlignFlag(gui.Flag.CENTER_CENTER)
		}
		this.mElemList["marry_rd"].setAlignFlag(gui.Flag.CENTER_CENTER)
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
		let config = GameConfig.MarriageGiftConfig
		for(let i=1;i<4;i++){
			let info = config[i+99]
			let count = info.giftCost
			let prizeList = info.gift
			let itemList = AnalyPrizeFormat(prizeList)
			if(itemList[0]){
				this.mElemList["item_Box"+ i].updateByEntry(itemList[0][0], itemList[0][1])
			}else{
				this.mElemList["item_Box"+ i].updateByEntry(-1)
			}

			let goldText = "#YUANBAO"
			if(i == 1){
				goldText = "#BIND_YUANBAO"
			}
			let str = info.giftCost + goldText
			AddRdContent(this.mElemList["gits_rd"+i], str, "ht_20_cc_stroke", "white")
		}
		let name1 = this.info["name1"]
		let name2 = this.info["name2"]

		let text = String.format(Localize_cns("SANSHENG_TXT5"),name1,name2)
		AddRdContent(this.mElemList["marry_rd"], text, "ht_20_cc", "white")
	}

	onClick(args){
		let name = args.target.name
		let index = name.replace(/[^0-9]/ig, "")	//选择的是第几个按钮
		index = tonumber(index)
		let id1 = this.info["id1"]
		let id2 = this.info["id2"]
		let _type = index + 99
		//送礼前 先判断是否满足条件
		let config = GameConfig.MarriageGiftConfig
		let info = config[_type]
		let needGold = info.giftCost
		
		if(index == 1){
			let curBindGold =GetHeroProperty("bindGold")
			if(curBindGold<needGold){
				MsgSystem.addTagTips(Localize_cns("LUCKY_TXT3"))
				return
			}
		}else{
			let curGold = GetHeroProperty("gold")
			if(curGold<needGold){
				MsgSystem.addTagTips(Localize_cns("LUCKY_TXT4"))
				return
			}
		}
		RpcProxy.call("C2G_MarryGift",id1,id2,_type)
		this.hideWnd()	//退出了
	}

	showAndSetData(id1,id2,name1,name2){
		this.info["id1"] = id1
		this.info["id2"] = id2
		this.info["name1"] = name1
		this.info["name2"] = name2
		this.showWnd()
	}
}