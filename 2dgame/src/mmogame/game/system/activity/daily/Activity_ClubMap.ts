// TypeScript file
/*
作者:
	
创建时间：

意图：
  	公会地图

公共接口：
	
*/

class Activity_ClubMap extends ActivityBase {
	coltNpcId: number;
	intrNpcId: number;

	array: any[];
	count: number;
	time: number;

	autoType: any;

	public initObj(...args: any[]): void {
		this.autoType = {}
		this.autoType[opFactionMapTaskType.Collect] = false
		this.autoType[opFactionMapTaskType.Monster] = false
	}

	onClear() {
	}

	destory() {

	}

	onPrepareResource() {

	}

	//请求进入地图开始
	requestStart() {
		if (CheckActivityState() == false)
			return;

		let mapId = MapSystem.getInstance().getMapId()
		if (mapId == 50100) {
			MsgSystem.addTagTips(Localize_cns("CLUB_TXT122"))
			return
		}

		if (CheckEndFightNow() == false)
			return
		ChangePatrolState(false) //停止巡逻
		RpcProxy.call("C2G_FactionMapEnter")
	}

	//请求离开地图
	requestStop() {
		RpcProxy.call("C2G_FactionMapLeave")
		this.autoType = {}
	}

	onStart() {
		RegisterEvent(EventDefine.HERO_MOVE_STOP, this.onHeroMoveStop, this) //注册主角移动事件
		RegisterEvent(EventDefine.HERO_ENTER_MAP, this.onHeroEnterMap, this)
		RegisterEvent(EventDefine.CLUB_TASK_FINISH_REFRESH, this.checkNpc, this) //创建npc
		RegisterEvent(EventDefine.COMBAT_BEGIN, this.onBattleBegin, this)
		RegisterEvent(EventDefine.COMBAT_END, this.onBattleEnd, this)
		PushUIShow(["ClubFrame", "MainCityFrame"], ["MainFrame"])
		StateManager.getInstance().ActiveSubState(state_type.LIVE_ACTIVITY_STATE)

		let wnd = WngMrg.getInstance().getWindow("ClubMapFrame")
		wnd.showWnd()

		wnd = WngMrg.getInstance().getWindow("MainFrame")
		wnd.doCommand("setHeadGroupVisible", true)

		this.autoType[opFactionMapTaskType.Collect] = false
		this.autoType[opFactionMapTaskType.Monster] = false
	}

	onStop() {
		if (FightSystem.getInstance().isFight() == true) {
			FightSystem.getInstance().addEndFightHandler(this._Stop, this, null)
		} else {
			this._Stop()
		}
	}

	_Stop() {
		UnRegisterEvent(EventDefine.HERO_MOVE_STOP, this.onHeroMoveStop, this) //注册主角移动事件
		UnRegisterEvent(EventDefine.HERO_ENTER_MAP, this.onHeroEnterMap, this)
		UnRegisterEvent(EventDefine.CLUB_TASK_FINISH_REFRESH, this.checkNpc, this)
		UnRegisterEvent(EventDefine.COMBAT_BEGIN, this.onBattleBegin, this)
		UnRegisterEvent(EventDefine.COMBAT_END, this.onBattleEnd, this)

		PopUIShow()
		StateManager.getInstance().DeactiveSubState(state_type.LIVE_ACTIVITY_STATE)

		let wnd = WngMrg.getInstance().getWindow("MainFrame")
		wnd.doCommand("setHeadGroupVisible", true)

		this.removeNpc()
	}

	onBattleBegin() {
		this.removeCollectNpc()
		this.removeInstrusionNpc()
	}

	onBattleEnd() {
		this.createCollectNpc()
		this.createInstrusionTask()

		if (this.autoType[opFactionMapTaskType.Collect] && !this.checkCollectComplete()) { //自动
			this.autoCollect(true)
		} else if (this.autoType[opFactionMapTaskType.Monster] && !this.checkInstrusionComplete()) { //自动
			this.autoInstrusion()
		}
	}

	getCheckType() {
		return this.autoType
	}

	createNpc() {
		this.createCollectNpc()
		this.createInstrusionTask()
	}

	checkNpc(args?) {
		if (!args) {
			args = {}
		}

		let taskType = args.taskType
		let count = args.count

		if (taskType == opFactionMapTaskType.Collect) {
			this.createCollectNpc(count)
		}

		if (taskType == opFactionMapTaskType.Monster) {
			this.createInstrusionTask(count)
			return
		}

		if (this.autoType[opFactionMapTaskType.Collect] && !this.checkCollectComplete()) { //自动
			this.autoCollect(true)
		} else if (this.autoType[opFactionMapTaskType.Monster] && !this.checkInstrusionComplete()) { //自动
			this.autoInstrusion()
		}
	}

