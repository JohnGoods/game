
//频道
let channelType:any = {
	NEARBY   : 1,  //当前
	TEAM     : 2,  //队伍
	FACTION  : 3,  //帮派
	SYSTEM   : 4,  //系统
	WORLD    : 5,  //世界
	SCHOOL   : 6,  //门派
	CHAT     : 7,  //私聊
	RUMOR    : 8,  //传闻
	HORN     : 9,  //大喇叭
	ALL      : 10, //所有
	BANNER	 : 11, //横幅
	UNION    : 12, //联盟
	SERVER	 : 13, //跨服聊天
	//MAKETEAM : 6,  // 组队
	//GROUP    : 7,  // 团队
	//CITY     : 8,  // 同城
	//HORN_VIP : 10, // VIP大喇叭
	//SWORN    : 11, // 结拜
	//AUCTION  : 12, // 拍卖
	GROUP    : 14  //群聊
}

//组Id 100-200段
let opChannelDefaultGroup:any = {
	//门派
	SCHOOL_JJ : 101, 
	SCHOOL_QY : 102,
	SCHOOL_DD : 103,
	SCHOOL_WY : 104,
	SCHOOL_TG : 105,
	SCHOOL_LS : 106,
	SCHOOL_TS : 107,
	SCHOOL_BY : 108,
	SCHOOL_MW : 109,
	SCHOOL_MY : 110,
	SCHOOL_HF : 111,
	SCHOOL_DF : 112,
	ACTIVITY_WORLDBOSS : 113,
	ACTIVITY_ROBBER    : 114,
	ACTIVITY_LOSTTEMPLE : 115,
	ACTIVITY_ZHENXING : 116,
	ACTIVITY_MONSTERSIEGE : 117,
	ACTIVTIY_SECRETLAND : 118,
	ACTIVTIY_UNIONPVP : 119,
}

let channelOption:any = {
	FACTION_MAP_CREATE        	: 1,   //军团开启副本
	FACTION_PVE_BOSS_OPEN     	: 2,   //帮会boss开启
	WILD_BOSS_REFRESH         	: 3,   //野外boss刷新
	WILD_BOSS_KILL            	: 4,   //野外boss被杀死
	FRIEND_SHOP               	: 5,   //友情币商城
	TEMP_CELL_STAGE_UP        	: 6,   //升阶提示
	LOTTERY_LUCKY             	: 7,   //中奖
	MARRY_SUCCESS             	: 8,   //结婚成功
	WILD_BOSS_RUN             	: 9,   //野外BOSS逃跑
	SHITU	 				 	: 10,  //师徒
	CAMPAIGN_HELP_SUCCESS		: 11,  //关卡协助成功
	ESCORT_ORANGE				: 12,  //护送
	ESCORT_REVENGE            	: 13,  //复仇成功
	CREATE_TEAM     			: 14,  //创建队伍
	SERVER_INST_ZONES			: 15,  //开服副本
	COLOREGG					: 16,  //彩蛋
	GLOBALMINE_JOIN				: 17,  //跨服争霸队伍招募
	GLOBALMINE_ENTER_MINE		: 18,  //跨服争霸占矿
	NORMAL_INST_ZONES			: 19,  //狂欢副本
	MENG_ZHU					: 20,  //成为武林盟主
	NEW_MENG_ZHU				: 21,  //击败盟主，成为新的盟主
	CAMPAIGN_PASS				: 22,  //关卡首通
	STRONGHOLD_BE_ROB			: 23,  //据点被掠夺
	SHENHUN_SHOW                : 24,  //神魂
	GOD_PET_LOTTERY				: 25,  //神宠秘录
	//客户端自己定义的
	C_ITEM   				  	: 100,	//物品
	C_CLUB_APPLY   				: 101,	//帮会招人
	C_QIUZHU   					: 102,	//关卡求助
	C_PET_SHOW  				: 103,	//展示宠物
	C_FABAO_SHOW 				: 104,  //展示法宝
	C_ROLE_SHOW 				: 105,  //展示玩家
	C_BASE_PET_SHOW 			: 106,  //基础宠物展示
	C_COLOREGG_XUNBAO 			: 107,  //彩蛋-寻宝
	C_COLOREGG_BUZHUA 			: 108,  //彩蛋-捕捉
	C_COLOREGG_XIEZHU 			: 109,  //彩蛋-协助
	C_SHENHUN_SHOW              : 110,  //神魂
	C_GODPET_MILU               : 111,  //神宠密录
}
let channelTipsType:any = {
	SYSTEM 					: 1,//  系统频道
	TIPS				 		: 2,//  标签提示
	WINDOWS 				: 3,//  确定对话框（提示性对话框）
	HORN 						: 4,//  大喇叭
	SCREEN_TIPS 		: 5,//  屏幕提示
	UNKNOW1					: 6,//  频道不存在
	WORLD			 			: 7,//  世界频道
	SYSTEM_AND_TIPS : 8,//  标签提示+系统频道
	GUILD_AND_TIPS 	: 9,//  帮派（宗族）频道+标签提示
	GUILD 					: 10,// 帮派（宗族）频道
	UNKNOW2 				: 11,// 暂时致控
	GUILD_AND_TIPS2 : 12,// 帮派（宗族）频道+标签提示
	TEAM	 					: 13,// 队伍频道+标签提示
	UNKNOW3 				: 14,// 频道不存在
	RUMOUR 					: 15,// 传闻频道
	RUMOUR_AND_TIPS : 16,// 传闻频道+标签提示
	TEAM2						: 17,// 队伍频道
	TEAM_AND_TIPS	 	: 18,// 队伍频道+标签提示
	SCHOOL 					: 19,// 门派频道
	SCHOOL_AND_TIPS : 20,// 门派频道+标签提示
	NO_TAG					: 21,// 无顶头标签的频道
	NO_TAG_AND_TIPS	: 22,// 无顶头标签的频道+标签提示
	TIPS_AND_TIPS		: 8,// 提示频道+标签提示 TODO
}
