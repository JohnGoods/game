/*
作者:
    yangguiming
	
创建时间：
   2013.6.28(周五)

意图：
   检查是否任务所需的NPC

公共接口：
   
*/

//ImportType(ClientTaskField)

module TaskFindNpcSpace {

	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	export let NpcInTaskHandle: any = {}//检查NPC是不是在任务中需要的，如果是，则提示可以接（例如访问NPC等其他任务）

	//ignore表示不检查taskField.FIELD_INIT_NOT_FIND_TIPS协议
	//set_ignore_find_tips( flag){
	//	this.ignore_find_tips = flag
	//}



	// function isNpcInFindLink(taskId, deal_index, targetId, npcId) {
	// 	let info = GameConfig.TaskConfig[taskId].FindLink[deal_index]
	// 	let shouldFind = false
	// 	for (let _ = 0; _ < info.length; _++) {
	// 		let libId = info[_]

	// 		let libInfo = GameConfig.TaskTraceLib[libId]//任务跟踪搜索库，暂时只支持怪物，物品
	// 		if (libInfo) {
	// 			for (let _ = 0; _ < libInfo.Lib.length; _++) {
	// 				let id = libInfo.Lib[_]

	// 				if (id == targetId) {
	// 					let [mapId, _, entryId, cellX, cellY] = StringUtil.stringMatch(libInfo.FindLink, /(\d);(\d);(\d+)\((\d+);(\d+)\)/)
	// 					if (tonumber(entryId) == tonumber(npcId)) {
	// 						shouldFind = true
	// 						break
	// 					}
	// 				}
	// 			}
	// 		}

	// 		if (shouldFind) {     //已经找到一个关联即可跳出循环
	// 			break
	// 		}
	// 	}

	// 	return shouldFind
	// }



	// function findNpc(task, npcId) {
	// 	let taskInfo = task.getPropertyInfo()
	// 	//if(NpcInTaskHandle.ignore_find_tips != true ){
	// 	//	if(taskInfo.init && taskInfo.init[taskField.FIELD_INIT_NOT_FIND_TIPS] ){ //不需显示叹号
	// 	//		return false
	// 	//	}
	// 	//}
	// 	let shouldFind = false

	// 	let flag = taskInfo.finish[taskField.FIELD_FINISH_FINDNPC].isonebyone || false
	// 	if (flag) {
	// 		let count = taskInfo.finish.length[taskField.FIELD_FINISH_FINDNPC]
	// 		let npcIndex = taskInfo.data[taskField.FIELD_FINISH_FINDNPC] && taskInfo.data.length[taskField.FIELD_FINISH_FINDNPC] || 0

	// 		if (table_isExist(taskInfo.finish[taskField.FIELD_FINISH_FINDNPC], npcId)) {
	// 			shouldFind = true
	// 		}
	// 		return shouldFind
	// 	}

	// 	for (let _ in taskInfo.finish[taskField.FIELD_FINISH_FINDNPC]) {
	// 		let shoudNpcId = taskInfo.finish[taskField.FIELD_FINISH_FINDNPC][_]

	// 		if (shoudNpcId == npcId) {
	// 			shouldFind = true
	// 			break
	// 		}
	// 	}

	// 	if (shouldFind) {
	// 		if (taskInfo.data && taskInfo.data[taskField.FIELD_FINISH_FINDNPC]) {
	// 			let count = 0
	// 			for (let _ in taskInfo.data[taskField.FIELD_FINISH_FINDNPC]) {
	// 				let shoudNpcId = taskInfo.data[taskField.FIELD_FINISH_FINDNPC][_]
	// 				//已经找到了，就不再显示
	// 				count = count + 1
	// 				if (shoudNpcId == npcId) {
	// 					shouldFind = false
	// 					break
	// 				}
	// 			}

	// 			if (shouldFind && taskInfo.finish[taskField.FIELD_FINISH_FINDNPC_ONLYONE] && count > 0) { //如果是找到其中一个NPC即可的，就不用再提示了
	// 				shouldFind = false
	// 			}
	// 		}
	// 	}

	// 	return shouldFind
	// }
	// NpcInTaskHandle[taskField.FIELD_FINISH_FINDNPC] = findNpc


	// function findSchoolNpc(task, npcId) {
	// 	let taskInfo = task.getPropertyInfo()
	// 	let shouldFind = false

	// 	let shoudNpcId = taskInfo.finish[taskField.FIELD_FINISH_FINDNPC_SCHOOL][GetHeroProperty("school")]
	// 	if (shoudNpcId == npcId) {
	// 		let alreadyNpcId = taskInfo.data[taskField.FIELD_FINISH_FINDNPC_SCHOOL] //已经找到了，就不提示

