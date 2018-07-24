class ShenHunFrame extends BaseWnd {
    select
    controlData: any
    topSelect

    typeList

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/role/ShenHunLayout.exml"]
        this.select = -1
    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_liehun", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLieHunClick },
            { ["name"]: "btn_rule", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRuleClick },
            { ["name"]: "btn_preView", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPreView },
            //{ ["name"]: "image_select", ["messageFlag"]: true },
            { ["name"]: "hero_icon", ["messageFlag"]: true },
        ];

        for (let k = 1; k <= 4; k++) {
            table_insert(elemInfo, { ["name"]: "image_add_" + k, ["messageFlag"]: true })
            table_insert(elemInfo, { ["name"]: "anim_" + k, ["messageFlag"]: true })
            table_insert(elemInfo, { ["name"]: "image_icon_" + k, ["messageFlag"]: true })
            table_insert(elemInfo, { ["name"]: "image_select_" + k, ["messageFlag"]: true }, )
            table_insert(elemInfo, { ["name"]: "image_di_" + k, ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTopSelect })
        }
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        let list: eui.List = this.mElemList["item_list"]
        list.itemRenderer = itemRender.ShenHunItem

        this.typeList = [
            { name: Localize_cns("SHENHUN_TYPE_TXT1") },
            { name: Localize_cns("SHENHUN_TYPE_TXT2"), type: optionShenHun.shuchu },
            { name: Localize_cns("SHENHUN_TYPE_TXT3"), type: optionShenHun.kongzhi },
            { name: Localize_cns("SHENHUN_TYPE_TXT4"), type: optionShenHun.fuzhu },
            { name: Localize_cns("SHENHUN_TYPE_TXT5"), type: optionShenHun.fangyu },
            { name: Localize_cns("SHENHUN_TYPE_TXT7"), type: optionShenHun.qita },
        ]
        // let config = GameConfig.ShenHunEquipConfig
        // for (let k in config) {
        //     let v = config[k]
        //     table_insert(this.typeList, {name : v.name, type : v.shenhunType})
        // }

        let showList = this.typeList
        if (size_t(showList) == 0) return
        //let showList = splitListByCount(list, 2)
        let cellName = "group_radio_"
        for (let k = 0; k < size_t(showList); k++) {
            let tempName = cellName + k
            let v = showList[k]
            if (this.mElemList[tempName] == null) {
                this.initItemWindow(tempName)
            }
            this.refreshItemWindow(tempName, v)
        }

        //频道单选
        var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
        radioGroup.addEventListener(eui.UIEvent.CHANGE, this.onSelectItemClick, this);
        for (let i = 0; i < size_t(showList); i++) {
            let tempName = cellName + i
            let radioBtn = <eui.RadioButton>this.mElemList[tempName]
            radioBtn.group = radioGroup;
            radioBtn.value = i
            //radioBtn.selected = false
        }
    }
    public onUnLoad(): void {
        this.topSelect = null

    }

    public onShow(): void {
        RegisterEvent(EventDefine.SHENHUN_UPGRADE, this.refreshHeroItem, this)
        RegisterEvent(EventDefine.ITEM_UPDATE, this.refreshSinge, this)
        this.mElemList["label_go"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLieHunClick, this)
        this.mLayoutNode.visible = true;
        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.SHENHUN_UPGRADE, this.refreshHeroItem, this)
        UnRegisterEvent(EventDefine.ITEM_UPDATE, this.refreshSinge, this)
        this.mElemList["label_go"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLieHunClick, this)
        this.mLayoutNode.visible = false;
    }

    onRefresh() {
        let force = RoleSystem.getInstance().getShenHunInfo("force")
        if (force == null) return
        DrawNumberStringImage(this.mElemList["bImage"], "zhanLi_", "z" + force, 0, 0, -3)
        if (this.topSelect == null) {
            this.topSelect = 1
        }
        this.refreshHeroItem()
        //this.refreshTopSelect()
        //人物
        let heroInfo = GetHeroPropertyInfo()
        let icon_hero: eui.Image = this.mElemList["hero_icon"]
        icon_hero.source = GetProfessionImage(heroInfo.vocation, heroInfo.sexId)

        let vocation = GetHeroProperty("vocation")
        let source = ""
        if (vocation == 10001) {
            source = "sh_zhongZu01"
        } else if (vocation == 10002) {
            source = "sh_zhongZu02"
        } else if (vocation == 10003) {
            source = "sh_zhongZu03"
        }
        this.mElemList["hero_zu"].source = source

        if (this.select == -1) {
            this.select = 0
        }

        let cellName = "group_radio_"
        let selectName = cellName + this.select
        let radioBtn: eui.RadioButton = this.mElemList[selectName]
        radioBtn.selected = true

        this.refreshSinge()

        this.refreshTopSelect()
    }

    initItemWindow(name) {
        if (this.mElemList[name] != null) return
        let mElemInfo: any = [
            { ["index_type"]: eui.RadioButton, ["name"]: name, ["image"]: "lt_biaoQian01", ["font"]: "ht_20_cc", ["image_down"]: "lt_biaoQian02", ["color"]: gui.Color.ublack, ["color_down"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 100, ["h"]: 55, ["event_name"]: null, ["fun_index"]: null },

        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, this.mElemList["group_item"])

    }

    refreshItemWindow(name, config) {
        let t: eui.RadioButton = this.mElemList[name]
        t.label = config.name
    }

    refreshSinge(args?) {
        let v = this.typeList[this.select]
        if (v == null) {
            this.select = 0
            v = this.typeList[this.select]
        }
        let shenhunType = v.type
        let itemList = ItemSystem.getInstance().getShenHunItemList(shenhunType)
        let dataList = []
        for (let k = 0; k < size_t(itemList); k++) {
            let v = itemList[k] || {}
            let temp: any = {}
            temp.item = v
            temp.select = 0
            temp.frame = this
            table_insert(dataList, temp)
        }
        let showList = splitListByCount(dataList, 7)
        let list: eui.List = this.mElemList["item_list"]
        UiUtil.updateList(list, showList)

        if (args == this.select) {
            this.restoreViewXY()
        }
        let count = size_t(dataList)
        this.mElemList["group_no"].visible = count == 0
        let isCap = this.select == 0
        this.mElemList["group_capacity"].visible = isCap
        if (isCap) {
            let max = defaultValue.MAX_SHENHUN_SIZE
            if (count >= max) {
                count = max
            }
            this.mElemList["label_capacity"].text = Localize_cns("SHENHUN_RONGLIANG") + count + "/" + max
        }

        this.refreshIconDot()
    }

    restoreViewXY() {
        let scroller: eui.Scroller = this.mElemList["scroller"]
        let viewport = scroller.viewport
        viewport.scrollH = 0
        viewport.scrollV = 0
        scroller.stopAnimation()
    }

    refreshHeroItem() {
        this.controlData = {}
        for (let k = 1; k <= 4; k++) {
            let heroItem: Item = RoleSystem.getInstance().getShenHunItem(k)
            let image_di: eui.Image = this.mElemList["image_di_" + k]
            let image_add: eui.Image = this.mElemList["image_add_" + k]
            let image_icon: eui.Image = this.mElemList["image_icon_" + k]
            let animBox: gui.AnimBox = this.mElemList["anim_" + k]

            let check = heroItem == null
            image_add.visible = !check
            image_icon.visible = !check
            animBox.visible = !check
            let icon = "ty_faBaoDi_weizhuangbei"
            if (check == false) {
                this.controlData[k] = heroItem
                let quality = heroItem.getProperty("quality")
                icon = GetFaBaoQualutyImage(quality)
                let enhanceLevel = heroItem.getProperty("enhanceLevel") || 0
                let check_add = (enhanceLevel != 0 && enhanceLevel <= 15)
                image_add.visible = check_add
                if (check_add) {
                    let source = "ty_jinJieShu"
                    if (enhanceLevel < 10) {
                        source += 0
                    }
                    image_add.source = source + enhanceLevel
                }
                image_icon.source = GetItemIcon(heroItem.entryId)
                let name = getShenHunAnimName(quality)
                animBox.setAnimName(name)
                animBox.setLoop(true)
            }
            image_di.source = icon
        }

        let force = RoleSystem.getInstance().getShenHunInfo("force") || 0
        DrawNumberStringImage(this.mElemList["bImage"], "zhanLi_", "z" + force, 0, 0, -3)
    }

    refreshTopSelect() {
        for (let k = 1; k <= 4; k++) {
            let image: eui.Image = this.mElemList["image_select_" + k]
            image.visible = k == this.topSelect
        }
    }

    ///////////响应
    onSelectItemClick(args) {
        let radioGroup: eui.RadioButtonGroup = args.target;
        let radiobtn = radioGroup.selection
        this.select = radiobtn.value
        this.refreshSinge(this.select)
    }

    onTopSelect(event) {
        let name = event.target.name;
        let index = name.replace(/[^0-9]/ig, "");
        let select = tonumber(index)
        let v = this.controlData[index]
        if (this.topSelect == select) {
            if (v) {
                let wnd: ShenHunItemTipsFrame = WngMrg.getInstance().getWindow("ShenHunItemTipsFrame")
                wnd.onShowWnd(v, select)
            }
            return
        }
        this.topSelect = select
        this.refreshTopSelect()
        //this.refreshHeroItem()
    }

    onLieHunClick() {
        let wnd: LieHunFrame = WngMrg.getInstance().getWindow("LieHunFrame")
        wnd.showWnd()
    }

    onRuleClick() {
        let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
        wnd.showWithActivity("ShenhunRule")
    }

    onPreView() {
        let wnd: ShenHunQualityFrame = WngMrg.getInstance().getWindow("ShenHunQualityFrame")
        wnd.showWithIndex(0)
    }

    ////红点
    refreshDotTipsImp() {
        this.refreshIconDot()
    }

    refreshIconDot() {
        for (let k = 1; k <= 4; k++) {
            let check = GuideFuncSystem.getInstance().checkShenHunWear(k)
            if (check) {
                this.createDotTipsUI(this.mElemList["equip_" + k])
            }
        }
    }
}

