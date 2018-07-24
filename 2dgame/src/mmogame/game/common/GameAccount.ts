class GameAccount extends TClass{

	mAccountId		= "";//账号ID
	mToken			= "";
	mUserName		= ""; //用户账号
	mUserLoginName	= "";//登陆账号显示的，如果平台没指定则用UserName
	mUserNickName	= "";//创建角色时用
	mTimeStamp		= "";

	mLoginIp		= "";
	mLoginPort		= 0;

	mLoginHostName	= "";
	mLoginSessionId	= "";

	mGameIp			= "";
	mGamePort		= 0;

	mGameSessionId  = "";

	mQdInfo:any				= null; //渠道信息
	mAuthorInfo:any			= null; //认证信息
	mBrigeInfo:any			= null; //桥连接信息



	setToken(value:string):void{
		this.mToken = value;
	}
	getToken():string{
		return this.mToken;
	}

	//账号ID
	setAccountId(value:string):void{
		this.mAccountId = value;
	}
	getAccountId():string{
		return this.mAccountId;
	}

	//用户名
	setUserName(value:string):void{
		this.mUserName = value;
	}
	getUserName():string{
		return this.mUserName;
	}

	//用户登陆显示名
	setUserLoginName(value:string):void{
		this.mUserLoginName = value;
	}
	getUserLoginName():string{
		return this.mUserLoginName;
	}

	//用户呢称
	setUserNickName(value:string):void{
		this.mUserNickName = value;
	}
	getUserNickName():string{
		return this.mUserNickName;
	}
	

	//密码
	setTimeStamp(value:string):void{
		this.mTimeStamp = value;
	}
	getTimeStamp():string{
		return this.mTimeStamp;
	}

	//登陆服务IP端口
	setLoginIpAndPort(id:string, port:number):void{
		this.mLoginIp = id;
		this.mLoginPort = port;
	}
	getLoginIp():string{
		return this.mLoginIp;
	}
	getLoginPort():number{
		return this.mLoginPort;
	}

	//登陆服务别名
	setLoginHostName(value:string):void{
		this.mLoginHostName = value;
	}
	getLoginHostName():string{
		return this.mLoginHostName;
	}


	//当前登陆服务会话ID
	setLoginSessionId(value:string):void{
		this.mLoginSessionId = value;
	}
	getLoginSessionId():string{
		return this.mLoginSessionId;
	}

	//游戏服务IP端口
	setGameIpAndPort(id:string, port:number):void{
		this.mGameIp = id;
		this.mGamePort = port;
	}
	getGameIp():string{
		return this.mGameIp;
	}
	getGamePort():number{
		return this.mGamePort;
	}

	//当前登陆服务会话ID
	setGameSessionId(value:string):void{
		this.mGameSessionId = value;
	}
	getGameSessionId():string{
		return this.mGameSessionId;
	}



	//渠道信息
	setQDInfo(qdKey:string, code1:string, code2:string, deviceid:string):void{
		this.mQdInfo = this.mQdInfo || {};
		this.mQdInfo.qdKey = qdKey;
		this.mQdInfo.code1 = code1;
		this.mQdInfo.code2 = code2;
		this.mQdInfo.deviceid = deviceid;
	}
	getQDInfo():any{
		return this.mQdInfo;
	}


	//认证信息
	setAuthorInfo(authorInfo:any):void{
		this.mUserName = "";
		if(authorInfo){
			this.mUserName = authorInfo.userId;
			if(authorInfo.userId == null){
				this.mUserName = authorInfo.openid;
			}

			this.mUserNickName = authorInfo.nickname; //创建角色时用

			this.mUserLoginName = authorInfo.title; //显示登陆时用
			if(authorInfo.title == null ){
				this.mUserLoginName = this.mUserName
			}
		}
		this.mAuthorInfo = authorInfo;
	}

	getAuthorInfo(){
		return this.mAuthorInfo;
	}

	//桥连接信息
	setBrigeInfo(value:any):void{
		this.mBrigeInfo = value;
	}
	getBrigeInfo(){
		return this.mBrigeInfo;
	}

}