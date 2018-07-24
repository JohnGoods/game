let MaxWidthOneRow = 306
let ChatWndHeight = 70

class ChatFrame extends BaseWnd {

	friendsScroll: UIScrollList;
	chatListScroll: UIScrollList;

	needToInit: boolean;
	duiHuaNum: any;
	duiHuaHeight: any;
	friendId: number;
	friendName: string;
	chatIndex: number;
	inputType: number;
	totalWndNumber: number;

	parentWnd: eui.Group;

	controlDataTable: any;

	saveVoiceList: any;
	// tabNum;
	// table_index;


	public initObj(...args: any[]): void {
		this.needToInit = true
		this.duiHuaNum = {}
		this.duiHuaHeight = {}
		this.friendId = -1
		this.chatIndex = 0
		this.inputType = 1   //1 文字 2 语言

		this.totalWndNumber = 0
		this.mLayoutPaths = ["resource/layouts/ChatLayout.exml"]
	}

	onLoad() {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo: any[] = [
			{ ["name"]: "edit_input", ["font"]: "ht_24_lc", ["color"]: gui.Color.aliceblue, ["event_name"]: egret.TouchEvent.CHANGE, ["fun_index"]: this.onContentChanged },
			{ ["name"]: "btn_biaoqing", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBiaoqing },
			{ ["name"]: "btn_send", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSendMsg },
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBackWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onCloseWnd },
			//{ ["name"]: "btn_close_top1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBackWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);



		let friendsParent:eui.Group = this.mElemList["group_friends"]
		this.friendsScroll = UIScrollList.newObj(this.mLayoutNode, "friendsScroll", 0, 0, friendsParent.width, friendsParent.height, friendsParent)

		let chatParent:eui.Group = this.mElemList["group_friendschat"]
		this.chatListScroll = UIScrollList.newObj(this.mLayoutNode, "chatListScroll", 0, 0, chatParent.width, chatParent.height, chatParent)


	}

	onUnLoad() {

	}

	onShow() {
		RegisterEvent(EventDefine.MESSAGE_UPDATE, this.onMessageCome, this)
		//RegisterEvent(EventDefine.FRIEND_DELETE_UPDATE, this.updateFrame, this)
		RegisterEvent(EventDefine.FRIEND_LIST_UPDATE, this.refreshFrame, this)
		RegisterEvent(EventDefine.FRIEND_ONOFF_LINE, this.refreshFrame, this)

		RegisterEvent(EventDefine.SEARCH_PLAYER_RESULT, this.onSearchResule, this)
		this.mLayoutNode.visible = true;

		this.needToInit = true
		this.refreshFrame()
	}

	onHide() {
		UnRegisterEvent(EventDefine.MESSAGE_UPDATE, this.onMessageCome, this)
		//UnRegisterEvent(EventDefine.FRIEND_DELETE_UPDATE, this.updateFrame, this)
		UnRegisterEvent(EventDefine.FRIEND_LIST_UPDATE, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.FRIEND_ONOFF_LINE, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.SEARCH_PLAYER_RESULT, this.onSearchResule, this)
		this.mLayoutNode.visible = false;
	}

