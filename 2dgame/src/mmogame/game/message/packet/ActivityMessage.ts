/*
作者:
    panyuxiong
	
创建时间：
    2014.07.15(星期二) 

意图：
  		处理活动的消息

公共接口：
	
*/
//////////////////////////////////////////////////////////////////////////////////

module MessageLogic{
//-活动BUFF更新
export class Message_G2C_BUFF_UPDATE extends MessageBase {
    buffName
    buffLeftTime
    buffData

    public initObj(...args: any[]): void {
        this.buffName = null
        this.buffLeftTime = null
        this.buffData = null
    }

    pack(writer) {

    }

    unpack(reader) {
        this.buffName = reader.readString()  //buff名称
        this.buffLeftTime = reader.readUInt()			//剩余时间
        this.buffData = table_load(reader.readString())	//buff数据
    }

    //-生活BUFF移除
}

export class Message_G2C_BUFF_REMOVE extends MessageBase {
    buffName
    public initObj(...args: any[]): void {
        this.buffName = null
    }

    pack(writer) {

    }

    unpack(reader) {
        this.buffName = reader.readString()
    }
    //////////////////////////////////////////////////////////////////////////////////
    // 请求排行榜数据（具体活动内的排行也用同一流程）
}

export class Message_C2G_ROLE_RANK extends MessageBase {
    rankType
    index
    public initObj(...args: any[]): void {
        this.rankType = 0
        this.index = 0							//用来分组，默认赋值1
    }

    pack(writer) {
        writer.writeUInt(this.rankType)
        writer.writeUInt(this.index)
    }

    unpack(reader) {

    }


    // 排行榜数据返回
}

export class Message_G2C_ROLE_RANK extends MessageBase {
    ranklist:any[]
    ranktype
    firstAppearData:any;//PlayerAppearInfo
    public initObj(...args: any[]): void {
        this.ranklist = []
        this.ranktype = null
    }

    pack(writer) {

    }

    unpack(reader) {
        this.ranklist = []
        this.ranktype = reader.readUShort()	//排行榜类型
        let num = reader.readUShort()	//玩家数量

        for (let j = 1; j <= num; j++) {
            let rankInfo = table_load(reader.readString()) //玩家排名信息
            JsUtil.arrayInstert(this.ranklist, rankInfo)
        }

        this.firstAppearData = table_load(reader.readString())
    }

    ////////////-刺激点相关//////////////////////////////////////////////////////////-
}

export class Message_C2G_EXCITE_DATA extends MessageBase {
    exciteType
    public initObj(...args: any[]): void {
        this.exciteType = null  // "serverjjc"  "serverTower"  "singlejjc" "singletower"
    }

    pack(writer) {
        writer.writeString(this.exciteType)
        //TLog.Debug("send Message_C2G_EXCITE_DATA",this.exciteType)
    }

    unpack(reader) {

    }

}

export class Message_G2C_EXCITE_DATA extends MessageBase {
    exciteData
    exciteType
    public initObj(...args: any[]): void {
        //this.exciteType = null
        this.exciteData = null
        this.exciteType = null
        this.fireEvent = true
    }

    pack(writer) {

    }

    unpack(reader) {
        this.exciteType = reader.readString()
        this.exciteData = table_load(reader.readString())
    }

    //领取奖励
}

export class Message_C2G_EXCITE_GET_PRIZE extends MessageBase {
    exciteType
    getIndex
    public initObj(...args: any[]): void {
        this.exciteType = null
        this.getIndex = null
    }

    pack(writer) {
        writer.writeString(this.exciteType)
        writer.writeUInt(this.getIndex)
    }

    unpack(reader) {

    }

    //申请活动开启情况
}

// export class Message_C2G_ACTIVITY_TIME_INFO extends MessageBase {
//     actIndexList
//     public initObj(...args: any[]): void {
//         this.actIndexList = {}
//     }

//     pack(writer) {
//         writer.writeString(table_save(this.actIndexList))
//     }

//     unpack(reader) {

//     }

//     //获取活动开启情况
// }

export class Message_G2C_ACTIVITY_TIME_INFO extends MessageBase {
    stateList
    public initObj(...args: any[]): void {
        this.stateList = {}
    }

