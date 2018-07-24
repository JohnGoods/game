// TypeScript file
class Activity_Boss extends ActivityBase {
	actInfo: any
    actBossInfo: any
    xiYouTaskList : any
    xiYouLiLianInfo : any
    xiYouFindInfo : any
    sanBaiInfo : any
    lilianInfo : any
    actBossRankInfo: any
    timerList: any
    passInfo: any


	public initObj(...args: any[]): void {
        RegisterEvent(EventDefine.BOSSACTIVITY_INFO, this.onUpdateBossInfo, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onHeroInfoUpdate, this)
		this.onClear()
	}

	destory() {
        UnRegisterEvent(EventDefine.BOSSACTIVITY_INFO, this.onUpdateBossInfo, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onHeroInfoUpdate, this)
        // UnRegisterEvent(EventDefine.TASK_COMMIT_FINISH, this.onAutoShow, this)
	}

	onPrepareResource() {
		// RegisterEvent(EventDefine.UPDATE_WELFARE, this.onAutoShow, this)
		// RegisterEvent(EventDefine.TASK_COMMIT_FINISH, this.onAutoShow, this)

        this.messageWndHandleIndex = 
		{	
            // ["G2C_SweepBossActivity"]: [this.onRecvEnter, {}, true],
            ["G2C_GetBossActivityInfo"]: [this.onRecvActInfo, [["BossMainFrame", "updateWnd"], ["CopyMainFrame", "updateWnd"],["DailyFrame","updateWnd"],["BossBefallFrame", "updateWnd"],["ActivityListFrame", "updateWnd"], ["ClubFrame", "updateWnd"],["GlobalMainFrame", "updateWnd"]], true],
            ["G2C_GetBossIndexData"]: [this.onRecvBossInfo, [["BossWildFrame", "updateWnd"], ["BossBefallFrame", "updateFightRecord"]], true],
            ["G2C_GetActivityRank"]: [this.onRecvBossRankInfo, [["BossGlobalHarmRankFrame", "updateWnd"], ["BossGlobalKillRankFrame", "updateWnd"]], true],
            //日常组队
            ["G2C_ZUDUILILIANW_Info"]: [this.onRecvLiLianInfo, [["DailyFrame","updateWnd"]], true],
            //每日三百
            ["G2C_MEIRISANBAI_MonsterNum"]: [this.onRecvSanBaiInfo, [["DailyFrame","updateWnd"]], true],
            //西游历练
            ["G2C_XiyouLilian_Info"]: [this.onRecvXiYouInfo, [["DailyFrame","updateWnd"]], true],
            ["G2C_XiyouLilian_RecordInfo"]: [this.onRecvFindBackInfo, [["DailyFindBackFrame","updateWnd"]], true],
            //过关记录
            ["G2C_GetBossActivityRecInfo"]: [this.onRecvRecInfo, [["CopyMainFrame", "updatePassRecord"]], true],
		}
	}

	onClear() {
		this.actInfo = {}
        this.actBossInfo = {}
        this.actBossRankInfo = {}
        this.xiYouTaskList = []
        this.xiYouLiLianInfo = {}
        this.sanBaiInfo = {}
        this.lilianInfo = {}
        this.passInfo = {}

        if (this.timerList != null) {
            for (let k in this.timerList) {
                let timer = this.timerList[k]
                KillTimer(timer)
            }
        }
        this.timerList = {}

        let wnd = WngMrg.getInstance().getWindow("ActivityRemindFrame")
        for (let index in GameConfig.BossGlobalConfig) {
            wnd.removeListener("golbalboss" + index)
        }
	}

    onRecvEnter(message) {

    }

    onRecvActInfo(message) {
        let index = message.index
        let oldInfo = this.actInfo[index]

        this.actInfo[index] = message.data

        FireEvent(EventDefine.BOSSACTIVITY_INFO, BossActivtyUpdateEvent.newObj(index, message.data, oldInfo))
        return true
    }

    getActInfo(index) {
        return this.actInfo[index]
    }

    onRecvBossInfo(message) {
        let actIndex = message.index
        let bossIndex = message.bossIndex

        this.actBossInfo[actIndex] = checkNull(this.actBossInfo[actIndex], {})
        this.actBossInfo[actIndex][bossIndex] = message.data
        
        return true
    }

    getActBossInfo(actIndex, bossIndex) {
        if (this.actBossInfo[actIndex] == null) {
            return null
        }
        return this.actBossInfo[actIndex][bossIndex]
    }

    onRecvBossRankInfo(message) {
        let actIndex = message.index
        this.actBossRankInfo[actIndex] = checkNull(this.actBossRankInfo[actIndex], [])
        table_insert(this.actBossRankInfo[actIndex], message)                        //一个活动可能有多种不同的排行
        
        return true
    }

    getActBossRankInfo(actIndex) {
        if (this.actBossRankInfo[actIndex] == null) {
            return null
        }
        return this.actBossRankInfo[actIndex]
    }

