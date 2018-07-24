////////////////////////////////////////////////////////////////////////////////
//人物定义
////////////////////////////////////////////////////////////////////////////////

let genderOptions:any = {
	MALE   : 1, // 男
	FEMALE : 2, // 女
}

//狗狗模型
//let dogOption:any = {0,1,2,3}


let playerOptions:any = {
	autoLevel : 80,				//自动升级
	maxLevel : 300,						 	//最大等级
	powerTime : 1800, 				  //体力恢复时间
	powerPoint : 4,     				//体力恢复点算
	powerDayInc : 100,					//每天0点加100点体力
	//inviteAmbassadorLevel	: 3, 	//邀请大使最高等级
	rmbGoldToPower : 0,					//晶石兑换体力记录
	rmbGoldToPowerAdd : 300,		//晶石兑换体力300点
	rmbGoldToFunds : 0,					//晶石兑换金币记录
	rmbGoldToFundsAdd : 0,		  //晶石兑换金币5000个
	renQiCount : 80,						//人气
	offlinePreTime : 30,			//30秒算一次离线挂机
	offlineMaxTime : 21600,			//30秒算一次离线挂机
	taozhuang : 160,                //套装
	shenzhuang : 140,               //神装
	dati       : 45 ,               //答题
	shenhun    : 90 ,				//神魂
	xingling   : 63 ,               //星灵
}


let exchangeFundOptions:any = {
	itemid : 60045, //银两兑换令.
	itemnum : 1 ,  //消耗兑换令数量
	gold : 10, //如果没有兑换令需要消耗元宝
	num : 5, //可以兑换多少次
	viplevel : 4, //vip4或以上可以多兑换
	vipaddnum : 2, //多兑换2次
	maxVipNum : 16 , //最大的Vip
}

let dailyOptions : any  = {
	xiangyaoMaxCount : 10,  //降妖的环数
	xiangyaoMaxMonster : 5, //降妖的最大妖怪
	zuduiMaxCount : 10 ,  //组队的次数
	zuduiMaxNum : 30,  //组队的最多次数
	sanbaiMaxCount : 300, //三百的次数
	sanbaiSecondCount : 200, //三百的第二阶
	sanbaiFirstCount : 100,  //三百的第一阶

}


let zhongKuiOptions : any = {
	[OrdinaryActivityIndex.ZhongKuiDemon] : {[11] : [56, 55], [12] : [70, 13], [13] : [44, 19], [14] : [25, 55], [15] : [75, 40] }
}

