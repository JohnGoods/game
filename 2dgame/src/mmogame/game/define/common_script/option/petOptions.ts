////////////////////////////////////////////////////////////////////////////////
//部下配置
////////////////////////////////////////////////////////////////////////////////

let HeroConfig:any = {
	MAX_LEVEL : 60,       //等级上限
	MAX_BREAK : 5,        //部下突破上限
	MAX_LINK : 5,         //部下羁绊上限
	MAX_AWAKE : 5,	      //部下觉醒上限
	MAX_SKILL_LEVEL : 30, //最大技能等级(包括装备特效提升,实际升级上限根据技能升级表单控制)
	MAX_QUALITY_LEVEL : 3,//最大品质阶等级
}

let petBreakRatio:any = [
	1,//0级//
	1.25,//1级//
	1.55,//2级//
	1.93,//3级//
	2.4,//4级//
	3//5级//
]


let opBreakError:any = {
	Success : 0,
	EntryIdNotFound : 1,//找不到对应的ID////-
	SoulZero : 2, //没有提交碎魂//-
	ExpItemListNotEnough : 3, //提交的物品不对//
	SoulNotEnough : 4,//提交的碎魂物品不足//-
	LevelNotRight : 5,//突破的等级不对
	MaxLevel : 6, //已经是最大冲突等级
}

// 技能种类
//petSkillType = 
//{	
//	NORMAL	: 1,	// 普通技能
//	EQUIP		: 2,	// 装备技能
//	SOULP		: 3,	// 觉醒技能
//}

// 宠物状态(state)
let petState:any = {
	UNBIND	   : 0x0001,     //非绑定状态
	BIND	     : 0x0002,     //绑定状态
	EMPLOYNO   : 0x0004,     //没有雇佣关系
	EMPLOYIN   : 0x0008,     //雇佣进来
	EMPLOYOUT  : 0x0010,     //雇佣出去
	CONTROL		 : 0x0020,		 //受到控制的
}

//宠物类型
let opPetType:any = {
	Priest 			: 1,			//牧师
	Warrior     : 2,			//战士
	Mage 			  : 3,			//法师
	Rogue       : 4,      //刺客
}

// 宠物品质
let opPetQuality:any = {
	gray	  : 1,		  // 灰色
	green     : 2,        // 绿色
	blue      : 3,        // 蓝色
	purple    : 4,        // 紫色
	gold      : 5,        // 金色
	red       : 6,        // 红色
	color	  : 7,		  // 彩色
}

//宠物上阵
let opPetCombatPos: any = {
	Rest:0,//休息
	Battle:1,//出战中
	Prepare1:2,//备战1
	Prepare2:3,//备战2
}

let opPetRange: any = {
	Pet: 20000, //宠物
	XianLv: 17000, //仙侣
}

//亲密度事件配置
let opIntimateEvent:any = {
	OnlineTime : 15*60,					// 需要在线时间
	Interval	 : 30*60,					// 触发时间间隔(分钟)
	Rate 			 : 0.3,						// 触发的概率
}

//推送事件配置
let opPushEvent:any = {
	OnlineTime : 300,					// 需要在线时间
	Interval	 : 300,					// 触发时间间隔(秒钟)
	LimitCount : 10,					// 限制次数
	plrLevel	 : 20,					// 角色等级
}

//突发事件配置
let opBurstEvent:any = {
	OnlineTime : 300,					// 需要在线时间
	Interval	 : 300,					// 触发时间间隔(秒钟)
	LimitCount : 3,						// 每只宠物限制三次
	totallCount: 10,					// 每天总共
	plrLevel	 : 20,					// 角色等级
}

//互动金币消耗品质系数
let opInteractQualityRate:any = {
	[opPetQuality.gray] 	: 0.5,
	[opPetQuality.green] 	: 1,
	[opPetQuality.blue] 	: 5,
	[opPetQuality.purple] : 8,
	[opPetQuality.gold] 	: 10,
}

//宠物经验类型
let opPetExpType:any = {
	Normal			: 	1,		 //普通
	Task				: 	2,		 //任务
	Activity		:		3,		 //活动
	Campaign		: 	4,		 //关卡
	Prize				: 	5,		 //奖励(福利奖励)
	Other				:		6,		 //其他
}

