var SERVERLIST_TAG = 1
var NOTICE_TAG = 2


enum StateType {
	GOOD = 1,
	BUSY = 2,
	FULL = 3,
	UNABLE = 4,
}

var ServerConfig:any = {};

class LoginSystem extends BaseSystem implements core.IHttpCallback {

	serverListCallback: ()=>void;
	selectedServerIndex: number;
	selectedServerGroup: number;
	targetserverid: number;
	_authType: string;

	tempUserName: string;
	tempPassWord: string;
	//lastSelectedServerIndex: number;
	retryBridgeAuthTimes: number;

	bQuickLogin: boolean;
	bAutoLogin: boolean;


	mRoleList: LoginRole[];
	loginRoleInfo: LoginRole;
	saveLastLoginRoleID: number;


	noticeContent: any;
	noticeCallback: Function;

	mServerRoleList:any[];

	historyGameGroupList:string[]

	public initObj(...params: any[]): void {
		this.targetserverid = -1;
		this.serverListCallback = null;
		this.selectedServerIndex = -1;
		this.selectedServerGroup = -1;

		this.bQuickLogin = false;
		this.bAutoLogin = false;

		this.retryBridgeAuthTimes = 0;
		this.saveLastLoginRoleID = 0;

		this.mRoleList = [];

		this.noticeContent = null;

		this.mServerRoleList = []
	}

	destory() {

	}

	setAutoLogin(b) {
		this.bAutoLogin = b;
	}

	isAutoLogin() {
		return this.bAutoLogin;
	}

	setQuickLogin(b: boolean): void {
		this.bQuickLogin = b
	}

	isQuickLogin(): boolean {
		return this.bQuickLogin;
	}

	//获取公告
	requestNotice(callback: () => void) {
		//callback();

		//锁定屏幕
		FireEvent(EventDefine.MSG_WAIT_BEGIN, ClientWaitEvent.newObj(true, Localize_cns("LOGIN_GET_NOTICE_INFO"), true))
		this.noticeCallback = callback

		//更新公告 modify:yangguiming
		let qd_key = SdkHelper.getInstance().getStringConfigDef("QD_Key")

		let urlMap: any = {
			// ["openxlive"] : "http://center.wp.nwzr.net/nwzr/common/get_update_notice.php",
			// ["tongios"]		:	"http://center.ios.nwzr.net/nwzr/common/get_update_notice.php",
			// ["haimaios"]	:	"http://center.ios.nwzr.net/nwzr/common/get_update_notice.php",
			// ["xyzsios"]		:	"http://center.ios.nwzr.net/nwzr/common/get_update_notice.php",
			// ["aisiios"]		:	"http://center.ios.nwzr.net/nwzr/common/get_update_notice.php",
			// ["downjoyios"]:	"http://center.ios.nwzr.net/nwzr/common/get_update_notice.php",
			// ["itoolios"]	:	"http://center.ios.nwzr.net/nwzr/common/get_update_notice.php",
			// ["kyios"]			:	"http://center.ios.nwzr.net/nwzr/common/get_update_notice.php",
			// ["bdios"]			:	"http://center.ios.nwzr.net/nwzr/common/get_update_notice.php",
			// ["baijinios"]	:	"http://center.ios.nwzr.net/nwzr/common/get_update_notice.php",		
			// ["baijin"]	  :	"http://center.tw.nwzr.net/nwzr/common/get_update_notice.php",		
			// ["flyfish"]   : "http://center.tw.nwzr.net/nwzr/common/get_update_notice.php",
		}

		let noticeUrl = urlMap[qd_key] || ""
		if (noticeUrl == "") {
			noticeUrl = SdkHelper.getInstance().getStringConfigDef("PublicNoticeUpdateUrl")
		}

		//let serverinfo = LoginSystem.getInstance().getRecentLoginServerInfo()
		//let zoneId = serverinfo.ServerID
		let recentGameId = LoginSystem.getInstance().getSelectServerGameID()
		let zoneId = recentGameId
		let allUrl = noticeUrl + "?platform=" + qd_key + "&zoneid=" + zoneId
		TLog.Debug(allUrl)
		//let noticeUrl = SdkHelper.getInstance().getStringConfigDef("noticeUrl")
		if (noticeUrl == "") {
			FireEvent(EventDefine.MSG_WAIT_END, null)
			if (this.noticeCallback) {
				this.noticeCallback()
			}
		} else {
			IGlobal.httpClient.send(allUrl, this, NOTICE_TAG)
		}
	}

	getServerRoleList(){
		return ServerConfig['lastEnter']
		//return this.mServerRoleList
	}

	requestServerList(callback: () => void) {
		FireEvent(EventDefine.MSG_WAIT_BEGIN, ClientWaitEvent.createObj(true, Localize_cns("LOGIN_GET_SERVERLIST_INFO"), true))
		var serverListUrl = SdkHelper.getInstance().getStringConfigDef("ServerUrl");
		if(g_isExaming){
			serverListUrl = serverListUrl + "test"
		}
		
		let authorInfo = GameAccount.getInstance().getAuthorInfo()

		//h5的code随便设
		let localCode = "1"		
		
		serverListUrl = serverListUrl + "&code="+ localCode + "&openid="+authorInfo.userId + "&qdKey=" + authorInfo.qdKey + "&qdcode=" + authorInfo.code1;
		TLog.Debug("saveLocalServerInfo", serverListUrl)
		
		IGlobal.httpClient.send(serverListUrl, this, SERVERLIST_TAG)
		this.serverListCallback = callback;
	}
	
	getGameGroupByIndex(index:number):number[]{
		//let gameList = ServerConfig['gameList']
		//if (gameList != null){
		//	let beginIndex = 0
		//	for (let i in gameList) {
		//		let gameinfo = gameList[i]
		//		let id = gameinfo.id
		//		let num = gameinfo.groupNum
		//		if (index >= beginIndex && index < (beginIndex + num)){
		//			return [id, index - beginIndex]
		//		}else{
		//			beginIndex = beginIndex + num
		//		}
		//	}
		//}

		let serverInfo = ServerConfig.serverList[index]
		if (serverInfo != null){
			return [serverInfo.gameId, serverInfo.groupIndex]
		}
		//return [0,0]
		//retrun [1]
	}
	
