/*
作者:
    yangguiming
	
创建时间：
    2017.02.06(星期一) 

意图：
  物品相关接口

公共接口：
	
*/


let EquipPosName: any = {
	[1]: "weapon_item",//武器
	[2]: "cap_item",//头盔
	[3]: "cloth_item",//衣服

	[4]: "mask_item",//戒指
	[5]: "neck_item",//项链
	[6]: "shoe_item",//腰带
}


function SendUseItemMessage(item, count) {
	let itemId = item.getProperty("id")
	let entryid = item.getProperty("entry")


	let uselevel = item.getRefProperty("uselevel")

	let heroLevel = GetHeroProperty("level")
	if (heroLevel < uselevel) {
		MsgSystem.addTagTips(String.format(Localize_cns("ITEM_TXT38"), uselevel))
		return
	}

	// if (entryid == opFactionRideItemEntryId) {//40095
	// 	//let wnd = WngMrg.getInstance().getWindow("ItemUseFrame")
	// 	//wnd.showWndAndSetItemId(itemId,entryid)
	// 	let message = GetMessage(opCodes.C2G_RIDE_ACTIVE)
	// 	message.mountsEntryId = opFactionRideEntryId
	// 	SendGameMessage(message)
	// } else {
	// let message = GetMessage(opCodes.C2G_ITEM_USE)
	// message.id = itemId
	// message.count = count
	// SendGameMessage(message)
	//}

	RpcProxy.call("C2G_ITEM_USE", itemId, count)
}


function _UseItemHandler(item, count) {
	if (item.getRefProperty("action") == "robberMutil") {
		WngMrg.getInstance().showWindow("RobberDoubleFrame")
		return true;
	}
	return false
}

function UseItemRaw(item, count) {
	SendUseItemMessage(item, count)
}

function UseItem(item, count, bConfirm?, useTitle?) {

	if (count == null) {
		count = 1
	}

	//特殊使用
	//根据不同物品，打开不同界面

	if (_UseItemHandler(item, count)) {
		return
	}

	if (!bConfirm) {

		SendUseItemMessage(item, count)
	} else {

		let itemName = item.getName()
		let t: IDialogCallback = {
			onDialogCallback(result: boolean, userData): void {
				if (result) {
					SendUseItemMessage(item, count)
				}
			}
		}

		let name = item.getName()
		let txt = String.format(Localize_cns("ITEM_USE_TIPS"), itemName)
		if (useTitle && useTitle != "") {
			txt = String.format(Localize_cns("ITEM_USE_TIPS1"), useTitle, itemName)
		}
		MsgSystem.confirmDialog(txt, t)

	}
}



//经过排序的属性列表(id)
let sortFieldKeyList = null
function GetSortEquipFieldList() {
	if (sortFieldKeyList == null) {
		sortFieldKeyList = []
		for (let _ in abilityNameToIndex) {
			let v = abilityNameToIndex[_]

			JsUtil.arrayInstert(sortFieldKeyList, v)
		}

		table_sort(sortFieldKeyList)
	}
	return sortFieldKeyList
}


function GetFiledFormatName(index, value, symbol?) {
	if (symbol == null) {
		symbol = ":"
	}

	let name = GetFieldName(index)
	value = TransferItemConfigValue(IndexToabilityName[index], value)
	//这里的value有可能需要根据不同的index，变成百分比或者小数点
	return name + symbol + value
}

//-附加属性索引对应的中文
function GetFieldName(index) {

	return GetPropertyName(index)

}

function KeepFloatTwoBit(value): string {
	let valueStr: string = ""
	if (MathUtil.isFloat(value)) {
		valueStr = String.format("%.2f", value)
	} else {
		valueStr = value
	}

	return valueStr
}

function KeepFloatTwoBitPetcent(value): string {
	let valueStr: string = ""
	if (MathUtil.isFloat(value)) {
		valueStr = String.format("%.2f", value * 100) + "%"
	} else {
		valueStr = (value * 100) + "%"
	}
	return valueStr
}


function FormatNumber2f(value) {
	value = tonumber(String.format("%.2f", value))
	return value
}

function FormatNumberInt(value) {
	value = Math.floor(value + 0.5) //四舍五入
	return value
}


