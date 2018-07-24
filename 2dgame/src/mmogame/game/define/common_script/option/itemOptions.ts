//
//let field = objectField

let storeOptions:any = {
	PACKET    :	1,  //背包
	ROLEEQUIP : 2,	//角色装备
	COMMONEQUIP : 3, //通用装备
	ROLE_ALISMAN   : 4 //角色法宝
	// EQUIP1    :	2,  //装备1
	// EQUIP2    :	3,  //装备2
	// PETITEM   :	4,  //宠物装备
	// DEPOT     :	5,  //信箱
	// WAREHOUSE :	6,  //仓库
	// FAIRYITEM :	7,  //精灵
	// RIDEITEM  :	8,  //坐骑
	// AUCTION   :	9,  //拍卖行
	// PLAYERITEM : 10, //主角身上的装备
}

//sexType =
//{
//	[0] : "无限制",
//	[1] : "男",
//	[2] : "女",
//}

let useTimeOptions:any = {
	BOTH          :	0,  //内外
	IN_COMBAT     :	1,  //战斗中使用，
	OUT_COMBAT    :	2,  //战斗外使用，
	LEITAI_COMBAT : 3,  //只能在擂台pk中使用
}

//useObjects =
//{
//	NONE  : 0,  //不能在战斗中使用
//	SELF  :	1,  //对己方使用
//	BOTH  :	2,  //对已方和敌方使用
//	ENEMY :	3,  //对敌方使用
//}

let equipQuality:any = {
	BLUE    :	1, 
	GREEN      :	2, 
	SKYLUBE : 3, 
	FACHSAI    :	4,
	ORANGE    :	5,
	RED   :	6, 
}

let opItemStatus:any = {
	NONE        : 0,  //无状态
	BIND        : 1,  //普通绑定/主动绑定
	PASSIVEBIND : 2,  //绑定专用/被动绑定
	UNBIND      : 3,  //解绑
}

let opTradeStatus:any = {
	TRADE_STATUS_OFFER        : 1,  //提出交易
	TRADE_STATUS_ACCEPT_OFFER : 2,  //接受交易要求
	TRADE_STATUS_REJECT_OFFER : 3,  //拒绝交易要求
	
	TRADE_STATUS_ITEM_UPDATE  : 4,  //物品改变
	TRADE_STATUS_PET_UPDATE   : 5,  //宠物改变
	TRADE_STATUS_MONEY_UPDATE : 6,  //现银改变
  
	TRADE_STATUS_LOCK         : 7,  //上锁（出价：包括金钱，道具，宠物）
	TRADE_STATUS_CANCEL_LOCK  : 8,  //取消上锁
  
	TRADE_STATUS_LOCK_SUCCESS : 9,  //上锁成功
	TRADE_STATUS_LOCK_FAIL    : 10, //上锁失败
  
	TRADE_STATUS_ACCEPT_LOCK  : 11, //接受交易
	TRADE_STATUS_REJECT_LOCK  : 12, //拒绝交易
  
	TRADE_STATUS_SUCCESS      : 13, //交易成功
	TRADE_STATUS_FAIL         : 14, //交易失败
  
	TRADE_STATUS_PRE          :	15, //未交易
	TRADE_STATUS_ING          :	16, //正在交易
	TRADE_STATUS_OK           :	17, //已确定    TRADE_STATUS_LOCK : 7,已上锁
}

let opTradeRet:any = {
	TRADE_RET_NONE            : 0,  //对方主动拒绝了请求
	TRADE_RET_BUSY            : 1,  //对方正在忙
	TRADE_RET_TEAM            : 2,  //对方在队伍当中
	TRADE_RET_FIGHT           : 3,  //对方正在战斗中
	TRADE_RET_TOOFAR          : 4,  //对方不在附近
	TRADE_RET_MONEY_ERROR     : 5,  //交易金钱不够
	TRADE_RET_ITEM_ERROR      : 6,  //存在不可以交易物品
	TRADE_RET_PET_ERROR       : 7,  //存在不可交易宠物
	TRADE_RET_OFFLINE         :	8,  //对方不在线
	
	TRADE_RET_SELF_MAXMONEY   : 9,  //自己无法携带更多的现银
	TRADE_RET_TARGET_MAXMONEY : 10, //对方无法携带更多的现银
	TRADE_RET_SELF_PACKET     :	11, //自己背包满了
	TRADE_RET_TARGET_PACKET   :	12, //对方背包满了
	TRADE_RET_SELF_MAXPET     :	13,
	TRADE_RET_TARGET_MAXPET   :	14,
	TRADE_RET_STALL           :	15, //摆摊中
	
	TRADE_RET_OTHER           : 30, //由于其他原因终止了交易
}

