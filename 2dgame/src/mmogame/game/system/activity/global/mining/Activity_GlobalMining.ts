// TypeScript file
/*
作者:
	
创建时间：

意图：
  	跨服争霸
	以下miningInfo、mineRobotInfo意义相同，mineInfo表示矿npc的信息
公共接口：
	
*/

class Activity_GlobalMining extends ActivityBase {
	robotList: any;
	robotInfoList: any
	heroRobotId: any;

	mMiningPath:egret.Shape;
	mineList: any;
	mineInfoList: any
	timerList: any

	bFollowCamera: boolean
	actInfo: any
	actTeamInfoList: any
	myPoint: number
	actTeamDetailInfo: any
	stressTest: boolean
	monthRank: any

	static BASE_NPC_ENTRY_REN: number = 10002						//人营
	static BASE_NPC_ENTRY_YAO: number = 10006						//妖营
	static BASE_NPC_ENTRY_XIAN: number = 10005						//仙营

	static MAPID: number = 50027

	public initObj(...args: any[]): void {
		this.robotList = {}
		this.robotInfoList = []
		this.mineList = {}
		this.mineInfoList = {}
		this.bFollowCamera = false
		this.heroRobotId = -1
        this.timerList = {}
		this.actTeamInfoList = []
		this.actTeamDetailInfo = null
		this.stressTest = false
	}

	onClear() {
		this.clearMine()
		this.clearMineRobot()
		this.clearMiningPath()
		this.clearTimer()

		this.bFollowCamera = false
		this.actInfo = null
		this.heroRobotId = -1
		this.actTeamInfoList = []
		this.actTeamDetailInfo = null
		this.monthRank = null
	}

	destory() {

	}

	onPrepareResource() {
		this.messageWndHandleIndex = 
		{	
            //进入活动
            ["G2C_MineEnterActivity"]: [this.onRecvEnter, [], true],
			//退出活动
			["G2C_MineLeaveActivity"]: [this.onRecvLeave, []],
			//活动信息
			["G2C_MineActivityInfo"]: [this.onRecvActivityInfo, [["GlobalMiningMainFrame", "updateWnd"]]],
			["G2C_MinePlrSocre"]: [this.onRecvMyPoint, [["GlobalMiningMainFrame", "updateMyPoint"]]],
			//挖矿机器人列表
			["G2C_MineActTeamInfoList"]: [this.onRecvMiningInfoList, [["GlobalMiningMainFrame", "updateTeamBtn"]], null, ActMessageHandlerTag.SKIP],
			//更新单个机器人信息
			["G2C_MineActTeamInfo"]: [this.onRecvMiningInfo, [["GlobalMiningMainFrame", "updateTeamBtn"]], null, ActMessageHandlerTag.SKIP],
			//移除机器人
			["G2C_MineActTeamRelease"]: [this.onRecvMiningRobotRemove, []],
			//新增机器人
			["G2C_MineActTeamAdd"]: [this.onRecvMiningRobotAdd, [["GlobalMiningMainFrame", "updateTeamBtn"]], null, ActMessageHandlerTag.SKIP],
			//矿列表
			["G2C_MineInfoList"]: [this.onRecvMineInfoList, [], null, ActMessageHandlerTag.SKIP],
			//更新单个矿信息
			["G2C_MineInfo"]: [this.onRecvMineInfo, [], null, ActMessageHandlerTag.SKIP],
			//活动队伍列表
			["G2C_MinePreActTeamList"]: [this.onRecActTeamInfoList, [["GlobalMiningJoinFrame", "refreshFrame"]]],
			//自己队伍（搭档）的详细信息
			["G2C_MineActTeamDetailInfo"]: [this.onRecActTeamDetailInfo, [["GlobalMiningTeamFrame", "updateWnd", true], ["GlobalMiningJoinFrame", "hideWnd"]], null, ActMessageHandlerTag.SKIP],
			//分区排名
			["G2C_MineMonthRank"]: [this.onRecMineMonthRank, [["GlobalMiningRankFrame", "refreshFrame"]], true],
		}
	}

	//请求进入地图开始
	requestStart() {
		// if (CheckActivityState() == false)
		// 	return;

		// let mapId = MapSystem.getInstance().getMapId()
		// if (mapId == 50100) {
		// 	MsgSystem.addTagTips(Localize_cns("CLUB_TXT122"))
		// 	return
		// }

		// if (CheckEndFightNow() == false)
		// 	return
		if (GetServerDay() >= 4 && GetHeroProperty("level") >= 90) {

		} else {
			return MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT48"))
		}
		
		if (HeroIsInTeam() == true) {
			return MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT49"))
		}

		if(CheckActivityState()== false)
			return;
			
		if (CheckEndFightNow() == false)
			return
		ChangePatrolState(false) //停止巡逻
		RpcProxy.call("C2G_MineEnterActivity")
	}

	//请求离开地图
	requestStop() {
		RpcProxy.call("C2G_MineLeaveActivity")
	}

