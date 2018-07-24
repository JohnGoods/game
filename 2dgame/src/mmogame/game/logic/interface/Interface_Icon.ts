//获得货币图标
function GetMoneyIcon(unitType) {

    let moneyIconConfig: any = {
        [opItemUnit.FUNDS]: "#JINBI",
        [opItemUnit.BIND_CURRENCY]: "#BIND_YUANBAO",
        [opItemUnit.CURRENCY]: "#YUANBAO",

        [opItemUnit.JJC_POINT]: "#JJC_POINT",
        [opItemUnit.LEAGUE_POINT]: "#RONG_YU",
        [opItemUnit.SKY_TOWER_POINT]: "#SHILIAN_POINT",
        [opItemUnit.ZHENXING_POINT]: "#ZSZZ_POINT",

        [opItemUnit.FACCONTRIBUTE_POINT]: "#BANG_GONG",  //帮贡
        [opItemUnit.FIREND_CURRENCY]: "#YOUQINGBI",                 //友情币
        [opItemUnit.PRESTIGE]: "#WEIWANG",

        [opItemUnit.EXP]: "#EXP",      //经验
        [opItemUnit.WORLD_POINT]: "#DIYI", //第一积分
        [opItemUnit.HUN_POINT]: "#HUNBI", //魂币
    }
    return moneyIconConfig[unitType] || ""
}

//物品小图标
function GetTagIcon(itemId) {
    let item = ItemSystem.getInstance().getItemTemplateInfo(itemId)
    if (item && item.tag) {
        return "#" + item.tag
    }
    return ""
}

//-----------------------------------------------------------------------

//宠物头像
function GetPetIconImage(entryId) {
    let imageName = "pet_20001"
    let petConfig = GameConfig.PetConfig[entryId]

    if (petConfig) {
        imageName = "pet_" + petConfig.icon
    }

    return imageName
}

//品质框
function GetPetQualityIconIamge(entryId) {
    let imageName = "ty_zhuangBeiBg01"
    let petConfig = GameConfig.PetConfig[entryId]
    let xianlvConfig = GameConfig.ActorXianLvConfig[entryId]

    if (petConfig) {
        imageName = "ty_zhuangBeiBg0" + petConfig.quality
    }

    if (xianlvConfig) {
        imageName = "ty_zhuangBeiBg0" + xianlvConfig.quality
    }
    return imageName
}

//模型
function GetPetModel(entryId, stage?) {
    let petConfig = GameConfig.PetConfig[entryId]

    if (petConfig) {
        return petConfig.model
    }
    return 0
}

//飞升模型
function GetPetFlyModel(entryId) {
    let petConfig = GameConfig.PetConfig[entryId]

    if (petConfig && petConfig.flyskill) {
        return petConfig.flymodel
    }
    return petConfig.model
}

//获取宠物五行图标
function GetElemIcon(_type) {
    let elemList = ["WUXING_JIN", "WUXING_MU", "WUXING_SHUI", "WUXING_HUO", "WUXING_TU"]
    return elemList[_type - 1] || elemList[0]
}

//获取五行颜色
function GetElemColor(_type) {
    let elemColorList = {
        [0]: "darkgoldenrod",
        [1]: "darkgreen",
        [2]: "royalblue",
        [3]: "firebrick",
        [4]: "darkviolet",
    }
    return elemColorList[_type - 1] || elemColorList[0]
}

//获取宠物SR图标
function GetPetSRIcon(srIndex) {
    let iconList = ["PET_R", "PET_SR", "PET_SSR", "PET_SSSR", "PET_SSSSR"]
    return iconList[srIndex - 1] || iconList[0]
}

//仙侣、天仙头像
function GetXianlvIconImage(entryId) {
    let imageName = "pet_20001"
    let ActorXianLvConfig = GameConfig.ActorXianLvConfig[entryId]

    if (ActorXianLvConfig) {
        imageName = "pet_" + ActorXianLvConfig.icon
    }

    return imageName
}

