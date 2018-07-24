class ShenHunQualityFrame extends BaseWnd {
    tabWndList: UITabWndList
    tabIndex: number
    scroll: UIScrollList

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/role/RoleFaBaoQualityLayout.exml"]
        this.tabIndex = -1
    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["tab_3"].visible = true

        let tabInfoList = [
            { name: "tab_0", wnd: ShenHunQualityWindow.newObj(this.mLayoutNode, this, [optionShenHun.shuchu]) },
            { name: "tab_1", wnd: ShenHunQualityWindow.newObj(this.mLayoutNode, this, [optionShenHun.kongzhi]) },
            { name: "tab_2", wnd: ShenHunQualityWindow.newObj(this.mLayoutNode, this, [optionShenHun.fuzhu]) },
            { name: "tab_3", wnd: ShenHunQualityWindow.newObj(this.mLayoutNode, this, [optionShenHun.fangyu]) },
        ]
        this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

        let nameLit = [
            Localize_cns("SHENHUN_TYPE_TXT2"),
            Localize_cns("SHENHUN_TYPE_TXT3"),
            Localize_cns("SHENHUN_TYPE_TXT4"),
            Localize_cns("SHENHUN_TYPE_TXT5"),
        ]
        let typeList = [
            optionShenHun.shuchu, optionShenHun.kongzhi, optionShenHun.fuzhu, optionShenHun.fangyu
        ]
        for (let k = 0; k <= 3; k++) {
            let tempname = "tab_" + k
            table_insert(tabInfoList, { name: tempname, wnd: ShenHunQualityWindow.newObj(this.mLayoutNode, this, [typeList[k]]) })
            this.mElemList[tempname].label = nameLit[k]
        }

        let group: eui.Group = this.mElemList["scroll"]
        group.visible = false
        let scroll: eui.Scroller = this.mElemList["scroller"]
        scroll.visible = true
        let list: eui.List = this.mElemList["item_list"]
        list.itemRenderer = itemRender.ShenHunQualityItem
    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true)
        this.tabWndList.setWndVisible(true);

        if (this.tabIndex != -1) {
            this.tabWndList.changeTabWithIndex(this.tabIndex)
        }
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        this.tabWndList.setWndVisible(false);
        //this.mLayoutNode.setDoModal(false)
    }

    showWithIndex(index) {
        this.tabIndex = index;
        this.showWnd();
    }

}