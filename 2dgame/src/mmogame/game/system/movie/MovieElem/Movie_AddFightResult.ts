/*
作者:
    liuziming
	
创建时间：
   2014.6.12(周四)

意图：
   在电影剧情里播放技能表演（战斗中才能用）

公共接口：
   
*/

/*
class Movie_AddFightResult extends Movie_Elem {
	index: number;
	resultList: any[]
	public initObj(...args: any[]): void {
		this.index = args[0].index
		this.show_max_time = 30500

		this.resultList = []
	}

	destory() {

	}

	onBegin() {
		RegisterEvent(EventDefine.COMBAT_FIGHT_RESULT_END, this.onResultEnd, this)

		if (FightSystem.getInstance().isFight() == false) {
			return this.finish()
		}

		let [pl, rl] = FightSystem.getInstance().getConfigSystem().getClientFightConfig(this.index)
		let [nowFightTime, _] = FightSystem.getInstance().getCurFightTime()

		for (let _ in rl) {
			let result = rl[_]

			result.time = result.time + nowFightTime

			let [side, pos] = StringUtil.stringMatch(tostring(result.caster), /(\d+)0(\d+)/)
			if (side && pos) {
				side = tonumber(side)
				pos = tonumber(pos)
				let actor = GetFightActorByPos(side, pos)
				if (actor) {
					result.caster = actor.getCombatId()
				}
			}

			let matchResult = StringUtil.stringMatch(tostring(result.target), /(\d+)0(\d+)/)
			if (matchResult) {
				let target_side = tonumber(matchResult[0])
				let target_pos = tonumber(matchResult[1])
				let actor = GetFightActorByPos(target_side, target_pos)
				if (actor) {
					result.target = actor.getCombatId()
				}
			}

			for (let j in result.fightPowers) {
				let power = result.fightPowers[j]

				let matchResult = StringUtil.stringMatch(tostring(power.target), /(\d+)0(\d+)/)
				if (matchResult) {
					let power_target_side = tonumber(matchResult[0])
					let power_target_pos = tonumber(matchResult[1])
					let actor = GetFightActorByPos(power_target_side, power_target_pos)
					if (actor) {
						result.fightPowers[j].target = actor.getCombatId()
					}
				}
			}

			FightSystem.getInstance().addResult(result)
		}

		this.resultList = rl
		MovieSystem.getInstance().setSkippAble(false)
	}

	onTick(delay) {

	}

	onFinish() {
		UnRegisterEvent(EventDefine.COMBAT_FIGHT_RESULT_END, this.onResultEnd, this)

		for (let _ in this.resultList) {
			let v = this.resultList[_]

			FightSystem.getInstance().getShowSystem().stopShowResult(v.caster)
		}

		MovieSystem.getInstance().setSkippAble(true)
	}

	onResultEnd(args) {
		table_remove(this.resultList, args.result)
		if (size_t(this.resultList) == 0) {
			this.finish()
		}
	}
}
*/