/*
作者:
    ljq
	
创建时间：
   2018.03.21(周三)

意图：
   商店框通用控件
   
公共接口：
   
*/
class UIFaBaoBox extends TClass {

	mParentNode: eui.Component;
	name: string;
	mElemList: any;
	parentWnd: any;

	rootWnd: any;

	bEnable: boolean;
	logicItem: Item;
	enableIcon: boolean

	itemTipsFunc: Function;
	itemTipsObj: any;
	userData: any;

	shopEntry :number
	index :number

	public initObj(...args: any[]): void {
		this.mParentNode = args[0]
		this.name = args[1]
		let x = args[2]
		let y = args[3]

		let parentWnd = args[4]
		let scale = 1
		let w = 128
		let h = 128
		if (args[5]) {
			scale = args[5]
			w = w * scale
			h = h * scale
		}
		this.rootWnd = null
		
		this.mElemList = {}
		let itemBoxName = this.name;
		let mElemInfo = [
			{ ["index_type"]: eui.Group, ["name"]: this.name, ["title"]: "", ["font"]:"ht_20_lc",["image"]: "", ["color"]: gui.Color.ublack, ["x"]: x, ["y"]: y, ["w"]: w, ["h"]: h,["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onClickBox},
			{ ["index_type"]: eui.Image, ["name"]: "item_quality_"+ this.name, ["parent"]:this.name, ["title"]: "", ["font"]:"ht_20_cc",["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: 128, ["h"]: 128, ["messageFlag"] : true},
			{ ["index_type"]: eui.Image, ["name"]: "item_sprite_"+ this.name, ["parent"]:this.name, ["title"]: "", ["font"]:"ht_20_cc",["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: 128, ["h"]: 128, ["messageFlag"] : true},
		]
		UiUtil.createElem(mElemInfo, this.mParentNode, this.mElemList, this, parentWnd)


		this.rootWnd = this.mElemList[itemBoxName]
        

		//逻辑数据
		this.bEnable = true
		this.logicItem = null
		this.enableIcon = true

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

    updateByEntry(entry, quality?){ 
        quality = quality || opEquipQuality.gray
        let item = Item.newObj(entry, quality )
        this.updateByItem(item)
    }


    updateByItem(item : Item){
        this.logicItem = item
        let icon = GetFaBaoIcon(item.entryId)
        let bg = GetFaBaoQualutyImage(item.getProperty("quality"))

        this.mElemList["item_sprite_"+ this.name].source = icon
        this.mElemList["item_quality_"+ this.name].source = bg
    }

	//点击事件
	onClickBox(args:egret.Event){
        if (!this.bEnable) {
			return
		}

		if (this.itemTipsFunc) {
			//返回true，表示拦截不查看物品信息
			if (this.itemTipsFunc.call(this.itemTipsObj, this.logicItem, this.userData, args)) {
				return
			}
		}

		let wnd : FaBaoItemTipsFrame = WngMrg.getInstance().getWindow("FaBaoItemTipsFrame")
		wnd.onShowWnd(this.logicItem, false)	
	}

    setItemTipsListner(func, obj, userData) {
		this.itemTipsFunc = func
		this.itemTipsObj = obj
		this.userData = userData
	}
}