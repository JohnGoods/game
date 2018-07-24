
abstract class TweenAction extends BaseAction {
    curTween: egret.Tween;


    abstract getImpTween(): egret.Tween;


    onBegin() {
        this.curTween = this.getImpTween();
        this.curTween.call(this.finish, this);
    }


    onStop() {
        this.curTween.setPaused(true);
        this.curTween = null;
    }
}


//alpha
class AlphaAction extends TweenAction {
    alpha: number;

    public initObj(...args: any[]): void {
        this.alpha = this.Data.alpha || 0
        this.alpha = this.alpha / 255
    }

    getImpTween(): egret.Tween {
        return egret.Tween.get(this.window).to({ alpha: this.alpha }, this.time)
    }
}


////////////////////////////////////////////////////////////////////
//移动
class MoveAction extends TweenAction {
    startX
    startY
    endX
    endY
    moveType
    customCal
    calObj

    curTween: egret.Tween;

    public initObj(...args: any[]): void {
        this.startX = this.Data.startX
        this.startY = this.Data.startY
        this.endX = this.Data.endX
        this.endY = this.Data.endY
        this.moveType = this.Data.moveType || "jump"
        this.customCal = this.Data.customCal || null
        this.calObj = this.Data.calObj
    }


    getImpTween(): egret.Tween {
        return egret.Tween.get(this.window).set({ x: this.startX, y: this.startY }).to({ x: this.endX, y: this.endY }, this.time)
    }

    setStartXY(x, y) {
        this.startX = x
        this.startY = y
    }

    setEndXY(x, y) {
        this.endX = x
        this.endY = y
    }

    setTime(time) {
        this.time = time
    }
}

//旋转
class RotateAction extends TweenAction {
    angle
    speed
    nowAngle
    anchor: boolean

    public initObj(...args: any[]): void {
        this.angle = this.Data.angle
        this.speed = this.Data.speed
        this.nowAngle = 0

        this.anchor = this.Data.anchor
        if (this.anchor == null) {
            this.anchor = true
        }
    }

    onBegin() {
        this.curTween = this.getImpTween();
        this.curTween.call(this.finish, this);
    }


    onStop() {
        
        // this.curTween.setPaused(true);
        // this.curTween = null;
    }

    getImpTween(): egret.Tween {
        return egret.Tween.get(this.window).to({ rotation: this.angle }, this.time);
    }


}


//缩放
class ZoomAction extends TweenAction {
    scale: number
    anchor: boolean;

    public initObj(...args: any[]): void {

        this.scale = this.Data.scale

        this.anchor = this.Data.anchor
        if (this.anchor == null) {
            this.anchor = true
        }
    }


    getImpTween(): egret.Tween {
        return egret.Tween.get(this.window).to({ scaleX: this.scale, scaleY: this.scale, }, this.time);
    }

}


//延时
class TimerAction extends BaseAction {
    timerId: number;
    public initObj(...args: any[]): void {

    }

    onBegin() {
        this.timerId = SetTimer(this.finish, this, this.time)
    }

    onStop() {
        if (this.timerId) {
            KillTimer(this.timerId)
            this.timerId = null
        }

    }
}


//函数回调
class CallAction extends BaseAction {
    public initObj(...args: any[]): void {

    }

    onBegin() {

        let func:Function =  this.Data.fun

        if (func != null) {
            //TLog.Debug("CallAction visible", this.Data.visible, this.window.GetName())
            if (this.Data.target != null) {
                func.call(this.Data.target, this.Data.data)
            } else {
                func.call(this.Data.data)
            }
        }
        this.finish()
    }

    onStop() {
        //ui_util.RemoveController(this.window, this.id)
    }

}