/*
作者:
   li_an
	
创建时间：
   2014.2.11(周二)

意图：
   好友消息

公共接口：
   
*/
//}

//export class Message_C2G_FRIEND_LIST extends MessageBase{
//public initObj(...args:any[]):void {
//
//}
//
//pack( writer){
//
//}
//
//unpack( reader){
//
//}
//

module MessageLogic{
export class Message_G2C_FRIEND_LIST extends MessageBase {
    friend_list
    public initObj(...args: any[]): void {
        this.friend_list = {}
    }

    pack(writer) {

    }

    unpack(reader) {
        let friend_list: any = {}
        let friendCount = reader.readUInt()
        for (let i = 1; i <= friendCount; i++) {
            let friendInfo = FriendInfo.newObj()
            friendInfo.read(reader)
            friend_list[friendInfo.roleId] = friendInfo
        }
        this.friend_list = friend_list
    }

    //未读信息数量
}

export class Message_G2C_FRIEND_OFFLINE_MESSAGE_COUNT extends MessageBase {
    friend_msg_count: any[]
    public initObj(...args: any[]): void {
        this.friend_msg_count = []
        //this.fireEvent = true
        this.isdump = true
    }

    pack(writer) {
    }

    unpack(reader) {
        let friend_msg_count = []
        let count = reader.readUInt()
        for (let i = 1; i <= count; i++) {
            let friendInfo = FriendInfo.newObj()
            friendInfo.read(reader)

            let packet: any = {}
            packet.friendInfo = friendInfo
            packet.channel = reader.readUChar()
            packet.data = reader.readString()

            JsUtil.arrayInstert(friend_msg_count, packet)
        }
        this.friend_msg_count = friend_msg_count
    }

}

export class Message_G2C_APPLY_FRIEND_INFO extends MessageBase {
    stranger_list: any[]
    public initObj(...args: any[]): void {
        this.stranger_list = []
        this.fireEvent = true
    }

    pack(writer) {

    }

    unpack(reader) {
        let stranger_list = []
        let strangerCount = reader.readUInt()
        for (let i = 1; i <= strangerCount; i++) {
            let strangerInfo = FriendInfo.newObj()
            strangerInfo.read(reader)
            JsUtil.arrayInstert(stranger_list, strangerInfo)
        }
        this.stranger_list = stranger_list
    }

    //查找玩家
}

export class Message_C2G_FRIEND_FIND extends MessageBase {
    searchName
    sendType
    public initObj(...args: any[]): void {
        this.searchName = ""
        this.sendType = null
    }

    pack(writer) {
        writer.writeString(this.searchName)
        writer.writeUInt(this.sendType)
    }

    unpack(reader) {

    }

    //
    //添加好友
}

export class Message_C2G_APPLY_FRIEND_ADD extends MessageBase {
    playerId
    public initObj(...args: any[]): void {
        this.playerId = null
    }
    pack(writer) {
        writer.writeUInt(this.playerId)
    }
    unpack(reader) {
    }

    //申请信息
}

export class Message_G2C_APPLY_FRIEND_ADD extends MessageBase {
    tempFriend: FriendInfo
    public initObj(...args: any[]): void {
        this.tempFriend = null;
        this.fireEvent = true
    }
    pack(writer) {

    }
    unpack(reader) {
        let friendInfo = FriendInfo.newObj()
        friendInfo.read(reader)
        this.tempFriend = friendInfo
    }

}

export class Message_C2G_APPLY_FRIEND_ADD_AGREE extends MessageBase {
    friendId
    isAgree
    public initObj(...args: any[]): void {
        this.friendId = null
        this.isAgree = null
    }
    pack(writer) {
        writer.writeUInt(this.friendId)
        writer.writeUInt(this.isAgree)
    }
    unpack(reader) {
    }


}

export class Message_G2C_APPLY_FRIEND_ADD_AGREE extends MessageBase {
    friendIdToDelete
    friendInfo: FriendInfo
    public initObj(...args: any[]): void {
        this.friendIdToDelete = null
        this.friendInfo = null
    }

    pack(writer) {
    }

