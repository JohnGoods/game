class TaskMessageHandler extends MessageHandler {

	public initObj(...args: any[]): void {

		// this.register(opCodes.G2C_TASK_ACCEPT, this.onRecvG2C_TASK_ACCEPT, this)		//接受任务
		// this.register(opCodes.G2C_TASK_INFO, this.onRecvG2C_TASK_INFO, this)			//更新任务

		// this.register(opCodes.G2C_TASK_SUCCEED, this.onRecvG2C_TASK_SUCCEED, this)	//任务成功
		// this.register(opCodes.G2C_TASK_CANCEL, this.onRecvG2C_TASK_CANCEL, this)		//任务放弃
		// this.register(opCodes.G2C_TASK_FAIL, this.onRecvG2C_TASK_FAIL, this)			//任务失败
		this.register(opCodes.G2C_TASK_FINISH_LIST, this.onRecvG2C_TASK_FINISH_LIST, this) //任务完成列表

		//this.register(opCodes.G2C_TASK_FIGHT_LOST, this.onRecvG2C_TASK_FIGHT_LOST, this) //任务战斗失败
		//this.register(opCodes.G2C_TASK_TEAM_TALK, this.onRecvG2C_TASK_TEAM_TALK, this)	//整队与npc对话
		//this.register(opCodes.G2C_TASK_PET_OPTION, this.onRecvG2C_TASK_PET_OPTION, this)  //服务器返回亲密度任务事件

		//活动类相关任务
		//this.register(opCodes.G2C_FACTION_TASK_REQUEST, this.onRecvG2C_FACTION_TASK_REQUEST, this)  //服务器返回亲密度任务事件

	}

	// onRecvG2C_TASK_ACCEPT(dispatcher, message) {
	// 	let task = Task.newObj(message.taskInfo)
	// 	TaskSystem.getInstance().addTask(task)
	// 	FireEvent(EventDefine.TASK_ACCPET, TaskEvent.newObj(message.taskInfo.taskId))

	// 	//EffectManager.getInstance().createBindOnceEffect( effectIndex.TASK_RECIVE, GetHero())
	// }

	// onRecvG2C_TASK_INFO(dispatcher, message) {
	// 	//){ return }
	// 	let taskList = []
	// 	for (let i = 0; i < message.taskInfoList.length; i++) {
	// 		let v = message.taskInfoList[i]

	// 		let task = Task.newObj(v)
	// 		JsUtil.arrayInstert(taskList, task)
	// 	}
	// 	TaskSystem.getInstance().updateTask(taskList)
	// }

	// onRecvG2C_TASK_SUCCEED(dispatcher, message) {
	// 	TaskSystem.getInstance().updateFinishTaskList(message.taskId)
	// 	TaskSystem.getInstance().removeTask(message.taskId)

	// 	//EffectManager.getInstance().createBindOnceEffect( effectIndex.TASK_FINISH, GetHero())
	// 	CommandManager.getInstance().clear()
	// 	FireEvent(EventDefine.TASK_COMMIT_FINISH, TaskEvent.newObj(message.taskId))
	// }

	// onRecvG2C_TASK_CANCEL(dispatcher, message) {
	// 	FireEvent(EventDefine.TASK_COMMIT_CANCEL, TaskEvent.newObj(message.taskId))
	// 	TaskSystem.getInstance().removeTask(message.taskId)

	// 	let msgString = String.format(Localize_cns("TASK_CANCEL_TIPS"), TaskSystem.getInstance().getTaskName(message.taskId))
	// 	MsgSystem.addChannel(channelType.SYSTEM, msgString)
	// 	MsgSystem.addTagTips(msgString)
	// }

	// onRecvG2C_TASK_FAIL(dispatcher, message) {
	// 	FireEvent(EventDefine.TASK_COMMIT_FAILED, TaskEvent.newObj(message.taskId))
	// 	TaskSystem.getInstance().removeTask(message.taskId)

	// 	let msgString = String.format(Localize_cns("TASK_FAIL_TIPS"), TaskSystem.getInstance().getTaskName(message.taskId))
	// 	MsgSystem.addTagTips(msgString)
	// 	MsgSystem.addChannel(channelType.SYSTEM, msgString)
	// }

	onRecvG2C_TASK_FINISH_LIST(dispatcher, message) {
		let taskSystem = TaskSystem.getInstance()
		for (let _ in message.taskList) {
			let taskId = message.taskList[_]

			taskSystem.updateFinishTaskList(taskId)
		}
	}

	// onRecvG2C_TASK_FIGHT_LOST(dispatcher, message) {
	// 	FireEvent(EventDefine.TASK_FIGHT_END, TaskFightEvent.newObj(message.taskId, message.npcId))
	// }

	// onRecvG2C_TASK_TEAM_TALK(dispatcher, message) {
	// 	//Task_ShowNpcDialogWithNpc(message.npcId, true)
	// }

	// //////////-亲密度任务返回事件类型//////////////

	// onRecvG2C_TASK_PET_OPTION(dispatcher, message) {
	// 	//TLog.Error(message.eventStr)
	// 	//table_TLog.Debug(message.eventData)
	// 	//io.read()
	// }

	// onRecvG2C_FACTION_TASK_REQUEST(dispatcher, message) {
	// 	//FireEvent(EventDefine.LEGION_TASK_REQUEST, LegionTaskEvent.newObj(message.coolDown, message.cancelDiamond))
	// }
}