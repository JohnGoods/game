module MessageLogic{

//////////////////////////////////////////////////////////////////-
//发送聊天
export class Message_C2G_CHANNEL_SEND extends MessageBase {
	channel
	data
	name
	groupId

	public initObj(...args: any[]): void {
		this.channel = 0
		this.data = ""
		this.name = ""

		this.groupId = 0
	}

	pack(writer) {
		writer.writeUChar(this.channel)
		writer.writeString(this.data)
		if (this.channel == channelType.CHAT) {
			writer.writeUInt(this.name)
		} else if (this.channel == channelType.GROUP) {
			writer.writeUInt(Math.abs(this.groupId))					//客户端的讨论组id为负值
		}
	}

	unpack(reader) {

	}

}

export class ChannelMsgPacket extends RoleInfo {

	roleId
	name
	sexId
	channel
	data
	vocation
	VipLevel
	serverID
	factionID
	chatBubbleType
	icon:string;
	force
	level
	public initObj(...args: any[]): void {
		this.roleId = 0  //角色
		this.name = null //名字
		this.sexId = 0  //性别
		this.channel = 0	//当前频道
		this.data = "" //聊天信息内容
		this.vocation = 0		//职业entryId
		this.icon = ""

		//组队
		//this.type			= 0
		//this.teamInfo = null
		//this.count		= 0
		//this.school		= 0
		//this.level		= 0

	}

	read(reader){
		super.read(reader)

		this.roleId = this.id;
	}

	//////////////////////////////////////////////////////////////////-
	//收到聊天信息
}

export class Message_G2C_CHANNEL_SEND extends MessageBase {
	packet:ChannelMsgPacket


	public initObj(...args: any[]): void {
		this.packet = null
	}

	pack(writer) {

	}

	unpack(reader) {
		this.packet = ChannelMsgPacket.newObj()
		this.packet.roleId = reader.readUInt()						//ID
		this.packet.name = reader.readString()			//名字
		this.packet.vocation = reader.readUInt()						//职业
		this.packet.sexId = reader.readUChar()					//性别
		this.packet.VipLevel = reader.readUChar()					//Vip等级
		this.packet.icon 		= reader.readString()					//头像

		this.packet.force 	 = reader.readUInt()
		this.packet.level 	 = reader.readUInt()
		this.packet.factionID = reader.readUInt()

		this.packet.channel = reader.readUChar()
		this.packet.data = reader.readString() || ""
		this.packet.serverID = reader.readUInt() || 0
		this.packet.chatBubbleType 	 = reader.readUChar()
	
	}

	//////////////////////////////////////////////////////////////////-
	
}


//设置聊天气泡
export class Message_C2G_CHANNEL_WINDOW_TYPE extends MessageBase{
	chatBubbleType
public initObj(...args:any[]):void {
	this.chatBubbleType = 0
}

pack( writer){
	writer.writeUChar(this.chatBubbleType)
}

unpack( reader){
	
}

//////////////////////////////////////////////////////////////////-
}

//已解锁聊天气泡
// export class Message_G2C_ROLE_CHAT_WINDOW_LIST extends MessageBase{
// 	chatBubbleList
// public initObj(...args:any[]):void {
// 	this.chatBubbleList = {}
// }

// pack( writer){

// }

// unpack( reader){
// 	this.chatBubbleList = table_load(reader.readString())
// }

// }


//申请查看玩家信息
// export class Message_C2G_CHANNEL_PLAYER extends MessageBase {
// 	playerId
// 	public initObj(...args: any[]): void {
// 		this.playerId = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.playerId)
// 	}

// 	unpack(reader) {

// 	}

// 	//////////////////////////////////////////////////////////////////-
// 	//收到玩家数据
// }

// export class Message_G2C_CHANNEL_PLAYER extends MessageBase {
// 	playerInfo
// 	public initObj(...args: any[]): void {
// 		this.playerInfo = {}
// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {
// 		let playerInfo: any = {}
// 		playerInfo.id = reader.readUInt()
// 		if (playerInfo.id != 0) {
// 			playerInfo.school = reader.readUShort()
// 			playerInfo.sex = reader.readUShort()
// 			playerInfo.name = reader.readString()
// 			playerInfo.level = reader.readUInt()
// 			playerInfo.body = reader.readUInt()
// 			playerInfo.faction = reader.readString()
// 			this.playerInfo = playerInfo

// 		}

// 	}


// 	//////////////////////////////////////////////////////////////////-
// 	//系统公告
// }

export class Message_G2C_CHANNEL_SYSTEM extends MessageBase {
	sysType
	content
	isborad
	public initObj(...args: any[]): void {
		this.sysType = 0
		this.content = ""
		this.isborad = 0
	}

	pack(writer) {

	}

	unpack(reader) {
		this.isborad = reader.readChar()  //是否滚屏     0否 1是
		this.sysType = reader.readChar()  //是否系统频道 0否 1是
		this.content = reader.readString()
	}


	//////////////////////////////////////////////////////////////////-
	//获取物品信息
}

// export class Message_C2G_CHANNEL_PET_ITEM extends MessageBase {
// 	playerId
// 	rage
// 	uId

// 	public initObj(...args: any[]): void {
// 		this.playerId = null
// 		this.rage = null
// 		this.uId = null
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.playerId)
// 		writer.writeUInt(this.rage)
// 		writer.writeUInt(this.uId)
// 	}

