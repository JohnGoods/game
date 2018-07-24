/*
作者:
    yangguiming
	
创建时间：
   2013.6.28(周五)

意图：
   任务系统定义。因为只是内部使用，没有放在define目录下

公共接口：
   
*/

ImportType(taskField)

//响应链接类型
//////////////////////////////////////////////////////////////////////
let TaskLinkType = {
	NONE 							: 0,				//无操作
	NPC_TALK 					: 1, 				//与NPC对话								"1;{npcEntryId,taskId}"				（格式要求）这里的taskId是用于寻路提示用，如果不必要提示与任务相关的信息可以填上0，0或具体ID必须要填一个，下同
	GOTO_POSITION	 		: 2, 				//寻路到指定点						"2;{mapId,x,y,taskId}"
	FIND_NPC					: 3, 				//寻找npc									"3;{npcEntryId,taskId}"
	JUMP_RUN_TALK			: 4,				//跳转地图后再寻npc 			"4;{npcEntryId,x,y,taskId}"
	XUNLUO						: 5,				//巡逻（自动遇敌）				"5;{mapId,x,y}"   默认巡逻：{0, 0, 0}   指定某地图某点开始巡逻：{mapId, x, y}
	ITEM_TIPS					: 6,				//打开物品tips						"6;itemEntryId"
	PET_TIPS					: 7,				//打开宠物tips						"7;petEntryId"
	EXECUTE_OPERATE		: 8,				//执行操作（任务相关）		"8;taskId"
	ADD_TIPS          : 9,        //弹出提示不支持寻路      "9;taskId"
	SHOW_TIPS					: 10,				//弹出弹幕提示						"10;{channel,content}"
}

//NPC任务状态
//////////////////////////////////////////////////////////////////////
let TaskStatus = //按优先级排序，数值越大，约优先表现
{
	NONE 			: -1,	//木有
	UNFINISH	: 1, 	//未完成
	NPC_FIND	: 2,	//寻找NPC所需	
	ACCPET		: 3,	//可接
	FINISH		: 4,	//完成
}

//任务追踪图标
//////////////////////////////////////////////////////////////////////
let TaskTraceIcon:any = {
	CAMPAIGN : "zhengZaiTiaoZhan",
	FINDNPC	 : "shengLi",
}
//任务的一级分类
//////////////////////////////////////////////////////////////////////
let TaskMainType:any = {
	Main 				: 1,	//主线
	Common			: 2,	//常规
	Branch 			: 3,	//支线
	Drama				: 4,	//剧情
	
	Finish			: 10, //已完成
}

//次级任务分类的名称
let TaskSecTypeName:any = {
	[TaskMainType.Branch] : {
																["name"] : "TASK_BRANCH_NAME",
																
													},
	[TaskMainType.Common] : {
													 			["name"] : "TASK_COMMON_NAME", 
													 			[1] : "TASK_COMMON_SHIMEN", 
													 			[2] : "TASK_COMMON_ZHUOGUI", 
													 			[3] : "TASK_COMMON_YABIAO", 
													 			[4] : "TASK_COMMON_BAOTU", 
													 			[5] : "TASK_COMMON_FEIXINGQI", 
													 			[6] : "TASK_COMMON_XIULIAN", 
													 			[7] : "TASK_COMMON_JIANZHU", 
													 			[8] : "TASK_COMMON_XUANWU",
													 },
	[TaskMainType.Drama] 	: {["name"] : "TASK_DRAMA_NAME",},
}

let TaskNameTranfer:any = {
	//[taskType.TianShi] 				: "TASK_COMMON_ZHUOGUI",
	//[taskType.HuSong] 				: "TASK_COMMON_YABIAO",
	//[taskType.School] 				: "TASK_COMMON_SHIMEN",
	//[taskType.Cangbaotu] 			: "TASK_COMMON_BAOTU",
	//[taskType.FeiXingQi] 			: "TASK_COMMON_FEIXINGQI",
	//[taskType.XiuWeiPuTong] 	: "TASK_COMMON_XIULIAN",
	//[taskType.FactionJianZhu] : "TASK_COMMON_JIANZHU",
	//[taskType.FactionXuanWu] 	: "TASK_COMMON_XUANWU",
}

let TaskTypeTransfer = //规定排序规则
{
	[TaskMainType.Main] 	: [taskType.Main],
	[TaskMainType.Branch] : [taskType.Branch],
	[TaskMainType.Common] : [
														taskType.School, 
														taskType.TianShi, 
														taskType.HuSong, 
														taskType.Cangbaotu, 
														taskType.FeiXingQi, 
														taskType.XiuWeiPuTong, 
														taskType.FactionJianZhu, 
														taskType.FactionXuanWu,
													],
	[TaskMainType.Drama] 	:	[taskType.Special],
	[TaskMainType.Finish] : {},
}


