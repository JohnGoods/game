/*
作者:
    liuziming
	
创建时间：
   2017.03.23(周四)

意图：
   
公共接口：
   
*/


let awardModel: any = {
    JINBI: 9008,
    JINBI_SMALL: 9008,
    JINBI_MID: 9009,
    JINBI_BIG: 9010,

    SUCAI: 9006,

    JIEZHI: 9017,
    HUJIA: 9018,
    WUQI: 9019,
    TOUKUI: 9020,
    XIANGLIAN: 9021,
    XUEZI: 9022,

    //HUIHUWEI			: 9032,
    //JINHUWEI			: 9033,
    //LANHUWEI			: 9034,
    //LVHUWEI				: 9035,
    //ZIHUWEI				: 9036,
    //
    //HUIWANGZHE		: 9038,
    //JINWANGZHE		: 9039,
    //LANWANGZHE		: 9040,
    //LVWANGZHE			: 9041,
    //ZIWANGZHE			: 9042,
    //
    //MODAOSHI			: 9037,
    //
    //QIANGHUA			: 9004,				//强化石
}
let awardCount = 0

let weaponType: any = [
    opItemType.ITEM_TYPE_CAP,
    opItemType.ITEM_TYPE_WEAPON,
    opItemType.ITEM_TYPE_CLOTH,
    opItemType.ITEM_TYPE_MASK,
    opItemType.ITEM_TYPE_SHOE,
    opItemType.ITEM_TYPE_NECK,
]

let awardWndInde = 0



class AwardBase extends Actor {
    firstShow
    curEffectId
    itemName
    fontColor
    finishAction
    clickTick

    awardFrame: BaseWnd;

    awardType
    ownerId
    param1
    param2


    control: any;

    public initObj(...args: any[]): void {
        this.firstShow = true
        this.curEffectId = null
        this.itemName = null
        this.fontColor = "yellow"
        this.finishAction = false
        this.clickTick = 0

        this.setTouchEnable(true)

        this.addCommandComponent(ActorCmdComponent_UI.newObj(this))
        this.addCommandComponent(ActorCmdComponent_Effect.newObj(this))
        this.addCommandComponent(ActorCmdComponent_Visual.newObj(this))

        //this.doCommand(ActorCommand.SetShadowVisible, true, null)
        //this.addOptimizeFlag(map.IRenderActor.OPTIMIZE_UPDATE_ONSEE)
    }

    destory() {
        if (this.awardFrame) {
            this.awardFrame.deleteObj()
            this.awardFrame = null
        }
    }

    getActorType() {
        return -1
    }


    setAwardData(awardType, ownerId, param1, param2) {
        this.awardType = awardType
        this.ownerId = ownerId
        this.param1 = param1				//"money"时表金币数；"item"时表entryId
        this.param2 = param2				//物品时表品质
    }

    startBloom(actor) {

        let pos: any = actor.getCellXY()
        this.startBloomWithPos(pos)
    }

