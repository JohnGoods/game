/*
作者:
    liuziming
	
创建时间：
   2013.8.08(周四)

意图：
   宠物系统，保存宠物信息列表

公共接口：
   
   //获取数据源
*/

class PetSystem extends BaseSystem {

	petInfoList: any; //已激活宠物info表
	petActiveList: any[]; //已激活宠物id表
	petTiredList: any[];  //未激活宠物id表

	unionList: any[];

	serverUnionList: any;

	public initObj(...args: any[]): void {
		this.onClear()
		this.petInfoList = {}
		this.petActiveList = []
		this.petTiredList = []
	}

	destory() {

	}

	prepareResource(workQueue) {
		GameConfig.initPetSystemCsv(workQueue);
	}


	onClear() {
		this.petInfoList = {}

		this.petActiveList = []							//按照宠物的加入顺序排序

		this.serverUnionList = {}
	}

	getPetName(entryid) {
		if (!GameConfig.PetConfig[entryid]) {
			return "" + entryid
		}
		return GameConfig.PetConfig[entryid].name
	}

	getPetQuality(entryid) {
		if (!GameConfig.PetConfig[entryid]) {
			return "" + entryid
		}
		return GameConfig.PetConfig[entryid].quality
	}



	//添加宠物信息
	addPetInfo(petInfo) {
		if (this.petInfoList[tonumber(petInfo.entryid)]) {
			TLog.Warn("PetSystem.addPet %d alreadey exsit", petInfo.entryid)
		}

		this.petInfoList[tonumber(petInfo.entryid)] = petInfo
		return this.addPetInActive(petInfo.entryid)
	}

	//局部更新宠物信息
	updatePetInfoField(petId, updateProperty) {
		if (this.petInfoList[petId] == null) {
			TLog.Error("PetSystem.updatePetInfoField petInfo:%d is ! exist!", petId)
			return
		}

		let oldInfo: any = {}
		table_class_copy(oldInfo, this.petInfoList[petId])
		for (let k in updateProperty) {
			let v = updateProperty[k]

			if (this.petInfoList[petId][k] == null) {
				TLog.Error("PetSystem.updatePetInfoField field error : " + k)
			} else {
				this.petInfoList[petId][k] = v
			}
		}

		FireEvent(EventDefine.PET_UPDATE, PetUpdateEvent.newObj(petId, this.petInfoList[petId], oldInfo))
	}

	updatePetInfoList(petInfoList) {
		for (let _ in petInfoList) {
			let v = petInfoList[_]

			this.addPetInfo(v)
		}
	}

	getPetInfoList() {
		return this.petInfoList
	}

	getPetInfo(petId) {
		if (!this.petInfoList[petId]) {
			//TLog.Warn("PetSytem.getPetInfo %d ! exsit", petId)
			return null
		}

		return this.petInfoList[petId]
	}

	//激活?
	isPetExitsInEntry(entryId) {
		let petInfo = null

		for (let _ in this.petInfoList) {
			let v = this.petInfoList[_]

			if (v.entryid == entryId) {
				petInfo = v
				break
			}
		}

		return petInfo != null
	}

	addPetInActive(petId) {
		if (!table_isExist(this.petActiveList, petId) && !CheckPetIsShield(petId)) {
			table_insert(this.petActiveList, petId)
		}
	}

	getPetActiveList() {
		let posList = []
		let restList = []
		for (let i in this.petActiveList) {
			let petId = this.petActiveList[i]
			let info = this.getPetInfo(petId)
			let pos = info.combatpos || opPetCombatPos.Rest
			if (pos > opPetCombatPos.Rest) {
				table_insert(posList, petId)
			} else {
				table_insert(restList, petId)
			}
		}

		table_sort(posList, function (a, b) {
			let aInfo = PetSystem.getInstance().getPetInfo(a)
			let bInfo = PetSystem.getInstance().getPetInfo(b)
			return aInfo.combatpos - bInfo.combatpos
		})

		table_sort(restList, function (a, b) {
			return GameConfig.PetConfig[b].sort - GameConfig.PetConfig[a].sort
		})

		this.petActiveList = table_merge(posList, restList)

		return this.petActiveList
	}

