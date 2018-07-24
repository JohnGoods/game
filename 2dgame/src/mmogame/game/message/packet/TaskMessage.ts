/*
作者:
    yangguiming
	
创建时间：
   2013.6.24(周一)

意图：
   任务消息

公共接口：
   
*/
module MessageLogic{

//////////////////////////////////////////////////////////////////-
//与NPC对话
export class Message_C2G_NPC_TALK extends MessageBase {
	npcId
	taskId
	param
	public initObj(...args: any[]): void {
		this.npcId = 0
		this.taskId = 0
		this.param = 0
		//this.nextNode = 0
	}

	pack(writer) {
		writer.writeUInt(this.npcId)
		//writer.writeUInt(this.taskId)
		writer.writeUInt(this.param)
	}

	unpack(reader) {

	}


}

//与NPC对话(entryId)
export class Message_C2G_NPC_ENTRYID_TALK extends MessageBase {
	entryId
	param
	public initObj(...args: any[]): void {
		this.entryId = 0
		this.param = 0
	}

	pack(writer) {
		writer.writeUInt(this.entryId)
		writer.writeUInt(this.param)
	}

	unpack(reader) {

	}

}

//////////////////////////////////////////////////////////////////-
//接受任务
export class Message_G2C_TASK_ACCEPT extends MessageBase {
	taskInfo: TaskInfo
	public initObj(...args: any[]): void {
		this.taskInfo = null
	}

	pack(writer) {

	}

	unpack(reader) {
		this.taskInfo = TaskInfo.newObj()
		this.taskInfo.read(reader)
	}


}
//////////////////////////////////////////////////////////////////-
//更新任务信息
export class Message_G2C_TASK_INFO extends MessageBase {
	taskInfoList: TaskInfo[]
	public initObj(...args: any[]): void {
		this.taskInfoList = []
		//this.isdump = true
	}

	pack(writer) {

	}

	unpack(reader) {
		this.taskInfoList = []
		let count = reader.readUChar()
		for (let i = 1; i <= count; i++) {
			let taskInfo = TaskInfo.newObj()
			taskInfo.read(reader)
			JsUtil.arrayInstert(this.taskInfoList, taskInfo)
		}
	}


}

//////////////////////////////////////////////////////////////////-
//任务成功
export class Message_G2C_TASK_SUCCEED extends MessageBase {
	taskId: number;
	public initObj(...args: any[]): void {
		this.taskId = 0
	}

	pack(writer) {

	}

	unpack(reader) {
		this.taskId = reader.readUInt()
	}


}
//////////////////////////////////////////////////////////////////-
//任务失败
export class Message_G2C_TASK_FAIL extends MessageBase {
	taskId
	public initObj(...args: any[]): void {
		this.taskId = 0
	}

	pack(writer) {

	}

	unpack(reader) {
		this.taskId = reader.readUInt()
	}


}

//////////////////////////////////////////////////////////////////-
//申请放弃任务
export class Message_C2G_TASK_CANCEL extends MessageBase {
	taskId
	public initObj(...args: any[]): void {
		this.taskId = 0
	}

	pack(writer) {
		writer.writeUInt(this.taskId)
	}

	unpack(reader) {

	}


}
//////////////////////////////////////////////////////////////////-
//放弃任务响应
export class Message_G2C_TASK_CANCEL extends MessageBase {
	taskId
	public initObj(...args: any[]): void {
		this.taskId = 0
	}

	pack(writer) {

	}

	unpack(reader) {
		this.taskId = reader.readUInt()
	}


}

////////////////////////////////////////////////////////////////////////
//完成任务列表（只在登陆是获取一次）
export class Message_G2C_TASK_FINISH_LIST extends MessageBase {
	taskList: number[]

	public initObj(...args: any[]): void {
		this.taskList = []
		//this.fireEvent=true
	}

	pack(writer) {

	}

