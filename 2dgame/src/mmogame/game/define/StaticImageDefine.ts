/*
作者:
    yangguiming

创建时间：
   2013.6.13(周四)

意图：
   静态图片定义

公共接口：
	
*/
//装备品质
////装备品质
//let opEquipQuality : any ={
//	gray	  : 1,		  // 灰色
//	green     : 2,        // 绿色
//	blue      : 3,        // 蓝色
//	purple    : 4,        // 紫色
//	gold      : 5,        // 金色
//	red       : 6,        // 红色
//	color	  : 7,		  // 彩色
//}
// let colorOfQuality : any =[
// 	"gray",
// 	"gray",//	  : 1,		  // 灰色
// 	"lime",//     : 2,        // 绿色
// 	"blue",//      : 3,        // 蓝色
// 	"purple",//    : 4,        // 紫色
// 	"gold",//      : 5,        // 金色
// 	"red",//       : 6,        // 红色
// 	"pink",//	  : 7,		  // 彩色
// ]

//-任务模型定义
//PlayBodyDefine_ = 
//{
//	human_male_1 : 1,   //青衫客
//	human_male_2 : 2,
//   //狂刀将
//	human_female_1 : 3,
// //淑侠女
//	human_female_2 : 4,
// //灵飞燕
//	
//	fairy_male_1 : 5,   //飞羽灵
//	fairy_male_2 : 6,
//   //御天将
//	fairy_female_1 : 7, //轻舞蝶
//	fairy_female_2 : 8, //飞天娇
//	
//	demon_male_1 : 9,   //巨蛮力
//	demon_male_2 : 10,
//  //狮头魔
//	demon_female_1 : 11,//幽影姬
//	demon_female_2 : 12,//玉玲珑
//}
//
//playName_BodyDefine = 
//{
//	[PlayBodyDefine_.human_male_1] : "MOWUSHENG",
//	[PlayBodyDefine_.human_male_2] : "KUANGDAOKE",
//	[PlayBodyDefine_.demon_male_1] : "JUMANWANG",
//	[PlayBodyDefine_.demon_male_2] : "SHIMOGUAI",
//	[PlayBodyDefine_.fairy_male_1] : "XIANYULING",
//	[PlayBodyDefine_.fairy_male_2] : "YUTIANJIANG",
//	
//	[PlayBodyDefine_.human_female_1] : "QIANNVXIA",
//	[PlayBodyDefine_.human_female_2] : "YEFEIYIN",
//	[PlayBodyDefine_.fairy_female_1] : "XUANCAIDIE",
//	[PlayBodyDefine_.fairy_female_2] : "WUTIANJIAO",
//	[PlayBodyDefine_.demon_female_1] : "YOUYINGJI",
//	[PlayBodyDefine_.demon_female_2] : "MEIMAONV",
//}
//
//
//
//PlayModel_BodyDefine = 
//{
//	[PlayBodyDefine_.human_male_1] : 10001,
//	[PlayBodyDefine_.human_female_1] : 10001,
//	[PlayBodyDefine_.demon_male_1] : 10001,
//	[PlayBodyDefine_.demon_female_1] : 10001,
//	[PlayBodyDefine_.fairy_male_1] : 10001,
//	[PlayBodyDefine_.fairy_female_1] : 10001,
//	
//	[PlayBodyDefine_.human_male_2] : 10002,
//	[PlayBodyDefine_.human_female_2] : 10002,
//	[PlayBodyDefine_.demon_male_2] : 10002,
//	[PlayBodyDefine_.demon_female_2] : 10002,
//	[PlayBodyDefine_.fairy_male_2] : 10002,
//	[PlayBodyDefine_.fairy_female_2] : 10002,
//}

//PlayIcon_Define =
//{
//	[PlayBodyDefine_.human_male_1] : "player_icon_1",
//	[PlayBodyDefine_.human_male_2] : "player_icon_2",
//	[PlayBodyDefine_.human_female_1] : "player_icon_3",
//	[PlayBodyDefine_.human_female_2] : "player_icon_4",
//	
//	[PlayBodyDefine_.fairy_male_1] : "player_icon_5",
//	[PlayBodyDefine_.fairy_male_2] : "player_icon_6",
//	[PlayBodyDefine_.fairy_female_1] : "player_icon_7",
//	[PlayBodyDefine_.fairy_female_2] : "player_icon_8",
//	
//	
//	[PlayBodyDefine_.demon_male_1] : "player_icon_9",
//	[PlayBodyDefine_.demon_male_2] : "player_icon_10",
//	[PlayBodyDefine_.demon_female_1] : "player_icon_11",
//	[PlayBodyDefine_.demon_female_2] : "player_icon_12",
//}
ImportType(opEquipQuality)

