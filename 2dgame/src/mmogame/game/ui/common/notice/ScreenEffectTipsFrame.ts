/*
作者:
    liuziming
	
创建时间：
   2017.03.21(周二)

意图：
   界面（公共）动画（特效、帧动画）提示
公共接口：
   
*/
class ScreenEffectTipsFrame extends BaseWnd {

    effectIdList: number[];
    effectList: any;
    viewIndex: number;

    public initObj(...args: any[]): void {



        this.effectIdList = []
    }

    onLoad() {
        this.viewIndex = 0
        this.effectList = []
        this.createFrame()
    }

    onUnLoad() {

    }

    onShow() {
        this.mLayoutNode.visible = (true)
        this.refreshFrame()
    }

    onHide() {
        this.mLayoutNode.visible = (false)

        for (let _ in this.effectList) {
            let elem = this.effectList[_]
            
            let effect = elem[0]
            let callback = elem[1]
            let thisObj = elem[2]


            let actorView = effect.actorView
            if (actorView) {
                effect.leaveViewer(actorView)
            }
            effect.deleteObj()

            if(callback){
                callback.call(thisObj)
            }
        }
        this.effectList = []


    }

    ////////////////////////////////////////////////////////////////////////////////////////////////-
    createFrame() {
        let frame = this.mLayoutNode
        UiUtil.setXY(frame, 100, 300)
        UiUtil.setWH(frame, 440, 300)
        frame.setLayer(gui.GuiLayer.Top)

        this.mLayoutNode.touchEnabled = false;
        this.mLayoutNode.touchChildren = false;

    }

    getActorView() {
        let actorView = null
        //for(let i = 1; i <=  this.viewIndex;i++){
        actorView = this.mElemList["actorview" + this.viewIndex + 1]
        //	if(actorView ){
        //		if(actorView.IsVisible() == false ){
        //			break
        //		}else{
        //			actorView = null
        //		}
        //	}
        //}
        this.viewIndex = this.viewIndex + 1

        if (actorView) {
            return actorView
        } else {
            let width = 440, height = 300
            let elemInfo: any = [
                { ["index_type"]: gui.ActorView, ["name"]: "actorview" + this.viewIndex, ["title"]: null, ["font"]: null, ["image"]: null, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["event_name"]: null, ["fun_index"]: null },
            ]
            UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this)
            actorView = this.mElemList["actorview" + this.viewIndex]
        }

        return actorView
    }

    refreshFrame() {
        let list: any = {}
        for (let _ = 0; _ < this.effectIdList.length; _++) {
            let elem = this.effectIdList[_]
            let effectId = elem[0]
            let callback = elem[1]
            let thisObj = elem[2]

            let actorView = this.getActorView()
            actorView.visible = (true)

            let effect = EffectManager.getInstance().createEffect(effectId, false)
            //effect.setShowTimes(1)
            effect.actorView = actorView

            let listener: any = { this_index: this, function_index: this.onEffectFinish }
            effect.addAnimListener(listener)
            effect.enterViewer(actorView)

            JsUtil.arrayInstert(this.effectList, [effect, callback, thisObj])
        }

        this.effectIdList = []
    }

    //////////////////////////////////回调函数////////////////////////////
    onEffectFinish(notify, effect) {
        if (notify == "end") {
            //下一帧执行
            let actorView = effect.actorView
            actorView.visible = (false)

            let destroyEffect = function () {
                let exsit = false
                for(let k in this.effectList){
                    let elem = this.effectList[k]
        
                    let e = elem[0]
                    if(e == effect ){
                        exsit = true
                        if(elem[1] ){
                            elem[1].call(elem[2])
                        }
                        JsUtil.arrayRemove(this.effectList, k)
                        break
                    }
                }
			
                if (exsit == true) {
                    effect.leaveViewer(actorView)
                    effect.deleteObj()
                }
            }

            let flag = true
            for (let i = 1; i <= this.viewIndex; i++) {
                let actorView = this.mElemList["actorview" + i]
                if (actorView && actorView.visible == true) {
                    flag = false
                    break
                }
            }

            if (flag == true) {
                DelayEvecuteFunc(0, this.hideWnd, this)
            } else {
                DelayEvecuteFunc(0, destroyEffect, this)
            }
        }
    }

    onReplay(args) {
        return this.hideWnd()
    }

    ////////////////////////////////////公共接口////////////////////////////////
    showScreenEffect(effectId, callback, thisObj) {
        JsUtil.arrayInstert(this.effectIdList, [effectId, callback, thisObj])

        if (this.isVisible() == true) {
            return this.refreshFrame()
        } else {
            return this.showWnd()
        }
    }
}