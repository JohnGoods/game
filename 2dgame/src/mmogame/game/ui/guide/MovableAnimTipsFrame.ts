/*
作者:
    yangguiming
	
创建时间：
   2018.04.19(周四)

意图：
   提示式指引窗口
	可移动的帧动画（如果不设置moveTarget,作用与AnimTipsFrame一样）
公共接口：
   
*/
class MovableAnimTipsFrame extends BaseWnd {

    spacex: number
    spacey: number;
    timerList: any;
    

    
    animBoxName:string;
    loop:boolean;
    adp:boolean;
    animSpeed:number;

    w:number;
    h:number;

    curTargetWindow:egret.DisplayObjectContainer;
    ox:number;
    oy:number;

    srcOx:number
    srcOy:number

    targetOx:number
    targetOy:number
   

    bMoving:boolean;
    srcWindowPath:string;//开始位置
    targetWindowPath:string;//目标位置
    curWindowPath:string;//当前位置
    moveTime:number;

    targetWnd:BaseWnd;
   

    parentWnd:BaseWnd;
    registEvent:boolean;

    
   

    public initObj(...args: any[]): void {
        this.spacex = 100
        this.spacey = 100
        this.registEvent = false;
        this.bMoving = false
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
        function tick(delay) {

            if(this.bMoving == false){
                this.refreshDockPos()
            }
            if(this.mVisible)
                this.checkDockPos()
                
        }
        this.timerList["delayShow"] = SetTimer(tick, this, 200, false)
        this.mLayoutNode.visible = (true)

        this.bMoving = false
        this.curTargetWindow = <egret.DisplayObjectContainer>IGlobal.guiManager.getChildFromPath(this.curWindowPath)
        this.refreshAnim()
        this.refreshDockPos()
        this.checkDockPos()
    }

    onHide() {
        this.mLayoutNode.visible = (false)
        
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
        this.curTargetWindow = window || null
        //当前控件路径
         if(this.curTargetWindow != null){
            this.srcWindowPath = IGlobal.guiManager.getPathFromChild(this.curTargetWindow)
            this.curWindowPath = this.srcWindowPath
        }
        
        this.ox = param["offsetX"] || 0
        this.oy = param["offsetY"] || 0

        this.srcOx = this.ox
        this.srcOy = this.oy

        this.targetOx = param["targetOffsetX"] || 0
        this.targetOy = param["targetOffsetY"] || 0
       

        //目标控件路径
        this.targetWindowPath = param["moveTarget"] || ""
        let pathlist: string[] = splitString(this.targetWindowPath, "/")
        if(pathlist.length > 0){
            let targetWindowName = pathlist[0]
            this.targetWnd = WngMrg.getInstance().getWindow(targetWindowName)
        }else{
             this.targetWnd = null
        }
        
       this.moveTime = checkNull(param["moveTime"] , 1000)

       

    }


    refreshAnim() {
        let animBox:gui.AnimBox = this.mElemList["animbox"]
     
        animBox.setAnimName(this.animBoxName)//("guide_arrow_left")//(param[""])//
        animBox.setAnimInterval(this.animSpeed)
        animBox.setLoop(this.loop)
    }
    


