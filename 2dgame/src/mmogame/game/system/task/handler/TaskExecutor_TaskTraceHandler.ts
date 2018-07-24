/*
作者:
    yangguiming
	
创建时间：
   2013.7.01(周一)

意图：
   任务追踪handler

公共接口：
   
*/
//ImportType(ClientTaskField)

module TaskTraceSpace {
	////任务追踪
	export let TaskTrackHandler: any = {}
	let save_random_link = {}
	//对每个任务的所有某个子任务的跟踪

	//回调结构
	//XML格式不需要link，Tree控件才需要link
	//{
	//[finish]或者[AllFinish]
	//[content]
	//[link]
	//[taskId]
	//}

	function getSaveRandomLink(taskId, default_link) {
		if (save_random_link[taskId]) {
			return save_random_link[taskId]
		}
		save_random_link[taskId] = default_link
		return default_link
	}

	//////////////////////////////////////////////////////////////////////////////-
	//任务跟踪搜索库
	// function getTaskLibLink(taskId, deal_index, targetId) {
	// 	if (!GameConfig.TaskConfig[taskId].FindLink) {
	// 		return ""
	// 	}

	// 	let info = GameConfig.TaskConfig[taskId].FindLink[deal_index]
	// 	if (info) {
	// 		for (let _ = 0; _ < info.length; _++) {
	// 			let libId = info[_]

	// 			let libInfo = GameConfig.TaskTraceLib[libId]//任务跟踪搜索库，暂时只支持怪物，物品
	// 			if (libInfo) {
	// 				for (let _ = 0; _ < libInfo.Lib.length; _++) {
	// 					let id = libInfo.Lib[_]

	// 					if (id == targetId) {
	// 						let isSpecial, link = specialLink(libInfo.FindLink, targetId)

	// 						if (isSpecial) {
	// 							return link
	// 						} else {
	// 							return libInfo.FindLink
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return ""
	// }

	//任务跟踪搜索库（不需要提供targetId或不需要检查Lib的id）
	function getTaskLibLinkEx(taskId, deal_index) {
		if (!GameConfig.TaskConfig[taskId].FindLink) {
			return ["", false]
		}

		let flag = false
		let info = GameConfig.TaskConfig[taskId].FindLink[deal_index]
		if (info) {
			flag = true

			for (let _ = 0; _ < info.length; _++) {
				let libId = info[_]

				let libInfo = GameConfig.TaskTraceLib[libId]
				if (libInfo) {
					return [libInfo.FindLink || "", true]							//第二个参数表示有指定FindLink
				}
			}
		}
		return ["", flag]
	}

	// function specialLink(linkStr, targetId) {

	// 	let type = tonumber(StringUtil.stringMatch(linkStr, /;(%d);/))
	// 	//let type = tonumber(string.match(linkStr, ";(%d);"))
	// 	if (type == TaskLinkType.ITEM_TIPS || type == TaskLinkType.PET_TIPS) {
	// 		return [true, "1;" + type + ";" + targetId]
	// 	}

	// 	return [false]
	// }


	//返回NPC表的寻路信息
	function getConfigNpcLink(npcIds, taskId) {
		//TLog.Debug("111111111111111", type(npcIds), npcIds)
		let link = ""
		let entryId = 0
		if (type(npcIds) == "number") {
			entryId = npcIds
		} else if (type(npcIds) == "string") {
			entryId = tonumber(GetStringSplitBySchool(npcIds))
		}

		//TLog.Debug("getConfigNpcLink   entryId", npcIds, entryId, type(npcIds), GetStringSplitBySchool(npcIds), GetHeroProperty("school"))

		if (entryId && entryId != 0) {
			return TaskExecutor.getInstance().genTalkNpcLink(entryId, taskId)
		}
		return link
	}




	// //str_num_num 模式
	// function str_num_num(taskId, deal_index, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let finishList = taskInfo.finish[deal_index]
	// 	let dataList = taskInfo.data[deal_index] //此时一定是table

	// 	let colItemGive = (deal_index == taskField.FIELD_FINISH_COLLECTITEM && taskInfo.data[taskField.FIELD_FINISH_GIVE_RES])//收集物品，先判断是否已经上交
	// 	let colPetGive = (deal_index == taskField.FIELD_FINISH_COLLECTPET && taskInfo.data[taskField.FIELD_FINISH_GIVE_PET])//收集宠物，先判断是否已经上交
	// 	let flag = false

	// 	for (let finishId in finishList) {
	// 		let finishCount = finishList[finishId]

	// 		let link = getTaskLibLink(taskId, deal_index, finishId)

	// 		let dataCount = 0
	// 		if (dataList && dataList[finishId]) {
	// 			dataCount = dataList[finishId]
	// 		}
	// 		if (dataCount >= finishCount) {
	// 			dataCount = finishCount
	// 			link = ""
	// 		}

	// 		if (colPetGive || colItemGive) { //已经宠物上交了
	// 			dataCount = finishCount
	// 			link = ""
	// 		}

	// 		let id = finishId
	// 		let t: any = {}
	// 		t.finish = (dataCount == finishCount)
	// 		t.taskId = taskId

	// 		let name = "ErrorMONSTER"
	// 		if (deal_index == taskField.FIELD_FINISH_KILLMONSTER || deal_index == taskField.FIELD_FINISH_COLLECTPET) {
	// 			if (GameConfig.PetConfig[id]) {
	// 				name = GameConfig.PetConfig[id].name
	// 			}
	// 		} else if (deal_index == taskField.FIELD_FINISH_COLLECTITEM) {
	// 			name = ItemSystem.getInstance().getItemName(id)
	// 		}

	// 		t.content = String.format(GameConfig.TaskTraceTips[deal_index].XMLContent, name, dataCount, finishCount)//如：nor.length杀死怪物：nl.length|%s|%snor.length(%d/%d)
	// 		t.planetxt = String.format(GameConfig.TaskTraceTips[deal_index].Content, name, dataCount, finishCount)
	// 		t.link = link

	// 		flag = flag || listener.func.call(listener.this_index, t, listener.userData) //回调
	// 	}

	// 	return flag
	// }


	//////////////////////////////////////////////////////////////////////////////-
	//寻找NPC提示
	function getFindNpcInfo(taskId, finishId, isRichDisplayer): [any, string] {
		finishId = tonumber(GetStringSplitBySchool(finishId))

		let name = ActorManager.getInstance().getNpcNameWithEntryId(finishId)
		let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
		let link = getConfigNpcLink(finishId, taskId)
		if (taskInfo.data && taskInfo.data["INIT_FACTION_NPC"]) { //动态NPC
			let initData = taskInfo.data["INIT_FACTION_NPC"][finishId]
			if (initData && initData[6]) {
				name = initData[6]
			}
		}

		let t: any = {}
		t.taskId = taskId
		t.content = ""
		t.planetxt = ""
		// t.content = String.format(GameConfig.TaskTraceTips[taskField.FIELD_FINISH_FINDNPC].XMLContent, name)
		// t.planetxt = String.format(GameConfig.TaskTraceTips[taskField.FIELD_FINISH_FINDNPC].Content, name)
		t.link = link

		return [t, name]

	}




