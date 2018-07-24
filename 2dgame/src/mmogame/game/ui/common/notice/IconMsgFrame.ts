/*
作者:
    yangguiming
	
创建时间：
    2014.09.19(星期五) 

意图：
  

公共接口：
	//msg回调
	IconMsgCallBack( userData){
	
	removeMsg( id){
	addNewMsg( cbObj, userData){
	
	
*/

//图标信息界面
class IconMsgFrame extends BaseWnd {

    waitMsgList: any[];
    showMsgList: any[];
    MaxSize: any;
    idSeed: any;

    iconList: any;


    mIconFrame: gui.LayoutNode
    hideState: boolean;
    imageDefine: any;

    public initObj(...args: any[]): void {
        this.waitMsgList = []
        this.showMsgList = []
        this.MaxSize = 5
        this.idSeed = 100
        RegisterEvent(EventDefine.STATE_ACTIVE, this.onStateActive, this)
        RegisterEvent(EventDefine.STATE_DEACTIVE, this.onStateActive, this)
        this.hideState = true


        this.imageDefine = {
            [IconMsgType.FRIEND_CHAT]: "zjm_bt_tiShi01",
            [IconMsgType.FRIEND_APPLY]: "zjm_bt_tiShi04",

            [IconMsgType.TEAM_APPLY]: "zjm_bt_tiShi02",
            [IconMsgType.TEAM_INVITE]: "zjm_bt_tiShi02",
            [IconMsgType.TEAM_STATUS]: "zjm_bt_tiShi02",

            [IconMsgType.EMAIL_LIST]: "zjm_bt_tiShi03",

            [IconMsgType.CLUB_FUBEN]: "zjm_bt_tiShi07",
            [IconMsgType.CLUB_APPLY]: "zjm_bt_tiShi07",

            // [IconMsgType.GROW]: "zjm_bt_tiShi05",
            // [IconMsgType.GROW_EVENT]: "zjm_bt_tiShi05",

            // [IconMsgType.ROBBER_INCOME] : "zjm_bt_tiShi07",
        }
    }

    destory() {
        UnRegisterEvent(EventDefine.STATE_ACTIVE, this.onStateActive, this)
        UnRegisterEvent(EventDefine.STATE_DEACTIVE, this.onStateActive, this)
        this.hideWnd()
    }

    onLoad() {
        this.createLayout()
    }

    onUnLoad() {
        // for(let i in this.iconList){
        // 		let v = this.iconList[i]

        // 	ui_util.ReleaseWindow(v)
        // }
        this.iconList = {}
    }

    onShow() {
        //TLog.Debug("IconMsgFrame.onShow")
        this.mLayoutNode.visible = (true)
        this.mLayoutNode.moveToBack()
        this.mIconFrame.visible = (false)
        this.refreshUI()

        RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
    }
    clearMsg() {
        
        for(let k in this.iconList){
            let btn:gui.Button = this.iconList[k]
            btn.visible = false;
        }

        this.hideWnd()

        for (let _ in this.showMsgList) {
            let v = this.showMsgList[_]

            if (v.clearTimer) {
                KillTimer(v.clearTimer)
                v.clearTimer = null
            }
        }
        this.showMsgList = []

        for (let _ in this.waitMsgList) {
            let v = this.waitMsgList[_]

            if (v.clearTimer) {
                KillTimer(v.clearTimer)
                v.clearTimer = null
            }
        }
        this.waitMsgList = []
    }

    onHide() {
        UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)

