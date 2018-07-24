/*
作者:
    liuziming
	
创建时间:
   2013.10.25(周五)

意图:
   

公共接口:
   
*/

ImportType(EventDefine)

let GuideListenDefine: any = {}
//提示框类型
GuideListenDefine.FIELD_FRAME_TIPS_LEFT_TOP = "LeftTop"						//左上角箭头提示框
GuideListenDefine.FIELD_FRAME_TIPS_LEFT_BOTTOM = "LeftBottom"				//左下角箭头提示框
GuideListenDefine.FIELD_FRAME_TIPS_RIGHT_TOP = "RightTop"					//右上角箭头提示框
GuideListenDefine.FIELD_FRAME_TIPS_RIGHT_BOTTOM = "RightBottom"				//右下角箭头提示框

//箭头框类型

GuideListenDefine.FIELD_FRAME_ARROW_LEFT = "Left"						//左边（向右）箭头提示框
GuideListenDefine.FIELD_FRAME_ARROW_RIGHT = "Right"						//右边箭头提示框
GuideListenDefine.FIELD_FRAME_ARROW_TOP = "Top"							//上边角箭头提示框
GuideListenDefine.FIELD_FRAME_ARROW_BOTTOM = "Bottom"					//下边角箭头提示框


//执行的动作类型
GuideListenDefine.FIELD_ACTION_CLEARACTION = "ClearAction"						//清除指定动作										["index"]={GuideIndex,ActionIndex},
GuideListenDefine.FIELD_ACTION_TIPS = "Tips"									//一般文本框											["window"]="path/paths" /null ,["offsetX"]= , ["offsetY"]= , 如果有window 则xy 是相对于window的偏移量 否则是屏幕坐标 ["tipsContent"]= "文本",  ["content_w"]=文本最大宽度 ,["windox_pos"]="LeftTop" 相对位置  ["type"]=框体图片名， 为null不需要框体
GuideListenDefine.FIELD_ACTION_DRAMATIPS = "DramaTips"							//对话文本框											["window_y"]=, ["rightType"]=true/false, ["content"]=文本, ["font"]=字体 ,["headID"]=null/enterID ,["guideType"]=0/1
GuideListenDefine.FIELD_ACTION_ANIMTIPS = "AnimTips"							//动画提示												["pointingInfo"]={["windowName"]:"path/...",["dir"]:"down"},["window"]="path/paths", ["offsetX"]=偏移xy ,["offsetY"]=没有window时是固定坐标 ,["animbox"]=动画名字 写于ui_anim.csv,["adp"]="window"/"this"/null,["windox_pos"]="center",["loop"]=true/false,["width"]=,["height"]="adp"不填时需要固定的动画长宽, ["guideType"]=0/1/2/3/4,["moveInfo"]= 动画相关信息{["target"]:,["targetPos"]:{x,y},["shakePos"]={x,y},["moveTime"]=,["speed"]={x,y},["animLoop"]=,["startTime"]=,["endTime"]=,["backPlay"]=} 
GuideListenDefine.FIELD_ACTION_MOVABLEANIMTIPS = "MovableAnimTips"						//可移动动画提示											
GuideListenDefine.FIELD_ACTION_RECORD = "Record"								//记录文本数据										["key"]="string", ["value"]="string" 
GuideListenDefine.FIELD_ACTION_DELETE_LISTEN = "DeleteListen"					//删除点击监听										["listen"]=20000
GuideListenDefine.FIELD_ADD_LISTEN = "AddListen"							//插入监听												["listen"]=20000
GuideListenDefine.FIELD_CREAT_MASK = "CreatMask"							//创建遮罩											["link"]=""		参照TaskDefine.lua
GuideListenDefine.FIELD_DO_EVENT = "DoEvent"								//执行动作											["listen"]=20000
GuideListenDefine.FIELD_SHOW_BTN_TIPS = "ShowBtnTips"						//根据事件红点提示
GuideListenDefine.FIELD_HIDE_BTN_TIPS = "HideBtnTips"						//根据事件红点提示
//GuideListenDefine.FIELD_SHOW_TIPS																		= "ShowTips"							//手动显示红点提示包括弹出活动框
//GuideListenDefine.FIELD_SHOW_TIPS_NO_ACTIVITY												= "ShowTipsNoActivity"		//手动显示红点提示
//GuideListenDefine.FIELD_DO_EVENT_BY_PARAM														= "doEventByParam"				//根据参数执行
GuideListenDefine.FIELD_ACTION_CLOCKER = "Clocker"								//计时器（延时）									["delay"]=1000         单位:毫秒  这个动作后所有动作自动延迟再执行
GuideListenDefine.FIELD_ACTION_PICKSEX = "PickSex"								//
GuideListenDefine.FIELD_ACTION_SHOUGROWFRAME = "ShowGrowFrame"					//打开指定界面（GrowFrame）				["entryId"] = 7656(自己)/伙伴entry
GuideListenDefine.FIELD_ACTION_REFRESHPETFRAME = "RefreshPetFrame"				//刷新伙伴界面（显示指定对象）		["entryId"] = 0(自己)/伙伴entry
GuideListenDefine.FIELD_PLAY_MOVIE = "PlayMovie"							//播放电影 ["movieName"]="testing"
GuideListenDefine.FIELD_SHOW_CHANNELTIPS = "Channel"								//频道消息 ["channel"]=22(公告),	["content"]="",["shengdi"]=true/false
GuideListenDefine.FIELD_ACTION_REFRESHPETTAB = "RefreshPetTab"					//刷新伙伴界面（显示指定对象）		["tab"] = "RoleTab"/"WakeTab"/"BreakTab"/"LinkTab", ["entryId"] = 0(自己)/伙伴entry

