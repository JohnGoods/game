/*
作者:
    panyuxiong
	
创建时间：
    2014.07.15(星期二) 

意图：
  		处理活动信息的加载

公共接口：
	
*/
class ActivityMessageHandler extends MessageHandler {

	public initObj(...args: any[]): void {
		this.register(opCodes.G2C_QIANDAO_TIME, this.onRecvG2C_QIANDAO_TIME, this)				//接受签到信息
		this.register(opCodes.G2C_BUFF_UPDATE, this.onRecvG2C_BUFF_UPDATE, this)					//活动BUFF
		this.register(opCodes.G2C_BUFF_REMOVE, this.onRecvG2C_BUFF_REMOVE, this)					//移除活动BUFF
		// this.register(opCodes.G2C_ROLE_RANK, this.onRecvG2C_ROLE_RANK, this)						//活动排行榜
		// this.register(opCodes.G2C_EXCITE_DATA, this.onRecvG2C_EXCITE_DATA, this)			//刺激点信息返回
		// this.register(opCodes.G2C_RECHARGE_REWARD_INFO, this.onRecvG2C_RECHARGE_REWARD_INFO, this)		//充值奖励列表
		// this.register(opCodes.G2C_ROLE_ENTER_SPACE, 						this.onRecvG2C_ROLE_ENTER_SPACE, this)		//进入活动空间
		// this.register(opCodes.G2C_ROLE_LEAVE_SPACE, 						this.onRecvG2C_ROLE_LEAVE_SPACE, this)		//退出活动空间


		// //混沌世界（圣地）
		// // this.register(opCodes.G2C_ROBBER_QUERY_COPYMAP, this.onRecv_BROKENSTORY_MESSAGE, this)					//活动BUFF
		// // this.register(opCodes.G2C_ROBBER_TEST_ENTER, this.onRecv_BROKENSTORY_MESSAGE, this)					//检查能否进入
		// // this.register(opCodes.G2C_ROBBER_ENTER, this.onRecv_BROKENSTORY_MESSAGE, this)					//进入活动中
		// // this.register(opCodes.G2C_ROBBER_UPDATE_MSG, this.onRecv_BROKENSTORY_MESSAGE, this)					//活动中相关信息
		// // this.register(opCodes.G2C_ACTIVITY_MUTIL_INCOME, this.onRecv_BROKENSTORY_MESSAGE, this)					//活动中加倍信息
		// // this.register(opCodes.G2C_ROBBER_LEAVE, this.onRecv_BROKENSTORY_MESSAGE, this)					//退出活动
		// // this.register(opCodes.G2C_ROBBER_ENTER_ROOM, this.onRecv_BROKENSTORY_MESSAGE, this)					//进入的活动信息
		// // this.register(opCodes.G2C_ROBBER_GET_PRIZE_POWER, this.onRecv_BROKENSTORY_MESSAGE, this)					//是否消耗体力
		// // this.register(opCodes.G2C_ROBBER_REFRESH_TIME, this.onRecvG2C_ROBBER_REFRESH_TIME, this)					//秘钥刷新时间戳
		// // this.register(opCodes.G2C_ROBBER_KILLER_LIST, this.onRecv_BROKENSTORY_MESSAGE, this)					//复仇名单

		// // this.register(opCodes.G2C_ROBBER_HANG_LIST, this.onRecv_BROKENSTORY_MESSAGE, this)					//挂机列表
		// // this.register(opCodes.G2C_ROBBER_FIGHT_GRADE, this.onRecv_BROKENSTORY_MESSAGE, this)					//挂机评级
		// // this.register(opCodes.G2C_ROBBER_FIGHT_RESULT, this.onRecv_BROKENSTORY_MESSAGE, this)					//挂机战斗奖励
		// // this.register(opCodes.G2C_ROBBER_HANG_LIST_REMOVE, this.onRecv_BROKENSTORY_MESSAGE, this)			//挂机移除
		// // this.register(opCodes.G2C_ROBBER_HANG_LIST_ADD, this.onRecv_BROKENSTORY_MESSAGE, this)			//挂机新增
		// // this.register(opCodes.G2C_ROBBER_ROLE_APPEAR, this.onRecv_BROKENSTORY_MESSAGE, this)			//挂机状态
		// // this.register(opCodes.G2C_ROBBER_INCOME_LIST, this.onRecv_BROKENSTORY_MESSAGE, this)			//挂机记录
		// // this.register(opCodes.G2C_ROBBER_INCOME_TIPS, this.onRecv_BROKENSTORY_MESSAGE, this)			//挂机提示
		// // this.register(opCodes.G2C_ROBBER_OFFLINE_INCOME_TIPS, this.onRecv_BROKENSTORY_MESSAGE, this)			//离线挂机提示

		// // this.register(opCodes.G2C_ROBBER_OFFLINE_HANG_INFO, this.onRecv_BROKENSTORY_MESSAGE, this)			//离线挂机设置
		// // this.register(opCodes.G2C_ROBBER_BOSS_INFO, this.onRecv_BROKENSTORY_MESSAGE, this)			//圣地boss信息
		// // this.register(opCodes.G2C_ROBBER_RECORD_PRIZE_INFO, this.onRecv_BROKENSTORY_MESSAGE, this)			//圣地奖励排名（统计）

		// // //圣地-神像
		// // this.register(opCodes.G2C_LOSTTEMPLE_PALYER_MSG, this.onRecv_BROKENSTORY_MESSAGE, this)			//玩家信息
		// // this.register(opCodes.G2C_LOSTTEMPLE_MAP_MSG, this.onRecv_BROKENSTORY_MESSAGE, this)			//地图信息
		// // this.register(opCodes.G2C_LOSTTEMPLE_ROLE_APPEAR, this.onRecv_BROKENSTORY_MESSAGE, this)			//玩家拾取信息
		// // this.register(opCodes.G2C_LOSTTEMPLE_NPC_MSG, this.onRecv_BROKENSTORY_MESSAGE, this)			//神像剩余数量

		// // //this.register(opCodes.G2C_EMPTY_FIGHT_WIN, 				 	  						this.onRecv_BROKENSTORY_MESSAGE, this)					//复仇名单

		// // //天空之塔（试练场）
		// // this.register(opCodes.G2C_SELECT_DAILY, this.onRecv_SKYTOWER_MESSAGE, this)							//进入试练场
		// // this.register(opCodes.G2C_EXIT_DAILY, this.onRecv_SKYTOWER_MESSAGE, this)							//退出试练场
		// // this.register(opCodes.G2C_DAILY_RECORD_UPDATE, this.onRecv_SKYTOWER_MESSAGE, this)							//试练场信息
		// // this.register(opCodes.G2C_GET_DAILY_RANK, this.onRecv_SKYTOWER_MESSAGE, this)									//试练场前三名
		// // this.register(opCodes.G2C_SKY_TOWER_DISCOUNT_EVENT, this.onRecv_SKYTOWER_MESSAGE, this)							//试练场前三名
		// // this.register(opCodes.G2C_GET_SKY_TOWER_INFO, this.onRecv_SKYTOWER_MESSAGE, this)							//试练场历史最高层

		// //公会副本
		// // this.register(opCodes.G2C_FACTIONMAP_CREATE, this.onRecv_FACTIONMAP_MESSAGE, this)
		// // this.register(opCodes.G2C_FACTIONMAP_ENTER, this.onRecv_FACTIONMAP_MESSAGE, this)
		// // this.register(opCodes.G2C_FACTIONMAP_QUERY, this.onRecv_FACTIONMAP_MESSAGE, this)
		// // this.register(opCodes.G2C_FACTIONMAP_LEAVE, this.onRecv_FACTIONMAP_MESSAGE, this)
		// //this.register(opCodes.G2C_FACTIONMAP_RANKDATA,          			this.onRecvG2C_FACTIONMAP_RANKDATA,this)
		// //this.register(opCodes.G2C_GLOBAL_GROUP_EVENT,          			this.onRecvG2C_GLOBAL_GROUP_EVENT,this)
		this.register(opCodes.G2C_GLOBAL_SERVER_EVENT, this.onRecvG2C_GLOBAL_SERVER_EVENT, this)



		// //贵族答题
		this.register(opCodes.G2C_WORLDQUESTION_ENTER, this.onRecvG2C_WORLDQUESTION_ENTER, this)   //进入答题活动          
		this.register(opCodes.G2C_WORLDQUESTION_QUESTION, this.onRecvG2C_WORLDQUESTION_QUESTION, this) //题目
		this.register(opCodes.G2C_WORLDQUESTION_INFO, this.onRecvG2C_WORLDQUESTION_INFO, this)     //玩家信息
		this.register(opCodes.G2C_WORLDQUESTION_ANSWER, this.onRecvG2C_WORLDQUESTION_ANSWER, this)   //答题反馈
		this.register(opCodes.G2C_WORLDQUESTION_LEAVE, this.onRecvG2C_WORLDQUESTION_LEAVE, this)
		this.register(opCodes.G2C_WORLDQUESTION_QUERY, this.onRecvG2C_WORLDQUESTION_QUERY, this)    //当前答题活动状态

		// //大BOSS
		// this.register(opCodes.G2C_BIGBOSS_QUERY, this.onRecvG2C_BIGBOSS_QUERY, this)					//大BOSS查询
		// this.register(opCodes.G2C_BIGBOSS_BOSS_HP, this.onRecvG2C_BIGBOSS_BOSS_HP, this)				//大BOSS血量
		// this.register(opCodes.G2C_BIGBOSS_PLAYER_DAMAGE, this.onRecvG2C_BIGBOSS_PLAYER_DAMAGE, this)		//大BOSS个人伤害
		// this.register(opCodes.G2C_BIGBOSS_DAMAGE_RANK, this.onRecvG2C_BIGBOSS_DAMAGE_RANK, this)		//大BOSS排行
		// this.register(opCodes.G2C_BIGBOSS_FIGHTING_RANK, this.onRecvG2C_BIGBOSS_FIGHTING_RANK, this)		//大BOSS战时伤害排行
		// this.register(opCodes.G2C_BIGBOSS_INSPIRE, this.onRecvG2C_BIGBOSS_INSPIRE, this)				//鼓舞次数
		// this.register(opCodes.G2C_BIGBOSS_ENTER, this.onRecvG2C_BIGBOSS_ENTER, this)					//进入大BOSS
		// this.register(opCodes.G2C_BIGBOSS_REVIVE, this.onRecvG2C_BIGBOSS_REVIVE, this)					//大BOSS快速恢复
		// this.register(opCodes.G2C_BIGBOSS_LEAVE, this.onRecvG2C_BIGBOSS_LEAVE, this)					//大BOSS 离开

		// //日常活动状态
		this.register(opCodes.G2C_ACTIVITY_TIME_INFO, this.onRecvG2C_ACTIVITY_TIME_INFO, this)		//活动概览信息
		// // this.register(opCodes.G2C_EXCITE_TIPS, 				this.onRecvG2C_EXCITE_TIPS, this)										//刺激点活动返回通知

		// //签到//月卡
		// this.register(opCodes.G2C_WAR_HORN_REWARD_INFO, this.onRecvG2C_WAR_HORN_REWARD_INFO, this)	//月卡

		// //七日任务
		// this.register(opCodes.G2C_SEVEN_DAY_PRIZE_INFO, this.onRecv_FESTIVAL_MESSAGE, this)	//七日任务详细信息
		// //每日任务
		// this.register(opCodes.G2C_OPERATE_INFO_LIST, this.onRecv_FESTIVAL_MESSAGE, this)	//每日任务列表
		// this.register(opCodes.G2C_OPERATE_INFO_UPDATE, this.onRecv_FESTIVAL_MESSAGE, this)	//单条信息更新
		// this.register(opCodes.G2C_OPERATE_ACTIVE_PRIZE, this.onRecv_FESTIVAL_MESSAGE, this)	//领取活跃度奖励

		// //天梯
		// this.register(opCodes.G2C_LEAGUE_MATCH_LINK, this.onRecv_FIRE_GLOBAL_LADDER, this)  //跨服IP等信息
		// this.register(opCodes.G2C_LEAGUE_MATCH_LEFT_COUNT, this.onRecv_FIRE_GLOBAL_LADDER, this)  //剩余次数
		// this.register(opCodes.G2C_LEAGUE_MATCH_VIEDO, this.onRecv_FIRE_GLOBAL_LADDER, this) //录像
		// this.register(opCodes.G2C_LEAGUE_MATCH_QUERY_RANK, this.onRecv_FIRE_GLOBAL_LADDER, this) //排行榜
		// this.register(opCodes.G2C_LEAGUE_MATCH_LOGIN, this.onRecv_FIRE_GLOBAL_LADDER, this) //跨服登录信息
		// this.register(opCodes.G2C_LEAGUE_MATCH_CREATE_TEAM, this.onRecv_FIRE_GLOBAL_LADDER, this) //创建队伍
		// this.register(opCodes.G2C_LEAGUE_MATCH_PLYLIST, this.onRecv_FIRE_GLOBAL_LADDER, this)   //玩家列表
		// this.register(opCodes.G2C_LEAGUE_MATCH_TEAM_INFO, this.onRecv_FIRE_GLOBAL_LADDER, this) //队伍玩家信息
		// this.register(opCodes.G2C_LEAGUE_MATCH_INVITE, this.onRecv_FIRE_GLOBAL_LADDER, this)    //邀请查询玩家状态
		// this.register(opCodes.G2C_LEAGUE_MATCH_INVITE_INFO, this.onRecv_FIRE_GLOBAL_LADDER, this) //邀请队长信息
		// this.register(opCodes.G2C_LEAGUE_MATCH_INVITE_RSP, this.onRecv_FIRE_GLOBAL_LADDER, this) //同意邀请的返回信息
		// this.register(opCodes.G2C_LEAGUE_MATCH_DISBAND_TEAM, this.onRecv_FIRE_GLOBAL_LADDER, this) //队长解散
		// this.register(opCodes.G2C_LEAGUE_MATCH_DISBAND_NOTIFY, this.onRecv_FIRE_GLOBAL_LADDER, this) //队长解散队伍通知
		// this.register(opCodes.G2C_LEAGUE_MATCH_LEAVE_TEAM, this.onRecv_FIRE_GLOBAL_LADDER, this) //队员离队
		// this.register(opCodes.G2C_LEAGUE_MATCH_BEGIN_MATCH, this.onRecv_FIRE_GLOBAL_LADDER, this) //匹配验证
		// this.register(opCodes.G2C_LEAGUE_MATCH_FAIL, this.onRecv_FIRE_GLOBAL_LADDER, this) //匹配失败
		// this.register(opCodes.G2C_LEAGUE_MATCH_FINISH, this.onRecv_FIRE_GLOBAL_LADDER, this) //匹配成功
		// this.register(opCodes.G2C_LEAGUE_MATCH_CANCEL_MATCH, this.onRecv_FIRE_GLOBAL_LADDER, this) //匹配中取消
		// this.register(opCodes.G2C_LEAGUE_MATCH_LEAVE_NOTIFY, this.onRecv_FIRE_GLOBAL_LADDER, this)  //队员离队通知
		// this.register(opCodes.G2C_LEAGUE_MATCH_KICK_TEAM, this.onRecv_FIRE_GLOBAL_LADDER, this)  //踢出队伍通知
		// this.register(opCodes.G2C_LEAGUE_MATCH_KICK_NOTIFY, this.onRecv_FIRE_GLOBAL_LADDER, this)  //踢出队伍通知
		// this.register(opCodes.G2C_LEAGUE_MATCH_RETURN, this.onRecvG2C_LEAGUE_MATCH_RETURN, this)  //战斗结束后，返回
		// this.register(opCodes.G2C_LEAGUE_MATCH_ABORT, this.onRecv_FIRE_GLOBAL_LADDER, this)  //踢出队伍通知

		// //航海（矿洞）
		// this.register(opCodes.G2C_RELIC_MINE_LOCK, this.onRecvG2C_RELIC_MINE_LOCK, this)           //锁定矿洞
		// this.register(opCodes.G2C_RELIC_MINE_LIST, this.onRecvG2C_RELIC_MINE_LIST, this)           //矿洞列表
		// this.register(opCodes.G2C_RELIC_MINE_MY_MINE, this.onRecvG2C_RELIC_MINE_MY_MINE, this)        //玩家矿洞
		// this.register(opCodes.G2C_RELIC_MINE_INFO, this.onRecvG2C_RELIC_MINE_INFO, this)           //单个矿洞
		// //this.register(opCodes.G2C_RELIC_MINE_INVITE,         this.onRecvG2C_RELIC_MINE_INVITE,this)         //推送
		// this.register(opCodes.G2C_RELIC_MINE_FAILED_RECORD, this.onRecvG2C_RELIC_MINE_FAILED_RECORD, this)  //查询玩家矿洞消息
		// this.register(opCodes.G2C_RELIC_MINE_REGION_COUNT, this.onRecvG2C_RELIC_MINE_REGION_COUNT, this)   //获取矿洞数量
		// this.register(opCodes.G2C_RELIC_MINE_PRODUCE_LIST, this.onRecvG2C_RELIC_MINE_PRODUCE_LIST, this)   //获取矿洞数量
		// this.register(opCodes.G2C_RELIC_MINE_GET_HELP_QUEUE, this.onRecvG2C_RELIC_MINE_GET_HELP_QUEUE, this) //获取矿洞数量
		// this.register(opCodes.G2C_COMBATTEAM_HELP_QUEUE, this.onRecvG2C_COMBATTEAM_HELP_QUEUE, this)     //获取矿洞数量
		//邀请码
		this.register(opCodes.G2C_INVITE_PRIZE_INFO, this.onRecvG2C_INVITE_PRIZE_INFO, this)
		this.register(opCodes.G2C_FRIEND_INVITE_CODE_INFO, this.onRecvG2C_FRIEND_INVITE_CODE_INFO, this)

		//冲榜
		this.register(opCodes.G2C_NEW_SERVER_RANK_INFO, this.onRecvG2C_NEW_SERVER_RANK_INFO, this)
		//七夕
		//this.register(opCodes.G2C_FESTIVAL_SINGLEDAY_INFO, this.onRecvG2C_FESTIVAL_SINGLEDAY_INFO, this)
	}

