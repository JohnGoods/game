//var START_MOVIE_NAME = "Movie0"

class GamePrecedure extends BasePrecedure implements WorkQueueCallback {

    workQueue: WorkQueue;
    mbLoad: boolean;
    mbAnalyze: boolean

    allCount: number

    public initObj(...params: any[]) {
        this.mbLoad = false
        this.mbAnalyze = false
        this.allCount = 0;

        this.workQueue = WorkQueue.newObj()
        this.workQueue.setCallback(this)
    }

    destory() {
        this.workQueue.deleteObj();
        this.workQueue = null;
    }

    public onActive(lastId): void {
        TLog.Debug("GamePrecedure.onActive lastId:%d", lastId)

        this.registerEventHandle(EventDefine.SYSTEM_MOUSE_DOWN, this.onTouchBegin, this)
        this.registerEventHandle(EventDefine.SYSTEM_MOUSE_MOVE, this.onTouchMove, this)
        this.registerEventHandle(EventDefine.SYSTEM_MOUSE_UP, this.onTouchEnd, this)
        // this.registerEventHandle(EventDefine.SYSTEM_MOUSE_CLICK,this.onTouchClick, this)
        // this.registerEventHandle(EventDefine.SYSTEM_MOUSE_DBCLICK,this.onTouchDBClick, this)

        this.registerEventHandle(EventDefine.SYSTEM_RESUME,this.onGameResume, this)
        this.registerEventHandle(EventDefine.SYSTEM_PAUSE,this.onGamePause, this)

        FireEvent(EventDefine.MSG_WAIT_END, null)
        IGlobal.resManager.clearErrorRes();

        LoginNetDispatcher.getInstance().disconnect()
        //先加载资源
        this.workQueue.clear()
        if (this.mbLoad == false) {
            this.mbLoad = true
            //SDKAnalyzer(SdkEventDefine.GAME_LOADING_BEGIN, "")
            this.mbAnalyze = true
            this.onLoadBegin()
        }
        this.workQueue.start()
        RpcProxy.setSendEnable(false);
    }

    public onDeactive(currentId): void {
        TLog.Debug("GamePrecedure.onDeactive currentId:%d", currentId)
        this.unregisterEventHandle(EventDefine.SYSTEM_MOUSE_DOWN)
        this.unregisterEventHandle(EventDefine.SYSTEM_MOUSE_MOVE)
        this.unregisterEventHandle(EventDefine.SYSTEM_MOUSE_UP)
        // this.unregisterEventHandle(EventDefine.SYSTEM_MOUSE_CLICK)
        // this.unregisterEventHandle(EventDefine.SYSTEM_MOUSE_DBCLICK)

        this.unregisterEventHandle(EventDefine.SYSTEM_RESUME)
        this.unregisterEventHandle(EventDefine.SYSTEM_PAUSE)

        //先退圣地
        //GetActivity(ActivityDefine.Robber).stop()

        //状态初始化
        
        MsgSystem.onClear()
        ActorManager.getInstance().onClear()
        GameNetDispatcher.getInstance().disconnect()
        WngMrg.getInstance().onClear()
        FireEvent(EventDefine.PRECEDURE_DEACTIVE, PrecedureEvent.createObj(this.id))
        

        let systemNum = BaseSystem.s_systemList.length
        for (let i = systemNum - 1; i >= 0; i--) {
            let v = BaseSystem.s_systemList[i]
            v.onClear()
        }
        StateManager.getInstance().onClear()
        //GameSound.getInstance():clearAutoPlayList()

        //如果是快速重连，就不用隐藏角色
        var bQuickLogin = LoginSystem.getInstance().isQuickLogin()
        GetHero().setVisible(bQuickLogin)
        GetHero().setMoveable(false)//快速重连时候，不能跑地图
    }

    onLoadBegin() {
        GameConfig.initResourceFirst(this.workQueue);
        if (GAME_MODE == GAME_NORMAL) {
            let loginRoleInfo: LoginRole = LoginSystem.getInstance().getLoginRoleInfo()
            if (loginRoleInfo.level <= 1) {
                GameConfig.initGuideResourceGroupConfig(this.workQueue);
            }
        }
        
        FireEvent(EventDefine.LOADING_GAME_RESOURCE_PREPARE, LoadingEvent.createObj(this.workQueue));
    }

