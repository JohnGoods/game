
var g_pauseSkillCaster = null;


class FightSystem extends BaseSystem {

	actorSystem: FightActorSystem;
	showSystem: FightShowSystem;
	configtSystem: FightConfigSystem;
	recordSystem: FightRecordSystem;
	finishHandler: FightFinishHandler;

	//战斗标示变量
	bFight: boolean;
	bFightEnding: boolean;
	fightType: number;
	campaignId: number;
	fightSide: number;

	pauseRefCount: number;
	pauseActorList: number[];
	autoShowSkill: boolean;

	//标识正在表演战斗
	bFighting: boolean;
	reFight: boolean;
	fightVideo: boolean;
	forceEnd: boolean;

	//进攻图
	bFightAttackShow: boolean;
	fightAttackStateList: any;

	//暂停相关
	suspending: boolean;
	suspendDelay: number;

	movieFighterList: number[];


	funnalPoint: number;
	awardList: any;
	npdInfoList: any[];//当前位置npc信息列表
	altemateList: number[];//当前战的替补列表
	leftDamage: number;
	rightDamage: number;

	timer: any;
	waitTimer: any;
	recycleAward: boolean;
	sourceSubStateType: number
	screenEffect: Effect;
	bHeroVisible: boolean
	playerInfo: any;

	defendSkillId: number;
	delayPacket:boolean;

	waitServerTimer:any;
	sFightState: number
	activityInfo: any

	lastCollectTime:number;

	fightAnimTimer:number;

	static FIGHT_RESULT_STATE_WIN: number = 1					//胜利结算中
	static FIGHT_RESULT_STATE_NULL: number = 0					//未在结算中
	static FIGHT_RESULT_STATE_LOST: number = -1					//战败结算中

	public initObj(...args: any[]): void {

		this.actorSystem = FightActorSystem.newObj(this)
		this.showSystem = FightShowSystem.newObj(this)
		this.configtSystem = FightConfigSystem.newObj(this)
		this.finishHandler = FightFinishHandler.newObj(this, this._endFight)
		this.recordSystem = FightRecordSystem.newObj(this)

		this.defendSkillId = 0	//当前翅膀技能（待选定目标）
		this.sFightState = FightSystem.FIGHT_RESULT_STATE_NULL					//默认状态
		this.lastCollectTime = -1;
		this.onClear()
	}

	destory() {
		this.onClear()
	}