	//签到
	onRecvG2C_QIANDAO_TIME(dispatcher, message) {
		TLog.Debug("ActivityDefine.Welfare", ActivityDefine.Welfare)
		let a = GetActivity(ActivityDefine.Welfare)
		a.updateQiandaoData(message.times, message.isget)
	}

	//-活动更新BUFF
	onRecvG2C_BUFF_UPDATE(dispatcher, message) {
		TLog.Debug("=======onRecvG2C_BUFF_UPDATE=======")
		BuffSystem.getInstance().addActBuff(message.buffName, message.buffLeftTime, message.buffData)
		FireEvent(EventDefine.ACTIVITY_BUFF_UPDATE, null)
	}

	//-混沌世界移除BUFF
	onRecvG2C_BUFF_REMOVE(dispatcher, message) {
		BuffSystem.getInstance().removeActBuff(message.buffName)
		FireEvent(EventDefine.ACTIVITY_BUFF_UPDATE, null)
	}

	onRecvG2C_ROLE_RANK(dispatcher, message) {
		//ActivitySystem.getInstance().updateRoleRankList(message.ranktype, message.ranklist)
		// FireEvent(EventDefine.ACTIVITY_RANK_UPDATE, RankListEvent.newObj(message.ranktype, message.ranklist, message.firstAppearData))
	}

