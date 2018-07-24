// <reference path=".MessageHandler.ts" />

class MessageDispatcher extends TClass{

	mNetWork:core.NetWork;
	//bEnable:boolean;

	mMsgHandlerList: MessageHandler[];

	initObj(...params:any[]){
		
		this.init();
		this.mMsgHandlerList = [];
	}

	init(){
		//this.bEnable = true;

		this.mNetWork = core.NetSystem.getInstance().createNetWork();
		this.mNetWork.addEventListener(core.NetWork.ConnectEvent, this.onTcpConnect, this);
		this.mNetWork.addEventListener(core.NetWork.CloseEvent, this.onTcpClose, this);
		this.mNetWork.addEventListener(core.NetWork.RecvEvent, this.onTcpRecv, this);
	}

	destory(){
		core.NetSystem.getInstance().closeNetWork(this.mNetWork);

		this.mNetWork.removeEventListener(core.NetWork.ConnectEvent, this.onTcpConnect, this);
		this.mNetWork.removeEventListener(core.NetWork.CloseEvent, this.onTcpClose, this);
		this.mNetWork.removeEventListener(core.NetWork.RecvEvent, this.onTcpRecv, this);
	}


	public connect(ip:string, port:number){
		this.mNetWork.connect(ip, port);
	}

	public disconnect(){
		this.mNetWork.disconnect();	
	}

	public isConnect(){
		return this.mNetWork.isConnect();
	}

	public sendPacket(message:MessageBase){
		// if(!this.bEnable)
		// 	return;
		//没有被初始化
		if(message.messageId == 0){
			TLog.Error("NetWork.sendPacket meesageId ==0");
			return 
		}
		
		if(message.isdump){
			TLog.Debug("[send==>]:%s code:%d", message.classname, message.messageId);
		}
		
		var writer:BinaryStream = this.mNetWork.beginPack();
		writer.writeUnsignedShort(message.messageId);
		message.pack(writer);
		this.mNetWork.endPack();
		
		message.dump();
	}

	public sendPacketCallback(callback:Function, thisObj, userData){
		// if(!this.bEnable)
		// 	return;
		
		var writer:BinaryStream = this.mNetWork.beginPack();
		callback.call(thisObj, writer, userData)
		this.mNetWork.endPack();
	}

	// public setEnable(bEnable:boolean){
	// 	this.bEnable = bEnable;
	// }

	public addMessageHandle(handle:MessageHandler):void{
		//self.mMessageRegister:addMessageHandle(handle)
		var idx = this.mMsgHandlerList.indexOf(handle);
		if(idx == -1)
			this.mMsgHandlerList.push(handle);
	}

	public removeMessageHandle(handle){
		//self.mMessageRegister:removeMessageHandle(handle)
		var idx = this.mMsgHandlerList.indexOf(handle);
		if(idx > -1){
			handle.deleteObj();
			this.mMsgHandlerList.splice(idx, 1);
		}
	}


	public onTcpConnect(event:core.NetConnectEvent){
		var msg = TcpConnectMessage.createObj();
		msg.code = event.code;
		this.mMsgHandlerList.forEach(handle=>{
			handle.onTcpConnect(this, msg);
		});
	}

	public onTcpClose(event:core.NetCloseEvent){
		var msg = TcpCloseMessage.createObj(0);
		msg.code = event.code;

		this.mMsgHandlerList.forEach(handle=>{
			handle.onTcpClose(this, msg);
		});
	}

	public onTcpRecv(event:core.NetRecvEvent){
		var reader = event.reader
		var msg_len = event.msgLen
		
		var code = reader.readUnsignedShort();
		var message:MessageBase = MessageFactory.getInstance().getMessage(code)
		if(message == null ){
			TLog.Error("MessageDispatcher.onTcpRecv message code:%d not exsit", code)
			return
		}

		message.unpack(reader);
		if(message.isdump){
			TLog.Debug("[recv<==]: %s code:%d   msglen:%d", message.classname,code, msg_len)
			message.dump();
		}

		this.dispatchMessage(message);
	}


	public dispatchMessage(message:MessageBase){
		this.mMsgHandlerList.forEach(handle=>{
			if(handle.canAcceptMessage(message.messageId)){
				handle.acceptMessage(this, message);
			}
		});
	}
}