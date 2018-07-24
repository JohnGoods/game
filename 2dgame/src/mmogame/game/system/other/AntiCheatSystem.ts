/*
反外挂检测
*/

class AntiCheatSystem extends BaseSystem {

    MOUSE_CHEAT_SCROE:number = 35;
    SPEED_CHEAT_SCROE:number = 25;


    cheatScore:number;
    hitTimsPerSec:number;

    lastServerSecTime:number;
    diffClientSecTime:number;

    public initObj(...args: any[]): void {
     this.onClear()

      RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
      SetTimer(this.onTimerCallback, this, 1000);
      RegisterEvent(EventDefine.GAME_RESUME, this.onGameResume, this)
    }

    destory() {

    }

    prepareResource(workQueue) {

    }

    onClear() {
        this.cheatScore = 0;

        this.lastServerSecTime = -1;
        this.diffClientSecTime = -1;

        //鼠标点击次数每秒
        this.hitTimsPerSec = 0;
    }

    onMouseDown(args: GameTouchEvent){
        // let stageX = args.touchEvent.stageX
		// let stageY = args.touchEvent.stageY
        this.hitTimsPerSec ++;
    }

    private sendReport(reason:string){
        let zoneid = LoginSystem.getInstance().getSelectServerGameID()
        
        let roleid = GetHero().getId()
        
        let sdkurl = IGlobal.sdkHelper.getStringConfigDef("CheatReportUrl", "")
        let qdKey = IGlobal.sdkHelper.getStringConfigDef("QD_Key")
       
        if(sdkurl == "" ){
            TLog.Error("AntiCheatSystem.sendReport url is empty")
            return false
        }
        
        let obj:core.IHttpCallback = {
            onHttpResponse(url:string, data:any, userData:any){
            },
		    onHttpError(url:string, userData:any){
            }
        }
        let url = String.format("%s?zoneid=%s&roleid=%s&actkey=%s&qdkey=%s", sdkurl, zoneid, roleid, reason, qdKey)
        IGlobal.httpClient.send(url, obj, 1)
        return true;
    }

    private addCheatScore(score:number, reason:string){
        if(PrecedureManager.getInstance().getCurrentPrecedureId() != PRECEDURE_GAME)
            return;

        if(this.cheatScore > 100)
            return;
        this.cheatScore += score;
        if(this.cheatScore >= 100){
            if(this.sendReport(reason)){
                GameNetDispatcher.getInstance().disconnect()
                ConfirmRetryLogin(Localize_cns("CHEAT_TXT1"), true, false)
            }
        }
    }


    public checkSpeedCheat(serverTime){
        if(this.lastServerSecTime == -1){
            this.lastServerSecTime = serverTime
            this.diffClientSecTime = 0;
            return;
        }
           
        let diffServerTime = serverTime - this.lastServerSecTime;
        if( Math.ceil(diffServerTime - this.diffClientSecTime ) > 5){
            this.addCheatScore(this.SPEED_CHEAT_SCROE, "speed")
        }

        this.lastServerSecTime = serverTime;
        this.diffClientSecTime = 0;
    }

    private onTimerCallback(dt){
        //console.log("onTimerCallback hitTimsPerSec:", this.hitTimsPerSec)
        if(this.hitTimsPerSec > 15){
             this.addCheatScore(this.MOUSE_CHEAT_SCROE, "mouseHit");
         }
         this.hitTimsPerSec = 0;

         if(this.diffClientSecTime != -1){
             this.diffClientSecTime += (dt/1000);
         }
    }


    private onGameResume(){
        this.onClear();
    }
}