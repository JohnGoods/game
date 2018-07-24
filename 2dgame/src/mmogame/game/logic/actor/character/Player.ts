

// function getPetFollowInfo(followType) { //宠物跟踪信息
//     let followInfo: any = {}
//     if (followType == "pet") {
//         followInfo.allowX = 6		        //允许范围
//         followInfo.allowY = 6		        //允许范围
//         //followInfo.stopAdjust = true       //stop时是否马上调整位置、方向
//         followInfo.defaultOffx = 3                //默认偏移位置
//         followInfo.defaultOffy = 3                //默认偏移位置
//     } else if (followType == "xianlv") {    //仙侣
//         followInfo.allowX = 12		        //允许范围
//         followInfo.allowY = 12		        //允许范围
//         // followInfo.stopAdjust = true       //stop时是否马上调整位置、方向
//         followInfo.defaultOffx = 6                //默认偏移位置
//         followInfo.defaultOffy = 6                //默认偏移位置
//     } else if (followType == "tianxian") {  //天仙
//         followInfo.allowX = 4		        //允许范围
//         followInfo.allowY = 4		        //允许范围
//         // followInfo.stopAdjust = true       //stop时是否马上调整位置、方向
//         followInfo.defaultOffx = 2                //默认偏移位置
//         followInfo.defaultOffy = 2                //默认偏移位置
//     }
//     //followInfo.head  = 1      //宠物开始走的位置
//     return followInfo
// }


class Player extends Character {

    mFollowerList: any;
    head: number
    space: any;



    //maskid: number;

    //maskEffect: Effect;
    wingid: number;
    wingEffect: Effect;

    leftWeaponId: number;
    //rightWeaponId: number;
    leftWeaponEffect: Effect;
    //rightWeaponEffect: Effect;

    rideid: number;
    rideOffsetY: number;
    rideEffect: Player;

    clothid: number;
    clothEffect: Effect;

    traceEffectList: Effect[];
    curDir: number

    moveTargetPos: any;
    bNetMoveEnable: boolean;

    followInfoMap:any;

    //deleyWingTimerId: number;

    public initObj(...args: any[]): void {
        this.setMovementNotifyEnable(true)
        this.setMovingNotifyEnable(true)
        this.mFollowerList = {}
        this.head = 1
        this.space = null

        this.wingid = -1
        this.wingEffect = null

        this.rideid = -1
        this.rideOffsetY = 0
        this.rideEffect = null

        this.clothid = -1
        this.clothEffect = null

        //this.maskid = -1
        //this.maskEffect = null


        this.leftWeaponId = -1
        // this.rightWeaponId = -1
        this.leftWeaponEffect = null
        //this.rightWeaponEffect = null

        this.traceEffectList = []
        this.curDir = 0

        this.moveTargetPos = null
        this.bNetMoveEnable = true

        this.actorType = actor_Type.ACTOR_TYPE_PLAYER;

        this.addAliasAction("idle", "combat_idle")
        this.addAliasAction("combat_idle", "idle")

        this.followInfoMap = {}
    }


    setHeroSpace(space) {
        this.space = space
    }

    getHeroSpace() {
        return this.space
    }

    destory() {
        this.clearFollower()
        this.deleteWing()
        //this.deleteMask()
        this.deleteWeapon()

        this.clearTraceEffect()
        this.deleteRide()
    }


    setVisible(selfVisible, petVisible?) {         //第二个参数控制宠物的显示，默认是宠物与玩家同时显示或隐藏
        let visible = petVisible || selfVisible

        super.setVisible(selfVisible);

        for (let _ in this.mFollowerList) {
            let followActor = this.mFollowerList[_]
            if (followActor != null) {
                followActor.setVisible(selfVisible);
            }
        }
        if(selfVisible){
            this.updateFollowModelPos()
        }
    }

