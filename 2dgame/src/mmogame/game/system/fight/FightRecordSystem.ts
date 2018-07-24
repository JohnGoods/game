/*
作者:
    liuziming
	
创建时间：
   2015.10.20(周二)

意图：
   
公共接口：
   
*/
class FightRecordSystem extends TClass {
    fightSystem: FightSystem;
    fighterConfigList: any;
    fightRecordXML: any[];
    fightRecordResult: any[];

    public initObj(...args: any[]): void {
        RegisterEvent(EventDefine.COMBAT_FIGHTER_ADD_EX, this.onFighterAdd, this)

        this.fightSystem = args[0]
        this.fightRecordXML = []
        this.fightRecordResult = []

        this.fighterConfigList = {}
    }

    onClear() {
        this.fighterConfigList = {}

        this.fightRecordXML = []
        this.fightRecordResult = []
    }

    addResult(result) {
        JsUtil.arrayInstert(this.fightRecordResult, table_copy(result))
    }

    _addResult(result) {
        let xml = ""
        let [content, color] = this.analyzeCode(result)
        xml = xml + content
        let act = true//false

        let powerList: any = {}
        let powerEffectList = {}
        for (let _ in result.fightPowers) {
            let power = result.fightPowers[_]

            let targetId = power["target"]
            if (targetId && this.fighterConfigList[targetId]) {
                powerList[targetId] = powerList[targetId] || []

                powerEffectList[targetId] = powerEffectList[targetId] || {}
                powerEffectList[targetId]["effect" + power.effect] = powerEffectList[targetId]["effect" + power.effect] || {}

                let func: Function = FightRecordSpace.overlayPowerHandler[power.effect]
                if (func) {
                    let sPower = powerEffectList[targetId]["effect" + power.effect][0]
                    if (!sPower) {
                        sPower = table_copy(power)
                        powerEffectList[targetId]["effect" + power.effect][0] = sPower
                    } else {
                        func.call(this, sPower, power)
                    }

                    let flag = table_isExist(powerList[targetId], sPower)
                    if (!flag) {
                        JsUtil.arrayInstert(powerList[targetId], sPower)
                    }
                } else {
                    JsUtil.arrayInstert(powerList[targetId], table_copy(power))
                }
            }
        }

        for (let targetId in powerList) {
            let list = powerList[targetId]

            let content = ""
            let elem = this.fighterConfigList[targetId] || []
            let config = elem[0], info = elem[1]
            let nameTitle = config["name"] || ""

            table_sort(list, function (a, b) {
                return a.effect - b.effect
            })

            if (config) {
                for (let index = 0; index < list.length; index++) {
                    let power = list[index]

                    let handler: Function = FightRecordSpace.convertPowerHandler[power.effect]

                    if (handler && this.debugPowerEffect(power.effect)) {
                        let secColor = "#orange"//"lime.length "
                        if (info.side == fightSide.FIGHT_LEFT) {
                            secColor = "#lime"//"#lime "
                        }
                        secColor = ""

                        let str = handler.call(this, power, config, info, color, secColor)
                        if (str != "") {
                            if (content != "") {
                                str = "," + str
                            }

                            content = content + str
                            act = true
                        }
                    }
                }
            }

            if (content != "") {
                xml = xml + nameTitle + content + ";"
            }
        }

        if (xml != "" && act == true) {
            if (GAME_DEBUG) {
                //let _, tStr = simple_transform_time(Math.floor(result.time / 1000))
                //JsUtil.arrayInstert(this.fightRecordXML, "#space#space" + result.time + xml)
                JsUtil.arrayInstert(this.fightRecordXML, "#space"+result.round + xml)
            } else {
                //JsUtil.arrayInstert(this.fightRecordXML, "#space#space" + xml)
                JsUtil.arrayInstert(this.fightRecordXML,  "#space"+xml)
            }
        }
    }

