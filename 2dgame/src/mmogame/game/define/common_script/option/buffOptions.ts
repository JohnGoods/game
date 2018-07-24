
//每一类的effect要实现的接口
var buffEffectFunOptions:any = {
	
	//伤害与暴击
	immunizeDamage							:		11,//受击时伤害免疫
	unableDamage								:		12,//攻击时无法造成伤害
	acceptDamageAddition				:		13,//作为受到的伤害加成
	castDamageAddition					:		14,//作为施放伤害加成
	immunizeCritical						:		15,//受击时暴击免疫
	unableCritical							:		16,//攻击时无法造成暴击
	acceptCriticalAddition			:		17,//受击时暴击加成
	castCriticalAddition				:		18,//攻击时暴击加成
	dmgFloatCalc								:		19,//造成伤害时伤害浮动
	
	//反震,物理反击,魔法反击,连击
	canAntiDamage								:		20, //可以反震吗。有反震buf，且受到物理伤害。
	immunizeAntiDamage					:		21,	//免疫反震
	// canPhysicalAnti							:		22,	//可以物理反击吗。有物理反击buf,且受到移动物理伤害或普通攻击　且对方没有偷袭
	// immunizePhysicalAnti				:		23,	//免疫物理反击吗
	// canSpellAnti								:		24,	//可以法术反击吗。有法术反击buf,且受到移动物理伤害或普通攻击　且对方没有偷袭
	// immunizeSpellAnti						:		25,	//免疫法术反击吗
	checkCounter								:		22,	//是否触发反击
	immunizeCounter							:		23, //是否免疫反击
	immunizeSkill								:		24, //是否免疫技能
	
	canSeries										:		26,	//可以连击吗。必定是普通攻击中，有连击buf,　且(自己有偷袭或对方没有反震)
	immunizeSeries							:		27,	//免疫连击吗
	forbidImmunizeSeries				:		28,	//禁止免疫连击吗
	
	canSuckBlood								:		29, //可以吸血吗。有吸血buff，且受到物理伤害。
	immunizeSuckBlood						:		30,	//免疫吸血 ，有鬼魂术时
	canFightInNight							:		31, //有夜战能力
	elemDamageToRestore					:		32,	//元素吸收，把伤害变成回复
	hideMyself									:		33, //隐身，无法成为目标
	seeHideTarget 							:		34, //无视隐身，可以把有隐身状态的目标设为目标
	notAcceptBuff								:		35, //不可以接受状态，无法加状态到身上
	notAcceptRestore						:		36, //不可以接受回复
	canChase										:		37,	//是否可以追击
	afterSkillExecute						:		38, //技能施放后执行
	
	combatStartAddBuf						:		40,	//战斗开始给自己加状态
	currentBoutStartChangeHPMP	:		41,
	//dot hot//
	eachBoutStartExecute				:		42, //每个回合开始，可能对hp mp 怒气 内伤，增加或减少
	eachBoutEndExecute					:		43, //每个回合结束，可能对hp mp 怒气 内伤，增加或减少
	//buff debuff
	bufInitExecute							:		44, //buf生成和结束时要调用的接口
	getSkillCostPercent					:		45, //改变技能消耗的接口
	//封印
	modifyCommand								:		46,//决定能不能施放指令，或要改成什么别的指令，如果改为idle　就表示什么都不做。
	fixTarget										:		47,//检查施法者buff 是否被混乱或者嘲讽
	fixTargetFromMe							:		48,//检查目标buff 是否有反射状态
	fixBuffBout									:		49,//添加buff的时候改变buff回合数
	
	//回复													
	immunizeRestore							:		50,//无法被回复
	acceptRestoreAddition				:		51,//受到回复时　效果增加或减小百分比
	forbidReborn								:		52,//无法复活
	
	// 伤害附加效果
	dmgExecute									:		55,// 对目标造成伤害时执行
	revcDmgExecute							:		56,// 受到伤害时执行
	
	buffInfect									:		57,// 回合开始的时候把buff传染给队友
	checkTriggerTimes						:		58,// buff的触发次数
	eachBoutEndPurgeBuff				:		59,// 回合开始时概率清除buff
	
	deathHandle									:		60,//当生命为0时的处理
	fixHitRate									:		61,//修正命中率
	useMedicine									:		62,//使用药品
	acceptMedicine							:		63,//被使用药品
	defanceCmdEffect						:		64,//防御效果增肌
}

