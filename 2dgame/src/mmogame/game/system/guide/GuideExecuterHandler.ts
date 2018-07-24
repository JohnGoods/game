/*
作者:
    liuziming
	
创建时间：
   2014.2.19(周三)

意图：
   

公共接口：
   
*/

ImportType(GuideListenDefine)


module GuideActionSpace {

    export let executeActionHandler: any = {}


    function clearAction(param, _guideIndex, _actionIndex, args) {
        //TLog.Debug("clearAction", guideIndex, actionIndex)

        //TLog.Debug("clearAction", guideIndex, this.windowList[guideIndex])
        //TLog.Debug_r(this.guideConfig)
        //TLog.Debug_r(param["index"])

        let guideIndex = param["index"][0]
        let actionIndex = param["index"][1]

        if (!this.guideConfig[guideIndex] || !this.guideConfig[guideIndex][actionIndex]) {
            TLog.Error("this.guideConfig[%d][%d] is null ", guideIndex, actionIndex)
            return
        }


        if (this.markWindowList[guideIndex] && this.markWindowList[guideIndex][actionIndex]) {

            delete this.markWindowList[guideIndex][actionIndex]
            if (size_t(this.markWindowList[guideIndex]) == 0)
                delete this.markWindowList[guideIndex]

            if (this.windowList[guideIndex] && this.windowList[guideIndex][actionIndex]) {
                let window: BaseWnd = this.windowList[guideIndex][actionIndex]
                delete this.windowList[guideIndex][actionIndex]
                if (size_t(this.windowList[guideIndex]) == 0)
                    delete this.windowList[guideIndex]

                window.hideWnd()
                window.deleteObj()
            }
            //window.unLoadWnd()
        }

        this.killWindowTimer(guideIndex, actionIndex)

    }
    executeActionHandler[GuideListenDefine.FIELD_ACTION_CLEARACTION] = clearAction



    function showTipsFrame(param, guideIndex, actionIndex, args) {
        //TLog.Debug("executeActionHandler: showTipsFrame!")

        let loadCallback = function (parentWnd: BaseWnd) {

            if (this.isMarkInsertWindow(guideIndex, actionIndex) == false)
                return;
            // if (parentWnd.isVisible() == false)
            //     return;

            let window = null
            if (param["window"]) {

                window = IGlobal.guiManager.getChildFromPath(param["window"])
                if (!window) {
                    TLog.Error("showTipsFrame Error  %s can't find ", param["window"])
                    return
                } else {
                    //TLog.Debug("executeActionHandler: showCreatMask!",window,param["window"], "x",window.convertFrameSelfToSpaceXY(0,0).x,"y",window.convertFrameSelfToSpaceXY(0,0).y)
                }
            }

            if (param["windowInfo"]) {
                window = UI_GetWindowByInfo(param["windowInfo"])
                if (!window) {
                    TLog.Error("windowInfo Error  window can't find ")
                    return
                }
            }

            let frame = WngMrg.getInstance().createWindow("GuideTipsFrame")
            if (!this.saveGuideTipsFrameIndex) {
                this.saveGuideTipsFrameIndex = 1
            } else {
                this.saveGuideTipsFrameIndex = this.saveGuideTipsFrameIndex + 1
            }
            frame.setRootFrameName("GuideTipsFrame" + this.saveGuideTipsFrameIndex)
            this.insertWindow(frame, param, guideIndex, actionIndex)
            TLog.Debug("executeActionHandler: showTipsFrame!", param["dir"])
            frame.setTipsData(param, window)
            frame.showWnd()
        }
        this.markInsertWindow(guideIndex, actionIndex)
        this.loadWndAndcallback(param, loadCallback)

        //io.read()
    }
    executeActionHandler[GuideListenDefine.FIELD_ACTION_TIPS] = showTipsFrame

    function showDramaTipsFrame(param, guideIndex, actionIndex, args) {	//对话文本框
        //TLog.Debug("showDramaTipsFrame")
        let frame = WngMrg.getInstance().getWindow("DramaTipsFrame")
        //if(! this.saveDramaTipsFrameIndex ){
        //	this.saveDramaTipsFrameIndex = 1
        //}else{
        // this.saveDramaTipsFrameIndex = this.saveDramaTipsFrameIndex+1
        //}
        //frame.setRootFrameName("DramaTipsFrame"+this.saveDramaTipsFrameIndex)	
        frame.setTipsData(param)

        //TLog.Debug("showDramaTipsFrame")
        //io.read()
        if (!param["clickClose"]) {
            //TLog.Debug("showDramaTipsFrame",param["clickClose"])
            //param["stayTime"]=20000
        }
        this.insertWindow(frame, param, guideIndex, actionIndex)
        frame.showWnd()
    }
    executeActionHandler[GuideListenDefine.FIELD_ACTION_DRAMATIPS] = showDramaTipsFrame

