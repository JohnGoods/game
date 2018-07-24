/////////////////////////////////////////////对象类型////////////////////////////////////////////////
let objectType: any = 
{
	OBJECT_TYPE_PLAYER     : 0,  //主角
	OBJECT_TYPE_MONSTER    : 1,  //怪物
	OBJECT_TYPE_GAMEOBJECT : 2,  //npc
	OBJECT_TYPE_XIANLV     : 3,  //仙侣
	OBJECT_TYPE_PET        : 4,  //宠物
	OBJECT_TYPE_TIANNV     : 5,  //天女
	OBJECT_TYPE_ASSIST     : 6,  //辅助
	OBJECT_TYPE_ITEM       : 7,
	OBJECT_TYPE_NPC        : 8,
	OBJECT_TYPE_BOSS       : 9,
	OBJECT_TYPE_FAIRY      : 10,
	OBJECT_TYPE_WING       : 11,
	OBJECT_TYPE_VACATIONER : 12,
	OBJECT_TYPE_TIANXIAN   : 13,
	OBJECT_TYPE_END        : 100,
}


////////////////////////////////////////////////////////////////////////////////
//战斗结算类型,用于客户端区分结算界面
let opFightResultType:any = {
	PATROL        : 1,        //巡逻
	CAMPAGIN      : 2,        //关卡
	JJC           : 3,        //竞技场
	DRAGON        : 4,        //龙王宝藏
	CAMPAGINBOSS  : 5,        //关卡BOSS
	FACTIONMAP    : 6,        //帮派地图
	CAPTURE       : 7,        //捕捉
	LIFEANDDEATH  : 8,        //生死劫
	FACTION_BOSS      : 9,        //帮会妖怪
	MATERIAL          : 10,       //材料副本
	THUNDER_TEMPLE    : 11,       //小雷音寺
	HEAVEN_TRIAL      : 12,       //天庭试炼
	GLOBAL_TEAM       : 13,       //跨服组队
	PERSONAL_BOSS     : 14,       //个人boss
	WORLD_BOSS        : 15,       //全名boss
	WILD_BOSS         : 16,       //野外boss
	FACT_INST_ZONES   : 17,       //帮会副本
	ESCORT   		  : 18,       //西游护送
	ZHONG_KUI_DEMON   : 19,       //钟馗伏魔
	NERW_SERVER_ZONES : 20,       //新服副本
	WILD_BOSS_PVP     : 21,       //野外bossPVP
	GLOBAL_MINE       : 22,       //跨服争霸(矿战)
	WORLD_ONE_PVP     : 23,       //天下第一
	WU_LIN_MENG_ZHU	  : 24,		  //武林盟主
	STRONGHOLD        : 25,       //据点
	COMMON   		  : 100,	  //公共
}

//战斗类型
let opFightTypeBase:any = {
	PVE             : 0x1,        //PVE
	PVP             : 0x2,        //PVP
	
	TWO_ROUND       : 0x4,        //2回合
	FIVE_ROUND      : 0x8,        //5回合
	TEN_ROUND       : 0x10,       //10回合
	FIFTEEN_ROUND   : 0x20,       //20回合
	THIRTY_ROUND    : 0x40,       //30回合
	
	ONLY_CREATOR    : 0x80,       //战斗包只发送给创建者
	ALL_BATTLE      : 0x100,      //战斗包发送给所有参与战斗的在线玩家
	RIGHT_BATTLE     : 0x200,      //战斗包发送给挑战方的在线玩家
	//TASK          : 0x8,        //task
	//AUTO          : 0x10,       //自动战斗
	//DAILY         : 0x20,       //日常
	//VIEDO         : 0x40,       //录像
	TEAM          : 0x400,       //组队
	//WORLDBOSS     : 0x100,      //世界boss
	JJC           : 0x800,      //竞技场
	//PET           : 0x400,      //宠物特殊战斗(快速招募,事件战斗)
	//WUDOU         : 0x800,      //武斗
	//RELICMINE     : 0x1000,     //遗迹反击战(非反击战为pvp)
	//WUDOUTEAM     : 0x2000,     //武斗2
	//FOREST        : 0x4000,     //迷雾森林
	//LOSTTEMPLE    : 0x8000,     //光明神殿
	//MINIRELICMINE : 0x10000,    //遗迹前战 可能有多个战斗
	//DEADFIELD     : 0x20000,    //死亡领域
	//LEAGUE        : 0x40000,    //跨服天梯
	//SELFCALC      : 0x80000,    //自动计算 ;;只把战斗开始和结束发给客户端　其他的都在服务器计算
	//FACTIONWAR	  : 0x100000,   //军团战
	//ZHENXING			:	0x200000,		//众神之战
}

