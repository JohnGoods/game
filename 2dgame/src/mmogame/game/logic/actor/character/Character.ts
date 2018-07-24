/*
作者:
    yangguiming
	
创建时间：
   2013.6.18(周二)

意图：
	player,monster,npc基类
  1.角色移动
  2.角色有限状态机(管理一般表现行为)
  3.角色属性

公共接口：
  //public initObj(...args:any[]):void {
	//destory(){
	//getActorType(){
	//onAppearChange(){							//角色外观变化（变大变小、更换模型等chufa ）
	
	//移动相关
	//wantToGo( x, y, ignoreBlock){
	//wantToGoByCell( cellx, celly, ignoreBlock){
	//moveStop(){
	//setMoveSpeed( speed){
	//getMoveSpeed(){
	//setMovementNotifyEnable( enable){//是否需要通知移动时间，默认不通知
	
	//状态相关
	//isState( state){
	//getStateMrg(){
	//switchToState( state){
	
	//角色属性
	//setPropertyInfo( info){
	//getPropertyInfo(){
	//updatePropertyInfo( info){ //info会被修改，更新属性
	//getProperty( key){
	
	//重载
	//onMoveBegin( args){
	//onMoving( args){
	//onMoveStop( args){
	

	//重载实现
	//onPropertyChange(){ //属性改变
	//onMovementEvent( args){
	//onEnterMap(){
	//onLeaveMap(){
	
	//响应命令
	//doCommand( cmdId, param1, param2){
*/

let s_uiComponentPool:ActorCmdComponent_UI[] = []

function CreateUIComponent(character){
	if(s_uiComponentPool.length == 0 ){
		JsUtil.arrayInstert(s_uiComponentPool, ActorCmdComponent_UI.newObj(character))
	}
	let component = JsUtil.arrayRemove(s_uiComponentPool)
	component.initWithReuse(character)
	component.onAttach()
	return component
}

function ReleaseUIComponent(component:ActorCmdComponent_UI){
	component.onDeattach()
	if(s_uiComponentPool.length >= 50 ){
		component.deleteObj()
		return
	}
	JsUtil.arrayInstert(s_uiComponentPool, component)
}

function ClearAllUIComponent() {
    for(let _ in s_uiComponentPool){
        let component = s_uiComponentPool[_]
        component.deleteObj()
    }
     s_uiComponentPool = []
}


class Character extends Actor {
    stateMrg: CharacterFSM;

    propertyInfo: any;
    id: number;
    curState: number;

    beginMoveCallback: Function;
    stopMoveCallback: Function;
    movingCallback: Function;
    moveCallbackObj: any;

    insideEffectList: Effect[];


     footEffect:Effect
     footEffectId:number

     moveTargetCellX:number;
     moveTargetCellY:number;

     uiCompoenent:ActorCmdComponent_UI;

    //Character.fontKey = "ht_20_lc"

    public initObj(...args: any[]): void {
        this.id = 0
        this.propertyInfo = null //人物属性
        this.stateMrg = CharacterFSM.newObj(this)//有限状态机	

        this.actorType = actor_Type.ACTOR_TYPE_CHARACTER;

        this.curState = characterState.nullState

        //默认是在可见时update,可见时移动
        this.realActor.addEventListener(map.SpriteMovEvent.MovementEvent, this.onMovementEvent, this);

        this.uiCompoenent = CreateUIComponent(this)

        this.addCommandComponent(ActorCmdComponent_Effect.newObj(this))
        this.addCommandComponent(this.uiCompoenent)
        this.addCommandComponent(ActorCmdComponent_Visual.newObj(this))
        this.doCommand(ActorCommand.SetShadowVisible, true, null)

        //监听动画动作
        this.setAnimNotifyEnable(true)
        this.setBoundNotifyEnable(true)
        this.setBoundActionId("idle")


        this.moveTargetCellX = 0
        this.moveTargetCellY = 0


        this.beginMoveCallback = null
        this.stopMoveCallback = null
        this.movingCallback = null
        this.moveCallbackObj = null

        this.insideEffectList = []
    }


    protected destory() {
        if (this.stateMrg) {
            this.stateMrg.deleteObj()
            this.stateMrg = null
        }

        this.deleteFootEffect()

        this.insideEffectList = []

        if(this.uiCompoenent){
            this.removeCommandComponent(this.uiCompoenent)
        }
    }

