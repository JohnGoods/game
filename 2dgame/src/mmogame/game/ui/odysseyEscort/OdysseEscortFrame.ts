// TypeScript file
class OdysseyEscortFrame extends BaseWnd {
    // scroll:UIScrollList;
    select
    isDouble

    actorList: any

    //static BIAOCHE_LING = 60071
    //static ONEKEY_COST_COUNT = 450
    //static COST_COUNT = 50
    static CHENGSE_INDEX = 5

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/xiyouhusong/OdysseyEscortLayout.exml"]
        this.select = -1
        this.isDouble = false
        this.actorList = {}
    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_refresh", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRefreshClick },
            { ["name"]: "btn_oneKeyRf", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onOneKeyClick },
            { ["name"]: "btn_goto", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGotoClick },

        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        /*let group: eui.Group = this.mElemList["group_scroll"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_VERTICAL)*/

        this.mElemList["rd_tips"].setAlignFlag(gui.Flag.LEFT_TOP)
        this.mElemList["rd_rf_cost"].setAlignFlag(gui.Flag.CENTER_CENTER)
        this.mElemList["rd_oneKey_cost"].setAlignFlag(gui.Flag.CENTER_CENTER)
    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ITEM_UPDATE, this.updateWnd, this)
        this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true);
        this.onRefresh();

    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.updateWnd, this)
        this.mLayoutNode.visible = false;
        //this.mLayoutNode.setDoModal(false);
        this.isDouble = false
        for (let k in this.actorList) {
            let actor: UIActorView = this.actorList[k]
            actor.clearView()
        }
    }

    updateWnd() {
        this.onRefresh()
    }

    updateCostWnd() {
        let unit = opItemUnit.BIND_CURRENCY
        let moneystr = GetMoneyIcon(unit)
        let oneKeyStr = ""
        let costId = opEscort.orangeCard
        let onecost = opEscort.specialRand
        let oneCostCount = ItemSystem.getInstance().getItemCount(costId)
        if (oneCostCount == 0) {
            oneKeyStr = GetMoneyIcon(unit) + onecost
        } else {
            oneKeyStr = "#BIAOCHE_LING" + oneCostCount + "/" + 1
        }

        let cost = opEscort.normalRand
        AddRdContent(this.mElemList["rd_oneKey_cost"], Localize_cns("PET_TXT4") + oneKeyStr, "ht_20_cc", "saddlebrown")
        AddRdContent(this.mElemList["rd_rf_cost"], Localize_cns("PET_TXT4") + moneystr + cost, "ht_20_cc", "saddlebrown")
    }

    onRefresh() {

        let actInfo = GetActivity(ActivityDefine.HuSong).getActInfo()
        if (size_t(actInfo) == 0) return
        this.select = actInfo.index

        let isDouble = actInfo.isDouble || 1
        if (isDouble == 2) {
            this.mElemList["image_double"].visible = true
            this.isDouble = true
        } else {
            this.mElemList["image_double"].visible = false
            this.isDouble = false
        }

        let escortlist = GameConfig.EscortConfig

        for (let k = 1; k <= size_t(escortlist); k++) {
            let v = escortlist[k]
            //let [window, flag] = scroll.getItemWindow(k, 550, 120 , 0, 0)
            let window = this.mElemList["group_scroll"]
            this.initItemWindow(window, k)
            this.refreshItemWindow(k, v)
        }

        //PET_TXT4 rd_tips rd_oneKey_cost rd_rf_cost
        AddRdContent(this.mElemList["rd_tips"], Localize_cns("ESCORT_DES_TXT1"), "ht_20_cc", "saddlebrown")

        this.updateCostWnd()

        //rd_twice
        let twice = actInfo.husongTwice || 0
        AddRdContent(this.mElemList["rd_twice"], Localize_cns("ESCORT_TXT1") + "#rf#green" + twice + "/" + 3, "ht_20_cc", "saddlebrown")
    }
    initItemWindow(window, index) {
        let name = "group" + index
        let width = 550
        let height = 120
        let y = 125 * (index - 1)
        if (this.mElemList[name + "_bg"] != null) return
        let mElemInfo: any = [
            //{ ["index_type"]: eui.Group, ["name"] : name ,  ["image"]: "ty_uiDi03", ["autoScale"] :true, ["x"] : 0, ["y"] : y,["w"] :width ,["h"] : height},	
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["image"]: "ty_uiDi03", ["autoScale"]: true, ["x"]: 0, ["y"]: y, ["w"]: width, ["h"]: height },
            { ["index_type"]: eui.Image, ["name"]: name + "_title_bg", ["parent"]: name + "_bg", ["image"]: "cw_textDi02", ["x"]: 15, ["y"]: 0, ["w"]: 44, ["h"]: 120 },
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_title", ["parent"]: name + "_title_bg", ["title"]: "", ["image"]: "", ["font"]: "ht_20_cc", ["color"]: "", ["x"]: 8, ["y"]: 17, ["w"]: 28, ["h"]: 86 },
            { ["index_type"]: eui.Group, ["name"]: name + "_group_actor", ["parent"]: name + "_bg", ["title"]: "", ["x"]: 130, ["y"]: 20, ["w"]: 1, ["h"]: 1, ["messageFlag"]: true },
            { ["index_type"]: eui.Group, ["name"]: name + "_group_prize", ["parent"]: name + "_bg", ["title"]: "", ["x"]: 180, ["y"]: 10, ["w"]: 320, ["h"]: 100, },
            { ["index_type"]: eui.Group, ["name"]: name + "_group_double", ["parent"]: name + "_bg", ["title"]: "", ["x"]: 500, ["y"]: 10, ["w"]: 320, ["h"]: 120, ["messageFlag"]: true },
            { ["index_type"]: eui.Label, ["name"]: name + "_tips_1", ["parent"]: name + "_group_double", ["title"]: "*2", ["image"]: "", ["font"]: "ht_26_cc", ["color"]: gui.Color.red, ["x"]: 0, ["y"]: 48, ["w"]: 40, ["h"]: 26 },
            { ["index_type"]: eui.Label, ["name"]: name + "_bei", ["parent"]: name + "_group_double", ["title"]: "*2", ["image"]: "", ["font"]: "ht_20_cc", ["color"]: gui.Color.red, ["x"]: 30, ["y"]: 48, ["w"]: 200, ["h"]: 20 },
        ];
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window);

        this.mElemList[name + "_title"].setAlignFlag(gui.Flag.CENTER_CENTER)
        if (this.actorList[index] == null) {
            this.actorList[index] = UIActorView.newObj(this.mLayoutNode, name + "_actor_view", 0, 0, this.mElemList[name + "_group_actor"])
        }
        //this.mElemList[name + "_rd_double"].setAlignFlag(gui.Flag.LEFT_CENTER)

        //AddRdContent(this.mElemList[name + "_rd_double"], Localize_cns("ESCPRT_DOUBLE_TIPS"), "ht_24_cc", "red")
    }

    refreshItemWindow(index, config) {
        let name = "group" + index
        let ColorList = ["#ublack", "#green", "#blue", "#purple", "#orange"]

        let titleColor = ColorList[index - 1]
        AddRdContent(this.mElemList[name + "_title"], titleColor + config.tip, "ht_20_cc")

        this.actorList[index].updateByPlayer(config.model)
        if (this.isDouble) {
            this.mElemList[name + "_group_double"].visible = true
        } else {
            this.mElemList[name + "_group_double"].visible = false
        }
        let prizelist = AnalyPrizeFormat(config.prize)
        for (let i = 0; i < size_t(prizelist); i++) {
            let x = 80 * i
            let y = 0

            let id = prizelist[i][0]
            let count = prizelist[i][1]

            let itemName = GameConfig.itemConfig[id].name
            if (this.mElemList[name + "_group_prize_" + i] == null) {
                let mElemInfo: any = [
                    { ["index_type"]: eui.Group, ["name"]: name + "_group_prize_" + i, ["title"]: "", ["image"]: "", ["font"]: "ht_18_cc", ["x"]: x, ["y"]: 0, ["w"]: 80, ["h"]: 100 },
                    { ["index_type"]: eui.Group, ["name"]: name + "_prize_container_" + i, ["parent"]: name + "_group_prize_" + i, ["title"]: "", ["image"]: "", ["font"]: "ht_18_cc", ["x"]: 0, ["y"]: 0, ["w"]: 80, ["h"]: 80 },
                    { ["index_type"]: eui.Label, ["name"]: name + "_prize_name_" + i, ["parent"]: name + "_group_prize_" + i, ["title"]: "", ["image"]: "", ["font"]: "ht_16_cc", ["x"]: 0, ["y"]: 80, ["w"]: 80, ["h"]: 20 },
                ];
                UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, this.mElemList[name + "_group_prize"]);
                this.mElemList[name + "_prizeBox_" + i] = UIItemBox.newObj(this.mLayoutNode, name + "_prizeBox_" + i, 0, 0, this.mElemList[name + "_prize_container_" + i])
            }

            this.mElemList[name + "_prizeBox_" + i].updateByEntry(id, count)
            let quality = GameConfig.itemConfig[id].quality || opEquipQuality.gray
            this.mElemList[name + "_prize_name_" + i].textColor = GetQualityColorGui(quality, false)
            this.mElemList[name + "_prize_name_" + i].text = itemName


        }
        this.mElemList[name + "_bg"].source = "ty_uiDi03"

        if (index == this.select) {
            this.mElemList[name + "_bg"].source = "ty_uiDi04"
        }


    }

    ////响应事件
    public onRefreshClick(): void {
        if (this.select == opEscort.maxMacheIndex) {
            MsgSystem.addTagTips(Localize_cns("ESCORT_REFRESH_TIPS"))
            return
        }
        let unit = opItemUnit.BIND_CURRENCY
        let had = GetHeroMoney(unit)
        let need = opEscort.normalRand
        if (had < need && GetHeroMoney(opItemUnit.CURRENCY) > need) {
            let t: IDialogCallback = {
                onDialogCallback(result: boolean, userdata): void {
                    if (result == true) {
                        RpcProxy.call("C2G_RandEscortIndex", 0)
                    } else {
                        let formatStr = Localize_cns(ItemUnitName[unit])
                        MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
                    }
                }
            }
            MsgSystem.confirmDialog(Localize_cns("ESCORT_USE_CURRENCY"), t, null)
            return
        }
        RpcProxy.call("C2G_RandEscortIndex", 0)
    }
    public onOneKeyClick(): void {
        if (this.select == opEscort.maxMacheIndex) {
            MsgSystem.addTagTips(Localize_cns("ESCORT_REFRESH_TIPS"))
            return
        }
        let id = opEscort.orangeCard
        let had = ItemSystem.getInstance().getItemCount(id)
        let showTips = Localize_cns("ESCORT_TIPS_TXT5")
        let isMoneyEnough = true
        if (had == 0) {
            let hadBind = GetHeroMoney(opItemUnit.BIND_CURRENCY)
            showTips = Localize_cns("ESCORT_TIPS_TXT8")
            if (hadBind < opEscort.specialRand) {
                let hadCurrency = GetHeroMoney(opItemUnit.CURRENCY)
                if (hadBind + hadCurrency < opEscort.specialRand) {
                    isMoneyEnough = false
                }
            }
        }

        let t: IDialogCallback = {
            onDialogCallback(result: boolean, userdata): void {
                if (result == true) {
                    if (isMoneyEnough == false) {
                        let formatStr = Localize_cns(ItemUnitName[opItemUnit.BIND_CURRENCY])
                        MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
                        return
                    }
                    RpcProxy.call("C2G_RandEscortIndex", 1)
                }
            }
        }
        MsgSystem.confirmDialog(showTips, t, null)

    }

    public onGotoClick(): void {
        let actInfo = GetActivity(ActivityDefine.HuSong).getActInfo()
        if (size_t(actInfo) == 0) return
        if (actInfo.husongTwice == 0) {
            MsgSystem.addTagTips(Localize_cns("ESCORT_TIPS_TXT7"))
            return
        }
        let isDouble = actInfo.isDouble || 1
        if (isDouble == 2) {
            RpcProxy.call("C2G_BeginEscort")
            this.hideWnd()
            let wnd: EscortFrame = WngMrg.getInstance().getWindow("EscortFrame")
            wnd.showWnd()
            return
        }

        let showTips = Localize_cns("ESCORT_TIPS_TXT3") + "#br" + Localize_cns("ESCORT_TIPS_TXT4")
        let _this = this
        let t: IDialogCallback = {
            onDialogCallback(result: boolean, userdata): void {
                if (result == true) {
                    RpcProxy.call("C2G_BeginEscort")
                    _this.hideWnd()
                    let wnd: EscortFrame = WngMrg.getInstance().getWindow("EscortFrame")
                    wnd.showWnd()
                }
            }
        }
        MsgSystem.confirmDialog(showTips, t, null)

    }
}