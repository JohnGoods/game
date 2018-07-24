////通用的事件参数定义
//流程参数
////////////////////////////////////////////////////////-

var EventArgs = core.EventArgs


class GameTouchEvent extends EventArgs {
    touchEvent: egret.TouchEvent;


    public initObj(...args: any[]): void {

    }

    public init(touchEvent: egret.TouchEvent) {
        this.touchEvent = touchEvent
        return this;
    }

}

class PrecedureEvent extends EventArgs {
    state: number;

    public initObj(...args: any[]): void {
        this.state = args[0]
    }


}

//连接事件
class TcpNetEvent extends EventArgs {
    code: number;
    dispatcher: MessageDispatcher
    public initObj(...args: any[]): void {
        this.code = args[0]
        this.dispatcher = args[1]
    }

}

// class GameServerTime extends EventArgs {
//     startTime: number;
//     public initObj(...args: any[]): void {
//         this.startTime = args[0]
//     }


// }
//加载事件
class LoadingEvent extends EventArgs {
    workQueue: WorkQueue
    public initObj(...args: any[]): void {
        this.workQueue = args[0] //工作队列
    }

    //加载更新事件
}

class LoadingUpdateEvent extends EventArgs {
    cur
    all
    public initObj(...args: any[]): void {
        this.cur = args[0] //当前加载数目
        this.all = args[1] //所有的加载数目
    }

    //状态事件
}

class StateEvent extends EventArgs {
    stateType: number;
    public initObj(...args: any[]): void {
        this.stateType = args[0]
    }

    //游戏结果事件
}

class GameResultEvent extends EventArgs {
    op: number;
    result: number;
    args: any;
    public initObj(...args: any[]): void {
        this.op = args[0]
        this.result = args[1]
        this.args = args[2]
    }

    //输入法事件
}

// class IMEEvent extends EventArgs {
//     public initObj(...args: any[]): void {
//         this.left = args[1]
//         this.top = args[2]
//         this.right = args[3]
//         this.bottom = args[4]
//     }

//     //客户端等待（待机）事件
// }

class ClientWaitEvent extends EventArgs {
    lockInput
    text
    bAlways
    public initObj(...args: any[]): void {
        this.lockInput = args[0] || false
        this.text = args[1]
        this.bAlways = args[2] || false
    }
    //Actor事件
    ////////////////////////////////////////////////////-
}

class ActorEvent extends EventArgs {
    actor: Actor;
    public initObj(...args: any[]): void {
        this.actor = args[0] //actor
    }

    //Actor获得点击的事件
}

class ActorFocusEvent extends ActorEvent {
    times: number;
    public initObj(...args: any[]): void {
        this.actor = args[0] //actor
        this.times = args[1]  //被点击了几次
    }


    //Actor获得点击的事件
}

class ActorClickListEvent extends ActorEvent {
    actorList
    public initObj(...args: any[]): void {
        this.actorList = args[0] //actorList
    }

}

class ActorUpdateEvent extends ActorEvent {
    oldProperty: any;
    newProperty: any;
    public initObj(...args: any[]): void {
        this.actor = args[0] //actor
        this.oldProperty = args[1]//原来的属性
        this.newProperty = args[2]//新的属性

    }

    //聊天事件
    ////////////////////////////////////////////////////-
}

class ChatRecvChannelMsgEvent extends EventArgs {
    packet: any;
    public initObj(...args: any[]): void {
        this.packet = args[0]
    }

}

// class ChatPreviewMsgUpdateEvent extends EventArgs {
//     questionIndex: number
//     public initObj(...args: any[]): void {
//         this.questionIndex = args[0]
//     }

// }

class QuestionContent extends EventArgs {
    questionIndex: number;
    public initObj(...args: any[]): void {
        this.questionIndex = args[0]
    }

}



// //所有魔导仪等级
// class AllMagicStoneLevel extends EventArgs {
//     allLevel
//     public initObj(...args: any[]): void {
//         this.allLevel = args[0]
//     }

//     //当前魔导仪等级
// }

// class CurrentMagicStoneLevel extends EventArgs {
//     currentLevel: number;
//     public initObj(...args: any[]): void {
//         this.currentLevel = args[0]
//     }

// }

// //登陆事件
// ////////////////////////////////////////////////////-
// //连接登陆服务器事件
// class LoginConnectEvent extends EventArgs {
//     result
//     dispatcher
//     public initObj(...args: any[]): void {
//         this.result = args[0]
//         this.dispatcher = args[1]
//     }

//     //连接状态参数
// }

// class LoginConnectStateEvent extends EventArgs {
//     state
//     dispatcher
//     public initObj(...args: any[]): void {
//         this.state = args[0]
//         this.dispatcher = args[1]
//     }

// }
// //连接服务器版本号参数
// class LoginConnectVersionEvent extends EventArgs {
//     version
//     dispatcher
//     public initObj(...args: any[]): void {
//         this.version = args[0]
//         this.dispatcher = args[1]
//     }