	// //最后完成后的回调信息
	export function finishReCall(taskId, listener, isSpecail?) {
		let taskRef = GameConfig.TaskConfig[taskId]
		let flag = false

		if (taskRef) {
			TLog.Debug("TaskTrackHandler.finishReCall taskId:", taskId)

			let npcInfo = getFindNpcInfo(taskId, taskRef.NpcIds, listener.isRichDisplayer)

			let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
			if (taskInfo.data["COMMIT_NPC"]) {
				let npcEntryId = taskInfo.data["COMMIT_NPC"]
				npcInfo = getFindNpcInfo(taskId, npcEntryId, listener.isRichDisplayer)
			}

			let t = npcInfo[0]
			let name = npcInfo[1]


			let [findLink, personal] = getTaskLibLinkEx(taskId, "finishReCall")
			if (personal) {
				t.link = findLink
			}

			t.content = String.format(taskRef.TraceXMLContent, name)
			t.planetxt = String.format(taskRef.TraceContent, name)
			t.AllFinish = true // 全部完成，不再显示动态信息，只是显示交任务的目标NPC

			if (isSpecail && TaskChecker.getInstance().checkFinish(taskId)) {
				let br = "<br />"
				let index = t.content.lastIndexOf(br)
				if (index != -1) {
					t.content = t.content.substring(0, index);//去掉换行
				}

				let tag = Localize_cns("TASK_FINISH")
				t.content = t.content + tag
			}

			flag = flag || listener.func.call(listener.this_index, t, listener.userData) //回调
		}

		return flag
	}



	// ////////////////////////////////////////////////////////////////////////////////////////
	// //处理handler

	// //杀死怪物 %s (%d,%d)
	// function killMonsterTrace(taskId, listener) {
	// 	str_num_num(taskId, taskField.FIELD_FINISH_KILLMONSTER, listener)
	// }
	// TaskTrackHandler[taskField.FIELD_FINISH_KILLMONSTER] = killMonsterTrace

	// //收集物品 %s (%d,%d)
	// function collectItemTrace(taskId, listener) {
	// 	str_num_num(taskId, taskField.FIELD_FINISH_COLLECTITEM, listener)
	// }
	// TaskTrackHandler[taskField.FIELD_FINISH_COLLECTITEM] = collectItemTrace

	// //收集宠物 %s (%d,%d)
	// function collectPetTrace(taskId, listener) {
	// 	str_num_num(taskId, taskField.FIELD_FINISH_COLLECTPET, listener)

	// }
	// TaskTrackHandler[taskField.FIELD_FINISH_COLLECTPET] = collectPetTrace


	// //寻找NPC
	// function findNpcTrace(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let finishList = taskInfo.finish[taskField.FIELD_FINISH_FINDNPC]
	// 	let dataList
	// 	let notfindway = false
	// 	if (finishList["notfindway"] == true) {
	// 		notfindway = true
	// 	}
	// 	if (taskInfo.data) {
	// 		dataList = taskInfo.data[taskField.FIELD_FINISH_FINDNPC] //此时一定是table
	// 	}

	// 	let flag = finishList.isonebyone || false
	// 	let returnFlag = false
	// 	if (flag) {
	// 		let npcIndex = dataList && dataList.length || 0
	// 		let count = finishList.length

	// 		if (npcIndex >= finishList.length) {
	// 			return finishReCall(taskId, listener)
	// 		} else {
	// 			let [t, name] = getFindNpcInfo(taskId, finishList[npcIndex + 1], listener.isRichDisplayer)
	// 			if (notfindway) {
	// 				t.links = TaskLinkType.ADD_TIPS + ";" + taskId
	// 			}
	// 			t.content = String.format(GameConfig.TaskTraceTips[taskField.FIELD_FINISH_FINDNPC].XMLContent, name)
	// 			t.planetxt = String.format(GameConfig.TaskTraceTips[taskField.FIELD_FINISH_FINDNPC].Content, name)
	// 			t.finish = false
	// 			return listener.func.call(listener.this_index, t, listener.userData)
	// 		}

	// 	}

	// 	let formatString = GameConfig.TaskTraceTips[taskField.FIELD_FINISH_FINDNPC].Content
	// 	if (dataList == null) { //完全没完成
	// 		let flag = false

	// 		for (let _ in finishList) {
	// 			let finishId = finishList[_]

	// 			let t, name = getFindNpcInfo(taskId, finishId, listener.isRichDisplayer)
	// 			if (notfindway) {
	// 				t.links = TaskLinkType.ADD_TIPS + ";" + taskId
	// 			}
	// 			t.content = String.format(GameConfig.TaskTraceTips[taskField.FIELD_FINISH_FINDNPC].XMLContent, name)
	// 			t.planetxt = String.format(GameConfig.TaskTraceTips[taskField.FIELD_FINISH_FINDNPC].Content, name)
	// 			t.finish = false
	// 			flag = flag || listener.func.call(listener.this_index, t, listener.userData) //回调
	// 		}
	// 		return flag
	// 	}

	// 	let unFinishList: any = {}
	// 	flag = false

	// 	for (let _ in finishList) {
	// 		let finishId = finishList[_]
	// 		//已经完成的NPC列表
	// 		for (let __ in dataList) {
	// 			let dataId = dataList[__]

	// 			if (finishId == dataId) {
	// 				unFinishList[finishId] = true
	// 				let [t, name] = getFindNpcInfo(taskId, finishId, listener.isRichDisplayer)
	// 				if (notfindway) {
	// 					t.links = TaskLinkType.ADD_TIPS + ";" + taskId
	// 				}
	// 				t.content = String.format(GameConfig.TaskTraceTips[taskField.FIELD_FINISH_FINDNPC].XMLContent, name)
	// 				t.planetxt = String.format(GameConfig.TaskTraceTips[taskField.FIELD_FINISH_FINDNPC].Content, name)
	// 				t.finish = true
	// 				flag = flag || listener.func.call(listener.this_index, t, listener.userData) //回调
	// 			}
	// 		}
	// 	}

	// 	for (let _ in finishList) {
	// 		let finishId = finishList[_]

	// 		if (unFinishList[finishId] != true) {
	// 			let [t, name] = getFindNpcInfo(taskId, finishId, listener.isRichDisplayer)
	// 			if (notfindway) {
	// 				t.links = TaskLinkType.ADD_TIPS + ";" + taskId
	// 			}
	// 			t.content = String.format(GameConfig.TaskTraceTips[taskField.FIELD_FINISH_FINDNPC].XMLContent, name)
	// 			t.planetxt = String.format(GameConfig.TaskTraceTips[taskField.FIELD_FINISH_FINDNPC].Content, name)
	// 			t.finish = false
	// 			flag = flag || listener.func.call(listener.this_index, t, listener.userData)//回调
	// 		}
	// 	}
	// 	return flag
	// }
	// TaskTrackHandler[taskField.FIELD_FINISH_FINDNPC] = findNpcTrace


	// //////////////////////////////////////////////////////-字符串索引////////////////////////////////////////////////-
	// function fightWinNpc(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()

