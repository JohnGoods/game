

enum MessageProtocol{

	//布尔
	BOOLEAN,

	//带符号的和不带符号的整型
	INT8,
	INT16,
	INT32,

	UINT8,
	UINT16,
	UINT32,

	//浮点
	FLOAT32,
	FLOAT64,

	//字符串
	STRING
}


class MessageBase extends TClass{
	isdump:boolean;
	messageId:number = 0;

	packProtocolArray:any[];
	unpackProtocolArray:any[];

	fireEvent:boolean;

	public initObj(...params:any[]):void{
		this.messageId = params[0] || 0;
		this.packProtocolArray = [];
		this.unpackProtocolArray = [];
		this.isdump = GAME_DEBUG && IGlobal.config.getBoolean("dumpmsg", true);
		this.fireEvent = false;
	}

	public pack(writer:BinaryStream){
		this.packProtocolArray.forEach( info=>{
			var type:number = info.type;
			var name:string = info.name;

			var value = this[name];
			switch(type){
				case MessageProtocol.BOOLEAN:
				writer.writeBoolean(!!value);
				break;
				case MessageProtocol.INT8:
				writer.writeByte(value);
				break;
				case MessageProtocol.INT16:
				writer.writeShort(value);
				break;
				case MessageProtocol.INT32:
				writer.writeInt(value);
				break;
				case MessageProtocol.UINT8:
				writer.writeByte(value);
				break;
				case MessageProtocol.UINT16:
				writer.writeUnsignedShort(value);
				break;
				case MessageProtocol.UINT32:
				writer.writeUnsignedInt(value);
				break;
				case MessageProtocol.FLOAT32:
				writer.writeFloat(value);
				break;
				case MessageProtocol.FLOAT64:
				writer.writeDouble(value);
				break;
				case MessageProtocol.STRING:
				writer.writeString(value);
				break;
			}

			this[name] = value;
		});

	}

	public unpack(reader:BinaryStream){
		this.unpackProtocolArray.forEach( info=>{
			var type:number = info.type;
			var name:string = info.name;

			var value = this[name];
			switch(type){
				case MessageProtocol.BOOLEAN:
				value = reader.readBoolean();
				break;
				case MessageProtocol.INT8:
				value = reader.readByte();
				break;
				case MessageProtocol.INT16:
				value = reader.readShort();
				break;
				case MessageProtocol.INT32:
				value = reader.readInt();
				break;
				case MessageProtocol.UINT8:
				value = reader.readUnsignedByte();
				break;
				case MessageProtocol.UINT16:
				value = reader.readUnsignedShort();
				break;
				case MessageProtocol.UINT32:
				value = reader.readUnsignedInt();
				break;
				case MessageProtocol.FLOAT32:
				value = reader.readFloat();
				break;
				case MessageProtocol.FLOAT64:
				value = reader.readDouble();
				break;
				case MessageProtocol.STRING:
				value = reader.readUTF();
				break;
			}

			this[name] = value;
		});
	}

	public addWriteProtocol( type:number, name:string ){
		TLog.Assert(name != null, "addWriteProtocol");
		this.packProtocolArray.push({"type":type, "name":name});
	}

	public addReadProtocol( type:number, name:string ){
		TLog.Assert(name != null, "addReadProtocol");
		this.unpackProtocolArray.push({"type":type, "name":name});
	}

	public addResponseMsg(code:number){

	}
	
	public dump(){
		if(GAME_DEBUG && this.isdump){
			this.isdump = undefined;

			TLog.Debug(JsUtil.JsonEncode(this));
			//TLog.Debug(this);

			this.isdump = true;
		}
	}

}

class TcpConnectMessage extends MessageBase{
	code:number;
}


class TcpCloseMessage extends MessageBase{
	code:number;
}




class MessageFactory extends TClass{
	messageList:any;
	initObj(...params:any[]){
		this.messageList = {};
	}

	public addMessage(msg:MessageBase){
		TLog.Assert(msg != null, "addMessage msg != null");

		if(msg == null || msg.messageId == 0){
			TLog.Error("MessageFactory.addMessage message == nill")
			return;
		}
		this.messageList[msg.messageId] = msg
	}

	public getMessage(msgId:number){
		return this.messageList[msgId];
	}
}

function GetMessage(msgId){
	return MessageFactory.getInstance().getMessage(msgId)
}