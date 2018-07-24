class NoticeDetailFrame extends BaseWnd {
    url: string;
    title: string;
    content: string;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/NoticeDetailLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.setDoModal(true)
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
        RegisterEvent(EventDefine.GAME_DISCONNECT, this.onGameDisconnect, this)
        this.mLayoutNode.visible = true;

        //如果url是空值，或者不支持webview，则刷新richdisplay
        if (this.url == "" || SdkHelper.getInstance().showWebView(this.url, true) == false) {
            this.refreshUpdateContent()
        } else {
            let rd = <gui.RichDisplayer>this.mElemList["content"]
            let w = rd.width
            let h = rd.height
            //SdkHelper.getInstance().setWebViewRect(this.mElemList["content"], 0, 0, w, h)

            this.mElemList["title"].text = (this.title)
        }
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.GAME_DISCONNECT, this.onGameDisconnect, this)
        this.mLayoutNode.visible = false;
        this.url = ""
        //SdkHelper.getInstance().hideWebView()
    }

    refreshUpdateContent() {
        this.mElemList["title"].text = (this.title)
        let rd = <gui.RichDisplayer>this.mElemList["content"]
        rd.clear()
        let contentList = splitString(this.content, "\n")
        for (let _ = 0; _ < contentList.length; _++) {
            let str = contentList[_]
            AddRdContent(rd, str, "ht_24_cc", "oldlace", 3, null, null, true)
        }
    }

    /////////////////////////////////////////////////////////////////////////
    showWithTitle(title, content, url) {
        this.title = title || ""
        this.content = content || ""
        this.url = url || ""
        this.showWnd()
    }

    //防止断开连接后，关闭不了连接
    onGameDisconnect(args) {
        this.hideWnd()
    }
}