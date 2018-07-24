/*
作者:
    yangguiming
	
创建时间：
   2013.6.06(周四)

意图：
   常用游戏变量定义

公共接口：
   
*/


ImportType(opItemUnit)


var FRAME_MIN_EXCURSION = 10
var FRAME_MAX_EXCURSION = FRAME_MIN_EXCURSION + 30


var NPCTALK_MIN_SCOPE = 3//NPC谈话最小范围
var NPCTALK_MAX_SCOPE = 6//NPC谈话最大范围


var MAX_MSG_WAIT_TIME = 10000 //网络包最大等待时间

var MOVE_DELAY_TIME = 800 //跳地图延迟毫秒

var ZHUCHENG_MAPID = 50014 //主城地图ID

// var SCENE_PERS_SCALE_LIVE = 0.86 //非战斗时候的角色缩放
//var SCENE_PERS_SCALE_FIGHT = 1 //战斗时候的角色缩放

//是否主城
function IsMainMap(){
	return MapSystem.getInstance().getMapId() == ZHUCHENG_MAPID
}

var PET_COUNT = 18


//资源加载定义
let ResourceGroupDefine ={
	Group_Static : "static",  //游戏前加载，不析构
	Group_EnterGame : "entergame",//游戏前加载
	//Group_LiveCommon : "livecommon",//生活场景加载通用
	Group_LiveState : "livestate",//生活场景主界面
	Group_CombatState : "combatstate",//战斗主界面

	Group_Guide:"guide",//新手引导资源

	Group_LOGINPRELOAD:"loginpreload",//登陆预加载
}


//////////////////////////////////////////////////////////////////////////////////-
// 系统音乐效
let SystemSound = {
	effect_btnClick : "click.mp3", //:点击按钮音效
	effect_levelUp : "", // :角色升级c
	effect_finishTask : "finishtask.mp3", //完成任务
	effect_newMsg : "newmsg.mp3", //新的消息


	effect_itemUse: "",
	effect_jiaoyi : "jinbi.mp3", //物品出售
	effect_lotteryGet : "lottery_get.mp3", //抽奖获得

	effect_kaizhan: "",			//战斗开始
	effect_win : "win.mp3", 	//战斗胜利
	effect_fail : "", //战斗失败
	effect_skill : "dazhao.mp3",	//发招
	effect_chuxian:"chuxian.mp3",


	effect_shouji_nv: "",//女受击
	effect_shouji_nan: "",//男受击
	effect_shouji : "", //受击


	effect_Death_nv: "",
	effect_Death_nan: "",
	effect_Death : "",//死亡特效
	
	
	
	music_login : "", //登陆动画
	music_combat : "fight.mp3",//战斗


	
	
}

let wndToJump:any = {
	FINAL_DRAGON : 1,//终极魔龙
	MESS_WORLD   : 2,//混沌世界
	QRENA        : 3,//竞技场
	SKY_TOWER    : 4,//天空之塔
	PET_RECRUIT  : 5,//部下召集
	ACT_WARFARE	 : 6,//武斗大会
	NOBLE_EXAMINE: 7,//贵族考试
	CAMPWAR			 : 8,//阵营战
	MONAGGRESS	 : 9,//魔物攻城
}

let ConfirmFrom:any = {
	BUY_POWER : "BUY_POWER",             //购买体力
	BUY_GOLD : "BUY_GOLD",               //购买晶石
	LILIAN_FINDBACK : "LILIAN_FINDBACK", //历练找回
	PET_CLEAR_SKILL_PURPLE : "PET_CLEAR_SKILL_PURPLE", //宠物洗练紫色技能
	PET_CLEAR_SKILL_GOLD : "PET_CLEAR_SKILL_GOLD", //宠物洗练金色技能
	PET_CLEAR_SKILL_RED : "PET_CLEAR_SKILL_RED", //宠物洗练红色技能
	PET_CLEAR_SKILL_CAI : "PET_CLEAR_SKILL_CAI", //宠物洗练彩色技能
	BUY_HOUSE_ITEM :"BUY_HOUSE_ITEM"	//房子升阶自动购买
}