//功能对话的根节点
//////////////////////////////////////////////////////////////////////
let DIALOG_FUNCTION_NODEID 				 = -1					//功能节点
let DIALOG_NOJUMP_NODEID					 = -2					//不跳转节点
let DIALOG_OBJECT_SELF			 			 = 1					//当前对话对象为自己
let DIALOG_OBJECT_COMMIT_NPC			 = 2					//当前对话对象为提交任务的npc
let DIALOG_OBJECT_PLAYER_NPC			 = 3					//动态npc，以服务器的image为准
let DIALOG_OPTION_MAX_COUNT				 = 7					//对话选项数量最大值

//任务物品，包括宠物、物品
//////////////////////////////////////////////////////////////////////
let TaskItemType:any = {
	NONE 	: 0,
	PET 	: 1,
	ITEM 	: 2,
	
}

//功能标识
//////////////////////////////////////////////////////////////////////
let TaskFunctionMark:any = {
	TASK						: 10,
	SHOP 						: 11,								//杂货
	STORE 					: 12,								//仓库
	ACTIVITY 				: 13,
	TRANSFER 				: 14,								//传送
	SELL 						: 15,								//寄售
	TRADE 					: 16,								//商会
	STALL 					: 17,
	RECLAIM 				: 18,								//回收
	IDENTIFY 				: 19,								//鉴定
	SHOP_WEAPON 		: 20,								//武器店
	SHOP_ARMOR 			: 21,								//防具店
	SHOP_MEDICINE 	: 22,								//药店
	SHOP_PET				: 23,								//售宠
	FLY							: 24,								//飞行符
	YUNBIAO					: 25,								//运镖
	SHIMEN					: 26,								//师门
	WAGE						: 27,								//打工
	CREATION				: 28,								//打造
	BRANCH					: 29,								//支线
	MAILBOX					: 30,								//邮箱
	OFFICIAL				: 31,								//官职
	FUBEN						: 32,								//副本
	PET							: 33,								//宠物
	SHOUYI					: 34,								//恢复（宠物）
	RECOVER					: 35,								//恢复
	MAKE						: 36,								//制造
	BANGPAI					: 37,								//帮派
	PRAY						: 38,								//祈福
	LIFE						: 39,								//生活
	RANSE						: 40,								//染色
	PRACTICE				: 41,								//修炼
	REPAIR					: 42,								//修理
	BAOSHI					: 43,								//宝石
	SKILL						: 44,								//技能
	BAOTU						: 45,								//宝图
	JIERI						: 46,								//节日
	CHOUJIANG				: 47,								//抽奖
	FUZHU						: 48,								//辅助
	DRAMA						: 49,								//剧情
	ZHONGCHENG			: 50,								//忠诚（宠物）
	JUQING					: 51,								//剧情
	DASHU						: 52,								//打书
	XILIAN					: 53,								//洗炼
	ZHUAGUI					: 54,								//抓鬼
	XIULIAN					: 55,								//修炼
	PAOHUAN					: 56,								//跑环
	JINGYAN					: 57,								//经验
	PK							: 58,								//PK
	
}

