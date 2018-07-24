/*
作者:
    panyuxiong
	
创建时间：
    2014.11.27(星期四) 

意图：
  	管理VIP系统

公共接口：
	
*/

class VipSystem extends BaseSystem {

    prizeInfo
    recordInfo

    public initObj(...args: any[]): void {
        this.prizeInfo = []
        this.recordInfo = []
    }

    destory() {

    }

    prepareResource(workQueue) {

        GameConfig.initVipSystemCsv(workQueue);
    }

    onClear() {

    }

    GetVipLevel() {
        let heroInfo = GetHeroPropertyInfo()
        if (heroInfo == null) {
            return 0
        }
        return heroInfo.VIP_level || 0
    }

    GetCurVipSkytowerCount() {
        let heroInfo = GetHeroPropertyInfo()
        let vipLevel = heroInfo.VIP_level
        if (GameConfig.VipPrivilege[vipLevel]["skyTowerCount"]) {
            return GameConfig.VipPrivilege[vipLevel]["skyTowerCount"]["param"][0]
        } else {
            return 0
        }
    }

    ////////////////////////////////////////////////////////////////////////////////-
    //-vipBuff
    GetVipBuff() {
        let heroInfo = GetHeroPropertyInfo()
        return heroInfo.VIPBuff
    }

    ////////////////////////////////////////////////////////////////////////////////-
    //-VIP充值多少钱可以到下一级
    GetVipFeed() {
        let heroInfo = GetHeroPropertyInfo()

        let maxExp = 0

        if (heroInfo.VIP_level + 1 > defaultValue.DEFALUT_VIP_MAX_LEVEL) {
            maxExp = GameConfig.VipEXP[defaultValue.DEFALUT_VIP_MAX_LEVEL]["exp"]
        } else {
            maxExp = GameConfig.VipEXP[heroInfo.VIP_level + 1]["exp"]
        }
        maxExp = maxExp - heroInfo.VIP_exp

        return maxExp
    }

    //获取指定vip等级所需晶石数
    getVipSumDia(vipLevel) {
        vipLevel = vipLevel + 1
        if (vipLevel > defaultValue.DEFALUT_VIP_MAX_LEVEL) {
            vipLevel = defaultValue.DEFALUT_VIP_MAX_LEVEL
        }

        let sum = GameConfig.VipEXP[vipLevel].exp

        return sum
    }

    //获取指定vip等级需要充值多少晶石
    getVipSum(vipLevel) {
        if (vipLevel == 0) {
            return 0
        }
        // vipLevel = vipLevel + 1
        if (vipLevel > defaultValue.DEFALUT_VIP_MAX_LEVEL) {
            vipLevel = defaultValue.DEFALUT_VIP_MAX_LEVEL
        }
        let config = GameConfig.VipEXP
        //let sum = GameConfig.VipEXP[vipLevel].exp
        let sum = GameConfig.VipEXP[vipLevel].vip_exp
        return sum
    }

    ////////////////////////////////////////////////////////////////////////////////-
    //-获取VIP扫荡次数
    GetVipSweep() {
        let level = this.GetVipLevel()
        let count = GameConfig.VipPrivilege[level]["campainWipe"]
        return count["param"][0]
    }

    //-获取VIP竞技场挑战次数
    GetVipChampionTime() {
        let level = this.GetVipLevel()
        let count = GameConfig.VipPrivilege[level]["buyChampionCount"]
        return count["param"][0]
    }
    //-获取VIP免费抽环次数
    GetVipFreeBateTime() {
        let level = this.GetVipLevel()
        let count = GameConfig.VipPrivilege[level]["recruitBateCount"]
        return count["param"][0]
    }

    //-获取VIP免费刷新次数
    GetVipFreeUpdateTime() {
        let level = this.GetVipLevel()
        let count = GameConfig.VipPrivilege[level]["recruitHoopCount"]
        return count["param"][0] || 0
    }

    //-获取VIP竞技场减cd时间
    GetVipChampionTimeTime() {
        let level = this.GetVipLevel()
        let count = GameConfig.VipPrivilege[level]["championTime"]
        return count["param"][0]
    }
    GetVipDivinationCpunt() {
        let level = this.GetVipLevel()
        let count = GameConfig.VipPrivilege[level]["choujiang"]
        return count["param"][0]
    }
    GetVipCanRestartTower() {
        let level = this.GetVipLevel()
        let count = GameConfig.VipPrivilege[level]["skyTowerCount"]["param"][0]
        return count
    }

    //死亡领域重置数量
    getAbsoZoneReset() {
        let level = this.GetVipLevel()
        return GameConfig.VipPrivilege[level]["deadField"]["param"][0] || 0
    }

