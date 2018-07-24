/*
作者:
    liuziming
	
创建时间：
   2013.10.25(周五)

意图：
		新手指引系统
   

公共接口：
   filterEntry(){			//简单过滤不必要的监控条目
   insertFirstGuide(){				//特殊处理，（第一次登陆以接受第一个任务为标识）
*/
// let GameConfig.GuideConfig:any = {}
// let eventObj = null
// let FIRSTGUIDE = 20000
//require("bit")


class GuideSystem extends BaseSystem {

    funcState: string;
    openedFuncList: any;


    mAddListener: any[]
    mRemoveListener: any[]
    mListenEventIndex: number[]
    mListenLock: boolean;
    mListenEventLockList: any[];


    windowList: any;
    markWindowList:any;//异步处理标志


    guideConfig: any;
    mCurrentListener: any[]
    mTimerList: any;
    mGuideRecord: any;
    //curArgs: any;
    //executingIndex: number
    //sameProcess: boolean

    levelOpenFuncList: any;

    bReFightLogin: boolean;
    mEvent2IndexListMap: any;


    public initObj(...args: any[]): void {

        this.onClear()


    }

    destory() {

    }

    prepareResource(workQueue) {

        GameConfig.initGuideSystemCsv(workQueue)
        workQueue.addWorkUnit(CallbackWorkUnit.newObj(this.initLevelOpenFuncConfig, this));

    }



    onClear() {


        if (this.mEvent2IndexListMap) {
            for (let eventName in this.mEvent2IndexListMap) {
                UnRegisterEvent(eventName, this.onHandleCenterEvent, this)
            }
        }

        this.mEvent2IndexListMap = {}
        this.mListenEventLockList = [];

        if (this.windowList) {
            for (let gIndex in this.windowList) {
                let v = this.windowList[gIndex]
                for (let aIndex in v) {
                    let window: BaseWnd = this.windowList[gIndex][aIndex]
                    window.hideWnd()
                    window.deleteObj()
                }
            }
        }
        this.windowList = {}
        this.markWindowList = {}
        this.guideConfig = {}
        this.mCurrentListener = []
        this.mTimerList = {}
        //this.mListenEventIndex = {}

        this.mGuideRecord = {}
        //this.curGuideList = {}
        this.bReFightLogin = false

        //this.curArgs = {}
        //this.executingIndex = -1
        this.funcState = null
        this.openedFuncList = {}

        this.mAddListener = []
        this.mRemoveListener = []
        this.mListenEventIndex = []
        this.mListenLock = false



    }

    //////////////////////////////////////////////////////////////////////////////
    filterEntry() {								//简单过滤不必要的监控条目
        this.guideConfig = {}
        if (GAME_MODE != GAME_NORMAL) {
            return
        }

        for (let guideIndex in GameConfig.GuideConfig) {
            let v = GameConfig.GuideConfig[guideIndex]

            //if(guideIndex != FIRSTGUIDE ){
            this.guideConfig[guideIndex] = v

            let actionNode = v[1]
            if (actionNode.ListenCondition.HeroLevel) {
                //TLog.Debug_r(v[1].ListenCondition.HeroLevel)

                let flag = commonCmp(v[1].ListenCondition.HeroLevel, GetHeroProperty("level"))   //根据等级过滤指引
                if (!flag) {
                    delete this.guideConfig[guideIndex]
                    //TLog.Debug("flag null ")
                }
                //TLog.Debug("flag",flag)
                //io.read()
            }

            if (this.guideConfig[guideIndex] && GuideListenerEvent[actionNode.ListenEvent]) {  //只有被记录下来的按钮点击事件和窗口显示才处理
                if (!table_isExist(this.mListenEventIndex, actionNode.GuideIndex)) {
                    JsUtil.arrayInstert(this.mListenEventIndex, actionNode.GuideIndex)
                }
            }


        }
        this.registerEvent()


    }


    //////////////////////////////////////////////////////////////////////////////

