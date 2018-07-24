// TypeScript file
//某些活动相关的特殊提示，例如野外BOSS复活
class ActivityRemindFrame extends BaseWnd {
    controlDataTable: any;
    timer:any
    listenerList: any[]

    public initObj(...params: any[]) {
        this.listenerList = []
        this.controlDataTable = {}
        this.mLayoutPaths = ["resource/layouts/activity/ActivityRemindLayout.exml"]

        SetTimer(this.tick, this, 1000, false)
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.bottom = 80
        this.mLayoutNode.x = 50
        this.initSkinElemList();

        this.mLayoutNode.setLayer(gui.GuiLayer.Top)

        let mElemInfo: any = [
            { ["name"]: "tips_rd",    ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickTips },
        ]
        UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["tips_rd"].setAlignFlag(gui.Flag.H_CENTER)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        //RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)

        this.mLayoutNode.visible = (true)
        this.refreshFrame()
    }

    public onHide(): void {
        //UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
        this.mLayoutNode.visible = (false)
    }

    refreshFrame() {
        if (this.controlDataTable["tips_rd"]) {
            let t = this.controlDataTable["tips_rd"]
            let txt = t.listener.onGetRemindTxt()
            AddRdContent(this.mElemList["tips_rd"], txt, "ht_18_cc", "white")
        }
    }

    tick(delay) {
        // if (this.isLoadComplete() == false) {
        //     return
        // }

        let t = null
        table_sort(this.listenerList, function(a, b) {return a.index - b.index})

        for (let i = 0; i < this.listenerList.length; i++) {
            let v = this.listenerList[i]
            if (v.listener.onCheckRemindShow() == true) {
                t = v
                break
            }
        }
        if (t != null) {
            this.controlDataTable["tips_rd"] = t

            if (this.mElemList && this.mElemList["tips_rd"]) {
                let txt = t.listener.onGetRemindTxt()
                AddRdContent(this.mElemList["tips_rd"], txt, "ht_18_cc", "white")
            }
            this.showWnd()
        } else {
            this.hideWnd()
        }
    }

    /////////////////////////////////////////////////////////////////
    onClickTips(args) {
        let name = "tips_rd"
        if (this.controlDataTable[name] == null) {
            return
        }

        let t = this.controlDataTable[name]
        t.listener.onCallback()

        this.removeListener(t.name)

        this.hideWnd()
    }
    //////////////////////////////////////////
    addListener(name: string, listener: IActivityRemindListener, index?: number) {
        let t = {name: name, listener: listener, index: checkNull(index, 0)}
        this.removeListener(name)

        table_insert(this.listenerList, t)
    }

    removeListener(name: string) {
        for (let i = 0; i < this.listenerList.length; i++) {
            let v = this.listenerList[i]
            if (v.name == name) {
                table_remove(this.listenerList, i)
                break
            }
        }
    }
}