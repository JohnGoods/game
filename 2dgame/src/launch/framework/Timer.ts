// TypeScript file

class GameTimer extends TClass {

    mTimerCount = 0;
    mTimerCache = {};
    mTimerCacheAdd = {};
    mTimerCacheRemove = {};

    mTimerIndex = 100;
    _lastTime: number = 0;

    _bLock: boolean = false;

    public setTimer(listener: Function, thisObject: any, delay: number): number {
        var data = { listener: listener, thisObject: thisObject, delay: 0, originDelay: delay };
        if(GAME_DEBUG){
            for(let i in this.mTimerCache){
                if(this.mTimerCacheRemove[i] == null){
                    let v = this.mTimerCache[i];
                    if(v.listener == listener && v.thisObject == thisObject){
                        throw "setTimer timerId exsit!"
                    }
                }
               
            }

            for(let i in this.mTimerCacheAdd){
                if(this.mTimerCacheRemove[i] == null){
                    let v = this.mTimerCacheAdd[i];
                    if(v.listener == listener && v.thisObject == thisObject){
                        throw "setTimer timerId exsit!"
                    }
                }
            }
        }

        this.mTimerCount++;
        if (this.mTimerCount == 1) {
            this._lastTime = egret.getTimer();
            egret.startTick(this.intervalUpdate, this);
        }
        this.mTimerIndex++;

        if (this._bLock) {
            this.mTimerCacheAdd[this.mTimerIndex] = data;
        } else {
            this.mTimerCache[this.mTimerIndex] = data;
        }
        return this.mTimerIndex;
    }

    public killTimer(key: number|string): boolean {
        //key如果是null会造成异常
        if(key == null) 
            return false;

        if (this.mTimerCacheAdd[key]) {
            delete this.mTimerCacheAdd[key];
        }

        if (this._bLock) {
            //加入移除列表
            if (this.mTimerCache[key]) {
                //this.mTimerCacheRemove.push(key);
                this.mTimerCacheRemove[key] = true;
            }
            return;
        }
        //TLog.Assert(this.mTimerCache[key] != null);

        if (this.mTimerCache[key]) {
            this.mTimerCount--;

            delete this.mTimerCache[key];
            if (this.mTimerCount == 0) {
                egret.stopTick(this.intervalUpdate, this);
            }
            return true;
        }
        return false;
    }

    private intervalUpdate(timeStamp: number): boolean {
        var dt: number = timeStamp - this._lastTime;
        this._lastTime = timeStamp;

        //假如列表
        for (let key in this.mTimerCacheAdd) {
            this.mTimerCache[key] = this.mTimerCacheAdd[key];
        }
        this.mTimerCacheAdd = {};


        for (let key in this.mTimerCacheRemove) {
            this.killTimer(key);
        }
        this.mTimerCacheRemove = {};


        this._bLock = true;
        for (let key in this.mTimerCache) {

            //已经被删除了，标志不会再调用
            if(this.mTimerCacheRemove[key]){
                continue;
            }

            var data = this.mTimerCache[key];
                data.delay += dt;
            if (data.delay >= data.originDelay) {
                let _delay = data.delay
                data.delay = 0;
                data.listener.call(data.thisObject, _delay);
            }
        }
        this._bLock = false;

        return false;
    }

    protected destory() {
        // var bLock = this._bLock;
        // this._bLock = true;
        // for (var key in this.mTimerCache) {
        //     var key2: any = key;
        //     this.killTimer(<number>key2);
        // }
        // this._bLock = false;
        // this.intervalUpdate(this._lastTime);
        this.mTimerCount = 0;
        this.mTimerCache = {};
        this.mTimerCacheAdd = {};
        this.mTimerCacheRemove = {};
        egret.stopTick(this.intervalUpdate, this);
    }
}


function SetTimer(listener: Function, thisObject: any, delay: number, runFirst?:boolean): number {
    if(runFirst){
        listener.call(thisObject, 0);
    }
    return GameTimer.getInstance().setTimer(listener, thisObject, delay);
}

function KillTimer(key: number) {
    return GameTimer.getInstance().killTimer(key);
}

function DestoryTimer() {
    GameTimer.destoryInstance();
}


function GetCurMillSec(){
    return core.getCpuTime();
}




//返回系统时间，以秒为单位
function GetOSTime(){
    var d = new Date()
    return Math.floor(d.getTime() / 1000);
}

function GetOSDate(t?:number){
    var d = new Date()
    if(t != null){
        d.setTime(t * 1000); //接受毫秒时间
    }

    let year = d.getFullYear();
    let month = d.getMonth() + 1
    let day = d.getDate(); //日期

    let wday = d.getDay() //javascript(0-6)0是周日，6是周六
    
    
    let hour = d.getHours();
    let min = d.getMinutes();
    let sec = d.getSeconds();

    return {year:year, month:month, day:day, hour:hour, min:min, sec:sec, wday:wday}
}
