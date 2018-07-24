// TypeScript file
//排行界面的通用基类，主要实现genConfigList refreshItemWindow refreshHeroRank三个接口，如果有特殊调整，可以在子类先调用super.initItemWindow再创建子类适用的控件等
class ItemBoxPreviewFrame extends BaseWnd {
    controlDataTable: any;
    scroll: UIScrollList;
    itemList: any[];                //[[entryId, count],]
    currencyType: number;
    consumNum: number;
    callBack: any;
    obj: any;
    param: any;

    public initObj(...params: any[]) {
        this.itemList = []
        this.currencyType = opItemUnit.CURRENCY
        this.consumNum = 0
        this.mLayoutPaths = ["resource/layouts/common/ItemBoxPreviewLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setAlignCenter(true, true);
        this.initSkinElemList();

        let mElemInfo: any = [

            { ["name"]: "btn_close_top",    ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_back",     ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "open_btn",     ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickOpen },
            { ["name"]: "tips_tl",     ["color"]: gui.Color.lime, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
        ]
        UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this);

        let group = <eui.Group>this.mElemList["scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)

        this.mElemList["consum_rd"].setAlignFlag(gui.Flag.H_CENTER)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        //RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)

        this.mLayoutNode.visible = (true)
        this.refreshFrame()
    }

    public onHide(): void {
        //UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
        this.mLayoutNode.visible = (false)
        
        this.callBack = null
        this.obj = null
        this.param = null
    }

	initItemWindow(window) {
		let name = window.name

		for (let i = 0; i < 4; i++) {
            this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox" + i, 20 + 90 * i, 0, window)
        }
		//ui_util.CreateDrawRectPtr(this.mElemList[name +"_dec"], gui.Color32Half.green)
		//AddRdContent(this.mElemList[name + "_dec"], Localize_cns("CHAT_ERROE_JINYAN"), "ht_20_cc", "zongse")
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
        let list = []
        let list1 = this.genConfigList()//[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1 ,1 ]
        let t = []
        for (let i = 0; i < list1.length; i++) {
            let v = list1[i]
            table_insert(t, v)

            if (t.length >= 4) {
                table_insert(list, t)
                t = []
            }
        }
        if (t.length > 0) {
            table_insert(list, t)
        }

        let group = <eui.Group>this.mElemList["scroll_group"]
        let scroll = this.scroll
		scroll.clearItemList();
		this.controlDataTable = {}
		
		for (let k = 0; k < list.length; k++) {
			let v = list[k]
			let [window, flag] = scroll.getItemWindow(k, group.width - 3, 85, 3, 5, 0)

            if (flag == true) {
			    this.initItemWindow(window)
            }
			this.refreshItemWindow(window, v)
		}

        //消耗描述
        AddRdContent(this.mElemList["consum_rd"], GetMoneyIcon(this.currencyType) + " " + this.consumNum, "ht_24_cc_stroke", "white")
    }

    /////////////////////////////////////////////////////////////////
    genConfigList() {
        // return [[60061, 20000], [60061, 20000], [60061, 20000], [60061, 20000], [60061, 20000], [60061, 20000], [60061, 20000], [60061, 20000]
        // , [60061, 20000], [60061, 20000], [60061, 20000], [60061, 20000], [60061, 20000], [60061, 20000], [60061, 20000],[60061, 20000],[60061, 20000]]
        return this.itemList
    }
     //////////////////////////////////////////
     onClickOpen(args) {
        let _this = this
        let t: IDialogCallback = {
            onDialogCallback(result: boolean, userData): void {
                if (result == true) {
                    if (_this.callBack) {
                        _this.callBack.call(_this.obj, _this.param)
                    }

                    _this.hideWnd()
                }
            }
        }
        MsgSystem.confirmDialog(String.format(Localize_cns("COMMON_TXT9"), this.consumNum + Localize_cns(ItemUnitName[this.currencyType])), t, null)
    }

     /////////////////////////////////////////////////公共接口////////////////////////////
     showPreviewFrame(itemList, currencyType, consumNum, callBack?, obj?, param?) {
        this.itemList = itemList || []
        this.currencyType = currencyType
        this.consumNum = consumNum
        this.callBack = callBack
        this.obj = obj
        this.param = param

        this.showWnd()
     }
}