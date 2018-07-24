/*
作者:
    yangguiming
	
创建时间：
   2013.6.18(周二)

意图：
   Actor管理器
   管理Actor的生命周期，以及为Actor提供便捷的辅助接口。与逻辑系统

公共接口：
   //function GetHero(){//获取Hero
   
*/

let s_ActorManager = null
let globalCharaterId = 0

function GetHero() {
    return s_ActorManager.getHero()
}

function GetHeroPropertyInfo() {
    return s_ActorManager.getHero().getPropertyInfo()
}

function GetHeroProperty(key) {
    return s_ActorManager.getHero().getProperty(key)
}

function GenCharaterId() {
    if (globalCharaterId == 0) {
        globalCharaterId = IsolationCharacterId.SpecalEnd
    }

    globalCharaterId = globalCharaterId - 1
    return globalCharaterId
}

function FireHeroUpdateInfo() {
    let hero = GetHero()
    let heroInfo = hero.getPropertyInfo()
    FireEvent(EventDefine.HERO_INFO_UPDATE, ActorUpdateEvent.newObj(hero, heroInfo, heroInfo))
}


function PushActorStorage() {
    let this_ = ActorManager.getInstance()
    //this_.actorStorage = this_.actorStorage || []

    JsUtil.arrayInstert(this_.actorStorage, [])
}

function PopActorStorage() {
    let this_ = ActorManager.getInstance()
    //TLog.Assert(this.actorStorage.length > 0)

    let t = JsUtil.arrayRemove(this_.actorStorage) || []
    for (let k in t) {
        let v = t[k]

        let func = v.callBack
        func.call(v.obj, v.param)
    }
}

function ClearCurActorStorage() {
    let this_ = ActorManager.getInstance()
    //this_.actorStorage = this_.actorStorage || []

    if (this_.actorStorage.length == 0) {
        return
    }
    PopActorStorage()
    //JsUtil.arrayRemove(this.actorStorage)
    JsUtil.arrayInstert(this_.actorStorage, [])
}




class ActorManager extends BaseSystem {

    hero: Hero;

    targetActor: Actor;
    targetActorTouchTimes: number;
    player_list: any;
    npc_list: any;
    actorStorage: any[];

    MaxPlayerShow: number;

    petList: any;
    petMagicStone: any;
    bShowPlayer: boolean;

    public initObj(...args: any[]): void {
        s_ActorManager = this

        this.targetActor = null
        this.targetActorTouchTimes = 0
        this.hero = null
        this.player_list = {} 	//玩家列表
        this.npc_list = {}  		//NPC列表
        RegisterEvent(EventDefine.STATE_ACTIVE, this.onActiveDrama, this)
        RegisterEvent(EventDefine.STATE_DEACTIVE, this.onDeActiveDrama, this)
        RegisterEvent(EventDefine.HERO_ENTER_GAME, this.onHeroEnterGame, this)
        RegisterEvent(EventDefine.HERO_ENTER_MAP, this.onHeroEnterMap, this)

        this.actorStorage = []
        //this.actorResList = {}
        // this.petList,this.TeamSkill = {},{}
        // this.skillLevel = null
        //this.initGameConfig.ModelConfig()


        this.MaxPlayerShow = 15 //最多同屏人数
        this.bShowPlayer = true
    }

    destory() {
        UnRegisterEvent(EventDefine.STATE_ACTIVE, this.onActiveDrama, this)
        UnRegisterEvent(EventDefine.STATE_DEACTIVE, this.onDeActiveDrama, this)
        UnRegisterEvent(EventDefine.HERO_ENTER_GAME, this.onHeroEnterGame, this)

        //if(this.hero ){
        //	this.hero.propertyInfo = null
        //}
        this.clearAll()
        if (this.hero) {
            this.hero.deleteObj()
            this.hero = null
        }

        this.actorStorage = []

        //清除uicomponent缓存
        ClearAllUIComponent()

        //for(let _ = 0; _ < this.actorResList.length; _++){
        //		let v = this.actorResList[_]
        //
        //	v.ReleaseRef()
        //}
    }

    prepareResource(workQueue: WorkQueue): void {
        GameConfig.initGameWorldCommonCsv(workQueue);
    }


    onClear() {
        this.actorStorage = []
        this.targetActor = null;
        this.clearAll()
        if (this.hero) {
            //this.hero.propertyInfo = null
        }

        globalCharaterId = 0
        this.bShowPlayer = true
    }

