// TypeScript file

// TypeScript file


class DramaTipsFrame extends BaseWnd {

    actorView: UIActorView;

    content:string[];
    font:string;
    window_y:number;
    rightType:boolean;
    headID:number;
    guideType:number;
    
    curIndex:number;
    click:boolean;

    timerList:any;

    

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/TaskDialogLayout.exml"]
        this.content = null;
        
        this.font="ht_24_cc"	
        this.window_y=0
        this.rightType=false
        this.headID = 3009

        this.guideType = 0;

        this.timerList = {}
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        //this.setFullScreen(true)
        //this.setAlignCenter(true, true)
        this.mLayoutNode.setDoModal(true, 10)
        this.initSkinElemList();


        var elemInfo = [
            //{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);


        this.mLayoutNode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTips, this)


        this.actorView = UIActorView.newObj(this.mLayoutNode, "actorView", 0, 0, this.mElemList["group_actorview"])
        this.actorView.setActorScale(1.2)

    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        UiUtil.registerTouchOutsideEvent(this.onClickTips, this, [this.mLayoutNode])
        RegisterEvent(EventDefine.STATE_ACTIVE, this.fightHideFrame, this)
        RegisterEvent(EventDefine.STATE_DEACTIVE, this.fightEndShowFrame, this)

        if (this.guideType > 0) {
            this.mLayoutNode.setDoModal(true, this.guideType)
        }
        this.mLayoutNode.visible = true;

        this.refreshFrame()

        if (!this.timerList["moveToFront"]) {
            let tick = function (delay) {
                this.mLayoutNode.moveToFront()
            }
            this.timerList["moveToFront"] = SetTimer(tick, this, 0, false)
        }
    }

    public onHide(): void {
        UiUtil.unRegisterTouchOutsideEvent(this.onClickTips, this)
        UnRegisterEvent(EventDefine.STATE_ACTIVE, this.fightHideFrame, this)
        UnRegisterEvent(EventDefine.STATE_DEACTIVE, this.fightEndShowFrame, this)


        this.actorView.clearView();



        this.mLayoutNode.visible = false;
        if (this.guideType > 0) {
            this.mLayoutNode.setDoModal(false, 0)
        }


        for (let _ in this.timerList) {
            let timer = this.timerList[_]

            KillTimer(timer)
        }
        this.timerList = {}
    }

    public setTipsData(param){
        this.window_y=param["window_y"] || 0
        this.rightType=param["rightType"] || false
        this.content=param["content"] || null
        this.font=param["font"] || "ht_24_lc"
        this.headID=param["headID"] || 7000
        this.curIndex=0
        this.guideType=param["guideType"] || 0	
        this.click=param["clickClose"] || false
        
    }


    refreshFrame() {
        let modelId = this.headID || 3009
        let player = this.actorView.updateByPlayer(modelId)

        if(this.rightType == true){
            this.mLayoutNode.currentState = "my"
            player.setDir(ActorDirMap.Left)
        }else{
            this.mLayoutNode.currentState = "other";
            player.setDir(ActorDirMap.Right)
        }


        let showContent = this.content[this.curIndex]
        showContent = XmlConverter.convertDynamicWord(showContent)
        
        let rd: gui.RichDisplayer = this.mElemList["rd_content"]
        AddRdContent(rd, showContent, this.font, "ublack", 2)

        this.mLayoutNode.y = this.window_y;
    }




    onClickTips(event: egret.TouchEvent|GameTouchEvent) {
        if(! this.click ){
            return
        }
        let parentNode = this.mLayoutNode.parent
        let childIndex = parentNode.getChildIndex(this.mLayoutNode)
        if(childIndex != parentNode.numChildren - 1)
            return ;

        //TLog.Debug("DramaTipsFrame.onClickTips")
        if(this.curIndex < this.content.length - 1 ){ 
            this.curIndex=this.curIndex+1
            this.refreshFrame()
        }else{
            this.hideWnd()
        }

    }


    fightEndShowFrame(args) {
        //TLog.Debug("DramaTipsFrame.fightEndShowFrame",args.stateType) 
        if (args.stateType == state_type.COMBAT_BASE_STATE) {
            if (this.guideType > 0) {
                this.mLayoutNode.setDoModal(true, this.guideType)
            }
            this.mLayoutNode.visible = (true)
            this.refreshFrame()
        }
    }

    fightHideFrame(args) {
        if (args.stateType == state_type.COMBAT_BASE_STATE || args.stateType == state_type.LIVE_STORY_STATE) {
            this.mLayoutNode.visible = (false)
            if (this.guideType > 0) {
                this.mLayoutNode.setDoModal(false, this.guideType)
            }
        }
    }

}
