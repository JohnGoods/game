class XunbaoWindow extends BaseCtrlWnd {
	mElemList;
	//scroll : UIScrollList
	nameToIndex : any[]
	levelInfo;
	activityIndex:number
	itemList;
	disposeItemList;
	number:number
	radioConfig;
	//抽奖
	stopNum : number
	firstIntervalTime :number
	secondIntervalTime :number
	thirdIntervalTime :number
	fourthlyIntervalTime :number
	tipTypeList;
	imageChooseList :any[]
	turnsNum :number
	totalTime :number
	currChooseNum :number  //当前显示选中框
	controlCircle :number  //用来分割速度
	circleNum :number //当前圈数
	sendingMessage : number

	lottoType:number
	ActivityLottoTable:any[];

	endTimer;
	timer;

	public initObj(...params: any[]) {
		this.endTimer = null
		this.timer = null
		this.activityIndex = PayActivityIndex.PET_LOTTERY_A
		this.resetData()
	}

    public onLoad(): void {
		this.imageChooseList = []
		this.mElemList = this.mParentWnd.mElemList;
		//let group : eui.Group = this.mElemList["xunbao_list"]
		//this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_VERTICAL)
		for(let i=1;i<13;i++){
			 let itemGroup =  this.mElemList["item_group"+i]
			 this.mElemList["xunbao_ItemBox_" + i] = UIItemBox.newObj(this.mLayoutNode, "xunbao_ItemBox_" + i, 4, 3, itemGroup, 0.9)
			 this.mElemList["xunbao_select" + i].visible = false
			 let select = this.mElemList["xunbao_select" + i]
			 table_insert(this.imageChooseList,select)

			let mElemInfo: any = [
               //背景
			   	{ ["index_type"]: gui.Grid9Image, ["name"]: "jp_image"+i, ["image"]: "xb_jiPinText", ["x"]: 0, ["y"]: 0, ["w"]: 52, ["h"]: 45,["messageFlag"]: true},
                { ["index_type"]: gui.Grid9Image, ["name"]: "yichou"+i, ["image"]: "xb_yichouzhong", ["x"]: -20, ["y"]: 40, ["w"]: 120, ["h"]: 40, ["messageFlag"]: true },
            ]	
		 	this.mElemList["xunbao_ItemBox_" + i].createElem(mElemInfo,this.mElemList,this)
		 }
		 
		 this.mElemList["firstItemBox"] = UIItemBox.newObj(this.mLayoutNode, "firstItemBox", 4, 3,this.mElemList["first_item_"] , 0.9)

		 let rd_xunbao:gui.RichDisplayer = this.mElemList["rd_xunbao_list"]
		 rd_xunbao.setAlignFlag(gui.Flag.H_CENTER)
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		this.resetData()
		this.mParentWnd.isAnimation = false
		RegisterEvent(EventDefine.XUNBAO_UPDATE, this.onUpdate, this)
		RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this)
        // RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
        this.mElemList["group_tab1"].visible = true;  
		this.mElemList["xunbao_bottom_group"].visible = true;  
		RpcProxy.call("C2G_SendOperateAndPlayerData",this.activityIndex)
		this.onRefresh()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.XUNBAO_UPDATE, this.onUpdate, this)
		UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this)
        // UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mElemList["group_tab1"].visible = false;
		this.mElemList["first_item_group"].visible = false;
		this.mElemList["xunbao_bottom_group"].visible = false;  
		if(this.timer){
			KillTimer(this.timer)
			this.timer = null
		}

		for(let i = 0; i < this.imageChooseList.length; i++){
			let v = this.imageChooseList[i]
			v.visible = (this.stopNum == i)
		}
	
		if(this.endTimer ){
			KillTimer(this.endTimer)
			this.endTimer = null
		}
	}
	
	onRefresh() {
		this.mParentWnd.activityIndex = this.activityIndex
		this.mParentWnd.onRefresh()
		this.mElemList["title"].text = Localize_cns("LUCKY_TXT1")
        let xunbaoInfo = ActivitySystem.getInstance().getOperateActivityInfo(this.activityIndex)
		let xunbaoPlayerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex)
		if(xunbaoInfo == null){
			return
		}
		//let isFirst = false
		this.mElemList["firstItemBox"].setVisible(false)
		this.mElemList["first_item_group"].visible = false
		// if(size_t(xunbaoPlayerInfo)==0){
		// 	this.mElemList["first_item_group"].visible = true
		// 	this.mElemList["firstItemBox"].setVisible(true)
		// 	isFirst = true
		// }
		// let yiChouId = -1
		// if(xunbaoPlayerInfo[1] != null){
		// 	yiChouId = xunbaoPlayerInfo[1]
		// }

		let config = xunbaoInfo.lotteryConfig
		this.mParentWnd.radioConfig = config	//告知上一层
		this.radioConfig = config
		let lotteryEntry = xunbaoInfo.lotteryEntry
		let reachList = xunbaoInfo.reachList
        // this.nameToIndex = []

		let disposeItemList = []
		let itemList = []
		let firstItem = null

		for(let i =0;i<size_t(lotteryEntry);i++){
			let info = lotteryEntry[i].prize
			let itemInfo = AnalyPrizeFormat(info)
			if(lotteryEntry[i].first == 1){
				firstItem = itemInfo
			}
			table_insert(disposeItemList,itemInfo)
			table_insert(itemList,info)
		}

		if(firstItem!=null){
		   this.mElemList["firstItemBox"].updateByEntry(firstItem[0][0],firstItem[0][1])
		   this.mElemList["firstItemBox"].setVisible(true)
		   this.mElemList["first_item_group"].visible = true
		}else{
			this.mElemList["firstItemBox"].setVisible(false)
			this.mElemList["first_item_group"].visible = false
		}

		if(size_t(xunbaoPlayerInfo) > 0){
			this.mElemList["first_item_group"].visible = false
			this.mElemList["firstItemBox"].setVisible(false)
		}

		// let firstItemName = ItemSystem.getInstance().getItemName(firstItem[0][0])
		this.mElemList["first_item_name"].text = Localize_cns("LUCKY_TXT21")

		this.disposeItemList = disposeItemList
		this.itemList = itemList

		for(let i = 0;i<12;i++){
			//xunbao_ItemBox_
			let item = disposeItemList[i]
			let isOnce = lotteryEntry[i].once || 0
			let isJp = lotteryEntry[i].isAcura || 0
			if(item){
				if(item[0][2]){
					this.mElemList["xunbao_ItemBox_" + (i+1)].updateByEntry(item[0][0],item[0][1],item[0][2])
				}else{
					this.mElemList["xunbao_ItemBox_" + (i+1)].updateByEntry(item[0][0],item[0][1])
				}
			}else{
				this.mElemList["xunbao_ItemBox_" + (i+1)].updateByEntry(-1)
			}
			this.mElemList["jp_image"+(i+1)].visible = false
			// if(yiChouId == 3 || yiChouId == 9 || yiChouId==10){
			// 	let index = 1
			// }
			this.mElemList["yichou"+(i+1)].visible = false
			if(isOnce == 1){
				for(let _ in xunbaoPlayerInfo){
					let index = xunbaoPlayerInfo[_]
					if(index == (i+1)){
						this.mElemList["yichou"+(i+1)].visible = true
						break
					}
				}
			}
			this.mElemList["jp_image"+(i+1)].visible = (isJp == 1) 
			
		}

		let rd_xunbao:gui.RichDisplayer = this.mElemList["rd_xunbao_list"]
		rd_xunbao.clear()
		for (let i = size_t(reachList) - 1; i>= 0; i--) {
			let data = reachList[i]

			let roleName = data[0]
			// let index = data[1]
			// let item = this.itemList[index-1]
			let entryId = 20001
			if(data[1] != 9){
				let itemInfo = AnalyPrizeFormat(data[1])
				entryId = itemInfo[0][0]
			}		
			
			let itemInfo = ItemSystem.getInstance().getItemTemplateInfo(entryId)
			let itemName = itemInfo.name
			let quality = itemInfo.quality
			if(data[1][0][0] == "equip"){
				quality = data[1][0][3]
			}
			let color = "#" + GetQualityColorStr(quality)
			let text = String.format(Localize_cns("LUCKY_TXT5"),roleName,color,itemName)
			AddRdContent(rd_xunbao, text, "ht_20_cc_stroke", "white", 2, null, null, true)
			//this.mElemList[name + "tip"].text = text
		}
		rd_xunbao.showLastRow()
		// this.scroll.clearItemList()
		// let list = reachList

		// //谁谁谁抽到了什么
        // for (let i = 0; i<size_t(list); i++) {
        //     let v = list[i]
        //     let [window, flag] = this.scroll.getItemWindow(i, 260, 20, 0, 0, 2)
		// 	if (flag == true) {
        //     	this.initItemWindow(window)
		// 	}
        //     this.refreshItemWindow(window, v)
        // }
        // this.scroll.refreshScroll()
        // this.scroll.restoreViewXY() 
		//更新RdInfo
		for (let i = 0; i < size_t(config); i++) {
			let rd = this.mElemList["lucky_rd"+(i+1)]
			let info = config[i]
			let typeS = info[1]
			let num = info[2]
			let str = ""
			if(typeS == opItemUnit.BIND_CURRENCY){
				str = "#BIND_YUANBAO"
			}else if(typeS == opItemUnit.CURRENCY){
				str = "#YUANBAO"
			}
			let text = num + str
			AddRdContent(rd, text, "ht_20_cc", "white")
		}
    }

	//抽奖结果返回
	onUpdate(args){
		// if(size_t(resultInfo)<=1){
		// 	this.lottoType = 1
		// }
		let wnd = WngMrg.getInstance().getWindow("LuckyPrizeShowFrame") 
		if(wnd.isVisible()){
			return
		}
		let resultInfo = ActivitySystem.getInstance().getOperateLotteryResultInfo(this.activityIndex)
		this.mParentWnd.isAnimation = true
        
		this.ActivityLottoTable = []

		for(let i = 0; i<size_t(resultInfo); i++){
			// let index = resultInfo[i]
			// let itemInfo =  this.itemList[index-1]
			//let index = resultInfo[i]
			let itemInfo =  resultInfo[i]
			table_insert(this.ActivityLottoTable,itemInfo[0])
		}
		this.number = size_t(resultInfo)	
		// let stopNumList:any = {}
		// if(size_t(resultInfo)<=1){
			// this.stopNum = resultInfo[0] - 1
			this.stopNum = 0
			this.startRotate()
		// }else{
		// 	let wnd = WngMrg.getInstance().getWindow("PrizeShowFrame")
		// 	wnd.showAndSetData(this.ActivityLottoTable)
		// }

		// let wnd = WngMrg.getInstance().getWindow("PrizeShowFrame")
		// wnd.showAndSetData(this.ActivityLottoTable)

		// DelayEvecuteFunc(100, this.onRefresh, this)
	}

	////////////////////////////-旋转//////////////////////////////-
	//开始转
	startRotate(){
		let rate = Math.floor((36 + this.stopNum)/3+0.5)/36  // 时间间隔比例
		this.firstIntervalTime = this.firstIntervalTime*rate
		this.secondIntervalTime = this.secondIntervalTime*rate
		this.thirdIntervalTime = this.thirdIntervalTime*rate  
		this.fourthlyIntervalTime = this.fourthlyIntervalTime*rate 

		//this.setItemImage()	//这个好像是充值物品?

		for(let i = 0; i < size_t(this.imageChooseList);i++){
			this.tipTypeList[i] = 2	//??

			if(this.imageChooseList[i].visible == true){
			//if(this.imageChooseList[i].isVisible() ){
				this.imageChooseList[i].visible = (false)
			}
		}

		if(this.imageChooseList[0].visible == false){
		//if(this.imageChooseList[1].isVisible() == false ){
			this.imageChooseList[0].visible = (true)
		}

		if(this.timer){
			KillTimer(this.timer)
			this.timer = null
		}
		this.timer = SetTimer(this.checkSpeed, this, 20, true)
	}

	//控制转动速度
	checkSpeed( delay){
		if(this.turnsNum == 1 ){
			if(this.totalTime < this.firstIntervalTime  ){
				this.totalTime = this.totalTime + delay
			}else{
				this.refreshPriceChoose()
				this.firstIntervalTime = this.firstIntervalTime - 10
				this.totalTime = 0
			}

		}else if(this.turnsNum == 2 ){
			if(this.totalTime < this.secondIntervalTime  ){
				this.totalTime = this.totalTime + delay
			}else{
				this.refreshPriceChoose()
				this.totalTime = 0
			}
		}else if(this.turnsNum == 3){
			if(this.totalTime < this.thirdIntervalTime  ){
				this.totalTime = this.totalTime + delay
			}else{
				this.refreshPriceChoose()
				this.totalTime = 0
		}
		//fourthlyIntervalTime	
		}else if(this.turnsNum == 4 ){
			if(this.totalTime < this.fourthlyIntervalTime  ){
				this.totalTime = this.totalTime + delay
			}else{
				this.refreshPriceChoose()
				this.fourthlyIntervalTime = this.fourthlyIntervalTime + 10
				this.totalTime = 0
			}
		}
		// }else if(this.turnsNum == 3 ){
		// 	if(this.totalTime < this.thirdIntervalTime  ){
		// 		this.totalTime = this.totalTime + delay
		// 	}else{
		// 		this.refreshPriceChoose()
		// 		this.thirdIntervalTime = this.thirdIntervalTime + 10
		// 		this.totalTime = 0
		// 	}
		// }
	}

	//刷新选中框显隐
	refreshPriceChoose(){
		this.currChooseNum = this.currChooseNum + 1
		this.controlCircle = this.controlCircle + 1

		if(this.currChooseNum > 12*this.circleNum ){   	//注意
			this.circleNum = this.circleNum + 1
		}

		let num = Math.floor((33 + this.stopNum)/3+0.5)
		if(this.controlCircle > num ){
			this.turnsNum = this.turnsNum + 1
			this.controlCircle = 1
		}

		this.refreshChooseVisible()  //刷新选中框显隐
	}

	//隐藏上一个奖励的高亮框，显示当前的
	refreshChooseVisible(){
		for(let i = 0; i < size_t(this.imageChooseList);i++){
			if(this.imageChooseList[i].visible == true ){
			//if(this.imageChooseList[i].isVisible() ){
				this.imageChooseList[i].visible = (false)
			}
		}

		let num = this.currChooseNum - 12*(this.circleNum-1) -1
		// if(num < 0){
		// 	num = 0
		// }
		if(this.imageChooseList[num].visible == false ){	//注意
		//if(this.imageChooseList[this.currChooseNum - 12*(this.circleNum-1)].isVisible() == false ){	//注意
			this.imageChooseList[num].visible = (true)	//注意
		}

		if(this.circleNum > 2 ){	//控制圈数
			if(this.stopNum == num ){	//注意
				this.resetTimer()
			}
		}
	}

