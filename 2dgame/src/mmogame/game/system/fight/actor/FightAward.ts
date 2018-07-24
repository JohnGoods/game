// TypeScript file
class FightAward extends AwardBase {

    public initObj(...args: any[]): void {
        this.actorType = actor_Type.ACTOR_TYPE_AWARD;
        RegisterEvent(EventDefine.COMBAT_FIGHTER_DIE_END, this.onFighterDead, this)
    }

    destory() {
        UnRegisterEvent(EventDefine.COMBAT_FIGHTER_DIE_END, this.onFighterDead, this)
    }

    onFighterDead(args) {
        if (this.ownerId != args.id) {
            return
        }

        let actor = GetFightActor(this.ownerId)
        this.startBloom(actor)
    }
}