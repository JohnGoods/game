// TypeScript file
class FriendSDetailsFrame extends BaseWnd {
    playerInfo;
    actorView : UIActorView
    state:number

    public initObj(...params: any[]): void {
        this.playerInfo = null
        this.mLayoutPaths = ["resource/layouts/friend/FriendsDetailsLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true, true)
        var elemInfo = [
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
    
            { ["name"]: "chat_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onChatClick },
            { ["name"]: "guanzhu_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGuanZhuClick},
            { ["name"]: "black_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBlackClick },
            { ["name"]: "shoutu_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onShoutuClick },

            { ["name"]: "btn_VIP", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onVIPClick},
			{ ["name"]: "btn_yueKa", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onYueKaClick },

            { ["name"]: "rd_copyname", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["touchChildren"]:false, ["fun_index"]: this.onCopyName },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
        this.mElemList["rd_copyname"].setAlignFlag(gui.Flag.RIGHT_BOTTOM)

        this.actorView = UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["actor"])
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.FRIEND_LIST_UPDATE, this.refresh, this)
        RegisterEvent(EventDefine.BLACK_INFO_LIST, this.refresh, this)
        this.mLayoutNode.visible = true;
        this.refresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.FRIEND_LIST_UPDATE, this.refresh, this)
        UnRegisterEvent(EventDefine.BLACK_INFO_LIST, this.refresh, this)
        this.mLayoutNode.visible = false;
        let actorView:UIActorView = this.actorView
		actorView.clearView()
    }

    refresh() {
        if(this.playerInfo == null){
            return
        }
        let name = this.playerInfo.roleName
        if(this.playerInfo.name && this.playerInfo.name != ""){
            name = this.playerInfo.name
        }
		let sex =  this.playerInfo.sexId
		let sexStr = (sex == 1)?Localize_cns("GUIDE_TXT5"):Localize_cns("GUIDE_TXT6");
		let level = this.playerInfo.level || 0
		let bangHui = this.playerInfo.factionName || ""
        if(bangHui == ""){
           bangHui = Localize_cns("PLAYER_DETAILS_TXT7")
        }
		let force = this.playerInfo.force

		this.mElemList["label_nickname"].text = name;

		let str = String.format(Localize_cns("PALYER_DETAILS_TXT5"), name, sexStr, level, bangHui);
		AddRdContent(this.mElemList["rd_des"], str,"ht_20_cc", "ublack");

        AddRdContent(this.mElemList["rd_copyname"], Localize_cns("PALYER_DETAILS_TXT4"),"ht_20_cc_stroke");
		this.mElemList["rect_name"].width = 80

        DrawNumberStringImage(this.mElemList["bImage"], "zhanLi_", "z" + force, 0, 0, -3)

        let entryid  = this.playerInfo.vocation

		let actorView:UIActorView = this.actorView	
		actorView.updateByPlayerAppearInfo(this.playerInfo)

        //头像
		let icon = GetProfessionIcon(entryid, sex)
		this.mElemList["image_player"].source = icon

        //好友
        this.mElemList["guanzhu_btn"].text = Localize_cns("FRIENDS_TXT13")
        this.state = 1
        let friendList = FriendSystem.getInstance().getFriendInfoList()
        for(let _ in friendList){
            if(_ == this.playerInfo.roleId){
                this.mElemList["guanzhu_btn"].text = Localize_cns("DELETE_FRIEND")
                this.state = 2
                break
            }
        }

        this.mElemList["black_btn"].text = Localize_cns("BLACK_BTN_NAME")
        let blacklist = FriendSystem.getInstance().getBlackList()
         for(let _ in blacklist){
             let v = blacklist[_]
            if(v[0] == this.playerInfo.roleId){
                this.mElemList["black_btn"].text = Localize_cns("DELETE_BLACK_FRIEND")
                break
            }
        }
    }

    onVIPClick(){
		ExecuteMainFrameFunction("VIP")
		this.hideWnd()
	}

	onYueKaClick(){
		let wnd : WelfareFrame = WngMrg.getInstance().getWindow("WelfareFrame")
		wnd.showWndWithTabName(2)
		this.hideWnd()
	}

    onChatClick(){
        let name = this.playerInfo.roleName
        if(this.playerInfo.name != ""){
            name = this.playerInfo.name
        }

        let id = this.playerInfo.roleId
        let haveFans = false
        let strangerList = FriendSystem.getInstance().getApplyStrangerList()
        for (let _strangerId in strangerList) {
            let strangerId = tonumber(_strangerId)
            if(id == strangerId){
                haveFans = true
                break
            }
        }

        //如果没相互关注 && 等级少于80
        if((this.state != 2 || haveFans == false) && (GetHeroProperty("level")<80)){
            MsgSystem.addTagTips(Localize_cns("CHAT_TXT15"))
            return
        }
        
        // let wnd = WngMrg.getInstance().getWindow("ChatInChannelFrame")
        // wnd.chatWithPlayer(this.playerInfo.roleId,name)
        if(this.playerInfo){
            ChatWithPlayerInfo(this.playerInfo)
        }  
        this.hideWnd()
    }

    //判断是否好友先
    onGuanZhuClick(){
        let friendId = this.playerInfo.roleId
        if(this.state == 1){
            //添加好友
            FriendSystem.getInstance().removeRecommendFriendByID(friendId)
            FriendSystem.getInstance().addFriend(friendId)
        }else{
            let msg = Localize_cns("FRIENDS_TXT14")
		    var callback: IDialogCallback = {
		    onDialogCallback(result: boolean, userData): void {
				    if (result) {
                        //删除好友
                	    FriendSystem.getInstance().deleteFriend(friendId)
				    }
	    	    }
            }
            MsgSystem.confirmDialog(msg, callback, null) 
        }
    }

    onBlackClick(){
        let info = this.playerInfo
        let roleId = info.roleId
        let name = info.roleName
        if(info.name && info.name != ""){
            name = info.name
        }
        let msg = String.format(Localize_cns("FRIENDS_TXT11"),name)
		var callback: IDialogCallback = {
		onDialogCallback(result: boolean, userData): void {
				if (result) {
                	FriendSystem.getInstance().addPlayerBlackList(roleId,name)
				}
	    	}
        }
        MsgSystem.confirmDialog(msg, callback, null)
    }

    onShoutuClick(){
        let info = this.playerInfo
        let id = info.roleId
		let level = info.level
		let myLevel = GetHeroProperty("level") || 0
		if(myLevel<(level+3)){
			MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT15"))
			return
		}

		//60004 判断是否有师徒令
		let itemId = 60004
		let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)
		if(ownItemCount<=0){
			MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT20"))
			return
		}
		RpcProxy.call("C2G_ShouTu",id ,level)
        MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT49"))
    }

    showAndSetFrame(data){
        this.playerInfo = data
        this.showWnd()
    }

    onCopyName(){
        if(this.playerInfo == null){
            return
        }
        
		let name = this.playerInfo.roleName
        if(this.playerInfo.name && this.playerInfo.name != ""){
            name = this.playerInfo.name
        }
		ClipBoardCopy(name)
	}
}