    removeCommandComponent(handle: ActorCmdComponent) {
		super.removeCommandComponent(handle)
        if(this.uiCompoenent && this.uiCompoenent == handle){
            ReleaseUIComponent(this.uiCompoenent)
            this.uiCompoenent = null
        }
	}


    loadModel(modelId) {
        let footEffectId = this.footEffectId
        //let rightWeaponId = this.rightWeaponId

        this.deleteFootEffect()
        this.footEffectId = -1

        super.loadModel(modelId)
        this.setFootBindEffect(footEffectId)

    }

    getId() {
        return this.id
    }

    getName() {
        if (this.propertyInfo == null) {
            return "Error"
        }
        return this.propertyInfo.name
    }

    setMovementNotifyEnable(enable) {
        if (enable) {
            this.realActor.addReportFlag(map.MoveReportFlag.MOVEMENT_BEGIN_RUN)
            this.realActor.addReportFlag(map.MoveReportFlag.MOVEMENT_STOPING)
        } else {
            this.realActor.removeReportFlag(map.MoveReportFlag.MOVEMENT_BEGIN_RUN)
            //this.realActor:RemoveReportFlag(map.IRenderActor.MOVEMENT_CELL_CHANGED)
            this.realActor.removeReportFlag(map.MoveReportFlag.MOVEMENT_STOPING)
        }

    }

    setMovingNotifyEnable(enable) {
        if (enable) {
            this.realActor.addReportFlag(map.MoveReportFlag.MOVEMENT_CELL_CHANGED)
        } else {
            this.realActor.removeReportFlag(map.MoveReportFlag.MOVEMENT_CELL_CHANGED)
        }
    }



    wantToGo(x, y, ignoreBlock) {
        if (this.isEnterMap() == false)
            return false;

        if (!this.stateMrg.canToState(characterState.actionState_move)) {
            TLog.Debug("Character.wantToGo cann't go due to state block");
            return false;
        }

        ignoreBlock = !!ignoreBlock;

        return this.realActor.moveTo(x, y, ignoreBlock);
    }

    wantToGoByCell(cellx, celly, ignoreBlock) {
        this.moveTargetCellX = cellx
        this.moveTargetCellY = celly
        var result = SceneManager.getInstance().cellXYtoMapXY(cellx, celly);
        return this.wantToGo(result.x, result.y, ignoreBlock);
    }


    moveStop() {
        if (this.isEnterMap() == false)
            return;
        this.realActor.moveStop();
    }

    setMoveSpeed(speed) {
        this.realActor.setMoveSpeed(speed);
    }

    getMoveSpeed() {
        return this.realActor.getMoveSpeed();
    }

    getStateMrg() {
        return this.stateMrg
    }

    isState(state) {
        return this.stateMrg.isState(state)
    }

    switchToState(state) {
        if (this.stateMrg == null)
            return false;
        if (this.stateMrg.canToState(state)) {
            this.stateMrg.setState(state)
            return true
        }
        return false
    }

    setPropertyInfo(info) {
        this.propertyInfo = info

        this.onPropertyChange()
    }

    getPropertyInfo() {
        return this.propertyInfo
    }

    updatePropertyInfo(info, resetInfo) {
        let old = this.propertyInfo

        if (resetInfo) {
            this.propertyInfo = info
            this.onPropertyChange()
            return null
        }

        if (old) {
            table_sub_union(info, old)  //更新的属性，是old的子集。
            //this.onStateChange(null, this.curState)
        }

        this.propertyInfo = info

        this.onPropertyChange()

        return old
    }

    getProperty(key) {
        if (this.propertyInfo == null) {
            return null
        }
        return this.propertyInfo[key]
    }


    onMoveBegin(args) {
        //TLog.Debug("Character.onMoveBegin")
        this.stateMrg.setState(characterState.actionState_move)
        if (this.beginMoveCallback) {
            this.beginMoveCallback.call(this.moveCallbackObj, this)
        }

    }

    onMoving(args) {
        if (this.movingCallback) {
            this.movingCallback.call(this.moveCallbackObj, this)
        }
    }

    onMoveStop(args) {
        //TLog.Debug("Character.onMoveStop")
        this.switchToState(characterState.actionState_idle)

        if (this.stopMoveCallback) {
            this.stopMoveCallback.call( this.moveCallbackObj, this)
        }

        //未经过状态判断，可能会导致战斗中角色状态的判断异常
        //this.stateMrg.setState(characterState.actionState_idle)
    }


