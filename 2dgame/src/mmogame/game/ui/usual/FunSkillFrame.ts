class FunSkillFrame extends BaseWnd {
    funType: number;
    index: number;
    typeList: number[]

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/usual/FunSkillLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        //this.setFullScreen(true)
        this.initSkinElemList();
        this.setAlignCenter(true, true)

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

            { ["name"]: "btn_upgrade", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickUpgrade },

            { ["name"]: "label_manji", ["title"]: Localize_cns("ROLE_TXT31"), ["font"]: "ht_26_cc_stroke", ["color"]: gui.Color.lime },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["itemBox"] = UIItemBox.newObj(this.mLayoutNode, "itemBox", 136, 31, this.mElemList["group_bottom"])
        this.mElemList["itemBox"].setVisible(false)

        this.mElemList["name_rd"].setAlignFlag(gui.Flag.H_CENTER)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        UiUtil.registerTouchOutsideEvent(this.hideWnd, this, [this.mLayoutNode])
        this.mLayoutNode.visible = true;
        this.mLayoutNode.setDoModal(true)
        RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.onRefresh, this)

        this.onRefresh()
    }

    public onHide(): void {
        UiUtil.unRegisterTouchOutsideEvent(this.hideWnd, this)
        this.mLayoutNode.visible = false;
        this.mLayoutNode.setDoModal(true)
        this.typeList = null
        this.funType = null
        this.index = null
        UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.onRefresh, this)
    }

    onRefresh() {
        if (this.typeList == null) {
            this.refreshFrame()
        } else {
            this.refreshListFrame()
        }
    }

    refreshFrame() {
        if (!table_isExist(cellOptionsIndex, this.funType)) {
            return
        }

        for (let i = 0; i < 4; i++) {
            if (this.mElemList["skillBox_" + i] == null) {
                this.mElemList["skillBox_" + i] = UIFunSkillBox.newObj(this.mLayoutNode, "skillBox_" + i, 0, 0, this.mElemList["skill_group"], 0.9)
                this.mElemList["skillBox_" + i].setClickCallBack(this.updateSelet, this, i)
            }

            this.mElemList["skillBox_" + i].updateFunSkill(this.funType, i)
        }

        this.updateSelet()
    }

    refreshListFrame() {
        for (let i = 0; i < size_t(this.typeList); i++) {
            if (this.mElemList["skillBox_" + i] == null) {
                this.mElemList["skillBox_" + i] = UIFunSkillBox.newObj(this.mLayoutNode, "skillBox_" + i, 0, 0, this.mElemList["skill_group"], 0.9)
                this.mElemList["skillBox_" + i].setClickCallBack(this.updateSelet, this, i)
            }

            this.mElemList["skillBox_" + i].updateFunSkill(this.typeList[i], 0)
        }

        this.updateSelet()
    }

    updateSelet(index?) {
        if (index != null) {
            this.index = index
        }
        if (this.typeList != null) {
            this.funType = this.typeList[this.index]
        }

        for (let i = 0; i < 4; i++) {
            this.mElemList["skillBox_" + i].select(false)
        }
        this.mElemList["skillBox_" + this.index].select(true)

        let skillConfigInfo
        if (this.typeList == null) {
            skillConfigInfo = FunSystem.getInstance().getFunSkillConfigWithPos(this.funType, this.index + 1)
        } else {
            skillConfigInfo = FunSystem.getInstance().getFunSkillConfigWithPos(this.funType, 1)
        }


        let funInfo = FunSystem.getInstance().getFunInfoWithType(this.funType) || {}
        let skillList = funInfo.skilllevellist || []
        let skillLevel
        if (this.typeList != null) {
            skillLevel = skillList[0] || 0
        } else {
            skillLevel = skillList[this.index] || 0
        }

        //天女体验
        let tastList = [cellOptionsIndex.TianNv, cellOptionsIndex.TianNvXianQi, cellOptionsIndex.TianNvHuaNian, cellOptionsIndex.TianNvLingQi]
        let endTime = getSaveRecord(opSaveRecordKey.firstRechareTiannv) || 0
        if (table_isExist(tastList, this.funType) && endTime > GetServerTime()) {
            skillLevel = size_t(GameConfig.FunUpgradeStageConfig["TianNv"])
            for (let i = 0; i < 4; i++) {
                skillList[i] = size_t(GameConfig.FunLevelNumConfig["TianNv"] + 1)
            }
        }


        let skillname = skillConfigInfo.skillName
        let line = 0
        if (skillLevel == 0) { //未解锁
            AddRdContent(this.mElemList["name_rd"], skillname, "ht_24_cc", "white")

            this.mElemList["up_title"].text = Localize_cns("PET_TXT14")
            this.mElemList["down_title"].text = Localize_cns("PET_TXT15")

            //激活效果
            //let effects = table_effect(skillConfigInfo.effects)
            let baseeffects = table_effect(skillConfigInfo.effects)
            let addeffects = table_effect(skillConfigInfo.addeffects)
            let effects = table_effect_add(baseeffects, addeffects)

            var str = ""
            for (let k in effects) {
                let proName = GetPropertyName(abilityNameToIndex[k])
                let proValue = effects[k]
                str += Localize_cns("SKILL_TXT6") + proName + proValue + "#space_40"
            }
            if (this.typeList != null) {
                str = FunSystem.getInstance().getTianNvSkillDescribe(skillConfigInfo.SkillId, skillLevel + 1)
            }
            AddRdContent(this.mElemList["cur_attr_rd"], str, "ht_24_cc", "ublack", 5)

            var rd = <gui.RichDisplayer>this.mElemList["cur_attr_rd"]
            UiUtil.setWH(rd, rd.width, rd.getLogicRowCount() * 30)
            line = line + rd.getLogicRowCount()

            var offH = (rd.getLogicRowCount() - 1) * 30
            var list = ["down_title", "next_attr_rd", "group_bottom"]
            var initY = [370, 412, 480]
            for (let _ in list) {
                var elem = this.mElemList[list[_]]
                UiUtil.setXY(elem, elem.x, initY[_] + offH)
            }

            //解锁条件
            let unlock = skillConfigInfo.UnlockLevel
            var str = "#red" + Localize_cns(cellOptionsName[this.funType - 1]) + String.format(Localize_cns("PET_TXT16"), unlock)
            AddRdContent(this.mElemList["next_attr_rd"], str, "ht_24_cc", "ublack", 5)

            var rd = <gui.RichDisplayer>this.mElemList["next_attr_rd"]
            UiUtil.setWH(rd, rd.width, rd.getLogicRowCount() * 30)
            line = line + rd.getLogicRowCount()

            var offH = (rd.getLogicRowCount() - 1) * 30
            var elem = this.mElemList["group_bottom"]
            UiUtil.setXY(elem, elem.x, elem.y + offH)

            this.mElemList["itemBox"].setVisible(false)
            this.mElemList["material_rd"].visible = (false)
            this.mElemList["btn_upgrade"].visible = (false)
            this.mElemList["lock_icon"].visible = (true)
            this.mElemList["label_manji"].visible = (false)
            this.mElemList["next_attr_rd"].visible = true

        } else { //已解锁
            AddRdContent(this.mElemList["name_rd"], skillname + "#space#greenyellow" + skillLevel + Localize_cns("PET_TXT9"), "ht_24_cc", "white")

            this.mElemList["up_title"].text = Localize_cns("PET_TXT13")
            this.mElemList["down_title"].text = Localize_cns("PET_TXT14")

            let baseeffects = table_effect(skillConfigInfo.effects)
            let addeffects = table_effect(skillConfigInfo.addeffects)
            //当前效果
            for (let i = 0; i < skillLevel; i++) {
                table_effect_add(baseeffects, addeffects)
            }
            var str = ""
            for (let k in baseeffects) {
                let proName = GetPropertyName(abilityNameToIndex[k])
                let proValue = baseeffects[k]
                str += "#ublack" + Localize_cns("SKILL_TXT6") + proName + "#darkgreen" + proValue + "#space_40"
            }
            if (this.typeList != null) {
                str = FunSystem.getInstance().getTianNvSkillDescribe(skillConfigInfo.SkillId, skillLevel)
            }
            AddRdContent(this.mElemList["cur_attr_rd"], str, "ht_24_cc", "darkgreen", 5)

            var rd = <gui.RichDisplayer>this.mElemList["cur_attr_rd"]
            UiUtil.setWH(rd, rd.width, rd.getLogicRowCount() * 30)
            line = line + rd.getLogicRowCount()

            var offH = (rd.getLogicRowCount() - 1) * 30
            var list = ["down_title", "next_attr_rd", "group_bottom"]
            var initY = [370, 412, 480]
            for (let _ in list) {
                var elem = this.mElemList[list[_]]
                UiUtil.setXY(elem, elem.x, initY[_] + offH)
            }

            //下一级激活效果
            for (let k in baseeffects) {
                if (addeffects[k]) {
                    baseeffects[k] += addeffects[k]
                }
            }
            let info = FunSystem.getInstance().getFunSkillMaterialWithLv(this.funType, skillLevel)
            if (info != null) {
                var str = ""
                for (let k in baseeffects) {
                    let proName = GetPropertyName(abilityNameToIndex[k])
                    let proValue = baseeffects[k]
                    str += Localize_cns("SKILL_TXT6") + proName + proValue + "#space_40"
                }

                if (this.typeList != null) {
                    str = FunSystem.getInstance().getTianNvSkillDescribe(skillConfigInfo.SkillId, skillLevel + 1)
                }
                AddRdContent(this.mElemList["next_attr_rd"], str, "ht_24_cc", "gray", 5)

                var rd = <gui.RichDisplayer>this.mElemList["next_attr_rd"]
                UiUtil.setWH(rd, rd.width, rd.getLogicRowCount() * 30)
                line = line + rd.getLogicRowCount()

                var offH = (rd.getLogicRowCount() - 1) * 30
                var elem = this.mElemList["group_bottom"]
                UiUtil.setXY(elem, elem.x, elem.y + offH)
            }

            this.mElemList["itemBox"].setVisible(true)
            this.mElemList["material_rd"].visible = (true)
            this.mElemList["btn_upgrade"].visible = (true)
            this.mElemList["lock_icon"].visible = (false)
            this.mElemList["label_manji"].visible = (false)
            this.mElemList["group_bottom"].visible = true
            this.mElemList["down_title"].visible = true
            this.mElemList["next_attr_rd"].visible = true
            let itemId = skillConfigInfo.itemid

            if (info == null) {  //满级
                this.mElemList["label_manji"].visible = (true)
                this.mElemList["group_bottom"].visible = false
                this.mElemList["down_title"].visible = false
                this.mElemList["next_attr_rd"].visible = false
            } else {
                let itemNum = info.num
                let itemName = ItemSystem.getInstance().getItemName(itemId)
                let itemCount = ItemSystem.getInstance().getItemCount(itemId) || 0
                let color = itemCount >= itemNum ? "#darkgreen" : "#red"
                var str = itemName + "#rf#darkgreen*" + itemNum + "#br#ublack" + Localize_cns("ITEM_TXT30") + color + itemCount
                AddRdContent(this.mElemList["material_rd"], str, "ht_24_cc", "ublack", 3)

                this.mElemList["itemBox"].updateByEntry(itemId)
            }
        }

        if (line > 4) {
            let bg: eui.Group = this.mElemList["bg"]
            UiUtil.setWH(bg, bg.width, 780 + (line - 1) * 10)
            UiUtil.setWH(this.mLayoutNode, bg.width, bg.height)
        } else {
            let bg: eui.Group = this.mElemList["bg"]
            UiUtil.setWH(bg, bg.width, 780)
            UiUtil.setWH(this.mLayoutNode, bg.width, bg.height)
        }
    }

    onClickUpgrade(args) {
        if (!table_isExist(cellOptionsIndex, this.funType)) {
            return
        }
        let skillConfigInfo
        if (this.typeList == null) {
            skillConfigInfo = FunSystem.getInstance().getFunSkillConfigWithPos(this.funType, this.index + 1)
        } else {
            skillConfigInfo = FunSystem.getInstance().getFunSkillConfigWithPos(this.funType, 1)
        }
        let itemId = skillConfigInfo.itemid
        let itemNum = 1
        let aname = cellOptionsName[this.funType - 1]
        let funInfo = FunSystem.getInstance().getFunInfoWithType(this.funType) || {}
        let skillList = funInfo.skilllevellist || []
        let skillLevel
        if (this.typeList != null) {
            skillLevel = skillList[0] || 1
        } else {
            skillLevel = skillList[this.index] || 1
        }
        let upStartConfig = GameConfig.FunLevelNumConfig[aname][skillLevel]
        itemNum = upStartConfig.num
        let itemCount = ItemSystem.getInstance().getItemCount(itemId)
        if (itemCount >= itemNum) {
            if (this.typeList == null) {
                RpcProxy.call("C2G_TEMPCELLFUN_SKILL_UP", this.funType, this.index + 1)
            } else {
                RpcProxy.call("C2G_TEMPCELLFUN_SKILL_UP", this.funType, 1)
            }
        } else {
            MsgSystem.addTagTips(Localize_cns("MATRIAL_NOENGOUGH"))
        }
    }

    ///////////////////////////////////////////////////////
    showWithTypeAndIndex(_type, _index) {
        this.funType = _type
        this.index = _index
        this.showWnd()
    }

    showWithTypeListAndIndex(_type, _index) {
        this.typeList = _type
        this.index = _index
        this.showWnd()
    }
}