//表演动作分了3个流程
//1.起手动作
//2.表演动作
//3.Power显示

//吟唱:
//1.吟唱开始：RCODE_SPELL_PREPARE，则开始起手动作，如果起手动作执行完毕，则循环起手动作
//2.吟唱结束：RCODE_SPELL_PREPARE_HIT,开始表演动作，表演动作完毕，则结束FightResult


//持续施法：
//1.持续施法开始：RCODE_SPELL_INTERVAL，则开始起手动作，表演动作。表演动作结束后，循环表演动作
//2.持续施法过程：RCODE_SPELL_INTERVAL_HIT， 跳过起手动作，直接出手（包括相应power效果）
//2.持续施法结束：RCODE_SPELL_INTERVAL_END， 直接结束FightResult


//begin(){
//finish(){
//
//replayreadyAction(){
//replayShowAction(){
//
//isSpellInterval(){
//isSpellPrepare(){
//isSpellPrepareHit(){
//
//dumpEvent( event){
// let pairs = pairs
// let ipairs = ipairs
let FightShowState: any = {
	ready: 1,//起手
	Show: 2,//出手
	End: 3,//收手
}

let COMBAT_OBJECT_ID = 10000

class FightResult extends TClass {

	//调试使用
	//let s_fightResultId = 0

	mFightSystem: FightSystem;

	bFinish: boolean;
	bBegin: boolean;

	id: number;
	nowTime: number;

	action_list_ready: Fight_BaseAction[];
	action_list_show: Fight_BaseAction[];
	action_list_end: Fight_BaseAction[];

	powerList: Fight_BasePower[];
	stateList: Fight_BaseState[];

	bUseLockEvent: boolean;
	bLockEvent: boolean;
	lockEventList: any[];
	lockEventDeep: number;
	curCastTime: number;


	bStartFirstAction: boolean;
	actionObjectPool: any;
	actionObjectIdPool: any;
	idSeed: number;

	showState: number;

	bSpellIntervalHitShowLast: boolean;
	doubleHitPowerList: any[];

	speed: number;

	result: any;
	inorgeRestore: boolean
	casterMapX: number;
	casterMapY: number;
	casterScale: number;
	casterRotate: number;
	casterAlpha: number;
	damageList: any;

	cur_action_list: Fight_BaseAction[];
	maxTime: number;

	public initObj(...args: any[]): void {

		//s_fightResultId = s_fightResultId + 1

		this.bFinish = false
		this.bBegin = false
		this.id = GetResultId()//s_fightResultId

		this.nowTime = 0

		this.action_list_ready = []
		this.action_list_show = []
		this.action_list_end = []


		this.powerList = []
		this.stateList = []

		//recvEvent时候会导致堆栈很深，所以分帧优化处理
		//但是析构时候就不能分帧处理了
		this.bUseLockEvent = true
		this.bLockEvent = false
		this.lockEventList = []
		this.lockEventDeep = 0

		this.curCastTime = 0

		//以准备动作完成为标识（攻击动作开始后）result表演
		//不可被其他result打断
		this.bStartFirstAction = false //标志第一个起手动作
		this.actionObjectPool = {} //对象池，用来管理特效、分身等
		this.actionObjectIdPool = {}
		this.idSeed = COMBAT_OBJECT_ID //保证不和actor的ID范围冲突

		this.showState = -1

		this.bSpellIntervalHitShowLast = false
		this.doubleHitPowerList = []

		this.speed = 1

		this.result = null;

		this.inorgeRestore = false;
		this.mFightSystem = FightSystem.getInstance();
	}

	destory() {

		//最后一次刷新，如果之前表演刷新过了，就不会重复刷
		this.flushPowerAction()
		this.restoreCasterState()
		this.setAllTargetBeingAttacked(false)

		this.finish(true)//this.bFinish = true
		//////////////////////////////////////////////////
		for (let i = 0; i < this.action_list_ready.length; i++) {
			let action = this.action_list_ready[i]

			action.deleteObj()
		}
		this.action_list_ready = []

		for (let i = 0; i < this.action_list_show.length; i++) {
			let action = this.action_list_show[i]

			action.deleteObj()
		}
		this.action_list_show = []

		for (let i = 0; i < this.action_list_end.length; i++) {
			let action = this.action_list_end[i]

			action.deleteObj()
		}
		this.action_list_end = []
		//////////////////////////////////////////////////

		for (let i = 0; i < this.powerList.length; i++) {
			let power = this.powerList[i]

			power.deleteObj()
		}
		this.powerList = []

		for (let i = 0; i < this.stateList.length; i++) {
			let state = this.stateList[i]

			state.deleteObj()
		}

		for (let _ in this.actionObjectPool) {
			let v = this.actionObjectPool[_]

			v.deleteObj()
		}
		this.actionObjectPool = null
		this.actionObjectIdPool = null

		this.stateList = []
		FireEvent(EventDefine.COMBAT_FIGHT_RESULT_END, CombatResultEvent.newObj(this.result))
		// let actor = GetFightActor(this.result.caster)
		// if (actor) {
		// 	MsgSystem.addChannel(channelType.SYSTEM, "xxxxxx" + this.result.spellId + " " + this.result.code + " " + actor.getProperty("pos"))
		// }

		//调试显示打击技能总伤害值
		if (GAME_DEBUG) {
			//let strList: any = {}
			for (let _ in this.result.fightPowers) {
				let power = this.result.fightPowers[_]

				if (power.effect == powerEffects.EFFECT_HP_LESS) {
					let actor = GetFightActor(this.result.caster)
					if (actor) {
						let side = actor.getSide(), pos = actor.getPos()

						let emActor = GetFightActor(power.target)
						if (emActor) {
							let eSide = emActor.getSide(), ePos = emActor.getPos()
							let [fightType, campId] = this.mFightSystem.getCurFightType()
							let [curRound, maxRound] = this.mFightSystem.getCurShowFightRound()
							//let maxTime = opFightLimitTime[fightType] || 230000

							let [config, scopeInfo] = GetFightActorConfig(actor)
							let [emConfig, emScopeInfo] = GetFightActorConfig(emActor)
							let colorXml = "#lime"
							let emColorXml = "#cyan"
							if (side == fightSide.FIGHT_LEFT) {
								colorXml = "#cyan"
								emColorXml = "#lime"
							}

							let msgString = String.format(Localize_cns("DEMAGE_SCORSE_TIPS"), colorXml + side + "_" + config.name + "#rf", this.result.spellId, emColorXml + eSide + "_" + emConfig.name + "#rf", "#red" + power.point + "#rf") + "  " + curRound

							//MsgSystem.AddTagTips(msgString)
							MsgSystem.addChannel(channelType.SYSTEM, msgString)
						}
					}
				}
			}
		}
	}