    registerEvent() {

        //**注意，测试防错代码
        if (this.isFinishGuide() == true) {
            return
        }

        //this.clearRegisterEvent()
        for (let index in this.guideConfig) {
            let v = this.guideConfig[index]
            let actionNode = v[1]

            let eventName = GuideListenerType[actionNode.ListenEvent]

            // let needRegisterEvent = true
            let guideIndex = actionNode.GuideIndex
            let actionIndex = actionNode.ActionIndex

            if (eventName != null) {

                let guideIndexList: number[] = this.mEvent2IndexListMap[eventName] || []
                if (guideIndexList.length == 0) {
                    RegisterEvent(eventName, this.onHandleCenterEvent, this)
                }
                guideIndexList.push(guideIndex)
                this.mEvent2IndexListMap[eventName] = guideIndexList;
            }
        }
    }


    onHandleCenterEvent(args) {
        //TLog.Assert(this.mListenLock == false)
        if (this.mListenLock) {
            let info: any = {}
            info.eventName = GetEventSet().getCurrentEventName(); //当前分派消息的事件名
            info.args = args;
            this.mListenEventLockList.push(info)
            return
        }
        //处理当前的
        let eventName = GetEventSet().getCurrentEventName(); //当前分派消息的事件名
        this.onHandleCenterEventImp(eventName, args);


        while (this.mListenEventLockList.length > 0) {
            let info = this.mListenEventLockList.shift()
            this.onHandleCenterEventImp(info.eventname, info.args);
        }
    }


    onHandleCenterEventImp(eventName: string, args) {
        let guideIndexList: number[] = this.mEvent2IndexListMap[eventName]
        if (guideIndexList == null || guideIndexList.length == 0)
            return;

        //处理下一个事件时候处理，注意onHandleCenterEvent可能同一帧调用多次
        if (this.mAddListener.length > 0) {
            for (let _ in this.mAddListener) {
                let v = this.mAddListener[_]
                if (!table_isExist(this.mCurrentListener, v)) {
                    JsUtil.arrayInstert(this.mCurrentListener, v)
                }
            }
            this.mAddListener = []
        }

        if (this.mRemoveListener.length > 0) {
            for (let _ in this.mRemoveListener) {
                let v = this.mRemoveListener[_]

                table_remove(this.mCurrentListener, v)
            }
            this.mRemoveListener = []
        }

        this.mListenLock = true
        for (let i = 0; i < guideIndexList.length; i++) {
            let guideIndex = guideIndexList[i]
            this.onHandleGuideIndex(guideIndex, args)
        }
        this.mListenLock = false
    }

    onHandleGuideIndex(index, args) {

        if (table_isExist(this.mListenEventIndex, index)) {							//只有被记录下来的按钮点击事件才处理
            if (table_isExist(this.mRemoveListener, index) == false && table_isExist(this.mCurrentListener, index)) {

                if (this.checkEvent(GameConfig.GuideConfig[index][1].ListenEvent, GameConfig.GuideConfig[index][1].ListenParam, args)) {
                    TLog.Debug("the checker result is: true", index)

                    this.carryOut(GameConfig.GuideConfig[index], index, args)
                    this.removeListener(index)
                } else {
                    TLog.Debug("the checker result is: false %d", index)
                }
            }
        } else {
            let actionNode = GameConfig.GuideConfig[index][1]
            let flag = this.checkEvent(actionNode.ListenEvent, actionNode.ListenParam, args)
            if (flag == true) {
                TLog.Debug("the checker result is: true %d", index)
                this.carryOut(GameConfig.GuideConfig[index], index, args)
            }
            TLog.Debug("the checker result is: false %d", index)
        }

    }


