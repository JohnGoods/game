class TapTipsFrame extends BaseWnd {

	MaxCount: number;

	mFrameInfoList: any;
	lastIndex: number;

	public initObj(...params: any[]) {
		//this.mLayoutPaths = ["resource/layouts/common/TapTipsLayout.exml"];
		this.MaxCount = 10;

		this.mFrameInfoList = {};
		this.lastIndex = -1;

	}

	public onLoad(): void {
		//this.mLayerNodeList.push(this.mLayoutNode);


		for (var i = 0; i < this.MaxCount; i++) {
			var mElemList = {}

			let node: gui.LayoutNode = this.createLayoutNode();
			node.setLayer(gui.GuiLayer.Top);
			node.width = 620;
			node.height = 40;
			// node.skinName = this.mLayoutPaths[0];
			node.visible = false;

			let elemInfo = [
				//{["name"] : "msg",  ["title"] : null,  ["event_name"] : null, ["fun_index"] : null},
				{ ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["image"]: "ty_huoDeDi01", ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: null, ["fun_index"]: null },
				{ ["index_type"]: eui.Image, ["name"]: "icon", ["image"]: "item_30001", ["w"]: 40, ["h"]: 40, ["x"]: 10, ["event_name"]: null, ["fun_index"]: null },
				{ ["index_type"]: gui.RichDisplayer, ["name"]: "msg", ["title"]: "", ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.white, ["w"]: 620, ["h"]: 40, ["event_name"]: null, ["fun_index"]: null },
			];
			UiUtil.createElem(elemInfo, node, mElemList, this);

			node.touchEnabled = false;
			node.touchChildren = false


			mElemList["msg"].setAlignFlag(gui.Flag.H_CENTER + gui.Flag.V_CENTER);
			// mElemList["msg"].horizontalCenter = 0
			mElemList["msg"].verticalCenter = 0
			mElemList["icon"].verticalCenter = 0

			this.mFrameInfoList[i] = { msg: mElemList["msg"], icon: mElemList["icon"], node: node, time: 0 };
		}



	}

	public onUnLoad(): void {
	
	}

	public onShow(): void {

	}

	public onHide(): void {

	}

	addDropItemMsg(info): void {
		let entryId = info[0]
		let itementry = GameConfig.itemConfig[entryId]
		if (itementry == null) {
			return
		}

		let quality = opEquipQuality.green
		let iconname = GetItemIcon(entryId)
		if(itementry.type == opItemType.ROLE_ALLSMAN){
			iconname = GetFaBaoIcon(entryId)
		}
		let count = 1
		if (itementry.type == opItemType.COMMON_EQUIP || itementry.type == opItemType.ROLE_EQUIP || itementry.type == opItemType.ROLE_ALLSMAN) {
			quality = info[2]
		} else if (itementry.subtype == opItemSubType.ITEM_VIRTUAL_UNIT) {
			quality = opEquipQuality.green
			count = info[1]
		} else {
			count = info[1]
		}

		let colorname = GetQualityColorStr(quality)

        //获得灰色装备，灰色法宝这些显示颜色要改成白色
		// if (quality <= opEquipQuality.gray) {
		// 	colorname = "white"
		// }

		let msg = String.format(Localize_cns("ITEM_DROP_COLOR"), colorname, itementry.name, count)
		this._startNode(msg, iconname)
	}

	addGetItemMsg(info): void {
		let entryId = info[0]					//[entryId, count, quality]
		let itementry = GameConfig.itemConfig[entryId]
		if (itementry == null) {
			return
		}

		let quality = opEquipQuality.green
		let iconname = GetItemIcon(entryId)
		if(itementry.type == opItemType.ROLE_ALLSMAN){
			iconname = GetFaBaoIcon(entryId)
		}
		let count = 1
		if (itementry.type == opItemType.COMMON_EQUIP || itementry.type == opItemType.ROLE_EQUIP || itementry.type == opItemType.ROLE_ALLSMAN) {
			quality = info[2]
			count = info[1] || 1
		} else if (itementry.subtype == opItemSubType.ITEM_VIRTUAL_UNIT) {
			quality = opEquipQuality.green
			count = info[1]
		} else {
			quality = itementry.quality
			count = info[1]
		}
		let colorname = GetQualityColorStr(quality)

		//获得灰色装备，灰色法宝这些显示颜色要改成白色
		// if (quality <= opEquipQuality.gray) {
		// 	colorname = "white"
		// }

		let msg = String.format(Localize_cns("ITEM_GET_COLOR"), colorname, itementry.name, count)
		this._startNode(msg, iconname)
	}

	_startNode(msg: string, iconname: string): void {
		var startY = 120;
		let nowTime = core.TimeStamp.CurrentTime;


		let showCount = 0;
		for (var i = 0; i < this.MaxCount; i++) {
			let info = this.mFrameInfoList[i];
			if (info.node.visible && nowTime - info.time < 500) {
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

		info.msg.width = 600

		let spaceX = 10;

		AddRdContent(info.msg, msg, "ht_22_cc_stroke", "white", 5);
		AdjustRdContentViewW(info.msg, 10)
		AdjustRdContentViewH(info.msg, 40)
		if (iconname == null || iconname == "") {
			info.icon.visible = false
			info.msg.x = spaceX
			UiUtil.setWH(info.node, info.msg.width + spaceX*2, info.msg.height + 10)
		} else {
			let iconW = info.icon.width;

			info.icon.visible = true
			info.icon.source = iconname
			info.icon.x = spaceX;
			info.msg.x = spaceX + iconW;
			// info.msg.x = 50
			UiUtil.setWH(info.node, info.msg.width + iconW + spaceX* 2 , info.msg.height + 10)
		}
		//info.msg.text = msg;
		//info.msg.width = 620;



		let endY = startY - (80 + (showCount) * (info.node.height - 5))
		egret.Tween.removeTweens(info.node);
		egret.Tween.get(info.node).to({ verticalCenter: endY }, 800).wait(500).to({ alpha: 0 }, 300).call(this.onLayoutNodeComplete, this, [info]);

		// var topIndex = this.lastIndex
		// for(var i = 1; i <= this.MaxCount - 1; i++){
		// 	topIndex--;
		// 	if( topIndex < 0){
		// 		topIndex = this.MaxCount - 1;
		// 	}

		// 	var node:gui.LayoutNode = this.mFrameInfoList[topIndex].node;
		// 	if(node.visible){
		// 		node.horizontalCenter = 0
		// 		node.verticalCenter = -45 * i - startY;
		// 	}
		// }
	}

	addNewMsg(msg: string): void {
		this._startNode(msg, null)
	}


	onLayoutNodeComplete(info: any) {
		//TLog.Debug("onOneNodeComplete")
		info.node.visible = false;
	}
}