let opItems:any = {
	MAX_PRICE      : 999999999,
	STALL_LEVEL    : 10,            //摆摊所需等级
	UNBIND_TIME    : 72 * 60 * 60,	//解绑所需时间 72小时(秒数)
	STORE_DAY      : 30,            //信箱物品有效天数
	FLY_MAX_INDEX  : 9,             //飞行旗最大记录数
	WAREHOUSE_LOCK : 72 * 60 * 60,  //仓库强制解锁时间
}

let opItemUnit : any = {
	FUNDS             : 1,  //金币
	BIND_CURRENCY     : 2,  //绑定元宝
	CURRENCY          : 3,  //元宝
	POWER             : 4,  //体力
	JJC_POINT         : 6,  //竞技积分
	FACCONTRIBUTE_POINT         : 7,  //帮派贡献
	FIREND_CURRENCY	  : 12,	//友情币
	PRESTIGE		  : 13,	//威望
	EXP               : 14, //经验
	WORLD_POINT       : 15, //天下第一积分
	HUN_POINT         : 16, //魂币
	// WUDOU_POINT       : 7,  //武斗积分
	// LEGEND_POWDER     : 8,  //粉末
	// ZHENXING_POINT    : 9,  //阵型积分
	// WUDOUTEAM_POINT   : 10, //武斗积分2
	// HONOR_POINT       : 11, //成就点
	// FOREST_POINT      : 12, //迷雾积分
	// WUDOUSERVER_POINT : 13, //武斗积分3
	// LEAGUE_POINT      : 14, //天梯荣誉点
	// GUOZHAN_POINT     : 15, //国战资源
	// FACTION_POINT     : 16, //军团建筑积分
	// TEAM_PVE_POINT    : 17, //骑士团副本积分
	// SKY_TOWER_POINT   : 18, //天空之塔积分
	// HOME_PAGE_CHARM   : 19, //主页魅力值
	// FACT_TASK_POINT   : 20, //军团任务积分
}

let opItemTrade:any = {
	TRADE : 1,  //交易
	GIVE  : 2,  //给予
}

let opPassword:any = {
	WAREHOUSE : 1, //仓库解锁
	IBSHOP    : 2, //元宝商城
	SHOW      : 3, //个人秀
	MALL      : 4, //元宝交易
}

//////-宠物装备////////-
//装备系数
var opPetEquipCoefficient:any = [ //第二个参数为权重
	[[1,1.3],30],
	[[1.3,1.6],35],
	[[1.6,1.9],20],
	[[1.9,2.2],10],
	[[2.2,2.5],5],
]

//装备等级
//opPetEquipLevel =
//{ //根据entryId 获取对应的等级
//	[311100] : 1,
//	[312100] : 1,
//	[313100] : 1,
//	[311200] : 2,
//	[312200] : 2,
//	[313200] : 2,
//	[311300] : 3,
//	[312300] : 3,
//	[313300] : 3,
//	[311400] : 4,
//	[312400] : 4,
//	[313400] : 4,
//}

//护符生成技能数
//opHufuGenerateSkill =
//{
//	[1] : {{1,70},{2,30}},
//	[2] = {{1,60},{2,40}},
//	[3] = {{1,50},{2,50}},
//	[4] = {{1,40},{2,60}},
//}

// 物品来源
let opItemSource:any = {
	grank        : 1,  //野外
	shop         : 2,  //普通商店
	IBShop       : 3,  //元宝商城
	make         : 4,  //打造/制造
	task         : 5,  //任务
	trade        : 6,  //交易所
	pet          : 7,  //宠物脱装备
	fairy        : 8,  //精灵脱装备
	ride         : 9,  //坐骑脱装备
	player       : 10, //角色脱装备
	GM           : 11, //GM指令
	Compensate   : 12, //补偿
	Robber       : 13, //圣地
	FactionWar   : 14, //公会战
	SFactionWar  : 15, //跨服公会战
	FactionMatrix: 16, //工会战阵
	FactionMap   : 17, //工会副本
	UnionWar     : 18, //联盟战
	SUnionWar    : 19, //跨服联盟战
	FactionTask  : 20, //公会任务
}

//魔导石星级
//opMagicStoneStar =
//{
//	Green  : 1100,  //绿色
//	Bule   : 1101,  //蓝色
//	Purple : 1102,  //紫色
//	Gold   : 1103,  //金色
//}

//魔导石基本配置
//opMagicStoneConfig =
//{
//	[opMagicStoneStar.Green]    : 20,
//	[opMagicStoneStar.Bule]     : 20,
//	[opMagicStoneStar.Purple]   : 10,
//	[opMagicStoneStar.Gold]     : 10,
//}

//拍卖行配置
let opAuctionConfig:any = {
	maxCount : 100,
	indexToTime : {
		first   : 1*3600,
		second  : 2*3600,
		third   : 4*3600,
	},
	timeToPrize : {
		[1*3600]   : 0.05,
		[2*3600]   : 0.06,
		[4*3600]   : 0.08,
	},
	baseRatio : 0.1,
	tradeRecordCount : 50,
	priceRecordCount : 20,
	commisionRatio : 0.1,
}

