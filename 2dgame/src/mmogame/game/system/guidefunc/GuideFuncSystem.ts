/*
作者:
    yangguiming
	
创建时间：
   2017.03.15(周三)

意图：
   引导新功能系统（红点）
公共接口：
   
*/


let GuideEquipState: any = {
	EQUIP_NORMAL: 0,  //普通
	EQUIP_NO: 1,  //没装备
	EQUIP_NEEDLEVEL: 2,  //等级不足

	EQUIP_YES: 4,  //可装备
	EQUIP_CHANGE: 5,  //可更换
	//EQUIP_CANMAKE: 6,  //可打造
	EQUIP_CANPROMOTE: 7,  //可晋升
}


class GuideFuncSystem extends BaseSystem {

	wndAndPathsToConfigList: any;
	showWndToConfigList: any;
	hideWndToConfigList: any;
	timerList: any;
	equipPosNameList: any


	manualWndTimesMap: any;
	manualCloseResultMap: any;
	dynamicTipsMap: any;
	simpleServerNotice: any[];

	applyGuideCheckMessage: any[];

	gold: number;

	public initObj(...args: any[]): void {
		this.wndAndPathsToConfigList = {}

		this.showWndToConfigList = {}
		this.hideWndToConfigList = {}

		this.timerList = {}

		RegisterEvent(EventDefine.UI_SHOW, this.onUIShowEvent, this)
		RegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)
		RegisterEvent(EventDefine.UI_CTRL_SHOW, this.onUIShowEvent, this)
		RegisterEvent(EventDefine.UI_CTRL_HIDE, this.onUIHideEvent, this)
		RegisterEvent(EventDefine.HERO_ENTER_GAME, this.onEnterGameCheck, this)



