// TypeScript file

class GameWorldMessageHandler extends MessageHandler {
    scheduleEntryID: number;

    public initObj(...params: any[]): void {



        this.scheduleEntryID = null;

        this.register(ServerOpcodes.SMSG_LOGIN, this.onRecvSMSG_LOGIN, this)	//进入游戏服务器
        this.register(ServerOpcodes.SMSG_LOGOUT, this.onRecvSMSG_LOGOUT, this)	//服务器踢人
        this.register(ServerOpcodes.SMSG_PONG, this.onRecvSMSG_PONG, this)		//心跳

        this.register(opCodes.SMSG_RESULT, this.onRecvSMSG_RESULT, this)					//角色登陆
        this.register(opCodes.SMSG_RESULT_STRING, this.onRecvSMSG_RESULT_STRING, this) //显示字符串消息
        this.register(opCodes.SMSG_RESULT_LOGOUT, this.onRecvSMSG_RESULT_LOGOUT, this) //服务器踢下线


        this.register(opCodes.G2C_FIGHT_RECONNECT_NOTICE, this.onRecvG2C_FIGHT_RECONNECT_NOTICE, this)					//战斗重链标志，保证只在战斗重链时才会发送，并且相邻于hero_info之前发送
        //this.register(opCodes.G2C_HERO_INFO, this.onRecvG2C_HERO_INFO, this)					//角色登陆
        this.register(opCodes.G2C_MAP_ENTER, this.onRecvG2C_MAP_ENTER, this)					//跳地图
        this.register(opCodes.G2C_MOVE, this.onRecvG2C_MOVE, this)									//移动
        //this.register(opCodes.G2C_OBJECT_ADD, this.onRecvG2C_OBJECT_ADD, this)			//添加NPC
        //this.register(opCodes.G2C_OBJECT_REMOVE, 		this.onRecvG2C_OBJECT_REMOVE, this)	//移除NPC
        //this.register(opCodes.G2C_OBJECT_UPDATE, this.onRecvG2C_OBJECT_UPDATE, this)	//更新角色属性
        // this.register(opCodes.G2C_ROLE_ADD, this.onRecvG2C_ROLE_ADD, this)					//添加其他玩家
        // this.register(opCodes.G2C_ROLE_CHANGE, this.onRecvG2C_ROLE_CHANGE, this)			//玩家更新
        //this.register(opCodes.G2C_ROLE_REMOVE, 		this.onRecvG2C_ROLE_REMOVE, this.)			//移除玩家

        this.register(opCodes.G2C_DISAPPEAR, this.onRecvG2C_DISAPPEAR, this)			//玩家更新


        this.register(opCodes.G2C_PAY, this.onRecvG2C_PAY, this)			//冲值经过游戏服务器验证后返回
        //this.register(opCodes.G2C_SHARE, 		this.onRecvG2C_SHARE, this)			//分享后服务器发放奖励

        this.register(opCodes.G2C_ROLE_NEW_ERRANTRY, this.onRecvG2C_ROLE_NEW_ERRANTRY, this)			//新手指引记录返回
        this.register(opCodes.G2C_GLOBAL_LOGOUT_CENTER, this.onRecvG2C_GLOBAL_LOGOUT_CENTER, this)  //踢出跨服

        //this.register(opCodes.G2C_ROLE_DETAILED_INFO, this.onRecvG2C_ROLE_DETAILED_INFO, this)	//查看玩家信息返回
        //this.register(opCodes.G2C_ROLE_MAP_NPC_LIST, this.onRecvG2C_ROLE_MAP_NPC_LIST, this)	//当前地图服务器创建的npc列表

        this.register(opCodes.G2C_ROLE_BAN_STATUS, this.onRecvG2C_ROLE_BAN_STATUS, this)	//禁言时间
    }


    destory() {
        if (this.scheduleEntryID) {
            KillTimer(this.scheduleEntryID);
            this.scheduleEntryID = null;
        }
    }

    onRecvG2C_PAY(dispatcher, message) {
        //星灵的不弹框
        let xl_Config = GameConfig.XingLingConfig
        if(xl_Config[message.itemId]) {
            return
        }
        TLog.Debug("G2C_PAY")
        let gainValue = message.gainValue
        if (gainValue != 0 && message.warHornId != 2 && message.itemId != 1201) {
            MsgSystem.confirmDialog_YES(String.format(Localize_cns("GOT_GOLD"), gainValue || 0))
        }else if(message.warHeroId == 2){				//月卡
		    ExecuteMainFrameFunction("qiandao")
        }
        //RECHARGE_WARHORN                        = 1, --购买月卡
        //RECHARGE_NORMAL                         = 5, --晶石充值
        //RECHARGE_WEEKCARD                       = 10, --购买周卡
	    //RECHARGE_TENYUANGIFT					= 11, --十元礼包
        FireEvent(EventDefine.MSG_WAIT_END, null)
        FireEvent(EventDefine.PAY_FORM_GAME_SERVER, NetMessageEvent.newObj(message))
    }

