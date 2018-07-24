/*
作者:
    liuziming
	
创建时间：
   2013.10.31(周四)

意图：
   提示式指引窗口
	 类似GuideTipsFrame，但这个是通过Animbox的帧动画来表现
公共接口：
   
*/
class AnimTipsFrame extends BaseWnd {

    spacex: number
    spacey: number;
    timerList: any;
    guideType: number;

    
    animBoxName:string;
    loop:boolean;
    adp:boolean;
    animSpeed:number;

    w:number;
    h:number;

    addWindow:egret.DisplayObjectContainer;
    ox:number;
    oy:number;
    showTime:number;
    pointWindow:egret.DisplayObject;
    dir:number;

    
    addWindowFullPath:string;
    pointWindowFullPath:string;

    parentWnd:BaseWnd;
    registEvent:boolean;

    public initObj(...args: any[]): void {
        this.spacex = 100
        this.spacey = 100
        this.registEvent = false;
    }

    destory() {
        if(this.registEvent){
            this.registEvent = false

            UnRegisterEvent(EventDefine.UI_SHOW, this.onUISHowEvent, this)
        }
    }

    onLoad() {
        this.timerList = {}
        this.createFrame()
    }

    onUnLoad() {

    }

    onShow() {
        this.pointWindow = IGlobal.guiManager.getChildFromPath(this.pointWindowFullPath)
        this.addWindow = <egret.DisplayObjectContainer>IGlobal.guiManager.getChildFromPath(this.addWindowFullPath)

        function tick(delay) {
            this.refreshFrame()
        }
        this.timerList["delayShow"] = SetTimer(tick, this, 200, false)

        this.mLayoutNode.visible = (true)
        this.refreshFrame()
    }

