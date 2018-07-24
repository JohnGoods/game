class OfficiailHttpAccountAuthWorker extends TClass implements core.IHttpCallback{
	userData:any;
	target:any;
	callback:Function;
	http_url:string;

    public initObj(...params:any[]):void{
		this.userData = params[0];
		this.target = params[1];
		this.callback = params[2];
		this.http_url = IGlobal.sdkHelper.getStringConfigDef("AuthUrl");
	}   

    public  destory():void{

	}

	send():void{
		let md5_content = "appId=" + this.userData.AppId + 
							"&password=" + this.userData.PassWord +
							"&accountId=" + this.userData.UserName +
							"&clientKey=" + this.userData.ClientId
		//todo:yangguiming
		let md5_string = "11";
		let full_url = this.http_url + "?accountId=" + this.userData.UserName +
										  "&password=" + this.userData.PassWord +
										  "&appId=" + this.userData.AppId + 
										  "&sign=" + md5_string + 
										  "&time=" + GetOSTime()

	    IGlobal.httpClient.send(full_url, this, 0);
	}


	onHttpResponse(url:string, data:any, userData:any){
		var param = JsUtil.JsonDecode(data);
		this.callback.call(this.target, url, param);
	}
	
	onHttpError(url:string, userData:any){
		var param:any = {};
		param.code = -1
		this.callback.call(this.target, url, param);
		FireEvent(EventDefine.MSG_WAIT_END,null);
	}


}