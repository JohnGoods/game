// TypeScript file

class UpdateNoticeFrame extends BaseWnd {
    updateList: any;
    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/UpdateNoticeLayout.exml"]
        this.updateList = {}
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.refreshUpdateContent()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
    }

    refreshUpdateContent() {
        //this.showWnd()
        let rd: gui.RichDisplayer = this.mElemList["content"]
        //rd.SetHandleMessageFlag(gui.Window.TraceAll)
        let fontInfo: any = {}
        fontInfo.default_color = "ublack"
        fontInfo.defalut_font = "ht_24_cc"
        //fontInfo.no_change_font =true
        rd.setRowDistance(6)

        rd.clear()

        if (size_t(this.updateList[0]) < 2) {
            //this.hideWnd()
            return
        }


        let content = this.updateList[0][1] || ""

        let contentList = splitString(content, "\n")
        for (let _ = 0; _ < contentList.length; _++) {
            let str = contentList[_]
            rd.addXmlString(XmlConverter.parseText(str, fontInfo))
        }


    }


    setUpdateList(content) {
        this.updateList = content//[["title","content"]]
    }

}