    unpack(reader) {
        //this.friendIdToDelete=reader.readUInt()

        let friendInfo = FriendInfo.newObj()
        friendInfo.read(reader)
        this.friendInfo = friendInfo

        this.friendIdToDelete = friendInfo.roleId
    }

    //删除好友,发送到服务器
}

export class Message_C2G_FRIEND_DEL extends MessageBase {
    friendIdToDelete
    public initObj(...args: any[]): void {
        this.friendIdToDelete = null
    }

    pack(writer) {
        writer.writeUInt(this.friendIdToDelete)
    }

    unpack(reader) {
    }

    //删除好友，服务器返回
}

//赠送好友币(是否一键,好友ID)
export class Message_C2G_FRIEND_SEND_YOUQINGBI extends MessageBase {
    oneKey
    roleId
    public initObj(...args: any[]): void {
        this.oneKey = null
        this.roleId = null
    }

    pack(writer) {
        writer.writeUInt(this.oneKey)
        writer.writeUInt(this.roleId)
    }

    unpack(reader) {

    }
}

//接受好友币(是否一键,好友ID)
export class Message_C2G_FRIEND_GET_YOUQINGBI extends MessageBase {
    oneKey
    roleId
    public initObj(...args: any[]): void {
        this.oneKey = null
        this.roleId = null
    }

    pack(writer) {
        writer.writeUInt(this.oneKey)
        writer.writeUInt(this.roleId)
    }

    unpack(reader) {

    }
}


export class Message_G2C_FRIEND_DEL extends MessageBase {
    friendIdToDelete
    public initObj(...args: any[]): void {
        this.friendIdToDelete = null
    }

    pack(writer) {
    }

    unpack(reader) {
        this.friendIdToDelete = reader.readUInt()
    }


    //好友上线
}

export class Message_G2C_FRIEND_ONLINE extends MessageBase {
    friendId
    public initObj(...args: any[]): void {
        this.friendId = null
    }
    pack(writer) {

    }
    unpack(reader) {
        let friendId = reader.readUInt()
        this.friendId = friendId
    }
    //好友下线
}

export class Message_G2C_FRIEND_OFFLINE extends MessageBase {
    friendId
    public initObj(...args: any[]): void {
        this.friendId = null
    }
    pack(writer) {

    }
    unpack(reader) {
        let friendId = reader.readUInt()
        this.friendId = friendId
    }


}

export class Message_C2G_FRIEND_RECOMMEND_FRIENDS extends MessageBase {
    public initObj(...args: any[]): void {

    }
    pack(writer) {

    }
    unpack(reader) {

    }
    //推荐好友列表
}

export class Message_G2C_FRIEND_RECOMMEND_FRIENDS extends MessageBase {
    recommendList: FriendInfo[]
    public initObj(...args: any[]): void {
        this.recommendList = []
    }
    pack(writer) {

    }
    unpack(reader) {
        let recommendList = []
        let count = reader.readUInt()
        TLog.Debug("Message_G2C_FRIEND_RECOMMEND_FRIENDS", count)
        for (let i = 1; i <= count; i++) {
            let friendInfo = FriendInfo.newObj()
            friendInfo.read(reader)
            JsUtil.arrayInstert(recommendList, friendInfo)
        }
        this.recommendList = recommendList
    }

    //删除推荐好友
}

export class Message_C2G_DELETE_RECOMMEND_FRIEND extends MessageBase {
    deleteID
    public initObj(...args: any[]): void {
        this.deleteID = null
    }
    pack(writer) {
        writer.writeUInt(this.deleteID)
    }
    unpack(reader) {

    }

    //删除推荐好友
}

export class Message_G2C_DELETE_RECOMMEND_FRIEND extends MessageBase {
    public initObj(...args: any[]): void {
        //this.deleteID= null
    }
    pack(writer) {
        //writer.writeUInt(this.deleteID)
    }
    unpack(reader) {

    }