	removeNpc() {
		this.removeCollectNpc()
		this.removeInstrusionNpc()
	}

	//创建采集npc
	createCollectNpc(count?) {
		if (this.checkCollectComplete(count)) {
			this.removeCollectNpc()
			this.autoType[opFactionMapTaskType.Collect] = false
			return
		}
		this.removeCollectNpc()

		let npc = ActorManager.getInstance().getNpc(this.coltNpcId)
		let pos = this.getRandLocalPosition(GetHero().getCellX(), GetHero().getCellY())
		if (npc) {
			npc.setCellXY(pos[0], pos[1])
			return
		}

		let npcInfo: any = {}
		npcInfo["cellx"] = pos[0]
		npcInfo["celly"] = pos[1]
		npcInfo["dir"] = 3
		npcInfo["entryId"] = this.getCollectId()
		this.coltNpcId = GenCharaterId()
		npcInfo["id"] = this.coltNpcId
		npcInfo["name"] = ""
		npcInfo["param"] = {}
		npcInfo["taskInfo"] = {}

		ActorManager.getInstance().createNpc(npcInfo)
	}

	//移出采集npc
	removeCollectNpc() {
		if(this.coltNpcId){
			ActorManager.getInstance().deleteNpc(this.coltNpcId)
			this.coltNpcId = null
		}
	}

	//创建小怪npc
	createInstrusionTask(count?) {
		if (this.checkInstrusionComplete(count)) {
			this.removeInstrusionNpc()
			this.autoType[opFactionMapTaskType.Monster] = false
			return
		}
		this.removeInstrusionNpc()

		let npc = ActorManager.getInstance().getNpc(this.intrNpcId)
		let pos = this.getRandLocalPosition(GetHero().getCellX(), GetHero().getCellY())
		if (npc) {
			npc.setCellXY(pos[0], pos[1])
			return
		}

		//战斗中
		if (FightSystem.getInstance().isFight() == true) {
			return
		}

		let npcInfo: any = {}
		npcInfo["cellx"] = pos[0]
		npcInfo["celly"] = pos[1]
		npcInfo["dir"] = 3
		npcInfo["entryId"] = this.getInstrusionId()
		this.intrNpcId = GenCharaterId()
		npcInfo["id"] = this.intrNpcId
		npcInfo["name"] = ""
		npcInfo["param"] = {}
		npcInfo["taskInfo"] = {}

		ActorManager.getInstance().createNpc(npcInfo)
	}

	//移出小怪npc
	removeInstrusionNpc() {
		if(this.intrNpcId){
			ActorManager.getInstance().deleteNpc(this.intrNpcId)
			this.intrNpcId = null
		}
	}

	//随机取点
	getRandLocalPosition(cellx, celly, scope?) {
		scope = scope || 35
		let RandomNUm = Math.ceil(Math.random() * scope * 2)
		let dx = RandomNUm - scope
		let dy = RandomNUm - scope

		let maxdeep = 100
		let deep = 0
		let wantX = cellx + dx
		let wantY = celly + dy
		while (SceneManager.getInstance().isBlock(wantX, wantY) || Math.abs(dy) < 5) {
			let dx = RandomNUm - scope
			let dy = RandomNUm - scope
			wantX = cellx + dx
			wantY = celly + dy

			deep = deep + 1
			if (deep >= maxdeep) {
				wantX = cellx
				wantY = celly
				break
			}
		}

		return [wantX, wantY]
	}