	getPetTiredList() {
		this.petTiredList = []
		for (let i in GameConfig.PetConfig) {
			let v = GameConfig.PetConfig[i]
			//激活?
			if (!this.isPetExitsInEntry(v.Id) && !CheckPetIsShield(i)) {
				JsUtil.arrayInstert(this.petTiredList, v.Id)
			}
		}

		table_sort(this.petTiredList, function (a, b) {
			let itemAId = GameConfig.PetConfig[a].itemid
			let itemANum = GameConfig.PetConfig[a].itemnum
			let itemAOwn = ItemSystem.getInstance().getItemCount(itemAId)
			let itemBId = GameConfig.PetConfig[b].itemid
			let itemBNum = GameConfig.PetConfig[b].itemnum
			let itemBOwn = ItemSystem.getInstance().getItemCount(itemBId)
			let aWeight = itemAOwn >= itemANum ? 1 : 0
			let bweight = itemBOwn >= itemBNum ? 1 : 0
			if (aWeight == bweight) {
				return GameConfig.PetConfig[a].sort - GameConfig.PetConfig[b].sort
			} else {
				return bweight - aWeight
			}
		})

		return this.petTiredList
	}

	getPetIdWithIndex(index) {
		return this.petActiveList[index]
	}

	getPetEntryInfo(entryId) {
		return GameConfig.PetConfig[entryId]
	}

	getPetRefProperty(entryId, index) {
		if (!GameConfig.PetConfig[entryId]) {
			return null
		}

		return GameConfig.PetConfig[entryId][index] || null
	}

	getPetInfoEntry(entryId) {
		let petInfo = null

		for (let _ in this.petInfoList) {
			let v = this.petInfoList[_]

			if (v.entryid == entryId) {
				petInfo = v
				break
			}
		}

		//if(! petInfo ){
		//	TLog.Error("PetSystem.getPetInfoEntry %d is null!", entryId)
		//}
		return petInfo
	}

	//////////////////////////////////////////////////////////////////////////////////-
	showPetTipsByEntry(entryId) {
		if (this.getPetEntryInfo(entryId) == null) {
			TLog.Error("showPetTipsByEntry %s", entryId)
			//return
		}

		let wnd = WngMrg.getInstance().getWindow("PetPreviewFrame")
		wnd.showWithPetEntry(entryId)
	}

	showPetTipsByInfo(petInfo) {
		let wnd = WngMrg.getInstance().getWindow("PetPreviewFrame")
		wnd.showWithPetInfo(petInfo)
	}

	//宠物技能洗练星级 1-7
	getPetSkillStart(count) {
		let maxStart = elemWashSkillOptions[cellOptionsIndex.PetSkill].MaxStart
		let startArea = elemWashSkillOptions[cellOptionsIndex.PetSkill].StartArea
		for (let i = 1; i <= maxStart; i++) {
			if (count < startArea[i]) {
				return i
			}
		}
		return maxStart
	}

	//获取配置神宠
	getPetGodList() {
		let list = []
		for (let i in GameConfig.PetConfig) {
			let v = GameConfig.PetConfig[i]
			if (CheckPetIsGod(v.Id) && !CheckPetIsShield(i)) {
				JsUtil.arrayInstert(list, v.Id)
			}
		}

		table_sort(list, function (a, b) {
			return GameConfig.PetConfig[a].quality - GameConfig.PetConfig[b].quality
		})

		return list
	}

	//获取布阵列表
	getEmbattlePosList() {
		let list: any = {}
		for (let i in this.petInfoList) {
			let info = this.petInfoList[i]
			//0代表没有出战，1代表出战 2代表备战1 3代表备战2
			if (info.combatpos > opPetCombatPos.Rest) {
				list[info.combatpos] = info
			}
		}
		return list
	}

