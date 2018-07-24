//开服活动
class Activity_Carnival extends ActivityBase {
    relatetionActIndex: any;
    activityIcon

    public initObj(...args: any[]): void {
        this.relatetionActIndex = [
            PayActivityIndex.EVERY_STAGE_A,									//天仙进阶
            PayActivityIndex.EVERY_STAGE_B,									//进阶排行
            PayActivityIndex.SHOP_DISCOUNT_A,										//熊猫副本（开服副本）
            PayActivityIndex.SHOP_DISCOUNT_B,									//折扣商店
            PayActivityIndex.MIX_ACCU_RECHARGE,								//累积充值								//全民冲级
            PayActivityIndex.NORMAL_INST_ZONES,								//日常副本,猪八戒
        ]

        this.activityIcon = {
            [cellOptionsIndex.HeroRide]: "kfhd_Bt10",
            [cellOptionsIndex.HeroWing]: "kfhd_Bt14",
            [cellOptionsIndex.PetTongLin]: "kfhd_Bt20",
            [cellOptionsIndex.PetSouHun]: "kfhd_Bt22",
            [cellOptionsIndex.XianLvFaZhen]: "kfhd_Bt16",
            [cellOptionsIndex.XianLvXianWei]: "kfhd_Bt18",
            [cellOptionsIndex.TianXian]: "kfhd_Bt01",
            [cellOptionsIndex.TianXianWeapon]: "kfhd_Bt12",
            [cellOptionsIndex.TianNv]: "kfhd_Bt24",
            [cellOptionsIndex.TianNvXianQi]: "kfhd_Bt25",
            [cellOptionsIndex.TianNvHuaNian]: "kfhd_Bt26",
            [cellOptionsIndex.TianNvLingQi]: "kfhd_Bt27",
        }
        this.onClear()
    }

    destory() {

    }

    onPrepareResource() {

    }

    onClear() {

    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////
    getCarnivalOpenActivity() {
        let list = []
        let openList = ActivitySystem.getInstance().getOperateActivityOpenList()
        for (let i = 0; i < openList.length; i++) {
            let index = openList[i]
            if (table_isExist(this.relatetionActIndex, index) == true) {
                table_insert(list, index)
            }
        }

        return list
    }

    getActivityRadioIcon(actIndex, defaultIcon?) {

        let iconList = {
            [PayActivityIndex.SHOP_DISCOUNT_A] : "kfhd_Bt04",										//熊猫副本（开服副本）
            [PayActivityIndex.SHOP_DISCOUNT_B] : "kfhd_Bt28",									//折扣商店
            [PayActivityIndex.MIX_ACCU_RECHARGE] : "kfhd_Bt05",								//累积充值		
            [PayActivityIndex.NORMAL_INST_ZONES] : "kfhd_Bt03",								//狂欢副本活动
        }
        let dayIndex = GetServerDay()
		let info = ActivitySystem.getInstance().getOperateActivityInfo(actIndex)
		if (info != null && size_t(info) != 0) {
			//通过info活动信息里获取当前活动的日期索引
            if (actIndex == PayActivityIndex.NORMAL_INST_ZONES) {
                let typeIndex = info[0]
                if (GameConfig.NormalInstZonesConfig[typeIndex]) {
                    return GameConfig.NormalInstZonesConfig[typeIndex][0].icon
                }
            }
		}

        if(iconList[actIndex]){
            return iconList[actIndex]
        }

        if (actIndex == PayActivityIndex.NORMAL_INST_ZONES) {

        } else {
            let tempConfig = GameConfig.StageLevelUpAConfig 
            if(actIndex == PayActivityIndex.EVERY_STAGE_B){
                tempConfig = GameConfig.StageLevelUpBConfig
            }
            let count = size_t(tempConfig)
            while(dayIndex > count){
                dayIndex -= count
            }
            if(tempConfig[dayIndex] == null) return "kfhd_Bt01"
            let tempInfo = tempConfig[dayIndex][0]
            if(tempInfo == null) return "kfhd_Bt01"

            return this.activityIcon[cellOptionsIndex[tempInfo.stageUp]]
        }
    }

    //狂欢进阶/累计的
    getCarnivalUpgrade(index, tempConfig) {
        let netInfo = ActivitySystem.getInstance().getOperatePlayerInfo(index)
        if (netInfo == null) return null
        let playerInfo = netInfo
        if (index == PayActivityIndex.MIX_ACCU_RECHARGE) {
            playerInfo = netInfo[1] || {}
        }
        //if (playerInfo == null) return null
        let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(index)
        if (activityInfo == null) return null
        let count = size_t(tempConfig)
        let day = activityInfo[0]
        while(day > count){
            day -= count
        }
        let stageUpConfig = tempConfig[day]
        if (stageUpConfig == null) return null
        let unFinishList = []
        let finishList = []
        for (let k in stageUpConfig) {
            let tempInfo = stageUpConfig[k]
            if (playerInfo[k] == 1) {
                table_insert(finishList, tempInfo)
            } else {
                table_insert(unFinishList, tempInfo)
            }
        }

        for (let k in finishList) {
            let tempInfo = finishList[k]
            table_insert(unFinishList, tempInfo)
        }

        return unFinishList
    }

    //商店
    getCarnivalShopList(index, tempConfig) {
        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(index)
        if (playerInfo == null) return null
        let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(index)
        if (activityInfo == null) return null
        let nowStage = 0
        let count = size_t(tempConfig)
        let day = activityInfo[0]
        while(day > count){
            day -= count
        }
        let shopConfig = tempConfig[day]
        if (shopConfig == null) return null
        let cellIndex = cellOptionsIndex[shopConfig[0].stageUp]
        if (cellIndex == null) return null
        let funInfo = FunSystem.getInstance().getFunInfoWithType(cellIndex)
        if (shopConfig == null) return []
        if (funInfo != null) {
            nowStage = funInfo.stage
        }
        let nextStage = nowStage + 1
        let nowList = []
        let nextList = []
        let maxCond = 0
        for (let k in shopConfig) {
            let tempInfo = shopConfig[k]
            let cond = tempInfo.cond
            if (cond > maxCond) {
                maxCond = cond
            }
            if (cond != nowStage && cond != nextStage) continue
            if (playerInfo[k]) {
                if (playerInfo[k] >= tempInfo.limitCount) {
                    continue
                }
            }
            if (cond == nowStage) {
                table_insert(nowList, tempInfo)
            } else {
                table_insert(nextList, tempInfo)
            }
        }

        while (size_t(nextList) == 0 && nextStage < maxCond) {
            nextStage += 1
            for (let k in shopConfig) {
                let tempInfo = shopConfig[k]
                if (tempInfo.cond != nextStage) continue
                table_insert(nextList, tempInfo)
            }

        }

        for (let k in nextList) {
            let v = nextList[k]
            table_insert(nowList, v)
        }

        return nowList
    }
}