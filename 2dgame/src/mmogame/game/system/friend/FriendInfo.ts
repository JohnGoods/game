/*
作者:
    LiRong
	
创建时间：
    2014.08.28(星期四) 

意图：
  	好友信息

公共接口：
	
*/



class StrangerInfo extends TClass {
	roleId
	roleName
	vocation
	icon
	sexId
	VipLevel
	level
	isOnline
	factionName
	public initObj(...args: any[]): void {
		this.roleId = args[0]
		this.roleName = args[1] || ""
		this.vocation = args[2] || 0
		this.icon = args[3] || ""
		this.sexId = args[4] || 0
		this.VipLevel = args[5] || 0
		this.level = args[6] || 0

		this.isOnline = 1
		this.factionName = ""
	}




}

class FriendInfo extends StrangerInfo {
	friendShip
	groupId
	state
	force
	faction
	public initObj(...args: any[]): void {
	}

	read(reader) {
		this.roleId = reader.readUInt()
		let friendInfo = table_load(reader.readString())
		this.roleName = friendInfo[friendTableOption.NAME]
		this.level = friendInfo[friendTableOption.LEVEL]
		this.factionName = friendInfo[friendTableOption.FACTION]
		this.vocation = friendInfo[friendTableOption.VOCATION] //职业
		this.friendShip = friendInfo[friendTableOption.FRIENDSHIP]
		this.groupId = friendInfo[friendTableOption.GROUPID]
		this.state = friendInfo[friendTableOption.STATE]
		this.isOnline = friendInfo[friendTableOption.ISONLINE]
		this.force = friendInfo[friendTableOption.FORCE]
		this.faction = friendInfo[friendTableOption.FACTION]
		this.sexId = friendInfo[friendTableOption.SEX]
		this.icon = friendInfo[friendTableOption.ICON]
		this.VipLevel = friendInfo[friendTableOption.VIPLEVEL] || 0

	}

	write(writer) {
	}

}

/*
作者:
    LiRong
	
创建时间：
    2014.09.01(星期一) 

意图：
  	接收离线消息

公共接口：
	
*/
class MessageInfo extends TClass {
	fromFriendId
	data
	time
	roleName
	VipLevel
	chatBubbleType

	icon
	vocation
	sexId
	isSelfSend

	readState
	MsgType

	public initObj(...args: any[]): void {
		this.fromFriendId = args[0] || 0
		this.data = args[1] || ""
		this.time = args[2] || 0

		this.roleName = args[3] || ""
		this.VipLevel = args[4] || 0
		this.chatBubbleType = args[5] || 0


		this.icon = ""
		this.vocation = 0
		this.sexId = 0

		this.isSelfSend = false
		this.readState = 0

		this.MsgType = null
	}

	setIconInfo(icon, vocation, sexId) {
		this.icon = icon || ""
		this.vocation = vocation
		this.sexId = sexId
	}

}