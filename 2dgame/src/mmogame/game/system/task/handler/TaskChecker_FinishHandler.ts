/*
作者:
    yangguiming
	
创建时间：
   2013.6.28(周五)

意图：
	TaskChecker内部使用
  检查任务完成的处理器，

公共接口：
	_checkSubTaskFinish( task, deal_index){ 
   
*/

module TaskFinishSpace{

function compareMax(task, param) {
	let taskInfo = task.getPropertyInfo()
	let data = taskInfo.data[param]
	let finish = taskInfo.finish[param]
	return data > finish
}

function compareMin(task, param) {
	let taskInfo = task.getPropertyInfo()
	let data = taskInfo.data[param]
	let finish = taskInfo.finish[param]
	return data < finish
}

function compareMaxEqual(task, param) {
	let taskInfo = task.getPropertyInfo()
	let data = taskInfo.data[param]
	let finish = taskInfo.finish[param]
	return data >= finish
}

function compareMinEqual(task, param) {
	let taskInfo = task.getPropertyInfo()
	let data = taskInfo.data[param]
	let finish = taskInfo.finish[param]
	return data <= finish
}

function compareEqual(task, param) {
	let taskInfo = task.getPropertyInfo()
	let data = taskInfo.data[param]
	let finish = taskInfo.finish[param]
	return data == finish
}

export let TaskFinishHandle:any = {
	//服务器判断
	[taskFinishId.R_SKILL_MAX_LV]                   : compareMaxEqual,
	[taskFinishId.R_SKILL_UP_NUM]                   : compareMaxEqual,

	[taskFinishId.R_EQUIP_MAX_NUM]                  : compareMaxEqual,
	[taskFinishId.R_EQUIP_CHANGE_NUM]               : compareMaxEqual,

	[taskFinishId.R_EQ_QH_MAX_LEVEL]                : compareMaxEqual,
	[taskFinishId.R_EQ_QH_MIN_LEVEL]                : compareMaxEqual,
	[taskFinishId.R_EQ_QH_NUM]                      : compareMaxEqual,
	[taskFinishId.R_EQ_JL_MAX_LEVEL]                : compareMaxEqual,
	[taskFinishId.R_EQ_JL_MIN_LEVEL]                : compareMaxEqual,
	[taskFinishId.R_EQ_JL_NUM]                      : compareMaxEqual,
	[taskFinishId.R_EQ_DL_MAX_LEVEL]                : compareMaxEqual,
    [taskFinishId.R_EQ_DL_MIN_LEVEL]                : compareMaxEqual,
	[taskFinishId.R_EQ_DL_NUM]                      : compareMaxEqual,
	[taskFinishId.R_EQ_BS_MAX_LEVEL]                : compareMaxEqual,
	[taskFinishId.R_EQ_BS_MIN_LEVEL]                : compareMaxEqual,
	[taskFinishId.R_EQ_BS_NUM]                      : compareMaxEqual,
	[taskFinishId.R_EQ_MELT_NUM]                    : compareMaxEqual,

    [taskFinishId.ROLE_WORLD_TALK_NUM]              : compareMaxEqual,

    [taskFinishId.CAMPAIGN_ID]						: compareMaxEqual,
    [taskFinishId.CAMPAIGN_NUM]						: compareMaxEqual,
	[taskFinishId.CAMPAIGN_SET_AUTO]                : compareEqual,
	[taskFinishId.ENTRY_MAP]                        : compareMaxEqual,

    [taskFinishId.PET_COUNT]						: compareMaxEqual,
	[taskFinishId.PET_STAGE_STEP_NUM]			    : compareMaxEqual,
	[taskFinishId.PET_STAGE_MAX_LV]			        : compareMaxEqual,

    [taskFinishId.XL_COUNT]			                : compareMaxEqual,
    [taskFinishId.XL_STAGE_STEP_NUM]			    : compareMaxEqual,
	[taskFinishId.XL_STAGE_MAX_LV]			        : compareMaxEqual,

    [taskFinishId.RIDE_STAGE_STEP_NUM]			    : compareMaxEqual,
	[taskFinishId.RIDE_STAGE_LEVEL]			        : compareMaxEqual,
	[taskFinishId.WING_STAGE_STEP_NUM]			    : compareMaxEqual,
	[taskFinishId.WING_STAGE_LEVEL]			        : compareMaxEqual,

	[taskFinishId.TONGLIN_STAGE_STEP_NUM]			: compareMaxEqual,
	[taskFinishId.TONGLIN_STAGE_LEVEL]			    : compareMaxEqual,

    [taskFinishId.SOUHUN_STAGE_STEP_NUM]			: compareMaxEqual,
	[taskFinishId.SOUHUN_STAGE_LEVEL]			    : compareMaxEqual,

	[taskFinishId.FAZHEN_STAGE_STEP_NUM]			: compareMaxEqual,
	[taskFinishId.FAZHEN_STAGE_LEVEL]			    : compareMaxEqual,

	[taskFinishId.XIANWEI_STAGE_STEP_NUM]			: compareMaxEqual,
	[taskFinishId.XIANWEI_STAGE_LEVEL]			    : compareMaxEqual,

    [taskFinishId.TX_STAGE_STEP_NUM]			    : compareMaxEqual,
	[taskFinishId.TX_STAGE_LEVEL]			        : compareMaxEqual,

    [taskFinishId.TXWEAPON_STAGE_STEP_NUM]			: compareMaxEqual,
	[taskFinishId.TXWEAPON_STAGE_LEVEL]			    : compareMaxEqual,

    [taskFinishId.TN_STAGE_STEP_NUM]			    : compareMaxEqual,
	[taskFinishId.TN_STAGE_LEVEL]			        : compareMaxEqual,

    [taskFinishId.TNXIANQI_STAGE_STEP_NUM]			: compareMaxEqual,
	[taskFinishId.TNXIANQI_STAGE_LEVEL]			    : compareMaxEqual,

    [taskFinishId.TNHUANIAN_STAGE_STEP_NUM]			: compareMaxEqual,
	[taskFinishId.TNHUANIAN_STAGE_LEVEL]			: compareMaxEqual,

    [taskFinishId.TNLINGQI_STAGE_STEP_NUM]			: compareMaxEqual,
	[taskFinishId.TNLINGQI_STAGE_LEVEL]			    : compareMaxEqual,

	[taskFinishId.ROLE_MAX_LEVEL]			        : compareMaxEqual,
	[taskFinishId.ROLE_LEVEl_NUM]			        : compareMaxEqual,
	[taskFinishId.COPY_PERSON_COUNT]			    : compareMaxEqual,
	[taskFinishId.COPY_PERSON_NUM]			        : compareMaxEqual,
	[taskFinishId.COPY_DRAGON_LEVEL]			    : compareMaxEqual,
	[taskFinishId.COPY_DRAGON_MAX]			        : compareMaxEqual,
	[taskFinishId.COPY_DRAGON_NUM]			        : compareMaxEqual,
	[taskFinishId.COPY_DRAGON_START_NUM]	        : compareMaxEqual,
	[taskFinishId.COPY_DRAGON_START_PRIZE]		    : compareMaxEqual,
	[taskFinishId.COPY_MATERIAL_COUNT]		    	: compareMaxEqual,
	[taskFinishId.COPY_MATERIAL_NUM]			    : compareMaxEqual,
	[taskFinishId.COPY_ZHONGKUI_COUNT]			    : compareMaxEqual,
	[taskFinishId.COPY_ZHONGKUI_NUM]			    : compareMaxEqual,
	[taskFinishId.COPY_THUNDER_MAX]			        : compareMaxEqual,
	[taskFinishId.COPY_THUNDER_NUM]			        : compareMaxEqual,
	[taskFinishId.COPY_TEAM_COMBAT_NUM]             : compareMaxEqual,
	[taskFinishId.CHAMPION_NUM]                     : compareMaxEqual,
}

}



