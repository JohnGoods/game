class ForgeDuanZaoWindow extends BaseCtrlWnd {
    mElemList;
    recvList;
    select;
    stage;
    timer;
    oldlist;
    type
    force
    isSend
    isManJi
    actorList

    public initObj(...params: any[]) {
        this.type = "duanlian"
        this.force = 0
        this.isSend = false
        this.isManJi = false
    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        this.actorList = this.mParentWnd.actorList
        this.oldlist = {}
        this.recvList = {}
        this.select = -1;
        this.timer = null

        var elemInfo = [

            { ["name"]: "btn_oneKey", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onOneKeyClick },
        ];

        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.FORGE_UPDATE, this.onRefresh, this)
        RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
        //this.mElemList["image_jianTou"].visible = true;
        this.mElemList["label_wndName"].text = Localize_cns("FORGE_TXT3");
        let str = String.format(Localize_cns("FORGE_BTN"), Localize_cns("FORGE_TXT3"))
        this.mElemList["btn_oneKey"].text = str
        this.onInit()
        this.onRefresh();


    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.FORGE_UPDATE, this.onRefresh, this)
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
        this.mElemList["rd_manji"].visible = false;
        if (this.timer != null) {
            KillTimer(this.timer)
            this.timer = null
        }
        this.isManJi = false
        this.isSend = false

        for (let k in this.actorList) {
            let actor: UIActorView = this.actorList[k]
            actor.clearView()
        }
    }

    onInit() {
        this.recvList = ForgeSystem.getInstance().getForgeInfo(this.type)
        this.oldlist = this.recvList
        for (let i = 1; i <= 10; i++) {
            this.mElemList["equipItem_select" + i].visible = false
        }

        this.onInitForce()
    }

    onRefresh() {

        ///刷新大师
        if (this.timer != null) return
        let index = this.mParentWnd.tabWndList.getTabIndex()
        let dashiLevel = ForgeSystem.getInstance().getForgeClassType(this.type)
        let forgeLevel = ForgeSystem.getInstance().getForgeTypeLevel(this.type)
        let isJiHuo = dashiLevel == 0 ? false : true
        let needLevel = ForgeSystem.getInstance().getDaShiNeedLevel(this.type, index)
        let shulianStr = "#lime(" + forgeLevel + "/" + needLevel + ")"
        if (forgeLevel == needLevel) {
            shulianStr = "#lime" + Localize_cns("ROLE_TXT31")
        }
        AddRdContent(this.mElemList["rd_shuLianDu"], shulianStr, "ht_20_cc_stroke")
        UiUtil.grayComponent(this.mElemList["dashi_icon"], !isJiHuo)

        if (dashiLevel == 0) {
            this.mElemList["label_jie"].visible = false
        } else {
            this.mElemList["label_jie"].visible = true
            this.mElemList["label_jie"].text = dashiLevel + Localize_cns("PET_TXT10")
        }

        let imageName = "dz_Bt0"
        imageName = imageName + (index + 1)
        this.mElemList["dashi_icon"].source = imageName;

        this.select = 1
        this.recvList = ForgeSystem.getInstance().getForgeInfo(this.type)
        if (size_t(this.recvList) == 0) return
        this.stage = 5;
        let arr = this.oldlist;
        let count = size_t(arr)
        for (let i = 0; i < count; i++) {
            if (arr[i] != 0) {
                this.mElemList["equipItem_lv" + (i + 1)].visible = true
                let str = String.format(Localize_cns("FORGE_TXT5"), arr[i])
                this.mElemList["equipItem_lv" + (i + 1)].text = str;
            } else {
                this.mElemList["equipItem_lv" + (i + 1)].visible = false
            }

            if (arr[i + 1] < arr[i]) {
                this.select = i + 1 + 1;
            }
        }

        if (this.oldlist[this.select - 1] != this.recvList[this.select - 1]) {
            if (this.timer == null) {
                this.timer = SetTimer(this.onTimer, this, 100)
            }
            this.onRefreshDes()
        }
        if (this.timer == null) {
            this.onRefreshDes();
        }
        //
    }

    onInitForce() {
        let levelList = this.oldlist
        let forceConfig = {}
        for (let k = 1; k <= 10; k++) {
            let config = GameConfig.FunForgeConfig[this.type]
            let stage = levelList[k - 1]
            if (stage == 0) continue
            let tempcConfig = ForgeSystem.getInstance().getCellForgeConfig(this.type, k - 1, stage)
            forceConfig = table_effect_add(forceConfig, tempcConfig)
        }
        this.force = GetForceMath(forceConfig)
        this.refreshForceNum(this.force)
    }

    onTimer() {
        for (let i = 1; i <= 10; i++) {
            this.mElemList["equipItem_select" + i].visible = false
        }
        this.select += 1

        this.onRefreshDes()
    }
    onRefreshDes() {

        let endIndex = 11
        let isEnd = false
        let arr = this.recvList
        for (let i = 0; i < size_t(arr); i++) {
            if (arr[i - 1] > arr[i]) {
                endIndex = i + 1
            }
        }
        if (this.select == endIndex) {
            isEnd = true
        }

        if (this.select > 10) {
            // select -= 10
            this.select -= 10
        }

        let index = this.mParentWnd.tabWndList.getTabIndex();

        //rd_des
        let levelList = this.recvList
        let level = levelList[this.select - 1]
        let config = GameConfig.FunForgeConfig[this.type]
        this.mElemList["rd_baoshi"].visible = false
        this.mElemList["group_qianghua"].visible = true

        let nowConfig = ForgeSystem.getInstance().getCellForgeConfig(this.type, this.select - 1, level)
        let nextConfig = ForgeSystem.getInstance().getCellForgeConfig(this.type, this.select - 1, level + 1)
        let force = 0
        let str1 = ""
        let str2 = ""
        if (level == 0) {
            str1 = Localize_cns("FORGE_LEVEL_FALSE")

            str2 = ForgeSystem.getInstance().getForgeConfigStr(nextConfig)

        } else {
            str1 = ForgeSystem.getInstance().getForgeConfigStr(nowConfig)
            force = GetForceMath(nowConfig)
            if (nextConfig != null) {
                str2 = ForgeSystem.getInstance().getForgeConfigStr(nextConfig)
                this.mElemList["rd_manji"].visible = false
                this.mElemList["group_qianghua"].visible = true
            } else {
                this.mElemList["rd_manji"].visible = true
                this.mElemList["group_qianghua"].visible = false
                this.isManJi = true
                AddRdContent(this.mElemList["rd_manji"], str1, "ht_20_cc", "lime")
            }

        }
        if (nextConfig != null) {
            AddRdContent(this.mElemList["rd_1"], str1, "ht_20_cc_stroke", "white");
            AddRdContent(this.mElemList["rd_2"], "#lime" + str2, "ht_20_cc_stroke", "white");
        }

        //rd_access
        let accessStr = <string>Localize_cns("FORGE_TXT1" + (index + 1))
        AddRdContent(this.mElemList["rd_access"], accessStr, "ht_20_cc", "lime");
        this.mElemList["rect_rd"].width = 20 * accessStr.length


        this.mElemList["equipItem_select" + this.select].visible = true

        if (this.recvList[this.select - 1] != 0) {
            this.mElemList["equipItem_lv" + this.select].visible = true
            let str = String.format(Localize_cns("FORGE_TXT5"), this.recvList[this.select - 1])
            this.mElemList["equipItem_lv" + this.select].text = str;
        } else {
            this.mElemList["equipItem_lv" + this.select].visible = false
        }

        let oldlevel = this.oldlist[this.select - 1]
        let oldForce = 0
        if (oldlevel != 0) {
            let oldForceConfig = ForgeSystem.getInstance().getCellForgeConfig(this.type, this.select - 1, oldlevel)
            oldForce = GetForceMath(oldForceConfig)
        }
        if (this.timer != null) {
            this.force += (force - oldForce)
        }
        this.refreshForceNum(this.force)

        if (isEnd == true) {
            if (this.timer != null) {
                KillTimer(this.timer)
                this.timer = null
                this.oldlist = levelList
                this.onInitForce()
                this.isSend = false
            }
        }

        if (this.timer != null) {
            let actor: UIActorView = this.actorList[this.select]
            actor.updateByOnceEffect(effectIndex.QiangHua)
        }

        if (this.timer == null) {
            //rd_cost
            if (this.isSend == true) return
            let had = 0
            let maxCost = 0
            let costConfig = config[level + 1] || config[level]

            let countId = costConfig.itemid
            had = ItemSystem.getInstance().getItemCount(countId)
            maxCost = costConfig.itemnum

            let cStr

            if (had >= maxCost) {
                cStr = "#lime"
            } else {
                cStr = "#red"
            }
            let itemStr = GetTagIcon(countId)
            let costStr = String.format(Localize_cns("FORGE_COST"), itemStr, cStr, had, maxCost);
            if (this.isManJi) {
                costStr = "#lime" + Localize_cns("ROLE_TXT31")
            }
            AddRdContent(this.mElemList["rd_cost"], costStr, "ht_20_cc_stroke", "white");
        }
    }

    refreshForceNum(force) {
        DrawNumberStringImage(this.mElemList["bImage"], "zhanLi_", "z" + force, 0, 0, -3)

    }



    //////响应事件
    onOneKeyClick() {
        if (this.timer != null || size_t(this.recvList) == 0) return
        if (this.isManJi) {
            MsgSystem.addTagTips(Localize_cns("ROLE_TXT31"))
            return
        }
        let index = this.mParentWnd.tabWndList.getTabIndex()
        if (index == 2) {
            let countId = GameConfig.FunForgeConfig[this.type][this.recvList[this.select - 1] + 1].itemid
            let had = ItemSystem.getInstance().getItemCount(countId)
            let maxCost = GameConfig.FunForgeConfig[this.type][this.recvList[this.select - 1] + 1].itemnum
            if (had < maxCost) {
                let wnd = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
                wnd.onShowWnd(countId, maxCost - had);
            } else {
                this.oldlist = this.recvList
                this.isSend = true
                RpcProxy.call("C2G_EQUIP_FORGE_UPGRADE", index + 1)

            }
        }

    }
}