let opFightType:any = {
	FIGHT_TYPE_TEST             : 0,                                                                                                                     //测试    //现用于剧情中的战斗
	FIGHT_TYPE_PVE_FIVE_COMMON  : bit.bor(opFightTypeBase.PVE, opFightTypeBase.FIVE_ROUND, opFightTypeBase.RIGHT_BATTLE),                                 // 关卡战斗
	FIGHT_TYPE_PVE_FIVE_RIGHT   : bit.bor(opFightTypeBase.PVE, opFightTypeBase.FIVE_ROUND, opFightTypeBase.RIGHT_BATTLE),                                 // 关卡战斗
	FIGHT_TYPE_PVE_FIF_RIGHT    : bit.bor(opFightTypeBase.PVE, opFightTypeBase.FIFTEEN_ROUND, opFightTypeBase.RIGHT_BATTLE),                              // 关卡战斗
	FIGHT_TYPE_PVE_THIR_RIGHT   : bit.bor(opFightTypeBase.PVE, opFightTypeBase.THIRTY_ROUND, opFightTypeBase.RIGHT_BATTLE),                               // 关卡战斗
	FIGHT_TYPE_PVP_FIVE_ALL     : bit.bor(opFightTypeBase.PVP, opFightTypeBase.FIVE_ROUND, opFightTypeBase.ALL_BATTLE),                                  // 关卡战斗
	FIGHT_TYPE_PVP_FIF_ALL      : bit.bor(opFightTypeBase.PVP, opFightTypeBase.FIFTEEN_ROUND, opFightTypeBase.ALL_BATTLE),                               // 关卡战斗
	FIGHT_TYPE_PVP_THIR_ALL     : bit.bor(opFightTypeBase.PVP, opFightTypeBase.THIRTY_ROUND, opFightTypeBase.ALL_BATTLE),                                // 关卡战斗
	FIGHT_TYPE_PVP_FIVE_RIGHT    : bit.bor(opFightTypeBase.PVP, opFightTypeBase.FIVE_ROUND, opFightTypeBase.RIGHT_BATTLE),                                 // 关卡战斗
	FIGHT_TYPE_PVP_FIF_RIGHT     : bit.bor(opFightTypeBase.PVP, opFightTypeBase.FIFTEEN_ROUND, opFightTypeBase.RIGHT_BATTLE),                              // 关卡战斗
	FIGHT_TYPE_PVP_THIR_RIGHT    : bit.bor(opFightTypeBase.PVP, opFightTypeBase.THIRTY_ROUND, opFightTypeBase.RIGHT_BATTLE),                               // 关卡战斗
	//FIGHT_TYPE_PK            : opFightTypeBase.PVP,                                                             // pk战斗(混沌之地)
	//FIGHT_TYPE_TASK          : bit.bor(opFightTypeBase.PVE, opFightTypeBase.TASK),                              // 任务战斗
	//FIGHT_TYPE_DAILY         : bit.bor(opFightTypeBase.PVE, opFightTypeBase.DAILY, opFightTypeBase.TEAM),       // 天空之塔塔
	FIGHT_TYPE_CHAMPION       : bit.bor(opFightTypeBase.PVP, opFightTypeBase.THIRTY_ROUND, opFightTypeBase.JJC, opFightTypeBase.RIGHT_BATTLE),        // 竞技场
	//FIGHT_TYPE_RECRUIT       : bit.bor(opFightTypeBase.PVE, opFightTypeBase.TASK, opFightTypeBase.PET),         // 宠物快速招募战斗
	//FIGHT_TYPE_WORLDBOSS     : bit.bor(opFightTypeBase.PVE, opFightTypeBase.WORLDBOSS),                         // 世界boss战斗（终极魔女）
	//FIGHT_TYPE_EVENT         : bit.bor(opFightTypeBase.PVE, opFightTypeBase.PET),                               // 互动战斗
	//FIGHT_TYPE_WUDOU         : bit.bor(opFightTypeBase.PVP, opFightTypeBase.WUDOU, opFightTypeBase.VIEDO),      // 武斗
	//FIGHT_TYPE_WUDOUTEAM     : bit.bor(opFightTypeBase.PVP, opFightTypeBase.WUDOUTEAM, opFightTypeBase.VIEDO),  // 武斗2
	//FIGHT_TYPE_RELIC_PVP     : bit.bor(opFightTypeBase.PVP, opFightTypeBase.RELICMINE),                         // 遗迹战斗
	//FIGHT_TYPE_RELIC_PVE     : bit.bor(opFightTypeBase.PVE, opFightTypeBase.RELICMINE),                         // 遗迹战斗
	//FIGHT_TYPE_FOREST        : bit.bor(opFightTypeBase.PVE, opFightTypeBase.FOREST),                            // 迷雾战斗
	//FIGHT_TYPE_LOSTTEMPLE    : bit.bor(opFightTypeBase.PVP, opFightTypeBase.LOSTTEMPLE),                        // 光明神殿
	//FIGHT_TYPE_MINIRELICMINE : bit.bor(opFightTypeBase.PVP, opFightTypeBase.MINIRELICMINE),                     // 遗迹前战 可能有多个战斗
	//FIGHT_TYPE_DEADFIELD     : bit.bor(opFightTypeBase.PVE, opFightTypeBase.DEADFIELD),                         // 死亡领域
	//FIGHT_TYPE_LEAGUE        : bit.bor(opFightTypeBase.PVP, opFightTypeBase.VIEDO, opFightTypeBase.LEAGUE),     // 跨服天梯
	//FIGHT_TYPE_FACTIONWARPK  : bit.bor(opFightTypeBase.PVP, opFightTypeBase.FACTIONWAR),                        // 军团战PK
	//FIGHT_TYPE_ZHENXING  		 : bit.bor(opFightTypeBase.PVP, opFightTypeBase.ZHENXING),                      // 众神之战
}