    getHero() {
        if (this.hero == null) {
            this.hero = Hero.newObj()
            //this.hero.enterMap()
        }
        return this.hero
    }

    //getModelAction( modelId, actionAlias){
    //	//模型有换装，不同的换装对应的action名字不同
    //	let modelInfo = GameConfig.ModelConfig[modelId]
    //	if(modelInfo ){
    //		let actionName = modelInfo[actionAlias]
    //		if(actionName && actionName != "" ){
    //			return actionName
    //		}
    //	}
    //	return actionAlias
    //}

    loadModel(actor: Actor, modelId: number) {
        let modelInfo = GameConfig.ModelConfig[modelId]
        if (modelInfo == null || modelInfo.model == null) {
            TLog.Error("ActorManager.loadModel model:%d ! exist", modelId)
            return false
        }

        ////为了避免相同模型，没有刷新骨骼。这里先重置骨骼图片的默认值
        //if (actor.getModelName() == modelInfo.model) {
        //    actor.changePartSkin("", -1, -1)
        //}

        //换模型时挂载在模型上的特效会被释放内存
        if (actor.getModelName() != modelInfo.model) {
            actor.doCommand(ActorCommand.RemoveEffectAll)
        }

        //TLog.Debug("loadModel",modelInfo.model)
        actor.loadModelByName(modelInfo.model)

        if (modelInfo.scale != 0) {
            actor.setScale(modelInfo.scale)
        }

        if (modelInfo.mirror != null) {
            actor.setMirror(modelInfo.mirror)
        }

        if (modelInfo.show) {
            actor.changeSkin(modelInfo.show)
        }

        if (modelInfo.boneOperation) {

            for (let boneName in modelInfo.boneOperation) {
                let opList = modelInfo.boneOperation[boneName]

                //设scale
                let scale = opList["scale"]
                if (scale) {
                    //actor.setBoneScale(boneName, scale)
                }

                //设置alpha color
                let color = opList["color"]
                if (color) {
                    let [r, g, b, a] = [color[0], color[1], color[2], color[3]]
                    // actor.setBoneAlpha(boneName, a)
                    // actor.setBoneColor(boneName, r, g, b)
                }

                //局部换装
                let skinpath: string = opList["show"]
                if (skinpath) {
                    //let skinpath = modelInfo.model + "_skin/" + show
                    actor.changePartSkin(boneName, skinpath)
                }

                let effectId = opList["effect"]
                if (effectId) {
                    if (actor instanceof Character) {
                        actor.addActorEffect(boneName, effectId)
                    }
                }

            }
        }

        return true
    }



    updateHeroInfo(info, resetInfo?) {
        if (this.hero == null) {
            TLog.Error("ActorManager.updateHeroInfo info == null")
            return
        }

        //属性更新
        let oldInfo = this.hero.updatePropertyInfo(info, resetInfo)
        //设置外形

        this.buildPlayerAppear(this.hero, info, true)

        if (oldInfo) {
            FireEvent(EventDefine.HERO_INFO_UPDATE, ActorUpdateEvent.newObj(this.hero, oldInfo, info))
            //TLog.Debug("FireEvent EventDefine.HERO_INFO_UPDATE")

            if (oldInfo.level < info.level) {
                TLog.Debug(oldInfo.level, info.level)
                GameSound.getInstance().playEffect(SystemSound.effect_levelUp)
                //MsgSystem.showScreenEffect(effectIndex.LevelUp)
                EffectManager.getInstance().createBindOnceEffect(effectIndex.LevelUp, GetHero())

                //开功能
                GuideSystem.getInstance().updateHeroFunc()
                //updateLoginInfo(info)
            }

            if (oldInfo.body != info.body) {
                //updateLoginInfo(info)
            }
        }

    }



    createNpc(info) {
        //TLog.Warn("ActorManager.createNpc %s", info.id)
        let npc_id = info.id

        if (this.npc_list[npc_id] != null) {
            this.deleteNpc(npc_id)
        }

        let [flag, id] = this.checkSamePosNpc(info)
        if (flag) {
            this.deleteNpc(id)
        }

        let npcObject = Npc.newObj()
        npcObject.setCellXY(info.cellx, info.celly)
        npcObject.setDir(info.dir)
        npcObject.setPropertyInfo(info)
        this.buildNpcAppear(npcObject, info)

        npcObject.enterMap()//显示
        if (GameConfig.npcConfig[info.entryId] && GameConfig.npcConfig[info.entryId].status && size_t(GameConfig.npcConfig[info.entryId].status) != 0) {
            let status = GameConfig.npcConfig[info.entryId]["status"]
            npcObject.changeAction(status[0], status[1], status[2])
        }
        this.npc_list[npc_id] = npcObject
        FireEvent(EventDefine.NPC_ENTER_MAP, ActorEvent.newObj(npcObject))
        return npcObject
    }

