/*
作者:
    lintianfeng
	
创建时间：
   2013.10.28(周一)

意图：
   

公共接口：
   
*/
/*
class Movie_ChangeAction extends Movie_Elem {
	playId: number;
	action: string;
	loop: boolean
	speed: number;

	listener: any;

	public initObj(...args: any[]): void {
		this.playId = args[0].var
		this.action = args[0].action
		this.loop = args[0].loop
		this.speed = args[0].speed || 1
	}

	onTick(delay) {

	}

	destory() {
		let player = ActorManager.getInstance().getPlayer(this.playId)
		if (player) {
			player.changeAction("idle", 1, true)
		}

	}

	onBegin() {
		let player: Player = MovieSystem.getInstance().getPlayer(this.playId)
		if (!player) {
			this.finish()
			return
		}
		//player.clearAnimListener()
		this.listener = { this_index: this, function_index: this.play_status_finish, notify_name: "end" }
		player.addAnimListener(this.listener)
		//if(player.switchToState(characterState.globalState_combat) ){
		//	this.oState = 
		//}
		player.changeAction(this.action, this.speed, this.loop)
		//this.finish()
	}

	onFinish() {
		let player = MovieSystem.getInstance().getPlayer(this.playId)
		if (this.listener && player) {
			player.removeAnimListener(this.listener)
			this.listener = null
			player.changeAction("idle", 1, true)
		}
	}

	play_status_finish(notify, action_id) {
		let player = MovieSystem.getInstance().getPlayer(this.playId)
		if (this.listener && player) {
			player.removeAnimListener(this.listener)
			this.listener = null
			player.changeAction("idle", 1, true)
		}
		this.finish()
	}
}
*/