    carryOutArray(actionList: any[], index, args) {
        //TLog.Debug("GuideSystem.carryOut",index)
        //TLog.Debug_r(actionList)
        //io.read()

        let isSetClock = -1
        let actionSecList = []
        //this.executingIndex = index


        let length = size_t(actionList)


        for (let k = 0; k < actionList.length; k++) {
            let v = actionList[k]

            if (isSetClock == -1) {
                // if (GAME_DEBUG) {
                //     TLog.Debug(index, k, v.Action)
                // }
                if (v.Action == "Clocker") {
                    isSetClock = k
                    for (let i = k + 1; i < actionList.length; i++) {
                        JsUtil.arrayInstert(actionSecList, actionList[i])
                    }
                    this.setClocker(actionSecList, v.ActionParam.delay, index, args)
                } 
                // else if (v.ListenEvent == GuideListenDefine.FIELD_LISTEN_EVENT_LOGIN && this.bReFightLogin == true) {				//登录事件的先CLOCKER一帧，再检查是否战斗中，因为登录和重链战斗在同一帧
                //     for (let i = 0; i < actionList.length; i++) {
                //         let aList = table_copy(actionList[i])
                //         if (i == 0) {
                //             aList.ListenEvent = ""
                //         }

                //         JsUtil.arrayInstert(actionSecList, aList)
                //     }

                //     //等战斗开始
                //     let fightAction = function (args) {
                //         UnRegisterEvent(EventDefine.COMBAT_BEGIN, fightAction, this)
                //         IGlobal.guiManager.setInputEnable(true)

                //         //战斗状况下战斗结束再执行
                //         function delayFight() {
                //             this.carryOutArray(actionSecList, index, args)
                //         }
                //         if (FightSystem.getInstance().isFight()) {
                //             return FightSystem.getInstance().addEndFightHandler(delayFight, this)
                //         } else {
                //             return delayFight()
                //         }
                //     }
                //     RegisterEvent(EventDefine.COMBAT_BEGIN, fightAction, this)
                //     IGlobal.guiManager.setInputEnable(false)

                //     isSetClock = k
                // } 
                else {
                    this.executeAction(v.Action, v.ActionParam, index, v.ActionIndex, args)
                }
            }
        }

        let send = true
        for (let _i in GuideRedTipsIndexList) {
            let _v = GuideRedTipsIndexList[_i]

            if (index == _v) {
                send = false
            }
        }
        if (send) {
            let message = GetMessage(opCodes.C2G_ROLE_OPER_NODE)
            message.guideIndex = index
            SendGameMessage(message)
        }
        //this.executingIndex = -1

        //this.executingIndex = -1
    }

    carryOut(actionConfig, index, args) {

        let actionList = []
        let len = size_t(actionConfig)
        for (let i = 1; i <= len; i++) {
            let v = actionConfig[i]
            TLog.Assert(v != null)
            actionList.push(v)
        }

        this.carryOutArray(actionList, index, args)
    }

    setClocker(actionSecList, SPAN, index, args) {

        let timerId = 1
        function onVpTickEvent(delay) {

            KillTimer(timerId)

            //clocker过程中不响应点击事件
            IGlobal.guiManager.setInputEnable(true)
            this.carryOutArray(actionSecList, index, args)

        }

        //clocker过程中不响应点击事件
        IGlobal.guiManager.setInputEnable(false)
        timerId = SetTimer(onVpTickEvent, this, SPAN)
    }


    setLoginReFightFlag(flag: boolean) {
        this.bReFightLogin = flag
    }


    isFuncOpen(func, defaultState) {
        //TLog.Debug("GuideSystem.isFuncOpen",func)
        if (!func) {
            return defaultState || false
        }

        let defaultOpen = [
            
        ]

        if (table_isExist(defaultOpen, func)) {
            //TLog.Debug("1")
            return true
        }

        let errantry = this.funcState
        if (!errantry) {
            errantry = GetHeroProperty("funcState") || ""
        }

        defaultState = defaultState || false
        let isFunc = false

        if (GameConfig.FuncDefineConfig[func]) {
            isFunc = true
            let config = GameConfig.FuncDefineConfig[func]
            if (this.openedFuncList[func]) {
                return true
            } else {
                if (StringUtil.getBit(errantry, config.funcOrder) == "1") {
                    //TLog.Debug("2",errantry)
                    return true
                }
            }
            
        }

        if (!isFunc) {
            //TLog.Debug("2",isFunc)
            return defaultState
        }
        
        return false
    }

    opendFunc(func) {                                           //外部不能直接调用这个接口
        if (!GuideFuncDefine[func] || !GameConfig.FuncDefineConfig[func]) {
            return
        }
        if (this.isFuncOpen(func, true) == true) {
            return
        }

        let config = GameConfig.FuncDefineConfig[func]
        if (config.funcOrder > 0) {
            SetRoleFunctionSetting(GameConfig.FuncDefineConfig[func].funcOrder)
        } else {
            this.openedFuncList[func] = true
        }

        FireEvent(EventDefine.GUIDE_ACTIVATE_BUTTON, GuideActivateButtonEvent.newObj(func))
    }

    setFuncState(errantry) {
        if (this.funcState == errantry) {
            return
        }

        this.funcState = errantry
        return FireEvent(EventDefine.GUIDE_FUNC_LIST_UPDATE, null)
    }

