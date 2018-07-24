/*
通用界面: 坐骑 翅膀 宠物（通灵 兽魂） 等等
定义: funelemOption
常用接口: 

*/

class FunSystem extends BaseSystem {
	funInfoList: any;

	goldEquipList: any

	funPrizeList: any

	public initObj(...args: any[]): void {
		this.onClear()
	}

	destory() {

	}

	prepareResource(workQueue) {
		GameConfig.initFunSystemCsv(workQueue);
	}

	onClear() {
		this.funInfoList = {}
		this.goldEquipList = []
		this.funPrizeList = {}
	}

	getFunPrizeConfig() {
		this.funPrizeList = {}
		for (let _ in cellOptionsIndex) {
			let config = GameConfig.FunUpgradeStageConfig[_] || {}
			if (size_t(config) > 0) {
				for (let lv in config) {
					let prize = config[lv].prize
					if (prize && size_t(prize) > 0) {
						if (!this.funPrizeList[cellOptionsIndex[_]]) {
							this.funPrizeList[cellOptionsIndex[_]] = {}
						}

						this.funPrizeList[cellOptionsIndex[_]][lv] = GameConfig.FunUpgradeStageConfig[_][lv]
					}
				}
			}
		}

		return this.funPrizeList
	}

	_initFunInfoField(info) {
		this._updateFunInfoEquipList(info)
		this.funInfoList[info.entryid] = info

		FireEvent(EventDefine.PET_FUN_INFO_REFRESH, null)

	}

	_initFunInfoFieldList(infoList) {
		if (infoList == null) {
			TLog.Warn("FunSystem._initFunInfoField get NULL")
			return
		}

		for (let _ in infoList) {
			let v = infoList[_]
			this._updateFunInfoEquipList(v)
			this.funInfoList[v.entryid] = v
		}
		FireEvent(EventDefine.PET_FUN_INFO_REFRESH, null)

	}

	_refreshFunInfoField(funType, info) {
		if (this.funInfoList[funType]) {
			//TLog.Warn("FunSystem._refreshFunInfoField %d alreadey exsit", funOptionsName[funType])
		}

		this.funInfoList[funType] = info

		FireEvent(EventDefine.PET_FUN_INFO_REFRESH, null)

	}

	_updateFunInfoField(funType, updateProperty) {
		let funInfo = this.funInfoList[funType]

		if (funInfo == null) {
			//TLog.Warn("FunSystem._updateFunInfoField %d is null", funOptionsName[funType])
			return
		}

		if (updateProperty == null) {
			return
		}


		let isLevelUp = false
		if (updateProperty.curshape != null) { //只有升阶的时候重置
			isLevelUp = (updateProperty.stage || funInfo.stage) == funInfo.stage ? false : true

		}

		for (let k in updateProperty) {
			let v = updateProperty[k]
			funInfo[k] = v
		}
		if (updateProperty["equiplist"] != null) {
			this._updateFunInfoEquipList(funInfo)
		}

		if (updateProperty.curshape != null) {
			FireEvent(EventDefine.PET_FUN_TOP_UPDATE, FunTurnUpdateEvent.newObj(funType, isLevelUp))
		}

		FireEvent(EventDefine.PET_FUN_INFO_UPDATE, null)

	}

	_updateFunInfoEquipList(funInfo) {
		funInfo.equipItemList = {}
		this.goldEquipList = []
		for (let k in funInfo.equiplist) {
			let logicitem = funInfo.equiplist[k]
			let GId = logicitem[1]
			let entryId = logicitem[2]
			let quality = logicitem[objectField.ITEM_FIELD_QUALITY]
			let add_num = logicitem[objectField.ITEM_FIELD_ADD_NUM]
			let itemInfo: any = {}
			itemInfo.id = GId
			itemInfo.entry = entryId
			itemInfo.quality = quality
			itemInfo.add_num = add_num
			let item = Item.newObj(itemInfo)
			let subtype = item.getRefProperty("subtype")
			if (logicitem && logicitem[22]) {
				item.propertyInfo.best_attribute = logicitem[22]
				item.propertyInfo.index = k
			}

			if (quality >= opEquipQuality.gold) {
				table_insert(this.goldEquipList, GId)
			}

			ItemSystem.getInstance().calcEquipForce(item)
			funInfo.equipItemList[subtype] = item
		}
	}
	////////////////////////////////////////////////////////////////
	getFunInfoWithType(funType) {
		if (this.funInfoList[funType] == null) {
			//TLog.Warn("FunSystem.getFunInfo %d is null", funOptionsName[funType])
			return
		}

		return this.funInfoList[funType]
	}

	isBagGoldEquip(gid) {
		return table_isExist(this.goldEquipList, gid)
	}

	//模型
	getFunModel(funType, stage) {
		return GameConfig.FunShapeConfig[cellOptionsName[funType - 1]][stage].Shape
	}

	//模型名
	getFunModelName(funType, stage) {
		return GameConfig.FunShapeConfig[cellOptionsName[funType - 1]][stage].nameStr
	}

	//获取升级消耗材料
	getFunUpgradeMaterial(funType, stage) {
		let material: any = {}
		material.itemId = GameConfig.FunUpgradeStageConfig[cellOptionsName[funType - 1]][stage].itemid
		material.itemNum = GameConfig.FunUpgradeStageConfig[cellOptionsName[funType - 1]][stage].itemnum
		material.moneyUnit = GameConfig.FunUpgradeStageConfig[cellOptionsName[funType - 1]][stage].moneyunit
		material.money = GameConfig.FunUpgradeStageConfig[cellOptionsName[funType - 1]][stage].money
		return material
	}

	//获取pos位置的技能
	getFunSkillConfigWithPos(funType, pos) {
		return GameConfig.FunSkillCaseConfig[cellOptionsName[funType - 1]][pos]
	}

	getTianNvSkillDescribe(skillId, level) {
		return GameConfig.SkillDescribeConfig[skillId][level].Describe
	}

	//获取技能升级材料
	getFunSkillMaterialWithLv(funType, level) {
		return GameConfig.FunLevelNumConfig[cellOptionsName[funType - 1]][level]
	}

	//获取穿戴装备列表
	getWearEquipItemList(funType) {
		let funInfo = this.getFunInfoWithType(funType)
		let list: any = []
		for (let i in funInfo.equipItemList) {
			let item = funInfo.equipItemList[i]
			table_insert(list, item)
		}
		return list
	}

	getWearEquipItem(funType, subtype) {
		let funInfo = this.getFunInfoWithType(funType)
		if (funInfo != null) {
			return funInfo.equipItemList[subtype]
		}
	}

	//获取pos位置的穿戴装备
	getWearEquipWithPos(funType, subType) {
		let list = this.getWearEquipItemList(funType)
		for (let i in list) {
			if (list[i].getRefProperty("subtype") == subType) {
				return list[i]
			}
		}
		return
	}

	//获取pos位置的subtype
	getFunSubTypeWithPos(funType, pos) {
		return GameConfig.FunEquipCaseConfig[cellOptionsName[funType - 1]].subtype[pos]
	}

	getTianNvId() {
		let id = 23001
		let type = cellOptionsIndex.TianNv
		let info = this.getFunInfoWithType(type)
		if (!info) return id
		if (info.curshape != 0) {
			id = GetFunShapeModel(type, info.stage)
		} else {
			id = GetFunSkinModel(type, info.curskin)
		}

		return id
	}

	//最大等级
	getFunMaxLevel(funType) {
		return size_t(GameConfig.FunUpgradeStageConfig[cellOptionsName[funType - 1]])
	}
}