	onClear() {
		if (this.bFight == true) {
			this.bFight = false
			let nowTime = GetCurMillSec()
			if(this.lastCollectTime == -1 || nowTime - this.lastCollectTime >= 30000){
				CollectGarbage();
				this.lastCollectTime = nowTime;
			}
			GameSound.getInstance().unloadAllEffect()//卸载所有音响

			this.showSystem.onClear()
			this.actorSystem.onClear()
			this.finishHandler.onClear()
			this.recordSystem.onClear()
			this.clearAllAward()
			this.stopPauseSkillShow()

			if (this.screenEffect != null) {
				this.screenEffect.deleteObj()
			}
			this.screenEffect = null

			//LuaMemoryTraceStop()

			//场景相关
			//SceneManager.getInstance().hideBgBlendColor()
			this.stopFightSceneAnim();
			SceneManager.getInstance().setAdjustViewCenter(true)
			SceneManager.getInstance().setBgImage("", 0, 0)//
			//SceneManager.getInstance().transitionScene(MapTransitionStyle.RANDOM)
			//SceneManager.getInstance().setMapScale(false)
			//SceneManager.getInstance().setBgImage("")
			SceneManager.getInstance().setMaskEnable(true)
			StateManager.getInstance().ActiveState(state_type.LIVE_BASE_STATE)
			
			//UI界面新状态
			WngMrg.getInstance().hideWindow("FightFrame")
			if (this.isPushUI() ) {
				PopUIShow(FIGHT_NOT_HIDE_UI, false)//不会关闭在战斗过程中打开的界面
			}
//			PopMapShow()
//			if (this.fightVideo == true) {
//				PopUIShow(["FightRecordFrame"])
//			} else {
//				PopUIShow()
//			}
			//GameClearCache()

			//if(MovieSystem.getInstance().isPlayingMovie() == false ){
			if (this.sourceSubStateType != state_type.BASE_STATE &&
				this.sourceSubStateType != state_type.LIVE_BASE_STATE &&
				this.sourceSubStateType != state_type.COMBAT_BASE_STATE) {
				StateManager.getInstance().ActiveSubState(this.sourceSubStateType)
			}
			//}else{
			//	StateManager.getInstance().ActiveState(state_type.LIVE_STORY_STATE)
			//}
			//StateManager.getInstance().DeactiveSubState(state_type.COMBAT_BASE_STATE)

			//刷新当前位置
			let hero = GetHero()
			hero.setVisible(this.bHeroVisible)
			SceneManager.getInstance().cameraLinkActor(hero)
			LookAtHero()
			//hero.sendMoveMessage()

			if (this.showSystem.isClientFighting() == false) {
				//hero.setVisible(true)
				PopActorStorage()
			}

			// this.refreshNearPlayer()
			TaskSystem.getInstance().onHeroEnterMap(null)				//重置地图npc

		}

		//战斗标示变量
		this.bFight = false
		this.bFightEnding = false
		this.fightType = null
		this.campaignId = 0
		this.fightSide = fightSide.FIGHT_RIGHT

		this.pauseRefCount = 0 //暂停计数
		this.pauseActorList = []
		this.autoShowSkill = false

		//标识正在表演战斗
		this.bFighting = false
		this.reFight = false
		this.fightVideo = false
		this.forceEnd = false

		//进攻图
		this.bFightAttackShow = false
		this.fightAttackStateList = {}//保存状态

		//暂停相关
		this.suspending = false
		this.suspendDelay = 0

		this.delayPacket = false;

		//modify:movie
		//重连或者关闭时清空数剧有可能FightSystem先于MovieSystem执行
		// this.movieFighterList = this.movieFighterList || []
		// for (let _ in this.movieFighterList) {
		// 	let combatId = this.movieFighterList[_]

		// 	let actor = GetFightActor(combatId)
		// 	if (actor) {
		// 		let side = actor.getSide()
		// 		let pos = actor.getPos()
		// 		let id = side + "_" + pos
		// 		MovieSystem.getInstance().deletePlayer(id)
		// 	}
		// }
		// this.movieFighterList = []


		this.funnalPoint = 0
		this.awardList = {}
		this.npdInfoList = []		//当前位置npc信息列表
		this.altemateList = [0, 0]	//当前战的替补列表
		this.leftDamage = 0
		this.rightDamage = 0
		//this.defendSkillId = 0	//当前翅膀技能（待选定目标）
		this.endDefendSkillPick()

		if (this.timer) {
			KillTimer(this.timer)
			this.timer = null
		}

		UnRegisterEvent(EventDefine.COMBAT_FIGHT_ATTACK_BIGIN, this.onFightAttackBegin, this)
		UnRegisterEvent(EventDefine.COMBAT_FIGHT_ATTACK_FINISH, this.onFightAttackFinish, this)
		UnRegisterEvent(EventDefine.GAME_RESUME, this.onGameResume, this)
		UnRegisterEvent(EventDefine.GAME_RECV_RESULT, this.onRecvResult, this)
		//UnRegisterEvent(EventDefine.COMBAT_FIGHT_CLICK_MAP, this.onCombatClickMap, this)

		//
		this.recycleAward = false

		//
		if (this.waitServerTimer) {
			//contrller需要一个非空窗口实例，时间动作不对窗口控件作操作，所以可以任意获取一个
			//（注：不能用"MainMenu"，否则战斗重连后主界面会延迟创建，导致战斗后主界面被隐藏了，原因未明）
			// let wnd = WngMrg.getInstance().getWindow("MainFrame")//("MainMenuFrame")
			// let window = wnd.mRootWindow
			// this.waitServerAction = TimerAction.newObj(window, 3000, null, this.waitServerTick, this)

			//this.waitServerTimer = SetTimer(this.waitServerTick, this, 3000);
			KillTimer(this.waitServerTimer)
			this.waitServerTimer = null;
		} 

		//LuaCollectGarbage()
		//模拟网络延迟的效果
		//this.delayPacket = false
		//this.var delayPacketList:any = {}

		//LuaMemoryTraceStop()

		//战斗-活动信息
		this.activityInfo = {}
	}

	prepareResource(workQueue) {

		this.actorSystem.onPrepare();
		GameConfig.initFightSystemCsv(workQueue);
	}


	getActorSystem() {
		return this.actorSystem
	}

	getShowSystem() {
		return this.showSystem
	}

	getConfigSystem() :FightConfigSystem{
		return this.configtSystem
	}

	isFight() {
		return this.bFight
	}

	isReFight() {
		return this.reFight
	}

	//开始战斗，外部调用
	beginFight(fightType, campaignId, curSide?) {
		if (this.bFightEnding) {
			this._endFight()
		}

		if (this.bFight) {
			return
		}

		FireEvent(EventDefine.MSG_WAIT_END, null)
		FireEvent(EventDefine.COMBAT_BEGIN_BEFORE, null)
		this.fightType = fightType
		this.campaignId = campaignId || 0
		if (curSide && curSide == fightSide.FIGHT_LEFT) {
			this.fightSide = curSide
		}

		//CollectGarbage()
		this._beginFight()
		//LuaCollectGarbage()

		//if(this.traceMem  ){
		//	LuaMemoryTraceBegin()
		//}
		//this.traceMem = true
	}

	//战斗重连，需要进行必要设定处理
	reBeginFight(fightType, campaignId, curSide, mpPoint?:number) {
		this.beginFight(fightType, campaignId, curSide)

		this.actorSystem.setRoleMp(GetHeroProperty("id"), mpPoint || 0)
		this.reFight = true
	}