let markTransfer:any = {
	[TaskStatus.UNFINISH]										: "npchead_button_yijie"					,	
	[TaskStatus.NPC_FIND]										: "npchead_button_yijie"					,	
	[TaskStatus.FINISH]											: "npchead_button_wancheng"				,	
	[TaskFunctionMark.TASK]									: "npchead_button_task"						,	//"NPC_SIGN_TASK",
	[TaskFunctionMark.SHOP] 								: "npchead_button_shop"						,	//"NPC_SIGN_SHOP",
	[TaskFunctionMark.STORE] 								: "npchead_button_store"					,	//"NPC_SIGN_STORE",
	[TaskFunctionMark.ACTIVITY] 						: "npchead_button_activity"				,	//"NPC_SIGN_ACTIVITY",
	[TaskFunctionMark.TRANSFER] 						: "npchead_button_transfer"				,	//"NPC_SIGN_TRANSFER",
	[TaskFunctionMark.SELL] 								: "npchead_button_sell"						,	//"NPC_SIGN_SELL",
	[TaskFunctionMark.TRADE] 								: "npchead_button_trade"					,	//"NPC_SIGN_TRADE",
	[TaskFunctionMark.STALL] 								: "npchead_button_stall"					,	//"NPC_SIGN_STALL",
	[TaskFunctionMark.RECLAIM] 							: "npchead_button_reclaim"				,	//"NPC_SIGN_RECLAIM",
	[TaskFunctionMark.IDENTIFY] 						: "npchead_button_identify"				,	//"NPC_SIGN_IDENTIFY",
	[TaskFunctionMark.SHOP_WEAPON] 					: "npchead_button_shop_weapon"		,	//"NPC_SIGN_IDENTIFY",
	[TaskFunctionMark.SHOP_ARMOR] 					: "npchead_button_shop_armor"			,	//"NPC_SIGN_IDENTIFY",
	[TaskFunctionMark.SHOP_MEDICINE] 				: "npchead_button_shop_medicine"	,	//"NPC_SIGN_IDENTIFY",
	[TaskFunctionMark.SHOP_PET]							: "npchead_button_shop_pet"				,
	[TaskFunctionMark.FLY]									: "npchead_button_fly"						,
	[TaskFunctionMark.YUNBIAO]							: "npchead_button_yunbiao"				,
	[TaskFunctionMark.SHIMEN]								: "npchead_button_shimen"					,
	[TaskFunctionMark.WAGE]									: "npchead_button_wage"						,
	[TaskFunctionMark.CREATION]							: "npchead_button_creation"				,
	[TaskFunctionMark.BRANCH]								: "npchead_button_branch"					,
	[TaskFunctionMark.MAILBOX]							: "npchead_button_mailbox"				,
	[TaskFunctionMark.OFFICIAL]							: "npchead_button_official"				,
	[TaskFunctionMark.FUBEN]								: "npchead_button_fuben"					,
	[TaskFunctionMark.PET]									: "npchead_button_pet"						,
	[TaskFunctionMark.SHOUYI]								: "npchead_button_shouyi"					,
	[TaskFunctionMark.RECOVER]							: "npchead_button_recover"				,
	[TaskFunctionMark.MAKE]									: "npchead_button_make"						,
	[TaskFunctionMark.BANGPAI]							: "npchead_button_bangpai"				,
	[TaskFunctionMark.PRAY]									: "npchead_button_pray"						,
	[TaskFunctionMark.LIFE]									: "npchead_button_life"						,
	[TaskFunctionMark.RANSE]								: "npchead_button_ranse"					,
	[TaskFunctionMark.PRACTICE]							: "npchead_button_practice"				,
	[TaskFunctionMark.REPAIR]								: "npchead_button_repair"					,
	[TaskFunctionMark.BAOSHI]								: "npchead_button_baoshi"					,
	[TaskFunctionMark.SKILL]								: "npchead_button_skill"					,
	[TaskFunctionMark.BAOTU]								: "npchead_button_baotu"					,
	[TaskFunctionMark.JIERI]								: "npchead_button_jieri"					,
	[TaskFunctionMark.CHOUJIANG]						: "npchead_button_choujiang"			,
	[TaskFunctionMark.FUZHU]								: "npchead_button_fuzhu"					,
	[TaskFunctionMark.DRAMA]								: "npchead_button_drama"					,
	[TaskFunctionMark.ZHONGCHENG]						: "npchead_button_zhongcheng"			,
	[TaskFunctionMark.JUQING]								: "npchead_button_juqing"					,
	[TaskFunctionMark.DASHU]								: "npchead_button_dashu"					,
	[TaskFunctionMark.XILIAN]								: "npchead_button_xilian"					,
	[TaskFunctionMark.ZHUAGUI]							: "npchead_button_zhuagui"				,
	[TaskFunctionMark.XIULIAN]							: "npchead_button_xiulian"				,
	[TaskFunctionMark.PAOHUAN]							: "npchead_button_paohuan"				,
	[TaskFunctionMark.JINGYAN]							: "npchead_button_jingyan"				,
	[TaskFunctionMark.PK]										: "npchead_button_pk"							,
}
//操作类型
//////////////////////////////////////////////////////////////////////-
let OpType:any = {	
	normal : 1,
	func : 2, 
	task : 3,
}

//操作选项类型
//////////////////////////////////////////////////////////////////////-
let OptionType:any = {
	none 		: 0,
	normal 	: 1,
	special : 2,
}

//自动行走类型（自动寻路、遇敌等）
let AutoActionType:any = {
	NULL						: 0,
	FINDWAY_NORMAL 	: 1,
	FINDWAY_TASK		: 2,
	AUTORAN					: 3,
	FINDWAY_NPC			: 4,
}

let FindWayTargetType:any = {
	COORD : 1,
	NPC		: 2,
}

let TaskKeyType:any = {
	CHECK 			: 1,
	DIALOGOP 		: 2,
	LISTEN			: 3,
	LISTENTYPE	: 4,
}

// 检查功能 
//////////////////////////////////////////////////////////////////////
let TaskOpDefine:any = {}
TaskOpDefine.FUNCTION_FIELD_BEGIN = 100000