let opSaveRecordKey:any = {
	dailyTowerTimes        : 1,  //天空之塔活动次数
	autoIncPower           : 2,  //自动恢复体力
	acceptType             : 3,  //个人设置是否接受组队/切磋.+
	login                  : 4,  //登陆
	meiRiQianDao           : 5,  //每日签到
	mainTask               : 6,  //主线任务
	dailyActivity          : 9,	 //天空之塔重置次数
	autoIncInteractCount   : 10, //自动恢复互动次数
	rmbGoldToFundsCount  　: 11, //晶石兑换金币次数
	canGainNewRoleGifts    : 12, //创角礼包
	newBiePetAndTask       : 13, //新手宠物，任务标志
	robberLostTimes        : 15, //混沌时空失败次数		//彩蛋
	robberPunishTime       : 16, //混沌时空失败惩罚时间
	worldbossInspire       : 17, //世界boss鼓舞次数
	worldbossWait          : 18, //世界boss死亡等待
	reconnectCount         : 19, //重连次数
	robberTicket           : 20, //混沌时空令牌冷却时间
	factionmapWait         : 21, //帮派副本等待时间
	
	championTimes          : 23, //竞技场挑战剩余次数
	championTime           : 24, //竞技场挑战时间
	dailyFourTimes         : 25, //日常四剩余次数
	interactCount          : 26, //每天互动恢复次数
	worldMessageCount      : 27, //世界频道聊天次数
	factionAttendance      : 28, //军团签到
	//warHornReward          : 29, //战争号角
	meirichoujiang         : 30, //每日抽奖/命运占卜
	queenAttendance        : 31, //女王祷告
	invitedAmbassador      : 32, //邀请大使
	springMagicPower       : 33, //魔法之泉
	pushEventId            : 39, //推送事件Id
	giveUpEventIdList      : 40, //放弃事件Id列表
	CampaignToTalTime      : 44, //到达指定关卡累计时间
	RecruitBateFreeCount   : 45, //已经抽奖次数
	RecruitHoopFreeCount   : 46, //已经刷新次数
	RecruitHoop            : 47, //快速招募所在环
	RecruitHoopCount       : 48, //快速招募每天共刷环次数
	FirstRecharge          : 49, //首次充值
	haveWarHorn            : 50, //是否拥有战争号角
	petRecruitNew          : 51, //快速招募新手宠物
	pushEventFinishTime    : 53, //推送事件完成时间
	burstEventFinishTime   : 54, //突发事件完成时间
	pushEventCount         : 55, //推送事件完成次数
	recoverPowerFirst      : 56, //0点恢复体力
	recuritPetList         : 58, //快速招募列表
	recruitWipe            : 59, //快速招募中首次扫荡
	SkyTowerChallenge      : 60, //天空之塔是否挑战过
	itemMgrCountLimit      : 61, //竞技场商城兑换数量记录
	vipGifts               : 62, //vip礼包领取
	//equipLotteryCount    : 63, //装备抽奖次数
	//equipLottery         : 64, //单次抽取装备计数
	//equipLotteryTime     : 65, //单次抽取时间
	relicMineFailed        : 66, //矿洞失败记录
	relicMineCount         : 67, //矿洞攻打次数
	RecruitTime            : 68, //快速招募时间间隔
	quickRecruitList       : 69, //快速招募挑战列表
	riddleBoxCount         : 70, //迷之宝箱
	spaceTimeRobber        : 71, //时空盗贼
	ambassadorDailyPrize   : 72, //邀请大使每日领奖
	cardQQPrize            : 73, //完善名片qq信息
	cardWeiXinPrize        : 74, //完善名片微信信息
	secondRecharge         : 76, //二次充值
	dailyRecharge          : 77, //每日充值奖励(适用于常驻活动或者统计类型,不能用于后台配置的运营活动)
	dailyPower             : 78, //每日领取体力
	equipNeedCount         : 79, //必定出超凡或者至尊的次数
	monthCard              : 80, //月卡
	addBody                : 81, //道具增加形象
	levelFund              : 82, //购买成长基金
	levelFundReward        : 83, //成长基金奖励
	cardPhonePrize         : 84, //完善电话号码信息
	lostTempleCD           : 85, //CD时间
	lostTemplePrizeTimes   : 86, //奖励次数
	equipEnhanceEvent      : 87, //装备强化事件
	equipRefineEvent       : 88, //装备洗练事件
	equipCastEvent         : 89, //装备重铸事件
	zhenxingInspire        : 90, //阵营战鼓舞
	factionWarTicket       : 91, //军团战令牌冷却时间
	factionWarWait         : 92, //军团战死亡等待
	monsterSiegeWait       : 93, //魔物围城死亡等待
	monsterSiegeInspire    : 94, //魔物围城鼓舞
	monsterSiegeBuff       : 95, //魔物围城buff
	robberBeKillTimes      : 96, //混沌被击杀次数
	itemMgrWeekLimit       : 97, //每周购买限制
	honorPointPrize        : 98, //成就点奖励记录
	vipLogin               : 99, //vip登陆公告时间记录
	vipEnterMap            : 100, //vip进入地图公告时间记录
	magicStoneEffectList   : 101, //魔导石道具解锁列表
	combatTeamFetters      : 102, //人气值
	magicStoneLock         : 103, //魔导石解锁
	runmanDeadWait         : 104, //迷惑宫殿死亡等待
	wingFaileCount         : 105, //翅膀失败次数
	midAutumnChangeCount   : 106, //中秋节兑换礼品次数
	deadFieldResetCount    : 107, //死亡领域重置次数
	deadFieldPower         : 108, //死亡领域扣除体力
	bookLotteryCount       : 109, //刷新显示技能次数
	secretLandInspire      : 110, //密语境地鼓舞等级
	secretLandWait         : 111, //密语境地死亡等待
	oldName                : 112, //旧名字
	changeNameTime         : 113, //上次改名时间
	singlesDayGoddess      : 114, //光棍节选择的女神
	singlesDayEncounter    : 115, //光棍节邂逅时间
	loverValue             : 116, //情缘值
	singlesDayQuestion     : 117, //光棍节题目
	singlesDayReward       : 118, //光棍节情缘值奖励
	disCountLimitCount     : 119, //折扣商城物品数量限购
	guozhanBuyPoint        : 120, //国战每日购买
	springMonsterCount     : 121, //击杀年兽次数
	activityRecharge       : 122, //活动期间充值晶石数量
	slotDayCount           : 123, //老虎机当天玩的次数
	goldenEggsRecharge     : 124, //砸金蛋活动期间的充值数量
	fortuneCatTimes        : 125, //招财猫活动当天次数
	cardNextTime           : 126, //下次可以翻牌的时间
	operateActiveValue     : 127, //开工每日活跃度
	operateActivePrize     : 128, //开工每日活跃度奖励记录
	childCardNextTime      : 129, //儿童节下次可以翻牌的时间
	factPVETime            : 130, //军团pveboss时间
	factionDonateCount     : 131, //军团建筑捐献次数
	unionPVPFlagTime       : 132, //联盟pvp拥有战旗时间
	unionPVPWait           : 133, //联盟pvp复活时间
	welfareLotteryFreeTime : 134, //转盘每日免费次数
	unionPVPItemCD         : 135, //联盟物品cd时间
	unionPVPEnterTime      : 136, //联盟pvp再次进入等待时间
	unionPVPBossTime       : 137, //联盟pvpBoss间隔
	matrixmapWait          : 138, //联盟pve里　灵阵守卫复活cd时间
	powerGetCount          : 139, //体力领取次数
	worldBossBoxCount      : 140, //魔龙宝箱次数
	worldBossFightCount    : 141, //打魔龙次数
	onlineRightCount       : 142, //在线抢答次数
	robberMutilIncome      : 143, //混沌多倍收入
	facPubTaskCount        : 144, //军团任务当天发布次数
	luxuryWeddingPoint     : 145, //豪华婚礼已经走过的点
	//新加
	growBuyLiveNum         : 146, //养成系统购买活力的次数
	skyTowerChangeVocation : 147, //天空之塔转换职业
	chooseSex              : 148, //选择性别  
	homePagePraiseCount    : 149, //主页点赞数量
	newPlrGrow             : 150, //主角养成暴击事件
	robberRefreshCount     : 151, //混沌抽奖刷新次数
	newSummonStone         : 152, //新手召唤石
	robberBuffList         : 153, //混沌当前使用的技能
	inviteFriend           : 154, //渠道邀请好友
	resetInviteTime        : 155, //渠道重置时间
	reviveSkyTower         : 156, //试炼场复活
	newBieRobber           : 157, //新手圣地
	strongholdCount        : 158, //（据点已占领次数）矿洞掠夺次数
	relicMineRobPrizeCount : 159, //矿洞掠夺奖励次数
	fengMoFinishCount      : 160, //封魔任务完成次数
	//彩蛋相关
	easterEggTaklTimes     : 161,	//NPC对话次数
	campaignFailData       : 162,	//关卡连续失败数据
	equipEnhanceFailData   : 163,	//装备
	egEmployCount          : 164, //所有雇佣次数
	firstLostRobberKey     : 165, //第一次失去圣地宝藏钥匙
	growWrongAnswerTimes   : 166, //养成回答错误次数
	robberBossBox          : 167, //圣地宝箱状态
	robberBossEntryId      : 168, //圣地bossEntryId
	robberNoDroptimes      : 169, //彩蛋：记录圣地某个物品没有掉落次数
	//
	skyTowerDiscount       : 180, //天空之塔打折事件
	dailyEmployCount       : 181, //天空之塔雇佣次数
	identifyCount          : 182, //免费鉴定次数
	monthCardRecruitTimes  : 183, //买月卡送120抽次数
	monthCardRecruitCD     : 184, //买月卡送120抽冷却时间
	recruitItemCount       : 185, //物品使用增加的祭台抽奖次数
	hoopItemCount          : 186, //物品使用增加的祭台刷新次数
	chooseDog              : 187, //选择狗模型
	campaignGifts          : 188, //关卡礼包
	castCount              : 189, //免费重铸次数
	superMonthCard         : 190, //超级月卡
	robberTicketEntryId    : 191, //圣地密钥npcEntryId
	examServerConfig       : 192, //审核服配置记录
	firstChampionPoint     : 193, //第一次获取竞技场积分奖励
	monthQualityStone      : 194, //买月卡在单充>:600晶石可以获得召唤石
	newBieQuenchValueRatio : 195, //新手职业重置获得淬炼值翻倍
	immorFreeExper         : 196, //神兵免费体验
	newFeelLottery         : 197, //新手心情值抽奖
	dayFactPoint           : 198, //每日军团任务积分
	facTaskPrize           : 199, //公会任务积分奖励
	newBieBox              : 200, //新手宝箱
	newBieBoxTime          : 201, //新手宝箱过期时间
	godAnimalExpTime       : 202, //神兽体验时间
	//
	zhongKuiFuMoKill       : 203, //钟馗伏魔
	zhongKuiFuMoPrize      : 204, //钟馗伏魔
	
	facRenqiSet             : 205, //帮派上香
	facDailyRenqiPrize      : 206, //帮派上香奖励(每日)
	facDailyActiveExp      	: 207, //帮派每日活跃
	facDailyActivePrize     : 208, //帮派每日活跃奖励
	facMapTaskFinishCount   : 209, //帮派地图任务完成次数{[type]:count}
	facMapTaskPrizeGet      : 210, //帮派地图领奖标志{[type]:isGet} 1是领取，其他未领取
	facMapTaskResetCount    : 211, //帮派地图任务重置次数{[type]:count} 
	
	facExchangeItemRefreshCount            : 212	,//可刷新次数
	facExchangeItemRefreshTime             : 213, //下次刷新时间
	
	escortRemainCount       : 215, //西游护送任务剩余次数
	escortRobberCount       : 216, //西游护送抢夺次数
	factionMapPrizeCount    : 217, //帮派副本奖励次数
	factionMapHelpCount     : 218, //帮派副本奖励次数
	treasureLottery					: 219, //寻宝抽奖
	petLottery							: 220, //神宠抽奖
	investPlan 							: 219, //购买投资计划
	investPlanReward 				: 220, //投资计划奖励
	//dailyLogin							: 221, //每日登陆
	//dailyLoginReward				: 222, //登陆奖励
	//dailyLoginCount					: 223, //登陆次数(7天奖励结束清除)
	stageUp									: 224, //直升一阶
	
	monthCardReward          : 225, //月卡奖励
	
	weekCard              	: 226, //周卡
	weekCardReward          : 227, //周卡奖励	
	levelReward  : 228, //等级奖励
	xiyouWelfareReward : 229, //西游福利
	xiyouLilianScore        : 230, //西游历练今日活跃点数
	wildBossCoolTime        : 231, //挑战野外boss冷却时间
//	oldName                 = 232, --改名的旧名
	escortNum               : 233, //西游历练历史记录
	capturePet              : 234, //可以捕捉宠物的记录
	TalismanCount			: 256,		//法宝锻造次数
	shituTaskPrize		: 257,   //徒弟任务是否领取
	hourseExp 	: 258,   //房子可否领取经验
	escortRecordCount       : 259, 
	mixAccuRechargePrize    : 260, //累积充值
	newMixAccuRechargePrize : 261, //开服累积充值
	stageLevelUpA           : 262, //升阶活动A
	stageLevelUpB           : 263, //升阶活动B
	newAllStageLevelUp      : 264, //开服全民进阶活动
	newServerStageLevelUp   : 265, //开服进阶活动
	newServerShopDiscount   : 266, //新服折扣
	shopDiscountA           : 267, //折扣商城A
	newServerAllBuy         : 268, //全民团购
	newServerAllLevelUp     : 269, //全民升级
	youQingBiList	        : 270, //友情币可领取情况
	sendYouQingBi	        : 271, //是否发送过友情币
	campaignHelpCount       : 272, //关卡协助次数
	campaignGetHelpCount    : 273, //关卡发起帮助次数
	newServerMission        : 274, //新服龙王章节
	newServerInstZones      : 275, //开服副本,熊猫大侠
	shopDiscountB           : 276, //折扣商店B
    facExchange             : 277, //帮会兑换记录
	wildBossConsumeRecord   : 278, //野外boss消耗记录
	buyWorldBossCount		: 279, //全民BOSS购买次数
	buyChampionTimesCount	: 280, //竞技场购买次数
	everyMixAccuRechargePrize : 281, //每日首冲领取条件
	AccumRecharge           : 282, //累冲回馈	
	FallenGoodGiftRecharge	: 283,  //天降豪礼今日充值
	GodPetConsume           : 284,  //神宠来袭
	FestRebateConsume       : 285,  //节日返利
	FallenGoodGiftShop 		: 286,  //限时特惠
	JingCaiShop             : 287,  //精彩活动神秘商城购买记录
	JingCaiShopXianZhi      : 288,  //精彩活动神秘商城不重置
	AccRechargeGift         : 289,  //累充有礼
	LiuJieXunBao            : 290,  //六界寻宝
	tempCellPrize           : 291,  //通用进阶奖励
	xingLingTiYan	        : 292,  //星灵体验
	PetSkillWashActivity    : 300,  //宠物洗练活动
	PetSkillWashActivityNum : 301,  //宠物洗练活动次数
	firstRechareTiannv      : 302,  //仙侣体验倒计时
	equipIntenstifyRedDot   : 303,  //锻造强化红点记录
	WorldOneInsertIndex     : 304,  //天下第一报名记录
	FreeTianNv              : 305,  //免费玩家送天女
	strongholdRobCount      : 308,  //据点抢夺次数
	strongholdDieWait       : 309,  //据点进入等待
	strongholdBossBoxRecord : 310,  //boss宝箱记录
	strongholdKillCurse     : 312,  //天宫杀人诅咒

	
	//任务相关 600 ~ 3000
    taskCancelTime : {},	//任务放弃时间
    taskHoop: {},	//任务环段
    taskAcceptCount: {}, //任务接取次数 1400
    taskCount: {},	//任务每天做的次数
    taskWeekCancel: {},	//任务是否放弃过
    taskWeekOpen: {},	//任务是否开启过
    taskWeekCount: {},	//任务本周做的次数
        
    
    rechargeReward: {},	//充值奖励 3131-3150
        //honorTitleKey 	= {},	//荣誉称号 3200-3300
    dailyShare: {},	//每日分享 3601-3610
    firstShare: {},	//第一次分享 3611-3620
}

