////////////////////////////RPC索引,根据protocol字段指定，从1开始//////////////////////////////////////////////
let dataTypeMap = null
let dataFieldIndexMap: any = {}

function bindType(typeName) {
	let dataTypeList = dataTypeMap[typeName]
	//Log.Assert(dataTypeList != null, "objectField bindType Error%s", typeName)

	dataFieldIndexMap = {}

	for (let i = 0; i < dataTypeList.length; i++) {
		let dataType = dataTypeList[i]

		let paramSign = splitString(dataType, ":")
		//Log.Assert(paramSign.length == 2)

		let fieldName = paramSign[0]
		dataFieldIndexMap[fieldName] = i
	}
}

function bind(fieldName) {
	let index = dataFieldIndexMap[fieldName] + 1
	//Log.Assert(index != null, "objectField bind Error:%s", fieldName)
	return index
}

function initRpcObjectField() {
	dataTypeMap = RpcProxy.getDataTypeMap()


	bindType("ActorRole")	//主角
	objectField.ActorRole_EntryIdIndex = bind("entryid")
	objectField.ActorRole_StageIndex = bind("stage")
	objectField.ActorRole_StageExpIndex = bind("stageexp")
	objectField.ActorRole_SkillLevelListIndex = bind("skilllevellist")
	objectField.ActorRole_SkillOrderListIndex = bind("skillorderlist")
	objectField.ActorRole_TitleIndexIndex = bind("titleindex")
	objectField.ActorRole_UnlockTitleListIndex = bind("unlocktitlelist")
	objectField.ActorRole_FashionIndexIndex = bind("fashionindex")
	objectField.ActorRole_UnlockFashionListIndex = bind("unlockfashionlist")
	objectField.ActorRole_EquipListIndex = bind("equiplist")

	bindType("ActorPet")//伙伴
	objectField.ActorPet_EntryIdIndex = bind("entryid")
	objectField.ActorPet_StageIndex = bind("stage")
	objectField.ActorPet_StageExpIndex = bind("stageexp")
	objectField.ActorPet_CombatPosIndex = bind("combatpos")
	objectField.ActorPet_NameIndex = bind("name")
	objectField.ActorPet_GrowExpIndex = bind("growexp")
	objectField.ActorPet_WashSkillNumIndex = bind("washskillnum")
	objectField.ActorPet_PassSkillListIndex = bind("passskilllist")
	objectField.ActorPet_WashSkillListIndex = bind("washskilllist")

	bindType("ActorXianlv")//仙侣
	objectField.ActorXianlv_EntryIdIndex = bind("entryid")
	objectField.ActorXianlv_StageIndex = bind("stage")
	objectField.ActorXianlv_StageExpIndex = bind("stageexp")
	objectField.ActorXianlv_CombatPosIndex = bind("combatpos")
	objectField.ActorXianlv_StartIndex = bind("start")

	bindType("ActorTempCell")//通用玩法
	objectField.ActorTempCell_EntryIdIndex = bind("entryid")
	objectField.ActorTempCell_ShowIndexIndex = bind("showindex")
	objectField.ActorTempCell_StageIndex = bind("stage")
	objectField.ActorTempCell_StageExpIndex = bind("stageexp")
	objectField.ActorTempCell_SkillLevelListIndex = bind("skilllevellist")
	objectField.ActorTempCell_EquipListIndex = bind("equiplist")
	objectField.ActorTempCell_DrugNumIndex = bind("drugnum")
	objectField.ActorTempCell_CurSkinIndex = bind("curskin")
	objectField.ActorTempCell_SkinListIndex = bind("skinlist")
	objectField.ActorTempCell_CurShapeIndex = bind("curshape")


	bindType("SimpleCellFun")//丹药和筋脉
	objectField.ActorTianxian_DanyaoUseList = bind("danyaouselist")
	objectField.ActorTianxian_JingmaiIndexList = bind("jingmailist")

	


	bindType("PlayerEquipForge")//
	objectField.EquipForge_qianghua = bind("qianghua")
	objectField.EquipForge_jinglian = bind("jinglian")
	objectField.EquipForge_duanlian = bind("duanlian")
	objectField.EquipForge_baoshi = bind("baoshi")

	bindType("HeroInfo")	//角色信息
	objectField.PLAYER_FIELD_ID = bind("id")
	objectField.PLAYER_FIELD_NAME = bind("name")
	objectField.PLAYER_FIELD_VOCATION = bind("vocation")
	objectField.PLAYER_FIELD_SEX = bind("sexId")
	objectField.PLAYER_FIELD_LEVEL = bind("level")
	objectField.PLAYER_FIELD_ROLE_EXP_S = bind("exp")
	objectField.PLAYER_FIELD_VIP_LEVLE = bind("VIP_level")
	objectField.PLAYER_FIELD_VIP_EXP = bind("VIP_exp")
	objectField.PLAYER_FIELD_SAVERECORD = bind("saveRecord") //全局记录
	objectField.PLAYER_FIELD_FUNDS = bind("funds")    //金币
	objectField.PLAYER_FIELD_GOLD = bind("gold") // 不绑定元宝      
	objectField.PLAYER_FIELD_BIND_GOLD = bind("bindGold") //绑定元宝
	objectField.PLAYER_FIELD_FACTION = bind("faction") //帮派

	objectField.PLAYER_COMBAT_FORCE = bind("combatForce") //战力
	objectField.PLAYER_FIELD_STATUS = bind("status") //状态
	objectField.PLAYER_CHAT_WINDOW_TYPE = bind("chatBubbleType") //聊天气泡
	objectField.PLAYER_FIELD_BODY = bind("body") //模型
	objectField.PLAYER_FIELD_POWER = bind("power") //体力
	objectField.PLAYER_FIELD_EQUIP_MAX = bind("equipMax") //装备最大格子
	objectField.PLAYER_CAMPAGIN_SCHEDULE = bind("campainSchedule") //关卡进度
	objectField.PLAYER_MONEY_TABLE = bind("moneyTable") //货币积分集合
	objectField.PLAYER_FIELD_SPOUSEID = bind("spouseId") //配偶ID


	bindType("ItemInfo")	//角色信息
	objectField.ITEM_FIELD_ID = bind("id")
	objectField.ITEM_FIELD_ENTRY = bind("entry")
	objectField.ITEM_FIELD_COUNT = bind("count")
	objectField.ITEM_FIELD_POSITION = bind("position")
	objectField.ITEM_FIELD_STORE = bind("store")
	objectField.ITEM_FIELD_BUY_PRICE = bind("buy_price")
	objectField.ITEM_FIELD_SELL_PRICE = bind("sell_price")
	objectField.ITEM_FIELD_UNIT = bind("price_type")
	objectField.ITEM_FIELD_STORE_TIME = bind("store_time")
	objectField.ITEM_FIELD_DEADLINE_TIME = bind("deadline_time")
	objectField.ITEM_FIELD_USE_EFFECT_TIME = bind("use_effect_time")
	objectField.ITEM_FIELD_EQUIP_OWNER = bind("equip_owner")
	objectField.ITEM_FIELD_EQUIP_STAR = bind("equip_star")
	objectField.ITEM_FIELD_EQUIP_SCORE = bind("equip_score")
	objectField.ITEM_FIELD_SOURCE = bind("source")
	objectField.ITEM_FIELD_EQUIP_ENHANCE_LEVEL = bind("enhance_level")
	objectField.ITEM_FIELD_EQUIP_BUILD = bind("equip_build")

	objectField.ITEM_FIELD_STATUS = bind("status")
	objectField.ITEM_FIELD_QUALITY = bind("quality")
	objectField.ITEM_FIELD_ADD_NUM = bind("add_num")
	objectField.ITEM_FIELD_LOST_EFFECT_TIME 			= bind("lost_effect_time")
	objectField.ITEM_FIELD_BEST_ATTRIBUTE 				= bind("best_attribute")	
	objectField.ITEM_FIELD_BASE_ATTRIBUTE 				= bind("base_attribute")	
	objectField.ITEM_FIELD_TALISMAN_LOCK 				  = bind("talisman_lock")	

}

//注意:同种对象不能重叠属性索引
let objectField: any = {
	OBJECT_FIELD_ID: 0,
	OBJECT_FIELD_TYPE: 1,
	OBJECT_FIELD_ENTRY: 2,
	OBJECT_FIELD_UPDATE_DELTA: 3,
	OBJECT_END: 4,
	//
	UNIT_BASE_BEGIN: 5,
	UNIT_LASTABILITY_BEGIN: 32,
	//ACTOR_BASE_BEGIN                : 158,
	PLAYER_FIELD_BEGIN: 258,
	MONSTER_FIELD_BEGIN: 258,
	// PARTNER_BASE_BEGIN              : 258,
	// VOCATION_BASE_BEGIN             : 258,
	//ITEM_FIELD_BEGIN                : 258,
	// FAIRY_BASE_BEGIN                : 258,
	// WING_BASE_BEGIN                 : 258,
	// IMMORTALS_BASE_BEGIN						: 258,
	ITEM_FIELD_VARY_ATTRIBUTE_BEGIN: 1000,
}

//////////////////////////////////////UNIT//////////////////////////////////////////
//base
//objectField.UNIT_BASE_BEGIN        = objectField.OBJECT_END + 1      //             5
// objectField.UNIT_FIELD_LEVEL       = objectField.UNIT_BASE_BEGIN + 0 // 等级        5
// objectField.UNIT_FIELD_EXPERIENCE  = objectField.UNIT_BASE_BEGIN + 1 // 当前经验    6
// objectField.UNIT_FIELD_POTENTIAL   = objectField.UNIT_BASE_BEGIN + 2 // 潜力        7
// objectField.UNIT_FIELD_ICON        = objectField.UNIT_BASE_BEGIN + 3 // 头像        8
// objectField.UNIT_FIELD_TYPE        = objectField.UNIT_BASE_BEGIN + 4 // 对象类型    9
// objectField.UNIT_FIELD_NAME        = objectField.UNIT_BASE_BEGIN + 5 // 名字    9
// objectField.UNIT_BASE_END          = objectField.UNIT_BASE_BEGIN + 5 //

