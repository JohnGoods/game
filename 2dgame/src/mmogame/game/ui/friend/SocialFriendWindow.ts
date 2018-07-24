// TypeScript file
class SocialFriendWindow extends BaseCtrlWnd {
    mElemList;
    scroll: UIScrollList;
    nametoInfo;
    friendLenght;
    
    sendRecordList

    public initObj(...params: any[]): void {

    }

    public onLoad(): void {

        this.mElemList = this.mParentWnd.mElemList;

        var elemInfo = [
            { ["name"]: "input_edit", ["title"]: "", ["prompt"]: Localize_cns("INPUT_FRIEND_NAME_OR_ID"), ["font"]: "ht_22_lc", ["image"]: null, ["color"]: gui.Color.white, ["event_name"]: null, ["fun_index"]: null, },
            { ["name"]: "btn_search", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSearchFriend },
            { ["name"]: "btn_onekey_send", ["event_name"]: egret.TouchEvent.TOUCH_TAP,  ["fun_index"]: this.onOneKeySendClick, },
            //{ ["name"]: "btn_onekey_get", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onOneKeyGetClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let group = <eui.Group>this.mElemList["friend_scroll_wnd"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "friend_scroll", 10, 5, group.width - 20, group.height - 10, group)
        this.mElemList["friend_info_rd"].setAlignFlag(gui.Flag.CENTER_CENTER)
    }

    public onUnLoad(): void {
    }

    public onShow(): void {
        RegisterEvent(EventDefine.FRIEND_LIST_UPDATE, this.refresh, this)
        RegisterEvent(EventDefine.APPLY_TO_FRIEND, this.refresh, this)
        RegisterEvent(EventDefine.FRIEND_ONOFF_LINE, this.refresh, this)
        RegisterEvent(EventDefine.SENT_POWER_LIST, this.refresh, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refresh, this)

        this.mElemList["friend_wnd"].visible = true;
        this.mElemList["tips_rd"].visible = true;
        this.friendLenght = 0
        this.refresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.FRIEND_LIST_UPDATE, this.refresh, this)
        UnRegisterEvent(EventDefine.APPLY_TO_FRIEND, this.refresh, this)
        UnRegisterEvent(EventDefine.FRIEND_ONOFF_LINE, this.refresh, this)
        UnRegisterEvent(EventDefine.SENT_POWER_LIST, this.refresh, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refresh, this)

        this.mElemList["friend_wnd"].visible = false;
        this.mElemList["tips_rd"].visible = false;

        this.mElemList["input_edit"].text = ""
    }

    refresh() {
        let friendList = FriendSystem.getInstance().getFriendInfoList()
        
        this.sendRecordList = getSaveRecord(opSaveRecordKey.sendYouQingBi) || []

        this.friendLenght = size_t(friendList)
        let onlineSortList = []
        let offLineSortList = []
        for (let friendId in friendList) {
            let friendInfo = friendList[friendId]

            let t: any = {}
            t.friendId = friendId
            t.friendInfo = friendInfo

            if (friendInfo.isOnline == 0) {
                JsUtil.arrayInstert(offLineSortList, t)
            } else {
                JsUtil.arrayInstert(onlineSortList, t)
            }
        }

        // 排序在线好友
        table_sort(onlineSortList, function (a, b) {
            return b.friendInfo.level - a.friendInfo.level
        })

        // 排序离线好友
        table_sort(offLineSortList, function (a, b) {
            return b.friendInfo.level - a.friendInfo.level
        })

        onlineSortList = table_merge(onlineSortList, offLineSortList)

        this.scroll.clearItemList()
        this.nametoInfo = []

        let group = <eui.Group>this.mElemList["friend_scroll_wnd"]
        for (let i in onlineSortList) {
            let v = onlineSortList[i]

            let [window, flag] = this.scroll.getItemWindow(tonumber(i), group.width - 20, 130, 0, 0, 0)
            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v)
        }
        // this.scroll.refreshScroll()

        //人数
        // let str = Localize_cns("DELETE_FRIEND_TIPS") + "#br"
        let str = String.format(Localize_cns("FRIEND_COUNT"), size_t(onlineSortList), size_t(onlineSortList) - size_t(offLineSortList))
        AddRdContent(this.mElemList["tips_rd"], str, "ht_24_cc", "ublack", 6)
        
