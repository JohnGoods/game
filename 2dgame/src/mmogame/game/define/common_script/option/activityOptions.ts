ImportType(opItemSuperType)
////////////////////////////////////////////////////////////////////////////////////////////
//西游活动配置

// 默认数值
let defaultValue:any = {
	DEFAULT_MAP      : 1,       // 默认地图(无用地图)
	DEFAULT_MAP2     : 50001,   // 默认地图
	DEFAULT_PET_BAG  : 999,     // 默认宠物背包格子数
	EQUIP_SIZE       : 200,     // 默认背包格子数
	MAX_ADD_EQUIP_SIZE : 700,	//最大扩展装备格子数
	//MONTH_ADD_EQUIP_SIZE : 100,	//月卡可扩展装备格子数	
	PACKET_MAX_SIZE      : 600,     //背包最大格子数
	MAX_ALISMAN_SIZE     :  50,
	PACKET_UPSTEP_GOLD      : 50,     // 50元宝
	PACKET_UPSTEP_SIZE      : 5,     // 扩展5格
	MAX_SHENHUN_SIZE : 100,      //最大神魂格子数
	PACKET_PAGE_SIZE :          // 默认背包分页格子数
	{
		[opItemSuperType.ITEM_SUPER_TYPE_EQUIP]       : 170,        // 装备背包
		//[opItemSuperType.ITEM_SUPER_TYPE_MATERIAL]    : 50,         // 素材背包
		//[opItemSuperType.ITEM_SUPER_TYPE_SOUL]        : 20,         // 英魂背包
		[opItemSuperType.ITEM_SUPER_TYPE_GOODS]       : 200,        // 道具背包
		[opItemSuperType.ITEM_SUPER_TYPE_MAGIC_STONE] : 100,        // 天赋石背包
		[opItemSuperType.ITEM_SUPER_TYPE_ACTIVE_ITEM] : 30,         // 技能书背包
		[opItemSuperType.ITEM_SUPER_TYPE_EQUIP_STONE] : 100,        // 装备宝石背包
		//[opItemSuperType.ITEM_SUPER_TYPE_FAIRY_EQUIP] : 50,         // 精灵装备背包
		//[opItemSuperType.ITEM_SUPER_TYPE_RIDE_EQUIP]  : 50,         // 坐骑装备背包
		[opItemSuperType.ITEM_SUPER_TYPE_SHENHUN]	  : 100,         //神魂

	},
	MAX_POWER                  : 5000,    //默认体力上限
	WAREHOUSE_SIZE             : 40,      //默认仓库格子数
	WAREHOUSE_MAX              : 200,     //仓库最大格子数
	WAREHOUSE_PET_SIZE         : 5,       //默认宠物仓库格子数
	WAREHOUSE_PET_MAX          : 10,      //默认宠物仓库格子数
	                           
	WORLD_MESSAGE_COUNT        : 30,      //世界频道默认发言次数
	DEFAULT_EXPANSION          : 10000,   //属性数值默认扩大倍数（由于小于0.001，客户端接收到的为0）
	DEFAULT_FACTION_COUNT      : 300,     //默认宗族总数
	DEFAULT_FACTION_APPLY      : 500,     //默认宗族申请列表总数
	DEFALUT_VIP_LEVEL          : 0,       //默认vip等级
	DEFALUT_VIP_MAX_LEVEL      : 20,      //默认vip最大等级
	DEFALUT_EMAIL_MAX          : 100,     //邮箱最大空间
	NEW_PET_RECRUIT            : 18007,   //快速招募新手宠物
	DEFALUT_CAMPAIGN_WIP       : 0,       //默认关卡扫荡次数
	SACRIFICE_MAX_LEVEL        : 10,      //祭祀最大等级
	DAILY_POWER                : 80,      //每日领取体力
	CHAT_RECORD_COUNT          : 20,      //聊天记录条数
	MAX_TOTALL_BIND_CURRENCY   : 120000,  //绑定元宝最大额度
	FORCE_EXPRESS_VALUE        : 500,     //战力表现转换值
	CHAMPION_CHALLENGE_COUNT   : 5,       //竞技场挑战次数
	CLUB_FUBEN_HELP_COUNT      : 5,       //帮会副本协助次数
	CLUB_FUBEN_FIGHT_COUNT     : 5,       //帮会副本收益次数
	CLUB_JOIN_FORCE_MIN        : 100000,  //公会加入可设置最低战力
	CLUB_JOIN_FORCE_MAX        : 99990000,//公会加入可设置最高战力
	CAMPAIGN_NEED_HELP         : 5,       //关卡求助次数
	CAMPAIGN_HELP              : 10,      //关卡协助次数
	PET_UNION_MATERIAL         : 6,       //宠物合成材料限制
}

//活动类型
let OrdinaryActivityType:any = {
	 EVERYDAY  : 1,  //每日
	 LIMITTIME : 2,  //限时
}

//普通活动索引
let OrdinaryActivityIndex:any = {
	NULL                : 0,     //无活动
	//RUQIN               : 1,     //帮会入侵
	HUSONG              : 2,     //护送
	DATI                : 3,     //答题
	ZHENGBA             : 4,     //跨服争霸
	MENGZHU             : 5,     //武林盟主
	ZhongKuiDemon       : 6,     //钟馗伏魔
	PersonBoss          : 7,     //个人boss
	WorldPlayerBoss     : 8,     //全民boss
	WildBoss            : 9,     //野外boss
	LifeAndDeathBoss    : 10,    //生死劫
	MaterialBoss        : 11,    //材料副本
	DragonBoss          : 12,    //龙王宝藏
	SmallThunderTemple  : 13,    //小雷音寺
	HeavenTrial         : 14,    //天庭试炼
	AutoFightMonster    : 15,    //自动遇怪
	Champion            : 16,    //竞技场
	FactInstZones       : 17,    //工会副本
	Campaign            : 18,    //关卡
	//CrossTeam           : 19,    //跨服组队
	CapturePet          : 20,    //捕捉宠物
	XiyouLilian         : 21,    //西游历练
	FactionMonster	    : 22,    //帮派妖怪
	ServerTeam		    : 23,    //跨服组队
	WolrdOne            : 24,    //天下第一
	ColorEgg            : 25,    //彩蛋
	GlobalMine          : 26,    //跨服争霸(矿战)
	WuLin               : 27,	 //武林大会
	Stronghold          : 28,    //据点
}

//单人活动对应的单人空间
let opActivityIndexToSingleSpace:any = {
	//[OrdinaryActivityIndex.SKYTOWER] :      "DAILY",       //地宫
	//[OrdinaryActivityIndex.CAMPAIGN] :      "CAMPAIGN",    //关卡
	//[OrdinaryActivityIndex.RELIC_MINE] :    "MINE",        //航海
	//[OrdinaryActivityIndex.CHAMPION] :      "CHAMPION",    //竞技场
	//[OrdinaryActivityIndex.ZHENYING] :      "ZHENYING",    //众神之战
}

//冲值相关活动索引
let PayActivityIndex:any = {
	//TEST : 0,//空的，测试用
	FIRST_PAY : 1,//首次冲值
	CREATE_ROLE_SEVEN_DAY : 2,//创角七天。
	SINGLE_PAY_PRIZE : 3,//单笔冲值返回物品列表 只要到达额度，就可以领取，可以领取多次
	SINGLE_CONSUME_PRIZE : 4,//单笔消费返回物品列表 只要到达额度，就可以领取，可以领取多次
	LIMIT_SINGLE_DAY_PAY_PRIZE : 5,//限时每日冲值 单笔冲值返回物品列表 但每一天只能领取一次.
	LIMIT_SINGLE_DAY_CONSUME_PRIZE : 6,//限时每日消费 单笔消费返回物品列表 但每一天只能领取一次.
	DAY_ACCUM_PAY_PRIZE : 7,//每日累计冲值 累计冲值返回物品列表 每天清零 每一天冲值到最高额度的都可以领一次.
	DAY_ACCUM_CONSUME_PRIZE : 8,//每日累计消费 累计消费返回物品列表 每天清零 每一天消费到最高额度的都可以领一次.
	ACCUM_PAY_PRIZE : 9,//累计冲值 整个活动期间累计
	ACCUM_CONSUME_PRIZE : 10,//累计消费 整个活动期间累计
	QUDAO_PAY_RETURN : 11,//渠道冲值反馈钻石
	ALL_PAY_RETURN : 12,//所有玩家冲值反馈钻石
	MULTI_PAY_RETURN : 13,//冲值多倍反馈
	GAME_PAY_RANK_PRIZE : 14,//冲值排行
	GAME_CONSUME_RANK_PRIZE : 15,//消费排行
	SERVERS_PAY_RANK_PRIZE : 16,//跨服冲值排行
	SERVERS_CONSUME_RANK_PRIZE : 17,//跨服消费排行
	SHOP_DISCOUNT : 18,//商店打折//
	PET_LOTTERY : 19, //神将抽奖(幸运转盘)
	PAY_SIGNED_ON : 20, //豪华签到
	PET_LOTTERY_A : 21, //神将抽奖二号(寻宝)
	//AccuBuyRecharge : 22, //累充购买
	LEVEL_FUNDS : 23,  //成长基金购买
	INVEST_PLAN : 24,	//投资计划购买
	DAILY_LOGIN : 25,	//每日登陆奖励
	STAGE_UP		: 26,	//直升一阶
	DAILY_EXPENSIVE_GIFT : 27, //每日豪礼
	EVERY_STAGE_A : 28,	//狂欢每日进阶A
	EVERY_STAGE_B : 29,	//狂欢每日进阶B
	NEW_SERVER_STAGE_LEVEL_UP : 30, //新服进阶活动				***
	NEW_SERVER_ALL_STAGE_UP : 31, //开服全民进阶活动				***
	NEW_SERVER_ALL_BUY : 32, //开服全名团购						***
	NEW_SERVER_SHOP_DISCOUNT : 33, //开服折扣商店					***
	SHOP_DISCOUNT_A : 34, //折扣商店 A
	SHOP_DISCOUNT_B : 35, //折扣商店	B
	MIX_ACCU_RECHARGE : 36, //每日累充
	NEW_SERVER_MIXACCU_RECHARGE : 37, //开服累充				***
	NEW_SERVER_ALL_LEVEL_UP : 38, //全民升级					***
	NEW_SERVER_INST_ZONES : 39,  //升级副本					***
	NEW_SERVER_STAGE_UP_RANK : 40,  //进阶排行活动					***
	NEW_SERVER_MISSION : 41,  //龙宫章节					***
	TEN_YUAN_GIFT : 42,  //十元礼包
	EVERY_MIXACCU_RECHARGE : 43,  //每日首充
	GOD_PET_INCOME	: 44, 	//神宠来袭
	GOD_PET_TURN	: 45,	//神宠转盘
	PRECIOUS_MAP    : 46, //宝藏地图
	SHOP_MIRACULOUS     : 47, //神秘商店
	Recharge_have_prize : 48, //充值有礼
	SIX_LOOK_PRECIOUS   : 49, //六界寻宝
	festival_BACK_MONEY : 50, //节日返利
	PET_WASH	        : 51,  //宠物洗练
	Fallen_Good_Gift_Recharge : 52,  //天降好礼的充值
	Fallen_Good_Gift_SHOP     : 53,  //天降好礼商店
	NORMAL_INST_ZONES 		  : 54,  //日常副本,猪八戒

	///客户端自定义
	C_LIEHUN                  : 201, //钟馗猎魂
}

