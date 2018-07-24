// TypeScript file

class FriendFindResultFrame extends BaseWnd {

    playerInfo: any;
    petBox:UIPetBox;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/friend/FriendFindResultLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();

        this.setAlignCenter(true, true)

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "chatBtn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onChatBtnClick },
            { ["name"]: "addFriendBtn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAddFriendBtnClick },
            { ["name"]: "blackBtn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBlackBtnClick },

        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);


        this.petBox = UIPetBox.newObj(this.mLayoutNode, "petbox", -20, -20, this.mElemList["group_head"])
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.refreshFrame()
        RegisterEvent(EventDefine.BLACK_INFO_LIST, this.refreshFrame, this)
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        UnRegisterEvent(EventDefine.BLACK_INFO_LIST, this.refreshFrame, this)
    }



    onChatBtnClick() {
        if (this.playerInfo == null) {
            return
        }

        let playerInfo = this.playerInfo
        let playerId = playerInfo.roleId
        let playerName = playerInfo.roleName
        let playerBody = playerInfo.body
        let VipLevel = playerInfo.VipLevel

        let chatStranger = FriendSystem.getInstance().getChatPlayerInfo(playerId)
        if (!chatStranger) {
            let newStranger = StrangerInfo.newObj(playerId, playerName, playerInfo.vocation, playerInfo.icon, playerInfo.sexId, playerInfo.VipLevel, playerInfo.level)
		    FriendSystem.getInstance().addChatStranger(newStranger)
        }

        // let window = WngMrg.getInstance().getWindow("FriendChatFrame")
        // window.loadWnd()
        // window.showFriendChatFrame(playerId, playerName, playerBody)
        ChatWithPlayer(playerId, playerName)

        this.hideWnd()
    }


    onAddFriendBtnClick() {
        if (this.playerInfo == null) {
            return
        }
        FriendSystem.getInstance().addFriend(this.playerInfo.roleId)
        this.hideWnd()
    }


    onBlackBtnClick() {
        if (this.playerInfo == null) {
            return
        }
        if (FriendSystem.getInstance().checkIsMyFriendByID(this.playerInfo.roleId)) {
            let t: IDialogCallback = {
                onDialogCallback(result: boolean, userData): void {
                    if (result == true) {
                        FriendSystem.getInstance().addPlayerBlackList(this.playerInfo.roleId, this.playerInfo.roleName)
                    }
                }
            }
            MsgSystem.confirmDialog(Localize_cns("ADD_FRIENDS_TO_BLACK_TIPS"), t, null)
            return
        }
        FriendSystem.getInstance().addPlayerBlackList(this.playerInfo.roleId, this.playerInfo.roleName)

    }

    refreshFrame() {
        if (this.playerInfo == null) {
            return
        }

        let playerInfo = this.playerInfo

        this.mElemList["friend_name_level"].text = (playerInfo.roleName + "  " + "Lv " + playerInfo.level)
        if (!playerInfo.factionName || playerInfo.factionName == "") {
            this.mElemList["describe"].text = (Localize_cns("NO_JUNTUAN"))
        } else {
            this.mElemList["describe"].text = (playerInfo.factionName)
        }


        this.petBox.updateRoleInfo(playerInfo.vocation, playerInfo.sexId,  playerInfo.id)
        this.updateBlackBtn()

    }


    showWithPlayerInfo(playerInfo) {
        //查看G2C_FRIEND_SINGLE_INFO 
        this.playerInfo = playerInfo
        this.showWnd()
    }

    updateBlackBtn() {
        if (this.playerInfo == null) {
            return
        }

        if (FriendSystem.getInstance().checkPlayerInBlack(this.playerInfo.roleId)) {
            this.mElemList["blackBtn"].text = (Localize_cns("NO_BLACK"))
        } else {
            this.mElemList["blackBtn"].text = (Localize_cns("ADD_BLACK"))
        }
    }



}