// //生命	45757	速度	53
// //攻击	17703	防御	6498
// //命中	265	闪避	265
// //暴击	265	抗暴	265
// //无视防御	10	减免无视	10
// //伤害增加	0.00%	伤害减少	0.00%
// //暴伤加成	0.00%	暴伤减免	0.00%
// //PVP伤加	0.00%	PVP伤减	0.00%
// //PVE伤加	0.00%	PVE伤减	0.00%

// //last ability
objectField.UNIT_FIELD_VALUE_BEGIN      = objectField.UNIT_LASTABILITY_BEGIN + 0  //属性值开始     32
objectField.UNIT_FIELD_MAX_HP           = objectField.UNIT_LASTABILITY_BEGIN + 0  //最大生命       32
objectField.UNIT_FIELD_ATTACK           = objectField.UNIT_LASTABILITY_BEGIN + 1  //攻击力         33
objectField.UNIT_FIELD_DEFENCE          = objectField.UNIT_LASTABILITY_BEGIN + 2  //护甲           34
objectField.UNIT_FIELD_SPEED            = objectField.UNIT_LASTABILITY_BEGIN + 3  //出手速度       35
objectField.UNIT_FIELD_HITRATE          = objectField.UNIT_LASTABILITY_BEGIN + 4 //命中值          36
objectField.UNIT_FIELD_DODGE            = objectField.UNIT_LASTABILITY_BEGIN + 5  //闪避值         37
objectField.UNIT_FIELD_CRITICAL         = objectField.UNIT_LASTABILITY_BEGIN + 6  //暴击值         38
objectField.UNIT_FIELD_CRITICAL_DEC     = objectField.UNIT_LASTABILITY_BEGIN + 7  //抗暴值         39
objectField.UNIT_FIELD_DEF_THR          = objectField.UNIT_LASTABILITY_BEGIN + 8  //无视防御       40
objectField.UNIT_FIELD_DEF_THR_DEC      = objectField.UNIT_LASTABILITY_BEGIN + 9  //减免无视防御   41
objectField.UNIT_FIELD_ATT_INC          = objectField.UNIT_LASTABILITY_BEGIN + 10  //伤害增加      42
objectField.UNIT_FIELD_ATT_DEC          = objectField.UNIT_LASTABILITY_BEGIN + 11  //伤害减少      43
objectField.UNIT_FIELD_CRI_ATT          = objectField.UNIT_LASTABILITY_BEGIN + 12  //暴伤          44
objectField.UNIT_FIELD_CRI_ATT_DEC      = objectField.UNIT_LASTABILITY_BEGIN + 13  //暴免          45
objectField.UNIT_FIELD_PVP_ATT_INC      = objectField.UNIT_LASTABILITY_BEGIN + 14  //PVP伤害增加   46
objectField.UNIT_FIELD_PVP_ATT_DEC      = objectField.UNIT_LASTABILITY_BEGIN + 15  //PVP伤害减少   47
objectField.UNIT_FIELD_PVE_ATT_INC      = objectField.UNIT_LASTABILITY_BEGIN + 16  //PVE伤害增加   48
objectField.UNIT_FIELD_PVE_ATT_DEC      = objectField.UNIT_LASTABILITY_BEGIN + 17  //PVE伤害减少   49
objectField.UNIT_FIELD_VALUE_END        = objectField.UNIT_LASTABILITY_BEGIN + 17 //属性值结束     49
//
objectField.UNIT_FIELD_PER_BEGIN        = objectField.UNIT_LASTABILITY_BEGIN + 18 //百分比开始     50
objectField.UNIT_FIELD_HP_PER           = objectField.UNIT_LASTABILITY_BEGIN + 18 //生命百分比     50
objectField.UNIT_FIELD_ATT_PER          = objectField.UNIT_LASTABILITY_BEGIN + 19 //攻击百分比     51
objectField.UNIT_FIELD_DEF_PER          = objectField.UNIT_LASTABILITY_BEGIN + 20 //防御百分比     52
objectField.UNIT_FIELD_SPEED_PER        = objectField.UNIT_LASTABILITY_BEGIN + 21 //速度百分比     53
objectField.UNIT_FIELD_HIT_PER          = objectField.UNIT_LASTABILITY_BEGIN + 22 //命中百分比     54
objectField.UNIT_FIELD_DODGE_PER        = objectField.UNIT_LASTABILITY_BEGIN + 23 //闪避百分比     55
objectField.UNIT_FIELD_CRIT_PER         = objectField.UNIT_LASTABILITY_BEGIN + 24 //暴击值百分比   56
objectField.UNIT_FIELD_CRIT_DEC_PER     = objectField.UNIT_LASTABILITY_BEGIN + 25 //抗暴值百分比   57
objectField.UNIT_FIELD_DEF_THR_PER      = objectField.UNIT_LASTABILITY_BEGIN + 26 //无视防御百分比     58
objectField.UNIT_FIELD_DEF_THR_DEC_PER  = objectField.UNIT_LASTABILITY_BEGIN + 27 //减免无视防御百分比   59
objectField.UNIT_FIELD_PER_END          = objectField.UNIT_LASTABILITY_BEGIN + 27 //百分比结束     60
//
objectField.UNIT_LASTABILITY_END        = objectField.UNIT_LASTABILITY_BEGIN + 27 //               60
//
objectField.UNIT_FIELD_HP               = objectField.UNIT_LASTABILITY_BEGIN   + 28  // 当前生命      65
objectField.UNIT_FIELD_MP               = objectField.UNIT_LASTABILITY_BEGIN   + 29 // 当前能量      66
objectField.UNIT_END                    = objectField.UNIT_LASTABILITY_BEGIN   + 30 //               67



// //主角 宠物 仙侣 变化的属性//
// objectField.ACTOR_FIELD_STAGE_LEVEL         = objectField.ACTOR_BASE_BEGIN + 1  //多少阶        159
// objectField.ACTOR_FIELD_STAGE_EXP			= objectField.ACTOR_BASE_BEGIN + 2  //升阶经验      160
// objectField.ACTOR_FIELD_COMBAT_POS        	= objectField.ACTOR_BASE_BEGIN + 3  //战力            162
// objectField.ACTOR_FIELD_GROW_EXP         	= objectField.ACTOR_BASE_BEGIN + 4  //资质经验        163
// objectField.ACTOR_FIELD_WASH_NUM	        = objectField.ACTOR_BASE_BEGIN + 5  //洗了多少次  164
// objectField.ACTOR_FIELD_SKILL_REGULAR       = objectField.ACTOR_BASE_BEGIN + 6  //正式的技能列表  164
// objectField.ACTOR_FIELD_SKILL_WASH          = objectField.ACTOR_BASE_BEGIN + 7  //洗出来的技能列表  164
// objectField.ACTOR_FIELD_UP_START            = objectField.ACTOR_BASE_BEGIN + 8  //仙侣升星
// objectField.ACTOR_FIELD_SKILL_LEVEL         = objectField.ACTOR_BASE_BEGIN + 9  //主角技能等级
// objectField.ACTOR_FIELD_SKILL_ORDER         = objectField.ACTOR_BASE_BEGIN + 10 //主角技能次序

