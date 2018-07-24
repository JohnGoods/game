

let skillEffectFunOptions:any = {
//fight
	fightInitExecute				: 1,//技能生成时要执行的
	//fightEndExecute					: 2,//技能结束时要执行的，一般是升级时，先要旧的停止，再生成新的
	fightUseExecute					: 3,//战斗中使用技能时要执行的
	fightBeforeSortExecute	: 4,//先执行这个，然后再对参战者排出手次序，再开始回合
	//fightCmdStartExecute		: 5,//命令开始时要执行的
	//fightCmdEndExecute			: 6,//命令结束时要执行的
	fightBeforeAttack				: 7,//单次攻击前执行 加一些BUFF，行动结束后清除（横扫千军的暴击增加）

//combat
	combatInitExecute				: 11,//进入战斗时要执行的
	combatEndExecute				: 12,//退出战斗时要执行的
	//combatUseExecute				:	14,//战斗中使用技能要执行的

//live
	liveUseExecute					: 20,//非战斗时使用技能时要执行的
	liveInitExecute					: 21,//非战斗时技能　初始化时　要执行的
	liveEndExecute					: 22,//非战斗时技能　结束时　　要执行的
	
}

let skillConst:any = {
	RANK_MAX : 5,
	BUFFS_MAX : 32,
	TARGET_IS_FIGHTER : 2,
	TARGET_IS_PROTECTOR : 3,
	SERIES_ATTACK : 805,   //连击标识
	CHASH_ATTACK : 801,    //追击标识
	NEWBIE_FLY : 804,			// 新手传送技能
	GENERAL_ATTACK_SKILLID : 801,
 WIPE_GHOST_SKILLS : [60009,70009], // 驱鬼技能
 GHOST_SKILLS : [60008,70008], // 鬼魂术技能
	LOW_QUALITY_SKILL_BEGIN : 60000,
	HIGH_QUALITY_SKILL_BEGIN : 70000,
	SCHOOL_SPECIAL_SKILL_ID_BEGIN : 900,
 PRE_BUFF_SKILLS : [10103, 11007], // 先发制人特殊 需要在确定出手顺序前处理
 PRE_BUFFS : ['gaosuzt', 'pilaozt'],	// 先发制人特殊 需要在确定出手顺序前加上这个buff
}

let skillOpResult:any = {
	SUCCESS 				:	0,
	MISS 						:	1,
	NO_TARGETS 			:	2,
	HP_NOT_ENOUGH 	:	3,
	MP_NOT_ENOUGH 	:	4,
	HPPercent_NOT_ENOUGH 	:	5, 
	MPPercent_NOT_ENOUGH 	:	6, 
	RP_NOT_ENOUGH 	:	7,  
	HIDE_NOT_ENOUGH : 8,  // 暗器不足
	IMMUNIZED 			:	9, 	// 免疫 包括伤害免疫和debuff免疫
	SKILL_IN_CD 		:	10,	// 技能CD中 使用失败
	NO_NEED_BUFF 		:	11,	// 没有前置buff
	CANT_USE_IN_DAY :	12,	// 白天不能使用
	CANT_USE_IN_NIGHT : 13, // 夜晚不能使用
	NO_SKILL 				:	14,	// 没有学习该技能
	HP_TOO_MUCH 		:	15,	// 血量超过要求
	MP_TOO_MUCH 		:	16,	// MP超过要求
	HPPercent_TOO_MUCH	:	17,	// 血量超过要求
	MPPercent_TOO_MUCH	:	18,	// MP超过要求
	HIDE_CANT_USE 	:	19,	// 隐身状态不能使用技能
	SUMMON_REPEAT 	:	20, // 不能重复召唤
	TARGET_NOT_NEED_RELIVE	: 21,	// 目标不需要复活
	TARGET_CANT_RELIVE	: 22,	// 目标不能被复活
	PHYSICAL_LIMITED	: 23,		// 物理攻击被禁止
	SKILL_LIMITED			: 24,		// 技能使用被禁止
	ITEM_USE_LIMITED	: 25,		// 道具使用被禁止
	CANT_ESCAPE				: 26,		// 无法逃跑
}

