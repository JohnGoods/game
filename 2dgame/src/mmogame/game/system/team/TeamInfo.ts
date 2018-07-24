// class TeamMember extends RoleInfo {
// 	id
// 	name
// 	level
// 	pos
// 	status
// 	body
// 	ready
// 	public initObj(...args: any[]): void {
// 		this.id = null					//玩家id
// 		this.name = null				//玩家姓名
// 		this.level = null			//玩家等级
// 		this.pos = null				//玩家在队伍里面位置  1 2 3 
// 		this.status = null    	//玩家状态	在线/离线 ConfigTeamMemberStatus.ONLINE ConfigTeamMemberStatus.OFFLINE
// 		this.body = null				//玩家形象
// 		this.ready = null				//进入活动确定
// 	}

// }

// class TeamApplyInfo extends RoleInfo {
// 	id
// 	name
// 	level
// 	body
// 	skytowerFloor
// 	public initObj(...args: any[]): void {
// 		this.id = null					//玩家id
// 		this.name = null				//玩家姓名
// 		this.level = null			//玩家等级
// 		this.body = null				//玩家形象
// 		this.skytowerFloor = null				//天空之塔层数
// 	}


	

// }

// class TeamInfo extends TClass {
// 	id
// 	captainId
// 	state
// 	count
// 	skytowerFloor
// 	membersList
// 	applyList
// 	teamDefenseQueue
// 	maxApplyCount
// 	teamTag

// 	public initObj(...args: any[]): void {
// 		this.id = null								//队伍id
// 		this.captainId = null				//队长id
// 		this.state = null						//队伍状态 OrdinaryActivityIndex.NULL 没有状态 .SKYTOWER 试练场 .SHENGDI 圣地
// 		this.count = null						//队员数量
// 		this.skytowerFloor = null			//队伍层数（天空之塔、毁灭领域）
// 		this.membersList = {} 			//队员信息列表	
// 		this.applyList = {}					//申请列表
// 		this.teamDefenseQueue = null		//[postion] = {plrId, petEntryId, ready, petLevel, petCombateForce, uid(职业/伙伴), breakLevel, qualityLevel}
// 		this.maxApplyCount = 15				//申请者上限
// 		this.teamTag = 0						//队伍的活动意向，默认是OrdinaryActivityIndex.CAMPAIGN关卡
// 	}

// }

// class TeamListInfo extends TClass {
// 	id
// 	captainID
// 	count
// 	skytowerFloor
// 	membersList

// 	public initObj(...args: any[]): void {
// 		this.id = null								//队伍id
// 		this.captainID = null					//队长id
// 		this.count = null						//队员数量
// 		this.skytowerFloor = null
// 		this.membersList = []					//队员信息列表
// 	}

// }

// class TeamListMemberInfo extends RoleInfo {

// 	name
// 	level
// 	vocation
// 	status
// 	VipLevel
// 	sexId
// 	public initObj(...args: any[]): void {
// 		this.name = null				//玩家姓名
// 		this.level = null			//玩家等级	
// 		this.vocation = null		//玩家等级
// 		this.VipLevel = null		//玩家vip等级
// 		this.sexId = null			//玩家性别
// 	}
// }


// class TeamSkyTowerInviteInfo extends RoleInfo {
// 	level
// 	skytowerFloor
// }