//监控条件
GuideListenDefine.FIELD_CONDITION_HERO_LEVEL = "HeroLevel"					//要求主角等级符合要求才会加入监听, "HeroLevel" = {"<:", 11}
GuideListenDefine.FIELD_CONDITION_TASK = "TaskId"						//要求当前任务的ID，"TaskId" = taskId

//监控事件
GuideListenDefine.FIELD_LISTEN_EVENT_ACCEPTTASK = "AcceptTask"				//监听接受任务事件，["taskId"] = 41000（填写在ListenParam中）
GuideListenDefine.FIELD_LISTEN_EVENT_CLICKBUTTON = "ClickButton"				//监听按钮事件，["buttonName"] = "skill"/["index"]=1									"ClickButton"和"UIShow"这两个只有加入listenList列表里才会检测
GuideListenDefine.FIELD_LISTEN_EVENT_SHORTCLICKBUTTON = "ShortButton",			//监听按钮事件，["buttonName"] : "skill"/["index"]:1
// GuideListenDefine.FIELD_LISTEN_EVENT_CLICKBUTTONU = "ClickButtonU"				//监听按钮事件，["buttonName"] = "skill"/["index"]=1									"ClickButton"和"UIShow"这两个只有加入listenList列表里才会检测
// GuideListenDefine.FIELD_LISTEN_EVENT_CLICKBUTTOND = "ClickButtonD"				//监听按钮事件，["buttonName"] = "skill"/["index"]=1									"ClickButton"和"UIShow"这两个只有加入listenList列表里才会检测
GuideListenDefine.FIELD_LISTEN_EVENT_LISTENUISHOW = "UIShow"						//监听窗口打开事件，["windowName"] = "xxx"			这个跟WindowOpen最大的区别是只有加入监控的引导索引才能检测，而不是任何时候打开界面都检测
GuideListenDefine.FIELD_LISTEN_EVENT_LISTENUICTRLSHOW = "UICtrlShow"				//监听窗口打开事件，["windowName"] = "xxx"			这个跟WindowOpen最大的区别是只有加入监控的引导索引才能检测，而不是任何时候打开界面都检测
GuideListenDefine.FIELD_LISTEN_EVENT_LISTENUICTRLHIDE = "UICtrlHide"				//监听窗口打开事件，["windowName"] = "xxx"			这个跟WindowOpen最大的区别是只有加入监控的引导索引才能检测，而不是任何时候打开界面都检测
GuideListenDefine.FIELD_LISTEN_EVENT_LEVELUPDATE = "LevelUpdate"				//监听主角升级事件，["level"] = 11/["range"] = 10(最小值，当前等级大于或等于都会返回真)
GuideListenDefine.FIELD_LISTEN_EVENT_RECORD = "CheckRecord"				//监听记录情况，["record"] = {key, value}
GuideListenDefine.FIELD_LISTEN_EVENT_LOGIN = "LogIn"							//监听登陆事件，
GuideListenDefine.FIELD_LISTEN_EVENT_WINDOW_CLOSE = "WindowClose"				//监听关闭指定窗口事件["window"]=""  只有被监听的才会执行
GuideListenDefine.FIELD_LISTEN_EVENT_BEFORE_WINDOW_CLOSE = "BeforeWindowClose"				//监听关闭指定窗口事件["window"]=""  只有被监听的才会执行
//GuideListenDefine.FIELD_LISTEN_EVENT_PET_UPLEVEL = "PetUpLevel"				//监听宠物升级事件["level"]={"op", value1, value2}
GuideListenDefine.FIELD_LISTEN_EVENT_GET_MESSAGE = "GetMessage"					//监听接收到网络消息 
GuideListenDefine.FIELD_LISTEN_EVENT_WND_UPDATE_BTN_TIPS = "WindowBtnTips"					//监听接收到网络消息
//GuideListenDefine.FIELD_LISTEN_EVENT_PET_EMBATTLE_STATE = "PetEmbattleState"						//监听部下上阵
//GuideListenDefine.FIELD_LISTEN_EVENT_WINDOW_ANIMATION_STATE = "wndAnimationState"			//窗口动画
//GuideListenDefine.FIELD_LISTEN_EVENT_COMBAT_FIGHT_RP_FULL = "CombatFightRPFull"			//可发招，[skillId]=, 
//GuideListenDefine.FIELD_LISTEN_EVENT_PET_QUEUE_UPDATE = "petQueueUpdate"			//窗口动画
//GuideListenDefine.FIELD_LISTEN_EVENT_PET_AWAKE = "PetAwake"					//伙伴觉醒，["entryId"]=, ["level"]=
//GuideListenDefine.FIELD_LISTEN_EVENT_PROFESSION_UNLOCK = "UnlockProfession"	//换职业，
//GuideListenDefine.FIELD_LISTEN_EVENT_COMBAT_END = "CombatEnd"					//监听结束战斗事件
//GuideListenDefine.FIELD_LISTEN_EVENT_GROW_SOON_FINISH = "GrowSoon"					//监听快速完成养成事件
//GuideListenDefine.FIELD_LISTEN_EVENT_QUICK_RECRUIT_PRIZE = "QuickRecruit"			//监听快速招募事件	["entryId"] = 18000
//GuideListenDefine.FIELD_LISTEN_EVENT_MOVIE_END = "MovieEnd"					//监听电影结束事件 ["movieName"]="testing"
//GuideListenDefine.FIELD_LISTEN_EVENT_ROBBER_HANG_FIGHT = "HangFight"					//监听圣地挂机战斗开始事件
GuideListenDefine.FIELD_LISTEN_EVENT_ACTIVATE_BUTTON = "ActivateButton"		//监听新功能开启 ["funcIndex"]="fengmo"
GuideListenDefine.FIELD_LISTEN_EVENT_CAMPAIGN_FIRST_PASS = "CampFirstPass"			//监听关卡首次通关 ["campaignId"]=1001
GuideListenDefine.FIELD_LISTEN_EVENT_TASK_SUCCEED = "SucceedTask"				//监听完成任务事件，["taskId"] = 41000（填写在ListenParam中）
GuideListenDefine.FIELD_LISTEN_EVENT_TASK_FINISH = "FinishTask"				//监听完成任务事件，["taskId"] = 41000（填写在ListenParam中）

