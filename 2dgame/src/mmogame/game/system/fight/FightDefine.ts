ImportType(powerEffects)
ImportType(objectType)
ImportType(combatOptions)

//客户端专属定义
powerEffects.EFFECT_FREEZE_VIEW = 121		////战斗画面冻结{effect, targetId}
powerEffects.EFFECT_CLIENT_FIGHT_END = 122		////客户端战斗结束{effect, targetId}
powerEffects.EFFECT_CLIENT_FIGHT_DIALOG = 123		////客户端战斗暂停出对话{effect, targetId, status}


opFightResultType.FIGHT_TYPE_CLIENT = 99			//客户端表演战斗的战斗类型

// objectType.OBJECT_TYPE_FUNNAL = objectType.OBJECT_TYPE_WING		//8 只用于客户端的模拟对象，浮游炮（翅膀）
// objectType.OBJECT_TYPE_HELPER = -1														//只用于客户端的援助（分身-半透明）对象类型
// objectType.OBJECT_TYPE_GHOST = -2														//只用于客户端的援助（分身）对象类型
// objectType.OBJECT_TYPE_FULLHELPER = -3														//只用于客户端的援助（分身-不透明）对象类型
// objectType.OBJECT_TYPE_PET_HELPER = -4														//只用于客户端的援助（分身-半透明）对象类型——当部下对待
// objectType.OBJECT_TYPE_TELEPORT = -5														//只用于客户端的召唤（分身-不透明-从上面瞬移）对象类型

//opFightType.FIGHT_TYPE_RELIC = opFightType.FIGHT_TYPE_RELIC_PVP

var ACTION_PARAM_COUNT = 15
var MaxShowTime = 5000 //战斗表演最大时间
var MaxActionTime = 5000//元素表演时间
var FUNNAL_ACTOR_POS = 20//浮游炮（翅膀）的站位
var ROLE_MP_MAX = combatOptions.maxMP
var FIGHT_COMBAT_ACTOR_COUNT = 3
var FIGHT_COMBAT_ROW_COUNT = 6
var FIGHT_MAP_ANGLE = -Math.PI / 6
var FIGHT_CENTER_X = 320
var FIGHT_CENTER_Y = 475

//fight_action_template = 
//{
//    //起手
//		["elem_list_ready"] : {},
//		//表演
//		["elem_list_show"] = {},
//		//收手
//		["elem_list_}"] = {},
//}

//枚举行为元素
let ENUM_FIGHT_ACTION: any = {
	["POWER"]: Fight_ShowPowerAction,

	//人物动作
	["ACTOR_ATTACK"]: Fight_ActorAttackAction,
	["ACTOR_RUSH"]: Fight_ActorRushAction,

	//创建特效
	["EFFECT_ACTOR"]: Fight_EffectActorAction,
	["EFFECT_MOVE"]: Fight_EffectMoveAction,
	["EFFECT_SCENE"]: Fight_EffectSceneAction,
	["EFFECT_SCREEN"]: Fight_EffectScreenAction,


	//控制器
	["ALPHA"]: Fight_AlphaAction,
	["FADE"]: Fight_FadeAction,
	["MOVE"]: Fight_MoveAction,
	["ROTATE"]: Fight_RotateAction,
	["SCALE"]: Fight_ScaleAction,
	["DIR"]: Fight_DirAction,
	//屏幕相关
	["SCREEN_SHAKE"]: Fight_ScreenShakeAction,
	["SCREEN_BLACK"]: Fight_ScreenBlackAction,
	["SCREEN_IMAGE"]: Fight_ScreenImageAction,

	["CAMERA_ZOOM"]: Fight_CameraZoomAction,
	["CAMERA_MOVE"]: Fight_CameraMoveAction,
	["CAMERA_TRACE"]: Fight_CameraTraceAction,

	["ATTACKED_PLAYANIM"]: Fight_AttackedPlayAnimAction,
	["ATTACKED_KNOCKFLY"]: Fight_AttackedKnockAction,
	["ATTACKED_BEATBACK"]: Fight_AttackedBackAction,
	//声音
	["ADD_SOUND"]: Fight_AddFightSound,

}

