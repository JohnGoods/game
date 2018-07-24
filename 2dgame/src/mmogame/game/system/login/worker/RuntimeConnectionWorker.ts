//登陆连接
//连接游戏服
class RuntimeConnectionWorker extends TClass{
	userData:any;

    public initObj(...params:any[]):void{
		this.userData = params[0];
	}   

    public  destory():void{

	}

	send():void{
		var message = GetMessage(LoginOpcodes.C2L_ROLE_SELECT)
		message.playerId = this.userData.id
		SendLoginMessage(message)
	}


}