	getServerIndexByGameGroup(gameId:number, groupIndex:number):number{
		let gameList = ServerConfig['gameList']
		if (gameList != null){
			let beginIndex = 0
			for (let i in gameList) {
				let gameinfo = gameList[i]
				let id = gameinfo.id
				let num = gameinfo.groupNum
				if (id >= gameId){
					return beginIndex + groupIndex
				}else{
					beginIndex = beginIndex + num
				}
			}
		}
		return 0
	}

	getServerInfoByGameGroup(gameId:number, groupIndex:number){
		let gameInfo = ServerConfig.gameList[gameId]
		let serverIndex = gameInfo.beginServerIndex + groupIndex
		if (gameId <= 1000){
			 return ServerConfig.testServerList[serverIndex]
		}
		return ServerConfig.serverList[serverIndex]
	}

	getServerNameByGameGroup(gameId:number, groupIndex:number):string{
		let serverInfo = this.getServerInfoByGameGroup(gameId, groupIndex)
		if (serverInfo == null){
			return ""
		}
		let regionName = ""
		let gameInfo = ServerConfig.gameList[gameId]
		if (gameId <= 1000){
			regionName = gameInfo.connectName
			if(g_isExaming){
				regionName = ""
			}
			return regionName + " S" + (serverInfo.groupIndex + 1)
		}else{
			regionName = this.getServerRegionName(serverInfo.regionIndex)
			return regionName + " S" + (serverInfo.indexInRegion + 1)
		}

		//let index = this.getServerIndexByGameGroup(gameId, groupIndex)
		//let eachServerInRegion = ServerConfig['serverInfo']['eachNum']
		//let regionIndex = Math.floor(index/eachServerInRegion)
		//let serverId = index - regionIndex * eachServerInRegion
		//return this.getServerRegionName(regionIndex) + " S" + (serverId + 1)
	}

	getServerNumEachRegion(){
		let eachServerInRegion = ServerConfig['serverInfo']['eachNum']
		return eachServerInRegion
	}

	getNewestGameGroup():number[]{
		if (ServerConfig['openInfo'] == null){
			return
		}
		let beginGameGroup = ServerConfig['openInfo']['beginIndex']
		if (beginGameGroup == null){
			return
		}
		let beginGame = beginGameGroup[0]
		let beginGroup = beginGameGroup[1]
		let gameList = ServerConfig['gameList']
		let newGameId = -1
		let newGroupIndex = -1
		if (gameList != null){
			for (var i in gameList) {
				var gameinfo = gameList[i]
				if (gameinfo['id'] <= beginGame){
					newGameId = gameinfo['id']
					newGroupIndex = gameinfo['groupNum'] - 1
					if (gameinfo['id'] == beginGame){
						if (newGroupIndex >= beginGroup){
							newGroupIndex = beginGroup - 1
						}
					}
				}
			}
		}
		return [newGameId, newGroupIndex]	
	}

	getServerRegionNum(){
		//let servernum = 0
//
		//let beginGameGroup = ServerConfig['openInfo']['beginIndex']
		//let beginGame = beginGameGroup[0]
		//let beginGroup = beginGameGroup[1]
//
		//let gameList = ServerConfig['gameList']
		//if (gameList != null){
		//	for (var i in gameList) {
		//		var gameinfo = gameList[i]
		//		if (gameinfo['id'] == beginGame){
		//			servernum = servernum + beginGroup
		//			break
		//		}else if (gameinfo['id'] < beginGame){
		//			servernum = servernum + gameinfo['groupNum']
		//		}
		//	}
		//}
		let servernum = 0
		if (ServerConfig.serverList != null){
			servernum = ServerConfig.serverList.length
		}
		let eachServerInRegion = ServerConfig['serverInfo']['eachNum']
		let regionNum = Math.ceil(servernum/eachServerInRegion)
		return regionNum
	}

	getServerRegionName(i:number):string {
		let serverInfo = ServerConfig['serverInfo']
		if (serverInfo != null){
			let nameList = serverInfo['nameList']
			if (nameList != null){
				return nameList[i] || ""
			}
		}
		return "";
	}

	getServerGameInfo(gameId:number){
		let gameList = ServerConfig['gameList']
		if (gameList != null){
			for (var i in gameList) {
				var gameinfo = gameList[i]
				if (gameinfo['id'] == gameId){
					return gameinfo
				}
			}
		}
	}
	
	//如果有合服 则返回合服的
	getConnectGameInfo(gameId:number){
		let gameinfo = this.getServerGameInfo(gameId)
		if (gameinfo == null){
			return;
		}
		if (gameinfo.toid == gameinfo.id){//如果没有合服就返回这个gameinfo
			return gameinfo;
		}
		//合服了,则返回合服之后的gameinfo
		return this.getServerGameInfo(gameinfo.toid);
	}

