


function setNetFromConfig( net:core.NetWork, key){

	let encrypt = IGlobal.setting.getCommonSetting(UserSetting.TYPE_BOOLEAN, "encrypt", true)
	let decrypt = IGlobal.setting.getCommonSetting(UserSetting.TYPE_BOOLEAN, "decrypt", true)

	let encrypt_seed = IGlobal.setting.getCommonSetting(UserSetting.TYPE_NUMBER, "encrypt_seed", 11)
	let decrypt_seed = IGlobal.setting.getCommonSetting(UserSetting.TYPE_NUMBER, "decrypt_seed", 11)

	let sendSerialNumber = IGlobal.setting.getCommonSetting(UserSetting.TYPE_BOOLEAN, "send_serial_number", true)

	net.setEncrypt(encrypt, decrypt)
	//net.SetKey(encrypt_key, decrypt_key)
	net.setSeed(encrypt_seed, decrypt_seed)
	net.setSendSerialNumber(sendSerialNumber)
}

class LoginNetDispatcher extends MessageDispatcher{
	initObj(...params:any[]){
		setNetFromConfig(this.mNetWork, "login_net")
	}
	
}

class GameNetDispatcher extends MessageDispatcher{
	initObj(...params:any[]){
		setNetFromConfig(this.mNetWork, "game_net")
	}
}


var s_LoginNetDispatcher:LoginNetDispatcher = null;
function SendLoginMessage(message:MessageBase){
	if(PrecedureManager.getInstance().getCurrentPrecedureId() != PRECEDURE_LOGIN){
		return
	}

	if(s_LoginNetDispatcher == null){
		s_LoginNetDispatcher = LoginNetDispatcher.getInstance();
	}
	if(s_LoginNetDispatcher.isConnect() == false){
		return;
	}
	s_LoginNetDispatcher.sendPacket(message)
}


var s_GameNetDispatcher:GameNetDispatcher = null;
function SendGameMessage(message:MessageBase, wait?:boolean){
	if(PrecedureManager.getInstance().getCurrentPrecedureId() != PRECEDURE_GAME){
		return
	}

	if(s_GameNetDispatcher == null){
		s_GameNetDispatcher = GameNetDispatcher.getInstance();
	}

	if(s_GameNetDispatcher.isConnect() == false){
		return;
	}

	if(wait){
		//s_GameNetDispatcher.addWaitingMsg(message)
	}
	s_GameNetDispatcher.sendPacket(message)
}