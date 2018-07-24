

class Fight_AddFightSound extends Fight_BaseAction {

	soundName: string;
	soundName2: string;
	targetType: string;
	testMale: boolean;

	public initObj(...args: any[]): void {
		this.soundName = this.elemInfo.param1 || SystemSound.effect_chuxian
		this.soundName2 = checkNull(this.elemInfo.param2, "") //女声音
		this.targetType = checkNull(this.elemInfo.param3, null) //声音播放类型
		this.testMale = checkNull(this.elemInfo.param4, false)  //测试男声
	}


	onFinish() {
		let actor = null
		if (this.targetType != null) {
			if (this.targetType == "caster") {
				actor = this.casterActor
			} else if (this.targetType == "targetList") {
				actor = this.fightResult.getActionObjectByName("targetList")[1]
			}
		}

		if (actor == null) {
			GameSound.getInstance().playEffect(this.soundName)
		} else {
			let [_, info] = GetFightActorConfig(actor)
			let sex = 0
			if (info && info.sex != 0) {
				sex = info.sex
			}

			if (GAME_TOOL == GAME_MODE) {
				if (this.testMale) {
					sex = genderOptions.MALE
				} else {
					sex = genderOptions.FEMALE
				}
			}

			if (sex == genderOptions.FEMALE) {
				GameSound.getInstance().playEffect(this.soundName2)
			} else if (sex == genderOptions.MALE) {
				GameSound.getInstance().playEffect(this.soundName)
			}

		}

	}
}