// function finishLevel(task, param){//完成等级要求
// 	let taskInfo = task.getPropertyInfo()
// 	return GetHero().getProperty("level") >= taskInfo.finish[taskField.FIELD_FINISH_LEVEL]
// }


// function findNpc(task, param){
// 	let taskInfo = task.getPropertyInfo()
	
// 	let count = 0
// 	let isFinish = false
// 	if(taskInfo && taskInfo.data && taskInfo.data[taskField.FIELD_FINISH_FINDNPC] ){
// 		//TLog.Debug(taskInfo.data[taskField.FIELD_FINISH_FINDNPC])
// 		let flag = taskInfo.finish[taskField.FIELD_FINISH_FINDNPC]["isonebyone"] || false
// 		if(flag ){
// 			for(let k = 0; k < param.length; k++){
// 			let v = param[k]
	
// 				if(taskInfo.data[taskField.FIELD_FINISH_FINDNPC][k] && taskInfo.data[taskField.FIELD_FINISH_FINDNPC][k] == v ){ 
// 					isFinish = true
// 				}else{
// 					isFinish = false
// 					break
// 				}
// 			}
// 		}else{	
// 			for(let k in taskInfo.data[taskField.FIELD_FINISH_FINDNPC]){
// 			let v = taskInfo.data[taskField.FIELD_FINISH_FINDNPC][k]
	
// 				for(let s in param){
// 			let t = param[s]
	
