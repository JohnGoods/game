class FightBaseAI extends TClass{

    actor:FightActor;
    isInMovie:boolean;
    beginMove:boolean;

    curDefaultTarget:any;
    curPosition:any;

    tickTime:number;
    maxAITime:number;
    childList:FightActor[];

    parentActor:FightActor;

    bWingShow:boolean;
    

	 //子类复写 初始化函数
    public initObj(...args:any[]):void{

        this.actor = args[0]
        this.isInMovie = false
        
        this.beginMove = false
        this.curDefaultTarget = null
        this.curPosition = null
        this.tickTime = 0
        this.maxAITime = 200
        this.childList = []

        RegisterEvent(EventDefine.STATE_DEACTIVE, this.onStateDeActive, this)
        RegisterEvent(EventDefine.COMBAT_FIGHTER_DEAD, this.onFighterDie, this)
        RegisterEvent(EventDefine.COMBAT_FIGHTER_REMOVE, this.onFighterDie, this)


        this.bWingShow = true;
        
    }
    //子类复写 析构函数
    protected destory(): void{
        UnRegisterEvent(EventDefine.STATE_DEACTIVE, this.onStateDeActive, this)
        UnRegisterEvent(EventDefine.COMBAT_FIGHTER_DEAD, this.onFighterDie, this)
        UnRegisterEvent(EventDefine.COMBAT_FIGHTER_REMOVE, this.onFighterDie, this)
        
        var list = this.childList.concat();
        
        list.forEach(actor=>{
            this.removeChildFightActor(actor)
            actor.setParent(null)
        })
        
        if(this.parentActor){
            this.parentActor.removeChildFightActor(this.actor)
            this.parentActor = null
        }
    }

    tick(delay){
        this.advanceHandle()

        this.tickTime = this.tickTime + delay
        if(this.tickTime < this.maxAITime){
            return
        }else{
            this.tickTime = 0
        }

/*        let isWingShow = (this.actor.isIdleState() || this.actor.isMoveState() || this.actor.isAttackedState())
        if(this.bWingShow != isWingShow){
            this.bWingShow = isWingShow;
            this.childList.forEach(child => {
                child.setVisibleRaw(isWingShow)
            });
        }
*/
        //idle或者move状态才寻路
        if(! (this.actor.isIdleState() || this.actor.isMoveState() )){
            this.childList.forEach(child => {
                child.setVisibleRaw(false)
            });
            return
        }
        
        if(this.actor.isBeingAttacked()){
            // this.actor.moveStop()
            // return
        }
        
        //角色空闲，移到下个位置
        if(! this.curPosition){
            this.curPosition = GetFightActorDefaultPosXY(this.actor.getSide(), this.actor.getPos())
        }
        
        if(this.isInMovie){
            return
        }
        
        return this.onTick(delay)
    }

    onTick(delay:number){
        TLog.Warn("FightBaseAI.onTick !!!!!!!!!!")
    }


    getRemainder(number, norm){
        return (number - 1) % norm + 1
    }


    transferCell(cellx, celly){
        return SceneManager.getInstance().cellXYtoMapXY(cellx, celly)
    }


    enterMovie(){
        this.isInMovie = true
    }


    onStateDeActive(args){
        if(args.stateType == state_type.COMBAT_STORY_STATE){
            this.isInMovie = false
        }
    }


    onFighterDie(args){
        var actor = GetFightActor(args.id)
        if(! actor || this.actor == actor || this.isInMovie == true){
            return
        }
        
 //       if(this.curDefaultTarget && this.curDefaultTarget.getCombatId() == args.id){
 //           this.curDefaultTarget = null
 //       }
 //       
 //       this.actor.fininshControlAction()
 //       this.beginMove = true
    }


    isActorFindPos(){
        return this.beginMove
    }


    advanceHandle(){

    }


    setAutoDelete(){

    }


    addChildFightActor(actor){
        if(JsUtil.arrayPush(this.childList, actor) == false){
            return
        }
        
        if(! actor.fightAI.onAddChildFightActor){
            actor.leaveMap()

            if(this.classname == "FightFunnalAI"){
                this.actor.realActor.addChildSprite("wing_point", actor.realActor, -1, true)
            }else{
                this.actor.realActor.addChildSprite("center", actor.realActor, -1, true)
            }
        }else{
            actor.fightAI.onAddChildFightActor(this.actor)
        }
    }


    removeChildFightActor(actor){
        if(JsUtil.arrayRemoveVal(this.childList, actor) == false)
            return;

        this.actor.realActor.removeChildSprite(actor.realActor)
        actor.enterMap()
        if(! actor.fightAI.onRemoveChildFightActor){
            actor.fightAI.onRemoveChildFightActor(this.actor)
        }else{
        }
    }


    setParent(actor){
        this.parentActor = actor
    }


    restoreFightAI(){
        
    }
}