//模型
function GetXianlvModel(entryId) {
    let ActorXianLvConfig = GameConfig.ActorXianLvConfig[entryId]

    if (ActorXianLvConfig) {
        return ActorXianLvConfig.model
    }
    return 0
}

//上阵图标
function GetPetCombatPosIcon(pos) {
    if (pos == opPetCombatPos.Rest) {
        return ""
    } else if (pos == opPetCombatPos.Battle) { //出战
        return "ty_text03"
    } else { //备战
        return "ty_text04"
    }
}

//获取有描边的
// function GetTraceQualityColorStr(quality){
//     let colorConfig: any[] = ["gray", "green", "blue", "purple", "gold", "red"]
//     return colorConfig[quality - 1] || colorConfig[0]
// }

// //获取宠物颜色str -- 有描边的
// function GetQualityColorStr(quality) {
//     let colorConfig: any[] = ["gray", "lime", "deepskyblue", "magenta", "orange", "red"]
//     return colorConfig[quality - 1] || colorConfig[0]
// }

// //获取宠物颜色gui.color
// function GetQualityColorGui(quality) {
//     let colorConfig: any[] = [
//         gui.Color.gray,
//         gui.Color.lime,
//         gui.Color.deepskyblue,
//         gui.Color.magenta,
//         gui.Color.gold,
//         gui.Color.red
//     ]
//     return colorConfig[quality - 1] || colorConfig[0]
// }

// function GetFabaoFontColor(quality){
//     let colorConfig: any[] = ["white", "lime", "deepskyblue", "magenta", "orange", "red"]
//     return colorConfig[quality - 1] || colorConfig[0]
// }

// function GetQualityColorGui(quality){
//     let colorConfig: any[] = [
//         gui.Color.white,
//         gui.Color.lime,
//         gui.Color.deepskyblue,
//         gui.Color.magenta,
//         gui.Color.orange,
//         gui.Color.red
//     ]

//     return colorConfig[quality - 1] || colorConfig[0]
// }

//-----------------------------------------------------------------------
function GetMonsterName(entryId) {
    let name = ""
    let config = GameConfig.MonsterConfig[entryId]
    if (config) {
        name = checkNull(config.Name, "")
    }

    return name
}
//怪物头像
function GetMonsterIconImage(entryId) {
    let imageName = "pet_20001"
    let config = GameConfig.MonsterConfig[entryId]
    if (config && config.bust != 0) {
        imageName = "pet_" + config.bust
    }

    return imageName
}

//怪物模型
function GetMonsterModel(entryId) {
    let modelId = 20001

    let petConfig = GameConfig.MonsterConfig[entryId]
    if (petConfig) {
        modelId = petConfig.model
    }

    return modelId
}
//-----------------------------------------------------------------------
//获取自己头像
function GetHeroIcon() {
    let hero = GetHeroPropertyInfo()
    return GetProfessionIcon(hero.vocation, hero.sexId)
}

//职业头像
function GetProfessionIcon(entryId, sex) {
    let imageName = "zctx_90001"
    let config = GameConfig.ProfessionModelConfig[entryId]
    if (config && config[sex]) {
        imageName = "zctx_" + config[sex].icon
    }

    return imageName
}

//职业模型
function GetProfessionModel(entryId, sex, rideId?, clothId?) {
    //TLog.Debug("ProfessionSystem.getProfessionModel", entryId, sex)
    //TLog.Debug_r(GameConfig.ProfessionModelConfig)

    rideId = checkNull(rideId, -1)
    clothId = checkNull(clothId, -1)

    let modelId = 20001
    let config = GameConfig.ProfessionModelConfig[entryId]
    if (config && config[sex]) {

        if (clothId > 0) {
            modelId = config[sex].clothmodel //衣服模型
        } else if (rideId > 0) {
            modelId = config[sex].ridemodel //骑乘模型
        } else {
            modelId = config[sex].model //站立模型
        }

    }
    //TLog.Debug("return", modelId)
    return modelId
}