    function showAnimTipsFrame(param, guideIndex, actionIndex, args) {
        //TLog.Debug("showAnimTipsFrame",guideIndex,actionIndex,args)
        //TLog.Debug_r(param)


        let loadCallback = function (parentWnd: BaseWnd) {
            if (this.isMarkInsertWindow(guideIndex, actionIndex) == false)
                return;
            // if (parentWnd.isVisible() == false)
            //     return;

            let window = null
            if (param["window"]) {
                window = IGlobal.guiManager.getChildFromPath(param["window"])
                if (!window) {
                    if(parentWnd.isVisible()){
                        TLog.Error("showAnimTipsFrame Error  %s can't find ", param["window"])
                    }
                    return
                } else {
                    //TLog.Debug("executeActionHandler: showCreatMask!",window,param["window"], "x",window.convertFrameSelfToSpaceXY(0,0).x,"y",window.convertFrameSelfToSpaceXY(0,0).y)
                }
            }

            if (param["windowInfo"]) {
                window = UI_GetWindowByInfo(param["windowInfo"])
                if (!window) {
                    TLog.Error("windowInfo Error  window can't find ")
                    return
                }
            }
            //if(StateManager.getInstance().GetCurrentStateType() == state_type.COMBAT_BASE_STATE && ! CombatSystem.getInstance().get_cur_actor_type() ){
            //	return
            //}	
            let frame = WngMrg.getInstance().createWindow("AnimTipsFrame")
            if (!this.saveAnimTipsFrameIndex) {
                this.saveAnimTipsFrameIndex = 1
            } else {
                this.saveAnimTipsFrameIndex = this.saveAnimTipsFrameIndex + 1
            }
            frame.setRootFrameName("AnimTipsFrame" + this.saveAnimTipsFrameIndex)
            frame.setTipsData(param, window, parentWnd)
            frame.showWnd()
            if (!param["clickClose"]) {
                this.insertWindow(frame, param, guideIndex, actionIndex)
            }

            if (param["chat"]) {
                let wnd = WngMrg.getInstance().getWindow("MainFrame")
                if (wnd.isVisible()) {
                    let list = []
                    for (let _ in GameConfig.GuideChatConfig) {
                        table_insert(list, tonumber(_))
                    }
                    if (size_t(list) > 0) {
                        table_sort(list, function (a, b) {
                            return a - b
                        })
                        let randomNum = MathUtil.random(list[0], list[size_t(list) - 1])
                        if (GameConfig.GuideChatConfig[randomNum]) {
                            wnd.setChatContent(GameConfig.GuideChatConfig[randomNum].content)
                        }
                    }
                }
            }
        }

        this.markInsertWindow(guideIndex, actionIndex)
        this.loadWndAndcallback(param, loadCallback)



    }
    executeActionHandler[GuideListenDefine.FIELD_ACTION_ANIMTIPS] = showAnimTipsFrame


    //可移动的动画（手指）
    function showMovableAnimTipsFrame(param, guideIndex, actionIndex, args) {

        let loadCallback = function (parentWnd: BaseWnd) {
            if (this.isMarkInsertWindow(guideIndex, actionIndex) == false)
                return;
            // if (parentWnd.isVisible() == false)
            //     return;

            let window = null
            if (param["window"]) {
                window = IGlobal.guiManager.getChildFromPath(param["window"])
                if (!window) {
                    if(parentWnd.isVisible()){
                        TLog.Error("showMovableAnimTipsFrame Error  %s can't find ", param["window"])
                    }
                    return
                } else {
                    //TLog.Debug("executeActionHandler: showCreatMask!",window,param["window"], "x",window.convertFrameSelfToSpaceXY(0,0).x,"y",window.convertFrameSelfToSpaceXY(0,0).y)
                }
            }

            let frame = WngMrg.getInstance().createWindow("MovableAnimTipsFrame")
            if (!this.saveAnimTipsFrameIndex) {
                this.saveAnimTipsFrameIndex = 1
            } else {
                this.saveAnimTipsFrameIndex = this.saveAnimTipsFrameIndex + 1
            }
            frame.setRootFrameName("MovableAnimTipsFrame" + this.saveAnimTipsFrameIndex)
            frame.setTipsData(param, window, parentWnd)
            frame.showWnd()
            this.insertWindow(frame, param, guideIndex, actionIndex)
        }

        this.markInsertWindow(guideIndex, actionIndex)
        this.loadWndAndcallback(param, loadCallback, true) //如果界面已经加载，则马上回调。否则下一帧回调会找不到控件（用于从一个已关闭的界面到另外一个界面的移动）

    }
    executeActionHandler[GuideListenDefine.FIELD_ACTION_MOVABLEANIMTIPS] = showMovableAnimTipsFrame

