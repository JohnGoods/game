/*
作者:
    panjunhua
	
创建时间：
    2015.01.27(星期二) 

意图：
  天空之塔活动

公共接口：
	
*/

class Activity_Champion extends ActivityBase {
    myForce //战力
    myRank //名次

    challengeCount //拥有挑战次数
    refreshTime//下次挑战倒计时

    enemyList //几个对手

    recordList //挑战记录


    registerInfo
    auditinInfo
    roundInfo
    stakeInfo
    public initObj(...args: any[]): void {
        RegisterEvent(EventDefine.UI_SHOW, this.onShowEventFunc, this)
        this.onClear()
    }

    destory() {
        UnRegisterEvent(EventDefine.UI_SHOW, this.onShowEventFunc, this)
    }

    onPrepareResource() {
        this.messageWndHandleIndex =
            {
                ["G2C_WorldOne_CanInsertGame"]: [this.onRegisterInfo, [["ChampionFrame", "updateWnd"]], true],
                ["G2C_WorldOneHaiXuan_Info"]: [this.onAuditionInfo, [["ChampionFrame", "updateWnd"]], true],
                ["G2C_WorldOneSixteenAllInfo"]: [this.onRoundInfo, [["ChampionFrame", "updateWnd"]], true],
                ["G2C_WorldOneBetPlayInfo"]: [this.onStakeInfo, [["ChampionFrame", "updateWnd"], ["PeerlessStakeFrame", "onRefresh"]], true],
            }
    }

    onClear() {
        this.myForce = null//战力
        this.myRank = null//名次
        this.challengeCount = null//拥有挑战次数
        this.refreshTime = null//下次获得挑战次数倒计时
        this.enemyList = null//几个对手

        this.registerInfo = null
        this.auditinInfo = {}
        this.roundInfo = []
        this.stakeInfo = {}
    }

    ////////////////////////////////////////////////////////////////-
    setChampionInfo(info) {
        this.myForce = GetHeroProperty("force") || 0
        this.myRank = info.rank//名次
        this.challengeCount = info.count//剩下多少次
        this.refreshTime = info.time//多长时间后可以再挑战
        this.enemyList = info.list //几个对手	
    }

    getChampionInfo() {
        let info: any = {}
        info.force = this.myForce			//战力
        info.rank = this.myRank				//名次	
        info.count = this.challengeCount	//剩下多少次
        info.time = this.refreshTime		//最多多少次
        info.list = this.enemyList          //对手
        return info
    }

    //竞技场战败处理
    onShowEventFunc(args) {
        // if (args.window.classname == "FightLostFrame") {
        //     if (args.window.getCurFightType() == opFightType.FIGHT_TYPE_CHAMPION) {
        //         let param: any = {}
        //         param.type = "cham"
        //         args.window.addReCallHandler(this, this.quickOutChampoin, param)
        //     }
        // }
    }

    //跳出战斗
    quickOutChampoin(param, showFrameName) {
        //TLog.Debug("Activity_SkyTower.fastEnterStopSkyTower",param.type)
        if (param.type == "cham" && showFrameName == "GemMenuFrame") {
            let wnd = WngMrg.getInstance().getWindow("ChampionFrame")
            wnd.OnClickReturn()
        }
    }

    setFightEndCallBack(message) {
        if (FightSystem.getInstance().isFight()) {
            return FightSystem.getInstance().addEndFightHandler(this.popHighPrizeFrame, this, message)
        } else {
            return this.popHighPrizeFrame(message)
        }
    }

    popHighPrizeFrame(message) {
        let wnd = WngMrg.getInstance().getWindow("ChampionFrame")
        wnd.showWnd()

        wnd = WngMrg.getInstance().getWindow("ChampionHighPrizeFrame")
        wnd.setInfoList(message)
        wnd.showWnd()
    }

    //计算每日奖励
    getDailyPrizeItemList() {
        let rank = this.myRank
        for (let i in GameConfig.ChampionPrizeConfig) {
            let v = GameConfig.ChampionPrizeConfig[i]
            if (rank >= v.rankUp && rank <= v.rankDown) {
                return v
            }
        }
        return null
    }

    //挑战记录
    setChampionRecord(list) {
        this.recordList = list
    }

    getChampionRecord() {
        return this.recordList
    }


