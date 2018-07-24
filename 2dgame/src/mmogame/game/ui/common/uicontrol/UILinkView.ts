// TypeScript file
class UILinkView extends TClass {
    mParentNode: eui.Component;
    mParentWnd: eui.Group;
    name: string;
    content: string;

    mElemList: any;
    rootWnd
    callback: Function;
    obj: eui.UIComponent;
    userData: any;

    isEnable: boolean;

    tipInfo
    defaultFont: string

    openFrame: boolean
    entry

    public initObj(...args: any[]): void {
        this.mParentNode = args[0]
        this.name = args[1]
        let x = args[2]
        let y = args[3]

        let w = 200
        let h = 20

        let parentWnd = args[4]
        this.mParentWnd = parentWnd

        this.content = args[5] || ""
        this.defaultFont = "ht_22_cc"

        this.mElemList = {}

        let mElemInfo = [
            { ["index_type"]: eui.Group, ["name"]: this.name, ["x"]: x, ["y"]: y, ["w"]: w, ["h"]: h, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.openGainLink },
            { ["index_type"]: gui.RichDisplayer, ["name"]: this.name + "_rd", ["parent"]: this.name, ["x"]: 0, ["y"]: 3, ["w"]: w, ["h"]: h, ["messageFlag"]: true },
            //{ ["index_type"]: eui.Scroller, ["name"]: this.name + "_scroll", ["parent"]: this.name, ["viewport"]: this.name + "_rd", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["messageFlag"]: true },
            { ["index_type"]: eui.Rect, ["name"]: this.name + "_line", ["parent"]: this.name, ["color"]: gui.Color.green, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: 2, ["messageFlag"]: true },
        ]
        UiUtil.createElem(mElemInfo, this.mParentNode, this.mElemList, this, parentWnd)
        this.rootWnd = this.mElemList[this.name]
        this.isEnable = true
        this.mElemList[this.name + "_rd"].setAlignFlag(gui.Flag.H_CENTER)

        this.openFrame = false
        // this.tipInfo = {}
    }

    updateContent() {
        //this.mElemList[this.name + "_rd"].clear()
        //UiUtil.setWH(this.mElemList[this.name + "_scroll"], 300, 26 - 3)
        UiUtil.setWH(this.mElemList[this.name + "_rd"], 200, 20)

        let rd = <gui.RichDisplayer>this.mElemList[this.name + "_rd"]
        AddRdContent(rd, this.content, this.defaultFont, "green")
        rd.showFirstRow()

        let w = rd.getLogicWidth() + 6 //this.content.length * 23
        let h = 26

        UiUtil.setWH(this.mElemList[this.name], w, h)
        //UiUtil.setWH(this.mElemList[this.name + "_scroll"], w, h - 3)
        UiUtil.setWH(this.mElemList[this.name + "_rd"], w, h - 5)
        UiUtil.setWH(this.mElemList[this.name + "_line"], w, 2)
        UiUtil.setXY(this.mElemList[this.name + "_line"], 0, h)

        let pw = this.mParentWnd.width
        let ph = this.mParentWnd.height

        UiUtil.setXY(this.mElemList[this.name], (pw - w) / 2, this.mElemList[this.name].y)
    }

    setLeft() {
        UiUtil.setXY(this.mElemList[this.name], 0, this.mElemList[this.name].y)
    }

    setContent(content?) {
        this.content = content || ""
        this.updateContent()
    }

    updateByTips(tipInfo) {
        this.tipInfo = tipInfo
        this.setContent(tipInfo.showTips)
        let isHide = size_t(tipInfo.approach) == 0 ? false : true
        this.setLine(isHide)
    }

    //处理可能有两个获取途径
    updateByEntry(entry) {
        this.openFrame = false
        this.entry = null
        let tipInfos = GameConfig.FunTipsConfig[entry]
        if (size_t(tipInfos) == 1) {
            this.updateByTips(tipInfos[1])
        } else if (size_t(tipInfos) == 2) {
            this.openFrame = true
            this.entry = entry
            let tips = Localize_cns("ACCESS_TXT2")
            this.setContent(tips)
            this.setLine(true)
        }
    }

    setLine(isHide: boolean, color?) {
        this.mElemList[this.name + "_line"].visible = isHide
        if (color != null) {
            this.mElemList[this.name + "_line"].fillColor = color
        }
    }

    setCallBack(func, obj, data?) {
        this.callback = func
        this.obj = obj
        this.userData = data
    }

    setEnable(isEnable: boolean) {
        this.isEnable = isEnable
    }

    setVisible(isVisible: boolean) {
        this.mElemList[this.name].visible = isVisible
    }

    isVisible() {
        return this.mElemList[this.name].visible
    }

    setDefaultFont(fontStr) {
        this.defaultFont = fontStr
    }

    openGainLink() {
        if (!this.isEnable) {
            return
        }

        if (this.callback && this.obj) {
            this.callback.call(this.obj, this.userData)
            return
        }

        if (this.openFrame && this.entry != null) {
            let wnd: GoodsAsseceFrame = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
            wnd.onShowWnd(this.entry)
            return
        }

        if (this.tipInfo) {
            this.clickAccess(this.tipInfo)
        }
    }


    ///////------------响应事件
    clickAccess(userData) {
        let approach = userData.approach
        if (approach && size_t(approach) != 0) {
            let check = FastJumpSystem.getInstance().checkQuickAccess(approach[0], approach[1] || 0)
            if (check[0] == false) {
                if (check[1] === "") return
                MsgSystem.addTagTips(check[1])
            } else {
                FastJumpSystem.getInstance().doQuickAccess(approach[0], approach[1] || 0)
            }
        }
    }
}