// }
// //创建角色事件
// class LoginCreateRoleEvent extends EventArgs {
//     RoleInfo
//     public initObj(...args: any[]): void {
//         this.RoleInfo = args[0]
//     }


// }
// //登陆验证码
// class LoginVerifyEvent extends EventArgs {
//     verifyImage
//     public initObj(...args: any[]): void {
//         this.verifyImage = args[0]
//     }


// }
// //系统公告
// class MSG_BROADCAST_EVENT extends EventArgs {
//     isborad
//     sysType
//     content
//     public initObj(...args: any[]): void {
//         this.isborad = args[0]
//         this.sysType = args[1]
//         this.content = args[2]
//     }


// }

//任务事件
////////////////////////////////////////////////////-
class TaskEvent extends EventArgs {
    taskId
    public initObj(...args: any[]): void {
        this.taskId = args[0]
    }

}

class TaskOptionEvent extends EventArgs {
    optionlist
    npcEntryId
    optionType
    public initObj(...args: any[]): void {
        this.optionlist = args[0]
        this.npcEntryId = args[1]
        this.optionType = args[2]
    }

}

class TaskUpdateEvent extends EventArgs {
    oldTask
    newObjTask
    public initObj(...args: any[]): void {
        this.oldTask = args[0]
        this.newObjTask = args[1]
    }

}

class TaskOpEvent extends EventArgs {
    taskId
    op
    nodeId
    public initObj(...args: any[]): void {
        this.taskId = args[0]
        this.op = args[1]
        this.nodeId = args[2]
    }

}

// class TaskFightEvent extends EventArgs {
//     taskId
//     npcId
//     public initObj(...args: any[]): void {
//         this.taskId = args[0]
//         this.npcId = args[1]
//         //this.result = args[2]
//     }

// }

// class TaskGuideEvent extends EventArgs {
//     linkStr
//     public initObj(...args: any[]): void {
//         this.linkStr = args[0]
//     }

// }

// class TaskDialogEvent extends EventArgs {
//     index
//     public initObj(...args: any[]): void {					//1:选项dialog，2:剧情对话框，3:过场对话框，4:电影对话框
//         this.index = args[0]
//     }
// }

//战斗事件
////////////////////////////////////////////////////
//战斗成员
class CombatFighterEvent extends EventArgs {
    id
    public initObj(...args: any[]): void {
        this.id = args[0]
    }


}
//战斗成员列表
class CombatFighterAddEvent extends EventArgs {
    fighterList
    public initObj(...args: any[]): void {
        this.fighterList = args[0]
    }


}
// //战斗成员创建
// class CombatFighterCreateEvent extends EventArgs {
//     id
//     bout
//     public initObj(...args: any[]): void {
//         this.id = args[0]
//         this.bout = args[1]
//     }


// }
//战斗表演结果
class CombatResultEvent extends EventArgs {
    result
    public initObj(...args: any[]): void {
        this.result = args[0]
        //this.resultId		= args[0]
    }
}

// //战斗倒计时
// class CombatClockEvent extends EventArgs {
//     clockTime
//     public initObj(...args: any[]): void {
//         this.clockTime = args[0]
//     }
// }
//战斗hp, mp更新
class CombatHPMPUpdateEvent extends EventArgs {
    combatId
    cur_hp
    total_hp
    cur_mp
    total_mp
    cur_rp
    total_rp
    public initObj(...args: any[]): void {
        this.combatId = args[0]
        this.cur_hp = args[1]
        this.total_hp = args[2]
        this.cur_mp = args[3]
        this.total_mp = args[4]
        this.cur_rp = args[5]
        this.total_rp = args[6]
    }

}

class CombatPointChangeEvent extends EventArgs {
    combatType: string
    combatId: number
    changePoint: any

    public initObj(...args: any[]): void {
        this.combatType = args[0]
        this.combatId = args[1]
        this.changePoint = args[2]
    }
}

class CombatRoleInfoEvent extends EventArgs {
    roleId
    updateIndex
    public initObj(...args: any[]): void {
        this.roleId = args[0]
        this.updateIndex = args[1]				//"mp"
    }

}

// class CombatFightInstructEvent extends EventArgs {
//     instructList
//     public initObj(...args: any[]): void {
//         this.instructList = args[0]
//     }

//     //战斗结束事件 取代CampaignEvent
// }

class CombatEndEvent extends EventArgs {
    param
    callBack
    obj
    public initObj(...args: any[]): void {
        this.param = args[0] || null

        this.callBack = args[1] || null
        this.obj = args[2] || null
    }

    //战斗事件
}

class CombatEvent extends EventArgs {
    fightType
    winResult
    public initObj(...args: any[]): void {
        this.fightType = args[0]
        this.winResult = args[1]
    }

    //战斗技能
}

class CombatFightSkillEvent extends EventArgs {
    skillId
    fightActor
    public initObj(...args: any[]): void {
        this.skillId = args[0]
        this.fightActor = args[1]
    }