    ///--------日常降妖
    getZhongKuiActNpcList(){
        let actInfo = this.actInfo[OrdinaryActivityIndex.ZhongKuiDemon]
        if(actInfo == null) return null
        let npcList = actInfo.npcList
        let activeList = {}
        for(let k in npcList){
            let v = npcList[k]
            let osTime = GetServerTime()
            if ((v <= osTime)) {
                activeList[k] = v
            }
        }
        return activeList
    }

    ///--------日常历练
    onRecvLiLianInfo(message){
        let oldInfo = this.lilianInfo
        this.lilianInfo = message
        FireEvent(EventDefine.BOSSACTIVITY_INFO, BossActivtyUpdateEvent.newObj(OrdinaryActivityIndex.XiyouLilian, message, oldInfo))
        return true
    }

    getLiLianInfo(){
        return this.lilianInfo || {}
    }

    ///--------每日三百
    ///--------服务器数据
    onRecvSanBaiInfo(message){
        let oldInfo = this.sanBaiInfo
        this.sanBaiInfo = message
        FireEvent(EventDefine.BOSSACTIVITY_INFO, BossActivtyUpdateEvent.newObj(OrdinaryActivityIndex.NULL, message, oldInfo))

        return true
    }

    getSanBaiInfo(){
        return this.sanBaiInfo
    }

    ///----------本地数据
    getDataConfigByLevel(level, dataConfig){
        let recvKey = 0
        for(let k in dataConfig){
            if(tonumber(k) > level){
                if(recvKey == 0){
                    recvKey = tonumber(k)
                }
                break
            }else{
                recvKey = tonumber(k)
            }
        }

        if(recvKey != 0){
            return dataConfig[recvKey]
        }
        return null
    }

    getZhongKuiMonsterList(level, dataConfig){
        for(let k in dataConfig){
            let tempInfo = dataConfig[k]
            let limit_t = tempInfo.level
            if(level >= limit_t[0] && level <= limit_t[1]){
                return tempInfo
            }
        }

        return null
    }

    ////---------西游历练
    ///----------网络数据
    onRecvXiYouInfo(message){
        this.xiYouTaskList = []
        this.xiYouLiLianInfo = {}
        this.xiYouLiLianInfo = message
        this.onUpdateXiYouInfo(message.taskList)
        FireEvent(EventDefine.DAILYACTIVITY_INFO, null)
        return true
    }
    ///---------(处理网络数据与本地数据)
    onUpdateXiYouInfo(message){
        let tempConfig = GameConfig.EveryDayLiLianTaskConfig
        
        let unfinish = []
        let finish = []

        for(let k in tempConfig){
            let task = tempConfig[k]
            let temp: any = {}
            temp = task
            let netInfo  = message[temp.ID]
            if(netInfo){
                temp["curTwice"] = netInfo
            }else{
                temp["curTwice"] = 0
            }
            if(temp.curTwice >= temp.maxCount){
                table_insert(finish, temp)
            }else{
                table_insert(unfinish, temp)
            }
        }

        for(let k in finish){
            let taskData = finish[k]
            table_insert(unfinish, taskData)
        }

        this.xiYouTaskList = unfinish
    }

    ///-------------获取服务端数据
    getXiyouInfo(){
        return this.xiYouLiLianInfo
    }

    ///-------------获取task列表
    getXiYouTaskList(){
        return this.xiYouTaskList
    }

    getXiYouLiLianPoint(){
        let taskList = this.xiYouLiLianInfo.taskList
        let recvNum = 0
        for(let k in taskList){
            recvNum += taskList[k]
        }

        return recvNum
    }

    ///---------找回
    onRecvFindBackInfo(message){
        this.xiYouFindInfo = []
        let tempConfig = GameConfig.EveryDayLiLianTaskConfig
        // let recvConfig = []
        for(let k in tempConfig){
           let config = tempConfig[k]
           if(config != null){
               let total = config.maxCount
               let backNum = total
               let taskNum = message[k]
               if(taskNum != null){
                   backNum = total - taskNum
               }
               if(backNum != 0 ){
                   config["backNum"] = backNum * config.exp
                   table_insert(this.xiYouFindInfo, config)
               }
           }
        }
        return true
    }

    getFindBackInfo(){
        return this.xiYouFindInfo
    }

    //通关记录
    onRecvRecInfo(info) {
        let actIndex = info.index
        this.passInfo[actIndex] = checkNull(this.passInfo[actIndex], {})
        this.passInfo[actIndex][info.bossIndex] = info.minStageClearForce
        return true
    }
    
