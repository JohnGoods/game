class Fight_MPPower extends Fight_BasePower{
public initObj(...args:any[]):void {
	
}

onFinish(){
	//this.setAutoFinishTime(200)
	
	let point = this.powerInfo.point
	let natrue = "+"
	if(this.effect == powerEffects.EFFECT_MP_LESS ){
		point = -point
		natrue = "-"
	}else if(this.effect == powerEffects.EFFECT_MP_VALUE ){
		let [curPoint, _] = FightSystem.getInstance().getActorSystem().getRoleMp()
		point = curPoint - point
		if(point < 0 ){
			natrue = "-"
		}
	}
	
	FightSystem.getInstance().getActorSystem().changeRoleInfo("mp", this.powerInfo.roleId, point)
}
}