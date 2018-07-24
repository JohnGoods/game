// TypeScript file

class PrizeShowFrame extends BaseWnd {
    controlDataTable: any
    actorList: any;
    itemList;
    scroll: UIScrollList;

    public initObj(...params: any[]) {
        this.actorList = {}
        this.mLayoutPaths = ["resource/layouts/item/PrizeShowLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setAlignCenter(true, true)
        this.initSkinElemList();
        // this.mLayoutNode.setLayer(gui.GuiLayer.Top)

        this.mLayoutNode.verticalCenter = -100

        var elemInfo: any[] = [
            { ["name"]: "return_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
          
        ];

        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let group = <eui.Group>this.mElemList["scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        super.onShow();
        this.mLayoutNode.visible = true;
        this.refreshFrame()
    }

    public onHide(): void {
        super.onHide();
        
        this.mLayoutNode.visible = false;

        let list = []
        for (let name in this.actorList) {
            let actor = this.actorList[name]

            JsUtil.arrayInstert(list, name)
        }

    }

    initItemWindow(window) {
		let name = window.name
        for (let i = 0; i < 4; i++) {
            this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox" + i, 40 + 110 * i, 10, window)
        }
        
	}

	refreshItemWindow(window, config) {
		let name = window.name

        for (let i = 0; i < 4; i++) {
            if (config[i]) {
                let v = config[i]
                this.mElemList[name + "itemBox" + i].setVisible(true)
                if(v[2]){
                    this.mElemList[name + "itemBox" + i].updateByEntry(v[0], v[1],v[2])
                }else{
                    this.mElemList[name + "itemBox" + i].updateByEntry(v[0], v[1])
                }
                this.mElemList[name+"itemBox" + i].playerEffect(effectIndex.QiangHua)
            } else {
                this.mElemList[name + "itemBox" + i].setVisible(false)
            }
        }
	}

    refreshFrame() {
        let list =  AnalyPrizeFormat(this.itemList)

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
		this.controlDataTable = {}
		for (let k = 0; k < list1.length; k++) {
			let v = list1[k]
			let [window, flag] = scroll.getItemWindow(k, group.width - 3, 100, 3, 5, 0)

            if (flag == true) {
			    this.initItemWindow(window)
            }
			this.refreshItemWindow(window, v)
		}
    }

    showAndSetData(itemList){
        this.itemList = itemList
        this.showWnd()
    }
}