//格式：LinkSign..channelOption.WND..";"..wndToJump.FINAL_DRAGON..";终极魔龙"..LinkSign



//////////////////////////////////////////////////////////////////////////////////-
// 特效 ModelEffect.csv配置
let effectIndex = {  
// 	ChuanQiOrange			: 90011,			 //传奇橙色
// 	ChuanQiSuit				: 90013,			 //传奇套装
// 	ChuanQiSuitDrop 	: 90023,			 //装备射
// 	ChuanQiOrangeDrop : 90024,			 //传橙射
// 	ZhanDouFaZhen			: 90027,			 //战斗法阵
	
// 	ClickMap          : 90001, //点击地图
 	Death          		: 90002, //死亡特效
// 	FightStart     		: 90003, //战斗开场
// 	FightWin	     		: 90145, //战斗胜利
 	LevelUp						: 90007, //升级特效
// 	CampaignThumb			: 90029, //关卡手指

    QiangHua            : 90008, //强化
	RongJie             : 90009, //溶解

	BuZhuo              : 90010, //捕捉成功

	FeiSheng            : 90038, //宠物飞升

	Juji_bai             :90031, //聚集能量白色
	Juji_lv              :90039, //聚集能量绿色
	Juji_lan             :90040, //聚集能量蓝色
	Juji_zi              :90041,//聚集能量紫色
	Juji_jin             :90042,//聚集能量金色,

// 	TracePrint1				: 10291, //法阵1级特效
// 	TracePrint2				: 10292, //法阵2级特效
// 	TracePrint3				: 10293, //法阵3级特效
// 	TracePrint4				: 10294, //法阵4级特效
// 	TracePrint5				: 10295, //法阵5级特效
// 	TracePrint6				: 10498, //法阵6级特效
// 	TracePrint7				: 10499, //法阵7级特效
// 	TracePrint8				: 10500, //法阵8级特效
// 	TracePrint9				: 10501, //法阵9级特效
// 	TracePrint10			: 10502, //法阵10级特效
// 	TracePrint11			: 10502, //法阵11级特效
	
// 	attacked1					:	10588, //受击动作1		圣地（下同）
// 	attacked2					:	10028, //受击动作2
// 	attacked3					:	10011, //受击动作3
	
// 	attack1						:	10011, //攻击动作1
// 	attack2						:	10040, //攻击动作2
// 	attack3						:	10034, //攻击动作3		圣地（到此）
	
	
// 	warning						:	90209, //警告
	
// 	EquipEnhance 			: 90146, //装备强化
// 	YuLingLevel 			: 90147, //御灵升级
// 	PetAwake 					: 90152, //觉醒特效
// 	PetBreak					: 90176, //突破特效
// 	TaskFinish 					: 90150, //任务完成
// 	TaskNew 					: 90151, //任务领取
// 	Glow1 						: 90148, //养成互动1
// 	Glow2 						: 90149, //养成互动2
// 	RongJie           : 90153, //溶解
// 	Summon1           : 90154, //抽将1
// 	Summon2           : 90155, //抽将2

// 	SummonEffect1     : 10283, //祭坛动画1
// 	SummonEffect2     : 10284, //祭坛动画2
// 	SummonEffect3     : 10285, //祭坛动画3
// 	SummonEffect4     : 10286, //祭坛动画4

// 	AiXin					: 10115, //爱心
	
// 	EnergyCollect     : 90179,	//能量收集
// 	EnergyExplode     : 90180,	//能量爆炸
// 	Whirlpool			    : 90181,	//漩涡
// 	KissBegin			    : 90182,	//女神之吻动画1
// 	Victor						: 90183, //胜利
// 	KissEnd           : 90204,//女神之吻动画2
	
// 	EXPBALL			    	: 90200,	//经验球
// 	EXPBAR						: 90199, //经验条

// 	EquipMake					: 90129, //装备打造
	
// 	GuangMing				: 90132, //众神之战光明翻牌
// 	HeiAn					: 90133, //众神之战黑暗翻牌
// 	MeiGuiHua              : 90203, //玫瑰花
// 	XQBeiShang             : 90229, //心情奖励悲伤特效
// 	XQYanHua               : 90230, //心情奖励烟花特效
// 	HuoBanFaZhen           : 90232, //伙伴法阵
// 	DaTaoWang              : 10287, //大逃亡
// 	DaTaoWangYu1           : 10288, //大逃亡鱼1
// 	DaTaoWangYu2           : 10289, //大逃亡鱼2
// 	DaTaoWangMen1          : 10728, //大逃亡任意门1
// 	DaTaoWangMen2          : 10729, //大逃亡任意门2
	
//   GongMing                 : 90178,  //装备共鸣
//   JiTan                    : 90051, //祭坛特效
//   ChouJiang                : 90047, //抽将
//   GuangZhao                : 90048, //光照
//   GuangXiao                : 90049, //光效
//   WenZi                    : 90050, //文字

//   NvShen1                  : 90043,  //蜡烛 女神之吻
//   NvShen2                  : 90042,  //闪电 女神之吻
  
//   PassCampAnim1            : 90225, //释放能量
//   PassCampAnim2            : 90226, //能量上升
//   PassCampAnim3            : 90227, //能量爆炸
//   PassCampAnim4            : 90228, //循环漩涡
 
}

