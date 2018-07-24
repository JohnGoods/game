/*
FUN工具类
*/
class FunUITools {
    /////////////////////////////UI更新///////////////////////////////
    //更新战力
    static updateForceNum(_type: number, wnd: BaseCtrlWnd) {
        //let funInfo = FunSystem.getInstance().getFunInfoWithType(_type)
        let force = GetTemCellTotalForce(_type) // funInfo.force

        let bImage = wnd.mElemList["batch_force"]
        DrawNumberStringImage(bImage, "zhanLi_", "z" + force, 0, 0, -3)
    }

    //更新增加战力
    static updateAddForceNum(_type: number, wnd: BaseCtrlWnd) {
        let upConfig = GetTemCellNextGradeProperty(_type)
        let addforce = GetForceMath(upConfig)

        let str = String.format(Localize_cns("ROLE_TXT22"), addforce)
        wnd.mElemList["rd_add_force"].setAlignFlag(gui.Flag.CENTER_CENTER)
        AddRdContent(wnd.mElemList["rd_add_force"], str, "ht_22_cc_stroke");
    }

    //更新名字
    static updateActorName(_type: number, wnd: BaseCtrlWnd, stage: number) {
        let funInfo = FunSystem.getInstance().getFunInfoWithType(_type)

        //不显示
        let list = [
            cellOptionsIndex.PetTongLin,
            cellOptionsIndex.XianLvFaZhen,
            cellOptionsIndex.XianLvXianWei,
        ]

        if (wnd.mElemList["name_wnd"]) {
            wnd.mElemList["name_wnd"].visible = (true)
            for (let i in list) {
                let v = list[i]
                if (v == _type) {
                    wnd.mElemList["name_wnd"].visible = (false)
                    break
                }
            }
        }
        //更新名字
        wnd.mElemList["name_txt"].text = FunSystem.getInstance().getFunModelName(_type, stage) || ""
    }

    //更新等阶
    static updateActorStage(_type: number, wnd: BaseCtrlWnd, stage: number) {
        wnd.mElemList["stage_txt"].text = stage + Localize_cns("PET_TXT10")
    }

    //更新技能
    static updateSkillWnd(_type: number, wnd: BaseCtrlWnd) {
        let funInfo = FunSystem.getInstance().getFunInfoWithType(_type)
        for (let i = 0; i < 4; i++) {
            //更新技能图标
            if (wnd.mElemList["skillFunBox_" + i] == null) {
                wnd.mElemList["skillFunBox_" + i] = UIFunSkillBox.newObj(wnd.mLayoutNode, "skillFunBox_" + i, 72 * (i - 1), 0, wnd.mElemList["fun_skill_wnd"], 0.72)
            }

            wnd.mElemList["skillFunBox_" + i].updateFunSkill(_type, i)
        }
    }

    //更新天女技能
    static updateTianNvSkillWnd(_typelist: number[], wnd: BaseCtrlWnd, parent: eui.Group, name: string) {

        for (let i = 0; i < size_t(_typelist); i++) {
            //更新技能图标
            if (wnd.mElemList[name + i] == null) {
                wnd.mElemList[name + i] = UIFunSkillBox.newObj(wnd.mLayoutNode, name + i, 72 * (i - 1), 0, parent, 0.72, _typelist[i], 0)
            }

            wnd.mElemList[name + i].updateFunSkill(_typelist[i], 0)
        }
    }

    //更新装备
    static updateEquipWnd(_type: number, wnd: BaseCtrlWnd) {
        let equipItemList = FunSystem.getInstance().getWearEquipItemList(_type)

        let subTypeList = GameConfig.FunEquipCaseConfig[cellOptionsName[_type - 1]].subtype
        for (let i in subTypeList) {
            //创建itembox
            if (wnd.mElemList["itemBox_" + i] == null) {
                wnd.mElemList["itemBox_" + i] = UIItemBox.newObj(wnd.mLayoutNode, "itemBox_" + i, 72 * (tonumber(i) - 1), 0, wnd.mElemList["fun_equip_wnd"], 0.9)
            }

            wnd.mElemList["itemBox_" + i].resetFunEquip(tonumber(i))
            for (let index in equipItemList) {
                let item: Item = equipItemList[index]
                if (item.getRefProperty("subtype") == subTypeList[i]) {//已穿戴
                    wnd.mElemList["itemBox_" + i].updateByItem(item) //(item.entryId, 1, item.getProperty("quality"), item.getProperty("add_num"))
                }
            }
        }
    }