let FIGHT_ACTOR_AI: any = {
	[objectType.OBJECT_TYPE_PET]: FightActorAI,
	// [objectType.OBJECT_TYPE_FUNNAL]: "FightFunnalAI",//
	// [objectType.OBJECT_TYPE_HELPER]: "FightHelperAI",//"",//FightGhostAI
	//[objectType.OBJECT_TYPE_ASSIST]: FightBackerAI,//
	// [objectType.OBJECT_TYPE_GHOST]: "FightGhostAI",
	// [objectType.OBJECT_TYPE_FULLHELPER]: "FightHelperAI",//
	// [objectType.OBJECT_TYPE_PET_HELPER]: "FightHelperAI",//"",//FightGhostAI
	// [objectType.OBJECT_TYPE_TELEPORT]: "FightTeleportAI",

}

//需要延迟表演result的actor类型，对应AI需要实现方法~AI.setBackerResult////delayBeginResult
let FIGHT_ACOTCONTROL_MAPPING = [
	objectType.OBJECT_TYPE_ASSIST,
	// objectType.OBJECT_TYPE_TELEPORT,
	// objectType.OBJECT_TYPE_FUNNAL,
]

//翅膀（浮游炮）id
let FIGHT_FUNNAL_ID: any = {
	[fightSide.FIGHT_LEFT]: 1000,
	[fightSide.FIGHT_RIGHT]: 1001,
}

//动作优先级,优先级越大越靠先执行
let FIGHT_ACTION_PRIORITY: any = {


	["SCREEN_BLACK"]: 200,

	["ACTOR_ATTACK"]: 100,
	["ACTOR_RUSH"]: 100,

	["EFFECT_ACTOR"]: 80,
	["EFFECT_MOVE"]: 80,
	["EFFECT_SCENE"]: 80,
	["EFFECT_SCREEN"]: 80,
}

let FIGHT_BLACK_SCREEN_TYPE: any = {
	CASTER: 0, //施法者可见
	TARGETLIST: 1,//受击者可见
	CASTER_TARGETLIST: 2,//施法者受击者可见
	ALL_HIDE: 3,//全不可见
}


let ENUM_FIGHT_POWER: any = {

	[powerEffects.EFFECT_HP_PLUS]: Fight_HPPower,
	[powerEffects.EFFECT_HP_LESS]: Fight_HPPower,

	[powerEffects.EFFECT_MAXHP_PLUS]: Fight_HPPower,
	[powerEffects.EFFECT_MAXHP_LESS]: Fight_HPPower,
	//[powerEffects.EFFECT_CRIHP_PLUS] 	: Fight_HPPower,
	//[powerEffects.EFFECT_CRIHP_LESS] 	: Fight_HPPower,

	[powerEffects.EFFECT_MP_PLUS]: Fight_MPPower,
	[powerEffects.EFFECT_MP_LESS]: Fight_MPPower,
	[powerEffects.EFFECT_MP_VALUE] 	: Fight_MPPower,
	[powerEffects.EFFECT_ABSORB]: Fight_HPPower,

	[powerEffects.EFFECT_RP_PLUS]: Fight_RPPower,
	[powerEffects.EFFECT_RP_LESS]: Fight_RPPower,
	[powerEffects.EFFECT_RP_VALUE]		: Fight_RPPower,

	[powerEffects.EFFECT_ATTACKED]: Fight_AttackedPower,
	[powerEffects.EFFECT_BREAK]: Fight_BreakPower,

	//[powerEffects.EFFECT_RESULT] 			: Fight_AddResultPower,	

	[powerEffects.EFFECT_MISS]: Fight_DodgePower,
	[powerEffects.EFFECT_DODGE]: Fight_DodgePower,
	[powerEffects.EFFECT_NOTARGET]: Fight_DodgePower,

	[powerEffects.EFFECT_ADD_BUFF]: Fight_BuffPower,
	[powerEffects.EFFECT_DEL_BUFF]: Fight_BuffPower,
	[powerEffects.EFFECT_UPDATE_BUFF]: Fight_BuffPower,
	[powerEffects.EFFECT_IMMUNIZE]: Fight_BuffPower,

	[powerEffects.EFFECT_DROP_GOLD]: Fight_AwardPower,
	[powerEffects.EFFECT_DROP_ITEM]: Fight_AwardPower,
	[powerEffects.EFFECT_SPIRIT_CD]: Fight_SpiritCDPower,
	[powerEffects.EFFECT_FIGHTER_ADD]: Fight_HelperPower,
	[powerEffects.EFFECT_FIGHTER_DISAPPEAR]: Fight_HelperPower,
	[powerEffects.EFFECT_REBOUND]: Fight_ReboundPower,
	[powerEffects.EFFECT_RESERVE]: Fight_AltematePower,
	[powerEffects.EFFECT_SKILL_CD]: Fight_SkillCDPower,
	[powerEffects.EFFECT_SET_ROUND]: Fight_SetRound,//回合数   {effect, round}

	//客户端
	[powerEffects.EFFECT_FREEZE_VIEW]: Fight_FreezeViewPower,
	[powerEffects.EFFECT_CLIENT_FIGHT_END]: Fight_EndClientFightPower,
	//[powerEffects.EFFECT_CLIENT_FIGHT_DIALOG]: Fight_ShowDialogPower,

}