    checkSamePosNpc(info) {
        for (let _ in this.npc_list) {
            let npc = this.npc_list[_]

            let npcInfo = npc.getPropertyInfo()
            if (npcInfo.entryId == info.entryId) {
                //if(npcInfo.mapId == info.mapId ){
                if (npcInfo.cellx == info.cellx) {
                    if (npcInfo.celly == info.celly) {
                        return [true, npcInfo.id]
                    }
                }
                //}
            }
        }

        return [false, 0]
    }

    deleteNpc(id) {
        //TLog.Warn("ActorManager.deleteObjNpc %s", id)
        let npcObject = this.npc_list[id]
        if (npcObject) {
            delete this.npc_list[id]
            FireEvent(EventDefine.NPC_LEAVE_MAP, ActorEvent.newObj(npcObject))
            npcObject.deleteObj()
            //}else{
            //	TLog.Error("ActorManager.deleteObjNpc %s", tostring(id))
        }

    }

    getNpc(id) {
        return this.npc_list[id]
    }

    clearAllNpc() {

        let i = 0;
        for (var k in this.npc_list) {
            var npc = this.npc_list[k];
            this.deleteNpc(npc.getId());

            i++
        }
        this.npc_list = {};

        TLog.Debug("clearAllNpc %d", i)
    }

    getNpcWithEntryId(entryId) {
        for (let id in this.npc_list) {
            let v = this.npc_list[id]

            if (v.getEntryId() == entryId) {
                return v
            }
        }
        return null
    }

    getNpcIdWithName(npcName) {
        for (let id in this.npc_list) {
            let v = this.npc_list[id]

            if (v.getName() == npcName) {
                return id
            }
        }
        return -1
    }


    getNpcRefWithEntryId(npcEntry) {

        let npcRef = GameConfig.npcConfig[tonumber(npcEntry)]
        if (npcRef) {
            //延迟处理功能列表
            if (npcRef.talkOpList == null) {
                npcRef.talkOpList = []
                for (let _ in npcRef.operation) {
                    let v = npcRef.operation[_]

                    JsUtil.arrayInstert(npcRef.talkOpList, tonumber(v))
                }
            }

        }
        return npcRef
    }

    getNpcNameWithEntryId(npcEntry) {
        let npcRef = this.getNpcRefWithEntryId(npcEntry)
        if (npcRef) {
            return npcRef.name
        }
        return ""
    }

    getNpcList() {
        return this.npc_list
    }


    createPlayer(info, cellX, cellY) {
        if (FightSystem.getInstance().isFight()) {
            return
        }
        //TLog.Warn("ActorManager.createPlayer %s", tostring(info.id))
        let player_id = info.id

        if (this.player_list[player_id]) {
            TLog.Warn("ActorManager.createPlayer %s", tostring(info.id))
            this.deletePlayer(player_id)
        }

        //圣地在上面delete时检查如果在挂机列表里会自动创建一个
        let playerObject = this.player_list[player_id]
        if (!playerObject) {
            playerObject = Player.newObj()
        }
        playerObject.setCellXY(cellX, cellY)
        //playerObject.setPropertyInfo(info)
        //设置外观
        this.buildPlayerAppear(playerObject, info)
        playerObject.enterMap()
        playerObject.updateFollowModelPos()

        this.player_list[player_id] = playerObject
        // 如果玩家设置隐藏，则隐藏这个角色
        if (this.getShowPlayerStatus() == false) {
            this.hidePlayer(player_id)
            //playerObject.setVisible(false)
        } else {
            this.checkMaxPlayerShow()
        }
        FireEvent(EventDefine.PLAYER_ENTER_MAP, ActorEvent.newObj(playerObject))
        return playerObject
    }

    deletePlayer(id) {
        //TLog.Warn("ActorManager.deleteObjPlayer %s", tostring(id))
        let playerObject = this.player_list[id]
        if (playerObject) {
            delete this.player_list[id]
            FireEvent(EventDefine.PLAYER_LEAVE_MAP, ActorEvent.newObj(playerObject))
            playerObject.deleteObj()
        } else {
            TLog.Debug("ActorManager.deleteObjPlayer %s", tostring(id))
        }

    }

