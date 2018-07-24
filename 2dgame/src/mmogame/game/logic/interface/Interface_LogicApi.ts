var globalInpueStatusList: any = {}
function SetGlobalInputStatus(status, key) {
	let setStatus = true
	//TLog.Debug("SetGlobalInputStatus",size_t(globalInpueStatusList),setStatus)
	if (status) {
		delete globalInpueStatusList[key]
		for (let i in globalInpueStatusList) {
			let v = globalInpueStatusList[i]

			if (v == false) {
				setStatus = false
				break
			}
		}
	} else {
		globalInpueStatusList[key] = status
		setStatus = false
	}

	IGlobal.guiManager.setInputEnable(setStatus)
}

function WriteIntoFile(fileName: string, str: string, bReWrite: boolean) {
	IGlobal.setting.setRoleSetting(UserSetting.TYPE_STRING, fileName, str )
}

function ReadFromFile(fileName: string):string {
	let readData = IGlobal.setting.getRoleSetting(UserSetting.TYPE_STRING, fileName, "")
	return readData;
}

//两种加入超链接的写法
//color.length|%s|描述文字XXX.length
//LinkSign +(%d);(%d+);(%d+);(.+) +LinkSign，第二种方法需要用到这个公共接口ContentParseLinkHandler
function ContentParseLinkHandler(linkContent, showColor) {
	let info: any = {}
	info.link = null
	info.name = null
	info.color = null
	let [linkType, playerId, targetId, content] = StringUtil.stringMatch(linkContent, /(\d);(\d+);(\d+);(.+)/)
	info.name = content
	info.link = StringUtil.stringReplace(linkContent, " ", "-")
	info.color = showColor || "orange"
	if ((!playerId) || (!targetId) || (!content)) {
		return null
	}
	return info
}

//接上，针对第一种提供一种通用组合接口（主要是定义常用的用于统一奖励结构的解释）
function GenXMLStyleLinkContent(v, showColor) {						//v = {"item", entryId, count}
	let pstr = ""						//|1;entryid|		1物品；2伙伴
	let color = showColor || " #red"
	if (v[0] == "item") {
		if (!v[2] || v[2] <= 1) {
			pstr = color + "|1;" + v[1] + "|" + ItemSystem.getInstance().getItemName(v[1])
		} else {
			pstr = color + "|1;" + v[1] + "|" + ItemSystem.getInstance().getItemName(v[1]) + "#rf*" + v[2]
		}
	} else if (v[0] == "rmb") {				//钻石
		if (!v[1] || v[1] <= 1) {
			pstr = color + "|1;" + SpecailItemId.GOLD + "|" + ItemSystem.getInstance().getItemName(SpecailItemId.GOLD)
		} else {
			pstr = color + "|1;" + SpecailItemId.GOLD + "|" + ItemSystem.getInstance().getItemName(SpecailItemId.GOLD) + "#rf*" + v[1]
		}
	} else if (v[0] == "funs") {			//金币
		if (!v[1] || v[1] <= 1) {
			pstr = color + "|1;" + SpecailItemId.FUNDS + "|" + ItemSystem.getInstance().getItemName(SpecailItemId.FUNDS)
		} else {
			pstr = color + "|1;" + SpecailItemId.FUNDS + "|" + ItemSystem.getInstance().getItemName(SpecailItemId.FUNDS) + "#rf*" + v[1]
		}
	} else if (v[0] == "pet") {
		pstr = color + "|2;" + v[1] + "|" + PetSystem.getInstance().getPetName(v[1]) + "#rf*1"
	}

	return pstr
}

function HandleXMLStyleHyperLink(link){
	let [ltype_, entryId] = StringUtil.stringMatch(link, /(\d+);(\d+)/)
	
	let ltype = tonumber(ltype_) || 0
	entryId = tonumber(entryId) || 0
	if(ltype == 1 ){				//物品
		ItemSystem.getInstance().showItemTipsByEntry(entryId)
	}else{
		PetSystem.getInstance().showPetTipsByEntry(entryId)
	}
}


function AddRdContent(rd: gui.RichDisplayer, content: string, ft, color?, dis?, rffont?, setBottom?, addNew?, linkShowColor?) {

	let rdtest = <any>rd
	if(!addNew){
		if(rdtest._content_ == content && rdtest._font_ == ft && rdtest._fontColor_ == color){
			return
		}
		rdtest._content_ = content
		rdtest._font_ = ft
		rdtest._fontColor_ = color
	}

	if (!addNew) {
		rd.clear()
	}

	let font: any = {}
	font.no_change_font = true
	font.defalut_font = ft
	font.default_color = color || "white"
	font.link_parser = ContentParseLinkHandler								//默认第二种链接方式
	font.showColor = linkShowColor || "springgreen"

	rffont = rffont || "#rf"
	//content = string.gsub(content, "#rf", rffont)
	content = StringUtil.stringReplace(content, "#rf", rffont)


	if (dis != null) {
		rd.setRowDistance(dis)
	} else {
		rd.setRowDistance(0)
	}


	let xml = XmlConverter.parseText(content, font)
	rd.addXmlString(xml)

	//rd.showLastRow()

	// if (!setBottom) {
	// 	rd.ScrollToXY(0, 0, false)
	// }
}