	onStart() {
		RegisterEvent(EventDefine.PLAYER_ENTER_MAP, this.onPlayerEnterMap, this) //玩家进入地图
		RegisterEvent(EventDefine.HERO_ENTER_MAP, this.onHeroEnterMap, this)
		RegisterEvent(EventDefine.NPC_ENTER_MAP, this.onNpcEnterMap, this)
		RegisterEvent(EventDefine.NPC_LEAVE_MAP, this.onNpcLeaveMap, this)
		// RegisterEvent(EventDefine.CLUB_TASK_FINISH_REFRESH, this.checkNpc, this) //创建npc
		RegisterEvent(EventDefine.COMBAT_BEGIN, this.onBattleBegin, this)
		RegisterEvent(EventDefine.COMBAT_END, this.onBattleEnd, this)
		PushUIShow(["MainCityFrame"], ["MainFrame"])
		StateManager.getInstance().ActiveSubState(state_type.LIVE_ACTIVITY_GLOBALMINING)

		let wnd = WngMrg.getInstance().getWindow("GlobalMiningMainFrame")
		wnd.showWnd()

		ActorManager.getInstance().setShowPlayer(false)

	}

	onStop() {
		UnRegisterEvent(EventDefine.PLAYER_ENTER_MAP, this.onPlayerEnterMap, this) //玩家进入地图
		UnRegisterEvent(EventDefine.HERO_ENTER_MAP, this.onHeroEnterMap, this)
		UnRegisterEvent(EventDefine.NPC_ENTER_MAP, this.onNpcEnterMap, this)
		UnRegisterEvent(EventDefine.NPC_LEAVE_MAP, this.onNpcLeaveMap, this)
		// UnRegisterEvent(EventDefine.CLUB_TASK_FINISH_REFRESH, this.checkNpc, this)
		UnRegisterEvent(EventDefine.COMBAT_BEGIN, this.onBattleBegin, this)
		UnRegisterEvent(EventDefine.COMBAT_END, this.onBattleEnd, this)

		PopUIShow()
		StateManager.getInstance().DeactiveSubState(state_type.LIVE_ACTIVITY_GLOBALMINING)
		
		this.clearMine()
		this.clearMineRobot()
		this.clearMiningPath()
		this.clearTimer()

		this.setFollowCamera(false)

		//镜头绑定主角
		GetHero().setVisible(true)
		GetHero().setMoveable(true)
		SceneManager.getInstance().cameraLinkActor(GetHero())
		LookAtHero()
		ActorManager.getInstance().setShowPlayer(true)
	}

	clearTimer() {
        for (let _ in this.timerList) {
            let timer = this.timerList[_]
            KillTimer(timer)
        }
        this.timerList = {}
	}

	onRecvEnter(message) {
		ForceEndFightNow()
		this.start()

		return false
	}

	onRecvLeave(message) {
		FightSystem.getInstance().forceEndFight()
		
		if (FightSystem.getInstance().isFight() == true) {
			FightSystem.getInstance().addEndFightHandler(this.stop, this, null)
		} else {
			this.stop()
		}

		// this.stop()

		return false
	}

	onRecvActivityInfo(message) {
		//{actStage: actStage, renPoint: renPoint, xianPoint: xianPoint, yaoPoint: yaoPoint, endTime: endTime}
		//1当前状态,2人积分 3仙积分 4妖积分 5个人积分 6结束时间戳
		this.actInfo = message

		return true
	}

	getActivityInfo() {
		return this.actInfo
	}

	onRecvMyPoint(myPoint) {
		this.myPoint = myPoint

		return true
	}

	getMyPoint() {
		return checkNull(this.myPoint, 0)
	}

	onRecvMiningInfoList(miningInfoList) {
		//压力测试
		if (this.stressTest == true) {
			let testInfoList = []
			for (let i = 0; i < miningInfoList.length; i++) {
				let info = miningInfoList[i]
				for (let i = 1; i <= 150; i++) {
					let v = table_copy(info)
					v.actTeamId = v.actTeamId * 1000 + i
					table_insert(testInfoList, v)
				}
			}
			table_merge(miningInfoList, testInfoList)
		}

		this.clearMineRobot()

		for (let i = 0; i < miningInfoList.length; i++) {
			let info = miningInfoList[i]

			this.createMineRobot(info)
			this.updateMineRobot(info)
		}
		this.allBackToBaseQuick()
		this.checkMaxTeamShow()

		ActorManager.getInstance().hideAllPlayer()
		this.setFollowCamera(true)
		return true
	}