let opFightTypeToMaxRound:any = {
	[opFightTypeBase.TWO_ROUND]      : 2,
	[opFightTypeBase.FIVE_ROUND]     : 5,
	[opFightTypeBase.TEN_ROUND]      : 10,
	[opFightTypeBase.FIFTEEN_ROUND]  : 20,
	[opFightTypeBase.THIRTY_ROUND]   : 30,
}

//注意唯一
//opFightType = 
//{
//	FIGHT_TYPE_TEST          : 0,                                                                               // 测试    //现用于剧情中的战斗（2014.10.20 panjunhua）
//	FIGHT_TYPE_COMMON        : opFightTypeBase.PVE,                                                             // 关卡战斗
//	FIGHT_TYPE_PK            : opFightTypeBase.PVP,                                                             // pk战斗(混沌之地)
//	FIGHT_TYPE_TASK          : bit.bor(opFightTypeBase.PVE, opFightTypeBase.TASK),                              // 任务战斗
//	FIGHT_TYPE_DAILY         : bit.bor(opFightTypeBase.PVE, opFightTypeBase.DAILY, opFightTypeBase.TEAM),       // 天空之塔塔
//	FIGHT_TYPE_CHAMPION      : bit.bor(opFightTypeBase.PVP, opFightTypeBase.JJC, opFightTypeBase.VIEDO),        // 竞技场
//	FIGHT_TYPE_RECRUIT       : bit.bor(opFightTypeBase.PVE, opFightTypeBase.TASK, opFightTypeBase.PET),         // 宠物快速招募战斗
//	FIGHT_TYPE_WORLDBOSS     : bit.bor(opFightTypeBase.PVE, opFightTypeBase.WORLDBOSS),                         // 世界boss战斗（终极魔女）
//	FIGHT_TYPE_EVENT         : bit.bor(opFightTypeBase.PVE, opFightTypeBase.PET),                               // 互动战斗
//	FIGHT_TYPE_WUDOU         : bit.bor(opFightTypeBase.PVP, opFightTypeBase.WUDOU, opFightTypeBase.VIEDO),      // 武斗
//	FIGHT_TYPE_WUDOUTEAM     : bit.bor(opFightTypeBase.PVP, opFightTypeBase.WUDOUTEAM, opFightTypeBase.VIEDO),  // 武斗2
//	FIGHT_TYPE_RELIC_PVP     : bit.bor(opFightTypeBase.PVP, opFightTypeBase.RELICMINE),                         // 遗迹战斗
//	FIGHT_TYPE_RELIC_PVE     : bit.bor(opFightTypeBase.PVE, opFightTypeBase.RELICMINE),                         // 遗迹战斗
//	FIGHT_TYPE_FOREST        : bit.bor(opFightTypeBase.PVE, opFightTypeBase.FOREST),                            // 迷雾战斗
//	FIGHT_TYPE_LOSTTEMPLE    : bit.bor(opFightTypeBase.PVP, opFightTypeBase.LOSTTEMPLE),                        // 光明神殿
//	FIGHT_TYPE_MINIRELICMINE : bit.bor(opFightTypeBase.PVP, opFightTypeBase.MINIRELICMINE),                     // 遗迹前战 可能有多个战斗
//	FIGHT_TYPE_DEADFIELD     : bit.bor(opFightTypeBase.PVE, opFightTypeBase.DEADFIELD),                         // 死亡领域
//	FIGHT_TYPE_LEAGUE        : bit.bor(opFightTypeBase.PVP, opFightTypeBase.VIEDO, opFightTypeBase.LEAGUE),     // 跨服天梯
//	FIGHT_TYPE_FACTIONWARPK  : bit.bor(opFightTypeBase.PVP, opFightTypeBase.FACTIONWAR),                        // 军团战PK
//	FIGHT_TYPE_ZHENXING  		 : bit.bor(opFightTypeBase.PVP, opFightTypeBase.ZHENXING),                      // 众神之战
//}

