/*
作者:
    yangguiming
	
创建时间：
   2013.7.03(周三)

意图：
   战斗系统消息包

公共接口：
   
*/

module MessageLogic{

function readFightAdd(reader) {
	let fighter_list: any = []
	let count = reader.readUChar() //战斗成员个数
	for (let i = 1; i <= count; i++) {
		let fighterInfo: any = {}
		fighterInfo.roleId = reader.readUInt()
		fighterInfo.type_id = reader.readUChar()
		fighterInfo.id = reader.readUInt()
		fighterInfo.side = reader.readUChar()
		fighterInfo.pos = reader.readUChar()
		fighterInfo.hp = reader.readUInt()
		fighterInfo.maxHp = reader.readUInt()
		fighterInfo.name = reader.readString()
		fighterInfo.entry = reader.readUInt()
		fighterInfo.sexId = reader.readUChar()
		fighterInfo.image = reader.readUInt()
		fighterInfo.weaponShapeId = reader.readUInt()			//神兵
		fighterInfo.heroTitleId = reader.readUInt()				//player称号
		fighterInfo.heroShapeId = reader.readUInt()				//plyaer皮肤
		fighterInfo.tianxianShapeId = reader.readUInt()			//天仙(player头顶小精灵)
		fighterInfo.rideShapeId = reader.readUInt()				//player坐骑
		fighterInfo.wingShapeId = reader.readUInt()				//翅膀
		fighterInfo.petTLShapeId = reader.readUShort()			//通灵，宠物脚底光圈
		fighterInfo.petSHShapeId = reader.readUInt()			//兽魂，宠物左上小精灵
		fighterInfo.xlFZShapeId = reader.readUShort()			//法阵，仙侣脚底光圈
		fighterInfo.xlXWShapeId = reader.readUShort()			//仙位，仙侣称号
		
		//TLog.Debug("////////////////////////////////////////////////////-")
		JsUtil.arrayInstert(fighter_list, fighterInfo)
	}
	//TLog.Debug_r(fighter_list)
	//io.read()
	return fighter_list
}

function readOneFightResult(reader) {
	let result: any = {}
	result.code = reader.readUChar()
	result.round = reader.readUInt()
	result.powerCount = 0
	result.caster = 100			//默认为100（一般不存在id超过12的fighter，此处是为防漏处理）

	if (result.code == resultOptions.RCODE_POWER) {
		result.powerCount = reader.readUChar()
	} else if (result.code == resultOptions.RCODE_SPELL_HIT) {
		result.spellId = reader.readUInt()
		result.caster = reader.readUChar()
		result.target = reader.readUChar()
		result.targetList = reader.readUInt()
		result.powerCount = reader.readUChar()
	} else if (result.code == resultOptions.RCODE_SPELL_PREPARE) {
		result.spellId = reader.readUInt()
		result.caster = reader.readUChar()
	} else if (result.code == resultOptions.RCODE_SPELL_PREPARE_HIT) {
		result.spellId = reader.readUInt()
		result.caster = reader.readUChar()
		result.target = reader.readUChar()
		result.targetList = reader.readUInt()
		result.powerCount = reader.readUChar()
	} else if (result.code == resultOptions.RCODE_SPELL_INTERVAL) {
		result.spellId = reader.readUInt()
		result.caster = reader.readUChar()
		result.target = reader.readUChar()
		result.targetList = reader.readUInt()
	} else if (result.code == resultOptions.RCODE_SPELL_INTERVAL_HIT) {
		result.spellId = reader.readUInt()
		result.caster = reader.readUChar()
		result.target = reader.readUChar()
		result.targetList = reader.readUInt()
		result.powerCount = reader.readUChar()
	} else if (result.code == resultOptions.RCODE_SPELL_INTERVAL_END) {
		result.spellId = reader.readUInt()
		result.caster = reader.readUChar()
		result.target = reader.readUChar()
		result.targetList = reader.readUInt()
	} else if (result.code == resultOptions.RCODE_ADD_MONSTER) {
		result.caster = reader.readUChar()
		result.powerCount = reader.readUChar()
	} else if (result.code == resultOptions.RCODE_SPELL_SPIRIT_HIT) {
		result.spellId = reader.readUInt()
		result.caster = reader.readUChar()
		result.target = reader.readUChar()
		result.targetList = reader.readUInt()
		result.powerCount = reader.readUChar()
	}

	result.castCount = 1
	result.fightPowers = []

	return result
}

function readOneFightPower(reader, result) {
	let power: any = {}
	power.effect = reader.readUChar()
	if (power.effect == powerEffects.EFFECT_HP_PLUS ||
		power.effect == powerEffects.EFFECT_HP_LESS ||
		power.effect == powerEffects.EFFECT_MAXHP_PLUS ||
		power.effect == powerEffects.EFFECT_MAXHP_LESS ||
		power.effect == powerEffects.EFFECT_RP_PLUS ||
		power.effect == powerEffects.EFFECT_RP_LESS ||
		power.effect == powerEffects.EFFECT_RP_VALUE) {

		power.target = reader.readUChar()
		power.point = reader.readUInt()
		power.flag = reader.readUChar()

	} else if (power.effect == powerEffects.EFFECT_MISS ||
		power.effect == powerEffects.EFFECT_DODGE ||
		power.effect == powerEffects.EFFECT_ATTACKED ||
		power.effect == powerEffects.EFFECT_IMMUNIZE ||
		power.effect == powerEffects.EFFECT_RESIST ||
		power.effect == powerEffects.EFFECT_BREAK ||
		power.effect == powerEffects.EFFECT_ABSORB) {

		power.target = reader.readUChar()

	} else if (power.effect == powerEffects.EFFECT_ADD_BUFF ||
		power.effect == powerEffects.EFFECT_DEL_BUFF ||
		power.effect == powerEffects.EFFECT_UPDATE_BUFF) {

		power.target = reader.readUChar()
		power.buff = reader.readUInt()
		power.life = reader.readUInt()
		power.count = reader.readUChar()

	} else if (power.effect == powerEffects.EFFECT_MOVE) {

		power.target = reader.readUChar()
		power.dir = reader.readUChar()

	} else if (power.effect == powerEffects.EFFECT_STATUS) {

		power.target = reader.readUChar()
		power.status = reader.readUChar()
	} else if (power.effect == powerEffects.EFFECT_DROP_GOLD) {
		power.target = reader.readUChar()
		power.value = reader.readUInt()
	} else if (power.effect == powerEffects.EFFECT_DROP_ITEM) {
		power.target = reader.readUChar()
		power.itemId = reader.readUInt()
		power.quality = reader.readUChar()
	} else if (power.effect == powerEffects.EFFECT_SPIRIT_CD) {
		let side = reader.readUChar()
		power.side = FightSystem.getInstance().transferFightSide(side)
		//power.target	= FightSystem.getInstance().getFunnalId(side)
		power.time = reader.readUInt()
	} else if (power.effect == powerEffects.EFFECT_FIGHTER_ADD
		|| power.effect == powerEffects.EFFECT_RESERVE) {
		power.roleId = reader.readUInt()
		power.type_id = reader.readUChar()
		power.id = reader.readUInt()
		power.side = reader.readUChar()
		power.pos = reader.readUChar()
		power.hp = reader.readUInt()
		power.maxHp = reader.readUInt()
		power.name = reader.readString()
		power.entry = reader.readUInt()
		power.sexId = reader.readUChar()
		power.image = reader.readUInt()
		power.weaponShapeId = reader.readUInt()				//神兵
		power.heroTitleId = reader.readUInt()				//player称号
		power.heroShapeId = reader.readUInt()				//plyaer皮肤
		power.tianxianShapeId = reader.readUInt()			//天仙(player头顶小精灵)
		power.rideShapeId = reader.readUInt()				//player坐骑
		power.wingShapeId = reader.readUInt()				//翅膀
		power.petTLShapeId = reader.readUShort()			//通灵，宠物脚底光圈
		power.petSHShapeId = reader.readUInt()				//兽魂，宠物左上小精灵
		power.xlFZShapeId = reader.readUShort()				//法阵，仙侣脚底光圈
		power.xlXWShapeId = reader.readUShort()				//仙位，仙侣称号
	} else if (power.effect == powerEffects.EFFECT_FIGHTER_DISAPPEAR) {
		power.id = reader.readUChar()
		power.target = power.id
	} else if (power.effect == powerEffects.EFFECT_NOTARGET) {
		power.target = reader.readUChar()
	} else if (power.effect == powerEffects.EFFECT_REBOUND) {
		power.caster = reader.readUChar()
		power.target = reader.readUChar()
		power.buff = reader.readUInt()
	} else if (power.effect == powerEffects.EFFECT_MP_PLUS
		|| power.effect == powerEffects.EFFECT_MP_LESS
		|| power.effect == powerEffects.EFFECT_MP_VALUE) {

		power.roleId = reader.readUInt()
		power.point = reader.readUChar()
		power.flag = reader.readUChar()
	} else if (power.effect == powerEffects.EFFECT_SKILL_CD) {
		power.caster = reader.readUChar()
		power.skillId = reader.readUInt()
		power.cdTime = reader.readUInt()								//从战斗开始算的冻结时间戳
	} else if (power.effect == powerEffects.EFFECT_SET_ROUND) {
		power.round = reader.readUChar()
	}

	if (result.code == resultOptions.RCODE_POWER) {
		power.target = checkNull(power.target , checkNull(power.id , 2))
		result.caster = checkNull(result.caster , 15)
		result.caster = result.caster + Math.pow(2 , (power.target - 1))
	}
	//power.caster = reader.readUChar()
	//power.target = reader.readUChar()
	//power.effect = reader.readUChar()
	//power.status = reader.readUInt()
	//power.point	 = reader.readUInt()
	//power.times	 = reader.readUInt()
	//if(power.effect == powerEffects.EFFECT_ADD_BUFF || power.effect == powerEffects.EFFECT_DEL_BUFF || power.effect == powerEffects.EFFECT_UPDATE_BUFF ){
	//  power.buffLevel = reader.readUInt()
	//  power.buffSpecial = reader.readUInt()
	//}
	//power.paramCount = reader.readUChar()
	////io.read()
	//power.params = {}

	//Log.Out("    power.caster" +power.caster)
	//Log.Out("    power.target" +power.target)
	//Log.Out("    power.effect" +power.effect)
	//Log.Out("    power.status" +power.status)
	//Log.Out("    power.point" +power.point	)
	//Log.Out("    power.times" +power.times	)
	//Log.Out("    power.paramCount" +power.paramCount	)

	//for(let i = 1; i <= power.paramCount;i++){
	//  let param = reader.readUInt()
	//  //Log.Out("       power.params" +i +":" +param	)
	//  JsUtil.arrayInstert(power.params, param)
	//}
	power.times = 1
	return power
}

function readFightResult(reader, video?) {
	//let time = reader.readUInt()
	let count = 0
	// if (video == true) {						//录像的数据比较大，数量用整型保存
	// 	count = reader.readUInt()
	// } else {
		count = reader.readUInt()
	// }

	let fight_result_list = []
	for (let i = 1; i <= count; i++) {
		let result = readOneFightResult(reader)
		//TLog.Debug("fight_result_list result", i, count)
		//TLog.Debug_r(result)
		if (result.powerCount && result.powerCount > 0) {
			for (let j = 1; j <= result.powerCount; j++) {
				let power = readOneFightPower(reader, result)
				if (power.effect == powerEffects.EFFECT_RESULT) {
					let include_result = readOneFightResult(reader)
					if (include_result.powerCount > 0) {
						for (let k = 1; k <= include_result.powerCount; k++) {
							let include_power = readOneFightPower(reader, include_result)
							JsUtil.arrayInstert(include_result.fightPowers, include_power)
						}
					}
					//JsUtil.arrayInstert(power.params, include_result)
					power.result = include_result
				}//} effect == powerEffects.EFFECT_RESULT
				JsUtil.arrayInstert(result.fightPowers, power)
			}
		}
		//result.time = time
		//TLog.Debug("********************")
		JsUtil.arrayInstert(fight_result_list, result)
	}
	//TLog.Debug("////////////////////////////////////receive over////////////////////////////////////////////-")
	// TLog.Debug("fight_result_list")
	// TLog.Debug_r(fight_result_list)
	//io.read()
	return fight_result_list

}



////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////



//战斗开始
export class Message_G2C_FIGHT_BEGIN extends MessageBase {
	fightType
	campainId
	fightSide
	public initObj(...args: any[]): void {
		this.fightType = 0
		this.campainId = 0

		this.fightSide = 0
	}

