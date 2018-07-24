
function GetHeroClubInfo() {
	return ClubSystem.getInstance().getRoleClub(GetHeroProperty("id"))
}



class ClubSystem extends BaseSystem {

	curClubInfo: any;
	roleClunInfo: any;
	applyList: any;
	LegionApplylist: any;
	clubMenberList: any[];
	myApplyList: any;

	//新加
	//here
	roleInfo: any;
	clubInfoList: any[];
	noticeText: any

	memberListChange: boolean
	autoApplyStatus: number;


	treasureList
	taskList

	record: any; //帮会事件记录 

	//活跃信息
	activeData: any;

	//上香信息
	renqiData: any;

	//帮会技能
	skillInfo: any;

	storeItemList: any[];
	partRecordList: any[];

	public initObj(...args: any[]): void {
		this.onClear()
		//RegisterEvent(EventDefine.FACTION_UNION_APPLY, this.onRevFacionUnionMsg, this)
		//RegisterEvent(EventDefine.HERO_ENTER_GAME, this.onEnterToGetUnionInfo, this)
		//RegisterEvent(EventDefine.ACTIVITY_GLOBAL_SERVER_EVENT, this.onRecvActivityEvent, this)

	}

	destory() {

	}

	prepareResource(workQueue) {
		GameConfig.initClubSystemCsv(workQueue);
	}

	//here
	onClear() {
		this.curClubInfo = null                     //角色所在的帮派信息
		this.roleInfo = null
		this.clubInfoList = []
		this.noticeText = ""
		this.myApplyList = null


		this.roleClunInfo = []                     //角色帮派信息
		//this.clubList  = {}                       //帮派列表
		this.applyList = []                       //申请列表
		this.LegionApplylist = []									 //帮派申请列表
		//this.clubSingleList = {}                   //帮派信息列表
		this.clubMenberList = []                  //帮派成员列表
		//   this.buildInfoList = null                       //帮派内政建筑信息
		//   this.studySkillList = null                  //研究技能列表
		//   this.notic = null 													 //公告
		//   this.info = null														 //介绍
		//   this.allotRecordList = {}										//分配记录
		//   this.buyRecordList = {}											//购买记录
		//   this.myUnionInfo = {}
		//   this.saveFactionBuildInfo = {}					// 军团建筑信息
		//   this.saveFactionPoint = null               //军团积分信息
		//   this.saveFactionSkillInfo = {}	          //军团技能信息
		//   this.saveFactionScoreInfo = null            //军团过往积分
		this.autoApplyStatus = 1
		this.treasureList = {} //藏宝阁奖励
		this.taskList = null;

		this.memberListChange = false

		this.storeItemList = []
		this.partRecordList = []

		//   if(this.onClearEx ){
		// 	  this.onClearEx()
		// 	}
	}

	// sendClubApplyMessage(clubId, reason) {
	// 	let message = GetMessage(opCodes.C2G_FACTION_APPAY)
	// 	message.clubId = clubId
	// 	message.applyReason = reason
	// 	SendGameMessage(message)
	// }

	//////////////////////////////////////////////////////////////////////////////
	//图标提示
	IconTips(playerInfo) {
		// TLog.Debug("ClubSystem.IconTips")
		// //TLog.Debug_r(playerInfo)
		// let setType = "clubApply"
		// let iconInfo = FriendSystem.getInstance().getIconMsgInfo(setType)
		// if(iconInfo ){
		// 	return
		// }

		// let cbObj:any = {}
		// cbObj.function IconMsgCallBack(cbObj, userData){			//红点处理
		// 	let t:any = {}
		// 	t.function DialogCallBack(_, result, userData){		//消息框处理							

		// 		if(result ){
		// 			let curState = StateManager.getInstance().GetCurrentStateType()
		// 			if(curState != state_type.LIVE_BASE_STATE ){
		// 				return  MsgSystem.AddTagTips(Localize_cns("FUNTIPS_HIMI22"))
		// 			}

		// 			let wnd = WngMrg.getInstance().getWindow("ClubFrame")
		// 			wnd.showWithTab(ID_TAB_APPLY)
		// 		}			

		//   	FriendSystem.getInstance().removeIconMsgInfo(userData)
		// 	}
		// 	let infoStr =Localize_cns("CONFIRM_PALYER_INVITATION1")
		// 	MsgSystem.ConfirmDialog(infoStr, t,userData)			
		// }		

		// let info:any = {}
		// info.iconID = null
		// info.iconType = setType		
		// info.iconID=MsgSystem.AddIconMsg(cbObj, info,IconMsgType.CLUB_APPLY)		
		// FriendSystem.getInstance().addIconMsgInfo(info)
	}