    onAnimOneCycle(action_id) {
        //TLog.Debug("Character.onAnimOneCycle", action_id)
    }

    onStateChange(oldState, curState) {
        //TLog.Warn("Character.onStateChange old:%s, cur:%s", tostring(oldState), tostring(curState))

        let bHandle = false
        if (curState == characterState.actionState_move) {
            this.changeAction("run", 1.0, true)
            this.curState = curState

            bHandle = true
        } else if (curState == characterState.actionState_idle) {
            this.changeAction("idle", 1.0, true)
            this.curState = curState

            bHandle = true
        }
        this.updateInsideEffectState(oldState, curState)

        return bHandle
    }

    //////////////////////////////////////////////////-
    onMovementEvent(args: map.SpriteMovEvent) {
        if (args.beginRun()) {
            this.onMoveBegin(args);
        } else if (args.isStoping()) {
            this.onMoveStop(args);
        } else {
            this.onMoving(args);
        }
    }

    onPropertyChange() {
        this.id = this.propertyInfo.id
    }


    onEnterMap() {
        super.onEnterMap();
        //设置子状态
        this.stateMrg.setState(characterState.globalState_live)

        this.stateMrg.setState(characterState.actionState_idle)

        this.stateMrg.setState(characterState.postureState_normal)

        this.setMoveSpeed(12)
    }

    onLeaveMap() {
        super.onLeaveMap()
    }


    setMovementCallback(beginMoveCallback, stopMoveCallback, movingCallback, obj) {
        this.beginMoveCallback = beginMoveCallback
        this.stopMoveCallback = stopMoveCallback
        this.movingCallback = movingCallback
        this.moveCallbackObj = obj
    }


    faceToXY(targetX, targetY) {
        //let srcX, srcY = this.getMapXY()
        //let pos = GetFightActorPosXY(this.getSide(), this.getPos())
        //let srcX, srcY = pos.x, pos.y
        let mapPos = this.getMapXY()

        //简单检测X值
        if (targetX > mapPos.x) {
            //右边
            this.setDir(ActorDirMap.Right)
        } else {
            this.setDir(ActorDirMap.Left)
        }
    }

    faceToActor(actor) {
        let pos = actor.getMapXY()
        this.faceToXY(pos.x, pos.y)

    }


    ////////////////////////////////////////////////////////////////-
    addActorEffect(boneName, effectId) {
        let boneParam = null

        if (boneName) {
            boneParam = {}
            boneParam.name = boneName
            boneParam.order = -1
            boneParam.transfrom = true
        }

        let effect = EffectManager.getInstance().createBindEffect(effectId, this, boneParam, true)

        JsUtil.arrayInstert(this.insideEffectList, effect)
    }

    doCommand(cmdId, effect?, param?) {
        if (cmdId == ActorCommand.RemoveEffect) {					//捕获移除的特效
            table_remove(this.insideEffectList, effect)
        }

        super.doCommand(cmdId, effect, param)
    }

    updateInsideEffectState(oldState, curState) {
        //
        if (this.stateMrg.isActionState(curState)) {
            if (curState == characterState.actionState_move
                || curState == characterState.actionState_idle
                || curState == characterState.nullState) {

                for (let _ in this.insideEffectList) {
                    let effect = this.insideEffectList[_]

                    effect.setVisible(true)
                }
            } else {
                for (let _ in this.insideEffectList) {
                    let effect = this.insideEffectList[_]

                    effect.setVisible(false)
                }
            }
        }
    }



    //===========================================游戏逻辑部分===========================================
    

    deleteFootEffect() {
        if (this.footEffect) {
            this.footEffect.deleteObj()
            this.footEffect = null
        }
    }

    //脚底绑定特效（仙侣:法阵，宠物:通灵）
    setFootBindEffect(effectId ) {
       effectId = effectId || 0

        if (this.footEffectId == effectId) {
            return
        }

        this.deleteFootEffect()
        this.footEffectId = -1
        if (effectId <= 0) {
            return
        }

        let boneParam: any = {}
        boneParam.name = ""
        boneParam.order = -1
        boneParam.transfrom = false

        this.footEffect = EffectManager.getInstance().createBindEffect(effectId, this, boneParam, true)
           
    }












}