    //更新角色模型
    static updateActorModel(_type: number, wnd: BaseCtrlWnd, stage?, scale?, dir?) {
        if (stage == null) {
            stage = 1;
        }

        let frame: any = wnd.mParentWnd

        //根据类型获取模型id
        let modeID = GetFunShapeModel(_type, stage)
        if (!wnd.mElemList["fun_model"]) {
            wnd.mElemList["fun_model"] = UIActorView.newObj(wnd.mLayoutNode, "fun_model", 0, 0, wnd.mElemList["actor_wnd"])
        }

        if (frame.paramModeID != modeID) {
            wnd.mElemList["fun_model"].updateByPlayer(modeID)
            frame.paramModeID = modeID
            frame.paramModeType = _type
        } else if (frame.paramModeType != _type) {
            wnd.mElemList["fun_model"].updateByPlayer(modeID)
            frame.paramModeID = modeID
            frame.paramModeType = _type
        }
    }

    static clearActorData(frame: BaseWnd) {
        let baseFrame: any = frame
        baseFrame.paramModeID = null
        baseFrame.paramModeType = null
    }

    //更新exp进度条
    static updateExpProgress(_type: number, wnd: BaseCtrlWnd) {
        let funInfo = FunSystem.getInstance().getFunInfoWithType(_type)
        if(!funInfo)
            return;
        let curStage = funInfo.stage
        let limitExp = GameConfig.FunUpgradeStageConfig[cellOptionsName[_type - 1]][curStage].maxexp
        UiUtil.updateProgress(wnd.mElemList["exp_progress"], funInfo.stageexp, limitExp)
    }

    //更新消耗材料
    static updateNeedMaterial(_type: number, wnd: BaseCtrlWnd) {
        let funInfo = FunSystem.getInstance().getFunInfoWithType(_type)
        if(!funInfo)
            return;

        let material = FunSystem.getInstance().getFunUpgradeMaterial(_type, funInfo.stage)
        let ownNum = ItemSystem.getInstance().getItemCount(material.itemId)
        let needNum = material.itemNum
        if (needNum == 0) {
            ownNum = 0
        }
        let color = ownNum >= needNum ? "#green" : "#red"
        let str = Localize_cns("PET_TXT4") + "#space#rf" + GetTagIcon(material.itemId) + "#rf" + color + ownNum + "/" + needNum
        let ownMoney = GetHeroMoney(material.moneyUnit)
        let needMoney = material.money
        if (needMoney == 0) {
            ownMoney = 0
        }
        let moneyColor = ownMoney >= needMoney ? "#green" : "#red"
        str = str + "#space#rf" + GetMoneyIcon(material.moneyUnit) + "#rf" + moneyColor + needMoney
        AddRdContent(wnd.mElemList["material_rd"], str, "ht_24_cc", "ublack")
    }

    //满级
    static checkFullLevel(_type: number, wnd: BaseCtrlWnd, autoBtn: string, btn: string, full: string) {
        let funInfo = FunSystem.getInstance().getFunInfoWithType(_type)
        if(!funInfo)
            return;
        let maxStage = size_t(GameConfig.FunUpgradeStageConfig[cellOptionsName[_type - 1]])
        let curStage = funInfo.stage
        if (curStage >= maxStage) { //满级了
            UiUtil.updateProgress(wnd.mElemList["exp_progress"], 1, 1)

            FunUITools.updateNeedMaterial(_type, wnd)

            wnd.mElemList[autoBtn].visible = false
            wnd.mElemList[btn].visible = false

            wnd.mElemList[full].visible = true
            wnd.mElemList[full].text = String.format(Localize_cns("PET_TXT41"), Localize_cns(cellOptionsName[_type - 1]))

            FunUITools.resetUpgradeBtnState(_type, wnd, autoBtn, btn)
        } else {
            wnd.mElemList[autoBtn].visible = true
            wnd.mElemList[btn].visible = true

            wnd.mElemList[full].visible = false
        }
    }