    //陌生人首次发来信息的时候
}

export class Message_G2C_FRIEND_SINGLE_INFO extends MessageBase {
    tempFriend
    getSendType
    public initObj(...args: any[]): void {
        this.tempFriend = null
        this.getSendType = null
    }
    pack(writer) {

    }
    unpack(reader) {
        this.tempFriend = StrangerInfo.newObj()
        this.tempFriend.roleId = reader.readUInt()
        this.tempFriend.roleName = reader.readString()
        this.tempFriend.vocation = reader.readUInt()
        this.tempFriend.sexId = reader.readUChar()
        this.tempFriend.factionName = reader.readString()
        this.tempFriend.level = reader.readUInt()
        //this.tempFriend.VipLevel=reader.readUInt()
    }


    //发出信息
}

export class Message_C2G_FRIEND_SEND_MESSAGE_ONE extends MessageBase {
    receiverId
    data
    public initObj(...args: any[]): void {
        this.receiverId = null
        this.data = null
    }
    pack(writer) {
        writer.writeUInt(this.receiverId)
        writer.writeString(this.data)
    }
    unpack(reader) {
    }

    //收到信息
    //}

    //export class Message_G2C_FRIEND_SEND_MESSAGE_ONE extends MessageBase{
    //public initObj(...args:any[]):void {
    //	/*
    //	this.fromFriendId=null
    //	this.data=null
    //	this.time=null
    //	//*/
    //	this.messageInfo=null
    //	this.fireEvent=true
    //
    //}
    //pack( writer){
    //}
    //
    //unpack( reader){
    //
    //	let messageInfo=MessageInfo.newObj()
    //	messageInfo.read(reader)
    //	this.messageInfo=messageInfo
    //}

    //收到信息确认
}

export class Message_G2C_FRIEND_SEND_MESSAGE_SUCCESS extends MessageBase {
    succeed
    public initObj(...args: any[]): void {
        this.succeed = 0
    }
    pack(writer) {
    }

    unpack(reader) {
        this.succeed = reader.readUInt()
    }

    //聊天中的陌生人信息
}

export class Message_G2C_STRANGER_INFO extends MessageBase {
    chat_stranger
    public initObj(...args: any[]): void {
        this.chat_stranger = null
    }
    pack(writer) {
    }

    unpack(reader) {
        let chat_stranger = FriendInfo.newObj()
        chat_stranger.read(reader)
        this.chat_stranger = chat_stranger
    }

