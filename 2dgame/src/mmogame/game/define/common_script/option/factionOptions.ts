

//官职
let opFactionOfficeOptions: any = {
	LEADER: 1, //会长
	SUB_LEADER: 2, //副会长
	ELDER: 3, //长老//没有
	TANG_ZHU: 4, //堂主//没有
	XIANG_ZHU: 5, //香主//没有
	ELITE: 6, //精英//没有
	MEMBER: 7, //成员
	BUSINESSMAN: 8, //商人//没有
}

let opOfficeToStr: any = {
	[opFactionOfficeOptions.LEADER]: "CLUB_POS_1",
	[opFactionOfficeOptions.SUB_LEADER]: "CLUB_POS_2",
	[opFactionOfficeOptions.MEMBER]: "CLUB_POS_3",
}

//官职人数上限
let opFactionOfficeCount: any = {
	[opFactionOfficeOptions.LEADER]: 1,
	[opFactionOfficeOptions.SUB_LEADER]: 2,
	[opFactionOfficeOptions.TANG_ZHU]: 5,
	[opFactionOfficeOptions.XIANG_ZHU]: 10,
	[opFactionOfficeOptions.ELITE]: 20,
	[opFactionOfficeOptions.MEMBER]: 199,
	[opFactionOfficeOptions.BUSINESSMAN]: 3,
}

//帮派建筑类型
let opFactionBuild: any = {
	MAIN: 1, //大殿
	JIN_KU: 2, //金库
	SHU_YUAN: 3, //书院
	YAO_FANG: 4, //药房
	CANG_KU: 5, //仓库
	XIANG_FANG: 6, //厢房
}

//帮派技能类型
let opFactionSkill: any = {
	DA_ZAO: 1, //打造
	LIAN_JIN: 2, //炼金
	CAI_FENG: 3, //裁缝
	QIAO_JIANG: 4, //巧匠
	LIAN_YAO: 5, //炼药
	PENG_REN: 6, //烹饪
	QIANG_SHEN: 7, //强身
	AN_QI: 8, //暗器
	TAO_LI: 9, //逃离
	ZHUI_BU: 10, //追捕
	YANG_SHENG_SHU: 11, //养生术
	JIAN_SHEN_SHU: 12, //健身术
}

// 大殿等级与衰减资材对应关系
// [level] = value
let opFactionMaterialReduction: any = {
	[1]: 10,
	[2]: 15,
	[3]: 20,
	[4]: 15,
	[5]: 50,
	[6]: 80,
	[7]: 130,
	[8]: 160,
	[9]: 200,
	[10]: 300,
}

//宗族字节限制
let opFactionCharMax: any = {
	NOTICE: 600,          //公告字节数
	INTRODUCTION: 600,          //宗旨字节数
	MAX_NAME: 21,           //帮派名字最大字节数
	MIN_NAME: 1,            //帮派名字最少字节数
}


//基本配置
let opFactionBaseOptions: any = {
	CREATE_LEVEL: 0,            //创建者的最低等级
	CREATE_MONEY: 9600000,      //创建帮会现银
	CREATE_GOLD: 100,          //创建帮会水晶
	MAX_COUNT: 200,          //宗族最大人数
	BACKGROUND: 40,           //底色最大编号
	EDGE: 40,           //镶边最大编号
	MAINBOX: 40,           //主体最大编号
	MAP: 51002,        //宗族地图ID
	ENTER_X: 107,          //帮派地图进入X
	ENTER_Y: 86,           //帮派地图进入Y
	LEAVE_MAP: 50006,        //离开帮派地图
	LEAVE_X: 484,          //离开帮派地图x
	LEAVE_Y: 210,          //离开帮派地图y
	FLAG_COUNT: 300,          //宗族同时存在的旗帜数量
	FLAG_TIME: 86400,        //旗帜存在时间24小时
	FACTION_NOTE_COUNT: 200,          //宗族记录最大条数
	LEAVE_NOTE_COUNT: 100,          //离开记录最大条数
	JOIN_LEVEL: 0,            //加入宗族最低等级
	CREATE_RENQI: 0,            //创建人气值
	MAX_RENQI: 20000,        //最大人气值
	MAX_DEGREE: 5000,         //繁荣度上限
	CHANGE_NOTICE_POWER: 3,           //修改公告需要体力值
	RECOMMEND_MONEY: 500000,       //自荐帮主需要金钱
	CHANGE_NAME_MONEY: 500,    //改名价格 
}

