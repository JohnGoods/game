// TypeScript file
//角色信息，第一次进入游戏加载
// export class Message_G2C_HERO_INFO extends MessageBase {
//     info: HeroInfo;

//     public initObj(...params: any[]): void {

//     }

//     public unpack(reader: BinaryStream) {
//         this.info = HeroInfo.createObj();
//         this.info.read(reader);
//     }
// }


module MessageLogic{

export class Message_G2C_RPC_CALL extends MessageBase {
    public initObj(...args: any[]): void {

    }

    pack(writer) {
    }

    unpack(reader) {
        RpcProxy.unpackMessage(reader)
    }
}

export class Message_G2C_RPC_CALL_UPDATE extends MessageBase {
    public initObj(...args: any[]): void {

    }

    pack(writer) {
    }

    unpack(reader) {
        RpcProxy.unpackUpdateMessage(reader)
    }
}


//申请跳地图
export class Message_C2G_MAP_ENTER extends MessageBase {
    index: number;

    public initObj(...params: any[]): void {
        this.addWriteProtocol(MessageProtocol.UINT32, "index");
    }
}

//回应跳地图
export class Message_G2C_MAP_ENTER extends MessageBase {
    mapId: number;
    cellx: number;
    celly: number;

    public initObj(...params: any[]): void {
        this.addReadProtocol(MessageProtocol.UINT32, "mapId");
        this.addReadProtocol(MessageProtocol.UINT16, "cellx");
        this.addReadProtocol(MessageProtocol.UINT16, "celly");
    }


}

//申请移动
export class Message_C2G_MOVE extends MessageBase {
    num: number;
    cellx: number;
    celly: number;

    public initObj(...params: any[]): void {
        this.num = 1;
        this.addWriteProtocol(MessageProtocol.UINT16, "num");
        this.addWriteProtocol(MessageProtocol.UINT16, "cellx");
        this.addWriteProtocol(MessageProtocol.UINT16, "celly");

        this.isdump = false
    }

}

//服务器响应移动
export class Message_G2C_MOVE extends MessageBase {
    id: number;
    type: number;
    cellx: number;
    celly: number;

    public initObj(...params: any[]): void {
        this.addReadProtocol(MessageProtocol.UINT32, "id");
        this.addReadProtocol(MessageProtocol.UINT16, "type");
        this.addReadProtocol(MessageProtocol.UINT16, "cellx");
        this.addReadProtocol(MessageProtocol.UINT16, "celly");
    }
}

//增加角色
// export class Message_G2C_ROLE_ADD extends MessageBase {
//     mapId: number;
//     cellx: number;
//     celly: number;
//     info: PlayerInfo;

//     public initObj(...params: any[]): void {

//     }

//     public unpack(reader: BinaryStream) {
//         //this.info = HeroInfo.createObj();
//         this.mapId = reader.readUShort()
//         this.cellx = reader.readUShort()
//         this.celly = reader.readUShort()

//         this.info = PlayerInfo.createObj();
//         this.info.read(reader)
//     }
// }


// //角色外形变化
// export class Message_G2C_ROLE_CHANGE extends MessageBase {
//     mapId: number;
//     cellx: number;
//     celly: number;
//     info: PlayerInfo;

//     public initObj(...params: any[]): void {

//     }

//     public unpack(reader: BinaryStream) {
//         //this.info = HeroInfo.createObj();
//         this.mapId = reader.readUShort()
//         this.cellx = reader.readUShort()
//         this.celly = reader.readUShort()

//         this.info = PlayerInfo.createObj();
//         this.info.read(reader)
//     }
// }


//对象出现
// export class Message_G2C_OBJECT_ADD extends MessageBase {
//     id: number;
//     Type: number;
//     oType: number;
//     info: NpcInfo;

//     public initObj(...params: any[]): void {

//     }

//     public unpack(reader: BinaryStream) {
//         //this.info = HeroInfo.createObj();
//         this.id = reader.readUInt()
//         this.Type = reader.readUShort()
//         this.oType = reader.readUShort()

//         this.info = NpcInfo.createObj();
//         this.info.read(reader)
//         this.info.id = this.id //记录info的id  
//         //this.info.args = table_load(reader.readString());
//     }
// }



//对象属性更新
// export class Message_G2C_OBJECT_UPDATE extends MessageBase {

//     info: HeroInfo;

//     public initObj(...params: any[]): void {

//     }

//     public unpack(reader: BinaryStream) {
//         //this.info = HeroInfo.createObj();
//         this.info = HeroInfo.newObj();
//         this.info.readUpdate(reader)
//     }
// }


//收到结果码
export class Message_SMSG_RESULT extends MessageBase {
    op: number;
    result: number;
    count: number;
    args: any;

    public initObj(...params: any[]): void {

    }