	//保存状态
	saveCasterState(actor?) {
		if (!actor) {
			actor = GetFightActor(this.result.caster)
			if (actor == null) {
				return
			}
		}

		var mp = actor.getMapXY();
		this.casterMapX = mp.x;
		this.casterMapY = mp.y
		this.casterScale = actor.getScale()
		this.casterRotate = actor.getRotate()

		let colorInfo = actor.getActorColor()
		this.casterAlpha = colorInfo.alpha
	}

	//复制状态
	copyCasterState(result) {
		this.casterMapX = result.casterMapX
		this.casterMapY = result.casterMapY
		this.casterScale = result.casterScale
		this.casterRotate = result.casterRotate
		this.casterAlpha = result.casterAlpha
	}

	//设置是否恢复原来状态
	inorgeRestoreCater(flag) {
		this.inorgeRestore = flag || false
	}

	//恢复状态
	restoreCasterState() {
		if (this.inorgeRestore) {
			return
		}

		let actor = GetFightActor(this.result.caster)
		if (actor == null || !this.casterMapX) {			//临时处理，需修复
			return
		}
		if (this.casterMapX == null || this.casterMapY == null) {
			return
		}

		actor.setMapXY(this.casterMapX, this.casterMapY)
		actor.setScale(this.casterScale)
		actor.setRotate(this.casterRotate)
		//actor.setAlpha(this.casterAlpha)
		actor.setFlipXY(false, false)
		actor.clearFade()

		if (actor.getSide() == fightSide.FIGHT_LEFT) {
			actor.setDir(ActorDirMap.RightBottom)
		} else {
			actor.setDir(ActorDirMap.LeftUp)
		}

		actor.restoreFightAI()
	}


	analyzeResult(result) {
		let srcConfig = this.mFightSystem.getConfigSystem().getConfig(result)
		let destConfig = table_copy(srcConfig)  //复制配置表，避免程序改了配置表

		this.result = result

		if (result.spellId) {
			this.speed = 1//SkillSystem.getInstance().getSkillSpeed(result.spellId)
		}

		this.maxTime = destConfig.maxTime || MaxShowTime //每个阶段的最大表演时间

		//action必须有caster存在
		if (GetFightActor(result.caster || 0)) {
			for (let i = 0; i < destConfig.elem_list_ready.length; i++) {
				let v = destConfig.elem_list_ready[i]

				let action = this.createAction(v)
				JsUtil.arrayInstert(this.action_list_ready, action)
			}

			for (let i = 0; i < destConfig.elem_list_show.length; i++) {
				let v = destConfig.elem_list_show[i]

				let action = this.createAction(v)
				JsUtil.arrayInstert(this.action_list_show, action)
			}

			for (var i = 0; i < destConfig.elem_list_end.length; i++) {
				var v = destConfig.elem_list_end[i]
				var action = this.createAction(v)
				this.action_list_end.push(action)
			}
		}


		//被打断文字提示放到最后（避免黑屏下看不到）
		//由于配表有可能在技能中表演了power（包含被打断），因此特别将之延后处理
		let flag = false
		for (let _ in result.fightPowers) {
			let powerInfo = result.fightPowers[_]

			if (powerInfo.effect == powerEffects.EFFECT_BREAK) {
				powerInfo.times = powerInfo.times + 1

				if (flag == false) {
					flag = true
				}
			}
		}

		if (flag == true) {
			result.castCount = result.castCount + 1
		}
	}

	setAllTargetBeingAttacked(b) {
		let caster = this.getActionObjectByName("caster")[0]
		let flag = false

		let actor_list = this.getActionObjectByName("targetList")
		for (let _ = 0; _ < actor_list.length; _++) {
			let actor = actor_list[_]

			actor.setBeingAttacked(b)
//			if (!flag && caster && actor.getSide() != caster.getSide()) {
//				//caster.faceToActor(actor)
//				var targetP = actor.getMapXY()
//				var casterP = caster.getMapXY()
//				if (targetP.x > casterP.x) {
//					caster.setDir(ActorDirMap.Right)
//				} else {
//					caster.setDir(ActorDirMap.Left)
//				}
//
//				flag = true
//			}
		}
	}

