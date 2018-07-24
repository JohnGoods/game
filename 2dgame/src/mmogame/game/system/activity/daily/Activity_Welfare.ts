/*
作者:
    yangguiming
	
创建时间：
    2014.07.31(星期四) 

意图：
  每日签到活动

公共接口：
	getTimes(){//签到次数
	getisGet(){//领取礼物
	GetWarHorn(list){//-返回号角列表

*/

class Activity_Welfare extends ActivityBase {
	times
	isget
	warhorn_list

	public initObj(...args: any[]): void {
		this.onClear()
	}

	destory() {
		// UnRegisterEvent(EventDefine.UPDATE_WELFARE, this.onAutoShow, this)
        // UnRegisterEvent(EventDefine.TASK_COMMIT_FINISH, this.onAutoShow, this)
	}

	onPrepareResource() {
		// RegisterEvent(EventDefine.UPDATE_WELFARE, this.onAutoShow, this)
		// RegisterEvent(EventDefine.TASK_COMMIT_FINISH, this.onAutoShow, this)
	}

	onClear() {
		this.times = 0
		this.isget = 0
		this.warhorn_list = {}
		this.warhorn_list.index = 0
		this.warhorn_list.time = 0
		this.warhorn_list.isget = 0

	}

	updateQiandaoData(times, isget) {
		this.times = times
		this.isget = isget        
		FireEvent(EventDefine.EVERYDAYONLINE_UPDTAE, null)
	}

	getTimes() {
		return this.times
	}

	getisGet() {
		return this.isget
	}

	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////

	//-号角列表
	SetWarHorn(list) {
		this.warhorn_list = list
	}
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	//-返回号角列表
	GetWarHorn() {
		return this.warhorn_list
	}
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////

	

}