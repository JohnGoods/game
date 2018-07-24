class PeerlessCombatTipsFrame extends BaseWnd {
    scroll: UIScrollList
    playerInfoList
    select
    controlData

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/champion/PeerlessCombatTipsLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.width = 540
        this.mLayoutNode.height = 407
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let group: eui.Group = this.mElemList["scroll"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll_list", 0, 0, group.width, group.height, group)

        this.mElemList["rd_name"].setAlignFlag(gui.Flag.CENTER_CENTER)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.onRefresh()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        this.select = null
        //this.playerInfoList = null
    }

    onRefresh() {
        if (this.playerInfoList == null) return

        let player_1 = this.playerInfoList[0]
        let player_2 = this.playerInfoList[1]

        let [winner, winStr] = player_1.roundIndex > player_2.roundIndex ? [player_1, "3 : 0"] : [player_2, "0 : 3"]

        let loser = winner != player_1 ? player_1 : player_2

        let playerInfo_1 = player_1.playerInfo
        let playerInfo_2 = player_2.playerInfo

        let name_1 = GetServerPlayerName(player_1.serverId, player_1.serverGroupId, playerInfo_1.name)
        let name_2 = GetServerPlayerName(player_2.serverId, player_2.serverGroupId, playerInfo_2.name)

        let str = name_1 + "#lime#space" + winStr + "#rf#space" + name_2
        AddRdContent(this.mElemList["rd_name"], str, "ht_20_cc_stroke")

        let scroll = this.scroll

        scroll.clearItemList()
        this.controlData = {}
        let showList = winner["round_" + (loser.roundIndex + 1)]

        for (let k = 0; k < size_t(showList); k++) {
            let combatName = GetServerPlayerName(winner.serverId, winner.serverGroupId, winner.playerInfo.name)
            let v = showList[k]
            this.controlData[k + ""] = [v[2], v[1]]
            let [window, flag] = scroll.getItemWindow(k, 494, 60, 0, 0)
            if (flag == true) {
                this.initWindow(window)
            }
            this.refreshWindow(window, combatName, GetNumberToStr(k + 1))
        }

        scroll.refreshScroll(true, true)
        scroll.restoreViewXY()
    }

    initWindow(window) {
        let name = window.name
        let mElemInfo: any = [

            { ["index_type"]: eui.Group, ["name"]: name + "group", ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: 494, ["h"]: 30, },
            { ["index_type"]: eui.Label, ["name"]: name + "ju", ["parent"]: name + "group", ["title"]: "", ["font"]: "ht_20_lc_stroke", ["image"]: null, ["color"]: gui.Color.aliceblue, ["x"]: 18, ["y"]: 20, ["w"]: 140, ["h"]: 20, ["messageFlag"]: true },
            { ["index_type"]: eui.Label, ["name"]: name + "name", ["parent"]: name + "group", ["title"]: "", ["font"]: "ht_20_lc_stroke", ["image"]: null, ["color"]: gui.Color.aliceblue, ["x"]: 164, ["y"]: 20, ["w"]: 140, ["h"]: 20, ["messageFlag"]: true },
            { ["index_type"]: eui.Label, ["name"]: name + "flag", ["parent"]: name + "group", ["title"]: Localize_cns("JJC_TXT29"), ["font"]: "ht_20_lc_stroke", ["image"]: null, ["color"]: gui.Color.lime, ["x"]: 352, ["y"]: 20, ["w"]: 40, ["h"]: 20, ["messageFlag"]: true },
            { ["index_type"]: eui.Label, ["name"]: name + "look", ["parent"]: name + "group", ["title"]: Localize_cns("JJC_TXT28"), ["font"]: "ht_20_lc_stroke", ["image"]: null, ["color"]: gui.Color.lime, ["x"]: 431, ["y"]: 20, ["w"]: 40, ["h"]: 20, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLookClick },
            { ["index_type"]: eui.Rect, ["name"]: name + "rect", ["parent"]: name + "look", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: null, ["color"]: gui.Color.darkgreen, ["x"]: 0, ["y"]: 22, ["w"]: 40, ["h"]: 2, ["messageFlag"]: true },
        ];
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window);

    }

    refreshWindow(window, combatName, index) {
        let name = window.name
        this.mElemList[name + "ju"].text = Localize_cns("JJC_TXT3") + index + Localize_cns("JJC_TXT22")
        this.mElemList[name + "name"].text = combatName
    }

    ///响应事件
    onLookClick(args) {
        let name = args.target.name
        let index = name.replace(/[^0-9]/ig, "");

        let config = this.controlData[index]
        if (!config || size_t(config) < 2) return
        let roleId = config[0]
        let videoId = config[1]
        if(videoId == 0 ) return
        if(CheckEndFightNow() == false) return

        ChangePatrolState(false) //停止巡逻
        GetFightVideo(videoId, roleId)
    }

    ////----------
    onShowWnd(playerInfoList) {
        this.playerInfoList = playerInfoList
        this.showWnd()
    }

}