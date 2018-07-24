// TypeScript file
/*
作者:
    
	
创建时间：
   

意图：
		快速跳转执行
   

公共接口：

*/
//let doEventHandler:any = {}
//
//doFastJump(eventName,param,args){
//	TLog.Debug("FastJumpSystem.doFastJump",eventName)
//	if(doEventHandler[eventName] ){
//		return doEventHandler[eventName](this, param,args)
//	}else{
//		TLog.Error("FastJumpSystem.doFastJump eventName %s is null!!!", eventName)
//	}
//}
ImportType(FastJumpTypeList);


module FastJumpSpace {

	/*
作者:
    panjunhua
	
创建时间：
   2015.8.6(周四)

意图：
		快速跳转执行
   

公共接口：

*/
	export let doEventHandler: any = {}

	/////////////////////////////-------------西游获取途径
	//装备商店
	function onShopEquipClick(param) {
		let wnd: ShopEquipFrame = WngMrg.getInstance().getWindow("ShopEquipFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_SHOP_EQUIP] = onShopEquipClick
	//元宝商店
	function onShopYuanBaoClick(param) {
		let wnd: ShopYuanBaoFrame = WngMrg.getInstance().getWindow("ShopYuanBaoFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_SHOP_YUANBAO] = onShopYuanBaoClick
	//竞技商店
	function onShopJingJiClick(param) {
		let wnd: ShopJingJiFrame = WngMrg.getInstance().getWindow("ShopJingJiFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_SHOP_JINGJI] = onShopJingJiClick
	//装扮商店
	function onShopZhuangBanClick(param) {
		let wnd: ShopZhuangBanFrame = WngMrg.getInstance().getWindow("ShopZhuangBanFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_SHOP_ZHUANGBAN] = onShopZhuangBanClick
	//个人BOSS商店
	function onShopSingleClick(param) {
		let wnd: ShopFunFrame = WngMrg.getInstance().getWindow("ShopFunFrame")
		wnd.onShowWnd(ShopSystem.SHOP_SINGLE)
	}
	doEventHandler[FastJumpTypeList.FIELD_SHOP_SINGLE] = onShopSingleClick
	//全民BOSS商店
	function onShopGobalClick(param) {
		let wnd: ShopFunFrame = WngMrg.getInstance().getWindow("ShopFunFrame")
		wnd.onShowWnd(ShopSystem.SHOP_GLOBAL)
	}
	doEventHandler[FastJumpTypeList.FIELD_SHOP_GOBAL] = onShopGobalClick
	//材料商店
	function onShopMatClick(param) {
		let wnd: ShopFunFrame = WngMrg.getInstance().getWindow("ShopFunFrame")
		wnd.onShowWnd(ShopSystem.SHOP_MATERIAL)
	}
	doEventHandler[FastJumpTypeList.FIELD_SHOP_MAT] = onShopMatClick
	//生死劫商店
	function onShopDelineClick(param) {
		let wnd: ShopFunFrame = WngMrg.getInstance().getWindow("ShopFunFrame")
		wnd.onShowWnd(ShopSystem.SHOP_DELINE)
	}
	doEventHandler[FastJumpTypeList.FIELD_SHOP_DELINE] = onShopDelineClick
	//寻宝
	function onLuckyClick(param) {
		let wnd: LuckyFrame = WngMrg.getInstance().getWindow("LuckyFrame")
		let paramList = [
			PayActivityIndex.PET_LOTTERY_A,
			PayActivityIndex.PET_LOTTERY,
			PayActivityIndex.GOD_PET_TURN
		]
		wnd.showWithIndex(paramList[param] || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_LUCKY] = onLuckyClick
	//材料副本
	function onCopyClick(param) {
		let wnd: CopyMainFrame = WngMrg.getInstance().getWindow("CopyMainFrame")
		wnd.showBossFrame(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_MAT_COPY] = onCopyClick
	//充值
	function onPayClick(param) {
		let wnd: PayFrame = WngMrg.getInstance().getWindow("PayFrame")
		wnd.showWnd()
	}
	doEventHandler[FastJumpTypeList.FIELD_PAY] = onPayClick
	//日常
	function onDailyClick(param) {
		let wnd: DailyFrame = WngMrg.getInstance().getWindow("DailyFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_DAILY] = onDailyClick
	//boss
	function onBossClick(param) {
		let wnd: BossMainFrame = WngMrg.getInstance().getWindow("BossMainFrame")
		wnd.showBossFrame(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_BOSS] = onBossClick
	//vip
	function onVipClick(param) {
		let wnd: VIPFrame = WngMrg.getInstance().getWindow("VIPFrame")
		wnd.showWnd()
	}
	doEventHandler[FastJumpTypeList.FIELD_VIP] = onVipClick
	//三生三世
	function onShiTuClick(param) {
		let wnd = WngMrg.getInstance().getWindow("SanShengSanShiFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_SHITU] = onShiTuClick
	//活动列表
	function onActivity(param) {
		let wnd: ActivityListFrame = WngMrg.getInstance().getWindow("ActivityListFrame")
		wnd.showWnd()
	}
	doEventHandler[FastJumpTypeList.FIELD_ACTIVITYLIST] = onActivity
	//经验妖魔
	function onJingyanYaomo(param) {
		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.ZhongKuiDemon)
		if (size_t(actInfo) == 0) {
			return
		}
		let npcList = actInfo.npcList
		if (npcList == null || size_t(npcList) == 0) {
			return
		}
		let activeList = {}
		//let unActiveList = {}
		for (let k in npcList) {
			let v = npcList[k]
			let osTime = GetServerTime()
			if ((v <= osTime)) {
				activeList[k] = v
			}
		}
		let npcIndex = -1
		for (let k in activeList) {
			npcIndex = tonumber(k)
			break
		}
		let wnd: DailyGhostFrame = WngMrg.getInstance().getWindow("DailyGhostFrame")
		wnd.onShowWnd(npcIndex)
	}
	doEventHandler[FastJumpTypeList.FIELD_JINGYANYAOMO] = onJingyanYaomo
	//组队副本
	function onGloabal(param) {
		let wnd: GlobalMainFrame = WngMrg.getInstance().getWindow("GlobalMainFrame")
		wnd.showGlobalFrame(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_ZUDUIFUBEN] = onGloabal
	//背包熔炼
	function onBeiBaoSmelt(param) {
		let wnd: BeiBaoSmelteFrame = WngMrg.getInstance().getWindow("BeiBaoSmelteFrame")
		wnd.showWnd()
	}
	doEventHandler[FastJumpTypeList.FIELD_RONGLIAN] = onBeiBaoSmelt
	//竞技场
	function onChampion(param) {
		let wnd: ChampionFrame = WngMrg.getInstance().getWindow("ChampionFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_CHAMPION] = onChampion
	//护送
	function onEscort(param) {
		let wnd: EscortFrame = WngMrg.getInstance().getWindow("EscortFrame")
		wnd.showWnd()
	}
	doEventHandler[FastJumpTypeList.FIELD_ESCORT] = onEscort
	//角色
	function onRole(param) {
		let wnd: RoleFrame = WngMrg.getInstance().getWindow("RoleFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_ROLE] = onRole
	//仙侣
	function onXianLv(param) {
		let wnd: XianLvFrame = WngMrg.getInstance().getWindow("XianLvFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_XIANLV] = onXianLv
	//天仙
	function onTianXian(param) {
		let wnd: TianXianFrame = WngMrg.getInstance().getWindow("TianXianFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_TIANXIAN] = onTianXian
	//宠物
	function onPet(param) {
		let wnd: PetFrame = WngMrg.getInstance().getWindow("PetFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_PET] = onPet
	//天女
	function onTianNv(param) {
		let wnd: TianNvFrame = WngMrg.getInstance().getWindow("TianNvFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_TIANNV] = onTianNv
	//首充
	function onShouChong(param) {
		let wnd: TouZiFrame = WngMrg.getInstance().getWindow("TouZiFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_SHOUCHONG] = onShouChong

	//开服活动
	function onKaiFu(param) {
		// let wnd: OpenServerMainFrame = WngMrg.getInstance().getWindow("OpenServerMainFrame")
		// wnd.showActFrame(param)
		WngMrg.getInstance().showWindow("ActivityRankFrame");
	}
	doEventHandler[FastJumpTypeList.FIELD_KAIFU] = onKaiFu

	//采矿
	function onCaiKuang(param) {
		ExecuteMainFrameFunction("judian")
	}
	doEventHandler[FastJumpTypeList.FIELD_CAIKUANG] = onCaiKuang

	//合成
	function onHeCheng(param) {
		ExecuteMainFrameFunction("hecheng")
	}
	doEventHandler[FastJumpTypeList.FIELD_HECHENG] = onHeCheng

	//元宝黑市
	function onHeiShi(param) {
		// let wnd: ShopFunFrame = WngMrg.getInstance().getWindow("ShopFunFrame")
		// wnd.onShowWnd(ShopSystem.SHOP_ZHUANGBAN)
		let wnd : ShopShenChongFrame = WngMrg.getInstance().getWindow("ShopShenChongFrame")
		wnd.showWithIndex(param || 0)
	}
	doEventHandler[FastJumpTypeList.FIELD_HEISHI] = onHeiShi

	//据点
	function onJuDian(param) {
		ExecuteMainFrameFunction("judian")
	}
	doEventHandler[FastJumpTypeList.FIELD_JUDIAN] = onJuDian

	//据点
	function doPetMiLv(param) {
		let wnd : MiLuFrame = WngMrg.getInstance().getWindow("MiLuFrame")
		wnd.showWnd()
	}
	doEventHandler[FastJumpTypeList.FIELD_PETMILV] = doPetMiLv
	// //通用打开关卡界面
	// function openCampaign(param) {
	// 	ExecuteMainFrameFunction("guanka")

	// 	return "CopyCardFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_CAMPAIGN] = openCampaign

	// //打开指定关卡
	// function openLocalCampaign(param) {
	// 	let wnd = WngMrg.getInstance().getWindow("CopyCardFrame")
	// 	wnd.showCopyCard(null, null, param)

	// 	return "CopyCardFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_APPOIN_CAMPAIGN] = openLocalCampaign

	//圣地
	// function openBrokenHistory(param) {
	// 	//let curIndex = ActivitySystem.getInstance().getCurActIndex()
	// 	//if(curIndex != OrdinaryActivityIndex.NULL ){
	// 	//	if(curIndex == OrdinaryActivityIndex.SHENGDI ){
	// 	//		let txt = ""
	// 	//		if(type(param) == "table" ){
	// 	//			for(let k = 0; k < param.length; k++){
	// 	//		let v = param[k]
	// 	//
	// 	//				if(npcConfig[v] ){
	// 	//					if(k != 1 ){
	// 	//						txt = "," +txt
	// 	//					}
	// 	//					
	// 	//					txt = txt +npcConfig[v].name
	// 	//				}
	// 	//			}
	// 	//			
	// 	//			MsgSystem.AddTagTips(String.format(Localize_cns("ROBBER_TXT102"), txt))
	// 	//		}else if(type(param) == "number" ){
	// 	//			if(npcConfig[param] ){
	// 	//				MsgSystem.AddTagTips(String.format(Localize_cns("ROBBER_TXT102"), npcConfig[param].name))
	// 	//			}
	// 	//		}
	// 	//		return MsgSystem.AddTagTips(Localize_cns("TEAM_TXT77"))
	// 	//	}else{
	// 	//		return MsgSystem.AddTagTips(Localize_cns("TEAM_TXT78"))
	// 	//	}
	// 	//}
	// 	//ExecuteMainFrameFunction("shengdi")
	// 	if (TeamMemberFollowBaned()) {
	// 		return
	// 	}

	// 	if (param == null){
	// 		return
	// 	}
	// 	//TLog.Assert(param != null)

	// 	//if (param) {

	// 	let activity = GetActivity(ActivityDefine.Robber)


	// 	let entryId = null
	// 	if (type(param) == "object") {
	// 		let maxLayer = 0
	// 		let info = GetActivity(ActivityDefine.SkyTower).getSkyTowerInfo()
	// 		let hMaxLayer = info.historyMaxLayer || 0

	// 		for (let _ in param) {
	// 			let entry = param[_]

	// 			let config = activity.getFightMonsterConfig(entry)
	// 			if (config) {
	// 				if (config.skyLayer <= hMaxLayer) {
	// 					if (maxLayer < config.skyLayer) {
	// 						maxLayer = config.skyLayer
	// 						entryId = entry
	// 					}
	// 				}
	// 			}
	// 		}

	// 		if (!entryId) {
	// 			entryId = param[0]
	// 		}
	// 	} else {
	// 		entryId = param
	// 	}

	// 	let robberConfig = null 
	// 	for(let _ in GameConfig.RobberMonsterConfig){
	// 		let config = GameConfig.RobberMonsterConfig[_]

	// 		if(config.npcEntryId == entryId ){
	// 			robberConfig = config
	// 			break
	// 		}
	// 	}

	// 	if(robberConfig == null ){
	// 		TLog.Error("openBrokenHistory RobberMonsterConfig[%s] == null ", tostring(entryId))
	// 		return
	// 	}

	// 	let skyConfig = GameConfig.SkyTowerEnemyConfig[robberConfig.skyLayer]
	// 	if(skyConfig == null ){
	// 		TLog.Error("openBrokenHistory SkyTowerEnemyConfig[%s] == null ", tostring(robberConfig.skyLayer))
	// 		return
	// 	}

	// 	 let wnd = WngMrg.getInstance().getWindow("QuickGainFrame")
	// 	 wnd.setAutoClose(false)

	// 	//关卡不足
	// 	if(CampaignSystem.getInstance().isCampaignPass(skyConfig.campId) == false ){
	// 		let name = CampaignSystem.getInstance().getCampaignName(skyConfig.campId)
	// 		MsgSystem.addTagTips(String.format(Localize_cns("GUIDE_TXT1"), name))
	// 		return
	// 	}

	// 	//地宫不足
	// 	let info = GetActivity(ActivityDefine.SkyTower).getSkyTowerInfo()
	// 	let hMaxLayer = info.historyMaxLayer || 0

	// 	//let currentFloor = getSaveRecord(opSaveRecordKey.SkyTowerChallenge) || 0
	// 	if(hMaxLayer < robberConfig.skyLayer ){
	// 		MsgSystem.addTagTips(String.format(Localize_cns("ROBBER_TXT40"), robberConfig.skyLayer))
	// 		return
	// 	}

	// 	wnd.setAutoClose(true)
	// 	activity.stopFightToFindMonster(entryId)

	// 	// if (activity.isStart()) {
	// 	// 	activity.stopFightToFindMonster(entryId)
	// 	// 	return
	// 	// }
	// 	//
	// 	// function startHandler() {
	// 	// 	//GetActivity(ActivityDefine.Robber):requestStopAutoFight()
	// 	// 	//GetActivity(ActivityDefine.Robber).fightMgr.stopAutoFight(GetHero())
	// 	// 	//
	// 	// 	//let config = GetActivity(ActivityDefine.Robber):getFightMonsterConfig(entryId)
	// 	// 	//if(config ){
	// 	// 	//	let x, y = config["pos"][1], config["pos"][2]
	// 	// 	//	GetActivity(ActivityDefine.Robber):goAndFightMonster(x, y, config.index)
	// 	// 	//}
	// 	// 	activity.stopFightToFindMonster(entryId)
	// 	// }

	// 	// activity.addActStartHandler(this, startHandler)
	// 	//}

	// 	//ExecuteMainFrameFunction("shengdi")

	// 	return null
	// }
	// doEventHandler[FastJumpTypeList.FIELD_BROKENHISTORY] = openBrokenHistory

	//积分商城
	// function openJinfenShangCheng(param) {
	// 	let wnd = WngMrg.getInstance().getWindow("ShopFrame")
	// 	wnd.showWithScoreShop(param)

	// 	return "ShopFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_INTEGRATION] = openJinfenShangCheng

	// //晶石商城
	// function openDiaShangCheng(param) {
	// 	let wnd = WngMrg.getInstance().getWindow("ShopFrame")
	// 	wnd.showWithDealShop(param)

	// 	return "ShopFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_DIAMOND_SHANGCHENG] = openDiaShangCheng

	//商城（交易所）
	// function openShangCheng(param) {
	// 	//ExecuteMainFrameFunction("jiaoyisuo")

	// 	//return "ShopFrame"
	// 	let wnd = WngMrg.getInstance().getWindow("ShopBuyFrame")
	// 	wnd = wnd.quickShowShopItem(param)

	// 	return "ShopBuyFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_SHOP] = openShangCheng

	//世界boss
	// function openWorldBoss(param) {
	// 	ExecuteMainFrameFunction("boss")
	// 	return
	// }
	// doEventHandler[FastJumpTypeList.FIELD_WORLDBOSS] = openWorldBoss

	// //贵族答题
	// function openAnswerQuestion(param) {
	// 	ExecuteMainFrameFunction("dati")

	// 	return "AnswerQuestionEntryFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_ANSWERQUESTION] = openAnswerQuestion

	// //溶解
	// function openDecompose(param) {
	// 	ExecuteMainFrameFunction("rongjie")

	// 	return "ItemResolveFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_DECOMPOSE] = openDecompose

	// //抽将
	// function openChouJiang(param) {
	// 	ExecuteMainFrameFunction("choujiang")

	// 	return "PetSummonFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_SUMMON] = openChouJiang

	// //军团副本
	// function openJunTuanFuBen(param) {
	// 	ExecuteMainFrameFunction("gonghui")

	// 	return
	// }
	// doEventHandler[FastJumpTypeList.FIELD_SEALEDGROUND] = openJunTuanFuBen

	// //购买金币
	// function openMaiJinbi(param) {
	// 	ExecuteMainFrameFunction("jinbi")

	// 	return "GoldBuyFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_BUYJINBI] = openMaiJinbi

	// //购买钻石
	// function openMaiZuanshi(param) {
	// 	let wnd = WngMrg.getInstance().getWindow("PayFrame")
	// 	wnd.showWindow()
	// 	return "PayFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_CHONGZHI] = openMaiZuanshi

	// //关卡首通
	// function openShouTongGuanka(param) {
	// 	ExecuteMainFrameFunction("guanka")

	// 	return "CopyCardFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_SHOUTONG_GUANKA] = openShouTongGuanka

	// //试练场首通
	// function openShouTongShilianchang(param) {
	// 	ExecuteMainFrameFunction("shilian")

	// 	return "SkyTowerFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_SHOUTONG_SHILIANCHANG] = openShouTongShilianchang

	// //竞技场连胜
	// function openJingjiLiansheng(param) {
	// 	ExecuteMainFrameFunction("jingjichang")

	// 	return "ChampionFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_LIANSHENG_JINGJI] = openJingjiLiansheng

	// //竞技场首次排名
	// function openShouTongJingji(param) {
	// 	ExecuteMainFrameFunction("jingjichang")

	// 	return "ChampionFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_SHOUTONG_JINGJI] = openShouTongJingji

	// //公会入驻
	// function openGonghui(param) {
	// 	ExecuteMainFrameFunction("gonghui")

	// 	return ""
	// }
	// doEventHandler[FastJumpTypeList.FIELD_GONGHUIRUZHU] = openGonghui

	// //聊天
	// function openLiaotian(param) {
	// 	WngMrg.getInstance().showWindow("ChatInChannelFrame")

	// 	return "ChatInChannelFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_LIAOTIAN] = openLiaotian

	// //弹出文字提示
	// function openTips(param) {
	// 	let wnd = WngMrg.getInstance().getWindow("QuickGainFrame")
	// 	wnd.setAutoClose(false)
	// 	//{title, msg, check}
	// 	MsgSystem.addTagTips(param[1])

	// 	return ""
	// }
	// doEventHandler[FastJumpTypeList.FIELD_MESSAGETIPS] = openTips

	// //分享
	// function openFenxiang(param) {
	// 	WngMrg.getInstance().showWindow("SettingFrame")

	// 	return "SettingFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_FENXIANG] = openFenxiang

	// //赠送好友体力
	// function openSongtili(param) {
	// 	let wnd = WngMrg.getInstance().getWindow("FriendsFrame")
	// 	wnd.showWithIndex("haoyou")

	// 	return "FriendsFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_SONGTILI] = openSongtili

	// //购买体力
	// // function openMaitili(param) {
	// // 	ExecuteMainFrameFunction("maitili")

	// // 	return "GlodAndPowerBuyFrame"
	// // }
	// // doEventHandler[FastJumpTypeList.FIELD_MAITILI] = openMaitili

	// //养成
	// function openYangcheng(param) {
	// 	ExecuteMainFrameFunction("yangcheng")

	// 	return "GrowFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_YANGCHENG] = openYangcheng

	// //签到
	// function openQiandao(param) {
	// 	ExecuteMainFrameFunction("qiandao")

	// 	return "DailySignInFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_QIANDAO] = openQiandao

	// //主角等级
	// function openZhujuedengji(param) {
	// 	ExecuteMainFrameFunction("huobanhero")

	// 	return "PetFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_ZHUJUEDENGJI] = openZhujuedengji

	// //职业
	// function openZhiye(param) {
	// 	ExecuteMainFrameFunction("zhiye")

	// 	return "ProfessionFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_ZHIYE] = openZhiye

	// //装备
	// function openZhuangbei(param) {
	// 	//let wnd = WngMrg.getInstance().getWindow("PetFrame")
	// 	//wnd.showTabEntryId(PetFrame.EquipTab, 0)

	// return "PetFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_ZHUANGBEI] = openZhuangbei

	// //御灵
	// function openYuling(param) {
	// 	ExecuteMainFrameFunction("yuling")

	// 	return "SacrificeFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_YULING] = openYuling

	// //试练场
	// function openShilianchang(param) {
	// 	ExecuteMainFrameFunction("shilian")

	// 	return "SkyTowerFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_SHILIANCHANG] = openShilianchang

	// //竞技场
	// function openJingji(param) {
	// 	ExecuteMainFrameFunction("jingjichang")

	// 	return "ChampionFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_JINGJI] = openJingji

	// //快捷使用
	// function openQuickUse(param) {
	// 	let itemList: any = {}
	// 	for (let _ = 0; _ < param.length; _++) {
	// 		let entryId = param[_]

	// 		let t = ItemSystem.getInstance().getItemLogicInfoByEntry(entryId)
	// 		if (t.length > 0) {			//第一个
	// 			itemList = t
	// 			break
	// 		}
	// 	}

	// 	if (!itemList[0]) {
	// 		TLog.Error("doEventHandler FastJumpTypeList.FIELD_QUICKUSE")
	// 		return
	// 	}
	// 	let item = itemList[0]
	// 	let wnd = WngMrg.getInstance().getWindow("ItemBatchUseFrame")
	// 	wnd.showWithItemInfo(item)
	// 	return "ItemBatchUseFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_QUICKUSE] = openQuickUse

	// //运营活动中产出
	// function openYunyinghuodong(param) {
	// 	return
	// }
	// doEventHandler[FastJumpTypeList.FIELD_YUNYINGHUODONG] = openYunyinghuodong

	//购买金币
	// function openMaiHuoLi(param) {
	// 	let canaddlive = growOptions.buyLiveNum
	// 	let maxnum = GrowSystem.getInstance().getMaxBuyLiveNum()
	// 	let curnum = GrowSystem.getInstance().getBuyLiveNum()
	// 	TLog.Debug("curnum, maxnum", curnum, maxnum)
	// 	let hasbuynum = maxnum - curnum
	// 	if (hasbuynum <= 0) {
	// 		MsgSystem.addTagTips(String.format(Localize_cns("GROW_BUY_LIVE_NUM_MAX"), maxnum))
	// 		return
	// 	}
	// 	let price = GrowSystem.getInstance().getBuyLivePrice()
	// 	hasbuynum = maxnum - curnum
	// 	let txt = String.format(Localize_cns("GROW_BUY_LIVE_SURE"), price, canaddlive, hasbuynum)
	// 	let t: IDialogCallback = {
	// 		onDialogCallback(result: boolean, userData): void {
	// 			if (result) {
	// 				let myDiamond = GetHeroProperty("gold")
	// 				if (price > myDiamond) {
	// 					let wnd = WngMrg.getInstance().getWindow("QuickGainFrame")
	// 					let itemConfig: any = [["zuanshi", 0], ["GrowFrame"]]
	// 					wnd.showQuickGainFrame(itemConfig)
	// 				} else {
	// 					let msg = GetMessage(opCodes.C2G_GROW_BUY_LIVE)
	// 					SendGameMessage(msg)
	// 				}
	// 			}
	// 		}
	// 	}
	// 	MsgSystem.confirmDialog(txt, t, ConfirmFrom.GROW_LIVE)

	// 	return null
	// }
	// doEventHandler[FastJumpTypeList.FIELD_MAIHUOLI] = openMaiHuoLi



	// //公会仓库分配
	// function openGonghuicangku(param) {
	// 	return null
	// }
	// doEventHandler[FastJumpTypeList.FIELD_GONGHUI_CANGKU] = openGonghuicangku


	// //航海
	// function openHanghai(param) {
	// 	ExecuteMainFrameFunction("hanghai")
	// 	return
	// }
	// doEventHandler[FastJumpTypeList.FIELD_HANGHAI] = openHanghai

	// //血盟
	// function openXuemeng(param) {
	// 	ExecuteMainFrameFunction("xuemeng")
	// 	return
	// }
	// doEventHandler[FastJumpTypeList.FIELD_XUEMENG] = openXuemeng

	// //个人主页
	// function openHomepage(param) {
	// 	ExecuteMainFrameFunction("homepage")
	// 	return
	// }
	// doEventHandler[FastJumpTypeList.FIELD_HOMEPAGE] = openHomepage

	// //天梯
	// function openTianti(param) {
	// 	ExecuteMainFrameFunction("tianti")
	// 	return
	// }
	// doEventHandler[FastJumpTypeList.FIELD_TIANTI] = openTianti

	// //众神之战
	// function openZhenying(param) {
	// 	ExecuteMainFrameFunction("zhenying")
	// 	return
	// }
	// doEventHandler[FastJumpTypeList.FIELD_ZHENYING] = openZhenying

	// //圣地boss
	// function openSDBoss(param){
	// 	ExecuteMainFrameFunction("shengdiboss")
	// 	return "RobberBossFrame"
	// }
	// doEventHandler[FastJumpTypeList.FIELD_SDBOSS] = openSDBoss

	//////////////////////////////////////////////////////////////////////////////////////////////////////////-
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//检查
	export let checkEventHandler: any = {}

	/////////////////////////////-------------西游获取途径
	function checkShopEquip(param) {
		let level = 40
		if (GetHeroProperty("level") < level) {
			let msg = String.format(Localize_cns("GUIDE_TXT3"), level)
			return [false, msg]
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_SHOP_EQUIP] = checkShopEquip


	function checkShopYuanBao(param) {
		let level = 20
		if (GetHeroProperty("level") < level) {
			let msg = String.format(Localize_cns("GUIDE_TXT3"), level)
			return [false, msg]
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_SHOP_YUANBAO] = checkShopYuanBao


	function checkShopJingJi(param) {
		let level = 20
		let heroLevel = GetHeroProperty("level")
		if (heroLevel < level) {
			let msg = String.format(Localize_cns("GUIDE_TXT3"), level)
			return [false, msg]
		}
		if (param == 2) {
			if (heroLevel < 45) {
				let msg = String.format(Localize_cns("GUIDE_TXT3"), 45)
				return [false, msg]
			}
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_SHOP_JINGJI] = checkShopJingJi

	function checkShopZhuangBan(param) {
		let level = 20
		if (GetHeroProperty("level") < level) {
			let msg = String.format(Localize_cns("GUIDE_TXT3"), level)
			return [false, msg]
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_SHOP_ZHUANGBAN] = checkShopZhuangBan


	function checkShopSingle(param) {
		let level = 20
		if (GetHeroProperty("level") < level) {
			let msg = String.format(Localize_cns("GUIDE_TXT3"), level)
			return [false, msg]
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_SHOP_SINGLE] = checkShopSingle

	function checkShopGobal(param) {
		let level = 20
		if (GetHeroProperty("level") < level) {
			let msg = String.format(Localize_cns("GUIDE_TXT3"), level)
			return [false, msg]
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_SHOP_GOBAL] = checkShopGobal

	function checkShopMat(param) {
		return CheckMainFrameFunction("fuben")
	}
	checkEventHandler[FastJumpTypeList.FIELD_SHOP_MAT] = checkShopMat

	function checkShopDeline(param) {
		return CheckMainFrameFunction("shengsijie")
	}
	checkEventHandler[FastJumpTypeList.FIELD_SHOP_DELINE] = checkShopDeline

	function checkLucky(param) {
		let wnd: LuckyFrame = WngMrg.getInstance().getWindow("LuckyFrame")
		let paramList = [
			PayActivityIndex.PET_LOTTERY_A,
			PayActivityIndex.PET_LOTTERY,
			PayActivityIndex.GOD_PET_TURN
		]
		let index = paramList[param]
		let openList = ActivitySystem.getInstance().getOperateActivityOpenList()
		if (!table_isExist(openList, index)) {
			return [false, Localize_cns("ACCESS_ACTIVTIY_NOT")]
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_LUCKY] = checkLucky

	function checkCopy(param) {
		return CheckMainFrameFunction("fuben")
	}
	checkEventHandler[FastJumpTypeList.FIELD_MAT_COPY] = checkCopy

	function checkPay(param) {
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_PAY] = checkPay

	function checkDaily(param) {
		if (GetHeroProperty("level") < 40) {
			let msg = String.format(Localize_cns("GUIDE_TXT3"), 40)
			return [false, msg]
		}
		if (param == 3) {
			return CheckMainFrameFunction("xiyoulilian")
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_DAILY] = checkDaily

	function checkBoss(param) {
		if (param == 2) {
			return CheckMainFrameFunction("yewaiBOSS")
		}
		if (param == 3) {
			return checkShopDeline(param)
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_BOSS] = checkBoss

	function checkVip(param) {
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_VIP] = checkVip

	function checkShiTu(param) {
		return CheckMainFrameFunction("sanshengsanshi")
	}
	checkEventHandler[FastJumpTypeList.FIELD_SHITU] = checkShiTu

	function checkActivity(param) {
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_ACTIVITYLIST] = checkActivity
	//经验妖魔
	function checkJingyanYaomo(param) {
		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.ZhongKuiDemon)
		if (size_t(actInfo) == 0) {
			return
		}
		let npcList = actInfo.npcList
		if (npcList == null || size_t(npcList) == 0) {
			return
		}
		let activeList = {}
		//let unActiveList = {}
		for (let k in npcList) {
			let v = npcList[k]
			let osTime = GetServerTime()
			if ((v <= osTime)) {
				activeList[k] = v
			}
		}
		let npcIndex = -1
		for (let k in activeList) {
			npcIndex = tonumber(k)
			break
		}
		if (npcIndex == -1) {
			return [false, Localize_cns("DAILY_NO_MOSTER")]
		}

		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_JINGYANYAOMO] = checkJingyanYaomo
	//组队副本
	function checkGloabal(param) {
		if (GetHeroProperty("level") < 40) {
			let msg = String.format(Localize_cns("GUIDE_TXT3"), 40)
			return [false, msg]
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_ZUDUIFUBEN] = checkGloabal
	//背包熔炼
	function checkBeiBaoSmelt(param) {
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_RONGLIAN] = checkBeiBaoSmelt
	//竞技场
	function checkChampion(param) {
		if (param == 1) {
			if (GetHeroProperty("level") < 120) {
				let msg = String.format(Localize_cns("GUIDE_TXT3"), 120)
				return [false, msg]
			}
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_CHAMPION] = checkChampion
	//护送
	function checkEscort(param) {
		if (GetHeroProperty("level") < 45) {
			let msg = String.format(Localize_cns("GUIDE_TXT3"), 45)
			return [false, msg]
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_ESCORT] = checkEscort
	//角色
	function checkRole(param) {
		if (param == 2) {
			return CheckMainFrameFunction("zuoqi")
		}

		if (param == 3) {
			return CheckMainFrameFunction("chibang")
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_ROLE] = checkRole
	//仙侣
	function checkXianLv(param) {
		if (param == 2) {
			return CheckMainFrameFunction("fazhen")
		}

		if (param == 3) {
			return CheckMainFrameFunction("xianwei")
		}
		return CheckMainFrameFunction("xianlv")
	}
	checkEventHandler[FastJumpTypeList.FIELD_XIANLV] = checkXianLv
	//天仙
	function checkTianXian(param) {
		let guideIndex = ["tianxian", "shenbing", "danyao", "jingmai"]
		return CheckMainFrameFunction(guideIndex[param || 0])
	}
	checkEventHandler[FastJumpTypeList.FIELD_TIANXIAN] = checkTianXian
	//宠物
	function checkPet(param) {
		if (param == 2) {
			return CheckMainFrameFunction("tongling")
		}

		if (param == 3) {
			return CheckMainFrameFunction("souhun")
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_PET] = checkPet
	//天女
	function checkTianNv(param) {
		let guideIndex = ["tiannv", "xianqi", "huanian", "lingqi"]
		return CheckMainFrameFunction(guideIndex[param || 0])
	}
	checkEventHandler[FastJumpTypeList.FIELD_TIANNV] = checkTianNv
	//首充
	function checkShouChong(param) {
		let check = ActivitySystem.getInstance().checkActivityIsOpen(param)
		let tips = ""
		if(check == false){
			tips = Localize_cns("ACCESS_ACTIVTIY_GUOQI")
		}
		return [check, tips]
	}
	checkEventHandler[FastJumpTypeList.FIELD_SHOUCHONG] = checkShouChong
	//开服活动
	function checkKaiFu(param) {
		let day = GetServerDay()
		if (day > 8) {
			let msg = Localize_cns("OPENSERVER_TXT44")
			return [false, msg]
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_KAIFU] = checkKaiFu

	function checkCaiKuang(param) {
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_CAIKUANG] = checkCaiKuang

	function checkHeCheng(param) {
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_HECHENG] = checkHeCheng

	//元宝黑市
	function checkHeiShi(param) {
		if (GetHeroProperty("level") < 20) {
			let msg = String.format(Localize_cns("GUIDE_TXT3"), 20)
			return [false, msg]
		}
		return [true, ""]
	}
	checkEventHandler[FastJumpTypeList.FIELD_HEISHI] = checkHeiShi

	//据点
	function checkJuDian(param) {
		return CheckMainFrameFunction("judian")
	}
	checkEventHandler[FastJumpTypeList.FIELD_JUDIAN] = checkJuDian

	//据点
	function checkPetMiLv(param) {
		let level = 25
		if (GetHeroProperty("level") < 25) {
			let msg = String.format(Localize_cns("GUIDE_TXT3"), 25)
			return [false, msg]
		}
		return [true, ""]
		//return CheckMainFrameFunction("shenchongmilu")
	}
	checkEventHandler[FastJumpTypeList.FIELD_PETMILV] = checkPetMiLv
	// 	//通用打开关卡界面
	// 	function checkCampaign(param) {
	// 		return [true, Localize_cns("QUICKGAIN_TXT2")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_CAMPAIGN] = checkCampaign

	// 	//打开指定关卡
	// 	function checkLocalCampaign(param) {
	// 		// return CampaignSystem.getInstance().isCampaignOpen(param), CampaignSystem.getInstance().getCampaignName(param), Localize_cns("QUICKGAIN_TXT22")
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_APPOIN_CAMPAIGN] = checkLocalCampaign

	// 	//圣地
	// 	function checkBrokenHistory(param) {
	// 		let [flag, str] = CheckMainFrameFunction("shengdi")
	// 		return [flag, Localize_cns("QUICKGAIN_TXT3"), str]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_BROKENHISTORY] = checkBrokenHistory

	// 	//积分商城
	// 	function checkJinfenShangCheng(param) {
	// 		let shopType = ""
	// 		if (param) {
	// 			shopType = "(#brown" + Localize_cns("SHOP_TAB_SCORE_" + param) + "#rf)"
	// 		}
	// 		return [true, Localize_cns("QUICKGAIN_TXT4") + shopType]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_INTEGRATION] = checkJinfenShangCheng

	// 	//晶石商城
	// 	function checkDiaShangCheng(param) {
	// 		let shopType = ""
	// 		if (param) {
	// 			shopType = "(#brown" + Localize_cns("SHOP_TAB_DEAL_" + param) + "#rf)"
	// 		}
	// 		return [true, Localize_cns("QUICKGAIN_TXT30") + shopType]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_DIAMOND_SHANGCHENG] = checkDiaShangCheng

	// 	//商城（交易所）
	// 	function checkShangCheng(param) {
	// 		return [true, Localize_cns("QUICKGAIN_TXT5")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_SHOP] = checkShangCheng

	// 	//世界boss
	// 	function checkWorldBoss(param) {
	// 		return [true, Localize_cns("QUICKGAIN_TXT6")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_WORLDBOSS] = checkWorldBoss

	// 	//贵族答题
	// 	function checkAnswerQuestion(param) {
	// 		return [true, Localize_cns("QUICKGAIN_TXT7")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_ANSWERQUESTION] = checkAnswerQuestion

	// 	//溶解
	// 	function checkDecompose(param) {
	// 		return [true, Localize_cns("QUICKGAIN_TXT8")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_DECOMPOSE] = checkDecompose

	// 	//抽将
	// 	function checkChouJiang(param) {
	// 		return [true, Localize_cns("QUICKGAIN_TXT9")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_SUMMON] = checkChouJiang

	// 	//军团副本
	// 	function checkJunTuanFuBen(param) {
	// 		let [flag, str] = CheckMainFrameFunction("gonghui")
	// 		return [flag, Localize_cns("QUICKGAIN_TXT10"), str]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_SEALEDGROUND] = checkJunTuanFuBen

	// 	//购买金币
	// 	function checkMaiJinbi(param) {
	// 		return [true, Localize_cns("QUICKGAIN_TXT11")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_BUYJINBI] = checkMaiJinbi

	// 	//购买钻石
	// 	function checkMaiZuanshi(param) {
	// 		return [true, Localize_cns("QUICKGAIN_TXT12")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_CHONGZHI] = checkMaiZuanshi

	// 	//关卡首通
	// 	function checkShouTongGuanka(param) {
	// 		return [true, Localize_cns("QUICKGAIN_TXT13")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_SHOUTONG_GUANKA] = checkShouTongGuanka

	// 	//试练场首通
	// 	function checkShouTongShilianchang(param) {
	// 		let [flag, str] = CheckMainFrameFunction("shilian")
	// 		return [flag, Localize_cns("QUICKGAIN_TXT14"), str]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_SHOUTONG_SHILIANCHANG] = checkShouTongShilianchang

	// 	//竞技场连胜
	// 	function checkJingjiLiansheng(param) {
	// 		let [flag, str] = CheckMainFrameFunction("jingjichang")
	// 		return [flag, Localize_cns("QUICKGAIN_TXT15"), str]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_LIANSHENG_JINGJI] = checkJingjiLiansheng


	// 	//运营活动中产出
	// 	function checkYunyinghuodong(param) {
	// 		return [false, Localize_cns("OPERATIONAL_ACT_PRODUCE"), Localize_cns("ATTENTION_OPERA_ACT")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_YUNYINGHUODONG] = checkYunyinghuodong

	// 	//竞技场首次排名
	// 	function checkShouTongJingji(param) {
	// 		let [flag, str] = CheckMainFrameFunction("jingjichang")
	// 		return [flag, Localize_cns("QUICKGAIN_TXT16"), str]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_SHOUTONG_JINGJI] = checkShouTongJingji

	// 	//公会入驻
	// 	function checkGonghuiRuzhu(param) {
	// 		let [flag, str] = CheckMainFrameFunction("gonghui")
	// 		return [flag, Localize_cns("QUICKGAIN_TXT17"), str]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_GONGHUIRUZHU] = checkGonghuiRuzhu

	// 	//聊天
	// 	function checkLiaotian(param) {
	// 		return [true, Localize_cns("LIAO_TIAN")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_LIAOTIAN] = checkLiaotian

	// 	//弹出文字提示
	// 	function checkTips(param) {
	// 		let title = param[0]
	// 		let msg = param[1]
	// 		let checkKey = param[2]

	// 		let retflag = true;
	// 		let retstr = ""
	// 		if (checkKey != null) {
	// 			let [flag, str] = CheckMainFrameFunction(checkKey)
	// 			retflag = flag;
	// 			retstr = str;
	// 		}
	// 		return [retflag, title, retstr]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_MESSAGETIPS] = checkTips

	// 	//分享
	// 	function checkFenxiang(param) {
	// 		return [true, Localize_cns("SETTING_TXT6")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_FENXIANG] = checkFenxiang

	// 	//赠送好友体力
	// 	function checkSongtili(param) {
	// 		return [true, Localize_cns("QUICKGAIN_TXT18")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_SONGTILI] = checkSongtili

	// 	//赠送好友体力
	// 	function checkMaitili(param) {
	// 		return [true, Localize_cns("QUICKGAIN_TXT19")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_MAITILI] = checkMaitili

	// 	//养成
	// 	function checkYangcheng(param) {
	// 		let [flag, str] = CheckMainFrameFunction("yangcheng")
	// 		return [flag, Localize_cns("MAIN_TXT12"), str]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_YANGCHENG] = checkYangcheng

	// 	//签到
	// 	function checkQiandao(param) {
	// 		return [true, Localize_cns("SIGN_TEXT")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_QIANDAO] = checkQiandao

	// 	//主角等级
	// 	function checkZhujuedengji(param) {
	// 		return [true, Localize_cns("QUICKGAIN_TXT20")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_ZHUJUEDENGJI] = checkZhujuedengji

	// 	//职业
	// 	function checkZhiye(param) {
	// 		let [flag, str] = CheckMainFrameFunction("zhiye")
	// 		return [flag, Localize_cns("MAIN_TXT11"), str]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_ZHIYE] = checkZhiye

	// 	//装备
	// 	function checkZhuangbei(param) {
	// 		//let [flag, str] = CheckMainFrameFunction("zhuangbei")
	// 		//return flag, Localize_cns("MAIN_TXT20"), str
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_ZHUANGBEI] = checkZhuangbei

	// 	//御灵
	// 	function checkYuling(param) {
	// 		let [flag, str] = CheckMainFrameFunction("yuling")

	// 		return [flag, Localize_cns("MAIN_TXT18"), str]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_YULING] = checkYuling

	// 	//试练场
	// 	function checkShilianchang(param) {
	// 		let [flag, str] = CheckMainFrameFunction("shilian")
	// 		return [flag, Localize_cns("ACTIVITY_NAME1"), str]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_SHILIANCHANG] = checkShilianchang

	// 	//竞技场连胜
	// 	function checkJingji(param) {
	// 		let [flag, str] = CheckMainFrameFunction("jingjichang")
	// 		return [flag, Localize_cns("ACTIVITY_NAME3"), str]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_JINGJI] = checkJingji

	// 	//快捷使用

	// 	//竞技场
	// 	function checkQuickUse(param) {
	// 		let flag = true, str = ""
	// 		let name = Localize_cns("QUICKGAIN_TXT26")

	// 		let itemList = []
	// 		for (let _ = 0; _ < param.length; _++) {
	// 			let entryId = param[_]

	// 			let t = ItemSystem.getInstance().getItemLogicInfoByEntry(entryId)
	// 			if (t.length > 0) {			//第一个
	// 				itemList = t
	// 				name = String.format(Localize_cns("QUICKGAIN_TXT28"), ItemSystem.getInstance().getItemName(entryId))
	// 				break
	// 			}
	// 		}

	// 		if (!itemList[0]) {
	// 			//TLog.Error("checkEventHandler FastJumpTypeList.FIELD_QUICKUSE")
	// 			let list = []
	// 			for (let _ = 0; _ < param.length; _++) {
	// 				let v = param[_]

	// 				JsUtil.arrayInstert(list, ItemSystem.getInstance().getItemName(v))
	// 				//txt = txt +ItemSystem.getInstance().getItemName(v) +","
	// 			}

	// 			let txt = list.join(",")

	// 			flag = false
	// 			str = String.format(Localize_cns("QUICKGAIN_TXT27"), txt)
	// 		}

	// 		return [flag, name, str]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_QUICKUSE] = checkQuickUse


	// 	//购买活力
	// 	function checkMaiHuoli(param) {
	// 		return [true, Localize_cns("QUICKGAIN_TXT29")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_MAIHUOLI] = checkMaiHuoli


	// 	//公会仓库分配
	// 	function checkGonghuicangku(param) {
	// 		return [false, Localize_cns("QUICKGAIN_TXT31"), Localize_cns("QUICKGAIN_TXT31")]
	// 	}
	// 	checkEventHandler[FastJumpTypeList.FIELD_GONGHUI_CANGKU] = checkGonghuicangku


	// 	//航海
	// function checkHanghai( param){
	// 	let [flag, str] = CheckMainFrameFunction("jingjichang")
	// 	return [flag, Localize_cns("ACTIVITY_NAME6"), str]
	// }
	// checkEventHandler[FastJumpTypeList.FIELD_HANGHAI] = checkHanghai

	// //血盟
	// function checkXuemeng( param){
	// 	let [flag, str] = CheckMainFrameFunction("xuemeng")
	// 	return [flag, Localize_cns("ACTIVITY_NAME7"), str]
	// }
	// checkEventHandler[FastJumpTypeList.FIELD_XUEMENG] = checkXuemeng

	// //个人主页
	// function checkHomepage( param){
	// 	let [flag, str] = CheckMainFrameFunction("homepage")
	// 	return [flag, Localize_cns("PER_HOMEPAGE_TEXT"), str]
	// }
	// checkEventHandler[FastJumpTypeList.FIELD_HOMEPAGE] = checkHomepage

	// //天梯
	// function checkTianti( param){
	// 	let [flag, str] = CheckMainFrameFunction("tianti")
	// 	return [flag, Localize_cns("ACTIVITY_TXT59"), str]
	// }
	// checkEventHandler[FastJumpTypeList.FIELD_TIANTI] = checkTianti

	// //众神之战
	// function checkZhenying( param){
	// 	let [flag, str] = CheckMainFrameFunction("zhenying")
	// 	return [flag, Localize_cns("GODSWAR_TEXT"), str]
	// }
	// checkEventHandler[FastJumpTypeList.FIELD_ZHENYING] = checkZhenying

	// //圣地boss
	// function checkSDBoss(param){
	// 	let [flag, str] = [true, ""]
	// 	return [flag, Localize_cns("ACTIVITY_NAME5"), str]
	// }
	// checkEventHandler[FastJumpTypeList.FIELD_SDBOSS] = checkSDBoss
}


