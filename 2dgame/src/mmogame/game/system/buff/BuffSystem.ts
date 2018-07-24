/*
作者:
    liuziming

创建时间：
    2014.08.21(星期四) 

意图：
  主要处理战斗中部下的buff

公共接口：

*/

let colorList: any = [
								[255, 255, 255 ],
								[ 208, 0, 0 ],
								[ 168, 0, 0 ],
								[ 128, 0, 0 ],
					]
let buffOrder = 0

class BuffSystem extends BaseSystem {

	actBuffList:any;
	buffList:any;


	public initObj(...args: any[]): void {
		RegisterEvent(EventDefine.COMBAT_FIGHT_WIN, this.onFightFinish, this)
		RegisterEvent(EventDefine.COMBAT_FIGHT_LOST, this.onFightFinish, this)
		RegisterEvent(EventDefine.COMBAT_FIGHTER_BUFF_UPDATE, this.updateActorEffect, this)
		//this.onClear()
		this.buffList = {}

		//活动buff
		this.actBuffList = {}
	}

	destory() {
		this.onClear()
	}

	prepareResource(workQueue) {
		GameConfig.initBuffSystemCsv(workQueue);

	}

	onClear() {
		//this.buffList = {}
		this.actBuffList = {}
		buffOrder = 0

		this.onFightFinish()
	}

	////////////////////////////////////////////////////////////-
	getBuffTemplateInfo(buffId) {
		return GameConfig.BuffConfig[buffId]
	}

	getBuffOrder(buff) {
		buffOrder = buffOrder + 1
		return buffOrder
	}

	addBuff(actorId, buff, createEffect) {
		if (!GetFightActor(actorId)) {
			TLog.Warn("BuffSystem.addBuff the actor %d is ! exsit!", actorId)
			return
		}

		let actor = GetFightActor(actorId)
		this.buffList[actorId] = this.buffList[actorId] || {}

		let buffEntryId = buff.getEntryId()
		//if(this.buffList[actorId][buffEntryId] ){
		//	TLog.Warn("BuffSystem.addBuff the buff %d in actor %d is exsit!", buffEntryId, actorId)
		//}

		//同一角色身上可以有多个entryId相同buff
		this.buffList[actorId][buffEntryId] = this.buffList[actorId][buffEntryId] || []
		let flag = false
		for (let _ in this.buffList[actorId][buffEntryId]) {
			let sBuff:Buff = this.buffList[actorId][buffEntryId][_]

			if (sBuff.powerInfo == buff.powerInfo) {
				flag = true
				buff = sBuff
				break
			}
		}

		if (!flag) {
			JsUtil.arrayInstert(this.buffList[actorId][buffEntryId], buff)
			//TLog.Debug("444444444444444444444", actorId, buffEntryId)
		}

		if (createEffect) {
			this.addBuffEffect(actor, buff)
		}

		FireEvent(EventDefine.COMBAT_FIGHTER_BUFF_UPDATE, FighterBuffEvent.newObj(actorId))
	}

	removeBuff(actorId, buffId) {
		if (!GetFightActor(actorId)) {
			TLog.Warn("BuffSystem.removeBuff the actor %d is ! exsit!", actorId)
			return
		}

		let actor = GetFightActor(actorId)
		this.buffList[actorId] = this.buffList[actorId] || {}
		if (!this.buffList[actorId][buffId] || this.buffList[actorId][buffId].length == 0) {
			TLog.Warn("BuffSystem.removeBuff the buff %d in actor %d is ! exsit!", buffId, actorId)
			return
		}
		//TLog.Debug("443333333333333334444444444444444444", actorId, buffId)

		let buff = <Buff>JsUtil.arrayRemove(this.buffList[actorId][buffId], 0)
		this.removeBuffEffect(buff)
		FireEvent(EventDefine.COMBAT_FIGHTER_BUFF_UPDATE, FighterBuffEvent.newObj(actorId))
		
		buff.deleteObj()
	}