// 					if(v == t ){ count = count + 1 }
// 				}
// 			}
// 			if(count >= param.length ){ return true }
// 		}
// 	}
	
// 	if(taskInfo.finish[taskField.FIELD_FINISH_FINDNPC_ONLYONE] && count > 0 ){ return true } //如果是找到其中一个NPC即可的，就成功了
	
// 	return isFinish
// }

// function fightWin(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	//TLog.Debug("fightWin", param)
// 	if(param == taskInfo.data[taskField.FIELD_FINISH_FIGHTWIN] ){
// 		return true
// 	}
// 	return false
// }


// function wearWeapon(task, param){
// 	//TLog.Debug("wearWeapon", param, role.weapon )
// 	if(GetHeroProperty("weapon") != 0 ){
// 		return true
// 	}
// 	return false
// }

// function collectItem(task, param){

// 	let next = function (obj) {
// 		for (let k in obj) {
// 			return [k, obj[k]]
// 		}

// 		return [null, null]
// 	}

// 	let taskInfo = task.getPropertyInfo()
	
// 	let count = 0
// 	let pcount = 0
	
// 	let ret = false
// 	if(param ){
// 		let [itemId] = next(param)
// 		if(GameConfig.itemConfig[itemId] ){
// 			if(GameConfig.itemConfig[itemId].type != opItemType.ITEM_TYPE_TASK ){  //不是任务物品
// 				if(taskInfo.data[taskField.FIELD_FINISH_GIVE_RES] ){ 
// 					ret = true
// 				}
// 			}
// 		}
// 	}
// 	//TLog.Debug("================", ret, taskInfo.data[taskField.FIELD_FINISH_GIVE_RES])
// 	if(ret ){ return true }
	
// 	if(taskInfo.data == null || taskInfo.finish == null ){
// 		return false
// 	}
	
// 	for(let k in param){
// 			let v = param[k]
	
// 		//TLog.Debug(k, v)
// 		pcount = pcount + 1
// 		if(taskInfo.data[taskField.FIELD_FINISH_COLLECTITEM] ){
// 			for(let s in taskInfo.data[taskField.FIELD_FINISH_COLLECTITEM]){
// 			let t = taskInfo.data[taskField.FIELD_FINISH_COLLECTITEM][s]
	
// 				//TLog.Debug(s, t)
// 				if(k == s && t >= v ){ count = count + 1 }
// 			}
// 		}
// 	}
	
// 	let anyItemCount = taskInfo.finish[taskField.FIELD_FINISH_COLLECTITEM_ONLYONE]
// 	if(anyItemCount &&  count >= anyItemCount ){ return true } //如果是找到其中一个物品即可的，就成功了
	
// 	if(count >= pcount ){ return true }
	
// 	return false
// }

// function killMonster(task, param){
// 	//TLog.Debug("killMonster", param)
// 	let taskInfo = task.getPropertyInfo()
// 	let count = 0
// 	let pcount = 0
// 	for(let k in param){
// 			let v = param[k]
	
// 		pcount = pcount + 1
// 		if(taskInfo.data[ClientTaskField.FIELD_FINISH_KILL_MONSTER] ){
// 			for(let s in taskInfo.data[ClientTaskField.FIELD_FINISH_KILL_MONSTER]){
// 			let t = taskInfo.data[taskField.FIELD_FINISH_KILLMONSTER][s]
	
// 				if(k == s && t >= v ){ count = count + 1 }
// 			}
// 		}
// 	}
// 	if(count >= pcount ){ return true }
// 	return false
// }

// function collectPet(task, param){
// 	let taskInfo = task.getPropertyInfo()
	
// 	let ret = false
// 	if(taskInfo.data[taskField.FIELD_FINISH_GIVE_PET] ){ 
// 		ret = true
// 	}
// 	if(ret ){ return true }
// 	//TLog.Debug("collectPet", param)
// 	let count = 0
// 	let pcount = 0
// 	for(let k in param){
// 			let v = param[k]
	
// 		pcount = pcount + 1
// 		if(taskInfo.data[taskField.FIELD_FINISH_COLLECTPET] ){
// 			for(let s in taskInfo.data[taskField.FIELD_FINISH_COLLECTPET]){
// 			let t = taskInfo.data[taskField.FIELD_FINISH_COLLECTPET][s]
	
// 				if(k == s && t >= v ){ count = count + 1 }
// 			}
// 		}
// 	}
	
// 	if(taskInfo.finish[taskField.FIELD_FINISH_COLLECTPET_ONLYONE] ){ //收集一个宠物即可
// 		return count >= 1
// 	}
	
// 	if(count >= pcount ){ return true }
// 	return false
// }

