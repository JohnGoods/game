var MapPlayType =
	{
		Campaign: 1,	//战役
		JJC: 2,	//竞技场
		Movie: 3,	//电影
		Team: 4,	//组队战役

		Default: 99,
	}

class MapJumpRecord extends TClass {
	inMapId: number;
	x: number;
	y: number;
	type: number;
	npcName: string;
	npcId: number;

	public initObj(...args: any[]): void {
		this.inMapId = args[0]
		this.x = args[1]
		this.y = args[2]
		this.type = args[3]
		this.npcName = args[4]
		this.npcId = args[5]
	}

	destory() {

	}
}


function PushMapShow() {
	MapSystem.getInstance().pushMapStack()
}

function PopMapShow() {
	MapSystem.getInstance().popMapStack()
}


class MapSystem extends BaseSystem {

	bFindWay: boolean;
	find_trace_list: any[];
	_find_flag: any;
	trace_head: number;
	lastJumpRecord: MapJumpRecord;


	mapId: number;
	enterMapId: number;
	bAutoRun: boolean
	transportList: any[];

	mapStackList: any;
	lockPopMap: boolean;

	mSceneMrg: SceneManager;
	autoState: boolean;					//（是否自动）挂机状态
	autoStateTimer: number;

	public initObj(...params: any[]): void {
		//RegisterEvent(EventDefine.HERO_MOVE_STOP, this.onHeroMoveStop, this) //注册主角移动事件
		//RegisterEvent(EventDefine.HERO_MOVE, this.onHeroMove, this) //注册主角移动事件
		RegisterEvent(EventDefine.STATE_ACTIVE, this.onStateActive, this)
		//this.bFindWay = false
		//this.find_trace_list = nil
		//this.trace_head = 0   //当前寻路的目标，在find_trace_list的指针头,每当切换地图时候加1
		//this.mapId = 0
		//this.lastJumpRecord = nil
		//
		//this.transportList = {}

		this.mSceneMrg = SceneManager.getInstance();

		RegisterEvent(EventDefine.MOVIE_BEGIN, this.onMovieBegin, this)
		RegisterEvent(EventDefine.MOVIE_END, this.onMovieEnd, this)
		RegisterEvent(EventDefine.OBJECT_MESSAGE_MOVE, this.addPopMap, this)

		//RegisterEvent(EventDefine.STATE_ACTIVE, this.onStateChange, this)
		this.onClear()
	}

	destory() {
		UnRegisterEvent(EventDefine.OBJECT_MESSAGE_MOVE, this.addPopMap, this)
		this.onClear()
	}


	onClear() {
		this.bFindWay = false
		this.find_trace_list = null
		this.trace_head = -1
		this.lastJumpRecord = null


		this.mapId = 0//当前地图ID（包括多人地图和单人模式）
		this.enterMapId = 0//多人地图ID

		this.mapStackList = null

		this.clearTransport()
		this.clearScreenEffect()

		this.lockPopMap = false
		this.bAutoRun = false

		this.setAutoState(false)
	}

	//准备资源，把自己的workunit加载队列里
	prepareResource(workQueue: WorkQueue) {
		//this._initConfig(workQueue)
		GameConfig.initMapSystemCsv(workQueue);
	}



	//加入新地图，保存原来地图坐标
	pushMapStack() {

		if (this.mapStackList == null) {
			this.mapStackList = Queue_new()

			//RegisterEvent(EventDefine.HERO_RESET_POSITION, this.onHeroResetPosition, this)
		}

		var saveData: any = {}
		saveData.mapId = this.mapId
		//modify:movie
		// let [isMovie, _] = MovieSystem.getInstance().isPlayingMovie()
		// if (isMovie == true) {

		// 	var p = this.mSceneMrg.screenXYtoMapXY(0, 0);
		// 	p = this.mSceneMrg.mapXYtoCellXY(p.x, p.y);
		// 	saveData.cellX = p.x;
		// 	saveData.cellY = p.y;
		// 	saveData.callBack = this.loadMovieMap
		// } else {
			var p: any = GetHero().getCellXY();
			saveData.cellX = p.x;
			saveData.cellY = p.y;
			saveData.callBack = this.loadMap
		//}
		Queue_push_first(this.mapStackList, saveData)
		CommandManager.getInstance().clear()
		TLog.Debug("pushMapStack", saveData.mapId, saveData.cellX, saveData.cellY)
	}

