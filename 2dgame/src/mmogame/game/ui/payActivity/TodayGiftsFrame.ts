// TypeScript file
class TodayGiftsFrame extends BaseWnd{

	mDeadLine:number;
	// mTimerId:number;
	mActivityIndex:number;

	public initObj(...params:any[]){
		this.mLayoutPaths = ["resource/layouts/payActivity/TodayGiftsLayout.exml"]
		this.mActivityIndex = PayActivityIndex.DAILY_EXPENSIVE_GIFT
	}

	public onLoad():void{
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true, true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			//{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_pay", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGetPrize },
			
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let parent = this.mElemList["group_prize"]
		for (let i = 0; i < 6; i++) {
            this.mElemList["itemBox" + i] = UIItemBox.newObj(this.mElemList, "itemBox" + i, 0, 0, parent)
            //this.mElemList[name + "itemBox" + i].updateByEntry(SpecailItemId.FUNDS, 1000)
        }


		let rd:gui.RichDisplayer = this.mElemList["rd_payinfo"]
		rd.setAlignFlag(gui.Flag.CENTER_CENTER)
	}

	public onUnLoad():void{

	}

	public onShow():void{
		RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.refreshFrame, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)

		this.mLayoutNode.visible = true;

		this.refreshFrame()

		// this.mDeadLine = GetTomorrowTime(GetServerTime())
		// this.mTimerId = SetTimer(this.onTimerCallback, this, 1000, true);

		RpcProxy.call("C2G_SendOperatePlayerData", this.mActivityIndex)
	}

	public onHide():void{
		UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)

		// if(this.mTimerId){
		// 	KillTimer(this.mTimerId)
		// 	this.mTimerId = null;
		// }

		this.mLayoutNode.visible = false;
	}


	// onTimerCallback(dt){
	// 	let nowTime = GetServerTime()
	// 	if(nowTime > this.mDeadLine){
	// 		this.mDeadLine = GetTomorrowTime(GetServerTime())
	// 	}

	// 	let diff = this.mDeadLine - nowTime
	// 	if(diff < 0)
	// 		diff = 0
	// 	let str = String.format(Localize_cns("ACTIVITY_PAY_TXT15"), getFormatDiffTime(diff))
	// 	this.mElemList["label_time"].text = str
	// }


	refreshFrame(){
		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.mActivityIndex)
        if(playerInfo == null)
            return
		let dayNum = playerInfo[0]	//真实的天数
		let isGet = playerInfo[1]	//0未领取 //1已领取

		let configLenght = size_t(GameConfig.DailyExpensiveGiftConfig)

		let trueDay = 0
		if(dayNum >= configLenght){
			trueDay = (dayNum % configLenght) + 1
		}else{
			trueDay = dayNum
		}

		let config = GameConfig.DailyExpensiveGiftConfig[trueDay]
		if(config == null)
			return;
		let itemList = config.prize

		for(let i = 0; i < 6; i++){
			let itemBox: UIItemBox = this.mElemList["itemBox" + i]
			let prize = itemList[i]
			if(prize){
				itemBox.setVisible(true)
                itemBox.updateByEntry(prize[1], prize[2])
			}else{
				itemBox.setVisible(false)
			}
		}

		//更新充值多少钱
		let dailyPayCount = getSaveRecord(opSaveRecordKey.dailyRecharge) || 0
		let rmb = GetRmbFromGold(dailyPayCount)
		AddRdContent(this.mElemList["rd_payinfo"], String.format(Localize_cns("ACTIVITY_PAY_TXT14"), rmb), "ht_24_cc_stroke", "white")

		let btn:gui.Button = this.mElemList["btn_pay"]
		btn.enabled = true
		if(dailyPayCount < opLimitTimeActive.stageUpNeedMoney){	//1000
			btn.text = Localize_cns("ACTIVITY_PAY_TXT16")
		}else{
			btn.text = Localize_cns("ACTIVITY_PAY_TXT17")
			if(isGet){
				btn.enabled = false
				btn.text = Localize_cns("ACTIVITY_PAY_TXT7")
			}
		}
	}

	onClickGetPrize(args:egret.TouchEvent) {
		let dailyPayCount = getSaveRecord(opSaveRecordKey.dailyRecharge) || 0
		if(dailyPayCount < opLimitTimeActive.stageUpNeedMoney){	//1000
			ExecuteMainFrameFunction("chongzhi")
			this.hideWnd()
		}else{
			RpcProxy.call("C2G_GetOperateActivityPrize", this.mActivityIndex, {})
		}
    }
}