	// 		if (!alreadyNpcId || shoudNpcId != alreadyNpcId) {
	// 			shouldFind = true
	// 		}

	// 	}
	// 	return shouldFind
	// }
	// NpcInTaskHandle[taskField.FIELD_FINISH_FINDNPC_SCHOOL] = findSchoolNpc


	// function killNpcMonster(task, npcId) {//明雷NPC
	// 	let taskInfo = task.getPropertyInfo()
	// 	let shouldFind = false
	// 	let finish = taskInfo.finish[taskField.FIELD_FINISH_KILL_NPC_MONSTER]

	// 	shouldFind = (finish[0] == npcId)

	// 	if (taskInfo.data[taskField.FIELD_FINISH_KILL_NPC_MONSTER]) {//如果已经完成任务了
	// 		shouldFind = false
	// 	}

	// 	return shouldFind
	// }
	// NpcInTaskHandle[taskField.FIELD_FINISH_KILL_NPC_MONSTER] = killNpcMonster


	// function fightSchoolNpc(task, npcId) { //挑战门派NPC
	// 	let shouldFind = false
	// 	let taskInfo = task.getPropertyInfo()
	// 	let findId = taskInfo.finish[taskField.FIELD_FINISH_PVE_SCHOOL]

	// 	if (findId == npcId) {
	// 		shouldFind = true
	// 	}
	// 	//已经找到了
	// 	if (taskInfo.data[taskField.FIELD_FINISH_PVE_SCHOOL] && taskInfo.data[taskField.FIELD_FINISH_PVE_SCHOOL] == npcId) {
	// 		shouldFind = false
	// 	}

	// 	return shouldFind
	// }
	// NpcInTaskHandle[taskField.FIELD_FINISH_PVE_SCHOOL] = fightSchoolNpc

	// function fightWin(task, npcId) { //打赢任务&寻找NPC

	// 	let next = function (obj) {
	// 		for (let k in obj) {
	// 			return [k, obj[k]]
	// 		}

	// 		return [null, null]
	// 	}


	// 	let taskInfo = task.getPropertyInfo()
	// 	let shouldFind = false
	// 	if (taskInfo.finish[taskField.FIELD_FINISH_FINDNPC]) {
	// 		let [index, finishNpcId] = next(taskInfo.finish[taskField.FIELD_FINISH_FINDNPC])

	// 		if (npcId != finishNpcId) { return false }

	// 		if (taskInfo.data && taskInfo.data[taskField.FIELD_FINISH_FINDNPC]) {
	// 			let [_, dataNpcId] = next(taskInfo.data[taskField.FIELD_FINISH_FINDNPC])
	// 			//TLog.Debug(dataNpcId,"============")
	// 			if (dataNpcId == finishNpcId) {
	// 				shouldFind = false
	// 			}
	// 		} else {//还没找到
	// 			shouldFind = true
	// 		}

	// 		if (!shouldFind) {
	// 			//let finishTaskId = taskInfo.finish[taskField.FIELD_FINISH_FIGHTWIN]
	// 			let dataTaskId = taskInfo.data[taskField.FIELD_FINISH_FIGHTWIN]

	// 			if (!dataTaskId) {
	// 				shouldFind = true
	// 			}

	// 		}
	// 	}

	// 	let taskId = taskInfo.taskId;

	// 	if (!shouldFind && GameConfig.TaskConfig[taskId]) {
	// 		let linkInfo = GameConfig.TaskConfig[taskId].FindLink
	// 		if (linkInfo && linkInfo[taskField.FIELD_FINISH_FIGHTWIN]) {
	// 			let tipsTable = linkInfo[taskField.FIELD_FINISH_FIGHTWIN]
	// 			if (tipsTable[5]) { //如果有明确Id
	// 				if (tipsTable[5] == npcId) {
	// 					shouldFind = true
	// 				}
	// 			} else {//用名字搜索
	// 				let npcName = GetStringSplitBySchool(tipsTable[4])
	// 				if (ActorManager.getInstance().getNpcNameWithEntryId(npcId) == npcName) {
	// 					shouldFind = true
	// 				}
	// 			}

	// 			if (taskInfo.data[taskField.FIELD_FINISH_FIGHTWIN]) {
	// 				shouldFind = false
	// 			}
	// 		}
	// 	}

	// 	return shouldFind
	// }
	// NpcInTaskHandle[taskField.FIELD_FINISH_FIGHTWIN] = fightWin