let opVocation:any = {
	AutoOpenId : 40004,//默认创建角色就开启的职业//
	MaxSkillNum : 5,//最多5个技能//
	MaxSkillLevel : 30,//最大技能等级//
	BeginEntryId : 40000,//职业EntryId起始//
}

//任务放弃时间
//opSaveRecordKey.taskCancelTime[3] 	= 600
//opSaveRecordKey.taskCancelTime[4] 	= 601
//opSaveRecordKey.taskCancelTime[5] 	= 602
//opSaveRecordKey.taskCancelTime[8] 	= 603
//opSaveRecordKey.taskCancelTime[9] 	= 604
//opSaveRecordKey.taskCancelTime[16] 	= 605
//opSaveRecordKey.taskCancelTime[19] 	= 606
//opSaveRecordKey.taskCancelTime[20] 	= 607
//opSaveRecordKey.taskCancelTime[21] 	= 608
//opSaveRecordKey.taskCancelTime[7] 	= 609

//任务环段
//opSaveRecordKey.taskHoop[3]  = 1000 //师门任务
//opSaveRecordKey.taskHoop[7]  = 1001 //护送任务
//opSaveRecordKey.taskHoop[8]  = 1002
//opSaveRecordKey.taskHoop[9]  = 1003
//opSaveRecordKey.taskHoop[11] = 1004
//opSaveRecordKey.taskHoop[12] = 1005
//opSaveRecordKey.taskHoop[13] = 1006
//opSaveRecordKey.taskHoop[14] = 1007	//修炼任务
//opSaveRecordKey.taskHoop[18] = 1009
//opSaveRecordKey.taskHoop[23] = 1010
//opSaveRecordKey.taskHoop[24] = 1011
//opSaveRecordKey.taskHoop[25] = 1012 //帮派建筑
//opSaveRecordKey.taskHoop[26] = 1013 //帮派玄武
//opSaveRecordKey.taskHoop[27] = 1014 //帮派跑商
//opSaveRecordKey.taskHoop[28] = 1015 //飞行旗