function TransferItemConfigValue(word, value): string {
	let percentType: any = [
		"critdamage", "critdadec", "fireadd", "hpPer", "attPer", "fireAttPer"
	]
	let notIntType = 				//两位小数
		[
			"firesub",
			"dodge",
			"hitrate",
			"debuffhit",
			"debuffdec",
			//"hujia",
			"chuanjia",
			"critrate",
			"critratedec",
			"speed",
		]

	let valueStr = null
	if (table_isExist(percentType, word)) {
		if (MathUtil.isFloat(value)) {
			valueStr = String.format("%.2f", value * 100) + "%"
		} else {
			valueStr = (value * 100) + "%"
		}
	} else if (table_isExist(notIntType, word)) {
		if (MathUtil.isFloat(value)) {
			valueStr = String.format("%.2f", value)
		}
	} else {
		valueStr = Math.floor(value + 0.5) + "" //四舍五入
	}

	if (valueStr == null) {
		valueStr = value + ""
	}

	return valueStr
}

function TransferPropertyValueWithOperate(word, value) {
	if (word == "speed") {
		if (value > 0) {
			value = 1 / value
		}
	}

	return TransferItemConfigValue(word, value)
}

// function GetFightingPropertyShortName(fieldIndex) {
// 	let list: any = {
// 		[objectField.UNIT_FIELD_MAX_HP]: Localize_cns("PROPERTY_SHORT_NAME_TXT1"), //生命     		32
// 		[objectField.UNIT_FIELD_SPEED]: Localize_cns("PROPERTY_SHORT_NAME_TXT2"), //速度    			33
// 		[objectField.UNIT_FIELD_ATTACK]: Localize_cns("PROPERTY_SHORT_NAME_TXT3"), //攻击     		34
// 		[objectField.UNIT_FIELD_DEFENCE]: Localize_cns("PROPERTY_SHORT_NAME_TXT4"), //防御     		35
// 		[objectField.UNIT_FIELD_DEF_THROUGH]: Localize_cns("PROPERTY_SHORT_NAME_TXT5"), //护甲穿透 		36
// 		[objectField.UNIT_FIELD_CRITICAL]: Localize_cns("PROPERTY_SHORT_NAME_TXT6"), //暴击值   		37
// 		[objectField.UNIT_FIELD_CRITICAL_DEC]: Localize_cns("PROPERTY_SHORT_NAME_TXT7"), //抗暴值   		38
// 		[objectField.UNIT_FIELD_CRI_ATT]: Localize_cns("PROPERTY_SHORT_NAME_TXT8"), //暴伤     		39
// 		[objectField.UNIT_FIELD_CRI_ATT_DEC]: Localize_cns("PROPERTY_SHORT_NAME_TXT9"), //抗暴值   		40
// 		[objectField.UNIT_FIELD_DODGE]: Localize_cns("PROPERTY_SHORT_NAME_TXT10"), //闪避值  		41
// 		[objectField.UNIT_FIELD_HITRATE]: Localize_cns("PROPERTY_SHORT_NAME_TXT11"), //命中值  		42
// 		[objectField.UNIT_FIELD_FIRE_ATT]: Localize_cns("PROPERTY_SHORT_NAME_TXT12"), //法术攻击		43
// 		[objectField.UNIT_FIELD_FIRE_DEF]: Localize_cns("PROPERTY_SHORT_NAME_TXT13"), //法术强度		44
// 		[objectField.UNIT_FIELD_FIRE_DEF_THR]: Localize_cns("PROPERTY_SHORT_NAME_TXT14"), //法防穿透		45
// 		[objectField.UNIT_FIELD_DEBUFF_HIT]: Localize_cns("PROPERTY_SHORT_NAME_TXT15"), //状态命中		46
// 		[objectField.UNIT_FIELD_DEBUFF_DEC]: Localize_cns("PROPERTY_SHORT_NAME_TXT16"), //状态抵抗		47
// 		[objectField.UNIT_FIELD_HP_PER]: Localize_cns("PROPERTY_SHORT_NAME_TXT17"), //生命加成		48
// 		[objectField.UNIT_FIELD_ATT_PER]: Localize_cns("PROPERTY_SHORT_NAME_TXT18"), //物攻加成		49
// 		[objectField.UNIT_FIELD_FIRE_ATT_PER]: Localize_cns("PROPERTY_SHORT_NAME_TXT19"), //法攻加成		50
// 	}
// 	if (list[fieldIndex]) {
// 		return list[fieldIndex]
// 	}

// 	let keyName = abilityNameToIndex[fieldIndex]
// 	if (keyName) {
// 		return keyName
// 	}

// 	return "Error:" + tostring(fieldIndex)
// }

