////////////////////////////////////////////////////////////////////////////////
//装备配置
////////////////////////////////////////////////////////////////////////////////

////////宠物装备//////////////////-
//////////////////////////////////-
let opPetEquipConfig:any = {
	MaxEnhanceLevel     : 10,  //最大强化等级
	SplitNeedRmbGold    : 0,   //分解装备需要的晶石
	SplitRatio          : 0.7, //分解返回的比例
	LockNeedGold        : 50,  //洗练锁定所需晶石
	PromoteMaxLevel     : 10,  //精炼最大等级
	PromoteEnhanceLevel : 50,  //精炼所需要强化等级
	MaxLevel            : 10,  //最大等级
	EquipResonateNum    : 6,   //装备共鸣数量
	IdentifyCount       : 3,   //鉴定次数
	StoneResonateNum    : 3,   //宝石共鸣数量
}

//宠物装备格子位置对应的装备
let opPetEquipPosIndex:any = {
	[1] : "weapon",     // 武器
	[2] : "cap",        // 头盔
	[3] : "cloth",      // 铠甲
	[4] : "mask",       // 戒指
	[5] : "neck",       // 项链
	[6] : "shoes",      // 腰带
}

// 装备类型对应的位置索引
let opEquipTypeToIndex:any = {
	[opItemType.ITEM_TYPE_WEAPON] : 1,  //武器
	[opItemType.ITEM_TYPE_CAP]    : 2,  //头盔
	[opItemType.ITEM_TYPE_CLOTH]  : 3,  //衣服
	[opItemType.ITEM_TYPE_MASK]   : 4,  //戒指
	[opItemType.ITEM_TYPE_NECK]   : 5,  //项链
	[opItemType.ITEM_TYPE_SHOE]   : 6,  //腰带
}

//装备品质
let opEquipQuality : any ={
	gray	  : 1,		  // 灰色
	green     : 2,        // 绿色
	blue      : 3,        // 蓝色
	purple    : 4,        // 紫色
	gold      : 5,        // 金色
	red       : 6,        // 红色
	color	  : 7,		  // 彩色
}

//
let configColorToQuality:any = {
	['gray']  : opEquipQuality.gray,
	['green']  : opEquipQuality.green,
	['blue']   : opEquipQuality.blue,
	['purple']   : opEquipQuality.purple,
	['gold'] : opEquipQuality.gold,
	['red'] : opEquipQuality.red,
	['color'] : opEquipQuality.color,
}

//法宝位置范围
let opTalismanEquipPos = 
{
	begin  :  11,        //开始位置
	end    :  14,        //结束位置
}

//法宝解锁等级
let opTailsmanPosLimit = {
	['levelUnLockList'] : [120, 135, 150, 165], ['VIPUnLockList'] : [7, 8, 9, 10]
}
//装备收购系数
//opEquipBuyRatio = 
//{
//	[opEquipQuality.White]   : 1,      //灰色装备
//	[opEquipQuality.Green]   : 1.5,    //绿色装备	
//	[opEquipQuality.Blue]    : 2,      //蓝色装备
//	[opEquipQuality.Gold]    : 3,      //金色装备
//	[opEquipQuality.Orange]  : 3,      //套装(备用)
//}

let opLegendEquipStar:any = {
	Normal   : 1,  //[0, 1]    装备等级
	Senior   : 2,  //[2, 15]   装备等级
	Precious : 3,  //[16,30]   装备等级
	Holy     : 4,  //[31,45]   装备等级
	Ultimate : 5,  //[46,60]   装备等级
}

let opEquipStarToQuality:any = {
	[opLegendEquipStar.Normal]     :     opEquipQuality.White,
	[opLegendEquipStar.Senior]     :     opEquipQuality.Green,
	[opLegendEquipStar.Precious]   :     opEquipQuality.Blue,
	[opLegendEquipStar.Holy]       :     opEquipQuality.Gold,
	[opLegendEquipStar.Ultimate]   :     opEquipQuality.Orange,
}

