/*
作者:
   li_an
	
创建时间：
   2014.2.11(周二)

意图：
   好友消息

公共接口：
   
*/
class FriendMessageHandler extends MessageHandler {

    public initObj(...args: any[]): void {
        this.register(opCodes.G2C_FRIEND_LIST, this.onRecvG2C_FRIEND_LIST, this)		//更新好友列表
        this.register(opCodes.G2C_APPLY_FRIEND_ADD, this.onRecvG2C_APPLY_FRIEND_ADD, this)		//好友申请	
        this.register(opCodes.G2C_APPLY_FRIEND_INFO, this.onRecvG2C_APPLY_FRIEND_INFO, this)		//好友申请列表

        this.register(opCodes.G2C_APPLY_FRIEND_ADD_AGREE, this.onRecvG2C_APPLY_FRIEND_ADD_AGREE, this) //好友申请同意

        this.register(opCodes.G2C_FRIEND_SINGLE_INFO, this.onRecvG2C_FRIEND_SINGLE_INFO, this)  //陌生人第一次发信息过来

        this.register(opCodes.G2C_FRIEND_DEL, this.onRecvG2C_FRIEND_DEL, this)
        //接收对话
        //this.register(opCodes.G2C_FRIEND_SEND_MESSAGE_ONE,this.onRecvG2C_FRIEND_SEND_MESSAGE_ONE,this)
        //聊天中的陌生人
        this.register(opCodes.G2C_STRANGER_INFO, this.onRecvG2C_STRANGER_INFO, this)
        //未读离线信息数量
        this.register(opCodes.G2C_FRIEND_OFFLINE_MESSAGE_COUNT, this.onRecvG2C_FRIEND_OFFLINE_MESSAGE_COUNT, this)

        this.register(opCodes.G2C_FRIEND_ONLINE, this.onRecvG2C_FRIEND_ONLINE, this)  //好友上线
        this.register(opCodes.G2C_FRIEND_OFFLINE, this.onRecvG2C_FRIEND_OFFLINE, this)  //好友下线
        this.register(opCodes.G2C_FRIEND_RECOMMEND_FRIENDS, this.onRecvG2C_FRIEND_RECOMMEND_FRIENDS, this)  //好友推荐
        //this.register(opCodes.G2C_PLAYER_GET_CARD, 	this.onRecvG2C_PLAYER_GET_CARD, this)  

        //黑名单
        this.register(opCodes.G2C_ROLE_RESONPD_BLACK_ROLE, this.onRecvG2C_ROLE_RESONPD_BLACK_ROLE, this)  //好友推荐
        //屏蔽申请好友
        this.register(opCodes.G2C_REJECT_FRIEND_ADD, this.onRecvG2C_REJECT_FRIEND_ADD, this)
        //已赠送体力返回
	    this.register(opCodes.G2C_FRIEND_GIVE_ITEM, 	this.onRecvG2C_FRIEND_GIVE_ITEM, this) 
        //某个好友的信息更新
	    this.register(opCodes.G2C_FRIEND_UPPDATE_INFO, 	this.onRecvG2C_FRIEND_UPPDATE_INFO, this) 

        //好友群聊
        //this.register(opCodes.G2C_CHAT_GROUP_CREATE, 	this.onRecvG2C_CHAT_GROUP_CREATE, this)  //创建讨论组
        //this.register(opCodes.G2C_CHAT_GROUP_UPDATE_INFO, 	this.onRecvG2C_CHAT_GROUP_UPDATE_INFO, this)  //更新讨论组信息
        //this.register(opCodes.G2C_CHAT_GROUP_QUERY_MEMBERS, 	this.onRecvG2C_CHAT_GROUP_QUERY_MEMBERS, this)  //获取所有成员
        //this.register(opCodes.G2C_CHAT_GROUP_INVITE_JOIN, 	this.onRecvG2C_CHAT_GROUP_INVITE_JOIN, this)  //邀请XX加入
        //this.register(opCodes.G2C_CHAT_GROUP_AGREE_JOIN, 	this.onRecvG2C_CHAT_GROUP_AGREE_JOIN, this)  //同意加入
        //this.register(opCodes.G2C_CHAT_GROUP_QUIT, 	this.onRecvG2C_CHAT_GROUP_QUIT, this)  //退出
        //this.register(opCodes.G2C_CHAT_GROUP_EXPELEE, 	this.onRecvG2C_CHAT_GROUP_EXPELEE, this)  //开除
        ////this.register(opCodes.G2C_CHAT_GROUP_CHAT, 	this.onRecvG2C_CHAT_GROUP_CHAT, this)  //聊天
        //this.register(opCodes.G2C_CHAT_GROUP_LIST, 	this.onRecvG2C_CHAT_GROUP_LIST, this)  //聊天组列表
        //this.register(opCodes.G2C_NO_TROUBLE_SETTING, 	this.onRecvG2C_NO_TROUBLE_SETTING, this)  //聊天组列表
        //this.register(opCodes.G2C_SELECT_NO_TROUBLE_SETTING, 	this.onRecvG2C_SELECT_NO_TROUBLE_SETTING, this)  //聊天组列表
        //this.register(opCodes.G2C_CHAT_GROUP_CHAT, 	this.onRecvG2C_CHAT_GROUP_CHAT, this)  //聊天组列表
        //this.register(opCodes.G2C_CHAT_GROUP_INVITE_LIST, 	this.onRecvG2C_CHAT_GROUP_INVITE_LIST, this)  //聊天组列表
        //this.register(opCodes.G2C_CHAT_GROUP_REALSE,   this.onRecvG2C_CHAT_GROUP_REALSE, this)

    }

