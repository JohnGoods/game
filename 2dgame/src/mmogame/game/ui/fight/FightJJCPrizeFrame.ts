// TypeScript file

class FightJJCPrizeFrame extends FightEndBaseFrame {
    controlDataTable: any
    actorList: any;
    scroll: UIScrollList;
    prizelist: any;
    public initObj(...params: any[]) {
        this.actorList = {}
        this.mLayoutPaths = ["resource/layouts/fight/FightJJCPrizeLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setAlignCenter(true, true)
        this.initSkinElemList();
        // this.mLayoutNode.setLayer(gui.GuiLayer.Top)

        this.mLayoutNode.verticalCenter = -100

        var elemInfo: any[] = [
            { ["name"]: "gain_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onReturn },
        ];

        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let group = <eui.Group>this.mElemList["scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        super.onShow();
        this.bAutoHide = true
        //this.maxDelayTime = 10 * 1000
        this.mLayoutNode.visible = true;

        //GameSound.getInstance().playEffect(SystemSound.effect_win)
        this.refreshFrame()
    }

    public onHide(): void {
        super.onHide();

        this.mLayoutNode.visible = false;
        for (let k = 0; k < this.prizelist.length; k++) {
            let v = this.prizelist[k]
            if (v[2] && v[2] >= opEquipQuality.gold) {
                let item = Item.newObj({ entry: v[0], quality: v[2] })
                MsgSystem.addGetGoldEquipTips(item)
            } else {
                MsgSystem.addGetItemTips(v)
            }
        }
        this.prizelist = []
        let list = []
        for (let name in this.actorList) {
            let actor = this.actorList[name]

            JsUtil.arrayInstert(list, name)
        }
    }

    initItemWindow(window) {
        let name = window.name

        let mElemInfo: any = []

        for (let i = 0; i < 4; i++) {
            table_insert(mElemInfo, { ["index_type"]: eui.Label, ["name"]: name + "_name_" + i, ["title"]: "", ["font"]: "ht_22_cc_stroke", ["color"]: gui.Color.white, ["x"]: 30 + 110 * i, ["y"]: 87, ["w"]: 100, ["h"]: 30, ["messageFlag"]: true })
            this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox" + i, 40 + 110 * i, 5, window)
        }
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
    }

    refreshItemWindow(window, config) {
        let name = window.name

        for (let i = 0; i < 4; i++) {
            if (config[i]) {
                let [entryId, count, quality] = config[i]
                this.mElemList[name + "itemBox" + i].setVisible(true)
                this.mElemList[name + "itemBox" + i].updateByEntry(entryId, count, quality)

                this.mElemList[name + "_name_" + i].text = ItemSystem.getInstance().getItemName(entryId)
                this.mElemList[name + "_name_" + i].textColor = GetQualityColorGui(quality || ItemSystem.getInstance().getItemTemplateInfoValue(entryId, "quality"))
                this.mElemList[name + "_name_" + i].visible = true
            } else {
                this.mElemList[name + "itemBox" + i].setVisible(false)
                this.mElemList[name + "_name_" + i].visible = false
            }
        }
    }

    refreshFrame() {
        //param/commonPrize
        // local commonPrize = {}
        // commonPrize.funds = 0                        现银
        // commonPrize.bindCurrency = 0                 绑定元宝
        // commonPrize.currency = 0                     元宝
        // commonPrize.plrExp = 0                       经验
        // commonPrize.itemList = {}                    {entryId, count}
        // commonPrize.star = 0
        // commonPrize.campaignId = 0

        this.prizelist = []
        if (this.param && this.param.commonPrize) {
            //金币
            if (this.param.commonPrize.funds && this.param.commonPrize.funds > 0) {
                table_insert(this.prizelist, [SpecailItemId.FUNDS, this.param.commonPrize.funds])
            }
            //绑定元宝
            if (this.param.commonPrize.bindCurrency && this.param.commonPrize.bindCurrency > 0) {
                table_insert(this.prizelist, [SpecailItemId.B_GOLD, this.param.commonPrize.bindCurrency])
            }
            //元宝
            if (this.param.commonPrize.currency && this.param.commonPrize.currency > 0) {
                table_insert(this.prizelist, [SpecailItemId.GOLD, this.param.commonPrize.currency])
            }
            //经验
            if (this.param.commonPrize.plrExp && this.param.commonPrize.plrExp > 0) {
                table_insert(this.prizelist, [SpecailItemId.EXP, this.param.commonPrize.plrExp])
            }
            //帮贡
            if (this.param.commonPrize.facContribute && this.param.commonPrize.facContribute > 0) {
                table_insert(this.prizelist, [SpecailItemId.BANGGONG, this.param.commonPrize.facContribute])
            }

            for (let _ in this.param.commonPrize.itemList) {
                let v = this.param.commonPrize.itemList[_]
                table_insert(this.prizelist, v)
            }
        }
        let list1 = []
        var t = []
        this.prizelist.forEach(v => {
            table_insert(t, v)
            if (size_t(t) == 4) {
                table_insert(list1, t)
                t = []
            }
        })
        if (t.length > 0) {
            table_insert(list1, t)
        }

        let group = <eui.Group>this.mElemList["scroll_group"]
        let scroll = this.scroll
        scroll.clearItemList();
        this.controlDataTable = {}
        for (let k = 0; k < list1.length; k++) {
            let v = list1[k]
            let [window, flag] = scroll.getItemWindow(k, group.width - 3, 100, 3, 5, 0)

            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v)
        }

        //排名
        if (this.param && this.param.commonPrize) {
            this.mElemList["history_rank"].text = this.param.commonPrize.bestRank || 0
            let curRank = this.param.commonPrize.plrRank || 0
            let upRank = this.param.commonPrize.rankUp || 0
            this.mElemList["cur_rank_rd"].setAlignFlag(gui.Flag.V_CENTER)
            AddRdContent(this.mElemList["cur_rank_rd"], curRank + "#JIANTOU_UP#lime" + upRank, "ht_24_cc_stroke", "white")
            let money = this.param.commonPrize.bindCurrency || 0
            this.mElemList["prize_rd"].setAlignFlag(gui.Flag.V_CENTER)
            AddRdContent(this.mElemList["prize_rd"], "#BIND_YUANBAO" + money, "ht_24_cc_stroke", "white")
        }
    }

    starShowCombatEnd() {
        return this.showWnd()
    }

    autoHideTick(leftTime) {
        this.mElemList["gain_btn"].text = Localize_cns("FIGHT_TXT9") + "(" + Math.floor(leftTime / 1000) + ")"
    }

    onReturn(args) {
        this.endShowCombatEnd()
    }
}