	analyzeDamage() {
		//根据目标的受击动作次数来决定掉血信息的显示次数
		//每次掉血的数值=总伤害/受击动作次数
		//为了表现更好一些，再将以上结果进行一次随机，但要保证总掉血量与服务器发过来的总伤害是相等的
		//如果总伤害量为0（例如闪避、无敌状态等），则只在响应事件那里播放对应的信息

		let damageCount = 0
		let actorInjuryList: any = {}
		this.damageList = {}

		for (let _ = 0; _ < this.action_list_ready.length; _++) {
			let v = this.action_list_ready[_]

			if (v.actionConfig.content.code == "ATTACKED_PLAYANIM") {
				damageCount = damageCount + 1
				this.tidyActorInjury(actorInjuryList, v.actionConfig.content.param1)
			}
		}
		for (let _ = 0; _ < this.action_list_show.length; _++) {
			let v = this.action_list_show[_]

			if (v.actionConfig.content.code == "ATTACKED_PLAYANIM") {
				damageCount = damageCount + 1
				this.tidyActorInjury(actorInjuryList, v.actionConfig.content.param1)
			}
		}
		for (let _ = 0; _ < this.action_list_end.length; _++) {
			let v = this.action_list_end[_]

			if (v.actionConfig.content.code == "ATTACKED_PLAYANIM") {
				damageCount = damageCount + 1
				this.tidyActorInjury(actorInjuryList, v.actionConfig.content.param1)
			}
		}

		let injuryList: any = {}
		let defendState: any = {}
		let targetFlag: any = {}

		for (let i = 0; i < this.result.powerCount; i++) {
			let powerInfo = this.result.fightPowers[i]
			if (powerInfo && actorInjuryList[powerInfo.target] != null) {
				if (powerInfo.effect == powerEffects.EFFECT_HP_LESS) {
					injuryList[powerInfo.target] = injuryList[powerInfo.target] || 0
					injuryList[powerInfo.target] = injuryList[powerInfo.target] + powerInfo.point

					//记录对应tagetd的flag，暴击的优先级最高，因为是模拟数据，所以只能粗略表现
					if(powerInfo.flag == powerXPFlag.CRITICAL ){
						targetFlag[powerInfo.target] = powerInfo.flag
					}else if(! targetFlag[powerInfo.target] ){
						targetFlag[powerInfo.target] = powerInfo.flag
					}

					powerInfo.flag = powerXPFlag.NOT_SHOW
				} else if (defendState[powerInfo.target] == null) {
					if (powerInfo.effect == powerEffects.EFFECT_ABSORB || powerInfo.effect == powerEffects.EFFECT_DODGE
						|| powerInfo.effect == powerEffects.EFFECT_IMMUNIZE) {
						defendState[powerInfo.target] = powerInfo.effect
					}
				}
			}


		}

		//测试先取平均值
		let sumNumber = 0
		for (let combatId in injuryList) {
			let sumDamage = injuryList[combatId]
			//遍历injuryList是为了确保以power为准
			let count = actorInjuryList[combatId]
			//let point = Math.floor(sumDamage / count)
			let list = MathUtil.getRandomArray(count, sumDamage, 0.5)
			sumNumber = sumNumber + sumDamage

			for (let i = 0; i < count; i++) {
				//if(i < count ){
				//	sum = sum + point
				//}else{
				//	point = sumDamage - sum		//保证数值不会出现误差
				//}
				let point = list[i]

				let p: any = {}
				p.effect = powerEffects.EFFECT_HP_LESS
				p.target = combatId
				p.point = point
				p.flag = targetFlag[combatId] || powerXPFlag.NORMAL
				p.times = 1

				this.damageList[combatId] = this.damageList[combatId] || []
				JsUtil.arrayInstert(this.damageList[combatId], p)
				JsUtil.arrayInstert(this.doubleHitPowerList, p)
			}
		}
		this.doubleHitPowerList["sumDamage"] = sumNumber

		//检漏
		for (let combatId in defendState) {
			let effect = defendState[combatId]

			if (injuryList[combatId] == null || injuryList[combatId] == 0) {
				let count = actorInjuryList[combatId]
				for (let i = 0; i < count; i++) {
					let p: any = {}
					p.effect = effect
					p.target = combatId
					p.flag = targetFlag[combatId] || powerXPFlag.NORMAL
					p.times = 1

					this.damageList[combatId] = this.damageList[combatId] || []
					JsUtil.arrayInstert(this.damageList[combatId], p)
				}
			}
		}
	}

	tidyActorInjury(list, targetName) {
		targetName = targetName || "targetList"
		let targetNameList = splitString(targetName, ",")
		let actorList = []

		for (let _ in targetNameList) {
			let name = targetNameList[_]

			let t = this.getActionObjectByName(name)
			table_merge(actorList, t)
		}

		for (let _ in actorList) {
			let actor = actorList[_]

			let combatId = actor.getCombatId()
			list[combatId] = list[combatId] || 0

			list[combatId] = list[combatId] + 1
		}
	}

	getDamagePowerList(combatId): any[] {
		if (!this.damageList || !this.damageList[combatId]) {
			return []
		}

		var p = this.damageList[combatId].shift()

		var t = (p == null) && [] || [p]
		return t
	}

	begin(result, straight) {
		if (!straight) {
			let flag = false
			let actor = GetFightActor(result.caster)
			if (actor && table_isExist(FIGHT_ACOTCONTROL_MAPPING, actor.getProperty("type_id"))) {
				flag = actor.delayBeginResult(this, result)
				//this.mFightSystem.addFighterList({GreateBackerInfo(2, 18000, this, result)})
			}

			this.analyzeResult(result)
			this.analyzeDamage()

			//一般buff的持续时间比较短，而客户端表演有延时，以防
			//buff的持续时间过短，造成删除buff的result比创建的（power部分）要早
			//造成buff特效（客户端）一直没有被清除，在result开始的时候即创建buff，（暂行方案先创建特效，忽略后面注释）但不创建特效
			//到power表演的时候再创建buff对应的特效
			// this.handleBuffAhead()

			if (flag == true) {
				return
			}
		}

		return this._begin(result)
	}