//冲值活动的名字
// let PayActivityName:any = {
// 	[PayActivityIndex.FIRST_PAY] : "FirstPay",//首次冲值
// 	[PayActivityIndex.CREATE_ROLE_SEVEN_DAY] : "SevenDay",//创角七天
// 	[PayActivityIndex.SINGLE_PAY_PRIZE] : "SinglePay",//单笔冲值返回物品列表
// 	[PayActivityIndex.SINGLE_CONSUME_PRIZE] : "SingleConsume",//单笔消费返回物品列表
// 	[PayActivityIndex.LIMIT_SINGLE_DAY_PAY_PRIZE] : "LimitDayPay",//限时每日冲值
// 	[PayActivityIndex.LIMIT_SINGLE_DAY_CONSUME_PRIZE] : "LimitDayConsume",//限时每日消费
// 	[PayActivityIndex.DAY_ACCUM_PAY_PRIZE] : "DayAccumPay",//每日累计冲值
// 	[PayActivityIndex.DAY_ACCUM_CONSUME_PRIZE] : "DayAccumConsume",//每日累计消费
// 	[PayActivityIndex.ACCUM_PAY_PRIZE] : "AccumPay",//累计冲值
// 	[PayActivityIndex.ACCUM_CONSUME_PRIZE] : "AccumConsume",//累计消费
// 	[PayActivityIndex.QUDAO_PAY_RETURN] : "QudaoPayReturn",//渠道冲值反馈
// 	[PayActivityIndex.ALL_PAY_RETURN] : "AllPayReturn",//所有玩家冲值反馈
// 	[PayActivityIndex.MULTI_PAY_RETURN] : "MultiPay",//冲值多倍反馈
// 	[PayActivityIndex.GAME_PAY_RANK_PRIZE] : "GamePayRank",//冲值排行
// 	[PayActivityIndex.GAME_CONSUME_RANK_PRIZE] : "GameConsumeRank",//消费排行
// 	[PayActivityIndex.SERVERS_PAY_RANK_PRIZE] : "ServersPayRank",//跨服冲值排行
// 	[PayActivityIndex.SERVERS_CONSUME_RANK_PRIZE] : "ServersConsumeRank",//跨服消费排行
// 	[PayActivityIndex.SHOP_DISCOUNT] : "ShopDiscount",//商店打折
// 	[PayActivityIndex.PET_LOTTERY] : "PetLottery",//神将抽奖
// 	[PayActivityIndex.PAY_SIGNED_ON] : "PaySignedOn",//豪华签到
// 	[PayActivityIndex.PET_LOTTERY_A] : "PetLotteryA",//神将抽奖二号
// 	//[PayActivityIndex.AccuBuyRecharge] : "AccuBuyRecharge",//累充购买
// 	[PayActivityIndex.LEVEL_FUNDS] : "LEVEL_FUNDS",	//等级基金
// 	[PayActivityIndex.INVEST_PLAN] : "INVEST_PLAN", //投资计划
// 	[PayActivityIndex.DAILY_LOGIN] : "DAILY_LOGIN",	//每日登陆奖励
// 	[PayActivityIndex.STAGE_UP] : "STAGE_UP",	//直升一阶
// }

//处理类型
// let PayActivityHandleType:any = {
// 	Recharge : 1,//处理冲值
// 	Consume : 2,//处理消费
// }

// //发送奖励方式
// let PayActivitySendType:any = {
// 	SendRequest : 1,//等待发送请求才给
// 	SendAtOnce : 2,//立即发送
// 	SendAtFinish : 3,//活动结束才通过邮件发送
// }

// //奖励类型
// let PayActivityPrizeType:any = {
// 	ItemList : 1,//物品列表
// 	Diamond : 2,//钻石
// 	Funds : 3, //游戏币
// 	RatioDiamod : 4,//按比例反还钻石 
// }

// //生存类型
// let PayActivityLiveType:any = {
// 	Timing : 1,//定时开始或结束
// 	Always : 2,//常驻
// }

// //请求奖励类型 
// let PayActivityRequestType:any = {
// 	One : 1,//每个档位只能领取一次。0代表没有达成 1代表达到了没有领取 2代表领取了
// 	Much : 2,//每个档位可以领取多次。0代表没有达成 1代表达到了还有一次没有领取 2代表还有2次没有领取
// }

// //冲值活动模板类//
// let PayActivityClassType:any = {
// 	AccumulativePrize : 1,//每日累计冲值 每日累计消费 整体累计冲值 整体累计消费
// 	DaySinglePrize : 2,//单笔冲值 单笔消费
// 	DaySoonPrize : 3,//冲值奖励 消费奖励
// 	LimitDaySinglePrize : 4,//限时单笔冲值 限时单笔消费
// 	LimitDaySinglePrizeBorn : 5,//创角七日单笔冲值  创角七日单笔消费
// 	PayRankPrize : 6,//冲值排行或消费排行
// }
//
////活动分类
//PayActivityGroupType = {
//	PayThenReqPrize : 1, //冲值或消费达到一定的条件，可以激活奖励，需要手工领取+//	PayRankFinishPrize : 2,//冲值或消费排行，活动结束后邮件发送奖励//
//	PayFeedback : 3,//冲值或消费后马上反馈奖励 //
//}

//冲值活动删掉类型//
// let PayActivityRemoveType:any = {
// 	AtOnce : 1, //一结束马上删掉
// 	Minu10 : 2, //结束10分钟后删掉
// 	Minu30 : 3, //结束30分钟后删掉
// 	Hour1 : 4, //结束1小时后删掉
// 	Hour2 : 5, //结束2小时后删掉
// 	Hour4 : 6, //结束4小时后删掉
// 	Hour8 : 7, //结束8小时后删掉
// 	Hour12 : 8, //结束12小时后删掉
// 	Day1 : 9, //结束1天后删掉
// 	Day2 : 10, //结束2天后删掉
// 	Day3 : 11, //结束3天后删掉
// 	Day4 : 12, //结束4天后删掉
// }

// let PayActivityRemoveTime:any = [
// 	0, //一结束马上删掉
// 	600, //结束10分钟后删掉
// 	1800 , //结束30分钟后删掉
// 	3600 , //结束1小时后删掉
// 	7200 , //结束2小时后删掉
// 	14400 , //结束4小时后删掉
// 	28800 , //结束8小时后删掉
// 	43200 , //结束12小时后删掉
// 	86400 , //结束1天后删掉
// 	172800 , //结束2天后删掉
// 	259200 , //结束3天后删掉
// 	345600 , //结束4天后删掉
// ]
//冲值活动类型定义
// let PayActivityTypeDefine:any = {
// 	[PayActivityIndex.CREATE_ROLE_SEVEN_DAY] : 
// 	{
// 		['handle'] : PayActivityHandleType.Recharge,//Recharge : 1,//处理冲值; 
// 		['send'] : PayActivitySendType.SendRequest,//SendRequest : 1,//等待发送请求才给;
// 		['prize'] : PayActivityPrizeType.ItemList,//ItemList : 1,//物品列表; 
// 		['live'] : PayActivityLiveType.Always,//Always : 2,//常驻
// 		['request'] : PayActivityRequestType.One,//One : 1,每个档位只能领取一次。0代表没有达成 1代表达到了没有领取 2代表领取了
// 	},//创角七天
	
