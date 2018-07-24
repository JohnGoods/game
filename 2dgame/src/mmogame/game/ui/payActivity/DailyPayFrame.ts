// TypeScript file
//每日充值
class DailyPayFrame extends BaseWnd{

	
	mActivityIndex:number;
	mTabIndex:number;
	state:number;

	public initObj(...params:any[]){
		this.mLayoutPaths = ["resource/layouts/payActivity/DailyPayLayout.exml"]
		this.mActivityIndex = PayActivityIndex.EVERY_MIXACCU_RECHARGE

		this.mTabIndex = 1
	}

	public onLoad():void{
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		// this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true, true)

		var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
		radioGroup.addEventListener(eui.UIEvent.CHANGE, this.onTabSelected, this);
		

		let radioBtn = <eui.RadioButton>this.mElemList["pay_select1"]
		radioBtn.group = radioGroup;
		radioBtn.value = 1;

		radioBtn = <eui.RadioButton>this.mElemList["pay_select2"]
		radioBtn.group = radioGroup;
		radioBtn.value = 2;
		

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			//{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_pay", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGetPrize },
			
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		
		for (let i = 0; i < 6; i++) {
			let parent = this.mElemList["group_prize" + i]
            this.mElemList["itemBox" + i] = UIItemBox.newObj(this.mElemList, "itemBox" + i, 40, 30, parent)
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

	
		 RpcProxy.call("C2G_SendOperateAndPlayerData", this.mActivityIndex)
	}

	public onHide():void{
		UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)

	
		this.mLayoutNode.visible = false;
	}


	refreshFrame(){
		for(let i =1;i<2;i++){
			let radioBtn = <eui.RadioButton>this.mElemList["pay_select" +i]
			radioBtn.selected = (i == this.mTabIndex)
		}

		this.mElemList["red_point1"].visible = false
		this.mElemList["red_point2"].visible = false


		//{oldValue:0, reachList:[0,1,2,0]}--[1]=0没达成 [1]=1,可领取 [1]=2领取了
		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.mActivityIndex)
		//{stime:xx, etime:xx, prizeList:[]}
		let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(this.mActivityIndex)
        if(playerInfo == null || activityInfo == null)
            return

		//必须只能两个档位
		let prizeList = activityInfo
		// let prizeList = activityInfo
		if(prizeList.length != 2)
			return 
		
		let minConfig = prizeList[0]
		let maxConfig = prizeList[1]
		if(minConfig.point > maxConfig.point){
			let temp = maxConfig
			maxConfig = minConfig
			minConfig = temp
		}

		//设置标签页
		// let maxTab:eui.RadioButton = this.mElemList["tab_payValue"] 
		// maxTab.label = String.format(Localize_cns("ACTIVITY_PAY_TXT18"), GetRmbFromGold(maxConfig.point))

		//显示当前奖励
		let showPrize = null
		if(this.mTabIndex == 1){
			showPrize = minConfig
		}else{
			showPrize = maxConfig
		}
		//let prize_list = showPrize.prize
		let disposeItemList = AnalyPrizeFormat(showPrize)
		 let prize_list = disposeItemList
		 for (let i = 0; i < 6; i++) {
            let itemBox: UIItemBox = this.mElemList["itemBox" + i]

            let prize = prize_list[i]
            if (prize) {
                //itemBox.setVisible(true)
                itemBox.updateByEntry(prize[0], prize[1],prize[2])
				this.mElemList["group_prize" + i].visible = true
            } else {
                //itemBox.setVisible(false)
				this.mElemList["group_prize" + i].visible = false
            }
        }
		
		//今日充值
		let dailyPayCount = getSaveRecord(opSaveRecordKey.dailyRecharge) || 0
		// let rmb = GetRmbFromGold(playerInfo.oldValue)
		let rmb = GetRmbFromGold(dailyPayCount)
		AddRdContent(this.mElemList["rd_payinfo"], String.format(Localize_cns("ACTIVITY_PAY_TXT14"), rmb), "ht_24_cc_stroke", "white")

		let pointIndex = 1
		if(playerInfo && playerInfo[1]){
			let info = playerInfo[1]
			for(let _ in info){
				let val = info[_]
				if(val == 0 ){
					this.mElemList["red_point"+pointIndex].visible = true
				}
				pointIndex = pointIndex + 1
			}
		}

		//刷新按钮
		// let allGet = true
		let canGet = false
		let isGet = false
		let reachList = playerInfo[1]

		if(playerInfo && playerInfo[1]){
			let info = playerInfo[1]
			let point = 100
			if(this.mTabIndex == 2){
				point = 4800
			}
			let val = info[point]
			if(val == 0){
				canGet = true
				
			}else if(val == 1){
				isGet = true
			}
		}

		let btn:gui.Button = this.mElemList["btn_pay"]
		btn.enabled = true
		this.state = 0

		this.mElemList["red_point"].visible = false
		if(canGet){
			btn.text = Localize_cns("ACTIVITY_PAY_TXT17")
			this.mElemList["red_point"].visible = true
			this.state = 1
		}else{
			btn.text = Localize_cns("ACTIVITY_PAY_TXT16")
		}

		if(isGet){
			btn.text = Localize_cns("ACTIVITY_PAY_TXT7")
			btn.enabled = false
			this.state = 2
		}
	}

	onClickGetPrize(args:egret.TouchEvent) {
		// let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.mActivityIndex)
        // if(playerInfo == null)
        //     return

		// let index = 1
		// if(playerInfo[1]){
		// 	let reachList = playerInfo[1]
		// 	for(let _ in reachList){
		// 		let val = reachList[_]
		// 		let index = tonumber(_)
		// 		if(val == 0){
		// 			RpcProxy.call("C2G_GetOperateActivityPrize", this.mActivityIndex, [index])
		// 			return
		// 		}
		// 		// index = index + 1
		// 	}
		// }

		if(this.state == 1){
			let index = 100
			if(this.mTabIndex == 2){
				index = 4800
			}
			RpcProxy.call("C2G_GetOperateActivityPrize", this.mActivityIndex, [index])
			return
		}else{
			//打开充值
			ExecuteMainFrameFunction("chongzhi")
			this.hideWnd()
		}
    }

	onTabSelected(event: egret.Event) {
		var radioGroup: eui.RadioButtonGroup = event.target;
		
		let radiobtn = radioGroup.selection;
		this.mTabIndex = radiobtn.value
		this.refreshFrame()
		
	}
	
}
