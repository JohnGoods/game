// TypeScript file
class ClubActivePrizeFrame extends BaseWnd {
    scroll: UIScrollList;
    list: any[];

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/club/ClubActivePrizeLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();
        this.setAlignCenter(true, true)

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let group = <eui.Group>this.mElemList["scroll_wnd"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 10, 10, group.width - 20, group.height - 20, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.refreshFrame()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
    }

    refreshFrame() {
        let activeData = ClubSystem.getInstance().getClubActiveInfo()
        if (activeData == null)
            return;

        let curActiveLevel = activeData.level
        let limit = 20
        let prizeConfig = GameConfig.FactionActiveLevelConfig
        let list: any[] = []
        for (let i in prizeConfig) {
            let index = tonumber(prizeConfig[i].ID)
            if (index >= curActiveLevel - limit && index <= curActiveLevel + limit) {
                table_insert(list, prizeConfig[i])
            }
        }

        this.scroll.clearItemList()
        this.list = list

        let group = <eui.Group>this.mElemList["scroll_wnd"]
        for (let i = 0; i < size_t(list) - 1; i++) { //最后一个没有奖励
            let v = list[i]
            let [window, flag] = this.scroll.getItemWindow(i, group.width - 20, 105, 0, 0, 0)
            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v)
        }
    }

    initItemWindow(window) {
        let name = window.name
        let w = window.width
        let h = window.height

        let Info = [
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h },
            { ["index_type"]: eui.Label, ["name"]: name + "_lv", ["title"]: "", ["font"]: "ht_24_lc", ["color"]: gui.Color.ublack, ["x"]: 20, ["y"]: 36, ["w"]: 100, ["h"]: 30 },
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_get_icon", ["image"]: "bh_text02", ["x"]: 380, ["y"]: 30, ["w"]: 120, ["h"]: 39 },
            { ["index_type"]: eui.Label, ["name"]: name + "_get_txt", ["title"]: Localize_cns("CLUB_TXT51"), ["font"]: "ht_24_cc", ["color"]: gui.Color.saddlebrown, ["x"]: 380, ["y"]: 35, ["w"]: 120, ["h"]: 30 },
        ]
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)

        this.mElemList[name + "_get_icon"].visible = false
        this.mElemList[name + "_get_txt"].visible = false

        for (let i = 0; i < 3; i++) {
            this.mElemList[name + "_itemBox_" + i] = UIItemBox.newObj(this.mLayoutNode, name + "_itemBox_" + i, 130 + i * 86, 12, window)
            this.mElemList[name + "_itemBox_" + i].setVisible(false)
        }
    }

    refreshItemWindow(window, data) {
        let name = window.name

        this.mElemList[name + "_lv"].text = String.format(Localize_cns("CLUB_TXT96"), data.ID)

        let prizeList = AnalyPrizeFormat(data.prize)
        for (let i = 0; i < 3; i++) {
            this.mElemList[name + "_itemBox_" + i].setVisible(false)
            if (prizeList[i]) {
                this.mElemList[name + "_itemBox_" + i].updateByEntry(prizeList[i][0], prizeList[i][1])
                this.mElemList[name + "_itemBox_" + i].setVisible(true)
            }
        }

        //领取记录
        let activeData = ClubSystem.getInstance().getClubActiveInfo() || {}
        let activeLv = activeData.level

        if (data.ID > activeLv) {
            this.mElemList[name + "_get_icon"].visible = false
            this.mElemList[name + "_get_txt"].visible = true
        } else {
            this.mElemList[name + "_get_icon"].visible = true
            this.mElemList[name + "_get_txt"].visible = false
        }
    }
}