//战斗限时
//opFightLimitTime = 
//{
//	[opFightType.FIGHT_TYPE_TEST] : 240000,
//	//[opFightType.FIGHT_TYPE_COMMON] : 240000,
//	[opFightType.FIGHT_TYPE_COMMON] : 180000,
//	[opFightType.FIGHT_TYPE_PK] : 230000,
//	[opFightType.FIGHT_TYPE_TASK] : 120000,
//	[opFightType.FIGHT_TYPE_DAILY] : 120000,
//	[opFightType.FIGHT_TYPE_CHAMPION] : 230000,
//	[opFightType.FIGHT_TYPE_RECRUIT] : 120000,
//	[opFightType.FIGHT_TYPE_EVENT] : 120000,
//	[opFightType.FIGHT_TYPE_WUDOU] : 230000,
//	[opFightType.FIGHT_TYPE_WORLDBOSS] : 180000,
//	[opFightType.FIGHT_TYPE_RELIC_PVP] : 230000,
//	[opFightType.FIGHT_TYPE_RELIC_PVE] : 230000,
//	[opFightType.FIGHT_TYPE_WUDOUTEAM] : 230000,
//	[opFightType.FIGHT_TYPE_LOSTTEMPLE] : 230000,
//	[opFightType.FIGHT_TYPE_FOREST] : 230000,
//	[opFightType.FIGHT_TYPE_DEADFIELD] : 230000,
//	[opFightType.FIGHT_TYPE_LEAGUE] : 180000,
//	[opFightType.FIGHT_TYPE_FACTIONWARPK] : 180000,
//	[opFightType.FIGHT_TYPE_ZHENXING] : 150000,
//}

let opPkType:any = {
	NOT_PK : 0,	// 非pk
	NORMAL : 1,	// 野外普通pk
	FORCE  : 2,	// 强制pk
	WANTED : 3,	// 通缉令发起的pk
	LEITAI : 4,	// 擂台pk
}

//////////////////////////////////////////////状态类型//////////////////////////////////////////////
let opStatusType:any = {
	STATUS_TYPE_FIGHT       : 0x0001, //战斗
	STATUS_TYPE_TEAM        : 0x0002, //队长
	STATUS_TYPE_NOTMOVE     : 0x0004, //不可移动
	STATUS_TYPE_LOSER       : 0x0008, //失败者
	//STATUS_TYPE_TICKET      : 0x0010, //持有令牌
	STATUS_TYPE_EREN        : 0x0020, //不良状态(恶人)
	STATUS_TYPE_BAOTU       : 0x0040, //不良状态(暴徒)
	STATUS_TYPE_MOTOU       : 0x0080, //不良状态(魔头)
	STATUS_TYPE_TEAMMATE    : 0x0100, //队员
	STATUS_TYPE_NORMAL_FLAG : 0x0200, //持有一般旗帜
	STATUS_TYPE_SENIOR_FLAG : 0x0400, //持有高级旗帜
	STATUS_TYPE_EMPTY_FIGHT : 0x0800, //混沌虚拟战斗
	//STATUS_TYPE_ROBBER_BBOX : 0x1000, //圣地boss宝箱状态
	STATUS_TYPE_TICKET      : 0x1000, //据点boss钥匙
	STATUS_TYPE_FACT_WAR    : 0x2000, //军团战令牌
	STATUS_ROBBER_DEAD      : 0x4000, //圣地死亡状态
	STATUS_TYPE_MENGZHU		: 0x0010, //武林盟主
}

let opAcceptType:any = {
	ACCEPT_TYPE_TEAM   : 0x01, //接受组队
	ACCEPT_TYPE_TRADE  : 0x02, //接受交易
	ACCEPT_TYPE_FRIEND : 0x04, //接受加好友
	ACCEPT_TYPE_MSG    : 0x08, //接受陌生信息
}

let resultDataType:any = {
	INT     : 0, // 整型
	FLOAT   : 1, // 浮点
	STRING  : 2, // 字符串
	LINK    : 3, // 超连接
	UINT    : 4, // 无符号整型
}

///////////////////////////////////////////////物品类型////////////////////////////////////////////////
let opItemSuperType:any = {}