	refreshFrame() {
		this.controlDataTable = {}
		if(this.refreshFriends()){
			this.refreshChat()
		}else{
			FriendSystem.getInstance().setChatBtnShowFlag(false)
			FireEvent(EventDefine.FRIEND_CHAT_BTN_UPDATE,null)
			this.hideWnd();
		}
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////-
	//刷新好友
	refreshFriends() {
		//FriendSystem.getInstance().removeIconMsgInfoByType("MESSAGE_ONE")
		MsgSystem.removeIconMsgByType(IconMsgType.FRIEND_CHAT);
		let sortFrindList = []

		//正在聊天的
		let messageInfoList = FriendSystem.getInstance().getMessageInfoList()
		let showCount = 0
		for (let roleId in messageInfoList) {
			//let messageInfo:MessageInfo = messageInfoList[_]

			let friendInfo = FriendSystem.getInstance().getChatPlayerInfo(tonumber(roleId))
			if (friendInfo) {
				JsUtil.arrayInstert(sortFrindList, friendInfo)
			}
		}

		let friendList = FriendSystem.getInstance().getFriendInfoList()
		let friendInfo = friendList[this.friendId]
		if (friendInfo != null && messageInfoList[this.friendId] == null) {
			JsUtil.arrayInstert(sortFrindList, friendInfo)
		}

		let strangerList = FriendSystem.getInstance().getChatStrangerList()
		friendInfo = strangerList[this.friendId]
		if (friendInfo != null && messageInfoList[this.friendId] == null) {
			JsUtil.arrayInstert(sortFrindList, friendInfo)
		}


		if(sortFrindList.length == 0){
			return false;
		}

		//好友
		// let friendList = FriendSystem.getInstance().getFriendInfoList()
		// for (let roleId in friendList) {
		// 	let friendInfo = friendList[roleId]

		// 	if (messageInfoList[roleId] == null) {
		// 		JsUtil.arrayInstert(sortFrindList, friendInfo)
		// 	}
		// }

		// let strangerList = FriendSystem.getInstance().getChatStrangerList()
		// for (let roleId in strangerList) {
		// 	let friendInfo = strangerList[roleId]

		// 	if (messageInfoList[roleId] == null) {
		// 		JsUtil.arrayInstert(sortFrindList, friendInfo)
		// 	}
		// }

		// friendList = FriendSystem.getInstance().getFriendInfoList()
		// for (let roleId in messageInfoList) {
		// 	let friendInfo = messageInfoList[roleId]

		// 	if (messageInfoList[roleId] == null) {
		// 		JsUtil.arrayInstert(sortFrindList, friendInfo)
		// 	}
		// }

		//排序(先在线，再等级)
		table_sort(sortFrindList, function (a, b) {
			let aLastChat = FriendSystem.getInstance().getFriendLastChat(a.roleId)
			let bLastChat = FriendSystem.getInstance().getFriendLastChat(b.roleId)
			let aLastTime = aLastChat && aLastChat.time || -1
			let bLastTime = bLastChat && bLastChat.time || -1
			if (aLastTime != bLastTime) {
				return bLastTime - aLastTime
			}


			if (a.isOnline != b.isOnline) {
				return b.isOnline - a.isOnline
			}
			if (a.level != b.level) {
				return b.level - a.level
			}

			return b.roleId - a.roleId
		})

		if (this.friendId < 0 && sortFrindList.length > 0) {
			let v = sortFrindList[0]
			this.friendId = v.roleId
			this.friendName = v.roleName
			this.needToInit = true
		}

		if (this.friendId > 0) {
			FriendSystem.getInstance().setFriendMsgCountZero(this.friendId)
		}

		let selectIndex = 0

		let scroll = this.friendsScroll
		scroll.clearItemList()

		let list = []
		for (let k = 0; k < sortFrindList.length; k++) {
			let v = sortFrindList[k]
			if(v.roleId >=0){
				table_insert(list,v)
			}
		}
		
		for (let k = 0; k < list.length; k++) {
			let v = list[k]

			let [window, flag] = scroll.getItemWindow(k, 170, 133, 0, 0)
			if (flag == true) {
				this.initItemWindow(window, k)
			}
			this.refreshItemWindow(window, v ,k)

			if (v.roleId == this.friendId) {
				selectIndex = k
			}
		}

		// scroll.refreshScroll()
		if (this.needToInit) {
			if (selectIndex >= 0) {
				scroll.moveToScrollIndex(selectIndex)
			}
		}

		return true;
	}



	initItemWindow(window: eui.Group, i) {
		let name = i
		let width = window.width, height = window.height

		let Info: any = [
			//背景
			{ ["index_type"]: gui.Grid9Image, ["name"]: name + "selectbg", ["title"]: null, ["font"]: null, ["image"]: "lt_siLiaoDi03", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: 170, ["h"]: 133, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFriendChat, },

			{ ["index_type"]: eui.Group, ["name"]: name + "petboxbg", ["title"]: null, ["font"]: null, ["image"]: null, ["color"]: null, ["x"]: 5, ["y"]: 0, ["w"]: 170, ["h"]: 133, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },

			{ ["index_type"]: eui.Image, ["name"]: name + "weiduBg", ["title"]: "", ["font"]: "ht_18_cc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 100, ["y"]: 0, ["w"]: 40, ["h"]: 40, ["event_name"]: null, ["fun_index"]: null, },
			// { ["index_type"]: eui.Label, ["name"]: name + "weidu", ["title"]: "", ["font"]: "ht_18_cc", ["image"]: "", ["color"]: gui.Color.ublack, ["x"]: 100, ["y"]: 0, ["w"]: 40, ["h"]: 40, ["event_name"]: null, ["fun_index"]: null, },
			{ ["index_type"]: gui.Button, ["name"]: name + "delete_btn", ["title"]: "", ["image"]: "ty_guanBi",  ["x"]: 0, ["y"]: 0, ["w"]: 45, ["h"]: 45, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick},
			{ ["index_type"]: gui.Grid9Image, ["name"]: name + "namebg", ["title"]: null, ["font"]: null, ["image"]: "lt_siLiaoDi02", ["color"]: gui.Color.white, ["x"]: 15, ["y"]: 95, ["w"]: 154, ["h"]: 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
			{ ["index_type"]: eui.Label, ["name"]: name + "name_level", ["parent"]: name + "namebg", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: null, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 154, ["h"]: 40, ["event_name"]: null, ["fun_index"]: null, },
		]
		UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)


		this.mElemList[name + "player_icon"] = UIPetBox.newObj(this.mLayoutNode, name + "player_icon", 25, 0, this.mElemList[name + "petboxbg"], 0.8)

	}


	refreshItemWindow(window, v , i) {
		let name = i

		let weiDuNum = FriendSystem.getInstance().getFriendUnReadMsgCount(v.roleId)
		if (weiDuNum > 99) {
			weiDuNum = 99 + "+"
		}
		// this.mElemList[name + "weidu"].text = (weiDuNum)
		// this.mElemList[name + "weidu"].visible = (weiDuNum > 0)
		this.mElemList[name + "weiduBg"].visible = (weiDuNum > 0)

		// this.mElemList[name + "weiduBg"].visible = (true)

		this.mElemList[name + "name_level"].text = (v.roleName)
		let imageSource = "lt_siLiaoDi03"
		if(v.roleId == this.friendId){
			imageSource = "lt_xuanZhongDi"
		}
		this.mElemList[name + "selectbg"].source = imageSource
		this.mElemList[name + "player_icon"].updateRoleInfo(v.vocation, v.sexId, v.icon, v["VipLevel"])
		if (v.isOnline == 1) {
			this.mElemList[name + "player_icon"].setEnable(true)
		} else {
			this.mElemList[name + "player_icon"].setEnable(false)
		}

		this.controlDataTable[name + "selectbg"] = v
		this.controlDataTable[name + "delete_btn"] = v
	}


	onClickFriendChat(args: egret.TouchEvent) {

		let friendInfo = this.controlDataTable[args.target.name]

		if (friendInfo == null) {
			return
		}

		if (friendInfo.roleId == this.friendId) {
			return
		}

		this.showWithFriendInfo(friendInfo.roleId, friendInfo.roleName)
	}

	//here
	onClick(args: egret.TouchEvent){
		let friendInfo = this.controlDataTable[args.target.name]

		if (friendInfo == null) {
			return
		}
		let roleId = friendInfo.roleId 
		//执行删除
		FriendSystem.getInstance().deleteChatByID(roleId)
		// this.refreshFrame()  //here

		if(roleId == this.friendId){
			this.friendId = -1
		}
		this.refreshFrame()
	}


	//////////////////////////////////////////////////////////////////////////////////////////////////-
	//刷新对话内容
	refreshChat() {
		let friendInfo = FriendSystem.getInstance().getChatPlayerInfo(this.friendId)
		if (friendInfo) {
			TLog.Debug(friendInfo)
			let nameLevel = ""
			if (friendInfo) {
				nameLevel = friendInfo.roleName
			}
			this.mElemList["nameLabel"].text = (nameLevel)
		} else {
			this.mElemList["nameLabel"].text = ("")
		}

		if (this.needToInit) {

			if (!this.duiHuaNum[this.friendId]) {
				this.duiHuaNum[this.friendId] = 1
			}
			if (!this.duiHuaHeight[this.friendId]) {
				this.duiHuaHeight[this.friendId] = 0
			}
			this.initOffLineRecord()
			this.needToInit = false
		}
	}

	initOffLineRecord() {
		TLog.Debug("ChatInChannel_ChatWnd.initOffLineRecord")
		this.saveVoiceList = {}
		let messageList = FriendSystem.getInstance().getFriendMessage(this.friendId)

		let friendInfo = FriendSystem.getInstance().getChatPlayerInfo(this.friendId)


		if (messageList) {
			let sortFunc = function (a, b) {
				return a.time - b.time
			}
			table_sort(messageList, sortFunc)
		}


		this.chatIndex = 0;

		this.chatListScroll.clearItemList();

		let totalH = 0
		for (let k in messageList) {
			let v = messageList[k]


			let wnd = this.creatOneChatWnd()
			this.updateChatWnd(wnd, v)	
		}
		this.chatListScroll.moveToScrollIndex(this.chatIndex -1)
	}



	creatOneChatWnd() {
		let [chatWnd, flag]: any = this.chatListScroll.getItemWindow(this.chatIndex, 380, ChatWndHeight, 0, 0)
		this.chatIndex = this.chatIndex + 1
		this.totalWndNumber = this.totalWndNumber + 1

		if (flag == false) {
			return chatWnd
		}
		let wndName = chatWnd.name;

		chatWnd.mElemList = {}
		let info: any = [
			//背景
			{ ["index_type"]: eui.Group, ["name"]: "chat_bg", ["image"]: null, ["x"]: 120, ["y"]: 0, ["w"]: 300, ["h"]: ChatWndHeight, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
			{ ["index_type"]: gui.Grid9Image, ["name"]: "chat_bgimg", ["parent"]:"chat_bg",  ["image"]: "hy_duiHuaDi01", ["x"]: 0, ["y"]: 0, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickChatBg },

			//{ ["index_type"]: eui.Image, ["name"]: "chat_top_icon", ["image"]: "hy_VIPduiHua02", ["x"]: 116, ["y"]: -9, ["w"]: 109, ["h"]: 54, ["messageFlag"]: true },
			//内容
			{ ["index_type"]: gui.RichDisplayer, ["name"]: "chat", ["title"]: "", ["font"]: "ht_24_lc", ["color"]: gui.Color.white, ["x"]: 150, ["y"]: 0, ["w"]: 310, ["h"]: 60, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickChatBg },
		]
		UiUtil.createElem(info, this.mLayoutNode, chatWnd.mElemList, this, chatWnd)
		chatWnd.mElemList["chat"].addEventListener(gui.RichDisplayer.RichDisplayerLinkCmdEvent, this.onClickHyperLink, this)
		chatWnd.mElemList["chat"].setAlignFlag(gui.Flag.H_CENTER)
		return chatWnd
	}


	onClickChatBg(args: egret.TouchEvent) {
		//tolua.cast(args, "gui::GUIMouseEvent")
		//TLog.Debug("ChatInChannel_ChatWnd.onClickChatBg",args.window.name,args.window.GetParent().GetParent().GetParent().name)
		if (args.target) {
			let parentWindow = args.target.parent//:GetParent()
			if (parentWindow) {
				let windowName = parentWindow.name
				let voiceID = this.saveVoiceList[windowName]
				if (voiceID) {
					GameSound.getInstance().playRecord(voiceID)
				}
			}
		}
	}

	//私聊更新
	updateChatWnd(chatWnd, messageInfo) {
		let rd: gui.RichDisplayer = chatWnd.mElemList["chat"]
		rd.clear()
		if(messageInfo ==null){
			return
		}
		chatWnd.visible = (true)

		let voiceIconName = "#VOICE_ICON_LEFT"
		if (messageInfo.isSelfSend) {
			voiceIconName = "#VOICE_ICON_RIGHT"
		}

		let chatBg= "hy_duiHuaDi01", chatTopIcon = ""

		let xml
		let str = messageInfo.data
		xml = ChannelHyperlinkMrg.getInstance().analyzeHyperLink(str)
		let name = chatWnd.name
		
		let rd_bg: eui.Group = chatWnd.mElemList["chat_bg"]
		let rd_bgimg: gui.Grid9Image = chatWnd.mElemList["chat_bgimg"]

		rd.addXmlString(xml)
		UiUtil.setWH(rd, 310, ChatWndHeight)

		let w = rd.getLogicWidth() + 2	//70?
		let h = rd.getLogicHeight() + 2	//22
		let addH = 0
		if (h > 72) {
			addH = 22
		}
		h = MathUtil.clamp(h, 53, ChatWndHeight + addH);	//53
		if (w > 350) {
			w = 350
		}
		UiUtil.setWH(rd, w, ChatWndHeight + addH)

		UiUtil.setWH(rd_bg, w+43, ChatWndHeight + addH )
		UiUtil.setWH(chatWnd, chatWnd.width, ChatWndHeight + addH)

		if (messageInfo.isSelfSend) {	//是否自己的发送的

			let vocation = GetHeroProperty("vocation")
			let sexId = GetHeroProperty("sexId")
			let viplevel = GetHeroProperty("VIP_level")

			let icon = "1"

			UiUtil.setXY(rd_bg, 390, 0)	//!!!!!!
			let y = 25
			if(rd_bg.width>=83){
				y = 14 
			}
			UiUtil.setXY(rd, 400 - rd_bg.width, y)	//!!!!!!
			
			rd_bgimg.scaleX = -1;


		} else {	//别人发送的

			let friendInfo = FriendSystem.getInstance().getChatPlayerInfo(messageInfo.fromFriendId)
			if (friendInfo) {
				let icon = messageInfo.icon
				if (icon == null) {
					icon = friendInfo.icon
				}
				let VipLevel = messageInfo.VipLevel
				if (VipLevel == null) {
					VipLevel = friendInfo.VipLevel
				}

				UiUtil.setXY(rd_bg, 0, 0)	//!!!!!!
				let y = 25
				if(rd_bg.width>=83){
					y = 14 
				}
				UiUtil.setXY(rd, 32, y)	//!!!!!! 83

			} else {
				TLog.Error("get friendInfo err  is null !!! ")
			}

			
			rd_bgimg.scaleX = 1;
		}
	}



	// analyzeHyperLink(content) {
	// 	let color = "white"
	// 	let param: any = {}
	// 	param.no_change_font = true
	// 	param.default_color = color
	// 	param.defalut_font = "ht_20_cc_stroke"
	// 	param.link_parser = ContentParseLinkHandler
	// 	return XmlConverter.parseText(content, param)
	// }

	onClickHyperLink(args: gui.GUIHyperlinkEvent) {
		// let link = args.getHyperlink()
		// let [linkType, playerId, targetId, name] = StringUtil.stringMatch(link, /(\d);(\d+);(\d+);(.+)/)
		// linkType = tonumber(linkType)
		// //TLog.Debug("ChatInChannel_ChatWnd.onClickHyperLink",linkType,playerId,targetId,link)
		// if (linkType == channelOption.ITEM) {																													//物品超链接
		// 	RpcProxy.call("C2G_ChannelPetItem", tonumber(playerId), 2, tonumber(targetId))
		// } else if (linkType == channelOption.PET) {																														//宠物超链接
		// 	RpcProxy.call("C2G_ChannelPetItem", tonumber(playerId), 1, tonumber(targetId))
		// } else if (linkType == channelOption.VOICE) {
		// 	let voiceID = tonumber(playerId)
		// 	if (voiceID) {
		// 		GameSound.getInstance().playRecord(voiceID, false, tonumber(targetId))
		// 	}
		// }
	}


	onClickFriendMenu(args: egret.TouchEvent) {
		if (this.friendId < 0) {
			return
		}
		let friendInfo = FriendSystem.getInstance().getChatPlayerInfo(this.friendId)
		let wnd = WngMrg.getInstance().getWindow("FriendSDetailsFrame")
        wnd.showAndSetFrame(friendInfo)
	}


	onClickFindFriend(args) {
		WngMrg.getInstance().showWindow("FindFriendFrame")
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////


	onMessageCome(args) {
		let messageInfo = args.messageInfo
		// if(messageInfo == null){
		// 	// this.updateChatWnd(wnd, messageInfo)
		// 	this.chatListScroll.clearItemList();
		// 	//here
		// 	this.friendId = -1
		// 	this.refreshFrame()
		// 	return
		// }

		this.refreshFrame()
		if (messageInfo && messageInfo.fromFriendId != this.friendId) {
			return
		}


		let wnd = this.creatOneChatWnd()
		this.updateChatWnd(wnd, messageInfo)
		this.chatListScroll.moveToScrollIndex(this.chatIndex - 1)
	}

	// updateFrame(){
	// 	this.chatListScroll.clearItemList();
	// 	this.friendId = -1
	// 	let list = FriendSystem.getInstance().getChatStrangerList()
	// 	if(size_t(list)<=0){	//如果什么聊天都没有了
	// 		FriendSystem.getInstance().setChatBtnShowFlag(false)
	// 		FireEvent(EventDefine.FRIEND_CHAT_BTN_UPDATE,null)
	// 		this.hideWnd()
	// 		return
	// 	}
	// 	this.refreshFrame()
	// }

	onSearchResule(args) {
		this.showWithFriendInfo(args.playerInfo.roleId)
	}

	onContentChanged(args?) {
	
	}

	onClickBiaoqing(event: egret.TouchEvent) {
		let btn: eui.Button = event.target;
		let window = WngMrg.getInstance().getWindow("ChatInsertFaceFrame")
		window.showFaceTable(this.gotSelectFace, this, event);
	}

	gotSelectFace(selectFace) {
		let content = "#" + selectFace

		let edit = <eui.EditableText>this.mElemList["edit_input"]
		edit.text = edit.text + content;
		this.onContentChanged()
	}

	onClickSendMsg(event: egret.TouchEvent) {
		let edit = <eui.EditableText>this.mElemList["edit_input"]
		let content = edit.text;
		if( this.sendChatMessage(content) ){
			edit.text = ("")
			this.onContentChanged()
			// this.needToScroll = true
		}
	}

	sendChatMessage(content: string) {
		if (content == null) {
			MsgSystem.addTagTips(Localize_cns("CHAT_ERROR_NEIRONGBUNENGWEIKONG"))
			return false
		}

		if (this.friendId < 0) {
			MsgSystem.addTagTips(Localize_cns("CHAT_TXT6"))
			return false
		}


		if (content.length > 30) {
			MsgSystem.addTagTips(Localize_cns("CHAT_ERROR_TOO_LONG"))
			return false
		}

		content = WordFilter.filtWord(content)

		let name = GetHeroPropertyInfo().id
		if (this.friendId) {
			name = this.friendId
		} else {
			TLog.Error("ChatInChannel_ChatWnd.onClickSendMessage err  this.friendName is null ")
			return false
		}

		let message = GetMessage(opCodes.C2G_CHANNEL_SEND)
		message.channel = channelType.CHAT
		message.data = content
		message.name = name
		SendGameMessage(message)

		//构造一个不需要显示的聊天入口
		let vipLevel = VipSystem.getInstance().GetVipLevel()
		let messageInfo = MessageInfo.newObj(this.friendId, content, GetServerTime(), this.friendName, vipLevel, GetHeroProperty("chatBubbleType"))
		messageInfo.isSelfSend = true  //自己发出
		messageInfo.readState = 1   //已读
		messageInfo.setIconInfo("", GetHeroProperty("vocation"), GetHeroProperty("sexId"))

		FriendSystem.getInstance().addMessageInfo(messageInfo)
		return true
	}

	onCloseWnd(args){
		//setAlignFlag
		FriendSystem.getInstance().setChatBtnShowFlag(false)
		FireEvent(EventDefine.FRIEND_CHAT_BTN_UPDATE,null)
		this.hideWnd()
	}

	onBackWnd(args){
		//setAlignFlag
		FriendSystem.getInstance().setChatBtnShowFlag(true)
		FireEvent(EventDefine.FRIEND_CHAT_BTN_UPDATE,null)
		this.hideWnd()
	}


	//显示界面
	showWithFriendInfo(friendId, friendName?) {
		//TLog.Debug("ChatInChannel_ChatWnd.showChatInChannel_ChatWnd",friendId,friendName,friendBody)
		this.friendId = friendId
		this.friendName = friendName
		//this.friendBody = friendBody
		this.needToInit = true

		if (this.isVisible() && this.isLoadComplete()) {
			this.refreshFrame()
		} else {
			this.showWnd()
		}

	}

	// _chatWithPlayer(playerId, playerName) {
	// 	// if (this.mCurSendChannel != channelType.CHAT) {
	// 	// 	this.mCurSendChannel = channelType.CHAT
	// 	// 	this.setSelected(this.mCurSendChannel)
	// 	// 	this.msgMrg.setCurChannel(this.mCurSendChannel)
	// 	// 	this.refreshFrame()
	// 	// }
	// 	this.showWithFriendInfo(playerId, playerName)
	// }

	chatWithPlayer(playerId, playerName) {
		this.showWithFriendInfo(playerId, playerName)
		// this.showWnd()
		// this.doCommand("_chatWithPlayer", playerId, playerName);
	}
}