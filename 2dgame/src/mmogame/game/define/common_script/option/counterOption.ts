// 计数器定义

let opCounterOptions:any = {
	COUNTER_PET 				: 1,
	COUNTER_BOSS_BEGIN	: 30000,
	COUNTER_BOSS_EMD		: 60000,
}


let opSingleCounterOptions:any = {
	COUNTER_TASK : "task",
	COUNTER_ITEM : "item",
	COUNTER_FIGHT: "fight",
	COUNTER_SKILL: "skill",
	COUNTER_OTHER: "other",
}

let opSingleCounterIndex:any = {
	MAP_WIN				:	"mapWin",				//地图战斗胜利次数
	MAP_KILL			: "mapKill",			//地图杀怪数量
	MONSTER_KILL	: "monsterKill",	//杀死指定怪物数量
	FORGET_SKILL	:	"forgetSkill",	//遗忘技能次数
	
	FIGHT_DIE			:	"die",					//战斗死亡(回出生点)
	BOSS_SCORE		:	"bossscore",		//累积战绩
	BIAOQING			:	"biaoqing",			//表情
				
	BOSS_KILL			:	"bossKill",			//击败对应等级的英雄/困难boss次数
}

//统计类型
let opStatisticType:any = {
	pet      : 1,           //角色
	wing     : 2,           //翅膀
	stone    : 3,           //天赋石
	robber   : 5,           //圣地奖励
}
