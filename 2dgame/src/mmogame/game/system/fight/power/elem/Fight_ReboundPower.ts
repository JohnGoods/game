/*
作者:
    liuziming
	
创建时间：
   2015.11.19(周四)

意图：
   
公共接口：
   
*/
class Fight_ReboundPower extends Fight_BasePower {
    public initObj(...args: any[]): void {

    }

    onFinish() {
        if (this.powerInfo.ahead) {
            return
        }

        if (this.powerInfo.target == 0) {
            return
        } else {
            let buffList = BuffSystem.getInstance().getActorBuffList(this.powerInfo.target) || {}
            if (buffList[this.powerInfo.buff] && buffList[this.powerInfo.buff][0]) {
                let buff = buffList[this.powerInfo.buff][0]
                let [flag, _] = buff.checkBuffEffect("rebound")
                if (flag == true) {
                    let effectList = buff.getEffectList()
                    for (let _ in effectList) {
                        let effect = effectList[_]

                        effect.changeActionWithIndex(0, effect.getAnimSpeed(), true)
                        effect.setVisible(true)

                        let handleAnimNotify = function (eff, notify) {
                            if (notify == "end") {
                                eff.setVisible(false)
                            }
                        }

                        let listener: any = { this_index: this, function_index: handleAnimNotify }
                        effect.addAnimListener(listener)
                    }
                }
            }
        }
    }
}