	//恢复上一个地图
	popMapStack() {

		TLog.Assert(this.mapStackList)
		var saveData = Queue_pop_first(this.mapStackList)
		if (Queue_empty(this.mapStackList)) {
			this.mapStackList = null
			//UnRegisterEvent(EventDefine.HERO_RESET_POSITION, this.onHeroResetPosition, this)
			//GetHero().setAloneMode(false)
		}
		TLog.Debug("popMapStack", saveData.mapId, saveData.cellX, saveData.cellY)
		if (!this.lockPopMap) {
			saveData.callBack.call(this, saveData.mapId, saveData.cellX, saveData.cellY)
		}

	}

	//-
	addPopMap(args) {
		var saveData = Queue_last(this.mapStackList)
		var heroId = GetHeroProperty("id")
		if (saveData && heroId == args.Id && args.Type == objectType.OBJECT_TYPE_PLAYER) {
			//saveData.mapId = saveData.mapId
			saveData.cellX = args.CellX
			saveData.cellY = args.CellY
			//saveData.callBack = this.loadMap
		}
		//Queue_push_first(this.mapStackList, saveData)
	}

	clearMapStack() {
		if (this.mapStackList) {

			//最后一个，就是真实地图ID
			var saveData = Queue_last(this.mapStackList)
			this.loadMap(saveData.mapId, saveData.cellX, saveData.cellY)

			this.mapStackList = null
			//UnRegisterEvent(EventDefine.HERO_RESET_POSITION, this.onHeroResetPosition, this)
		}
	}

	setPopMapLock(lock) {
		this.lockPopMap = lock
	}

	////////////////////////////////////////////////////////
	isPlayMode() {
		return this.mapStackList != null
	}


	enterMap(mapId: number, cellx: number, celly: number) {
		this.enterMapId = mapId
		if (this.compelTransMap(mapId, cellx, celly)) {
			return
		}

		FireEvent(EventDefine.HERO_ENTER_SERVERMAP, null)
		if (this.loadMap(mapId, cellx, celly)) {
		}
	}

	getEnterMapId() {
		return this.enterMapId
	}

	compelTransMap(mapId, cellx, celly) {
		if (this.mapStackList) {
			var saveData = Queue_last(this.mapStackList)
			if (saveData) {
				saveData.mapId = mapId
				saveData.cellX = cellx
				saveData.cellY = celly
				saveData.callBack = this.loadMap

				ClearCurActorStorage()
				return true
			}
		}

		return false
	}

	loadSky(mapId) {
		// if(MapSkyConfig[mapId] == null ){
		// 	var mapConfig = MapConfig[mapId]
		// 	if(mapConfig.skyFile && mapConfig.skyFile != "" ){
		// 		var skyFile = "resource\\data\\config\\Map\\"..mapConfig.skyFile
		// 		MapSkyConfig[mapId] = json.readFile(skyFile)
		// 	}

		// }

		// var skyInfo = MapSkyConfig[mapId]
		// if(skyInfo == null ){
		// 	return
		// }
		// this.mSceneMrg.loadSky(skyInfo)
	}


	playBackgourdMusic(mapId_) {

		if (FightSystem.getInstance().isFight()) {
			//return
		}

		var mapId = mapId_ || this.mapId

		var refMap = this.getMapRefProperty(mapId)
		if (refMap) {

			GameSound.getInstance().stopMusic()
			GameSound.getInstance().playMusic(refMap.music)
		}
	}

	clearScreenEffect() {
		// if(this.screenEffectList ){
		// 	for _, v in ipairs(this.screenEffectList) do
		// 		v:delete()
		// 	}
		// }
		// this.screenEffectList = {}
	}