//调整坐标
function AdjustRdContentViewH(rd: gui.RichDisplayer, minH?: number) {
	if (minH == null) {
		minH = 120;
	}

	let get_h = rd.getLogicHeight();
	if (get_h < minH) {
		get_h = minH
	} else {
		get_h = get_h + 5
	}

	rd.height = get_h;

	UiUtil.setWH(rd, rd.width, get_h);

	return get_h
}

function AdjustRdContentViewW(rd: gui.RichDisplayer, offW) {
	let w = rd.getLogicWidth() + (offW || 0)
	//UiUtil.setWH(rd, w, rd.height);
	rd.width = w;
}

//自动调整数据格式
//取小数点后指定位小数，如果小数部分刚好全为0则返回整数
function AdjustNumberFont(num, pointCount) {
	pointCount = pointCount
	let str = String.format("%." + pointCount + "f", num)


	let result = StringUtil.stringMatch(str, /(\d+).(\d+)/)
	if (result == null) {
		return num;
	}

	let num1 = result[0], num2 = result[1]
	if (tonumber(num2) == 0) {
		return tonumber(num1)
	} else {
		return tonumber(str)
	}
}

function DrawNumberStringImage(bam, piefix, point, targetX?: number, targetY?: number, spaceX?: number){					//自动居中处理
	let parent = bam.parent
	bam.beginDraw();
	let w = bam.drawNumberString(piefix, point, targetX || 0, targetY || 0, spaceX || 0);
	bam.endDraw();

	bam.x = (parent.width - w) / 2
}

function IsFunctionOpen(func_bit) {
	let errantry = GetHeroProperty("errantry")

	if (errantry && bit.band(errantry, Math.pow(2, (func_bit - 1))) != 0) {
		return true
	} else {
		return false
	}
}


function SetRoleFunctionSetting(func_bit, isClose?) {
	//TLog.Debug("SetRoleFunctionSetting",func_bit,isClose)
	// if (!table_isExist(RoleFunctionSetting, func_bit)) {
	// 	return false
	// }

	let errantry = GuideSystem.getInstance().getFuncState()
	let changeType = 0
	if (isClose) {
		errantry = StringUtil.changeBit(errantry, func_bit, "0")
	} else {
		//TLog.Debug("1111111111111111111", errantry, string.sub(errantry, func_bit, func_bit))

		if (StringUtil.getBit(errantry, func_bit) == "1") {
			return
		}
		errantry = StringUtil.changeBit(errantry, func_bit, "1")
		changeType = 1
	}

	GuideSystem.getInstance().setFuncState(errantry)
	let message = GetMessage(opCodes.C2G_ROLE_NEWBIE_CHANGE)
	message.errantry = func_bit
	message.changeType = changeType
	SendGameMessage(message)

	return true
}






//品质底框
// function GetActorQualityImage(entryId, breakLevel) {
// 	let imageName = ""
// 	if (GameConfig.ProfessionConfig[entryId]) {
// 		imageName = ProfessionSystem.getInstance().getProfessionQualityImage(entryId)
// 	} else {
// 		imageName = PetSystem.getInstance().getPetQualityName(breakLevel)
// 	}

// 	return imageName
// }


//获取名称品质图片
// function GetQualityNameImage(entryId, breakLevel) {
// 	let imageName = ""
// 	// if (GameConfig.ProfessionConfig[entryId]) {
// 	// 	imageName = ProfessionSystem.getInstance().getProfessionQualityBG(entryId)
// 	// } else {
// 		imageName = PetSystem.getInstance().getPetQualityNameBG(breakLevel)
// 	//}

// 	return imageName
// }


//战斗中的半身像
// function GetActorZhanDouBust(entryId, sex?, breakLevel?, qualityLevel?) {
// 	let bust = _GetActorBust(entryId, sex, breakLevel, qualityLevel)
	
// 	return "zhanDou_" + bust
// }

//战斗中的小半身像
// function GetActorZhanDouXiaoBust(entryId, sex?, breakLevel?) {
// 	let bust = _GetActorBust(entryId, sex, breakLevel)

// 	return "zhanDou_xiaoTu_" + bust
// }

// function GetActorBust(entryId, sex?, breakLevel?, qualityLevel?) {
// 	let bust = _GetActorBust(entryId, sex, breakLevel, qualityLevel)
// 	return "bust_" + bust;
// }

