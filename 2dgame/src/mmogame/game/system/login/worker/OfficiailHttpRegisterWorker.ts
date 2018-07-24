class OfficiailHttpRegisterWorker extends TClass implements core.IHttpCallback{
	userData:any;
	target:any;
	callback:Function;
	http_url:string;

    public initObj(...params:any[]):void{
		this.userData = params[0];
		this.target = params[1];
		this.callback = params[2];
		this.http_url = IGlobal.sdkHelper.getStringConfigDef("RegisterUrl");
	}   

    public  destory():void{

	}

	send():void{
		var request_url = this.http_url + "?accountId=" + this.userData.ACC
						+ "&password=" + this.userData.PWD;
		TLog.Debug(request_url);

		IGlobal.httpClient.send(request_url, this, 0);
		FireEvent(EventDefine.MSG_WAIT_BEGIN, null);
	}


	onHttpResponse(url:string, data:any, userData:any){
		var param = JsUtil.JsonDecode(data);
		param.accInfo = this.userData;
		this.callback.call(this.target, param);
		FireEvent(EventDefine.MSG_WAIT_END,null)
	}
	
	onHttpError(url:string, userData:any){
		MsgSystem.confirmDialog_YES(Localize_cns("NET_ERROR1"));
		FireEvent(EventDefine.MSG_WAIT_END,null)
	}


}