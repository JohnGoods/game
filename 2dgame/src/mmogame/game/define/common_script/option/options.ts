//opFirstRecharge = 
//{
// ItemList:any : {{300033,1}, {30002,2}, {30003, 2}},
//	PetEntryId = 18014,
//	Funds = 50000,
//}

//	战斗转化属性
//finalAbilityOptions = 
//{
//	physicalAttack   : 1,     // 物理攻击力
//	spellAttack      : 2,     // 法术攻击力	
//	speed            : 3,     // 速度
//	physicalDefence  : 4,     // 物理免伤率
//	physicalHitrate  : 5,     // 物理命中率
//	physicalDodge    : 6,     // 物理闪避率
//	physicalCritical : 7,     // 物理暴击率
//	physicalResist   : 8,     // 物抗率
//	spellDefence     : 9,     // 法术免伤率
//	spellHitrate     : 10,    // 法术命中率
//	spellDodge       : 11,    // 法术闪避率
//	spellCritical    : 12,    // 法术暴击率
//	spellResist      : 13,    // 法抗率
//	statusHitrate    : 14,    // 状态命中率
//	statusResist     : 15,    // 状态抗率
//}
ImportType(objectField)
let abilityPowerRatio = {
	[objectField.UNIT_FIELD_MAX_HP]: 0.5,
	[objectField.UNIT_FIELD_SPEED]: 100,
	[objectField.UNIT_FIELD_ATTACK]: 4,
	[objectField.UNIT_FIELD_DEFENCE]: 4,
	[objectField.UNIT_FIELD_HITRATE]: 5,
	[objectField.UNIT_FIELD_DODGE]: 5,
	[objectField.UNIT_FIELD_CRITICAL]: 5,
	[objectField.UNIT_FIELD_CRITICAL_DEC]: 5,
	[objectField.UNIT_FIELD_DEF_THR]: 10,
	[objectField.UNIT_FIELD_DEF_THR_DEC]: 10,
}

// 战斗系数加成
//fightReviseOptions =
//{
//	maxHPRate : 3001, //基础血量百分比加成
//}

//五行属性( 1雷 2火 3水 4土）
//elementOptions = 
//{
//	NONE    : 0,
//	THUNDER : 1,
//	FIRE    : 2,
//	WATER   : 3,
//	EARTH   : 4,
//}

//新手默认数值
let ConfigPlayerDefault: any = {
	NEWBIE_LEVEL: 1,          // 等级
	NEWBIE_POWER: 0,          // 初始体力点
	NEWBIE_TASK: 1005,       // 默认任务
	NEWBIE_HERO: 18000,      // 默认宠物entryId
	//NEWBIE_BODY                 : 18000,      // 默认外观
	//NEWBIE_AMBASSADOR_LEVEL     : 0,          // 默认邀请大使等级
	NEWBIE_FUNDS: 5000,       // 金币
	//NEWBIE_MAGIC_STONE_ENERGY   : 50,         // 魔导石初始能量
	//NEWBIE_EQUIP_EVENT_CAMPAGIN : 1010,       // 新手装备事件触发关卡Id
	ENHANCE_COUNT: 4,          // 新手装备强化事件次数
	NEWBIE_FAIRY: 50000,      // 默认精灵
	NEWBIE_WING: 30000,      // 默认翅膀
	FRESH_TASK: 9 * 24 * 3600,  // 新手目标任务持续时间
	NEWBIE_VOCATION: 40000,      // 默认职业
	NEWBIE_TASTE_VOCATION: 40003,      // 默认体验职业
	NEWBIEPRIZE: {},         // 新手物品奖励
	PET_EVENT: [18000, 16, 2], // 伙伴新手养成事件
	PET_SELECT_ID: 1,          // 伙伴互动选择
	PET_SELECT_TYPE: 2,          // 伙伴互动选择类型
	PLR_SELECT_ID: 1,          // 主角互动选择
	PLR_SELECT_TYPE: 2,          // 主角互动选择类型
	NEWBIE_KISS_NUM: 1,          // 新手女神之吻
	NEW_SUMMON_STONE_CAMPAGIN: 1036,       // 新手召唤石通关关卡
	NEW_SUMMON_STONE_SIGNE: 2,          // 新手召唤石签到天数
	NEW_SUMMON_ENTRYID: 18002,      // 新手召唤石对应的伙伴EntryId
	NEW_ADVANCE_ENTRYID: 18008,      // 新手召唤石需要进阶的伙伴
	NEW_PLR_FEEL_VALUE: 14,         // 新手主角心情值
}

