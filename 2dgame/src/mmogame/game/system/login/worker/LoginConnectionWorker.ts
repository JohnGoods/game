//登陆连接

class LoginConnectionWorker extends TClass{
	
    public initObj(...params:any[]):void{
		
	}   

    public  destory():void{

	}

	send():void{

		var brigeInfo = GameAccount.getInstance().getBrigeInfo();
		if(brigeInfo == null){
			TLog.Error("sendConnectRequest brigeInfo == nil");
			return 
		}
		var account:GameAccount = GameAccount.getInstance();
		
		var ip = account.getLoginIp();
		var port = account.getLoginPort();
		
		LoginNetDispatcher.getInstance().disconnect()
		LoginNetDispatcher.getInstance().connect(ip, port)
		
		//记录桥信息
		account.setAccountId(brigeInfo.identityId)
		account.setTimeStamp(brigeInfo.tstamp)
		account.setToken(brigeInfo.sign)
		account.setQDInfo(brigeInfo.qdKey, brigeInfo.code1,	brigeInfo.code2, brigeInfo.deviceid)
	}


}