    getPlayer(id) {
        return this.player_list[id]
    }

    getPlayerList() {
        return this.player_list
    }

    clearAllPlayer() {
        let i = 0
        let list = {}
        for (let key in this.player_list) {
            let v = this.player_list[key]
            list[key] = v
        }

        for (let key in list) {
            let v = list[key]
            this.deletePlayer(key)
            i = i + 1
        }
        TLog.Debug("clearAllPlayer %d", i)
    }


    updatePlayer(id, info) {
        //TLog.Debug("updatePlayer( id, info){",id,this.hero.getProperty("id"))
        if (id == this.hero.getProperty("id")) {
            //TLog.Debug(this.hero.getHeroSpace())  
            //if(this.hero.getHeroSpace()==null ){   //在生活场景才处理更新 天空之塔不处理信息更新
            this.updateHeroInfo(info)
            //}
            return
        }

        //TLog.Debug("ActorManager.updatePlayer",id,info.status)

        let playerObject = this.player_list[id]
        if (playerObject == null) {
            TLog.Debug("ActorManager.updatePlayer %s", tostring(id))
            return
        }

        let oldInfo = playerObject.updatePropertyInfo(info)
        this.buildPlayerAppear(playerObject, info, true)
        if (oldInfo) {
            FireEvent(EventDefine.PLAYER_INFO_UPDATE, ActorUpdateEvent.newObj(playerObject, oldInfo, info))
        }
    }


    // 设置隐藏或者显示玩家,但是显示名字
    setShowPlayerStatus(bOn) {
        // 0为隐藏所有玩家，1为显示
        IGlobal.setting.setRoleSetting(UserSetting.TYPE_BOOLEAN, "showPlayerOn", bOn)
        if (!bOn) {
            this.hideAllPlayer()
        } else {
            this.showAllPlayer()
        }
    }

    getShowPlayerStatus() {
        return IGlobal.setting.getRoleSetting(UserSetting.TYPE_BOOLEAN, "showPlayerOn", true)
        //return true
    }

    hideAllPlayer() {
        for (let key in this.player_list) {
            let value = this.player_list[key]

            this.hidePlayer(key)
        }
    }

    showAllPlayer() {
        //for(let key in this.player_list){
        //		let value = this.player_list[key]
        //
        //	this.showPlayer(key)
        //}
        this.checkMaxPlayerShow()
    }

    hidePlayer(id) {
        let playerObject = this.player_list[id]
        if (playerObject) {
            playerObject.setVisible(false)
        }
    }

    showPlayer(id) {
        let playerObject = this.player_list[id]
        if (playerObject) {
            playerObject.setVisible(true)
        }
    }

    isShowPlayer() {
        return this.bShowPlayer
    }

    setShowPlayer(b: boolean) {
        this.bShowPlayer = b
    }

    checkMaxPlayerShow() {
        if (this.isShowPlayer() == false) {
            this.hideAllPlayer()
            return
        }
        let falg = IGlobal.setting.getRoleSetting(UserSetting.TYPE_BOOLEAN, "showPlayerOn", true)

        if (!falg) {
            return
        }

        let maxPlayerShow = this.MaxPlayerShow
        let heroLevel = GetHeroProperty("level") || 0

        // if(heroLevel <= 10 ){
        //     maxPlayerShow = 5
        // }

        if (size_t(this.player_list) <= maxPlayerShow) {
            for (let key in this.player_list) {
                let playerObject = this.player_list[key]

                playerObject.setVisible(true)
            }
        } else {
            let count = 0
            for (let id in this.player_list) {
                let playerObject = this.player_list[id]

                count = count + 1

                let visible = count <= maxPlayerShow

                let gmbody = playerObject.getProperty("gmBody")
                if (gmbody && gmbody != 0) {
                    visible = true
                }

                if (TeamSystem.getInstance().isTeamMember(id)) {
                    visible = true
                }

                //状态非0
                let status = playerObject.getProperty("status") || 0
                if (status > 0) {
                    visible = true
                }

                let smallTempCount = playerObject.getProperty("smallTempleCount") || 0
                let bigTempleCount = playerObject.getProperty("bigTempleCount") || 0
                if (smallTempCount > 0 || bigTempleCount > 0) {
                    visible = true
                }

                playerObject.setVisible(visible)
            }

        }

    }


