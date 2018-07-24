/*
作者:
    yangguiming
	
创建时间：
   2017.03.07(周二)

意图：
   物品系统
公共接口：
   
*/

class ItemSystem extends BaseSystem {
	itemList: any;
	storeItemList: any;
	entryItemList: any;

	isInit: boolean;

	skillLevel: number;
	skillData: any;


	resolveLib: any;
	shopSellItemList: any

	onekeyEquipIndex: number;
	onekeyEquipCount: number;

	itemUseList;
	showEasterEggFlag;
	easterEggInfo;

	public initObj(...args: any[]): void {
		this.onClear()
		this.isInit = true



		this.resolveLib = {}



		//RegisterEvent(EventDefine.ITEM_LIST, this.onGetItemList, this)
	}

	destory() {

	}


	prepareResource(workQueue) {

		GameConfig.initItemSystemCsv(workQueue);

	}


	onClear() {
		//TLog.Debug("ItemSystem.clear")
		this.itemList = {}							//以物品Uid为索引保存item对象
		this.storeItemList = {}
		this.showEasterEggFlag = false
		//this.storeItemList = {[storeOptions.PACKET] : {},[storeOptions.EQUIP1] = {}, [storeOptions.EQUIP2] = {}, 
		//								 [storeOptions.PETITEM] = {}, [storeOptions.DEPOT] = {}, [storeOptions.WAREHOUSE] = {},
		//								 [storeOptions.FAIRYITEM] = {},[storeOptions.RIDEITEM] = {},
		//								}								//只保存物品的Uid
		for (let k in storeOptions) {
			let v = storeOptions[k]

			this.storeItemList[v] = this.storeItemList[v] || []
		}

		this.entryItemList = {}																									//保存相同entryId的物品的Uid
		this.isInit = true

		this.shopSellItemList = {}

		this.onekeyEquipIndex = 0
		this.onekeyEquipCount = 0

		this.skillLevel = null
		this.skillData = null

		this.itemUseList = []
	}