    analyzeCode(result): [string, string] {
        let content = ""
        let elem = this.fighterConfigList[result.caster] || {}
        let config = elem[0], info = elem[1]
        let reColor = "#rf"

        if (result.code == resultOptions.RCODE_SPELL_HIT
            || result.code == resultOptions.RCODE_SPELL_PREPARE_HIT
            || result.code == resultOptions.RCODE_SPELL_INTERVAL_HIT) {

            if (config) {
                let skillName = SkillSystem.getInstance().getClientSkillName(result.spellId)

                //content = color +config.Name +"#rf" +Localize_cns("FIGHT_FADONG") +"magenta.length" +skillName +"#rf" +","
                //let actorName = PetSystem.getInstance().getPetQualityLevelName(info.qualityLevel, config.Name)
                let actorName = config.name
			    content = actorName + Localize_cns("FIGHT_FADONG") + skillName + ","
                if (GAME_DEBUG) {
                    if (result.code == resultOptions.RCODE_SPELL_INTERVAL_HIT) {
                        let color = "#orange "

                        if (info.side == fightSide.FIGHT_LEFT) {
                            color = "#lime "
                        }
                        content = actorName + Localize_cns("FIGHT_FADONG") + "(#red" + Localize_cns("FIGHT_LIANJI") + color + ")" + skillName + "_" + result.spellId + ","
                    } else {
                        content = actorName + Localize_cns("FIGHT_FADONG") + skillName + "_" + result.spellId + ","
                    }
                }

                //不填技能名就不显示任何信息
                if (!skillName || skillName == "") {
                    content = ""
                    result.fightPowers = {}
                }
            }
            //}else if(result.code == resultOptions.RCODE_SPELL_PREPARE ){
            //	if(actor ){
            //		let config = GetFightActorConfig(actor)
            //		let skillName = SkillSystem.getInstance().getClientSkillName(result.spellId)
            //		
            //		//content = color +config.Name +"#rf" +Localize_cns("FIGHT_KAISHIYINCHANG") +"magenta.length" +skillName +"#rf" +","
            //		content = config.Name +Localize_cns("FIGHT_KAISHIYINCHANG") +skillName +","
            //	}
            //}else if(result.code == resultOptions.RCODE_SPELL_INTERVAL ){
            //	if(actor ){
            //		let config = GetFightActorConfig(actor)
            //		let skillName = SkillSystem.getInstance().getClientSkillName(result.spellId)
            //					
            //		//content = color +config.Name +"#rf" +Localize_cns("FIGHT_ZHUNBEISHIFA") +"magenta.length" +skillName +"#rf" +","
            //		content = config.Name +Localize_cns("FIGHT_ZHUNBEISHIFA") +skillName +","
            //	}
        } else if (result.code == resultOptions.RCODE_SPELL_SPIRIT_HIT) {
            let side = FightSystem.getInstance().transferFightSide(result.caster)

            if (config) {
                let skillName = SkillSystem.getInstance().getClientSkillName(result.spellId)

                //content = color +config.Name +"#rf" +Localize_cns("FIGHT_FADONG") +"magenta.length" +skillName +"#rf" +","
                content = config.Name + Localize_cns("FIGHT_FADONG") + skillName + ","
                if (GAME_DEBUG) {
                    content = config.Name + Localize_cns("FIGHT_FADONG") + skillName + "_" + result.spellId + ","
                }

                //不填技能名就不显示任何信息
                if (!skillName || skillName == "") {
                    content = ""
                    result.fightPowers = {}
                }
            }
        }

        if (content != "") {
            let color = "#orange "
            let title = String.format(Localize_cns("PANEL_TYPENAME"), Localize_cns("LEGION_WAR_TITLE1"))//"lime.length "

            if (info.side == fightSide.FIGHT_LEFT) {
                color = "#lime "
                title = String.format(Localize_cns("PANEL_TYPENAME"), Localize_cns("LEGION_WAR_TITLE2"))//"#cyan "
            }
            content = color + title + content
            reColor = color
        }
        return [content, reColor]
    }

    getFightRecord() {
        if (this.fightRecordXML.length == 0) {
            // let count = this.fightRecordResult.length
            // for (let i = 1; i < count; i++) {
            //     for (let j = i; j >= 1; j--) {
            //         let r1 = this.fightRecordResult[j]
            //         let r2 = this.fightRecordResult[j - 1]

            //         if (r1.time >= r2.time) {
            //             break
            //         } else {
            //             let temp = this.fightRecordResult[j]
            //             this.fightRecordResult[j] = this.fightRecordResult[j - 1]
            //             this.fightRecordResult[j - 1] = temp
            //         }
            //     }
            // }
            // table_sort(this.fightRecordResult, function(a, b){
            //     return a.time - b.time
            // })

            for (let _ = 0; _ < this.fightRecordResult.length; _++) {
                let result = this.fightRecordResult[_]

                this._addResult(result)
            }

            return this.fightRecordXML
        } else {
            return this.fightRecordXML
        }
    }