    //战斗冻结（场景）
}

class CombatFreezeEvent extends EventArgs {
    isFreeze
    windowIndex
    public initObj(...args: any[]): void {
        this.isFreeze = args[0]
        this.windowIndex = args[1] || 0
    }

    //能发招时指引
}

// class CombatFightRpEvent extends EventArgs {
//     button
//     skillId
//     public initObj(...args: any[]): void {
//         this.button = args[0]								//指定按钮
//         this.skillId = args[1]							//技能ID
//     }

// }

class FighterBuffEvent extends EventArgs {
    actorId
    public initObj(...args: any[]): void {
        this.actorId = args[0]
    }

    //翅膀技能能量值更新
}

class FunnalPointEvent extends EventArgs {
    skillId
    leftPoint
    cooldownTime
    public initObj(...args: any[]): void {
        this.skillId = args[0]
        this.leftPoint = args[1]
        this.cooldownTime = args[2]
    }

}

class FunnalCDEvent extends EventArgs {
    side
    cdTime
    public initObj(...args: any[]): void {
        this.side = args[0]
        this.cdTime = args[1]				//战斗中的时间戳（增加的CD，包括技能和公共时间）
    }

}

// // class AssSkillEvent extends EventArgs {
// //     cdTime
// //     public initObj(...args: any[]): void {
// //         this.cdTime = args[0]				//战斗中的援助技能时间戳（增加的公共CD时间）
// //     }

// // }

// class CombinedSkillEvent extends EventArgs {
//     queueType
//     public initObj(...args: any[]): void {
//         this.queueType = args[0]
//     }

// }

class FightSequenceEvent extends EventArgs {
    sequence
    public initObj(...args: any[]): void {
        this.sequence = args[0]
    }

}

//关卡事件
class CampaignEvent extends EventArgs {
    campaignId
    public initObj(...args: any[]): void {
        this.campaignId = args[0]
    }

}

// class CampaignFirstPassEvent extends EventArgs {
//     campaignId
//     name
//     videoId
//     roleId
//     public initObj(...args: any[]): void {
//         this.campaignId = args[0]
//         this.name = args[1]
//         this.videoId = args[2]
//         this.roleId = args[3]
//     }


// }
// UI 显示事件
class UIShowEvent extends EventArgs {
    window
    public initObj(...args: any[]): void {
        this.window = args[0]
    }
}

// UI 隐藏事件
class UIHideEvent extends EventArgs {
    window
    public initObj(...args: any[]): void {
        this.window = args[0]
    }


}
// 点击地图事件
class MapClickEvent extends EventArgs {
    x
    y
    public initObj(...args: any[]): void {
        this.x = args[0]
        this.y = args[1]
    }
}
// buff事件
class BuffUpdateEvent extends EventArgs {
    actor
    buff
    public initObj(...args: any[]): void {
        this.actor = args[0] //buff对象
        this.buff = args[1]
    }


}
//宠物事件
class PetUpdateEvent extends EventArgs {
    petId
    newInfo
    oldInfo
    public initObj(...args: any[]): void {
        this.petId = args[0]
        this.newInfo = args[1]
        this.oldInfo = args[2]
    }
}

// //宠物互动次数事件
// class PetInteractCountEvent extends EventArgs {
//     interactCount
//     interval
//     interactEvent
//     public initObj(...args: any[]): void {
//         this.interactCount = args[0]
//         this.interval = args[1]
//         this.interactEvent = args[2]
//     }

// }

// class PetPushEvent extends EventArgs {
//     petEntry
//     eventId
//     public initObj(...args: any[]): void {
//         this.petEntry = args[0]
//         this.eventId = args[1]
//     }

// }

// class InteractionCost extends EventArgs {
//     cost
//     public initObj(...args: any[]): void {
//         this.cost = args[0]
//     }

// }

// class PetActiveInfo extends EventArgs {
//     petActiveInfo
//     public initObj(...args: any[]): void {
//         this.petActiveInfo = args[0]
//     }

// }

// class PetAwakeSuccess extends EventArgs {
//     petEntry
//     public initObj(...args: any[]): void {
//         this.petEntry = args[0]
//     }

// }

class PetCombatForceToShow extends EventArgs {
    petEntry
    delta
    public initObj(...args: any[]): void {
        this.petEntry = args[0]
        this.delta = args[1]
    }


}
// //限时召集部下
// class CallPetInTimeInfo extends EventArgs {
//     petList
//     public initObj(...args: any[]): void {
//         this.petList = args[0]
//     }


// }
// //宠物互动事件id
// class PetInteractEventIdEvent extends EventArgs {
//     eventId
//     itemEntryId
//     public initObj(...args: any[]): void {
//         this.eventId = args[0]
//         this.itemEntryId = args[1]
//     }

//     //宠物亲密度事件
// }

// class PetIntimateEventIdEvent extends EventArgs {
//     eventId
//     public initObj(...args: any[]): void {
//         this.eventId = args[0]
//     }


