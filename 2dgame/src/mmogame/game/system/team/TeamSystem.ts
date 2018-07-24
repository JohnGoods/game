/*
作者:
    panjunhua
	
创建时间：
   2014.8.18(周一)

意图：组队系统
	 
公共接口：		
		setTeamInfo( teamInfo){ 			//设置自己的队伍信息
		getTeamInfo(){  								//获取自己的队伍信息
		getTeamState(){  							//获取队伍的状态 ConfigTeamStatus.NULL 没有状态 .ACTIVITY_1 爬塔 .ACTIVITY_2 平行世界
		setMemberInfo( mem){					//设置队员info,必填mem.id,可选status、pos、level、body
		getMemberInfo( playerID){ 		//获得队员信息  返回member结构
		getCaptainId(){								//获取队长id
		getMemberPos( id){						//获取队员位置
		removeMember(id){  						//移除队员		
		isCaptain(){ 									//是否自己队长		
		isTeamMember( playerID){			//是否玩家在队伍里面
		isHaveTeam(){ 									//是否有队
		leaveTeam(){										//离开队伍
		emptyTeamInfo(){								//解散/离开队伍 清空teamInfo
		
*/

class TeamSystem extends BaseSystem {

	teamInfo: any;
	captionPos: number;
	timerTimeList: any;
	teamTimerList: any;
	fullTeamFightFlag: boolean;
	autoJoinFlag: boolean

	public initObj(...args: any[]): void {
		this.onClear()

		//RegisterEvent(EventDefine.ACTOR_GOTFUCOS, this.onActorClick, this)				//注册点击玩家 弹出选项组队
	}

	destory() {
		//UnRegisterEvent(EventDefine.ACTOR_GOTFUCOS, this.onActorClick, this)
	}

	prepareResource(workQueue) {
		// workQueue.addWorkUnit(createClosureWorkUnit( function(this)
		// 													CombatTeamVipConfig = readCSV("data\\config\\CombatTeamVip.csv")
		// 													CombatTeamFetterConfig = readCSV("data\\config\\CombatTeamFetter.csv")
		// 													UnionPrizeConfig = readCSV("data\\config\\UnionPrize.csv")//血盟奖励
		// 												}, this) 
		// 											)
	}


	onClear() {
		this.teamInfo = null
		this.captionPos = -1

		this.timerTimeList = {}					//保存截止时间
		
		for (let _ in (this.teamTimerList || {})) {
			let timer = this.teamTimerList[_]
			KillTimer(timer)
		}
		this.teamTimerList = {}					//内部定时
		this.fullTeamFightFlag = false
		this.autoJoinFlag = true
	}

	setTeamInfo(teamInfo) { //设置自己的队伍信息
		let lastTeamInfo = this.teamInfo

		this.teamInfo = teamInfo
		this.updateTeammatePos()

		if (lastTeamInfo == null) {					//原来队伍为空的时，设置队伍表示创建队伍
			FireEvent(EventDefine.TEAM_CREATE, null)
		} else {
			if (lastTeamInfo.count < 3 && this.teamInfo.count >= 3) {
				if (this.fullTeamFightFlag == true) {
					//发送战斗的指令
					this.beginTeamFight()
				}
			}
		}

		this.onTeamUpdate()
	}

	updateTeammatePos() { //更新队伍队员的位置 保证队长在第一位
		if (this.isHaveTeam()) {
			let list: any = []
			for (let id in this.teamInfo.members) {
				let member = this.teamInfo.members[id]

				if (id == this.teamInfo.captainId) {
					JsUtil.arrayInstert(list, 0, [id, member])
				} else {
					JsUtil.arrayInstert(list, [id, member])
				}
			}

			for (let index = 0; index < list.length; index++) {
				let elem = list[index]

				let member = elem[1]
				member.position = index
			}
		}
	}

	getTeamInfo() {   //获取自己的队伍信息
		return this.teamInfo
	}

	getTeamActData() {  							//获取队伍的状态 ConfigTeamStatus.NULL 没有状态 .ACTIVITY_1 爬塔 .ACTIVITY_2 平行世界
		if (!this.teamInfo) {
			return null
		}

		return this.teamInfo.activityData
	}

	getTeamId() { //获取队伍ID 没有队伍范围null
		if (this.teamInfo) {
			return this.teamInfo.uid
		}
		return null
	}

	emptyTeamInfo() {								//解散/离开队伍 清空teamInfo
		this.teamInfo = null
		this.timerTimeList = {}
		this.fullTeamFightFlag = false
		for (let _ in this.teamTimerList) {
			let timer = this.teamTimerList[_]
			KillTimer(timer)
		}
		this.teamTimerList = {}

		this.onTeamUpdate()
	}

