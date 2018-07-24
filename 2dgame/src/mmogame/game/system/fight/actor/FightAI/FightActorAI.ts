class FightActorAI extends FightBaseAI {
	isDefaultSeat:boolean

	public initObj(...args: any[]): void {
		this.isDefaultSeat = false
	}

	destory() {

	}

/*	moveToNextPos() {
		let curResult = FightSystem.getInstance().getShowSystem().getShowResult(this.actor.getCombatId())

		if (curResult) {
			//this.actor.moveStop()
			return
		} else if (this.beginMove == false) {
			//this.adjustBodyDistance()
			return
		}
		let side = this.actor.getSide()
		let aPos = this.actor.getPos()
		let enemySide = side % 2 + 1

		let defaultTarget = this.actor.getDefaultTarget()
		//一般情况下必不为空
		if (defaultTarget) {
			this.curDefaultTarget = defaultTarget
		} else {
			this.actor.moveStop()
			this.curPosition = this.actor.getMapXY()
			return
		}

		let [config, scopeInfo] = GetFightActorConfig(this.actor)
		let [emConfig, emScopeInfo] = GetFightActorConfig(defaultTarget)
		if (config == null || emConfig == null) {
			return
		}

		var pos:any = this.actor.getCellXY()
		pos.attackScope = scopeInfo.AttackScope > emScopeInfo.BodyScope && scopeInfo.AttackScope || emScopeInfo.BodyScope
		pos.bodyScope = scopeInfo.BodyScope

		var emPos = defaultTarget.getFighterCurCellXY()
		emPos.attackScope = emScopeInfo.AttackScope
		emPos.bodyScope = emScopeInfo.BodyScope

		pos.attackScope = emPos.bodyScope > pos.attackScope && emPos.bodyScope || pos.attackScope
		//后排自动升级为远战
		if (aPos / FIGHT_COMBAT_ROW_COUNT > 1) {
			let flag = false
			let scope = 0

			let r = 0
			let frontActorPos = aPos
			for (let i = 3; i <= 1; i--) {
				frontActorPos = frontActorPos - FIGHT_COMBAT_ROW_COUNT
				if (frontActorPos <= 0) {
					break
				}

				let index = Math.floor((frontActorPos - 1) / FIGHT_COMBAT_ROW_COUNT) * FIGHT_COMBAT_ROW_COUNT
				let fightMod = 100
				let isThere = false
				for (let _i = 1; _i <= FIGHT_COMBAT_ROW_COUNT; _i++) {
					let actor = GetFightActorByPos(side, index + _i)

					if (actor && !actor.isDeadState() && fightMod > Math.abs((frontActorPos - index - _i) % FIGHT_COMBAT_ROW_COUNT)) {
						let [config, scopeInfo] = GetFightActorConfig(actor)
						scope = scopeInfo.AttackScope > scope && scopeInfo.AttackScope || scope

						fightMod = Math.abs((frontActorPos - index - _i) % FIGHT_COMBAT_ROW_COUNT)

						if (isThere == false) {
							r = r + 1
							isThere = true
						}

						flag = true
					}
				}
			}

			scope = scope + 8 * r
			if (flag == true) {
				pos.attackScope = pos.attackScope > scope && pos.attackScope || scope
			}
		}

		//开始移动处理
		if (MathUtil.checkNormScope(pos.x, pos.y, emPos.x, emPos.y, pos.attackScope)) {
			this.actor.moveStop()

			this.beginMove = false
			//this.curPosition = {}
			if (side == fightSide.FIGHT_LEFT && pos.x - emPos.x > -1) {
				this.curPosition = this.transferCell(emPos.x - pos.attackScope, emPos.y)
			} else if (side == fightSide.FIGHT_RIGHT && pos.x - emPos.x < 1) {

				this.curPosition = this.transferCell(emPos.x + pos.attackScope, emPos.y)
			} else {
				this.curPosition = this.actor.getMapXY()
			}

			//this.adjustBodyDistance()
			return
		}

		var x = emPos.x
		var y = emPos.y
		var sp = this.actor.getCellXY()

		var alph = Math.PI + Math.atan((y - sp.y) / (x - sp.x))//(side - 1) * math.pi + math.atan((y - sy) / (x - sx))
		//x = x + Math.cos(alph) * 2
		//y = y + Math.sin(alph) * 2
		x = x - Math.cos(alph) * 2
		y = y - Math.sin(alph) * 2

		//x = x + -2 * ((-1) ^ side)
		this.actor.wantToGoByCell(x, y, true)
	}
*/
	onTick(delay) {
		if (!this.curDefaultTarget) {
			this.curDefaultTarget = this.actor.getDefaultTarget()
		}

		if (this.isDefaultSeat == true) {
			if (STAY_IN_DEFALUT_POSITION != true) {

//				this.moveToNextPos()
			}

			if (this.actor.isIdleState()) {
				this.moveToDefaultSeat()
			}
		} else {
			this.moveToDefaultSeat()
		}
	}

	moveToDefaultSeat() {
		let curResult = FightSystem.getInstance().getShowSystem().getShowResult(this.actor.getCombatId())
		if (curResult) {
//			this.actor.moveStop()
			return
		}

		let curPos= GetFightActorDefaultPosXY(this.actor.getSide(), this.actor.getPos())
		this.actor.setMapXY(curPos.x, curPos.y)
		this.isDefaultSeat == true

//		//当前位置
//		let pos = SceneManager.getInstance().mapXYtoCellXY(this.curPosition.x, this.curPosition.y)
//		var frompos = this.actor.getCellXY()
//
//		//如果在范围内，就不用动了
//		if (MathUtil.checkNormScope(frompos.x, frompos.y, pos.x, pos.y, 1)) {
//			if (this.isDefaultSeat == false) {
//				this.setWaitSomeTime()
//
//				this.actor.completeBack = true
//			}
//
//			if (this.isDefaultSeat == true && this.adjustBodyDistance() == false) {
//				//this.actor.faceToActor(this.curDefaultTarget)
//			}
//
//			return false
//		}
//
//		//TLog.Debug("moveToNextPos", to_cellx, to_celly, this.actor.getMoveSpeed(), this.actor.getCombatId())
//		//忽视阻挡移动，一定会成功的，除非x,y出错了
//		if (this.actor.wantToGoByCell(pos.x, pos.y, true) == false) {
//			TLog.Debug("ActorAI move Error:", frompos.x, frompos.y, pos.x, pos.y)
//			//throw()
//		}
	}

/*	setWaitSomeTime() {
		if(this.actor.completeBack == true){
			return
		}

		var timeId = null
		var time = 0
		function tick( delay){
			time = time + delay
			if(time > 0){
				this.isDefaultSeat = true
				this.beginMove = false
				
				if(timeId){
					KillTimer(timeId)
					timeId = null
				}
			}
		}
					
		timeId = SetTimer(tick, this, 100, true)
	}

	adjustBodyDistance() {
		let side = this.actor.getSide()
		let position = this.actor.getPos()
		let cellPos = this.actor.getCellXY()

		//身位框（己方排斥）
		for (let index = 1; index <= FIGHT_COMBAT_ROW_COUNT; index++) {
			let i = index + Math.floor((position - 0.5) / FIGHT_COMBAT_ROW_COUNT) * FIGHT_COMBAT_ROW_COUNT
			if (i == position) {
				//break
			}

			let actor = GetFightActorByPos(side, i)

			if (actor && !actor.isDeadState() && i != position) {
				let x, y = actor.getFighterCurCellXY()
				let bodyDes = 4

				let [config, scopeInfo] = GetFightActorConfig(actor)
				let [curConfig, curScopeInfo] = GetFightActorConfig(this.actor)
				if (config && curConfig) {
					bodyDes = scopeInfo.BodyScope + curScopeInfo.BodyScope
				}

				if (MathUtil.checkNormScope(cellPos.x, cellPos.y, x, y, bodyDes) && actor.getDefaultTarget() == this.actor.getDefaultTarget()) {
					let pos = this.getFinalPos(config, curConfig)
					if (pos) {
						this.curPosition = this.transferCell(pos.x, pos.y)
					}

					return true
				}
			}
		}

		return false
	}

	getFinalPos(config, curConfig) {
		//先获取当前与自己同一目标的已方成员的数量
		//然后根据相对次序确定最终位置
		//){ return }
		let side = this.actor.getSide()
		let target = this.actor.getDefaultTarget()
		let curPos = this.actor.getPos()
		var cp = this.actor.getCellXY()

		if (!target || target.isContrlState()) {
			return this.actor.getCellXY()
		}

		if (target.fightAI.beginMove == true || target.isDeadState()) {
			return null
		}

		let tp = target.getFighterCurCellXY()
		let curx = cp.x
		let cury = cp.y
		let attackScope = MathUtil.pGetDistance(tp, cp) //this.transferCell(curConfig.AttackScope)
		if (attackScope > 25) {
			return null
		}

		let angle = 0
		let unitAngle = Math.PI / 8

		//角度调整（距离太长时角度幅度调小）
		if (attackScope > 10) {
			//unitAngle = Math.pi / 12
		}

		let sumCount = 0
		let selfIndex = 0
		for (let index = 1; index <= FIGHT_COMBAT_ROW_COUNT; index++) {
			let i = index + Math.floor((curPos - 0.5) / FIGHT_COMBAT_ROW_COUNT) * FIGHT_COMBAT_ROW_COUNT
			let actor = GetFightActorByPos(side, i)
			if (actor && !actor.isDeadState() && actor.getDefaultTarget() == this.actor.getDefaultTarget()) {
				sumCount = sumCount + 1

				let ap = actor.getCellXY()
				let actorScope = MathUtil.pGetDistance(tp, ap)
				if (actorScope > attackScope) {
					attackScope = actorScope
				}
				if (actor.getPos() == curPos) {
					selfIndex = sumCount
				}
			}
		}

		if (sumCount <= 2) {
			if (selfIndex == 1) {
				angle = -1 * unitAngle
			} else {
				angle = unitAngle
			}
		} else {
			let half = Math.floor(sumCount / 2)

			for (let i = half; i <= -half; i--) {
				if (selfIndex - 1 == -i + half) {
					angle = -i * unitAngle
					break
				}
			}
		}

		if (side == fightSide.FIGHT_LEFT) {
			angle = Math.PI - angle
		}

		let newx = tp.x + attackScope * Math.cos(angle)
		let newy = tp.y + attackScope * Math.sin(angle)


		return newPos(newx, newy)
	}
*/
}