    onLoadFinish() {
        TLog.Debug("===========GamePrecedure.onLoadFinish===========")
        IGlobal.resGroupManager.unLoadGroup(ResourceGroupDefine.Group_LOGINPRELOAD)

        //清理zip，加快加载速度（否则本地和zip共搜索两次）
        IGlobal.resManager.removeZipPacket(ZipFileListDefine.LoginZip)
        IGlobal.resManager.removeZipPacket(ZipFileListDefine.ConfigZip)
        IGlobal.resManager.removeZipPacket(ZipFileListDefine.ConfigUIZip)

        if (this.mbAnalyze) {
            this.mbAnalyze = false
            //SDKAnalyzer(SdkEventDefine.GAME_LOADING_FINISH, "")
        }
        //SceneManager.getInstance().setScenePersScale(SCENE_PERS_SCALE_LIVE)//精灵缩放比例

        this.workQueue.clear()

        var loginRoleInfo = LoginSystem.getInstance().getLoginRoleInfo();
        //判断顺序，本地记录、角色等级、登陆角色等级
        // if (IGlobal.setting.getRoleSetting(UserSetting.TYPE_NUMBER, START_MOVIE_NAME, 0) == 0 && (loginRoleInfo && loginRoleInfo.level <= 0) && GAME_MODE == GAME_NORMAL) {
        //     FireEvent(EventDefine.LOGIN_LOGO_HIDE_BEGIN, GameUserDataEvent.newObj(false))
        //     //WngMrg.getInstance():getWindow("LoginLogoFrame"):setAddMemeryFrameState(false)
        //     MovieSystem.getInstance().playMovieAndSetCallback(START_MOVIE_NAME, this, this.connectGameServer)
        // } else {
        //     this.connectGameServer()
        // }
        this.connectGameServer()
        CollectGarbage()
    }

    connectGameServer() {
        if (GAME_MODE == GAME_NORMAL) {

            var account: GameAccount = GameAccount.getInstance();
            var ip = account.getGameIp();
            var port = account.getGamePort();
            //连接游戏服务器
            //print("break.................")
            GameNetDispatcher.getInstance().disconnect()
            GameNetDispatcher.getInstance().connect(ip, port)
            TLog.Warn("=======connect game ip:%s port:%d===========", ip, port)
        }

        LoginSystem.getInstance().setQuickLogin(false)
        //--如果回到本服，就清空跨服信息
        if (g_CrossServerInfo && g_CrossServerInfo.state == CS_FINISH) {
            g_CrossServerInfo = null
        }
        // --Config.getInstance():flush()
        FireEvent(EventDefine.PRECEDURE_ACTIVE, PrecedureEvent.createObj(this.id))
    }


    onTouchBegin(args: egret.TouchEvent) {
        StateManager.getInstance().OnEvent("OnVpMouseDownEvent", args);
    }

    onTouchMove(args: egret.TouchEvent) {
        StateManager.getInstance().OnEvent("OnVpMouseMoveEvent", args);
    }

    onTouchEnd(args: egret.TouchEvent) {
        StateManager.getInstance().OnEvent("OnVpMouseUpEvent", args);
    }


    onBeginWorkQueue(allCount: number) {
        this.allCount = allCount;
        FireEvent(EventDefine.LOADING_GAME_RESOURCE_BEGIN, LoadingUpdateEvent.createObj(0, allCount));
    }

    onUpdateWorkQueue(unit: WorkUnit, cur: number, allCount: number) {
        let percent = allCount == 0 ? 0 : cur / allCount * 100
        TLog.Debug("GamePrecedure percent: %d %%", percent)
        FireEvent(EventDefine.LOADING_GAME_RESOURCE_UPDATE, LoadingUpdateEvent.createObj(cur, allCount))
    }

    onEndWorkQueue() {
        FireEvent(EventDefine.LOADING_GAME_RESOURCE_FINISH, LoadingUpdateEvent.createObj(this.allCount, this.allCount));
        this.onLoadFinish();
    }

    
    onGameResume( args){
        //StateManager.getInstance().OnEvent("OnVpMouseDBClickEvent", args)
        TLog.Debug("GamePrecedure.onGameResume")
        SendSynGameTime() //同步一下游戏时间
        FireEvent(EventDefine.GAME_RESUME, null)
    }

    onGamePause( args){
        TLog.Debug("GamePrecedure.onGamePause")
        //StateManager.getInstance().OnEvent("OnVpMouseDBClickEvent", args)
        FireEvent(EventDefine.GAME_PAUSE, null)
    }
}