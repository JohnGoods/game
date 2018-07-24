/*
作者:
    yangguiming
	
创建时间：
   2013.9.22(周日)

意图：
   与charcter相关定义

公共接口：
   
*/

ImportType(opPetQuality)

//特效绑定部位
var EffectPart:any = {
	HEAD : 1,
	BODY : 2,
	SHOE : 3,
}


//角色状态
var characterState:any = {
	nullState			        : -999999,

	//全局状态
	globalState_Begin 		: 0,
		globalState_live 		: 1,//生活状态
		globalState_combat 	: 2,//战斗状态
	globalState_End 			: 99,

	//动作状态
	actionState_Begin			: 100,
		actionState_idle 		: 101,//空闲
		actionState_move 		: 102,//移动
		
		actionState_attack 		: 103,//攻击
		actionState_attacked 	: 104,//受击
		actionState_dead		 		: 105,	//死亡
		actionState_rush 			: 106,//冲刺
		actionState_jump 			: 107,//跳跃
		actionState_dodge 		: 108,//闪避
		actionState_knockfly 		: 109,//击飞
		actionState_beatback 		: 110,//击退
		
	actionState_End				: 199,
	
	//姿态状态
	postureState_Begin	  	: 200,
		postureState_normal		: 201,//普通
		postureState_shape 		: 202,//变形
		postureState_ride 		: 203,//坐骑
	postureState_End	  		: 299,
}






//Actor的身体部件定义
//ActorPartMap =
//{
//	body 			: 0,
//	cloth 		: 1,
//	weapon 		: 2,
//	wing 			: 3,
//	hair 			: 4,
//}


//引擎精灵dir的坐标系
//     7  6  5
//   	 \|/
//   0 ———|————4    
//   	 /|\
//     1  2  3		*/

//Actor的方向定义
var ActorDirMap = {
	RightUp : 5,
	Up : 6,
	LeftUp : 7,
	Left : 0,
	LeftBottom : 1,
	Bottom :2,
	RightBottom : 3,
	Right : 4,
}


function IsFaceRight(actor:Actor):boolean{
	let dir = actor.getDir()
	
	if(dir == ActorDirMap.Right || dir == ActorDirMap.RightBottom || dir == ActorDirMap.RightUp )
		return true;

	return false;	
}

function IsFaceLeft(actor:Actor):boolean{
	let dir = actor.getDir()
	
	return !this.IsFaceRight(actor)
}


var actor_Type = {
	ACTOR_TYPE_BASE 					: -1,

	ACTOR_TYPE_CHARACTER 					: 0,
	ACTOR_TYPE_COMBAT_CHARACTER 	: 1,
	ACTOR_TYPE_MONSTER 						: 2,
	ACTOR_TYPE_PET								: 3,
	ACTOR_TYPE_MONSTERBOSS				: 4,
	
	//ACTOR_TYPE_COMBAT_MONSTER : 3,
	//ACTOR_TYPE_COMBAT_BOSS 		: 4,
	//ACTOR_TYPE_COMBAT_PLAYER 	: 5,
	ACTOR_TYPE_NPC 						: 6,
	ACTOR_TYPE_PLAYER 				: 7,
	ACTOR_TYPE_HERO 					: 8,
	ACTOR_TYPE_STALL 					: 9,
	ACTOR_TYPE_EFFECT 			  : 10,
	ACTOR_TYPE_FAIRY          : 11,
	ACTOR_TYPE_RIDEPLAYER     : 12,
	ACTOR_TYPE_AWARD					: 13,
}