//停止转圈计时
	resetTimer(){
		if(this.timer ){
			KillTimer(this.timer)
			this.timer = null
		}

		this.reset()
	
		for(let i = 0; i < this.imageChooseList.length; i++){
			let v = this.imageChooseList[i]
			v.visible = (this.stopNum == i)
		}
		if(this.endTimer ){
			KillTimer(this.endTimer)
			this.endTimer = null
		}
		this.endTimer = SetTimer(this.openPrizeWindow, this, 350)
	}

	//打开奖励
	openPrizeWindow(){
		if(this.endTimer ){
			KillTimer(this.endTimer)
			this.endTimer = null
		}

		//检查有没有抽到宠物或者仙侣
		for(let i = 0 ;i<size_t(this.ActivityLottoTable);i++){
			let v = this.ActivityLottoTable[i]
			let itemId = v[1]
			let petId =  ItemSystem.getInstance().getPetIdByItemId(itemId)
			let xianlvId =  ItemSystem.getInstance().getXianLvIdByItemId(itemId)
			if(petId != 0 || xianlvId!=0){
				this.imageChooseList[0].visible = false
				let petWnd = WngMrg.getInstance().getWindow("EasterEggPetFrame")
				if(petId != 0){
					petWnd.onShowAndSetData(null,petId)
				}else{
					petWnd.onShowAndSetData(null,null,xianlvId)
				}
				this.mParentWnd.isAnimation = false
				this.mParentWnd.setBtnEnable(true)
				return
			}
		}

		this.imageChooseList[0].visible = false
		let wnd = WngMrg.getInstance().getWindow("LuckyPrizeShowFrame")
		wnd.showAndSetData(this.ActivityLottoTable,this.activityIndex,this.mParentWnd.index,this.radioConfig)
		this.mParentWnd.isAnimation = false
		this.mParentWnd.setBtnEnable(true)
		// wnd.playAnimate()
		// wnd.setRepeatCallBack(this.onLottoOnce, this, this.lottoType, Localize_cns("MOUNTS_TXT63"))
	}

	//转完一次后
	reset(){
	//重置
		this.firstIntervalTime = 180 //第1圈第一个间隔时间
		this.secondIntervalTime = 10 //第2圈第一个间隔时间
		this.thirdIntervalTime = 10 //第3圈第一个间隔时间
		this.fourthlyIntervalTime = 20
		this.turnsNum = 1
		this.currChooseNum = 1  
		this.circleNum = 1 //当前圈数
		this.controlCircle = 1
		this.sendingMessage = 0
	}

	resetData(){
		this.stopNum = 0  //停在哪里
		this.firstIntervalTime = 180 //第1圈第一个间隔时间
		this.secondIntervalTime = 10 //第2圈第一个间隔时间
		this.thirdIntervalTime = 10 //第3圈第一个间隔时间
		this.fourthlyIntervalTime = 20
		this.tipTypeList = [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
		//this.imageChooseList = []
		this.turnsNum = 1
		this.totalTime = 0
		this.currChooseNum = 1  //当前显示选中框
		this.controlCircle = 1  //用来分割速度
		this.circleNum = 1 //当前圈数
		this.sendingMessage = 0
	}
 }