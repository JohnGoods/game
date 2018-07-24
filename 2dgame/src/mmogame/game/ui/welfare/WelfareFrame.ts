class WelfareFrame extends BaseWnd {
    tabWndList: UITabWndList
    tabNum: number
    infoList: any[];
	radio_data : any[]
	btn_scroll : UIScrollList
	table_index :number
	list;

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/welfare/WelfareLobbyLayout.exml"]
		this.tabNum = 0
		this.table_index = -1
	}

    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		// this.mLayoutNode.setDoModal(true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let group : eui.Group = this.mElemList["wealfare_list"]
		this.btn_scroll = UIScrollList.newObj(this.mLayoutNode, "btn_scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_HORIZON)
		
	}

    public onUnLoad(): void {
		
	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = true;
		//this.mLayoutNode.setDoModal(true)
		this.onRefresh()
		this.tabWndList.setWndVisible(true);
	}

	public onHide(): void {
		this.tabNum = 0
		this.table_index = -1
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = false;
		//this.mLayoutNode.setDoModal(false )
		this.tabWndList.setWndVisible(false);
	}

	onRefresh(){
		// if(this.table_index == -1){
			this.disposeData()
		// }
		
		let configNum = size_t(this.list)
		if(this.tabNum == configNum){
			return
		}
		
		this.tabNum = configNum

        this.radio_data = []
		this.tabWndList = null
		this.btn_scroll.clearItemList()

        for (let i = 0; i < size_t(this.list); i++) {
            let v = this.list[i]
            let [window, flag] = this.btn_scroll.getItemWindow(v.index, 95, 117, 0, 0, 0)
			if (flag == true) {
            	this.initItemWindow(window , v)
			}
            this.refreshItemWindow(window, v)
        }
        // this.btn_scroll.refreshScroll()
        // this.btn_scroll.restoreViewXY() 

		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, this.radio_data)
		//this.tabWndList.setSelectedCallback(this.test, this)

		//待优化
		this.mElemList["group_tab1"].visible = false;
		this.mElemList["group_tab2"].visible = false;
		this.mElemList["group_tab3"].visible = false;
		this.mElemList["group_tab4"].visible = false;
		this.mElemList["group_tab5"].visible = false;
		this.mElemList["group_tab6"].visible = false;

		let tabIndex =  this.tabWndList.getTabIndex()
		if(tabIndex == 0){
			this.mElemList["group_tab1"].visible = true;
		}
		this.onRefreshTab()
	}	

	disposeData(){
		let config = [
			{["index"]:0,["wnd"]: SignRewardWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab1Click,["checkFunc"]:this.onSignCheckClick,["imageName"]:"fldt_Bt01",["imageDownName"]:"fldt_Bt01_down"},
			{["index"]:1,["wnd"]: LevelRewardWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab2Click,["checkFunc"]:this.onLevelCheckClick,["imageName"]:"fldt_Bt02",["imageDownName"]:"fldt_Bt02_down"},
			{["index"]:2,["wnd"]: MonthCardWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab3Click,["checkFunc"]:this.onMonthCheckClick,["imageName"]:"fldt_Bt03",["imageDownName"]:"fldt_Bt03_down"},
			{["index"]:3,["wnd"]: WeekCardWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab4Click,["checkFunc"]:this.onWeekCheckClick,["imageName"]:"fldt_Bt04",["imageDownName"]:"fldt_Bt04_down"},
			{["index"]:4,["wnd"]: WelfareWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab5Click,["checkFunc"]:this.onWelfareCheckClick,["imageName"]:"fldt_Bt05",["imageDownName"]:"fldt_Bt05_down"},
			{["index"]:5,["wnd"]: KeyWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab6Click,["checkFunc"]:this.onKeyCheckClick,["imageName"]:"fldt_Bt06",["imageDownName"]:"fldt_Bt06_down"},
		]

		//这里检查一下是否有配置筛选了 有的话才更新
		let list = []
		for (let i = 0; i < size_t(config); i++) {
			let info = config[i]
			let func:Function = info.checkFunc
			 if(func){
				if(func.call(WelfareFrame)){
					table_insert(list,info)
				}
			 }
		}

		this.list = list
	}

	onRefreshTab(){
		if(this.tabWndList){
			if(this.table_index!=-1){
				this.tabWndList.changeTabWithIndex(this.table_index)
				this.table_index = -1
			}
		}	
	}

	initItemWindow(window,data){
		let name = window.name
		let imageName = data.imageName
		let imageDownName = data.imageDownName
		let width = 100, height = 117
		let Info: any = [
               //背景
			   	{ ["index_type"]: eui.Group, ["name"]: name+"bg" , ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["messageFlag"]: true },
				{ ["index_type"]: eui.RadioButton, ["name"]: name +"group", ["image"]:imageName, ["font"]: "ht_20_cc_stroke",["image_down"]:imageDownName,["shortSelected"]:true, ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["event_name"]: null, ["fun_index"]: null},
			    ]	
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
	}

	refreshItemWindow(window, data){
		let name = window.name
		data.name = name + "group"
		table_insert(this.radio_data,data)
	}

    onTab1Click(){
        return true
    }

    onTab2Click(){
        return true
    }

	onTab3Click(){
        return true
    }

	//周卡
	onTab4Click(){
		// let openTime =  ActivitySystem.getInstance().getOpenTime()
		// //let openTime = 1522289110
		// let serverTime = GetServerTime()
        // let time = openTime + 8*86400
		// let shengyuTime = time - serverTime 
        // if(shengyuTime > 0){
		// 	MsgSystem.addTagTips(Localize_cns("WELFARE_TXT7"))
        //     return false
        // }

		let day =  GetServerDay() || 0	//开服多少天
		if(day<8){
			MsgSystem.addTagTips(Localize_cns("WELFARE_TXT7"))
			return false
		}
        return true
    }

	//西游福利
	onTab5Click(){
		// let openTime =  ActivitySystem.getInstance().getOpenTime()
		// let serverTime = GetServerTime()
        // let time = openTime + 86400
		// let shengyuTime = time - serverTime 
		// if(shengyuTime > 0){
		// 	MsgSystem.addTagTips(Localize_cns("WELFARE_TXT28"))
        //     return false
        // }

		let day =  GetServerDay() || 0	//开服多少天
		if(day<2){
			MsgSystem.addTagTips(Localize_cns("WELFARE_TXT28"))	
			return false
		}

		let curLevel = GetHeroProperty("level") || 0
		if(curLevel < 80){
			MsgSystem.addTagTips(Localize_cns("WELFARE_TXT8"))
			return false
		}
        return true
    }

	onTab6Click(){
        return true
    }

	//检查功能是否开启
	onSignCheckClick(){
		return true
	}

	onLevelCheckClick(){
		let curLevel = GetHeroProperty("level") || 0
		let levelInfo = getSaveRecord(opSaveRecordKey.levelReward)
		let allGet = true	//是否全部已领取
		for (let _ in GameConfig.LevelRewardConfig) {
			let v = GameConfig.LevelRewardConfig[_]
			let needLevel = v.leve
			if(levelInfo == null || levelInfo[needLevel] == null){
				allGet = false
				break
			}
		}
		if(allGet){
			return false
		}
		return true
	}

	onMonthCheckClick(){
		return true
	}

	onWeekCheckClick(){
		if(g_isExaming == true){//审核版本 周卡不开
			return false
		}
		return true
	}

	onKeyCheckClick(){
		return true
	}

	onWelfareCheckClick(){
		return true
	}

	showWndWithTabName(index){
		this.disposeData()
		let changeIndex = -1
		for(let i = 0;i<size_t(this.list);i++){
			if(this.list[i].index == index){
				changeIndex = i
			}
		}
		if(changeIndex != -1){
			this.table_index = changeIndex
		}
		this.showWnd()
	}
}