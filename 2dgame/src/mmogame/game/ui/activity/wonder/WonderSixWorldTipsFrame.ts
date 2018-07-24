class WonderSixWorldTipsFrame extends BaseWnd {
    prizeConfig
    index

    scroll
    timer
    count

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/wonder/WonderSixWorldTipsLayout.exml"]

    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.width = 640
        this.mLayoutNode.height = 600
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_sure", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_10", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBtn10Click },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        let group: eui.Group = this.mElemList["group_item"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)

    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        UiUtil.registerTouchOutsideEvent(this.hideWnd, this, [this.mLayoutNode])
        this.mLayoutNode.visible = true;
        this.onRefresh()
    }

    public onHide(): void {
        UiUtil.unRegisterTouchOutsideEvent(this.hideWnd, this)
        this.mLayoutNode.visible = false;
        
        this.onShowMsg()
        this.onClear()
    }

    onClear() {
        this.prizeConfig = null

        if (this.timer != null) {
            KillTimer(this.timer)
            this.timer = null
        }
    }

    onRefresh() {

        if (this.prizeConfig == null) return
        let showList = splitListByCount(this.prizeConfig, 5)

        let scroll = this.scroll

        for (let k = 0; k < showList.length; k++) {
            let v = showList[k]
            let [window, flag] = scroll.getItemWindow(k, 440, 80, 3, 0, 0)

            if (flag == true) {
                this.initRadioItemWindow(window, v)
            }
            this.refreshRadioItemWindow(window, v)
        }

        if (this.timer == null) {
            this.count = 6
            this.timer = SetTimer(this.onTick, this, 1000, true)
        }

        if(this.index == null) {
            this.index = 1
        }

        let isShow = this.index == 10
        this.mElemList["btn_10"].visible = isShow

        if(!isShow){
            UiUtil.setXY(this.mElemList["btn_sure"], 262, 454)
        }else{
            UiUtil.setXY(this.mElemList["btn_sure"], 366, 454)
        }

    }



    initRadioItemWindow(window, v) {
        let name = window.name

        for (let k = 0; k < 5; k++) {
            this.mElemList[name + "itemBox_" + k] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox_" + k, 90 * k, 0, window)
        }
    }

    refreshRadioItemWindow(window, config) {
        let name = window.name

        for (let k = 0; k < 5; k++) {
            let v = config[k]
            if (v) {
                this.mElemList[name + "itemBox_" + k].setVisible(true)
                this.mElemList[name + "itemBox_" + k].updateByEntry(v[0], v[1])
            } else {
                this.mElemList[name + "itemBox_" + k].setVisible(false)
            }
        }
    }

    ///----------------
    onBtn10Click() {
        let netInfo: any = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.SIX_LOOK_PRECIOUS) || {}
        if (netInfo == null) return
        let times = netInfo.remainNum || 0
        if (times < 10) {
            MsgSystem.addTagTips(Localize_cns("WONDER_LIUJIE_TXT4"))
            this.hideWnd()
            return
        }

        this.onShowMsg()
        this.onClear()
        RpcProxy.call("C2G_DoOperateActivity", PayActivityIndex.SIX_LOOK_PRECIOUS, [10])
    }


    onShowMsg() {
        if (this.prizeConfig == null) return
        for (let k = 0; k < this.prizeConfig.length; k++) {
            let v = this.prizeConfig[k]
            if (v[2] && v[2] >= opEquipQuality.gold) {
                let item = Item.newObj({ entry: v[0], quality: v[2] })
                MsgSystem.addGetGoldEquipTips(item)
            } else {
                MsgSystem.addGetItemTips(v)
            }
        }
    }


    ///----------- 定时器
    onTick() {
        this.count -= 1
        if (this.count <= 0) {
            this.onClear()
            this.hideWnd()
            return
        }

        this.mElemList["label_close"].text = String.format(Localize_cns("LUCKY_TXT10"), this.count)
    }


    //////////////------------
    onShowWnd(prizeInfo, index) {
        this.prizeConfig = prizeInfo
        this.index = index || 1
        this.showWnd()
    }

    updateWnd(prizeInfo) {
        this.onClear()
        this.prizeConfig = prizeInfo
        this.onRefresh()
    }
}