    startBloomWithPos(targetPos) {
        this.setVisible(true)

        if (this.firstShow == false) {
            return
        }

        let modelId = 9001
        let [point_list, speed_list] = this.getAwardControlPos(targetPos)

        this.setCellXY(targetPos.x, targetPos.y)
        this.setVisible(true)
        this.enterMap()

        //this.doCommand(ActorCommand.ShowAwardModel, this.awardType, this.param1)
        if (this.awardType == "money") {
            modelId = awardModel.JINBI
            if (this.param1 > 0 && this.param1 <= 100) {
                modelId = awardModel.JINBI_SMALL
            } else if (this.param1 > 100 && this.param1 <= 1000) {
                modelId = awardModel.JINBI_MID
            } else if (this.param1 > 1000) {
                modelId = awardModel.JINBI_BIG
            }
        } else if (this.awardType == "item") {
            let config = ItemSystem.getInstance().getItemTemplateInfo(this.param1)
            modelId = awardModel.SUCAI
            let name = ""

            if (config) {
                if (table_isExist(weaponType, config.type)) {
                    if (config.type == opItemType.ITEM_TYPE_CAP) {
                        modelId = awardModel.TOUKUI
                    } else if (config.type == opItemType.ITEM_TYPE_WEAPON) {
                        modelId = awardModel.WUQI
                    } else if (config.type == opItemType.ITEM_TYPE_CLOTH) {			//衣服
                        modelId = awardModel.HUJIA
                    } else if (config.type == opItemType.ITEM_TYPE_MASK) {			//戒指
                        modelId = awardModel.JIEZHI
                    } else if (config.type == opItemType.ITEM_TYPE_SHOE) {			//腰带
                        modelId = awardModel.XUEZI
                    } else if (config.type == opItemType.ITEM_TYPE_NECK) {
                        modelId = awardModel.XIANGLIAN
                    }
                    if (config.subtype != 0) {
                        //let str = "ITEM_SUB_TYPE_NAME_" +config.subtype
                        //name = Localize_cns(str)
                        //if(name == str ){
                        //	name = Localize_cns("WuQi")
                        //}
                        name = config.name
                    }
                    //this.curEffectId = effectIndex.ChuanQiOrangeDrop
                } else if (config.type == opItemType.ITEM_TYPE_MAGIC_STONE) {
                    modelId = awardModel.MODAOSHI
                }

                let dropModel = config.dropModel || 0
                let dropEffect = config.dropEffect || 0
                if (dropModel != 0) {
                    modelId = config.dropModel
                }

                if (dropEffect != 0) {
                    //this.curEffectId = effectIndex.ChuanQiOrangeDrop
                }
                //EffectManager.getInstance().createBindEffect(effectIndex.ChuanQiOrange, this)
                //}else if(config.type == opItemType.ITEM_TYPE_HERO ){
                //	if(config.subtype == opItemSubType.PET_SOUL_FETE_GRAY ){
                //		modelId = awardModel.HUIHUWEI
                //	}else if(config.subtype == opItemSubType.PET_SOUL_FETE_GREEN ){
                //		modelId = awardModel.LVHUWEI
                //	}else if(config.subtype == opItemSubType.PET_SOUL_FETE_BLUE ){
                //		modelId = awardModel.LANHUWEI
                //	}else if(config.subtype == opItemSubType.PET_SOUL_FETE_PURPLE ){
                //		modelId = awardModel.ZIHUWEI
                //	}else if(config.subtype == opItemSubType.PET_SOUL_FETE_GOLD ){
                //		modelId = awardModel.JINHUWEI
                //	
                //	//}else if(config.subtype == opItemSubType.PLR_SOUL_FETE_GRAY ){
                //	//	modelId = awardModel.HUIWANGZHE
                //	//}else if(config.subtype == opItemSubType.PLR_SOUL_FETE_GREEN ){
                //	//	modelId = awardModel.LVWANGZHE
                //	//}else if(config.subtype == opItemSubType.PLR_SOUL_FETE_BLUE ){
                //	//	modelId = awardModel.LANWANGZHE
                //	//}else if(config.subtype == opItemSubType.PLR_SOUL_FETE_PURPLE ){
                //	//	modelId = awardModel.ZIWANGZHE
                //	//}else if(config.subtype == opItemSubType.PLR_SOUL_FETE_GOLD ){
                //	//	modelId = awardModel.JINWANGZHE
                //	}



                //特殊物品ID
                //if(config.ItemEntry == SpecailItemId.QIANGHUASHI ){
                //	modelId = awardModel.QIANGHUA
                //}
            }

            //this.setCellXY(cellX + 2, cellY)
            let color = "white"//为了显示效果，白色表示"gray"

            //以注释
            if (this.param2 == opEquipQuality.Gold) {
                color = "cyan"
                //	this.curEffectId = effectIndex.ChuanQiSuitDrop
            } else if (this.param2 == opEquipQuality.Blue) {
                color = "green"
            } else if (this.param2 == opEquipQuality.Orange) {
                color = "goldenrod"
                //	this.curEffectId = effectIndex.ChuanQiOrangeDrop
            } else if (this.param2 == opEquipQuality.Green) {
                color = "magenta"
            }

            if (name == "") {
                if (config) {
                    this.itemName = config.name || ""
                }
            } else {
                this.itemName = name
            }
            this.fontColor = color

            this.doCommand(ActorCommand.SetNameFont, "ht_24_cc_stroke")
            this.doCommand(ActorCommand.SetNameColor, color, true)
            this.doCommand(ActorCommand.SetName, name)
        } else {

        }

        this.loadModel(modelId)
        this.changeAction(null);

        this.firstShow = false
        this.addActorContrl(point_list, speed_list)

        //fixme:yangguiming
        FightSystem.getInstance().hangUpFinishHandler(false)
    }

    addActorContrl(point_list, speed_list) {
        let count = point_list.length
        let p = point_list[0]
        let fromX = p.x, fromY = p.y
        p = point_list[count - 1]
        let toX = p.x, toY = p.y

        let control = ActorControl_VariableMotion.newObj(400,
            fromX, fromY, toX, toY, this.genPointList, this, [point_list, speed_list])
        control.setFinishCallback(this.finishControl, this)

        this.control = control
        this.addControl(control)
    }

