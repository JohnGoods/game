/*
作者:
    yangguiming
	
创建时间：
   2017.02.4(周三)

意图：
   物品框通用控件
   
公共接口：
   
*/

class UIItemBox extends TClass {
	mParentNode: eui.Component;
	name: string;
	mElemList: any;
	parentWnd: any;

	rootWnd: any;

	bEnable: boolean;
	logicItem: Item;
	enableIcon: boolean

	needCount: number
	frameList: any;
	isShowFrontFrame: boolean;

	bgImage: any;

	itemTipsFunc: Function;
	itemTipsObj: any;
	userData: any;

	bEquipInfoShow: boolean;

	callback: Function;
	obj: any;
	userParam: any;

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
		let bgImg = "ty_zhuangBeiBg01"
		this.bEquipInfoShow = true;

		this.mElemList = {}
		let itemBoxName = this.name;
		let mElemInfo = [
			{ ["index_type"]: eui.Group, ["name"]: itemBoxName, ["x"]: x, ["y"]: y, ["w"]: w, ["h"]: h, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
			{ ["index_type"]: gui.Grid9Image, ["name"]: this.name + "item_bg", ["parent"]: itemBoxName, ["title"]: "", ["font"]: "ht_24_cc", ["image"]: bgImg, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onOpenTips },
			//神魂
			{ ["index_type"]: gui.AnimBox, ["name"]: this.name + "animbox", ["parent"]: itemBoxName, ["color"]: gui.Color.white, ["x"]: 5, ["y"]: 5, ["w"]: 70, ["h"]: 70, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },

			{ ["index_type"]: eui.Image, ["name"]: this.name + "icon", ["parent"]: itemBoxName, ["title"]: "", ["font"]: "ht_24_cc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["touchEnabled"]: false, },
			{ ["index_type"]: eui.Label, ["name"]: this.name + "count", ["parent"]: itemBoxName, ["title"]: "", ["font"]: "ht_13_rc_stroke", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: h - 21, ["w"]: w - 5, ["h"]: 18, ["touchEnabled"]: false, },

			//通用装备
			{ ["index_type"]: gui.RichDisplayer, ["name"]: this.name + "name", ["parent"]: itemBoxName, ["titile"]: "", ["font"]: "ht_16_cc_stroke", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 8 * scale, ["y"]: 55 * scale, ["w"]: w - 8 * scale, ["h"]: 30 * scale, ["messageFlag"]: true },
			{ ["index_type"]: gui.RichDisplayer, ["name"]: this.name + "stage", ["parent"]: itemBoxName, ["title"]: "", ["font"]: "ht_16_cc_stroke", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 8 * scale, ["y"]: 6 * scale, ["w"]: w - 8 * scale, ["h"]: 30 * scale, ["messageFlag"]: true },

			//add
			{ ["index_type"]: eui.Image, ["name"]: this.name + "_add", ["parent"]: this.name, ["image"]: "ty_jinJieShu01", ["font"]: "ht_20_cc", ["x"]: 0, ["y"]: 0, ["w"]: 80, ["h"]: 80, ["messageFlag"]: true },

			{ ["index_type"]: gui.AnimBox, ["name"]: this.name + "_actorview", ["parent"]: itemBoxName, ["x"]: -50, ["y"]: -50, ["w"]: 160, ["h"]: 160, ["event_name"]: gui.AnimBox.AnimEndEvent, ["fun_index"]: this.animEnd, ["messageFlag"]: true },
		]
		UiUtil.createElem(mElemInfo, this.mParentNode, this.mElemList, this, parentWnd)

		//this.mElemList[this.name + "actor_view"] = UIActorView.newObj(this.mParentNode, this.name + "actor_view", w / 2, 80, this.mElemList[itemBoxName])

		this.rootWnd = this.mElemList[itemBoxName]

		//装备
		AddRdContent(this.mElemList[this.name + "name"], "", "ht_16_cc_stroke", "white")
		AddRdContent(this.mElemList[this.name + "stage"], "", "ht_16_cc_stroke", "white")

		//this.mElemList[this.name + "actor_view"].setVisible(false)
		let actorview: gui.AnimBox = this.mElemList[this.name + "_actorview"]
		actorview.visible = false

		this.mElemList[this.name + "_add"].visible = false

		let t: gui.AnimBox = this.mElemList[this.name + "animbox"]
		t.visible = false
		//t.touchChildren = false

		//逻辑数据
		this.bEnable = true
		this.logicItem = null
		this.enableIcon = true

		this.needCount = null
		this.frameList = null
		this.isShowFrontFrame = false
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


	updateByEntry(entryId, count?, quality?, addNum?, deadline?) {

		let itemRefInfo = ItemSystem.getInstance().getItemTemplateInfo(entryId)
		if (itemRefInfo == null) {
			this.updateByItem(null)
			return
		}
		let item = Item.newObj()
		item.initWithRef(itemRefInfo)

		if (count != null && count >= 0) {
			item.propertyInfo.previewCount = count
		}

		if (quality != null) {
			item.propertyInfo.quality = quality
			item.entryId = entryId
		}

		if (addNum != null) {
			let check = (itemRefInfo.type || 1) == opItemType.ROLE_SHENHUN
			if (check) {
				item.propertyInfo.advanceLevel = addNum
			} else {
				item.propertyInfo.add_num = addNum
			}

		}

		if (deadline != null) {
			item.propertyInfo.lost_effect_time = deadline
		}

		this.updateByItem(item)
	}


	updateByItem(itemInfo) {

		this.logicItem = itemInfo

		this._updateInfo();
	}

	updateByItemId(itemId) {

		this.logicItem = ItemSystem.getInstance().getItemLogicInfoByID(itemId)

		this._updateInfo();
	}

	playerEffect(effct, obj?, callback?, userData?) {
		//let actorview = <UIActorView>this.mElemList[this.name + "actor_view"]
		//actorview.setVisible(true)
		this.obj = obj
		this.callback = callback
		this.userParam = userData

		let actorview: gui.AnimBox = this.mElemList[this.name + "_actorview"]
		actorview.visible = true
		actorview.setAnimName("heCheng")
		actorview.play()
		//let actor: Actor = actorview.updateByOnceEffect(effectIndex.QiangHua)
		// let listener: any = {
		// 	this_index: this, function_index: function (args) {
		// 		if (args == "end") {
		// 			actorview.clearView()
		// 			actorview.setVisible(false)
		// 			if (obj && callback) {
		// 				callback.call(obj, userData)
		// 			}
		// 		}
		// 	}, notify_name: "end"
		// }
		// actor.addAnimListener(listener)
	}

	animEnd() {
		let actorview: gui.AnimBox = this.mElemList[this.name + "_actorview"]
		actorview.pause()
		actorview.visible = false
		if (this.obj && this.callback) {
			this.callback.call(this.obj, this.userParam)
		}
	}

	checkMaterialAndCash(materialInfo, needCash) {
		let bResult = true
		for (let i in materialInfo) {
			let v = materialInfo[i]

			let entryId = v[0]
			let count = v[1]

			if (ItemSystem.getInstance().getItemCount(entryId) < count) {
				bResult = false
				break
			}
		}

		if (bResult) {
			let curCash = GetHeroProperty("funds") || 0
			bResult = curCash >= needCash
		}

		return bResult
	}

	setEquipInfoVisible(b: boolean) {
		this.bEquipInfoShow = b;
	}

	refreshEquip() {
		let itemBGLabel = this.mElemList[this.name + "item_bg"] //显示品质
		let itemIconLabel = this.mElemList[this.name + "icon"] //显示图标
		let itemCountLabel = this.mElemList[this.name + "count"] //显示数量

		let isEquip = this.logicItem.isEquip()
		if (isEquip) {
			itemCountLabel.text = ("")
		}

		let addIamge: eui.Image = this.mElemList[this.name + "_add"] //强化+

		let type = this.logicItem.getRefProperty("type")
		let checkShenhun = type == opItemType.ROLE_SHENHUN
		addIamge.visible = checkShenhun
		let animBox: gui.AnimBox = this.mElemList[this.name + "animbox"]
		animBox.visible = checkShenhun
		if (checkShenhun) {
			let plus_n = this.logicItem.getProperty("enhanceLevel") || 0
			if (plus_n < 0 || plus_n > optionShenHun.maxLevel) plus_n = 0
			addIamge.visible = plus_n != 0
			if (plus_n != 0) {
				let source = "ty_jinJieShu"
				if (plus_n < 10) {
					source += 0
				}
				addIamge.source = source + plus_n
			}
			let quality = this.logicItem.getProperty("quality") || 1
			let name = getShenHunAnimName(quality)


			animBox.setAnimName(name)
			animBox.setLoop(true)
		}

		let bPreview = this.logicItem.id < 0
		if (bPreview && (this.logicItem.getRefProperty("type") != opItemType.COMMON_EQUIP)) {
			return
		}

		if (isEquip) {
			if (this.bEquipInfoShow == false)
				return;

			this._updateEquipInfo()
		}
	}

	_updateInfo() {
		let itemBGLabel = this.mElemList[this.name + "item_bg"] //显示品质
		let itemIconLabel = this.mElemList[this.name + "icon"] //显示图标
		let itemCountLabel = this.mElemList[this.name + "count"] //显示数量

		UiUtil.grayComponent(itemIconLabel, false)

		itemIconLabel.enabled = (this.enableIcon)
		AddRdContent(this.mElemList[this.name + "name"], "", "ht_16_cc_stroke", "white")
		AddRdContent(this.mElemList[this.name + "stage"], "", "ht_16_cc_stroke", "white")
		let entryId = null
		if (this.logicItem) {
			entryId = this.logicItem.entryId
		}

		if (entryId) {
			let iconName = GetItemIcon(entryId)

			let beiBaoCount = 0
			if (this.logicItem && this.logicItem.id >= 0) {
				beiBaoCount = this.logicItem.getProperty("count")
			}

			let itemCount = this.logicItem.getProperty("previewCount")
			itemCount = itemCount ? itemCount : beiBaoCount

			let quality = this.logicItem.getProperty("quality")
			let qualityImage = GetItemQualityImage(entryId, quality)

			itemBGLabel.source = (qualityImage)
			itemIconLabel.source = (iconName)
			itemCountLabel.text = (itemCount > 1 ? MakeLongNumberShort(itemCount) : "")

			this.refreshEquip()

		} else {

			let bgImage = this.bgImage || "ty_zhuangBeiBg01"

			itemBGLabel.source = (bgImage)
			itemIconLabel.source = ("")
			itemCountLabel.text = ("")
			this.mElemList[this.name + "_add"].visible = false
			this.mElemList[this.name + "animbox"].visible = false
		}

	}

	_updateEquipInfo() {
		let nameRd = this.mElemList[this.name + "name"]
		let stageRd = this.mElemList[this.name + "stage"]

		let equipType = this.logicItem.getRefProperty("type")
		if (equipType == opItemType.COMMON_EQUIP) {
			let stage = this.logicItem.getRefProperty("uselevel")
			let name = this.logicItem.getRefProperty("title")
			let level = this.logicItem.getProperty("add_num") || 0

			AddRdContent(nameRd, name, "ht_16_cc_stroke", "white")
			let str = "#yellow" + stage + Localize_cns("PET_TXT10")
			if (level > 0) {
				str = str + "#orange+" + level
			}
			AddRdContent(stageRd, str, "ht_16_cc_stroke", "white")
		}
	}

	////////////////////////////////////////////////////////////////////////
	//先调用update才能调用以下函数

	setCount(itemCount) {
		let itemCountLabel = this.mElemList[this.name + "count"] //显示数量
		itemCountLabel.text = (itemCount)
		let color = gui.Color.white
		itemCountLabel.textColor = color
	}

	setNeedCount(needCount) {
		if (this.logicItem == null) {
			return
		}
		let entryId = this.logicItem.entryId
		let itemCount = ItemSystem.getInstance().getItemCount(entryId)

		this.needCount = needCount

		let itemCountLabel = this.mElemList[this.name + "count"] //显示数量
		itemCountLabel.text = (itemCount + "/" + this.needCount)

		let color = gui.Color.lime
		if (itemCount < this.needCount) {
			color = gui.Color.white
		}
		itemCountLabel.textColor = color
	}

	justSetNeedCount(needCount) {
		if (this.logicItem == null) {
			return
		}
		let entryId = this.logicItem.entryId
		let itemCount = ItemSystem.getInstance().getItemCount(entryId)

		this.needCount = needCount

		let itemCountLabel = this.mElemList[this.name + "count"] //显示数量
		itemCountLabel.text = (this.needCount)

		let color = gui.Color.lime
		if (itemCount < this.needCount) {
			color = gui.Color.white
		}
		itemCountLabel.textColor = color
	}

	setItemTipsListner(func, obj, userData) {
		this.itemTipsFunc = func
		this.itemTipsObj = obj
		this.userData = userData
	}

	showEnable(b) {
		this.enableIcon = b
	}

	setEnable(b) {
		this.mElemList[this.name + "icon"].enabled = b
	}

	setItemHintEnable(b) {
		this.bEnable = b
	}

	setDefaulImage(imageName) {
		this.bgImage = imageName
	}

	setCountVisible(visible) {
		this.mElemList[this.name + "count"].visible = visible
	}

	setCountText(num, maxNum) {
		let text = num + "/" + maxNum
		this.mElemList[this.name + "count"].text = text
	}

	setIconImageGray(b: boolean) {
		let itemIconLabel = this.mElemList[this.name + "icon"] //显示图标
		UiUtil.grayComponent(itemIconLabel, b)
	}

	resetFunEquip(index) {
		let itemBGLabel = this.mElemList[this.name + "item_bg"] //显示品质
		let itemIconLabel = this.mElemList[this.name + "icon"] //显示图标
		let itemCountLabel = this.mElemList[this.name + "count"] //显示数量

		itemBGLabel.source = "ty_zhuangBeiBg01"
		itemIconLabel.source = "item_1000" + (tonumber(index) + 1)
		UiUtil.grayComponent(itemIconLabel, true)
		itemCountLabel.text = ""

		AddRdContent(this.mElemList[this.name + "name"], "", "ht_16_cc_stroke", "white")
		AddRdContent(this.mElemList[this.name + "stage"], "", "ht_16_cc_stroke", "white")

		this.itemTipsFunc = null
		this.itemTipsObj = null
		this.userData = null

		this.logicItem = null
	}

	////////////////////////////////////////////////////////////////////////
	//物品提示
	onOpenTips(args: egret.TouchEvent) {
		//是否弹获取途径
		// if (this.logicItem) {
		// 	let entryId = this.logicItem.entryId
		// 	let itemCount = ItemSystem.getInstance().getItemCount(entryId)
		// 	//不足
		// 	if (this.needCount && this.needCount > itemCount) {
		// 		//道具获取途径
		// 		let wnd: QuickGainFrame = WngMrg.getInstance().getWindow("QuickGainFrame")

		// 		let wndName = this.mParentNode.name;

		// 		let frameList = []
		// 		if (this.frameList) {
		// 			frameList = this.frameList
		// 		} else {
		// 			frameList = [wndName]
		// 		}

		// 		let itemConfig: any = [["item", entryId], frameList]
		// 		wnd.showQuickGainFrame(itemConfig)
		// 		return
		// 	}
		// }

		if (!this.bEnable) {
			return
		}


		if (this.itemTipsFunc) {
			//返回true，表示拦截不查看物品信息
			if (this.itemTipsFunc.call(this.itemTipsObj, this.logicItem, this.userData, args)) {
				return
			}
		}

		if (this.logicItem) {
			//使用物品
			if (this.logicItem.id > 0) {
				let action = this.logicItem.getRefProperty("action")
				let check = ItemSystem.getInstance().checkItemCanUse(this.logicItem.id)
				if (action && check) {
					ItemSystem.getInstance().useLogicItem(this.logicItem)
					return
				}
			}

			TLog.Debug("UIItemBox.onOpenTips", this.logicItem.id, this.logicItem.propertyInfo)
			ItemSystem.getInstance().showItemTips(this.logicItem)
		}
	}

	setFrameList(frameList, isShowFrontFrame) {
		this.frameList = frameList
		this.isShowFrontFrame = isShowFrontFrame || false
	}
}