	pack(writer) {

	}

	unpack(reader) {
		this.fightType = reader.readUInt()
		this.campainId = reader.readUInt()
		this.fightSide = reader.readUInt()
	}

	//玩家MP
}

export class Message_G2C_FIGHT_ESOTERIC_POWER extends MessageBase {
	mp
	public initObj(...args: any[]): void {
		this.mp = 0
	}

	pack(writer) {

	}

	unpack(reader) {
		this.mp = reader.readUChar()
	}


	//增加战斗成员
}

export class Message_G2C_FIGHT_ADD extends MessageBase {
	fighterList: any[]
	public initObj(...args: any[]): void {
		this.fighterList = null
	}

	pack(writer) {

	}

	unpack(reader) {
		//TLog.Debug("Message_G2C_FIGHT_ADD.unpack", size_t(reader))
		this.fighterList = readFightAdd(reader)
	}

	//回合开始
}

// export class Message_G2C_FIGHT_BOUT extends MessageBase {
// 	bout
// 	public initObj(...args: any[]): void {
// 		this.bout = 0
// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {
// 		this.bout = reader.readUShort()
// 	}

// 	//战斗结束
// }

export class Message_G2C_FIGHT_END extends MessageBase {
	public initObj(...args: any[]): void {

	}

	pack(writer) {

	}