opItemSuperType.ITEM_SUPER_TYPE_EQUIP       = 10000  //装备的超级类型 (帽,武器,甲,戒指,鞋子,项链)
//opItemSuperType.ITEM_SUPER_TYPE_MATERIAL    = 10010  //素材的超级类型 (材料,素材)
//opItemSuperType.ITEM_SUPER_TYPE_SOUL        = 10020  //英魂的超级类型 (宠物的英魂)
opItemSuperType.ITEM_SUPER_TYPE_GOODS       = 10030  //道具的超级类型 (杂物)
//opItemSuperType.ITEM_SUPER_TYPE_MAGIC_STONE = 10040  //魔导石的超级类型
opItemSuperType.ITEM_SUPER_TYPE_ACTIVE_ITEM = 10050  //技能书超级类型
opItemSuperType.ITEM_SUPER_TYPE_EQUIP_STONE = 10060  //装备宝石超级类型
//opItemSuperType.ITEM_SUPER_TYPE_FAIRY_EQUIP = 10070  //精灵装备超级类型
//opItemSuperType.ITEM_SUPER_TYPE_RIDE_EQUIP  = 10080  //坐骑装备超级类型
opItemSuperType.ITEM_SUPER_TYPE_SHENHUN     = 10040    ///神魂的超级类型

let opItemType:any = {}
opItemType.ITEM_TYPE_GOODS		 = 1 //道具
opItemType.COMMON_EQUIP			 = 2 //通用装备
opItemType.ROLE_EQUIP			 = 3 //角色装备
opItemType.ROLE_ALLSMAN			 = 4 //角色法宝
opItemType.ROLE_SHENHUN          = 5 //角色神魂
/*opItemType.PLAYER_EQUIP_START    = 4 // 装备
opItemType.ITEM_TYPE_CAP         = opItemType.PLAYER_EQUIP_START + 0 // 头盔 4
opItemType.ITEM_TYPE_WEAPON      = opItemType.PLAYER_EQUIP_START + 1 // 武器 5
opItemType.ITEM_TYPE_CLOTH       = opItemType.PLAYER_EQUIP_START + 2 // 衣服 6
opItemType.ITEM_TYPE_MASK        = opItemType.PLAYER_EQUIP_START + 3 // 戒指 7
opItemType.ITEM_TYPE_SHOE        = opItemType.PLAYER_EQUIP_START + 4 // 腰带 8
opItemType.ITEM_TYPE_NECK        = opItemType.PLAYER_EQUIP_START + 5 // 项链 9
opItemType.PLAYER_EQUIP_END      = opItemType.PLAYER_EQUIP_START + 5*/

//opItemType.ITEM_TYPE_GOODS       = 9  //道具
opItemType.ITEM_TYPE_HERO        = 10 //经验
opItemType.ITEM_TYPE_MATERIAL    = 11 //材料
opItemType.ITEM_TYPE_SUCAI       = 12 //素材
opItemType.ITEM_TYPE_MAGIC_STONE = 13 //天赋石
opItemType.ITEM_TYPE_ACTIVE_ITEM = 14 //技能书
opItemType.ITEM_TYPE_EQUIP_STONE = 15 //装备神石

opItemType.ITEM_TYPE_FAIRY_START  = 16
opItemType.ITEM_TYPE_FAIRY_CAP    = opItemType.ITEM_TYPE_FAIRY_START + 0 //精灵头盔 16
opItemType.ITEM_TYPE_FAIRY_WEAPON = opItemType.ITEM_TYPE_FAIRY_START + 1 //精灵武器 17
opItemType.ITEM_TYPE_FAIRY_CLOTH  = opItemType.ITEM_TYPE_FAIRY_START + 2 //精灵护甲 18
opItemType.ITEM_TYPE_FAIRY_SHOE   = opItemType.ITEM_TYPE_FAIRY_START + 3 //精灵鞋子 19
opItemType.ITEM_TYPE_FAIRY_END    = opItemType.ITEM_TYPE_FAIRY_START + 3 //

opItemType.ITEM_TYPE_RIDE_START  = 22
opItemType.ITEM_TYPE_RIDE_CAP    = opItemType.ITEM_TYPE_RIDE_START + 0 //坐骑头盔 22
opItemType.ITEM_TYPE_RIDE_WEAPON = opItemType.ITEM_TYPE_RIDE_START + 1 //坐骑缰绳 23
opItemType.ITEM_TYPE_RIDE_CLOTH  = opItemType.ITEM_TYPE_RIDE_START + 2 //坐骑坐鞍 24
opItemType.ITEM_TYPE_RIDE_SHOE   = opItemType.ITEM_TYPE_RIDE_START + 3 //坐骑蹄铁 25
opItemType.ITEM_TYPE_RIDE_END    = opItemType.ITEM_TYPE_RIDE_START + 3 //

//物品子类型
let opItemSubType:any = {}

//虚拟单位
opItemSubType.ITEM_VIRTUAL_UNIT              = 100//虚拟单位，比如元宝，经验，游戏币，精力之类

//////

