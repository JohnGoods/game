/*
作者:
    liuziming

创建时间：
    2014.08.08(星期五) 

意图：
      powerEffects.EFFECT_ADD_BUFF
			powerEffects.EFFECT_DEL_BUFF
			powerEffects.EFFECT_UPDATE_BUFF 
			类型power

公共接口：

*/
class Fight_BuffPower extends Fight_BasePower {
    public initObj(...args: any[]): void {

    }

    //onPlay(){
    //	//不实现就自动finish
    //}

    onFinish() {
        let buffId = this.powerInfo.buff
        let name = ""
        let actor = GetFightActor(this.powerInfo.target)
        if (actor) {
            name = actor.getName()
        }

        let Type = "+"
        let buffSystem = BuffSystem.getInstance()
        let actorId = this.powerInfo.target
        if (this.powerInfo.effect == powerEffects.EFFECT_ADD_BUFF) {
            if (!this.powerInfo.ahead) {
                Type = "+"
                let buff = Buff.newObj(buffId, this.powerInfo.life, this.powerInfo.count, tostring(this.powerInfo))
                buffSystem.addBuff(actorId, buff, true)
            } else {
                //buffSystem.showBuffEffect(actorId, buffId, tostring(this.powerInfo))
            }
        } else if (this.powerInfo.effect == powerEffects.EFFECT_DEL_BUFF) {
            Type = "-"
            buffSystem.removeBuff(actorId, buffId)
        } else if (this.powerInfo.effect == powerEffects.EFFECT_UPDATE_BUFF) {
            Type = "update"
            let buff = Buff.newObj(buffId, this.powerInfo.life, this.powerInfo.count)
            buffSystem.updateBuff(actorId, buff)
        } else if (this.powerInfo.effect == powerEffects.EFFECT_IMMUNIZE) {
            if (actor) {
                let number_info: any = {}
                number_info.Type = "immunize"
                number_info.textList = [ "mianyi"]
                actor.doCommand(ActorCommand.ShowCombatNumber, number_info, 200)
            }
        }

        if (!GAME_DEBUG) {
            return
        }

        //MsgSystem.AddTagTips(String.format(Localize_cns("FIGHT_POWER_BUFF_TIPS"), buffId, name, Type))
    }
}