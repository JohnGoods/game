class MainTaskWnd extends BaseCtrlWnd {
	taskElem: any;

	public initObj(...params: any[]): void {

	}
	public onLoad(): void {
		this.createFrame()
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_ENTER_GAME, this.onEnterGame, this)
		RegisterEvent(EventDefine.TASK_UPDATELIST, this.refreshFrame, this)

		//this.requestMeiri = false;
		this.mElemList["task_wnd"].visible = true
		this.refreshFrame()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_ENTER_GAME, this.onEnterGame, this)
		UnRegisterEvent(EventDefine.TASK_UPDATELIST, this.refreshFrame, this)

		this.mElemList["task_wnd"].visible = false
	}

	refreshFrame() {
		this.refreshTaskToPannel()
	}

	_taskTraceListener(param, userData) {
		// let bFinish = param.AllFinish || false
		// let tType = TaskSystem.getInstance().getTaskType(param.taskId)
		let str = param.content || ""
		// let title = userData.title
		let rd = userData.rd

        //奖励
		let taskId = param.taskId
		let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
		if (taskInfo) {
			let prizeName = ""
			let prizeCount = 0
			for (let i in taskInfo.prize) {
				let prize = taskInfo.prize[i]
				if (prize[0] == "bindRmb") {
					prizeName = ItemSystem.getInstance().getItemName(SpecailItemId.B_GOLD)
					prizeCount = prize[1]
					break
				}
			}

			str = str + String.format(Localize_cns("TASK_PRIZE"), prizeName, prizeCount)
		}

		AddRdContent(rd, str, "ht_22_cc", "white", 5)
		if (param.link != null && param.link != "") {
			let elem = userData.elem
			elem["link"] = param.link;
		}
	}

	createFrame() {
		this.mElemList = this.mParentWnd.mElemList;

		var elemInfo = [
			{ ["name"]: "task_pic", ["messageFlag"]: true },
			{ ["name"]: "task_rd", ["messageFlag"]: true },
			{ ["name"]: "task_wnd", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickTaskPannel },

		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
	}

	onEnterGame() {

	}

	refreshTaskToPannel() {
		let rd: gui.RichDisplayer = this.mElemList["task_rd"];
		//rd.clear()
		this.taskElem = {}

		let list = TaskSystem.getInstance().getSortTaskIdList()
		if (!list[0]) {
			AddRdContent(rd, Localize_cns("TASK_TXT3"), "ht_20_cc", "lime")
			//TLog.Warn("TaskTraceFrame.refreshFrame the sortTaskList is empty!")
			return
		}
		let elem = table_copy(list[0])
		this.taskElem = elem

		if (elem["taskId"]) {
			let t: any = {}
			t.elem = elem
			//t.title = title
			t.rd = rd;
			let listener = TaskExecutor.getInstance().getTraceListener(this._taskTraceListener, this, t)
			TaskExecutor.getInstance().executeTraceTask(elem["taskId"], listener)
		}
	}

	onClickTaskPannel(event: egret.TouchEvent) {
		if (!this.taskElem || !this.taskElem["link"]) {
			TLog.Warn("TaskTraceFrame.onClickButton the taskElem is null!  %s", type(this.taskElem))
			return
		}

		let link = this.taskElem["link"]
		TaskExecutor.getInstance().executeLink(link)
	}
}