	parseJson(jsonInfo): any {
		var serverConfig:any = {};

		if (jsonInfo == null) {
			TLog.Error("LoginSystem.parseJson null");
			return serverConfig;
		}

		//StateType = {
		//  GOOD = 1,
		//  BUSY = 2,
		//  FULL = 3,
		//  UNABLE = 4,
		//}			
		//1,				2[服务器名]	3					4				5							6[用来排序]	7[1表示推荐]　8[1表示新服]	9 StateType
		//serverId, serverName, ip, 					port, 	connectName, 	orders, 	recommend, 		new, 				crowd 
		//["2",			"主干",			"10.0.0.254",	"7739",	"trunk",				"1",		"0",					"1",				"2"],
		
		let SERVER_INFO_KEY = "serverInfo";
		let EACH_NUM_KEY = "eachNum";
		let NAME_LIST_KEY = "nameList";
		let LAST_ENTER_KEY = "lastEnter";

		serverConfig[SERVER_INFO_KEY] = jsonInfo.serverInfo;
		if (serverConfig[SERVER_INFO_KEY] == null)
		{
			serverConfig[SERVER_INFO_KEY] = {}
		}
		if (serverConfig[SERVER_INFO_KEY][EACH_NUM_KEY] == null)
		{
			serverConfig[SERVER_INFO_KEY][EACH_NUM_KEY] = 50;
		}
		if (serverConfig[SERVER_INFO_KEY][NAME_LIST_KEY] == null)
		{
			let namelist = [];
			for (let i = 0; i < 10; ++i){
				namelist.push("S"+(1+ i * 50)+"~S"+(i+1)*50)
			}
			serverConfig[SERVER_INFO_KEY][NAME_LIST_KEY] = namelist
		}

		let OPEN_INFO_KEY = "openInfo";
		let BEGIN_INDEX_KEY = "beginIndex";
		//let MAINTAIN_LIST_KEY = "maintainList";
		let MAINTAIN_TEXT_KEY = "maintainText";	
		
		serverConfig[OPEN_INFO_KEY] = jsonInfo.openInfo;
		if (serverConfig[OPEN_INFO_KEY] == null){
			serverConfig[OPEN_INFO_KEY] = {}
		}
		if (serverConfig[OPEN_INFO_KEY][BEGIN_INDEX_KEY] == null){
			serverConfig[OPEN_INFO_KEY][BEGIN_INDEX_KEY] = [2000,2000]
		}
		//if (serverConfig[OPEN_INFO_KEY][MAINTAIN_LIST_KEY] == null){
		//	serverConfig[OPEN_INFO_KEY][MAINTAIN_LIST_KEY] = []
		//}		
		//维护列表
		//let maintainList = serverConfig[OPEN_INFO_KEY][MAINTAIN_LIST_KEY] 

		let beginGameGroup = serverConfig[OPEN_INFO_KEY][BEGIN_INDEX_KEY]
		let beginOpenGame = beginGameGroup[0]//开到第几个gameSever
		let beginOpenGroup = beginGameGroup[1]//开到这个gameServer的第几个组
		//每一组有多少个服
		let eachServerInRegion = serverConfig[SERVER_INFO_KEY][EACH_NUM_KEY]

		let gameListConfig = jsonInfo.gameList
		let gameList = {};
		let beginIndex = 0;//第几个服。从0开始
		let regionIndex = 0;//在第几个组.
		let indexInRegion = 0;//在组里排第几个
		let serverList = []
		let testBeingIndex = 0;
		let testRegionIndex = 0;
		let testIndexInRegion = 0;
		let testServerList = []
		for (let i in gameListConfig) {
			let jsonGameInfo = gameListConfig[i];

			let gameInfo: any = {};
			//[4, 4,"193.112.16.237",27001,"yixiuxyt1", "1.0.0", 3],
			gameInfo.id = jsonGameInfo[0];
			gameInfo.toid = jsonGameInfo[1];//合服到哪个ID
			gameInfo.ip = jsonGameInfo[2];
			gameInfo.port = jsonGameInfo[3];
			gameInfo.connectName = jsonGameInfo[4];
			gameInfo.version = jsonGameInfo[5] || "1.0.0";
			gameInfo.groupNum = jsonGameInfo[6] || 10;
			let gamestatus = jsonGameInfo[7] || 1;

			//1.良好2.繁忙3.爆满4.维护
			gameInfo.maintain = (gamestatus == 4);
			//if (maintainList.length > 0){
			//	gameInfo.maintain = table_isExist(maintainList, gameInfo.id) 
			//}
			
			gameList[gameInfo.id] = gameInfo
			if (gameInfo.id <= 1000){
				gameInfo.beginServerIndex = testBeingIndex
				for (let i = 0; i < gameInfo.groupNum; ++i){
					let serverInfo:any = {}
					serverInfo.gameId = gameInfo.id
					serverInfo.id = testBeingIndex
					serverInfo.regionIndex = testRegionIndex
					serverInfo.indexInRegion = testIndexInRegion
					serverInfo.groupIndex = i
					serverInfo.isnew = false
					serverInfo.maintain = false
					serverInfo.version = gameInfo.version
					++ testBeingIndex
					++ testIndexInRegion
					table_push(testServerList, serverInfo)
				}
				continue
			}
			if (gameInfo.id > beginOpenGame){
				continue
			}
			gameInfo.beginServerIndex = beginIndex
			for (let i = 0; i < gameInfo.groupNum; ++i){
				if (gameInfo.id != beginOpenGame || i < beginOpenGroup){
					let serverInfo:any = {}
					serverInfo.gameId = gameInfo.id
					serverInfo.id = beginIndex//第几个服。从0开始
					serverInfo.regionIndex = regionIndex//在第几个组.
					serverInfo.indexInRegion = indexInRegion//在组里排第几个
					serverInfo.groupIndex = i
					serverInfo.isnew = false
					serverInfo.maintain = !!gameInfo.maintain
					serverInfo.version = gameInfo.version
					
					if ((gameInfo.id == beginOpenGame) && (i == (beginOpenGroup - 1)) ){
						serverInfo.isnew = true
					}
					++ beginIndex
					++ indexInRegion
					if (indexInRegion >= eachServerInRegion){
						indexInRegion = 0
						++ regionIndex
					}
					table_push(serverList, serverInfo)
				}
			}
			//table.insert(serverList, serverInfo);
		}
		serverConfig.gameList = gameList;
		serverConfig.serverList = serverList;
		serverConfig.testServerList = testServerList;

		serverConfig[LAST_ENTER_KEY] = [];
		let bCheckServerList = LaunchHelper.getInstance().isCheckServerList();
		if (bCheckServerList == true){
			if (jsonInfo.lastEnter != null){
				for (let i in jsonInfo.lastEnter){
					let enterone = jsonInfo.lastEnter[i]
					table_push(serverConfig[LAST_ENTER_KEY], [enterone[0], enterone[1] - 1])
				}
			}
		}
		return serverConfig;
	}

	setTargetServerId(id: number): void {
		this.targetserverid = id;
	}

	parseDomainListFromJson(jsonInfo){
		// //TLog.Debug("parseDomainListFromJson")
		// for(let _ in jsonInfo){
		// 		let v = jsonInfo[_]
		
		// 	//ServerDomainList[ip]=domain
		// 	ServerDomainList[v[2]] = v[1]
		// }
		// //TLog.Debug_r(ServerDomainList)
	}

	checkServerOpen(gameId:number, groupIndex:number):boolean{
		let gameinfo = ServerConfig.gameList[gameId]
		if (gameinfo == null || groupIndex >= gameinfo.groupNum){
			return false
		}
		let beginGameGroup = ServerConfig['openInfo']['beginIndex']
		let beginOpenGame = beginGameGroup[0]//开到第几个gameSever
		let beginOpenGroup = beginGameGroup[1]//开到这个gameServer的第几个组

		if (gameId > beginOpenGame){
			return false
		}else if(gameId == beginOpenGame){
			if (groupIndex >= beginOpenGroup){
				return false
			}
		} 
		return true
	}