// 宗族系统默认数值
let opFactionDefaultValue: any = {
	FACTION_ICON: 1,			 //默认帮派图标Id
	FACTION_LEVEL: 1,       //帮派初始等级
	FACTION_MAX_LEVEL: 10,      //帮派最高等级
	//BASE_MATERIAL         : 2000000, //帮派初始资金
	//BASE_SUM_MATERIAL     : 2000000, //帮派初始总资金
	//BASE_GOLD             : 0,       //帮派初始资材
	BASE_DEGREE: 0,    	 //帮派初始繁荣度(经验)
	//BASE_RENQI            : 0,    	 //帮派初始人气值
	//BASE_STUDY            : 2000,    //帮派初始研究力
	//BASE_SKILL_LEVEL      : 55,      //帮派技能初始等级
	//MAX_SKILL_LEVEL       : 120,     //帮派技能最高等级
	BASE_ALLOCACOUNT: 1,			 //帮派物品每日分配次数
	BASE_WARE_HOUSE_MAX: 150,		 //仓库的容量
	//DAY_DEGREE				 		: 0,			 //帮派每日经验
	//MAX_DAY_DEGREE				: 100,		 //帮派每日最大经验
	DAY_RENQI: 0,			 //帮派每日人气(上香)
	//MAX_DAY_RENQI					: 900,		 //帮派每日最大人气
	DAY_MAP_COUNT: 1,			 //帮派每日副本次数
	MAX_DAY_MAP_COUNT: 1,		 	 //帮派每日最大副本次数
	//MAX_ALLOCA_RECORD			: 100,		 //分配记录上限
	//MAX_BUY_RECORD				: 100,		 //军团物资购买记录
	//MAX_BUILD_LEVEL       : 5,       //军团建筑最大等级
	//DAY_ATTENDANCE        : 0,       //帮派每日总签到次数
}

//宗族记录
let opFactionNote: any = {
	CREATE: 1,           //创建宗族
	CHANGE_LEADER: 2,           //宗主职位转让
	SAVE_GOLD: 3,           //存入灵石
	LEAVE: 4,           //主动退出
	FIRE: 5,           //请离宗族

	ACKREWARD: 100,				 // 修改赏赐
}

// 宗族任务编号
let opFactionTaskId: any = {
	TASK_JIANSHE_SONGXIN: 2004001,			//建设送信任务
	TASK_JIANSHE_XUNLUO: 2004002,			//
	TASK_JIANSHE_ZHUOCHONG: 2004003,			//
	TASK_ZICAI_XUNWU: 2005001,			//资材寻物任务
	TASK_ZICAI_XUNLUO: 2005002,			//资材巡逻任务
	TASK_NINGXIN: 2026001,
	TASK_HUQI: 2027001,
}

// 宗族更新时间域索引
let opFactionUpdateTimeFieldIndex: any = {
	hour: 1,	// 小时
	minu: 2,	// 分钟
	wday: 3,	// 
	yday: 4,	// 
	sec: 5,	// 秒
	year: 6,	// 年
	isDst: 7,	// 
}

//宗族图标
let opFactionLogo: any = {
	LOGO1: 1,
	LOGO2: 2,
	LOGO3: 3,
	LOGO4: 4,
	LOGO5: 5,
	LOGO6: 6,
	LOGO7: 7,
	LOGO8: 8,
	LOGO9: 9,
}

//军团副本
// let ConfigFactionMap:any = {
// 	stageOneTime : 30*60,                      //一阶段持续时间(单人)
// 	stageTwoTime : 1*60,                       //二阶段持续时间(暴走预备)
// 	stageThreeTime : 3*60,                     //三阶段持续时间(暴走)
// 	bossTimeOut : 60,                          //开始暴走(哥布林第一次出现)时间间隔
//  bossAppearRandTime:any : {30, 30},             //哥布林出现时间间隔
// 	bossAppearTime = 6,                        //哥布林存在时间
// 	bossKillCount = 1,                         //击杀哥布林数量限制

// 	//buffs = {
// 	//	[1] : {index:1, last:300},
// 	//	[2] = {index:2, last:180},
// 	//	[3] = {index:3, last:300},
// 	//	[4] = {index:4, last:300},
// 	//	[5] = {index:5, last:300},
// 	//	[6] = {index:6, last:300},
// 	//}
// }

// //军团pve
// let opFactionPVEConfig:any = {
// 	minLevel : 5,            //开启等级
// 	rmbGold  : 0,            //消耗晶石
// 	fightCount : 3,          //每日可以挑战次数
// 	fightRecordCount : 5,    //战斗记录条数   
// 	bossFightCount : 100,    //boss战胜场次 
// 	rankCount : 10,          //排名人数
// 	bossTime : 15*60,        //boss时间间隔 
// 	openBossStar : 30,       //boss开启三星数量
// 	plrLevel : 60,           //60级才可以参加
// }
// let opFactionBuildConfig:any = {
// 	build_cangku : 1,			//仓库
// 	build_shitang : 2,		//食堂
// 	build_sushe : 3,			//宿舍
// 	build_liliang : 4,		//力量研究所
// 	build_minjie : 5,			//敏捷研究所
// 	build_yiliao : 6,			//医疗所
// 	maxDonateCount : 10 , //每日最大捐献次数
// 	perDonateAdd : 1 ,    //每次捐献提升建筑值
// }

