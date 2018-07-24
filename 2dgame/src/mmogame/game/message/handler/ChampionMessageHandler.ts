class ChampionMessageHandler extends MessageHandler {

    public initObj(...args: any[]): void {
        this.register(opCodes.G2C_FIGHT_CHAMPION_REFRESH, this.onRecvG2C_FIGHT_CHAMPION_REFRESH, this)		//竞技场刷新
        this.register(opCodes.G2C_FIGHT_CHAMPION_TOP_RANK, this.onRecvG2C_FIGHT_CHAMPION_TOP_RANK, this)		//竞技场最高排名
        //this.register(opCodes.G2C_FIGHT_CHAMPION_RECORD, this.onRecvG2C_FIGHT_CHAMPION_RECORD, this)		//竞技场对战记录
        this.register(opCodes.G2C_FIGHT_CHAMPION_REFRESH_EX, this.onRecvG2C_FIGHT_CHAMPION_REFRESH_EX, this)		//竞技场晶石刷新
        this.register(opCodes.G2C_FIGHT_CHAMPION_EX_PRIZE, this.onRecvG2C_FIGHT_CHAMPION_EX_PRIZE, this)		//竞技场排名奖励
    }

    onRecvG2C_FIGHT_CHAMPION_REFRESH(dispatcher, message) {		//竞技场刷新
        let activity = GetActivity(ActivityDefine.Champion)
        activity.setChampionInfo(message)
        FireEvent(EventDefine.CHAMPION_REFRESH, ChampionRefreshEvent.newObj(message.force, message.rank, message.times, message.maxTimes, message.time, message.enemyList))
    }

    onRecvG2C_FIGHT_CHAMPION_TOP_RANK(dispatcher, message) {		//竞技场最高排名
        //FireEvent(EventDefine.CHAMPION_TOP_RANK, ChampionTopRankEvent.newObj(message.enemyList))
    }

    // onRecvG2C_FIGHT_CHAMPION_RECORD(dispatcher, message) {		//竞技场战斗记录
    //     CampaignSystem.getInstance().setChampionRecord(message.championRecordList)
    //     FireEvent(EventDefine.FIGHT_CHAMPION_RECORD, ChampionRecordEvent.newObj(message.championRecordList))
    //     let wnd = WngMrg.getInstance().getWindow("ChampionRecordFrame")
    //     if (wnd.isVisible()) {
    //         wnd.refreshRecodeWindow()
    //     }
    // }

    onRecvG2C_FIGHT_CHAMPION_REFRESH_EX(dispatcher, message) {		//竞技场刷新
        let activity = GetActivity(ActivityDefine.Champion)
        activity.setChampionInfo(message)
        //FireEvent(EventDefine.CHAMPION_REFRESH_EX, ChampionRefreshExEvent.newObj(message.times, message.maxTimes, message.time))
    }

    onRecvG2C_FIGHT_CHAMPION_EX_PRIZE(dispatcher, message) {
        let activity = GetActivity(ActivityDefine.Champion)
        activity.setFightEndCallBack(message)
    }

}