    //购买金币和体力限制
    getGoldOrPowerLimit(buyType) {
        let vipLevel = this.GetVipLevel()
        if (buyType == opItemUnit.FUNDS) {
            return GameConfig.VipPrivilege[vipLevel]["buyFund"]["param"][0]
        } else if (buyType == opItemUnit.POWER) {
            return GameConfig.VipPrivilege[vipLevel]["buyPower"]["param"][0]
        }

        return 0
    }

    //帮会任务重置
    getClubTaskResetTime() {
        let level = 0
        let count = 0
        for (let lv in GameConfig.VipPrivilege) {
            let vipPrivilege = GameConfig.VipPrivilege[lv]
            for (let i in vipPrivilege) {
                if (i == "clubTaskReset") {
                    level = tonumber(lv)
                    count = vipPrivilege[i]["param"]
                }
            }
        }
        return [level, count]
    }

    //聊天气泡
    // getChatBubbleList() {
    //     let list = []
    //     let vipLevel = [0, 1, 3, 5, 8, 12]
    //     for (let _ in vipLevel) {
    //         let v = vipLevel[_]

    //         let info = GameConfig.VipPrivilege[v]["chatBubble"]["param"]
    //         JsUtil.arrayInstert(list, [info[0], info[1], v])
    //     }
    //     return list
    // }

    getHeadIconKuang(viplevel) {
        if (viplevel == null || viplevel <= 4) {
            return "ty_renWuKuang01"
        }
        if (viplevel <= 6) {
            return "ty_renWuKuang02"
        }
        if (viplevel <= 8) {
            return "ty_renWuKuang03"
        }
        if (viplevel <= 10) {
            return "ty_renWuKuang04"
        }
        if (viplevel <= 12) {
            return "ty_renWuKuang05"
        }

        return "ty_renWuKuang06"
        //0~4 01
        //5~6 02
        //7~8 03
        //9~10 04
        //11~12 05
        //13 06
    }


    //聊天气泡//getSortChatBubbleList
    getSortChatBubbleList() {
        let t1 = [], t2 = [], t3 = []

        let size = size_t(GameConfig.VipChatBubbleConfig)

        for (let k = 1; k <= size; k++) {
            let v = GameConfig.VipChatBubbleConfig[k]

            if (size_t(v.quest) == 0) {
                JsUtil.arrayInstert(t1, v)
            } else if (v.quest[0] == "item") {
                JsUtil.arrayInstert(t2, v)
            } else if (v.quest[0] == "vip") {
                JsUtil.arrayInstert(t3, v)
            }
        }
        let list = []
        for (let _ = 0; _ < t1.length; _++) {
            let v = t1[_]

            JsUtil.arrayInstert(list, v)
        }
        for (let _ = 0; _ < t2.length; _++) {
            let v = t2[_]

            JsUtil.arrayInstert(list, v)
        }

        table_sort(t3, function (a, b) {
            return a.quest[1] - b.quest[1]
        })

        for (let _ = 0; _ < t3.length; _++) {
            let v = t3[_]

            JsUtil.arrayInstert(list, v)
        }
        return list
    }

    ///////////////h5- ---西游
    getRechargeMoneyTwice() {
        let level = this.GetVipLevel()
        return GameConfig.VipPrivilege[level]["rechargeMoney"]["param"][0] || 0
    }

    ///////////////////////////////////////////////////////////////
    getTianNvVipLevel() {
        return GameConfig.VipPrivilege[0]["TianNvOpen"]["param"][0] || 0
    }

    getWorldBossBuyCount() {                            //世界BOSS挑战次数的购买次数
        let level = this.GetVipLevel()
        if (GameConfig.VipPrivilege[level] == null) {
            return 1
        } else if (GameConfig.VipPrivilege[level]["worldPlayerBossCount"] == null) {
            return 1
        } else {
            return GameConfig.VipPrivilege[level]["worldPlayerBossCount"]["param"][0] || 1
        }
    }
    ///////////////////////////////////////////////////////////////
    //vip等级奖励
    setVipPrizeInfo(prizeInfo, recordInfo) {
        this.prizeInfo = prizeInfo
        this.recordInfo = recordInfo
    }

    getVipPrizeItem() {
        return this.prizeInfo
    }

    getVipPrizeRecord() {
        return this.recordInfo
    }

    getVipConfigWithLv(level) {
        for (let i in this.prizeInfo) {
            let prize = this.prizeInfo[i]
            if (prize.vipLevel == level) {
                return prize
            }
        }
        return []
    }

    getVipPrizeRecordWithLv(level) {
        let prize = this.getVipConfigWithLv(level)
        if (prize) {
            return this.recordInfo[prize.index]
        }
        return 0
    }

    //获取下一个vip等级可购买次数
    getNextVipTimeWithLv(level, stype) {
        if (!GameConfig.VipPrivilege[level]) {
            level = level - 1
        }
        let count = GameConfig.VipPrivilege[level][stype]
        return [level, count["param"][0]]
    }
}