//-----------------------------------------------------------------------
//技能图标
function GetSkillIcon(skillId, level?) {
    let icon = "skill_20001"

    if (level == null)
        level = 1

    let config = GameConfig.SkillDescribeConfig[skillId]
    if (config && config[level]) {
        let iconName = "skill_" + config[level].Icon

        let info = IGlobal.imageSet.getImageInfo(iconName)
        if (info != null) {
            icon = iconName
        }
    }

    return icon;
}

//技能背景框(1灰2绿3蓝4紫5金6红7彩)
function GetSkillQualityIcon(skillId, level?) {
    let icon = "ty_jiNengDi01"

    if (level == null)
        level = 1

    let config = GameConfig.SkillDescribeConfig[skillId]
    if (config && config[level]) {
        let iconName = "ty_jiNengDi0" + config[level].Quality

        let info = IGlobal.imageSet.getImageInfo(iconName)
        if (info != null) {
            icon = iconName
        }
    }
    return icon
}


//-----------------------------------------------------------------------
//物品图标
function GetItemIcon(entryId) {
    let imageName = "item_30001"				//物品框图片，如果let info = IGlobal.imageSet.getImageInfo("item_" + itemRef["Icon"])itemImage为空（物品类型为素材时），则imageName直接表示图片名

    let itemRef = ItemSystem.getInstance().getItemTemplateInfo(entryId) || null
    if (!itemRef) {
        return imageName
    }

    let icon = itemRef.Icon

    let info = IGlobal.imageSet.getImageInfo("item_" + icon)
    if (info) {
        return "item_" + icon
    }
    info = IGlobal.imageSet.getImageInfo("fb_" + icon)
    if (info) {
        return "fb_" + icon
    }
    // info = IGlobal.imageSet.getImageInfo("sh_" + icon)
    // if (info) {
    //     return "sh_" + icon
    // }
    // if (!info) {
    //     //法宝
    //     info = IGlobal.imageSet.getImageInfo("fb_" + itemRef["Icon"])
    //     if (info) {
    //         return "fb_" + itemRef["Icon"]
    //     }
    //     return imageName
    // } else {
    //     imageName = "item_" + itemRef["Icon"]
    // }

    return imageName
}


////////-----------------------
//技能图标
function GetFaBaoIcon(entryId) {
    let icon = "fb_19001"

    let itemRef = ItemSystem.getInstance().getItemTemplateInfo(entryId) || null
    if (!itemRef) {
        return icon
    }

    let info = IGlobal.imageSet.getImageInfo("fb_" + itemRef["Icon"])
    if (!info) {
        return icon
    } else {
        icon = "fb_" + itemRef["Icon"]
    }

    return icon
}

///法宝的品质
function GetFaBaoQualityStr(quality) {
    if (!quality) quality = 1
    let qualityStr = "FABAO_QUALITY_TXT" + quality
    return Localize_cns(qualityStr)
}

//物品品质
function GetItemQualityStr(quality) {
    quality = quality || 1
    return Localize_cns("QUALITY_TXT" + quality)
}

//字体颜色
function GetItemFontColor(entryId, storke?) {
    let item = ItemSystem.getInstance().getItemTemplateInfo(entryId)
    let color = "gray"
    if (item != null && item.quality != null) {
        color = GetQualityColorStr(item.quality, storke)
    }
    return color
}

//字体gui颜色
function GetItemFontGUIColor(entryId, storke?) {
    let item = ItemSystem.getInstance().getItemTemplateInfo(entryId)
    let color = gui.Color.gray
    if (item != null && item.quality != null) {
        //quality = checkNull(quality, item.quality)
        color = GetQualityColorGui(item.quality, storke)
    }
    return color
}

//法宝品质框
function GetFaBaoQualutyImage(quality) {
    let imageName = "ty_faBaoDi0" + quality
    return imageName
}