    public onTcpConnect(dispatcher: MessageDispatcher, message: TcpConnectMessage) {
        if (message.code != 0) {   //为0则链接成功，不为0则链接失败
            TLog.Error("Link game server fail code:%d", message.code)
            ConfirmRetryLogin(Localize_cns("NET_ERROR1"), true)
            FireEvent(EventDefine.MSG_WAIT_END, null)
            return
        }

        //SDKAnalyzer(SdkEventDefine.ENTER_GAMESVR_BEGIN, "")

        var account = GameAccount.getInstance();
        var msg = GetMessage(ServerOpcodes.CMSG_LOGIN)//发送登陆请求	
        msg.hostname = account.getLoginHostName()
        msg.accountId = account.getAccountId()
        msg.sessionId = account.getGameSessionId()
        dispatcher.sendPacket(msg)

        //dispatcher.setEnable(false)
    }

    public onTcpClose(dispatcher: MessageDispatcher, message: TcpCloseMessage) {
        if (message.code != 0) {
            TLog.Error("Link game server connect close code:%d", message.code)
        }

        if (this.scheduleEntryID) {
            KillTimer(this.scheduleEntryID)
            this.scheduleEntryID = null
        }

        var t = {}
        if (message.code != 0) {
            ConfirmRetryQuickLogin(Localize_cns("NET_CLOSE"));
            FireEvent(EventDefine.GAME_DISCONNECT, null);
        }
    }

    onRecvSMSG_LOGIN(dispatcher: MessageDispatcher, message: any): void {
        TLog.Warn("enter game server.............")
        if (message.result != 0) {
            return
        }
        RpcProxy.setSendEnable(true);
        //dispatcher.setEnable(true)

        SetServerTime(message.serverTime)//设置服务器时间

        if (this.scheduleEntryID == null) {
            let scheduTimerCallback = function (delay) {
                SendSynGameTime()
            }
            this.scheduleEntryID = SetTimer(scheduTimerCallback, this, 30000, true)//X秒一次
        }

        //GuideSystem.getInstance():insertFirstGuide()
    }

    onRecvSMSG_LOGOUT(dispatcher: MessageDispatcher, message: any): void {
        var text = errCode2Text(message.result)
        TLog.Error("GameWorldMessageHandler.onRecvSMSG_LOGOUT %d %s", message.result, text)
    }

    onRecvSMSG_PONG(dispatcher: MessageDispatcher, message: any): void {
        TLog.Warn("Pong Pong Pong:%d", message.serverTime)

        SetServerTime(message.serverTime)//设置服务器时间
        FireEvent(EventDefine.GAME_SERVERTIME_UPDATE, null)
    }

    onRecvSMSG_RESULT(dispatcher: MessageDispatcher, message: any): void {
        let event = GameResultEvent.newObj(message.op, message.result, message.args)
        FireEvent(EventDefine.GAME_RECV_RESULT, event)

        //木有人处理，进入统一处理流程
        if (event.handle == 0) {
            MsgSystem.netTipsHandler(message.result, message.args)
        }
    }

    onRecvSMSG_RESULT_STRING(dispatcher, message) {
        //临时代码(结算时不让消息弹幕)
        // if (FightSystem.getInstance().isFight() == true) {
        //     return
        // }
        //TLog.Debug("onRecvSMSG_RESULT_STRING")
        //TLog.Debug(message.info)
        let txt = message.info
        //TLog.Debug("txt", txt)
        if (GameConfig.CnsConfig[txt] != null) {
            txt = GameConfig.CnsConfig[txt].msg
        }
        //TLog.Debug("txt", txt)
        MsgSystem.selectShowHandle(message.type, txt)
        FireEvent(EventDefine.GAME_RECV_RESULT_STRING, null)

        if (message.type != 1) {
            //MsgSystem.AddTagTips(message.info)
        }
    }

    onRecvSMSG_RESULT_LOGOUT(dispatcher, message) {

        dispatcher.disconnect()
        var t: IDialogCallback = {
            onDialogCallback(result: boolean, userData): void {

                WngMrg.getInstance().hideWindow("LoginFrame")

                LoginSystem.getInstance().setQuickLogin(false)
                LoginSystem.getInstance().setAutoLogin(false)

                LoginSystem.getInstance().changeLoginPrecedure()
            }
        }
        MsgSystem.confirmDialog_YES(Localize_cns("NET_CLOSE"), t)
    }

