class ItemGoldEquipFrame extends BaseWnd {
    itemList
   
    MaxCount: number;

	mFrameInfoList: any;
	lastIndex: number;

    public initObj(...params: any[]) {
        this.MaxCount = 4;

		this.mFrameInfoList = {};
		this.lastIndex = -1;
        this.itemList = []
    }
    public onLoad(): void {

        for (var i = 0; i < this.MaxCount; i++) {
			var mElemList = {}

			let node: gui.LayoutNode = this.createLayoutNode();
			node.setLayer(gui.GuiLayer.Top);
			node.width = 600;
			node.height = 141;
			// node.skinName = this.mLayoutPaths[0];
			node.visible = false;
            //let name = "group_" + i
			var elemInfo = [
                { ["index_type"]: eui.Group, ["name"]: "group", ["image"]: "", ["x"]: 0, ["y"]: -10, ["w"]: 620, ["h"]: 141, },
                { ["index_type"]: eui.Image, ["name"]: "bg", ["parent"]: "group", ["image"]: "ty_hdZhuangBeiDi01", ["x"]: 0, ["y"]: 0, ["w"]: 620, ["h"]: 141, },
                { ["index_type"]: eui.Label, ["name"]: "name", ["parent"]: "group", ["image"]: "", ["font"]: "ht_24_lc_stroke", ["color"]: gui.Color.white, ["x"]: 351, ["y"]: 41, ["w"]: 120, ["h"]: 24, },
                { ["index_type"]: eui.Label, ["name"]: "lv", ["parent"]: "group", ["image"]: "", ["font"]: "ht_24_lc_stroke", ["color"]: gui.Color.white, ["x"]: 351, ["y"]: 76, ["w"]: 120, ["h"]: 24, },
                
            ];
            UiUtil.createElem(elemInfo, node, mElemList, this)

            mElemList["itemBox"] = UIItemBox.newObj(node, "itemBox", 249, 30, mElemList["group"])

			node.touchEnabled = false;
			node.touchChildren = false

            this.mFrameInfoList[i] = { item: mElemList["itemBox"], name: mElemList["name"], lv : mElemList["lv"],node: node, time: 0 };
		}
    }
    public onUnLoad(): void {
       
    }

    public onShow(): void {
       
    }

    public onHide(): void {
        this.itemList = []
    }

    _startNode(config): void {
		var startY = 400
		let nowTime = core.TimeStamp.CurrentTime;
		let showCount = 0;
		for (var i = 0; i < this.MaxCount; i++) {
			let info = this.mFrameInfoList[i];
			if (info.node.visible && nowTime - info.time < 1000) {
				showCount++;
			}
		}
		if (showCount >= this.MaxCount - 1) {
			return;
		}
        
		this.lastIndex = (this.lastIndex + 1) % this.MaxCount;
		var info = this.mFrameInfoList[this.lastIndex];
		info.node.visible = true;
		info.node.alpha = 1;
		info.node.horizontalCenter = 0;
		info.node.verticalCenter = startY;
		info.time = nowTime;

		//info.msg.width = 640
        let quality = config.getProperty("quality")
        let desStr = config.getName()
        info.name.textColor = GetQualityColorGui(quality)
        info.name.text = desStr

        let text = "Lv." + config.getRefProperty("level")
        if(config.getRefProperty("type") == opItemType.COMMON_EQUIP){
            text = config.getRefProperty("level") + Localize_cns("PET_TXT10")
        }
        info.lv.text = text
        info.item.updateByItem(config)
		
		let endY = startY - (80 + (showCount) * (info.node.height - 5))
		egret.Tween.removeTweens(info.node);
		egret.Tween.get(info.node).to({ verticalCenter: endY }, 600).wait(1000).to({ alpha: 0 }, 300).call(this.onLayoutNodeComplete, this, [info, config]);
        
	}

    addNewMsg(item ): void {
        if(table_isExist(this.itemList, item.entryId)){
            return 
        }
        table_insert(this.itemList, item.entryId)
		this._startNode(item)
	}

    onLayoutNodeComplete(info, config) {
		//TLog.Debug("onOneNodeComplete")
        info.node.visible = false;
        table_remove(this.itemList, config.entryId)
        if(size_t(this.itemList) == 0) this.hideWnd()
		
	}
    
}