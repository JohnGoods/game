// TypeScript file
/*
作者:
	
创建时间：

意图：
	抢矿掠夺

公共接口：
	
*/

class Activity_Stronghold extends ActivityBase {

	static MAPID: number = 50029

	npcIdList: any
	strongholdInfoList: any
	recordList: any

	bossActOpenFlag: boolean
	_canOccupyFlag: boolean
	keyClubName: string
	keyPlayerName: string
	clubJoinNum: number

	public initObj(...args: any[]): void {
		this.npcIdList = []
		this.strongholdInfoList = []
		this.recordList = []
		this.bossActOpenFlag = false
		this._canOccupyFlag = false
	}

	onClear() {
		this.npcIdList = []
		this.strongholdInfoList = []
		this.recordList = []
		this.bossActOpenFlag = false
		this.keyClubName = ""
		this.keyPlayerName = ""
		this.clubJoinNum = 0
		this._canOccupyFlag = false
	}

	destory() {

	}

	onPrepareResource() {

	}

	//请求进入地图开始
	requestStart() {
		if (CheckActivityState() == false)
			return

		let mapId = MapSystem.getInstance().getMapId()
		if (mapId == Activity_Stronghold.MAPID) {
			return
		}

		if (CheckEndFightNow() == false)
			return

		if (this.checkWaitStatus() == false) {
			WngMrg.getInstance().showWindow("StrongholdWaitFrame")
			return
		}

		ChangePatrolState(false) //停止巡逻
		RpcProxy.call("C2G_StrongholdMapEnter")
	}

	//请求离开地图
	requestStop() {
		RpcProxy.call("C2G_StrongholdMapLeave")
	}

	onStart() {
		RegisterEvent(EventDefine.HERO_ENTER_MAP, this.onHeroEnterMap, this)
		RegisterEvent(EventDefine.COMBAT_BEGIN, this.onBattleBegin, this)
		RegisterEvent(EventDefine.COMBAT_END, this.onBattleEnd, this)
		RegisterEvent(EventDefine.ACTOR_GOTFUCOS, this.onActorClick, this)

		PushUIShow(["MainCityFrame"], ["MainFrame"])
		StateManager.getInstance().ActiveSubState(state_type.LIVE_ACTIVITY_STATE)

		WngMrg.getInstance().showWindow("StrongholdFrame")
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
		UnRegisterEvent(EventDefine.ACTOR_GOTFUCOS, this.onActorClick, this)

		PopUIShow()
		StateManager.getInstance().DeactiveSubState(state_type.LIVE_ACTIVITY_STATE)

		this.removeNpc()
		this.clubJoinNum = 0
		GetHero().restoreFollowAppear()
	}

	onBattleBegin() {
		this.removeNpc()
	}

	onBattleEnd(args) {
		if (this.bStart && this.bossActOpenFlag) {
			if (args.fightType == opFightResultType.STRONGHOLD && args.winResult == false) {
				this.requestStop()
				MsgSystem.addTagTips(Localize_cns("STRONGHOLD_TEXT50"))
				return
			}
		}
		this.createNpc()
	}

	onActorClick(args) {
		if (StateManager.getInstance().GetCurrentStateType() != state_type.LIVE_ACTIVITY_STATE) {
			return
		}
		if (FightSystem.getInstance().isFight() == true) {
			return
		}
		if (this.bossActOpenFlag == false) {
			return
		}
		let playerInfo = args.actor.getPropertyInfo()
		if (playerInfo) {
			if (IsPlayer(args.actor)) {
				this.attackPlayer(playerInfo.id, playerInfo)
			}
		}
	}

	attackPlayer(playerId, playerInfo) {
		let t: IDialogCallback = {
			onDialogCallback(result: boolean, userData): void {
				if (result == true) {
					// if (GetHeroProperty("faction") <= 0) {
					// 	if (bit.band(playerInfo.status, opStatusType.STATUS_TYPE_TICKET) == opStatusType.STATUS_TYPE_TICKET) {
					// 		return MsgSystem.addTagTips(Localize_cns("STRONGHOLD_TEXT43"))
					// 	}
					// }
					// if (GetHeroProperty("faction") != 0 && GetHeroProperty("faction") == playerInfo["faction"]) {
					// 	return MsgSystem.addTagTips(Localize_cns("STRONGHOLD_TEXT31"))
					// }
					RpcProxy.call("C2G_StrongholdPVP", playerId)
				}
			}
		}
		let str = ""
		if (playerInfo.factionName != "") {
			str = "【" + playerInfo.factionName + "】"
		}
		str += "【" + playerInfo.name + "】"
		MsgSystem.confirmDialog(String.format(Localize_cns("STRONGHOLD_TEXT30"), str), t)
	}

