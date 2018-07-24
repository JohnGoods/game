class LoginPrecedure extends BasePrecedure{

	mLoginFrame:LoginFrame;

	public onActive(lastId):void{

		this.mLoginFrame = WngMrg.getInstance().getWindow("LoginFrame");
		this.mLoginFrame.hideWnd()
		//this.mLoginFrame.showWnd();
		//

		RegisterEvent(EventDefine.LOGIN_ACCOUNT_AUTH_SUCC,this.onAccountAuthSucc,this)
		RegisterEvent(EventDefine.LOGIN_ACCOUNT_AUTH_FAILED,this.onAccountAuthFailed,this)
		RegisterEvent(EventDefine.LOGIN_REQUEST_SHOW_AUTH,this.onRequestShowAuth,this)
		RegisterEvent(EventDefine.LOGIN_REQUEST_SHOW_SDK_AUTH,this.onRequestShowSdkAuth,this)
		RegisterEvent(EventDefine.LOGIN_REQUEST_SHOW_ROLESPEC,this.onRequestShowRoleSpec,this)
		RegisterEvent(EventDefine.LOGIN_REQUEST_SHOW_REGISTER, this.onRequestShowRegister,this)
		RegisterEvent(EventDefine.LOGIN_REQUEST_RESTART, this.onRequestRestart,this)

		FireEvent(EventDefine.PRECEDURE_ACTIVE, PrecedureEvent.createObj(this.id));

		//getSkipSelectServer
		//if(g_CrossServerInfo == null ){
		//	this.startLogin()
		//}else{

		if(g_CrossServerInfo == null){
			this.startLogin();
		}else{
			//this.mLoginFrame.showWnd();
			//let logoWnd = WngMrg.getInstance().getWindow("LoginLogoFrame")
			if(g_CrossServerInfo.state == CS_BEGIN ){
				this.mLoginFrame.showLoadingWithMsg(Localize_cns("CROSS_SERVER_TIPS1"))
				//this.startLoginCrossServer()
				LoginSystem.getInstance().startBridgeAuth()
			}else{	
				this.mLoginFrame.showLoadingWithMsg(Localize_cns("CROSS_SERVER_TIPS2"))
				LoginSystem.getInstance().setQuickLogin(true)
				this.startLogin()
			}
		}
		
		//let gs:GameSdk = GameSdk.getInstance();
		//let skipServer = gs.getSkipSelectServer();
		//let skipAuth = gs.getSkipAccountAuth();
		//if (skipServer && skipAuth){
		//	this.startServerInfo();
		//	//LoginSystem.getInstance().startBridgeAuth();
		//	return;
		//}
		
		//this.mLoginFrame.showWnd();
		
	}

	public onDeactive(currentId):void{
		//this.mLoginFrame = null;

		UnRegisterEvent(EventDefine.LOGIN_ACCOUNT_AUTH_SUCC,this.onAccountAuthSucc,this)
		UnRegisterEvent(EventDefine.LOGIN_ACCOUNT_AUTH_FAILED,this.onAccountAuthFailed,this)
		UnRegisterEvent(EventDefine.LOGIN_REQUEST_SHOW_AUTH,this.onRequestShowAuth,this)
		UnRegisterEvent(EventDefine.LOGIN_REQUEST_SHOW_SDK_AUTH,this.onRequestShowSdkAuth,this)
		UnRegisterEvent(EventDefine.LOGIN_REQUEST_SHOW_ROLESPEC,this.onRequestShowRoleSpec,this)
		UnRegisterEvent(EventDefine.LOGIN_REQUEST_SHOW_REGISTER, this.onRequestShowRegister,this)
		UnRegisterEvent(EventDefine.LOGIN_REQUEST_RESTART, this.onRequestRestart,this)

		if(currentId == PRECEDURE_GAME){
			LoginNetDispatcher.getInstance().disconnect();
		}

		FireEvent(EventDefine.PRECEDURE_DEACTIVE, PrecedureEvent.createObj(this.id));
	}


	startLogin():void{
		var loginSystem: LoginSystem = LoginSystem.getInstance();
		var wngMgr: WngMrg = WngMrg.getInstance();
		if(loginSystem.isQuickLogin()){
			this.startNoticeInfo()
		}else{
			//play sound
			//WngMrg.getInstance():showWindow("LoginLogoFrame")
			this.mLoginFrame.showWnd()
			this.mLoginFrame.doCommand("command_switchState", LoginFrame.STATE_LOGO);

			var timeId = 0;
			let nextTick = function(){
				KillTimer(timeId);

				var authInfo = GameAccount.getInstance().getAuthorInfo();
				if(authInfo == null){
					this.startAccountAuth()
				}else{
					this.startNoticeInfo();
				}
			}
			timeId = SetTimer(nextTick, this, 0);

		}
		
	}

	startAccountAuth(){
		LoginSystem.getInstance().startAccountAuth();
	}

	startNoticeInfo(){
		var loginSystem:LoginSystem = LoginSystem.getInstance();
		if(loginSystem.isQuickLogin() || loginSystem.isAutoLogin() ){
			this.startServerInfo();
		}else{
			if(!GAME_DEBUG){
				var self = this;
				let serverListCallback = function(){
					self.startServerInfo();

					let noticeContent = LoginSystem.getInstance().getNoticeContent()
					if(size_t(noticeContent)!=0 ){
						let wnd = WngMrg.getInstance().getWindow("UpdateNoticeFrame")
						wnd.setUpdateList(noticeContent)
						wnd.showWnd()
					}
				}
				loginSystem.requestNotice(serverListCallback);
			}else{
				this.startServerInfo();
			}
		}
	}

	startServerInfo(){
		
		var loginSystem:LoginSystem = LoginSystem.getInstance();
		var bCheckServerList = LaunchHelper.getInstance().isCheckServerList();
		var self = this;

		if(bCheckServerList){	
			let serverListCallback = function(){
				self.showLoginFrame();
			}
			loginSystem.requestServerList(serverListCallback)

		}else{
			if(ServerConfig['gameList'] == null){
				var loginSettingFile = "loginSetting.json";
				var callback: core.ResItemCallback = {
					onResItemLoad(res:core.ResItem):void{
						var jsonInfo = JsUtil.JsonDecode(res.getData());
						loginSystem.parseServerListFromJson( jsonInfo ) ;
						self.showLoginFrame();
					},
					onResItemError(key:string):void{
						//this.showLoginFrame();
					}
				};
				IGlobal.resManager.loadResAsyn(loginSettingFile, callback, core.ResourceType.TYPE_TEXT);
			}else{
				self.showLoginFrame();
			}
		}
	}

	showLoginFrame(){
		//var loginSystem:LoginSystem = LoginSystem.getInstance();
		//let gs:GameSdk = GameSdk.getInstance();
		//let skipServer = gs.getSkipSelectServer();
		//let skipAuth = gs.getSkipAccountAuth();
		//if (skipServer && skipAuth){		
		//	loginSystem.startBridgeAuth();
		//}
		TLog.Debug("showLoginFrame")
		let loginSystem:LoginSystem = LoginSystem.getInstance();
		if(loginSystem.isQuickLogin() || loginSystem.isAutoLogin()){
			loginSystem.setAutoLogin(false);
			TLog.Debug("showLoginFrame isQuickLogin || isAutoLogin")
			loginSystem.startBridgeAuth()
		}
		
		if(!loginSystem.isQuickLogin()){
			//TLog.Debug("showLoginFrame not isQuickLogin")
			this.mLoginFrame.showWnd();
			this.mLoginFrame.doCommand("command_switchState", LoginFrame.STATE_RENCENT);

			let bCheckUpdate = LaunchHelper.getInstance().isCheckServerList()
			TLog.Debug("bCheckUpdate", bCheckUpdate)
			if(bCheckUpdate ){
				let roleList = LoginSystem.getInstance().getServerRoleList()
				if(roleList.length == 0 ){//是新账号，直接进入创建角色
					TLog.Debug("roleList.length == 0", roleList)
					IGlobal.gameSdk.reportFirstEnter()//新账号，要调用SDK 上报数据
					//let serverinfo = LoginSystem.getInstance().getRecentLoginServerInfo()
					//if(LoginSystem.getInstance().checkBridgeServerInfo(serverinfo) ){
					let recentGameId = LoginSystem.getInstance().getSelectServerGameID()
            		let recentGroupIndex = LoginSystem.getInstance().getSelectServerGroupIndex()
					if(LoginSystem.getInstance().checkBridgeServerInfo(recentGameId, recentGroupIndex) ){
						LoginSystem.getInstance().startBridgeAuth()
					}
				}
			}
		}
	}


	onAccountAuthSucc(args:core.EventArgs){
		this.startNoticeInfo();
	}

	onAccountAuthFailed(args:core.EventArgs){
		FireEvent(EventDefine.MSG_WAIT_END, null);

		var callback:IDialogCallback = {
			 onDialogCallback(result:boolean, userData):void{
				 LoginSystem.getInstance().startAccountAuth();
			 }
		}

		MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_GET_AUTH_FAILED"), callback);
	}

	onRequestShowAuth(args:core.EventArgs){
		//请求打开账号认证界面
		this.mLoginFrame.doCommand("command_switchState", LoginFrame.STATE_AUTH);
	}

	onRequestShowSdkAuth(args:core.EventArgs){
		//请求打开SDK选择登陆界面(qq / 微信)
		//WngMrg.getInstance().showWindow("LoginSdkAuthFrame")
	}

	//创建角色
	onRequestShowRoleSpec(args:core.EventArgs){
		WngMrg.getInstance().showWindow("LoginCreateRoleFrame")
	}


	onRequestShowRegister(args:core.EventArgs){
		this.mLoginFrame.doCommand("command_switchState", LoginFrame.STATE_REGISTER);
	}

	onRequestRestart(args:core.EventArgs){
		//this.startLogin()
		if(g_CrossServerInfo == null ){
			this.startLogin()
		}else{
			
			if(g_CrossServerInfo.state == CS_BEGIN ){
				this.mLoginFrame.showLoadingWithMsg(Localize_cns("CROSS_SERVER_TIPS1"))
				//this.startLoginCrossServer()
				LoginSystem.getInstance().startBridgeAuth()
			}else{	
				this.mLoginFrame.showLoadingWithMsg(Localize_cns("CROSS_SERVER_TIPS2"))
				LoginSystem.getInstance().setQuickLogin(true)
				this.startLogin()
			}
			
		}
	}


	
}