	onRecvMiningInfo(miningInfo) {
		// this.createMineRobot(miningInfo)
		//压力测试
		if (this.stressTest == true) {
			let miningInfoList = []
			table_insert(miningInfoList, miningInfo)
			let testInfoList = []
			for (let i = 0; i < miningInfoList.length; i++) {
				let info = miningInfoList[i]
				for (let i = 1; i <= 150; i++) {
					let v = table_copy(info)
					v.actTeamId = v.actTeamId * 1000 + i
					table_insert(testInfoList, v)
				}
			}
			table_merge(miningInfoList, testInfoList)
			for (let i = 0; i < miningInfoList.length; i++) {
				let miningInfo = miningInfoList[i]
				this.updateMineRobot(miningInfo)
			}
		} else {
			this.updateMineRobot(miningInfo)
		}

		this.checkMaxTeamShow()

		if (this.getHeroMiningRobot()) {
			return this.heroRobotId == miningInfo.actTeamId
		}
		return false
	}

	onRecvMiningRobotRemove(actTeamId) {
		this.deleteMineRobot(actTeamId)
		this.checkMaxTeamShow()
	}

	onRecvMiningRobotAdd(miningInfo) {
		this.createMineRobot(miningInfo)
		this.updateMineRobot(miningInfo)
		this.updateRobotBase(this.robotList[miningInfo.actTeamId])
		this.checkMaxTeamShow()

		if (this.getHeroMiningRobot()) {
			return this.heroRobotId == miningInfo.actTeamId
		}
		return false
	}

	onRecvMineInfoList(mineInfoList) {
		this.clearMine()

		for (let i = 0; i < mineInfoList.length; i++) {
			let mineInfo = mineInfoList[i]
			this.createMine(mineInfo)
			this.updateMineInfo(mineInfo)
		}

		return false
	}

	onRecvMineInfo(mineInfo) {
		this.updateMineInfo(mineInfo)

		return false
	}

	onRecActTeamInfoList(actTeamInfoList) {
		this.actTeamInfoList = actTeamInfoList
		
		return true
	}

	getActTeamInfoList() {
		return this.actTeamInfoList
	}

	onRecActTeamDetailInfo(actTeamDetailInfo) {
		this.actTeamDetailInfo = actTeamDetailInfo

		return true
	}

	getActTeamDetailInfo() {
		return this.actTeamDetailInfo
	}

	onRecMineMonthRank(info) {
		this.monthRank = info
		//{rankList: [{regionId, groupIndex, score}, {regionId, groupIndex, score}], regionId: 我的服, groupIndex: 我的服}

		return true
	}

	getMineMonthRank() {
		return this.monthRank
	}
	//////////////////////////////////////////////////////////////////////
	unLinkHero() {
		SceneManager.getInstance().cameraUnLinkActor()
		GetHero().moveStop()
		GetHero().setVisible(false)
		GetHero().setMoveable(false)
	}
	
	getRandLocalPosition(cellx, celly, scope) {
		scope = scope || 6
		let RandomNUm = MathUtil.random(1, scope*2)
		let dx = MathUtil.random(1, scope*2) - scope
		let dy = MathUtil.random(1, scope*2) - scope - 5
		
		let maxdeep = 30
		let deep = 0
		let [wantX, wantY] = [cellx + dx, celly + dy]
		// while(SceneManager.getInstance():isBlock(wantX,wantY))do
		// 	let dx = math.random(1, scope*2) - scope
		// 	let dy = math.random(1, scope*2) - scope
		// 	wantX, wantY = cellx + dx, celly + dy
			
		// 	deep = deep + 1
		// 	if deep >= maxdeep then
		// 		wantX, wantY = cellx, celly 
		// 		break
		// 	end
		// end
		
		return [wantX, wantY]
	}

	backToBase(robot, baseType, quick?) {
		let entryId = Activity_GlobalMining.BASE_NPC_ENTRY_REN
		if (baseType == opGlobalMineCampInfoIndex.xian) {
			entryId = Activity_GlobalMining.BASE_NPC_ENTRY_XIAN
		} else if (baseType == opGlobalMineCampInfoIndex.yao) {
			entryId = Activity_GlobalMining.BASE_NPC_ENTRY_YAO
		}

		let config = GameConfig.npcConfig[entryId]
		if (config == null){// || this.getHeroMiningRobot() == null) {
			return
		}

		let [x, y] = this.getRandLocalPosition(config.x, config.y, 5)
		robot.moveStop()
		if (quick == null) {
			robot.wantToGoByCell(x, y)

			let heroRobot = this.getHeroMiningRobot()
			if (robot == heroRobot) {
				let point = robot.getCellXY()
				this.drawMapPath(point.x, point.y, x, y)
			}
		} else {
			robot.setCellXY(x, y)
		}
		// this.getHeroMiningRobot().setCellXY(x, y)
	}

	isFollowCamera() {
		return this.bFollowCamera
	}

	setFollowCamera(b) {
		if (b == false) {
			SceneManager.getInstance().cameraUnLinkActor()
		} else {
			if (this.getHeroMiningRobot()) {
				SceneManager.getInstance().cameraLinkActor(this.getHeroMiningRobot())
			}
		}
		
		this.bFollowCamera = b
	}