// //通用的属性//
// objectField.TEMPCELLFUN_FIELD_SHOW_INDEX           = objectField.ACTOR_BASE_BEGIN + 21  //外形  164
// objectField.TEMPCELLFUN_FIELD_STAGE_LEVEL          = objectField.ACTOR_BASE_BEGIN + 22  //洗出来的技能列表  164
// objectField.TEMPCELLFUN_FIELD_STAGE_EXP            = objectField.ACTOR_BASE_BEGIN + 23  //洗出来的技能列表  164
// objectField.TEMPCELLFUN_FIELD_SKILL_LIST           = objectField.ACTOR_BASE_BEGIN + 24  //洗出来的技能列表  164
// objectField.TEMPCELLFUN_FIELD_EQUIP_LIST           = objectField.ACTOR_BASE_BEGIN + 25  //洗出来的技能列表  164
// objectField.TEMPCELLFUN_FIELD_DRUG_NUM             = objectField.ACTOR_BASE_BEGIN + 26  //洗出来的技能列表  164
// objectField.TEMPCELLFUN_FIELD_SKIN_CUR             = objectField.ACTOR_BASE_BEGIN + 27  //洗出来的技能列表  164
// objectField.TEMPCELLFUN_FIELD_SKIN_LIST            = objectField.ACTOR_BASE_BEGIN + 28  //洗出来的技能列表  164
// objectField.TEMPCELLFUN_FIELD_SHARE_CUR            = objectField.ACTOR_BASE_BEGIN + 39  //洗出来的技能列表  164
// //////////////////////////////////////Player////////////////////////////////////////-
// //objectField.PLAYER_FIELD_BEGIN                 = objectField.UNIT_END + 200          //                         263
// objectField.PLAYER_FIELD_LOGINTIME             = objectField.PLAYER_FIELD_BEGIN + 0  // 登陆时间                258
// objectField.PLAYER_FIELD_ACCOUNTID             = objectField.PLAYER_FIELD_BEGIN + 1  // 帐户Id                  259
// objectField.PLAYER_FIELD_NAME                  = objectField.PLAYER_FIELD_BEGIN + 2  // 名称                    260
// objectField.PLAYER_FIELD_NAMEBIT               = objectField.PLAYER_FIELD_BEGIN + 3  // 名称占位                261
// objectField.PLAYER_FIELD_VOCATION              = objectField.PLAYER_FIELD_BEGIN + 4  // 职业                    262
// objectField.PLAYER_FIELD_FACTION               = objectField.PLAYER_FIELD_BEGIN + 5  // 帮派                    263
// objectField.PLAYER_FIELD_POWER                 = objectField.PLAYER_FIELD_BEGIN + 6  // 体力                    264
// objectField.PLAYER_FIELD_ENERGY                = objectField.PLAYER_FIELD_BEGIN + 7  // 能量                    265
// objectField.PLAYER_FIELD_ERRANTRY              = objectField.PLAYER_FIELD_BEGIN + 8  // 指引记录                266
// objectField.PLAYER_FIELD_STATUS                = objectField.PLAYER_FIELD_BEGIN + 9  // 状态                    267
// objectField.PLAYER_FIELD_RESERVEFUNDS          = objectField.PLAYER_FIELD_BEGIN + 10 // 金币                    268
// objectField.PLAYER_FIELD_RESERVEFUNDS_BIT      = objectField.PLAYER_FIELD_BEGIN + 11 // 金币占位                269
// objectField.PLAYER_FIELD_FRIEND_AGREE          = objectField.PLAYER_FIELD_BEGIN + 12 // 添加好友验证            270
// objectField.PLAYER_FIELD_MESSAGE_REFUSE        = objectField.PLAYER_FIELD_BEGIN + 13 // 拒绝任何信息            271
// objectField.PLAYER_FIELD_SAVERECORD            = objectField.PLAYER_FIELD_BEGIN + 14 // 保存记录                272
// objectField.PLAYER_FIELD_SAVERECORD_BIT        = objectField.PLAYER_FIELD_BEGIN + 15 // 保存记录占位            273
// objectField.PLAYER_FIELD_BODY                  = objectField.PLAYER_FIELD_BEGIN + 16 // 身体                    274
// objectField.PLAYER_FIELD_MAPID                 = objectField.PLAYER_FIELD_BEGIN + 17 // 地图ID                  275
// objectField.PLAYER_FIELD_MAPX                  = objectField.PLAYER_FIELD_BEGIN + 18 // 地图x坐标               276
// objectField.PLAYER_FIELD_MAPY                  = objectField.PLAYER_FIELD_BEGIN + 19 // 地图y坐标               277
// objectField.PLAYER_FIELD_PETUPDATEMASK         = objectField.PLAYER_FIELD_BEGIN + 20 // 宠物更新标识            278
// objectField.PLAYER_FIELD_ITEMUPDATEMASK        = objectField.PLAYER_FIELD_BEGIN + 21 // 物品更新标识            279
// objectField.PLAYER_FIELD_TASK_UPDATE           = objectField.PLAYER_FIELD_BEGIN + 22 // 任务更新标志            280
// objectField.PLAYER_FIELD_PACKET_MAX            = objectField.PLAYER_FIELD_BEGIN + 23 // 背包最大容量            281
// objectField.PLAYER_FIELD_PETMAX                = objectField.PLAYER_FIELD_BEGIN + 24 // 宠物最大数量            282
// objectField.PLAYER_FIELD_TEAM_UPDATE_MASK      = objectField.PLAYER_FIELD_BEGIN + 25 // 队伍更新标志            283
// objectField.PLAYER_FIELD_ELEMENT               = objectField.PLAYER_FIELD_BEGIN + 26 // 五行属性                284
// objectField.PLAYER_FIELD_JJC_POINT             = objectField.PLAYER_FIELD_BEGIN + 27 // JJC积分                 285
// objectField.PLAYER_FIELD_WAREHOUSE_MAX         = objectField.PLAYER_FIELD_BEGIN + 28 // 仓库最大容量            286
// objectField.PLAYER_FIELD_WAREHOUSE_PET_MAX     = objectField.PLAYER_FIELD_BEGIN + 29 // 宠物仓库最大容量        287
// objectField.PLAYER_FIELD_WAREHOUSE_MONEY       = objectField.PLAYER_FIELD_BEGIN + 30 // 仓库现银                288
// objectField.PLAYER_FIELD_ROLE_EXP_S            = objectField.PLAYER_FIELD_BEGIN + 31 // 经验                    289
// objectField.PLAYER_FIELD_ROLE_EXP_S_BIT        = objectField.PLAYER_FIELD_BEGIN + 32 // 经验                    290
// objectField.PLAYER_FIELD_RMB_GOLD              = objectField.PLAYER_FIELD_BEGIN + 33 // 晶石(元宝)              291
// objectField.PLAYER_FIELD_GOTO                  = objectField.PLAYER_FIELD_BEGIN + 34 // 被动换地图              292
// objectField.PLAYER_FIELD_RANGE_DISABLE         = objectField.PLAYER_FIELD_BEGIN + 35 // 不发送数据              293
// //装备加持
// objectField.PLAYER_FIELD_ENCHANT_BEGIN         = objectField.PLAYER_FIELD_BEGIN + 36 // 装备加持开始            294
// objectField.PLAYER_FIELD_WEAPON_LEVEL          = objectField.PLAYER_FIELD_BEGIN + 36 // 武器加持等级            294
// objectField.PLAYER_FIELD_CAP_LEVEL             = objectField.PLAYER_FIELD_BEGIN + 37 // 头盔加持等级            295
// objectField.PLAYER_FIELD_CLOTH_LEVEL           = objectField.PLAYER_FIELD_BEGIN + 38 // 衣服加持等级            296
// objectField.PLAYER_FIELD_BELT_LEVEL            = objectField.PLAYER_FIELD_BEGIN + 39 // 戒指加持等级            297
// objectField.PLAYER_FIELD_SHOES_LEVEL           = objectField.PLAYER_FIELD_BEGIN + 40 // 鞋子加持等级            298
// objectField.PLAYER_FIELD_NECK_LEVEL            = objectField.PLAYER_FIELD_BEGIN + 41 // 饰品加持等级            299
// objectField.PLAYER_FIELD_ENCHANT_END           = objectField.PLAYER_FIELD_BEGIN + 41 // 装备加持结束            299
// //
// objectField.PLAYER_FIELD_INTERACT_COUNT        = objectField.PLAYER_FIELD_BEGIN + 44 // 互动次数                302
// objectField.PLAYER_FIELD_INTERACT_PET          = objectField.PLAYER_FIELD_BEGIN + 45 // 互动宠物                303
// objectField.PLAYER_FIELD_ISVITED               = objectField.PLAYER_FIELD_BEGIN + 46 // 是否被邀请              304
// objectField.PLAYER_FIELD_VIP_LEVLE             = objectField.PLAYER_FIELD_BEGIN + 47 // vip等级                 305
// objectField.PLAYER_FIELD_VIP_EXP               = objectField.PLAYER_FIELD_BEGIN + 48 // vip经验                 306
// objectField.PLAYER_FIELD_LEGEND_POWDER         = objectField.PLAYER_FIELD_BEGIN + 49 // 传奇粉末                307
// objectField.PLAYER_FIELD_FAIRY_UPDATE_MASK     = objectField.PLAYER_FIELD_BEGIN + 50 // 精灵更新                308
// objectField.PLAYER_FIELD_COMBAT_TEAM_ID        = objectField.PLAYER_FIELD_BEGIN + 51 // 战队id                  309
// objectField.PLAYER_FIELD_WING_UPDATE_MASK      = objectField.PLAYER_FIELD_BEGIN + 52 // 翅膀更新                310
// objectField.PLAYER_FIELD_FACTION_BUILD_POINT   = objectField.PLAYER_FIELD_BEGIN + 53 // 军团建筑积分            311
// objectField.PLAYER_FIELD_USE_SACHOOP_LV        = objectField.PLAYER_FIELD_BEGIN + 54 // 使用法阵等级            312
// objectField.PLAYER_FIELD_MASK                  = objectField.PLAYER_FIELD_BEGIN + 55 // 面具                    313
// objectField.PLAYER_FIELD_SEX                   = objectField.PLAYER_FIELD_BEGIN + 56 // 性别                    314
// objectField.PLAYER_COMBAT_FORCE                = objectField.PLAYER_FIELD_BEGIN + 57 // 总战力                  315
// objectField.PLAYER_COMBAT_FORCEBIT             = objectField.PLAYER_FIELD_BEGIN + 58 // 总战力占位              316
// objectField.PLAYER_FIELD_WEDDING_SPOUSE_ID     = objectField.PLAYER_FIELD_BEGIN + 59 // 婚礼进行时伴侣的ID      317
// objectField.PLAYER_FIELD_SPOUSE_ID             = objectField.PLAYER_FIELD_BEGIN + 60 // 伴侣ID                  318
// objectField.PLAYER_FIELD_KISS_NUM_ID           = objectField.PLAYER_FIELD_BEGIN + 61 // 女神之吻                319
// objectField.PLAYER_FIELD_VOCAT_UPDATE_MASK     = objectField.PLAYER_FIELD_BEGIN + 62 // 职业更新标志            320
// objectField.PLAYER_GROW_RANDOM_INDEX           = objectField.PLAYER_FIELD_BEGIN + 63 // 成长的随机索引          321
// objectField.PLAYER_VOCATION_COMBAT_FORCE       = objectField.PLAYER_FIELD_BEGIN + 64 // 职业战力                322
// objectField.PLAYER_SKY_TOWER_POINT             = objectField.PLAYER_FIELD_BEGIN + 65 // 试炼场                  323
// objectField.PLAYER_LEAGUE_MATCH_POINT          = objectField.PLAYER_FIELD_BEGIN + 66 // 天梯荣誉                324
// objectField.PLAYER_ZHEN_YING_POINT             = objectField.PLAYER_FIELD_BEGIN + 67 // 众神战积分              325
// objectField.PLAYER_HOME_PAGE_CHARM             = objectField.PLAYER_FIELD_BEGIN + 68 // 魅力值                  326
// objectField.PLAYER_HOME_PAGE_CHARMBIT          = objectField.PLAYER_FIELD_BEGIN + 69 // 魅力值占位              327
// objectField.PLAYER_CHAT_WINDOW_TYPE            = objectField.PLAYER_FIELD_BEGIN + 70 // 聊天框                  328
// objectField.PLAYER_ROBBER_NORMAL_KILL          = objectField.PLAYER_FIELD_BEGIN + 71 // 圣地击杀怪物            329
// objectField.PLAYER_CAMPAGIN_SCHEDULE           = objectField.PLAYER_FIELD_BEGIN + 72 // 关卡进度                330
// objectField.PLAYER_ROBBER_INCOME_RATIO         = objectField.PLAYER_FIELD_BEGIN + 73 // 圣地效率                331
// objectField.PLAYER_IMMORTALS_FIELD_LEVEL       = objectField.PLAYER_FIELD_BEGIN + 74 // 佩戴的神兵等级          332
// objectField.PLAYER_IMMORTALS_UPDATE_MASK       = objectField.PLAYER_FIELD_BEGIN + 75 // 神兵更新标志位          333
// objectField.PLAYER_FACT_TASK_POINT             = objectField.PLAYER_FIELD_BEGIN + 76 // 神兵更新标志位          334
// objectField.PLAYER_FIELD_BIND_CURRENCY         = objectField.PLAYER_FIELD_BEGIN + 77 // 绑定元宝                335
// objectField.PLAYER_FIELD_TOTALL_BIND_CURRENCY  = objectField.PLAYER_FIELD_BEGIN + 78 // 绑定元宝历史额度        336
// objectField.PLAYER_GODANIMAL_LEVEL             = objectField.PLAYER_FIELD_BEGIN + 79 // 神兽等级                337
// objectField.PLAYER_END                         = objectField.PLAYER_FIELD_BEGIN + 80 //                         338