module itemRender {
    export class ShenHunItem extends eui.ItemRenderer {
        mElemList: any;
        controlData

        constructor() {
            super();
            this.mElemList = {}
            this.controlData = {}

            for (let i = 1; i <= 7; i++) {
                let x = 6 + 84 * (i - 1);

                let mElemInfo: any = [
                    { ["index_type"]: eui.Group, ["name"]: "group_" + i, ["image"]: "", ["font"]: "ht_20_cc", ["x"]: x, ["y"]: 0, ["w"]: 80, ["h"]: 80, },
                    { ["index_type"]: eui.Group, ["name"]: "item_" + i, ["parent"]: "group_" + i, ["image"]: "", ["font"]: "ht_20_cc", ["x"]: 0, ["y"]: 0, ["w"]: 80, ["h"]: 80, },
                    { ["index_type"]: gui.Button, ["name"]: "lock_" + i, ["parent"]: "group_" + i, ["image"]: "cw_jiNengSuo02", ["font"]: "ht_20_cc", ["x"]: 0, ["y"]: 0, ["w"]: 32, ["h"]: 41, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLockClick },
                    //add
                    { ["index_type"]: gui.Button, ["name"]: "select_" + i, ["parent"]: "group_" + i, ["image"]: "ty_xuanZheDi01", ["font"]: "ht_20_cc", ["x"]: 0, ["y"]: 0, ["w"]: 45, ["h"]: 46, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSelectClick },
                    { ["index_type"]: eui.Label, ["name"]: "name_" + i, ["parent"]: "group_" + i, ["image"]: "", ["font"]: "ht_20_cc_stroke", ["x"]: 0, ["y"]: 60, ["w"]: 80, ["h"]: 20, ["messageFlag"] : true },
                ]
                UiUtil.createElem(mElemInfo, this, this.mElemList, this)

                this.mElemList["itemBox_" + i] = UIItemBox.newObj(this, "itemBox_" + i, 0, 0, this.mElemList["item_" + i])

            }
        }