// //根据门派查找NPCID
// function findNpcBySchool(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let npcId = 0
// //TLog.Debug("findNpcBySchool", taskInfo.data[taskField.FIELD_FINISH_FINDNPC_SCHOOL])	
// 	if(taskInfo.data[taskField.FIELD_FINISH_FINDNPC_SCHOOL] ){
// 		npcId = taskInfo.data[taskField.FIELD_FINISH_FINDNPC_SCHOOL]
// 	}
		
// 	return 	npcId == param[GetHeroProperty("school")]
// }


// function arrivePosition(task, param){ //达到目标点
// 	let taskInfo = task.getPropertyInfo()
	
// 	if(param == true ){
// 		param = taskInfo.finish[taskField.FIELD_FINISH_ARRIVE_POSITION]
// 	}
	
// 	if(taskInfo && taskInfo.data[taskField.FIELD_FINISH_ARRIVE_POSITION] ){
// 		return taskInfo.data[taskField.FIELD_FINISH_ARRIVE_POSITION] == param //是否达到某地点了
// 	}
// 	return false
// }

// function formattionLearn(task, param){ //学习阵法
// 	return GetHeroProperty("lineup")[param] == true
// }

// //屏蔽玩家
// let finishHidePlayerTask = false
// function hidePlayers(task, param){
// 	//if(! finishHidePlayerTask &&  actor_system.player_visible == false ){
// 	//	finishHidePlayerTask = true
// 	//}
// 	//return finishHidePlayerTask
// 	return true
// }


// function patrolFight(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let Info = taskInfo.finish[taskField.FIELD_FINISH_PVE_COUNT]
// 	if(taskInfo.data[taskField.FIELD_FINISH_PVE_COUNT] && taskInfo.data[taskField.FIELD_FINISH_PVE_COUNT] == Info[2] ){
// 		return true
// 	}
// 	return false	
// }

// function fightSchoolNpc(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	if(taskInfo.data[taskField.FIELD_FINISH_PVE_SCHOOL] && taskInfo.data[taskField.FIELD_FINISH_PVE_SCHOOL] == taskInfo.finish[taskField.FIELD_FINISH_PVE_SCHOOL] ){
// 		return true
// 	}
// 	return false	
// }

// function killNpcMonster(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	if(taskInfo.data[taskField.FIELD_FINISH_KILL_NPC_MONSTER] ){
// 		return true
// 	}
// 	return false
// }


// function killMapMonster(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let finishInfo = taskInfo.finish[taskField.FIELD_FINISH_KILL_MAP_MONSTER]
// 	if(finishInfo ){
// 		let dataCount = taskInfo.data[taskField.FIELD_FINISH_KILL_MAP_MONSTER]
// 		if(dataCount && dataCount == finishInfo[3] ){
// 			return true
// 		}
// 	}
	
// 	return false
// }

// function schoolTask(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	if(taskInfo.data[taskField.FIELD_FINISH_SCHOOL_TASK] && taskInfo.data[taskField.FIELD_FINISH_SCHOOL_TASK] == param ){
// 		return true
// 	}
	
// 	return false
// }

// function winMapFightCount(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let finishInfo = taskInfo.finish[taskField.FIELD_FINISH_FIGHT_MAP_COUNT]
// 	if(finishInfo ){
// 		let dataCount = taskInfo.data[taskField.FIELD_FINISH_FIGHT_MAP_COUNT]
// 		if(dataCount && dataCount >= finishInfo[3] ){
// 			return true
// 		}
// 	}
	
// 	return false
// }

// function killBoss(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	if(taskInfo && taskInfo.data && taskInfo.data[taskField.FIELD_FINISH_KILL_BOSS] == param ){
// 		return true
// 	}
// 	return false	
// }

// function unvisibleArrivePoint(task, param){
// 	let taskInfo = task.getPropertyInfo()
	
// 	if(taskInfo.data && taskInfo.data[taskField.FIELD_FINISH_ARRIVE_POINT] ){
// 		return taskInfo.data[taskField.FIELD_FINISH_ARRIVE_POINT] == param
// 		//return true
// 	}
// 	return false	
// }

// function advanceSchool(task, param){
// 	let taskInfo = task.getPropertyInfo()
	
// 	if(taskInfo && taskInfo.finish ){
// 		let targetType = taskInfo.finish[taskField.FIELD_FINISH_ADVANCE_SCHOOL]
// 		return RoleSystem.getInstance().GetAdvSchoolType() >= targetType
// 	}	

// 	return false	
// }


// function checkHasApplyEnergy(task, param){ //是否领取精力点
// 	return getSaveRecord(opSaveRecordKey.applyGinger) != null
// }