// 	[PayActivityIndex.SINGLE_PAY_PRIZE] : 
// 	{
// 		['handle'] : PayActivityHandleType.Recharge,//Recharge : 1,//处理冲值; 
// 		['send'] : PayActivitySendType.SendRequest,//SendRequest : 1,//等待发送请求才给;
// 		['prize'] : PayActivityPrizeType.ItemList,//ItemList : 1,//物品列表; 
// 		['live'] : PayActivityLiveType.Timing,//Timing : 1,//定时开始或结束;
// 		['request'] : PayActivityRequestType.Much,//Much : 2,//每个档位可以领取多次。0代表没有达成 1代表达到了还有一次没有领取 2代表还有2次没有领取
// 	},//单笔冲值返回物品列表 只要到达额度，就可以领取，可以领取多次
	
// 	[PayActivityIndex.SINGLE_CONSUME_PRIZE] : 
// 	{
// 		['handle'] : PayActivityHandleType.Consume,//Consume : 2,//处理消费;
// 		['send'] : PayActivitySendType.SendRequest,//SendRequest : 1,//等待发送请求才给;
// 		['prize'] : PayActivityPrizeType.ItemList,//ItemList : 1,//物品列表; 
// 		['live'] : PayActivityLiveType.Timing,//Timing : 1,//定时开始或结束;
// 		['request'] : PayActivityRequestType.Much,//Much : 2,//每个档位可以领取多次。0代表没有达成 1代表达到了还有一次没有领取 2代表还有2次没有领取
// 	},//单笔消费返回物品列表 只要到达额度，就可以领取，可以领取多次
	
// 	[PayActivityIndex.LIMIT_SINGLE_DAY_PAY_PRIZE] : 
// 	{
// 		['handle'] : PayActivityHandleType.Recharge,//Recharge : 1,//处理冲值; 
// 		['send'] : PayActivitySendType.SendRequest,//SendRequest : 1,//等待发送请求才给;
// 		['prize'] : PayActivityPrizeType.ItemList,//ItemList : 1,//物品列表; 
// 		['live'] : PayActivityLiveType.Timing,//Timing : 1,//定时开始或结束;
// 		['request'] : PayActivityRequestType.One,//One : 1,每个档位只能领取一次。0代表没有达成 1代表达到了没有领取 2代表领取了 
// 	},//限时每日冲值 单笔冲值返回物品列表 但每一天只能领取一次.
	
// 	[PayActivityIndex.LIMIT_SINGLE_DAY_CONSUME_PRIZE] : 
// 	{
// 		['handle'] : PayActivityHandleType.Consume,//Consume : 2,//处理消费;
// 		['send'] : PayActivitySendType.SendRequest,//SendRequest : 1,//等待发送请求才给;
// 		['prize'] : PayActivityPrizeType.ItemList,//ItemList : 1,//物品列表; 
// 		['live'] : PayActivityLiveType.Timing,//Timing : 1,//定时开始或结束;
// 		['request'] : PayActivityRequestType.One,//One : 1,每个档位只能领取一次。0代表没有达成 1代表达到了没有领取 2代表领取了 
// 	},//限时每日消费 单笔消费返回物品列表 但每一天只能领取一次.
	
// 	[PayActivityIndex.DAY_ACCUM_PAY_PRIZE] : 
// 	{
// 		['handle'] : PayActivityHandleType.Recharge,//Recharge : 1,//处理冲值; 
// 		['send'] : PayActivitySendType.SendRequest,//SendRequest : 1,//等待发送请求才给;
// 		['prize'] : PayActivityPrizeType.ItemList,//ItemList : 1,//物品列表; 
// 		['live'] : PayActivityLiveType.Timing,//Timing : 1,//定时开始或结束;
// 		['request'] : PayActivityRequestType.One,//One : 1,每个档位只能领取一次。0代表没有达成 1代表达到了没有领取 2代表领取了 
// 	},//每日累计冲值 累计冲值返回物品列表 每天清零 每一天冲值到最高额度的都可以领一次.
	
// 	[PayActivityIndex.DAY_ACCUM_CONSUME_PRIZE] : 
// 	{
// 		['handle'] : PayActivityHandleType.Consume,//Consume : 2,//处理消费;
// 		['send'] : PayActivitySendType.SendRequest,//SendRequest : 1,//等待发送请求才给;
// 		['prize'] : PayActivityPrizeType.ItemList,//ItemList : 1,//物品列表; 
// 		['live'] : PayActivityLiveType.Timing,//Timing : 1,//定时开始或结束;
// 		['request'] : PayActivityRequestType.One,//One : 1,每个档位只能领取一次。0代表没有达成 1代表达到了没有领取 2代表领取了 
// 	},//每日累计消费 累计消费返回物品列表 每天清零 每一天消费到最高额度的都可以领一次.
	
// 	[PayActivityIndex.ACCUM_PAY_PRIZE] : 
// 	{
// 		['handle'] : PayActivityHandleType.Recharge,//Recharge : 1,//处理冲值; 
// 		['send'] : PayActivitySendType.SendRequest,//SendRequest : 1,//等待发送请求才给;
// 		['prize'] : PayActivityPrizeType.ItemList,//ItemList : 1,//物品列表; 
// 		['live'] : PayActivityLiveType.Timing,//Timing : 1,//定时开始或结束;
// 		['request'] : PayActivityRequestType.One,//One : 1,每个档位只能领取一次。0代表没有达成 1代表达到了没有领取 2代表领取了 
// 	},//累计冲值 整个活动期间累计
	
// 	[PayActivityIndex.ACCUM_CONSUME_PRIZE] : 
// 	{
// 		['handle'] : PayActivityHandleType.Consume,//Consume : 2,//处理消费;
// 		['send'] : PayActivitySendType.SendRequest,//SendRequest : 1,//等待发送请求才给;
// 		['prize'] : PayActivityPrizeType.ItemList,//ItemList : 1,//物品列表; 
// 		['live'] : PayActivityLiveType.Timing,//Timing : 1,//定时开始或结束;
// 		['request'] : PayActivityRequestType.One,//One : 1,每个档位只能领取一次。0代表没有达成 1代表达到了没有领取 2代表领取了 
// 	},//累计消费 整个活动期间累计
	
// 	[PayActivityIndex.QUDAO_PAY_RETURN] : 
// 	{
// 		['handle'] : PayActivityHandleType.Recharge,//Recharge : 1,//处理冲值; 
// 		['send'] : PayActivitySendType.SendAtOnce,////SendAtOnce : 2,//立即发送; 
// 		['prize'] : PayActivityPrizeType.Diamond,//Diamond : 2,//钻石;  
// 		['live'] : PayActivityLiveType.Always,//Always : 2,//常驻
// 		['request'] : PayActivityRequestType.Much,//Much : 2,//每个档位可以领取多次。0代表没有达成 1代表达到了还有一次没有领取 2代表还有2次没有领取
// 	},//渠道冲值反馈
	
// 	[PayActivityIndex.ALL_PAY_RETURN] : 
// 	{
// 		['handle'] : PayActivityHandleType.Recharge,//Recharge : 1,//处理冲值; 
// 		['send'] : PayActivitySendType.SendAtOnce,//SendAtOnce : 2,//立即发送; 
// 		['prize'] : PayActivityPrizeType.Diamond,//Diamond : 2,//钻石; 
// 		['live'] : PayActivityLiveType.Always,//Always : 2,//常驻
// 		['request'] : PayActivityRequestType.Much,//Much : 2,//每个档位可以领取多次。0代表没有达成 1代表达到了还有一次没有领取 2代表还有2次没有领取
// 	},//所有玩家冲值反馈
	
// 	[PayActivityIndex.MULTI_PAY_RETURN] : 
// 	{
// 		['handle'] : PayActivityHandleType.Recharge,//Recharge : 1,//处理冲值; 
// 		['send'] : PayActivitySendType.SendAtOnce,//SendAtOnce : 2,//立即发送; 
// 		['prize'] : PayActivityPrizeType.RatioDiamod,//Diamond : 2,//钻石; 
// 		['live'] : PayActivityLiveType.Timing,//Timing : 1,//定时开始或结束;
// 		['request'] : PayActivityRequestType.Much,//Much : 2,//每个档位可以领取多次。0代表没有达成 1代表达到了还有一次没有领取 2代表还有2次没有领取
// 	},//多倍冲值活动	
	
// 	[PayActivityIndex.GAME_PAY_RANK_PRIZE] : 
// 	{
// 		['handle'] : PayActivityHandleType.Recharge,//Recharge : 1,//处理冲值; 
// 		['send'] : PayActivitySendType.SendAtFinish,//SendAtFinish : 3,//活动结束才通过邮件发送 
// 		['prize'] : PayActivityPrizeType.ItemList,//ItemList : 1,//物品列表; 
// 		['live'] : PayActivityLiveType.Timing,//Timing : 1,//定时开始或结束;
// 		['request'] : PayActivityRequestType.One,//One : 1,每个档位只能领取一次
// 		['final'] : PayActivityRemoveType.Day1,//Day1 : 9, //结束1天后删掉
// 	},//冲值排行活动	
	
// 	[PayActivityIndex.GAME_CONSUME_RANK_PRIZE] : 
// 	{
// 		['handle'] : PayActivityHandleType.Consume,//Consume : 2,//处理消费;
// 		['send'] : PayActivitySendType.SendAtFinish,//SendAtFinish : 3,//活动结束才通过邮件发送
// 		['prize'] : PayActivityPrizeType.ItemList,//ItemList : 1,//物品列表;  
// 		['live'] : PayActivityLiveType.Timing,//Timing : 1,//定时开始或结束;
// 		['request'] : PayActivityRequestType.One,//One : 1,每个档位只能领取一次
// 		['final'] : PayActivityRemoveType.Day1,//Day1 : 9, //结束1天后删掉
// 	},//消费排行活动	
	
