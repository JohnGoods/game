class ItemBeiBaoFrame extends BaseWnd {

	tabIndex: number;
//	equipTabIndex: number;
	emptyView: UIEmptyView;
    tabWndList: UITabWndList

	resetList:boolean;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/item/ItemBeibaoLayout.exml"]
		this.tabIndex = -1;
		//this.equipTabIndex = 1
		//this.resetList = true;
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

			//{ ["name"]: "equipFactoryBtn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickEquipFactory },

			//{ ["name"]: "btn_rongjie", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRongjie },

			{ ["name"]: "label_wndName", ["title"]: "", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },

		];
		 UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let tabInfoList = [
			{ name: "equips", wnd: BeiBaoEquipsWindow.newObj(this.mLayoutNode, this) },
			{ name: "props", wnd: BeiBaoPropsWindow.newObj(this.mLayoutNode, this) },
		];
		
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

		//this.emptyView = UIEmptyView.newObj(this.mLayoutNode, 120, 240);

		/*/总分页
		var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
		radioGroup.addEventListener(eui.UIEvent.CHANGE, this.onTabSelected, this);
		for (let i = 1; i <= 4; i++) {
			let radioBtn = <eui.RadioButton>this.mElemList["tab" + i]
			radioBtn.group = radioGroup;
			radioBtn.value = i;
		}

		//装备分页
		var equipRadioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
		equipRadioGroup.addEventListener(eui.UIEvent.CHANGE, this.onEquipTabSelected, this);
		for (let i = 1; i <= 6; i++) {
			let radioBtn = <eui.RadioButton>this.mElemList["tabequip" + i]
			radioBtn.group = equipRadioGroup;
			radioBtn.value = i;
		}

		this.mElemList["list_equip"].itemRenderer = itemRender.BeibaoEquipItem;
		this.mElemList["list_item"].itemRenderer = itemRender.BeibaoItem;
*/
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
	//	RegisterEvent(EventDefine.ITEM_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = true;
		this.tabWndList.setWndVisible(true);
		//this.mLayoutNode.setDoModal(true);
        if (this.tabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}
		//this.refreshFrame();
	}

	public onHide(): void {
		//UnRegisterEvent(EventDefine.ITEM_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);
		//this.mLayoutNode.setDoModal(false);
	}
	
	showWithIndex(index) {
        this.tabIndex = index;
        this.showWnd();
    }
}
/*
	refreshFrame() {
		let radioBtn = <eui.RadioButton>this.mElemList["tab" + this.tabIndex]
		radioBtn.selected = true;

		let viewStack = <eui.ViewStack>this.mElemList["viewStack"]
		if (this.tabIndex == 1) {//装备类
			viewStack.selectedChild = this.mElemList["group_equip"]
			let equipRadioBtn = <eui.RadioButton>this.mElemList["tabequip" + this.equipTabIndex]
			equipRadioBtn.selected = true;
			this.refreshEquipList();
		} else {//道具类			
			viewStack.selectedChild = this.mElemList["group_item"]
			this.refreshItemList();
		}
		this.resetList = false
	}

	getEmptyTxt(itemType) {
		let txt = Localize_cns("EMPTY_DEFAULT_TEXT")
		if (itemType == opItemType.ITEM_TYPE_MAGIC_STONE) {
			txt = Localize_cns("EMPTY_STONE_TEXT")
		} else if (itemType == opItemType.ITEM_TYPE_GOODS) {

		} else if (itemType == opItemType.ITEM_TYPE_ACTIVE_ITEM) {
			txt = Localize_cns("EMPTY_SKILLBOOK_TEXT")
		} else if (itemType == -1) {
			txt = Localize_cns("EMPTY_EQUIP_TEXT");
		}
		return txt
	}

	refreshItemList() {
		let itemTypeList = [-1, opItemType.ITEM_TYPE_MAGIC_STONE, opItemType.ITEM_TYPE_GOODS, opItemType.ITEM_TYPE_ACTIVE_ITEM]

		let itemType = itemTypeList[this.tabIndex - 1]

		let itemList = ItemSystem.getInstance().getItemLogicInfoByType(itemType)
		itemList = ItemSystem.getInstance().getSortItemByMaxLevel(itemList, GetHeroProperty("level"))

		this.emptyView.setVisible(size_t(itemList) == 0)
		this.emptyView.setDescText(this.getEmptyTxt(itemType))

		if (itemList.length > 0) {
			let itemList1 = []
			let itemList2 = []
			let itemList3 = []
			for (let _ = 0; _ < itemList.length; _++) {
				let v = itemList[_]

				if (v.getRefProperty("batch") == 1) {
					JsUtil.arrayInstert(itemList1, v)
				} else if (v.getRefProperty("action") != "") {
					JsUtil.arrayInstert(itemList2, v)
				} else {
					JsUtil.arrayInstert(itemList3, v)
				}
			}
			table_merge(itemList1, itemList2)
			table_merge(itemList1, itemList3)
			itemList = itemList1
		}

		let listbox = <eui.List>this.mElemList["list_item"]
		UiUtil.updateList(listbox, itemList, this.resetList);


	}

	refreshEquipList() {
		let itemTypeList = [opItemType.ITEM_TYPE_WEAPON, opItemType.ITEM_TYPE_MASK, opItemType.ITEM_TYPE_CAP,//武器戒指头盔
		opItemType.ITEM_TYPE_SHOE, opItemType.ITEM_TYPE_NECK, opItemType.ITEM_TYPE_CLOTH//腰带项链衣服
		]

		let itemType = itemTypeList[this.equipTabIndex - 1]

		let curInfo = GetHeroPropertyInfo()
		this.emptyView.setDescText(this.getEmptyTxt(-1))


		let itemList = ItemSystem.getInstance().getItemLogicInfoByType(itemType)
		ItemSystem.getInstance().getSortEquipList(itemList, curInfo.level)
		this.emptyView.setVisible(size_t(itemList) == 0)


		let listbox = <eui.List>this.mElemList["list_equip"]
		UiUtil.updateList(listbox, itemList, this.resetList);

	}



	onTabSelected(event: egret.Event) {
		var radioGroup: eui.RadioButtonGroup = event.target;
		let radiobtn = radioGroup.selection
		this.tabIndex = radiobtn.value;

		this.resetList = true
		this.refreshFrame()
	}


	onEquipTabSelected(event: egret.Event) {
		var radioGroup: eui.RadioButtonGroup = event.target;
		let radiobtn = radioGroup.selection
		this.equipTabIndex = radiobtn.value;

		this.resetList = true
		this.refreshEquipList()
	}


	onClickEquipFactory(args) {
		// let ownerId = this.getOwnerId()
		// let entryId = 0
		// if(ownerId != GetHeroProperty("id") ){
		// 	entryId = ownerId
		// }
		// let index = ProfessionSystem.getInstance().getCurActorIndexWithEntry(entryId)
		let wnd = WngMrg.getInstance().getWindow("EquipFactoryFrame")
		wnd.showWithActorEntry(0)
	}


	// onClickRongjie(event: egret.Event){
	// 	WngMrg.getInstance().showWindow("ItemResolveFrame")
	// }


}


module itemRender {
	export class BeibaoItem extends eui.ItemRenderer {
		itemBox: UIItemBox;
		mElemList: any;

		constructor() {
			super();
			this.mElemList = null;

			this.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
			this.skinName = "resource/layouts/itemRender/BeibaoItemLayout.exml"
		}

		onComplete() {
			this.mElemList = {};
			UiUtil.initElemWithComponent(this, this.mElemList, this)

			var elemInfo = [
				{ ["name"]: "batchUseBtn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBatchUse },
				{ ["name"]: "useBtn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUseItem },

			];
			UiUtil.initElem(elemInfo, this, this.mElemList, this);

			this.itemBox = UIItemBox.newObj(this, "itemBox", 10, 10)
			this.dataChanged();
		}

		protected dataChanged(): void {
			if (this.mElemList == null || this.data == null) {
				return;
			}

			let v = this.data;


			this.itemBox.updateByItem(v)

			let itemName = v.getRefProperty("name")
			this.mElemList["itemName"].text = (itemName)



			let btnCount = 0

			let bBatch = (v.getRefProperty("batch") == 1 && v.getProperty("count") > 1)
			this.mElemList["batchUseBtn"].visible = (bBatch)
			if (bBatch) {
				btnCount = btnCount + 1
			}


			if (v.getRefProperty("action") && v.getRefProperty("action") != "") {
				if (v.getRefProperty("useTitle") && v.getRefProperty("useTitle") != "") {
					this.mElemList["useBtn"].text = (v.getRefProperty("useTitle"))
				} else {
					this.mElemList["useBtn"].text = (Localize_cns("USE"))
				}
				this.mElemList["useBtn"].visible = (true)
				btnCount = btnCount + 1
			} else {
				this.mElemList["useBtn"].visible = (false)
			}


			//设置底图
			this.mElemList["bg2"].visible = false
			if (btnCount == 0) {
				this.mElemList["bg"].source = ("ty_UIDi06")
			} else if (btnCount == 1) {
				this.mElemList["bg"].source = ("ty_UIDi04")
			} else {
				this.mElemList["bg"].source = ("ty_UIDi06")
				this.mElemList["bg2"].visible = true
			}

			if (btnCount == 0) {
				UiUtil.setWH(this.mElemList["itemDes"], 440, 60)
			} else {
				UiUtil.setWH(this.mElemList["itemDes"], 290, 60)
			}

			//AddRdContent(this.mElemList["itemDes"], v.GetShortTips(), "ht_20_cc", "ublack", 2)
			let str = v.GetShortTips()
			if (v.getProperty("deadline_time")) {
				str = str + "#red(" + Localize_cns("ITEM_DEADLINE_TIME") + getFormatTimeEx(v.getProperty("deadline_time")) + ")"
			}
			AddRdContent(this.mElemList["itemDes"], str, "ht_20_cc", "ublack", 2)

		}




		////物品使用
		onUseItem(args) {
			let item = this.data;

			let useTitle = item.getRefProperty("useTitle")
			if (item.getRefProperty("action") == "rename") {
				let deadTime = getSaveRecord(opSaveRecordKey.changeNameTime)
				if (deadTime) {
					let leftTime = deadTime - GetServerTime()
					if (leftTime > 0) {
						MsgSystem.addTagTips(String.format(Localize_cns("CHANGE_NAME_4"), Math.ceil(leftTime / (24 * 3600))))
						return
					}
				}
				let wnd = WngMrg.getInstance().getWindow("ChangeNameFrame")
				wnd.showWithItemId(item.getProperty("id"))
				return
			} else if (item.getRefProperty("action") == "exchangeItem") {
				let effects = item.getRefProperty("effects")
				let sendNum = effects[1]
				if (item.getProperty("count") < sendNum) {
					MsgSystem.addTagTips(String.format(Localize_cns("HECHENGSHULIANG"), sendNum))
					return
				}
				UseItem(item, sendNum, true, useTitle)
			} else {
				UseItem(item, 1, true, useTitle)
			}

		}

		//////////////////////////////////////////////////////////////////////////////////-
		////物品使用
		onBatchUse(args) {

			let item = this.data

			if (item) {
				// let wnd = WngMrg.getInstance().getWindow("ItemBatchUseFrame")
				// wnd.showWithItemInfo(item)

				// let name = item.getName()
				// let itemCount = item.getProperty("count")

				// let t: IDialogCallback = {
				// 	onDialogCallback(result: boolean, userData): void {
				// 		if (result) {
				// 			UseItem(item, itemCount)
				// 		}
				// 	}
				// }
				// MsgSystem.confirmDialog(String.format(Localize_cns("ITEM_ALL_USE_TIPS"), itemCount, name), t)


				let unitNum = 1
				let title = null
				if (item.getRefProperty("action") == "exchangeItem") {
					let effects = item.getRefProperty("effects")
					unitNum = effects[1]
					title = Localize_cns("COMPOSE")
				}
				let wnd = WngMrg.getInstance().getWindow("ItemBatchUseFrame")
				wnd.showWithItemInfo(item, title, null, null, null, unitNum)

			}


		}






	}




	export class BeibaoEquipItem extends eui.ItemRenderer {

		mElemList: any;
		itemBox: UIItemBox;

		constructor() {
			super();
			this.mElemList = {};
               

           
			this.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
			this.skinName = "resource/layouts/itemRender/BeibaoEquipItemLayout.exml"
		}

		onComplete() {
			this.mElemList = {};
			UiUtil.initElemWithComponent(this, this.mElemList, this)

			this.itemBox = UIItemBox.newObj(this, "itemBox", 10, 10)
			this.dataChanged();
		}

		protected dataChanged(): void {
			if (this.mElemList == null || this.data == null) {
				return;
			}

			let roleInfo = GetHeroPropertyInfo()
			let level = roleInfo.level

			let v = this.data;


			this.itemBox.updateByItem(v)

			let itemName = v.getRefProperty("name")
			let itemColor = ItemSystem.getInstance().getFontColorWithEntry(v.entryId)
			this.mElemList["itemName"].text = (itemName)
			this.mElemList["itemName"].textColor = (itemColor)

			this.mElemList["itemScore"].text = (String.format(Localize_cns("EQUIP_SCORE"), v.getProperty("equip_score") || 0))

			let ownerName = v.getOwnerName()
			this.mElemList["itemDes"].text = (ownerName)
			this.mElemList["itemIcon"].visible = (ownerName != "")

			let userLevel = v.getRefProperty("uselevel")
			if (userLevel > 0) {
				this.mElemList["itemLevel"].text = (String.format(Localize_cns("EQUIP_USE_LEVEL2"), userLevel))
			} else {
				this.mElemList["itemLevel"].text = ""
			}


			for (let i = 1; i <= 4; i++) {
				this.mElemList["prop" + i].visible = (false)
			}


			let info = v.getFixedValueInfo()
			let showIndex = 1;
			for (let labelIndex = 0; labelIndex < info.fixedValueStrList.length; labelIndex++) {
				let labelName = info.fixedValueStrList[labelIndex]

				this.mElemList["prop" + showIndex].visible = (true)
				this.mElemList["prop" + showIndex].text = (labelName)
				showIndex = showIndex++;
				if (showIndex > 4) {
					break
				}
			}

		}


	}
}

*/