// function checkTimePassFinish(task, param){
// 	if(task.isFailed() ){
// 		return false
// 	}
	
// 	return ! task.isInTime()
// 	//if(task_system.isTaskFailed(taskInfo.taskId) ){
// 	//	return false
// 	//}
// 	//return ! task_system.check_in_task_time(taskInfo.taskId) //超过任务时间，就成功
// }


// function checkCangbaoTu(task, param){//藏宝图，不会完成的，只会提交
// 	return false
// }

// function submitItem(task, param){//暂不处理
// 	return true															
// }

// function submitPet(task, param){//暂不处理
// 	return true
// }

// function arriveNpcPosition(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	if(! taskInfo.data[taskField.FIELD_FINISH_ARRIVE_NPC] ){
// 		return false
// 	}else{
// 		return taskInfo.data[taskField.FIELD_FINISH_ARRIVE_NPC] == taskInfo.finish[taskField.FIELD_FINISH_ARRIVE_NPC]
// 	}
// }

// function joinSchool(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let isFinish = taskInfo.data[taskField.FIELD_FINISH_JOINSCHOOL] != null && true || false
	
// 	return isFinish
// }

// function gatherItem(task, param){
// 	let taskInfo = task.getPropertyInfo()
	
// 	let entryId = taskInfo.finish[taskField.FIELD_FINISH_FINDNPC_COUNT][0]
// 	let count = taskInfo.finish[taskField.FIELD_FINISH_FINDNPC_COUNT][1]
// 	let curCount = taskInfo.data[taskField.FIELD_FINISH_FINDNPC_COUNT] == null && 0 || taskInfo.data[taskField.FIELD_FINISH_FINDNPC_COUNT][entryId]
	
// 	return curCount >= count
// }

// function fightWinNpc(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let isFinish = taskInfo.data["FIGHTWIN_NPC"] != null && true || false
	
// 	return isFinish
// }

// function answerTheQue(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let dataList = taskInfo.data
	
// 	if(dataList["FEIXINGQ_QUESTION"] ){
// 		return true
// 	}else{
// 		return false
// 	}
// }

// function finishTypeCount(task, param){
// 	let taskInfo = task.getPropertyInfo()
	
// 	let taskType = taskInfo.finish["TASK_TYPE_COUNT"][0]
// 	let count = taskInfo.finish["TASK_TYPE_COUNT"][1]
	
// 	let dataCount = taskInfo.data["TASK_TYPE_COUNT"] && taskInfo.data["TASK_TYPE_COUNT"] || 0
	
// 	return dataCount >= count
// }

// function answerQuestionCommon(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let dataList = taskInfo.data
	
// 	if(dataList["QUESTION"] ){
// 		return true
// 	}else{
// 		return false
// 	}
// }

// function preyMine(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let finishList = taskInfo.finish
// 	let dataList = taskInfo.data
	
// 	let needCount = finishList[ClientTaskField.FIELD_FINISH_KUANGDONG]
// 	let curCount = dataList[ClientTaskField.FIELD_FINISH_KUANGDONG] || 0
	
// 	return curCount >= needCount
// }

// function passSkyTower(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let finishList = taskInfo.finish
// 	let dataList = taskInfo.data
	
// 	let needLayer = finishList[ClientTaskField.FIELD_FINISH_TIANKONGZHITA]
// 	let curLayer = dataList[ClientTaskField.FIELD_FINISH_TIANKONGZHITA] || 0
	
// 	return curLayer >= needLayer
// }

// function passCampRepeat(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let finishList = taskInfo.finish
// 	let dataList = taskInfo.data
	
// 	let campaignId = param[0]
// 	let needNum = param[1]
// 	let curNum = 0
// 	if(dataList[ClientTaskField.FIELD_FINISH_DUOCITONGGUAN] ){
// 		curNum = dataList[ClientTaskField.FIELD_FINISH_DUOCITONGGUAN][1] || 0
// 	}
	
// 	return curNum >= needNum
// }

// function changeModel(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let finishList = taskInfo.finish
// 	let dataList = taskInfo.data
	
// 	return dataList[ClientTaskField.FIELD_FINISH_HUANXINGXIANG] != null
// }

// function sendMessage(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let needNum = param
// 	let curNum = taskInfo.data[ClientTaskField.FIELD_FINISH_FAXIAOXI] || 0
	
// 	return curNum >= needNum
// }

// function makeEquip(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let finishList = taskInfo.finish
// 	let dataList = taskInfo.data
	
// 	return dataList[ClientTaskField.FIELD_FINISH_DAZAOJIPIN] != null
// }

// function collectAllItem(task, param){
// 	let taskInfo = task.getPropertyInfo()
	
// 	let count = 0
// 	let pcount = 0
	
