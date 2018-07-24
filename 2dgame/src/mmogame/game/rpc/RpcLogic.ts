// TypeScript file

module RpcLogic {

    // export function CHeroLevelUp(){

    // }

    // export function G2C_EquipRefine(name:string, id:number){
    //     TLog.Debug("===========CEquipRefine", name, id)
    // }


    //角色列表
    export function G2C_ActorRoleInfoList(roleinfolist) {
        TLog.Debug("===========G2C_ActorRoleInfoList")
        RoleSystem.getInstance().initRoleInfo(roleinfolist[0])
        FireEvent(EventDefine.EQUIP_XILIAN, null)
    }
    //宠物列表
    export function G2C_ActorPetInfoList(petinfolist) {
        TLog.Debug("===========G2C_ActorPetInfoList")
        PetSystem.getInstance().updatePetInfoList(petinfolist)
        FireEvent(EventDefine.PET_LIST_UPDATE, null)
    }
    //仙侣列表
    export function G2C_ActorXianlvInfoList(infolist) {
        TLog.Debug("===========G2C_ActorXianlvInfoList")
        XianLvSystem.getInstance().initXianLvList(infolist)
        FireEvent(EventDefine.ACTOR_XIANLV_LIST_UPDATE, null)
    }

    //通用玩法列表   
    export function G2C_ActorTempCellInfoList(funinfolist) {
        TLog.Debug("===========G2C_ActorTempCellInfoList")
        FunSystem.getInstance()._initFunInfoFieldList(funinfolist)
    }

    //解锁新的宠物 
    export function G2C_ActorPetInfo(info) {
        TLog.Debug("===========G2C_ActorPetInfo")
        PetSystem.getInstance().addPetInfo(info)
        FireEvent(EventDefine.PET_LIST_UPDATE, null)
    }
    //解锁新的仙侣
    export function G2C_ActorXianlvInfo(info) {
        TLog.Debug("===========G2C_ActorXianlvInfo")
        XianLvSystem.getInstance().addXianLvInfo(info)

    }
    //解锁新的玩法
    export function G2C_ActorTempCellInfo(info) {
        TLog.Debug("===========G2C_ActorTempCellInfo")
        FunSystem.getInstance()._initFunInfoField(info)
    }


    //角色信息更新
    export function G2C_ActorRoleInfoUpdate(entryid, xianlvupdate) {
        TLog.Debug("===========G2C_ActorRoleInfoUpdate")
        //   for (let i = 0; i < xianlvupdate.length; i++) {
        //      let type = xianlvupdate[i]

        //   }
        RoleSystem.getInstance().updateRoleInfoField(xianlvupdate)
    }

    export function G2C_ActorPetInfoUpdate(entryid, xianlvupdate) {
        TLog.Debug("===========G2C_ActorPetInfoUpdate")
        PetSystem.getInstance().updatePetInfoField(entryid, xianlvupdate)
    }

    export function G2C_ActorXianlvInfoUpdate(entryid, xianlvupdate) {
        TLog.Debug("===========G2C_ActorXianlvInfoUpdate")

        XianLvSystem.getInstance()._updateXianLvInfoField(entryid, xianlvupdate)
    }

    export function G2C_ActorTempCellInfoUpdate(entryid, tempupdate) {
        TLog.Debug("===========G2C_ActorTempCellInfoUpdate")
        FunSystem.getInstance()._updateFunInfoField(entryid, tempupdate)
    }

    //锻造功能
    export function G2C_EQUIP_FORGE_INFO(info) {
        TLog.Debug("===========G2C_EQUIP_FORGE_INFO")
        ForgeSystem.getInstance().initForgeInfo(info)

    }

    export function G2C_EQUIP_FORGE_UPDATE(id, info) {
        TLog.Debug("===========G2C_EQUIP_FORGE_UPDATE")
        ForgeSystem.getInstance().updateForgeInfo(info)
    }

    //玩家离线
    export function G2C_OfflineGains(info) {
        TLog.Debug("===========G2C_OfflineGains")

        RoleSystem.getInstance().initOfflineInfo(info)
    }

    //天仙
    export function G2C_ActorSimpleCellInfoList(info) {
        TLog.Debug("===========G2C_ActorSimpleCellInfoList")
        TianXianSystem.getInstance().initTianXianList(info)
    }

    //天仙信息更新
    export function G2C_ActorSimpleCellInfoUpdate(entryid, info) {
        TLog.Debug("===========G2C_ActorSimpleCellInfoUpdate")
        TianXianSystem.getInstance().updateTianXianInfoField(entryid, info)
    }
    // export function G2C_CampaginRecord(campaginlist){
    //     TLog.Debug("===========G2C_CampaginRecord")
    //     //TianXianSystem.getInstance().updateTianXianInfoField(entryid, info)
    // }

    // export function G2C_CurCampaginInfo(maxcampaginId, autonum){
    //     TLog.Debug("===========G2C_CurCampaginInfo")
    //     //TianXianSystem.getInstance().updateTianXianInfoField(entryid, info)
    // }

    //商店列表
    export function G2C_ShopItemList(info) {
        TLog.Debug("===========G2C_ShopItemList")
        ShopSystem.getInstance().initShopList(info)
    }