//评分系数
// let opLegendEquipScoreRatio:any = {
// 	[opLegendEquipStar.Normal]       : 0.5,
// 	[opLegendEquipStar.Senior]       : 1,
// 	[opLegendEquipStar.Precious]     : 1.5,
// 	[opLegendEquipStar.Holy]         : 2,
// 	[opLegendEquipStar.Ultimate]     : 2.5,
// }

//装备保存索引
let opEquipBuildConfig:any = {
	baseFactorValue   : 1, //主属性
	lastFactorValue   : 2, //附加属性
	specialEffect     : 3, //特效
}

//特技分类索引
let opSpecialEffectIndex:any = {
	skill : 1,              //技能
	attri : 2,              //属性
}

let opSpeicalSkillId:any = {
	IgnoreUseLevel : 600169,                //无视使用等级特效
	upSkillLevel   : 600180,                //提升某个技能格的技能等级
	splitRatio     : 600175,                //分解系数改变
}

//鉴定生成特殊属性概率
let opSpecialBuildRate:any = {
	Normal    : 0.25,              //普通
	Exquisite : 0.5,               //精致
}

//属性操作
let opEquipRebuildOperate:any = {
	Cast    : 1, //重塑
	Refine  : 2, //洗练
	Enhance : 3, //强化
	Skill   : 4, //特技重铸
}

//重塑消耗晶石
let opEquipCastNeedRmb = 20

//装备类型对应的名字
let opEquipTypeToName:any = {
    [opItemType.ITEM_TYPE_WEAPON] : "weapon",
    [opItemType.ITEM_TYPE_CLOTH]  : "cloth",
    [opItemType.ITEM_TYPE_CAP]    : "cap",
    [opItemType.ITEM_TYPE_SHOE]   : "shoe",
    [opItemType.ITEM_TYPE_NECK]   : "neck",
    [opItemType.ITEM_TYPE_MASK]   : "mask",
}

//多件装备共鸣所需要的装备数量


//装备共鸣类型
let opEquipResonateType:any = {
	resonateLevel        : 1,   //等级共鸣
	resonateStone        : 2,   //宝石共鸣(三个)
	//resonatePromote      : 5,   //改造共鸣
	//resonateSuit         : 6,   //套装共鸣
	//resonateStoneEx      : 7,   //宝石共鸣(六个)
	//resonateLevel        : 8,   //等级共鸣
}

//装备宝石基本配置
let opEquipStoneConfig:any = {
	MaxLevel   : 12,              //最高等级
	OffRmbGold   : 10,            //卸载需要晶石
	StrengthStar : 5,             //需要加星等级
	EnhanceLevel : 60,            //需要强化等级
	StoneResonateNum : 3,         //共鸣数量
	StoneResonateMinLevel : 3,    //共鸣最小等级
}

//装备品阶对应的宝石孔数
let opEquipStarToStoneCount:any = {
	//[opLegendEquipStar.Normal]   : 1,  //紫装
	//[opLegendEquipStar.Senior]   : 2,  //金装
	//[opLegendEquipStar.Precious] : 7,  //彩装
	//[opLegendEquipStar.Holy]     : 7,  //圣装
	//[opLegendEquipStar.Ultimate] : 7,  //圣装
}

//装备融合配置
let opEquipFuseConfig:any = {
	EnhancLevel  : 80,
	StarLevel    : 10,
	EquipStar    : opLegendEquipStar.Holy,
	promateIndex : 4,
}

//鉴定消耗晶石
let opEquipIdentifyConfig:any = {
	[opLegendEquipStar.Precious]  : 200,
	[opLegendEquipStar.Holy]      : 200,
	[opLegendEquipStar.Ultimate]  : 200,
}

//一键强化每个阶段的等级
let opEquipEnhanceStage:any = {
	One    :     6,   //第一阶段小于6级
	Two    :     7,   //第二阶段小于7级
	Three  :     10,  //第三阶段小于10级
}