	unpack(reader) {

	}


	//回合战斗结果
}

export class Message_G2C_FIGHT_RESULT extends MessageBase {
	resultList: any[]
	video:boolean;
	public initObj(...args: any[]): void {
		this.resultList = null
		this.video = args[1] || false;
		//this.isdump = true
	}

	pack(writer) {

	}

	unpack(reader) {
		this.resultList = readFightResult(reader, this.video)
	}


}
//战斗出手队列
export class Message_G2C_FIGHT_SEQUENCE extends MessageBase {
	list: any[]
	public initObj(...args: any[]): void {
		this.list = []
		this.isdump = false;
	}

	pack(writer) {

	}

	unpack(reader) {
		let list = []
		let count = reader.readUChar()
		for (let i = 1; i <= count; i++) {
			let leftTime = reader.readUInt()
			let fightId = reader.readUChar()

			let t = [fightId, leftTime ]
			JsUtil.arrayInstert(list, t)
		}
		this.list = list
	}



}

//战斗重连
export class Message_G2C_FIGHT_REBEGIN extends MessageBase {
	fightType
	compaignId
	fightSide
	mpPoint

	public initObj(...args: any[]): void {
		this.fightType = 0
		this.compaignId = 0
		this.fightSide = 0
		this.mpPoint = 0					//当前奥义值
	}