let ENUM_FIGHT_STATE: any = {
	[powerStatus.PSTATUS_TARGET_DIE]: Fight_DieState,			//受击者死亡
	[powerStatus.PSTATUS_DEATH_NOT_DISAPPEAR]: Fight_DieState,			//死亡不在场
	["DIZZY"]: [],			//晕眩
	["FROZEN"] : [],		//冰冻
}


//站位
var POS_DEFINE = 
{
 //左边
 [fightSide.FIGHT_LEFT] : 
 [
 		[250,120],[250,180],[250,240],
 		//[200,150],[200,210],[200,270],
 		[100,150],[100,210],[100,270],
 		],
 //右边
 [fightSide.FIGHT_RIGHT] : 
 [
		[550,120],[550,180],[550,240],
 		//[600,150],[600,210],[600,270],
 		[700,150],[700,210],[700,270],
 ],
}

// ECHO = function (...)
// 	TLog.Debug(...)
// }

// WARN = function (...)
// 	TLog.Warn(...)
// }

let ENUM_FIGHT_MOVE_TYPE: any = {
	MOVE_LINE_TIME: 1,	//直线移动(按时间)
	//MOVE_LINE : 2, //直线移动（按速度）
	MOVE_CURVE: 3,	//曲线移动（按速度）
	MOVE_TRACE: 4,	//追踪移动（按速度）
	MOVE_INSTANT: 5,
}

let ELEM_IGNORE_POWER = [
	//powerEffects.EFFECT_HP_PLUS      ,
	//powerEffects.EFFECT_HP_LESS      ,
	//powerEffects.EFFECT_MAXHP_PLUS   ,
	//powerEffects.EFFECT_MAXHP_LESS   ,
	//powerEffects.EFFECT_RP_PLUS      ,
	//powerEffects.EFFECT_RP_LESS      ,
	//powerEffects.EFFECT_MISS         ,
	//powerEffects.EFFECT_DODGE        ,
	//powerEffects.EFFECT_ATTACKED     ,
	//powerEffects.EFFECT_ADD_BUFF     ,
	//powerEffects.EFFECT_DEL_BUFF     ,
	//powerEffects.EFFECT_UPDATE_BUFF  ,
	//powerEffects.EFFECT_IMMUNIZE     ,
	powerEffects.EFFECT_RESIST,
	//powerEffects.EFFECT_BREAK        ,
	powerEffects.EFFECT_MOVE,
	powerEffects.EFFECT_STATUS,
	//powerEffects.EFFECT_DROP_GOLD		 ,
	//powerEffects.EFFECT_DROP_ITEM		 ,

	//powerEffects.EFFECT_ABSORB,
]


