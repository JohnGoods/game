// TypeScript file


function ExcuteFunctionMenuHandle(index, info) {
	if (info && info.handle) {
		info.handle(index, info)
	}
}



/////////////////////////////////////////////////////////////////////////////--
//打开通用界面
function ExecuteActivityFrameFunction(cellName) {
	let cellIndex = cellOptionsIndex[cellName]

	let list = {
		[cellOptionsIndex.PetTongLin]: [FastJumpTypeList.FIELD_PET, 2],
		[cellOptionsIndex.PetSouHun]: [FastJumpTypeList.FIELD_PET, 3],
		[cellOptionsIndex.HeroRide]: [FastJumpTypeList.FIELD_ROLE, 2],
		[cellOptionsIndex.HeroWing]: [FastJumpTypeList.FIELD_ROLE, 3],
		[cellOptionsIndex.TianXian]: [FastJumpTypeList.FIELD_TIANXIAN, 0],
		[cellOptionsIndex.TianXianWeapon]: [FastJumpTypeList.FIELD_TIANXIAN, 1],
		[cellOptionsIndex.TianNv]: [FastJumpTypeList.FIELD_TIANNV, 0],
		[cellOptionsIndex.TianNvXianQi]: [FastJumpTypeList.FIELD_TIANNV, 1],
		[cellOptionsIndex.TianNvHuaNian]: [FastJumpTypeList.FIELD_TIANNV, 2],
		[cellOptionsIndex.TianNvLingQi]: [FastJumpTypeList.FIELD_TIANNV, 3],
		[cellOptionsIndex.XianLvFaZhen]: [FastJumpTypeList.FIELD_XIANLV, 1],
		[cellOptionsIndex.XianLvXianWei]: [FastJumpTypeList.FIELD_XIANLV, 2],
	}
	let checkInfo = list[cellIndex]
	if (!checkInfo) return

	return FastJumpSystem.getInstance().gotoFastJump(checkInfo[0], checkInfo[1])
}

//////////////////////////////////////////////////////////////////////////////-