	unpack(reader) {
		this.taskList = []

		let count = reader.readUInt()
		for (let i = 1; i <= count; i++) {
			let taskId = reader.readUInt()
			if (!table_isExist(this.taskList, taskId)) {
				JsUtil.arrayInstert(this.taskList, taskId)
			}
		}
	}

}

//////////////////////////////////////////////////////////////////-
//上交资源给npc(客户端)
export class Message_C2G_TASK_GIVE_RES extends MessageBase {
	npcId
	taskId
	money
	rmb
	itemList

	public initObj(...args: any[]): void {
		this.npcId = 0
		this.taskId = 0
		this.money = 0
		this.rmb = 0
		this.itemList = {} //{[id]:int, [count] : int}
	}

	pack(writer) {
		writer.writeUInt(this.npcId)
		writer.writeUInt(this.taskId)
		writer.writeUInt(this.money)
		writer.writeUInt(this.rmb)
		writer.writeUShort(this.itemList.length)

		for (let _ in this.itemList) {
			let v = this.itemList[_]

			writer.writeUInt(v.id)
			writer.writeUInt(v.count)
		}
	}

	unpack(reader) {

	}



}

//////////////////////////////////////////////////////////////////-
//提交任务(客户端)
export class Message_C2G_TASK_COMMIT extends MessageBase {
	npcId
	taskId
	public initObj(...args: any[]): void {
		this.npcId = 0
		this.taskId = 0
	}

	pack(writer) {
		writer.writeUInt(this.npcId)
		writer.writeUInt(this.taskId)
	}

	unpack(reader) {

	}


}
//////////////////////////////////////////////////////////////////////
//保存节点(客户端)    
export class Message_C2G_TASK_NODE extends MessageBase {
	npcId
	taskId
	nodeId

	public initObj(...args: any[]): void {
		this.npcId = 0
		this.taskId = 0
		this.nodeId = 0
	}

	pack(writer) {
		writer.writeUInt(this.npcId)
		writer.writeUInt(this.taskId)
		writer.writeUInt(this.nodeId)
	}

	unpack(reader) {

	}

}

//////////////////////////////////////////////////////////////////-
//保存找到npc(客户端)
export class Message_C2G_TASK_NPC extends MessageBase {
	npcId
	taskId
	public initObj(...args: any[]): void {
		this.npcId = 0
		this.taskId = 0
	}

	pack(writer) {
		writer.writeUInt(this.npcId)
		writer.writeUInt(this.taskId)
	}

	unpack(reader) {

	}


}

//////////////////////////////////////////////////////////////////-
//保存找到npc(客户端)
export class Message_C2G_TASK_FIGHT extends MessageBase {
	taskId
	npcId
	public initObj(...args: any[]): void {
		this.npcId = 0
		this.taskId = 0
	}

	pack(writer) {
		writer.writeUInt(this.taskId)
		writer.writeUInt(this.npcId)
	}

	unpack(reader) {

	}


}

//////////////////////////////////////////////////////////////////-
//到达目标点(客户端)
export class Message_C2G_TASK_ARRIVE extends MessageBase {
	taskId
	index
	public initObj(...args: any[]): void {
		this.taskId = 0
		this.index = 0
	}

	pack(writer) {
		writer.writeUInt(this.taskId)
		writer.writeUInt(this.index)
	}

	unpack(reader) {

	}


}

//////////////////////////////////////////////////////////////////-
//NPC请求任务(客户端)
export class Message_C2G_TASK_APPLY extends MessageBase {
	npcId
	taskType
	public initObj(...args: any[]): void {
		this.npcId = 0
		this.taskType = 0
	}

	pack(writer) {
		writer.writeUInt(this.npcId)
		writer.writeUInt(this.taskType)
		//writer.writeUInt(0)
	}

