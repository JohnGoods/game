
var s_ActorSystem: FightActorSystem = null;

var clientActorId = 0
var clientActorPos = FUNNAL_ACTOR_POS + 1

//获取actor
function GetFightActor(actorId) {
	return s_ActorSystem.get_actor(actorId)
}

//获取actor，根据阵型和方位
function GetFightActorByPos(side, pos) {
	return s_ActorSystem.getActorByPos(side, pos)
}

//根据阵型方位，获取像素坐标
function GetFightActorPosXY(side, pos) {
	return s_ActorSystem.getActorPos(side, pos)
}


function GetFightActorDefaultPosXY(side, pos) {
	return s_ActorSystem.getActorDefaultPos(side, pos)
}

function GetFightActorList() {
	return s_ActorSystem.getActorList()
}


//获取宠物（怪物）本地属性
function GetFightActorConfig(actor) {
	if (actor.classname != "FightActor") {
		return [null, null]
	}

	let entryId = actor.getProperty("entry")
	let type_id = actor.getProperty("type_id")

	if (type_id == null) {
		return [null, null]
	}

	let config = null
	let scopeInfo: any = {}
	scopeInfo.AttackScope = 0 //默认
	scopeInfo.BodyScope = 0
	scopeInfo.sex = 0					//1表示女性

	if (objectType.OBJECT_TYPE_PET == type_id ||
		objectType.OBJECT_TYPE_ASSIST == type_id ||
		objectType.OBJECT_TYPE_PET_HELPER == type_id) {
		config = GameConfig.PetConfig[entryId]

		if (config == null) {
			TLog.Error("getConfigInfo PetConfig[%d]==null", entryId)
			return [null, null]
		}

		scopeInfo.AttackScope = config.AttackScope
		scopeInfo.BodyScope = config.BodyScope
		scopeInfo.sex = config.sex
	} else if (objectType.OBJECT_TYPE_PLAYER == type_id) {
		config = GameConfig.ActorRoleConfig[entryId]
		if (config == null) {
			TLog.Error("getConfigInfo ActorRoleConfig[%d]==null", entryId)
			return [null, null]
		}

		scopeInfo.AttackScope = config.AttackScope || 8
		scopeInfo.BodyScope = config.BodyScope || 8
		scopeInfo.sex = actor.getProperty("setId")
	} else if (objectType.OBJECT_TYPE_XIANLV == type_id) {
		config = GameConfig.ActorXianLvConfig[entryId]
		if (config == null) {
			TLog.Error("getConfigInfo ActorXianLvConfig[%d]==null", entryId)
			return [null, null]
		}

		scopeInfo.AttackScope = config.AttackScope || 8
		scopeInfo.BodyScope = config.BodyScope || 8
		scopeInfo.sex = actor.getProperty("setId")
	} else {
		if (GameConfig.MonsterConfig[entryId] == null) {
			TLog.Error("getConfigInfo MonsterConfig[%d]==null", entryId)
			return [null, null]
		}

		config = table_copy(GameConfig.MonsterConfig[entryId])
		config.name = config.Name

		let scopeConfig = GameConfig.MonsterScopeConfig[config.model]
		if (scopeConfig == null) {
			TLog.Error("getConfigInfo MonsterScopeConfig[%d]==null", config.model)
		} else {
			scopeInfo.AttackScope = scopeConfig.AttackScope
			scopeInfo.BodyScope = scopeConfig.BodyScope
			scopeInfo.sex = scopeConfig.sex
		}

	}

	return [config, scopeInfo]
}

function GreateFunnalInfo(fSide, entryId, info) {
	fSide = fSide || fightSide.FIGHT_RIGHT

	let fighterPlayer = info
	fighterPlayer.type_id = objectType.OBJECT_TYPE_FUNNAL
	fighterPlayer.id = info.id//FIGHT_FUNNAL_ID[fSide]
	fighterPlayer.side = fSide
	//fighterPlayer.pos = FUNNAL_ACTOR_POS
	fighterPlayer.maxHp = 300
	fighterPlayer.hp = 300
	fighterPlayer.maxRp = 300
	fighterPlayer.rp = 100
	fighterPlayer.name = ""
	fighterPlayer.entry = 0
	//fighterPlayer.entry = DefendSystem.getInstance().getModelIdWithEffectId(entryId)//600001//entryId || 18000//entryList[fighterPlayer.id % 2 + 1]

	//编辑器数据
	fighterPlayer.model = entryId
	//return fighterPlayer
}