	beginFightVideo() {
		this.fightVideo = true

		//WngMrg.getInstance().hideWindow("CampaignInfoFrame")
		//FireEvent(EventDefine.COMBAT_FIGHT_VIDEO_BEGIN, null)
		//this.endFight()
		//FireEvent(EventDefine.MSG_WAIT_END,null)
	}

	//结束战斗
	endFight() {
		if (this.bFight == false) {
			return
		}
		//FightSystem.getInstance().getShowSystem().endFight()

		this.showSystem.notifyEnd()
		this.bFightEnding = true
		FireEvent(EventDefine.MSG_WAIT_END, null)
	}

	private isPushUI(){
		return (this.fightType != opFightResultType.PATROL) &&
			   (this.fightType != opFightResultType.CAMPAGINBOSS) &&
			   (this.fightType != opFightResultType.FACTIONMAP);
	}

	

	private startFightSceneAnim(){
		if(this.fightAnimTimer != null){
			KillTimer(this.fightAnimTimer)
		}
		
		let sceneMgr:SceneManager = SceneManager.getInstance();
		sceneMgr.showBgBlendColor(0, 13, 13, 50)//屏幕变暗
		
		let maxAnimTime = 500;
		let dstAlpha = 166;
		let curAlphaTime = 0;
		

		let onTimerCallback = function(dt){
           curAlphaTime = curAlphaTime + dt;

		   let alpha = Math.floor(curAlphaTime/maxAnimTime * dstAlpha)
		   if(alpha > dstAlpha){
			   alpha = dstAlpha;
			   KillTimer(this.fightAnimTimer)
			   this.fightAnimTimer = null;
		   }

		   sceneMgr.updateBgBlendColor(alpha, 13, 13, 50)
        }

        this.fightAnimTimer = SetTimer(onTimerCallback, this, 0);
	}

	private stopFightSceneAnim(){
		if(this.fightAnimTimer != null){
			KillTimer(this.fightAnimTimer)
			this.fightAnimTimer;
		}
		
		SceneManager.getInstance().hideBgBlendColor()
	}

