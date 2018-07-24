// TypeScript file

class HousePrizeShowFrame extends BaseWnd {
    scroll: UIScrollList;
    public initObj(...params: any[]) {
        // this.actorList = {}
        this.mLayoutPaths = ["resource/layouts/item/HousePrizeShowLayout.exml"]

    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo: any[] = [
            { ["name"]: "return_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGetClicked },
        ];

        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
        let group = <eui.Group>this.mElemList["scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
        this.mElemList["exp_rd"].setAlignFlag(gui.Flag.CENTER_CENTER)
        
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.refreshFrame()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        let list = []
    }

    refreshFrame() {
        let house = getSaveRecord(opSaveRecordKey.hourseExp)
        let list = house.hourseExp
        let exp = house.totalExp
        let group = <eui.Group>this.mElemList["scroll_group"]
        let scroll = this.scroll
		scroll.clearItemList();
		for (let k = 0; k < list.length; k++) {
			let v = list[k]
			let [window, flag] = scroll.getItemWindow(k, 450, 70, 0, 0, 0)
            if (flag == true) {
			    this.initItemWindow(window)
            }
			this.refreshItemWindow(window, v)
		}

        let str = String.format(Localize_cns("SANSHENG_TXT39"),exp)
        AddRdContent(this.mElemList["exp_rd"],str, "ht_20_cc", "zongse")
        
    }

    initItemWindow(window) {
		let name = window.name
        let Info: any = [
               //背景
			   	{ ["index_type"]: eui.Group, ["name"]: name+"bg" , ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: 494, ["h"]: 70},
                { ["index_type"]: eui.Label, ["name"]: name + "time", ["parent"]: name + "bg", ["title"]: "", ["font"]: "ht_20_lc", ["color"]: gui.Color.zongse, ["x"]: 20, ["y"]: 10, ["w"]: 430, ["h"]: 25, ["messageFlag"]: true },
				{ ["index_type"]: gui.RichDisplayer, ["name"]: name + "rd",["parent"]: name + "bg", ["title"]: "", ["font"]: "ht_22_cc", ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 38, ["w"]: 430, ["h"]: 25, ["messageFlag"]: true },

                { ["index_type"]: gui.Grid9Image, ["name"]: name+"line", ["parent"]: name+"bg", ["title"]: null, ["font"]: null, ["image"]: "cz_uiLine02", ["color"]: null, ["x"]: 5, ["y"]: 68, ["w"]: 440, ["h"]:2 , },
                ]	
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
	}

	refreshItemWindow(window, data) {
		let name = window.name
        let time = TimestampToTime(data.time)
        this.mElemList[name+"time"].text = time
        AddRdContent(this.mElemList[name+"rd"],Localize_cns("SANSHENG_TXT38"), "ht_20_cc", "zongse")
	}

    onGetClicked(){
        RpcProxy.call("C2G_HourseExp")
        this.hideWnd()
    }

}