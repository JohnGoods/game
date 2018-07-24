/*
作者:
    yangguiming
	
创建时间：
    2014.07.31(星期四) 

意图：
  活动定义

公共接口：
	
*/


////////////////////////////////////////////////////////////////////////////////
//PayActivityDefine = {
//	createRoleDailyRecharge  : "createRoleDailyRecharge", //创角每日充值
//	singleRecharge  : "singleRecharge", //单笔礼包
//	limitRecharge 		: "limitRecharge", //限时累冲
//	limitConsume 		: "limitConsume", //限时累消
//	
//}

ImportType(OrdinaryActivityIndex)

OrdinaryActivityIndex.UNDEFINEACTIVITY = -1							//未定义活动，表示有活动但OrdinaryActivityIndex里未定义





//七天活动天数
let SEVEN_ACTIVITY_DAY = 7

////////////////////////////////////////////////////////////////////////////////
let ActivityDefine = {
	//领奖
	Welfare: 1,
	Champion: 2,
	Boss: 3,
	ClubMap: 4,
	//Robber : 3,
	AnswerQuestion: 8,
	SealedGround: 9,

	Robber: 10,
	Festival: 21,		//节日活动相关

	//Warfare : 10,

	//CampaignDouble : 11,	//关卡双倍活动
	//LightTemple : 12,			//光明神殿
	GodsWar: 13,		//众神之战
	FactionWar: 14,			//军团战
	SkyTower: 20,
	BigBoss: 21,
	Relic: 22,  //航海(遗迹探索)
	OpenServer: 23,	//开服活动
	Carnival: 24,    //狂欢活动
	LuckyPrize : 25, //幸运好礼
	Wonder: 26,     //精彩活动
	//MonAggress	: 15,			//魔物攻城
	//TeamWarfare : 16,			//组队斗技
	//MiWuSenLin  : 17,     //迷雾森林
	//PuzzlePalace  : 18,     //迷雾宫殿
	//AbsoZone			: 19,		//死亡领域
	//CryptolaliaCondition : 20 ,//密语境地
	//RuinZone			: 22,		//毁灭领域活动
	//LegionPangaea : 23,		//军团PVE（远古领域）
	//UnionWar : 24,		//联盟战	
	//UnionPVE : 25,    //军团联盟PVE
	//KnightCopy : 26,    //骑士团副本
	//GlobalWarfare : 100,	//跨服斗技
	GlobalLegion: 101,		//跨服军团战
	GlobalLadder: 102,		//跨服天梯赛
	GlobalMining: 103,		//跨服争霸（挖矿）
	//GlobalNationWar : 103,		//跨服国战 
	//GlobalUnionWar : 104,		//跨服联盟战	

	HuSong: 105,  			//西游护送
	WuLin: 106,  			//武林大会
	Stronghold: 107,		//据点
}



let ActivityMapDefine: any = {


	[ActivityDefine.Welfare]: { ["clazz"]: Activity_Welfare, ["init"]: true, ["actIndex"]: OrdinaryActivityIndex.NULL },

	[ActivityDefine.Champion]: { ["clazz"]: Activity_Champion, ["init"]: false, ["actIndex"]: OrdinaryActivityIndex.NULL },

	[ActivityDefine.Boss]: { ["clazz"]: Activity_Boss, ["init"]: true, ["actIndex"]: OrdinaryActivityIndex.NULL },

	[ActivityDefine.ClubMap]: { ["clazz"]: Activity_ClubMap, ["init"]: true, ["actIndex"]: OrdinaryActivityIndex.FactInstZones },

	[ActivityDefine.AnswerQuestion]: { ["clazz"]: Activity_AnswerQuestion, ["init"]: false, ["actIndex"]: OrdinaryActivityIndex.DATI },
	//开服活动
	[ActivityDefine.OpenServer]: { ["clazz"]: Activity_OpenServer, ["init"]: false, ["actIndex"]: OrdinaryActivityIndex.NULL },
	[ActivityDefine.Carnival]: { ["clazz"]: Activity_Carnival, ["init"]: false, ["actIndex"]: OrdinaryActivityIndex.NULL },
	[ActivityDefine.Wonder]: { ["clazz"]: Activity_Wonder, ["init"]: false, ["actIndex"]: OrdinaryActivityIndex.NULL },

	//   //西游护送
	[ActivityDefine.HuSong]: { ["clazz"]: Activity_HuSong, ["init"]: false, ["actIndex"]: OrdinaryActivityIndex.HUSONG },
	//幸运好礼
	[ActivityDefine.LuckyPrize]: { ["clazz"]: Activity_LuckyPrize, ["init"]: false, ["actIndex"]: OrdinaryActivityIndex.NULL },
	//跨服争霸
	[ActivityDefine.GlobalMining]: { ["clazz"]: Activity_GlobalMining, ["init"]: true, ["actIndex"]: OrdinaryActivityIndex.GlobalMine },
	//武林大会
	[ActivityDefine.WuLin]: { ["clazz"]: Activity_WuLinDaHui, ["init"]: true, ["actIndex"]: OrdinaryActivityIndex.WuLin },
	//据点
	[ActivityDefine.Stronghold]: { ["clazz"]: Activity_Stronghold, ["init"]: true, ["actIndex"]: OrdinaryActivityIndex.Stronghold },
}