        protected dataChanged(): void {
            let config = this.data

            for (let i = 1; i <= 7; i++) {
                let v = config[i - 1]
                let group = this.mElemList["group_" + i]
                group.visible = v != null
                if (v != null) {
                    this.controlData[i] = v
                    let item = v.item
                    let name = item.getName()
                    let quality = item.getProperty("quality") || 1
                    let fontColot = GetQualityColorGui(quality)
                    this.mElemList["name_" + i].textColor = fontColot
                    this.mElemList["name_" + i].text = name
                    this.mElemList["itemBox_" + i].updateByItem(item)
                    let check = v.select == 0
                    this.mElemList["itemBox_" + i].setItemTipsListner(this.onClickBox, this, v.frame)
                    this.mElemList["lock_" + i].visible = check
                    this.mElemList["select_" + i].visible = !check
                    if (check) {
                        let lock = item.getProperty("talisman_lock") || 0
                        let source = lock == 0 ? "cw_jiNengSuo02" : "cw_jiNengSuo03"
                        this.mElemList["lock_" + i].source = source
                    } else {
                        let selectlist = v.frame.selectlist
                        let source = table_isExist(selectlist, item.id) ? "ty_xuanZhe01" : "ty_xuanZheDi01"
                        this.mElemList["select_" + i].source = source
                    }
                }
            }
        }

        onLockClick(args) {
            let name = args.target.name;
            let index = name.replace(/[^0-9]/ig, "");
            let v = this.controlData[index]
            if (v == null || v.item == null) return;
            let item = v.item
            let lock = item.getProperty("talisman_lock")
            let sendNum = lock == 1 ? 0 : 1
            RpcProxy.call("C2G_ITEM_LOCK", item.id, sendNum)
        }

        onSelectClick(args) {
            let name = args.target.name;
            let index = name.replace(/[^0-9]/ig, "");
            let config = this.controlData[index]
            if (config == null) return
            if (config.frame == null || config.frame.selectlist == null) return
            let btn = this.mElemList[name]
            let check = btn.source == "ty_xuanZheDi01"
            let source = check ? "ty_xuanZhe01" : "ty_xuanZheDi01"
            btn.source = source
            if (check) {
                table_insert(config.frame.selectlist, config.item.id)
            } else {
                table_remove(config.frame.selectlist, config.item.id)
            }
            config.frame.onRefresh()
        }

        onClickBox(item, userData) {
            if (item == null || userData == null) return
            let wnd: ShenHunItemTipsFrame = WngMrg.getInstance().getWindow("ShenHunItemTipsFrame")
            let topSelect = userData.topSelect
            wnd.onShowWnd(item, topSelect)
            return true
        }

    }

}