// 	let ret = false
// 	if(taskInfo.data[taskField.FIELD_FINISH_GIVE_RES] ){ 
// 		ret = true
// 	}
// 	//TLog.Debug("================", ret, taskInfo.data[taskField.FIELD_FINISH_GIVE_RES])
// 	if(ret ){ return true }
	
// 	if(taskInfo.data == null || taskInfo.finish == null ){
// 		return false
// 	}
	
// 	for(let k in param){
// 			let v = param[k]
	
// 		//TLog.Debug(k, v)
// 		pcount = pcount + 1
// 		if(taskInfo.data[ClientTaskField.FIELD_FINISH_COLLECTITEM] ){
// 			for(let s in taskInfo.data[ClientTaskField.FIELD_FINISH_COLLECTITEM]){
// 			let t = taskInfo.data[ClientTaskField.FIELD_FINISH_COLLECTITEM][s]
	
// 				//TLog.Debug(s, t)
// 				if(k == s && t >= v ){ count = count + 1 }
// 			}
// 		}
// 	}
	
// 	ret = count >= pcount
	
// 	return ret
// }

// function fightDynamicNpc(task, param){
// 	let taskInfo = task.getPropertyInfo()
// 	let isFinish = taskInfo.data[ClientTaskField.FIELD_FINISH_FIGHTDYNAMICNPC] != null && true || false
	
// 	return isFinish
// }

// function shouldFinish(task, param){
// 	return true
// }

// function collectItemFinish(task, param){
// 	return true
// }

// function notRightItemFinish(task, param){
// 	return true
// }

// function equipEnhance(task, param){
// 	//5件装备强化等级>=3										={5,3}
// 	let needCount = param[0] || 0
// 	let needLevel = param[1] || 0
	
// 	let taskInfo = task.getPropertyInfo()
// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_EQUIP_ENHANCE] || {}
// 	let count = data[0] || 0
// 	let level = data[1] || 0
	
// 	return count >= needCount && level >= needLevel
// }

// function playerLevel(task, param){
// 	//主角等级>=20级												=20
// 	let needLevel = param || 0
// 	let taskInfo = task.getPropertyInfo()
// 	let level = taskInfo.data[ClientTaskField.FIELD_FINISH_PLR_LEVEL] || GetHeroProperty("level") || 0
	
// 	return level >= needLevel
// }

// function petLevel(task, param){
// 	//3个伙伴等级>=20级											={3,20}
// 	let needCount = param[0] || 0
// 	let needLevel = param[1] || 0
	
// 	let taskInfo = task.getPropertyInfo()
// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_PET_LEVEL] || {}
// 	let count = data[0] || 0
// 	let level = data[1] || 0
	
// 	return count >= needCount && level >= needLevel
// }

// function petLottery(task, param){
// 	//祭台抽奖>=10次												=10,
// 	let needCount = param || 0
// 	let taskInfo = task.getPropertyInfo()
// 	let count = taskInfo.data[ClientTaskField.FIELD_FINISH_PET_LOTTERY] || 0
	
// 	return count >= needCount
// }

// function equipOn(task, param){
// 	//所有伙伴+主角穿戴>=10件>=2阶装备			={10,2}
// 	let needCount = param[0] || 0
// 	let needLevel = param[1] || 0
	
// 	let taskInfo = task.getPropertyInfo()
// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_EQUIP_ON] || {}
// 	let count = data[0] || 0
// 	let level = data[1] || 0
	
// 	return count >= needCount && level >= needLevel
// }

// function skyTower(task, param){
// 	//地宫层数>=20													=20
// 	let needLayer = param || 0
// 	let taskInfo = task.getPropertyInfo()
// 	let layer = taskInfo.data[ClientTaskField.FIELD_FINISH_SKY_TOWER] || 0
	
// 	return layer >= needLayer
// }

// function championRank(task, param){
// 	//进入竞技场前5000名									  =5000
// 	let needRank = param || 0
// 	let taskInfo = task.getPropertyInfo()
// 	let rank = taskInfo.data[ClientTaskField.FIELD_FINISH_CHAMPION] || 0
	
// 	return rank <= needRank
// }

// function allAwakeLevel(task, param){
// 	//>=3个(主角+伙伴)进阶等级>=2						={3,2}
// 	let needCount = param[1] || 0
// 	let needLevel = param[0] || 0
	
// 	let taskInfo = task.getPropertyInfo()
// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_AWAKE_LEVEL] || {}
// 	let count = data[1] || 0
// 	let level = data[0] || 0
	
// 	return count >= needCount && level >= needLevel
// }