    public unpack(reader: BinaryStream) {
        this.op = reader.readUShort()// 客户端发出的命令
        this.result = reader.readUShort()// 返回结果
        this.count = reader.readUShort()	// 参数个数
        var args = {} // 参数表
        for (var i = 1; i <= this.count; i++) {
            var dtype = reader.readUShort()	// 参数类型
            var data
            if (dtype == resultDataType.INT) {
                data = reader.readInt()

            } else if (dtype == resultDataType.FLOAT) {
                data = reader.readFloat()

            } else if (dtype == resultDataType.STRING) {
                data = reader.readString()

            } else if (dtype == resultDataType.LINK) {
                data = reader.readString()

            } else if (dtype == resultDataType.UINT) {
                data = reader.readUInt()
                // }else if(dtype == resultDataType.USHORT){
                //     data = reader.readUShort()

                // }else if(dtype == resultDataType.BYTE){
                //     data = reader.readUChar()

            } else {
                TLog.Debug("_________________________________type error")
            }
            args[i] = data
        }
        this.args = args
    }
}


//字符串消息
export class Message_SMSG_RESULT_STRING extends MessageBase {

    info: string;
    type: number;

    public initObj(...params: any[]): void {
        this.addReadProtocol(MessageProtocol.STRING, "info");
        this.addReadProtocol(MessageProtocol.UINT8, "type");
    }


}


//后台踢下线
export class Message_SMSG_RESULT_LOGOUT extends MessageBase {

    plrId: number;
    public initObj(...params: any[]): void {
        this.addReadProtocol(MessageProtocol.UINT32, "plrId");
    }


}


//角色消失
export class Message_G2C_DISAPPEAR extends MessageBase {
    id: number;
    Type: number;
    public initObj(...params: any[]): void {
        this.addReadProtocol(MessageProtocol.UINT32, "id");
        this.addReadProtocol(MessageProtocol.UINT16, "Type");
    }


}





//////////////////////////////////////////////////////////////////-


//战斗重链标志，保证只在战斗重链时才会发送，并且相邻于hero_info之前发送
export class Message_G2C_FIGHT_RECONNECT_NOTICE extends MessageBase {
    public initObj(...args: any[]): void {

    }

    pack(writer) {

    }

    unpack(reader) {

    }


}

//服务器等级
export class Message_G2C_GLOBAL_SERVERLEVEL extends MessageBase {
    server_level
    public initObj(...args: any[]): void {
        this.server_level = 0
    }

    pack(writer) {

    }

    unpack(reader) {
        this.server_level = reader.readUInt()
    }

}

// export class Message_C2G_FIGHT_TEST_PK extends MessageBase {
//     targetId
//     public initObj(...args: any[]): void {
//         this.targetId = 0
//     }

//     pack(writer) {
//         writer.writeUInt(this.targetId)
//     }

//     unpack(reader) {

//     }


// }

// 发起PK
// export class Message_C2G_FIGHT_FPK extends MessageBase {
//     targetId
//     public initObj(...args: any[]): void {
//         this.targetId = 0
//     }

//     pack(writer) {
//         writer.writeUInt(this.targetId)
//     }

//     unpack(reader) {

//     }



// }

// 进入空间  DAILY 代表爬塔
// export class Message_C2G_ROLE_ENTER_SPACE extends MessageBase {
//     actIndex
//     public initObj(...args: any[]): void {
//         this.actIndex = OrdinaryActivityIndex.NULL																				//OrdinaryActivityIndex
//     }

//     pack(writer) {
//         writer.writeUInt(this.actIndex)
//     }

//     unpack(reader) {

//     }

// }

// // 进入空间  DAILY 代表爬塔
// export class Message_G2C_ROLE_ENTER_SPACE extends MessageBase {
//     space
//     public initObj(...args: any[]): void {
//         this.space = null
//     }

//     pack(writer) {

//     }

//     unpack(reader) {
//         this.space = reader.readString()													//"MINE"(航海)
//     }

// }

//离开空间， null标识在生活场景
// export class Message_C2G_ROLE_LEAVE_SPACE extends MessageBase {
//     public initObj(...args: any[]): void {

//     }

//     pack(writer) {

//     }

//     unpack(reader) {

//     }

// }


// //离开空间， null标识在生活场景
// export class Message_G2C_ROLE_LEAVE_SPACE extends MessageBase {
//     public initObj(...args: any[]): void {

//     }

//     pack(writer) {

//     }

//     unpack(reader) {

//     }



// }

// //按钮提示消息
// export class Message_G2C_ROLE_STATUS_CHANGE extends MessageBase {
//     btnTipsList
//     public initObj(...args: any[]): void {
//         this.btnTipsList = null
//         // this.getType = null
//         // this.fireEvent = true
//         this.isdump = true
//     }

//     pack(writer) {

//     }

//     unpack(reader) {
//         //this.getType = reader.readInt()
//         this.btnTipsList = table_load(reader.readString())

//     }

// }

// export class Message_C2G_ROLE_STATUS_CHANGE extends MessageBase {
//     windowIndex
//     public initObj(...args: any[]): void {
//         let windowIndex = null
//     }

//     pack(writer) {
//         writer.writeUInt(this.windowIndex)
//     }

//     unpack(reader) {

//     }
// }

// 系统公告
//export class Message_G2C_CHANNEL_SYSTEM extends MessageBase{
//public initObj(...args:any[]):void {
//	this.content = null
//	this.count = 0
//}
//
//pack( writer){
//   
//}
//
//unpack( reader){
//	this.count = reader.readInt()
//	this.content = reader.readString()
//}
//}




//////////////////////////////////////////////////////////////////-
//冲值
export class Message_C2G_PAY extends MessageBase {
    params
    public initObj(...args: any[]): void {
        this.params = 0

    }