// 元素石相关常量
let opElementStone:any = {
	levelLimit : 5,  // 等级上限
}

//转换物品EntryId
let SpecailItemId : any = {
	FUNDS : 60055,
	GOLD  : 60057,
	B_GOLD  : 60056,
	EXP   : 60061,
	EQUIP : 50003,
	POWER : 50004,
	STONE : 40070,

	BLUEEQUIP: 60069, //蓝色装备
	PURPLEEQUIP: 60070, //紫色装备

	BANGGONG : 60072, //帮贡
	WEIWANG  : 60063, //威望
	YOUQING  : 60073, //友情
	JJC_POINT : 60064, //竞技积分
	WORLD_POINT : 60062, //天下第一积分

	BANGGONGZIJIN: 60095, //帮贡资金
	
	SAODANG : 40021,
	ZIZHAOHUAN  : 40043,              //紫色召唤石
	JINZHAOHUAN : 40039,              //金色召唤石
	
	SHENGSHUI					: 40054,        //洗炼圣水
	GAIZAOSHENGSHUI		: 40480,        //改造圣水
	LINGZHUSHENGSHUI	: 40481,        //灵珠圣水
	 
	QIANGHUASHI				: 20058,        //强化石
	HEROSPIRIT				: 50024,				//主角碎魂
	SHENHUN						: 40030,				//伙伴神魂
	ZHUANGBEI					: 40031,				//装备
	JINENGSHU					: 40032,				//技能书
	
	WANNENGSHI				: 91000,				//召集石碎片
	WANNENGZHAOHUAN		: 40416,				//万能召集石
	BSDSHUIPIAN				: 91002,				//波塞冬碎片
	BSDZHAOHUAN				: 40426,				//普罗米修斯召唤石
	LUCKYSTONE				: 21012,				//幸运之星
}

// let opItemColorStr: any[] = [
// 	"gray",
// 	"lime",
// 	"blue",
// 	"purple",
// 	"orange",
// 	"red",
// ]

let opJudgeJieSuo : any = {
	LEVELNUM:"levelNum",
	GAMECASENUM:"gameCaseNum",
	FACTIONLEVEL:"factionLevel",
	RANKINGNUM:"rankingNum",
	CONVOYNUM:"convoyNum",
	ANSWERNUM:"answerNum",
	
	SINGLENUM  : "individualBossNum",
	GLOBALNUM  : "AllBossNum",
	DELINENUM  : "lifeDeathNum",
	MATNUM     : "materialsNum",
}

let opJudgejiesuoIndex : any = {
	[opJudgeJieSuo.LEVELNUM]        : shopTradeConditionIndex.playerLevel,    //等级条件
	[opJudgeJieSuo.GAMECASENUM]     : shopTradeConditionIndex.SmallThunderTemple,                      //通关条件
    [opJudgeJieSuo.FACTIONLEVEL]    : shopTradeConditionIndex.factionLevel,                     //帮会等级条件
	[opJudgeJieSuo.RANKINGNUM]      : shopTradeConditionIndex.Champion,                       //排行条件
	[opJudgeJieSuo.CONVOYNUM]       : shopTradeConditionIndex.HUSONG,                        //护送条件
	[opJudgeJieSuo.ANSWERNUM]       : shopTradeConditionIndex.DATI,                         //答题条件

    [opJudgeJieSuo.SINGLENUM]       : shopTradeConditionIndex.PersonBoss,                         //个人boss条件
    [opJudgeJieSuo.GLOBALNUM]       : shopTradeConditionIndex.WorldPlayerBoss,                         //全民boss条件
    [opJudgeJieSuo.DELINENUM]       : shopTradeConditionIndex.LifeAndDeathBoss,                         //生死劫条件
    [opJudgeJieSuo.MATNUM]          : shopTradeConditionIndex.MaterialBoss,
}


//帮会仓库物品来源
opItemSource =
{
	grank        : 1,  //野外
	shop         : 2,  //普通商店
	IBShop       : 3,  //元宝商城
	make         : 4,  //打造/制造
	task         : 5,  //任务
	trade        : 6,  //交易所
	pet          : 7,  //宠物脱装备
	fairy        : 8,  //精灵脱装备
	ride         : 9,  //坐骑脱装备
	player       : 10, //角色脱装备
	GM           : 11, //GM指令
	Compensate   : 12, //补偿
	Robber       : 13, //圣地
	FactionWar   : 14, //公会战
	SFactionWar  : 15, //跨服公会战
	FactionMatrix: 16, //工会战阵
	FactionMap   : 17, //工会副本
	UnionWar     : 18, //联盟战
	SUnionWar    : 19, //跨服联盟战
	FactionTask  : 20, //公会任务
	boss         : 21, //据点Boss
}