//任务每天接的次数
//opSaveRecordKey.taskAcceptCount[7] = 1400 //压镖

//任务每天做的次数
opSaveRecordKey.taskCount[33] = 1511 //封魔任务
//	
////任务每周做的次数
//opSaveRecordKey.taskWeekCount[19] = 1600
//opSaveRecordKey.taskWeekCount[20] = 1601
//opSaveRecordKey.taskWeekCount[21] = 1602
//opSaveRecordKey.taskWeekCount[10] = 1603
//	
////任务本周是否放弃过
//opSaveRecordKey.taskWeekCancel[13] = 1800
//opSaveRecordKey.taskWeekCancel[14] = 1801	//
//opSaveRecordKey.taskWeekCancel[15] = 1801	//
//opSaveRecordKey.taskWeekCancel[25] = 1802	
//
////任务本周是否开启过
//opSaveRecordKey.taskWeekOpen[13] = 1850	
//opSaveRecordKey.taskWeekOpen[14] = 1851	
//opSaveRecordKey.taskWeekOpen[15] = 1852
//opSaveRecordKey.taskWeekOpen[25] = 1853


//等级奖励
//opSaveRecordKey.levelReward[10]						= 3121			//10级奖励
//opSaveRecordKey.levelReward[20]						= 3122			//20级奖励
//opSaveRecordKey.levelReward[30]						= 3123			//30级奖励
//opSaveRecordKey.levelReward[40]						= 3124			//40级奖励
//opSaveRecordKey.levelReward[50]						= 3125			//50级奖励
//opSaveRecordKey.levelReward[60]						= 3126			//60级奖励

//充值奖励
opSaveRecordKey.rechargeRewardBegin			= 3131
opSaveRecordKey.rechargeRewardEnd				= 3150

opSaveRecordKey.dailyShare.qq								= 3601	//qq(null 未分享)
opSaveRecordKey.dailyShare.xinLang					= 3602	//新浪微博(null 未分享)	
opSaveRecordKey.dailyShare.weiXin						= 3603	//微信(null 未分享)

opSaveRecordKey.firstShare.qq								= 3611	//qq(null 已分享)
opSaveRecordKey.firstShare.xinLang					= 3612	//新浪微博(null 已分享)	
opSaveRecordKey.firstShare.weiXin						= 3613	//微信(null 已分享)

//封禁状态,0为正常，1为禁止登录，2为禁言,
let opBanStatus:any = {
	NORMAL  : 0,
	LOGIN		: 1,
	TALK		: 2, 
}

//战争号角
//warHornConfig = 
//{
//	leastRmbGold  				: 50,							//至少50晶石
//	maxLastTime						: 180*24*3600,		//最大持续时间
//	minLastTime						: 0,							//最小持续时间
//	time									: 30*24*3600,			//每次激活持续时间
//	canGetRmbGold					: 100,            //每天可领取的晶石
//}

//御灵索引配置
// let opSacrificeIndex:any = {
// 	BEGIN       : 294,  //御灵开始
// 	END         : 301,  //结束
// }

// //祭祀属性
// let opSacrificeField:any = {
// 	LEVEL			: 1,          //等级(默认0)
// 	RATE 			: 2,          //失败增加成功率(默认0)
// 	STATU 		: 3,          //当前状态(默认2)
// 	TIME			: 4,          //成功率过期时间(默认os.time())
// }

// //祭祀状态
// let opSacrificeStatus:any = {
// 	CAN						: 	1,			//能激活状态
// 	NOT						:		2,			//未激活状态
// 	YES						:		3,			//激活状态
// }

// let opHonorTitleType:any = {
// 	Normal				:	1,			//普通
// 	Senior				: 2,			//稀有
// 	Super					: 3,			//超稀有
// }

// let opGlobalCombinedSkillConfig:any = {
// 	useSkillCount : 3,			     //使用数量
// 	skillCD : 60,  					     //公共冷却时间
// 	commonType : 100 ,				   //通用合力技类型，用于特殊处理斗技、天空之塔。
// 	skillLevelUpCD : 7200,       //援助技能升级冷却时间
// 	goldPerMinu : 0.2,           //清除冷却时间每分钟花的晶石
// }

// //修改性别
// let opChangeSex:any = {
//  needItem : [40516, 1],  //消耗的物品
// }

