// TypeScript file

//获取属性字符串
function GetPropertyName(fieldIndex, sign?) {
    if (sign == null) {
        sign = Localize_cns("MAOHAO")
    }

    let list: any = {
        [objectField.UNIT_FIELD_MAX_HP]: Localize_cns("PROPERTY_NAME_TXT1"), //生命
        [objectField.UNIT_FIELD_ATTACK]: Localize_cns("PROPERTY_NAME_TXT2"),       // 攻击
        [objectField.UNIT_FIELD_DEFENCE]: Localize_cns("PROPERTY_NAME_TXT3"),        // 防御
        [objectField.UNIT_FIELD_SPEED]: Localize_cns("PROPERTY_NAME_TXT4"),        //速度
        [objectField.UNIT_FIELD_HITRATE]: Localize_cns("PROPERTY_NAME_TXT5"),      // 命中值
        [objectField.UNIT_FIELD_DODGE]: Localize_cns("PROPERTY_NAME_TXT6"),        // 闪避率
        [objectField.UNIT_FIELD_CRITICAL]: Localize_cns("PROPERTY_NAME_TXT7"),     // 暴击值
        [objectField.UNIT_FIELD_CRITICAL_DEC]: Localize_cns("PROPERTY_NAME_TXT8"),  // 抗暴值
        [objectField.UNIT_FIELD_DEF_THR]: Localize_cns("PROPERTY_NAME_TXT9"),  // 无视防御
        [objectField.UNIT_FIELD_DEF_THR_DEC]: Localize_cns("PROPERTY_NAME_TXT10"),  // 减免无视
        [objectField.UNIT_FIELD_ATT_INC]: Localize_cns("PROPERTY_NAME_TXT11"),  // 伤害增加
        [objectField.UNIT_FIELD_ATT_DEC]: Localize_cns("PROPERTY_NAME_TXT12"),  // 伤害减少
        [objectField.UNIT_FIELD_CRI_ATT]: Localize_cns("PROPERTY_NAME_TXT13"),   // 暴击加成
        [objectField.UNIT_FIELD_CRI_ATT_DEC]: Localize_cns("PROPERTY_NAME_TXT14"),    // 暴伤减免
        [objectField.UNIT_FIELD_PVP_ATT_INC]: Localize_cns("PROPERTY_NAME_TXT15"),   // PVP伤害增加
        [objectField.UNIT_FIELD_PVP_ATT_DEC]: Localize_cns("PROPERTY_NAME_TXT16"),    // PVP伤害减少
        [objectField.UNIT_FIELD_PVE_ATT_INC]: Localize_cns("PROPERTY_NAME_TXT17"),   // PVE伤害增加
        [objectField.UNIT_FIELD_PVE_ATT_DEC]: Localize_cns("PROPERTY_NAME_TXT18"),    // PVE伤害减少
    }
    if (list[fieldIndex]) {
        return list[fieldIndex] + sign
    }

    let keyName = abilityNameToIndex[fieldIndex]
    if (keyName) {
        return list[keyName] + sign
    }

    return "Error:" + tostring(fieldIndex)
}

///////////////////////////////获取属性config//////////////////////////////////
//-------------------------------------------宠物属性
//宠物--基础属性
function GetPetBaseProperty(petId) {
    let petConfig = PetSystem.getInstance().getPetEntryInfo(petId)
    return table_effect(petConfig.effects)
}

//单个激活宠物--升级属性
function GetPetLvProperty(petId, petInfo?) {
    let configInfo = PetSystem.getInstance().getPetEntryInfo(petId)
    let netInfo = petInfo || PetSystem.getInstance().getPetInfo(petId)

    let list = GetPetBaseProperty(petId)

    if (netInfo) {
        let stage = netInfo.stage
        //宠物升一次不加属性 升一级加属性
        let effects = table_effect(GameConfig.FunUpgradeEffectConfig["PetUpgrade"][stage].effects)
        table_effect_add(list, effects)
    }

    return list
}

//单个激活宠物--资质属性
function GetPetGrowProperty(petId, petInfo?) {
    let funType = cellOptionsIndex.Pet
    let growconfig = PetSystem.getInstance().getPetGrowInfo(funType, petId)
    let netInfo = petInfo || PetSystem.getInstance().getPetInfo(petId)

    let list: any = {
        [IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]: 0,
        [IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]: 0,
        [IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]: 0,
    }

    if (netInfo) {
        list = table_effect(growconfig.effects)
        let ratio = netInfo.growexp
        table_effect_mul(list, ratio)
    }

    return list
}