    ////////////////-------------------天下第一------------
    //检查是否可以报名
    onRegisterInfo(info) {
        this.registerInfo = info
        if(info == 2){
            RpcProxy.call("C2G_WorldOne_HaixuanInfo")
        }else if (info == 3){
            RpcProxy.call("C2G_WorldOne_SixteenInfo")
        }
        FireEvent(EventDefine.PEERLESS_UPDATE, null)
        return true
    }

    getRegisterInfo() {
        return this.registerInfo
    }

    //海选赛
    onAuditionInfo(info) {
        let tempInfo : any = {}
        tempInfo.player  = this.refreshAuditonPlayer(info.player)
        tempInfo.playerList = []
        let playerList = info.playerList || []

        for(let k in playerList){
            let v = playerList[k]
            let temp : any = {}
            temp.name = v[0]
            temp.serverGroupId = v[1]
            temp.paiming = v[2] * 10
            temp.serverId = v[3]
            table_insert(tempInfo.playerList, temp)
        }
        table_sort(tempInfo.playerList, function(a, b){
            return b.paiming - a.paiming
        })

        for(let k = 0 ; k < size_t(tempInfo.playerList); k++){
            let v = tempInfo.playerList[k]
            v.index = k + 1
        }

        this.auditinInfo = tempInfo
        return true
    }

    getAuditionInfo() {
        return this.auditinInfo
    }

    refreshAuditonPlayer(info){
        if(info == null) return []
        let config = []
        let win = info[0]
        let lost = info[1]
        for (let k in win ){
            let temp : any = {}
            let v = win[k]
            temp.name = v[0]
            temp.videoId = v[1]
            temp.roleId = v[2]
            temp.serverId = v[3]
            temp.serverGroupId = v[4]
            temp.flag = 1
            table_insert(config, temp)
        }

         for (let k in lost ){
            let temp : any = {}
            let v = lost[k]
            temp.name = v[0]
            temp.videoId = v[1]
            temp.roleId = v[2]
            temp.serverId = v[3]
            temp.serverGroupId = v[4]
            temp.flag = 0
            table_insert(config, temp)
        }
        
        table_sort(config, function(a, b){
            return a.name - b.name
        })

        for(let k = 0 ; k < config.length; k++){
            let v = config[k]
            v["index"] = k + 1 
        }

        return config
    }

    //淘汰赛
    onRoundInfo(info) {
        this.roundInfo = []
        for(let k in info){
            let v = info[k]
            let temp : any = {}
            temp.round_12 = v[0]
            temp.round_13 = v[1]
            temp.round_14 = v[2]
            temp.round_15 = v[3]
            temp.id = v [4]
            temp.roundIndex = peerlessOptions.round_sixteen
            for(let k = 0 ; k <= 3; k ++ ){
                let win = v[k]
                if(size_t(win) == 0){
                    break
                }
                temp.roundIndex += 1
            }
            temp.playerInfo = v[6]
            temp.serverId = v[7]
            temp.serverGroupId = v[8]
            temp.index = tonumber(k) + 1

            table_insert(this.roundInfo, temp)
        }

        FireEvent(EventDefine.PEERLESS_UPDATE, null)

        return true
    }

    getRoundInfo() {
        return this.roundInfo
    }


    //玩家下注信息
    onStakeInfo(info){
        this.stakeInfo = info
        FireEvent(EventDefine.PEERLESS_UPDATE, null)
        return true
    }

    getStakeInfo(){
        return this.stakeInfo
    }


    checkIsRegister() {
        let state = this.checkPlayerState()
        return state == 1
    }

    checkPlayerState() {
        //1 -- 可以报名 2 -- 海选 3 --16强 0 -- 过了时间未报名
        let state = this.getRegisterInfo() || 0
        /*if (registerInfo == null) return null
        let osDate = GetServerDate()

        if (registerInfo == 1) {
            state = 1
        } else {
            let hadRegester = getSaveRecord(opSaveRecordKey.WorldOneInsertIndex) || 0
            if (hadRegester == 1) { //已经报名了
                if (osDate.wday == 1 && (osDate.hour >= 20 && osDate.min >= 55)&& osDate.hour < 24) {
                    state = 2
                } else {
                    state = 3
                }
            } else {
                state = 0
            }
        }*/


        return state
    }

    //判断哪个环节
    getNowRound(){
        let info = this.getRoundInfo()
        let round 
        for(let k in info){
            let v = info[k]
            let tempInex = v.roundIndex
            if(round == null || round < tempInex){
                round = tempInex
            }
        }

        return round
    }
}