TaskOpDefine.FIELD_CHECK_LEVEL										= TaskOpDefine.FUNCTION_FIELD_BEGIN + 0	 //100000//检查等级 param:any = {"op", value1, value2}
TaskOpDefine.FIELD_CHECK_TASK_NODE									= TaskOpDefine.FUNCTION_FIELD_BEGIN + 40 //100040//检查是否已记录对话节点 param:any = {taskid, nodeid}
TaskOpDefine.FIELD_CHECK_PET_BREAK_LEVEL							= TaskOpDefine.FUNCTION_FIELD_BEGIN + 84 //100081//检查部下亲密度 {"op", value1, value2,["entryID"]:petID/null 为null时检查所有Pet} 
TaskOpDefine.FIELD_CHECK_ANY_ITEM_COUNT								= TaskOpDefine.FUNCTION_FIELD_BEGIN + 4	 //100004//满足背包物品指定数量，并比较N个 param:any = {[1]:{[itemId]:count,[itemId]:count},[2]={"op", value1, value2} }
TaskOpDefine.FIELD_CHECK_FINISHTASK									=	TaskOpDefine.FUNCTION_FIELD_BEGIN + 11 //100011//检查是否完成任务param=taskId【重要】
TaskOpDefine.FIELD_CHECK_ITEM_COUNT									= TaskOpDefine.FUNCTION_FIELD_BEGIN + 21 //100021//检查指定物品数目 param:any = {[1]:itemEntryId, [2]:{"op", value1, value2} }
TaskOpDefine.FIELD_CHECK_FINISH_NPCTASK								= TaskOpDefine.FUNCTION_FIELD_BEGIN + 150 //1000150//检查完成寻找NPC子任务 param=taskId
TaskOpDefine.FIELD_CHECK_FINISHCARD									= TaskOpDefine.FUNCTION_FIELD_BEGIN + 72 //100072//检查是否通关 param:any = {{campainId, ret}, {}}
TaskOpDefine.FIELD_CHECK_SAVERECORD									= TaskOpDefine.FUNCTION_FIELD_BEGIN + 71 //100071//检查当前的saveRecord param:any = {recordId, "NULL"/"string"/number}
TaskOpDefine.FIELD_CHECK_CURRENT_MAP								= TaskOpDefine.FUNCTION_FIELD_BEGIN + 70 //100070//检查当前地图 param=mapId


//对话框操作定义
//////////////////////////////////////////////////////////////////////
let DialogOpDefine:any = {}
DialogOpDefine.FILED_TASK_BEGIN 	= 0
DialogOpDefine.FILED_TASK_END		 	= 100

DialogOpDefine.FILED_TASK_WITHOUTNPC_BEGIN 	= 1000
DialogOpDefine.FILED_TASK_WITHOUTNPC_END	 	= 2000

DialogOpDefine.FILED_ACTIVITY_BEGIN	 	= 3000
DialogOpDefine.FILED_ACTIVITY_END	 	= 4000

DialogOpDefine.FILED_UI_BEGIN 	= 9000
DialogOpDefine.FILED_UI_END		 	= 10000

DialogOpDefine.FIELD_SAVE_NODE											= DialogOpDefine.FILED_TASK_BEGIN + 1	 //1  保存节点     param=
DialogOpDefine.FIELD_COMMIT_TASK										= DialogOpDefine.FILED_TASK_BEGIN + 2	 //2  提交任务     param=
DialogOpDefine.FIELD_START_FIGHT										= DialogOpDefine.FILED_TASK_BEGIN + 3	 //3  触发战斗     param=
DialogOpDefine.FIELD_FIND_NPC												= DialogOpDefine.FILED_TASK_BEGIN + 4	 //4  npc记录      param=
DialogOpDefine.FIELD_CANCEL_TASK										= DialogOpDefine.FILED_TASK_BEGIN + 5	 //5  放弃任务     param=
DialogOpDefine.FIELD_APPLY_TASk											= DialogOpDefine.FILED_TASK_BEGIN + 6	 //6  申请随机类型（如师门）任务 		 param=taskType

DialogOpDefine.FIELD_CLUB_MAP_COLLECT_TASK                              = DialogOpDefine.FILED_TASK_BEGIN + 7    //7 帮会任务采集
DialogOpDefine.FIELD_CLUB_MAP_INSTRUSION_TASK                           = DialogOpDefine.FILED_TASK_BEGIN + 8    //8 帮会任务小怪
DialogOpDefine.FIELD_ZHONGKUI_TASK                          			= DialogOpDefine.FILED_TASK_BEGIN + 9    //9 钟馗Npc

DialogOpDefine.FIELD_WULIN_TASK				                  			= DialogOpDefine.FILED_TASK_BEGIN + 10    //武林大会Npc
DialogOpDefine.FIELD_STRONGHOLD_NPC                          			= DialogOpDefine.FILED_TASK_BEGIN + 11    //据点矿Npc
DialogOpDefine.FIELD_STRONGHOLD_KEY                          			= DialogOpDefine.FILED_TASK_BEGIN + 12    //据点钥匙
DialogOpDefine.FIELD_STRONGHOLD_BOSS                          			= DialogOpDefine.FILED_TASK_BEGIN + 13    //据点boss
DialogOpDefine.FIELD_STRONGHOLD_BOX                          			= DialogOpDefine.FILED_TASK_BEGIN + 14    //据点宝箱

//任务系统监听定义
////////////////////////////////////////////////////////////////////////
let TaskListenType:any = {}

