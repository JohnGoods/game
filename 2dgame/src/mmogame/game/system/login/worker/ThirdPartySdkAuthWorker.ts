//@Author respawn<respawn0503@gmail.com>
//@Created On 2014-7-14 14.32PM(Monday)
//@Brief 第三方SDK验证WORKER
////////////////////////////////////////////////////////////////////////////////
class ThirdPartySdkAuthWorker extends TClass {
    retCallBack:Function;
    Target:any;
    loginType:string;
    ////////////////////////////////////////////////////////////////////////////////
    public initObj(...args: any[]): void {
        this.retCallBack = null //回调
        this.Target = null   //回调target
        this.loginType = args[0] //用户数据
    }

    ////////////////////////////////////////////////////////////////////////////////
    // 设置RET回调
    setRetCallBack(_target, callback) {
        this.retCallBack = callback
        this.Target = _target
    }
    ////////////////////////////////////////////////////////////////////////////////
    // 发送验证请求
    sendAuthRequest() {
        //function callback(code, infoParamList){
        //	//let infoParamList = args.loginInfoParamList
        //	this.retCallBack(this.Target, code, infoParamList)
        //}

        SdkHelper.getInstance().authToSdk(this.loginType, this.retCallBack, this.Target)
    }

}