//处理功能菜单打开的界面
function ExecuteMainFrameFunction(index) {
	let [enable, tips] = CheckMainFrameFunction(index)
	if (!enable) {
		MsgSystem.addTagTips(tips)
		return false
	}

	// function exeShengdi(){//圣地
	// 	GetActivity(ActivityDefine.Robber).requestStart()
	// }


	function exeJingjichang() {//竞技场
		let wnd: ChampionFrame = WngMrg.getInstance().getWindow("ChampionFrame")
		wnd.showWithIndex(0)
	}

	function exeJiaose() {//角色
		let wnd = WngMrg.getInstance().getWindow("RoleFrame");
		wnd.showWithIndex(0);
	}

	function exeDuanzao() {//锻造
		let wnd = WngMrg.getInstance().getWindow("ForgeFrame");
		wnd.showWithIndex(0);
	}

	function exeXianlv() {//仙侣
		let wnd = WngMrg.getInstance().getWindow("XianLvFrame");
		wnd.showWithIndex(0)
	}

	function exeChongwu() {//宠物
		let wnd = WngMrg.getInstance().getWindow("PetFrame")
		wnd.showWithIndex(0)
	}

	function exeRichang() {//日常
		let wnd = WngMrg.getInstance().getWindow("DailyFrame");
		wnd.showWithIndex(0);
	}

	function exeBeibao() {//背包
		let wnd = WngMrg.getInstance().getWindow("ItemBeiBaoFrame");
		wnd.showWithIndex(0);
	}

	function exeWanjia() {//玩家详情
		let wnd = WngMrg.getInstance().getWindow("PlayerDetailsFrame");
		wnd.showWnd();
	}

	function exeDitu() {//大地图
		let wnd = WngMrg.getInstance().getWindow("MapFrame")
		wnd.showWnd();
	}


	function exeZhucheng() {//主城
		RpcProxy.call("C2G_StrongholdRedpoint")
		let wnd = WngMrg.getInstance().getWindow("MainCityFrame")
		wnd.showWnd();
	}

	function exeGonghui() {//公会
		let heroInfo = GetHeroPropertyInfo()
		if (heroInfo == null) {
			return
		}
		if (heroInfo["faction"] == 0) {
			//WngMrg.getInstance().showWindow("ClubWelcomeFrame")
			WngMrg.getInstance().showWindow("ClubListFrame")
		} else {
			let wnd = WngMrg.getInstance().getWindow("ClubFrame")
			wnd.showWithIndex(0)
		}
	}

	function exeHuoDong() {//活动
		WngMrg.getInstance().showWindow("ActivityListFrame")
	}

	function exeVIP() {//VIP特权
		WngMrg.getInstance().showWindow("VIPFrame")
	}

	function exeChongZhi() {
		WngMrg.getInstance().showWindow("PayFrame")
	}

	function exeDati() {
		// if (TeamMemberBaned() == true) {
		// 	return
		// }
		if (CheckActivityState() == false)
			return;

		if (CheckEndFightNow() == false)
			return
		ChangePatrolState(false) //停止巡逻

		let message = GetMessage(opCodes.C2G_WORLDQUESTION_QUERY)
		SendGameMessage(message)

		let a = GetActivity(ActivityDefine.AnswerQuestion)
		a.requestStart()
	}

	function exeFuben() {
		let wnd = WngMrg.getInstance().getWindow("CopyMainFrame")
		wnd.showBossFrame(0)
	}

	function exeJudian() {
		let a = GetActivity(ActivityDefine.Stronghold)
		a.requestStart()
	}

	function exeYuanBaoShangdian() { //元宝商店
		let wnd = WngMrg.getInstance().getWindow("ShopYuanBaoFrame");
		wnd.showWithIndex(0);
	}

	function exeZhuangBeiShangdian() { //装备商店
		let wnd = WngMrg.getInstance().getWindow("ShopEquipFrame");
		wnd.showWithIndex(0);
	}

	function exeChongwuShangdian() { //宠物商店
		let wnd = WngMrg.getInstance().getWindow("ShopZhuangBanFrame");
		wnd.showWithIndex(0);
	}

	function exeJingjiShangDian() { //竞技商店
		let wnd = WngMrg.getInstance().getWindow("ShopJingJiFrame");
		wnd.showWithIndex(0);
	}

	function exeTianxian() { //天仙
		let wnd = WngMrg.getInstance().getWindow("TianXianFrame");
		wnd.showWithIndex(0);
	}

	function exePaiHangbang() { //排行榜
		WngMrg.getInstance().showWindow("RankFrame");
	}



	function exeGuanKa() { //关卡BOSS
		let wnd = WngMrg.getInstance().getWindow("CampaignBossFrame")
		wnd.showWnd()
	}

	function exeTianNv() { //天女
		let wnd = WngMrg.getInstance().getWindow("TianNvFrame")
		wnd.showWithIndex(0)
	}

	function exeGerenBoss() {
		let wnd = WngMrg.getInstance().getWindow("BossMainFrame")
		wnd.showBossFrame(0)
	}

	function exeLongwang() {
		let wnd = WngMrg.getInstance().getWindow("CopyMainFrame")
		wnd.showBossFrame(1)
	}

	function exeXiaoleiyinsi() {
		let wnd = WngMrg.getInstance().getWindow("CopyMainFrame")
		wnd.showBossFrame(2)
	}

	function exeTiantingshilian() {
		let wnd = WngMrg.getInstance().getWindow("CopyMainFrame")
		wnd.showBossFrame(3)
	}

	function exeJiaYuan() {
		WngMrg.getInstance().showWindow("SanShengSanShiFrame")
	}

	function exeShouGou() {
		WngMrg.getInstance().showWindow("ClubExchangeFrame")
	}

	function exeHaoyou() {
		WngMrg.getInstance().showWindow("FriendsFrame")
	}

	function exeGlobal() {
		WngMrg.getInstance().showWindow("GlobalMainFrame")
	}

	function exeRongLian() {
		WngMrg.getInstance().showWindow("BeiBaoSmelteFrame")
	}

	function exeShenZhuang() {
		WngMrg.getInstance().showWindow("GodEquipFrame")
	}

	function exeMining() {
		// if (TeamMemberBaned() == true) {
		// 	return
		// }
		if (IsActivityTimeOpened(OrdinaryActivityIndex.GlobalMine) == false) {
			return MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT40"))
		}

		let a = GetActivity(ActivityDefine.GlobalMining)
		a.requestStart()
	}

	//武林大会
	function exeWulin() {
		if (CheckActivityState() == false)
			return;
		if (CheckEndFightNow() == false)
			return
		ChangePatrolState(false) //停止巡逻

		let a = GetActivity(ActivityDefine.WuLin)
		a.requestStart()
	}

	//宠物合成
	function exeHeCheng() {
		let wnd: PetUnionFrame = WngMrg.getInstance().getWindow("PetUnionTreeFrame")//PetUnionFrame
		if (wnd.isVisible()) {
			wnd.moveToFront()
		} else {
			wnd.showWnd()
		}
	}

	//星灵
	function exeXingLing(){
		let wnd: XingLingFrame = WngMrg.getInstance().getWindow("XingLingFrame")
		wnd.showWnd()
	}

	let list = {

		["jingjichang"]: exeJingjichang, //竞技场
		["jiaose"]: exeJiaose, //角色
		["duanzao"]: exeDuanzao, //锻造
		["xianlv"]: exeXianlv, //仙侣
		["chongwu"]: exeChongwu, //宠物
		["richang"]: exeRichang, //日常
		["beibao"]: exeBeibao, //背包
		["wanjia"]: exeWanjia, //玩家详情
		["ditu"]: exeDitu, //大地图
		["zhucheng"]: exeZhucheng, //主城
		["gonghui"]: exeGonghui,     //公会
		["shougou"]: exeShouGou, //帮会兑换
		["huodong"]: exeHuoDong,   //活动
		["VIP"]: exeVIP, //VIP特权
		["chongzhi"]: exeChongZhi, //充值

		["dati"]: exeDati,		//贵族答题
		["fuben"]: exeFuben,		//材料副本
		["judian"]: exeJudian,		//据点抢矿掠夺

		["yuanbaoshangdian"]: exeYuanBaoShangdian,		//元宝商店
		["zhuangbeishangdian"]: exeZhuangBeiShangdian,		//装备商店
		["chongwushangdian"]: exeChongwuShangdian,		//宠物商店
		["jingjishangdian"]: exeJingjiShangDian,		//竞技商店

		["tianxian"]: exeTianxian,		//天仙
		["paihangbang"]: exePaiHangbang,		//天仙
		["guanka"]: exeGuanKa,          //关卡BOSS

		["tiannv"]: exeTianNv, //天女
		["gerenboss"]: exeGerenBoss, //个人BOSS
		["longwang"]: exeLongwang, //龙王宝藏
		["xiaoleiyinsi"]: exeXiaoleiyinsi,//小雷音寺
		["tiantingshilian"]: exeTiantingshilian,//天庭试练
		["sanshengsanshi"]: exeJiaYuan, //家园

		["haoyou"]: exeHaoyou, //好友
		["global"]: exeGlobal, //跨服

		["ronglian"]: exeRongLian, //熔炼
		["shenzhuang"]: exeShenZhuang, //神装
		["wakuang"]: exeMining,//跨服挖矿-争霸
		["wulin"]: exeWulin,//武林大会

		["hecheng"]: exeHeCheng, //宠物合成

		["xingling"] : exeXingLing, //星灵
	}

	if (list[index]) {
		let func = list[index]
		func.call()
		return true;
	}
	return false;
}