function GreateBackerInfo(fSide, entryId, result, resultInfo) {
	fSide = fSide || fightSide.FIGHT_RIGHT

	clientActorId = clientActorId - 1
	clientActorPos = clientActorPos + 1

	let fighterPlayer: any = {}
	fighterPlayer.type_id = objectType.OBJECT_TUPE_BACKER
	fighterPlayer.id = clientActorId
	fighterPlayer.side = fSide
	fighterPlayer.pos = clientActorPos
	fighterPlayer.maxHp = 300
	fighterPlayer.hp = 300
	fighterPlayer.maxRp = 300
	fighterPlayer.rp = 100
	fighterPlayer.name = ""
	fighterPlayer.entry = entryId || 18000

	fighterPlayer.result = result
	fighterPlayer.resultInfo = resultInfo

	//编辑器数据
	fighterPlayer.model = entryId
	return fighterPlayer
}

function CreateHelperClientPos() {
	clientActorPos = clientActorPos + 1

	return clientActorPos
}

function IsActorInBlackList(id) {
	return s_ActorSystem.isInBlackList(id)
}



class FightActorSystem extends TClass {
	actorList: any;
	// begin_x: number;
	// begin_y: number;

	beginShow: boolean;
	blackList: any[];
	tickLock: boolean;
	delayDeleteList: any[];
	posDefine: any;

	mpList: any;

	public initObj(...args: any[]): void {

		s_ActorSystem = this
		this.onClear()
	}

	onPrepare() {
		//this.posDefine = POS_MAPPING_DEFINE
		//let W = gb.main.viewport.GetW()
		//let H = gb.main.viewport.GetH()
		//let WINDOW_W = 800
		//let WINDOW_H = 480
		//let bit_x = 1//W / WINDOW_W
		//let bit_y = 1//H / WINDOW_H
		this.posDefine = table_copy(POS_MAPPING_DEFINE)

		// for (let i in FIGHT_POSITION_DEFINE) {
		// 	let row = FIGHT_POSITION_DEFINE[i]

		// 	for (let _ in row) {
		// 		let line = row[_]

		// 		let v = line[1]
		// 		v[1] = v[1] / SceneManager.getInstance().getZoomScale()
		// 		v[2] = v[2] / SceneManager.getInstance().getZoomScale()
		// 	}
		// }
	}

	onClear() {
		if (this.actorList) {
			for (let i in this.actorList) {
				let actor = this.actorList[i]

				if (actor) {
					actor.deleteObj()
				}
			}
		}

		this.actorList = {}
		// this.begin_x = 0
		// this.begin_y = 0

		this.beginShow = false
		this.blackList = []

		//lock tick过程中delete角色的locker
		this.tickLock = false
		this.delayDeleteList = []

		//以roleId为索引保存奥义技能值MP
		this.mpList = {}
	}

	onBeginFight() {
		// var p = SceneManager.getInstance().getCameraViewBeginXY();
		// this.begin_x = p.x
		// this.begin_y = p.y

	}


	//添加角色
	create_actor(info) {
		if (this.actorList[info.id]) {
			return false
		}
		let actor = FightActor.newObj()
		//let pos = this.getActorPos(info.side, info.pos)
		//let W = gb.main.viewport.GetW()
		//
		//if(info.side == fightSide.FIGHT_RIGHT ){
		//	pos.x = W - 100 * (1 - Math.floor(info.pos / 4))//pos.x + (W / 2)//W+this.begin_x
		//}else{
		//	pos.x = 100 * (1 - Math.floor(info.pos / 4))//pos.x - (W / 2)//this.begin_x
		//}
		//
		////战斗角色的坐标，一定要在地图以内
		//let width, height = SceneManager.getInstance().getMapSize()
		//pos.x = Math_util.clamp(pos.x, 17, width-17)
		//pos.y = Math_util.clamp(pos.y, 17, height-17)
		//TLog.Debug(width ,height, pos.x, pos.y)

		actor.create(info)
		this.actorList[info.id] = actor

		if (info.type_id == objectType.OBJECT_TYPE_FUNNAL) {
			FireEvent(EventDefine.COMBAT_FIGHT_ADD_ALIEN, null)
		}

		return true
	}

