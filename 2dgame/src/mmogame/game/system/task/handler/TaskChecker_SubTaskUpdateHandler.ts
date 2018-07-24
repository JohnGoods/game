/*
作者:
    yangguiming
	
创建时间：
   2013.7.02(周二)

意图：
   检查子任务需要更新

公共接口：
   
*/

//ImportType(ClientTaskField)

module TaskSubUpdateSpace {


	// function getCountHelper(getType, entryId) {
	// 	let count = 0
	// 	if (getType == "item") {
	// 		//count = ItemSystem.GetItemTotalNum(entryId, storeOptions.PACKET) //现在的收集
	// 		let itemList = ItemSystem.getInstance().getItemLogicInfoListByEntry(entryId, storeOptions.PACKET)
	// 		for (let i in itemList) {
	// 			let v = itemList[i]

	// 			count = count + v.getProperty("count") || 0
	// 		}
	// 	} else if (getType == "pet") {
	// 		count = PetSystem.getInstance().getTaskPetCount(entryId)
	// 	}
	// 	return count
	// }

	// function subTaskUpdateHelper(deal_index, getType, autoUpdate) {
	// 	let bUpdate = false

	// 	let taskList = TaskSystem.getInstance().getTaskList()

	// 	for (let taskId in taskList) {
	// 		let task = taskList[taskId]

	// 		let taskInfo = task.getPropertyInfo()
	// 		if (taskInfo.init[taskField.FIELD_INIT_FINDNPC_GETITEM] && !taskInfo.init[taskField.FIELD_INIT_FINDNPC_GETITEM]["inPacket"]) {
	// 		} else {
	// 			if (taskInfo.finish && taskInfo.finish[deal_index]) { //有收集物品才更新

	// 				let subTaskData = taskInfo.data[deal_index] || {}

	// 				let isFinish = task.isFinish() //更新前,任务是否已经完成了

	// 				let bchanged = false

	// 				for (let entryId in taskInfo.finish[deal_index]) {
	// 					let finishCount = taskInfo.finish[deal_index][entryId]
	// 					//取得需要收集的数量物品
	// 					let dataCount = subTaskData[entryId] || 0
	// 					let curCount = getCountHelper(getType, entryId)//ItemSystem.GetItemTotalNum(itemId, storeOptions.PACKET) //现在的收集

	// 					if (dataCount != curCount) {
	// 						bchanged = true
	// 					}

	// 					if (autoUpdate == true) {
	// 						subTaskData[entryId] = curCount
	// 					}
	// 				}
	// 				taskInfo.data[deal_index] = subTaskData || taskInfo.data[deal_index]
	// 				//task.setPropertyInfo(taskInfo)

	// 				if (bUpdate == false && isFinish == false) {
	// 					bUpdate = bchanged
	// 				}
	// 			}
	// 		}
	// 	}

	// 	return bUpdate
	// }



	// function itemUpdate(index, autoUpdate) {
	// 	return subTaskUpdateHelper(index, "item", autoUpdate)
	// }




	// function petUpdate(index, autoUpdate) {
	// 	return subTaskUpdateHelper(index, "pet", autoUpdate)
	// }

	// function collectItemUpdate(index, autoUpdate) {
	// 	let bUpdate = false

	// 	let taskList = TaskSystem.getInstance().getTaskList()

	// 	for (let taskId in taskList) {
	// 		let task = taskList[taskId]

	// 		let taskInfo = task.getPropertyInfo()
	// 		if (taskInfo.finish && taskInfo.finish[index]) { //有收集物品才更新
	// 			let subTaskData = taskInfo.data[index] || {}

	// 			let isFinish = task.isFinish() //更新前,任务是否已经完成了

	// 			let bchanged = false

	// 			for (let entryId in taskInfo.finish[index]) {
	// 				let finishCount = taskInfo.finish[index][entryId]
	// 				//取得需要收集的数量物品
	// 				let dataCount = subTaskData[entryId] || 0
	// 				let curCount = ItemSystem.getInstance().ItemCount(entryId) //现在的收集

	// 				if (dataCount != curCount) {
	// 					bchanged = true
	// 				}

	// 				if (autoUpdate == true) {
	// 					subTaskData[entryId] = curCount
	// 				}
	// 			}
	// 			taskInfo.data[index] = subTaskData || taskInfo.data[index]

	// 			if (bUpdate == false && isFinish == false) {
	// 				bUpdate = bchanged
	// 			}
	// 		}
	// 	}

	// 	return bUpdate
	// }


	export let SubTaskUpdateHandler: any = {
		// [taskField.FIELD_FINISH_COLLECTPET]: petUpdate,
		// [taskField.FIELD_FINISH_COLLECTITEM]: itemUpdate,
		// [ClientTaskField.FIELD_FINISH_COLLECTITEM]: collectItemUpdate,
	}

}