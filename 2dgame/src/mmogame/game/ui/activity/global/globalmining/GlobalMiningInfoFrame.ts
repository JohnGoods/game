// TypeScript file
class GlobalMiningInfoFrame extends BaseWnd {

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/activity/global/globalmining/GlobalMiningInfoLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        // this.setFullScreen(true)
        this.initSkinElemList();
        this.setAlignCenter(true, true);
        this.mLayoutNode.verticalCenter = -100;

        var elemInfo = [
            // { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            // { ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            // { ["name"]: "hp_pro0",  ["image"]: "kfzb_xueTiaoDi01", ["thumbImage"]: "kfzb_xueTiao01", ["title"]: null, ["font"]: "ht_18_cc_stroke", ["color"]: gui.Color.white, },
            // { ["name"]: "hp_pro1",  ["image"]: "kfzb_xueTiaoDi01", ["thumbImage"]: "kfzb_xueTiao01", ["title"]: null, ["font"]: "ht_18_cc_stroke", ["color"]: gui.Color.white, },
            // { ["name"]: "hp_pro2",  ["image"]: "kfzb_xueTiaoDi01", ["thumbImage"]: "kfzb_xueTiao01", ["title"]: null, ["font"]: "ht_18_cc_stroke", ["color"]: gui.Color.white, },
             
            // { ["name"]: "gain_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGain },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["title"].text = Localize_cns("GLOBAL_MINING_TXT27")
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
        this.mLayoutNode.visible = true;
        this.refreshFrame();
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
        this.mLayoutNode.visible = false;
    }

    refreshFrame() {
        
    }

    onMouseDown(args) {
        if (UI_IntersectWithStageXY(args.touchEvent.stageX, args.touchEvent.stageY, this.mLayoutNode) == true) {
            return
        }

        this.hideWnd()
    }
    /////////////////////////////////////////////////
    onClickGain(args) {        
        return this.hideWnd()
        //
    }

    ////////////////////////////////////////////////////////
    _showMiningInfo(param) {
        let title = param[0] || ""
        let content = param[1] || ""

        this.mElemList["title"].text = title
        AddRdContent(this.mElemList["dec_rd"], content, "ht_20_cc_stroke", "white", 5)
    }

    showMiningInfo(title, content) {
        this.showWnd()
        this.doCommand("_showMiningInfo", [title, content])
    }
}