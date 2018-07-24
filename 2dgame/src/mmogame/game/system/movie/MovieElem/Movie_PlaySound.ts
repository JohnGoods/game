/*
作者:
    lintianfeng
	
创建时间：
   2013.10.26(周六)

意图：
   

公共接口：
   
*/
/*
class Movie_PlaySound extends Movie_Elem {
	music
	loop
	musicType
	volume

	public initObj(...args: any[]): void {
		this.music = args[0].music
		this.loop = args[0].loop
		this.musicType = args[0].musicType || "music"
		this.volume = args[0].volume || 1
		TLog.Debug("Movie_PlaySound.init", this.musicType, type(this.volume))
	}

	onBegin() {

		if (this.musicType == "music") {
			GameSound.getInstance().setMusicVolume(this.volume)
			GameSound.getInstance().playMusic(this.music, this.loop)
		} else {
			GameSound.getInstance().setEffectVolume(this.volume)
			GameSound.getInstance().playEffect(this.music)
		}
		this.finish()
	}

	destory() {
		//TLog.Debug("Movie_PlaySound.destory")
		if (this.musicType == "music") {
			GameSound.getInstance().stopMusic()
			GameSound.getInstance().setMusicVolume(1)
		} else {
			GameSound.getInstance().stopEffect()
			GameSound.getInstance().setEffectVolume(1)
		}
	}

	onFinish() {

	}
}*/