let skillTargetMethod:any = {
	NOTDEFINE : 1, //没有定义
	NORMAL : 2,    //默认目标规则（敌方当前行第一个）
	SELF : 3,      //自己
	ALL : 4,       //全体(翅膀技能可用)
	ENEMYS : 5,    //敌方全体(翅膀技能可用)
	ALLYS : 6,     //我方全体(翅膀技能可用)
	ALLYMATE : 7,  //我方队友
	RANDOM : 8,    //随机x个(翅膀技能可用)
	ROW : 9,       //前排
	OPROW : 10,    //后排
	COL : 11,      //当前列
	MULTI : 12,    //随机多体(翅膀技能可用)
	MAXLL : 13,    //最高力量(翅膀技能可用)
	MAXZL : 14,    //最高智力(翅膀技能可用)
	MAXMJ : 15,    //最高敏捷(翅膀技能可用)
	MAXTL : 16,    //最高体力(翅膀技能可用)
	CROSS : 17,    //十字目标
	RANDOMALLY : 18, //随机1个我方单位(翅膀技能可用)
	ROWALLY : 19,  //我方前排
	OPROWALLY : 20,//我方后排
	FIX : 21,      //固定目标 翅膀技能
	AHEAD : 22,    //前方
	ENEMYSORFORCE : 23,   //敌方全体若有强制目标则攻击强制目标
	TARGET_ROW : 24,      //目标当前排
	NORMAL_OPPOSITE : 25, //后排规则
	OPROW_CROSS : 26,     //后排十字目标
	MY_ROW : 27,   //同排
	MAX_DODGE : 28, //闪避最高
	RANDOMS : 29,   //随机范围
	BUFFS : 30, //指定状态
	RANDT_SIDE : 31,  //随机目标及上下
	COL_QUEUE : 32,   //顺序列
	BUFFSELECT : 33, //状态选定
	ALLYMATE_MINRP : 34, //我方队友能量值最小
	RANDOMFRONT : 35, //前排随机1-3个目标
	LOWROW : 36, //前排最虚弱目标
	OPROWPET : 37, //我方中排，排除召唤物
	ALLYMATE_PERCENT : 38, //我方气血比例最低
	LOWALL : 39, //全体最虚弱
	ADDENEMYS : 40, //根据次数增加敌人
	SEQUENCE : 41, //行动队列
	ALLY_HP_VALUE_SORT : 42, //我方气血排序，排除召唤物从小到大排序，取N个
	ALLY_HP_VALUE_LOWER : 44, //我方气血值最低，排除召唤物
	ALLY_HPVALUE_HIGHER : 48, //我方气血值最高 排除召唤物
	ALLY_HPPER_HIGHER : 47, //我方气血比例最高 排除召唤物
	ENEMY_HPVALUE_HIGHER : 49, //敌方气血值最高 排除召唤物
	FIX_GROUP : 50,  //固定战斗分组
	SEQUENCE_NUM : 51, //队列数量
	ALLAY_COL : 52, //同排不包含自己
	ALLAY_COL_EX : 53, //同排包含自己
	ENEMY_SORT_RP : 54, //敌方能量从大到小排序，取N个
	ENEMYOPROWPET : 55, //敌方中排,排除召唤物
}


//技能大类
let skillSuperType:any = {
	PASSTIVE       : 0, //被动
	AUTO           : 1, //自动(普通)
	MANUAL         : 2, //手动(绝招)
	ESOTERIC       : 3, //手动(奥义)
	CAPTURE        : 4, //捕捉宠物
}

//技能对应技能升级消耗系数
let skillTypeToConsumeRatio:any = {
	[skillSuperType.AUTO]     : 1,
	[skillSuperType.MANUAL]   : 2,
	[skillSuperType.ESOTERIC] : 1.5,
}