let ActMessageHandlerTag =			//战斗状态时收到活动消息的处理策略
{
	STRAIGHT: 0,					//直接处理
	DELAY: 1,						//延后处理
	SKIP: 2,						//不处理
};

let ActivityTimeState = {
	FINISHED: 0, //已经结束
	NOTBEGIN: 1, //未开始
	READY: 2, //即将开始
	ONGOING: 3,//正在进行中
	ALLWAYS: 4
}



//定点活动 ready是提前多少秒即将开始
let ActivityTimeDefine: any = {
	////////////////////////////////////////////每日活动////////////////////////////////////////-
	// [OrdinaryActivityIndex.QIANGDA]: { ["day"]: ["9:00", "12:00", "14:00", "18:00", "21:15"], ["ready"]: 0 },
	// [OrdinaryActivityIndex.BAOXIANG]: { ["day"]: ["11:30", "20:30"], ["ready"]: 0 },
	// [OrdinaryActivityIndex.LINGTILI]: { ["day"]: ["11:00-13:00", "17:00-19:00"], ["ready"]: 0 },//H5不要 "21:00-23:00"
	// [OrdinaryActivityIndex.ZHONGJIMOLONG]: { ["day"]: ["12:00", "17:00"], ["ready"]: 0 },
	// [OrdinaryActivityIndex.HDSHUANGBEI]: { ["day"]: ["12:30-13:00", "19:30-20:00"], ["ready"]: 0 },
	// [OrdinaryActivityIndex.KUAFUTIANTI]: { ["day"]: ["22:00-23:00"], ["ready"]: 0 },
	[OrdinaryActivityIndex.DATI]: { ["day"]: ["12:00-12:07"], ["ready"]: 0 },
	[OrdinaryActivityIndex.HUSONG]: { ["day"]: ["11:00-13:00", "23:00-24:00", "00:00-01:00"], ["ready"]: 0 },
	[OrdinaryActivityIndex.FactionMonster]: { ["day"]: ["10:00-16:30", "17:00-23:00"], ["ready"]: 0 },
	[OrdinaryActivityIndex.ServerTeam]: { ["day"]: ["11:00-13:00", "23:00-24:00", "00:00-01:00"], ["ready"]: 0 },
	[OrdinaryActivityIndex.Stronghold]: { ["day"]: ["12:30-24:00"], ["ready"]: 0 },
	// [OrdinaryActivityIndex.ROBBER_TICKET]: { ["day"]: ["10:00", "13:00", "16:00", "19:00", "23:00"], ["ready"]: 0 },
	// [OrdinaryActivityIndex.SHENDIAN]: { ["day"]: ["21:00-21:30"], ["ready"]: 0 },
	// ////////////////////////////////////////////每周活动////////////////////////////////////////-
	[OrdinaryActivityIndex.GlobalMine]: { ["week"]: {[1] : ["20:00"], [3] : ["20:00"], [5] : ["20:00"], [0] : ["20:00"]}, ["ready"]: 0 },
	[OrdinaryActivityIndex.WuLin]: { ["week"]: {[2] : ["20:00"], [4] : ["20:00"], [6] : ["20:00"] },  ["ready"]: 0 },
	// //[OrdinaryActivityIndex.HDSHUANGBEI] : {["week"]:{[2] : ["19:00-20:00"], [4] : ["19:00-20:00"], [6] : ["19:00-20:00"], [0] : ["19:00-20:00"] }, ["ready"] : 600},
	// //[OrdinaryActivityIndex.DATI] : {["week"]:{[1] : ["19:30"], [3] : ["19:30"], [5] : ["19:30"] }, ["ready"] : 600},
	// [OrdinaryActivityIndex.JUNCHUANZHAN]: { ["week"]: { [2]: ["20:00-21:00"], [3]: ["20:00-21:00"], [6]: ["20:00-21:00"], [0]: ["20:00-21:00"] }, ["ready"]: 0 },
	// [OrdinaryActivityIndex.ZHENYING]: { ["week"]: { [1]: ["20:00"], [4]: ["20:00"], [5]: ["20:00"], [6]: ["15:00"], [0]: ["15:00"] }, ["ready"]: 0 },
	// ////////////////////////////////////////////常驻活动//////////////////////////////////////////
	// [OrdinaryActivityIndex.FENGMO]: { ["res"]: true }
}