	onGetItemList(args) {
		this.isInit = false
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	updateEquipPos(logicItem) {
		let ownerId = logicItem.getOwnerId()
		let store = logicItem.getProperty("store")
		if (ownerId > 0) {
			let actorInfo = null
			if (ownerId == GetHeroProperty("id")) {
				actorInfo = GetHeroPropertyInfo()
			} else {
				actorInfo = PetSystem.getInstance().getPetInfoEntry(ownerId)
			}
			if (actorInfo) {
				SetActorEquip(actorInfo, logicItem)
			}
		}
	}

	//添加一个物品,被动响应服务器的消息
	addItem(logicItem) {
		if (null == logicItem) {
			return
		}

		//标识物品是hero身上的
		logicItem.setPrivateFlag(true)

		let logicStore = logicItem.getProperty("store")

		// 先查找是否有个这个物品存在，是则删除，再重新加入
		let id = logicItem.getId()
		let originalItem = this.getItemLogicInfoByID(id)
		let isExsit = this.updateItem(id, logicItem)
		this.updateEquipPos(logicItem)

		// 添加到目标包里，并刷新该包
		if (logicStore == storeOptions.PACKET) {
			if (!this.isInit && !isExsit) {																					//排除登陆时加入物品
				if (!originalItem) {																	//原来没有
					FireEvent(EventDefine.ITEM_GAIN, ItemGainEvent.newObj(logicItem.getEntryId(), logicItem.getProperty("count"), logicItem))
				} else if (originalItem.getProperty("count") < logicItem.getProperty("count")) { //数量增加了
					FireEvent(EventDefine.ITEM_GAIN, ItemGainEvent.newObj(logicItem.getEntryId(), logicItem.getProperty("count") - originalItem.getProperty("count"), logicItem))
				}
				//GameSound.getInstance().playEffect(SystemSound.effect_gainItem)
			}
		}

		let isbag = logicItem.getRefProperty("isbag")
		if (isbag && isbag != 0) {
			JsUtil.arrayPush(this.itemUseList, id)
		}
		//FireEvent(EventDefine.ITEM_UPDATE, ItemUpdateEvent.newObj(logicStore, logicItem))
	}

	//计算战力
	calcEquipForce(item) {
		if (item.refPropertyInfo == null) {
			item.refPropertyInfo = GameConfig.itemConfig[item.entryId]
		}
		let itemtype = item.refPropertyInfo.type
		if (itemtype == opItemType.COMMON_EQUIP) {
			let ePro = GetFunEquipProperty(item.entryId, item.getProperty("quality"), item.getProperty("add_num"))
			let eForce = GetForceMath(ePro)
			item.force = eForce
		} else if (itemtype == opItemType.ROLE_EQUIP) {
			let ePro = GetRoleEquipBaseProperty(item.entryId, item.getProperty("quality") || opEquipQuality.gray)
			let eForce = GetForceMath(ePro)
			item.force = eForce
		}
	}

	//物品更新，列表中原来就有或者没有都通过更新来处理，返回原来的拥有状况
	updateItem(itemId, item) {

		this.calcEquipForce(item)

		let isExsit = false
		let originalItem = this.itemList[itemId] || null
		this.entryItemList[item.getProperty("entry")] = this.entryItemList[item.getProperty("entry")] || []

		if (originalItem) {
			let store = originalItem.getProperty("store")
			isExsit = store != storeOptions.PACKET

			//处理storeItemList
			table_remove(this.storeItemList[store], itemId)
			table_remove(this.entryItemList[originalItem.getProperty("entry")], itemId)
		}
		this.itemList[itemId] = item

		//处理一下storeItemList和entryItemList

		table_insert(this.storeItemList[item.getProperty("store")], itemId)
		table_insert(this.entryItemList[item.getProperty("entry")], itemId)
		return isExsit
	}

	//删除一个物品，被动响应服务器消息
	removeItem(itemId) {
		let item = this.itemList[itemId] || null

		if (item) {
			let store = item.getProperty("store")
			let entryId = item.getProperty("entry")

			this.entryItemList[entryId] = this.entryItemList[entryId] || {}

			//处理storeItemList
			table_remove(this.storeItemList[store], itemId)
			table_remove(this.entryItemList[entryId], itemId)
			delete this.itemList[itemId]

			let isbag = item.getRefProperty("isbag")
			if (isbag && isbag != 0) {
				JsUtil.arrayRemoveVal(this.itemUseList, itemId)
			}
			//FireEvent(EventDefine.ITEM_UPDATE, ItemUpdateEvent.newObj(store, item))
		}
	}

	//通过物品ID取得物品信息 return itemData
	getItemLogicInfoByID(itemId) {
		return this.itemList[itemId]
	}

	//通过物品entryId获取物品信息（列表）
	getItemLogicInfoByEntry(entryId) {
		let list = this.entryItemList[entryId] || []
		let itemList: any = []

		for (let _ = 0; _ < list.length; _++) {
			let itemId = list[_]

			let item = this.getItemLogicInfoByID(itemId)
			if (item) {
				JsUtil.arrayInstert(itemList, item)
			}
		}

		return itemList
	}
	getEquipItemList() {
		let itemList = []
		for (let i in this.itemList) {
			let item = this.itemList[i]

			if (item.isEquip()) {
				JsUtil.arrayInstert(itemList, item)
			}
		}
		return itemList
	}

	//通过物品类型获取物品信息（列表）
	getItemLogicInfoByType(type, subtype?) {
		let itemList = []

		for (let i in this.itemList) {
			let item = this.itemList[i]

			if (subtype != null) {
				if (item.getRefProperty("type") == type && item.getRefProperty("subtype") == subtype) {
					JsUtil.arrayInstert(itemList, item)
				}
			} else {
				if (item.getRefProperty("type") == type) {
					JsUtil.arrayInstert(itemList, item)
				}
			}
		}

		return itemList
	}

	//获取指定仓库位置的物品Uid
	getItemIdListByStore(store) {
		return this.storeItemList[store] || []
	}

	//通过物品entryId获取物品数量
	getItemCount(entryId) {
		let itemList = this.getItemLogicInfoByEntry(entryId)
		let count = 0

		for (let _ = 0; _ < itemList.length; _++) {
			let item = itemList[_]

			count = count + item.getProperty("count")
		}

		return count
	}

	getItemUseDes(logicItem: Item) {
		let action = logicItem.getRefProperty("action")
		if (action == "stageLevelUp") {
			let data = logicItem.getRefProperty("effects")[0]
			let funName = Localize_cns(cellOptionsName[data[0] - 1])
			return String.format(Localize_cns("ITEM_USE_TXT1"), funName, data[2] + 1, data[2] + 1, data[4], funName, data[2])
		} else if (action == "stageExp") {
			let data = logicItem.getRefProperty("effects")
			let funName = Localize_cns(cellOptionsName[data[0] - 1])
			return String.format(Localize_cns("ITEM_USE_TXT2"), data[1], funName, data[2] * 100)
		}
		return ""
	}

	useLogicItem(logicItem: Item) {
		let overlap = logicItem.getRefProperty("overlap")
		let _this = this
		if (overlap == 1) { //不堆叠
			var callback: IDialogCallback = {
				onDialogCallback(result: boolean, userData): void {
					if (result == true) {
						//_this.useItem(logicItem.id, 1)
						SendUseItemMessage(logicItem, 1)
					}
				}
			}
			MsgSystem.confirmDialog(this.getItemUseDes(logicItem), callback)
		} else if (overlap > 1) { //堆叠
			let window = WngMrg.getInstance().getWindow("ItemHintFrame")
			window.useItemHint(logicItem)
		}
	}

	// useItem(itemId, count) {
	// 	//if(logicItem.isEquip() ){ 
	// 	//	let msg = GetMessage(opCodes.C2G_ITEM_EQUIP_PUTON)
	// 	//	msg.id = logicItem.getId()
	// 	//	SendGameMessage(msg)
	// 	//}else{
	// 	let msg = GetMessage(opCodes.C2G_ITEM_USE)
	// 	msg.id = itemId
	// 	msg.count = checkNull(count, 1)
	// 	SendGameMessage(msg)
	// 	//}
	// }

	////////////////////////////////////////////////////////////////////////////-
	//常用物品属性接口（图标、名字、字体颜色、品质框等）

	getItemTemplateInfo(entryId) {
		if (entryId == 0 || entryId == -1)
			return null

		if (GameConfig.itemConfig[entryId] != null) {
			return GameConfig.itemConfig[entryId]
		}
		TLog.Error("ItemSystem.getItemTemplateInfo:%s", tostring(entryId))
		return null
	}

	getItemTemplateInfoValue(entryId, index) {
		let ref = this.getItemTemplateInfo(entryId)
		if (!ref) {
			TLog.Error("ItemSystem.getItemTemplateInfo:%s", tostring(entryId))
			return null
		}

		return ref[index] || null
	}

	getItemName(entryId) {
		let itemRef = this.getItemTemplateInfo(entryId)
		if (itemRef) {
			return itemRef.name
		}
		return "ErrorItemName"
	}

	getItemUseLevel(entryId) {
		let itemRef = this.getItemTemplateInfo(entryId)
		if (itemRef) {
			return itemRef.uselevel
		}
		return "ErrorItemName"
	}


	//////////////////////////////////////////////////////////////////////////////////////-
	getLocationWithEntryId(entryId, quality) {
		let locationName: any = {
			//[storeOptions.PACKET] 		: Localize_cns("ITEM_TIPS_LOCATION_BEIBAO"),
			//[storeOptions.EQUIP1] 		: Localize_cns(""), 
			//[storeOptions.EQUIP2] 		: Localize_cns(""), 
			//[storeOptions.PETITEM] 		: Localize_cns("ITEM_TIPS_LOCATION_ZHUANGBEI"), 
			//[storeOptions.DEPOT] 			: Localize_cns(""), 
			//[storeOptions.WAREHOUSE] 	: Localize_cns(""),
			["email"]: Localize_cns("ITEM_TIPS_LOCATION_YOUXIANG"),

		}

		let storeName = 0
		let list = this.getItemLogicInfoByEntry(entryId)
		for (let _ = 0; _ < list.length; _++) {
			let item = list[_]

			if (quality) {
				if (item.getProperty("equip_quality") == quality) {
					storeName = item.getProperty("store")
					break
				}
			} else {
				storeName = item.getProperty("store")
				break
			}
		}

		// if(storeName == 0 ){
		// 	let list = MailSystem.getInstance().getMailList()
		// 	for(let _ in list){
		// 		let mail = list[_]

		// 		for(let k in mail.item){
		// 		let v = mail.item[k]

		// 			if(v[1] == entryId ){
		// 				storeName = "email"
		// 				break
		// 			}
		// 		}
		// 	}
		// }

		return locationName[storeName] || ""
	}


	showItemTipsByEntry(entry, count) {
		let itemInfo: any = {}
		itemInfo.entry = entry
		itemInfo.id = -1
		itemInfo.count = checkNull(count, 1)
		itemInfo.previewCount = checkNull(count, 1)

		let item = Item.newObj(itemInfo)
		this.showItemTips(item)
	}


	showItemTips(logicItem) {
		let type = logicItem.getRefProperty("type")
		if (type == opItemType.ROLE_ALLSMAN) {
			let wnd: FaBaoItemTipsFrame = WngMrg.getInstance().getWindow("FaBaoItemTipsFrame")
			wnd.onShowWnd(logicItem, false)
		} else if (type == opItemType.ROLE_SHENHUN) {
			let wnd: ShenHunItemTipsFrame = WngMrg.getInstance().getWindow("ShenHunItemTipsFrame")
			wnd.onShowWnd(logicItem)
		} else {
			let window = WngMrg.getInstance().getWindow("ItemHintFrame")
			window.showItemHint(logicItem)
		}
	}


	//打开物品信息界面
	showItemHint(dataList) {
		if (dataList.logicItem == null) {
			return
		}
		//兼容接口
		this.showItemTips(dataList.logicItem)


	}

	//////////////////////////////////////////////////////////////////////////////
	// ////御灵信息保存
	// SetSkill(level, skillData) {

	// 	this.skillLevel = level
	// 	this.skillData = skillData
	// 	FireEvent(EventDefine.SACRIFICE_UPDATE, null)
	// }

	//////////////////////////////////////////////////////////////////////////////
	////获取御灵保存信息和配置信息
	// GetSkill() {
	// 	let nowValueList = []
	// 	let nowHPValue = 0
	// 	let nowMagicValue = 0
	// 	let nowPhysicValue = 0

	// 	let HPWord = ""
	// 	let MagicWord = ""
	// 	let PhysicWord = ""

	// 	let nextValueList = []
	// 	let nextHPValue = 0
	// 	let nextMagicValue = 0
	// 	let nextPhysicValue = 0

	// 	//新的做法，读表
	// 	let skillToLevelList: any = {}
	// 	let nextSkillToLevelList: any = {}
	// 	for (let i = 294; i <= 301; i++) {
	// 		let level = this.getSkillLevelList(i)
	// 		skillToLevelList[i] = level
	// 		level = this.getNextSkillLevelList(i)
	// 		nextSkillToLevelList[i] = level
	// 	}

	// 	for (let i = 294; i <= 301; i++) {
	// 		for (let k in GameConfig.SacrificeConfig[i]) {
	// 			let v = GameConfig.SacrificeConfig[i][k]
	// 			HPWord = v.effect[0][0]
	// 			MagicWord = v.effect[1][0]
	// 			PhysicWord = v.effect[2][0]

	// 			if (v.level <= skillToLevelList[i]) {
	// 				nowHPValue = nowHPValue + v.effect[0][1]
	// 				nowMagicValue = nowMagicValue + v.effect[1][1]
	// 				nowPhysicValue = nowPhysicValue + v.effect[2][1]
	// 			}
	// 			if (v.level <= nextSkillToLevelList[i]) {
	// 				nextHPValue = nextHPValue + v.effect[0][1]
	// 				nextMagicValue = nextMagicValue + v.effect[1][1]
	// 				nextPhysicValue = nextPhysicValue + v.effect[2][1]
	// 			}
	// 		}
	// 	}
	// 	JsUtil.arrayInstert(nowValueList, { "data": nowHPValue, "word": HPWord })
	// 	JsUtil.arrayInstert(nowValueList, { "data": nowMagicValue, "word": MagicWord })
	// 	JsUtil.arrayInstert(nowValueList, { "data": nowPhysicValue, "word": PhysicWord })

	// 	JsUtil.arrayInstert(nextValueList, { "data": nextHPValue, "word": HPWord })
	// 	JsUtil.arrayInstert(nextValueList, { "data": nextMagicValue, "word": MagicWord })
	// 	JsUtil.arrayInstert(nextValueList, { "data": nextPhysicValue, "word": PhysicWord })

	// 	return [this.skillLevel, this.skillData, nowValueList, nextValueList]
	// }

	// //根据状态获取御灵当前等级
	// getSkillLevelList(index) {
	// 	let level = 0
	// 	let curCanActiva = null
	// 	if (this.skillData == null) {
	// 		return 0
	// 	}
	// 	for (let k in this.skillData) {
	// 		let v = this.skillData[k]

	// 		let state: any
	// 		if (Array.isArray(v)) {
	// 			state = v[2]
	// 		} else {
	// 			state = v[3]
	// 		}

	// 		if (state && state == opSacrificeStatus.CAN) {
	// 			curCanActiva = k
	// 		}
	// 	}

	// 	if (curCanActiva && this.skillLevel < defaultValue.SACRIFICE_MAX_LEVEL) {
	// 		if (index < curCanActiva) {
	// 			level = this.skillLevel + 1
	// 		} else {
	// 			level = this.skillLevel
	// 		}
	// 	} else {
	// 		level = defaultValue.SACRIFICE_MAX_LEVEL
	// 	}
	// 	return level
	// }

	// //根据状态获取御灵下一个等级
	// getNextSkillLevelList(index) {
	// 	let level = 0
	// 	let curCanActiva = null
	// 	if (this.skillData == null) {
	// 		return 0
	// 	}
	// 	for (let k in this.skillData) {
	// 		let v = this.skillData[k]

	// 		let state: any
	// 		if (Array.isArray(v)) {
	// 			state = v[2]
	// 		} else {
	// 			state = v[3]
	// 		}

	// 		if (state && state == opSacrificeStatus.CAN) {
	// 			curCanActiva = k
	// 		}
	// 	}

	// 	if (curCanActiva && this.skillLevel < defaultValue.SACRIFICE_MAX_LEVEL) {
	// 		if (index <= curCanActiva) {
	// 			level = this.skillLevel + 1
	// 		} else {
	// 			level = this.skillLevel
	// 		}
	// 	} else {
	// 		level = defaultValue.SACRIFICE_MAX_LEVEL
	// 	}
	// 	return level
	// }

	// //御灵升级需要的材料
	// getNextSkillNeedMaterial() {
	// 	if (this.skillData == null) {
	// 		return null
	// 	}

	// 	let level = this.skillLevel
	// 	if (level >= defaultValue.SACRIFICE_MAX_LEVEL) {
	// 		return null
	// 	}

	// 	let bgindex = 7
	// 	for (let _i in this.skillData) {
	// 		let i = tonumber(_i)
	// 		let v = this.skillData[i]

	// 		if (v[3] == opSacrificeStatus.CAN) {
	// 			bgindex = i - 294
	// 			break
	// 		}
	// 	}

	// 	let sacrList = GameConfig.SacrificeConfig[294 + bgindex][level + 1]
	// 	return sacrList.item
	// }


	getSortItemByMaxLevel(itemList, level) {
		if (itemList.length == 0) {
			return itemList
		}

		//先按可以使用的最高等级
		let sortList1 = []//可以使用的
		let sortList2 = []//不可以使用的
		for (let _ = 0; _ < itemList.length; _++) {
			let v = itemList[_]

			if (v.getRefProperty("uselevel") <= level) {
				JsUtil.arrayInstert(sortList1, v)
			} else {
				JsUtil.arrayInstert(sortList2, v)
			}
		}

		table_sort(sortList1, function (a, b) {
			let aLevel = a.getRefProperty("uselevel")
			let bLevel = b.getRefProperty("uselevel")
			//return aLevel > bLevel
			return bLevel - aLevel
		})
		table_merge(sortList1, sortList2)
		return sortList1
	}




	getSortEquipList(itemList, level): Item[] {
		if (itemList.length == 0) {
			return itemList
		}

		//先按可以使用的最高等级，再按装备评分
		let sortList1: any = []//可以使用的
		let sortList2: any = []//不可以使用的
		for (let _ = 0; _ < itemList.length; _++) {
			let v = itemList[_]

			if (v.getRefProperty("uselevel") <= level || v.isUseLevelIgnore()) {
				JsUtil.arrayInstert(sortList1, v)
			} else {
				JsUtil.arrayInstert(sortList2, v)
			}
		}

		table_sort(sortList1, function (a, b) {
			let aLevel = a.getRefProperty("level")
			let bLevel = b.getRefProperty("level")
			if (aLevel == bLevel) {
				let aScroe = a.getProperty("equip_score") || 0
				let bScroe = b.getProperty("equip_score") || 0
				if (aScroe == bScroe) {
					let aEnhance = a.getProperty("enhance_level") || 0
					let bEnhance = b.getProperty("enhance_level") || 0

					return bEnhance - aEnhance
				} else {
					return bScroe - aScroe
				}
			} else {
				return bLevel - aLevel
			}
		})

		table_sort(sortList2, function (a, b) {
			let aLevel = a.getRefProperty("level")
			let bLevel = b.getRefProperty("level")
			if (aLevel == bLevel) {
				let aScroe = a.getProperty("equip_score") || 0
				let bScroe = b.getProperty("equip_score") || 0
				if (aScroe == bScroe) {
					let aEnhance = a.getProperty("enhance_level") || 0
					let bEnhance = b.getProperty("enhance_level") || 0

					return bEnhance - aEnhance
				} else {
					return bScroe - aScroe
				}
			} else {
				return aLevel - bLevel						//不可使用的等级从小到大
			}
		})
		for (let _ = 0; _ < sortList2.length; _++) {
			let v = sortList2[_]

			JsUtil.arrayInstert(sortList1, v)
		}
		//table_merge(sortList1, sortList2)
		return sortList1
	}

	//通过物品类型获取物品信息（列表）
	getEquipListByTypeAndVocation(itemtype, vocationType) {
		vocationType = checkNull(vocationType, -1)

		let itemList = []
		if (!(itemtype >= opItemType.PLAYER_EQUIP_START && itemtype <= opItemType.PLAYER_EQUIP_END)) {
			return itemList
		}

		for (let i in this.itemList) {
			let item = this.itemList[i]

			if (item.getRefProperty("type") == itemtype) {

				if (vocationType == -1) {
					JsUtil.arrayInstert(itemList, item)
				} else {
					let vocationTypeList = item.getRefProperty("heroId")
					if (table_isExist(vocationTypeList, vocationType)) {
						JsUtil.arrayInstert(itemList, item)
					}
				}
			}
		}

		return itemList
	}


	//获得装备列表，根据指定排序 curInfo(PetInfo, heroInfo)
	// getSortEquipListByInfo(itemtype, curInfo): Item[] {
	// 	//角色等级
	// 	let vocationType = -1
	// 	let level = 0

	// 	let heroInfo = GetHeroPropertyInfo()

	// 	if (curInfo) {
	// 		let isHero = (IsHeroInfo(curInfo))
	// 		level = curInfo.level || 0
	// 		if (isHero) {
	// 			vocationType = ProfessionSystem.getInstance().getProfessionType(curInfo.vocation)
	// 		} else {
	// 			vocationType = PetSystem.getInstance().getProfessionType(curInfo.entry)
	// 		}
	// 	} else if (heroInfo) {
	// 		level = heroInfo.level || 0
	// 	}
	// 	//职业
	// 	let itemList = this.getEquipListByTypeAndVocation(itemtype, vocationType)

	// 	//let itemList:any = {}
	// 	//if(! (itemtype >= opItemType.PLAYER_EQUIP_START && itemtype <= opItemType.PLAYER_EQUIP_END ) ){
	// 	//	TLog.Debug("getSortEquipList11111111111")
	// 	//	return itemList
	// 	//}
	// 	//
	// 	//for(let i in this.itemList){
	// 	//		let item = this.itemList[i]
	// 	//
	// 	//	if(item.getRefProperty("type") == itemtype ){
	// 	//		
	// 	//		if(vocation == -1 ){
	// 	//			JsUtil.arrayInstert(itemList, item)
	// 	//		}else{
	// 	//			let vocationTypeList = item.getRefProperty("heroId")
	// 	//		 	let type = ProfessionSystem.getInstance().getProfessionType(vocation)
	// 	//		 	
	// 	//		 	if(table_isExist(vocationTypeList, type) ){
	// 	//		 		JsUtil.arrayInstert(itemList, item)
	// 	//		 	}
	// 	//		}
	// 	//	}
	// 	//}

	// 	return this.getSortEquipList(itemList, level)
	// }

	// //得到材料列表//
	// getMaterialList(entryid, level) {
	// 	if (GameConfig.MaterialListConfig[entryid] != null) {
	// 		return GameConfig.MaterialListConfig[entryid][level]
	// 	}
	// }

	getItemList() {
		return this.itemList
	}

	setShopSellItemList(shopIndex, itemList) {
		this.shopSellItemList[shopIndex] = itemList

	}

	getShopSellItemList(type) {
		return this.shopSellItemList[type] || []
	}


	//////////////////////////////溶解////////////////////////////////-
	getResolveList() {
		let resolveList = []
		let beibaoList = this.getItemIdListByStore(storeOptions.PACKET)
		for (let _ in beibaoList) {
			let v = beibaoList[_]

			let itemInfo = this.getItemLogicInfoByID(v)
			let entryId = itemInfo.entryId
			if (GameConfig.itemConfig[entryId]) {
				let config = GameConfig.itemConfig[entryId]
				if (config.splitPowder > 0) {
					JsUtil.arrayInstert(resolveList, itemInfo)
				}
			}
		}

		table_sort(resolveList, function (a, b) {
			let aConfig = a.getRefPropertyInfo()
			let bConfig = b.getRefPropertyInfo()

			return bConfig.splitPowder - aConfig.splitPowder
		})

		return resolveList
	}

	SetResolveLib(list) {
		this.resolveLib = []
		for (let i in list) {
			let v = list[i]

			if (v) {
				JsUtil.arrayInstert(this.resolveLib, v)
			}
		}
	}

	GetResolveLib() {
		return this.resolveLib
	}

	// isEquipPromoteType(itemEntry) {
	// 	let config = GameConfig.EquipmakeConfig[itemEntry]
	// 	if (config == null) {
	// 		return false
	// 	}
	// 	return config.needEquip > 0
	// }

	// checkEquipPromoteMaterial(itemEntry) {
	// 	let makeInfo = GameConfig.EquipmakeConfig[itemEntry]
	// 	if (makeInfo == false)
	// 		return false;

	// 	let bMaterialEngough = true
	// 	for (let i = 0; i < makeInfo.material.length; i++) {
	// 		let v = makeInfo.material[i]

	// 		let entryId = v[0]
	// 		let count = v[1]

	// 		if (this.getItemCount(entryId) < count) {
	// 			bMaterialEngough = false
	// 			break
	// 		}
	// 	}

	// 	if (bMaterialEngough && makeInfo.needEquip > 0) {
	// 		if (this.getItemCount(makeInfo.needEquip) < 1) {
	// 			bMaterialEngough = false
	// 		}
	// 	}

	// 	let curCash = GetHeroProperty("funds") || 0
	// 	return bMaterialEngough && curCash >= makeInfo.funds
	// }

	//物品来源
	getItemSourceText(itemSource) {
		for (let _ in opItemSource) {
			let v = opItemSource[_]

			if (v == itemSource) {
				return Localize_cns("ITEM_SOURCE" + v)
			}
		}
		return Localize_cns("ROBBER_TXT118")
	}


	getSkillLevel() {
		return this.skillLevel
	}

	onGetEquipIndex() {
		return this.onekeyEquipIndex
	}
	onSetEquipIndex(index) {
		this.onekeyEquipIndex = index
	}
	onGetEquipCount() {
		return this.onekeyEquipCount
	}
	onSetEquipCount(index) {
		this.onekeyEquipCount = index
	}


	//某个类型某个等阶通用装备列表
	getFunEquipListByStage(subType, stage) {
		let equipList = this.getItemLogicInfoByType(opItemType.COMMON_EQUIP)
		let list: any[] = []
		for (let i in equipList) {
			let equip = <Item>equipList[i]
			let mStage = equip.getRefProperty("level")
			let mSubType = equip.getRefProperty("subtype")
			if (mSubType == subType && mStage == stage) {
				JsUtil.arrayInstert(list, equip)
			}
		}
		return list
	}

	//某个类型某个等阶限制装备列表(拿等阶最近的装备)
	getFunEquipListWithStage(subtype, stage) {
		for (let i = stage; i > 0; i--) {
			let equipList = this.getFunEquipListByStage(subtype, i)
			if (size_t(equipList) != 0) {
				return equipList
			}
		}
		return []
	}

	//
	getEquipSubtypeForce() {
		let ret = {}

		for (let subtype in GameConfig.FunEquipCaseSubType) {
			let indexpos = GameConfig.FunEquipCaseSubType[subtype]
			let index = indexpos[0]
			let pos = indexpos[1]
			if (index == cellOptionsIndex.Hero) {
				let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
				if (roleItem != null) {
					ret[subtype] = roleItem.force
				}
			} else {
				let funItem = FunSystem.getInstance().getWearEquipItem(index, subtype)
				if (funItem != null) {
					ret[subtype] = funItem.force
				}
			}
		}

		return ret
	}

	getSubtypeMaxLevel() {
		let ret = {}

		for (let subtype in GameConfig.FunEquipCaseSubType) {
			let indexpos = GameConfig.FunEquipCaseSubType[subtype]
			let index = indexpos[0]
			let level = 0
			if (index == cellOptionsIndex.Hero) {
				level = GetHeroProperty("level")
			} else {
				let funInfo = FunSystem.getInstance().getFunInfoWithType(index)
				if (funInfo != null) {
					level = funInfo.stage
				}
			}
			ret[subtype] = level
		}
		return ret
	}

	getPetIdByItemId(itemId) {
		let config = GameConfig.PetConfig
		for (let index in config) {
			let info = config[index]
			if (info.itemid == itemId) {
				return tonumber(index)
			}
		}
		return 0
	}

	getXianLvIdByItemId(itemId) {
		let config = GameConfig.ActorXianLvConfig
		for (let index in config) {
			let info = config[index]
			if (info.itemid == itemId) {
				return tonumber(index)
			}
		}
		return 0
	}

	getxianLvIdItemId(itemId) {
		let config = GameConfig.ActorXianLvConfig
		for (let index in config) {
			let info = config[index]
			if (info.itemid == itemId) {
				return tonumber(index)
			}
		}
		return 0
	}

	getPetConfigByItemId(itemId) {
		let config = GameConfig.PetConfig
		for (let index in config) {
			let info = config[index]
			if (info.itemid == itemId) {
				return info
			}
		}
		return null
	}



	//某个物品根据已经存在的战力列表，如果战力列表没有，则保存到列表里，如果存在比较战力大小，返回战力小的物品，保存战力大的物品
	checkForceEquipFromList(forcelist, keyindex, item) {
		let itemInfo = forcelist[keyindex]
		if (itemInfo == null) {//如果战力列表没有，则保存到列表里
			forcelist[keyindex] = [item.id, item.force]
		} else {//如果存在比较战力大小，返回战力小的物品，保存战力大的物品
			let finditem = item
			if (item.force > itemInfo[1]) {
				let oldid = itemInfo[0]
				forcelist[keyindex] = [item.id, item.force]
				finditem = this.itemList[oldid]
			}
			return finditem
		}
	}

	getEquipQualityMatch(item) {
		let maintype = item.getRefProperty("type")
		if (maintype == opItemType.COMMON_EQUIP) {//是通用装备。无论颜色
			return true
		}
		if (maintype == opItemType.ROLE_EQUIP) {
			let quality = item.getProperty("quality")
			if (quality != null && quality <= opEquipQuality.purple) {//是角色装备，而且紫色或以下
				return true
			}
		}
	}
	//获取到熔炼的
	getBeiBaoSmeltList(maxnum) {
		let equipitemlist = []
		//1.比穿在身上的的装备战力还要低的装备
		let subTypeForceList = this.getEquipSubtypeForce()
		let maxForceList = {}
		let num = 0
		for (let i in this.itemList) {
			let item = this.itemList[i]
			if (this.getEquipQualityMatch(item)) {
				let subtype = item.getRefProperty("subtype")
				let topforce = subTypeForceList[subtype]
				if (topforce != null) {//穿在身上的
					if (item.force <= topforce) {//战力比已经穿上的低的
						table_insert(equipitemlist, item)
						num = num + 1
						if (num >= maxnum) {
							return equipitemlist
						}
					} else {//else if (topforce != null && item.force > topforce) { //如果比身上的高就 同一个模板ID的保留一个战力高的
						let finditem = this.checkForceEquipFromList(maxForceList, item.getRefProperty("ItemEntry"), item)
						if (finditem != null) {
							table_insert(equipitemlist, finditem)
							num = num + 1
							if (num >= maxnum) {
								return equipitemlist
							}
						}
					}
				}//穿在身上的
			}
		}

		//2.没有对应子类型的准备穿在身上，找背包里的等级条件达到，可以穿上的 战力不是最高的装备
		let subtypeTopForcePacket = {}
		let entryTopForcePacket = {}
		let subtypelevel = this.getSubtypeMaxLevel()//得到子类型最高可以穿上多少级的装备
		for (let i in this.itemList) {
			let item = this.itemList[i]
			if (this.getEquipQualityMatch(item)) {
				let subtype = item.getRefProperty("subtype")
				if (subTypeForceList[subtype] == null) {//不是穿在身上的子类型
					let itemlevel = item.getRefProperty("uselevel")
					if (itemlevel != null) {
						if (itemlevel <= subtypelevel[subtype]) {//等级足够，可以穿上 同一个子类型里找一个高最战力的
							let finditem = this.checkForceEquipFromList(subtypeTopForcePacket, subtype, item)
							if (finditem != null) {
								table_insert(equipitemlist, finditem)
								num = num + 1
								if (num >= maxnum) {
									return equipitemlist
								}
							}
						} else {//等级不足，不可穿上 同一个相同模板ID的里找一个高最战力的
							let finditem = this.checkForceEquipFromList(entryTopForcePacket, item.getRefProperty("ItemEntry"), item)
							if (finditem != null) {
								table_insert(equipitemlist, finditem)
								num = num + 1
								if (num >= maxnum) {
									return equipitemlist
								}
							}
						}
					}
				}//不是穿在身上的子类型
			}
		}

		return equipitemlist
	}

	//获取某个位置可以熔炼的装备列表
	getEquipSubtypeSmeltList(itemlist, subtype) {
		if (size_t(itemlist) == 0) {
			return []
		}
		let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
		let maxForceItem = RoleSystem.getInstance().getMaxForceItem(itemlist) //获取最大战力的
		let isKeep = false
		if (roleItem != null) {
			let ePro = GetRoleEquipBaseProperty(roleItem.entryId, roleItem.getProperty("quality") || opEquipQuality.gray)
			let eForce = GetForceMath(ePro)
			let maxForceItemPro = GetRoleEquipBaseProperty(maxForceItem.entryId, maxForceItem.getProperty("quality") || opEquipQuality.gray)
			let maxItemForce = GetForceMath(maxForceItemPro)

			isKeep = maxForceItem > eForce
		}

		let recvlist = []
		for (let k in itemlist) {
			let item: Item = itemlist[k]
			if (item.getProperty("quality") >= opEquipQuality.gold) continue
			if (isKeep && item.id == maxForceItem.id) continue
			table_insert(recvlist, item)
		}
		return recvlist
	}

	//帮派升级材料
	getFactionMaterial() {
		let list = []
		for (let i in this.itemList) {
			let item: Item = this.itemList[i]
			if (item.getRefProperty("action") == "facExp") {
				for (let i = 0; i < item.getProperty("count"); i++) {
					table_insert(list, item)
				}
			}
		}
		return list
	}

	//装备背包格子数量
	getEquipPacketCount() {
		let num = 0
		for (let i in this.itemList) {
			let item = this.itemList[i]
			let maintype = item.getRefProperty("type")
			if (maintype == opItemType.ROLE_EQUIP || maintype == opItemType.COMMON_EQUIP) {
				num = num + 1
			}
		}
		return num
	}

	isEquipPacketFull() {
		let maxCount = GetHeroProperty("equipMax") || 0
		let currentCount = this.getEquipPacketCount()
		return currentCount >= maxCount
	}

	isEquipPacketAlmostFull() {
		let maxCount = GetHeroProperty("equipMax") || 0
		let currentCount = this.getEquipPacketCount()
		return currentCount >= maxCount * 0.9
	}


	///获取法宝
	getFaBaoItemList() {
		let itemType = opItemType.ROLE_ALLSMAN
		let list = this.getItemLogicInfoByType(itemType)
		table_sort(list, function (a, b) {
			let quality_a = a.getProperty("quality")
			let quality_b = b.getProperty("quality")
			if (quality_a == quality_b) {
				return a.entryId - b.entryId
			} else {
				return quality_b - quality_a
			}
		})

		return list
	}

	getCanUseItemList() {
		return this.itemUseList || []
	}

	checkItemCanUse(itemId) {
		return table_isExist(this.itemUseList, itemId)
	}

	getSmeltRoleEquipList() {
		let itemType = opItemType.ROLE_EQUIP
		let list = this.getItemLogicInfoByType(itemType)
		let itemList = []
		for (let k in list) {
			let item: Item = list[k]
			if (item.getProperty("quality") <= opEquipQuality.purple) {
				table_insert(itemList, item)
			}
		}

		table_sort(itemList, function (a, b) {
			let quality_a = a.getProperty("quality")
			let quality_b = b.getProperty("quality")
			if (quality_a == quality_b) {
				return a.force - b.force
			} else {
				return quality_a - quality_b
			}
		})

		return itemList
	}

	getSmeltCommonEquipList() {
		let itemType = opItemType.COMMON_EQUIP
		let list = this.getItemLogicInfoByType(itemType)
		table_sort(list, function (a, b) {
			let quality_a = a.getProperty("quality")
			let quality_b = b.getProperty("quality")
			if (quality_a == quality_b) {
				return a.force - b.force
			} else {
				return quality_a - quality_b
			}
		})

		return list
	}

	getGoldEquipSmeltList(eQuality) {
		let list = this.getItemLogicInfoByType(opItemType.ROLE_EQUIP)
		let showList = []
		let qualityList = {}
		for (let k in list) {
			let item = list[k]
			if (item.getProperty("quality") == eQuality) {
				//如果item.suit 超过玩家一个阶段,可以直接溶解
				let subtype = item.getRefProperty("subtype")
				let equipitem = RoleSystem.getInstance().getRoleEquipItem(subtype)
				let e_level = 0
				if (equipitem != null) {
					e_level = equipitem.getRefProperty("uselevel")
				}
				let i_level = item.getRefProperty("uselevel")
				if (i_level >= e_level + 20) {
					table_insert(showList, item)
					continue
				}
				let itemId = item.entryId
				if (!qualityList[itemId]) qualityList[itemId] = 0
				let itemForce = item.force
				if (qualityList[itemId] >= itemForce) { //比最大的值小
					table_insert(showList, item)
					continue
				} else {
					qualityList[itemId] = itemForce
				}
				if (equipitem != null) {
					if (equipitem.force >= itemForce) {
						table_insert(showList, item)
					}
				}
			}
		}
		return showList
	}

	setEggInfo(info) {
		this.easterEggInfo = info
		this.showEasterEggFlag = true
	}

	showEasterEgg() {
		if (this.showEasterEggFlag) {
			let info = this.easterEggInfo
			let wnd = WngMrg.getInstance().getWindow("EasterEggPetFrame");
			wnd.onShowAndSetData(info)
			this.showEasterEggFlag = false
		}
	}

	//获得神魂的列表
	getShenHunItemList(shenhunType?) {
		let list = this.getItemLogicInfoByType(opItemType.ROLE_SHENHUN)
		let recvConfig = []
		let vocation = GetHeroProperty("vocation")

		let checkTotal = shenhunType == null
		let checkQita = shenhunType == optionShenHun.qita


	/*	for(let k in list){
			let item : Item = list[k]
			let temp_voca = item.getRefProperty("vocation")
			let item_shenhunType = item.getRefProperty("shenhunType") || 0
			//所有， 
			if(checkTotal){

			}else if (checkQita){ //其他

			}

		}*/

		if (shenhunType != null) {
			//let check = shenhunType == optionShenHun.qita
			if (shenhunType == optionShenHun.qita) {
				for (let k in list) {
					let item: Item = list[k]
					let temp_voca = item.getRefProperty("vocation")
					if (temp_voca == vocation || temp_voca == 0) { //除了通用跟本族
						continue
					}
					table_insert(recvConfig, item)
				}
			} else {
				for (let k in list) {
					let item: Item = list[k]
					let item_shenhunType = item.getRefProperty("shenhunType") || 0
					let temp_voca = item.getRefProperty("vocation")
					//本族的（包括通用）， 本类的
					if((temp_voca == 0 || temp_voca == vocation) && item_shenhunType == shenhunType){
						table_insert(recvConfig, item)
					}
				}
			}
		} else {
			recvConfig = list
		}
		table_sort(recvConfig, function (a, b) {
			let a_quality = a.getProperty("quality")
			let b_quality = b.getProperty("quality")
			if (a_quality == b_quality) {
				return b.getProperty("enhanceLevel") - a.getProperty("enhanceLevel")
			} else {
				return b.getProperty("quality") - a.getProperty("quality")
			}
		})
		return recvConfig
	}

	//获得神魂可以强化的材料
	getShenHunStrongMart(id) {
		//let vocation = GetHeroProperty("vocation")
		let list = this.getItemLogicInfoByType(opItemType.ROLE_SHENHUN)
		let recvConfig = []
		for (let k in list) {
			let item: Item = list[k]
			if (item.id == id) continue
			//let item_vocation = item.getRefProperty("vocation")
			let lock = item.getProperty("talisman_lock") || 0
			if (/*vocation != item_vocation && item_vocation != 0 && */lock != 1) {
				table_insert(recvConfig, item)
			}
		}
		table_sort(recvConfig, function (a, b) {
			let a_quality = a.getProperty("quality")
			let b_quality = b.getProperty("quality")
			if (a_quality == b_quality) {
				return b.getProperty("enhanceLevel") - a.getProperty("enhanceLevel")
			} else {
				return b.getProperty("quality") - a.getProperty("quality")
			}
		})
		return recvConfig
	}
}