//////////////////////////////////////////////////////////////-
var POS_MAPPING_DEFINE = 
{
	// [fightSide.FIGHT_LEFT] : 
    // [
    //         [1, 2], [2, 2], [3, 2],
    //         [1, 1], [2, 1], [3, 1],
    // ],
    // //右边
    // [fightSide.FIGHT_RIGHT] : 
    // [
    //         [1, 4], [2, 4], [3, 4],
    //         [1, 5], [2, 5], [3, 5],
    // ],
}


let FIGHT_POSITION_DEFINE: any = {

}

//let positionConfig = readCSV("data\\config\\Combat\\nidongde.csv")
//let initPositionDefine = function()
//	let t = positionConfig[1] || {}
//
//	let startX 			= t.startX || 70
//	let startY 			= t.startY || 200
//	let rowX			 	= t.rowX || 140
//	let rowY				= t.rowY || 120
//	let lineOff			= t.lineOff || 50
//	
//	for(let i = 1; i <=  3;i++){
//		let inte = 0
//		for(let j = 1; j <=  5;j++){
//			if(j == 3 ){
//				inte = t.inte || -70
//			}
//			
//			let pos:any = {
//			
//				startX + rowX * (j - 1) + inte, 
//				startY + rowY * i + lineOff * (j % 2)
//			
//			}
//			let t:any = {}
//			let flag = false
//			//TLog.Debug(pos[1], pos[2])
//			t[1] = pos
//			t[2] = flag
//			
//			FIGHT_POSITION_DEFINE[i] = FIGHT_POSITION_DEFINE[i] || {}
//			FIGHT_POSITION_DEFINE[i][j] = t
//		}
//	}
//	
//}

// //方案二
// let positionConfig = readCSV("data\\config\\Combat\\fighterPosition.csv")
// let initPositionDefine = function ()
//  POS_MAPPING_DEFINE: any = {}
// 	for (let _ in positionConfig) {
// 		let v = positionConfig[_]

// 		let lx = v.x > 320 && 320 || v.x
// 		let ly = v.y
// 		let rx = 640 - lx

// 		POS_MAPPING_DEFINE[fightSide.FIGHT_LEFT] = POS_MAPPING_DEFINE[fightSide.FIGHT_LEFT] || {}
// 		POS_MAPPING_DEFINE[fightSide.FIGHT_LEFT][v.pos] = { lx, ly }

// 		POS_MAPPING_DEFINE[fightSide.FIGHT_RIGHT] = POS_MAPPING_DEFINE[fightSide.FIGHT_RIGHT] || {}
// 		POS_MAPPING_DEFINE[fightSide.FIGHT_RIGHT][v.pos] = { rx, ly }
// 	}
// }
// initPositionDefine()
// positionConfig = null

