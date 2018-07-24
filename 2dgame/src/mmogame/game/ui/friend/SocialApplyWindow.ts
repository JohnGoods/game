// TypeScript file

class SocialApplyWindow extends BaseCtrlWnd {
    mElemList;
    scroll: UIScrollList;
    list: any[];
    firstOpen:boolean
    nametoInfo
    getRecordList;
    firendList;

    public initObj(...params: any[]): void {
        this.list = []
        this.firstOpen = true
    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        let elemInfo = [
            // { ["name"]: "btn_apply1",  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAddFriendBtn },
            // { ["name"]: "btn_apply2",  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAddFriendBtn },
            { ["name"]: "btn_huan_friend",  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onHuanFriendBtn },
            { ["name"]: "btn_onekey_get", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onOneKeyGetClick },
        ]
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let group = <eui.Group>this.mElemList["apply_scroll_wnd"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "apply_scroll", 0, 0, group.width, group.height, group)
        this.mElemList["friend_get_rd"].setAlignFlag(gui.Flag.CENTER_CENTER)

    }

    public onUnLoad(): void {
    }

    public onShow(): void {
        //RegisterEvent(EventDefine.RECOMMEND_FRIEND, this.refreshRecommendFriendFrame, this)
        RegisterEvent(EventDefine.FRIEND_LIST_UPDATE, this.refresh, this)
        RegisterEvent(EventDefine.FRIEND_APPLYLIST_UPDATE, this.refresh, this)
        RegisterEvent(EventDefine.CHAT_GROUP_INVITE_LIST, this.refresh, this)
        RegisterEvent(EventDefine.CHAT_GROUP_AGREE_JOIN, this.refresh, this)
        RegisterEvent(EventDefine.APPLY_TO_FRIEND, this.refresh, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refresh, this)

        this.mElemList["apply_wnd"].visible = true;
        // this.mElemList["btn_huan_friend"].visible = true;
        
        if(this.firstOpen){
            // let message = GetMessage(opCodes.C2G_FRIEND_RECOMMEND_FRIENDS)
		    // SendGameMessage(message)
		    this.firstOpen = false
        }
        this.refresh()
    }

    public onHide(): void {
        //UnRegisterEvent(EventDefine.RECOMMEND_FRIEND, this.refreshRecommendFriendFrame, this)
        UnRegisterEvent(EventDefine.FRIEND_LIST_UPDATE, this.refresh, this)
        UnRegisterEvent(EventDefine.FRIEND_APPLYLIST_UPDATE, this.refresh, this)
        UnRegisterEvent(EventDefine.CHAT_GROUP_INVITE_LIST, this.refresh, this)
        UnRegisterEvent(EventDefine.CHAT_GROUP_AGREE_JOIN, this.refresh, this)
        UnRegisterEvent(EventDefine.APPLY_TO_FRIEND, this.refresh, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refresh, this)

        this.mElemList["apply_wnd"].visible = (false)
        // this.mElemList["btn_huan_friend"].visible = false;
    }

    refresh() {
        this.getRecordList = getSaveRecord(opSaveRecordKey.youQingBiList) || []
        let friendList = FriendSystem.getInstance().getFriendInfoList()
        this.firendList = friendList
        MsgSystem.removeIconMsgByType(IconMsgType.FRIEND_APPLY)
        let strangerList = FriendSystem.getInstance().getApplyStrangerList()
        let show_list = [];
        for (let _strangerId in strangerList) {
            let strangerId = tonumber(_strangerId)
            let strangerInfo = strangerList[strangerId]
            show_list.push({ strangerId, strangerInfo })
        }

        let t = []
        let t1 = []
        let t2 = []

        let getList = this.getRecordList.getCoin || []

        for (let i = 0; i < size_t(show_list); i++) {
            let v = show_list[i]
            let strangerId = v.strangerId
            if(getList && getList[strangerId]){
                if(getList[strangerId] == 1){    //可领取
                    table_insert(t,v)
                }else if(getList[strangerId] == 2){ //已经领取
                    table_insert(t2,v)
                }
            }else{
                table_insert(t1,v)
            }
        }

        let show_list1 = []
        for (let i = 0; i < size_t(t); i++) {
            table_insert(show_list1,t[i])
        }
        for (let i = 0; i < size_t(t1); i++) {
            table_insert(show_list1,t1[i])
        }
        for (let i = 0; i < size_t(t2); i++) {
            table_insert(show_list1,t2[i])
        }

        this.list = show_list1
        this.nametoInfo = []
        this.scroll.clearItemList()
        let group = <eui.Group>this.mElemList["apply_scroll_wnd"]
        for (let i = 0; i < size_t(show_list1); i++) {
            let v = show_list1[i]
            let [window, flag] = this.scroll.getItemWindow(i, group.width - 20, 130, 0, 0, 0)
            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v)
        }
        this.scroll.refreshScroll()

