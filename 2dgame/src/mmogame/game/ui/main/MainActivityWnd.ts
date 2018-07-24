class MainActivityWnd extends BaseCtrlWnd {
	taskElem: any;
	nameToIndex: any[];
	isRefresh: boolean
	btnList: any[];
	timerConfig
	timerList;
	timerLableList;
	maxBtnNum:number = 12;

	public initObj(...params: any[]): void {
		this.timerList = {}
		this.timerLableList = {}
		this.timerConfig = [
			{index:PayActivityIndex.TEN_YUAN_GIFT,timerCallCheck:this.TenYuanCheck,timerCall:this.TenYuanCall}

		]
	}
	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		this.createFrame()
		this.isRefresh = false
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.PAY_ACTIVITY_LIST, this.refreshFrame, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		RegisterEvent(EventDefine.SHARE_SYS_UPDATE, this.refreshFrame, this)
		RegisterEvent(EventDefine.ACTIVITY_STATE_LIST, this.checkDailyDouble, this)
		
		RegisterEvent(EventDefine.UI_SHOW, this.onUIShowEvent, this)
		RegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)
		this.mElemList["activity_wnd"].visible = true
		this.refreshFrame()
		this.checkBottomPos()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PAY_ACTIVITY_LIST, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.SHARE_SYS_UPDATE, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.ACTIVITY_STATE_LIST, this.checkDailyDouble, this)
		UnRegisterEvent(EventDefine.UI_SHOW, this.onUIShowEvent, this)
		UnRegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)
		this.mElemList["activity_wnd"].visible = false

		for (let _ in this.timerList) {
            let timer = this.timerList[_]

            KillTimer(timer)
        }
        this.timerList = {}
	}

	refreshFrame() {
		this.nameToIndex = []
		let y = 0
		//let yIndex = 0 
		let shownamelist = this.checkShowList()
		for (let i = 0; i < size_t(this.btnList); i++) {
			//y = 550 - (yIndex * 80)
			let info = this.btnList[i]
			let activityIndex = info.index

			let btnName = this.getBtnName(i)

			if (btnName == "dynamic_richang") {
				this.checkDailyDouble()
			}

			//this.mElemList[btnName].visible = false
			let bVisible = false
			for (let j = 0; j < size_t(shownamelist); j++) {
				if (info.index == shownamelist[j]) {
					//this.mElemList[btnName].visible = true
					bVisible = true
					// this.mElemList[btnName].y = y
					// yIndex = yIndex + 1
					break
				}
			}

			UiUtil.setVisible(this.mElemList[btnName], bVisible, bVisible)
			this.nameToIndex[btnName] = activityIndex
		}
	}

	checkShowList() {
		let shownamelist = []
		for (let i = 0; i < size_t(this.btnList); i++) {
			let info = this.btnList[i]
			let index = info.index
			if (g_isExaming == true && index == PayActivityIndex.TEN_YUAN_GIFT){//审核版本,十元购不开放
				continue;
			}
			if (info.check) {
				if (info.check() == true) {
					table_push(shownamelist, index)
				}
			} else {
				if (this.checkAcitivityIsOpen(index) == true) {
					table_push(shownamelist, index)
				}
			}
		}
		let num = size_t(shownamelist)
		if ( num > this.maxBtnNum){//最多显示6个
			//排序 index大的 先不显示
			table_sort(shownamelist, function(a, b){
                return a - b
            })
			let removenum = num - this.maxBtnNum
			for (let i = 0; i < removenum; ++i){
				table_remove_pos(shownamelist, num-i-1)
			}
		}
		return shownamelist
	}

	getBtnName(i) {
		let info = this.btnList[i]
		let name = info.name
		if (name == null) {
			name = "activity_btn" + info.index
		}
		return name
	}

	createFrame() {
		let funcList = [
			{ index: -2, image: "zjm_Bt36", check: this.daily, func: this.dailyClick, name: "dynamic_richang" },//日常 
			{ index: -1, image: "zjm_Bt29", check: this.checkBag, func: this.bagClick, name: "dynamic_beibao" },//背包
		]

		let btnList = []

		for (let i = 0; i < size_t(funcList); i++) {	//常驻
			let info = funcList[i]
			table_insert(btnList, info)
		}

		let openList = GetPayActivityUiConfig("Main")	//活动
		for (let i = 0; i < size_t(openList); i++) {
			let info = openList[i]
			table_insert(btnList, info)
		}

		let shareList = ShareSystem.getInstance().getBtnList()//分享关注
		for (let i = 0; i < size_t(shareList); i++) {
			let info = shareList[i]
			table_insert(btnList, info)
		}

		


		for (let i = 0; i < size_t(btnList); i++) {
			let info = btnList[i]
			let image = info.image
			let index = info.index
			let call = this.onClick

			if (info.func != undefined) {
				call = info.func
			}

			//    let x = 0
			//    let y = 550 - (i * 80)

			let name = info.name
			if (name == null) {
				name = "activity_btn" + index
			}

			var elemInfo1 = [
				{ ["index_type"]: gui.Button, ["name"]: name, ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: image, ["color"]: gui.Color.white, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: call },
			]
			UiUtil.createElem(elemInfo1, this.mLayoutNode, this.mElemList, this, this.mElemList["activity_wnd"]);

			if (name == "dynamic_richang") {
				var elemInfo2 = [
					{ ["index_type"]: eui.Image, ["name"]: name + "_redDot", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: "ty_shuangBeiTiShi", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 35, ["h"]: 35, },
				]
				UiUtil.createElem(elemInfo2, this.mLayoutNode, this.mElemList, this, this.mElemList[name]);
				this.mElemList[name + "_redDot"].visible = false
			}

			//更新倒计时
			// if(info.timer == true){
			// 	var elemInfo3 = [
			// 		{ ["index_type"]: eui.Image, ["name"]: name + "time", ["image"]: "zjm_shiJianDi01", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: -10, ["w"]: 58, ["h"]: 19,  ["messageFlag"]: true},
			// 		{ ["index_type"]: eui.Label, ["name"]: name + "timeLabel",["parent"]: name + "time", ["title"]: "12:12", ["font"]: "ht_20_cc_stroke",  ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 58, ["h"]: 19,  ["messageFlag"]: true},
			// 	]
			// 	UiUtil.createElem(elemInfo3, this.mLayoutNode, this.mElemList, this, this.mElemList[name]);

			// 	let func:Function = null
			// 	let funcheck:Function = null
			// 	for(let _ in this.timerConfig){
			// 		let config = this.timerConfig[_]
			// 		if(index == config.index){
			// 			func = config.timerCall
			// 			funcheck = config.timerCallCheck
			// 		}
			// 	}

			// 	this.timerLableList[name] = name + "timeLabel"

			// 	let timerIsNeedSet = false

			// 	if(funcheck != null){
			// 		timerIsNeedSet = funcheck.call(this)
			// 	}

			// 	if(this.timerList[name + "time"] == null && func!=null && timerIsNeedSet){
			// 		this.timerList[name + "time"] = SetTimer(func, this, 1000, true);
			// 	}else{
			// 		if(this.timerList[name + "time"]){
			// 			KillTimer(this.timerList[name + "time"])
			// 		}
			// 	}
			// }

		}
		this.btnList = btnList
	}

	TenYuanCheck(){
		let serverTime = GetServerTime()
		let tomorrowTime = GetTomorrowTime(serverTime)
		let day = GetServerDay()
		if(serverTime < tomorrowTime && day <= 8){
			return true
		}
		return false
	}

	TenYuanCall(){
		let name = this.timerLableList["activity_btn" + PayActivityIndex.TEN_YUAN_GIFT]
		let lable = this.mElemList[name]
		let serverTime = GetServerTime()
		let tomorrowTime = GetTomorrowTime(serverTime)
		let day = GetServerDay()
		if(serverTime < tomorrowTime && day <= 7){
			let timeDiffcuf = tomorrowTime - serverTime
			let timeText = getFormatDiffTimDayHour(timeDiffcuf)
			lable.text = timeText
		}else{
			KillTimer(this.timerList[name + "time"])
		}
		
	}

	dailyClick() {
		ExecuteMainFrameFunction("richang")
	}

	bagClick() {
		ExecuteMainFrameFunction("beibao")
	}

	checkDailyDouble() {
		let btnName = "dynamic_richang"
		let check = this.daily()
		if (this.mElemList[btnName + "_redDot"] && check) {
			let checkDouble = GuideFuncSystem.getInstance().checkDailyZuDuiIsDouble()
			if (checkDouble) {
				this.mElemList[btnName + "_redDot"].visible = true
			} else {
				this.mElemList[btnName + "_redDot"].visible = false
			}
		}
	}


	// leichongClick(){
	// 	let wnd = WngMrg.getInstance().getWindow("TouZiFrame")
	// 	wnd.showWithIndex(0)
	// }

	// firstPayClick(){
	// 	// TLog.Debug("firstPayClick")
	// }

	// monthClick(){
	// 	// TLog.Debug("monthClick")
	// }

	onClick(args) {
		let name = args.target.name
		if (this.nameToIndex[name] == null) {
			return
		}
		let index = this.nameToIndex[name]
		ExecuteActivityIndex(index)
	}

	checkAcitivityIsOpen(index) {
		//return true
		if (index == PayActivityIndex.C_MONTHCARD) {	//月卡
			let level = GetHeroProperty("level")
			let isBuy = PaySystem.getInstance().isMonthCardActive()
			if (isBuy) {
				return false
			}
			return (level >= 20)
		}
		return ActivitySystem.getInstance().checkActivityIsOpen(index)
	}

	checkBag() {
		return true
	}

	daily() {
		let check = CheckMainFrameFunction("richang")
		return check[0]
	}


	onUIShowEvent(args) {
		if (args.window.classname == "IconMsgFrame") {
			this.checkBottomPos()
			this.refreshFrame()
		}

	}

	onUIHideEvent(args) {
		if (args.window.classname == "IconMsgFrame") {
			this.checkBottomPos()
			this.refreshFrame()
		}
	}


	checkBottomPos() {
		let activity_wnd = this.mElemList["activity_wnd"]
		if (MsgSystem.isIconMsgVisible()) {
			activity_wnd.bottom = 500
			UiUtil.setWH(activity_wnd, 160, 440)
			//activity_wnd
			this.maxBtnNum = 10
		} else {
			activity_wnd.bottom = 420
			UiUtil.setWH(activity_wnd, 160, 520)
			this.maxBtnNum = 12
		}
	}

}