    genPointList(point_list, speed_list) {
        return [point_list, speed_list]
    }

    finishControl(actor) {
        if (this.control) {
            actor.removeControl(this.control)
            this.control.finish(actor)
            this.control.deleteObj()
        }

        this.control = null

        //fixme:yangguiming  不给光效
        this.curEffectId = null
        if (this.curEffectId != null) {
            let effect = EffectManager.getInstance().createBindOnceEffect(this.curEffectId, this)

            let listener: any = { this_index: this, function_index: this.handleAnimNotify }
            effect.addAnimListener(listener)

        } else {
            FightSystem.getInstance().hangUpFinishHandler(false)
            //this.finishAction = true
        }

        this.finishAction = true
    }

    getAwardControlPos(targetPos) {
        let poslist = [3 / 4, 1, 5 / 4, 7 / 4, 2, 9 / 4]
        //Math.randomseed(GetServerTime())
        if (awardCount == 0) {
            awardCount = MathUtil.random(6)
        } else {
            awardCount = awardCount + 1
        }

        let count = (awardCount ) % poslist.length //Math.random(6)
        //let r = 2
        //let mode = size_t(poslist)

        //r = r * (Math.floor((count - 1) / 8) + 1)
        //count = (count - 1) % mode + 1
        //let cellX, cellY = this.getCellXY()
        //cellX = cellX + Math.cos(pos[count]) * r
        //cellY = cellY + Math.sin(pos[count]) * r

        let mapPos = SceneManager.getInstance().cellXYtoMapXY(targetPos.x, targetPos.y)
        let ox = mapPos.x, oy = mapPos.y
        let point_list = []
        let speed_list = []
        let x = 0, y = 0
        let angle = (poslist[count] - 1) * Math.PI
        let ratio = Math.sin(angle) / Math.abs(Math.sin(angle))
        let r = 23

        JsUtil.arrayInstert(point_list, newPos( ox - x, y + oy))
        let flag = 0
        if (ratio > 0) {
            flag = 2
        } else {
            flag = 3
        }
        let include = true
        ratio = Math.cos(angle) / Math.abs(Math.cos(angle))
        let l = 0

        do {
            l = l + 1
            x = x - ratio * 1

            //y = Math.sqrt(2) / (r * Math.cos(angle)) * (x ^ 2) - 2 * ratio * x		//轨迹方程
            y = 41 / (r *  Math.pow( Math.cos(angle), 2) ) *  Math.pow( x, 2) + 41 / Math.cos(angle) * x


            //TLog.Debug("111111111111111111111", x + ox, y + oy, this.getCombatId())
            JsUtil.arrayInstert(point_list, newPos(x + ox, y + oy))
            JsUtil.arrayInstert(speed_list, 2000 - l * 30)

            if (MathUtil.checkNormScope(0, 0, x, y, r) != include) {
                include = !include
                flag = flag - 1

            }
        } while (flag != 0)

        return [point_list, speed_list]
    }
    //////////////////////////////////////////////////////////////-
    onClickActor(mute?) {
        if (this.finishAction == false) {
            return
        }

        if (this.clickTick >= 1) {
            return
        }
        this.clickTick = this.clickTick + 1

        if (mute == null) {
            //GameSound.getInstance().playEffect(SystemSound.effect_itemPick)
        } else {
            if (this.isVisible() == false) {
                return
            }
        }
        this.setVisible(false)
        //
        let wnd = WngMrg.getInstance().createWindow("CharacterAwardFrame")
        awardWndInde = awardWndInde + 1
        wnd.setRootFrameName("CharacterAwardFrame" + awardWndInde)
        let content = ""
        if (this.awardType == "money") {
            content = Localize_cns("JINBI") + "X" + this.param1
        } else {
            content = this.itemName
        }

        this.awardFrame = wnd
        return wnd.showAwardInfo(content, this.fontColor, this)
    }

    handleAnimNotify(notify) {
        if (notify == "end") {
            // if (this.curEffectId == effectIndex.ChuanQiSuitDrop) {
            //     this.curEffectId = effectIndex.ChuanQiSuit
            // } else {
            //     this.curEffectId = effectIndex.ChuanQiOrange
            // }

            let effect = EffectManager.getInstance().createBindEffect(this.curEffectId, this)
            //effect.setLoadModelSyn(true)

            FightSystem.getInstance().hangUpFinishHandler(false)
            //this.finishAction = true
        }
    }

    ////////////////////////////////////////////////////////////////////////-
    isFinishAction() {
        return this.finishAction
    }
}