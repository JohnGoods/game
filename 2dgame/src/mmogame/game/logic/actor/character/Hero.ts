
class Hero extends Player {

    bAlone: boolean;
    moveable: boolean;
    lastSendMoveTime: number;

    heroLevel: number;

    public initObj(...args: any[]): void {
        this.setMovingNotifyEnable(true)
        this.setTouchEnable(false)

        this.lastSendMoveTime = 0
        this.bAlone = false

        this.heroLevel = 0;
        this.moveable = false
    }

    destory() {

    }


    setAloneMode(bAlone) {
        this.bAlone = bAlone
    }

    isAloneMode() {
        return this.bAlone
    }

    onMoveBegin(args) {
        super.onMoveBegin(args);
        FireEvent(EventDefine.HERO_MOVE_BEGIN, args)
        this.updateMoveMessageByTime()
        //let now = Clock.getInstance().getCurCpuTimeByMilliSeconds()
        //if(now - this.lastSendMoveTime >= 400 ){
        //	this.sendMoveMessage()//发送跑步
        //	this.lastSendMoveTime = now
        //}
        //this.lastSendMoveTime = Clock.getInstance().getCurCpuTimeByMilliSeconds()
    }

    onMoving(args) {
        super.onMoving(args);
        //GameSound.getInstance().playEffect(SystemSound.effect_walk)	

        //PROFILE_START("Hero.onMoving")
        FireEvent(EventDefine.HERO_MOVE, args)
        this.updateMoveMessageByTime()
        //如果是格子改变了的
        //if(args.CellChanged() ){
        //let now = Clock.getInstance().getCurCpuTimeByMilliSeconds()
        //if(now - this.lastSendMoveTime >= 400 ){
        //	this.sendMoveMessage()//发送跑步
        //	this.lastSendMoveTime = now
        //}
        //}

        //PROFILE_STOP("Hero.onMoving")
    }


    onMoveStop(args) {
        //TLog.Debug("Hero.onMoveStop")
        this.sendMoveMessage()//发送跑步
        this.lastSendMoveTime = 0

        super.onMoveStop(args);

        FireEvent(EventDefine.HERO_MOVE_STOP, args)
    }

    updateMoveMessageByTime() {
        let now = GetCurMillSec();
        if (now - this.lastSendMoveTime >= 400) {
            this.sendMoveMessage()//发送跑步
            this.lastSendMoveTime = now
            //TLog.Debug("sendMoveMessage", msg)
        }
    }

    sendMoveMessage() {//发送当前坐标
        //modify:movie
        //let [isMovie, _] = MovieSystem.getInstance().isPlayingMovie()
        let isMovie = false
        if (this.bAlone == false && isMovie == false) {
            let message = GetMessage(opCodes.C2G_MOVE)

            let pos = this.getCellXY();

            message.cellx = pos.x, message.celly = pos.y;
            SendGameMessage(message)
        }
    }


    setLevel(level) {
        this.heroLevel = level
    }

    getLevel() {
        TLog.Debug("getLevel", this.heroLevel)
        return this.heroLevel
    }

    setMoveable(moveable) {
        this.moveable = moveable
    }

    isMoveable() {
        return this.moveable
    }

}