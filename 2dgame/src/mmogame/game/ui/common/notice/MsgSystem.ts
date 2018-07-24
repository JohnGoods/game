
var CONFIRM_DIALOG_YES_OR_NO = 1	//包括OK,取消按钮的确认对话框
var CONFIRM_DIALOG_YES = 2				//只包括确定按钮的对话框
var CONFIRM_DIALOG_FOR_RECHARGE = 3	//钻石不足，询问是否前往充值

class MsgSystem {

	public static s_confirmFrame: ConfirmFrame;
	private static s_confirmDialogMsgList = [];

	public static s_iconMsgFrame: IconMsgFrame;

	private static s_tapTipsFrame: TapTipsFrame;
	private static s_publicNoticeFrame: PublicNoticeFrame;

	private static s_itemGoldEquipFrame : ItemGoldEquipFrame

	static onClear() {
		if (this.s_publicNoticeFrame) {
			this.s_publicNoticeFrame.clearMsg()
		}
		if (this.s_iconMsgFrame) {
			this.s_iconMsgFrame.clearMsg()
		}
		// if(this.PushMsgFrame ){
		// 	this.PushMsgFrame.clearMsg()
		// }	

		// if(this.pushEventMsg ){
		// 	this.pushEventMsg.onClear()
		// }	

		// if( this.s_tapTipsFrame){
		// 	this.s_tapTipsFrame.onClear()
		// }

	}
	public static addDropItemTips(info): void {
		if (this.s_tapTipsFrame == null) {
			this.s_tapTipsFrame = TapTipsFrame.newObj();
			this.s_tapTipsFrame.setUiEventEnable(false)
		}
		this.s_tapTipsFrame.showWnd();
		this.s_tapTipsFrame.doCommand("addDropItemMsg", info);
	}

	public static addGetItemTips(info): void {
		if (this.s_tapTipsFrame == null) {
			this.s_tapTipsFrame = TapTipsFrame.newObj();
			this.s_tapTipsFrame.setUiEventEnable(false)
		}
		this.s_tapTipsFrame.showWnd();
		this.s_tapTipsFrame.doCommand("addGetItemMsg", info);
	}

	public static addGetGoldEquipTips(info): void {
		if (this.s_itemGoldEquipFrame == null) {
			this.s_itemGoldEquipFrame = ItemGoldEquipFrame.newObj();
			this.s_itemGoldEquipFrame.setUiEventEnable(false)
		}
		this.s_itemGoldEquipFrame.showWnd();
		this.s_itemGoldEquipFrame.doCommand("addNewMsg", info);
	}

	
	public static addTagTips(msg: string): void {
		if (this.s_tapTipsFrame == null) {
			this.s_tapTipsFrame = TapTipsFrame.newObj();
			this.s_tapTipsFrame.setUiEventEnable(false)
		}
		this.s_tapTipsFrame.showWnd();
		this.s_tapTipsFrame.doCommand("addNewMsg", msg);

	}

	public static addChannel(channel, msg: string): void {
		Chat_AddChannelMsg(channel, msg)
	}

	public static clearConfirmDialog(){
		this.s_confirmDialogMsgList = []
		if(this.s_confirmFrame)
			this.s_confirmFrame.hideWnd();
	}

	public static confirmDialog(msg: string, callback?: IDialogCallback, userData?: any, defaultCheck?: boolean): void {
		if(defaultCheck == null)
			defaultCheck = true;

		if(userData!=null && table_isExist(ConfirmFrom,userData) ){
			let todayNoNotifyStr = IGlobal.setting.getRoleSetting(UserSetting.TYPE_STRING,"todayNoNotify",table_save({}))
			let todayNoNotify = table_load(todayNoNotifyStr)
			let recordTime = todayNoNotify[userData]// = GetServerTime()
			//含有记录
			if(recordTime!= null ){


				let curDay = GetServerDate(GetServerTime());
				let recordDay = GetServerDate(recordTime);

				//在同一天,不用提示,直接回调
				if(curDay.day == recordDay.day ){
					//回调数据
					callback.onDialogCallback(defaultCheck, userData)
					return
				}
			}
		}
		return this.addDialogMsgList(CONFIRM_DIALOG_YES_OR_NO, msg, callback, userData)
	}