// function GetFightingPropertyShortLastName(fieldIndex){ 
// 	let list:any = {
// 									["max_hp"			] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT1"), //生命     		32
// 									["speed"			] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT2"), //速度    			33
// 									["attack"	    ] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT3"), //攻击     		34
// 									["defence"	  ] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT4"), //防御     		35
// 									["def_through"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT5"), //护甲穿透 		36
// 									["critical"   ] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT6"), //暴击值   		37
// 									["critical_dec"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT7"), //抗暴值   		38
// 									["cri_att"    ] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT8"), //暴伤     		39
// 									["cri_att_dec"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT9"), //暴免   		40
// 									["dodge"      ] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT10"), //闪避值  		41
// 									["hitrate"    ] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT11"), //命中值  		42
// 									["fire_att"   ] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT12"), //法术攻击		43
// 									["fire_def"   ] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT13"), //法术强度		44
// 									["fire_defthr"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT14"), //法防穿透		45
// 									["debuff_hit" ] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT15"), //状态命中		46
// 									["debuff_dec" ] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT16"), //状态抵抗		47
// 									["hp_per"	    ] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT17"), //生命加成		48
// 									["att_per" 	  ] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT18"), //物攻加成		49
// 									["fireAtt_per"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT19"), //法攻加成		50

// //									[objectField.UNIT_FIELD_CRIT_PER]          : "crit_per", 			//暴击值百分比   51
// //	[objectField.UNIT_FIELD_CRIT_DEC_PER]      : "crit_dec_per",  //抗暴值百分比   52
// //	[objectField.UNIT_FIELD_CRI_ATT_PER]       : "cri_att_per", 	//爆伤百分比     53
// //	[objectField.UNIT_FIELD_CRI_ATT_DEC_PER]   : "cri_att_dec_per", //抗爆伤百分比   54
// //	[objectField.UNIT_FIELD_DEFENCE_PER]       : "defence_per", 	//物防百分比     55
// //	[objectField.UNIT_FIELD_FIRE_DEF_PER]      : "fire_def_per", 	//法防百分比     56



// 									["crit_per"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT20"), // 暴击值百分比   51  
// 									["crit_dec_per"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT21"), //抗暴值百分比   52 		//-
// 									["cri_att_per"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT22"), // 爆伤百分比     53
// 									["cri_att_dec_per"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT23"), // 抗爆伤百分比   54 		//-
// 									["defence_per"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT24"), // 物防百分比     55 
// 									["fire_def_per"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT25"), // 法防百分比     56

// 									["debuff_hit_per"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT26"), // 状态命中百分比     57
// 									["debuff_dec_per"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT27"), // 状态抵抗百分比     58
// 									["hit_per"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT28"), // 命中百分比     59
// 									["dodge_per"] : Localize_cns("PROPERTY_SHORT_NAME_NEW_TXT29"), // 闪避百分比     60

// 							}
// 	if(list[fieldIndex] ){
// 		return list[fieldIndex]
// 	}

// 	let keyName = abilityNameToIndex[fieldIndex]
// 	if(keyName ){
// 		return keyName
// 	}

// 	return "Error:"+tostring(fieldIndex)
// }


//lastAbilityNameToIdOptions =
//{
//	['MAX_HP']       : objectField.UNIT_FIELD_MAX_HP         , //最大生命
//	['SPEED']        : objectField.UNIT_FIELD_SPEED          , //出手速度
//	['ATTACK']       : objectField.UNIT_FIELD_ATTACK         , //伤害
//	['DEFENCE']      : objectField.UNIT_FIELD_DEFENCE        , //防御
//	['CRITICAL']     : objectField.UNIT_FIELD_CRITICAL       , //暴击率
//	['CRI_ATT']      : objectField.UNIT_FIELD_CRI_ATT        , //暴击伤害
//	['DODGE']        : objectField.UNIT_FIELD_DODGE          , //闪避率
//	['HITRATE']      : objectField.UNIT_FIELD_HITRATE        , //命中率
//	['FIRE_ATT']     : objectField.UNIT_FIELD_FIRE_ATT       , //法术攻击
//	['FIRE_DEF']     : objectField.UNIT_FIELD_FIRE_DEF       , //法术防御
//	['FIRE_DEF_THR'] : objectField.UNIT_FIELD_FIRE_DEF_THR   , //法术防御穿透
//	['STATUS_SUB']   : objectField.UNIT_FIELD_STATUS_SUB     , //状态抗性
//	['CRI_ATT_DEC']  : objectField.UNIT_FIELD_CRI_ATT_DEC    , //暴击伤害减免
//	['DEBUFF_HIT']   : objectField.UNIT_FIELD_DEBUFF_HIT     , //异常状态命中
//	['DEBUFF_DEC']   : objectField.UNIT_FIELD_DEBUFF_DEC     , //异常状态减免
//	['DEF_THROUGH']  : objectField.UNIT_FIELD_DEF_THROUGH    , //护甲穿透
//	['CRITICAL_DEC'] : objectField.UNIT_FIELD_CRITICAL_DEC   , //抗暴值
//	['HP']           : objectField.UNIT_FIELD_HP             , //当前生命
//	['HP_PER']       : objectField.UNIT_FIELD_HP_PER         , //生命百分比
//	['ATT_PER']      : objectField.UNIT_FIELD_ATT_PER        , //物攻百分比
//	['FIRE_ATT_PER'] : objectField.UNIT_FIELD_FIRE_ATT_PER   , //法攻百分比
//}




