// TypeScript file
/*
作者:
	
创建时间：

意图：
  	武林大会

公共接口：
	
*/

class Activity_WuLinDaHui extends ActivityBase {
	timerList: any
	endTime:number
	level:number
	npcInfo:any[]
	mineList: any;
	wulinWnd: WuLinMapFrame
	jifenInfo:any[]
	lastActor;

	public initObj(...args: any[]): void {
		this.level = 0
		this.mineList = {}
		this.lastActor = null
		this.npcInfo = []
	}

	onClear() {
		this.clearNpc()
		this.timerList = {}
		this.endTime = 0
	}

	destory() {

	}

	onPrepareResource() {
		this.messageWndHandleIndex = 
		{	
            //进入活动
            ["G2C_EnterWuLinMengZhu"]: [this.onRecvEnter, [], true],
			//退出活动
			["G2C_LeaveWuLinMengZhu"]: [this.onRecvLeave, []],

			//更新层数
			["G2C_WuLinMengZhuJumpMap"]: [this.onUpdateLevel, []],

			//NpcInfo
			["G2C_WuLinMengZhuNPCData"]: [this.onUpdateNpcInfo, []],
			// ["G2C_WuLinMengZhuPlayerScore"]: [this.onUpdateJiFenInfo, []],
			
			
		}
	}

	onRecvEnter(time) {
		this.endTime = time
		this.start()
		return false
	}

	onRecvLeave(message) {
		this.stop()
		return false
	}

	onUpdateLevel(level){
		this.level = level
		this.lastActor = null
		// this.wulinWnd.refreshLevel()
	}

	onUpdateNpcInfo(npcInfo){
		this.npcInfo = npcInfo
		if (IsFightState() == true) {
            return
        }
		this.npcClearAndCreat()
	}

	// onUpdateJiFenInfo(info){
	// 	this.jifenInfo = info

	// }

	//请求进入地图开始
	requestStart() {
		if (GetServerDay() >= 4 && GetHeroProperty("level") >= 90) {

		} else {
			return MsgSystem.addTagTips(Localize_cns("WULIN_TXT2"))
		}
		
		if (HeroIsInTeam() == true) {
			return MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT49"))
		}
		RpcProxy.call("C2G_EnterWuLinMengZhu")
	}

	//请求离开地图
	requestStop() {
		RpcProxy.call("C2G_LeaveWuLinMengZhu")
	}

	onStart() {
		RegisterEvent(EventDefine.HERO_ENTER_MAP, this.onHeroEnterMap, this)
		RegisterEvent(EventDefine.COMBAT_BEGIN, this.onBattleBegin, this)
		RegisterEvent(EventDefine.COMBAT_END, this.onBattleEnd, this)
		RegisterEvent(EventDefine.ACTOR_GOTFUCOS, this.onActorGotFocus, this)
		RegisterEvent(EventDefine.PLAYER_LEAVE_MAP, this.onPlayerLeaveMap, this)
		// RegisterEvent(EventDefine.NPC_LEAVE_MAP, this.onNpcLeaveMap, this)
		PushUIShow(["MainCityFrame"], ["MainFrame"])	
		StateManager.getInstance().ActiveSubState(state_type.LIVE_ACTIVITY_STATE)
		
		let wnd = WngMrg.getInstance().getWindow("WuLinMapFrame")
		// this.wulinWnd = wnd
		wnd.setDataAndshowWnd(this.endTime)

		let content = Localize_cns("WULIN_TXT12")
		Chat_AddChannelMsg(channelType.SYSTEM, content)

		GetHero().clearFollowAppear()
		
	}

	onStop() {
		if (FightSystem.getInstance().isFight() == true) {
			FightSystem.getInstance().addEndFightHandler(this._Stop, this, null)
		} else {
			this._Stop()	
		}
	}

	_Stop() {
		UnRegisterEvent(EventDefine.HERO_ENTER_MAP, this.onHeroEnterMap, this)
		UnRegisterEvent(EventDefine.COMBAT_BEGIN, this.onBattleBegin, this)
		UnRegisterEvent(EventDefine.COMBAT_END, this.onBattleEnd, this)
		UnRegisterEvent(EventDefine.ACTOR_GOTFUCOS, this.onActorGotFocus, this)
		UnRegisterEvent(EventDefine.PLAYER_LEAVE_MAP, this.onPlayerLeaveMap, this)
		// UnRegisterEvent(EventDefine.NPC_LEAVE_MAP, this.onNpcLeaveMap, this)
		let wnd = WngMrg.getInstance().getWindow("WuLinMapFrame")
		if(wnd.isVisible()){
			wnd.hideWnd()
		}
		this.npcInfo = []
		GetHero().restoreFollowAppear()
		PopUIShow()
		StateManager.getInstance().DeactiveSubState(state_type.LIVE_ACTIVITY_STATE)
		this.clearNpc()
		this.clearTimer()
	}

	// isStart() {
	// 	return this.bStart
	// }

	clearTimer() {
        for (let _ in this.timerList) {
            let timer = this.timerList[_]
            KillTimer(timer)
        }
        this.timerList = {}
	}