     getTargetPos(followInfo, cellX?, cellY?) {
        let heroDir = this.getDir()
        cellX = checkNull(cellX, this.getCellX())
        cellY = checkNull(cellY, this.getCellY())
        
         let dirOffsetMap: any = {
           
            [0]: [followInfo.defaultOffx, 0],
            [1]: [followInfo.defaultOffx, -followInfo.defaultOffy],
            [2]: [0, -followInfo.defaultOffy],
            [3]: [-followInfo.defaultOffx, -followInfo.defaultOffy],
            [4]: [-followInfo.defaultOffx, 0],
            [5]: [-followInfo.defaultOffx, followInfo.defaultOffy],
            [6]: [0, followInfo.defaultOffy],
            [7]: [followInfo.defaultOffx, followInfo.defaultOffy],
            
        }

        return {x:cellX+ dirOffsetMap[heroDir][0], y:cellY + dirOffsetMap[heroDir][1]}
    }

    getPetFollowInfo(followType) { //宠物跟踪信息

        let followInfo = this.followInfoMap[followType]
        if(followInfo == null){
            followInfo = {}
            if (followType == "pet") {
                followInfo.allowX = 6		        //允许范围
                followInfo.allowY = 6		        //允许范围
                //followInfo.stopAdjust = true       //stop时是否马上调整位置、方向
                followInfo.defaultOffx = 3                //默认偏移位置
                followInfo.defaultOffy = 3                //默认偏移位置
            } else if (followType == "xianlv") {    //仙侣
                followInfo.allowX = 12		        //允许范围
                followInfo.allowY = 12		        //允许范围
                // followInfo.stopAdjust = true       //stop时是否马上调整位置、方向
                followInfo.defaultOffx = 6                //默认偏移位置
                followInfo.defaultOffy = 6                //默认偏移位置
            } else if (followType == "tianxian") {  //天仙
                followInfo.allowX = 3		        //允许范围
                followInfo.allowY = 3		        //允许范围
                // followInfo.stopAdjust = true       //stop时是否马上调整位置、方向
                followInfo.defaultOffx = 1                //默认偏移位置
                followInfo.defaultOffy = 1                //默认偏移位置
            }
        }        
        //followInfo.head  = 1      //宠物开始走的位置
        return followInfo
    }

    updateFollowModelPos(){
         for (let fType in this.mFollowerList) {
            let followActor = this.mFollowerList[fType]

            let followInfo = this.getPetFollowInfo(fType)
            let pos = this.getTargetPos(followInfo)
            
            followActor.setCellXY(pos.x, pos.y)
            
        }
    }

    initFollowModel(followType, modelId) {
        if (modelId != null && modelId > 0) {
            let pet = this.mFollowerList[followType]
            if (pet == null) {
                pet = Pet.newObj(this)
                pet.loadModel(modelId)
                pet.enterMap()
                let pos = this.getCellXY()

                let followInfo = this.getPetFollowInfo(followType)
                let targetPos = this.getTargetPos(followInfo)
                pet.setCellXY(targetPos.x , targetPos.y)

                let heroDir = this.getDir()
                pet.setDir(heroDir)
                pet.changeAction("idle")

                this.mFollowerList[followType] = pet
            } else {
                pet.loadModel(modelId)
            }

            if (!this.isVisible()) {
                pet.setVisible(false)
            }
        } else {
            if (this.mFollowerList[followType]) {
                this.mFollowerList[followType].deleteObj()
                delete this.mFollowerList[followType]
            }
        }
    }

    clearFollower() {
        for (let _ in this.mFollowerList) {
            let followActor = this.mFollowerList[_]
            if (followActor != null) {
                followActor.deleteObj()
            }
        }
        this.mFollowerList = {}
    }

    setFollowPet(modelId) {
        this.initFollowModel("pet", modelId)
    }

    getFollowPet() {
        return this.mFollowerList["pet"]
    }

    setFollowXianlv(modelId) {
        this.initFollowModel("xianlv", modelId)
    }

    getFollowXianlv() {
        return this.mFollowerList["xianlv"]
    }

    setFollowTianxian(modelId) {
        this.initFollowModel("tianxian", modelId)
    }



