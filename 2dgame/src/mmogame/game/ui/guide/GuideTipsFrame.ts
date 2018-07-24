/*
作者:
    liuziming
	
创建时间：
   2013.10.31(周四)

意图：
   提示式指引窗口
	 用于文字提示说明
公共接口：
   
*/
class GuideTipsFrame extends BaseWnd {

    content: string;
    font: string;
    max_w: number;
    spacex: number;
    spacey: number;

    guideType: number;

    curIndex: number;
    click: boolean;

    //showTimer: any;
    curTime: number

    addWindow: egret.DisplayObjectContainer
    pointWindow: egret.DisplayObjectContainer;

    addWindowFullPath:string;
    pointWindowFullPath:string;


    public initObj(...args: any[]): void {
        this.content = "aaaaaaaaaaaaaaaaaa"
        this.max_w = 300
        this.spacex = 100
        this.spacey = 100

        this.font = null
        //this.createFrame()
        this.click = false
        
        this.guideType = 0
        this.pointWindow = null


        //this.showTimer = null
        this.curTime = 0
    }

    onLoad() {
        //this.setStateAutoShow(true)
        this.createFrame()
    }

    onUnLoad() {

    }

    onShow() {
        //TLog.Debug("GuideTipsFrame.onShow")
        this.mLayoutNode.visible = (true)
        if (this.guideType > 0) {
            this.mLayoutNode.setDoModal(true, 10)
        }
        this.refreshFrame()
    }

    fightEndShowFrame(args) {
        if (args.stateType == state_type.COMBAT_BASE_STATE) {
            // if (this.showTimer == null) {
            //     this.showTimer = SetTimer(this.onShowTimer, this, 20, true)
            // }
            this.mLayoutNode.visible = (true)
            if (this.guideType > 0) {
                this.mLayoutNode.setDoModal(true, 10)
            }
            this.refreshFrame()
        }
    }