//升级所需经验系数
//opPetLevelUpRatio = 
//{
//	[opPetQuality.gray] 		: 	1,	// 灰色 
//	[opPetQuality.green] 		: 	1,  // 绿色 
//	[opPetQuality.blue]	 		: 	1,  // 蓝色 
//	[opPetQuality.purple] 		: 	2,  // 紫色 
//	[opPetQuality.gold] 		: 	4,  // 金色 
//}

//魔导石槽位状态
let opPetMagicStoneStatus:any = {
	UnActive			:		0,	//没有开启	
	Active				: 	1,	//开启未装备
//Fited					:		ItemEntryId,	//开启且装备
}

//部下魄力
let opPetCourageConfig:any = {
	needLevel : 60,
	qualityMaxLevel : 5,
	levelMaxLevel : 30,
	rateItemCount : 1,
	rateItemEntryId : 40315,
	addRate : 0.5,
}

//部下传承配置
let opPetInheritConfig:any = {
	plrLevel : 30,
}

//部下专精
let opPetEssenceConfig:any = {
	plrLevel   : 60,
	petLevel   : 60,
	resetGold  : 50,
}

//部下专精操作类型
let opPetEssenceOperateType:any = {
	addAbility     : 1,  //增加属性
	decAbility     : 2,  //减少属性
}

//伙伴品质
let opPetQualityLevel:any = {
	Normal   :   0,   //普通
	Legend   :   1,   //传奇
	Fiend    :   2,   //魔王
	Epic     :   3,   //史诗
}

//伙伴品质 //{碎魂数, 抽奖次数}
let opPetQualityToSoulAndLottery:any = {
	[opPetQualityLevel.Normal]   :   [45,  18],    //普通
	[opPetQualityLevel.Legend]   :   [45,  18],    //传奇
	[opPetQualityLevel.Fiend]    :   [45,  18],    //魔王
	[opPetQualityLevel.Epic]     :   [45,  18],    //史诗
}

//哈迪斯
let opSpecialPet:any = [18016,18019,18020,18021]

//////////////////////////-精灵////////////////////////
let opFairyState:any = {
	follow     : 0x0001,
	unfollow   : 0x0002,
	fight      : 0x0004,
	unfight    : 0x0010,
}

//精灵配置
let opFairyConfig:any = {
	MaxLevel                 : 10,
	NormalDevelopRate        : 0.875,
	SmallDevelopRate         : 0.1,
	SeniorDevelopRate        : 0.025,
	NormalDevelopRatio       : 1,
	SmallDevelopRatio        : 3,
	SeniorDevelopRatio       : 10,
	ReformGold               : 20,
	pearlMaxLevel            : 10,
}

//培养液对应的暴击率
let opDevelopItemToDevelopRate:any = {
	[40125]   : opFairyConfig.NormalDevelopRate,
	[40126]   : opFairyConfig.SeniorDevelopRate,
}

//培养液对应的暴击系数
let opDevelopItemToDevelopRatio:any = {
	[40125]   : opFairyConfig.NormalDevelopRatio,
	[40126]   : opFairyConfig.SeniorDevelopRatio,
}

//精灵技能位置对应的灵珠条件
let opFairySkillIndexCond:any = {
	[6]   : 7,            //第6个孔需要所有灵珠达到2级解锁
	[7]   : 10,           //第7个孔需要所有灵珠达到2级解锁
	[8]   : true,         //第8个孔需要后续解锁
	[9]   : true,         //第9个孔需要后续解锁
	[10]  : true,         //第10个孔需要后续解锁
}


////////////////////-翅膀////////////////////////
//翅膀状态
let opWingState:any = {
	On     : 0x0001,
	Off    : 0x0002,
}