	// function collectItemNpc(task, npcId) {
	// 	let taskInfo = task.getPropertyInfo()

	// 	let shouldFind = false
	// 	let taskRef = GameConfig.TaskConfig[taskInfo.taskId]
	// 	if (!taskRef || !taskRef.FindLink || !taskRef.FindLink[taskField.FIELD_FINISH_COLLECTITEM]) {
	// 		return shouldFind
	// 	}

	// 	let finishList = taskInfo.finish[taskField.FIELD_FINISH_COLLECTITEM]
	// 	let dataList = taskInfo.data[taskField.FIELD_FINISH_COLLECTITEM] || {}

	// 	for (let itemId in finishList) {
	// 		let count = finishList[itemId]

	// 		for (let k in dataList) {
	// 			let v = dataList[k]

	// 			if (itemId == k && count > v) {
	// 				if (isNpcInFindLink(taskInfo.taskId, taskField.FIELD_FINISH_COLLECTITEM, itemId, npcId)) {
	// 					shouldFind = true
	// 					break
	// 				}
	// 			}
	// 		}
	// 	}

	// 	return shouldFind
	// }
	// NpcInTaskHandle[taskField.FIELD_FINISH_COLLECTITEM] = collectItemNpc

	// function collectPetNpc(task, npcId) {
	// 	let taskInfo = task.getPropertyInfo()

	// 	let shouldFind = false
	// 	let taskRef = GameConfig.TaskConfig[taskInfo.taskId]
	// 	if (!taskRef || !taskRef.FindLink || !taskRef.FindLink[taskField.FIELD_FINISH_COLLECTPET]) {
	// 		return shouldFind
	// 	}

	// 	let finishList = taskInfo.finish[taskField.FIELD_FINISH_COLLECTPET]
	// 	let dataList = taskInfo.data[taskField.FIELD_FINISH_COLLECTPET] || {}

	// 	for (let petId in finishList) {
	// 		let count = finishList[petId]

	// 		for (let k in dataList) {
	// 			let v = dataList[k]

	// 			if (petId == k && count > v) {
	// 				if (isNpcInFindLink(taskInfo.taskId, taskField.FIELD_FINISH_COLLECTPET, petId, npcId)) {
	// 					shouldFind = true
	// 					break
	// 				}
	// 			}
	// 		}
	// 	}

	// 	return shouldFind
	// }
	// NpcInTaskHandle[taskField.FIELD_FINISH_COLLECTPET] = collectPetNpc


	// function arriveNpcPosition(task, npcId) {
	// 	let taskInfo = task.getPropertyInfo()

	// 	return taskInfo.finish[taskField.FIELD_FINISH_ARRIVE_NPC] == npcId
	// }
	// NpcInTaskHandle[taskField.FIELD_FINISH_ARRIVE_NPC] = arriveNpcPosition

	// function gatherItemNpc(task, npcId) {
	// 	let taskInfo = task.getPropertyInfo()

	// 	return taskInfo.finish[taskField.FIELD_FINISH_FINDNPC_COUNT][0] == npcId
	// }
	// NpcInTaskHandle[taskField.FIELD_FINISH_FINDNPC_COUNT] = gatherItemNpc

	// function fightDynamicNpc(task, npcId) {
	// 	let taskInfo = task.getPropertyInfo()

	// 	return taskInfo.finish[ClientTaskField.FIELD_FINISH_FIGHTDYNAMICNPC][0] == npcId
	// }
	// NpcInTaskHandle[ClientTaskField.FIELD_FINISH_FIGHTDYNAMICNPC] = fightDynamicNpc

	// function killMonster(task, npcId) {
	// 	let taskInfo = task.getPropertyInfo()
	
	// 	return taskInfo.finish[ClientTaskField.FIELD_FINISH_KILL_MONSTER][npcId] != null
	// }
	// NpcInTaskHandle[ClientTaskField.FIELD_FINISH_KILL_MONSTER] = killMonster

	////////////////////////////////////////字符串索引////////////////////////////////////////////////-
	function fightNpc(task, npcId) {
		let taskInfo = task.getPropertyInfo()

		return taskInfo.finish["FIGHTWIN_NPC"][0] == npcId
	}
	NpcInTaskHandle["FIGHTWIN_NPC"] = fightNpc

	function qestionNpc(task, npcId) {
		let taskInfo = task.getPropertyInfo()

		return taskInfo.finish[taskField.FIELD_FINISH_FINDNPC][0] == npcId
	}
	NpcInTaskHandle["FEIXINGQ_QUESTION"] = qestionNpc


}