    pack(writer) {
        writer.writeString(this.params)
    }

    unpack(reader) {

    }


}

//冲值 假的
export class Message_C2G_PAY_CHEAT extends MessageBase {
    params
    public initObj(...args: any[]): void {
        this.params = 0

    }

    pack(writer) {
        writer.writeString(this.params)
    }

    unpack(reader) {

    }


}

//冲值
export class Message_G2C_PAY extends MessageBase {

    chargeValue
    gainValue
    rebateValue
    firstRebateValue
    warHornId
    itemId
    payType
    billno
    public initObj(...args: any[]): void {
        //this.chargeValue = 0//冲了多少钱
        //this.gainValue = 0//得了多少晶石
        //this.rebateValue = 0//送了多少晶石
        //this.firstRebateValue = 0//首冲送了多少晶石
        //this.warHornId = 0//得了哪个号角
        //this.itemId = 0//冲值ID
        //this.payType = ""//冲值渠道
        //this.billno = ""//定单号
    }

    pack(writer) {

    }

    unpack(reader) {
        this.chargeValue = reader.readUInt()
        this.gainValue = reader.readUInt()
        this.rebateValue = reader.readUInt()
        this.firstRebateValue = reader.readUInt()
        this.warHornId = reader.readUInt()
        this.itemId = reader.readUInt()
        this.payType = reader.readString()
        this.billno = reader.readString()
    }


}

//分享
// export class Message_C2G_SHARE extends MessageBase {
//     params
//     public initObj(...args: any[]): void {
//         this.params = ""
//     }

//     pack(writer) {
//         writer.writeString(this.params)
//     }

//     unpack(reader) {

//     }


// }

// //分享
// export class Message_G2C_SHARE extends MessageBase {
//     goldValue
//     jinshiValue
//     public initObj(...args: any[]): void {
//         this.goldValue = 0//奖励了多少金币
//         this.jinshiValue = 0//奖励了多少晶石
//     }

//     pack(writer) {

//     }

//     unpack(reader) {
//         reader.readUInt(this.goldValue)
//         reader.readUInt(this.jinshiValue)
//     }


// }


//分享奖励
// export class Message_C2G_PLAT_DAILY_SHARE extends MessageBase {
//     platKey
//     public initObj(...args: any[]): void {
//         this.platKey = null
//     }

//     pack(writer) {
//         //writer.writeUInt(this.platKey)
//         writer.writeString(this.platKey)
//     }

//     unpack(reader) {

//     }



// }

//新手记录
export class Message_G2C_ROLE_NEW_ERRANTRY extends MessageBase {
    recordList
    public initObj(...args: any[]): void {
        this.recordList = {} //新手记录
    }

    pack(writer) {

    }

    unpack(reader) {
        this.recordList = table_load(reader.readString())
    }


}

//////////////////////////////////////////////////////////////////////////////
//查看玩家信息
// export class Message_C2G_ROLE_DETAILED_INFO extends MessageBase {
//     id
//     checkType
//     public initObj(...args: any[]): void {
//         this.id = null
//         this.checkType = null
//         //this.index = null
//     }

//     pack(writer) {
//         writer.writeString(tostring(this.id))
//         //writer.writeUInt(this.index)
//         writer.writeUInt(this.checkType)
//     }

//     unpack(reader) {

//     }
// }


export class Message_G2C_GLOBAL_SERVER_STAR_TIME extends MessageBase {
    startTime
    public initObj(...args: any[]): void {
        this.startTime = 0
    }

    pack(writer) {
    }

    unpack(reader) {
        this.startTime = reader.readUInt()
    }


}

////-禁言禁号//////////////////////////////////-
export class Message_G2C_ROLE_BAN_STATUS extends MessageBase {
    banStatus
    banReason
    banEndTime
    public initObj(...args: any[]): void {
        this.banStatus = 0
        this.banReason = ""
        this.banEndTime = 0
    }

    pack(writer) {
    }

    unpack(reader) {
        this.banStatus = reader.readUShort() ////封禁状态,0为正常，1为禁止登录，2为禁言
        this.banReason = reader.readString()
        this.banEndTime = reader.readUInt()
    }


}

////-踢出跨服//////////////////////////////////-
// export class Message_G2C_GLOBAL_LOGOUT_CENTER extends MessageBase {
//     value
//     public initObj(...args: any[]): void {
//         this.value = 0
//     }

//     pack(writer) {
//     }

//     unpack(reader) {
//         this.value = reader.readUInt()			//值无作用，主要防发不了包
//     }

// }


}