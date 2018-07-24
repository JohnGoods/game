/*
作者:
    lintianfeng
	
创建时间：
   2013.10.10(周四)

意图：
   

公共接口：
   
*/
class Buff extends TClass {
	entryId
	life
	count
	powerInfo
	refPropertyInfo
	effectList: Effect[];
	order: number;
	lifeTimer: any;
	property: any;

	public initObj(...args: any[]): void {
		this.entryId = args[0]			//entryId
		this.life = args[1] || 0//持续时间
		this.count = args[2]			//数量
		this.powerInfo = args[3]	//power地址

		this.refPropertyInfo = BuffSystem.getInstance().getBuffTemplateInfo(this.entryId) //获得引用数据

		this.effectList = []				//只记录effect，冲过EffectManager对effect进行管理，buff系统内部不管理

		if (this.life > 0) {
			let [_, time] = FightSystem.getInstance().getCurFightTime()
			if (time < this.life) {
				if (!this.lifeTimer) {
					//	this.lifeTimer = Timer.getInstance().setTimer(this.lifeTick, this, this.life - time + 500, false)
				}
			}
		}

		this.order = BuffSystem.getInstance().getBuffOrder()
	}

	destory() {
		this.clearEffectList()

		if (this.lifeTimer) {
			KillTimer(this.lifeTimer)
			this.lifeTimer = null
		}
	}

	getEntryId() {
		return this.entryId
	}

	updateInfo(info) {
		this.property = info
	}

	getRefProperty(key) {
		if (!this.refPropertyInfo) {
			return null
		}
		return this.refPropertyInfo[key]
	}

	getBuffLife() {
		return this.life
	}

	hasBuildEffect() {
		return this.effectList.length != 0
	}

	addEffect(effect) {
		JsUtil.arrayInstert(this.effectList, effect)
	}

	getEffectList() {
		return this.effectList
	}

	clearEffectList() {
		for (let i in this.effectList) {
			let v = this.effectList[i]

			//EffectManager.getInstance().removeBindEffect(actor, v)
			v.deleteObj()
		}

		this.effectList = []
	}

	lifeTick(delay) {
		BuffSystem.getInstance().updateOutDateBuff(this)
	}

	getBuffOrder() {
		return this.order
	}

	//检查buff的效果
	checkBuffEffect(index):[boolean,any] {
		let ref = this.getRefProperty("paramList")

		if (!ref) {
			return [false, null]
		}

		let flag = false
		let param = null

		if (ref[index]) {
			flag = true
			param = ref[index]
		}

		if (flag == false) {
			flag = table_isExist(ref, index)
		}
		return [flag, param]
	}
	/*
				paramList说明：
					"showSkill"						//可发招状态，就是即使能量未满也出发招准备的特效显示
					"notAuto"							//在可发招状态下，不自动发招，但可以手动发招
					"changeModel"					//中BUFF变模型
					"independ"						//不可发招（不显示可的发招的特效，没有提示）
					"changeModel"					//["changeModel"]=modelId
	*/
}