    function recordString(param, guideIndex, actionIndex, args) {

        let callback = function () {
            this.setGuideRecord(param["key"], param["value"], param["noSend"])
        }
        DelayEvecuteFunc(0, callback, this)
    }
    executeActionHandler[GuideListenDefine.FIELD_ACTION_RECORD] = recordString

    function deleteListen(param, guideIndex, actionIndex, args) {
        this.removeListener(param["listen"])
        // TLog.Debug("deleteListen", param["listen"])
        // //io.read()

        // //特殊处理子选项的监听也要移除 在战斗那块容易发生未处理情况
        // let removeListener = tonumber(param["listen"])
        // if (removeListener < 10000) {
        //     let config = this.getGuideConfig()
        //     let state = config[removeListener]
        //     for (let i in state) {
        //         let v = state[i]

        //         if (v.Action == GuideListenDefine.FIELD_ADD_LISTEN) {
        //             let addListenParam = v.Action["listen"]
        //             this.removeListener(addListenParam)
        //         }
        //     }
        // }
    }
    executeActionHandler[GuideListenDefine.FIELD_ACTION_DELETE_LISTEN] = deleteListen

    function addListen(param, guideIndex, actionIndex, args) {
        this.addListener(param["listen"])
        TLog.Debug("addListen", param["listen"])
        //io.read()
    }
    executeActionHandler[GuideListenDefine.FIELD_ADD_LISTEN] = addListen

    function showCreatMask(param, guideIndex, actionIndex, args) {
        //TLog.Debug("showCreatMask",guideIndex,actionIndex,args)
        //TLog.Debug_r(param)

        let loadCallback = function (parentWnd: BaseWnd) {

            if (this.isMarkInsertWindow(guideIndex, actionIndex) == false)
                return;
            // if (parentWnd.isVisible() == false)
            //     return;

            let rootWndName = null

            let window = null
            if (param["window"]) {
                let wndList = splitString(param["window"], '/')
                rootWndName = wndList[0]
                window = IGlobal.guiManager.getChildFromPath(param["window"])
                if (!window) {
                    TLog.Error("showCreatMask Error  %s can't find ", param["window"])
                    return
                } else {
                    //TLog.Debug("executeActionHandler: showCreatMask!",window,param["window"], "x",window.convertFrameSelfToSpaceXY(0,0).x,"y",window.convertFrameSelfToSpaceXY(0,0).y)
                }
            }

            if (param["windowInfo"]) {
                //具体界面需求
                rootWndName = param["windowInfo"]["rootWindow"]
                window = UI_GetWindowByInfo(param["windowInfo"])
                if (!window) {
                    TLog.Error("windowInfo Error  window can't find ")
                    return
                }
            }
            //param["stayTime"]=20000	
            if (rootWndName) {
                //TLog.Debug("~~~~~~~~~~~~~~~~ auto close ~~",rootWndName)
                //WngMrg.getInstance().hideOtherWndExceptKeyWnd(rootWndName)
            }

            let frame = WngMrg.getInstance().createWindow("GuideMaskFrame")
            if (!this.saveGuideMaskFrameIndex) {
                this.saveGuideMaskFrameIndex = 1
            } else {
                this.saveGuideMaskFrameIndex = this.saveGuideMaskFrameIndex + 1
            }
            frame.setRootFrameName("GuideMaskFrame" + this.saveGuideMaskFrameIndex)
            frame.setTipsData(param, window, rootWndName, parentWnd)
            frame.showWnd()
            this.insertWindow(frame, param, guideIndex, actionIndex)
            this.clearWindowModel(guideIndex)

        }
        this.markInsertWindow(guideIndex, actionIndex)
        this.loadWndAndcallback(param, loadCallback)
        //TLog.Debug("~~~~~~~~~~~~~~~~~")

    }
    executeActionHandler[GuideListenDefine.FIELD_CREAT_MASK] = showCreatMask


    function doEvent(param, guideIndex, actionIndex, args) {
        //TLog.Debug("doEvent",guideIndex,actionIndex,args)
        let listen = param["listen"]
        this.doGuideByIndex(listen)
    }
    executeActionHandler[GuideListenDefine.FIELD_DO_EVENT] = doEvent