// 	unpack(reader) {

// 	}


// }

// export class Message_G2C_CHANNEL_PET_ITEM extends MessageBase {
// 	info
// 	rage
// 	roleId
// 	public initObj(...args: any[]): void {
// 		this.rage = 0
// 		this.info = null
// 		this.roleId = 0
// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {
// 		this.rage = 0
// 		this.info = null
// 		this.rage = reader.readUShort()
// 		this.roleId = reader.readUInt()
// 		if (this.rage == 1) {											//宠物
// 			let petInfo = PetInfo.newObj()
// 			petInfo.read(reader)

// 			//读取装备
// 			let equipMsg = Message_G2C_EQUIP_LIST.newObj()
// 			equipMsg.unpack(reader)

// 			//设置装备
// 			ResetActorEquip(petInfo)

// 			for (let _ = 0; _ < equipMsg.equipInfoList.length; _++) {
// 				let info = equipMsg.equipInfoList[_]

// 				//物品列表
// 				for (let index = 0; index < info.itemList.length; index++) {
// 					let itemInfo = info.itemList[index]

// 					if (itemInfo.store == storeOptions.PETITEM) {
// 						let item = Item.newObj(itemInfo)
// 						SetActorEquip(petInfo, item)
// 					}
// 				}

// 			}

// 			this.info = petInfo
// 		} else if (this.rage == 2) {									//物品
// 			let itemInfo = ItemInfo.newObj()
// 			itemInfo.read(reader)
// 			this.info = itemInfo
// 		}
// 	}
// }

// 	//语音////////////////////////-
// export class Message_C2G_CHANNEL_VOICE extends MessageBase {
// 	channel
// 	roleId
// 	recordBuffer
// 	recordSize
// 	recordTime
// 	public initObj(...args: any[]): void {
// 		this.channel = null
// 		this.roleId = null
// 		this.recordBuffer = null
// 		this.recordSize = null
// 		this.recordTime = null
// 	}

// 	pack(writer) {
// 		writer.writeUChar(this.channel)
// 		writer.writeUShort(this.recordSize)
// 		writer.writeRawData(this.recordBuffer, this.recordSize)
// 		writer.writeUInt(this.recordTime)
// 		writer.writeUInt(this.roleId)
// 	}

// 	unpack(reader) {
// 	}
// }

// export class Message_G2C_CHANNEL_VOICE extends MessageBase {
// 	id
// 	name
// 	body
// 	VipLevel
// 	size

// 	buf
// 	channel
// 	recordTime
// 	roleInfo
// 	factionID
// 	public initObj(...args: any[]): void {
// 		this.id = null
// 		this.name = null
// 		this.body = null
// 		this.VipLevel = null
// 		this.size = null
// 		this.buf = null
// 		this.channel = null
// 		this.recordTime = null
// 		this.roleInfo = null
// 		this.factionID = null
// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {
// 		// this.roleInfo = RoleInfo.newObj()
// 		// this.roleInfo.read(reader)
// 		// this.id, this.name, this.vocation, this.VIPlevel, this.sexId = this.roleInfo.getRoleInfo()
// 		// this.channel = reader.readUChar()
// 		// this.size = reader.readUShort()
// 		// this.buf = Core.IAllocator.instance.Alloc(this.size, 0) //生成缓冲,主要接受的时候要析构
// 		// reader.readRawData(this.buf, this.size)
// 		// this.recordTime = reader.readUInt()
// 		// this.factionID = reader.readUInt()
// 	}
// 	//-语音id返回  目前用于世界聊天
// }

