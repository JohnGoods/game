/*
作者:
    yangguiming
	
创建时间：
   2013.6.28(周五)

意图：
   任务的检查器,，对TaskChecker_XXXXHandler的统一管理

公共接口：
	
	checkOp( op, param,	defaultRet){		//检查操作结果,返回默认defaultRet
	checkOpList( opList, defaultRet){  //检查操作列表{[op]:param,[op]:param}，如果一个结果false，则返回false。如果什么都不处理，返回默认defaultRet
	
  checkFinish( taskId){ 	//检查任务是否完成
  checkFindNpc( taskId, npcEntry){ //检查是否任务寻找的NPC
  checkSubTaskUpdate( deal_index, autoUpdate){		//检查客户端子任务是否需要更新。deal_index是子任务ID，如果是0，表示全部检查。autoUpdate在检查过程中自动更新了。
*/

let TASK_CHECK_ALL_SUBTASK = 0


class TaskChecker extends TClass {

	public initObj(...args: any[]): void {

	}

	destory() {

	}


	checkOp(op, param, defaultRet) {

		return this._checkOp(op, param, defaultRet)
	}

	checkOpList(opList, defaultRet) {

		if (opList == null) {
			return defaultRet
		}

		let ret = defaultRet
		for (let op in opList) {
			let param = opList[op]

			ret = this.checkOp(op, param, defaultRet) //有一个操作不符合，就返回false
			if (!ret) {
				break
			}
		}
		return ret
	}

	checkAcceptCondition(opList, defaultRet) {
		let statusList: any = {}
		if (opList == null) {
			return defaultRet
		}

		let ret = defaultRet
		for (let opstr in opList) {
			let param = opList[opstr]

			ret = this.checkOp(opstr, param, defaultRet)
			let keyInfo = GameConfig.TaskKeyMapping[opstr]
			let op = TaskOpDefine[keyInfo.value]
			statusList[op] = ret
		}

		return statusList
	}

	checkFinish(taskId) {
		let task = TaskSystem.getInstance().getTask(taskId)
		if (task == null) {
			return false
		}

		if (task.isFailed() == true) {
			return false
		}

		let finishTask = true
		let taskInfo = task.getPropertyInfo()

		if (taskInfo.finish) {  //检查完成列表
			for (let deal_index in taskInfo.finish) {
				let v = taskInfo.finish[deal_index]

				finishTask = this._checkSubTaskFinish(task, deal_index)//检查子任务是否完成
				if (!finishTask) {
					break
				} //一个不完成就跳出
			}
		}

		return finishTask //如果木有finish条件，则默认任务完成了
	}

	checkFindNpc(taskId, npcEntry) {
		return this._checkFindNpc(taskId, npcEntry)
	}

	//检查客户端子任务是否需要更新。deal_index是子任务ID，如果是0，表示全部检查。autoUpdate在检查过程中自动更新了。
	checkSubTaskUpdate(deal_index, autoUpdate) {
		return this._checkSubTaskUpdate(deal_index, autoUpdate)
	}

	// getClosestBranchTaskType() {
	// 	let finishTaskList = TaskSystem.getInstance().getFinishTaskList()
	// 	let level = GetHeroProperty("level")
	// 	let npcEntryId = ""

	// 	for (let taskId in TaskSystem.getInstance().getTaskList()) {
	// 		let task = TaskSystem.getInstance().getTaskList()[taskId]

	// 		if (TaskSystem.getInstance().getTaskType(taskId) == taskType.Branch) {
	// 			return false, ""
	// 		}
	// 	}

	// 	for (let _ in GameConfig.TaskAcceptNpcConfig) {
	// 		let v = GameConfig.TaskAcceptNpcConfig[_]

	// 		for (let talkId in v) {
	// 			let value = v[talkId]

	// 			if (value.TaskIdList[TaskMainType.Branch]) {
	// 				let taskList = value.TaskIdList[TaskMainType.Branch]

	// 				for (let secType = 5; secType <= level, 5; secType++) {
	// 					if (taskList[secType]) {
	// 						for (let i = 0; i < taskList[secType].length; i++) {
	// 							let taskId = taskList[secType][i]

	// 							if (!table_isExist(finishTaskList, taskId)) {
	// 								npcEntryId = taskList[secType].npcIds
	// 								break
	// 							}
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}

	// 	if (npcEntryId == "") {
	// 		return [false, npcEntryId]
	// 	} else {
	// 		return [true, npcEntryId]
	// 	}
	// }


	//检查NPC是不是在任务中需要的，如果是，则提示可以接（例如访问NPC等其他任务）
	_checkFindNpc(taskId, npcId) {
		let task = TaskSystem.getInstance().getTask(taskId)
		if (task == null) {
			return false
		}

		let taskInfo = task.getPropertyInfo()
		let shouldFind = false

		for (let deal_index in taskInfo.finish) {
			let _ = taskInfo.finish[deal_index]

			let functionRef: Function = TaskFindNpcSpace.NpcInTaskHandle[deal_index]

			if (functionRef) {
				shouldFind = functionRef.call(this, task, npcId)
				if (shouldFind) { //有一个子任务需要找这个NPC，都会提示可找
					break
				}
			}
		}

		return shouldFind

	}



	_checkSubTaskFinish(task, deal_index) {

		let funcRef: Function = TaskFinishSpace.TaskFinishHandle[deal_index]
		if (funcRef == null) {
			TLog.Error("TaskChecker._checkFinish TaskFinishHandle[%s] ! exsit", tostring(deal_index))
			return true
		}

		let taskInfo = task.getPropertyInfo()


		return funcRef.call(this, task, deal_index)
	}


	_checkSubTaskUpdate(deal_index, autoUpdate) {
		let ret = false
		if (deal_index == 0) {
			for (let index in TaskSubUpdateSpace.SubTaskUpdateHandler) {
				let functionRef: Function = TaskSubUpdateSpace.SubTaskUpdateHandler[index]

				let temptRet = functionRef.call(this, index, autoUpdate)
				if (ret == false) {
					ret = temptRet
				}
			}

		} else {
			let functionRef: Function = TaskSubUpdateSpace.SubTaskUpdateHandler[deal_index]
			if (functionRef == null) {
				TLog.Error("TaskChecker._checkSubTaskUpdate index:%d ! exsit", deal_index)
				return false
			}
			ret = functionRef.call(this, deal_index, autoUpdate)
		}

		return ret
	}



	_checkOp(opStr:string, param, defaultRet) {

		let ratio = 1

		if(opStr.charAt(0) == "-"){
			ratio = -1
			opStr = opStr.substring(1);
		}

		let [flag, op] = TaskSystem.getInstance().getTaskOpFromStr(TaskKeyType.CHECK, opStr)
		if (!flag) {
			return defaultRet
		}

		op = op * ratio

		let functionRef:Function = TaskOpSpace.TaskOpHandler[op]
		if (functionRef == null) { //没定义的，默认true
			return defaultRet
		}
		//return ratio == 1 && functionRef(param) || ! functionRef(param)
		//if(ratio == 1 ){
		return functionRef.call(this, param)
		//}else{
		//return ! functionRef(param)
		//}
	}



}