//品质框图片
function GetItemQualityImage(entryId, quality?) {
    let imageName = "ty_zhuangBeiBg01"

    let itemRef = ItemSystem.getInstance().getItemTemplateInfo(entryId) || null
    if (!itemRef || !EquipQualityImage[itemRef["quality"] || quality || opEquipQuality.gray]) {
        return imageName
    }

    let flag = IsItemEquipType(entryId)
    if (flag == false) {

        imageName = EquipQualityImage[itemRef["quality"] || quality || opEquipQuality.gray]
    } else {                                        //装备默认返回金色
        let itemRef = ItemSystem.getInstance().getItemTemplateInfo(entryId) || null
        if (itemRef) {
            imageName = EquipQualityImage[quality || opEquipQuality.gold]
        }
    }

    return imageName
}

function GetShenHunEffect(quality) {
    let modelDefine = [
        effectIndex.Juji_bai, effectIndex.Juji_lv, effectIndex.Juji_lan, effectIndex.Juji_zi, effectIndex.Juji_jin
    ]
    return modelDefine[quality - 1] || modelDefine[0]
}

function getShenHunAnimName(quality) {
    let nameList = [
        "baiseGH", "lvseGH", "lanseGH", "ziseGH", "jinseGH"
    ]
    return nameList[quality - 1] || nameList[0]
}

//-----------------------------------------------------------------------
//获取对象的头像、模型（伙伴、职业、怪物）
function GetActorImageName(entryId, sex?) {
    let imageName = "pet_20001"

    if (GameConfig.PetConfig[entryId]) {
        imageName = GetPetIconImage(entryId)
    } else if (GameConfig.MonsterConfig[entryId]) {
        imageName = GetMonsterIconImage(entryId)

    } else if (GameConfig.ActorRoleConfig[entryId]) {
        imageName = GetProfessionIcon(entryId, sex)
    } else if (GameConfig.ActorXianLvConfig[entryId]) {
        imageName = GetXianlvIconImage(entryId)
    }

    return imageName
}


function GetHeroModel() {
    let hero = GetHeroPropertyInfo()
    return GetActorModel(hero.vocation, hero.sexId)
}

function GetActorModel(entryId, sex?) {
    let modelId = 20001

    if (GameConfig.PetConfig[entryId]) {
        modelId = GetPetModel(entryId)
    } else if (GameConfig.MonsterConfig[entryId]) {
        modelId = GetMonsterModel(entryId)
    } else if (GameConfig.ActorRoleConfig[entryId]) {
        modelId = GetProfessionModel(entryId, sex)
    } else if (GameConfig.ActorXianLvConfig[entryId]) {
        modelId = GetXianlvModel(entryId)
    }

    return modelId
}



//职业原画
function GetProfessionImage(vocation, sex) {
    let imagePath = {
        [10001]: {//人族
            [genderOptions.MALE]: "dl_renTu01",
            [genderOptions.FEMALE]: "dl_renTu02",
        },
        [10002]: {//仙族
            [genderOptions.MALE]: "dl_xianTu01",
            [genderOptions.FEMALE]: "dl_xianTu02",
        },
        [10003]: {//妖族
            [genderOptions.MALE]: "dl_moTu01",
            [genderOptions.FEMALE]: "dl_moTu02",
        },
    }
    if (imagePath[vocation] == null || imagePath[vocation][sex] == null)
        return "dl_renTu01"

    return imagePath[vocation][sex]
}

// function GetActorEntryId(actorInfo) {
// 	if (actorInfo.classname == "HeroInfo" || actorInfo.classname == "PlayerInfo") {
// 		return actorInfo.getProperty("vocation")
// 	} else if (actorInfo.classname == "PetInfo") {
// 		return actorInfo.getProperty("entry")
// 	} else {
// 		return actorInfo[0]
// 	}
// }


// function GetPetQualityLevelColor(qualityLevel) {
//     let color = gui.Color.white
//     let colorStr = "white"
//     qualityLevel = qualityLevel || 0

