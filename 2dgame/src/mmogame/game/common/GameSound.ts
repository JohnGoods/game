class GameSound extends TClass {

	mCurMusicName: string;

	mbEffectStop: boolean;
	mbMusicStop: boolean;

	//子类复写 初始化函数
	public initObj(...params: any[]): void {
		this.mCurMusicName = ""
	}
	//子类复写 析构函数
	protected destory(): void {

	}


	playEffect(name: string) {
		//wp不支持声音
		if(egret.Capabilities.os == "Windows Phone"){
			return
		}

		if (this.getEffectStatus() == false)
			return;

		if (!name) {
			return;
		}
		IGlobal.soundManager.playEffect("data/sound/effect/" + name)
	}

	resetEffect(){
		
	}


	unloadAllEffect() {

	}

	playMusic(name: string, loop?: boolean) {
		//wp不支持声音
		if (!name) {
			return;
		}
		this.mCurMusicName = name;

		if(egret.Capabilities.os == "Windows Phone"){
			return
		}

		if (this.getMusicStatus() == false)
			return;

		IGlobal.soundManager.playMusic("data/sound/music/" + name, loop)
		
	}

	setEffectVolume(vol: number) {

	}

	setMusicVolume(vol: number) {

	}


	stopEffect() {
		//IGlobal.soundManager.stop();
	}

	stopMusic() {
		IGlobal.soundManager.stop();
	}

	getCurMusicName() {
		return this.mCurMusicName;
	}



	getMusicStatus(): boolean {
		return IGlobal.setting.getCommonSetting(UserSetting.TYPE_BOOLEAN, "musicOn", true)
	}

	// 获取音效状态
	getEffectStatus(): boolean {
		return IGlobal.setting.getCommonSetting(UserSetting.TYPE_BOOLEAN, "effectOn", true)
	}

	// 设置音乐状态
	setMusicStatus(bOpen, recordMusic) {
		//if(! recordMusic ){
		IGlobal.setting.setCommonSetting(UserSetting.TYPE_BOOLEAN, "musicOn", bOpen)
		//}	
		// 播放当前音乐
		if (!bOpen) {
			this.stopMusic()
		} else {
			this.playMusic(this.mCurMusicName)
		}
	}

	// 设置音效状态
	setEffectStatus(bOpen, recordMusic) {
		//if (!recordMusic) {
		IGlobal.setting.setCommonSetting(UserSetting.TYPE_BOOLEAN, "effectOn", bOpen)
		//}
		if (!bOpen) {
			this.stopEffect()
		} 
		// else {
		// 	gb.audio.SetEffectState(Core.IAudio.eAudioState_Begin)
		// }
	}
}