// 	[PayActivityIndex.SERVERS_PAY_RANK_PRIZE] : 
// 	{
// 		['handle'] : PayActivityHandleType.Recharge,//Recharge : 1,//处理冲值; 
// 		['send'] : PayActivitySendType.SendAtFinish,//SendAtFinish : 3,//活动结束才通过邮件发送 
// 		['prize'] : PayActivityPrizeType.ItemList,//ItemList : 1,//物品列表; 
// 		['live'] : PayActivityLiveType.Timing,//Timing : 1,//定时开始或结束;
// 		['request'] : PayActivityRequestType.One,//One : 1,每个档位只能领取一次
// 		['final'] : PayActivityRemoveType.Day1,//Day1 : 9, //结束1天后删掉
// 	},//跨服冲值排行	
	
// 	[PayActivityIndex.SERVERS_CONSUME_RANK_PRIZE] : 
// 	{
// 		['handle'] : PayActivityHandleType.Consume,//Consume : 2,//处理消费;
// 		['send'] : PayActivitySendType.SendAtFinish,//SendAtFinish : 3,//活动结束才通过邮件发送
// 		['prize'] : PayActivityPrizeType.ItemList,//ItemList : 1,//物品列表;  
// 		['live'] : PayActivityLiveType.Timing,//Timing : 1,//定时开始或结束;
// 		['request'] : PayActivityRequestType.One,//One : 1,每个档位只能领取一次
// 		['final'] : PayActivityRemoveType.Day1,//Day1 : 9, //结束1天后删掉
// 	},//跨服消费排行	
		
// 	//_G[v.windowName].newObj()
// }


// let PayActivityNameToId:any = {}
// for(let index in PayActivityName){
// 			let name = PayActivityName[index]
	
// 	PayActivityNameToId[name] = index
// }






//boss活动索引
let opActivityIndexToName:any = {
	[OrdinaryActivityIndex.ZhongKuiDemon]       :   "ZhongKui", //钟馗伏魔
	[OrdinaryActivityIndex.PersonBoss]          :   "PersonBoss", //个人boss
	[OrdinaryActivityIndex.WorldPlayerBoss]     :   "WorldBoss", //全民boss
	[OrdinaryActivityIndex.WildBoss]            :   "WildBoss", //野外boss
	[OrdinaryActivityIndex.LifeAndDeathBoss]    :   "LifeDeath", //生死劫
	[OrdinaryActivityIndex.MaterialBoss]        :   "Material", //材料副本
	[OrdinaryActivityIndex.DragonBoss]          :   "Dragon", //龙王宝藏
	[OrdinaryActivityIndex.SmallThunderTemple]  :   "SmallThunder", //小雷音寺
	[OrdinaryActivityIndex.HeavenTrial]         :   "Heaven", //天庭试炼
	[OrdinaryActivityIndex.AutoFightMonster]    :   "Auto", //自动遇怪
	[OrdinaryActivityIndex.HUSONG]							:   "escort",		//西游护送
}

let opBossActivityConfig:any = {
	[OrdinaryActivityIndex.ZhongKuiDemon] : 
	{
		sweepLevel : 4,
		killCount : 10,
		 stagePrize : [["item", 30001,10],["item", 30002,10], ["rmb", 10], ["bindRmb", 100]],
	},
	//[OrdinaryActivityIndex.DragonBoss] = 
	//{
	// starPrize:any : {[6]:{{30001,2},{30002,2}},[12]={{30001,2},{30002,2}},[18]={{30001,2},{30002,2}}}, //累积星奖励
	//	sweepVipLevel = 4,       //一键挖宝需要vip等级
	// starConfig:any = {{1,4,3},{5,7,2},{8,10,1}}
	//},
	[OrdinaryActivityIndex.WildBoss] : 
	{
		existStatus : 1, //存在
		runStatus : 2, //逃跑
		killStatus : 3, //击杀
		runTime : 25*60, //逃跑时间
		waitTimeToGold : 3, //每3秒1元宝
	},

	[OrdinaryActivityIndex.ServerTeam] :
	{
		defaultRemainCount : 30,  //默认有奖励次数
		quickOverNum : 10,  //快速完成环数
	}
}

let opDragonBossBaseConfig:any = {
	sweepVipLevel : 4,
	starConfig : [[1,4,3],[5,7,2],[8,10,1]]
}
//龙王宝藏配置
let opDragonBossIndexConfig:any = {
	getPrize     : 0x1,   //领取奖励
	oneStar      : 0x2,   //一星
	twoStar      : 0x4,   //二星
	threeStar    : 0x8,   //三星
}
//龙王宝藏配置
let opDragonBossChapterConfig:any = {
	sixStar      : 0x1,   //06星
	twelve       : 0x2,   //12星
	eighteen     : 0x4,   //18星
}

//西游护送
let opEscort:any = {
	scortMaxCount : 3,     //最大护送次数
	robberMaxCount : 5,    //最大抢夺次数
	lastTime : 15*60,      //持续时间
	normalRand : 50,       //普通随机
	specialRand : 450,     //一键随机
	maxMacheIndex : 5,     //橙色马车
	orangeCard : 60071,   //橙色镖车令

	quickOverNum : 300 ,  //快速完成所需
}

//限时活动（投资，基金...）
let opLimitTimeActive:any = {
	levelFunds : 20000,			//购买成长基金
	investPlan : 8888,			//购买投资计划
	investPlanDay	: 9,			//投资第九天活动结束，改发邮件
	stageUpNeedMoney : 10000, //直升一阶最低需要100
	stageUpSpecialDay : 8,  //直升一阶特殊奖励天数
	stageUpNormalDay : 10,  //直升一阶普通奖励轮询天数
}


//限时活动（投资，基金...）
let dailyPrizeType:any = {
	accumulateLogin : 100,		//累计登陆
	dailyLogin : 101,			//每日登陆
	vipLogin	: 102,			//VIP4登陆
	rechangeLogin : 103, 		//充值任意金额
}

let monthCardConfig = 
{
	time                  : 30*24*3600, //每次激活持续时间
	canGetRmbGold         : 1000,       //每天可领取的元宝
	autoFightExpRatio     : 0.3,        //挂机经验加成
	autoFightFundsRatio   : 0.3,        //挂机现银加成
	packetAdd             : 100,        //背包容量
	getRmbGold            : 3000,       //直接获得3000
}

let optionShenHun = {
	costMoney : 500, //猎魂消耗元宝

	costHunBi : 5,   //消耗魂币

	shuchu   : 11, //输出
	kongzhi  : 12, //控制
	fuzhu    : 13, //辅助
	fangyu   : 14, //防御
	qita     : 15, //其他

	maxLevel : 15, //最大强化等级
}












////////////////////////////////////////////////////////////////////////////////
//废弃部分



//混沌时空
// let configRobber: any = {
// 	mapId: 50014,
// 	bestPlayerCount: 10,   //最佳人数
// 	maxPlayerCount: 200,   //场景人数
// 	transferX: 22,
// 	transferY: 37,
// 	plrLevel: 1,           //需要玩家等级
// 	power: 1,              //消耗体力
// 	//ticketNpcEntry : 40003, //挑战令牌npcId
// 	//bossBoxEntry : 22002,   //boss宝箱
// 	bossBoxCount: 10,      //boss宝箱数量
// 	bossBoxLife: 10 * 60,    //boss宝箱时间
// 	bossBoxLib: 222,       //boss宝箱库
// 	copyMapEffect: [[1, 15, 100], [16, 30, 95], [31, 60, 80], [61, 100, 60]], //副本效率
// 	shapeshiftingId: 40000049,	//变身道具的ID
// 	powerCalcInterval: 10, //体力计算时间间隔
// 	regionId: 50014,       //场景区
// 	layer: 1,              //场景层
// 	minFightTime: 6,       //最小结算时间
// 	maxFightTime: 15,      //最大结算时间
// 	reviseTime: 2,         //挂机纠正时间
// 	eliteKillCount: 3,     //精英怪击杀上限
// 	hangStatus: 1,         //挂机状态
// 	leisure: 0,            //休闲状态
// 	protectLevel: 10,      //pk保护等级
// 	prizeRatio: {
// 		[opStatusType.STATUS_TYPE_BAOTU]: 0.5,  //暴徒掉落率 : 总掉落率*0.5
// 		[opStatusType.STATUS_TYPE_MOTOU]: 0.25, //魔头掉落率 : 总掉落率*0.25
// 	},
// 	//
// 	refreshPowder: 10,     //刷新资源点
// 	lotteryPowder: 30,     //抽奖资源点
// 	lotteryDiscount: 1,    //连抽打折
// 	refreshFreeCount: 0,   //免费刷新次数
// 	maxOfflineHangTime: 8 * 60 * 60, //最大离线挂机时间
// 	monthCardRatio: 0.2,   //月卡收益修正
// 	offlineBaseRatio: 0.5,   //离线基础效率
// 	minRemainPower: 100,   //最少保留体力
// }

// //圣地返回码
// let opRobberErrorConfig:any = {
// 	PUNISH_TIME : -1,
// 	SUCCESS : 0,
// 	NO_IN_ACTIVE : 1,
// 	ACTIVITY_NOT_ACTIVE : 2,
// 	NO_ROOM : 3,
// 	ROOM_COUNT_LIMIT : 4,
// 	PLAYER_LEVEL_LIMIT : 5,
// 	IN_VIRTUAL_COMBAT : 6,
// }

