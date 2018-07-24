

////////////////////////////////////////////////////////////////////////////////////////



//覆盖getCnsText方法
UiUtil.getCnsText = function(text:string):string{
	if(text == "" || text == null)
		return ""

	if(text.indexOf("$") != -1){
		
		if(this._CnsReg == null){
			this._CnsReg = /\$\{(.+)\}/g
		}

		text = StringUtil.stringReplaceWithReg(text, this._CnsReg, function(word:string):string{
			let key = word.substring(2, word.length-1) //字符串方式是:${hello}
			return Localize_cns(key)
		})

		return text;
	}
	//var cnsData = GameConfig.CnsConfig[key];
	// if(GAME_DEBUG && StringUtil.isAlphaNumber(text) == false){
	// 	for(let key in GameConfig.CnsConfig){
	// 		let cnsData = GameConfig.CnsConfig[key];
	// 		if(cnsData.msg == text){
	// 			TLog.Error("UiUtil.getCnsText====", text, String.format("${%s}", key))
	// 		}
	// 	}
	// }
	return text
}

////////////////////////////////////////////////////////////////////////////////////////


function Localize_net_i(key) {

	let netMsg = GameConfig.NetMsgConfig[tostring(key)]

	if (netMsg == null) {
		return "Localize_net_i Can't found " + tostring(key) + " from net_msg.csv!!!!ZZZzzzzzz....."
	} else {
		return netMsg.msg
	}
}

function Localize_net_s(key) {

	let netMsg = GameConfig.NetMsgConfig[key]

	if (netMsg == null) {
		return "Localize_net_s Can't found " + key + " from net_msg.csv!!!!ZZZzzzzzz....."
	} else {
		return netMsg.msg
	}
}

function Localize_netMsg_i(key) {

	let netMsg = GameConfig.NetMsgConfig[tostring(key)]

	if (netMsg == null) {
		return "Localize_netMsg_i Can't found " + tostring(key) + " from net_msg.csv!!!!ZZZzzzzzz....."
	} else {
		return netMsg
	}
}

function Localize_netMsg_s(key) {

	let netMsg = GameConfig.NetMsgConfig[key]

	if (netMsg == null) {
		return "Localize_netMsg_s Can't found " + tostring(key) + " from net_msg.csv!!!!ZZZzzzzzz....."
	} else {
		return netMsg
	}
}

function Localize_cns(key) {

	if (GameConfig.CnsConfig == null)
		return key;

	var cnsData = GameConfig.CnsConfig[key];
	if (cnsData == null)
		return key;
	else
		return cnsData.msg;
}

function Localize_info_cns(key) {

	let cnsData = GameConfig.CnsConfig[key]

	if (cnsData == null) {
		return { ['msg']: "Can't found " + key + " from cns.csv!!!!ZZZzzzzzz....." }
	} else {
		return cnsData
	}
}
