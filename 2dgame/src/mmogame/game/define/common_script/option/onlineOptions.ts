
var opLotteryTime:any = {
	//[1] : 10,
	//[2] : 10,
	//[3] : 10,
	//[4] : 10,
	//[5] : 10,
	//[6] : 20,
	//[7] : 0,
	
	[1] : 180,
	[2] : 480,
	[3] : 900,
	[4] : 1500,
	[5] : 2400,
	[6] : 3600,
	[7] : 0,
}

var opLottery:any = {
	round : 6,      //6轮
	itemCount : 20, //20个物品
	last : 35,      //默认时间
}

var opSignIn:any = {
	//time : 60,
	time : 86400,
}

//状态变化更新，用于提醒玩家可以进行某项操作
var opNewEventNotice:any = {
	active								: 19,		//活动
	level_reward 					: 20,		//等级奖励
	sign_in								: 21,		//签到
	recharge_back					: 22,		//充值回馈
	exchange_code				  : 23,		//兑换码
	war_horn							: 24,		//战争号角
	queen_attendance			: 25,		//女王祷告
	ambassador						: 26,		//邀请大使
	lottery								: 27,		//命运占卜
	plat_score						: 28,		//平台评分
	score_reward					: 29,		//评分大奖
	interact_recover			: 30,		//互动回复
	faction_apply					: 33,		//军团申请
	pet_handbook					: 37,		//部下鉴赏
	pet_appreciate				: 38,		//破甲鉴赏
	pet_interact					: 43,		//互动部下按钮提醒
	champion_count				: 54,		//竞技场剩余次数
	world_boss						: 1002,		//终极魔龙
	world_question				: 1003,		//贵族考试
	wu_dou								: 1004,		//斗技大会
}

//提醒界面等级索引
var opWindowIndex:any = {
	main_window				: 		1,		//一级界面
	second_window			:			2,		//二级界面
	third_window			:			3,		//三级界面
	fourth_window			:			4,		//四级界面
	fifth_window			:			5,		//五级界面
	sixth_window			:			6,		//六级界面
}