	public static confirmDialog_YES(msg: string, callback?: IDialogCallback, userData?: any): void {
		if(userData!=null && table_isExist(ConfirmFrom,userData) ){
			let todayNoNotifyStr = IGlobal.setting.getRoleSetting(UserSetting.TYPE_STRING,"todayNoNotify",table_save({}))
			let todayNoNotify = table_load(todayNoNotifyStr)
			let recordTime = todayNoNotify[userData]// = GetServerTime()
			//含有记录
			if(recordTime!= null ){


				let curDay = GetServerDate(GetServerTime());
				let recordDay = GetServerDate(recordTime);

				//在同一天,不用提示,直接回调
				if(curDay.day == recordDay.day ){
					//回调数据
					callback.onDialogCallback(true, userData)
					return
				}
			}
		}
		return this.addDialogMsgList(CONFIRM_DIALOG_YES, msg, callback, userData)
	}


	public static addPubilcMsg(content: string, count?: number, priority?: number) {
		if (this.s_publicNoticeFrame == null) {
			this.s_publicNoticeFrame = PublicNoticeFrame.newObj()
		}
		this.s_publicNoticeFrame.addNewMsg(content, count, priority)
	}

	public static isPublicVisible() {
		if (this.s_publicNoticeFrame == null) {
			return false
		}
		return this.s_publicNoticeFrame.isVisible()
	}

	public static setPublicEnable(b: boolean) {
		if (this.s_publicNoticeFrame == null) {
			this.s_publicNoticeFrame = PublicNoticeFrame.newObj()
		}
		this.s_publicNoticeFrame.setPublicEnable(b)
		
	}

	public static showScreenEffect(effectId: number, callback?:Function, thisObj?:any) {
		let wnd = WngMrg.getInstance().getWindow("ScreenEffectTipsFrame")
		wnd.showScreenEffect(effectId, callback, thisObj)
	}




	public static addIconMsg(ret: IIconMsgCallBack, userData, type) {
		type = type || ""
		//为了可以自动隐藏，把iconMsg交给WndMrg管理
		if (!this.s_iconMsgFrame) {
			this.s_iconMsgFrame = IconMsgFrame.newObj()
		}
		return this.s_iconMsgFrame.addNewMsg(ret, userData, type)
	}

	public static removeIconMsg(id) { //通知上层调用

		if (this.s_iconMsgFrame == null)
			return;
		this.s_iconMsgFrame.removeMsg(id)
	}

	public static isIconTypeExsit(type) {
		if (this.s_iconMsgFrame == null)
			return false;
		return this.s_iconMsgFrame.isIconTypeExsit(type)
	}

	public static removeIconMsgByType(type) { //通知上层调用
		if (this.s_iconMsgFrame == null)
			return;
		this.s_iconMsgFrame.removeIconMsgByType(type)
	}

	public static isIconMsgVisible() { //通知上层调用
		if (this.s_iconMsgFrame == null)
			return false;
		return this.s_iconMsgFrame.isVisible()
	}



	public static addImSysMsg(str) {

	}

	public static addLoudspeakerTips(str) {
	}

	public static addScreenTips(str) {

	}


	public static showScreenTips(str: string, time) {

	}

	public static hideScreenTips() {

	}



