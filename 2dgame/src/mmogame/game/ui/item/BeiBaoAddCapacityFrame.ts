// TypeScript file
// TypeScript file
class BeiBaoAddCapacityFrame extends BaseWnd {
	count : number;
	ratio 
	MAX_ADD_COUNT  

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/item/BeiBaoAddCapacityLayout.exml"]
		this.ratio = defaultValue.PACKET_UPSTEP_GOLD / defaultValue.PACKET_UPSTEP_SIZE
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		    { ["name"]: "btn_sure", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSureClick },
			{ ["name"]: "btn_cancel", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_add", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAddClick },
			{ ["name"]: "btn_reduce", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onReduceClick },
        
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
		
		this.count = defaultValue.PACKET_UPSTEP_SIZE
	}

	public onUnLoad(): void {

	}
	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = true;
        this.mLayoutNode.setDoModal(true);
		this.onRefresh()

	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = false;
		this.mLayoutNode.setDoModal(false);
		this.count = defaultValue.PACKET_UPSTEP_SIZE
	}

	///
	onRefresh(){
		//label_num
		let maxCount = defaultValue.MAX_ADD_EQUIP_SIZE + defaultValue.EQUIP_SIZE
		let yuekaTime = getSaveRecord(opSaveRecordKey.monthCard) || 0
		if(yuekaTime >= GetServerTime()){
			maxCount += monthCardConfig.packetAdd
		}
		this.MAX_ADD_COUNT = maxCount - GetHeroProperty("equipMax") || 0

		if(this.MAX_ADD_COUNT <= 0){
			this.MAX_ADD_COUNT = 0
			this.count = defaultValue.PACKET_UPSTEP_SIZE
		}

		this.changeNum()
	}

	changeNum(){
		//rd_cost
		let ratio = this.ratio
		let costStr = GetMoneyIcon(opItemUnit.CURRENCY) + "#space" + ratio * this.count
		AddRdContent(this.mElemList["rd_cost"], costStr , "ht_22_cc")

		this.mElemList["label_num"].text = this.count
	}

	/////btn响应事件
	public onSureClick():void{
		if(this.count > this.MAX_ADD_COUNT){
			MsgSystem.addTagTips(Localize_cns("BEIBAO_GRATER"))
			return 
		}
		let unittype = opItemUnit.CURRENCY //哪一种
		let money = GetHeroMoney(unittype)
		let ratio = this.ratio
		if(money < this.count * ratio){
			let formatStr = Localize_cns(ItemUnitName[unittype])
            MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
			return
		}

		if(money > this.count){
			RpcProxy.call("C2G_PacketUpstep", this.count/defaultValue.PACKET_UPSTEP_SIZE)
			//this.onRefresh()
		}else{
			let formatStr = Localize_cns(ItemUnitName[unittype])
            MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
		}

	}
	
	onAddClick(){ 
		let unittype = opItemUnit.CURRENCY //哪一种
		let money = GetHeroMoney(unittype) 

		let ratio = this.ratio
		if(money < (this.count + defaultValue.PACKET_UPSTEP_SIZE) * ratio){
			let formatStr = Localize_cns(ItemUnitName[unittype])
            MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
			return
		}

		if(this.count + defaultValue.PACKET_UPSTEP_SIZE > this.MAX_ADD_COUNT){
			return 
		}

		this.count += defaultValue.PACKET_UPSTEP_SIZE
		if(this.count > this.MAX_ADD_COUNT){
			this.count = this.MAX_ADD_COUNT
		}
		this.changeNum()
	}

	onReduceClick(){
		let count = defaultValue.PACKET_UPSTEP_SIZE
		this.count -= count
		if(this.count < count){
			this.count = count
		}
		this.changeNum()
	}
}