	//战斗开始的操作，内部调用
	_beginFight() {
		this.bFight = true
		this.bFightEnding = false
		this.forceEnd = false
		this.awardList = {}

		this.bHeroVisible = GetHero().isVisible()
		// GetHero().moveStop()
		GetHero().setVisible(false)

		// //录像模式下记录必要的NPC信息
		// if (this.isFightVideo() == true) {
		// 	let npcList = ActorManager.getInstance().getNpcList()
		// 	for (let _ in npcList) {
		// 		let v = npcList[_]

		// 		// let info = NpcInfo.newObj()
		// 		// let propertyInfo = v.getPropertyInfo()

		// 		// table_class_copy(info, propertyInfo)
		// 		// info.param = table_copy(propertyInfo.param)
		// 		// info.taskInfo = table_copy(propertyInfo.taskInfo)
		// 		let info = table_copy(v.getPropertyInfo())
		// 		JsUtil.arrayInstert(this.npdInfoList, info)
		// 	}
		// }

		//UI界面新状态
		if (this.isPushUI()) {
			let notRestore = table_copy(FIGHT_NOT_RESOTE_UI[opFightResultType.COMMON])				//common
			notRestore = table_merge(notRestore, FIGHT_NOT_RESOTE_UI[this.fightType] || [])
			PushUIShow(notRestore, ["MainFrame", "CombatForceTipsFrame", "FightRecordFrame"])
		}

		if (!this.timer) {
			this.timer = SetTimer(this.tick, this, 0, true)
		}

		RegisterEvent(EventDefine.COMBAT_FIGHT_ATTACK_BIGIN, this.onFightAttackBegin, this)
		RegisterEvent(EventDefine.COMBAT_FIGHT_ATTACK_FINISH, this.onFightAttackFinish, this)
		RegisterEvent(EventDefine.GAME_RESUME, this.onGameResume, this)
		RegisterEvent(EventDefine.GAME_RECV_RESULT, this.onRecvResult, this)
		//RegisterEvent(EventDefine.COMBAT_FIGHT_CLICK_MAP, this.onCombatClickMap, this)

		//过度动画
		//SceneManager.getInstance().transitionScene(MapTransitionStyle.RANDOM)
		//SceneManager.getInstance().showBgBlendColor(166, 13, 13, 50)//屏幕变暗
		this.startFightSceneAnim();
		SceneManager.getInstance().setBgImage("ui/image/tongYong/ty_zhanDouZhen.png", 90 + (IGlobal.stageWidth - IGlobal.contentWidth) / 2, 360 )//
		SceneManager.getInstance().setMaskEnable(false)//关闭精灵半透明	
		//SceneManager.getInstance().setBgImage("data/ui/new_image/combat/zhenfa.png")

		ActorManager.getInstance().clearAll()
		//场景相关
		//应该根据不同玩法，加载不同地图
//		PushMapShow()

		
//		let fightMap = 50012
//		let x = 0, y = 0
//	
//		//let mapId = MapSystem.getInstance().getMapId()
//		//if(MapTransferList[mapId] ){
//		//		fightMap=MapTransferList[mapId][1]["FightMapId"]
//		//}else{
//		//		TLog.Debug("_beginFight ",this.fightType,opFightType.FIGHT_TYPE_COMMON,opFightType.FIGHT_TYPE_TASK)
//		if (this.fightType == opFightType.FIGHT_TYPE_COMMON) {
//			let config = GameConfig.CampaignConfig[this.campaignId]
//			if (config && config.fightMap != 0) {
//				fightMap = config.fightMap
//				x= config.fightMapX || 0, y = config.fightMapY || 0
//			}
//			//		}else if(this.fightType == opFightType.FIGHT_TYPE_TASK ){ 		
//			//			let config = PetCampaignConfig[this.campaignId] 
//			//			if(config && config.fightMap && config.fightMap != 0  ){
//			//				fightMap = config.fightMap			
//			//			}
//			//		}else if(this.fightType == opFightType.FIGHT_TYPE_TEST && this.campaignId!=0  ){
//			//			fightMap=this.campaignId
//			//		}else if(this.fightType == opFightType.FIGHT_TYPE_CHAMPION ){
//			//			fightMap = 50084
//		} else if (this.fightType == opFightType.FIGHT_TYPE_DAILY) {
//			//fightMap = GetActivity(ActivityDefine.SkyTower):getFightMap()
//		} else if (this.fightType == opFightType.FIGHT_TYPE_WORLDBOSS) {
//			fightMap = 50012
//		} else if (this.fightType == opFightType.FIGHT_TYPE_CHAMPION) {
//			fightMap = 50028
//			//		}else if(this.fightType == opFightType.FIGHT_TYPE_RECRUIT ){
//			//			fightMap = 50086		
//			//		}
//		} else if (this.fightType == opFightType.FIGHT_TYPE_CLIENT) {
//			fightMap = this.campaignId
//		}
//
//		MapSystem.getInstance().loadMap(fightMap, x, y)
		// for (let _ in ActorManager.getInstance().getNpcList()) {
		// 	let npc = ActorManager.getInstance().getNpcList()[_]

		// 	npc.setVisible(false)
		// }

		this.sourceSubStateType = StateManager.getInstance().GetCurrentStateType()
		StateManager.getInstance().ActiveState(state_type.COMBAT_BASE_STATE)  //进入战斗状态       
		FireEvent(EventDefine.COMBAT_BEGIN, CombatEvent.newObj(this.fightType))

		SceneManager.getInstance().cameraUnLinkActor()

		let heroPos = GetHero().getMapXY()
		SceneManager.getInstance().lookAtCenter(heroPos.x, heroPos.y)
		SceneManager.getInstance().setAdjustViewCenter(false) //取消自动调整，实现震屏效果

		if (this.showSystem.isClientFighting() == false) {
			PushActorStorage()
		}
		this.showSystem.onBeginFight()
		this.actorSystem.onBeginFight()

		if(GAME_MODE == GAME_NORMAL){
			WngMrg.getInstance().showWindow("FightFrame")
		}


		//法阵
		//if(this.fightType == opFightType.FIGHT_TYPE_COMMON && this.isClientFighting() == false ){
		//	let buffList = VipSystem.getInstance().GetVipBuff()
		//	if(buffList && buffList.bless != 0 ){
		//		this.screenEffect = EffectManager.getInstance().createScreenEffect(effectIndex.ZhanDouFaZhen, -50, -10, map.ICamera.eScreenLayer_Background)
		//	}
		//}
	}


	tick(delay) {
		if (this.suspending == true) {
			//this.suspendDelay = this.suspendDelay + delay
			return
		}

		this.awardListTick(delay)

		//角色
		PROFILE_START("FightSystem actorSystem:tick")
		this.actorSystem.tick(delay)
		PROFILE_STOP("FightSystem actorSystem:tick")
		//结束表演部分的tick，继续上面必要循环
		if (this.finishHandler.isOnAir() == true && STAY_IN_DEFALUT_POSITION != true) {
			return
		}

		if (this.forceEnd == false) {

			//result
			PROFILE_START("FightSystem showSystem:tick")
			this.showSystem.tick(delay)
			PROFILE_STOP("FightSystem showSystem:tick")
		}

		if (this.bFightEnding) {
			if (this.showSystem.isreadyFinish()) {
				//if(this.timer ){
				//	Timer.getInstance().killTimer(this.timer)
				//	this.timer = null
				//}
				this.bFighting = false

				this.finishHandler.startProcess()
				//this.actorSystem.refreshFinishState()
			}

			//测试打印result
			//g_TestDumpResult = true
			return
		}

	}

