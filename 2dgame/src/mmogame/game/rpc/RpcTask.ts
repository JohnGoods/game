// TypeScript file
module RpcLogic {
    export function G2C_TaskList(taskInfoList) {
        for (let i in taskInfoList) {
            let taskInfo = taskInfoList[i]
            let task = Task.newObj(taskInfo)
            TaskSystem.getInstance().addTask(task)
        }
        FireEvent(EventDefine.TASK_UPDATELIST, null)
    }

    export function G2C_TaskAccept(taskInfo) {
        let task = Task.newObj(taskInfo)
        TaskSystem.getInstance().addTask(task)
        FireEvent(EventDefine.TASK_ACCPET, TaskEvent.newObj(taskInfo.taskId))
        FireEvent(EventDefine.TASK_UPDATELIST, null)
    }

    export function G2C_TaskUpdate(taskInfo) {
        let task = Task.newObj(taskInfo)
        TaskSystem.getInstance().updateTask([task])
    }

    export function G2C_TaskFinish(taskId) {
        TaskSystem.getInstance().updateFinishTaskList(taskId)
        TaskSystem.getInstance().removeTask(taskId)

        //CommandManager.getInstance().clear()
        FireEvent(EventDefine.TASK_COMMIT_FINISH, TaskEvent.newObj(taskId))
    }

    //关卡--通关列表
    export function G2C_CampaginRecord(campList) {
        CampaignSystem.getInstance().initFinishCampaignList(campList)
    }

    //关卡--记录
    export function G2C_CurCampaginInfo(campId, mine) {
        CampaignSystem.getInstance().setCampaignInfo(campId, mine)
        FireEvent(EventDefine.CAMPAIGN_MINE, null)
    }

    //关卡--录像信息
    export function G2C_CampaginTongGuanInfo(videoInfo) {
        CampaignSystem.getInstance().setVideoInfo(videoInfo)
        FireEvent(EventDefine.CAMPAIGN_VEDIO, null)
    }

    //个人首通信息返回  1对应字符串 2首通数据
    export function G2C_ExciteData(key, data) {
        if (key == "campaignSingle") {
            CampaignSystem.getInstance().updateLimitPassData(data)
            FireEvent(EventDefine.EXCITE_LIMIT_CAMPAIGN, null)
        } else if (key == "campaignFirst") {
            CampaignSystem.getInstance().updateFirstPassData(data)
            FireEvent(EventDefine.EXCITE_LIMIT_CAMPAIGN, null)
        }
    }

    //返回全服首通数据
    export function G2C_ExciteAllServerFirstCamp(passlist) {
        // CampaignSystem.getInstance().updateServerPassData(passlist)
	 	// FireEvent(EventDefine.TOLLGATE_FIRSTPASS_LIST, null)
    }
}