        //TLog.Debug("IconMsgFrame.onHide")
        this.mLayoutNode.visible = (false)
        this.mIconFrame.visible = (false)
        //this.hideShowWnd()
    }

    //resetShowWnd(){
    //	
    //	//TLog.Debug_r(this.showMsgList)
    //	let showCount = this.showMsgList.length
    //	for(let _ in this.showMsgList){
    //			let info = this.showMsgList[_]

    //		info.window.visible = (true)		
    //	}	
    //	//TLog.Debug("IconMsgFrame.resetShowWnd",showCount)
    //	//TLog.Debug_r(this.waitMsgList)
    //	for(let i = showCount+1; i <= this.MaxSize ,1;i++){
    //		let waitMsg = JsUtil.arrayRemove(this.waitMsgList, 0)
    //		
    //		
    //		
    //		//TLog.Debug("remove",i,waitMsg)
    //		if(waitMsg ){
    //			let iconSlot = this.getFreeIconSlot()
    //			TLog.Assert(iconSlot)		
    //			waitMsg.window = iconSlot
    //			this.openNextMsg(waitMsg)
    //			this.refreshUI()
    //		}		
    //	}	
    //	//TLog.Debug("IconMsgFrame.resetShowWnd }")
    //}

    createLayout() {
        this.mElemList = {}

        //创建消息盒图标
        let w = 84, h = 84
        UiUtil.setWH(this.mLayoutNode, w, h)

        let mElemInfo: any = [
            { ["index_type"]: gui.Button, ["name"]: "msgBox", ["title"]: null, ["font"]: null, ["image"]: "zjm_bt_shiJian01", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onShowMsgList },
            { ["index_type"]: gui.AnimBox, ["name"]: "anim", ["color"]: gui.Color.white, ["x"]: -30, ["y"]: -35, ["w"]: 130, ["h"]: 130, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)
        this.mLayoutNode.setLayer(gui.GuiLayer.Bottom)
        this.mLayoutNode.left = 0;
        this.mLayoutNode.bottom = 405
        this.mLayoutNode.touchEnabled = false


        this.mElemList["anim"].setAnimName("yuan")

        //消息列表框


        this.mIconFrame = this.createLayoutNode("IconMsgFrame_Icon")

        let mElemInfo2: any = [
            { ["index_type"]: gui.Grid9Image, ["name"]: "iconbg", ["title"]: null, ["font"]: null, ["image"]: "", ["color"]: gui.Color.white, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
        ]
        UiUtil.createElem(mElemInfo2, this.mIconFrame, this.mElemList, this)
        UiUtil.setWH(this.mIconFrame, 640, 80)
        this.mIconFrame.setLayer(gui.GuiLayer.Bottom)
        this.mIconFrame.left = 75;
        this.mIconFrame.bottom = this.mLayoutNode.bottom;
        // this.mIconFrame.left = 175;
        // this.mIconFrame.bottom = 290;
        this.mIconFrame.touchEnabled = false;
        

        //this.mIconFrame.MoveToBack()

        let iconW = 65
        let iconH = 65
        this.iconList = {}
        for (let i = 1; i <= this.MaxSize; i++) {
            let mElemInfo: any = [
                { ["index_type"]: gui.Button, ["name"]: "iconLabel" + i, ["title"]: null, ["font"]: null, ["image"]: "zjm_bt_tiShi08", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0,["w"]:iconW, ["h"]:iconH, ["fillMode"]:egret.BitmapFillMode.CLIP, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onIconClick },
            ]
            UiUtil.createElem(mElemInfo, this.mIconFrame, this.mElemList, this)

            this.iconList[i] = this.mElemList["iconLabel" + i]
        }


        for (let i = 1; i <= this.MaxSize; i++) {
            //this.mElemList["Icon" +i].visible = (false)
            this.iconList[i].visible = (false)
            //this.iconList[i]:SetMessagePass(false)
        }
        //this.mLayoutNode.SetMessagePass(true)
        //this.mLayoutNode.SetLayer(gui.Window.LayerTop)
    }


    openNextMsg(msgData) {
        JsUtil.arrayInstert(this.showMsgList, msgData)
        msgData.window.visible = (true)
        //ui_util.CreateDrawRectPtr(msgData.window, gui.Color32Half.green)
        //let layer = msgData.userData.layer
        //TLog.Debug("IconMsgFrame.openNextMsg",layer,msgData.window.GetName())
        //if(layer ){
        //	msgData.window.SetLayer(layer)
        //}else{
        //	msgData.window.SetLayer(gui.Window.LayerBottom)
        //}	

        this.refreshUI()
    }


    getImageByType(type) {
        let imageName = this.imageDefine[type] || "zjm_bt_tiShi08"

        return imageName
    }


    updateMsgBox() {
        let visible = this.mIconFrame.visible
        if (visible) {
            this.mElemList["msgBox"].source = ("zjm_bt_shiJian02")
        } else {
            if (this.showMsgList.length == 1) {
                let msgData = this.showMsgList[0]
                let imageName = this.getImageByType(msgData.type)
                this.mElemList["msgBox"].source = (imageName)

            } else {
                this.mElemList["msgBox"].source = ("zjm_bt_shiJian01")
            }
        }
        let imageName = visible == true && "zjm_bt_shiJian02" || "zjm_bt_shiJian01"

    }

    refreshUI() {
        let msgCount = this.showMsgList.length
        //TLog.Debug("IconMsgFrame.refreshUI",msgCount)
        if (msgCount <= 1) {
            this.mIconFrame.visible = (false)
        }
        this.updateMsgBox()
        if (msgCount == 0) {
            return
        }

        let iconW = this.iconList[1].width //this.mElemList["Icon1"].width
        let spaceX = 5
        let startX = 10//(640 - (iconW + (msgCount - 1) * (iconW + spaceX) ) ) / 2
        let startY = 5

        for (let i = 0; i < this.showMsgList.length; i++) {
            let msgData = this.showMsgList[i]

            //let x = (msgCount - i) * (iconW + spaceX) + startX //从右到左
            let x = (i) * (iconW + spaceX) + startX  //从左到右
            let y = startY

            UiUtil.setXY(msgData.window, x, y)

            let imageName = this.getImageByType(msgData.type)
            msgData.window.source = (imageName)
        }
        let frameW = 2 * startX + iconW + (msgCount - 1) * (iconW + spaceX)
        UiUtil.setWH(this.mIconFrame, frameW, this.mIconFrame.height)

    }


    getFreeIconSlot() {
        //TLog.Debug("IconMsgFrame.getFreeIconSlot")

        //TLog.Debug_r(this.showMsgList)

        for (let i = 1; i <= this.MaxSize; i++) {
            //TLog.Debug("get window ", i)
            let window = this.iconList[i] // this.mElemList["Icon"+i]
            let isHaveDataWnd = false
            for (let _i in this.showMsgList) {
                let _v = this.showMsgList[_i]

                if (_v.window == window) {
                    isHaveDataWnd = true
                }
            }
            if (window.visible == false && !isHaveDataWnd) {
                return window
            }
        }

        //TLog.Debug("IconMsgFrame.getFreeIconSlot null")
        return null
    }

    isIconTypeExsit(type: string) {
        for (let msgData of this.waitMsgList) {
            if (msgData.type == type)
                return true;
        }

        for (let msgData of this.showMsgList) {
            if (msgData.type == type)
                return true;
        }

        return false;
    }


    addNewMsg(cbObj: IIconMsgCallBack, userData, type) {

        this.idSeed = this.idSeed + 1
        //TLog.Debug("IconMsgFrame.addNewMsg",this.idSeed,this.hideState)
        //TLog.Debug_r(userData)
        let msgData: any = {}
        msgData.id = this.idSeed
        msgData.cbObj = cbObj		//callbackObj
        msgData.userData = userData
        msgData.type = type

        //新手期间，只是准许插入养成事件
        //if (!GuideSystem.getInstance().isFinishGuideEvent()) {
        //    if (type != IconMsgType.GROW_EVENT) {
        //        JsUtil.arrayInstert(this.waitMsgList, msgData)
        //        return msgData.id
        //    }
        //}

        if (!this.hideState) {
            JsUtil.arrayInstert(this.waitMsgList, msgData)
            return msgData.id
        }

        GameSound.getInstance().playEffect(SystemSound.effect_newMsg)

        this.showWnd()
        let iconSlot = this.getFreeIconSlot()
        //TLog.Debug("get iconSlot" ,iconSlot.GetName())
        if (iconSlot) {
            msgData.window = iconSlot
            this.openNextMsg(msgData)
        } else {
            JsUtil.arrayInstert(this.waitMsgList, msgData)
        }

        // WngMrg.getInstance().addHideStatck(this) ){
        //	this.hideWnd()
        //}

        return msgData.id
    }

    removeIconMsgByType(type) {
        let removeList = []
        for (let _ = 0; _ < this.showMsgList.length; _++) {
            let v = this.showMsgList[_]

            if (v.type == type) {
                JsUtil.arrayInstert(removeList, v.id)
            }
        }

        for (let _ = 0; _ < this.waitMsgList.length; _++) {
            let v = this.waitMsgList[_]

            if (v.type == type) {
                JsUtil.arrayInstert(removeList, v.id)
            }
        }
        //把相同类型的全部删除了
        for (let _ = 0; _ < removeList.length; _++) {
            let id = removeList[_]

            this.removeMsg(id)
        }
    }

    removeMsg(id) {
        //如果在等待列表中，就直接移除
        for (let i = 0; i < this.waitMsgList.length; i++) {
            let v = this.waitMsgList[i]

            if (v.id == id) {
                JsUtil.arrayRemove(this.waitMsgList, i)
                return
            }
        }

        //从showMsgList移除
        let msgData = null
        for (let i = 0; i < this.showMsgList.length; i++) {
            let v = this.showMsgList[i]

            if (v.id == id) {
                msgData = v
                JsUtil.arrayRemove(this.showMsgList, i)
                break
            }
        }

        //从等待列表找出新的消息
        if (msgData) {
            msgData.window.visible = (false)
            msgData.window = null

            let waitMsg = JsUtil.arrayRemove(this.waitMsgList, 0)
            let iconSlot = this.getFreeIconSlot()
            TLog.Assert(iconSlot)

            if (waitMsg) {
                waitMsg.window = iconSlot
                this.openNextMsg(waitMsg)
            }

            this.refreshUI()
        }

        if (this.showMsgList.length + this.waitMsgList.length == 0) {
            this.hideWnd()
        }

        return msgData
    }


    onShowMsgList(args) {
        //tolua.cast(args, "gui::GUIMouseEvent")

        if (this.showMsgList.length == 1) {
            let msgData = this.showMsgList[0]

            this.onHandleMsgData(msgData)
            return
        }

        this.mIconFrame.visible = (!this.mIconFrame.visible)
        //this.mIconFrame.MoveToBack()
        this.refreshUI()
    }


    onIconClick(args) {
        //tolua.cast(args, "gui::GUIMouseEvent")

        let msgData = null
        for (let i = 0; i < this.showMsgList.length; i++) {
            let v = this.showMsgList[i]

            if (v.window == args.target) {
                msgData = v
                break
            }
        }

        this.onHandleMsgData(msgData)
        //TLog.Debug("IconMsgFrame.onIconClick",msgData)
        //if(msgData ){
        //	this.removeMsg(msgData.id)
        //	msgData.cbObj.IconMsgCallBack(msgData.userData)
        //}

    }



    onHandleMsgData(msgData) {
        if (msgData) {

            let ret = msgData.cbObj.onIconMsgCallBack(msgData.id, msgData.userData)

            //返回false，表示不取消icon
            if (ret == false) {
                return
            }

            this.removeMsg(msgData.id)

            // let removeList = []
           
            // for (let _ = 0; _ < this.showMsgList.length; _++) {
            //     let v = this.showMsgList[_]

            //     if (v.type == msgData.type) {
            //         JsUtil.arrayInstert(removeList, v.id)
            //     }
            // }

            // for (let _ = 0; _ < this.waitMsgList.length; _++) {
            //     let v = this.waitMsgList[_]

            //     if (v.type == msgData.type) {
            //         JsUtil.arrayInstert(removeList, v.id)
            //     }
            // }
            // //把相同类型的全部删除了
            // for (let _ = 0; _ < removeList.length; _++) {
            //     let id = removeList[_]

            //     this.removeMsg(id)
            // }
        }
    }

    //hideShowWnd(){
    //	//TLog.Debug("hideShowWnd")
    //	for(let _ in this.showMsgList){
    //			let info = this.showMsgList[_]

    //		info.window.visible = (false)
    //	}		
    //}

    //新手引导指定显示的类型(战斗结束后，要显示)
    restoreNextMsg(type) {
        let iconSlot = this.getFreeIconSlot()
        if (iconSlot == null) {
            return
        }
        let msgData = null
        for (let i = 0; i < this.waitMsgList.length; i++) {
            let v = this.waitMsgList[i]

            if (v.type == type || type == null) {
                msgData = v
                JsUtil.arrayRemove(this.waitMsgList, i)
                break
            }
        }
        if (msgData == null) {
            return
        }

        msgData.window = iconSlot
        this.openNextMsg(msgData)
    }


    onStateActive(args) {
        let isFightBegin = FightSystem.getInstance().isFight()
        let [fightType] = FightSystem.getInstance().getCurFightType()
        if(isFightBegin == true && fightType == opFightResultType.PATROL){
             this.setShowState(true)
             return
        }

        let curState = StateManager.getInstance().GetCurrentStateType()
        if (curState == state_type.LIVE_BASE_STATE || curState == state_type.LIVE_ACTIVITY_MSG_STATE) { 	 //生活场景
            this.setShowState(true)
        } else {
            this.setShowState(false)
        }
    }
    setShowState(state) {
        if (this.hideState == state) {
            return
        }
        if (state) {
            this.loadWnd()

            this.hideState = true

            let type = null
            //if (!GuideSystem.getInstance().isFinishGuideEvent()) {
            //    type = IconMsgType.GROW_EVENT
            //}
            this.restoreNextMsg(type)

            let msgCount = this.showMsgList.length
            if (msgCount > 0) {
                this.showWnd()
                //临时
                //this.mLayoutNode.MoveToBack()
            }
            //this.resetShowWnd()
        } else {
            this.hideState = false
            this.hideWnd()
            //this.hideShowWnd()
        }
    }


    onMouseDown(args: GameTouchEvent) {
        let target = args.touchEvent.target;

        if (UiUtil.isExcludeChild(target, [this.mLayoutNode, this.mIconFrame])) {
            this.mIconFrame.visible = (false)
            this.refreshUI()
        }
    }
}