//     let colorList: any = {
//         [0]: [gui.Color.white, "white"],
//         [1]: [gui.Color.deepskyblue, "deepskyblue"],
//         [2]: [gui.Color.magenta, "magenta"],
//         [3]: [gui.Color.gold, "gold"],
//         [4]: [gui.Color.white, "white"],
//     }

//     if (colorList[qualityLevel]) {
//         color = colorList[qualityLevel][0]
//         colorStr = colorList[qualityLevel][1]
//     }

//     return [color, colorStr]
// }

/////////////////////////////////////////////////////////////////////
//通用等级模型
function GetFunShapeModel(funType, stage) {
    return GameConfig.FunShapeConfig[cellOptionsName[funType - 1]][stage].Shape
}

function GetFunSkinModel(funType, skinIndex) {
    return GameConfig.FunSkinConfig[cellOptionsName[funType - 1]][skinIndex].skin
}
//角色幻化的
function GetHeroSkinModel(funType) {
    let heroInfo = GetHeroPropertyInfo()
    let cellOptionsShapeId = {
        [cellOptionsIndex.HeroEquip]: "heroShapeId",
        [cellOptionsIndex.Hero]: "heroTitleId",
        [cellOptionsIndex.HeroRide]: "rideShapeId",
        [cellOptionsIndex.TianXianWeapon]: "weaponShapeId",
        [cellOptionsIndex.HeroWing]: "wingShapeId",
        [cellOptionsIndex.Pet]: "petShapeId",
        [cellOptionsIndex.PetTongLin]: "petTLShapeId",
        [cellOptionsIndex.PetSouHun]: "petSHShapeId",
        [cellOptionsIndex.TianXian]: "tianxianShapeId",
        [cellOptionsIndex.XianLv]: "xianlvShapeId",
        [cellOptionsIndex.XianLvFaZhen]: "xlFZShapeId",
        [cellOptionsIndex.XianLvXianWei]: "xlXWShapeId",
    }

    let modelId = heroInfo[cellOptionsShapeId[funType]]
    return modelId
}

/////////////////////////////////////////////////////////////////////
//根据shapeID，获取模型
function GetShapeModelId(shapeId) {
    let config = GameConfig.ModelShapeConfig[shapeId]
    if (config == null)
        return 0

    return config.model
}

function GetShapeEffectId(shapeId) {
    if (shapeId == null)
        return 0

    let config = GameConfig.ModelShapeConfig[shapeId]
    if (config == null)
        return 0
    return config.effectId
}

function GetShapeRideOffY(shapeId) {
    if (shapeId == null)
        return 0

    let config = GameConfig.ModelShapeConfig[shapeId]
    if (config == null)
        return 0
    return config.offy
}


function GetShapeImage(shapeId) {
    if (shapeId == null)
        return 0
    let config = GameConfig.ModelShapeConfig[shapeId]
    if (config == null)
        return ""
    return config.image
}

function GetShapeClothId(shapeId, sex) {
    let config = GameConfig.ModelShapeConfig[shapeId]
    if (config == null)
        return 0

    if (sex == genderOptions.MALE) {
        return config.effectId
    } else {
        return config.effectId2
    }
}

function GetShapePetModel(entryId, flystageexp) {
    let funType = cellOptionsIndex.PetFly
    let stage = PetSystem.getInstance().getPetFlyStageWithExp(funType, entryId, flystageexp)
    if (stage >= 1) {
        return GetPetFlyModel(entryId)
    } else {
        return GetPetModel(entryId)
    }
}

function GetShapeWeaponId(vocation, sex, rideShapeId = 0, weaponShapeId = 0) {
    let effectId = 0
    //坐骑状态如果没有武器，默认使用一个
    if (weaponShapeId == 0 && rideShapeId != 0) {
        let config = GameConfig.ProfessionModelConfig[vocation]
        if (config && config[sex]) {
            effectId = config[sex].weaponEffectId
        }
    } else {
        let config = GameConfig.ModelShapeConfig[weaponShapeId]
        if (config == null)
            return 0

        if (sex == genderOptions.MALE) {
            effectId = config.effectId
        } else {
            effectId = config.effectId2
        }
    }
    return effectId

}