	parseServerListFromJson(jsonInfo: string): void {
		var serverList = this.parseJson(jsonInfo);
		ServerConfig = serverList;
		this.selectedServerIndex = -1
		this.selectedServerGroup = -1

		if (ServerConfig['lastEnter'] != null){
			if (ServerConfig['lastEnter'].length > 0){
				this.selectedServerIndex = ServerConfig['lastEnter'][0][0];
				this.selectedServerGroup = ServerConfig['lastEnter'][0][1];
			}
		}

		var bCheckServerList = LaunchHelper.getInstance().isCheckServerList();
		//ServerConfig.length = 0;
		if (bCheckServerList != true){
			let gameId = IGlobal.setting.getCommonSetting(UserSetting.TYPE_NUMBER, "lastServerGameId", -1);
			let groupIndex = IGlobal.setting.getCommonSetting(UserSetting.TYPE_NUMBER, "lastServerGroupIndex", -1);
			this.selectedServerIndex = gameId
			this.selectedServerGroup = groupIndex
		}
		if (this.selectedServerIndex != -1 && this.selectedServerGroup != -1){
			if (this.checkServerOpen(this.selectedServerIndex, this.selectedServerGroup) != true){
				this.selectedServerIndex = -1
				this.selectedServerGroup = -1				
			}
		}
		if (this.selectedServerIndex == -1 || this.selectedServerGroup == -1){
			let gamegroup = this.getNewestGameGroup()
			if (gamegroup[0] >= 0 && gamegroup[1] >= 0){
				this.setSelectedGameGroup(gamegroup[0], gamegroup[1])
			}
		}else{
			this.setSelectedGameGroup(this.selectedServerIndex, this.selectedServerGroup)
		}

		/*
		var index = 0;

		let lastSelectedServerIndex = -1;

		var lastServerName = IGlobal.setting.getCommonSetting(UserSetting.TYPE_STRING, "lastServerName", "");
		let targetserverindex = -1;
		serverList.forEach(serverInfo => {
			var newInfo: any = {};
			newInfo.ServerID = serverInfo.id;
			newInfo.ServerName = serverInfo.title;
			newInfo.NickName = serverInfo.connectName;
			newInfo.IP = serverInfo.ip;
			newInfo.PORT = serverInfo.port;
			newInfo.State = serverInfo.state;
			newInfo.IsRecommend = serverInfo.recommend != 0;
			newInfo.IsNew = (serverInfo.isnew != 0);
			newInfo.Version = serverInfo.version;
			newInfo.oServerName = serverInfo.otitle;   //原来的名字
			newInfo.groupIndex = tonumber(serverInfo.groupIndex);

			if (this.lastSelectedServerIndex == -1 && lastServerName != "") {
				if (lastServerName == newInfo.ServerName) {
					this.lastSelectedServerIndex = index;
				} else if (newInfo.oServerName && lastServerName == newInfo.oServerName) {
					this.lastSelectedServerIndex = index;
				}
			}
			if (this.targetserverid == newInfo.ServerID) {
				targetserverindex = index;
			}
			index = index + 1;
			ServerConfig.push(newInfo);
		});

		//默认选一次登录的服
		//如果第一次登陆，则选第一个服
		if (this.lastSelectedServerIndex == -1) {//如果没有找到，则找第一个推荐的
			index = 0

			for (var i = 0; i < ServerConfig.length; i++) {
				var serverInfo = ServerConfig[i];
				if (serverInfo.IsRecommend) {//推荐的
					this.lastSelectedServerIndex = index
					this.selectedServerIndex = index
					break
				}
				index = index + 1
			}

		}

		if (this.lastSelectedServerIndex == -1) {//再找不到就第二个好了
			this.selectedServerIndex = 0;
			this.lastSelectedServerIndex = this.selectedServerIndex;
		}

		if (targetserverindex == -1) {
			this.setSelectedServerIndex(this.lastSelectedServerIndex);
		} else {
			this.selectedServerIndex = targetserverindex;
			this.setSelectedServerIndex(targetserverindex);
		}*/
	}


	getInputUser(): any {
		var info: any = {};
		info.username = this.tempUserName;
		info.password = this.tempPassWord;
		return info;
	}

	//防刷过多小号，限制XXX秒内只能登陆X个账号
	checkMaxAccountLimit(){
		let MAX_LOGIN_COUNT = 5;//同时登陆数量
		let MAX_LOGIN_TIME = 60 * 30;//30分钟

		let authorInfo = GameAccount.getInstance().getAuthorInfo()
		let userId = authorInfo.userId;
		var str = IGlobal.setting.getCommonSetting(UserSetting.TYPE_STRING, "maxAccountLimit", table_save({}));
		let accountInfo = table_load(str)
		let nowTime = GetOSTime();

		//清理过时的账号
		for(let accId in accountInfo){
			let lastLoginTime = accountInfo[accId]
			if(accId == "" || nowTime - lastLoginTime >= MAX_LOGIN_TIME)
				delete accountInfo[accId];
		}

		if(userId in accountInfo){
			accountInfo[userId] = nowTime;
			IGlobal.setting.setCommonSetting(UserSetting.TYPE_STRING, "maxAccountLimit", table_save(accountInfo));
			return true;
		}

		if(size_t(accountInfo) >= MAX_LOGIN_COUNT){
			return false;
		}
		accountInfo[userId] = nowTime;
		IGlobal.setting.setCommonSetting(UserSetting.TYPE_STRING, "maxAccountLimit", table_save(accountInfo));
		return true;
	}

	checkBridgeServerInfo(gameId:number, gameGroup:number): boolean {
		if (GAME_DEBUG) {
			return true
		}

		if(this.checkMaxAccountLimit() == false ){
			MsgSystem.addTagTips(Localize_cns("LOGIN_ERROR8"));
			return false;
		}

		let serverInfo = this.getServerInfoByGameGroup(gameId, gameGroup)
		if (serverInfo == null) {
			MsgSystem.addTagTips(Localize_cns("LOGIN_ERROR7"));
			return false;
		}

		if (serverInfo.maintain == true) {
			MsgSystem.addTagTips(Localize_cns("LOGIN_ERROR7"));
			return false;
		}

		var bCheckUpdate = LaunchHelper.getInstance().isCheckUpdate();
		if (!bCheckUpdate)
			return true;

		var bCheckServerList = LaunchHelper.getInstance().isCheckServerList();
		if (bCheckServerList) {
			var serverVer = serverInfo.version
			var resVer = g_VersionData.resourceVer
			var [ret, bNeedUpdate] = CompareVersion(resVer, serverVer)
			if( bNeedUpdate ){
				MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_SERVER_VER_ERROR"))
				return false
			}
		}

		return true;

	}