        //
        this.mElemList["btn_onekey_get"].enabled = false
        // let getList = this.getRecordList.getCoin || []

        for(let _ in getList){
            let roleId = tonumber(_)
            if(getList && getList[roleId] == 1){
                this.mElemList["btn_onekey_get"].enabled = true //可以领取
                break
            }
        }

        let getNum = this.getRecordList.count || 0   //接收次数
        
        let rdStr = String.format(Localize_cns("FRIENDS_TXT25"),getNum)
        AddRdContent(this.mElemList["friend_get_rd"], rdStr, "ht_20_cc_stroke", "white", 6)
        //this.refreshRecommendFriendFrame()
    }

    initItemWindow(window) {
        let name = window.name
        let w = window.width
        let h = window.height

        let Info = [
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 10, ["y"]: 5, ["w"]: w, ["h"]: h, ["messageFlag"]: true },
            // { ["index_type"]: gui.Grid9Image, ["name"]: name + "_iconBg", ["title"]: null, ["font"]: null, ["image"]: "ty_renWuKuang01", ["color"]: null, ["x"]: 10, ["y"]: 2, ["w"]: 140, ["h"]: 140, ["messageFlag"]: true },
            // { ["index_type"]: gui.Grid9Image, ["name"]: name + "_icon", ["title"]: null, ["font"]: null, ["image"]: "zctx_90001", ["color"]: null, ["x"]: 17, ["y"]: -7, ["w"]: 140, ["h"]: 140, },
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_rd", ["x"]: 155, ["y"]: 30, ["w"]: 250, ["h"]: 70, ["messageFlag"]: true },
            { ["index_type"]: gui.Button, ["name"]: name + "_agree_btn", ["title"]: Localize_cns("FRIENDS_TXT8"), ["font"]: "ht_24_cc", ["image"]: "ty_tongYongBt2", ["color"]: gui.Color.ublack, ["x"]: 420, ["y"]: 14, ["w"]: 94, ["h"]: 49, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAgreeClick },
            { ["index_type"]: gui.Button, ["name"]: name + "get_btn", ["title"]: "", ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt2", ["color"]: gui.Color.white, ["x"]: 420, ["y"]: 70, ["w"]: 94, ["h"]: 49, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGetClick },
           
            //  { ["index_type"]: eui.Label, ["name"]: name + "get_tip", ["title"]: Localize_cns("FRIENDS_TXT24"), ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.white, ["x"]: 420, ["y"]: 70, ["w"]: 94, ["h"]: 49, ["messageFlag"]: true },
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "get_tip", ["title"]: "", ["font"]: "ht_24_cc", ["color"]: gui.Color.white, ["x"]: 420, ["y"]: 68, ["w"]: 94, ["h"]: 49, ["messageFlag"]: true },
            { ["index_type"]: eui.Image,  ["name"]: name + "btnTips", ["parent"]: name + "get_btn", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 77, ["y"]: 0, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
        ]
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
        this.mElemList[name + "get_tip"].setAlignFlag(gui.Flag.CENTER_CENTER)

        this.mElemList[name+"apply_petbox"] = UIPetBox.newObj(this.mLayoutNode, name+"apply_petbox", 0, -5, this.mElemList[name + "_bg"])
        
        let Info1: any = [
             { ["index_type"]: gui.Grid9Image, ["name"]: name + "btn_listen", ["parent"]: name + "_bg", ["image"]: "", ["x"]: 0, ["y"]: -5, ["w"]: 140, ["h"]: 140,},
        ]
        UiUtil.createElem(Info1, this.mLayoutNode, this.mElemList, this, window)
        this.mElemList[name+"btn_listen"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFriendClick, this)
    }

    refreshItemWindow(window, data) {
        let strangerId = data.strangerId
        let strangerInfo = data.strangerInfo

        let name = window.name

        //存在则显示它,注意z顺序与定义顺序一致
        let str = "#saddlebrown" + strangerInfo.roleName + "#spaceLv." + strangerInfo.level + "#br"
        if (!strangerInfo.factionName || strangerInfo.factionName == "") {
            str = str + "#br#saddlebrown" + (Localize_cns("NO_JUNTUAN"))
        } else {
            str = str + "#br#saddlebrown" + (strangerInfo.factionName)
        }
        AddRdContent(this.mElemList[name + "_rd"], str, "ht_24_cc", "white", 3)

        this.mElemList[name+"apply_petbox"].updateRoleInfo(strangerInfo.vocation, strangerInfo.sexId,  strangerInfo.id)
        // this.mElemList[name + "_icon"].source = GetProfessionIcon(strangerInfo.vocation, strangerInfo.sexId)
        

        this.mElemList[name + "get_btn"].visible = false
        this.mElemList[name + "btnTips"].visible = false
        // this.mElemList[name + "get_tip"].visible = false
        this.mElemList[name + "_agree_btn"].visible = true
        AddRdContent(this.mElemList[name+"get_tip"], "", "ht_24_cc", "ublack")
        // this.mElemList[name + "_agree_btn"].visible = true
        let friendList = this.firendList
        for (let friendId in friendList) {
            let friendInfo = friendList[friendId]
            if(strangerId == friendInfo.roleId){
                this.mElemList[name + "_agree_btn"].visible = false
                break
            }
        }
        
        let getList = this.getRecordList.getCoin || []
        if(getList && getList[strangerId]){
            if(getList[strangerId] == 1){    //可领取
                this.mElemList[name + "get_btn"].visible = true
                this.mElemList[name + "btnTips"].visible = true
                AddRdContent(this.mElemList[name+"get_tip"], Localize_cns("FRIENDS_TXT19"), "ht_24_cc", "ublack")
            }else if(getList[strangerId] == 2){ //已经领取
                // this.mElemList[name + "get_tip"].visible = true
                AddRdContent(this.mElemList[name+"get_tip"], Localize_cns("FRIENDS_TXT24"), "ht_24_cc", "ublack")
            }
        }

        this.nametoInfo[name + "get_btn"] = strangerInfo
        this.nametoInfo[name + "btn_listen"] = strangerInfo
     }

    //////////////////////////////////////////////////////////////////////
    //推荐好友
    onClickAddFriendBtn(args: egret.TouchEvent) {
        let name = args.target.name
        let index = tonumber(name.replace(/[^0-9]/ig, ""))

        let recommendList = FriendSystem.getInstance().getRecommendFriendList()
        let playerID = recommendList[index - 1].roleId
        if (!playerID) {
            return TLog.Error("FriendFrame get playerID  Error  can't find ", name);
        }

        FriendSystem.getInstance().removeRecommendFriendByID(playerID)

        let message = GetMessage(opCodes.C2G_DELETE_RECOMMEND_FRIEND)
        message.deleteID = playerID
        SendGameMessage(message)
        FriendSystem.getInstance().addFriend(playerID)
    }

    //关注粉丝
    onAgreeClick(args) {
        let name = args.target.name
        let index = tonumber(name.replace(/[^0-9]/ig, ""))
        //判断是否已经超过上限了
        let friendList = FriendSystem.getInstance().getFriendInfoList()
        if(size_t(friendList)>=50){
            MsgSystem.addTagTips(Localize_cns("FRIENDS_TXT16"))
            return
        }
        let strangerInfo = this.list[index].strangerInfo
        let message = GetMessage(opCodes.C2G_APPLY_FRIEND_ADD_AGREE)
        message.friendId = tonumber(strangerInfo.roleId)
        message.isAgree = 1
        SendGameMessage(message)
    }

    //接收友情币
    onGetClick(args) {
        let name = args.target.name
        if(this.nametoInfo[name]==null){
            return
        }
        let count = this.getRecordList.count || 0
        if(count >= 10){ //达到上限了
            MsgSystem.addTagTips(Localize_cns("FRIENDS_TXT21"))
            return
        }
		let info = this.nametoInfo[name]
        let msg = GetMessage(opCodes.C2G_FRIEND_GET_YOUQINGBI)
		msg.oneKey = 0
        msg.roleId = info.roleId
		SendGameMessage(msg)
    }

    //换一批好友
    onHuanFriendBtn(){
        let message = GetMessage(opCodes.C2G_FRIEND_RECOMMEND_FRIENDS)
		SendGameMessage(message)
    }

    //一键获取(要判断是否有好友赠送过)
    onOneKeyGetClick(){
        let canGet = false
        let getList = this.getRecordList.getCoin || []
        for(let _ in getList){
            let roleId = tonumber(_)
            if(getList && getList[roleId] == 1){
                canGet = true
                break
            }
        }
        if(canGet == false){
            MsgSystem.addTagTips(Localize_cns("FRIENDS_TXT15"))
            return
        }
        let count = this.getRecordList.count || 0

        if(count >= 10){ //达到上限了
            MsgSystem.addTagTips(Localize_cns("FRIENDS_TXT21"))
            return
        }
        let msg = GetMessage(opCodes.C2G_FRIEND_GET_YOUQINGBI)
		msg.oneKey = 1
        msg.roleId = 0
		SendGameMessage(msg)
    }

    onFriendClick(args){
        let name = args.target.name
        if(this.nametoInfo[name]==null){
            return
        }
		let info = this.nametoInfo[name]
        let wnd = WngMrg.getInstance().getWindow("FriendSDetailsFrame")
        wnd.showAndSetFrame(info)
    }
}