//处理功能菜单的开放条件及返回必要提示
function CheckMainFrameFunction(index, param?): [boolean, string] {
	function checkGongneng(funcIndex) {
		funcIndex = funcIndex || param
		let str = ""
		let flag = GuideSystem.getInstance().isFuncOpen(funcIndex)
		// let campaignId = CampaignSystem.getInstance().getCampaignIdByFuncIndex(funcIndex)

		// if (campaignId != null) {
		// 	let name = CampaignSystem.getInstance().getCampaignName(campaignId)
		// 	str = String.format(Localize_cns("GUIDE_TXT1"), name)
		// } else {
		// if (LevelFuncOpenLimit[funcIndex]) {
		// 	str = String.format(Localize_cns("GUIDE_TXT3"), LevelFuncOpenLimit[funcIndex])
		// } else {
		// 	str = Localize_cns("QUICKGAIN_TXT21")
		// }
		// }

		if (!flag) {
			let config = GameConfig.FuncDefineConfig[funcIndex]
			if (config == null) {
				return [false, ""]
			}
			let openType = config.openType
			let param = config.openParam
			if (openType == FuncOpenConditionType.LEVEL) {
				str = String.format(Localize_cns("GUIDE_TXT3"), param)
			} else if (openType == FuncOpenConditionType.CAMPAIGN) {
				let campaignName = CampaignSystem.getInstance().getCampaignName(param)
				str = String.format(Localize_cns("GUIDE_TXT1"), campaignName)
			} else if (openType == FuncOpenConditionType.TASK) {
				let taskName = TaskSystem.getInstance().getTaskName(param)
				str = String.format(Localize_cns("GUIDE_TXT1"), taskName)
			}
		}

		return [flag, str]
	}

	function checkHuoDong() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_HUODONG)
	}

	function checkJingjichang() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_JINGJICHANG)
	}

	function checkZuoQi() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_ZUOQI)
	}

	function checkCaiLiaoFuBen() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_CAILIAOFUNBEN)
	}

	function checkJuDian() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_JUDIAN)
	}

	function checkXianLv() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_XIANLV)
	}

	function checkZhuCheng() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_ZHUCHENG)
	}

	function checkChengHao() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_CHENGHAO)
	}

	function checkDoHaiLongGong() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_DOHAILONGGONG)
	}

	function checkXiaoLeiYinSi() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_XIAOLEIYINSI)
	}

	function checkKuaFu() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_KUAFU)
	}

	function checkShiZhuang() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_SHIZHUANG)
	}

	function checkXiYouLiLian() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_XIYOULILIAN)
	}

	function checkTianXian() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_TIANXIAN)
	}

	function checkBangHui() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_BANGHUI)
	}

	function checkTianTingShiLian() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_TIANTINGSHILIAN)
	}

	function checkSanShengSanShi() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_SANSHENGSANSHI)
	}

	function checkPaiHangBang() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_PAIHANGBANG)
	}

	function checkDanYao() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_DANYAO)
	}

	function checkShenBing() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_SHENBING)
	}

	function checkYeWaiBOSS() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_YEWAIBOSS)
	}

	function checkChiBang() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_CHIBANG)
	}

	function checkFaZhen() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_FAZHEN)
	}

	function checkXianWei() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_XIANWEI)
	}

	function checkTongLing() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_TONGLING)
	}

	function checkShouHun() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_SHOUHUN)
	}

	function checkJingMai() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_JINGMAI)
	}

	function checkTianNv() {
		let needVip = VipSystem.getInstance().getTianNvVipLevel()
		if (needVip > 0 && GetHeroProperty("VIP_level") >= needVip) {
			return [true, ""]
		}
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_TIANNV)
	}

	function checkShengSiJie() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_SHENGSIJIE)
	}

	function checkXianQi() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_XIANQI)
	}

	function checkHuaNian() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_HUANIAN)
	}

	function checkLingQi() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_LINGQI)
	}

	function checkFaBao1() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_FABAO1)
	}

	function checkFaBao2() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_FABAO2)
	}

	function checkFaBao3() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_FABAO3)
	}

	function checkFaBao4() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_FABAO4)
	}

	function checkXiYouXiangYao() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_XIYOUXIANGYAO)
	}

	function checkShenZhuang() {
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_SHENZHUANG)
	}

	function checkXingLing(){
		return checkGongneng(GuideFuncDefine.FIELD_FUNC_XINGLING)
	}

	function checkFormalFight() {
		if (FightSystem.getInstance().isFight() == false) {
			return [false, ""]
		} else {
			let [fightType, _] = FightSystem.getInstance().getCurFightType()
			if (fightType != opFightResultType.PATROL) {
				return [true, Localize_cns("TEAM_TXT4")]
			}
		}

		return [false, ""]
	}

	function checkWuLin() {
		let isOpen = IsActivityTimeOpened(OrdinaryActivityIndex.WuLin) == false
		if (isOpen) {
			return [false, Localize_cns("WULIN_TXT3")]
		}
		if (GetServerDay() >= 4 && GetHeroProperty("level") >= 90) {
			return [true, ""]
		} else {
			return [false, Localize_cns("WULIN_TXT2")]
		}
	}


	let list: any = {
		//功能//////////////////////////////////////////////////////////////
		["huodong"]: checkHuoDong, //活动
		["xianlv"]: checkXianLv, //仙侣
		["zhucheng"]: checkZhuCheng, //主城
		["chenghao"]: checkChengHao, //称号
		["global"]: checkKuaFu, //跨服
		["shizhuang"]: checkShiZhuang, //时装
		["tianxian"]: checkTianXian, //天仙
		["gonghui"]: checkBangHui, //帮会
		["sanshengsanshi"]: checkSanShengSanShi, //三生三世
		["paihangbang"]: checkPaiHangBang, //排行榜
		//["jingjichang"]: checkJingjichang, //竞技场
		["fuben"]: checkCaiLiaoFuBen, //材料副本
		["judian"]: checkJuDian, //据点抢矿掠夺

		//标签页//////////////////////////////////////////////////////////
		//标签页控件名统一
		/////////////////////////////////////////////////////////////////
		["zuoqi"]: checkZuoQi, //坐骑
		["dohailonggong"]: checkDoHaiLongGong, //龙王宝藏（翻工麻烦，先留着），下面的作通用
		["longwang"]: checkDoHaiLongGong, //龙王宝藏
		["xiaoleiyinsi"]: checkXiaoLeiYinSi, //小雷音寺
		["xiyoulilian"]: checkXiYouLiLian, //西游历练
		["tiantingshilian"]: checkTianTingShiLian, //天庭试炼
		["danyao"]: checkDanYao, //丹药
		["shenbing"]: checkShenBing, //神兵
		["yewaiBOSS"]: checkYeWaiBOSS, //野外boss
		["chibang"]: checkChiBang, //翅膀
		["fazhen"]: checkFaZhen, //法阵
		["xianwei"]: checkXianWei, //仙位
		["tongling"]: checkTongLing, //通灵
		["shouhun"]: checkShouHun, //兽魂
		["jingmai"]: checkJingMai, //经脉
		["tiannv"]: checkTianNv, //天女
		["shengsijie"]: checkShengSiJie, //生死劫
		["xianqi"]: checkXianQi, //仙器
		["huanian"]: checkHuaNian, //花撵
		["lingqi"]: checkLingQi, //灵气
		["shenzhuang"]: checkShenZhuang, //灵气

		//手动//////////////////////////////////////////////////////////
		["richang"]: checkXiYouXiangYao,  //西游降妖(日常)
		["formalfight"]: checkFormalFight, //检查是否正式战斗（非巡逻）

		// ["fabao1"]: checkFaBao1, //法宝1
		// ["fabao2"]: checkFaBao2, //法宝2
		// ["fabao3"]: checkFaBao3, //法宝3
		// ["fabao4"]: checkFaBao4, //法宝4
		["wulin"]: checkWuLin, //检查武林

		["xingling"] : checkXingLing, //检查星灵
	}

	if (list[index]) {
		let func = list[index]
		return func()
	}

	return [true, ""]
}

