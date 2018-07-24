class FightActor extends Player {

	aiTime: number;
	mFightSystem: FightSystem;
	mActorManager: ActorManager;

	fightAI: FightBaseAI;

	cur_hp: number;
	total_hp: number;
	cur_mp: number;
	total_mp: number;
	cur_rp: number;
	total_rp: number;
	combat_id: number;
	side: number;
	pos: number;
	name: string;
	fModelId: number;
	alphaFlag: number;//用以判定当前是否因技能改变透明度

	tempActionName: string;
	tempActionLoop: boolean;
	mPuppet: FightActor[];


	completeBack: boolean;
	attackedColor: any;
	attackedDelay: number;


	attackedRef: number;
	awardCount: number;
	bDeath: boolean;
	bFightPause: boolean;
	spellPreState: boolean;
	nDeadFlash: number;
	bSaveAnimPause: boolean;
	attackedPos: any;

	//状态相关动作（逻辑动作）
	//此处的controller列表只作索引以及强制完成用，不处理移除和加入
	stateContrlList: any[];
	helperList: any[];
	host: any;
	beHelper: number;
	sourceColor: any;
	spellAddUp:any;

	control: ActorControlBase;

	tickIndex:number;
	spellIntervalTick:number;				//连击-持续施法出手次数

	///////////////////////////////Pet类相关
   	shouHunEffect:Effect;


	public initObj(...args: any[]): void {
		this.actorType = actor_Type.ACTOR_TYPE_COMBAT_CHARACTER

		this.mFightSystem = FightSystem.getInstance();
		this.mActorManager = ActorManager.getInstance();

		this.aiTime = 0
		this.fightAI = null

		this.cur_hp = 0
		this.total_hp = 0
		this.cur_mp = 0
		this.total_mp = 0
		this.cur_rp = 0
		this.total_rp = 0
		this.combat_id = 0
		this.side = 0
		this.pos = 0
		this.name = ""
		this.fModelId = 0
		this.alphaFlag = 0			//用以判定当前是否因技能改变透明度

		this.tempActionName = ""
		this.tempActionLoop = true
		this.mPuppet = []

		this.completeBack = false

		//战斗时就不处理优化了，因为有些角色就是从不可见的地方出来
		//this.clearOptimzeFlag()

		this.attackedColor = { red: 255, green: 255, blue: 255, alpha: 255 }
		this.attackedDelay = 0


		this.attackedRef = 0 //被攻击数目

		this.bDeath = false
		this.bFightPause = false
		//非通用状态
		this.spellPreState = false
		this.nDeadFlash = -1

		this.bSaveAnimPause = false
		//this.setTouchEnable(true)
		this.setUpdateAnimAlways(true)

		//状态相关动作（逻辑动作）
		//此处的controller列表只作索引以及强制完成用，不处理移除和加入
		this.stateContrlList = []
		this.helperList = []
		this.host = null
		this.beHelper = 0
		this.sourceColor = { red: 255, green: 255, blue: 255, alpha: 255 }
		this.spellAddUp = {}
		this.tickIndex = 0
		this.spellIntervalTick = -1

		RegisterEvent(EventDefine.COMBAT_FIGHTER_DIE_END, this.onFighterDie, this)
		RegisterEvent(EventDefine.COMBAT_FIGHTER_BUFF_UPDATE, this.updateActorBuff, this)
	}

	destory() {
		UnRegisterEvent(EventDefine.COMBAT_FIGHTER_DIE_END, this.onFighterDie, this)
		UnRegisterEvent(EventDefine.COMBAT_FIGHTER_BUFF_UPDATE, this.updateActorBuff, this)
		if (this.fightAI) {
			this.fightAI.deleteObj()
			this.fightAI = null
		}

		//清除身上的buff
		BuffSystem.getInstance().clearActorBuff(this.getCombatId())
		if (this.host) {
			this.host.removeHelper(this)
		}

		this.host = null

		for (let _ in this.helperList) {
			let helper = this.helperList[_]

			helper.setHost(null)
		}
		this.helperList = []
		this.clearPuppet()
	}

	onEnterMap() {
		super.onEnterMap()
		//设置子状态
		this.stateMrg.setState(characterState.globalState_combat)
	}

	onPropertyChange() {

	}

	setVisible(visible) {
		if (this.bDeath) {
			return
		}
		super.setVisible(visible)
	}

	fighterDeadAnimNotify(notify) {
		if (notify == "end") {
			//let cellx, celly = this.getCellXY()
			//EffectManager.getInstance().createSceneEffect(effectIndex.Death, cellx, celly, true)
			super.setVisible(false)

			this.bDeath = true
			GameSound.getInstance().playEffect(SystemSound.effect_Death)
			return
		}
	}

	startAttackedColor(lTime?) {
		//this.changeShader(map.IRenderActor.Shader_ColorPure)
		//this.setAlpha(this.attackedColor.alpha)
		this.setColor(this.attackedColor.red, this.attackedColor.green, this.attackedColor.blue)
		this.attackedDelay = lTime || 150
	}

	stopAttackedColor() {
		//this.changeShader(map.IRenderActor.Shader_Normal)

		this.setColor(255, 255, 255)
		this.attackedDelay = 0
	}

	setActorColor(index, num) {
		if (!this.sourceColor[index]) {
			return
		}

		this.sourceColor[index] = num
	}

	getActorColor() {
		return this.sourceColor
	}

	addAttackedMoveAction() {
		if (this.control) {
			return
		}

		var casterPoint = this.getFighterCurMapXY()
		var result = this.mFightSystem.getShowSystem().getShowResult(this.getCombatId())
		if (result) {
			casterPoint = result.getCasterOriginXY()
		}

		var myPoint = this.getMapXY()
		if (MathUtil.checkScope(casterPoint.x, casterPoint.y, myPoint.x, myPoint.y, 15) == false) {
			return
		}

		var side = this.getSide()
		var fromPos = this.getAttackedPos()
		var l = Math.pow(-1, side + 1) * 20
		var toX = fromPos.x + l * Math.cos(Math.PI / 2 + FIGHT_MAP_ANGLE), toY = fromPos.y + l * Math.sin(Math.PI / 2 + FIGHT_MAP_ANGLE)

		//后退
		var recedeControl = ActorControl_LineMoveTime.newObj(100, fromPos.x, fromPos.y, toX, toY)

		//返回
		var backControl = ActorControl_LineMoveTime.newObj(100, toX, toY, fromPos.x, fromPos.y)

		var sequenceControl: ActorControl_Sequence = ActorControl_Sequence.newObj()
		sequenceControl.addControl(recedeControl)
		sequenceControl.addControl(backControl)
		sequenceControl.setFinishCallback(this.fininshControlAction, this)

		this.addControl(sequenceControl)
		//actor:setAutoPerspectEnable(false) //忽视透视效果
		//actor:doCommand(ActorCommand.SetShadowVisible, false, null)	//隐藏阴影
		this.control = sequenceControl
	}

	fininshControlAction() {
		//TLog.Assert(this.control)
		let control = this.control
		this.control = null
		if (!control) {
			return
		}

		this.removeControl(control)
		control.finish(this)
		control.deleteObj()
	}

	onStateChange(oldState: number, curState: number): boolean {
		let bHandle = false
        if (curState == characterState.actionState_move) {
            this.changeAction("run", 1.0, true)
            this.curState = curState

            bHandle = true
        } else if (curState == characterState.actionState_idle) {
            this.changeAction("idle", 1.0, true)
            this.curState = curState

            bHandle = true
        }
        this.updateInsideEffectState(oldState, curState)

		let stateMrg = this.getStateMrg()
		//待机和跑步动作的处理，基类已经处理了
		if (bHandle == false && stateMrg.isActionState(curState)) {
			if (this.tempActionName != "") {
				//let loop = true
				//死亡和受击，不循环播放
				if (curState == characterState.actionState_dead) {
					//curState == characterState.actionState_attacked	){
					this.tempActionLoop = false
				}
				let animSpeed = this.getAnimSpeed()
				this.changeAction(this.tempActionName, animSpeed, this.tempActionLoop)
				this.tempActionName = ""
				this.tempActionLoop = true
			}
		}


		if (oldState == characterState.actionState_attacked) {
			this.stopAttackedColor()
		}

		//如果上个状态是移动，当前状态不是移动，就停止移动
		if (curState != characterState.actionState_move &&
			oldState == characterState.actionState_move) {
			this.moveStop()
		}

		return bHandle
	}

	onAnimOneCycle(action_id) {
		//受击一次，就自动恢复到idle
		if (this.isAttackedState()) {
			this.fininshControlAction()
			this.changeIdleState()
		} else if (this.isDeadState()) {
			let animSpeed = this.getAnimSpeed()
			this.changeAction("idle", animSpeed, true)
		}
	}

	onMoveStop(args) {
		Character.prototype.onMoveStop.call(this, args);

		//左边的人，面朝右边
		if (this.side == fightSide.FIGHT_LEFT) {
			this.setDir(ActorDirMap.RightBottom)
		} else {
			this.setDir(ActorDirMap.LeftUp)
		}
	}


	create(info) {
		//if(! GAME_DEBUG ){
		let name = info.name
		info.name = ""
		let spritLayer = null
		//}
		let dir = ActorDirMap.RightBottom
		if (info.side == fightSide.FIGHT_RIGHT) {
			dir = ActorDirMap.LeftUp
		}

		let pos = GetFightActorPosXY(info.side, info.pos)
		var viewSize = SceneManager.getInstance().getCameraViewSize();
		var W = viewSize.w

//		if (info.side == fightSide.FIGHT_RIGHT) {
//			pos.x = W - 100 * (1 - Math.floor(info.pos / 4))//pos.x + (W / 2)//W+this.begin_x
//		} else {
//			pos.x = 100 * (1 - Math.floor(info.pos / 4))//pos.x - (W / 2)//this.begin_x
//		}

		//战斗角色的坐标，一定要在地图以内
		var width = viewSize.w, height = viewSize.h
		// pos.x = MathUtil.clamp(pos.x, 17, width - 17)
		// pos.y = MathUtil.clamp(pos.y, 17, height - 17)

		this.setMapXY(pos.x, pos.y)
		this.setDir(dir)
		this.enterMap(spritLayer)

		if (spritLayer == null) {//(GAME_MODE != GAME_TOOL) {
			if (info.type_id == objectType.OBJECT_TYPE_PLAYER) {
				//player以profession和sexId以确定模型和头像
				//主角和宠物显示名字
				info.name = name

				info.vocation = info.entry
				this.mActorManager.buildPlayerAppear(this, info)
				this.setPropertyInfo(info)
			} else if (info.type_id == objectType.OBJECT_TYPE_PET) {
				//主角和宠物显示名字
				info.name = name

				this.mActorManager.buildPetAppear(this, info)
				this.setPropertyInfo(info)

				//预加载进攻图
				//let imageName = PetSystem.getInstance().getPetFullImage(info.entry, "attack")
				//image_set.preLoadImage(imageName)

			} else if (info.type_id == objectType.OBJECT_TYPE_MONSTER) {
				this.mActorManager.buildMonsterAppear(this, info)
				this.setPropertyInfo(info)

			} else if (info.type_id == objectType.OBJECT_TYPE_XIANLV) {							//仙侣
				this.mActorManager.buildXianLvAppear(this, info)
				this.setPropertyInfo(info)
			} else if (info.type_id == objectType.OBJECT_TYPE_TIANXIAN) {						//天仙
	     		this.mActorManager.buildActorCommonAppear(this, info)
				this.setPropertyInfo(info)
			} else if (info.type_id == objectType.OBJECT_TYPE_TIANNV) {							//天女
				this.mActorManager.buildTianNvAppear(this, info)
				this.setPropertyInfo(info)
			} else if (info.type_id == objectType.OBJECT_TYPE_FUNNAL) {
				GreateFunnalInfo(info.side, info.entry, info)

				this.mActorManager.buildMonsterAppear(this, info)
				this.setPropertyInfo(info)

				this.setScale(1.2)
				//
				//this.setHost(GetFightActor(1))
			} else if (info.type_id == objectType.OBJECT_TYPE_HELPER
				|| info.type_id == objectType.OBJECT_TYPE_FULLHELPER) {
				this.mActorManager.buildMonsterAppear(this, info)
				this.setPropertyInfo(info)

				this.setHost(GetFightActor(info.host))
			} else if (info.type_id == objectType.OBJECT_TYPE_ASSIST) {
				this.mActorManager.buildPetAppear(this, info)
				this.setPropertyInfo(info)
			} else if (info.type_id == objectType.OBJECT_TYPE_GHOST) {
				this.mActorManager.buildMonsterAppear(this, info)
				this.setPropertyInfo(info)

				this.setHost(GetFightActor(info.host))
			} else if (info.type_id == objectType.OBJECT_TYPE_PET_HELPER) {
				this.mActorManager.buildPetAppear(this, info)
				this.setPropertyInfo(info)

				this.setHost(GetFightActor(info.host))
			} else if (info.type_id == objectType.OBJECT_TYPE_TELEPORT) {
				this.mActorManager.buildMonsterAppear(this, info)
				this.setPropertyInfo(info)

				this.setHost(GetFightActor(info.host))
			} else {
				this.mActorManager.buildMonsterAppear(this, info)
				this.setPropertyInfo(info)
			}
		} else {
			this.loadModel(20001)
			this.setPropertyInfo(info)
			this.doCommand(ActorCommand.SetName, name)	//隐藏阴影
		}


		this.setCombatId(info.id)
		this.setSide(info.side)
		this.setPos(info.pos)

		this.setHP(info.hp, info.maxHp)
		//this.setMP(info.mp, info.maxMp)
		// this.setRP(info.rp, info.maxRp)

		this.setName(name)
		this.fModelId = this.getModelId()

		this.doCommand(ActorCommand.SetName, info.name)
		//EffectManager.getInstance().createBindEffect(10002, this, null, true)
		let obj = FIGHT_ACTOR_AI[info.type_id]//[objectType.OBJECT_TYPE_FAIRY]
		if (obj) {
			this.fightAI = obj.newObj(this)
		} else {
			this.fightAI = FightActorAI.newObj(this)
		}

		if (info.type_id == objectType.OBJECT_TYPE_FUNNAL) {
			let playerFighter = null
			let actorList = GetFightActorList()
			for (let _ in actorList) {
				let actor = actorList[_]

				if (actor.getProperty("type_id") == objectType.OBJECT_TYPE_PLAYER && actor.getSide() == this.getSide() && actor.getProperty("roleId") == info.roleId) {
					playerFighter = actor
					break
				}
			}

			let parent = playerFighter
			if (parent) {
				parent.addChildFightActor(this)
				this.setParent(parent)

				//parent.removeChildFightActor(this)
			}
		}
		this.updateCombatAppear()
		this.changeAction("idle", 1, true)
	}

	setHost(host) {
		if (this.host) {
			this.host.removeHelper(this)
		}

		this.host = host
		if (host) {
			host.insertHelper(this)
		}
	}

	insertHelper(helper) {
		let index = 0
		let count = size_t(this.helperList)

		for (let i = 1; i <= count + 1; i++) {
			if (!this.helperList[i]) {
				index = i
				break
			}
		}

		this.helperList[index] = helper
		helper.setHelperIndex(index)
	}

	removeHelper(helper) {

		let index = this.helperList.indexOf(helper);
		if (index != -1) {
			this.helperList[index].setHelperIndex(0)
			delete this.helperList[index]
		}
	}

	getHost() {
		return this.host
	}

	setHelperIndex(index) {
		this.beHelper = index
	}

	getHelperIndex() {
		return this.beHelper
	}

	//只执行优先度高的行为
	tick(delay) {
		this.tickIndex = (this.tickIndex + 1) % 2	
		if (this.isPause()) {
			return
		}

		if (this.isVisible() == false) {
			return
		}

		if (this.nDeadFlash < 0 && this.isDeadState()) {
			if (this.isBeingAttacked() == false) {//没被人攻击，就死亡消失吧
			//if (this.attackedRef <= 1) {//modify:yangguiming 加快死亡速度,限制就是表演受击不能太长，否则就看到人死了还继续表演
				this.nDeadFlash = 0

				this.attackedColor.red = 255
				this.attackedColor.green = 64
				this.attackedColor.blue = 64
				this.attackedColor.alpha = 128
				this.attackedDelay = 50

				let [_, config] = GetFightActorConfig(this)
				if (config && config.sex != 0) {
					let mus = SystemSound.effect_Death_nv
					if (config.sex == 2) {
						mus = SystemSound.effect_Death_nan
					}
					GameSound.getInstance().playEffect(mus)
				} else {
					GameSound.getInstance().playEffect(SystemSound.effect_Death)
				}
			}
		}

		//this.aiTime = this.aiTime + delay
		//没动作，500毫秒后才做AI动作
		//if(this.aiTime > 200 ){
		this.fightAI.tick(delay)
		//	this.aiTime = 0
		//}

		this.update(delay)


		// if (this.attackedDelay > 0) {
		// 	this.attackedDelay = this.attackedDelay - delay
		// 	if (this.attackedDelay <= 0) {
		// 		this.stopAttackedColor()

				//闪动
				if (this.nDeadFlash >= 0) {
					this.nDeadFlash = this.nDeadFlash + 1

					if (this.nDeadFlash >= 1) {
						let cellPos = this.getCellXY()
						let effect:Effect = EffectManager.getInstance().createSceneEffect(effectIndex.Death, cellPos.x, cellPos.y, true)
						effect.setAnimSpeed(1.5)
						//Player.setVisible(this, false)
						//this.setColor(this.attackedColor.red, this.attackedColor.green, this.attackedColor.blue)
						this.attackedDelay = 0						//避免重复执行
						this.doCommand(ActorCommand.SetShadowVisible, false, null)
						this.setColor(144, 144, 144)

						// let listener: any = { this_index: this, function_index: this.fighterDeadAnimNotify }
						// this.addAnimListener(listener)
						// this.changeAction("dead", 1, false)
						// FireEvent(EventDefine.COMBAT_FIGHTER_DIE_END, CombatFighterEvent.newObj(this.getCombatId()))
						this.fighterDeadAnimNotify("end")

					} else if (this.nDeadFlash % 2 == 0) {
						this.attackedDelay = 50
					} else {
						this.startAttackedColor(50)
					}
				}
			//}

		//}
	}

	setCombatId(id) {
		this.combat_id = id
	}

	getCombatId() {
		return this.combat_id
	}

	setSide(side) {
		this.side = side
	}

	getSide() {
		return this.side
	}

	setPos(pos) {
		this.pos = pos
	}

	getPos() {
		return this.pos
	}

	setHP(curHP, totalHP) {
		curHP = curHP < totalHP ? curHP : totalHP
		curHP = curHP > 0 ? curHP : 0

		this.cur_hp = curHP
		this.total_hp = totalHP
	}

	getHP() {
		return [this.cur_hp, this.total_hp]
	}

	setMP(curMP, totalMP) {
		curMP = curMP < totalMP ? curMP : totalMP
		curMP = curMP > 0 ? curMP : 0

		this.cur_mp = curMP
		this.total_mp = totalMP
	}

	getMP() {
		return [this.cur_mp, this.total_mp]
	}

	setRP(curRP, totalRP) {
		this.cur_rp = curRP
		this.total_rp = totalRP
	}

	getRP() {
		return [this.cur_rp, this.total_rp]
	}

	setName(name) {
		this.name = name
	}

	getName() {
		return this.name
	}

	isRpFull() {
		return this.cur_rp >= this.total_rp
	}

	setSpellPreState(state, visible) {
		if (state != null) {
			this.spellPreState = state
		}

		if (visible == null) {
			visible = this.spellPreState
		}

		//当前吟唱可以隐藏icon，当前非吟唱只能隐藏icon
		visible = visible && this.spellPreState

		this.doCommand(ActorCommand.SetStateIcon, "yinChangZhong", visible)
	}

	getSpellPreState() {
		return this.spellPreState
	}

	//faceToXY( targetX, targetY){
	//	//let srcX, srcY = this.getMapXY()
	//	let pos = GetFightActorPosXY(this.getSide(), this.getPos())
	//	let srcX, srcY = pos.x, pos.y
	//	
	//	//简单检测X值
	//	if(targetX > srcX ){
	//		//右边
	//		this.setDir(ActorDirMap.Right)
	//	}else{
	//		this.setDir(ActorDirMap.Left)
	//	}
	//}
	//
	//faceToActor( actor){
	//	let targetX, targetY = actor.getMapXY()
	//	this.faceToXY(targetX, targetY)
	//	
	//}

	//dval是变化值
	changeCombatInfo(Type, dval) {
		if (dval == 0) {
			return
		}

		if (Type == "hp") {
			this.cur_hp = this.cur_hp + dval  // +hp
			this.setHP(this.cur_hp, this.total_hp)
		} else if (Type == "mp") {
			this.cur_mp = this.cur_mp + dval  // +mp
			this.setMP(this.cur_hp, this.total_mp)
		} else if (Type == "rp") {
			this.cur_rp = this.cur_rp + dval	// +rp
			this.setRP(this.cur_rp, this.total_rp)
		} else if (Type == "maxHp") {
			this.total_hp = this.total_hp + dval	// +maxHp
			this.setHP(this.cur_hp, this.total_hp)
		}

		this.updateCombatAppear()
	}


	updateCombatAppear() {
		//1-18号位对象才响应
		if (this.getPos() <= 0 || this.getPos() > PET_COUNT) {
			// return
		}

		this.doCommand(ActorCommand.SetHpSlotVisible, true, null)
		this.doCommand(ActorCommand.ShowCombatAutoHpSlot, this.cur_hp / this.total_hp, this.side)

		return FireEvent(EventDefine.COMBAT_HP_MP_UPDATE, CombatHPMPUpdateEvent.newObj(this.combat_id, this.cur_hp, this.total_hp, this.cur_mp, this.total_mp, this.cur_rp, this.total_rp))
	}


	_setTempActionName(actionName, loop?) {
		if (loop == null) {
			loop = true
		}
		this.tempActionName = actionName
		this.tempActionLoop = loop
	}

	setKnockFlyContrl(contrl?, actionState?) {
		actionState = actionState || characterState.actionState_knockfly
		let ctrl = this.stateContrlList[actionState]
		delete this.stateContrlList[actionState]

		if (ctrl == null && contrl == null) {
			return
		}

		if (this.isExsitControl(ctrl)) {
			//finish时有可能调用相关回调，触发二次调用此接口，因此需要前面的置空
			ctrl.finish(this)
		}

		//this.changeIdleState()
		this.stateContrlList[actionState] = contrl
	}

	//是否在actor-contrl的更新中
	isContrlState() {
		return size_t(this.stateContrlList) != 0
	}

	recordSpell( spellId){
		this.spellAddUp[spellId] = this.spellAddUp[spellId] || 0
		this.spellAddUp[spellId] = this.spellAddUp[spellId] + 1
	}

	getSkillSpellTimes( spellId){
		return this.spellAddUp[spellId] || 0
	}

	////-状态转变
	changeAttackState(actionName, loop) {
		this._setTempActionName(actionName || "attack", loop)
		return this.switchToState(characterState.actionState_attack)
	}

	changeAttackedState(actionName?, loop?, playSomeSound?) {
		this._setTempActionName(actionName || "attacked", loop)
		if (this.switchToState(characterState.actionState_attacked)) {
			this.startAttackedColor()			//受击变色
			this.addAttackedMoveAction()	//受击后退

			playSomeSound = (playSomeSound == true)
			if (playSomeSound == false) {
				GameSound.getInstance().playEffect(SystemSound.effect_shouji)
			}
			return true
		}
		return false
	}

	changeBeatBackState(actionName?) {
		this._setTempActionName(actionName || "")
		this.fininshControlAction()
		return this.switchToState(characterState.actionState_beatback)
	}

	changeKnockFlayState(actionName?) {
		this._setTempActionName(actionName || "")
		this.fininshControlAction()
		return this.switchToState(characterState.actionState_knockfly)
	}

	changeIdleState(actionName?) {
		this._setTempActionName(actionName || "idle")
		return this.switchToState(characterState.actionState_idle)
	}

	changeRushState(actionName?) {
		this._setTempActionName(actionName || "rush")
		return this.switchToState(characterState.actionState_rush)
	}

	changeJumpState(actionName?) {
		this._setTempActionName(actionName || "idle")
		return this.switchToState(characterState.actionState_jump)
	}

	changeDieState(actionName?) {
		this._setTempActionName(actionName || "")
		//this.cur_hp = 0;
		//this.updateCombatAppear();
		if (this.switchToState(characterState.actionState_dead)) {
			return true
		}
		return false
	}

	changeDodgeState(actionName?) {
		this._setTempActionName("idle")
		return this.switchToState(characterState.actionState_dodge)
	}


	isDeadState() {
		return this.isState(characterState.actionState_dead)
	}

	isIdleState() {
		return this.isState(characterState.actionState_idle)
	}

	isMoveState() {
		return this.isState(characterState.actionState_move)
	}


	isAttackState() {
		return this.isState(characterState.actionState_attack)
	}

	isAttackedState() {
		return this.isState(characterState.actionState_attacked)
	}

	isRushState() {
		return this.isState(characterState.actionState_rush)
	}

	isKnockFlyState() {
		return this.isState(characterState.actionState_knockfly)//击飞
	}

	isBeatBackState() {
		return this.isState(characterState.actionState_beatback)//击飞
	}
	//////////////////////////////////////////////////////////////////////

	breakSkill() {
		let showResult = FightSystem.getInstance().getShowSystem().getShowResult(this.combat_id)
		if (showResult) {
			showResult.breakSkill()
		}
	}

	isCompleteBack() {
		return this.completeBack
	}

	enterMovie() {
		if (!this.fightAI) {
			return
		}

		this.fightAI.enterMovie()
	}

	//创建傀儡分身
	createPuppet(info, pos) {
		let player = Player.newObj()

		this.mActorManager.buildPlayerAppear(player, info.RoleInfo)

		let dir = ActorDirMap.LeftUp
		if (!info.dir) {
			if (info.side == fightSide.FIGHT_RIGHT) {
				dir = ActorDirMap.RightBottom
			}
		} else {
			dir = info.dir
		}
		player.setMapXY(pos.x, pos.y)
		player.setDir(dir)
		player.enterMap()

		JsUtil.arrayInstert(this.mPuppet, player)
	}

	showPuppetAction(name, speed) {
		let actionName = name || "attack"
		for (let _ in this.mPuppet) {
			let player = this.mPuppet[_]

			player.changeAction(actionName, 1.0, false)
			player.setAnimSpeed(speed)
		}
	}

	clearPuppet() {
		for (let _ in this.mPuppet) {
			let player = this.mPuppet[_]

			player.deleteObj()
		}

		this.mPuppet = []
	}

	resetToPos() {
		let curPos = this.fightAI.curPosition
		//this.setMapXY(curPos.x, curPos.y)
		if (!curPos) {
			curPos = GetFightActorDefaultPosXY(this.getSide(), this.getPos())
		}
		return curPos
	}

	getDefaultTarget() {
		if (this.fightAI.curDefaultTarget && !this.fightAI.curDefaultTarget.isDeadState()) {
			if (!this.mFightSystem.isFightEnding() && this.mFightSystem.isFightVideo() == false) {
				return this.fightAI.curDefaultTarget
			}
		}

		var pos = this.getPos()
		var side = this.getSide()
		var emSide = side % 2 + 1

		var attckObjIndex: any[] = DEFAULT_ATTACK_OBJECT[pos] || []

		var defaultTarget: FightActor = null;

		for (var i = 0; i < attckObjIndex.length; i++) {
			var v = attckObjIndex[i];
			defaultTarget = GetFightActorByPos(emSide, v)
			if (defaultTarget && !defaultTarget.isDeadState()) {
				if (this.mFightSystem.isFightVideo() == true) {
					return defaultTarget
				} else {
					if (!this.mFightSystem.isFightEnding()) {
						return defaultTarget
					}
				}
			}
		}

		return null
	}

	clearDefaultTarget() {
		this.fightAI.curDefaultTarget = null
	}

	setBeingAttacked(b) {
		if (b) {
			this.attackedRef = this.attackedRef + 1
		} else {
			if (this.attackedRef > 0) {
				this.attackedRef = this.attackedRef - 1
			}
		}
	}

	isBeingAttacked() {
		return this.attackedRef > 0
	}

	isActorFindPos() {
		return this.fightAI.isActorFindPos()
	}

	isPause() {
		return this.bFightPause
	}


	setPause(b) {
		//战斗的暂停恢复以后，不能影响本身的动作暂停，所以要保存之前的
		this.bFightPause = b
		//恢复的时候，检查之前的状态
		if (b) {
			this.bSaveAnimPause = this.isAnimPause()
			Actor.prototype.setAnimPause.call(this, true)
		} else {
			Actor.prototype.setAnimPause.call(this, this.bSaveAnimPause)
		}
	}

	setAnimPause(b) {
		Actor.prototype.setAnimPause.call(this, b)
		this.bSaveAnimPause = b
	}

	getAttackedPos() {
		if (!this.control || !this.attackedPos) {
			this.attackedPos = this.getMapXY()
		}

		return this.attackedPos
	}

	//在FightActorAI内部主要使用cellxy单位进行运算
	getFighterCurCellXY() {
		if (this.isActorFindPos() == true) {
			return this.getCellXY()
		} else {
			let pos = this.resetToPos()
			return SceneManager.getInstance().mapXYtoCellXY(pos.x, pos.y)
		}
	}

	//除FightActorAI外的（外部）战斗系统内部主要使用mapxy运算
	getFighterCurMapXY() {
		if (this.isActorFindPos() == true) {
			return this.getMapXY()
		} else {
			let pos = this.resetToPos()
			return pos
		}
	}

	onFighterDie(args) {
		if (!this.host) {
			return
		}

		if (this.host.getCombatId() == args.id) {
			this.changeDieState()
			Player.prototype.setVisible.call(this, false)
		}
	}

	updateActorBuff(args) {
		if (args.actorId != this.getCombatId()) {
			return
		}

		let list = BuffSystem.getInstance().getActorBuffList(args.actorId)
		if (!list) {
			return
		}

		let alpha = this.sourceColor.alpha / 255
		let modelId = null
		let [r, b, g] = [255, 255, 255]
		for (let buffId in list) {
			let buffList = list[buffId]

			let buff: Buff = buffList[1]
			if (buff) {
				let flag, model, al, color;
				[flag, model] = buff.checkBuffEffect("changeModel")
				if (flag && modelId == null) {
					modelId = model
				}

				[flag, al] = buff.checkBuffEffect("alpha")
				if (flag && this.alphaFlag <= 0) {
					if (al < alpha) {
						alpha = al
					}
				}

				[flag, color] = buff.checkBuffEffect("color")
				if (flag) {
					[r, b, g] = [color[0] || 255, color[1] || 255, color[2] || 255]
				}
			}
		}

		//变颜色
		let aColor = this.getAlphaColor()
		if (aColor.r != 255 || aColor.b != 255 || aColor.g != 255) {				//变色中
			if (r == 255 && b == 255 && g == 255) {													//恢复
				this.setColor(r, b, g)
			}
		} else {
			this.setColor(r, b, g)
		}

		//变模型
		let m = this.getModelId()
		if (modelId) {
			this.loadModel(modelId)
		} else {
			this.loadModel(this.fModelId)
		}
		if (modelId && modelId != m) {
			let animSpeed = this.getAnimSpeed()
			this.changeAction("idle", animSpeed, true)
		}

		//变透明度
		if (this.alphaFlag <= 0) {
			this.setAlpha(alpha * 255)
		}
	}

	loadModel( modelId){
		if(this.getModelId() == modelId ){
			return
		}
		
		//移出翅膀
		let list = []
		if(this.fightAI ){
			for(let _ in this.fightAI.childList){
				let actor = this.fightAI.childList[_]
		
				JsUtil.arrayInstert(list, actor)
				this.removeChildFightActor(actor)
			}
		}
		
		super.loadModel(modelId)
		
		//插入翅膀
		for(let _ in list){
			let actor = list[_]		
			this.addChildFightActor(actor)
		}
	}

	setAlphaFlag(param) {
		this.alphaFlag = this.alphaFlag + param
	}

	setAutoDelete() {
		if (this.fightAI) {
			this.fightAI.setAutoDelete()
		} else {
			FightSystem.getInstance().getActorSystem().remove_actor(this.getCombatId())
		}

	}

	delayBeginResult(result, resultInfo) {
		//return this.fightAI.delayBeginResult(result, resultInfo)
	}

	//关于一个FightActor绑定在另一个FightActor身上的相关处理
	addChildFightActor(actor) {
		return this.fightAI.addChildFightActor(actor)
	}

	removeChildFightActor(actor) {
		return this.fightAI.removeChildFightActor(actor)
	}

	setParent(actor) {
		return this.fightAI.setParent(actor)
	}

	restoreFightAI() {
		return this.fightAI.restoreFightAI()
	}

	recordSpellInterval() {
		this.spellIntervalTick = this.spellIntervalTick + 1
	}

	getSpellInterval() {
		return this.spellIntervalTick
	}

	resetSpellInterval() {
		this.spellIntervalTick = -1
	}

	/////////////////////////////////////Pet相关接口，后面考虑能不能用混合模式实现类多重继承
    deleteShouHunEffect() {
        if (this.shouHunEffect) {
            this.shouHunEffect.deleteObj()
            this.shouHunEffect = null
        }
    }


    setShouHunEffect(effectId){
         effectId = effectId || 0

        this.deleteShouHunEffect()
        if(effectId <= 0){
            return
        }

        let boneParam: any = {}
        boneParam.name = ""
        boneParam.order = -1
        boneParam.transfrom = true

        this.shouHunEffect = EffectManager.getInstance().createBindEffect(effectId, this, boneParam, true)
    }
}