	pack(writer) {

	}

	unpack(reader) {
		this.compaignId = 0

		this.fightType = reader.readUInt()
		this.compaignId = reader.readUInt()
		this.fightSide = reader.readUInt()
		this.mpPoint = reader.readUInt()
	}



}

//发送战斗指令
export class Message_C2G_FIGHT_CMD extends MessageBase {
	fightId
	skillType
	public initObj(...args: any[]): void {
		this.fightId = 0
		this.skillType = 0
	}

	pack(writer) {
		writer.writeUInt(this.fightId)
		writer.writeUInt(this.skillType)
	}

	unpack(reader) {

	}


}
//完成所有播放
export class Message_C2G_FIGHT_DRAWDONE extends MessageBase {
	public initObj(...args: any[]): void {
		//this.bout = 0 
	}

	pack(writer) {
		//writer.writeUInt(this.bout)
	}

	unpack(reader) {

	}


	//完成一次结果播放
}

// export class Message_C2G_FIGHT_ESCAPE extends MessageBase {
// 	bout
// 	index
// 	public initObj(...args: any[]): void {
// 		this.bout = 0
// 		this.index = 0
// 	}

// 	pack(writer) {
// 		writer.writeUShort(this.bout)
// 		writer.writeUShort(this.index)
// 	}

// 	unpack(reader) {

// 	}



// }

// export class Message_C2G_ROLE_TEAM_COMBAT extends MessageBase {
// 	fight_id
// 	public initObj(...args: any[]): void {
// 		this.fight_id = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.fight_id)
// 	}

// 	unpack(reader) {

// 	}


// }

// export class Message_G2C_FIGHT_READY extends MessageBase {
// 	id
// 	public initObj(...args: any[]): void {
// 		this.id = 0
// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {
// 		this.id = reader.readUInt()
// 	}


// }
// 申请获取通缉犯列表
// export class Message_C2G_GET_WANTED_LIST extends MessageBase {
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

// export class Message_G2C_GET_WANTED_LIST extends MessageBase {
// 	count
// 	playerList: any[]
// 	public initObj(...args: any[]): void {
// 		this.count = 0
// 		this.playerList = []
// 	}

// 	pack(writer) {

// 	}

// 	unpack(reader) {
// 		this.count = reader.readUInt()
// 		this.playerList = []
// 		for (let i = 1; i <= this.count; i++) {
// 			let player: any = {}
// 			player.id = reader.readUInt()
// 			player.name = reader.readString()
// 			player.power = reader.readUInt()
// 			player.bangpai = reader.readString()
// 			JsUtil.arrayInstert(this.playerList, player)
// 		}
// 	}

// }

// export class Message_C2G_FETCH_WANTED_TOKEN extends MessageBase {
// 	id
// 	public initObj(...args: any[]): void {
// 		this.id = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.id)
// 	}

// 	unpack(reader) {

// 	}


// }

// export class Message_C2G_MAP_NPC_COMBAT extends MessageBase {
// 	id
// 	public initObj(...args: any[]): void {
// 		this.id = 0
// 	}

// 	pack(writer) {
// 		writer.writeUInt(this.id)
// 	}

// 	unpack(reader) {

// 	}

// }

export class Message_C2G_FIGHT_ENTER_CAMPAIGN extends MessageBase {
	index
	public initObj(...args: any[]): void {
		this.index = 0
	}