// function allBreakLevel(task, param){
// 	//>=3个(主角+伙伴)蜕变等级>=2						={3,2}
// 	let needEntryId = param[0] || 0
// 	let needLevel = param[1] || 0
	
// 	let taskInfo = task.getPropertyInfo()
// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_BREAK_LEVEL] || {}
// 	let entryId = data[0] || 0
// 	let level = data[1] || 0
	
// 	if(needEntryId != entryId ){
// 		return false
// 	}
	
// 	return level >= needLevel
// }

// function wingLevel(task, param){
// 	//守护等级>=3级													=3
// 	let needLevel = param || 0
// 	let taskInfo = task.getPropertyInfo()
// 	let level = taskInfo.data[ClientTaskField.FIELD_FINISH_WING_LEVEL] || 0
	
// 	return level >= needLevel
// }

// function wudongCount(task, param){
// 	let needCount = param[1] || 0
	
// 	let taskInfo = task.getPropertyInfo()
// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_WUDONG_COUNT] || {}
// 	let count = data[1] || 0
	
// 	return count >= needCount
// }

// function useRobberSkill(task, param){
// 	let skillId = param[0] || 0
// 	let needCount = param[1] || 0
	
// 	let taskInfo = task.getPropertyInfo()
// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_ROBBER_SKILL] || {}
// 	let dSkillId = checkNull(data[0] , -1)
// 	let count = data[1] || 0
	
// 	if(skillId != dSkillId ){
// 		return false
// 	}
	
// 	return count >= needCount
// }

// function unlockVocation(task, param){
// 	let needCount = param[1] || 0
	
// 	let taskInfo = task.getPropertyInfo()
// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_UNLOCK_VOCATION] || {}
// 	let count = data[1] || 0
	
// 	return count >= needCount
// }

// function gainFeellingGift(task, param){
// 	let needCount = param || 0
	
// 	let taskInfo = task.getPropertyInfo()
// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_FEEL_GIFT]
// 	let count = data || 0
	
// 	return count >= needCount
// }

// function holdReliceMine(task, param){
// 	let needCount = param || 0
	
// 	let taskInfo = task.getPropertyInfo()
// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_RELICE_MINE]
// 	let count = data || 0
	
// 	return count >= needCount
// }

// function holdWingSkill(task, param){
// 	let needCount = param || 0
	
// 	let taskInfo = task.getPropertyInfo()
// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_WING_SKILL_COUNT]
// 	let count = data || 0
	
// 	return count >= needCount
// }

// function changeKillMonster(task, param){
// 	let needCount = param[1] || 0
	
// 	let taskInfo = task.getPropertyInfo()
// 	let data = taskInfo.data[ClientTaskField.FIELD_FINISH_CHANG_KILL_MONSTER] || {}
// 	let count = data[1] || 0
	