	// onRecvG2C_EXCITE_DATA(dispatcher, message) {
	// 	ActivitySystem.getInstance().updateExciteData(message.exciteType, message.exciteData)
	// 	FireEvent(EventDefine.EXCITE_DATA, ExciteDateEvent.newObj(message.exciteType, message.exciteData))
	// }

	// //-充值奖励列表
	// onRecvG2C_RECHARGE_REWARD_INFO(dispatcher, message) {
	// 	//let a = GetActivity(ActivityDefine.Welfare)
	// 	//a.SetRecharge(message.list)
	// 	FireEvent(EventDefine.PAY_ACTIVITY_AWARD, NetMessageEvent.newObj(message))
	// }
	
	// //进入活动空间
	// onRecvG2C_ROLE_ENTER_SPACE(dispatcher , message){
	// 	FireEvent(EventDefine.ROLE_ENTER_SPACE, NetMessageEvent.newObj(message))
	// }

	// //退出活动空间
	// onRecvG2C_ROLE_LEAVE_SPACE(dispatcher , message){
	// 	FireEvent(EventDefine.ROLE_LEAVE_SPACE, null)
	// }

	// //-混沌世界相关消息处理
	// onRecv_BROKENSTORY_MESSAGE(dispatcher, message) {
	// 	//let activity = GetActivity(ActivityDefine.BrokenHistory)
	// 	//activity.updateMessageHandler(message)
	// 	let activity = GetActivity(ActivityDefine.Robber)
	// 	activity.updateMessageHandler(message)
	// }