    //个人名片
}

// export class Message_C2G_PLAYER_SET_CARD extends MessageBase {
//     str_QQ
//     str_WeChat
//     isShow
//     str_Phone
//     public initObj(...args: any[]): void {
//         this.str_QQ = null
//         this.str_WeChat = null
//         this.isShow = null

//         this.str_Phone = null
//     }
//     pack(writer) {
//         writer.writeUInt(this.isShow)
//         writer.writeString(this.str_QQ)
//         writer.writeString(this.str_WeChat)
//         writer.writeString(this.str_Phone)
//     }

//     unpack(reader) {

//     }

// }

// export class Message_G2C_PLAYER_SET_CARD extends MessageBase {
//     str_QQ
//     str_WeChat
//     public initObj(...args: any[]): void {
//         //没数据返回，有返回就是成功 
//     }
//     pack(writer) {
//         writer.writeString(this.str_QQ)
//         writer.writeString(this.str_WeChat)
//     }

//     unpack(reader) {

//     }

// }

// export class Message_C2G_PLAYER_GET_CARD extends MessageBase {
//     playerName
//     public initObj(...args: any[]): void {
//         this.playerName = null //名字或者ID
//     }
//     pack(writer) {
//         writer.writeString(this.playerName)
//     }

//     unpack(reader) {

//     }

// }

// export class Message_G2C_PLAYER_GET_CARD extends MessageBase {
//     playerID
//     playerCardInfo
//     public initObj(...args: any[]): void {
//         this.playerID = null //名字或者ID
//         this.playerCardInfo = null
//     }
//     pack(writer) {

//     }

//     unpack(reader) {
//         this.playerID = reader.readUInt()
//         let str = reader.readString()
//         //TLog.Debug(str)
//         this.playerCardInfo = table_load(str)
//     }

//     ////////////////////////-黑名单//////////////-
//     //把某个ＩＤ加入黑名单
// }

export class Message_C2G_ROLE_ADD_BLACK_ROLE extends MessageBase {
    playerID
    playerName
    public initObj(...args: any[]): void {
        this.playerID = null
        this.playerName = null
    }
    pack(writer) {
        writer.writeUInt(this.playerID)
        writer.writeString(this.playerName)
    }
    unpack(reader) {

    }
    //把某个ＩＤ从黑名单中移除
}

export class Message_C2G_ROLE_REMOVE_BLACK_ROLE extends MessageBase {
    playerID
    public initObj(...args: any[]): void {
        this.playerID = null
    }
    pack(writer) {
        writer.writeUInt(this.playerID)
    }
    unpack(reader) {

    }
    //请求黑名单列表
}

export class Message_C2G_ROLE_REQUEST_BLACK_ROLE extends MessageBase {
    public initObj(...args: any[]): void {

    }
    pack(writer) {

    }
    unpack(reader) {

    }
    //返回黑名单列表
}

export class Message_G2C_ROLE_RESONPD_BLACK_ROLE extends MessageBase {
    blackList
    public initObj(...args: any[]): void {
        this.blackList = null
    }
    pack(writer) {

    }
    unpack(reader) {
        this.blackList = table_load(reader.readString())
    }
    ////////////////////////-黑名单 }//////////////-
    ////////////////////////-屏蔽好友申请//////////////-
}

export class Message_C2G_REJECT_FRIEND_ADD extends MessageBase {
    sendStatus
    public initObj(...args: any[]): void {
        this.sendStatus = null
    }
    pack(writer) {
        writer.writeUShort(this.sendStatus)
    }
    unpack(reader) {

    }
}

export class Message_C2G_REJECT_FRIEND_ADD_STATE extends MessageBase {
    public initObj(...args: any[]): void {

    }
    pack(writer) {

    }
    unpack(reader) {

    }
}

export class Message_G2C_REJECT_FRIEND_ADD extends MessageBase {
    getServerAddType
    public initObj(...args: any[]): void {
        this.getServerAddType = null
    }
    pack(writer) {

    }
    unpack(reader) {
        this.getServerAddType = reader.readUShort()
    }
    ////////////////////////-屏蔽好友申请 }//////////////-

    
}

//////////////////////////好友群聊////////////////////////////////
    //创建讨论组
// export class Message_C2G_CHAT_GROUP_CREATE extends MessageBase {
//     public initObj(...args: any[]): void {

//     }
//     pack(writer) {

//     }
//     unpack(reader) {

//     }

//     //创建讨论组
// }

// export class Message_G2C_CHAT_GROUP_CREATE extends MessageBase {
//     groupId
//     public initObj(...args: any[]): void {
//         this.groupId = 0
//     }
//     pack(writer) {

//     }
//     unpack(reader) {
//         this.groupId = reader.readUInt()
//     }


//     //更新讨论组信息
// }

// export class Message_G2C_CHAT_GROUP_UPDATE_INFO extends MessageBase {
//     groupid
//     masterid
//     mastername
//     masterbody
//     createtime
//     lastchat

//     messagetable: any[]

//     public initObj(...args: any[]): void {
//         this.groupid = null
//         this.masterid = null
//         this.mastername = ""
//         this.masterbody = ""
//         this.createtime = ""
//         this.lastchat = null
//     }
//     pack(writer) {


//     }
//     unpack(reader) {
//         this.groupid = reader.readUInt()
//         this.masterid = reader.readUInt()
//         this.mastername = reader.readString()
//         this.masterbody = reader.readString()
//         this.createtime = reader.readString()
//         this.lastchat = reader.readUInt()

//         this.messagetable = []

//         JsUtil.arrayInstert(this.messagetable, this.groupid)

//         JsUtil.arrayInstert(this.messagetable, this.masterid)
//         JsUtil.arrayInstert(this.messagetable, this.mastername)
//         JsUtil.arrayInstert(this.messagetable, this.masterbody)
//         JsUtil.arrayInstert(this.messagetable, this.createtime)
//         JsUtil.arrayInstert(this.messagetable, this.lastchat)

//     }

//     //获取所有成员
// }

// export class Message_C2G_CHAT_GROUP_QUERY_MEMBERS extends MessageBase {
//     groupId
//     public initObj(...args: any[]): void {
//         this.groupId = 0
//     }
//     pack(writer) {

//         writer.writeUInt(this.groupId)
//     }
//     unpack(reader) {

//     }

//     //获取所有成员
// }

// export class Message_G2C_CHAT_GROUP_QUERY_MEMBERS extends MessageBase {
//     membersCount
//     members
//     groupid
//     public initObj(...args: any[]): void {
//         this.members = []
//         this.membersCount = 0
//     }
//     pack(writer) {

//     }
//     unpack(reader) {
//         this.members = []
//         this.membersCount = 0
//         this.membersCount = reader.readUInt()
//         this.groupid = reader.readUInt()

//         for (let i = 1; i <= this.membersCount; i++) {
//             let list: any = {}
//             list["memberId"] = reader.readUInt()
//             list["memberbody"] = reader.readUInt()
//             list["memberlv"] = reader.readUInt()
//             list["memberVipLevel"] = reader.readUInt()
//             list["membergroupPost"] = reader.readUInt()
//             list["memberlogoutTime"] = reader.readUInt()
//             list["membername"] = reader.readString()
//             list["menberyuanfen"] = reader.readUInt()
//             list["faction"] = reader.readString()
//             JsUtil.arrayInstert(this.members, list)
//         }

//     }


//     //邀请加入讨论组
// }

// export class Message_C2G_CHAT_GROUP_INVITE_JOIN extends MessageBase {
//     groupId
//     inviteList
//     public initObj(...args: any[]): void {
//         this.groupId = null
//         this.inviteList = {}
//     }
//     pack(writer) {
//         writer.writeUInt(this.groupId)
//         writer.writeString(table_save(this.inviteList))
//     }
//     unpack(reader) {

//     }

//     //邀请加入讨论组
// }

// export class Message_G2C_CHAT_GROUP_INVITE_JOIN extends MessageBase {
//     bodyId
//     inviteName
//     chatGroupid
//     chatGroupName

//     messageList: any[]

//     public initObj(...args: any[]): void {
//         this.bodyId = null
//         this.inviteName = ""
//         this.chatGroupid = null
//         this.chatGroupName = ""
//     }
//     pack(writer) {

//     }
//     unpack(reader) {
//         this.bodyId = reader.readUInt()
//         this.inviteName = reader.readString()
//         this.chatGroupid = reader.readUInt()
//         this.chatGroupName = reader.readString()
//         this.messageList = []
//         JsUtil.arrayInstert(this.messageList, this.bodyId)
//         JsUtil.arrayInstert(this.messageList, this.inviteName)
//         JsUtil.arrayInstert(this.messageList, this.chatGroupid)
//         JsUtil.arrayInstert(this.messageList, this.chatGroupName)

//     }

//     //同意加入讨论组
// }

// export class Message_C2G_CHAT_GROUP_AGREE_JOIN extends MessageBase {
//     groupId
//     agree
//     public initObj(...args: any[]): void {
//         this.groupId = null
//         this.agree = null
//     }
//     pack(writer) {
//         writer.writeUInt(this.groupId)
//         writer.writeUInt(this.agree)
//     }
//     unpack(reader) {

//     }

//     //同意讨论组
// }

// export class Message_G2C_CHAT_GROUP_AGREE_JOIN extends MessageBase {
//     groupId
//     public initObj(...args: any[]): void {
//         this.groupId = null
//     }
//     pack(writer) {

//     }
//     unpack(reader) {
//         this.groupId = reader.readUInt()
//     }

//     //退出讨论组
// }

// export class Message_C2G_CHAT_GROUP_QUIT extends MessageBase {
//     groupId
//     public initObj(...args: any[]): void {
//         this.groupId = 0
//     }
//     pack(writer) {
//         writer.writeUInt(this.groupId)
//     }
//     unpack(reader) {

//     }



//     //退出讨论组
// }

// export class Message_G2C_CHAT_GROUP_QUIT extends MessageBase {
//     groupId
//     public initObj(...args: any[]): void {
//         this.groupId = 0
//     }
//     pack(writer) {

//     }
//     unpack(reader) {
//         this.groupId = reader.readUInt()
//     }

//     //被开除
// }

// export class Message_G2C_CHAT_GROUP_EXPELEE extends MessageBase {
//     groupid
//     public initObj(...args: any[]): void {
//         this.groupid = 0
//     }
//     pack(writer) {

//     }
//     unpack(reader) {
//         this.groupid = reader.readUInt()
//     }

//     //开除
// }

// export class Message_C2G_CHAT_GROUP_EXPELEE extends MessageBase {
//     groupid
//     expeleeid
//     public initObj(...args: any[]): void {
//         this.groupid = 0
//         this.expeleeid = 0
//     }
//     pack(writer) {
//         writer.writeUInt(this.groupid)
//         writer.writeUInt(this.expeleeid)
//     }
//     unpack(reader) {

//     }

//     //聊天
// }

// export class Message_C2G_CHAT_GROUP_CHAT extends MessageBase {
//     public initObj(...args: any[]): void {

//     }
//     pack(writer) {

//     }
//     unpack(reader) {

//     }

//     //聊天
// }

// export class Message_G2C_CHAT_GROUP_CHAT extends MessageBase {
//     groupContent
//     public initObj(...args: any[]): void {
//         this.groupContent = {}
//     }
//     pack(writer) {

//     }
//     unpack(reader) {
//         //客户端对讨论组的处理跟stranger一样，但由于讨论组id可能与正常角色的id重合，
//         //所以客户端的讨论组id自动转存为负值
//         let t: any = {}
//         t.playerId = reader.readUInt()				//发言人id
//         t.playerName = reader.readString()	//发言者名字
//         t.body = reader.readUInt()				//发言人头像
//         t.VipLevel = reader.readUInt()				//发言人vip等级
//         t.channel = reader.readUChar()			//频道类型
//         t.data = reader.readString()	//聊天内容
//         t.serverId = reader.readUInt()				//服务器id
//         t.fromFriendId = -1 * (reader.readUInt() )				//讨论组id
//         t.roleName = reader.readString()	//创建者名字，用于显示讨论组名称用

//         t.time = GetServerTime()				//时间

//         let t1: any = {}
//         t1.playerId = t.playerId 						//发言人id
//         t1.body = t.body								//发言人头像
//         t1.VipLevel = t.VipLevel						//发言人vip等级
//         t1.channel = t.channel							//频道类型
//         t1.playerName = t.playerName          //发言人名字
//         t.extentData = t1

//         this.groupContent = t


//         //this.fromFriendId=reader.readUInt()
//         //this.data=reader.readString()
//         //this.time=reader.readUInt()
//     }



//     //聊天组列表
// }

// export class Message_C2G_CHAT_GROUP_LIST extends MessageBase {
//     public initObj(...args: any[]): void {

//     }
//     pack(writer) {

//     }
//     unpack(reader) {

//     }

//     //聊天列表返回
// }

// export class Message_G2C_CHAT_GROUP_LIST extends MessageBase {
//     GroupCount
//     GroupList: any[]
//     public initObj(...args: any[]): void {
//         this.GroupCount = 0
//         this.GroupList = []
//     }
//     pack(writer) {

//     }
//     unpack(reader) {
//         this.GroupCount = reader.readUInt()
//         this.GroupList = []
//         for (let i = 1; i <= this.GroupCount; i++) {
//             let list: any = {}
//             list["groupid"] = reader.readUInt()
//             list["createrid"] = reader.readUInt()
//             list["creatername"] = reader.readString()
//             list["createrbody"] = reader.readUInt()
//             list["createtime"] = reader.readUInt()
//             list["lasttime"] = reader.readUInt()
//             JsUtil.arrayInstert(this.GroupList, list)
//         }
//     }

//    
// }
//  //申请免扰返回
// export class Message_G2C_NO_TROUBLE_SETTING extends MessageBase {
//     groupList
//     public initObj(...args: any[]): void {
//         this.groupList = {}
//     }
//     pack(writer) {

//     }
//     unpack(reader) {
//         this.groupList = table_load(reader.readString())
//     }

//     //申请免扰
// }

// export class Message_C2G_NO_TROUBLE_SETTING extends MessageBase {
//     mode
//     GroupId
//     public initObj(...args: any[]): void {

//         this.mode = 0
//         this.GroupId = 0
//     }
//     pack(writer) {
//         writer.writeUInt(this.mode)
//         writer.writeUInt(this.GroupId)
//     }
//     unpack(reader) {

//     }


   
// }
//  //查询免扰返回
// export class Message_G2C_SELECT_NO_TROUBLE_SETTING extends MessageBase {
//     groupList
//     public initObj(...args: any[]): void {

//     }
//     pack(writer) {

//     }
//     unpack(reader) {
//         this.groupList = table_load(reader.readString())
//     }

//     //查询免扰
// }

// export class Message_C2G_SELECT_NO_TROUBLE_SETTING extends MessageBase {
//     public initObj(...args: any[]): void {

//     }
//     pack(writer) {

//     }
//     unpack(reader) {

//     }

//     //邀请列表
// }

// export class Message_C2G_CHAT_GROUP_INVITE_LIST extends MessageBase {
//     public initObj(...args: any[]): void {


//     }
//     pack(writer) {

//     }
//     unpack(reader) {

//     }

//     //邀请列表
// }

// export class Message_G2C_CHAT_GROUP_INVITE_LIST extends MessageBase {
//     inviteCount
//     inviteList

//     public initObj(...args: any[]): void {
//         this.inviteCount = 0
//         this.inviteList = {}
//         this.fireEvent = true
//     }
//     pack(writer) {


//     }
//     unpack(reader) {
//         this.inviteList = {}
//         this.inviteCount = reader.readUInt()
//         for (let i = 1; i <= this.inviteCount; i++) {
//             let list: any = []
//             let body = reader.readUInt()
//             let inviteName = reader.readString()
//             let groupid = reader.readUInt()
//             let masterName = reader.readString()
//             let inviterLv = reader.readUInt()
//             JsUtil.arrayInstert(list, body)
//             JsUtil.arrayInstert(list, inviteName)
//             JsUtil.arrayInstert(list, groupid)
//             JsUtil.arrayInstert(list, masterName)
//             JsUtil.arrayInstert(list, inviterLv)
//             JsUtil.arrayInstert(this.inviteList, list)
//         }

//     }


//     //解散
// }

// export class Message_G2C_CHAT_GROUP_REALSE extends MessageBase {
//     groupId

//     public initObj(...args: any[]): void {
//         this.groupId = 0
//     }
//     pack(writer) {


//     }
//     unpack(reader) {

//         this.groupId = reader.readUInt()
//     }


// }

// export class Message_C2G_FRIEND_INFO_REQUEST extends MessageBase {
//     public initObj(...args: any[]): void {

//     }
//     pack(writer) {


//     }
//     unpack(reader) {


//     }



// }

//赠送体力
// export class Message_C2G_FRIEND_GIVE_ITEM extends MessageBase {
//     friendIdList
//     public initObj(...args: any[]): void {
//         //this.friendId = 0
//         this.friendIdList = {}
//     }

//     pack(writer) {
//         //writer.writeUInt(this.friendId)
//         writer.writeString(table_save(this.friendIdList))
//     }

//     unpack(reader) {

//     }

//     //已赠送体力好友列表返回
// }

// export class Message_G2C_FRIEND_GIVE_ITEM extends MessageBase {
//     friendIdList
//     public initObj(...args: any[]): void {
//         this.friendIdList = {}
//     }

//     pack(writer) {

//     }

//     unpack(reader) {
//         this.friendIdList = table_load(reader.readString())
//     }

//     //申请已送体力好友列表
// }

// export class Message_C2G_FRIEND_GIVE_ITEM_RECORD extends MessageBase {
//     public initObj(...args: any[]): void {

//     }

//     pack(writer) {

//     }

//     unpack(reader) {

//     }

// }

//某个好友的信息更新
export class Message_G2C_FRIEND_UPPDATE_INFO extends MessageBase{
    friendInfo:FriendInfo;
public initObj(...args:any[]):void {
	this.friendInfo = null
}

pack( writer){

}

unpack( reader){
	let friendInfo = FriendInfo.newObj()
	friendInfo.read(reader)
	this.friendInfo = friendInfo
}
}

}