//新手默认数据
let noviciateDefalultValue: any = {
	PETID: 18000,  //默认宠物Id
	INTIMATE_EVENTID: 85,     //默认亲密度事件
	CONVERSATION_FIRST: 2006,   //第一次默认对话
	CONVERSATION_SECOND: 2005,   //第二次默认对话
	INTIMATE_VALUE: 5,      //默认亲密度
	INVITEMATE_ANIMATION: 2006,   //默认动画
	COMMON_CONVERSATION: 2000,   //公共对话
}

// 全局数据key
let globalDataKey: any = {
	ServerFirstKill: 1,   // 服务器首杀
	LifeNpc: 2,   // 生命周期npc
	Campaign: 3,   // 关卡通过最低战力
	ServerJJCRank: 4,   // 服务器竞技场排行
	ServerSkyTower: 5,   // 服务器天空之塔排行
	UniqueId: 6,   // 服务器UId
	WuDouApply: 7,   // 武斗报名列表
	WuDouRank: 8,   // 武斗排名列表
	WuDouViedo: 9,   // 武斗录像列表
	ServerFactionMap: 10,  // 服务器军团副本首通排行
	CampaignVideo: 11,  // 关卡录像
	ZhenXing: 12,  // 阵营战记录
	StartTime: 15,  // 开服时间
	FactionWarApply: 16,  // 军团战报名列表
	FactionWarScore: 17,  // 军团战积分表
	FactionWarMatch: 18,  // 军团战匹配表
	FactionWarRank: 19,  // 军团战排名
	Union: 20,  // 联盟
	WuDouTeamApply: 21,  // 武斗组队报名列表
	WuDouTeamRank: 22,  // 武斗组队排名列表
	WuDouTeamViedo: 23,  // 武斗组队录像列表
	FestivalData: 24,  // 节日数据
	ServerDeadField: 25,  // 死亡领域
	MergeTime: 26,  // 合服时间
	PetAdvanceExRecord: 27,  // 异界召集攻略
	ServerDeadFieldPersonal: 28,  // 终极境地
	WordBossTime: 29,  // 世界boss存活时间
	WordBossLevel: 30,  // 世界boss上次的等级
	unionPVPMatch: 31,  // 联盟名单
	unionPVPVideo: 32,  // 联盟战pvp录像
	unionPVPFinal: 33,  // 联盟战胜利名单
	auctionRecord: 34,  // 拍卖行交易记录
	charmNpcData: 35,  // 魅力使者npc数据
	CharmResetTime: 36,  // 魅力值清空時間
	ItemTrade: 50,  // 交易系统
	TowerDayRank: 70,  // 天空之塔日排行
	TowerWeekRank: 80,  // 天空之塔周排行
	BlackMarket: 90,  // 黑市商城
	FactionWarEndTime: 91,  // 军团战结束时间
	UnionMatrix: 92,  // 联盟灵阵守卫记录
	UnionMatrixOpenList: 93,  // 联盟灵阵守卫开放记录
	UnionMatrixRankList: 94,  // 联盟灵阵守卫全服排行记录
	MonsterSiegeLevel: 95,  // 魔物攻城怪物血量加成等级
	RideAdvanceExRecord: 97,  // 坐骑邀请攻略
	AllStartAutoFeedPlayer: 98,  // 开启自动喂养的玩家
	LastAllServerMessage: 99,  // 跨服广播的最新的一条消息
	firstFacForPoint: 100, //全服积分第一公会
}

// 配置key
//configDataKey =
//{
//	rechargeBeginTime : 1,    //充值活动开始时间
//	rechargeEndTime   :	2,    //充值活动结束时间
//	activeEndTime     :	100,  //新服活动结束时间
//}

// 星期*
//opWeek =
//{
//	Sunday    : 1,
//	Monday    : 2,
//	Tuesday   : 3,
//	Wednesday : 4,
//	Thursday  : 5,
//	Friday    : 6,
//	Saturday  : 7,
//}

let opTime: any = {
	Hour: 3600,
	Day: 86400,
	Week: 604800,
	Month: 2592000,
}

// 货币单位
let opMoneyUnit = 
{
	funds    : 1,			// 游戏币
	bindgold : 2,			//绑定元宝。
	gold : 3,				// 元宝
}

//server unit to gmt unit
//server 1元宝 2竞技积分 3灵石 6头目积分 7礼券
//gmt 1元宝；2战绩；3竞技积分；4灵石；5礼券
//opSwitchUnit = 
//{
//	[1] : 1,
//	[2] : 3,
//	[3] : 4,
//	[6] : 2,
//	[7] : 5 
//}