	//从头开始执行（内部用）
	_begin(result) {
		//this.analyzeResult(result)
		//this.analyzeDamage()

		if (this.bBegin == true) {
			return
		}
		this.bBegin = true

		let showState = -1
		let justPower = false

		if (this.isSpellInterval()) {
			this.inorgeRestore = true
			showState = FightShowState.ready

			// let fightShowSystem = this.mFightSystem.getShowSystem()
			// fightShowSystem.showCasterFightCharater(this.result, "fanji", 200)						//显示出招人的头顶文字
		} else if (this.isSpellIntervalHit()) {
			showState = FightShowState.Show
			this.inorgeRestore = true

			let fightShowSystem = this.mFightSystem.getShowSystem()
			fightShowSystem.showCasterFightCharater(this.result, "lianji")						//显示出招人的头顶文字
		} else if (this.isSpellIntervalEnd()) {
			showState = FightShowState.End
			this.inorgeRestore = true

			let fightShowSystem = this.mFightSystem.getShowSystem()
			fightShowSystem.showCasterFightCharater(this.result)								//隐藏出招人的头顶文字
		} else if (this.isSpellPrepareHit()) {
			showState = FightShowState.Show

		} else if (this.isRcodePower()) { //只表演power
			this.flushPowerAction()
			justPower = true
		} else {
			showState = FightShowState.ready
		}
		if (justPower == false) {
			let actor = GetFightActor(result.caster)
			if (actor) {
				actor.moveStop()
			} else {
				showState = FightShowState.End
			}
		}

		if (showState > 0) {
			this.changeShowState(showState)
		}

		//显示吟唱中字体
		if (this.isSpellPrepare()) {
			this.showSpellPre(true)

			//吟唱开始时头顶冒泡
			let fightShowSystem = this.mFightSystem.getShowSystem()
			fightShowSystem.showSkillBubbleWord(this.result)
		} else if (this.isSpellInterval()) {
			//持续施法开始时头顶冒泡
			let fightShowSystem = this.mFightSystem.getShowSystem()
			fightShowSystem.showSkillBubbleWord(this.result)
		} else if (this.isSpellHit()) {
			let fightShowSystem = this.mFightSystem.getShowSystem()
			fightShowSystem.showSkillBubbleWord(this.result)
		} else if (this.isRcodePower() == false) {
			//清除技能描述
			let fightShowSystem = this.mFightSystem.getShowSystem()
			fightShowSystem.showSkillBubbleWord(this.result, true)
		}

		if (GAME_DEBUG) {
			if (this.isRcodePower() == false) {
				if (!GetFightActor(result.caster)) {
					TLog.Error("FightResult.begin the result's caster is empty! %s", result.caster)
					table_print(result)
					//io.read()
				}
			}
		}

		this.saveCasterState()
		this.setAllTargetBeingAttacked(true)
	}

	changeShowState(state) {
		this.showState = state

		this.cur_action_list = []//null
		if (this.showState == FightShowState.ready) {
			//TLog.Debug("changeShowState ready")
			this.cur_action_list = this.action_list_ready

		} else if (this.showState == FightShowState.Show) {
			//TLog.Debug("changeShowState Show")
			this.cur_action_list = this.action_list_show

		} else if (this.showState == FightShowState.End) {
			//TLog.Debug("changeShowState End")
			this.cur_action_list = this.action_list_end
		}

		this.nowTime = 0
	}

	changeNextShowState() {

		if (this.showState == FightShowState.ready) {

			if (this.isSpellPrepare()) {//吟唱过程，重播起手动作
				if (this.isSpecialFight()) {

					this.finish()
				} else {
					this.replayreadyAction(true)
				}
			} else if (this.isSpellInterval()) { //持续施法，只表演一次起手
				// if (this.isSpecialFight()) {

					this.finish()
				// } else {
				// 	this.replayreadyAction()//this.finish()
				// }
			} else {
				this.changeShowState(FightShowState.Show)
			}

		} else if (this.showState == FightShowState.Show) {
			//持续施法不表演收手，除非是（RCODE_SPELL_INTERVAL_END）设了bSpellIntervalHitShowLast
			if (this.isSpellIntervalHit()) {// && !this.bSpellIntervalHitShowLast) {
				// if (this.isSpecialFight()) {

					this.finish()
				// } else {
				// 	this.replayShowAction()
				// }
			} else {
				//TLog.Debug("ccccccccccccccccccc", this.isSpellIntervalHit(), this.bSpellIntervalHitShowLast)
				this.changeShowState(FightShowState.End)//收手
			}

		} else if (this.showState == FightShowState.End) {
			this.changeShowState(-1)//表演结束

		}

		if (this.showState == -1) {
			this.finish()
		}
	}

	isSpecialFight() {
		//modify:movie
		//let [isMovie, _] = MovieSystem.getInstance().isPlayingMovie()
		let isMovie = false;
		let flag = this.mFightSystem.isFightVideo()
		flag = flag || this.mFightSystem.isClientFighting()
		flag = flag || isMovie

		return flag && this.mFightSystem.getShowSystem().isResultQueueEmpty()
	}

