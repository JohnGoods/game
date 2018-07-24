/*
作者:
    liuziming

创建时间：
    2014.10.24(星期五) 

意图：
  

公共接口：

*/
/*
class Movie_AddFightPlayer extends Movie_Elem {
	figherListIndex: number;
	public initObj(...args: any[]): void {
		this.figherListIndex = args[0].index || 0
	}

	onBegin() {
		if (FightSystem.getInstance().isFight() == false) {
			return this.finish()
		}

		let [playerList, _] = FightSystem.getInstance().getConfigSystem().getClientFightConfig(this.figherListIndex)
		FightSystem.getInstance().addMovieFighterList(playerList)
		this.finish()
	}

	onTick(delay) {
	}

	destory() {

	}

	onFinish() {

	}
}
*/