TaskListenType.NEWTASK = 		"ACCEPTTASK"					//1		//新接任务
TaskListenType.FINISHTASK = "FINISHTASK"					//2 //完成任务<a name=""></a>
TaskListenType.COMMITTASK = "COMMITTASK"					//3 //提交任务
TaskListenType.UPDATETASK = "UPDATETASK"					//4 //更新任务
TaskListenType.GIVEUPTASK = "GIVEUPTASK"					//5 //放弃任务
TaskListenType.FAILTASK = 	"FAILTASK"						//6 //任务失败
TaskListenType.ARRIVETASK = "ARRIVETASK"					//7 //到达地点监听
TaskListenType.PASSTIMETASK = "PASSTIMETASK"			//8 //任务过时
TaskListenType.READY_GIVEUPTASK = "READY_GIVEUPTASK"		//10 //即将放弃任务

TaskListenType.COMMITTASKFINISH = "COMMITTASKFINISH"				//11 //服务器响应完成任务
TaskListenType.COMMITTASKFAILED = "COMMITTASKFAILED"				//12 //服务器响应任务失败
TaskListenType.COMMITTASKCANCEL = "COMMITTASKCANCEL"				//13 //服务器响应取消任务

TaskListenType.SPECIALHANDLER = "SPECIALHANDLER"						//14 //特殊处理

//////////////////////////////////////////////////////////////////////////////////////-
let TaskListenDefine:any = {}

TaskListenDefine.LISTEN_NEW_TAK_BEGIN = 100
TaskListenDefine.LISTEN_FINISH_TASK_BEGIN = 200
TaskListenDefine.LISTEN_COMMIT_TASK_BEGIN = 300
TaskListenDefine.LISTEN_UPDATE_TASK_BEGIN = 400
TaskListenDefine.LISTEN_GIVEUP_TASK_BEGIN = 500
TaskListenDefine.LISTEN_ARRIVE_TASK_BEGIN = 700
TaskListenDefine.LISTEN_PASSTIME_TASK_BEGIN = 800

//可邀请部下回顾
TaskListenDefine.FIELD_PET_INVITE_REVIEW_HANDLE = 900

TaskListenDefine.LISTEN_READY_GIVEUP_TASK_BEGIN = 1000
TaskListenDefine.LISTEN_COMMITTASKFINISH_TASK_BEGIN = 1100

TaskListenDefine.LISTEN_SPECIALHANDLER_BEGIN = 1400

TaskListenDefine.LISTEN_COMMON_LISTEN_BEGIN = 2000

//公用监听动作
TaskListenDefine.FIELD_COMMON_EXECUTELINK 									= TaskListenDefine.LISTEN_COMMON_LISTEN_BEGIN + 1 //2001 执行超链操作	（格式参照超链规则部分）
TaskListenDefine.FIELD_COMMON_SHOWUP_DIALOG 								= TaskListenDefine.LISTEN_COMMON_LISTEN_BEGIN + 2 //2002 打开指定对话节点  {talkId, entryId, nodeId}
TaskListenDefine.FIELD_COMMON_PLAY_MOVIE					 					= TaskListenDefine.LISTEN_COMMON_LISTEN_BEGIN + 3 //2003 播放电影剧情	"movieName"
TaskListenDefine.FIELD_COMMON_SHOW_TIPS						 					= TaskListenDefine.LISTEN_COMMON_LISTEN_BEGIN + 4 //2004 显示文字提示	{channelId, "content"}
TaskListenDefine.FIELD_COMMON_APPLY_TYPETASK								= TaskListenDefine.LISTEN_COMMON_LISTEN_BEGIN + 5 //2005 自动接收类型任务	taskType
TaskListenDefine.FIELD_COMMON_FIGHT_WIN_RECALL							= TaskListenDefine.LISTEN_COMMON_LISTEN_BEGIN + 6 //2006 加入战胜结算回调（只提供打开关卡界面）
TaskListenDefine.FIELD_COMMON_SHOW_TASKTRACE								= TaskListenDefine.LISTEN_COMMON_LISTEN_BEGIN + 7 //2007 显示任务跟踪信息	{channelId}
TaskListenDefine.FIELD_COMMON_FENGMO_DAILY_PRO							= TaskListenDefine.LISTEN_COMMON_LISTEN_BEGIN + 8 //2008 封魔任务当天的完成次数（描述）{}
TaskListenDefine.FIELD_COMMON_GUIDE_DRAMA_TIPS							= TaskListenDefine.LISTEN_COMMON_LISTEN_BEGIN + 9 //2009 弹出引导用的对白提示界面{"描述1","描述2","描述3"...}

//////////////////////////////////////////////////////////////////////////////////////-