    getFuncState(): string {
        let funcState = this.funcState

        if (!funcState) {
            funcState = GetHeroProperty("funcState") || ""
        }

        return funcState
    }

    //更新依据等级开放的功能
    updateHeroFunc(init?: boolean) {
        let list = []                               //需要记录在hero信息里
        let flag = false
        for (let k in GameConfig.FuncDefineConfig) {
            let v = GameConfig.FuncDefineConfig[k]
            
            if (this.isFuncOpen(v.funcName, false) == false) {
                if (v.openType == FuncOpenConditionType.LEVEL) {                            //等级开启
                    if (v.openParam[0] <= GetHeroProperty("level")) {
                        this.openedFuncList[k] = true
                        flag = true

                        if (!init) {
                           FireEvent(EventDefine.GUIDE_ACTIVATE_BUTTON, GuideActivateButtonEvent.newObj(k))
                        }
                    }
                } else if (v.openType == FuncOpenConditionType.CAMPAIGN) {                  //关止开启
                    if (CampaignSystem.getInstance().isCampaignPass(v.openParam[0]) == true) {
                        this.openedFuncList[k] = true
                        flag = true

                        if (!init) {
                            FireEvent(EventDefine.GUIDE_ACTIVATE_BUTTON, GuideActivateButtonEvent.newObj(k))
                        }
                    }
                } else if (v.openType == FuncOpenConditionType.TASK) {                      //任务开启
                    if (TaskSystem.getInstance().isTaskHasFinished(v.openParam[0]) == true) {
                        this.openedFuncList[k] = true
                        flag = true

                        if (!init) {
                            FireEvent(EventDefine.GUIDE_ACTIVATE_BUTTON, GuideActivateButtonEvent.newObj(k))
                        }
                    }
                } else {
                    JsUtil.arrayInstert(list, k)
                }
            
            }
        }

        if (flag == true) {
            FireEvent(EventDefine.GUIDE_FUNC_LIST_UPDATE, null)
        } else {
            for (let _ in list) {
                let funcIndex = list[_]

                SetRoleFunctionSetting(GameConfig.FuncDefineConfig[funcIndex].funcOrder)
                if (!init) {
                    FireEvent(EventDefine.GUIDE_ACTIVATE_BUTTON, GuideActivateButtonEvent.newObj(funcIndex))
                }
            }
        }
    }



    // onAnimBoxDesotry(args, flag) {
    //     // if (!flag) {
    //     //     tolua.cast(args, "gui::GUIEvent")
    //     // }

    //     for (let guideIndex in this.windowList) {
    //         let v = this.windowList[guideIndex]

    //         if (type(v) == "object") {
    //             for (let actionIndex in v) {
    //                 let w = v[actionIndex]

    //                 if (w == args.window) {

    //                     this.clearAction(guideIndex, actionIndex)
    //                     this.killWindowTimer(guideIndex, actionIndex)
    //                     break
    //                 }
    //             }
    //         }
    //     }
    // }

    setGuideRecord(key, value, nosend?) {
        //TLog.Debug("GuideSystem.setGuideRecord" ,key,value)
        this.mGuideRecord[key] = value
        //Config.getInstance().setRoleSetting("string", key, value)
        //这里发送给服务器
        if (!nosend) {
            let message = GetMessage(opCodes.C2G_ROLE_NEWBIE_SAVE_RECORD)
            message.record = { [key]: value }
            SendGameMessage(message)
        }
    }

    setGuideRecordList(list) {
        this.mGuideRecord = {}
        for (let k in list) {
            let v = list[k]

            this.mGuideRecord[tostring(k)] = v
        }
        if (GAME_DEBUG) {
            //this.mGuideRecord["20000"]="3"
            //this.mGuideRecord["guideReadFinish"]="NULL"
            TLog.Debug(this.mGuideRecord)
        }
    }

    getGuideRecord(key) {
        //TLog.Debug_r(this.mGuideRecord)
        //TLog.Debug("GuideSystem.getGuideRecord",key,this.mGuideRecord[key])
        if (!this.mGuideRecord[key]) {
            return "NULL"
        }

        return this.mGuideRecord[key]
    }

    //////////////////////////////////////////////////////////////////////////////////////


