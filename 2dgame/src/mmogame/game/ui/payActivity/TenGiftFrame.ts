// TypeScript file

class TenGiftFrame extends BaseWnd{
	mDeadLine:number;
	mTimerId:number;
	mActivityIndex:number;
	actorView: UIActorView;
    other_actorView:UIActorView;
	modelConfig;
	curConfig;
	state
	day;
	playerInfo

	public initObj(...params:any[]){
		this.mLayoutPaths = ["resource/layouts/payActivity/TenGiftLayout.exml"]
		this.mActivityIndex = PayActivityIndex.TEN_YUAN_GIFT
		this.modelConfig = [
            {day: 1, handle: this.onRefreshModel1,image:null},
			{day: 2, handle: this.onRefreshModel2,image:null},
			{day: 3, handle: this.onRefreshModel3,image:"sylb_taoZhuangWenZi01"},
			{day: 4, handle: this.onRefreshModel4,image:null},
			{day: 5, handle: this.onRefreshModel5,image:"sylb_taoZhuangWenZi01"},
			{day: 6, handle: this.onRefreshModel6,image:"sylb_taoZhuangWenZi01"},
			{day: 7, handle: this.onRefreshModel7,image:"sylb_taoZhuangWenZi02"},
		]
	}

	public onLoad():void{
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		// this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true, true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			////{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "get_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGetPrize },
			
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let parent = this.mElemList["group_prize"]
		for (let i = 0; i < 3; i++) {
            this.mElemList["itemBox" + i] = UIItemBox.newObj(this.mElemList, "itemBox" + i, 30, i*90 + 50, parent)
            // this.mElemList[name + "itemBox" + i].updateByEntry(SpecailItemId.FUNDS, 1000)
        }

		this.actorView = UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["group_actorview"])
        this.other_actorView = UIActorView.newObj(this.mLayoutNode, "actor_wnd", 0, 0, this.mElemList["actor_wnd"])
		let rd:gui.RichDisplayer = this.mElemList["time_rd"]
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
		this.mTimerId = SetTimer(this.onTimerCallback, this, 1000, true);