//////////////////////////////////////////////////////////////////////////////////////-
//完成任务
TaskListenDefine.FIELD_AUTO_COMMIT_TASK 							= TaskListenDefine.LISTEN_FINISH_TASK_BEGIN + 1 //201 自动提交任务
TaskListenDefine.FIELD_COMMIT_GODDESSKISS_TASK 						= TaskListenDefine.LISTEN_FINISH_TASK_BEGIN + 2 //202 提交女神之吻任务
//[2]={2007000,12},

//////////////////////////////////////////////////////////////////////////////////////-
//提交任务

//////////////////////////////////////////////////////////////////////////////////////-
//更新任务
TaskListenDefine.FIELD_UPDATE_XUNLUO 									= TaskListenDefine.LISTEN_UPDATE_TASK_BEGIN + 1 //401巡逻任务战胜一场时弹出对话框[4]={[40005]:{talkId, entryId, nodeId}}
TaskListenDefine.FIELD_UPDATE_COMMIT_RES 							= TaskListenDefine.LISTEN_UPDATE_TASK_BEGIN + 2 //402提交完资源（物品、宠物）继续对话[4]={[40006]:entryId/"COMMIT_NPC"}
TaskListenDefine.FIELD_UPDATE_ANSWER_QUESTION					= TaskListenDefine.LISTEN_UPDATE_TASK_BEGIN + 3 //403答题任务，回答完毕弹出对话框[4]={[40008]:{["correct"]:{talkId, entryId, nodeId}, ["incorrect"]={talkId, entryId, nodeId}}}
TaskListenDefine.FIELD_UPDATE_COLLECT_ON							= TaskListenDefine.LISTEN_UPDATE_TASK_BEGIN + 4 //404记录完npc后再继续找npc（采集）[4]={[40009]:"50001;1;40001(0;0)"}
TaskListenDefine.FIELD_UPDATE_COLLECT_TIPS						= TaskListenDefine.LISTEN_UPDATE_TASK_BEGIN + 5 //405记录完npc后弹字幕提示[4]={[40010]:{1, "content"}}					频道ID/内容

//////////////////////////////////////////////////////////////////////////////////////-
//放弃任务

//////////////////////////////////////////////////////////////////////////////////////-
//到达地点

//////////////////////////////////////////////////////////////////////////////////////-
//任务过时

//////////////////////////////////////////////////////////////////////////////////////-
//即将放弃任务监听

//服务器响应完成任务
TaskListenDefine.FIELD_COMMITTASKFINISH_ACCEPT_TASK				= TaskListenDefine.LISTEN_COMMITTASKFINISH_TASK_BEGIN + 1 //1101自动接收任务			['param']=taskId