// }
// //宠物惊喜奖励
// class PetSurpriseEvent extends EventArgs {
//     petEntry
//     public initObj(...args: any[]): void {
//         this.petEntry = args[0]
//     }


// }
// //装备变换事件
// class PetEquipChangedEvent extends EventArgs {
//     petEntry
//     public initObj(...args: any[]): void {
//         this.petEntry = args[0]
//     }



// }
// //获取到可邀请宠物列表事件
// class PetInviteListEvent extends EventArgs {
//     inviteList
//     public initObj(...args: any[]): void {
//         this.inviteList = args[0]
//     }


// }
// //突发事件
// class PetBreakOutEvent extends EventArgs {
//     petEntry
//     eventData
//     public initObj(...args: any[]): void {
//         this.petEntry = args[0]
//         this.eventData = args[1]
//     }

// }

// class PetCollectPrizeInfo extends EventArgs {
//     prize
//     public initObj(...args: any[]): void {
//         this.prize = args[0]
//     }

// }

// class PetHoop extends EventArgs {
//     prizeList
//     discount
//     breakLevel
//     public initObj(...args: any[]): void {
//         this.prizeList = args[0]
//         this.discount = args[1]
//         this.breakLevel = args[2]
//     }


// }

// //获取抽奖结果
// class PetQuickRecruitPrizeEvent extends EventArgs {
//     prizeList
//     public initObj(...args: any[]): void {
//         this.prizeList = args[0]
//     }
// }

//竞技场第一名查询结果
class CHAMPION_FIRST_RESULT extends EventArgs {
    isFirst
    public initObj(...args: any[]): void {
        this.isFirst = args[0]
    }
}

// //比武第一名查询结果
// class WUDOU_FIRST_RESULT extends EventArgs {
//     isFirst
//     public initObj(...args: any[]): void {
//         this.isFirst = args[0]
//     }
// }

//指引事件
class GuideActivateButtonEvent extends EventArgs {
    funcIndex
    public initObj(...args: any[]): void {
        this.funcIndex = args[0]
    }

}

// class GuideFuncFinishEvent extends EventArgs {
//     funcList
//     public initObj(...args: any[]): void {
//         this.funcList = args[0]
//     }
// }

//自动行动事
class AutoFindWayEvent extends EventArgs {
    actionType
    target
    taskId
    public initObj(...args: any[]): void {
        let param = args[0]

        this.actionType = param[1]
        this.target = param[2]
        this.taskId = param[3]
    }


}
// // 金钱更新
// class TradeEvent extends EventArgs {
//     status
//     targetId
//     money
//     name
//     level
//     public initObj(...args: any[]): void {
//         this.status = args[0]
//         this.targetId = args[1]
//         this.money = args[2]
//         this.name = args[3]
//         this.level = args[4]
//     }
// }

class MessageMoveEvent extends EventArgs {
    Id
    Type
    CellX
    CellY
    public initObj(...args: any[]): void {
        this.Id = args[0] //id
        this.Type = args[1] //类型
        this.CellX = args[2] //类型
        this.CellY = args[3] //类型
    }
}

// // class MouseEvent extends EventArgs {
// //     x
// //     y
// //     public initObj(...args: any[]): void {
// //         this.x = args[0]
// //         this.y = args[1]
// //     }


// // }

// //////////////////-Friend//////////////////////////////////////////
// class RecieveMessageEvent extends EventArgs {
//     friendId
//     public initObj(...args: any[]): void {
//         this.friendId = args[0]
//     }

// }

class FriendOnOffLineEvent extends EventArgs {
    friendId
    online
    public initObj(...args: any[]): void {
        this.friendId = args[0]
        this.online = args[1]
    }

}

class MessageComeEvent extends EventArgs {
    messageInfo
    public initObj(...args: any[]): void {
        this.messageInfo = args[0]
    }

}

class SearchPlayerInfoEvent extends EventArgs {
    playerInfo
    sendType
    public initObj(...args: any[]): void {
        this.playerInfo = args[0]
        this.sendType = args[1]
    }

}

// class ApplyToFriendInfoEvent extends EventArgs {
//     playerInfo
//     public initObj(...args: any[]): void {
//         this.playerInfo = args[0]
//     }
// }

//好友推荐
class RecommendFriendEvent extends EventArgs {
    recommendList
    public initObj(...args: any[]): void {
        this.recommendList = args[0]
    }

}

// class SkillResultEvent extends EventArgs {
//     skillId
//     result
//     public initObj(...args: any[]): void {
//         this.skillId = args[0]
//         this.result = args[1]
//     }
// }

// class SkillListInfo extends EventArgs {
//     skillList
//     public initObj(...args: any[]): void {
//         this.skillList = args[0]
//     }

// }

//播放电影
class MovieEvent extends EventArgs {
    movieName
    public initObj(...args: any[]): void {
        this.movieName = args[0]
    }


}

// //竞技场 最高排名
// class ChampionTopRankEvent extends EventArgs {
//     enemyList
//     public initObj(...args: any[]): void {
//         this.enemyList = args[0]
//     }


