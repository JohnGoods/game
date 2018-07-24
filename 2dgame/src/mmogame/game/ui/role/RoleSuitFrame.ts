class RoleSuitFrame extends BaseWnd {
    actor: UIActorView
    tianxianActor: UIActorView
    select
    topScroll: UIScrollList
    controlData: any

    canTurn

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/role/RoleSuitLayout.exml"]
        this.select = -1
        this.canTurn = false
    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_turn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTurnClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.actor = UIActorView.newObj(this.mLayoutNode, "actor", 0, 0, this.mElemList["actor"])
        this.tianxianActor = UIActorView.newObj(this.mLayoutNode, "tianxianActor", 0, 0, this.mElemList["actor_tianxian"])

        let topGroup: eui.Group = this.mElemList["scroll_top"]
        this.topScroll = UIScrollList.newObj(this.mLayoutNode, "topScroll", 0, 0, topGroup.width, topGroup.height, topGroup, UIScrollList.DIR_HORIZON)

        for (let k = 1; k <= 3; k++) {
            let t: gui.RichDisplayer = this.mElemList["rd_title_" + k]
            let c: gui.RichDisplayer = this.mElemList["rd_config_" + k]
            c.setAlignFlag(gui.Flag.CENTER_CENTER)
            t.setAlignFlag(gui.Flag.CENTER_CENTER)
        }

        for (let k = 1; k <= 4; k++) {
            let name: gui.RichDisplayer = this.mElemList["rd_name_" + k]
            let force: gui.RichDisplayer = this.mElemList["rd_force_" + k]
            let group: gui.RichDisplayer = this.mElemList["touch_" + k]
            name.setAlignFlag(gui.Flag.CENTER_TOP)
            force.setAlignFlag(gui.Flag.CENTER_CENTER)
            group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGotoClick, this)
        }

    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ACTOR_ROLE_TAOZHUANG_UPDATE, this.onRefresh, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshHuanhuaBtn, this)
        this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true)
        this.onRefresh()
        RpcProxy.call("C2G_FashionSuit_Info")
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ACTOR_ROLE_TAOZHUANG_UPDATE, this.onRefresh, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshHuanhuaBtn, this)
        this.mLayoutNode.visible = false;
        //this.mLayoutNode.setDoModal(false)

        this.actor.clearView()
        this.tianxianActor.clearView()
        this.canTurn = false
    }

    onRefresh() {
        let scroll = this.topScroll
        let showList = RoleSystem.getInstance().getTaoZhuangControlList()
        //let showList = splitListByCount(list, 2)
        scroll.clearItemList()
        for (let k = 0; k < size_t(showList); k++) {
            let v = showList[k]
            let [window, flag] = scroll.getItemWindow(k, 100, 117, 0, 0)
            this.initTopWindow(window, v)
        }
        scroll.refreshScroll(true, true)
        scroll.restoreViewXY()

        //频道单选
        var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
        radioGroup.addEventListener(eui.UIEvent.CHANGE, this.onSelectTopClick, this);
        for (let i = 0; i < size_t(showList); i++) {
            let [window, flag] = scroll.getItemWindow(i, 100, 117, 0, 0)
            let tempName = window.name
            let radioBtn = <eui.RadioButton>this.mElemList[tempName + "_radio"]
            radioBtn.group = radioGroup;
            radioBtn.value = i
            //radioBtn.selected = false
        }

        if (this.select == -1) {
            this.select = 0
        }
        let [selectWindow, flag] = scroll.getItemWindow(this.select, 100, 117, 0, 0)
        let selectName = selectWindow.name
        let radioBtn: eui.RadioButton = this.mElemList[selectName + "_radio"]
        radioBtn.selected = true

        this.onRefreshSingle()

    }

    initTopWindow(window, config) {
        let name = window.name
        let index = RoleEquipResonateIndex[config[1].fashionType]
        let image = RoleEquipResonateIcon[index]
        let mElemInfo: any = [
            { ["index_type"]: eui.RadioButton, ["name"]: name + "_radio", ["image"]: image + "_up", ["font"]: "ht_20_cc_stroke", ["image_down"]: image + "_down", ["x"]: 0, ["y"]: 0, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null },

        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
    }

    onRefreshSingle() {

        let controlList = RoleSystem.getInstance().getTaoZhuangControlList()
        let skinInfoList = controlList[this.select]
        let skinList = []
        for (let k in skinInfoList) {
            let tempInfo = skinInfoList[k]
            table_insert(skinList, tempInfo)
        }

        this.controlData = {}
        for (let k = 1; k <= 4; k++) {
            let v = skinList[k - 1]
            let window: eui.Group = this.mElemList["group_" + k]
            if (v) {
                window.visible = true
                this.refreshItemWindow(window, v, k)
            } else {
                window.visible = false
            }

        }

        //刷新模型
        this.onRefreshActor()
        //刷新名字
        let typeName = skinList[0].typeName
        let typeIndex = RoleEquipResonateIndex[skinList[0].fashionType]
        this.mElemList["name_txt"].text = typeName
        //刷新属性
        this.onRefreshConfig()
        //刷新战力
        let forceList = RoleSystem.getInstance().getTaoZhuangInfoByKey("forceList")
        let force = 0
        if (forceList && forceList[typeIndex]) {
            force = forceList[typeIndex]
        }
        DrawNumberStringImage(this.mElemList["bImage"], "zhanLi_", "z" + force, 0, 0, -3)

        //幻化按钮
        this.refreshHuanhuaBtn()
    }


    refreshItemWindow(window, config, k) {
        let name = window.name
        this.controlData[k] = config
        let skinConfig = GameConfig.FunSkinConfig[cellOptionsName[config.cellIndex - 1]][config.skinIndex]
        let skinname: string = skinConfig.nameStr
        let rectLength = skinname.length * 24
        let width = window.width
        this.mElemList["rect_" + k].x = (width - rectLength) / 2
        this.mElemList["rect_" + k].width = rectLength
        this.mElemList["rect_" + k].fillColor = gui.Color.darkgreen
        AddRdContent(this.mElemList["rd_name_" + k], skinname, "ht_24_cc", "darkgreen")
        let skinPro = table_effect(skinConfig.effects)
        let force = GetForceMath(skinPro)
        let forceStr = String.format(Localize_cns("CLUB_TXT61"), force)
        let itemid = skinConfig.itemid
        if (this.mElemList["itemBox_" + k] == null) {
            this.mElemList["itemBox_" + k] = UIItemBox.newObj(this.mLayoutNode, "itemBox_" + k, 0, 0, this.mElemList["item_" + k])
        }
        this.mElemList["itemBox_" + k].updateByEntry(itemid)
        let check = RoleSystem.getInstance().checkSkinExist(config.cellIndex, config.skinIndex)
        if (check) {
            this.mElemList["jihuo_" + k].source = "tz_text02"
            forceStr = "#orange" + forceStr
        } else {
            this.mElemList["jihuo_" + k].source = "tz_text01"
        }

        AddRdContent(this.mElemList["rd_force_" + k], forceStr, "ht_20_cc", "ublack")
    }

    onRefreshActor() {
        let controlList = RoleSystem.getInstance().getTaoZhuangControlList()
        if (controlList == null) return
        let skinInfoList = controlList[this.select]

        let modelList: any = {}
        let tianxianId = 0
        for (let k in skinInfoList) {
            let skinInfo = skinInfoList[k]
            let skin = GetFunSkinModel(skinInfo.cellIndex, skinInfo.skinIndex)//skinInfo.skin
            let cellIndex = skinInfo.cellIndex
            if (cellIndex == cellOptionsIndex.HeroRide) {
                modelList.rideShapeId = skin
            } else if (cellIndex == cellOptionsIndex.HeroWing) {
                modelList.wingShapeId = skin
            } else if (cellIndex == cellOptionsIndex.TianXianWeapon) {
                modelList.weaponShapeId = skin
            } else if (cellIndex == cellOptionsIndex.HeroEquip) {
                modelList.heroShapeId = skin
            } else if (cellIndex == cellOptionsIndex.TianXian) {
                tianxianId = skin
            }
        }

        let playerInfo = GetHeroPropertyInfo()
        modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId

        this.actor.updateByPlayerAppearInfo(modelList)

        if (tianxianId != 0) {
            this.tianxianActor.updateByPlayer(tianxianId)
            this.mElemList["actor_tianxian"].visible = true
        } else {
            this.mElemList["actor_tianxian"].visible = false
        }
    }

    refreshHuanhuaBtn() {
        let controlList = RoleSystem.getInstance().getTaoZhuangControlList()
        if (controlList == null) return
        let skinInfoList = controlList[this.select]

        ////刷新幻化按钮
        let heroInfo = GetHeroPropertyInfo()
        let shapConfig = []

        let huanHua = false
        for (let k in skinInfoList) {
            let skinInfo = skinInfoList[k]
            let skin = GetFunSkinModel(skinInfo.cellIndex, skinInfo.skinIndex)
            let heroSkin = GetHeroSkinModel(skinInfo.cellIndex)
            if (heroSkin != skin) {
                huanHua = true
                break
            }
        }

        this.mElemList["btn_turn"].visible = huanHua
        this.mElemList["turn_icon"].visible = !huanHua
    }

    onRefreshConfig() {
        let controlList = RoleSystem.getInstance().getTaoZhuangControlList()
        if (controlList == null) return
        let skinInfoList = controlList[this.select]
        let fashionType = skinInfoList[1].fashionType
        let resonateConfig = GameConfig.TaoZhuangConfig[fashionType]
        // let 
        let count = 0
        for (let configKey in skinInfoList) {
            let v = skinInfoList[configKey]
            let check = RoleSystem.getInstance().checkSkinExist(v.cellIndex, v.skinIndex)
            if (check) {
                count += 1
            }
        }
        for (let k = 1; k <= 3; k++) {
            let tempConfig = resonateConfig[k + 1]

            let titleText = String.format(Localize_cns("ROLE_SUIT_TXT1"), tempConfig.index)
            let config = table_effect(tempConfig.effects)

            let force = GetForceMath(config)
            let forceStr = String.format(Localize_cns("CLUB_TXT61"), force)
            let configStr = ""
            let font_zhanli = ""
            let font_pro = ""
            let font_title = ""
            if (count >= tempConfig.index) {
                font_zhanli = "#orange"
                font_pro = "#darkgreen"
                font_title = "#darkgreen"
            }
            configStr += font_zhanli + forceStr + "#rf#br"
            for (let k in config) {
                configStr += font_pro + GetPropertyName(k) + config[k] + "#br"
            }

            AddRdContent(this.mElemList["rd_title_" + k], font_title + titleText, "ht_24_cc", "gray")
            AddRdContent(this.mElemList["rd_config_" + k], configStr, "ht_20_cc", "gray")
        }

        this.canTurn = count >= 4
    }

    //////------------响应函数
    onSelectTopClick(args: egret.Event) {
        let radioGroup: eui.RadioButtonGroup = args.target;
        let radiobtn = radioGroup.selection
        this.select = radiobtn.value

        this.onRefreshSingle()
    }

    onGotoClick(args: egret.Event) {
        let name = args.target.name
        let index = name.replace(/[^0-9]/ig, "")
        let skinInfo = this.controlData[index]
        if (skinInfo == null) return
        if (skinInfo.cellIndex == 2) {
            let wnd: RoleFATFrame = WngMrg.getInstance().getWindow("RoleFATFrame")
            wnd.onShowWnd(0, skinInfo.skinIndex)
        } else {
            let wnd: CommonSkinsFrame = WngMrg.getInstance().getWindow("CommonSkinsFrame")
            let funInfo = FunSystem.getInstance().getFunInfoWithType(skinInfo.cellIndex)
            if (funInfo == null) {
                MsgSystem.addTagTips(Localize_cns("ROLE_SKIN_TXT14"))
                return
            }
            wnd.onShowWnd(skinInfo.cellIndex, skinInfo.skinIndex)
        }
    }

    onTurnClick() {
        if (this.canTurn == false) {
            MsgSystem.addTagTips(Localize_cns("ROLE_SUIT_TXT2"))
            return
        }
        let controlList = RoleSystem.getInstance().getTaoZhuangControlList()
        if (controlList == null) return
        let skinInfoList = controlList[this.select]

        for (let k in skinInfoList) {
            let skinInfo = skinInfoList[k]
            if (skinInfo.cellIndex == 2)
                RpcProxy.call("C2G_ACTOR_ROLE_FASHION_SET", skinInfo.skinIndex)
            else
                RpcProxy.call("C2G_TEMPCELLFUN_SKIN_SET", skinInfo.cellIndex, skinInfo.skinIndex)
        }
    }


    ///////------------
    onShowWnd(suit) {
        let controlList = RoleSystem.getInstance().getTaoZhuangControlList()
        if (controlList == null) return
        for (let k in controlList) {
            let skinInfoList = controlList[k]
            let tempSuit = RoleEquipResonateIndex[skinInfoList[1].fashionType]
            if (tempSuit == suit) {
                this.select = tonumber(k)
            }
        }
        this.showWnd()
    }
}