    onHide() {
        TLog.Debug("GuideTipsFrame.onHide")
        this.mLayoutNode.visible = (false)
        if (this.guideType > 0) {
            this.mLayoutNode.setDoModal(false, 10)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    createFrame() {

        
        let width = 164, height = 116
        let rdWidth = 300, rdHeight = 200

        UiUtil.setWH(this.mLayoutNode, width, height)
        this.mElemList = {}
        let mElemInfo: any = [
            { ["index_type"]: eui.Group, ["name"]: "bg_arrow",  ["x"]: 0, ["y"]: 0, ["w"]: 34, ["h"]: 30 },
            { ["index_type"]: eui.Image, ["name"]: "icon_arrow", ["parent"]:"bg_arrow", ["image"]:"zhiYinTiShiKuang01", ["verticalCenter"]: 0, ["horizontalCenter"]: 0, ["w"]: 34, ["h"]: 30 },
            { ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["title"]: null, ["font"]: "ht_20_cc", ["image"]: "zhiYinTiShiKuang02", ["color"]: gui.Color.springgreen, ["x"]: 0, ["y"]: 0, ["w"]: rdWidth, ["h"]: rdHeight, ["event_name"]: null, ["fun_index"]: null, },
            { ["index_type"]: gui.RichDisplayer, ["name"]: "content", ["parent"]: "bg", ["title"]: null, ["font"]: "ht_20_cc", ["image"]: "", ["color"]: gui.Color.springgreen, ["x"]: 5, ["y"]: 5, ["w"]: rdWidth, ["h"]: rdHeight, ["event_name"]: null, ["fun_index"]: null, },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)
        
        this.mLayoutNode.touchEnabled = false;
        this.mLayoutNode.touchChildren = false;


        let imgArrow:eui.Image = this.mElemList["icon_arrow"]
        imgArrow.anchorOffsetX = imgArrow.width/2
        imgArrow.anchorOffsetY = imgArrow.height/2
    }

    ox:number;
    oy:number;
    dir:string;

    setTipsData(param, window) {
        this.content = param["content"] || null
        this.max_w = param["content_w"] || 200
        this.ox = param["offsetX"] || 0
        this.oy = param["offsetY"] || 0
        this.font = param["font"] || "ht_20_cc"
        this.addWindow = null
        this.pointWindow = null

        this.guideType = param["guideType"] || 0
        this.dir = param["dir"] || "left"
        //TLog.Debug("setTipsData")
        if (window) {
            this.addWindow = window
        } else if (param["pointingInfo"]) {
            let windowInfo
            if (param["windowInfo"]) {
                let window = UI_GetWindowByInfo(param["windowInfo"])
                if (!window) {
                    TLog.Error("windowInfo Error  window can't find ")
                    return
                }
                windowInfo = window
            } else {
                let windowName = param["pointingInfo"].windowName
                windowInfo = IGlobal.guiManager.getChildFromPath(windowName)
            }
            this.pointWindow = windowInfo
        }


        if(this.addWindow != null){
            this.addWindowFullPath = IGlobal.guiManager.getPathFromChild(this.addWindow)
        }

        if(this.pointWindow){
            this.pointWindowFullPath = IGlobal.guiManager.getPathFromChild(this.pointWindow)
        }
    }

    checkWindow(window:egret.DisplayObject):boolean{
        if(window == null){
            this.hideWnd()
            return false;
        }
        return true;
    }

    refreshFrame() {
        //TLog.Debug("GuideTipsFrame.refreshFrame")
        if (!this.content) {
            this.hideWnd()
            return
        }

        let bg:gui.Grid9Image = this.mElemList["bg"]
        let rd:gui.RichDisplayer = this.mElemList["content"]
        let bg_arrow:eui.Group = this.mElemList["bg_arrow"]
        let icon_arrow:eui.Image = this.mElemList["icon_arrow"]


        rd.width = this.max_w
        AddRdContent(rd, this.content, this.font, "ublack", 2)
        
        let new_w = Math.max(rd.getLogicWidth(), 50)
        let new_h = Math.max(rd.getLogicHeight(), 50)
        UiUtil.setWH(rd, new_w + 5, new_h + 5)
        
        //TLog.Debug("new_h",new_w,new_h,this.frame.GetX(),this.frame.GetY(),this.frame.width)
        //this.frame.SetXY(this.spacex, this.spacey)
        let wnd_w = new_w + 15
        let wnd_h = new_h + 15
        if (wnd_h < 35) {
            wnd_h = 35
        }
        UiUtil.setWH(bg, wnd_w, wnd_h)		//这时是bg的宽高

        if (this.dir == "top") {
            UiUtil.setXY(bg, 0, 30)
            wnd_w = wnd_w
            wnd_h = wnd_h + 30

            let arrw = bg_arrow.width
            let arrh = bg_arrow.height
            UiUtil.setXY(bg_arrow, (wnd_w - arrw) / 2, 3)
            
            icon_arrow.rotation = 180
        } else if (this.dir == "left") {
            UiUtil.setXY(bg, 30, 0)
            wnd_w = wnd_w + 30
            wnd_h = wnd_h

            let arrw = bg_arrow.width
            let arrh = bg_arrow.height
            UiUtil.setXY(bg_arrow, 3, (wnd_h - arrh) / 2)

            icon_arrow.rotation = 90
        } else if (this.dir == "right") {
            UiUtil.setXY(bg, 0, 0)
            wnd_w = wnd_w + 30
            wnd_h = wnd_h

            let arrw = bg_arrow.width
            let arrh = bg_arrow.height
            UiUtil.setXY(bg_arrow, wnd_w - arrw - 3, (wnd_h - arrh) / 2)

            icon_arrow.rotation = 270
        } else {
            UiUtil.setXY(bg, 0, 0)
            wnd_w = wnd_w
            wnd_h = wnd_h + 30

            let arrw = bg_arrow.width
            let arrh = bg_arrow.height
            
            UiUtil.setXY(bg_arrow, (wnd_w - arrw) / 2, wnd_h - arrh - 3)

            icon_arrow.rotation = 0
        }
        UiUtil.setWH(this.mLayoutNode, wnd_w, wnd_h)
        
        //TLog.Debug("GuideTipsFrame.refreshFrame  111111111")
        if (this.addWindow) {
            if(this.addWindow.stage == null){
                this.addWindow = <egret.DisplayObjectContainer>IGlobal.guiManager.getChildFromPath(this.addWindowFullPath)
                if(this.checkWindow(this.addWindow) == false)
                    return;
            }
            this.addWindow.addChild(this.mLayoutNode)        
            UiUtil.setXY(this.mLayoutNode, this.ox, this.oy)
        } else if (this.pointWindow) {
            if(this.pointWindow.stage == null){
                this.pointWindow = <egret.DisplayObjectContainer>IGlobal.guiManager.getChildFromPath(this.pointWindowFullPath)
                if(this.checkWindow(this.pointWindow) == false)
                    return;
            }

            let spacePoint = core.EgretUtil.nodeToStageXY(this.pointWindow, 0, 0)
            this.spacex = spacePoint.x + this.ox
            this.spacey = spacePoint.y + this.oy

            UiUtil.setXY(this.mLayoutNode, this.spacex, this.spacey)
        }
    }

    // onAnimBoxDesotry( args){
    // 	tolua.cast(args, "gui::GUIEvent")

    // 	let arg:any = {}
    // 	arg.window = this
    // 	GuideSystem.getInstance().onAnimBoxDesotry(arg, true)
    // }
}