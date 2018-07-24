// TypeScript file
class LimitedSaleWindow extends BaseCtrlWnd {
    controlDataTable: any;
    mLayoutPath: any;
    scroll: UIScrollList


    activityIndex

    timer
    endTime

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.activityIndex = PayActivityIndex.Fallen_Good_Gift_SHOP
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        let group = <eui.Group>this.mElemList["xianshi_scroll"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll_xianshi", 0, 0, group.width, group.height, group)

    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mElemList["group_xianshi"].visible = true
        this.mElemList["xianshi_scroll"].visible = true
        this.mElemList["image_bg"].source = "xyhl_zhanShiTu01"
        this.mElemList["title"].text = Localize_cns("LUCKY_PRIZE_TITLE_TXT2")
        this.onRefresh()


    }

    public onHide(): void {
        this.mElemList["group_xianshi"].visible = false
        this.mElemList["xianshi_scroll"].visible = false
    }

    onRefresh() {

        let list = GetActivity(ActivityDefine.LuckyPrize).getWorthyFeedbackList(this.activityIndex)
        if (list == null) return
        let scroll = this.scroll
        scroll.clearItemList()
        this.controlDataTable = {}
        for (let k = 0; k < list.length; k++) {
            let v = list[k]
            this.controlDataTable[k] = v
            let [window, flag] = scroll.getItemWindow(k, 564, 150, 0, 0, 3)
            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v)
        }

        if (this.timer == null) {
            this.timer = SetTimer(this.onTick, this, 1000, true)
        }
    }

    initItemWindow(window) {
        let name = window.name

        let mElemInfo: any = [
            { ["index_type"]: eui.Group, ["name"]: name + "_group", ["image"]: "", ["font"]: "ht_24_cc_stroke", ["x"]: 0, ["y"]: 0, ["w"]: 564, ["h"]: 150, },
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["parent"]: name + "_group", ["image"]: "ty_uiDi03", ["font"]: "ht_24_cc_stroke", ["x"]: 0, ["y"]: 0, ["w"]: 564, ["h"]: 150, },
            { ["index_type"]: eui.Image, ["name"]: name + "_bg_title", ["parent"]: name + "_group", ["image"]: "xyhl_biaoTiDi01", ["font"]: "ht_24_cc_stroke", ["x"]: 10, ["y"]: 5, ["w"]: 336, ["h"]: 32, },
            { ["index_type"]: eui.Label, ["name"]: name + "_title", ["parent"]: name + "_bg_title", ["image"]: "", ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 336, ["h"]: 32, },
            //{ ["index_type"]: eui.Group, ["name"]: name + "_group_item", ["parent"]: name + "_group", ["image"]: "", ["font"]: "ht_24_cc_stroke", ["x"]: 20, ["y"]: 52, ["w"]: 320, ["h"]: 80, },
            { ["index_type"]: eui.Label, ["name"]: name + "_buy", ["parent"]: name + "_group", ["color"]: gui.Color.darkgreen, ["image"]: "", ["font"]: "ht_20_cc", ["x"]: 401, ["y"]: 31, ["w"]: 160, ["h"]: 24, },
            { ["index_type"]: gui.Button, ["name"]: name + "_charge", ["parent"]: name + "_group", ["title"]: Localize_cns("ACCESS_TXT12"), ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["font"]: "ht_24_cc_stroke", ["x"]: 418, ["y"]: 65, ["w"]: 117, ["h"]: 51, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onBuyClick },

        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)

        this.mElemList[name + "_itemBox"] = UIItemBox.newObj(this.mLayoutNode, name + "_itemBox", 20, 52, window)
    }

    refreshItemWindow(window, v) {
        let name = window.name

        this.mElemList[name + "_title"].text = String.format(Localize_cns("LUCKY_PRIZE_TXT5"), v.newPrice)

        let prize = AnalyPrizeFormat(v.item)
        this.mElemList[name + "_itemBox"].updateByEntry(prize[0][0], prize[0][1])
        let playerInfo = getSaveRecord(opSaveRecordKey.FallenGoodGiftShop) || {}
        let hadPoint = playerInfo[v.index] || 0
        if (hadPoint < v.limitCount) {
            this.mElemList[name + "_charge"].enabled = true
            this.mElemList[name + "_buy"].visible = true
            this.mElemList[name + "_buy"].text = String.format(Localize_cns("SHOP_TXT2"), hadPoint, v.limitCount)
        } else {
            this.mElemList[name + "_charge"].enabled = false
            this.mElemList[name + "_buy"].visible = false
        }

    }


    ///----------
    onBuyClick(args) {
        let name = args.target.name
        let index = name.replace(/[^0-9]/ig, "");
        let config = this.controlDataTable[index]
        if (!config) return

        // let btn_name = this.mElemList[name].text 
        //  if (btn_name == Localize_cns("PAY_TXT1")) {
        let wnd: LimitedSaleTipsFrame = WngMrg.getInstance().getWindow("LimitedSaleTipsFrame")
        wnd.onShowWnd(config)
        // } else if (btn_name == Localize_cns("OPENSERVER_TXT8")) {

        // }
    }


    ////-----------定时器
    onTick() {
        let osTime = GetServerTime()
        if (this.endTime == null) {
            let actInfo = ActivitySystem.getInstance().getOperateActivityInfo(this.activityIndex)
            if(actInfo == null) {
                if(this.timer != null){
                    KillTimer(this.timer)
                    this.timer = null
                    return
                }
            }
            this.endTime = actInfo[0]
        }
        let diffTime = this.endTime - osTime
        let dateTime = simple_transform_time1(diffTime)
        let str = ""
        if (diffTime < 86400) {
            str = String.format(Localize_cns("LUCKY_PRIZE_SEC"), dateTime.hours, dateTime.mins, dateTime.secs)
        } else {
            str = String.format(Localize_cns("LUCKY_PRIZE_DAY"), dateTime.day, dateTime.hours, dateTime.mins)
        }

        this.mElemList["xianshi_time"].text = str
    }
}