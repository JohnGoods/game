/*
作者:
    lintianfeng
	
创建时间：
   2013.10.28(周一)

意图：
   

公共接口：
   
*/
/*
class Movie_Say extends Movie_Elem {
	playId
	text
	max_time
	time
	public initObj(...args: any[]): void {
		this.playId = args[0].var
		this.text = args[0].text

		this.max_time = args[0].showTime || 3000
		this.time = 0
	}

	onBegin() {
		this.showFrame()
	}

	onTick(delay) {
		this.time = this.time + delay
		if (this.time > this.max_time) {
			this.finish()
		}
	}

	destory() {

	}

	onFinish() {
		let player = MovieSystem.getInstance().getPlayer(this.playId)
		if (!player) {
			return
		}
		player.doCommand(ActorCommand.HideChatBubble, null, null)
	}

	//////////////////////////////////////////////////////
	showFrame() {
		let player = MovieSystem.getInstance().getPlayer(this.playId)
		if (!player) {
			return
		}
		player.doCommand(ActorCommand.AddChatBubble, this.text, null)
	}
}*/