// //祷告
// let opAttendanceConfig:any = {
// 	noAttendance			: 1,				//未签到
// 	noReward					: 2,				//签到未领奖
// 	rewarded					: 3,				//签到已领奖
// }

// //每日抽奖
// let opFateLottery:any = {
// 	//命运占卜
// 	LotteryCount : 3,
// 	LotteryConsumeGold : 50,
// 	//装备抽奖
// 	equipLotteryCount : 5,				//免费次数
// 	timeLotteryGold	 : 10,				//冷却时间额外消耗
// 	equipLotteryGold : 30,				//付费单抽晶石
// 	LegendEquipCount : 10,				//累计N次必得传奇的次数
// 	equipLotteryTime : 600,				//免费次数的冷却时间
// 	equipDisCount 	: 0.9,				//折扣
// }

// //装备抽奖类型
// let opLotteryEquipType:any = {
// 	Once			: 1,	//单次抽
// 	Times			: 2,	//连续抽
// }

// //通过等级范围获取二级索引
// //{minLevel, maxLevel, index}
// //opLotteryEquipLevelToIndex = 
// //{
// //	[1] : {1,  10, 1},
// //	[2] = {11, 20, 2},
// //	[3] = {21, 30, 3},
// //	[4] = {31, 40, 4},
// //	[5] = {41, 50, 5},
// //	[6] = {51, 61, 6},
// //}

// //世界boss
// let ConfigWorldBoss:any = {
// 	//beginHour : 12,//多少点开始
// 	//beginMinute : 0,//多少分开始
// 	//endHour : 12,//多少点结束
// 	//endMinute : 30,//多少分结束
// 	delayTime : 20*60, // 多长时间结束
// 	mapId : 50033,  //副本地图Id
// 	transferX : 19, //进入点X
// 	transferY : 44, //进入点Y
// 	playerCount : 30,  //副本人数限制
// 	levelLimit : 1,   //等级限制
// 	boxInterval : 600, //刷宝箱间隔
// 	boxCount : 20,     //宝箱个数
// 	boxNpcEntry : 22001, //宝箱npcId
// 	maxPickCount : 5, //最大拾取数量
	
// 	bossNpcId : 22000, //boss npcId
// 	bossPosX : 70, //刷新位置
// 	bossPosY : 25, //刷新位置
// 	bossEntryId : 81084042, //boss entryId
// 	bossFightPos : 15, //boss站15号位
	
// 	//bossAttack : 99999999, //boss攻击
// 	//spellAttack : 99999999, //boss攻击
// 	//bossDefence : 4000, //护甲
// 	//inspireRmb : 5,  //鼓舞元宝
// 	deadwaitRmb : 5, //快速复活元宝
// 	//bossHp 		: 2000000000,//boss血量
// 	//bossMaxHP   : 100000000000,
// 	bossLiveMinTime : 10*60, //boss不扣血的时间段
// 	addLevelInterval : 15 * 60,//15分钟内打死等级加1
// 	addBossHpPerLevel : 0.25,//每升一级增加多少血量(百分比)
// 	maxLevel : 50,//最大等级
// 	//timeInterval :    //魔龙死亡时间对应血量增长百分比
// 	//{
// 	//	{0*60,  15*60, 0.2},
// 	//},
// 	maxPickBoxCount : 3, //最多捡宝箱数量
// 	maxFightCount : 40, //最多打次数
// }

// //世界boss鼓舞[level]=钻石
// let opWorldBossInspireRmb:any = {
// 	[1]        : 20,
// 	[2]        : 40,
// 	[3]        : 60,
// 	[4]        : 80,
// 	[5]        : 100,
// }

// let ConfigMonsterSiege:any = {
// 	mapId : 50074,  //副本地图Id
// 	transferX : 17, //进入点X
// 	transferY : 33, //进入点Y
// 	playerCount : 30,  //副本人数限制
// 	levelLimit : 1,   //等级限制
// 	buffNpcInterval : 300, //刷宝箱间隔
// 	buffNpcCount : 10,     //状态宝箱个数
// 	buffNpcEntry : 12001,  //状态宝箱npcId
	
// 	bossPosX : 181, //刷新位置
// 	bossPosY : 33, //刷新位置
// 	bossFightPos : 2, //boss站2号位
// 	inspireRmb : 10,  //鼓舞元宝
// 	inspaireTimes : 10, //鼓舞等级
// 	deadwaitRmb : 10,  //快速复活元宝
// 	maxRound : 5,     //轮数
// 	roundTime : 360,  //每一轮时间
// 	bossMoveInterval : 60, //boss移动时间间隔
// 	bossCreateInterval : 30, //boss产生时间间隔
// 	bossKillRewardCount : 5, //杀死boss后额外奖励
// }

// let opMonsterInspaireRmb:any = {
// 	[1]        : 20,
// 	[2]        : 40,
// 	[3]        : 60,
// 	[4]        : 80,
// 	[5]        : 80,
// 	[6]        : 80,
// 	[7]        : 80,
// 	[8]        : 80,
// 	[9]        : 80,
// 	[10]       : 80,
// }

// //天空之塔复活晶石
// let opSkyTowerReviveGold:any = {
// 	[1] : 10,
// 	[2] : 20,
// 	[3] : 30,
// }

// let opSkyTowerConfig:any = {
// 	maxReviveCount : 50,         //最大复活次数
// 	maxReviveGold  : 50,         //最大复活晶石消耗
// 	maxFloor : 100,              //最高层
// }

// //答题配置
// //答题配置
// let ConfigWorldQuestion: any = {
// 	mapId: 50035,           //地图Id
// 	levelLimit: 0,          //等级限制
// 	playerCount: 50,        //人数上限
// 	npcId: 50000,           //npcId
// 	npcPos: { x: 20, y: 20 },   //npc位置
// 	enterPos: { x: 18, y: 24 }, //进入位置
// 	questionCount: 30,      //题目数量
// 	questionInterval: 23,   //时间
// 	followCount: 2,         //技能1数量
// 	doubleCount: 2,         //技能2数量
// }

// //////////////////////////////-
// //遗迹探索
// let opRelicExploreConfig:any = {
// 	MaxMinesCount                   : 270,   //矿洞数量
// 	RegionCount                     : 45,    //大区数量
// 	FightCount                      : 3,     //挑战次数
// 	robCount                        : 3,     //掠夺次数 
// 	prizeRobCount                   : 3,     //有奖掠夺次数
// 	GiftsLastTime                   : 900,   //惊喜收获时间
// 	GiftsGenerateMin                : 7200,  //惊喜产生最小时间
// 	GiftsGenerateMax                : 18000, //惊喜产生最大时间
// 	MaxGiftsCount                   : 5,     //惊喜数量
// 	BuyRobRmb                       : 30,    //购买掠夺次数晶石
// }
// //矿洞子类型
// let opRelicMineType:any = {
// 	Small           : 1,        //小矿
// 	Middle          : 2,        //中矿
// 	Big             : 3,        //大矿
// }


// //矿洞结算方式
// let opRelicMineClearType:any = {
// 	Evicted						: 1,		//击败赶出
// 	Leave							:	2,		//主动退出
// 	Auto							: 3,		//自动退出
// }

// //矿洞产出类型
// let opRelicMineProduceType:any = {
// 	//非防守
// 	Funds						: 1,				//金币
// 	PetSoul					: 2,				//伙伴经验
// 	//防守
// 	DefFunds				: 4,				//防守型金币
// 	DefPetSoul			: 5,				//防守伙伴经验
// }

// //矿洞是否可以保护(1可以0不可以)
// let opRelicMineTypeProtect:any = {
// 	[opRelicMineType.Small]				: 1,			//小矿
// 	[opRelicMineType.Middle]			:	0,			//中矿
// 	[opRelicMineType.Big]					: 0,			//大矿
// }

// //产出系数配置
// //opRelicMineProduceRatio = 
// //{
// //	timeRatioConfig				:								//时间段
// //	{
// //		[1]		: 0.134,
// //		[2]		: 0.268,
// //		[3]		: 0.402,
// //		[4]		: 0.536,
// //		[5]		: 0.670,
// //		[6]		: 0.804,
// //		[7]		: 0.804,
// //		[8]		: 0.804,
// //		[9]		: 0.804,
// //		[10]		: 0.804,
// //		[6]		: 0.804,
// //		[6]		: 0.804,
// //	}, 							
// //	decayTimeRatioConfig  	= 								//随时间衰减攻击力
// //	{
// //		[1]		: 0,
// //		[2]		: 0,
// //		[3]		: 0.05,
// //		[4]		: 0.10,
// //		[5]		: 0.20,
// //		[6]		: 0.30,
// //	},
// //}

// //opRelicMineProduceItemType = 
// //{
// //	[1] : {30001, 30002, 30003, 30004},
// //}

// //矿洞列表类型
// //opRelicMineListPT = 
// //{
// //	Funds         : 1, //金币
// //	PetSoul       : 2, //伙伴经验
// //}

// //////////////////////////////////////-
// //快速招募
// let opQuickRecruitConfig:any = {
// 	RecruitHoopFreeCount      : 3,	 //基础免费刷新次数
// 	RecruitBateFreeCount      : 1,	 //基础免费抽奖次数
// 	WipeCount                 : 10,	 //10连抽
// 	WipeNeedRmb               : 450, //10连抽晶石
// 	SingleNeedRmb             : 50,  //单次抽奖需要晶石
// 	RefreshRmb                : 50,  //刷新晶石
// 	WipeCountEx               : 120, //120连抽
// 	WipeNeedRmbEx             : 4800,//120连抽晶石
// 	Soul                      : 0,   //获取碎魂
// 	LotteryCount              : 1,   //获取抽奖次数
// }