let GuideListenerType: any = {
    ["AcceptTask"]: EventDefine.TASK_ACCPET,
    ["LevelUpdate"]: EventDefine.HERO_PER_LEVELUP,
    ["ClickButton"]: EventDefine.ROOTWINDOW_MOUSE_UP,
    ["ShortButton"]: EventDefine.ROOTWINDOW_MOUSE_CLICK,
    ["UIShow"]: EventDefine.UI_SHOW,
    ["UICtrlShow"]: EventDefine.UI_CTRL_SHOW,
    ["UICtrlHide"]: EventDefine.UI_CTRL_HIDE,
    ["LogIn"]: EventDefine.LOGIN_LOGO_HIDE_FINISH,
    ["BeforeWindowClose"]: EventDefine.UI_HIDE_START,
    ["WindowClose"]: EventDefine.UI_HIDE,
    ["PetUpLevel"]: EventDefine.PET_UPDATE,
    ["GetMessage"]: EventDefine.GET_MESSAGE,
    // ["WindowBtnTips"]: EventDefine.WND_UPDATE_BTN_TIPS,
    ["PetEmbattleState"]: EventDefine.PET_EMBATTLE_STATE,
    // ["wndAnimationState"]: EventDefine.WINDOW_ANIMATION_STATE,
    ["CombatFightRPFull"]: EventDefine.COMBAT_FIGHT_RP_FULL,
    ["petQueueUpdate"]: EventDefine.CAMPAIGN_DYNAMIC_ARRAY_UPDATE,//EventDefine.CAMPAIGN_ARRAY_UPDATE,
    // ["PetAwake"]: EventDefine.PET_AWAKE,
    //["UnlockProfession"]: EventDefine.VOCATIONER_UNLOCK,
    ["CombatEnd"]: EventDefine.COMBAT_END,
    // ["GrowSoon"]: EventDefine.GROW_SOON_FINISH,
    // ["QuickRecruit"]: EventDefine.PET_QUICK_RECRUIT_PRIZE,
    ["MovieEnd"]: EventDefine.MOVIE_END,
    // ["HangFight"]: EventDefine.ROBBER_HANG_FIGHT_BEGIN,
    ["ActivateButton"]: EventDefine.GUIDE_ACTIVATE_BUTTON,
    ["CampFirstPass"]: EventDefine.CAMPAIGN_FINISH,
    ["SucceedTask"]: EventDefine.TASK_COMMIT_FINISH,
    ["FinishTask"]: EventDefine.TASK_FINISH,
}