	updateBuff(actorId, buff) {
		if (!GetFightActor(actorId)) {
			TLog.Warn("BuffSystem.updateBuff the actor %d is ! exsit!", actorId)
			return
		}

		let buffId = buff.getEntryId()
		let actor = GetFightActor(actorId)
		this.buffList[actorId] = this.buffList[actorId] || []
		if (!this.buffList[actorId][buffId]) {
			TLog.Warn("BuffSystem.updateBuff the buff %d in actor %d is ! exsit!", buffId, actorId)
			return
		}

		let oldBuff = <Buff>JsUtil.arrayRemove(this.buffList[actorId][buffId], 0)

		//特效前后一致，没必要重复创建
		//this.updateBuffEffect(actor, oldBuff, buff)
		JsUtil.arrayInstert(this.buffList[actorId][buffId], buff)

		FireEvent(EventDefine.COMBAT_FIGHTER_BUFF_UPDATE, FighterBuffEvent.newObj(actorId))
		oldBuff.deleteObj()
	}

	showBuffEffect(actorId, buffId, powerAddress) {
		let actor = GetFightActor(actorId)
		if (!actor) {
			TLog.Warn("BuffSystem.showBuffEffect the actor %d is ! exsit!", actorId)
			return
		}

		let buff = null

		if (this.buffList[actorId]) {
			if (this.buffList[actorId][buffId]) {
				for (let _ in this.buffList[actorId][buffId]) {
					let v = this.buffList[actorId][buffId][_]

					if (v.powerAddress == powerAddress) {
						buff = v
						break
					}
				}
			}
		}

		if (buff) {
			this.addBuffEffect(actor, buff)
		}
	}

	getActorBuffList(actorId) {
		return this.buffList[actorId] || null
	}

	updateOutDateBuff(buff) {
		let actorId = null
		for (let id in this.buffList) {
			let list = this.buffList[id]

			for (let buffId in list) {
				let v = list[buffId]

				if (table_remove(list, buff) && buff.getEntry() == buffId) {
					actorId = id
					break
				}
			}
		}

		if (actorId) {
			this.removeBuffEffect(buff)
			FireEvent(EventDefine.COMBAT_FIGHTER_BUFF_UPDATE, FighterBuffEvent.newObj(actorId))

			buff.deleteObj()
			//this.removeBuff(actorId, buff.getEntry())
		}
	}

	updateActorEffect(args) {
		let list = this.buffList[args.actorId] || {}
		let lastEffect: any = {}
		let lastOrder = 0

		for (let buffId in list) {
			let buffList = list[buffId]

			for (let k = buffList.length-1; k >= 0; k--) {
				let buff:Buff = buffList[k]
				let effectList = buff.getEffectList()

				for (let i = effectList.length-1; i >= 0; i--) {
					let effect = effectList[i]
					let [flag,param] = buff.checkBuffEffect("rebound")
					if (flag == false) {		//有反弹效果时忽略检查特效，默认隐藏
						if (!lastEffect[effect.getBindBone()]) {
							let t: any = {}
							t[0] = effect
							t[1] = 1
							t[2] = buff.getBuffOrder()

							lastEffect[effect.getBindBone()] = t
						} else {
							let elem = lastEffect[effect.getBindBone()]
							if (elem[0].getBindBone() == effect.getBindBone() ){
								if (elem[2] < buff.getBuffOrder()) {
									elem[0] = effect
									elem[1] = 1
									elem[2] = buff.getBuffOrder()
								} else if (elem[0].getEffectId() == effect.getEffectId() ){
									elem[1] = elem[1] + 1
								}
							}
						}
					}

					if (table_isExist(buff.getRefProperty("oneceEffect"), effect.getEffectId()) == false) {					//一次性特效不进行隐藏检查
						effect.setVisible(false)
					} else {
						effect.setVisible(true)
					}
				}
			}
		}

		for (let k in lastEffect) {
			let v = lastEffect[k]
			//同一绑定位置上根据特效的个数变化特效的颜色
			let effect = v[0]
			let count = v[1]
			let elem = colorList[count] || colorList[0]

			effect.setColor(elem[0], elem[1], elem[2])
			effect.setVisible(true)
		}
	}