    killWindowTimer(guideIndex, actionIndex) {
        if (this.mTimerList[guideIndex] && this.mTimerList[guideIndex][actionIndex]) {
            let timeId = this.mTimerList[guideIndex][actionIndex]
            KillTimer(timeId)
            delete this.mTimerList[guideIndex][actionIndex]
        }
    }

    setWindowTimer(window, stayTime, args, deleteListen) {

        let guideIndex = args.index[0]
        let actionIndex = args.index[1]

        function onVpTickEvent(this, delayTime) {
            this.clearAction(guideIndex, actionIndex)
            this.killWindowTimer(guideIndex, actionIndex)
            table_remove(this.mCurrentListener, deleteListen)
        }
        this.mTimerList[guideIndex] = this.mTimerList[guideIndex] || {}
        this.mTimerList[guideIndex][actionIndex] = SetTimer(onVpTickEvent, this, stayTime)
    }

    insertWindow(window, param, guideIndex, actionIndex) {
        //TLog.Debug("GuideSystem.insertWindow",guideIndex,actionIndex)
        //TLog.Debug_r(this.windowList)
        if (this.windowList[guideIndex] && this.windowList[guideIndex][actionIndex]) {
            //return
            //TLog.Debug("1111111")

            this.clearAction(guideIndex, actionIndex)
        }
        if (!this.windowList[guideIndex]) {
            this.windowList[guideIndex] = {}
        }
        //TLog.Debug("2222222", param["autoDelete"])
        this.windowList[guideIndex][actionIndex] = window
        if (param["listenIndex"]) {
            this.addListener(param["listenIndex"])
        }


        //所有指引都会在10s 后删除 
        if (param["stayTime"]) {													//单位：毫秒
            this.setWindowTimer(window, param["stayTime"], { index: [guideIndex, actionIndex] }, param["deleteListen"] || null)
        }
    }

    markInsertWindow( guideIndex, actionIndex) {
        if (!this.markWindowList[guideIndex]) {
            this.markWindowList[guideIndex] = {}
        }
        this.markWindowList[guideIndex][actionIndex] = true
    }

    isMarkInsertWindow( guideIndex, actionIndex) {
        if(this.markWindowList[guideIndex] && this.markWindowList[guideIndex][actionIndex]){
            return true
        }
        return false;
    }

    addListener(listenIndex) {
        if (this.mListenLock == false) {
            if (!table_isExist(this.mCurrentListener, listenIndex)) {
                table_insert(this.mCurrentListener, listenIndex)
            }
        } else {
            table_remove(this.mRemoveListener, listenIndex)
            if (!table_isExist(this.mAddListener, listenIndex)) {
                table_insert(this.mAddListener, listenIndex)
            }
        }
    }

    removeListener(listenIndex) {
        //TLog.Debug("GuideSystem.removeListener",this.listenLock)
        if (this.mListenLock == false) {
            table_remove(this.mCurrentListener, listenIndex)
        } else {
            table_remove(this.mAddListener, listenIndex)
            if (!table_isExist(this.mRemoveListener, listenIndex)) {
                table_insert(this.mRemoveListener, listenIndex)
            }
        }

    }

    doGuideByIndex(index) {
        //TLog.Debug("GuideSystem.doGuideByIndex",index)
        if (GameConfig.GuideConfig[index]) {
            this.carryOut(GameConfig.GuideConfig[index], index, null)
        }
    }


    clearWindowModel(index) {
        //TLog.Debug("GuideSystem.clearWindowModel",index)
        let clearIndex = null
        for (let _i in this.windowList) {
            let i = tonumber(_i)
            let v = this.windowList[i]

            //TLog.Debug("aa",i,this.windowList.length)
            if (index != i && size_t(this.windowList[i]) > 0) {
                for (let j in GameConfig.GuideConfig[i]) {
                    let v = GameConfig.GuideConfig[i][j]

                    //TLog.Debug("window",i,j,v.Action )
                    if (v.Action == "CreatMask") {
                        //if(window.frame.name()=="GuideMaskFrame" ){
                        clearIndex = i
                        break
                    }
                }
            }
        }
        if (clearIndex != null) {
            //TLog.Debug("clear index",clearIndex)

            for (let i in this.windowList[clearIndex]) {
                let window = this.windowList[clearIndex][i]

                this.clearAction(clearIndex, i)
            }
        }
    }

