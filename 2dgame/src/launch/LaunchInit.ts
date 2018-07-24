
//版本号对比：AAA.BBB.CCC
//AAA属于大版本更新，BBB属于小版本更新，CCC属于局部调整更新
//对于程序，CCC变化意味着优化更新，不属于更新
//对于资源，与服务器版本号对应。任何版本号变化都是必要更新。但是CCC变化，不用服务器版本号升级。
function CompareVersion(strV1 = "", strV2 = ""){
    
	let v1_1 = 0, v1_2 = 0, v1_3 = 0;
	let v2_1 = 0, v2_2 = 0, v2_3 = 0;
	
	//返回bool表示是否强制更新
	if(strV1 != "" ){
        
        let info = StringUtil.stringMatch(strV1, /(\d+)\.(\d+)\.(\d+)/)
        if(info == null){
            return [0, false]
        }
        let [s1, s2, s3] = info;
		if(s1 == null || s2 == null || s3 == null ){
            return [-1, true]
		}
		
		v1_1 = tonumber(s1)
		v1_2 = tonumber(s2)
		v1_3 = tonumber(s3)
	}
	
	if(strV2 != "" ){
        let info = StringUtil.stringMatch(strV2, /(\d+)\.(\d+)\.(\d+)/)
        if(info == null){
            return [0, false]
        }
        let [s1, s2, s3] = info;
		if(s1 == null || s2 == null || s3 == null ){
            return [-1, true]
		}
		
		v2_1 = tonumber(s1)
		v2_2 = tonumber(s2)
		v2_3 = tonumber(s3)
	}
	
	if(v1_1 != v2_1 ){
        return [v1_1 - v2_1, true]
	}
	
	if(v1_2 != v2_2 ){
        return [v1_2 - v2_2, true]
	}
	
	if(v1_3 != v2_3 ){
        return [v1_3 - v2_3, false]
	}
	
    return [0, false]
}

function IsiOSPlatform(){
    return egret.Capabilities.os == "iOS"
}

function IsAndroidPlatform(){
    return egret.Capabilities.os == "Android"
}

//iphonex系列超长屏幕
function g_isIPhoneX(){
    if(egret.Capabilities.os == "iOS"){
        return IGlobal.stageHeight / IGlobal.stageWidth > 2
    }
    return false;
}


function g_InitGlobal(){
	var app:Application = Application.getInstance();
	IGlobal = {
		rootNode : app.getRootNode(),
		stage : app.getStageNode(),
		netSystem :core.NetSystem.getInstance(),
		guiManager: gui.GuiManager.getInstance(),
        imageSet :gui.ImageSet.getInstance(),
        fontSet  : gui.FontSet.getInstance(),
        animSet  : gui.AnimSet.getInstance(),

        resManager: core.ResManager.getInstance(),
        resGroupManager: core.ResGroupManager.getInstance(),

        mapManager: map.MapManager.getInstance(),
        spriteMangaer : map.LogicSpriteManager.getInstance(),

        soundManager : core.SoundManager.getInstance(),
        

        setting : UserSetting.getInstance(),
        config : new core.ConfigFile,
        httpClient: null,
        gameSdk: core.GameSdk.getInstance(),
        sdkHelper:SdkHelper.getInstance(),

        stageWidth: app.getStageNode().stageWidth,
        stageHeight: app.getStageNode().stageHeight,


        errorReport: core.ErrorReport.getInstance(),

        //设计分辨率
        contentWidth: 640,
        contentHeight: 1060,
	}
    window["IGlobal"] = IGlobal;
    

     //监听舞台大小变化
    IGlobal.stage.addEventListener(egret.Event.RESIZE, onStageResie, null);
    
    let contentWidth  = IGlobal.contentWidth;
    let contentHeight  = IGlobal.contentHeight;
    let scaleMode = egret.StageScaleMode.SHOW_ALL;

    // let stageW = IGlobal.stageWidth
    // let stageH = IGlobal.stageHeight
    

    // if(IGlobal.stageWidth / IGlobal.stageHeight > IGlobal.contentWidth / IGlobal.contentHeight ){
        
    // }else if(IGlobal.stageWidth / IGlobal.stageHeight < 640 / 1160){
    //     contentWidth = 640;
    //     contentHeight = 1136;
    // }else{
    //     scaleMode = egret.StageScaleMode.FIXED_WIDTH;
    // }
    //宽屏(600*800 ipad宽度, 微信小程序不支持showall)
    if(egret.Capabilities.runtimeType != egret.RuntimeType.WXGAME && IGlobal.stageWidth / IGlobal.stageHeight > 600/800){
        scaleMode = egret.StageScaleMode.SHOW_ALL;
    }
    else if(IGlobal.stageWidth / IGlobal.stageHeight > contentWidth / contentHeight){//宽屏
        scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
    }else{//窄屏
        scaleMode = egret.StageScaleMode.FIXED_WIDTH;
    }

    // contentWidth = 640;
    // contentHeight = 1136;
    
    IGlobal.stage.setContentSize(contentWidth , contentHeight);
    IGlobal.stage.scaleMode = scaleMode;

     IGlobal.httpClient = IGlobal.netSystem.createHttpClient();
     //IGlobal.mapManager.getCamera().setViewSize(IGlobal.contentWidth, IGlobal.contentHeight);
   
    //throw new Error();
}



function onStageResie(){
    IGlobal.stageWidth  = IGlobal.stage.stageWidth;
    IGlobal.stageHeight = IGlobal.stage.stageHeight;

    IGlobal.mapManager.getCamera().setViewSize(IGlobal.stageWidth, IGlobal.stageHeight);
    FireEvent(Event_STAGE_RESIZE, null);
}


function g_LaunchInit(){

    //初始化全局变量
    g_InitGlobal();

    

    //检查版本
    var precedureMgr:PrecedureManager = PrecedureManager.getInstance();
    precedureMgr.registerPrecedure(PRECEDURE_VERSION_UPDATE, new VersionUpdatePrecedure);
    precedureMgr.changePrecedure(PRECEDURE_VERSION_UPDATE);
}