	// sendAcceptApplyRequestMessage(applyId, isYes) {
	// 	let message = GetMessage(opCodes.C2G_FACTION_CHECK)
	// 	message.applyId = applyId
	// 	message.isYes = isYes
	// 	SendGameMessage(message)
	// }

	getApplyInfoByIndex(index) {
		let i = 1
		for (let k in this.applyList) {
			let v = this.applyList[k]

			if (i == index) {
				return v
			}
			i = i + 1
		}
		return null

	}

	// sendClubMenberMessage() {
	// 	let message = GetMessage(opCodes.C2G_FACTION_MEMBER_REFRESH)
	// 	SendGameMessage(message)
	// }

	// setClubMenberList(list) {

	// 	this.memberListChange = true

	// 	this.clubMenberList = list
	// }



	// getClubMenberList(list) {
	// 	if (this.memberListChange) {
	// 		this.memberListChange = false
	// 		table_sort(this.clubMenberList, function (a, b) {
	// 			if (a.post != b.post) {
	// 				return a.post - b.post
	// 			} else {
	// 				return b.zhanli - a.zhanli
	// 			}
	// 		})
	// 	}
	// 	return this.clubMenberList
	// }

	// cleanClubMenberList(list) {
	// 	this.clubMenberList = []
	// }




	// updateClubMenberList(info) {
	// 	let index = null
	// 	for (let k in this.clubMenberList) {
	// 		let v = this.clubMenberList[k]

	// 		if (v.id == info.id) {
	// 			index = k
	// 			break
	// 		}
	// 	}

	// 	if (index != null) {
	// 		this.clubMenberList[index] = info
	// 	}

	// 	this.memberListChange = true
	// }


	// onRecvActivityEvent(args) {
	// 	let event = args.msg.event

	// 	if (event == ConfigServerEvent.FACTION_MAP_CREATE || event == ConfigServerEvent.FACTION_MAP_BOSS) {   //帮派副本开启
	// 		let message = GetMessage(opCodes.C2G_FACTIONMAP_QUERY)
	// 		SendGameMessage(message)	//-查询副本情况	
	// 	}

	// 	//let list:any = {
	// 	//								[ConfigServerEvent.FACTION_PVE_OPEN] 			: {1, Localize_cns("PANGAEA_TXT30")},
	// 	//								[ConfigServerEvent.FACTION_PVE_CLOSE] 			= {1, Localize_cns("PANGAEA_TXT33")},
	// 	//								[ConfigServerEvent.FACTION_PVE_BOSS_OPEN] 	= {1, Localize_cns("PANGAEA_TXT31")},
	// 	//								[ConfigServerEvent.FACTION_PVE_BOSS_CLOSE]	= {1, Localize_cns("PANGAEA_TXT32")},
	// 	//						 }
	// 	//						 
	// 	//if(list[event] ){
	// 	//	if(list[event][1] == 1 ){
	// 	//		MsgSystem.AddChannel(channelType.FACTION, list[event][2])
	// 	//		return MsgSystem.AddPubilcMsg(list[event][2])
	// 	//	}
	// 	//}
	// }


	getPosName(pos) {
		let factionPosConfig: any = {
			[opFactionOfficeOptions.LEADER]: Localize_cns("CLUB_POS_1"),
			[opFactionOfficeOptions.SUB_LEADER]: Localize_cns("CLUB_POS_2"),
			[opFactionOfficeOptions.MEMBER]: Localize_cns("CLUB_POS_3"),
		}
		return factionPosConfig[pos]
	}

	getPosNameColor(pos) {
		let factionPosConfig: any = {
			[opFactionOfficeOptions.LEADER]: "#red",
			[opFactionOfficeOptions.SUB_LEADER]: "#orange",
			[opFactionOfficeOptions.MEMBER]: "#green",
		}
		return factionPosConfig[pos]
	}

	getPosImage(pos) {
		if (opFactionOfficeOptions.LEADER == pos) {
			return "gh_TextDi04"
		} else if (opFactionOfficeOptions.SUB_LEADER == pos) {
			return "gh_TextDi03"
		}
		return ""
	}


	//获得军团logo图标
	getLogoImage(id) {
		return String.format("gh_gongHuiIcon%02d", id)
	}


