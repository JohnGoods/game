
//const PRELOAD_GROUP:string = "preload";;

declare var  g_VersionData;
//declare var  g_isCrossOrgin;
declare var  g_DefaultFontName;

declare var  g_SplashImage; // 闪屏资源
declare var  g_SplashLogo; // 闪屏Logo

//g_SplashImage = "sdk/logo.png"

//g_SplashImage = "sdk/loading.jpg"
//g_SplashLogo = "sdk/fangKuaiWan.png"

declare var  g_isExaming; // 审核标志

class VersionUpdatePrecedure extends BasePrecedure {

	//mThemeLoaded:boolean = false;
	// mPreConfigLoaded:boolean = false;
	//mImageSetLoaded:boolean = false;  
	//private loadingView: LoadingUI;
	//预加载zip
	mPreloadZipList:string[] = [ZipFileListDefine.LoginZip]
	//mFinishZipCount:number = 0;
	

	private initParam(){
		
		if(typeof g_VersionData === 'undefined'){
			g_VersionData = {}
		}

		if(typeof g_DefaultFontName == "undefined"){
			g_DefaultFontName = "Microsoft YaHei";
		}

		g_VersionData.clientVer = checkNull(g_VersionData.clientVer , "1.0.0")
		g_VersionData.clientUpdateUrl = checkNull(g_VersionData.clientUpdateUrl , "")
		g_VersionData.resourceVer = checkNull(g_VersionData.resourceVer , "1.0.0")
		g_VersionData.resourceUpdateUrl = checkNull(g_VersionData.resourceUpdateUrl , "")
		g_VersionData.resReviewUpdateUrl = checkNull(g_VersionData.resReviewUpdateUrl , "")

		IGlobal.guiManager.setDefaultFontName(g_DefaultFontName);
		
		//modify:crossOrigin
		// if(typeof g_isCrossOrgin === 'undefined'){
		// 	g_isCrossOrgin = false;
		// }
	}

	public onActive(lastId):void{
		IGlobal.gameSdk.callSdk(SdkFunctionDefine.RuntimeScriptFinish)

		this.initParam()

		//设置根目录
		IGlobal.resManager.setRootPath("resource/");
		

		if(typeof g_SplashImage == "undefined"){
			this.loadResConfig()
		}else{
			SplashSreenUI.show()

			let timerId = 0;
			let onTimerCallback = function(dt){
				KillTimer(timerId);
				SplashSreenUI.hide();
				this.loadResConfig()
			}
			timerId = SetTimer(onTimerCallback, this, 1000);
		}

		
	}


	public onDeactive(currentId):void{
		
	}

	loadResConfig(){
		let remoteUrl = g_VersionData.resourceUpdateUrl;
		IGlobal.resManager.setRemotePath(remoteUrl);

		LoadingUI.show();
		LoadingUI.setProgress(0,0)

		let thisObj = this;
		let count = 0;
		//加载配置文件
		let t:core.ResItemCallback = {
			onResItemLoad(res:core.ResItem):void{
				count++;

				if(res.getKey() == "launch.json"){
					IGlobal.config.initWithJson(res.getData());
				}else if(res.getKey() == "sdkconfig.json"){
					IGlobal.gameSdk.initSdk(res.getData());
					//IGlobal.sdkHelper.initWithJson(res.getData());
				}

				if(count >= 2){
					//thisObj.mPreConfigLoaded = true;
					thisObj.onResConfigFinish();
				}
			},
			onResItemError(key:string):void{

			}
		}

		IGlobal.resManager.loadResAsynLocal("launch.json", t)
		IGlobal.resManager.loadResAsynLocal("sdkconfig.json", t)
	}