    pack(writer) {

    }

    unpack(reader) {
        this.stateList = {}
        let list = table_load(reader.readString())
        for (let _ in list) {
            let index = tonumber(list[_])

            this.stateList[index] = true
        }
        //for(let k in list){
        //		let v = list[k]
        //
        //	if(v[2] == 1 ){
        //		this.stateList[v[1*/ = true
        //	}else{
        //		this.stateList[v[1*/ = null
        //	}
        //}
    }
    //////////////////////////////////////////////////////////////////////////////////
    //-充值奖励
}

// export class Message_G2C_RECHARGE_REWARD_INFO extends MessageBase {
//     list
    
//     public initObj(...args: any[]): void {
//         this.list = []
//         //this.count = null
//     }

//     pack(writer) {

//     }

//     unpack(reader) {
//         let count = reader.readUInt()
//         this.list = []
//         for (let i = 1; i <= count; i++) {
//             let list: any = {}
//             list.number = reader.readUInt()
//             list.prize = table_load(reader.readString())
//             this.list.push(list) 
//         }
//         //this.list["recordList"]= table_load(reader.readString())
//         //this.list.time = reader.readUInt()
//     }

//     //////////////////////////////////////////////////////////////////////////////////
//     //-充值奖励
// }

// export class Message_C2G_RECHARGE_REWARD_INFO extends MessageBase {
//     public initObj(...args: any[]): void {

//     }

//     pack(writer) {

//     }

//     unpack(reader) {

//     }

//     //////////////////////////////////////////////////////////////////////////////////////
//     //-VIP礼包领取
// }

// export class Message_C2G_BUY_VIP_GIFTS extends MessageBase {
//     public initObj(...args: any[]): void {

//     }

//     pack(writer) {

//     }

//     unpack(reader) {

//     }

//     //////////////////////////////////////////////////////////////////////////////////
//     //////////////////////////////////////////////////////////////////////////////////
//     //-月卡列表信息
// }

// export class Message_G2C_WAR_HORN_REWARD_INFO extends MessageBase {
//     list:any;
//     public initObj(...args: any[]): void {
//         this.list = {}
//     }

//     pack(writer) {

//     }

//     unpack(reader) {
//         //this.list = table_load(reader.readString())
//         let index = null
//         let time = null
//         this.list = {}
//         this.list.index = reader.readUInt()
//         this.list.time = reader.readUInt()
//         this.list.isget = reader.readUInt()
//     }
//     //////////////////////////////////////////////////////////////////////////////////
//     //////////////////////////////////////////////////////////////////////////////////
//     //-月卡列表信息
// }

// export class Message_C2G_WAR_HORN_REWARD_INFO extends MessageBase {
//     public initObj(...args: any[]): void {

//     }

//     pack(writer) {

//     }

//     unpack(reader) {

//     }
//     //////////////////////////////////////////////////////////////////////////////////
//     //////////////////////////////////////////////////////////////////////////////////
//     //-领取月卡
// }

// export class Message_C2G_GET_WAR_HORN_REWARD extends MessageBase {
//     index
//     public initObj(...args: any[]): void {
//         this.index = null
//     }

//     pack(writer) {
//         writer.writeUInt(this.index)
//     }

//     unpack(reader) {

//     }

//     //////////////////////////////////////////////////////////////////////////////////
//     //签到
// }

// export class Message_G2C_QIANDAO_TIME extends MessageBase {
//     times
//     isget
//     public initObj(...args: any[]): void {
//         this.times = 0
//         this.isget = 0
//     }

//     pack(writer) {

//     }

//     unpack(reader) {
//         this.times = reader.readUInt()
//         this.isget = reader.readUInt()

//     }
//     //////////////////////////////////////////////////////////////////////////////////
//     //////////////////////////////////////////////////////////////////////////////////
//     //领取签到奖励
// }

// export class Message_C2G_QIANDAO_AWARD extends MessageBase {
//     Date1
//     public initObj(...args: any[]): void {
//         this.Date1 = 0
//     }

//     pack(writer) {
//         writer.writeUInt(this.Date1)
//     }

//     unpack(reader) {

//     }

//     //////////////////////////////////////////////////////////////////////////////////

//     //全服服务器事件广播
// }

export class Message_G2C_GLOBAL_SERVER_EVENT extends MessageBase {
    event
    data
    public initObj(...args: any[]): void {
        this.event = 0
        this.data = {}
    }