// let opPartnerBreak:any = {
// 	SoulItemSubType : 12,// 碎魂的子类型
// 	SameSoulItemPoint : 10, // 同类的碎魂得多少点碎魂值
// 	DifferentSoulItemPoint : 5, // 不同类的碎魂得多少点碎魂值
// }
//
// let configLoaclRecord:any = {
// 	robberHeroHp           : 1,  //混沌世界宠物血量
// 	burstEventCount        : 2,  //突发事件每日总次数
// 	robberPiece            : 3,  //混沌世界兑换碎片数
// 	towerResetCount        : 4,  //天空之塔重置记录可用次数
// 	robberPower            : 5,  //混沌世界体力计算
// 	pushEventRecordTime    : 9,  //推送事件 事件时间记录
// 	startChangeInteract    : 10, //通过1009关卡后才开始恢复体力
// 	heroTaskPrize          : 11, //部下任务奖励领取
// 	quickRecruit           : 12, //快速招募挑战列表
// 	skyTowerRewardChoose   : 13, //天空之塔奖励选择	
// 	robberKillTimes        : 14, //混沌世界连杀数
// 	wudouPoint             : 15, //武斗积分
// 	robberCounter          : 16, //混沌世界打怪计数器
// 	activeCode             : 17, //礼包兑换情况
// 	firstRechargeValue     : 18, //首冲数额
// 	firstRechargeReward    : 19, //邀请成就首充成就奖励领取
// 	compensate             : 20, //补偿
// 	GMBody                 : 21, //GM形象
// 	factionRenQi           : 22, //每日贡献人气
// 	factionMapCount        : 23, //军团副本
// 	factionCreate          : 25, //军团创建
// 	robberkiller           : 26, //复仇名单
// 	rivalPrize             : 27, //矿洞反击奖励
// 	robberMultiRatio       : 28, //混沌多倍收入(活动)
// 	campaginMultiRatio     : 29, //关卡多倍收入(活动)
// 	itemTradeList          : 30, //商城限购/限卖列表
// 	worksDayRecharge       : 31, //充值活动
// 	eliteKillCount         : 32, //每日杀死混沌使徒数量
// 	rmbGoldToPowerCount    : 33, //体力购买次数
// 	//rmbGoldToFundsCount    : 34, //金币购买
// 	firstCampaign          : 35, //个人章节首通
// 	magicStoneFailCount    : 36, //魔导仪升级失败次数
// 	equipLotteryCount      : 37, //装备抽取次数
// 	bindAccount            : 38, //绑定账号奖励
// 	//inviteFriend           : 39, //好友邀请
// 	campaginStar           : 40, //关卡三星重置
// 	accumulative           : 41, //累计充值活动
// 	serverCompensate       : 42, //服务器补偿
// 	blackMarket            : 43, //黑市限购
// 	consume                : 44, //累计消费活动
// 	skyTowerReward         : 45, //天空之塔奖励记录
// 	firstRecuritHoop       : 46, //快速招募第二次刷环
// 	recentRecharge         : 47, //最近充值记录
// 	robberMultiRatioItem   : 48, //混沌多倍收入(道具)
// 	campaginMultiRatioItem : 49, //关卡多倍收入(道具)
// 	robberBoxCount         : 50, //混沌之地转盘
// 	secondRecuitHoop       : 51, //第二次转环
// 	thirdRecuitHoop        : 52, //第三次转环
// 	castUpEvent            : 53, //装备重铸提升事件
// 	refineUpEvent          : 54, //装备洗练提升事件
// 	lostTempleHpRp         : 55, //
// 	payRebate              : 56, //单笔充值返利
// 	lostTemplePick         : 57, //拾取次数
// 	sevenDayPrize          : 58, //七天奖励(单条)
// 	sevenDayPrizeEx        : 59, //七天奖励(全部)
// 	petInteractCount       : 60, //宠物互动次数
// 	lostTemplePKTimes      : 61, //掠夺次数
// 	equipStrength          : 62, //装备提升
// 	skyTowerPrizeRecord    : 63, //天空之塔领取奖励记录层
// 	equipStoneRecord       : 64, //获取宝石
// 	robberPieceEx          : 65, //设置体力消耗时间记录
// 	factionWarFlag         : 66, //
// 	everydayprice          : 67, //每日充值活动;;
// 	doubleprice            : 68, //冲值双倍活动;;
// 	payservers             : 69, //跨服冲值排行活动;;
// 	blackroles             : 70, //黑名单;;
// 	rejectFriends          : 71, //拒绝加好友;
// 	newBieFairy            : 72, //默认精灵
// 	wudouTeamPoint         : 73, //
// 	honorTimeRecord        : 74, //光明神殿抢夺时间
// 	honorCampaginRecord    : 75, //上次挑战关卡记录
// 	questionTime           : 76, //答题时间
// 	honorLostTemp          : 77, //光明神殿捡取时间
// 	honorTempRecord        : 78, //临时记录
// 	forestResetRecord      : 79, //迷雾森林记录重置
// 	wudouServerPoint       : 80, //
// 	forestExternalPrize    : 81, //迷雾森林额外奖励
// 	quitFactionCDTime      : 82, //退出军团后CD时间
// 	honorZhenYingTeam      : 83, //称号/上次所在阵营
// 	honorActivityTime      : 84, //称号/参加活动次数
// 	createCombatTeamTime   : 85, //创建战队时间
// 	honorQiangda           : 86, //称号抢答
// 	honorRecruitHoop       : 87, //称号/转环
// 	welfareLotteryCount    : 88, //神将抽奖
// 	outCombatTeamTime      : 89, //退出战队时间
// 	everyDayAccuPay        : 90, //每日累计冲值奖励
// 	everyDayAccuConsume    : 91, //每日累计消费奖励
// 	festivalCompensate     : 92, //节日全服奖励
// 	midautumnExchange      : 93, //中秋节兑换数量
// 	facwarServerFlag       : 94, //跨服军团战全服奖励
// 	dayOnlineTime          : 95, //今天在线时间
// 	NationalExchange       : 96, //国庆锦盒领取
// 	NationalHunDun         : 97, //国庆混沌杀怪数
// 	ChampionPKTimes        : 98, //国庆竞技场pk次数
// 	NationalExchange2      : 99, //国庆锦盒领取
// 	deadFieldReset         : 100, //死亡领域重置标志
// 	wingSkillLottery       : 101, //翅膀技能书抽奖
// 	setWingSkillFlag       : 102, //设置技能
// 	honorDelete            : 103, //成就点删除记录
// 	HalloweenKill1         : 104, //万圣节杀怪次数
// 	HalloweenExchange2     : 105, //万圣节领取
// 	HalloweenCount         : 106, //万圣节玩家赠送数量
// 	HalloweenBody          : 107, //万圣节变身次数
// 	HalloweenBodyPrize     : 108, //是否可领取变身奖励
// 	HalloweenBuy           : 109, //万圣节购买次数
// 	HalloweenKill2         : 110, //万圣节杀怪次数2
// 	oldPlayerReturn        : 111, //老用户回归奖励记录
// 	SinglesDayKill         : 112, //光棍节截杀小怪数量
// 	SDEncounterRward       : 113, //光棍节奖励次数
// 	SDEncounterCount       : 114, //光棍节可用邂逅次数
// 	ContinuousLogin        : 115, //连续登陆活动领奖记录
// 	petAdvanceExPraise     : 116, //攻略赞
// 	VIPSignIn              : 117, //豪华签到
// 	DailyRechargeAmount    : 118, //每日累计充值
// 	combatTeamPrize        : 119, //骑士团奖励
// 	LeagueBuy              : 120, //跨服天梯每日购买次数
// 	ChristmasDayRecord     : 121, //圣诞活动
// 	NewYearDayRecord       : 122, //元旦节活动
// 	deadFieldPersonal      : 123, //终极境地
// 	freshManTask           : 124, //新手任务
// 	freshManTaskPrize      : 125, //新手任务总体奖励
// 	singleDayRmbLimit      : 126, //光棍节购买次数限定
// 	springOnlineGift       : 127, //春节在线礼包
// 	springMonsterPrize     : 128, //年兽次数奖励
// 	vowBox                 : 129, //许愿盒
// 	redEnvelopeList        : 130, //领取红包列表
// 	slotTotalCount         : 131, //老虎机总玩次数
// 	bindAccountEx          : 132, //新绑定账号
// 	goldenEggsDailyProfit  : 133, //砸金蛋每日收益
// 	goldenEggsGot          : 134, //已砸金蛋编号及对应奖励
// 	goldenEggsRemainHammer : 135, //今天还能获得多少个铁锤
// 	kiteDailyTime          : 136, //春分活动风筝当天已兑换次数
// 	cardDailyTime          : 137, //翻牌当天次数
// 	cardLastPrizeTime      : 138, //翻牌活动上次结算时间
// 	playerKitCount         : 139, //玩家已获得风筝数量
// 	childrenPrizeTime      : 140, //儿童节领奖次数
// 	childCardIsRequest     : 141, //儿童节翻牌是否已经申请
// 	childCardDailyTime     : 142, //儿童节翻牌当天次数
// 	childTodayOnline       : 143, //儿童节活动当天在线时间
// 	factionPVECount        : 144, //军团PVE次数
// 	factionPVECountEx      : 145, //军团PVE次数
// 	fortuneCatTimes        : 146, //玩家当天招财猫已完成次数
// 	singlePayRebate        : 147, //单笔充值
// 	noTroubleMode          : 148, //免打扰模式
// 	friendShip             : 149, //组队缘分值
// 	chatGroupTime          : 150, //聊天组创建时间
// 	factionMtxEnter        : 151, //进入过灵阵守卫
// 	facTaskTodayList       : 152, //当天已经领取的军团任务ID
// 	factionTaskDaily       : 153, //当天领取军团任务次数
// 	tryRide                : 154, //试骑
// 	facTaskCancelTimes     : 155, //当天取消军团任务次数
// 	facTaskItemList        : 156, //已经领取的任务的物品需求
// 	factionMtxPromote      : 157, //灵阵守卫提升机器
// 	worldMessageCount      : 158, //当天世界频道发言次数
// 	facTaskTimeRec         : 159, //军团任务惩罚时间
// 	facTaskTimePoint       : 160, //军团任务取消的时间戳
// 	tryRideList            : 161, //试骑列表
// 	facItemTaskTimeRec     : 162, //军团任务惩罚时间-道具类任务
// 	facItemTaskCancelTimes : 163, //当天取消军团任务次数-道具类任务
// 	facItemTaskCountWeek   : 164, //本周完成军团任务次数-道具类任务
// 	facItemTaskTimePoint   : 165, //军团任务取消的时间戳-道具类任务
// 	facItemTaskItemList    : 166, //已经领取的任务的物品需求-道具类任务
// 	facItemLimitClear      : 167, //本周是否已经解除过军团商店的购买限制
// 	facItemTaskWeek        : 168, //本周领取军团道具类任务次数
// 	robberItemColdTime     : 169, //玩家使用混沌世界道具的冷却时间
// 	combatTeamPVE          : 170, //骑士团pve副本
// 	independenceExchange   : 171, //独立日兑换
// 	meatDailyTime          : 172, //独立日兑换烤肉次数
// 	playerMeatCount        : 173, //玩家捡烤肉数量
// 	hundunDropCount        : 174, //混沌掉落次数
// 	combatTeamPVELayer     : 175, //骑士团副本
// 	// facPubTaskCount     : 176, //军团任务当天发布次数
// 	facPubTaskTimeRec      : 177, //军团任务惩罚时间-发布任务
// 	facPubTaskCancelTimes  : 178, //当天取消军团任务次数-发布任务
// 	facPubTaskTimePoint    : 179, //军团任务取消的时间戳-发布任务
// 	facPubTaskItemList     : 180, //已经领取的任务的物品需求-发布任务
// 	// rideFeedColdTime    : 181, //坐骑喂养冷却结束时间
// 	facPubTaskRecord       : 182, //已经领取的任务的记录
// 	plrFacPubTask          : 183, //玩家当前领取到的发布的军团任务的UID
// 	rideFeedTimeRec        : 184, //坐骑喂养等待时间
// 	rideFeedTimePoint      : 185, //坐骑喂养的时间戳
// 	returnCodeFlag         : 186, //拥有回归码标志
// 	couplePrize            : 187, //玩家领取爱慕值奖励的记录
// 	requestDivorceTime     : 188, //玩家上次申请离婚的时间
// 	pickCandyTimes         : 189, //玩家当天拾取的糖果数量
// 	plrMarryRequest        : 190, //玩家申请结婚的记录
// 	robberOffline          : 191, //混沌离线挂机
// 	redEnvelopeCount       : 192, //领取红包个数
// 	elementStoneRecord     : 193, //武器元素石ID记录
// 	sendRedCount           : 194, //发送红包个数
// 	//
// 	robberTimerBox         : 195, //混沌定时box数量
// 	setVocationCooldown	   : 196, //设置职业的冷切时间
// 	//recuritPetList         : 197, //招募列表
// 	quickRecruitList       : 198, //招募记录列表
// 	championWinStreak      : 199, //竞技场连胜次数
// 	championWinStreakPrize : 200, //竞技场连胜次数奖励记录
// 	homePagePraise         : 201, //点赞记录
// 	championPrizeTimes     : 202, //竞技场奖励次数
// 	//冲值活动统一
// 	payAccum               : 203, //累计充值
// 	consumeAccum           : 204, //累计消费
// 	dayPayAccum            : 205, //每日累计充值
// 	dayConsumeAccum        : 206, //每日累计消费
// 	//
// 	newPlrWeapon           : 207, //新手武器
// 	newPlrCloth            : 208, //新手衣服
// 	newPetGrow             : 209, //新手伙伴养成
// 	dailyEmployCount       : 210, //每日雇佣次数
// 	receiveItemCount       : 211, //每日接收体力次数上限
// 	sendItemCount          : 212, //每日送出体力次数上限
// 	sendPlayerList         : 213, //赠送列表
// 	robberLotteryLib       : 214, //混沌抽奖库
// 	robberBuffsList        : 215, //混沌buff列表
// 	newPlrGrow             : 216, //新手主角养成
// 	robberPrizeInfo        : 217, //混沌收益
// 	newPlrSpellWeapon      : 218, //新手法杖
// 	recruitBreakLevel      : 219, //招募突破等级
// 	robberBossPrizeCount   : 220, //圣地boss奖励次数
// 	robberBossGrabCount    : 221, //圣地boss宝箱抢夺次数
// 	robberOfflineHaveTime  : 222, //混沌离线挂机可以挂多长时间
// 	robberOfflineUsePower  : 223, //混沌离线挂机是否用体力
// 	charmRecoverTime       : 224, //魅力值恢复时间点
// 	factionMapBossCount    : 225, //军团副本杀死哥布林数量
// 	rentEmployCount        : 226, //雇佣出租次数
// 	skyTowerDiscountEvent  : 227, //天空之塔神秘商人次数
// 	pickSmallFlower        : 228, //拾取小鲜花宝箱
// 	pickBigFlower          : 229, //拾取小鲜花宝箱
// 	disCountNewEvent       : 230, //新手打折事件
// 	clearDailyRecord       : 231, //清空天空之塔记录
// 	newRobberItem          : 232, //新手圣地物品
// 	factionWarBigTicket    : 233, //公会战大旗子
// 	newRobberVocItem       : 234, //新手转职材料
// 	newFeelValue           : 235, //新手心情值
// 	newVocationTaste       : 236, //新手职业体验
// 	newRobberPetItem       : 237, //新手进阶材料
// 	tempChatWindowList     : 238, //临时聊天窗口
// 	godAnimalUpRecord      : 239, //神兽升级记录
	