	loadScreenEffect(mapConfig) {
		// this.clearScreenEffect()

		// if(mapConfig.effectBg != 0 ){
		// 	var effect = EffectManager.getInstance():createScreenEffect(mapConfig.effectBg, 0, 0, map.ICamera.eScreenLayer_Background)
		// 	table.insert(this.screenEffectList, effect)
		// }

		// if(mapConfig.effectFg != 0 ){
		// 	var effect = EffectManager.getInstance():createScreenEffect(mapConfig.effectFg, 0, 0, map.ICamera.eScreenLayer_Foreground)
		// 	table.insert(this.screenEffectList, effect)
		// }
	}

	loadMapFinish(mapid) {
		if (this.mapId != mapid) {
			return;
		}

		LookAtHero()
		FireEvent(EventDefine.HERO_ENTER_MAP, null)
		//this.onHeroMoveStop(null)
	}


	//只是负责初始化地图，没逻辑
	loadMapRaw(mapId: number, oldMapId: number) {
		var mapConfig = GameConfig.MapConfig[mapId]
		if (mapConfig == null) {
			return
		}

		var mapFile = mapConfig.mapFile
		mapFile = "data/map/" + mapFile;

		//加载地图
		this.mSceneMrg.loadMap(mapFile, this.loadMapFinish, this, mapId)
		//设置透视
		this.mSceneMrg.setPerspective(mapConfig.persp)
		//加载天空
		this.loadSky(mapId)

		//加载音乐
		GameSound.getInstance().unloadAllEffect()//卸载所有音响
		this.playBackgourdMusic(mapId)

		//地图的镜头特效
		this.loadScreenEffect(mapConfig)

		let config = GameConfig.MapConfig[oldMapId]
		if (config && (mapConfig.mapFile == config.mapFile) && (mapId != config.id)) {
			FireEvent(EventDefine.HERO_ENTER_MAP, null)
		}
	}

	loadMap(mapId: number, cellx: number, celly: number) {
		var mapConfig = GameConfig.MapConfig[mapId]
		if (mapConfig == null) {
			TLog.Error("loadMap MapConfig[%s] == null", mapId.toString())
			return false
		}

		//this.mSceneMrg.transitionScene(MapTransitionStyle.SPLITROWS)
		TLog.Warn("loadMap%d(%d, %d)", mapId, cellx, celly)
		var bLoad = (this.mapId != mapId)
		let lastMapId = this.mapId
		this.mapId = mapId

		var hero: Hero = GetHero()
		hero.moveStop()
		hero.setCellXY(cellx, celly)
		hero.updateFollowModelPos()

		// if(hero.mFollowPet ){
		// 	var cellX, cellY = hero.getCellXY()
		// 	hero.mFollowPet:moveStop()
		// 	hero.mFollowPet:setCellXY(cellX - 5, cellY - 5)
		// 	Log.Warning("loadPetMap (%d, %d)", hero.mFollowPet:getCellXY())
		// }

		//TLog.Debug("11111111",bLoad,mapId,this.mapId,bloading)

		if (bLoad) {
			//删除所有精灵
			ActorManager.getInstance().clearAll()
			//镜头绑定主角
			this.mSceneMrg.cameraLinkActor(hero)
			LookAtHero()
			//TeamSystem.getInstance():clearAllNearPlayer()
			//加载地图
			this.loadMapRaw(mapId, lastMapId)

			//gb.main.viewport:SetInputEnable(false)
			this._onChangeMap()
			//this.loadMapSurprise(mapId,cellx,cellY)
			//FireEvent(EventDefine.HERO_ENTER_MAP, null)
		}



		return bLoad
	}

