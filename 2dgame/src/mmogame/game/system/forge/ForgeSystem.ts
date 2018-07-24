class ForgeSystem extends BaseSystem {
	forgeList
	oldforgelist;

	public initObj(...args: any[]): void {
		this.onClear()

	}

	onClear() {
		this.oldforgelist = {}
		this.forgeList = {}
	}

	destory() {
		this.onClear()
	}

	prepareResource(workQueue) {
		GameConfig.initForgeSystemCsv(workQueue);
	}

	initForgeInfo(info) {
		this.forgeList = info
	}

	updateForgeInfo(info) {
		for (let k in info) {
			if (!this.forgeList[k]) {
				return
			} else {
				this.forgeList[k] = info[k]
			}
		}
		FireEvent(EventDefine.FORGE_UPDATE, null)
	}

	setForgeOldInfo(key, list) {
		this.oldforgelist[key] = list
	}
	getForgeInfo(key: string) {
		if (!this.forgeList[key]) return {}
		return this.forgeList[key]
	}
	getForgeOldInfo(key: string) {
		if (!this.oldforgelist[key]) {
			if (this.forgeList[key]) {
				return this.forgeList[key]
			} else {
				return {}
			}
		}
		return this.oldforgelist[key]
	}

	getForgeTypeLevel(key) {
		let info = this.getForgeInfo(key)
		let pos = 0
		for (let k = 0; k < size_t(info); k++) {
			if (info[k] < info[k - 1]) {
				pos = k
			}
		}
		return info[pos]
	}

	getDaShiNeedLevel(typeName: string, index: number) {
		let dashiLevel = this.getForgeClassType(typeName)
		let forgeTypeConfig = GameConfig.FunForgeMasterConfig[typeName]
		let isBreak = false
		let needLevel = 0
		for (let k in forgeTypeConfig) {
			let v = forgeTypeConfig[k]
			needLevel = tonumber(k)
			if (isBreak) {
				break
			}
			if (v.classType == dashiLevel) {
				isBreak = true
			}
		}
		return needLevel
	}

	getForgeClassType(typeName) {
		let forgeInfo = this.getForgeInfo(typeName)
		let level = this.getForgeTypeLevel(typeName)
		let masterConfig = GameConfig.FunForgeMasterConfig[typeName]
		let classType = 0
		let recvKey = 0
		for (let k in masterConfig) {
			let v = masterConfig[k]
			if (level >= tonumber(k)) {
				recvKey = tonumber(k)
			}
		}

		return masterConfig[recvKey].classType
	}

	getNowForgeLevel(tempConfig, forgeType) {
		let recvLevel = 0
		for (let k in tempConfig) {
			let v = tempConfig[k]
			if (v.classType >= forgeType) {
				return tonumber(k)
			}
			// recvLevel = tonumber(k)
		}
		return recvLevel
	}


	getCellForgeConfig(typeName, pos, level) {
		let abilityConfig = GameConfig.FunForgeAbilityConfig[typeName]
		if (GameConfig.FunForgeConfig[typeName][level] == null) {
			return null
		}
		let value = GameConfig.FunForgeConfig[typeName][level].value

		let ratioList = [
			["a1", "a2"], //武器
			["b1", "b2"], //头盔
			["c1", "c2"], //项链
			["d1", "d2"], //衣服
			["e1", "e2"], //披肩
			["f1", "f2"], //腰带
			["g1", "g2"], //护腕
			["h1", "h2"], //戒指
			["i1", "i2"], //裤子
			["j1", "j2"], //鞋子
		]
		let name1 = "name" + ratioList[pos][0]
		let ratio1 = ratioList[pos][0]

		let name2 = "name" + ratioList[pos][1]
		let ratio2 = ratioList[pos][1]

		let tempConfig = {}
		if (abilityConfig[name1] != "") {
			tempConfig[abilityConfig[name1]] = FormatNumberInt(abilityConfig[ratio1] * value)
		}

		if (abilityConfig[name2] != "") {
			tempConfig[abilityConfig[name2]] = FormatNumberInt(abilityConfig[ratio2] * value)
		}
		return tempConfig
	}

	getBaoShiStr(typeName, pos, level) {
		let baoshiStr = ""
		let forgeInfo = this.getForgeInfo(typeName)
		let nowConfig = this.getCellForgeConfig(typeName, pos, level)
		let nextConfig = this.getCellForgeConfig(typeName, pos, level + 1)
		let config = table_effect_sub(nextConfig, nowConfig)
		if (config == null) {
			config = nowConfig
		}
		let configkey = ""
		for (let k in config) {
			if (k == IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]) {
				baoshiStr += Localize_cns("FORGE_BAOSHI_SHENGMING")
			} else if (k == IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]) {
				baoshiStr += Localize_cns("FORGE_BAOSHI_FANGYU")
			} else if (k == IndexToabilityName[objectField.UNIT_FIELD_ATTACK]) {
				baoshiStr += Localize_cns("FORGE_BAOSHI_GONGJI")
			}
			configkey = k
		}

		let cellstr = baoshiStr + Localize_cns("FORGE_LEVEL_FALSE") + "#br"

		if (level == 0) {
			let recvStr = ""
			let tempConfig = [
				{ [configkey] : 0 }, { [configkey] : 0 }, { [configkey] : 0 }, { [configkey] : 0 },
			]
			return [recvStr + cellstr + cellstr + cellstr + cellstr, tempConfig]
		}
		let manjiStr = baoshiStr + "#lime" + Localize_cns("FORGE_MANJI") + "#br#rf"

		if (nextConfig == null) {
			let config_40 = this.getCellForgeConfig(typeName, pos, 40)
			let config_80 = this.getCellForgeConfig(typeName, pos, 80)
			let config_120 = this.getCellForgeConfig(typeName, pos, 120)
			let config_200 = this.getCellForgeConfig(typeName, pos, 200)
			let tempConfig = [
				{ [configkey] : config_40[configkey] }, { [configkey] : config_80[configkey] }, { [configkey] : config_120[configkey] }, { [configkey] : config_200[configkey] },
			]

			return [String.format(manjiStr, config_40[configkey]) + String.format(manjiStr, config_80[configkey]) + String.format(manjiStr, config_120[configkey]) + String.format(manjiStr, config_200[configkey]),tempConfig]
		}
		let showStr = baoshiStr + "#lime" + nowConfig[configkey] + "+" + nextConfig[configkey] + "#br"



		if (level < 40) {
			let tempConfig = [
				{ [configkey] : nowConfig[configkey] }, { [configkey] : 0 }, { [configkey] : 0 }, { [configkey] : 0 },
			]
			return [showStr + cellstr + cellstr + cellstr,tempConfig]
		}

		if (level >= 40 && level < 80) {
			let config_40 = this.getCellForgeConfig(typeName, pos, 40)
			let tempConfig = [
				{ [configkey] : config_40[configkey] }, { [configkey] : nowConfig[configkey] }, { [configkey] : 0 }, { [configkey] : 0 },
			]
			return [String.format(manjiStr, config_40[configkey]) + showStr + cellstr + cellstr, tempConfig]
		}

		if (level >= 80 && level < 120) {
			let config_40 = this.getCellForgeConfig(typeName, pos, 40)
			let config_80 = this.getCellForgeConfig(typeName, pos, 80)
			let tempConfig = [
				{ [configkey] : config_40[configkey] }, { [configkey] : config_80[configkey] }, { [configkey] : nowConfig[configkey] }, { [configkey] : 0 },
			]
			return [String.format(manjiStr, config_40[configkey]) + String.format(manjiStr, config_80[configkey]) + showStr + cellstr,tempConfig]
		}

		if (level >= 120 && level < 200) {
			let config_40 = this.getCellForgeConfig(typeName, pos, 40)
			let config_80 = this.getCellForgeConfig(typeName, pos, 80)
			let config_120 = this.getCellForgeConfig(typeName, pos, 120)
			let tempConfig = [
				{ [configkey] : config_40[configkey] }, { [configkey] : config_80[configkey] }, { [configkey] : config_120[configkey] }, { [configkey] : nowConfig[configkey] },
			]
			return [String.format(manjiStr, config_40[configkey]) + String.format(manjiStr, config_80[configkey]) + String.format(manjiStr, config_120[configkey]) + showStr, tempConfig]
		}

		if (level >= 200) {
			let config_40 = this.getCellForgeConfig(typeName, pos, 40)
			let config_80 = this.getCellForgeConfig(typeName, pos, 80)
			let config_120 = this.getCellForgeConfig(typeName, pos, 120)
			let config_200 = this.getCellForgeConfig(typeName, pos, 200)
			let tempConfig = [
				{ [configkey] : config_40[configkey] }, { [configkey] : config_80[configkey] }, { [configkey] : config_120[configkey] }, { [configkey] : config_200[configkey] },
			]

			return [String.format(manjiStr, config_40[configkey]) + String.format(manjiStr, config_80[configkey]) + String.format(manjiStr, config_120[configkey]) + String.format(manjiStr, config_200[configkey]),tempConfig]
		}
		let tempRecvConfig = [
			{ [configkey] : 0 }, { [configkey] : 0 }, { [configkey] : 0 }, { [configkey] : 0 },
		]
		return ["", tempRecvConfig]
	}

	getForgeConfigStr(config) {
		let recvStr = ""
		for (let k in config) {
			if (k == IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]) {
				recvStr += Localize_cns("FORGE_SHENGMING") + config[k] + "#br#br"
			} else if (k == IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]) {
				recvStr += Localize_cns("FORGE_FANGYU") + config[k] + "#br#br"
			} else if (k == IndexToabilityName[objectField.UNIT_FIELD_ATTACK]) {
				recvStr += Localize_cns("FORGE_GONGJI") + config[k] + "#br#br"
			}
		}
		return recvStr
	}

}