// }

//竞技场 刷新信息
class ChampionRefreshEvent extends EventArgs {
    force
    rank
    times
    maxTimes
    time
    enemyList
    topList

    public initObj(...args: any[]): void {
        this.force = args[0]//战力
        this.rank = args[1]//名次
        this.times = args[2]//剩下多少次
        this.maxTimes = args[3]//最多多少次
        this.time = args[4]//多长时间后可以再挑战
        this.enemyList = args[5]//几个对手
        this.topList = args[6]//几个对手
    }


}

// //竞技场 晶石 刷新信息
// class ChampionRefreshExEvent extends EventArgs {
//     times
//     maxTimes
//     time
//     public initObj(...args: any[]): void {
//         this.times = args[0]//剩下多少次
//         this.maxTimes = args[1]//最多多少次
//         this.time = args[2]//多长时间后可以再挑战
//     }


// }

// //竞技场对战记录
// class ChampionRecordEvent extends EventArgs {
//     championRecordList
//     public initObj(...args: any[]): void {
//         this.championRecordList = args
//     }


// }

// //出战队列
// class BattleQueueEvent extends EventArgs {
//     queueType
//     queue
//     public initObj(...args: any[]): void {
//         this.queueType = args[0]//战力
//         //BattleQueueType =
//         //{
//         //	Campaign : 1, 				//关卡战斗
//         //	Champion : 2, 				//竞技场进攻阵型
//         //	ChampionDefence : 3, 	//竞技场防守阵型
//         //	DailyOne 		: 4, 			//日常一玩法
//         //	DailyTwo 		: 5,			//日常二玩法	
//         //	DailyThree 	: 6,			//日常三玩法
//         //	DailyFour 	: 7,			//日常四玩法
//         //}	
//         this.queue = args[1]//队列{1,1,1,1,1,1}
//     }


// }
// //关卡挑战胜利
// // class BattleCampaignWinEvent extends EventArgs {
// //     fightType
// //     campaignId
// //     starLevel
// //     exp
// //     money
// //     petExp
// //     itemList
// //     public initObj(...args: any[]): void {
// //         this.fightType = opFightType.FIGHT_TYPE_COMMON
// //         this.campaignId = args[0]						//关卡ID
// //         this.starLevel = args[1]						//星级
// //         this.exp = args[2]									//经验
// //         this.money = args[3]                //金钱
// //         this.petExp = args[4]               //宠物经验
// //         let itemList = args[5] //物品列表	{[entryId] : itemCount}	
// //         this.itemList = {}
// //         for (let i in itemList) {
// //             let v = itemList[i]

// //             this.itemList[i] = v
// //         }
// //     }


// // }
// // //关卡场挑战失败
// // class BattleCampaignLostEvent extends EventArgs {
// //     fightType
// //     public initObj(...args: any[]): void {
// //         //this.fightType	=	args[0]
// //         this.fightType = opFightType.FIGHT_TYPE_COMMON
// //     }


// // }
// //竞技场挑战胜利
// // class BattleChampionWinEvent extends EventArgs {
// //     fightType
// //     public initObj(...args: any[]): void {
// //         //this.fightType	=	args[0]
// //         this.fightType = opFightType.FIGHT_TYPE_CHAMPION
// //     }


// // }
// // //竞技场挑战失败
// // class BattleChampionLostEvent extends EventArgs {
// //     fightType
// //     public initObj(...args: any[]): void {
// //         //this.fightType	=	args[0]
// //         this.fightType = opFightType.FIGHT_TYPE_CHAMPION
// //     }


// // }
//排行榜
class RankListEvent extends EventArgs {
    ranktype
    ranklist
    firstAppearData
    public initObj(...args: any[]): void {
        this.ranktype = args[0]
        this.ranklist = args[1]
        this.firstAppearData = args[2]
    }

}

//排行榜外观信息
class RankAppearDataListEvent extends EventArgs {
    ranktype
    appearData
    public initObj(...args: any[]): void {
        this.ranktype = args[0]
        this.appearData = args[1]
    }
}

// //混沌世界副本列表
// // class RobberUpdateRoomListEvent extends EventArgs {
// //      roomNum
// //     roomList
// //     public initObj(...args: any[]): void {
// //         this.roomNum = args[0]
// //         this.roomList = args[1]
// //     }


// // }

// //混沌世界BOSS时间刷新
// class RobberStatueUpdateBossRefreshTimeEvent extends EventArgs {
//     hardRefreshTime
//     bossRefreshTime
//     public initObj(...args: any[]): void {
//         this.hardRefreshTime = args[0]
//         this.bossRefreshTime = args[1]
//     }



// }
// //混沌世界更新BUFF
// class RobberStatueUpdateStatusEvent extends EventArgs {
//     buffName
//     buffLeftTime
//     public initObj(...args: any[]): void {
//         this.buffName = args[0]
//         this.buffLeftTime = args[1]
//     }


