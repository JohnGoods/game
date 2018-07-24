// TypeScript file
////
//角色
let cellOptionsIndex:any = {
	Hero : 1,//主角
	HeroEquip : 2, //主角装备
	HeroSkill : 3, //主角技能
	HeroRide : 4, //主角坐骑
	HeroWing : 5, //主角翅膀
	Pet : 6, //宠物
	PetSkill : 7,//宠物技能
	PetTongLin : 8,//宠物通灵
	PetSouHun : 9,//宠物兽魂
	XianLv : 10,//仙侣
	XianLvStart : 11,//仙侣升星
	XianLvFaZhen : 12,//仙侣法阵
	XianLvXianWei : 13,//仙侣仙位
	TianXian : 14,//天仙
	TianXianWeapon : 15,//天仙神兵
	TianXianDanYao : 16,//天仙丹药
	TianXianJingMai : 17,//天仙经脉
	TianNv : 18,//天女
	TianNvXianQi : 19,//天女仙器
	TianNvHuaNian : 20,//天女花辇
	TianNvLingQi : 21,//天女灵气
	EquipForge	: 23, //装备锻造
	XiYouLiLlian : 24, //西游历练
	Hourse : 25,	//结婚房子
	HeroTalisman : 26, //法宝
	GodEquip : 27,	//神装共鸣
	GoldEquip : 28,	//金装套装
	FashionType  : 29, //皮肤套装
	GodEquipLevel : 30, //神装等级共鸣
	XianLvQiYuan : 31, //仙侣奇缘
	RoleEquipSkill : 32, //首冲武器技能
	PetFly : 33,	//宠物飞升
}

let cellOptionsName:any = [
	"Hero",// : 1,//主角
	"HeroEquip",// : 2, //主角装备
	"HeroSkill",// : 3, //主角技能
	"HeroRide",// : 4, //主角坐骑
	"HeroWing",// : 5, //主角翅膀
	"Pet",// : 6, //宠物
	"PetSkill",// : 7,//宠物技能
	"PetTongLin",// : 8,//宠物通灵
	"PetSouHun",// : 9,//宠物兽魂
	"XianLv",// : 10,//仙侣
	"XianLvStart",// : 11,//仙侣升星
	"XianLvFaZhen",// : 12,//仙侣法阵
	"XianLvXianWei",// : 13,//仙侣仙位
	"TianXian",// : 14,//天仙
	"TianXianWeapon",// : 15,//天仙神兵
	"TianXianDanYao",// : 16,//天仙丹药
	"TianXianJingMai",// : 17,//天仙经脉
	"TianNv",// : 18,//天女
	"TianNvXianQi",// : 19,//天女仙器
	"TianNvHuaNian",// : 20,//天女花辇
	"TianNvLingQi",// : 21,//天女灵气
	"FactionSkill",// : 22, 帮派技能
	"EquipForge",//	: 23, //装备锻造
	"XiYouLiLlian",// : 24, //西游历练
	"Hourse",//:25, 结婚房子
	"HeroTalisman", //:26, 法宝
	"GodEquip",	//:27，神装共鸣
	"GoldEquip", //: 28,	金装套装
	"FashionType",  //: 29, 皮肤套装
	"GodEquipLevel", //:30, 神装等级共鸣
	"XianLvQiYuan ", //:31, 仙侣奇缘
	"RoleEquipSkill", //: 32, //首冲武器技能
	"PetFly", //: 33,	//宠物飞升
]

let RoleEquipResonateIndex : any = {
	GodEquip : 1,		//神装
	DaHuaXianzi : 2,	//大话仙子
	HaiZhiLanJing : 3,		//海之蓝鲸
	ZidianQingShuang : 4, //紫电清霜
	JiZhiBanLv : 5,			//机智斑驴
	BiYiSuanFei : 6,			//比翼双飞
}

let RoleEquipResonateName: any = [
	"GodEquip",				//神装
	"DaHuaXianzi",			//大话仙子  
	"HaiZhiLanJing",		//海之蓝鲸
	"ZidianQingShuang",     //紫电清霜
	"JiZhiBanLv",			//机智斑驴
	"BiYiSuanFei",		    //比翼双飞
]

