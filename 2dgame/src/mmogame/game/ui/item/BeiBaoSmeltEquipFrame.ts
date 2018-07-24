// TypeScript file
class BeiBaoSmeltEquipFrame extends BaseWnd {
    
    scroll: UIScrollList
    controlData 
    sendList 

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/item/BeiBaoSmeltEquipLayout.exml"]
		this.sendList = []
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.mLayoutNode.width = 640
        this.mLayoutNode.height = 800
        this.setAlignCenter(true, true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            
            { ["name"]: "btn_sure", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSureClick },
        ];
		 UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
		

        let group : eui.Group = this.mElemList["scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
	}

	public onUnLoad(): void {

	}
	public onShow(): void {
       // RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true);
        this.onRefresh();
	}

	public onHide(): void {
        //UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = false;
		//this.mLayoutNode.setDoModal(false);
        this.sendList = []

	}

    onRefresh(){

        let equipItemList = ItemSystem.getInstance().getSmeltRoleEquipList()
        let equipItemList2 = ItemSystem.getInstance().getSmeltCommonEquipList()
		for (let i in equipItemList2) {
			let item = equipItemList2[i]
            JsUtil.arrayInstert(equipItemList, item)
        }
        
        let list = splitListByCount(equipItemList, 3) 

        let scroll = this.scroll
        scroll.clearItemList()
        this.controlData = {}
        this.sendList = []
        for(let k = 0; k < size_t(list); k++){
            let itemList = list[k]
            let [window, flag] = scroll.getItemWindow(k, 510, 200, 0, 0)
            if (flag == true) {
                this.initWindow(window)
            }
            this.refreshWindow(window, itemList, k)
        }

        scroll.refreshScroll(true, true)
        scroll.restoreViewXY()

        this.refreshCount()

    }

    initWindow(window){
        let name = window.name
        for(let k = 0; k < 3; k++){
            let x = 180*k
            let y = 0
            let mElemInfo: any = [
                { ["index_type"]: eui.Group, ["name"]: name + "_group" + k, ["image"]: "", ["x"]: x, ["y"]: y, ["w"]: 150, ["h"]: 200, },
                { ["index_type"]: gui.Grid9Image, ["name"]: name + "_equip_bg" + k,["parent"]:name + "_group" + k, ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 150, ["h"]: 200, },
                { ["index_type"]: eui.CheckBox, ["name"]: name + "_btn" + k, ["parent"]:name + "_group" + k,["title"]: null , ["image"]: "ty_xuanZheDi01",["image_down"]: "ty_xuanZhe01",["x"]: 105, ["y"]: 0, ["w"]: 45, ["h"]: 46,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSelectClick },
                { ["index_type"]: eui.Label, ["name"]: name + "_fen" + k,["parent"]:name + "_group" + k, ["title"]:"", ["font"]: "ht_24_cc", ["image"]: null, ["color"]: "ublack", ["x"]: 0, ["y"]: 163, ["w"]: 150, ["h"]: 24,["messageFlag"]: true },
                    
            ];
            UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window );
            
            this.mElemList[name + "equipBox" + k] = UIItemBox.newObj(this.mLayoutNode, name + "equipBox" + k, 35, 60 ,this.mElemList[name + "_group" + k])
        }
    }

    refreshWindow(window, itemlist, index){
        let name = window.name
        for(let k = 0; k < 3; k++){
            let item  = itemlist[k]
            if(item){
                let dataKey = tostring(index) + k
                this.controlData[dataKey] = item
                this.mElemList[name + "equipBox" + k].updateByItem(item)
                let force = item.force
                this.mElemList[name + "_fen" + k].text = Localize_cns("ITEM_TXT37") + force
                this.mElemList[name + "_group" + k].visible = true
                this.mElemList[name + "_btn" + k].selected = false
            }else{
                this.mElemList[name + "_group" + k].visible = false
            }
        }
    }

    refreshCount(){
        let count = size_t(this.sendList)
        let countStr = count + "/" + 9
        AddRdContent(this.mElemList["rd_count"], countStr, "ht_20_lc", "lime")
    }

    ///-----------
    onSureClick(){
        let wnd :BeiBaoSmelteFrame = WngMrg.getInstance().getWindow("BeiBaoSmelteFrame")
        wnd.setSendList(this.sendList)
        this.hideWnd()
    }

    onSelectClick(args : egret.TouchEvent){
        let name = args.target.name;
        let rd_btn : eui.RadioButton = this.mElemList[name]
	    let index  = name.replace(/[^0-9]/ig, ""); 
        if(size_t(this.sendList) == 9) return 
        let item : Item = this.controlData[index]
        if(item == null) return 

        if(rd_btn.selected == true){
            if(table_isExist(this.sendList,item) == false){
                table_insert(this.sendList, item)
            }
        }else{
            if(table_isExist(this.sendList,item) == true){
                table_remove(this.sendList, item)
            }
        }

        this.refreshCount()
    }
}