//翅膀配置
let opWingConfig:any = {
	MaxLevel                 : 20,
	ModelUnlockVip           : 2,
	ModelOnVip               : 0,
	DefaultModel             : 90057,
	Active                   : 1,
	UnActive                 : 0,
	ActiveItemList : [70017,5],
	ReviseParamModelId       : 90065,
	SkillHole                : 6,
	skillBookLib             : 200,
	skillBookLibEnergy       : 200,
	skillBookLotteryRmb      : 200,
	skillBookLotteryEnergy   : 200,
	NormalSkillPosCount      : 4,
	SeniorSkillPosCount      : 6,
	specialSkill : [800001,800004,800005,800010],
	MaxRefiningLevel         : 10,
	RefineVisibleLevel       : 30,
	RefineEnable             : 75,
}

let opWingUnlockType:any = {
	image    : 1,             //外观
	level    : 2,             //等阶
	item     : 3,             //道具
}

//每次增加的祝福值
//opWingFaileBlessValue = 
//{
//	{0, 20, 75},
//	{3, 6, 75},
//	{7, 9, 75},
//}

//翅膀技能类型
let opWingSkillType:any = {
	base         : 1,         //基础技能
	normal       : 2,         //万能技能
	senior       : 3,         //奥义技能
}

//翅膀技能孔类型
let opWingSkillHoleType:any = {
	normal       : 1,         //普通技能孔
	senior       : 2,         //奥义技能孔
}

//翅膀技能植入方式
let opWingSkillImplantType:any = {
	skill         : 1,      //技能植入
	item          : 2,      //技能书植入
}

let opWingSkillBookLotteryType:any = {
	rmbGold   :   1,     //晶石抽奖
	energy    :   2,     //能量抽奖
}

let opWingSkillBookLib:any = {
	rmbGold   :   1,     //晶石刷新
	energy    :   2,     //能量刷新
}

let opWingSkillColor:any = {
	gold      :   103,     //金色技能
	bule      :   102,     //蓝色技能
	green     :   101,     //绿色技能
}

let opWingSkillLotteryDisCount:any = {
	[1]     : 1,  //
	[10]    : 1, 
}

//图腾配置
let opWingTotemConfig:any = {
	resetGold   : 1000, //重置晶石
	openLevel   : 45,   //开放等级
	maxQuality  : 6,    //最大品阶
	maxLevel    : 60,   //最高等级 
}

//图腾品质
let opWingTotemQuality:any = {
	gray     : 1, //灰色
	green    : 2, //绿色
	blue     : 3, //蓝色
	purple   : 4, //紫色
	gold     : 5, //金色
	colour   : 6, //彩色
}

//品质对应最高等级
let opWingTotemQualityToMaxLevel:any = {
	[opWingTotemQuality.gray]    : 10,
	[opWingTotemQuality.green]   : 20,
	[opWingTotemQuality.blue]    : 30,
	[opWingTotemQuality.purple]  : 40,
	[opWingTotemQuality.gold]    : 50,
	[opWingTotemQuality.colour]  : 60,
}

let opWingDevelopType:any = {
	ONCE  : 0,      //单次升级
	ALL   : 1,      //一键升级
}
////////////////////-坐骑////////////////////////
//自动喂养
let opRideAutoFeed:any = {
	needItem : [40526, 1]
}

//工会坐骑
let opFactionRideEntryId = 60000
let opFactionRideItemEntryId = 40102

////////-进化石相关//////-

//不能进化列表
let opNotDevelopQuality:any = {	
	[18008] : true,
	//[18015] : true,
	//[18016]	: true,
	//[18019] : true,
	//[18020] : true,
	//[18021] : true,
}

//进化石
let evolutionaryStone:any = {
	changEStone      : 40029,
	haDiSiStone      : 40028,
	aBoLuoStone      : 40081,
	normalStone      : 40095,
	weinasiStone     : 40100,
	keluonuosiStone  : 40103,
}

//-神兵系统//////

let opImmortalsState:any = {
	On     : 0x0001,
	Off    : 0x0002,
}


//神兵配置
let opImmortalsConfig:any = {
	entryId             : 20000,
	maxLevel            : 10,
	notWearEntryId      : 40004,
	quenchValueRatio    : 100,
	freeExperLevel      : 1,
	freeExperTime       : 10*60,
	freeExperCampId     : 1027,
}