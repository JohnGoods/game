// TypeScript file
class TianXian_MeridianWnd extends BaseCtrlWnd {
    mElemList;
    type
    select
    jie

    maxSelectCount

    static JINGMAI_DAN = 60017
    static TUPO_DAN = 60018

    public initObj(...params: any[]) {
        this.type = cellOptionsIndex.TianXianJingMai
        this.maxSelectCount = 11
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList

        var elemInfo = [
            { ["name"]: "btn_tupo", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTupoClick },

        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["meridianBox"] = UIItemBox.newObj(this.mLayoutNode, "meridianBox", 80, 5, this.mElemList["group_btom"])

        this.mElemList["rd_top"].setAlignFlag(gui.Flag.LEFT_TOP)
        this.mElemList["rd_bottom"].setAlignFlag(gui.Flag.LEFT_TOP)
        this.mElemList["rd_this_num"].setAlignFlag(gui.Flag.LEFT_TOP)
        this.mElemList["rd_total_num"].setAlignFlag(gui.Flag.LEFT_TOP)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.TIANXIAN_UPDATE, this.refreshFrame, this)
        this.mElemList["meridian_group"].visible = true
        this.mElemList["btn_tips"].visible = false
        this.mElemList["title"].text = Localize_cns("TianXianJingMai")
        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.TIANXIAN_UPDATE, this.refreshFrame, this)
        this.mElemList["meridian_group"].visible = false
    }

    onRefresh() {
        this.refreshFrame()
    }
    refreshFrame() {
        this.mElemList["manji_text"].visible = false
        this.mElemList["rd_4_had"].visible = true
        this.mElemList["btn_tupo"].visible = true
        let recvInfo = TianXianSystem.getInstance().getTianXianInfo(this.type)
        if (recvInfo == null) return 
        let recvlist = recvInfo["jingmaidatalist"]
        if (size_t(recvlist) == 0) {
            recvlist = [0, 1]
        }

        let jie = recvlist[1]
        let index = recvlist[0]
        this.select = index + 1
        if (this.select > this.maxSelectCount) {
            this.select = 1
            jie += 1
        }
        this.jie = jie
        let tempTypeConfig = GameConfig.FunTianXianJingMaiTypeConfig["TianXianJingMai"]
        if (jie >= elemUpgradeStageOptions[cellOptionsIndex.TianXianJingMai].MaxLevel) {  //满级
            this.onMaxLevelShow()
            return
        }
        let typeConfig = tempTypeConfig[jie]
        let jieStr = typeConfig.Typename

        for (let i = 1; i <= 11; i++) {
            // this.mElemList["name_" + i].source = "tx_jingMaiText08"
            this.mElemList["image_" + i].source = "tx_jingMaiDian01"
            this.mElemList["image_select_" + i].visible = false
        }
        this.mElemList["image_select_" + this.select].visible = true
        //更新等级 label_chong 
        this.mElemList["label_chong"].text = jieStr
        for (let i = 1; i <= index; i++) {
            // this.mElemList["name_" + i].source = "tx_jingMaiText08"
            this.mElemList["image_" + i].source = "tx_jingMaiDian02"
        }
        //更新属性
        let jingmaiConfig = GameConfig.FunTianXianJingMaiConfig["TianXianJingMai"][this.select]
        let maiConfig = table_effect(jingmaiConfig.effects)
        maiConfig = table_effect_mul(maiConfig, typeConfig.itemnum)
        let singleStr = ""
        for (let k in maiConfig) {
            singleStr += "#br#rf" + GetPropertyName(lastAbilityNameToIdOptions[k]) + "#green" + maiConfig[k]
        }
        AddRdContent(this.mElemList["rd_bottom"], singleStr, "ht_20_cc", "ublack")

        let totalStr = ""
        let totalConfig = TianXianSystem.getInstance().getToTalConfig(jie, index)
        for (let k in totalConfig) {
            totalStr += "#br#rf" + GetPropertyName(lastAbilityNameToIdOptions[k]) + "#green" + totalConfig[k]
        }
        AddRdContent(this.mElemList["rd_top"], totalStr, "ht_20_cc", "ublack")
        //更新战斗力
        let force = recvInfo["force"]//GetForceMath(totalConfig)
        DrawNumberStringImage(this.mElemList["force_num"], "zhanLi_", "z" + force, 0, 0, -3)
        //更新消耗材料
        let itemid = jingmaiConfig.itemid
        this.mElemList["meridianBox"].updateByEntry(itemid)
        let name = ItemSystem.getInstance().getItemName(itemid)
        let nameColor = GetItemFontColor(itemid, false)


        let had = ItemSystem.getInstance().getItemCount(itemid)
        let need = typeConfig.itemnum
        let hadStr = (had >= need) ? "#rf#green" : "#rf#red"
        name = "#" + nameColor + name + "x" + need + "#br#br#black" + Localize_cns("ITEM_TXT30") + hadStr + had
        AddRdContent(this.mElemList["rd_4_had"], name, "ht_20_cc", "ublack")

        //经脉丹
        let totalid = TianXian_MeridianWnd.JINGMAI_DAN
        let count = ItemSystem.getInstance().getItemCount(totalid)
        let totalHadStr = "#JINGMAI_WHOLE" + Localize_cns("ITEM_TXT30") + "#green" + count
        AddRdContent(this.mElemList["rd_total_num"], totalHadStr, "ht_20_cc", "ublack")
        //突破丹
        let this_itemid = TianXian_MeridianWnd.TUPO_DAN
        let this_had = ItemSystem.getInstance().getItemCount(this_itemid)
        let thisHadStr = "#JINGMAI_SONE" + Localize_cns("ITEM_TXT30") + "#green" + this_had
        AddRdContent(this.mElemList["rd_this_num"], thisHadStr, "ht_20_cc", "ublack")

    }

    onMaxLevelShow() {
        let recvInfo = TianXianSystem.getInstance().getTianXianInfo(this.type)
        if (recvInfo == null) return 
        this.mElemList["image_select_" + this.select].visible = false
        this.mElemList["rd_4_had"].visible = false
        this.mElemList["btn_tupo"].visible = false
        this.mElemList["manji_text"].visible = true
        this.mElemList["meridianBox"].setVisible(false)
        for (let i = 1; i <= 11; i++) {
            // this.mElemList["name_" + i].source = "tx_jingMaiText08"
            this.mElemList["image_" + i].source = "tx_jingMaiDian02"
            this.mElemList["image_select_" + i].visible = false
        }

        let tempTypeConfig = GameConfig.FunTianXianJingMaiTypeConfig["TianXianJingMai"]
        let length = elemUpgradeStageOptions[cellOptionsIndex.TianXianJingMai].MaxLevel
        let typeConfig = tempTypeConfig[length]
        let jieStr = typeConfig.Typename
        this.mElemList["label_chong"].text = jieStr
        let totalStr = ""
        let totalConfig = TianXianSystem.getInstance().getToTalConfig(length, 0)
        for (let k in totalConfig) {
            totalStr += "#br#rf" + GetPropertyName(lastAbilityNameToIdOptions[k]) + "#green" + totalConfig[k]
        }
        AddRdContent(this.mElemList["rd_top"], totalStr, "ht_20_cc", "ublack")

        //rd_bottom
        AddRdContent(this.mElemList["rd_bottom"], Localize_cns("ROLE_TXT31"), "ht_20_cc", "darkgreen")

        let force = recvInfo["force"]//GetForceMath(totalConfig)
        DrawNumberStringImage(this.mElemList["force_num"], "zhanLi_", "z" + force, 0, 0, -3)

        //经脉丹
        let totalid = TianXian_MeridianWnd.JINGMAI_DAN
        let count = ItemSystem.getInstance().getItemCount(totalid)
        let totalHadStr = "#JINGMAI_WHOLE" + Localize_cns("ITEM_TXT30") + "#green" + count
        AddRdContent(this.mElemList["rd_total_num"], totalHadStr, "ht_20_cc", "ublack")
        //突破丹
        let this_itemid = TianXian_MeridianWnd.TUPO_DAN
        let this_had = ItemSystem.getInstance().getItemCount(this_itemid)
        let thisHadStr = "#JINGMAI_SONE" + Localize_cns("ITEM_TXT30") + "#green" + this_had
        AddRdContent(this.mElemList["rd_this_num"], thisHadStr, "ht_20_cc", "ublack")
    }

    onTupoClick() {
        let typeConfig = GameConfig.FunTianXianJingMaiTypeConfig["TianXianJingMai"][this.jie]
        if (typeConfig == null) return
        let jingmaiConfig = GameConfig.FunTianXianJingMaiConfig["TianXianJingMai"][this.select]
        if (jingmaiConfig == null) return
        let itemid = jingmaiConfig.itemid

        let had = ItemSystem.getInstance().getItemCount(itemid)
        let need = typeConfig.itemnum
        if (need == null) {
            MsgSystem.addTagTips(Localize_cns("TIANXIAN_MAXLEVEL"))
            return
        }
        if (had < need) {
            let itemConfig = GameConfig.itemConfig[itemid]
            let name = itemConfig.name
            let fontColor = "#" + GetQualityColorStr(itemConfig.quality)
            MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), fontColor + name + "#rf"))
            return
        }
        RpcProxy.call("C2G_SIMPLECELLFUN_JINGMAIUP", this.type, this.select, this.jie)//"C2G_SIMPLECELLFUN_JINGMAIUP":"uint16;uint16;uint16"   --entryid 玩法筋脉  index --升级第几个经脉  indextype经脉多少重

    }
}