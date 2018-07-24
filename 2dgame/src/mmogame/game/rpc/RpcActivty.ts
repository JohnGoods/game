// TypeScript file
module RpcLogic {
    // export function G2C_SweepBossActivity(activityIndex, npcIndex, commonPrize) {
    //     let activity = GetActivity(ActivityDefine.Boss)
    //     activity.updateMessageHandler()
    // }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //后台活动管理

    //后台活动开放列表
    export function G2C_SendOpenActivityList(activtList: number[]) {
        ActivitySystem.getInstance().setOperateActivityOpenList(activtList)
        FireEvent(EventDefine.PAY_ACTIVITY_LIST, null);//NetMessageEvent.newObj(message.list))	
    }


    //活动信息
    export function G2C_SendOperateData(index, activityData) {// 1活动索引 2活动数据
        ActivitySystem.getInstance().setOperateActivityInfo(index, activityData)

        FireEvent(EventDefine.PAY_ACTIVITY_INFO, PayActivtyUpdateEvent.newObj(index));//NetMessageEvent.newObj(message.info))
    }


    //活动相关玩家信息
    export function G2C_SendOperatePlayerData(index, plrData) {//1活动索引 2玩家数据
        ActivitySystem.getInstance().setOperatePlayerInfo(index, plrData)
        FireEvent(EventDefine.PAY_ACTIVITY_INFO, PayActivtyUpdateEvent.newObj(index));//NetMessageEvent.newObj(message.info))
    }