//function GetServerTime(){
//	return os.time()
//}

let s_activityTimeState: any = {}

function CheckNewActivity(newState) {
	if (IsInGlobalActvity() != null) {
		return false
	}
	if (GuideSystem.getInstance().isCanClientAutoUI() == false || FightSystem.getInstance().isFight() == true) {
		return false
	}

	// let activity = GetActivity(ActivityDefine.Robber)
	// let isRobberStart = activity.isStart()
	//if (StateManager.getInstance().GetCurrentStateType() != state_type.LIVE_BASE_STATE && isRobberStart != true) {
	if (StateManager.getInstance().GetCurrentStateType() != state_type.LIVE_BASE_STATE) {
		return false
	}

	function executeMainFuncion(param) {
		ExecuteMainFrameFunction(param)
	}


	function checkMainFuncion(param) {
		let [flag, _] = CheckMainFrameFunction(param)
		return flag
	}


	let checkActivityInfo: any = {
		[OrdinaryActivityIndex.DATI]: { ["title"]: Localize_cns("ACTIVITY_TXT51"), ["callback"]: executeMainFuncion, ["param"]: "dati", ["check"]: checkMainFuncion },
		[OrdinaryActivityIndex.ZHONGJIMOLONG]: { ["title"]: Localize_cns("ACTIVITY_TXT55"), ["callback"]: executeMainFuncion, ["param"]: "boss", ["check"]: checkMainFuncion },
		//[OrdinaryActivityIndex.KUAFUTIANTI]: { ["title"]: Localize_cns("ACTIVITY_TXT59"), ["callback"]: executeMainFuncion, ["param"]: "tianti", ["check"]: checkMainFuncion },
		//[OrdinaryActivityIndex.ZHENYING]: { ["title"]: Localize_cns("GODSWAR_TEXT"), ["callback"]: executeMainFuncion, ["param"]: "zhenying", ["check"]: checkMainFuncion },
	}


	let nexActIndex = -1
	for (let _index in newState) {
		let index = tonumber(_index)
		if (s_activityTimeState[index] == null) {
			if (checkActivityInfo[index]) {
				nexActIndex = index
				break
			}
		}
	}


	if (nexActIndex > 0) {
		let info = checkActivityInfo[nexActIndex]
		if (info.check.call(null, info.param) == false) {
			return false
		}

		let t: IDialogCallback = {
			onDialogCallback(result: boolean, userData): void {
				if (result == true) {
					// let isRobberStart = activity.isStart()
					// if (isRobberStart) {
					// 	activity.requestStopAndCall(info.callback, null, info.param)
					// } else {
					info.callback.call(null, info.param)
					//}
				}
			}
		}
		MsgSystem.confirmDialog(String.format(Localize_cns("ACTIVITY_TXT10"), info.title), t, ConfirmFrom.AUTO_SHOW_ACTIVITY, false)
	}
	return true
}



//更新当前活动状态，C2G_ACTIVITY_TIME_INFO返回的结果
function UpdateActivityTimeState(state) {
	//let flag = CheckNewActivity(state)
	s_activityTimeState = state || {}
}

function IsActivityTimeOpened(index) {
	//let flag = table_isExist(s_activityTimeState, index)
	//return flag

	return s_activityTimeState[index] != null
}