	// onRecvG2C_ROBBER_REFRESH_TIME(dispatcher, message) {
	// 	//let activity = GetActivity(ActivityDefine.BrokenHistory)
	// 	//activity.updateMessageHandler(message)
	// 	let activity = GetActivity(ActivityDefine.Robber)
	// 	activity.updateMessageHandler(message)

	// 	FireEvent(EventDefine.ROBBER_TIME_REFRESH, NetMessageEvent.newObj(message))

	// }

	// //天空之塔（试练场）相关消息处理
	// onRecv_SKYTOWER_MESSAGE(dispatcher, message) {
	// 	let activity = GetActivity(ActivityDefine.SkyTower)
	// 	activity.updateMessageHandler(message)
	// }





	// ////////////////////////////////////////////////////////////////
	// //-帮派副本的创建
	// onRecvG2C_FACTIONMAP_CREATE(dispatcher, message) {
	// 	let activity = GetActivity(ActivityDefine.SealedGround)
	// 	activity.onFubenCreate(message.index)

	// }

	// ////////////////////////////////////////////////////////////////
	// onRecv_FACTIONMAP_MESSAGE(dispatcher, message) {
	// 	let activity = GetActivity(ActivityDefine.SealedGround)
	// 	activity.updateMessageHandler(message)
	// }

