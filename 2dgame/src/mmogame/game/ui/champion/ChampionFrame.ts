class ChampionFrame extends BaseWnd {
    tabWndList: UITabWndList
    tabIndex: number

    checkList

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/champion/ChampionLayout.exml"]

        this.tabIndex = -1;
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let tabInfoList = [
            { name: "arena", wnd: ChampionArenaWindow.newObj(this.mLayoutNode, this), check: this.checkOpenAreana, obj: this },
            { name: "peerless", wnd: ChampionPeerlessWindow.newObj(this.mLayoutNode, this), check: this.checkOpenPeerless, obj: this },
        ]
        this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

        this.checkList = {
            ["arena"]: this.checkOpenAreana,
            ["peerless"]: this.checkOpenPeerless,
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.tabWndList.setWndVisible(true);

        if (this.tabIndex != -1) {
            this.tabWndList.changeTabWithIndex(this.tabIndex)
        }

    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        this.tabWndList.setWndVisible(false);
        this.tabIndex = -1
    }

    
    //更新
    updateWnd() {
        let index = this.tabWndList.getTabIndex()
        if (index == 1) {
            let wnd = this.tabWndList.getCurrentWnd()
            wnd.updateWnd(null)
        }
    }

    /* ///检查开启
     checkOpen() {
         for (let k in this.checkList) {
             let func: Function = this.checkList[k]
             let check = func.call(this)
             this.mElemList[k].visible = check
         }
     }
 */
    checkOpenAreana() {
        return true
    }

    checkOpenPeerless() {
        let level = GetHeroProperty("level")
        let check = level >= 120
        if (!check) {
            MsgSystem.addTagTips(String.format(Localize_cns("GUIDE_TXT3"), 120))
        }
        return check
    }


    //以0开头，0是第一个标签
    showWithIndex(index?) {
        if (index == null) {
            index = 0
        }
        this.tabIndex = index;
        this.showWnd();
    }
}