	private static addDialogMsgList(dialogType: number, msg: string, callback?: IDialogCallback, userData?: any) {
		var callbackData: any = {}
		callbackData.callback = callback //allback
		callbackData.userData = userData //userData

		var self = this;
		var msgSystemCallback: IDialogCallback = {
			//userData为
			onDialogCallback(result: boolean, msgCallbackData: any): void {
				var callbackObject = msgCallbackData.callback
				var callbackUserData = msgCallbackData.userData

				if (callbackObject) {
					callbackObject.onDialogCallback(result, callbackUserData)
				}

				var msgData = self.s_confirmDialogMsgList.pop();
				self.openNextConfirmDialog(msgData)
			}
		}

		//回调先经过MsgSystem
		var msgData: any = {}
		msgData.dialogType = dialogType
		msgData.msg = msg
		msgData.callback = msgSystemCallback
		msgData.callbackData = callbackData
		if (this.s_confirmFrame == null) {
			this.s_confirmFrame =  WngMrg.getInstance().getWindow("ConfirmFrame") //ConfirmFrame.newObj();
		}

		var confirmFrame = this.s_confirmFrame;
		if (confirmFrame.isVisible()) {
			this.s_confirmDialogMsgList.unshift(msgData);
		} else {
			this.openNextConfirmDialog(msgData);
		}
	}

	public static openNextConfirmDialog(msgData) {
		if (msgData == null) {
			return
		}

		this.s_confirmFrame.setMsgData(msgData)
		this.s_confirmFrame.showWnd();
	}