    onRecvG2C_FIGHT_RECONNECT_NOTICE(dispatcher: MessageDispatcher, message: any): void {
        GuideSystem.getInstance().setLoginReFightFlag(true)
        //SetGlobalInputStatus(false, "Main")
    }

    // onRecvG2C_HERO_INFO(dispatcher: MessageDispatcher, message: any): void {
    //     var hero:Hero = GetHero()
    //     ActorManager.getInstance().updateHeroInfo(message.info, true)

    //     GuideSystem.getInstance().filterEntry()

    //     SetServerTime(hero.getProperty("ServerTime") || 0)//设置服务器事件
    //     SetSCDiffTime(StringUtil.getTimeFromString(hero.getProperty("ServerDataTime"))) //服务器客户端时间差


    //     //设置生活状态
    //     StateManager.getInstance().ActiveState(state_type.LIVE_BASE_STATE)


    //     hero.enterMap() //进入地图
    //     hero.setVisible(true)
    //     hero.setMoveable(true)
    //     //hero.changeAction("idle");

    //     FireEvent(EventDefine.LOGIN_LOGO_HIDE_BEGIN, GameUserDataEvent.newObj(true))
    //     FireEvent(EventDefine.HERO_ENTER_GAME, null)

    //     if (WngMrg.getInstance().isVisible("LoginFrame") == false) {
    //         FireEvent(EventDefine.LOGIN_LOGO_HIDE_FINISH, null)
    //     }


    //     //主角进入跨服服务器
    //     if (g_CrossServerInfo) {
    //         FireEvent(EventDefine.HERO_ENTER_CROSS_SERVER, null)
    //     }


    //     if(GAME_MODE == GAME_NORMAL){
    //         let heroInfo = GetHeroPropertyInfo()
    //         let serverInfo = LoginSystem.getInstance().getRecentLoginServerInfo()
            
    //         IGlobal.errorReport.addUserParam("roleId", heroInfo["id"])
    //         IGlobal.errorReport.addUserParam("serverId", serverInfo.ServerID)
    //         //serverId:string, serverName:string, roleId:string, roleName:string, roleLevel:number
    //         IGlobal.gameSdk.reportRoleLogin(serverInfo.ServerID, serverInfo.ServerName, heroInfo["id"], heroInfo["name"], heroInfo["level"]);
    //     }


    // }

    onRecvG2C_MAP_ENTER(dispatcher: MessageDispatcher, message: any): void {
        MapSystem.getInstance().enterMap(message.mapId, message.cellx, message.celly)
    }

    onRecvG2C_MOVE(dispatcher: MessageDispatcher, message: any): void {
        ActorManager.getInstance().objectMove(message.id, message.type, message.cellx, message.celly)
    }

    // onRecvG2C_OBJECT_ADD(dispatcher: MessageDispatcher, message: any): void {

    //     let param: any = {}
    //     param.classname = message.classname
    //     param.info = NpcInfo.newObj()
    //     table_class_copy(param.info, message.info)
    //     param.info.param = table_copy(message.info.param)
    //     param.info.taskInfo = table_copy(message.info.taskInfo)

    //     if (ActorManager.getInstance().addObjectStorage(this.onObjectAdd, this, param)) {
    //         return
    //     }


    //     this.onObjectAdd(param)

    // }

    // onRecvG2C_OBJECT_UPDATE(dispatcher: MessageDispatcher, message: any): void {
    //     ActorManager.getInstance().updateHeroInfo(message.info)
    // }

    // onRecvG2C_ROLE_ADD(dispatcher: MessageDispatcher, message: any): void {

    //     let param: any = {}
    //     param.classname = message.classname
    //     param.cellx = message.cellx
    //     param.celly = message.celly
    //     param.mapId = message.mapId
    //     param.info = PlayerInfo.newObj()
    //     table_class_copy(param.info, message.info)

    //     if (ActorManager.getInstance().addObjectStorage(this.onRoleAdd, this, param)) {
    //         return
    //     }
    //     this.onRoleAdd(param)

    // }

    // onRecvG2C_ROLE_CHANGE(dispatcher, message) {

    //     let param: any = {}
    //     param.classname = message.classname
    //     param.mapId = message.mapId
    //     param.info = PlayerInfo.newObj()
    //     table_class_copy(param.info, message.info)

    //     if (ActorManager.getInstance().addObjectStorage(this.onRoleChange, this, param)) {
    //         return
    //     }

    //     this.onRoleChange(param)
    // }