	pack(writer) {
		writer.writeUInt(this.index)
	}

	unpack(reader) {

	}

}

export class Message_C2G_FIGHT_RESTART extends MessageBase {
	public initObj(...args: any[]): void {

	}

	pack(writer) {

	}

	unpack(reader) {

	}


}
//战斗录像
export class Message_G2C_FIGHT_VIEDO extends MessageBase {
	message_fight_begin
	message_fighter_add
	pageCount
	public initObj(...args: any[]): void {
		this.message_fight_begin = Message_G2C_FIGHT_BEGIN.newObj()
		this.message_fighter_add = Message_G2C_FIGHT_ADD.newObj()
		//this.message_fight_result = Message_G2C_FIGHT_RESULT.newObj()

		this.pageCount = 0
	}

	pack(writer) {

	}

	unpack(reader) {
		TLog.Debug("Message_G2C_FIGHT_VIEDO", size_t(reader))
		this.message_fight_begin.unpack(reader)
		this.message_fighter_add.unpack(reader)
		//this.message_fight_result.unpack(reader, true)

		this.pageCount = reader.readUInt()
	}


}
// 录像分页
export class Message_G2C_FIGHT_VIEDO_PAGE extends MessageBase {
	message_fight_result
	public initObj(...args: any[]): void {
		//this.lastList = 0																									//0 不是最后一条resultList;1 是最后一条resultList
		this.message_fight_result = Message_G2C_FIGHT_RESULT.newObj(0, true)
	}