function MakeLongNumberShort(value) {
	if (value == null) {
		return ""
	}

	if (type(value) == "number") {
		// if(isEnglish() ){
		// 	return value +""
		// }

		if (value < 10000) {
			return value
		}

		//显示亿
		if (value > 100000000) {
			let shortNum = String.format("%.1f", value / 100000000)
			return shortNum + Localize_cns("A_HUNDRED_MILLION")
		}

		//显示万
		let shortNum = String.format("%.1f", value / 10000)
		return shortNum + Localize_cns("TEN_THOUSAND")

	}

	if (type(value) == "string") {
		return value
	}

	return ""
}




function getMaxConfigEnhanceLevel(enhanceLevel) {
	let minEnhanceLevel = 0

	let lastWordCountEntry = GameConfig.EquipConfigNew2["lastAttrCount"].enLevel
	for (let configLevel_ in lastWordCountEntry.value) {
		//let _ = lastWordCountEntry.value[configLevel]

		let configLevel = tonumber(configLevel_);

		minEnhanceLevel = (enhanceLevel >= configLevel && configLevel > minEnhanceLevel) && configLevel || minEnhanceLevel
	}
	return minEnhanceLevel
}



//不存在的装备可能属性
// function GetPreviewEquipAttribute(itemEntry, level, starLevel?) {
// 	//attrFactor、attrBase 是hash索引的，其他字段是数组索引


// 	let mainList: any = {}
// 	let otherList: any = {}

// 	let equipInfoConfig = GameConfig.Legendequip[itemEntry]

// 	let type = equipInfoConfig["type"]
// 	let subtype = equipInfoConfig["subtype"]
// 	let itemLevel = equipInfoConfig["level"] //物品等级


// 	//let typeName = opEquipTypeToName[type]

// 	let upLevel = level || 0 //强化等级
// 	let enhanceRevise = GameConfig.EquipEnhance[upLevel]["value"]

// 	////////////////////////////////////////////////////////////////////////////////////////
// 	//固定附加属性

// 	//固定属性和附加属性范围
// 	let fixedPropertyFactor: any = [0, 0]
// 	let appendPropertyFactor: any = [0, 0]

// 	let attrFactorInfo = GameConfig.EquipConfigNew2["attrFactor"][tostring(itemEntry)]

// 	if (attrFactorInfo) {
// 		//固定属性范围+概率，找出最大最小值
// 		let info = attrFactorInfo["value"][1]
// 		let maxValue = -9999
// 		let minValue = 9999
// 		for (let i = 0; i < info.length; i++) {
// 			let v = info[i]

// 			let min = v[0]
// 			let max = v[1]

// 			if (min < minValue) {
// 				minValue = min
// 			}

// 			if (max > maxValue) {
// 				maxValue = max
// 			}
// 		}
// 		fixedPropertyFactor = [minValue, maxValue]

// 		//固定属性范围+概率，找出最大最小值
// 		info = attrFactorInfo["value"][2]
// 		maxValue = -9999
// 		minValue = 9999
// 		for (let i = 0; i < info.length; i++) {
// 			let v = info[i]

// 			let min = v[0]
// 			let max = v[1]

// 			if (min < minValue) {
// 				minValue = min
// 			}

// 			if (max > maxValue) {
// 				maxValue = max
// 			}
// 		}
// 		appendPropertyFactor = [minValue, maxValue]
// 	}


// 	//获得固定属性词条列表
// 	let fixedValueList = []
// 	let propertyList = GameConfig.EquipConfigNew2["baseAttrChoice"][tostring(subtype)]["value"]
// 	for (let _ in propertyList) {
// 		let info = propertyList[_]

// 		let proList = info[0] //[1]是概率
// 		for (let _ = 0; _ < proList.length; _++) {
// 			let proName = proList[_]

// 			//基础值
// 			let baseValue = GameConfig.EquipConfigNew2["attrBase"][proName]["value"][1]

// 			//修正系数
// 			let enhanceRatio = GameConfig.EquipConfigNew2["enhanceRatio"][proName]["value"][0]

