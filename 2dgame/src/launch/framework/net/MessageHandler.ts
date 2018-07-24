class MessageHandler extends TClass{

	mHandles:any;

	public initObj(...params:any[]):void{
		this.mHandles = {};
	}

	public register(messageId, functionRef, objectRef){
		this.mHandles[messageId] = {functionRef:functionRef, objectRef:objectRef};
	}

	public onTcpConnect(dispatch:MessageDispatcher, message:TcpConnectMessage){

	}

	public onTcpClose(dispatch:MessageDispatcher, message:TcpCloseMessage){

	}

	public acceptMessage(dispatch:MessageDispatcher, message:MessageBase){
		var handleInfo = this.mHandles[message.messageId];
		if(handleInfo){
			var functionRef:Function = handleInfo.functionRef;
			var thisObj:any = handleInfo.objectRef;
			functionRef.call(thisObj, dispatch, message);
		}
		if(message.fireEvent){
			FireEvent(EventDefine.GET_MESSAGE, NetMessageEvent.newObj(message))
		}
	}

	public canAcceptMessage(messageId:number):boolean{
		return !!this.mHandles[messageId];
	}


}