        let mySend = size_t(this.sendRecordList) || 0   
        let myFriendNum = size_t(friendList) || 0
        if(myFriendNum>50){
            myFriendNum = 50
        }

        let rdStr = String.format(Localize_cns("FRIENDS_TXT17"),mySend,myFriendNum)
        AddRdContent(this.mElemList["friend_info_rd"], rdStr, "ht_20_cc_stroke", "white", 6)
        
        //this.mElemList["btn_onekey_get"].enabled = false
        this.mElemList["btn_onekey_send"].enabled = false

        //let getList = this.getRecordList.getCoin || []
        // for(let _ in friendList){
        //     let roleId = tonumber(_)
        //     if(getList && getList[roleId] == 1){
                //this.mElemList["btn_onekey_get"].enabled = true //可以领取
        //         break
        //     }
        // }

        for(let _ in friendList){
            let roleId = tonumber(_)
            if(this.sendRecordList == null || this.sendRecordList[roleId] == null){
                this.mElemList["btn_onekey_send"].enabled = true     //可以赠送
                break
            }
        }

        // let friendList = FriendSystem.getInstance().getFriendInfoList()
        // this.getRecordList = getSaveRecord(opSaveRecordKey.youQingBiList) || []
        // this.sendRecordList = getSaveRecord(opSaveRecordKey.sendYouQingBi) || []
    }

    initItemWindow(window) {
        let name = window.name
        let w = window.width
        let h = window.height

        let Info: any = [
            { ["index_type"]: eui.Group, ["name"]: name + "_group", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h },
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["parent"]: name + "_group", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["messageFlag"]: true },
            //头像
            // { ["index_type"]: gui.Grid9Image, ["name"]: name + "_icon_bg", ["parent"]: name + "_group", ["image"]: "ty_renWuKuang01", ["x"]: 10, ["y"]: h - 128, ["w"]: 140, ["h"]: 140, ["messageFlag"]: true },
           

            //名字等级
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_name_rd", ["parent"]: name + "_group", ["x"]: 145, ["y"]: 32, ["w"]: 250, ["h"]: 60, ["event_name"]: null, ["fun_index"]: null, },

            { ["index_type"]: gui.Button, ["name"]: name + "send_btn", ["title"]: "", ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 40, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSendClick },
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "send_tip", ["title"]: "", ["font"]: "ht_24_cc", ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 40, ["w"]: 117, ["h"]: 51, ["messageFlag"]: true },
            //  { ["index_type"]: eui.Label, ["name"]: name + "", ["title"]: Localize_cns("FRIENDS_TXT23"), ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 40, ["w"]: 117, ["h"]: 51, ["messageFlag"]: true },
            //{ ["index_type"]: gui.Button, ["name"]: name + "get_btn", ["title"]: Localize_cns("FRIENDS_TXT19"), ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt16", ["color"]: gui.Color.white, ["x"]: 400, ["y"]: 69, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGetClick },
            //{ ["index_type"]: eui.Image,  ["name"]: name + "btnTips", ["parent"]: name + "get_btn", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 77, ["y"]: 0, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
        ]
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
        this.mElemList[name + "send_tip"].setAlignFlag(gui.Flag.CENTER_CENTER)
        

        this.mElemList[name+"social_petbox"] = UIPetBox.newObj(this.mLayoutNode, name+"social_petbox", 0, -5, this.mElemList[name + "_bg"])
        
        let Info1: any = [
             { ["index_type"]: gui.Grid9Image, ["name"]: name + "btn_listen", ["parent"]: name + "_bg", ["image"]: "", ["x"]: 0, ["y"]: -5, ["w"]: 140, ["h"]: 140,},
        ]
        UiUtil.createElem(Info1, this.mLayoutNode, this.mElemList, this, window)
        this.mElemList[name+"btn_listen"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFriendClick, this)
    }

    refreshItemWindow(window, data) {
        let name = window.name
        let info = data.friendInfo
        let roleId = info.roleId
        let str = String.format(Localize_cns("FRIENDS_TXT10"),info.roleName,info.level)
        AddRdContent(this.mElemList[name+"_name_rd"],str, "ht_24_cc", "saddlebrown")
        let vocation = info.vocation
        let sexId = info.sexId
        this.mElemList[name+"social_petbox"].updateRoleInfo(vocation, sexId,  roleId)
        
        this.nametoInfo[name + "btn_listen"] = data.friendInfo
        this.nametoInfo[name + "send_btn"] = data.friendInfo
        //this.nametoInfo[name + "get_btn"] = data.friendInfo
        //this.mElemList[name + "send_btn"].enabled = false
        //this.mElemList[name + "get_btn"].enabled = false
        //this.mElemList[name + "btnTips"].visible = false
        
        // let getList = this.getRecordList.getCoin || []
        // if(getList && getList[roleId]){
        //     if(getList[roleId] == 1){    //可领取
                //this.mElemList[name + "get_btn"].enabled = true
                //this.mElemList[name + "btnTips"].visible = true
        //     }
        // }

        if(this.sendRecordList == null || this.sendRecordList[roleId] == null){ //没发送
             this.mElemList[name + "send_btn"].visible = true
             AddRdContent(this.mElemList[name+"send_tip"], Localize_cns("FRIENDS_TXT18"), "ht_24_cc", "ublack")
            // this.mElemList[name + "send_tip"].visible = false
        }else{
            this.mElemList[name + "send_btn"].visible = false
            AddRdContent(this.mElemList[name+"send_tip"], Localize_cns("FRIENDS_TXT23"), "ht_24_cc", "ublack")
            // this.mElemList[name + "send_tip"].visible = true
        }

        // let isGet = data.isGet || 0
        // if(isGet == 0){ //是否赠送 0为没赠送 不置灰
        //     this.mElemList[name + "get_btn"].enabled = true
        // }

        // let isSend = data.isSend || 0
        // if(isSend == 1){    //对面是否赠送 1为赠送
        //     this.mElemList[name + "send_btn"].enabled = true
        // }
    }

    onChatBtnClick(args) {
        // let friendInfo = this.data.friendInfo
        // let roleId = tonumber(friendInfo.roleId)
        // let body = friendInfo.body
        // let name = friendInfo.roleName

        // let window = WngMrg.getInstance().getWindow("FriendChatFrame")
        // window.loadWnd()
        // window.showFriendChatFrame(roleId, name, body)
        // ChatWithPlayer(roleId, name)

        // GameSound.getInstance().playEffect(SystemSound.effect_btnClick)
    }

    onClickSearchFriend(args) {
        let edit = this.mElemList["input_edit"]
        let bEmpty = StringUtil.isEmpty(edit.text)
        if (bEmpty) {
            return
        } else {
            FriendSystem.getInstance().searchPlayerByName(edit.text)
        }
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

    //到时候判断是否赠送 获取就置灰
    onSendClick(args){
        let name = args.target.name
        if(this.nametoInfo[name]==null){
            return
        }
		let info = this.nametoInfo[name]
        let msg = GetMessage(opCodes.C2G_FRIEND_SEND_YOUQINGBI)
		msg.oneKey = 0
        msg.roleId = info.roleId
		SendGameMessage(msg)
    }

    //到时候判断是否获取 获取就置灰
    onGetClick(args){
        let name = args.target.name
        if(this.nametoInfo[name]==null){
            return
        }
		let info = this.nametoInfo[name]
        let msg = GetMessage(opCodes.C2G_FRIEND_GET_YOUQINGBI)
		msg.oneKey = 0
        msg.roleId = info.roleId
		SendGameMessage(msg)
    }

    //一键赠送
    onOneKeySendClick(){
        if(this.friendLenght <= 0){     
            MsgSystem.addTagTips(Localize_cns("FRIENDS_TXT15"))
			return
        }
        if(size_t(this.sendRecordList)>=50){ //达到上限了
            MsgSystem.addTagTips(Localize_cns("FRIENDS_TXT20"))
            return
        }
        let msg = GetMessage(opCodes.C2G_FRIEND_SEND_YOUQINGBI)
		msg.oneKey = 1
        msg.roleId = 0
		SendGameMessage(msg)
    }
}