	//宠物资质
	getPetGrowInfo(funType, petId) {
		return GameConfig.FunGrowAddConfig[cellOptionsName[funType - 1]][petId]
	}

	//宠物资质等级 0初级
	getPetGrowList(funType, petId, petInfo?) {
		let cfgInfo = this.getPetGrowInfo(funType, petId) || {}
		let netInfo = petInfo || this.getPetInfo(petId) || {}

		let ownExp = 0
		if (funType == cellOptionsIndex.Pet) {
			ownExp = netInfo.growexp || 0
		} else if (funType == cellOptionsIndex.PetFly) { //飞升
			ownExp = netInfo.flystageexp || 0
		}

		let expList = cfgInfo.maxexp || []

		let num = 0
		let level = 0
		let curLvExp = ownExp //当前等级经验
		let needLvExp = 0 //当前等级需要经验
		for (let i in expList) {
			let maxExp = expList[i] * cfgInfo.oneexp
			if (curLvExp >= maxExp) {
				curLvExp = curLvExp - maxExp
			}

			num += maxExp
			if (ownExp < num) {
				level = tonumber(i)
				break
			}
		}

		if (ownExp >= num) {
			level = size_t(expList) - 1
			curLvExp = expList[size_t(expList) - 1] * cfgInfo.oneexp
		}

		needLvExp = expList[level] * cfgInfo.oneexp

		return [level, curLvExp, needLvExp]
	}

	//停止自动升级
	stopAutoUpgrade(petId) {
		let wnd = WngMrg.getInstance().getWindow("PetFrame")
		if (wnd.isVisible()) {
			if (wnd.getPetId() == petId && wnd.tabWndList.getTabIndex() == 0) {
				wnd.tabWndList.getCurrentWnd().stopAutoUpgrade()
			}
		}
	}

	// //资质停止自动
	// stopAutoNaturl(petId) {
	// 	let wnd = WngMrg.getInstance().getWindow("PetNaturlFrame")
	// 	if (wnd.isVisible()) {
	// 		if (wnd.petId == petId && wnd.isAuto) {
	// 			wnd.stopAutoNaturl()
	// 		}
	// 	}
	// }

	//自己宠物合成记录
	setPetUnionRecordList(list) {
		this.unionList = list
	}

	getPetUnionRecordList() {
		return this.unionList || []
	}

	//全服玩家合成记录
	setPetUnionRecordPlayerList(entryId, record) {
		table_sort(record, function (a, b) {
			let rateA = a[1] || 0
			let rateB = b[1] || 0
			return rateB - rateA
		})
		this.serverUnionList[entryId] = record
	}

	getPetUnionRecordPlayerList() {
		return this.serverUnionList || {}
	}

	//宠物已经飞升列表
	getPetFlyList() {
		let petList = []
		for (let _ in this.petActiveList) {
			let petId = this.petActiveList[_]
			let config = GameConfig.PetConfig[petId]
			if (config && config.flyskill && size_t(config.flyskill) > 0) {
				let petInfo = this.petInfoList[petId]
				if (petInfo) {
					let flyexp = petInfo.flystageexp || 0
					if (flyexp > 0) {
						table_insert(petList, petId)
					}
				}
			}
		}
		return petList
	}

	//根据经验获得宠物飞升等级
	getPetFlyStageWithExp(funType, petId, exp) {
		let cfgInfo = this.getPetGrowInfo(funType, petId)
		let netInfo = this.getPetInfo(petId) || {}
		if (!netInfo || !cfgInfo) {
			return 0
		}

		let expList = cfgInfo.maxexp
		let stage = 0
		for (let _ in expList) {
			if (exp >= expList[_] * cfgInfo.oneexp) {
				exp = exp - expList[_] * cfgInfo.oneexp
				stage = stage + 1
			} else {
				return stage
			}
		}
		return size_t(expList)
	}
}