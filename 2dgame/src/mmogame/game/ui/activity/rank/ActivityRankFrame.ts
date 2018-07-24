class ActivityRankFrame extends BaseWnd {
    // tabWndList: UITabWndList
    // tabNum: number
    // infoList: any[];
	// 
	// btn_scroll : UIScrollList
	// table_index :number
	// list;
	tabWndList: UITabWndList
	rankConfig:any[];
	actIndex:number
	dayScrollInfo:any[];
	list;
	btn_scroll : UIScrollList
	radio_data : any[]
	table_index :number
	scrollList: any
	rankType:number
	cellIndex;
	serverDay;
	curConfig;
	timerList: any
	overTime;
	checkStr;

    public initObj(...params: any[]) {
	    // this.mLayoutPaths = ["resource/layouts/welfare/WelfareLobbyLayout.exml"]
		this.scrollList = {}
		this.mLayoutPaths = ["resource/layouts/activity/rank/AcitivityRankLayout.exml"]
		// this.tabNum = 0
		this.rankType = -1
		this.table_index = -1
		this.serverDay = -1
		this.timerList = {}
		this.actIndex = PayActivityIndex.NEW_SERVER_STAGE_UP_RANK
		this.rankConfig = [
			{["day"]:1,["check"]:"zuoqi",["checkFunc"]:null,["imageName"]:"kfhd_Bt11_up",["imageDownName"]:"kfhd_Bt11_down"},	//坐骑
			{["day"]:2,["check"]:"tianxian",["checkFunc"]:null,["imageName"]:"kfhd_Bt02_up",["imageDownName"]:"kfhd_Bt02_down"},	//天仙
			{["day"]:3,["check"]:"shenbing",["checkFunc"]:null,["imageName"]:"kfhd_Bt13_up",["imageDownName"]:"kfhd_Bt13_down"},	//神兵
			{["day"]:4,["check"]:"chibang",["checkFunc"]:null,["imageName"]:"kfhd_Bt15_up",["imageDownName"]:"kfhd_Bt15_down"},	//翅膀
			{["day"]:5,["check"]:"fazhen",["checkFunc"]:null,["imageName"]:"kfhd_Bt17_up",["imageDownName"]:"kfhd_Bt17_down"},	//法阵
			{["day"]:6,["check"]:"xianwei",["checkFunc"]:null,["imageName"]:"kfhd_Bt19_up",["imageDownName"]:"kfhd_Bt19_down"},	//神位
			{["day"]:7,["check"]:"tongling",["checkFunc"]:null,["imageName"]:"kfhd_Bt21_up",["imageDownName"]:"kfhd_Bt21_down"},	//通灵
			{["day"]:8,["check"]:"shouhun",["checkFunc"]:null,["imageName"]:"kfhd_Bt23_up",["imageDownName"]:"kfhd_Bt23_down"},	//元神
		]
	   this.overTime = -1
	}

    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		this.cellIndex = null
		// this.mLayoutNode.setDoModal(true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "go_jinjie_btn",     ["title"]: Localize_cns("OPENSERVER_TXT5"), ["color"]: gui.Color.white, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo },
			{ ["name"]: "go_rank_btn",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGoRank },
			// { ["name"]: "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLeftClick },
            // { ["name"]: "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRightClick },
			{ ["name"]: "zhisheng_btn",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickZhiSheng },
			{ ["name"]: "zhekou_btn",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickZheKou },
			
			
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		// let group : eui.Group = this.mElemList["wealfare_list"]
		// this.btn_scroll = UIScrollList.newObj(this.mLayoutNode, "btn_scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_HORIZON)
		

		 this.mElemList["stage_rd"].setAlignFlag(gui.Flag.CENTER_CENTER);
		 this.mElemList["time_rd"].setAlignFlag(gui.Flag.CENTER_CENTER);

        // AddRdContent(this.mElemList["time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + "00:00:00"), "ht_22_cc_stroke", "gold")
        // AddRdContent(this.mElemList["stage_rd"], String.format(Localize_cns("OPENSERVER_TXT3"), "#nor" + String.format(Localize_cns("OPENSERVER_TXT4"), 9)), "ht_22_cc_stroke", "gold")

        for (let i = 0; i < 4; i++) {
            let group = <eui.Group>this.mElemList["_scroll" + i]
            this.scrollList["scroll" + i] = UIScrollList.newObj(this.mLayoutNode, "scroll" + i, 0, 0, group.width, group.height, group, UIScrollList.DIR_HORIZON)
        }

        this.mElemList["_view0"] = UIActorView.newObj(this.mLayoutNode, "_view0", 0, 10, this.mElemList["_view0"])
        this.mElemList["_view0"].setActorScale(1)
        this.mElemList["_view0"].setTouchEnable(false)
        this.mElemList["_view1"] = UIActorView.newObj(this.mLayoutNode, "_view1", 0, 10, this.mElemList["_view1"])
        this.mElemList["_view1"].setActorScale(0.8)
        this.mElemList["_view1"].setTouchEnable(false)
		this.mElemList["_view2"] = UIActorView.newObj(this.mLayoutNode, "_view2", 0, 10, this.mElemList["_view2"])
        this.mElemList["_view2"].setActorScale(0.8)
        this.mElemList["_view2"].setTouchEnable(false)

		//创建选择的
		// this.creatTab()
	}

    public onUnLoad(): void {
		
	}

	public onShow(): void {
		RegisterEvent(EventDefine.ACTIVITY_RANK_APPEARDATA_UPDATE, this.refreshAppearData, this)
		RegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.getUpdateData, this)
		this.mLayoutNode.visible = true;
		// this.tabWndList.setWndVisible(true)
		// this.mLayoutNode.setDoModal(true)
		// RpcProxy.call("C2G_SendOperateAndPlayerData", this.actIndex)
		this.onRefresh()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ACTIVITY_RANK_APPEARDATA_UPDATE, this.refreshAppearData, this)
		UnRegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.getUpdateData, this)
		// this.tabNum = 0
		for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}
        this.rankType = -1
		this.table_index = -1
		this.cellIndex = null
		this.overTime = -1
		// UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = false;
		// this.mLayoutNode.setDoModal(false )
		// if(this.tabWndList!=null){
			// this.tabWndList.setWndVisible(false);
		// }
		this.mElemList["_view0"].clearView()
        this.mElemList["_view1"].clearView()
		this.mElemList["_view2"].clearView()
	}

	onActivityUpdate(args) {
        if (args.actIndex != this.actIndex) {
            return
        }

        this.onRefresh()
    }

	onRefresh(){
		

		// let tabIndex =  this.tabWndList.getTabIndex()
		// this.tabWndList.changeTabWithIndex(tabIndex)
		// let curTabName =  this.tabWndList.getTabName()
		// this.tabWndList.changeTab(curTabName, true)

		this.onRefreshInfo()
		this.creatTime()
	}

	// creatTab(){
		// this.dayScrollInfo = []
		// this.disposeData()
		// if(size_t(this.dayScrollInfo)<=0){
		// 	return
		// }
		// let list = this.dayScrollInfo
		// this.list = list
		// this.radio_data = []
		// this.tabWndList = null
		// this.btn_scroll.clearItemList()

        // for (let i = 0; i < size_t(this.list); i++) {
        //     let v = this.list[i]
        //     let [window, flag] = this.btn_scroll.getItemWindow(v.day, 100, 106, 0, 0, 0)
		// 	if (flag == true) {
        //     	this.initItemWindow(window , v)
		// 	}
        //     this.refreshItemWindow(window, v)
        // }


		// this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, this.radio_data)
		// this.tabWndList.setSelectedCallback(this.onRefreshInfo, this)
	// }


	creatTime(){
		//活动时间
		for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}
        let tick = function(delay) {
			// let tableIndex = this.table_index || 0
			// let overTime = this.overTime + (tableIndex * 86400)	//结束时间
			let overTime = this.overTime 
            let leftTime = overTime - GetServerTime()
            if (leftTime < 0) {
                if (this.timerList["tick"]) {
                    KillTimer(this.timerList["tick"])
                    delete this.timerList["tick"] 
                }

                leftTime = 0
            }
            AddRdContent(this.mElemList["time_rd"], String.format(Localize_cns("OPENSERVER_TXT45"), getFormatDiffTime(leftTime)), "ht_20_cc", "ublack")
        }
        if (this.timerList["tick"] == null) {
            this.timerList["tick"] = SetTimer(tick, this, 200, true)
        }
	}

	onRefreshInfo(){
		// let tabIndex =  this.tabWndList.getTabIndex()
		// let index =	tabIndex


		this.disposeData()
		
		if(size_t(this.list)<=0){
			return
		}

		let index = 0
		this.curConfig = this.list[index]
		let dayIndex = this.curConfig.day

		let list = []
		let _config = GameConfig.NewServerRankConfig
        let l = _config[dayIndex] || []

		this.mElemList["title"].text = l[1].title

        for (let k in l) {
            let v = l[k]
            table_insert(list, v)
        }

        table_sort(list, function(a, b) {return a.prizeIndex - b.prizeIndex})

		let prizeInfo = list

		//切换了就重置一下
		// if(this.table_index != tabIndex){
			//更新物品信息
			for(let i = 0;i<4;i++){		
            	let config = prizeInfo[i]
            	let prize = AnalyPrizeFormat(config.prize || [])
            	this.refreshItemList(this.scrollList["scroll" + i], prize,i)                  //刷新奖励物品列表
                this.cellIndex = config.stageUp
			}

			for(let i = 0;i<3;i++){
				this.mElemList["view_name"+i].text = ""
				this.mElemList["_rank_name"+i].text = "" //名字
            	this.mElemList["view_power"+i].text = ""
				let actorView:UIActorView = this.mElemList["_view"+i]
				actorView.setVisible(false)
			}
			this.mElemList["my_rank"].text = Localize_cns("OPENSERVER_TXT11")

			AddRdContent(this.mElemList["stage_rd"], String.format(Localize_cns("OPENSERVER_TXT30"), "#nor" + MakeLongNumberShort(0)), "ht_20_cc", "ublack")
			
			
			
		// 	this.table_index = tabIndex
		// }	
		this.sendRankInfo()	//发送获取数据
	}

	sendRankInfo(){
		let dayIndex = this.curConfig.day
		let config = GameConfig.NewServerRankConfig
        let l = config[dayIndex] || []
        for (let k in l) {
            let v = l[k]
		
            if (this.rankType == -1 || this.rankType != v.rankType) {
                this.rankType = v.rankType
                //申请排行数据
				RpcProxy.call("C2G_RoleRank", this.rankType,1)
                // let message = GetMessage(opCodes.C2G_ROLE_RANK)
                // message.rankType = this.rankType
                // message.index = 1
                // SendGameMessage(message)
            }
        }
	}

	// disposeData(){
	// 	let info = ActivitySystem.getInstance().getOperateActivityInfo(this.actIndex) || []             //[serverDay, utils.getTomorrow()]
    //     let overTime = info[1] || GetServerTime()	//结束时间
    //     let dayIndex = info[0] || -1
		
	// 	if(dayIndex <= 0 || dayIndex > 8){
	// 		return
	// 	}

	// 	this.overTime = overTime
	// 	this.serverDay = dayIndex
	// 	for(let i = dayIndex- 1;i<size_t(this.rankConfig);i++){
	// 		let info = this.rankConfig[i]
	// 		let config = GameConfig.NewServerRankConfig[dayIndex] || []
	// 		info.config = config
	// 		table_insert(this.dayScrollInfo,info)
	// 	}
	// }

	disposeData(){
		// let info = ActivitySystem.getInstance().getOperateActivityInfo(this.actIndex) || []             //[serverDay, utils.getTomorrow()]
        
        let dayIndex = GetServerDay()
		let serverTime = GetServerTime()
		let overTime = GetTomorrowTime(serverTime)
		
		if(dayIndex <= 0 || dayIndex > 8){
			return
		}

		this.overTime = overTime
		this.serverDay = dayIndex
		// for(let i = dayIndex- 1;i<size_t(this.rankConfig);i++){
		// 	let info = this.rankConfig[i]
		// 	let config = GameConfig.NewServerRankConfig[dayIndex] || []
		// 	info.config = config
		// 	table_insert(this.dayScrollInfo,info)
		// }
		this.dayScrollInfo = []
		let info = this.rankConfig[dayIndex-1]
		let config = GameConfig.NewServerRankConfig[dayIndex] || []
		info.config = config
		this.checkStr = info.check
		table_insert(this.dayScrollInfo,info)

		this.list = this.dayScrollInfo
	}

	// initItemWindow(window,data){
	// 	let name = window.name
	// 	let imageName = data.imageName
	// 	let imageDownName = data.imageDownName
	// 	let width = 100, height = 106
	// 	let Info: any = [
    //            //背景
	// 		   	{ ["index_type"]: eui.Group, ["name"]: name+"bg" , ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["messageFlag"]: true },
	// 			{ ["index_type"]: eui.RadioButton, ["name"]: name +"group", ["image"]:imageName, ["font"]: "ht_20_cc_stroke",["image_down"]:imageDownName,["shortSelected"]:true, ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["event_name"]: null, ["fun_index"]: null},
	// 		    ]
    //     UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
	// }

	// refreshItemWindow(window, data){
	// 	let name = window.name
	// 	data.name = name + "group"
	// 	table_insert(this.radio_data,data)
	// }

	getUpdateData(args) {
		let getType = args.ranktype
		let getList = args.ranklist
		let appearData = args.firstAppearData

		//刷新
		if (getType == this.rankType) {
			this.onRefreshRank(getList, appearData)
		}
	}

	refreshHeroInfo(args) {
        let force = 0
        
        if (this.cellIndex == null  || cellOptionsIndex[this.cellIndex] == null) {
            
        } else {
            let funInfo = FunSystem.getInstance().getFunInfoWithType(cellOptionsIndex[this.cellIndex])
            if (funInfo != null) {
                force = GetTemCellTotalForce(cellOptionsIndex[this.cellIndex])
            }
        }
        AddRdContent(this.mElemList["stage_rd"], String.format(Localize_cns("OPENSERVER_TXT30"), MakeLongNumberShort(force)), "ht_20_cc", "ublack")
    }

	onRefreshRank(getList, appearData) {                        //刷新排行
        let list = []
        let info = ActivitySystem.getInstance().getOperateActivityInfo(this.actIndex) || [] 

        for (let i = 1; i < 4; i++) {
            if (i < 3) {
                if (getList[i] != null) {
                        let data = getList[i]                       //[1, force, prlId, 1, name]
                        this.mElemList["view_name" + i].text = data[4]//名字
						this.mElemList["_rank_name" + i].text = data[4]//名字
						this.mElemList["view_power"+i].text = String.format(Localize_cns("OPENSERVER_TXT33"), MakeLongNumberShort(data[1]))//战力
                } else {
                    this.mElemList["view_name" + i].text = Localize_cns("OPENSERVER_TXT32")
					this.mElemList["_rank_name" + i].text = Localize_cns("OPENSERVER_TXT32")
					this.mElemList["view_power"+i].text = Localize_cns("OPENSERVER_TXT32")
                }
            }

        }
        
        let data = getList[0]
        if (data != null) {
            this.mElemList["view_name0"].text = data[4]//名字
			this.mElemList["_rank_name0"].text = data[4]//名字
            this.mElemList["view_power0"].text = String.format(Localize_cns("OPENSERVER_TXT33"), MakeLongNumberShort(data[1]))//战力

        } else {
            this.mElemList["view_name0"].text = ""
			this.mElemList["_rank_name0"].text = "" //名字
            this.mElemList["view_power0"].text = ""
        }

        //我的排名
        let rank = -1
        for (let k in getList) {
            let v = getList[k]
            if (v[2] == GetHeroProperty("id")) {
                rank = tonumber(k) + 1
                break
            }
        }

        if (rank >= 0) {
            this.mElemList["my_rank"].text = String.format(Localize_cns("OPENSERVER_TXT10"), rank)
        }

        this.refreshHeroInfo(null)
    }


	refreshAppearData(args){
		let getType = args.ranktype
		let appearData = args.appearData
		if (getType == this.rankType) {
			if(size_t(appearData) == 0){
				this.mElemList["_view0"].clearView()
				this.mElemList["_view1"].clearView()
				this.mElemList["_view2"].clearView()
			}else{
				// let test = 1
				this.onAppearUpdate(appearData)
			}
		}	
	}

	//外观更新
	onAppearUpdate(appearInfo) {
		if(appearInfo == null)
			return;

		for(let i = 0;i<3;i++){
			if(size_t(appearInfo[i])>0){
				let actorView:UIActorView = this.mElemList["_view"+i]	
				actorView.setVisible(true)
				actorView.updateByPlayerAppearInfo(appearInfo[i])
			}else{
				this.mElemList["_view"+i].clearView()
			}
		}


		
		// actorView.setXY(0,10)
		
		// let actorView1:UIActorView = this.mElemList["_view1"]	
		// actorView1.setVisible(true)
		// actorView1.updateByPlayerAppearInfo(appearInfo)

		// let actorView2:UIActorView = this.mElemList["_view2"]	
		// actorView2.setVisible(true)
		// actorView2.updateByPlayerAppearInfo(appearInfo)

		// let model = GetShapeModelId(appearInfo.tianxianShapeId)
		// actorView2.updateByPlayer(model)	
	}

	refreshItemList(scroll, list,i) {
		scroll.clearItemList();
		let hasNum = list.length
		let index = i*10
		for (let k = 0; k < list.length; k++) {
			let v = list[k]
			let [window, flag] = scroll.getItemWindow(index, 80, 80, 0, 0, 0)

            if (flag == true) {
			    this.initItemWindow1(window,k)
            }
			this.refreshItemWindow1(window, v ,k)
			index = index + 1
		}
    }

    initItemWindow1(window,k) {
        let name =  window.name
        this.mElemList[name + "itemBox"] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox", 0, 0, window)
		if(k == 0)
		{
			let ElemInfo = [
                { ["index_type"]: gui.AnimBox, ["name"]: name +"item_anim_box", ["x"]: -13, ["y"]: -13, ["w"]: 99, ["h"]: 99, ["messageFlag"]: true }
        	]
        	this.mElemList[name+"itemBox"].createElem(ElemInfo, this.mElemList, this)
        	this.mElemList[name+"item_anim_box"].setAnimName("daoJuGuang")
        	this.mElemList[name+"item_anim_box"].visible = false
		}
	 }

    refreshItemWindow1(window, config , i) {
        let name = window.name
		
        let [entryId, count, quality] = config
		let itemConfig = ItemSystem.getInstance().getItemTemplateInfo(entryId)
		quality = itemConfig.quality
        this.mElemList[name + "itemBox"].updateByEntry(entryId, count, quality)
		if(i == 0){
			this.mElemList[name+"item_anim_box"].visible = false
			if(quality>=5){
				this.mElemList[name+"item_anim_box"].visible = true
			}
		}
    }
	
	onClickGo(args) {
        if (this.cellIndex == null) return
		let [flag, str] = CheckMainFrameFunction(this.checkStr)
		if (flag) {
             ExecuteActivityFrameFunction(this.cellIndex)
        }else {
            MsgSystem.addTagTips(str)
        } 
    }

	onClickGoRank(){
		let [flag, str] = CheckMainFrameFunction("paihangbang")
        if (flag) {
			let [flag, str] = CheckMainFrameFunction(this.checkStr)
			if (flag) {
            	let wnd = WngMrg.getInstance().getWindow("RankFrame")
            	wnd.showWidthTypeIndex(this.rankType)
        	}else {
            	MsgSystem.addTagTips(str)
        	}   
        }else {
            MsgSystem.addTagTips(str)
        } 
	}

	onClickZhiSheng(){
		WngMrg.getInstance().showWindow("PayStageUpFrame")	
	}

	onClickZheKou(){
		let wnd = WngMrg.getInstance().getWindow("OpenServerMainFrame")	
		wnd.showActFrame(PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT)
	}

	// onLeftClick() {
	// 	let scrollNum = size_t(this.dayScrollInfo)
    //     if(scrollNum<=1){
	// 		return
	// 	}
	// 	let tabIndex = this.tabWndList.getTabIndex()
	// 	if(tabIndex<1){
	// 		return
	// 	}
	// 	tabIndex = tabIndex - 1
	// 	this.tabWndList.changeTabWithIndex(tabIndex)
	// 	this.btn_scroll.moveToScrollIndex(tabIndex,true)
	// 	this.onRefreshInfo()
    // }

    // onRightClick() {
    //     let scrollNum = size_t(this.dayScrollInfo)
    //     if(scrollNum<=1){
	// 		return
	// 	}
	// 	let tabIndex = this.tabWndList.getTabIndex()
	// 	if(tabIndex>scrollNum-2){
	// 		return
	// 	}
	// 	tabIndex = tabIndex + 1
	// 	this.tabWndList.changeTabWithIndex(tabIndex)
	// 	this.btn_scroll.moveToScrollIndex(tabIndex,true)
	// 	this.onRefreshInfo()
    // }

}