	createNpc() {
		this.removeNpc()
		for (let i in GameConfig.StrongholdConfig) {
			let v = GameConfig.StrongholdConfig[i]

			let npcInfo: any = {}
			let id = GenCharaterId()
			this.npcIdList[id] = v.sIndex
			npcInfo["cellx"] = v.x
			npcInfo["celly"] = v.y
			npcInfo["dir"] = 3
			npcInfo["entryId"] = v.npcEntryId
			npcInfo["id"] = id
			npcInfo["name"] = ""
			npcInfo["param"] = {}
			npcInfo["taskInfo"] = {}

			let npc = ActorManager.getInstance().createNpc(npcInfo)
			npc.setScale(1)
			npc.doCommand(ActorCommand.SetStrongholdName, v.name)
			npc.doCommand(ActorCommand.SetStrongholdOccupyNum, 0, v.occuCount)
		}
		this.updateStrongholdNpc()
	}

	removeNpc() {
		for (let id in this.npcIdList) {
			ActorManager.getInstance().deleteNpc(id)
		}
		this.npcIdList = []
	}

	getIndexByNpcId(id) {
		return this.npcIdList[id] ? this.npcIdList[id] : null
	}

	getNpcIdByIndex(index) {
		for (let id in this.npcIdList) {
			let v = this.npcIdList[id]
			if (v == index) {
				return id
			}
		}
		return null
	}

	updateStrongholdNpc() {
		for (let id in this.npcIdList) {
			let npc = ActorManager.getInstance().getNpc(id)
			if (npc) {
				npc.doCommand(ActorCommand.SetStrongholdOccupying, false)
				let index = this.npcIdList[id]
				let info = this.strongholdInfoList[index]
				if (info) {
					if (info[2] == 1) {
						npc.doCommand(ActorCommand.SetStrongholdOccupying, true)
					}
					let config = GameConfig.StrongholdConfig[index]
					npc.doCommand(ActorCommand.SetStrongholdOccupyNum, info[1], config.occuCount)
				}
			}
		}
	}

	//据点列表-list-old[sId:num, occupyList:[]] -- new[sid, count, selfFlag]
	setStrongholdInfoList(list) {
		this.strongholdInfoList = []
		for (let i in list) {
			let v = list[i]
			if (v.sId) {
				let selfOccupyFlag = 0
				for (let _ in v.occupyList) {
					let _v = v.occupyList[_]
					if (_v[0][0] == GetHeroProperty("id")) {
						selfOccupyFlag = 1
						break
					}
				}
				this.strongholdInfoList[v.sId] = [v.sId, size_t(v.occupyList), selfOccupyFlag]
				this.strongholdInfoList[v.sId].occupyList = v.occupyList
			} else {
				this.strongholdInfoList[v[0]] = v
				this.strongholdInfoList[v[0]].occupyList = []
			}
		}
		this.updateStrongholdNpc()
		FireEvent(EventDefine.STRONGHOLD_UPDATE, null)
	}

	getStrongholdInfoList() {
		return this.strongholdInfoList
	}

	updateStrongholdInfo(info) {
		let selfOccupyFlag = 0
		for (let _ in info.occupyList) {
			let v = info.occupyList[_]
			if (v[0][0] == GetHeroProperty("id")) {
				selfOccupyFlag = 1
				break
			}
		}
		this.strongholdInfoList[info.sId] = [info.sId, size_t(info.occupyList), selfOccupyFlag]
		this.strongholdInfoList[info.sId].occupyList = info.occupyList

		this.updateStrongholdNpc()
		FireEvent(EventDefine.STRONGHOLD_UPDATE, null)
	}

	getStrongholdInfoByIndex(index) {
		return this.strongholdInfoList[index] ? this.strongholdInfoList[index] : null
	}

	setStrongholdRecordList(list) {
		this.recordList = list
		FireEvent(EventDefine.STRONGHOLD_RECORD_UPDATE, null)
	}

	getStrongholdRecordList() {
		return this.recordList || []
	}

	handleStrongholdKeyInfo(endFlag, clubName, playerName) {
		this.bossActOpenFlag = endFlag || false
		this.keyClubName = clubName || ""
		this.keyPlayerName = playerName || ""
		FireEvent(EventDefine.STRONGHOLD_KEY_STATUS_UPDATE, null)
	}

	getStrongholdKeyInfo() {
		return [this.bossActOpenFlag, this.keyClubName, this.keyPlayerName]
	}

	setClubJoinNum(num) {
		this.clubJoinNum = num
		if ((GetHeroProperty("faction") || 0) <= 0) {
			this.clubJoinNum = 0
		}
		FireEvent(EventDefine.STRONGHOLD_CLUB_NUM_UPDATE, null)
	}

	getClubJoinNum() {
		return this.clubJoinNum || 0
	}

	setBossAndOccupyStatus(flag1, flag2) {
		this.bossActOpenFlag = flag1
		this._canOccupyFlag = flag2
	}

	getBossAndOccupyStatus() {
		return [this.bossActOpenFlag, this._canOccupyFlag]
	}

	checkWaitStatus() {
		let info = getSaveRecord(opSaveRecordKey.strongholdDieWait) || []
		if (info[1] && info[1] - GetServerTime() > 0) {
			return false
		}
		return true
	}

	/////////////////////////////////////////////////////////////////
	onHeroEnterMap() {
		let mapId = MapSystem.getInstance().getMapId()
		if (mapId != Activity_Stronghold.MAPID) {
			WngMrg.getInstance().hideWindow("StrongholdFrame")
			return
		}
		GetHero().clearFollowAppear()
		this.createNpc()
	}

}