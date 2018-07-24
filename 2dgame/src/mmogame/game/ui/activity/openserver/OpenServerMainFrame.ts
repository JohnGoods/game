// TypeScript file
class OpenServerMainFrame extends BaseWnd {
    tabWndList: UITabWndList;
    curTabName: string;
    scroll: UIScrollList;
    controlDataTable: any;
    changeCount: number

    wndListDefine: any;
    radioBtnHandlerList: any;
    dotTipsButton: any;
    showingDotButtton: any;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/activity/OpenServerMainLayout.exml", "resource/layouts/activity/openServer/OpenTXAdvancedLayout.exml", 
                            "resource/layouts/activity/openServer/OpenTXRankLayout.exml", "resource/layouts/activity/openServer/OpenXMLayout.exml",
                            "resource/layouts/activity/openServer/OpenJGStoreLayout.exml", "resource/layouts/activity/openServer/OpenLJRechargeLayout.exml",
                            "resource/layouts/activity/openServer/OpenDragonStarLayout.exml", "resource/layouts/activity/openServer/OpenSCTuangouLayout.exml",
                            "resource/layouts/activity/openServer/OpenQMJinjieLayout.exml", "resource/layouts/activity/openServer/OpenQMUpgradeLayout.exml"]

        this.controlDataTable = {}
        this.radioBtnHandlerList = {}
        this.dotTipsButton = {}
        this.showingDotButtton = []
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();
        // this.setAlignCenter(true, true)
        this.setFullScreen(true)

        let mElemInfo: any = [

        //     { ["index_type"]: gui.Grid9Image, ["name"]: "bg_", ["title"]: null, ["font"]: null, ["image"]: "ty_UIDi01", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: null, ["fun_index"]: null },
        //     { ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["title"]: null, ["font"]: null, ["image"]: "ty_UIBg02", ["color"]: gui.Color.white, ["x"]: 30, ["y"]: 30, ["w"]: 540, ["h"]: 376, ["event_name"]: null, ["fun_index"]: null },
        //     { ["index_type"]: gui.RichDisplayer, ["name"]: "emailMsg", ["title"]: null, ["font"]: "ht_24_lc_stroke", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 44, ["y"]: 40, ["w"]: 480, ["h"]: 200, ["event_name"]: null, ["fun_index"]: null },
        //     { ["index_type"]: gui.RichDisplayer, ["name"]: "prizePoint_rd", ["title"]: null, ["font"]: "ht_24_lc_stroke", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 64, ["y"]: 260, ["w"]: 522, ["h"]: 60, ["event_name"]: null, ["fun_index"]: null },
        //     { ["index_type"]: gui.Button, ["name"]: "confirmBtn", ["title"]: Localize_cns("SURE"), ["font"]: "ht_24_cc_stroke_saddlebrown", ["image"]: "ty_tongYongBt1", ["color"]: gui.Color.white, ["x"]: 215, ["y"]: 432, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickConfirmBtn },
             { ["index_type"]: gui.Button, ["name"]: "btn_close_top", ["title"]: null,  ["color"]: gui.Color.white,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
             { ["index_type"]: gui.Button, ["name"]: "btn_back", ["title"]: null,   ["color"]: gui.Color.white, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
             { ["index_type"]: gui.Button, ["name"]: "btn_pre", ["title"]: null,    ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPre },
             { ["index_type"]: gui.Button, ["name"]: "btn_next", ["title"]: null,   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNext },
         ]
         UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this);

        // let tabInfoList = [
		// 	{ name: "geren_check",      wnd: BossSingleWindow.newObj(this.mLayoutNode, this), check: this.geRenCheck, obj: this },          //个人BOSS
		// 	{ name: "quanmin_check",    wnd: BossGlobalWindow.newObj(this.mLayoutNode, this), check: this.quanMinCheck, obj: this },        //全民BOSS
        //     { name: "yewai_check",      wnd: BossWildWindow.newObj(this.mLayoutNode, this), check: this.quanMinCheck, obj: this },          //野外BOSS
		//     { name: "shengshijie_check",        wnd: BossBefallWindow.newObj(this.mLayoutNode, this), check: this.quanMinCheck, obj: this },        //生死劫
        // ]
        this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList)
        this.tabWndList.setSelectedCallback(this.updateCurActName, this)

        let group = <eui.Group>this.mElemList["group_act"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_HORIZON)
        this.scroll.scroller.addEventListener(egret.Event.CHANGE, this.scrollOnMove, this)

        this.mElemList["label_wndName"].text = Localize_cns("OPENSERVER_TXT1")
        //{[活动索引]:[wndCtrl, 默认图标, 顺序号, 图标刷新（动态）?, 红点索引?]}
        this.wndListDefine = {
            [PayActivityIndex.NEW_SERVER_STAGE_LEVEL_UP]: [OpenTXAdvancedWindow.newObj(this.mLayoutNode, this, "txjinjie", this.mLayoutPaths[1]), "kfhd_Bt01", 1, true, GuideFuncSpace.GuideFuncCheckDefine.EVENT_NEW_STAGE_LEVEL_UP],      //天仙进阶
            //[PayActivityIndex.NEW_SERVER_STAGE_UP_RANK]: [OpenTXRankWindow.newObj(this.mLayoutNode, this, "txpaihang", this.mLayoutPaths[2]), "kfhd_Bt02", 2, true, null],           //进阶排行
            [PayActivityIndex.NEW_SERVER_INST_ZONES]: [OpenXMWindow.newObj(this.mLayoutNode, this, "xm", this.mLayoutPaths[3]), "kfhd_Bt03", 3, null, GuideFuncSpace.GuideFuncCheckDefine.EVENT_NEW_INST_ZONES],                         //熊猫副本（开服副本）
            [PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT]: [OpenJGStoreWindow.newObj(this.mLayoutNode, this, "jgs", this.mLayoutPaths[4]), "kfhd_Bt04", 4, null, null], //GuideFuncSpace.GuideFuncCheckDefine.EVENT_NEW_SHOP_DISCOUNT],                //折扣商店
            [PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE]: [OpenLJRechargeWindow.newObj(this.mLayoutNode, this, "leijichong", this.mLayoutPaths[5]), "kfhd_Bt05", 5, null, GuideFuncSpace.GuideFuncCheckDefine.EVENT_NEW_MIXACCU_RECHARGE],   //累积充值
            [PayActivityIndex.NEW_SERVER_MISSION]: [OpenDragonStarWindow.newObj(this.mLayoutNode, this, "dragon", this.mLayoutPaths[6]), "kfhd_Bt06", 6, true, GuideFuncSpace.GuideFuncCheckDefine.EVENT_NEW_MISSION],                //龙宫星级
            [PayActivityIndex.NEW_SERVER_ALL_BUY]: [OpenSCTuangouWindow.newObj(this.mLayoutNode, this, "tuangou", this.mLayoutPaths[7]), "kfhd_Bt07", 7, null, GuideFuncSpace.GuideFuncCheckDefine.EVENT_NEW_ALL_BUY],                //首充团购
            [PayActivityIndex.NEW_SERVER_ALL_STAGE_UP]: [OpenQMJinjieWindow.newObj(this.mLayoutNode, this, "jinjie", this.mLayoutPaths[8]), "kfhd_Bt08", 8, null, GuideFuncSpace.GuideFuncCheckDefine.EVENT_NEW_ALL_STAGE_UP],             //全民进阶
            [PayActivityIndex.NEW_SERVER_ALL_LEVEL_UP]: [OpenQMUpgradeWindow.newObj(this.mLayoutNode, this, "grade", this.mLayoutPaths[9]), "kfhd_Bt09", 9, null, GuideFuncSpace.GuideFuncCheckDefine.EVENT_NEW_ALL_LEVEL_UP],             //全民冲级
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PAY_ACTIVITY_LIST, this.refreshActList, this)
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)

        this.mLayoutNode.visible = (true)
        this.refreshActList()

        if (this.curTabName == null) {
		    this.tabWndList.setWndVisible(true)
        } else {
            this.onRefresh()
        }
        this.curTabName = this.tabWndList.getTabName()

        //用于刷新动态按钮
        this.changeCount = -1
        for (let k in this.wndListDefine) {
            let v = this.wndListDefine[k]
            if (v[3] == true) {
                if (k != PayActivityIndex.NEW_SERVER_STAGE_LEVEL_UP) {
                    RpcProxy.call("C2G_SendOperateAndPlayerData", tonumber(k))
                    this.changeCount = this.changeCount - 1
                }
            }
        }
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_LIST, this.refreshActList, this)
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)
        this.mLayoutNode.visible = (false)
		this.tabWndList.setWndVisible(false)
        // this.curTabName = null
    }

    onRefresh() {
        if (this.curTabName) {
            this.tabWndList.changeTab(this.curTabName, true)
        }
    }

    updateCurActName(event) {
        this.curTabName = this.tabWndList.getTabName()
    }

    // updateWnd() {
    //     let wnd = this.tabWndList.getCurrentWnd()
    //     if (wnd) {
    //         wnd.updateWnd()
    //     }
    //     this.refreshDotTips()
    // }

    scrollOnMove(args) {
        let leftBtn = this.mElemList["btn_pre"]
        let rightBtn = this.mElemList["btn_next"]
        if (leftBtn["btnTips"]) {
            leftBtn["btnTips"].visible = false
        }
        if (rightBtn["btnTips"]) {
            rightBtn["btnTips"].visible = false
        }
        
        for (let k in this.showingDotButtton) {
            let wnd = this.showingDotButtton[k]

            let viewport = this.scroll.scroller.viewport
            if (viewport.scrollH > wnd.x + wnd.width) {                     //按钮在左边
                this.createDotTipsUI(leftBtn, true)
            } else if (viewport.scrollH + this.scroll.getWidth() < wnd.x) { //按钮在右边
                this.createDotTipsUI(rightBtn, true)
            }
        }
    }

    refreshDotTipsImp() {
        this.showingDotButtton = []
        //开服活动检查ID 148~155
        let beginTipsId = 148
        let endTipsId = 155
        let exceptId = [151]                    //折扣商店
        for (let i = beginTipsId; i <= endTipsId; i++) {
            if (table_isExist(exceptId, i) == false) {
                let config = GameConfig.ButtonTipsConfig[i]
                let args = this.getDotTipsArgsImp(config.checkParam)
                let bCheck = GuideFuncSystem.getInstance().checkFunc(config, args)
                if (bCheck) {
                    let parentWnd = this.dotTipsButton[config.checkEvent]
                    if (parentWnd) {
                        this.createDotTipsUI(parentWnd, true, config)//有一个开启红点就够
                        table_insert(this.showingDotButtton, parentWnd)
                    }
                }
            }
        }
        
        this.scrollOnMove(null)
    }

    //初始化活动（按钮）列表
    refreshActList() {
        let actList = GetActivity(ActivityDefine.OpenServer).getOpenServerOpenActivity()
        let list = []
        for (let i = 0; i < actList.length; i++) {
            let v = actList[i]
            if (this.wndListDefine[v]) {
                table_insert(list, {actIndex: v, config: this.wndListDefine[v]})
            }
        }
        table_sort(list, function(a, b) {return a.config[2] - b.config[2]})
        
        let group = <eui.Group>this.mElemList["group_act"]
        let scroll = this.scroll
		scroll.clearItemList();
        this.tabWndList.clearTabWnd()
		this.controlDataTable = {}
        this.radioBtnHandlerList = {}
        this.dotTipsButton = {}

		let hasNum = list.length
		for (let k = 0; k < list.length; k++) {
			let v = list[k]
			let [window, flag] = scroll.getItemWindow(k, 100, 117, 3, 0, 0)

            if (flag == true) {
			    this.initRadioItemWindow(window, v)
            }
            this.refreshRadioItemWindow(window, v)
		}

        this.refreshDotTips()

        let func = function() {
            if (this.isVisible() == false) {
                return
            }
        this.scroll.moveToScrollIndex(this.tabWndList.getTabIndex(), true)
    }
        DelayEvecuteFunc(0, func, this)
    }

    initRadioItemWindow(window, value) {
		let name = ""

        let actIndex = value.actIndex
        let config = value.config
		let mElemInfo: any = [
			{ ["index_type"]: eui.RadioButton,   ["name"]: "_btn" + actIndex, ["image"]:config[1] + "_up", ["font"]: "ht_20_cc_stroke",["image_down"]:config[1] + "_down", ["shortSelected"]:true, ["x"]: 0, ["y"]: 0, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null},

		]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
		//ui_util.CreateDrawRectPtr(this.mElemList[name +"_dec"], gui.Color32Half.green)
		//AddRdContent(this.mElemList[name + "_dec"], Localize_cns("CHAT_ERROE_JINYAN"), "ht_20_cc", "zongse")

        // if (this.tabWndList == null) {
        //     this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, [{name: name + "_btn", wnd: BaseCtrlWnd.newObj(this.mLayoutNode, this)}])
        // }

        // this.tabWndList.insertTabWnd(name + "_btn" + actIndex, config[0])
        // if (config[3]) {
        //     this.radioBtnHandlerList[actIndex] = [this.mElemList[name + "_btn" + actIndex], actIndex]                //[按钮， 活动索引]
        //     this.refreshCheckIcon(this.mElemList[name + "_btn" + actIndex], actIndex)
        // }

        // if (config[4] != null) {
        //     this.dotTipsButton[config[4]] = this.mElemList[name + "_btn" + actIndex]
        // }
	}

    refreshRadioItemWindow(window, value) {
        let name = ""

        let actIndex = value.actIndex
        let config = value.config
        
        this.tabWndList.insertTabWnd(name + "_btn" + actIndex, config[0])
        if (config[3]) {
            this.radioBtnHandlerList[actIndex] = [this.mElemList[name + "_btn" + actIndex], actIndex]                //[按钮， 活动索引]
            this.refreshCheckIcon(this.mElemList[name + "_btn" + actIndex], actIndex)
        }

        if (config[4] != null) {
            this.dotTipsButton[config[4]] = window//this.mElemList[name + "_btn" + actIndex]
        }
    }

    refreshCheckIcon(radioBtn: eui.RadioButton, actIndex, defaultIcon?) {
        let imageName = GetActivity(ActivityDefine.OpenServer).getActivityRadioIcon(actIndex, defaultIcon)
        var downProperty: eui.SetProperty = <eui.SetProperty>radioBtn.skin.states[1].overrides[0]
        downProperty.value = imageName + "_down"

        var upProperty: eui.SetProperty = <eui.SetProperty>radioBtn.skin.states[0].overrides[0]
        upProperty.value = imageName + "_up"

        if (radioBtn.currentState != "down") {
            radioBtn.skinName._Image1.source = imageName + "_up"
        }
    }

    onActivityUpdate(args) {
        this.refreshDotTips()
        if (this.radioBtnHandlerList[args.actIndex] == null) {
            return
        }

        if (this.changeCount >= 0) {
            return
        }
        let [radioBtn, actIndex] = this.radioBtnHandlerList[args.actIndex]
        this.refreshCheckIcon(radioBtn, actIndex)

        this.changeCount = this.changeCount + 1
    }
     //////////////////////////////////////////
	onClickPre(args) {
        this.scroll.moveRelativeItemWindow(-2, true)
	}

    onClickNext(args) {
        this.scroll.moveRelativeItemWindow(2, true)
    }

    /////////////////////////////////////////////公共接口//////////////////////////////
    showActFrame(actIndex?) {
        if (actIndex) {
            this.curTabName = "_btn" + actIndex
        } else {
            this.curTabName = null
        }
        this.showWnd()
    }
}