	unpack(reader) {

	}

}

//////////////////////////////////////////////////////////////////-
//NPC请求活动(客户端)
// export class Message_C2G_TASK_APPLY_ACTIVITY extends MessageBase {
// 	npcId
// 	activityType
// 	activityId
// 	public initObj(...args: any[]): void {
// 		this.npcId = 0
// 		this.activityType = 0
// 		this.activityId = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.npcId)
// 		writer.writeUInt(this.activityType)
// 		writer.writeUInt(this.activityId)
// 	}

// 	unpack(reader) {

// 	}


// }

//////////////////////////////////////////////////////////////////-
//上交宠物给npc(客户端)
// export class Message_C2G_TASK_GIVE_PET extends MessageBase {
// 	npcId
// 	taskId
// 	money
// 	petList
// 	public initObj(...args: any[]): void {
// 		this.npcId = 0
// 		this.taskId = 0
// 		this.money = 0
// 		this.petList = {} //{[id]:int}
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.npcId)
// 		writer.writeUInt(this.taskId)
// 		writer.writeUInt(this.money)
// 		writer.writeUShort(this.petList.length)

// 		for (let _ in this.petList) {
// 			let v = this.petList[_]

// 			writer.writeUInt(v.id)
// 		}
// 	}

// 	unpack(reader) {

// 	}


// }

//////////////////////////////////////////////////////////////////-
//物品请求任务(客户端)
// export class Message_C2G_TASK_ITEMAPPLY extends MessageBase {
// 	itemId
// 	public initObj(...args: any[]): void {
// 		this.itemId = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.itemId)
// 	}

// 	unpack(reader) {

// 	}

// }


//////////////////////////////////////////////////////////////////-
//物品保存节点(客户端)
// export class Message_C2G_TASK_ITEMNODE extends MessageBase {
// 	itemId
// 	taskId
// 	nodeId
// 	public initObj(...args: any[]): void {
// 		this.itemId = 0
// 		this.taskId = 0
// 		this.nodeId = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.itemId)
// 		writer.writeUInt(this.taskId)
// 		writer.writeUInt(this.nodeId)
// 	}

// 	unpack(reader) {

// 	}

// }

//////////////////////////////////////////////////////////////////-
//物品提交任务(客户端)
export class Message_C2G_TASK_ITEMCOMMIT extends MessageBase {
	itemId
	taskId
	public initObj(...args: any[]): void {
		this.itemId = 0
		this.taskId = 0
	}

	pack(writer) {
		writer.writeUInt(this.itemId)
		writer.writeUInt(this.taskId)
	}

	unpack(reader) {

	}

}

////////////////////////////////////////////////////////////////////////
//物品提交任务(客户端)
export class Message_C2G_TASK_ACCEPT extends MessageBase {
	npcId
	taskId
	public initObj(...args: any[]): void {
		this.npcId = 0
		this.taskId = 0
	}

	pack(writer) {
		writer.writeUInt(this.npcId)
		writer.writeUInt(this.taskId)
	}

	unpack(reader) {

	}

}

////////////////////////////////////////////////////////////////////////-
//任务战斗失败
// export class Message_G2C_TASK_FIGHT_LOST extends MessageBase {
// 	taskId
// 	npcId
// 	public initObj(...args: any[]): void {
// 		this.taskId = 0
// 		this.npcId = 0
// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {
// 		this.taskId = reader.readUInt()
// 		this.npcId = reader.readUInt()
// 	}

// }

////////////////////////////////////////////////////////////////////////
//任务相关跳地图
export class Message_C2G_TASK_GUIDE_JUMP extends MessageBase {
	mapId
	cellX
	cellY
	public initObj(...args: any[]): void {
		this.mapId = 0
		this.cellX = 0
		this.cellY = 0
	}

	pack(writer) {
		writer.writeUInt(this.mapId)
		writer.writeUInt(this.cellX)
		writer.writeUInt(this.cellY)
	}

	unpack(reader) {

	}


}

////////////////-新手副本 
// export class Message_C2G_NEW_PALYER_TRANSCRIPT extends MessageBase {
// 	npcId
// 	public initObj(...args: any[]): void {
// 		this.npcId = null
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.npcId)
// 	}

// 	unpack(reader) {
// 	}


// }

