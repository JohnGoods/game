class TouZiFrame extends BaseWnd {
    tabWndList: UITabWndList
    tabIndex: number
    infoList: any[];
	activityList : any[];

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/TouZiLayout.exml"]
        //this.tabIndex = -1
	}

    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		// this.mLayoutNode.setDoModal(true)

		this.mElemList["group_tab_1"].visible = false;
		this.mElemList["group_tab_2"].visible = false;
		this.mElemList["group_tab_3"].visible = false;
		this.mElemList["group_tab_4"].visible = false;
		this.mElemList["group_tab_5"].visible = false;

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		this.disposeData()
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, this.activityList)
	}

	disposeData(){
		let activityList = []
		this.infoList = [
			{ ["index"]: PayActivityIndex.FIRST_PAY, ["checkFunc"]: this.checkShouChong,["wnd"]: TouZiShouChongWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab2Click,["text"]:Localize_cns("INVEST_TXT23"),["checkRedPoint"]: this.checkShouChongRed},
			{ ["index"]: PayActivityIndex.LEVEL_FUNDS, ["checkFunc"]: this.checkZiJin,["wnd"]: TouZiChengzhangWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab2Click,["text"]:Localize_cns("INVEST_TXT24"),["checkRedPoint"]: this.checkZiJinRed},
			{ ["index"]: PayActivityIndex.INVEST_PLAN, ["checkFunc"]: this.checkJiHua,["wnd"]: TouZiJiHuaWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab1Click,["text"]:Localize_cns("INVEST_TXT25"),["checkRedPoint"]: this.checkJiHuaRed},
			{ ["index"]: PayActivityIndex.ACCUM_PAY_PRIZE, ["checkFunc"]: this.checkLeiChong,["wnd"]: TouziLeiJiWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab1Click,["text"]:Localize_cns("INVEST_TXT26"),["checkRedPoint"]: this.checkLeiChongRed},
			{ ["index"]: PayActivityIndex.GOD_PET_INCOME, ["checkFunc"]: this.checGodPet,["wnd"]: TouZiGodPetWindow.newObj(this.mLayoutNode, this),["check"]:this.onTab1Click,["text"]:Localize_cns("INVEST_TXT28"),["checkRedPoint"]: this.checGodPetRed},
		]

		let index = 1
		for (let i = 0; i < size_t(this.infoList); i++) {
			 let infoList = this.infoList[i]
			 let info = []
			 if(infoList.checkFunc.call() == true){
				 info["name"] = "tab" + index
				 info["wnd"] = infoList.wnd
				 info["text"] = infoList.text
				 info["index"] = infoList.index
				 info["checkRedPoint"] = infoList.checkRedPoint
				 table_insert(activityList,info)
				 index = index + 1
			 }
		}

		this.activityList = activityList
	}

    public onUnLoad(): void {
		
	}

	public onShow(): void {
	//	RegisterEvent(EventDefine.ACTOR_XIANLV_UPDATE, this.onRefresh, this)
		// if (this.tabIndex != -1) {
			this.mLayoutNode.visible = true;
			this.tabWndList.setWndVisible(true);
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		// }else{
		// 	this.onHide()	//都没有得显示了
		// }
		for(let i = 0;i<4;i++){
			let info = this.activityList[i]
			if(info){
				this.mElemList["tab"+(i+1)].visible = true
				this.mElemList["tab"+(i+1)].label = info.text 
				let text = info.text 
			}else{
				this.mElemList["tab"+(i+1)].visible = false
				this.mElemList["tab"+(i+1)].label = ""
			}
		}
	}

	public onHide(): void {
	//	UnRegisterEvent(EventDefine.ACTOR_XIANLV_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = false;
		// if (this.tabIndex != -1) {
			this.tabWndList.setWndVisible(false);
		// }
	}

	checkRedPoint(){
	  let list = this.activityList
	  for(let i = 0 ; i<4;i++){
		  this.mElemList["red_point"+(i+1)].visible = false
		  if(list[i]){	//里面有数据
			  let infoList = list[i]
			  if(infoList.checkRedPoint.call() == true){
				  this.mElemList["red_point"+(i+1)].visible = true
			  }
		  }
	  }
	}

	checkShouChongRed(){
		let firstPayInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.FIRST_PAY)

		let heroInfo = GetHeroPropertyInfo()
        let exp = heroInfo.VIP_exp
        let vip = VipSystem.getInstance().GetVipLevel()
        let curVipExp = VipSystem.getInstance().getVipSum(vip)
        let sum = curVipExp + exp

		for(let _ in GameConfig.FirstRechargeConfig){
			let point = GameConfig.FirstRechargeConfig[_].point
			let index = tonumber(_)
			if(sum>=point){
               if(firstPayInfo == null || firstPayInfo[index] == null){
				   return true
			   }
        	}
		}
		return false
	}

	//基金
	checkZiJinRed(){
		let chengZhangInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.LEVEL_FUNDS)
		if(chengZhangInfo == -1){
             return false
        }else{	//购买了
			let heroLevel = GetHeroProperty("level")
			for(let _ in GameConfig.LevelFundsConfig){
				let v = GameConfig.LevelFundsConfig[_]
				let needLevel = v.level
				if (heroLevel >= needLevel) {
					if (chengZhangInfo == null || chengZhangInfo[_] == null) {
						return true
					}
				}
			}
            // for (let i = 0; i < size_t(GameConfig.LevelFundsConfig); i++) {
			// 	let v = GameConfig.LevelFundsConfig[i+100]
			// 	let needLevel = v.level
			// 	if(heroLevel>=needLevel){
			// 		if(chengZhangInfo == null || chengZhangInfo[i+100] == null){
			// 			return true
			// 		}
			// 	}
			// }
        }
		return false
	}

	//计划
	checkJiHuaRed(){
		let planInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.INVEST_PLAN)
		if(planInfo == null){
			return false
		}
		if(planInfo == -1){
             return false
        }
		let day = size_t(planInfo) + 1
		let openTime = ActivitySystem.getInstance().getOpenTime()
		let time = GetTodayTime(openTime)	//1522252800 开服当天0点 
		let serverTime = GetServerTime()	//
		let canGetDay = Math.floor((serverTime - time) / 86400) + 1
		if(canGetDay >= day){
			return true
		}
		return false
	}
	
	//累充红点
	checkLeiChongRed(){
		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.ACCUM_PAY_PRIZE)
		if(playerInfo == null){
			return false
		}
		let getList = playerInfo.getPrize
        for(let _ in getList){
            let state = getList[_]
            if(state == 1){
                return true
            }
        }
		return false
	}

	//神宠来袭
	checGodPetRed(){
		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.GOD_PET_INCOME)
		if(playerInfo == null){
            return false
        }
		let config = GameConfig.GodPetInComeConfig
		let chuliList = []
		let getPrize = playerInfo.getPrize
        for(let _ in getPrize){
           table_insert(chuliList,getPrize[_])
        }
        for(let _ in config){
            let info = config[_]
            let index = info.Index - 100
            if(chuliList && chuliList[index] == 1){
				return true
			}
        }
		return false
	}

	//检查
	checkShouChong(){
		//let index = PayActivityIndex.FIRST_PAY
		// return true
		return ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.FIRST_PAY)
	}

	//基金
	checkZiJin(){
		if (g_isExaming == true){
			return false;
		}
		// return true
		return ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.LEVEL_FUNDS)
	}

	//计划
	checkJiHua(){
		// return true
		return ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.INVEST_PLAN)
	}

	
	checkLeiChong(){
		// return true 
		return ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.ACCUM_PAY_PRIZE)
	}

	checGodPet(){
		return ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.GOD_PET_INCOME)
	}

    ////接口
    showWithIndex(index){
		this.tabIndex = 0
		this.disposeData()
		for(let i =0;i<size_t(this.activityList);i++){
			let info = this.activityList[i]
			if(info.index == index){
				this.tabIndex = i
			}
		}
        this.showWnd()
    }

	///-----检查是否开启
    onTab0Click(){
		//this.showWithIndex(1)
		return true
        // ExecuteMainFrameFunction("shouchong")
        // this.hideWnd()
        // return false
    }

    onTab1Click(){
		//this.showWithIndex(2)
        return true

    }

    onTab2Click(){
		//this.showWithIndex(3)
        return false
    }

	onTab3Click(){
		//this.showWithIndex(3)
        return true
    }	
}