		RpcProxy.call("C2G_SendOperatePlayerData", this.mActivityIndex)
	}

	public onHide():void{
		UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)

		if(this.mTimerId){
			KillTimer(this.mTimerId)
			this.mTimerId = null;
		}

		this.actorView.clearView()
        this.other_actorView.clearView()

		this.mLayoutNode.visible = false;
	}

	refreshFrame(){
		this.mElemList["title_icon"].visible = false
		this.mElemList["rd_bg"].visible = true
		this.mElemList["time_rd"].visible = true
		this.mElemList["taozhuang_tip"].visible = false
		
		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.mActivityIndex)
        // if(playerInfo == null)
        //     return
		// let index = 1
		this.state = 1
		let config = GameConfig.SpecialRechargeConfig[1200]	//我都不知道1200有什么用
		let day = GetServerDay() || 1 //开服第几天
		day = day - 1 	//因为是要第二天开启
		// let showRewardDay = size_t(playerInfo) + 1
		let showRewardDay = 1
		this.playerInfo = playerInfo
		if(playerInfo != null){	//如果不为空 且没领取 就把显示数据天数-1
			for(let _ in playerInfo){
				let state = playerInfo[_]
				if(state == 1){
					showRewardDay = showRewardDay + 1
				}else if(state == 0){
					this.state = 2
					break
				}
			}
		}

		this.mElemList["get_btn"].source = "10ycz_bt0" + this.state

		// day = 7
		// showRewardDay = 4
		this.day = showRewardDay
		
		


		if(showRewardDay > day || showRewardDay>7){
			this.hideWnd()
			return
		}
		let curConfig = config[showRewardDay]
		this.curConfig = curConfig
		let prize = curConfig.prize	//奖励
		let modelId  = curConfig.modelId	//模型ID

		let topImage = "sylb_7TianChanChuWenZi0" + showRewardDay
		this.mElemList["image_top"].source = topImage

		let image = "sylb_miaoShuWenZi0" + showRewardDay
		this.mElemList["bg_tip"].source = image

		let modelTipImage = "sylb_biaoTi0" + showRewardDay
		// let modelTipImage = "10ycz_text01"
		this.mElemList["model_tip"].source = modelTipImage
		
		
		// let disposeItemList = []

		let disposeItemList = AnalyPrizeFormat(prize)
		// for(let i =0;i<size_t(prize);i++){
		// 	let info = prize[i]
		// 	let itemInfo = AnalyPrizeFormat(info)
		// 	table_insert(disposeItemList,itemInfo)
		// }

		for(let i = 0; i < 3; i++){
			let itemInfo = disposeItemList[i]
			this.mElemList["itemBox" + i].setVisible(false)
			if(itemInfo){
				this.mElemList[ "itemBox" + i].setVisible(true)
				if(itemInfo[2]){
					this.mElemList[ "itemBox" + i].updateByEntry(itemInfo[0],itemInfo[1],itemInfo[2])
				}else{
					this.mElemList[ "itemBox" + i].updateByEntry(itemInfo[0],itemInfo[1])
				}
			}
		}

		// this.actorView.clearView()
        // this.other_actorView.clearView()

		for(let _ in this.modelConfig){
			let config = this.modelConfig[_]
			if(config.day == showRewardDay){
				let func:Function = config.handle
                if(func){
					func.call(this)
                }
				if(config.image != null){
					this.mElemList["taozhuang_tip"].visible = true
					this.mElemList["taozhuang_tip"].source = config.image
				}
                break
			}
		}

		

	}

	onTimerCallback(){
		let serverTime = GetServerTime()
		let tomorrowTime = GetTomorrowTime(serverTime)
		let timeDiffcuf = tomorrowTime - serverTime
		if(timeDiffcuf <= 0){
			timeDiffcuf = 0
			this.mElemList["rd_bg"].visible = false
			this.mElemList["time_rd"].visible = false
			KillTimer(this.mTimerId)
		}else{
			// this.mElemList["rd_bg"].visible = true
			// this.mElemList["time_rd"].visible = true
			let timeText = getFormatDiffTime(timeDiffcuf)
			AddRdContent(this.mElemList["time_rd"], String.format(Localize_cns("ACTIVITY_PAY_TXT20"), timeText), "ht_20_cc_stroke", "lime")
		}
	}

	//宠物
	onRefreshModel1(){
		let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			rideShapeId : playerInfo.rideShapeId,
			wingShapeId : playerInfo.wingShapeId,
			weaponShapeId : playerInfo.weaponShapeId,
			heroShapeId : this.curConfig.modelId
		}
		modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId
		this.actorView.updateByPlayerAppearInfo(modelList)
		this.actorView.setXY(10,-60)
	}

	//称号
	onRefreshModel2(){
		let	curConfig = this.curConfig

		let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			rideShapeId : playerInfo.rideShapeId,
			wingShapeId : playerInfo.wingShapeId,
			weaponShapeId : playerInfo.weaponShapeId,
		}
		modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId
		this.actorView.updateByPlayerAppearInfo(modelList)
        this.actorView.setXY(10,-60)
        let image = GetShapeImage(curConfig.modelId)
        this.mElemList["title_icon"].visible = true
        this.mElemList["title_icon"].source = image
	}

	//时装
	onRefreshModel3(){
		let	curConfig = this.curConfig
        let modelId = curConfig.modelId
        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			rideShapeId : playerInfo.rideShapeId,
			wingShapeId : playerInfo.wingShapeId,
			weaponShapeId : playerInfo.weaponShapeId,
            heroShapeId : modelId
		}
		modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId
		this.actorView.updateByPlayerAppearInfo(modelList)
        this.actorView.setXY(10,-60)
	}

	//天仙
	onRefreshModel4(){
		let	curConfig = this.curConfig
        let modelId = curConfig.modelId
     
        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			rideShapeId : playerInfo.rideShapeId,
			wingShapeId : playerInfo.wingShapeId,
			weaponShapeId : playerInfo.weaponShapeId,
		}
		modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId
		this.actorView.updateByPlayerAppearInfo(modelList)
        this.actorView.setXY(10,-60)

		this.other_actorView.updateByPlayer(modelId)
        this.other_actorView.setXY(10,-60)
	}

	//坐骑
	onRefreshModel5(){
		let	curConfig = this.curConfig
        let modelId = curConfig.modelId
     
        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			rideShapeId : modelId,
			wingShapeId : playerInfo.wingShapeId,
			weaponShapeId : playerInfo.weaponShapeId,
		}
		modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId
		this.actorView.updateByPlayerAppearInfo(modelList)
        this.actorView.setXY(10,-60)
	}

	//神兵
	onRefreshModel6(){
		let	curConfig = this.curConfig
        let modelId = curConfig.modelId
     
        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			rideShapeId : playerInfo.rideShapeId,
			wingShapeId : playerInfo.wingShapeId,
			weaponShapeId : modelId,
		}
		modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId
		this.actorView.updateByPlayerAppearInfo(modelList)
        this.actorView.setXY(10,-60)
	}

	//翅膀
	onRefreshModel7(){
		let	curConfig = this.curConfig
        let modelId = curConfig.modelId
     
        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			rideShapeId : playerInfo.rideShapeId,
			wingShapeId : modelId,
			weaponShapeId : playerInfo.weaponShapeId,
		}
		modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId
		this.actorView.updateByPlayerAppearInfo(modelList)
        this.actorView.setXY(10,-60)
	}

	onClickGetPrize(args:egret.TouchEvent) {
		let showRewardDay = 1
		if(this.playerInfo != null){	//如果不为空 且没领取 就把显示数据天数-1
			for(let _ in this.playerInfo){
				let state = this.playerInfo[_]
				if(state == 0){
					break
				}else if(state == 1){
					showRewardDay = showRewardDay + 1
				}
			}
		}
		if(this.state == 1){
			PaySystem.getInstance().payFromId(1200)
		}else if(this.state == 2){
			RpcProxy.call("C2G_GetOperateActivityPrize", this.mActivityIndex, [showRewardDay])
			// RpcProxy.call("C2G_GetOperateActivityPrize", this.mActivityIndex, [this.day])
			this.hideWnd()
		}
		// this.hideWnd()
    }
}
