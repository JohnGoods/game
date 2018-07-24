/*
作者:
	ljq
	
创建时间：
	2018.3.21(周四)

意图： 
	商店系统

公共接口：

*/

class ShopSystem extends BaseSystem {
    shopList
    shopConditionList

    isShopInit

    static SHOP_YUANBAO = "yuanbao"
    static SHOP_BANGYUAN = "bangyuan"
    static SHOP_CHONGWU = "chongwu"
    static SHOP_XIANLV = "xianlv"

    static SHOP_ZHUANGBEI = "zhuangbei"
    static SHOP_LEIYIN = "leiyin"
    static SHOP_BANGHUI = "banghuishangdian"
    static FULI_BANGHUI = "banghuifuli"

    static SHOP_ZHUANGBAN = "zhuangban"
    static SHOP_PIFU = "pifu"
    static SHOP_YOUQING = "youqing"
    static SHOP_WEIWANG = "weiwang"

    static SHOP_JINGJI = "jingjishangdian"
    static FULI_JINGJI = "jingjifuli"
    static SHOP_HUSONG = "husong"
    static SHOP_DATI = "dati"

    static SHOP_SINGLE = "geren"
    static SHOP_GLOBAL = "quanmin"
    static SHOP_MATERIAL = "cailiao"
    static SHOP_DELINE = "shengsijie"

    static SHOP_PEERlESS = "diyi"
    static SHOP_KING = "wangzheshangdian"
    static FULI_KING = "wangzhefuli"

    static SHOP_SHENCHONG = "shenchong"

    static CHECK_ENTRY_START = 6
    static CHECK_ENTRY_END = 8

    public initObj(...args: any[]): void {
        this.onClear()

    }

    onClear() {
        this.shopList = {}
        this.shopConditionList = {}
        this.isShopInit = false
    }


    destory() {
        this.onClear()
    }

    prepareResource(workQueue) {
        GameConfig.initShopSystemCsv(workQueue)
    }


    initShopList(info) {
        this.shopList = {}
        for (let k = 0; k < size_t(info); k++) {
            let v = info[k]
            let tempConfig = {}
            let tempKey = tonumber(v[2])
            tempConfig["shopEntry"] = tempKey
            tempConfig["index"] = tonumber(v[0])
            tempConfig["count"] = tonumber(v[1])

            if (this.shopList[tempKey] == null) {
                this.shopList[tempKey] = []
            }
            table_insert(this.shopList[tempKey], tempConfig)
        }
        this.isShopInit = true
        FireEvent(EventDefine.SHOP_FUN_UPDATE, null)
    }

    initShopConditionList(message) {
        let tempConfig = {}
        for (let k in opJudgeJieSuo) {
            let v = opJudgeJieSuo[k]
            if (message[opJudgejiesuoIndex[v]]) {
                tempConfig[v] = message[opJudgejiesuoIndex[v]]
            }
        }
        this.shopConditionList = tempConfig
        FireEvent(EventDefine.SHOP_FUN_UPDATE, ShopUpdateEvent.newObj())

    }

    isCheckDots() {
        return this.isShopInit || false
    }

    getShopCondition(key: string) {
        if (this.shopConditionList == null || this.shopConditionList[key] == null) return 0
        return this.shopConditionList[key]
    }

    getShopInfo(shopEntry) {
        return this.shopList[shopEntry]
    }

    getShopPosInfo(shopEntry, index) {
        let tempConfig = this.shopList[shopEntry]
        if (tempConfig == null) {
            return null
        }
        for (let k in tempConfig) {
            let temp = tempConfig[k]
            if (temp.index == tonumber(index)) {
                return temp
            }
        }

        return null
    }

    //---------------装备商店
    getShopEquipItemList() {
        let equiplist = []
        let tempConfig = GameConfig.ShopCommodityConfig
        for (let k in tempConfig) {
            let v = tempConfig[k]
            for (let key in v) {
                let temp = v[key]
                if (temp.groupName == ShopSystem.SHOP_ZHUANGBEI) {
                    if (table_isExist(equiplist, temp.shopEntry) == false) {
                        table_insert(equiplist, temp.shopEntry)
                    }
                }
            }
        }

        return equiplist
    }