    pack(writer) {

    }

    unpack(reader) {
        this.event = reader.readUInt()
        this.data = table_load(reader.readString())
    }


    //领取体力
}

// export class Message_C2G_ROLE_GET_POWER extends MessageBase {
//     public initObj(...args: any[]): void {

//     }

//     pack(writer) {

//     }

//     unpack(reader) {

//     }


//     //领取女神
// }

// export class Message_C2G_ROLE_GET_NEW_SUMMON_STONE extends MessageBase {
//     public initObj(...args: any[]): void {

//     }

//     pack(writer) {

//     }

//     unpack(reader) {

//     }

//     //////////////////七日任务//////////////////-
// }

// export class Message_C2G_SEVEN_DAY_PRIZE_INFO extends MessageBase {
//     public initObj(...args: any[]): void {

//     }

//     pack(writer) {

//     }

//     unpack(reader) {

//     }
// }

// export class Message_G2C_SEVEN_DAY_PRIZE_INFO extends MessageBase {
//     prizeInfo:any
//     dailyPrizeInfo
//     public initObj(...args: any[]): void {
//         this.prizeInfo = null
//         this.dailyPrizeInfo = null
//     }

//     pack(writer) {

//     }

//     unpack(reader) {
//         let count = reader.readUInt()
//         this.prizeInfo = {}
//         //有达成进度 但是还没有领取的
//         for (let i = 1; i <= count; i++) {
//             let index = reader.readUInt()
//             let cur = reader.readUInt()//完成进度
//             let target = reader.readUInt()//目标
//             let success = reader.readUChar()//达成
//             let prize = reader.readUChar()//已经领取            
//             //let info = table_load(reader.readString())						//{{0, target, successFlag, prizeFlag}, {0, target, successFlag, prizeFlag}}			1为是；0为否
//             this.prizeInfo[index] = [cur, target, success, prize]
//             //this.prizeInfo.push(info)
//         }
//         //已经完成并领取的 只给一个ID就行
//         let finishCount = reader.readUInt()
//         for (let i = 1; i <= finishCount; i++) {
//             let index = reader.readUInt()
// 		    let entryInfo = GameConfig.SevenDayDetailPrizeConfig[index]
//             this.prizeInfo[index] = [entryInfo.target, entryInfo.target, 1, 1]           
//         }
//         //没有任何达成进度的 通过读配置还原出来
// 		for (let index_ in GameConfig.SevenDayDetailPrizeConfig) {
//             let index = tonumber(index_)
// 			let entryInfo = GameConfig.SevenDayDetailPrizeConfig[index_]
//             if (this.prizeInfo[index] == null){
//                 this.prizeInfo[index] = [0, entryInfo.target, 0, 0]  
//             }
//         }
//         this.dailyPrizeInfo = table_load(reader.readString())     //{[dayIndex1] : 1/0, [dayIndex2] : 1/0}		1表示已领取，0表示不能领取，2表示未领取（客户端检查数量条件不满足时优先看作不能领取）
//     }
// }

// export class Message_C2G_SEVEN_DAY_GET_PRIZE extends MessageBase {
//     getIndex
//     prizeIndex
//     public initObj(...args: any[]): void {
//         this.getIndex = null						//奖励类型(单条奖励类型传0, 天数奖励传1)
//         this.prizeIndex = null					//励索引(单条传任务索引，否则天数)
//     }

//     pack(writer) {
//         writer.writeUInt(this.getIndex)
//         writer.writeUInt(this.prizeIndex)
//     }

//     unpack(reader) {

//     }
// }

// export class Message_G2C_SEVEN_DAY_GET_PRIZE extends MessageBase {
//     public initObj(...args: any[]): void {

//     }

//     pack(writer) {

//     }

//     unpack(reader) {

//     }

//     //////////////////////////////每日任务//////////////////////////////////////
//     //每日任务列表
// }

// export class Message_C2G_OPERATE_INFO_LIST extends MessageBase {
//     public initObj(...args: any[]): void {

//     }

//     pack(writer) {

//     }

//     unpack(reader) {

//     }

//     //每日任务列表
// }

// export class Message_G2C_OPERATE_INFO_LIST extends MessageBase {
//     everyDayInfo:any
//     public initObj(...args: any[]): void {
//         this.everyDayInfo = {}
//     }

//     pack(writer) {

//     }

//     unpack(reader) {
//         this.everyDayInfo = []
//         let count = reader.readUInt()
//         //有达成进度 但是还没有领取的
//         for (let i = 1; i <= count; i++) {
//             let index = reader.readUInt()
//             let cur = reader.readUInt()//完成进度
//             let target = reader.readUInt()//目标
//             let success = reader.readUChar()//达成
//             let prize = reader.readUChar()//已经领取            
//             //let info = table_load(reader.readString())						//{进度, 目标, 完成标志(0未完成/1完成), 领奖标志(0未领取/1领取)} －－有效时间不传
//             this.everyDayInfo[index] = [cur, target, success, prize]
//             //this.prizeInfo.push(info)
//         }
//         //已经完成并领取的 只给一个ID就行
//         let finishCount = reader.readUInt()
//         for (let i = 1; i <= finishCount; i++) {
//             let index = reader.readUInt()
// 		    let entryInfo = GameConfig.StartOperationConfig[index]
//             this.everyDayInfo[index] = [entryInfo.target, entryInfo.target, 1, 1]           
//         }
//         //没有任何达成进度的 通过读配置还原出来
// 		for (let index_ in GameConfig.StartOperationConfig) {
//             let index = tonumber(index_)
// 			let entryInfo = GameConfig.StartOperationConfig[index_]
//             if (this.everyDayInfo[index] == null){
//                 this.everyDayInfo[index] = [0, entryInfo.target, 0, 0]  
//             }
//         }        
//     }

//     //单条信息更新
// }

// export class Message_G2C_OPERATE_INFO_UPDATE extends MessageBase {
//     singalInfo:any
//     singalIndex:any
//     public initObj(...args: any[]): void {
//         this.singalIndex = null
//         this.singalInfo = null
//     }

//     pack(writer) {

//     }

//     unpack(reader) {
//         this.singalIndex = reader.readUInt()
//         let cur = reader.readUInt()//完成进度
//         let target = reader.readUInt()//目标
//         let success = reader.readUChar()//达成
//         let prize = reader.readUChar()//已经领取  

//         this.singalInfo = [cur, target, success, prize]
//     }

//     //领取奖励
// }

// export class Message_C2G_OPERATE_INFO_PRIZE extends MessageBase {
//     index
//     public initObj(...args: any[]): void {
//         this.index = 0
//     }

//     pack(writer) {
//         writer.writeUInt(this.index)
//     }

//     unpack(reader) {

//     }

//     //领取活跃度奖励
// }

// export class Message_C2G_OPERATE_ACTIVE_PRIZE extends MessageBase {
//     index
//     public initObj(...args: any[]): void {
//         this.index = 0
//     }

//     pack(writer) {
//         writer.writeUInt(this.index)
//     }

//     unpack(reader) {

//     }

//     //领取活跃度奖励
// }

// export class Message_G2C_OPERATE_ACTIVE_PRIZE extends MessageBase {
//     public initObj(...args: any[]): void {

//     }

//     pack(writer) {

//     }

//     unpack(reader) {

//     }

//     //兑换码奖励
// }

// export class Message_C2G_PLAT_FORM_CODE extends MessageBase {
//     code
//     public initObj(...args: any[]): void {
//         this.code = null
//     }

//     pack(writer) {
//         writer.writeString(this.code)
//     }

//     unpack(reader) {

//     }


// }
    //////////////////////邀请码start////////////////////////////////////////////-
    //查询奖励信息
// export class Message_C2G_FRIEND_INVITE_CODE_INFO extends MessageBase {
//     public initObj(...args: any[]): void {

//     }

//     pack(writer) {

//     }

//     unpack(reader) {

//     }
// }
// //邀请人数
// export class Message_G2C_FRIEND_INVITE_CODE_INFO extends MessageBase {
//     finishFlag
//     friendsNum
//     myInviteCode
//     public initObj(...args: any[]): void {
//         this.finishFlag = 0
//         this.friendsNum = 0
//         this.myInviteCode = ""
//     }

//     pack(writer) {

//     }

//     unpack(reader) {
//         this.finishFlag = reader.readUInt()
//         this.friendsNum = reader.readUInt()
//         this.myInviteCode = reader.readString()
//     }
// }

//查询奖励信息返回
// export class Message_G2C_INVITE_PRIZE_INFO extends MessageBase {
//     list
//     public initObj(...args: any[]): void {
//         this.list = {}
//     }

//     pack(writer) {

//     }

//     unpack(reader) {
//         let listtemp = table_load(reader.readString())
//         if (Array.isArray(listtemp))
//         {
//             if (listtemp.length == 0){
//                 return;
//             }
//             for (let i = 0; i < listtemp.length; ++i){
//                 this.list[i + 1] = listtemp[i]
//             }
//         }else{
//             this.list = listtemp
//         }
//     }

    
// }
//领取奖励
// export class Message_C2G_GET_INVITE_PRIZE extends MessageBase {
//     prizeIndex
//     public initObj(...args: any[]): void {
//         this.prizeIndex = 0
//     }

//     pack(writer) {
//         writer.writeUInt(this.prizeIndex)
//     }

//     unpack(reader) {

//     }


// }
//填写邀请码
// export class Message_C2G_INVITE_FILL_OUT_CODE extends MessageBase {
//     code
//     public initObj(...args: any[]): void {
//         this.code = ""
//     }

//     pack(writer) {
//         writer.writeString(this.code)
//     }

//     unpack(reader) {

//     }

//     //////////////////////////-邀请码}//////////////////////////////////////////////-
// }


////////////////////////-冲榜////////////////////////
//}

//export class Message_C2G_NEW_SERVER_RANK_INFO extends MessageBase{
//public initObj(...args:any[]):void {
//	
//}
//
//pack( writer){
//	
//}
//
//unpack( reader){
//
//}

export class Message_G2C_NEW_SERVER_RANK_INFO extends MessageBase{
    openTime
public initObj(...args:any[]):void {
	this.openTime = null
}

pack( writer){
	
}

unpack( reader){
   this.openTime = reader.readUInt()
}
////////////////////////-冲榜}////////////////////////


//////////////////////七夕//////////////////////////
}

// export class Message_C2G_FESTIVAL_SINGLEDAY_INFO extends MessageBase{
// public initObj(...args:any[]):void {
	
// }

// pack( writer){
	
// }

// unpack( reader){
   
// }

// }

// export class Message_G2C_FESTIVAL_SINGLEDAY_INFO extends MessageBase{
//     beginTime
//     endTime
//     itemList
// public initObj(...args:any[]):void {
// 	this.beginTime = null
// 	this.endTime = null
// 	this.itemList = null
// }

// pack( writer){
	 
// }

// unpack( reader){
//    this.beginTime = reader.readUInt()
//    this.endTime = reader.readUInt()
//    this.itemList = table_load(reader.readString())
// }

// //////////////////////七夕}//////////////////////-
// }
}