	getHeroMiningRobot() {
		return this.robotList[this.heroRobotId]
	}

	getMiningRobot(robotId) {
		return this.robotList[robotId]
	}

	isMiningLeader() {
		let heroRobot = this.getHeroMiningRobot()
		if (heroRobot == null) {
			return false
		}

		let flag = false
		let info = heroRobot.getMiningInfo()
		let count = info.members.length

		if (count == 1) {							//只有自己在组内
			flag = true
		} else {
			for (let i = 0; i < count; i++) {
				let v = info.members[i]
				if (v.plrId == GetHeroProperty("id") && v.captain == 1) {
					flag = true
				}
			}
		}

		return flag
	}

	isInMiningTeam() {						//是否已组队
		let heroRobot = this.getHeroMiningRobot()
		if (heroRobot == null) {
			return false
		}

		let info = heroRobot.getMiningInfo()
		let count = info.members.length
		for (let i = 0; i < count; i++) {
			let v = info.members[i]
			if (v.captain == 1) {
				return true
			}
		}

		return false
	}

	getMinePrize() {
		if (this.isMiningLeader() == false) {
			return
		}

		RpcProxy.call("C2G_MineGetPrize")
	}

	//职业头像
	getProfessionActIcon(entryId, sex) {
		let imageName = "kfzb_90001"
		let config = GameConfig.ProfessionModelConfig[entryId]
		if (config && config[sex]) {
			imageName = "kfzb_" + config[sex].icon
		}

		return imageName
	}

