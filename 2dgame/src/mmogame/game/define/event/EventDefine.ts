/*
作者:
    yangguiming
	
创建时间：
   2013.6.06(周四)

意图：
   定义事件

公共接口：
   
*/

let EventDefine = {
	//系统事件
	//////////////////////////////////////////////////////////////////////////-
	SYSTEM_MOUSE_DOWN: "SYSTEM_MOUSE_DOWN",				//鼠标按下事件 args:Core::InputMouseEvent
	SYSTEM_MOUSE_MOVE: "SYSTEM_MOUSE_MOVE",	//鼠标按下移动事件 args:Core::InputMouseEvent
	SYSTEM_MOUSE_UP: "SYSTEM_MOUSE_UP",		//鼠标放开事件 args:Core::InputMouseEvent
	SYSTEM_MOUSE_CLICK: "SYSTEM_MOUSE_CLICK",	//鼠标点击事件 args:Core::InputMouseEvent
	SYSTEM_MOUSE_DBCLICK: "SYSTEM_MOUSE_DBCLICK", //鼠标点击事件 args:Core::InputMouseEvent
	SYSTEM_MOUSE_LONGDOWN: "SYSTEM_MOUSE_LONGDOWN",				//鼠标长按下事件 args:Core::InputMouseEvent

	SYSTEM_IME_SHOW: "SYSTEM_IME_SHOW",				//输入法出现 args:IMEEvent
	SYSTEM_IME_HIDE: "SYSTEM_IME_HIDE",				//输入法隐藏 args:null

	SYSTEM_PAUSE: "SYSTEM_PAUSE",					//游戏暂停
	SYSTEM_RESUME: "SYSTEM_RESUME",				//游戏恢复

	SYSTEM_RECORD_START: "SYSTEM_RECORD_START",			//录音开始 args:DeviceRecordEvent
	SYSTEM_RECORD_STOP: "SYSTEM_RECORD_STOP",				//录音结束 args:null


	//主窗口事件
	ROOTWINDOW_MOUSE_UP: "ROOTWINDOW_MOUSE_UP",		//rootWindow 鼠标弹起事件， args:MouseEvent
	ROOTWINDOW_MOUSE_MOVE: "ROOTWINDOW_MOUSE_MOVE",		//rootWindow 鼠标弹起事件， args:MouseEvent
	ROOTWINDOW_MOUSE_CLICK: "ROOTWINDOW_MOUSE_CLICK",		//rootWindow 鼠标弹起事件， args:MouseEvent
	ROOTWINDOW_MOUSE_DOWN: "ROOTWINDOW_MOUSE_DOWN",		//rootWindow 鼠标弹起事件， args:MouseEvent
	ROOTWINDOW_END_DRIVE: "ROOTWINDOW_END_DRIVE",			//rootWindow 鼠标拖动完毕事件，args:RootWindowDriveEvent
	////////////////////////////-CommonEvents////////////////////////////////////////////	
	//流程事件
	PRECEDURE_ACTIVE: "PRECEDURE_ACTIVE",		//流程激活 args:PrecedureEvent
	PRECEDURE_DEACTIVE: "PRECEDURE_DEACTIVE", //流程退出 args:PrecedureEvent

	//游戏启动加载
	LOADING_LANCH_RESOURCE_FINISH: "LOADING_LANCH_RESOURCE_FINISH",		//加载完毕 args:LoadingUpdateEvent

	//第一次进入游戏世界的资源加载
	LOADING_GAME_RESOURCE_PREPARE: "LOADING_GAME_RESOURCE_PREPARE",		 //资源准备 args:LoadingEvent
	LOADING_GAME_RESOURCE_BEGIN: "LOADING_GAME_RESOURCE_BEGIN",		 //资源加载 args:LoadingUpdateEvent             
	LOADING_GAME_RESOURCE_UPDATE: "LOADING_GAME_RESOURCE_UPDATE",    //加载进度更新 args:LoadingUpdateEvent   
	LOADING_GAME_RESOURCE_FINISH: "LOADING_GAME_RESOURCE_FINISH",       //加载完毕 args:LoadingUpdateEvent       

	//状态事件
	STATE_ACTIVE: "STATE_ACTIVE", 	//状态激活 args:StateEvent
	STATE_DEACTIVE: "STATE_DEACTIVE", //状态退出 args:StateEvent

	COMMAND_CLEAR: "COMMAND_CLEAR", //命令情况事件 args:null


	GAME_RECV_RESULT: "GAME_RECV_RESULT", //收到游戏结果码 args:GameResultEvent
	GAME_RECV_RESULT_STRING: "GAME_RECV_RESULT_STRING", //收到服务器返回消息 args:GameResultEvent

	GAME_SERVERTIME_UPDATE: "GAME_SERVERTIME_UPDATE",  			 //服务器时间更新时间

	MSG_WAIT_BEGIN: "MSG_WAIT_BEGIN", 				//网络消息等待开始 args:ClientWaitEvent
	MSG_WAIT_END: "MSG_WAIT_END", 				//网络消息等待结束 args:null


	GAME_PAUSE: "GAME_PAUSE",					//游戏暂停
	GAME_RESUME: "GAME_RESUME",				//游戏恢复

	//GAME_SERVER_EVENT_BROADCAST					: "GAME_SERVER_EVENT_BROADCAST",	//服务器事件广播	arg:GameServerEvent

	GAME_DISCONNECT: "GAME_DISCONNECT", //游戏连接断开 args:null

	//////////////////////////////////LoginEvents////////////////////////////////////////-
	//登陆系统
	//LOGIN_SERVERLIST_TCP_CONNECT  		: "LOGIN_SERVERLIST_TCP_CONNECT",//服务器列表创建TCP连接成功 args:TcpNetEvent
	//LOGIN_SERVERLIST_TCP_CLOSE 	  		: "LOGIN_SERVERLIST_TCP_CLOSE",//服务器列表TCP连接断开 args:TcpNetEvent
	//LOGIN_SERVERLIST_CONNECT					: "LOGIN_SERVERLIST_CONNECT",//服务器列表连接事件 args:LoginConnectEvent
	//LOGIN_SERVERLIST_STATE 						: "LOGIN_SERVERLIST_STATE",//获取服务器列表状态 args:LoginConnectStateEvent
	//LOGIN_SERVERLIST_VERSION  				: "LOGIN_SERVERLIST_VERSION",//获取服务器列表版本号 args:LoginConnectVersionEvent
	//LOGIN_REQUEST_BRIDGE_AUTH					: "LOGIN_REQUEST_BRIDGE_AUTH",

	LOGIN_SERVERLIST_UPDATE: "LOGIN_SERVERLIST_UPDATE",//获取服务器列表版本号 args:LoginConnectVersionEvent

	LOGIN_CREATE_ROLE: "LOGIN_CREATE_ROLE",		 //创建角色		 ars:LoginCreateRoleEvent
	LOGIN_ROLELIST_UPDATE: "LOGIN_ROLELIST_UPDATE", //角色列表更新 args:EventArgs
	LOGIN_VERIFY_UPDATE: "LOGIN_VERIFY_UPDATE",    //登陆验证码更新

	//LOGIN_REQUEST_ACCOUNT_AUTH        : "LOGIN_REQUEST_ACCOUNT_AUTH",//请求登录账户验证
	LOGIN_ACCOUNT_AUTH_SUCC: "LOGIN_ACCOUNT_AUTH_SUCC",   //账户验证成功
	LOGIN_ACCOUNT_AUTH_FAILED: "LOGIN_ACCOUNT_AUTH_FAILED",   //认证失败

	LOGIN_CONNECT_SUCC: "LOGIN_BRIDGE_AUTH_SUCC",    //桥验证成功
	//LOGIN_REQUEST_SHOW_SERVERSPEC     : "LOGIN_REQUEST_SHOW_SERVERSPEC",//请求显示服务器列表就界面
	//LOGIN_REQUEST_SHOW_RECENT		  : "LOGIN_REQUEST_SHOW_RECENT",//请求打开最近登录	
	LOGIN_REQUEST_SHOW_REGISTER: "LOGIN_REQUEST_SHOW_REGISTER",//请求打开注册界面	
	LOGIN_REQUEST_SHOW_AUTH: "LOGIN_REQUEST_SHOW_AUTH", //请求打开账户界面
	LOGIN_REQUEST_SHOW_ROLESPEC: "LOGIN_REQUEST_SHOW_ROLESPEC",//请求打开角色创建界面
	LOGIN_REQUEST_SHOW_SDK_AUTH: "LOGIN_REQUEST_SHOW_SDK_AUTH",//请求打开SDK登陆选择界面

	LOGIN_REQUEST_RESTART: "LOGIN_REQUEST_RESTART",//重新开始登陆流程

	LOGIN_LOGO_HIDE_BEGIN: "LOGIN_LOGO_HIDE_BEGIN",//游戏动画开始
	LOGIN_LOGO_HIDE_FINISH: "LOGIN_LOGO_HIDE_FINISH",//游戏动画结束

	LOGIN_GUEST_BIND_STATE_UPDATE: "LOGIN_GUEST_BIND_STATE_UPDATE",//官方绑定账号

	//////////////////////////////////ActorEvents////////////////////////////////////////-
	ACTOR_GOTFUCOS: "ACTOR_GOTFUCOS",					//获得焦点 args:ActorFocusEvent
	ACTOR_LOSTFUCOS: "ACTOR_LOSTFUCOS",				//失去焦点 args:ActorFocusEvent
	ACTOR_CLICK_LIST: "ACTOR_CLICK_LIST",				//点击一群玩家 args:ActorClickListEvent
	//NPC事件
	NPC_ENTER_MAP: "NPC_ENTER_MAP",					//NPC进入AOI args:ActorEvent
	NPC_LEAVE_MAP: "NPC_LEAVE_MAP",					//NPC离开AOI args:ActorEvent
	NPC_SHOW: "NPC_SHOW",								//NPC显示  args:ActorEvent
	NPC_HIDE: "NPC_HIDE",								//NPC隐藏  args:ActorEvent

	//玩家事件                    		
	PLAYER_ENTER_MAP: "PLAYER_ENTER_MAP",				//玩家离开AOI args:ActorEvent
	PLAYER_LEAVE_MAP: "PLAYER_LEAVE_MAP",				//玩家进入AOI args:ActorEvent
	PLAYER_INFO_UPDATE: "PLAYER_INFO_UPDATE",			//玩家属性更新 args:ActorUpdateEvent
	PLAYER_MOVE_BEGIN: "PLAYER_MOVE_BEGIN",			//玩家移动 args:ActorEvent
	PLAYER_MOVE: "PLAYER_MOVE",						//玩家移动 args:ActorEvent
	PLAYER_MOVE_STOP: "PLAYER_MOVE_STOP",				//玩家移动 args:ActorEvent
	OBJECT_MESSAGE_MOVE: "OBJECT_MESSAGE_MOVE",		//玩家移动消息 args:MessageMoveEvent
	CHECK_PLAYER_INFO_UPDATE: "CHECK_PLAYER_INFO_UPDATE",//查看玩家信息

	//主角事件                    		                        		
	HERO_ENTER_GAME: "HERO_ENTER_GAME",				//进入游戏（进入游戏流程后触发一次）args:null
	HERO_LEAVE_GAME: "HERO_LEAVE_GAME",				//离开游戏 args:ActorEvent

	HERO_ENTER_SERVERMAP: "HERO_ENTER_SERVERMAP",					//进入地图（每次跳地图触发） args:null
	HERO_ENTER_MAP: "HERO_ENTER_MAP",					//进入地图（每次跳地图触发） args:null
	HERO_LEAVE_MAP: "HERO_LEAVE_MAP",					//离开地图 args:null
	HERO_MOVE_BEGIN: "HERO_MOVE_BEGIN",					//主角移动 args:ActorMovementEvent
	HERO_MOVE: "HERO_MOVE",								//主角移动 args:ActorMovementEvent
	HERO_MOVE_STOP: "HERO_MOVE_STOP",						//主角移动 args:ActorMovementEvent
	HERO_INFO_UPDATE: "HERO_INFO_UPDATE",				//主角属性更新 args:ActorUpdateEvent
	HERO_RESET_POSITION: "HERO_RESET_POSITION",		//主角重置位置 args:null
	HERO_LEVELUP: "HERO_LEVELUP",						//主角升级 args:null
	HERO_PER_LEVELUP: "HERO_PER_LEVELUP",				//主角每一级升级 args:any : {level: XX}
	HERO_FINDWAY_CHANGE: "HERO_FINDWAY_CHANGE",		//主角寻路行走 args:null
	HERO_AUTORUN_CHANGE: "HERO_AUTORUN_CHANGE",		//主角自动行走遇敌 args:null

	HERO_AUTOFINDWAY: "HERO_AUTOFINDWAY", 			//主角自动行走事件 args:AutoFindWayEvent
	HERO_STOP: "HERO_STOP",							//主角移动 args:null
	HERO_GET_AUTO_POTENTIAL: "HERO_GET_AUTO_POTENTIAL",//主角获取自动加点 args : GetAtuoPotentialEvent
	ROLE_CHENGJIU_UPDATE: "ROLE_CHENGJIU_UPDATE",    //主角成就点
	HERO_ENTER_CROSS_SERVER: "HERO_ENTER_CROSS_SERVER", //主角进入跨服服务器

	IS_CHAMPION_FIRST: "IS_CHAMPION_FIRST",      //是否竞技场第一
	IS_WUDOU_FIRST: "IS_WUDOU_FIRST",         //是否武斗第一     

	EQUIP_XILIAN: "EQUOP_XILIAN",         //是否武斗第一           
      

	//////////////////////////////////MapEvents//////////////////////////////////////-
	MAP_CLICK: "MAP_CLICK",							//点击地图，				 	  args:MapClickEvent
	MAP_VIEWPORTCHANGE: "MAP_VIEWPORTCHANGE",			//地图视口改变					args:null
	MAP_LOADING_SHOW: "MAP_LOADING_SHOW",				// 地图加载， args:null
	MAP_SERVER_NPC_LIST: "MAP_SERVER_NPC_LIST",		//当前地图服务器创建的npc列表

	//////////////////////////////////CombatEvents//////////////////////////////////////-
	COMBAT_BEGIN: "COMBAT_BEGIN",						//战斗开始 							args:null		**
	COMBAT_END: "COMBAT_END",							//战斗结束 							args:null 		**
	COMBAT_SHOW_END: "COMBAT_SHOW_END",				//战斗表演结束
	COMBAT_BEGIN_BEFORE: "COMBAT_BEGIN_BEFORE",		//战斗开始前 							args:null		**
	COMBAT_HP_MP_UPDATE: "COMBAT_HP_MP_CHANGE",		//战斗HP，MP变化 				args:CombatHPMPUpdateEvent			**
	COMBAT_POINT_CHANGE: "COMBAT_POINT_CHANGE",		//战斗HP，MP变化 				args:CombatPointChangeEvent			**
	COMBAT_ROLE_MP_UPDATE: "COMBAT_ROLE_MP_UPDATE",	//战斗中与role相关的数据值变化	args:CombatRoleInfoEvent
	COMBAT_FIGHT_ROUND_UPDATE: "COMBAT_FIGHT_ROUND_UPDATE",	//战斗中回合数更改	args:null

	COMBAT_FIGHT_RESULT_END: "COMBAT_FIGHT_RESULT_END",		//战斗表演结果结束	args:null
	COMBAT_FIGHTER_ADD: "COMBAT_FIGHTER_ADD",			//战斗成员列表接受（开战前加入）	args:CombatFighterAddEvent
	COMBAT_FIGHTER_ADD_EX: "COMBAT_FIGHTER_ADD_EX",	//战斗成员列表接受（不区分战斗中剧情和开战情况）	args:CombatFighterAddEvent

	COMBAT_CLOCK: "COMBAT_CLOCK", 					//战斗倒计时				args:CombatClockEvent
	COMBAT_FIGHT_WIN: "COMBAT_FIGHT_WIN",				//战斗胜利
	COMBAT_FIGHT_LOST: "COMBAT_FIGHT_LOST",				//战斗失败
	COMBAT_FIGHTER_DIEING: "COMBAT_FIGHTER_DIEING",	//战斗成员死亡(服务器）				args:CombatFighterEvent
	COMBAT_FIGHTER_DEAD: "COMBAT_FIGHTER_DEAD",		//战斗成员死亡（客户端）			args:CombatFighterEvent
	COMBAT_FIGHTER_DIE_END: "COMBAT_FIGHTER_DIE_END", //战斗成员死亡（被隐藏）			args:CombatFighterEvent
	COMBAT_FIGHTER_REMOVE: "COMBAT_FIGHTER_REMOVE",	//战斗成员被移除
	COMBAT_FIGHTER_ROMOVE: "COMBAT_FIGHTER_ROMOVE", 	//战斗成员被移除			args:CombatFighterEvent
	COMBAT_FIGHT_SHOW_SKILL: "COMBAT_FIGHT_SHOW_SKILL",//开始发招（吟唱开始）args:CombatFightSkillEvent

	COMBAT_GUIDE_FREEZE: "COMBAT_GUIDE_FREEZE",		//战斗场景冻结时间		args:CombatFreezeEvent
	COMBAT_FIGHT_ATTACK_BIGIN: "COMBAT_FIGHT_ATTACK_BIGIN",		//战斗进攻图开始		args:null
	COMBAT_FIGHT_ATTACK_FINISH: "COMBAT_FIGHT_ATTACK_FINISH",		//战斗进攻图结束		args:null

	COMBAT_FIGHT_VIDEO_APPLY: "COMBAT_FIGHT_VIDEO_APPLY",			//申请战斗录像	args:null
	COMBAT_FIGHT_VIDEO_BEGIN: "COMBAT_FIGHT_VIDEO_BEGIN",			//战斗录像开始	args:null
	COMBAT_FIGHT_RP_FULL: "COMBAT_FIGHT_RP_FULL",					//部下能量满槽	args:CombatFightRpEvent

	COMBAT_FIGHTER_BUFF_UPDATE: "COMBAT_FIGHTER_BUFF_UPDATE",	//战斗角色buff更新	args:FighterBuffEvent
	COMBAT_FIGHTER_CLICK: "COMBAT_FIGHTER_CLICK",				//战斗中点击战斗角色 args:ActorEvent
	COMBAT_FIGHT_CLICK_MAP: "COMBAT_FIGHT_CLICK_MAP",			//战斗中点击地图
	COMBAT_FIGHT_FUNNAL_POINT: "COMBAT_FIGHT_FUNNAL_POINT",	//战斗中翅膀技能能量值更新	args:FunnalPointEvent
	COMBAT_FIGHT_ADD_ALIEN: "COMBAT_FIGHT_ADD_ALIEN",			//战斗中加入翅膀（特殊fighter）
	COMBAT_FIGHT_SPIRIT_CD: "COMBAT_FIGHT_SPIRIT_CD",			//翅膀（浮游炮）的公共CD	args:FunnalCDEvent
	COMBAT_FIGHT_ASSIST_SKILL: "COMBAT_FIGHT_ASSIST_SKILL",	//战斗中援助技能信息列表	args:AssSkillEvent
	COMBAT_FIGHT_SEQUENCE_UPDATE: "COMBAT_FIGHT_SEQUENCE_UPDATE",			//战斗中发招队列		args:FightSequenceEvent
	//COMBAT_LOST												: "COMBAT_LOST",						//战斗失败（通关失败）	args:CombatEndEvent		**
	//COMBAT_WIN												: "COMBAT_WIN", 						//战斗胜利              args:CombatEndEvent
	//COMBAT_TURN_ON_INSTRUCT						: "COMBAT_TURN_ON_INSTRUCT", 		// 战斗指令开启，		args:CombatFightInstructEvent		**
	//COMBAT_SHOW_END										: "COMBAT_SHOW_END",				//战斗表演结束					args:null		**

	//COMBAT_BOUNT_BEGIN								:	"COMBAT_BOUNT_BEGIN",			//战斗回合开始 					args:null
	//COMBAT_BOUNT_END									:	"COMBAT_BOUNT_END",				//战斗回合结束 					args:null
	//COMBAT_FIGHT_RESULT								:	"COMBAT_FIGHT_RESULT",		//收到战斗表演结果列表	args:null
	//COMBAT_FIGHT_RESULT_BEGIN					:	"COMBAT_FIGHT_RESULT_BEGIN",	//战斗表演结果开始	args:null
	//COMBAT_REBEBIN										:	"COMBAT_REBEBIN",					//战斗重连	 						args:null
	//COMBAT_CMDTARGET_CHANGE						:	"COMBAT_CMDTARGET_CHANGE",//战斗指令作用对象改变 args:null

	//COMBAT_FIGHTER_CREATE							:	"COMBAT_FIGHTER_CREATE",	//战斗成员创建			args:CombatFighterCreateEvent

	//COMBAT_SELECT_TARGET_CHANGE				: "COMBAT_SELECT_TARGET_CHANGE",		//战斗选择对象改变
	//COMBAT_AUTO_CHANGE								: "COMBAT_AUTO_CHANGE",			// 自动战斗切换
	//COMBAT_ACTOR_LIST_UPDATE					: "COMBAT_ACTOR_LIST_UPDATE", 		// 战斗玩家修改，args:null
	//////////////////////////////////CampaignEvents//////////////////////////////////////-
	// CAMPAIGN_ARRAY_UPDATE: "CAMPAIGN_ARRAY_UPDATE", 	//出战阵容更新
	CAMPAIGN_PASS: "CAMPAIGN_PASS", 				  //通关（战胜）事件 args:CampaignEvent
	CAMPAIGN_FINISH: "CAMPAIGN_FINISH", 				//通关事件 args:CampaignEvent
	// CAMPAIGN_FIRST_PASS_UPDATE: "CAMPAIGN_FIRST_PASS_UPDATE",//首次通关玩家名称列表更新时间 args:CampaignFirstPassEvent
	// CAMPAIGN_RECORD_LIST: "CAMPAIGN_RECORD_LIST",		//收到已过关卡列表
	EXCITE_LIMIT_CAMPAIGN: "EXCITE_LIMIT_CAMPAIGN",	//个人限时通关
	CAMPAIGN_NOTPASS_SERVER: "CAMPAIGN_NOTPASS_SERVER", //首通未出现 args:CampaignEvent
	// CAMPAIGN_ALTEMATE_UPDATE: "CAMPAIGN_ALTEMATE_UPDATE",	//替补列表更新
	CAMPAIGN_DYNAMIC_ARRAY_UPDATE: "CAMPAIGN_DYNAMIC_ARRAY_UPDATE",		//布阵时的临时阵列更新
	// CAMPAIGN_TEAM_CURCAM: "CAMPAIGN_TEAM_CURCAM",			//当前队伍关卡ID更新

	CAMPAIGN_MINE: "CAMPAIGN_MINE",//关卡暗雷记录
	CAMPAIGN_VEDIO: "CAMPAIGN_VEDIO",//关卡录像

	////////////////////////////////////-VOCATIONER//////////////////////////////////////////////////////
	// VOCATIONER_UNLOCK: "VOCATIONER_UNLOCK", //职业解锁
	// VOCATIONER_INFO: "VOCATIONER_INFO", //职业查询返回
	// VOCATIONER_SET: "VOCATIONER_SET", //职业设置返回
	// VOCATIONER_LIST: "VOCATIONER_LIST",				//职业列表
	// VOCATIONER_HERO: "VOCATIONER_HERO",				//职业信息更新
	// VOC_SKILL_UPGRADE: "VOC_SKILL_UPGRADE",				//职业技能升级
	// VOC_SKILL_SET: "VOC_SKILL_SET",				//职业技能设置
	// VOCATIONER_UPDATE: "VOCATIONER_UPDATE", //职业更新
	// SET_VOCATIONER_COOLDOWN: "SET_VOCATIONER_COOLDOWN", //职业切换时间
	// CLEAN_VOCATIONER_COOLDOWN: "CLEAN_VOCATIONER_COOLDOWN", //清掉职业切换时间

	////////////////////////////////////GROW养成系统////////////////////////////////////
	// GROW_SYS_INFO: "GROW_SYS_INFO",						//养成总体信息
	// GROW_LIST_INFO: "GROW_LIST_INFO",						//养成信息列表
	// GROW_INFO: "GROW_INFO",								//新加养成
	// GROW_BUY_LIVE: "GROW_BUY_LIVE",						//买活力值变化
	// GROW_AUTO_ADD_LIVE: "GROW_AUTO_ADD_LIVE",				//活力值变化
	// GROW_SELECT: "GROW_SELECT",							//选择一个互动
	// GROW_SELECT_FINISH: "GROW_SELECT_FINISH",				//互动完成
	// GROW_SOON_FINISH: "GROW_SOON_FINISH",					//快速完成互动
	// GROW_NEW_EVENT: "GROW_NEW_EVENT", 					//生成一个事件
	// GROW_HANDLE_EVENT: "GROW_HANDLE_EVENT",		 		//选择事件里的一个选项
	// GROW_FINISH_ACTION: "GROW_FINISH_ACTION",				//完成交互增加属性
	// GROW_PRIZE_RECORD: "GROW_PRIZE_RECORD",				//心情奖励记录
	//////////////////////////////////ItemEvents//////////////////////////////////////////-

	//ITEM_LIST													: "ITEM_LIST",							//第一次获得物品列表 args:ItemEvent
	ITEM_UPDATE: "ITEM_UPDATE",						//物品更新 args:ItemUpdateEvent
	//ITEM_UPDATE_LIST									: "ITEM_UPDATE_LIST",				//物品更新List args:ItemUpdateEvent
	ITEM_SELL_LIST: "ITEM_SELL_LIST",					//NPC物品列表 args:ItemSellListEvent
	ITEM_GAIN: "ITEM_GAIN",							//获取新物品
	ITEM_STORE_PET: "ITEM_STORE_PET",         //仓库宠物列表 args:ItemStorePetEvent
	WASH_SUCCESS: "WASH_SUCCESS",           //WASH_SUCCESS洗练装备成功
	EQUIP_RESOLVE_SUCCESS: "EQUIP_RESOLVE_SUCCESS",	//装备分解成功
	GOT_POWDER_BOX: "GOT_POWDER_BOX",         //得到粉末盒子  
	ITEM_SMELT_UPDATE : "ITEM_SMELT_UPDATE", //物品熔炼
	//////////////////////////////////TaskEvents////////////////////////////////////////-
	TASK_ACCPET: "TASK_ACCPET", 				//接受任务 args:TaskEvent
	TASK_UPDATELIST: "TASK_UPDATELIST", 		//任务列表更新 args:null
	TASK_FINISH: "TASK_FINISH", 				//任务完成 args:TaskEvent	
	TASK_FAILED: "TASK_FAILED", 				//任务失败 args:TaskEvent	
	TASK_OVERTIME: "TASK_OVERTIME", 			//任务超时 args:TaskEvent	

	TASK_COMMIT_FINISH: "TASK_COMMIT_FINISH",	//服务器响应任务成功 args:TaskEvent	
	TASK_COMMIT_FAILED: "TASK_COMMIT_FAILED", //服务器响应任务失败 args:TaskEvent	
	TASK_COMMIT_CANCEL: "TASK_COMMIT_CANCEL", //服务器响应任务放弃 args:TaskEvent	

	TASK_TIMER_UPDATE: "TASK_TIMER_UPDATE", 		//任务定时通知 args:null
	TASK_OPTION_ACTIVE: "TASK_OPTION_ACTIVE", 	//任务对话框出现选项列表 args:TaskOptionEvent
	TASK_UPDATE: "TASK_UPDATE", 					//任务动态信息更新 args:TaskUpdateEvent	
	TASK_DIALOGOP: "TASK_DIALOGOP",				//任务触发战斗	args:TaskOpEvent
	TASK_FIGHT_END: "TASK_FIGHT_END",				//任务战斗结束	args:TaskFightEvent

	TASK_GUIDE_EXECUT: "TASK_GUIDE_EXECUT",		//任务引导类事件	args:TaskGuideEvent(暂时只用作师门任务的巡逻操作)
	TASK_DIALOG_TRANSFORM: "TASK_DIALOG_TRANSFORM",//任务对话UI跳转事件	args:TaskDialogEvent

	//活动类任务相关
	LEGION_TASK_REQUEST: "LEGION_TASK_REQUEST",	//军团任务返回当前等冻结时间，取消任务所需晶石	args:LegionTaskEvent
	//////////////////////////////////ChatEvents////////////////////////////////////////-
	CHAT_RECV_CHANNEL_MSG: "CHAT_RECV_CHANNEL_MSG",						//收到频道信息 args:CharRecvChannelMsgEvent
	CHAT_RECV_CHANNEL_MSG_EX: "CHAT_RECV_CHANNEL_MSG_EX",					//收到假频道信息 args:CharRecvChannelMsgEvent
	CHAT_PREVIEW_MSG_UPDATE: "CHAT_PREVIEW_MSG_UPDATE",					//刷新迷你频道 args:ChatPreviewMsgUpdateEvent
	CHAT_CHANNEL_MSG_BROADCAST: "CHAT_CHANNEL_MSG_BROADCAST",
	CHAT_VOICE_RECORD: "CHAT_VOICE_RECORD",						//语音包
	CHAT_VOICE_RECORD_ID: "CHAT_VOICE_RECORD_ID",						//语音包
	NOTICE_FRAME_SHOW: "NOTICE_FRAME_SHOW",		// 公告打开
	NOTICE_FRAME_HIDE: "NOTICE_FRAME_HIDE",		// 公告退出
	ONLINE_QUESTION: "ONLINE_QUESTION",	    // 在线答题

	//////////////////////////////////PetEvents////////////////////////////////////////-
	PET_LIST: "PET_LIST",					//宠物列表获取
	PET_LIST_UPDATE: "PET_LIST_UPDATE",		//宠物列表更新
	PET_UPDATE: "PET_UPDATE", 				//宠物属性更新
	PET_ADD: "PET_ADD", 						//新获得宠物
	PET_SET_COLOR: "PET_SET_COLOR",       //宠物染色返回  args : PetColorResultEvent
	PET_SET_POTENTIAL: "PET_SET_POTENTIAL ",       //宠物染色返回  args : PetPotentialAutoEvent 
	PET_INTERACT_COUNT: "PET_INTERACT_COUNT",						//宠物互动次数
	PET_INTERACT_EVENT_ID: "PET_INTERACT_EVENT_ID",				//宠物互动事件
	PET_INTIMATE_EVENT_ID: "PET_INTIMATE_EVENT_ID",        //宠物亲密度事件
	PET_INVITE_LIST: "PET_INVITE_LIST",
	PET_INVITE_RESULT: "PET_INVITE_RESULT",
	ACTIVATED_PET_UPDATE: "ACTIVATED_PET_UPDATE",         //宠物觉醒 
	APPRECIATE_PET_UPDATE: "APPRECIATE_PET_UPDATE",         //宠物鉴赏解锁
	EVER_OWNED_PET_UPDATE: "EVER_OWNED_PET_UPDATE",         //曾经拥有的宠物解锁   

	PET_UNION_RECORD: "PET_UNION_RECORD", //自己宠物合成     
	PET_UNION_SERVER_RECORD: "PET_UNION_SERVER_RECORD", //全服宠物合成记录

	// PET_UPDATE_QUICK_RECRUIT: "PET_UPDATE_QUICK_RECRUIT",      //剩余挑战次数更新
	// PET_PUSH_EVENT: "PET_PUSH_EVENT",                //推送事件
	// SUCCESS_RATE_UPDATE: "SUCCESS_RATE_UPDATE",           //成功率更新
	// SUCCESS_RATE_UPDATE_FOR_FAILED: "SUCCESS_RATE_UPDATE_FOR_FAILED",//成功率更新

	// PET_EVENT_DELETE_SUCCESS: "PET_EVENT_DELETE_SUCCESS",      //事件删除成功
	// PET_EVENT_FINISH_SUCCESS: "PET_EVENT_FINISH_SUCCESS",      //事件成功
	// //PET_ENTER_HOOP										:"PET_ENTER_HOOP",							  //获取环信息
	// PET_FREE_RECRUIT_COUNT: "PET_FREE_RECRUIT_COUNT",				//快速招募免费挑战次数
	// PET_PASS_BATTLE_EVENT: "PET_PASS_BATTLE_EVENT",         //通过关卡惊喜
	// PET_PUSH_EVENT_PROGRESS_UPDATE: "PET_PUSH_EVENT_PROGRESS_UPDATE",//进度更新
	// PET_BREAK_OUT_EVENT: "PET_BREAK_OUT_EVENT",           //部下突发事件
	// PET_AWAKE_SUCCESS: "PET_AWAKE_SUCCESS",             //觉醒成功                      
	// PET_GOT_A_AWAKE_EQUIP: "PET_GOT_A_AWAKE_EQUIP",         //换上新装备
	// PET_BREAK_OUT_EVENT_FINISH: "PET_BREAK_OUT_EVENT_FINISH",    //完成突发事件
	// PET_RECRUIT_BATE_CONSUME: "PET_RECRUIT_BATE_CONSUME",
	// PET_INVITE_LIST_UPDATE: "PET_INVITE_LIST_UPDATE",
	// PET_COLLECT_PRIZE_INFO: "PET_COLLECT_PRIZE_INFO",        //奖励信息
	// PET_COLLECT_PRIZE_UPDATE: "PET_COLLECT_PRIZE_UPDATE",      //奖励更新
	// ONE_KEY_TURN_RESULT: "ONE_KEY_TURN_RESULT",           //一键转动结果
	// INIT_ALL_PET_COMBATFORCE: "INIT_ALL_PET_COMBATFORCE",
	// SHOW_COMBATFORCE_CHANGED: "SHOW_COMBATFORCE_CHANGED",
	// SHOW_INTERACTION_COST: "SHOW_INTERACTION_COST",         //显示互动消耗
	// PET_ACTIVE_INFO: "PET_ACTIVE_INFO",               //宠物羁绊列表
	// CALL_PET_DISCOUNT: "CALL_PET_DISCOUNT",             //限时召集宠物
	// BREAK_THROUGH_SUCCESS: "BREAK_THROUGH_SUCCESS",         //突破成功
	// PET_REPLACE_SKILL: "PET_REPLACE_SKILL",
	// PET_QUICK_RECRUIT_PRIZE: "PET_QUICK_RECRUIT_PRIZE",       //祭坛奖励
	// PET_HOOP_UPDATE: "PET_HOOP_UPDATE",               //刷新环信息
	// PET_SUMMON_RECORD_LIST: "PET_SUMMON_RECORD_LIST",   		//部下召集次数

	//////////////////////////////////UI Events////////////////////////////////////////
	UI_SHOW_START: "UI_SHOW_START",			// 即将打开某个UI，args : UIShowEvent
	UI_SHOW: "UI_SHOW",						// 打开某个UI，args : UIShowEvent
	UI_HIDE_START: "UI_HIDE_START",						// 即将关闭某个UI，args : UIHideEvent
	UI_HIDE: "UI_HIDE",						// 关闭某个UI，args : UIHideEvent
	UI_CTRL_SHOW: "UI_CTRL_SHOW",				// 打开控件BaseCtrlWnd，args : UIShowEvent
	UI_CTRL_HIDE: "UI_CTRL_HIDE",				// 关闭控件BaseCtrlWnd，args : UIHideEvent

	//////////////////////////////////-MovieEvent//////////////////////////////////////////////////
	MOVIE_BEGIN: "MOVIE_BEGIN",							 // null
	MOVIE_END: "MOVIE_END",								 // null
	//video
	VIDEO_BEGIN: "VIDEO_BEGIN",							 //开始视频播放，args : VideoEvent
	VIDEO_ENG: "VIDEO_ENG",								 //视频播放完毕，args : VideoEvent

	////////////////////////////////-GuideEvent//////////////////////////////////////////////////////
	GUIDE_ACTIVATE_BUTTON: "GUIDE_ACTIVATE_BUTTON",			//功能按钮开启事件
	GUIDE_FUNC_FINISH: "GUIDE_FUNC_FINISH",					//新功能引导结束事件，args:GuideFuncFinishEvent
	GUIDE_FUNC_LIST_UPDATE: "GUIDE_FUNC_LIST_UPDATE",			//新功能引导列表更新事件，args:null
	PET_EMBATTLE_STATE: "PET_EMBATTLE_STATE",								//部下上阵
	GUIDE_FUNC_REFRESH: "GUIDE_FUNC_REFRESH",								//红点刷新
	GUIDE_SERVER_NOTICE: "GUIDE_SERVER_NOTICE",							//简易（红点）事件通知

	////////////////////////////////Friend//////////////////////////////-
	FRIEND_LIST_UPDATE: "FRIEND_LIST_UPDATE",         //	好友列表更新
	SEARCH_PLAYER_RESULT: "SEARCH_PLAYER_RESULT",					// 查找好友结果返回，args:null
	APPLY_TO_FRIEND: "APPLY_TO_FRIEND",          //申请加为好友
	RECIEVE_MESSAGE: "RECIEVE_MESSAGE",       //接受到好友信息
	FRIEND_INFO_UPDATE: "FRIEND_INFO_UPDATE",    //好友信息刷新
	FRIEND_ONOFF_LINE: "FRIEND_ONOFF_LINE",   	 //好友上下线
	ADD_DELETE_MOVE: "ADD_DELETE_MOVE",  		 //添加删除移动
	SEND_MESSAGE_DONE: "SEND_MESSAGE_DONE",			//发送消息成功
	TEMP_SUCCESS_CHAT: "TEMP_SUCCESS_CHAT",       //点击发送聊天并且添加临时好友成功
	RECOMMEND_FRIEND: "RECOMMEND_FRIEND",        //好友推荐
	FRIEND_APPLYLIST_UPDATE: "FRIEND_APPLYLIST_UPDATE",	//好友申请列表更新
	MESSAGE_UPDATE: "MESSAGE_UPDATE",
	OFFLINE_CHAT_MSG: "OFFLINE_CHAT_MSG", 				////-离线聊天
	FRIEND_UNREAD_UPDATE: "FRIEND_UNREAD_UPDATE", 		////-未读消息更新
	FRIEND_DELETE_UPDATE: "FRIEND_DELETE_UPDATE", 		////-消息删除
	FRIEND_CHAT_BTN_UPDATE: "FRIEND_CHAT_BTN_UPDATE", 		////-私聊按钮

	CHAT_GROUP_CREATE: "CHAT_GROUP_CREATE",       //创建好友群聊
	CHAT_GROUP_INVITE_JOIN: "CHAT_GROUP_INVITE_JOIN",   //收到邀请信息
	CHAT_GROUP_AGREE_JOIN: "CHAT_GROUP_AGREE_JOIN",    //同意或者拒绝申请
	CHAT_GROUP_LIST: "CHAT_GROUP_LIST",          //聊天组列表
	CHAT_GROUP_QUERY_MEMBERS: "CHAT_GROUP_QUERY_MEMBERS",  //获取成员列表
	CHAT_GROUP_QUIT: "G2C_CHAT_GROUP_QUIT",       //退出讨论组
	NO_TROUBLE_SETTING: "NO_TROUBLE_SETTING",        //免扰
	CHAT_GROUP_CHAT: "CHAT_GROUP_CHAT",        //群聊消息返回
	CHAT_GROUP_INVITE_LIST: "CHAT_GROUP_INVITE_LIST",     //申请列表
	CHAT_GROUP_REALSE: "CHAT_GROUP_REALSE",          //群聊解散
	SELECT_NO_TROUBLE_SETTING: "SELECT_NO_TROUBLE_SETTING",  //查询免扰
	CHAT_GROUP_EXPELEE: "CHAT_GROUP_EXPELEE",         //开除出群组
	SENT_POWER_LIST: "SENT_POWER_LIST",         //已赠送体力好友
	////////////-黑名单////////-
	BLACK_INFO_LIST: "BLACK_INFO_LIST",   //黑名单列表
	////////////-黑名单 }////////-	
	SERVER_APPLY_STATUS: "SERVER_APPLY_STATUS",   //好友申请状态	


	// //////////////////////-情报//////////////////
	// INTELLIGENCE_PET: "INTELLIGENCE_PET",		 //伙伴情报信息
	// INTELLIGENCE_SKILL: "INTELLIGENCE_SKILL", //伙伴技能信息
	// INTELLIGENCE_STONE: "INTELLIGENCE_STONE", //伙伴天赋石信息


	// //////////////////////-神兵//////////////////
	// IMMORTALS_INFO: "IMMORTALS_INFO",		 //神兵信息
	// IMMORTALS_UPDATE_FIELD: "IMMORTALS_UPDATE_FIELD", //神兵部分更新
	// IMMORTALS_EXP: "IMMORTALS_EXP", //神兵体验
	// IMMORTALS_POWER_NUM: "IMMORTALS_POWER_NUM", //神兵战力预览
	// //////////////////////-重塑//////////////////
	// ONEKEY_INTENSIFY_INFO: "ONEKEY_INTENSIFY_INFO",		//一键重塑信息




	//////////////////////-日常活动//////////////////
	ACTIVITY_STATE_LIST: "ACTIVITY_STATE_LIST",		 //日常活动状态列表更新, args : activityStateEvent
	ACTIVITY_DATA_DISTRIBUTE: "ACTIVITY_DATA_DISTRIBUTE", //日常活动（组队相关）活动信息的分发, args : activityDataEvent

	ACTIVITY_GLOBAL_SERVER_EVENT: "ACTIVITY_GLOBAL_SERVER_EVENT", //全活活动事件

	//////////////////////////////////活动//////////////////////////////////////////-
	ACTIVITY_BUFF_UPDATE: "ACTIVITY_BUFF_UPDATE",						//生活BUFF更新状态
	ACTIVITY_RANK_UPDATE: "ACTIVITY_RANK_UPDATE",						//活动排行榜信息更新 args : RankListEvent
	ACTIVITY_RANK_APPEARDATA_UPDATE: "ACTIVITY_RANK_APPEARDATA_UPDATE",	//活动排行榜外观信息更新
	ACTIVITY_RESET:"ACTIVITY_RESET",	//配置重置
	// EXCITE_DATA: "EXCITE_DATA",										//刺激点信息
	// EVERYDAY_INFO_UPDATE: "EVERYDAY_INFO_UPDATE",						//每日活动信息更新
	// SEVENDAY_TASK_UPDATE: "SEVENDAY_TASK_UPDATE",						//七日任务
	// //////////////////////////////////////模拟进入玩法////////////////////////////
	// ROLE_ENTER_SPACE: "ROLE_ENTER_SPACE",					//进入模拟玩法 args : MessageEvent
	// ROLE_LEAVE_SPACE: "ROLE_LEAVE_SPACE",					//退出模拟玩法

	// PET_AWAKE: "PET_AWAKE",														//觉醒//
	// PET_BREAK: "PET_BREAK",														//突破//
	// PET_SKILL_UPGRADE: "PET_SKILL_UPGRADE",							//技能升级//

	// SET_NATRUAL_STONE: "SET_NATRUAL_STONE",						//镶嵌天赋石//
	// OFF_NATRUAL_STONE: "OFF_NATRUAL_STONE",						//卸下天赋石//
	// NATRUAL_STONE_UP: "NATRUAL_STONE_UP",							//天赋石升级//

	//////////////////////////////////雇佣////////////////////////////////////////////
	// SOLDIER_SELF_LIST_UPDATE: "SOLDIER_SELF_LIST_UPDATE",						//自己雇佣列表更新 args : null
	// SOLDIER_SELF_LIST_CHANGE: "SOLDIER_SELF_LIST_CHANGE",						//自己雇佣列表更新 args : SoldierUpdateEvent
	// SOLDIER_SELF_RELEASE_LIST_UPDATE: "SOLDIER_SELF_RELEASE_LIST_UPDATE",		//自己的出租列表更新 args : null（租出）
	// SOLDIER_SYS_LIST_UPDATE: "SOLDIER_SYS_LIST_UPDATE",							//系统雇佣列表更新 args : null
	// SOLDIER_FAC_LIST_UPDATE: "SOLDIER_FAC_LIST_UPDATE",							//军团雇佣列表更新 args : null
	// SOLDIER_FAC_APPLY_LIST_UPDATE: "SOLDIER_FAC_APPLY_LIST_UPDATE",						//军团雇佣申请列表更新
	// SOLDIER_FAC_SELF_APPLY_LIST_UPDATE: "SOLDIER_FAC_SELF_APPLY_LIST_UPDATE",				//军团雇佣自己申请列表更新
	//////////////////////////////////////////////////////////////////////////////////-
	////////////////////////////////////FairyEvent//////////////////////////////////////////
	//FAIRY_UPDATE                      :"FAIRY_UPDATE",
	//
	//
	////////////////////////////////////ActionEvents////////////////////////////////////////
	//ACTION_LUCK_SELECT_RET                   :  "ACTION_LUCK_SELECT_RET" ,     //每日抽奖返回结果 args : LuckCountEvent
	//ACTION_LUCK_START_RET                   :   "ACTION_LUCK_START_RET"   ,   //每日抽奖返回结果 args : LuckStartEvent
	//
	////////////////////////////////////Skill Events////////////////////////////////////////
	//SKILL_UPDATE											: "SKILL_UPDATE",							// 技能更新，args : null
	// SACRIFICE_UPDATE: "SACRIFICE_UPDATE",							// 技能更新，args : null
	// SKILL_LIST_INFO: "SKILL_LIST_INFO",            //技能列表
	//
	//SKILL_COMBINED_UPDATE							: "SKILL_COMBINED_UPDATE",			//援助技能列表更新，args : CombinedSkillEvent
	////SKILL_SERIES_UPDATE								: "SKILL_SERIES_UPDATE",			// 技能系更新，args : null
	////SKILL_LIVE_LIST_UPDATE					  : "SKILL_LIVE_LIST_UPDATE",		// 生活技能表更新， args:null
	////SKILL_SAVE_UPDATE									: "SKILL_SAVE_UPDATE", 				// 保存快捷栏技能更新， agrs:null
	////SKILL_USE_RESULT									: "SKILL_USE_RESULT",					// 技能使用结果，args:SkillResultEvent
	////////////////////////////////////TeamEvents////////////////////////////////////////////
	TEAM_INFO_UPDATE: "TEAM_INFO_UPDATE",							//队伍信息更新
	TEAM_CREATE: "TEAM_CREATE",										//队伍创建
	TEAM_POS_CHANGE: "TEAM_POS_CHANGE",								//队伍位置变动

	// TEAM_MEMBER_UPDATE: "TEAM_MEMBER_UPDATE",							// 队伍成员更新，args : null
	// TEAM_APPLY_UPDATE: "TEAM_APPLY_UPDATE",			// 队伍申请列表更新，args : null
	// TEAM_LINEUP_UPDATE: "TEAM_LINEUP_UPDATE",			        // 阵型更新更新，args : null
	// TEAM_RECEIVE_INVITE: "TEAM_RECEIVE_INVITE",             //收到组队邀请  args : TeamInviteInfo
	// TEAM_GOAL_UPDATE: "TEAM_GOAL_UPDATE",                //队伍目标变化
	// TEAM_AUTO_MAKE_TEAM: "TEAM_AUTO_MAKE_TEAM",             //自动组队
	// TEAM_UPDATE_MEM_POS: "TEAM_UPDATE_MEM_POS",             //队员位置更新
	// TEAM_MEMBER_ONLINE: "TEAM_MEMBER_ONLINE",             //队员上线
	// TEAM_MEMBER_OFFLINE: "TEAM_MEMBER_OFFLINE",             //队员下线
	// TEAM_MEMBER_NOTICE: "TEAM_MEMBER_NOTICE",             //队长发给队员的通知
	// TEAM_ADD: "TEAM_ADD",							//加入队伍
	// TEAM_WILL_LIST_UPDATE: "TEAM_WILL_LIST_UPDATE",		//组队意愿列表
	// TEAM_MEMBER_LEAVE: "TEAM_MEMBER_LEAVE",					//队员离队
	// TEAM_DISBAND: "TEAM_DISBAND",														//队伍解散
	// TEAM_ACTIVITY_QUERY: "TEAM_ACTIVITY_QUERY",			//队伍列表返回
	// G2C_TEAM_COMBAT_QUEUE: "G2C_TEAM_COMBAT_QUEUE",		//队伍战斗队列返回
	// TEAM_STATE_SET: "TEAM_STATE_SET",		//设置队伍类型
	//	
	////////////////////////////////////TradeCenterEvents////////////////////////////////////////////
	//TRADECENTER_ALLPETLIST_UPDATE           : "TRADECENTER_ALLPETLIST_UPDATE",   //收到宠物列表更新
	//TRADECENTER_BUY_RET                     : "TRADECENTER_BUY_RET",             //购买宠物返回
	//TRADECENTER_SELL_RET                    : "TRADECENTER_SELL_RET",             //出售宠物返回
	////TRADECENTER_PETLIST_UPDATE            : "TRADECENTER_PETLIST_UPDATE",      //收到同种宠物列表更新
	//TRADECENTER_ITEMLIST_UPDATE             : "TRADECENTER_itemList_UPDATE",      //发送物品列表到客户端
	//TRADECENTER_ITEM_SALE_RET               : "TRADECENTER_ITEM_SALE_RET",      //出售物品返回
	//TRADECENTER_ITEM_BUY_RET              	: "TRADECENTER_ITEM_SALE_RET",      //购买物品返回
	//TRADECENTER_ITEM_INFO_UPDATE            : "TRADECENTER_ITEM_INFO_UPDATE",      //自己的寄售信息
	//TRADECENTER_ITEM_SELL_OK								: "TRADECENTER_ITEM_SELL_OK",				// 寄售物品成功卖出
	//TRADECENTER_SELECT_PET_LIST_UPDATE			: "TRADECENTER_SELECT_PET_LIST_UPDATE",				// 选择宠物获取列表
	//TRADECENTER_SHOW_PET_INFO								: "TRADECENTER_SHOW_PET_INFO",			//显示寄售宠物信息					
	////////////////////////////////////TeamEvents////////////////////////////////////////////
	//BUFF_UPDATE												: "BUFF_UPDATE",							// BuffUpdateEvent, args : actor, buff	
	//LIVE_BUFF_UPDATE									: "LIVE_BUFF_UPDATE",					// 生活buff更新，args:null
	//LIVE_BUFF_ALIVE_UPDATE						: "LIVE_BUFF_ALIVE_UPDATE",		// 生活BUFF生活周期更新，args:null
	////////////////////////////////////-FlyEvent////////////////////////////////////////////////
	//FLY_UPDATE												: "FLY_UPDATE",								//null
	//
	//
	//
	//
	////////////////////////////////-LingshiShopEvent////////////////////////////////////////////////
	// SHOP_DEAL_LIST: "SHOP_DEAL_LIST",		 // ItemLingshiListEvent, args:itemList
	// SHOP_DEAL_ITEM: "SHOP_DEAL_ITEM",		 // 交易所单个物品的信息
	// SHOP_DEAL_SELL_LIST: "SHOP_DEAL_SELL_LIST",	   // ItemLingshiListEvent, args:itemList
	// SHOP_DEAL_LIMIT: "SHOP_DEAL_LIMIT",			//更新交易所物品限购数量
	// SHOP_UPDATE:"SHOP_UPDATE",
	//
	//
	//////////////////////////////////-MakeEvent//////////////////////////////////////////////////////////\
	//ITEM_MAKE_DRAWING_UPDATE        : "ITEM_MAKE_DRAWING_UPDATE", 	//生产图纸列表更新事件
	//DRUG_MAKING_RESULT							: "DRUG_MAKING_RESULT",					//炼药结果，args:DrugMakingResultEvent
	//	////////////////////////////////-EquipEvent//////////////////////////////////////////////////////////\
	//
	//EQUIP_IDENTIFY_SUCCESS							: "EQUIP_IDENTIFY_SUCCESS",					//鉴定结果，args:EquipIdentifySuccessResultEvent
	//EQUIP_MAKE_SUCCESS							    : "EQUIP_MAKE_SUCCESS",					//鉴定结果，args:EquipMakeSuccessResultEvent
	//	

	//EQUIP_ALL_CAST: "EQUIP_ALL_CAST",	//一键重塑结果

	//////////////////////////////////Server Level//////////////////////////////////////////////////////////
	//SERVER_LEVEL_UPDATE						  : "SERVER_LEVEL_UPDATE",					//服务器等级更新
	//
	//
	//TRADE_TARGET_UPDATE							: "TRADE_TARGET_UPDATE",					// 交易金钱修改，args:MoneyUpdateEvent
	//////////////////////////////////Shop//////////////////////////////////////////////////////////////////////
	//SHOP_GET_DATA							: "SHOP_GET_DATA",					// 获取商城列表，args:GetShopItemListEvent
	//RECHARGE_LIST             : "RECHARGE_LIST",           // 获取充值列表, args:GetRechargeListEvent
	//UPDATE_SHOP_DATA          : "UPDATE_SHOP_DATA",         // 更新商城列表
	//
	//////////////////////////////////-Rank////////////////////////////////////
	//RANK_LIST_UPDATE								: "RANK_LIST_UPDATE",							// 排行列表更新, args:null
	//RANK_PET_INFO										: "RANK_PET_INFO",								// 排行榜查看宠物，args:null 
	//////////////////////////////////
	// 
	//ATTENDANCE_INFO  								: "ATTENDANCE_INFO",         //-每日签到
	//ATTENDANCE_DAY  								: "ATTENDANCE_DAY",          //-签到
	//ATTENDANCE_REWARD               : "ATTENDANCE_REWARD",
	////////////////////////////////////其他////////////////////////////////////
	//TONGJI_LIST_UPDATE							: "TONGJI_LIST_UPDATE",					// 通缉犯列表更新，args:TongjiListEvent
	//ARENA_TEAM_LIST_UPDATE					: "ARENA_TEAM_LIST_UPDATE", 		// 擂台队伍列表更新
	//NEXTNEWNOTICE                   : "NEXTNEWNOTICE",              //下一条系统公告
	//LIBAO_TIME_UPDATE								: "LIBAO_TIME_UPDATE",					//在线礼包更新
	//ONLINE_TICK_TACK								: "ONLINE_TICK_TACK",						//在线时间秒数刷新
	//ZAIXIAN_QIANGDA                 : "ZAIXIAN_QIANGDA",						//在线抢答
	EVERYDAYONLINE_UPDTAE: "EVERYDAYONLINE_UPDTAE",       //每日签到
	UPDATE_WELFARE: "UPDATE_WELFARE",							//福利更新
	//ZHANGBU_CARD                 		: "ZHANGBU_CARD",								//占卜卡片
	//PET_ICON_BUTTON_VISIBLE					: "PET_ICON_BUTTON_VISIBLE", 		//部下头像提示按钮，args:PetIconButtonEvent
	//UPDATE_EXCHANGE_CODE_BTN				: "UPDATE_EXCHANGE_CODE_BTN", 		//成功激活邀请码后刷新兑换码界面
	//UPDATE_INVITE_RECHARGE_NUM			: "UPDATE_INVITE_RECHARGE_NUM", 		//被邀请者首充后刷新邀请人的界面
	//UPDATE_ACTIVITY_TIME_FRAME			: "UPDATE_ACTIVITY_TIME_FRAME", 		//刷新活动时间提示界面
	//
	//////////////////////////////////
	//  //////////////////////////////////修炼系统////////////////////////////////////
	//GET_PRACTICE_LIST               : "GET_PRACTICE_LIST" ,           // 获取修炼列表  args:GetPracticeListEvent
	//GET_PRACTICE_REWARD             : "GET_PRACTICE_REWARD",          //获取修炼奖励  args:GetPracticeRewardtEvent
	//	  //////////////////////////////////-公会系统////////////////////////////////////
	GET_CLUB_INFO: "GET_CLUB_INFO",                //获取公会信息 
	GET_CLUB_LIST: "GET_CLUB_LIST",                //获取公会列表 
	 
	//GET_CLUB_SINGLE_INFO            : "GET_CLUB_SINGLE_INFO",         //获取某个公会信息 args : GetClubSingleInfoEvent
	// UPDATE_CLUB_NOTICE              : "UPDATE_CLUB_NOTICE",            //更新公告
	GET_CLUB_MENBER_LIST: "GET_CLUB_MENBER_LIST",          //公会成员列表
	UPDATE_CLUB_INTRO: "UPDATE_CLUB_INTRO",								//跟新公会介绍
	UPDATE_CLUB_MEINFO: "UPDATE_CLUB_MEINFO",								//更新自己的信息（建立、退出、职位变动发送） args:ClubSelfUpdateEvent
	GET_CLUB_MYAPPLY_LIST: "GET_CLUB_MYAPPLY_LIST",			//个人申请公会列表
	CLUB_CHOOSE_ITEM: "CLUB_CHOOSE_ITEM",						//公会团长分配物品次数
	REFRESH_ALLOR_RECORD: "REFRESH_ALLOR_RECORD",	     //刷新仓库分配信息
	CLUB_REPO_UPDATE: "CLUB_REPO_UPDATE",				//军团仓库
	//新加
	ALL_CLUB_LIST: "ALL_CLUB_LIST",				//所有公会
	GET_CLUB_APPLY_LIST: "GET_CLUB_APPLY_LIST",          //获取公会人员申请列表
	UPDATE_CLUB_NOTICE              : "UPDATE_CLUB_NOTICE",            //更新公告
	UPDATE_APPLY_INFO              : "UPDATE_APPLY_INFO",            //更新申请列表

    CLUB_EVENT_RECORD              : "CLUB_EVENT_RECORD",            //帮会记录

	CLUB_RENQI_INFO              		: "CLUB_RENQI_INFO",            //帮会人气信息
	CLUB_PLAYER_ACTIVE_INFO             : "CLUB_PLAYER_ACTIVE_INFO",            //玩家活跃信息
	CLUB_SKILL_INFO                     : "CLUB_SKILL_INFO",            //帮会技能
	


	//////////////////////////////////////公会副本//////////////////////////-
	//SEALED_GROUND_ENTER										: "SEALED_GROUND_ENTER",						//进入封印之地
	//SEALED_GROUND_LEAVE										: "SEALED_GROUND_LEAVE",						//离开封印之地
	// SEALED_GROUND_UPDATA: "SEALED_GROUND_UPDATA",						//封印之地更新
	// SEALED_GROUND_CREATE: "SEALED_GROUND_CREATE",						//创建封印之地
	//SEALED_GROUND_RANK										: "SEALED_GROUND_RANK",							//军团副本通关排名

	//////////////////////////////////////帮会任务/////////////////////////-
	CLUB_TASK_FINISH_REFRESH: "CLUB_TASK_FINISH_REFRESH",             //帮会任务完成一次
	CLUB_TASK_PRIZE_REFRESH: "CLUB_TASK_PRIZE_REFRESH",               //帮会任务领奖
	CLUB_EXCHANGE: "CLUB_EXCHANGE",                                   //帮会兑换

	//
	//    //////////////////////////////////-竞技场////////////////////////////////////////////-
	//CHAMPION_TOP_RANK: "CHAMPION_TOP_RANK", 							//竞技场最高排名
	CHAMPION_REFRESH: "CHAMPION_REFRESH",								//竞技场刷新
	//CHAMPION_REFRESH_EX: "CHAMPION_REFRESH_EX",								//竞技场晶石刷新
	////GET_BATTLE_QUEUE							  : "GET_BATTLE_QUEUE",								//得到出战队列
	//FIGHT_CHAMPION_RECORD						:"FIGHT_CHAMPION_RECORD",					//竞技场对战记录 args:DailyActivityEvent
	//GET_CLUB_STUDY_SKILL_LIST       : "GET_CLUB_STUDY_SKILL_LIST",      //跟新研究技能
	//
	//
	// 
	//DAILY_ACTIVITY_START						: "DAILY_ACTIVITY_START",						 // 日常活动开始 args:DailyActivityEvent
	//DAILY_ACTIVITY_STOP							: "DAILY_ACTIVITY_STOP",						 // 日常活动结束 args:DailyActivityEvent
	//DAILY_ACTIVITY_RECORD_UPDATE		: "DAILY_ACTIVITY_RECORD_UPDATE",		 // 日常活动记录更新 args:DailyActivityEvent
	//DAILY_ACTIVITY_ENTER_FLOOR			: "DAILY_ACTIVITY_ENTER_FLOOR",		 	 // 爬塔进入楼层 		 args:DailyActivityEvent
	//
	//////////////////////////////////////排行榜////////////////////////////////////////-
	TOLLGATE_FIRSTPASS_LIST: "TOLLGATE_FIRSTPASS_LIST",	     //刷新全服关卡首通名单args:FirstPassListEvent
	//OTHER_PET_INFO			           : "OTHER_PET_INFO",	     //排行榜点击查看他人宠物信息args:OtherPetInfoEvent
	//
	//
	//////////////////////////////////////装备抽奖////////////////////////////////////////-
	//EQUIP_LOTTO_ONCE								: "EQUIP_LOTTO_ONCE",	        //装备抽奖一次args:EquipLottoEvent
	//EQUIP_LOTTO_UPDATE_TIME					: "EQUIP_LOTTO_UPDATE_TIME",	 //装备抽奖更新args:RankListEvent
	//
	//////////////////////////////////////活动抽奖////////////////////////////////////////-
	//ACTIVITY_LOTTO_ONCE								: "ACTIVITY_LOTTO_ONCE",	        //活动抽奖一次args:EquipLottoEvent
	//ACTIVITY_RECHARGE_LIMIT						: "ACTIVITY_RECHARGE_LIMIT",			//限时充值回馈
	//ACTIVITY_LOTTO_SEVERINFO					: "ACTIVITY_LOTTO_SEVERINFO",	    //抽奖跨服信息args:info
	//
	//////////////////////////////////////天空之塔////////////////////////////////////////-
	//SKYTOWER_TOP_RANK								: "SKYTOWER_TOP_RANK",								//天空之塔最高排名 args:SkytowerTopRankEvent
	//SKYTOWER_PRIZE									: "SKYTOWER_PRIZE",									//天空之塔领取宝箱 args:SkytowerPrizeEvent
	//DAILY_PREPARE_STATUS						:"DAILY_PREPARE_STATUS",							//天空之塔组队备战 args:DailyPrepareStatusEvent
	//TEAM_SPACE_MOVE								:"TEAM_SPACE_MOVE",										//天空之塔领取宝箱 args:TeamSpaceMoveEvent
	//ENTER_TOWER										:"ENTER_TOWER",											//进入天空之塔
	//SKYTOWER_INVITE_LIST					:"SKYTOWER_INVITE_LIST",						//天空之塔邀请列表
	//SKYTOWER_PRIZE_CHOOSE					:"SKYTOWER_PRIZE_CHOOSE",						//天空之塔奖励选择
	//
	////////////////////////////////////////活动////////////////////////////////////////////-
	//DAILY_ENTER_NOTICE							:"DAILY_ENTER_NOTICE"	,							//广播进入活动 args:DailyEnterNoticeEvent
	//DAILY_ENTER_NOTICE_RET					:"DAILY_ENTER_NOTICE_RET"	,					//队员确认进入活动 args:DailyEnterNoticeRetEvent
	//
	//ACTIVITY_WEEK					:"ACTIVITY_WEEK"	,					//周年庆活动查询
	//
	//
	////////////////////////////////////////邮件////////////////////////////////////////////-
	MAIL_LIST: "MAIL_LIST",  //邮件列表
	MAIL_READ: "MAIL_READ",  //邮件已读
	//
	//
	////////////////////////////////////////混沌世界////////////////////////////////////////////-
	// ROBBER_ENTER: "ROBBER_ENTER",										//进入混沌世界
	// ROBBER_LEAVE: "ROBBER_LEAVE",										//离开混沌世界
	// ROBBER_TIME_REFRESH: "ROBBER_TIME_REFRESH",										//BOSS、密钥刷新事件

	// ROBBER_KILLER_LIST: "ROBBER_KILLER_LIST",							//仇人列表

	// ROBBER_TEMPLE_APPEAR: "ROBBER_TEMPLE_APPEAR",							//魔盒外观
	// ROBBER_PRIZE_STATIS: "ROBBER_PRIZE_STATIS",										//圣地奖励统计

	//ROBBER_LAYER_UPDATA							:"ROBBER_LAYER_UPDATA",							//混沌世界层更新
	//ROBBER_KILLCOUNT_UPDATE 				:"ROBBER_KILLCOUNT_UPDATE",					//混沌世界击杀数更新
	//ROBBER_KILLLIST_UPDATE 					:"ROBBER_KILLLIST_UPDATE",					//混沌世界复仇列表更新
	//ROBBER_TEST_ENTER 							:"ROBBER_TEST_ENTER",								//混沌世界是否符合进入
	//ROBBER_FRAME_UPDATE 						:"ROBBER_FRAME_UPDATE",							//混沌世界界面刷新
	//ROBBER_KILL_POS									:"ROBBER_KILL_POS",									//混沌世界仇人位置
	//ROBBER_STATUE_STATUS_REMOVE			:"ROBBER_STATUE_STATUS_REMOVE",			//混沌世界开启神社雕像移除状态
	//KILLPEOPLE_STATUS_UPDATE			  :"KILLPEOPLE_STATUS_UPDATE",			  //混沌世界杀人状态刷新
	//ROBBER_STATUE_STATUS_REFRESHLAYER			  :"ROBBER_STATUE_STATUS_REFRESHLAYER",			  //混沌世界状态刷新
	//BROKENHISTROY_UPDATE_BOSS_REFRESH_TIME			  :"BROKENHISTROY_UPDATE_BOSS_REFRESH_TIME",			  //混沌世界BOSS刷新时间返回刷新
	//BROKENHISTROY_RECV_ROOMLIST			  :"BROKENHISTROY_RECV_ROOMLIST",			  //混沌世界副本列表
	//ROBBER_RECV_LOTTERY			  			:"ROBBER_RECV_LOTTERY",			  			//混沌世界时空碎片兑换结果
	//UPDATE_DOUBLE_TIME			  			:"UPDATE_DOUBLE_TIME",			  			//双倍时间
	//AUTO_ONLINE			  			       :"AUTO_ONLINE",			  			//离线挂机
	//CAN_ONLINE			  			       :"CAN_ONLINE",			  			//能否离线挂机	
	//
	// ROBBER_HANG_STATUS_UPDATE: "ROBBER_HANG_STATUS_UPDATE",										//挂机状态更新
	// OFFLINE_HANG_INFO: "OFFLINE_HANG_INFO",										//离线挂机设置信息更新
	// ROBBER_HANG_FIGHT_BEGIN: "ROBBER_HANG_FIGHT_BEGIN",							//挂机状态开始战斗
	// OFFLINE_INCOME_TIPS: "OFFLINE_INCOME_TIPS",							//离线挂机
	// //
	////////////////////////////////////////终极魔女////////////////////////////////////////////-
	// BIG_BOSS_QUERY: "BIG_BOSS_QUERY",								//BOSS活动查询
	// BIG_BOSSHP_UPDATE: "BIG_BOSSHP_UPDATE",							//BOSS血量更新
	// BIG_BOSS_LEAVE: "BIG_BOSS_LEAVE",								//离开大BOSS
	// BIG_BOSS_PLAYER_DAMAGE_RANK: "BIG_BOSS_PLAYER_DAMAGE_RANK",		//大BOSS玩家信息更新
	// BIG_BOSS_PLAYER_REVIVE: "BIG_BOSS_PLAYER_REVIVE",				//大BOSS玩家复活
	// BIG_BOSS_PLAYER_ENTER: "BIG_BOSS_PLAYER_ENTER",					//进入大BOSS活动
	// BIG_BOSS_DAMAGE_RANK: "BIG_BOSS_DAMAGE_RANK",					//大BOSS击杀与伤害排行
	// BIG_BOSS_REFRESH_BUFFTIME: "BIG_BOSS_REFRESH_BUFFTIME",			//大BOSS鼓舞倒计时
	// BIG_BOSS_FIGHTING_RANK: "BIG_BOSS_FIGHTING_RANK",				//大BOSS战时伤害排行
	//
	////////////////////////////////////////-答题////////////////////////////////
	//ACTIVITY_QUESTION_ENTER         :"ACTIVITY_QUESTION_ENTER",         //活动进入
	ACTIVITY_QUESTION: "ACTIVITY_QUESTION",               //问题索引
	ACTIVITY_QUESTION_INFO: "ACTIVITY_QUESTION_INFO",          //答题玩家信息     
	ACTIVITY_QUESTION_RESULT: "ACTIVITY_QUESTION_RESULT",        //答题结果
	//ACTIVITY_QUESTION_LEAVE         :"ACTIVITY_QUESTION_LEAVE",         //答题退出
	ACTIVITY_QUESTION_STATE: "ACTIVITY_QUESTION_STATE",         //答题是否持续
	//
	////////////////////////////////////-拖动结束//////////////////////////-
	//SLIDER_EVENT_END								:"SLIDER_EVENT_END",								//拖动结束
	//
	//
	////////////////////////////////////-晶石兑换金币列表更新//////////////////////////-	
	//JINGSHI_CHANGE_LIST_UPDATA: "JINGSHI_CHANGE_LIST_UPDATA",								//晶石兑换金币列表更新
	//
	////////////////////////////////////-接收消息事件 用于提醒哪些按钮有叹号//////////////////
	//
	GET_MESSAGE: "GET_MESSAGE",					//收到网络消息 args:GetMessageEvent
	//WND_UPDATE_BTN_TIPS				:"WND_UPDATE_BTN_TIPS"	,					//收到网络消息 args:wndUpdateBtnTipsEvent
	//
	////////////////////////////////////-冲值 可能是买晶石或买号角//////////////////////////-
	//PAY_RETURN														: 	"PAY_RETURN", //客户端 调用sdk 充值返回
	PAY_FORM_GAME_SERVER: "PAY_FORM_GAME_SERVER", //经游戏服验证后 从游戏服返回结果
	//PLAYER_CREAT_TIME											: 	"PLAYER_CREAT_TIME",
	//PAY_BACK_SERVER												: 	"PAY_BACK_SERVER", //服务器返回充值返利
	//
	////////////////////////////////////-分享//////////////////////////////////////
	//SHARE_RETURN													:		"SHARE_RETURN",//客户端 调用sdk 分享返回
	//SHARE_FORM_GAME_SERVER								:		"SHARE_FORM_GAME_SERVER",//分享后 服务器返回奖励
	SHARE_SYS_UPDATE			: "SHARE_SYS_UPDATE",//分享关注之类的信息有变化
	//
	////////////////////////////////////-刺激点//////////////////////////////
	//EXCITE_SERVER_FIRST_CAMPAIGN					:"EXCITE_SERVER_FIRST_CAMPAIGN" ,//关卡首通
	//////////////////////////////////
	//////////////////////////////////////招募动画////////////////////////////
	//GET_PET_ANIMATION											:"GET_PET_ANIMATION" ,				//招募动画
	//////////////////////////////////////jjc 动画////////////////////////////
	//WINDOW_ANIMATION_STATE								: "WINDOW_ANIMATION_STATE", 		//窗口动画	
	//
	//////////////////////////////////////魔导石////////////////////////////
	//GEM_POWER_VALUE_UPDATE								: "GEM_POWER_VALUE_UPDATE",								//魔导石能量值跟新									
	//GEM_UPDATA														: "GEM_UPDATA",														//魔导石能量值跟新									
	//GEM_ENTER_VALUE_UPDATA								: "GEM_ENTER_VALUE_UPDATA",								//魔导石注入能量									
	//MAGIC_STONE_LEVEL_UPDATE          : "MAGIC_STONE_LEVEL_UPDATE",       			//所有魔导仪等级									
	//CURRENT_MAGIC_STONE_LEVEL_UPDATE      : "CURRENT_MAGIC_STONE_LEVEL_UPDATE",			//当前魔导仪等级  									  
	//
	//////////////////////////////////////遗迹探索////////////////////////////
	// RELIC_LEAVE: "RELIC_LEAVE",											//撤离
	// RELIC_LIST_REFRESH: "RELIC_LIST_REFRESH",								//矿洞列表
	// RELIC_ONE_REFRESH: "RELIC_ONE_REFRESH",										//单个矿洞
	// RELIC_MY_REFRESH: "RELIC_MY_REFRESH",									//我的矿洞
	// RELIC_LOCK: "RELIC_LOCK",												//锁定矿洞
	// RELIC_DEFEND_LIST: "RELIC_DEFEND_LIST",									//我的矿洞
	// RELIC_MAX_RANK_LIST: "RELIC_MAX_RANK_LIST",									//最大收益榜
	// RELIC_TEAM_LIST: "RELIC_TEAM_LIST",					//进攻队列
	//////////////////////////////////////武斗大会//////////////////////////-
	//WARFARE_STAGE_UPDATE									: "WARFARE_STAGE_UPDATE",						//大会阶段更新
	//WARFARE_APPLYLIST_REC									: "WARFARE_APPLYLIST_REC",					//武斗大会报名名单接收
	//

	////////////////////////////////////////玩家名片//////////-
	//PLAYER_CARD_SET 											: "PLAYER_CARD_SET",						//玩家名片设置
	//PLAYER_CARD_GET 											: "PLAYER_CARD_GET",						//玩家名片获取
	//
	////////////////////////////////////////开服时间////////////
	//GAME_SERVER_START_TIME                : "GAME_SERVER_START_TIME",
	//////////////////////////////////////新装备系统////////////////////////
	//EQUIP_RESET_RETURN										: "EQUIP_RESET_RETURN",			//装备重铸
	//EQUIP_RESET_CHOOSE_RETURN							: "EQUIP_RESET_CHOOSE_RETURN",			//装备重铸确认返回
	//
	//////////////////////////////////////角色其他相关////////////////////////////
	//ROLE_INVITE_LIST: "ROLE_INVITE_LIST",				//邀请列表args:RoleInviteListEvent
	//ROLE_HONOR_UPDATE                     : "ROLE_HONOR_UPDATE",      //荣誉称号列表
	//
	//////////////////////////-黑市////////////////
	//BLACK_MARKET_LIST_RETURN 							: "BLACK_MARKET_LIST_RETURN" ,   //黑市列表
	//////////////////////////-光明神殿////////////////
	//LIGHT_TEMPLE_ENTER : "LIGHT_TEMPLE_ENTER",  //进入
	//LIGHT_TEMPLE_LEVEL : "LIGHT_TEMPLE_LEVEL",	//退出
	//LIGHT_TEMPLE_PLAYER_INFO : "LIGHT_TEMPLE_PLAYER_INFO",	//玩家信息
	//LIGHT_TEMPLE_MAP_INFO : "LIGHT_TEMPLE_PLAYER_LIST",	//地图信息
	//LIGHT_TEMPLE_BUFF_INFO : "LIGHT_TEMPLE_BUFF_INFO",	//地图信息
	//
	////////////////////////-七日任务//////////////-
	//SEVEN_DAY_PRIZE_INFO : "SEVEN_DAY_PRIZE_INFO",	//信息
	//SEVEN_DAY_GET_PRIZE : "SEVEN_DAY_GET_PRIZE",	//领取信息
	//
	//
	//PUSH_ACTIVITY_REFRESH : "PUSH_ACTIVITY_REFRESH", //刷新推送活动主界面图标
	//
	//
	//军团战
	// FACTION_WAR_ENTER_MAP: "FACTION_WAR_ENTER_MAP",  //军团战进入地图
	// FACTION_WAR_LEAVE_MAP: "FACTION_WAR_LEAVE_MAP",  //军团战离开地图
	// FACTION_WAR_APPLY: "FACTION_WAR_APPLY",  //军团战报名
	// FACTION_WAR_APPLY_LIST: "FACTION_WAR_APPLY_LIST",  //军团战报名列表
	// FACTION_WAR_READY_INFO: "FACTION_WAR_READY_INFO",  //军团战准备返回
	// FACTION_WAR_SCORES_LIST: "FACTION_WAR_SCORES_LIST",  //军团战积分情况
	// FACTION_WAR_TREE_INFO: "FACTION_WAR_TREE_INFO",  //军团战进程信息 树状结构
	// FACTION_WAR_SCORE_LIST: "FACTION_WAR_SCORE_LIST",  //军团积分情况
	// FACTION_WAR_FLAG_INFO: "FACTION_WAR_FLAG_INFO",  //军团旗帜
	// FACTION_WAR_FLAG_ADD_RETURN: "FACTION_WAR_FLAG_ADD_RETURN",  //军团旗帜
	// FACTION_WAR_GET_STATUS: "FACTION_WAR_GET_STATUS",  //军团战状态
	// FACTION_WAR_SENIOR_QUEUE: "FACTION_WAR_SENIOR_QUEUE", //设置精英赛参战人员列表
	// FACTION_WAR_SENIOR_READY: "FACTION_WAR_SENIOR_READY", //准备开始精英战//
	// FACTION_WAR_QUERY_SEN_RED: "FACTION_WAR_QUERY_SEN_RED", //精英赛准备情况//
	// FACTION_WAR_FLAG_NUM: "FACTION_WAR_FLAG_NUM", //军团战旗子
	// FACTIONWAR_SENIOR_ABORT: "FACTIONWAR_SENIOR_ABORT", //精英赛因为对方没有设备取消

	//
	//////////////////军团联盟////////////-
	//FACTION_UNION_APPLY : "FACTION_UNION_APPLY" ,  //军团联盟
	//FACTION_UNION_ENTER : "FACTION_UNION_ENTER" ,  //加入联盟
	//FACTION_UNION_LEVEL : "FACTION_UNION_LEVEL" ,  //退出联盟
	//FACTION_UNION_UPDATE : "FACTION_UNION_UPDATE" ,  //军团信息更新
	//////////////////军团联盟 }////////////-

	//
	//////////////////迷雾森林//////////////
	//ENTER_MI_WU_SEN_LIN : "ENTER_MI_WU_SEN_LIN" ,  //进入迷雾森林
	//LEAVE_MI_WU_SEN_LIN : "LEAVE_MI_WU_SEN_LIN" ,  //离开迷雾森林
	//JUMP_TO_NEXT_LAYER  : "JUMP_TO_NEXT_LAYER",    //跳到下一层 
	//FINISH_PLAYING_JUMP_EFFECT : "FINISH_PLAYING_JUMP_EFFECT",//跳层动画结束
	//JUMP_TO_NEXT_LAYER_NOW : "JUMP_TO_NEXT_LAYER_NOW",
	//RECV_ZERO_ERROR_PASS   : "RECV_ZERO_ERROR_PASS",
	//
	////////////////////-血盟(VIP小战队)////////////////-
	// QUERY_TEAM_LIST: "QUERY_TEAM_LIST",          //查询战队列表
	// QUERY_APPLY_LIST: "QUERY_APPLY_LIST",        //查询申请列表
	// QUERY_MEMBER_LIST: "QUERY_MEMBER_LIST",      //查询成员列表
	// VIP_TEAM_INFO_UPDATE: "VIP_TEAM_INFO_UPDATE",//小团队信息更新
	// QUERY_PRIZE_STATUS: "QUERY_PRIZE_STATUS",//血盟-羁绊奖励领取
	//
	//////////////////////充值活动////////////
	PAY_ACTIVITY_UPDATE: "PAY_ACTIVITY_UPDATE", //充值活动更新
	PAY_ACTIVITY_LIST: "PAY_ACTIVITY_LIST", //充值活动列表
	PAY_ACTIVITY_INFO: "PAY_ACTIVITY_INFO", //充值活动信息
	PAY_ACTIVITY_AWARD: "PAY_ACTIVITY_AWARD",   //充值大奖
	PAY_ACTIVITY_SELLPET: "PAY_ACTIVITY_SELLPET",   //伙伴直购
	PAY_ACTIVITY_MONTH_CARD: "PAY_ACTIVITY_MONTH_CARD",   //月卡信息
	PAY_ACTIVITY_WEEK_CARD: "PAY_ACTIVITY_WEEK_CARD",   //周卡信息
	//
	//////////////////////////-迷惑宫殿//////////
	//
	//PUZZLE_PALACE_BEST_RECORD : "PUZZLE_PALACE_BEST_RECORD",  //最高纪录
	//
	////////////////////////守护////////////////
	// DEFEND_UPDATE: "DEFEND_UPDATE",                  //守护更新
	// DEFEND_REFINE_UPDATA: "DEFEND_REFINE_UPDATA",    //守护炼化
	// //SERVER_RETURN_BOOK : "SERVER_RETURN_BOOK",    //技能书返回
	// ICON_FLY_EVENT: "ICON_FLY_EVENT",            //植入技能特效
	// ADD_SKILL_EFFECT_FINISH: "ADD_SKILL_EFFECT_FINISH",
	////////////////////////异界邀请////////////
	//INVITE_RETURN : "INVITE_RETURN",
	//SUPER_CALL_SHARE_RECORD : "SUPER_CALL_SHARE_RECORD", //异界邀请攻略返回
	//SUPER_CALL_PRAISE_RECORD : "SUPER_CALL_PRAISE_RECORD", //异界邀请点赞
	////////////////////-改名
	ROLE_CHANGE_NAME: "PLAYER_ROLE_CHANGE_NAME", //改名成功返回
	////////////////////-晋升成功
	//JIN_SHENG_SUCCESS : "JIN_SHENG_SUCCESS",
	//
	//
	//
	//PLAYER_RETURN_PRIZE_UPDATE : "PLAYER_RETURN_PRIZE_UPDATE", //老用户回归刷新
	//ACTIVITY_RETURN_UPDATE : "ACTIVITY_RETURN_UPDATE", //活动信息返回刷新
	//
	//CONTINUOUS_LOGIN_PRIZE_UPDATE : "CONTINUOUS_LOGIN_PRIZE_UPDATE", //连续登录奖励刷新
	//CONTINUOUS_LOGIN_ACTIVITY_UPDATE : "CONTINUOUS_LOGIN_ACTIVITY_UPDATE", //连续登录活动信息返回刷新
	//
	//SERVER_RETURN_TEN_BOOKS : "SERVER_RETURN_TEN_BOOKS", //技能书抽奖十连抽
	//FRAME_BTN_TIPS_UPDATE : "FRAME_BTN_TIPS_UPDATE", //界面红点刷新
	//
	//VIP_SING_IN_ACTIVITY_UPDATE : "VIP_SING_IN_ACTIVITY_UPDATE", //豪华签到活动信息返回刷新
	//VIP_SING_IN_PRIZE_UPDATE : "VIP_SING_IN_PRIZE_UPDATE", //豪华签到奖励返回刷新
	//HERO_COURAGE_QUALITY_UPDATE : "HERO_COURAGE_QUALITY_UPDATE", //角色魄力品质
	//
	//PET_INHERIT_SUCCESS : "PET_INHERIT_SUCCESS",   //继承成功
	//PET_POINT_RETURN : "PET_POINT_RETURN",         //服务器返回属性点
	//HERO_PET_SOUL_POINT_UPDATE : "HERO_PET_SOUL_POINT_UPDATE", //碎魂更新
	//
	//FORMATION_UNLOCK_SUCCESS : "FORMATION_UNLOCK_SUCCESS",   //战阵解锁成功
	//FORMATION_UPDATE_SUCCESS : "FORMATION_UPDATE_SUCCESS",   //战阵升级成功
	//
	//ZA_JIN_DAN_GET_PRIZE : "ZA_JIN_DAN_GET_PRIZE",           //砸蛋抽奖返回
	//
	//DAILY_AIM_INFO_LIST : "DAILY_AIM_INFO_LIST",           //开工目标列表返回
	//DAILY_AIM_GET_DATA : "DAILY_AIM_GET_DATA",           //领奖返回
	//
	//
	//////////////////////////-坐骑////////////////////////////-
	//RIDE_INFO_LIST: "RIDE_INFO_LIST", //更新坐骑信息列表

	//
	//PLAYER_MASK_UNBLOCK_LIST : "PLAYER_MASK_UNBLOCK_LIST",    //面具列表
	//
	//RIDE_EQUIP_REQUEST : "RIDE_EQUIP_REQUEST",               //坐骑装备列表
	//
	//FEED_INFO : "FEED_INFO",                                 //坐骑喂养列表
	//
	//RIDESUCCESS_INFO : "RIDESUCCESS_INFO",                   //坐骑激活成功
	//
	//////////////////////////结婚////////////////////////////////////-
	//
	//MARRIED_INFO : "MARRIED_INFO",                                  //结婚
	//SEX_INFO : "SEX_INFO",                                  //性别
	//CANREL_INFO : "CANREL_INFO",                                  //是否同步
	//FLOWER_INFO : "FLOWER_INFO",                                  //是否举行婚礼
	////ISMARRY_INFO : "ISMARRY_INFO",                                  //是否举行婚礼
	//AUTO_FEED : "AUTO_FEED",                                 //自动喂养
	//////////////////-拍卖行//////////////-
	//AH_ITEM_UPDATE : "AH_ITEM_UPDATE", //拍卖物品刷新
	//AH_MY_BUY_LIST_UPDATE : "AH_MY_BUY_LIST_UPDATE", //我的竞拍
	//AH_MY_RECORD_UPDATE : "AH_MY_RECORD_UPDATE", ////我的竞拍记录
	//////////-军团红包////////////////////
	//LEGION_RED_PACKET_LIST : "LEGION_RED_PACKET_LIST",//军团红包
	////////////////////////-溶解//////////////////////////-
	RESOLVE_ITEM_INIT: "RESOLVE_ITEM_INIT",  //初始化结果
	// RESOLVE_ITEM_LIB: "RESOLVE_ITEM_LIB",    //初始化物品库
	RESOLVE_ITEM_RESULT: "RESOLVE_ITEM_RESULT", //抽奖结果

	// ROLE_HOMEPAGE_INFO: "ROLE_HOMEPAGE_INFO", //个人主页信息
	// HOMEPAGE_UPLOAD_ICON: "HOMEPAGE_UPLOAD_ICON", //上传头像
	// MESSAGEBOARD_INFO: "MESSAGEBOARD_INFO", //留言板信息
	// ROLE_HOMEPAGE_IS_CAN_CREAT: "ROLE_HOMEPAGE_IS_CAN_CREAT", //设置礼物创建超链接

	// RECV_GODSWAR_INFO: "RECV_GODSWAR_INFO", //众神之战(是否开启，我的阵型)
	// RECV_GODSWAR_DETAIL_INFO: "RECV_GODSWAR_DETAIL_INFO", //众神之战阵营详细信息
	// RECV_BATTLE_RECORD: "RECV_BATTLE_RECORD", //众神之战战斗记录
	// RECV_RANK_INFO: "RECV_RANK_INFO", //众神之战排行榜
	INVITE_PRIZE_INFO: "INVITE_PRIZE_INFO",//邀请码奖励信息
	INVITE_FRIENDS_NUM: "INVITE_FRIENDS_NUM",//邀请好友
	// SPECIAL_EVENT_FINISH_LIST: "SPECIAL_EVENT_FINISH_LIST",//彩蛋完成列表（惊喜事件列表）
	CHAT_UNLOCK_BUBBLE_LIST: "CHAT_UNLOCK_BUBBLE_LIST",//已解锁气泡
	// FACWAR_AUTO_APPLY_STATUS: "FACWAR_AUTO_APPLY_STATUS",//公会战自动报名
	// FAC_TASK_LIST_UPDATE: "FAC_TASK_LIST_UPDATE",//公会任务列表
	// FAC_TASK_ONE_UPDATE: "FAC_TASK_ONE_UPDATE",//公会任务单条
	// FAC_TASK_POINT_RANK_UPDATE: "FAC_TASK_POINT_RANK_UPDATE",//公会任务积分排行
	// FAC_TASK_WEEK_POINT_UPDATE: "FAC_TASK_WEEK_POINT_UPDATE",//公会任务本周累计积分
	// FAC_TASK_TREASURE_LIST_UPDATE: "FAC_TASK_TREASURE_LIST_UPDATE",//公会任务藏宝阁列表
	// FAC_TASK_TREA_RECORD_UPDATE: "FAC_TASK_TREA_RECORD_UPDATE",//公会任务藏宝阁分配记录
	// FAC_TASK_RANK_RESULT_LIST: "FAC_TASK_RANK_RESULT_LIST",//公会任务结算排行

	//////////////////////神兽//////////////////////-
	// ANIMAL_LEVEL_UPDATA: "ANIMAL_LEVEL_UPDATA", //神兽升级
	// ANIMAL_POWER_UPDATA: "ANIMAL_POWER_UPDATA", //神兽下一级战力
	// ANIMAL_EXPER_OVER: "ANIMAL_EXPER_OVER",	//神兽体验结束

	///////////////////////通用更新/////////////////////
	PET_FUN_INFO_REFRESH: "PET_FUN_INFO_REFRESH", //更新全部数据
	PET_FUN_INFO_UPDATE: "PET_FUN_INFO_UPDATE", //更新局部数据
	PET_FUN_TOP_UPDATE : "PET_FUN_TOP_UPDATE", //更新顶部

	///////////////////////仙侣////////////////////////
	ACTOR_XIANLV_UPDATE : "ACTOR_XIANLV_UPDATE", //仙侣更新
	ACTOR_XIANLV_LIST_UPDATE : "ACTOR_XIANLV_LIST_UPDATE", //仙侣list

	//////////////////////角色////////////////////////
	ACTOR_ROLE_FASHION_CLICK : "ACTOR_ROLE_FASHION_CLICK",
	ACTOR_ROLE_UPDATE :  "ACTOR_ROLE_UPDATE" ,
	ACTOR_ROLE_EQUIP_UPDATE :  "ACTOR_ROLE_EQUIP_UPDATE" ,
	ACTOR_ROLE_FABAO_UPDATE :  "ACTOR_ROLE_FABAO_UPDATE" ,
	ACTOR_FABAO_FENJIE_UPDATE : "ACTOR_FABAO_FENJIE_UPDATE",
	ACTOR_ROLE_TAOZHUANG_UPDATE : "ACTOR_ROLE_TAOZHUANG_UPDATE",             //角色套装
 	ROLE_SKILL_LEVEL_LIST : "ROLE_SKILL_LEVEL_LIST", //角色技能等级
	ROLE_EQUIP_ORDER_LIST : "ROLE_EQUIP_ORDER_LIST", //技能设置次序
	ROLE_RIDE_INFO : "ROLE_RIDE_INFO",           //角色坐骑返回
	ROLE_RIDE_INFO_UPDATE : "ROLE_RIDE_INFO_UPDATE",  //角色坐骑更新
	ROLE_WING_INFO : "ROLE_RIDE_INFO",           //角色翅膀返回
	ROLE_WING_INFO_UPDATE : "ROLE_RIDE_INFO_UPDATE",  //角色翅膀更新
	ACTOR_ROLE_TITLE_UNLOCK : "ACTOR_ROLE_TITLE_UNLOCK",
	ACTOR_ROLE_FASHION_UNLOCK : "ACTOR_ROLE_FASHION_UNLOCK",
	PALYER_OFFINE_REFRESH : "PALYER_OFFINE_REFRESH",
	
	/////////////////////////锻造///////////////////
	FORGE_UPDATE : "FORGE_UPDATE",

	////////////////////////天仙///////////////////
	TIANXIAN_UPDATE : "TIANXIAN_UPDATE",

	///////////////////////商店/////////////////
	SHOP_FUN_UPDATE : "SHOP_FUN__UPDATE",

	////////////////////寻宝///////////////
	XUNBAO_UPDATE : "XUNBAO_UPDATE",

	////////////////////福利大厅///////////////
	XIYOU_WELFARE : "XIYOU_WELFARE",

	////////////////////活动BOSS/副本事件///////////////
	BOSSACTIVITY_INFO : "BOSSACTIVITY_INFO",

	/////////////////日常/////////////
	DAILYACTIVITY_INFO : "DAILYACTIVITY_INFO",

	////////////////////结婚响应///////////////
	MARRY_UPDATE : "MARRY_UPDATE",

	////////////////////房子///////////////
	HOUSE_UPDATE : "HOUSE_UPDATE",
	HOUSE_ADVANCE_UPDATE : "HOUSE_ADVANCE_UPDATE",

	////////////////////师徒///////////////
	SHITU_UPDATE : "SHITU_UPDATE",
	SHITU_APPLY_LIST : "SHITU_APPLY_LIST",

	////////////////////武林大会///////////
	WULIN_RANK_INFO : "WULIN_RANK_INFO",
	WULIN_INFO_UPDATE : "WULIN_INFO_UPDATE",

    /////////////////////VIP//////////////
	VIP_PRIZE_UPDATE: "VIP_PRIZE_UPDATE",

	//通用自动升级失败返回
	FUN_AUTO_FAIL : "FUN_AUTO_FAIL",

	//护送
	ESCORT_UPDATE : "ESCORT_UPDATE",

	//天下第一
	PEERLESS_UPDATE: "PEERLESS_UPDATE",
	//据点
	STRONGHOLD_UPDATE: "STRONGHOLD_UPDATE",
	STRONGHOLD_RECORD_UPDATE: "STRONGHOLD_RECORD_UPDATE",
	STRONGHOLD_KEY_STATUS_UPDATE: "STRONGHOLD_KEY_STATUS_UPDATE",
	STRONGHOLD_CLUB_NUM_UPDATE: "STRONGHOLD_CLUB_NUM_UPDATE",

	//宠物飞升
	PET_FLY_UPGRADE_ERROR: "PET_FLY_UPGRADE_ERROR",

	//神魂更新
	SHENHUN_UPGRADE : "SHENHUN_UPGRADE",
	//猎魂
	LIEHUN_RESULT : "LIEHUN_RESULT",
}