    onHide() {
        this.mLayoutNode.visible = (false)
        if (this.guideType > 0) {
            //this.mLayoutNode.setDoModal(false, 10)
        }

        for (let _ in this.timerList) {
            let timer = this.timerList[_]

            KillTimer(timer)
        }
        this.timerList = {}
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    createFrame() {
        let width = 164, height = 116
        let rdWidth = 300, rdHeight = 200

        UiUtil.setWH(this.mLayoutNode, width, height)

        this.mElemList = {}
        let mElemInfo: any = [
            //{["index_type"] : gui.ControlType.Label,	["name"] : "bg",  	["title"] : null,   ["scale_image"] : "frame_bg2",	["color"] : gui.Color.white,		["x"] : 0, ["y"] : 0,		 	["w"] : 640,["h"] : 960, ["event_name"] : null, ["fun_index"] : null,["bAdapteWindow"]:true},
            { ["index_type"]: gui.AnimBox, ["name"]: "animbox", ["title"]: null, ["image"]: null, ["color"]: gui.Color.white, ["horizontalCenter"]: 0, ["verticalCenter"]: 0, ["w"]: 200, ["h"]: 200, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)

        this.mLayoutNode.setLayer(gui.GuiLayer.Top)
        this.mLayoutNode.touchEnabled = false;
        this.mLayoutNode.touchChildren = false;

        this.mLayoutNode.includeInLayout = false;

        // this.mElemList["animbox"]:SubscribeEvent(gui.Window.DestoryEvent, this.onAnimBoxDesotry, this)
        // this.mElemList["animbox"]:Play()
    }


    setTipsData(param, window, parentWnd:BaseWnd) {
        //附加的BaseWnd
        this.parentWnd = parentWnd
        if(this.registEvent == false){
            this.registEvent = true
             RegisterEvent(EventDefine.UI_SHOW, this.onUISHowEvent, this)
        }

        this.animBoxName = param["animbox"] 
        // if (!gb.anim_set.GetInfo(this.animBoxName)) {
        //     this.animBoxName = "guideFang"
        // }
        this.loop = param["loop"] || false
        this.adp = param["adp"] || false
        //TLog.Debug("AnimTipsFrame.setTipsData")

        let info = IGlobal.animSet.getAnimInfo(this.animBoxName)
        if (info == null){
            return
        }
        TLog.Assert(info !=null, "AnimTipsFrame animBoxName:%s", tostring(this.animBoxName))

        
        this.animSpeed = param["animSpeed"] || info.interval

        if (this.adp) {
            this.w = param["width"] || 0
            this.h = param["height"] || 0
        } else {
            this.w = param["width"] || info.w
            this.h = param["height"] || info.h
        }
        this.addWindow = window || null
        this.guideType = param["guideType"] || 0
        this.ox = param["offsetX"] || 0
        this.oy = param["offsetY"] || 0
        if ((param["pointingInfo"] || param["window"]) && GAME_DEBUG == false) {
            this.guideType = 0
        }

        this.showTime = param["delayTime"] || 300
        this.dir = 0
        this.pointWindow = null
        if (param["pointingInfo"]) {
            let windowName = param["pointingInfo"].windowName
            let windowInfo = IGlobal.guiManager.getChildFromPath(windowName)
            if (param["pointingInfo"]["windowInfo"]) {
                let window = UI_GetWindowByInfo(param["windowInfo"])
                windowInfo = windowInfo || window
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
        let animBox:gui.AnimBox = this.mElemList["animbox"]
        let new_w = this.w
        let new_h = this.h

        animBox.setAnimName(this.animBoxName)//("guide_arrow_left")//(param[""])//
        animBox.setAnimInterval(this.animSpeed)
        //animBox.SetReverse(this.loop)
        animBox.setLoop(this.loop)
        //animBox.Play()

        //TLog.Debug("refreshFrame",this.spacex, this.spacey,OffsetX,OffsetY)
        if (this.pointWindow) {
            if(this.pointWindow.stage == null){
                this.pointWindow = IGlobal.guiManager.getChildFromPath(this.pointWindowFullPath)
                if(this.checkWindow(this.pointWindow) == false)
                    return;
            }
            //TLog.Debug("pointWindow")

            let spacePoint =core.EgretUtil.nodeToStageXY(this.pointWindow, 0, 0)
            this.spacex = spacePoint.x + this.ox
            this.spacey = spacePoint.y + this.oy

            if (this.adp == true) {
                new_w = new_w + this.pointWindow.width
                new_h = new_h + this.pointWindow.height
            }
            UiUtil.setXY(this.mLayoutNode, this.spacex, this.spacey)
            this.guideType = 10
            //this.mLayoutNode.SetLayer(gui.Window.LayerEffect)
        }

        if (this.addWindow) {

            if(this.addWindow.stage == null){
                this.addWindow = <egret.DisplayObjectContainer>IGlobal.guiManager.getChildFromPath(this.addWindowFullPath)
                if(this.checkWindow(this.addWindow) == false)
                    return;
            }
            //TLog.Debug("add Window")
            //TLog.Debug("add Window",this.frame.name(),this.addWindow.name())
            
            let baisx = 0;
            let baisy = 0;
            let parent = this.addWindow
            if(parent.addChild == null){
                 parent = this.addWindow.parent
                 baisx = this.addWindow.x
                 baisy = this.addWindow.y
            }

            if(parent != null){
                if (! parent.getChildByName(this.mLayoutNode.name) ) {
                    parent.addChild(this.mLayoutNode)
                    //this.frame.SetLayer(gui.Window.LayerEffect)
                }
                
                if (this.adp == true) {
                    new_w = new_w + this.addWindow.width
                    new_h = new_h + this.addWindow.height
                }

                UiUtil.setXY(this.mLayoutNode, this.ox + baisx, this.oy+ baisy)
            }

           
        }

        UiUtil.setWH(animBox, new_w, new_h)
        UiUtil.setWH(this.mLayoutNode, new_w, new_h)
        

        this.updateDir()
    }
    updateDir() {
        let animBox:gui.AnimBox = this.mElemList["animbox"]
        animBox.anchorOffsetX = animBox.width / 2
        animBox.anchorOffsetY = animBox.height / 2
        animBox.rotation = this.dir;
    }


    onUISHowEvent(args){
        if(args.window == this.parentWnd){
            this.showWnd()
        }
    }

    // onAnimBoxDesotry(args) {
    //     tolua.cast(args, "gui::GUIEvent")

    //     let arg: any = {}
    //     arg.window = this
    //     GuideSystem.getInstance().onAnimBoxDesotry(arg, true)

    //     //this.frame = null
    // }

}