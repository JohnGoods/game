module MessageLogic{
// export class Message_G2C_FIGHT_ENTER_CAMPAIGN extends MessageBase {
// 	campaignId: number;
// 	public initObj(...args: any[]): void {
// 		this.campaignId = 0
// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {
// 		this.campaignId = reader.readUInt()
// 	}

// }

// export class Message_C2G_FIGHT_CAMPAIGN extends MessageBase {
// 	index: number;
// 	public initObj(...args: any[]): void {
// 		this.index = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.index)
// 	}

// 	unpack(reader) {

// 	}

// 	//设置出战列表
// }

export class Message_C2G_FIGHT_BATTLE_QUEUE extends MessageBase {

	queueType: number;
	queue: any;

	public initObj(...args: any[]): void {
		this.queueType = 0
		this.queue = {}
		this.isdump = false;
	}

	pack(writer) {
		writer.writeUInt(this.queueType)
		writer.writeString(table_save(this.queue))
	}

	unpack(reader) {

	}

	//获取出战列表
}

export class Message_C2G_FIGHT_GET_BATTLE_QUEUE extends MessageBase {
	queueType: number;
	public initObj(...args: any[]): void {
		this.queueType = 0
	}

	pack(writer) {
		writer.writeUInt(this.queueType)
	}

	unpack(reader) {

	}


}

export class Message_G2C_FIGHT_GET_BATTLE_QUEUE extends MessageBase {
	queueType: number;
	queue: any;

	public initObj(...args: any[]): void {
		this.queueType = 0
		this.queue = {}
		this.isdump = false;
	}

	pack(writer) {

	}

	unpack(reader) {
		this.queueType = reader.readUInt()
		this.queue = table_load(reader.readString()) || {}
	}

	//获取关卡战斗奖励
}

export class Message_G2C_FIGHT_WIN extends MessageBase {
	fightType
	commonPrize


	public initObj(...args: any[]): void {
		this.fightType = 0

		//通用解包
		this.commonPrize = {}
	}

	pack(writer) {

	}

	unpack(reader) {
		//清空信息
		this.commonPrize = {}

		//开始解包
		this.fightType = reader.readUInt()
		this.commonPrize = table_load(reader.readString())
	}

	//获取通关记录列表
}

export class Message_G2C_FIGHT_CAMPAIGN_RECORD extends MessageBase {
	finishedCampaignList: any;
	public initObj(...args: any[]): void {
		this.finishedCampaignList = {}
	}

	pack(writer) {

	}

	unpack(reader) {
		this.finishedCampaignList = {}

		let count = reader.readUInt()
		for (let i = 1; i <= count; i++) {
			let campaignId = reader.readUInt()		//关卡ID
			let starLevel = reader.readUChar()			//星级
			let times = reader.readUInt()					//挑战次数

			this.finishedCampaignList[campaignId] = [starLevel, times]
		}
	}

	//获取出战列表
}

export class Message_G2C_FIGHT_LOST extends MessageBase {
	fightType
	commonList
	relicFightInfo
	public initObj(...args: any[]): void {
		this.fightType = 0
		this.commonList = {}
	}

	pack(writer) {

	}

	unpack(reader) {
		this.commonList = {}
		this.fightType = reader.readUInt()
		this.commonList = table_load(reader.readString())
	}


	//剧情表演完毕通知服务器重置fighter血量
}

export class Message_C2G_FIGHT_SYNC_SHOWEND extends MessageBase {
	count
	fighterHPList
	public initObj(...args: any[]): void {
		this.count = 0
		this.fighterHPList = {}
	}

	pack(writer) {
		writer.writeUChar(this.count)
		for (let _ in this.fighterHPList) {
			let v = this.fighterHPList[_]

			writer.writeUInt(v[0])				//fighterId
			writer.writeUInt(v[1])				//当前HP值
		}
	}

	unpack(reader) {

	}


	//关卡扫荡
}

export class Message_C2G_CHAMPION_WEAP extends MessageBase {
	campaignId
	weapCount
	public initObj(...args: any[]): void {
		this.campaignId = null
		this.weapCount = 0
	}

	pack(writer) {
		writer.writeUInt(this.campaignId)
		writer.writeUInt(this.weapCount)
	}

	unpack(reader) {

	}

}

export class Message_G2C_CHAMPION_WEAP extends MessageBase {
	campaignId
	commonList
	fightType
	public initObj(...args: any[]): void {
		this.campaignId = null
	}

	pack(writer) {
		//writer.writeUInt(this.campaignId)	
	}

	unpack(reader) {
		//清空信息
		this.commonList = {}

		//开始解包
		this.fightType = reader.readUInt()

		this.commonList = table_load(reader.readString())

		let list = {}
		for (let _ in this.commonList.itemList) {
			let elem = this.commonList.itemList[_]

			let itemId = elem[0]
			let quality = elem[2]
			let e = list[itemId + "_" + quality] || [itemId, 0]
			e[1] = e[1] + elem[1]
			e[2] = quality

			list[itemId + "_" + quality] = e
		}

		this.commonList.itemList = []
		for (let _ in list) {
			let v = list[_]

			JsUtil.arrayInstert(this.commonList.itemList, v)
		}
	}

	//首次通关
}

export class Message_C2G_EXCITE_SERVER_FIRST_CAMPAIGN extends MessageBase {
	campaignId
	public initObj(...args: any[]): void {
		this.campaignId = 0
	}

	pack(writer) {
		writer.writeUInt(this.campaignId)
	}

	unpack(reader) {

	}

}

export class Message_G2C_EXCITE_SERVER_FIRST_CAMPAIGN extends MessageBase {

	playerId
	playerName
	force
	vocation
	sexId
	icon
	campaignId

	public initObj(...args: any[]): void {
		this.playerId
		this.playerName
		this.force
		this.vocation
		this.sexId
		this.icon
		this.campaignId
	}

	pack(writer) {

	}

	unpack(reader) {
		this.playerId = reader.readUInt()
		this.playerName = reader.readString()
		this.force = reader.readUInt()
		this.vocation = reader.readUInt()
		this.sexId = reader.readUInt()
		this.icon = reader.readString()
		this.campaignId = reader.readUInt()
	}

}

export class Message_G2C_EXCITE_TIPS extends MessageBase {
	awardType
	public initObj(...args: any[]): void {
		this.awardType = ""
	}

	pack(writer) {

	}

	unpack(reader) {
		this.awardType = reader.readString()
	}


}
//返回替补阵容
export class Message_G2C_FIGHT_RESERVE_LINE_UP extends MessageBase {
	arrayType
	altemate
	public initObj(...args: any[]): void {
		this.arrayType = 0
		this.altemate = {}
	}

	pack(writer) {

	}

	unpack(reader) {
		//this.altemate = { 0, 0}
		this.arrayType = reader.readUInt()
		this.altemate = table_load(reader.readString())
	}


}
//设置替补阵容
export class Message_C2G_FIGHT_RESERVE_LINE_UP extends MessageBase {
	arrayType
	altemate
	public initObj(...args: any[]): void {
		this.arrayType = 0
		this.altemate = {}
	}

	pack(writer) {
		writer.writeUInt(this.arrayType)
		writer.writeString(table_save(this.altemate))
	}

	unpack(reader) {

	}

	//查询替补阵容
}

export class Message_C2G_FIGHT_LINE_UP_INFO extends MessageBase {
	arrayType
	public initObj(...args: any[]): void {
		this.arrayType = 0
	}

	pack(writer) {
		writer.writeUInt(this.arrayType)
	}

	unpack(reader) {

	}

	//战斗开始后的替补列表
}

export class Message_G2C_FIGHT_LINE_UP_DATA extends MessageBase {
	altemateList
	public initObj(...args: any[]): void {
		this.altemateList = {}
	}

	pack(writer) {

	}

	unpack(reader) {
		this.altemateList = table_load(reader.readString()) || {}
	}

	//查询战阵信息
}

// export class Message_C2G_WAR_FORMATION_INFO extends MessageBase {

// 	public initObj(...args: any[]): void {
// 	}

// 	pack(writer) {
// 	}

// 	unpack(reader) {
// 	}


// }
// //战阵信息
// export class Message_G2C_WAR_FORMATION_INFO extends MessageBase {
// 	formationInfo
// 	formationUsed
// 	public initObj(...args: any[]): void {
// 		this.formationInfo = {}
// 		this.formationUsed = 0
// 	}

// 	pack(writer) {
// 	}

// 	unpack(reader) {
// 		if (size_t(this.formationInfo) == 0) {
// 			this.formationInfo = {}
// 			let num = reader.readUInt()
// 			if (num > 0 && num < 100) {
// 				for (let i = 1; i <= num; i++) {
// 					let key = reader.readUInt()
// 					let elem: any = {}
// 					elem.level = reader.readUInt()
// 					elem.failedCount = reader.readUInt()
// 					this.formationInfo[key] = elem
// 				}
// 			}
// 		} else {
// 			let newFormationInfo: any = {}
// 			let num = reader.readUInt()
// 			if (num > 0 && num < 100) {
// 				for (let i = 1; i <= num; i++) {
// 					let key = reader.readUInt()
// 					let elem: any = {}
// 					elem.level = reader.readUInt()
// 					elem.failedCount = reader.readUInt()
// 					newFormationInfo[key] = elem
// 				}
// 			}

// 			for (let k in newFormationInfo) {
// 				let v = newFormationInfo[k]

// 				let newLevel = v.level
// 				let oldLevel = this.formationInfo[k] && (this.formationInfo[k].level || 0) || 0
// 				if (oldLevel == 0) {
// 					if (newLevel != 0) {
// 						FireEvent(EventDefine.FORMATION_UNLOCK_SUCCESS, null)
// 						break
// 					}
// 				} else {
// 					if (newLevel != oldLevel) {
// 						FireEvent(EventDefine.FORMATION_UPDATE_SUCCESS, null)
// 						break
// 					}
// 				}
// 			}

// 			this.formationInfo = newFormationInfo
// 		}

// 		this.formationUsed = reader.readUInt()
// 	}


// }
// //升级战阵
// export class Message_C2G_WAR_FORMATION_LEVEL extends MessageBase {
// 	formationType
// 	public initObj(...args: any[]): void {
// 		this.formationType = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.formationType)
// 	}

// 	unpack(reader) {
// 	}

// 	//使用战阵
// }

// export class Message_C2G_WAR_FORMATION_SET extends MessageBase {
// 	formationType
// 	public initObj(...args: any[]): void {
// 		this.formationType = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.formationType)
// 	}

// 	unpack(reader) {
// 	}


// }

//组队关卡
//进入关卡
export class Message_C2G_FIGHT_ENTER_CAMPAIGN_INFO extends MessageBase {

	public initObj(...args: any[]): void {

	}

	pack(writer) {

	}

	unpack(reader) {

	}

	//进入关卡
}

export class Message_G2C_FIGHT_ENTER_CAMPAIGN_INFO extends MessageBase {
	campaignId
	curCampaignId
	public initObj(...args: any[]): void {
		this.campaignId = 0			//队伍可打关卡
		this.curCampaignId = 0	//队伍设置的当前关卡
	}

	pack(writer) {

	}

	unpack(reader) {
		this.campaignId = reader.readUInt()
		this.curCampaignId = reader.readUInt()
	}


}
//设置当前打的关卡(队长操作)
export class Message_C2G_FIGHT_SET_CAMPAIGN extends MessageBase {
	campaignId
	public initObj(...args: any[]): void {
		this.campaignId = 0
	}

	pack(writer) {
		writer.writeUInt(this.campaignId)
	}

	unpack(reader) {

	}

	//个人限时通关
}

export class Message_G2C_EXCITE_LIMIT_CAMPAIGN extends MessageBase {
	campaignIndex
	campaignRemainTime
	campaignDeadLine
	public initObj(...args: any[]): void {
		this.campaignIndex = null
		this.campaignRemainTime = null
	}

	pack(writer) {

	}

	unpack(reader) {
		this.campaignIndex = reader.readUInt()
		this.campaignDeadLine = reader.readUInt() + GetServerTime()						//结束时间戳
	}


}
//全服首通
export class Message_C2G_EXCITE_NOT_SERVER_FIRST_CAMP extends MessageBase {
	public initObj(...args: any[]): void {

	}

	pack(writer) {

	}

	unpack(reader) {

	}


}

//全服首通
export class Message_G2C_EXCITE_NOT_SERVER_FIRST_CAMP extends MessageBase {
	campaignId
	public initObj(...args: any[]): void {
		this.campaignId = 0
	}

	pack(writer) {

	}

	unpack(reader) {
		this.campaignId = reader.readUInt()
	}
}

//功能礼包
// export class Message_C2G_ITEM_CAMPAGIN_GIFT_BUY extends MessageBase {
// 	index
// 	public initObj(...args: any[]): void {
// 		this.index = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.index)
// 	}

// 	unpack(reader) {

// 	}
// }
}