//游戏状态
////////////////////////////////////////////////////////////////////////////////////
let state_type:any = {
	BASE_STATE 				: 0,			//默认
	LIVE_BASE_STATE 	: 10,			//生活场景
	COMBAT_BASE_STATE : 100,		//战斗
}

state_type.LIVE_STORY_STATE = state_type.LIVE_BASE_STATE + 1			  //剧情表演
state_type.LIVE_TRADE_STATE = state_type.LIVE_BASE_STATE + 2			  //交易
//state_type.LIVE_GIVE_STATE = state_type.LIVE_BASE_STATE + 3			    //给予
//state_type.LIVE_STALL_STATE = state_type.LIVE_BASE_STATE + 4			  //摆摊
//state_type.LIVE_ADDFRIEND_STATE = state_type.LIVE_BASE_STATE + 5	  //加为好友
//state_type.LIVE_IB_ATTACK_STATE = state_type.LIVE_BASE_STATE + 6		//强制IB_PK攻击
//state_type.LIVE_ATTACK_STATE = state_type.LIVE_BASE_STATE + 7			  //切磋PK
//state_type.LIVE_USEITEM_STATE = state_type.LIVE_BASE_STATE + 8			  //使用背包物品
//state_type.LIVE_GIVE_SELECT_STATE = state_type.LIVE_BASE_STATE + 9		//给予玩家选择状态
//state_type.LIVE_TRADE_SELECT_STATE = state_type.LIVE_BASE_STATE + 10	//交易玩家选择状态
//state_type.TASK_CANGBAOTU_STATE = state_type.LIVE_BASE_STATE + 11			//打开藏宝图
//state_type.LIVE_BIWU_STATE      = state_type.LIVE_BASE_STATE + 12			//进入房间比武状态
state_type.LIVE_DRAMA_STATE      = state_type.LIVE_BASE_STATE + 13			//进入剧情状态
//state_type.LIVE_ACTIVITY_BROKENHISTORY      = state_type.LIVE_BASE_STATE + 14 //混沌世界		
//state_type.LIVE_ACTIVITY_SINGLE_BOSS      = state_type.LIVE_BASE_STATE + 15 //终极魔龙
//state_type.LIVE_ACTIVITY_ANSWER_QUESTION  = state_type.LIVE_BASE_STATE + 16 //答题
//state_type.LIVE_ACTIVITY_SEALED_GROUND_QUESTION  = state_type.LIVE_BASE_STATE + 17 //军团副本
//state_type.LIVE_ACTIVITY_WARFARE	  = state_type.LIVE_BASE_STATE + 18 //武斗会
//state_type.LIVE_ACTIVITY_LIGHT_TEMPLE	  = state_type.LIVE_BASE_STATE + 19 //光明神殿
//state_type.LIVE_ACTIVITY_FACTION_WAR	  = state_type.LIVE_BASE_STATE + 20 //军团战
//state_type.LIVE_ACTIVITY_MON_AGGRESS  = state_type.LIVE_BASE_STATE + 21 //魔物攻城
//state_type.LIVE_ACTIVITY_MIWU_SEN_LIN = state_type.LIVE_BASE_STATE + 22 //迷雾森林

