// TypeScript file

module RpcLogic {
    //个人帮派信息 facId, facName,facPost
    export function G2C_FactionSelfUpdate(facId, facName, facPost) {
        ClubSystem.getInstance().setRoleClubInfo(facId, facName, facPost)
        FireEvent(EventDefine.UPDATE_CLUB_MEINFO, null)
    }

    //帮派信息
    export function G2C_FactionInfoRefresh(factionInfo) {
        ClubSystem.getInstance().setCurClubInfo(factionInfo)
        FireEvent(EventDefine.GET_CLUB_INFO, null)
    }

    //所有帮派信息
    export function G2C_FactionInfoList(FactionInfo: any[]) {
        let list = []
        for (let k = 0; k < FactionInfo.length; k++) {
            let v = FactionInfo[k]
            list.push(v)
        }
        ClubSystem.getInstance().setClubInfoList(list)
        FireEvent(EventDefine.ALL_CLUB_LIST, null)
    }

    //取消申请(不知道为什么要返回一个uint32)
    export function G2C_FactionCancelApply(clubId) {
        // ClubSystem.getInstance().updateApplyList(clubId)
        //FireEvent(EventDefine.UPDATE_APPLY_INFO,null)
    }

    //刷新帮派申请列表
    export function G2C_FactionApplyRefresh(FactionApplyInfo: any[]) {
        let list = []
        for (let k = 0; k < FactionApplyInfo.length; k++) {
            let v = FactionApplyInfo[k]
            list.push(v)
        }

        table_print(list)

        ClubSystem.getInstance().setApplyList(list)

        FireEvent(EventDefine.GET_CLUB_APPLY_LIST, null)
    }

    //帮派公告设置（对内）
    export function G2C_FactionNotice(notice) {
        ClubSystem.getInstance().setNotice(notice)
        FireEvent(EventDefine.UPDATE_CLUB_NOTICE, null)
    }

    //邀请进入帮派，name玩家名(旧的没用到)
    export function G2C_FactionInvite(string1, uint32, string2) {
        //ClubSystem.getInstance().xx()	
        //FireEvent(EventDefine.UPDATE_CLUB_NOTICE, null)
    }

    // //玩家自己的申请信息
    // export function C2G_FactionClearApply(apply_list){
    //     ClubSystem.getInstance().setLegionApplyList(apply_list)
    //     //FireEvent(EventDefine.UPDATE_CLUB_NOTICE, null)
    // }




    //帮派成员信息
    export function G2C_FactionMemberRefresh(FactionMemberInfo: any[]) {
        let list = []
        for (let k = 0; k < FactionMemberInfo.length; k++) {
            let v = FactionMemberInfo[k]
            list.push(v)
        }
        ClubSystem.getInstance().setClubMemberList(list)
        FireEvent(EventDefine.GET_CLUB_MENBER_LIST, null)
    }

    //帮派单个成员信息
    export function G2C_FactionSingleMemberRefresh(factionMemberInfo) {
        ClubSystem.getInstance().updateClubMenberList(factionMemberInfo)
        FireEvent(EventDefine.GET_CLUB_MENBER_LIST, null)
    }

    //更新帮派介绍(里面被我注释了 到时候用到要跟进去)
    export function G2C_FactionIntroduction(strTarget, legionID) {
        ClubSystem.getInstance().onUpdateClubInfo(strTarget, legionID)
        FireEvent(EventDefine.UPDATE_CLUB_INTRO, null)
    }

    //我的申请
    export function G2C_FactionMyApplyList(apply_list) {
        ClubSystem.getInstance().setLegionApplyList(apply_list)
        FireEvent(EventDefine.GET_CLUB_MYAPPLY_LIST, null)
    }



    //刷新上香信息
    export function G2C_FactionRenqiInfo(renqiExp, renqiCount, renqiRecord) { //今日经验,今日上香次数，上香记录
        ClubSystem.getInstance().setClubRenqiInfo(renqiExp, renqiCount, renqiRecord)
        FireEvent(EventDefine.CLUB_RENQI_INFO, null)
    }

    //刷新活跃信息
    export function G2C_FactionPlayerActiveInfo(activeLevel, activeExp, taskData) {
        ClubSystem.getInstance().setClubActiveInfo(activeLevel, activeExp, taskData)
        FireEvent(EventDefine.CLUB_PLAYER_ACTIVE_INFO, null)
    }

    //帮派技能信息
    export function G2C_FactionSkillInfo(level, index, force, list) {
        ClubSystem.getInstance().setClubSkillInfo(level, index, force, list)
        FireEvent(EventDefine.CLUB_SKILL_INFO, null)
    }

    //进入帮会地图
    export function G2C_FactionMapEnter() {
        GetActivity(ActivityDefine.ClubMap).start()
    }

    //离开帮会地图
    export function G2C_FactionMapLeave() {
        GetActivity(ActivityDefine.ClubMap).stop()
    }

    //帮会任务完成次数刷新
    export function G2C_FactionMapTaskFinishOnce(taskType, count) {
        FireEvent(EventDefine.CLUB_TASK_FINISH_REFRESH, ClubTask.newObj(taskType, count))
    }

    //帮会任务领奖返回
    export function G2C_FactionMapTaskPrize(taskType) {
        FireEvent(EventDefine.CLUB_TASK_PRIZE_REFRESH, ClubTask.newObj(taskType))
    }

    //帮会兑换返回
    export function G2C_FactionExchangeItem(array, count, time) {
        GetActivity(ActivityDefine.ClubMap).setExchangeData(array, count, time)
        FireEvent(EventDefine.CLUB_EXCHANGE, null)
    }

    //帮会记录
    export function G2C_FactionRecord(record) {
        ClubSystem.getInstance().setClubEventInfo(record)
        FireEvent(EventDefine.CLUB_EVENT_RECORD, null)
    }

    //帮会仓库
    export function G2C_FactionWareHouseItemList(itemList) {
        ClubSystem.getInstance().setClubStoreItemList(itemList)
        FireEvent(EventDefine.CLUB_REPO_UPDATE, null)
    }

    //帮会仓库记录
    export function G2C_FactionAllocaItemRecord(recordList) {
        ClubSystem.getInstance().setClubPartRecordList(recordList)
        FireEvent(EventDefine.REFRESH_ALLOR_RECORD, null)
    }

    //竞技场
    export function G2C_SendChampionData(rank, list, count, time) {
        let activity = GetActivity(ActivityDefine.Champion)
        let t: any = {}
        t.rank = rank
        t.list = list
        t.count = count
        t.time = time
        activity.setChampionInfo(t)
        FireEvent(EventDefine.CHAMPION_REFRESH, null)
    }

    //竞技场挑战记录
    export function G2C_ChampionRecordData(recordList) {
        let activity = GetActivity(ActivityDefine.Champion)
        activity.setChampionRecord(recordList)

        let wnd = WngMrg.getInstance().getWindow("ChampionRecordFrame")
        if (wnd.isVisible()) {
            wnd.refreshFrame()
        }
    }
}