	////////////////////// 通用函数，创建buff特效////////////////////////////-
	addBuffEffect(actor, buff) {
		if (!buff.getRefProperty("effect") || buff.hasBuildEffect()) {
			return
		}

		let scale = 0
		if (actor.classname == "FightActor") {
			let [config] = GetFightActorConfig(actor)
			if (config) {
				let scaleList = buff.getRefProperty("scaleList") || {}
				scale = scaleList[config.model] || 0
			}
		}

		//buff飘字
		for (let i in buff.getRefProperty("charaterList")) {
			let imageName = buff.getRefProperty("charaterList")[i]

			actor.doCommand(ActorCommand.ShowFighterCharater, imageName)
		}

		let list = []
		for (let k in buff.getRefProperty("effect")) {
			table_insert(list, [buff.getRefProperty("effect")[k], -1])
		}
		for (let k in buff.getRefProperty("oneceEffect")) {
			table_insert(list, [buff.getRefProperty("oneceEffect")[k], 1])
		}
		
		for (let i in list) {
			let [v, times] = list[i]

			let effect = null
			if (times < 0) {
				effect = EffectManager.getInstance().createBindEffect(v, actor)
			} else {
				effect = EffectManager.getInstance().createBindOnceEffect(v, actor)
			}
			//effect.setDir(actor.getDir())
			if (scale != 0) {
				effect.setScale(scale)
			}

			if(actor.classname == "FightActor" ){
				let effectRef = GameConfig.EffectConfig[v]
				if(effectRef ){
					//编辑器以左边为准，右边的话要翻转
					let [offsetx, offsety] = [checkNull(effectRef.offx, 0), checkNull(effectRef.offy, 0)]
					if(actor.getSide() != fightSide.FIGHT_LEFT ){
						offsetx = -offsetx
						
						let bMirror = effect.getMirror()
						bMirror = ! bMirror
						effect.setMirror(bMirror)
						effect.setDir(actor.getDir())
					}
				
					effect.setPositionXY(offsetx, offsety)
				}
			}

			//以buff实例作为caster
			effect.setCaster(buff)
			if (times < 0) {									//常驻的才记录索引
				effect.setAutoBindDelete(false)
				buff.addEffect(effect)
			}
		}
	}

	removeBuffEffect(buff) {

		buff.clearEffectList()
	}

	updateBuffEffect(actor, oldBuff, newBuff) {
		this.removeBuffEffect(oldBuff)
		this.addBuffEffect(actor, newBuff)
	}

	//////////////////////////////////////////////////////////////////////////-
	onFightFinish() {
		for (let actorId in this.buffList) {
			let buffList = this.buffList[actorId]

			for (let buffId in buffList) {
				let v = buffList[buffId]

				for (let _ in v) {
					let buff = v[_]

					//let actor = GetFightActor(actorId)
					//if(actor ){
					this.removeBuffEffect(buff)

					buff.deleteObj()
					//}
				}
			}
		}

		this.buffList = {}
		buffOrder = 0
	}

	clearActorBuff(actorId) {
		let buffList = this.buffList[actorId] || {}
		for (let buffId in buffList) {
			let v = buffList[buffId]

			for (let _ in v) {
				let buff = v[_]

				this.removeBuffEffect(buff)

				buff.deleteObj()
			}
		}

		delete this.buffList[actorId]
	}

	getActorBuffState(actorId, index) {
		let flag = false
		let buffList = this.getActorBuffList(actorId)
		if (buffList) {
			for (let k in buffList) {
				let v = buffList[k]

				for (let _ in v) {
					let buff:Buff = v[_]

					let [ret, _2] = buff.checkBuffEffect(index)
					flag = ret;
					if (flag) {
						break
					}
				}

				if (flag) {
					break
				}
			}
		}

		return flag
	}

	getBuffName(buffId) {
		if (!GameConfig.BuffConfig[buffId]) {
			return ""
		}

		return GameConfig.BuffConfig[buffId].name + ""
	}

	////////活动buff//////////////////////////////-
	//加入新的活动buff
	addActBuff(buffName, buffLeftTime, buffData) {
		let name = buffName
		let dTime = buffLeftTime + GetServerTime()

		//actBuff结构			{buffName/名字, dTime/有效期}
		this.actBuffList[name] = [name, dTime, buffData]
	}

	removeActBuff(buffName) {
		let name = buffName || ""
		delete this.actBuffList[name]
	}

	getActBuffInfo(buffName) {
		return this.actBuffList[buffName]
	}
}