	changeLoginPrecedure() {
		var preMgr: PrecedureManager = PrecedureManager.getInstance();
		if (preMgr.getCurrentPrecedureId() == PRECEDURE_LOGIN) {
			FireEvent(EventDefine.LOGIN_REQUEST_RESTART, null);
		} else {
			PrecedureManager.getInstance().changePrecedure(PRECEDURE_LOGIN);
		}
	}

	startBridgeAuth(): void {
		//var serverinfo = this.getRecentLoginServerInfo();
		//if (!this.checkBridgeServerInfo(serverinfo)) {
		let recentGameId = this.getSelectServerGameID()
		let recentGroupIndex = this.getSelectServerGroupIndex()
		if (!this.checkBridgeServerInfo(recentGameId, recentGroupIndex)) {
			if (this.bQuickLogin) {
				this.setQuickLogin(false);
				this.changeLoginPrecedure();
			}
			return;
		}

		this.retryBridgeAuthTimes = this.retryBridgeAuthTimes + 1;
		FireEvent(EventDefine.MSG_WAIT_BEGIN, ClientWaitEvent.createObj(true, Localize_cns("LOGIN_CONNECTING"), true));

		//var bridgeHttpAuthWorker = BridgeHttpAuthWorker.createObj(serverinfo, this, this.retBridgeHttpAuth);
		var bridgeHttpAuthWorker = BridgeHttpAuthWorker.createObj(recentGameId, recentGroupIndex, this, this.retBridgeHttpAuth);
		bridgeHttpAuthWorker.send();
	}


	retBridgeHttpAuth(url: string, args: any) {
		var retCode = parseInt(args.code);

		if (retCode == -1) {
			//MsgSystem:ConfirmDialog_YES(Localize_cns("NET_ERROR1") .. args.errorCode)
			this.retryBridgeAuthTimes = 0;
			FireEvent(EventDefine.MSG_WAIT_END, null)
			this.onQuickLoginError(Localize_cns("NET_ERROR1") + args.code)
			return
		}

		if (retCode == 0) {
			this.retryBridgeAuthTimes = 0;
			var authorInfo = GameAccount.getInstance().getAuthorInfo();
			var bridgeInfo: any = {}
			bridgeInfo.identityId = args["identityId"]
			bridgeInfo.identityName = args["identityName"]
			bridgeInfo.tstamp = args["tstamp"]
			bridgeInfo.sign = args["sign"]
			bridgeInfo.remarks = args["remarks"]
			bridgeInfo.qdKey = authorInfo.qdKey
			bridgeInfo.code1 = authorInfo.code1
			bridgeInfo.code2 = authorInfo.code2
			bridgeInfo.deviceid = authorInfo.deviceid

			GameAccount.getInstance().setBrigeInfo(bridgeInfo);

			this.startLoginConnection();
		} else {

			var msg = args.msg || "";
			TLog.Error("LoginSystem.retBridgeHttpAuth %s", String.format(Localize_cns("LOGIN_ERROR2"), retCode, msg));

			if (this.retryBridgeAuthTimes >= 2) {
				msg = String.format("msg:%s url:%s", msg, url);
				//MsgSystem:ConfirmDialog_YES( string.format( Localize_cns("LOGIN_ERROR2"), retCode, msg ))
				FireEvent(EventDefine.MSG_WAIT_END, null)
				this.onQuickLoginError(String.format(Localize_cns("LOGIN_ERROR2"), retCode, msg));
			} else {
				//重新验证
				this.setAutoLogin(true)
				this.startAccountAuth()
			}
		}

	}

	startOfficiailRegister(args: any) {
		var officiailHttpRegisterWorker = OfficiailHttpRegisterWorker.createObj(args, this, this.retOfficiailRegister);
		officiailHttpRegisterWorker.send();
	}

	retOfficiailRegister(args: any) {
		if (args.code == 0) {
			MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_ERROR5"))
			this.startOfficiailHttpAccountAuth(args.accInfo.ACC, args.accInfo.PWD)
		} else {
			MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_ERROR1"))
		}
	}

	startLoginConnection() {
		if (g_CrossServerInfo && g_CrossServerInfo.state == CS_BEGIN) {
			GameAccount.getInstance().setLoginIpAndPort(g_CrossServerInfo.ip, g_CrossServerInfo.port)
			GameAccount.getInstance().setLoginHostName(g_CrossServerInfo.nickName)
		} else {
			//let serverInfo = this.getRecentLoginServerInfo()
			//GameAccount.getInstance().setLoginIpAndPort(serverInfo.IP, serverInfo.PORT)
			//GameAccount.getInstance().setLoginHostName(serverInfo.NickName)

			let recentGameId = this.getSelectServerGameID()
			let info = this.getConnectGameInfo(recentGameId)
			GameAccount.getInstance().setLoginIpAndPort(info.ip, info.port)
			GameAccount.getInstance().setLoginHostName(info.connectName)			
		}

		var loginConnectionWorker = LoginConnectionWorker.createObj();
		loginConnectionWorker.send();
	}


	startAccountAuth(): void {
		TLog.Debug("LoginSystem.startAccountAuth")
		let mode = IGlobal.sdkHelper.getSdkMode();
		if (mode == SdkMode.Officiail) {
			var username = IGlobal.setting.getCommonSetting(UserSetting.TYPE_STRING, "username", "");
			var password = IGlobal.setting.getCommonSetting(UserSetting.TYPE_STRING, "password", "");
			if (username == "") {
				FireEvent(EventDefine.LOGIN_REQUEST_SHOW_AUTH, null);
				return
			}
			this._authType = "Officiail";
			this.startOfficiailHttpAccountAuth(username, password);
		} else {
			this._authType = "auto"
			this.startThirdPartySDKAuth();
		}
	}

