// TypeScript file
class OpenTXRankWindow extends BaseCtrlWnd {
    controlDataTable: any;
    name: string;
    mLayoutPath: any;
    scrollList: any
    timerList: any
    actIndex: number
    cellIndex: string
    rankType: number

    public initObj(...params: any[]) {
        this.scrollList = {}
        this.controlDataTable = {};
        this.name = params[2] || "txr"                  //天仙排行
        this.mLayoutPath = params[3]
        this.actIndex = PayActivityIndex.NEW_SERVER_STAGE_UP_RANK
        this.timerList = {}
        this.cellIndex = null
        this.rankType = -1
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mElemList["group_wnd"])

        var elemInfo = [
            {["name"]: this.name + "go_tl",     ["title"]: Localize_cns("OPENSERVER_TXT5"), ["color"]: gui.Color.lime, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo },
            {["name"]: this.name + "my_rank",   ["title"]: String.format(Localize_cns("OPENSERVER_TXT10"), Localize_cns("OPENSERVER_TXT11")),},
            {["name"]: this.name + "_name3",    ["title"]: Localize_cns("OPENSERVER_TXT31"), ["color"]: gui.Color.lime, ["font"]: "ht_22_rc_stroke", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRank },
            {["name"]: this.name + "view_group",   ["messageFlag"]: true},
		]
		UiUtil.initElem(elemInfo, this.mElemList[this.name], this.mElemList, this)

        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)

        // this.mElemList[this.name + "time_rd"].setAlignFlag(gui.Flag.RIGHT)
        this.mElemList[this.name + "stage_rd"].setAlignFlag(gui.Flag.RIGHT);
        // this.mElemList["name_txt"].textColor = gui.Color.ublack;
        // this.mElemList["go_tl"].textColor = gui.Color.ublack;

        AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + "00:00:00"), "ht_22_cc_stroke", "gold")
        AddRdContent(this.mElemList[this.name + "stage_rd"], String.format(Localize_cns("OPENSERVER_TXT3"), "#nor" + String.format(Localize_cns("OPENSERVER_TXT4"), 9)), "ht_22_cc_stroke", "gold")

        for (let i = 0; i < 4; i++) {
            let group = <eui.Group>this.mElemList[this.name + "_scroll" + i]
            this.scrollList["scroll" + i] = UIScrollList.newObj(this.mLayoutNode, "scroll" + i, 0, 0, group.width, group.height, group, UIScrollList.DIR_HORIZON)
        }

        this.mElemList[this.name + "_view1"] = UIActorView.newObj(this.mLayoutNode, this.name + "_view", 0, 0, this.mElemList[this.name + "view_group"])
        this.mElemList[this.name + "_view1"].setActorScale(1.2)
        this.mElemList[this.name + "_view1"].setTouchEnable(false)
        this.mElemList[this.name + "_view2"] = UIActorView.newObj(this.mLayoutNode, this.name + "_view", -40, 0, this.mElemList[this.name + "view_group"])
        this.mElemList[this.name + "_view2"].setActorScale(1.2)
        this.mElemList[this.name + "_view2"].setTouchEnable(false)

        //this.mElemList[this.name + "_view"].updateByPlayer(20001)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)
        // RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshHeroInfo, this)
		RegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.getUpdateData, this)

        this.mElemList[this.name].visible = true
        this.onRefresh()
        this.onRefreshRank([], [])

        this.applyActInfo()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)
        // UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshHeroInfo, this)
		UnRegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.getUpdateData, this)

        this.mElemList[this.name].visible = false
        this.mElemList[this.name + "_view1"].clearView()
        this.mElemList[this.name + "_view2"].clearView()
        
        for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}
        this.cellIndex = null
        this.rankType = -1
    }

    onRefresh() {                       //刷新倒计时、战力等
        let info = ActivitySystem.getInstance().getOperateActivityInfo(this.actIndex) || []             //[serverDay, utils.getTomorrow()]
        let overTime = info[1] || GetServerTime()
        let dayIndex = info[0] || -1
        let l = GameConfig.NewServerRankConfig[dayIndex] || []
        for (let k in l) {
            let v = l[k]

            if (this.rankType == -1) {
                this.rankType = v.rankType
                
                RpcProxy.call("C2G_RoleRank", this.rankType,1)
                //申请排行数据
                // let message = GetMessage(opCodes.C2G_ROLE_RANK)
                // message.rankType = this.rankType
                // message.index = 1
                // SendGameMessage(message)
            }
        }
        
        for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}
        
        //活动时间
        let tick = function(delay) {
            let leftTime = overTime - GetServerTime()
            if (leftTime < 0) {
                if (this.timerList["tick"]) {
                    KillTimer(this.timerList["tick"])
                    delete this.timerList["tick"] 
                }

                leftTime = 0
            }
            AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + getFormatDiffTime(leftTime)), "ht_22_cc_stroke", "gold")
        }
        if (this.timerList["tick"] == null) {
            this.timerList["tick"] = SetTimer(tick, this, 200, true)
        }
    }

    onRefreshRank(getList, appearData) {                        //刷新排行
        let list = []
        let info = ActivitySystem.getInstance().getOperateActivityInfo(this.actIndex) || []             //[serverDay, utils.getTomorrow()]
        let dayIndex = info[0] || -1
        let l = GameConfig.NewServerRankConfig[dayIndex] || []
        for (let k in l) {
            let v = l[k]
            table_insert(list, v)
        }
        table_sort(list, function(a, b) {return a.prizeIndex - b.prizeIndex})

        for (let i = 1; i < 4; i++) {
            let config = list[i] || {}
            let prize = AnalyPrizeFormat(config.prize || [])
            this.refreshItemList(this.scrollList["scroll" + i], prize)                  //刷新奖励物品列表

            this.mElemList[this.name + "_tl" + i].text = config.tips || ""
            if (i < 3) {
                if (getList[i] != null) {
                    
                        let data = getList[i]                       //[1, force, prlId, 1, name]
                        this.mElemList[this.name + "_name" + i].text = data[4]//名字
                } else {
                    this.mElemList[this.name + "_name" + i].text = Localize_cns("OPENSERVER_TXT32")
                }
            }

            if (this.cellIndex == null) {
                this.cellIndex = config.stageUp
            }
        }

        //刷新冠军
        let config = list[0] || {}
        let prize = AnalyPrizeFormat(config.prize || [])
        this.refreshItemList(this.scrollList["scroll0"], prize)                  //刷新奖励物品列表
        
        let data = getList[0]
        if (data != null) {
            this.mElemList[this.name + "first_name"].text = data[4]//名字
            this.mElemList[this.name + "first_force"].text = String.format(Localize_cns("OPENSERVER_TXT33"), MakeLongNumberShort(data[1]))//战力

        } else {
            this.mElemList[this.name + "first_name"].text = ""
            this.mElemList[this.name + "first_force"].text = ""
        }

        if(size_t(appearData) == 0){
			this.mElemList[this.name + "_view1"].clearView()
			this.mElemList[this.name + "_view2"].clearView()
		}else{
			this.onAppearUpdate(appearData)
			// this.onPlayerUpdate(appearData)
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

        if (rank < 0) {
            this.mElemList[this.name + "my_rank"].text = Localize_cns("OPENSERVER_TXT11")
        } else {
            this.mElemList[this.name + "my_rank"].text = String.format(Localize_cns("OPENSERVER_TXT10"), rank)
        }

        this.refreshHeroInfo(null)
    }
    
	//外观更新
	onAppearUpdate(appearInfo) {
		if(appearInfo == null)
			return;
		let actorView:UIActorView = this.mElemList[this.name + "_view1"]	
		actorView.updateByPlayerAppearInfo(appearInfo)
		actorView.setXY(0,0)
		
		let actorView2:UIActorView = this.mElemList[this.name + "_view2"]	
		let model = GetShapeModelId(appearInfo.tianxianShapeId)
		actorView2.updateByPlayer(model)	
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
        AddRdContent(this.mElemList[this.name + "stage_rd"], String.format(Localize_cns("OPENSERVER_TXT30"), "#nor" + MakeLongNumberShort(force)), "ht_22_cc_stroke", "gold")
    }

    refreshItemList(scroll, list) {
		scroll.clearItemList();
		let hasNum = list.length
		for (let k = 0; k < list.length; k++) {
			let v = list[k]
			let [window, flag] = scroll.getItemWindow(k, 80, 80, 0, 0, 0)

            if (flag == true) {
			    this.initItemWindow(window)
            }
			this.refreshItemWindow(window, v)
		}
    }

    initItemWindow(window) {
        let name = this.name + window.name
        this.mElemList[name + "itemBox"] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox", 0, 0, window)
    }

    refreshItemWindow(window, config) {
        let name = this.name + window.name

        let [entryId, count, quality] = config
        this.mElemList[name + "itemBox"].updateByEntry(entryId, count, quality)
    }

    applyActInfo() {
        RpcProxy.call("C2G_SendOperateAndPlayerData", this.actIndex)
    }
    
    onActivityUpdate(args) {
        if (args.actIndex != this.actIndex) {
            return
        }

        this.onRefresh()
    }

    getUpdateData(args) {
		let getType = args.ranktype
		let getList = args.ranklist
		let appearData = args.firstAppearData

		//刷新
		if (getType == this.rankType) {
			this.onRefreshRank(getList, appearData)
		}
	}
    ////////////////////////////////////////////////
    onClickGo(args) {
        if (this.cellIndex == null) return
        ExecuteActivityFrameFunction(this.cellIndex)
    }

    onClickRank(args) {
        let [flag, str] = CheckMainFrameFunction("paihangbang")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("RankFrame")
            wnd.showWidthTypeIndex(this.rankType)
        }else {
            MsgSystem.addTagTips(str)
        }   
    }
}