// TypeScript file
module MessageLogic{
export class Message_C2G_ROLE_REFRESH_NPC extends MessageBase {
	public initObj(...args: any[]): void {
	}

	pack(writer) {
	}

	unpack(writer) {
	}


}



	

//返回竞技场排名
export class Message_G2C_ROLE_CHAMPION_RANK extends MessageBase {
	isFirst
	public initObj(...args: any[]): void {
		this.isFirst = 0 //为1表示是第一名
	}

	pack(writer) {
	}

	unpack(reader) {
		this.isFirst = reader.readUInt()
	}

	//查询竞技场排名
}

export class Message_C2G_ROLE_CHAMPION_RANK extends MessageBase {

	public initObj(...args: any[]): void {
	}

	pack(writer) {
	}

	unpack(reader) {
	}

	//返回斗技大赛排名
}


export class Message_G2C_ROLE_CREATE_TIME extends MessageBase {
	creatRoleTime
	public initObj(...args: any[]): void {
		this.creatRoleTime = null
	}

	pack(writer) {
	}

	unpack(reader) {
		this.creatRoleTime = reader.readUInt()
	}

	//新手操作节点
}

export class Message_C2G_ROLE_OPER_NODE extends MessageBase {
	guideIndex
	public initObj(...args: any[]): void {
		this.guideIndex = null
		//this.isdump = true
	}

	pack(writer) {
		writer.writeUInt(this.guideIndex)
	}

	unpack(reader) {

	}


	//申请账号绑定奖励
}

export class Message_C2G_ROLE_BIND_ACCOUNT extends MessageBase {

	public initObj(...args: any[]): void {

	}

	pack(writer) {

	}

	unpack(reader) {

	}

	//好友邀请相关
}

// export class Message_C2G_ROLE_INVITE_FRIEND extends MessageBase {
// 	inviteType
// 	name
// 	public initObj(...args: any[]): void {
// 		this.inviteType = 0
// 		this.name = ""

// 		this.addResponseMsg(opCodes.G2C_ROLE_INVITE_FRIEND_LIST)
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.inviteType)
// 		writer.writeString(this.name)
// 	}

// 	unpack(reader) {

// 	}
// }

// export class Message_G2C_ROLE_INVITE_FRIEND extends MessageBase {

// 	public initObj(...args: any[]): void {

// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {

// 	}

// 	//申请列表
// }


export class Message_C2G_ROLE_CHANGE_NAME extends MessageBase {
	itemID
	newName
	public initObj(...args: any[]): void {
		this.itemID = null
		this.newName = null
	}
	pack(writer) {
		writer.writeUInt(this.itemID)
		writer.writeString(this.newName)
	}
	unpack(reader) {

	}

}

export class Message_G2C_ROLE_CHANGE_NAME extends MessageBase {
	newName
	public initObj(...args: any[]): void {
		this.newName = null
	}
	pack(writer) {

	}
	unpack(reader) {
		this.newName = reader.readString()
	}

	
}



export class Message_G2C_ROLE_FUNCTION_NOTICE extends MessageBase {
	noticeList
	public initObj(...args: any[]): void {
		this.noticeList = {}
	}

	pack(writer) {
	}

	unpack(reader) {
		this.noticeList = table_load(reader.readString())
	}
}




// export class Message_C2G_ROLE_REMOVE_TIMER extends MessageBase {
// 	opSaveRecordKey: number
// 	public initObj(...args: any[]): void {
// 		this.opSaveRecordKey = -1
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.opSaveRecordKey)
// 	}

// 	unpack(reader) {

// 	}

// }
}