	// onEnterToGetUnionInfo() {
	// 	//如果有军团
	// 	let heroInfo = GetHeroPropertyInfo()
	// 	if (heroInfo && (GAME_MODE == GAME_NORMAL)) {
	// 		if (heroInfo["faction"] >= 0) {
	// 			//this.SendMsgToGetUnionInfo()
	// 			//this.sendMsgToGetBuildInfo()
	// 			this.sendClubMenberMessage()

	// 			//查询副本
	// 			let message = GetMessage(opCodes.C2G_FACTIONMAP_QUERY)
	// 			SendGameMessage(message)	//-查询副本情况

	// 			message = GetMessage(opCodes.C2G_FACTION_INFO_REFRESH)
	// 			SendGameMessage(message)	//-请求帮派信息
	// 		}
	// 	}
	// }

	// sendMsgToSetAutoApply(status) {
	// 	let message = GetMessage(opCodes.C2G_FACTIONWAR_AUTO_APPLY)
	// 	message.autoStatus = status
	// 	SendGameMessage(message)
	// }

	setAutoApplyStatus(status) {
		this.autoApplyStatus = status
	}

	getAutoApplyStatus(status) {
		return this.autoApplyStatus
	}

	// getFactionTaskList(isGroup) {
	// 	let list = []
	// 	for (let i in GameConfig.FactionTaskConfig) {
	// 		let v = GameConfig.FactionTaskConfig[i]

	// 		if (v.isGroup == isGroup) {
	// 			JsUtil.arrayInstert(list, v)
	// 		}
	// 	}
	// 	return list
	// }

	setFacTaskTreasureList(treasureList) {
		this.treasureList = treasureList
	}

	getFacTaskTreasureList() {
		return this.treasureList || {}
	}

	setFacTaskList(list) {
		this.taskList = list
	}

	getFacTaskList() {
		return this.taskList || {}
	}

	//here
	//////////////////////新加
	//个人角色信息
	setRoleClubInfo(facId, facName, facPost) {
		let t = []
		t["facId"] = facId
		t["facName"] = facName
		t["facPost"] = facPost
		this.roleInfo = t
	}

	getRoleClubInfo() {
		return this.roleInfo
	}

	//帮派信息
	setCurClubInfo(curClubInfo) {
		this.curClubInfo = curClubInfo
	}

	getCurClubInfo() {
		return this.curClubInfo
	}

	updateClubNotice(notice) {
		if (this.curClubInfo) {
			this.curClubInfo.notice = notice
		}
	}

	onUpdateClubInfo(intro, id) {
		if (this.curClubInfo && this.curClubInfo.id == id) {
			this.curClubInfo.intro = id
		}
	}

	//所有帮派信息
	setClubInfoList(clubInfoList) {
		this.clubInfoList = clubInfoList
	}

	getClubInfoList() {
		return this.clubInfoList
	}

	//公告
	setNotice(notice) {
		this.updateClubNotice(notice)
		this.noticeText = notice
	}

	getNotice() {
		return this.noticeText
	}

	//自己的申请列表
	setLegionApplyList(myApplyList) {
		this.myApplyList = myApplyList
	}

	getLegionApplyList() {
		return this.myApplyList
	}

	updateApplyList(clubId) {
		return this.myApplyList
	}



	//帮派成员信息
	setClubMemberList(list) {
		this.memberListChange = true
		this.clubMenberList = list
	}

	getClubMemberList(list) {
		if (this.memberListChange) {
			this.memberListChange = false
			table_sort(this.clubMenberList, function (a, b) {
				let onlineA = a.online || 0
				let onlineB = b.online || 0

				if (onlineA == onlineB) {
					if (a.post == b.post) {
						return b.zhanli - a.zhanli
					} else {
						return a.post - b.post
					}
				} else {
					return onlineB - onlineA
				}
			})
		}
		return this.clubMenberList
	}

	cleanClubMenberList(list) {
		this.clubMenberList = []
	}

	updateClubMenberList(info) {
		let index = null
		for (let k in this.clubMenberList) {
			let v = this.clubMenberList[k]

			if (v.id == info.id) {
				index = k
				break
			}
		}

		if (index != null) {
			this.clubMenberList[index] = info
		}

		this.memberListChange = true
	}
	//帮派成员end


