class Fight_SetRound extends Fight_BasePower{
	public initObj(...args:any[]):void {
		
	}

	onFinish(){
		FightSystem.getInstance().getShowSystem().setShowRoundMark(this.powerInfo.round)
		
		let func = function() {
			let wnd = WngMrg.getInstance().getWindow("FightFrame")
			if (wnd.isVisible() == true) {
				wnd.showStarAnim()
			}
		}
		DelayEvecuteFunc(0, func, this)
	}
}