// //快速招募类型
// let opQuickRecruitPrizeType:any = {
// 	Item        : 0,    //物品
// 	Pet         : 1,    //伙伴
// 	Soul        : 2,    //碎魂
// }

// //全服/组内 事件通知
// //用于组内红点提示
// //改变活动阶段状态
// //全服特殊事件 如:结婚 主城非忙碌玩家表演结婚动画
// //注意:全服活动开启关闭通知用 Activity.broadActivityStatus()
// let ConfigServerEvent:any = {
// 	HOME_PAGE_FLOWER          : 31, //送花
// 	FACTION_MAP_CREATE        : 32, //军团开启副本
// 	FACTION_MAP_BOSS          : 33, //军团副本杀死boss(副本关闭)
// 	FACTION_PVE_OPEN          : 34, //军团pve开启
// 	FACTION_PVE_CLOSE         : 35, //军团pve关闭
// 	FACTION_PVE_BOSS_OPEN     : 36, //军团pveboss开启
// 	FACTION_PVE_BOSS_CLOSE    : 37, //军团pveboss关闭
// 	ROBBER_FIRST_KILL         : 38, //圣地首杀
// 	ROBBER_BOSS_REFRESH       : 39, //圣地刷新boss
// 	ROBBER_BOSS_KILLED        : 40, //圣地杀死boss
// 	ROBBER_BOSS_BOX           : 41, //圣地boss宝箱奖励
// }

// //迷之宝箱
// let opRiddleBoxConfig:any = {	
// 	LimitCount     : 3,           //限制拾取数量
// 	RiddleBoxCount : 20,          //每个地图创建的宝箱数量
// 	NpcId          : 22003,       //npcId
// 	MapList :                     //产生宝箱的地图列表
// 	{
// 		[1] : defaultValue.DEFAULT_MAP2,                //巴恩斯大桥
// 	},
// }

// //时空盗贼
// let opSpaceTimeRobber:any = {
// 	LimitCount		 			 : 5,			//限制拾取数量						
// 	SpaceTimeRobberCount : 10,		//每个地图创建的盗贼数量
// 	RobberLife					 : 600,		//盗贼生命周期
// 	NpcId	: 											//npcId
// 	{
// 		[defaultValue.DEFAULT_MAP2] : 70001,
// 		[50002] : 70002,
// 	},
// 	MapList : 											//产生盗贼的地图列表
// 	{
// 		[1] : defaultValue.DEFAULT_MAP2,		 //巴恩斯大桥
// 		[2] : 50002,		 //金字塔
// 	},
// }

// //ConfigWuDou = 
// //{
// // stageTime:any : {
// //	 STAGE_APPLY_START:any : {wday:3, hour:0, minu:0},  //周三0点
// //	 STAGE_APPLY_NOTICE:any = {wday:2, hour:18, minu:0},//周二18点
// //	 STAGE_APPLY_END:any = {wday:2, hour:19, minu:0},   //周二19点
// //	 STAGE_GAME:any = {wday:2, hour:20, minu:0},        //周二20点
// //	},
// //	gameInterval = 120,
// //	limitLevel = 0,
// //	maxPlayerCount = 128,
// //	betPrize = 50,
// //}

// //平台分享奖励saveRecordKey配置
// //opPlatFormRewardCofig =
// //{
// //	firstShare : 
// //	{
// //		firstQQShare 						: 3611,
// //		firstXinLangShare				: 3612,
// //		firstWeiXinShare				: 3613,
// //	},
// //	dailyShare = 
// //	{
// //		dailyQQShare						: 3601,
// //		dailyXinLangShare				: 3602,
// //		dailyWeiXinShare				: 3603,
// //	}
// //}
// //opFirstKeyToDailyKey = 
// //{
// //	[opPlatFormRewardCofig.firstShare.firstQQShare]				: 	opPlatFormRewardCofig.dailyShare.dailyQQShare,
// //	[opPlatFormRewardCofig.firstShare.firstXinLangShare]	: 	opPlatFormRewardCofig.dailyShare.dailyXinLangShare,
// //	[opPlatFormRewardCofig.firstShare.firstWeiXinShare]		: 	opPlatFormRewardCofig.dailyShare.dailyWeiXinShare,
// //}

// let FactionWarStage:any = {
// 	STAGE_ONE : 5,   //16进8
// 	STAGE_TWO : 4,   //8进4
// 	STAGE_THREE : 3, //4进2
// 	STAGE_FOUR : 2,  //2进1
// 	STAGE_APPLY : 1, //报名阶段
// 	STAGE_NONE : 0,  //
// 	STAGE_ONE_PREPARE : 15,   //16进8准备阶段
// 	STAGE_TWO_PREPARE : 14,   //8进4准备阶段
// 	STAGE_THREE_PREPARE : 13, //4进2准备阶段
// 	STAGE_FOUR_PREPARE : 12,  //2进1准备阶段	
// }

// //ConfigFactionWar = {
// //	TEST_MODE : false,
// // enterPosLeft1:any : {x:21, y:36},
// // enterPosRight1:any = {x:58, y:36},
// // enterPosLeft2:any = {x:21, y:36},
// // enterPosRight2:any = {x:58, y:36},
// //	
// // npcPosLeft1:any = {x:18, y:40},
// // npcPosRight1:any = {x:140, y:40},
// // npcPosLeft2:any = {x:18, y:40},
// // npcPosRight2:any = {x:158, y:40},
// //	
// //	ticketNpcEntry = 40001,
// //	bigTicketNpcEntry = 40068,
// //	flagNpcEntry = 11001,//军棋NPC
// //	flagNpcMapId = defaultValue.DEFAULT_MAP2,//军棋NPC所在地图ID
// //	flagNpcMapX = 96,//军棋NPC所在地图X坐标
// //	flagNpcMapY = 122,//军棋NPC所在地图Y坐标
// // stageTime:any = {
// //		//一周两轮 周二淘汰赛，周三冠军赛  周六淘汰赛，周日冠军赛
// //	 STAGE_APPLY_START:any : {{wday:1, hour:0, minu:0},{wday:4, hour:0, minu:0}},  //周一0点  报名开始
// //	 STAGE_APPLY_PREEND:any = {{wday:2, hour:18, minu:0},{wday:6, hour:18, minu:0}},//周六18点 报名结束预告
// //	 STAGE_APPLY_END:any = {{wday:2, hour:19, minu:0},{wday:6, hour:19, minu:0}},   //周六19点 报名结束		//1.(24+19)*60*60=154800s		2.(24+24+19)*60*60=241200s
// //		
// //		//STAGE_ONE_PRESTART = {wday:6, hour:19, minu:0},//周六19点 淘汰赛预告
// //	 STAGE_ONE_START:any = {{wday:2, hour:20, minu:0},{wday:6, hour:20, minu:0}},   //周六20点 淘汰赛
// //		
// //	 STAGE_THREE_PRESTART:any = {{wday:3, hour:19, minu:0},{wday:0, hour:19, minu:0}}, //周日19点 冠军赛预告
// //	 STAGE_THREE_START:any = {{wday:3, hour:20, minu:0}, {wday:0, hour:20, minu:0}}, //周日20点 冠军赛
// //		
// //		//STAGE_GAME_END = {wday:0, hour:22, minu:0}, //周日22点 结束
// //	},
// //	gameInterval = 60,
// //	map16And8Id = 50061,  //淘汰赛地图
// //	map4And2Id = 50061,  //冠军赛地图
// //	
// //	//令牌刷新点
// // grids1:any = {{56,22},{37,42},{15,58},{8,91},{163,78},{211,84},{226,40},{200,21},{174,33},
// //	{146,28},{144,134},{174,150},{210,156},{148,192},{182,202},{206,224},{95,132},{77,159},{10,165},{33,200}},
// // grids2:any = {{56,22},{37,42},{15,58},{8,91},{163,78},{211,84},{226,40},{200,21},{174,33},
// //	{146,28},{144,134},{174,150},{210,156},{148,192},{182,202},{206,224},{95,132},{77,159},{10,165},{33,200}},
// //	
// // applytime:any = {154800,241200},
// //	stageOnePreTime = 3600,	//第一场预告时间 1小时
// //	stageThreePreTime = 3600,//第三场预告时间 1小时
// //	stageOneGameTime = 1500,   //比赛时间 25分钟
// //	stageThreeGameTime = 1200,   //第三轮第四轮比赛时间 26分钟 抢旗20 分钟，精英赛准备加开始6分钟	
// //	stateOnePrepareTime = 600, //准备时间 第一场结束后,相隔多长时间第二场  10分钟
// //	stateThreePrepareTime = 540, //准备时间 第三场结束后,相隔多长时间第四场  9分钟
// //	preSeniorTime = 180, //精英赛准备时间  3分钟
// //	seniorTime = 180, //精英赛比赛时间 3分钟
// //	clearDeathPay = 10, //清掉死亡等待CD需要花费多少晶石
// // SeniorWinScore:any = {1500,1000,850},//精英赛胜利得多少积分
// // SeniorLostScore:any = {0,0,0},
// //	PKWinScore = 15,//正常PK胜利得多少积分
// //	PKLostScore = 5,
// // nextWarTime:any = {158400,244800,24*60*60}, //下一场比赛的时间间隔 1、2：报名-16进8  3：16进8开始到4进2开始 
// //	flagCount = 20,
// // flagScore:any = {30,100},
// // flagRefreshTime:any = {{5,10,15,20,40,45,50,55},{5,10,15,40,45,50}},	//旗子刷新时间
// //	participateScore = 3,         //参与活动每分钟获得的分数
// //	flagCD = 120,
// //}