	awardListTick(delay) {
		//掉落tick
		for (let combatId in this.awardList) {
			let list = this.awardList[combatId]

			for (let _ in list) {
				let award = list[_]

				award.update(delay)
			}
		}
		//掉落品收拾整理
		//判断胜利
		if (this.recycleAward == false) {
			return
		}

		let flag = true
		let actorList = GetFightActorList()
		for (let _ in actorList) {
			let actor = actorList[_]

			if (actor.getSide() == fightSide.FIGHT_LEFT && actor.isDeadState() != true) {
				flag = false
			}
		}
		if (flag) {
			for (let combatId in this.awardList) {
				let list = this.awardList[combatId]

				for (let _ in list) {
					let award = list[_]

					award.onClickActor(true)
				}
			}
		}
	}

	//战斗结束操作，内部调用
	_endFight() {
		if (this.bFight == false) {
			return
		}
		let fightType = this.fightType

		for (let _ in ActorManager.getInstance().getNpcList()) {
			let npc = ActorManager.getInstance().getNpcList()[_]

			npc.setVisible(true)
		}
		this.onClear()
		return fightType
	}

	//等待网络战斗结果
	startWaitServer() {
		if (GAME_MODE == GAME_TOOL) {
			return
		}

		if(this.waitServerTimer == null){
			this.waitServerTimer = SetTimer(this.waitServerTick, this, 3000);
		}
	}

	waitServerTick(action) {
		if (this.bFighting == true || this.finishHandler.isOnAir() == true) {
			return
		}
		//FireEvent(EventDefine.MSG_WAIT_BEGIN, ClientWaitEvent.newObj(false))
	}

	//排序结果
	addResult(result) {
		if (this.isFight() == false || this.forceEnd == true) {
			return
		}

//		if (!this.bFighting &&
//			!(this.reFight == true && result.round == 1) &&
//			StateManager.getInstance().GetCurrentStateType() != state_type.COMBAT_STORY_STATE) {
//			this.bFighting = true
//
//			//this.showSystem.initCurFightShowTime(result.time)
//			//this.showSystem.setBeginShow()
//			FireEvent(EventDefine.MSG_WAIT_END, null)
//			this.actorSystem.setBeginShow()
//			this.showSystem.initFightRound(result.round, this.reFight)
//
//			//重连时战斗时间以第一条result时间开始计算
//			//let showTime = 0
//			//if(this.reFight == true ){
//			//	showTime = result.time
//			//}
//			//this.showSystem.initReFightTime(result.time, showTime)
//		}

		//this.configtSystem.adjustSpellId(result)

		//result.time = result.time + this.suspendDelay
		//if(this.delayPacket == false ){
		//	for(let _ in this.delayPacketList){
		//let r = this.delayPacketList[_]
		//
		//		this.showSystem.addResult(r)
		//	}
		//	this.var delayPacketList:any = {}
		//	
		this.showSystem.addResult(result)
		this.recordSystem.addResult(result)
		//}else{
		//	JsUtil.arrayInstert(this.delayPacketList, result)
		//}
	}

	addFighterList(fighterList) {
		//if(this.bFight == false ){
		//	return
		//}
		let list: any[] = []
		for (let i = 0; i < fighterList.length; i++) {
			let info = fighterList[i]

			if (this.fightSide == fightSide.FIGHT_LEFT) {
				info.side = info.side % 2 + 1
			}
			this.actorSystem.create_actor(info)
			JsUtil.arrayInstert(list, info.id)
		}
		FireEvent(EventDefine.COMBAT_FIGHTER_ADD_EX, CombatFighterAddEvent.newObj(list))

		//modify:movie
		//let [flag, _] = MovieSystem.getInstance().isPlayingMovie()
		//if (flag == true || this.bFighting == true) {
		if (this.bFighting == true) {
			return
		}

		let playMovie = false
		if (this.reFight == false && this.isFightVideo() == false) {
			//modify:movie
			//playMovie = MovieSystem.getInstance().onCombatBegin(this.campaignId, this.fightType)
		} else if (this.bFighting == false) {
			this.actorSystem.resetAllActorPosition()
		}

		if (playMovie == false) {
			this.startWaitServer()
		}

		FireEvent(EventDefine.COMBAT_FIGHTER_ADD, CombatFighterAddEvent.newObj(list))
	}

	//modify:movie
	// addMovieFighterList(fighterList) {
	// 	let maxId = 0
	// 	for (let combatIdKey in this.actorSystem.getActorList()) {
	// 		let actor = this.actorSystem.getActorList()[combatIdKey]

	// 		let combatId = tonumber(combatIdKey)
	// 		if (combatId > maxId) {
	// 			maxId = tonumber(combatId)
	// 		}
	// 	}

	// 	for (let _ in fighterList) {
	// 		let info = fighterList[_]

	// 		let side = info.side
	// 		let pos = info.pos

	// 		if (side != 0 && pos != 0) {
	// 			let actor = GetFightActorByPos(side, pos)
	// 			if (!actor) {
	// 				maxId = maxId + 1
	// 				info.id = maxId

