


function PushUIShow(exceptPushList?: string[], exceptHideList?: string[]) {
	WngMrg.getInstance().pushShowStatck(exceptPushList, exceptHideList)
}


function PopUIShow(exceptHideList?: string[], bHideCurUI?:boolean) {
	WngMrg.getInstance().popShowStatck(exceptHideList, bHideCurUI)
}


class WngMrg extends TClass {
	windows: any;
	bShowStateWindow: boolean;
	stackList: any;
	//refreshDotTipsTimer: any;

	initObj(...params: any[]) {
		this.bShowStateWindow = true;
		this.windows = {}

		this.stackList = null;

		//this.refreshDotTipsTimer = null
	}

	protected destory() {

	}

	public start(): void {
		RegisterEvent(EventDefine.PRECEDURE_ACTIVE, this.onPrecedureActive, this);
		RegisterEvent(EventDefine.PRECEDURE_DEACTIVE, this.onPrecedureDeactive, this);
		//RegisterEvent(EventDefine.HERO_ENTER_GAME, this.onHeroEnterGame, this)
		// RegisterEvent(EventDefine.UI_SHOW, this.onUIShowEvent, this)
		// RegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)

		for (var state in WndsMap) {
			var infoList = WndsMap[state];
			for (var name in infoList) {
				var info = infoList[name];
				if (info.init == true) {
					this.getWindow(name);// -- 自动创建
				}
			}
		}

	}

	public stop(): void {
		UnRegisterEvent(EventDefine.PRECEDURE_ACTIVE, this.onPrecedureActive, this)
		UnRegisterEvent(EventDefine.PRECEDURE_DEACTIVE, this.onPrecedureDeactive, this)
		//UnRegisterEvent(EventDefine.HERO_ENTER_GAME, this.onHeroEnterGame, this)
		// UnRegisterEvent(EventDefine.UI_SHOW, this.onUIShowEvent, this)
		//UnRegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)
	}


	public onClear() {
		this.stackList = null;
		// if (this.refreshDotTipsTimer) {
		// 	KillTimer(this.refreshDotTipsTimer)
		// 	this.refreshDotTipsTimer = null
		// }
	}


	//显示窗口
	public showWindow(name: string, parentName?: string) {
		var wnd = this.getWindow(name);
		var parentWnd = null;
		if (parentName) {
			parentWnd = this.getWindow(parentName)
		}

		if (wnd == null) {
			TLog.Error("WngMrg.showWindow %s", name)
			return
		}

		wnd.showWnd(parentWnd);
	}

	//隐藏窗口
	public hideWindow(name: string): void {
		var wnd = this.getWindow(name)
		if (wnd == null) {
			TLog.Error("WngMrg.hideWindow %s", name)
			return
		}
		wnd.hideWnd()
	}

	public isVisible(name: string): boolean {
		var wnd = this.windows[name];
		if (wnd == null)
			return false;

		return wnd.isVisible()
	}


	public getWindow(name): BaseWnd {
		var wnd = this.windows[name];
		if (wnd == null) {
			wnd = this.createWindow(name)
			if (wnd != null) {
				this.windows[name] = wnd
			}
		}

		return wnd
	}


	public findWndMapInfo(name: string) {
		var info = null;

		var commonList = WndsMap["Common"]
		var info = commonList[name]
		if (info) {
			return info;
		}


		JsUtil.objectForEach(WndsMap, function (v, k): boolean {
			info = v[name];
			if (info) {
				return true;//终止循环
			}
			return false;
		});

		return info
	}


	public createWindow(name: string): BaseWnd {
		var info = this.findWndMapInfo(name);
		if (!info) {
			TLog.Error("WngMrg.getWindow %s info not exsit", name);
			return null;
		}

		var wnd = null;
		var defineClass = info.clazz
		if (defineClass == null) {
			TLog.Error("WngMrg.getWindow _G[%s] not exsit", name);
		} else {
			//wnd = new defineClass(info);
			TLog.Assert(defineClass.newObj != null); //必须继承TClass
			wnd = defineClass.newObj(info);
		}

		return wnd;
	}

	public onPrecedureActive(event: PrecedureEvent) {

		this.showStateWindows(event.state)
	}

	public onPrecedureDeactive(event: PrecedureEvent) {
		this.hideStateWindows(event.state)
	}


	onUIShowEvent(args) {
		let wndName = args.window.classname
		// let info = WndsOpenRelationMap[wndName]
		// if(info && info.show ){	
		// 	//关闭互斥模块
		// 	if(info.show.Mutex ){
		// 		for(let _ = 0; _ < info.show.Mutex.length; _++){
		// 		let name = info.show.Mutex[_]

		// 			if(name != "" && this.isVisible(name) ){
		// 				this.hideWindow(name)
		// 			}
		// 		}
		// 	}
		// 	//打开关联模块
		// 	if(info.show.Relation ){
		// 		for(let _ = 0; _ < info.show.Relation.length; _++){
		// 		let name = info.show.Relation[_]

		// 			if(name != "" && ! this.isVisible(name) ){
		// 				this.showWindow(name)
		// 			}
		// 		}
		// }		
		// }

		//跨服内不让显示界面
		if (IsInGlobalActvity() != null && table_isExist(GlobalForbidMap["show"], wndName)) {
			args.window.hideWnd()
			return
		}

		// if(table_isExist(WndsForbitFindWayMap, wndName) ){
		// 	GetHero().moveStop()
		// 	Command_Move(GetHero().getCellXY())
		// }
	}

