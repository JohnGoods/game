// TypeScript file
class NotifyPrizeGainFrame extends BaseWnd {
    clickCallback: Function;
    clickObj: any;
    scroll: UIScrollList
    prizeList: any
    title: string
    des: string
    btnTitle: string

    public initObj(...params: any[]) {
        this.title = Localize_cns("CAMPAIGN_TXT4")
        this.des = Localize_cns("CAMPAIGN_TXT5")
        this.mLayoutPaths = ["resource/layouts/NotifyPrizeGainLayout.exml"]
        this.btnTitle = Localize_cns("ACTIVITY_PAY_TXT6")
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        // this.setFullScreen(true)
        this.initSkinElemList();
        this.setAlignCenter(true, true);

        var elemInfo = [
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

            { ["name"]: "gain_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGain },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let group = <eui.Group>this.mElemList["scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
        
        for (let i = 0; i < 4; i++) {
            this.mElemList["itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, "itemBox" + i, 28 + 90 * i, 10, this.mElemList["scroll_group"])
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.refreshFrame();
    }

    public onHide(): void {

        this.mLayoutNode.visible = false;
        this.clickCallback = null
        this.clickObj = null
    }

    // switchListGroup(b: boolean) {
    //     this.mElemList["btn_show"].selected = !!b;
    //     this.refreshFrame()
    // }
    initItemWindow(window) {
        let name = window.name  

		// let mElemInfo: any = [
		// 	{ ["index_type"]: gui.Grid9Image,   ["name"]: name + "_bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["autoScale"]:true, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: window.width, ["h"]: window.height, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },

		// ]
		// UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
		//ui_util.CreateDrawRectPtr(this.mElemList[name +"_dec"], gui.Color32Half.green)
		//AddRdContent(this.mElemList[name + "_dec"], Localize_cns("CHAT_ERROE_JINYAN"), "ht_20_cc", "zongse")
        for (let i = 0; i < 4; i++) {
            this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox" + i, 10 + 100 * i, 10, window)
        }
    }

    refreshItemWindow(window, config) {
        let name = window.name

        for (let i = 0; i < 4; i++) {
            if (config[i]) {
                this.mElemList[name + "itemBox" + i].setVisible(true)

                let [entryId, count] = config[i]
                this.mElemList[name + "itemBox" + i].updateByEntry(entryId, count)
            } else {
                this.mElemList[name + "itemBox" + i].setVisible(false)
            }
        }
    }

    refreshFrame() {
        let list = this.prizeList || []//[1, 1,1, 1, 1]//[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ,1 ]

        for (let i = 0; i < 4; i++) {
            this.mElemList["itemBox" + i].setVisible(false)
        }
        this.scroll.setVisible(true)

        if (list.length <= 4) {
            this.scroll.setVisible(false)

            let l = list.length
            let w = l * 80 + (l - 1) * 10
            let sx = (this.mElemList["scroll_group"].width - w) / 2
            for (let i = 0; i < l; i++) {
                this.mElemList["itemBox" + i].setVisible(true)
                this.mElemList["itemBox" + i].setXY(sx + i * (80 + 10), 10)

                let [entryId, count] = list[i]
                this.mElemList["itemBox" + i].updateByEntry(entryId, count)
            }
        } else {
            let list1 = []
            var t = []
            list.forEach(v=>{
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
            let hasNum = list.length
            for (let k = 0; k < list1.length; k++) {
                let v = list[k]
                let [window, flag] = scroll.getItemWindow(k, group.width - 3, 125, 3, 5, 0)

                if (flag == true) {
                    this.initItemWindow(window)
                }
                this.refreshItemWindow(window, v)
            }
        }

        this.mElemList["label_wndName"].text = this.title
        this.mElemList["dec_rd"].setAlignFlag(gui.Flag.H_CENTER)
        AddRdContent(this.mElemList["dec_rd"], this.des, "ht_24_cc", "zongse")

        this.mElemList["gain_btn"].text = this.btnTitle || Localize_cns("ACTIVITY_PAY_TXT6")
        this.mElemList["gain_btn"].visible = this.clickCallback != null
    }

    /////////////////////////////////////////////////
    onClickGain(args) {
        if (this.clickCallback) {
            if (this.clickCallback.call(this.clickObj)) {
                return
            }
        }
        
        return this.hideWnd()
        //
    }

    showPrizeGainFrame(callback, obj, prizeList, title, des, btnTitle) {
        this.clickCallback = callback
        this.clickObj = obj
        this.prizeList = prizeList
        this.title = title
        this.des = des
        this.btnTitle = btnTitle
        this.showWnd()
    }
}