	// 				this.actorSystem.create_actor(info)
	// 				JsUtil.arrayInstert(this.movieFighterList, maxId)
	// 			}
	// 		}
	// 	}

	// 	MovieSystem.getInstance().initFightPlayerList()
	// }

	refreshPlayList() {
		let flag = false
		for (let _ in this.movieFighterList) {
			let id = this.movieFighterList[_]

			if (flag == false) {
				flag = true
			}

			this.actorSystem.remove_actor(id)
		}

		this.movieFighterList = []
		this.actorSystem.resetActorDefaultTarget()

		//if(flag == true ){
		this.actorSystem.updateServerFighterList()
		//}
	}

	createAward(actorId) :FightAward{
		this.awardList[actorId] = this.awardList[actorId] || []

		let award = FightAward.newObj()
		JsUtil.arrayInstert(this.awardList[actorId], award)

		return award
	}

	clearAllAward() {
		this.awardList = this.awardList || {}

		for (let _ in this.awardList) {
			let v = this.awardList[_]

			for (let k in v) {
				let award = v[k]

				award.deleteObj()
			}
		}

		this.awardList = {}
	}

	removeFighter(id) {
		let actor = GetFightActor(id)
		if (actor && actor.getProperty("type_id") == objectType.OBJECT_TYPE_ASSIST) {
			actor.setAutoDelete()
			return
		}

		this.actorSystem.remove_actor(id)
	}

	//onSaveObjectMessage( args){
	//	let var t:any = {}
	//	t.callBack = args.callBack
	//	t.obj			 = args.obj
	//	t.param		 = args.param
	//	args.handle = args.handle + 1
	//	JsUtil.arrayInstert(this.objectBuffer, t)
	//}

	//restoryObjectToMap(){
	//	for(let _ in this.objectBuffer){
	//let v = this.objectBuffer[_]
	//
	//		let func = v.callBack
	//		func(v.obj, true, v.param)
	//	}
	//	
	//	this.var objectBuffer:any = {}
	//}
	////////////////////////////////////////////////////-
	isShowingFight() {
		return this.bFighting
	}

	isFightEnding() {
		return this.bFightEnding
	}

	addFightAccountSettle(win, param) {
		this.finishHandler.addFightAccountSettle(win, param)
	}

	// sweepAwayFight(param, passCampaign) {
	// 	this.finishHandler.sweepAwayFight(param, passCampaign)
	// }

	getCurFightType():[number, number] {
		return [this.fightType, this.campaignId]
	}

	getCurFightTime() {
		return this.showSystem.getCurFightTime()
	}

	//getCurFightShowTime(){
	//	return this.showSystem.getCurFightShowTime()
	//}

	suspendFightShow(state) {
		if (state) {
			return this.beginSuspend()
		} else {
			return this.endSuspend()
		}
	}

	isFightVideo() {
		return this.fightVideo
	}

	setAutoShowSkill(auto) {
		this.autoShowSkill = auto
	}

	isAutoShowSkill():boolean {
		return this.autoShowSkill
	}

	//暂停技能表现
	beginPauseSkillShow(actor, type) {
		//本来是允许多个存在，现在只允许单个存在,所以pauseRefCount相当于bool
		if (this.pauseRefCount > 0) {
			return false
		}

		g_pauseSkillCaster = actor

		let fightResult = this.showSystem.getShowResult(actor.getCombatId())
		if (fightResult == null) {
			return false
		}

		let actor_list = []
		if (type == FIGHT_BLACK_SCREEN_TYPE.CASTER) {
			actor_list = fightResult.getActionObjectByName("caster")

		} else if (type == FIGHT_BLACK_SCREEN_TYPE.TARGETLIST) {
			actor_list = fightResult.getActionObjectByName("targetList")

		} else if (type == FIGHT_BLACK_SCREEN_TYPE.CASTER_TARGETLIST) {
			let list1 = fightResult.getActionObjectByName("caster")
			let list2 = fightResult.getActionObjectByName("targetList")
			table_merge(actor_list, list1)
			table_merge(actor_list, list2)


		} else if (type == FIGHT_BLACK_SCREEN_TYPE.ALL_HIDE) {

		}
		SceneManager.getInstance().showFgBlendColor(255, 0, 0, 0)//屏幕变暗
		//this.showSystem.removeManualEffect()

		//全部重置
		let fightActorList = GetFightActorList()
		for (let _ in fightActorList) {
			let v = fightActorList[_]

			v.setVisible(false)
			v.setPause(true)
		}

		for (let i = 0; i < actor_list.length; i++) {
			let v = actor_list[i]

			v.changeTopMapLayer() // 高亮
			v.setVisible(true)
			v.setPause(false)

			//受击者停下
			if (v != actor) {
				v.moveStop()
			}
			table_insert(this.pauseActorList, v.getCombatId())
		}

		//非高亮的都静止
		SceneManager.getInstance().setActorsPause(true, eMapLayerTag.Sprite)//低层暂停
		g_pauseSkillCaster.setPause(false) //施法者一定不能停止
		g_pauseSkillCaster.doCommand(ActorCommand.SetEffectVisibleWithCaster, false, actor) //隐藏非自身施法的绑定特效

		this.showSystem.setPauseSkillShow(true)

		this.pauseRefCount = this.pauseRefCount + 1

		return true
	}


