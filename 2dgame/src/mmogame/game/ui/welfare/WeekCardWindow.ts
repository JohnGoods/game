class WeekCardWindow extends BaseCtrlWnd {
	mElemList;
	state:number;

	public initObj(...params: any[]) {
		
	}

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		var elemInfo = [
		
			{ ["name"]: "week_card_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onWeekClick },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		for(let i = 1;i<3;i++){
			this.mElemList["week_rd" + i].setAlignFlag(gui.Flag.H_CENTER)
		}			
		this.mElemList["week_card_rd"].setAlignFlag(gui.Flag.H_CENTER)
	}

	public onUnLoad(): void {
	
	}

	public onShow(): void {
		RegisterEvent(EventDefine.PAY_ACTIVITY_WEEK_CARD, this.onRefresh, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
        this.mElemList["group_tab4"].visible = true;  
		RpcProxy.call("C2G_WeekCardInfo")	//周卡信息
		this.onRefresh()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PAY_ACTIVITY_WEEK_CARD, this.onRefresh, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mElemList["group_tab4"].visible = false;
		this.mElemList["week_card_rd"].visible = false
	}

	
	 onRefresh() {
		 this.mElemList["week_card_rd"].visible = false
		let weekCardInfo =  PaySystem.getInstance().getWeekCardInfo()
		if(weekCardInfo == undefined){
			return
		}

		this.state = -1
		for(let i = 1;i<3;i++){
			let text = Localize_cns("WELFARE_TXT"+(i+15))
        	AddRdContent(this.mElemList["week_rd"+i], text, "ht_20_cc", "ublack")
		}

		let isBuy = PaySystem.getInstance().isWeekCardActive()
		let isGet = false
		if(weekCardInfo.isGet == 1){
			isGet = true
		}

		this.mElemList["week_card_btn"].enabled = true
		if(isBuy){	//购买了
			this.mElemList["week_card_rd"].visible = true
			if(isGet){
				this.mElemList["week_card_btn"].text = Localize_cns("WELFARE_TXT5")
				this.mElemList["week_card_btn"].enabled = false
				this.state = 3
			}else{
				this.mElemList["week_card_btn"].text = Localize_cns("WELFARE_TXT4")
				this.state = 2
			}
			let weekCardTime = getSaveRecord(opSaveRecordKey.weekCard) || 0
			let shengyuTime = weekCardTime - GetServerTime()
			let t = simple_transform_time(shengyuTime)
			let text = String.format(Localize_cns("WELFARE_TXT29"),t.hours,t.mins)
			AddRdContent(this.mElemList["week_card_rd"], text, "ht_20_cc", "ublack")
		}else{	//没购买(请购买)
			this.mElemList["week_card_btn"].text = Localize_cns("WELFARE_TXT19")
			this.state = 1
		}
    }

	//领取购买操作
	onWeekClick(){
		if(this.state == 1){
			PaySystem.getInstance().payFromId(1001)
		}else if(this.state == 2){
			RpcProxy.call("C2G_WeekhCardPrize")
		}
	}
}