//法宝
let elemTalismanConfig: any = {
	['ordinaryItem1'] : 60074,
	['ordinaryItem2'] : 60075,
	['perfectItem'] : 60008,
	['reachCount'] : 20,				//打造20次
	['needMoney']  : 100,    //购买需要
	['createShopType']  : 1,			
	['createShopIndex'] : 21,    //锻造自动购买需要的物品
	['upShopType'] : 2,
	['upShopIndex'] : 15,						//升级自动购买需要的物品
	['unbindLevelOne']:120,					//位置解锁等级
	['unbindLevelTwo']:135,
	['unbindLevelThree']:150,
	['unbindLevelFour']:165,
	['unbindVipTwo']:8,					//vip解锁等级
	['unbindVipThree']:9,
	['unbindVipFour']:10,
	['needCount'] : 1,
	['maxUpLevel'] : 50,        //法宝最大等级
	
}

let RoleEquipResonateIcon  : any = {
	[RoleEquipResonateIndex.DaHuaXianzi] : "tz_Bt01",
	[RoleEquipResonateIndex.HaiZhiLanJing] : "tz_Bt02",
	[RoleEquipResonateIndex.ZidianQingShuang] : "tz_Bt03",
	[RoleEquipResonateIndex.JiZhiBanLv] : "tz_Bt04",
	[RoleEquipResonateIndex.BiYiSuanFei] : "tz_Bt05",
}

let tempCellList:any = [
	cellOptionsIndex.HeroRide,//主角坐骑
	cellOptionsIndex.HeroWing,//主角翅膀
	cellOptionsIndex.PetTongLin,//宠物通灵
	cellOptionsIndex.PetSouHun,//宠物兽魂
	cellOptionsIndex.XianLvFaZhen,//仙侣法阵
	cellOptionsIndex.XianLvXianWei,//仙侣仙位
	cellOptionsIndex.TianXian,//天仙
	cellOptionsIndex.TianXianWeapon,//天仙神兵
	//cellOptionsIndex.TianNvHuaNian,//天女花辇
	//cellOptionsIndex.TianNvLingQi,//天女灵气
]

let simpleCellList = [
	cellOptionsIndex.TianXianDanYao, //天仙丹药
	cellOptionsIndex.TianXianJingMai,//天仙经脉
]

let funOptionsIndex:any = {
	ShowIndex : 1,//外形显示//
	UpgradeStage : 2,//升阶
	SkillCase : 3,//技能栏//-
	EquipCase : 4,//装备栏//-
	AbilityDrug : 5,//属性丹
	Skip : 6,//皮肤//
	Shape : 7,//外形//
	GrowAdd : 8,//资质//
	UpStart : 9,//升星//
	WashSkill : 10,//技能洗练//
	CombatPos : 11, //出战位置
}


let shopTradeConditionIndex = {
	playerLevel : 2, //等级
	factionLevel : 3,   //帮派条件
	SmallThunderTemple : 4, //雷音寺
	Champion : 5,   //竞技场历史排行
	HUSONG : 6,  //护送条件
	DATI : 7,  //答题次数
	PersonBoss : 8, //个人BOSS
	WorldPlayerBoss :9,  //全民BOSS
	LifeAndDeathBoss : 10, //生死却次数
	MaterialBoss : 11, //材料副本
	diyi         : 12, //第一积分
}

let funOptionsName:any = [
	"ShowIndex",// : 1,
	"UpgradeStage",// : 2,
	"SkillCase",// : 3,
	"EquipCase",// : 4,
	"AbilityDrug",// : 5,
	"Skip",// : 6,
	"Shape",// : 7,
	"GrowAdd",// : 8,
	"UpStart",// : 9,
	"WashSkill",// : 10,
	"CombatPos",// : 11, //出战位置
]


//升阶
let elemUpgradeStageOptions:any = {
//['csv'] : csv.FunUpgradeStage,
//最高等级 ，扣资源的标志
[cellOptionsIndex.HeroRide] : {['MaxLevel'] : 6},//主角坐骑 
[cellOptionsIndex.HeroWing] : {['MaxLevel'] : 6},//主角翅膀 

[cellOptionsIndex.XianLv] : {['MaxLevel'] : 15},//仙侣 
[cellOptionsIndex.XianLvStart] : {['MaxLevel'] : 7},//仙侣升星

[cellOptionsIndex.TianXianJingMai] : {['MaxLevel'] : 100, ['maxSelect'] : 11},//天仙经脉
}

