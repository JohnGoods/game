// TypeScript file
class UIMainChatViewer extends TClass {
    mRootWnd: BaseWnd;
    mLayoutNode: gui.LayoutNode;
    
    mElemList: any;
    maxRow: number;
    visible: boolean;

    mParent:egret.DisplayObjectContainer

    name:string;
    refreshTimer:any;

    msgMrg: ChannelMrg;
    mCurSendChannel: number;
    needToScroll: boolean;
    msgUnread: any;
    saveChatHistory: any[];
    needToResetChannel: boolean;
    inputType: number;
    worldOldContent: string;
    saveTotalHeight: number;
    nextTime: number;
    lastSendTime: number;
    channelStateList: any;
	chatbtnShow:boolean;
	fadeOut: AlphaAction;
	fadeIn: AlphaAction;
	fadeIn1: AlphaAction;

    public initObj(...params: any[]) {
        this.mRootWnd = params[0]
        this.mLayoutNode = params[1]

        this.name = params[2]
        let x = params[3] || 0
        let y = params[4] || 0

        this.mParent = params[5]

        this.maxRow = 4;
        this.mElemList = this.mRootWnd.mElemList

        this.visible = false;
		this.chatbtnShow = false
        
        this.msgMrg = ChannelMrg.getInstance()

        let mElemInfo: any = [
            { ["index_type"]: eui.Group, ["name"]: this.name, ["title"]: null, ["x"]: x, ["y"]: y, ["event_name"]: null, ["fun_index"]: null, ["touchEnabled"]: false },
            { ["index_type"]: gui.Grid9Image, ["name"]: "UIchat_bg", ["parent"]: this.name, ["title"]: null, ["font"]: null, ["image"]: "zjm_shuRuDi01", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 640, ["h"]: 220,  ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },


            { ["index_type"]: gui.RichDisplayer, ["name"]: "rd_chat_content", ["parent"]: this.name, ["title"]: "", ["font"]: "ht_20_lc", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["percentWidth"] : 100 ,["percentHeight"] : 100	 },
            {["index_type"] : gui.Scroller,	     ["name"] : "rd_chat_scroll",         ["viewport"]:"rd_chat_content",	 ["parent"]: this.name, 	["x"] : 50, ["bottom"] : 55,		 			["w"] : 590 ,["h"] : 165		,["event_name"] : null, ["fun_index"] :null, ["touchEnabled"]: false},
            // { ["index_type"]: gui.Button, ["name"]: "btn_chat", ["parent"]: this.name, ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_liaoTian01", ["color"]: gui.Color.white, ["x"]: 530, ["y"]: 16,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickShowChatFrame },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this,  this.mParent)
        this.mElemList["rd_chat_content"].setRowDistance(4)
        this.mElemList["rd_chat_content"].addEventListener(gui.RichDisplayer.RichDisplayerLinkCmdEvent, this.onClickHyperLink, this)

        this.mCurSendChannel = this.msgMrg.getCurChannel()  


        this.msgUnread = {}									//记录收到非当前频道消息的数量
		this.saveChatHistory = []					//机器人发言
		this.needToScroll = true					//当前频道有新发言时不立刻滚动到最新位置

		let channelList = this.msgMrg.getRegisteredChannelList()
		for (let i in channelList) {
			let channel = channelList[i]
			this.msgUnread[channel] = 0
		}

		this.msgUnread[channelType.CHAT] = 0	//特殊处理

        this.inputType = 1   //1 文字 2 语言
		this.needToResetChannel = true
        this.saveTotalHeight = 0
        this.lastSendTime = -1

        var elemInfo = []
        // let channelList = this.msgMrg.getRegisteredChannelList()
		for (let channel of channelList) {
			elemInfo.push({ ["name"]: "channel" + channel, ["title"]: null, ["event_name"]: null, ["fun_index"]: null })
			elemInfo.push({ ["name"]: "unreadbg" + channel, ["title"]: null, ["event_name"]: null, ["fun_index"]: null })
			elemInfo.push({ ["name"]: "unread" + channel, ["title"]: null, ["event_name"]: null, ["fun_index"]: null })
		}

        elemInfo.push({ ["name"]: "btn_send", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSendMsg })
        
        elemInfo.push({ ["name"]: "edit_input", ["font"]: "ht_24_lc", ["color"]: gui.Color.aliceblue, ["event_name"]: egret.TouchEvent.CHANGE, ["fun_index"]: this.onContentChanged },)
        elemInfo.push({ ["name"]: "btn_biaoqing", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBiaoqing },)
        elemInfo.push({ ["name"]: "chat_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickChat },)
		elemInfo.push({ ["name"]: "chat_ban_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBanChat },)

		
        // elemInfo.push()

		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		// this.mElemList["btn_display"].visible = false
        //频道单选
		var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
		radioGroup.addEventListener(eui.UIEvent.CHANGE, this.onSelected, this);
		for (let channel of channelList) {
			let radioBtn = <eui.RadioButton>this.mElemList["channel" + channel]
			radioBtn.group = radioGroup;
			radioBtn.value = channel;
		}

		let data: any = { ["alpha"]: 0 }
		this.fadeOut = AlphaAction.newObj(this.mElemList["chat_btn"], 1000, data, this.endFadeOutAnim, this)
		let data1: any = { ["alpha"]: 255 }
		this.fadeIn = AlphaAction.newObj(this.mElemList["chat_btn"], 1000, data1, this.endFadeInAnim, this)

		this.fadeIn1 = AlphaAction.newObj(this.mElemList["chat_btn"], 100, data1, this.updateAnim, this)

        if (this.needToResetChannel) {
			this.resetDefaultChannel()
			this.needToResetChannel = false
		}
		this.needToScroll = true
		this.mElemList["chat_btn"].visible = false
    }

	endFadeOutAnim(){
		this.fadeIn.run()
	}

	endFadeInAnim(){
		this.fadeOut.run()
	}

	updateAnim(){

	}

    resetDefaultChannel() {
		this.setSelected(channelType.SYSTEM)
		let edit = <eui.EditableText>this.mElemList["edit_input"]
		edit.text = "";
		this.onContentChanged(null)
		this.inputType = 1 //--1 文字；2 录音
		// this.changeInputByType()

		this.worldOldContent = null;
		//this.mElemList["input_change_btn"].enabled = (false)
	}

    destory() {
		
	}

	addChatNum(){	//未读的
		this.msgUnread[channelType.CHAT] = this.msgUnread[channelType.CHAT] + 1
		this.refreshFrameEvent()
	}



    onClickShowChatFrame(event: egret.TouchEvent) {
        // TLog.Debug("onClickShowChatFrame")
        // let wnd = WngMrg.getInstance().showWindow("ChatInChannelFrame")
    }

    refreshFrameEvent(){
        if(this.refreshTimer != null)
			return;

		//let timerId = 0;
        let onTimerCallback = function(dt){
            KillTimer(this.refreshTimer);
			this.refreshTimer = null
			this.refreshFrame()
        }

        this.refreshTimer = SetTimer(onTimerCallback, this, 300);
    }


    refreshFrame() {
       // this.mElemList["UIchat_bg"]:SetWH(640, 80)
        // this.mElemList["UIchat_rd"]:SetWH(this.defaultW, this.defaultH)

        // let scroll = this.mElemList["rd_chat_scroll"]
        // scroll.removeChildren();

		
		//this.mElemList["chat_ban_btn"].visible = true
		

        let rd: gui.RichDisplayer = this.mElemList["rd_chat_content"]
        // rd.removeChildren();
        rd.clear()

        let channelEx: any = {
            [channelType.WORLD]: ["gold", Localize_cns("CHANNEL_WORLD")],
            //[channelType.TEAM]: ["deepskyblue", Localize_cns("CHANNEL_TEAM")],
            [channelType.FACTION]: ["lime", Localize_cns("CHANNEL_FACTION")],
            //[channelType.UNION]: ["white", Localize_cns("MAIN_TXT5")],
            // [channelType.CHAT] : ["pink", Localize_cns("CHANNEL_CHAT")],
            [channelType.SYSTEM] : ["cyan", Localize_cns("CHANNEL_SYSTEM")],
            //[channelType.SERVER]="cyan",	
        }

        let list =  ChannelMrg.getInstance().getChannelObj(this.mCurSendChannel)
        let maxShowCount = 20
        let startIndex = list.packetList.length - maxShowCount
        if(startIndex < 0)
            startIndex = 0
        
        let flag = false
        for (let k = startIndex; k < list.packetList.length; k++) {
            let packet = list.packetList[k]

            if (channelEx[packet["channel"]]) {

				if(packet._xmlnode_ == null){
					let name = ""
					let id = packet["roleId"] || 0
					let sexId = packet["sexId"] || 1
					let isNeedLink = false

					if(packet["channel"] == channelType.SYSTEM){
					name = Localize_cns("MAOHAO")  
					id = 0
					}else if (packet["roleId"] == GetHeroProperty("id")) {
						name = Localize_cns("SELF") + Localize_cns("MAOHAO")
						id = 0
					} else {
						isNeedLink = true
						if (packet["channel"] == channelType.UNION && packet.factionID) {
							let factionName = ClubSystem.getInstance().GetUnionFactonName(packet.factionID)
							name = String.format(Localize_cns("MAIN_TXT6"), factionName) + packet.name + Localize_cns("MAOHAO")
						} else {
							name = packet["name"] + Localize_cns("MAOHAO")
						}
					}

					if (packet["channel"] == channelType.FACTION) {
						isNeedLink = false
					}

					// name =  + name
					let linkName = name
					if(isNeedLink){
						linkName = String.format(Localize_cns("CHAT_TXT14"),XmlConverter.LinkSign, sexId, id,name , XmlConverter.LinkSign)
					}

					let content = "#little_space" + "#" + channelEx[packet["channel"]][0] + channelEx[packet["channel"]][1] + "#rf"
					+ linkName  + packet.data

					let defalut_font = "ht_20_cc_stroke"
					if (packet["channel"] == channelType.SERVER) {
						defalut_font = "ht_20_cc_stroke"
					} else {
						defalut_font = "ht_20_cc_stroke"
					}
					
					let xml = ChannelHyperlinkMrg.getInstance().analyzeHyperLink(content,"white","lime", defalut_font)

					packet._xmlnode_ = TXML.parse(xml, true)

				}
                rd.addXmlNode(packet._xmlnode_)
                rd.showLastRow()
                // rd.addEventListener(gui.RichDisplayer.RichDisplayerLinkCmdEvent, this.onClickHyperLink, this)
                flag = true
            }
        }


        //刷新红点
        // let btn = this.mElemList["btn_chat"]
        // this.mRootWnd.hideDotTipsUI(btn)
        
        // let unreadCount = FriendSystem.getInstance().getFriendUnReadMsgCount(-1)
        // if(unreadCount > 0 ){
        //     this.mRootWnd.createDotTipsUI(btn, false)
        // }else{
            
        // }

        this.channelStateList = this.msgMrg.getChannelState()

		for (let k in this.channelStateList) {
			let v = this.channelStateList[k];
            // let num = tonumber(k)
            // if(num == channelType.TEAM  || num == channelType.CHAT){
            //     return
            // }
            if(this.mElemList["channel" + k]){
                this.mElemList["channel" + k].enabled = v[0]
            }
			
		}
       
        this.refreshDotTip()
		// this.mElemList["chat_btn"].visible = (true)
		// this.fadeOut.run()
		this.refreshChatBtn()
    }

    refreshDotTip(){
        // this.msgUnread[this.mCurSendChannel] = 0
        // let channelList = this.msgMrg.getRegisteredChannelList()
		// for (let k = 0; k < channelList.length; k++) {
		// 	let v = channelList[k]
		// 	let count = this.msgUnread[v]
		// 	if (count == null || count <= 0) {
		// 		this.mElemList["unread" + v].visible = (false)
		// 		this.mElemList["unreadbg" + v].visible = (false)

		// 	} else {
		// 		this.mElemList["unread" + v].visible = (false)
		// 		this.mElemList["unreadbg" + v].visible = (false)
		// 		if (count > 99) {
		// 			count == 99;
		// 		}
		// 		this.mElemList["unread" + v].text = count;
		// 	}
		// }
    }

	refreshChatBtn(){
		let flag = FriendSystem.getInstance().getChatBtnShowFlag()

		// if(flag == true){
		// 	this.mElemList["chat_btn"].visible = (true)
		// 	return
		// }
		
		this.fadeOut.stop()
		this.fadeIn.stop()

		let channelList = this.msgMrg.getRegisteredChat()
		for (let k = 0; k < channelList.length; k++) {
			let v = channelList[k]
			let tonum = tonumber(v)
			if(v == channelType.CHAT){
				let count = this.msgUnread[v]
				if ((count == null || count <= 0 || count == NaN)) {
					if(flag == false){
						this.mElemList["chat_btn"].visible = (false)
						FriendSystem.getInstance().setChatBtnShowFlag(false)
					}else{
						this.mElemList["chat_btn"].visible = (true)
						this.fadeIn1.run()
						FriendSystem.getInstance().setChatBtnShowFlag(true)
					}
					
				} else {	//有私聊信息 //闪动
					this.mElemList["chat_btn"].visible = (true)
					this.fadeOut.run()
					FriendSystem.getInstance().setChatBtnShowFlag(true)
				}
			}
		}
	}

	resetChatNum(){
		this.msgUnread[channelType.CHAT] = 0
		this.refreshFrameEvent()
	}

    addPacketMsg(packet) {
		let channel = packet.channel

		if (this.mCurSendChannel != packet["channel"]) {
			this.msgUnread[packet["channel"]] = this.msgUnread[packet["channel"]] + 1
		}

		// if (this.isVisible() == false) {
		// 	return
		// } else {
			this.refreshFrameEvent()
		// }
	}


    onReceiveMessage(args) {
		let packet = args.packet
		let content = packet.data
		let channelList = this.msgMrg.getRegisteredAllChannelList()
		if (!table_isExist(channelList, packet["channel"])) {
			return
		}

		if (this.mCurSendChannel != packet["channel"]) {
			this.msgUnread[packet["channel"]] = this.msgUnread[packet["channel"]] + 1
		}

		//////////////////////-头顶冒泡信息//////////////////////////-
		let dataStr = packet.data
		if (packet["MsgType"]) {
			dataStr = Localize_cns("VOICE_MARK")
		}

		//只有世界频道才冒泡
		if (!packet.offlineChat && packet.channel == channelType.WORLD) {
			//let hideChatBubble = RoleSystem.getInstance().getSystemSetting("set_hide_paopao")
			if (packet.roleId == GetHero().getId()) {
				GetHero().doCommand(ActorCommand.AddChatBubble, dataStr, false)//this.getBubbleXml(packet), false)
			} else {

				let bShowPlayer = ActorManager.getInstance().getShowPlayerStatus()
				if (bShowPlayer == 1) {
					let player = ActorManager.getInstance().getPlayer(packet.roleId)
					if (player) {
						player.doCommand(ActorCommand.AddChatBubble, dataStr, false)//this.getBubbleXml(packet), false)
					}
				}
			}
		}
        this.refreshFrameEvent()
	}

    //返回登陆清空聊天内容
	// onPrecedureDeactive(args) {
	// 	if (this.mElemList == null)
	// 		return;
	// 	for (let k = 0; k < this.msgMrg.getRegisteredChannelList().length; k++) {
	// 		let v = this.msgMrg.getRegisteredChannelList()[k]
	// 		this.msgUnread[v] = 0
	// 		if (this.mElemList["unread" + v]) {
	// 			this.mElemList["unread" + v].visible = (false)
	// 			this.mElemList["unreadbg" + v].visible = (false)
	// 		}
	// 	}
	// 	this.saveChatHistory = []
	// 	this.needToResetChannel = true
	// 	this.saveTotalHeight = 0
	// 	this.msgMrg.setCurChannel(channelType.WORLD)

	// 	 if(this.refreshTimer){
    //         KillTimer(this.refreshTimer)
    //         this.refreshTimer = null
    //     }
	// 	this.clearQuestion()
	// }

    clearQuestion() {
		// if (this.questionTimer) {
		// 	KillTimer(this.questionTimer)
		// 	this.questionTimer = null
		// }
		this.nextTime = -1
		// this.setQuetionVisible(false)
		// this.questionIndex = -1
		// this.answerA = ""
		// this.answerB = ""
	}

    isFriendChat(channel?) {
		if(channel == null || channel == -1){
			channel = this.mCurSendChannel
		}

		return channel == channelType.CHAT
	}


    _sendMsgImp(content:string) : boolean{
		// if (this.isFriendChat()) {
		// 	if (this.friendChatWnd.sendChatMessage(content)) {
		// 		return true;
		// 	}
		// 	return false
		// }

		if (StringUtil.isEmptyContent(content)) {
			MsgSystem.addTagTips(Localize_cns("CHAT_ERROR_NEIRONGBUNENGWEIKONG"))
			return false
		}

		if (GAME_DEBUG) {
			let strTable = splitString(content, " ")
			if (strTable[0] == "@openfunc") {
				if (strTable[1] == "all") {
					let errantry = 0
					for (let _ in GuideFuncDefine) {
						let v = GuideFuncDefine[_]
						GuideSystem.getInstance().opendFunc(v)//errantry = errantry + 2 ^ (v - 1)
					}
				} else {
					let wnd = WngMrg.getInstance().getWindow("ActivateButtonFrame");
					GuideSystem.getInstance().opendFunc(strTable[1])
				}
			} else if (strTable[0] == "@closefunc") {
				if (strTable[1] == "clear") {
					let message = GetMessage(opCodes.C2G_ROLE_NEWBIE_SETTING_RECORD)
					message.errantry = ""
					 SendGameMessage(message)
				} else {
					if (GameConfig.FuncDefineConfig[strTable[1]]) {
						SetRoleFunctionSetting(GameConfig.FuncDefineConfig[strTable[1]].funcOrder, true)
					}
				}
				return false
			} else if (strTable[0] == "@playMovie") {
				//modify:movie
				//MovieSystem.getInstance().beginPlay(strTable[1])
				return false
			} else if (strTable[0] == "@playFight") {
				FightSystem.getInstance().showClientFight(tonumber(strTable[1]))
				return false
			} else if (strTable[0] == "@guidefunc") {
				GuideFuncSystem.getInstance().showDynamicTips(strTable[1])
				return false;
			} else if (strTable[0] == "@clearTask") {
				let taskList = TaskSystem.getInstance().getTaskList()
				for (let taskId in taskList) {
					let task = taskList[taskId]

					let message = GetMessage(opCodes.C2G_CHANNEL_SEND)
					message.channel = this.mCurSendChannel
					message.data = "@task me end " + taskId
					SendGameMessage(message)
				}
			} else if (strTable[0] == "@guide") {
				let guideId = tonumber(strTable[1])
				GuideSystem.getInstance().doGuideByIndex(guideId)
				// this.hideWnd();      //@@@@
				return false;
			} else if (strTable[0] == "@groupcmd") {
				//let groupcmdconfig = {}
				//readCSV("data\\config\\groupcmd.csv", groupcmdconfig)
				let groupcmd = strTable[1]
				let cmdlist = GameConfig.GroupCmdConfig[groupcmd]
				for (let i = 1; i < 500; ++i) {
					let cmdinfo = cmdlist[i]
					if (cmdinfo == null) {
						break
					}
					let cmd = cmdinfo.cmd
					let message = GetMessage(opCodes.C2G_CHANNEL_SEND)
					message.channel = this.mCurSendChannel
					message.data = cmd
					SendGameMessage(message)
				}
				return true;
			} else if (strTable[0] == "@test") {
				let timerId = 0;
				let onTimerCallback = function(dt){
					MsgSystem.addChannel(channelType.SYSTEM, Localize_cns("GLOBAL_TIPS"))
				}
				timerId = SetTimer(onTimerCallback, this, 100);
			}
		}


		let flag = this.msgMrg.checkSendCondition(content)
		if (!flag) {
			return false
		}

		// let haveBadWord = false
		content = WordFilter.filtWord(content)
		//TLog.Debug("onClickSendMessage",content)

		let curSendTime = GetCurMillSec()
		if (this.lastSendTime > 0 && curSendTime - this.lastSendTime < 5000) {
			MsgSystem.addTagTips(Localize_cns("CHAT_SEND_TOO_FAST"))
			return false
		}
		this.lastSendTime = curSendTime


        let mCurSendChannel = this.mCurSendChannel  //在全部那里设置世界聊天吧
        if(mCurSendChannel == channelType.SYSTEM){
            mCurSendChannel = channelType.WORLD
        }

		if (mCurSendChannel == channelType.WORLD && !GAME_DEBUG) {
			if (this.worldOldContent == content) {
				MsgSystem.addTagTips(Localize_cns("CHANNEL_SAME_CONTENT_TIPS"))
				this.lastSendTime = -1
				return false
			}
			this.worldOldContent = content
		}

		let message = GetMessage(opCodes.C2G_CHANNEL_SEND)
		message.channel = mCurSendChannel
		message.data = content
		SendGameMessage(message)		
		return true;
	}

    onSelected(event: egret.Event) {
		var radioGroup: eui.RadioButtonGroup = event.target;
		let radiobtn = radioGroup.selection
		this.setSelected(radiobtn.value);
		this.msgMrg.setCurChannel(this.mCurSendChannel)

		this.refreshFrame()
	}

    setSelected(channelId) {

		this.needToScroll = (this.mCurSendChannel != channelId);

		this.mCurSendChannel = channelId || this.msgMrg.getCurChannel()
		let radioBtn = <eui.RadioButton>this.mElemList["channel" + this.mCurSendChannel];
		radioBtn.selected = true;

		if(channelId == channelType.SYSTEM){
			this.mLayoutNode.currentState = "noinput"
		}else{
			this.mLayoutNode.currentState = "normal"
		}
	}

    onClickBiaoqing(event: egret.TouchEvent) {
		let btn: eui.Button = event.target;
		let window = WngMrg.getInstance().getWindow("ChatInsertFaceFrame")
		window.showFaceTable(this.gotSelectFace, this, event);
	}

    onClickChat(){
        WngMrg.getInstance().showWindow("ChatFrame")
    }

	onClickBanChat(){
		MsgSystem.addTagTips(Localize_cns("CHAT_TXT16"))
		let wnd = WngMrg.getInstance().getWindow("MainFrame")
		wnd.setFastChatIsVisible(true)
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
		if( this._sendMsgImp(content) ){
			edit.text = ("")
			this.onContentChanged()
			this.needToScroll = true
		}
	}

    onContentChanged(args?) {
		// let flag = true
		// if(flag){
		// 	MsgSystem.addTagTips("???")
		// 	return
		// }
	}

    //响应超链接点击
	onClickHyperLink(args: gui.GUIHyperlinkEvent) {
        let linkContent = args.getHyperlink()
		ChannelHyperlinkMrg.getInstance().hyperLinkClick(linkContent)

	}

    setVisible(visible: boolean) {
        if (visible == null) {
            return
        }

        if (this.visible == visible) {
            return
        }

        this.visible = visible

        if (visible == true) {
            RegisterEvent(EventDefine.CHAT_RECV_CHANNEL_MSG, this.onReceiveMessage, this)
            RegisterEvent(EventDefine.FRIEND_UNREAD_UPDATE, this.refreshFrameEvent, this)
			RegisterEvent(EventDefine.FRIEND_CHAT_BTN_UPDATE, this.resetChatNum, this)
			RegisterEvent(EventDefine.OFFLINE_CHAT_MSG, this.addChatNum, this)
			RegisterEvent(EventDefine.NOTICE_FRAME_SHOW, this.onNoticeShow, this)
			RegisterEvent(EventDefine.NOTICE_FRAME_HIDE, this.onNoticeHide, this)

            this.refreshFrame()

			MsgSystem.setPublicEnable(true)
			//公告界面
			let flag = MsgSystem.isPublicVisible()
			if (flag == false) {
				this.onNoticeHide()
			} else {
				this.onNoticeShow()
			}
        } else {
            UnRegisterEvent(EventDefine.CHAT_RECV_CHANNEL_MSG, this.onReceiveMessage, this)
            UnRegisterEvent(EventDefine.FRIEND_UNREAD_UPDATE, this.refreshFrameEvent, this)
			UnRegisterEvent(EventDefine.FRIEND_CHAT_BTN_UPDATE, this.resetChatNum, this)
			UnRegisterEvent(EventDefine.OFFLINE_CHAT_MSG, this.addChatNum, this)
			UnRegisterEvent(EventDefine.NOTICE_FRAME_SHOW, this.onNoticeShow, this)
			UnRegisterEvent(EventDefine.NOTICE_FRAME_HIDE, this.onNoticeHide, this)

            if(this.refreshTimer){
                KillTimer(this.refreshTimer)
                this.refreshTimer = null
            }

			MsgSystem.setPublicEnable(false)
        }
        this.mElemList[this.name].visible = visible
    }

	setChatContent(content) {
		this.mElemList["edit_input"].text = content
	}

	refreshFastChat(){
		let curLevel = GetHeroProperty("level")
		// this.mElemList["chat_ban_btn"].visible = (curLevel<50)
		this.mElemList["chat_ban_btn"].visible = false
		if(curLevel<50 && !GAME_DEBUG){
			this.mElemList["chat_ban_btn"].visible = true
		}
	}

	onNoticeShow() {
		UiUtil.setWH(this.mElemList["rd_chat_scroll"], 590, 115)
	}

	onNoticeHide() {
		UiUtil.setWH(this.mElemList["rd_chat_scroll"], 590, 165)
	}
}