state_type.LIVE_ACTIVITY_STATE = state_type.LIVE_BASE_STATE + 50 //活动通用状态
state_type.LIVE_ACTIVITY_MSG_STATE = state_type.LIVE_BASE_STATE + 51 //活动，可以响应IconMessage的状态
state_type.LIVE_ACTIVITY_GLOBALMINING = state_type.LIVE_BASE_STATE + 52 //跨服争霸

state_type.LIVE_BASE_STATE_END      = state_type.LIVE_BASE_STATE + 99


//state_type.COMBAT_ACTION_STATE = state_type.COMBAT_BASE_STATE + 1		//战斗表演
//state_type.COMBAT_ATTACK_STATE = state_type.COMBAT_BASE_STATE + 2   //战斗攻击
//state_type.COMBAT_SPELL_STATE = state_type.COMBAT_BASE_STATE + 3    //战斗施法
//state_type.COMBAT_ITEM_STATE = state_type.COMBAT_BASE_STATE + 4     //战斗道具
//state_type.COMBAT_PROTECT_STATE = state_type.COMBAT_BASE_STATE + 5  //战斗保护
//state_type.COMBAT_CATCH_STATE = state_type.COMBAT_BASE_STATE + 6    //战斗捕抓
//state_type.COMBAT_CLOCK_STATE = state_type.COMBAT_BASE_STATE + 7    //战斗时钟
//state_type.COMBAT_WAIT_STATE = state_type.COMBAT_BASE_STATE + 8     //战斗等待
//state_type.COMBAT_DIRECT_STATE = state_type.COMBAT_BASE_STATE + 9     //战斗指挥
//state_type.COMBAT_DIRECT_DEL_STATE = state_type.COMBAT_BASE_STATE + 10//战斗指挥取消
//state_type.COMBAT_ITEM_SELECT_STATE = state_type.COMBAT_BASE_STATE + 11//战斗选择道具
state_type.COMBAT_STORY_STATE = state_type.COMBAT_BASE_STATE + 12//战斗中的电影状态
state_type.COMBAT_BASE_STATE_END = state_type.COMBAT_BASE_STATE + 99

////////////////////////////////////////////////////////////////////




let DAY_SECS = 24*3600 //一天多少秒

let NotificationType:any = {
	Cycle : 100, //周期
	Event : 200, //事件
}

