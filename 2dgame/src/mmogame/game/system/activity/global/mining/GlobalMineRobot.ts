class GlobalMineRobot extends Character {
    activity: any;
    miningInfo: any;
    miningMineId: any                           //采集（占领中）的Npc矿索引

    public initObj(...args: any[]): void {
        //只有主角才会事件通知
        // this.setMovementNotifyEnable(true)
        // this.setMovingNotifyEnable(true)
        this.setTouchEnable(false)
        
        this.actorType = actor_Type.ACTOR_TYPE_PLAYER;

        this.addAliasAction("idle", "combat_idle")
        this.addAliasAction("combat_idle", "idle")

        this.activity = args[0]
    }

    destory() {
        
    }

    onMoveBegin(args) {
        super.onMoveBegin(args);
    }

    onMoveStop(args) {
        super.onMoveStop(args);

        // let act = GetActivity(ActivityDefine.GlobalMining)
        // if (act.getHeroMiningRobot() == this) {
            this.activity.clearMiningPath()
            
            let wnd = WngMrg.getInstance().getWindow("GlobalMiningMainFrame")
            wnd.doCommand("updateTeamBtn")
        // }
    }

    onMoving(args) {
        super.onMoving(args);
        
        if (this.miningInfo == null) {
            return
        }

        let npc = this.getMiningMine()
        if (npc == null) {
            return
        }

        let npcPos = npc.getCellXY()
        let point = this.getCellXY()
        if (MathUtil.checkScope(point.x, point.y, npcPos.x, npcPos.y, 0) == true) {
            // this.moveStop()
            this.activity.applyEnterMine(this)
            this.activity.clearMiningPath()
        }
    }

    loadModel(modelId) {
        //super.loadModel(100)
    }

    setMiningInfo(miningInfo) {
        this.miningInfo = miningInfo
    }

    getMiningInfo() {
        return this.miningInfo
    }

    setMiningMineId(id) {
        this.miningMineId = id
    }

    getMiningMine() {
        if (this.miningMineId == null) {
            return
        }

        return ActorManager.getInstance().getNpc(this.miningMineId)
    }
}