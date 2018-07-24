// TypeScript file
class PetUnionFrame extends BaseWnd {
    selectId: number;
    selectItemList: any[];
    materialWnd: PetUnionMaterialWindow
    moveToSelected: boolean

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/pet/PetUnionLayout.exml"]

        this.selectId = 0
        this.selectItemList = []
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "relation_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRelatiton },

            { ["name"]: "left_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickLeft },
            { ["name"]: "right_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRight },

            { ["name"]: "tips_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRule },
            { ["name"]: "union_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickUnion },

            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

            { ["name"]: "tips_rd", ["messageFlag"]: true },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        //头像
        var list: eui.List = this.mElemList["pet_scroll"]
        list.layout = new eui.HorizontalLayout();
        list.itemRenderer = itemRender.PetUnionBoxList

        //记录
        var list: eui.List = this.mElemList["record_scroll"]
        list.itemRenderer = itemRender.PetUnionRecordList

        this.materialWnd = PetUnionMaterialWindow.newObj(this.mLayoutNode, this)

        for (let i = 0; i < 6; i++) {
            this.mElemList["select_item_" + i] = UIItemBox.newObj(this.mLayoutNode, "select_item_" + i, 0, 0, this.mElemList["item_bg" + i], 0.8)
        }

        this.mElemList["mark_wnd"].visible = true
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PET_UNION_RECORD, this.upateRecordList, this)
        RegisterEvent(EventDefine.PET_UNION_SERVER_RECORD, this.upateRecordList, this)
        RegisterEvent(EventDefine.ITEM_UPDATE, this.updateItemList, this)
        this.mLayoutNode.visible = true;

        this.materialWnd.showWnd()

        this.mElemList["mark_wnd"].visible = false

        if (this.selectId == 0) {
            for (let _ in GameConfig.PetComPoundConfig) {
                this.selectId = tonumber(_)
                break
            }
        }

        RpcProxy.call("C2G_ActorPetCompound_Record")
        RpcProxy.call("C2G_ActorPetCompound_Formula", this.selectId)

        this.clearSelectItemList()

        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PET_UNION_RECORD, this.upateRecordList, this)
        UnRegisterEvent(EventDefine.PET_UNION_SERVER_RECORD, this.upateRecordList, this)
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.updateItemList, this)
        this.mLayoutNode.visible = false;

        this.materialWnd.hideWnd()
    }

    updateFrame(result, entryId) {
        if (result == null || entryId == null) {
            return
        }

        let hadPlay = true
        for (let i = 0; i < 6; i++) {
            if (this.selectItemList[i]) {
                if (hadPlay) {
                    hadPlay = false
                    this.mElemList["select_item_" + i].playerEffect(effectIndex.QiangHua, this, this.playerResultAnim, [result, entryId])
                } else {
                    this.mElemList["select_item_" + i].playerEffect(effectIndex.QiangHua)
                }
            }
        }

        this.refreshFrame()
    }

    playerResultAnim(data) {
        if (data && size_t(data) > 0) {

            let result = data[0]
            let entryId = data[1]

            if (result == 1) {
                //成功
                let wnd = WngMrg.getInstance().getWindow("PetUnionSuccessFrame")
                wnd.showWithEntryId(entryId)
            } else {
                //失败
                let wnd = WngMrg.getInstance().getWindow("PetUnionLostFrame")
                wnd.showWnd()
            }

            this.selectItemList = []
            this.refreshSelectItemList()

            this.mElemList["mark_wnd"].visible = false
        }
    }

    refreshFrame() {
        this.updatePetList()
        this.upateRecordList()
        this.updateItemList()

        let config = GameConfig.PetComPoundConfig[this.selectId]
        if (config) {
            let sonList = config.Son || []
            let petList = [] //未解锁宠物列表
            if (size_t(sonList) > 0) {
                for (let _ in sonList) {
                    let son = sonList[_]
                    let unLockList = PetSystem.getInstance().getPetUnionRecordList()
                    //是否解锁
                    if (!table_isExist(unLockList, son)) {
                        table_insert(petList, son)
                    }
                }
            }

            if (size_t(petList) == 0) {
                AddRdContent(this.mElemList["tips_rd"], config.Tips, "ht_20_cc", "ublack")
            } else {
                let petNameStr = "#green"
                for (let _ in petList) {
                    let petId = petList[_]
                    let petName = PetSystem.getInstance().getPetName(petId)
                    if ((tonumber(_) + 1) == size_t(petList)) {
                        petNameStr = petNameStr + String.format(Localize_cns("PET_UNION_TXT10"), petName)
                    } else {
                        petNameStr = petNameStr + String.format(Localize_cns("PET_UNION_TXT10"), petName) + Localize_cns("DUNHAO")
                    }
                }
                AddRdContent(this.mElemList["tips_rd"], String.format(Localize_cns("PET_UNION_TXT9"), petNameStr, "#ublack"), "ht_20_cc", "ublack")
            }
        }
    }

    updatePetList() {
        let info = GameConfig.PetComPoundConfig
        let dataList = []
        for (let _ in info) {
            let t: any = {}
            t.data = info[_]
            t.self = this
            table_insert(dataList, t)
        }
        var list: eui.List = this.mElemList["pet_scroll"]
        UiUtil.updateList(list, dataList)

        if (this.moveToSelected == false) {
            let n = 0
            for (let _ in dataList) {
                let v = dataList[_]
                if (dataList[_].data.Id == this.selectId) {
                    n = tonumber(_)
                    break
                }
            }
            let scroller: eui.Scroller = this.mElemList["scroller"]
            if ((n * 100 + scroller.viewport.width) >= scroller.viewport.contentWidth) {
                scroller.viewport.scrollH = scroller.viewport.contentWidth - scroller.viewport.width
            } else {
                scroller.viewport.scrollH = n * 100
            }
            this.moveToSelected = true
        }
    }