//consumeType = 
//{
//	IB_ITEM      : 1,
//	IB_SHOW      : 2,
//	FACTION_GOLD : 3,
//	MALL         : 4,
//	LOGOUT_EXP   : 5, //高效离线补偿消耗的元宝
//}

//opRegionNotice =
//{
//	NOTICE_FCM : 1,  // 防沉迷信息
//}

//opHealthDefine =
//{
//	HEALTH_GOOD : 0,		// 健康
//	HEALTH_TIRE : 1,		// 疲劳,收益减半
//	HEALTH_BAD  : 2,		// 瘫痪,无收益
//}
//
//opHealthTime =
//{
//	HEALTH_TIRE : 10800,	// 疲劳时间(s)
//	HEALTH_BAD	: 18000,	// 瘫痪时间(s)
//}


//获得金钱类型
//opMoneyType = 
//{
//	OTHER    : 1, //其他
//	TASK     : 2, //任务
//	FUBEN    : 3, //副本
//	ACTIVITY : 4, //活动
//	RECYCLE  : 5, //装备回收
//}

//////////////////- 擂台配置 ////////////////////////////
//opLeiTai = 
//{
//	mapId : 50006,
//	reliveX : 497,
//	reliveY : 275,
//	updateInterval : 1, // 队伍列表刷新间隔
// rect:any : {
//		{x:505, y:263},
//		{x:539, y:247},
//		{x:563, y:260},
//		{x:530, y:278},
//	},
//}

//日常活动索引
//opDailyIndex = 
//{
//	One 			: 1,		//日常一: 女王刀锋
//	Two				: 2,		//日常二: 女王叛乱
//	Three			: 3,		//日常三: 试炼之路
//	Four			: 4,		//日常四:	骑士学院
//	Five			: 5,		//日常五:	竞技场
//	Six				: 6,		//日常六:	天空之塔
//}

//竞技场配置
let ChampionConfig: any = {
	OpenLevel: 0,   //开放等级
	clearRmb: 10,  //清空等待时间
	increaseRmb: 500,   //增加次数消耗
	totalTimes: 10,  //挑战次数上限
	fightInterval: 300, //挑战间隔(s)
	prizeTimes: 10,  //奖励次数
	calcPrizeTime: 23,  //结算时间     
	buyTimeStep : 3,//每3次购买升一次价钱
	//第1,2,3次购买要500,4,5,6需要800,7,8,9需要1300....
	rmbList : [500, 800, 1300, 2000,2000,2000,2000,2000,2000,2000,2000]//购买需要花多少钱
}

//日常配置

//战斗队列
let BattleQueueType = {
	Campaign: 1,   //关卡战斗(普通战斗)
	//Champion         : 2,   //竞技场进攻阵型
	ChampionDefence: 3,   //竞技场防守阵型(防守阵型)
	//DailyOne         : 4,   //迷雾
	//DailyThree       : 5,   //死亡领域
	//DailyFour        : 6,   //终极境地
	DailySix: 7,   //海底监狱(血量记录阵型)
	//BigBoss        	 : 8,   //世界boss
	//RelicMine        : 9,   //遗迹探索进攻阵型
	//RelicMineDefence : 10,  //遗迹探索防守阵型
	//BattleQueueHelp1 : 11,  //在小团队中帮忙成名里角色ＩＤ比较大的那个阵容
	//BattleQueueHelp2 : 12,  //在小团队中帮忙成名里角色ＩＤ比较小的那个阵容
	//RobberMgr        : 13,  //圣地挂机,其他活动不要共用这个
	//FactionWar       : 14,	//军团战
	//ZhenXing         : 15,	//众神之战
}

//不能上阵雇佣的队列
let opCannotEmployBattleQueueType: any = {
	//[BattleQueueType.Champion]            : 1,
	[BattleQueueType.Campaign]: 2,
	[BattleQueueType.ChampionDefence]: 3,
	//[BattleQueueType.BigBoss]             : 4,
	//[BattleQueueType.DailyOne]            : 5,
	//[BattleQueueType.DailyThree]          : 6,
	//[BattleQueueType.RelicMine]           : 7,
	//[BattleQueueType.RelicMineDefence]    : 8,
	//[BattleQueueType.BattleQueueHelp1]    : 9,
	//[BattleQueueType.BattleQueueHelp2]    : 10,
	//[BattleQueueType.RobberMgr]           : 11,
	//[BattleQueueType.FactionWar]          : 12,
}