    clearAll() {
        //modify:movie
        // let [isMovie, _] = MovieSystem.getInstance().isPlayingMovie()
        // //电影系统有独立的角色管理，当正在播放电影时不处理清除
        // if (isMovie == true) {
        //     return
        // }

        this.clearAllNpc()
        this.clearAllPlayer()
    }

    //////////////////////////////////////////////////////////////////////////////////////////////-
    //外观刷新

    buildNpcAppear(npc, info) {
        let model = 20001
        let nameFontColor = "chartreuse"
        let npcRef = GameConfig.npcConfig[info.entryId]

        if (info.image && info.image != 0) {
            model = info.image
        } else {
            if (npcRef) {
                model = npcRef.model
            }
        }

        if (npcRef && npcRef.different && npcRef.different != "") {
            nameFontColor = npcRef.different
        }

        npc.loadModel(model)
        if (info.name && info.name != "") {
            npc.doCommand(ActorCommand.SetNameColor, nameFontColor)
            npc.doCommand(ActorCommand.SetNameFont, "ht_20_cc_stroke")
            npc.doCommand(ActorCommand.SetName, info.name)
            // let getSuperVipInfo = RoleSystem.getInstance().getOneNpcSay()
            // if (getSuperVipInfo && npcRef.superVIPSay && npcRef.superVIPSay == 1) {
            //     let str = String.format(Localize_cns("SUPER_VIP_NPC_SAY_" + getSuperVipInfo.vipLevel), getSuperVipInfo.name)
            //     npc.doCommand(ActorCommand.AddChatBubble, str, null)
            // }
        }
        //TLog.Debug("ActorManager.buildNpcAppear")
        //TLog.Debug_r(info)
    }

    loadPlayerModel(player, info, bReload?) {
        // //设置外观
        // //player.prepareActionRes("run")
        // let model = GetProfessionModel(info.vocation, info.sexId || genderOptions.MALE)//  PetSystem.getInstance().getPetModel(info.body)
        // //TLog.Debug("model",model)


        // //if(info.isGMPlayer && info.isGMPlayer != 0 ){
        // if (info.image && info.image != 0) {
        //     model = info.image
        // } else if (info.gmBody && info.gmBody != 0) {
        //     let monsterConfig = GameConfig.MonsterConfig[info.gmBody]
        //     if (monsterConfig) {
        //         model = monsterConfig.model != 0 && monsterConfig.model || 4037
        //     }
        // }
        // if (info.luxWedding && info.luxWedding != 0) {
        //     model = 4070
        // }
        //设置外观
        let model = GetProfessionModel(info.vocation, checkNull(info.sexId, genderOptions.MALE), info.rideShapeId, info.heroShapeId)

        //时装模型ID(可能坐骑模型也变了)
        // if(info.heroShapeId != null && info.heroShapeId != 0){
        //     let shapeModel = GetShapeModelId(info.heroShapeId, checkNull(info.sexId , genderOptions.MALE)) 
        //     if(shapeModel > 0){
        //         model = shapeModel
        //     }
        // }

        if (bReload) {
            player.setModelId(-1)
        }

        if (player.getModelId() != model) {
            player.loadModel(model)
            player.changeAction("idle")
        }

        player.setCloth(GetShapeClothId(info.heroShapeId, checkNull(info.sexId, genderOptions.MALE)))
    }

