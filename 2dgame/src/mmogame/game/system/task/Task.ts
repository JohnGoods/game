/*
作者:
    yangguiming
	
创建时间：
   2013.6.24(周一)

意图：
   

公共接口：
   
*/

class Task extends TClass {
	propertyInfo: any;
	refPropertyInfo: any;
	public initObj(...args: any[]): void {
		this.propertyInfo = args[0]

		this.refPropertyInfo = TaskSystem.getInstance().getTaskRef(this.propertyInfo.taskId) //获得引用数据

		if (this.refPropertyInfo == null) {
			TLog.Error("Task.init this.refPropertyInfo == null taskId:%d", this.propertyInfo.taskId)
			return
		}

	}

	destory() {

	}

	//属性
	////////////////////////////////////////////////////////////
	getId() {
		return this.propertyInfo.taskId
	}

	getTime() {
		return this.propertyInfo.time
	}

	setPropertyInfo(info) {
		this.propertyInfo = info
	}

	getPropertyInfo() {
		return this.propertyInfo
	}

	getRefPropertyInfo() {
		return this.refPropertyInfo
	}

	getType() {
		return this.propertyInfo.Type
	}

	//操作
	////////////////////////////////////////////////////////////
	isFailed() {
		let taskInfo = this.propertyInfo

		//服务器标示失败
		if (taskInfo.data && taskInfo.data[taskField.TASK_DATA_FAIL]) {
			return true
		}

		let fail = false

		//如果是计时任务
		if (taskInfo.init && taskInfo.init[taskField.FIELD_INIT_TIME]) {
			//let fail = taskInfo.init[taskField.FIELD_INIT_TIME] - StateSystem.GetServerTime() <= 0  //是否过期了
			fail = !this.isInTime()

			if (fail) { //如果已经过时了
				if (taskInfo.init[taskField.FIELD_INIT_NOT_TIME_OUT]) {//如果过期不算失败
					fail = false
				}

				if (taskInfo.data[taskField.TASK_DATA_FINISH]) {
					fail = false
				}

				if (taskInfo.finish[taskField.FIELD_FINISH_TIME]) {
					fail = false
				}

			}

		}

		return fail

	}


	isFinish() {
		//是否失败了
		if (this.isFailed()) {
			return false
		}

		//是否超时也算完成
		if (this.isOverTimeFinish()) {
			return true
		}
		return TaskChecker.getInstance().checkFinish(this.getId())
	}


	isInTime() {
		let taskInfo = this.propertyInfo

		let initTime = taskInfo.init[taskField.FIELD_INIT_TIME]
		if (initTime) {
			return initTime - GetServerTime() - 1 > 0
		}
		return true
	}

	//超时了也算完成(如灭魔)
	isOverTimeFinish() {
		let taskInfo = this.propertyInfo
		//FIELD_INIT_NOT_TIME_OUT:任务超时不失败
		if (taskInfo.init && taskInfo.init[taskField.FIELD_INIT_TIME] && taskInfo.init[taskField.FIELD_INIT_NOT_TIME_OUT]) {
			let pass = taskInfo.init[taskField.FIELD_INIT_TIME] - GetServerTime() <= 0  //是否过期了
			if (pass) { return true }
		}

		return false
	}
}