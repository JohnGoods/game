class XingLingFrame extends BaseWnd {
    mElemList;
    select: any;
    controlData
    scroll: UIScrollList

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/xingling/XingLingLayout.exml"]
    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_charge", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCharge },
            { ["name"]: "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPre },
            { ["name"]: "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNext },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["rd_pro"].setAlignFlag(gui.Flag.LEFT_CENTER)

        let group: eui.Group = this.mElemList["item_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "item_scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_HORIZON)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ACTOR_ROLE_UPDATE, this.onRefresh, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateWnd, this)
        this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true)
        this.onRefresh()
        RpcProxy.call("C2G_ACTOR_ROLE_PlayerAbility")
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ACTOR_ROLE_UPDATE, this.onRefresh, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateWnd, this)
        this.mLayoutNode.visible = false;
        this.select = null
        //this.mLayoutNode.setDoModal(false)
    }

    updateWnd(args: ActorUpdateEvent) {
        let oldVal = args.oldProperty
        let newVal = args.newProperty
        if (size_t(oldVal.xinglinglist || []) != size_t(newVal.xinglinglist || [])) {
            this.select = null
            FireEvent(EventDefine.MSG_WAIT_END, null)
        }

        if ((oldVal.force || 0) == (newVal.force || 0)) {
            return
        }
        this.onRefresh()
    }

    onRefresh() {
        let xinglingList = GetHeroProperty("xinglinglist")
        let netInfo = RoleSystem.getInstance().getRoleProperty()
        if (xinglingList == null || size_t(netInfo) == null) return
        let unLock = size_t(xinglingList)
        let xingConfig = GameConfig.XingLingConfig
        let showList = []
        for (let k in xingConfig) {
            table_insert(showList, xingConfig[k])
        }
        table_sort(showList, function (a, b) {
            return a.level - b.level
        })
        let count = size_t(showList)

        let scroll = this.scroll
        this.select = this.select || (unLock == count ? count : unLock + 1)

        if (this.select == null) {
            this.select = 1
        }

        this.controlData = {}
        for (let k = 1; k <= count; k++) {
            let v = showList[k - 1]
            this.controlData[k] = v
            let [window, flag] = scroll.getItemWindow(k, 100, 140, 0, 0)
            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v, k, unLock)
        }

        let config = null
        let lastEffect = {}
        let lastconstEff = {}
        if (this.select != 1) {
            config = showList[this.select - 2]
        }
        if (config != null) {
            lastEffect = table_effect(config.effects)
            lastconstEff = table_effect(config.constEff)
            /*let plus_last_effects = {}
            for (let k in lastEffect) {
                let pro = netInfo[k] || 0
                plus_last_effects[k] = pro * lastEffect[k]
            }
            force = GetForceMath(plus_last_effects) + GetForceMath(lastconstEff)*/
        }

        let nowConfig = showList[this.select - 1]
        if (nowConfig == null) return
        let effects = table_effect(nowConfig.effects)
        let constEff = table_effect(nowConfig.constEff)
        // let plus_effects = {}
        // for (let k in effects) {
        //     let pro = netInfo[k] || 0
        //     plus_effects[k] = pro * effects[k]
        // }
        // let nowForce = GetForceMath(plus_effects) + GetForceMath(constEff)

        let jie = nowConfig.level || 1
        DrawNumberStringImage(this.mElemList["bImage"], "daZhanLi02_", jie, 0, 0, -3)

        this.mElemList["imag_icon"].source = "xl_xingXiuTu0" + jie

        let nameStr = jie >= 10 ? jie : "0" + jie
        this.mElemList["image_name"].source = "xl_xingXiuName" + nameStr

        let pro_text = ""
        let addEffect = table_effect_sub(effects, lastEffect)
        let addConstEff = table_effect_sub(constEff, lastconstEff)

        let force = 0
       
        let percent = {}
        for (let k in addEffect) {
            let v = addEffect[k]
            if (v == 0) continue
            if (v < 1) {
                percent[k] = v
            } else {
                pro_text += GetPropertyName(k) + "+" + v + "#space"
                force += GetForceMath({[k] : v})
            }
        }

        for (let k in addConstEff) {
            let v = addConstEff[k]
            if (v == 0) continue
            if (v < 1) {
                percent[k] = v
            } else {
                pro_text += GetPropertyName(k) + "+" + v + "#space"
                force += GetForceMath({[k] : v})
            }
        }

        pro_text += "#br#br"

        for (let k in percent) {
            let v = percent[k]
            pro_text += GetPropertyName(k) + "+" + FormatNumber2f(v * 100) + "%#space"
            let pro = netInfo[k] || 0
            force += GetForceMath({[k] : pro * v})
        }

        let hide = force == 0
        this.mElemList["group_force"].visible = !hide
        this.mElemList["label_force"].text = Localize_cns("XINGLING_TXT1") + force
        // let foreachEff = {}
        // for (let k in addConstEff) {
        //     if (addEffect[k]) {
        //         foreachEff[k] = [addConstEff[k], addEffect[k]]
        //     } else {
        //         foreachEff[k] = [addConstEff[k]]
        //     }
        // }

        // for (let k in foreachEff) {
        //     let v = foreachEff[k]
        //     if (v == 0) continue
        //     let tempV = ""
        //     if (abilityNameToIndex[k] >= objectField.UNIT_FIELD_ATT_INC) {
        //         tempV = FormatNumber2f(v[0] * 100) + "%"
        //     } else {
        //         tempV = v[0]
        //     }
        //     pro_text += GetPropertyName(k) + "+" + tempV
        //     if (v[1]) {
        //         pro_text += "#space+" + FormatNumber2f(v[1] * 100) + "%"
        //     }
        //     pro_text += "#space"
        // }

        AddRdContent(this.mElemList["rd_pro"], pro_text, "ht_20_cc_stroke", "yellowgreen")

        this.mElemList["btn_charge"].visible = false
        this.mElemList["group_lock"].visible = false

        if (this.select > unLock + 1) {
            this.mElemList["group_lock"].visible = true
            let lockStr = ""
            if (this.select == 0) {
                lockStr = Localize_cns("PET_TXT37")
            } else {
                lockStr = String.format(Localize_cns("XINGLING_TXT3"), jie - 1)
            }
            this.mElemList["label_jie"].text = lockStr
        } else if (this.select == unLock + 1) {
            this.mElemList["btn_charge"].visible = true
            this.mElemList["btn_charge"].enabled = true
            let chargeConfig = GameConfig.RechargeConfig[nowConfig.id]
            let chargeCount = chargeConfig.ChargeCount || 0
            this.mElemList["btn_charge"].text = chargeCount + Localize_cns("XINGLING_TXT5") + Localize_cns("SHOP_TXT5")
        } else {
            this.mElemList["btn_charge"].visible = true
            this.mElemList["btn_charge"].enabled = false
            this.mElemList["btn_charge"].text = Localize_cns("XINGLING_TXT2")
        }

    }

    initItemWindow(window) {
        let name = window.name
        let w = 80
        let h = 80

        let elemInfo = [
            { ["index_type"]: eui.Group, ["name"]: name + "_group", ["title"]: null, ["x"]: 10, ["y"]: 20, ["w"]: w, ["h"]: h, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickIcon },
            { ["index_type"]: eui.Image, ["name"]: name + "_bg", ["parent"]: name + "_group", ["title"]: null, ["image"]: "ty_zhuangBeiBg03", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["messageFlage"]: true },
            { ["index_type"]: eui.Image, ["name"]: name + "_icon", ["parent"]: name + "_group", ["title"]: null, ["image"]: "xl_xingXiuIcon02", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["messageFlage"]: true },
            { ["index_type"]: eui.Image, ["name"]: name + "_select", ["parent"]: name + "_group", ["title"]: null, ["image"]: "ty_xuanZhongKuang01", ["x"]: -16, ["y"]: -16, ["w"]: 113, ["h"]: 113, ["messageFlage"]: true },
            { ["index_type"]: eui.Image, ["name"]: name + "_lock", ["parent"]: name + "_group", ["title"]: null, ["image"]: "cw_jiNengSuo03", ["x"]: 24, ["y"]: 20, ["w"]: 32, ["h"]: 41, ["messageFlage"]: true },
            { ["index_type"]: eui.Image, ["name"]: name + "_up", ["parent"]: name + "_group", ["title"]: null, ["image"]: "ty_tiShengJianTou02", ["x"]: 55, ["y"]: 50, ["w"]: 25, ["h"]: 30, ["messageFlage"]: true },
        ]
        UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this, window)
    }

    refreshItemWindow(window, config, k, unLock) {
        let name = window.name

        let jie = config.level || 1
        this.mElemList[name + "_icon"].source = "xl_xingXiuIcon0" + jie

        this.mElemList[name + "_select"].visible = k == this.select
        let up = jie == unLock + 1
        let lock = jie > unLock + 1
        this.mElemList[name + "_up"].visible = up
        this.mElemList[name + "_lock"].visible = lock
    }

    /////////////响应
    onClickIcon(args) {
        let name = args.target.name;
        let index = name.replace(/[^0-9]/ig, "");

        this.select = tonumber(index)
        this.onRefresh()
    }

    onClickPre(args) {
        this.scroll.moveRelativeItemWindow(-2, true)
    }

    onClickNext(args) {
        this.scroll.moveRelativeItemWindow(2, true)
    }

    onClickCharge() {
        let v = this.controlData[this.select]
        if (!v) return
        PaySystem.getInstance().payFromId(v.id)
    }



}