    /////////////////////////////响应事件/////////////////////////////////
    //皮肤
    static openSkinsFrame(_type: number) {
        let wnd = WngMrg.getInstance().getWindow("CommonSkinsFrame");
        wnd.onShowWnd(_type);

    }
    //属性丹
    static openPropertyFrame(_type: number) {
        let wnd: CommonDrugFrame = WngMrg.getInstance().getWindow("CommonDrugFrame");
        wnd.onShowWnd(_type);

    }

    //查看属性
    static openFunPropertyFrame(_type: number, select: number) {
        let wnd = WngMrg.getInstance().getWindow("CommonFunPropertyFrame");
        wnd.onShowWnd(_type, select);

    }
    //幻化
    static sendTurnRequest(_type: number, index: number) {
        RpcProxy.call("C2G_TEMPCELLFUN_SHAPE_SET", _type, index)
    }

    //升阶
    static upgradeFunction(_type: number, wnd: BaseCtrlWnd, autoBtn: string, btn: string) {
        let temp: any = wnd
        if (temp.isAuto) {
            FunUITools.resetUpgradeBtnState(_type, wnd, autoBtn, btn)
        }

        FunUITools.upgradeAutoFunctionCheck(_type, wnd, autoBtn, btn)
    }

    //自动升阶
    static upgradeAutoFunction(_type: number, wnd: BaseCtrlWnd, autoBtn: string, btn: string) {
        let temp: any = wnd
        temp.isAuto = !temp.isAuto

        if (temp.isAuto) {
            wnd.mElemList[autoBtn].text = Localize_cns("STOP")
            wnd.mElemList[btn].enabled = false

            FunUITools.upgradeAutoFunctionCheck(_type, wnd, autoBtn, btn)
        } else {
            wnd.mElemList[autoBtn].text = Localize_cns("PET_AUTO_UPGRADE")
            wnd.mElemList[btn].enabled = true
        }
    }

    static upgradeAutoFunctionCheck(_type: number, wnd: BaseCtrlWnd, autoBtn: string, btn: string) {
        let funInfo = FunSystem.getInstance().getFunInfoWithType(_type)
        if(!funInfo)
            return;
        let curStage = funInfo.stage
        let curExp = funInfo.stageexp

        //消耗材料
        let itemId = GameConfig.FunUpgradeStageConfig[cellOptionsName[_type - 1]][curStage].itemid
        let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)
        let needItemCount = GameConfig.FunUpgradeStageConfig[cellOptionsName[_type - 1]][curStage].itemnum

        //消耗货币
        let moneyUnit = GameConfig.FunUpgradeStageConfig[cellOptionsName[_type - 1]][curStage].moneyunit
        let ownMoney = GetHeroMoney(moneyUnit)
        let costMoney = GameConfig.FunUpgradeStageConfig[cellOptionsName[_type - 1]][curStage].money

        //判断货币是否足够
        if (ownMoney < costMoney) {
            //直接弹出对应的货币购买界面
            WngMrg.getInstance().showWindow("MoneyChargeFrame")

            FunUITools.resetUpgradeBtnState(_type, wnd, autoBtn, btn)
            return
        }