let GuideListenerEvent: any = {
    //[GuideListenDefine.FIELD_LISTEN_EVENT_PET_QUEUE_UPDATE]: true,					//"petQueueUpdate",
    //[GuideListenDefine.FIELD_LISTEN_EVENT_PET_UPLEVEL]: true,								//"PetUpLevel",
    //[GuideListenDefine.FIELD_LISTEN_EVENT_COMBAT_FIGHT_RP_FULL]: true,			//"CombatFightRPFull",
    //[GuideListenDefine.FIELD_LISTEN_EVENT_WINDOW_ANIMATION_STATE]: true,		//"wndAnimationState",
    //[GuideListenDefine.FIELD_LISTEN_EVENT_PET_EMBATTLE_STATE]: true,				//"PetEmbattleState",
    //[GuideListenDefine.FIELD_LISTEN_EVENT_CLICKBUTTOND]: true,							//"ClickButtonD",
    [GuideListenDefine.FIELD_LISTEN_EVENT_SHORTCLICKBUTTON]: true,							//"ShortButton",
    [GuideListenDefine.FIELD_LISTEN_EVENT_CLICKBUTTON]: true,								//"ClickButton",
    [GuideListenDefine.FIELD_LISTEN_EVENT_LISTENUISHOW]: true,							//"UIShow",
    [GuideListenDefine.FIELD_LISTEN_EVENT_LISTENUICTRLSHOW]: true,					//"UICtrlShow",
    [GuideListenDefine.FIELD_LISTEN_EVENT_LISTENUICTRLHIDE]: true,					//"UICtrlHide",
    [GuideListenDefine.FIELD_LISTEN_EVENT_WINDOW_CLOSE]: true,							//"WindowClose",
    [GuideListenDefine.FIELD_LISTEN_EVENT_BEFORE_WINDOW_CLOSE]: true,							//"BeforeWindowClose",
    //[GuideListenDefine.FIELD_LISTEN_EVENT_PET_AWAKE]: true,								//"PetAwake",
    //[GuideListenDefine.FIELD_LISTEN_EVENT_PROFESSION_UNLOCK]: true,				//"UnlockProfession",
    //[GuideListenDefine.FIELD_LISTEN_EVENT_COMBAT_END]: true,								//"CombatEnd",
    //[GuideListenDefine.FIELD_LISTEN_EVENT_GROW_SOON_FINISH]: true,					//"GrowSoon",
    //[GuideListenDefine.FIELD_LISTEN_EVENT_QUICK_RECRUIT_PRIZE]: true,			//"QuickRecruit"
    //[GuideListenDefine.FIELD_LISTEN_EVENT_MOVIE_END]: true,								//"MovieEnd"
    //[GuideListenDefine.FIELD_LISTEN_EVENT_ROBBER_HANG_FIGHT]: true,				//"HangFight"
}
//