	pack(writer) {

	}

	unpack(reader) {
		//this.lastList = reader.readUInt()
		this.message_fight_result.unpack(reader, true)
	}

	//////////////////////////////////////////////////////////////////////////////
	//C2G同步战斗时间
}

export class Message_C2G_FIGHT_SYNC_TICKTIME extends MessageBase {
	public initObj(...args: any[]): void {

	}

	pack(writer) {

	}

	unpack(reader) {

	}

}

//////////////////////////////////////////////////////////////////////////////
//G2C同步战斗时间
export class Message_G2C_FIGHT_SYNC_TICKTIME extends MessageBase {
	fightTime
	public initObj(...args: any[]): void {
		this.fightTime = 0
	}

	pack(writer) {

	}

	unpack(reader) {
		this.fightTime = reader.readUInt()
	}


}

//翅膀发招
export class Message_C2G_FIGHT_SPIRIT_SKILL extends MessageBase {
	fightSide
	skillId
	targetList
	public initObj(...args: any[]): void {
		this.fightSide = 0
		this.skillId = 0
		this.targetList = {}
	}

	pack(writer) {
		writer.writeUInt(this.fightSide)
		writer.writeUInt(this.skillId)
		writer.writeString(table_save(this.targetList || {}))
	}

	unpack(reader) {

	}

}

export class Message_G2C_FIGHT_SPIRIT_POINT extends MessageBase {
	skillId
	leftPoint
	cooldownTime
	public initObj(...args: any[]): void {
		this.skillId = 0
		this.leftPoint = 0
		this.cooldownTime = 0				//时间戳，并且是以当前战斗时间为准
	}

	pack(writer) {

	}

	unpack(reader) {
		this.skillId = reader.readUInt()
		this.leftPoint = reader.readUInt()
		this.cooldownTime = reader.readUInt()
	}

}

export class Message_C2G_FIGHT_FAST_END extends MessageBase {
	side
	public initObj(...args: any[]): void {
		this.side = 0
	}

	pack(writer) {

	}

	unpack(reader) {

	}


}
//援助技能
export class Message_C2G_FIGHT_ASSIST_SKILL extends MessageBase {
	side
	skillId
	public initObj(...args: any[]): void {
		this.side = 0
		this.skillId = 0
	}

	pack(writer) {
		writer.writeUInt(this.side)
		writer.writeUInt(this.skillId)
	}

	unpack(reader) {

	}

	//援助技能
}

export class Message_G2C_FIGHT_ASSIST_SKILL extends MessageBase {
	skillList
	commonCD
	public initObj(...args: any[]): void {
		this.skillList = []
		this.commonCD = 0
	}

	pack(writer) {

	}

	unpack(reader) {
		this.skillList = []
		this.commonCD = reader.readUInt()					//时间戳
		let count = reader.readUInt()

		for (let i = 1; i <= count; i++) {
			let t = []
			let skillId = reader.readUInt()
			let cc = reader.readUInt()

			JsUtil.arrayInstert(t, skillId)
			JsUtil.arrayInstert(t, cc)
			JsUtil.arrayInstert(this.skillList, t)
		}
	}


}

//双方总输出统计
export class Message_G2C_FIGHT_DAMAGE extends MessageBase {
	leftDamage
	rightDamage
	public initObj(...args: any[]): void {
		this.leftDamage = 0
		this.rightDamage = 0
	}

	pack(writer) {

	}

	unpack(reader) {
		this.leftDamage = reader.readFloat()
		this.rightDamage = reader.readFloat()
	}
}

}