//半身像
// function _GetActorBust(entryId, sex?, breakLevel?, qualityLevel?) {
// 	let bust = 3001

// 	if (GameConfig.PetConfig[entryId]) {
// 		breakLevel = breakLevel || 0
// 		qualityLevel = qualityLevel || 0
// 		if (GameConfig.PetModelConfig[entryId] && GameConfig.PetModelConfig[entryId][breakLevel]) {
// 			bust = GameConfig.PetModelConfig[entryId][breakLevel][qualityLevel].bust
// 		}
// 	} else if (GameConfig.MonsterConfig[entryId]) {
// 		bust = GameConfig.MonsterConfig[entryId].bust
// 	} else if (GameConfig.ProfessionConfig[entryId]) {
// 		sex = checkNull(sex, 1)
// 		bust = GameConfig.ProfessionModelConfig[entryId][sex].bust
// 	}

// 	return bust
// }



//下一帧执行
function DelayEvecuteFunc(delay, func, thisobj?, param?) {
	let timer = null
	function tick(de) {
		if (timer) {
			KillTimer(timer)
			timer = null
		}
		return func.call(thisobj, param)
	}

	timer = SetTimer(tick, thisobj, delay)
}

//按事件延迟执行
function DelayEventEvecuteFunc(event, func, obj, param?) {
	//let callback = null
	let _this: any = {}
	function callback(args) {
		UnRegisterEvent(event, callback, _this)

		if(PrecedureManager.getInstance().getCurrentPrecedureId() != PRECEDURE_GAME){
			return
		}
		return func.call(obj, args, param)
	}

	RegisterEvent(event, callback, _this)
}


//获得离线多久的字符串
function GetLastLogoutTimeStr(logoutTime) {
	if (logoutTime < 0) {
		return Localize_cns("CLUB_TXT49")
	}

	let serverTime = GetServerTime()

	let ONE_HOUR_SEC = 3600 //一个小时
	let ONE_DAY_SEC = 86400 //一天时间


	let diffTime = serverTime - logoutTime
	if (diffTime < 0) { //在线
		return Localize_cns("CLUB_TXT49")
	} else {
		let str = ""
		if (diffTime < ONE_HOUR_SEC) {
			str = String.format(Localize_cns("OUT_LINE_MON"), Math.floor(diffTime / 60))
		} else if (diffTime < ONE_DAY_SEC) {
			str = String.format(Localize_cns("OUT_LINE_HOUR"), Math.floor(diffTime / ONE_HOUR_SEC))
		} else {
			str = String.format(Localize_cns("OUT_LINE_DAY"), Math.floor(diffTime / ONE_DAY_SEC))
		}
		return str
	}
}

//查看录像
function GetFightVideo(videoId, roleId) {
	if (CheckFightState() == true) {
		return
	}
	
	FireEvent(EventDefine.MSG_WAIT_BEGIN, null)
	let message = GetMessage(opCodes.C2G_FIGHT_CHAMPION_VIEDO)
	message.viedoID = videoId
	message.roleId = roleId
	SendGameMessage(message)

}

//查看跨服录像
function GetGlobalFightVideo(videoId, roleId){
	//FireEvent(EventDefine.COMBAT_FIGHT_VIDEO_APPLY, null)
	if (CheckFightState() == true) {
		return
	}
	
	FireEvent(EventDefine.MSG_WAIT_BEGIN,null)
	let message = GetMessage(opCodes.C2G_FIGHT_GLOBAL_VIEDO)
	message.viedoID = videoId
	message.roleId = roleId
	SendGameMessage(message)
	
}

function RefreshNearActor(){
	let message = GetMessage(opCodes.C2G_ROLE_REFRESH_NPC)
	SendGameMessage(message)
}

function ExecuteNoticeCmdLink(link) {
	////6;1;世界BOSS//
	//非生活场景返回
	if (StateManager.getInstance().GetCurrentStateType() != state_type.LIVE_BASE_STATE
		|| IsInGlobalActvity() != null) {
		return
	}

	let [linkType, wndIndex, content] = StringUtil.stringMatch(link, /(\d+);(\d+);(.+)/)
	if (!linkType || !wndIndex || !content) {
		return null
	}

	linkType = tonumber(linkType)
	wndIndex = tonumber(wndIndex)

	if (wndIndex == wndToJump.FINAL_DRAGON) {				//世界BOSS
		ExecuteMainFrameFunction("boss")
	} else if (wndIndex == wndToJump.MESS_WORLD) {			//圣地
		//ExecuteMainFrameFunction("shengdi")
	} else if (wndIndex == wndToJump.QRENA) {						//竞技场
		ExecuteMainFrameFunction("jingjichang")
	} else if (wndIndex == wndToJump.SKY_TOWER) {				//试练场
		ExecuteMainFrameFunction("shilian")
	} else if (wndIndex == wndToJump.PET_RECRUIT) {			//
		//MsgSystem.addTagTips(Localize_cns("PROFE_NOT_OPEN_TXT"))
	} else if (wndIndex == wndToJump.NOBLE_EXAMINE) {		//贵族答题
		ExecuteMainFrameFunction("dati")
	}
}





