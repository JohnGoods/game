// TypeScript file
class WonderFrame extends BaseWnd {
    tabWndList: UITabWndList;
    scroll: UIScrollList;
    wndListDefine: any;
    tabIndex: number;

    public initObj(...params: any[]) {
        this.mLayoutPaths = [
            "resource/layouts/activity/OpenServerMainLayout.exml",
            "resource/layouts/wonder/WonderMysteryShopLayout.exml",
            "resource/layouts/wonder/WonderAccumulateLayout.exml",
            "resource/layouts/wonder/WonderHolidayLayout.exml",
            "resource/layouts/wonder/WonderPetClearLayout.exml",
            "resource/layouts/wonder/WonderSixWorldLayout.exml"
        ]

        this.tabIndex = 0
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["index_type"]: gui.Button, ["name"]: "btn_pre", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPre },
            { ["index_type"]: gui.Button, ["name"]: "btn_next", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNext },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList)

        let group = <eui.Group>this.mElemList["group_act"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_HORIZON)

        this.mElemList["label_wndName"].text = Localize_cns("WONDER_TITLE")

        this.wndListDefine = {
            [PayActivityIndex.SHOP_MIRACULOUS]: { obj: Wonder_MysteryShopWnd.newObj(this.mLayoutNode, this, "shenmi", this.mLayoutPaths[1]), image: "jchd_Bt01" },      //神秘商店
            [PayActivityIndex.Recharge_have_prize]: { obj: Wonder_AccumulateWnd.newObj(this.mLayoutNode, this, "leichong", this.mLayoutPaths[2]), image: "jchd_Bt02", dot: "checkWonderAccumulate" }, //累充有礼
            [PayActivityIndex.SIX_LOOK_PRECIOUS]: { obj: Wonder_SixWorldWnd.newObj(this.mLayoutNode, this, "liujie", this.mLayoutPaths[5]), image: "jchd_Bt03", dot : "checkWonderLiuJie" },      //六界寻宝
            [PayActivityIndex.festival_BACK_MONEY]: { obj: Wonder_HolidayWnd.newObj(this.mLayoutNode, this, "jieri", this.mLayoutPaths[3]), image: "jchd_Bt04", dot: "checkWonderHoliday" },       //节日返利
            [PayActivityIndex.PET_WASH]: { obj: Wonder_PetClearWnd.newObj(this.mLayoutNode, this, "chongwu", this.mLayoutPaths[4]), image: "jchd_Bt05", dot: "checkWonderPetClear" },              //宠物洗练                       
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.updateWnd, this)
        this.mLayoutNode.visible = true;
        this.refreshActList()
        this.tabWndList.setWndVisible(true)
        this.tabWndList.changeTabWithIndex(this.tabIndex)

        RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.SHOP_MIRACULOUS)
        RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.Recharge_have_prize)
        RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.SIX_LOOK_PRECIOUS)
        RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.festival_BACK_MONEY)
        RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.PET_WASH)
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.updateWnd, this)
        this.mLayoutNode.visible = false;
        this.tabWndList.setWndVisible(false)
    }

    updateWnd(args?) {
        let wnd = this.tabWndList.getCurrentWnd()
        if (!wnd) return
        if (args && args.actIndex) {
            let index = args.actIndex
            if (index != wnd.activityIndex) return
        }
        if (wnd && wnd.onRefresh) {
            wnd.onRefresh()
        }

        if (this.isVisible()) {
            this.refreshActList()
        }
    }

    //初始化活动（按钮）列表
    refreshActList() {
        let list = GetActivity(ActivityDefine.Wonder).getOpenActivityList(this.wndListDefine)
        let scroll = this.scroll

        for (let k = 0; k < list.length; k++) {
            let v = list[k]

            let [window, flag] = scroll.getItemWindow(k, 100, 117, 3, 0, 0)

            if (flag == true) {
                this.initRadioItemWindow(window, v)
            }
            this.refreshRadioItemWindow(window, v)
        }
    }

    initRadioItemWindow(window, v) {
        let name = window.name
        let config = this.wndListDefine[v]

        let mElemInfo: any = [
            { ["index_type"]: eui.RadioButton, ["name"]: name + "_btn", ["image"]: config.image + "_up", ["image_down"]: config.image + "_down", ["font"]: "ht_20_cc_stroke", ["shortSelected"]: true, ["x"]: 0, ["y"]: 0, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null },
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_dotIcon", ["image"]: "zjm_hongDian01", ["x"]: 60, ["y"]: 0, ["w"]: 0, ["h"]: 0, ["messageFlag"]: true }
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)

        this.mElemList[name + "_dotIcon"].visible = false
    }

    refreshRadioItemWindow(window, v) {
        let name = window.name
        let config = this.wndListDefine[v]

        if (config.dot) {
            this.mElemList[name + "_dotIcon"].visible = GuideFuncSystem.getInstance()[config.dot].call()
        }

        this.tabWndList.insertTabWnd(name + "_btn", config.obj)
    }

    onClickPre(args) {
        this.scroll.moveRelativeItemWindow(0, true)
	}

    onClickNext(args) {
        this.scroll.moveRelativeItemWindow(4, true)
    }

    //////////////////////////////////////////////////////////////
    showWithIndex(index) {
        if (index == null) {
            index = 0
        }

        this.tabIndex = index
        this.showWnd()
    }
}