	// //-帮派副本的进入
	// //onRecvG2C_FACTIONMAP_RANKDATA( dispatcher, message){
	// //		let activity = GetActivity(ActivityDefine.SealedGround)
	// //		activity.setLegionRank(message.list)
	// //		FireEvent(EventDefine.SEALED_GROUND_RANK, null)
	// //}

	// //组内事件，帮派副本创建时帮派成员收到（帮派副本开启和帮派BOSS被击杀）
	// //onRecvG2C_GLOBAL_GROUP_EVENT( dispatcher, message){
	// //	FireEvent(EventDefine.ACTIVITY_QUESTION,	NetMessageEvent.newObj(message))	
	// //	ClubSystem.getInstance().handleClubEvent(message.event)
	// //}

	onRecvG2C_GLOBAL_SERVER_EVENT(dispatcher, message) {
		let test1 = message
		let config = GameConfig.HyperLinkConfig
		for(let _ in config){
			let v = config[_]
			if(v.event == message.event){
				ChannelHyperlinkMrg.getInstance().runSystemChat(v,message.data)	//添加到世界聊天数据
			}
		}
	}



	////////////////////////////////////////////////////////////////
	//贵族答题
	onRecvG2C_WORLDQUESTION_ENTER(dispatcher, message) {
		GetActivity(ActivityDefine.AnswerQuestion).start()
	}