	setApplyList(list) {
		//TLog.Debug("ClubSystem.setApplyList")
		this.applyList = null

		let falg = false
		let playerInfo: any[] = []
		for (let _ in list) {
			let v = list[_]

			falg = false
			for (let i in this.applyList) {
				let value = this.applyList[i]

				if (v.id == value.id) {
					falg = true
				}
			}
			if (falg == false) {
				JsUtil.arrayInstert(playerInfo, v)
			}
		}

		this.applyList = list

		// if (playerInfo.length > 0) {
		// 	if (MsgSystem.isIconTypeExsit(IconMsgType.CLUB_APPLY) == false) {
		// 		let cbObj: IIconMsgCallBack = {
		// 			onIconMsgCallBack(id: number, userData): boolean {

		// 				let t: IDialogCallback = {
		// 					onDialogCallback(result: boolean, userData): void {
		// 						if (result) {
		// 							let wnd = WngMrg.getInstance().getWindow("ClubFrame")
		// 							wnd.showWithIndex(2)
		// 						}
		// 					}
		// 				}
		// 				let infoStr = Localize_cns("CONFIRM_PALYER_INVITATION1")
		// 				MsgSystem.confirmDialog(infoStr, t, userData)

		// 				return false;
		// 			}
		// 		}
		// 		MsgSystem.addIconMsg(cbObj, null, IconMsgType.CLUB_APPLY)
		// 	}
		// } else {
		// 	if(size_t(this.applyList) == 0)
		// 		MsgSystem.removeIconMsgByType(IconMsgType.CLUB_APPLY)
		// }
	}

	getApplyList() {
		return this.applyList
	}



	//////////////////////////
	//是否有权限
	isHaveClubJurisdiction() {
		let roleInfo = ClubSystem.getInstance().getRoleClub(GetHeroProperty("id"))
		if (roleInfo == null) {
			return false
		}

		if (roleInfo.post == opFactionOfficeOptions.LEADER || roleInfo.post == opFactionOfficeOptions.SUB_LEADER) {
			return true
		}
		return false
	}

	getRoleClub(id) {
		let list = null
		for (let i in this.clubMenberList) {
			let v = this.clubMenberList[i]

			if (id == v.id) {
				list = v
				break
			}
		}

		return list
	}
	////////////////


	//活跃信息
	setClubActiveInfo(activeLevel, activeExp, taskData) {
		this.activeData = {}
		this.activeData.level = activeLevel
		this.activeData.exp = activeExp
		this.activeData.taskData = taskData //taskData{index=0}
	}

	getClubActiveInfo() {
		return this.activeData
	}

	setClubRenqiInfo(renqiExp, renqiCount, renqiRecord) {
		this.renqiData = {}
		this.renqiData.renqiExp = renqiExp
		this.renqiData.renqiCount = renqiCount
		this.renqiData.renqiRecord = renqiRecord
	}
	getClubRenqiInfo() {
		return this.renqiData
	}

	//技能
	setClubSkillInfo(level, index, force, list) {
		this.skillInfo = {}
		this.skillInfo.level = level
		this.skillInfo.index = index
		this.skillInfo.force = force
		this.skillInfo.list = list
	}

	getClubSkillInfo() {
		return this.skillInfo
	}

	getClubSkillLimit() {
		if (this.curClubInfo) {
			if (GameConfig.FactionExpConfig[this.curClubInfo.level]) {
				return GameConfig.FactionExpConfig[this.curClubInfo.level].skillLevel
			}
		}
		
		return 0
	}

	getClubZiJinLimit() {
		return GameConfig.FactionExpConfig[this.curClubInfo.level].exp
	}

	getClubRenShuLimit() {
		return GameConfig.FactionExpConfig[this.curClubInfo.level].maxCount
	}

	getClubSkillProperty(level, index) {
		return GameConfig.FactionSkillConfig[level]["effects" + index]
	}

	getClubSkillConfig(level, property) {
		return GameConfig.FactionSkillConfig[level][property]
	}

	getClubSkillSumProperty(level) {
		let effects = {}

		for (let i = 1; i <= 8; i++) {
			let effect = table_effect(this.getClubSkillProperty(level, i))
			table_effect_add(effects, effect)
		}

		return effects
	}

	isJoinClub() {
		let heroInfo = GetHeroPropertyInfo()
		return !(heroInfo == null || heroInfo["faction"] == 0)
	}

	setClubEventInfo(record) {
		this.record = record
	}

	getClubEventInfo() {
		return this.record
	}

	///////////////////////帮会仓库/////////////////////////
	setClubStoreItemList(itemList) {
		this.storeItemList = []
		for (let _ in itemList) {
			let itemInfo = itemList[_]
			let item = Item.newObj(itemInfo)
			table_insert(this.storeItemList, item)
		}
	}

	getClubStoreItemList() {
		return this.storeItemList
	}

	setClubPartRecordList(recordList) {
		this.partRecordList = recordList
	}

	getClubPartRecordList(recordList) {
		return this.partRecordList
	}
}