//邀请素材子类型
//opItemSubType.ITEM_SUBTYPE_MATERIAL_BEG    = 11 //进阶素材 11
//opItemSubType.ITEM_SUBTYPE_COMMON          = opItemSubType.ITEM_SUBTYPE_MATERIAL_BEG + 0 //公共素材	    11
//opItemSubType.ITEM_SUBTYPE_MATERIAL_GREEN  = opItemSubType.ITEM_SUBTYPE_MATERIAL_BEG + 1 //进阶素材绿色 12
//opItemSubType.ITEM_SUBTYPE_MATERIAL_BLUE   = opItemSubType.ITEM_SUBTYPE_MATERIAL_BEG + 2 //进阶素材蓝色 13
//opItemSubType.ITEM_SUBTYPE_MATERIAL_PURPLE = opItemSubType.ITEM_SUBTYPE_MATERIAL_BEG + 3 //进阶素材紫色 14
//opItemSubType.ITEM_SUBTYPE_MATERIAL_GOLD   = opItemSubType.ITEM_SUBTYPE_MATERIAL_BEG + 4 //进阶素材金色 15
//opItemSubType.ITEM_SUBTYPE_MATERIAL_GRAY   = opItemSubType.ITEM_SUBTYPE_MATERIAL_BEG + 5 //进阶素材灰色 16
//opItemSubType.ITEM_SUBTYPE_MATERIAL_END    = opItemSubType.ITEM_SUBTYPE_MATERIAL_BEG + 5 //
////异界邀请素材
//opItemSubType.PET_ADVANCEEX_ITEM = 105


//其他
//opItemSubType.MIXT_START = 40

//宠物英魂
opItemSubType.PET_SOUL_FETE_BEGIN  = 85
opItemSubType.PET_SOUL_FETE_GRAY   = opItemSubType.PET_SOUL_FETE_BEGIN + 0			//灰色英魂 	一级 85
opItemSubType.PET_SOUL_FETE_GREEN  = opItemSubType.PET_SOUL_FETE_BEGIN + 1			//绿色英魂	二级 86
opItemSubType.PET_SOUL_FETE_BLUE   = opItemSubType.PET_SOUL_FETE_BEGIN + 2			//蓝色英魂	三级 87
opItemSubType.PET_SOUL_FETE_PURPLE = opItemSubType.PET_SOUL_FETE_BEGIN + 3			//紫色英魂	四级 88
opItemSubType.PET_SOUL_FETE_GOLD   = opItemSubType.PET_SOUL_FETE_BEGIN + 4			//金色英魂	五级 89
opItemSubType.PET_SOUL_FETE_END    = opItemSubType.PET_SOUL_FETE_BEGIN + 4

//王者英魂
//opItemSubType.PLR_SOUL_FETE_BEGIN  = 1000
//opItemSubType.PLR_SOUL_FETE_GRAY   = opItemSubType.PLR_SOUL_FETE_BEGIN + 0			//灰色英魂 	一级 1000
//opItemSubType.PLR_SOUL_FETE_GREEN  = opItemSubType.PLR_SOUL_FETE_BEGIN + 1			//绿色英魂	二级 1001
//opItemSubType.PLR_SOUL_FETE_BLUE   = opItemSubType.PLR_SOUL_FETE_BEGIN + 2			//蓝色英魂	三级 1002
//opItemSubType.PLR_SOUL_FETE_PURPLE = opItemSubType.PLR_SOUL_FETE_BEGIN + 3			//紫色英魂	四级 1003
//opItemSubType.PLR_SOUL_FETE_GOLD   = opItemSubType.PLR_SOUL_FETE_BEGIN + 4			//金色英魂	五级 1004
//opItemSubType.PLR_SOUL_FETE_END    = opItemSubType.PLR_SOUL_FETE_BEGIN + 4


//装备素材
//opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN = 90
//opItemSubType.ITEM_EQUIP_NORMAL        = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 0  //普通素材 90
//opItemSubType.ITEM_EQUIP_MAGIC         = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 1  //魔法精华 91
//opItemSubType.ITEM_EQUIP_GOLD          = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 2  //金色粉末 92
//opItemSubType.ITEM_EQUIP_SIFT          = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 3  //精选素材 93
//opItemSubType.ITEM_EQUIP_FLASH         = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 4  //闪光精华 94
//opItemSubType.ITEM_EQUIP_GOLD_PIECE    = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 5  //金色碎片 95
//opItemSubType.ITEM_EQUIP_STRENGTH      = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 6  //强化素材 96
//opItemSubType.ITEM_EQUIP_WISH          = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 7  //如意精华 97
//opItemSubType.ITEM_EQUIP_GOLD_TEAR     = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 8  //金色之泪 98
//opItemSubType.ITEM_EQUIP_SULPHUR       = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 9  //烈焰硫磺 99
//opItemSubType.ITEM_EQUIP_METEOR        = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 10 //流星碎片 100
//opItemSubType.ITEM_EQUIP_HOLY_STONE    = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 11 //神圣之石 101
//opItemSubType.ITEM_EQUIP_SPECIAL       = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 12 //特殊素材 102		
//opItemSubType.ITEM_EQUIP_SUBTYPE_END   = opItemSubType.ITEM_EQUIP_SUBTYPE_BEGIN + 12

