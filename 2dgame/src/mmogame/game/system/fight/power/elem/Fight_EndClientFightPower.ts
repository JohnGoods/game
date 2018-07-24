
class Fight_EndClientFightPower extends Fight_BasePower{
	public initObj(...args:any[]):void{

	}


	onFinish(){
		FightSystem.getInstance().endFight()
	}
}