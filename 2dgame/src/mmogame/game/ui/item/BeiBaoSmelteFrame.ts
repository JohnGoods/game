// TypeScript file
class BeiBaoSmelteFrame extends BaseWnd {
    sendList
    settingList
    waitting
    UNLOCK_VIP_LEVEL 
    callbackfun
    callbacktarget

    actorList: UIActorView[]
    count

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/item/BeiBaoSmelteLayout.exml"]
        this.UNLOCK_VIP_LEVEL = 7
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_smelte", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSmelteClick },
            { ["name"]: "btn_smelte50", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSmelteClick },
            { ["name"]: "btn_auto", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAutoClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["rd_tips"].setAlignFlag(gui.Flag.LEFT_TOP)

        for (let k = 1; k <= 9; k++) {
            this.mElemList["actor_effect_" + k] = UIActorView.newObj(this.mLayoutNode, "actor_effect_" + k, 0, 0, this.mElemList["effect_" + k])
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefreshAuto, this)
        RegisterEvent(EventDefine.ITEM_SMELT_UPDATE, this.onSmeltUpdate, this)
        RegisterEvent(EventDefine.ITEM_UPDATE, this.onItemUpdate, this)
        this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true);
        this.settingList = false
        this.waitting = false
        this.sendList = null
        this.onRefresh();
        this.onRefreshAuto()
    }

    // public setHideCallback(fun, target):void {

    // }

    public onHide(): void {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefreshAuto, this)
        UnRegisterEvent(EventDefine.ITEM_SMELT_UPDATE, this.onSmeltUpdate, this)
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onItemUpdate, this)
        this.mLayoutNode.visible = false;
        //this.mLayoutNode.setDoModal(false);
        this.sendList = null

        if (this.callbackfun != null && this.callbacktarget != null) {
            this.callbackfun.call(this.callbacktarget)
        }
        this.callbackfun = null
        this.callbacktarget = null
        //let wnd = WngMrg.getInstance().getWindow("ItemBeiBaoFrame");
        //wnd.showWnd();

        for (let k = 1; k <= 9; k++) {
            let actor: UIActorView = this.mElemList["actor_effect_" + k]
            actor.clearView()
        }
    }

    onItemUpdate() {
        if (this.waitting == true || this.settingList == true) {
            return
        }
        this.onRefresh()
    }

    onSmeltUpdate() {
        this.settingList = false
        this.waitting = false
        let count = this.count
        if (count > 9) count = 9
        for (let k = 1; k <= count; k++) {
            let actor: UIActorView = this.mElemList["actor_effect_" + k]
            actor.updateByOnceEffect(effectIndex.RongJie)
        }
        this.sendList = null
        this.onRefresh()
    }

    onRefresh() {
        //let showlist = []
        if ((this.sendList == null || size_t(this.sendList) < 9) && !this.settingList) {
            let smeltList = ItemSystem.getInstance().getBeiBaoSmeltList(50)
            table_sort(smeltList, function (a, b) {
                let aLevel = a.getRefProperty("level")
                let bLevel = b.getRefProperty("level")
                return aLevel - bLevel
            })
            this.sendList = []
            for (let i in smeltList) {
                JsUtil.arrayInstert(this.sendList, smeltList[i].id)
            }
            //let smeltList = ItemSystem.getInstance().getResolveList()

            //for(let i = 0; i < 9; i++){
            //    if(smeltList[i]){
            //        JsUtil.arrayInstert(showlist, smeltList[i].id)
            //    }
            //}
        }//else{
        //    showlist = this.sendList
        // }


        for (let k = 1; k <= 9; k++) {
            let itemid = this.sendList[k - 1]
            this.initItemWindow(k)
            this.refreshItemWindow(k, itemid)
        }

        //rd_tips
        let str = Localize_cns("BEIBAO_SMELT_DES")
        AddRdContent(this.mElemList["rd_tips"], str, "ht_24_cc", "black")

        
    }


    onRefreshAuto() {
        let vip_level = GetHeroProperty("VIP_level")
        if (vip_level < this.UNLOCK_VIP_LEVEL)  return 
            this.mElemList["group_auto"].visible = true
            let key = GetHeroProperty("packSmelt") || 0
            if (key == 0) {
                this.mElemList["btn_auto"].source = "ty_xuanZheDi01"
            } else {
                this.mElemList["btn_auto"].source = "ty_xuanZhe01"
            }
       // } else {
        //    this.mElemList["group_auto"].visible = false
        //}
    }

    initItemWindow(index) {
        if (this.mElemList["itemBox_" + index] == null) {
            this.mElemList["itemBox_" + index] = UIItemBox.newObj(this.mLayoutNode, "itemBox_" + index, 0, 0, this.mElemList["item_" + index])
            this.mElemList["btn_" + index].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenClick, this)
        }
    }


    refreshItemWindow(index, itemid) {
        if (itemid) {
            let item = ItemSystem.getInstance().getItemLogicInfoByID(itemid)
            if (item == null) return
            this.mElemList["itemBox_" + index].updateByItem(item)
            this.mElemList["itemBox_" + index].setVisible(true)
            this.mElemList["lv_" + index].text = String.format(Localize_cns("ROLE_TXT34"), item.getRefProperty("level") || 0)
            this.mElemList["btn_" + index].visible = false
            this.mElemList["lv_" + index].visible = true
        } else {
            this.mElemList["itemBox_" + index].updateByEntry(-1)
            this.mElemList["itemBox_" + index].setVisible(false)
            this.mElemList["btn_" + index].visible = true
            this.mElemList["lv_" + index].visible = false
        }

    }



    /////////////////btn响应事件
    onSmelteClick(event: egret.Event) {
        if (this.waitting == true) {
            return
        }
        //if(this.sendList != null){
        //    let sendIdList = []
        //    for(let k in this.sendList){
        //        let item:Item = this.sendList[k]
        //        table_insert(sendIdList, item.id)
        //    }
        //    RpcProxy.call("C2G_GoldEquipMelt", sendIdList)
        //    return 
        //}

        //let level = RoleSystem.getInstance().getRoleInfo("stage")//GetHeroProperty("level")
        // let itemType1 = opItemType.ROLE_EQUIP//角色装备
        //let smeltList =  ItemSystem.getInstance().getBeiBaoSmeltList()

        if (this.settingList == true) {
            if (this.sendList == null || size_t(this.sendList) == 0) {
                this.settingList = false
            }
            RpcProxy.call("C2G_GoldEquipMelt", this.sendList)
            this.count = size_t(this.sendList)
            return
        }
        if (this.sendList == null) return
        let num = size_t(this.sendList)
        if (num == 0) return
        if (num <= 9) {
            RpcProxy.call("C2G_EquipMeltList", this.sendList)
            this.count = size_t(this.sendList)
            this.waitting = true
            return
        }
        let name = event.target.name
        if (name == "btn_smelte") {
            let meltlist = this.sendList
            if (num > 9) {
                meltlist = []
                for (let i = 0; i < 9; i++) {
                    let v = this.sendList[i]
                    table_push(meltlist, v)
                    table_remove(this.sendList, v)
                }
            }
            RpcProxy.call("C2G_EquipMeltList", meltlist)
            this.count = size_t(meltlist)
            //RpcProxy.call("C2G_EquipMelt", 9)
        } else if (name = "btn_smelte50") {
            RpcProxy.call("C2G_EquipMeltList", this.sendList)
            this.count = size_t(this.sendList)
            //RpcProxy.call("C2G_EquipMelt", 50)
        }
        this.waitting = true
    }

    onOpenClick() {
        let wnd: BeiBaoSmeltEquipFrame = WngMrg.getInstance().getWindow("BeiBaoSmeltEquipFrame")
        wnd.showWnd()
        // this.hideWnd()
    }

    onAutoClick() {
        let vip_level = GetHeroProperty("VIP_level")
        if(vip_level < this.UNLOCK_VIP_LEVEL){
            MsgSystem.addTagTips(Localize_cns("BEIABO_AUTO"))
            return
        }
        let key = GetHeroProperty("packSmelt") || 0
        let sendNumber = key == 0 ? 1 : 0
        RpcProxy.call("C2G_Equip_AI_Melt", sendNumber)
    }

    /////------------------
    setSendList(sendList) {
        this.sendList = []
        for (let i in sendList) {
            let item = sendList[i]
            table_push(this.sendList, item.id)
        }
        this.settingList = true
        this.onRefresh()
    }
}