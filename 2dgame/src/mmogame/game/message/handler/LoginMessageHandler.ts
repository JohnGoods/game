class LoginMessageHandler extends MessageHandler{

	scheduleEntryID:number;
	mLoginSystem:LoginSystem;

	public initObj(...params:any[]):void{

		this.mLoginSystem = LoginSystem.getInstance();

		this.scheduleEntryID = null;

		this.register(LoginOpcodes.L2C_CONNECT, this.onRecvL2C_CONNECT, this)//连接
		this.register(LoginOpcodes.L2C_VERVIRY_CODE, this.onRecvL2C_VERVIRY_CODE, this)//验证码
		this.register(ServerOpcodes.SMSG_LOGIN_USER, this.onRecvSMSG_LOGIN_USER, this)//用户登陆，如果有排队则开始
		this.register(LoginOpcodes.L2C_QUEUE_UPDATE, this.onRecvL2C_QUEUE_UPDATE, this)//排队更新

		this.register(LoginOpcodes.L2C_ROLE_LIST, this.onRecvL2C_ROLE_LIST, this)//获取角色列表
		this.register(LoginOpcodes.L2C_ROLE_CREATE, this.onRecvL2C_ROLE_CREATE, this)//获取创建的角色
		this.register(LoginOpcodes.L2C_ROLE_SELECT, this.onRecvL2C_ROLE_SELECT, this)//选择角色

		this.register(ServerOpcodes.SMSG_LOGOUT, this.onRecvSMSG_LOGOUT, this)//服务器踢人
		this.register(ServerOpcodes.SMSG_PONG, this.onRecvSMSG_PONG, this)//心跳
	}


	destory(){
		if(this.scheduleEntryID){
			KillTimer(this.scheduleEntryID);
			this.scheduleEntryID = null;
		}
	}

	public onTcpConnect(dispatcher:MessageDispatcher, message:TcpConnectMessage){

		if(message.code != 0){
			TLog.Error("LoginMessageHandler.onTcpConnect fail code:%d", message.code)
			//MsgSystem:ConfirmDialog_YES( Localize_cns("NET_ERROR1"))
			FireEvent(EventDefine.MSG_WAIT_END,null)
			LoginSystem.getInstance().onQuickLoginError(Localize_cns("NET_ERROR1") + message.code)
			return
		}

		var msg = GetMessage(LoginOpcodes.C2L_CONNECT); //发送登陆请求
		msg.name = GameAccount.getInstance().getLoginHostName();
		dispatcher.sendPacket(msg);

		if(this.scheduleEntryID == null){
			var index = 0
			let scheduTimerCallback = function(dt){
				index = index + 1
				var message = GetMessage(ServerOpcodes.CMSG_PING) ;//发送ping
				message.index = index
				dispatcher.sendPacket(message);
			}
			this.scheduleEntryID = SetTimer(scheduTimerCallback, this, 60000, true);
		}
	}

	public onTcpClose(dispatcher:MessageDispatcher, message:TcpCloseMessage){
		//if(message.code ~= 0){
		if(message.code != 0){
			TLog.Error("LoginMessageHandler.onTcpClose fail code:%d", message.code);
		}

		if(this.scheduleEntryID != null){
			KillTimer(this.scheduleEntryID);
			this.scheduleEntryID = null;
		}

		if(message.code != 0){
			//-ConfirmRetryLogin(Localize_cns("NET_CLOSE"), true)
			//throw()
			MsgSystem.confirmDialog_YES( Localize_cns("NET_CLOSE"))
		}
	}


	onRecvL2C_CONNECT(dispatcher:MessageDispatcher, message:any):void{
		TLog.Debug("LoginMessageHandler.onRecvL2C_CONNECT result:%s", message.result)
		if(message.result == 0){
			var message = GetMessage(LoginOpcodes.C2L_VERVIFY_CODE);//请求验证码
			dispatcher.sendPacket(message)
		}		
	}

	onRecvL2C_VERVIRY_CODE(dispatcher:MessageDispatcher, message:any):void{
		var username =  GameAccount.getInstance().getUserName();
		var password =  GameAccount.getInstance().getTimeStamp();
		var hostname =  GameAccount.getInstance().getLoginHostName();
		var accountId = GameAccount.getInstance().getAccountId();
		var token			=	GameAccount.getInstance().getToken();
		var qdInfo			=	GameAccount.getInstance().getQDInfo();
		
		var message = GetMessage(ServerOpcodes.CMSG_LOGIN_USER);
		message.hostname = hostname;
		//message.verify = 	 "abcd"
		message.verify =  "QD_Key="+qdInfo.qdKey+"&QD_Code1="+qdInfo.code1+"&QD_Code2="+qdInfo.code2+"&deveceid="+qdInfo.deviceid;
		message.username = username;
		message.password = password;
		message.accoutId = accountId;
		message.token = token;
		SendLoginMessage( message )//登陆
	}

	onRecvSMSG_LOGIN_USER(dispatcher:MessageDispatcher, message:any):void{
		if(message.result != 0){
			var text = errCode2Text(message.result)
			TLog.Error("LoginMessageHandler.onRecvSMSG_LOGIN_USER %d %s", message.result, text)
			//MsgSystem:ConfirmDialog_YES( string.format(Localize_cns(text), message.result) )
			return;
		}
		//FireEvent(EventDefine.LOGIN_CONNECT_SUCC,null);
	
		//设置账号信息
		GameAccount.getInstance().setLoginSessionId(message.sessionId);
		
		let serverGameId = this.mLoginSystem.getSelectServerGameID()
		let serverGroupIndex = this.mLoginSystem.getSelectServerGroupIndex()
		//let serverInfo = this.mLoginSystem.getRecentLoginServerInfo()
		//var serverName = serverInfo.ServerName;
		//IGlobal.setting.setCommonSetting(UserSetting.TYPE_STRING, "lastServerName", serverName);
		IGlobal.setting.setCommonSetting(UserSetting.TYPE_NUMBER, "lastServerGameId", serverGameId);
		IGlobal.setting.setCommonSetting(UserSetting.TYPE_NUMBER, "lastServerGroupIndex", serverGroupIndex);

		this.mLoginSystem.addRecentServerInfo(serverGameId, serverGroupIndex)

		this._doQueue(dispatcher, message.position);
	}

	onRecvL2C_QUEUE_UPDATE(dispatcher:MessageDispatcher, message:any):void{
		this._doQueue(dispatcher, message.position);
	}

	onRecvL2C_ROLE_LIST(dispatcher:MessageDispatcher, message:any):void{

		this.mLoginSystem.onRoleListUpdate(message.RoleList)
		if(message.RoleList.length == 0){
			FireEvent(EventDefine.LOGIN_REQUEST_SHOW_ROLESPEC,null);
		 	FireEvent(EventDefine.MSG_WAIT_END,null);
		}else{
			if(message.RoleList.length == 1){
				this.mLoginSystem.startGameConnection();
			}else{
				FireEvent(EventDefine.MSG_WAIT_END, null);	
				let wnd = WngMrg.getInstance().getWindow("LoginRoleListFrame")
	 			wnd.showWnd() 
			}
		}
	}

	onRecvL2C_ROLE_CREATE(dispatcher:MessageDispatcher, message:any):void{
		if(message.result != 0){
			if(PrecedureManager.getInstance().getCurrentPrecedureId() == PRECEDURE_LOGIN){
				MsgSystem.confirmDialog_YES(  Localize_cns("LOGIN_ROLE_CREATE_FAIL") )
			}
			return
		}

		var roleName = message.roleInfo.name;
		// var roleNameBase64 = GetBase64EncodeString(roleName, string.len(roleName))
		// var roleNameUrlEncode = UrlEncode(roleNameBase64)
		//print(roleName, roleNameUrlEncode)
		TLog.Debug("roleName", roleName);
		//SDKAnalyzer(SdkEventDefine.CREATE_ROLE_FINISH, roleNameUrlEncode)

		//var serverInfo = this.mLoginSystem.getRecentLoginServerInfo();
		//let recentGameId = LoginSystem.getInstance().getSelectServerGameID()
        //let recentGroupIndex = LoginSystem.getInstance().getSelectServerGroupIndex()

		//let serverInfo = {'ServerID' : tostring(recentGameId)}
		let serverInfo = LoginSystem.getInstance().getSelectSeverInfo()
		//var roleId = message.roleInfo.id;
		//var infoParam = "roleId=" + roleId +"&roleName="+roleName +"&serverId="+serverInfo.ServerID+"&serverName="+serverInfo.ServerName;
		//SdkHelper.getInstance():callSdk(SdkFunctionDefine.OnCreateRole, infoParam)
		//PrecedureManager.getInstance():changePrecedure(GAMESTATE_SELECTROLE)
		//IGlobal.gameSdk.reportRoleCreate(serverInfo.ServerID, serverInfo.ServerName, roleId, roleName);
		IGlobal.gameSdk.reportRoleCreate(serverInfo, message.roleInfo);
		this.mLoginSystem.onAddRoleInfo(message.roleInfo);
		this.mLoginSystem.startGameConnection();
	}

	onRecvL2C_ROLE_SELECT(dispatcher:MessageDispatcher, message:any):void{

		if(message.result != 0){
			var T = String.format(Localize_cns("LOGIN_ROLE_SELECT_FAIL"), message.result);
			this.mLoginSystem.onQuickLoginError(T)
			return
		}
		
		var roleInfo = this.mLoginSystem.getRoleInfoByIndex(0);

		//todo:yangguiming
		//GetHero():setLevel(roleInfo.level)
		
		//设置游戏账号信息
		GameAccount.getInstance().setGameIpAndPort(message.ip, message.port)
		GameAccount.getInstance().setGameSessionId(message.sessionId)
		
		//进入游戏世界流程
		PrecedureManager.getInstance().changePrecedure(PRECEDURE_GAME)
	}

	onRecvSMSG_LOGOUT(dispatcher:MessageDispatcher, message:any):void{
		var text = errCode2Text(message.result);
		TLog.Error("LoginMessageHandler.onRecvSMSG_LOGOUT %d %s", message.result, text);
	}

	onRecvSMSG_PONG(dispatcher:MessageDispatcher, message:any):void{
	}

	_doQueue(dispatcher:MessageDispatcher, pos:number){
		
		if(pos == 0){
			//如果是快速登陆或者跨服，就不用发送RoleList
			if(this.mLoginSystem.isQuickLogin() || IsCrossServer()){
				this.mLoginSystem.startGameConnectionWithLastRole()
			}else{
				var message = GetMessage(LoginOpcodes.C2L_ROLE_LIST)//请求角色列表
				//let serverinfo = LoginSystem.getInstance().getRecentLoginServerInfo()
				//message.groupIndex = serverinfo.groupIndex
            	let recentGroupIndex = LoginSystem.getInstance().getSelectServerGroupIndex()
				message.groupIndex = recentGroupIndex + 1
				dispatcher.sendPacket(message)
			}
			
		}else{
			//TODO：
			//排队暂时没做
		}
	}

}