//特殊处理
TaskListenDefine.FIELD_SPECIALHANDLER_OPENDIA					= TaskListenDefine.LISTEN_SPECIALHANDLER_BEGIN + 1 //1401自动打开对话框	['param']={talkId, npcEntryId, nodeId}
////////////////////////////////////////////////////////////////////////////////////////
//由于任务系统原有的各种属性索引是基于数值的
//后来服务器加入字符串处理，为开发过程中客户端和服务器可能出现的进度不一致情况
//客户端使用一套独立的任务（后面新加的才用到，原来的维持不变）属性索引
//let ClientTaskField:any = {}
//完成条件
// ClientTaskField.FIELD_FINISH_KUANGDONG							= taskField.FIELD_FINISH_GRAB_ORE						 	//矿洞掠夺							["xxx1"] = count
// ClientTaskField.FIELD_FINISH_TIANKONGZHITA						= taskField.FIELD_FINISH_SKYTOWER_IN_TEAM 		//天空之塔通过某层			["xxx2"] = layer
// ClientTaskField.FIELD_FINISH_DUOCITONGGUAN						= taskField.FIELD_FINISH_CAMPAIGN_COUNT 			//多次通关卡						["xxx3"] = {campId, num}
// ClientTaskField.FIELD_FINISH_HUANXINGXIANG						= taskField.FIELD_FINISH_CHANGE_DISPLAY 			//换形象								["xxx4"] = 1
// ClientTaskField.FIELD_FINISH_FAXIAOXI							= taskField.FIELD_FINISH_WORLD_CHANNEL_TALK 	//聊天频道发消息				["xxx5"] = 1
// ClientTaskField.FIELD_FINISH_DAZAOJIPIN							= taskField.FIELD_FINISH_MAKE_OBLATION 				//打造祭品							["xxx6"] = 1
// ClientTaskField.FIELD_FINISH_BATTLE								= "BATTLE" 																		//战胜NPC								["BATTLE"] = {npcEntryId, taskId}
// ClientTaskField.FIELD_FINISH_COLLECTITEM						= taskField.FIELD_FINISH_COMMIT_ITEM					//收集物品							["XXXX1"] = {[entryId] : count, [entryId] : count}
// ClientTaskField.FIELD_FINISH_FIGHTDYNAMICNPC					= taskField.FIELD_FINISH_FIGHTWIN_FACTION_NPC	//战胜动态npc						["XXXX2"] = {npcEntryId, battleId}
// ClientTaskField.FIELD_FINISH_KILL_MONSTER						= "KILL_MONSTER"															//杀怪									{[entryId] : count}
// ClientTaskField.FIELD_FINISH_EQUIP_ENHANCE 						= "EQUIP_ENHANCE"															//5件装备强化等级>=3										={5,3} 
// ClientTaskField.FIELD_FINISH_PLR_LEVEL							= "PLR_LEVEL"																//主角等级>=20级												=20    
// ClientTaskField.FIELD_FINISH_PET_LEVEL							= "PET_LEVEL"																//3个伙伴等级>=20级											={3,20}
// ClientTaskField.FIELD_FINISH_PET_LOTTERY						= "PET_LOTTERY"																//祭台抽奖>=10次												=10,   
// ClientTaskField.FIELD_FINISH_EQUIP_ON							= "EQUIP_ON"																//所有伙伴+主角穿戴>=10件>=2阶装备			={10,2}
// ClientTaskField.FIELD_FINISH_SKY_TOWER							= "SKY_TOWER"																//地宫层数>=20													=20    
// ClientTaskField.FIELD_FINISH_CHAMPION							= "CHAMPION"																//进入竞技场前5000名									  =5000  
// ClientTaskField.FIELD_FINISH_AWAKE_LEVEL						= "AWAKE_LEVEL"																//>(主角/伙伴)进阶等级>=2								={3,2}/{阶,数} 
// ClientTaskField.FIELD_FINISH_BREAK_LEVEL						= "BREAK_LEVEL"																//>(主角/伙伴)蜕变等级>=2								={18000,2} 
// ClientTaskField.FIELD_FINISH_WING_LEVEL							= "WING_LEVEL"																//守护等级>=3级													=3    
// ClientTaskField.FIELD_FINISH_WUDONG_COUNT						= "INTERCATION"																//互动次数															={7656/entryId, 3}
// ClientTaskField.FIELD_FINISH_ROBBER_SKILL						= "ROBBER_SKILL"															//使用1次圣地技能次数1003    						={1003,1}
// ClientTaskField.FIELD_FINISH_UNLOCK_VOCATION					= "UNLOCK_VOCATION"															//解锁1个2阶职业                    		={2,1}
// ClientTaskField.FIELD_FINISH_FEEL_GIFT							= "FEEL_GIFT"																//领取2次心情奖励                   		=2
// ClientTaskField.FIELD_FINISH_RELICE_MINE						= "RELICE_MINE"																//接取任务后占领或掠夺N次            		=3
// ClientTaskField.FIELD_FINISH_WING_SKILL_COUNT					= "WING_SKILL_COUNT"														//守护植入技能数大于等于1            		=1
// ClientTaskField.FIELD_FINISH_CHANG_KILL_MONSTER					= "CHANGE_KILL_MONSTER"														//圣地杀怪xxx数量1						={26,1}


//////////////////////////////////////////////////////////////数字-字符串对照转换//////////////////////////////////////////////////////////
// let TaskS2D:any = {}
// TaskS2D.FIELD_BEGIN																			= 120000						//任务条件方面，数值范围以taskOption.lua为参照

