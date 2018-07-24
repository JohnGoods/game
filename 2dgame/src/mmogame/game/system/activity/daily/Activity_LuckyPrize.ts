//开服活动
class Activity_LuckyPrize extends ActivityBase {
    relatetionActIndex: any;
    activityIcon

    public initObj(...args: any[]): void {
        this.relatetionActIndex = [
            PayActivityIndex.Fallen_Good_Gift_Recharge,
            PayActivityIndex.Fallen_Good_Gift_SHOP
        ]
        this.onClear()
    }

    destory() {

    }

    onPrepareResource() {

    }

    onClear() {

    }

    getLuckyPrizeOpenActivity() {
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

    ///幸运豪礼
    getLuckyPrizeList(index) {
        let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(index)
        if (activityInfo == null) return null
        let day = activityInfo[1]
        let tempConfig = GameConfig.FallenRechargeConfig
        let count = size_t(tempConfig)
        while (day > count) {
            day -= count
        }
        let fallenConfig = tempConfig[day]
        if (fallenConfig == null) return null
        let playerInfo = getSaveRecord(opSaveRecordKey.FallenGoodGiftRecharge) || {}
    
        let unFinishList = [] //可领取的
        let finishList = [] // 未领取的  -- 已领取的移除
        for (let k in fallenConfig) {
            let tempInfo = fallenConfig[k]
            let hadCharge = playerInfo[k] 
            if (hadCharge == 0) {
                table_insert(finishList, tempInfo)
            } else if(hadCharge == null) {
                table_insert(unFinishList, tempInfo)
            }

        }

        for(let k in unFinishList){
            let v = unFinishList[k]
            table_insert(finishList, v)
        }

        return finishList
    }

    getWorthyFeedbackList(index){
        let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(index)
        if (activityInfo == null) return null
        let day = activityInfo[1]
        let tempConfig = GameConfig.ShopfallenGoodGiftConfig
        let count = size_t(tempConfig)
        while (day > count) {
            day -= count
        }
        let fallenConfig = tempConfig[day]
        if (fallenConfig == null) return null
        let playerInfo = getSaveRecord(opSaveRecordKey.FallenGoodGiftShop) || {}
    
        let unFinishList = []
        let finishList = []
        for (let k in fallenConfig) {
            let tempInfo = fallenConfig[k]
            let hadCharge = playerInfo[k] || 0
            if (hadCharge >= tempInfo.limitCount) {
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

}