	loadMapSurprise(mapId, cellx, cellY) {
		// if(RoleSystem.getInstance():isDoSurpriseEvent(mapId) && MapCampaignList && MapCampaignList[mapId] ){
		// 	var x = MapCampaignList[mapId]["surpriseX"] || 10
		// 	var y = MapCampaignList[mapId]["surpriseY"] || 10
		// 	var npcId = MapCampaignList[mapId]["surpriseID"]
		// 	var scope =  MapCampaignList[mapId]["scope"] || 5
		// 	//TLog.Debug("loadMapSurprise creat surprise",x, y, type(MapCampaignList[mapId]))

		// 	var npcInfo = {
		// 		["cellx"]	= x,
		// 		["celly"]	= y,
		// 		["classname"] = "NpcInfo",
		// 		["dir"] = 1,
		// 		["entryId"] = npcId,
		// 		["id"] = IsolationCharacterId.SupriseNpc,
		// 		["image"] = 0,
		// 		["name"] = "",
		// 		["param"]={
		// 		},
		// 		["taskInfo"]={
		// 		},
		// 	}			
		// 	//检查与玩家的位置
		// 	var npc = ActorManager.getInstance().createNpc(npcInfo)		
		// 	if(math_util:checkNormScope(cellx, cellx, x, y, scope) == false ){
		// 		npc:setVisible(false)
		// 	}
		// }
	}

	loadMovieMap(mapId, mapX, mapY) {
		if (this.mapId == mapId) {
			return
		}
		let lastMapId = this.mapId
		this.mapId = mapId

		var mapConfig = GameConfig.MapConfig[mapId]
		var mapFile = mapConfig.mapFile

		this.loadMapRaw(mapId, lastMapId)

		this.mSceneMrg.cameraUnLinkActor()
		this.mSceneMrg.setAdjustViewCenter(true)
		this.mSceneMrg.lookAtCenter(mapX + IGlobal.stageWidth / 2, mapY + IGlobal.stageHeight / 2)

	}

	getMapRefProperty(id) {
		return GameConfig.MapConfig[id]
	}

	getMapId() {
		return this.mapId
	}

	isGuanKaMap() {
		let config = GameConfig.MapEnterList
		for (let k in config) {
			let v = config[k]
			if (v.inMapId == this.mapId) {
				return true
			}
		}

		return false
	}

	getCurMapSize() {
		return this.getMapSize(this.getMapId());
	}


	getMapSize(mapId): any {
		if (GameConfig.MapConfig[mapId] == null) {
			TLog.Error("getMapSize MapConfig[%d] == null", mapId)
			return { w: 0, h: 0 }
		}
		var width: number = GameConfig.MapConfig[mapId].W;
		var height: number = GameConfig.MapConfig[mapId].H;
		return { w: width, h: height }
	}

	getMapName(mapId) {
		if (GameConfig.MapConfig[mapId] == null) {
			TLog.Error("getMapName MapConfig[%d] == null", mapId)
			return ""
		}

		return GameConfig.MapConfig[mapId].mapName
	}


	_findWayToGo(srcMapId, targetMapId, cellX, cellY) {
		this.find_trace_list = []
		this.trace_head = 0   //当前寻路的目标，在find_trace_list的指针头,每当切换地图时候加1

		this._find_flag = {}

		var bFind = false
		if (srcMapId == targetMapId) {
			bFind = true
		} else {
			bFind = this.findPath(srcMapId, targetMapId)
		}

		if (bFind == true) {
			var Ttable = MapJumpRecord.newObj(targetMapId, cellX, cellY, 0, "")
			this.find_trace_list.push(Ttable);

			TLog.Debug(">>>find way trace:")

			this.find_trace_list.forEach(traceRecord => {
				TLog.Debug(">>>", traceRecord.inMapId, traceRecord.x, traceRecord.y)
			})

			bFind = this._heroMoveByRecord(this.trace_head)

		}//} if

		this._find_flag = null

		return bFind
	}