function GetPlayerModelByBody(body){
	//if(PlayModel_BodyDefine[body] != null ){
	//	return PlayModel_BodyDefine[body]
	//}else{
	//	return PlayModel_BodyDefine[PlayBodyDefine_.human_male_1]
	//}
	return 10002
}

let PetQualityImage:any = {
	[opPetQuality.gray] 		: "zy_zhiYeTextBg01",				// 灰色
	[opPetQuality.green]		: "zy_zhiYeTextBg02",				// 绿色
	[opPetQuality.blue]			: "zy_zhiYeTextBg03",				// 蓝色
	[opPetQuality.purple]		: "zy_zhiYeTextBg04",				// 紫色
	[opPetQuality.gold]			: "zy_zhiYeTextBg05",				// 金色
	[opPetQuality.color]		: "zy_zhiYeTextBg05",				// 彩色
}

let TJPetQualityImage:any = {
	[opPetQuality.gray] 		: "TJ_hui",				// 灰色
	[opPetQuality.green]		: "TJ_lv",				// 绿色
	[opPetQuality.blue]			: "TJ_lan",				// 蓝色
	[opPetQuality.purple]		: "TJ_zi",				// 紫色
	[opPetQuality.gold]			: "TJ_jin",				// 金色
	[opPetQuality.color]		: "TJ_jin",				// 彩色
}

let FightPetQualityImage:any = {
	[opPetQuality.gray] 		: "kuang_1",				// 灰色
	[opPetQuality.green]		: "kuang_2",				// 绿色
	[opPetQuality.blue]			: "kuang_3",				// 蓝色
	[opPetQuality.purple]		: "kuang_4",				// 紫色
	[opPetQuality.gold]			: "kuang_5",				// 金色
	[opPetQuality.color]		: "kuang_5",				// 彩色
}


let FightPetQualityCase:any = {
	[opPetQuality.gray] 		: "ty_pet_pinJieBg01",				// 灰色
	[opPetQuality.green]		: "ty_pet_pinJieBg02",				// 绿色
	[opPetQuality.blue]			: "ty_pet_pinJieBg03",				// 蓝色
	[opPetQuality.purple]		: "ty_pet_pinJieBg04",				// 紫色
	[opPetQuality.gold]			: "ty_pet_pinJieBg05",				// 金色
	[opPetQuality.color]		: "ty_pet_pinJieBg05",				// 金色
}

let EquipQualityImage:any = {
	[opEquipQuality.gray] 	: "ty_zhuangBeiBg01",				// 普通灰色
	[opEquipQuality.green]	: "ty_zhuangBeiBg02",				// 魔法绿色
	[opEquipQuality.blue]		: "ty_zhuangBeiBg03",				// 珍稀蓝色
	[opEquipQuality.purple]		: "ty_zhuangBeiBg04",				// 传奇紫色
	[opEquipQuality.gold]	: "ty_zhuangBeiBg05",				// 传奇金色
	[opEquipQuality.red]	: "ty_zhuangBeiBg06",				// 传奇金色
	[opEquipQuality.color]	: "ty_zhuangBeiBg07",				// 传奇金色
}

//LegendQualityImage = 
//{
//	[opLegendEquipStar.Normal] 	: "kuang_4",
//	[opLegendEquipStar.Senior]	: "kuang_5",
//	[opLegendEquipStar.Precious]: "kuang_7",
//	[opLegendEquipStar.Holy]: "kuang_7",
//}

//EquitQualityColor=
//{
//	[opEquipQuality.White] 		:	gui.Color.navajowhite,
//	[opEquipQuality.Blue] 		:	gui.Color.lime,
//	[opEquipQuality.Gold] 		:	gui.Color.cyan,
//	[opEquipQuality.Orange] 	:	gui.Color.orange,
//	[opEquipQuality.Green] 		:	gui.Color.magenta,
//}


//关卡奖励（可能的奖励）
let CampaignPrizeType:any = {
	MONEY 				: 1,
	YUANBAO				: 2,
	EQUIP					: 3,
	POWER					: 4,
}