	handleBuffAhead() {
		for (let _ = 0; _ < this.result.fightPowers.length; _++) {
			let powerInfo = this.result.fightPowers[_]

			if (!powerInfo.ahead) {
				if (powerInfo.effect == powerEffects.EFFECT_ADD_BUFF) {
					//TLog.Debug("555555555555555555554444444444444", powerInfo.buff, powerInfo.target)
					let buff = Buff.newObj(powerInfo.buff, powerInfo.life, powerInfo.count, powerInfo)
					BuffSystem.getInstance().addBuff(powerInfo.target, buff, true)

					powerInfo.ahead = true			//标识已经提前处理
				} else if (powerInfo.effect == powerEffects.EFFECT_SPIRIT_CD) {
					//FireEvent(EventDefine.COMBAT_FIGHT_SPIRIT_CD, FunnalCDEvent.newObj(powerInfo.side, powerInfo.time))
					this.createPowerList([powerInfo])
					powerInfo.ahead = true
				} else if (powerInfo.effect == powerEffects.EFFECT_REBOUND) {
					this.createPowerList([powerInfo])
					powerInfo.ahead = true
				} else if (powerInfo.effect == powerEffects.EFFECT_BREAK) {
					let actor = GetFightActor(powerInfo.target)
					if (actor) {
						actor.breakSkill()
					}
				}
			}
		}
	}

	//暂停
	isPause() {
		let casterActor = GetFightActor(this.result.caster)
		if (casterActor && casterActor.isPause()) {
			return true
		}
		return false
	}

	tick(delay) {
		//TLog.Debug("FightResult.tick", this.bFinish)
		if (this.bFinish) {
			return true
		}
		if (this.bBegin == false) {
			return
		}
		this.lockEventDeep = 0

		let actor = GetFightActor(this.result.caster)
		if (actor) {
			if (actor.isDeadState()) {
				return true
			}
		}


		this.nowTime = this.nowTime + delay
		this.tickDelayEvent()

		let count = 0
		//for(let i = 0; i < this.cur_action_list.length; i++){
		//let action = this.cur_action_list[i]

		for (let i = 0; i < this.cur_action_list.length; i++) {
			let action = this.cur_action_list[i]
			action.tick(delay)
			if (action.isFinish()) {
				count = count + 1
			}
		}


		//for(let i = 0; i < this.powerList.length; i++){
		//let power = this.powerList[i]

		for (let i = 0; i < this.powerList.length; i++) {
			let power = this.powerList[i]
			power.tick(delay)
		}

		//for(let i = 0; i < this.stateList.length; i++){
		//let state = this.stateList[i]

		for (let i = 0; i < this.stateList.length; i++) {
			let state = this.stateList[i]
			state.tick(delay)
		}


		//编辑器模式或者debug模式才检查
		if (GAME_MODE == GAME_TOOL) {
			if (this.nowTime >= this.maxTime) {
				let err_list = []
				for (let i = 0; i < this.cur_action_list.length; i++) {
					let action = this.cur_action_list[i]

					if (action.isFinish() == false) {
						let str = String.format("[%d]%s", i, action.classname)
						JsUtil.arrayInstert(err_list, str)
					}

				}
				if (err_list.length > 0) {
					let err_str = table_concat(err_list, "|")
					MsgSystem.confirmDialog_YES(String.format(Localize_cns("FIGHT_RESULT_MAX_TIME"), this.result.spellId) + err_str)
					TLog.Error("spellid:%d", this.result.spellId)
					for (let i = 0; i < this.cur_action_list.length; i++) {
						let action = this.cur_action_list[i]

						TLog.Error("index:%d %s: isBegin:%s isFinish:%s", i, action.classname, tostring(action.isBegin()), tostring(action.isFinish()))
					}
				}
			}
		}

		if (count == this.cur_action_list.length || this.nowTime >= this.maxTime) {
			this.changeNextShowState()//转移到下个状态
		}

		return this.bFinish
	}

	finish(destory?) {
		if (this.bFinish == true) {
			return
		}
		let [time, _] = FightSystem.getInstance().getCurFightTime()
		//TLog.Debug("FightResult.finish result %d is finish!	%d	%d	%d %d", this.id, time, this.result.round, this.result.code, this.result.caster )
		//TLog.Debug("FightResult.finish result %d is finish!	%d	%d	%d", this.id, this.result.secIndex || 0, this.result.time, this.result.code)//this.result.caster, )

		if (!destory) {
			let flag = false
			this.damageList = this.damageList || {}
			for (let _ in this.damageList) {
				let list = this.damageList[_]

				if (list.length != 0) {
					flag = true
					break
				}
			}
			if (flag) {
				TLog.Error("FightResult.finish the actor damage is error!")
				table_print(this.damageList)
			}
		}

		if (this.isSpellPrepare()) {
			this.showSpellPre(false)
		}
		//if(this.isSpellHit() ){
		//	let fightShowSystem = this.mFightSystem.getShowSystem()
		//	fightShowSystem.showSkillBubbleWord(this.result)
		//}

		this.bFinish = true
	}

	isFinish() {
		return this.bFinish
	}

	tickDelayEvent() {
		if (this.lockEventList.length > 0) {
			let tempEventList = this.lockEventList

			this.lockEventList = []
			TLog.Warn("FightResult.tickDelayEvent count:%d", tempEventList.length)
			for (let _ = 0; _ < tempEventList.length; _++) {
				let v = tempEventList[_]

				this.recElemResult(v)
			}
		}
	}

	onRecvElemResult(event) {

		for (let i = 0; i < this.cur_action_list.length; i++) {
			let v = this.cur_action_list[i]

			v.recElemResult(event)
		}

	}