// ////////////////-泡泡经验////////////////////////
// export class Message_C2G_CLICK_JINGYANPAOPAO extends MessageBase {
// 	npcId
// 	public initObj(...args: any[]): void {
// 		this.npcId = null
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.npcId)
// 	}

// 	unpack(reader) {
// 	}

// }

// //////////////////飞行棋任务////////////////////////////////-
// export class Message_C2G_TASK_FEIXINGQI_ANSWER extends MessageBase {
// 	index
// 	npcEntry
// 	public initObj(...args: any[]): void {
// 		this.index = null
// 		this.npcEntry = null
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.index)
// 		writer.writeUInt(this.npcEntry)
// 	}

// 	unpack(reader) {
// 	}

// }

// //////////////////-整队与NPC对话//////////////////////////////-
// export class Message_C2G_TASK_TEAM_TALK extends MessageBase {
// 	npcId
// 	public initObj(...args: any[]): void {
// 		this.npcId = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.npcId)
// 	}

// 	unpack(reader) {

// 	}
// }

// //////////////////-整队与NPC对话反馈//////////////////////////////-
// export class Message_G2C_TASK_TEAM_TALK extends MessageBase {
// 	npcId
// 	public initObj(...args: any[]): void {
// 		this.npcId = 0
// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {
// 		this.npcId = reader.readUInt()
// 	}

// }

// //////////////////////任务中答题提交////////////////////////////-

// export class Message_C2G_TASK_ANSWER extends MessageBase {
// 	taskId
// 	answer
// 	public initObj(...args: any[]): void {
// 		this.taskId = 0
// 		this.answer = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.taskId)
// 		writer.writeUInt(this.answer)
// 	}

// 	unpack(reader) {

// 	}


// }

// ////////////////////亲密度任务提交选项////////////////////////////
// export class Message_C2G_TASK_PET_OPTION extends MessageBase {
// 	taskId
// 	option
// 	public initObj(...args: any[]): void {
// 		this.taskId = 0
// 		this.option = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.taskId)
// 		writer.writeUInt(this.option)
// 	}

// 	unpack(reader) {
// 	}

// }

// //////////////////-亲密度任务提交金钱/体力/物品//////////////////////////////-
// export class Message_C2G_TASK_GIVE_SOMETHING extends MessageBase {
// 	taskId
// 	public initObj(...args: any[]): void {
// 		this.taskId = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.taskId)
// 	}

// 	unpack(reader) {
// 	}


// }

// //////////////////-亲密度任务选择////////////////////////////////////////
// export class Message_G2C_TASK_PET_OPTION extends MessageBase {
// 	eventStr
// 	eventData
// 	public initObj(...args: any[]): void {
// 		this.eventStr = null
// 		this.eventData = null
// 	}

// 	pack(writer) {
// 	}

// 	unpack(reader) {
// 		this.eventStr = reader.readString()
// 		this.eventData = table_load(reader.readString())
// 	}

// }


// ////////////////-修行任务////////////////////////////////
// export class Message_C2G_TASK_SELECT_OPTION extends MessageBase {
// 	taskId
// 	option
// 	public initObj(...args: any[]): void {
// 		this.taskId = 0
// 		this.option = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.taskId)
// 		writer.writeUInt(this.option)
// 	}

// 	unpack(reader) {
// 	}

// 	//军团任务
// }

// export class Message_C2G_FACTION_TASK_REQUEST extends MessageBase {
// 	public initObj(...args: any[]): void {

// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {

// 	}

// }

// //军团任务
// export class Message_G2C_FACTION_TASK_REQUEST extends MessageBase {
// 	coolDown
// 	cancelDiamond
// 	public initObj(...args: any[]): void {
// 		this.coolDown = 0						//冻结时间
// 		this.cancelDiamond = 0			//取消任务所需晶石
// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {
// 		this.coolDown = reader.readUInt()
// 		this.cancelDiamond = reader.readUInt()
// 	}

// }

// //军团任务NPC战斗
// export class Message_C2G_TASK_FACTION_FIGHT_NPC extends MessageBase {
// 	taskId
// 	public initObj(...args: any[]): void {
// 		this.taskId = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.taskId)
// 	}