	removeMember(id) {  //移除队员
		if (this.teamInfo == null) {
			return
		}

		if (this.teamInfo.members[id] != null) {
			let removePos = this.teamInfo.members[id].position
			delete this.teamInfo.members[id]
			this.teamInfo.count = this.teamInfo.count - 1

			//TLog.Debug("delete",#(this.teamInfo.members))
			for (let i in this.teamInfo.members) {
				let member = this.teamInfo.members[i]

				if (member.position > removePos) {
					this.teamInfo.members[i].position = this.teamInfo.members[i].position - 1
				}
			}
		}

		this.onTeamUpdate()
	}

	setMemberInfo(mem) {			//设置队员info
		//TLog.Assert(this.team.members[mem.id])
		if (this.teamInfo.members[mem.plrId] != null) {
			if (mem.status) {
				this.teamInfo.members[mem.plrId].status = mem.status
			}
			if (mem.position) {
				this.teamInfo.members[mem.plrId].position = mem.position
			}
			if (mem.level) {
				this.teamInfo.members[mem.plrId].level = mem.level
			}
			if (mem.body) {
				this.teamInfo.members[mem.plrId].body = mem.body
			}
		}
	}

	leaveTeam() {				//离开队伍
		this.emptyTeamInfo()
	}

	getMemberPos(id) {	//设置队员位置
		if (this.teamInfo.members[id]) {
			return this.teamInfo.members[id].position
		}
		return 3
	}

	isHaveTeam() { //判断自己是否有队
		if (this.teamInfo != null) {
			return true
		}
		return false
	}

	isCaptain() { //判断自己是否队长
		let bRet = false
		let hero = GetHeroPropertyInfo()
		if (hero && this.isHaveTeam()) {
			if (hero.id == this.teamInfo.captainId) {
				bRet = true
			}
		}
		return bRet
	}

	getMemberCount() {			 //获取队员数量
		if (!this.teamInfo) {
			return 0
		}
		return this.teamInfo.count
	}

	getMemberInfo(playerID) { //获得队员信息  返回member结构
		if (this.teamInfo.members[playerID]) {
			return this.teamInfo.members[playerID]
		}
		return null
	}

	isTeamMember(playerID) {		//判断玩家是否在队伍里面
		if (this.teamInfo) {
			if (this.teamInfo.members[playerID]) {
				return true
			}
		}
		return false
	}

	getCaptainId() { //获取队长id
		if (this.teamInfo == null) {
			return null
		}
		return this.teamInfo.captainId
	}

	isInTeam(id) {       //-通过ID查看是否在队伍里面
		if (!this.teamInfo) {
			return false
		}
		
		if (this.teamInfo.members[id] != null) {
			return true
		}

		return false
	}

	getTeamMemberList() {
		if (!this.teamInfo) {
			return {}
		}

		return this.teamInfo.members
	}

	onTeamUpdate() {
		FireEvent(EventDefine.TEAM_INFO_UPDATE, null)
	}

	////////////////////////////////////////////////
	setAutoJoinTeam(b) {
        this.autoJoinFlag = b
    }

	isAutoJoinTeam() {
		return this.autoJoinFlag
	}

	setFullTeamFight(b) {
		this.fullTeamFightFlag = b
	}

	beginTeamFight() {
		if (this.teamInfo == null) {
			return
		}
		if (this.isCaptain() == false) {
			return
		}

		let actInfo = this.teamInfo.activityData
		RpcProxy.call("C2G_CreateTeamBattle", actInfo)
	}

	joinRobotMember() {
		RpcProxy.call("C2G_AddRobotMember")
	}

	setTimerTime(name, deadline) {
		this.timerTimeList[name] = deadline
	}

	getTimerTime(name) {
		return checkNull(this.timerTimeList[name], 0)
	}

	setInteriorTeamTimer(name, callback?, obj?) {
		//内部定时跟this.timerTimeList匹配使用
		if (this.teamTimerList[name]) {
			KillTimer(this.teamTimerList[name])
			delete this.teamTimerList[name]
		}

		let time = checkNull(this.timerTimeList[name], 0)
		if (time == 0 || time - GetServerTime() < 0) {
			return
		}
		if (!callback || !obj) {
			return
		}

		let tick = function(delay) {
			callback.call(obj)

			if (this.teamTimerList[name]) {
				KillTimer(this.teamTimerList[name])
				delete this.teamTimerList[name] 
			}
		}
		this.teamTimerList[name] = SetTimer(tick, this, (time - GetServerTime()) * 1000, false)
	}

	clearInteriorTeamTimer(name) {
		if (this.teamTimerList[name]) {
			KillTimer(this.teamTimerList[name])
			delete this.teamTimerList[name] 
		}
	}
}