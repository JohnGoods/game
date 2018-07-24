// TypeScript file
class FaBaoItemTipsFrame extends BaseWnd {
    item: Item
    isPlayer: boolean
    index
    isHero: boolean
    percent

    isShow: boolean

    name
    level

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/role/FabaoItemTipsLayout.exml"]
        this.isPlayer = false
        this.isHero = false
        this.isShow = false
        this.name = ""
    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        //	this.mLayoutNode.width = 514
        //	this.mLayoutNode.height = 332
        this.setAlignCenter(true, true)

        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_show", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.showClick },
            { ["name"]: "btn_wear", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onWearClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["fabaoBox"] = UIFaBaoBox.newObj(this.mLayoutNode, "fabaoBox", 0, 0, this.mElemList["item"])
		/*let group : eui.Group = this.mElemList["equip_wnd"]
        group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hideWnd, this)*/
    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        UiUtil.registerTouchOutsideEvent(this.hideWnd, this, [this.mElemList["btn_show"], this.mElemList["btn_wear"]], false, true)
        this.mLayoutNode.visible = true;
        
        this.onRefreshFrame()
    }

    public onHide(): void {
        UiUtil.unRegisterTouchOutsideEvent(this.hideWnd, this)
        this.mLayoutNode.visible = false;
        this.isHero = false
        this.isPlayer = false
        this.isShow = false
        this.index = -1
        this.item = null
        this.name = ""
        this.percent = -1
    }

    onRefreshFrame() {
        if (this.item == null) return
        let itemId = this.item.entryId
        let quality = this.item.getProperty("quality")
        let item = this.item
        //------共同部分
        this.mElemList["fabaoBox"].updateByItem(this.item)
        let fontColor = GetQualityColorStr(quality, true)
        let name = item.getName()
        //名字 品质 
        let NameStr = "#" + fontColor + name
        let qualityStr = "#yellow" + Localize_cns("FABAO_QUALITY_TXT7") + "#" + fontColor + GetFaBaoQualityStr(quality)
        AddRdContent(this.mElemList["rd_name"], NameStr, "ht_24_lc_stroke")
        AddRdContent(this.mElemList["des"], qualityStr, "ht_20_lc_stroke")

        let height = 130
        //
        let config_rd = this.mElemList[""]


        let effectConfig = GameConfig.TalismanEquipEffectConfig[itemId][quality]
        let config = table_effect(effectConfig.effects)
        //属性
        let configStr = "#yellow" + Localize_cns("ITEM_FIXED_PROPERTY") + "#br"
        if (this.isHero) {
            let levelList = RoleSystem.getInstance().getFaBaoInfoByKey("talismanLevelList")
            let level = levelList[this.index + opTalismanEquipPos.begin - 1] || 0
            if (this.isShow) {
                level = this.level
            }
            let upConfig = GameConfig.TalismanEquipUpConfig[level]
            let percent = upConfig.percentage
            this.percent = percent || - 1

            let addPercent = String.format("#orange" + Localize_cns("FABAO_UPGRADE_TXT1"), percent * 100) + "#br#rf"
            configStr += addPercent

        }

        let force = GetForceMath(config)
        if (this.percent != -1) {
            let tempConfig = {}
            for (let k in config) {
                tempConfig[k] = config[k] * this.percent
            }
            force = GetForceMath(tempConfig)
        }
        this.mElemList["bImage"].beginDraw();
        this.mElemList["bImage"].drawNumberString("zhanLi_", "z" + force, 0, 0, -3)
        this.mElemList["bImage"].endDraw();

        for (let k in config) {
            configStr += "#orange" + GetPropertyName(k) + "#space_10#rf" + config[k]
            if (this.isHero && this.percent != -1) {
                configStr += "+" + FormatNumberInt(config[k] * this.percent)
            }
            configStr += "#br"
        }
        this.mElemList["group_base"].y = height
        let rd_base: gui.RichDisplayer = this.mElemList["rd_base"]
        AddRdContent(rd_base, configStr, "ht_20_cc_stroke")
        let baseHeight = rd_base.getLogicHeight() + 10
        this.mElemList["group_base"].height = baseHeight
        height += baseHeight

        //效果 ： xxx
        let checkEffect = effectConfig.skillName != ""
        this.mElemList["group_effect"].visible = checkEffect
        if (checkEffect) {
            this.mElemList["group_effect"].y = height
            let rd_effect: gui.RichDisplayer = this.mElemList["rd_effect"]
            let effect_str = "#orange" + Localize_cns("FABAO_SKILL") + effectConfig.skillName
            if (quality >= 5) { 
                let levelList = RoleSystem.getInstance().getFaBaoInfoByKey("talismanLevelList")
                let level = levelList[this.index + opTalismanEquipPos.begin - 1] || 0
                if (this.isHero == false) {
                    level = 0
                }
                if (this.name != "") {
                    level = this.level
                }
                let effectJudgeConfig = []
                if (size_t(effectConfig.skillattt) != 0) {
                    effectJudgeConfig = effectConfig.skillattt
                }
                let propertyConfig = {}
                for (let k in effectJudgeConfig) {
                    let judgeConfig = effectJudgeConfig[k]
                    if (judgeConfig[0] <= level && judgeConfig[1] >= level) {
                        propertyConfig = judgeConfig[2]
                        break
                    }
                }
                //let formatList = []
                let formatStr = effectConfig.skillTips
                let data = propertyConfig[0]
                let isFloat = MathUtil.isFloat(data)
                let temp = ""
                if (isFloat) {
                    let format = FormatNumber2f(data * 100) + "%"
                    temp = String.format(formatStr, format, propertyConfig[1])
                } else {
                    temp = String.format(formatStr, data, propertyConfig[1])
                }

                effect_str += "#br" + Localize_cns("FABAO_EFFECT") + temp
            }
            AddRdContent(rd_effect, effect_str, "ht_20_cc_stroke")
            let effectHeight = rd_effect.getLogicHeight() + 30
            this.mElemList["group_effect"].height = effectHeight
            height += effectHeight
        }

        ///打造者 ： xxx
        let checkDazao = (this.isHero || this.isPlayer || this.isShow)
        this.mElemList["group_dazao"].visible = checkDazao
        if (checkDazao) {
            this.mElemList["group_dazao"].y = height
            if (this.isHero || this.isPlayer || this.isShow) {
                if (this.name == "") {
                    this.name = GetHeroProperty("name")
                }
                let playerStr = "#orange" + Localize_cns("FABAO_DAZAOZHE") + this.name
                AddRdContent(this.mElemList["rd_dazao"], playerStr, "ht_20_lc_stroke")

            }
            let btn_name = [
                "btn_show", "btn_wear"
            ]
            let btn_show = this.mElemList[btn_name[0]]
            let btn_wear = this.mElemList[btn_name[1]]

            btn_show.visible = true
            btn_wear.visible = true

            if (this.isHero || (this.isPlayer && this.index == -1)) { //穿在身上的
                btn_wear.visible = false
            }

            if(!this.isHero && !this.isPlayer){
                btn_show.visible = false
            }

            if (this.isShow) {
                btn_show.visible = btn_wear.visible = false
            }

            let group: eui.Group = this.mElemList["btn_group"]
            let childNum = group.numElements
            for (let k = 0; k < group.numElements; k++) {
                let child = group.getChildAt(k)
                group.removeChild(child)
            }
            for (let k in btn_name) {
                let btn = btn_name[k]
                if (this.mElemList[btn].visible == true) {
                    group.addChild(this.mElemList[btn])
                }
            }

            height += 70
        }
        height += 10
        this.mElemList["equip_wnd"].height = height
        this.mLayoutNode.height = height

    }