// }
// //混沌世界移除BUFF
// class RobberStatueRemoveStatusEvent extends EventArgs {
//     buffName
//     public initObj(...args: any[]): void {
//         this.buffName = args[0]
//     }


// }

// //全服首通关卡名单
// class FirstPassListEvent extends EventArgs {
//     firstPasslist
//     public initObj(...args: any[]): void {
//         this.firstPasslist = args[0]
//     }

// }

// // class RootWindowDriveEvent extends EventArgs {

// //     public initObj(...args: any[]): void {
// //         this.args = args[0]
// //     }



// // }
// // //拖动结束
// // class SliderEventEnd extends EventArgs {
// //     public initObj(...args: any[]): void {
// //         this.windowName = args[0]
// //         this.percent = args[1]
// //     }


// // }
// //收到申请入队 
// class TeamAppleUpdateEvent extends EventArgs {
//     applyInfo
//     public initObj(...args: any[]): void {
//         this.applyInfo = args[0]
//         //TLog.Debug("TeamAppleUpdateEvent.init")
//         //TLog.Debug_r(args[0])
//     }

// }

// // class PetIconButtonEvent extends EventArgs {
// //     public initObj(...args: any[]): void {
// //         this.visible = args[0]
// //     }


// // }

// // class GetMessageEvent extends EventArgs {
// //     args
// //     public initObj(...args: any[]): void {
// //         this.args = args[0]
// //     }

// // }

// // class wndUpdateBtnTipsEvent extends EventArgs {
// //     public initObj(...args: any[]): void {
// //         this.args = args[0]
// //     }

// // }

// class IdAndInfoEvent extends EventArgs {
//     id
//     info
//     public initObj(...args: any[]): void {
//         this.id = args[0]
//         this.info = args[1]
//     }
// }
// // }
// //刺激点信息
// class ExciteDateEvent extends EventArgs {
//     exciteType
//     exciteData
//     public initObj(...args: any[]): void {
//         this.exciteType = args[0]
//         this.exciteData = args[1]
//     }


// }
// //宠物上下阵
// class PetEmbattleStateEvent extends EventArgs {
//     petEntry
//     petState
//     public initObj(...args: any[]): void {
//         this.petEntry = args[0]
//         this.petState = args[1]
//     }


// }
// //队伍更新信息
// class TeamInfoUpdateEvent extends EventArgs {
//     teamInfo
//     public initObj(...args: any[]): void {
//         this.teamInfo = args[0]
//     }


// }
// //队伍邀请提示红点信息，用以信息的特殊化处理，以handler为标识
// class TeamInviteInfo extends EventArgs {
//     cbObj
//     inviteInfo
//     public initObj(...args: any[]): void {
//         this.cbObj = args[0]
//         this.inviteInfo = args[1]
//     }


// }
// //新手部下上阵
// class TeamMemberNoticeEvent extends EventArgs {
//     key
//     value
//     public initObj(...args: any[]): void {
//         this.key = args[0]
//         this.value = args[1]
//     }

// }

// class TeamMemberLeaveEvent extends EventArgs {
//     playerID
//     public initObj(...args: any[]): void {
//         this.playerID = args[0]
//     }


// }
// //关卡首通消息EXCITE_SERVER_FIRST_CAMPAIGN
// class ExciteServerFirstCampaignEvent extends EventArgs {
//     recordStr
//     public initObj(...args: any[]): void {
//         this.recordStr = args[0]
//     }

// }
// //招募动画事件  true 开始  false 结束
// class GetPetAnimationEvent extends EventArgs {
//     animationState
//     public initObj(...args: any[]): void {
//         this.animationState = args[0]
//     }


// }
// ////仇人所在位置
// // class RobberKillPosEvent extends EventArgs {
// //     mapId
// //     index
// //     public initObj(...args: any[]): void {
// //         this.mapId = args[0]
// //         this.index = args[1]
// //     }
// // }
// ////是否可以进入
// // class RobberTestEnter extends EventArgs {
// //     public initObj(...args: any[]): void {
// //         this.isTeam = args[0]
// //     }
// // }
// // ////进入模拟玩法
// // class RoleEnterSpace extends EventArgs {
// //     public initObj(...args: any[]): void {
// //         this.space = args[0]
// //     }

// // }
// ////窗口动画事件
// class WindowAnimationStateEvent extends EventArgs {
//     windowName
//     animationState
//     public initObj(...args: any[]): void {
//         this.windowName = args[0]
//         this.animationState = args[1]
//     }

// }
// ////天空之塔邀请列表返回事件
// class SkytowerInviteListEvent extends EventArgs {
//     inviteList
//     actStatus
//     public initObj(...args: any[]): void {
//         this.inviteList = args[0]
//         this.actStatus = args[1] || ConfigTeamStatus.ACTIVITY_1				//默认为天空之塔的邀请列表
//     }

// }
// ////天空之塔奖励选择事件
// class SkytowerPrizeChooseEvent extends EventArgs {
//     saveChooseType
//     public initObj(...args: any[]): void {
//         this.saveChooseType = args[0]
//     }