	//收到事件
	recElemResult(event) {
		if (this.bFinish) {
			TLog.Debug("FightResult.recElemResult the result %d is finished", this.id)
			return
		}

		if (this.bUseLockEvent && this.bLockEvent) {

			this.lockEventDeep = this.lockEventDeep + 1
			if (this.lockEventDeep >= 3) { //太深了才加入缓存
				JsUtil.arrayInstert(this.lockEventList, event)
				return
			}
		}

		this.bLockEvent = true
		this.onRecvElemResult(event)
		this.bLockEvent = false

	}

	dumpEvent(event) {
		TLog.Debug("////////////////////////////////-")
		TLog.Debug("FightResult.dumpEvent spellId:", this.id, this.result.spellId)
		//for(let _ in this.finishConditionList){
		//let v = this.finishConditionList[_]

		//	TLog.Debug("finish", v.elem_name, v.event_name, v.finish)
		//}

		for (let i = 0; i < this.action_list_ready.length; i++) {
			let v = this.action_list_ready[i]

			TLog.Debug("action:", i, v.elemInfo.code)
			TLog.Debug(v.elemName, "finish:", v.isFinish(), "begin:", v.isBegin())
		}

		for (let i = 0; i < this.action_list_show.length; i++) {
			let v = this.action_list_show[i]

			TLog.Debug("action:", i, v.elemInfo.code)
			TLog.Debug(v.elemName, "finish:", v.isFinish(), "begin:", v.isBegin())
		}

		for (let i = 0; i < this.action_list_end.length; i++) {
			let v = this.action_list_end[i]

			TLog.Debug("action:", i, v.elemInfo.code)
			TLog.Debug(v.elemName, "finish:", v.isFinish(), "begin:", v.isBegin())
		}


		TLog.Debug("////////////////////////////////-")
		//io.read()
	}


	getActorIdListFromResult(actorName) {
		let target_list = []
		if (actorName == null) {
			return target_list
		}

		if (actorName == "targetList") {
			let targetList = this.result["targetList"]
			let actor = GetFightActor(this.result["caster"])
			//如果角色已经不在了，就不做攻击表演了
			if (!actor || !targetList) {
				return target_list
			}

			let side = actor.getSide()
			//判断第10位是否为1判断己方敌方，原来的最后一位判断容易与负值重叠造成误判
			if (bit.band(targetList, 0x00080000) == 0) {
				side = side % 2 + 1
			}

			for (let i = 1; i <= 30; i++) {
				if (bit.band(targetList, Math.pow(2, i - 1)) != 0) {
					let actor = GetFightActorByPos(side, i)
					if (actor) {
						JsUtil.arrayInstert(target_list, actor.getCombatId())
					}
				}
			}
			return target_list
		}

		JsUtil.arrayInstert(target_list, this.result[actorName])
		return target_list
	}

	getPower(index) {
		let powerList = []
		for (let i = 0; i < this.result.fightPowers.length; i++) {
			let power = this.result.fightPowers[i]

			if (power.times == index && !table_isExist(ELEM_IGNORE_POWER, power.effect)) {
				JsUtil.arrayInstert(powerList, power)
			}
		}
		return powerList
	}

	getState(index) {
		let stateList = []
		for (let i in this.result.fightPowers) {
			let power = this.result.fightPowers[i]

			if (power.times == index && power.effect == powerEffects.EFFECT_STATUS) {
				JsUtil.arrayInstert(stateList, power)
			}
		}
		return stateList
	}

	createAction(elem) {
		var actionType = elem.content.code

		var actionObj = ENUM_FIGHT_ACTION[actionType]
		//TLog.Debug("ENUM_ACTION[actionType]", actionClassName, actionType)
		var action = actionObj.newObj(this, elem)
		//action.actionConfig = elem //FightConfigSystem.readActionConfig
		return action
	}


	//创建Power
	createPowerList(powerList: any[], callBack?, obj?, playSomeSound?) {
		//for i, info in ipairs(powerList) do
		for (var i = 0; i < powerList.length; i++) {
			var info = powerList[i];
			if (ENUM_FIGHT_POWER[info.effect]) {
				var powerObj = ENUM_FIGHT_POWER[info.effect]
				var power = powerObj.newObj(this, info, callBack, obj, playSomeSound)
				power.play()

				//table.insert(this.powerList, power)
				this.powerList.push(power);
			} else {
				TLog.Debug("FightResult.createPowerList The PowerEfffect is %d", info.effect)
			}
		}
	}

	createStateList(stateList) {
		for (var i = 0; i < stateList.length; i++) {
			var info = stateList[i];

			var stateObj = ENUM_FIGHT_STATE[info.status]
			if (stateObj) {
				var state = stateObj.newObj(this, info)
				state.play()

				this.stateList.push(state)
			} else {
				TLog.Error("FightResult.createStateList status object is ! exsit! %d", info.status)
			}
		}
	}


	getCurCastTime() {
		return this.curCastTime
	}

	showNextPower(playSomeSound?) {
		this.curCastTime = this.curCastTime + 1

		let powerList = this.getPower(this.curCastTime)
		let stateList = this.getState(this.curCastTime)

		if (powerList.length > 0) {
			this.createPowerList(powerList, null, null, playSomeSound)
		}
		if (stateList.length > 0) {
			this.createStateList(stateList)
		}
	}

	flushPowerAction() {
		if (this.curCastTime >= this.result.castCount) {
			return
		}
		//power的事件，不用缓冲事件，避免tick延时处理
		this.bUseLockEvent = false
		while (this.curCastTime < this.result.castCount) {
			this.showNextPower()
		}

		//检漏
		JsUtil.objectForEach(GetFightActorList(), (actor, combatId) => {
			while (true) {
				var powerList = this.getDamagePowerList(combatId)
				if (powerList.length == 0) {//队列内只有1项
					break
				}

				var t = powerList[0]
				//t.flag = 0
				this.createPowerList(powerList)
			}
		});
	}