	stopPauseSkillShow() {
		if (this.pauseRefCount != 1) {
			return
		}
		this.pauseRefCount = 0

		g_pauseSkillCaster.doCommand(ActorCommand.SetEffectVisibleWithCaster, true)
		g_pauseSkillCaster = null

		let fightActorList = GetFightActorList()
		for (let _ in fightActorList) {
			let v = fightActorList[_]

			v.setVisible(true)
			v.setPause(false)
		}

		SceneManager.getInstance().setActorsPause(false, eMapLayerTag.Sprite)
		SceneManager.getInstance().hideFgBlendColor()


		for (let i = 0; i < this.pauseActorList.length; i++) {
			let combatId = this.pauseActorList[i]

			let actor = GetFightActor(combatId)
			if (actor) {
				actor.changeNormalMapLayer() // 回到一般层
			}
		}
		this.pauseActorList = []

		this.showSystem.setPauseSkillShow(false)

	}

	//马上结束战斗表演并退出场景
	forceEndFight(endNow?) {
		if (this.bFight == false) {
			return
		}
		if (this.forceEnd == true) {
			return
		}
		this.endFight()
		this.forceEnd = true
		//this.endNow = endNow || false

		this.showSystem.forceEndFight()
	}

	getCurShowFightRound() {
		return this.showSystem.getCurShowFightRound()
	}

	isForceEnding() {
		return this.forceEnd
	}

	getSelfFightSide() {
		return this.fightSide
	}

	onFighterDieing(id) {
		this.actorSystem.updateBlackList(id)
	}

	transferFightSide(serverSide) {
		if (this.fightSide == fightSide.FIGHT_LEFT) {
			serverSide = serverSide % 2 + 1
		}

		return serverSide
	}

	getFunnalId(side:number) {
		side = this.transferFightSide(side)

		return FIGHT_FUNNAL_ID[side]
	}

	updateFunnalPoint(point) {
		this.funnalPoint = point
	}

	getFunnalPoint() {
		return this.funnalPoint
	}

	getFightRecord() {
		return this.recordSystem.getFightRecord()
	}

	setAltemateList(list) {
		this.altemateList = table_copy(list)
	}

	removeAltemate(entryId) {
		table_remove(this.altemateList, entryId)
		var list = []
		for (let _ in this.altemateList) {
			let v = this.altemateList[_]

			if (v != 0) {
				JsUtil.arrayInstert(list, v)
			}
		}

		while (list.length < 2) {
			JsUtil.arrayInstert(list, 0)
		}
		this.altemateList = list
	}

	getAltemateList() {
		return this.altemateList
	}

	setFightDamage(leftDamage, rightDamage) {
		this.leftDamage = leftDamage
		this.rightDamage = rightDamage
	}

	getFightDamage() {
		return [this.leftDamage, this.rightDamage]
	}
	//时间暂停处理
	//////////////////////////////////////////////////////
	beginSuspend() {
		if (this.suspending) {
			return
		}

		this.suspending = true

	}

	endSuspend() {
		if (!this.suspending) {
			return
		}

		this.suspending = false
	}

	isFightSuspending() {
		return this.suspending
	}

	//客户端自主设计战斗表演（例如发招前弹个对白之类的）
	//////////////////////////////////////////////////////-
	showClientFight(index, mapID, defaultPos) {
		if (this.showSystem.isClientFighting()) {
			return
		}
		this.showSystem.setClientFighting(true)

		let [playerList, resultList] = this.configtSystem.getClientFightConfig(index)

		this.beginFight(opFightResultType.FIGHT_TYPE_CLIENT, mapID)
		this.addFighterList(playerList)
		if (defaultPos) {
			this.actorSystem.resetAllActorPosition()
		}

		for (let _ in resultList) {
			let v = resultList[_]

			this.addResult(v)
		}
	}

	isClientFighting() {
		return this.showSystem.isClientFighting()
	}


	onFightAttackBegin(args) {
		TLog.Debug("FightSystem.onFightAttackBegin")
		//TLog.Assert(this.bFightAttackShow == false)

		if (this.pauseRefCount == 0) {
			let fightActorList = GetFightActorList()
			for (let _ in fightActorList) {
				let v = fightActorList[_]

				this.fightAttackStateList[v.getCombatId()] = v.isPause()
				v.setPause(true)
			}
		}

		this.showSystem.setPauseSkillShow(true)
	}