	onPlayerLeaveMap(args){
		if(this.lastActor != null && args.actor == this.lastActor){
			this.lastActor = null;
		}
	}

	onActorGotFocus(args){
		if(args==null){
			return
		}
		let actor = args.actor
		let clickTimes = args.times
		
		// 
		//点击NPC的是NPC
		if (actor.getActorType() == actor_Type.ACTOR_TYPE_PLAYER) {
			let roleId = actor.getProperty("id")
			let myId = GetHeroProperty("id")
			actor.doCommand(ActorCommand.SetWuLinChange, true,roleId)
			if(this.lastActor!= null && this.lastActor.getProperty("id") == myId){
				return
			}
			if(this.lastActor != null){
				if(this.lastActor.getProperty("id") == roleId){
					return
				}else{
					this.lastActor.doCommand(ActorCommand.SetWuLinChange, false)
					this.lastActor = actor
				}	
			}else{
				this.lastActor = actor
			}
			
		}
	}

	onBattleBegin() {
		this.clearNpc()
	}

	onBattleEnd() {
		this.npcClearAndCreat()
	}

	npcClearAndCreat(){
		this.clearNpc()
		this.createNpc()
	}

	//清除创建的NPC
	clearNpc(){
		let idList = []
		for (let k in this.mineList) {
			table_insert(idList, tonumber(k))
		}
		for (let i = 0; i < idList.length; i++) {
			let id = idList[i]
			ActorManager.getInstance().deleteNpc(id)
		}
		this.mineList = {}
		// this.npcInfo = []

		// let curLevel = this.level - 1
		// if(curLevel<0){
		// 	curLevel = 0
		// }
		// let curLevelNpcInfo = null
		// if(this.npcInfo && this.npcInfo[curLevel]){
		// 	curLevelNpcInfo =  this.npcInfo[curLevel]
		// }
		// if( curLevelNpcInfo){
		// 	for(let i = 0;i<size_t(curLevelNpcInfo);i++){
		// 		ActorManager.getInstance().deleteNpc(i+1)
		// 	}
		// }

		// for (let i = 1; i < 22; i++) {
		// 	let id = i
		// 	ActorManager.getInstance().deleteNpc(id)
		// }
	}

	// onNpcLeaveMap(args) {
	// 	let id = args.actor.getId()
	// 	if (this.mineList[id] == null) {
	// 		return
	// 	}
	// 	delete this.mineList[id]
	// }

	//创建npc
	createNpc(){
		let flag = false
		if(flag){
			return
		}
		if(size_t(this.npcInfo)<=0){
			return
		}

		let curLevel = this.level - 1
		if(curLevel<0){
			curLevel = 0
		}
		let curLevelNpcInfo =  this.npcInfo[curLevel]
		for(let i = 0;i<size_t(curLevelNpcInfo);i++){
			let pos = curLevelNpcInfo[i]
			if(pos){
				this.createNpcInfo(i,pos)
			}
		}
	}

	createNpcInfo(i,pos){
		let config = GameConfig.WuLinMengZhuConfig[this.level]
		let coltNpcId = config.cNpcId
		let npc = ActorManager.getInstance().getNpc(i+1)
		// let pos = this.getRandLocalPosition(GetHero().getCellX(), GetHero().getCellY())
		if (this.mineList[i+1]) {
			if (npc) {
			npc.setCellXY(pos[0], pos[1])
			return
			}
		}

		let npcInfo: any = {}
		npcInfo["cellx"] = pos[0]
		npcInfo["celly"] = pos[1]
		npcInfo["dir"] = 3
		npcInfo["entryId"] = coltNpcId	//!!
		// this.coltNpcId = GenCharaterId()
		// npcInfo["id"] = this.coltNpcId
		npcInfo["id"] = (i + 1)
		npcInfo["name"] = ""
		npcInfo["param"] = {}
		npcInfo["taskInfo"] = {}

		let _npc = ActorManager.getInstance().createNpc(npcInfo)
		// _npc.doCommand(ActorCommand.SetWuLinChange, false)
		this.mineList[i+1] = true
	}

	// /////////////////////////////////////////////////////////////////
	// //-进入活动关闭窗口
	onHeroEnterMap(index) {
		//let mapId = MapSystem.getInstance().getMapId()
		// let wnd = WngMrg.getInstance().getWindow("WuLinMapFrame")
		// if (StateManager.getInstance().GetCurrentStateType() != state_type.LIVE_ACTIVITY_STATE) {
		// 	PushUIShow(["MainCityFrame"], ["MainFrame"])	
		// 	StateManager.getInstance().ActiveSubState(state_type.LIVE_ACTIVITY_STATE)
		// 	let wnd = WngMrg.getInstance().getWindow("WuLinMapFrame")
		// 	if(wnd.isVisible() == false){
		// 		wnd.setDataAndshowWnd(this.endTime)
		// 	}	
		// }
		// GetHero().clearFollowAppear()
		this.npcClearAndCreat()
	}

}