class ShenHunStrongFrame extends BaseWnd {
    item
    controlData: any

    selectlist

    watting

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/role/ShenHunStrongLayout.exml"]
    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_strong", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onStrongClick },
            { ["name"]: "btn_onekey", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onOneKeyClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        let list: eui.List = this.mElemList["item_list"]
        list.itemRenderer = itemRender.ShenHunItem

        this.watting = false
    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ITEM_UPDATE, this.updateWnd, this)
        RegisterEvent(EventDefine.SHENHUN_UPGRADE, this.updateWnd, this)
        this.mLayoutNode.visible = true;
        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.updateWnd, this)
        UnRegisterEvent(EventDefine.SHENHUN_UPGRADE, this.updateWnd, this)
        this.mLayoutNode.visible = false;
        //this.item = null
        this.selectlist = []
        this.watting = false
    }

    updateWnd() {
        if (this.item == null) return
        let id = this.item.id
        let old_exp = this.item.getProperty("equip_exp")
        let old_level = this.item.getProperty("enhanceLevel")
        let item = ItemSystem.getInstance().getItemLogicInfoByID(id)
        if (item == null) {
            let shenhunList = RoleSystem.getInstance().getShenHunInfo("shenhunlist")
            for (let k in shenhunList) {
                let temp = shenhunList[k]
                if (temp.id == id) {
                    item = temp
                    break
                }
            }
        }
        if (item == null) return
        let new_exp = item.getProperty("equip_exp")
        let new_level = item.getProperty("enhanceLevel")
        if (new_exp != old_exp || new_level != old_level) {
            this.selectlist = []
            this.watting = false
        }
        this.item = item
        this.onRefresh()
    }

    onRefresh() {
        if (this.item == null) return
        let netInfo = []
        let item = this.item
        let entry = item.getEntryId()
        let quality = item.getProperty("quality") || item.getRefProperty("quality") || 1
        let add_num = item.getProperty("enhanceLevel") || 0
        this.mElemList["item_bg"].source = GetFaBaoQualutyImage(quality)
        this.mElemList["item_icon"].source = GetItemIcon(entry)
        this.mElemList["label_name"].textColor = GetQualityColorGui(quality)
        this.mElemList["label_name"].text = item.getName()
        let name = getShenHunAnimName(quality)
        let animBox = this.mElemList["anim"]
        animBox.setAnimName(name)
        animBox.setLoop(true)
        let checkAdd = add_num >= 1
        this.mElemList["item_add"].visible = checkAdd
        if (checkAdd) {
            let source = "ty_jinJieShu"
            if (add_num < 10) {
                source += 0
            }
            this.mElemList["item_add"].source = source + add_num
        }
        let checkManji = add_num >= 15

        //进度条
        let upConfig = GameConfig.ShenHunEquipUpConfig[quality]
        let needexp = upConfig[add_num].needExp || 1
        let curexp = item.getProperty("equip_exp") || 0
        if (checkManji) {
            curexp = needexp = 1
        }
        UiUtil.updateProgress(this.mElemList["pro"], curexp, needexp)

        let selectlist = this.selectlist
        let addexp = 0
        let meltConfig = GameConfig.ShenHunEquipMeltConfig
        for (let k in selectlist) {
            let item = ItemSystem.getInstance().getItemLogicInfoByID(selectlist[k])
            if (item == null) continue
            let quality = item.getProperty("quality") || 1
            let add_num = item.getProperty("enhanceLevel") || 0
            let v = meltConfig[quality][add_num]
            if (!v) continue
            addexp += v.wardExp
        }
        let nowexp = this.item.getProperty("equip_exp") || 0
        let plusExp = nowexp + addexp
        let checkAddExp = addexp != 0
        this.mElemList["pro_plus"].visible = checkAddExp
        //this.mElemList["label_add"].visible = checkAdd
        if (checkAddExp) {
            let quality = this.item.getProperty("quality")
            let enhanceLevel = this.item.getProperty("enhanceLevel")
            let upConfig = GameConfig.ShenHunEquipUpConfig[quality][enhanceLevel]
            let needexp = upConfig.needExp || 1
            UiUtil.updateProgress(this.mElemList["pro_plus"], plusExp, needexp)

            // this.mElemList["label_add"].x = (nowexp* 574)/needexp
        }
        if (checkManji) {
            plusExp = needexp = 1
        }
        this.mElemList["label_add"].text = plusExp + "/" + needexp

        let tolevel = 0
        for (let k in upConfig) {
            let v = upConfig[k]
            if (v.level < add_num) continue
            if (plusExp > v.needExp) {
                plusExp -= v.needExp
                tolevel = v.level + 1
            } else {
                break
            }
        }
        if (tolevel >= optionShenHun.maxLevel) {
            tolevel = optionShenHun.maxLevel
        }
        if (checkManji) {
            tolevel = optionShenHun.maxLevel
        }
        if (tolevel == 0) {
            tolevel = add_num + 1
        }
        let toLevelStr = ""
        if (checkManji) {
            toLevelStr = "#lime" + Localize_cns("ROLE_TXT31")
        } else {
            toLevelStr = add_num + ""
            if (tolevel != 0) {
                toLevelStr += "#JIANTOU" + tolevel
            }
        }
        AddRdContent(this.mElemList["rd_tolevel"], toLevelStr, "ht_20_cc_stroke")


        //属性
        let percent = upConfig[add_num].percentage || 0
        let effectConfig = GameConfig.ShenHunEquipEffectConfig[entry][quality]
        if (effectConfig == null) return
        let effects = table_effect(effectConfig.effects)
        let nowEffect = {}
        let mult = 1
        if (percent != 0) {
            mult = percent
        }
        for (let k in effects) {

            nowEffect[k] = effects[k] * mult
        }
        let now_pro_str = ""
        for (let k in nowEffect) {
            let v = nowEffect[k]
            now_pro_str += GetPropertyName(k) + "#greenyellow"
            let isFloat = v < 1
            if (isFloat) {
                now_pro_str += FormatNumber2f(v * 100) + "%"
            } else {
                now_pro_str += FormatNumberInt(v)
            }
            // if (percent > 0) {
            //     if(isFloat){
            //         now_pro_str += "+" + FormatNumber2f(v * percent * 100) + "%"
            //     }else{
            //         now_pro_str += "+" + FormatNumberInt(v * percent)
            //     }
            // }
            now_pro_str += "#br#br#rf"
        }
        now_pro_str += Localize_cns("SHENHUN_TXT23") + effectConfig.skillTips
        let rd_1: gui.RichDisplayer = this.mElemList["rd_skill_1"]
        AddRdContent(rd_1, now_pro_str, "ht_20_cc_stroke")
        rd_1.height = rd_1.getLogicHeight()

        let nextUpConfig = GameConfig.ShenHunEquipUpConfig[quality][tolevel]
        let next_pro_str = ""

        if (nextUpConfig != null && add_num != optionShenHun.maxLevel) {
            let nextPercent = nextUpConfig.percentage || percent
            for (let k in nowEffect) {
                let v = nowEffect[k]
                let pro = effects[k]
                let isFloat = v < 1
                next_pro_str += GetPropertyName(k) + "#greenyellow"
                if (isFloat) {
                    next_pro_str += FormatNumber2f(v * 100) + "%#space_10+" + FormatNumber2f(pro * (nextPercent - percent) * 100) + "%"
                } else {
                    next_pro_str += FormatNumberInt(v) + "#space_10+" + FormatNumberInt(pro * (nextPercent - percent))
                }
                next_pro_str += "#br#br#rf"
            }
            next_pro_str += Localize_cns("SHENHUN_TXT23") + effectConfig.skillTips
        } else {
            next_pro_str = "#lime" + Localize_cns("ROLE_TXT31")
        }
        let rd_2: gui.RichDisplayer = this.mElemList["rd_skill_2"]
        AddRdContent(rd_2, next_pro_str, "ht_20_cc_stroke")
        rd_2.height = rd_2.getLogicHeight()

        //底部
        let item_list: eui.List = this.mElemList["item_list"]
        let itemList = ItemSystem.getInstance().getShenHunStrongMart(this.item.id)
        let dataList = []
        if (this.selectlist == null) {
            this.selectlist = []
        }
        for (let k = 0; k < size_t(itemList); k++) {
            let v = itemList[k] || {}
            let temp: any = {}
            temp.item = v
            temp.select = 1
            temp.frame = this
            table_insert(dataList, temp)
        }
        let showList = splitListByCount(dataList, 7)
        UiUtil.updateList(item_list, showList)
    }

    //---------------响应事件
    onStrongClick() {
        if (this.item == null) return
        if (size_t(this.selectlist) == 0) {
            MsgSystem.addTagTips(Localize_cns("SHENHUN_TXT11"))
            return
        }
        //检查满级
        let enhanceLevel = this.item.getProperty("enhanceLevel") || 0
        if (enhanceLevel >= 15) {
            MsgSystem.addTagTips(Localize_cns("SHENHUN_TXT12"))
            return
        }
        RpcProxy.call("C2G_EquipShenHunUp", this.item.id, this.selectlist)
    }

    onOneKeyClick() {
        if (this.item == null || this.watting) return
        let list = ItemSystem.getInstance().getItemLogicInfoByType(opItemType.ROLE_SHENHUN)
        let newList = []
        for (let k in list) {
            let item: Item = list[k]
            let id = item.id
            if (id == this.item.id) continue //本身
            let quality = item.getProperty("quality")
            if (quality > opEquipQuality.blue) continue //大于蓝色
            let lock = item.getProperty("talisman_lock") || 0
            if(lock == 1) continue //上锁
            if (!table_isExist(this.selectlist, id)) {
                table_insert(this.selectlist, id)
                table_insert(newList, id)
            }
        }
        if (size_t(this.selectlist) == 0) {
            MsgSystem.addTagTips(Localize_cns("SHENHUN_TXT14"))
            return
        }
        //检查满级
        let enhanceLevel = this.item.getProperty("enhanceLevel") || 0
        if (enhanceLevel >= 15) {
            MsgSystem.addTagTips(Localize_cns("SHENHUN_TXT12"))
            return
        }

        let id = this.item.id
        let selectlist = this.selectlist
        let tips = Localize_cns("SHENHUN_TXT25")
        let watting = false
        let t: IDialogCallback = {
            onDialogCallback(result: boolean, userdata): void {
                if (result == true) {
                    RpcProxy.call("C2G_EquipShenHunUp", id, selectlist)
                    watting = true
                } else {
                    //取消的话，把原本加进去的移除
                    for (let k in newList) {
                        let id = newList[k]
                        if (table_isExist(selectlist, id)) {
                            table_remove(selectlist, id)
                        }
                    }
                }
            }
        }
        MsgSystem.confirmDialog(tips, t, null)
        this.watting = watting
    }

    /////////----
    onShowWnd(item) {
        if (item == null) return
        this.item = item
        this.showWnd()
    }

}
