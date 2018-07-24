// TypeScript file
class ShenHunItemTipsFrame extends BaseWnd {
    item: Item
    index

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/role/FabaoItemTipsLayout.exml"]

    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_strong", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onStrongClick },
            { ["name"]: "btn_xieke", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onXieKeClick },
            { ["name"]: "btn_zhanshi", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onZhanShiClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["group_dazao"].visible = false

        this.mElemList["shenhunBox"] = UIItemBox.newObj(this.mLayoutNode, "shenhunBox", 24, 24, this.mElemList["item"])
    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.SHENHUN_UPGRADE, this.hideWnd, this)
        UiUtil.registerTouchOutsideEvent(this.hideWnd, this, [this.mElemList["btn_strong"], this.mElemList["btn_xieke"], this.mElemList["btn_zhanshi"]], false, true)
        this.mLayoutNode.visible = true;
        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.SHENHUN_UPGRADE, this.hideWnd, this)
        UiUtil.unRegisterTouchOutsideEvent(this.hideWnd, this)
        this.mLayoutNode.visible = false;
        //this.item = null
    }

    onRefresh() {
        if (this.item == null) return
        let item = this.item
        let entry = item.getEntryId()
        let quality = item.getProperty("quality") || item.getRefProperty("quality") || 1
        let add_num = item.getProperty("enhanceLevel") || 0
        let h = 130
        this.mElemList["shenhunBox"].updateByItem(item)
        //名字
        let name = "#" + GetQualityColorStr(quality) + item.getName()
        if (add_num >= 1) {
            name += "+" + add_num
        }
        AddRdContent(this.mElemList["rd_name"], name, "ht_24_lc_stroke")

        let force = 0

        let image: eui.Image = this.mElemList["hero_zu"]
        image.visible = true
        let vocation = item.getRefProperty("vocation")
        let source = ""
        if (vocation == 10001) {
            source = "sh_zhongZu01"
        } else if (vocation == 10002) {
            source = "sh_zhongZu02"
        } else if (vocation == 10003) {
            source = "sh_zhongZu03"
        } else {
            source = "sh_zhongZu04"
        }
        image.source = source

        //基础属性
        let effectConfig = GameConfig.ShenHunEquipEffectConfig[entry][quality]
        let upConfig = GameConfig.ShenHunEquipUpConfig[quality][add_num]
        if (effectConfig == null || upConfig == null) return
        let checkEffect = size_t(effectConfig.effects) != 0
        this.mElemList["group_base"].visible = checkEffect
        if (checkEffect) {
            let base_str = Localize_cns("ITEM_BASE_ATTR") + "#br"
            let config = table_effect(effectConfig.effects)
            let percent = upConfig.percentage || 0
            let addConfig = {}
            for (let k in config) {
                let pro = config[k]
                let isFloat = pro < 1
                let pro_str = ""
                if (isFloat) {
                    pro_str = FormatNumber2f(pro * 100) + "%"
                } else {
                    pro_str = FormatNumberInt(pro) + ""
                }
                base_str += GetPropertyName(k) + "#deepskyblue" + pro_str
                if (percent > 0) {
                    let add_pro = pro * percent
                    let add_str = ""
                    if (isFloat) {
                        let plus_pro = FormatNumber2f(add_pro)
                        addConfig[k] = plus_pro
                        add_str += FormatNumber2f(pro * percent * 100) + "%"
                    } else {
                        let plus_pro = FormatNumberInt(add_pro)
                        addConfig[k] = plus_pro
                        add_str += plus_pro
                    }
                    base_str += "+" + add_str

                }
                base_str += "#br#rf"
            }
            let rd_base: gui.RichDisplayer = this.mElemList["rd_base"]
            AddRdContent(rd_base, base_str, "ht_20_cc_stroke")
            let baseHeight = rd_base.getLogicHeight() + 10
            this.mElemList["group_base"].y = h
            this.mElemList["group_base"].height = baseHeight
            h += baseHeight
            force = GetForceMath(config) + GetForceMath(addConfig)
        }

        this.mElemList["bImage"].beginDraw();
        this.mElemList["bImage"].drawNumberString("zhanLi_", "z" + force, 0, 0, -3)
        this.mElemList["bImage"].endDraw();

        //技能属性
        let checkSkill = true
        this.mElemList["group_effect"].visible = checkSkill
        if (checkSkill) {
            this.mElemList["group_effect"].y = h
            let effect_str = Localize_cns("PET_TXT6") + ":" + effectConfig.skillName + "#br" + effectConfig.skillTips

            let rd_effect: gui.RichDisplayer = this.mElemList["rd_effect"]
            AddRdContent(rd_effect, effect_str, "ht_20_cc_stroke", "orange")
            let effectHeight = rd_effect.getLogicHeight() + 30
            this.mElemList["group_effect"].height = effectHeight
            h += effectHeight
        }

        //强化、携刻按钮
        let check = this.index != null
        this.mElemList["group_shenhun"].visible = check
        if (check) {
            this.mElemList["group_shenhun"].y = h
            h += 70
            let hero_voca = GetHeroProperty("vocation")
            let checkWear = (hero_voca == vocation || vocation == 0)
            this.mElemList["group_btn"].visible = checkWear
            this.mElemList["label_cant"].visible = !checkWear
            if (checkWear) {
                let id = 0
                let roleItem = RoleSystem.getInstance().getShenHunItem(this.index)
                if (roleItem != null) {
                    id = roleItem.id
                }
                let checkItem = id == item.id
                let btn_name = checkItem ? Localize_cns("SHENHUN_TXT5") : Localize_cns("SHENHUN_TXT2")
                this.mElemList["btn_xieke"].text = btn_name
            }
        }
        h += 20
        this.mElemList["equip_wnd"].height = h
        this.mLayoutNode.height = h
        this.mLayoutNode.width = 460
    }


    ////响应事件
    onStrongClick() {
        if (this.item == null) return
        let wnd: ShenHunStrongFrame = WngMrg.getInstance().getWindow("ShenHunStrongFrame")
        wnd.onShowWnd(this.item)
        this.hideWnd()
    }

    onXieKeClick(args) {
        if (this.item == null || this.index == null) return
        //检查是否可以穿戴
        let vocation = GetHeroProperty("vocation")
        let item_vocation = this.item.getRefProperty("vocation")
        if (vocation != item_vocation && item_vocation != 0) {
            let roleConfig = GameConfig.ActorRoleConfig[vocation]
            MsgSystem.addTagTips(String.format(Localize_cns("SHENHUN_TXT10"), roleConfig.name))
            return
        }
        let name = args.target.name
        let index = this.index + opTalismanEquipPos.begin - 1
        let id = this.item.id
        if (this.mElemList[name].text == Localize_cns("SHENHUN_TXT5")) {
            RpcProxy.call("C2G_EquipShenHunSet", 0, index)
            return
        }
        let pos = this.index
        let item = this.item
        //let this_shenhunType = this.item.getRefProperty("shenhunType")
        let roleItem: Item = RoleSystem.getInstance().getShenHunItem(this.index)
        let check = roleItem != null //检查是否有装备
        if (check) {
            let tips = Localize_cns("SHENHUN_TXT4")
            let t: IDialogCallback = {
                onDialogCallback(result: boolean, userdata): void {
                    if (result == true) {
                        if (RoleSystem.getInstance().checkShenHunWear(item, pos)) {
                            RpcProxy.call("C2G_EquipShenHunSet", id, index)
                        } else {
                            MsgSystem.addTagTips(Localize_cns("SHENHUN_TXT27"))
                        }

                    }
                }
            }
            MsgSystem.confirmDialog(tips, t, null)
        } else {
            if (RoleSystem.getInstance().checkShenHunWear(item, pos)) {
                RpcProxy.call("C2G_EquipShenHunSet", id, index)
            } else {
                MsgSystem.addTagTips(Localize_cns("SHENHUN_TXT27"))
            }
        }

    }

    onZhanShiClick() {
        let item = this.item
        if (item == null) return
        let entry = item.entryId
        let quality = item.getProperty("quality")
        let plrName = GetHeroProperty("name")
        let enhanceLevel = item.getProperty("enhanceLevel") || 0
        let name = item.getName()
        let text = GameConfig.HyperLinkConfig[channelOption.C_SHENHUN_SHOW].des
        let str = String.format(text, XmlConverter.LinkSign, entry, quality, enhanceLevel,  name, XmlConverter.LinkSign)
        ChannelHyperlinkMrg.getInstance().sendHyperLinkMessage(str)
        this.hideWnd()
    }

    /////////////////////-----------------------
    onShowWnd(item, index?) {
        if (item == null) return
        this.item = item
        this.index = index || null
        this.showWnd()
    }
}