	//移除角色
	remove_actor(combatId) {
		if (this.tickLock) {
			JsUtil.arrayInstert(this.delayDeleteList, combatId)
			return
		}

		FireEvent(EventDefine.COMBAT_FIGHTER_REMOVE, CombatFighterEvent.newObj(combatId))
		let actor = this.actorList[combatId]
		if (actor) {
			actor.deleteObj()
			actor = null
		}

		delete this.actorList[combatId]
	}

	//获取角色
	get_actor(combatId) {
		let actor = this.actorList[combatId]
		if (!actor && typeof combatId == "number" && combatId < 15) {
			TLog.Warn("the %d actor is ! exist!!!!!!!", combatId || 0)
		}
		return actor
	}

	//角色每一帧播放行为
	tick(delay, pause?) {
		if (pause) {
			return
		}

		let flag = true
		let empty = true
		this.tickLock = true

		for (let i in this.actorList) {
			let actor = this.actorList[i]

			if (actor) {
				empty = false
				actor.tick(delay)

				if (actor.isDeadState() != true) {
					flag = flag && actor.isCompleteBack()
				}
			}
		}
/*
		//if(flag && ! this.beginShow && ! empty && FightSystem.getInstance().isReFight() == false ){
		if (flag && !this.beginShow && !empty) {
			let [fightType, _] = FightSystem.getInstance().getCurFightType()
			if (fightType == opFightType.FIGHT_TYPE_COMMON) {
				//WngMrg.getInstance().showWindow("FightStartFrame")
				MsgSystem.showScreenEffect(effectIndex.FightStart);
			}

			//帮手显示对白
			for (let _ in this.actorList) {
				let actor = this.actorList[_]

				let [config] = GetFightActorConfig(actor)
				if(config){
					if (config.lines && config.lines != "") {
						actor.doCommand(ActorCommand.AddChatBubble, config.lines, false)
					}
				}
				
			}

			this.beginShow = true
			FightSystem.getInstance().startWaitServer()
			let message = GetMessage(opCodes.C2G_FIGHT_RESTART)
			return SendGameMessage(message)
		}
*/
		//
		this.tickLock = false
		for (let _ in this.delayDeleteList) {
			let id = this.delayDeleteList[_]

			this.remove_actor(id)
		}
		this.delayDeleteList = []
	}

	//根据配表获取角色位置
	getActorPos(side, pos) {
		let actor = GetFightActorByPos(side, pos)
		if (actor) {
			return actor.resetToPos()
		}

		return this.getActorDefaultPos(side, pos)
	}

	//根据ID获取角色初始位置
	getActorInitPos(combatId) {
		let actor = this.actorList[combatId]
		if (!actor) {
			return null
		}
		var side = actor.getSide()
		var pos =  actor.getPos()
		return this.getActorPos(side, pos)
	}

	//根据ID，方向，分前，后获取到达的目标位置
	getTargetPos(combatId, dir) {
		let actor = this.get_actor(combatId)
		if (!actor) {
			return null
		}
		var side = actor.getSide()
		var pos =  actor.getPos()
		let position = this.getActorPos(side, pos)
		let offset_x = 60
		let offset_y = 30
		if (side == 1) {
			offset_x = -offset_x
			offset_y = -offset_y
		}
		if (dir == "before") {
			position.x = position.x + offset_x
			position.y = position.y + offset_y
		} else if (dir == "after") {
			position.x = position.x - offset_x
			position.y = position.y - offset_y
		}

		return position
	}