    //function showButtonTips( param, guideIndex, actionIndex, args){	
    //	//TLog.Debug("showButtonTips",guideIndex,actionIndex)  
    //  if(param["buttonName"] ){
    //  	//TLog.Debug("showButtonTips 11111111111111111")  
    //		let buttonName=param["buttonName"]	
    //		this.showBtnList(buttonName)
    //		return
    //	}else if(param["index"] ){
    //		return
    //	}
    //	
    //	if(param["check"] ){  ////- 自查
    //		if(this.isFuncOpen(GuideFuncDefine.FIELD_FUNC_JINGJICHANG,false) ){			
    //			let message = GetMessage(opCodes.C2G_EXCITE_DATA)
    //			message.exciteType="singlejjc"
    //			SendGameMessage(message)	
    //		}
    //		return
    //	}	
    //		
    //	if(param["getReturn"] && checkReturnArgs ){
    //		//TLog.Debug("showButtonTips 33333333333333333")  
    //		let clearList = checkReturnArgs.args.clearBtnList
    //		for(let i in clearList){
    //			let btn = clearList[i]
    //	 
    //			this.clearBtnTips(btn)
    //		}	
    //		
    //		let addList = checkReturnArgs.args.addBtnList
    //		for(let i in addList){
    //			let btn = addList[i]
    //	
    //			this.clearBtnTips(btn) 
    //			this.showBtnList(btn)
    //		}		
    //		return
    //	}
    //	if(param["getMessage"] ){
    //		if(this.getGuideRecord("guide") == "finish" ){
    //			if(checkReturnArgs.args.classname == "Message_G2C_EMAIL_RECV" ){
    //				let ret = this.checkEMail()		
    //				if(ret ){
    //					this.clearBtnTips(ret)			
    //					this.showBtnList(ret)				
    //				}
    //			}
    //		}
    //	}
    //}
    //executeActionHandler[GuideListenDefine.FIELD_SHOW_BTN_TIPS] = showButtonTips
    //
    //function showTips( param, guideIndex, actionIndex, args,checkReturnArgs){	
    //	TLog.Debug("showTips  ~~~~~~~~~~~~~~!!!!!!!!!!!!!!")
    //	//自查	
    //	this.curCheckTopLevel = GetHeroProperty("level")
    //				
    //	ret = this.checkEquipment()
    //	if(ret ){
    //		this.clearBtnTips(ret)
    //		this.showBtnList(ret)
    //	}
    //	this.clearBtnTipsByIndex(8)
    //	ret = this.checkEquipUnidentified()
    //	for(let _i in ret){
    //			let _v = ret[_i]
    //	
    //		this.clearBtnTips(_v)
    //		this.showBtnList(_v)
    //	}
    //	
    //	if(! this.registerHeroInfpUpdate  ){
    //		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateHereInfo, this)
    //		this.registerHeroInfpUpdate = true		
    //	}	
    //}
    //executeActionHandler[GuideListenDefine.FIELD_SHOW_TIPS] = showTips
    //
    //function showTipsNoActivity( param, guideIndex, actionIndex, args,checkReturnArgs){	
    //	let ret = this.checkEquipment()
    //	if(ret ){
    //		this.clearBtnTips(ret)
    //		this.showBtnList(ret)
    //	}
    //	this.clearBtnTipsByIndex(8)
    //	ret = this.checkEquipUnidentified()
    //	for(let _i in ret){
    //			let _v = ret[_i]
    //			
    //		this.showBtnList(_v)
    //	}
    //	
    //	if(! this.registerHeroInfpUpdate  ){
    //		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateHereInfo, this)
    //		this.registerHeroInfpUpdate = true		
    //	}	
    //}
    //executeActionHandler[GuideListenDefine.FIELD_SHOW_TIPS_NO_ACTIVITY] = showTipsNoActivity
    //
    //////////////////////////////////////////////////////////////////////
    //
    ////-根据参数执行事件
    //function doEventByParamFunc( param, guideIndex, actionIndex, args,checkReturnArgs){	
    //	//TLog.Debug("doEventByParamFunc")
    //	if(param["showTips"] ){
    //		let openFuncConfig:any = {
    //			["jjc"]				:	GuideFuncDefine.FIELD_FUNC_JINGJICHANG,
    //			["skytower"]	:	GuideFuncDefine.FIELD_FUNC_TIANKONGZHITA,
    //			["zbcj"]		:	GuideFuncDefine.FIELD_FUNC_HUODONG,
    //		}
    //		let showList = param["showTips"]
    //		for(let _i in showList){
    //			let _v = showList[_i]
    //	
    //			TLog.Debug("doEventByParamFunc showTips",_v)			
    //			if(this.isFuncOpen(openFuncConfig[_v],false) ){
    //				this.clearBtnTips(_v)
    //				this.showBtnList(_v)
    //			}else{
    //				TLog.Debug("doEventByParamFunc ",_v,"err ",openFuncConfig[_v]," func is ! open")	
    //			}			
    //		}
    //	}else if(param["setPetShow"] ){
    //		let setEntry = param["setPetShow"]
    //		
    //	}else if(param["openfunc"] ){	
    //		if(! FightSystem.getInstance().isFight() ){
    //			let wnd = WngMrg.getInstance().getWindow("ActivateButtonFrame")
    //			wnd.showActBtnFrame(param["openfunc"])
    //		}
    //	}else if(param["setfunc"] ){		
    //		if(GuideSystem.getInstance().isFuncOpen(param["setfunc"], true) == false ){
    //			SetRoleFunctionSetting(RoleFunctionSetting[param["setfunc"]])
    //		}
    //	}
    //}
    //executeActionHandler[GuideListenDefine.FIELD_DO_EVENT_BY_PARAM] = doEventByParamFunc