	findPath(srcId: number, targetId: number): boolean {
		var queue: number[] = [];
		queue.push(srcId);

		var Path = {}
		Path[srcId] = Path[srcId] || {}
		Path[srcId][srcId] = true
		Path[targetId] = Path[targetId] || {}
		Path[targetId][targetId] = false

		var flag = {}

		while (queue.length != 0) { //广度搜索，得到路径
			//var fromId = table.remove(queue, 1)
			var fromId = queue.shift();

			if (!fromId || !GameConfig.MapLinkConfig[fromId]) {
				break
			}

			if (Path[targetId][targetId]) {
				break
			}

			//for _, record in ipairs(GameConfig.MapLinkConfig[fromId]) do
			for (var k in GameConfig.MapLinkConfig[fromId]) {
				var record = GameConfig.MapLinkConfig[fromId][k];
				var toId = record.inMapId
				if (toId != fromId && !flag[toId]) {
					flag[toId] = true
					//var Ttable = {["inMapId"] = record.outMapId,["x"] = record.outX,["y"] = record.outY, ["type"] = record.type, ["npcName"] = record.npcName} //记录跳出点，类型，NPC名字
					var Ttable = MapJumpRecord.newObj(record.outMapId, record.outX, record.outY, record.type, record.npcName, record.npcId)

					Path[toId] = Path[toId] || {}
					Path[toId][fromId] = Ttable
					queue.push(toId);

					//TLog.Debug("toId",toId, "fromId", fromId)
					if (toId == targetId) {
						Path[toId][toId] = true
						break
					}
				}
			}
		}

		var hasFind = false
		if (Path[targetId][targetId]) {//可以到达路径
			if (this.getPath(srcId, targetId, Path)) {
				var list = this.find_trace_list

				var len = list.length;
				for (var i = 0; i < len / 2; i++) {
					var t = list[i]
					list[i] = list[len - i + 1]
					list[len - i + 1] = t
				}
			}

			hasFind = true
		}

		TLog.Debug("FindWayTOGo:", hasFind)
		Path = null
		return hasFind
	}

	getPath(srcId: number, targetId: number, Path: any) {
		TLog.Debug("getPath", srcId, targetId)
		this._find_flag[targetId] = true

		if (srcId == targetId) {
			return true
		}

		if (Path[targetId]) {
			//for fromId in pairs(Path[targetId]) do
			for (var fromId_ in Path[targetId]) {
				var fromId = tonumber(fromId);
				if (this._find_flag[fromId] == null) {
					if (fromId != targetId) {
						this.find_trace_list.push(Path[targetId][fromId])//插入路径

						var find = this.getPath(srcId, fromId, Path)
						if (find) {
							return true
						}
						this.find_trace_list.pop();
					}
				}
			}
		}

		return false
	}

	findWayToGo(targetMapId, cellX, cellY) {
		var srcMapId = this.getMapId()
		if (this._findWayToGo(srcMapId, targetMapId, cellX, cellY)) {
			this.setFindWay(true)
			return true
		}
		return false
	}

	//寻路
	setFindWay(bFind) {
		if (this.bFindWay != bFind) {
			this.bFindWay = bFind
			if (this.bFindWay == false) {
				this.find_trace_list = []
				this.trace_head = 0
			}
			FireEvent(EventDefine.HERO_FINDWAY_CHANGE, null)
		}
	}

	isFindWay() {
		return this.bFindWay
	}

	//自动行走

	setAutoRun(bAutoRun: boolean) {
		if (this.bAutoRun != bAutoRun) {
			this.bAutoRun = bAutoRun
			FireEvent(EventDefine.HERO_AUTORUN_CHANGE, null)
		}
	}

	isAutoRun() {
		return this.bAutoRun
	}
	////////////////////////////////////////////////////////////////////////////////

	checkCanJumpMap() {
		if (this.isAutoRun()) {
			return false
		}
		return true
	}

	onLinkJump(record) {

		//GetHero().sendMoveMessage()

		var message = GetMessage(opCodes.C2G_MAP_ENTER)
		message.index = record.index
		SendGameMessage(message)
	}