var ActorCommand = {
	//Effect
	AddEffect 							: 100, //绑定特效 			param1:Effect 		,param2:null
	RemoveEffect 						: 101, //删除特效				param1:Effect 		,param2:null
	RemoveEffectById 				: 102, //删除指定特效		param1:EffectId 	,param2:null
	SetEffect								: 103, //设置绑定特效 param1:EffectId	,param2:effectPart
	SetEffectVisible				: 104, //显示隐藏绑定特效 param1:bool	,param2:null
	SetEffectVisibleWithCaster: 105, //根据施法者显示隐藏绑定特效 param1:bool	,param2:caster
	RemoveEffectAll					: 106, //清队所有特效

	//Visual              	
	ShowCombatNumber				: 204, //显示战斗数字 param1:number_info, param2:alltime
	SetShadowVisible				: 207, //显示阴影 param1:visible				,param2:null
	
	//UI
	SetNpcHeadFrameVisible	: 300, //显示NPC头顶功能框 param1:visible				,param2:null
	AddChatBubble						: 301, //冒泡聊天框				 	param1:content				,param2:null
	HideChatBubble					: 302, // 隐藏头顶的泡泡		param1:null				,param2:null
	SetHourGlassVisible			: 303, //显示头顶沙漏			param1:visible				,param2:null
	SetName									: 304, //设置名字 param1:name			,param2:null
	SetNameColor						: 305, //设置名字颜色 param1:color			,param2:null
	SetHpSlot								: 306, //设置血条 	param1:cur				,param2:all
	SetMPSlot								: 307, //设置魔法条 param1:cur				,param2:all
	SetHpSlotVisible				: 308, //显示/隐藏血条 param1:visible				,param2:null
	SetMPSlotVisible				: 309, //显示/隐藏魔方 param1:visible				,param2:null
	SetCaptainIconVisible		: 310, //队长头上标志 	param1:visible				,param2:null
	showSkillName						: 311, //显示技能名称， param1:skillId, param:null
	//SetFuncStayOpenVisible	: 311, //显示待开启功能提示 	param1:funcIndex (字符串)				,param2:visible
	SetCombatMarkVisible		: 312, //战斗标示头顶特效
	ShowCombatAutoHpSlot			: 313, //战斗标示头顶特效
	SetTeammateIconVisible  : 314, //组队队员头上标志
	ShowAwardModel					: 315,//战斗掉落对象
	SetMoreIcon							: 316, //设置pk图标
	SetNameFont							: 317, //设置名字字体 param1:font, param2:null
	SetStateIcon						: 318, //设置状态图标
	setTimeCountDown				: 319,  //设置头顶倒计时
	SetFactionName					: 320,   //设置军团信息
	//SetLTIconRD							: 321,   //设置光明神像信息
	SetChengHaoTitle    		: 322,   //设置称号
	SetFightStateVisible    : 323,   //设置战斗中参战对象的状态（例如翅膀技能选目标）
	ShowFloatText					: 324, //飘字
	ShowFighterCharater				: 325, //战斗飘字
	SetGlobalMiningVisible			: 326, //跨服争霸队伍成员
	SetGlobalMiningInfoBtn			: 327, //跨服争霸矿信息按钮
	SetGlobalMiningTeam				: 328, //跨服争霸队伍信息
	SetGlobalMiningTips				: 329, //跨服争霸文字信息
	SetGlobalMiningCollect			: 330, //跨服争霸采集倒计时
	SetWuLinChange					: 331, //武林大会挑战
	SetStrongholdName				: 332, //据点名字
	SetStrongholdOccupying			: 333, //据点占领中
	SetStrongholdOccupyNum			: 334, //据点人数
	SetStrongholdKeyStatus			: 335, //拾取据点key状态
}

var HeroSupriseEventIndex:any = {
													DENGLU 				: 5000,						//登陆惊喜,
													JIEMIAN 			: 5001,						//界面惊喜,
													CHONGZHI 			: 5002,						//充值惊喜,
													DAODADIDIAN 	: 5003,						//到达地点惊喜,
													YAOSHOUJI 		: 5004,						//摇手机惊喜,
													SHANGXIAXIAN 	: 5005,						//上线下线惊喜
}

var IsolationCharacterId:any = {
													SupriseNpc 				: -1,					//惊喜npc，即宝箱
													RobberNpcBegin 		: -50	,				//混沌世界NPC，开始
													RobberNpcEnd 			: -100,				//混沌世界NPC，
													TaskNpcBegin			: -101, 			//任务相关NPC
													TaskNpcEnd				: -200, 			//任务相关NPC
													Examiner          : -300,       //答题活动考官
													FogForestBoss     : -400,       //迷雾森林BOSS	
													SpecalEnd					: -1000,			//特殊范围ID
}

//突破等级对应品质
// var PetAwakeLevelToQuality:any = {
// 														[0] : opPetQuality.gray,				// 灰色
// 														[1] : opPetQuality.green,				// 绿色
// 														[2] : opPetQuality.blue,				// 蓝色
// 														[3] : opPetQuality.purple,			// 紫色
// 														[4] : opPetQuality.gold,				// 金色
// }

//机器人对白ID定义，策划要配合这里的ID定义范围
let FakeChatId:any = {
													SPROG_BEGIN 							: 10000,				//新手阶段
													SPROG_END				 					: 20000,				//新手阶段
													SPROG_BOX_WORLD_BEGIN			: 20000, 				//新手假宝箱（世界频道）
													SPROG_BOX_WORLD_End 			: 20100,				//新手假宝箱（世界频道）
													SPROG_BOX_BEGIN						: 20100, 				//新手假宝箱
													SPROG_BOX_End 						: 20200,
													EGG_BOX_BEGIN						: 20201, 				//新手假宝箱
													EGG_BOX_End 						: 20300,				//新手假宝箱
}