    buildPlayerAppear(player: Player, info, isUpdate?) {
        //TLog.Debug("ActorManager.buildPlayerAppear")
        //TLog.Debug_r(info)
        this.loadPlayerModel(player, info)
        if (!isUpdate) {
            player.setPropertyInfo(info)
        }

        let color = "white"
        if (GetHero().getId() == player.getId()) {
            //TLog.Debug("5555555555555555555555")
            color = "aquamarine"
        }


        //设置名字
        player.doCommand(ActorCommand.SetNameColor, color)
        player.doCommand(ActorCommand.SetNameFont, "ht_20_cc_stroke")
        //player.doCommand(ActorCommand.SetName, info.name)

        let prefix = ""
        //不显示VIP
        // if (info.VIP_level && info.VIP_level > 0) {
        //     prefix = "#VIP" + info.VIP_level
        //     //prefix = "VIP" +info.VIP_level
        // }
        let showNameStr = info.name
        if (info.oldName && info.oldName != "") {
            showNameStr = showNameStr + "#PLAYER_CHANGE_NAME_ICON"
        }
        player.doCommand(ActorCommand.SetName, showNameStr, prefix)

        //外形修改 
        ////PK状态	
        player.doCommand(ActorCommand.SetMoreIcon, false, info)
        //player.doCommand(ActorCommand.SetCaptainIconVisible, false)
        //player.doCommand(ActorCommand.SetTeammateIconVisible, false)
        //TLog.Debug("~ActorManager.buildPlayerAppear~",info.id,info.status)
        //player.doCommand(ActorCommand.setTimeCountDown, true,300000)
        player.doCommand(ActorCommand.SetStrongholdKeyStatus, info.id, info.status)
        if (info.status) {
            let count = 0
            for (let _ in opStatusType) {
                let v = opStatusType[_]
                if (info.status && bit.band(info.status, v) == v) {
                    count = count + 1
                }
            }
            if (info.status && count >= 1) {
                if (count == 1) {
                    //if(info.status == opStatusType.STATUS_TYPE_TEAM ){
                    //	player.doCommand(ActorCommand.SetCaptainIconVisible, true,info.status)
                    //}else if(info.status == opStatusType.STATUS_TYPE_TEAMMATE ){
                    //	player.doCommand(ActorCommand.SetTeammateIconVisible, true,info.status)
                    //}else{
                    player.doCommand(ActorCommand.SetMoreIcon, true, info)
                    //}
                } else {
                    player.doCommand(ActorCommand.SetMoreIcon, true, info)
                }
            }
        }

        //称号
        if (info.heroTitleId != null) {
            player.doCommand(ActorCommand.SetChengHaoTitle, info.heroTitleId)
        }


        //ModelEffect.csv的ID
        //坐骑
        player.setRide(GetShapeEffectId(info.rideShapeId), GetShapeRideOffY(info.rideShapeId))

        //神兵
        player.setWeaponId(GetShapeWeaponId(info.vocation, info.sexId, info.rideShapeId, info.weaponShapeId))
        //翅膀
        player.setWing(GetShapeEffectId(info.wingShapeId))


        let bShowFollow = true

        if (GetActivity(ActivityDefine.AnswerQuestion).isStart() || GetActivity(ActivityDefine.WuLin).isStart()
            || GetActivity(ActivityDefine.Stronghold).isStart()) {
            bShowFollow = false
        }

        if (bShowFollow) {
            //============天仙============
            //跟随
            player.setFollowTianxian(GetShapeModelId(info.tianxianShapeId))

            //============宠物============
            //跟随
            let flyexp = info.flystageexp || 0
            let model = null
            model = GetShapePetModel(info.petShapeId, flyexp)
            player.setFollowPet(model || GetPetModel(info.petShapeId))
            let pet: Pet = player.getFollowPet()
            if (pet) {
                //通灵
                pet.setFootBindEffect(GetShapeEffectId(info.petTLShapeId))

                //兽魂(类似天仙的小精灵)
                pet.setShouHunEffect(GetShapeEffectId(info.petSHShapeId))
            }

            //============仙侣============
            //跟随
            player.setFollowXianlv(GetXianlvModel(info.xianlvShapeId))
            let xianlv: Pet = player.getFollowXianlv()
            if (xianlv) {
                //法阵
                xianlv.setFootBindEffect(GetShapeEffectId(info.xlFZShapeId))
                //仙位（称号）
                if (info.xlXWShapeId != null) {
                    xianlv.doCommand(ActorCommand.SetChengHaoTitle, info.xlXWShapeId)
                }
            }
        } else {
            player.setFollowTianxian(-1)
            player.setFollowPet(-1)
            player.setFollowXianlv(-1)
        }




        //特定特效
        //let showFairy = true
        //if(GetActivity(ActivityDefine.PuzzlePalace):isStart() || (info.gmBody && info.gmBody != 0) ){					//GM模型具有最高优先级
        //	showFairy = false
        //}
        //if(info.luxWedding && info.luxWedding != 0 ){				//花车模型具有最高优先级
        //	showFairy = false
        //}
        ////TLog.Debug("fdsf",showFairy)
        //if(info.followFairyId!=null && info.followFairyId != 0 && showFairy ){	
        //	let followFairyLevel = info.followFairyLevel
        //	player.setFollowPet( FairySystem.getInstance().getFairyModel(followFairyLevel) )
        //	//精灵跟随}
        //}else{
        //	player.setFollowPet(null)
        //}

    }

