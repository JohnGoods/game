class BridgeHttpAuthWorker extends TClass implements core.IHttpCallback{
	recentGameId:number;
	recentGroupIndex:number;
	target:any;
	callback:Function;
	http_url:string;

    public initObj(...params:any[]):void{
		this.recentGameId = params[0];
		this.recentGroupIndex = params[1];
		this.target = params[2];
		this.callback = params[3];
		this.http_url = IGlobal.sdkHelper.getStringConfigDef("BridgeUrl");
	}   

    public  destory():void{

	}

	send():void{

		var authorInfo = GameAccount.getInstance().getAuthorInfo();
		//var serverId = this.serverinfo.ServerID;
		//var groupIndex = this.serverinfo.groupIndex;
		var serverId = this.recentGameId;
		var groupIndex = this.recentGroupIndex + 1;

		var request_url =  this.http_url + "?serverId=" + serverId + "&groupIndex=" + groupIndex;
		for(var k in authorInfo){
			var v = authorInfo[k];
			request_url = request_url + '&' + k + '=' + v;
		}
		TLog.Debug("request_url", request_url);
							
	    IGlobal.httpClient.send(request_url, this, 0);
	}


	onHttpResponse(url:string, data:any, userData:any){
		var param = JsUtil.JsonDecode(data);
		this.callback.call(this.target, url, param);
	}
	
	onHttpError(url:string, userData:any){
		var param:any = {};
		param.code = -1
		this.callback.call(this.target, url, param);
	}


}