//周期IOS只支持1天，7天
let TimeNotificationConfig:any = {
	//公會戰
	// ["notify_1"] : {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT1", ["count"]:1, ["cycleTime"] : DAY_SECS * 7, ["time"]:"18:00", ["week"]:{2,3}},
	// ["notify_1_1"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT1_1", ["count"]:1, ["cycleTime"] : DAY_SECS * 7, ["time"]:"18:00", ["week"]:{2,3}},
	// //天梯賽
	// ["notify_2"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT2", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"21:50", ["week"]:{0,1,2,3,4,5,6}},
	// //眾神之戰
	// ["notify_3"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT3", ["count"]:1, ["cycleTime"] : DAY_SECS * 7, ["time"]:"19:50", ["week"]:{1,4,5}},
	// //趣味答題
	// ["notify_4"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT4", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"10:50", ["week"]:{0,1,2,3,4,5,6}},
	// ["notify_4_1"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT4", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"21:20", ["week"]:{0,1,2,3,4,5,6}},
	// //圣地-神像
	// ["notify_5"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT5", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"20:50", ["week"]:{0,1,2,3,4,5,6}},
	// //圣地至尊怪
	// ["notify_6"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT6", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"12:20", ["week"]:{0,1,2,3,4,5,6}},
	// ["notify_6_1"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT6", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"12:20", ["week"]:{0,1,2,3,4,5,6}},
	// //圣地密钥
	// ["notify_7"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT7", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"9:50", ["week"]:{0,1,2,3,4,5,6}},
	// ["notify_7_1"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT7", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"12:50", ["week"]:{0,1,2,3,4,5,6}},
	// ["notify_7_2"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT7", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"15:50", ["week"]:{0,1,2,3,4,5,6}},
	// ["notify_7_3"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT7", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"18:50", ["week"]:{0,1,2,3,4,5,6}},
	// ["notify_7_4"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT7", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"22:50", ["week"]:{0,1,2,3,4,5,6}},
	// //行动力領取
	// ["notify_8"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT8", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"11:00", ["week"]:{0,1,2,3,4,5,6}},
	// ["notify_8_1"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT8", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"17:00", ["week"]:{0,1,2,3,4,5,6}},
	// ["notify_8_2"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT8", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"21:00", ["week"]:{0,1,2,3,4,5,6}},
	// //世界BOSS
	// ["notify_9"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT9", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"11:50", ["week"]:{0,1,2,3,4,5,6}},
	// ["notify_9_1"] = {["notifyId"]:NotificationType.Cycle, ["msg"] : "SDK_NOTICE_TXT9", ["count"]:1, ["cycleTime"] : DAY_SECS, ["time"]:"16:50", ["week"]:{0,1,2,3,4,5,6}},
	
}


// GetNotificationDelayTime = function(currentTime, info)
// 	let currentDate = os.date("*t", currentTime)
	
// 	if(info.week.length == 0 ){
// 		return -1
// 	}
	
// 	let delayTime = -1
	
// 	let currentWeek = currentDate.wday - 1
// 	//先检查当日是否符合星期条件,而且尚未开始的
// 	for(let _ = 0; _ < info.week.length; _++){
// 			let week = info.week[_]
	
// 		if(week == currentWeek ){
// 				let hour, min = string.match(info.time,"(%d+):(%d+)")
// 				hour = tonumber(hour)
// 				min = tonumber(min)
// 				let targetTime = hour* 3600 + min* 60
// 				let srcTime = currentDate.hour* 3600 + currentDate.min * 60 + currentDate.sec
// 				let diffTime = targetTime - srcTime
// 				if(diffTime > 0 ){
// 					delayTime = diffTime
// 				}
// 		}
// 	}
	
// 	//如果当日不符合，再检查距离下次开启
// 	if(delayTime == -1 ){
// 		//寻找离当日最近的日期
// 		let minDiffDay = 999
// 		for(let _ = 0; _ < info.week.length; _++){
// 			let week = info.week[_]
	
// 			let diffDay = week - currentWeek
// 			if(diffDay <= 0 ){
// 				diffDay = diffDay + 7//循环一周
// 			}
			
// 			if(diffDay < minDiffDay ){
// 				minDiffDay = diffDay
// 			}
// 		}
		
// 		//首次开启时间
// 		let minBeginTime = -1
// 		let hour, min = string.match(info.time,"(%d+):(%d+)")
// 		hour = tonumber(hour)
// 		min = tonumber(min)
// 		let minBeginTime = hour * 3600 + min * 60
		
// 		//当日剩余时间
// 		let remainSec = DAY_SECS - (currentDate.hour* 3600 + currentDate.min * 60 + currentDate.sec)
// 		delayTime = remainSec + minBeginTime + (minDiffDay-1) * DAY_SECS
// 	}
	
// 	TLog.Assert(delayTime >= 0)
	
// 	return delayTime
// }

let SpecialWingSkill:any = {
	[800001] : 40208,
	[800004] : 40209,
	[800005] : 40210,
	[800010] : 40212,
}