	// 第三方SDK验证
	startThirdPartySDKAuth() {
		TLog.Debug("LoginSystem.startThirdPartySDKAuth", this._authType)
		let thirdPartySdkAuthWorker: ThirdPartySdkAuthWorker = ThirdPartySdkAuthWorker.newObj("type=" + this._authType)
		thirdPartySdkAuthWorker.setRetCallBack(this, this.retThirdPartySDKAuth)
		thirdPartySdkAuthWorker.sendAuthRequest()

		//锁定屏幕
		if (this._authType != "logout") {
			let showWaitting = IGlobal.sdkHelper.getStringConfigDef("LoginShowWait", "1")
			if (showWaitting == "1") {
				FireEvent(EventDefine.MSG_WAIT_BEGIN, ClientWaitEvent.newObj(true, Localize_cns("LOGIN_GET_ACCOUNT_INFO"), true))
			}
		}
	}

	retThirdPartySDKAuth(code, infoParamsString) {
		SDKAnalyzer(SdkEventDefine.ACCOUNT_AUTH_FINISH, this._authType)
		TLog.Debug("LoginSystem.retThirdPartySDKAuth", code, infoParamsString)

		//解锁屏幕
		FireEvent(EventDefine.MSG_WAIT_END, null)


		if (code != 0) {
			GameAccount.getInstance().setAuthorInfo(null)

			//如果没有提示信息，则不弹窗
			if (infoParamsString != "") {
				MsgSystem.addTagTips(String.format(Localize_cns("SDK_LOGIN_ERROR"), code, infoParamsString))
			}
			//这里要加代码 提示，登陆失败，再次调用sdk登陆
			FireEvent(EventDefine.LOGIN_ACCOUNT_AUTH_FAILED, null)
			return
		}
		// let showSelect = Core.IGameSdk.inst.GetStringConfigDef("ShowLoginSelect", "0")
		// if (showSelect == "1") {
		// 	//let qd_key = Core.IGameSdk.inst.GetStringConfigDef("QD_Key", "")
		// 	//if(qd_key == "TCYYB" ){//应用宝　保存用哪中方式登陆　别的sdk不需要我们做
		// 	Core.IConfig.instance.SetString("login", "to", this._authType, "sdkLogin.ini")
		// 	Core.IConfig.instance.AutoSave()
		// }

		//如果是接入SDK的话，登陆是在一开始就已经完成，所以只要检查有没有openid之类就可以了
		// let openid = GameMain.getInstance().getFromCmdLine("openid");
		// let noice = GameMain.getInstance().getFromCmdLine("noice");
		// let sign = GameMain.getInstance().getFromCmdLine("sign");
		// if (openid != null && noice != null && sign != null) {
		// 	let openkey = GameMain.getInstance().getFromCmdLine("openkey");
		// 	let appid = GameMain.getInstance().getFromCmdLine("appid");
		// 	//这三样都有，就已经是经过 sdk登陆了
		// 	var gameKey = IGlobal.sdkHelper.getStringConfigDef("GameKey");
		// 	var gameName = IGlobal.sdkHelper.getStringConfigDef("GameName");
		// 	var qdKey = IGlobal.sdkHelper.getStringConfigDef("QD_Key");
		// 	var code1 = IGlobal.sdkHelper.getStringConfigDef("QD_Code1");
		// 	var code2 = IGlobal.sdkHelper.getStringConfigDef("QD_Code2")
		// 	var authorInfo: any = {};
		// 	authorInfo.userId = openid; //账号ID，目前和userName废弃
		// 	authorInfo.userName = openid;
		// 	authorInfo.sign = sign;
		// 	authorInfo.tstamp = noice;
		// 	authorInfo.loginKey = openkey;
		// 	authorInfo.code1 = qdKey;
		// 	authorInfo.code2 = code2;
		// 	authorInfo.qdKey = qdKey;
		// 	authorInfo.deviceid = "pc";
		// 	authorInfo.gameKey = gameKey;
		// 	authorInfo.gameName = gameName
		// 	GameAccount.getInstance().setAuthorInfo(authorInfo)
		// 	FireEvent(EventDefine.LOGIN_ACCOUNT_AUTH_SUCC, null);
		// }

		let authorInfo = core.GameSdkUtil.splitHttpParams(infoParamsString)
		if (authorInfo.userId == null) {
			authorInfo.userId = authorInfo.openid
		}
		if (authorInfo.qdKey == null) {
			authorInfo.qdKey = ""
		}
		if (authorInfo.qdName == null) {
			authorInfo.qdName = ""
		}
		if (authorInfo.code1 == null) {
			authorInfo.code1 = ""
		}
		if (authorInfo.code2 == null) {
			authorInfo.code2 = ""
		}
		if (authorInfo.deviceid == null) {
			authorInfo.deviceid = egret.Capabilities.runtimeType + "_" + egret.Capabilities.os;
		}
		if (authorInfo.gameKey == null) {
			authorInfo.gameKey = ""
		}
		if (authorInfo.gameName == null) {
			authorInfo.gameName = ""
		}

		GameAccount.getInstance().setAuthorInfo(authorInfo)

		SDKAnalyzer(SdkEventDefine.SDK_LOGIN_SCRIPT_FINISH, this._authType)
		FireEvent(EventDefine.LOGIN_ACCOUNT_AUTH_SUCC, null)
	}



	startOfficiailHttpAccountAuth(userName: string, passWord: string): void {
		FireEvent(EventDefine.MSG_WAIT_BEGIN, ClientWaitEvent.createObj(true, Localize_cns("LOGIN_GET_ACCOUNT_INFO"), true));

		var appId = IGlobal.sdkHelper.getStringConfigDef("AppId");
		var clientId = IGlobal.sdkHelper.getStringConfigDef("ClientId");

		var userLocalData = {
			UserName: userName,
			PassWord: passWord,
			AppId: appId,
			ClientId: clientId,
		}

		var officiailHttpAccountAuthWorker: OfficiailHttpAccountAuthWorker = OfficiailHttpAccountAuthWorker.createObj(userLocalData, this, this.retOfficiailHttpAccountAuth);
		officiailHttpAccountAuthWorker.send();

		this.tempUserName = userName;
		this.tempPassWord = passWord;
	}