//单个飞升宠物--资质属性
function GetPetFlyGrowProperty(petId, petInfo?) {
    let funType = cellOptionsIndex.PetFly
    let growconfig = PetSystem.getInstance().getPetGrowInfo(funType, petId)
    let netInfo = petInfo || PetSystem.getInstance().getPetInfo(petId)
    let list: any = {
        [IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]: 0,
        [IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]: 0,
        [IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]: 0,
    }

    if (netInfo) {
        list = table_effect(growconfig.effects)
        let ratio = netInfo.flystageexp/growconfig.oneexp
        table_effect_mul(list, ratio)
    }

    return list
}

//全部激活宠物--升级级总属性
function GetSumPetLvProperty() {
    let petInfoList = PetSystem.getInstance().getPetInfoList()
    let list = null

    for (let i in petInfoList) {
        let petId = petInfoList[i].entryid
        let effects = GetPetLvProperty(petId)
        if (list == null) {
            list = effects
        } else {
            table_effect_add(list, effects)
        }
    }

    return list || {}
}

//全部激活宠物--资质总属性
function GetSumPetGrowProperty() {
    let petInfoList = PetSystem.getInstance().getPetInfoList()
    let list = null

    for (let i in petInfoList) {
        let petId = petInfoList[i].entryid
        let effects = GetPetGrowProperty(petId)
        if (list == null) {
            list = effects
        } else {
            table_effect_add(list, effects)
        }
    }

    return list || {}
}

//全部飞升宠物--总属性
function GetSumPetFlyGrowProperty() {
    let petFlyList = PetSystem.getInstance().getPetFlyList()
    let list = null

    for (let i in petFlyList) {
        let petId = petFlyList[i]
        let effects = GetPetFlyGrowProperty(petId)
         if (list == null) {
            list = effects
        } else {
            table_effect_add(list, effects)
        }
    }

    return list || {}
}

//计算单个宠物总属性
function GetPetProperty(petId, petInfo?) {
    let lvpro = GetPetLvProperty(petId, petInfo)
    let growpro = GetPetGrowProperty(petId, petInfo)

    // [IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]: 0,
    // [IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]: 0,
    // [IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]: 0,

    let list = table_effect_add(lvpro, growpro)

    return list
}

//计算全部宠物总属性
function GetSumPetProperty() {
    let lvpro = GetSumPetLvProperty()
    let growpro = GetSumPetGrowProperty()
    let flypro = GetSumPetFlyGrowProperty()

    // [IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]: 0,
    // [IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]: 0,
    // [IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]: 0,

    let list = table_effect_add(lvpro, growpro)
    list = table_effect_add(list, flypro)

    return list
}

//-------------------------------------------人物属性
//单件角色装备基础属性
function GetRoleEquipBaseProperty(id, quality) {
    if (quality == null) {
        quality = opPetQuality.gray
    }
    let config = ItemSystem.getInstance().getItemTemplateInfo(id)
    let effects = GameConfig.RoleEquipEffect[config.suit][quality][config.subtype].effects
    return table_effect(effects)
}

//单件角色装备附加属性 -- 
//强化属性
function GetForgeCellProperty(typeName, subtype) { //pos 哪一件装备
    let pos = 0
    for (let key in ForgeFrame.subtypeList) {
        if (ForgeFrame.subtypeList[key] == subtype) {
            pos = tonumber(key) + 1
        }
    }
    let levelList = ForgeSystem.getInstance().getForgeInfo(typeName)
    let level = levelList[pos - 1]
    if (typeName == elemForgeNames[elemForgeIndexs.baoshi - 1]) {
        let baoshiList = ForgeSystem.getInstance().getBaoShiStr(typeName, pos - 1, level)
        return baoshiList[1]
    }
    let config = ForgeSystem.getInstance().getCellForgeConfig(typeName, pos - 1, level)
    return config
}