//魔导石素材子类型
//opItemSubType.ITEM_SUB_TYPE_STONE_MATERIAL = 103

//道具子类型
opItemSubType.ITEM_TYPE_GOODS_BEGIN       = 100  //道具子类型
opItemSubType.ITEM_TYPE_GOODS_END         = 199  //道具子类型

//opItemSubType.ITEM_TYPE_EXCHANGE_ITEM = 151  //可以对换物品的素材 151
//opItemSubType.ITEM_TYPE_EXCHANGE_PET  = 152  //可以对换宠物的素材 152

//天赋石子类型
opItemSubType.ITEM_TYPE_MAGIC_STONE_BEGIN  = 1100
opItemSubType.ITEM_TYPE_MAGIC_STONE_END    =  opItemSubType.ITEM_TYPE_MAGIC_STONE_BEGIN + 99

//觉醒祭品子类型
//opItemSubType.ITEM_SUB_TYPE_ACTIVE_ITEM	= 1200

//装备宝石子类型
opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN    = 1300
opItemSubType.ITEM_SUB_TYPE_EQUIP_ATT_STONE      = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 0   //攻击石(1300)
opItemSubType.ITEM_SUB_TYPE_EQUIP_HP_STONE       = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 1   //气血石(1301)
opItemSubType.ITEM_SUB_TYPE_EQUIP_DEF_STONE      = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 2   //护甲石(1302)
opItemSubType.ITEM_SUB_TYPE_EQUIP_NDEF_STONE     = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 3   //破甲石(1303)
opItemSubType.ITEM_SUB_TYPE_EQUIP_SPEED_STONE    = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 4   //速度石(1304)
opItemSubType.ITEM_SUB_TYPE_EQUIP_CRITICAL_STONE = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 5   //暴击石(1305)
opItemSubType.ITEM_SUB_TYPE_EQUIP_CRI_ATT_STONE  = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 6   //暴伤石(1306)
opItemSubType.ITEM_SUB_TYPE_EQUIP_NCRI_STONE     = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 7   //防爆石(1307)
opItemSubType.ITEM_SUB_TYPE_EQUIP_DODGE_STONE    = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 8   //闪避石(1308)
opItemSubType.ITEM_SUB_TYPE_EQUIP_BOUND_STONE    = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 9   //命中石(1309)
opItemSubType.ITEM_SUB_TYPE_EQUIP_SILENT_STONE   = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 10  //封印石(1310)
opItemSubType.ITEM_SUB_TYPE_EQUIP_NSILENT_STONE  = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 11  //防封石(1311)
opItemSubType.ITEM_SUB_TYPE_EQUIP_DECRI_STONE    = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 12  //抗暴石(1312)
opItemSubType.ITEM_SUB_TYPE_EQUIP_SKILL_STONE    = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 13  //技巧石(1313)
opItemSubType.ITEM_SUB_TYPE_EQUIP_LOCK_STONE     = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 14  //神魄石(1314)
opItemSubType.ITEM_SUB_TYPE_EQUIP_SPECIAL_STONE1 = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 15  //特殊石(运营活动送出)(1315)
opItemSubType.ITEM_SUB_TYPE_EQUIP_SPECIAL_STONE2 = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 16  //特殊石(运营活动送出)(1316)


//精灵头盔子类型
opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_BEGIN        = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 1400
opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_ONE          = opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_BEGIN + 0
opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_TWO          = opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_BEGIN + 1
opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_THREE        = opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_BEGIN + 2
opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_END          = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 1499
//精灵护甲子类型
opItemSubType.ITEM_SUB_TYPE_FAIRY_CLOTH_BEGIN      = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 1500
opItemSubType.ITEM_SUB_TYPE_FAIRY_CLOTH_ONE        = opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_BEGIN + 0
opItemSubType.ITEM_SUB_TYPE_FAIRY_CLOTH_TWO        = opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_BEGIN + 1
opItemSubType.ITEM_SUB_TYPE_FAIRY_CLOTH_THREE      = opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_BEGIN + 2
opItemSubType.ITEM_SUB_TYPE_FAIRY_CLOTH_END        = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 1599
//精灵鞋子子类型
opItemSubType.ITEM_SUB_TYPE_FAIRY_SHOE_BEGIN       = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 1600
opItemSubType.ITEM_SUB_TYPE_FAIRY_SHOE_ONE         = opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_BEGIN + 0
opItemSubType.ITEM_SUB_TYPE_FAIRY_SHOE_TWO         = opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_BEGIN + 1
opItemSubType.ITEM_SUB_TYPE_FAIRY_SHOE_THREE       = opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_BEGIN + 2
opItemSubType.ITEM_SUB_TYPE_FAIRY_SHOE_END         = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 1699
//精灵武器子类型
opItemSubType.ITEM_SUB_TYPE_FAIRY_WEAPON_BEGIN     = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 1700
opItemSubType.ITEM_SUB_TYPE_FAIRY_WEAPON_ONE       = opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_BEGIN + 0
opItemSubType.ITEM_SUB_TYPE_FAIRY_WEAPON_TWO       = opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_BEGIN + 1
opItemSubType.ITEM_SUB_TYPE_FAIRY_WEAPON_THREE     = opItemSubType.ITEM_SUB_TYPE_FAIRY_CAP_BEGIN + 2
opItemSubType.ITEM_SUB_TYPE_FAIRY_WEAPON_END       = opItemSubType.ITEM_SUB_TYPE_EQUIP_STONE_BEGIN + 1799


