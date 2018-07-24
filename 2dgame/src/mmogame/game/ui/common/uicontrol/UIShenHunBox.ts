/*
作者:
    ljq
	
创建时间：
   2018.07.06(周五)

意图：
   神魂框通用控件
   
公共接口：
   
*/
class UIShenHunBox extends TClass {

    mParentNode: eui.Component;
    name: string;
    mElemList: any;
    parentWnd: any;
    rootWnd: any;

    itemTipsFunc: Function;
    itemTipsObj: any;
    userData: any;

    item

    public initObj(...args: any[]): void {
        this.mParentNode = args[0]
        this.name = args[1]
        let x = args[2]
        let y = args[3]

        let parentWnd = args[4]
        let scale = 1
        let w = 80
        let h = 80
        if (args[5]) {
            scale = args[5]
            w = w * scale
            h = h * scale
        }
        this.rootWnd = null
        let bgImg = "ty_uiDi03"
        this.mElemList = {}
        let itemBoxName = this.name;
        let mElemInfo = [
            { ["index_type"]: eui.Group, ["name"]: this.name, ["image"]: "", ["font"]: "ht_20_cc", ["x"]: x, ["y"]: y, ["w"]: 80, ["h"]: 80, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBox},
            { ["index_type"]: eui.Group, ["name"]: this.name + "_item", ["parent"]: this.name, ["image"]: "", ["font"]: "ht_20_cc", ["x"]: 0, ["y"]: 0, ["w"]: 80, ["h"]: 80, ["messageFlag"]: true},
            //add
            { ["index_type"]: eui.Image, ["name"]: this.name + "_add", ["parent"]: this.name , ["image"]: "ty_jinJieShu01", ["font"]: "ht_20_cc", ["x"]: 0, ["y"]: 0, ["w"]: 80, ["h"]: 80, ["messageFlag"]: true},
        ]
        UiUtil.createElem(mElemInfo, this.mParentNode, this.mElemList, this, parentWnd)

        this.mElemList[this.name + "_itemBox"] = UIItemBox.newObj(this.mParentNode, this.name + "_itemBox", 0, 0, this.mElemList[this.name + "_item"])
        this.rootWnd = this.mElemList[itemBoxName]
        this.item = null
    }

    destory() {

    }


    setVisible(b) {
        this.rootWnd.visible = (b)
    }

    setXY(x, y) {
        this.rootWnd.x = x;
        this.rootWnd.y = y;
    }

    createElem(mElemInfo, mElemList, obj, parent?) {
        UiUtil.createElem(mElemInfo, this.mParentNode, mElemList, obj, parent || this.rootWnd)
    }

    updateByEntry(entry, quality, add_num) {
        let itemInfo : any = {}
        itemInfo.entry = entry
        itemInfo.quality = quality
        let item = Item.newObj(itemInfo)
        if(item == null) return
        this.item = item
        this.mElemList[this.name + "_itemBox"].updateByItem(item)
        let add_icon = "ty_jinJieShu0" + add_num || 1
        this.mElemList[this.name + "_add"].source = add_icon
    }

    setCallBack(func, obj, data?) {
        this.itemTipsFunc = func
        this.itemTipsObj= obj
        this.userData = data
    }

    //点击事件
    onClickBox(args: egret.Event) {
        if(this.item == null) return
        if(this.itemTipsFunc && this.itemTipsObj){
            return this.itemTipsFunc.call(this.itemTipsObj, this.item, this.userData)
        }

        let wnd : ShenHunItemTipsFrame = WngMrg.getInstance().getWindow("ShenHunItemTipsFrame")
        wnd.onShowWnd(this.item)
    }
}