
//引擎输出的全局对象
var IGlobal:GBStruct;
interface GBStruct {
	//全局实例
	rootNode : egret.DisplayObjectContainer;
	stage	 : egret.Stage;
	netSystem : core.NetSystem;
	guiManager: gui.GuiManager;
	imageSet: gui.ImageSet;
	fontSet:  gui.FontSet;
	animSet:  gui.AnimSet;

	resManager: core.ResManager;
	resGroupManager: core.ResGroupManager;

	mapManager: map.MapManager;
	spriteMangaer : map.LogicSpriteManager;

	soundManager: core.SoundManager;

	setting	:UserSetting;
	httpClient : core.HttpClient; //http发送
	config: core.ConfigFile;
	sdkHelper:SdkHelper;
	gameSdk:core.GameSdk;
	//全局变量
	stageWidth: number;
	stageHeight: number;
	//设计分辨率
	contentWidth:number;
	contentHeight:number;

	errorReport :core.ErrorReport;
}

var GAME_NORMAL = 1;
var GAME_TEST = 2;
var GAME_TOOL = 3;

var TOOL_MODE =1;


var GAME_MODE = GAME_NORMAL;
var GAME_DEBUG = true;
var GAME_GUIDE = true;
var GAME_FRCORD = false;

var GAME_FRESH = false; //true是审核版本


//游戏流程定义
var PRECEDURE_VERSION_UPDATE				= 19; //验证版本，更新下载
var PRECEDURE_LOADING						= 20; //加载阶段
var PRECEDURE_LOGIN							= 22; //连接登陆服
var PRECEDURE_GAME							= 25; //连接游戏服


var Event_STAGE_RESIZE = "Event_STAGE_RESIZE";


var SdkEventDefine = {
	 ACTIVE_APP					: "ACTIVE_APP",// 激活
	 APP_UPDATE					: "APP_UPDATE",//更新app

	 CHECK_VERSION_BEGIN			: "CHECK_VERSION_BEGIN", //检测版本号开始
	CHECK_VERSION_FINISH		: "CHECK_VERSION_FINISH",//检测版本号结束
	
	DEFINE_RES_BEGIN			: "DEFINE_RES_BEGIN", //定义资源开始
	DEFINE_RES_FINISH			: "DEFINE_RES_FINISH",//定义资源结束

	DOWNLOAD_RES_BEGIN 			: "DOWNLOAD_RES_BEGIN",//下载资源开始 
	DOWNLOAD_RES_REJECT 		: "DOWNLOAD_RES_REJECT",//下载资源开始 
	DOWNLOAD_RES_FINISH			: "DOWNLOAD_RES_FINISH",//下载资源完成
	
	FIRST_LOADING_BEGIN 		: "FIRST_LOADING_BEGIN",//首次加载开始
	FIRST_LOADING_FINISH		: "FIRST_LOADING_FINISH",//首次加载完成
	
	SERVER_LIST_BEGIN				: "SERVER_LIST_BEGIN",// 服务器列表完成
	SERVER_LIST_FINISH			: "SERVER_LIST_FINISH",// 服务器列表完成
	
	SDK_LOGIN_SCRIPT_FINISH	: "SDK_LOGIN_SCRIPT_FINISH",// sdk脚本返回
	
	BRIDGE_BEGIN			: "BRIDGE_BEGIN",	// 桥连接开始
	BRIDGE_FINISH			: "BRIDGE_FINISH",// 桥连接结束
	
	LOGIN_CONNET_BEGIN			: "LOGIN_CONNET_BEGIN",	// 登陆服连接开始
	LOGIN_CONNET_FINISH			: "LOGIN_CONNET_FINISH",// 登陆服连接结束

	CREATE_ROLE_FINISH 			: "CREATE_ROLE_FINISH",//	创建角色完成
	
	GAME_LOADING_BEGIN 		: "GAME_LOADING_BEGIN",//游戏加载开始
	GAME_LOADING_FINISH		: "GAME_LOADING_FINISH",//游戏加载完成
	
	ENTER_GAMESVR_BEGIN 					: "ENTER_GAMESVR_BEGIN",//进入服务器开始
	ENTER_GAMESVR_FINISH 					: "ENTER_GAMESVR_FINISH",//进入服务器结束
	
	
	ACCOUNT_AUTH_BEGIN 			: "SdkLogin",//登陆开始
	ACCOUNT_AUTH_FINISH 		: "SdkLoginReturn",//登陆返回
	
	SDK_PAY_BEGIN 					: "SdkPay",//开始支付
	SDK_PAY_FINISH 					: "SdkPayReturn",//支付返回
}

var SdkMode =
{
	Officiail 		: 1, //官方
	ThirdPartySDK 	: 2 //第三方SDK
}

var SdkFunctionDefine ={

	RuntimeScriptFinish	: "RuntimeScriptFinish",//runtime初始化完成
	RuntimeCopyClipboard	: "RuntimeCopyClipboard",//runtime复制到粘贴版


	SetPlayerInfo 			: "SetPlayerInfo", //设置玩家信息
	VisitorBind 				: "VisitorBind",//绑定游客 content:param
	QueryVisitorBindState : "QueryVisitorBindState", //查询绑定账号状态
	FBLogin 						: "FBLogin",//facebook登陆
	FBLogout 						: "FBLogout",//facebook登出
	FBShare 						: "FBShare",//facebook分享 title:param&explain:param&desc:param&jump_url:param
	FBInviteFriendsInfo : "FBInviteFriendsInfo",//facebook获取好友信息
	FBInvite 						: "FBInvite",//facebook邀请好友 text:param&ids:param
	LineShareText 			: "LineShareText",//line 分享文本 text:param
	LineShareImage			: "LineShareImage",//line 分享图片 image:param
	ShowServiceView			: "ShowServiceView",//显示客服界面 param　空
	
	
	AddNotification 		: "AddNotification",//添加通知 id:param&notificationId:param&msg:param&delayTime:param&times:param&cycleTime:param
	RemoveNotification	: "RemoveNotification",//移除通知 id:param
	
	
	OnCreateRole 			: "OnCreateRole", //创建角色
	OnLevelUp 				: "OnLevelUp", //角色升级
	OnEnterGame 			: "OnEnterGame", //进入游戏

	PickImageAndSave        : "PickImageAndSave", //从图库或摄像头选择一个图片保存到指定地方
	
	OnMemeryWarning	: "OnMemeryWarning",//引擎通知逻辑，内存紧张
	
}



var ZipFileListDefine ={
	LoginZip : "config_login.zip", //登陆必须

	ConfigZip : "config.zip", //表单配置
	ConfigUIZip : "config_ui.zip", //ui配置
	ConfigMapZip : "config_map.zip", //地图配置
}