    ///////////////////////通用商店接口
    //获取各个商店的shopEntry
    getShopEntryByGroupName(groupName: string) {
        if (groupName == ShopSystem.SHOP_ZHUANGBEI) {
            return 0
        }
        let tempConfig = GameConfig.ShopCommodityConfig
        for (let k in tempConfig) {
            let v = tempConfig[k]
            for (let key in v) {
                if (v[key].groupName == groupName) {
                    return v[key].shopEntry
                }
            }
        }
    }

    //更具商店的shopEntry获得商店名字
    getShopNameByEntry(entry) {
        if (entry == 0) {
            return Localize_cns("SHOP_TXT1")
        }
        return GameConfig.ShopCommodityConfig[entry][1].shopName
    }

    //特殊处理元宝黑市
    getBlackMarketItemList(config) {
        let day = GetServerDay()
        let count = day - 0

        let recvConfig = {}
        for (let k in config) {
            let tempInfo = config[k]
            let day_t = tempInfo.day
            if (size_t(day_t) == 0) {
                recvConfig[tempInfo.Index] = tempInfo
                continue
            }
            let tempDay = day_t[0]
            if (type(tempDay) != "object") {
                if (day >= tempDay) {
                    recvConfig[tempInfo.Index] = tempInfo
                }
                continue
            }
            if (tempInfo.cutDay != 0) {
                let cutDay = tempInfo.cutDay
                while (count > cutDay) {
                    count -= cutDay
                }
                if (count >= tempDay[0] && count <= tempDay[1]) {
                    recvConfig[tempInfo.Index] = tempInfo
                }
            }
        }
        return recvConfig
    }

    //根据商店的shopEntry获得商店的itemlist
    getShopItemList(entry) {
        let shopConfig = GameConfig.ShopCommodityConfig
        let tempConfig
        if (entry == 20 || entry == 33) { //神秘商店跟神宠商店
            tempConfig = this.getBlackMarketItemList(shopConfig[entry])
        } else {
            tempConfig = shopConfig[entry]
        }
        let sortConfig = []
        for (let k in tempConfig) {
            let v = tempConfig[k]
            table_insert(sortConfig, v)
        }

        table_sort(sortConfig, function (a, b) {
            return a.clientPos - b.clientPos
        })
        let recvConfig = []
        let limitConfig = []
        for (let k in sortConfig) {
            let v = sortConfig[k]
            //如果信息为空
            if (v.groupName == "") continue
            //无限购
            let limitTwice = this.getLimitTwice(entry, v.Index)
            if (limitTwice == 0) {
                table_insert(recvConfig, v)
                continue
            }
            //如果拥有皮肤
            let skin = v.skin
            let isSkin = size_t(skin) != 0
            if (isSkin) {
                let check = RoleSystem.getInstance().checkSkinExist(skin[0], skin[1])
                let count = ItemSystem.getInstance().getItemCount(v.itemEntry)
                if (check || count >= 1) {
                    table_insert(limitConfig, v)
                    continue
                }
            }

            //如果拥有仙侣
            let xianlvId = v.xianlvId || 0
            if (xianlvId != 0) {
                let itemEntry = v.itemEntry
                let count = ItemSystem.getInstance().getItemCount(v.itemEntry)
                let check = XianLvSystem.getInstance().isExit(xianlvId)
                if (check || count >= 1) {
                    table_insert(limitConfig, v)
                    continue
                }
            }


            //如果未解锁
            let limitKey = this.getJudgeSuoLimit(entry, v.Index)
            if (limitKey != "") {
                if (this.getJudgeIsEnough(limitKey, v[limitKey]) == false) {
                    table_insert(limitConfig, v)
                    continue
                }
            }
            //卖完了
            let netConfig = this.getShopPosInfo(entry, v.Index)
            if (netConfig != null && netConfig.count >= limitTwice) {
                table_insert(limitConfig, v)
                continue
            }
            table_insert(recvConfig, v)
        }

        for (let k in limitConfig) {
            table_insert(recvConfig, limitConfig[k])
        }
        return recvConfig
    }

