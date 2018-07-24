/*
作者:
    yangguiming
	
创建时间：
   2013.7.10(周三)

意图：
   战斗系统消息处理

公共接口：
   
*/


class FightMessageHandler extends MessageHandler{

public initObj(...args:any[]):void {

	this.register(opCodes.G2C_FIGHT_BEGIN, 			this.onRecvG2C_FIGHT_BEGIN, this)		//战斗开始
	this.register(opCodes.G2C_FIGHT_ESOTERIC_POWER, 			this.onRecvG2C_FIGHT_ESOTERIC_POWER, this)		//战斗开始初始化角色MP
	this.register(opCodes.G2C_FIGHT_ADD, 				this.onRecvG2C_FIGHT_ADD, this)			//增加战斗成员
	//this.register(opCodes.G2C_FIGHT_BOUT, 			this.onRecvG2C_FIGHT_BOUT, this)		//回合开始
	this.register(opCodes.G2C_FIGHT_END, 				this.onRecvG2C_FIGHT_END, this)			//战斗结束
	this.register(opCodes.G2C_FIGHT_RESULT, 		this.onRecvG2C_FIGHT_RESULT, this)	//回合战斗结果
	this.register(opCodes.G2C_FIGHT_SEQUENCE, 		this.onRecvG2C_FIGHT_SEQUENCE, this)	//战斗出手队列
	this.register(opCodes.G2C_FIGHT_REBEGIN, 		this.onRecvG2C_FIGHT_REBEGIN, this)	//战斗重连
	//this.register(opCodes.G2C_FIGHT_READY, 		this.onRecvG2C_FIGHT_READY, this)			//战斗出手标记
	//this.register(opCodes.G2C_GET_WANTED_LIST, 		this.onRecvG2C_GET_WANTED_LIST, this)			//通缉犯名单
	
	// this.register(opCodes.G2C_FIGHT_GET_BATTLE_QUEUE, 	this.onRecvG2C_FIGHT_GET_BATTLE_QUEUE, this)		//获取出战列表
	this.register(opCodes.G2C_FIGHT_WIN, 								this.onRecvG2C_FIGHT_WIN, this)									//通关奖励
	// this.register(opCodes.G2C_CHAMPION_WEAP, 						this.onRecvG2C_CHAMPION_WEAP, this)							//横扫关卡奖励
	// this.register(opCodes.G2C_FIGHT_CAMPAIGN_RECORD, 		this.onRecvG2C_FIGHT_CAMPAIGN_RECORD, this)			//获取通关记录列表
	// this.register(opCodes.G2C_FIGHT_RESERVE_LINE_UP, 		this.onRecvG2C_FIGHT_RESERVE_LINE_UP, this)			//获取替补记录
	this.register(opCodes.G2C_FIGHT_LOST, 							this.onRecvG2C_FIGHT_LOST, this)								//战斗失败
	
	
	// this.register(opCodes.G2C_FIGHT_CHAMPION_TOP_RANK, 							this.onRecvG2C_FIGHT_CHAMPION_TOP_RANK, this)		//竞技场最高排名
	this.register(opCodes.G2C_FIGHT_CHAMPION_REFRESH, 							this.onRecvG2C_FIGHT_CHAMPION_REFRESH, this)		//竞技场刷新
	// this.register(opCodes.G2C_FIGHT_CHAMPION_RECORD, 								this.onRecvG2C_FIGHT_CHAMPION_RECORD, this)		//竞技场对战记录
	// this.register(opCodes.G2C_FIGHT_CHAMPION_REFRESH_EX, 								this.onRecvG2C_FIGHT_CHAMPION_REFRESH_EX, this)		//竞技场晶石刷新
	// this.register(opCodes.G2C_FIGHT_CHAMPION_EX_PRIZE, 								this.onRecvG2C_FIGHT_CHAMPION_EX_PRIZE, this)		//竞技场排名奖励
	
	this.register(opCodes.G2C_FIGHT_VIEDO, 									this.onRecvG2C_FIGHT_VIEDO, this)		//战斗录像
	this.register(opCodes.G2C_FIGHT_VIEDO_PAGE, 						this.onRecvG2C_FIGHT_VIEDO_PAGE, this)		//战斗录像分布
	this.register(opCodes.G2C_EXCITE_SERVER_FIRST_CAMPAIGN,	this.onRecvG2C_EXCITE_SERVER_FIRST_CAMPAIGN, this)		//战斗录像
	
	this.register(opCodes.G2C_FIGHT_SYNC_TICKTIME, 					this.onRecvG2C_FIGHT_SYNC_TICKTIME, this)		//战斗录像
	
	this.register(opCodes.G2C_FIGHT_SPIRIT_POINT, 					this.onRecvG2C_FIGHT_SPIRIT_POINT, this)		//战斗录像
	
	//this.register(opCodes.G2C_FIGHT_ASSIST_SKILL, 					this.onRecvG2C_FIGHT_ASSIST_SKILL, this)		//援助技能
	this.register(opCodes.G2C_FIGHT_LINE_UP_DATA, 					this.onRecvG2C_FIGHT_LINE_UP_DATA, this)		//替补列表
	this.register(opCodes.G2C_FIGHT_DAMAGE, 								this.onRecvG2C_FIGHT_DAMAGE, this)					//双方总输出
	
	this.register(opCodes.G2C_WAR_FORMATION_INFO,           this.onRecvG2C_WAR_FORMATION_INFO, this)    //战阵信息
	
	//组队关卡
	this.register(opCodes.G2C_FIGHT_ENTER_CAMPAIGN_INFO,           this.onRecvG2C_FIGHT_ENTER_CAMPAIGN_INFO, this)    //开始战斗
	this.register(opCodes.G2C_EXCITE_LIMIT_CAMPAIGN, 				this.onRecvG2C_EXCITE_LIMIT_CAMPAIGN, this)								//个人限时通关
	this.register(opCodes.G2C_EXCITE_NOT_SERVER_FIRST_CAMP, 	this.onRecvG2C_EXCITE_NOT_SERVER_FIRST_CAMP,this)			//全服首通
}

onRecvG2C_FIGHT_BEGIN( dispatcher, message){
	
	//let wnd = WngMrg.getInstance().getWindow("TeamMemberFrame")
	//TLog.Debug("onRecvG2C_FIGHT_BEGIN message.fightType", message.fightType,wnd.isVisible())
	//WngMrg.getInstance().hideWindow("TeamMemberFrame")
	//if(wnd.isVisible() ){
	//	wnd.hideWnd()
	//	TLog.Debug("hide wnd")		
	//}
	
	FightSystem.getInstance().beginFight(message.fightType, message.campainId, message.fightSide)
}

onRecvG2C_FIGHT_ESOTERIC_POWER( dispatcher, message){
	FightSystem.getInstance().getActorSystem().setRoleMp(GetHeroProperty("id"), message.mp)
}

onRecvG2C_FIGHT_ADD( dispatcher, message){
  	FightSystem.getInstance().addFighterList(message.fighterList)
  	//FightSystem.getInstance().addFighterList({GreateFunnalInfo(fightSide.FIGHT_LEFT, 11)})
}

// onRecvG2C_FIGHT_BOUT( dispatcher, message){
// 	//CombatSystem.getInstance().begin_bout(message.bout)
// }

onRecvG2C_FIGHT_END( dispatcher, message){
	FightSystem.getInstance().endFight()
}

onRecvG2C_FIGHT_RESULT( dispatcher, message){
	for(let i = 0; i < message.resultList.length; i++){
			let v = message.resultList[i]
	
		FightSystem.getInstance().addResult(v)
	}
}

onRecvG2C_FIGHT_SEQUENCE( dispatcher, message){
	FireEvent(EventDefine.COMBAT_FIGHT_SEQUENCE_UPDATE, FightSequenceEvent.newObj(message.list))
}

onRecvG2C_FIGHT_REBEGIN( dispatcher, message){
	TLog.Debug("onRecvG2C_FIGHT_REBEGIN message.fightType", message.fightType, message.comapignId)
	FightSystem.getInstance().reBeginFight(message.fightType, message.comapignId, message.fightSide, message.mpPoint)
	SetGlobalInputStatus(true, "Main")
}

onRecvG2C_FIGHT_READY( dispatcher, message){
	//CombatSystem.getInstance().fighter_ready(message.id)
}

// onRecvG2C_GET_WANTED_LIST( dispatcher, message){
// 	FireEvent(EventDefine.TONGJI_LIST_UPDATE, TongjiListEvent.newObj(message.playerList))
// }

// onRecvG2C_FIGHT_GET_BATTLE_QUEUE( dispatcher, message){
// 	// return CampaignSystem.getInstance().updateCampaignArray(message.queue, message.queueType)
// }

onRecvG2C_FIGHT_WIN( dispatcher, message){
	//战役记录
	//let campaignId = null
	// if(message.fightType == opFightType.FIGHT_TYPE_COMMON ){
	// 	// campaignId = CampaignSystem.getInstance().finishCampaign(message.commonList.campaignId, message.commonList.star, message.fightType)
	// }
	
	//战斗结算流程
	FightSystem.getInstance().addFightAccountSettle(true, table_copy(message))
}

// onRecvG2C_CHAMPION_WEAP( dispatcher, message){
// 	//let campaignId = null
// 	// if(message.fightType != opFightType.FIGHT_TYPE_COMMON ){
// 	// 	return
// 	// }
// 	// let campaignId = CampaignSystem.getInstance().finishCampaign(message.commonList.campaignId, message.commonList.star, message.fightType)
	
// 	//战斗结算流程
// 	// FightSystem.getInstance().sweepAwayFight(message, campaignId)
// }

// onRecvG2C_FIGHT_CAMPAIGN_RECORD( dispatcher, message){
// 	// CampaignSystem.getInstance().initFinishCampaignList(message.finishedCampaignList)
// }

// onRecvG2C_FIGHT_RESERVE_LINE_UP( dispatcher, message){
// 	// CampaignSystem.getInstance().setAltemate(message.arrayType, message.altemate, true)
// 	// FireEvent(EventDefine.CAMPAIGN_ALTEMATE_UPDATE, null)
// }

onRecvG2C_FIGHT_LOST( dispatcher, message){
	//战斗结算流程
	FightSystem.getInstance().addFightAccountSettle(false, table_copy(message))
}

onRecvG2C_FIGHT_CHAMPION_TOP_RANK( dispatcher, message){		//竞技场最高排名
	//FireEvent(EventDefine.CHAMPION_TOP_RANK, ChampionTopRankEvent.newObj(message.enemyList))
}

onRecvG2C_FIGHT_CHAMPION_REFRESH( dispatcher, message){		//竞技场刷新
	let activity = GetActivity(ActivityDefine.Champion)	
	activity.setChampionInfo(message)
	FireEvent(EventDefine.CHAMPION_REFRESH, ChampionRefreshEvent.newObj(message.force, message.rank, message.times, message.maxTimes, message.time, message.enemyList, message.topList))
}
// onRecvG2C_FIGHT_CHAMPION_REFRESH_EX( dispatcher, message){		//竞技场刷新
// 	let activity = GetActivity(ActivityDefine.Champion)	
// 	activity.setChampionInfo(message)
// 	FireEvent(EventDefine.CHAMPION_REFRESH_EX, ChampionRefreshExEvent.newObj(message.times, message.maxTimes, message.time))
// }

// onRecvG2C_FIGHT_CHAMPION_EX_PRIZE( dispatcher, message){
//   let activity = GetActivity(ActivityDefine.Champion)	
// 	activity.setFightEndCallBack(message) 
// }

// onRecvG2C_FIGHT_CHAMPION_RECORD( dispatcher, message){		//竞技场战斗记录
// 	CampaignSystem.getInstance().setChampionRecord(message.championRecordList)
// 	FireEvent(EventDefine.FIGHT_CHAMPION_RECORD, ChampionRecordEvent.newObj(message.championRecordList))
// 	let wnd = WngMrg.getInstance().getWindow("ChampionRecodeFrame")		
// 	if(wnd.isVisible() ){
// 		wnd.refreshRecodeWindow()
// 	}
// }

onRecvG2C_FIGHT_VIEDO( dispatcher, message){
	let beginMessage 				= message.message_fight_begin
	let fighterAddMessage 	= message.message_fighter_add

	// if(FightSystem.getInstance().isFight() == true ){
	// 	if(FightSystem.getInstance().isFightEnding() == false || FightSystem.getInstance().isFightVideo() == true ){
	// 		return
	// 	}
	// }
	
	FightSystem.getInstance().clearUpFightState()
	let msg = GetMessage(opCodes.C2G_FIGHT_DRAWDONE)
	SendGameMessage(msg)

	FightSystem.getInstance().beginFightVideo()
	FightSystem.getInstance().beginFight(beginMessage.fightType, beginMessage.campainId)
	
	FightSystem.getInstance().addFighterList(fighterAddMessage.fighterList)
}

onRecvG2C_FIGHT_VIEDO_PAGE( dispatcher, message){
	let resultAddMessage 		= message.message_fight_result
	if(FightSystem.getInstance().isFight() == false || FightSystem.getInstance().isFightVideo() == false ){
		return
	}
	
	for(let i = 0; i < resultAddMessage.resultList.length; i++){
			let v = resultAddMessage.resultList[i]
	
		FightSystem.getInstance().addResult(v)
	}
	
	FightSystem.getInstance().endFight()
}

onRecvG2C_EXCITE_SERVER_FIRST_CAMPAIGN( dispatcher, message){
	// return CampaignSystem.getInstance().setFirstPass(message)
}

onRecvG2C_FIGHT_SYNC_TICKTIME( dispatcher, message){
	
	FightSystem.getInstance().onSyncTickRound(message.fightTime)
}

onRecvG2C_FIGHT_SPIRIT_POINT( dispatcher, message){
	//if(message.skillId == 0 ){
		FightSystem.getInstance().updateFunnalPoint(message.leftPoint)
	//}
	
	FireEvent(EventDefine.COMBAT_FIGHT_FUNNAL_POINT, FunnalPointEvent.newObj(message.skillId, message.leftPoint, message.cooldownTime))
}

// onRecvG2C_FIGHT_ASSIST_SKILL( dispatcher, message){
// 	CombinedSkillSystem.getInstance().setFightAssSkillList(message.skillList)
	
// 	FireEvent(EventDefine.COMBAT_FIGHT_ASSIST_SKILL, AssSkillEvent.newObj(message.commonCD))
// }

onRecvG2C_FIGHT_LINE_UP_DATA( dispatcher, message){
	FightSystem.getInstance().setAltemateList(message.altemateList)
}

onRecvG2C_FIGHT_DAMAGE( dispatcher, message){
	FightSystem.getInstance().setFightDamage(message.leftDamage, message.rightDamage)
}

onRecvG2C_WAR_FORMATION_INFO( dispatcher, message){
	let wnd = WngMrg.getInstance().getWindow("FormationFrame")
	wnd.setFormationInfo(message.formationInfo,message.formationUsed)
}

onRecvG2C_FIGHT_ENTER_CAMPAIGN_INFO( dispatcher, message){
	// CampaignSystem.getInstance().setCurTeamCampaign(message.campaignId, message.curCampaignId)
	
	// FireEvent(EventDefine.CAMPAIGN_TEAM_CURCAM, null)
}

onRecvG2C_EXCITE_LIMIT_CAMPAIGN( dispatcher, message){
	// CampaignSystem.getInstance().updateLimitPassData(message.campaignIndex, message.campaignDeadLine)
	// FireEvent(EventDefine.EXCITE_LIMIT_CAMPAIGN, null)
}

////全服首次通关
onRecvG2C_EXCITE_NOT_SERVER_FIRST_CAMP( dispatcher, message){
	FireEvent(EventDefine.CAMPAIGN_NOTPASS_SERVER, CampaignEvent.newObj(message.campaignId))
}
}