// 			//物品等级修正系数
// 			let levelRevise = GameConfig.EquipConfigNew2["equipLevel"][tostring(itemLevel)]["value"][proName][0]

// 			//objectField index
// 			let index = abilityNameToIndex[proName]
// 			if (index) {
// 				// let temp = null
// 				// let minVal = 0
// 				// let maxVal = 0
// 				let fixedValueInfo: any = {}
// 				fixedValueInfo.index = index
// 				let [temp, minVal] = calcEquipBaseAtrri(proName, fixedPropertyFactor[0], baseValue, enhanceRevise, enhanceRatio, levelRevise)
// 				let [temp2, maxVal] = calcEquipBaseAtrri(proName, fixedPropertyFactor[1], baseValue, enhanceRevise, enhanceRatio, levelRevise)
// 				fixedValueInfo.min = minVal
// 				fixedValueInfo.max = maxVal
// 				JsUtil.arrayInstert(fixedValueList, fixedValueInfo)
// 			}

// 		}
// 	}

// 	////////////////////////////////////////////////////////////////////////////////////////
// 	//获取附加属性

// 	//获得附加属性列表
// 	let appendValueList: any = []

// 	//当前强化等级最多能获得多少条附加属性
// 	let maxAppendPropertyCount = 0
// 	let curEnhanceLevel = getMaxConfigEnhanceLevel(upLevel)

// 	//TLog.Debug("curEnhanceLevel", curEnhanceLevel, upLevel)
// 	let maxEnhanceCountInfo = GameConfig.EquipConfigNew2["lastAttrCount"]["enLevel"]["value"][curEnhanceLevel]
// 	if (maxEnhanceCountInfo) {
// 		for (let _ in maxEnhanceCountInfo) {
// 			let v = maxEnhanceCountInfo[_]

// 			let count = v[0] //[1]是概率
// 			if (count > maxAppendPropertyCount) {
// 				maxAppendPropertyCount = count
// 			}
// 		}


// 		//当前强化等级能获得多少条附加属性
// 		TLog.Debug(subtype, curEnhanceLevel, "~~~~")
// 		let appendPropertyList = GameConfig.EquipConfigNew2["lastWord"][tostring(subtype)]["value"][curEnhanceLevel]
// 		for (let _ in appendPropertyList) {
// 			let v = appendPropertyList[_]

// 			let proName = v[0]

// 			//附加属性 基础值
// 			let appendValue = GameConfig.EquipConfigNew2["attrBase"][proName]["value"][2]

// 			//修正系数
// 			let enhanceRatio = GameConfig.EquipConfigNew2["enhanceRatio"][proName]["value"][0]

// 			//物品等级修正系数
// 			let levelRevise = GameConfig.EquipConfigNew2["equipLevel"][tostring(itemLevel)]["value"][proName][1]

// 			//objectField index
// 			let index = abilityNameToIndex[proName]
// 			if (index) {
// 				//let temp, minVal, maxVal
// 				let appendValueInfo: any = {}
// 				appendValueInfo.index = index
// 				let [temp, minVal] = calcEquipLastAttri(proName, appendPropertyFactor[0], appendValue, enhanceRevise, enhanceRatio, levelRevise)
// 				let [temp2, maxVal] = calcEquipLastAttri(proName, appendPropertyFactor[1], appendValue, enhanceRevise, enhanceRatio, levelRevise)

// 				appendValueInfo.min = minVal
// 				appendValueInfo.max = maxVal

// 				JsUtil.arrayInstert(appendValueList, appendValueInfo)
// 			}
// 		}

// 	}
// 	appendValueList.maxPropertyCount = maxAppendPropertyCount

// 	//固定属性，附加属性	
// 	return [fixedValueList, appendValueList]
// }


//装备存在，属性已经固定了
// function GetPreviewEquipAttributeByItem(item, level, starLevel?) {
// 	let fixedValueList = []
// 	let appendValueList = []
// 	let temp = null
// 	//equipBuild = 
// 	//{
// 	//	[opEquipBuildConfig.baseFactorValue] : {[基础属性索引] : 基础属性系数}，
// 	//	[opEquipBuildConfig.lastFactorValue] = {[索引] : {附加属性索引, 附加属性系数}}
// 	//}

// 	let equipBuild = item.getProperty("equip_build")
// 	let enhanceRevise = GameConfig.EquipEnhance[level]["value"] //强化系数

// 	let itemLevel = item.getRefProperty("level")

// 	//-基础值
// 	let fiexdValue = item.getProperty("fixedValue")
// 	if (fiexdValue) {
// 		let baseFactorValue = equipBuild[opEquipBuildConfig.baseFactorValue - 1]
// 		for (let index in fiexdValue) {
// 			let baseValue = fiexdValue[index]

