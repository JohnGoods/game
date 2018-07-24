class MiLuFrame extends BaseWnd {
	activityIndex:number
	ActivityLottoTable:any[]
	showReward:any[]
	moveTime:number
	moveTime1:number
	isAnimation:boolean
	firstInto:boolean

	showRewardTimer:number;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/activity/milu/MiLuLayout.exml"]
		this.activityIndex = PayActivityIndex.GOD_PET_TURN
		this.showReward = [20042,20044,20048,20049,20051,20058]
		this.moveTime = 0.4 * 1000
		this.moveTime1 = 0.3 * 1000
		this.isAnimation = false
		this.firstInto = false
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		//this.mLayoutNode.setDoModal(true)
		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_one", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickOne },
			{ ["name"]: "btn_ten", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickTen },
			{ ["name"]: "reward_show_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClicRewardShow },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		for(let i = 0 ;i<6;i++){
			let x = i*80+0
			let y = 0
			this.mElemList["petBox_" + i] = UIPetBox.newObj(this, "petBox_" + i, x, y, this.mElemList["pet_show_group"],0.8)
			let entryId = this.showReward[i]
			this.mElemList["petBox_" + i].updateByEntry(entryId)
			this.mElemList["petBox_" + i].clear()
		}

		// let Info = []
		// for (let i = 0; i < 5 ; i++) {
		// 	let x = i*110+0
		// 	let y = 90
        //     JsUtil.arrayInstert(Info, { ["index_type"]: gui.RichDisplayer, ["name"]: "petName_" + name + i, ["parent"]: "pet_show_group", ["title"]: "", ["font"]: "", ["color"]: gui.Color.white, ["x"]: x, ["y"]: y, ["w"]: 100, ["h"]: 25 })
		// }
        // UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this)

		// for(let i = 0;i<5;i++){
		// 	this.mElemList["petName_" + name + i].setAlignFlag(gui.Flag.CENTER_CENTER)
		// 	let entryId = this.showReward[i]
		// 	let petName = PetSystem.getInstance().getPetName(entryId)
		// 	let quality = PetSystem.getInstance().getPetQuality(entryId)
		// 	let color = GetQualityColorStr(quality)
		// 	AddRdContent(this.mElemList["petName_" + name + i], petName, "ht_18_lc", color)
		// }

		this.mElemList["one_rd"].setAlignFlag(gui.Flag.CENTER_CENTER)
		this.mElemList["ten_rd"].setAlignFlag(gui.Flag.CENTER_CENTER)
		AddRdContent(this.mElemList["one_rd"], "#YUANBAO1000", "ht_24_cc", "ublack")
		AddRdContent(this.mElemList["ten_rd"], "#YUANBAO9500", "ht_24_cc", "ublack")

		let animBox: gui.AnimBox = this.mElemList["bg_animBox"]
		animBox.setAnimName("miLuGuang")
        animBox.setLoop(true)
		animBox.play();
		// gui.GuiManager.getInstance().setNodeLayer(animBox, gui.GuiLayer.Top);

		let animBox1: gui.AnimBox = this.mElemList["bg_animBox1"]
		animBox1.setAnimName("miLuGuang02")
        animBox1.setLoop(false)
		gui.GuiManager.getInstance().setNodeLayer(animBox1, gui.GuiLayer.Top);
		animBox1.visible = false
		// animBox.stop();
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this) 
		RegisterEvent(EventDefine.ACTIVITY_RESET, this.resetInfo, this)
		RegisterEvent(EventDefine.XUNBAO_UPDATE, this.onUpdate, this)
		this.mLayoutNode.visible = true;
		this.isAnimation = false
		this.mElemList["bg_animBox"].visible = true
		RpcProxy.call("C2G_SendOperateAndPlayerData",this.activityIndex) 
		this.onRefresh()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this) 
		UnRegisterEvent(EventDefine.ACTIVITY_RESET, this.resetInfo, this)
		UnRegisterEvent(EventDefine.XUNBAO_UPDATE, this.onUpdate, this)
		this.mLayoutNode.visible = false;
		this.mElemList["milu_image"].visible = false
		this.mElemList["milu_di1"].visible = false
		this.mElemList["bg_animBox"].visible = false
		this.firstInto = false

		if(this.showRewardTimer){
			KillTimer(this.showRewardTimer)
			this.showRewardTimer = null;
		}
	}

	onRefresh() {
		if(this.firstInto == false){
			this.firstInto = true
			this.resetInfo()
		}	
			
		this.mElemList["double_image"].visible = false
		let info = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex)
		// if(info == null){
		// 	return
		// }

		let serverDay = GetServerDay()
		if(serverDay<=8){
			this.mElemList["double_image"].visible = true
		}

		let isFirst = size_t(info) <= 0
		if(isFirst){
			this.mElemList["first_image"].source = "scml_tiShiText01"
		}else{
			this.mElemList["first_image"].source = "scml_tiShiText02"	
		}
	}

	resetInfo(){
		if(this.isAnimation){
			return
		}
		this.mElemList["bg_animBox1"].visible = false
		this.mElemList["milu_image"].visible = true
		this.mElemList["milu_di1"].visible = false
		this.mElemList["end_milu_image"].visible = false
		this.mElemList["milu_image_di"].visible = false	
		this.mElemList["milu_image_book_di"].visible = true	
		this.mElemList["bg_animBox"].visible = true

		let node = this.mElemList["milu_image"]
		let node1 =this.mElemList["milu_di1"]
		if(node1.parent){
			// node1.parent.removeChild(node1)
			// gui.GuiManager.getInstance().setNodeLayer(node1, gui.GuiLayer.Normal);
			// this.mElemList["animation_group"].addChild(node)
		}

		if(node.parent){
			// node.parent.removeChild(node)
			// gui.GuiManager.getInstance().setNodeLayer(node, gui.GuiLayer.Normal);
			// this.mElemList["animation_group"].addChild(node)
		}

		UiUtil.setXY(this.mElemList["milu_image"], this.mElemList["milu_image_pos"].x, this.mElemList["milu_image_pos"].y)
		UiUtil.setXY(this.mElemList["milu_di1"], this.mElemList["milu_di_pos"].x, this.mElemList["milu_di_pos"].y) 
		
		
		
		// UiUtil.setXY(this.mElemList["milu_image"], 173, 223-70)
		// UiUtil.setXY(this.mElemList["milu_di1"], -655, 245-70) 

		
	}

	showAnimation(){
		// this.mElemList["animation_group"].visible = false
		this.mElemList["milu_di1"].visible = false
		this.mElemList["milu_image_di"].visible = false
		this.mElemList["milu_image_book_di"].visible = true

		// UiUtil.setXY(this.mElemList["milu_image"], 173, 223-70)
		// UiUtil.setXY(this.mElemList["milu_di1"], -655, 245-70) 
		UiUtil.setXY(this.mElemList["milu_image"], this.mElemList["milu_image_pos"].x, this.mElemList["milu_image_pos"].y)
		UiUtil.setXY(this.mElemList["milu_di1"], this.mElemList["milu_di_pos"].x, this.mElemList["milu_di_pos"].y) 


		let node = this.mElemList["milu_image"]
		let node1 = this.mElemList["end_milu_image"]
		let startPos = null
		let endPos = null
        if(gui.GuiManager.getInstance().isRootNode(node.parent) == true){//移动过程中，父节点是rootNode
            startPos = new egret.Point(node.x, node.y)
			endPos = new egret.Point(node1.x, node1.y)
        }else{
            startPos = core.EgretUtil.nodeToStageXY(node, 0, 0)
			endPos = core.EgretUtil.nodeToStageXY(node1, 0, 0)
        }

		startPos.y = startPos.y - 49
		egret.Tween.removeTweens(node);
		egret.Tween.get(node).set({x: startPos.x, y: startPos.y}).to({x: endPos.x, y: startPos.y}, this.moveTime).call(this.onMoveToComplete, this, []);
	}

	onMoveToComplete(){
		let wnd = WngMrg.getInstance().getWindow("PetPreviewFrame")
		let wnd1 = WngMrg.getInstance().getWindow("MiLuFrame") 
		if(wnd1.isVisible() == false || wnd.isVisible()){
			this.isAnimation = false
			return
		}else{
			this.mElemList["milu_image_book_di"].visible = false
			this.mElemList["milu_di1"].visible = true
			this.mElemList["milu_image_di"].visible = true
			
			let node = this.mElemList["milu_di1"]
			let node1 = this.mElemList["end_milu_di"]
			let startPos = null
			let endPos = null
        	if(gui.GuiManager.getInstance().isRootNode(node.parent) == true){//移动过程中，父节点是rootNode
            	startPos = new egret.Point(node.x, node.y)
				endPos = new egret.Point(node1.x, node1.y)
        	}else{
            	startPos = core.EgretUtil.nodeToStageXY(node, 0, 0)
				endPos = core.EgretUtil.nodeToStageXY(node1, 0, 0)
        	}
			startPos.y = startPos.y - 49
			egret.Tween.removeTweens(node);
			// egret.Tween.get(node).set({x: startPos.x, y: startPos.y}).to({x: -10, y: 245-70}, this.moveTime1).call(this.onMoveToComplete1, this, []);
			egret.Tween.get(node).set({x: startPos.x, y: startPos.y}).to({x: endPos.x, y: startPos.y}, this.moveTime1).call(this.onMoveToComplete1, this, []);
		}
	}

	onMoveToComplete1(){
		let wnd = WngMrg.getInstance().getWindow("MiLuRewardShowFrame") 
		let wnd1 = WngMrg.getInstance().getWindow("MiLuFrame") 
		let wnd2 = WngMrg.getInstance().getWindow("PetPreviewFrame")
		if(wnd1.isVisible() == false || wnd.isVisible() || wnd2.isVisible()){
			this.isAnimation = false
			return
		}else{
			// this.mElemList["milu_image_di"].visible = true
			
			//显示特效
			this.mElemList["bg_animBox1"].visible = true
			this.mElemList["bg_animBox1"].play()
			//显示奖励

			if(this.showRewardTimer){
				KillTimer(this.showRewardTimer)
				this.showRewardTimer = null;
			}

			this.showRewardTimer = SetTimer(this.rewardShow, this, 800)
			//DelayEvecuteFunc(800, this.rewardShow, this)
		// this.resetInfo()
		}
	}

	rewardShow(){
		if(this.showRewardTimer){
			KillTimer(this.showRewardTimer)
			this.showRewardTimer = null;
		}
		let resultInfo = ActivitySystem.getInstance().getOperateLotteryResultInfo(this.activityIndex)
		this.ActivityLottoTable = []

		for(let i = 0; i<size_t(resultInfo); i++){
			let itemInfo =  resultInfo[i]
			table_insert(this.ActivityLottoTable,itemInfo[0])
		}

		if(size_t(this.ActivityLottoTable) > 1){
			this.showTenAnimation()
		}else{
			this.showOneAnimation()
		}
		this.isAnimation = false
		this.mElemList["bg_animBox1"].visible = false
	}

	onUpdate(){
		let wnd = WngMrg.getInstance().getWindow("LuckyPrizeShowFrame") 
		if(wnd.isVisible()){
			return
		}
		this.resetInfo()
		this.isAnimation = true
		let wnd1 = WngMrg.getInstance().getWindow("MiLuFrame") 
		if(wnd1.isVisible()){
			this.showAnimation()
		}else{
			return
		}
	}

	showTenAnimation(){
		let config = [[],[2,3,9500]]
		// config[0] = 2	//?
		// config[1] = 3	//绑元还是元宝
		// config[2] = 9500	//需要的元宝
		//这个界面是 之前服务器会发抽奖消耗下来的 现在不发 所以 自己定义
		let wnd = WngMrg.getInstance().getWindow("LuckyPrizeShowFrame")
		//传config是因为再抽是10次
		wnd.showAndSetData(this.ActivityLottoTable,this.activityIndex,2,config)
	}

	//单次
	showOneAnimation(){
		let result = this.ActivityLottoTable
		let itemId = result[0][1]
		// itemId = 40108
		if(itemId <= 0){
			return
		}
		let petId = ItemSystem.getInstance().getPetIdByItemId(itemId)
		let petWnd = WngMrg.getInstance().getWindow("EasterEggPetFrame")
		petWnd.onShowAndSetData(null,petId)
	}

	onClicRewardShow(){
		// this.showAnimation()
		this.mElemList["bg_animBox"].visible = false
		WngMrg.getInstance().showWindow("MiLuRewardShowFrame");
	}

	onClickOne(){
		// this.show
		let curGold= GetHeroProperty("gold")
		let needGold = 500
		if(curGold>=needGold){
			if(this.isAnimation == false){
				RpcProxy.call("C2G_DoOperateActivity", this.activityIndex, [1])	//抽奖
			}
		}else{
			MsgSystem.addTagTips(Localize_cns("INVEST_TXT15"))
		}
	}

	onClickTen(){
		let curGold= GetHeroProperty("gold")
		let needGold = 9500
		if(curGold>=needGold){
			if(this.isAnimation == false){
				RpcProxy.call("C2G_DoOperateActivity", this.activityIndex, [2])	//抽奖
			}
		}else{
			MsgSystem.addTagTips(Localize_cns("INVEST_TXT15"))
		}
	}
}