//装备栏//-
let elemEquipCaseElemConfig:any = {
//['csv'] : csv.FunEquipCase,
//有多少个部位// 
[cellOptionsIndex.HeroEquip] : {['MaxNum'] : 10},
[cellOptionsIndex.HeroRide] : {['MaxNum'] : 4},
}

//技能栏//-
let elemSkillCaseElemConfig:any = {
//['csv'] : csv.FunSkillCase,
//有多少个部位////最高等级
[cellOptionsIndex.HeroWing] : {['MaxNum'] : 4, ['MaxLevel'] : 40},
[cellOptionsIndex.HeroRide] : {['MaxNum'] : 4, ['MaxLevel'] : 40},
}

//属性丹
let elemAbilityDrugOptions:any = {
//['csv'] : csv.FunAbilityDrug,
//最高用多少个
[cellOptionsIndex.HeroWing] : {['MaxLevel'] : 500},
[cellOptionsIndex.HeroRide] : {['MaxLevel'] : 500},
['def'] : {['MaxLevel'] : 500},
}

//皮肤//
let elemSkipOptions:any = {
//['csv'] : csv.FunSkin,
//最高用多少个
[cellOptionsIndex.HeroWing] : {['MaxNum'] : 10},
[cellOptionsIndex.HeroRide] : {['MaxNum'] : 10},

}

//外形//
let elemShapeOptions:any = {
//['csv'] : csv.FunShape,
//最高用多少个
[cellOptionsIndex.HeroWing] : {['MaxNum'] : 10},
[cellOptionsIndex.HeroRide] : {['MaxNum'] : 10},

}

//-技能圈////-
let elemSkillLoopOptions:any = {
//['csv'] : csv.FunSpendMoneyItem,
//最高用多少个
[cellOptionsIndex.HeroSkill] : {['MaxNum'] : 8, ['MaxLevel'] : 100, ['UnlockLevel'] : [1, 3, 12, 20, 33,10000,10001,10002]}
}

//-经验盒子////-
let elemExpCaseOptions:any = {
//['csv'] = csv.FunSpendMoneyItem,
//最高用多少个
[cellOptionsIndex.Hero] : {['AutoLevel'] : 79, ['MaxLevel'] : 300}
}

//宠物资质提升//
let elemGrowAddOptions:any = {
//['csv'] : csv.FunGrowAdd,
}
//仙侣升星//
let elemUpStartOptions:any = {
//['csv'] : csv.FunUpStart,
//最高用多少个
[cellOptionsIndex.XianLvStart] : {['MaxNum'] : 6}
}

//宠物技能洗练//
let elemWashSkillOptions:any = {
//['csv'] : csv.FunSkillWash,
//洗练星级最多7级，当洗200次是升为2级，当洗500次时升为3级..+//锁定一个技能需要50元宝，锁定两个需要70...+
[cellOptionsIndex.PetSkill] : {['MaxNum'] : 6, ['HighAddNum'] : 10, ['MaxStart'] : 7, ['MaxWashNum'] : 30000, ['StartArea'] : [200, 500, 1000, 1500, 2500, 4000, 30000], ['LockSpend'] : [40,70,150,280,480]}
}


//铸造功能//////
let elemForgeNames = [
	'qianghua',//强化
	'jinglian',//精炼
	'duanlian',//锻炼
	'baoshi',//宝石
]

let elemForgeIndexs:any = {
	['qianghua'] : 1,//强化
	['jinglian'] : 2,//精炼
	['duanlian'] : 3,//锻炼
	['baoshi'] : 4,//宝石
}

// let elemForgeOptions:any = {
//  PartNum:any : {10, 10, 10, 10},//每个玩法有10个升级部分
// }

//天下第一
let peerlessOptions  = {
	round_sixteen : 11, //16强
	round_eight :12, //8强
	round_four : 13, //半决赛
	round_two : 14, //决赛
	round_one : 15, //冠军
}
//晋级次数
let peerlessWinNum  = {
	[peerlessOptions.round_sixteen] : 0,
	[peerlessOptions.round_eight]   : 1,
	[peerlessOptions.round_four]    : 2,
	[peerlessOptions.round_two]     : 3,
	[peerlessOptions.round_one]     : 4,
}