	onNpcJump(record) {
		TLog.Debug("onNpcJump is here!", record.npcId, record.npcName)
		var npc = ActorManager.getInstance().getNpcWithEntryId(record.npcId)
		if (!npc) {
			return
		}

		Task_ShowNpcDialogWithNpc(npc.getId())
	}

	checkJumpRecordScope(record, heroCellX, heroCellY) {
		return (heroCellX >= record.outX - record.W) && (heroCellX <= record.outX + record.W) && (heroCellY >= record.outY - record.H) && (heroCellY <= record.outY + record.H)
	}


	_heroMoveByRecord(index) {
		var record = this.find_trace_list[index]
		if (record == null) {
			TLog.Error("_heroMoveByRecord %d", index)
		}

		if (record.type == 1) {
			return GetHero().wantToGoByCell(GameConfig.npcConfig[record.npcId].x, GameConfig.npcConfig[record.npcId].y)
		}
		return GetHero().wantToGoByCell(record.x, record.y)//主角移动
	}

	// onHeroMoveStop(args) {
	// 	// var campaignInfo = MapCampaignList[this.mapId]  
	// 	 if(CommandManager.getInstance().isCommandQueueEmpty() == false ){
	// 	 	return
	// 	 }

	// 	 if (this.autoState != false) {
	// 	 	Command_AutoRun()
	// 	 }
	// 	// var hero = GetHero()
	// 	// var heroCellX, heroCellY = hero.getCellXY()
	// 	// if(heroCellX < campaignInfo.x || heroCellX > campaignInfo.x + campaignInfo.w || heroCellY < campaignInfo.y || heroCellY > campaignInfo.y + campaignInfo.h ){
	// 	// 	return
	// 	// }

	// 	// //打开关卡界面
	// 	// //CampaignSystem.getInstance():setCurMap(this.mapId)
	// 	// var chapterId = WngMrg.getInstance():getWindow("FunTipsFrame"):getOpenChapterId()
	// 	// WngMrg.getInstance():getWindow("CopyCardFrame"):showCopyCard(this.mapId,chapterId)
	// 	// GameSound.getInstance().playEffect(SystemSound.effect_transPoint)

	// }

	onCheckAutoState(dt) {
		if (this.autoState == false)
			return;
		if (FightSystem.getInstance().isFight() == true)
			return;

		// if(CommandManager.getInstance().isCommandQueueEmpty() == false ){
		// 	return;
		// }

		let hero: Hero = GetHero()
		if (hero.isState(characterState.actionState_idle)) {
			Command_AutoRun()
		}
	}


	setAutoState(b: boolean) {
		if (b != this.autoState) {
			this.autoState = b

			if (b == false) {
				if (this.autoStateTimer) {
					KillTimer(this.autoStateTimer)
					this.autoStateTimer = null;
				}
				Command_MoveStop()
			} else {
				if (this.autoStateTimer == null) {
					this.autoStateTimer = SetTimer(this.onCheckAutoState, this, 2000);
				}
				Command_AutoRun()
			}
		}

	}

	getAutoState() {
		return this.autoState
	}

	_onChangeMap() {
		//处理主角移动
		//TLog.Debug("_onChangeMap gb.main.viewport:SetInputEnable true")
		//gb.main.viewport:SetInputEnable(true)
		GetHero().moveStop()

		let fightSystem: FightSystem = FightSystem.getInstance()//跳地图前，清空之前的战斗
		if (fightSystem.isFight() == true) {
			FightSystem.getInstance().clearUpFightState()
		}
		this.onCheckAutoState(0)

		if (this.find_trace_list != null && this.find_trace_list.length != 0 && this.trace_head != -1) {
			if (this.trace_head >= this.find_trace_list.length) {
				this.find_trace_list = null
				this.trace_head = -1
			} else {

				var flag = false
				for (var i = 0; i < this.find_trace_list.length; i++) {
					var record = this.find_trace_list[i];
					if (i > this.trace_head) {								//只处理下一个跳转节点
						this.trace_head = i
						if (record.inMapId == this.mapId) {		//跳入寻路路径的节点地图
							flag = true
							break
						}
					}
				}

				if (flag) { //通过NPC跳转，到不同与搜索的地图时候
					//	this.heroStop()
					//}else{				

					this._heroMoveByRecord(this.trace_head)
				}

			}
		}

		//重置跳转标志位
		this.lastJumpRecord = null

		//创建传送点
		this.createTransport()
	}