    //取到消耗物品
    getShopCostItemStr(groupName) {
        let entry = this.getShopEntryByGroupName(groupName)
        if (entry == 0) {
            let equipEntryList = this.getShopEquipItemList()
            entry = equipEntryList[0]
        }
        let costItem = GameConfig.ShopCommodityConfig[entry][1].costItem || 2
        let recvStr = ""
        if (GetMoneyIcon(costItem) != "") {
            recvStr += GetMoneyIcon(costItem) + GetHeroMoney(costItem)
        } else {
            recvStr += GetTagIcon(costItem) + ItemSystem.getInstance().getItemCount(costItem)
        }
        return recvStr
    }

    //////ShopitemBox
    getShopCostStr(shopEntry, index) {
        let recvStr = ""
        let shopConfig = GameConfig.ShopCommodityConfig[shopEntry][index]
        if (shopConfig.approachName != "") {
            return Localize_cns("SHOP_HUOQU")
        }
        let icon = ""
        if (shopConfig.money != 0) {
            icon = GetMoneyIcon(shopConfig.money)
        } else if (shopConfig.unit != 0) {
            icon = GetTagIcon(shopConfig.unit)
        }

        let isDiscout = shopConfig.discount != 1
        if (isDiscout) {
            recvStr = String.format(Localize_cns("OPENSERVER_TXT16"), shopConfig.price + icon)
        } else {
            recvStr = icon + "X" + shopConfig.price
        }

        return recvStr
    }

    getShopJudgeStr(shopEntry, index) {
        let shopConfig = GameConfig.ShopCommodityConfig[shopEntry][index]
        //如果是皮肤， 判断是否拥有或者激活
        let skin = shopConfig.skin
        let isSkin = size_t(skin) != 0
        if (isSkin) {
            let check = RoleSystem.getInstance().checkSkinExist(skin[0], skin[1])
            let count = ItemSystem.getInstance().getItemCount(shopConfig.itemEntry)
            if (check || count >= 1) {
                return Localize_cns("SHOP_TXT3")
            }
        }

        //如果拥有仙侣
        let xianlvId = shopConfig.xianlvId || 0
        if (xianlvId != 0) {
            let itemEntry = shopConfig.itemEntry
            let count = ItemSystem.getInstance().getItemCount(shopConfig.itemEntry)
            let check = XianLvSystem.getInstance().isExit(xianlvId)
            if (check || count >= 1) {
                return Localize_cns("SHOP_TXT3")
            }
        }

        //判断是否有限购
        let limitTwice = this.getLimitTwice(shopEntry, index)  //限购次数
        if (limitTwice == 0) {
            return Localize_cns("SHOP_TXT4")
        }
        //判断是否需要解锁
        let limitKey = this.getJudgeSuoLimit(shopEntry, index)
        if (limitKey == "") {
            //是否卖完
            let buyInfo = this.getShopPosInfo(shopEntry, index)
            let hadBuy = 0
            if (buyInfo != null) {
                hadBuy = buyInfo.count
            }
            if (hadBuy >= limitTwice) {
                return Localize_cns("SHOP_TXT3")
            }
            return "#darkgreen" + String.format(Localize_cns("SHOP_TXT2"), hadBuy, limitTwice)
        }
        //判断是否达到解锁条件
        let needLimit = shopConfig[limitKey]
        let isEnough = this.getJudgeIsEnough(limitKey, needLimit)
        if (!isEnough) {
            return "#red" + String.format(this.getJudgeStr(limitKey), needLimit)
        }
        //是否卖完
        let buyInfo = this.getShopPosInfo(shopEntry, index)
        let hadBuy = 0
        if (buyInfo != null) {
            hadBuy = buyInfo.count
        }
        if (hadBuy >= limitTwice) {
            return Localize_cns("SHOP_TXT3")
        }
        return "#darkgreen" + String.format(Localize_cns("SHOP_TXT2"), hadBuy, limitTwice)
    }

    ///----- 玩家各个条件
    getHeroJudge(key) {
        return this.getShopCondition(key)
    }

