/*
作者:
    lintianfeng
	
创建时间：
   2013.10.26(周六)

意图：
	 电影表演系统   

公共接口：
   
*/
/*
let movieActionType: any = {
	["LoadMap"]: Movie_LoadMap,
	["PlaySound"]: Movie_PlaySound,
	["MoveCamera"]: Movie_MoveCamera,
	["CreateEffect"]: Movie_CreateEffect,
	["CreatePlayer"]: Movie_CreatePlayer,
	["CreatePlayerEffect"]: Movie_CreatePlayerEffect,
	["DeleteEffect"]: Movie_DeleteEffect,
	["DeletePlayer"]: Movie_DeletePlayer,
	["DeletePlayerEffect"]: Movie_DeletePlayerEffect,

	["Fight"]: Movie_Fight,
	["MovePlayer"]: Movie_MovePlayer,

	["ChangeAction"]: Movie_ChangeAction,

	["AddFightResult"]: Movie_AddFightResult,

	["Say"]: Movie_Say,

	["SetPlayerXY"]: Movie_SetPlayerXY,
	["ShakeMap"]: Movie_ShakeMap,
	["ShowImage"]: Movie_ShowImage,
	["Speak"]: Movie_Speak,
	["VisiblePlayer"]: Movie_VisiblePlayer,
	["WaitTime"]: Movie_WaitTime,
	["OpenTask"]: Movie_openTask,

	["FullBlack"]: Movie_FullBlack,
	//["HideImage"]: Movie_HideImage,
	["StopSound"]: Movie_StopSound,
	["AddFightPlayer"]: Movie_AddFightPlayer,
	//["preAddResource"]: Movie_preAddRes,
	["playFrameAnimation"]: Movie_PlayFrameAnimation,

	// ["GoddessKiss"]: Movie_GoddessKiss,
	// ["PlayVideo"]: Movie_PlayVideo,
}

let MOVIE_ACTION_PRIORITY: any = {	   //动作优先级
	//["preAddResource"]: 100,
	["LoadMap"]: 80,
	["CreateEffect"]: 60,
	["CreatePlayer"]: 60,
	["CreatePlayerEffect"]: 60,
	["FullBlack"]: 100,
}


let START_MOVIE_NAME = "Movie0"
let START_MOVIE_NAME_VIDEO = "MovieVideo0"

class MovieSystem extends BaseSystem {
	repeatableMovie: any;
	taskNoTick: any;
	curStoryState: number;
	fastEndWnd: any;
	isfastEnd: boolean;
	timerId: any;

	movie_show: any[];


	movieEnding: boolean;
	movieFile: string;
	movieIndex: number;
	playingMovie: boolean;
	bSkip: boolean;
	played_movie_list: any[];
	skippAble: boolean;



	callBackFunc: Function;
	callBackObj: any;
	callBackArgs: any;

	player_list: any;
	effectList
	playerEffectList

	movieBalckSide

	public initObj(...args: any[]): void {
		this.onClear()
		this.repeatableMovie = {}
		this.taskNoTick = null
		this.curStoryState = state_type.LIVE_STORY_STATE
		RegisterEvent(EventDefine.NPC_ENTER_MAP, this.playerEnterMap, this)
		RegisterEvent(EventDefine.PLAYER_ENTER_MAP, this.playerEnterMap, this)
		//RegisterEvent(EventDefine.HERO_MOVE, this.onHeroMove, this)
		//RegisterEvent(EventDefine.COMBAT_BEGIN, this.onCombatBegin, this)
		this.fastEndWnd = null
		this.isfastEnd = null

		//this.checkFileMoiveElem()
	}

	destory() {
		this.onClear()
	}

	onClear() {
		if (this.timerId) {
			KillTimer(this.timerId)
			this.timerId = null
		}
		if (this.movie_show) {
			for (let i in this.movie_show) {
				let v = this.movie_show[i]

				for (let n in v) {
					let elem = v[n]

					elem.deleteObj()
				}
			}
		}
		this.movie_show = []// 某个序号下动画的集合

		this.clearPlayerEffect()
		this.clearEffect()

		this.movieEnding = true
		this.deleteAllPlayer()
		this.movieEnding = false

		this.movieFile = null// 读取动画配置表文件名
		this.movieIndex = 0// 当前播放的动画序号
		this.playingMovie = false// 判断剧情是否在播放中
		this.bSkip = false// 是否在跳过剧情，如果是，则不可播放剧情，防止出现未知问题
		this.played_movie_list = []

		this.skippAble = true
		this.taskNoTick = false

		//this.getMovieBlackSide().hideWnd() 
	}



	//准备资源，把自己的workunit加载队列里
	prepareResource(workQueue) {
		// workQueue.addWorkUnit(createClosureWorkUnit( function(this)
		// 													//MapPlayMovie = readCSV("data\\config\\Movie\\MapPlayMovie.csv")
		// 													VideoManager.getInstance().onPrepareResource()
		// 													if(VideoManager.getInstance().isSupportVideo("gougou") == false ){
		// 														START_MOVIE_NAME = "Movie0"
		// 													}else{
		// 														START_MOVIE_NAME = "MovieVideo0"
		// 													}
		// 												}, this) 
		// 											)


	}

	// 获取电影表单
	getMoveCSV(strFile, callback: Function) {
		let elem = this.repeatableMovie[strFile]
		if (typeof elem == "object") {
			callback.call(this, strFile, elem)
		} else {

			let _this = this;
			let bRepeat = false;
			if (!this.repeatableMovie[strFile]) {

			} else if (this.repeatableMovie[strFile] == true) {
				bRepeat = true
			}

			var resCallback: core.ResItemCallback = {
				onResItemLoad: (res: core.ResItem): void => {
					let moveFile = readCSV(res.getData())


					let elem = [moveFile, bRepeat]
					_this.repeatableMovie[strFile] = elem
					callback.call(_this, strFile, elem)
				},
				onResItemError: (key: string): void => {

				}
			}

			let str = String.format("data\\config\\Movie\\%s.csv", strFile)
			IGlobal.resManager.loadResAsyn(str, resCallback, core.ResourceType.TYPE_TEXT);
		}

		// if (!this.repeatableMovie[strFile]) {
		// 	let str = String.format("data\\config\\Movie\\%s.csv", strFile)
		// 	let moveFile = readCSV(str) || {}
		// 	let elem = [moveFile, false]
		// 	this.repeatableMovie[strFile] = elem
		// 	return elem
		// } else if (this.repeatableMovie[strFile] == true) {
		// 	let str = String.format("data\\config\\Movie\\%s.csv", strFile)
		// 	let moveFile = readCSV(str) || {}
		// 	let elem: any = [moveFile, true]
		// 	this.repeatableMovie[strFile] = elem
		// 	return elem
		// } else {
		// 	return this.repeatableMovie[strFile]
		// }
	}


	_beginPlayCallback(movieFile, elem) {

		let movieCSV = elem[0]
		if (size_t(movieCSV) == 0) {
			TLog.Error("the %s Movie id null !!!!!!!", movieFile)
			return false
		}

		this.movieFile = movieFile
		//let msg = GetMessage(opCodes.C2G_ROLE_VIDEO)
		//SendGameMessage(msg)
		PushUIShow()
		PushActorStorage()
		FireEvent(EventDefine.MOVIE_BEGIN, MovieEvent.newObj(this.movieFile))
		//FireEvent(EventDefine.PRECEDURE_DEACTIVE, PrecedureEvent.newObj(PRECEDURE_GAME))
		PushMapShow()
		this.playingMovie = true
		// 电影开始的一些操作
		if (StateManager.getInstance().GetCurrentStateType() == state_type.LIVE_BASE_STATE) {
			this.curStoryState = state_type.LIVE_STORY_STATE
		} else if (StateManager.getInstance().GetCurrentStateType() == state_type.COMBAT_BASE_STATE) {
			this.curStoryState = state_type.COMBAT_STORY_STATE
			this.initFightPlayerList()
		}
		// 保存地图信息
		//this.saveData = {}
		//this.saveData.mapId = MapSystem.getInstance().getMapId()	
		//this.saveData.cellX,this.saveData.cellY = GetHero().getCellXY()
		//TLog.Debug("save mapId",this.saveData.mapId)
		StateManager.getInstance().ActiveSubState(this.curStoryState)

		// 开始停止镜头绑定      
		GetHero().moveStop()
		SceneManager.getInstance().cameraUnLinkActor()
		this.hideAllPeople()
		//SceneManager.getInstance().transitionScene(MapTransitionStyle.FADEOUTDOWN_TILES)
		SceneManager.getInstance().setMaskEnable(false)


		movieCSV = this.sortMoiveAction(movieCSV)
		this.movie_show = this.getAnimeListByCSV(movieCSV)
		//TLog.Debug(this.movie_show)
		//io.read()
		this.getAllImageNameAndLoad(this.movie_show)
		this.setNext()
		if (this.timerId == null) {
			this.timerId = SetTimer(this.tick, this, 0)
		}

		//音量 
		GameSound.getInstance().setMusicVolume(1)
		GameSound.getInstance().setEffectVolume(1)
		GameSound.getInstance().resetEffect()
		//let window = WngMrg.getInstance().getWindow("MovieDramaFrame")
		//window.showWnd()
		return true
	}

	// 开始播放电影
	beginPlay(movieFile) {
		TLog.Debug("MovieSystem.beginPlay", movieFile)
		// 判断是否在播放剧情，是则返回
		if (this.playingMovie || !movieFile || movieFile == "") {
			TLog.Error("MovieSystem is Playing!!!!!!!")
			return false
		}
		// 判断是否已播放过了，播放过了，就不再播放了
		let bFind = table_isExist(this.played_movie_list, movieFile)
		if (bFind) {
			TLog.Error("the %s Movie is Played!!!!!!!", movieFile)
			//return
		}

		// 读取配置表
		this.getMoveCSV(movieFile, this._beginPlayCallback)


	}

	getAllImageNameAndLoad(moive) {
		let imageNameList = []
		for (let _i in moive) {
			let _v = moive[_i]

			for (let _j in _v) {
				let _info = _v[_j]

				if (_info.classname == "Movie_ShowImage" && _info.imageName) {
					JsUtil.arrayInstert(imageNameList, _info.imageName)
				}
			}
		}
		for (let _i in imageNameList) {
			let _image = imageNameList[_i]

			//image_set.preLoadImage(_image)
		}
	}


	sortMoiveAction(movieElem) {
		let elemList = []

		for (let _i in movieElem) {
			let _v = movieElem[_i]

			//TLog.Debug("aaa~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~aa")
			JsUtil.arrayInstert(elemList, _v)
		}
		//TLog.Debug(movieElem)
		//TLog.Debug(elemList)	
		//io.read()
		table_sort(elemList, function (t1, t2) {
			//TLog.Debug("~~~~~~~~~~~~~~~~~~~~")
			//TLog.Debug(t1)
			//io.read()
			//TLog.Debug(t2)
			if (t1.ActionIndex != t2.ActionIndex) {
				return t1.ActionIndex - t2.ActionIndex
			} else {
				//优先级越大，越靠前
				let p1 = MOVIE_ACTION_PRIORITY[t1.Action] || 0
				let p2 = MOVIE_ACTION_PRIORITY[t2.Action] || 0
				return p2 - p1
			}

		})

		//TLog.Debug("aaa~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~aa")	
		//TLog.Debug(elemList)
		//io.read()
		//io.read()
		return elemList
	}

	// 停止播放电影
	endPlay() {
		if (this.playingMovie == false) {
			return
		}

		this.movieEnding = true
		TLog.Debug("MovieSystem.endPlay")
		if (this.timerId) {
			KillTimer(this.timerId)
			this.timerId = null
		}

		for (let i in this.movie_show) {
			let v = this.movie_show[i]

			for (let n in v) {
				let elem = v[n]

				elem.finish()
				elem.deleteObj()
			}
		}
		if (this.movieFile && this.repeatableMovie[this.movieFile][1] == false) {
			JsUtil.arrayInstert(this.played_movie_list, this.movieFile)
		}

		this.clearPlayerEffect()
		this.clearEffect()
		this.deleteAllPlayer()
		StateManager.getInstance().DeactiveSubState(this.curStoryState)
		this.movieIndex = 0
		let movie = this.movieFile
		this.movieFile = null
		this.movie_show = []
		this.player_list = {}
		this.effectList = {}
		this.isfastEnd = null
		// 还原原有的操作
		//if(this.saveData ){
		//	MapSystem.getInstance().loadMovieMap(this.saveData.mapId,this.saveData.cellX,this.saveData.cellY)
		//	//MapSystem.getInstance().loadMap(this.saveData.mapId,1,1)
		//	MapSystem.getInstance().playBackgourdMusic()
		//	let hero = GetHero()
		//	hero.moveStop()
		//	hero.setCellXY(this.saveData.cellX,this.saveData.cellY)
		//	this.saveData	=null
		//}

		CollectGarbage()

		let mapPos = GetHero().getMapXY()
		SceneManager.getInstance().lookAtCenter(mapPos.x, mapPos.y)
		SceneManager.getInstance().cameraLinkActor(GetHero())
		SceneManager.getInstance().setMaskEnable(true)

		//SceneManager.getInstance().transitionScene(MapTransitionStyle.FADEOUTDOWN_TILES)
		//FireEvent(EventDefine.PRECEDURE_ACTIVE, PrecedureEvent.newObj(PRECEDURE_GAME))

		//if(this.curStoryState == state_type.COMBAT_STORY_STATE ){
		//	let message = GetMessage(opCodes.C2G_FIGHT_RESTART)
		//	return SendGameMessage(message)
		//}
		//io.read()
		PopUIShow()
		PopMapShow()
		PopActorStorage()
		this.playingMovie = false
		this.taskNoTick = false

		LookAtHero()
		this.showAllPeople()

		if(FightSystem.getInstance().isFight())
			SceneManager.getInstance().cameraUnLinkActor()

		this.skippAble = true
		FireEvent(EventDefine.MOVIE_END, MovieEvent.newObj(movie))

		if (this.callBackFunc) {
			this.callBackFunc.call(this.callBackObj, this.callBackArgs)
			this.callBackFunc = null
			this.callBackObj = null
			this.callBackArgs = null
		}
		if (GAME_MODE == GAME_NORMAL) {
			IGlobal.setting.setRoleSetting(UserSetting.TYPE_NUMBER, movie, 1)

		}
		if (movie == START_MOVIE_NAME) {
			let blackFrame = WngMrg.getInstance().getWindow("FullBalckFrame")
			blackFrame.setWindowTYpe()
			blackFrame.showWnd()
			if (GAME_MODE == GAME_NORMAL) {

				let hideCallback = function () {
					UnRegisterEvent(EventDefine.HERO_ENTER_GAME, hideCallback, this)
					let blackFrame = WngMrg.getInstance().getWindow("FullBalckFrame")
					blackFrame.playChangeHide(500)
				}
				RegisterEvent(EventDefine.HERO_ENTER_GAME, hideCallback, this)
			} else {
				blackFrame.playChangeHide(500)
			}
		} else {
			//TLog.Debug("show full black",movie)
			if (!FightSystem.getInstance().isFight()) {

				let blackFrame = WngMrg.getInstance().getWindow("FullBalckFrame")
				blackFrame.setWindowTYpe()
				blackFrame.showWnd()
				let hideTimer = -1
				let hideCallback = function (dt) {

					if (hideTimer) {
						KillTimer(hideTimer)
						let blackFrame = WngMrg.getInstance().getWindow("FullBalckFrame")
						blackFrame.playChangeHide(500)
						hideTimer = null
					}
				}
				hideTimer = SetTimer(hideCallback, this, 500)
			}
		}
		//音量
		GameSound.getInstance().setMusicVolume(1)
		GameSound.getInstance().setEffectVolume(1)
		GameSound.getInstance().resetEffect()
		this.movieEnding = false
		//LuaCollectGarbage()
	}


	// 电影播放帧
	tick(delay) {

		if (this.bSkip) {
			return
		}

		if (this.taskNoTick) {
			return
		}
		if (this.isfastEnd) {
			let elemCount = this.movie_show.length
			let endType = "normal"

			elemCount = 0
			for (let _i = 0; _i < this.movie_show.length; _i++) {
				let _v = this.movie_show[_i]

				if (_i > elemCount) {
					elemCount = _i
				}
			}
			//TLog.Debug("this.isfastEnd",size_t(this.movie_show[elemCount]),elemCount)
			//TLog.Debug(this.movie_show)
			//io.read()
			if (this.movie_show[elemCount] && size_t(this.movie_show[elemCount]) > 0) {
				//TLog.Debug(this.movie_show[elemCount])
				//io.read()
				for (let i in this.movie_show[elemCount]) {
					let v = this.movie_show[elemCount][i]
					//有repeat
					if (v.classname == "Movie_openTask") {
						endType = "openTask"
						break
					}
				}
			}

			if (this.movie_show[this.movieIndex] && size_t(this.movie_show[this.movieIndex]) > 0) {
				let bFinish = true
				let isFight = false
				for (let i in this.movie_show[this.movieIndex]) {
					let v = this.movie_show[this.movieIndex][i]
					//有repeat
					if (v.classname == "Movie_Fight") {
						isFight = true
					}
					bFinish = v.isFinish() && bFinish
					if (!v.isFinish()) {
						v.tick(delay)
					}
				}
				//TLog.Debug("}",isFight,bFinish,endType)
				if (isFight && bFinish) {
					if (endType == "normal") {
						this.fastEndNormal()
					} else if (endType == "openTask") {
						this.fastEndOpenTask()
					}
				} else if (!isFight) {
					if (endType == "normal") {
						this.fastEndNormal()
					} else if (endType == "openTask") {
						this.fastEndOpenTask()
					}
				}
			} else {
				this.endPlay()
			}

		} else {
			// 判断当前的剧情可否播放，否则完成剧情	
			if (this.movie_show[this.movieIndex] && size_t(this.movie_show[this.movieIndex]) > 0) {
				let bFinish = true
				for (let i in this.movie_show[this.movieIndex]) {
					let v = this.movie_show[this.movieIndex][i]
					//有repeat
					bFinish = v.isFinish() && bFinish
					if (!v.isFinish()) {
						v.tick(delay)
					}
				}
				if (bFinish) {
					//TLog.Debug("movie index",this.movieIndex)
					this.setNext()
				}
			} else {
				this.endPlay()
			}
		}
	}

	setNext() {
		this.movieIndex = this.movieIndex + 1
		let count = this.movie_show.length

		for (let i = this.movieIndex; i < count; i++) {
			if (this.movie_show[i]) {
				this.movieIndex = i
				return this.launchElem()
			}
		}
	}

	launchElem() {
		let actionList = this.movie_show[this.movieIndex]
		if (actionList) {
			for (let i in actionList) {
				let v = actionList[i]

				v.begin()
			}
		}
	}

	getAnime(actionName) {
		return movieActionType[actionName]
	}

	getAnimeListByCSV(movieCSV) {
		let movie = []
		for (let i in movieCSV) {
			let v = movieCSV[i]

			let index = v.ActionIndex
			for (let i = 1; i <= v.Repeat; i++) {
				let Anime = this.getAnime(v.Action)
				if (Anime) {
					let action = Anime.newObj(v.Param)
					if (movie[index] == null) {
						movie[index] = []
					}
					JsUtil.arrayInstert(movie[index], action)
				}
			}
		}
		//TLog.Debug(movie)
		//io.read()
		//let sortList = this.sortAnimeList(movie)
		//return sortList
		return movie
	}

	//重新排序动作
	sortAnimeList(list) {
		let temp = []
		for (let i in list) {
			let v = list[i]

			JsUtil.arrayInstert(temp, i)
		}
		table_sort(temp, function (a, b) {
			return (a - b)
		})
		let sortList: any = {}

		for (let i = 0; i < temp.length; i++) {
			let v = temp[i]

			JsUtil.arrayInstert(sortList, list[v])
		}
		return sortList
	}


	initFightPlayerList() {
		let actorList = FightSystem.getInstance().getActorSystem().getActorList()
		for (let id in actorList) {
			let actor = actorList[id]

			let side = actor.getSide()
			let pos = actor.getPos()

			if (!this.player_list[side + "_" + pos]) {
				actor.enterMovie()
				//TLog.Debug("initFightPlayerList",side,pos)
				//actor.setVisible(false)
				this.player_list[side + "_" + pos] = actor
			}
		}
	}

	// 创建角色
	createPlayer(info, cellX, cellY) {
		let player_id = info.id
		let playerObject = this.player_list[player_id] || Player.newObj()

		let mapPos = SceneManager.getInstance().screenXYtoMapXY(cellX, cellY)
		playerObject.setMapXY(mapPos.x, mapPos.y)
		playerObject.setPropertyInfo(info)
		if (info.body < 20) {
			playerObject.loadModel(GetPlayerModelByBody(info.body))
		} else {
			playerObject.loadModel(info.body)
		}
		playerObject.setDir(info.dir)
		//playerObject.doCommand(ActorCommand.SetNameColor, gui.Color[info.nameColor])
		playerObject.doCommand(ActorCommand.SetNameColor, "white")
		playerObject.doCommand(ActorCommand.SetName, info.name)
		playerObject.enterMap()
		this.player_list[player_id] = playerObject
		//TLog.Debug("createPlayer",player_id)
	}


	deletePlayer(id) {
		//TLog.Debug("deletePlayer",id)
		let playerObject = this.player_list[id]
		if (playerObject) {
			if (playerObject.classname == "FightActor") {
				let info = playerObject.getPropertyInfo()
				playerObject.setHP(info.hp, info.maxHp)
				if (!this.movieEnding) {
					playerObject.setVisible(false)
				}
			} else {
				playerObject.deleteObj()
			}
		} else {
			TLog.Error("MovieSystem.removePlayer %s", tostring(id))
		}

		delete this.player_list[id]
	}

	deleteAllPlayer() {




		//TLog.Debug("deleteAllPlayer")
		if (this.player_list) {
			let removeList = []
			for (let k in this.player_list) {
				removeList.push(k)
			}

			for (let i = 0; i < removeList.length; i++) {
				this.deletePlayer(removeList[i])
			}
		}
		this.player_list = {}

		//恢复战斗系统中的角色列表
		if (FightSystem.getInstance().isFight() == true) {
			FightSystem.getInstance().refreshPlayList()
		}
	}

	hideAllPlayer() {
		for (let i in this.player_list) {
			let v = this.player_list[i]

			if (v) {
				//TLog.Debug("hide player",i)
				v.setVisible(false)
			}
		}
	}

	showAllPlayer() {
		for (let i in this.player_list) {
			let v = this.player_list[i]

			if (v) {
				//TLog.Debug("show player",i)
				v.setVisible(true)
			}
		}
	}

	getPlayer(id) {
		return this.player_list[id]
	}

	getPlayerList(id) {
		return this.player_list
	}


	// 判断是否在播放movie
	isPlayingMovie() {
		return [this.playingMovie, this.movieFile]
	}


	// 创建特效
	createEffect(effectId, x, y, once, id) {
		let effect = EffectManager.getInstance().createSceneEffect(effectId, x, y, once)
		// 一次性特效不保存
		if (!once) {
			this.effectList[id] = effect
		}
		return effect
	}

	getEffect(id) {
		return this.effectList[id]
	}

	getEffectList() {
		return this.effectList
	}

	removeEffect(id) {
		//TLog.Debug("MovieSystem.removeEffect")
		let effect = this.effectList[id]
		if (effect) {
			effect.deleteObj()
			delete this.effectList[id]
		}
	}

	clearEffect() {
		if (this.effectList) {
			let removeList = []
			for (let k in this.effectList) {
				removeList.push(k)
			}

			for (let i = 0; i < removeList.length; i++) {
				this.removeEffect(removeList[i])
			}
		}

		this.effectList = {}
	}

	updateEffect(id, effect) {
		this.effectList[id] = effect
	}

	hideAllEffect() {
		for (let i in this.effectList) {
			let v = this.effectList[i]

			if (v) {
				v.setVisible(false)
			}
		}
	}

	showAllEffect() {
		for (let i in this.effectList) {
			let v = this.effectList[i]

			if (v) {
				v.setVisible(true)
			}
		}
	}

	// 电影开始隐藏界面所有动物
	hideAllPeople() {
		//let playerList = ActorManager.getInstance().getPlayerList()
		//for(let i in playerList){
		//let v = playerList[i]
		//
		//	if(v ){
		//		v.setVisible(false)
		//	}
		//}
		ActorManager.getInstance().hideAllPlayer()

		let npcList = ActorManager.getInstance().getNpcList()
		for (let i in npcList) {
			let v = npcList[i]

			if (v) {
				v.setVisible(false)
			}
		}
		// 停止角色移动
		GetHero().moveStop()
		GetHero().setVisible(false)
	}

	// 电影结束显示界面所有动物
	showAllPeople() {
		if (this.curStoryState == state_type.COMBAT_STORY_STATE) {
			return
		}

		//let playerList = ActorManager.getInstance().getPlayerList()
		//for(let i in playerList){
		//let v = playerList[i]
		//
		//	if(v ){
		//		v.setVisible(true)
		//	}
		//}
		ActorManager.getInstance().showAllPlayer()

		let npcList = ActorManager.getInstance().getNpcList()
		for (let i in npcList) {
			let v = npcList[i]

			if (v) {
				v.setVisible(true)
				TLog.Debug("show npc", v.getProperty("entryId"), v.getProperty("id"))
			}
		}
		// 停止角色移动
		GetHero().setVisible(true)
	}

	playerEnterMap(args) {
		if (this.playingMovie) {
			args.actor.setVisible(false)
		}
	}

	onHeroMove(args) {
		// if (this.isPlayingMovie()) {
		// 	return
		// }
		// let hero = GetHero()

		// let heroPos = hero.getCellXY()
		// let taskList = TaskSystem.getInstance().getTaskList()
		// let mapId = MapSystem.getInstance().getMapId()
		// let taskId_list = []
		// for (let i in taskList) {
		// 	let task = taskList[i]

		// 	JsUtil.arrayInstert(taskId_list, task.getId())
		// }
	}

	// 跳过剧情表演，直接进入战斗
	skipMovie() {
		if (!this.playingMovie || !this.timerId || this.skippAble == false) {
			return
		}
		this.bSkip = true
		this.movieIndex = this.movie_show.length
		this.launchElem()

		this.bSkip = false
	}

	skipNextElem() {
		// 如果在跳过状态，则不设置
		if (this.bSkip || this.skippAble == false) {
			return
		}
		this.bSkip = true
		if (!this.playingMovie && !this.timerId) {
			return
		}
		if (this.movie_show[this.movieIndex] && size_t(this.movie_show[this.movieIndex]) > 0) {
			for (let i in this.movie_show[this.movieIndex]) {
				let v = this.movie_show[this.movieIndex][i]

				v.finish()
			}
		}
		this.setNext()
		this.bSkip = false
	}

	testMovie(movie) {
		PushUIShow()
		PushActorStorage()
		FireEvent(EventDefine.MOVIE_BEGIN, null)
		//FireEvent(EventDefine.PRECEDURE_DEACTIVE, PrecedureEvent.newObj(PRECEDURE_GAME))
		this.playingMovie = true
		// 电影开始的一些操作
		// 保存地图信息

		PushMapShow()
		StateManager.getInstance().ActiveSubState(state_type.LIVE_STORY_STATE)

		// 开始停止镜头绑定      
		SceneManager.getInstance().cameraUnLinkActor()
		this.hideAllPeople()
		//SceneManager.getInstance().transitionScene(MapTransitionStyle.FADEOUTDOWN_TILES)
		// 读取配置表
		let movieCSV = movie
		this.movie_show = this.getAnimeListByCSV(movieCSV)

		this.setNext()
		if (this.timerId == null) {
			this.timerId = SetTimer(this.tick, this, 0)
		}
	}

	//模型特效
	createPlayerEffect(effectId, offx, offy, id, actorId, ones) {
		if (!this.player_list[actorId]) {
			return TLog.Warn("MovieSystem.createPlayerEffect the actor %s is null!", tostring(actorId))
		}

		let actor = this.player_list[actorId]

		if (!ones) {
			let effect = EffectManager.getInstance().createBindEffect(effectId, actor)
			effect.setPositionXY(offx, offy)

			this.playerEffectList[actorId] = this.playerEffectList[actorId] || {}
			this.playerEffectList[actorId][id] = effect
			return effect
		} else {
			let effect = EffectManager.getInstance().createBindOnceEffect(effectId, actor)
			effect.setPositionXY(offx, offy)
		}

	}


	removePlayerEffect(actorId, effectId) {
		//TLog.Debug("MovieSystem.removePlayerEffect",actorId,effectId)
		//delete角色时会自动把响应特效给清除
		if (!this.player_list[actorId]) {
			delete this.playerEffectList[actorId]
			return
		}

		if (!this.playerEffectList[actorId] || !this.playerEffectList[actorId][effectId]) {
			return
		}

		let effect = this.playerEffectList[actorId][effectId]
		effect.deleteObj()
		delete this.playerEffectList[actorId][effectId]
		//TLog.Debug("getPlayer",this.getPlayer(actorId))
	}

	clearPlayerEffect() {
		if (this.playerEffectList) {
			for (let actorId in this.playerEffectList) {
				let v = this.playerEffectList[actorId]

				for (let effectId in v) {
					let effect = v[effectId]

					effect.deleteObj()
				}
			}
		}

		this.playerEffectList = {}
	}
	////////////////////////////////////////////////////////////-
	onCombatBegin(campainId, fightType) {
		// if (fightType != opFightType.FIGHT_TYPE_COMMON) {
		// 	return false
		// }

		let config = GameConfig.CampaignConfig[campainId]

		if (!campainId || campainId == 0
			|| !config || !config.movieName
			|| config.movieName == "") {
			//let message = GetMessage(opCodes.C2G_FIGHT_RESTART)
			//return SendGameMessage(message)
			return false
		}

		// if (!GAME_DEBUG) {
		// 	if (!TaskSystem.getInstance().isTaskExsit(config.taskId) || CampaignSystem.getInstance().isCampaignPass(campainId) == true) {
		// 		return false
		// 	}
		// }

		let movieName = config.movieName
		this.repeatableMovie[movieName] = this.repeatableMovie[movieName] || true
		return this.beginPlay(movieName)
	}

	stopTick() {
		this.taskNoTick = true
	}

	setSkippAble(able) {
		this.skippAble = able
	}

	playMovieAndSetCallback(movieName, obj, callback, args?) {
		//TLog.Debug("playMovieAndSetCallback",movieName)
		//io.read()
		this.callBackObj = obj
		this.callBackFunc = callback
		this.callBackArgs = args
		this.beginPlay(movieName)
	}

	fastEnd() {//跳过剧情
		//if(this.isPlayingMovie() ){
		//	this.endPlay()
		//}	
		if (!this.isfastEnd) {
			this.isfastEnd = true
			if (FightSystem.getInstance().isShowingFight()) {
				FightSystem.getInstance().forceEndFight()
			}
		}
	}

	fastEndNormal() {
		this.endPlay()
	}
	fastEndOpenTask() {
		this.movieIndex = this.movie_show.length - 1
		this.launchElem()
		this.getFastEndWnd().hideWnd()
	}

	getFastEndWnd() { //
		if (this.fastEndWnd == null) {
			this.fastEndWnd = WngMrg.getInstance().getWindow("FastEndMoiveFrame")
		}
		return this.fastEndWnd
	}

	getMovieBlackSide() { //	
		if (this.movieBalckSide == null) {
			this.movieBalckSide = WngMrg.getInstance().getWindow("FightMovieFrame")
		}
		return this.movieBalckSide
	}

	// checkFileMoiveElem() { //

	// 	let path = "F:\\cody\\client\\mmogame\\Resources\\data\\config\\Movie"
	// 	let str = 'dir '..path..'/s > F:\\temp.txt'
	// 	os.execute(str)

	// 	path = "F:\\cody\\client\\mmogame\\Resources\\script\\game\\system\\Movie\\MovieElem"
	// 	str = 'dir '..path..'/s > F:\\temp1.txt'
	// 	os.execute(str)
	// }

	// checkFileListMoiveElem() { //

	// 	//this.checkFileMoiveElem()

	// 	let filePath = "F:\\temp.txt"
	// 	let txt: any = {}
	// 	let file = io.open(filePath, "r")

	// 	for line in file.lines()) {
	// 		//TLog.Debug("line",line)
	// 		JsUtil.arrayInstert(txt, line)
	// 	}
	// 	file.close()

	// 	let movieFileList: any = {}
	// 	for (let i = 8; i <= txt.length - 5, 1; i++) {
	// 		let line = txt[i]
	// 		let fileName = string.sub(line, 37, -5)
	// 		//TLog.Debug("name",i,fileName)
	// 		JsUtil.arrayInstert(movieFileList, fileName)
	// 	}

	// 	//TLog.Debug(movieFileList)	
	// 	let checkCount: any = {}
	// 	for (let _i in movieFileList) {
	// 		let _v = movieFileList[_i]


	// 		let elem = this.getMoveCSV(_v)
	// 		let movieCSV = elem[1]
	// 		for (let _j in movieCSV) {
	// 			let _elem = movieCSV[_j]


	// 			let elemName = movieActionType[_elem[2]].classname
	// 			//TLog.Debug(movieActionType)
	// 			//TLog.Debug("~~",_elem[2],elemName)
	// 			//io.read()
	// 			if (!checkCount[elemName]) {
	// 				checkCount[elemName] = 1
	// 			} else {
	// 				checkCount[elemName] = checkCount[elemName] + 1
	// 			}
	// 		}
	// 	}
	// 	let count = 0
	// 	for (let _i in checkCount) {
	// 		let _v = checkCount[_i]

	// 		count = count + 1
	// 	}
	// 	TLog.Debug(checkCount)
	// 	TLog.Debug("~~~~~~~~~", count)




	// 	let filePath = "F:\\temp1.txt"
	// 	let txt: any = {}
	// 	let file = io.open(filePath, "r")

	// 	for line in file.lines()) {
	// 		//TLog.Debug("line",line)
	// 		JsUtil.arrayInstert(txt, line)
	// 	}
	// 	file.close()

	// 	let totalMovieElemList: any = {}
	// 	for (let i = 8; i <= txt.length - 5, 1; i++) {
	// 		let line = txt[i]
	// 		let fileName = string.sub(line, 37, -5)
	// 		//TLog.Debug("name",i,fileName)
	// 		JsUtil.arrayInstert(totalMovieElemList, fileName)
	// 	}
	// 	count = 0
	// 	for (let _i in totalMovieElemList) {
	// 		let _v = totalMovieElemList[_i]

	// 		count = count + 1
	// 	}
	// 	TLog.Debug(totalMovieElemList)
	// 	TLog.Debug("~~~~~~~~~", count)


	// 	let removeList: any = {}
	// 	for (let _i in totalMovieElemList) {
	// 		let _a = totalMovieElemList[_i]

	// 		let addRemove = true
	// 		for (let _j in checkCount) {
	// 			let _v = checkCount[_j]

	// 			if (_j == _a) {
	// 				addRemove = false
	// 				break
	// 			}
	// 		}
	// 		if (addRemove) {
	// 			JsUtil.arrayInstert(removeList, _a)
	// 		}
	// 	}
	// 	TLog.Debug("remove list")
	// 	TLog.Debug(removeList)

	// }
}
*/