//GuideFuncConfig = readCSV("data\\config\\Task\\auxiliary\\open_function_opera.csv")
//GuideSchoolIntr = readCSV("data\\config\\Task\\school_introduce.csv")

//由于加载顺序问题，图片索引放到这里定义


ImportType(GuideFuncDefine)

let GuideRedTipsIndexList: any = {
    //90001,90002,90003
}

//以等级作为开启条件的功能
// let LevelFuncOpenLimit: any = {
//     [GuideFuncDefine.FIELD_FUNC_GUANKAZUDUI]: 10,							//关卡
//     [GuideFuncDefine.FIELD_FUNC_HANGHAI]: 40,             //航海
//     [GuideFuncDefine.FIELD_FUNC_TIANTI]: 20,							//天梯
//     [GuideFuncDefine.FIELD_FUNC_RONGJIE]: 25,							//溶解
// }
let FuncOpenConditionType: any = {
    LEVEL: 1,                       //等级
    CAMPAIGN: 2,                    //关卡
    TASK: 3,                        //任务
}

//小功能限制（不足够条件作为功能类处理的判断），等级、关卡等类别的检查条件
//小功能限制（不足够条件作为功能类处理的判断），等级、关卡等类别的检查条件
let ClientFuncLimit: any = {
    ["sdxiaohaotili"]: {																					//圣地设置是否消耗行动力
        ["guanka"]: [1048],										//
        ["dengji"]: 0,
    },

    ["fakeChat"]: {																							//机器人聊天
        ["guanka"]: [1012],										//
        ["dengji"]: 0,
    },

    ["zhaojisuipian"]: {																					//召集石碎片（普罗米修斯）
        ["guanka"]: [1030],										//
        ["dengji"]: 0,
    },
    ["guankazhuanzhi"]: {																					//单人挑战在关卡1049~1072时，且尚未通关地宫15层弹出下面提示
        ["guanka"]: [1054],										//
        ["dengji"]: 0,
    },
    ["guankadengji"]: {																					//角色等级没有大于等于该关卡等级5级以上，就谈组队和雇佣提示
        ["guanka"]: [1072],										//
        ["dengji"]: 0,
    },
    ["shengdixiaolv"]: {																					//圣地效率显示（血盟、关卡效率）
        ["guanka"]: [1012],									//
        ["dengji"]: 0,
    },
    ["shengdijiang"]: {																				//圣地挂机奖励界面自动出现
        ["guanka"]: [1012],									//
        ["dengji"]: 0,
    },
    ["tuozhuangbei"]: {																					//脱下装备（可以替换）
        ["guanka"]: [1009],									//
        ["dengji"]: 0,
    },
    ["jingongtu"]: {																							//是否用简略版进攻图界面
        ["guanka"]: [1036],									//
        ["dengji"]: 0,
    },
    ["zhuanzhi"]: {																							//转职（职业树）
        ["guanka"]: [1001],									//
        ["dengji"]: 0,
    },

    ["xinshoubaoxiang"]: {																				//新手宝箱（假）
        ["guanka"] : [],											//大于21级不参与
        ["dengji"] : opNewBieBoxConfig.maxPlrLevel + 1,
    },

    ["fengmo"]: {																				//新手宝箱（假）
        ["guanka"] : [],											//封魔等级大于等于30
        ["dengji"] : 30,
    },
}

function CheckClientFuncLimit(index): [boolean, string, any] {
    let flag = true
    let str = ""
    let elem = null

    if (ClientFuncLimit[index]) {
        let v = ClientFuncLimit[index]
        let guankaList = v["guanka"] || []

        for (let _ = 0; _ < guankaList.length; _++) {
            let camId = guankaList[_]

            if (CampaignSystem.getInstance().isCampaignPass(camId) == false) {
                flag = false

                let name = CampaignSystem.getInstance().getCampaignName(camId)
                str = String.format(Localize_cns("GUIDE_TXT7"), name)
                break
            }
        }

        if (flag == true) {
            let level = GetHeroProperty("level") || 0
            let needLevel = (v["dengji"] || 0)
            flag = level >= needLevel
            if(flag == false){
               str = String.format(Localize_cns("GUIDE_TXT9"), needLevel) 
            }
        }
        elem = v
    } else {
        return [false, str, null]
    }

    return [flag, str, elem]
}


let _guideLocalIndex = 0
function GenLocalGuideIndex() {
    _guideLocalIndex = _guideLocalIndex - 1
    return _guideLocalIndex
}