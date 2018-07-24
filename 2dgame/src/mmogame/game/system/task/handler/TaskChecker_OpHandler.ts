/*
作者:
    yangguiming
	
创建时间：
   2013.6.28(周五)

意图：
   检查客户端条件

公共接口：
   
*/

ImportType(TaskOpDefine)

function commonCmp(param, value) {
		//TLog.Debug("commonCmp", task, param ,value)
		//modify:yangguiming 单机版出错了，这里加了判断
		if (value == null) {
			return false
		}

		if (param[0] == ">") {
			if (value > param[1]) { return true }
		} else if (param[0] == ">=") {
			if (value >= param[1]) { return true }
		} else if (param[0] == "<") {
			if (value < param[1]) { return true }
		} else if (param[0] == "<=") {
			if (value <= param[1]) { return true }
		} else if (param[0] == "><") {
			if (value > param[1] && value < param[2]) { return true }
		} else if (param[0] == "==") {
			if (value == param[1]) { return true }
		} else if (param[0] == "!=") {
			if (value != param[1]) { return true }
		} else {
			return false
		}

		return false
	}


module TaskOpSpace {
	function checkHeroLevel(param) {
		let level = GetHeroProperty("level")
		return commonCmp(param, level)
	}

	function isMarkNode(param) {
		let taskId = param[0]
		let nodeId = param[1]

		let task = TaskSystem.getInstance().getTask(taskId)
		if (task == null) {
			return false
		}

		let taskInfo = task.getPropertyInfo()
		return table_isExist(taskInfo.data[taskField.FIELD_CHECK_TASK_NODE] || {}, tonumber(nodeId))
	}

	function checkPetBreakLevel(param) {
		if (param["entryID"]) {
			return commonCmp(param, PetSystem.getInstance().getPetInfoEntry(param["entryID"]).breakThroughLevel)
		} else {
			let petList = PetSystem.getInstance().getPetInfoList()
			if (petList) {
				for (let i in petList) {
					let petInfo = petList[i]

					let ret = commonCmp(param, PetSystem.getInstance().getPetInfoEntry(petInfo.entry).breakThroughLevel)
					if (ret == true) {
						return ret
					}
				}
			}
			return false
		}
	}

	function anyItemCount(param) {
		let t = 0
		let itemList = param[0]
		let cmp = param[1]
		for (let entry in itemList) {
			let itemCount = itemList[entry]

			let logicItem = ItemSystem.getInstance().getItemLogicInfoByEntry(entry, storeOptions.PACKET)
			if (logicItem && logicItem.getProperty("count") >= itemCount) {
				//if(ItemSystem.GetItemTotalNum(entry, storeOptions.PACKET) >= itemCount ){
				t = t + 1
			}
		}
		return commonCmp(cmp, t)
	}

	function joinSchool(param) {
		//TLog.Debug("joinSchool========", role.school, param)
		return GetHeroProperty("school") == param
	}

	function checkFinishTask(param) {
		let taskId = param

		let ret = TaskSystem.getInstance().isTaskHasFinished(taskId)
		if (ret == false) {
			ret = TaskSystem.getInstance().isTaskFinish(taskId)
		}
		TLog.Debug("checkFinishTask", taskId, ret)
		return ret
	}

	function checkItemCount(param) {
		let entry = param[0]
		let cmpParam = param[1]
		let itemList = ItemSystem.getInstance().getItemLogicInfoListByEntry(entry, storeOptions.PACKET)

		let count = 0
		for (let i in itemList) {
			let v = itemList[i]

			count = count + v.getProperty("count")
		}
		return commonCmp(cmpParam, count)
	}

	function findNpc(param) {
		let task_ = TaskSystem.getInstance().getTask(param)
		if (task_ == null) {
			return false
		}

		let task = task_.getPropertyInfo()
		let finishList = task.finish[taskField.FIELD_FINISH_FINDNPC]
		let count = 0
		if (task && task.data && task.data[taskField.FIELD_FINISH_FINDNPC]) {
			//TLog.Debug(task.data[taskField.FIELD_FINISH_FINDNPC])
			for (let k in task.data[taskField.FIELD_FINISH_FINDNPC]) {
				let v = task.data[taskField.FIELD_FINISH_FINDNPC][k]

				for (let s in finishList) {
					let t = finishList[s]

					if (v == t) { count = count + 1 }
				}
			}
		}

		if (task.finish[taskField.FIELD_FINISH_FINDNPC_ONLYONE] && count > 0) { return true } //如果是找到其中一个NPC即可的，就成功了

		if (count >= finishList.length) { return true }
		return false
	}

	function checkFinishCard(param) {
		let flag = true

		param = param || {}
		for (let _ in param) {
			let v = param[_]

			if (type(v) == "object") {
				let cardID = v[0]
				let cardResult = v[1]

				//TLog.Debug("checkFinishCard",cardID,cardResult,CampaignSystem.getInstance().isCampaignPass(cardID))
				//CampaignSystem.getInstance().isCampaignPass(cardID)
				flag = flag && (cardResult == CampaignSystem.getInstance().isCampaignPass(cardID))
				if (flag == false) {
					break
				}
			}
		}

		return flag
	}

	function checkSaveRecord(param) {
		let record = getSaveRecord(param[0])
		let flag = false

		if (param[1] == "NULL") {
			flag = record == null
		} else if (type(record) != "object") {
			flag = record == param[1]
		}

		if (param[2] == null) {
			return flag
		}
		return flag == param[2]
	}

	function checkCurMapId(param) {
		let mapId = tonumber(GetStringSplitBySchool(param))

		return MapSystem.getInstance().getMapId() == mapId
	}


	export let TaskOpHandler: any = {
		//客户端判断
		//[TaskOpDefine.FIELD_CHECK_PET_INFO] : checkPetInfo,					//检查部下信息
		[TaskOpDefine.FIELD_CHECK_LEVEL]: checkHeroLevel,					//检查主角等级
		[TaskOpDefine.FIELD_CHECK_TASK_NODE]: isMarkNode,//检查是否已记录对话节点
		[TaskOpDefine.FIELD_CHECK_PET_BREAK_LEVEL]: checkPetBreakLevel,					//检查部下信息
		[TaskOpDefine.FIELD_CHECK_ANY_ITEM_COUNT]: anyItemCount,					//检查任务物品个数
		[TaskOpDefine.FIELD_CHECK_FINISHTASK]: checkFinishTask,//检查是否完成任务【重要】
		[TaskOpDefine.FIELD_CHECK_ITEM_COUNT]: checkItemCount,//检查指定物品数目
		[TaskOpDefine.FIELD_CHECK_FINISH_NPCTASK]: findNpc,//检查指定任务ID
		[TaskOpDefine.FIELD_CHECK_FINISHCARD]: checkFinishCard,//检查是否通关关卡	
		[TaskOpDefine.FIELD_CHECK_SAVERECORD]: checkSaveRecord,//检查信息记录
		[TaskOpDefine.FIELD_CHECK_CURRENT_MAP]: checkCurMapId,//检查当前地图



	}