//灵阵守卫
let opMatrixError: any = {
	OPEN_SUCCESS: 0,//成功
	OPEN_NO_FACTION: 1,//没有加入军团
	OPEN_NO_UNION: 2,//没有加入联盟
	OPEN_EXIST: 3,//已经开放了
	OPEN_NOT_LEADER: 4,//不是军团长
	OPEN_TOO_MUCH: 5,//本军团本周已经开过
	OPEN_MEMBER_OPEN_MUCH: 6,//成员军团已经开过
	OPEN_NOT_ENOUGH_RENQI: 7,//消耗每个军团700点人气
	OPEN_MEMBER_NOT_ENOUGH_RENQI: 8,//成员军团不够700点活人气
	OPEN_JOIN_TIME_LIMIT: 9,//加入军团时间不足七天
	PROMOTE_SUCCESS: 0, //提升成功
	PROMOTE_MAXT_LEVEL: 1,//福利机器已经到了最高级
	PROMOTE_COOLDOWN: 2,//隔10秒才可以操作一次
	PROMOTE_NOT_ENOUGH_GOLD: 3,//晶石不足
	PROMOTE_MTX_CLOSE: 4,//活动已经关闭
}

let opMatrixConfig: any = {
	retPointMapId: defaultValue.DEFAULT_MAP2,
	retPointX: 64,
	retPointY: 42,
	mapNum: 6,//多少个阵眼
	createBossTimeOut: 5,//打完小怪后，多后时间刷守卫者
	closeSelfTimeOut: 10,//打完守卫者之后，多长时间把玩家踢出
	closeMatrixTimeOut: 18000,//活动一共持续多长时间30分钟．为了测试暂时改为300分钟
	rankNum: 5,//排行输入前几名
	needRenqi: 500,//需要500点军团人气才可以开
	machineMaxLevel: 5,//福利机器最高到多少级
	promoteCooldown: 10,//１０秒后才可以再提升机器
	serverRankNum: 3,//全服军团排行奖励多少个
	//fightBossCooldownTime : 60,//打boss的cd时间

	//bossEntryId : 30000002, //boss entryId
	//bossFightPos : 2, //boss站2号位
	//bossHp : 2000000000,//boss血量
	//bossAttack : 99999999, //boss攻击
	//bossDefence : 4000, //boss护甲
	//
	//teacherEntryId : 30000002, //teacher entryId
	//teacherFightPos : 2, //teacher 站2号位
	//teacherHp : 2000000000,//teacher 血量
	//teacherAttack : 99999999, //teacher攻击
	//teacherDefence : 4000, //teacher 护甲		
	//teacherAppearTime:any : {5,10,15,20,25}//强化师刷新时间
}

//军团任务
let opFactionTaskConfig: any = {
	additionTaskLimit: 20, //额外任务池的大小
	releaseSpend: 200,     //发布任务需要消耗的晶石数
	dailyCountLimit: 4,    //玩家当天完成军团任务的次数限制
	taskCount: 6,          //军团技能的总数
}

let opFactionWarApply: any = {
	auto: 0,					//自动申请公会战
	cancel: 1,					//取消自动申请公会战

}


// let opFactionTask:any = { 
// 	facBuild : 15,
// 	timeLimit : 7*24*3600,
// 	statueNpcEntry : 11006,
// 	statueNpcMapId : defaultValue.DEFAULT_MAP2,//军棋NPC所在地图ID
//  statueNpcCoords:any : {180, 48},
//  fightEffect:any = {{0.15, 0.1},{0.1, 0.05},{0.05, 0.03}}
// }

// //公会任务建设
// let opFactionGroupTask:any = {
// 	[1] : {51510,20,20},
// 	[2] = {210,70,70},
// 	[3] = {1200,400,400},

// }




//帮会上香
let opFactionConfig = {

	RenqiFunds: 100,
	RenqiGold: 101,
	RenqiBindGold: 102,

	MaxActiveLevel: 10,
	CollectOneyKeyGold: 180, //收集一键完成元宝
	MonsterOneyKeyGold: 180, //小怪一键完成


}

//帮会地图任务
let opFactionMapTaskType: any = {
	Collect: 100, //帮会收集
	Monster: 101, //帮会打小怪
}

let opExchangItem: any = {
	item1: 100,	//左1
	item2: 101,
	item3: 102,	//左2
	item4: 103,
}


//帮会活跃任务
let opFactionActiveTaskType: any = {
	GUAIWU: "guaiwu", //帮会怪物
	SHOUGOU: "shougou",//收购
	SHANGXIANG: "shangxiang",//上香
	FUBEN: "fuben",//副本
	XIAOGUAI: "xiaoguai",//小怪
	CAIJI: "caiji",//采集
}

//创建帮会需要元宝
let opCreateNeedMoney: any = {
	POOR: 2080,    //普通创建
	RICH: 2800,   //豪华创建
}

//创建帮会需要VIP等级
let opCreateNeedVIP: any = {
	POOR: 4,    //普通创建
	RICH: 7,   //豪华创建
}

//帮会记录
let opFacRecord: any = {
	Join: 100,	//加入
	Kick: 101,	//踢出
	Exit: 102,	//退出
	LevelUP: 103,	//升级
	Appoinit: 104,	//任命
	Fire: 105,			//降职
}

let opFactionSet: any = {
	autoAddMember: 0x1,
	autoApplyFactionWar: 0x2,
	autoInvite: 0x4,
}