    buildActorCommonAppear(actor, info) {
        let model = GetActorModel(info.entry)
        if (info.image && info.image != 0) {
            model = info.image
        }
        actor.loadModel(model)

        if (FightSystem.getInstance().isFight()) {
            actor.doCommand(ActorCommand.SetNameColor, "springgreen")
        } else {
            actor.doCommand(ActorCommand.SetNameColor, "white")
        }
        actor.doCommand(ActorCommand.SetName, info.name)
    }

    buildPetAppear(pet, info) {
        //this.buildActorCommonAppear(pet, info)
        let flyexp = info.flystageexp || 0
        let model = GetShapePetModel(info.entry, flyexp)
        if (info.image && info.image != 0) {
            model = info.image
        }
        pet.loadModel(model)

        if (FightSystem.getInstance().isFight()) {
            pet.doCommand(ActorCommand.SetNameColor, "springgreen")
        } else {
            pet.doCommand(ActorCommand.SetNameColor, "white")
        }
        pet.doCommand(ActorCommand.SetName, info.name)

        //通灵
        pet.setFootBindEffect(GetShapeEffectId(info.petTLShapeId))

        //兽魂(类似天仙的小精灵)
        pet.setShouHunEffect(GetShapeEffectId(info.petSHShapeId))
    }

    buildMonsterAppear(monster, info) {
        let modelId = 20001
        // if (GAME_MODE == GAME_TOOL && TOOL_MODE == 1) {
        //     modelId = info.model
        // } else 
        if (info.image && info.image != 0) {
            modelId = info.image
        } else {
            modelId = GetActorModel(info.entry)
        }

        monster.loadModel(modelId)
        monster.doCommand(ActorCommand.SetNameColor, "springgreen")
        monster.doCommand(ActorCommand.SetName, info.name)
    }

    //仙侣
    buildXianLvAppear(xianlv, info) {
        this.buildActorCommonAppear(xianlv, info)

        xianlv.setFootBindEffect(GetShapeEffectId(info.xlFZShapeId))
        //仙位（称号）
        if (info.xlXWShapeId != null) {
            xianlv.doCommand(ActorCommand.SetChengHaoTitle, info.xlXWShapeId)
        }
    }

    //天女
    buildTianNvAppear(tiannv, info) {
        let model = 20001

        if (info.image && info.image != 0) {
            model = info.image
        }
        tiannv.loadModel(model)

        if (FightSystem.getInstance().isFight()) {
            tiannv.doCommand(ActorCommand.SetNameColor, "springgreen")
        } else {
            tiannv.doCommand(ActorCommand.SetNameColor, "white")
        }
        tiannv.doCommand(ActorCommand.SetName, info.name)
    }

    //////////////////////////////////////////////////////////////////////////////////////////////-
    //控制逻辑

    setTargetActor(actor) {
        if (actor == null) {
            if (this.targetActor) {
                FireEvent(EventDefine.ACTOR_LOSTFUCOS, ActorFocusEvent.newObj(this.targetActor, 0))
                this.targetActor = null
                this.targetActorTouchTimes = 0
            }
        } else {
            //如果是被点击过了，则记录被点击的次数+1
            if (this.targetActor && this.targetActor == actor) {
                this.targetActorTouchTimes = this.targetActorTouchTimes + 1
            } else {
                //如果没被点过，先检查之前是不是有被点击过的actor，如果有则发出LostFocus事件
                if (this.targetActor) {
                    FireEvent(EventDefine.ACTOR_LOSTFUCOS, ActorFocusEvent.newObj(this.targetActor, 0))
                }
                this.targetActorTouchTimes = 1
                this.targetActor = actor
            }
            //最后再发出被点击事件
            FireEvent(EventDefine.ACTOR_GOTFUCOS, ActorFocusEvent.newObj(actor, this.targetActorTouchTimes))
        }
    }


    getTargetActor() {
        return this.targetActor
    }


    objectMove(Id, Type, CellX, CellY) {
        if (Type == objectType.OBJECT_TYPE_PLAYER) {  //人物角色移动
            let hero = this.getHero()

            if (Id == hero.getId()) { //主角位置变化
                MapSystem.getInstance().resetHeroPosition(CellX, CellY)
            } else {
                if (hero.getHeroSpace() == null) {
                    let playerObject = this.getPlayer(Id)
                    if (playerObject) {
                        playerObject.setMoveTargetPos(newPos(CellX, CellY))
                        //挂机时候，客户端仿真玩家，玩家的移动不可用
                        if (playerObject.isNetMoveEnable()) {
                            playerObject.wantToGoByCell(CellX, CellY)
                        }
                    }
                }
            }
        }

        FireEvent(EventDefine.OBJECT_MESSAGE_MOVE, MessageMoveEvent.newObj(Id, Type, CellX, CellY))
    }