	setShowStateWindow(show) {
		this.bShowStateWindow = show
	}


	//显示游戏状态的所有窗口
	public showStateWindows(state) {
		if (this.bShowStateWindow == false) {
			return
		}

		//TLog.Debug("WngMrg.showStateWindows %d", state)
		var subMap = WndsMap[state]
		if (!subMap) {
			//TLog.Error("WngMrg.showStateWindows no ui exsit with state:%d", state)
			return
		}

		for (var name in subMap) {
			var v = subMap[name];
			if (v.autoshow == true) {
				this.showWindow(name);
			}
		}
	}

	//隐藏游戏状态的所有窗口
	public hideStateWindows(state) {
		//TLog.Debug("WngMrg.hideStateWindows %d", state)
		var subMap = WndsMap[state]

		if (!subMap) {
			//TLog.Error("WngMrg.showStateWindows no ui exsit with state:%d", state)
			return
		}

		let copyList = g_WndList.concat()

		copyList.forEach(wnd => {
			var name = wnd.classname;
			var info = subMap[name];
			if (info) {
				wnd.hideWnd();
				if (info.mode == LOAD_RECYCLE_STATE) {
					wnd.unLoadWnd()
				}
			}
		});

	}


	pushShowStatck(exceptPushList, exceptHideList) {
		if (this.stackList == null) {
			this.stackList = Queue_new()
		}

		let saveData: any = {}
		saveData.visibleList = {}

		Queue_push_first(this.stackList, saveData)
		exceptPushList = exceptPushList || []					//排除不需要结束时pop时恢复显示的界面
		exceptHideList = exceptHideList || []					//排除不需要进入时push时关闭的界面

		exceptPushList.push("FullScreenBgFrame")

		let copy_list = {}
		for (let name in this.windows) {
			copy_list[name] = this.windows[name]
		}

		for (let name in copy_list) {
			let window: BaseWnd = copy_list[name]

			if (window.isVisible() && window.info.common != true && table_isExist(exceptPushList, window.classname) == false) {
				//saveData.visibleList[name] = window
				saveData.visibleList[window.hashCode] = window.getShowOrder()
			}
			if (table_isExist(exceptHideList, window.classname) == false) {
				window._hideWnd() //隐藏所有当前窗口
			}
		}
	}

	popShowStatck(exceptHideList?:string[], bHideCurUI?:boolean) {
		if(bHideCurUI == null)
			bHideCurUI = true

		//TLog.Assert(this.stackList)
		if (this.stackList == null) {
			return
		}

		let saveData = Queue_pop_first(this.stackList)

		let sortWindowList: any = []
		exceptHideList = exceptHideList || []

		let copy_list = {}
		for (let name in this.windows) {
			copy_list[name] = this.windows[name]
		}

		for (let name in copy_list) {
			let window: BaseWnd = copy_list[name]

			if(bHideCurUI){
				if (window.info.common != true && !table_isExist(exceptHideList, window.classname)) {
					window.hideWnd()
				}
			}
			

			let order = saveData.visibleList[window.hashCode]
			if (order != null && window.isAutoStackReshow()) {
				JsUtil.arrayInstert(sortWindowList, [order, window])
			}
		}

		if (sortWindowList.length > 0 && PrecedureManager.getInstance().getCurrentPrecedureId() == PRECEDURE_GAME) {				//析构时不再打开界面
			let sortFunc = function (a, b) {
				return a[0] - b[0]
			}
			table_sort(sortWindowList, sortFunc)
			//按显示order排序再显示
			for (let _ = 0; _ < sortWindowList.length; _++) {
				let v = sortWindowList[_]

				let window = v[1]
				window.showWnd(window.getRelateParent())
			}

		}
		
		if (Queue_empty(this.stackList)) {
			this.stackList = null
		}

	}

	//手动清除已在UI栈中的窗体
	removeShowStatck(window) {
		if (!this.stackList || window == null) {
			return
		}

		let saveData = Queue_pop_first(this.stackList)
		delete saveData.visibleList[window.hashCode]

		Queue_push_first(this.stackList, saveData)
	}


	// isRefreshDotTipsLater() {
	// 	return this.refreshDotTipsTimer != null
	// }

	// onHeroEnterGame(args) {

	// 	if (this.refreshDotTipsTimer == null) {


	// 		let callback = function (dt) {
	// 			KillTimer(this.refreshDotTipsTimer)
	// 			this.refreshDotTipsTimer = null

	// 			for (let i = 0; i < g_WndList.length; i++) {
	// 				let wnd = g_WndList[i]

	// 				if (wnd.isVisible()) {
	// 					wnd.refreshDotTips()
	// 				}
	// 			}


	// 		}

	// 		this.refreshDotTipsTimer = SetTimer(callback, this, 1500)
	// 	}
	// }



}