// //zhongKuiKillList       : 240, //钟馗伏魔
// 	personBossList         : 241, //个人boss
// 	lifeAndDeathRecord     : 242, //生死劫当日奖励记录
// 	lifeAndDeathCount      : 243, //生死劫每日协助次数
// 	materialPrizeRecord    : 244, //材料副本奖励记录
// 	dragonPrizeRecord      : 245, //龙王宝藏
	
// 	facActiveTaskCount     : 246, //帮派活跃任务次数
// 	//dragonStarRecord       : 247, //龙王宝藏累星奖励
// 	heavenTrialRecord      : 248, //天庭试炼
// 	facExchangeItemList      : 250, //帮派兑换物品列表
// 	treasureLottery					: 251, //抽奖寻宝记录
// 	monsterFight						: 252,  //暗怪记步数
// 	gettreasure							: 253, 	//每日三百领取奖励记录
// 	meirisanbaiquick				: 254,  //每日三百领取权限
// 	xiyouLilianTaskCount		: 255,   //西游历练任务次数
// }

// let opVocationError:any = {
// 	Success : 0,
// 	EntryIdNotFound : 1,//找不到对应的ID////-
// 	PreEntryIdNotFound : 2, //前置职业没有解锁////-
// 	KissNotEnough : 3,//女神之吻不够//-
// 	GrowAbilityNotEnough : 4,//养成属性不足////-
// 	LastAbilityNotEnough : 5,//二级属性不足////-
// 	TaskNotFinish : 6,//解锁任务未完成////-
// 	ItemListNotEnough : 7,//贡献的物品不足////-
// 	EntryIdUnlocked : 8,//指定的ＩＤ已经解锁
// 	ItemListNotFound : 9,//贡献的物品没有找到////-
// 	RateNotHit : 10,//机率没有命中////
// 	AtLeastOneItem : 11,//至少要提供一个材料
// 	HasUnlock : 12,//指定的职业已经解锁//
// }

