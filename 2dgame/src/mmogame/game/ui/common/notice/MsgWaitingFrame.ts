/*
作者:
    yangguiming
	
创建时间：
    2014.08.05(星期二) 

意图：
  网络包等待窗口

公共接口：
	
*/
class MsgWaitingFrame extends BaseWnd {
    bShowAlways: boolean
    timerId: number
    during: number
    delayShowTimer

    Circle_frame:eui.Image;

    public initObj(...args: any[]): void {
        this.mElemList = {}
        this.bShowAlways = true

        RegisterEvent(EventDefine.MSG_WAIT_BEGIN, this.onMsgWaitBegin, this)
        RegisterEvent(EventDefine.MSG_WAIT_END, this.onMsgWaitEnd, this)
    }

    destory() {
        UnRegisterEvent(EventDefine.MSG_WAIT_BEGIN, this.onMsgWaitBegin, this)
        UnRegisterEvent(EventDefine.MSG_WAIT_END, this.onMsgWaitEnd, this)
        this.resetDelayShowTimer()
    }

    onLoad() {
        
        this.createFrame()
    }


    onUnLoad() {

    }

    onShow() {
        this.mLayoutNode.visible = (true)


        if (this.timerId == null) {
            this.during = 0
            this.timerId = SetTimer(this.animRotate, this, 100)
        }
    }


    onHide() {
        this.mLayoutNode.visible = (false)

        if (this.timerId) {
            KillTimer(this.timerId)
            this.timerId = null
        }
        this.bShowAlways = true
        SetGlobalInputStatus(true, "MsgWaitingFrame")
    }


    createFrame() {
        this.mElemList = {}

        let width = 197
        let height = 200

        UiUtil.setWH(this.mLayoutNode, width, height)
        this.setAlignCenter(true, true)


        let mElemInfo: any = [
            { ["index_type"]: gui.Grid9Image, ["name"]: "infobg", ["image"]: "", ["color"]: gui.Color.white, ["horizontalCenter"]:0, ["verticalCenter"]:0, ["w"]: 240, ["h"]: 40, ["event_name"]: null, ["fun_index"]: null },

            { ["index_type"]: gui.AnimBox, ["name"]: "animbox", ["title"]: null, ["image"]: null, ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["verticalCenter"]: 0, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },

            { ["index_type"]: eui.Label, ["name"]: "info", ["title"]: "", ["font"]: "ht_22_cc_stroke", ["color"]: gui.Color.white, ["horizontalCenter"]:0, ["verticalCenter"]:0, ["w"]: 240, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)

        // this.Circle_frame = this.mElemList["Circle_frame"]
        // this.Circle_frame.anchorOffsetX = width/2;
        // this.Circle_frame.anchorOffsetY = height/2;
        this.mElemList["animbox"].animName = "loading"

    }


    animRotate(dt) {
        this.during = this.during + dt
        if (!this.bShowAlways && this.during > MAX_MSG_WAIT_TIME) {
            this.hideWnd()
            return
        }

        // let rotate = Math.floor(this.during * 0.3) % 360
        // this.Circle_frame.rotation = rotate;

    }


    resetDelayShowTimer() {
        if (this.delayShowTimer) {
            KillTimer(this.delayShowTimer)
            this.delayShowTimer = null
            SetGlobalInputStatus(true, "MsgWaitingFrame")
        }
    }


    onMsgWaitBegin(args) {
        TLog.Debug("MsgWaitingFrame.onMsgWaitBegin")
        function delayShow(dt) {
            let title = ""
            if (args) {
                title = args.text || ""
            }

            this.resetDelayShowTimer()
            this.showWnd()
            this.mElemList["info"].text = (title)

            this.mElemList["infobg"].visible = (title != "")
            this.mElemList["info"].visible = (title != "")
        }

        if (this.delayShowTimer == null) {
            let DELAY_TIME = 500 //XX毫秒如果没收到关闭，就显示
            this.delayShowTimer = SetTimer(delayShow, this, DELAY_TIME)

            if (!args || args.lockInput) {
                SetGlobalInputStatus(false, "MsgWaitingFrame")
            }

            this.bShowAlways = !(args && args.bAlways == false)
        }
    }

    onMsgWaitEnd(args) {
        //TLog.Debug("MsgWaitingFrame.onMsgWaitEnd")
        this.resetDelayShowTimer()
        this.hideWnd()
    }

}