	onFightAttackFinish(args) {
		TLog.Debug("FightSystem.onFightAttackFinish")
		//this.bFightAttackShow = false

		if (this.pauseRefCount == 0) {
			for (let k in this.fightAttackStateList) {
				let v = this.fightAttackStateList[k]

				let actor = GetFightActor(k)
				if (actor) {
					actor.setPause(v)
				}
			}
		}

		this.fightAttackStateList = {}
		//this.bFightAttackShow = false
		this.showSystem.setPauseSkillShow(false)

	}

	isPauseSkill() {
		return this.pauseRefCount > 0
	}

	hangUpFinishHandler(b) {
		this.finishHandler.setHangUp(b)
	}

	//////////////////////////战斗结束外部自适处理回调//////////////////////
	addEndFightHandler(callBack, obj, param) {
		this.finishHandler.addEndFightHandler(callBack, obj, param)
	}


	onGameResume(args) {
		//手机端，程序退到后台时间都会暂停。这时候需要同步一下战斗时间
		if (this.isFightVideo() || this.isClientFighting()) {
			return
		}
		let message = GetMessage(opCodes.C2G_FIGHT_SYNC_TICKTIME)//发送ping
		SendGameMessage(message)
	}

	onRecvResult(args) {
		if (args.result == resultCode.RESULT_TASK_FINISH
			|| args.result == resultCode.RESULT_TASK_ACCEPT) {

			args.handle = args.handle + 1
		}
	}

	onSyncTickRound(curFightRound) {
		if (this.isFight() == false) {
			return
		}
		//当前服务器时间
		this.showSystem.initFightRound(curFightRound, false)
	}
	//set玩家信息
	setPlayerInfo(info) {
		this.playerInfo = info
	}
	//get玩家信息
	getPlayerInfo() {
		return this.playerInfo
	}

	//模拟网络延迟
	setDelayPacket(delay) {
		this.delayPacket = delay || false
	}

	clearUpFightState() {
		return this.finishHandler.clearUpFightState()
	}

	refreshNearPlayer() {
		let message = GetMessage(opCodes.C2G_ROLE_REFRESH_NPC)
		SendGameMessage(message)
	}

	//翅膀发招（待定目标显示-清除显示目标-是否待定中-选中目标发招）
	beginDefendSkillPick(skillId) {
		// skillId = skillId || 0
		// if (skillId == 0 || !GameConfig.SpiritSkillConfig[skillId]) {
		// 	return
		// }

		// let config = GameConfig.SpiritSkillConfig[skillId]
		// let sideList = []
		// if (config.targetType == 1) {
		// 	JsUtil.arrayInstert(sideList, fightSide.FIGHT_RIGHT)
		// } else if (config.targetType == 2) {
		// 	JsUtil.arrayInstert(sideList, fightSide.FIGHT_LEFT)
		// } else if (config.targetType == 3) {
		// 	JsUtil.arrayInstert(sideList, fightSide.FIGHT_RIGHT)
		// 	JsUtil.arrayInstert(sideList, fightSide.FIGHT_LEFT)
		// }

		// let sideCoin = {
		// 	[fightSide.FIGHT_RIGHT]: "zd_shouHuJianTou02",
		// 	[fightSide.FIGHT_LEFT]: "zd_shouHuJianTou01",
		// }
		// for (let _ in GetFightActorList()) {
		// 	let actor = GetFightActorList()[_]

		// 	if (actor.isDeadState() == false && actor.getProperty("type_id") != objectType.OBJECT_TYPE_FUNNAL) {
		// 		if (table_isExist(sideList, actor.getSide())) {
		// 			actor.doCommand(ActorCommand.SetFightStateVisible, true, sideCoin[actor.getSide()])
		// 		} else {
		// 			actor.doCommand(ActorCommand.SetFightStateVisible, false, "")
		// 		}
		// 	}
		// }
		// SceneManager.getInstance().showBgBlendColor(0.6 * 255, 0, 0, 0)
		// this.defendSkillId = skillId
	}

	//清除显示目标
	endDefendSkillPick() {
		let [flag, _] = this.isDefendSkillPicking()
		if (flag == true) {
			SceneManager.getInstance().hideBgBlendColor()
			this.defendSkillId = 0

			for (let _ in GetFightActorList()) {
				let actor = GetFightActorList()[_]

				if (actor.isDeadState() == false) {
					actor.doCommand(ActorCommand.SetFightStateVisible, false, "")
				}
			}
		}
	}

	//是否待定中
	isDefendSkillPicking() {
		return [this.defendSkillId != 0, this.defendSkillId]
	}

	//战斗中点击地图
	// onCombatClickMap(args) {
	// 	this.endDefendSkillPick()
	// }

	setFightResultState(state) {
		this.sFightState = state
	}

	getFightResultState() {
		return this.sFightState
	}

	setFightActivityInfo(actIndex, actInfo) {
		this.activityInfo[actIndex] = actInfo
	}

	getFightActivityInfo(actIndex) {
		return this.activityInfo[actIndex]
	}
}