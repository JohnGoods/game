/*
作者:
    yangguiming
	
创建时间：
   2013.6.20(周四)

意图：
   主角玩法
   套装、角色属性等

公共接口：
				sendAutoLevelMessage(){                //发送自动升级协议
   
*/



function getSaveRecord(key) {
    let heroInfo = GetHeroPropertyInfo()
    if (heroInfo == null || heroInfo["saveRecord"] == null) {
        return null
    }

    let record = heroInfo["saveRecord"][key]
    if (!record) { return null }

    if (record[1] != 0 && GetServerTime() > record[1]) { //时效性
        return null
    }
    return record[0]
}

function getSaveRecordTime(key) {
    let heroInfo = GetHeroPropertyInfo()
    if (heroInfo == null) {
        return null
    }

    let record = heroInfo["saveRecord"][key]
    if (!record) { return null }
    return record[1]
}

class RoleSystem extends BaseSystem {

    surpriseEvent: any;
    inviteList: any
    //saveServerTime: number;
    myCreatTime: number;
    serverLevel: number;
    recvRoleList;
    roleInfo;
    offlineInfo
    equipItemList;
    roleProperty
    faBaoInfo
    fabaoItemList
    taozhuangInfo
    oldLevelList

    heroItemUidList

    roleEquipSkillHanler

    tastTime

    //xinglingExperienceInfo:ImmortalsExperienceInfo
    honorId: number;


    shenHunInfo

    public initObj(...args: any[]): void {

        this.onClear()


        //       RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onHeroInfoUpdate, this)
        //RegisterEvent(EventDefine.SKILL_LIVE_LIST_UPDATE, this.onUpdatePowerMax, this )
        RegisterEvent(EventDefine.HERO_ENTER_GAME, this.onRevHeroEnterGame, this)
        // RegisterEvent(EventDefine.HERO_MOVE, this.onHeroMove, this)

        // RegisterEvent(EventDefine.LOGIN_GUEST_BIND_STATE_UPDATE, this.requestBindPrize, this)
        // RegisterEvent(EventDefine.GAME_RESUME, this.onGameResume, this)
        //RegisterEvent(EventDefine.LOGIN_LOGO_HIDE_FINISH, this.onRevHeroEnterGameFinish, this)

    }

    destory() {
        this.onClear()
    }



    onClear() {
        //TLog.Debug("RoleSystem.onClear")
        this.serverLevel = 0
        this.myCreatTime = 0
        //this.saveServerTime = 0

        this.inviteList = {}
        //this.xinglingExperienceInfo = null

        this.honorId = 0
        this.roleInfo = {}
        this.recvRoleList = {}
        this.offlineInfo = {}
        this.equipItemList = {}
        this.roleProperty = {}
        this.faBaoInfo = {}
        this.fabaoItemList = {}
        this.taozhuangInfo = {}
        this.oldLevelList = []

        this.heroItemUidList = []

        this.tastTime = 0
        this.shenHunInfo = {}
    }

    prepareResource(workQueue) {
        GameConfig.initRoleSystemCsv(workQueue);
        GameConfig.initGrowSystemCsv(workQueue)
        GameConfig.initXingLingSystemCsv(workQueue)

        this.roleEquipSkillHanler = {
            ["XianLvActive"]: function (xianlvId) {
                return XianLvSystem.getInstance().isExit(xianlvId)
            },
        }
    }

    // GetOverCash() {
    //     //角色等级*角色等级*2000+100000
    //     let level = GetHeroProperty("level")
    //     return level * level * 2000 + 100000
    // }

    //离线天数
    // GetOfflineDays() {
    //     let dayTable = getSaveRecord(opSaveRecordKey.logoutExp) || null
    //     if (dayTable && dayTable[6]) {
    //         return dayTable[6]
    //     }
    //     return 0
    // }

    //离线奖励，（经验，储备金）
    // GetOfflinePrize() {
    //     let dayTable = getSaveRecord(opSaveRecordKey.logoutExp) || null
    //     if (dayTable && dayTable[1] && dayTable[2]) {
    //         return [dayTable[1], dayTable[2]]
    //     }
    //     return [0, 0]
    // }

