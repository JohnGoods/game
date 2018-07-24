
//   公会申请列表

class ApplyRoleInfo extends TClass {
	id
	name
	vocation
	sexId
	VipLevel
	level
	time
	public initObj(...args: any[]): void {

	}

	read(reader) {
		this.id = reader.readUInt()						//ID
		this.name = reader.readString()			//名字
		this.vocation = reader.readUInt()				//职业
		this.sexId = reader.readUChar()			//性别
		this.VipLevel = reader.readUChar()			//Vip等级

		this.level = reader.readChar()                              //等级 
		this.time = reader.readUInt()                      					//时间 
	}
}



// 帮派信息对象
class ClubInfo extends TClass {
	id
	name
	icon
	leader
	leaderId
	level
	exp
	max_exp

	renqi
	max_renqi
	intro
	notice
	menberCount
	maxmenberCount
	createTime
	zhanli
	unionId
	rank
	warAutoApply
	
	public initObj(...args: any[]): void {

	}


	read(reader) {
		this.name = reader.readString()                     //名称
		this.id = reader.readUInt()                            //编号
		this.icon = reader.readUInt()  													//帮派图标 
		this.leader = reader.readString()                   //现任帮主
		this.leaderId = reader.readUInt()                   //现任帮主ID
		this.level = reader.readUInt()                          //帮派规模
		this.exp = reader.readUInt()                         		//经验
		this.max_exp = reader.readUInt()                     		//经验上限

		this.renqi = reader.readUInt()                          //人气度(当天签到总次数)
		this.max_renqi = reader.readUInt()                      //人气度上限

		this.intro = reader.readString()             				//宗旨
		this.notice = reader.readString()                   //公告(废弃)	

		this.menberCount = reader.readUInt()                 //成员人数
		this.maxmenberCount = reader.readUInt()									//人数上限

		this.createTime = reader.readString()								//创建时间
		this.zhanli = reader.readUInt()                 //总战力
		this.unionId = reader.readUInt()									//联盟ID
		this.rank = reader.readUInt()									//排行
		this.warAutoApply =	reader.readUChar()           //公会战自动报名

	}
}


//帮派成员对象
class ClubRoleInfo extends TClass {
	id
	name
	vocation
	sexId
	VipLevel
	post
	level
	online

	gongxian
	zhanli
	isDaySign
	logout
	renqi
	max_renqi

	public initObj(...args: any[]): void {

	}


	read(reader) {
		this.id = reader.readUInt()						//ID
		this.name = reader.readString()			//名字
		this.vocation = reader.readUInt()				//职业
		this.sexId = reader.readUChar()			//性别
		this.VipLevel = reader.readUChar()			//Vip等级
		this.post = reader.readChar()                     //职位  1团长 2副团长3 长老   7普通会员
		this.online = reader.readUInt()                   //1：在线 其他：离线时间
		this.level = reader.readChar()                   //等级
		this.gongxian = reader.readUInt()									//贡献
		this.zhanli = reader.readUInt()                    //战力
		this.isDaySign = reader.readUInt()  //是否签到 0没有 1签到了
		//this.gongxianCount = reader.readUInt()									//当前贡献次数
		//this.gongxian = reader.readUInt()									//军团建筑历史贡献值
		this.logout = reader.readUInt()   								//下线时间
		if (this.online != 1 && (!this.logout)) {
			this.logout = GetServerTime()
		}
		this.renqi = reader.readUInt()  //人气，消耗的体力转化成人气
		this.max_renqi = reader.readUInt()  //最大人气

	}
}