//状态触发时机
var buffEffectTime:any = {
	NONE : 1,   //没有
	APPLY : 2,  //添加时
	REMOVE : 3, //移除时
	DEAD : 4,   //死亡时
	DAMAGE : 5, //造成伤害时
	INTERVAL : 6,//间隔触发
	Critial : 7, //暴击时
	BeCritial : 8, //被暴击时
}

var bufDisappearOptions:any = {
	['FIGHT_NEVER']										:		1,//从不结束
	['FIGHT_BOUT_END']								:		2,//按回合来计算结束 持续多少回合 在回合后结束
	['FIGHT_BOUT_START']							:		3,//按回合来计算结束 持续多少回合 在回合前结束
	['FIGHT_COMMAND']									:		4,//在指令结束时 结束
	['FIGHT_TIME']										:		5,//时间
	['FIGHT_BOUT_END_DYNAMIC']				:		6,//根据状态的动态参数决定 持续多少回合，在回合后结束
	['FIGHT_BOUT_START_DYNAMIC']			:		7,//根据状态的动态参数决定 持续多少回合，在回合前结束
	['LIVE_NEVER']										:		11,//非战斗，永不结束
	['LIVE_TIME']											:		12,//按时间，时间到就结束
}

var buffTypeOptions:any = {
	['Buff']		:	1,//增加属性的
	['DeBuff']	: 2,//减小属性的
	['Hot']			:	3,//每回合增加HP/mp/rp/middleHP这类的
	['Dot']			:	4,//每回合减小HP/mp/rp/middleHP这类的
	['Seal']		: 5,//封印状态
	['Null']		: 6,//中性(没有定义)
}

var buffStackOptions:any = {
	Normal  : 1,  //不叠加也不替换
	Replace : 2,  //替换同Id状态
	Stack   : 3,  //堆叠同Id状态 有堆叠上限
	Unique  : 4,  //有同Id状态时不能添加
}

//回合开始：即是在回合的开始时状态会发挥效用。
//回合结束：即是在回合的结束时状态会发挥效用。
//动作执行前：在状态拥有者的动作执行前发挥效用。
//动作执行后：在状态拥有者的动作执行后发挥效用。
//受击后：在状态拥有者在受击后发挥效用。
//条件决定：在状态拥有者满足状态判断条件时发挥效用
var buffEvent:any = {
	BOUT_BEGIN : 1,         //回合间隔，开始时触发
	BOUT_END : 2,           //回合间隔，结否时触发
	ON_TIME : 3,            //时间间隔
	FIGHT_BEGIN : 4,        //战斗间隔 
	ACTION_BEGIN : 5,       //技能，物品使用，其他操作
	ACTION_END : 6,         
	DAMAGE : 7,             //受到伤害时（之前）
	APPLY_BUFF : 8,         //加上BUFF时
	REVOKE_BUFF : 9,        //消除BUFF时
	CAST_SKILL : 10,        //施放技能时
	DIRECT_PHY_DAMAGE : 11, //被直接物理伤害
	DIRECT_DAMAGE : 12,     //被直接伤害时
	DEFENCE : 13,           //防御时
	HP_CHANGE : 14,         //HP改变时
	MP_CHANGE : 15,         //MP改变时
	RP_CHANGE : 16,         //RP改变时
	HEAL : 17,              //治疗时
	PURGE : 18,             //驱除时
	COUNTER : 19,           //反击时
	DIRECT_DAMAGE_TARGET : 20,       //直接伤害目标时
	DIE : 21,                        //死亡时
	DIRECT_PHY_DAMAGE_TARGET : 22,   //直接物理伤害目标时
	KILL_TARGET : 23,                //杀死一个目标时
	DIRECT_MAG_DAMAGE : 24,          //被直接法术伤害
	DIRECT_MAG_DAMAGE_TARGET : 25,   //直接法术伤害目标时
	SHIFT_TARGET : 26,               //转换目标时
	CRITICAL : 27,                   //暴击目标时
	ADD_EFFECT : 99,                 //附加效果标识，不用HANDLE
	
	// live buff event
	FIGHT_END : 1001,				// 战斗结束时候
	USED : 1002,					// 使用后
	LOGIN : 1003,					// 登陆时
}