    //收到离线未读信息数量
    onRecvG2C_FRIEND_OFFLINE_MESSAGE_COUNT(dispatcher, message) {
        FriendSystem.getInstance().setUnReadCountList(message.friend_msg_count)
        FireEvent(EventDefine.OFFLINE_CHAT_MSG, null)
    }

    onRecvG2C_STRANGER_INFO(dispatcher, message) {
        let chat_stranger = message.chat_stranger
        FriendSystem.getInstance().addChatStranger(chat_stranger)
    }

    onRecvG2C_FRIEND_DEL(dispatcher, message) {
        let friendIdToDelete = message.friendIdToDelete
        FriendSystem.getInstance().deleteFriendInfo(friendIdToDelete)
    }

    //好友列表
    onRecvG2C_FRIEND_LIST(dispatcher, message) {
        let friendList = message.friend_list
        //FriendSystem.getInstance().updateApplyStrangerList(friendList)
        FriendSystem.getInstance().updateFriendInfoList(friendList)
    }

    onRecvG2C_APPLY_FRIEND_ADD(dispatcher, message) {
        let tempFriend = message.tempFriend
        FriendSystem.getInstance().onApplyFriendAdd(tempFriend)
    }

    onRecvG2C_APPLY_FRIEND_INFO(dispatcher, message) {
        let stranger_list = message.stranger_list
        FriendSystem.getInstance().updateApplyStrangerList(stranger_list)
    }

    onRecvG2C_FRIEND_ONLINE(dispatcher, message) {
        let friendId = message.friendId
        FriendSystem.getInstance().friendOnline(friendId)
    }

    onRecvG2C_FRIEND_OFFLINE(dispatcher, message) {
        let friendId = message.friendId
        FriendSystem.getInstance().friendOffline(friendId)
    }


    onRecvG2C_FRIEND_RECOMMEND_FRIENDS(dispatcher, message) {
        let recommendList = message.recommendList
        //TLog.Debug_r(recommendList)
        //io.read()
        FriendSystem.getInstance().setRecommendFriendList(recommendList)
        FireEvent(EventDefine.RECOMMEND_FRIEND, RecommendFriendEvent.newObj(recommendList))
    }


    onRecvG2C_FRIEND_SINGLE_INFO(dispatcher, message) {
        let tempFriend = message.tempFriend
        if (tempFriend != null) {
            FriendSystem.getInstance().addChatStranger(tempFriend)
            FireEvent(EventDefine.SEARCH_PLAYER_RESULT, SearchPlayerInfoEvent.newObj(tempFriend, message.getSendType))
        }
    }


    onRecvG2C_APPLY_FRIEND_ADD_AGREE(dispatcher, message) {
        let friendIdToDelete = message.friendIdToDelete
        let friendInfo = message.friendInfo
        FriendSystem.getInstance().removeApply(friendIdToDelete)
        //表非空，则同意成为好友,则返回该好友信息
        if (friendInfo.roleName != null) {
            friendInfo.roleId = friendIdToDelete
            FriendSystem.getInstance().addFriendInfo(friendInfo)
        }
        //表为空，则拒绝该申请0
    }

    //接收到信息
    //onRecvG2C_FRIEND_SEND_MESSAGE_ONE(dispatcher,message){
    //	let messageInfo=message.messageInfo
    //	FriendSystem.getInstance().addMessageInfo(messageInfo)
    //	FriendSystem.getInstance().pushIconMsg()
    //}


    //名片
    // onRecvG2C_PLAYER_GET_CARD(dispatcher,message){
    // 	FireEvent(EventDefine.PLAYER_CARD_GET, PlayerCardGetEvent.newObj(message.playerID,message.playerCardInfo))

    // }


    //黑名单
    onRecvG2C_ROLE_RESONPD_BLACK_ROLE(dispatcher, message) {
        FriendSystem.getInstance().setBlackList(message.blackList)
        FireEvent(EventDefine.BLACK_INFO_LIST, null)
    }
    onRecvG2C_REJECT_FRIEND_ADD(dispatcher, message) {
        FriendSystem.getInstance().setApplyStatue(message.getServerAddType)
        FireEvent(EventDefine.SERVER_APPLY_STATUS, null)
    }

    //群聊

    onRecvG2C_CHAT_GROUP_UPDATE_INFO(dispatcher, message) {


        FriendSystem.getInstance().setChatGroupInfo(message.messagetable)

    }