	onResConfigFinish(){
		if(typeof g_isExaming == "undefined"){
			g_isExaming = false;
			let isexaming = IGlobal.gameSdk.getFromCmdLine("isexaming");
			if (isexaming != null && isexaming == "1"){
				g_isExaming = true;
			}
		}
		//初始化配置
	    GAME_MODE = IGlobal.config.getNumber("mode", GAME_NORMAL);
	    GAME_DEBUG = IGlobal.config.getBoolean("debug", true);
		GAME_GUIDE = IGlobal.config.getBoolean("guide", true);
		GAME_FRCORD = IGlobal.config.getBoolean("frecord", false);

		//label_version
		let appVer = IGlobal.gameSdk.getFromCmdLine("appVer")
        let resVer =  IGlobal.gameSdk.getFromCmdLine("resVer")
		if (appVer != null)
			g_VersionData.clientVer = appVer;
		if (resVer != null)
			g_VersionData.resourceVer = resVer;
		this.initReport();


		//加载zip
		let self = this;
		let finishZipCount = 0;
		let zipCallback: core.ZipItemCallback = {
			onZipItemLoad(key: any, result: number): void{
				if(result == 0 || GAME_DEBUG)
					finishZipCount ++;

				if(finishZipCount >= self.mPreloadZipList.length){
					self.onResZipFinish();
				}
			}
		}
		
		for(let v of this.mPreloadZipList){
			IGlobal.resManager.addZipPacket(v, zipCallback, true)
		}
	}

	onResZipFinish(){
		IGlobal.guiManager.loadTheme("ui/ui_theme.thm.json", (name:string)=>{
				// if(this.mThemeLoaded == false){
				// 	this.mThemeLoaded = true;
					this.onPreloadFinish();
				//}
			}, this);
	}


	initReport(){
		let bReport = (GAME_MODE == GAME_NORMAL) && !GAME_DEBUG
		if(bReport == false)
			return;

		let url = IGlobal.sdkHelper.getStringConfigDef("ReportUrl", "")
		if(url == "" || url == "ReportUrl" ){//openxlive的sdk写错了，如果找不到就返回key
			TLog.Error("game.initReport url==null")
			return
		}
		
		let qdKey 	= IGlobal.sdkHelper.getStringConfigDef("QD_Key", "")
		//let luaVersion = GetCacheResVer()
		let luaVersion = checkNull(g_VersionData.resourceVer, "1.0.0")
		
		TLog.Debug("game.initReport %s version:%s", url, luaVersion)
		
		IGlobal.errorReport.setReportEnable(bReport)
		IGlobal.errorReport.setReportUrl(url)
		IGlobal.errorReport.addUserParam("qdKey", qdKey)
		IGlobal.errorReport.addUserParam("luaVersion", luaVersion)

		// if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
		// 	IGlobal.errorReport.addUserParam("pf", "web")
		// }else{
		// 	IGlobal.errorReport.addUserParam("pf", "native")
		// }
		IGlobal.errorReport.addUserParam("pf", egret.Capabilities.runtimeType + "_" + egret.Capabilities.os)
	}

	public onPreloadFinish():void{
		// if(!this.mThemeLoaded || !this.mPreConfigLoaded){
		// 	return;
		// }
		
		
		IGlobal.resManager.setSearchZipFirst( IGlobal.config.getBoolean("seachPkgFirst", true) )
		

		//如果非打包时候，才搜索语言
		if(IGlobal.resManager.getZipPacketCount() == 0){
			let lanuageData = IGlobal.config.getData("language")
			let lanuage = "zh-cn"
			if (lanuageData != null){
				lanuage = lanuageData.key
			}

			IGlobal.resManager.setLanguagePath(String.format("language/%s/", lanuage))
			
			let addPathList = lanuageData == null ? [] : (lanuageData.include || []);
			for(let path of addPathList){
				IGlobal.resManager.addLanguageIncludePath(path)
			}

			let excludePathList = lanuageData == null ?[] : (lanuageData.exclude || []);
			for(let path of excludePathList){
				IGlobal.resManager.addLanguageExcludePath(path)
			}
		}

		//LoadingUI.hide();
		
		//初始化配置文件
		// IGlobal.config.initWithJson(IGlobal.resManager.getRes("launch_json"));
		// IGlobal.sdkHelper.initWithJson(IGlobal.resManager.getRes("sdkconfig_json"));

		g_GameStart();
	} 


}