//时装、称号总属性
function GetSumFashionAndTitleProperty(funName) {

    let config: any = {
        maxhp: 0,
        demage: 0,
        hujia: 0
    }
    let skinConfig = GameConfig.FunSkinConfig[funName]
    let jiHuoList
    if (funName == "Hero") {
        jiHuoList = RoleSystem.getInstance().getRoleInfo("unlocktitlelist")
    } else {
        jiHuoList = RoleSystem.getInstance().getRoleInfo("unlockfashionlist")
    }

    for (let i = 0; i < size_t(jiHuoList); i++) {
        let effects: any[] = skinConfig[jiHuoList[i]].effects
        let tempConfig = table_effect(effects)
        config = table_effect_add(config, tempConfig)
    }

    return config
}

///返回锻造位置的总属性
function GetForgeTotalProperty(pos) {
    let configList = {}
    for (let k in elemForgeNames) {
        let typeName = elemForgeNames[k]
        let tempConfig = GetForgeCellProperty(typeName, pos)
        if (tempConfig != null) {
            configList[typeName] = tempConfig
        }
    }
    return configList
}

//-------------------------------------------通用属性
//单件通用装备基础属性
function GetFunEquipBaseProperty(id, quality) {
    let config = ItemSystem.getInstance().getItemTemplateInfo(id)
    let effects = GameConfig.CommonEquipEffect[config.pos][config.level][quality].effects
    return table_effect(effects)
}

//单件通用装备附加属性
function GetFunEquipAddProperty(id, quality) {
    let config = ItemSystem.getInstance().getItemTemplateInfo(id)
    let effects = GameConfig.CommonEquipEffect[config.pos][config.level][quality].addeffects
    return table_effect(effects)
}

//单件通用装备属性
function GetFunEquipProperty(id, quality, addnum) {
    let basePro = GetFunEquipBaseProperty(id, quality)
    let addPro = GetFunEquipAddProperty(id, quality)

    let list = {}
    list = basePro
    // [IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]: 0,
    // [IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]: 0,
    // [IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]: 0,

    for (let i = 0; i < addnum; i++) {
        table_effect_add(list, addPro)
    }

    return list
}

//属性丹属性
function GetDrugProperty(funType) {
    let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
    let funName = cellOptionsName[funType - 1]
    let drugConfig = GameConfig.FunAbilityDrugConfig[funName]
    let drugnum = funInfo.drugnum

    let effects: any[] = drugConfig.effects
    let config = table_effect(effects)
    return table_effect_mul(config, drugnum)
}

///单个皮肤的属性
function GetSingleSkinProperty(funType, skinIndex) {
    let funName = cellOptionsName[funType - 1]
    let skinConfig = GameConfig.FunSkinConfig[funName][skinIndex]
    return table_effect(skinConfig.effects)
}


//皮肤总属性
function GetSumSkinProperty(funType) {

    let config: any = {
        maxhp: 0, demage: 0, hujia: 0
    }
    let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
    let funName = cellOptionsName[funType - 1]
    if (GameConfig.FunSkinConfig[funName] == null) {
        return config
    }
    let skinConfig = GameConfig.FunSkinConfig[funName]
    let jiHuoList = funInfo.skinlist

    for (let i = 0; i < size_t(jiHuoList); i++) {
        let effects: any[] = skinConfig[jiHuoList[i]].effects
        let tempConfig = table_effect(effects)
        config = table_effect_add(config, tempConfig)
    }

    return config
}



//-------------------------------------------仙侣属性
//计算单个仙侣总属性
function GetXianLvProperty(xianlvId) {
    let config = {}
    let initEffects = table_effect(GameConfig.ActorXianLvConfig[xianlvId].effects)
    config = table_effect_add(config, initEffects)
    if (XianLvSystem.getInstance().isExit(xianlvId)) {
        let stage = XianLvSystem.getInstance().getLevel(xianlvId)
        let stageexp = XianLvSystem.getInstance().getExpById(xianlvId)
        let expcell = GameConfig.FunUpgradeStageConfig["XianLv"][stage].expcell
        let step = Math.ceil(stageexp / expcell)

        let stageEffects = GameConfig.FunUpgradeEffectConfig["XianLvUpgrade"][stage].effects
        config = table_effect_add(config, table_effect(stageEffects))


        let stepEffects = GameConfig.FunUpgradeEffectConfig["XianLvStep"][stage].effects
        let tempConfig = table_effect_mul(table_effect(stepEffects), step)
        config = table_effect_add(config, tempConfig)


    }

    return config
}