    onActiveDrama(args) {
        if (args.stateType == state_type.LIVE_DRAMA_STATE) {
            for (let _ in this.player_list) {
                let player = this.player_list[_]

                player.setVisible(false)
            }
        }
    }



    onDeActiveDrama(args) {
        if (args.stateType == state_type.LIVE_DRAMA_STATE) {
            for (let _ in this.player_list) {
                let player = this.player_list[_]

                player.setVisible(true)
            }

            //for(let _ in this.npc_list){
            //	let npc = this.npc_list[_]
            //
            //	npc.setVisible(true)
            //}
        }
    }

    onHeroEnterGame(args) {
        for (let id in this.player_list) {
            let _ = this.player_list[id]

            this.updatePlayer(id, {})
        }
    }

    onHeroEnterMap(args) {
        for (let id in this.player_list) {
            let player = this.player_list[id]

            player.clearTraceEffect()
        }
    }


    //////////////////////////////-对象缓冲////////////////////////////////
    addObjectStorage(callBack, obj, param) {
        if (this.actorStorage.length == 0) {
            return false
        }

        let count = this.actorStorage.length
        let storage = this.actorStorage[count - 1]

        let t: any = {}
        t.callBack = callBack
        t.obj = obj
        t.param = param

        JsUtil.arrayInstert(storage, t)
        // if (this.checkInMessage(storage, param)) {
        //     JsUtil.arrayInstert(storage, t)
        // }
        return true
    }

    // checkInMessage(storage, param) {
    //     //创建与清除
    //     let mutexMessage: any = {
    //         //["Message_G2C_ROLE_ADD"] 		: "Message_G2C_DISAPPEAR",
    //         ["Message_G2C_DISAPPEAR"]: "Message_G2C_ROLE_ADD",
    //         //["Message_G2C_ROLE_CHANGE"]	: "Message_G2C_ROLE_ADD",
    //     }

    //     let name = mutexMessage[param.classname] || null
    //     if (name == null) {
    //         return true
    //     }

    //     let index = -1
    //     let id = param.info == null ? param.id : param.info.id
    //     let updateList = []

    //     for (let i = storage.length - 1; i >= 0; i--) {
    //         let elem = storage[i]

    //         //消息队列中“删除操作”之前对应一个“创建操作“
    //         let mId = elem.param.info == null ? elem.param.id : elem.param.info.id
    //         if (mId == id) {
    //             if (name == elem.param.classname) {
    //                 index = i
    //                 break
    //             } else if (elem.param.classname == "Message_G2C_ROLE_CHANGE") {
    //                 //介乎一对（创建和删除）之间的属性更新操作
    //                 JsUtil.arrayInstert(updateList, elem)
    //             }
    //         }
    //     }

    //     if (index != -1 && param.classname != "Message_G2C_ROLE_CHANGE") {
    //         JsUtil.arrayRemove(storage, index)
    //         for (let _ in updateList) {
    //             let msg = updateList[_]

    //             table_remove(storage, msg)
    //         }

    //         return false
    //     } else if (param.classname != "Message_G2C_ROLE_CHANGE") {
    //         return true
    //     } else if (index == -1) {							//index == 0 && "Message_G2C_ROLE_CHANGE"
    //         return false
    //     }
    //     return true
    // }

    //////////////////////////////////////////////////////////////////////////
    //-保存查看玩家的宠物和团队技能信息
    // SetPalyInfo(petList, petMagicStone) {
    //     let newPetList = []
    //     for (let i = 0; i < petList.length; i++) {
    //         let v = petList[i]

    //         if (v.objectType == objectType.OBJECT_TYPE_VACATIONER) {
    //             JsUtil.arrayInstert(newPetList, v)
    //         }
    //     }

    //     for (let i = 0; i < petList.length; i++) {
    //         let v = petList[i]

    //         if (v.objectType != objectType.OBJECT_TYPE_VACATIONER) {
    //             JsUtil.arrayInstert(newPetList, v)
    //         }
    //     }

    //     this.petList = newPetList
    //     this.petMagicStone = petMagicStone
    // }

    //////////////////////////////////////////////////////////////////////////
    //-返回查看玩家的宠物和团队技能信息
    // GetPlayerInfo() {
    //     return this.petList//, this.petMagicStone
    // }
}