    onMoveBegin(args) {
        super.onMoveBegin(args);


        FireEvent(EventDefine.PLAYER_MOVE_BEGIN, ActorEvent.newObj(this))
    }

   

    onMoveStop(args) {
        super.onMoveStop(args);
        let heroCellX = this.getCellX()
        let heroCellY = this.getCellY()
        let nowTime = GetCurMillSec()
        for (let fType in this.mFollowerList) {
            let followActor = this.mFollowerList[fType]

            let followInfo = this.getPetFollowInfo(fType)
            let followCellX = followActor.getCellX()
            let followCellY = followActor.getCellY()
            followActor.lastFollowTime = nowTime //重置跟随时间
            //if (followInfo.stopAdjust == true) {
               
               if ((Math.abs(followCellX - heroCellX) <= followInfo.allowX) && (Math.abs(followCellY - heroCellY) <= followInfo.allowY)) {

               }else{
                    let pos = this.getTargetPos(followInfo)
                    // let speed = this.getMoveSpeed()
                    // //let dirOffset = dirOffsetMap[heroDir] || [0, 0]
                    // followActor.setMoveSpeed(1.2 * speed)
                    followActor.wantToGoByCell(pos.x, pos.y, true)
               }
            //}
        }


        FireEvent(EventDefine.PLAYER_MOVE_STOP, ActorEvent.newObj(this))
    }

    onMoving(args) {
        // let cellX = this.getCellX()
        // let cellY = this.getCellY()
        // console.log("onMoveing", cellX, cellY)
        let heroCellX = this.getCellX()
        let heroCellY = this.getCellY()
        let moveSpeed = this.getMoveSpeed()
        let nowTime = GetCurMillSec()
        //宠物跟随
        for (let fType in this.mFollowerList) {
            let followActor = this.mFollowerList[fType]

            let followInfo = this.getPetFollowInfo(fType)
            let followCellX = followActor.getCellX()
            let followCellY = followActor.getCellY()
            followActor.setMoveSpeed( moveSpeed)

            //无效步数
            if ((Math.abs(followCellX - heroCellX) <= followInfo.allowX) && (Math.abs(followCellY - heroCellY) <= followInfo.allowY)) {
                //followActor.setMoveSpeed( moveSpeed)
            }else{
                if(followActor.lastFollowTime == null){
                    followActor.lastFollowTime = 0
                }
                if(nowTime - followActor.lastFollowTime > 500){
                    followActor.lastFollowTime = nowTime
                    let pos = this.getTargetPos(followInfo)
                    //followActor.setMoveSpeed(1.5 * moveSpeed)
                    if(SceneManager.getInstance().isBlock(pos.x, pos.y) == false){
                        followActor.wantToGoByCell(pos.x, pos.y, true)
                    }else{
                        followActor.wantToGoByCell(this.moveTargetCellX, this.moveTargetCellY)
                    }

                }
            }
           
            //if(followActor.isMoving() ){
            //	return
            //}
            
           
        }
        FireEvent(EventDefine.PLAYER_MOVE, ActorEvent.newObj(this))
    }

    hasStatus(v) {
        if (this.propertyInfo == null) {
            return false
        }
        return bit.band(this.propertyInfo.status, v) == v
    }


    onPropertyChange() {
        this.id = this.propertyInfo.id

        let count = 0
        for (let _ in opStatusType) {
            let v = opStatusType[_]

            if (this.propertyInfo.status && bit.band(this.propertyInfo.status, v) == v) {
                count = count + 1
            }
        }
        //TLog.Debug("Player.onPropertyChange")
        //TLog.Debug_r(this.propertyInfo)
        //设置军团信息
        let factionStr = ""
        let heroInfo = GetHeroPropertyInfo()

        if (this.propertyInfo["faction"] && this.propertyInfo["factionName"] && this.propertyInfo["factionPos"] && this.propertyInfo["faction"] > 0) {
            let posName = ClubSystem.getInstance().getPosName(this.propertyInfo["factionPos"])
            if (!posName) {
                posName = ""
            }
            let fontName = "#darksalmon"
            //darkorange
            if (heroInfo && this.propertyInfo["faction"] == heroInfo["faction"]) {
                fontName = "#darkorange"
            }
            //if(ClubSystem.getInstance().GetIsInMyUnion(this.propertyInfo["faction"]) ){
            //	fontName = "#lime"
            //}
            let factionName = this.propertyInfo["factionName"]
            factionStr = fontName + String.format("[%s]%s", posName, factionName)
        }
        this.doCommand(ActorCommand.SetFactionName, factionStr)

        if (this.propertyInfo.status && count >= 1) {
            this.doCommand(ActorCommand.SetMoreIcon, true, this.propertyInfo)
        } else {
            this.doCommand(ActorCommand.SetMoreIcon, false, this.propertyInfo)
        }
    }

