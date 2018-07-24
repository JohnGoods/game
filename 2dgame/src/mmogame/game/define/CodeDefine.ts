
/*
作者:
    yangguiming
	
创建时间：
   2013.6.07(周五)

意图：
   客户端定义的操作码

公共接口：
   
*/


var ServerOpcodes:any = {
	MSG_NULL							: 0,
	CMSG_PING							: 1,
	SMSG_PONG							: 2,
	CMSG_COMM							: 10,
	CMSG_LOGIN						: 11,
	SMSG_LOGIN						: 12,
	CMSG_LOGOUT						: 13,
	SMSG_LOGOUT						: 14,
	CMSG_LOGIN_USER				: 15, // 用于登陆服
	SMSG_LOGIN_USER				: 16, // 用于登陆服
	//CMSG_CONNECT					: 17, // 用于登陆服
	//SMSG_CONNECT					: 18, // 用于登陆服
}

var ServerOpcodesName:any = {}
for(let k in ServerOpcodes){
			let v = ServerOpcodes[k]
	
	ServerOpcodesName[v] = k
}

var LoginOpcodes:any = {
	C2L_CONNECT						: 17,
	L2C_CONNECT						: 18,
	C2L_STATE							: 22,
	L2C_STATE							: 23,
	C2L_VERSION						: 24,	//获得版本号
	L2C_VERSION						: 25,
	C2L_VERVIFY_CODE			: 26,	//获得认证码
	L2C_VERVIRY_CODE			: 27,
	C2L_ROLE_SELECT				: 28,
	L2C_ROLE_SELECT				: 29,
	C2L_ROLE_LIST					: 30,
	L2C_ROLE_LIST					: 31,
	C2L_ROLE_CREATE				: 32,
	L2C_ROLE_CREATE				: 33,
	
	L2C_QUEUE_UPDATE			: 36,
}

var LoginOpcodesName:any = {}
for(let k in LoginOpcodes){
			let v = LoginOpcodes[k]
	
	LoginOpcodesName[v] = k
}


var ErrorCode:any = {
	ERR_OK : 0,
	//ERR_UNKNOWN : 1,
	//ERR_USERNAME_FAIL : 2,							// 用户名错
	//ERR_PASSWD_FAIL : 3,								// 密码错
	
	//ERR_USER_BLANK : 2,									//用户名为空
	//ERR_PSW_BLANK : 3,									//密码为空
	ERR_USER_NULL	: 4,									//用户名不存在
	ERR_PSW_FAIL : 5,										//密码错误
	

	ERR_LOGIN_REPEAT	: 1001,						// 重复登陆
	ERR_REGIONSERVER_FAIL : 1002,				// 大区校验服务器出错
	ERR_VERIFYCODE_MISMATCH  : 1003,		// 校验码错
	ERR_SESSIONKEY_FAIL : 1004,					// 临时密码错误

	ERR_GAMESERVER_UNREACHED : 1005,		// 没法连接游戏服务器
	ERR_FORBID_LOGIN : 1006,						// 禁止登陆（比如当前账号在战斗）

	ERR_DBSERVER_UNREACHED : 1007,			// 没法连接数据库服务器

	ERR_FORCE_LOGOUT : 1008,            // 强制退出
	ERR_CONNECT_NOTFOUND : 1009,				// 没有找到连接服
	ERR_ATIVESERVER_FAIL : 1010,				// 未激活
	ERR_RELAY_HOST			: 1011,					//host错误
	ERR_REACH_MAXLIMIT : 1012,					//达到最大连接数
}


var StaticTexDefine:any = {}

//错误码文本
function errCode2Text( result){
	let msg = null
	if(result == ErrorCode.ERR_UNKNOWN ){
		msg = "ERR_UNKNOWN"
	//}else if(result == ErrorCode.ERR_USERNAME_FAIL ){
	//	msg = "ERR_USERNAME_FAIL"
	//}else if(result == ErrorCode.ERR_PASSWD_FAIL ){
	//	msg = "ERR_PASSWD_FAIL"
	}else if(result == ErrorCode.ERR_USER_NULL ){
		msg = "ERR_USER_NULL"
	}else if(result == ErrorCode.ERR_PSW_FAIL ){
		msg = "ERR_PSW_FAIL"
	}else if(result == ErrorCode.ERR_LOGIN_REPEAT ){
		msg = "ERR_LOGIN_REPEAT"
	}else if(result == ErrorCode.ERR_REGIONSERVER_FAIL ){
		msg = "ERR_REGIONSERVER_FAIL"
	}else if(result == ErrorCode.ERR_VERIFYCODE_MISMATCH ){
		msg = "ERR_VERIFYCODE_MISMATCH"
	}else if(result == ErrorCode.ERR_SESSIONKEY_FAIL ){
		msg = "ERR_SESSIONKEY_FAIL"
	}else if(result == ErrorCode.ERR_GAMESERVER_UNREACHED ){
		msg = "ERR_GAMESERVER_UNREACHED"
	}else if(result == ErrorCode.ERR_FORBID_LOGIN ){
		msg = "ERR_FORBID_LOGIN"
	}else if(result == ErrorCode.ERR_DBSERVER_UNREACHED ){
		msg = "ERR_DBSERVER_UNREACHED"
	}else if(result == ErrorCode.ERR_FORCE_LOGOUT ){
		msg = "ERR_FORCE_LOGOUT"
	}else if(result == ErrorCode.ERR_CONNECT_NOTFOUND ){
		msg = "ERR_CONNECT_NOTFOUND"
	}else if(result == ErrorCode.ERR_ATIVESERVER_FAIL ){
		msg = "ERR_ATIVESERVER_FAIL"
	}else if(result == ErrorCode.ERR_RELAY_HOST ){
		msg = "ERR_RELAY_HOST"
	}else if(result == ErrorCode.ERR_REACH_MAXLIMIT ){
		//enter_game_transition.destroy_change()
		msg = "ERR_REACH_MAXLIMIT"		
	}else{
		msg = "ERR_ERROR_OTHER"		
	}
	
	//TLog.Debug("login_net.ShowErrCode", result)
	//if(msg ){
	//	MsgSystem.ConfirmDialog_YES( string.format(Localize_cns(msg), result) )
	//}
	return msg
}