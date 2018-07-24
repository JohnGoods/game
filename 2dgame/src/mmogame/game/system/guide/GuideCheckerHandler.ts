// TypeScript file

/*
作者:
    liuziming
	
创建时间：
   2014.2.19(周三)

意图：
   

公共接口：
   
*/




ImportType(GuideListenDefine)

module GuideCheckSpace {

    export let checkEventHandler: any = {}

    function checkRecord(param, args) {
        let record = this.getGuideRecord(param[0])
        TLog.Debug("checkRecord", record, param[1], param[0])
        //io.read()

        return record == param[1]
    }
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_RECORD] = checkRecord



    function clickButtonImp(param, args:GameTouchEvent, eventName:string){
        let targetObj:egret.DisplayObject = null;
        if(param.buttonName != null){
            if(param.buttonName == args.touchEvent.target.name){
                targetObj = args.touchEvent.target
            }
        }else if(param.windowInfo != null){
            let infoWindow = UI_GetWindowByInfo(param.windowInfo)
            if(infoWindow){
                if( infoWindow.name == args.touchEvent.target.name){
                    targetObj = args.touchEvent.target
                }
            }
        }

        if(targetObj != null){

            if(!(targetObj instanceof eui.RadioButton)){
                TLog.Assert(targetObj.hasEventListener(eventName), "clickButtonImp eventName:%s not exist", eventName)
            }
            
            return true;
        }

        return false;
    }



    //clickButton检查touch_tap事件
    function clickButton(param, args:GameTouchEvent) {
        return clickButtonImp(param, args, egret.TouchEvent.TOUCH_TAP)
    }
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_CLICKBUTTON] = clickButton

    //shortButton检查gui.TouchEvent.TOUCH_SHORT事件
    function shortClickButton(param, args:GameTouchEvent) {
        return clickButtonImp(param, args, gui.TouchEvent.TOUCH_SHORT)
    }
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_SHORTCLICKBUTTON] = shortClickButton

   
    function uiShow(param, args) {
        //TLog.Debug("uiShow", args.window.classname, param.windowName)
        return args.window.classname == param.windowName
    }
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_LISTENUISHOW] = uiShow

    function uiCtrlShow(param, args) {
        TLog.Debug("uiCtrlShow", args.window.classname, param.windowName)
        return args.window.classname == param.windowName
    }
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_LISTENUICTRLSHOW] = uiCtrlShow


    function uiCtrlHide(param, args) {
        TLog.Debug("uiCtrlHide", args.window.classname, param.windowName)
        return args.window.classname == param.windowName
    }
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_LISTENUICTRLHIDE] = uiCtrlHide

    function acceptTask(param, args) {
        if (param.taskId == 0) {										//任务ID  0为无双ID
            return true
        }
        return args.taskId == param.taskId
    }
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_ACCEPTTASK] = acceptTask

    function heroLevelUp(param, args) {
        //if(param["skillLevel"] ){
        //	if(SkillSystem.getInstance().getMajorSkillSeries() ){
        //		return GetHeroProperty("level") > SkillSystem.getInstance().getMajorSkillSeries().getLevel() + param["skillLevel"]
        //	}else{
        //		return false
        //	}
        //}
        //TLog.Debug("heroLevelUp",param.range,param.level)
        let curLevel = args.level
        if (param.range) {
            return curLevel >= param.range
        } else {
            return curLevel == param.level
        }
    }
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_LEVELUPDATE] = heroLevelUp

    function heroLogIn(param, args) {
        return true
    }
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_LOGIN] = heroLogIn

    function closeWindow(param, args) {
        TLog.Debug("closeWindow", args.window.classname, param.window)
        return param["window"] == args.window.classname
    }
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_WINDOW_CLOSE] = closeWindow
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_BEFORE_WINDOW_CLOSE] = closeWindow

    // function petUpLevel(param, args) {
    //     let petEntry = param["entry"]
    //     let petInfo = PetSystem.getInstance().getPetInfoEntry(petEntry)
    //     if (!petInfo || petInfo.id != args.petId) {
    //         return false
    //     }

    //     let oldInfo = args.oldInfo
    //     let newInfo = args.newInfo

    //     if (param["level"]) {
    //         if (newInfo.level > oldInfo.level && param["level"] <= newInfo.level) {
    //             return true
    //         }
    //     }

    //     if (param["awakeLevel"]) {
    //         if (newInfo.activeLevel > oldInfo.activeLevel && newInfo.activeLevel >= param["awakeLevel"]) {
    //             return true
    //         }
    //     }

    //     if (param["checkEquip"]) {
    //         let equipIndex = param["checkEquip"]["equipType"]
    //         let equipEntry = param["checkEquip"]["equipEntry"]
    //         let curEquip = GetActorEquipByType(newInfo, equipIndex)
    //         if(curEquip && curEquip.getProperty("entry") == equipEntry ){
    //             return true
    //         }
    //     }
    //     return false
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_PET_UPLEVEL] = petUpLevel

    // function getMessage(param, args) {

    //     return true, args
    // }

    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_GET_MESSAGE] = getMessage

    // function wndUpdateBtnTips(param, args) {

    //     return true, args
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_WND_UPDATE_BTN_TIPS] = wndUpdateBtnTips


    // function checkPetEmbattleState(param, args) {
    //     TLog.Debug("checkPetIsGoInto", param["petID"], args.petEntry, args.petState, param["petState"])
    //     if (param["petID"] == args.petEntry) {
    //         return param["petState"] == args.petState
    //     } else {
    //         return false
    //     }
    //     //return param["petID"]==args.petEntry	
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_PET_EMBATTLE_STATE] = checkPetEmbattleState

    // function checkWindowAnimationState(param, args) {
    //     TLog.Debug("checkWindowAnimationState", param["windowName"], param["animationState"], args.windowName, args.animationState)
    //     if (param["windowName"] == args.windowName) {
    //         return param["animationState"] == args.animationState
    //     }
    //     return false
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_WINDOW_ANIMATION_STATE] = checkWindowAnimationState

    // function checkCombatFightRpFull(param, args) {
    //     TLog.Debug("checkCombatFightRpFull", param["btnName"])
    //     //TLog.Debug_r(args)
    //     let btnName = param["skillId"]
    //     return param["skillId"] == args.skillId
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_COMBAT_FIGHT_RP_FULL] = checkCombatFightRpFull

    // function checkPetQueueUpdate(param, args) {
    //     TLog.Debug("checkPetQueueUpdate", args.queueType, param["queueType"])
    //     return args.queueType == param["queueType"]
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_PET_QUEUE_UPDATE] = checkPetQueueUpdate

    // function checkPetAwake(param, args) {
    //     let petInfo = PetSystem.getInstance().getPetInfoEntry(param.entryId)
    //     if (petInfo == null) {
    //         return false;
    //     }

    //     return petInfo.awakeLevel > param.level
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_PET_AWAKE] = checkPetAwake


    // function checkProfessionUnlock(param, args) {

    //     let unlockList: number[] = ProfessionSystem.getInstance().getProfessionList()
    //     return unlockList.length > 0
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_PROFESSION_UNLOCK] = checkProfessionUnlock

    // function combatEnd(param, args) {
    //     return true
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_COMBAT_END] = combatEnd


    // function growSoonFinish(param, args) {
    //     return true
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_GROW_SOON_FINISH] = growSoonFinish

    // function quickRecruit(param, args) {
    //     let prizeList = args.prizeList
    //     let flag = false
    //     for (let _ in prizeList) {
    //         let v = prizeList[_]

    //         if (v[0] == (param["entryId"] || 0)) {
    //             flag = true
    //             break
    //         }
    //     }

    //     return flag
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_QUICK_RECRUIT_PRIZE] = quickRecruit

    
    function activateButton(this, param, args){
        return args.funcIndex == param["funcIndex"]
    }
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_ACTIVATE_BUTTON] = activateButton

    // function starHangFight(this, param, guideIndex, actionIndex, args){
    //     return true
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_ROBBER_HANG_FIGHT] = starHangFight

    function campFirstPass(this, param, args){
        return args.campaignId == (param["campaignId"] || 0)
    }
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_CAMPAIGN_FIRST_PASS] = campFirstPass

    function taskSucced(this, param, args){
        if(param.taskId == 0 ){										//任务ID  0为无双ID
            return true
        }
        
        return args.taskId == param.taskId
    }
    checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_TASK_SUCCEED] = taskSucced

    // function taskFinishNotCommit(this, param, args) {
    //     if(param.taskId == 0 ){										//任务ID  0为无双ID
    //         return true
    //     }

    //     return args.taskId == param.taskId
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_TASK_FINISH] = taskFinishNotCommit

    // function taskNotFinish(this, param, args) {
    //     if(param.taskId == 0 ){										//任务ID  0为无双ID
    //         return true
    //     }

    //     return args.taskId == param.taskId
    // }
    // checkEventHandler[GuideListenDefine.FIELD_LISTEN_EVENT_TASK_NOT_FINISH] = taskNotFinish
}