class LoginFrame extends BaseWnd {

    static STATE_LOGO: number = 0;//背景图
    static STATE_AUTH: number = 1;//授权信息
    static STATE_RENCENT: number = 2;//最近登陆
    static STATE_REGISTER: number = 3;//注册
    static STATE_LOADING: number = 4;//loading


    lastLoginTime: number;
    lastLoginCount: number;

    loadingMsg: string;
    fireStayTimerId: any;
    bFireFinishEvent: boolean;
    loadProgress: number;

    animTimerId: number;
    during: number;


    sdkLogo:eui.Image;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/login/LoginLayout.exml"];
    }

    public onLoad(): void {
        //this.createLayerNode();
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreenRaw(true)
        this.initSkinElemList();
        

        var elemInfo = [
            { ["name"]: "btn_entergame", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onEnterGame },
            { ["name"]: "group_recent", ["title"]: null, ["event_name"]: null, ["fun_index"]: null },

            { ["name"]: "label_account", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAccountClick },
            { ["name"]: "label_serverName", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onServerListClick },
            //{ ["name"]: "icon_serverStat", ["title"]: null, ["event_name"]: null, ["fun_index"]: null },
            //{ ["name"]: "icon_serverNew", ["title"]: null, ["event_name"]: null, ["fun_index"]: null },
            //{ ["name"]: "label_serverStat", ["title"]: null, ["event_name"]: null, ["fun_index"]: null },

            { ["name"]: "group_auth", ["title"]: null, ["event_name"]: null, ["fun_index"]: null },
            { ["name"]: "edit_account", ["title"]: null, ["event_name"]: null, ["fun_index"]: null },
            { ["name"]: "edit_password", ["title"]: null, ["event_name"]: null, ["fun_index"]: null },
            { ["name"]: "btn_auth", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAuthBtnClick },
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBtnAuthClose },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        //  if(typeof g_SplashLogo != "undefined"){
        //     var logo:eui.Image = new eui.Image;
        //     logo.source = g_SplashLogo;
        //     logo.horizontalCenter = 0;
        //     logo.bottom = 85;
        //     this.mLayoutNode.addChild(logo)
        //     this.sdkLogo = logo;
        // }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.lastLoginTime = -1;
        this.lastLoginCount = 0;

        this.mLayoutNode.visible = true;

        if(this.mLayoutNode.skin == null)
            throw "error skill"

        this.command_switchState(LoginFrame.STATE_LOGO);



        RegisterEvent(EventDefine.LOGIN_ACCOUNT_AUTH_SUCC, this.refreshUI, this);
        RegisterEvent(EventDefine.LOGIN_SERVERLIST_UPDATE, this.refreshUI, this);

        RegisterEvent(EventDefine.LOADING_GAME_RESOURCE_BEGIN, this.onLoadBegin, this)
        RegisterEvent(EventDefine.LOADING_GAME_RESOURCE_UPDATE, this.onLoadUpdate, this)
        RegisterEvent(EventDefine.LOADING_GAME_RESOURCE_FINISH, this.onLoadFinish, this)
        RegisterEvent(EventDefine.LOGIN_LOGO_HIDE_BEGIN, this.onAnimLogoHide, this)

        this.refreshUI();
        //this.checkSkipAuthServer()
  }

    checkSkipAuthServer(){
		let skipAuth = (IGlobal.gameSdk.getBoolConfigDef("IsReLogin", true) == false);
        //let skipServer = IGlobal.gameSdk.getSkipSelectServer();

        // if (skipAuth == true && skipServer == true){
        //     this.mElemList['group_recent'].visible = false
        //     let event;
        //     this.onEnterGame(event)
        //     return
        // }
        this.mElemList['group_recent'].visible = true
        //this.mElemList['group_account'].visible = (!skipAuth)
        //this.mElemList['group_server'].visible = (!skipServer)
        if (skipAuth == true){
            // this.mElemList['group_server'].y = 65
            // this.mElemList['btn_entergame'].y = 144
            UiUtil.setVisible(this.mElemList["group_account"], false, false)
        }else{
            // this.mElemList['group_server'].y = 51
            // this.mElemList['group_account'].y = 115
            // this.mElemList['btn_entergame'].y = 178            
            UiUtil.setVisible(this.mElemList["group_account"], true, true)
        }
    }


    public onHide(): void {
        this.mLayoutNode.visible = false;
        UnRegisterEvent(EventDefine.LOGIN_ACCOUNT_AUTH_SUCC, this.refreshUI, this);
        UnRegisterEvent(EventDefine.LOGIN_SERVERLIST_UPDATE, this.refreshUI, this);

        UnRegisterEvent(EventDefine.LOADING_GAME_RESOURCE_BEGIN, this.onLoadBegin, this)
        UnRegisterEvent(EventDefine.LOADING_GAME_RESOURCE_UPDATE, this.onLoadUpdate, this)
        UnRegisterEvent(EventDefine.LOADING_GAME_RESOURCE_FINISH, this.onLoadFinish, this)
        UnRegisterEvent(EventDefine.LOGIN_LOGO_HIDE_BEGIN, this.onAnimLogoHide, this)

        if (this.fireStayTimerId) {
            KillTimer(this.fireStayTimerId)
            this.fireStayTimerId = null
        }

        if (this.animTimerId) {
            KillTimer(this.animTimerId)
            this.animTimerId = null
        }

        if (this.bFireFinishEvent) {
            FireEvent(EventDefine.LOGIN_LOGO_HIDE_FINISH, null)
        }

        this.loadingMsg = null

        this.mElemList["edit_account"].text = ""
        this.mElemList["edit_password"].text = ""
    }


    refreshUI(): void {

        this.mElemList["label_version"].text = "V"+g_VersionData.resourceVer

        //var recentLoginServerInfo = LoginSystem.getInstance().getRecentLoginServerInfo();

        let recentGameId = LoginSystem.getInstance().getSelectServerGameID()
        let recentGroupIndex = LoginSystem.getInstance().getSelectServerGroupIndex()
      
        //if (recentLoginServerInfo) {
        if (recentGameId != -1 && recentGroupIndex != -1){
            let serverName = LoginSystem.getInstance().getServerNameByGameGroup(recentGameId, recentGroupIndex)
            let serverInfo = LoginSystem.getInstance().getServerInfoByGameGroup(recentGameId, recentGroupIndex)
            //serverInfo.maintain = true;
            var textinfo = LoginSystem.getInstance().getServerStateText(serverInfo);

            this.mElemList["label_serverName"].text = serverName;
            this.mElemList["label_serverName"].textColor = textinfo.color

            this.mElemList["label_serverStatus"].text = serverInfo.maintain ? Localize_cns("WEIHU") : Localize_cns("XUANFU");
            this.mElemList["label_serverStatus"].textColor = textinfo.color;
            this.mElemList["label_serverStatusLine"].fillColor = textinfo.color;
            //this.mElemList["icon_serverStat"].source = textinfo.image;
            //this.mElemList["icon_serverNew"].visible = (serverInfo.isnew == true);
            //this.mElemList["label_serverName"].text = recentLoginServerInfo.ServerName;
            //this.mElemList["label_serverName"].text = serverName
            //this.mElemList["label_serverName"].textColor = gui.Color.cyan
        }

        var userLoginName = GameAccount.getInstance().getUserLoginName();
        if (userLoginName) {
            this.mElemList["label_account"].text = userLoginName;
        }

        
        //var newestLoginServerInfo = LoginSystem.getInstance().getNewestServerInfo();
        //if (newestLoginServerInfo) {
        let gamegroup = LoginSystem.getInstance().getNewestGameGroup()
        if (gamegroup != null && gamegroup[0] != null && gamegroup[1] != null) {
            let serverName = LoginSystem.getInstance().getServerNameByGameGroup(gamegroup[0], gamegroup[1])
            //this.mElemList["label_newserver"].text = newestLoginServerInfo.ServerName;
            this.mElemList["label_newserver"].text = serverName;
            this.mElemList["label_newserver"].textColor = gui.Color.cyan
        }
        

    }

    //刷新UI数据
    refreshAuthData() {
        if(this.mElemList["edit_account"].text == ""){
            let userName = IGlobal.setting.getCommonSetting(UserSetting.TYPE_STRING, "username", "")
            this.mElemList["edit_account"].text = (userName)
        }
        
        if(this.mElemList["edit_password"].text == ""){
            let passWord = IGlobal.setting.getCommonSetting(UserSetting.TYPE_STRING, "password", "")
            this.mElemList["edit_password"].text = (passWord)
        }
    }


    public command_switchState(param1?: any, param2?: any): void {

        this.mElemList["group_recent"].visible = false;
        this.mElemList["group_auth"].visible = false;
        this.mElemList["group_loading"].visible = false;

        this.mLayoutNode.setLayer(gui.GuiLayer.Normal)
        if (this.animTimerId) {
            KillTimer(this.animTimerId)
            this.animTimerId = null
        }
        this.mElemList["image_bg"].source = "dl_dengLuDi01";

        if(this.sdkLogo){
            this.sdkLogo.visible = false;
        }

        var state = param1;
        switch (state) {
            case LoginFrame.STATE_LOGO:
                {
                    if(this.sdkLogo){
                        this.sdkLogo.visible = true;
                    }
                }
                break;
            case LoginFrame.STATE_AUTH:
                {
                    this.mElemList["group_auth"].visible = true;
                    this.refreshAuthData()
                }
                break;
            case LoginFrame.STATE_RENCENT:
                {
                    this.mElemList["group_recent"].visible = true;
                    this.checkSkipAuthServer()
                }
                break;
            case LoginFrame.STATE_REGISTER:
                {
                    WngMrg.getInstance().showWindow("LoginRegisterFrame");
                }
                break;
            case LoginFrame.STATE_LOADING:
                {
                    if(this.sdkLogo){
                        this.sdkLogo.visible = true;
                    }
                    // if (this.animTimerId == null) {
                    //     this.during = 0
                    //     this.animTimerId = SetTimer(this.animRotate, this, 100)
                    // }
                    this.mElemList["image_bg"].source = "dl_dengLuDi02"
                    this.mElemList["group_loading"].visible = true;
                    this.mLayoutNode.setLayer(gui.GuiLayer.Top)
                }
                break;
        }
    }



    // animRotate(dt) {
    //     this.during = this.during + dt

    //     let Circle_frame = this.mElemList["Circle_frame"]
    //     let rotate = Math.floor(this.during * 0.3) % 360
    //     Circle_frame.rotation = rotate;

    // }

    onAccountClick(event: egret.TouchEvent): void {
        var mode = IGlobal.sdkHelper.getSdkMode();
        if (mode == SdkMode.Officiail) {
            this.command_switchState(LoginFrame.STATE_AUTH);
        } else {
            //todo:yangguiming
        }
    }

    onServerListClick(event: egret.TouchEvent): void {
        WngMrg.getInstance().showWindow("LoginServerListFrame");
    }

    onAuthBtnClick(event: egret.TouchEvent): void {
        var acc_string = this.mElemList["edit_account"].text;
        var pwd_string = this.mElemList["edit_password"].text;

        if (StringUtil.isEmpty(acc_string) || StringUtil.isEmpty(pwd_string)) {
            MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_USER_CFM"))
            return;
        }

        LoginSystem.getInstance().startOfficiailHttpAccountAuth(acc_string, pwd_string)
    }

    onBtnAuthClose(event: egret.TouchEvent): void {
        var authorInfo = GameAccount.getInstance().getAuthorInfo();
        if (authorInfo == null)
            return;
        this.command_switchState(LoginFrame.STATE_RENCENT);
    }

    onEnterGame(event: egret.TouchEvent): void {

        var serverInfo = LoginSystem.getInstance().getSelectSeverInfo();
        if (serverInfo == null) {
            MsgSystem.addTagTips(Localize_cns("LOGIN_ERROR7"));
            return
        }
//
        // /if (serverInfo.State == StateType.UNABLE) {
        if (serverInfo.maintain == true) {
            MsgSystem.addTagTips(Localize_cns("LOGIN_ERROR7"));
            return;
        }

        //检查版本号
        // var bCheckUpdate = LaunchHelper.getInstance():isCheckUpdate()
        // if(bCheckUpdate){
        //     local serverVer = serverInfo.Version
        //     local resVer = GetCacheResVer()
        //     local ret, bNeedUpdate = CompareVersion(resVer, serverVer)
        //     if  bNeedUpdate then
        //         MsgSystem:ConfirmDialog_YES(Localize_cns("LOGIN_SERVER_VER_ERROR"))
        //         return
        //     end
        // }

        if (this.lastLoginTime > 0) {
            var currentTime = core.getCpuTime();
            if (currentTime - this.lastLoginTime < 3000) {
                this.lastLoginCount = this.lastLoginCount + 1;
                if (this.lastLoginCount >= 2) {
                    MsgSystem.addTagTips(Localize_cns("LOGIN_SERVER_TOO_OFTEN"))
                }
                return;
            }
        }

        this.lastLoginTime = core.getCpuTime();
        this.lastLoginCount = 0;
        //连接桥登陆
        LoginSystem.getInstance().startBridgeAuth();


    }




    setProgressSlot(percent) {

    }


    onLoadBegin(args) {


        this.command_switchState(LoginFrame.STATE_LOADING);


        this.setProgressSlot(0)
        if (this.loadingMsg != null) {
            this.mElemList["label_loading"].text = (this.loadingMsg)
            this.setProgressSlot(100)
        }

    }

    onLoadUpdate(args) {
        if (args.all == 0) {
            this.loadProgress = 1
        } else {
            this.loadProgress = args.cur / args.all
        }

        let progress = Math.floor(this.loadProgress * 100)

        this.setProgressSlot(progress)

        if (this.loadingMsg == null) {
            let str = String.format(Localize_cns("LOGIN_ADD_MEMERY_CONTENT"), progress + "%")
            this.mElemList["label_loading"].text = (str)
        }
    }

    onLoadFinish(args) {
        this.loadProgress = 1
        //this.addMemeryFrame.SetVisible(false)	
        //if(this.addMemeryRotateTimer ){
        //	KillTimer(this.addMemeryRotateTimer)
        //	this.addMemeryRotateTimer = null
        //}	
    }

    

    onAnimLogoHide(args:GameUserDataEvent) {
        this.bFireFinishEvent = args.userData;
        this.delayHideWnd()
    }

    delayHideWnd() {
        function nextTick(dt) {
            this.hideWnd()
        }
        this.fireStayTimerId = SetTimer(nextTick, this, 1000)
    }

    showLoadingWithMsg(msg){
        this.loadingMsg = msg
        this.showWnd()
        this.doCommand("command_switchState", LoginFrame.STATE_LOGO);
        this.doCommand("onLoadBegin")
    }

}