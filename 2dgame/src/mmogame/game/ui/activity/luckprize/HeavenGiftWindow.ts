// TypeScript file
class HeavenGiftWindow extends BaseCtrlWnd {
    controlDataTable: any;
    mLayoutPath: any;
    scroll: UIScrollList

    timer
    activityIndex
    endTime

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.activityIndex = PayActivityIndex.Fallen_Good_Gift_Recharge
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        let group = <eui.Group>this.mElemList["gift_scroll"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll_gift", 0, 0, group.width, group.height, group)

        AddRdContent(this.mElemList["rd_des"], Localize_cns("LUCKY_PRIZE_TXT1"), "ht_20_lc", "ublack")
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        //RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.checkHeroUpdatte, this)
        this.mElemList["group_gift"].visible = true
        this.mElemList["title"].text = Localize_cns("LUCKY_PRIZE_TITLE_TXT1")
        this.onRefresh()
        // RpcProxy.call("C2G_SendOperateAndPlayerData", this.activityIndex)


    }

    public onHide(): void {
        //UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.checkHeroUpdatte, this)
        this.mElemList["group_gift"].visible = false

        if (this.timer != null) {
            KillTimer(this.timer)
            this.timer = null
        }
    }
    onRefresh() {
        let scroll = this.scroll
        let list = GetActivity(ActivityDefine.LuckyPrize).getLuckyPrizeList(this.activityIndex)
        if (list == null) return
        let showList = splitListByCount(list, 3)
        scroll.clearItemList()
        this.controlDataTable = {}
        for (let k = 0; k < showList.length; k++) {
            let v = showList[k]
            let [window, flag] = scroll.getItemWindow(k, 100, 244, 0, 0, 3)
            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v, k)
        }

        scroll.refreshScroll(true, true)
        scroll.restoreViewXY()


