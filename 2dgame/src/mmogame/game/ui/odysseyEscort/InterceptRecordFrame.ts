// TypeScript file
class InterceptRecordFrame extends BaseWnd {
    scroll: UIScrollList;
    config

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/xiyouhusong/InterceptRecordLayout.exml"]

    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.width = 505
        this.mLayoutNode.height = 664
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        let group: eui.Group = this.mElemList["group_scroll"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_VERTICAL)

    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.mLayoutNode.setDoModal(true);
        this.onRefresh();
        RpcProxy.call("C2G_RobberEscortRecordList")
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        this.mLayoutNode.setDoModal(false);
    }

    updateWnd() {
        this.onRefresh()
    }

    onRefresh() {

        let interceptlist = GetActivity(ActivityDefine.HuSong).getRobberRecordList()
        if (size_t(interceptlist) == 0) {
            return
        }
        let scroll = this.scroll

        scroll.clearItemList()

        for (let k = 0; k < size_t(interceptlist); k++) {
            let v = interceptlist[k]
            let [window, flag] = scroll.getItemWindow(k, 380, 60, 0, 0)
            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v)
        }

        scroll.refreshScroll(true, true)

    }
    initItemWindow(window) {
        let name = window.name
        let mElemInfo: any = [
            { ["index_type"]: eui.Label, ["name"]: name + "_time", ["title"]: "", ["image"]: "", ["font"]: "ht_16_lc", ["x"]: 0, ["y"]: 0, ["w"]: 308, ["h"]: 16 },
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_des", ["title"]: "", ["image"]: "", ["font"]: "ht_16_lc", ["x"]: 0, ["y"]: 25, ["w"]: 308, ["h"]: 16 },
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_state", ["title"]: "", ["image"]: "", ["font"]: "ht_16_lc", ["x"]: 320, ["y"]: 20, ["w"]: 60, ["h"]: 16 },
            { ["index_type"]: eui.Rect, ["name"]: name + "_rect", ["parent"]: name + "_state", ["color"]: gui.Color.green, ["alpha"]: 0.5, ["x"]: 0, ["y"]: 16, ["w"]: 100, ["h"]: 2 },
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_line", ["title"]: "", ["autoScale"]: true, ["image"]: "cz_uiLine01", ["font"]: "", ["x"]: 0, ["y"]: 40, ["w"]: 380, ["h"]: 16 },
        ];
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window);

        this.mElemList[name + "_des"].setAlignFlag(gui.Flag.LEFT_CENTER)
        this.mElemList[name + "_state"].setAlignFlag(gui.Flag.LEFT_BOTTOM)

    }

    refreshItemWindow(window, config) {
        //config   --- id, name, time, windFlag, index , revegeFlag
        let name = window.name
        let index = config.index || 1
        let date = GetOSDate(config.time)
        this.mElemList[name + "_state"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStateClick, this)
        this.mElemList[name + "_time"].text = String.format("%d-%d-%d  %d:%d:%d", date.year, date.month, date.day, date.hour, date.min, date.sec)

        let desColorList = ["#white", "#green", "#blue", "#purple", "#orange"]
        let cheColor = desColorList[index - 1]
        let desStr = "#green" + config.name + Localize_cns("ESCORT_RECORD_TXT4") + cheColor + GameConfig.EscortConfig[index].tip

        let stateStr = Localize_cns("ESCORT_RECORD_TXT6")
        let stateColor = "#green"

        let fillColor = gui.Color.green
        this.mElemList[name + "_rect"].visible = true

        let windFlag = config.winFlag

        if (windFlag == 0) {
            stateStr = Localize_cns("ESCORT_RECORD_TXT3")//失败
            stateColor = "#red"
            fillColor = gui.Color.red
        }

        if (config.id == GetHeroProperty("id")) { //如果是我拦截
            desStr = String.format(Localize_cns("ESCORT_RECORD_TXT5"), "#green" + config.name) + cheColor + GameConfig.EscortConfig[index].tip
            this.mElemList[name + "_rect"].visible = false
        } else {
            if(windFlag == 1){
                let state = config.revengeFlag
                if (state == 0) {
                    stateStr = Localize_cns("ESCORT_RECORD_TXT1")//"复仇" --
                    this.mElemList[name + "_state"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStateClick, this)
                } else {
                    this.mElemList[name + "_rect"].visible = false
                    stateStr = Localize_cns("ESCORT_RECORD_TXT2")//"已复仇"
                    stateColor = "#red"
                    fillColor = gui.Color.red
                }
            }
            
        }


        AddRdContent(this.mElemList[name + "_des"], desStr, "ht_16_lc", "ublack")
        AddRdContent(this.mElemList[name + "_state"], stateColor + stateStr, "ht_16_lc", "ublack")

        this.mElemList[name + "_rect"].fillColor = fillColor
        let rectlength = this.mElemList[name + "_state"].getLogicWidth()
        this.mElemList[name + "_rect"].width = rectlength


    }

    ////响应事件

    onStateClick(args: egret.Event) {
        let name = args.currentTarget.name
        let index = name.replace(/[^0-9]/ig, "");
        if (this.mElemList["group" + index + "_rect"].visible == false) return

        let list = GetActivity(ActivityDefine.HuSong).getRobberRecordList()

        let config = list[index]

        if (config.revengeFlag >= 1) {
            MsgSystem.addTagTips(Localize_cns("ESCORT_RECORD_TXT2"))
            return
        }

        let wnd = WngMrg.getInstance().getWindow("RevengeTipsFrame")
        wnd.onShowWnd(config)
    }

}