	showTargetPower(target, playSomeSound) {
		if (!target) {
			return
		}

		let targetId = target.getCombatId()
		let powerList = []
		for (let i = 0; i < this.result.fightPowers.length; i++) {
			let power = this.result.fightPowers[i]

			if (power.target == targetId && !table_isExist(ELEM_IGNORE_POWER, power.effect)) {
				//power的表演只有一次
				power.times = 0

				JsUtil.arrayInstert(powerList, power)
			}
		}

		if (powerList.length > 0) {
			this.createPowerList(powerList, null, null, playSomeSound)
		}
	}

	//重新开始起手动作
	replayreadyAction(reshow?) {
		TLog.Warn("replayreadyAction casterid:%d spellid:%d", this.result.caster, this.result.spellId)

		if (reshow) {
			for (let _ = 0; _ < this.action_list_ready.length; _++) {
				let v = this.action_list_ready[_]

				v.reset()
			}

			for (let _ = 0; _ < this.action_list_show.length; _++) {
				let v = this.action_list_show[_]

				v.reset()
			}

			for (let _ = 0; _ < this.action_list_end.length; _++) {
				let v = this.action_list_end[_]

				v.reset()
			}
		} else {
			for (let _ = 0; _ < this.action_list_ready.length; _++) {
				let v = this.action_list_ready[_]

				v.finish()
			}

			for (let _ = 0; _ < this.action_list_show.length; _++) {
				let v = this.action_list_show[_]

				v.finish()
			}

			for (let _ = 0; _ < this.action_list_end.length; _++) {
				let v = this.action_list_end[_]

				v.finish()
			}
		}

		this.changeShowState(FightShowState.ready)
	}

	//重新执行showAction
	replayShowAction(reShow?) {
		TLog.Warn("replayShowAction casterid:%d spellid:%d", this.result.caster, this.result.spellId)

		if (reShow) {
			for (let _ = 0; _ < this.action_list_show.length; _++) {
				let v = this.action_list_show[_]

				v.reset()
			}
			for (let _ = 0; _ < this.action_list_end.length; _++) {
				let v = this.action_list_end[_]

				v.reset()
			}
		} else {
			for (let _ = 0; _ < this.action_list_show.length; _++) {
				let v = this.action_list_show[_]

				v.finish()
			}

			for (let _ = 0; _ < this.action_list_end.length; _++) {
				let v = this.action_list_end[_]

				v.finish()
			}
		}

		this.changeShowState(FightShowState.Show)

	}

	//是否只表演power
	isRcodePower() {
		return this.result.code == resultOptions.RCODE_POWER || this.result.code == resultOptions.RCODE_ADD_MONSTER
	}

	//普通表演技能
	isSpellHit() {
		return this.result.code == resultOptions.RCODE_SPELL_HIT
	}

	//是否持续施法开始
	isSpellInterval() {
		return this.result.code == resultOptions.RCODE_SPELL_INTERVAL
	}

	//是否持续施法，中间过程结果包
	isSpellIntervalHit() {
		return this.result.code == resultOptions.RCODE_SPELL_INTERVAL_HIT
	}

	//是否持续施法结束
	isSpellIntervalEnd() {
		return this.result.code == resultOptions.RCODE_SPELL_INTERVAL_END
	}

	setSpellIntervalHitShowLast(b) {
		this.bSpellIntervalHitShowLast = b
	}


	//是否吟唱过程
	isSpellPrepare() {
		return this.result.code == resultOptions.RCODE_SPELL_PREPARE
	}

	//是否吟唱结束
	isSpellPrepareHit() {
		return this.result.code == resultOptions.RCODE_SPELL_PREPARE_HIT
	}


	isSpellActions() {
		return this.showState != FightShowState.ready
	}

	isLastShowAction(action) {

		let index = 0
		let bFind = false
		for (let i = 0; i < this.action_list_ready.length; i++) {
			let v = this.action_list_ready[i]

			index = index + 1
			if (v == action) {
				bFind = true
				break
			}
		}

		if (bFind == false) {
			for (let i = 0; i < this.action_list_show.length; i++) {
				let v = this.action_list_show[i]

				index = index + 1
				if (v == action) {
					break
				}
			}
		}

		return (index == this.action_list_ready.length + this.action_list_show.length)
	}

	breakSkill() {
		//let code = this.result.code
		//if(code == resultOptions.RCODE_SPELL_PREPARE ||
		//	code == resultOptions.RCODE_SPELL_INTERVAL ){
		//	this.finish()
		//	
		//}else{
		//	TLog.Error("actorid:%d isn't Spell prepare || interval", this.result.caster)	
		//}

		//直接finish
		this.finish()
	}



	addLocalMessage() {
		if (!GAME_DEBUG) {
			return
		}

		let actor = GetFightActor(this.result.caster)
		let spellId = this.result.spellId
		if (!spellId || !GameConfig.FightActionConfig[spellId] || this.result.side == fightSide.FIGHT_LEFT || spellId == 801) {
			return
		}

		let point = ""
		for (let _ in this.result.fightPowers) {
			let power = this.result.fightPowers[_]

			if (power.effect == powerEffects.EFFECT_HP_LESS) {
				point = "#red" + power.point + "#rf#space"
			} else if (power.effect == powerEffects.EFFECT_HP_PLUS) {
				point = "#blue" + power.point + "#rf#space"
			}
		}


		MsgSystem.addTagTips(point + String.format(Localize_cns("FIGHT_SKILL_SHOW"), actor.getName(), GameConfig.FightActionConfig[spellId].name, spellId))
	}


