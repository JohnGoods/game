// TypeScript file
class CarnivalFrame extends BaseWnd {
    tabWndList: UITabWndList;
    curTabName: string;
    scroll: UIScrollList;
    controlDataTable: any;

    wndListDefine: any;
    dotTipsButton: any;
    showingDotButtton: any;


    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/activity/OpenServerMainLayout.exml", 
                            "resource/layouts/activity/openServer/OpenTXAdvancedLayout.exml",
                            "resource/layouts/activity/openServer/OpenJGStoreLayout.exml",
                            "resource/layouts/activity/openServer/OpenLJRechargeLayout.exml",
                            "resource/layouts/activity/openServer/OpenXMLayout.exml",
                            ]

        this.controlDataTable = {}
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
             { ["index_type"]: gui.Button, ["name"]: "btn_back", ["title"]: null,   ["color"]: gui.Color.white,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
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

        this.mElemList["label_wndName"].text = Localize_cns("CARNIVAL_TITLE")
        this.wndListDefine = {
            [PayActivityIndex.EVERY_STAGE_A]: CarnivalMountUpgradeWindow.newObj(this.mLayoutNode, this, "zqjinjie", this.mLayoutPaths[1]),                 //天仙进阶
            [PayActivityIndex.EVERY_STAGE_B]: CarnivalPosUpgradeWindow.newObj(this.mLayoutNode, this, "fzjinjie", this.mLayoutPaths[1]),
            [PayActivityIndex.SHOP_DISCOUNT_A]: CarnivalDiscountWindow.newObj(this.mLayoutNode, this, "discount", this.mLayoutPaths[2]),                    //商店
            [PayActivityIndex.SHOP_DISCOUNT_B]: CarnivalBarginWindow.newObj(this.mLayoutNode, this, "bargain", this.mLayoutPaths[2]),
            [PayActivityIndex.MIX_ACCU_RECHARGE]: CarnivalAccumulateWindow.newObj(this.mLayoutNode, this, "leiji", this.mLayoutPaths[3]),               //累积充值
            [PayActivityIndex.NORMAL_INST_ZONES]: CarnivalInstZonesWindow.newObj(this.mLayoutNode, this, "xm", this.mLayoutPaths[4], GameConfig.NormalInstZonesConfig[1], PayActivityIndex.NORMAL_INST_ZONES),                         //熊猫副本（开服副本）
            
        }


    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PAY_ACTIVITY_LIST, this.refreshActList, this)
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.updateWnd, this)
        RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.updateWnd, this)
        this.mLayoutNode.visible = (true)
        this.refreshActList()
       
        if (this.curTabName == null) {
		    this.tabWndList.setWndVisible(true)
        } else {
            this.onRefresh()
        }
        this.curTabName = this.tabWndList.getTabName()

        RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.EVERY_STAGE_A)
        RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.EVERY_STAGE_B)
        RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.MIX_ACCU_RECHARGE)
        RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NORMAL_INST_ZONES)

    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_LIST, this.refreshActList, this)
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.updateWnd, this)
        UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.updateWnd, this)
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
        //开服以下活动检查ID
        let tipsIdList = {
                [PayActivityIndex.EVERY_STAGE_A]: 145,
                [PayActivityIndex.EVERY_STAGE_B]: 146,
                [PayActivityIndex.MIX_ACCU_RECHARGE]: 147,
                [PayActivityIndex.NORMAL_INST_ZONES]: 164,
        }
        for (let actIndex in tipsIdList) {
            let v = tipsIdList[actIndex]
            let config = GameConfig.ButtonTipsConfig[v]
            let args = this.getDotTipsArgsImp(config.checkParam)
            let bCheck = GuideFuncSystem.getInstance().checkFunc(config, args)
            if (bCheck) {
                let parentWnd = this.dotTipsButton[actIndex]
                if (parentWnd) {
                    // this.createDotTipsUI(parentWnd, true, config)//有一个开启红点就够
                    table_insert(this.showingDotButtton, parentWnd)
                }
            }
        }
        
        this.scrollOnMove(null)
    }

    updateWnd(args?) {
        let wnd = this.tabWndList.getCurrentWnd()
        if(args && args.actIndex){
            let index = args.actIndex
            this.refreshCheckIcon(args.actIndex)

            if(index != wnd.activityIndex){
                return
            }
        }
        if (wnd) {
            wnd.onRefresh()
        }
    }


    //初始化活动（按钮）列表
    refreshActList() {
        let actList = GetActivity(ActivityDefine.Carnival).getCarnivalOpenActivity()
        table_sort(actList, function(a, b){return a - b})
        let list = []//[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ,1 ]
        for (let i = 0; i < actList.length; i++) {
            let actIndex = actList[i]
            let imageIcon = GetActivity(ActivityDefine.Carnival).getActivityRadioIcon(actIndex)
            table_insert(list, {index: actIndex, imageName: imageIcon})
        }
        
        let group = <eui.Group>this.mElemList["group_act"]
        let scroll = this.scroll
		scroll.clearItemList();
        this.tabWndList.clearTabWnd()
		this.controlDataTable = {}
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

    initRadioItemWindow(window, config) {
		let name = ""

        let actIndex = config.index
		let mElemInfo: any = [
			{ ["index_type"]: eui.RadioButton,   ["name"]: "_btn" + actIndex, ["image"]:config.imageName + "_up", ["font"]: "ht_20_cc_stroke",  ["shortSelected"]:true, ["image_down"]:config.imageName + "_down", ["x"]: 0, ["y"]: 0, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null},

		]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
		//ui_util.CreateDrawRectPtr(this.mElemList[name +"_dec"], gui.Color32Half.green)
		//AddRdContent(this.mElemList[name + "_dec"], Localize_cns("CHAT_ERROE_JINYAN"), "ht_20_cc", "zongse")

        // if (this.tabWndList == null) {
        //     this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, [{name: name + "_btn", wnd: BaseCtrlWnd.newObj(this.mLayoutNode, this)}])
        // }

        // this.tabWndList.insertTabWnd(name + "_btn", this.wndListDefine[config.index])
	}
    refreshRadioItemWindow(window, config) {
		let name = ""

        let actIndex = config.index
        this.tabWndList.insertTabWnd("_btn" + actIndex, this.wndListDefine[actIndex])

        this.dotTipsButton[actIndex] = window//this.mElemList[name + "_btn" + actIndex]
    }

    refreshCheckIcon(actIndex) {
        let radioBtn: eui.RadioButton = <eui.RadioButton> this.mElemList["_btn" + actIndex]
        if (radioBtn == null) {
            return
        }

        let imageName = GetActivity(ActivityDefine.Carnival).getActivityRadioIcon(actIndex)
        var downProperty: eui.SetProperty = <eui.SetProperty>radioBtn.skin.states[1].overrides[0]
        downProperty.value = imageName + "_down"

        var upProperty: eui.SetProperty = <eui.SetProperty>radioBtn.skin.states[0].overrides[0]
        upProperty.value = imageName + "_up"

        if (radioBtn.currentState != "down") {
            radioBtn.skinName._Image1.source = imageName + "_up"
        }
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