	//判断采集是否完成
	checkCollectComplete(count?) {
		let clubInfo = ClubSystem.getInstance().getCurClubInfo()
		if (!clubInfo) {
			return false
		}

		let recordList = getSaveRecord(opSaveRecordKey.facMapTaskFinishCount) || []
		let coltTime = recordList[opFactionMapTaskType.Collect] || 0
		let coltLimit = GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Collect][clubInfo.level].maxCount
		if (count != null) {
			coltTime = count
		}
		return coltTime == coltLimit
	}

	//判断小怪是否完成
	checkInstrusionComplete(count?) {
		let clubInfo = ClubSystem.getInstance().getCurClubInfo()
		if (!clubInfo) {
			return false
		}

		let recordList = getSaveRecord(opSaveRecordKey.facMapTaskFinishCount) || []
		let intrTime = recordList[opFactionMapTaskType.Monster] || 0
		let intrLimit = GameConfig.FactionMapTaskConfig[opFactionMapTaskType.Monster][clubInfo.level].maxCount
		if (count != null) {
			intrTime = count
		}
		return intrTime == intrLimit
	}

	//根据玩家等级获取采集npcIc
	getCollectId() {
		let level = GetHeroProperty("level")
		let config = null
		let info = null
		for (let i in GameConfig.FactionMapTaskNpcConfig[opFactionMapTaskType.Collect]) {
			config = GameConfig.FactionMapTaskNpcConfig[opFactionMapTaskType.Collect][i]
			if (level <= config.level) {
				return info.cNpcId
			}
			info = GameConfig.FactionMapTaskNpcConfig[opFactionMapTaskType.Collect][i]
		}

		return config.cNpcId
	}

	//根据玩家等级获取小怪npcIc
	getInstrusionId() {
		let level = GetHeroProperty("level")
		let config = null
		let info = null
		for (let i in GameConfig.FactionMapTaskNpcConfig[opFactionMapTaskType.Monster]) {
			config = GameConfig.FactionMapTaskNpcConfig[opFactionMapTaskType.Monster][i]
			if (level <= config.level) {
				return info.cNpcId
			}
			info = GameConfig.FactionMapTaskNpcConfig[opFactionMapTaskType.Monster][i]
		}

		return config.cNpcId
	}

	//自动采集
	autoCollect(isComplete?) {
		this.autoType[opFactionMapTaskType.Collect] = true

		var npc = ActorManager.getInstance().getNpc(this.coltNpcId)
		if (!npc) {
			return
		}

		let npcX = npc.getCellX()
		let npcY = npc.getCellY()

		let hero = GetHero()
		let heroX = hero.getCellX()
		let heroY = hero.getCellY()

		if (isComplete && npcX == heroX && npcY == heroY) { //同一个出生点
			this.createCollectNpc()
			this.autoCollect()
		} else if (!isComplete && npcX == heroX && npcY == heroY) {
			let wnd = WngMrg.getInstance().getWindow("ClubMapFrame")
			if (wnd.isVisible()) {
				wnd.startAnim()
			}
		} else { //走过去
			GetHero().wantToGoByCell(npcX, npcY)
		}
	}

	//自动小怪
	autoInstrusion() {
		this.autoType[opFactionMapTaskType.Monster] = true

		if (this.autoType[opFactionMapTaskType.Collect]) {
			return
		}

		var npc = ActorManager.getInstance().getNpc(this.intrNpcId)
		if (!npc) {
			return
		}

		let npcX = npc.getCellX()
		let npcY = npc.getCellY()

		let hero = GetHero()
		let heroX = hero.getCellX()
		let heroY = hero.getCellY()

		if (npcX == heroX && npcY == heroY) { //同一个出生点
			if (CheckFightState() == true) {
				return
			}
			//RpcProxy.call("C2G_FactionMapTaskFinishOnce", opFactionMapTaskType.Monster)
			this.createInstrusionTask()
			this.autoInstrusion()
		} else { //走过去
			GetHero().wantToGoByCell(npcX, npcY)
		}
	}

	//取消自动
	cancelAuto(_type) {
		this.autoType[_type] = false
	}

	onHeroMoveStop() {
		var npc = null
		if (this.autoType[opFactionMapTaskType.Collect]) {
			npc = ActorManager.getInstance().getNpc(this.coltNpcId)
		}

		if (!npc) {
			if (this.autoType[opFactionMapTaskType.Monster]) {
				npc = ActorManager.getInstance().getNpc(this.intrNpcId)
			}

			if (!npc) {
				return
			}
		}

		let npcX = npc.getCellX()
		let npcY = npc.getCellY()

		let hero = GetHero()
		let heroX = hero.getCellX()
		let heroY = hero.getCellY()

		if (npcX == heroX && npcY == heroY) {
			if (this.autoType[opFactionMapTaskType.Collect]) { //采集
				let wnd = WngMrg.getInstance().getWindow("ClubMapFrame")
				if (wnd.isVisible()) {
					wnd.startAnim()
				}
			} else {
				if (this.autoType[opFactionMapTaskType.Monster]) {
					if (CheckFightState() == true) {
						return
					}
					RpcProxy.call("C2G_FactionMapTaskFinishOnce", opFactionMapTaskType.Monster)
				}
			}
		} else {
			if (this.autoType[opFactionMapTaskType.Collect] || this.autoType[opFactionMapTaskType.Monster]) {
				GetHero().wantToGoByCell(npcX, npcY)
			}
		}
	}

	//帮派兑换数据
	setExchangeData(array, count, time) {
		this.array = array
		this.count = count
		this.time = time
	}

	getExchangeData() {
		let t: any = {}
		t.array = this.array
		t.count = this.count
		t.time = this.time
		return t
	}

	/////////////////////////////////////////////////////////////////
	//-进入活动关闭窗口
	onHeroEnterMap(index) {
		let mapId = MapSystem.getInstance().getMapId()
		if (mapId != 50100) {
			let wnd = WngMrg.getInstance().getWindow("ClubMapFrame")
			wnd.hideWnd()
			return
		}

		this.createNpc()
	}

}