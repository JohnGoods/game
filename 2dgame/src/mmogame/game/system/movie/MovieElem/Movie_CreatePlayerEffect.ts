/*
作者:
    liuziming

创建时间：
    2014.08.27(星期三) 

意图：
  创建角色绑定特效

公共接口：

*/
/*
class Movie_CreatePlayerEffect extends Movie_Elem {
	effectId: number;
	var: string;
	offx: number;
	offy: number;

	id: number;
	bOnce: boolean;

	public initObj(...args: any[]): void {
		this.effectId = args[0].effectId
		this.var = args[0].var
		this.offx = args[0].offx || 0
		this.offy = args[0].offy || 0
		this.id = args[0].id
		this.bOnce = args[0].bOnce || false
	}

	onBegin() {
		if (!this.effectId || !this.id) {
			TLog.Error("Movie_CreatePlayerEffect.onBegin the effectId || id is null!")
			return this.finish()
		}

		MovieSystem.getInstance().createPlayerEffect(this.effectId, this.offx, this.offy, this.id, this.var, this.bOnce)
		this.finish()
	}

	//onTick( delay){
	//	
	//}

	destory() {

	}

	onFinish() {

	}
}
*/