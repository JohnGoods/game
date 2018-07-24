// TypeScript file
class CopyMainFrame extends BaseWnd {
    tabWndList: UITabWndList;
    curTabIndex: number;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/copy/CopyMainLayout.exml"]
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
             { ["index_type"]: gui.Button, ["name"]: "btn_close_top", ["title"]: null,  ["color"]: gui.Color.white, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
             { ["index_type"]: gui.Button, ["name"]: "btn_back", ["title"]: null,  ["color"]: gui.Color.white,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

             { ["name"]: "cailiao_shop", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onCaiLiaoClick },
             
         ]
         UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this);

        let tabInfoList = [
			{ name: "cailiao_check",        wnd: CopyMaterialWindow.newObj(this.mLayoutNode, this), check: this.cailiaoCheck, obj: this },          //材料副本
			{ name: "dohailonggong",       wnd: CopyDragonWindow.newObj(this.mLayoutNode, this), check: this.longwangCheck, obj: this },        //龙王宝藏
            { name: "xiaoleiyinsi",         wnd: CopyTempleWindow.newObj(this.mLayoutNode, this), check: this.leiYinCheck, obj: this },          //野外BOSS
		    { name: "tiantingshilian",       wnd: CopyHeavenWindow.newObj(this.mLayoutNode, this), check: this.tianTingCheck, obj: this },        //生死劫
        ]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        //RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)

        this.mLayoutNode.visible = (true)
        //this.mLayoutNode.setDoModal(true)
        this.onRefresh()
		this.tabWndList.setWndVisible(true)
    }

    public onHide(): void {
        //UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
        this.mLayoutNode.visible = (false)
        //this.mLayoutNode.setDoModal(false)
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
        if (wnd && wnd.updateWnd) {
            wnd.updateWnd()
        }
    }

    updatePassRecord() {
        let wnd = this.tabWndList.getCurrentWnd()
        if (wnd && wnd.updatePassRecord) {
            wnd.updatePassRecord()
        }
    }
    
	//红点提示
	refreshDotTipsImp() {
		let wnd = this.tabWndList.getCurrentWnd()
        if (wnd && wnd.refreshDotTipsImp) {
            wnd.refreshDotTipsImp()
        }
	}
     //////////////////////////////////////////
	cailiaoCheck() {
		return true
	}

    longwangCheck() {
        return true
    }

    leiYinCheck() {
        return true
    }

    tianTingCheck() {
        return true
    }

    onCaiLiaoClick(){
        let wnd : ShopFunFrame = WngMrg.getInstance().getWindow("ShopFunFrame")
        wnd.onShowWnd(ShopSystem.SHOP_MATERIAL)
    }

    /////////////////////////////////////////////公共接口//////////////////////////////
    showBossFrame(copyIndex) {
        if (copyIndex != null) {
            this.curTabIndex = copyIndex
        }
        this.showWnd()
    }

    //////////////////////////////红点提示//////////////////////////////////////////////
	getDotTipsOffsetImp(parentWnd:eui.Component):{x:number, y:number}{
        let curName = parentWnd.name;
        let tabNameList = ["cailiao_check", "dohailonggong", "xiaoleiyinsi","tiantingshilian"]

        if(tabNameList.indexOf(curName) != -1){
            return {x:10, y:-15}
        }
        return null;
	}

}