// objectField.PLAYER_FIELD_ROLE_UPDATEMASK         	= objectField.PLAYER_FIELD_BEGIN + 81
// objectField.PLAYER_FIELD_PET_UPDATEMASK         	= objectField.PLAYER_FIELD_BEGIN + 82
// objectField.PLAYER_FIELD_XIANLV_UPDATEMASK         	= objectField.PLAYER_FIELD_BEGIN + 83
// objectField.PLAYER_FIELD_TIANNV_UPDATEMASK         	= objectField.PLAYER_FIELD_BEGIN + 84
// objectField.PLAYER_FIELD_TEMP_CELL_MIN_UPDATEMASK   = objectField.PLAYER_FIELD_BEGIN + 85
// objectField.PLAYER_FIELD_HERO_RIDE_UPDATEMASK       = objectField.PLAYER_FIELD_BEGIN + 85
// objectField.PLAYER_FIELD_HERO_WING_UPDATEMASK       = objectField.PLAYER_FIELD_BEGIN + 86
// objectField.PLAYER_FIELD_PET_TONGLIN_UPDATEMASK     = objectField.PLAYER_FIELD_BEGIN + 87
// objectField.PLAYER_FIELD_PET_SOUHUN_UPDATEMASK      = objectField.PLAYER_FIELD_BEGIN + 88
// objectField.PLAYER_FIELD_XIANLV_FAZHEN_UPDATEMASK   = objectField.PLAYER_FIELD_BEGIN + 89
// objectField.PLAYER_FIELD_XIANLV_XIANWEI_UPDATEMASK  = objectField.PLAYER_FIELD_BEGIN + 90
// objectField.PLAYER_FIELD_TIANNV_HUANIAN_UPDATEMASK  = objectField.PLAYER_FIELD_BEGIN + 91
// objectField.PLAYER_FIELD_TIANNV_LINGQI_UPDATEMASK   = objectField.PLAYER_FIELD_BEGIN + 92
// objectField.PLAYER_FIELD_TIANXIAN_UPDATEMASK        = objectField.PLAYER_FIELD_BEGIN + 93
// objectField.PLAYER_FIELD_TIANXIAN_WEAPON_UPDATEMASK = objectField.PLAYER_FIELD_BEGIN + 94
// objectField.PLAYER_FIELD_TEMP_CELL_MAX_UPDATEMASK   = objectField.PLAYER_FIELD_BEGIN + 94
// //////////////////////////////////////////MONSTER//////////////////////////////////////////////
// //objectField.MONSTER_FIELD_BEGIN                = objectField.UNIT_END + 200
// objectField.MONSTER_END                        = objectField.MONSTER_FIELD_BEGIN + 0

// //////////////////////////////////////////PARTNER////////////////////////////////////////////////
// objectField.PARTNER_FIELD_LEVEL                = objectField.PARTNER_BASE_BEGIN + 3  //等级            261
// objectField.PARTNER_FIELD_STATE                = objectField.PARTNER_BASE_BEGIN + 4  //绑定状态        262
// objectField.PARTNER_FIELD_QUALITY_LEVEL        = objectField.PARTNER_BASE_BEGIN + 5  //品质            263
// objectField.PARTNER_EMPLOY_OVER_TIME           = objectField.PARTNER_BASE_BEGIN + 8  //雇佣过期时间    266


// ////////////////////////////////////////- VOCATION////////////////////////////////////////////////
// objectField.VOCATION_FIELD_FINISH_TASK          = objectField.VOCATION_BASE_BEGIN + 0  //完成任务列表    258
// objectField.VOCATION_FIELD_QUALITY_LEVEL        = objectField.VOCATION_BASE_BEGIN + 1  //品质(用于外形)        259
// objectField.VOCATION_FIELD_SKILL_LIST           = objectField.VOCATION_BASE_BEGIN + 2  //技能列表        260

// // GAMEOBJECT npc
// objectField.GO_FIELD_TYPE                     = objectField.OBJECT_END + 0 // GameObject的类型
// objectField.GO_FIELD_VISIBLE                  = objectField.OBJECT_END + 1 // 是否在地图上可见
// objectField.GO_FIELD_FLEE                     = objectField.OBJECT_END + 2 // 从地图逃逸
// objectField.GO_END                            = objectField.OBJECT_END + 3

// //Item
// //objectField.ITEM_FIELD_BEGIN                  = objectField.UNIT_END + 200
// objectField.ITEM_FIELD_USE_OBJECT             = objectField.ITEM_FIELD_BEGIN + 0  //物品使用对象                  258
// objectField.ITEM_FIELD_BUY_PRICE              = objectField.ITEM_FIELD_BEGIN + 1  //买入价格                      259
// objectField.ITEM_FIELD_SELL_PRICE             = objectField.ITEM_FIELD_BEGIN + 2  //卖出价格                      260
// objectField.ITEM_FIELD_UNIT                   = objectField.ITEM_FIELD_BEGIN + 3  //货币单位                      261
// objectField.ITEM_FIELD_STORE_TIME             = objectField.ITEM_FIELD_BEGIN + 4  //获得时间                      262
// objectField.ITEM_FIELD_DEADLINE_TIME          = objectField.ITEM_FIELD_BEGIN + 5  //过期时间                      263
// objectField.ITEM_FIELD_USE_EFFECT_TIME        = objectField.ITEM_FIELD_BEGIN + 6  //使用物品后物品效用持续时间    264
// objectField.ITEM_FIELD_STONE_LEVEL            = objectField.ITEM_FIELD_BEGIN + 7  //魔导石等级                    265
// objectField.ITEM_FIELD_TAKE_EFFECT            = objectField.ITEM_FIELD_BEGIN + 8  //是否鉴定                      266
// objectField.ITEM_BEGIN_USE_TIME               = objectField.ITEM_FIELD_BEGIN + 9  //物品开始使用时间              267
// objectField.ITEM_FIELD_BUY_UNIT               = objectField.ITEM_FIELD_BEGIN + 10 //买入单位                      268
// objectField.ITEM_FIELD_EQUIP_OWNER            = objectField.ITEM_FIELD_BEGIN + 11 //装备穿戴者                    269
// objectField.ITEM_FIELD_EQUIP_STAR             = objectField.ITEM_FIELD_BEGIN + 12 //装备加星                      270
// objectField.ITEM_FIELD_EQUIP_SCORE            = objectField.ITEM_FIELD_BEGIN + 13 //装备评分                      271
// objectField.ITEM_FIELD_EQUIP_CAREER           = objectField.ITEM_FIELD_BEGIN + 14 //装备职业                      272
// objectField.ITEM_FIELD_SOURCE                 = objectField.ITEM_FIELD_BEGIN + 15 //物品来源                      273
// objectField.ITEM_FIELD_SPECIAL_EQUIP          = objectField.ITEM_FIELD_BEGIN + 16 //特殊装备                      274
// objectField.ITEM_FIELD_EQUIP_ENHANCE_LEVEL    = objectField.ITEM_FIELD_BEGIN + 17 //装备强化等级                  275
// objectField.ITEM_FIELD_EQUIP_BUILD            = objectField.ITEM_FIELD_BEGIN + 18 //装备生成属性                  276
// objectField.ITEM_FIELD_EQUIP_STONE            = objectField.ITEM_FIELD_BEGIN + 19 //装备镶嵌的宝石                277
// objectField.ITEM_FIELD_EQUIP_PROMOTE          = objectField.ITEM_FIELD_BEGIN + 20 //装备改造最终值                278
// objectField.ITEM_FIELD_EQUIP_TEMP_PROMOTE     = objectField.ITEM_FIELD_BEGIN + 21 //装备改造临时值                279
// objectField.ITEM_FIELD_ADVANCE                = objectField.ITEM_FIELD_BEGIN + 22 //装备晋升等级                  280
// objectField.ITEM_FIELD_SPECIAL_SKILL_EFFECT   = objectField.ITEM_FIELD_BEGIN + 23 //装备特技                      281
// objectField.ITEM_FIELD_SKILL_EFFECT_TEMP      = objectField.ITEM_FIELD_BEGIN + 24 //特技临时值                    282
// objectField.ITEM_FIELD_EQUIP_ELEMENT_STONE    = objectField.ITEM_FIELD_BEGIN + 25 //装备镶嵌的元素石              283
// objectField.ITEM_FIELD_MASK_UNBLOCK           = objectField.ITEM_FIELD_BEGIN + 26 //面具解封属性                  284
// objectField.ITEM_FIELD_STATUS                 = objectField.ITEM_FIELD_BEGIN + 27 //状态                          285
// objectField.ITEM_FIELD_EQUIP_QUALITY          = objectField.ITEM_FIELD_BEGIN + 28 //装备品质                      286
// objectField.ITEM_FIELD_LOST_EFFECT_TIME       = objectField.ITEM_FIELD_BEGIN + 29 //失效时间                      287
// objectField.ITEM_FIELD_COUNT                  = objectField.ITEM_FIELD_BEGIN + 30 //物品数量                      288
// objectField.ITEM_FIELD_EXQUISITE_MAKE         = objectField.ITEM_FIELD_BEGIN + 31 //精致打造                      289
// objectField.ITEM_FIELD_INHERIT                = objectField.ITEM_FIELD_BEGIN + 32 //装备继承                      290
// objectField.ITEM_FIELD_DAY_LIMIT              = objectField.ITEM_FIELD_BEGIN + 33 //单人限购                      291
// objectField.ITEM_FIELD_WEAK_LIMIT             = objectField.ITEM_FIELD_BEGIN + 34 //每周限购                      292
// objectField.ITEM_FIELD_TAKE_EFFECT_COUNT      = objectField.ITEM_FIELD_BEGIN + 35 //鉴定次数                      293
// objectField.ITEM_FIELD_LIFE_LIMIT             = objectField.ITEM_FIELD_BEGIN + 36 //终身限购                      294