// let opSetVocationError:any = {
// 	Success : 0,
// 	EntryIdNotFound : 1,//找不到对应的ID////-
// 	Cooldown : 2, //冷切中////-
// }

// ////清掉职业切换ＣＤ//
// //opClearVocationCooldownError = 
// //{
// //	Success : 0,
// //	NoNeed : 1,//不需要////-
// //	GoldNotEnough : 2, //钻石不足////-
// //}

// let opVocationSkillError:any = {
// 	Success : 0,
// 	EntryIdNotFound : 1,//找不到对应的ID////-
// 	PreEntryIdNotFound : 2, //前置职业没有解锁////-
// 	LevelNotEnough : 3,//等级不够//-
// 	GrowAbilityNotEnough : 4,//养成属性不足////-
// 	LastAbilityNotEnough : 5,//二级属性不足////-
// 	ItemListNotEnough : 6,//贡献的物品不足////-
// 	FundNotEnough : 7,//游戏币不足////-
// 	LevelWrong : 8,//要提升的等级应该是原来的等级加1////
// 	VocationIdNotFound : 9,//指定的职业不存在//-
// }

// let opVocationSetSkillError =//设置技能//
// {
// 	Success : 0,
// 	EntryIdNotFound : 1,//找不到对应的ID////-
// 	SkillNotFound : 2,
// 	SkillNoUnlock : 3,
// 	SkillPosError : 4,
// 	SkillNotBelongThePos : 5,
// 	VocationIdNotFound : 6,//指定的职业不存在//-
// }

// let opPartnerSkillError:any = {
// 	Success : 0,
// 	EntryIdNotFound : 1,//找不到对应的ID////-
// 	LevelNotEnough : 2,//等级不够//-
// 	GrowAbilityNotEnough : 3,//养成属性不足////-
// 	LastAbilityNotEnough : 4,//二级属性不足////-
// 	ItemListNotEnough : 5,//贡献的物品不足////-
// 	FundNotEnough : 6,//游戏币不足////-
// 	LevelWrong : 7,//要提升的等级应该是原来的等级加1////
// 	PartnerIdNotFound : 8,//指定的伙伴不存在//-
// 	BreakLevelNotEnough : 9, //突破(蜕变)等级不足
// }

// let opAwakeError:any = {
// 	Success : 0,
// 	EntryIdNotFound : 1,//找不到对应的ID////-
// 	LevelNotEnough : 2,//等级不够//-
// 	GrowAbilityNotEnough : 3,//养成属性不足////-
// 	ItemListNotEnough : 4,//贡献的物品不足////-
// 	ExpItemListNotEnough : 5,//贡献的经验物品不足////-
// 	FundNotEnough : 6,//游戏币不足(元宝)////-
// 	RateNotHit : 7,   //机率没有命中//-
// 	AwakeLevelWrong : 8, //觉醒等级要是原等级加1
// 	MaxAwakeLevel : 9, //已经是最大觉醒等级
// 	PartnerIdNotFound : 10,//找不到对应的伙伴
// }

// let opNaturalStoneUpgrade:any = {
// 	Success : 0,
	
// 	EntryIdNotFound : 1,//找不到对应的ID////-
// 	LevelNotEnough : 2,//等级不够//-
// 	ItemListNotEnough : 3,//贡献的物品不足////-
// 	FundNotEnough : 4,//游戏币不足////-
// 	StoneNotThere : 5,//找不到要升级的石头//
// 	PartnerIdNotFound : 6,//打不到指定的伙伴名主角//
// 	RateNotHit : 7, //机率没有命中
// }

// let opNaturalOff:any = {
// 	Success : 0, 
// 	EntryIdNotFound : 1,//找不到对应的ID////-
// 	GoldNotEnough : 2,//晶石不足//-
// 	PartnerIdNotFound : 3,//打不到指定的伙伴名主角//
// 	PacketIsFull : 4,//背包已经满了//
// }