    refreshDockPos() {
        let animBox:gui.AnimBox = this.mElemList["animbox"]
        let new_w = this.w
        let new_h = this.h

       
        if (this.curTargetWindow) {

            if(this.curTargetWindow.stage == null){
                this.curTargetWindow = <egret.DisplayObjectContainer>IGlobal.guiManager.getChildFromPath(this.curWindowPath)
                if(this.curTargetWindow == null){

                    //开始位置窗口隐藏了，这里也要关闭
                    if(this.curWindowPath == this.srcWindowPath){
                        this.hideWnd()
                    }
                    
                    return
                }
            }
            //TLog.Debug("add Window")
            //TLog.Debug("add Window",this.frame.name(),this.addWindow.name())
            
            let baisx = 0;
            let baisy = 0;
            let parent = this.curTargetWindow
            if(parent.addChild == null){
                 parent = this.curTargetWindow.parent
                 baisx = this.curTargetWindow.x
                 baisy = this.curTargetWindow.y
            }

            if(parent != null){
                if (! parent.getChildByName(this.mLayoutNode.name) ) {
                    parent.addChild(this.mLayoutNode)
                    //this.frame.SetLayer(gui.Window.LayerEffect)
                }
                
                if (this.adp == true) {
                    new_w = new_w + this.curTargetWindow.width
                    new_h = new_h + this.curTargetWindow.height
                }

                UiUtil.setXY(this.mLayoutNode, this.ox + baisx, this.oy+ baisy)
            }

           
        }

        UiUtil.setWH(animBox, new_w, new_h)
        UiUtil.setWH(this.mLayoutNode, new_w, new_h)
        
        animBox.anchorOffsetX = animBox.width / 2
        animBox.anchorOffsetY = animBox.height / 2
    }



    

    checkDockPos() {
        if(this.targetWnd == null)
            return;

        //移动过程中，父类关闭了
        if(this.bMoving){
             if(this.curTargetWindow && this.curTargetWindow.stage == null){
                this.curTargetWindow = <egret.DisplayObjectContainer>IGlobal.guiManager.getChildFromPath(this.curWindowPath)
                if(this.curTargetWindow == null){
                    if(this.curWindowPath == this.targetWindowPath){//开始位置的父窗口隐藏了
                        this.startMoveToTarget(this.srcWindowPath, this.srcOx, this.srcOy)//回到原来控件
                    }else{
                         this.hideWnd()
                    }
                }
            }
            return;
        }
        
        if(this.targetWnd.isVisible() && this.targetWnd.isLoadComplete()){
            this.startMoveToTarget(this.targetWindowPath, this.targetOx, this.targetOy)//移到目标位置
        }else{
            this.startMoveToTarget(this.srcWindowPath, this.srcOx, this.srcOy)//回到原来控件
        }

    }

    startMoveToTarget(path:string, offsetX, offsetY) {
        if(this.curWindowPath == path)
            return;

        this.ox = offsetX
        this.oy = offsetY
        
        //let curWindow = <egret.DisplayObjectContainer>IGlobal.guiManager.getChildFromPath(this.curWindowPath)

        let targetWindow = <egret.DisplayObjectContainer>IGlobal.guiManager.getChildFromPath(path)
        if(targetWindow == null){
            //TLog.Error("MovableAnimTipsFrame %s not exsit", path)
            this.hideWnd()
            return
        }
        let node = this.mLayoutNode
        TLog.Assert(node.parent != null)


        //开始位置
        let startPos = null
        if(gui.GuiManager.getInstance().isRootNode(node.parent) == true){//移动过程中，父节点是rootNode
            startPos = new egret.Point(node.x, node.y)
        }else{
            startPos = core.EgretUtil.nodeToStageXY(node, 0, 0)
        }

        //目标位置
        let endPos = core.EgretUtil.nodeToStageXY(targetWindow, this.ox, this.oy)

        
        if(node.parent){
            node.parent.removeChild(node)
            gui.GuiManager.getInstance().setNodeLayer(node, gui.GuiLayer.Top);
        }

        egret.Tween.removeTweens(node);
        egret.Tween.get(node).set({x: startPos.x, y: startPos.y}).to({x: endPos.x, y:endPos.y}, this.moveTime).call(this.onMoveToComplete, this, []);

        this.bMoving = true
        this.curWindowPath = path;
        this.curTargetWindow = targetWindow
    }

    onMoveToComplete(){
        this.bMoving = false
        this.refreshDockPos()
    }





    onUISHowEvent(args){
        if(args.window == this.parentWnd){
            this.showWnd()
        }
    }


}