	////////////////////////////////////////////////////////////////////////////////////
	//负数KEY是函数的相反作用
	let TempHandleBuffer: any = {}
	for (let key in TaskOpHandler) {
		let func = TaskOpHandler[key]

		TempHandleBuffer[-key] = function (param) {
			return !func(param)
		}
	}

	for (let key in TempHandleBuffer) {
		let func = TempHandleBuffer[key]

		TaskOpHandler[key] = func
	}
	TempHandleBuffer = null
	////////////////////////////////////////////////////////////////////////////////////


}



		// [TaskOpDefine.FIELD_CHECK_SCHOOL]: joinSchool,							//检查门派
		// // [TaskOpDefine.FIELD_CHECK_BAG_EMPTY_ROOM ] : checkBag,				//检查背包空间
		// [TaskOpDefine.FIELD_CHECK_HAS_SAME_TASK_TYPE]: hasSameTask,//是否有相同任务在身
		// [TaskOpDefine.FIELD_CHECK_BRANCH_TASK_COUNT]: hasBranchTaskCount,//检查支线任务数目        

		// [TaskOpDefine.FIELD_CHECK_GIVEUP_IN_TIME]: isGiveUpTaskInTime,//任务放弃时间
		// [TaskOpDefine.FIELD_CHECK_TASK_FAIL]: checkTaskFail,//任务是否失败
		// [TaskOpDefine.FIELD_CHECK_IS_FIND_NPC]: checkIsFindNpc,//是否要找的NPC
		// // [TaskOpDefine.FIELD_CHECK_IN_TASK_TIME ] : checkInTaskTime,//任务时间

		// [TaskOpDefine.FIELD_CHECK_MONEY]: checkMoney,//检查金钱
		// // [TaskOpDefine.FIELD_CHECK_TASK_HOOP ] : checkTaskHoop,//检查任务环段数
		// [TaskOpDefine.FIELD_CHECK_TASK_TIMES]: checkTaskTimes,//检查任务执行次数
		// [TaskOpDefine.FIELD_CHECK_WEEK_CANCEl]: checkWeekCanel,//放弃任务
		// [TaskOpDefine.FIELD_CHECK_WEEK_OPEN]: checkWeekOpen,//开启任务
		// [TaskOpDefine.FIELD_CHECK_TASK_WEEK_TIMES]: checkTaskWeekTimes,//本周开启任务
		// [TaskOpDefine.FIELD_CHECK_TASK_MUTUAL]: checkTaskMutual,//检查互斥任务
		// [TaskOpDefine.FIELD_CHECK_DAY_PRIZE_TIMES]: checkDayPrizeTimes,//检查本日奖励次数
		// [TaskOpDefine.FIELD_CHECK_WEEK_PRIZE_TIMES]: checkWeekPrizeTimes,//检查本周奖励次数
		// //[TaskOpDefine.FIELD_CHECK_TIME_SCOPE ] : checkDayTimeScope,//检查日期时间
		// [TaskOpDefine.FIELD_CHECK_PRIZE_IN_LASTTIME]: checkPrizeInLastTime,//检查领奖时间范围
		// //[TaskOpDefine.FIELD_CHECK_WEEK_TIME_SCOPE ] : checkWeekTimeScope,//检查日期时间
		// [TaskOpDefine.FIELD_CHECK_HAS_SAME_TASK_ID]: hasSameTaskEX,//检查指定任务ID
		// [TaskOpDefine.FIELD_CHECK_CONDITION_TASK_LEVEL_MIN]: checkMinLevel,//检查支线任务的可接
		// [TaskOpDefine.FIELD_CHECK_CONDITION_TASK_PREV]: checkPrevTask,//检查完成的前置任务情况
		// [TaskOpDefine.FIELD_CHECK_IN_SCHOOL]: isInSchool,//检查是否已经加入门派
		// [TaskOpDefine.FIELD_CHECK_IN_NPC_SCHOOL]: isInNpcSchool,//检查是否已经加入NPC对应的门派
		// [TaskOpDefine.FIELD_CHECK_FIND_NPC_COUNT]: checkFindNpcCount,//检查记录NPC的次数
		// [TaskOpDefine.FIELD_CHECK_HERO_PROPERTY]: checkHeroProperty,//检查主角属性
		// [TaskOpDefine.FIELD_CHECK_COMMIT_RES]: checkCommitRes,//检查是否提交资源
		// //[TaskOpDefine.FIELD_CHECK_INTEAM_AWAY] : checkInteamAndAway,//检查是否在队伍里且不为暂离
		// // [TaskOpDefine.FIELD_CHECK_ACCEPTABLE_BRANCH] : checkAcceptableBranch,//检查是否有可接支线任务
		// // [TaskOpDefine.FIELD_CHECK_TEAM_IN] : checkIsInTeam,//检查是否在队伍中
		// // [TaskOpDefine.FIELD_CHECK_TEAM_CAPTAIN] : checkCaptain,//检查是否队长
		// // [TaskOpDefine.FIELD_CHECK_TEAM_COUNT] : checkTeamMember,//检查队伍人数
		// // [TaskOpDefine.FIELD_CHECK_TEAM_MIN_LEVEL] : checkTeamMinLevel,//检查队伍最小等级
		// [TaskOpDefine.FIELD_CHECK_HERO_PROPERTY_RANGE]: checkHeroPropertyRange,//检查主角数值属性范围
		// // [TaskOpDefine.FIELD_CHECK_BRANCHTASK_CANACCEPT] : canacceptBranch,//检查支线任务是否能开放
		// // [TaskOpDefine.FIELD_CHECK_TEAM_LEVELDETAIL] : checkTeamLevelDetail,//检查队伍内成员的等级情况
		// [TaskOpDefine.FIELD_CHECK_HERO_BUFFER]: checkHeroBuffer,//检查角色状态情况
		// [TaskOpDefine.FIELD_CHECK_BUFF_SPARE_TIME]: checkBuffSpareTime,//检查角色多倍经验剩余时间
		// // [TaskOpDefine.FIELD_CHECK_CURRENT_BOUT] : checkCurBout,//检查当前回合数
		// // [TaskOpDefine.FIELD_CHECK_AUTO_COMBAT] : checkAutoCombat,//检查是否为自动战斗状态
		// // [TaskOpDefine.FIELD_CHECK_FUNC_ISOPEN] : checkFuncOpen,//检查指定功能是否开启
		// [TaskOpDefine.FIELD_CHECK_BRANCHTASK_NOTFINISH]: isNotFinishBranch,//检查有否支线任务未完成
		// //[TaskOpDefine.FIELD_CHECK_MEAN_SKILL_LEVEL] : checkMeanSkillLevel,//检查平均技能等级
		// //[TaskOpDefine.FIELD_CHECK_MAIN_SKILL_LEVEL] : checkMainSkillLevel,//检查主技能等级
		// [TaskOpDefine.FIELD_CHECK_ITEM_IN_PACKET]: checkItemInPacket,//检查背包有无指定物品
		// [TaskOpDefine.FIELD_CHECK_CAN_UPDATALEVEL]: checkCanUpLevel,//检查能否升级
		// [TaskOpDefine.FIELD_CHECK_ROLE_CLUB]: checkRoleClub,//检查角色是否加入帮派

		// [TaskOpDefine.FIELD_CHECK_BUFF_TIME]: checkBuffTime,//检查指定任务ID
		// [TaskOpDefine.FIELD_CHECK_PET_ROOM]: checkPetRoom,//检查指定任务ID
		// [TaskOpDefine.FIELD_CHECK_HERO_HP_RATIO]: checkHpRatio,//检查属性相对数值
		// //[TaskOpDefine.FIELD_CHECK_STUDY_SKILL] : checkStudySkill,//检查能否升级技能系
		// [TaskOpDefine.FIELD_CHECK_ROLE_SETTING_OPEN]: checkRoleSettingOpen,//检查指定属性是否开启
		// [TaskOpDefine.FIELD_CHECK_TASK_COUNT]: checkTaskCount,//检查任务数量
		// [TaskOpDefine.FIELD_CHECK_PET_NATURE]: checkPetNature,//检查部下善恶等级
		// [TaskOpDefine.FIELD_CHECK_PET_LEVEL]: checkPetLeve,//检查部下等级
		// [TaskOpDefine.FIELD_CHECK_PET_INTIMATE]: checkPetIntimate,//检查部下亲密度
		// [TaskOpDefine.FIELD_CHECK_TEAM_SKILL_LEVEL]: checkTeamSkillLevel,//检查团队技能等级
		// [TaskOpDefine.FIELD_CHECK_PET_EMBATTLE]: checkPetEmbattle,//检查团队技能等级
		// //[TaskOpDefine.FIELD_CHECK_INVITE_PET_COUNT] : checkInvitePetCount,//检查邀请环
		// [TaskOpDefine.FIELD_CHECK_HERO_FIGHT_STATUE]: checkHeroFightStatue,//检查是否战斗
		// [TaskOpDefine.FIELD_CHECK_PLAYER_HAVE_PET]: checkHavePet,//检查是否有部下
		// [TaskOpDefine.FIELD_CHECK_PET_AWAKE_LEVEL]: checkPetAwakeLevel,//检查是否有部下

		// //V3
		// // [TaskOpDefine.FIELD_CHECK_GROW_CHANNEL_ENOUGH]: checkGrowChannelEnough,//检查互动频道数是否足够
		// // [TaskOpDefine.FIELD_CHECK_GROW_EVENT]: checkGrowEvent,//检查互动事件数
		// [TaskOpDefine.FIELD_CHECK_HERO_DRESS] : checkHeroDress, //检查角色是否有穿装备
		// [TaskOpDefine.FIELD_CHECK_TICKET_BOX] : checkTicketBox, //检查角色是否有密钥或者boss宝箱
		// [TaskOpDefine.FIELD_CHECK_ACTIVITY_INDEX] : checkActivityIndex, //检查角色当前在哪个活动中

			
	// //是否有相同类型任务
	// function hasSameTask(param) {
	// 	let hasSameTask = false
	// 	let taskSystem = TaskSystem.getInstance()

	// 	for (let taskId in taskSystem.getTaskList()) {
	// 		let v = taskSystem.getTaskList()[taskId]

	// 		if (taskSystem.isActivity(taskId)) { //活动类型
	// 			if (taskId == param) {
	// 				hasSameTask = true
	// 				break
	// 			}
	// 		} else {
	// 			if (v.getPropertyInfo().Type == param) {
	// 				hasSameTask = true
	// 				break
	// 			}
	// 		}
	// 	}

	// 	return hasSameTask
	// }


	// //支线数目
	// function hasBranchTaskCount(param) {
	// 	let count = 0
	// 	let taskSystem = TaskSystem.getInstance()

	// 	for (let taskId in taskSystem.getTaskList()) {
	// 		let v = taskSystem.getTaskList()[taskId]

	// 		if (v.getPropertyInfo().Type == taskType.Branch) {
	// 			count = count + 1
	// 		}
	// 	}
	// 	return commonCmp(param, count)
	// }

	// //放弃任务，仍在时间之内
	// function isGiveUpTaskInTime(param) {
	// 	//param 传过来第一个参数是任务类型，第二个参数是时间(秒)
	// 	if (!GetHeroProperty("saveRecord")) {
	// 		return false
	// 	}
	// 	if (param[0] && param[1]) {
	// 		let type = param[0]
	// 		let secCound = param[1]
	// 		let now = GetServerTime()
	// 		let key = opSaveRecordKey.taskCancelTime[type]
	// 		if (!key || !getSaveRecord(key)) { return false }
	// 		let time = getSaveRecord(key) //任务放弃的目标时间

	// 		return (now - time) < secCound
	// 	}
	// 	return false
	// }

	// function checkTaskFail(param) {
	// 	let taskid = param
	// 	return TaskSystem.getInstance().isTaskFailed(taskid)
	// }

	// function checkIsFindNpc(param) {
	// 	//if(! task.finish ){ return false }
	// 	//if(! task.finish[taskField.FIELD_FINISH_FINDNPC] ){ return false }
	// 	//NpcInTaskHandle.set_ignore_find_tips(true)
	// 	//let find = NpcInTaskHandle[taskField.FIELD_FINISH_FINDNPC](task.taskId, param) //是否应该找的NPC
	// 	//NpcInTaskHandle.set_ignore_find_tips(false)
	// 	//return find
	// 	return true
	// }
	// //
	// ////检查是否在任务时间内
	// // function checkInTaskTime( param){
	// // 	//if(task.init && task.init[taskField.FIELD_INIT_TIME] ){ 
	// // 	//	return task.init[taskField.FIELD_INIT_TIME] - StateSystem.GetServerTime() > 0
	// // 	//}
	// // 	//return false
	// // 	//return task_system.check_in_task_time(task.taskId)
	// // 	return TaskSystem.getInstance().isTaskInTime(taskId)
	// // }

	// function checkMoney(param) {
	// 	let moneyType = param[0]
	// 	let cmpParam = param[1]

	// 	let money = 0
	// 	if (moneyType == 1) {//现银
	// 		money = GetHeroProperty("cash")
	// 	} else if (moneyType == 2) {//储备金
	// 		money = GetHeroProperty("funds")
	// 	} else if (moneyType == 3) {//现银+储备金
	// 		money = GetHeroProperty("funds") + GetHeroProperty("cash")
	// 	}
	// 	return commonCmp(cmpParam, money)
	// }

	// // function checkTaskHoop( paramTable){     //paramTable = {{hoop, segment}, taskType}
	// // 	let param = paramTable[0]
	// // 	let type = paramTable[1]
	// // 	if(param[0] && param[1] && GetHeroProperty("saveRecord") ){
	// // 		let hoop, segment = param[0], param[1]
	// // 		let hoopInfo = getSaveRecord(opSaveRecordKey.taskHoop[type])//role.saveRecord[opSaveRecordKey.schoolHoop]
	// // 		if(! hoopInfo ){
	// // 			return true
	// // 		}
	// // 		let curHoop, curSegment = unpack(hoopInfo)

	// // 		if(curHoop > hoop ){
	// // 			return false
	// // 		}

	// // 		if(curHoop >= hoop && curSegment >= segment ){ //到达了总数了
	// // 			return false
	// // 		}
	// // 		return true
	// // 	}
	// // 	return false
	// // }

	// function checkTaskTimes(paramTable) {
	// 	let type = paramTable[0]
	// 	let param = paramTable[1]
	// 	let count = 0
	// 	if (GetHeroProperty("saveRecord")) {
	// 		let hoopInfo = getSaveRecord(opSaveRecordKey.taskCount[type])//role.saveRecord[opSaveRecordKey.schoolHoop]
	// 		if (hoopInfo) {
	// 			count = hoopInfo
	// 		}
	// 		//TLog.Debug("==========================checkTaskTimes", "taskType", type, param[0], param[1], count)	
	// 		//TLog.Debug("server Hoop:", hoopInfo, commonCmp( param, count))
	// 	}
	// 	return commonCmp(param, count)

	// }

	// function checkWeekCanel(param) {
	// 	//TLog.Debug("=======================================checkWeekCanel", getSaveRecord(opSaveRecordKey.taskWeekCancel[param]), param)
	// 	if (param) {
	// 		let giveup = getSaveRecord(opSaveRecordKey.taskWeekCancel[param])
	// 		return giveup != null
	// 	}
	// 	return false
	// }

	// function checkWeekOpen(param) {
	// 	//TLog.Debug("=======================================checkWeekOpen", getSaveRecord(opSaveRecordKey.taskWeekOpen[param]), param)
	// 	if (param) {
	// 		let open = getSaveRecord(opSaveRecordKey.taskWeekOpen[param])
	// 		return open != null
	// 	}
	// 	return false
	// }

	// function checkTaskWeekTimes(paramTable) {
	// 	let type = paramTable[0]
	// 	let param = paramTable[1]
	// 	let count = 0
	// 	if (GetHeroProperty("saveRecord")) {
	// 		let hoopInfo = getSaveRecord(opSaveRecordKey.taskWeekCount[type])//role.saveRecord[opSaveRecordKey.schoolHoop]
	// 		if (hoopInfo) {
	// 			count = hoopInfo
	// 		}
	// 	}
	// 	return commonCmp(param, count)
	// }

	// function checkTaskMutual(param) {
	// 	let list: any = {}
	// 	for (let _ in param) {
	// 		let mutxId = param[_]

	// 		if (TaskSystem.getInstance().getTask(mutxId)) {
	// 			JsUtil.arrayInstert(list, TaskSystem.getInstance().getTaskName(mutxId))
	// 		}
	// 	}
	// 	//task_repword.SetMutexTask(list)
	// 	if (list.length != 0) {
	// 		return true
	// 	}
	// 	return false
	// }

	// function checkDayPrizeTimes(paramTable) {
	// 	let type = paramTable[0]
	// 	let param = paramTable[1]
	// 	let count = 0
	// 	if (GetHeroProperty("saveRecord")) {
	// 		let hoopInfo = getSaveRecord(opSaveRecordKey.npcPrizeCount[type])//role.saveRecord[opSaveRecordKey.schoolHoop]
	// 		if (hoopInfo) {
	// 			count = hoopInfo
	// 		}
	// 	}
	// 	return commonCmp(param, count)
	// }

	// function checkWeekPrizeTimes(paramTable) {
	// 	let type = paramTable[0]
	// 	let param = paramTable[1]
	// 	let count = 0
	// 	if (GetHeroProperty("saveRecord")) {
	// 		let hoopInfo = getSaveRecord(opSaveRecordKey.npcPrizeWeekCount[type])//role.saveRecord[opSaveRecordKey.schoolHoop]
	// 		if (hoopInfo) {
	// 			count = hoopInfo
	// 		}
	// 	}
	// 	return commonCmp(param, count)
	// }


	// // function checkDayTimeScope( p){ //p = {'><',{2010,12,20,5,30}, [{2010,12,20,5,30}] }
	// // 	let param:any = {}
	// // 	param[0] = p[0]

	// // 	let time1:any = {}
	// // 	time1.year = p[1][0]
	// // 	time1.month = p[1][1]
	// // 	time1.day = p[1][2]
	// // 	time1.hour = p[1][3]
	// // 	time1.min = p[1][4]
	// // 	let time1_sec1 = os.time(time1)

	// // 	let time1_sec2 = null
	// // 	if(p[2] ){
	// // 		let time2:any = {}
	// // 		time2.year 	= p[2][0]
	// // 		time2.month = p[2][1]
	// // 		time2.day 	= p[2][2]
	// // 		time2.hour	= p[2][3]
	// // 		time2.min 	= p[2][4]
	// // 		time1_sec2 = os.time(time2)
	// // 	}
	// // 	param[1] = time1_sec1
	// // 	param[2] = time1_sec2

	// // 	let value = GetServerTime() //比较时间范围
	// // 	return commonCmp( param, value)
	// // }

	// function checkPrizeInLastTime(param) {
	// 	////param 传过来第一个参数是任务类型，第二个参数是时间(秒)
	// 	if (!GetHeroProperty("saveRecord")) {
	// 		return false
	// 	}
	// 	if (param[0] && param[1]) {
	// 		let type = param[0]
	// 		let secCound = param[1]
	// 		let now = GetServerTime()
	// 		let time = getSaveRecord(opSaveRecordKey.npcPrizeLastTime[type])
	// 		if (time) {
	// 			return (now - time) < secCound
	// 		}
	// 	}
	// 	return false
	// }


	// // function checkWeekTimeScope( param){
	// // 	//TLog.Debug("checkWeekTimeScope0000000000000000000000000000")
	// // 	let cur_time = os.date("*t", GetServerTime() )
	// // 	let weekDay = param[1] 
	// // 	if(weekDay && weekDay.length != 0 ){ //不在星期之内
	// // 		let in_day = false
	// // 		for(let i = 0; i < weekDay.length; i++){
	// // 			let v = weekDay[i]

	// // 			if(v == cur_time.wday ){
	// // 				in_day = true
	// // 				break
	// // 			}
	// // 		}
	// // 		if(! in_day ){
	// // 			return false
	// // 		}
	// // 	}
	// // 	let targetTime = param[0]
	// // 	if(targetTime && targetTime[0] && targetTime[1] ){
	// // 		let b_hour, b_min = string.match(targetTime[0], "(%d+):(%d+)")
	// // 		let e_hour, e_min = string.match(targetTime[1], "(%d+):(%d+)")
	// // 		b_hour, b_min = tonumber(b_hour), tonumber(b_min)
	// // 		e_hour, e_min = tonumber(e_hour), tonumber(e_min)

	// // 		if(b_hour && b_min && e_hour && e_min ){
	// // 			//时分段内
	// // 			let cur_minute = cur_time.hour * 60 + cur_time.min
	// // 			let b_minute = b_hour * 60 + b_min
	// // 			let e_minute = e_hour * 60 + e_min
	// // 			if(cur_minute >= b_minute && cur_minute <= e_minute ){  
	// // 				return true
	// // 			}
	// // 		}
	// // 	}


	// // 	return false
	// // }

	// function hasSameTaskEX(param) {
	// 	param = param || {}
	// 	let ret = false
	// 	for (let _ = 0; _ < param.length; _++) {
	// 		let taskId = param[_]

	// 		if (TaskSystem.getInstance().isTaskExsit(taskId)) {
	// 			ret = true
	// 			break
	// 		}
	// 	}
	// 	TLog.Debug("hasSameTaskEX return", ret, param[0])
	// 	return ret

	// }

	
	// function checkMinLevel(param) {
	// 	return tonumber(GetHeroProperty("level")) >= tonumber(param)
	// }

	// function checkPrevTask(param) {
	// 	let finishList = TaskSystem.getInstance().getFinishTaskList()

	// 	for (let i in param) {
	// 		let taskId = param[i]

	// 		let flag = false
	// 		if (!table_isExist(finishList, taskId)) {
	// 			return false							//只要有一个前置任务没有完成即跳出
	// 		}
	// 	}

	// 	return true
	// }

	// function isInSchool(param) {
	// 	let school = GetHeroProperty("school")
	// 	let isIn = false

	// 	if (school != 0) {
	// 		isIn = true
	// 	}

	// 	return isIn == param
	// }

	// function isInNpcSchool(param) {
	// 	let school = GetHeroProperty("school")

	// 	return tonumber(school) == param
	// }

	// function checkFindNpcCount(param) {
	// 	let entryId = param[0]
	// 	let count = param[1]
	// 	let taskId = param[2]

	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	if (!taskInfo.data[taskField.FIELD_FINISH_FINDNPC]) {
	// 		return false
	// 	}
	// 	let _count = 0
	// 	for (let _ in taskInfo.data[taskField.FIELD_FINISH_FINDNPC]) {
	// 		let v = taskInfo.data[taskField.FIELD_FINISH_FINDNPC][_]

	// 		if (entryId == v) {
	// 			_count = _count + 1
	// 		}
	// 	}

	// 	return count == _count
	// }

	// function checkHeroProperty(param) {
	// 	let judgment = true
	// 	let count = 0

	// 	for (let k in param) {
	// 		let v = param[k]

	// 		count = count + 1
	// 		if (v != GetHeroProperty(k)) {
	// 			judgment = false
	// 			break
	// 		}
	// 	}

	// 	if (count == 0) {
	// 		judgment = false
	// 	}

	// 	return judgment
	// }

	// function checkCommitRes(param) {
	// 	let taskId = tonumber(param)
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()

	// 	if (taskInfo.data[taskField.FIELD_FINISH_GIVE_RES] || taskInfo.data[taskField.FIELD_FINISH_GIVE_PET]) {
	// 		return true
	// 	} else {
	// 		return false
	// 	}
	// }

	// //function checkInteamAndAway(param){
	// //	let flag = HeroIsTeamMemNotAway()
	// //	return flag == param
	// //}

	// // function checkAcceptableBranch(param){
	// // 	let arg, entryId = param[0], param[1]
	// // 	let refList = TaskAcceptNpcConfig[entryId]
	// // 	let taskSystem = TaskSystem.getInstance()

	// // 	for(let _ in refList){
	// // 			let ref = refList[_]

	// // 		for(let mainType in ref.TaskIdList){
	// // 			let taskList = ref.TaskIdList[mainType]

	// // 			if(mainType == TaskMainType.Branch ){
	// // 				for(let secType in taskList){
	// // 			let list = taskList[secType]

	// // 					for(let i = 0; i < list.length; i++){
	// // 			let taskId = list[i]

	// // 						if(taskSystem.isTaskCanShow(mainType, secType, taskId) ){
	// // 							return arg == true
	// // 						}
	// // 					}
	// // 				}
	// // 			}
	// // 		}
	// // 	}

	// // 	return arg == false
	// // }

	// // function checkIsInTeam(param){
	// // 	return param == HeroIsInTeam()
	// // }

	// // function checkCaptain(param){
	// // 	return param == checkCaptain()
	// // }

	// // function checkTeamMember(param){
	// // 	let count = TeamSystem.getInstance().getTeamCount()
	// // 	if(! count ){
	// // 		count = 0
	// // 	}

	// // 	return commonCmp(param, count)
	// // }

	// // function checkTeamMinLevel(param){
	// // 	let teamInfo = TeamSystem.getInstance().getTeamInfo()
	// // 	if(! teamInfo || size_t(teamInfo.membersList) == 0 ){
	// // 		return GetHeroProperty("level") >= param
	// // 	}else{
	// // 		for(let id in teamInfo.membersList){
	// // 			let mem = teamInfo.membersList[id]

	// // 			if(mem.level < param ){
	// // 				return false
	// // 			}
	// // 		}
	// // 		return true
	// // 	}
	// // }

	// function checkHeroPropertyRange(param) {
	// 	let judgment = true
	// 	let count = 0

	// 	for (let k in param) {
	// 		let v = param[k]

	// 		count = count + 1
	// 		if (!GetHeroProperty(k) || !commonCmp(v, GetHeroProperty(k))) {
	// 			judgment = false
	// 			break
	// 		}
	// 	}

	// 	if (count == 0) {
	// 		judgment = false
	// 	}

	// 	return judgment
	// }

	// // function canacceptBranch(param){
	// // 	let entryId = param[0]
	// // 	let funcId = param[1]
	// // 	if(! TaskAcceptNpcConfig[entryId] || ! TaskAcceptNpcConfig[entryId][funcId] || ! GetHeroProperty("level") ){
	// // 		return false
	// // 	}

	// // 	let finishTaskList = TaskSystem.getInstance().getFinishTaskList()

	// // 	for(let mainType in TaskAcceptNpcConfig[entryId][funcId].TaskIdList){
	// // 			let list = TaskAcceptNpcConfig[entryId][funcId].TaskIdList[mainType]

	// // 		if(mainType == TaskMainType.Branch ){
	// // 			let canShow = true
	// // 			let levelFlag = false
	// // 			let hasFinish = true
	// // 			for(let secType in list){
	// // 			let taskList = list[secType]

	// // 				if(GetHeroProperty("level") >= secType ){											//直接忽略等级不足的
	// // 					if(! levelFlag ){
	// // 						levelFlag = true
	// // 					}

	// // 					for(let _ = 0; _ < taskList.length; _++){
	// // 			let taskId = taskList[_]

	// // 						if(! table_isExist(finishTaskList, taskId) ){						//不存在，就是没有做过这个任务
	// // 							hasFinish = false
	// // 							break
	// // 						}
	// // 					}

	// // 					if(! hasFinish ){
	// // 						break
	// // 					}
	// // 				}
	// // 			}

	// // 			if(hasFinish ){																							//已完成列表里没有不存在的，也就是不能再接当前列表里的支线任务
	// // 				canShow = false
	// // 			}

	// // 			if(levelFlag && canShow ){
	// // 				return true
	// // 			}
	// // 		}
	// // 	}
	// // 	return false
	// // }

	// // function checkTeamLevelDetail(param){
	// // 	let teamInfo = TeamSystem.getInstance().getTeamInfo()
	// // 	if(! teamInfo || size_t(teamInfo.membersList) == 0 ){
	// // 		return commonCmp(param, GetHeroProperty("level"))
	// // 	}else{
	// // 		for(let id in teamInfo.membersList){
	// // 			let mem = teamInfo.membersList[id]

	// // 			if(! commonCmp(param, mem.level) ){
	// // 				return false
	// // 			}
	// // 		}
	// // 		return true
	// // 	}
	// // }

	// function checkHeroBuffer(param) {
	// 	let buffId = param
	// 	let buff = BuffSystem.getInstance().getHeroBuff(buffId)
	// 	if (buff) {
	// 		return true
	// 	}
	// 	return false
	// }

	// function checkBuffSpareTime(param) {
	// 	let buffId = param[0]
	// 	let time = param[1]
	// 	let spareTime = BuffSystem.getInstance().getSpareTime(buffId)
	// 	if (time > spareTime) {
	// 		return true
	// 	}
	// 	return false
	// }

	// function checkBuffTime(param) {
	// 	let buffId = param[0]
	// 	let time = param[1]
	// 	let buff = BuffSystem.getInstance().getHeroBuff(buffId)
	// 	if (buff) {
	// 		let buffLive = Math.ceil(buff.getAlive() / 3600)
	// 		if (buffLive + time > 4) {
	// 			return true
	// 		}
	// 	}
	// 	return false
	// }

	// // function checkCurBout(param){
	// // 	if(type(pram) == "object" ){
	// // 		let curBout = CombatSystem.getInstance().get_bout()
	// // 		return commonCmp(param, curBout)
	// // 	}else{
	// // 		return CombatSystem.getInstance().get_bout() == param
	// // 	}
	// // }

	// // function checkAutoCombat(param){
	// // 	return CombatSystem.getInstance().is_auto_combat() == param
	// // }

	// // function checkFuncOpen(param){
	// // 	return GuideSystem.getInstance().isFuncOpen(param[0]) == param[1]
	// // }

	// function isNotFinishBranch(param) {
	// 	return param == TaskChecker.getInstance().getClosestBranchTaskType()
	// }

	// //function checkMeanSkillLevel(param){
	// //	let skillList = SkillSystem.getInstance().getSkillSeriesList()
	// //	let count = 0
	// //	let sum = 0
	// //	
	// //	for(let _ in skillList){
	// //			let v = skillList[_]
	// //	
	// //		count = count + 1
	// //		sum = sum + v.getLevel()
	// //	}
	// //	sum = tonumber(sum / count)
	// //	
	// //	if(param["appoint"] ){
	// //		return commonCmp(param["appoint"], sum)	
	// //	}else if(param["relate"] ){
	// //		let arg = table_copy(param["relate"])
	// //		let op = arg[0]
	// //		let value = arg[1]
	// //		
	// //		arg[1] = GetHeroProperty("level") + value
	// //		
	// //		return commonCmp(arg, sum)
	// //	}
	// //	
	// //	return true
	// //}

	// //function checkMainSkillLevel(param){
	// //	let skillList = SkillSystem.getInstance().getMajorSkillSeries()
	// //	if(! skillList ){
	// //		return false
	// //	}
	// //	
	// //	return commonCmp(param, skillList.getLevel())
	// //}

	// function checkItemInPacket(param) {
	// 	let logicItem = ItemSystem.getInstance().getItemLogicInfoByEntry(param, storeOptions.PACKET)

	// 	return logicItem != null
	// }

	// function checkCanUpLevel(param) {
	// 	let max_exp = RoleSystem.getInstance().getLevelupExp()
	// 	return commonCmp([null, ">:", max_exp], tonumber(GetHeroProperty("experience"))) == param
	// }


	// function checkRoleClub(param) {
	// 	let flag = false
	// 	if (GetHeroProperty("faction") != 0) {
	// 		flag = true
	// 	}

	// 	return flag == param
	// }

	// function checkPetRoom(param) {
	// 	let heroPetMax = GetHeroProperty("pet_max")
	// 	let petList = PetSystem.getInstance().getPetInfoList()
	// 	let petSize = size_t(petList)
	// 	if (heroPetMax <= petSize) {
	// 		return true
	// 	}
	// 	return false
	// }

	// function checkHpRatio(param) {
	// 	let max_hp = GetHeroProperty("max_hp")
	// 	let hp = GetHeroProperty("hp")
	// 	let op: any = {}

	// 	op[0] = param[0]
	// 	op[1] = param[1] * max_hp
	// 	if (param[2]) {
	// 		op[2] = param[2] * max_hp
	// 	}

	// 	return commonCmp(op, hp)
	// }

	// //function checkStudySkill(param){
	// //	let flag = false
	// //	
	// //	for(let _ in SkillSystem.getInstance().getSkillSeriesList()){
	// //let v = SkillSystem.getInstance().getSkillSeriesList()[_]
	// //
	// //		if(SkillSystem.getInstance().canStudySkillSeries(v) ){
	// //			flag = true
	// //			break
	// //		}
	// //	}
	// //	
	// //	return flag == param
	// //}

	// function checkRoleSettingOpen(param) {
	// 	return IsFunctionOpen(param)
	// }

	// function checkTaskCount(param) {
	// 	let taskList = TaskSystem.getInstance().getTaskList()
	// 	return commonCmp(param, size_t(taskList))
	// }

	

	

	// function checkPetNature(param) {
	// 	if (param["entryID"]) {
	// 		return commonCmp(param, PetSystem.getInstance().getPetInfoEntry(param["entryID"]).nature)
	// 	} else {
	// 		let petList = PetSystem.getInstance().getPetInfoList()
	// 		if (petList) {
	// 			for (let i in petList) {
	// 				let petInfo = petList[i]

	// 				let ret = commonCmp(param, PetSystem.getInstance().getPetInfoEntry(petInfo.entry).nature)
	// 				if (ret == true) {
	// 					return ret
	// 				}
	// 			}
	// 		}
	// 		return false
	// 	}
	// }

	// function checkPetAwakeLevel(param) {
	// 	if (param["entryID"]) {
	// 		return commonCmp(param, PetSystem.getInstance().getPetInfoEntry(param["entryID"]).activeLevel)
	// 	} else {
	// 		let petList = PetSystem.getInstance().getPetInfoList()
	// 		if (petList) {
	// 			for (let i in petList) {
	// 				let petInfo = petList[i]

	// 				let ret = commonCmp(param, PetSystem.getInstance().getPetInfoEntry(petInfo.entry).activeLevel)
	// 				if (ret == true) {
	// 					return ret
	// 				}
	// 			}
	// 		}
	// 		return false
	// 	}
	// }
	// function checkPetLeve(param) {
	// 	if (param["entryID"]) {
	// 		return commonCmp(param, PetSystem.getInstance().getPetInfoEntry(param["entryID"]).level)
	// 	} else {
	// 		let petList = PetSystem.getInstance().getPetInfoList()
	// 		if (petList) {
	// 			for (let i in petList) {
	// 				let petInfo = petList[i]

	// 				let ret = commonCmp(param, PetSystem.getInstance().getPetInfoEntry(petInfo.entry).level)
	// 				if (ret == true) {
	// 					//TLog.Debug("checkPetLeve return true")
	// 					return ret
	// 				}
	// 			}
	// 		}
	// 		//TLog.Debug("checkPetLeve return false")
	// 		//TLog.Debug_r(petList)
	// 		return false
	// 	}
	// }
	// function checkTeamSkillLevel(param) {
	// 	let skillList = param["skillList"]

	// 	//TLog.Debug_r(param)

	// 	let ret = true
	// 	for (let key in skillList) {
	// 		let value = skillList[key]

	// 		let getValue = GetHeroProperty(key + "_level")

	// 		ret = commonCmp(value, getValue)
	// 		TLog.Debug(key, value, "get", getValue, ret)
	// 		if (!ret) {
	// 			break
	// 		}
	// 	}
	// 	TLog.Debug("checkTeamSkillLevel", ret)
	// 	//io.read()
	// 	return ret
	// }


	// function checkPetIntimate(param) {
	// 	if (param["entryID"]) {
	// 		return commonCmp(param, PetSystem.getInstance().getPetInfoEntry(param["entryID"]).intimate)
	// 	} else {
	// 		let petList = PetSystem.getInstance().getPetInfoList()
	// 		if (petList) {
	// 			for (let i in petList) {
	// 				let petInfo = petList[i]

	// 				let ret = commonCmp(param, PetSystem.getInstance().getPetInfoEntry(petInfo.entry).intimate)
	// 				if (ret == true) {
	// 					return ret
	// 				}
	// 			}
	// 		}
	// 		return false
	// 	}
	// }
	// // function checkInvitePetCount(param){
	// // 	if(! param ){
	// // 		return 
	// // 	}

	// // 	let quality,turnCount,freeCount = GuideSystem.getInstance().getQuickRecuritData()
	// // 	//TLog.Debug("checkInvitePetCount ",param,quality,turnCount,freeCount)
	// // 	//io.read()
	// // 	return quality == param 
	// // }

	// function checkHeroFightStatue(param) {

	// 	let heroInfo = GetHeroPropertyInfo()

	// 	TLog.Debug("checkHeroFightStatue", heroInfo.status, opStatusType.STATUS_TYPE_FIGHT, param, bit.band(heroInfo.status, opStatusType.STATUS_TYPE_FIGHT) != 0)
	// 	//io.read()
	// 	return (bit.band(heroInfo.status, opStatusType.STATUS_TYPE_FIGHT) != 0) == param

	// }

	// function checkHavePet(param) {
	// 	let flag = true

	// 	for (let k in param || {}) {
	// 		let v = param || {}[k]

	// 		let entryId = v[0]
	// 		let ret = v[1]

	// 		if (ret != PetSystem.getInstance().isPetExitsInEntry(entryId)) {
	// 			flag = false
	// 			break
	// 		}
	// 	}

	// 	return flag
	// }


	// function checkPetEmbattle(param) {
	// 	//TLog.Debug("checkPetEmbattle")
	// 	function sortFunc(a, b) {
	// 		//return a>b
	// 		return b - a
	// 	}

	// 	let wnd = WngMrg.getInstance().getWindow("EmbattleFrame")
	// 	let list = wnd.getCurPetArrayList() || null
	// 	if (param["systemList"]) {
	// 		list = CampaignSystem.getInstance().getCampaignArray(BattleQueueType.Campaign)
	// 	}
	// 	let curList: any = {}
	// 	//TLog.Debug_r(list)
	// 	//检查当前上阵
	// 	if (list) {
	// 		for (let _i in list) {
	// 			let _v = list[_i]

	// 			let havePet = false
	// 			for (let _ in param["petList"]) {
	// 				let _entry = param["petList"][_]

	// 				if (_v == _entry) {
	// 					havePet = true
	// 					break
	// 				}
	// 			}
	// 			if (_v != 0 && havePet) {
	// 				JsUtil.arrayInstert(curList, _v)
	// 			}
	// 		}
	// 		table_sort(curList, sortFunc)
	// 	}
	// 	//筛选检查列表
	// 	let checkList: any = {}
	// 	for (let _i in param["petList"]) {
	// 		let _v = param["petList"][_i]

	// 		if (PetSystem.getInstance().isPetExitsInEntry(_v)) {
	// 			JsUtil.arrayInstert(checkList, _v)
	// 		}
	// 	}
	// 	table_sort(checkList, sortFunc)
	// 	//TLog.Debug_r(checkList)
	// 	//TLog.Debug("~~~~~~~~~~~")
	// 	//TLog.Debug_r(curList)

	// 	let ret = true
	// 	//TLog.Debug("fds",checkList.length,curList.length)
	// 	//if(checkList.length <= curList.length ){
	// 	//	ret = false
	// 	//}
	// 	if (checkList.length != curList.length) {
	// 		ret = true
	// 	} else {
	// 		ret = false
	// 		for (let i = 1; i <= checkList.length, 1; i++) {
	// 			if (checkList[i] != curList[i]) {
	// 				ret = true
	// 			}
	// 		}
	// 	}
	// 	//TLog.Debug("~checkPetEmbattle~~",ret)
	// 	if (param["checkRet"] != null) {
	// 		return ret == param["checkRet"]
	// 	}

	// 	return ret
	// }

	// // function checkPetInfo(param){
	// // 	if(param["checkType"] == "equip" ){
	// // 		let totalEquipCount = 0
	// // 		let allCanUseList = ItemSystem.getInstance().getCanUseEquipConfig()
	// // 		let equipList = ItemSystem.getInstance().getStoreItemList(itemRefStore.Equip)
	// // 		let queueList = CampaignSystem.getInstance().getCampaignArray(BattleQueueType.Campaign)
	// // 		let petEquipName1 =EquipPosName
	// // 		for(let i in queueList){
	// // 			let v = queueList[i]

	// // 			if(v != 0 ){
	// // 				let petInfo = PetSystem.getInstance().getPetInfoEntry(v)
	// // 				if(petInfo ){			
	// // 					for(let j in equipList){
	// // 			let equip = equipList[j]

	// // 						let equipType = equip.getRefProperty("type")
	// // 						let equipEntry = 	equip.getProperty("entry")	
	// // 						for(let _k in allCanUseList){
	// // 			let _v = allCanUseList[_k]

	// // 							if(equipEntry == _k && (! petInfo[petEquipName1[equipType]] )){
	// // 								 totalEquipCount = totalEquipCount + 1
	// // 							}						
	// // 						}
	// // 					}
	// // 				}	
	// // 			}
	// // 		}
	// // 		if(totalEquipCount > 0 ){
	// // 			return true		
	// // 		}
	// // 	}else if(param["checkType"] == "level" ){	
	// // 		if(param["petCount"] && param["checkValue"] ){
	// // 			let queueList = CampaignSystem.getInstance().getCampaignArray(BattleQueueType.Campaign)
	// // 			let curFinishCount = 0
	// // 			for(let i in queueList){
	// // 			let v = queueList[i]

	// // 				if(v != 0 ){
	// // 					let petInfo = PetSystem.getInstance().getPetInfoEntry(v)
	// // 					if(petInfo ){	
	// // 						if(commonCmp(param["checkValue"],petInfo.level) ){
	// // 							curFinishCount = curFinishCount + 1
	// // 						}						
	// // 					}	
	// // 				}
	// // 			}
	// // 			return commonCmp(param["petCount"],curFinishCount)
	// // 		}
	// // 	}
	// // 	return false
	// // }

	// // function checkGrowChannelEnough(param) {
	// // 	let curnum = GrowSystem.getInstance().getChannelsNum()
	// // 	let maxnum = GrowSystem.getInstance().getMaxChannelNum()
	// // 	let flag = curnum < maxnum

	// // 	return flag == param
	// // }

	// // function checkGrowEvent(param) {
	// // 	return param == (GrowSystem.getInstance().getEventNum() > 0)
	// // }

	// // function checkBotnDay(param){
	// // 	let createTime = RoleSystem.getInstance().getRoleCreateTime() || 0
	// // 	let index = getDayCount(createTime, GetServerTime()) + 1
		
	// // 	return commonCmp(param, index)
	// // }

	// function checkHeroDress(param){
	// 	let list = ["equip_weapon", "equip_mask","equip_cap","equip_neck","equip_cloth","equip_shoe"]
	// 	let flag = false
	// 	let equipOwnerInfo = GetHeroPropertyInfo()
		
	// 	for(let _ in list){
	// 		let name = list[_]
		
	// 		let curEquip = equipOwnerInfo[name]
	// 		if(curEquip ){
	// 			flag = true
	// 		}
	// 	}
		
	// 	return flag == param
	// }

	// function checkTicketBox(param){
	// 	let flag = false
	// 	let status = GetHeroProperty("status") || 0
	// 	if(bit.band(status, opStatusType.STATUS_TYPE_TICKET) == opStatusType.STATUS_TYPE_TICKET ){
	// 		flag = true
	// 	}
		
	// 	if(bit.band(status, opStatusType.STATUS_TYPE_ROBBER_BBOX) == opStatusType.STATUS_TYPE_ROBBER_BBOX ){
	// 		flag = true
	// 	}
		
	// 	return flag == param
	// }

	// function checkActivityIndex(param){
	// 	let curIndex = ActivitySystem.getInstance().getCurActIndex()
	// 	return curIndex == (param || OrdinaryActivityIndex.NULL)
	// }