// }
// //- 语音包事件 ////-
// class ChatVoiceRecordEvent extends EventArgs {
//     id
//     name

//     body
//     size
//     buf
//     channel
//     recordTime
//     VipLevel
//     factionID


//     public initObj(...args: any[]): void {
//         this.channel = args[0]
//         this.id = args[1]
//         this.name = args[2]
//         this.body = args[3]
//         this.size = args[4]
//         this.buf = args[5]
//         this.recordTime = args[6]
//         this.VipLevel = args[7]
//         this.factionID = args[8]
//     }


// }
//- 语音ID事件 ////-
class ChatVoiceIDRecordEvent extends EventArgs {

    id
    name
    voiceID
    body
    channel
    recordTime
    VipLevel

    public initObj(...args: any[]): void {
        this.channel = args[0]
        this.id = args[1]
        this.name = args[2]
        this.body = args[3]
        this.voiceID = args[4]
        this.recordTime = args[5]
        this.VipLevel = args[6]
    }
}

// //打开某个矿洞
// class OpenOneRelicEvent extends EventArgs {
//     relicAreaID
//     relicID
//     public initObj(...args: any[]): void {
//         this.relicAreaID = args[0]
//         this.relicID = args[1]
//     }


// }
// //矿洞锁定
// class RelicLockEvent extends EventArgs {
//     relicAreaID
//     relicID
//     public initObj(...args: any[]): void {
//         this.relicAreaID = args[0]
//         this.relicID = args[1]
//     }


// }
// //矿洞锁定
// class RelicAreaUpdateEvent extends EventArgs {
//     relicAreaID
//     public initObj(...args: any[]): void {
//         this.relicAreaID = args[0]
//     }


// }

// //////////////////////////////////////角色其他相关////////////////////////////
// class RoleInviteListEvent extends EventArgs {
//     inviteType
//     inviteList
//     public initObj(...args: any[]): void {
//         this.inviteType = args[0]
//         this.inviteList = args[1]
//     }


// }


// //////////////-血盟(vip小战队)//////////////////-
// class PrizeStatusListData extends EventArgs {
//     prizeStatusList
//     public initObj(...args: any[]): void {
//         this.prizeStatusList = args[0].prizeStatusList
//     }
// }

// //战队列表
// class QueryTeamListData extends EventArgs {
//     teamList
//     public initObj(...args: any[]): void {
//         this.teamList = args[0]
//     }

//     //申请列表
// }

// class QueryApplyListData extends EventArgs {
//     applyList
//     public initObj(...args: any[]): void {
//         this.applyList = args[0]
//     }

//     //查询成员列表
// }

// class QueryMemberListData extends EventArgs {
//     memberList
//     totalFetters
//     teamName
//     public initObj(...args: any[]): void {
//         this.memberList = args[0]
//         this.totalFetters = args[1]
//         this.teamName = args[2]
//     }

//     //骑士团队信息update
// }

// class VipTeamInfoUpdate extends EventArgs {
//     teamId
//     teamName
//     teamLeaderId
//     teamLeaderName
//     teamLeaderLevel
//     teamLeaderVipLevel
//     teamLeaderVocation
//     teamLeaderSex
//     teamMemberCount
//     teamLeaderForce
//     public initObj(...args: any[]): void {
//         this.teamId = args[0]
//         this.teamName = args[1]
//         this.teamLeaderId = args[2]
//         this.teamLeaderName = args[3]
//         this.teamLeaderLevel = args[4]
//         this.teamLeaderVipLevel = args[5]
//         this.teamLeaderVocation = args[6]
//         this.teamLeaderSex = args[7]
//         this.teamMemberCount = args[8]
//         this.teamLeaderForce = args[9]
//     }
// }

// //玩家信息分类
// class PlayerDetailedInfoEvent extends EventArgs {
//     checkType
//     info
//     public initObj(...args: any[]): void {
//         this.checkType = args[0]
//         this.info = args[1]
//     }
// }

// class IconFlyEventArgs extends EventArgs {
//     skillId
//     endX
//     endY
//     public initObj(...args: any[]): void {
//         this.skillId = args[0]
//         this.endX = args[1]
//         this.endY = args[2]
//     }


// }

// //////////- 技能升级 ////////////
// class PetReplaceSkillEvent extends EventArgs {
//     oldSkill
//     newObjSkill
//     public initObj(...args: any[]): void {
//         this.oldSkill = args[0]
//         this.newObjSkill = args[1]
//     }

// }

// class PetPointEvent extends EventArgs {
//     values
//     point
//     exchange
//     ratio
//     public initObj(...args: any[]): void {
//         this.values = args[0]
//         this.point = args[1]
//         this.exchange = args[2]
//         this.ratio = args[3]
//     }

// }

class HeroPerLevelUpEvent extends EventArgs {
    level
    public initObj(...args: any[]): void {
        this.level = args[0]
    }


}