    debugPowerEffect(effect) {
        let list = [
            powerEffects.EFFECT_HP_PLUS,
            powerEffects.EFFECT_HP_LESS,
            powerEffects.EFFECT_RP_PLUS,
            powerEffects.EFFECT_RP_LESS,
            powerEffects.EFFECT_ADD_BUFF,
            powerEffects.EFFECT_DEL_BUFF,
            powerEffects.EFFECT_STATUS,
        ]

        if (GAME_DEBUG) {
            let list = [
                powerEffects.EFFECT_HP_PLUS,
                powerEffects.EFFECT_HP_LESS,
                powerEffects.EFFECT_RP_PLUS,
                powerEffects.EFFECT_RP_LESS,
                powerEffects.EFFECT_ADD_BUFF,
                powerEffects.EFFECT_DEL_BUFF,
                powerEffects.EFFECT_STATUS,

                powerEffects.EFFECT_MAXHP_PLUS,
                powerEffects.EFFECT_MAXHP_LESS,
            ]
            let flag = table_isExist(list, effect)
            return flag
        } else {
            let flag = table_isExist(list, effect)
            return flag
        }
    }

    onFighterAdd(args) {
        for (let _ in args.fighterList) {
            let id = args.fighterList[_]

            let actor = GetFightActor(id)
            if (actor) {
                let [config, _] = GetFightActorConfig(actor)
                config = table_copy(config)
                if (this.fighterConfigList[id]) {
                    TLog.Warn("FightRecordSystem.onFighterAdd the fighter %s is already exsit!", id)
                }

                let info = table_copy(actor.getPropertyInfo())
                if(! info){
                    TLog.Warn("FightRecordSystem.onFighterAdd the fighter %s is NULL", id)
                    return
                }

                if (info.type_id == objectType.OBJECT_TYPE_ASSIST) {
                    config.name = Localize_cns("COMBINED_TIPS6") + config.name
                } else if (info.type_id == objectType.OBJECT_TYPE_PLAYER) {
                    config.name = actor.getName()
                }
                this.fighterConfigList[id] = [ config, info ]
            }
        }
    }

}

module FightRecordSpace {

    export let overlayPowerHandler: any = {}
    export let convertPowerHandler: any = {}

    //////////////////////////////////////////////////////////////////////////////
    function hpPlusEffect(power, config, info, color) {
        //return color +config.Name +"#rf" +Localize_cns("FIGHT_JIAXUE") +"#red" +power.point +"#rf" +";"
        return Localize_cns("FIGHT_JIAXUE") + "#red " + power.point + color
    }
    convertPowerHandler[powerEffects.EFFECT_HP_PLUS] = hpPlusEffect

    function hpLessEffect(power, config, info, color) {
        //return color +config.Name +"#rf" +Localize_cns("FIGHT_KOUXUE") +"#red" +power.point +"#rf" +";"
        return Localize_cns("FIGHT_KOUXUE") + "#red " + power.point + color
    }
    convertPowerHandler[powerEffects.EFFECT_HP_LESS] = hpLessEffect

    function hpMaxPlusEffect(power, config, info, color) {
        //return color +config.Name +"#rf" +Localize_cns("FIGHT_JIAXUE") +"#red" +power.point +"#rf" +";"
        return Localize_cns("FIGHT_MAXJIAXUE") + "#red " + power.point + color
    }
    convertPowerHandler[powerEffects.EFFECT_MAXHP_PLUS] = hpMaxPlusEffect

    function hpMaxLessEffect(power, config, info, color) {
        //return color +config.Name +"#rf" +Localize_cns("FIGHT_KOUXUE") +"#red" +power.point +"#rf" +";"
        return Localize_cns("FIGHT_MAXKOUXUE") + "#red " + power.point + color
    }
    convertPowerHandler[powerEffects.EFFECT_MAXHP_LESS] = hpMaxLessEffect

    function rpPlusEffect(power, config, info, color) {
        //return color +config.Name +"#rf" +Localize_cns("FIGHT_JIAQI") +"#red" +power.point +"#rf" +";"
        return Localize_cns("FIGHT_JIAQI") + "#red " + power.point + color
    }
    convertPowerHandler[powerEffects.EFFECT_RP_PLUS] = rpPlusEffect