    clearWindowAction() {
        let clearIndex = []
        for (let i in this.windowList) {
            let v = this.windowList[i]

            for (let j in GameConfig.GuideConfig[i]) {
                let v = GameConfig.GuideConfig[i][j]

                //TLog.Debug("window",i,j,v.Action )
                if (v.Action == "CreatMask") {							//有createMask动作的那一步引导的所有window相关的动作都清除
                    JsUtil.arrayInstert(clearIndex, i)
                    break
                }
            }
        }

        let list = []
        for (let _ in clearIndex) {
            let index = clearIndex[_]

            //TLog.Debug("clear index",clearIndex)
            for (let i in this.windowList[index]) {
                let window = this.windowList[index][i]

                JsUtil.arrayInstert(list, [index, i])
            }
        }
        for (let _ in list) {
            let param = list[_]
            this.clearAction(param[0], param[1])

        }
    }


    isCanClientAutoUI() {
        if (this.isFinishGuideClient() == false) {
            return false
        }

        if(CampaignSystem.getInstance().isCampaignPass(1013) == false ){
            return false
        }

        //当前最高关卡是否刚好功能关卡
        let list = CampaignSystem.getInstance().getFinishedCampaignList()
        let campaignId = 0
        for (let _campId in list) {
            let campId = tonumber(_campId)
            //let _ = list[campId]
            if (campaignId < campId) {
                campaignId = campId
            }
        }
        if (GameConfig.CampaignConfig[campaignId]) {
            let funcIndex = GameConfig.CampaignConfig[campaignId].funcIndex
            if (funcIndex && funcIndex != "" && GameConfig.FuncInfoConfig[funcIndex]) {
                return false
            }
        }

        return true
    }




    isFinishGuide() {
        if (!GAME_GUIDE) {
            return true
        } else {
            return this.getGuideRecord("guideReadFinish") == "finish"
        }
    }

    isFinishGuideAwake() {//检查是否完成觉醒(进阶)引导
        if (this.isFinishGuide() == true) {
            return true
        } else {
            return this.getGuideRecord("30101") == "1"
        }
    }

    isFinishGuideEvent() {
        //  if(this.isFinishGuide() == true){
        //     return true
        // }else{
        //     return this.getGuideRecord("30701") == "1"
        // }
        return true
    }

    isFinishGuideClient() {
        if (this.isFinishGuide() == true) {
            return true
        } else {
            return CampaignSystem.getInstance().isCampaignPass(1013)
        }
    }

    isFinishGuideDefend() {
        // if (this.isFinishGuide() == true) {
        //     return true
        // } else {
        //     return this.getGuideRecord("30701") == "1"
        // }
        return true
    }


    isFinishGuideEnhance() {
        // if (this.isFinishGuide() == true) {
        //     return true
        // } else {
        //     return this.getGuideRecord("30401") == "1"
        // }
        return true
    }

    isFinishGuideUnlockVocation() {
       //if(this.isFinishGuide() == true ){
        //	return true
        //}else{
        //	return this.getGuideRecord("30009") == "1" || this.getGuideRecord("20800") == "1"
        //}
        return true
    }

    isFinishGuideChampion() {
        // if (this.isFinishGuide() == true) {
        //     return true
        // } else {
        //     return this.getGuideRecord("30501") == "1"
        // }
        return true
    }


    isFinishGuideSeven() {		//检查是否完成七日活动
        return true;
    }


    isDoingGuideRobber() {
        // if (this.isFinishGuide() == true) {
        //     return false
        // } else {
        //     return this.getGuideRecord("robber") == "1"
        // }
        return true
    }

    isFinishGuideGrow() {
        if (this.isFinishGuide() == true) {
            return true
        } else {
            return this.getGuideRecord("30100") == "1"
        }
    }

    fastFinishGuide() {
        this.setGuideRecord("guide", "finish")
        this.setGuideRecord("20500", "-1")
        this.setGuideRecord("guideReadFinish", "finish")
    }



    initLevelOpenFuncConfig() {
        this.levelOpenFuncList = {}
        for (let i in GameConfig.GuideConfig) {
            let v = GameConfig.GuideConfig[i]

            if (v[1]) {
                if (v[1].ListenEvent == "LevelUpdate" && v[1].Action == "doEventByParam" && v[1].ActionParam.openfunc) {
                    let level = v[1].ListenParam.level
                    let func = v[1].ActionParam.openfunc
                    this.levelOpenFuncList[level] = func
                }
            }
        }
    }

