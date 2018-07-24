/*
作者:
    liuziming
	
创建时间：
   2014.7.11(周五)

意图：
   表现怒气值变化

公共接口：
   
*/
class Fight_RPPower extends Fight_BasePower{
public initObj(...args:any[]):void {
	
}

onFinish(){
	let point = this.powerInfo.point
	let actor = GetFightActor(this.actorId)
	if(! actor ){
		return
	}
	
	if(this.effect == powerEffects.EFFECT_RP_LESS ){
		point = -point
		//natrue = "-"
	}else if(this.effect == powerEffects.EFFECT_RP_VALUE ){
		let [curPoint, _] = actor.getRP()
		point = curPoint - point
		// if(point < 0 ){
		// 	natrue = "-"
		// }
	}
	
	actor.changeCombatInfo("rp", point)
}

}