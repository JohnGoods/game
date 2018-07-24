
class Fight_HelperPower extends Fight_BasePower{
	public initObj(...args:any[]):void{

	}


	onFinish(){
		if(this.powerInfo.effect == powerEffects.EFFECT_FIGHTER_DISAPPEAR){
			var actor = GetFightActor(this.powerInfo.id)
			if(actor && actor.getProperty("type_id") == objectType.OBJECT_TYPE_ASSIST){
				return FightSystem.getInstance().removeFighter(this.powerInfo.id)
			}
				
			if(actor){
				actor.changeDieState()
			}
			FightSystem.getInstance().getShowSystem().stopShowResult(this.powerInfo.id)
				
			return FightSystem.getInstance().removeFighter(this.powerInfo.id)
		}else{
			var fighterInfo = JsUtil.objectCopy(this.powerInfo)
			delete fighterInfo["effect"]
			delete fighterInfo["times"]
			
			//处理召唤类型
			// var type_id = PetSystem.getInstance().getSummonType(fighterInfo.entry)
			// if(type_id && fighterInfo.type_id != objectType.OBJECT_TYPE_ASSIST){
			// 	fighterInfo.type_id = type_id
			// }
			
			// let flag = table_isExist(objectType, fighterInfo.type_id)
			// if(! flag ){
			// 	fighterInfo.type_id = objectType.OBJECT_TYPE_HELPER
			// }
			
			
			// if(fighterInfo.type_id != objectType.OBJECT_TYPE_ASSIST){
			// 	//fighterInfo.type_id = objectType.OBJECT_TYPE_HELPER
			// 	fighterInfo.host		= this.fightResult.result.caster
			// }
			// fighterInfo.pos			= CreateHelperClientPos()
			
			return FightSystem.getInstance().addFighterList([fighterInfo])
		}
	}
}