	//服务器的位置，从1开始
	getActorDefaultPos(side, pos) {
		//let index = this.posDefine[side][pos]
		//let m, n = index[1], index[2]
		//let point = FIGHT_POSITION_DEFINE[m][n][1]

		//一般情况下side 只能是1或者2，但服务器数据偶尔异常，此处容错
		if (!POS_MAPPING_DEFINE[side]) {
			return { ["x"]: 0, ["y"]: 0 }
		}

		let point = POS_MAPPING_DEFINE[side][pos]

		if (!point) {
			point = POS_MAPPING_DEFINE[side][1]
		}
		var posxy:any = SceneManager.getInstance().screenXYtoMapXY(point[0], point[1])
		posxy.x = posxy.x + (IGlobal.stageWidth - IGlobal.contentWidth)/2 //屏幕适配偏移
		//posxy.x = this.begin_x+point[0], //SceneManager.getInstance():screenXYtoMapXY(point[1], point[2])
		//posxy.y = this.begin_y+point[1] 

		return posxy
	}

	getActorList() {
		return this.actorList
	}


	//根据位置获取角色
	getActorByPos(desSide, desPos) {
		for (let i in this.actorList) {
			let v = this.actorList[i]

			let side = v.getSide()
			let pos = v.getPos()
			if (side == desSide && pos == desPos) {
				return v
			}
		}
		return null
	}

	setBeginShow() {
		this.beginShow = true
	}

	refreshFinishState() {
		for (let _ in this.actorList) {
			let actor = this.actorList[_]

			if(actor.isDeadState() && actor.isVisible() == true){
				//var cellx, celly = actor.getCellXY()
				var cp = actor.getCellXY();
				EffectManager.getInstance().createSceneEffect(effectIndex.Death, cp.x, cp.y, true)
				Player.prototype.setVisible.call(actor, false)
				actor.bDeath = true
				GameSound.getInstance().playEffect(SystemSound.effect_Death)
			}
		}
	}

	resetAllActorPosition() {
		for (let _ in this.actorList) {
			let actor = this.actorList[_]

			let pos = GetFightActorDefaultPosXY(actor.getSide(), actor.getPos())
			actor.setMapXY(pos.x, pos.y)
		}
	}

	resetActorDefaultTarget() {
		for (let _ in this.actorList) {
			let actor = this.actorList[_]

			actor.clearDefaultTarget()
		}
	}

	updateServerFighterList() {
		let list = []
		let count = 0

		for (let id in this.actorList) {
			let actor = this.actorList[id]

			let [hp, maxHP] = actor.getHP()

			if (hp == 0 || actor.isVisible() == false) {
				//actor.setHP(maxHP, maxHP)
				//actor.setVisible(true)
				actor.changeDieState()
			}

			//以防填表出错报错
			if (actor.isDeadState() == true) {
				hp = 0
				TLog.Error("FightActorSystem.updateServerFighterList the fighter %d is error dead!", id)
			}

			if (hp < maxHP && actor.getPos() <= DEFAULT_FIGHT_ACTOR_COUNT) {
				let elem = [id, hp]
				JsUtil.arrayInstert(list, elem)
				count = count + 1
			}
		}

		let message = GetMessage(opCodes.C2G_FIGHT_SYNC_SHOWEND)
		message.count = count
		message.fighterHPList = list
		return SendGameMessage(message)
	}

	updateBlackList(id) {
		JsUtil.arrayInstert(this.blackList, id)
	}

	isInBlackList(id) {
		let flag = table_isExist(this.blackList, id)
		return flag
	}

	//奥义技值
	setRoleMp(roleId, mp) {
		this.mpList[roleId] = mp
	}

	getRoleMp(roleId) {
		let mp = this.mpList[roleId] || 0
		mp = MathUtil.clamp(mp, 0, ROLE_MP_MAX)

		return [mp, ROLE_MP_MAX]
	}

	isMpFull(roleId) {
		let mp = this.mpList[roleId] || 0

		return mp >= ROLE_MP_MAX
	}

	changeRoleInfo(index, roleId, value) {
		if (index == "mp") {
			let mpinfo = this.getRoleMp(roleId)
			let mp = mpinfo[0]
			mp = mp + value

			this.setRoleMp(roleId, mp)
		}

		FireEvent(EventDefine.COMBAT_ROLE_MP_UPDATE, CombatRoleInfoEvent.newObj(roleId, index))
	}
}