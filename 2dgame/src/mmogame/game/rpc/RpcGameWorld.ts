module RpcLogic {

    let checkMapLoadTimer = null;

    function _handleHeroInfo(roleInfo) {
        if (roleInfo.experience)
            roleInfo.experience = tonumber(roleInfo.experience)
        if (roleInfo.funds)
            roleInfo.funds = tonumber(roleInfo.funds)
        if (roleInfo.combatForce)
            roleInfo.combatForce = tonumber(roleInfo.combatForce)
        // if(roleInfo.funds)
        //     roleInfo.funds = tonumber(roleInfo.funds)
    }

    //角色信息，第一次进入游戏加载
    export function G2C_HeroInfoInit(roleInfo) {
        //预处理
        _handleHeroInfo(roleInfo)



        // let heroInfo = HeroInfo.newObj();
        // for (let k in roleInfo) {
        //     heroInfo[k] = roleInfo[k]
        // }

        var hero: Hero = GetHero()
        ActorManager.getInstance().updateHeroInfo(roleInfo, true)

        GuideSystem.getInstance().filterEntry()

        SetServerTime(hero.getProperty("ServerTime") || 0)//设置服务器事件
        SetSCDiffTime(StringUtil.getTimeFromString(hero.getProperty("ServerDataTime"))) //服务器客户端时间差


        //设置生活状态
        StateManager.getInstance().ActiveState(state_type.LIVE_BASE_STATE)


        hero.enterMap() //进入地图
        hero.setVisible(true)
        hero.setMoveable(true)
        hero.updateFollowModelPos()
        //hero.changeAction("idle");

        if(checkMapLoadTimer != null){
            KillTimer(checkMapLoadTimer)
        }

        let loadMaxTime = 2000;//最大等待时间
        let loadDuring = 0;
        let loadFinish = false;
        let onCheckMapLoadFinish = function(dt){
            let loadingCount = IGlobal.mapManager.getLoadingTileImageCount()
            if(loadingCount != -1){
                if(loadingCount <= 0){
                    loadFinish = true;
                }
            }

            loadDuring += dt;
            if(loadDuring >= loadMaxTime){
                loadFinish = true;
            }

            if(loadFinish){
                if(checkMapLoadTimer){
                    KillTimer(checkMapLoadTimer)
                    checkMapLoadTimer = null;
                }
                FireEvent(EventDefine.LOGIN_LOGO_HIDE_BEGIN, GameUserDataEvent.newObj(true))
            }
        }
        checkMapLoadTimer = SetTimer(onCheckMapLoadFinish, this, 100);

        //FireEvent(EventDefine.LOGIN_LOGO_HIDE_BEGIN, GameUserDataEvent.newObj(true))
        FireEvent(EventDefine.HERO_ENTER_GAME, null)

        // if (WngMrg.getInstance().isVisible("LoginFrame") == false) {
        //     FireEvent(EventDefine.LOGIN_LOGO_HIDE_FINISH, null)
        // }


        //主角进入跨服服务器
        if (g_CrossServerInfo) {
            FireEvent(EventDefine.HERO_ENTER_CROSS_SERVER, null)
        }


        if (GAME_MODE == GAME_NORMAL) {
            let heroInfo = GetHeroPropertyInfo()
            //let serverInfo = LoginSystem.getInstance().getRecentLoginServerInfo()
            let serverInfo = LoginSystem.getInstance().getSelectSeverInfo()
            //let serverInfo = {'ServerID' : tostring(recentGameId)}
            //serverInfo['ServerID'] = tostring(recentGameId)
            IGlobal.errorReport.addUserParam("serverId", tostring(serverInfo.gameId))
            IGlobal.errorReport.addUserParam("roleId", heroInfo["id"])
            //serverId:string, serverName:string, roleId:string, roleName:string, roleLevel:number
            //IGlobal.gameSdk.reportRoleLogin(serverInfo.ServerID, serverInfo.ServerName, heroInfo["id"], heroInfo["name"], heroInfo["level"], heroInfo['gold'], heroInfo['force']);
            IGlobal.gameSdk.reportRoleLogin(serverInfo, heroInfo);
        }
    }

    //主角自动更新
    export function G2C_HeroInfoUpdate(id, updateInfo) {
        _handleHeroInfo(updateInfo)

        // let heroInfo = HeroInfo.newObj();
        //  for (let k in updateInfo) {
        //     heroInfo[k] = updateInfo[k]
        // }

        ActorManager.getInstance().updateHeroInfo(updateInfo)
    }


    export function G2C_PlayerAppeare(mapId, cellx, celly, playerInfo) {
        let param:any = {}
        param.cellx = cellx
        param.celly = celly
        param.mapId = mapId
        param.info = playerInfo
        
        if (ActorManager.getInstance().addObjectStorage(onRoleAdd, this, param)) {
            return
        }
        onRoleAdd(param)
    }


    export function G2C_PlayerAppeareChange(mapId, cellx, celly, playerInfo) {
        let param: any = playerInfo
        param.mapId = mapId
        if (ActorManager.getInstance().addObjectStorage(onRoleChange, this, param)) {
            return
        }

        onRoleChange(param)
    }

    export function G2C_ObjectAdd(npcInfo) {
        let param = npcInfo

        if (ActorManager.getInstance().addObjectStorage(onObjectAdd, this, param)) {
            return
        }


        onObjectAdd(param)
    }

    export function G2C_Disappear(id, Type) {
        let param: any = {}
        param.id = id
        param.Type = Type

        if (ActorManager.getInstance().addObjectStorage(onRoleDisappear, this, param)) {
            return
        }

        onRoleDisappear(param)
    }
    
    

    function onObjectAdd(param: any) {
        let npcObject = ActorManager.getInstance().createNpc(param)
    }

     function onRoleAdd(param: any) {
        if (MapSystem.getInstance().getMapId() == param.mapId) {
            let playerObject = ActorManager.getInstance().createPlayer(param.info, param.cellx, param.celly)
        }

    }

     function onRoleDisappear(param: any) {

        if (param.Type == objectType.OBJECT_TYPE_PLAYER) {
            ActorManager.getInstance().deletePlayer(param.id)
        } else if (param.Type == objectType.OBJECT_TYPE_GAMEOBJECT) {
            ActorManager.getInstance().deleteNpc(param.id)
        }
    }
    
    function onRoleChange(param) {
        if (MapSystem.getInstance().getMapId() == param.mapId) {
            ActorManager.getInstance().updatePlayer(param.id, param)
        }
    }


}