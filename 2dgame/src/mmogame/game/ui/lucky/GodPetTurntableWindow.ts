class GodPetTurntableWindow extends BaseCtrlWnd {
	activityIndex:number;
	fristInto:boolean
	rotationValue:number;
	rotateAction1;
	rotateAction2;
	rotateAction3;
	rotateList;
	petList;
	luckyNum;
	resultInfo;
	activityInfo;
	timer;
	num;
	
	LIANYAO_HU = 60046


	public initObj(...params: any[]) {
		this.activityIndex = PayActivityIndex.GOD_PET_TURN
		this.rotationValue  = 0
		this.luckyNum = 0
		this.timer = null
		this.num = 0
		//旧的神宠转盘逻辑
		// this.rotateList = [
			// 340,
			// 25,
			// 70,
			// 115,
			// 160,
			// 205,
			// 250,
			// 295,
		// ]
		this.rotateList = [
			0,
			110,
			250
		]
	}

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
			var elemInfo = [
			{ ["name"]: "lianyao_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLianYaoClick },
			{ ["name"]: "lianyao_record", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRecordClick },
			{ ["name"]: "god_pet_approach", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onApproachClick },
			{ ["name"]: "reward_tip", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRewardTipClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		//旧的神宠转盘逻辑
		// for(let i=0;i<8;i++){
		// 	 let itemGroup =  this.mElemList["god_pet_item_group"+i]
		// 	 this.mElemList["god_pet_item" + i] = UIItemBox.newObj(this.mLayoutNode, "god_pet_item" + i, 5, 5, itemGroup, 0.9)
		// 	 this.mElemList["god_pet_select" + i].visible = false
		// }

		for(let i=0;i<3;i++){
			 let itemGroup =  this.mElemList["new_god_pet_item_group"+i]
			 this.mElemList["new_god_pet_item" + i] = UIItemBox.newObj(this.mLayoutNode, "god_pet_item" + i, 5, 5, itemGroup, 0.9)
			 this.mElemList["new_god_pet_select" + i].visible = false
		}
		
		this.mElemList["cur_lianyao_num_rd"].setAlignFlag(gui.Flag.CENTER_CENTER)
		this.mElemList["turn_pet_day_text"].setAlignFlag(gui.Flag.CENTER_CENTER)
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this)  
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		RegisterEvent(EventDefine.XUNBAO_UPDATE, this.onUpdate, this)
		this.mParentWnd.isAnimation = false
        this.mElemList["group_tab3"].visible = true;  
		this.mElemList["first_item_group"].visible = false;
		this.mElemList["xunbao_bottom_group"].visible = false;
		this.mElemList["title"].text = Localize_cns("LUCKY_TXT11")
		this.fristInto = true
		RpcProxy.call("C2G_SendOperateAndPlayerData",this.activityIndex) 
		this.onRefresh()
		let arrows = this.mElemList["arrows"]
		arrows.rotation = 0	
	
		//this.mElemList["arrows"].rotation = 120	
		// let test = TweenAction.newObj()
		// this.rotateAction.onStop()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this)  
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		UnRegisterEvent(EventDefine.XUNBAO_UPDATE, this.onUpdate, this)
		this.mElemList["group_tab3"].visible = false;
		this.fristInto = true
		if (this.timer) {
			KillTimer(this.timer)
			this.timer = null
		}
	}
	
	onRefresh() {
		this.mParentWnd.activityIndex = this.activityIndex
		this.mParentWnd.onRefresh()

		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex)
        let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(this.activityIndex)
        if(playerInfo == null || activityInfo == null){
            return
        }
		this.activityInfo = activityInfo
		//旧的神宠转盘逻辑
		// let config = GameConfig.GodPetTurnConfig
		// let list = []
		// for(let _ in config){
		// 	let info = config[_]
		// 	info.index = tonumber(_)
		// 	table_insert(list,info)
		// }
		// this.petList = list
		let index = activityInfo.gType
		let serverDay = activityInfo.serverDay
		let config = GameConfig.GodPetTurnConfig[index]
		let list = []
		for(let _ in config){
			let info = config[_]
			info.index = tonumber(_)
			table_insert(list,info)
		}
		this.petList = list

		if(this.fristInto){
			this.updateItemPet()	//更新宠物获取信息,后面都是抽到奖才更新了
			this.fristInto = false
		}

		//更新炼妖壶信息
		let itemId = 60046
		let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)	//0
		let needItemCount = 1000
		let str =  ownItemCount + "/" + needItemCount
		let color = "lime"
		if(needItemCount>ownItemCount){
			color = "red"
		}
		AddRdContent(this.mElemList["cur_lianyao_num_rd"],String.format(Localize_cns("LUCKY_TXT13"),str) , "ht_20_cc", color)

		this.mElemList["lianyao_btn"].enabled = true
		//可以重复抽
		if(this.num >= 3){
			//抽完了
			this.mElemList["lianyao_btn"].enabled = false
		}
		this.creatTimer()
	}

	creatTimer(){
		let endTime = this.activityInfo.endTime
		let curTime= GetServerTime()
		let sTime = endTime - curTime
		if(sTime < 0){
			sTime = 0
		}
		AddRdContent(this.mElemList["turn_pet_day_text"],String.format(Localize_cns("LUCKY_TXT20"),getFormatDiffTime(sTime)) , "ht_20_cc", "darkgoldenrod")
		if(sTime>0){
			if(this.timer == null){
				this.timer = SetTimer(this.creatTimer, this, 1000, false)
			}
		}
	}

	updateItemPet(){
		let list = this.petList
		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex)
		let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(this.activityIndex)
		// let index = activityInfo.gType
		// let serverDay = activityInfo.serverDay
		

		this.num = 0
		
		for(let i=0;i<3;i++){
			let info = list[i]
			if(info){
				let entryId = info.prize[0][1]
				let num = info.prize[0][2]
				this.mElemList["new_god_pet_item" + i].updateByEntry(entryId,num)
				this.mElemList["new_god_pet_item" + i].setEnable(true)
				let index = info.index
				let setEnabled = false 
				let config = GameConfig.GodPetTurnConfig[index]
				if(playerInfo[index] && config.once == 1){
					// setEnabled = true
					this.mElemList["new_god_pet_item" + i].setEnable(false)
					this.num = this.num +1
				}else{
					//判断是否拥有仙君 或者 神宠
					//entryId 40049 50011 40054	 //---50011二郎神
					// let petId =  ItemSystem.getInstance().getPetIdByItemId(entryId)
					let xianLvId = ItemSystem.getInstance().getxianLvIdItemId(entryId)

					// if(PetSystem.getInstance().getPetInfoEntry(petId)!=null){
					// 	this.mElemList["new_god_pet_item" + i].setEnable(false)
					// 	this.num = this.num +1
					// }else
					if(XianLvSystem.getInstance().getXianLvByEntry(xianLvId)!=null){
						this.mElemList["new_god_pet_item" + i].setEnable(false)
						this.num = this.num +1
					}
					
				}
			}else{
				this.mElemList["new_god_pet_item" + i].updateByEntry(-1)
			}
		}

		if(this.num >= 3){
			//抽完了
			this.mElemList["lianyao_btn"].enabled = false
		}
	}

	//旧的神宠转盘逻辑
	// updateItemPet(){
		// let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex)
		// let list = this.petList
		// for(let i=0;i<8;i++){
		// 	let info = list[i]
		// 	if(info){
		// 		let entryId = info.prize[0][1]
		// 		let num = info.prize[0][2]
		// 		this.mElemList["god_pet_item" + i].updateByEntry(entryId,num)
		// 		let index = info.index
		// 		this.mElemList["god_pet_item" + i].setEnable(true)
		// 		if(playerInfo[index]){
		// 			this.mElemList["god_pet_item" + i].setEnable(false)
		// 		}
		// 	}else{
		// 		this.mElemList["god_pet_item" + i].updateByEntry(-1)
		// 	}
		// }
	// }

	//旧的神宠转盘逻辑
	// onUpdate(){
		// let resultInfo = ActivitySystem.getInstance().getOperateLotteryResultInfo(this.activityIndex)
		// this.resultInfo = resultInfo
		// this.mParentWnd.isAnimation = true
		// this.mParentWnd.setBtnEnable(false)
		// for(let i = 0 ;i < size_t(this.petList); i++){
		// 	let entryId = this.petList[i].prize[0][1]
		// 	let resultInfoEntryId = resultInfo[0]
		// 	if(resultInfoEntryId == entryId){
		// 		this.luckyNum = i
		// 		break
		// 	}
		// }
		// this.onAnimaPlay()
	// }

	onUpdate(){
		let resultInfo = ActivitySystem.getInstance().getOperateLotteryResultInfo(this.activityIndex)
		this.resultInfo = resultInfo
		this.mParentWnd.isAnimation = true
		this.mParentWnd.setBtnEnable(false)
		for(let i = 0 ;i < size_t(this.petList); i++){
			let entryId = this.petList[i].prize[0][1]
			let resultInfoEntryId = resultInfo[0]
			if(resultInfoEntryId == entryId){
				this.luckyNum = i
				break
			}
		}
		this.onAnimaPlay()
	}

	onAnimaPlay(){
		let arrows = this.mElemList["arrows"]
		this.rotateAction1 = null
		this.rotateAction2 = null
		this.rotateAction3 = null
		arrows.rotation = 10
		let data = {
			angle : 360,
			anchor : true,
		}
		
		this.rotateAction1 = RotateAction.newObj(arrows, 500, data, this.onAnimaPlay1, this)
		this.rotateAction1.run()
	}

	onAnimaPlay1(){
		let data = {
			angle : 360,
			anchor : true,
		}
		let arrows = this.mElemList["arrows"]
		this.rotateAction2 = RotateAction.newObj(arrows, 800, data, this.onAnimaPlay2, this)
		this.rotateAction2.run()
	}

	onAnimaPlay2(){
		let num = this.luckyNum
		let data = {
			angle : this.rotateList[num],
			anchor : true,
		}
		let arrows = this.mElemList["arrows"]
		this.rotateAction3 = RotateAction.newObj(arrows, 900, data, this.onRotateAction, this)
		this.rotateAction3.run()
	}
	

	onRotateAction(){
		let itemId = this.resultInfo[0]
		let itemNum = this.resultInfo[1]
		let item = [[
			"item",
			itemId,
			itemNum]
		]
		
		let curWnd = WngMrg.getInstance().getWindow("LuckyFrame")
		if(curWnd.isVisible() && this.mParentWnd.activityIndex == PayActivityIndex.GOD_PET_TURN){
			let wnd = WngMrg.getInstance().getWindow("PrizeShowFrame")
			wnd.showAndSetData(item)
			let petId = ItemSystem.getInstance().getPetIdByItemId(itemId)
			// let petWnd = WngMrg.getInstance().getWindow("EasterEggPetFrame")
			// petWnd.onShowAndSetData(null,petId)
			this.mParentWnd.isAnimation = false
			this.mParentWnd.setBtnEnable(true)
			this.updateItemPet()
		}
	}

	
	onLianYaoClick(){
		if(this.mParentWnd.isAnimation){
			return
		}
		// FireEvent(EventDefine.XUNBAO_UPDATE, null);
		//判断60046够不够
		let itemId = 60046
		let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)	//0
		let needItemCount = 1000	//2
		if(needItemCount > ownItemCount){
			MsgSystem.addTagTips(Localize_cns("LUCKY_TXT12"))
			return
		}
		RpcProxy.call("C2G_DoOperateActivity", this.activityIndex, [1])	//抽奖
		// this.onAnimaPlay()
	}

	//记录
	onRecordClick(){
		WngMrg.getInstance().showWindow("LianYaoRecordFrame")
	}

	//获取途径
	onApproachClick(){
		//WngMrg.getInstance().showWindow("LianYaoAccessPathFrame")
		let wnd : GoodsAsseceFrame = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
		wnd.onShowWnd(this.LIANYAO_HU)
	}

	//概率说明
	onRewardTipClick(){
		WngMrg.getInstance().showWindow("LianYaoBonusFrame")
	}


 }