        let name = cellOptionsName[_type - 1] + "_checkbox"
        let auto = wnd.mElemList[name].selected
        //判断材料是否足够
        if (ownItemCount < needItemCount) {
            //自动购买
            if (auto) {
                /*
                   1.判断绑元是否足够购买，足发送升级协议
                   2.绑元不足，需要消耗元宝，必须提示玩家要消耗元宝，不同意直接停止
                   3.消耗元宝，判断元宝是否足够购买，足发送升级协议，不足弹出充值
                */
                var count = needItemCount - ownItemCount
                var byPrice = ShopSystem.getInstance().getBindYBItemPrice(2, itemId)
                if (byPrice) {
                    if (GetHeroMoney(opItemUnit.BIND_CURRENCY) >= (count * byPrice)) {
                        wnd.mElemList["upgrade_anim" + curStage + curExp] = UIUpgradeAnim.newObj(wnd.mLayoutNode, "upgrade_anim" + curStage + curExp, 0, 0, wnd.mElemList["anim_wnd"])
                        wnd.mElemList["upgrade_anim" + curStage + curExp].startAnim(10)
                        RpcProxy.call("C2G_TEMPCELLFUN_STAGE_UP", _type, auto)
                    } else {
                        let frame: any = wnd
                        if (!frame.isAutoYB) {
                            let callback: IDialogCallback = {
                                onDialogCallback(result: boolean, userData): void {
                                    if (result) {
                                        let ybPrice = ShopSystem.getInstance().getBindYBItemPrice(1, itemId)
                                        if (ybPrice) {
                                            let needCount = Math.ceil((count * byPrice - GetHeroMoney(opItemUnit.BIND_CURRENCY)) / byPrice)
                                            let needYB = needCount * ybPrice
                                            if (GetHeroMoney(opItemUnit.CURRENCY) >= needYB) {
                                                wnd.mElemList["upgrade_anim" + curStage + curExp] = UIUpgradeAnim.newObj(wnd.mLayoutNode, "upgrade_anim" + curStage + curExp, 0, 0, wnd.mElemList["anim_wnd"])
                                                wnd.mElemList["upgrade_anim" + curStage + curExp].startAnim(10)
                                                RpcProxy.call("C2G_TEMPCELLFUN_STAGE_UP", _type, auto)

                                                let frame: any = wnd
                                                frame.isAutoYB = true
                                            } else {
                                                MsgSystem.addTagTips(Localize_cns("COPY_TXT16"))
                                                ExecuteMainFrameFunction("chongzhi")
                                                FunUITools.resetUpgradeBtnState(_type, wnd, autoBtn, btn)
                                            }
                                        }
                                    } else {
                                        FunUITools.resetUpgradeBtnState(_type, wnd, autoBtn, btn)
                                    }
                                }
                            }
                            MsgSystem.confirmDialog(Localize_cns("PET_TXT38"), callback)
                        } else {
                            let ybPrice = ShopSystem.getInstance().getBindYBItemPrice(1, itemId)
                            if (ybPrice) {
                                let needCount = Math.ceil((count * byPrice - GetHeroMoney(opItemUnit.BIND_CURRENCY)) / byPrice)
                                let needYB = needCount * ybPrice
                                if (GetHeroMoney(opItemUnit.CURRENCY) >= needYB) {
                                    wnd.mElemList["upgrade_anim" + curStage + curExp] = UIUpgradeAnim.newObj(wnd.mLayoutNode, "upgrade_anim" + curStage + curExp, 0, 0, wnd.mElemList["anim_wnd"])
                                    wnd.mElemList["upgrade_anim" + curStage + curExp].startAnim(10)
                                    RpcProxy.call("C2G_TEMPCELLFUN_STAGE_UP", _type, auto)

                                    // let frame: any = wnd
                                    // frame.isAutoYB = true
                                } else {
                                    MsgSystem.addTagTips(Localize_cns("COPY_TXT16"))
                                    ExecuteMainFrameFunction("chongzhi")
                                    FunUITools.resetUpgradeBtnState(_type, wnd, autoBtn, btn)
                                }
                            }
                        }
                    }
                }
                return
            }

            //弹出材料购买界面
            if (GuideSystem.getInstance().isFinishGuide()) {
                let quickWnd: GoodsAsseceFrame = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
                quickWnd.onShowWnd(itemId, needItemCount - ownItemCount);
            }

            FunUITools.resetUpgradeBtnState(_type, wnd, autoBtn, btn)
        } else {
            wnd.mElemList["upgrade_anim" + curStage + curExp] = UIUpgradeAnim.newObj(wnd.mLayoutNode, "upgrade_anim" + curStage + curExp, 0, 0, wnd.mElemList["anim_wnd"])
            wnd.mElemList["upgrade_anim" + curStage + curExp].startAnim(10)
            RpcProxy.call("C2G_TEMPCELLFUN_STAGE_UP", _type, auto)
        }
    }

    static resetUpgradeBtnState(_type: number, wnd: BaseCtrlWnd, autoBtn: string, btn: string) {
        wnd.mElemList[autoBtn].text = Localize_cns("PET_AUTO_UPGRADE")
        wnd.mElemList[btn].enabled = true
        let temp: any = wnd
        temp.isAuto = false
        temp.isAutoYB = false
    }

    //换装检查
    static checkWearEquip(_type: number, wnd: BaseCtrlWnd) {
        let netConfig = FunSystem.getInstance().getFunInfoWithType(_type)
        if (!netConfig) {
            return
        }
        let stage = netConfig.stage
        let list: any[] = []

        let subTypeList = GameConfig.FunEquipCaseConfig[cellOptionsName[_type - 1]].subtype
        for (let subKey in subTypeList) {
            let subtype = subTypeList[subKey]
            let equipList = null //subtype位置的stage装备

            equipList = ItemSystem.getInstance().getFunEquipListWithStage(subtype, stage)

            if (size_t(equipList) > 0) {
                table_sort(equipList, function (a, b) {
                    return GetForceMath(GetFunEquipProperty(a.entryId, a.getProperty("quality"), a.getProperty("add_num"))) - GetForceMath(GetFunEquipProperty(b.entryId, b.getProperty("quality"), b.getProperty("add_num")))
                })
            } else {
                continue
            }

            let wearEquipList = FunSystem.getInstance().getWearEquipItemList(_type)
            let wearItem: Item = null
            for (let j in wearEquipList) {
                let item = wearEquipList[j]
                if (item.getRefProperty("subtype") == subtype) {
                    wearItem = item
                }
            }

            if (wearItem) {//有穿戴
                let wearForce = GetForceMath(GetFunEquipProperty(wearItem.entryId, wearItem.getProperty("quality"), wearItem.getProperty("add_num")))
                let equipForce = GetForceMath(GetFunEquipProperty(equipList[0].entryId, equipList[0].getProperty("quality"), equipList[0].getProperty("add_num")))
                if (wearForce >= equipForce) {
                    continue
                } else {
                    JsUtil.arrayInstert(list, equipList[0].id)
                }
            } else {
                JsUtil.arrayInstert(list, equipList[0].id)
            }
        }

        if (size_t(list) == 0 && wnd.mElemList["wear_equip_btn"]) {
            wnd.mElemList["wear_equip_btn"].visible = false
        }

        return list
    }

    //一键换装
    static oneKeyWearEquip(_type: number, wnd: BaseCtrlWnd, equipList) {
        RpcProxy.call("C2G_TEMPCELLFUN_EQUIP_SET", _type, equipList)
    }

    //升阶奖励
    static openUpgradeFunPrize(_type: number) {
        let wnd: FunPrizeFrame = WngMrg.getInstance().getWindow("FunPrizeFrame");
        wnd.showWithType(_type);
    }

    //红点提示属性丹
    static refreshDanDotTips(_type: number, wnd: BaseCtrlWnd) {
        let parentWnd: BaseWnd = wnd.mParentWnd
        if (GuideFuncSystem.getInstance().checkPropertyDan(_type)) {
            parentWnd.createDotTipsUI(wnd.mElemList["btn_property_dan"])
        }
    }

    //红点提示装备
    static refreshEquipDotTips(_type: number, wnd: BaseCtrlWnd) {
        let parentWnd: BaseWnd = wnd.mParentWnd
        for (let i = 0; i < 4; i++) {
            if (GuideFuncSystem.getInstance().checkOneFunEquip(_type, i)) {
                parentWnd.createDotTipsUI(wnd.mElemList["itemBox_" + i].rootWnd)
            }
        }
    }

    //红点提示技能
    static refreshSkillDotTips(_type: number, wnd: BaseCtrlWnd) {
        let parentWnd: BaseWnd = wnd.mParentWnd
        for (let i = 0; i < 4; i++) {
            if (GuideFuncSystem.getInstance().checkOneFunSkill(_type, i)) {
                parentWnd.createDotTipsUI(wnd.mElemList["skillFunBox_" + i].rootWnd)
            }
        }
    }


    //红点天女提示技能
    static refreshTianNvSkillDotTips(_type: number, wnd: BaseCtrlWnd) {
        let parentWnd: BaseWnd = wnd.mParentWnd
        let _typelist = {
            [cellOptionsIndex.TianNv]: [
                cellOptionsIndex.TianNv,
                cellOptionsIndex.TianNvXianQi,
                cellOptionsIndex.TianNvHuaNian,
                cellOptionsIndex.TianNvLingQi
            ],

            [cellOptionsIndex.TianNvXianQi]: [cellOptionsIndex.TianNvXianQi],
            [cellOptionsIndex.TianNvHuaNian]: [cellOptionsIndex.TianNvHuaNian],
            [cellOptionsIndex.TianNvLingQi]: [cellOptionsIndex.TianNvLingQi]
        }
        let typelist = _typelist[_type]

        let nameList = {
            [cellOptionsIndex.TianNv]: "tiannvskill",
            [cellOptionsIndex.TianNvXianQi]: "lingqiskill",
            [cellOptionsIndex.TianNvHuaNian]: "lingqiskill",
            [cellOptionsIndex.TianNvLingQi]: "lingqiskill"
        }
        let name = nameList[_type]
        for (let i = 0; i < typelist.length; i++) {
            let type = typelist[i]
            if (GuideFuncSystem.getInstance().checkOneFunSkill(type, 0)) {
                parentWnd.createDotTipsUI(wnd.mElemList[name + i].rootWnd)
            }
        }
    }

    //红点提示自动升阶
    static refreshUpgradeDotTips(_type: number, wnd: BaseCtrlWnd) {
        let parentWnd: BaseWnd = wnd.mParentWnd

        if (GuideFuncSystem.getInstance().checkFunUpgrade(_type)) {
            parentWnd.createDotTipsUI(wnd.mElemList["btn_upgrade"])
            parentWnd.createDotTipsUI(wnd.mElemList["btn_auto_upgrade"])
        }
    }

    //红点提示皮肤
    static refreshSkinDotTips(_type: number, wnd: BaseCtrlWnd) {
        let parentWnd: BaseWnd = wnd.mParentWnd

        if (GuideFuncSystem.getInstance().checkFunSkin(_type)) {
            parentWnd.createDotTipsUI(wnd.mElemList["btn_skin"])
        }
    }

    //红点提示直升丹
    static refreshShootUpDotTips(_type: number, wnd: BaseCtrlWnd) {
        let parentWnd: BaseWnd = wnd.mParentWnd

        if (GuideFuncSystem.getInstance().checkShootUp(_type)) {
            parentWnd.createDotTipsUI(wnd.mElemList["btn_shootUp"])
        }
    }

    //红点提示通用升阶奖励
    static refreshFunPrizeDotTips(_type: number, wnd: BaseCtrlWnd) {
        let parentWnd: BaseWnd = wnd.mParentWnd

        if (GuideFuncSystem.getInstance().checkFunPrize(_type)) {
            parentWnd.createDotTipsUI(wnd.mElemList["fun_prize_btn"])
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    //直升丹开服8天显示
    static updateShootUpBtnState(_type: number, wnd: BaseCtrlWnd) {
        wnd.mElemList["btn_shootUp"].visible = (GetServerDay() <= 8)
    }

    //直升丹响应
    static useShootUpItem(_type: number, wnd: BaseCtrlWnd) {
        let useItemIdList = ItemSystem.getInstance().getCanUseItemList()
        let useItem = null
        for (let i in useItemIdList) {
            let itemId = useItemIdList[i]
            let item = ItemSystem.getInstance().getItemLogicInfoByID(itemId)
            if (!item) {
                continue
            }
            if (item.getRefProperty("action") == "stageLevelUp") {
                let itemEffects = item.getRefProperty("effects")
                if (itemEffects[0][0] == _type) {
                    useItem = item
                }
            }
        }

        if (useItem) {
            ItemSystem.getInstance().useLogicItem(useItem)
        } else {
            MsgSystem.addTagTips(Localize_cns("MATRIAL_NOENGOUGH"))
        }
    }

    //经验丹检测
    static checkExpDan(_type: number, wnd: BaseCtrlWnd) {
        let useItemIdList = ItemSystem.getInstance().getCanUseItemList()
        for (let i in useItemIdList) {
            let itemId = useItemIdList[i]
            let item = ItemSystem.getInstance().getItemLogicInfoByID(itemId)
            if (!item) {
                continue
            }

            if (item.getRefProperty("action") == "stageExp" && _type == item.getRefProperty("effects")[0]) {
                ItemSystem.getInstance().useLogicItem(item)
            }
        }
    }
}