// 	unpack(reader) {

// 	}

// }

// //军团任务上交物品
// export class Message_C2G_TASK_FACTION_COMMIT extends MessageBase {
// 	npcId
// 	taskId
// 	money
// 	rmb
// 	itemList
// 	public initObj(...args: any[]): void {
// 		this.npcId = 0
// 		this.taskId = 0
// 		this.money = 0
// 		this.rmb = 0
// 		this.itemList = {} //{[id]:int, [count] : int}
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.npcId)
// 		writer.writeUInt(this.taskId)
// 		writer.writeUInt(this.money)
// 		writer.writeUInt(this.rmb)
// 		writer.writeUShort(this.itemList.length)

// 		for (let _ in this.itemList) {
// 			let v = this.itemList[_]

// 			writer.writeUInt(v.id)
// 			writer.writeUInt(v.count)
// 		}
// 	}

// 	unpack(reader) {

// 	}

// }

// //////////////////////////-军团发布任务////////////////////////
// //军团自选任务列表申请
// export class Message_C2G_FACTION_PUB_POOL extends MessageBase {
// 	public initObj(...args: any[]): void {

// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {

// 	}
// }


// //军团自选任务列表
// export class Message_G2C_FACTION_PUB_POOL extends MessageBase {
// 	taskInfoList
// 	public initObj(...args: any[]): void {
// 		this.taskInfoList = []
// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {
// 		let t = []
// 		let count = reader.readUInt()
// 		for (let i = 1; i <= count; i++) {
// 			let e: any = {}
// 			e.id = reader.readString()				//任务信息ID
// 			e.playerId = reader.readUInt()							//发布者ID
// 			e.playerName = reader.readString()				//发布者名字
// 			e.sTime = reader.readUInt()							//发布时间
// 			e.eTime = reader.readUInt()							//有效时间戳
// 			e.received = reader.readUInt()							//是否已经被领取1表示已领取；0表示未领取

// 			JsUtil.arrayInstert(t, e)
// 		}

// 		this.taskInfoList = t
// 	}

// 	//军团发布任务
// }

// export class Message_C2G_FACTION_PUB_TASK_REQUEST extends MessageBase {
// 	public initObj(...args: any[]): void {

// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {

// 	}

// }

// //军团发布任务
// export class Message_G2C_FACTION_PUB_TASK_REQUEST extends MessageBase {
// 	coolDown
// 	cancelDiamond
// 	public initObj(...args: any[]): void {
// 		this.coolDown = 0						//冻结时间
// 		this.cancelDiamond = 0			//取消任务所需晶石
// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {
// 		this.coolDown = reader.readUInt()
// 		this.cancelDiamond = reader.readUInt()
// 	}

// 	//发布军团任务
// }

// export class Message_C2G_FACTION_PUB_TASK extends MessageBase {
// 	public initObj(...args: any[]): void {

// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {

// 	}

// }

// //军团发布任务（领取）
// export class Message_C2G_TAKE_FACTION_PUB_TASK extends MessageBase {
// 	taskInfoId
// 	public initObj(...args: any[]): void {
// 		this.taskInfoId = ""
// 	}

// 	pack(writer) {
// 		writer.writeString(this.taskInfoId)
// 	}

// 	unpack(reader) {

// 	}

// }

// //申请可发布次数
// export class Message_C2G_FACTION_PUB_TASK_COUNT extends MessageBase {
// 	public initObj(...args: any[]): void {

// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {

// 	}

// }

// //返回可发布次数
// export class Message_G2C_FACTION_PUB_TASK_COUNT extends MessageBase {
// 	chargeCount
// 	leftCount
// 	public initObj(...args: any[]): void {
// 		this.chargeCount = 0							//充值额度
// 		this.leftCount = 0								//总可发布任务次数
// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {
// 		this.chargeCount = reader.readUInt()
// 		this.leftCount = reader.readUInt()
// 	}

// }


	//////////////////////////////////////////////////////////////-
}