//index传入ActivityTimeDefine的索引,获得活动状态
function GetActivityTimeState(index) {
	//TLog.Debug(index)
	let timeDef = ActivityTimeDefine[index]
	TLog.Assert(timeDef != null)

	let curTime = GetServerTime()
	let date = GetServerDate(curTime);
	let weekDay = date.wday;
	let hours = date.hour;
	let mins = date.min;
	let curSecs = hours * 3600 + mins * 60 //今天过了多少秒
	let readyTime = timeDef.ready  //即将开始时间差


	let retState = ActivityTimeState.NOTBEGIN
	let retTime = -1//活动开启时间
	let retTimeIndex = -1//当天时间索引
	let retWeek = -1//活动开启时候的星期
	let notFinishAll = false

	if (timeDef.day) {
		//检查每日活动
		retWeek = weekDay

		for (let index = timeDef.day.length - 1; index >= 0; index--) {

			let timeStr = timeDef.day[index]
			let [h_, m_] = StringUtil.stringMatch(timeStr, /(\d+):(\d+)/)
			let h = tonumber(h_);
			let m = tonumber(m_);
			let nextSecs = h * 3600 + m * 60

			// h = tonumber(h)
			// m = tonumber(m)

			if (curSecs < nextSecs) {//即将开始
				let diffSecs = nextSecs - curSecs
				notFinishAll = true

				retTime = curTime - curSecs + nextSecs
				retTimeIndex = index

				if (diffSecs <= readyTime) {
					retState = ActivityTimeState.READY
					break
				}
			} else {
				if (notFinishAll == false) {
					retState = ActivityTimeState.ONGOING //找到第一个大于活动时间的，就是认为已经开启了（判断结束需要发送协议查询）
					retTime = curTime - curSecs + nextSecs
					retTimeIndex = index
				}
				break
			}
		}
	} else if (timeDef.week) {
		//检查周活动
		for (let nextWeek_ in timeDef.week) {
			let nextWeek = tonumber(nextWeek_);
			let timeList = timeDef.week[nextWeek]

			if (nextWeek == weekDay) {
				retWeek = weekDay
				//for(let index = 0; index < timeList.length; index++){
				let timeStr = timeList[index]

				for (let index = timeList.length - 1; index >= 0; index--) {
					let timeStr = timeList[index]

					let [h_, m_] = StringUtil.stringMatch(timeStr, /(\d+):(\d+)/)
					let h = tonumber(h_);
					let m = tonumber(m_);
					let nextSecs = h * 3600 + m * 60

					// h = tonumber(h)
					// m = tonumber(m)

					if (curSecs < nextSecs) {//即将开始
						let diffSecs = nextSecs - curSecs

						retTime = curTime - curSecs + nextSecs
						retTimeIndex = index
						notFinishAll = true

						if (diffSecs <= readyTime) {
							retState = ActivityTimeState.READY
							break
						}
					} else {
						if (notFinishAll == false) {
							retState = ActivityTimeState.ONGOING //找到第一个大于活动时间的，就是认为已经开启了（判断结束需要发送协议查询）
							retTime = curTime - curSecs + nextSecs
							retTimeIndex = index
						}
						break
					}
				}

				break
			}
		}
	} else if (timeDef.res) {
		retState = ActivityTimeState.ALLWAYS
	}

	//TLog.Debug(s_activityTimeState)
	//可能是GM指令开启的
	if (s_activityTimeState[index]) {
		retState = ActivityTimeState.ONGOING
	}

	if (retState == ActivityTimeState.ONGOING) {
		//时间如果大于活动时间，则查询服务器状态活动是否开启
		if (s_activityTimeState[index] == null) {
			retState = ActivityTimeState.FINISHED
		}

		if (OrdinaryActivityIndex.LINGTILI == index && getSaveRecord(opSaveRecordKey.dailyPower)) {
			retState = ActivityTimeState.FINISHED
		}
	}


	let info: any = {}
	info.state = retState//当前活动状态
	info.startTime = retTime //活动开始时间(如果活动是ready，可用来倒计时)
	info.timeIndex = retTimeIndex//当天时间列表里的索引（活动列表显示需要用到）
	info.week = retWeek//活动开启时候的星期

	//TLog.Debug_r(info)

	return info
}