    getJudgeSuoLimit(shopEntry, index) {  //判断有没有限制
        let tempConfig = GameConfig.ShopCommodityConfig[shopEntry][index]
        for (let k in opJudgeJieSuo) {
            let v = opJudgeJieSuo[k]
            if (tempConfig[v] != 0) {
                return v
            }
        }
        return ""
    }

    ////---- 判断玩家条件是否充足
    getJudgeIsEnough(key, limit) {
        let heroJude = this.getHeroJudge(key)

        if (key == opJudgeJieSuo.RANKINGNUM) {
            if (heroJude <= limit) {
                return true
            } else {
                return false
            }
        }

        if (heroJude >= limit) {
            return true
        }

        return false
    }

    getJudgeStr(key) {
        let judgeList = {
            [opJudgeJieSuo.LEVELNUM]: Localize_cns("SHOP_TIAOJIAN_TXT1"),                          //等级条件
            [opJudgeJieSuo.GAMECASENUM]: Localize_cns("SHOP_TIAOJIAN_TXT2"),                          //通关条件
            [opJudgeJieSuo.FACTIONLEVEL]: Localize_cns("SHOP_TIAOJIAN_TXT3"),                          //帮会等级条件
            [opJudgeJieSuo.RANKINGNUM]: Localize_cns("SHOP_TIAOJIAN_TXT4"),                       //排行条件
            [opJudgeJieSuo.CONVOYNUM]: Localize_cns("SHOP_TIAOJIAN_TXT5"),                        //护送条件
            [opJudgeJieSuo.ANSWERNUM]: Localize_cns("SHOP_TIAOJIAN_TXT6"),                         //答题条件

            [opJudgeJieSuo.SINGLENUM]: Localize_cns("SHOP_TIAOJIAN_TXT7"),                         //个人boss条件
            [opJudgeJieSuo.GLOBALNUM]: Localize_cns("SHOP_TIAOJIAN_TXT7"),                         //全民boss条件
            [opJudgeJieSuo.DELINENUM]: Localize_cns("SHOP_TIAOJIAN_TXT9"),                         //生死劫条件
            [opJudgeJieSuo.MATNUM]: Localize_cns("SHOP_TIAOJIAN_TXT7"),                         //材料副本
        }

        return judgeList[key]
    }

    ///获取限购次数
    getLimitTwice(shopEntry, index) {
        let tempConfig = GameConfig.ShopCommodityConfig[shopEntry][index]
        if (tempConfig.limit != 0) {
            return tempConfig.limit
        } else if (tempConfig.weekLimit != 0) {
            return tempConfig.weekLimit
        } else if (tempConfig.lifeLimit != 0) {
            return tempConfig.lifeLimit
        } else {
            return 0
        }
    }


    //获取商店物品价格
    getBindYBItemPrice(shopEntry, entryId) {
        let byItemList = GameConfig.ShopCommodityConfig[shopEntry]
        for (let i in byItemList) {
            let itemConfig = byItemList[i]
            if (itemConfig.itemEntry == entryId) {
                return itemConfig.price
            }
        }
        return null
    }


    //检查是否获得
    checkIsExitSkin(itemId, suit) {
        let count = ItemSystem.getInstance().getItemCount(itemId)
        if (count >= 1) return true //获得

        //激活
        let suitConfig = GameConfig.FashionSuitConfig[RoleEquipResonateName[suit - 1]]
        let skinConfig = GameConfig.FunSkinConfig
        let skinInfo = null
        for (let k in suitConfig) {
            let suitInfo = suitConfig[k]
            let skin = skinConfig[cellOptionsName[suitInfo.cellIndex - 1]][suitInfo.skinIndex]
            if (skin == null) continue
            if (skin.itemid == itemId) {
                skinInfo = skin
                break
            }
        }

        if (skinInfo != null) {
            let check = RoleSystem.getInstance().checkSkinExist(cellOptionsIndex[skinInfo.Name], skinInfo.Index)
            if (check) {
                return check
            }
        }

        return false
    }

    getShopCutDayInfo(entry) {
        let tempConfig = this.getShopItemList(entry)
        for (let k in tempConfig) {
            let tempInfo = tempConfig[k]
            if (tempInfo.cutDay != 0) {
                return tempInfo
            }
        }
        return null
    }

}