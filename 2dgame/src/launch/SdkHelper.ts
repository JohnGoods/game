// TypeScript file


function SDKAnalyzer(eventId, eventStr) {
    if (eventId == null) {
        TLog.Throw()
    }
    //TLog.Debug("SDKAnalyzer", eventId)
    if (GAME_NORMAL == GAME_MODE) {
        eventStr = eventStr || ""
        TLog.Debug("=========SDKAnalyzer %s %s", eventId, eventStr)
        //Core.IGameSdk.inst.CallAnalytics("name="+eventId+'&body='+eventStr)
    }
}
// class PayEventArgs extends core.EventArgs {
//     code: number;
//     params: string;
// }

class SdkHelper extends TClass {
    //mConfig:core.ConfigFile;

    subscribe:boolean;
    
    autoCallback:Function;
    callbackTarget:any;
    resultEvent: core.SdkResultEvent;


    //initWithJson(json:string){
    //    this.mConfig = new core.ConfigFile;
    //    this.mConfig.initWithJson(json);
    //}

    getStringConfigDef(key: string, def?: string): string {
        return IGlobal.gameSdk.getStringConfigDef(key, def);
        //return this.mConfig.getString(key, def);        
    }

    getBoolConfigDef(key: string, def?: boolean): boolean {
        return IGlobal.gameSdk.getBoolConfigDef(key, def);
        //return this.mConfig.getBoolean(key, def);
    }

    getSdkMode(): number {
        var isOffical = this.getBoolConfigDef("IsOfficialLogin");
        return isOffical ? SdkMode.Officiail : SdkMode.ThirdPartySDK;
    }

    callSdk(strFun: string, param: string) {
        IGlobal.gameSdk.callSdk(strFun, param)
    }

   
    callPay(payParams: string) {
        IGlobal.gameSdk.callPay(payParams);
    }


    authToSdk( loginInfo, callback, target){
        if(this.subscribe != true ){
            IGlobal.gameSdk.addEventListener(core.GameSdk.LoginEvent, this.onAuthReponse, this)
            this.subscribe = true
        }
        //TLog.Debug("SdkHelper.authToSdk", loginType, callback, target, target.classname,  tostring(this))
        //GameSdk.instance.GetSrvListSuccessToSdk(json)
        this.autoCallback = callback
        this.callbackTarget = target
        IGlobal.gameSdk.callLogin(loginInfo)
    }


    

    onAuthReponse( args: core.SdkResultEvent){
        let timerId = null;
        function onAuthRetCallback(delay){
            if(timerId != null ){
                KillTimer(timerId)
                timerId = null
            }
            if(this.autoCallback ){
                this.autoCallback.call(this.callbackTarget, this.resultEvent.code, this.resultEvent.params)
            }	
        }
        this.resultEvent = args
        timerId = SetTimer(onAuthRetCallback, this, 1)
    }


}