/*
作者:
    yangguiming
	
创建时间：
   2017.03.15(周三)

意图：
   检查是否有红点提示
   定义红点事件步骤：
   1.定义 GuideFuncCheckDefine
   2.定义 GuideFuncEvent，checkDefine对应的刷新事件
   3.定义检查函数
   
公共接口：
   
*/


module GuideFuncSpace {
	export let GuideFuncCheckDefine = {
		EVENT_EMAIL: "event_email", //是否有未读邮件
		EVENT_FRIEND_APPLY: "event_friend_apply", //好友申请
		EVENT_FRIEND_CHAT: "event_friend_chat", //好友聊天
		EVENT_ACTIVITY_OPEN: "event_activity_open", //活动正在开启
		EVENT_CHAMPION_FIGHT: "event_champion_fight", //竞技场挑战
		EVENT_ALWAYS_SHOW: "event_always_show", //首次显示



		//EVENT_PET_EQUIP: "event_pet_equip", //伙伴主角装备
		EVENT_PET_SKILLUPGRADE: "event_pet_skillupgrade", //伙伴主角技能升级


		EVENT_SERVER_NOTICE: "event_server_notice",	//简易（红点）事件通知,参数详见OpFunctionNotice
		EVENT_PAY_PRIZE: "event_pay_prize",	//充值活动奖励领取
		EVENT_VIP_DAILY: "event_vip_daily",	//VIP每日奖励


		EVENT_DYNAMIC_TIPS: "event_dynamic_tips", //动态提示
		EVENT_CLUB_NULL: "event_club_null", //没加入公会

		EVENT_ITEM_EXSIT: "event_item_exsit", //指定物品是否存在


		EVENT_COPY_MATERIAL: "event_copy_material", //材料副本
		EVENT_COPY_DRAGON: "event_copy_dragon", //龙王宝藏
		EVENT_COPY_TEMPLE: "event_copy_temple", //小雷音寺
		EVENT_COPY_HEAVEN: "event_copy_heaven", //天庭试炼
		EVENT_BOSS_SINGLE: "event_boss_single", //个人BOSS
		EVENT_BOSS_GLOBAL: "event_boss_global", //全民BOSS
		EVENT_BOSS_WILD: "event_boss_wild", //野外BOSS
		EVENT_EQUIPPACKET_FULL: "event_equippacket_full", //装备背包满了

		EVENT_COPY_DRAGONPRIZE: "event_copy_dragonprize", //龙王宝藏领奖
		EVENT_COPY_HEAVENPRIZE: "event_copy_heavenprize", //天庭试炼领奖

		EVENT_MEIRI_HAOLI: "event_meiri_haoli", //每日豪礼
		EVENT_WELFARE_SIGN: "event_welfare_sign", //福利大厅-签到奖励
		EVENT_WELFARE_SIGN_GIFT: "event_welfare_sign_gift", //每日签到奖励
		EVENT_WELFARE_LEVEL: "event_welfare_level", //福利大厅-等级奖励
		EVENT_WELFARE_MONTH_CARD: "event_welfare_month_card", //福利大厅-月卡
		EVENT_WELFARE_WEEK_CARD: "event_welfare_week_card", //福利大厅-周卡
		EVENT_MEIRI_PAY: "event_meiri_pay", //每日重置
		EVENT_WELFARE: "event_welfare", //福利大厅
		EVENT_WELFARE_WELFARE: "event_welfare_welfare", //福利大厅-福利
		EVENT_SANSHENGSANSHI: "event_sanshengsanshi", //三生三世
		EVENT_SANSHENG_HOUSE: "event_sansheng_house", //三生三世-房子
		EVENT_SHITU: "event_shitu", //三生三世-师徒
		EVENT_SHITU_SHIFU: "event_shitu_shifu", //三生三世-师徒(我的师傅)
		EVENT_SHITU_TUDI: "event_shitu_tudi", //三生三世-师徒(我的徒弟)
		EVENT_SHITU_APPLY_LIST: "event_shitu_apply_list", //三生三世-师徒(师徒邀请)
		EVENT_SONG_YUANBAO: "event_song_yuanbao", //送元宝
		EVENT_FIRST_PAY: "event_first_pay", //首充
		EVENT_TOUZI_CHENGZHAG: "event_touzi_chengzhang", //成长计划
		EVENT_FRIEND_YOUQINGBI: "event_friend_youqingbi", //友情币
		EVENT_FRIEND: "event_friend", //好友
		EVENT_PAU_STAGE: "event_pay_stage", //直升丹
		EVENT_GOD_EQUIP: "event_god_equip", //神装
		EVENT_GOD_EQUIP_LEVEL: "event_god_equip_level", //神装升级
		EVENT_GOD_EQUIP_FENJIE: "event_god_equip_fenjie", //神装分解
		EVENT_TEN_GIFT: "event_ten_gift", //十元购
		EVENT_LEIJI_PAY: "event_leiji_pay", //累计充值
		EVENT_GOD_PET_LAIXI: "event_god_pet_laixi",	//神宠来袭
		EVENT_TOUZI_JIHUA: "event_touzi_jihua",	//投资计划



		//refreshDotTipsEvent

		EVENT_FUN_DAN: "event_fun_dan", //属性丹
		EVENT_FUN_EQUIP: "event_fun_equip", //通用装备
		EVENT_FUN_SKILL: "event_fun_skill", //通用技能
		EVENT_FUN_UPGRADE: "event_fun_upgrade", //通用升级
		EVENT_FUN_SKIN: "event_fun_skin", //通用皮肤
		EVENT_FUN_SHOOTUP: "event_fun_shootup", //通用直升丹

		EVENT_PET_UPGRADE: "event_pet_upgrade", //宠物升级
		EVENT_PET_EMBATTLE: "event_pet_embattle", //宠物出战和备战



		EVENT_FORGE_QIANGHUA: "event_forge_qianghua", //锻造强化
		EVENT_FORGE_JINGLIAN: "event_forge_jinglian", //锻造精炼
		EVENT_FORGE_DUANLIAN: "event_forge_duanlian", //锻造锻炼
		EVENT_FORGE_BAOSHI: "event_forge_baoshi", //锻造宝石

		EVENT_ROLE_EQUIP_TIPS: "event_role_equip_tips", //角色装备红点
		EVENT_ROLE_UPGRADE_TIPS: "event_role_upgrade_tips", //角色升级
		EVENT_ROLE_TITLE_TIPS: "event_role_title_tips", //角色称号
		EVENT_ROLE_FASHION_TIPS: "event_role_fashion_tips", //角色时装
		EVENT_ROLE_SKILL: "event_role_skill", //角色技能

		EVENT_XIANLV_TOTAL_UPGRADE: "event_xianlv_total_upgrade", //仙侣升阶
		EVENT_XIANLV_UPGRADE: "event_xianlv_upgrade", //仙侣升阶
		EVENT_XIANLV_TOTAL_UPSTART: "event_xianlv_total_upstart", //仙侣升星
		EVENT_XIANLV_UPSTART: "event_xianlv_upstart", //仙侣升星
		EVENT_XIANLV_TOTAL_JIHUO: "event_xianlv_total_jihuo", //仙侣激活外面的
		EVENT_XIANLV_JIHUO: "event_xianlv_jihuo",  ///仙侣激活
		EVENT_XIANLV_TOTOL_FIGHT: "event_xianlv_total_fight", //仙侣外面的出站
		EVNET_XIANLV_FIGHT: "event_xianlv_fight",  //仙侣出站


		EVENT_DAILY_XIANGYAO: "event_daily_xiangyao",  //日常降妖
		EVENT_DAILY_ZUDUI: "event_daily_zudui", 		//日常组队
		//EVENT_DAILY_ZUDUI_ISDOUBLE: "event_daily_zudui_isdouble", //日常组队双倍
		EVENT_DAILY_SANBAI: "event_daily_sanbai",  	//日常三百
		EVENT_DAILY_LILIAN: "event_daily_lilian",  	//日常历练

		EVENT_FABAO_FABAO: "event_fabao_fabao",      //角色法宝
		EVENT_FABAO_UPGRADE: "event_fabao_upgrade",  //法宝升级
		EVENT_FABAO_DAZAO_PUTONG: "event_fabao_dazao_putong",    //法宝打造普通
		EVENT_FABAO_DAZAO_WANMEI: "event_fabao_dazao_wanmei",    //法宝打造完美
		EVENT_FABAO_FENJIE: "event_fabao_fenjie",   //法宝分解

		EVENT_PET_NATURL: "event_pet_naturl",  //宠物资质
		EVENT_PET_ACTIVE: "event_pet_active",  //宠物激活

		EVENT_CLUB_HALL: "event_club_hall", //帮会大厅
		EVENT_CLUB_INCENSE: "event_club_incense", //帮会上香
		EVENT_CLUB_FUBEN: "event_club_fuben", //帮会副本
		EVENT_CLUB_SKILL: "event_club_skill", //帮会技能

		EVENT_TIANXIAN_DANYAO: "event_tianxian_daoyao", //天仙丹药
		EVENT_TIANXIAN_JINGMAI: "event_tianxian_jingmai",  //天仙经脉


		EVENT_SHOP_UNLOCK_TIPS: "event_shop_unlock_tips", //商店解锁
		EVENT_SHOP_EQUIP_TIPS: "event_shop_equip_tips",  //装备解锁
		EVENT_SHOP_GOLD_SMELT: "event_shop_gold_smelt", //金装分解

		EVENT_VIP_PRIZE: "event_vip_prize", //VIP奖励

		EVENT_CARNIVAL_UPGRADE: "event_carnival_upgrade", //狂欢进阶
		EVENT_NOR_INST_ZONES: "event_nor_inst_zones", //狂欢副本

		//开服活动
		EVENT_NEW_STAGE_LEVEL_UP: "event_new_stage_level_up", //新服进阶活动
		EVENT_NEW_ALL_STAGE_UP: "event_new_all_stage_up", //开服全民进阶活动
		EVENT_NEW_ALL_BUY: "event_new_all_buy", //开服全名团购
		EVENT_NEW_SHOP_DISCOUNT: "event_new_shop_discount", //开服折扣商店
		EVENT_NEW_MIXACCU_RECHARGE: "event_new_mixaccu_recharge", //开服累充
		EVENT_NEW_ALL_LEVEL_UP: "event_new_all_level_up", //全民升级
		EVENT_NEW_INST_ZONES: "event_new_inst_zones",  //升级副本
		EVENT_NEW_STAGE_UP_RANK: "event_new_stage_up_rank",  //进阶排行活动					***
		EVENT_NEW_MISSION: "event_new_mission",  //龙宫章节

		EVENT_HUSONG_TIPS: "event_husong_tips", //护送

		EVENT_BEIBAO_TIPS: "event_beibao_tips", //背包可用道具

		EVENT_CROSS_TEAM: "event_cross_team",  //跨服组队

		//EVENT_PASS_CAMPAIGN: "event_pass_campaign",  //通关奖励

		EVENT_FIRST_SHOP_SHOW: "event_first_shop_show", //
		EVENT_BEFALL_SWEEP: "event_befall_sweep",		//生死劫扫荡

		EVENT_LUCKY_PRIZE_TIPS: "event_lucky_prize_tips", //幸运豪礼

		EVENT_WONDER_ACTIVITY: "event_wonder_activity", //精彩活动

		EVENT_FUN_PRIZE: "event_fun_prize", //通用进阶奖励

		EVENT_PEERLESS_TIPS: "event_peerless_tips", //天下第一

		EVENT_CAMPAIGN_SINGLE: "event_campaign_single", //关卡个人首通

		EVENT_CLUB_STORE: "event_club_store", //帮会仓库

		EVENT_PET_FLY: "event_pet_fly", //宠物飞升
		EVENT_TIANGONG_CAN_OCCUPY: "event_tiangong_can_occupy", //天宫可占领

		EVENT_SHENHUN_JUANKE: "event_shenhun_jianke", //神魂提示
		EVENT_SHENHUN_HUNBI: "event_shenhun_hunbi",  //猎魂魂币

	}


	export let GuideFuncReadTypeDefine = {
		// PET_AWAKE: "awake",
		// PROFESSION_PROMOTE: "profession",
		// PET_HERO_LEVEL: "level",

		// PET_HERO_SKILLLEVEL: "skilllevel",

		// STONE_LINK: "link", //天赋石羁绊
		// STONE_LINKEMPTY: "linkempty", //天赋石多了个孔

		// SHOP_SELL: "shopsell",
		// ACTIVATE_GIFT: "actgift",

		TASK_CAMPAIN: "taskcampain",

		PET_ACTIVE: "petactive", //宠物激活

		CLUB_STORE: "clubstore", //帮会仓库
	}


	//需要监听的事件列表
	export let GuideFuncEvent: any = {
		[GuideFuncCheckDefine.EVENT_EMAIL]: [EventDefine.MAIL_LIST,],
		[GuideFuncCheckDefine.EVENT_FRIEND_APPLY]: [EventDefine.FRIEND_APPLYLIST_UPDATE,],
		[GuideFuncCheckDefine.EVENT_FRIEND_CHAT]: [EventDefine.MESSAGE_UPDATE, EventDefine.OFFLINE_CHAT_MSG, EventDefine.FRIEND_UNREAD_UPDATE],
		[GuideFuncCheckDefine.EVENT_ACTIVITY_OPEN]: [EventDefine.ACTIVITY_STATE_LIST, EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_CHAMPION_FIGHT]: [EventDefine.HERO_INFO_UPDATE,],

		[GuideFuncCheckDefine.EVENT_PET_UPGRADE]: [EventDefine.ITEM_UPDATE, EventDefine.PET_LIST_UPDATE, EventDefine.PET_UPDATE],
		//[GuideFuncCheckDefine.EVENT_PET_EQUIP]: [EventDefine.ITEM_UPDATE, EventDefine.PET_LIST_UPDATE, EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_PET_SKILLUPGRADE]: [EventDefine.ITEM_UPDATE, EventDefine.PET_LIST_UPDATE, EventDefine.HERO_INFO_UPDATE],

		[GuideFuncCheckDefine.EVENT_SERVER_NOTICE]: [EventDefine.GUIDE_SERVER_NOTICE,],
		[GuideFuncCheckDefine.EVENT_PAY_PRIZE]: [EventDefine.PAY_ACTIVITY_INFO,],
		[GuideFuncCheckDefine.EVENT_VIP_DAILY]: [EventDefine.HERO_INFO_UPDATE,],
		[GuideFuncCheckDefine.EVENT_CLUB_NULL]: [EventDefine.HERO_INFO_UPDATE,],

		[GuideFuncCheckDefine.EVENT_ITEM_EXSIT]: [EventDefine.ITEM_UPDATE],

		[GuideFuncCheckDefine.EVENT_MEIRI_HAOLI]: [EventDefine.HERO_INFO_UPDATE, EventDefine.PAY_ACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_WELFARE_SIGN]: [EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_WELFARE_SIGN_GIFT]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_WELFARE_LEVEL]: [EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_WELFARE_MONTH_CARD]: [EventDefine.HERO_INFO_UPDATE, EventDefine.PAY_ACTIVITY_MONTH_CARD],
		[GuideFuncCheckDefine.EVENT_WELFARE_WEEK_CARD]: [EventDefine.HERO_INFO_UPDATE, EventDefine.PAY_ACTIVITY_WEEK_CARD],
		[GuideFuncCheckDefine.EVENT_MEIRI_PAY]: [EventDefine.PAY_ACTIVITY_INFO, EventDefine.ITEM_UPDATE, EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_WELFARE]: [EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_WELFARE_WELFARE]: [EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_FRIEND_YOUQINGBI]: [EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_FRIEND]: [EventDefine.HERO_INFO_UPDATE],




