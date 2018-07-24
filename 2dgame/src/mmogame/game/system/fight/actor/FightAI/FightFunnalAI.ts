/*
作者:
    liuziming
	
创建时间：
   2015.09.15(周二)

意图：
   Funnal		浮游炮（翅膀）
公共接口：
   
*/
class FightFunnalAI extends FightBaseAI {

    beginMove: boolean;
    showResulting: boolean;

    public initObj(...args: any[]): void {
        this.beginMove = false			//翅膀不用寻找最新默认点（寻路）
        this.actor.completeBack = true
        this.showResulting = false
        this.actor.doCommand(ActorCommand.SetShadowVisible, false, null)
    }

    destory() {

    }

    onTick(delay) {
        this.moveToDefaultSeat()
    }

    moveToDefaultSeat() {
        //当前位置
        //let pos:any = {}
        //pos.x, pos.y = SceneManager.getInstance().mapXYtoCellXY(this.curPosition.x, this.curPosition.y)
        //let from_x, from_y = this.actor.getCellXY()
        //
        ////如果在范围内，就不用动了
        //if(Math_util.checkNormScope(from_x, from_y, pos.x, pos.y, 1) ){
        //	this.actor.completeBack = true
        //	
        //	return false
        //}
        //
        //if(this.actor.wantToGoByCell(pos.x, pos.y, true) == false ){
        //	TLog.Debug("ActorAI move Error:", from_x, from_y, pos.x, pos.y)
        //	//throw()
        //}

        if (this.parentActor && this.showResulting == false) {
            this.actor.setPositionXY(0, 10)

            //寄主阵亡后自动隐藏翅膀（守护）
            if (this.parentActor.isDeadState()) {
                this.actor.changeDieState()
            }
        }
    }

    onAddChildFightActor(parentActor) {
        this.actor.leaveMap()
        //this.realActor.AddOptimizeFlag(map.IRenderActor.OPTIMIZE_UPDATE_ONSEE)
        parentActor.realActor.addChildSprite("center", this.actor.realActor, -10000, true)
        this.actor.setPositionXY(0, 10)
        this.actor.changeAction("combat_idle")
    }

    onRemoveChildFightActor(parentActor: FightActor) {
        let pos = parentActor.getFighterCurCellXY()
        this.actor.setCellXY(pos.x, pos.y)
    }

    delayBeginResult(result, resultInfo) {
        if (this.parentActor) {
            this.parentActor.removeChildFightActor(this.actor)

            let pos = this.parentActor.getFighterCurCellXY()
            this.actor.setCellXY(pos.x, pos.y)
            this.showResulting = true
        }

        return false									//立马开始表演result
    }

    restoreFightAI() {
        if (this.parentActor) {
            this.parentActor.addChildFightActor(this.actor)
            this.showResulting = false
        }
    }
}