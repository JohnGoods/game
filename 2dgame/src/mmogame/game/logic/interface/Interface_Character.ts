// TypeScript file

function GetStringSplitBySchool(content, schoolId?, count?) {
    return content
}

function LookAtHero() {
    //modify:movie
    //let [isMovie, _] = MovieSystem.getInstance().isPlayingMovie()
    let isMovie = false
    if (FightSystem.getInstance().isFight() == false && isMovie == false) {
        var point = GetHero().getMapXY();
        SceneManager.getInstance().lookAtCenter(point.x, point.y)
    }
}

// 人物系统接口
function IsPlayer(actor) {
    if (actor.getActorType() != actor_Type.ACTOR_TYPE_PLAYER) {
        return false
    }

    let id = actor.getId()
    let findActor = ActorManager.getInstance().getPlayer(id)
    if (!findActor) {
        return false
    }
    return true
}


function FaceToHero(npcId) {
    let npc = ActorManager.getInstance().getNpc(npcId)
    if (npc) {
        let heroPos = GetHero().getCellXY()
        let npcPos = npc.getCellXY()

        let entryId = npc.getEntryId()
        if (GameConfig.npcConfig[entryId]["type"] == 1) {		//指定类型，例如大BOSS不面向
            return
        }

        if (heroPos.x < npcPos.x) {
            npc.setDir(ActorDirMap.Left)
        } else {
            npc.setDir(ActorDirMap.Right)
        }
    }
}

// function GetActorProperty(actorInfo, fieldIndex) {
//     let value = 0
//     if (actorInfo.classname == "PetInfo") {
//         value = actorInfo.getProperty(pet_objectFiled[fieldIndex])
//     } else if (actorInfo.classname == "HeroInfo" || actorInfo.classname == "PlayerInfo") {
//         value = actorInfo.getProperty(role_objectFiled[fieldIndex])
//     }

//     return value
// }


// function GetPlayerInfo(playerId){
// 	let wnd = WngMrg.getInstance().getWindow("PlayerInfoFrame")
// 	wnd.loadWnd()
// 	wnd.setPlayerId(playerId)
	
// 	//只申请一次
// 	let message = GetMessage(opCodes.C2G_ROLE_DETAILED_INFO)
// 	message.id = playerId
// 	message.checkType = BattleQueueType.Campaign
// 	SendGameMessage(message)
// }


function RandomRobotName(){
    let xing = "", ming = ""

    let count = size_t(GameConfig.nameConfig)

    let randomIndex = MathUtil.random(1, count)
    xing = GameConfig.nameConfig[randomIndex].xing

    randomIndex = MathUtil.random(1, count)
    ming = GameConfig.nameConfig[randomIndex].nanming

    return xing + ming
}