	retOfficiailHttpAccountAuth(url: string, args: any): void {
		FireEvent(EventDefine.MSG_WAIT_END, null);

		var retCode = parseInt(args.code);
		if (0 == retCode) {

			if (this.tempUserName != args.accountId) {
				TLog.Error("retOfficiailHttpAccountAuth self.tempUserName:%s ~= args.accountId:%s", this.tempUserName, args.accountId);
				return
			}

			var gameKey = IGlobal.sdkHelper.getStringConfigDef("GameKey");
			var gameName = IGlobal.sdkHelper.getStringConfigDef("GameName");
			var qdKey = IGlobal.sdkHelper.getStringConfigDef("QD_Key");
			var code1 = IGlobal.sdkHelper.getStringConfigDef("QD_Code1");
			var code2 = IGlobal.sdkHelper.getStringConfigDef("QD_Code2");

			var authorInfo: any = {};
			authorInfo.userId = args.accountId; //账号ID，目前和userName废弃
			authorInfo.userName = args.accountName;
			authorInfo.sign = args.sign;
			authorInfo.tstamp = args.timeStamp;
			authorInfo.loginKey = args.loginKey;
			authorInfo.code1 = code1;
			authorInfo.code2 = code2;
			authorInfo.qdKey = qdKey;
			authorInfo.deviceid = egret.Capabilities.runtimeType + "_" + egret.Capabilities.os;
			authorInfo.gameKey = gameKey;
			authorInfo.gameName = gameName;

			GameAccount.getInstance().setAuthorInfo(authorInfo)

			IGlobal.setting.setCommonSetting(UserSetting.TYPE_STRING, "username", this.tempUserName);
			IGlobal.setting.setCommonSetting(UserSetting.TYPE_STRING, "password", this.tempPassWord);


			FireEvent(EventDefine.LOGIN_ACCOUNT_AUTH_SUCC, null);

		} else if (6 == retCode) {
			//当时一个新账号的时候询问是否直接注册
			FireEvent(EventDefine.LOGIN_REQUEST_SHOW_REGISTER, null);
		} else {
			if (3 == retCode) {
				MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_ERROR6"))
				FireEvent(EventDefine.LOGIN_REQUEST_SHOW_AUTH, null);
			} else {
				MsgSystem.addTagTips(String.format(Localize_cns("LOGIN_ERROR3"), retCode));
				FireEvent(EventDefine.LOGIN_ACCOUNT_AUTH_FAILED, null);
			}
			GameAccount.getInstance().setAuthorInfo(null);
			this.tempUserName = "";
			this.tempPassWord = "";
		}
	}

	onHttpResponse(url: string, data: any, userData: any) {
		FireEvent(EventDefine.MSG_WAIT_END, null);
		if (SERVERLIST_TAG == userData) {
			var jsonInfo = JsUtil.JsonDecode(data);

			if(jsonInfo["code"] != null && jsonInfo["data"] != null){
				this.parseServerListFromJson(jsonInfo["data"]);

				if(jsonInfo['domainlist'] != null){
					this.parseDomainListFromJson(jsonInfo['domainlist'])
				}
			}else{
				this.parseServerListFromJson(jsonInfo);
			}

			this.mServerRoleList = []
			if(jsonInfo["registerlist"] ){
				this.mServerRoleList = jsonInfo["registerlist"]
			}

			if (this.serverListCallback) {
				this.serverListCallback();
			}
		} else if (NOTICE_TAG == userData) {
			var jsonInfo = JsUtil.JsonDecodeSafeFormat(data);
			this.setNoticeContent(jsonInfo);

			if (this.noticeCallback) {
				this.noticeCallback()
			}
		}
	}

	onHttpError(url: string, userData: any) {
		TLog.Error("onHttpError %s userData:%d", url, userData);
		FireEvent(EventDefine.MSG_WAIT_END, null)
		if (SERVERLIST_TAG == userData) {
			//再刷一次
			let _this = this;
			let t: IDialogCallback = {
				onDialogCallback(result: boolean, userData): void {
					if (result == true) {
						_this.requestServerList(_this.serverListCallback)
					}
				}
			}
			MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_GET_SERVERLIST_FAILED"), t, null)

		} else if (NOTICE_TAG == userData) {
			if (this.noticeCallback) {
				this.noticeCallback()
			}
		}
	}

	getSelectServerGameID() {
		return this.selectedServerIndex
	}

	getSelectServerGroupIndex() {
		return this.selectedServerGroup
	}

	getSelectSeverInfo(){
		return this.getServerInfoByGameGroup(this.selectedServerIndex, this.selectedServerGroup)
	}
	//getRecentLoginServerInfo() {
	//	var idx = this.getSelectedServerIndex();
	//	return ServerConfig[idx];
	//}
//
	//getServerConfigInfo(idx: number) {
	//	return ServerConfig[idx];
	//}

	//getNewestServerInfo() {
	//	if(ServerConfig.length > 0){
	//		return ServerConfig[0]
	//	}
	//	return null;
	//}


	//getServerConfigInfoByName(serverName: string) {
	//	for(let i = 0; i < ServerConfig.length; i++){
	//		let config = ServerConfig[i]
	//		if(config.ServerName == serverName){
	//			return config
	//		}
	//	}
	//	return null
	//}
	
	//setSelectedServerIndex(index) {
	//	var serverInfo = this.getServerConfigInfo(index)
	//	if (serverInfo == null) {
	//		return;
	//	}

	//	this.selectedServerIndex = index;

	//	FireEvent(EventDefine.LOGIN_SERVERLIST_UPDATE, null);
	//}

	setSelectedGameGroup(gameId:number, groupIndex:number) {
		this.selectedServerIndex = gameId
		this.selectedServerGroup = groupIndex
		FireEvent(EventDefine.LOGIN_SERVERLIST_UPDATE, null);
	}

	getSelectedServerIndex(): number {
		return this.selectedServerIndex
	}

	//getLastSelectedServerIndex() {
	//	return this.lastSelectedServerIndex;
	//}


	onQuickLoginError(msg: string) {
		if (!this.bQuickLogin) {
			let callback: IDialogCallback = null;
			if (g_CrossServerInfo) {
				let t: IDialogCallback = {
					onDialogCallback(result: boolean, userData): void {
						if (result == false) {
							return
						}

						ConfirmFinishCrossServer()
					}
				}
				callback = t;
			}

			MsgSystem.confirmDialog_YES(msg, callback);
			FireEvent(EventDefine.MSG_WAIT_END, null);
			return;
		}

		var self = this;
		var t: IDialogCallback = {
			onDialogCallback(result: boolean, userData): void {
				if (result == false)
					return;
				self.setQuickLogin(true);
				self.changeLoginPrecedure();
			}
		}
		MsgSystem.confirmDialog_YES(msg, t);
	}

