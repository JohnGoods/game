class PublicNoticeFrame extends BaseWnd {

    messageList:any[]
    curMsgData
    //relateWindows
    timerList

    showAction:MoveAction;
    hideAction:MoveAction;

    noticeFrame:gui.LayoutNode;
    noticeEnable: boolean

    public initObj(...args: any[]): void {
        this.messageList = []
        this.curMsgData = null
        //this.relateWindows = {}								//保存公告出来期间需要调整位置Y值的window（C++对象），及相关action
        this.timerList = {}
        this.noticeEnable = true
    }

    onLoad() {
        this.createLayout()
        //RegisterEvent(EventDefine.STATE_ACTIVE, this.onStateActive, this)
    }

    onUnLoad() {
        //UnRegisterEvent(EventDefine.STATE_ACTIVE, this.onStateActive, this)

        // for (let _ in this.relateWindows) {
        //     let action = this.relateWindows[_]

        //     action.deleteObj()
        // }
        // this.relateWindows = {}
    }

    onShow() {
        //let isFight = FightSystem.getInstance().isFight()
        //RegisterEvent(EventDefine.PET_ENTER_HOOP,this.onEnterQuickRecruit,this)
        this.showAction.run()
        
        this.mLayoutNode.visible = (this.noticeEnable)
        this.noticeFrame.visible = (this.noticeEnable)
    }

    onHide() {
        //UnRegisterEvent(EventDefine.PET_ENTER_HOOP,this.onEnterQuickRecruit,this)
        this.showAction.stop()
        this.hideAction.stop()
        this.mLayoutNode.visible = (false)

        for (let _ in this.timerList) {
            let timer = this.timerList[_]

            KillTimer(timer)
        }
        this.timerList = {}
    }


    createLayout() {
        this.mElemList = {}

        let width = 597
        let height = 51
        UiUtil.setWH(this.mLayoutNode, width, height)
        this.mLayoutNode.horizontalCenter = 25.5;
        this.mLayoutNode.bottom = 285

        let info: any = [
            {["index_type"] : gui.Grid9Image,	["name"] : "gongGaoBg",			["title"] :null, 	   ["font"] : null,			["image"] : "zjm_gongGaoDi01",	["color"] : gui.Color.darksalmon,	["x"] : 0, ["y"] : 0, ["w"]: width, ["h"]: height,["event_name"] : null,["fun_index"] : null},
	        //{["index_type"] : eui.Image,	["name"] : "gongGaoIcon",			["title"] :null, 	   ["font"] : null,			["image"] : "zjm_paoMaDengDi02",	["color"] : gui.Color.darksalmon,	["x"] : 0, ["y"] : 0, ["event_name"] : null,["fun_index"] : null},
            // { ["index_type"]: eui.Label, ["name"]: "gongGao", ["title"]: Localize_cns("GONGGAO"), ["font"]: "ht_20_lc_stroke", ["image"]: "", ["color"]: gui.Color.darksalmon, ["x"]: 15, ["y"]: 3, ["w"]: 100, ["h"]: 25, ["event_name"]: null, ["fun_index"]: null },
        ]
        UiUtil.createElem(info, this.mLayoutNode, this.mElemList, this)
        //this.mElemList["gongGaoBG"]:SetHandleMessageFlag(gui.Window.TraceMouseAll)

        let data: any = { ["startX"]: 0, ["startY"]: -height, ["endX"]: 0, ["endY"]: 0,  ["moveType"]: "inertional", }
        this.showAction = MoveAction.newObj(this.mLayoutNode, 200, data, null, this)
        data = { ["startX"]: 0, ["startY"]: 0, ["endX"]: 0, ["endY"]: -height,  ["moveType"]: "inertional", }
        this.hideAction = MoveAction.newObj(this.mLayoutNode, 200, data, this.hideWnd, this)

        
        this.noticeFrame = this.createLayoutNode("noticeFrame")
        UiUtil.setWH(this.noticeFrame, 535, 30)
        UiUtil.setXY(this.noticeFrame, 50, 15)
        this.noticeFrame.mask = new egret.Rectangle(0, 0, this.noticeFrame.width, this.noticeFrame.height);//裁剪区域

        let mElemInfo: any = [
            { ["index_type"]: gui.RichDisplayer, ["name"]: "content", ["title"]: null, ["font"]: "ht_20_cc", ["image"]: "", ["color"]: gui.Color.springgreen, ["x"]: 0, ["y"]: 0, ["w"]: 2000, ["h"]: height, ["event_name"]: null, ["fun_index"]: null, },
        ]
        UiUtil.createElem(mElemInfo, this.noticeFrame, this.mElemList, this)

        this.noticeFrame.setLayer(gui.GuiLayer.Top)
        this.mLayoutNode.addChild(this.noticeFrame)
        this.noticeFrame.visible = (true)
        //this.noticeFrame.SetClipEnable(true)

        //初始化richdisplayer
        //let rd = this.mElemList["content"]
        //rd.SetDisplayFlag(Core.Flag.V_CENTER + Core.Flag.V_REVERSE)
        //rd.SubscribeEvent(gui.IRichDisplayer.RichDisplayerLinkCmdEvent, this.onClickHyperLink, this)
        // this.mLayoutNode.setLayer(gui.GuiLayer.Top)
        this.mLayoutNode.touchEnabled = false;
        this.mLayoutNode.touchChildren = false;
        //this.mLayoutNode.setAlignFlag(Core.Flag.CENTER_TOP, 28, 56)

        //this.mLayoutNode.SetClipEnable(true)
        //this.mLayoutNode.SetHandleMessageFlag(gui.Window.TraceMouseAll)
    }




    clearMsg() {
        this.messageList = []

        let msgData = this.curMsgData
        if (msgData && msgData.showAction) {
            msgData.showAction.stop()
            msgData.showAction = null
            this.hideWnd()
            FireEvent(EventDefine.NOTICE_FRAME_HIDE, null)
            this.curMsgData = null
        }
    }

    addNewMsg(text, count, priority) {
        //JsUtil.arrayInstert(this.messageList  ,data)
        //let curState = StateManager.getInstance().GetCurrentStateType()
        //if(curState!= state_type.LIVE_BASE_STATE ){
        //	return
        //}
        this.showWnd()

        if (count == null || count <= 0) {
            count = 1
        }

        let msgData: any = {}
        msgData.text = text
        msgData.count = count
        msgData.priority = priority || 0

        //当前无公告显示
        if (this.curMsgData == null) {
            this.showNextMsg(msgData)
        } else {//当前有公告显示
            let pri = 1
            for (let k = 0; k < this.messageList.length; k++) {
                let v = this.messageList[k]

                if (v.priority < msgData.priority) {
                    pri = k + 1
                } else {
                    break
                }
            }

            JsUtil.arrayInstert(this.messageList, pri, msgData)
        }

    }

    onMoveFinishCallback() {
        if (this.curMsgData == null) {
            TLog.Error("PublicNoticeFrame.onMoveFinishCallback")
            return
        }

        this.curMsgData.count = this.curMsgData.count - 1
        if (this.curMsgData.count > 0 && size_t(this.messageList) == 0) {
            this.showNextMsg(this.curMsgData)
        } else {
            //显示并删除最后一个
            let msgData = JsUtil.arrayRemove(this.messageList)
            this.showNextMsg(msgData)

            if (!msgData) {
                //this.hideWnd()
                FireEvent(EventDefine.NOTICE_FRAME_HIDE, null)
                this.hideAction.run()
            }

        }
    }


    showNextMsg(msgData) {
        //let curState = StateManager.getInstance().GetCurrentStateType()
        //if(curState != state_type.LIVE_BASE_STATE ){
        //	return
        //}
        this.curMsgData = msgData
        if (this.curMsgData == null) {
            return
        }

        let text = this.curMsgData.text

        if (msgData.showAction) {
            msgData.showAction.stop()
            msgData.showAction = null
        }

        let rd: any = {}
        rd.no_change_font = false
        rd.default_color = "cyan"
        rd.defalut_font = "ht_20_lc"
        rd.no_break_line = false

        let contentY = this.mElemList["content"].y
        //let contentH = this.mElemList["content"]:GetHeight()
	
        this.mElemList["content"].width = 100000


        this.mElemList["content"].clear()
        this.mElemList["content"].addXmlString(ChannelHyperlinkMrg.getInstance().analyzeHyperLink(text))//(XmlConverter.parseText(text, rd))
        

        let msgWidth = this.mElemList["content"].getLogicWidth()
        this.mElemList["content"].width = msgWidth + 4

        let frameWidth = this.noticeFrame.width;
        let data: any = { ["startX"]: frameWidth, ["startY"]: contentY, ["endX"]: -(msgWidth + 4), ["endY"]: contentY, ["moveType"]: "inertional", }
        msgData.showAction = MoveAction.newObj(this.mElemList["content"], 10000, data, this.onMoveFinishCallback, this)
        msgData.showAction.run()

        FireEvent(EventDefine.NOTICE_FRAME_SHOW, null)
    }

    //解释和设置超链接的表现
    analyzeHyperLink(content) {
        //let color = white
        function parseLinkHandler(linkContent) {
            let info: any = {}
            info.link = null
            info.name = null
            info.color = null

            //窗口名，颜色

            let matchRet = StringUtil.stringMatch(linkContent, /(\d+);(\d+);(.+)/);
            if(matchRet == null)
                return;


            let linkType = matchRet[0], wndName = matchRet[1], content = matchRet[2]
            if (!linkType || !wndName || !content) {
                return null
            }

            

            info.name = content
            info.link = StringUtil.stringReplace(linkContent,  " ", "-" )
            info.color = "red"
            return info
        }

        let param: any = {}
        param.no_change_font = true
        param.default_color = "cyan"
        param.defalut_font = "ht_20_lc_stroke"
        param.link_parser = parseLinkHandler
        return XmlConverter.parseText(content, param)
    }

    setPublicEnable(b: boolean) {
        this.noticeEnable = b

        if (this.mbLoad == true) {
            if (this.noticeEnable == false) {
                this.mLayoutNode.visible = (this.noticeEnable)
                this.noticeFrame.visible = (this.noticeEnable)
            } else {
                if (this.isVisible() == true) {
                    this.mLayoutNode.visible = (this.noticeEnable)
                    this.noticeFrame.visible = (this.noticeEnable)
                }
            }
        }
    }
}