    getLevelOpenFunc(level) {
        if (this.levelOpenFuncList && this.levelOpenFuncList[level]) {
            return this.levelOpenFuncList[level]
        }
        return null
    }




    //对于动态加载遮罩，动画等，需要确保path是存在的
    private loadWndAndcallback(param: any, callback: Function, bCallbackNow?:boolean) {
        if(bCallbackNow == null)
            bCallbackNow = false

        let path = "";
        let wndName = ""


        if (param.window) {
            path = param.window
        } else if (param.windowInfo) {
            wndName = param.windowInfo.rootWindow
        } else if (param.pointingInfo) {
            path = param.pointingInfo["windowName"] || ""
        }

        let wnd: BaseWnd = null;
        if (path != "") {
            let pathlist: string[] = splitString(path, "/")
            wndName = pathlist[0]
        }

        wnd = WngMrg.getInstance().getWindow(wndName);
        TLog.Assert(wnd != null, "loadWndAndcallback wnd:%s == null", wndName)


        if (wnd.isLoadComplete()) {
            
            if(!bCallbackNow){
                DelayEvecuteFunc(0, callback, this, wnd)
            }else{
                callback.call(this, wnd)
            }
        } else {
            wnd.addLoadCallback(callback, this)
            wnd.loadWnd()
        }
    }





    ////////////////////////////////////////执行动作//////////////////////////////////////////////////////////
    executeAction(action, param, guideIndex, actionIndex, args) {
        TLog.Debug("GuideSystem.executeAction: ", guideIndex, actionIndex, action)
        //table_TLog.Debug(param)
        if (GuideActionSpace.executeActionHandler[action]) {
            let func: Function = GuideActionSpace.executeActionHandler[action]
            func.call(this, param, guideIndex, actionIndex, args)
        }
    }


    clearAction(_guideIndex, _actionIndex) {
        let guideIndex = tonumber(_guideIndex)
        let actionIndex = tonumber(_actionIndex)
        let param = { index: [guideIndex, actionIndex] }

        GuideActionSpace.executeActionHandler[GuideListenDefine.FIELD_ACTION_CLEARACTION].call(this, param)
    }



    ////////////////////////////////////////检查事件////////////////////////////////////////////////////////-
    checkEvent(event, param, args) {
        //TLog.Debug("GuideSystem.checkEvent:", event,args)

        //table_TLog.Debug(param)
        if (param == null || size_t(param) == 0) {															//参数为空时，默认触发
            return true
        }

        if (!this.checkRecord(param, args)) {																//检查动态记录
            TLog.Debug("the checkRecord is false! ")
            return false
        } else if (!this.checkState(param, args)) {														//检查角色身上的属性（调用任务系统内的相关接口）
            TLog.Debug("the checkState is false!")
            //TLog.Debug("111" )		
            return false
        } else if (!this.checkFinishTask(param, args)) {												//检查角色任务状态（调用任务系统内的相关接口）
            TLog.Debug("the checkFinishTask is false!")
            //TLog.Debug("111" )
            return false
        }
        //TLog.Debug("222"  ,event )	
        if (GuideCheckSpace.checkEventHandler[event]) {
            return GuideCheckSpace.checkEventHandler[event].call(this, param, args)
        } else {
            TLog.Debug("the check handler is null!		%s", event)
            return true
        }
    }

    checkRecord(param, args) {
        //TLog.Debug("GuideSystem.checkRecord")
        //TLog.Debug_r(param)

        if (!param["record"]) {
            return true
        }

        let flag = true
        for (let _ in param["record"]) {
            let v = param["record"][_]

            if (!GuideCheckSpace.checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_RECORD].call(this, v, args)) {
                flag = false
                break
            }
        }

        return flag
    }

    checkState(param, args) {
        if (!param["state"] || type(param["state"]) != "object") {
            return true
        }
        //TLog.Debug("checkState")
        return TaskChecker.getInstance().checkOpList(param["state"], true)
    }

    checkFinishTask(param, args) {
         let config = param["finishTask"]
        if (config == null) {
            return true
        }
       
       
        let taskId = config[0]
        let state = config[1]

        let task = TaskSystem.getInstance().getTask(taskId)
        if (task) {
            return  task.isFinish() == state
        }
        return false
    }

    //////////////////////////////////////////////////////////////////////////////




}