	////////////////////////////////////////////////////////////////-
	static analyzeMsg(result, args, netMsg) {
		//let f = loadstring("return "..netMsg.transform)
		//let transform = f()
		if (netMsg.transform != null) {
			for (let i in netMsg.transform) {
				let v = netMsg.transform[i]
				//transform) ){
				if (args[i] != null) {
					if (v == 1) {
						//物品entry => 物品name
						let itemTempInfo = ItemSystem.getInstance().getItemTemplateInfo(args[i])
						if (itemTempInfo != null) {
							args[i] = itemTempInfo.name
						} else {
							TLog.Error(String.format("MsgSystem.NetTipsHandler entryID %d error", args[i]))
							return
						}
					} else if (v == 2) {
						//物品品质 => 颜色
						//let qualityColor:any = {
						//												[opEquipQuality.White] 	: "#white",
						//												[opEquipQuality.Blue] 	: "#deepskyblue",
						//												[opEquipQuality.Gold] 	: "#greenyellow",
						//												[opEquipQuality.Orange] : "#darkorange",
						//												[opEquipQuality.Green] 	: "#darkorchid"}
						//if(qualityColor[args[i]] ){
						//	args[i] = qualityColor[args[i]]
						//}else{
						//	args[i] = "white"
						//}
						args[i] = "#white"
					} else if (v == 3) {
						//任务名
						args[i] = TaskSystem.getInstance().getTaskName(args[i])
					} else if (v == 4) {
						//阵型名称
						args[i] = Localize_cns("TEAM_ZHENYING_" + args[i])
					} else if (v == 5) {
						//BOSS entry -> BOSS name
						args[i] = "Boss"//MonsterAppear[args[i]].name
					} else if (v == 6) {
						//Map entry -> Map name
						args[i] = "mapname"//map_system.get_map_name(args[i])
						//	}else if(v == 7 ){
						//	  //item 附加属性id -> 附加属性 name
						//	  args[i] = ItemSystem.GetAddPropertyName(args[i])
						//	}else if(v == 9 ){ //宗族建筑id转为建筑名字
						//		//nIndex -> 建筑名字
						//		args[i] = faction_system.get_building_name(args[i])
						// }else if(v == 10 && transform[99 + i] ){ //时间转为设定形式，transform[100]为格式字符
						// 	args[i] = os.date(transform[99 + i], args[i])
					} else if (v == 11) {  //全服首个通关
						args[i] = GameConfig.CampaignConfig[args[i]].name
					} else if (v == 12) {
						let petInfo = GameConfig.PetConfig[args[i]]
						if (petInfo) {
							args[i] = petInfo.Name
						}
					} else if (v == 13) {
						let itemInfo = ItemSystem.getInstance().getItemTemplateInfo(args[i])
						if (itemInfo) {
							args[i] = itemInfo.name
						}

					} 
					// else if (v == 14) {
					// 	if (GameConfig.SealedGroundConfig[args[i]].name) {
					// 		args[i] = GameConfig.SealedGroundConfig[args[i]].name
					// 	}
					// }
					 else if (v == 15) {
						let itemInfo = ItemSystem.getInstance().getItemTemplateInfo(args[i])
						if (itemInfo) {
							args[i] = itemInfo.name
						}

						let color = "white"
						args[i] = "#" + color + args[i] + "#rf"

					} else if (v == 16) {
						// let mapId = GetBrokenMapId(args[i])
						// if(GameConfig.MapConfig[mapId] ){
						// 	args[i]=GameConfig.MapConfig[mapId].mapName
						// }
					} else if (v == 17) {
						args[i] = Localize_cns("HUNDUNSHIJIE" + (10 + args[i]))
					} else if (v == 18) {		//字符后加逗号
						if (args[i] != "") {
							args[i] = args[i] + Localize_cns("DOUHAO")
						}
					// } else if (v == 19) {		//阵营战阵营兵名
					// 	if(args[i] == ConfigZhenYing.blueTeam ){
					// 		args[i] = Localize_cns("GODSWAR_TEXT4")
					// 	}else if(args[i] == ConfigZhenYing.redTeam ){
					// 		args[i] = Localize_cns("GODSWAR_TEXT3")
					// 	}
					
					 }else if (v == 20 || v == 21) { //伙伴品级
						args[i] = "yellow" + GameConfig.PetConfig[args[i]].Name + "#rf"
						//let qualityToColor = 
						//{
						//	[opPetQuality.gray]:"navajowhite",
						//	[opPetQuality.green]:"lime",
						//	[opPetQuality.blue]:"cyan",
						//	[opPetQuality.purple]:"magenta",
						//	[opPetQuality.gold]:"orange",
						//}
						//
						//if(PetConfig[args[i]] ){
						//	args[i] = qualityToColor[PetConfig[args[i]].Quality]..PetConfig[args[i]].Name.."#rf"
						//}
						//}else if(v == 21 ){
						//let qualityToColor = 
						//{
						//	[opPetQuality.gray]:"#navajowhite",
						//	[opPetQuality.green]:"#lime",
						//	[opPetQuality.blue]:"#cyan",
						//	[opPetQuality.purple]:"#magenta",
						//	[opPetQuality.gold]:"#orange",
						//}
						//
						//if(PetConfig[args[i]] ){
						//	args[i] = qualityToColor[PetConfig[args[i]].Quality]..PetConfig[args[i]].Name.."#rf"
						//}else{
						//	args[i] = "#yellow" +Localize_cns("FAIRY_HOME") +"#rf"
						//}
					} else if (v == 22) {
						args[i] = Localize_cns("PINJIA_TXT" + args[i])
					} else if (v == 23) {
						// if(RideListConfig[args[i]] ){
						// 	args[i] = RideListConfig[args[i]]["Name"]
						// }else{
						// 	args[i] = args[i]
						// }
					} else if (v == 24) {							//货币单位转换
						if (ItemUnitName[args[i]]) {
							args[i] = Localize_cns(ItemUnitName[args[i]])
						}
					} else if (v == 25) {							//活动索引转名字
						if (OrdinaryActivityName[args[i]]) {
							args[i] = Localize_cns(OrdinaryActivityName[args[i]])
						}
					}else if(v == 26 ){
						//args[i] = ProfessionSystem.getInstance().getProfessionRefProperty(args[i], "Name")
					}else if(v == 27 ){
						let entryId = args[i]
						if(GameConfig.PetConfig[entryId] ){
							args[i] = GameConfig.PetConfig[entryId].name
						}else if(GameConfig.ActorRoleConfig[entryId] ){
							args[i] = GameConfig.ActorRoleConfig[entryId].name
						}
					}else if(v == 28 ){
						let qualityLevel = tonumber(args[i]) 
						//args[i] = PetSystem.getInstance().getPetQualityLevelName(qualityLevel, "")

						//let [_, color] = GetPetQualityLevelColor(qualityLevel)
						let color = GetQualityColorStr(qualityLevel, false)
						args[i] = "#" + color + args[i]
					}else if(v == 29 ){
						let npcEntryId = tonumber(args[i]) || 0
						let [name] = TaskSystem.getInstance().getDynamicNpcName(null, npcEntryId)
						args[i] = name 
					}else if(v == 30 ){
						args[i] = GetHeroProperty("name")
					}else if(v == 31 ){							//跨服争霸矿颜色
						let mineId = tonumber(args[i])
						if (GameConfig.GlobalMiningConfig[mineId]) {
							let mineName = GameConfig.GlobalMiningConfig[mineId].title

							let fontXml = {
											[1]: "#lime",
											[2]: "#cyan",
											[3]: "#magenta",
											[4]: "#lightsalmon",
							}
							if (fontXml[GameConfig.GlobalMiningConfig[mineId].mType]) {
								args[i]= fontXml[GameConfig.GlobalMiningConfig[mineId].mType]
							}
						}
					}else if(v == 32 ){							//跨服争霸矿名字
						let mineId = tonumber(args[i])
						if (GameConfig.GlobalMiningConfig[mineId]) {
							args[i] = GameConfig.GlobalMiningConfig[mineId].title
						}
					}else if(v == 33 ){
						let index = tonumber(args[i])
						let text = ActivitySystem.getInstance().getFunctionName(index)
						if(text == undefined){
							args[i] = index
						}else{
							args[i] = text
						}
					}
				}
			}
		}

		//服务器传过来的args,以1为开始索引
		// let argsKeys = Object.keys(args);
		// let msgString = ""
		// //暂时最多支持5个参数
		// if (argsKeys.length == 0) {
		// 	msgString = netMsg.msg
		// } else if (argsKeys.length > 0) {
		// 	//TLog.Debug(unpack(args),"////////////////-")
		// 	argsKeys = argsKeys.sort((a, b) => {
		// 		return tonumber(a) - tonumber(b)
		// 	})

		// 	let sortArgsList = [];
		// 	for (let key of argsKeys) {
		// 		sortArgsList.push(args[key])
		// 	}

		// 	msgString = String.format(netMsg.msg, sortArgsList)
		// }
		let msgString = String.format(netMsg.msg, unpack(args))
		return msgString
	}

