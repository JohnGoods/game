/*
作者:
	ljq
	
创建时间：
	2012.2.11(周一)

意图： 
	仙侣系统

公共接口：

*/

class XianLvSystem extends BaseSystem {
    fightList: {};
    xianLvList;
    jiHuoList: any[];
    qiyuanList
    controList

    public initObj(...args: any[]): void {
        this.onClear()

    }

    onClear() {
        this.fightList = {}
        this.xianLvList = {}
        this.jiHuoList = []
        this.qiyuanList = []
        this.controList = []
    }

    destory() {
        this.onClear()
    }

    prepareResource(workQueue) {
        GameConfig.initXianLvSystemCsv(workQueue);
    }
    //////////////////////初始化仙侣列表//////////
    initXianLvList(info) {
        let tempInfo = {}
        for (let _ in info) {
            let v = info[_]
            tempInfo[v.entryid] = v
            if (v.combatpos != 0) {
                this.fightList[v.entryid] = v.combatpos
            }
            JsUtil.arrayInstert(this.jiHuoList, v.entryid)
        }
        this.xianLvList = tempInfo
        this.updaetControlList()
    }

    ////////////////////////新增一个仙侣///////////////
    addXianLvInfo(info) {
        this.xianLvList[info.entryid] = info
        if (info.combatpos != 0) {
            this.fightList[info.entryid] = info.combatpos
        }
        JsUtil.arrayInstert(this.jiHuoList, info.entryid)
        this.updaetControlList()
        FireEvent(EventDefine.ACTOR_XIANLV_LIST_UPDATE, null)
    }

    /////////////////局部更新//////////////////////////
    _updateXianLvInfoField(id, updateProperty) {
        let Info = this.xianLvList[id]

        if (Info == null) {
            return
        }

        for (let k in updateProperty) {
            Info[k] = updateProperty[k]
            if (k == "combatpos") {
                this.fightList[id] = Info[k]
            }
        }
        this.xianLvList[id] = Info
        FireEvent(EventDefine.ACTOR_XIANLV_UPDATE, null)
    }

    updaetControlList() {
        this.controList = []
        let list = GameConfig.ActorXianLvConfig
        let jiHuoList = this.jiHuoList

        let activeList = []
        let unActiveList = []

        for (let k in list) {
            let xianlvInfo = list[k]
            if (table_isExist(jiHuoList, xianlvInfo.Id)) {
                table_insert(activeList, xianlvInfo)
            } else {
                table_insert(unActiveList, xianlvInfo)
            }
        }

        table_sort(activeList, function (a, b) {
            let aForce = GetForceMath(table_effect(a.effects))
            let bForce = GetForceMath(table_effect(b.effects))
            return bForce - aForce
        })

        table_sort(unActiveList, function (a, b) {
            return a.quality - b.quality
        })

        for (let k in unActiveList) {
            table_insert(activeList, unActiveList[k])
        }

        this.controList = activeList
    }

    getControlList() {
        return this.controList || {}
    }

    getStar(id: number) {
        if (!this.isExit(tonumber(id))) return
        return this.xianLvList[id].start
    }

     getXianLvByEntry(entryid: number) {
        let xianLVInfo = null
        if(this.xianLvList[entryid]){
            xianLVInfo = this.xianLvList[entryid]
        }
        return xianLVInfo
    }

    getLevel(id: number) {
        if (!this.isExit(id)) return
        return this.xianLvList[id].stage
    }
    getFightList() {
        return this.fightList
    }

    getFirstFightId() {
        let fightList = this.fightList
        if (size_t(fightList) == 0) return 17002

        for (let k in fightList) {
            if (fightList[k] != null && fightList[k] != 0) {
                return tonumber(k)
            }
        }
        return 17002

    }
    isExit(id: number) {
        return JsUtil.arrayExsit(this.jiHuoList, id)
    }
    getExpById(id: number) {
        if (!this.isExit(id)) return
        return this.xianLvList[id].stageexp
    }
    getForce(id: number) {
        if (!this.isExit(id)) return
        return this.xianLvList[id].force
    }

    getFightCount() {
        let count = 0
        for (let k in this.fightList) {
            if (this.fightList[k] != 0) {
                count += 1
            }
        }
        return count
    }

    getJiHuoList() {
        return this.jiHuoList
    }
    getRecvInfo(id) {
        return this.xianLvList[id] || {}
        //"entryid:uint32",
        //"stage:uint16",
        //"stageexp:uint32",
        //"combatpos:uint8",
        //"start:uint16"
        //return this.jiHuoList
    }

    ////获取颜色
    // getXianLvColor(quality) {
    //     let colorConfig = ["lime", "blue", "purple", "gold", "red"]
    //     return colorConfig[quality - 1] || colorConfig[0]
    // }

    getXianLvQuality(entryid){
        if (!GameConfig.ActorXianLvConfig[entryid]) {
			return "" + entryid
		}
		return GameConfig.ActorXianLvConfig[entryid].quality
    }

    getXianLvName(entryid){
        if (!GameConfig.ActorXianLvConfig[entryid]) {
			return "" + entryid
		}
		return GameConfig.ActorXianLvConfig[entryid].name
    }

    ///---获取激活的总战力
    getTotalForce() {
        let list = this.getJiHuoList()
        let recvNum = 0

        for (let k in list) {
            recvNum += this.getForce(list[k])
        }

        return recvNum
    }

    getQiYuanProperty() {

        let config = {
            maxhp : 0, demage : 0, hujia : 0,
           chuanjia: 0, chuanjiadec: 0
        }

        let jihuolist = this.jiHuoList
        let jie = 0
        for (let i = 0; i < jihuolist.length; i++) {
            jie += this.getLevel(jihuolist[i])
        }
        
        let qiyuanConfig = GameConfig.ActorXianLvQiYuanConfig
        let nowConfig = []
        for(let k in qiyuanConfig){
            let qiYuanInfo = qiyuanConfig[k]
            if(qiYuanInfo.allLevel > jie){
                break
            }else{
                nowConfig = qiYuanInfo.effects
            }
        }
        
        return table_effect_add(config, table_effect(nowConfig))
    }

    //停止自动升级
    stopAutoUpgrade(xianLvId) {
        let wnd = WngMrg.getInstance().getWindow("XianLvFrame")
        if (wnd.isVisible()) {
            if (wnd.selectId == xianLvId && wnd.tabWndList.getTabIndex() == 0) {
                let currentWnd = wnd.tabWndList.getCurrentWnd()
                if (currentWnd) {
                    currentWnd.stopAutoUpgrade()
                }
            }
        }
    }
}