    export function G2C_SendOperateAndPlayerData(index, activityData, plrData) {//1活动索引 2活动数据 3玩家数据
        ActivitySystem.getInstance().setOperateActivityInfo(index, activityData)
        ActivitySystem.getInstance().setOperatePlayerInfo(index, plrData)
        FireEvent(EventDefine.PAY_ACTIVITY_INFO, PayActivtyUpdateEvent.newObj(index));//NetMessageEvent.newObj(message.info))
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////


    //Boss
    export function G2C_GetBossActivityInfo(activityIndex, activityData) {
        let activity = GetActivity(ActivityDefine.Boss)
        activity.updateMessageHandler({ index: activityIndex, data: activityData }, "G2C_GetBossActivityInfo")
    }

    export function G2C_GetBossIndexData(activityIndex, npcIndex, bossData) {
        let activity = GetActivity(ActivityDefine.Boss)
        activity.updateMessageHandler({ index: activityIndex, bossIndex: npcIndex, data: bossData }, "G2C_GetBossIndexData")
    }

    export function G2C_GetActivityRank(activityIndex, appendix, rankData) {
        let activity = GetActivity(ActivityDefine.Boss)
        activity.updateMessageHandler({ index: activityIndex, appendix: appendix, data: rankData }, "G2C_GetActivityRank")
    }

    export function G2C_GetBossActivityRecInfo(activityIndex, bossIndex, minStageClearForce) {
        let activity = GetActivity(ActivityDefine.Boss)
        activity.updateMessageHandler({ index: activityIndex, bossIndex: bossIndex, minStageClearForce: minStageClearForce}, "G2C_GetBossActivityRecInfo")
    }

    //护送
    export function G2C_EscortList(message) {
        TLog.Debug("===========G2C_EscortList")
        let activity = GetActivity(ActivityDefine.HuSong)
        activity.updateMessageHandler(message, "G2C_EscortList")
    }

    export function G2C_EnterEscortActivity(macheIndex, time, chengTwice, curPrize, robberRecord, husongTwice, lanjieTwice, isDouble) {  //进入返回 1当前护送索引，2过期时间戳，3橙色护送总次数, 4当前奖励，5被抢记录 6.护送次数,7,拦截次数
        TLog.Debug("===========G2C_EnterEscortActivity")
        let activity = GetActivity(ActivityDefine.HuSong)
        activity.updateMessageHandler({
            index: macheIndex, time: time, chengTwice: chengTwice,
            curPrize: curPrize, robberRecord: robberRecord, husongTwice: husongTwice, lanjieTwice: lanjieTwice, isDouble: isDouble
        }, "G2C_EnterEscortActivity")
    }

    export function G2C_RandEscortIndex(index) {
        TLog.Debug("===========G2C_RandEscortIndex")
        let activity = GetActivity(ActivityDefine.HuSong)
        activity.updateMessageHandler(index, "G2C_RandEscortIndex")
    }

    export function G2C_RobberEscortRecordList(list) {
        TLog.Debug("===========G2C_RobberEscortRecordList")
        let activity = GetActivity(ActivityDefine.HuSong)
        activity.updateMessageHandler(list, "G2C_RobberEscortRecordList")
    }

    export function G2C_PutEscortPrizeInfo(list, isDouble) {
        TLog.Debug("===========G2C_PutEscortPrizeInfo")
        let activity = GetActivity(ActivityDefine.HuSong)
        activity.updateMessageHandler({ robberedList: list, isDouble: isDouble }, "G2C_PutEscortPrizeInfo")
    }


    //-------日常
    export function G2C_ZUDUILILIANW_Info(twice, isVip, state, isDouble, realTwice) {
        TLog.Debug("===========G2C_ZUDUILILIANW_Info")
        let activity = GetActivity(ActivityDefine.Boss)
        activity.updateMessageHandler({ twice: twice, isVip: isVip, state: state, isDouble: isDouble, realTwice: realTwice }, "G2C_ZUDUILILIANW_Info")
    }

    export function G2C_MEIRISANBAI_MonsterNum(huan, state, isVip) {
        TLog.Debug("===========G2C_MEIRISANBAI_MonsterNum")
        let activity = GetActivity(ActivityDefine.Boss)
        activity.updateMessageHandler({ curhuan: huan, state: state, isVip: isVip }, "G2C_MEIRISANBAI_MonsterNum")
    }

    export function G2C_XiyouLilian_Info(level, curexp, force, taskData) { //1,等级  2,经验,  3,战力 4,taskData{type=当前次数}
        TLog.Debug("===========G2C_XiyouLilian_Info")
        let activity = GetActivity(ActivityDefine.Boss)
        activity.updateMessageHandler({ level: level, curexp: curexp, force: force, taskList: taskData }, "G2C_XiyouLilian_Info")
    }

    export function G2C_XiyouLilian_RecordInfo(taskData) {
        TLog.Debug("===========G2C_XiyouLilian_RecordInfo")
        let activity = GetActivity(ActivityDefine.Boss)
        activity.updateMessageHandler(taskData, "G2C_XiyouLilian_RecordInfo")
    }

    //-------月卡信息
    export function G2C_MonthCardInfo(overTime, isGet) {
        PaySystem.getInstance().setMonthCardInfo(overTime, isGet)
        FireEvent(EventDefine.PAY_ACTIVITY_MONTH_CARD, null);
    }

    //-------周卡信息
    export function G2C_WeekCardInfo(overTime, isGet) {
        PaySystem.getInstance().setWeekCardInfo(overTime, isGet)
        FireEvent(EventDefine.PAY_ACTIVITY_WEEK_CARD, null);
    }

    //-------抽奖信息
    export function G2C_OperateLotteryResult(index, info) {
        ActivitySystem.getInstance().setOperateLotteryResultInfo(index, info)
        // let info = {"num" : n, "itemList": t}//月卡
        FireEvent(EventDefine.XUNBAO_UPDATE, null);
    }

    //西游福利
    export function G2C_XiyouWelfareInfo(level, playerInfo) {
        ActivitySystem.getInstance().setXiyouWelfareInfo(level, playerInfo)
        FireEvent(EventDefine.XIYOU_WELFARE, null);
    }

    //结婚判断返回
    export function G2C_CanMarry(_type, name, roleId, roleSex) {
        if (_type == 1) {
            let wnd = WngMrg.getInstance().getWindow("ProposeFrame")
            wnd.onShowAndSetData(name, roleId, roleSex)
        }
    }

    //被求婚的时候返回
    export function G2C_Proposal(marryInfo, _type) {
        let wnd = WngMrg.getInstance().getWindow("ProposingFrame")
        wnd.setAndOpenFrame(marryInfo, _type)
    }

    //结婚响应
    export function G2C_PromiseMarry(playerInfo) {
        //判断两个界面是否存在 存在关闭 SanShengSanShiFrame ProposeFrame
        let wnd = WngMrg.getInstance().getWindow("ProposeFrame")
        if (wnd.isVisible()) {
            wnd.hideWnd()
        }
        let wnd1 = WngMrg.getInstance().getWindow("SanShengSanShiFrame")
        if (wnd1.isVisible()) {
            wnd1.hideWnd()
        }
        //打开 结婚成功界面
        let wnd2 = WngMrg.getInstance().getWindow("MarryTipFrame")
        wnd2.setAndOpenFrame(playerInfo)
    }

    //送礼
    export function G2C_MarryGift(id1, id2, name1, name2) {
        //打开 结婚成功界面
        let wnd = WngMrg.getInstance().getWindow("MarryInformFrame")
        wnd.showAndSetData(id1, id2, name1, name2)
    }

    //房子属性更新--房子属性更新, 房子数据，双方外观，房子加成战力
    export function G2C_HourseUpdate(houseData, playerInfo, power) {
        //打开 结婚成功界面
        ActivitySystem.getInstance().setHouseInfo(houseData, playerInfo, power)
        FireEvent(EventDefine.HOUSE_UPDATE, null);
    }

    //房子进阶成功
    export function G2C_UpdateSuccess(houseData, playerInfo, power) {
        FireEvent(EventDefine.HOUSE_ADVANCE_UPDATE, null);
    }

    //师徒数据
    export function G2C_UpdateShitu(shifuInfo, tudiInfo) {
        //打开 结婚成功界面
        ActivitySystem.getInstance().setShiTuInfo(shifuInfo, tudiInfo)
        FireEvent(EventDefine.SHITU_UPDATE, null);
    }

    //收徒列表
    export function G2C_ShiTuYaoQinList(listInfo) {
        ActivitySystem.getInstance().setShiTuApplyListInfo(listInfo)
        FireEvent(EventDefine.SHITU_APPLY_LIST, null);
    }

    //解锁特效展示 unlockType 0是解锁 1是进阶
    export function G2C_SIMPLECELL_UNLOCKSKIN_INFO(funType, index, unlockType) {
        let wnd = WngMrg.getInstance().getWindow("DeblockingItemFrame");
        let data = { "funType": funType, "index": index, "unlockType": unlockType }
        wnd.onShowAndSetData(data)
    }

    //战斗-活动信息
    export function G2C_SendActivityFightInfo(actIndex, actInfo) {
        FightSystem.getInstance().setFightActivityInfo(actIndex, actInfo)
    }

    //通过ID查看玩家数据
    export function G2C_GetPlayerInfoByID(playerInfo) {
        if (playerInfo.id == 0) {
            MsgSystem.addTagTips(Localize_cns("PLAYER_DETAILS_TXT11"))
            return
        }
        playerInfo.roleId = playerInfo.id   //通用接口不能改
        let wnd = WngMrg.getInstance().getWindow("FriendSDetailsFrame")
        wnd.showAndSetFrame(playerInfo)
    }

    //彩蛋
    export function G2C_SendColorEggInfo(info) {
        let index = info[4]
        if(index != 2){ //不是宠物捕捉的时候
            ItemSystem.getInstance().setEggInfo(info)
        }
        ChannelMrg.getInstance().creatfakeChat()
    }

    //跨服争霸-挖矿
    export function G2C_MineEnterActivity() {
        let activity = GetActivity(ActivityDefine.GlobalMining)
        activity.updateMessageHandler(null, "G2C_MineEnterActivity") 
    }
    


    //天下第一
    export function G2C_WorldOneHaiXuan_Info(playerList, player) {
        let activity = GetActivity(ActivityDefine.Champion)
        activity.updateMessageHandler({playerList : playerList, player : player}, "G2C_WorldOneHaiXuan_Info")
    }

    export function G2C_WorldOneSixteenAllInfo(playerList) {
        let activity = GetActivity(ActivityDefine.Champion)
        activity.updateMessageHandler(playerList, "G2C_WorldOneSixteenAllInfo")
    }

    export function G2C_WorldOne_CanInsertGame(b) {
        let activity = GetActivity(ActivityDefine.Champion)
        activity.updateMessageHandler(b, "G2C_WorldOne_CanInsertGame")
    }

    export function G2C_WorldOneBetPlayInfo(info) {
        let activity = GetActivity(ActivityDefine.Champion)
        activity.updateMessageHandler(info, "G2C_WorldOneBetPlayInfo")
    }
    export function G2C_MineLeaveActivity() {
        let activity = GetActivity(ActivityDefine.GlobalMining)
        activity.updateMessageHandler(null, "G2C_MineLeaveActivity") 
    }
    
    export function G2C_MineActivityInfo(actStage, renPoint, xianPoint, yaoPoint, endTime) {
        let info = {actStage: actStage, renPoint: renPoint, xianPoint: xianPoint, yaoPoint: yaoPoint, endTime: endTime}
        let activity = GetActivity(ActivityDefine.GlobalMining)
        activity.updateMessageHandler(info, "G2C_MineActivityInfo") 
    }

    export function G2C_MinePlrSocre(myPoint) {
        let activity = GetActivity(ActivityDefine.GlobalMining)
        activity.updateMessageHandler(myPoint, "G2C_MinePlrSocre") 
    }
    export function G2C_MineActTeamInfoList(miningInfoList) {
        let activity = GetActivity(ActivityDefine.GlobalMining)
        activity.updateMessageHandler(miningInfoList, "G2C_MineActTeamInfoList") 
    }

    export function G2C_MineActTeamInfo(miningInfo) {
        let activity = GetActivity(ActivityDefine.GlobalMining)
        activity.updateMessageHandler(miningInfo, "G2C_MineActTeamInfo") 
    }

    export function G2C_MineActTeamRelease(actTeamId) {
        let activity = GetActivity(ActivityDefine.GlobalMining)
        activity.updateMessageHandler(actTeamId, "G2C_MineActTeamRelease") 
    }

    
    export function G2C_MineActTeamAdd(miningInfo) {
        let activity = GetActivity(ActivityDefine.GlobalMining)
        activity.updateMessageHandler(miningInfo, "G2C_MineActTeamAdd") 
    }

    export function G2C_MineInfoList(mineInfoList) {
        let activity = GetActivity(ActivityDefine.GlobalMining)
        activity.updateMessageHandler(mineInfoList, "G2C_MineInfoList") 
    }

    export function G2C_MineInfo(mineInfo) {
        let activity = GetActivity(ActivityDefine.GlobalMining)
        activity.updateMessageHandler(mineInfo, "G2C_MineInfo") 
    }

    export function G2C_MinePreActTeamList(actTeamInfoList) {
        let activity = GetActivity(ActivityDefine.GlobalMining)
        activity.updateMessageHandler(actTeamInfoList, "G2C_MinePreActTeamList") 
    }

    export function G2C_MineActTeamDetailInfo(actTeamDetailInfo) {              //自己队伍信息
        let activity = GetActivity(ActivityDefine.GlobalMining)
        activity.updateMessageHandler(actTeamDetailInfo, "G2C_MineActTeamDetailInfo") 
    }

    export function G2C_MineMonthRank(rankList, regionId, groupIndex) {
        let activity = GetActivity(ActivityDefine.GlobalMining)
        activity.updateMessageHandler({rankList: rankList, regionId: regionId, groupIndex: groupIndex}, "G2C_MineMonthRank") 
    }

    //武林大会
    //进入地图后返回
    export function G2C_EnterWuLinMengZhu(actEndTime) {
        //actEndTime 结束时间
        let activity = GetActivity(ActivityDefine.WuLin)
        activity.updateMessageHandler(actEndTime, "G2C_EnterWuLinMengZhu") 
    }

    //离开地图后返回
    export function G2C_LeaveWuLinMengZhu() {
        let activity = GetActivity(ActivityDefine.WuLin)
        activity.updateMessageHandler(null, "G2C_LeaveWuLinMengZhu") 
    }

    //活动排行榜
    export function G2C_WuLinMengZhuRankScore(playerInfo,myInfo) {
        ActivitySystem.getInstance().setWulinRankInfo(playerInfo,myInfo)
        FireEvent(EventDefine.WULIN_RANK_INFO, null);
    }

    //跳转地图 给层数
    export function G2C_WuLinMengZhuJumpMap(level) {
        let activity = GetActivity(ActivityDefine.WuLin)
        activity.updateMessageHandler(level, "G2C_WuLinMengZhuJumpMap") 
        ActivitySystem.getInstance().setWulinLevel(level)
        ActivitySystem.getInstance().setWuLinShowTip(true)
        FireEvent(EventDefine.WULIN_INFO_UPDATE, null);
    }

    //所有层的NPC数据，有数据就是NPC的位置
    export function G2C_WuLinMengZhuNPCData(npcInfo) {
        let activity = GetActivity(ActivityDefine.WuLin)
        activity.updateMessageHandler(npcInfo, "G2C_WuLinMengZhuNPCData") 
    }

    //月排行
    export function G2C_WuLinMengZhuMonthRank(monthRankInfo,myInfo){
        ActivitySystem.getInstance().setWulinMonthRankInfo(monthRankInfo.firstAppear,monthRankInfo.rank,myInfo)
        FireEvent(EventDefine.WULIN_RANK_INFO, null);
    }

    //我的积分信息
    export function G2C_WuLinMengZhuPlayerScore(info){
        ActivitySystem.getInstance().setWulinJinFenInfo(info)
        FireEvent(EventDefine.WULIN_INFO_UPDATE, null);
    }

    //战斗信息返回
    export function G2C_WuLinMengZhuFight(fightRes){
        let creatName = fightRes.creatorName
        let isMyCreat = false     
        let score = fightRes.winSorce
        let creatorRes = fightRes.creatorRes //被挑战的是否成功
        let winOrLoseText = Localize_cns("WULIN_TXT17")
        if(creatorRes == 2){
            winOrLoseText = Localize_cns("WULIN_TXT16")
            score = fightRes.lostSocre
        }

        if(creatName == GetHeroProperty("name")){
            isMyCreat = true
        }else{
            score = fightRes.lostSocre
            if(creatorRes == 2){
                score = fightRes.winSorce
            }
        }

        let content = Localize_cns("WULIN_TXT14")
        let duifangName = fightRes.creatorName
        if(isMyCreat){
            content = Localize_cns("WULIN_TXT15")
            duifangName = fightRes.duiFanName
        }
        let str = String.format(content,duifangName,winOrLoseText,score)
		Chat_AddChannelMsg(channelType.SYSTEM, str) 
    }
    
    //据点
    //进入据点地图
    export function G2C_StrongholdMapEnter() {
        GetActivity(ActivityDefine.Stronghold).start()
    }

    //离开据点地图
    export function G2C_StrongholdMapLeave() {
        GetActivity(ActivityDefine.Stronghold).stop()
    }

    //据点列表
    export function G2C_StrongholdList(list) {
        GetActivity(ActivityDefine.Stronghold).setStrongholdInfoList(list)
    }

    //据点更新
    export function G2C_StrongholdUpdate(info) {
        GetActivity(ActivityDefine.Stronghold).updateStrongholdInfo(info)
    }

    //据点占领返回
    export function G2C_StrongholdRecord(list) {
        GetActivity(ActivityDefine.Stronghold).setStrongholdRecordList(list)
    }

    //据点key信息
    export function G2C_StrongholdKeyInfo(endFlag, clubName, playerName) {
        GetActivity(ActivityDefine.Stronghold).handleStrongholdKeyInfo(endFlag, clubName, playerName)
    }
    
    //据点公会参加人数
    export function G2C_StrongholdFacMemCount(num) {
        GetActivity(ActivityDefine.Stronghold).setClubJoinNum(num)
    }

    //据点boss是否开启，是否可占领
    export function G2C_StrongholdRedpoint(flag1, flag2) {
        GetActivity(ActivityDefine.Stronghold).setBossAndOccupyStatus(flag1, flag2)
    }

    //排行榜
    export function G2C_RoleRank(ranktype, ranklist,firstAppearData) {
         FireEvent(EventDefine.ACTIVITY_RANK_UPDATE, RankListEvent.newObj(ranktype, ranklist, firstAppearData))
    }

    //排行榜外观信息
    export function G2C_RoleRankAppearList(ranktype, appearData) {
        FireEvent(EventDefine.ACTIVITY_RANK_APPEARDATA_UPDATE, RankAppearDataListEvent.newObj(ranktype, appearData))
    }
    
}