// //精英队员准备操作返回码
// //opFacWarSeniorReadyCode = {
// //	Success : 0,
// //	NoFaction : 1,//没有加入公会//
// //	StageWrong : 2,//当前时间不可以设置准备了
// //	NoSeniorList : 3,//没有设置参战列表
// //	NotInSeniorList : 4,//不在参战成员列表里
// //	NotInTree : 5,//公会不在比赛队列里
// //}
// //
// ////查询精英对战信息
// //opFacWarQueryReadyCode = {
// //	Success : 0,
// //	NoFaction : 1,//没有加入公会//
// //	StageWrong : 2,//当前时间不是精英赛时间
// //	NotInTree : 3,//公会不在比赛队列里
// //}
// //
// //opFogForestConfig = 
// //{
// //	limitLevel : 50,
// //	maxLayer : 20,
// //}
// //
// ////迷雾森林技能
// //opFogForestSkillIndex = 
// //{
// //	guideDoor : 1,
// //	godBless  : 2,
// //}
// //
// ////死亡领域活动版配置
// //opDeadFieldConfig = 
// //{
// //	limitLevel : 60,
// //	maxlayer : 7,
// //	interval : 5,
// //	needPower : 0,
// //}
// //
// ////亡领域活动版技能数量配置
// //opDeadFieldSkillCountConfig = 
// //{
// //	[1]   : 1,                 //时空暂停
// //	[2]   : 1,                 //神圣之光
// //	[3]   : 1,                 //士气激励
// //	[4]   : 1,                 //勇往直前
// //	[5]   : 1,                 //胆战心惊
// //}
// //
// ////死亡领域个人日常版配置
// //opDeadFieldPersonalConfig = 
// //{
// //	limitLevel : 70,
// //	maxlayer : 7,
// //	needPower : 0,
// //	maxOrder : 3,
// //}
// //
// ////死亡领域个人日常版技能数量配置
// //opDeadFieldPersonalSkillCountConfig = 
// //{
// //	[1]   : 1,                 //天神守护
// //	[2]   : 1,                 //勇往直前
// //	[3]   : 1,                 //邪恶束缚
// //}
// //
// ////密语境地
// //opSecretLandConfig = 
// //{
// //	mapId : 50090,
// //	limitLevel : 50,
// // questionCount:any : {3,3},
// //	transferX = 17,
// //	transferY = 33,
// //	timeInterval = 600,
// //	boxLifeTime = 600,
// //	npcTimeInterval = 3,
// //	refreshInterval = 10,
// //	boxCount = 5,
// //	boxNpcEntryId = 90005,
// //	fightCount = 1,
// //	limitBoxCount = 3,
// //	inspaireTimes = 10,
// //	inspaireRmb = 10,
// //	deadWaitRmb = 10,
// //	deBuff = 0.05,
// //	boxLibId = 55,
// //}
// //
// //opSecretInspaireRmb = 
// //{
// //	[1]        : 5,
// //	[2]        : 10,
// //	[3]        : 15,
// //	[4]        : 20,
// //	[5]        : 20,
// //	[6]        : 20,
// //	[7]        : 20,
// //	[8]        : 20,
// //	[9]        : 20,
// //	[10]       : 20,
// //}

// //报纸配置
// //opNewsPaperConfig = 
// //{
// //	maxCount : 10,                  //刊数
// //}

// // //联盟配置
// // let opUnionConfig:any = {
// // 	TEST_MODE : false,
// // 	STAGE_APPLY_BEGIN : 0,      //报名阶段
// // 	STAGE_APPLY_END : 1,        //报名结束阶段  
// // 	STAGE_ONE : 2,              //初赛阶段 
// // 	STAGE_TWO_PREPARE : 3,      //决赛准备
// // 	STAGE_TWO : 4,              //决赛阶段
// // 	STAGE_TWO_END : 5,          //决赛结束阶段
// // 	guardFairyEntryId : 90012,  //精灵守护
// // 	fairyMonsterEntryId : 30000050,
// // 	guardFairyHP : 2000000,     //精灵守卫血量
// // 	leftFairyRoomIndex : 2,     //左边精灵守护地图索引
// // 	rightFairyRoomIndex : 4,    //右边精灵守护地图索引
// // 	guardUnionEntryId : 90013,  //联盟守护
// // 	unionMonsterEntryId : 30000051,
// // 	guardUnionHP : 2000000000,  //联盟守卫血量
// //  guardFairyPos:any : {24,80},    //精灵守护位置
// //  guardUnionPos:any = {24,85},    //联盟守护位置
// // 	publicMapIndex = 3,         //公共地图索引
// // 	leftSide = 1,               //左边阵营
// // 	rightSide = 2,              //右边阵营
// // 	transferEntryId1 = 90014,   //隐藏传送门(1-5/5-1)
// //  leftTransferPos1:any = {106,49},//隐藏传送门(1-5/5-1)左边位置
// //  rightTransferPos1:any = {45,30},//隐藏传送门(1-5/5-1)右边位置
// // 	transferEntryId2 = 90014,   //隐藏传送门(2-4/4-2)
// //  leftTransferPos2:any = {90,80}, //隐藏传送门(2-4/4-2)左边位置
// //  rightTransferPos2:any = {10,25},//隐藏传送门(2-4/4-2)右边位置
// // 	boxEntryId = 90008,         //宝箱
// // 	guardInterval = 10*60,      //联盟守卫复活时间
// // 	transferInterval = 1*60,    //临时传送门持续时间
// // 	guardFightCount = 90,       //联盟守卫战斗次数
// // 	fairyFightCount = 30,       //精灵守卫战斗次数
// // 	bossFightTime = 20,         //联盟守卫战斗间隔
	
// // 	normalFlagEntryId = 90010,  //普通旗帜
// // 	seniorFlagEntryId = 90011,  //高级旗帜
// // 	normalFlagCount = 15,       //普通旗帜数量
// // 	seniorFlagCount = 5,        //高级旗帜数量
// // 	flagLiveTime = 120,         //战旗转化时间
// // 	seniorFlagScore = 100,      //高级战旗积分  
// // 	normalFlagScore = 20,       //普通战旗积分
// // 	winScore = 5,               //胜利积分
// // 	lostScore = 0,              //失败积分
// // 	factScore = 1,              //查看军团成员积分
// // 	unionScore = 2,             //查看联盟成员积分
// // 	myNodeScore = 1,            //查看我方成员积分
// // 	otherNodeScore = 2,         //查看敌方成员积分
// // 	firstMatch = 1,             //初赛
// // 	secondMatch = 2,            //决赛
// // 	secondWinScore =            //决赛胜利加分
// // 	{
// // 		[1] : 1000,
// // 		[2] : 1300,
// // 		[3] : 2000,
// // 	},
// //  buffList:any = {1,2,3,4,5,6,7}, //随机buff列表
// // }

// //骑士团pve副本配置
// let opCombatTeamPVEConfig:any = {
// 	limitLevel : 40,
// 	maxlayer : 7,
// 	needPower : 0,
// 	maxOrder : 1,
// 	resetTimes : 1,
// 	layerCount : 2,
// }

// //骑士团pve副本配置
// let opCombatTeamPVESkillConfig:any = {
// 	[1]   : 1,                 //天神守护
// 	[2]   : 1,                 //勇往直前
// 	[3]   : 1,                 //邪恶束缚
// }

// let opCombatTeamPVEFightTimeConfig: any = [
// 	[0, 10000, 2],
// 	[10000, 30000, 1],
// 	[30000, 60000, 0.74],
// 	[60000, 80000, 0.5],
// 	[80000, 800000, 0],
// ]

// //回归码距离开服N天
// let opReturnCodeCofig:any = {
// 	limitCount : 30,
// 	intervalTime : 30*24*3600,
// 	limitLevel :  30,
// }

// //节日公共配置
// let opFestiveConfig:any = {
// 	singlesDayFlower : 40345,
// 	encounterGold : 199,
// }

// //红包配置
// let opRedEnvelopeConfig:any = {
// 	factType        : 1,          //军团红包类型
// 	friendType      : 2,          //好友红包类型
// 	overTime        : 12*3600,    //有效期
// 	factLevel       : 5,          //军团等级
// 	dailyCount      : 5,          //每次最多次数
// 	recordCount     : 100,        //最多记录条数
// 	maxSendCount    : 5,          //每天最多发送红包数量
// 	maxCount        : 10,         //最多存在红包数量
// 	sendContribute  : 100,        //发红包需要的活跃值
// 	getContribute   : 50,         //领取红包需要的活跃值
// 	//factLevel       : 5,          //军团等级
// 	plrLevel        : 60,         //角色等级
// 	vipLevel        : 6,          //vip等级
// 	plrMaxCount     : 5,          //个人领取上限
// 	getPlrLevel     : 40,         //领取红包等级
// 	plrSendCount    : 1,          //发送红包次数
// }

// //红包金额
// let opRedEnvelopeRmbConfig:any = {
// 	firstLevel     : 500,          //
// 	secondLevel    : 2000,          //
// }