	clearTransport() {
		// if(this.transportList ){
		// 	var transport = table.remove(this.transportList)
		// 	while transport != null do		
		// 		transport:delete()
		// 		transport = table.remove(this.transportList)
		// 	}
		// }

		if (this.transportList) {
			this.transportList.length = 0;
		}

	}

	createTransport() {
		this.clearTransport()

		//print_r(MapCampaignList)
		// var campaignInfo = MapCampaignList[this.mapId] 
		// if(campaignInfo == null ){
		// 	return
		// }
		// var centerX = campaignInfo.x + campaignInfo.w / 2
		// var centerY = campaignInfo.y + campaignInfo.h / 2
		// TLog.Debug("createTransport", this.getMapId(), centerX, centerY)

		// var effect = EffectManager.getInstance():createSceneEffect(campaignInfo.transport, centerX, centerY, false)
		// effect:changeBottomMapLayer()
		// table.insert(this.transportList, effect)

	}




	getMapConfigTipsList(level) {
		// var list = {}
		// for i, v in pairs(MapTipsConfig) do
		// 	if(v.lowLevel<=level && v.highLevel>=level ){
		// 		table.insert(list, v)
		// 	}
		// }
		// return list
	}


	// getAutoWayFinishPoint() {
	// 	if (this.find_trace_list && this.find_trace_list[this.trace_head]) {
	// 		var elem = this.find_trace_list[this.trace_head]
	// 		return elem.inMapId, elem.x, elem.y
	// 	} else {
	// 		return null, null, null
	// 	}
	// }

	onMovieBegin(args) {
		this.clearTransport()
	}

	onMovieEnd(args) {
		this.createTransport()
	}


	onStateActive(args: StateEvent) {
		if (args.stateType == state_type.COMBAT_BASE_STATE) {
			this.clearTransport()
		} else if (args.stateType == state_type.LIVE_BASE_STATE) {
			this.createTransport()
		}

		if (args.stateType == state_type.LIVE_BASE_STATE) { 	 //生活场景
			ChangePatrolState(true)
		} else if (args.stateType != state_type.COMBAT_BASE_STATE) {
			ChangePatrolState(false)
		}
	}



	resetHeroPosition(cellX, cellY) {

		//检查是不是在玩法地图内
		//如果当前是单人玩法地图，则保存信息等待回到真正地图才重置
		//如果当前是多人玩法地图，就马上重置位置
		var bHandleReset = true
		if (this.mapStackList) {

			if (GetHero().isAloneMode()) {
				bHandleReset = false
				var enterMapData = Queue_last(this.mapStackList)
				enterMapData.cellX = cellX
				enterMapData.cellY = cellY
			}

		}

		if (bHandleReset) {
			var hero = GetHero()
			Command_MoveStop();
			hero.setCellXY(cellX, cellY)
			hero.updateFollowModelPos()
			LookAtHero()
			FireEvent(EventDefine.HERO_RESET_POSITION, ActorEvent.createObj(hero))
		}
	}

	getMapEnterCellXY(mapId, defaultX, defaultY) {
		defaultX = defaultX || 0
		defaultY = defaultY || 0

		for (let _ in GameConfig.MapEnterList) {
			let config = GameConfig.MapEnterList[_]

			if (config.inMapId == mapId) {
				return newPos(config.inX, config.inY)
			}
		}

		return newPos(defaultX, defaultY)
	}


	getMapIndex(mapId) {
		for (let _ in GameConfig.MapEnterList) {
			let config = GameConfig.MapEnterList[_]

			if (config.inMapId == mapId) {
				return config.index
			}
		}
		return 0
	}

}