////////////////////////////////////////////////////////////////////////////
function handleImplement() {
	MsgSystem.addTagTips(Localize_cns("UNIMPLEMENT_TIPS"))
}

// function InitFunctionMenu1() {//培养

// 	let commonHandler = ExecuteMainFrameFunction

// 	let FuncMenu1Config: any = {
// 		["beibao"]: { ["index"]: 1, ["title_img"]: "sd_biaoQianDi15", ["effect"]: effectIndex.MenuBeibao, ["offset_y"]: 10, ["x"]: 480, ["y"]: 660, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["yuling"]: { ["index"]: 2, ["title_img"]: "sd_biaoQianDi08", ["effect"]: effectIndex.MenuYuling, ["offset_y"]: 10, ["x"]: -15, ["y"]: 108, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["shouhu"]: { ["index"]: 3, ["title_img"]: "sd_biaoQianDi09", ["effect"]: effectIndex.MenuShouHu, ["offset_y"]: 10, ["x"]: 425, ["y"]: 85, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["huoban"]: { ["index"]: 4, ["title_img"]: "sd_biaoQianDi14", ["effect"]: effectIndex.MenuJuese, ["offset_y"]: 0, ["x"]: -45, ["y"]: 385, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["jitan"]: { ["index"]: 5, ["title_img"]: "sd_biaoQianDi12", ["imgW"]: 165, ["effect"]: effectIndex.MenuJitan, ["offset_y"]: 10, ["x"]: 480, ["y"]: 335, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },

// 	}
// 	return FuncMenu1Config
// }



// ////////////////////////////////////////////////////////////////////////////

// function InitFunctionMenu2() {//收益

// 	let commonHandler = ExecuteMainFrameFunction
// 	let FuncMenu3Config: any = {
// 		["tianti"]: { ["index"]: 1, ["title_img"]: "sd_biaoQianDi18", ["effect"]: effectIndex.MenuTianti, ["offset_y"]: 220, ["x"]: 180, ["y"]: 0, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: false, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["shengdi"]: { ["index"]: 2, ["title_img"]: "sd_biaoQianDi04", ["effect"]: effectIndex.MenuShengDi, ["offset_y"]: 280, ["offset_x"]: -110, ["x"]: 415, ["y"]: 110, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["shilian"]: { ["index"]: 3, ["title_img"]: "sd_biaoQianDi03", ["effect"]: effectIndex.MenuShiLian, ["offset_y"]: 0, ["imgW"]: 200, ["offset_x"]: -25, ["x"]: 0, ["y"]: 220, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["jingjichang"]: { ["index"]: 4, ["title_img"]: "sd_biaoQianDi02", ["effect"]: effectIndex.MenuJingji, ["offset_y"]: 195, ["x"]: 420, ["y"]: 462, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["guanka"]: { ["index"]: 5, ["title_img"]: "sd_biaoQianDi01", ["effect"]: effectIndex.MenuGuanka, ["offset_y"]: 58, ["x"]: 163, ["y"]: 600, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["hanghai"]: { ["index"]: 6, ["title_img"]: "sd_biaoQianDi20", ["effect"]: effectIndex.MenuHanghai, ["offset_y"]: 0, ["x"]: -45, ["y"]: 645, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },

// 		//["jiaoyisuo"]   = { ["title_img"] : "sd_biaoQianDi10", ["image"]: effectIndex.MenuBeibao,["x"]: 20, ["y"]: 20, ["w"]:0,		["h"]: 0, ["handle"] : commonHandler,["close"] : true, ["func"] : GuideFuncDefine.FIELD_FUNC_JINGJICHANG,["campaignId"] : 1000,},

// 		//["jifen"] 				= { ["title"] : Localize_cns("MAIN_TXT29"), ["image"]:"ejcd_jianZhuIcon01",["x"]:320, ["y"]: 20, ["w"]:0,		["h"]: 0, ["handle"] : commonHandler,["close"] : true, ["func"] : GuideFuncDefine.FIELD_FUNC_JINGJICHANG,["campaignId"] : 1000,},
// 		//["choujiang"] 		= { ["title"] : Localize_cns("MAIN_TXT27"), ["title_img"] : "", ["image"]: effectIndex.MenuBeibao,	["x"]: 205, ["y"]: 335,["w"]:0,		["h"]: 0, ["handle"] : commonHandler,["close"] : true, ["func"] : GuideFuncDefine.FIELD_FUNC_JINGJICHANG,["campaignId"] : 1000,},
// 	}
// 	return FuncMenu3Config

// }


// ////////////////////////////////////////////////////////////////////////////
// function InitFunctionMenu3() {//社交

// 	let commonHandler = ExecuteMainFrameFunction
// 	let FuncMenu2Config: any = {
// 		["haoyou"]: { ["index"]: 1, ["title_img"]: "sd_biaoQianDi07", ["effect"]: effectIndex.MenuHaoyou, ["offset_y"]: -10, ["x"]: 425, ["y"]: 68, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["gonghui"]: { ["index"]: 2, ["title_img"]: "sd_biaoQianDi05", ["effect"]: effectIndex.MenuGonghui, ["offset_y"]: 70, ["x"]: 213, ["y"]: 585, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["paihangbang"]: { ["index"]: 3, ["title_img"]: "sd_biaoQianDi06", ["effect"]: effectIndex.MenuPaihangbang, ["offset_y"]: 0, ["x"]: -45, ["y"]: 645, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["email"]: { ["index"]: 4, ["title_img"]: "sd_biaoQianDi16", ["imgW"]: 135, ["effect"]: effectIndex.MenuYoujian, ["offset_y"]: -0, ["x"]: 510, ["y"]: 660, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["homepage"]: { ["index"]: 5, ["title_img"]: "sd_biaoQianDi17", ["imgW"]: 160, ["effect"]: effectIndex.MenuZhuYe, ["offset_y"]: 0, ["x"]: 480, ["y"]: 326, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_JINGJICHANG, ["campaignId"]: 1000, },
// 		["zudui"]: { ["index"]: 6, ["title_img"]: "sd_biaoQianDi19", ["effect"]: effectIndex.MenuZudui, ["offset_y"]: 50, ["x"]: -20, ["y"]: 100, ["w"]: 0, ["h"]: 0, ["handle"]: commonHandler, ["close"]: true, ["func"]: GuideFuncDefine.FIELD_FUNC_ZUDUI, ["campaignId"]: 1000, },
// 	}
// 	return FuncMenu2Config

// }