// 			let proName = IndexToabilityName[index]
// 			let factor = baseFactorValue[index]
// 			//基础值
// 			baseValue = GameConfig.EquipConfigNew2["attrBase"][proName]["value"][1]

// 			//修正系数
// 			let enhanceRatio = GameConfig.EquipConfigNew2["enhanceRatio"][proName]["value"][0]

// 			let levelRevise = GameConfig.EquipConfigNew2["equipLevel"][tostring(itemLevel)]["value"][proName][0]

// 			let fixedValueInfo: any = {}
// 			fixedValueInfo.index = index
// 			let [temp, val] = calcEquipBaseAtrri(proName, factor, baseValue, enhanceRevise, enhanceRatio, levelRevise)
// 			fixedValueInfo.value = val;
// 			JsUtil.arrayInstert(fixedValueList, fixedValueInfo)
// 		}
// 	}

// 	let appendValue = item.getProperty("appendValue")
// 	if (appendValue) {
// 		let lastFactorValue = equipBuild[opEquipBuildConfig.lastFactorValue - 1]
// 		for (let i in appendValue) {
// 			let info = appendValue[i]

// 			let index = info[0] //object index

// 			let proName = IndexToabilityName[index]
// 			let factor = lastFactorValue[i][1]

// 			//附加属性 基础值
// 			let proAppendValue = GameConfig.EquipConfigNew2["attrBase"][proName]["value"][2]

// 			//修正系数
// 			let enhanceRatio = GameConfig.EquipConfigNew2["enhanceRatio"][proName]["value"][0]

// 			let levelRevise = GameConfig.EquipConfigNew2["equipLevel"][tostring(itemLevel)]["value"][proName][1]

// 			let appendValueInfo: any = {}
// 			appendValueInfo.index = index
// 			let [temp, val] = calcEquipLastAttri(proName, factor, proAppendValue, enhanceRevise, enhanceRatio, levelRevise)
// 			appendValueInfo.value = val
// 			JsUtil.arrayInstert(appendValueList, appendValueInfo)
// 		}
// 	}


// 	return [fixedValueList, appendValueList]
// }




// function TransPropertyToRelatePer(index, info) {				//职业或者伙伴info
// 	let list: any = {
// 		[objectField.UNIT_FIELD_MAX_HP]: objectField.UNIT_FIELD_HP_PER,
// 		[objectField.UNIT_FIELD_ATTACK]: objectField.UNIT_FIELD_ATT_PER,
// 		[objectField.UNIT_FIELD_FIRE_ATT]: objectField.UNIT_FIELD_FIRE_ATT_PER,
// 	}
// 	if (!list[index]) {
// 		return null
// 	}
// 	let numberList: any = {
// 		[objectField.UNIT_FIELD_HP_PER]: 0,
// 		[objectField.UNIT_FIELD_ATT_PER]: 1,
// 		[objectField.UNIT_FIELD_FIRE_ATT_PER]: 2,
// 	}

// 	let realIndex = list[index]
// 	let symbol = common_objectFiled[realIndex]
// 	let infoPer = info[symbol] || 0					//小数

// 	let [level, userData, nowList, nextList] = ItemSystem.getInstance().GetSkill()
// 	if (!nowList) {
// 		return null
// 	}
// 	let nowvalue = nowList[numberList[realIndex]]
// 	let data = 0
// 	if (nowvalue != null){
// 		data = nowvalue.data * 100
// 	}
// 	let sacrifPer = 1 +  data / 100
// 	let percent = infoPer * sacrifPer * 100
// 	return AdjustNumberFont(percent, 2)

// }

// function GetHeroMoneyVar(unitType) {
// 	let typeVarMap = {
// 		[opItemUnit.FUNDS] : "funds",
// 		[opItemUnit.CURRENCY] : "gold",
// 		[opItemUnit.JJC_POINT] : "JJCPoint",
// 		[opItemUnit.BIND_CURRENCY] : "bindGold",
// 	}

// 	return typeVarMap[unitType]

// }
//货币的字符串
function GetMoneyStr(unit){
	let cns = ItemUnitName[unit] || ""
	return Localize_cns(cns)
}

//根据元宝，转换成人民币
function GetRmbFromGold(gold) {
	return Math.floor(gold / 100)
}

function GetHeroMoneyStr(unitType) {
	let cns = ""
	if (opItemUnit.FUNDS == unitType) { //金币
		cns = "JINBI"
	} else if (opItemUnit.CURRENCY == unitType) { //晶石
		cns = "YUANBAO"
	} else if (opItemUnit.BIND_CURRENCY == unitType) {
		cns = "BIND_YUANBAO"
	}
	return Localize_cns(cns)
}