////////////////////////////////////////////////////////////////-
//原来默认是3 3 3排列，为了适应不同阵型规则，需要预设最大适配模式6 6 6
let DEFAULT_ATTACK_OBJECT = {
	[1]  : [1,2,3,4,5,6,  7,8,9,10,11,12,  13,14,15,16,17,18],
	[2]  : [2,1,3,4,5,6,  8,7,9,10,11,12,  14,13,15,16,17,18],
	[3]  : [3,2,4,1,5,6,  9,8,10,7,11,12,  15,14,16,13,17,18],
	[4]  : [4,3,5,2,6,1,  10,9,11,8,12,7,  16,15,17,14,18,13],
	[5]  : [5,4,6,3,2,1,  11,10,12,9,8,7,  17,16,18,15,14,13],
	[6]  : [6,5,4,3,2,1,  12,11,10,9,8,7,  18,17,16,15,14,13],
	     
	[7]  : [1,2,3,4,5,6,  7,8,9,10,11,12,  13,14,15,16,17,18],
	[8]  : [2,1,3,4,5,6,  8,7,9,10,11,12,  14,13,15,16,17,18],
	[9]  : [3,2,4,1,5,6,  9,8,10,7,11,12,  15,14,16,13,17,18],
	[10] : [4,3,5,2,6,1,  10,9,11,8,12,7,  16,15,17,14,18,13],
	[11] : [5,4,6,3,2,1,  11,10,12,9,8,7,  17,16,18,15,14,13],
	[12] : [6,5,4,3,2,1,  12,11,10,9,8,7,  18,17,16,15,14,13],
	
	[13] : [1,2,3,4,5,6,  7,8,9,10,11,12,  13,14,15,16,17,18],
	[14] : [2,1,3,4,5,6,  8,7,9,10,11,12,  14,13,15,16,17,18],
	[15] : [3,2,4,1,5,6,  9,8,10,7,11,12,  15,14,16,13,17,18],
	[16] : [4,3,5,2,6,1,  10,9,11,8,12,7,  16,15,17,14,18,13],
	[17] : [5,4,6,3,2,1,  11,10,12,9,8,7,  17,16,18,15,14,13],
	[18] : [6,5,4,3,2,1,  12,11,10,9,8,7,  18,17,16,15,14,13],
}

var DEFAULT_FIGHT_ACTOR_COUNT = 9

////////////////////////////////////////////////////////////////-
//战斗完成后不恢复的界面列表
let FIGHT_NOT_RESOTE_UI = {
	[opFightResultType.COMMON]	      : ["CampaignBossFrame", "FullScreenBgFrame", "MainCityFrame", "GlobalMiningInfoFrame", "GlobalMiningGuardFrame", "FightRecordFrame"],					//common
	// [opFightResultType.PERSONAL_BOSS] : ["MainCityFrame"],
	// // [opFightResultType.DRAGON]        : ["MainCityFrame"],        //龙王宝藏
	// [opFightResultType.LIFEANDDEATH]  : ["MainCityFrame"],        //生死劫
	// // [opFightResultType.MATERIAL]      : ["MainCityFrame"],        //材料副本
	// // [opFightResultType.THUNDER_TEMPLE]: ["MainCityFrame"],        //小雷音寺
	// // [opFightResultType.HEAVEN_TRIAL]  : ["MainCityFrame"],        //天庭试炼
	// [opFightResultType.WORLD_BOSS]    : ["MainCityFrame"],        //全名boss
	// [opFightResultType.WILD_BOSS]     : ["MainCityFrame"],        //野外boss
}