    //商店解锁列表
    export function G2C_ConditionInfo(info) {
        TLog.Debug("===========G2C_ConditionInfo")
        ShopSystem.getInstance().initShopConditionList(info)
    }

    //角色属性
    export function G2C_PlayerAllAbilityInfo(info) {
        TLog.Debug("=========== G2C_PlayerAllAbilityInfo")
        RoleSystem.getInstance().initRoleProperty(info)
    }

    //角色法宝
    export function G2C_TALISMAN_INFO(info) {
        TLog.Debug("=========== G2C_TALISMAN_INFO")
        RoleSystem.getInstance().initFaBaoInfo(info)
    }

    export function G2C_TALISMAN_UPDATE(id, info) {
        TLog.Debug("=========== G2C_TALISMAN_UPDATE")
        RoleSystem.getInstance().updateFaBaoInfo(info)
    }

    //超链接宠物
    export function G2C_ChannelPet(rage, roleId, petInfo) {
        PetSystem.getInstance().showPetTipsByInfo(petInfo)
    }

    //超链接物品
    export function G2C_ChannelItem(rage, roleId, itemInfo) {
        let item = Item.newObj(itemInfo)
        ItemSystem.getInstance().showItemTips(item, false)
    }

    //超链接法宝
    export function G2C_ChannelTalisman(rage, plrName, itemInfo) {
        let itemPro: any = {}
        itemPro.entry = itemInfo[1]
        itemPro.quality = itemInfo[0]

        let item = Item.newObj(itemPro)
        let wnd: FaBaoItemTipsFrame = WngMrg.getInstance().getWindow("FaBaoItemTipsFrame")
        wnd.onLinkShow(item, plrName, itemInfo[2])
    }

    //角色套装
    export function G2C_FashionSuit_AllForceAndInfo(forceList, info) {
        TLog.Debug("=========== G2C_FashionSuit_AllForceAndInfo")
        RoleSystem.getInstance().initTaoZhuangInfo({ unlockList: info, forceList: forceList })
    }

    //宠物自动升级失败
    export function G2C_ACTOR_PET_UPGRADE_ERROR(petId, code) {
        PetSystem.getInstance().stopAutoUpgrade(petId)
    }

    //通用自动升级失败
    export function G2C_TEMPCELLFUN_STAGE_UP_ERROR(typeId, code) {
        FireEvent(EventDefine.FUN_AUTO_FAIL, FunAutoFail.newObj(typeId))
    }

    //熔炼多少个物品
    export function G2C_EquipMelt(num) {
        TLog.Debug("===========  G2C_EquipMelt")
        FireEvent(EventDefine.ITEM_SMELT_UPDATE, null)
    }

    //宠物资质自动升级失败
    export function G2C_ACTOR_PET_GROW_UP_ERROR(petId, code) {
        //PetSystem.getInstance().stopAutoNaturl(petId)
    }

    //仙侣自动升级失败
    export function C2G_ACTOR_XIANLV_UPGRADE_ERROR(xianLvId, code) {
        XianLvSystem.getInstance().stopAutoUpgrade(xianLvId)
    }

    //VIP奖励
    export function G2C_RechageRewardInfo(prizeList, recordList) {
        VipSystem.getInstance().setVipPrizeInfo(prizeList, recordList)
        FireEvent(EventDefine.VIP_PRIZE_UPDATE, null)
    }

    //宠物合成结果
    export function G2C_ActorPetCompound(result, entryId) {
        let wnd = WngMrg.getInstance().getWindow("PetUnionFrame")
        if (wnd.isVisible()) {
            wnd.updateFrame(result, entryId)
        } else {
            if (result == 1) {
                //成功
                let wnd = WngMrg.getInstance().getWindow("PetUnionSuccessFrame")
                wnd.showWithEntryId(entryId)
            } else {
                //失败
                let wnd = WngMrg.getInstance().getWindow("PetUnionLostFrame")
                wnd.showWnd()
            }
        }
    }

    //自己的宠物合成记录
    export function G2C_ActorPetCompound_Record(recordList) {
        PetSystem.getInstance().setPetUnionRecordList(recordList)
        FireEvent(EventDefine.PET_UNION_RECORD, null)
    }

    //全服合成成功记录
    export function G2C_ActorPetCompound_Formula(entryId, recordList) {
        PetSystem.getInstance().setPetUnionRecordPlayerList(entryId, recordList)
        FireEvent(EventDefine.PET_UNION_SERVER_RECORD, null)
    }

    //宠物飞升升级失败
    export function G2C_ACTOR_PET_FLY_UPGRADE_ERROR(entryId, errorCode) {
        FireEvent(EventDefine.PET_FLY_UPGRADE_ERROR, null)
    }

    //猎魂
    export function G2C_Hunting_Result(info){
        let wnd : LieHunFrame = WngMrg.getInstance().getWindow("LieHunFrame")
        if(wnd.isVisible()){
            wnd.updateWnd(info)
        }
    }

    //神魂信息
    export function G2C_ShenHun_INFO(info){
        RoleSystem.getInstance().initShenHunInfo(info)
    }

    //神魂更新
    export function G2C_ShenHun_UPDATE(id, info){
        RoleSystem.getInstance().updateShenHunInfo(info)
        FireEvent(EventDefine.SHENHUN_UPGRADE, null)
    }
}