	onRecvG2C_WORLDQUESTION_QUESTION(dispatcher, message) {
		//FireEvent(EventDefine.ACTIVITY_QUESTION,ACTIVITY_QUESTION_ARGS.newObj(message.questionIndex,message.questionTime,message.index,message.leftAnswer,message.rightAnswer,message.correctAnswer))		
		FireEvent(EventDefine.ACTIVITY_QUESTION, NetMessageEvent.newObj(message))
	}

	onRecvG2C_WORLDQUESTION_INFO(dispatcher, message) {
		//FireEvent(EventDefine.ACTIVITY_QUESTION_INFO,ACTIVITY_QUESTION_INFO_ARGS.newObj(message.score,message.rank,message.followTimes,message.doubleScoreTimes))
		FireEvent(EventDefine.ACTIVITY_QUESTION_INFO, NetMessageEvent.newObj(message))
	}

	onRecvG2C_WORLDQUESTION_ANSWER(dispatcher, message) {
		//FireEvent(EventDefine.ACTIVITY_QUESTION_RESULT,QUESTION_RESULT.newObj(message.isCorrect))
		FireEvent(EventDefine.ACTIVITY_QUESTION_RESULT, NetMessageEvent.newObj(message))
	}

	onRecvG2C_WORLDQUESTION_LEAVE(dispatcher, message) {
		GetActivity(ActivityDefine.AnswerQuestion).stop()
	}

	onRecvG2C_WORLDQUESTION_QUERY(dispatcher, message) {
		FireEvent(EventDefine.ACTIVITY_QUESTION_STATE, NetMessageEvent.newObj(message))
	}


	// ////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////-

	// //-大BOSS//-血量
	// onRecvG2C_BIGBOSS_QUERY(dispatcher, message) {
	// 	let a = GetActivity(ActivityDefine.BigBoss)
	// 	a.SetStartTime(message.time)
	// 	a.SetState(message.state, message.level, message.maxhp)
	// 	FireEvent(EventDefine.BIG_BOSS_QUERY, null)
	// }
	// //-大BOSS//-血量
	// onRecvG2C_BIGBOSS_BOSS_HP(dispatcher, message) {
	// 	let a = GetActivity(ActivityDefine.BigBoss)
	// 	a.SetBossHP(message.HP)
	// 	FireEvent(EventDefine.BIG_BOSSHP_UPDATE, null)
	// }
	// //////////////////////////////////////////////////////////////////////-
	// //////////////////////////////////////////////////////////////////////-
	// //-大BOSS个人击杀
	// onRecvG2C_BIGBOSS_PLAYER_DAMAGE(dispatcher, message) {
	// 	let a = GetActivity(ActivityDefine.BigBoss)
	// 	a.SetMyDamageRank(message.damage, message.myRank)
	// 	FireEvent(EventDefine.BIG_BOSS_PLAYER_DAMAGE_RANK, null)
	// }
	// //////////////////////////////////////////////////////////////////////-
	// //////////////////////////////////////////////////////////////////////-
	// //-大BOSS击杀排行
	// onRecvG2C_BIGBOSS_DAMAGE_RANK(dispatcher, message) {
	// 	let a = GetActivity(ActivityDefine.BigBoss)
	// 	a.SetKillRank(message.totaldamage, message.lastKill, message.list)
	// 	FireEvent(EventDefine.BIG_BOSS_DAMAGE_RANK, null)
	// }
	// //-大BOSS击杀排行（服务器广播）
	// onRecvG2C_BIGBOSS_FIGHTING_RANK(dispatcher, message) {
	// 	let a = GetActivity(ActivityDefine.BigBoss)
	// 	a.SetFightingDamageRank(message.totaldamage, message.fightingDamageRank)
	// 	FireEvent(EventDefine.BIG_BOSS_FIGHTING_RANK, null)
	// }
	// //////////////////////////////////////////////////////////////////////-
	// //////////////////////////////////////////////////////////////////////-
	// //-终极鼓舞次数
	// onRecvG2C_BIGBOSS_INSPIRE(dispatcher, message) {
	// 	let a = GetActivity(ActivityDefine.BigBoss)
	// 	a.SetSkill_level(message.count)

	// }
	// //////////////////////////////////////////////////////////////////////-
	// //////////////////////////////////////////////////////////////////////-
	// //-大BOSS开始时间
	// onRecvG2C_BIGBOSS_ENTER(dispatcher, message) {
	// 	let a = GetActivity(ActivityDefine.BigBoss)
	// 	FireEvent(EventDefine.BIG_BOSS_PLAYER_ENTER, null)
	// }