let NpcItemSellIdIndex:any = {
	TIANTI		: 6,
	GUOZHAN		: 14,
	FACTION_BUILD : 15,  //军团建筑信息list
	KNIGHT_SHOP : 16,    //骑士团积分商店list
}

// let WingTotemTitle:any = {
// 	[objectField.WING_FIELD_TOTEM_SPEED_DEC] : "WING_TOTEM_JIANSHU",
// 	[objectField.WING_FIELD_TOTEM_CRI_ATT_DEC] : "WING_TOTEM_BAOMIAN",
// 	[objectField.WING_FIELD_TOTEM_CRITICAL_DEC] : "WING_TOTEM_KANGBAO", 
// 	//[objectField.WING_FIELD_TOTEM_DAMAGE_DEC] : "WING_TOTEM_MIANSHANG",
// }



let OrdinaryActivityName:any = {
	[OrdinaryActivityIndex.FactInstZones]								: "ACTIVITY_NAME1",				//帮会副本
	[OrdinaryActivityIndex.ServerTeam]									: "ACTIVITY_NAME2",				//跨服副本
	[OrdinaryActivityIndex.LifeAndDeathBoss]							: "ACTIVITY_NAME3",				//生死劫
	[OrdinaryActivityIndex.DATI]										: "ACTIVITY_NAME4",				//科举考试
	[OrdinaryActivityIndex.GlobalMine]									: "ACTIVITY_NAME5",				//跨服争霸
	[OrdinaryActivityIndex.WuLin]										: "ACTIVITY_NAME6",				//武林大会
	[OrdinaryActivityIndex.Stronghold]									: "ACTIVITY_NAME7",				//天宫
}

let ItemUnitName:any = {
	[opItemUnit.FUNDS]												: "JINBI",			//金币
	[opItemUnit.BIND_CURRENCY]										: "BIND_YUANBAO",	//绑定元宝
	[opItemUnit.CURRENCY]											: "YUANBAO",		//元宝
	[opItemUnit.POWER]												: "MAIN_TILI",					//行动力
	[opItemUnit.JJC_POINT]										    : "JJ_JIFEN",					//竞技积分
	[opItemUnit.SKY_TOWER_POINT]							 		: "SKYTOWER_TXT23",			//试炼场积分
	[opItemUnit.ZHENXING_POINT]										: "GODSWAR_TEXT29",			//众神之战积分
	[opItemUnit.HOME_PAGE_CHARM]									: "PER_HOMEPAGE_TEXT72",//个人魅力值
	[opItemUnit.LEGEND_POWDER]										: "ITEM_RESOLVE_TXT9",	//资源点
	[opItemUnit.FACCONTRIBUTE_POINT] 								: "BANG_GONG",  //帮贡
    [opItemUnit.FIREND_CURRENCY] 									: "YOUQINGBI",                 //友情币
    [opItemUnit.PRESTIGE]   										: "WEIWANG" ,
	[opItemUnit.WORLD_POINT]                                		: "TIANXIADIYI",               //天下第一  
	[opItemUnit.HUN_POINT]                                		    : "HUN_POINT",               //魂币     
}

let IconMsgType:any = {
	FRIEND_CHAT			:	"FRIEND_CHAT", //私聊
	FRIEND_APPLY		:	"FRIEND_APPLY", //好友申请
	
	TEAM_APPLY		:	"TEAM_APPLY", //队伍申请
	TEAM_INVITE		:	"TEAM_INVITE", //入队邀请
	TEAM_STATUS		:	"TEAM_STATUS", //队伍动态
	
	
	EMAIL_LIST		:	"EMAIL_LIST", //邮件
	
	CLUB_FUBEN		:	"CLUB_FUBEN", //军团副本
	CLUB_APPLY		:	"CLUB_APPLY", //军团申请
	CLUB_HIRE			:	"CLUB_HIRE", //公会雇佣
	
	GROW					:	"GROW", //养成
	GROW_EVENT		:	"GROW_EVENT", //事件
	
	ROBBER_INCOME		:	"ROBBER_INCOME", //圣地掉落
	
}