    clearTraceEffect() {
        for (let _ in this.traceEffectList) {
            let v = this.traceEffectList[_]

            v.deleteObj()
        }

        this.traceEffectList = []

        this.curDir = this.getDir()
    }

    handleAnimNotify(notify, effect) {
        if (notify == "end") {
            table_remove(this.traceEffectList, effect)
        }
    }

    onStateChange(oldState, curState) {
        //TLog.Warn("Character.onStateChange old:%s, cur:%s", tostring(oldState), tostring(curState))

        let bHandle = super.onStateChange(oldState, curState)


        if (this.stateMrg.isActionState(curState)) {
            if (curState == characterState.actionState_move) {
                if (this.wingEffect) {
                    this.wingEffect.setVisibleRaw(true)
                    this.wingEffect.changeAction("run")
                }
            } else if (curState == characterState.actionState_idle) {
                if (this.wingEffect) {
                    this.wingEffect.setVisibleRaw(true)
                    this.wingEffect.changeAction("idle")
                }
            } else {
                if (this.wingEffect) {
                    this.wingEffect.setVisibleRaw(false)
                }
            }
        }


        return bHandle
    }




    loadModel(modelId) {
        if (this.modelId == modelId) {
			return;
		}
        let wingid = this.wingid
        let rideid = this.rideid
        let rideOffsetY = this.rideOffsetY
        let clothid = this.clothid
        //let maskid = this.maskid

        let leftWeaponId = this.leftWeaponId
        //let rightWeaponId = this.rightWeaponId

        this.deleteWing()
        //this.deleteMask()
        this.deleteRide()
        this.deleteWeapon()
        this.deleteCloth()
        this.wingid = -1
        this.rideid = -1
        this.clothid = -1
        //this.maskid = -1

        this.leftWeaponId = -1
        //this.rightWeaponId = -1


        super.loadModel(modelId)
        this.setCloth(clothid)
        this.setWing(wingid)
        //this.setMask(maskid)
        this.setRide(rideid, rideOffsetY)
        this.setWeaponId(leftWeaponId)
       
    }


    // clearModelEffect() {
    //     this.deleteWing()
    //     //this.deleteMask()
    //     this.deleteRide()
    //     this.deleteWeapon()
    //     this.deleteCloth()
    //     this.wingid = -1
    //     this.rideid = -1
    //     //this.maskid = -1

    //     this.leftWeaponId = -1
    //     this.clothid = -1
    //     // this.rightWeaponId = -1
    // }


    setWing(wingid) {
        wingid = wingid || 0

        if (this.wingid == wingid) {
            return
        }

        this.deleteWing()
        this.wingid = -1
        if (wingid <= 0) {
            return
        }
        this.wingid = wingid


        //if (this.rideid < 0) {
        let boneParam: any = {}
        boneParam.name = "wing_point"
        boneParam.order = 0
        boneParam.transfrom = true

        //修改plist配置尺寸，翅膀降低高度
        this.wingEffect = EffectManager.getInstance().createBindEffect(wingid, this, boneParam, true)
        // if (this.stateMrg.isState(characterState.actionState_idle)) {
        //     this.wingEffect.changeAction("idle")
        // } else if (this.stateMrg.isState(characterState.actionState_move)) {
        //     this.wingEffect.changeAction("run")
        // }
        // this.wingEffect.setPositionXY(0, 10)
        //}

    }