        if (this.timer == null) {
            this.timer = SetTimer(this.onTick, this, 1000, true)
        }
    }

    initItemWindow(window) {
        let name = window.name

        for (let k = 0; k < 3; k++) {
            let x = 190 * k
            let mElemInfo: any = [
                { ["index_type"]: eui.Group, ["name"]: name + "_group_" + k, ["image"]: "", ["font"]: "ht_24_cc_stroke", ["x"]: x, ["y"]: 0, ["w"]: 180, ["h"]: 244, },
                { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg_" + k, ["parent"]: name + "_group_" + k, ["image"]: "ty_uiDi03", ["font"]: "ht_24_cc_stroke", ["x"]: 0, ["y"]: 0, ["w"]: 180, ["h"]: 244, },
                { ["index_type"]: eui.Image, ["name"]: name + "_bg_name_" + k, ["parent"]: name + "_group_" + k, ["image"]: "xyhl_biaoTiDi01", ["font"]: "ht_24_cc_stroke", ["x"]: 11, ["y"]: 5, ["w"]: 158, ["h"]: 32, },
                { ["index_type"]: eui.Label, ["name"]: name + "_itemName_" + k, ["parent"]: name + "_group_" + k, ["image"]: "", ["font"]: "ht_24_cc_stroke", ["x"]: 0, ["y"]: 9, ["w"]: 180, ["h"]: 24, },
                //元宝
                { ["index_type"]: eui.Group, ["name"]: name + "_group_yuanbao_" + k, ["parent"]: name + "_group_" + k, ["image"]: "", ["font"]: "ht_24_cc_stroke", ["x"]: 0, ["y"]: 47, ["w"]: 180, ["h"]: 80, },
                { ["index_type"]: eui.Image, ["name"]: name + "_bg_recv_" + k, ["parent"]: name + "_group_yuanbao_" + k, ["image"]: "xyhl_fanLiDi01", ["font"]: "ht_24_cc_stroke", ["x"]: 94, ["y"]: 4, ["w"]: 69, ["h"]: 72, },
                //宝箱
                { ["index_type"]: eui.Group, ["name"]: name + "_group_baoxiang_" + k, ["parent"]: name + "_group_" + k, ["image"]: "", ["font"]: "ht_24_cc_stroke", ["x"]: 50, ["y"]: 47, ["w"]: 80, ["h"]: 80, },
                //{ ["index_type"]: eui.Image, ["name"]: name + "_bg_baoxiang_" + k, ["parent"]: name + "_group_baoxiang_" + k, ["image"]: "ty_zhuangBeiBg05", ["font"]: "ht_24_cc_stroke", ["x"]: 0, ["y"]: 0, ["w"]: 80, ["h"]: 80, },
                //{ ["index_type"]: eui.Image, ["name"]: name + "_baoxiang_" + k, ["parent"]: name + "_group_baoxiang_" + k, ["image"]: "fb_baoXiang01", ["font"]: "ht_24_cc_stroke", ["x"]: 2, ["y"]: 12, ["w"]: 76, ["h"]: 56, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onBaoXiangClick },

                { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_label_recv_" + k, ["parent"]: name + "_bg_recv_" + k, ["image"]: "", ["font"]: "ht_24_cc_stroke", ["x"]: 0, ["y"]: 13, ["w"]: 60, ["h"]: 50, },
                { ["index_type"]: eui.Label, ["name"]: name + "_pay_" + k, ["parent"]: name + "_group_" + k, ["color"]: gui.Color.red, ["image"]: "", ["font"]: "ht_20_cc", ["x"]: 0, ["y"]: 131, ["w"]: 180, ["h"]: 24, },
                { ["index_type"]: gui.Button, ["name"]: name + "_charge_" + k, ["parent"]: name + "_group_" + k, ["title"]: Localize_cns("PAY_TXT1"), ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["font"]: "ht_24_cc_stroke", ["x"]: 32, ["y"]: 159, ["w"]: 117, ["h"]: 51, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onChargeClick },
                { ["index_type"]: eui.Label, ["name"]: name + "_limit_" + k, ["parent"]: name + "_group_" + k, ["image"]: "", ["font"]: "ht_20_cc", ["color"]: gui.Color.darkgreen, ["x"]: 0, ["y"]: 213, ["w"]: 180, ["h"]: 24 },
            ]
            UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)

            this.mElemList[name + "_itemBox_" + k] = UIItemBox.newObj(this.mLayoutNode, name + "_itemBox_" + k, 14, 0, this.mElemList[name + "_group_yuanbao_" + k])
            //this.mElemList[name + "_baoxiang_" + k].visible = false
            this.mElemList[name + "_baoxiangBox_" + k] = UIItemBox.newObj(this.mLayoutNode, name + "_baoxiangBox_" + k, 0, 0, this.mElemList[name + "_group_baoxiang_" + k])
        }
    }

    refreshItemWindow(window, config, index) {
        let name = window.name
        let singleMax = getSaveRecord(opSaveRecordKey.FallenGoodGiftRecharge) || {}
        for (let k = 0; k < 3; k++) {
            let v = config[k]
            if (v) {
                let dataKey = "" + index + k
                this.controlDataTable[dataKey] = v
                this.mElemList[name + "_group_" + k].visible = true

                let money = GetRmbFromGold(v.point)
                //pay
                this.mElemList[name + "_pay_" + k].text = String.format(Localize_cns("LUCKY_PRIZE_TXT4"), money)

                let hadCharge = singleMax[v.point]
                let truelyCharge = 0
                if (hadCharge == null) {
                    this.mElemList[name + "_charge_" + k].text = Localize_cns("PAY_TXT1")
                    this.mElemList[name + "_charge_" + k].source = "ty_tongYongBt3"
                } else if (hadCharge == 0) {
                    this.mElemList[name + "_charge_" + k].text = Localize_cns("OPENSERVER_TXT8")
                    this.mElemList[name + "_charge_" + k].source = "ty_tongYongBt16"
                    truelyCharge = 1
                }

                this.mElemList[name + "_limit_" + k].text = String.format(Localize_cns("LUCKY_PRIZE_TXT3"), truelyCharge, 1)
                //itemBox
                let fillColor = gui.Color.white
                let text = Localize_cns("LUCKY_PRIZE_BAOXIANG")
                if (v.item == 0) {
                    this.mElemList[name + "_group_yuanbao_" + k].visible = true
                    this.mElemList[name + "_group_baoxiang_" + k].visible = false
                    let prize = AnalyPrizeFormat(v.prize)
                    this.mElemList[name + "_itemBox_" + k].updateByEntry(prize[0][0], prize[0][1])
                    AddRdContent(this.mElemList[name + "_label_recv_" + k], v.rebate + "%#br" + Localize_cns("LUCKY_PRIZE_TXT2"), "ht_20_lc_stroke", "white")
                    fillColor = GetQualityColorGui(5)
                    let itemInfo = GameConfig.itemConfig[prize[0][0]]

                    text = itemInfo.name
                } else {
                    this.mElemList[name + "_group_yuanbao_" + k].visible = false
                    this.mElemList[name + "_group_baoxiang_" + k].visible = true
                    this.mElemList[name + "_baoxiangBox_" + k].updateByEntry(v.item) 
                    this.mElemList[name + "_baoxiangBox_" + k].setItemTipsListner(this.onBaoXiangClick, this, v)
                    let itemInfo = GameConfig.itemConfig[v.item]

                    text = itemInfo.name
                }

                this.mElemList[name + "_itemName_" + k].textColor = fillColor
                this.mElemList[name + "_itemName_" + k].text = text
            } else {
                this.mElemList[name + "_group_" + k].visible = false
            }
        }
    }


    //////--------------------------////////响应事件
    onChargeClick(args) {
        let name = args.target.name
        let btn_name = this.mElemList[name].text
        if (btn_name == Localize_cns("PAY_TXT1")) {
            let wnd: PayFrame = WngMrg.getInstance().getWindow("PayFrame")
            wnd.showWnd()
        } else if (btn_name == Localize_cns("OPENSERVER_TXT8")) {
            let index = name.replace(/[^0-9]/ig, "");
            let config = this.controlDataTable[index]
            if (!config) return

            RpcProxy.call("C2G_GetOperateActivityPrize", this.activityIndex, [config.point])
        }
    }

    onBaoXiangClick(logicItem, userData) {   
        let heavenInfo = userData
        if (heavenInfo == null) return

        let wnd: HeavenGiftTipsFrame = WngMrg.getInstance().getWindow("HeavenGiftTipsFrame")
        wnd.onShowWnd(heavenInfo)

        return true
    }
    ////-----------定时器
    onTick() {
        let osTime = GetServerTime()
        if (this.endTime == null) {
            let actInfo = ActivitySystem.getInstance().getOperateActivityInfo(this.activityIndex)
            if (actInfo == null) {
                if (this.timer != null) {
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

        this.mElemList["label_time"].text = str
    }
}