    onRecvG2C_CHAT_GROUP_QUERY_MEMBERS(dispatcher, message) {

        FriendSystem.getInstance().setChatMenberList(message.members, message.groupid)
        FireEvent(EventDefine.CHAT_GROUP_QUERY_MEMBERS, null)
    }

    onRecvG2C_CHAT_GROUP_INVITE_JOIN(dispatcher, message) {

        FriendSystem.getInstance().setChatGroupInvitationInfo(message.messageList)
        FireEvent(EventDefine.CHAT_GROUP_INVITE_JOIN, null)

    }

    onRecvG2C_CHAT_GROUP_AGREE_JOIN(dispatcher, message) {
        FriendSystem.getInstance().removeListRecord(message.groupId)
        FireEvent(EventDefine.CHAT_GROUP_AGREE_JOIN, null)
    }

    onRecvG2C_CHAT_GROUP_QUIT(dispatcher, message) {
        //     FriendSystem.getInstance().SetDeleteGroupId(message.groupId)
        FriendSystem.getInstance().deleteChatInfoByID(-1 * message.groupId)
        FireEvent(EventDefine.CHAT_GROUP_QUIT, message.groupId)
    }

    onRecvG2C_CHAT_GROUP_EXPELEE(dispatcher, message) {

        FriendSystem.getInstance().removeFromChatMenberListById(message.groupid)

        FireEvent(EventDefine.CHAT_GROUP_EXPELEE, message.groupid)

    }

    // onRecvG2C_CHAT_GROUP_CHAT(dispatcher,message){


    // 	FriendSystem.getInstance().addMessageInfo(message.groupContent)
    // 	FireEvent(EventDefine.CHAT_GROUP_CHAT, FriendChatGroupEvent.newObj(message.groupContent))	
    // 	FriendSystem.getInstance().pushGroupIconMsg(message.groupContent.fromFriendId)
    // }

    onRecvG2C_CHAT_GROUP_LIST(dispatcher, message) {



        FriendSystem.getInstance().setChatGroupList(message.GroupList)
        message.GroupList = {}
        message.GroupCount = 0

        let grouplist = FriendSystem.getInstance().getChatGroupList()

        let messageInfoList = FriendSystem.getInstance().getMessageInfoList()

        let isNotExistList: any = {}

        for (let _k in messageInfoList) {
            let k = tonumber(_k)
            let v = messageInfoList[k]


            if (k < 0) {
                JsUtil.arrayInstert(isNotExistList, k)

            }
        }

        for (let _k in messageInfoList) {
            let k = tonumber(_k)
            let v = messageInfoList[k]


            for (let i in grouplist) {
                let n = grouplist[i]


                if (n["groupid"] == -1 * k) {

                    for (let j in isNotExistList) {
                        let m = isNotExistList[j]


                        if (m == k) {
                            JsUtil.arrayRemove(isNotExistList, j)

                        }
                    }
                }
            }
        }


        for (let k in isNotExistList) {
            let v = isNotExistList[k]


            FriendSystem.getInstance().deleteChatInfoByID(v)
        }


        FireEvent(EventDefine.CHAT_GROUP_LIST, null)

    }

    onRecvG2C_CHAT_GROUP_CREATE(dispatcher, message) {
        FireEvent(EventDefine.CHAT_GROUP_CREATE, message.groupId)
    }

    onRecvG2C_NO_TROUBLE_SETTING(dispatcher, message) {

        FireEvent(EventDefine.NO_TROUBLE_SETTING, null)
    }

    // onRecvG2C_SELECT_NO_TROUBLE_SETTING(dispatcher,message){

    //       FireEvent(EventDefine.NO_TROUBLE_SETTING,FriendSelectNoTrouble.newObj(message.groupList))

    // } 

    onRecvG2C_CHAT_GROUP_INVITE_LIST(dispatcher, message) {

        //FriendSystem.getInstance().SetInviteList(message.inviteList)
        //FireEvent(EventDefine.CHAT_GROUP_INVITE_LIST,null)
        //if(size_t(message.inviteList) > 0 ){ 
        // 		FriendSystem.getInstance().pushIconMsg(4)
        //
        //} 
    }

    onRecvG2C_CHAT_GROUP_REALSE(dispatcher, message) {
        //FriendSystem.getInstance().SetReleaseId(message.groupId)
        FriendSystem.getInstance().deleteChatInfoByID(-1 * message.groupId)
        FireEvent(EventDefine.CHAT_GROUP_REALSE, message.groupId)
    }

    onRecvG2C_FRIEND_GIVE_ITEM(dispatcher, message) {
        FriendSystem.getInstance().setSentPowerList(message.friendIdList)
	    FireEvent(EventDefine.SENT_POWER_LIST, null)
    }

    onRecvG2C_FRIEND_UPPDATE_INFO(dispatcher, message) {
        FriendSystem.getInstance().updateOneFriendInfo(message.friendInfo)
    }
}