let CampaignPrizeImage:any = {
	[CampaignPrizeType.MONEY] 	: "item_50001",
	[CampaignPrizeType.YUANBAO] : "item_50002",
	[CampaignPrizeType.EQUIP] 	: "item_50003",
	[CampaignPrizeType.POWER] 	: "item_50004",
}

//战斗艺术字体
//let FightFontText:any = {
// 	["baoji"] 	: "baoJi",
// 	["mianyi"] 	: "wuDi",//"mianYi",
// 	["shanbi"] 	: "shanBi",
// 	["xishou"] 	: "xiShou",
// 	["break"]		: "beiDaDuan",
// 	["nagative"]: "wuMuBiao",
// 	//["baoji"] 	: "",
// 	//["baoji"] 	: "",
// 	//["baoji"] 	: "",
// }

let moneyIconConfig:any = {
			[opItemUnit.FUNDS]					: "#JINBI",
			[opItemUnit.BIND_CURRENCY]			: "#BIND_YUANBAO",	//绑定元宝
			[opItemUnit.CURRENCY]				: "#YUANBAO",
			[opItemUnit.POWER]					: "#POWER",
			[opItemUnit.JJC_POINT]			: "#JJC_POINT",
			//[opItemUnit.ROBBER_PIECES]	: "#ROBBER_PIECES",
			[opItemUnit.WUDOU_POINT]		: "#WUDOU_POINT",
			[opItemUnit.WUDOUTEAM_POINT]: "#WUDOUTEAM_POINT",
			[opItemUnit.WUDOUSERVER_POINT]: "#GLOBAL_WPOINT",
			[opItemUnit.ZHENXING_POINT] : "#CAMP_POINT",
			[opItemUnit.HONOR_POINT] 		: "#HONORPOINT",
			[opItemUnit.LEAGUE_POINT] 	: "#GLOBAL_LPOINT",
			[opItemUnit.GUOZHAN_POINT] 	: "#NATION_WAR_ICON",
			[opItemUnit.FACTION_POINT] 	: "#FACTION_BUILD_POINT",			
		}
		
// let WingTotemImage:any = {
// 	//速度
// 	[objectField.WING_FIELD_TOTEM_SPEED_DEC] : 
// 		{
// 			[opWingTotemQuality.gray]    : "tt_tuTeng03_1",
// 			[opWingTotemQuality.green]   : "tt_tuTeng03_2",
// 			[opWingTotemQuality.blue]    : "tt_tuTeng03_3",
// 			[opWingTotemQuality.purple]  : "tt_tuTeng03_4",
// 			[opWingTotemQuality.gold]    : "tt_tuTeng03_5",
// 			[opWingTotemQuality.colour]  : "tt_tuTeng03_6",
// 		},
// 	//暴伤减免
// 	[objectField.WING_FIELD_TOTEM_CRI_ATT_DEC] : 
// 		{
// 			[opWingTotemQuality.gray]    : "tt_tuTeng01_1", 
// 			[opWingTotemQuality.green]   : "tt_tuTeng01_2", 
// 			[opWingTotemQuality.blue]    : "tt_tuTeng01_3", 
// 			[opWingTotemQuality.purple]  : "tt_tuTeng01_4", 
// 			[opWingTotemQuality.gold]    : "tt_tuTeng01_5", 
// 			[opWingTotemQuality.colour]  : "tt_tuTeng01_6", 
// 		},
// 	//抗暴
// 	[objectField.WING_FIELD_TOTEM_CRITICAL_DEC] : 
// 		{
// 			[opWingTotemQuality.gray]    : "tt_tuTeng02_1", 
// 			[opWingTotemQuality.green]   : "tt_tuTeng02_2", 
// 			[opWingTotemQuality.blue]    : "tt_tuTeng02_3", 
// 			[opWingTotemQuality.purple]  : "tt_tuTeng02_4", 
// 			[opWingTotemQuality.gold]    : "tt_tuTeng02_5", 
// 			[opWingTotemQuality.colour]  : "tt_tuTeng02_6", 
// 		},
// 	////伤害减免
// 	//[objectField.WING_FIELD_TOTEM_DAMAGE_DEC] = 
// 	//	{
// 	//		[opWingTotemQuality.gray]    : "tt_tuTeng04_1", 
// 	//		[opWingTotemQuality.green]   : "tt_tuTeng04_2", 
// 	//		[opWingTotemQuality.blue]    : "tt_tuTeng04_3", 
// 	//		[opWingTotemQuality.purple]  : "tt_tuTeng04_4", 
// 	//		[opWingTotemQuality.gold]    : "tt_tuTeng04_5", 
// 	//		[opWingTotemQuality.colour]  : "tt_tuTeng04_6", 
// 	//	},
// }