	// 	let entryId = taskInfo.finish["FIGHTWIN_NPC"][0]
	// 	let [t, name] = getFindNpcInfo(taskId, entryId, listener.isRichDisplayer)
	// 	t.finish = false

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D["FIGHTWIN_NPC"]].XMLContent, name)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D["FIGHTWIN_NPC"]].Content, name)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler["FIGHTWIN_NPC"] = fightWinNpc


	// //对应条件"CAMPAIGN"的处理
	// // function winCampaign(taskId, listener) {
	// // 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// // 	let t: any = {}
	// // 	t.taskId = taskId
	// // 	t.finish = false

	// // 	let campaignId = taskInfo.finish["CAMPAIGN"]
	// // 	let campaignName = "error"
	// // 	if (GameConfig.CampaignConfig[campaignId]) {
	// // 		campaignName = GameConfig.CampaignConfig[campaignId].name
	// // 		campaignName = campaignName != "" && campaignName || GameConfig.CampaignConfig[campaignId].indexName
	// // 	}

	// // 	let conditionStr = ""
	// // 	let campRobberConfig = GameConfig.CampaginRobberConfig[campaignId]
	// // 	if(campRobberConfig && campRobberConfig.robberKillCount > 0){
	// // 		let robberKill = GetHeroProperty("robberKill") || 0
	// // 	 	let color = robberKill < campRobberConfig.robberKillCount ? "#red" : "#lime"

	// // 		if(robberKill > campRobberConfig.robberKillCount)
	// // 			robberKill = campRobberConfig.robberKillCount;

	// //         conditionStr = color + String.format(Localize_cns("CAMPAIGN_TXT102_0"), robberKill, campRobberConfig.robberKillCount)
	// // 	}


	// // 	function func() {
	// // 		if (HeroIsInTeam() == true) {
	// // 			if (HeroIsCaptain() == false) {
	// // 				MsgSystem.addTagTips(Localize_cns("TEAM_TXT32"))
	// // 			} else {
	// // 				let message = GetMessage(opCodes.C2G_FIGHT_ENTER_CAMPAIGN_INFO)
	// // 				SendGameMessage(message)

	// // 				let mapId = MapSystem.getInstance().getMapId()
	// // 				WngMrg.getInstance().getWindow("CopyCardFrame").showCopyCard(mapId, null, campaignId)
	// // 			}
	// // 		} else {
	// // 			let mapId = MapSystem.getInstance().getMapId()
	// // 			WngMrg.getInstance().getWindow("CopyCardFrame").showCopyCard(mapId, null, campaignId)
	// // 		}
	// // 	}
	// // 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)
	// // 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D["CAMPAIGN"]].XMLContent, campaignName) + "#br" + conditionStr
	// // 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D["CAMPAIGN"]].Content, campaignName)
	// // 	t.icon = TaskTraceIcon.CAMPAIGN
	// // 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// // }
	// // TaskTrackHandler["CAMPAIGN"] = winCampaign


	// function fightDynamicNpc(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()

	// 	let entryId = taskInfo.finish[ClientTaskField.FIELD_FINISH_FIGHTDYNAMICNPC][0]
	// 	let [t, name] = getFindNpcInfo(taskId, entryId, listener.isRichDisplayer)
	// 	t.finish = false

	// 	let [findLink, personal] = getTaskLibLinkEx(taskId, ClientTaskField.FIELD_FINISH_FIGHTDYNAMICNPC)
	// 	if (personal) {
	// 		t.link = findLink
	// 	}

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_FIGHTDYNAMICNPC]].XMLContent, name)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_FIGHTDYNAMICNPC]].Content, name)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_FIGHTDYNAMICNPC] = fightDynamicNpc


	// //击杀圣地怪物（封魔任务）
	// function killMonster(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()

	// 	let killMonsterInfo = taskInfo.finish[ClientTaskField.FIELD_FINISH_KILL_MONSTER]
	// 	let content = ""
	// 	let nextEntryId = null
	// 	for (let entryId in killMonsterInfo) {
	// 		let count = killMonsterInfo[entryId]

	// 		let [name, _1, _2, _3] = TaskSystem.getInstance().getDynamicNpcName(taskId, entryId)
	// 		let curCount = 0
	// 		if (taskInfo.data[ClientTaskField.FIELD_FINISH_KILL_MONSTER]) {
	// 			curCount = taskInfo.data[ClientTaskField.FIELD_FINISH_KILL_MONSTER][entryId] || 0
	// 		}

	// 		let txt = String.format("%s(#red%d/%d#rf)", name, curCount, count)
	// 		if (content != "") {
	// 			txt = "," + txt
	// 		}

	// 		content = content + txt
	// 		if (nextEntryId == null && curCount < count) {
	// 			nextEntryId = entryId
	// 		}
	// 	}
	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	t.link = getConfigNpcLink(nextEntryId, taskId)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_KILL_MONSTER]].XMLContent, content)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_KILL_MONSTER]].Content, content)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_KILL_MONSTER] = killMonster



	// //5件装备强化等级>=3
	// function equipEnhance(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_EQUIP_ENHANCE] || {}
	// 	let count = data[0] || 0
	// 	let level = data[1] || 0

	// 	let finish = taskInfo.finish[ClientTaskField.FIELD_FINISH_EQUIP_ENHANCE] || {}
	// 	let needCount = finish[0] || 0
	// 	let needLevel = finish[1] || 0

	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func() {
	// 		ExecuteMainFrameFunction("gongfang")
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_EQUIP_ENHANCE]].XMLContent, needLevel, count, needCount)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_EQUIP_ENHANCE]].Content, needLevel, count, needCount)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_EQUIP_ENHANCE] = equipEnhance

	// //主角等级>=20级
	// function playerLevel(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let needLevel = taskInfo.finish[ClientTaskField.FIELD_FINISH_PLR_LEVEL] || 0
	// 	let level = taskInfo.data[ClientTaskField.FIELD_FINISH_PLR_LEVEL] || GetHeroProperty("level") || 0

	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func() {
	// 		ExecuteMainFrameFunction("shengji")
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_PLR_LEVEL]].XMLContent, level, needLevel)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_PLR_LEVEL]].Content, level, needLevel)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_PLR_LEVEL] = playerLevel

	// //3个伙伴等级>=20级
	// function petLevel(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_PET_LEVEL] || {}
	// 	let count = data[0] || 0
	// 	let level = data[1] || 0

	// 	let finish = taskInfo.finish[ClientTaskField.FIELD_FINISH_PET_LEVEL] || {}
	// 	let needCount = finish[0] || 0
	// 	let needLevel = finish[1] || 0

	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func() {
	// 		ExecuteMainFrameFunction("petshengji")
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_PET_LEVEL]].XMLContent, needLevel, count, needCount)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_PET_LEVEL]].Content, needLevel, count, needCount)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_PET_LEVEL] = petLevel

	// //祭台抽奖>=10次
	// function petLottery(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let needCount = taskInfo.finish[ClientTaskField.FIELD_FINISH_PET_LOTTERY] || 0
	// 	let count = taskInfo.data[ClientTaskField.FIELD_FINISH_PET_LOTTERY] || 0

	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func() {
	// 		ExecuteMainFrameFunction("jitan")
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_PET_LOTTERY]].XMLContent, count, needCount)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_PET_LOTTERY]].Content, count, needCount)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_PET_LOTTERY] = petLottery

	// //所有伙伴+主角穿戴>=10件>=2阶装备
	// function equipOn(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_EQUIP_ON] || {}
	// 	let count = data[0] || 0
	// 	let level = data[1] || 0

	// 	let finish = taskInfo.finish[ClientTaskField.FIELD_FINISH_EQUIP_ON] || {}
	// 	let needCount = finish[0] || 0
	// 	let needLevel = finish[1] || 0

	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func() {
	// 		//ExecuteMainFrameFunction("petshengji")
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_EQUIP_ON]].XMLContent, needLevel, count, needCount)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_EQUIP_ON]].Content, needLevel, count, needCount)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_EQUIP_ON] = equipOn

	// //地宫层数>=20
	// function skyTower(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let needLayer = taskInfo.finish[ClientTaskField.FIELD_FINISH_SKY_TOWER] || 0
	// 	let layer = taskInfo.data[ClientTaskField.FIELD_FINISH_SKY_TOWER] || 0

	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func() {
	// 		ExecuteMainFrameFunction("shilian")
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_SKY_TOWER]].XMLContent, layer, needLayer)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_SKY_TOWER]].Content, layer, needLayer)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_SKY_TOWER] = skyTower

	// //进入竞技场前5000名
	// function championRank(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let needRank = taskInfo.finish[ClientTaskField.FIELD_FINISH_CHAMPION] || 0
	// 	let rank = taskInfo.data[ClientTaskField.FIELD_FINISH_CHAMPION] || 0

	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func() {
	// 		ExecuteMainFrameFunction("jingjichang")
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_CHAMPION]].XMLContent, needRank)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_CHAMPION]].Content, needRank)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_CHAMPION] = championRank

	// //(主角/伙伴)进阶等级>=2
	// function allAwakeLevel(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_AWAKE_LEVEL] || {}
	// 	let count = data[1] || 0
	// 	let level = data[0] || 0

	// 	let finish = taskInfo.finish[ClientTaskField.FIELD_FINISH_AWAKE_LEVEL] || {}
	// 	let needCount = finish[1] || 0
	// 	let needLevel = finish[0] || 0

	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func() {
	// 		//let wnd = WngMrg.getInstance().getWindow("PetFrame")
	// 		//wnd.showTabEntryId(PetFrame.WakeTab, 0)
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_AWAKE_LEVEL]].XMLContent, needCount, needLevel)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_AWAKE_LEVEL]].Content, needCount, needLevel)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_AWAKE_LEVEL] = allAwakeLevel

	// //(主角/伙伴)蜕变等级>=2
	// function allBreakLevel(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_BREAK_LEVEL] || {}
	// 	let entryId = data[0] || 0
	// 	let level = data[1] || 0

	// 	let finish = taskInfo.finish[ClientTaskField.FIELD_FINISH_BREAK_LEVEL] || {}
	// 	let needEntryId = finish[0] || 0
	// 	let needLevel = finish[1] || 0

	// 	let name = Localize_cns("ROLE_TXT9")
	// 	let tabEntry = needEntryId
	// 	if (needEntryId != growOptions.playerOwnerId) {
	// 		let petInfo = PetSystem.getInstance().getPetInfoEntry(needEntryId)
	// 		if (petInfo) {
	// 			name = petInfo.name
	// 		} else {
	// 			name = PetSystem.getInstance().getPetName(needEntryId)
	// 		}
	// 	} else {
	// 		tabEntry = 0
	// 	}
	// 	if (needEntryId != entryId) {
	// 		level = 0
	// 	}

	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func() {
	// 		//let wnd = WngMrg.getInstance().getWindow("PetFrame")
	// 		//wnd.showTabEntryId(PetFrame.BreakTab, tabEntry)
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_BREAK_LEVEL]].XMLContent, name, level, needLevel)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_BREAK_LEVEL]].Content, name, level, needLevel)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_BREAK_LEVEL] = allBreakLevel

	// //守护等级>=3级
	// function wingLevel(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let needLevel = taskInfo.finish[ClientTaskField.FIELD_FINISH_WING_LEVEL] || 0
	// 	let level = taskInfo.data[ClientTaskField.FIELD_FINISH_WING_LEVEL] || 0

	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func() {
	// 		ExecuteMainFrameFunction("shouhu")
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_WING_LEVEL]].XMLContent, level, needLevel)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_WING_LEVEL]].Content, level, needLevel)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_WING_LEVEL] = wingLevel

	// //互动次数
	// // function wudongCount( taskId, listener){
	// // 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// // 	let finishInfo = taskInfo.finish[ClientTaskField.FIELD_FINISH_WUDONG_COUNT] || {}
	// // 	let dataInfo = taskInfo.data[ClientTaskField.FIELD_FINISH_WUDONG_COUNT] || {}

	// // 	let needCount = finishInfo[1] || 0
	// // 	let count = dataInfo[1] || 0

	// // 	let entryId = finishInfo[0]
	// // 	let name = Localize_cns("ROLE_TXT9")
	// // 	if(entryId != growOptions.playerOwnerId ){
	// // 		let petInfo = PetSystem.getInstance().getPetInfoEntry(entryId)
	// // 		if(petInfo ){
	// // 			name = petInfo.name
	// // 		}else{
	// // 			name = PetSystem.getInstance().getPetName(entryId)
	// // 		}
	// // 	}

	// // 	let t:any = {}
	// // 	t.finish = false
	// // 	t.taskId = taskId
	// // 	function func(){
	// // 		let wnd:GrowFrame = WngMrg.getInstance().getWindow("GrowFrame")
	// // 		wnd.showEntryId(entryId)
	// // 	}
	// // 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// // 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_WUDONG_COUNT]].XMLContent, name, count, needCount)
	// // 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_WUDONG_COUNT]].Content, name, count, needCount)
	// // 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// // }
	// // TaskTrackHandler[ClientTaskField.FIELD_FINISH_WUDONG_COUNT] = wudongCount

	// //使用1次圣地技能次数1003
	// // function useRobberSkill( taskId, listener){
	// // 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// // 	let finishInfo = taskInfo.finish[ClientTaskField.FIELD_FINISH_ROBBER_SKILL] || {}
	// // 	let dataInfo = taskInfo.data[ClientTaskField.FIELD_FINISH_ROBBER_SKILL] || {}

	// // 	let skillId = finishInfo[0] || 0
	// // 	let needCount = finishInfo[1] || 0
	// // 	let dSkillId = checkNull(dataInfo[0] , -1)
	// // 	let count = dataInfo[1] || 0

	// // 	if(skillId != dSkillId ){
	// // 		count = 0
	// // 	}

	// // 	let config = GameConfig.RobberSkillConfig[skillId]
	// // 	let skillName = tostring(skillId)
	// // 	if(config ){
	// // 		skillName = config.name
	// // 	}

	// // 	let t:any = {}
	// // 	t.finish = false
	// // 	t.taskId = taskId
	// // 	function func(){
	// // 		let activity = GetActivity(ActivityDefine.Robber)
	// // 		if(! activity.isAutoFight() ){
	// // 			MsgSystem.addTagTips(Localize_cns("ROBBER_TXT41"))
	// // 			return
	// // 		}
	// // 	//	ExecuteMainFrameFunction("yangcheng")
	// // 		//MsgSystem.addTagTips(Localize_cns("ROBBER_TXT158"))
	// // 		let message = GetMessage(opCodes.C2G_ROBBER_USE_SKILL)
	// // 		message.skillId = skillId
	// // 		SendGameMessage(message)
	// // 	}
	// // 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// // 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_ROBBER_SKILL]].XMLContent, skillName, count, needCount)
	// // 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_ROBBER_SKILL]].Content, skillName, count, needCount)
	// // 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// // }
	// // TaskTrackHandler[ClientTaskField.FIELD_FINISH_ROBBER_SKILL] = useRobberSkill

	// //解锁1个2阶职业
	// function unlockVocation(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let finishInfo = taskInfo.finish[ClientTaskField.FIELD_FINISH_UNLOCK_VOCATION] || {}
	// 	let dataInfo = taskInfo.data[ClientTaskField.FIELD_FINISH_UNLOCK_VOCATION] || {}

	// 	let vLevel = finishInfo[0] || 0
	// 	let needCount = finishInfo[1] || 0
	// 	let count = dataInfo[1] || 0

	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func() {
	// 		ExecuteMainFrameFunction("zhiye")
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_UNLOCK_VOCATION]].XMLContent, vLevel, count, needCount)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_UNLOCK_VOCATION]].Content, vLevel, count, needCount)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_UNLOCK_VOCATION] = unlockVocation

	// //领取2次心情奖励
	// function gainFeellingGift(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let finishInfo = taskInfo.finish[ClientTaskField.FIELD_FINISH_FEEL_GIFT] || 0
	// 	let dataInfo = taskInfo.data[ClientTaskField.FIELD_FINISH_FEEL_GIFT] || 0

	// 	let needCount = finishInfo
	// 	let count = dataInfo

	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func() {
	// 		ExecuteMainFrameFunction("yangcheng")
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_FEEL_GIFT]].XMLContent, count, needCount)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_FEEL_GIFT]].Content, count, needCount)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_FEEL_GIFT] = gainFeellingGift

	// //接取任务后占领或掠夺N次
	// function holdReliceMine(taskId, listener) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let finishInfo = taskInfo.finish[ClientTaskField.FIELD_FINISH_RELICE_MINE] || 0
	// 	let dataInfo = taskInfo.data[ClientTaskField.FIELD_FINISH_RELICE_MINE] || 0

	// 	let needCount = finishInfo
	// 	let count = dataInfo

	// 	let t: any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func() {
	// 		ExecuteMainFrameFunction("hanghai")
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_RELICE_MINE]].XMLContent, count, needCount)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_RELICE_MINE]].Content, count, needCount)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_RELICE_MINE] = holdReliceMine


	//圣地杀怪xxx数量1
	// function changeKillMonster( taskId, listener){
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let finishInfo = taskInfo.finish[ClientTaskField.FIELD_FINISH_CHANG_KILL_MONSTER] || {}
	// 	let dataInfo = taskInfo.data[ClientTaskField.FIELD_FINISH_CHANG_KILL_MONSTER] || {}

	// 	let index = finishInfo[0] || 0
	// 	let needCount = finishInfo[1] || 0
	// 	let curIndex = checkNull(dataInfo[0] , -1)
	// 	let count = dataInfo[1] || 0

	// 	let name = tostring(index)
	// 	let npcEntryId = null
	// 	if(GameConfig.RobberMonsterConfig[index] ){
	// 		npcEntryId = GameConfig.RobberMonsterConfig[index].npcEntryId
	// 		let config = GameConfig.npcConfig[npcEntryId]
	// 		if(config ){
	// 			name = config.name
	// 		}
	// 	}
	// 	let t:any = {}
	// 	t.finish = false
	// 	t.taskId = taskId
	// 	function func(){
	// 		let activity = GetActivity(ActivityDefine.Robber)
	// 		if(TeamBaned() ){
	// 			return
	// 		}

	// 		//if(activity.isAutoFight() == true ){
	// 		//	let statusInfo = activity.getHeroHangStatus()
	// 		//	let curIndex = statusInfo.prizeIndex
	// 		//	if(index == curIndex ){
	// 		//		
	// 		//	}else{
	// 		//		MsgSystem.addTagTips(Localize_cns("ROBBER_TXT71"))
	// 		//		return
	// 		//	}
	// 		//}

	// 		if(npcEntryId ){
	// 			activity.stopFightToFindMonster(npcEntryId)
	// 		}
	// 	}
	// 	t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

	// 	t.content = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_CHANG_KILL_MONSTER]].XMLContent, name, count, needCount)
	// 	t.planetxt = String.format(GameConfig.TaskTraceTips[TaskS2D[ClientTaskField.FIELD_FINISH_CHANG_KILL_MONSTER]].Content, name, count, needCount)
	// 	return listener.func.call(listener.this_index, t, listener.userData) //回调
	// }
	// TaskTrackHandler[ClientTaskField.FIELD_FINISH_CHANG_KILL_MONSTER] = changeKillMonster

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function commonTraceHelper(taskId, listener, taskIndex, func){
		let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()

		let curLv = taskInfo.data[taskIndex]
		let needLv = taskInfo.finish[taskIndex]

		let t: any = {}
		t.finish = false
		t.taskId = taskId
		t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

		t.content = String.format(GameConfig.TaskTraceTips[taskIndex].XMLContent, curLv, needLv)
		t.planetxt = String.format(GameConfig.TaskTraceTips[taskIndex].Content, curLv, needLv)
		return listener.func.call(listener.this_index, t, listener.userData) //回调
	}


	//角色技能等级
	function roleSkillLv(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_SKILL_MAX_LV, function func() {
			let wnd = WngMrg.getInstance().getWindow("RoleFrame")
			wnd.showWithIndex(1)
		})
	}
	TaskTrackHandler[taskFinishId.R_SKILL_MAX_LV] = roleSkillLv

	//角色技能次数
	function roleSkillTime(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_SKILL_UP_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("RoleFrame")
			wnd.showWithIndex(1)
		})
	}
	TaskTrackHandler[taskFinishId.R_SKILL_UP_NUM] = roleSkillTime

	//穿戴装备数量
	function wearEquipCount(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQUIP_MAX_NUM, function func() {
			ExecuteMainFrameFunction("jiaose")
		})
	}
	TaskTrackHandler[taskFinishId.R_EQUIP_MAX_NUM] = wearEquipCount

	//穿戴装备次数
	function wearEquipTime(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQUIP_CHANGE_NUM, function func() {
			ExecuteMainFrameFunction("jiaose")
		})
	}
	TaskTrackHandler[taskFinishId.R_EQUIP_CHANGE_NUM] = wearEquipTime

	//装备强化最高达到等级
	function roleEquipQHMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQ_QH_MAX_LEVEL, function func() {
			ExecuteMainFrameFunction("duanzao")
		})
	}
	TaskTrackHandler[taskFinishId.R_EQ_QH_MAX_LEVEL] = roleEquipQHMax

	//装备强化最低达到等级
	function roleEquipQHMin(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQ_QH_MIN_LEVEL, function func() {
			ExecuteMainFrameFunction("duanzao")
		})
	}
	TaskTrackHandler[taskFinishId.R_EQ_QH_MIN_LEVEL] = roleEquipQHMin

	//装备强化次数
	function roleEquipQHTime(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQ_QH_NUM, function func() {
			ExecuteMainFrameFunction("duanzao")
		})
	}
	TaskTrackHandler[taskFinishId.R_EQ_QH_NUM] = roleEquipQHTime

	//精炼最高等级
	function roleEquipJLMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQ_JL_MAX_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("ForgeFrame");
			wnd.showWithIndex(1);
		})
	}
	TaskTrackHandler[taskFinishId.R_EQ_JL_MAX_LEVEL] = roleEquipJLMax

	//精炼最低等级
	function roleEquipJLMin(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQ_JL_MIN_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("ForgeFrame");
			wnd.showWithIndex(1);
		})
	}
	TaskTrackHandler[taskFinishId.R_EQ_JL_MIN_LEVEL] = roleEquipJLMin

	//装备精练次数
	function roleEquipJLTime(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQ_JL_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("ForgeFrame");
			wnd.showWithIndex(1);
		})
	}
	TaskTrackHandler[taskFinishId.R_EQ_JL_NUM] = roleEquipJLTime

	//装备锻炼最高达到等级
	function roleEquipDLMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQ_DL_MAX_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("ForgeFrame");
			wnd.showWithIndex(2);
		})
	}
	TaskTrackHandler[taskFinishId.R_EQ_DL_MAX_LEVEL] = roleEquipDLMax

	//装备锻炼最低达到等级
	function roleEquipDLMin(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQ_DL_MIN_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("ForgeFrame");
			wnd.showWithIndex(2);
		})
	}
	TaskTrackHandler[taskFinishId.R_EQ_DL_MIN_LEVEL] = roleEquipDLMin

	//装备锻炼次数
	function roleEquipDLTime(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQ_DL_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("ForgeFrame");
			wnd.showWithIndex(2);
		})
	}
	TaskTrackHandler[taskFinishId.R_EQ_DL_NUM] = roleEquipDLTime

	//装备宝石最高达到等级
	function roleEquipBSMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQ_BS_MAX_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("ForgeFrame");
			wnd.showWithIndex(3);
		})
	}
	TaskTrackHandler[taskFinishId.R_EQ_BS_MAX_LEVEL] = roleEquipBSMax

	//装备宝石最低达到等级
	function roleEquipBSMin(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQ_BS_MIN_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("ForgeFrame");
			wnd.showWithIndex(3);
		})
	}
	TaskTrackHandler[taskFinishId.R_EQ_BS_MIN_LEVEL] = roleEquipBSMin

	//装备宝石次数
	function roleEquipBSTime(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQ_BS_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("ForgeFrame");
			wnd.showWithIndex(3);
		})
	}
	TaskTrackHandler[taskFinishId.R_EQ_BS_NUM] = roleEquipBSTime

	//装备熔炼次数
	function roleEquipSmelte(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.R_EQ_MELT_NUM, function func() {
			ExecuteMainFrameFunction("ronglian")
		})
	}
	TaskTrackHandler[taskFinishId.R_EQ_MELT_NUM] = roleEquipSmelte

	//世界聊天多少次
	function roleWorldTalk(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.ROLE_WORLD_TALK_NUM, function func() {
			//WngMrg.getInstance().showWindow("ChatInChannelFrame")
		})
	}
	TaskTrackHandler[taskFinishId.ROLE_WORLD_TALK_NUM] = roleWorldTalk

	//BOSS关卡
	function campaignBoss(taskId, listener) {
		let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
		let campaignId = taskInfo.finish[taskFinishId.CAMPAIGN_ID] || 0
		let campaignName = CampaignSystem.getInstance().getCampaignName(campaignId)

		let t: any = {}
		t.finish = false
		t.taskId = taskId
		function func() {
			ExecuteMainFrameFunction("guanka")
		}
		t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

		t.content = String.format(GameConfig.TaskTraceTips[taskFinishId.CAMPAIGN_ID].XMLContent, campaignName)
		t.planetxt = String.format(GameConfig.TaskTraceTips[taskFinishId.CAMPAIGN_ID].Content, campaignName)
		return listener.func.call(listener.this_index, t, listener.userData) //回调
	}
	TaskTrackHandler[taskFinishId.CAMPAIGN_ID] = campaignBoss

	//通过关卡数量
	function campaignTime(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.CAMPAIGN_NUM, function func() {
			ExecuteMainFrameFunction("guanka")
		})
	}
	TaskTrackHandler[taskFinishId.CAMPAIGN_NUM] = campaignTime

	//关卡boss自动战斗
	function campaignBossAuto(taskId, listener) {
		let t: any = {}
		t.finish = false
		t.taskId = taskId
		function func() {
			
		}
		t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

		t.content = String.format(GameConfig.TaskTraceTips[taskFinishId.CAMPAIGN_SET_AUTO].XMLContent)
		t.planetxt = String.format(GameConfig.TaskTraceTips[taskFinishId.CAMPAIGN_SET_AUTO].Content)
		return listener.func.call(listener.this_index, t, listener.userData) //回调
	}
	TaskTrackHandler[taskFinishId.CAMPAIGN_SET_AUTO] = campaignBossAuto

	//进入地图
	function enterMap(taskId, listener) {
		let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()

		let mapId = taskInfo.finish[taskFinishId.ENTRY_MAP]
		let mapName = MapSystem.getInstance().getMapName(mapId)

		let t: any = {}
		t.finish = false
		t.taskId = taskId
		function func() {
			ExecuteMainFrameFunction("ditu")
		}
		t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

		t.content = String.format(GameConfig.TaskTraceTips[taskFinishId.ENTRY_MAP].XMLContent, mapName)
		t.planetxt = String.format(GameConfig.TaskTraceTips[taskFinishId.ENTRY_MAP].Content, mapName)
		return listener.func.call(listener.this_index, t, listener.userData) //回调
	}
	TaskTrackHandler[taskFinishId.ENTRY_MAP] = enterMap

	//收集多少个宠物
	function collectPet(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.PET_COUNT, function func() {
			ExecuteMainFrameFunction("chongwu")
		})
	}
	TaskTrackHandler[taskFinishId.PET_COUNT] = collectPet

	//宠物升级次数
	function upgradePet(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.PET_STAGE_STEP_NUM, function func() {
			ExecuteMainFrameFunction("chongwu")
		})
	}
	TaskTrackHandler[taskFinishId.PET_STAGE_STEP_NUM] = upgradePet

	//宠物最高多少阶
	function petUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.PET_STAGE_MAX_LV, function func() {
			ExecuteMainFrameFunction("chongwu")
		})
	}
	TaskTrackHandler[taskFinishId.PET_STAGE_MAX_LV] = petUpgradeMax

	//收集多少个仙侣
	function collectXianNv(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.XL_COUNT, function func() {
			ExecuteMainFrameFunction("xianlv")
		})
	}
	TaskTrackHandler[taskFinishId.XL_COUNT] = collectXianNv

	//仙侣升级次数
	function upgradeXianNv(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.XL_STAGE_STEP_NUM, function func() {
			ExecuteMainFrameFunction("xianlv")
		})
	}
	TaskTrackHandler[taskFinishId.XL_STAGE_STEP_NUM] = upgradeXianNv

	//仙侣最高多少阶
	function xianNvUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.XL_STAGE_MAX_LV, function func() {
			ExecuteMainFrameFunction("xianlv")
		})
	}
	TaskTrackHandler[taskFinishId.XL_STAGE_MAX_LV] = xianNvUpgradeMax

	//角色坐骑升阶
	function rideUpgrade(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.RIDE_STAGE_STEP_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("RoleFrame");
			wnd.showWithIndex(2);
		})
	}
	TaskTrackHandler[taskFinishId.RIDE_STAGE_STEP_NUM] = rideUpgrade

	//角色坐骑最高多少阶
	function rideUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.RIDE_STAGE_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("RoleFrame");
			wnd.showWithIndex(2);
		})
	}
	TaskTrackHandler[taskFinishId.RIDE_STAGE_LEVEL] = rideUpgradeMax

	//角色翅膀升阶
	function wingUpgrade(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.WING_STAGE_STEP_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("RoleFrame");
			wnd.showWithIndex(3);
		})
	}
	TaskTrackHandler[taskFinishId.WING_STAGE_STEP_NUM] = wingUpgrade

	//角色翅膀最高多少阶
	function wingUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.WING_STAGE_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("RoleFrame");
			wnd.showWithIndex(3);
		})
	}
	TaskTrackHandler[taskFinishId.WING_STAGE_LEVEL] = wingUpgradeMax

	//宠物通灵升阶
	function tongLinUpgrade(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TONGLIN_STAGE_STEP_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("PetFrame");
			wnd.showWithIndex(2);
		})
	}
	TaskTrackHandler[taskFinishId.TONGLIN_STAGE_STEP_NUM] = tongLinUpgrade

	//宠物通灵最高多少阶
	function tongLinUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TONGLIN_STAGE_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("PetFrame");
			wnd.showWithIndex(2);
		})
	}
	TaskTrackHandler[taskFinishId.TONGLIN_STAGE_LEVEL] = tongLinUpgradeMax

	//宠物兽魂升阶
	function shouHunUpgrade(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.SOUHUN_STAGE_STEP_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("PetFrame");
			wnd.showWithIndex(3);
		})
	}
	TaskTrackHandler[taskFinishId.SOUHUN_STAGE_STEP_NUM] = shouHunUpgrade

	//宠物兽魂最高多少阶
	function shouHunUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.SOUHUN_STAGE_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("PetFrame");
			wnd.showWithIndex(3);
		})
	}
	TaskTrackHandler[taskFinishId.SOUHUN_STAGE_LEVEL] = shouHunUpgradeMax

	//仙侣法阵升阶
	function faZhenUpgrade(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.FAZHEN_STAGE_STEP_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("XianLvFrame");
			wnd.showWithIndex(2)
		})
	}
	TaskTrackHandler[taskFinishId.FAZHEN_STAGE_STEP_NUM] = faZhenUpgrade

	//仙侣法阵最高多少阶
	function faZhenUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.FAZHEN_STAGE_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("XianLvFrame");
			wnd.showWithIndex(2)
		})
	}
	TaskTrackHandler[taskFinishId.FAZHEN_STAGE_LEVEL] = faZhenUpgradeMax

	//仙侣仙位升阶
	function xianWeiUpgrade(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.XIANWEI_STAGE_STEP_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("XianLvFrame");
			wnd.showWithIndex(3)
		})
	}
	TaskTrackHandler[taskFinishId.XIANWEI_STAGE_STEP_NUM] = xianWeiUpgrade

	//仙侣仙位最高多少阶
	function xianWeiUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.XIANWEI_STAGE_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("XianLvFrame");
			wnd.showWithIndex(3)
		})
	}
	TaskTrackHandler[taskFinishId.XIANWEI_STAGE_LEVEL] = xianWeiUpgradeMax

	//天仙升阶
	function tianXianUpgrade(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TX_STAGE_STEP_NUM, function func() {
			ExecuteMainFrameFunction("tianxian")
		})
	}
	TaskTrackHandler[taskFinishId.TX_STAGE_STEP_NUM] = tianXianUpgrade

	//天仙最高多少阶
	function tianXianUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TX_STAGE_LEVEL, function func() {
			ExecuteMainFrameFunction("tianxian")
		})
	}
	TaskTrackHandler[taskFinishId.TX_STAGE_LEVEL] = tianXianUpgradeMax

	//天仙武器升阶
	function txWeaponUpgrade(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TXWEAPON_STAGE_STEP_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("TianXianFrame");
			wnd.showWithIndex(1);
		})
	}
	TaskTrackHandler[taskFinishId.TXWEAPON_STAGE_STEP_NUM] = txWeaponUpgrade

	//天仙武器最高多少阶
	function txWeaponUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TXWEAPON_STAGE_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("TianXianFrame");
			wnd.showWithIndex(1);
		})
	}
	TaskTrackHandler[taskFinishId.TXWEAPON_STAGE_LEVEL] = txWeaponUpgradeMax

	//天女升阶
	function tianNvUpgrade(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TN_STAGE_STEP_NUM, function func() {
			ExecuteMainFrameFunction("tiannv")
		})
	}
	TaskTrackHandler[taskFinishId.TN_STAGE_STEP_NUM] = tianNvUpgrade

	//天女最高多少阶
	function tianNvUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TN_STAGE_LEVEL, function func() {
			ExecuteMainFrameFunction("tiannv")
		})
	}
	TaskTrackHandler[taskFinishId.TN_STAGE_LEVEL] = tianNvUpgradeMax

	//天女仙器升阶
	function xianQiUpgrade(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TNXIANQI_STAGE_STEP_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("TianNvFrame")
			wnd.showWithIndex(1)
		})
	}
	TaskTrackHandler[taskFinishId.TNXIANQI_STAGE_STEP_NUM] = xianQiUpgrade

	//天女仙器最高多少阶
	function xianQiUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TNXIANQI_STAGE_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("TianNvFrame")
			wnd.showWithIndex(1)
		})
	}
	TaskTrackHandler[taskFinishId.TNXIANQI_STAGE_LEVEL] = xianQiUpgradeMax

	//天女花辇升阶
	function huaNianUpgrade(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TNHUANIAN_STAGE_STEP_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("TianNvFrame")
			wnd.showWithIndex(2)
		})
	}
	TaskTrackHandler[taskFinishId.TNHUANIAN_STAGE_STEP_NUM] = huaNianUpgrade

	//天女花辇最高多少阶
	function huaNianUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TNHUANIAN_STAGE_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("TianNvFrame")
			wnd.showWithIndex(2)
		})
	}
	TaskTrackHandler[taskFinishId.TNHUANIAN_STAGE_LEVEL] = huaNianUpgradeMax

	//天女灵气升阶
	function lingQiUpgrade(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TNLINGQI_STAGE_STEP_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("TianNvFrame")
			wnd.showWithIndex(3)
		})
	}
	TaskTrackHandler[taskFinishId.TNLINGQI_STAGE_STEP_NUM] = lingQiUpgrade

	//天女灵气最高多少阶
	function lingQiUpgradeMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.TNLINGQI_STAGE_LEVEL, function func() {
			let wnd = WngMrg.getInstance().getWindow("TianNvFrame")
			wnd.showWithIndex(3)
		})
	}
	TaskTrackHandler[taskFinishId.TNLINGQI_STAGE_LEVEL] = lingQiUpgradeMax

	//角色等级到达多少级
	function roleUpgradeLv(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.ROLE_MAX_LEVEL, function func() {
			ExecuteMainFrameFunction("jiaose")
		})
	}
	TaskTrackHandler[taskFinishId.ROLE_MAX_LEVEL] = roleUpgradeLv

	//角色等级到达多少级
	function roleUpgradeTime(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.ROLE_LEVEl_NUM, function func() {
			ExecuteMainFrameFunction("jiaose")
		})
	}
	TaskTrackHandler[taskFinishId.ROLE_LEVEl_NUM] = roleUpgradeTime

	//个人boss累积次数
	function copyPersonTime(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.COPY_PERSON_COUNT, function func() {
			ExecuteMainFrameFunction("gerenboss")
		})
	}
	TaskTrackHandler[taskFinishId.COPY_PERSON_COUNT] = copyPersonTime

	//个人boss打多少次　接到任务后统计数量
	function copyPersonNum(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.COPY_PERSON_NUM, function func() {
			ExecuteMainFrameFunction("gerenboss")
		})
	}
	TaskTrackHandler[taskFinishId.COPY_PERSON_NUM] = copyPersonNum

	//龙王宝藏完成指定关卡
	function copyDragonLevel(taskId, listener) {
		let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()

		let passId = taskInfo.finish[taskFinishId.COPY_DRAGON_LEVEL]
		let passName = GameConfig.CopyDragonConfig[passId].campaign

		let t: any = {}
		t.finish = false
		t.taskId = taskId
		function func() {
			let wnd = WngMrg.getInstance().getWindow("CopyMainFrame")
		    wnd.showBossFrame(1)
		}
		t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

		t.content = String.format(GameConfig.TaskTraceTips[taskFinishId.COPY_DRAGON_LEVEL].XMLContent, passName)
		t.planetxt = String.format(GameConfig.TaskTraceTips[taskFinishId.COPY_DRAGON_LEVEL].Content, passName)
		return listener.func.call(listener.this_index, t, listener.userData) //回调
	}
	TaskTrackHandler[taskFinishId.COPY_DRAGON_LEVEL] = copyDragonLevel

	//龙王宝藏最高关卡
	function copyDragonMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.COPY_DRAGON_MAX, function func() {
			let wnd = WngMrg.getInstance().getWindow("CopyMainFrame")
		     wnd.showBossFrame(1)
		})
	}
	TaskTrackHandler[taskFinishId.COPY_DRAGON_MAX] = copyDragonMax

	//龙王宝藏打多少次　接到任务后统计数量
	function copyDragonNum(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.COPY_DRAGON_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("CopyMainFrame")
		     wnd.showBossFrame(1)
		})
	}
	TaskTrackHandler[taskFinishId.COPY_DRAGON_NUM] = copyDragonNum

	//龙王宝藏累星奖励领取多少次　接到任务后统计数量
	function copyDragonStarNum(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.COPY_DRAGON_START_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("CopyMainFrame")
		     wnd.showBossFrame(1)
		})
	}
	TaskTrackHandler[taskFinishId.COPY_DRAGON_START_NUM] = copyDragonStarNum
	
	//龙王宝藏累星奖励领取多少次　接到任务后统计数量
	function copyDragonStarPrize(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.COPY_DRAGON_START_PRIZE, function func() {
			let wnd = WngMrg.getInstance().getWindow("CopyMainFrame")
		     wnd.showBossFrame(1)
		})
	}
	TaskTrackHandler[taskFinishId.COPY_DRAGON_START_PRIZE] = copyDragonStarPrize

	//材料副本，完成指定副本索引
	function copyMaterialCount(taskId, listener) {
		let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()

		let fubenId = taskInfo.finish[taskFinishId.COPY_MATERIAL_COUNT]
		let fubenName = GameConfig.CopyMaterialConfig[fubenId].title

		let t: any = {}
		t.finish = false
		t.taskId = taskId
		function func() {
			ExecuteMainFrameFunction("fuben")
		}
		t.link = TaskExecutor.getInstance().getInteriorHandler(taskId, func)

		t.content = String.format(GameConfig.TaskTraceTips[taskFinishId.COPY_MATERIAL_COUNT].XMLContent, fubenName)
		t.planetxt = String.format(GameConfig.TaskTraceTips[taskFinishId.COPY_MATERIAL_COUNT].Content, fubenName)
		return listener.func.call(listener.this_index, t, listener.userData) //回调
	}
	TaskTrackHandler[taskFinishId.COPY_MATERIAL_COUNT] = copyMaterialCount

	//材料副本打多少次　接到任务后统计数量
	function copyMaterialNum(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.COPY_MATERIAL_NUM, function func() {
			ExecuteMainFrameFunction("fuben")
		})
	}
	TaskTrackHandler[taskFinishId.COPY_MATERIAL_NUM] = copyMaterialNum

	//钟馗伏魔今日战斗次数
	function copyZhongKuiCount(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.COPY_ZHONGKUI_COUNT, function func() {
			ExecuteMainFrameFunction("richang")
		})
	}
	TaskTrackHandler[taskFinishId.COPY_ZHONGKUI_COUNT] = copyZhongKuiCount

	//钟馗伏魔打多少次　接到任务后统计数量
	function copyZhongKuiNum(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.COPY_ZHONGKUI_NUM, function func() {
			ExecuteMainFrameFunction("richang")
		})
	}
	TaskTrackHandler[taskFinishId.COPY_ZHONGKUI_NUM] = copyZhongKuiNum
	
	//小雷音寺最高通关层数
	function copyThunderMax(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.COPY_THUNDER_MAX, function func() {
			let wnd = WngMrg.getInstance().getWindow("CopyMainFrame")
		     wnd.showBossFrame(2)
		})
	}
	TaskTrackHandler[taskFinishId.COPY_THUNDER_MAX] = copyThunderMax

	//小雷音寺打多少次　接到任务后统计数量
	function copyThunderNum(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.COPY_THUNDER_NUM, function func() {
			let wnd = WngMrg.getInstance().getWindow("CopyMainFrame")
		     wnd.showBossFrame(2)
		})
	}
	TaskTrackHandler[taskFinishId.COPY_THUNDER_NUM] = copyThunderNum

	//跨服组队，完成条件：组队进入副本次数达到指定次数完成条件
	function crossDressNum(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.COPY_TEAM_COMBAT_NUM, function func() {
			ExecuteMainFrameFunction("global")
		})
	}
	TaskTrackHandler[taskFinishId.COPY_TEAM_COMBAT_NUM] = crossDressNum

	//竞技场擂台比武，完成条件：当天累计比武次数达到指定次数完成任务
	function championNum(taskId, listener) {
		return commonTraceHelper(taskId, listener, taskFinishId.CHAMPION_NUM, function func() {
			ExecuteMainFrameFunction("jingjichang")
		})
	}
	TaskTrackHandler[taskFinishId.CHAMPION_NUM] = championNum
}