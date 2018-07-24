// TypeScript file
class BossMainFrame extends BaseWnd {
    tabWndList: UITabWndList;
    curTabIndex: number;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/boss/BossMainLayout.exml"]
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
             { ["index_type"]: gui.Button, ["name"]: "btn_back", ["title"]: null,  ["color"]: gui.Color.white,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

             { ["name"]: "geren_shop", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGeRenClick },
			 { ["name"]: "quanmin_shop", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onQuanMinClick},
             { ["name"]: "jie_shop", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onJieClick},
         ]
         UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this);

        let tabInfoList = [
			{ name: "geren_check",      wnd: BossSingleWindow.newObj(this.mLayoutNode, this), check: this.geRenCheck, obj: this },          //个人BOSS
			{ name: "quanmin_check",    wnd: BossGlobalWindow.newObj(this.mLayoutNode, this), check: this.quanMinCheck, obj: this },        //全民BOSS
            { name: "yewaiBOSS",      wnd: BossWildWindow.newObj(this.mLayoutNode, this), check: this.yewaiCheck, obj: this },          //野外BOSS
		    { name: "shengsijie",        wnd: BossBefallWindow.newObj(this.mLayoutNode, this), check: this.shengsijieCheck, obj: this },        //生死劫
        ]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        //RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)

        this.mLayoutNode.visible = (true)
        this.onRefresh()
		this.tabWndList.setWndVisible(true)
    }

    public onHide(): void {
        //UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
        this.mLayoutNode.visible = (false)
		this.tabWndList.setWndVisible(false)
        this.curTabIndex = null
    }

    onRefresh() {
        if (this.curTabIndex != null) {
            this.tabWndList.changeTabWithIndex(this.curTabIndex)
        }
    }

    updateWnd() {
        let wnd = this.tabWndList.getCurrentWnd()
        if (wnd) {
            wnd.updateWnd()
        }
    }

    refreshDotTipsImp() {
        let wnd = this.tabWndList.getCurrentWnd()
        if (wnd && wnd.refreshDotTipsImp) {
            wnd.refreshDotTipsImp()
        }
    }
     //////////////////////////////////////////
	geRenCheck() {
		return true
	}

    quanMinCheck() {
        return true
    }

    yewaiCheck() {
        let [flag, str] = CheckMainFrameFunction("yewaiBOSS")
        if (flag == false) {
            MsgSystem.addTagTips(str)
        }
        return flag
    }

    shengsijieCheck() {
        let [flag, str] = CheckMainFrameFunction("shengsijie")
        if (flag == false) {
            MsgSystem.addTagTips(str)
        }
        return flag
    }

    onGeRenClick(){
       let wnd : ShopFunFrame = WngMrg.getInstance().getWindow("ShopFunFrame")
        wnd.onShowWnd(ShopSystem.SHOP_SINGLE)
    }

    onQuanMinClick(){
       let wnd : ShopFunFrame = WngMrg.getInstance().getWindow("ShopFunFrame")
        wnd.onShowWnd(ShopSystem.SHOP_GLOBAL)
    }

    onJieClick(){
        let wnd : ShopFunFrame = WngMrg.getInstance().getWindow("ShopFunFrame")
        wnd.onShowWnd(ShopSystem.SHOP_DELINE)
    }

    /////////////////////////////////////////////公共接口//////////////////////////////
    showBossFrame(bossIndex) {
        if (bossIndex != null) {
            this.curTabIndex = bossIndex
        }
        if (this.isVisible() == false) {
            this.showWnd()
        } else if(this.isLoadComplete()) {
            this.onRefresh()
        }
    }

    getCurBossIndex() {
        return this.curTabIndex
    }
}