		this.onClear()
	}

	destory() {
		UnRegisterEvent(EventDefine.UI_SHOW, this.onUIShowEvent, this)
		UnRegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)
		UnRegisterEvent(EventDefine.UI_CTRL_SHOW, this.onUIShowEvent, this)
		UnRegisterEvent(EventDefine.UI_CTRL_HIDE, this.onUIHideEvent, this)
		UnRegisterEvent(EventDefine.HERO_ENTER_GAME, this.onEnterGameCheck, this)

	}


	onClear() {
		this.manualWndTimesMap = {} //手动关闭红点次数
		this.manualCloseResultMap = {} //关闭的事件记录
		this.dynamicTipsMap = {}
		this.simpleServerNotice = []

		for (let _ in this.timerList) {
			let timer = this.timerList[_]

			KillTimer(timer)
		}
		this.timerList = {}

	}

	prepareResource(workQueue) {
		GameConfig.initGuideFuncSystem(workQueue)
		workQueue.addWorkUnit(CallbackWorkUnit.newObj(this.initBtnTipsConfig, this));
	}

	initBtnTipsConfig() {

		this.wndAndPathsToConfigList = {}

		var sort_keys = Object.keys(GameConfig.ButtonTipsConfig).sort((a, b) => {
			return tonumber(a) - tonumber(b);
		})


		//for (let _ in GameConfig.ButtonTipsConfig) {
		for (let i = 0; i < sort_keys.length; i++) {
			let k = sort_keys[i]
			let v = GameConfig.ButtonTipsConfig[k]

			for (let _ = 0; _ < v.buttonList.length; _++) {
				let path = v.buttonList[_]

				let wndName = StringUtil.stringMatch(path, /(\w+)\//)[0]
				let wndinfo = WngMrg.getInstance().findWndMapInfo(wndName)
				if (wndinfo == null) {
					TLog.Error("GuideFuncSystem.initBtnTipsConfig error:%s", path)
					TLog.Assert(false)
				}
				//（一个窗口，可能多个红点对应）
				let pathsToConfigList = this.wndAndPathsToConfigList[wndName] || {}
				pathsToConfigList[path] = pathsToConfigList[path] || []
				JsUtil.arrayInstert(pathsToConfigList[path], v)

				this.wndAndPathsToConfigList[wndName] = pathsToConfigList
			}

			let closeEvent = v.manualCloseParam
			if (closeEvent.show) {
				if (this.showWndToConfigList[closeEvent.show] == null) {
					this.showWndToConfigList[closeEvent.show] = []
				}
				JsUtil.arrayInstert(this.showWndToConfigList[closeEvent.show], v)
			}

			if (closeEvent.hide) {
				if (this.hideWndToConfigList[closeEvent.hide] == null) {
					this.hideWndToConfigList[closeEvent.hide] = []
				}
				JsUtil.arrayInstert(this.hideWndToConfigList[closeEvent.hide], v)
			}

		}

	}


	getConfigList(wndName) {
		//每个BaseWnd下面，保存一个控件路径列表，每个控件路径保存一个事件检查列表
		//wndAndPathsToConfigList ={
		//	[wndName] : {
		//		[path] : {config, config,...}
		//		[path] = {config, config,...}
		//	},
		//	[wndName] = {
		//		[path] : {config, config,...}
		//		[path] = {config, config,...}
		//	},
		//}	
		return this.wndAndPathsToConfigList[wndName]
	}

	//重置为未读
	resetReadState(type, id?) {
		if (id == null)
			id = 0;

		let prefix = type + id
		IGlobal.setting.setRoleSetting(UserSetting.TYPE_NUMBER, prefix, -1)
		FireEvent(EventDefine.GUIDE_FUNC_REFRESH, null)
	}

	//设置已读状态
	setReadState(type, id?) {
		if (id == null)
			id = 0;
		let prefix = type + id
		IGlobal.setting.setRoleSetting(UserSetting.TYPE_NUMBER, prefix, 1)
		FireEvent(EventDefine.GUIDE_FUNC_REFRESH, null)
	}

	//获取读取状态
	getReadState(type, id?) {
		if (id == null)
			id = 0;
		let prefix = type + id
		return IGlobal.setting.getRoleSetting(UserSetting.TYPE_NUMBER, prefix, -1)
	}



	showDynamicTips(type) {

		for (let _ in GameConfig.ButtonTipsConfig) {
			let v = GameConfig.ButtonTipsConfig[_]

			if (v.checkEvent == GuideFuncSpace.GuideFuncCheckDefine.EVENT_DYNAMIC_TIPS) {
				if (v.checkParam.type == type) {
					let id = v.id
					delete this.manualCloseResultMap[id]
					let closeParam = v.manualCloseParam
					if (closeParam.show) {
						delete this.manualWndTimesMap[closeParam.show]
					}
					if (closeParam.hide) {
						delete this.manualWndTimesMap[closeParam.hide]
					}
				}
			}
		}

		this.dynamicTipsMap[type] = true
		FireEvent(EventDefine.GUIDE_FUNC_REFRESH, null)
	}

	hideDynamicTips(type) {
		delete this.dynamicTipsMap[type]
		FireEvent(EventDefine.GUIDE_FUNC_REFRESH, null)
	}




	handleUIEvent(wndName, wndToConfigList) {
		let configList = wndToConfigList[wndName]
		if (configList == null) {
			return
		}

		//记录打开关闭次数次数
		let times = this.manualWndTimesMap[wndName] || 0
		times = times + 1
		this.manualWndTimesMap[wndName] = times

		let bFireEvent = false
		for (let _ in configList) {
			let config = configList[_]

			if (!this.manualCloseResultMap[config.id]) {

				let allTimes = checkNull(config.manualCloseParam.times, 1)
				let result = (times >= allTimes)
				if (result) {
					this.manualCloseResultMap[config.id] = true
					bFireEvent = true

					//完成“引导”后回收（回调）
					this.recycleFuncHandler(config)
				}
			}

		}

		if (bFireEvent) {
			FireEvent(EventDefine.GUIDE_FUNC_REFRESH, null)
		}

	}

	onUIShowEvent(args) {
		this.handleUIEvent(args.window.classname, this.showWndToConfigList)
	}

	onUIHideEvent(args) {
		this.handleUIEvent(args.window.classname, this.hideWndToConfigList)
	}



	// checkEquipState(curInfo, equipType) {

	// 	if (curInfo == null) {
	// 		return GuideEquipState.EQUIP_NORMAL
	// 	}

	// 	let isHero = curInfo == GetHeroPropertyInfo()
	// 	let roleInfo = curInfo
	// 	let level = roleInfo.level

	// 	let vocationType = -1
	// 	// if (isHero) {
	// 	// 	vocationType = ProfessionSystem.getInstance().getProfessionType(curInfo.vocation)//主角
	// 	// } else {
	// 	// 	vocationType = PetSystem.getInstance().getProfessionType(curInfo.entry)//伙伴
	// 	// }


	// 	// let itemRef = this.getRecommandEquipRef(curInfo, equipType, true)
	// 	// if (itemRef) {
	// 	// 	if (ItemSystem.getInstance().isEquipPromoteType(itemRef.ItemEntry)) {
	// 	// 		return GuideEquipState.EQUIP_CANPROMOTE
	// 	// 		//}else{
	// 	// 		//	return GuideEquipState.EQUIP_CANMAKE
	// 	// 	}
	// 	// }


	// 	let curEquip = GetActorEquipByType(roleInfo, equipType) //当前部分的装备
	// 	let equipList = ItemSystem.getInstance().getEquipListByTypeAndVocation(equipType, vocationType)

	// 	//1.当前没装备
	// 	if (curEquip == null) {

	// 		let useList = []

	// 		for (let i = 0; i < equipList.length; i++) {
	// 			let v = equipList[i]

	// 			let ownerId = v.getOwnerId()
	// 			if (ownerId < 0) {
	// 				let userLevel = v.getRefProperty("uselevel")
	// 				if (userLevel <= level || v.isUseLevelIgnore() == true) {
	// 					return GuideEquipState.EQUIP_YES
	// 				}

	// 				JsUtil.arrayInstert(useList, v)
	// 			}
	// 		}

	// 		if (useList.length == 0) {
	// 			return GuideEquipState.EQUIP_NO
	// 		}

	// 		return GuideEquipState.EQUIP_NEEDLEVEL
	// 	}

	// 	//2.检查装备
	// 	//可更换:背包里的装备没人使用，使用等级小于角色等级，而且大于当前装备的等级
	// 	//可升级:背包的装备人没使用，而且大于角色等级

	// 	let bchange = false
	// 	let bneedLevel = false
	// 	let curEquipLevel = curEquip.getRefProperty("level")

	// 	for (let i = 0; i < equipList.length; i++) {
	// 		let v = equipList[i]

	// 		let ownerId = v.getOwnerId()
	// 		if (ownerId < 0) {

	// 			let userLevel = v.getRefProperty("uselevel")
	// 			let equipLevel = v.getRefProperty("level")
	// 			if (equipLevel > curEquipLevel) {

	// 				if (userLevel <= level || v.isUseLevelIgnore() == true) {
	// 					bchange = true  //背包的装备
	// 				} else {
	// 					bneedLevel = true
	// 				}

	// 			}

	// 			if (bchange || bneedLevel) {
	// 				break
	// 			}

	// 		}
	// 	}

	// 	//优先判断可更换
	// 	if (bchange) {
	// 		return GuideEquipState.EQUIP_CHANGE
	// 	}

	// 	if (bneedLevel) {
	// 		return GuideEquipState.EQUIP_NEEDLEVEL
	// 	}


	// 	return GuideEquipState.EQUIP_NORMAL

	// }

	// checkEquipInternal(curInfo) {
	// 	let info = this.checkEquip(curInfo)
	// 	return info[0]
	// }

	// checkEquip(curInfo) {
	// 	if (curInfo == null) {
	// 		return [false, GuideEquipState.EQUIP_NORMAL]
	// 	}

	// 	let equipPosTypeInfo = GetActorEquipPosTypeInfo()

	// 	for (let pos in equipPosTypeInfo) {
	// 		let type = equipPosTypeInfo[pos]

	// 		let state = this.checkEquipState(curInfo, type)
	// 		if (state >= GuideEquipState.EQUIP_YES) {
	// 			return [true, state]
	// 		}
	// 	}
	// 	return [false, GuideEquipState.EQUIP_NORMAL]
	// }

	checkXianLvUpgrade(xianlvId) {
		//let controlist = XianLvSystem.getInstance().getControlList()
		//let netInfo = XianLvSystem.getInstance().getRecvInfo(xianlvId)
		let jihuoList = XianLvSystem.getInstance().getJiHuoList()
		let level = XianLvSystem.getInstance().getLevel(xianlvId)
		let start = XianLvSystem.getInstance().getStar(xianlvId)
		let upgradeConfig = GameConfig.FunUpgradeStageConfig["XianLv"][level]

		let isJiHuo = table_isExist(jihuoList, xianlvId)
		if (isJiHuo == false) {
			//激活
			let jiHuoItem = GameConfig.ActorXianLvConfig[xianlvId].itemid
			let jiHuoCost = GameConfig.ActorXianLvConfig[xianlvId].itemnum
			let jiHuoHad = ItemSystem.getInstance().getItemCount(jiHuoItem)
			if (jiHuoHad >= jiHuoCost) {
				return true
			}
			return false
		}

		//出站
		if (XianLvSystem.getInstance().isExit(xianlvId) == false) return false
		let fightList = XianLvSystem.getInstance().getFightList()
		let count = 0
		for (let k in fightList) {
			if (fightList[k] > 0) {
				count += 1
			}
		}
		if (count < 2) {
			if (fightList[xianlvId] == 0 || fightList[xianlvId] == null) {
				return true
			}
		}

		//升阶
		let maxLevel = elemUpgradeStageOptions[cellOptionsIndex.XianLv].MaxLevel
		if (level >= maxLevel) {
			return false
		}
		let upHad = ItemSystem.getInstance().getItemCount(upgradeConfig.itemid)
		if (upHad >= upgradeConfig.itemnum) {
			let hadMoney = GetHeroMoney(upgradeConfig.moneyunit)
			if (hadMoney < upgradeConfig.money) {
				return false
			}
			return true
		}



		return false
	}

	checkXialvUpStart(xianlvId) {
		//let controlist = XianLvSystem.getInstance().getControlList()
		//let netInfo = XianLvSystem.getInstance().getRecvInfo(xianlvId)
		let jihuoList = XianLvSystem.getInstance().getJiHuoList()
		let level = XianLvSystem.getInstance().getLevel(xianlvId)
		let start = XianLvSystem.getInstance().getStar(xianlvId)
		let upgradeConfig = GameConfig.FunUpgradeStageConfig["XianLv"][level]

		let isJiHuo = table_isExist(jihuoList, xianlvId)
		if (isJiHuo == false) {
			//激活
			let jiHuoItem = GameConfig.ActorXianLvConfig[xianlvId].itemid
			let jiHuoCost = GameConfig.ActorXianLvConfig[xianlvId].itemnum
			let jiHuoHad = ItemSystem.getInstance().getItemCount(jiHuoItem)
			if (jiHuoHad >= jiHuoCost) {
				return true
			}
			return false
		}

		//出站
		if (XianLvSystem.getInstance().isExit(xianlvId) == false) return false
		let fightList = XianLvSystem.getInstance().getFightList()
		let count = 0
		for (let k in fightList) {
			if (fightList[k] > 0) {
				count += 1
			}
		}
		if (count < 2) {
			if (fightList[xianlvId] == 0 || fightList[xianlvId] == null) {
				return true
			}
		}

		//升星
		let maxStar = elemUpgradeStageOptions[cellOptionsIndex.XianLvStart].MaxLevel
		if (start >= maxStar) {
			return false
		}
		let starItem = GameConfig.FunUpStarConfig["XianLv"][xianlvId].itemid
		let starHad = ItemSystem.getInstance().getItemCount(starItem)
		let upStartConfig = GameConfig.FunLevelNumConfig["XianLvStartUp"][start]
		if (upStartConfig == null) return false
		let starCost = upStartConfig.num
		if (starHad >= starCost) {
			return true
		}

		return false
	}


	checkHeroTitle(title) {
		let itemId = title.itemid
		let itemnum = title.itemnum
		let had = ItemSystem.getInstance().getItemCount(itemId)
		return had >= itemnum
	}

	checkTianXianDanYao(danInfo) {
		let danyaoHad = ItemSystem.getInstance().getItemCount(danInfo.itemid)
		if (danyaoHad >= danInfo.itemnum) {
			return true
		}
		return false
	}

	checkFabao(pos) {
		//是否可以穿戴
		let level = GetHeroProperty("level")
		let vip = GetHeroProperty("VIP_level")
		let VIPUnLockList = opTailsmanPosLimit.VIPUnLockList

		let levelUnLockList = opTailsmanPosLimit.levelUnLockList
		let unLock = false
		if (level >= levelUnLockList[pos - 1] || vip >= VIPUnLockList[pos - 1]) {
			unLock = true
		}

		let item = RoleSystem.getInstance().getFaBaoItem(pos)
		if (item == null && unLock == true) {
			let itemType = opItemType.ROLE_ALLSMAN
			let list = ItemSystem.getInstance().getItemLogicInfoByType(itemType)
			let check = false
			for (let k in list) {
				let item: Item = list[k]
				check = RoleSystem.getInstance().checkFaBaoItem(item.entryId, pos)
				if (check) {
					break
				}
			}
			if (size_t(list) != 0 && check == true) {
				return true
			}
		}

		//是否可以升级
		if (item == null) return false
		let levelList = RoleSystem.getInstance().getFaBaoInfoByKey("talismanLevelList")
		if (levelList == null || size_t(levelList) == 0) return false
		let stage = levelList[pos + opTalismanEquipPos.begin - 1]
		let upConfig = GameConfig.TalismanEquipUpConfig
		let maxLevel = elemTalismanConfig.maxUpLevel
		if (stage >= maxLevel) return false
		let config = upConfig[stage]
		let needNum = config.needNum
		let had = ItemSystem.getInstance().getItemCount(config.entryId)
		if (had >= needNum) {
			return true
		}

		return false
	}

	//充值活动可领奖
	checkPayActivityPrize() {
		let prizeState: any = {}

		let allList = ActivitySystem.getInstance().getAllRechergeActivity()
		for (let _ in allList) {
			let index = allList[_]

			if (ActivitySystem.getInstance().isPayActivityIndex(index)) {					//只检查充值相关活动
				let info = ActivitySystem.getInstance().getOperateActivityInfo(index)
				let plrinfo = ActivitySystem.getInstance().getOperatePlayerInfo(index)

				if (info) {
					if (index == PayActivityIndex.CREATE_ROLE_SEVEN_DAY ||										//创角七日每天冲值
						index == PayActivityIndex.LIMIT_SINGLE_DAY_PAY_PRIZE || 							//限时每日冲值
						index == PayActivityIndex.LIMIT_SINGLE_DAY_CONSUME_PRIZE ||					//限时每日消费
						index == PayActivityIndex.ACCUM_PAY_PRIZE ||													//累计冲值
						index == PayActivityIndex.ACCUM_CONSUME_PRIZE ||										//累计消费
						index == PayActivityIndex.DAY_ACCUM_PAY_PRIZE ||										//每日累计冲值
						index == PayActivityIndex.DAY_ACCUM_CONSUME_PRIZE) {								//每日累计消费

						let list = info.prizeList
						for (let k = 0; k < list.length; k++) {
							let v = list[k]

							let reachvalue = 0	//0是没有达到 1是达到了没有领取 2是领取了//
							if (plrinfo != null) {
								reachvalue = plrinfo.reachlist[k] || 0
							}

							if (reachvalue == 1) {
								prizeState[index] = true
								break
							}
						}
					} else if (index == PayActivityIndex.SINGLE_PAY_PRIZE ||				//单笔冲值返回物品列表
						index == PayActivityIndex.SINGLE_CONSUME_PRIZE) {			//单笔消费返回物品列表

						let list = info.prizeList
						for (let k = 0; k < list.length; k++) {
							let v = list[k]

							let getTimes = 0 //单笔奖励次数
							if (plrinfo) {
								getTimes = plrinfo.reachlist[k] || 0
							}

							if (getTimes > 0) {
								prizeState[index] = true
								break
							}
						}
					}
				}
			}
		}

		return prizeState
	}


	checkCommonFunc(func, param, args) {
		let curInfo = null
		if (args) {
			curInfo = args.curInfo
		}

		let exceptInfo = null
		if ((param.except == "current") && curInfo) {
			exceptInfo = curInfo
		}

		if (exceptInfo != curInfo && curInfo) {
			return func.call(this, curInfo, param, true) //传入true，是正在选中的
		}

		// let heroInfo = GetHeroPropertyInfo()
		// if (exceptInfo != heroInfo && func.call(this, heroInfo, param)) {
		// 	return true
		// }
		if (param.type == "pet") {
			let petInfoList = PetSystem.getInstance().getPetInfoList()
			for (let id in petInfoList) {
				let petInfo = petInfoList[id]

				if (exceptInfo != petInfo && func.call(this, petInfo, param)) {
					return true
				}
			}
		} else if (param.type == "xianlv") {
			let xianlvInfoList = XianLvSystem.getInstance().getJiHuoList()
			for (let i in xianlvInfoList) {
				let xianlvInfo = xianlvInfoList[i]

				if (exceptInfo != xianlvInfo && func.call(this, xianlvInfo, param)) {
					return true
				}
			}
		}



		return false


	}


	checkFunc(config, args, event?) {
		//if(! GuideSystem.getInstance().isFinishGuide()  ){
		//	return false
		//}

		if (this.manualCloseResultMap[config.id]) {
			return false
		}

		let checkEvent = config.checkEvent
		let checkParam = config.checkParam

		if (GuideFuncSpace.guideFuncCheckHandler[checkEvent]) {
			if (checkParam.check) {
				let [check, _] = CheckMainFrameFunction(checkParam.check)
				if (check == false) {
					return false
				}
			}

			if (checkParam.checkCamp) {
				let check = CampaignSystem.getInstance().isCampaignPass(checkParam.checkCamp)
				if (check == false) {
					return false
				}
			}

			if (checkParam.checkLevel) {
				let heroLevel = GetHeroProperty("level") || 0
				if (heroLevel < checkParam.checkLevel) {
					return false
				}

			}

			return GuideFuncSpace.guideFuncCheckHandler[checkEvent].call(this, checkParam, args, event)
		} else {
			TLog.Debug("the check handler is null!		%s", checkEvent)
			TLog.Throw()
		}
	}



	recycleFuncHandler(config) {
		let checkEvent = config.checkEvent
		let checkParam = config.checkParam

		if (GuideFuncSpace.recycleFuncHandler[checkEvent]) {
			if (checkParam.check) {
				let [check, _] = CheckMainFrameFunction(checkParam.check)
				if (check == false) {
					return
				}
			}

			return GuideFuncSpace.recycleFuncHandler[checkEvent].call(this, config, checkParam)
		}
	}



	////////////////////////////////////////////////////////////////////-回收、作引导记录//////////////////////////////////////-
	//简易性突发提示（服务器即时通知）
	onRecvServerNotice(notice) {
		for (let _ in notice) {
			let v = notice[_]

			if (!table_isExist(this.simpleServerNotice, v)) {
				table_insert(this.simpleServerNotice, v)
			}
		}
	}

	getServerNotice() {
		return this.simpleServerNotice || []
	}
	//////////////////////////////////////////////////////////////////
	//控制流畅，登录后依次申请相关的数据


	onCheckActivity(applyGuideCheckMessage) {

		function applyBossActivity() {
			RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.MaterialBoss)
			RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.DragonBoss)
			RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.SmallThunderTemple)
			RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.HeavenTrial)
			RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.PersonBoss)
			RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.WorldPlayerBoss)
			RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.WildBoss)
			RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.ZhongKuiDemon)
			RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.FactionMonster)
			RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.ServerTeam)
			RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.FactInstZones)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyBossActivity)
	}

	onEnterGameCheck(args) {
		if (this.timerList["apply"]) {
			KillTimer(this.timerList["apply"])
			delete this.timerList["apply"]
		}

		if (IsInGlobalActvity() != null) {
			return
		}
		let applyGuideCheckMessage = []

		this.onCheckActivity(applyGuideCheckMessage)

		//送元宝
		function applyPayPrizeInfo7() {
			RpcProxy.call("C2G_SendOperatePlayerData", PayActivityIndex.DAILY_LOGIN)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo7)

		//首充
		function applyPayPrizeInfo8() {
			PaySystem.getInstance().setFirstInto()
			RpcProxy.call("C2G_SendOperatePlayerData", PayActivityIndex.FIRST_PAY)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo8)

		//十元购
		function applyPayPrizeInfo27() {
			RpcProxy.call("C2G_SendOperatePlayerData", PayActivityIndex.TEN_YUAN_GIFT)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo27)

		//成长计划
		function applyPayPrizeInfo6() {
			PaySystem.getInstance().setChengZhangFirstInto()
			RpcProxy.call("C2G_SendOperatePlayerData", PayActivityIndex.LEVEL_FUNDS)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo6)

		//生死劫
		function shengSiJie() {
			RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.LifeAndDeathBoss)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, shengSiJie)

		//月卡信息
		function applyPayPrizeInfo9() {
			RpcProxy.call("C2G_MonthCardInfo")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo9)

		//周卡信息
		function applyPayPrizeInfo10() {
			RpcProxy.call("C2G_WeekCardInfo")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo10)

		//日常三百
		function applyPayPrizeInfo12() {
			RpcProxy.call("C2G_MEIRISANBAI_MonsterNum")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo12)

		//日常历练
		function applyPayPrizeInfo13() {
			RpcProxy.call("C2G_XiyouLilian_Info")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo13)
		//日常组队
		function applyDailyZuDui() {
			RpcProxy.call("C2G_ZUDUILILIAN_GOCOMBAT")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyDailyZuDui)

		//每日首充
		function applyPayPrizeInfo11() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.EVERY_MIXACCU_RECHARGE)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo11)

		//直升一阶
		function applyPayPrizeInfo25() {
			RpcProxy.call("C2G_SendOperatePlayerData", PayActivityIndex.STAGE_UP)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo25)

		//今日豪礼
		function applyPayPrizeInfo26() {
			RpcProxy.call("C2G_SendOperatePlayerData", PayActivityIndex.DAILY_EXPENSIVE_GIFT)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo26)

		//累计充值
		function applyPayPrizeInfo28() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.ACCUM_PAY_PRIZE)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo28)

		//神宠来袭
		function applyPayPrizeInfo29() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.GOD_PET_INCOME)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo29)

		//投资计划
		function applyPayPrizeInfo30() {
			RpcProxy.call("C2G_SendOperatePlayerData", PayActivityIndex.INVEST_PLAN)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo30)

		//幸运转盘
		function applyPayPrizeInfo31() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.PET_LOTTERY)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo31)

		//护送
		function applyPayPrizeInfo14() {
			RpcProxy.call("C2G_EnterEscortActivity")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo14)

		//房子信息
		function applyPayPrizeInfo15() {
			RpcProxy.call("C2G_UpdateHourse")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo15)

		//师徒信息
		function applyPayPrizeInfo16() {
			RpcProxy.call("C2G_UpdateShitu")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo16)

		//师徒邀请信息
		function applyPayPrizeInfo17() {
			RpcProxy.call("C2G_ShiTuYaoQinList")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo17)

		//宠物兑换
		function applyPayPrizeInfo18() {
			RpcProxy.call("C2G_FactionExchangeItemList", 0)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo18)

		//竞技场
		function applyPayPrizeInfo19() {
			RpcProxy.call("C2G_GetChampionData")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo19)
		//帮会上香
		function applyPayPrizeInfo21() {
			RpcProxy.call("C2G_FactionRenqiInfo")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo21)
		//狂欢进阶
		function applyPayPrizeInfo22() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.EVERY_STAGE_A)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo22)
		//狂欢进阶B
		function applyPayPrizeInfo23() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.EVERY_STAGE_B)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo23)
		//狂汗累充
		function applyPayPrizeInfo24() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.MIX_ACCU_RECHARGE)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo24)
		//狂欢副本
		function applyPayPrizeInfo54() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NORMAL_INST_ZONES)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayPrizeInfo54)

		function applyPayEscort() {
			RpcProxy.call("C2G_EnterEscortActivity")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayEscort)

		//新服进阶活动
		function applyPayNewStageUp() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NEW_SERVER_STAGE_LEVEL_UP)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayNewStageUp)
		//开服全民进阶活动
		function applyPayNewAllStageUp() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NEW_SERVER_ALL_STAGE_UP)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayNewAllStageUp)
		//开服全名团购
		function applyPayNewAllBuy() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NEW_SERVER_ALL_BUY)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayNewAllBuy)
		//开服折扣商店
		function applyPayNewShopDiscount() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayNewShopDiscount)
		//开服累充
		function applyPayNewLeiChong() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayNewLeiChong)
		//全民升级
		function applyPayNewAllLevelUp() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NEW_SERVER_ALL_LEVEL_UP)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayNewAllLevelUp)
		//升级副本
		function applyPayNewInstZones() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NEW_SERVER_INST_ZONES)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayNewInstZones)
		//进阶排行活动
		function applyPayNewStageRank() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NEW_SERVER_STAGE_UP_RANK)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayNewStageRank)
		//龙宫章节
		function applyPayNewMission() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.NEW_SERVER_MISSION)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPayNewMission)

		//护送奖励
		function applyHuSongPrize() {
			RpcProxy.call("C2G_GetEscortPrizeInfo")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyHuSongPrize)

		//vip奖励
		function applyVIPPrize() {
			RpcProxy.call("C2G_RechageRewardInfo")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyVIPPrize)

		function applyShopBuyList() {
			RpcProxy.call("C2G_SHOP_SELL_LIST")
			RpcProxy.call("C2G_SHOP_ConditionInfo")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyShopBuyList)

		//帮会技能
		function applyClubSkill() {
			RpcProxy.call("C2G_FactionSkillInfo")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyClubSkill)

		//幸运豪礼
		function applyLuckyPrize() {
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.Fallen_Good_Gift_Recharge)
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyLuckyPrize)

		//天下第一
		function applyPeerless() {
			RpcProxy.call("C2G_WorldOne_CanInsertGame")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyPeerless)

		//帮会仓库
		function applyClubStore() {
			RpcProxy.call("C2G_FactionWareHouseItemList")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyClubStore)

		//据点开采记录
		function applyStrongholdRecord() {
			RpcProxy.call("C2G_StrongholdRecord")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyStrongholdRecord)

		//据点boss是否开启，是否可占领
		function applyStrongholdStatus() {
			RpcProxy.call("C2G_StrongholdRedpoint")
		}
		JsUtil.arrayInstert(applyGuideCheckMessage, applyStrongholdStatus)

		let count = applyGuideCheckMessage.length
		let i = 0
		function tick(delay) {
			let func = applyGuideCheckMessage[i]
			if (!func) {
				if (this.timerList["apply"]) {
					KillTimer(this.timerList["apply"])
					delete this.timerList["apply"]
				}
			} else {
				func.call(this)
				i = i + 1
			}
		}
		this.timerList["apply"] = SetTimer(tick, this, 0.5 * 1000, false)
		// this.resetReadState(GuideFuncSpace.GuideFuncReadTypeDefine.SHOP_SELL)
		// this.resetReadState(GuideFuncSpace.GuideFuncReadTypeDefine.ACTIVATE_GIFT)

		let petList = PetSystem.getInstance().getPetTiredList()
		for (let i in petList) {
			this.resetReadState(GuideFuncSpace.GuideFuncReadTypeDefine.PET_ACTIVE, petList[i])
		}

		this.resetReadState(GuideFuncSpace.GuideFuncReadTypeDefine.CLUB_STORE, 1)
	}

	//////通用//////////////////////////////////////////////////////////////
	checkOneFunEquip(funType, pos) {
		if (!funType) {
			return false
		}

		let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
		if (!funInfo) {
			return false
		}
		let funStage = funInfo.stage || 1
		let subType = FunSystem.getInstance().getFunSubTypeWithPos(funType, pos)
		//可穿戴装备列表
		let equipList = ItemSystem.getInstance().getFunEquipListWithStage(subType, funStage)
		//已穿戴装备
		let wearEquip = FunSystem.getInstance().getWearEquipWithPos(funType, subType)
		let wearForce = 0
		if (wearEquip && wearEquip.getProperty("entry")) {
			wearForce = GetForceMath(GetFunEquipProperty(wearEquip.getProperty("entry"), wearEquip.getProperty("quality"), wearEquip.getProperty("add_num")))
		}

		let canwear = false
		for (let i in equipList) {
			let equip = <Item>equipList[i]
			let equipForce = GetForceMath(GetFunEquipProperty(equip.entryId, equip.getProperty("quality"), equip.getProperty("add_num")))
			if (wearForce < equipForce) {
				canwear = true
				break
			}
		}
		return canwear
	}

	checkOneFunSkill(funType, pos) {
		if (!funType) {
			return false
		}

		let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
		if (!funInfo) {
			return false
		}

		let skillInfo = FunSystem.getInstance().getFunSkillConfigWithPos(funType, pos + 1)
		let skillList = funInfo.skilllevellist
		let skillLevel = skillList[pos] || 0
		if (skillLevel == 0) { //未解锁
			return false
		}
		else {
			let materialId = skillInfo.itemid
			let info = FunSystem.getInstance().getFunSkillMaterialWithLv(funType, skillLevel)
			if (info == null) return false
			let needCount = info.num
			let ownCount = ItemSystem.getInstance().getItemCount(materialId) || 0
			if (ownCount >= needCount) {
				return true
			}
		}

		return false
	}

	checkFunUpgrade(funType) {
		if (!funType) {
			return false
		}

		let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
		if (!funInfo) {
			return false
		}

		let maxStage = size_t(GameConfig.FunUpgradeStageConfig[cellOptionsName[funType - 1]])
		let curStage = funInfo.stage
		if (curStage >= maxStage) { //满级了
			return false
		}

		let material = FunSystem.getInstance().getFunUpgradeMaterial(funType, funInfo.stage)
		let ownNum = ItemSystem.getInstance().getItemCount(material.itemId)
		let needNum = material.itemNum

		let needMoney = material.money
		let ownMoney = GetHeroMoney(material.moneyUnit)

		if (ownNum >= needNum && ownMoney >= needMoney) {
			return true
		}
		return false
	}

	////////宠物////////////////////////////////////////////////////////////////////
	checkPetUpgrade(petId) {
		let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(petId)
		let petNetInfo = PetSystem.getInstance().getPetInfo(petId)

		if (!petNetInfo) {
			return false
		}

		let material = FunSystem.getInstance().getFunUpgradeMaterial(cellOptionsIndex.Pet, petNetInfo.stage)
		let ownCount = ItemSystem.getInstance().getItemCount(material.itemId)
		let needCount = material.itemNum
		let ownFunds = GetHeroProperty("funds")
		let needFunds = material.money

		return ownCount >= needCount && ownFunds >= needFunds && !this.checkPetFullLv(petId)
	}

	checkPetEmbattle(petId) {
		let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(petId)
		let petNetInfo = PetSystem.getInstance().getPetInfo(petId)
		if (!petNetInfo) {
			return false
		}

		let combatPos = petNetInfo.combatpos || opPetCombatPos.Rest

		//0代表没有出战，1代表出战 2代表备战1 3代表备战2
		let posList = PetSystem.getInstance().getEmbattlePosList()
		if (size_t(posList) < 3 && combatPos == opPetCombatPos.Rest) {
			return true
		} else {
			return false
		}
	}

	checkPetUpgradeWnd(petId) {
		let check = false
		let checkFuncs = [this.checkPetUpgrade, this.checkPetEmbattle, this.checkPetNaturl, this.checkPetActive, this.checkPetFly]
		for (let i in checkFuncs) {
			let func = checkFuncs[i]
			if (func.call(this, petId)) {
				return true
			}
		}
		return check
	}

	checkPetSkillWnd(petId) {
		return false
	}


	//属性丹
	checkPropertyDan(funType) {
		if (!funType) {
			return false
		}

		let drugConfig = GameConfig.FunAbilityDrugConfig[cellOptionsName[funType - 1]];
		let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
		if (!drugConfig || !funInfo) {
			return false
		}
		let danId = drugConfig["itemid"]
		let max = elemAbilityDrugOptions.def.MaxLevel
		let realMaxCount = max - funInfo.drugnum
		if (realMaxCount == 0) return false
		let itemCount = ItemSystem.getInstance().getItemCount(danId)
		return itemCount > 0
	}

	//皮肤
	checkFunSkin(funType) {
		if (!funType) {
			return false
		}

		let skinConfig = GameConfig.FunSkinConfig[cellOptionsName[funType - 1]]
		let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
		if (!skinConfig || !funInfo) {
			return false
		}
		let jihuoList = funInfo.skinlist
		for (let k in skinConfig) {
			let skin = skinConfig[k]
			if (table_isExist(jihuoList, skin.Index) == true) continue
			let costNum = skin.itemnum
			let had = ItemSystem.getInstance().getItemCount(skin.itemid)
			if (had >= costNum) {
				return true
			}
		}
		return false
	}

	//宠物资质
	checkPetNaturl(petId) {
		let petNetInfo = PetSystem.getInstance().getPetInfo(petId)
		if (!petNetInfo) {
			return false
		}

		let funType = cellOptionsIndex.Pet
		let growInfo = PetSystem.getInstance().getPetGrowInfo(funType, petId)
		if (!growInfo) {
			return false
		}

		let growList = PetSystem.getInstance().getPetGrowList(funType, petId)
		let level = growList[0]
		let curExp = growList[1]
		let needExp = growList[2]

		if ((level == size_t(growInfo.maxexp) - 1) && curExp >= needExp) { //满级
			return false
		}

		let itemId = growInfo.itemid
		let itemCount = ItemSystem.getInstance().getItemCount(itemId) || 0
		let needCount = growInfo.itemnum

		return itemCount >= needCount
	}

	//宠物激活
	checkPetActive(petId) {
		let petConfig = PetSystem.getInstance().getPetEntryInfo(petId)
		if (!petConfig) {
			return false
		}

		let petNetInfo = PetSystem.getInstance().getPetInfo(petId)
		if (petNetInfo) {
			return false
		}

		let itemId = petConfig.itemid
		let itemCount = ItemSystem.getInstance().getItemCount(itemId) || 0
		let needCount = petConfig.itemnum

		let useLevel = ItemSystem.getInstance().getItemUseLevel(itemId) || 0
		let heroLevel = GetHeroProperty("level")

		if ((heroLevel < useLevel) && (itemCount >= needCount)) {
			if (this.getReadState(GuideFuncSpace.GuideFuncReadTypeDefine.PET_ACTIVE, petId) > 0) {
				return false
			}
		}

		if (itemCount >= needCount) {
			return true
		}

		return false
	}

	//帮会兑换
	checkClubExchange(index) {
		let exchangeInfo = GetActivity(ActivityDefine.ClubMap).getExchangeData()
		let array = exchangeInfo.array || []
		if (size_t(array) == 0) {
			return false
		}

		let record = getSaveRecord(opSaveRecordKey.facExchange) || {}
		if (record[100 + index] == 1) { //已兑换
			return false
		}

		let config = GameConfig.FactionExchangeConfig[array[index]].exchange
		let itemList = AnalyPrizeFormat(config)
		let canchange = true
		for (let i in itemList) {
			let item = itemList[i]
			let itemId = item[0]
			let itemCount = item[1]
			let ownCount = ItemSystem.getInstance().getItemCount(itemId)
			if (ownCount < itemCount) {
				canchange = false
				break
			}
		}

		if (canchange) {
			return true
		}

		return false
	}

	//日常 判断是否可以领取
	checkDailyXiangYao() {
		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.ZhongKuiDemon)
		if (actInfo == null) return false
		let count = actInfo.killCount
		if (count < dailyOptions.xiangyaoMaxCount) {
			return false
		}

		//够条件
		if (actInfo.prizeFlag == 1) {
			return false
		}
		return true
	}

	checkDailySanBai() {
		let actInfo = GetActivity(ActivityDefine.Boss).getSanBaiInfo()
		if (actInfo == null) return false
		//如果是vip
		if (actInfo.state >= 3) return false
		if (actInfo.isVip == 1) {
			return true
		}

		let curhuan = actInfo.curhuan

		if (curhuan >= dailyOptions.sanbaiFirstCount && actInfo.state < 1) {
			return true
		}

		if (curhuan >= dailyOptions.sanbaiSecondCount && actInfo.state < 2) {
			return true
		}

		if (curhuan >= dailyOptions.sanbaiMaxCount && actInfo.state < 3) {
			return true
		}
		return false
	}

	checkDailyZuDui() {
		let actInfo = GetActivity(ActivityDefine.Boss).getLiLianInfo()
		if (actInfo == null) return false
		//可以领取
		let state = actInfo.state
		if (state == 1) return false
		if ((state == 0 && actInfo.isVip == 1) || (state == 0 && actInfo.twice >= dailyOptions.zuduiMaxCount)) {
			return true
		}
		return false
	}

	checkDailyZuDuiIsDouble() {
		//return ItemSystem.getInstance().isEquipPacketAlmostFull()
		/*let actInfo = GetActivity(ActivityDefine.Boss).getLiLianInfo()
		if (actInfo == null) return false
		if (actInfo.isDouble == 2) {
			return true
		}*/
		let stateInfo = GetActivityTimeState(OrdinaryActivityIndex.ServerTeam)
		if (stateInfo && stateInfo.state == ActivityTimeState.ONGOING) {
			return true
		}
		return false
	}

	//帮会上香奖励
	checkIncensePrize(index) {
		//帮会香火进度奖励可领取
		let renqiData = ClubSystem.getInstance().getClubRenqiInfo()

		if (renqiData == null)
			return false;

		let todayRenqiExp = renqiData.renqiExp //香火值
		let dailyRecord = getSaveRecord(opSaveRecordKey.facDailyRenqiPrize) || []
		let config = GameConfig.FactionRenqiPrizeConfig[index]
		let renqi = config.renqi
		let hadGet = dailyRecord[config.ID] == 1
		if (todayRenqiExp >= renqi && !hadGet) {
			return true
		}
		return false
	}

	//帮会任务完成未领奖
	checkClubTaskFinish(type) {
		let clubInfo = ClubSystem.getInstance().getCurClubInfo()
		if (!clubInfo) {
			return false
		}
		//完成次数
		let recordList = getSaveRecord(opSaveRecordKey.facMapTaskFinishCount) || []
		let times = recordList[type] || 0
		let limit = GameConfig.FactionMapTaskConfig[type][clubInfo.level].maxCount

		//奖励记录
		let prizeList = getSaveRecord(opSaveRecordKey.facMapTaskPrizeGet) || []
		let record = prizeList[type] || 0

		return (times == limit) && (record != 1)
	}

	//帮会活跃升级
	checkClubActiveUpgrade() {
		let activeData = ClubSystem.getInstance().getClubActiveInfo()
		if (!activeData) {
			return false
		}
		let curActiveLevel = activeData.level
		let curLvConfig = GameConfig.FactionActiveLevelConfig[curActiveLevel]
		return activeData.exp >= curLvConfig.exp
	}

	//每日奖励未领取
	checkClubActivePrize(index) {
		let config = GameConfig.FactionActiveDailyiPrizeConfig[index]

		let dailyExp = getSaveRecord(opSaveRecordKey.facDailyActiveExp) || 0 //每日活跃经验
		let prizeRecord = getSaveRecord(opSaveRecordKey.facDailyActivePrize) || {}

		if (dailyExp < config.dailyExp) { //未达成
			return false
		} else if (prizeRecord[config.ID] == null) { //已达成，未领取
			return true
		} else {//已达成，已领取
			return false
		}
	}

	//捐献天工木
	checkClubDonate() {
		let list = ItemSystem.getInstance().getFactionMaterial()
		return size_t(list) > 0
	}

	//帮会申请
	checkClubApply() {
		if (!ClubSystem.getInstance().isHaveClubJurisdiction()) {
			return false
		}
		let list = ClubSystem.getInstance().getApplyList()
		return size_t(list) > 0
	}

	//商店解锁
	checkShopUnlock(shopEntry) {
		if (shopEntry == null) return false
		let check = ShopSystem.getInstance().isCheckDots()
		if (!check) return false
		let shopItemList = ShopSystem.getInstance().getShopItemList(shopEntry)
		for (let k in shopItemList) {
			let shopInfo = shopItemList[k]
			// //如果是皮肤， 判断是否拥有或者激活
			// let skin = shopInfo.skin
			// let isSkin = size_t(skin) != 0
			// if (isSkin) {
			// 	let check = RoleSystem.getInstance().checkSkinExist(skin[0], skin[1])
			// 	let count = ItemSystem.getInstance().getItemCount(shopInfo.itemEntry)
			// 	if (check || count >= 1) {
			// 		continue
			// 	}
			// }
			// //如果拥有仙侣
			// let xianlvId = shopInfo.xianlvId || 0
			// if (xianlvId != 0) {
			// 	let itemEntry = shopInfo.itemEntry
			// 	let count = ItemSystem.getInstance().getItemCount(shopInfo.itemEntry)
			// 	let check = XianLvSystem.getInstance().isExit(xianlvId)
			// 	if (check || count >= 1) {
			// 		continue
			// 	}
			// }

			let cost = shopInfo.price
			let had = 0
			if (shopInfo.money != 0) {
				had = GetHeroMoney(shopInfo.money)
			} else {
				had = ItemSystem.getInstance().getItemCount(shopInfo.unit)
			}
			if (had < cost) continue
			let v = ShopSystem.getInstance().getJudgeSuoLimit(shopEntry, shopInfo.Index)
			if (v == "") return false
			let limitTwice = ShopSystem.getInstance().getLimitTwice(shopEntry, shopInfo.Index)
			let limit = shopInfo[v]
			let check = ShopSystem.getInstance().getJudgeIsEnough(v, limit)
			let buyInfo = ShopSystem.getInstance().getShopPosInfo(shopEntry, shopInfo.Index)
			if (check) {
				if (buyInfo != null) {
					if (buyInfo.count >= limitTwice) continue
				}
				return true
			}
		}

		return false
	}

	checkShopEquip(shopEntry) {
		if (shopEntry == null) return false
		//判断是否是40.60.80
		if (shopEntry >= ShopSystem.CHECK_ENTRY_START && shopEntry <= ShopSystem.CHECK_ENTRY_END) {
			let itemList = ShopSystem.getInstance().getShopItemList(shopEntry)
			if (itemList == null || size_t(itemList) == 0) return false
			for (let k in itemList) {
				let tempInfo = itemList[k]
				let check = this.checkShopEquipSingle(tempInfo)
				if (check) {
					return check
				}
			}
		}
		return false
	}

	checkShopEquipSingle(tempInfo) {
		//买过了
		let buyInfo = ShopSystem.getInstance().getShopPosInfo(tempInfo.shopEntry, tempInfo.Index)
		if (buyInfo != null) {
			return false
		}
		//判断是否可以穿
		let itemInfo: any = {}
		itemInfo.entry = tempInfo.itemEntry
		itemInfo.quality = tempInfo.quality || 1
		let item = Item.newObj(itemInfo)
		ItemSystem.getInstance().calcEquipForce(item)

		let useLevel = item.getRefProperty("uselevel")
		let heroLevel = GetHeroProperty("level")
		if (heroLevel < useLevel) return false
		let price = tempInfo.price * tempInfo.discount
		let had = 0
		if (tempInfo.money != 0) {
			had = GetHeroMoney(tempInfo.money)
		} else {
			had = ItemSystem.getInstance().getItemCount(tempInfo.unit)
		}
		if (price == 0) return false

		let subtype = item.getRefProperty("subtype")
		let eForce = 0
		let roleEquip = RoleSystem.getInstance().getRoleEquipItem(subtype)
		if (roleEquip != null) {
			eForce = roleEquip.force
		}
		let itemForce = item.force || 0
		if (had >= price && itemForce > eForce) {
			return true
		}

		return false
	}


	//狂欢进阶 ----只判断是否够条件
	checkCarnivalFunUpgrade(tempConfig) {
		let isRecharge = tempConfig.stageUp == null ? true : false //判断是否是累充
		if (isRecharge) {
			let charYuanBao = getSaveRecord(opSaveRecordKey.dailyRecharge)
			if (charYuanBao == null) return false
			return charYuanBao >= tempConfig.point
		}

		let funIndex = cellOptionsIndex[tempConfig.stageUp]
		let funInfo = FunSystem.getInstance().getFunInfoWithType(funIndex)
		if (funInfo == null) return false
		let state = funInfo.stage >= tempConfig.cond ? true : false
		return state

	}

	checkHuSong() {
		let actInfo = GetActivity(ActivityDefine.HuSong).getActInfo()
		if (actInfo == null || actInfo.husongTwice == null) return false
		if (actInfo.husongTwice > 0) {
			return true
		}

		//检查是否可以领取奖励
		let husongList = GetActivity(ActivityDefine.HuSong).getHuSongList() || {}
		let id = GetHeroProperty("id")
		for (let k in husongList) {
			let husongInfo = husongList[k]
			if (husongInfo.id == id && husongInfo.time <= GetServerTime()) {
				return true
			}
		}

		let t = GetActivity(ActivityDefine.HuSong).getIsPrize()

		return t
	}

	//直升丹
	checkShootUp(_type) {
		if ((GetServerDay() >= 8)) { //直升丹8天后结束
			return false
		}

		let useItemIdList = ItemSystem.getInstance().getCanUseItemList()
		for (let i in useItemIdList) {
			let itemId = useItemIdList[i]
			let item = ItemSystem.getInstance().getItemLogicInfoByID(itemId)
			if (!item) {
				continue
			}

			if (item.getRefProperty("action") == "stageLevelUp") {
				let itemEffects = item.getRefProperty("effects")
				if (itemEffects[0][0] == _type) {
					return true
				}
			}
		}
		return false
	}

	//宠物满级
	checkPetFullLv(petId) {
		let petNetInfo = PetSystem.getInstance().getPetInfo(petId)
		if (!petNetInfo) {
			return false
		}

		let stage = petNetInfo.stage
		let key = cellOptionsName[cellOptionsIndex.Pet - 1]
		if (stage >= size_t(GameConfig.FunUpgradeStageConfig[key])) {
			return true
		}

		return false
	}

	//通关奖励
	checkPassPrize() {
		let record = getSaveRecord(opSaveRecordKey.campaignGifts) || {}
		if (size_t(record) == 0) {
			return false
		} else {
			for (let campaignId in record) {
				if (record[campaignId] == 1) {
					return true
				}
			}
		}
		return false
	}

	//精彩活动--累充有礼
	checkWonderAccumulate() {
		let dataInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.Recharge_have_prize) || {}
		if (size_t(dataInfo) == 0) {
			dataInfo = getSaveRecord(opSaveRecordKey.AccRechargeGift) || {}
			if (size_t(dataInfo) == 0) {
				return false
			}
		}
		for (let _ in GameConfig.AccRechargeGiftConfig) {
			let config = GameConfig.AccRechargeGiftConfig[_]
			let prizeInfo = dataInfo.getPrize || {}
			let isGet = prizeInfo[config.Index] || 0
			if (isGet == 1) {
				return true
			}
		}
		return false
	}

	//精彩活动--节日消费
	checkWonderHoliday() {
		let dataInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.festival_BACK_MONEY) || {}
		if (size_t(dataInfo) == 0) {
			dataInfo = getSaveRecord(opSaveRecordKey.FestRebateConsume) || {}
			if (size_t(dataInfo) == 0) {
				return false
			}
		}
		for (let _ in GameConfig.FestivalRebateConfig) {
			let config = GameConfig.FestivalRebateConfig[_]
			let prizeInfo = dataInfo.getPrize || {}
			let isGet = prizeInfo[config.Index] || 0
			if (isGet == 1) {
				return true
			}
		}
		//}
		return false
	}

	//精彩活动--宠物洗练
	checkWonderPetClear() {
		let dataInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.PET_WASH) || {}
		if (size_t(dataInfo) == 0) {
			let dataInfo = getSaveRecord(opSaveRecordKey.PetSkillWashActivity) || {}
			if (size_t(dataInfo) == 0) {
				return false
			}
		}
		for (let _ in GameConfig.SkillWashActivityConfig) {
			let config = GameConfig.SkillWashActivityConfig[_]
			let prizeInfo = dataInfo[0] || {}
			let isGet = prizeInfo[config.washNum] || 0
			if (isGet == 1) {
				return true
			}
		}
		return false
	}

	///---精彩活动 -- 六界寻宝
	checkWonderLiuJie() {
		let netInfo: any = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.SIX_LOOK_PRECIOUS)

		if (netInfo == null || netInfo.value == null) {
			netInfo = getSaveRecord(opSaveRecordKey.LiuJieXunBao) || null
		}

		if (netInfo == null || netInfo.value == null) return false
		//可以掷骰子
		if (netInfo.remainNum >= 1) {
			return true
		}

		//是否满足领取
		let config = GameConfig.LiuJieTouZiNumConfig
		let tempConfig
		for (let k in config) {
			let v = config[k]
			tempConfig = v
		}
		//领完
		if (netInfo.curRockNum >= tempConfig.RockNum) {
			return false
		}
		//是否可以领取
		let prizeInfo = netInfo.getPrize || {}
		for (let k in prizeInfo) {
			let v = prizeInfo[k]
			if (v == 1) {
				return true
			}
		}

		return false
	}

	//通用进阶奖励
	checkFunPrize(funType) {
		if (!funType) {
			return false
		}

		let record = getSaveRecord(opSaveRecordKey.tempCellPrize) || {} //0未达成, 1可以拿, 2已经拿了
		if (size_t(record) == 0) {
			return false
		}

		let config = FunSystem.getInstance().getFunPrizeConfig()
		let prizeConfig = config[funType]
		if (!prizeConfig || size_t(prizeConfig) == 0) {
			return false
		}

		for (let lv in prizeConfig) {
			if (record[funType]) {
				let isGet = record[funType][lv] || 0
				if (isGet == 1) {
					return true
				}
			}
		}
		return false
	}

	checkPeerless() {
		//可以报名
		let registerInfo = GetActivity(ActivityDefine.Champion).getRegisterInfo() || 0
		if (registerInfo == 1) {
			return true
		}
		let round = GetActivity(ActivityDefine.Champion).getNowRound() || 0
		//可以押注
		let stakeInfo = GetActivity(ActivityDefine.Champion).getStakeInfo()
		if (registerInfo == 3 && stakeInfo[0] == null && round != 0 && round < peerlessOptions.round_one) {
			return true
		}

		return false
	}

	checkStrongholdBeRobbed() {
		let list = GetActivity(ActivityDefine.Stronghold).getStrongholdRecordList()
		for (let _ in list) {
			let v = list[_]
			if (v[2] == StrongholdConfig.recordType.robbedSucc) {
				return true
			}
		}
		return false
	}

	checkPetFly(petId) {
		let petConfig = GameConfig.PetConfig[petId]
		if (petConfig && petConfig.flyskill && size_t(petConfig.flyskill) > 0) {
			let petNetInfo = PetSystem.getInstance().getPetInfo(petId)
			if (petNetInfo) {
				let flystageexp = petNetInfo.flystageexp || 0

				let funType = cellOptionsIndex.PetFly
				let growInfo = PetSystem.getInstance().getPetGrowInfo(funType, petId)

				let growList = PetSystem.getInstance().getPetGrowList(funType, petId)
				let stage = growList[0]
				let curExp = growList[1]
				let needExp = growList[2]

				if ((stage == size_t(growInfo.maxexp) - 1) && curExp >= needExp) { //满级了
					return false
				}

				let itemCount = growInfo.itemnum
				let itemId = growInfo.itemid

				let itemOwn = ItemSystem.getInstance().getItemCount(itemId)

				if (itemOwn >= itemCount) {
					return true
				}
			}
		}
		return false
	}

	checkShenHunWear(pos) {
		if (pos == null) return false
		let heroItem = RoleSystem.getInstance().getShenHunItem(pos)
		if (heroItem != null) return false

		let itemList = ItemSystem.getInstance().getShenHunItemList() || []
		if (size_t(itemList) == 0) return false
		let vocation = GetHeroProperty("vocation")
		for (let k in itemList) {
			let item: Item = itemList[k]
			let temp = item.getRefProperty("vocation")
			if (temp == vocation || temp == 0) {
				let check = RoleSystem.getInstance().checkShenHunWear(item, pos)
				if (check) {
					return true
				}
			}
		}
		return false
	}
}