var buffType:any = {
	ZHOU_SHU : 1,			//：咒术
	ZHONG_DU : 2,			//：中毒
	WU_LI : 3,				//：物理
	FENG_YIN : 4,			//：封印
	TE_SHU : 5,				//：特殊
	ALL : 100,				//: 所有
}

var buffKind:any = {
	POSITIVE : 1,			//增益
	NEGATIVE : 2,			//减益
	NEUTRAL : 3,			//中性
}

var buffIgnore:any = {
	PropRang : 1,     //忽略属性判断
	Buff : 3,         //忽略状态
	Element : 2,      //忽略五行
	Command : 4,      //忽略指令
	Target : 5,       //忽略职业
}

var buffConst:any = {
	ADD_EFFECT_INDEX : 99,			//BUFF追加效果index
	FIRE_ARG_INDEX : 100, 			//BUFF效果触发参数index
	GENERAL_ATTACK_IHNDEX : 300,	//普通攻击标识
	
	PARAM_NUM : 101,				//LIVEBUFF传入参数index
}

var buffEventName:any = {}
for(let k in buffEvent){
			let v = buffEvent[k]
	
	buffEventName[v] = k
}

// param 目前只有封印效果
var paramEffect:any = {
	ATTACK          : 3,  // 攻击 3
	SKILL           : 4,  // 技能 4
	DEFENCT         : 5,  // 防御 5
	ITEM            : 6,  // 道具 6
	ESCAPE          : 7,  // 逃跑 7
	PROTECT         : 8,  // 保护 8
	CATCH           : 9,  // 收服 9
	CALL            : 10, // 召唤 10
	RECALL          : 11, // 召回 11
	UNABLE_PHYSICAL : 31, //不能使用物理招式 31
	UNABLE_SPELL    : 32, //不能使用法术招式 32
	UNABLE_SUNDER   : 41, //不能使用雷属性招式 41
	UNABLE_WIND     : 42, //不能使用风属性招式 42
	UNABLE_WHATER   : 43, //不能使用水属性招式 43
	UNABLE_FIRE     : 44, //不能使用火属性招式 44
	UNABLE_EARTH    : 45, //不能使用土属性招式 45
}

////////////////////////////////////////////////////////////////////////////////
//live buff config
////////////////////////////////////////////////////////////////////////////////
//状态持续种类
var configBuffType:any = {
	NO_TIME : 1,         //无时间限制
	ONLINE_TIME : 2,     //线上时间
	REAL_TIME : 3,       //实际时间
	DECREASE_TIME : 4,		//定期减少
}