function GetVipIcon(vip) {
    if (vip == null || vip < 0 || vip > 10)
        return "vipLv00"
    return String.format("vipLv%02d", vip)
}

/////////////////////////////////////////////////////
//关卡模型
function GetCampaignBossModel(campaignId) {
    if (GameConfig.CampaignConfig[campaignId]) {
        return GameConfig.CampaignConfig[campaignId].bossImage
    }
    TLog.Error("GetCampaignBossModel campainID:%d error", campaignId)
    return 20001
}


//通用品质颜色(字符串)
function GetQualityColorStr(quality, stroke: boolean = true) {
    let colorConfig: any = null
    if (stroke) {
        colorConfig = {
            [0]: "aliceblue",
            [1]: "greenyellow",
            [2]: "deepskyblue",
            [3]: "fuchsia",
            [4]: "orange",
            [5]: "red",
        }
    } else {
        colorConfig = {
            [0]: "ublack",
            [1]: "darkgreen",
            [2]: "royalblue",
            [3]: "darkviolet",
            [4]: "darkgoldenrod",
            [5]: "firebrick",
        }
    }
    return colorConfig[quality - 1] || colorConfig[0]
}
//通用品质颜色
function GetQualityColorGui(quality, stroke: boolean = true) {
    let colorConfig: any = null
    if (stroke) {
        colorConfig = {
            [0]: gui.Color.aliceblue,
            [1]: gui.Color.greenyellow,
            [2]: gui.Color.deepskyblue,
            [3]: gui.Color.fuchsia,
            [4]: gui.Color.orange,
            [5]: gui.Color.red,
        }
    } else {
        colorConfig = {
            [0]: gui.Color.ublack,
            [1]: gui.Color.darkgreen,
            [2]: gui.Color.royalblue,
            [3]: gui.Color.darkviolet,
            [4]: gui.Color.darkgoldenrod,
            [5]: gui.Color.firebrick,
        }
    }
    return colorConfig[quality - 1] || colorConfig[0]
}

function GetNumberToStr(num): string {
    let numStr: string = tostring(num)
    let length = numStr.length + 0
    let recvStr = ""
    for (let k = 0; k < numStr.length; k++) {
        let v = numStr.charAt(k)
        if (tonumber(v) == 0) continue
        if (length == 2 && tonumber(v) == 1) {

        } else {
            recvStr += Localize_cns("NUMBER_" + v)
        }

        if (length > 1) {
            recvStr += Localize_cns("NUMBER_LEN_" + (length - 1))
        }
        length -= 1
    }
    return recvStr
}

//获得货币的entryid
function GetMoneyEntry(unit) {
    //金币转换EntryId
    let MoneyEntryId: any = {
        [opItemUnit.FUNDS]: SpecailItemId.FUNDS,  //金币
        [opItemUnit.BIND_CURRENCY]: SpecailItemId.B_GOLD,  //绑定元宝
        [opItemUnit.CURRENCY]: SpecailItemId.GOLD,  //元宝
        [opItemUnit.POWER]: SpecailItemId.POWER,  //体力
        [opItemUnit.JJC_POINT]: SpecailItemId.JJC_POINT,  //竞技积分
        [opItemUnit.FACCONTRIBUTE_POINT]: SpecailItemId.BANGGONG,  //帮派贡献
        [opItemUnit.FIREND_CURRENCY]: SpecailItemId.YOUQING,	//友情币
        [opItemUnit.PRESTIGE]: SpecailItemId.WEIWANG,	//威望
        [opItemUnit.EXP]: SpecailItemId.EXP, //经验
        [opItemUnit.WORLD_POINT]: SpecailItemId.WORLD_POINT, //天下第一积分
    }

    return MoneyEntryId[unit] || 30001
}