////////////////////////////////////////-通用////////////////////////////////////////////-
class NetMessageEvent extends EventArgs {
    msg
    public initObj(...args: any[]): void {
        this.msg = args[0]
    }


}

class GameUserDataEvent extends EventArgs {
    userData: any;
    public initObj(...args: any[]): void {
        this.userData = args[0]
    }
}

// ////////////////////////////////////////-职业////////////////////////////////////////////-
// class ProfessionInfoEvent extends EventArgs {

//     professionInfo
//     public initObj(...args: any[]): void {
//         this.professionInfo = args[0]
//     }

// }

////////////////////////////////////////-公会////////////////////////////////////////////-
class ClubSelfUpdateEvent extends EventArgs {
    id
    name
    post
    public initObj(...args: any[]): void {
        this.id = args[0]
        this.name = args[1]
        this.post = args[2]
    }


 }
// //军团成员信息
// class ClubMemberInfoUpdateEvent extends EventArgs {
//     clubRoleInfo
//     public initObj(...args: any[]): void {
//         this.clubRoleInfo = args[0]
//     }
// }

// //更新军团公告
// class UpdateLegionNoticeEvent extends EventArgs {
//     notice
//     id
//     public initObj(...args: any[]): void {
//         this.notice = args[0]
//         this.id = args[1]
//     }


// }
//更新军团公告
class ClubListEvent extends EventArgs {
    clubInfoList
    public initObj(...args: any[]): void {
        this.clubInfoList = args[0]
    }


}
//个人申请的军团列表信息
class ClubMyApplyListEvent extends EventArgs {
    myApplyList
    public initObj(...args: any[]): void {
        this.myApplyList = args[0]
    }
}

////////////////////////////////////////-物品////////////////////////////////////////////-
class ItemEvent extends EventArgs {
    itemId
    public initObj(...args: any[]): void {
        this.itemId = args[0]
    }
}

// class ItemUpdateEvent extends EventArgs {
//     store
//     item
//     public initObj(...args: any[]): void {
//         this.store = args[0] //包裹1，包裹2，信箱，仓库等
//         this.item = args[1]
//     }

// }

// class ItemUpdateListEvent extends EventArgs {
//     itemList
//     public initObj(...args: any[]): void {
//         this.itemList = args[0] //
//     }

// }

// class ItemSellListEvent extends EventArgs {
//     sellId
//     itemList
//     public initObj(...args: any[]): void {
//         this.sellId = args[0]
//         this.itemList = args[1]
//     }

// }

class ItemGainEvent extends EventArgs {
    itemEntryId
    count
    itemLogic
    public initObj(...args: any[]): void {
        this.itemEntryId = args[0]
        this.count = args[1]
        this.itemLogic = args[2]
    }


}

//////////////-溶解//////////////////////////
class ResolveResult extends EventArgs {
    num
    ItemList
    public initObj(...args: any[]): void {
        this.num = args[0]
        this.ItemList = args[1]
    }
}


// class SoldierUpdateEvent extends EventArgs {
//     oldList
//     newList
//     public initObj(...args: any[]): void {
//         this.oldList = args[0]
//         this.newList = args[1]
//     }
// }


// //////////////-神兽//////////////////////////////-
// class AniamlLevel extends EventArgs {
//     level
//     savelist
//     public initObj(...args: any[]): void {
//         this.level = args[0]
//         this.savelist = args[1]
//     }

// }

// class AniamlPower extends EventArgs {
//     power
//     public initObj(...args: any[]): void {
//         this.power = args[0]
//     }
// }

class FunAutoFail extends EventArgs {
    funType
    public initObj(...args: any[]): void {
        this.funType = args[0]
    }

}

///////////////////////帮会任务/////////////////////////
class ClubTask extends EventArgs {
    taskType
    count
    public initObj(...args: any[]): void {
        this.taskType = args[0]
        this.count = args[1]
    }
}

//////////////////////////////////运营活动/////////////////////////////
class PayActivtyUpdateEvent extends EventArgs {
    actIndex: number                //PayActivityIndex, 0表示不指定
    public initObj(...args: any[]): void {
        this.actIndex = args[0]
    }

}

//////////////////////////////////运营活动/////////////////////////////
class BossActivtyUpdateEvent extends EventArgs {
    actIndex: number                //OrdinaryActivityIndex, 0表示不指定
    newInfo: any
    oldIndo: any
    
    public initObj(...args: any[]): void {
        this.actIndex = args[0]
        this.newInfo = args[1]
        this.oldIndo = args[2]
    }

}

/////////////////////////////通用幻化更新////////////////////////////
class FunTurnUpdateEvent extends EventArgs{
    funIndex : Number
    isLevelUp : boolean

    public initObj(...args : any[]){
        this.funIndex = args[0] 
        this.isLevelUp = args[1] || false
    }
}

////////////////////////////////商店更新
class ShopUpdateEvent extends EventArgs {
    public initObj(...args : any[]){
    }
}