//状态
var configBuff:any = {
	//[1] : {buffId : 1, buffName : "last", buffType : configBuffType.NO_TIME, buffLife : 0},
	//[2] = {buffId : 2, buffName : "online", buffType : configBuffType.ONLINE_TIME, buffLife : 20},
	//[3] = {buffId : 3, buffName : "real", buffType : configBuffType.REAL_TIME, buffLife : 20},
	
	//恶人
	[1] : {buffId : 1, buffName : "robber", buffType : configBuffType.ONLINE_TIME, buffLife : 0},
	//天罚
	[2] : {buffId : 2, buffName : "tianfa", buffType : configBuffType.ONLINE_TIME, buffLife : 15, client:true},
	//猎杀者
	[3] : {buffId : 3, buffName : "lieshazhe", buffType : configBuffType.NO_TIME, buffLife : 0, client:true},
	//幸运星
	[4] : {buffId : 4, buffName : "xingyunxing", buffType : configBuffType.NO_TIME, buffLife : 0, client:true},
	//狂怒
	[5] : {buffId : 5, buffName : "kuangnu", buffType : configBuffType.NO_TIME, buffLife : 0, client:true},
	//不死
	[6] : {buffId : 6, buffName : "busi", buffType : configBuffType.NO_TIME, buffLife : 0, client:true},
	//鼓舞
	[7] : {buffId : 7, buffName : "guwu", buffType : configBuffType.ONLINE_TIME, buffLife : 180, client:true},
	//PK惩罚
	[9] : {buffId : 9, buffName : "killer", buffType : configBuffType.DECREASE_TIME, buffLife : 0, period:90},
	//围城鼓舞
	[8] : {buffId : 8, buffName : "msguwu", buffType : configBuffType.ONLINE_TIME, buffLife : 180, client:true},
	
	[10] : {buffId : 10, buffName : "rmjis", buffType : configBuffType.ONLINE_TIME, buffLife : 8, client:true},
	[11] : {buffId : 11, buffName : "rmds", buffType : configBuffType.ONLINE_TIME, buffLife : 8, client:true},
	[12] : {buffId : 12, buffName : "rmxf", buffType : configBuffType.ONLINE_TIME, buffLife : 15, client:true},
	[13] : {buffId : 13, buffName : "rmjas", buffType : configBuffType.ONLINE_TIME, buffLife : 10, client:true},
	[14] : {buffId : 14, buffName : "rmmy", buffType : configBuffType.ONLINE_TIME, buffLife : 8, client:true},
	[15] : {buffId : 15, buffName : "slguwu", buffType : configBuffType.ONLINE_TIME, buffLife : 180, client:true},
	[16] : {buffId : 16, buffName : "halloween", buffType : configBuffType.ONLINE_TIME, buffLife : 7200, client:true},
	[17] : {buffId : 17, buffName : "pkprotect", buffType : configBuffType.ONLINE_TIME, buffLife : 3600, client:true},
	[18] : {buffId : 18, buffName : "tryride", buffType : configBuffType.REAL_TIME, buffLife : 1800, client:true}, //坐骑试骑
	//
	[19] : {buffId : 19, buffName : "sqgz", buffType : configBuffType.ONLINE_TIME, buffLife : 180, client:true},
	[20] : {buffId : 20, buffName : "rexue", buffType : configBuffType.ONLINE_TIME, buffLife : 180, client:true},
	[21] : {buffId : 21, buffName : "qiangz", buffType : configBuffType.ONLINE_TIME, buffLife : 180, client:true},
	[22] : {buffId : 22, buffName : "xianjin", buffType : configBuffType.ONLINE_TIME, buffLife : 8, client:true},
	[23] : {buffId : 23, buffName : "yinshen", buffType : configBuffType.ONLINE_TIME, buffLife : 60, client:true},
	[24] : {buffId : 24, buffName : "jskf", buffType : configBuffType.ONLINE_TIME, buffLife : 180, client:true},
	[25] : {buffId : 25, buffName : "guard", buffType : configBuffType.ONLINE_TIME, buffLife : 600, client:true},
	[26] : {buffId : 26, buffName : "shapeshifting", buffType : configBuffType.ONLINE_TIME, buffLife : 31, client:true}, //变身物品
	[27] : {buffId : 27, buffName : "lostDebuff", buffType : configBuffType.REAL_TIME, buffLife : 1800, client:true}, //变身物品
	[28] : {buffId : 28, buffName : "robberDead", buffType : configBuffType.REAL_TIME, buffLife : 0, client:false}, //圣地死亡
}

var configBuffName:any = {}
for(let k in configBuff){
			let v = configBuff[k]
	
	configBuffName[v.buffName] = v
}