		[GuideFuncCheckDefine.EVENT_COPY_MATERIAL]: [EventDefine.BOSSACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_COPY_DRAGON]: [EventDefine.BOSSACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_COPY_TEMPLE]: [EventDefine.BOSSACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_COPY_HEAVEN]: [EventDefine.BOSSACTIVITY_INFO],

		[GuideFuncCheckDefine.EVENT_BOSS_SINGLE]: [EventDefine.BOSSACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_BOSS_GLOBAL]: [EventDefine.BOSSACTIVITY_INFO, EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_BOSS_WILD]: [EventDefine.BOSSACTIVITY_INFO, EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_BEFALL_SWEEP]: [EventDefine.BOSSACTIVITY_INFO],

		[GuideFuncCheckDefine.EVENT_EQUIPPACKET_FULL]: [EventDefine.ITEM_UPDATE, EventDefine.HERO_INFO_UPDATE],

		[GuideFuncCheckDefine.EVENT_COPY_DRAGONPRIZE]: [EventDefine.BOSSACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_COPY_HEAVENPRIZE]: [EventDefine.BOSSACTIVITY_INFO],

		[GuideFuncCheckDefine.EVENT_FUN_DAN]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_FUN_EQUIP]: [EventDefine.ITEM_UPDATE, EventDefine.PET_FUN_INFO_REFRESH],
		[GuideFuncCheckDefine.EVENT_FUN_SKILL]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_FUN_UPGRADE]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_FUN_SKIN]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_FUN_SHOOTUP]: [EventDefine.ITEM_UPDATE],

		[GuideFuncCheckDefine.EVENT_FORGE_BAOSHI]: [EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_FORGE_DUANLIAN]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_FORGE_JINGLIAN]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_FORGE_QIANGHUA]: [EventDefine.ITEM_UPDATE],

		[GuideFuncCheckDefine.EVENT_ROLE_EQUIP_TIPS]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_ROLE_UPGRADE_TIPS]: [EventDefine.ACTOR_ROLE_UPDATE, EventDefine.HERO_INFO_UPDATE],

		[GuideFuncCheckDefine.EVENT_ROLE_TITLE_TIPS]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_ROLE_FASHION_TIPS]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_ROLE_SKILL]: [EventDefine.HERO_INFO_UPDATE],

		[GuideFuncCheckDefine.EVENT_XIANLV_TOTAL_UPGRADE]: [EventDefine.ITEM_UPDATE, EventDefine.HERO_INFO_UPDATE, EventDefine.ACTOR_XIANLV_UPDATE],
		[GuideFuncCheckDefine.EVENT_XIANLV_UPGRADE]: [EventDefine.ITEM_UPDATE, EventDefine.HERO_INFO_UPDATE, EventDefine.ACTOR_XIANLV_UPDATE],
		[GuideFuncCheckDefine.EVENT_XIANLV_TOTAL_UPSTART]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_XIANLV_UPSTART]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_XIANLV_TOTAL_JIHUO]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_XIANLV_JIHUO]: [EventDefine.ITEM_UPDATE],


		[GuideFuncCheckDefine.EVENT_DAILY_XIANGYAO]: [EventDefine.BOSSACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_DAILY_ZUDUI]: [EventDefine.BOSSACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_DAILY_SANBAI]: [EventDefine.BOSSACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_DAILY_LILIAN]: [EventDefine.BOSSACTIVITY_INFO],
		//[GuideFuncCheckDefine.EVENT_DAILY_ZUDUI_ISDOUBLE]: [EventDefine.BOSSACTIVITY_INFO],

		[GuideFuncCheckDefine.EVENT_PET_EMBATTLE]: [EventDefine.PET_UPDATE, EventDefine.PET_LIST_UPDATE],

		[GuideFuncCheckDefine.EVENT_FABAO_FABAO]: [EventDefine.ITEM_UPDATE, EventDefine.ACTOR_ROLE_FABAO_UPDATE],
		[GuideFuncCheckDefine.EVENT_FABAO_UPGRADE]: [EventDefine.ITEM_UPDATE, EventDefine.ACTOR_ROLE_FABAO_UPDATE],
		[GuideFuncCheckDefine.EVENT_FABAO_DAZAO_PUTONG]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_FABAO_DAZAO_WANMEI]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_FABAO_FENJIE]: [EventDefine.ITEM_UPDATE, EventDefine.ACTOR_FABAO_FENJIE_UPDATE],

		[GuideFuncCheckDefine.EVENT_CLUB_HALL]: [EventDefine.ITEM_UPDATE, EventDefine.CLUB_PLAYER_ACTIVE_INFO, EventDefine.GET_CLUB_APPLY_LIST],
		[GuideFuncCheckDefine.EVENT_CLUB_INCENSE]: [EventDefine.CLUB_RENQI_INFO],
		[GuideFuncCheckDefine.EVENT_CLUB_FUBEN]: [EventDefine.GET_CLUB_INFO],
		[GuideFuncCheckDefine.EVENT_CLUB_SKILL]: [EventDefine.CLUB_SKILL_INFO],

		[GuideFuncCheckDefine.EVENT_SANSHENGSANSHI]: [EventDefine.HERO_INFO_UPDATE, EventDefine.HOUSE_UPDATE, EventDefine.SHITU_UPDATE, EventDefine.SHITU_APPLY_LIST],
		[GuideFuncCheckDefine.EVENT_SANSHENG_HOUSE]: [EventDefine.HERO_INFO_UPDATE, EventDefine.HOUSE_UPDATE],
		[GuideFuncCheckDefine.EVENT_SHITU]: [EventDefine.HERO_INFO_UPDATE, EventDefine.SHITU_UPDATE, EventDefine.SHITU_APPLY_LIST],
		[GuideFuncCheckDefine.EVENT_SHITU_SHIFU]: [EventDefine.HERO_INFO_UPDATE, EventDefine.SHITU_UPDATE],
		[GuideFuncCheckDefine.EVENT_SHITU_TUDI]: [EventDefine.HERO_INFO_UPDATE, EventDefine.SHITU_UPDATE],
		[GuideFuncCheckDefine.EVENT_SHITU_APPLY_LIST]: [EventDefine.HERO_INFO_UPDATE, EventDefine.SHITU_APPLY_LIST],
		[GuideFuncCheckDefine.EVENT_SONG_YUANBAO]: [EventDefine.PAY_ACTIVITY_INFO, EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_FIRST_PAY]: [EventDefine.PAY_ACTIVITY_INFO, EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_TOUZI_CHENGZHAG]: [EventDefine.PAY_ACTIVITY_INFO, EventDefine.HERO_INFO_UPDATE],

		[GuideFuncCheckDefine.EVENT_TIANXIAN_DANYAO]: [EventDefine.TIANXIAN_UPDATE, EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_TIANXIAN_JINGMAI]: [EventDefine.TIANXIAN_UPDATE, EventDefine.ITEM_UPDATE],

		[GuideFuncCheckDefine.EVENT_XIANLV_TOTOL_FIGHT]: [EventDefine.TIANXIAN_UPDATE],
		[GuideFuncCheckDefine.EVNET_XIANLV_FIGHT]: [EventDefine.TIANXIAN_UPDATE],

		[GuideFuncCheckDefine.EVENT_SHOP_UNLOCK_TIPS]: [EventDefine.SHOP_FUN_UPDATE, EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_SHOP_GOLD_SMELT]: [EventDefine.ITEM_UPDATE],

		[GuideFuncCheckDefine.EVENT_VIP_PRIZE]: [EventDefine.VIP_PRIZE_UPDATE],

		[GuideFuncCheckDefine.EVENT_CARNIVAL_UPGRADE]: [EventDefine.PAY_ACTIVITY_INFO, EventDefine.PET_FUN_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_NOR_INST_ZONES]: [EventDefine.PAY_ACTIVITY_INFO],

		[GuideFuncCheckDefine.EVENT_NEW_STAGE_LEVEL_UP]: [EventDefine.PAY_ACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_NEW_ALL_STAGE_UP]: [EventDefine.PAY_ACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_NEW_ALL_BUY]: [EventDefine.PAY_ACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_NEW_SHOP_DISCOUNT]: [EventDefine.PAY_ACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_NEW_MIXACCU_RECHARGE]: [EventDefine.PAY_ACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_NEW_ALL_LEVEL_UP]: [EventDefine.PAY_ACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_NEW_INST_ZONES]: [EventDefine.PAY_ACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_NEW_STAGE_UP_RANK]: [EventDefine.PAY_ACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_NEW_MISSION]: [EventDefine.PAY_ACTIVITY_INFO],

		[GuideFuncCheckDefine.EVENT_HUSONG_TIPS]: [EventDefine.ESCORT_UPDATE],

		[GuideFuncCheckDefine.EVENT_BEIBAO_TIPS]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_CROSS_TEAM]: [EventDefine.BOSSACTIVITY_INFO],

		[GuideFuncCheckDefine.EVENT_PAU_STAGE]: [EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_GOD_EQUIP_LEVEL]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_GOD_EQUIP]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_GOD_EQUIP_FENJIE]: [EventDefine.ITEM_UPDATE],
		[GuideFuncCheckDefine.EVENT_TEN_GIFT]: [EventDefine.HERO_INFO_UPDATE, EventDefine.PAY_ACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_LEIJI_PAY]: [EventDefine.HERO_INFO_UPDATE, EventDefine.PAY_ACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_GOD_PET_LAIXI]: [EventDefine.HERO_INFO_UPDATE, EventDefine.PAY_ACTIVITY_INFO],
		[GuideFuncCheckDefine.EVENT_TOUZI_JIHUA]: [EventDefine.HERO_INFO_UPDATE, EventDefine.PAY_ACTIVITY_INFO],

		//[GuideFuncCheckDefine.EVENT_PASS_CAMPAIGN]: [EventDefine.HERO_INFO_UPDATE],

		[GuideFuncCheckDefine.EVENT_LUCKY_PRIZE_TIPS]: [EventDefine.HERO_INFO_UPDATE],

		[GuideFuncCheckDefine.EVENT_WONDER_ACTIVITY]: [EventDefine.PAY_ACTIVITY_INFO],

		[GuideFuncCheckDefine.EVENT_FUN_PRIZE]: [EventDefine.HERO_INFO_UPDATE, EventDefine.PET_FUN_INFO_REFRESH, EventDefine.PET_FUN_INFO_UPDATE],

		[GuideFuncCheckDefine.EVENT_PEERLESS_TIPS]: [EventDefine.PEERLESS_UPDATE],

		[GuideFuncCheckDefine.EVENT_CAMPAIGN_SINGLE]: [EventDefine.ACTIVITY_RANK_UPDATE, EventDefine.CAMPAIGN_PASS, EventDefine.EXCITE_LIMIT_CAMPAIGN],

		[GuideFuncCheckDefine.EVENT_CLUB_STORE]: [EventDefine.HERO_ENTER_GAME, EventDefine.CLUB_REPO_UPDATE],

		[GuideFuncCheckDefine.EVENT_PET_FLY]: [EventDefine.HERO_INFO_UPDATE, EventDefine.PET_UPDATE],
		[GuideFuncCheckDefine.EVENT_TIANGONG_CAN_OCCUPY]: [EventDefine.HERO_INFO_UPDATE],

		[GuideFuncCheckDefine.EVENT_SHENHUN_HUNBI]: [EventDefine.HERO_INFO_UPDATE],
		[GuideFuncCheckDefine.EVENT_SHENHUN_JUANKE]: [EventDefine.ITEM_UPDATE],
	}



	export let guideFuncCheckHandler: any = {}


	//////////////////////////////////////////////////-
	//未读邮件
	function checkEmail(param, args, eventAgs?) {
		return MailSystem.getInstance().getUnreadEmailCount() > 0
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_EMAIL] = checkEmail

	//////////////////////////////////////////////////-
	//好友申请（显示是友情币）
	function checkFriendApply(param, args, eventAgs?) {
		// let friendList = FriendSystem.getInstance().getFriendInfoList()
		let getRecordList = getSaveRecord(opSaveRecordKey.youQingBiList) || []
		let getList = getRecordList.getCoin || []
		let getNum = getRecordList.count || 0
		if (getNum >= 10) {
			return false
		}
		for (let _ in getList) {
			let roleId = tonumber(_)
			if (getList && getList[roleId] == 1) {
				return true
			}
		}
		return false
		//return FriendSystem.getInstance().getApplyStrangerCount() > 0
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FRIEND_APPLY] = checkFriendApply

	//////////////////////////////////////////////////-
	//好友聊天未读
	function checkFriendUnReadMsgCount(param, args, eventAgs?) {
		return FriendSystem.getInstance().getFriendUnReadMsgCount(-1) > 0
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FRIEND_CHAT] = checkFriendUnReadMsgCount

	//////////////////////////////////////////////////-
	//活动开启
	function checkActivityOpen(param, args, eventAgs?) {
		let exceptList: any = []

		for (let index in ActivityTimeDefine) {
			let _ = ActivityTimeDefine[index]

			if (table_isExist(exceptList, tonumber(index)) == false) {
				let stateInfo = GetActivityTimeState(index)
				if (stateInfo && stateInfo.state == ActivityTimeState.ONGOING) {

					if (GetHeroProperty("faction") == 0 && tonumber(index) == OrdinaryActivityIndex.FactionMonster) { //帮会强盗未进帮
						continue
					}

					let info = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.FactionMonster)
					if (info && info.hpPercent == 0 && info.prize > 0) { //帮会强盗已领奖
						continue
					}

					if (tonumber(index) == OrdinaryActivityIndex.HUSONG) { //西游护送双倍期间次数用完
						let actInfo = GetActivity(ActivityDefine.HuSong).getActInfo()
						if (actInfo == null || actInfo.husongTwice == null) continue
						if (actInfo.husongTwice <= 0) {
							continue
						}
					}

					return true
				}
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_ACTIVITY_OPEN] = checkActivityOpen

	//////////////////////////////////////////////////-
	//竞技场挑战
	function checkChampionFight(param, args, eventAgs?) {
		let a = GetActivity(ActivityDefine.Champion)
		let info = a.getChampionInfo()
		let count = info.count || 0

		return count > 0
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_CHAMPION_FIGHT] = checkChampionFight


	//////////////////////////////////////////////////-
	//首次打开精彩活动
	function checkFirstShow(param, args, eventAgs?) {
		if (param["shengdi"]) {				//圣地
			let power = GetHeroProperty("power")
			return power > 0
		}

		if (param["xingling"]) {
			let xinglingList = GetHeroProperty("xinglinglist") || []
			return size_t(xinglingList) < param["xingling"]
		}

		return true
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_ALWAYS_SHOW] = checkFirstShow
	/*
		//首次打开商店
		function checkFirstShopShow(param, args , eventAgs){
			if(param["times"] && args){
				return param["times"] > (args[param.index]  || 0)
			}
			return true
		}
		guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FIRST_SHOP_SHOW] = checkFirstShopShow*/
	//////////////////////////////////////////////////-
	//宠物升级
	function checkPetUpgrade(param, args, eventAgs?) {
		// let curInfo = null
		// if (args) {
		// 	curInfo = args.curInfo
		// }

		// let heroInfo = GetHeroPropertyInfo()
		// if (heroInfo == null) {
		// 	return false
		// }
		// //let heroLevel = heroInfo.level || 0

		// //if(heroLevel > 20 ){ //角色大于20级，不提示升级红点
		// //	return false
		// //}

		// return this.checkCommonFunc(this.checkUpgradeExp, param, args)

		let petInfoList = PetSystem.getInstance().getPetInfoList()
		for (let i in petInfoList) {
			let petNetInfo = petInfoList[i]

			if (!petNetInfo) {
				return false
			}

			let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(petNetInfo.entryid)

			let material = FunSystem.getInstance().getFunUpgradeMaterial(cellOptionsIndex.Pet, petNetInfo.stage)
			let ownCount = ItemSystem.getInstance().getItemCount(material.itemId)
			let needCount = material.itemNum
			let ownFunds = GetHeroProperty("funds")
			let needFunds = material.money

			if (ownCount >= needCount && ownFunds >= needFunds && !GuideFuncSystem.getInstance().checkPetFullLv(petNetInfo.entryid)) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_PET_UPGRADE] = checkPetUpgrade


	//////////////////////////////////////////////////-
	//检查装备穿戴
	// function checkPetEquip(param, args, eventAgs?) {

	// 	return this.checkPetFunc(this.checkEquipInternal, param, args)

	// }
	// guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_PET_EQUIP] = checkPetEquip



	//////////////////////////////////////////////////-
	//检查技能升级
	function checkPetSkillUpgrade(param, args, eventAgs?) {

		return this.checkCommonFunc(this.checkSkillUpgrade, param, args)
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_PET_SKILLUPGRADE] = checkPetSkillUpgrade



	//服务器简单（红点）通知提示
	function checkServerNotice(param, args, eventAgs?) {
		let notice = GuideFuncSystem.getInstance().getServerNotice()
		let flag = false

		////临时处理
		//if(param && param["index"] && param["index"] >= 100 ){
		//	if(CheckMainFrameFunction("zudui") == false ){
		//		return false
		//	}
		//}else{
		//	if(CheckMainFrameFunction("homepage") == false ){
		//		return false
		//	}
		//}

		if (param["index"]) {
			for (let _ in notice) {
				let index = notice[_]

				if (index == param["index"]) {
					flag = true
					break
				}
			}
		}

		return flag
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_SERVER_NOTICE] = checkServerNotice


	//服务器简单（红点）通知提示
	function checkPayPrize(param, args, eventAgs?) {
		let list = GuideFuncSystem.getInstance().checkPayActivityPrize()

		return size_t(list) > 0
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_PAY_PRIZE] = checkPayPrize


	//VIP每日奖励
	function checkVipDaily(param, args, eventAgs?) {
		let level = VipSystem.getInstance().GetVipLevel()
		let flag = true
		if (level <= 0) {
			level = 1
			flag = false
		}
		let record = getSaveRecord(opSaveRecordKey.vipGifts)

		if (record) {
			flag = false
		}

		return flag
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_VIP_DAILY] = checkVipDaily

	//////////////////////////////////////////////////-
	//动态提示
	function checkDynamicTips(param, args, eventAgs?) {
		let dynamicType = param["type"]

		if (this.dynamicTipsMap[dynamicType]) {
			return true
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_DYNAMIC_TIPS] = checkDynamicTips




	//未加入公会
	function checkClubNull(param, args, eventAgs?) {

		//let check = CheckMainFrameFunction("gonghui")
		//if(check == false ){
		//	return false;
		//}


		let factionId = GetHeroProperty("faction") || 0
		let heroLevel = GetHeroProperty("level") || 0
		if (heroLevel > 40) {
			return false
		}

		return factionId == 0
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_CLUB_NULL] = checkClubNull



	//物品存在
	function checkItemExsit(param, args, eventAgs?) {
		let itemlist = param["itemlist"]
		if (itemlist == null || itemlist.length == 0) {
			return false
		}

		let exsit = false
		for (let _ = 0; _ < itemlist.length; _++) {
			let v = itemlist[_]

			let entryId = v[0]
			let count = v[1]

			if (ItemSystem.getInstance().getItemCount(entryId) >= count) {
				exsit = true
				break
			}
		}

		return exsit
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_ITEM_EXSIT] = checkItemExsit



	//材料副本
	function checkCopyMaterial(param, args, eventAgs?) {
		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.MaterialBoss)
		if (actInfo == null)
			return false;

		let heroLevel = GetHeroProperty("level") || 0

		for (let k in GameConfig.CopyMaterialConfig) {
			let config = GameConfig.CopyMaterialConfig[k]

			if (heroLevel < config.level)
				continue;
			let count = 0
			//扫荡过的次数
			if (actInfo.prizeRecord[config.index]) {
				count = actInfo.prizeRecord[config.index]
			}

			if (count < config.chance) //有免费挑战次数
				return true;

		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_COPY_MATERIAL] = checkCopyMaterial


	//龙王宝藏
	function checkCopyDragon(param, args, eventAgs?) {
		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.DragonBoss)
		if (actInfo == null)
			return false

		if (actInfo.maxIndex == 0)//最新通关关卡
			return true

		//下一关
		let nextIndex = actInfo.maxIndex + 1
		let config = GameConfig.CopyDragonConfig[nextIndex]
		if (config == null)
			return false

		return true
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_COPY_DRAGON] = checkCopyDragon

	//小雷音寺
	function checkCopyTemple(param, args, eventAgs?) {
		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.SmallThunderTemple)
		if (actInfo == null)
			return false

		if (actInfo.maxIndex == 0)
			return true;
		//下一关
		let nextIndex = actInfo.maxIndex + 1
		let config = GameConfig.CopyTempleConfig[nextIndex]
		if (config == null)
			return false

		return true
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_COPY_TEMPLE] = checkCopyTemple

	//天庭试炼
	function checkCopyHeaven(param, args, eventAgs?) {
		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.HeavenTrial)
		if (actInfo == null)
			return false

		if (actInfo.maxIndex == 0)
			return true;
		//下一关
		let nextIndex = actInfo.maxIndex + 1
		let config = GameConfig.CopyHeavenConfig[nextIndex]
		if (config == null)
			return false

		return true
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_COPY_HEAVEN] = checkCopyHeaven


	//个人BOSS
	function checkBossSingle(param, args, eventAgs?) {
		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.PersonBoss)
		if (actInfo == null)
			return false;
		let npcList = actInfo.npcList

		let heroLevel = GetHeroProperty("level")

		for (let k in GameConfig.BossSingleConfig) {
			let config = GameConfig.BossSingleConfig[k]
			if (heroLevel < config.level)
				continue

			//剩余次数
			let count = config.chance
			if (npcList[config.index]) {
				count = count - npcList[config.index]
			}
			if (count > 0)
				return true
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_BOSS_SINGLE] = checkBossSingle

	//全民BOSS
	function checkBossGlobal(param, args, eventAgs?) {
		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.WorldPlayerBoss)
		if (actInfo == null)
			return false;
		if (actInfo.remainCount <= 0)//我的剩余战斗次数
			return false
		let npcList = actInfo.npcList

		let serverTime = GetServerTime()
		let heroLevel = GetHeroProperty("level")
		for (let k in GameConfig.BossGlobalConfig) {
			let config = GameConfig.BossGlobalConfig[k]
			if (heroLevel < config.level) //等级不足
				continue;

			let bossInfo = npcList[config.index]
			if (bossInfo == null)
				continue

			if (bossInfo.refreshTime == 0 || serverTime >= bossInfo.refreshTime) {//已刷新，血量不为0
				if (bossInfo.hpPercent > 0) {
					return true;
				}
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_BOSS_GLOBAL] = checkBossGlobal


	//野外BOSS
	function checkBossWild(param, args, eventAgs?) {
		let [flag, _] = CheckMainFrameFunction("yewaiBOSS")
		if (flag == false) {
			return false
		}

		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.WildBoss)
		// {
		//         npcList: {[npcIndex]:[refreshTime, status]},         [下次刷新的时间戳，opBossActivityConfig[OrdinaryActivityIndex.WildBoss]]
		// }
		if (actInfo == null)
			return false;
		let npcList = actInfo.npcList || {}

		let serverTime = GetServerTime()
		let heroLevel = GetHeroProperty("level")
		for (let k in GameConfig.BossWildConfig) {
			let config = GameConfig.BossWildConfig[k]
			if (heroLevel < config.level) //等级不足
				continue;

			let bossConfig = npcList[config.index]
			if (bossConfig != null && bossConfig[1] == opBossActivityConfig[OrdinaryActivityIndex.WildBoss].existStatus) {                       //已刷出
				let endTime = getSaveRecord(opSaveRecordKey.wildBossCoolTime) || 0
				if (endTime - GetServerTime() >= 0) {
					return false
				}

				let consumList = AnalyPrizeFormat(config.consum || [])
				let saveRecord = getSaveRecord(opSaveRecordKey.wildBossConsumeRecord) || {}             //[index]=1  1表示当前这个野外boss消耗过物品
				if (consumList.length > 0 && saveRecord[config.index] != 1) {
					let [entryId, count] = consumList[0]
					let hasCount = ItemSystem.getInstance().getItemCount(entryId)
					let itemName = ItemSystem.getInstance().getItemName(entryId)
					if (hasCount >= count) {
						return true
					} else {
						continue
					}
				} else {
					return true
				}
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_BOSS_WILD] = checkBossWild

	//生死劫扫荡
	function checkBefallSweep(param, args, eventAgs?) {
		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.LifeAndDeathBoss)
		// {
		//         maxIndex: 历史最大进度
		//         remainCount: 剩余帮助次数,
		//         prizeRecord: {[bossIndex]:value (0x1领取了战斗 0x2领取了宝箱奖励)}   opLifeAndDeathPrizeValueConfig
		// }
		let maxIndex = -1
		let prizeRecord = {}
		if (actInfo && actInfo.prizeRecord) {
			maxIndex = actInfo.maxIndex
			prizeRecord = actInfo.prizeRecord
		}

		for (let _ in GameConfig.BossBefallConfig) {
			let config = GameConfig.BossBefallConfig[_]
			let value = prizeRecord["-" + config.index]
			if (config.index <= maxIndex) {
				if ((value & opLifeAndDeathPrizeValueConfig.fightPrize) != opLifeAndDeathPrizeValueConfig.fightPrize) {                 //有可扫荡的关卡
					return true
				}
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_BEFALL_SWEEP] = checkBefallSweep

	//装备满了
	function checkEquipPacketFull(param, args, eventAgs?) {
		//return ItemSystem.getInstance().isEquipPacketAlmostFull()
		return ItemSystem.getInstance().isEquipPacketFull()

	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_EQUIPPACKET_FULL] = checkEquipPacketFull



	//龙王宝藏领奖
	function checkCopyDragonPrize(param, args, eventAgs?) {
		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.DragonBoss)
		if (actInfo == null)
			return false

		if (actInfo.maxIndex == 0)
			return false

		//类型"sixStar", "twelve", "eighteen"
		let typeCount = {
			sixStar: 6,
			twelve: 12,
			eighteen: 18,
		}
		let type = param["type"]
		let andOp = opDragonBossChapterConfig[type]
		if (andOp == null)
			return false

		let boxCount = typeCount[type]
		if (boxCount == null) {
			return false
		}

		let config = GameConfig.CopyDragonConfig[actInfo.maxIndex]
		if (config == null)
			return false

		//能否领取
		let chapterCanGain = {}								//
		for (let _ in GameConfig.CopyDragonConfig) {
			let conf = GameConfig.CopyDragonConfig[_]
			if (conf.chapter <= config.chapter) {
				chapterCanGain[conf.chapter] = checkNull(chapterCanGain[conf.chapter], 0)

				if (actInfo.npcList[conf.index]) {
					let starCount = 0
					if ((actInfo.npcList[conf.index] & opDragonBossIndexConfig.threeStar) == opDragonBossIndexConfig.threeStar) {
						starCount = 3
					} else if ((actInfo.npcList[conf.index] & opDragonBossIndexConfig.twoStar) == opDragonBossIndexConfig.twoStar) {
						starCount = 2
					} else if ((actInfo.npcList[conf.index] & opDragonBossIndexConfig.oneStar) == opDragonBossIndexConfig.oneStar) {
						starCount = 1
					}

					chapterCanGain[conf.chapter] = chapterCanGain[conf.chapter] + starCount
				}

			}
		}

		for (let _ in chapterCanGain) {
			let v = chapterCanGain[_]
			if (v >= boxCount) {
				//按位与
				let state = actInfo.stageList[_]
				if (state != null) {
					if ((state & andOp) != andOp) {
						return true
					}
				} else {
					return true
				}
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_COPY_DRAGONPRIZE] = checkCopyDragonPrize

	function checkCopyHeavenPrize(param, args, eventAgs?) {
		// let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.HeavenTrial)
		// if (actInfo == null)
		// 	return false;
		// let maxIndex = actInfo.maxIndex//历史最大进度
		// if (maxIndex == 0)
		// 	return false;
		// let boxIndex = actInfo.boxIndex//宝箱领取进度（已领取的）

		// for (let i = boxIndex; i < maxIndex; i++) {
		// 	let config = GameConfig.CopyHeavenConfig[i]
		// 	if (size_t(config.box)) {
		// 		return true
		// 	}
		// }

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_COPY_HEAVENPRIZE] = checkCopyHeavenPrize

	//每日豪礼
	function checkMeiriHaoli(param, args, eventAgs?) {
		let dailyPayCount = getSaveRecord(opSaveRecordKey.dailyRecharge) || 0
		let rmb = GetRmbFromGold(dailyPayCount)
		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.DAILY_EXPENSIVE_GIFT)
		if (playerInfo == null) {
			return false
		}
		let isGet = playerInfo[1]	//0未领取 //1已领取
		if (isGet == 0 && rmb >= 100) {
			return true
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_MEIRI_HAOLI] = checkMeiriHaoli

	//福利大厅-签到奖励
	function checkWelfareSign(param, args, eventAgs?) {
		let meiRiInfo = getSaveRecord(opSaveRecordKey.meiRiQianDao)
		let getPrize = meiRiInfo.getPrize
		if (getPrize[dailyPrizeType.accumulateLogin] == 0 || getPrize[dailyPrizeType.dailyLogin] == 0) {
			return true
		}
		let curVip = VipSystem.getInstance().GetVipLevel()
		if (curVip >= 4 && getPrize[dailyPrizeType.vipLogin] == 0) {
			return true
		}

		let dailyPayCount = getSaveRecord(opSaveRecordKey.dailyRecharge) || 0
		if (dailyPayCount > 0 && getPrize[dailyPrizeType.rechangeLogin] == 0) {
			return true
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_WELFARE_SIGN] = checkWelfareSign

	//每日签到奖励
	function checkWelfareSignGift(param, args, eventAgs?) {
		let meiRiInfo = getSaveRecord(opSaveRecordKey.meiRiQianDao)
		let getPrize = meiRiInfo.getPrize
		return getPrize[dailyPrizeType.accumulateLogin] == 0
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_WELFARE_SIGN_GIFT] = checkWelfareSignGift

	//福利大厅-等级奖励
	function checkWelfareLevel(param, args, eventAgs?) {
		let levelInfo = getSaveRecord(opSaveRecordKey.levelReward)
		let curLevel = GetHeroProperty("level") || 0
		let list = []
		for (let _ in GameConfig.LevelRewardConfig) {
			let v = GameConfig.LevelRewardConfig[_]
			table_insert(list, v)
		}

		for (let i = 0; i < size_t(list); i++) {
			let info = list[i]
			let needLevel = info.leve	//这个命名神坑
			if (curLevel >= needLevel) {
				if (levelInfo == null) {
					return true
				} else {
					if (levelInfo[needLevel] == null) {
						return true
					}
				}
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_WELFARE_LEVEL] = checkWelfareLevel

	//福利大厅-月卡
	function checkWelfareMonthCard(param, args, eventAgs?) {
		let isBuy = PaySystem.getInstance().isMonthCardActive()
		let monthCardInfo = PaySystem.getInstance().getMonthCardInfo()
		if (monthCardInfo == undefined) {
			return false
		}
		if (monthCardInfo.isGet == 0 && isBuy) {
			return true
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_WELFARE_MONTH_CARD] = checkWelfareMonthCard

	//周卡
	function checkWelfareWeekCard(param, args, eventAgs?) {
		let isBuy = PaySystem.getInstance().isWeekCardActive()
		let weekCardInfo = PaySystem.getInstance().getWeekCardInfo()
		if (weekCardInfo == undefined) {
			return false
		}
		if (weekCardInfo.isGet == 0 && isBuy) {
			return true
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_WELFARE_WEEK_CARD] = checkWelfareWeekCard

	//每日充值
	function checkMeiriPay(param, args, eventAgs?) {
		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.EVERY_MIXACCU_RECHARGE)
		let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.EVERY_MIXACCU_RECHARGE)
		if (activityInfo == null) {
			return false
		}
		if (playerInfo[1]) {
			let reachList = playerInfo[1]
			for (let _ in reachList) {
				let value = reachList[_]
				if (value == 0) {
					return true
				}
			}
		} else {
			let dailyPayCount = getSaveRecord(opSaveRecordKey.dailyRecharge) || 0
			let rmb = GetRmbFromGold(dailyPayCount)
			if (rmb >= 10) {
				return true
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_MEIRI_PAY] = checkMeiriPay

	//福利大厅-福利
	function checkWelfareWelfare(param, args, eventAgs?) {
		let day = GetServerDay()
		if (day <= 1) {
			return false
		}
		let jifenNum = getSaveRecord(opSaveRecordKey.xiyouLilianScore) || 0
		let recordList = getSaveRecord(opSaveRecordKey.xiyouWelfareReward) || []
		let curLevel = GetHeroProperty("level") || 0
		let list = []
		let index = 100
		for (let _ in GameConfig.XiyouWelfareConfig) {
			let v = GameConfig.XiyouWelfareConfig[_]
			if (jifenNum >= v.score && curLevel >= 80) {
				if (recordList == null || recordList[v.index] == null) {
					return true
				}
			}
			index = index + 1
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_WELFARE_WELFARE] = checkWelfareWelfare


	//福利大厅
	function checkWelfare(param, args, eventAgs?) {
		////////////////////////////////签到奖励
		let meiRiInfo = getSaveRecord(opSaveRecordKey.meiRiQianDao)
		let getPrize = meiRiInfo.getPrize
		if (getPrize[dailyPrizeType.accumulateLogin] == 0 || getPrize[dailyPrizeType.dailyLogin] == 0) {
			return true
		}
		let curVip = VipSystem.getInstance().GetVipLevel()
		if (curVip >= 4 && getPrize[dailyPrizeType.vipLogin] == 0) {
			return true
		}

		let dailyPayCount = getSaveRecord(opSaveRecordKey.dailyRecharge) || 0
		if (dailyPayCount > 0 && getPrize[dailyPrizeType.rechangeLogin] == 0) {
			return true
		}
		////////////////////////////////等级奖励
		////////////////////////////////
		let levelInfo = getSaveRecord(opSaveRecordKey.levelReward)
		let curLevel = GetHeroProperty("level") || 0
		let list = []
		for (let _ in GameConfig.LevelRewardConfig) {
			let v = GameConfig.LevelRewardConfig[_]
			table_insert(list, v)
		}
		for (let i = 0; i < size_t(list); i++) {
			let info = list[i]
			let needLevel = info.leve	//这个命名神坑
			if (curLevel >= needLevel) {
				if (levelInfo == null) {
					return true
				} else {
					if (levelInfo[needLevel] == null) {
						return true
					}
				}
			}
		}
		////////////////////////////////月卡
		////////////////////////////////
		let isBuy = PaySystem.getInstance().isMonthCardActive()
		let monthCardInfo = PaySystem.getInstance().getMonthCardInfo()
		if (monthCardInfo != undefined && monthCardInfo.isGet == 0 && isBuy) {
			return true
		}
		////////////////////////////////周卡
		////////////////////////////////
		let isBuyWeekCard = PaySystem.getInstance().isWeekCardActive()
		let weekCardInfo = PaySystem.getInstance().getWeekCardInfo()
		if (weekCardInfo != undefined && weekCardInfo.isGet == 0 && isBuyWeekCard) {
			return true
		}
		////////////////////////////////
		////////////////////////////////福利大厅
		let jifenNum = getSaveRecord(opSaveRecordKey.xiyouLilianScore) || 0
		let recordList = getSaveRecord(opSaveRecordKey.xiyouWelfareReward) || []
		let index = 100
		let kaifuDay = GetServerDay() || 0	//开服多少天
		for (let _ in GameConfig.XiyouWelfareConfig) {
			let v = GameConfig.XiyouWelfareConfig[_]
			if (jifenNum >= v.score && curLevel >= 80) {
				if (recordList == null || recordList[v.index] == null && kaifuDay >= 2) {
					return true
				}
			}
			index = index + 1
		}
		////////////////////////////////
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_WELFARE] = checkWelfare

	function checkFunSkin(param, args, eventAgs?) {
		let funType = param["type"]

		if (!cellOptionsName[funType - 1]) {
			return false
		}
		return GuideFuncSystem.getInstance().checkFunSkin(funType)
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FUN_SKIN] = checkFunSkin

	function checkFunShootUp(param, args, eventAgs?) {
		let funType = param["type"]

		if (!cellOptionsName[funType - 1]) {
			return false
		}
		return GuideFuncSystem.getInstance().checkShootUp(funType)
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FUN_SHOOTUP] = checkFunShootUp

	//属性丹
	function checkFunDan(param, args, eventAgs?) {
		let funType = param["type"]

		if (!cellOptionsName[funType - 1]) {
			return false
		}

		return GuideFuncSystem.getInstance().checkPropertyDan(funType)
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FUN_DAN] = checkFunDan

	//通用装备
	function checkFunEquip(param, args, eventAgs?) {
		let funType = param["type"]
		if (!funType) {
			return false
		}

		let canwear = false
		for (let i = 0; i < 4; i++) {
			canwear = GuideFuncSystem.getInstance().checkOneFunEquip(funType, i)
			if (canwear) {
				return true
			}
		}
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FUN_EQUIP] = checkFunEquip

	//通用技能
	function checkFunSkill(param, args, eventAgs?) {
		let funType = param["type"]
		if (!funType) {
			return false
		}

		let canUpgrade = false
		for (let i = 0; i < 4; i++) {
			canUpgrade = GuideFuncSystem.getInstance().checkOneFunSkill(funType, i)
			if (canUpgrade) {
				break
			}
		}
		return canUpgrade
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FUN_SKILL] = checkFunSkill

	//通用升阶
	function checkFunUpgrade(param, args, eventAgs?) {
		let funType = param["type"]
		return GuideFuncSystem.getInstance().checkFunUpgrade(funType)
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FUN_UPGRADE] = checkFunUpgrade


	//锻造强化
	function checkForgeStrength(param, args, eventAgs?) {
		let key = getSaveRecord(opSaveRecordKey.equipIntenstifyRedDot)
		if (key == null) key = 1
		if (key == 0) {
			return false
		}
		let type = param["type"]
		let typeName = elemForgeNames[type - 1]
		let level = ForgeSystem.getInstance().getForgeTypeLevel(typeName)
		if (level == null) return false
		let toLevel = level + 1
		let config = GameConfig.FunForgeConfig[typeName][toLevel]
		if (config == null || config.money == null) {
			return false
		}

		let itemId = param["itemId"]

		let had = GetHeroMoney(itemId)

		if (had < config.money) {
			return false
		}

		return true
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FORGE_QIANGHUA] = checkForgeStrength


	//锻造精炼
	function checkForgeRefine(param, args, eventAgs?) {
		let type = param["type"]
		let typeName = elemForgeNames[type - 1]
		let level = ForgeSystem.getInstance().getForgeTypeLevel(typeName)
		if (level == null) return false
		let toLevel = level + 1
		let config = GameConfig.FunForgeConfig[typeName][toLevel]
		if (config == null || config.money == null) {
			return false
		}

		let itemId = param["itemId"]

		let had = ItemSystem.getInstance().getItemCount(itemId)

		return had >= config.itemnum
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FORGE_JINGLIAN] = checkForgeRefine


	//锻造锻炼
	function checkForgeDuanLian(param, args, eventAgs?) {
		let type = param["type"]
		let typeName = elemForgeNames[type - 1]
		let level = ForgeSystem.getInstance().getForgeTypeLevel(typeName)
		if (level == null) return false
		let toLevel = level + 1
		let config = GameConfig.FunForgeConfig[typeName][toLevel]
		if (config == null || config.money == null) {
			return false
		}

		let itemId = param["itemId"]

		let had = ItemSystem.getInstance().getItemCount(itemId)

		return had >= config.itemnum
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FORGE_DUANLIAN] = checkForgeDuanLian

	//锻造宝石
	function checkForgeBaoShi(param, args, eventAgs?) {
		let type = param["type"]
		let typeName = elemForgeNames[type - 1]
		let level = ForgeSystem.getInstance().getForgeTypeLevel(typeName)
		if (level == null) return false
		let toLevel = level + 1
		let config = GameConfig.FunForgeConfig[typeName][toLevel]
		if (config == null || config.money == null) {
			return false
		}

		let itemId = param["itemId"]

		let had = ItemSystem.getInstance().getItemCount(itemId)
		return had >= config.itemnum
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FORGE_BAOSHI] = checkForgeBaoShi


	//角色装备
	function checkRoleEquip(param, args, eventAgs?) {
		let roleInfo = RoleSystem.getInstance().getRecvList()
		if (roleInfo == null) return false
		//检查装备
		let itemlist = RoleSystem.getInstance().getRoleEquipList()
		if (size_t(itemlist) > 0) return true

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_ROLE_EQUIP_TIPS] = checkRoleEquip

	//角色升级
	function checkRoleUpgrade(param, args, eventAgs?) {
		let roleInfo = RoleSystem.getInstance().getRecvList()
		if (roleInfo == null) return false
		let heroInfo = GetHeroPropertyInfo()
		if (heroInfo == null) return false;
		//检查升级
		let level = roleInfo.stage
		let autoLevel = elemExpCaseOptions[cellOptionsIndex.Hero].AutoLevel
		if (level >= autoLevel && level < playerOptions.maxLevel) {
			let curExp = heroInfo.exp
			let maxExp = RoleSystem.getInstance().getLevelupExp()
			if (curExp >= maxExp) return true
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_ROLE_UPGRADE_TIPS] = checkRoleUpgrade

	//角色时装
	function checkRoleTitle(param, args, eventAgs?) {
		let type = param["type"]
		let typeNameList = {
			Hero: "unlocktitlelist",
			HeroEquip: "unlockfashionlist"
		}
		let typeName = typeNameList[cellOptionsName[type - 1]]
		let roleInfo = RoleSystem.getInstance().getRoleInfo(typeName)
		let arr = GameConfig.FunSkinConfig[cellOptionsName[type - 1]];
		for (let k in arr) {
			let config = arr[k]
			let itemid = config.itemid
			if (table_isExist(roleInfo, config.Index)) continue
			let had = ItemSystem.getInstance().getItemCount(itemid)
			if (had >= config.itemnum) {
				return true
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_ROLE_TITLE_TIPS] = checkRoleTitle
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_ROLE_FASHION_TIPS] = checkRoleTitle

	//角色技能
	function checkRoleSkillUpgrade(param, args, eventAgs?) {
		let levelList = RoleSystem.getInstance().getRoleInfo("skilllevellist")

		if (size_t(levelList) == 0) return false

		for (let k in levelList) {
			let level = levelList[k]
			if (level == 0) continue
			let heroStage = RoleSystem.getInstance().getRoleInfo("stage")
			if (level == heroStage) continue
			let config = GameConfig.FunSpendMoneyItemConfig["HeroSkill"][level]
			let needMony = config.money
			let had = GetHeroMoney(config.moneyunit)
			if (had >= needMony) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_ROLE_SKILL] = checkRoleSkillUpgrade

	//仙侣升阶 -- 总的
	function checkXianLvTotalUpgrade(param, args, eventAgs?) {
		let jihuoList = XianLvSystem.getInstance().getJiHuoList()

		for (let k in jihuoList) {
			let xianlvId = jihuoList[k]
			//if(xianlvId != select) continue
			let lv = XianLvSystem.getInstance().getLevel(xianlvId)
			let maxLevel = elemUpgradeStageOptions[cellOptionsIndex.XianLv].MaxLevel
			if (lv >= maxLevel) {
				continue
			}
			let upgradeConfig = GameConfig.FunUpgradeStageConfig["XianLv"][lv]
			let costCount = upgradeConfig.itemnum
			let had = ItemSystem.getInstance().getItemCount(upgradeConfig.itemid)
			if (had < costCount) continue
			let money = upgradeConfig.money
			let hadMoney = GetHeroMoney(upgradeConfig.moneyunit)
			if (hadMoney < money) continue
			return true
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_XIANLV_TOTAL_UPGRADE] = checkXianLvTotalUpgrade

	//仙侣升阶 ---单个
	function checkXianLvUpgrade(param, args, eventAgs?) {
		let jihuoList = XianLvSystem.getInstance().getJiHuoList()
		if (!args || args.xianlvId == null) {
			return false
		}
		let xianlvId = args.xianlvId
		if (table_isExist(jihuoList, xianlvId) == false) return false
		/*for(let k in jihuoList){
			let xianlvId = jihuoList[k]
			if(xianlvId != select) continue*/
		let lv = XianLvSystem.getInstance().getLevel(xianlvId)
		let maxLevel = elemUpgradeStageOptions[cellOptionsIndex.XianLv].MaxLevel
		if (lv >= maxLevel) {
			return false
		}
		let upgradeConfig = GameConfig.FunUpgradeStageConfig["XianLv"][lv]
		let costCount = upgradeConfig.itemnum
		let had = ItemSystem.getInstance().getItemCount(upgradeConfig.itemid)
		if (had < costCount) return false
		let money = upgradeConfig.money
		let hadMoney = GetHeroMoney(upgradeConfig.moneyunit)
		if (hadMoney < money) return false
		return true
		/*}
		return false*/
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_XIANLV_UPGRADE] = checkXianLvUpgrade

	//仙侣升星 --- 总的
	function checkXianLvTotalUpStart(param, args, eventAgs?) {
		let jihuoList = XianLvSystem.getInstance().getJiHuoList()

		for (let k in jihuoList) {
			let xianlvId = jihuoList[k]
			//if(xianlvId != select) continue
			let star = XianLvSystem.getInstance().getStar(xianlvId)
			let maxStar = elemUpgradeStageOptions[cellOptionsIndex.XianLvStart].MaxLevel
			if (star >= maxStar) {
				continue
			}
			let upgradeConfig = GameConfig.FunUpStarConfig["XianLv"][xianlvId]
			let upStartConfig = GameConfig.FunLevelNumConfig["XianLvStartUp"][star]
			if (upStartConfig == null) return false
			let costCount = upStartConfig.num
			let had = ItemSystem.getInstance().getItemCount(upgradeConfig.itemid)
			if (had >= costCount) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_XIANLV_TOTAL_UPSTART] = checkXianLvTotalUpStart

	//仙侣升星 -- 单个
	function checkXianLvUpStart(param, args, eventAgs?) {
		let jihuoList = XianLvSystem.getInstance().getJiHuoList()
		if (!args || args.xianlvId == null) {
			return false
		}
		let xianlvId = args.xianlvId
		if (table_isExist(jihuoList, xianlvId) == false) return false
		/*for(let k in jihuoList){
			let xianlvId = jihuoList[k]
			if(xianlvId != select) continue*/
		let star = XianLvSystem.getInstance().getStar(xianlvId)
		let maxStar = elemUpgradeStageOptions[cellOptionsIndex.XianLvStart].MaxLevel
		if (star >= maxStar) {
			return false
		}
		let upgradeConfig = GameConfig.FunUpStarConfig["XianLv"][xianlvId]
		let upStartConfig = GameConfig.FunLevelNumConfig["XianLvStartUp"][star]
		if (upStartConfig == null) return false
		let costCount = upStartConfig.num
		let had = ItemSystem.getInstance().getItemCount(upgradeConfig.itemid)
		if (had < costCount) return false
		return true
		/*}
		return false*/
	}

	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_XIANLV_UPSTART] = checkXianLvUpStart

	//仙侣激活 --总的
	function checkXianLvTotalJiHuo(param, args, eventAgs?) {
		let controlList = XianLvSystem.getInstance().getControlList()
		for (let k in controlList) {
			let xianlvInfo = controlList[k]
			let xianlvId = xianlvInfo.Id
			if (XianLvSystem.getInstance().isExit(xianlvId)) continue
			let had = ItemSystem.getInstance().getItemCount(xianlvInfo.itemid)
			if (had >= xianlvInfo.itemnum) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_XIANLV_TOTAL_JIHUO] = checkXianLvTotalJiHuo

	//仙侣激活
	function checkXianLvJiHuo(param, args, eventAgs?) {
		let jihuoList = XianLvSystem.getInstance().getJiHuoList()
		if (!args || args.xianlvId == null) {
			return false
		}
		let xianlvId = args.xianlvId
		let jiHuoItem = GameConfig.ActorXianLvConfig[xianlvId].itemid
		let jiHuoCost = GameConfig.ActorXianLvConfig[xianlvId].itemnum
		let jiHuoHad = ItemSystem.getInstance().getItemCount(jiHuoItem)
		if (jiHuoHad >= jiHuoCost) {
			return true
		}
		return false

	}

	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_XIANLV_JIHUO] = checkXianLvJiHuo


	//仙侣出站 -- 外面的
	function checkXianLvTotalFight(param, args, eventAgs?) {
		let jihuoList = XianLvSystem.getInstance().getJiHuoList()
		let fightList = XianLvSystem.getInstance().getFightList()
		let count = 0
		for (let k in fightList) {
			if (fightList[k] > 0) {
				count += 1
			}
		}
		if (count >= 2) return false
		for (let k in jihuoList) {
			let id = jihuoList[k]
			if (fightList[id] == 0 || fightList[id] == null) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_XIANLV_TOTOL_FIGHT] = checkXianLvTotalFight

	//仙侣出站
	function checkXianLvFight(param, args, eventAgs?) {
		//let jihuoList = XianLvSystem.getInstance().getJiHuoList()
		if (!args || args.xianlvId == null) {
			return false
		}
		let xianlvId = args.xianlvId
		if (XianLvSystem.getInstance().isExit(xianlvId) == false) return false
		let fightList = XianLvSystem.getInstance().getFightList()
		let count = 0
		for (let k in fightList) {
			if (fightList[k] > 0) {
				count += 1
			}
		}
		if (count >= 2) return false
		if (fightList[xianlvId] == 0 || fightList[xianlvId] == null) {
			return true
		}
		return false
	}

	guideFuncCheckHandler[GuideFuncCheckDefine.EVNET_XIANLV_FIGHT] = checkXianLvFight

	//日常降妖
	function checkDailyXiangYao(param, args, eventAgs?) {
		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.ZhongKuiDemon)
		if (actInfo == null) return false
		let npcList = actInfo.npcList
		for (let k in npcList) {
			let npc = npcList[k]
			if (npc - GetServerTime() <= 0) {
				return true
			}
		}

		return GuideFuncSystem.getInstance().checkDailyXiangYao()

	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_DAILY_XIANGYAO] = checkDailyXiangYao

	//日常组队
	function checkDailyZuDui(param, args, eventAgs?) {
		return GuideFuncSystem.getInstance().checkDailyZuDui()
	}

	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_DAILY_ZUDUI] = checkDailyZuDui
	//日常双倍
	/*function checkDailyZuDuiIsDouble(param, args, eventAgs?) {
		//return ItemSystem.getInstance().isEquipPacketAlmostFull()
		let actInfo = GetActivity(ActivityDefine.Boss).getLiLianInfo()
		if (actInfo == null) return false
		if (actInfo.isDouble == 2) {
			return true
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_DAILY_ZUDUI_ISDOUBLE] = checkDailyZuDuiIsDouble*/

	//日常三百
	function checkDailySanBai(param, args, eventAgs?) {
		return GuideFuncSystem.getInstance().checkDailySanBai()
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_DAILY_SANBAI] = checkDailySanBai

	//日常历练
	function checkDailyLiLian(param, args, eventAgs?) {
		let actInfo = GetActivity(ActivityDefine.Boss).getXiyouInfo()
		if (actInfo == null) return false

		let level = actInfo.level || 0
		let curexp = actInfo.curexp || 0
		let xiyouConfig = GameConfig.EveryDayLiLianUpConfig[level]
		if (xiyouConfig == null || size_t(xiyouConfig.prize) == 0)
			return false
		if (curexp >= xiyouConfig.exp) {
			return true
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_DAILY_LILIAN] = checkDailyLiLian

	//宠物布阵
	function checkPetEmbattle(param, args, eventAgs?) {
		let petList = PetSystem.getInstance().getPetActiveList()
		for (let i in petList) {
			let petId = petList[i]
			let combatList = PetSystem.getInstance().getEmbattlePosList()
			let petInfo = PetSystem.getInstance().getPetInfo(petId)
			if (!petInfo) {
				return false
			}
			if (size_t(combatList) < 3 && petInfo.combatpos == opPetCombatPos.Rest) {
				return true
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_PET_EMBATTLE] = checkPetEmbattle

	//角色法宝
	function checkRoleFabao(param, args, eventAgs?) {
		//判断是否解锁 -- 判断是否有item
		let level = GetHeroProperty("level")
		let vip = GetHeroProperty("VIP_level")
		let VIPUnLockList = opTailsmanPosLimit.VIPUnLockList
		let levelUnLockList = opTailsmanPosLimit.levelUnLockList
		let unLock = false
		for (let index = 1; index <= 4; index++) {
			//是否可以穿戴
			if (level >= levelUnLockList[index - 1] || vip >= VIPUnLockList[index - 1]) {
				unLock = true
			} else {
				continue
			}

			let item = RoleSystem.getInstance().getFaBaoItem(index)
			if (item == null && unLock == true) {
				let itemType = opItemType.ROLE_ALLSMAN
				let list = ItemSystem.getInstance().getItemLogicInfoByType(itemType)
				let check = false
				for (let k in list) {
					let item: Item = list[k]
					check = RoleSystem.getInstance().checkFaBaoItem(item.entryId, index)
					if (check) {
						break
					}
				}
				if (size_t(list) != 0 && check == true) {
					return true
				}
			}
		}
		return false
	}

	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FABAO_FABAO] = checkRoleFabao

	//法宝升级
	function checkFabaoUpgrade(param, args, eventAgs?) {
		let faBaoInfo = RoleSystem.getInstance().getFaBaoInfo()
		if (faBaoInfo == null) return false
		let levelList = faBaoInfo.talismanLevelList
		if (levelList == null) return false
		let upConfig = GameConfig.TalismanEquipUpConfig
		for (let k = 1; k <= 4; k++) {
			let item = RoleSystem.getInstance().getFaBaoItem(k)
			if (item == null) continue
			let dataKey = k + opTalismanEquipPos.begin - 1
			let level = levelList[dataKey] || 1
			let maxLevel = elemTalismanConfig.maxUpLevel
			if (level >= maxLevel) continue
			let config = upConfig[level]
			let needNum = config.needNum
			let had = ItemSystem.getInstance().getItemCount(config.entryId)
			if (had >= needNum) {
				return true
			}
		}
		return false
	}

	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FABAO_UPGRADE] = checkFabaoUpgrade

	//法宝打造普通
	function checkFabaoDaZaoPutong(param, args, eventAgs?) {
		let level = GetHeroProperty("level")
		if (level < elemTalismanConfig.unbindLevelOne) return false
		let list = ItemSystem.getInstance().getFaBaoItemList()
		if (size_t(list) >= defaultValue.MAX_ALISMAN_SIZE) return false
		let faShu = ItemSystem.getInstance().getItemCount(elemTalismanConfig.ordinaryItem1)
		let shenTie = ItemSystem.getInstance().getItemCount(elemTalismanConfig.ordinaryItem2)
		let needNum = elemTalismanConfig.perfectItem

		if (faShu < 1 || shenTie < 1) {
			return false
		}

		return true
	}

	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FABAO_DAZAO_PUTONG] = checkFabaoDaZaoPutong

	//法宝打造完美
	function checkFabaoDaZaoWanMei(param, args, eventAgs?) {
		let level = GetHeroProperty("level")
		if (level < elemTalismanConfig.unbindLevelOne) return false
		let list = ItemSystem.getInstance().getFaBaoItemList()
		if (size_t(list) >= defaultValue.MAX_ALISMAN_SIZE) return false
		let xuanJing = ItemSystem.getInstance().getItemCount(elemTalismanConfig.perfectItem)
		let needNum = 1

		return xuanJing >= needNum
	}

	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FABAO_DAZAO_WANMEI] = checkFabaoDaZaoWanMei

	//法宝分解
	function checkFabaoFenJie(param, args, eventAgs?) {
		let baseWnd: RoleFaBaoFrame = WngMrg.getInstance().getWindow("RoleFaBaoFrame")
		if (!baseWnd.tabWndList) return false
		let wnd: FaBaoFenJieWindow = baseWnd.tabWndList.getWndWithIndex(3)
		let isType = (!wnd || !wnd.typeList) ? false : true

		let list = ItemSystem.getInstance().getFaBaoItemList()
		if (size_t(list) == 0) return false
		for (let k in list) {
			let item: Item = list[k]
			if (item.getProperty("talisman_lock") == 0) {
				let quality = item.getProperty("quality")
				if (isType) {
					if (!table_isExist(wnd.typeList, quality)) continue
				} else {
					if (quality > opEquipQuality.purple) continue
				}
				return true
			}
		}

		return false
	}

	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FABAO_FENJIE] = checkFabaoFenJie

	//宠物资质
	function checkPetNaturl(param, args, eventAgs?) {
		let petInfoList = PetSystem.getInstance().getPetInfoList()
		for (let i in petInfoList) {
			let petNetInfo = petInfoList[i]
			if (GuideFuncSystem.getInstance().checkPetNaturl(petNetInfo.entryid)) {
				return true
			}
		}

		return false
	}

	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_PET_NATURL] = checkPetNaturl

	//宠物激活
	function checkPetActive(param, args, eventAgs?) {
		let petList = PetSystem.getInstance().getPetTiredList()
		for (let i in petList) {
			if (GuideFuncSystem.getInstance().checkPetActive(petList[i])) {
				return true
			}
		}

		return false
	}

	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_PET_ACTIVE] = checkPetActive

	//帮会大厅
	function checkClubHall(param, args, eventAgs?) {
		if (GetHeroProperty("faction") == 0) {
			return false
		}

		//帮会福利商店可购买
		if (GuideFuncSystem.getInstance().checkShopUnlock(19)) {
			return true
		}
		//帮会地图任务完成未领奖
		for (let i in opFactionMapTaskType) {
			let taskType = opFactionMapTaskType[i]
			if (GuideFuncSystem.getInstance().checkClubTaskFinish(taskType)) {
				return true
			}
		}
		//帮会地图可兑换
		for (let i = 0; i < 4; i++) {
			if (GuideFuncSystem.getInstance().checkClubExchange(i)) {
				return true
			}
		}
		//帮会活跃可升级
		if (GuideFuncSystem.getInstance().checkClubActiveUpgrade()) {
			return true
		}
		//帮会活跃每日奖励达成未领取
		for (let i in GameConfig.FactionActiveDailyiPrizeConfig) {
			if (GuideFuncSystem.getInstance().checkClubActivePrize(i)) {
				return true
			}
		}
		//帮会捐献有天工木
		if (GuideFuncSystem.getInstance().checkClubDonate()) {
			return true
		}
		//帮会有人申请进入
		if (GuideFuncSystem.getInstance().checkClubApply()) {
			return true
		}
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_CLUB_HALL] = checkClubHall

	//帮会上香
	function checkClubIncense(param, args, eventAgs?) {
		if (GetHeroProperty("faction") == 0) {
			return false
		}

		//帮会可上香
		let isShangXiang = getSaveRecord(opSaveRecordKey.facRenqiSet) || 0
		if (isShangXiang == 0) {
			return true
		}
		//帮会香火进度奖励可领取
		let renqiData = ClubSystem.getInstance().getClubRenqiInfo()

		if (renqiData == null)
			return false;

		let todayRenqiExp = renqiData.renqiExp //香火值
		let dailyRecord = getSaveRecord(opSaveRecordKey.facDailyRenqiPrize) || []
		for (let i in GameConfig.FactionRenqiPrizeConfig) {
			let config = GameConfig.FactionRenqiPrizeConfig[i]
			let renqi = config.renqi
			let hadGet = dailyRecord[i] == 1
			if (todayRenqiExp >= renqi && !hadGet) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_CLUB_INCENSE] = checkClubIncense

	//帮会副本
	function checkClubFuben(param, args, eventAgs?) {
		if (GetHeroProperty("faction") == 0) {
			return false
		}

		let record = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.FactInstZones) || {}
		let prizeCount = record.prizeCount || 0
		let prizeLimit = defaultValue.CLUB_FUBEN_FIGHT_COUNT

		return prizeCount > 0
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_CLUB_FUBEN] = checkClubFuben

	//帮会技能
	function checkClubSkill(param, args, eventAgs?) {
		if (GetHeroProperty("faction") == 0) {
			return false
		}

		let skillInfo = ClubSystem.getInstance().getClubSkillInfo()
		if (skillInfo == null) {
			return false
		}

		let level = skillInfo.level //最大等级
		let curBangGong = GetHeroMoney(opItemUnit.FACCONTRIBUTE_POINT)
		let nextBangGong = ClubSystem.getInstance().getClubSkillConfig(level + 1, "facContribute")

		return curBangGong >= nextBangGong
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_CLUB_SKILL] = checkClubSkill

	//三生三世-房子
	// function checkhouse(param, args, eventAgs?) {
	// 	return true
	// 	// let isMarry = (GetHeroProperty("spouseId")>0)	//是否结婚
	// 	// if(isMarry){
	// 	// 	let houseInfo = ActivitySystem.getInstance().getHouseInfo()
	// 	// 	if(houseInfo == null){
	// 	// 		return false
	// 	// 	}
	// 	// 	let level = houseInfo.houseData.stage || 1 
	// 	// 	let config = GameConfig.FunUpgradeStageConfig
	// 	// 	let houseConfig = config["Hourse"]
	// 	// 	if(level>=size_t(houseConfig)){
	// 	// 		return false
	// 	// 	}
	// 	// 	let curInfo = houseConfig[level]
	// 	// 	let itemId = curInfo.itemid
	// 	// 	let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)	//0
	// 	// 	let needItemCount = curInfo.itemnum	//2
	// 	// 	if(needItemCount <= ownItemCount){
	// 	// 		return true
	// 	// 	}
	// 	// }
	// 	// return false
	// }
	// guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_HOUSE] = checkhouse


	//三生三世
	function checkSansheng(param, args, eventAgs?) {
		let isMarry = (GetHeroProperty("spouseId") > 0)	//是否结婚
		if (isMarry) {
			let houseInfo = ActivitySystem.getInstance().getHouseInfo()
			if (houseInfo == null) {

			} else {
				let level = houseInfo.houseData.stage || 1
				let config = GameConfig.FunUpgradeStageConfig
				let houseConfig = config["Hourse"]
				if (level >= size_t(houseConfig)) {

				} else {
					let curInfo = houseConfig[level]
					let itemId = curInfo.itemid
					let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)	//0
					let needItemCount = curInfo.itemnum	//2
					if (needItemCount <= ownItemCount) {
						return true
					}
				}
			}
		}

		//还有师徒的
		let shituInfo = ActivitySystem.getInstance().getShiTuInfo()
		if (shituInfo == null) return false
		if (shituInfo && shituInfo.shifuInfo && shituInfo.shifuInfo.id > 0) {	//有师傅
			if (shituInfo.shifuInfo.chuanGong == 1) {
				return true
			}
			let task = shituInfo.shifuInfo.task //当前任务次数 task[任务id] = 完成次数
			let taskIsGetInfo = getSaveRecord(opSaveRecordKey.shituTaskPrize)	//任务是否领取信息
			for (let _ in GameConfig.ShiTuTaskConfig) {
				let v = GameConfig.ShiTuTaskConfig[_]
				if (task[v.ID] == v.maxCount && (taskIsGetInfo == null || taskIsGetInfo[v.ID] == null)) {
					return true
				}
			}
		}

		let tudiInfo = shituInfo.tudiInfo
		for (let i = 0; i < size_t(tudiInfo); i++) {
			let curTuDiInfo = tudiInfo[i]
			if (curTuDiInfo.id > 0) {
				let curTime = GetServerTime()
				let chushiTime = curTuDiInfo.chushiTime
				if (curTuDiInfo.chuanGong == 0 && curTime < chushiTime) {
					return true
				}
			}
		}

		//邀请列表
		let shituApplyListInfo = ActivitySystem.getInstance().getShiTuApplyListInfo()
		if (shituApplyListInfo != null) {
			for (let i = 0; i < size_t(shituApplyListInfo); i++) {
				let info = shituApplyListInfo[i]
				if (info.type == 2) {	//有人邀请了
					return true
				}
			}
		}

		return false
		// return true
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_SANSHENGSANSHI] = checkSansheng

	//三生三世-房子
	function checkSanShengHouse(param, args, eventAgs?) {
		// return true
		let isMarry = (GetHeroProperty("spouseId") > 0)	//是否结婚
		if (isMarry) {
			let houseInfo = ActivitySystem.getInstance().getHouseInfo()
			if (houseInfo == null) {

			} else {
				let level = houseInfo.houseData.stage || 1
				let config = GameConfig.FunUpgradeStageConfig
				let houseConfig = config["Hourse"]
				if (level >= size_t(houseConfig)) {

				} else {
					let curInfo = houseConfig[level]
					let itemId = curInfo.itemid
					let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)	//0
					let needItemCount = curInfo.itemnum	//2
					if (needItemCount <= ownItemCount) {
						return true
					}
				}
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_SANSHENG_HOUSE] = checkSanShengHouse

	//三生三世-师徒
	function checkShitu(param, args, eventAgs?) {
		let shituInfo = ActivitySystem.getInstance().getShiTuInfo()
		if (shituInfo && shituInfo.shifuInfo && shituInfo.shifuInfo.id > 0) {	//有师傅
			if (shituInfo.shifuInfo.chuanGong == 1) {
				return true
			}
			let task = shituInfo.shifuInfo.task //当前任务次数 task[任务id] = 完成次数
			let taskIsGetInfo = getSaveRecord(opSaveRecordKey.shituTaskPrize)	//任务是否领取信息
			for (let _ in GameConfig.ShiTuTaskConfig) {
				let v = GameConfig.ShiTuTaskConfig[_]
				if (task[v.ID] == v.maxCount && (taskIsGetInfo == null || taskIsGetInfo[v.ID] == null)) {
					return true
				}
			}
		}

		let tudiInfo = shituInfo.tudiInfo
		for (let i = 0; i < size_t(tudiInfo); i++) {
			if (tudiInfo && tudiInfo[i] && tudiInfo[i].id > 0) {
				let curTuDiInfo = tudiInfo[i]
				let curTime = GetServerTime()
				let chushiTime = curTuDiInfo.chushiTime
				if (curTuDiInfo.chuanGong == 0 && curTime < chushiTime) {
					return true
				}
			}
		}

		//邀请列表
		let shituApplyListInfo = ActivitySystem.getInstance().getShiTuApplyListInfo()
		if (shituApplyListInfo != null) {
			for (let i = 0; i < size_t(shituApplyListInfo); i++) {
				let info = shituApplyListInfo[i]
				if (info.type == 2) {	//有人邀请了
					return true
				}
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_SHITU] = checkShitu


	//三生三世-师徒(我的师傅)
	function checkShituShiFu(param, args, eventAgs?) {
		let shituInfo = ActivitySystem.getInstance().getShiTuInfo()
		if (shituInfo && shituInfo.shifuInfo && shituInfo.shifuInfo.id > 0) {	//有师傅
			if (shituInfo.shifuInfo.chuanGong == 1) {
				return true
			}
			let task = shituInfo.shifuInfo.task //当前任务次数 task[任务id] = 完成次数
			let taskIsGetInfo = getSaveRecord(opSaveRecordKey.shituTaskPrize)	//任务是否领取信息
			for (let _ in GameConfig.ShiTuTaskConfig) {
				let v = GameConfig.ShiTuTaskConfig[_]
				if (task[v.ID] == v.maxCount && (taskIsGetInfo == null || taskIsGetInfo[v.ID] == null)) {
					return true
				}
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_SHITU_SHIFU] = checkShituShiFu

	//三生三世-师徒(我的徒弟)
	function checkShituTudi(param, args, eventAgs?) {
		let shituInfo = ActivitySystem.getInstance().getShiTuInfo()
		let tudiInfo = shituInfo.tudiInfo
		for (let i = 0; i < size_t(tudiInfo); i++) {
			let curTuDiInfo = tudiInfo[i]
			if (curTuDiInfo.id > 0) {
				let curTime = GetServerTime()
				let chushiTime = curTuDiInfo.chushiTime
				if (curTuDiInfo.chuanGong == 0 && curTime < chushiTime) {
					return true
				}
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_SHITU_TUDI] = checkShituTudi

	//三生三世-师徒(师徒邀请)
	function checkShituApplyList(param, args, eventAgs?) {
		let shituApplyListInfo = ActivitySystem.getInstance().getShiTuApplyListInfo()
		if (shituApplyListInfo != null) {
			for (let i = 0; i < size_t(shituApplyListInfo); i++) {
				let info = shituApplyListInfo[i]
				if (info.type == 2) {	//有人邀请了
					return true
				}
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_SHITU_APPLY_LIST] = checkShituApplyList

	//送元宝
	function checkSongYuanBao(param, args, eventAgs?) {
		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.DAILY_LOGIN)
		for (let _ in GameConfig.DailyLoginConfig) {
			let config = GameConfig.DailyLoginConfig[_]
			let day = config.day - 1
			if (playerInfo != null && playerInfo[day] == 1) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_SONG_YUANBAO] = checkSongYuanBao

	//首充
	function checkFirstPay(param, args, eventAgs?) {
		let firstPayInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.FIRST_PAY)
		let heroInfo = GetHeroPropertyInfo()
		let firstPayInto = PaySystem.getInstance().getFirstInto()
		if (firstPayInto == false) {
			return false
		}
		if (heroInfo == null) {
			return false
		}
		let exp = heroInfo.VIP_exp
		let vip = VipSystem.getInstance().GetVipLevel()
		let curVipExp = VipSystem.getInstance().getVipSum(vip)
		let sum = curVipExp + exp
		for (let _ in GameConfig.FirstRechargeConfig) {
			let point = GameConfig.FirstRechargeConfig[_].point
			let index = tonumber(_)
			if (sum >= point) {
				if (firstPayInfo == null || firstPayInfo[index] == null) {
					return true
				}
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FIRST_PAY] = checkFirstPay

	//成长计划
	function checkTouziChengzhang(param, args, eventAgs?) {
		let chengZhangInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.LEVEL_FUNDS)
		let firstInto = PaySystem.getInstance().getChengZhangFirstInto()
		if (firstInto == false) {
			return false
		}
		if (chengZhangInfo == -1) {
			return false
		} else {	//购买了
			let heroLevel = GetHeroProperty("level")
			// for (let i = 0; i < size_t(GameConfig.LevelFundsConfig); i++) {
			// 	let v = GameConfig.LevelFundsConfig[i + 100]
			// 	let needLevel = v.level
			// 	if (heroLevel >= needLevel) {
			// 		if (chengZhangInfo == null || chengZhangInfo[i + 100] == null) {
			// 			return true
			// 		}
			// 	}
			// }
			for (let _ in GameConfig.LevelFundsConfig) {
				let v = GameConfig.LevelFundsConfig[_]
				let needLevel = v.level
				if (heroLevel >= needLevel) {
					if (chengZhangInfo == null || chengZhangInfo[_] == null) {
						return true
					}
				}
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_TOUZI_CHENGZHAG] = checkTouziChengzhang

	//友情币
	function checkFriendYouQingBi(param, args, eventAgs?) {
		// let friendList = FriendSystem.getInstance().getFriendInfoList()
		// let getRecordList = getSaveRecord(opSaveRecordKey.youQingBiList) || []
		// let getList = getRecordList.getCoin || []
		// let getNum = getRecordList.count || 0
		// if (getNum >= 10) {
		// 	return false
		// }
		// for (let _ in friendList) {
		// 	let roleId = tonumber(_)
		// 	if (getList && getList[roleId] == 1) {
		// 		return true
		// 	}
		// }

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FRIEND_YOUQINGBI] = checkFriendYouQingBi

	//好友
	function checkFriend(param, args, eventAgs?) {
		// let friendList = FriendSystem.getInstance().getFriendInfoList()
		let getRecordList = getSaveRecord(opSaveRecordKey.youQingBiList) || []
		let getList = getRecordList.getCoin || []
		let getNum = getRecordList.count || 0
		if (getNum >= 10) {
			return false
		}
		for (let _ in getList) {
			let roleId = tonumber(_)
			if (getList && getList[roleId] == 1) {
				return true
			}
		}
		return false

		// let friendList = FriendSystem.getInstance().getFriendInfoList()
		// let getRecordList = getSaveRecord(opSaveRecordKey.youQingBiList) || []
		// let getList = getRecordList.getCoin || []
		// let getNum = getRecordList.count || 0
		// if (getNum >= 10) {
		// 	return false
		// }
		// for (let _ in friendList) {
		// 	let roleId = tonumber(_)
		// 	if (getList && getList[roleId] == 1) {
		// 		return true
		// 	}
		// }

		// let friendApplyNum = FriendSystem.getInstance().getApplyStrangerCount()
		// if (friendApplyNum > 0) {
		// 	return true
		// }
		// return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FRIEND] = checkFriend


	//直升丹
	function checkPayStage(param, args, eventAgs?) {
		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.STAGE_UP)
		if (playerInfo == null) {
			return false
		}
		let getReward = playerInfo[1]
		let dailyPayCount = getSaveRecord(opSaveRecordKey.dailyRecharge) || 0
		if (dailyPayCount >= opLimitTimeActive.stageUpNeedMoney && getReward == 0) {
			return true
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_PAU_STAGE] = checkPayStage

	//天仙丹药
	function checkTianXianDanYao(param, args, eventAgs?) {
		let danConfig = GameConfig.FunTianXianDanYaoConfig["TianXianDanYao"]
		for (let k in danConfig) {
			let danInfo = danConfig[k]
			let danyaoHad = ItemSystem.getInstance().getItemCount(danInfo.itemid)
			if (danyaoHad >= danInfo.itemnum) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_TIANXIAN_DANYAO] = checkTianXianDanYao

	//天仙经脉
	function checkTianXianJingMai(param, args, eventAgs?) {
		let jingmaiConfig = GameConfig.FunTianXianJingMaiConfig["TianXianJingMai"]
		let typeConfig = GameConfig.FunTianXianJingMaiTypeConfig["TianXianJingMai"]
		let recvInfo = TianXianSystem.getInstance().getTianXianInfo(cellOptionsIndex.TianXianJingMai)
		if (recvInfo == null) return false
		let recvlist = recvInfo["jingmaidatalist"]
		if (recvlist == null) return false
		let jie = recvlist[1] || 0
		let select = recvlist[0] + 1 || 1
		let elemOption = elemUpgradeStageOptions[cellOptionsIndex.TianXianJingMai]
		let count = elemOption.MaxLevel
		if (select > elemOption.maxSelect) {
			select = 1
			jie += 1
		}
		if (jie >= count) return false
		let cost = typeConfig[jie].itemnum
		let hadId = jingmaiConfig[select].itemid
		let had = ItemSystem.getInstance().getItemCount(hadId)
		if (had >= cost) {
			return true
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_TIANXIAN_JINGMAI] = checkTianXianJingMai


	//商店解锁
	function checkShopUnlock(param, args, eventAgs?) {
		let shopEntry = param["shopEntry"]
		if (shopEntry == null) return false
		return GuideFuncSystem.getInstance().checkShopUnlock(shopEntry)
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_SHOP_UNLOCK_TIPS] = checkShopUnlock

	//装备商店
	function checkShopEquip(param, args, eventAgs) {
		let list = param["entryList"]
		if (list == null) return false
		for (let k in list) {
			let entry = list[k]
			let check = GuideFuncSystem.getInstance().checkShopEquip(entry)
			if (check) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_SHOP_EQUIP_TIPS] = checkShopEquip
	//金装分解
	function checkGoldEquipSmelt(param, args, eventAgs?) {
		let showList = ItemSystem.getInstance().getGoldEquipSmeltList(opEquipQuality.gold)
		if (size_t(showList) == 0) return false
		return true
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_SHOP_GOLD_SMELT] = checkGoldEquipSmelt

	//VIP奖励
	function checkVIPPrize(param, args, eventAgs?) {
		for (let i in GameConfig.VipEXP) {
			let vip = tonumber(i)
			if (vip > 0) {
				let record = VipSystem.getInstance().getVipPrizeRecordWithLv(vip)
				if (record != 1 && GetHeroProperty("VIP_level") >= vip) {
					return true
				}
			}
		}
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_VIP_PRIZE] = checkVIPPrize

	//狂欢进阶
	function checkCarnivalFunUpgrade(param, args, eventAgs?) {
		let activityIndex = param["activityIndex"]
		if (activityIndex == null) return false
		let netInfo = ActivitySystem.getInstance().getOperatePlayerInfo(activityIndex)
		if (netInfo == null) return false
		let playerInfo = netInfo
		let tempConfig = GameConfig.StageLevelUpAConfig
		if (activityIndex == PayActivityIndex.MIX_ACCU_RECHARGE) {
			tempConfig = GameConfig.AccuBuyRechargeConfig
			playerInfo = netInfo[1] || {}
		} else if (activityIndex == PayActivityIndex.EVERY_STAGE_B) {
			tempConfig = GameConfig.StageLevelUpBConfig
		}
		//if(playerInfo == null) return false
		let realConfig = GetActivity(ActivityDefine.Carnival).getCarnivalUpgrade(activityIndex, tempConfig)
		if (realConfig == null || size_t(realConfig) == null) return false
		//是否解锁
		for (let k in realConfig) {
			let v = realConfig[k]
			let checkIndex = v.point || v.index
			if (playerInfo[checkIndex] && playerInfo[checkIndex] == 1) continue
			let check = GuideFuncSystem.getInstance().checkCarnivalFunUpgrade(v)
			if (check) {
				return check
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_CARNIVAL_UPGRADE] = checkCarnivalFunUpgrade

	//熊猫副本（开服副本）
	function checkNorInstZones(param, args, eventAgs?) {
		// if (eventAgs && eventAgs.actIndex != PayActivityIndex.NEW_SERVER_INST_ZONES) {
		//     return
		// }
		if (ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.NORMAL_INST_ZONES) == false) {
			return false
		}

		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NORMAL_INST_ZONES) || null
		//[[关卡索引]=是否通关]   1已通关，没有这个index，表示没有通关
		if (playerInfo == null) {
			return false
		}

		let maxIndex = -1                       //通关的最大索引
		for (let k in playerInfo) {
			if (playerInfo[k] == 1) {               //已通关
				if (maxIndex < tonumber(k)) {
					maxIndex = tonumber(k)
				}
			}
		}
		let info = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NORMAL_INST_ZONES)
		if (info != null && size_t(info) != 0) {
			let typeIndex = info[0]
			if (GameConfig.NormalInstZonesConfig[typeIndex]) {
				if (GameConfig.NormalInstZonesConfig[typeIndex][maxIndex + 1] != null) {
					return true
				}
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_NOR_INST_ZONES] = checkNorInstZones

	//新服进阶活动
	function checkNewStageLevelUp(param, args, eventAgs?) {
		// if (eventAgs && eventAgs.actIndex != PayActivityIndex.NEW_SERVER_STAGE_LEVEL_UP) {
		//     return
		// }
		if (ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.NEW_SERVER_STAGE_LEVEL_UP) == false) {
			return false
		}

		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_STAGE_LEVEL_UP) || []
		// [[奖励档次]=是否领取]   0没有领取，1领取了，没有这个index，表示没有领取，可否领取要客户端判断

		let info = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NEW_SERVER_STAGE_LEVEL_UP) || []             //[serverDay, utils.getTomorrow()]
		let dayIndex = info[0] || -1
		let overTime = info[1] || GetServerTime()
		let l = GameConfig.NewServerStageUpConfig[dayIndex] || []
		for (let k in l) {
			let config = l[k]

			let funIndex = cellOptionsIndex[config.stageUp]
			let funInfo = FunSystem.getInstance().getFunInfoWithType(funIndex)
			let stage = 0
			if (funInfo != null) {
				stage = funInfo.stage
			}

			if (playerInfo[config.index] != 1) {				//未领取（不分可领取或者不可领）
				if (stage >= config.cond) {						//客户端判断
					return true
				}
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_NEW_STAGE_LEVEL_UP] = checkNewStageLevelUp

	//开服全民进阶活动
	function checkNewAllStageUp(param, args, eventAgs?) {
		// if (eventAgs && eventAgs.actIndex != PayActivityIndex.NEW_SERVER_ALL_STAGE_UP) {
		//     return
		// }
		if (ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.NEW_SERVER_ALL_STAGE_UP) == false) {
			return false
		}

		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_ALL_STAGE_UP) || []
		// [[奖励档次]=是否领取]   0没有领取，1领取了，没有这个index，表示没有领取，可否领取要客户端判断

		let info = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NEW_SERVER_ALL_STAGE_UP) || []
		//{self.reachList, serverDay, utils.getTomorrow()}  reachList  --{[index]=count}   达成人数，空为0
		let dayIndex = info[1] || -1
		let reachList = info[0] || []
		let l = GameConfig.NewServerAllStageUpConfig[dayIndex] || []
		for (let k in l) {
			let config = l[k]

			let reachNum = checkNull(reachList[config.prizeIndex], 0)

			if (playerInfo[config.prizeIndex] != 1) {				//未领取（不分可领取或者不可领）
				if (reachNum >= config.cond[0]) {						//客户端判断
					return true
				}
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_NEW_ALL_STAGE_UP] = checkNewAllStageUp

	//开服全名团购
	function checkNewAllBuy(param, args, eventAgs?) {
		// if (eventAgs && eventAgs.actIndex != PayActivityIndex.NEW_SERVER_ALL_BUY) {
		//     return
		// }
		if (ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.NEW_SERVER_ALL_BUY) == false) {
			return false
		}

		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_ALL_BUY) || []
		//[哪天的记录， {[奖励档次]=是否领取}]   0没有领取，1领取了，没有这个index，表示没有达成

		let info = playerInfo[1] || []
		for (let _ in GameConfig.NewServerAllBuyConfig) {
			let l = GameConfig.NewServerAllBuyConfig[_]
			for (let k in l) {
				let config = l[k]

				if (info[config.prizeIndex] == 0) {				//可领取，未领取
					return true
				}
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_NEW_ALL_BUY] = checkNewAllBuy

	//开服折扣商店
	function checkNewShopDiscount(param, args, eventAgs?) {
		// if (eventAgs && eventAgs.actIndex != PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT) {
		//     return
		// }
		if (ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT) == false) {
			return false
		}

		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT) || []
		//[[index] = count, ...]        index为对应商品档次，count为已购买次数，空为0

		let info = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT) || []
		//{serverDay, utils.getTomorrow()}
		let dayIndex = info[0] || -1
		let l = GameConfig.NewServerShopDiscountConfig[dayIndex] || []
		for (let k in l) {
			let config = l[k]

			//限购
			let funType = cellOptionsIndex[config.stageUp]
			let nowStage = 0
			let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
			if (funInfo != null) {
				nowStage = funInfo.stage
			}
			if (nowStage >= config.cond) {                                 //等阶条件
				let count = playerInfo[config.index] || 0

				if (count < config.limitCount) {
					return true
				}
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_NEW_SHOP_DISCOUNT] = checkNewShopDiscount

	//开服累充
	function checkNewLeiChong(param, args, eventAgs?) {
		// if (eventAgs && eventAgs.actIndex != PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE) {
		//     return
		// }
		if (ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE) == false) {
			return false
		}

		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE) || []
		//[哪天的记录， {[奖励档次]=是否领取}]   0没有领取，1领取了，没有这个index，表示没有达成

		let actInfo = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE) || []
		//{serverDay, utils.getTomorrow()}
		let dayIndex = actInfo[0] || -1
		let info = {}
		if (playerInfo) {
			if (dayIndex == playerInfo[0]) {
				info = playerInfo[1]
			}
		}

		let l = GameConfig.NewServerAccRechargeConfig[dayIndex] || []
		for (let k in l) {
			let config = l[k]

			if (info[config.point] == 0) {                  //可领取，未领取
				return true
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_NEW_MIXACCU_RECHARGE] = checkNewLeiChong

	//全民升级
	function checkNewAllLevelUp(param, args, eventAgs?) {
		// if (eventAgs && eventAgs.actIndex != PayActivityIndex.NEW_SERVER_ALL_LEVEL_UP) {
		//     return
		// }
		if (ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.NEW_SERVER_ALL_LEVEL_UP) == false) {
			return false
		}

		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_ALL_LEVEL_UP) || []
		// [[奖励档次]=是否领取]   1领取了，没有这个index，表示没有领取，可否领取要客户端判断

		let level = GetHeroProperty("level")
		let l = GameConfig.NewServerAllLevelUpConfig
		for (let k in l) {
			let config = l[k]

			if (playerInfo[config.level] != 1) {                    //config.cond = [人数, 等阶]
				if (level >= config.level) {
					return true
				}
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_NEW_ALL_LEVEL_UP] = checkNewAllLevelUp

	//熊猫副本（开服副本）
	function checkNewInstZones(param, args, eventAgs?) {
		// if (eventAgs && eventAgs.actIndex != PayActivityIndex.NEW_SERVER_INST_ZONES) {
		//     return
		// }
		if (ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.NEW_SERVER_INST_ZONES) == false) {
			return false
		}

		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_INST_ZONES) || null
		//[[关卡索引]=是否通关]   1已通关，没有这个index，表示没有通关
		if (playerInfo == null) {
			return false
		}

		let maxIndex = -1                       //通关的最大索引
		for (let k in playerInfo) {
			if (playerInfo[k] == 1) {               //已通关
				if (maxIndex < tonumber(k)) {
					maxIndex = tonumber(k)
				}
			}
		}
		if (GameConfig.NewServerInstZonesConfig[maxIndex + 1] != null) {
			return true
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_NEW_INST_ZONES] = checkNewInstZones

	//龙宫章节
	function checkNewMission(param, args, eventAgs?) {
		// if (eventAgs && eventAgs.actIndex != PayActivityIndex.NEW_SERVER_MISSION) {
		//     return
		// }
		if (ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.NEW_SERVER_MISSION) == false) {
			return false
		}

		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.NEW_SERVER_MISSION) || []
		// [prizeRecord, shedule]  --[{[index]=1}, 进度]

		let actInfo = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.NEW_SERVER_MISSION) || []
		//{serverDay, utils.getTomorrow()}
		let dayIndex = actInfo[0] || -1
		let info = playerInfo[0] || []

		let l = GameConfig.NewServerMissionConfig[dayIndex] || []
		for (let k in l) {
			let config = l[k]

			if (info[config.index] == 0) {                  //可领取，未领取
				return true
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_NEW_MISSION] = checkNewMission

	function checkHuSong(param, args) {
		return GuideFuncSystem.getInstance().checkHuSong()
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_HUSONG_TIPS] = checkHuSong

	function checkBeiBaoItemUse(param, args) {
		let itemList = ItemSystem.getInstance().getCanUseItemList()
		if (itemList == null || size_t(itemList) == 0) return false
		for (let k in itemList) {
			let item = ItemSystem.getInstance().getItemLogicInfoByID(itemList[k])
			let count = ItemSystem.getInstance().getItemCount(item.entryId)
			let need = item.getRefProperty("isbag")
			if (count >= need) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_BEIBAO_TIPS] = checkBeiBaoItemUse

	//跨服组队
	function checkGlobalTeam(param, args, eventAgs?) {
		let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.ServerTeam)
		// {
		//         remainCount: 剩余收益次数,
		//         npcIndexList: {[npcIndex]:1
		// }
		let remainCount = 0
		if (actInfo && actInfo.npcIndexList) {
			remainCount = actInfo.remainCount
		}

		let flag = false
		for (let _ in GameConfig.GlobalTeamConfig) {
			let v = GameConfig.GlobalTeamConfig[_]
			if (v.level <= GetHeroProperty("level")) {                              //未开启
				if (remainCount > 0) {
					flag = true
					break
				}
			}

		}
		return flag
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_CROSS_TEAM] = checkGlobalTeam

	//通关奖励
	// function checkPassGampaign(param, args) {
	// 	let record = getSaveRecord(opSaveRecordKey.campaignGifts) || {}
	// 	if (size_t(record) == 0) {
	// 		return false
	// 	} else {
	// 		for (let campaignId in record) {
	// 			if (record[campaignId] == 1) {
	// 				return true
	// 			}
	// 		}
	// 	}
	// 	return false
	// }
	// guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_PASS_CAMPAIGN] = checkPassGampaign


	//神装
	function checkGodEquip(param, args) {
		//神装升级的
		let heroLevel = GetHeroProperty("level") || 0
		if (heroLevel < 140) {
			return false
		}

		let arr = RoleSystem.getInstance().getRoleEquipItemList()
		let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype
		for (let i = 0; i < size_t(subtypeList); i++) {
			let subtype = subtypeList[i]
			let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
			//有神装
			if (roleItem && roleItem.propertyInfo.quality >= 6) {
				let suit = roleItem.refPropertyInfo.suit
				//神装没满级
				if (GameConfig.RoleEquipSuit && GameConfig.RoleEquipSuit[suit] && suit < 113) {
					// let consumeConfig = GameConfig.RoleEquipUpConfig
					// let configInfo = consumeConfig[suit]
					// let curConsume = null
					// for (let _ in configInfo) {
					// 	let type = tonumber(_)
					// 	if (type == subtype) {
					// 		curConsume = configInfo[type]
					// 		break
					// 	}
					// }
					// if (curConsume) {
					// 	let need = curConsume.fragment
					// 	let itemId = curConsume.entryId
					// 	let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)
					// 	let needMoney = curConsume.funds
					// 	let ownMoney = GetHeroProperty("funds")
					// 	if (ownItemCount >= need && ownMoney >= needMoney) {
					// 		return true
					// 	}
					// }
					//下阶装备
					let nextRoleItem = RoleSystem.getInstance().getRoleEquipNextItem(roleItem)
					if (nextRoleItem.refPropertyInfo == null) continue //没有下一阶
					let toLevel = roleItem.getRefProperty("level") + 20
					if (heroLevel < toLevel) continue //角色等级小于下一阶等级
					let consumeConfig = GameConfig.RoleEquipUpConfig
					let configInfo = consumeConfig[suit]
					let curConsume = null
					for (let _ in configInfo) {
						if (_ == subtype) {
							curConsume = configInfo[_]
							break
						}
					}
					if (curConsume) {
						let need = curConsume.fragment
						let itemId = curConsume.entryId
						let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)
						let needMoney = curConsume.funds
						let ownMoney = GetHeroProperty("funds")
						if (ownItemCount >= need && ownMoney >= needMoney) {
							return true
						}
					}
				}
			}
		}
		//神装分解
		let list = ItemSystem.getInstance().getItemLogicInfoByType(opItemType.ROLE_EQUIP)
		let showList = []
		for (let k in list) {
			let item: Item = list[k]
			if (item.getProperty("quality") == opEquipQuality.red) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_GOD_EQUIP] = checkGodEquip

	//神装升级
	function checkGodEquipLevel(param, args) {
		let heroLevel = GetHeroProperty("level") || 0
		if (heroLevel < playerOptions.shenzhuang) return false
		let arr = RoleSystem.getInstance().getRoleEquipItemList()
		let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype
		for (let i = 0; i < size_t(subtypeList); i++) {
			let subtype = subtypeList[i]
			let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
			//有神装
			if (roleItem && roleItem.propertyInfo.quality >= 6) {
				let suit = roleItem.refPropertyInfo.suit
				//神装没满级
				if (GameConfig.RoleEquipSuit && GameConfig.RoleEquipSuit[suit] && suit < 113) {
					//下阶装备
					let nextRoleItem = RoleSystem.getInstance().getRoleEquipNextItem(roleItem)
					if (nextRoleItem.refPropertyInfo == null) continue //没有下一阶
					let toLevel = roleItem.getRefProperty("level") + 20
					if (heroLevel < toLevel) continue //角色等级小于下一阶等级
					let consumeConfig = GameConfig.RoleEquipUpConfig
					let configInfo = consumeConfig[suit]
					let curConsume = null
					for (let _ in configInfo) {
						if (_ == subtype) {
							curConsume = configInfo[_]
							break
						}
					}
					if (curConsume) {
						let need = curConsume.fragment
						let itemId = curConsume.entryId
						let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)
						let needMoney = curConsume.funds
						let ownMoney = GetHeroProperty("funds")
						if (ownItemCount >= need && ownMoney >= needMoney) {
							return true
						}
					}
				}
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_GOD_EQUIP_LEVEL] = checkGodEquipLevel

	//神装分解
	function checkGodEquipFenJie(param, args) {
		let level = GetHeroProperty("level") || 0
		if (level < playerOptions.shenzhuang) return false
		let list = ItemSystem.getInstance().getItemLogicInfoByType(opItemType.ROLE_EQUIP)
		let showList = []
		for (let k in list) {
			let item: Item = list[k]
			if (item.getProperty("quality") == opEquipQuality.red) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_GOD_EQUIP_FENJIE] = checkGodEquipFenJie


	//十元购
	function checkTenGift(param, args) {
		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.TEN_YUAN_GIFT)
		if (playerInfo != null) {	//如果不为空 且没领取 就把显示数据天数-1
			for (let _ in playerInfo) {
				let state = playerInfo[_]
				if (state == 0) {
					return true
				}
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_TEN_GIFT] = checkTenGift

	//累计充值
	function checkLeijiPay(param, args) {
		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.ACCUM_PAY_PRIZE)
		if (playerInfo == null) {
			return false
		}
		let getList = playerInfo.getPrize
		for (let _ in getList) {
			let state = getList[_]
			if (state == 1) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_LEIJI_PAY] = checkLeijiPay



	//神宠来袭
	function checkGodPetLaixi(param, args) {
		let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.GOD_PET_INCOME)
		if (playerInfo == null) {
			return false
		}
		let config = GameConfig.GodPetInComeConfig
		let chuliList = []
		let getPrize = playerInfo.getPrize
		for (let _ in getPrize) {
			table_insert(chuliList, getPrize[_])
		}
		for (let _ in config) {
			let info = config[_]
			let index = info.Index - 100
			if (chuliList && chuliList[index] == 1) {
				return true
			}
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_GOD_PET_LAIXI] = checkGodPetLaixi

	//幸运好礼
	function checkLuckyPrize() {
		let list = GetActivity(ActivityDefine.LuckyPrize).getLuckyPrizeList(PayActivityIndex.Fallen_Good_Gift_Recharge)
		if (list == null) return false
		let singleMax = getSaveRecord(opSaveRecordKey.FallenGoodGiftRecharge) || {}
		for (let k in list) {
			let v = list[k]
			if (singleMax[v.point] == 0) {
				return true
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_LUCKY_PRIZE_TIPS] = checkLuckyPrize

	//精彩活动
	function checkWonder() {
		//累计充值
		if (GuideFuncSystem.getInstance().checkWonderAccumulate()) {
			return true
		}
		//节日消费
		if (GuideFuncSystem.getInstance().checkWonderHoliday()) {
			return true
		}
		//宠物洗练
		if (GuideFuncSystem.getInstance().checkWonderPetClear()) {
			return true
		}

		//六界寻宝
		if (GuideFuncSystem.getInstance().checkWonderLiuJie()) {
			return true
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_WONDER_ACTIVITY] = checkWonder


	//投资计划
	function checkTouziJihua() {
		let planInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.INVEST_PLAN)
		if (planInfo == null) {
			return false
		}
		if (planInfo == -1) {
			return false
		}
		let day = size_t(planInfo) + 1
		let openTime = ActivitySystem.getInstance().getOpenTime()
		let time = GetTodayTime(openTime)	//1522252800 开服当天0点 
		let serverTime = GetServerTime()	//
		let canGetDay = Math.floor((serverTime - time) / 86400) + 1
		if (canGetDay >= day) {
			return true
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_TOUZI_JIHUA] = checkTouziJihua


	//通用进阶奖励
	function checkFunPrize(param, args) {
		let funType = param["type"]

		return GuideFuncSystem.getInstance().checkFunPrize(funType)
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_FUN_PRIZE] = checkFunPrize


	//天下第一
	function checkPeerless(param, args) {
		return GuideFuncSystem.getInstance().checkPeerless()
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_PEERLESS_TIPS] = checkPeerless

	//个人首通
	function checkCampaignSingle() {
		let recordList = CampaignSystem.getInstance().getLimitPassData() || {}
		let configList = CampaignSystem.getInstance().getSinglePassConfig()

		//通关奖励领取检测//(全部领取不再显示)
		let firstList = CampaignSystem.getInstance().getFirstPassData() || {}

		for (let i in configList) {
			let config = configList[i]
			let record = recordList[config.campaignId] || []
			let getState = record[0] || 0
			let endTime = record[1] || 0
			if (getState == 1 || getState == 2) {
				return true
			}

			let linQuState = firstList[config.campaignId] || 0
			if (linQuState == 1 || linQuState == 2) { //可领取
				return true
			}
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_CAMPAIGN_SINGLE] = checkCampaignSingle

	//帮会仓库
	function checkClubStoreLook() {
		if (!ClubSystem.getInstance().isHaveClubJurisdiction()) {
			return false
		}

		//没有
		let infoList = ClubSystem.getInstance().getClubStoreItemList() || []
		if (size_t(infoList) == 0) {
			return false
		}

		if (GuideFuncSystem.getInstance().getReadState(GuideFuncSpace.GuideFuncReadTypeDefine.CLUB_STORE, 1) < 0) {
			return true
		}

		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_CLUB_STORE] = checkClubStoreLook

	//宠物飞升
	function checkPetFly() {
		for (let _ in GameConfig.PetConfig) {
			let petConfig = GameConfig.PetConfig[_]
			GuideFuncSystem.getInstance().checkPetFly(_)
		}
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_PET_FLY] = checkPetFly

	//天宫可占领
	function checkTiangongCanOccupy() {
		let occupyCount = StrongholdConfig.occupyCount - (getSaveRecord(opSaveRecordKey.strongholdCount) || 0)
		if (occupyCount <= 0) {
			return false
		}

		let flags = GetActivity(ActivityDefine.Stronghold).getBossAndOccupyStatus()
		if (flags[1]) {
			return false
		}
		return true
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_TIANGONG_CAN_OCCUPY] = checkTiangongCanOccupy


	//神魂镌刻
	function checkShenHunJuanKe() {
		for (let k = 1; k <= 4; k++) {
			let check = GuideFuncSystem.getInstance().checkShenHunWear(k)
			if(check){
				return check
			}
		}
		
		return false
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_SHENHUN_JUANKE] = checkShenHunJuanKe

	//猎魂魂币
	function checkLieHunHunBi() {
		let unit = opItemUnit.HUN_POINT
		let cost = optionShenHun.costHunBi
		return GetHeroMoney(unit) >= cost
	}
	guideFuncCheckHandler[GuideFuncCheckDefine.EVENT_SHENHUN_HUNBI] = checkLieHunHunBi

	//////////////////////////////////////回收////////////////////////////////////////////-
	export let recycleFuncHandler: any = {}
	//服务器简单（红点）通知提示
	function recycleServerNotice(config, param) {
		let notice = GuideFuncSystem.getInstance().getServerNotice()

		table_remove(notice, param["index"] || 0)
		delete this.manualCloseResultMap[config.id]
	}
	recycleFuncHandler[GuideFuncCheckDefine.EVENT_SERVER_NOTICE] = recycleServerNotice

}