// //Fairy
// //objectField.FAIRY_BASE_BEGIN                  = objectField.UNIT_END + 200        //               263
// objectField.FAIRY_FIELD_ENTRY_ID              = objectField.FAIRY_BASE_BEGIN + 0  // EntryId       264
// objectField.FAIRY_FIELD_CREATE_TIME           = objectField.FAIRY_BASE_BEGIN + 1  // 创建时间      265
// objectField.FAIRY_FIELD_REFORM                = objectField.FAIRY_BASE_BEGIN + 2  // 改造值        266
// objectField.FAIRY_FIELD_SKILL_LIST            = objectField.FAIRY_BASE_BEGIN + 3  // 技能列表      267
// objectField.FAIRY_FIELD_STATE                 = objectField.FAIRY_BASE_BEGIN + 4  // 状态          268
// objectField.FAIRY_FIELD_BASE_REVISE           = objectField.FAIRY_BASE_BEGIN + 5  // 一级属性系数  269
// objectField.FAIRY_FIELD_EQUIP_PACKET          = objectField.FAIRY_BASE_BEGIN + 6  // 装备          270
// objectField.FAIRY_FIELD_PEARL                 = objectField.FAIRY_BASE_BEGIN + 7  // 灵珠属性      271
// objectField.FAIRY_FIELD_PEARL_VALUE           = objectField.FAIRY_BASE_BEGIN + 8  // 灵力值        272
// objectField.FAIRY_FIELD_PEARL_RECAST          = objectField.FAIRY_BASE_BEGIN + 9  // 灵珠重塑      273

// //Wing
// //objectField.WING_BASE_BEGIN                   = objectField.UNIT_END + 200         //             258
// objectField.WING_FIELD_ENTRY_ID               = objectField.WING_BASE_BEGIN + 0  //EntryId        258
// objectField.WING_FIELD_CREATE_TIME            = objectField.WING_BASE_BEGIN + 1  //创建时间       259
// objectField.WING_FIELD_SKILL_LIST             = objectField.WING_BASE_BEGIN + 2  //普通技能列表   260
// objectField.WING_FIELD_STATE                  = objectField.WING_BASE_BEGIN + 3  //状态           261
// objectField.WING_FIELD_UNLOCK_IMAGE_LIST      = objectField.WING_BASE_BEGIN + 4  //外观解锁列表   262
// objectField.WING_FIELD_UNLOCK_SKILL_LIST      = objectField.WING_BASE_BEGIN + 5  //解锁技能列表   263
// objectField.WING_FIELD_IMAGE                  = objectField.WING_BASE_BEGIN + 6  //模型           264
// objectField.WING_FIELD_ACTIVE                 = objectField.WING_BASE_BEGIN + 7  //解锁           265
// objectField.WING_FIELD_BASE_REVISE            = objectField.WING_BASE_BEGIN + 8  //一级属性系数   266
// objectField.WING_FIELD_SKILL_HOLE             = objectField.WING_BASE_BEGIN + 9  //技能孔         267
// objectField.WING_FIELD_SKILL_LIST2            = objectField.WING_BASE_BEGIN + 10 //奥义技能列表   268
// objectField.WING_FIELD_SKILL_LOCK_LIST        = objectField.WING_BASE_BEGIN + 11 //植入锁定列表   269
// objectField.WING_FIELD_LAST_TOTEM             = objectField.WING_BASE_BEGIN + 12 //上次图腾位置   270
// //图腾
// objectField.WING_FIELD_TOTEM_INDEX_BEGIN      = objectField.WING_BASE_BEGIN + 14             //图腾开始     272
// objectField.WING_FIELD_TOTEM_CRITICAL_DEC     = objectField.WING_FIELD_TOTEM_INDEX_BEGIN + 0 //抗暴         273
// objectField.WING_FIELD_TOTEM_CRI_ATT_DEC      = objectField.WING_FIELD_TOTEM_INDEX_BEGIN + 1 //暴伤减免     274
// objectField.WING_FIELD_TOTEM_SPEED_DEC        = objectField.WING_FIELD_TOTEM_INDEX_BEGIN + 2 //速度         275
// objectField.WING_FIELD_TOTEM_INDEX_END        = objectField.WING_FIELD_TOTEM_INDEX_BEGIN + 2 //图腾结束     276
// //翅膀炼化
// objectField.WING_REFINING_LEVEL               = objectField.WING_BASE_BEGIN + 24 //炼化等级  282
// objectField.WING_REFINING_VALUE               = objectField.WING_BASE_BEGIN + 25 //炼化值    283
// objectField.WING_FIELD_GUID                   = objectField.WING_BASE_BEGIN + 26 //翅膀Guid  284


// //objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN   = 1000
// //装备固定属性
// objectField.ITEM_FIELD_FIXED_BEGIN            = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 52 //固定属性开始
// objectField.ITEM_FIELD_FIXED_INDEX            = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 52 //固定属性索引    //1052
// objectField.ITEM_FIELD_FIXED_VALUE            = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 53 //固定属性值      //1053
// objectField.ITEM_FIELD_FIXED_END              = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 53 //固定属性结束
// //装备附加属性
// objectField.ITEM_FIELD_APPEND_BEGIN           = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 70 //附加属性开始
// objectField.ITEM_FIELD_APPEND_INDEX1          = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 70 //附加索引        //1070
// objectField.ITEM_FIELD_APPEND_VALUE1          = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 71 //附加值          //1071
// objectField.ITEM_FIELD_APPEND_END             = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 71 //附加属性结束
// //传奇装备特效
// objectField.ITEM_FIELD_SPECIAL_BEGIN          = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 76 //特效开始
// objectField.ITEM_FIELD_SPECIAL_INDEX1         = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 76 //特效索引        //1076 属性
// objectField.ITEM_FIELD_SPECIAL_VALUE1         = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 77 //特效值          //1077 属性值
// objectField.ITEM_FIELD_SPECIAL_END            = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 77 //特效结束
// // 装备洗练、重铸
// objectField.ITEM_FIELD_REBUILD_VALUE          = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 83 //洗练属性        //1083
// objectField.ITEM_FIELD_REBUILD_COUNT          = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 82 //洗练次数        //1082
// objectField.ITEM_FIELD_CAST_VALUE             = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 84 //重铸属性        //1084
// objectField.ITEM_FIELD_CAST_COUNT             = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 85 //重铸次数        //1085
// //objectField.ITEM_FIELD_INHERIT_COUNT          = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 86 //继承次数      //1086

// objectField.ITEM_FIELD_VARY_ATTRIBUTE_END    = objectField.ITEM_FIELD_VARY_ATTRIBUTE_BEGIN + 200 //装备属性


// //-神兵系统
// objectField.IMMORTALS_FIELD_GUID                   = objectField.IMMORTALS_BASE_BEGIN + 0  //Guid           258
// objectField.IMMORTALS_FIELD_ENTRY_ID               = objectField.IMMORTALS_BASE_BEGIN + 1  //EntryId        259
// objectField.IMMORTALS_FIELD_STATE                  = objectField.IMMORTALS_BASE_BEGIN + 2  //状态           260
// objectField.IMMORTALS_FIELD_QUENCH_VALUE           = objectField.IMMORTALS_BASE_BEGIN + 3  //淬炼值         261
// objectField.IMMORTALS_FIELD_BASE_ABILITY           = objectField.IMMORTALS_BASE_BEGIN + 4  //基础属性   		262暂时没用到
// objectField.IMMORTALS_FIELD_LEVEL                  = objectField.IMMORTALS_BASE_BEGIN + 5  //等级   		    263
// objectField.IMMORTALS_FIELD_LEVEL_UP_TIME          = objectField.IMMORTALS_BASE_BEGIN + 6  //等级升级时间   264



///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 值的类型
// 类型
// let dataType: any = {
// 	INT: 0,
// 	FLOAT: 1,
// 	STRING: 2,
// 	USHORT_USHORT: 3,
// 	UINT_UINT: 4,
// 	UINT_STRING: 5,
// 	UINT: 6,
// 	BYTE: 7,
// 	USHORT: 8,
// 	TABLE: 9,

// 	SELF_DEF: 15,
// }

//
// function writeDateType(pack, dtype, data){
//     pack.writeByte(dtype)
//     if(dtype == dataType.INT ){
//         pack.writeInt(data)
//     }else if(dtype == dataType.FLOAT ){
//         pack.writeFloat(data)
//     }else if(dtype == dataType.STRING ){
//         pack.writeString(data)
//     }else if(dtype == dataType.UINT ){
//         pack.writeUInt(data)
//     }else if(dtype == dataType.BYTE ){
//         pack.writeByte(data)
//     }else if(dtype == dataType.USHORT ){
//         pack.writeUShort(data)
//     }else if(dtype == dataType.TABLE ){
//         pack.writeString(table_save(data))
//     }
// }

// //
// function readDataType(pack){
//     let dtype = pack.readByte()
//     let data
//     if(dtype == dataType.INT ){
//         data = pack.readInt()
//     }else if(dtype == dataType.FLOAT ){
//         data = pack.readFloat()
//     }else if(dtype == dataType.STRING ){
//         data = pack.readString()
//     }else if(dtype == dataType.UINT ){
//         data = pack.readUInt()
//     }else if(dtype == dataType.BYTE ){
//         data = pack.readByte()
//     }else if(dtype == dataType.USHORT ){
//         data = pack.readUShort()
//     }else if(dtype == dataType.TABLE ){
//         data = table_load(pack.readString())
//     }
// 	return [dtype, data]
// }

// //
// function readDataTypeClient(pack){
//     let dtype = pack.readUChar()
//     let data
//     if(dtype == dataType.INT ){
//         data = pack.readInt()
//     }else if(dtype == dataType.FLOAT ){
//         data = pack.readFloat()
//         data = data - (data % 0.01)
//     }else if(dtype == dataType.STRING ){
//         data = pack.readString()
//     }else if(dtype == dataType.UINT ){
//         data = pack.readUInt()
//     }else if(dtype == dataType.BYTE ){
//         data = pack.readUChar()
//     }else if(dtype == dataType.USHORT ){
//         data = pack.readUShort()
//     }else if(dtype == dataType.TABLE ){
//         data = table_load(pack.readString())
//     }
// 	return [dtype, data]
// }


// let fieldType:any = {}
// fieldType[objectField.OBJECT_FIELD_ID]           = dataType.UINT
// fieldType[objectField.OBJECT_FIELD_TYPE]         = dataType.USHORT
// fieldType[objectField.OBJECT_FIELD_ENTRY]        = dataType.UINT
// fieldType[objectField.OBJECT_FIELD_UPDATE_DELTA] = dataType.UINT