    getRecInfo(activityIndex, bossIndex) {
        if (this.passInfo[activityIndex] == null) {
            return null
        }
        return this.passInfo[activityIndex][bossIndex]
    }
    ///////////////////////////////////////////////////////////////////////////////////
    //全民BOSS复活提醒
    onUpdateBossInfo(args) {
        if (args.actIndex != OrdinaryActivityIndex.WorldPlayerBoss) {
            return
        }

        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.WorldPlayerBoss)
        // {
        //         npcList: {[npcIndex]:{refreshTime: 123 否则为0, plrCount: 123 争夺人数, hpPercent: 0.5 boss血量百分比}},
        //         fightCount: 总战斗次数,
        //         refreshTime: 我的次数刷新时间,
        //         remainCount: 我的剩余战斗次数,
        //         remindTimeList: [npcIndex, npcIndex]
        // }

        let remindList = actInfo.remindTimeList || []
        let wnd = WngMrg.getInstance().getWindow("ActivityRemindFrame")
        for (let i = 0; i < remindList.length; i++) {
            let index = remindList[i]
            
            let bossConfig = actInfo.npcList[index]
            if (bossConfig == null) {
                if (this.timerList["globalboss" + index]) {
                    KillTimer(this.timerList["globalboss" + index])
                    delete this.timerList["globalboss" + index]
                }

                wnd.removeListener("golbalboss" + index)
            } else {
                if (bossConfig.refreshTime > GetServerTime()) {                     //复活中
                    if (this.timerList["globalboss" + index] == null) {
                        let endTime = bossConfig.refreshTime
                        let tick = function(delay) {
                            let leftTime = endTime - GetServerTime()
                            if (leftTime >= 0) {
                                
                            } else {
                                this.addRemindListener(index)

                                if (this.timerList["globalboss" + index]) {
                                    KillTimer(this.timerList["globalboss" + index])
                                    delete this.timerList["globalboss" + index]
                                }
                            }
                        }
                        if (!this.timerList["globalboss" + index]) {
                            this.timerList["globalboss" + index] = SetTimer(tick, this, 500, false)
                        }
                    }
                } else {
                    // wnd.removeListener("golbalboss" + index)
                    if (this.timerList["golobalboss" + index] != null) {
                        this.addRemindListener(index)

                        if (this.timerList["globalboss" + index]) {
                            KillTimer(this.timerList["globalboss" + index])
                            delete this.timerList["globalboss" + index]
                        }
                    }
                }
            }
        }
    }

    addRemindListener(index) {
        let wnd = WngMrg.getInstance().getWindow("ActivityRemindFrame")
        let lastTime = GetServerTime()
        let listener: IActivityRemindListener = {
            onCheckRemindShow(): boolean {
                let bossWnd = WngMrg.getInstance().getWindow("BossMainFrame")
                let tabIndex = bossWnd.getCurBossIndex()
                if ((bossWnd.isVisible() == true && tabIndex == 1) || GetServerTime() - lastTime > 5) {
                    if (GetServerTime() - lastTime > 5) {
                        let callback = function() {
                            wnd.removeListener("golbalboss" + index)
                        }
                        DelayEvecuteFunc(0, callback, this)
                    }
                    return false
                }
                return true
            },

            onGetRemindTxt(): string {
                let txt = ""

                let leftTime = GetServerTime() - lastTime
                if (leftTime <= 5 && leftTime >= 0) {
                    let config = GameConfig.BossGlobalConfig[index]
                    if (config) {
                        txt = config.bossName
                    }
                }
                return txt
            },

            onCallback(): void {
                let wnd = WngMrg.getInstance().getWindow("BossMainFrame")
                wnd.showBossFrame(1)
            }
        }

        wnd.addListener("golbalboss" + index, listener, index)
    }

    onHeroInfoUpdate(args) {
        let oldLevel = checkNull(args.oldProperty.level, 0)
        let newLevel = checkNull(args.newProperty.level, 0)
        if (newLevel > oldLevel) {
            let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.WorldPlayerBoss)
            // {
            //         npcList: {[npcIndex]:{refreshTime: 123 否则为0, plrCount: 123 争夺人数, hpPercent: 0.5 boss血量百分比}},
            //         fightCount: 总战斗次数,
            //         refreshTime: 我的次数刷新时间,
            //         remainCount: 我的剩余战斗次数,
            //         remindTimeList: [npcIndex, npcIndex]
            // }
            let checkIndexList = null
            if (actInfo && actInfo.npcList) {
                checkIndexList = table_copy(actInfo.remindTimeList) || []
            }
            
            for (let k in GameConfig.BossGlobalConfig) {
                let v = GameConfig.BossGlobalConfig[k]
                if (v.level > oldLevel && v.level <= newLevel && v.level >= 50) {   //复活提醒，50级以后开启一个默认勾选了一个
                    if (checkIndexList) {
                        table_insert(checkIndexList, v.index)
                    }
                }
            }

            if (checkIndexList) {
                RpcProxy.call("C2G_SetActivityInfo", OrdinaryActivityIndex.WorldPlayerBoss, checkIndexList)
            }
        }
    }
}