// 	return count >= needCount
// }

	// [taskField.FIELD_FINISH_KILLMONSTER] : killNpcMonster,
	// [taskField.FIELD_FINISH_LEVEL] : finishLevel,
	// [taskField.FIELD_FINISH_FINDNPC] : findNpc,
	// //[taskField.FIELD_FINISH_FIGHT_SKILL_LEVEL] : fightSkillLevel,
	// [taskField.FIELD_FINISH_FIGHTWIN] : fightWin,
	// [taskField.FIELD_FINISH_WEARWEAPON] : wearWeapon,
	// [taskField.FIELD_FINISH_COLLECTITEM] : collectItem,
	// [taskField.FIELD_FINISH_COLLECTPET] : collectPet,
	// [taskField.FIELD_FINISH_FINDNPC_SCHOOL ] : findNpcBySchool,
	// // [taskField.FIELD_FINISH_LIVING_SKILL_LEVEL ] : anylivingSkill,
	// // [taskField.FIELD_FINISH_COLLECT_TYPE_ITEM ] : anyItemRecipe,
	// [taskField.FIELD_FINISH_ARRIVE_POSITION] : arrivePosition,
	// [taskField.FIELD_FINISH_FORMATION_LEARN] : formattionLearn,
	// // [taskField.FIELD_FINISH_SEND_CHANNEL_MSG] : sendChannel,
	// [taskField.FIELD_FINISH_SEND_FILTER_PLAYER] : hidePlayers,
	
	// [taskField.FIELD_FINISH_PVE_COUNT] : patrolFight,
	// [taskField.FIELD_FINISH_PVE_SCHOOL] : fightSchoolNpc,
	// [taskField.FIELD_FINISH_KILL_NPC_MONSTER] : killNpcMonster,
	// [taskField.FIELD_FINISH_KILL_MAP_MONSTER] : killMapMonster,
	// [taskField.FIELD_FINISH_SCHOOL_TASK] : schoolTask,
	// [taskField.FIELD_FINISH_FIGHT_MAP_COUNT] : winMapFightCount,
	// // [taskField.FIELD_FINISH_CHANGE_SUIT] : changeSuit,
	// //[taskField.FIELD_FINISH_QUXIE_COUNT] : quXieCount,
	// [taskField.FIELD_FINISH_KILL_BOSS] : killBoss,
	// [taskField.FIELD_FINISH_ARRIVE_POINT] : unvisibleArrivePoint,
	// [taskField.FIELD_FINISH_ADVANCE_SCHOOL] : advanceSchool,
	// [taskField.FIELD_FINISH_GINGER] : checkHasApplyEnergy,
	// [taskField.FIELD_FINISH_TIME] : checkTimePassFinish,
	// [taskField.FIELD_FINISH_CANGBAOTU] : checkCangbaoTu,
	
	// [taskField.FIELD_FINISH_GIVE_RES] : submitItem,
	// [taskField.FIELD_FINISH_GIVE_PET] : submitPet,
	// [taskField.FIELD_FINISH_ARRIVE_NPC] : arriveNpcPosition,
	// [taskField.FIELD_FINISH_JOINSCHOOL] : joinSchool,
	// [taskField.FIELD_FINISH_FINDNPC_COUNT] : gatherItem,
	
	// //字符串
	// ["FIGHTWIN_NPC"] 				: fightWinNpc, 
	// ["FEIXINGQ_QUESTION"] 	: answerTheQue,
	// ["TASK_TYPE_COUNT"] 		: finishTypeCount,
	// ["QUESTION"]						: answerQuestionCommon,
	
	// [ClientTaskField.FIELD_FINISH_KUANGDONG] : preyMine,
	// [ClientTaskField.FIELD_FINISH_TIANKONGZHITA] : passSkyTower,
	// [ClientTaskField.FIELD_FINISH_DUOCITONGGUAN] : passCampRepeat,
	// [ClientTaskField.FIELD_FINISH_HUANXINGXIANG] : changeModel,
	// [ClientTaskField.FIELD_FINISH_FAXIAOXI]			 : sendMessage,
	// [ClientTaskField.FIELD_FINISH_DAZAOJIPIN]		 : makeEquip,
	// [ClientTaskField.FIELD_FINISH_COLLECTITEM]	 : collectAllItem,
	// [ClientTaskField.FIELD_FINISH_FIGHTDYNAMICNPC]		: fightDynamicNpc,
	// [ClientTaskField.FIELD_FINISH_KILL_MONSTER]		: killMonster,
	// [ClientTaskField.FIELD_FINISH_EQUIP_ENHANCE] 	: equipEnhance,
	// [ClientTaskField.FIELD_FINISH_PLR_LEVEL]			: playerLevel,
	// [ClientTaskField.FIELD_FINISH_PET_LEVEL]			: petLevel,
	// [ClientTaskField.FIELD_FINISH_PET_LOTTERY]		: petLottery,
	// [ClientTaskField.FIELD_FINISH_EQUIP_ON]				: equipOn,
	// [ClientTaskField.FIELD_FINISH_SKY_TOWER]			: skyTower,
	// [ClientTaskField.FIELD_FINISH_CHAMPION]			  : championRank,
	// [ClientTaskField.FIELD_FINISH_AWAKE_LEVEL]		: allAwakeLevel,
	// [ClientTaskField.FIELD_FINISH_BREAK_LEVEL]		: allBreakLevel,
	// [ClientTaskField.FIELD_FINISH_WING_LEVEL]			: wingLevel,
	// [ClientTaskField.FIELD_FINISH_WUDONG_COUNT]		: wudongCount,
	// [ClientTaskField.FIELD_FINISH_ROBBER_SKILL]		: useRobberSkill,
	// [ClientTaskField.FIELD_FINISH_UNLOCK_VOCATION]: unlockVocation,
	// [ClientTaskField.FIELD_FINISH_FEEL_GIFT]			: gainFeellingGift,
	// [ClientTaskField.FIELD_FINISH_RELICE_MINE]		: holdReliceMine,
	// [ClientTaskField.FIELD_FINISH_WING_SKILL_COUNT]			: holdWingSkill,
	// [ClientTaskField.FIELD_FINISH_CHANG_KILL_MONSTER]		: changeKillMonster,

	
	// //亲密度任务//选项提交完成
	// ["SUCCESS"]             : shouldFinish,
	// ["COLLECTITEM"]         : collectItemFinish,
	// ["FIND_NPC"]            : findNpc,
	// ["NOTRIGHTITEM"]        : notRightItemFinish,
	// ["AFTER_FIGHT"]         : shouldFinish,
	// ["BATTLE"]              : shouldFinish,