//计算全部仙侣总属性
function GetSumXianLvProperty() {
    let config = {
        maxhp: 0,
        demage: 0,
        hujia: 0
    }
    let jihuolist = XianLvSystem.getInstance().getJiHuoList()
    for (let i = 0; i < size_t(jihuolist); i++) {
        let tempConfig = GetXianLvProperty(jihuolist[i])
        config = table_effect_add(config, tempConfig)

    }


    // [IndexToabilityName[objectField.UNIT_FIELD_MAX_HP]]: 0,
    // [IndexToabilityName[objectField.UNIT_FIELD_ATTACK]]: 0,
    // [IndexToabilityName[objectField.UNIT_FIELD_DEFENCE]]: 0,


    return config
}

//-----------------------通用进阶属性
function GetTemCellUpgradeProperty(funType) {
    let config = {}
    let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
    let funName = cellOptionsName[funType - 1]
    let level = funInfo.stage
    let stageexp = funInfo.stageexp
    let expcell = GameConfig.FunUpgradeStageConfig[funName][level].expcell
    let step = Math.ceil(stageexp / expcell)
    //大阶
    let cellEffects = GameConfig.FunUpgradeEffectConfig[funName][level].effects
    config = table_effect_add(config, table_effect(cellEffects))
    //小阶
    let stepEffects = GameConfig.FunUpgradeEffectConfig["TempCellStep"][level].effects
    let tempConfig = table_effect_mul(table_effect(stepEffects), step)
    config = table_effect_add(config, tempConfig)

    return config

}

function GetTemCellNextGradeProperty(funType) {
    let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
    let funName = cellOptionsName[funType - 1]
    let level = funInfo.stage + 1

    //下阶的属性
    let cellEffects = GameConfig.FunUpgradeEffectConfig[funName][level].effects
    let tempConfig = table_effect(cellEffects)
    //现在的进阶属性
    let nowConfig = GetTemCellUpgradeProperty(funType)

    return table_effect_sub(tempConfig, nowConfig)
}

//-----------------------通用界面总属性(进阶、坐骑、装备、属性丹)
function GetTemCellTotalProperty(funType) {
    //进阶
    let config1 = GetTemCellUpgradeProperty(funType)
    //装备
    let config2 = {}
    let funEquiplist = FunSystem.getInstance().getWearEquipItemList(funType)
    for (let k in funEquiplist) {
        let item = <Item>funEquiplist[k]
        let tempConfig = GetFunEquipProperty(item.entryId, item.getProperty("quality"), item.getProperty("add_num"))
        config2 = table_effect_add(config2, tempConfig)
    }
    if (size_t(config2) == 0) {
        config2 = {
            maxhp: 0, demage: 0, hujia: 0
        }
    }
    //皮肤
    let config3 = GetSumSkinProperty(funType)
    //属性丹
    let config4 = GetDrugProperty(funType)

    return [config1, config2, config3, config4]

}

function GetTemCellTotalForce(funType) {
    let propertyList = GetTemCellTotalProperty(funType)
    let effects = {}
    for (let i in propertyList) {
        table_effect_add(effects, propertyList[i])
    }

    return GetForceMath(effects)
}


///////////////////////////////////战力计算公式/////////////////////////////////////
//主角技能额外伤害
//初始额外伤害+（技能等级-1）*额外伤害成长。例如一技能，当前等级2级，180+（2-1）*18
function GetRoleSkillExtraDamage(info, level) {
    return info.initNum + level * info.addNum
}

//战斗力计算公式
//effect 格式 {["maxhp"]: 0}
function GetForceMath(effect) {
    let force = 0
    for (let k in effect) {
        let v = effect[k] || 0
        let ratio = abilityPowerRatio[abilityNameToIndex[k]]
        if (ratio == null) continue
        force += v * ratio
    }
    return FormatNumberInt(force)
}


//////////////////服务器计算战斗力////////////////////
function s_GetSumPetForce() {
    let petlist = PetSystem.getInstance().getPetActiveList()
    let force = 0
    for (let i in petlist) {
        let petId = petlist[i]
        let petInfo = PetSystem.getInstance().getPetInfo(petId)
        force += petInfo.force
    }
    return force
}

function GetCellSumForce(funType) {
    let force = 0
    let funInfo = FunSystem.getInstance().getFunInfoWithType(funType)
    if (funInfo != null) {
        force = GetTemCellTotalForce(funType)
    } else {
        if (funType == 0) {

        }
    }

    return force
}