// //红包金额对应领取次数
// let opRedEnvelopeRmbToCountConfig:any = {
// 	[opRedEnvelopeRmbConfig.firstLevel]     : 10,          //
// 	[opRedEnvelopeRmbConfig.secondLevel]    : 20,          //
// }

// //雇佣
// let opEmployConfig:any = {
// 	plrMaxEmployGroup : 300,  //玩家最大雇佣组
// 	sysMaxEmployGroup : 60,   //系统最大雇佣组
// 	maxEmployOutCount : 3,    //最多被雇佣次数
// 	plrEmployOutCount : 1,    //最多雇佣出去N组
// 	plrEmployInCount  : 4,    //最多雇佣进来N组
// 	employLastTime : 3*60,    //雇佣计算收入时间
// 	leastOutTime : 24*3600,   //至少24小时候才能收回
// 	plrDailyMaxCount : 2,     //每天最多雇佣两次
// 	dailyRentCount : 1,       //每天出租次数
// }

// let opCreateTeamCode:any = {
// 	Success : 0,
// 	NotLogin : 1,//没有登陆信息
// 	HasTeam : 2,//已经有队伍了
// 	NotFreeState : 3,//不是自由状态+
// 	NotEnoughCount : 4,//次数不够
// 	NotActive : 5, //活动没有开放
// }

// let opInviteTeamCode:any = {
// 	Success : 0,
// 	NotLogin : 1,//没有登陆信息
// 	NotHasTeam : 2,//已经有队伍了
// 	NotFreeState : 3,//不是自由状态
// 	CanNotFind : 4,//找不到要邀请的玩家
// 	TargetHasTeam : 5,//目标已经有队伍了
// 	TargetNotFreeState : 6,//目标不是自由状态
// 	TargetScoreLimit : 7,//对方的积分不合要求
// 	TargetNotEnoughCount : 8,//次数不够
// }

// let opKickTeamCode:any = {
// 	Success : 0,
// 	NotLogin : 1,//没有登陆信息
// 	NotHasTeam : 2,//已经有队伍了
// 	NotFreeState : 3,//不是自由状态
// 	NotCaption : 4, //不是队长
// 	CanNotFind : 5,//找不到要踢的玩家
// }

// let opReplyTeamCode:any = {
// 	Success : 0,
// 	TeamNotHere : 1,//队伍已经不在了
// 	CaptionNotHere : 2,//队长已经离开
// 	CaptionNotFree : 3, //已经不是自由状态
// 	TeamFull : 4,//队伍已经满了//
// 	SelfNotLogin : 5,//自己没有登陆//
// 	SelfHasTeam : 6,//自己已经有队伍了
// 	SelfNotFreeState : 7,//自己不是自由状态
// 	NotEnoughCount : 8,//次数不够
// }

// let opLeagueBeginMatchCode:any = {
// 	Success : 0,
// 	InBattle : 1,//战斗中
// 	NotActive : 2,//活动没有开始
// 	CountNotEnought : 3,//次数没有了
// 	NotFree : 4,//不是自由状态
// 	MemberNotEnoughCount : 5,//成员次数不够
// 	NotCaption : 6, //不是队伍里的队长，不可以开始匹配
// }

// let opLeagueCancelMatchCode:any = {
// 	Success : 0,
// 	InBattle : 1,//战斗中
// 	NotMatch : 2,//不在匹配状态中
// }

// let opLeagueDisbandCode:any = {
// 	Success : 0,
// 	NotLogin : 1,//没有登陆信息
// 	NotHasTeam : 2,//没有队伍
// 	NotFreeState : 3,//不是自由状态	
// 	NotCaption : 4,//不是队长
// }

// let opLeagueLeaveCode:any = {
// 	Success : 0,
// 	NotLogin : 1,//没有登陆信息
// 	NotHasTeam : 2,//没有队伍
// 	NotFreeState : 3,//不是自由状态	
// 	IsCaption : 4,//不是成员 是队长
// }

// let opLeagueQuitQueueCode:any = {
// 	Success : 0,
// 	NotLogin : 1,//没有登陆信息
// 	NotQueueState : 2,//不是准备战斗状态
// 	NotHasBattleId : 3,//没有战斗状态ＩＤ
// }

// let opLeagueFinishCode:any = {
// 	Success : 0,
// 	Fail : 1,//太长时间没有匹配到合适
// 	SomeOneCancel : 2,//有人退出了匹配//
// }

//生死劫奖励配置
let opLifeAndDeathPrizeValueConfig = {
	fightPrize : 0x1,   	//战斗奖励
	boxPrize : 0x2,    		//宝箱奖励
}

// //阵营战
// //ConfigZhenYing = {
// //	needLevel : 1,  //参加等级
// //	redTeam : 1,  //红
// //	blueTeam : 2, //蓝
// //	
// //	//每周的周二，周三，周四，22:00-22:30
// // startTime:any : {
// //		{wday:1, hour:20, minu:0},
// //		{wday:4, hour:20, minu:0},
// //		{wday:5, hour:20, minu:0},
// //		{wday:6, hour:15, minu:0},
// //		{wday:0, hour:15, minu:0},
// //	},
// // endTime:any = {
// //		{wday:1, hour:20, minu:30},
// //		{wday:4, hour:20, minu:30},
// //		{wday:5, hour:20, minu:30},
// //		{wday:6, hour:15, minu:30},
// //		{wday:0, hour:15, minu:30},
// //	},
// //	
// //	matchInterval = 20, //匹配间隔
// // inspireRate:any = {1, 1, 1, 1, 1, 1, 1, 1, 1, 1}, //鼓舞成功率
// // inspireEffect:any = {0.1, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6}, //鼓舞效果
// //	inspireNeed = 20, //鼓舞晶石
// //	
// //	//winGold = 10000*3, //胜利金币
// //	//loseGold = 20000, //失败金币
// //	npcItemEntry = 3, //积分商城索引
// //	lastTime = 1800, //持续时间
// //}

// //boss活动索引
// //opBossActivityIndex = 
// //{
// //	
// //}


//跨服争霸搭档状态
let opGlobalMineActTeamStatus = 
{
	nothing : 0,  //驻守营地
	move : 1,     //移动
	guard : 2,    //守卫
	mining : 3,   //挖矿
	stay : 4,     //停留
}

//跨服争霸搭档状态
let opGlobalMineCampInfoIndex = 
{
	noting  : 0,  //空
	ren     : 1,  //人
	xian    : 2,  //仙
	yao     : 3,  //妖
}

//跨服争霸活动状态
let opGlobalMineStatus = 
{
	noting  : 0,  //没开
	prepare : 1,  //预开
	active  : 2,  //开启
}

//据点配置
let StrongholdConfig = 
{
	openLevel: 80,
	recordType: {
		["fininsh"]: 1,//开采结束
		["robbedSucc"]: 2,//被抢
		["robbedFail"]: 3//被抢失败
	},
	robCount: 3,  //每天掠夺次数
	//beRobbedMaxCount: 3,  //每天被掠夺最多次数
	occupyCount: 3,  //每天占领次数
	//robDownRatio: 0.4, //掠夺4次降低的效率
	robRatio: 0.3, //掠夺收益效率
	levelRatio: [
		{["min"]: 80,  ["max"]: 99,  ["ratio"]: 0},
		{["min"]: 100, ["max"]: 119, ["ratio"]: 0.1},
		{["min"]: 120, ["max"]: 139, ["ratio"]: 0.2},
		{["min"]: 140, ["max"]: 159, ["ratio"]: 0.3},
		{["min"]: 160, ["max"]: 179, ["ratio"]: 0.4},
		{["min"]: 180, ["max"]: 199, ["ratio"]: 0.5},
		{["min"]: 200, ["max"]: 249, ["ratio"]: 0.8},
		{["min"]: 250, ["max"]: 299, ["ratio"]: 1},
		{["min"]: 300, ["max"]: 300, ["ratio"]: 1.2},
	],
	vipRatio: {//vip加成
		[1]: [//小矿
			{["min"]: 5,  ["max"]: 6,  ["ratio"]: 0.05},
			{["min"]: 7,  ["max"]: 8,  ["ratio"]: 0.1},
			{["min"]: 9,  ["max"]: 10, ["ratio"]: 0.15},
			{["min"]: 11, ["max"]: 20, ["ratio"]: 0.2}
		],
		[2]: [//中矿
			{["min"]: 5,  ["max"]: 6,  ["ratio"]: 0.15},
			{["min"]: 7,  ["max"]: 8,  ["ratio"]: 0.2},
			{["min"]: 9,  ["max"]: 10, ["ratio"]: 0.35},
			{["min"]: 11, ["max"]: 20, ["ratio"]: 0.5}
		],
		[3]: [//大矿
			{["min"]: 5,  ["max"]: 6,  ["ratio"]: 0.25},
			{["min"]: 7,  ["max"]: 8,  ["ratio"]: 0.5},
			{["min"]: 9,  ["max"]: 10, ["ratio"]: 0.75},
			{["min"]: 11, ["max"]: 20, ["ratio"]: 1}
		]
	},
	facRatio: {//每个公会成员加成（中型才有）
		[1]: 0,
		[2]: 0.1,
		[3]: 1
	},

	clearWaitCost: 2, //每秒2元宝

	clubBuffFactor: 0.02, //公会人数buff系数
	clubBuffMaxFactor: 0.6, //公会人数buff最大系数
	debuffFactor: 0.04, //击败玩家debuff系数
	debuffMaxFactor: 1 //击败玩家debuff最大系数
}