	addActionObject(name, object) {
		if (object == null) {
			return
		}

		let combatId = object.getCombatId()
		TLog.Assert(combatId == 0)
		TLog.Assert(name && name != "")

		this.idSeed = this.idSeed + 1
		combatId = this.idSeed
		object.setCombatId(combatId)

		if (this.actionObjectIdPool[name] == null) {
			this.actionObjectIdPool[name] = []
		}

		//管理ID
		let objectIdList = this.actionObjectIdPool[name]
		JsUtil.arrayInstert(objectIdList, combatId)

		//管理object
		this.actionObjectPool[combatId] = object

	}

	removeActionObject(name, object) {
		let combatId = object.getCombatId()

		if (this.actionObjectPool[combatId]) {

			let objectIdList = this.actionObjectIdPool[name]
			TLog.Assert(objectIdList)
			table_remove(objectIdList, combatId)

			// 删除对象
			delete this.actionObjectPool[combatId]
			//object.deleteObj() 
		}

	}

	getActionObject(id) {
		if (id < COMBAT_OBJECT_ID) {
			return GetFightActor(id)
		}
		return this.actionObjectPool[id]
	}

	getActionObjectByName(name) {
		let list = []

		let actor = GetFightActor(this.result.caster)
		if (actor == null) {
			return list
		}

		let actor_list = GetFightActorList()

		//施法者
		if (name == "caster") {
			JsUtil.arrayInstert(list, actor)

			//受击者
		} else if (name == "targetList") {
			let targetList = this.result["targetList"]
			//对于RCODE_POWER，RCODE_SPELL_PREPARE，RCODE_SPELL_INTERVAL，RCODE_SPELL_INTERVAL_END是没有targetList的		

			if (GAME_DEBUG) {
				if (this.isSpellHit() || this.isSpellPrepareHit() || this.isSpellIntervalHit()) {
					if (!targetList || targetList == 0) {
						//	MsgSystem.ConfirmDialog_YES(String.format(Localize_cns("FIGHT_RESULT_NO_TARGET"), this.result.spellId, this.result.code))
					}
				}
			}

			if (targetList && targetList != 0) {
				let side = actor.getSide()
				//判断第10位是否为1判断己方敌方，原来的最后一位判断容易与负值重叠造成误判
				if (bit.band(targetList, opBattleSideTag) == 0) {
					side = side % 2 + 1
				}

				for (let i = 1; i <= PET_COUNT; i++) {
					if (bit.band(targetList, Math.pow(2, i-1)) != 0) {
						let actor = GetFightActorByPos(side, i)
						if (actor) {
							JsUtil.arrayInstert(list, actor)
						}
					}
				}
			}

		} else if (name == "mySide") {	//我方

			let casterSide = actor.getSide()
			for (let _ in actor_list) {
				let v = actor_list[_]

				if (v.getSide() == casterSide) {
					JsUtil.arrayInstert(list, v)
				}
			}

		} else if (name == "enemySide") { //敌方
			let casterSide = actor.getSide()
			for (let _ in actor_list) {
				let v = actor_list[_]

				if (v.getSide() != casterSide) {
					JsUtil.arrayInstert(list, v)
				}
			}
			//特效,分身...
		}else if(StringUtil.stringMatch(name, /target(\d+)/) ){
			let index = tonumber(StringUtil.stringMatch(name, /target(\d+)/)[0])
			if (index) {
				let targetList = this.result["targetList"]
				if (targetList && targetList != 0) {
					let side = actor.getSide()
					//判断第10位是否为1判断己方敌方，原来的最后一位判断容易与负值重叠造成误判
					if (bit.band(targetList, opBattleSideTag) == 0) {
						side = side % 2 + 1
					}

					for (let i = 1; i <= PET_COUNT; i++) {
						if (bit.band(targetList, Math.pow(2, i-1)) != 0) {
							let actor = GetFightActorByPos(side, i)
							if (actor && actor.isDeadState() == false) {
								index = index - 1

								if (index == 0) {
									JsUtil.arrayInstert(list, actor)
									break
								}
							}
						}
					}
				}
			}
		} else {
			let objectIdList = this.actionObjectIdPool[name]
			if (objectIdList) {
				for (let _ = 0; _ < objectIdList.length; _++) {
					let id = objectIdList[_]

					JsUtil.arrayInstert(list, this.actionObjectPool[id])
				}
			}

		}

		return list
	}

	getCasterOriginXY() {
		return newPos(this.casterMapX, this.casterMapY)
	}

	showSpellPre(visible) {
		let actor = GetFightActor(this.result.caster)
		if (actor) {
			actor.setSpellPreState(visible, visible)
		}
	}

	isActorResultEffect(targetId, effect) {
		let flag = false
		for (let _ in this.result.fightPowers) {
			let powerInfo = this.result.fightPowers[_]

			if (powerInfo.target == targetId) {
				if (powerInfo.effect == effect) {
					flag = true
					break
				}
			}
		}

		return flag
	}

	//连击伤害显示
	showDoubleHit(powerInfo) {
		if (this.mFightSystem.isPauseSkill() == false) {
			return
		}

		if (!table_isExist(this.doubleHitPowerList, powerInfo)) {
			return
		}

		if (powerInfo.effect != powerEffects.EFFECT_HP_LESS) {
			return
		}

		//let wnd = WngMrg.getInstance().getWindow("FightDoubleHitFrame")
		//wnd.showDoubleHit(powerInfo.point, this.doubleHitPowerList["sumDamage"])
	}

	getActionSpeed(speed) {
		return speed * this.speed
	}

	getActionDuration(time) {
		return time / this.speed
	}
}