// fieldType[objectField.UNIT_FIELD_LEVEL]          = dataType.USHORT
// fieldType[objectField.UNIT_FIELD_EXPERIENCE]     = dataType.STRING
// fieldType[objectField.UNIT_FIELD_POTENTIAL]      = dataType.UINT
// fieldType[objectField.UNIT_FIELD_ICON]           = dataType.UINT
// fieldType[objectField.UNIT_FIELD_NAME]           = dataType.STRING

// fieldType[objectField.UNIT_FIELD_MAX_HP]       = dataType.UINT
// fieldType[objectField.UNIT_FIELD_SPEED]       = dataType.UINT
// fieldType[objectField.UNIT_FIELD_ATTACK]       = dataType.UINT
// fieldType[objectField.UNIT_FIELD_DEFENCE]       = dataType.UINT
// fieldType[objectField.UNIT_FIELD_HITRATE]       = dataType.UINT
// fieldType[objectField.UNIT_FIELD_DODGE]       = dataType.UINT
// fieldType[objectField.UNIT_FIELD_CRITICAL]       = dataType.UINT
// fieldType[objectField.UNIT_FIELD_CRITICAL_DEC]       = dataType.UINT
// fieldType[objectField.UNIT_FIELD_DEF_THR]       = dataType.UINT
// fieldType[objectField.UNIT_FIELD_DEF_THR_DEC]       = dataType.UINT
// fieldType[objectField.UNIT_FIELD_ATT_INC]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_ATT_DEC]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_CRI_ATT]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_CRI_ATT_DEC]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_PVP_ATT_INC]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_PVP_ATT_DEC]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_PVE_ATT_INC]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_PVE_ATT_DEC]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_HP_PER]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_SPEED_PER]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_ATT_PER]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_DEF_PER]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_HIT_PER]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_DODGE_PER]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_CRIT_PER]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_CRIT_DEC_PER]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_DEF_THR_PER]           = dataType.FLOAT
// fieldType[objectField.UNIT_FIELD_DEF_THR_DEC_PER]           = dataType.FLOAT

// //////////////////
// fieldType[objectField.ACTOR_FIELD_STAGE_LEVEL]           = dataType.USHORT
// fieldType[objectField.ACTOR_FIELD_STAGE_EXP]           = dataType.UINT
// fieldType[objectField.ACTOR_FIELD_COMBAT_POS]           = dataType.BYTE
// fieldType[objectField.ACTOR_FIELD_GROW_EXP]           = dataType.USHORT
// fieldType[objectField.ACTOR_FIELD_WASH_NUM]           = dataType.USHORT
// fieldType[objectField.ACTOR_FIELD_SKILL_REGULAR]           = dataType.TABLE
// fieldType[objectField.ACTOR_FIELD_SKILL_WASH]           = dataType.TABLE
// fieldType[objectField.ACTOR_FIELD_UP_START]           = dataType.USHORT
// fieldType[objectField.ACTOR_FIELD_SKILL_LEVEL]           = dataType.TABLE
// fieldType[objectField.ACTOR_FIELD_SKILL_ORDER]           = dataType.TABLE

// fieldType[objectField.TEMPCELLFUN_FIELD_SHOW_INDEX]           = dataType.USHORT
// fieldType[objectField.TEMPCELLFUN_FIELD_STAGE_LEVEL]           = dataType.USHORT
// fieldType[objectField.TEMPCELLFUN_FIELD_STAGE_EXP]           = dataType.UINT
// fieldType[objectField.TEMPCELLFUN_FIELD_SKILL_LIST]           = dataType.TABLE
// fieldType[objectField.TEMPCELLFUN_FIELD_EQUIP_LIST]           = dataType.TABLE
// fieldType[objectField.TEMPCELLFUN_FIELD_DRUG_NUM]           = dataType.USHORT
// fieldType[objectField.TEMPCELLFUN_FIELD_SKIN_CUR]           = dataType.USHORT
// fieldType[objectField.TEMPCELLFUN_FIELD_SKIN_LIST]           = dataType.TABLE
// fieldType[objectField.TEMPCELLFUN_FIELD_SHARE_CUR]           = dataType.USHORT


// fieldType[objectField.PLAYER_FIELD_LOGINTIME]             = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_ACCOUNTID]             = dataType.STRING
// fieldType[objectField.PLAYER_FIELD_NAME]                  = dataType.STRING
// fieldType[objectField.PLAYER_FIELD_NAMEBIT]               = dataType.UINT
// //fieldType[objectField.PLAYER_FIELD_GENDER]                = dataType.BYTE
// fieldType[objectField.PLAYER_FIELD_VOCATION]                = dataType.USHORT
// fieldType[objectField.PLAYER_FIELD_FACTION]               = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_POWER]                 = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_ENERGY]                = dataType.UINT
// //fieldType[objectField.PLAYER_FIELD_ERRANTRY]            = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_STATUS]                = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_RESERVEFUNDS]          = dataType.STRING
// fieldType[objectField.PLAYER_FIELD_RESERVEFUNDS_BIT]      = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_FRIEND_AGREE]          = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_MESSAGE_REFUSE]        = dataType.UINT
// //fieldType[objectField.PLAYER_FIELD_IM_COUNT]              = dataType.UINT
// //fieldType[objectField.PLAYER_FIELD_MAGIC_STONE_ENERGY]    = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_BODY]                  = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_MAPID]                 = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_MAPX]                  = dataType.USHORT
// fieldType[objectField.PLAYER_FIELD_MAPY]                  = dataType.USHORT
// fieldType[objectField.PLAYER_FIELD_PETUPDATEMASK]         = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_PETMAX]                = dataType.USHORT
// fieldType[objectField.PLAYER_FIELD_PACKET_MAX]            = dataType.USHORT
// fieldType[objectField.PLAYER_FIELD_WAREHOUSE_MAX]         = dataType.USHORT

// fieldType[objectField.PLAYER_FIELD_WAREHOUSE_MONEY]       = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_TEAM_UPDATE_MASK]      = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_ELEMENT]               = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_RANGE_DISABLE]         = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_SAVERECORD]            = dataType.TABLE
// fieldType[objectField.PLAYER_FIELD_SAVERECORD_BIT]        = dataType.UINT
// //fieldType[objectField.PLAYER_FIELD_FACTION_GOLD]          = dataType.UINT

// //fieldType[objectField.ITEM_FIELD_CREATOR]                 = dataType.STRING
// //fieldType[objectField.ITEM_FIELD_CREATOR_BIT]             = dataType.UINT
// //fieldType[objectField.PLAYER_FIELD_CURRENT_EQUIP]         = dataType.UINT

// fieldType[objectField.PLAYER_FIELD_JJC_POINT]             = dataType.UINT
// //fieldType[objectField.PLAYER_FIELD_JJC_MAXPOINT]          = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_ROLE_EXP_S]            = dataType.STRING
// fieldType[objectField.PLAYER_FIELD_RMB_GOLD]              = dataType.UINT

// //fieldType[objectField.PLAYER_FIELD_MAX_POWER]             = dataType.UINT
// //fieldType[objectField.PLAYER_FIELD_MAX_ENERGY]            = dataType.UINT
// //fieldType[objectField.PLAYER_FIELD_RMB_CONSUMEGOLD_TOTAL] = dataType.UINT
// fieldType[objectField.PLAYER_VOCATION_COMBAT_FORCE]       = dataType.STRING
// fieldType[objectField.PLAYER_FIELD_INTERACT_COUNT]        = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_INTERACT_PET]          = dataType.UINT
// //fieldType[objectField.PLAYER_FIELD_AMBASSADOR_EXP]        = dataType.UINT
// //fieldType[objectField.PLAYER_FIELD_AMBASSADOR_LEVEL]      = dataType.UINT
// //fieldType[objectField.PLAYER_FIELD_RECHARGE_COUNT]        = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_VIP_LEVLE]             = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_VIP_EXP]               = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_LEGEND_POWDER]         = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_FAIRY_UPDATE_MASK]     = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_COMBAT_TEAM_ID]        = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_WING_UPDATE_MASK]      = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_FACTION_BUILD_POINT]   = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_USE_SACHOOP_LV]        = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_MASK]                  = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_SEX]                   = dataType.BYTE
// fieldType[objectField.PLAYER_COMBAT_FORCE]                = dataType.STRING
// fieldType[objectField.PLAYER_COMBAT_FORCEBIT]             = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_WEDDING_SPOUSE_ID]     = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_SPOUSE_ID]             = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_KISS_NUM_ID]           = dataType.USHORT
// fieldType[objectField.PLAYER_SKY_TOWER_POINT]             = dataType.UINT
// fieldType[objectField.PLAYER_LEAGUE_MATCH_POINT]          = dataType.UINT
// fieldType[objectField.PLAYER_ZHEN_YING_POINT]             = dataType.UINT
// fieldType[objectField.PLAYER_HOME_PAGE_CHARM]             = dataType.STRING
// fieldType[objectField.PLAYER_HOME_PAGE_CHARMBIT]          = dataType.UINT
// fieldType[objectField.PLAYER_CHAT_WINDOW_TYPE]            = dataType.UINT
// fieldType[objectField.PLAYER_ROBBER_NORMAL_KILL]          = dataType.UINT
// fieldType[objectField.PLAYER_CAMPAGIN_SCHEDULE]           = dataType.UINT
// fieldType[objectField.PLAYER_ROBBER_INCOME_RATIO]         = dataType.UINT
// fieldType[objectField.PLAYER_IMMORTALS_FIELD_LEVEL]       = dataType.UINT
// fieldType[objectField.PLAYER_IMMORTALS_UPDATE_MASK]       = dataType.UINT
// fieldType[objectField.PLAYER_FACT_TASK_POINT]             = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_BIND_CURRENCY]         = dataType.UINT
// fieldType[objectField.PLAYER_FIELD_TOTALL_BIND_CURRENCY]  = dataType.UINT
// fieldType[objectField.PLAYER_GODANIMAL_LEVEL]             = dataType.UINT

