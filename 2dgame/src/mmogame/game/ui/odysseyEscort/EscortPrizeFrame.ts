// TypeScript file
class EscortPrizeFrame extends BaseWnd {
    scroll: UIScrollList;

    actor_prize : UIActorView

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/xiyouhusong/EscortPrizeLayout.exml"]

    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.width = 640
        this.mLayoutNode.height = 600
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_get", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGetClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        let group: eui.Group = this.mElemList["group_scroll"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_VERTICAL)

        this.actor_prize = UIActorView.newObj(this.mLayoutNode, "actorPrize", 0, 0, this.mElemList["actor"])

    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.mLayoutNode.setDoModal(true);
        this.onRefresh();
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        this.mLayoutNode.setDoModal(false);

        this.actor_prize.clearView()
    }
    onRefresh() {

        let actInfo = GetActivity(ActivityDefine.HuSong).getActInfo()
        let prizeInfo = GetActivity(ActivityDefine.HuSong).getHusongPrize()
        if (size_t(actInfo) == 0 || prizeInfo == null) return

        let index = actInfo.index

        let refConfig = GameConfig.EscortConfig[index]
        this.mElemList["label_mache"].textColor = GetQualityColorGui(index, false)
        this.mElemList["label_mache"].text = refConfig.tip

        this.actor_prize.updateByPlayer(refConfig.model)

        let prize_t = refConfig.prize
        if(size_t(prizeInfo.recordList) == 1){
            prize_t = refConfig.lootOne
        } else if(size_t(prizeInfo.recordList) == 2){
            prize_t = refConfig.lootTwo
        }

        let prizeList = AnalyPrizeFormat(prize_t)

        let isDouble = prizeInfo.isDouble || 1
        let ratio = 1
        if (isDouble == 2) {
            ratio = 2
            this.mElemList["group_double"].visible = true
        }else{
            this.mElemList["group_double"].visible = false
        }

        let prizeStr = "#green"
        for (let k in prizeList) {
            let prize = prizeList[k]
            let name = GameConfig.itemConfig[prize[0]].name
            prizeStr += name + ":" + prize[1] * ratio + "#space"
            if (tonumber(k) == 1 || tonumber(k) == 3) {
                prizeStr += "#br"
            }
        }
        AddRdContent(this.mElemList["rd_des"], prizeStr, "ht_20_cc")


        let scroll = this.scroll

        scroll.clearItemList()
        let list = prizeInfo.recordList

        for (let k = 0; k < size_t(list); k++) { // 抢夺列表
            let config = list[k]
            let [window, flag] = scroll.getItemWindow(k, 470, 20, 0, 0)
            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, config, index)
        }

        scroll.refreshScroll(true, true)
        scroll.restoreViewXY()

    }
    initItemWindow(window) {
        let name = window.name

        let mElemInfo: any = [
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_des", ["title"]: "", ["image"]: "", ["font"]: "ht_20_cc", ["x"]: 0, ["y"]: 0, ["w"]: 470, ["h"]: 20 },
        ];
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window);

        this.mElemList[name + "_des"].setAlignFlag(gui.Flag.LEFT_CENTER)

    }

    refreshItemWindow(window, config, myIndex) {
        let name = window.name
        let cheColor = "#" + GetQualityColorStr(myIndex, false)
        let winStr = "#red" + Localize_cns("ESCORT_RECORD_TXT3")
        if(config.winFlag == 1){
            winStr = "#darkgreen" + Localize_cns("ESCORT_RECORD_TXT6")
        }
        let desStr = "#green" + config.name + Localize_cns("ESCORT_RECORD_TXT4")  + cheColor + GameConfig.EscortConfig[myIndex].tip + "#space_10" + winStr

        AddRdContent(this.mElemList[name + "_des"], desStr, "ht_20_lc","ublack")
    }

    ///-------------------响应事件btn_get
    onGetClick() {
        RpcProxy.call("C2G_GetEscortPrize")
        RpcProxy.call("C2G_EnterEscortActivity")
        GetActivity(ActivityDefine.HuSong).setIsPrize(false)
        this.hideWnd()
    }

}