    function rpLessEffect(power, config, info, color) {
        if (power.point >= 100) {
            return ""
        }

        //return color +config.Name +"#rf" +Localize_cns("FIGHT_KOUQI") +"#red" +power.point +"#rf" +";"
        return Localize_cns("FIGHT_KOUQI") + "#red " + power.point + color
    }
    convertPowerHandler[powerEffects.EFFECT_RP_LESS] = rpLessEffect

    function rpValueEffect(power, config, info, color) {
        //return color +config.Name +"#rf" +Localize_cns("FIGHT_KOUQI") +"#red" +power.point +"#rf" +";"
        return Localize_cns("FIGHT_DANGQIANNVQI") + "#red " + power.point + color
    }
    convertPowerHandler[powerEffects.EFFECT_RP_VALUE] = rpValueEffect

    function addBuffEffect(power, config, info, color) {
        //return color +config.Name +"#rf" +Localize_cns("FIGHT_ZHONGBUFF") +" " +"#red" +BuffSystem.getInstance().getBuffName(power.buff) +"#rf" +";"
        let buffName = BuffSystem.getInstance().getBuffName(power.buff)
        if (buffName && buffName != "") {
            if (GAME_DEBUG) {
                return String.format(Localize_cns("FIGHT_ZHONGBUFF"), "#red "+ buffName + "_" + power.buff + color)
            }
		    return String.format(Localize_cns("FIGHT_ZHONGBUFF"), "#red "+ buffName + color)
        } else {
            return ""
        }
    }
    convertPowerHandler[powerEffects.EFFECT_ADD_BUFF] = addBuffEffect

    function removeBuffEffect(power, config, info, color) {
        //return color +config.Name +"#rf" +Localize_cns("FIGHT_ZHONGBUFF") +" " +"#red" +BuffSystem.getInstance().getBuffName(power.buff) +"#rf" +";"
        let buffName = BuffSystem.getInstance().getBuffName(power.buff)
        if (buffName && buffName != "") {
            if (GAME_DEBUG) {
                return String.format(Localize_cns("FIGHT_QUBUFF"), "#red " + buffName + "_" + power.buff + color)
            }
		    return String.format(Localize_cns("FIGHT_QUBUFF"), "#red "+ buffName + color)
        } else {
            return ""
        }
    }
    convertPowerHandler[powerEffects.EFFECT_DEL_BUFF] = removeBuffEffect

    function statusDieEffect(power, config, info, color) {
        if (power.status == powerStatus.PSTATUS_TARGET_DIE) {
            //return color +config.Name +"#rf" +Localize_cns("FIGHT_ZHENWANG") +";"
            return config.Name + "#red " + Localize_cns("FIGHT_ZHENWANG") + color
        } else {
            return ""
        }
    }
    convertPowerHandler[powerEffects.EFFECT_STATUS] = statusDieEffect

    ////////////////////////////////////重叠效果power统计处理//////////////////////////-
    function computeHP(sPower, power) {
        if (sPower.effect == power.effect) {
            sPower.point = sPower.point + power.point
        } else {
            sPower.point = sPower.point - power.point
        }


        if (sPower.point < 0) {
            if (sPower.effect == powerEffects.EFFECT_HP_PLUS) {
                sPower.effect = powerEffects.EFFECT_HP_LESS
            } else {
                sPower.effect = powerEffects.EFFECT_HP_PLUS
            }
        }

        return sPower
    }
    overlayPowerHandler[powerEffects.EFFECT_HP_PLUS] = computeHP
    overlayPowerHandler[powerEffects.EFFECT_HP_LESS] = computeHP

    function computeRP(sPower, power) {
        if (sPower.effect == power.effect) {
            sPower.point = sPower.point + power.point
        } else {
            sPower.point = sPower.point - power.point
        }


        if (sPower.point < 0) {
            if (sPower.effect == powerEffects.EFFECT_RP_PLUS) {
                sPower.effect = powerEffects.EFFECT_RP_LESS
            } else {
                sPower.effect = powerEffects.EFFECT_RP_PLUS
            }
        }

        return sPower
    }
    overlayPowerHandler[powerEffects.EFFECT_RP_PLUS] = computeRP
    overlayPowerHandler[powerEffects.EFFECT_RP_LESS] = computeRP
}