//通过大类型获取超级类型
let ItemTypeToSuperType:any = {
	[opItemType.ITEM_TYPE_CAP]          :  opItemSuperType.ITEM_SUPER_TYPE_EQUIP,          //10000
	[opItemType.ITEM_TYPE_WEAPON]       :  opItemSuperType.ITEM_SUPER_TYPE_EQUIP,          //10000
	[opItemType.ITEM_TYPE_CLOTH]        :  opItemSuperType.ITEM_SUPER_TYPE_EQUIP,          //10000
	[opItemType.ITEM_TYPE_MASK]         :  opItemSuperType.ITEM_SUPER_TYPE_EQUIP,          //10000
	[opItemType.ITEM_TYPE_SHOE]         :  opItemSuperType.ITEM_SUPER_TYPE_EQUIP,          //10000
	[opItemType.ITEM_TYPE_NECK]         :  opItemSuperType.ITEM_SUPER_TYPE_EQUIP,          //10000
	[opItemType.COMMON_EQUIP]         	:  opItemSuperType.ITEM_SUPER_TYPE_EQUIP,          //10000
	[opItemType.ROLE_EQUIP]         	:  opItemSuperType.ITEM_SUPER_TYPE_EQUIP,          //10000
	[opItemType.ITEM_TYPE_GOODS]        :  opItemSuperType.ITEM_SUPER_TYPE_GOODS,          //10030
	//[opItemType.ITEM_TYPE_HERO]         :  opItemSuperType.ITEM_SUPER_TYPE_SOUL,           //10020
	//[opItemType.ITEM_TYPE_MATERIAL]     :  opItemSuperType.ITEM_SUPER_TYPE_MATERIAL,       //10030
	//[opItemType.ITEM_TYPE_SUCAI]        :  opItemSuperType.ITEM_SUPER_TYPE_MATERIAL,       //10030
	[opItemType.ITEM_TYPE_MAGIC_STONE]  :  opItemSuperType.ITEM_SUPER_TYPE_MAGIC_STONE,    //10040
	[opItemType.ITEM_TYPE_ACTIVE_ITEM]  :  opItemSuperType.ITEM_SUPER_TYPE_ACTIVE_ITEM,    //10050
	[opItemType.ITEM_TYPE_EQUIP_STONE]  :  opItemSuperType.ITEM_SUPER_TYPE_EQUIP_STONE,    //10060
	//[opItemType.ITEM_TYPE_FAIRY_CAP]    :  opItemSuperType.ITEM_SUPER_TYPE_FAIRY_EQUIP,    //10070
	//[opItemType.ITEM_TYPE_FAIRY_WEAPON] :  opItemSuperType.ITEM_SUPER_TYPE_FAIRY_EQUIP,    //10070
	//[opItemType.ITEM_TYPE_FAIRY_CLOTH]  :  opItemSuperType.ITEM_SUPER_TYPE_FAIRY_EQUIP,    //10070
	//[opItemType.ITEM_TYPE_FAIRY_SHOE]   :  opItemSuperType.ITEM_SUPER_TYPE_FAIRY_EQUIP,    //10070
	//[opItemType.ITEM_TYPE_RIDE_CAP]     :  opItemSuperType.ITEM_SUPER_TYPE_RIDE_EQUIP,     //10080
	//[opItemType.ITEM_TYPE_RIDE_WEAPON]  :  opItemSuperType.ITEM_SUPER_TYPE_RIDE_EQUIP,     //10080
	//[opItemType.ITEM_TYPE_RIDE_CLOTH]   :  opItemSuperType.ITEM_SUPER_TYPE_RIDE_EQUIP,     //10080
	//[opItemType.ITEM_TYPE_RIDE_SHOE]    :  opItemSuperType.ITEM_SUPER_TYPE_RIDE_EQUIP,     //10080
}