    onRecvG2C_DISAPPEAR(dispatcher, message) {
        //TLog.Debug("GameWorldMessageHandler.onRecvG2C_DISAPPEAR %d", message.id)

        // let param: any = {}
        // param.classname = message.classname
        // param.id = message.id
        // param.Type = message.Type

        // if (ActorManager.getInstance().addObjectStorage(this.onRoleDisappear, this, param)) {
        //     return
        // }

        // this.onRoleDisappear(param)

        RpcLogic.G2C_Disappear(message.id, message.Type)

    }





    onRecvG2C_ROLE_NEW_ERRANTRY(dispatcher, message) {
        //TLog.Debug("GameWorldMessageHandler.onRecvG2C_ROLE_NEW_ERRANTRY")
        //TLog.Debug_r(message.recordList)
        //io.read()
        GuideSystem.getInstance().setGuideRecordList(message.recordList)
    }

    onRecvG2C_GLOBAL_LOGOUT_CENTER(dispatcher, message) {
        //return ConfirmFinishCrossServer()
    }

    // onRecvG2C_ROLE_DETAILED_INFO(dispatcher, message) {
    //     let checkType = message.checkType
    //     let data: any = {}
    //     //TLog.Debug("GameWorldMessageHandler.onRecvG2C_ROLE_DETAILED_INFO", checkType)
    //     if (checkType == opSelectPlayerInfo.BattleTypeInfo) {
    //         data.petList = message.petList
    //         ActorManager.getInstance().SetPalyInfo(message.petList)
    //         /*
    //             }else if(checkType == opSelectPlayerInfo.FairyInfo ){
    //                 data.fairyInfo = message.fairyInfo		
    //                 FriendSystem.getInstance().setPlayerFairyInfo(message.fairyInfo[1])
    //         */
    //     } else if (checkType == opSelectPlayerInfo.WingInfo) {
    //         data.defendInfo = message.defendInfo
    //         FriendSystem.getInstance().setPlayerWingInfo(message.defendInfo)
    //         /*
    //             }else if(checkType == opSelectPlayerInfo.RideInfo ){
    //                 data.rideInfo = message.rideInfo	
    //                 FriendSystem.getInstance().setPlayerRideInfo(message.rideInfo)
    //         */
    //     } else if (checkType == opSelectPlayerInfo.PlayerInfo) {
    //         data.yulingLevel = message.yulingLevel
    //         data.yulingInfo = message.yulingInfo
    //         FriendSystem.getInstance().setYulingInfo(message.yulingLevel, message.yulingInfo)
    //     }
    //     FireEvent(EventDefine.CHECK_PLAYER_INFO_UPDATE, PlayerDetailedInfoEvent.newObj(checkType, data))
    // }

    // onRecvG2C_ROLE_MAP_NPC_LIST(dispatcher, message) {
    //     FireEvent(EventDefine.MAP_SERVER_NPC_LIST, NetMessageEvent.newObj(message))
    // }

    onRecvG2C_ROLE_BAN_STATUS( dispatcher, message){
        if(message.banStatus == 1 ){
            let t:IDialogCallback = {
                onDialogCallback(result:boolean, userData):void{
                    //WngMrg.getInstance().hideWindow("LoginLogoFrame")
                    
                    LoginSystem.getInstance().setQuickLogin(false)
                    LoginSystem.getInstance().setAutoLogin(false)
                    
                    LoginSystem.getInstance().changeLoginPrecedure()
                }
            }
            MsgSystem.confirmDialog_YES(  Localize_cns("BAN_LOGIN_CONFIRM"),t)
        }else if(message.banStatus == 2 ){
            MsgSystem.confirmDialog_YES(  Localize_cns("BAN_CHAT_CONFIRM") )
        }
    }



    // onObjectAdd(param: any) {
    //     let npcObject = ActorManager.getInstance().createNpc(param.info)
    // }

    // onRoleAdd(param: any) {
    //     if (MapSystem.getInstance().getMapId() == param.mapId) {
    //         let playerObject = ActorManager.getInstance().createPlayer(param.info, param.cellx, param.celly)
    //     }

    // }


    // onRoleDisappear(param: any) {

    //     if (param.Type == objectType.OBJECT_TYPE_PLAYER) {
    //         ActorManager.getInstance().deletePlayer(param.id)
    //     } else if (param.Type == objectType.OBJECT_TYPE_GAMEOBJECT) {
    //         ActorManager.getInstance().deleteNpc(param.id)
    //     }
    // }

    // onRoleChange(param: any) {
    //     if (MapSystem.getInstance().getMapId() == param.mapId) {
    //         ActorManager.getInstance().updatePlayer(param.info.id, param.info)
    //     }
    // }


}