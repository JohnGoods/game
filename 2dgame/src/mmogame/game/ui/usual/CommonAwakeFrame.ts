// TypeScript file
class CommonAwakeFrame extends BaseWnd {
    type

    actor : UIActorView

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/usual/CommonAwakeLayout.exml"]


    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.width = 640
        this.mLayoutNode.height = 750
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_skin", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSkinClick },
            { ["name"]: "btn_property", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPropertyClick },
            { ["name"]: "btn_tupo", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTupoClick },
            { ["name"]: "btn_look", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLookClick },

        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
        
        this.actor = UIActorView.newObj(this.mLayoutNode, "actor_view", 0, 0, this.mElemList["actor"])
    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.onRefresh()
    }

    public onHide(): void {
       this.mLayoutNode.visible = false
       this.actor.clearView()
    }

    
    onRefresh(){
        let modelId = GetHeroSkinModel(this.type)
        this.actor.updateByPlayer(modelId)
    }

    ////////////////////////响应事件
    onSkinClick(){
        FunUITools.openSkinsFrame(this.type)
    }

    onPropertyClick(){
        FunUITools.openPropertyFrame(this.type)
    }

    onTupoClick(){

    }

    onLookClick(){

    }


    ///////////-------
    onShowWnd(cellIndex){
        this.type = cellIndex
        this.showWnd()
    }
}