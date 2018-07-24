// TypeScript file

module MessageLogic{
//心跳ping
export class Message_CMSG_PING extends MessageBase{
    index:number;
    temp:number;
    public initObj(...params:any[]):void{
        this.temp = 0;
        this.addWriteProtocol(MessageProtocol.UINT32, "index");
        this.addWriteProtocol(MessageProtocol.UINT32, "temp");
    }
}
//心跳pong
export class Message_SMSG_PONG extends MessageBase{
    ping:number;
    serverTime:number;
    public initObj(...params:any[]):void{
        this.addReadProtocol(MessageProtocol.UINT32, "ping");
        this.addReadProtocol(MessageProtocol.UINT32, "serverTime");
    }
}

//游戏服务器登陆请求（请求后如果成功，就真正进入游戏了）
export class Message_CMSG_LOGIN extends MessageBase{
    hostname:string;
    accountId:string;
    sessionId:string;
    public initObj(...params:any[]):void{
        this.addWriteProtocol(MessageProtocol.STRING, "hostname");
        this.addWriteProtocol(MessageProtocol.STRING, "accountId");
        this.addWriteProtocol(MessageProtocol.STRING, "sessionId");
    }
}

//游戏服务器登陆相应（除了返回这个，同时还会发送角色信息，进入地图信息，AOI信息等等）
export class Message_SMSG_LOGIN extends MessageBase{
    result:string;
    serverTime:string;
    public initObj(...params:any[]):void{
        this.addReadProtocol(MessageProtocol.UINT16, "result");
        this.addReadProtocol(MessageProtocol.UINT32, "serverTime");
    }
}

//用户服务器登陆请求
export class Message_CMSG_LOGIN_USER extends MessageBase{
    hostname:string;
    verify:string;
    username:string;

    password:string;
    accoutId:string;
    token:string;
    public initObj(...params:any[]):void{
        this.addWriteProtocol(MessageProtocol.STRING, "hostname");
        this.addWriteProtocol(MessageProtocol.STRING, "verify");
        this.addWriteProtocol(MessageProtocol.STRING, "username");

        this.addWriteProtocol(MessageProtocol.STRING, "password");
        this.addWriteProtocol(MessageProtocol.STRING, "accoutId");
        this.addWriteProtocol(MessageProtocol.STRING, "token");
    }
}

//用户服务器通知登陆
export class Message_SMSG_LOGIN_USER extends MessageBase{
    result:number;
    accountId:string;
    sessionId:string;
    serverTime:number;
    position:number;
    public initObj(...params:any[]):void{
       
    }

    public unpack(reader:BinaryStream){
        this.result = reader.readUnsignedShort()
        if(this.result == 0){
            //登陆session
            this.accountId = reader.readString();
            this.sessionId = reader.readString();
    
        this.serverTime = reader.readUnsignedInt();
        this.position = reader.readUnsignedInt();
        }
    }

}

//踢出服务器
export class Message_SMSG_LOGOUT extends MessageBase{
    result:number;
    public initObj(...params:any[]):void{
        this.addReadProtocol(MessageProtocol.UINT16, "result");
    }
}

}