// let itemFieldType:any = {}
// //itemFieldType[objectField.ITEM_FIELD_MP_BUFF]              = dataType.UINT
// itemFieldType[objectField.ITEM_FIELD_DEADLINE_TIME]        = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_DELETE_OFFLINE]       = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_SWORN_SPRONSORNAME]   = dataType.STRING
// //itemFieldType[objectField.ITEM_FIELD_SWORN]                = dataType.STRING
// //itemFieldType[objectField.ITEM_FIELD_CONSUME_ID]           = dataType.STRING
// //itemFieldType[objectField.ITEM_FIELD_MAX_ENDURE]           = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_UNIQUE]               = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_BODY]                 = dataType.UINT
// itemFieldType[objectField.ITEM_FIELD_UNIT]                 = dataType.USHORT
// //itemFieldType[objectField.ITEM_FIELD_ADVANCE_SCHOOL]       = dataType.USHORT
// //itemFieldType[objectField.ITEM_FIELD_EFFECT_LEVEL]         = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_EFFECT_COUNT]         = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_STONE_SKILL]          = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_STONE_LEVEL]          = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_FOOD_MIDDLE_HP]       = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_STONE_STAR]           = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_CREATOR]              = dataType.STRING
// itemFieldType[objectField.ITEM_FIELD_EQUIP_QUALITY]        = dataType.UINT
// itemFieldType[objectField.ITEM_FIELD_USE_OBJECT]           = dataType.STRING
// itemFieldType[objectField.ITEM_FIELD_EQUIP_BUILD]          = dataType.TABLE
// itemFieldType[objectField.ITEM_FIELD_EQUIP_STONE]          = dataType.TABLE
// itemFieldType[objectField.ITEM_FIELD_EQUIP_PROMOTE]        = dataType.TABLE
// itemFieldType[objectField.ITEM_FIELD_EQUIP_TEMP_PROMOTE]   = dataType.TABLE
// itemFieldType[objectField.ITEM_FIELD_SPECIAL_SKILL_EFFECT] = dataType.TABLE
// itemFieldType[objectField.ITEM_FIELD_SKILL_EFFECT_TEMP]    = dataType.TABLE
// //itemFieldType[objectField.ITEM_FIELD_RIDE_EQUIP_QUALITY]   = dataType.UINT
// itemFieldType[objectField.ITEM_FIELD_EQUIP_ELEMENT_STONE]  = dataType.TABLE

// //装备固定属性
// itemFieldType[objectField.ITEM_FIELD_FIXED_VALUE]        = dataType.TABLE

// //itemFieldType[objectField.ITEM_FIELD_ATTACK_VALUE1]    = dataType.UINT
// ////// 全抗
// //itemFieldType[objectField.ITEM_FIELD_FIRESUB_VALUE1]   = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_ICESUB_VALUE1]    = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_HOLYSUB_VALUE1]   = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_DARKLYSUB_VALUE1] = dataType.UINT
// //////
// //itemFieldType[objectField.ITEM_FIELD_DEFENCE_VALUE1]   = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_SPEED_VALUE1]     = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_CRITATT_VALUE1]   = dataType.UINT
// //itemFieldType[objectField.ITEM_FIELD_MAXHP_VALUE1]     = dataType.UINT


// //附加属性
// itemFieldType[objectField.ITEM_FIELD_APPEND_VALUE1]   = dataType.TABLE
// //itemFieldType[objectField.ITEM_FIELD_APPEND_VALUE2]   = dataType.TABLE
// //itemFieldType[objectField.ITEM_FIELD_APPEND_VALUE3]   = dataType.TABLE

// //特效
// itemFieldType[objectField.ITEM_FIELD_SPECIAL_VALUE1]   = dataType.TABLE
// //itemFieldType[objectField.ITEM_FIELD_SPECIAL_VALUE2]   = dataType.TABLE
// //itemFieldType[objectField.ITEM_FIELD_SPECIAL_VALUE3]   = dataType.TABLE
// //套装效果
// //itemFieldType[objectField.ITEM_FIELD_SUIT_EFFECT1]   = dataType.STRING
// //itemFieldType[objectField.ITEM_FIELD_SUIT_EFFECT2]   = dataType.STRING
// //itemFieldType[objectField.ITEM_FIELD_SUIT_EFFECT3]   = dataType.STRING
// //itemFieldType[objectField.ITEM_FIELD_SUIT_EFFECT4]   = dataType.STRING
// //itemFieldType[objectField.ITEM_FIELD_SUIT_EFFECT5]   = dataType.STRING
// //itemFieldType[objectField.ITEM_FIELD_SUIT_EFFECT6]   = dataType.STRING

// //洗练
// itemFieldType[objectField.ITEM_FIELD_REBUILD_COUNT] = dataType.UINT
// itemFieldType[objectField.ITEM_FIELD_REBUILD_VALUE] = dataType.TABLE
// itemFieldType[objectField.ITEM_FIELD_CAST_VALUE]    = dataType.TABLE
// //解封
// itemFieldType[objectField.ITEM_FIELD_MASK_UNBLOCK]  = dataType.TABLE



let abilityNameToIndex: any = {
	maxhp: objectField.UNIT_FIELD_MAX_HP,              //最大生命
	speed: objectField.UNIT_FIELD_SPEED,                  //出手速度
	demage: objectField.UNIT_FIELD_ATTACK,            //面板伤害
	hujia: objectField.UNIT_FIELD_DEFENCE,            //护甲
	hitrate: objectField.UNIT_FIELD_HITRATE,             //命中值
	dodge: objectField.UNIT_FIELD_DODGE,               //闪避率
	critrate: objectField.UNIT_FIELD_CRITICAL,            //暴击值
	critratedec: objectField.UNIT_FIELD_CRITICAL_DEC,        //抗暴值
	chuanjia: objectField.UNIT_FIELD_DEF_THR,             //无视防御
	chuanjiadec: objectField.UNIT_FIELD_DEF_THR_DEC,         //减免无视防御
	attinc: objectField.UNIT_FIELD_ATT_INC,             //伤害增加
	attdec: objectField.UNIT_FIELD_ATT_DEC,             //伤害减少
	critdamage: objectField.UNIT_FIELD_CRI_ATT,             //暴击伤害
	critdadec: objectField.UNIT_FIELD_CRI_ATT_DEC,         //暴伤减免
	pvpattinc: objectField.UNIT_FIELD_PVP_ATT_INC,         //PVP伤害增加
	pvpattdec: objectField.UNIT_FIELD_PVP_ATT_DEC,         //PVP伤害减少
	pveattinc: objectField.UNIT_FIELD_PVE_ATT_INC,         //PVE伤害增加
	pveattdec: objectField.UNIT_FIELD_PVE_ATT_DEC,         //PVE伤害减少
	//
	hpPer: objectField.UNIT_FIELD_HP_PER,          //生命百分比
	speedPer: objectField.UNIT_FIELD_SPEED_PER,       //速度百分比
	attPer: objectField.UNIT_FIELD_ATT_PER,         //物攻百分比
	hujiaPer: objectField.UNIT_FIELD_DEF_PER,         //物防百分比
	hitPer: objectField.UNIT_FIELD_HIT_PER,         //命中百分比
	dodgePer: objectField.UNIT_FIELD_DODGE_PER,       //闪避百分比
	critPer: objectField.UNIT_FIELD_CRIT_PER,        //暴击值百分比
	critdecPer: objectField.UNIT_FIELD_CRIT_DEC_PER,    //抗暴值百分比
	chuanjiaPer: objectField.UNIT_FIELD_DEF_THR_PER,     //无视防御百分比
	decchuanjiaPer: objectField.UNIT_FIELD_DEF_THR_DEC_PER, //减免无视防御百分比
}


//abilityStrTable = {{"maxHP",100,1},{"maxHP",100}}
//isEffect 是否增加效果
// function getAbiblityStrEffect(abilityStrTable, isEffect) {
// 	let effectValue: any = {}
// 	let effectPercent: any = {}
// 	for (let _ in abilityStrTable) {
// 		let value = abilityStrTable[_]

// 		let abilityStr = value[1]
// 		let abilityValue = value[2]
// 		let percent = value[3]
// 		let abilityIndex = abilityNameToIndex[abilityStr]

// 		if (abilityIndex && !percent) {
// 			abilityValue = isEffect && abilityValue || -abilityValue
// 			effectValue[abilityIndex] = (effectValue[abilityIndex] || 0) + abilityValue
// 		} else if (abilityIndex && percent) {
// 			abilityValue = isEffect && abilityValue || -abilityValue
// 			effectPercent[abilityIndex] = (effectPercent[abilityIndex] || 0) + abilityValue
// 		}
// 	}
// 	return [effectValue, effectPercent]
// }

//specialAbility =
//{
//    [objectField.ITEM_FIELD_VOID_FIRE_KEY]          : "VOID_FIRE",       // 免疫火系伤害
//    [objectField.ITEM_FIELD_VOID_ICE_KEY]           : "VOID_ICE",        // 免疫冰系伤害
//    [objectField.ITEM_FIELD_VOID_HOLY_KEY]          : "VOID_HOLY",       // 免疫神圣伤害
//    [objectField.ITEM_FIELD_VOID_DARKLY_KEY]        : "VOID_DARKLY",     // 免疫暗黑伤害
//    [objectField.ITEM_FIELD_VOID_DEBUFF_KEY]        : "VOID_DEBUFF",     // 免疫负面状态
//    [objectField.ITEM_FIELD_HP_ADD_INDEX]           : "HP_ADD",          // 治疗效果加成
//    [objectField.ITEM_FIELD_MP_ADD_INDEX]           : "MP_ADD",          // 能量回复加成
//    [objectField.ITEM_FIELD_AVOIDENCE_RATE_INDEX]   : "AVOIDENCE_RATE",  // 免伤率加成
//    [objectField.ITEM_FIELD_HURT_MP_INDEX]          : "HURT_MP",         // 受伤时能量回复
//    [objectField.ITEM_FIELD_INIT_MP_INDEX]          : "INIT_MP",         // 初始能量
//    [objectField.ITEM_FIELD_ATTACK_MP_INDEX]        : "ATTACK_MP",       // 造成伤害时能量回复
//    [objectField.ITEM_FIELD_CRIT_MP_INDEX]          : "CRIT_MP",         // 暴击时能量回复
//    [objectField.ITEM_FIELD_FRIESKILL_ADD_INDEX]    : "FRIESKILL_ADD",   // 火系技能伤害加成
//    [objectField.ITEM_FIELD_ICESKILL_ADD_INDEX]     : "ICESKILL_ADD",    // 冰系技能伤害加成
//    [objectField.ITEM_FIELD_HOLYSKILL_ADD_INDEX]    : "HOLYSKILL_ADD",   // 神圣技能伤害加成
//    [objectField.ITEM_FIELD_DARKLYSKILL_ADD_INDEX]  : "DARKLYSKILL_ADD", // 暗黑技能伤害加成
//}
//
//specialAbilityName = {}
//for(let k in specialAbility){
//			let v = specialAbility[k]	
//    specialAbilityName[v] = k
//}