//主属性计算公式(当前值)
//随机系数*基础值*词库等级修正 * (1 + 强化修正*强化系数)
function calcEquipBaseAtrri(baseWord, baseFactor, baseValue, enhanceRevise, enhanceAddRatio, levelRevise){
	let fieldIndex = abilityNameToIndex[baseWord]
	if(! fieldIndex ){
		return
	}
	let calcFinalValue = baseFactor*baseValue*levelRevise * (1 + enhanceRevise*enhanceAddRatio)
	calcFinalValue = tonumber(String.format("%.4f", calcFinalValue))
	return [fieldIndex, calcFinalValue]
}

//附加属性计算公式
//随即系数 * 基础值 * 词库等级修正
function calcEquipLastAttri(lastWord, lastFactor, lastValue, enhanceRevise, enhanceAddRatio, levelRevise){
	let fieldIndex = abilityNameToIndex[lastWord]
	if(! fieldIndex ){
		return
	}
	let calcFinalValue = lastFactor * lastValue * levelRevise
	calcFinalValue = tonumber(String.format("%.4f", calcFinalValue))
	return [fieldIndex, calcFinalValue]
}

//暴击率/抗爆率
//暴击率=(攻击者暴击-受击者抗暴)/(1.02^(目标等级-1)*300+50)
function calcCriticalOrOpposeCriticalRate(criticalValueOrOpposeValue, level){
	return (criticalValueOrOpposeValue-0) / (Math.pow(1.02, level-1)*300+50)
}

//基本命中率 (角色基础命中率+命中值/(1.02^(角色等级-1)*450+75))
//基本命中率=命中值/(1.02^(被攻击目标等级-1)*450+75)
function calcDisplayHitRate(hitValue, level){
	if(hitValue <= 0 ){
		return 0
	}
	let baseHitRate = 1
	let hitRate = 1 + hitValue/(Math.pow(1.02, level-1)*450+75)
	return hitRate
}

//基本闪避率
//基本闪避率=闪避值/(1.02^(角色等级-1)*450+75)
function calcDisplayMissRate(dodgeValue, level){
	if(dodgeValue <= 0 ){
		return 0
	}
	
	let dodgeRate = dodgeValue/(Math.pow(1.02, level-1)*450+75)
	dodgeRate = Math.max(0, dodgeRate)
	return dodgeRate
}
////////////////////////-精灵装备//////////////////////
//类型对应装备位置
let opFairyEquipTypeToIndex:any = {
	[opItemType.ITEM_TYPE_FAIRY_CAP]    : 1,
	[opItemType.ITEM_TYPE_FAIRY_WEAPON] : 2,
	[opItemType.ITEM_TYPE_FAIRY_CLOTH]  : 3,
	[opItemType.ITEM_TYPE_FAIRY_SHOE]   : 4,
}

let opFairyEquipConfig:any = {
	PromoteMaxLevel : 10,  //精炼等级
}

let opFairyEquipQuality:any = {
	Normal		: 1,  //普通传奇
	Senior		: 2,  //超凡传奇
	Precious	: 3,  //至尊传奇
}

let opFairyExchangeConfig:any = {
	Powder     : 1,      //粉末兑换
	RMB        : 2,      //晶石兑换
	needRMB    : 450,    //晶石消耗
	needPowder : 60000,  //粉末消耗
}

////////////////////////-坐骑装备//////////////////////
//类型对应装备位置
let opRideEquipTypeToIndex:any = {
	[opItemType.ITEM_TYPE_RIDE_CAP]    : 1,
	[opItemType.ITEM_TYPE_RIDE_WEAPON] : 2,
	[opItemType.ITEM_TYPE_RIDE_CLOTH]  : 3,
	[opItemType.ITEM_TYPE_RIDE_SHOE]   : 4,
}

let opRideEquipConfig:any = {
	PromoteMaxLevel : 10,  //精炼等级
}

let opRideEquipQuality:any = {
	Normal   : 1,  //普通传奇
	Senior   : 2,  //超凡传奇
	Precious : 3,  //至尊传奇
}

let opRideExchangeConfig:any = {
	Powder     : 1,       //粉末兑换
	RMB        : 2,       //晶石兑换
	needRMB    : 450,     //晶石消耗
	needPowder : 60000,   //粉末消耗
}