// let WingTotemImageSelect:any = {
// 	[objectField.WING_FIELD_TOTEM_SPEED_DEC] : "tt_tuTengXZ03",
// 	[objectField.WING_FIELD_TOTEM_CRI_ATT_DEC] : "tt_tuTengXZ01",
// 	[objectField.WING_FIELD_TOTEM_CRITICAL_DEC] : "tt_tuTengXZ02", 
// 	//[objectField.WING_FIELD_TOTEM_DAMAGE_DEC] : "tt_tuTengXZ04",
// }		      

let ProfessionQualityIcon:any = {
	[opPetQuality.gray] 	: "ty_pet_pinJieBg01", 
	[opPetQuality.green] 	: "ty_pet_pinJieBg02", 
	[opPetQuality.blue] 	: "ty_pet_pinJieBg03", 
	[opPetQuality.purple] 	: "ty_pet_pinJieBg04", 
	[opPetQuality.gold] 	: "ty_pet_pinJieBg05", 
	[opPetQuality.color] 	: "ty_pet_pinJieBg06", 
}

let ProfessionQualityNameBG:any = {
	[opPetQuality.gray] 	: "zy_zhiYeTextBg01", 
	[opPetQuality.green] 	: "zy_zhiYeTextBg02", 
	[opPetQuality.blue] 	: "zy_zhiYeTextBg03", 
	[opPetQuality.purple] : "zy_zhiYeTextBg04", 
	[opPetQuality.gold] 	: "zy_zhiYeTextBg05", 
	[opPetQuality.color] 	: "zy_zhiYeTextBg05",
}

let ProfessionQualityBG:any = {
	[opPetQuality.gray] 	: "ty_petTextDi01", 
	[opPetQuality.green] 	: "ty_petTextDi02", 
	[opPetQuality.blue] 	: "ty_petTextDi03", 
	[opPetQuality.purple] : "ty_petTextDi04", 
	[opPetQuality.gold] 	: "ty_petTextDi05", 
	[opPetQuality.color] 	: "ty_petTextDi05",
}


let PlayerStatusToName:any = {
	[opStatusType.STATUS_TYPE_TICKET] 							: "BROKENHISTORY_TXT40",
	[opStatusType.STATUS_TYPE_EREN] 								: "BROKENHISTORY_TXT41",
	[opStatusType.STATUS_TYPE_BAOTU] 								: "BROKENHISTORY_TXT42",
	[opStatusType.STATUS_TYPE_MOTOU] 								: "BROKENHISTORY_TXT43",
	[opStatusType.STATUS_TYPE_TEAMMATE] 						: "BROKENHISTORY_TXT44",
	[opStatusType.STATUS_TYPE_ROBBER_BBOX]					: "BROKENHISTORY_TXT54",
	[opStatusType.STATUS_TYPE_FACT_WAR] 						: "BROKENHISTORY_TXT40",
	
}

//状态对应图标
let PlayerStatusToImage:any = {
	
	[opStatusType.STATUS_TYPE_FIGHT] 							: "TB_zhanDou",
	[opStatusType.STATUS_TYPE_TICKET] 							: "TB_lingPai",
	
	[opStatusType.STATUS_TYPE_EREN] 								: "TB_eRen",
	[opStatusType.STATUS_TYPE_BAOTU] 								: "TB_baoTu",
	[opStatusType.STATUS_TYPE_MOTOU] 								: "TB_moTou",
	
	[opStatusType.STATUS_TYPE_TEAM] 								: "TB_duiZhang",
	[opStatusType.STATUS_TYPE_TEAMMATE] 						: "TB_duiYuan",
	
	[opStatusType.STATUS_TYPE_ROBBER_BBOX]					: "TB_xuRuo",
	[opStatusType.	STATUS_TYPE_EMPTY_FIGHT]					: "TB_ShengDiGuaJi",
	
	[opStatusType.STATUS_TYPE_FACT_WAR]							: "TB_junTuanZhan",

	[opStatusType.STATUS_TYPE_MENGZHU] 							: "TB_zhanDou",
}