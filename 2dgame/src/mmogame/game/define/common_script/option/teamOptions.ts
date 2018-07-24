////////////////////////////////////////////////////////////////////////////////
//队伍配置
////////////////////////////////////////////////////////////////////////////////

//队伍玩家状态
var ConfigTeamMemberStatus:any = {
	ONLINE : 0,  //在线状态
	OFFLINE : 1, //离线状态
	LEAVE     : 2,  //暂离
	FOLLWER   : 3,  //跟随
}

//队伍配置
var ConfigTeam:any = {
	MAX_COUNT : 3, //最多三个人
	MIN_LEVEL : 10,//最低等级
}

//队伍状态
var ConfigTeamStatus:any = {
	//NULL : 0,       //没有状态
	//ACTIVITY_1 : 1, //爬塔
	//ACTIVITY_2 : 2, //混沌时空
	//ACTIVITY_TEAMWARFARE : 3,
	//ACTIVITY_3 : 4, //终极境地
	//ACTIVITY_4 : 5, //骑士团副本
	//ACTIVITY_5 : 6, //结婚玩法
}

//队伍阵型操作
var ConfigTeamQueue:any = {
	READY : 1,   //准备
	UNREADY : 2, //取消准备
	MOVE : 3,    //队长移动位置
	SET : 4,     //上阵
}

var teamAccept:any = {
	REJECT : 0,
	OK     : 1,
}



//////////////////////////////////////-
//战队配置
//////////////////////////////////////-
var ConfigCombatTeam:any = {
	MAX_MEMBER_COUNT : 3, //战队成员上限
	APPLY_MAX_COUNT  : 20,//申请者上限
	JOIN_LIMIT			 : 10,//申请者等级下限
	LEVEL_LIMIT			 : 10,//玩家创建战队的最低等级
	MAX_COUNT        : 1000,//战队最大数量
	MIN_LEVLE        : 10, //最低等级
}

//战队字节限制
var ConfigCombatCharMax:any = {
	MAX_NAME     : 18,           //战队名字最大字节数
	MIN_NAME     : 1,            //战队名字最少字节数
}

var opCombatTeamPost:any = {
	LEADER    : 1,
	MEMBER    : 2,
}