    //////////--------------
    onWearClick(args: egret.TouchEvent) {
        let item = this.item
        let check = RoleSystem.getInstance().checkFaBaoItem(item.entryId, this.index)
        if (!check) {
            MsgSystem.addTagTips(Localize_cns("FABAO_TIPS_TXT2"))
            return
        }
        RpcProxy.call("C2G_EquipTalismanSet", item.id, this.index + opTalismanEquipPos.begin - 1)
        this.hideWnd()
    }

    showClick() {
        let item = this.item
        let quality = item.propertyInfo.quality
        let text = GameConfig.HyperLinkConfig[channelOption.C_FABAO_SHOW].des
        let str = String.format(text, XmlConverter.LinkSign, GetHeroProperty("id"), this.item.id, quality, this.item.getName(), XmlConverter.LinkSign)
        ChannelHyperlinkMrg.getInstance().sendHyperLinkMessage(str)
        this.hideWnd()
    }

    //////////////---------通用显示
    onShowWnd(item: Item, isPlayer?, index?) {
        this.item = item
        this.isPlayer = isPlayer || false
        this.index = index || -1
        this.showWnd()
    }
    
    ///------穿在身上的
    onShowHeroFaBao(item: Item, isHero, index) {
        this.item = item
        this.isHero = isHero
        this.index = index
        this.showWnd()
    }

    ///-------------展示接口
    onLinkShow(item, name, level) {
        this.isShow = true
        this.item = item
        this.name = name
        this.level = level || 0
        if (this.level != 0) {
            this.isHero = true
        }
        this.showWnd()
    }
}