function GetHeroMoney(unitType) {
	let money = 0
	if (opItemUnit.FUNDS == unitType) { //金币
		money = GetHeroProperty("funds")
	} else if (opItemUnit.CURRENCY == unitType) { //晶石
		money = GetHeroProperty("gold")
		//} else if (opItemUnit.JJC_POINT == unitType) { //晶石
		//	money = GetHeroProperty("JJCPoint") || 0
		// } else if (opItemUnit.SKY_TOWER_POINT == unitType) { //试炼场	（天空之塔）
		// 	money = GetHeroProperty("ShiLianPoint") || 0
		// } else if (opItemUnit.LEAGUE_POINT == unitType) {
		// 	money = GetHeroProperty("TianTiPoint") || 0
		// } else if (opItemUnit.ZHENXING_POINT == unitType) {
		// 	money = GetHeroProperty("ZhenYingPoint") || 0
		// } else if (opItemUnit.HOME_PAGE_CHARM == unitType) {
		// 	money = tonumber(GetHeroProperty("personalCharm")) || 0
		// } else if (opItemUnit.FACT_TASK_POINT == unitType) {
		// 	money = tonumber(GetHeroProperty("facTaskPoint")) || 0
	} else if (opItemUnit.BIND_CURRENCY == unitType) {
		money = GetHeroProperty("bindGold") || 0
	} else {
		let moneyTable = GetHeroProperty("moneyTable")
		if (moneyTable) {
			money = moneyTable[unitType] || 0
		}
	}

	return money
}

////////////////////////////////////////////////////////////////-
function GetActorEquipPosTypeInfo() {
	let pos2Type: any = {
		[1]: opItemType.ITEM_TYPE_WEAPON,
		[2]: opItemType.ITEM_TYPE_CAP,
		[3]: opItemType.ITEM_TYPE_CLOTH,


		[4]: opItemType.ITEM_TYPE_MASK,
		[5]: opItemType.ITEM_TYPE_NECK,
		[6]: opItemType.ITEM_TYPE_SHOE,
	}
	return pos2Type
}


//获取角色装备
function GetActorEquipByPos(actorInfo, pos) {
	if (actorInfo == null || pos == null) {
		return null
	}
	let posName = EquipPosName[pos]
	return actorInfo[posName]
}

function GetActorEquipByType(actorInfo, itemType) {

	let posTypeInfo = GetActorEquipPosTypeInfo()

	let pos = -1
	for (let _k in posTypeInfo) {
		let k = tonumber(_k)
		let type = posTypeInfo[k]

		if (type == itemType) {
			pos = k
			break
		}
	}

	return GetActorEquipByPos(actorInfo, pos)
}

function ResetActorEquip(actorInfo) {
	if (actorInfo == null) {
		return
	}

	for (let _ in EquipPosName) {
		let name = EquipPosName[_]

		delete actorInfo[name]
	}
}

function SetActorEquip(actorInfo, item) {
	if (item == null) {
		return
	}
	let pos = item.getProperty("position")

	let posName = EquipPosName[pos]
	if (posName == null || actorInfo == null) {
		return
	}
	actorInfo[posName] = item
}

function GetRoleEquipTypeName(subtype) {
	return Localize_cns("ROLE_EQUIP_TXT" + subtype)
}

function AnalyPrizeFormat(prizeList: any[]) {
	let list = []						//根据奖励的填表格式返回一个列表[[entryId, count, quality], [entryId, count, quality], [entryId, count],]
	prizeList.forEach(v => {
		let t = null
		if (v[0] == "item") {					//["item", entryId, count]
			t = [v[1], v[2]]
		} else if (v[0] == "rmb") {				//["rmb", count]
			t = [SpecailItemId.GOLD, v[1]]
		} else if (v[0] == "exp") {				//["exp", count]
			t = [SpecailItemId.EXP, v[1]]
		} else if (v[0] == "bindRmb") {			//["bindRmb", count]
			t = [SpecailItemId.B_GOLD, v[1]]
		} else if (v[0] == "funds") {			//["funds", count]
			t = [SpecailItemId.FUNDS, v[1]]
		} else if (v[0] == "blueEquip") {
			t = [SpecailItemId.BLUEEQUIP, v[1]]
		} else if (v[0] == "purpleEquip") {
			t = [SpecailItemId.PURPLEEQUIP, v[1]]
		} else if (v[0] == "equip") {
			t = [v[1], v[2], v[3]]
		} else if (v[0] == "commonEquip") {
			t = [v[1], v[2], v[3], v[4]]
		} else if (v[0] == "facContribute") {
			t = [SpecailItemId.BANGGONG, v[1]]
		} else if (v[0] == "talisman") {
			t = [v[1], v[2], v[3]]
		} else if (v[0] == "worldPoint") {
			t = [SpecailItemId.WORLD_POINT, v[1]]
		} else if (v[0] == "shenhun"){
			t = [v[1], v[2], v[3], v[4]]
		}

		if (t) {
			table_insert(list, t)
		}
	})

	return list
}

