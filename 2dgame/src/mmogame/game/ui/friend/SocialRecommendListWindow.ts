// TypeScript file

class SocialRecommendListWindow extends BaseCtrlWnd {
    scroll: UIScrollList;
    list: any[]
    nameToInfo

    public initObj(...params: any[]): void {
        this.list = []
    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList

        let group = <eui.Group>this.mElemList["apply_recommend_wnd"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
    }


    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.RECOMMEND_FRIEND, this.refresh, this)
        RegisterEvent(EventDefine.FRIEND_LIST_UPDATE, this.refresh, this)
        RegisterEvent(EventDefine.BLACK_INFO_LIST, this.refresh, this)
        this.mElemList["apply_recommend_wnd"].visible = true
        // this.mElemList["btn_huan_friend"].visible = true
        let message = GetMessage(opCodes.C2G_FRIEND_RECOMMEND_FRIENDS)
		SendGameMessage(message)
        this.refresh();
    }
    public onHide(): void {
        UnRegisterEvent(EventDefine.RECOMMEND_FRIEND, this.refresh, this)
        UnRegisterEvent(EventDefine.FRIEND_LIST_UPDATE, this.refresh, this)
        UnRegisterEvent(EventDefine.BLACK_INFO_LIST, this.refresh, this)
        this.mElemList["apply_recommend_wnd"].visible = false
        // this.mElemList["btn_huan_friend"].visible = false
    }

    refresh() {
        let list = FriendSystem.getInstance().getRecommendFriendList()
        let show_list = []

        for (let index in list) {
            let info = list[index]
            show_list.push(info);
        }
        this.list = show_list
        this.nameToInfo = []
        this.scroll.clearItemList()

        //let group = <eui.Group>this.mElemList["apply_recommend_wnd"]
        for (let i = 0; i < size_t(show_list); i++) {
            let v = show_list[i]
            let [window, flag] = this.scroll.getItemWindow(i, 560, 130, 0, 0, 0)
            if (flag == true) {
                this.initItemWindow(window)
            }
            // this.initItemWindow(window)
            this.refreshItemWindow(window, v)
        }
        //this.scroll.refreshScroll()
    }

    initItemWindow(window) {
        let name = window.name
        let Info = [
            //背景
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 560, ["h"]: 130, ["messageFlag"]: true },
            //玩家
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_rd",["parent"]: name + "_bg", ["x"]: 155, ["y"]: 30, ["w"]: 250, ["h"]: 70, ["event_name"]: null, ["fun_index"]: null },
            //按钮
            { ["index_type"]: gui.Button, ["name"]: name + "_btn",["parent"]: name + "_bg", ["title"]: Localize_cns("FRIENDS_TXT8"), ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt2", ["color"]: gui.Color.white, ["x"]:446, ["y"]: 41, ["w"]: 94, ["h"]: 49, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAddClicked },
        ]
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
        this.mElemList[name+"recom_petbox"] = UIPetBox.newObj(this.mLayoutNode, "recom_petbox", 0, -5, this.mElemList[name + "_bg"])
        
        let Info1: any = [
             { ["index_type"]: gui.Grid9Image, ["name"]: name + "btn_listen", ["parent"]: name + "_bg", ["image"]: "", ["x"]: 0, ["y"]: -5, ["w"]: 140, ["h"]: 140,},
        ]
        UiUtil.createElem(Info1, this.mLayoutNode, this.mElemList, this, window)
        this.mElemList[name+"btn_listen"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFriendClick, this)
        
    }

    refreshItemWindow(window, data) {
        let name = window.name
        let rd = this.mElemList[name + "_rd"]
        // rd.clear()
        this.mElemList[name+"recom_petbox"].updateRoleInfo(data.vocation,data.sexId)
        let str = String.format(Localize_cns("FRIENDS_TXT10"),data.roleName,data.level)
        AddRdContent(rd, str, "ht_24_cc", "ublack")
        this.nameToInfo[name + "_btn"] = data
        this.nameToInfo[name + "btn_listen"] = data
    }

    onAddClicked(args){
        let name = args.target.name
        if(this.nameToInfo[name] == null){
            return
        }
        let strangerInfo = this.nameToInfo[name]
        let playerID = strangerInfo.roleId

        FriendSystem.getInstance().removeRecommendFriendByID(playerID)
        let message = GetMessage(opCodes.C2G_DELETE_RECOMMEND_FRIEND)
        message.deleteID = playerID
        SendGameMessage(message)
        FriendSystem.getInstance().addFriend(playerID)
    }

    onFriendClick(args){
        let name = args.target.name
        if(this.nameToInfo[name]==null){
            return
        }
		let info = this.nameToInfo[name]
        let wnd = WngMrg.getInstance().getWindow("FriendSDetailsFrame")
        wnd.showAndSetFrame(info)
    }
}