	// //-大BOSS快速恢复
	// onRecvG2C_BIGBOSS_REVIVE(dispatcher, message) {
	// 	return FireEvent(EventDefine.BIG_BOSS_PLAYER_REVIVE, null)
	// }

	// //-大BOSS离开
	// onRecvG2C_BIGBOSS_LEAVE(dispatcher, message) {
	// 	return FireEvent(EventDefine.BIG_BOSS_LEAVE, null)
	// }

	// ////////////////////////////////////////////////////////////////=======
	// ////////////////////////////////////////////////////////////////
	//日常活动状态
	onRecvG2C_ACTIVITY_TIME_INFO(dispatcher, message) {
		UpdateActivityTimeState(message.stateList)
		FireEvent(EventDefine.ACTIVITY_STATE_LIST, null)
	}


	// ////////////////////////////////////////////////////////////////

	// //-签到//月卡
	// onRecvG2C_WAR_HORN_REWARD_INFO(dispatcher, message) {
	// 	let a = GetActivity(ActivityDefine.Welfare)
	// 	a.SetWarHorn(message.list)
	// 	FireEvent(EventDefine.UPDATE_WELFARE, null)
	// }

	// ////////////////////////////////////////////////////////////////////////////////-
	// //关卡通关奖励
	// onRecvG2C_EXCITE_TIPS(dispatcher, message) {
	// 	if (FightSystem.getInstance().isFight() == false) {
	// 		return
	// 	}
	// 	let [_, campaignId] = FightSystem.getInstance().getCurFightType()

	// 	if (message.awardType == "limitCampaign") {
	// 		let elem = null
	// 		for (let _ in GameConfig.CampaignExciteConfig) {
	// 			let v = GameConfig.CampaignExciteConfig[_]

	// 			if (v.last == campaignId) {
	// 				elem = v
	// 				break
	// 			}
	// 		}

	// 		if (elem) {
	// 			let wnd = WngMrg.getInstance().getWindow("PrizeShowFrame")
	// 			wnd.showWithPrizeList([[SpecailItemId.GOLD, elem.rmbGold || 0, 0]])
	// 			//return MsgSystem.AddAwardMsg("XIANTONG", elem.rmbGold || 0, campaignId)
	// 		}
	// 	} else if (message.awardType == "serverFirstKill") {
	// 		//let value = CampaignSystem.getInstance().getCampaignServerFirstPrize(campaignId)
	// 		//return MsgSystem.AddAwardMsg("SHOUTONG", value, campaignId)
	// 	}
	// }

	// //七日任务
	// onRecv_FESTIVAL_MESSAGE(dispatcher, message) {
	// 	let activity = GetActivity(ActivityDefine.Festival)
	// 	activity.updateMessageHandler(message)
	// }

	// //天梯
	// onRecv_FIRE_GLOBAL_LADDER(dispatcher, message) {
	// 	let activity = GetActivity(ActivityDefine.GlobalLadder)
	// 	activity.updateMessageHandler(message)
	// }

	// onRecvG2C_LEAGUE_MATCH_RETURN(dispatcher, message) {
	// 	let wnd = WngMrg.getInstance().getWindow("FightLadderFrame")
	// 	wnd.onReturnMenu()
	// }

	// ////////////////////////////-航海（矿洞）//start////////////////////////////////////////////-

	// onRecvG2C_RELIC_MINE_LOCK(dispatcher, message) { //锁定矿洞
	// 	let activity = GetActivity(ActivityDefine.Relic)
	// 	activity.setRelicLockState()

	// 	FireEvent(EventDefine.RELIC_LOCK, RelicLockEvent.newObj())
	// }

	// onRecvG2C_RELIC_MINE_LIST(dispatcher, message) { //矿洞列表 
	// 	let activity = GetActivity(ActivityDefine.Relic)
	// 	TLog.Debug("ActivityMessageHandler.onRecvG2C_RELIC_MINE_LIST", message.relicAreaID)
	// 	//TLog.Debug_r(message)
	// 	//io.read()
	// 	activity.setRelicListByArea(message.relicInfoList, message.relicAreaID)

	// 	FireEvent(EventDefine.RELIC_LIST_REFRESH, RelicAreaUpdateEvent.newObj(message.relicAreaID))
	// }

	// onRecvG2C_RELIC_MINE_MY_MINE(dispatcher, message) { //玩家矿洞
	// 	TLog.Debug("ActivityMessageHandler.onRecvG2C_RELIC_MINE_MY_MINE")
	// 	let activity = GetActivity(ActivityDefine.Relic)
	// 	//TLog.Debug_r(message.myRelicInfo)
	// 	activity.setMyRelic(message.myRelicInfo)

	// 	FireEvent(EventDefine.RELIC_MY_REFRESH, null)
	// }