//战斗结算界面相关配置
let FightFinishWndDefend: any = {
	["win"]: {
		// [opFightResultType.PATROL]: "FightPrizeFrame",					//巡逻
		[opFightResultType.CAMPAGIN]: "FightPrizeFrame",					//关卡
		[opFightResultType.CAMPAGINBOSS]: "FightPrizeFrame",				//关卡BOSS
		[opFightResultType.CAPTURE]: "FightCapturePrizeFrame",				//捕捉
		[opFightResultType.LIFEANDDEATH]: "FightPrizeFrame",				//生死劫
		[opFightResultType.JJC]: "FightJJCPrizeFrame",					    //竞技场
		[opFightResultType.DRAGON]: "FightDragonPrizeFrame",				//龙王宝藏
		[opFightResultType.MATERIAL]: "FightPrizeFrame", 					//材料副本
		[opFightResultType.THUNDER_TEMPLE]: "FightPrizeFrame",				//小雷音寺
		[opFightResultType.HEAVEN_TRIAL]: "FightPrizeFrame",				//天庭试炼
		[opFightResultType.GLOBAL_TEAM]: "FightPrizeFrame",					//跨服组队
		[opFightResultType.PERSONAL_BOSS]: "FightPrizeFrame",				//个人boss
		[opFightResultType.WORLD_BOSS]: "FightPrizeFrame",					//全名boss
		[opFightResultType.WILD_BOSS]: "FightPrizeFrame",					//野外boss
		[opFightResultType.WILD_BOSS_PVP]: "FightPrizeFrame",				//野外bossPVP
		[opFightResultType.ZHONG_KUI_DEMON]: "FightPrizeFrame",				//钟馗
		[opFightResultType.ESCORT]: "FightPrizeFrame",						//护送抢夺
		[opFightResultType.NERW_SERVER_ZONES]: "FightPrizeFrame",			//新服副本
		[opFightResultType.FACT_INST_ZONES]: "FightPrizeFrame",             //帮会副本
		[opFightResultType.GLOBAL_MINE]: "FightPrizeFrame",             	//跨服争霸(矿战)
		[opFightResultType.WU_LIN_MENG_ZHU]: "FightPrizeFrame",						//武陵盟主
		[opFightResultType.STRONGHOLD]: "FightPrizeFrame",                 //武陵盟主
	},

	["lost"]				: {
		// [opFightResultType.PATROL]: "FightPrizeFrame",					//巡逻
	    [opFightResultType.CAMPAGIN]: "FightLostFrame",						//关卡
		[opFightResultType.DRAGON]: "FightLostFrame",						//关卡
		[opFightResultType.CAMPAGINBOSS]: "FightLostFrame",					//关卡BOSS
		// [opFightResultType.FACTIONMAP]: "FightLostFrame",					//帮派地图
		[opFightResultType.LIFEANDDEATH]: "FightLostFrame",					//生死劫
		[opFightResultType.FACTION_BOSS]: "FightLostFrame",					//帮会妖怪
		[opFightResultType.MATERIAL]: "FightLostFrame", 					//材料副本
		[opFightResultType.THUNDER_TEMPLE]: "FightLostFrame",				//小雷音寺
		[opFightResultType.HEAVEN_TRIAL]: "FightLostFrame",					//天庭试炼
		[opFightResultType.GLOBAL_TEAM]: "FightLostFrame",					//跨服组队
		[opFightResultType.PERSONAL_BOSS]: "FightLostFrame",				//个人boss
		[opFightResultType.WORLD_BOSS]: "FightLostFrame",					//全名boss
		[opFightResultType.WILD_BOSS]: "FightLostFrame",					//野外boss
		[opFightResultType.WILD_BOSS_PVP]: "FightLostFrame",				//野外bossPVP
		[opFightResultType.FACT_INST_ZONES]: "FightLostFrame",				//帮会副本
		[opFightResultType.ZHONG_KUI_DEMON]: "FightLostFrame",				//钟馗
		[opFightResultType.CAPTURE]: "FightCaptureLostFrame",				//捕捉
		[opFightResultType.JJC]: "FightLostFrame",							//竞技场
		[opFightResultType.ESCORT]: "FightLostFrame",						//竞技场
		[opFightResultType.NERW_SERVER_ZONES]: "FightLostFrame",			//新服副本
		[opFightResultType.WU_LIN_MENG_ZHU]: "FightLostFrame",			//武林盟主
		[opFightResultType.STRONGHOLD]: "FightLostFrame",                 //武陵盟主
	},
}

let FIGHT_NOT_HIDE_UI = ["MainFrame", "FightRecordFrame"]
let initFightNotHideUi = function() {
	for (let _ in FightFinishWndDefend) {
		let v = FightFinishWndDefend[_]
		for (let fType in v) {
			let wndName = v[fType]
			if (table_isExist(FIGHT_NOT_HIDE_UI, wndName) == false) {
				table_insert(FIGHT_NOT_HIDE_UI, wndName)
			}
		}
	}
}
initFightNotHideUi()

let initFightNotStoryUi = function() {
	for (let _ in FightFinishWndDefend) {
		let v = FightFinishWndDefend[_]
		for (let fType in v) {
			let wndName = v[fType]
			if (table_isExist(FIGHT_NOT_RESOTE_UI[opFightResultType.COMMON], wndName) == false) {
				table_insert(FIGHT_NOT_RESOTE_UI[opFightResultType.COMMON], wndName)
			}
		}
	}
}
initFightNotStoryUi()