let IndexToabilityName: any = {
	[objectField.UNIT_FIELD_MAX_HP]: 'maxhp',        // 最大生命
	[objectField.UNIT_FIELD_SPEED]: 'speed',        // 出手速度
	[objectField.UNIT_FIELD_ATTACK]: 'demage',       // 面板伤害
	[objectField.UNIT_FIELD_DEFENCE]: 'hujia',        // 护甲
	[objectField.UNIT_FIELD_HITRATE]: 'hitrate',      // 命中值
	[objectField.UNIT_FIELD_DODGE]: 'dodge',        // 闪避率
	[objectField.UNIT_FIELD_CRITICAL]: 'critrate',     // 暴击值
	[objectField.UNIT_FIELD_CRITICAL_DEC]: 'critratedec',  // 抗暴值
	[objectField.UNIT_FIELD_DEF_THR]: 'chuanjia',  // 无视防御
	[objectField.UNIT_FIELD_DEF_THR_DEC]: 'chuanjiadec',  // 减免无视防御
	[objectField.UNIT_FIELD_ATT_INC]: 'attinc',  // 伤害增加
	[objectField.UNIT_FIELD_ATT_DEC]: 'attdec',  // 伤害减少
	[objectField.UNIT_FIELD_CRI_ATT]: 'critdamage',   // 暴击伤害
	[objectField.UNIT_FIELD_CRI_ATT_DEC]: 'critdadec',    // 暴伤减免
	[objectField.UNIT_FIELD_PVP_ATT_INC]: 'pvpattinc',   // PVP伤害增加
	[objectField.UNIT_FIELD_PVP_ATT_DEC]: 'pvpattdec',    // PVP伤害减少
	[objectField.UNIT_FIELD_PVE_ATT_INC]: 'pveattinc',   // PVE伤害增加
	[objectField.UNIT_FIELD_PVE_ATT_DEC]: 'pveattdec',    // PVE伤害减少


	[objectField.UNIT_FIELD_HP_PER]: 'hpPer',        // 生命百分比
	[objectField.UNIT_FIELD_SPEED_PER]: 'speedPer',     // 速度百分比
	[objectField.UNIT_FIELD_ATT_PER]: 'attPer',       // 物攻百分比
	[objectField.UNIT_FIELD_DEF_PER]: 'hujiaPer',     // 物防百分比
	[objectField.UNIT_FIELD_HIT_PER]: 'hitPer',       // 命中百分比
	[objectField.UNIT_FIELD_DODGE_PER]: 'dodgePer',     // 闪避百分比
	[objectField.UNIT_FIELD_CRIT_PER]: 'critPer',      // 暴击值百分比
	[objectField.UNIT_FIELD_CRIT_DEC_PER]: 'critdecPer',   // 抗暴值百分比
	[objectField.UNIT_FIELD_DEF_THR_PER]: 'chuanjiaPer',  // 无视防御百分比
	[objectField.UNIT_FIELD_DEF_THR_DEC_PER]: 'decchuanjiaPer', // 减免无视防御百分比
}


//
////装备类型对应宠物属性
//opEquipTypeToPetAbility =
//{
//    [opItemType.ITEM_TYPE_WEAPON] : objectField.UNIT_FIELD_ATTACK   ,
//    [opItemType.ITEM_TYPE_CLOTH]  : objectField.UNIT_FIELD_DEFENCE  ,
//    [opItemType.ITEM_TYPE_CAP]    : objectField.UNIT_FIELD_DEFENCE  ,
//    [opItemType.ITEM_TYPE_SHOE]   : objectField.UNIT_FIELD_SPEED    ,
//    [opItemType.ITEM_TYPE_NECK]   : objectField.UNIT_FIELD_FIRE_SUB ,
//    [opItemType.ITEM_TYPE_MASK]   : objectField.UNIT_FIELD_FIRE_SUB ,
//}

//一级属性
//baseAbilityNameToIdOptions =
//{
//    ['STRENGTH']  : objectField.UNIT_FIELD_STRENGTH  , // 力量 9
//    ['INTELLECT'] : objectField.UNIT_FIELD_INTELLECT , // 智力 10
//    ['AGILITY']   : objectField.UNIT_FIELD_AGILITY   , // 敏捷 11
//    ['POWER']     : objectField.UNIT_FIELD_POWER     , // 体力 12
//}
//baseAbilityIdToNameOptions = {}
//for(let k in baseAbilityNameToIdOptions){
//			let v = baseAbilityNameToIdOptions[k]
//    baseAbilityIdToNameOptions[v] = k
//}

//二级属性
let lastAbilityNameToIdOptions: any = {
	maxhp: objectField.UNIT_FIELD_MAX_HP,              //最大生命
	speed: objectField.UNIT_FIELD_SPEED,                  //出手速度
	demage: objectField.UNIT_FIELD_ATTACK,            //面板伤害
	hujia: objectField.UNIT_FIELD_DEFENCE,            //护甲
	hitrate: objectField.UNIT_FIELD_HITRATE,             //命中值
	dodge: objectField.UNIT_FIELD_DODGE,               //闪避率
	critrate: objectField.UNIT_FIELD_CRITICAL,            //暴击值
	critratedec: objectField.UNIT_FIELD_CRITICAL_DEC,        //抗暴值
	chuanjia: objectField.UNIT_FIELD_DEF_THR,             //无视防御
	chuanjiadec: objectField.UNIT_FIELD_DEF_THR_DEC,         //减免无视防御
	attinc: objectField.UNIT_FIELD_ATT_INC,             //伤害增加
	attdec: objectField.UNIT_FIELD_ATT_DEC,             //伤害减少
	critdamage: objectField.UNIT_FIELD_CRI_ATT,             //暴击伤害
	critdadec: objectField.UNIT_FIELD_CRI_ATT_DEC,         //暴伤减免
	pvpattinc: objectField.UNIT_FIELD_PVP_ATT_INC,         //PVP伤害增加
	pvpattdec: objectField.UNIT_FIELD_PVP_ATT_DEC,         //PVP伤害减少
	pveattinc: objectField.UNIT_FIELD_PVE_ATT_INC,         //PVE伤害增加
	pveattdec: objectField.UNIT_FIELD_PVE_ATT_DEC,         //PVE伤害减少
	//
	hpPer: objectField.UNIT_FIELD_HP_PER,          //生命百分比
	speedPer: objectField.UNIT_FIELD_SPEED_PER,       //速度百分比
	attPer: objectField.UNIT_FIELD_ATT_PER,         //物攻百分比
	hujiaPer: objectField.UNIT_FIELD_DEF_PER,         //物防百分比
	hitPer: objectField.UNIT_FIELD_HIT_PER,         //命中百分比
	dodgePer: objectField.UNIT_FIELD_DODGE_PER,       //闪避百分比
	critPer: objectField.UNIT_FIELD_CRIT_PER,        //暴击值百分比
	critdecPer: objectField.UNIT_FIELD_CRIT_DEC_PER,    //抗暴值百分比
	chuanjiaPer: objectField.UNIT_FIELD_DEF_THR_PER,     //无视防御百分比
	decchuanjiaPer: objectField.UNIT_FIELD_DEF_THR_DEC_PER, //减免无视防御百分比
}
//lastAbilityIdToNameOptions = {}
//for(let k in lastAbilityNameToIdOptions){
//			let v = lastAbilityNameToIdOptions[k]

//    baseAbilityIdToNameOptions[v] = k
//}

//属性转换
//abilityNameToIdOptions = {}
//abilityIdToNameOptions = {}
//for(let k in baseAbilityNameToIdOptions){
//			let v = baseAbilityNameToIdOptions[k]

//    abilityNameToIdOptions[k] = v
//    abilityIdToNameOptions[v] = k
//}
//for(let k in lastAbilityNameToIdOptions){
//			let v = lastAbilityNameToIdOptions[k]

//    abilityNameToIdOptions[k] = v
//    abilityIdToNameOptions[v] = k
//}

//ItemObjectFieldName = {}
//for(let k in objectField){
//			let v = objectField[k]

//    if(string.match(k, "ITEM_FIELD") ){
//        ItemObjectFieldName[v] = k
//    }
//}

//一级属性
//function isBaseAbility(fieldIndex){
//    if(objectField.UNIT_BASEABILITY_BEGIN  <= fieldIndex && fieldIndex <= objectField.UNIT_BASEABILITY_END ){
//        return true
//    }else{
//        return false
//    }
//}

// //二级属性
// function isLastAbility(fieldIndex) {
// 	if (objectField.UNIT_LASTABILITY_BEGIN <= fieldIndex && fieldIndex <= objectField.UNIT_LASTABILITY_END) {
// 		return true
// 	} else {
// 		return false
// 	}
// }

// //二级属性中百分比属性
// function isPercentAbility(fieldIndex) {
// 	if (objectField.UNIT_FIELD_PER_BEGIN <= fieldIndex && fieldIndex <= objectField.UNIT_FIELD_PER_END) {
// 		return true
// 	} else {
// 		return false
// 	}
// }

// //装备属性
// function isEquipAttribute(fieldIndex) {
// 	if ((objectField.ITEM_FIELD_FIXED_BEGIN <= fieldIndex && fieldIndex <= objectField.ITEM_FIELD_FIXED_END)
// 		|| (objectField.ITEM_FIELD_APPEND_BEGIN <= fieldIndex && fieldIndex <= objectField.ITEM_FIELD_APPEND_END)
// 		|| (objectField.ITEM_FIELD_SPECIAL_BEGIN <= fieldIndex && fieldIndex <= objectField.ITEM_FIELD_SPECIAL_END)) {
// 		return true
// 	} else {
// 		return false
// 	}
// }