	getServerStateText(serverInfo:any): any {
		function getTempInfo(text, image, color): any {
			var info: any = {};
			info.text = text;
			info.image = image;
			info.color = color;
			return info;
		}
		
		//if (serverInfo == null || serverInfo.State == StateType.UNABLE) {
		if (serverInfo == null || serverInfo.maintain == true) {
			return getTempInfo(Localize_cns("WEIHU"), "dl_zhuangTai_icon03", gui.Color.gray);
		}

		// if (serverInfo.State == StateType.BUSY) {
		// 	return getTempInfo(Localize_cns("FANMANG"), "dl_zhuangTai_icon01", gui.Color.lime);
		// }

		//if (serverInfo. == StateType.FULL) {
		//	return getTempInfo(Localize_cns("BAOMAN"), "dl_zhuangTai_icon02", gui.Color.red);
		//}

		return getTempInfo(Localize_cns("LIUCHANG"), "dl_zhuangTai_icon01", gui.Color.lime);
	}


	onRoleListUpdate(roleList: LoginRole[]) {
		this.mRoleList = roleList;
	}

	onAddRoleInfo(roleInfo: LoginRole) {
		this.mRoleList.push(roleInfo);
	}

	getRoleInfoByIndex(index: number): LoginRole {
		return this.mRoleList[index];
	}

	getRoleInfoList(): LoginRole[] {
		return this.mRoleList;
	}

	getLoginRoleInfo() {
		return this.loginRoleInfo;
	}

	startGameConnectionWithLastRole() {
		this.startGameConnection(this.loginRoleInfo);
	}

	startGameConnection(info?: LoginRole): void {
		var roleInfo: LoginRole = info || this.getRoleInfoList()[0];
		this.loginRoleInfo = roleInfo;
		IGlobal.setting.setRoleName(roleInfo.id + "");
		this.setLastLoginRoleID(roleInfo.id)

		var runtimeConnectionWorker = RuntimeConnectionWorker.createObj(roleInfo);
		runtimeConnectionWorker.send();
	}


	getLastLoginRoleID() {
		this.saveLastLoginRoleID = 0
		let key = "LastLoginRoleID"
		this.saveLastLoginRoleID = IGlobal.setting.getCommonSetting(UserSetting.TYPE_NUMBER, key, 0)
		//TLog.Debug("LoginSystem.getLastLoginRoleID",this.saveLastLoginRoleID)
		return this.saveLastLoginRoleID
	}
	setLastLoginRoleID(roleID) {
		this.saveLastLoginRoleID = roleID
		let key = "LastLoginRoleID"
		IGlobal.setting.setCommonSetting(UserSetting.TYPE_NUMBER, key, this.saveLastLoginRoleID)
		//TLog.Debug("LoginSystem.setLastLoginRoleID",roleID)
	}


	setNoticeContent(content) {
		this.noticeContent = content
	}

	getNoticeContent() {
		return this.noticeContent
	}



	_getHistoryGameGroupList():any[]{
		if(this.historyGameGroupList == null){
			let historyListStr = IGlobal.setting.getCommonSetting(UserSetting.TYPE_STRING, "RecentGameGroupList", "")
			if(historyListStr == ""){
				this.historyGameGroupList = []
			}else{
				this.historyGameGroupList = table_load(historyListStr)
			}
		}
		return this.historyGameGroupList
	}

	addRecentServerInfo(gameId, groupIndex){
		let bCheckServerList = LaunchHelper.getInstance().isCheckServerList();
		if (bCheckServerList == true){
			return
		} 
		let list = this._getHistoryGameGroupList()

		let exsitIndex = -1
		for(let i = 0; i < list.length; i++){
			let gamegroup = list[i]
			if(gamegroup[0] == gameId && gamegroup[1] == groupIndex){
				exsitIndex = i
				break
			}
		}
		if(exsitIndex != -1){
			list.splice(exsitIndex, 1)	
		}

		if(list.length >= 10){
			list.shift()
		}
		let info = [gameId, groupIndex]
		list.push(info)

		IGlobal.setting.setCommonSetting(UserSetting.TYPE_STRING, "RecentGameGroupList", table_save(list))
		this.historyGameGroupList = list
	}

	getRecentServerInfoList(){

		//let serverInfoList = []
		//如果有测试服加在这里
		let ret = []
		if (ServerConfig.testServerList != null){
			for (let i in ServerConfig.testServerList) {
				let serverInfo = ServerConfig.testServerList[i]
				let gameId = serverInfo.gameId
				let groupIndex = serverInfo.groupIndex
				table_push(ret, [gameId, groupIndex])
			}
		}
		
		let bCheckServerList = LaunchHelper.getInstance().isCheckServerList();
		if (bCheckServerList == true){
			let recentNum = 0
			let lastList = ServerConfig['lastEnter']
			if (lastList != null){
				for (let i in ServerConfig['lastEnter']){
					let gamegroup = ServerConfig['lastEnter'][i]
					if (recentNum < 20){
						if (this.checkServerOpen(gamegroup[0],  gamegroup[1])){
							table_push(ret, gamegroup)
							++ recentNum;
						}
					}
				}
			}
			return ret
		} 

		let list = this._getHistoryGameGroupList()
		let historyList = []
		let changed = false
		let recentNum = 0
		for (let i in list){
			let gamegroup = list[i]
			let gameid = gamegroup[0]
			if (this.checkServerOpen(gamegroup[0],  gamegroup[1])){
				table_push(historyList, gamegroup)
				if (recentNum < 20){
					table_push(ret, gamegroup)
					++ recentNum;
				}
			}else{
				changed = true
			}
		}

		if (changed){
			IGlobal.setting.setCommonSetting(UserSetting.TYPE_STRING, "RecentGameGroupList", table_save(historyList))
			this.historyGameGroupList = historyList			
		}


		return ret
		//for(let i = list.length - 1; i >= 0 ; i--){
		//	let serverName = list[i]
		//	let serverInfo = this.getServerConfigInfoByName(serverName)
		//	if(serverInfo){
		//		serverInfoList.push(serverInfo)
		//	}
		//}

		//return serverInfoList
	}

}