    //离线奖励， 是否已领取
    // IsGetOfflinePrize(type) {
    //     let dayTable = getSaveRecord(opSaveRecordKey.logoutExp) || null
    //     if (dayTable && dayTable[7] && dayTable[7] == type) {
    //         return true
    //     }
    //     return false
    // }



    ////////////////////////////////////////////////////////////////////////////////////////////////-

    onHeroInfoUpdate(args: ActorUpdateEvent) {
        let oldVal = args.oldProperty
        let newVal = args.newProperty

        //主角升级
        if (newVal.level > oldVal.level) {
            TLog.Debug("//////////-HERO_LEVELUP//////////////-")
            for (let i = oldVal.level + 1; i <= newVal.level; i++) {
                FireEvent(EventDefine.HERO_PER_LEVELUP, HeroPerLevelUpEvent.newObj(i))
            }

            FireEvent(EventDefine.HERO_LEVELUP, null)
            //WngMrg.getInstance().showWindow("LevelUpFrame")

            let hero = GetHero()
            //let serverInfo = LoginSystem.getInstance().getRecentLoginServerInfo()
            let recentGameId = LoginSystem.getInstance().getSelectServerGameID()
            let recentGroupIndex = LoginSystem.getInstance().getSelectServerGroupIndex()
            let serverName = LoginSystem.getInstance().getServerNameByGameGroup(recentGameId, recentGroupIndex)

            let infoParam = "roleId=" + hero.getId() + "&roleName=" + GetHeroProperty("name") + "&roleLevel=" + newVal.level + "&serverId=" + recentGameId + "&serverGroup=" + (recentGroupIndex + 1) + "&serverName=" + serverName
            SdkHelper.getInstance().callSdk(SdkFunctionDefine.OnLevelUp, infoParam)
        }


    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-
    getLevelupExp(): number {
        let level = GetHeroProperty("level") || 0
        let config = GameConfig.FunUpgradeStageConfig[cellOptionsName[cellOptionsIndex.Hero - 1]]
        if (!config || !config[level]) return 0
        return config[level].maxexp || 0

    }

    setServerLevel(level) {
        this.serverLevel = level
        //FireEvent(EventDefine.SERVER_LEVEL_UPDATE, null)
    }

    getServerLevel(level) {
        return this.serverLevel

    }

    getSystemSetting(index) {
        return IGlobal.setting.getRoleSetting(UserSetting.TYPE_NUMBER, index, 1)
    }

    setSystemSetting(index, num) {
        IGlobal.setting.setRoleSetting(UserSetting.TYPE_NUMBER, index, num)
    }


    setRoleCreateTime(creatTime) {
        this.myCreatTime = creatTime
    }
    getRoleCreateTime(creatTime) {
        return this.myCreatTime
    }


    // setServerTime(time) {
    //     this.saveServerTime = time
    // }

    // getServerTime() {
    //     return this.saveServerTime
    // }


    // onHeroAwake(msg) {
    //     TLog.Debug("PetSystem.onHeroAwake")
    //     if (msg.code == 0) {
    //         let info = GetHeroPropertyInfo()
    //         info.awakeLevel = msg.tolevel
    //     }
    // }

    // onHeroBreak(msg) {
    //     TLog.Debug("PetSystem.onHeroBreak")
    //     if (msg.code == 0) {
    //         let info = GetHeroPropertyInfo()
    //         info.breakLevel = msg.tolevel
    //     }
    // }


    // setSurpriseFinishList(list) {
    //     this.surpriseEvent = list
    // }

    // getSurpriseFinishList() {
    //     return this.surpriseEvent || {}
    // }

    // updateInviteList(lType, info) {
    //     this.inviteList[lType] = info
    // }

    // getInviteList(lType) {
    //     return this.inviteList[lType] || {}
    // }




    onRevHeroEnterGame(args) {

        // this.onUpdatePowerMax()

        // LoginSystem.getInstance().requestAccountBindState(function(this) 
        //     this.requestBindPrize()
        // }, this)

        // this.requestScorePrize()

        //信息推送
        // this.loadLocalNoticeConfig()
        // this.initNotificationTime()

        //检查等级开启功能
        GuideSystem.getInstance().updateHeroFunc(true)
    }

    // initFuncState() {
    //     let flag = false
    //     let errantry = GuideSystem.getInstance().getFuncState()

    //     for (let funcIndex in LevelFuncOpenLimit) {
    //         let level = LevelFuncOpenLimit[funcIndex]

    //         let func_bit = 0
    //         if (level <= GetHeroProperty("level")) {
    //             if (func_bit != 0) {
    //                 if (StringUtil.getBit(errantry, func_bit) != "1") {
    //                     errantry = StringUtil.changeBit(errantry, func_bit, "1")
    //                     flag = true
    //                 }
    //             }
    //         }
    //     }

    //     if (flag == true) {
    //         let message = GetMessage(opCodes.C2G_ROLE_NEWBIE_SETTING_RECORD)
    //         message.errantry = errantry
    //         SendGameMessage(message)
    //     }
    // }

    // setHeroHonorId(honorId) {
    //     let info = GetHeroPropertyInfo()
    //     info.honorTitle = honorId
    //     this.honorId = honorId
    // }

    // getHeroHonorId() {
    //     if (!this.honorId || this.honorId <= 0) {
    //         this.honorId = GetHeroProperty("honorTitle") || 0
    //     }
    //     return this.honorId
    // }

    // setXinglingExperienceInfo( info ){
    //     this.xinglingExperienceInfo = info
    // }

    // getXinglingExperienceInfo(){
    //     return this.xinglingExperienceInfo
    // }


    ///////////////////////角色信息//////////////////////
    updateRoleInfoField(updateProperty) {
        let Info = this.roleInfo

        if (Info == null) {
            //TLog.Warn("FunSystem._updateFunInfoField %d is null", funOptionsName[funType])
            return
        }

        for (let k in updateProperty) {
            let v = updateProperty[k]
            if (k == "skilllevellist") {
                this.oldLevelList = Info[k]
            }
            Info[k] = v
        }
        this.roleInfo = Info
        if (updateProperty["equiplist"] != null) {
            this.updateItemList()
        }
        FireEvent(EventDefine.ACTOR_ROLE_UPDATE, null)
    }

    initRoleInfo(info) {
        this.roleInfo = info
        this.updateItemList()
    }
    getRoleInfo(index: string) {
        if (this.roleInfo[index] != null) {
            return this.roleInfo[index]
        } else {
            return null;
        }
    }
    getRecvList() {
        return this.roleInfo
    }

    getOldLevelList() {
        return this.oldLevelList
    }

    setOldLevelList() {
        let levelList = this.getRoleInfo("skilllevellist")
        this.oldLevelList = levelList
    }

    getProfessionRefProperty(entryId, pro) {
        let config = GameConfig.ActorRoleConfig[entryId]
        if (config) {
            return config[pro]
        }
        return null
    }

    ////格式化经验值
    getExpStr(exp) {
        let str = ""
        if (exp >= 10000 && exp < 100000000) {
            let temp = AdjustNumberFont(exp / 10000, 2)
            str += temp + Localize_cns("ROLE_TXT38")
        } else if (exp >= 100000000) {
            let temp = AdjustNumberFont(exp / 100000000, 2)
            str += temp + Localize_cns("ROLE_TXT33")
        } else {
            str = tostring(exp)
        }
        return str
    }

    /////////////玩家离线
    initOfflineInfo(info) {
        this.offlineInfo = info
        if (size_t(this.offlineInfo) != 0) {
            let wnd = WngMrg.getInstance().getWindow("PlayerOffLineFrame")
            wnd.showWnd()
        }

        // FireEvent(EventDefine. PALYER_OFFINE_REFRESH, null)
    }
    getOfflineInfo() {
        return this.offlineInfo || {}
    }

    ////获取装备底图
    getZhuangBeiIcon(pos) {
        let icon = "ty_weiZhuangBei"
        let posList = [
            "01",
            "03",
            "05",
            "07",
            "10",
            "02",
            "04",
            "06",
            "08",
            "09",
        ]

        return icon + posList[pos] || posList[0]
    }

    ///更新equipitemlist
    updateItemList() {
        let list = this.getRoleInfo("equiplist")
        if (size_t(list) == 0) {
            return
        }
        this.heroItemUidList = []
        for (let k in list) {
            let uid = list[k][1] || -1
            let entryId = list[k][2]
            let quality = list[k][objectField.ITEM_FIELD_QUALITY]
            let itemInfo: any = {}
            itemInfo.entry = entryId
            itemInfo.quality = quality
            itemInfo.id = uid
            let item = Item.newObj(itemInfo)
            let subtype = item.getRefProperty("subtype")
            if (list[k] && list[k][22]) {
                item.propertyInfo.best_attribute = list[k][22]
                item.propertyInfo.index = k
            }
            ItemSystem.getInstance().calcEquipForce(item)
            this.equipItemList[subtype] = item
            if (quality >= opEquipQuality.gold) {
                table_insert(this.heroItemUidList, uid)
            }
        }

        FireEvent(EventDefine.ACTOR_ROLE_EQUIP_UPDATE, null)
    }

    isBagGoldEquip(gid) {
        return table_isExist(this.heroItemUidList, gid)
    }

    getRoleEquipItemList() {
        return this.equipItemList
    }

    //是否是一件正在穿戴的装备
    isRoleEquipWearing(item) {
        let subType = item.getRefProperty("subtype")
        let equip = this.getRoleEquipItem(subType)
        if (equip && (equip.id == item.id)) {
            return true
        }
        return false
    }

    getRoleEquipItem(subtype) {
        if (size_t(this.equipItemList) == 0) {
            return null
        }
        return this.equipItemList[subtype];
        //for(let k in this.equipItemList){
        //    let item = <Item>this.equipItemList[k]
        //    if(item.getRefProperty("subtype") == subtype){
        //        return item
        //    }
        //}
        //return null

    }

    getRoleEquipNextItem(curItem) {
        // let entryId = curItem[1]
        // let quality = curItem[objectField.ITEM_FIELD_QUALITY]
        let itemInfo: any = {}
        itemInfo.entry = curItem.propertyInfo.entry + 10
        itemInfo.quality = curItem.propertyInfo.quality
        let item = Item.newObj(itemInfo)
        return item
        // let subtype = item.getRefProperty("subtype")
    }


    ///角色装备
    getRoleEquipList() {
        let level = this.getRoleInfo("stage")
        let equipitemlist = []
        for (let i = 201; i <= 210; i++) {
            let item = this.getRoleEquipItemBySubtype(i)
            if (item != null) {
                table_insert(equipitemlist, item)
            }
        }
        return equipitemlist
    }

    //根据子类型/等级判断是否可以更换装备
    getRoleEquipItemBySubtype(subtype) {
        let level = this.getRoleInfo("stage")
        let equipList = ItemSystem.getInstance().getItemLogicInfoByType(opItemType.ROLE_EQUIP, subtype)
        if (size_t(equipList) == null) return null
        let itemList = this.getEquiplistByLevel(equipList, level)
        let item = this.getMaxForceItem(itemList)
        if (item != null) {
            let equipitem = this.getRoleEquipItem(subtype)
            if (equipitem != null) {
			    /*let ePro = GetRoleEquipBaseProperty(equipitem.entryId, equipitem.getProperty("quality") || opEquipQuality.gray )
			    let eForce = GetForceMath(ePro)
			    let itemPro = GetRoleEquipBaseProperty(item.entryId, item.getProperty("quality") || opEquipQuality.gray )
			    let itemForce = GetForceMath(itemPro)*/
                let level = item.refPropertyInfo.uselevel
                let curLevel = GetHeroProperty("level") || 0
                if (item.force > equipitem.force && curLevel >= level) {
                    return item
                }
            } else {
                return item
            }
        }
        return null
    }

    //根据子类型/等级判断是否可以更换神装
    getRoleGodEquipItemBySubtype(subtype) {
        let level = this.getRoleInfo("stage")
        let equipList = ItemSystem.getInstance().getItemLogicInfoByType(opItemType.ROLE_EQUIP, subtype)
        let godEquipList = []
        for (let _ in equipList) {
            let equip = equipList[_]
            if (equip.propertyInfo.quality >= 6) {
                table_insert(godEquipList, equip)
            }
        }

        if (size_t(godEquipList) == null) return null
        let itemList = this.getEquiplistByLevel(godEquipList, level)
        let item = this.getMaxForceItem(itemList)
        if (item != null) {
            let equipitem = this.getRoleEquipItem(subtype)
            if (equipitem != null) {
                let level = item.refPropertyInfo.uselevel
                let curLevel = GetHeroProperty("level") || 0
                // if(item.force > equipitem.force && curLevel >= level){
                if (curLevel >= level) {
                    return item
                }
            } else {
                return item
            }
        }
        return null
    }

    //获取最高的战力的item -- 并且可以穿的
    getMaxForceItem(itemlist) {
        if (size_t(itemlist) == null) {
            return null
        }
        let force = 0
        let recvitem
        let curLevel = GetHeroProperty("level") || 0
        for (let i = 0; i < size_t(itemlist); i++) {
            let item = itemlist[i]
            let level = item.refPropertyInfo.uselevel
            if (force < item.force && curLevel >= level) {
                force = item.force
                recvitem = item
            }
        }
        return recvitem
    }

    getEquiplistByLevel(itemlist, level) {
        let recvlist = []
        for (let k in itemlist) {
            let item = <Item>itemlist[k]
            if (item.getRefProperty("uselevel") <= level) {
                table_insert(recvlist, item)
            }
        }
        return recvlist
    }

    ////////---------------角色属性
    initRoleProperty(message) {
        let tempConfig: any = {}
        for (let k = 0; k < size_t(message); k++) {
            let begin = objectField.UNIT_FIELD_VALUE_BEGIN
            let key = begin + k
            let strKey = IndexToabilityName[key]
            let v: any
            if (key < objectField.UNIT_FIELD_DEF_THR_DEC) {
                v = FormatNumberInt(message[k])
            } else {
                v = message[k]
            }
            tempConfig[strKey] = v
        }

        this.roleProperty = tempConfig
        FireEvent(EventDefine.ACTOR_ROLE_UPDATE, null)
    }

    getRoleProperty() {
        return this.roleProperty
    }


    ////////---------------角色法宝
    initFaBaoInfo(message) {
        this.faBaoInfo = message
        this.updateFaBaoList()
    }

    updateFaBaoInfo(updateProperty) {
        let Info = this.faBaoInfo

        if (Info == null) {
            //TLog.Warn("FunSystem._updateFunInfoField %d is null", funOptionsName[funType])
            return
        }

        for (let k in updateProperty) {
            let v = updateProperty[k]
            Info[k] = v
        }
        this.faBaoInfo = Info
        if (updateProperty["talismanlist"] != null) {
            this.updateFaBaoList()
        }
        FireEvent(EventDefine.ACTOR_ROLE_FABAO_UPDATE, null)
    }

    getFaBaoInfo() {
        return this.faBaoInfo
    }

    getFaBaoInfoByKey(key) {
        if (this.faBaoInfo[key] == null) {
            return null
        }
        return this.faBaoInfo[key]
    }

    ///更新法宝装备
    updateFaBaoList() {
        let faBaoInfo = this.getFaBaoInfo()
        if (faBaoInfo == null) return
        let list = faBaoInfo["talismanlist"]

        for (let k in list) {
            let gId = list[k][1]
            let entryId = list[k][2]
            let quality = list[k][objectField.ITEM_FIELD_QUALITY]
            let itemInfo: any = {}
            itemInfo.entry = entryId
            itemInfo.quality = quality
            itemInfo.id = gId
            let item = Item.newObj(itemInfo)
            this.fabaoItemList[k] = item
        }

    }

    getFaBaoItemList() {
        return this.fabaoItemList || {}
    }

    getFaBaoItem(pos) {
        let dateKey = pos + opTalismanEquipPos.begin - 1
        if (this.fabaoItemList[dateKey] == null) return null
        return this.fabaoItemList[dateKey]
    }

    //判断是否穿戴同一类型的//
    checkFaBaoItem(itemId, pos) {
        let dataKey = pos + opTalismanEquipPos.begin - 1
        let list = this.fabaoItemList
        for (let k in list) {
            let item: Item = list[k]
            if (item.entryId == itemId && dataKey != tonumber(k)) {
                return false
            }
        }
        return true
    }

    //
    initTaoZhuangInfo(message) {
        this.taozhuangInfo = message
        FireEvent(EventDefine.ACTOR_ROLE_TAOZHUANG_UPDATE, null)
    }

    getTaoZhuangInfo() {
        return this.taozhuangInfo || {}
    }

    getTaoZhuangInfoByKey(key: string) {
        if (this.taozhuangInfo == null) return null
        if (this.taozhuangInfo[key] == null)
            return null
        return this.taozhuangInfo[key]
    }

    // checkSkinActive(entry){
    //     let active = false
    //     let unLockList = this.getTaoZhuangInfoByKey("unlockList")
    //     if (unLockList == null) return false
    //     for(let cellIndex in unLockList){
    //         let v = unLockList[cellIndex]
    //         for(let ski)
    //     }
    // }

    checkSkinExist(cellIndex, skinIndex) {
        let unLockList = this.getTaoZhuangInfoByKey("unlockList")
        if (unLockList == null) return false
        let info = unLockList[cellIndex]
        if (info == null) {
            return false
        }
        return table_isExist(info, skinIndex)
    }

    getTaoZhuangControlList() {
        let arr = GameConfig.FashionSuitConfig
        let tempConfig = []
        for (let k in arr) {
            let v = arr[k]
            table_insert(tempConfig, v)
        }
        return tempConfig || []
    }

    ///////////////////////////////////////////////////////////
    getRoleEquipSkill(entryId, quality) {
        if (GameConfig.RoleEquipSkillConfig[entryId]) {
            return GameConfig.RoleEquipSkillConfig[entryId][quality]
        }
    }

    checkRoleEquipSkillActive(key, param?) {
        if (this.roleEquipSkillHanler[key]) {
            return this.roleEquipSkillHanler[key].call(this, param)
        }
        return false
    }

    clearTastTime() {
        this.tastTime = 0
    }

    setTastTime(recordTime) {
        if (this.tastTime <= 0) {
            this.tastTime = recordTime
        }
    }

    getTastTime() {
        return this.tastTime
    }


    ////神魂
    initShenHunInfo(info) {
        let itemList = info.shenhunlist || []
        this.updateShenHunItemList(itemList)
        this.shenHunInfo.force = info.force
    }

    updateShenHunItemList(itemList) {
        this.shenHunInfo.shenhunlist = {}
        for (let k in itemList) {
            let v = itemList[k]
            let gId = v[1]
            let entryId = v[2]
            let quality = v[objectField.ITEM_FIELD_QUALITY]
            let talisman_lock = v[23]
            let equip_exp = v[26]
            let enhanceLevel = v[27]
            let itemInfo: any = {}
            itemInfo.entry = entryId
            itemInfo.quality = quality
            itemInfo.id = gId
            itemInfo.talisman_lock = talisman_lock
            itemInfo.enhanceLevel = enhanceLevel
            itemInfo.equip_exp = equip_exp
            let item = Item.newObj(itemInfo)
            this.shenHunInfo.shenhunlist[k] = item
        }
    }

    updateShenHunInfo(info) {
        if (info.shenhunlist != null) {
            this.updateShenHunItemList(info.shenhunlist)
        }

        if (info.force != null) {
            this.shenHunInfo.force = info.force
        }
    }

    getShenHunInfo(key) {
        return this.shenHunInfo[key]
    }

    getShenHunItem(index) {
        if (this.shenHunInfo.shenhunlist == null) return null
        let pos = index + opTalismanEquipPos.begin - 1
        return this.shenHunInfo.shenhunlist[pos]
    }

    checkShenHunWear(item : Item, index){
        let pos = index + opTalismanEquipPos.begin - 1
        //不能穿戴两件同一种族， 不能穿同一件
        let vocation = item.getRefProperty("vocation")
        let list = this.shenHunInfo.shenhunlist || []
        for(let k in list){
            let wear  : Item = list[k]
            let wear_vocation = wear.getRefProperty("vocation")
            if(((wear_vocation != 0 && wear_vocation == vocation) || item.entryId == wear.entryId) && pos != tonumber(k)){
                return false
            }
        }
        return true
    }
}   