//不可以上阵超过三个的队列
let opCannotMultFighterBattleQueueType: any = {
	//[BattleQueueType.ZhenXing]            : 1,
	//[BattleQueueType.Champion]            : 1,//竞技场进攻阵型
	//[BattleQueueType.ChampionDefence]     : 2,//竞技场防守阵型
	//[BattleQueueType.FactionWar]          : 3,//军团战
	//[BattleQueueType.RelicMine]           : 4,//矿洞
	//[BattleQueueType.RelicMineDefence]    : 5,//矿洞
}

//日常起始楼层
//opTowerBeginFloor = 
//{
//	[opDailyIndex.One]   : 1,
//	[opDailyIndex.Two]   : 1,
//	[opDailyIndex.Three] : 1,
//	[opDailyIndex.Four]  : 1,
//	[opDailyIndex.Six]   : 1,
//}

//////////////////////-邮件配置//////////////////////-
let opEmailStatus: any = {
	UnReadNoGet: 5, //未读未领取
	ReadedNoGet: 6, //已读未领取
	ReadedGot: 7, //已读已领取
}

//邮件标题
let opEmailTitle: any = {
	NORMAL: 1,  //普通邮件
	SYSTEM_NOTICE: 2,  //系统通知
	SYSTEM_GIFT: 3,  //系统赠送
	PACKET_FULL: 4,  //背包已满物品领取
}

//邮件类型
let opEmailType: any = {
	NORMAL: 1,  //普通类型
	SYSTEM_NOTICE: 2,  //系统通知类型 //用于通知
	SYSTEM_ANNEX: 3,  //系统附件类型 //发放奖励
	SYSTEM_EVENT: 4,  //系统事件类型 //处理离线事务，上线的时候处理
	SYSTEM_ANNEX_EX: 5,  //系统附加类型 //发放奖励，不能一键领取
}

let opSendEmailType: any = {
	GAME: 1,   //游戏内
	PHP: 2,   //后台
}
////////////////////////////////////////////////////-

//公共地图
//let publicMaps:any = {defaultValue.DEFAULT_MAP2}


//向组内发送事件通知
//opGroupEvent = 
//{
//	FACTION_MAP_CREATE     : 1,	 // 帮派副本开启
//	FACTION_MAP_BOSS       : 2,	 // 帮派boss死亡(副本关闭)
//	FACTION_PVE_OPEN       : 3,  // 帮派pve开启(开启副本)
//	FACTION_PVE_CLOSE      : 4,  // 帮派pve关闭(23:59关闭)
//	FACTION_PVE_BOSS_OPEN  : 5,  // 帮派pveboss开启(boss开启)
//	FACTION_PVE_BOSS_CLOSE : 6,  // 帮派pveboss关闭(boss关闭)
//}

//购买金币的配置
let opBuyFundsLevelConfig: any = [
	[1, 9, 11314],
	[10, 19, 14483],
	[20, 29, 18539],
	[30, 39, 23732],
	[40, 49, 30379],
	[50, 59, 38888],
	[60, 99, 49780],
]

//查询角色信息
let opSelectPlayerInfo: any = {
	PlayerInfo: 1,      //人物信息
	BattleTypeInfo: 2,      //队型信息
	FairyInfo: 3,      //精灵信息
	WingInfo: 4,      //翅膀信息
	RideInfo: 5,      //坐骑信息
}

//查询雇佣列表
let opSelectEmployList: any = {
	systemList: 1,      //系统列表
	playerList: 2,      //自己列表
	factionList: 3,      //工会列表
}

//替补配置
let opReserveLineUpConfig: any = {
	defaultLine: [0, 0], //默认阵容
	count: 2,     //替补数量
	level: 60,    //开启等级
}

//战阵配置
let opWarFormationConfig: any = {
	openLevel: 70,     //开放等级
	minLevel: 0,      //初始等级(0级未激活)
	maxLevel: 5,      //最高等级
}

//参于战斗的人数
let opVipFighterNum: any = {
	[0]: 9,
	[1]: 9,
	[2]: 9,
	[3]: 9,//v4以下五个
	[4]: 9,
	[5]: 9,
	[6]: 9,//v6以上9 个
	[7]: 9,
	[8]: 9,
	[9]: 9,
	[10]: 9,
	[11]: 9,
	[12]: 9,
	[13]: 9,
	[14]: 9,
	[15]: 9,
	[16]: 9,
}

//情报系统不记录的角色
let opDoNotRecordActor: any = {
	[40004]: 1,
	[40000]: 1,
	[18008]: 1,
}

//帮会
let opClubTaskReset: any = {
	CostMoney: 480,
	CostMoneyUnit: 2,
}