	static selectShowHandle(v, msgString, count?, priority?) {

		let param = null
		if (Array.isArray(v)) {
			v = v[0], param = v[1]
		}


		if (v == 1) {//聊天　系统频道
			this.addChannel(channelType.SYSTEM, msgString)
		} else if (v == 2) {// 淡入淡出提示
			this.addTagTips(msgString)
		} else if (v == 3) {// 确定对话框
			this.confirmDialog_YES(msgString)
		} else if (v == 4) {// 大喇叭
			this.addLoudspeakerTips(msgString)
		} else if (v == 5) {// 屏幕提示
			this.addScreenTips(msgString)
		} else if (v == 6) {
			this.addChannel(channelType.SWORN, msgString)
		} else if (v == 7) {//世界频道
			msgString = StringUtil.stringReplace(msgString, "//", XmlConverter.LinkSign)
			this.addChannel(channelType.WORLD, msgString)
		} else if (v == 8) { //屏幕提示+系统提示
			this.addTagTips(msgString)
			this.addChannel(channelType.SYSTEM, msgString)
		} else if (v == 9) { //宗族频道 + 屏幕提示
			this.addChannel(channelType.FACTION, msgString)
			this.addTagTips(msgString)
		} else if (v == 10) { //宗族频道
			this.addChannel(channelType.FACTION, msgString)
		} else if (v == 11) { //IM类型
			this.addImSysMsg(msgString)
		} else if (v == 12) { // 宗族频道 + IM类型 + 屏幕提示
			this.addImSysMsg(msgString)
			this.addChannel(channelType.FACTION, msgString)
			this.addTagTips(msgString)
		} else if (v == 13) { // 团队频道 + 屏幕提示
			this.addChannel(channelType.TEAM, msgString)
			this.addTagTips(msgString)
		} else if (v == 14) { //交易频道
			this.addChannel(channelType.AUCTION, msgString)
		} else if (v == 15) { //私聊频道
			this.addChannel(channelType.CHAT, msgString)
		} else if (v == 16) { //私聊频道+标签提示
			this.addChannel(channelType.CHAT, msgString)
			this.addTagTips(msgString)
		} else if (v == 17) { //队伍频道
			this.addChannel(channelType.TEAM, msgString)
		} else if (v == 18) { //队伍频道+标签提示
			this.addChannel(channelType.TEAM, msgString)
			this.addTagTips(msgString)
		} else if (v == 19) { //门派频道
			this.addChannel(channelType.SCHOOL, msgString)
		} else if (v == 20) { //门派频道+标签提示
			this.addChannel(channelType.SCHOOL, msgString)
			this.addTagTips(msgString)
		} else if (v == 21) { //无频道
			this.addChannel(0, msgString)
		} else if (v == 22) {
			msgString = StringUtil.stringReplace(msgString, "//", XmlConverter.LinkSign)
			this.addPubilcMsg(msgString, count || 1, priority)
			this.addChannel(channelType.SYSTEM, msgString)
		} else if (v == 23) {
			//let a = GetActivity(ActivityDefine.Robber)
			//a.refreshTipsContent(msgString)
		} else if (v == 24) {
			let a = GetActivity(ActivityDefine.BigBoss)
			a.refreshTipsContent(msgString)
		} else if (v == 25) {
			this.hideScreenTips()
			let showStr = msgString
			this.showScreenTips(showStr, 3000)
		} else if (v == 26) { //联盟频道
			this.addChannel(channelType.UNION, msgString)
		} else if (v == 27) { //联盟频道+标签提示
			this.addChannel(channelType.UNION, msgString)
			this.addTagTips(msgString)
		} else if (v == 28) {	//屏幕特效tips

			this.showScreenEffect(param)
		}
	}