    function showPickSexFrame(param, guideIndex, actionIndex, args) {
        WngMrg.getInstance().showWindow("PickSexFrame")
    }
    executeActionHandler[GuideListenDefine.FIELD_ACTION_PICKSEX] = showPickSexFrame

    function showGrowFrame(param, guideIndex, actionIndex, args) {
        // let wnd = WngMrg.getInstance().getWindow("GrowFrame")
        // let entryid = growOptions.playerOwnerId
        // if (param["entryId"] != null){
        //     entryid = param["entryId"]
        // }
        // wnd.showEntryId(entryid)
    }
    executeActionHandler[GuideListenDefine.FIELD_ACTION_SHOUGROWFRAME] = showGrowFrame


    function refreshPetFrame(param, guideIndex, actionIndex, args) {
        let wnd = WngMrg.getInstance().getWindow("PetFrame")
        if (wnd.isVisible() == false) {
            return
        }
        //wnd.showTabEntryId(PetFrame.RoleTab, param["entryId"] || 0)
    }
    executeActionHandler[GuideListenDefine.FIELD_ACTION_REFRESHPETFRAME] = refreshPetFrame


    function showBtnTips(param, guideIndex, actionIndex, args) {
        let type = param["type"]
        GuideFuncSystem.getInstance().showDynamicTips(type)
    }
    executeActionHandler[GuideListenDefine.FIELD_SHOW_BTN_TIPS] = showBtnTips

    function hideBtnTips(param, guideIndex, actionIndex, args) {
        let type = param["type"]
        GuideFuncSystem.getInstance().hideDynamicTips(type)
    }
    executeActionHandler[GuideListenDefine.FIELD_HIDE_BTN_TIPS] = hideBtnTips

    //modify:movie
    // function playMovie(param, guideIndex, actionIndex, args) {
    //     //TLog.Debug("doEvent",guideIndex,actionIndex,args)
    //     let movieName = param["movieName"]
    //     MovieSystem.getInstance().beginPlay(movieName)
    // }
    // executeActionHandler[GuideListenDefine.FIELD_PLAY_MOVIE] = playMovie

    function channelTips(param, guideIndex, actionIndex, args) {
        //TLog.Debug("doEvent",guideIndex,actionIndex,args)
        if (param["shengdi"] == true) {
            let name1 = RandomRobotName()
            let name2 = RandomRobotName()
            MsgSystem.selectShowHandle(22, String.format(Localize_cns("GUIDE_TXT8"), name1, name2))
        } else {
            MsgSystem.selectShowHandle(param["channel"] || 2, param["content"] || "")
        }
    }
    executeActionHandler[GuideListenDefine.FIELD_SHOW_CHANNELTIPS] = channelTips

    function refreshPetTab(param, guideIndex, actionIndex, args, checkReturnArgs) {
        let wnd = WngMrg.getInstance().getWindow("PetFrame")
        if (wnd.isVisible() == false) {
            return
        }
        //let tabIndex = PetFrame[(param["tab"] || "RoleTab")] || 0
        //wnd.showTabEntryId(tabIndex, param["entryId"] || 0)
    }
    executeActionHandler[GuideListenDefine.FIELD_ACTION_REFRESHPETTAB] = refreshPetTab
}