// export class Message_G2C_CHANNEL_VOICE_UID extends MessageBase {
// 	id
// 	name
// 	body
// 	VipLevel
// 	channel
// 	recordTime
// 	voiceID
// 	vocation
// 	sexId
// 	public initObj(...args: any[]): void {
// 		this.id = null
// 		this.name = null
// 		this.body = null
// 		this.VipLevel = null
// 		this.channel = null
// 		this.recordTime = null
// 		this.voiceID = null
// 	}

// 	pack(writer) {


// 	}

// 	unpack(reader) {
// 		// let roleInfo = RoleInfo.newObj()
// 		// roleInfo.read(reader)
// 		// this.id, this.name, this.vocation, this.VipLevel, this.sexId = roleInfo.getRoleInfo()
// 		// this.channel = reader.readUChar()
// 		// this.voiceID = reader.readUInt()
// 		// this.recordTime = reader.readUInt()
// 	}


// 	//-申请语音包byID 目前用于世界聊天
// }

// export class Message_C2G_CHANNEL_GET_VOICE extends MessageBase {
// 	channel
// 	voiceID
// 	public initObj(...args: any[]): void {
// 		this.channel = null
// 		this.voiceID = null
// 	}

// 	pack(writer) {

// 		writer.writeUInt(this.channel)
// 		writer.writeUInt(this.voiceID)
// 	}

// 	unpack(reader) {

// 	}

// 	//-申请语音包byID 目前用于世界聊天
// }

// export class Message_G2C_CHANNEL_GET_VOICE extends MessageBase {
// 	channel
// 	voiceID
// 	size
// 	buff
// 	public initObj(...args: any[]): void {
// 		this.channel = null
// 		this.voiceID = null
// 	}

// 	pack(writer) {


// 	}

// 	unpack(reader) {
// 		// this.channel = reader.readUInt()
// 		// this.voiceID = reader.readUInt()
// 		// this.size = reader.readUShort()
// 		// this.buf = Core.IAllocator.instance.Alloc(this.size, 0) //生成缓冲,主要接受的时候要析构
// 		// reader.readRawData(this.buf, this.size)
// 	}

// 	//抢答
// }

// export class Message_G2C_QIANGDA_QUESTION extends MessageBase {
// 	questionIndex
// 	public initObj(...args: any[]): void {
// 		this.questionIndex = 0
// 	}

// 	pack(writer) {
// 	}

// 	unpack(reader) {
// 		this.questionIndex = reader.readUInt()
// 	}

// 	//申请聊天记录 
// }

export class Message_C2G_CHANNEL_RECARD_SEND extends MessageBase {
	channelId
	public initObj(...args: any[]): void {
		this.channelId = 0
	}

	pack(writer) {
		writer.writeUInt(this.channelId)
	}

	unpack(reader) {
	}

	//返回聊天记录
}

export class Message_G2C_CHANNEL_RECARD_SEND extends MessageBase {
	recordList: any[];
	sexId
	public initObj(...args: any[]): void {
		this.recordList = []
	}

	pack(writer) {
	}

	unpack(reader) {
		this.recordList = []

		let channel = reader.readUChar()

		let count = reader.readUInt()
		for (let i = 1; i <= count; i++) {
			let packet = ChannelMsgPacket.newObj()
			//let roleInfo = RoleInfo.newObj()
			packet.read(reader)
			//[packet.roleId, packet.name, packet.vocation, packet.VipLevel, this.sexId] = roleInfo.getRoleInfo()
			if (channel == channelType.UNION) {
				packet.factionID = reader.readUInt()
			}

			packet.icon 		= reader.readString()					//头像
			packet.data 	 						= reader.readString() || ""
			packet.serverID 	 				= reader.readUInt() || 0
			packet.chatBubbleType 	 	= reader.readUChar()
			packet.force 	 = reader.readUInt()
			packet.level 	 = reader.readUInt()
			packet.factionID = reader.readUInt()
			
			packet.offlineChat = true
			JsUtil.arrayInstert(this.recordList, packet)
		}

		for (let _ = 0; _ < this.recordList.length; _++) {
			let packet = this.recordList[_]

			packet.channel = channel
		}
	}

}

}