function IsClientAutoShowUI(){																				//判断是否可以自动弹出界面
	if(StateManager.getInstance().GetCurrentStateType() != state_type.LIVE_BASE_STATE ){
		return false
	}
	
	if(IsInGlobalActvity() != null ){
		return false
	}
	
	if(GuideSystem.getInstance().isCanClientAutoUI() && FightSystem.getInstance().isFight() == false ){
		return true
	}
	
	return false
}




// function IsHeroInfo(info){
// 	if(info == null ){
// 		return false
// 	}
	
// 	return info.id == GetHeroProperty("id")

// }


// function GetActorInfoByEntry(entryId){
// 	// if( entryId <= 0)
// 	// 	return null;

// 	let actorInfo = null
// 	if(GameConfig.PetConfig[entryId] ){
// 		 actorInfo = PetSystem.getInstance().getPetInfoEntry(entryId)
// 	}else{
// 		actorInfo = GetHeroPropertyInfo()
// 	}
// 	return actorInfo
// }

function ChatWithPlayerInfo(playerInfo){
	let playerId = playerInfo.roleId
	let playerName = playerInfo.roleName
	let friendInfo = FriendSystem.getInstance().getFriendInfo(playerId)		
	if(friendInfo == null){
		let newStrangeInfo = StrangerInfo.newObj(playerInfo.roleId, playerInfo.roleName, playerInfo.vocation, "", playerInfo.sexId, playerInfo.VipLevel, playerInfo.level)
		FriendSystem.getInstance().addChatStranger(newStrangeInfo)
	}

	let window = WngMrg.getInstance().getWindow("ChatFrame")
	window.chatWithPlayer(playerId, playerName)
}


function ChatWithPlayer(playerId, playerName?){

	let newStrangeInfo = null
	
	let friendInfo = FriendSystem.getInstance().getFriendInfo(playerId)		
	if(friendInfo == null ){
			//尝试找周围的
			let player = ActorManager.getInstance().getPlayer(playerId)
			if(player ){
				let playerInfo = player.getPropertyInfo()
				newStrangeInfo = StrangerInfo.newObj(playerInfo.id, playerInfo.name, playerInfo.vocation, "", playerInfo.sexId, playerInfo.VIP_level, playerInfo.level)
			}
			
			if(newStrangeInfo == null ){
				let msgPacket = ChannelMrg.getInstance().findMsgPacket(playerId)
				if(msgPacket ){
					newStrangeInfo = StrangerInfo.newObj(msgPacket.roleId, msgPacket.name, msgPacket.vocation, msgPacket.icon, msgPacket.sexId, msgPacket.VipLevel, msgPacket.level)
					newStrangeInfo.force = msgPacket.force
					if(msgPacket.offlineChat ){
						newStrangeInfo.isOnline = 0
					}
				}
			}
	}
	
	if(newStrangeInfo ){
		FriendSystem.getInstance().addChatStranger(newStrangeInfo)
	}

	
	let window = WngMrg.getInstance().getWindow("ChatFrame")
	window.chatWithPlayer(playerId, playerName)
}

// function EnterRoleActivitySpace(actIndex){
// 	let message = GetMessage(opCodes.C2G_ROLE_ENTER_SPACE)
// 	message.actIndex = actIndex
// 	SendGameMessage(message)
// }

// function LeaveRoleActivitySpace(){
// 	let message = GetMessage(opCodes.C2G_ROLE_LEAVE_SPACE)
// 	SendGameMessage(message)
// }

function ExecuteMainFrameLink(_type: string, _index?: number) {
	if (_type == "enterclubmap") { //进入帮会地图
		let a = GetActivity(ActivityDefine.ClubMap)
		a.requestStart()
	} else {
		if (_index == null) {
			ExecuteMainFrameFunction(_type)
		} else {
			let window = WngMrg.getInstance().getWindow(_type)
			window.hideWnd()
			window.showWithIndex(_index)
		}
	}
}


//获取S1name玩家名字
function GetServerPlayerName(gameId, groupId, playName){
	// if(gameId <= 1000){
	// 	return "S"+gameId + playName;
	// }
	if(ServerConfig.gameList[gameId] == null){
		return playName;
	}
	let serverInfo = LoginSystem.getInstance().getServerInfoByGameGroup(gameId, groupId - 1)
	if(serverInfo == null){
		return playName;
	}
	let serverId = serverInfo.id
	return "S" + (serverId+1) + playName;
}