    upateRecordList() {
        let info = PetSystem.getInstance().getPetUnionRecordPlayerList() || {}
        // if (size_t(info[this.selectId]) <= 0) {
        //     return
        // }

        let dataList = []
        for (let _ in info[this.selectId]) {
            let t: any = {}
            t.Id = this.selectId
            t.data = info[this.selectId][_]
            t.self = this
            table_insert(dataList, t)
        }

        if (size_t(dataList) == 0) {
            this.mElemList["record_scroller"].visible = false
            this.mElemList["no_record"].visible = true
            return
        } else {
            this.mElemList["record_scroller"].visible = true
            this.mElemList["no_record"].visible = false
        }

        var list: eui.List = this.mElemList["record_scroll"]
        UiUtil.updateList(list, dataList, true)
    }

    updateItemList() {
        let info = GameConfig.PetComPoundConfig[this.selectId]
        if (!info) {
            return
        }

        let dataList = []
        for (let entryId in info.CondItemRate) {
            table_insert(dataList, entryId)
        }

        table_sort(dataList, function (a, b) {
            let stateA = (a == 60188 ? 2 : 0)
            let stateB = (b == 60188 ? 2 : 0)

            if (stateA == 0 && ItemSystem.getInstance().getItemCount(a) > 0) {
                stateA = 1
            }

            if (stateB == 0 && ItemSystem.getInstance().getItemCount(b) > 0) {
                stateB = 1
            }

            return stateB - stateA
        })

        this.materialWnd.updateMaterialItemList(dataList)
    }

    //清除
    clearSelectItemList() {
        this.selectItemList = []
        this.refreshSelectItemList()
    }

    //更新玩家选择的物品
    refreshSelectItemList() {
        for (let i = 0; i < 6; i++) {
            if (this.selectItemList[i]) {
                this.mElemList["select_item_" + i].updateByEntry(this.selectItemList[i])
            } else {
                this.mElemList["select_item_" + i].updateByEntry()
            }
        }
    }

    //检查是否选过
    checkItemSelect(entryId) {
        return table_isExist(this.selectItemList, tonumber(entryId))
    }

    //检查材料是否满了
    checkItemFull() {
        return size_t(this.selectItemList) >= defaultValue.PET_UNION_MATERIAL
    }

    //放入材料
    inMaterial(entryId) {
        if (ItemSystem.getInstance().getItemCount(entryId) <= 0) {
            return
        }

        if (this.checkItemFull()) {
            return
        }

        table_insert(this.selectItemList, tonumber(entryId))
        this.refreshSelectItemList()
    }

    //移除材料
    outMaterial(entryId) {
        table_remove(this.selectItemList, tonumber(entryId))
        this.refreshSelectItemList()
    }

    ////////////////////////////////////////////////////
    //规则
    onClickRule() {
        let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
        wnd.showWithActivity("PetUnionRule")
    }

    //合成
    onClickUnion() {
        //检查是否可以合成
        let config = GameConfig.PetComPoundConfig[this.selectId]
        if (!config) {
            return
        }

        let sonList = config.Son || []
        let state = false
        let petList = [] //未解锁宠物列表
        if (size_t(sonList) > 0) {
            for (let _ in sonList) {
                let son = sonList[_]
                let unLockList = PetSystem.getInstance().getPetUnionRecordList()
                //是否解锁
                if (!table_isExist(unLockList, son)) {
                    table_insert(petList, son)
                }
            }

            if (size_t(petList) == 0) {
                state = true
            }
        } else {
            state = true
        }

        if (state) {
            if (size_t(this.selectItemList) == 0) {
                MsgSystem.addTagTips(Localize_cns("PET_UNION_TXT11"))
                return
            }
            this.mElemList["mark_wnd"].visible = true
            RpcProxy.call("C2G_ActorPetCompound", this.selectId, this.selectItemList)
        } else {
            let petNameStr = "#lime"
            for (let _ in petList) {
                let petId = petList[_]
                let petName = PetSystem.getInstance().getPetName(petId)
                if ((tonumber(_) + 1) == size_t(petList)) {
                    petNameStr = petNameStr + String.format(Localize_cns("PET_UNION_TXT10"), petName)
                } else {
                    petNameStr = petNameStr + String.format(Localize_cns("PET_UNION_TXT10"), petName) + Localize_cns("DUNHAO")
                }
            }

            MsgSystem.addTagTips(String.format(Localize_cns("PET_UNION_TXT9"), petNameStr, "#white"))
        }
    }

    onClickLeft() {
        let scroller: eui.Scroller = this.mElemList["scroller"]
        scroller.viewport.scrollH = 0
    }

    onClickRight() {
        let scroller: eui.Scroller = this.mElemList["scroller"]
        scroller.viewport.scrollH = scroller.viewport.contentWidth - scroller.viewport.width
    }

    //关系图
    onClickRelatiton() {
        let wnd = WngMrg.getInstance().getWindow("PetUnionTreeFrame")
        wnd.showWnd()
    }

    /////
    showWithSelectedEntryId(entryId) {
        this.selectId = entryId
        this.moveToSelected = false
        if (this.isVisible()) {
            this.clearSelectItemList()
            this.refreshFrame()
            RpcProxy.call("C2G_ActorPetCompound_Formula", entryId)
        } else {
            this.showWnd()
        }
    }
}