    deleteWing() {

        if (this.wingEffect) {
            this.wingEffect.deleteObj()
            this.wingEffect = null

            this.updateBoundRect()
        }

        // if (this.deleyWingTimerId) {
        //     KillTimer(this.deleyWingTimerId)
        //     this.deleyWingTimerId = null
        // }
    }

    deleteRide() {
        if (this.rideEffect) {
            this.rideEffect.deleteObj()
            this.rideEffect = null

            this.rideOffsetY = 0
            this.setPositionOffset(0, 0)
        }
    }


    setRide(rideid, offsety?) {

        rideid = rideid || 0

        if (this.rideid == rideid) {
            return
        }

        this.deleteRide()
        this.rideid = -1
        if (rideid <= 0) {
            return
        }
        this.rideid = rideid


        let boneParam: any = {}
        boneParam.name = "ride_point"
        boneParam.order = 0
        boneParam.transfrom = true

        this.rideEffect = EffectManager.getInstance().createBindEffect(rideid, this, boneParam, true)
        this.rideEffect.addAliasAction("attack", "idle")
        this.rideEffect.addAliasAction("spell", "idle")
        this.rideEffect.addAliasAction("combat_idle", "idle")
        this.rideEffect.setBoundNotifyEnable(true)

        if (offsety != null) {
            this.rideOffsetY = offsety
            this.setPositionOffset(0, -offsety)
        }

    }

    deleteCloth() {
        if (this.clothEffect) {
            this.clothEffect.deleteObj()
            this.clothEffect = null
        }
    }


    setCloth(clothid) {

        clothid = clothid || 0

        if (this.clothid == clothid) {
            return
        }

        this.deleteCloth()
        this.clothid = -1
        if (clothid <= 0) {
            return
        }
        this.clothid = clothid


        let boneParam: any = {}
        boneParam.name = "cloth_point"
        boneParam.order = 0
        boneParam.transfrom = true

        this.clothEffect = EffectManager.getInstance().createBindEffect(clothid, this, boneParam, true)
        this.clothEffect.setBoundNotifyEnable(true)

    }



    setNetMoveEnable(bEnable) {
        this.bNetMoveEnable = bEnable
    }

    isNetMoveEnable(bEnable) {
        return this.bNetMoveEnable
    }

    setMoveTargetPos(pos) {
        this.moveTargetPos = pos
    }

    getMoveTargetPos() {
        return this.moveTargetPos
    }

    setWeaponId(leftWeaponId) {
        leftWeaponId = leftWeaponId || 0
        //rightWeaponId = rightWeaponId || 0


        //if (this.leftWeaponId == leftWeaponId && this.rightWeaponId == rightWeaponId) {
        if (this.leftWeaponId == leftWeaponId) {
            return
        }

        this.deleteWeapon()
        this.leftWeaponId = -1
        //this.rightWeaponId = -1

        if (leftWeaponId > 0) {
            this.leftWeaponId = leftWeaponId
            //if (this.rideid < 0) {
            let boneParam: any = {}
            boneParam.name = "leftweapon"
            boneParam.order = 0
            boneParam.transfrom = true

            //10000 showid不存在，则取defaultid-1
            //this.changePartShow("leftweapon", 10000, -1)

            this.leftWeaponEffect = EffectManager.getInstance().createBindEffect(leftWeaponId, this, boneParam, true)
            //}
        }


    }

    deleteWeapon() {

        let bUpdate = false
        if (this.leftWeaponEffect) {
            this.leftWeaponEffect.deleteObj()
            this.leftWeaponEffect = null

            bUpdate = true;

        }

        if (bUpdate) {
            this.updateBoundRect()
        }
    }


    restoreFollowAppear() {
        ActorManager.getInstance().buildPlayerAppear(this, this.getPropertyInfo(), true)
    }


    clearFollowAppear() {
        this.setFollowTianxian(-1)
        this.setFollowPet(-1)
        this.setFollowXianlv(-1)
    }
}