	// onRecvG2C_RELIC_MINE_INFO(dispatcher, message) { //单个矿洞
	// 	TLog.Debug("ActivityMessageHandler.onRecvG2C_RELIC_MINE_INFO")
	// 	let activity = GetActivity(ActivityDefine.Relic)
	// 	activity.setOneRelic(message.relicInfo)
	// 	//TLog.Debug_r(message)
	// 	FireEvent(EventDefine.RELIC_ONE_REFRESH, OpenOneRelicEvent.newObj(message.relicInfo.areaID, message.relicInfo.id))

	// }

	// onRecvG2C_RELIC_MINE_FAILED_RECORD(dispatcher, message) {
	// 	//let activity = GetActivity(ActivityDefine.Relic)
	// 	//TLog.Debug("ActivityMessageHandler.onRecvG2C_RELIC_MINE_INVITE",message.playerName,message.relicAreaID,message.relicID)
	// 	if (message.relicAreaID != 0 && message.relicID != 0) {
	// 		let activity = GetActivity(ActivityDefine.Relic)
	// 		let relicInfo = activity.getOneRelic(message.relicAreaID, message.relicID)

	// 		if (!relicInfo) {
	// 			TLog.Error("onRecvG2C_RELIC_MINE_FAILED_RECORD getOneRelic error  !!!!!!!!!!! relicInfo if(null")
	// 			//return 
	// 			activity.sendMsgOneRelicInfo(message.relicAreaID, message.relicID)
	// 		} else {
	// 			activity.setCurRelicInfo(relicInfo)
	// 		}

	// 		let w = WngMrg.getInstance().getWindow("NavigationLogFrame")
	// 		if (w.isVisible()) {
	// 			let areaId, boardId = w.getAreaIdAndBoardId()
	// 			if (areaId == message.relicAreaID && boardId == message.relicID) {
	// 				let wnd = WngMrg.getInstance().getWindow("NavigationDetailFrame")
	// 				wnd.showByAreaIdAndBoardId(message.relicAreaID, message.relicID)
	// 			}
	// 		} else {
	// 			let wnd = WngMrg.getInstance().getWindow("NavigationDetailFrame")
	// 			wnd.showByAreaIdAndBoardId(message.relicAreaID, message.relicID)
	// 		}
	// 	} else {
	// 		MsgSystem.addTagTips(Localize_cns("NAV_TEXT36"))
	// 	}
	// }

	// onRecvG2C_RELIC_MINE_REGION_COUNT(dispatcher, message) {
	// 	let activity = GetActivity(ActivityDefine.Relic)
	// 	activity.setTotalRelicInfo(message.regionCount, message.mineCount)
	// }

	// onRecvG2C_RELIC_MINE_PRODUCE_LIST(dispatcher, message) {
	// 	let activity = GetActivity(ActivityDefine.Relic)
	// 	activity.setReilcGetRankList(message.getProduceType, message.getProduceConfig)
	// 	FireEvent(EventDefine.RELIC_MAX_RANK_LIST, null)
	// }

	// onRecvG2C_RELIC_MINE_GET_HELP_QUEUE(dispatcher, message) {
	// 	//FireEvent(EventDefine.RELIC_TEAM_LIST, null)
	// }
	// onRecvG2C_COMBATTEAM_HELP_QUEUE(dispatcher, message) {
	// 	let activity = GetActivity(ActivityDefine.Relic)
	// 	activity.setMyTeamList(message.RelicTeamQueueList)
	// 	FireEvent(EventDefine.RELIC_TEAM_LIST, null)
	// }

	// ////////////////////////////-航海（矿洞）//}////////////////////////////////////////////-

	onRecvG2C_INVITE_PRIZE_INFO(dispatcher, message) {
		FireEvent(EventDefine.INVITE_PRIZE_INFO, NetMessageEvent.newObj(message))
	}

	onRecvG2C_FRIEND_INVITE_CODE_INFO(dispatcher, message) {
		FireEvent(EventDefine.INVITE_FRIENDS_NUM, NetMessageEvent.newObj(message))
		if (message.finishFlag != null) {
			if (message.finishFlag == 0) {
				//ActivitySystem.getInstance().setCActivityOpenList([PayActivityIndex.INVITECODE])
			} else if (message.finishFlag == 1) {
				//ActivitySystem.getInstance().setCActivityOpenList([])
			}
		}
		FireEvent(EventDefine.PAY_ACTIVITY_UPDATE, null)
	}

	// ////////////////////////////////冲榜////////////////////////////////
	onRecvG2C_NEW_SERVER_RANK_INFO(dispatcher, message) {
		ActivitySystem.getInstance().setOpenTime(message.openTime)
		SetServerOpenTime(message.openTime)
	}

	// //////////////////////////////-七夕////////////////////////////
	// onRecvG2C_FESTIVAL_SINGLEDAY_INFO(dispatcher, message) {
	// 	ActivitySystem.getInstance().setValentineInfo(message)
	// }

}