//背包装备满
function CheckBeiBaoEquipIsFull() {
	let equipList = ItemSystem.getInstance().getEquipItemList()
	let maxCapacity = GetHeroProperty("equipMax")
	if (size_t(equipList) >= maxCapacity) { //满
		let t: IDialogCallback = {
			onDialogCallback(result: boolean, userData): void {
				if (result == true) {
					ExecuteMainFrameFunction("ronglian")
				}
			}
		}
		MsgSystem.confirmDialog(Localize_cns("BEIBAO_IS_FULL_TIPS"), t)
		return true
	} else {
		return false
	}
}

//背包装备快满
function CheckBeiBaoEquipWillFull() {
	let equipList = ItemSystem.getInstance().getEquipItemList()
	let maxCapacity = GetHeroProperty("equipMax")
	if (size_t(equipList) >= maxCapacity - 20) { //满
		let t: IDialogCallback = {
			onDialogCallback(result: boolean, userData): void {
				if (result == true) {
					ExecuteMainFrameFunction("ronglian")
				}
			}
		}
		MsgSystem.confirmDialog_YES(Localize_cns("BEIBAO_WILL_FULL_TIPS"), t)
		return true
	} else {
		return false
	}
}

function IsItemEquipType(entryId) {
	let itemRef = ItemSystem.getInstance().getItemTemplateInfo(entryId) || null
	if (itemRef) {
		let itemtype = itemRef.type

		if ((itemtype >= opItemType.PLAYER_EQUIP_START && itemtype <= opItemType.PLAYER_EQUIP_END)) {
			return true
		}

		if ((itemtype >= opItemType.ITEM_TYPE_FAIRY_START && itemtype <= opItemType.ITEM_TYPE_FAIRY_END)) {
			return true
		}

		if ((itemtype >= opItemType.ITEM_TYPE_RIDE_START && itemtype <= opItemType.ITEM_TYPE_RIDE_END)) {
			return true
		}

		//通用和角色装备
		if ((itemtype >= opItemType.COMMON_EQUIP && itemtype <= opItemType.ROLE_EQUIP)) {
			return true
		}
	}

	return false
}

//物品获取途径
function GetItemFastJump(entryId) {
	let wnd = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
	wnd.onShowWnd(entryId)
}

//神宠
function CheckPetIsGod(petId) {
	let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(petId)
	if (petConfigInfo) {
		let quality = petConfigInfo.quality
		let add = petConfigInfo.add || 0

		if (quality == opPetQuality.gold && petConfigInfo.add > 0) {
			return true
		} else if (quality > opPetQuality.gold) {
			return true
		}
	}
	return false
}

//屏蔽宠物
function CheckPetIsShield(petId) {
	let petConfig = GameConfig.PetConfig[petId]
	if (!petConfig) {
		return true
	}

	let isShield = false
	let shield = petConfig.shield || 0
	let shieldTime = petConfig.shieldtime || 0
	if (shield == 1 && (GetServerTime() - GetServerOpenTime() < shieldTime)) {
		isShield = true
	}

	return isShield
}

//检查宠物合成是解锁状态
function CheckPetIsUnLock(petId) {
	let config = GameConfig.PetComPoundConfig[petId]
	if (!config) {
		return 0
	}

	let sonList = config.Son || []
	let state = 0 //0未解锁 1可解锁 2已解锁
	let petList = [] //未解锁宠物列表
	let unLockList = PetSystem.getInstance().getPetUnionRecordList()
	if (table_isExist(unLockList, petId)) {
		state = 2
	} else {
		if (size_t(sonList) > 0) {
			for (let _ in sonList) {
				let son = sonList[_]
				//是否解锁
				if (!table_isExist(unLockList, son)) {
					table_insert(petList, son)
				}
			}

			if (size_t(petList) == 0) {
				state = 1
			}
		} else {
			if (!table_isExist(unLockList, petId)) {
				state = 1
			}
		}
	}

	return state
}

//是否飞升宠物
function CheckIsFlyPet(petId) {
	let config = GameConfig.PetConfig[petId]
	if (!config) {
		return false
	}

	return size_t(config.flyskill) > 0
}