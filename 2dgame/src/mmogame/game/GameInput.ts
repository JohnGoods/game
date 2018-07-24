class GameInput implements map.IMapInputCallback{

	mTouchEvent:GameTouchEvent;
	mbBackgroundTick:boolean;

	public constructor() {
		this.mbBackgroundTick = false
		this.init();
	}


	private startBackgroundTick(){
		let self = this
		let BackgroundDelay = 1000//后台定时器
		self.mbBackgroundTick = true;

		let lastFrame = core.TimeStamp.CurrentFrame
		function _onBackgroundTick(){
			if(self.mbBackgroundTick == false)
				return

			egret.ticker.update()
			window.setTimeout(_onBackgroundTick, BackgroundDelay)
		}

		function _onCheckTick(){
			if(core.TimeStamp.CurrentFrame - lastFrame >= 10)
				return

			_onBackgroundTick()
		}
		window.setTimeout(_onCheckTick, BackgroundDelay)
	}

	private stopBackgroundTick(){
		this.mbBackgroundTick = false
	}

	public init():void{
		IGlobal.mapManager.setInputCallback(this);

		this.mTouchEvent = GameTouchEvent.newObj();
		IGlobal.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageMouseDown, this);
		IGlobal.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageMouseUp, this);
		IGlobal.stage.addEventListener(gui.TouchEvent.TOUCH_SHORT, this.onStageMouseClick, this);

		let textureMangaer:core.TextureManager = core.TextureManager.getInstance()
		IGlobal.gameSdk.addEventListener(SdkFunctionDefine.OnMemeryWarning, this.onMemeryWarning, this)
		textureMangaer.addEventListener(core.TextureEvent.TextureWarnEvent, this.onMemeryWarning, this)
		

		egret.lifecycle.onResume  = ()=> {
			TLog.Debug("app 进入前台");
			IGlobal.resManager.clearErrorRes();
			
			if(egret.Capabilities.isMobile){
				PrecedureManager.getInstance().onEvent(EventDefine.SYSTEM_RESUME, null)
				SDKAnalyzer(SdkEventDefine.ACTIVE_APP, "")

				let curMusic = GameSound.getInstance().getCurMusicName()
				GameSound.getInstance().playMusic(curMusic)

				if(egret.Capabilities.runtimeType == egret.RuntimeType.RUNTIME2)
					egret.ticker.resume(); // 关闭渲染与心跳
			}else{
				this.stopBackgroundTick()
			}
			ConfirmRetryQuickLoginNoConfirm();//尝试自动重连
		}

		egret.lifecycle.onPause = ()=> {
			TLog.Debug("app 进入后台");

			if(egret.Capabilities.isMobile){
				PrecedureManager.getInstance().onEvent(EventDefine.SYSTEM_PAUSE, null)
				GameSound.getInstance().stopMusic()


				if(egret.Capabilities.runtimeType == egret.RuntimeType.RUNTIME2)
					egret.ticker.pause(); // 关闭渲染与心跳
			}else{
				this.startBackgroundTick()
			}

		}

		

	}

	public onMapMouseDownEvent(event:egret.TouchEvent):void{

		PrecedureManager.getInstance().onEvent(EventDefine.SYSTEM_MOUSE_DOWN, event);
		// var point = egret.$TempPoint;
		// IGlobal.mapManager.getCamera().stageXYToMapXY(event.stageX, event.stageY, point) 
		// TLog.Debug("onMapMouseDownEvent x:%d y:%d, localx:%d, localy:%d", event.stageX, event.stageY, point.x, point.y);

		//FireEvent(EventDefine.MAP_MOUSE_DOWN, MapMouseEvent.createObj(event.stageX, event.stageY));
	}

	public	onMapMouseUpEvent(event:egret.TouchEvent):void{
		PrecedureManager.getInstance().onEvent(EventDefine.SYSTEM_MOUSE_UP, event);
		//TLog.Debug("onMapMouseUpEvent x:%d y:%d", event.stageX, event.stageY);
	}

	public onMapMouseMoveEvent(event:egret.TouchEvent):void{
		PrecedureManager.getInstance().onEvent(EventDefine.SYSTEM_MOUSE_MOVE, event);
		//TLog.Debug("onMapMouseMoveEvent x:%d y:%d", event.stageX, event.stageY);
	}



    onStageMouseDown(event:egret.TouchEvent):void{
		if(GAME_DEBUG )
		{
			let target:egret.DisplayObject = event.target;
			let dumpStr = IGlobal.guiManager.getPathFromChild(target)
			if(dumpStr != ""){
				let p = Object.getPrototypeOf(target);
				TLog.Debug("MouseDown type:%s name:%s", p.__class__, dumpStr);
			}
		}
        // let p = Object.getPrototypeOf(target);
       	// TLog.Debug("MouseDown type:%s name:%s", p.__class__, target.name);  
		FireEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.mTouchEvent.init(event))
    }


	onStageMouseUp(event:egret.TouchEvent):void{
		let target:egret.DisplayObject = event.target;
		if(target instanceof eui.Button){
			GameSound.getInstance().playEffect(SystemSound.effect_btnClick)
		}
		FireEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.mTouchEvent.init(event))
	}

	onStageMouseClick(event:egret.TouchEvent):void{
		FireEvent(EventDefine.ROOTWINDOW_MOUSE_CLICK, this.mTouchEvent.init(event))
	}


	onMemeryWarning(args:core.SdkResultEvent|core.TextureEvent){
		TLog.Warn("======onMemeryWarning======")
		IGlobal.spriteMangaer.cleanUpCacheRes()//清理无用的精灵缓存
		core.TextureManager.getInstance().cleanUpCacheTexture()//清理无用的纹理
	}
	
}