// TaskS2D.FIGHTWIN_NPC																		= TaskS2D.FIELD_BEGIN + 1   // 120001 战胜npc
// TaskS2D.FEIXINGQ_QUESTION																= TaskS2D.FIELD_BEGIN + 2		// 120002 回答问题
// TaskS2D.TASK_TYPE_COUNT																	= TaskS2D.FIELD_BEGIN + 3		// 120003 完成类型任务次数
// TaskS2D.QUESTION																				= TaskS2D.FIELD_BEGIN + 4		// 120004 回答问题（通用）
// TaskS2D.CAMPAIGN																				= TaskS2D.FIELD_BEGIN + 5		// 120005 通关卡
// TaskS2D[ClientTaskField.FIELD_FINISH_KUANGDONG]					= TaskS2D.FIELD_BEGIN + 6		// 120006 掠夺矿洞
// TaskS2D[ClientTaskField.FIELD_FINISH_TIANKONGZHITA]				= TaskS2D.FIELD_BEGIN + 7		// 120007 天空之塔
// TaskS2D[ClientTaskField.FIELD_FINISH_DUOCITONGGUAN]				= TaskS2D.FIELD_BEGIN + 8		// 120008 多次通关
// TaskS2D[ClientTaskField.FIELD_FINISH_HUANXINGXIANG]				= TaskS2D.FIELD_BEGIN + 9		// 120009 换形象
// TaskS2D[ClientTaskField.FIELD_FINISH_FAXIAOXI]					= TaskS2D.FIELD_BEGIN + 10	// 120010 聊天频道发消息
// TaskS2D[ClientTaskField.FIELD_FINISH_DAZAOJIPIN]				= TaskS2D.FIELD_BEGIN + 11	// 120011 打造祭品
// TaskS2D[ClientTaskField.FIELD_FINISH_BATTLE]					= TaskS2D.FIELD_BEGIN + 12	// 120012 战胜NPC（固定NPC）
// TaskS2D[ClientTaskField.FIELD_FINISH_COLLECTITEM]				= TaskS2D.FIELD_BEGIN + 13	// 120013 收集物品
// TaskS2D[ClientTaskField.FIELD_FINISH_FIGHTDYNAMICNPC]			= TaskS2D.FIELD_BEGIN + 14	// 120014 战胜动态npc
// TaskS2D[ClientTaskField.FIELD_FINISH_KILL_MONSTER]				= TaskS2D.FIELD_BEGIN + 15	// 120015 杀怪					
// TaskS2D[ClientTaskField.FIELD_FINISH_EQUIP_ENHANCE]				= TaskS2D.FIELD_BEGIN + 16	// 120016 强化等级>=%s装备数量%s
// TaskS2D[ClientTaskField.FIELD_FINISH_PLR_LEVEL]					= TaskS2D.FIELD_BEGIN + 17	// 120017 主角等级>=%s级
// TaskS2D[ClientTaskField.FIELD_FINISH_PET_LEVEL]					= TaskS2D.FIELD_BEGIN + 18	// 120018 %s个伙伴等级>=%s级
// TaskS2D[ClientTaskField.FIELD_FINISH_PET_LOTTERY]				= TaskS2D.FIELD_BEGIN + 19	// 120019 祭坛召唤>=%s次
// TaskS2D[ClientTaskField.FIELD_FINISH_EQUIP_ON]					= TaskS2D.FIELD_BEGIN + 20	// 120020 穿戴%s件%s阶装备
// TaskS2D[ClientTaskField.FIELD_FINISH_SKY_TOWER]					= TaskS2D.FIELD_BEGIN + 21	// 120021 通过地宫%s层数
// TaskS2D[ClientTaskField.FIELD_FINISH_CHAMPION]					= TaskS2D.FIELD_BEGIN + 22	// 120022 进入竞技场前%s名
// TaskS2D[ClientTaskField.FIELD_FINISH_AWAKE_LEVEL]				= TaskS2D.FIELD_BEGIN + 23	// 120023 %s个(主角+伙伴)进阶等级>=%s
// TaskS2D[ClientTaskField.FIELD_FINISH_BREAK_LEVEL]				= TaskS2D.FIELD_BEGIN + 24	// 120024 %s个(主角+伙伴)蜕变等级>=%s
// TaskS2D[ClientTaskField.FIELD_FINISH_WING_LEVEL]				= TaskS2D.FIELD_BEGIN + 25	// 120025 守护等级%s级***
// TaskS2D[ClientTaskField.FIELD_FINISH_WUDONG_COUNT]				= TaskS2D.FIELD_BEGIN + 26	// 120026 互动次数
// TaskS2D[ClientTaskField.FIELD_FINISH_ROBBER_SKILL]				= TaskS2D.FIELD_BEGIN + 27	// 120027 使用1次圣地技能次数1003
// TaskS2D[ClientTaskField.FIELD_FINISH_UNLOCK_VOCATION]			= TaskS2D.FIELD_BEGIN + 28	// 120028 解锁1个2阶职业
// TaskS2D[ClientTaskField.FIELD_FINISH_FEEL_GIFT]					= TaskS2D.FIELD_BEGIN + 29	// 120029 领取2次心情奖励
// TaskS2D[ClientTaskField.FIELD_FINISH_RELICE_MINE]				= TaskS2D.FIELD_BEGIN + 30	// 120030 接取任务后占领或掠夺N次
// TaskS2D[ClientTaskField.FIELD_FINISH_WING_SKILL_COUNT]			= TaskS2D.FIELD_BEGIN + 31	// 120031	守护植入技能数大于等于1
// TaskS2D[ClientTaskField.FIELD_FINISH_CHANG_KILL_MONSTER]		= TaskS2D.FIELD_BEGIN + 32	// 120032 圣地杀怪xxx数量1

//放弃任务前确认弹窗提示文字
let TaskConfirmGiveUp:any = {
												//[taskType.School] 				: "PANEL_CANCELTASK_SHIMEN",
												//[taskType.TianShi] 				: "PANEL_CANCELTASK",
												//[taskType.HuSong] 				: "PANEL_CANCELTASK",
												//[taskType.Cangbaotu]	 		: "PANEL_CANCELTASK",
												//[taskType.FeiXingQi] 			: "PANEL_CANCELTASK",
												//[taskType.XiuWeiPuTong] 	: "PANEL_CANCELTASK",
												//[taskType.FactionJianZhu] : "PANEL_CANCELTASK",
												//[taskType.FactionXuanWu] 	: "PANEL_CANCELTASK",
										}
										