	//客户端本地提示
	// LocalizeTipsHandler(result, ...){
	// 	let localizeTipsInfo = Localize_info_cns(result)
	// 	arg: any = { ...}
	// 	//TLog.Debug_r(arg)
	// 	let msgString = this.analyzeMsg(result, arg, localizeTipsInfo)
	// 	if (msgString == null) { return }
	// 	for (let _ in localizeTipsInfo.show || {}) {
	// 		let v = localizeTipsInfo.show || {}[_]

	// 		this.selectShowHandle(v, msgString, localizeTipsInfo.count != 0 && localizeTipsInfo.count || 1, localizeTipsInfo.priority || 0)
	// 	}
	// }

	//网络传来的提示
	public static netTipsHandler(result, args) {

		let netMsg = Localize_netMsg_i(result)
		if (type(netMsg) == "object") {
			let msgString = this.analyzeMsg(result, args, netMsg)

			if (msgString == null) { return }

			//let f = loadstring("return "..netMsg.show)
			//let show_ = f()

			//if(type(show_) == "object" ){
			for (let _ in netMsg.show) {
				let v = netMsg.show[_]
				//show_) ){
				this.selectShowHandle(v, msgString, netMsg.count != 0 && netMsg.count || 1, netMsg.priority || 0)
			}
			//}else{
			//	this.SelectShowHandle(show_, msgString)
			//}
		}

		if (result == resultCode.RESULT_ITEM_USE) {
			GameSound.getInstance().playEffect(SystemSound.effect_itemUse)
		} else if (result == resultCode.RESULT_SKILL_REALIZE_FAIL) {
			//GameSound.getInstance().playEffect(SystemSound.effect_skillReaFail)
		} else if (result == resultCode.RESULT_TASK_FINISH) {
			GameSound.getInstance().playEffect(SystemSound.effect_finishTask)
		}
	}

	// TransNetTips(result,args){
	// 	let netMsg = Localize_netMsg_i(result)

	// 	if(type(netMsg) == "object" ){
	// 		return this.analyzeMsg(result, args, netMsg)
	// 	}else{
	// 		return "ZZZZZZzzzzzzzzzzz   "..tostring(result)
	// 	}
	// }



}