// let opNaturalImplant:any = {
// 	Success : 0, 
// 	PartnerIdNotFound : 1,//打不到指定的伙伴名主角//
// 	EntryIdNotFound : 2,//找不到对应的ID////-
// 	LevelNotEnough : 3,//等级不够//-
// 	FundNotEnough : 4,//游戏币不足////-	
// 	ExceptVocationType : 5,//这个职业类型不支持//-
// 	ExceptVocation : 6,//这个职业不支持//-
// 	ExceptPartner : 7,//这个伙伴不支持//-
// 	RateNotHit : 8,//机率没有命中////	
// 	CellNumNotEnough : 9,//没有足够的格子//-
// 	//GoldNotEnough : 10,//晶石不足//-
// 	SameStoneSubType : 11, //相同类型天赋石
// }

// let opSkillCode:any = {
// 	Success : 0,
// 	NotSuccess : 1,
// 	SkillLevelMax : 2,
// 	LevelNotEnough : 3,
// 	PlrLevelNotEnough : 4,
// 	ItemListNotEnought : 5,
// 	GoldNotEnought : 6,
// 	FundNotEnough : 7,
// 	NotEntryInfo : 8,
// }

// let opGrowSelectError:any = {
// 	Success : 0,
// 	NotEnoughChannel : 1,//不能同时进行更多的互动了//
// 	OldGrowNotFinish : 2,//指定的互动还没有完成//
// 	NotEnoughLive : 3,//活力不足//-
// 	CanNotGetSelectId : 4,//在指定区间得不到ID列表//
// 	OwnerIdNotFound : 5,//找不到指定的互动对象//
// }
// let opGrowEventError:any = {
// 	Success : 0,
// 	EventNotExist : 1,//找不到指定的事件////
// 	EventEntryNotExist : 2,//找不到指定的事件的配置////
// 	ItemNotEnough : 3,//指定的物品不足//
// 	WaittingCombat : 4,//战斗中，请稍等//
// 	CombatLost : 5,//战斗失败//-
// }

// let opGrowSoonFinishError:any = {
// 	Success : 0,
// 	OwnerNotFound : 1,//没有找到指定的伙伴或角色//
// 	MustPayMoreGold : 2,//服务器计算到需要更多的钱//
// 	GoldNotEnough : 3,//钱不够
// }

// let opBuyLiveError:any = {
// 	Success : 0,
// 	MaxBuyNumNotEnough : 1,//已经达到最大购买次数，等明天或提升vip等级//
// 	LiveValueEnough : 2,//活力已满
// 	GoldNotEnough : 3,//钱不够
// }


// let growOptions:any = {
// 	growAreaNum : 5,//属性值分5个区域
// 	feelingAreaNum : 3,//心情值分3个区域
// 	growTypeNum : 5,//5个成长属性
// 	selectTypeNum : 5,//每个属性5个互动
// 	maxFeelingEventId : 9999, //心情值最大时给的事件
//  	areaAddValue : [0,1,2,3,3],//在不同的属性区间额外加多少属性.
// 	maxFeeling : 15,//最大心情值//
// 	maxLive : 100, //最大活力值//
// 	addLivePeriod : 1800,//多长时间增一次活力值 半小时
// 	addLivePerTime : 2,//每次增加多少活力值
// 	maxGrowValue : 150, //最大属性值//-
// 	playerOwnerId : 7656,// 角色养成对应的 entryId
// 	RightSelectAdd : 2,// 正确的选择加多少属性
// 	NotRightSelectAdd : 1, // 不正确的选择加多少属性
// 	PerfectSelectAdd : 7, // 完美选择加多少属性 正确的选择基础上有一定的机率变成完美选择//
// 	RightToPerfectRate : 16.6, //正确自动转成完美选择的机率
// 	SelectPayLive : 20, //每次互动扣20点活力值
// 	RightFeelingAdd : 1, //正确选择加多少点心情值//
// 	NotRightFeelingAdd : -1, //不正确选择加多少点心情值//
// 	SelectActionDelay : 900,//一个互动需要消耗多长时间//
// 	SelectActionSplitNum : 8,//一个互动分成多少个时间段//
// 	SelectActionEachPeriod : 112,//SelectActionDelay/SelectActionSplitNum一个时间段是多少秒//
// 	AddEventRate : 10,//10, //生成事情的概率//
// 	MaxFeelingAddEventRate : 20, //当心情值最高是 能加大多少生成事件的概率//
// 	maxEventNum : 10,//最多保存10个事件//
// 	eventCombat : 1,//战斗事件//
// 	eventSubmit : 2,//提交物品//
// 	eventTalk : 3,//谈话//-
// 	eventPrize : 4,//特殊事件给奖励//
// 	eventCombatSelect : 1,//战斗事件中，选择战斗的索引
// 	eventSubmitSelect : 1,//提交物品事件中，选择提交的索引
// 	//buyLivePay : 100, //花多少钻石可以买一次活力值
// 	buyLiveNum : 30, //买一次活力值可以回复多少点活力值
// 	initBuyLiveNum : 15,//非VIP可以买多少活力
// 	//buyNumInVipArea : 3, //	1~3加一次，4~6加二次…….	
// 	//initGrowNum : 1, //非vip最多可以同时进行多少个交互
// 	//growNumInVipArea : 4,//	1~4加一次，5~8加二次…….	
// }


// //神兽
// let opGodAnimal:any = { 
// 	MAXLEVEL : 10,
// 	freeExperCampId : 1120,
// 	freeExperTime : 10*60,
// 	freeExperLevel : 1,
// }

// //
// let playerSysIndex:any = {
// 	Begin : 1,
// 	Role : 1,
// 	Pet : 2,
// 	Xunlv : 3,
// 	TempCell : 4,
// 	End : 4,
// }

// let playerSysName:any = {
// 	"Role",// : 1,
// 	"Pet",// : 2,
// 	"Xunlv",// : 3,
// 	"TempCell",// : 4,
// }

let playerSysName:any = {
	"Role" : 1,
	"Pet" : 2,
	"Xunlv" : 3,
	"TempCell" : 4,
}

let godEquip:any = {
	propertyCount : 3,		//初始一定3条属性
	typeRefineNum : 3,
	propertyRefineNum : 3,
}

//洗练类型
let godEquipRefineType:any = {
	typeRefine : 1,				//种类
	propertyRefine : 2,		//属性
}


let opShiTu:any = {
	tudiNum : 2,
	chushiTime : 7,
	
	//类型
	tudi : 1,
	shifu : 2,
	
	//传功状态
	default : 0,
	sfChuan : 1,		//师傅传了
	tdAccept	:	2,	//徒弟接受了
	
	//出师类型
	normal : 100,
	perfect : 101,
	
	//策划提供的系数
	tudiTaskExp : 0.015,
	tudiAcceptExp : 0.2,
	shifuChuanExp : 0.05,
	prefabChushi : 0.6,
}