	getActCampIcon(baseType) {
		let t = {
			[opGlobalMineCampInfoIndex.ren]: "kfzb_zhengYingKuang01",						//人营
			[opGlobalMineCampInfoIndex.xian]: "kfzb_zhengYingKuang02",			//仙营
			[opGlobalMineCampInfoIndex.yao]: "kfzb_zhengYingKuang03",					//妖营
		}

		let imageName = checkNull(t[baseType], "kfzb_zhengYingKuang01")

		return imageName
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//矿-npc相关
	updateMineInfo(mineInfo) {
		if (this.mineList[mineInfo.mIndex] == null) {
			return
		}
		//刷新矿的表现信息
		let npc = this.mineList[mineInfo.mIndex]
        npc.doCommand(ActorCommand.SetGlobalMiningVisible, true)
        npc.doCommand(ActorCommand.SetGlobalMiningInfoBtn, false)
		npc.doCommand(ActorCommand.SetGlobalMiningTips, false)

		let config = GameConfig.GlobalMiningConfig[mineInfo.mIndex]
		// if (mineInfo.actTeamId > 0) {
			if (config) {
				let txt = String.format(Localize_cns("GLOBAL_MINING_TXT28"), mineInfo.membersCount + "/" + config.memberCount)
				npc.doCommand(ActorCommand.SetGlobalMiningTips, true, txt)
			}
		// }
		
		if (config) {
        	npc.doCommand(ActorCommand.SetGlobalMiningInfoBtn, true, {title: config.title, content: config.read,})
		}

		this.mineInfoList[mineInfo.mIndex] = mineInfo
	}

	createMine(mineInfo) {
		//战斗中屏蔽矿、队伍
		if (FightSystem.getInstance().isFight() == true) {
			return
		}

		if (this.mineList[mineInfo.mIndex]) {
			return
		}

		let config = GameConfig.GlobalMiningConfig[mineInfo.mIndex]
		let npcInfo: any = {}
		npcInfo["cellx"] = config.pos[0]
		npcInfo["celly"] = config.pos[1]
		npcInfo["dir"] = ActorDirMap.RightBottom
		npcInfo["entryId"] = config.entryId
		npcInfo["id"] = mineInfo.mIndex
		npcInfo["name"] = ""
		npcInfo["param"] = {}
		npcInfo["taskInfo"] = {}

		let npc = ActorManager.getInstance().createNpc(npcInfo)
		npc.setAnimNotifyEnable(false)

		this.mineList[mineInfo.mIndex] = npc
	}

	updateMine(mineInfoId) {
		let mineInfo = this.mineInfoList[mineInfoId]
		if (mineInfo != null) {
			this.updateMineInfo(mineInfo)
		}
	}

	clearMine() {
		let idList = []
		for (let k in this.mineList) {
			table_insert(idList, tonumber(k))
		}
		for (let i = 0; i < idList.length; i++) {
			let id = idList[i]
			ActorManager.getInstance().deleteNpc(id)
		}
		this.mineList = {}
		this.mineInfoList = {}
	}

	onNpcEnterMap(args) {
		let entryId = args.actor.getEntryId()
		if (entryId == Activity_GlobalMining.BASE_NPC_ENTRY_REN ||
			entryId == Activity_GlobalMining.BASE_NPC_ENTRY_XIAN ||
			entryId == Activity_GlobalMining.BASE_NPC_ENTRY_YAO) {

			// args.actor.enterMap(eMapLayerTag.Sprite_Bottom)
			// args.actor.setMapLayer(eMapLayerTag.Sprite_Bottom);
			// SceneManager.getInstance().enterMap(this, eMapLayerTag.Sprite_Bottom);
		}
	}

	onNpcLeaveMap(args) {
		let id = args.actor.getId()
		if (this.mineList[id] == null) {
			return
		}

		delete this.mineList[id]
		delete this.mineInfoList[id]
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//挖矿机器人相关
	onClickActor(actor) {
		if (actor.getActorType() == actor_Type.ACTOR_TYPE_NPC) {
			let entryId = actor.getEntryId()
			if (entryId == Activity_GlobalMining.BASE_NPC_ENTRY_REN ||
				entryId == Activity_GlobalMining.BASE_NPC_ENTRY_XIAN ||
				entryId == Activity_GlobalMining.BASE_NPC_ENTRY_YAO) {
					return
			}
			
			let info = this.getActivityInfo()
			if (info && info.actStage == opGlobalMineStatus.prepare) {						//准备状态不可挖矿
				MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT47"))
				return
			}
			
			let heroRobot = this.getHeroMiningRobot()
			if (heroRobot == null) {
				return
			}

			if (this.mineList[actor.getId()] == null) {
				return
			}

			let npcPos = actor.getCellXY()
			let miningInfo = heroRobot.getMiningInfo()
			//组员不能操作
			if (this.isMiningLeader() == false) {
				MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT34"))
				return
			}

			//不是同服的矿不可采
			let mineConfig = GameConfig.GlobalMiningConfig[actor.getId()]
			if (mineConfig) {
				if (mineConfig.campsIndex > 0 && mineConfig.campsIndex != miningInfo.campInfoIndex) {
					MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT35"))
					return
				}
			}

			if (miningInfo.status == opGlobalMineActTeamStatus.nothing) {					//在基地
				this._onClickActor(actor)
			} else if (miningInfo.status == opGlobalMineActTeamStatus.move) {					//移动中
				this._onClickActor(actor)
			} else if (miningInfo.status == opGlobalMineActTeamStatus.guard ||				//占领中
					   miningInfo.status == opGlobalMineActTeamStatus.mining) {				//采集中	

						   if (miningInfo.mineIndex != actor.getId()){						//不是当前占领（采集）的矿
						   		let _this = this
								var callback: IDialogCallback = {
									onDialogCallback(result: boolean, userData): void {
										if (result == true) {
											_this._onClickActor(actor)
										}
									}
								}
								MsgSystem.confirmDialog(Localize_cns("GLOBAL_MINING_TXT36"), callback, null)
						   }
			} else if (miningInfo.status == opGlobalMineActTeamStatus.stay) {				//停留中
				this._onClickActor(actor)
			}
		}
	}

	_onClickActor(actor) {
		let heroRobot = this.getHeroMiningRobot()
		let point = heroRobot.getCellXY()
		let npcPos = actor.getCellXY()
		
		if (MathUtil.checkScope(point.x, point.y, npcPos.x, npcPos.y, 0) == true) {
			this.applyEnterMine(heroRobot, actor)
		} else {
			RpcProxy.call("C2G_MoveDestMine", actor.getId(), [point.x, point.y])
		}
	}

	applyEnterMine(miningRobot, npc?) {
		if (this.isMiningLeader() == false) {
			return
		}
		
		npc = checkNull(npc, miningRobot.getMiningMine())
		if (npc == null || miningRobot != this.getHeroMiningRobot()) {
			return
		}
		
		let miningInfo = miningRobot.getMiningInfo()
		if (this.timerList[miningInfo.actTeamId]) {
			KillTimer(this.timerList[miningInfo.actTeamId])
			delete this.timerList[miningInfo.actTeamId]
		}

		if (miningInfo.status == opGlobalMineActTeamStatus.nothing){				//回基地
			return
		}

		let mineInfo = this.mineInfoList[npc.getId()]

		//弹出抢夺
		let lairdRobot = this.robotList[mineInfo.actTeamId]
		if (lairdRobot == null) {
			
		} else {
			let info = lairdRobot.getMiningInfo()
			if (info.campInfoIndex != miningInfo.campInfoIndex) {				//别人已占领
				let wnd = WngMrg.getInstance().getWindow("GlobalMiningGuardFrame")
				wnd.showMiningGuardFrame(info.actTeamId, npc.getId())

				return
			} else {															//本阵营的人占领
				let _this = this
				let t: IDialogCallback = {
				onDialogCallback(result: boolean, userData): void {
					if (result) {
							_this.genEnterMineTicker(npc.getId())
							FireEvent(EventDefine.MSG_WAIT_BEGIN, ClientWaitEvent.newObj(null, null, false))
						}
					}
				}
				MsgSystem.confirmDialog(Localize_cns("GLOBAL_MINING_TXT53"), t)
			}
		}
		
		//无人占领
		if (mineInfo.actTeamId == 0) {
			let _this = this
			let t: IDialogCallback = {
			onDialogCallback(result: boolean, userData): void {
				if (result) {
						_this.genEnterMineTicker(npc.getId())
						FireEvent(EventDefine.MSG_WAIT_BEGIN, ClientWaitEvent.newObj(null, null, false))
					}
				}
			}
			MsgSystem.confirmDialog(Localize_cns("GLOBAL_MINING_TXT51"), t)
			return
		}
		
	}

	genEnterMineTicker(npcId?) {
		let miningRobot = this.getHeroMiningRobot()
		if (miningRobot == null) {
			return
		}

		npcId = checkNull(npcId, 0)
		let npc = this.mineList[npcId]
		npc = checkNull(npc, miningRobot.getMiningMine())
		if (npc == null) {
			return
		}

		let miningInfo = miningRobot.getMiningInfo()
		let tick = function(delay) {
			if (GetServerTime() >= miningInfo.time) {
				//判断是不是已被别人占了
				let flag = true
				let mineInfo = this.mineInfoList[npc.getId()]
				if (mineInfo == null) {
					flag = false
				}

				if (flag == false) {
					if (this.timerList[miningInfo.actTeamId]) {
						KillTimer(this.timerList[miningInfo.actTeamId])
						delete this.timerList[miningInfo.actTeamId]
					}
					return
				}
				RpcProxy.call("C2G_MineEnter", npc.getId())
			}
		}
		if (this.timerList[miningInfo.actTeamId] == null) {
			this.timerList[miningInfo.actTeamId] = SetTimer(tick, this, 1000, true)
		}
	}

	gotoMine(robot, npc) {
		let heroRobot = this.getHeroMiningRobot()
		let npcPos = npc.getCellXY()
		let heroPos = robot.getCellXY()

		let entryId = npc.getProperty("entryId")
		let npcRef = GameConfig.npcConfig[entryId]
		if (npcRef == null) {
			return
		}

		if (entryId == Activity_GlobalMining.BASE_NPC_ENTRY_REN ||
			entryId == Activity_GlobalMining.BASE_NPC_ENTRY_YAO ||
			entryId == Activity_GlobalMining.BASE_NPC_ENTRY_XIAN) {
				// this.backToBase()
				// return
			}
		// let directTalk = checkNull(npcRef.directTalk, 0)
		// //如果超过了谈话最大距离，则跑过去
		// if (directTalk != 1 && MathUtil.checkScope(heroPos.x, heroPos.y, npcPos.x, npcPos.y, NPCTALK_MAX_SCOPE) == false) {
		// 	if (CheckHeroCanGo()) {
		// 		let mapId = MapSystem.getInstance().getMapId()
		// 		Command_FindWayToTalkNpc(mapId, npcPos.x, npcPos.y, NPCTALK_MIN_SCOPE, actor.getEntryId(), actor.getId(), [AutoActionType.NULL, null, null, null])
		// 	}
		// } else {
		// 	Task_ShowNpcDialogWithNpc(actor.getId())
		// }
		robot.wantToGoByCell(npcPos.x, npcPos.y, true)

		if (robot == heroRobot) {
			this.drawMapPath(heroPos.x, heroPos.y, npcPos.x, npcPos.y)
		}
		// robot.setMiningInfo({sx: heroPos.x, sy: heroPos.y, ex: npcPos.x, ey: npcPos.y})
	}

	drawMapPath(sx, sy, ex, ey){
        let miningPath:egret.Shape = this.mMiningPath
        if(this.mMiningPath == null){
			let sceneManager = SceneManager.getInstance()
			let layer = sceneManager.mCamera.mContainer.getChildAt(2)
			if (layer) {
				this.mMiningPath = new egret.Shape();
				layer.addChild(this.mMiningPath);
				miningPath = this.mMiningPath;
			}
        }

		let sPoint = SceneManager.getInstance().cellXYtoMapXY(sx, sy)
		let ePoint = SceneManager.getInstance().cellXYtoMapXY(ex, ey)
		let graphics = miningPath.graphics
        graphics.clear();
		graphics.lineStyle(5, 0x00ff00, 1, true, "normal", egret.CapsStyle.SQUARE, egret.JointStyle.ROUND, null, [2, 2, 2, 2, 2]);
        // graphics.beginFill(0x000000, 1);

		// maskIcon.graphics.moveTo
        // maskIcon.graphics.drawRect(0, 0, w, h) //绘制方形
        // maskIcon.graphics.endFill();
		let n = 20
		let rx = Math.floor((ePoint.x - sPoint.x) / n)
		let ry = Math.floor((ePoint.y - sPoint.y) / n)

		let x = sPoint.x
		let y = sPoint.y
		for (let i = 0; i <= n; i++) {
			graphics.moveTo(x, y);
			x = x + rx / 2
			y = y + ry / 2
			graphics.lineTo(x, y)
			x = x + rx / 2
			y = y + ry / 2
		}
		graphics.lineTo(ePoint.x, ePoint.y);   //从起点位置划线到终点

        // graphics.moveTo(sPoint.x, sPoint.y);    //将画笔移动到起点位置
		// graphics.lineTo((sPoint.x + ePoint.x) / 2 + 80, (sPoint.y + ePoint.y) / 2 - 80);    //将画笔移动到起点位置
        // graphics.lineTo(ePoint.x, ePoint.y);   //从起点位置划线到终点
        // graphics.endFill();
	}

	clearMiningPath() {
		if (this.mMiningPath == null) {
			return
		}

		this.mMiningPath.graphics.clear();
	}

	allBackToBaseQuick() {
		for (let k in this.robotList) {
			let robot = this.robotList[k]
			this.updateRobotBase(robot)			//刷新队伍是否回归基地状态
		}
	}

	updateRobotBase(robot) {
		let miningInfo = robot.getMiningInfo()

		if (miningInfo.status == opGlobalMineActTeamStatus.nothing) {				//
			this.backToBase(robot, miningInfo.campInfoIndex, true)
		}
	}

	checkMaxTeamShow() {
		let mustShow = []
		let otherShow = []
		for (let k in this.robotInfoList) {
			let actTeamId = this.robotInfoList[k]
			let robot = this.robotList[actTeamId]
			if (robot) {
				let info = robot.getMiningInfo()
				if (info.status == opGlobalMineActTeamStatus.guard) {				//占领中
					table_insert(mustShow, robot)
				} else if (this.heroRobotId == actTeamId && info.status != opGlobalMineActTeamStatus.mining) {	//自己不在采集中
					table_insert(mustShow, robot)
				} else {
					table_insert(otherShow, robot)
				}

				robot.setVisible(false)
			}
		}

		let count = 0
		for (let k in mustShow) {
			let robot = mustShow[k]
			robot.setVisible(true)
			count = count + 1
		}
		for (let k in otherShow) {
			let robot = otherShow[k]
			let info = robot.getMiningInfo()
			if (info.status != opGlobalMineActTeamStatus.mining) {				//占领中
				robot.setVisible(true)
				count = count + 1

				if (count >= 30) {												//最多显示30个
					break
				}
			}
		}
	}

	/////////////////////////////////////////////////////////////////
	//-进入活动关闭窗口
	onHeroEnterMap(index) {
		let mapId = MapSystem.getInstance().getMapId()
		if (mapId != Activity_GlobalMining.MAPID) {
			return
		}
		this.unLinkHero()

		//申请重新刷新矿、队伍列表
		RpcProxy.call("C2G_MineInfoListAndActTeamList")
		//创建一个对象
		// let info = {}
		// this.createMineRobot(info)
	}

	onPlayerEnterMap(args) {
		let player = args.actor
		player.setVisible(false)
	}

	//刷新挖矿队伍的表现信息
	updateMineRobot(mineRobotInfo) {
		if (this.timerList[mineRobotInfo.actTeamId]) {
			KillTimer(this.timerList[mineRobotInfo.actTeamId])
			delete this.timerList[mineRobotInfo.actTeamId]
		}

		if (this.robotList[mineRobotInfo.actTeamId] == null) {
			return
		}

		//预处理一下搭档的排序，队长排前面
		table_sort(mineRobotInfo.members, function(a, b) {return b.captain - a.captain})

		let robot = this.robotList[mineRobotInfo.actTeamId]
		let oldMineRobotInfo = robot.getMiningInfo()
		robot.setMiningInfo(mineRobotInfo)
		// robot.setVisible(true)
		if (robot == this.getHeroMiningRobot()) {
			this.clearMiningPath()
		}
		if (table_isExist(this.robotInfoList, mineRobotInfo.actTeamId) == false) {
			table_insert(this.robotInfoList, mineRobotInfo.actTeamId)
		}
		let isMyRobot = false;
		for (let k in mineRobotInfo.members) {
			let v = mineRobotInfo.members[k]
			if (v.plrId == GetHeroProperty("id")) {
				this.heroRobotId = mineRobotInfo.actTeamId
				isMyRobot = true;
				// this.backToBase()
			}
		}
		robot.doCommand(ActorCommand.SetGlobalMiningTeam, true, mineRobotInfo)
		robot.setMovementNotifyEnable(isMyRobot)
        robot.setMovingNotifyEnable(isMyRobot)
		robot.moveStop()

		//机器人状态
		let npc = robot.getMiningMine()
		if (npc != null && robot == this.getHeroMiningRobot()) {							//自己发生状态变化时，才需要刷新
			npc.doCommand(ActorCommand.SetGlobalMiningCollect, false)
			this.updateMine(npc.getId())
		}
		if (mineRobotInfo.status == opGlobalMineActTeamStatus.nothing) {					//没事回基地
			if (oldMineRobotInfo && oldMineRobotInfo.status == mineRobotInfo.status) {
				return
			}
			this.backToBase(robot, mineRobotInfo.campInfoIndex)
		} else if (mineRobotInfo.status == opGlobalMineActTeamStatus.move) {				//移动中
			robot.setCellXY(mineRobotInfo.pos[0], mineRobotInfo.pos[1])

			let npc = this.mineList[mineRobotInfo.mineIndex]
			if (npc == null) {
				return
			}

			robot.setMiningMineId(mineRobotInfo.mineIndex)
			this.gotoMine(robot, npc)
		} else if (mineRobotInfo.status == opGlobalMineActTeamStatus.guard) {				//占领中
			let npc = this.mineList[mineRobotInfo.mineIndex]
			if (npc == null) {
				return
			}
			let minePoint = npc.getCellXY()
			robot.setCellXY(minePoint.x, minePoint.y)
			// let config = GameConfig.GlobalMiningConfig[mineRobotInfo.mineIndex]
			// robot.setCellXY(config.pos[0], config.pos[1])

			if (this.getHeroMiningRobot() == robot) {

				//采集中
				npc.doCommand(ActorCommand.SetGlobalMiningCollect, true, mineRobotInfo.time)
				robot.setMiningMineId(mineRobotInfo.mineIndex)
				FireEvent(EventDefine.MSG_WAIT_END, null)
				WngMrg.getInstance().hideWindow("GlobalMiningGuardFrame")
			} else {
				// robot.setVisible(false)
			}
		} else if (mineRobotInfo.status == opGlobalMineActTeamStatus.mining) {				//采集中
			let npc = this.mineList[mineRobotInfo.mineIndex]
			if (npc == null) {
				return
			}
			let minePoint = npc.getCellXY()
			robot.setCellXY(minePoint.x, minePoint.y)
			// let config = GameConfig.GlobalMiningConfig[mineRobotInfo.mineIndex]
			// robot.setCellXY(config.pos[0], config.pos[1])

			if (this.getHeroMiningRobot() == robot) {

				//采集中
				npc.doCommand(ActorCommand.SetGlobalMiningCollect, true, mineRobotInfo.time)
				npc.doCommand(ActorCommand.SetGlobalMiningTips, false)
				robot.setMiningMineId(mineRobotInfo.mineIndex)
				FireEvent(EventDefine.MSG_WAIT_END, null)
				WngMrg.getInstance().hideWindow("GlobalMiningGuardFrame")
			}else {
				// robot.setVisible(false)
			}
		} else if (mineRobotInfo.status == opGlobalMineActTeamStatus.stay) {				//停留中
			if (this.getHeroMiningRobot() == robot) {
				this.clearMiningPath()
				FireEvent(EventDefine.MSG_WAIT_END, null)
				WngMrg.getInstance().hideWindow("GlobalMiningGuardFrame")
			}
		}
	}

	createMineRobot(info) {
		//战斗中屏蔽矿、队伍
		if (FightSystem.getInstance().isFight() == true) {
			return
		}

		if (this.robotList[info.actTeamId] != null) {
			return
		}

		let robot:GlobalMineRobot = GlobalMineRobot.newObj(this)
		let propertyInfo: any = {}
		propertyInfo.id = info.actTeamId
		// propertyInfo.miningInfo = info

		robot.setCellXY(info.pos[0], info.pos[1])
        robot.setDir(ActorDirMap.Left)
		robot.setPropertyInfo(propertyInfo)
		//robot.loadModel(100)
		robot.enterMap(eMapLayerTag.Sprite_Top)//显示
		robot.setMoveSpeed(2)
		robot.doCommand(ActorCommand.SetShadowVisible, false)
        robot.doCommand(ActorCommand.SetGlobalMiningVisible, true)
		this.robotList[propertyInfo.id] = robot
	}

	deleteMineRobot(id) {
		if (this.timerList[id]) {
			KillTimer(this.timerList[id])
			delete this.timerList[id]
		}

		if (this.robotList[id] == null) {
			return
		}

		let robot = this.robotList[id]
		let npc = robot.getMiningMine()
		if (npc != null) {
			this.updateMine(npc.getId())
			npc.doCommand(ActorCommand.SetGlobalMiningCollect, false)
		}
		robot.deleteObj()
		table_remove(this.robotInfoList, id)

		delete this.robotList[id]
	}

	clearMineRobot() {
		for (let k in this.robotList) {
			let v = this.robotList[k]
			v.deleteObj()
		}
		this.robotList = {}
		this.robotInfoList = []
	}

	onBattleBegin(args) {
		this.clearMineRobot()
		this.clearMiningPath()
		this.clearMine()
	}

	onBattleEnd(args) {
		TaskSystem.getInstance().onHeroEnterMap({})
		this.unLinkHero()

		//申请重新刷新矿、队伍列表
		RpcProxy.call("C2G_MineInfoListAndActTeamList")
		ActorManager.getInstance().hideAllPlayer()
	}
}