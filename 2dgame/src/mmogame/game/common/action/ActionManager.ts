// TypeScript file


/*
作者:
    lintianfeng
	
创建时间：
   2013.7.12(周五)

意图：
   

公共接口：
	 // Action接口：
	 // run(){
	 // play( delay){	
	 // 必须继承：
	 // onFinish(){
   // onPlay( delay){
   // ActionManager接口：
   // addAction( action){
	 // ActionManager:function stopAction(){
*/
// let MoveType:any = {
// 	["jump"] : gui.eGuiControllerMoveType_Jump,								// 跳动
// 	["inertional"] : gui.eGuiControllerMoveType_Inertional,		// 平滑
// 	["accelerated"] : gui.eGuiControllerMoveType_Accelerated,	// 加速
// 	["slowed"] : gui.eGuiControllerMoveType_Slowed,						// 减速
// 	["custom"] : gui.eGuiControllerMoveType_CustomCal,				// 自定义运行曲线
// }

class BaseAction extends TClass {
    window: egret.DisplayObject;
    time: number;
    Data: any;
    callbackFunc: Function;
    objRef: any;
    running: boolean;

    public initObj(...args: any[]): void {
        this.window = args[0]
        this.time = args[1] || 1000
        this.Data = args[2]
        this.callbackFunc = args[3]
        this.objRef = args[4]
        //this.during = 0

        this.running = false
    }


    run() {
        if (this.running == true) {
            return
        }
        this.running = true

        ActionManager.getInstance().addAction(this)
    }

    stop() {
        if (this.running == false) {
            return false
        }
        this.running = false

        ActionManager.getInstance().removeAction(this)
        return true
    }

    finish() {
        //TLog.Debug("BaseAction.finish", this.classname, os.time(), this.actionindex)
        if (this.stop() == false) {
            return
        }
        if (this.callbackFunc) {
            this.callbackFunc.call(this.objRef, this)
        }
    }

    isRunning() {
        return this.running
    }

    destory() {
        this.stop()
    }
    ////////////////////////////////////////////////////////-
    // 继承
    onBegin() {

    }

    onStop() {

    }


    ////////////////////////////////////////////////////////////////////							
}

class ActionManager extends TClass {

    actionList: BaseAction[]
    public initObj(...args: any[]): void {
        this.actionList = []
    }

    addAction(action) {
        //TLog.Debug("ActionManager.addAction", action.classname, os.time())
        for (let i in this.actionList) {
            let v = this.actionList[i]

            if (v.running == true && v.window == action.window && v.classname == action.classname) {
                // 该窗口在运动着，添加新动作，先停止之前的动作
                this.removeAction(v)
            }
        }

        if (this.isRunAction(action) == false) {
            table_insert(this.actionList, action)
        }

        action.onBegin()
    }

    removeAction(action) {
        //TLog.Debug("ActionManager.removeAction", action.classname)
        // 直接完成
        if (table_remove(this.actionList, action)) {
            action.onStop()
        }

    }

    isRunAction(action) {
        return table_isExist(this.actionList, action)
    }

    //stopAllAction(){
    //	if(this.timerId ){
    //		KillTimer(this.timerId)
    //		this.timerId = null
    //	}
    //	this.actionList = {}
    //}

    //runAction( delay){	
    //	let stopList:any = {}
    //	for(let i = 0; i < this.actionList.length; i++){
    //			let v = this.actionList[i]
    //	
    //		if(v.play(delay) ){
    //			JsUtil.arrayInstert(stopList, v)
    //		}
    //	}
    //	// 移除已完成的动作
    //	for(let i in stopList){
    //			let v = stopList[i]
    //	
    //		this.removeAction(v)
    //	}
    //}

}