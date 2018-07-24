class ShenHunQualityWindow extends BaseCtrlWnd {
    mElemList;
    scroll: UIScrollList
    controlData

    typeList

    public initObj(...params: any[]) {
        this.typeList = params[2]
    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        this.scroll = this.mParentWnd.scroll
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.onRefresh();
    }

    public onHide(): void {

    }

    onRefresh() {
        if (this.typeList == null) return
        let text = ""
        let typeList = this.typeList
        if (size_t(typeList) > 1) {
            text = Localize_cns("FABAO_QUALITY_TITLE")
        } else {
            let nameLit = {
                [optionShenHun.shuchu]: Localize_cns("SHENHUN_TYPE_TXT2"),
                [optionShenHun.kongzhi]: Localize_cns("SHENHUN_TYPE_TXT3"),
                [optionShenHun.fuzhu]: Localize_cns("SHENHUN_TYPE_TXT4"),
                [optionShenHun.fangyu]: Localize_cns("SHENHUN_TYPE_TXT5"),
            }
            let type = this.typeList[0]
            text = nameLit[type] || ""
        }
        this.mElemList["title"].text = text


        let tempConfig = GameConfig.ShenHunEquipConfig
        let effectCofnig = GameConfig.ShenHunEquipEffectConfig

        let type = this.typeList[0]
        let list = []
        for (let k = 0; k < size_t(this.typeList); k++) {
            let shenhunType = this.typeList[k]
            for (let k in tempConfig) {
                let entry = tonumber(k)
                if (tempConfig[k].shenhunType != shenhunType) continue
                if (effectCofnig[entry] == null) continue
                let quality = 0
                for (let k in effectCofnig[entry]) {
                    quality = tonumber(k)
                    break
                }
                if (quality == 0) continue
                let temp: any = {}
                temp.entry = entry
                temp.quality = quality
                temp.enhanceLevel = 0
                temp.equip_exp = 0
                let item = Item.newObj(temp)
                table_insert(list, item)
            }
        }
        table_sort(list, function (a: Item, b: Item) {
            return b.getProperty("quality") - a.getProperty("quality")
        })
        //let showList = splitListByCount(list, 2)
        let item_list = this.mElemList["item_list"]
        UiUtil.updateList(item_list, list)
        this.restoreViewXY()
    }


    restoreViewXY() {
        let scroller: eui.Scroller = this.mElemList["scroller"]
        let viewport = scroller.viewport
        viewport.scrollH = 0
        viewport.scrollV = 0
        scroller.stopAnimation()
    }

}

module itemRender {
    export class ShenHunQualityItem extends eui.ItemRenderer {
        mElemList: any;
        controlData

        constructor() {
            super();
            this.mElemList = {}
            this.controlData = {}

            let elemInfo = [
                { ["index_type"]: eui.Group, ["name"]: "group", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "", ["color"]: gui.Color.ublack, ["x"]: 0, ["y"]: 0, ["w"]: 550, ["h"]: 350 },
                { ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["parent"]: "group", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 550, ["h"]: 350, ["messageFlag"]: true },
                { ["index_type"]: eui.Group, ["name"]: "top", ["parent"]: "group", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "", ["color"]: gui.Color.ublack, ["x"]: 12, ["y"]: 5, ["w"]: 526, ["h"]: 90, ["messageFlag"]: true },
                { ["index_type"]: gui.Grid9Image, ["name"]: "top_bg", ["parent"]: "top", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "ty_uiDi02", ["x"]: 0, ["y"]: 0, ["w"]: 526, ["h"]: 90, ["messageFlag"]: true },
                { ["index_type"]: eui.Image, ["name"]: "bgname", ["parent"]: "top", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "fb_faBaoTextDi02", ["x"]: 118, ["y"]: 15, ["w"]: 157, ["h"]: 39, ["messageFlag"]: true },
                { ["index_type"]: eui.Label, ["name"]: "item_name", ["parent"]: "bgname", ["title"]: "", ["font"]: "ht_22_cc", ["image"]: "", ["color"]: gui.Color.green, ["x"]: 0, ["y"]: 7, ["w"]: 157, ["h"]: 22, ["messageFlag"]: true },
                { ["index_type"]: gui.RichDisplayer, ["name"]: "item_force", ["parent"]: "top", ["title"]: "", ["font"]: "ht_22_cc", ["image"]: "", ["color"]: gui.Color.green, ["x"]: 132, ["y"]: 53, ["w"]: 500, ["h"]: 22, ["messageFlag"]: true },
                { ["index_type"]: eui.Image, ["name"]: "hero_zu", ["parent"]: "group", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "sh_zhongZu01", ["x"]: 480, ["y"]: 5, ["w"]: 50, ["h"]: 119, ["messageFlag"]: true },
                //属性
                { ["index_type"]: gui.RichDisplayer, ["name"]: "rd_base", ["parent"]: "group", ["title"]: "", ["font"]: "ht_24_lc", ["image"]: "", ["color"]: gui.Color.blue, ["x"]: 25, ["y"]: 99, ["w"]: 520, ["h"]: 24, ["messageFlag"]: true },
                //技能
                { ["index_type"]: gui.Grid9Image, ["name"]: "top_bg", ["parent"]: "top", ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "cz_uiLine01", ["x"]: 0, ["y"]: 226, ["w"]: 526, ["h"]: 16, ["messageFlag"]: true },
                { ["index_type"]: gui.RichDisplayer, ["name"]: "rd_skill", ["parent"]: "group", ["title"]: "", ["font"]: "ht_24_lc", ["image"]: "", ["color"]: gui.Color.blue, ["x"]: 25, ["y"]: 242, ["w"]: 500, ["h"]: 100, ["messageFlag"]: true },
            ]
            UiUtil.createElem(elemInfo, this, this.mElemList, this)
            //this.mElemList["quality"].setAlignFlag(gui.Flag.CENTER_CENTER)
            this.mElemList["itemBox"] = UIItemBox.newObj(this.mElemList, "itemBox", 16, 5, this.mElemList["top"])

        }

        protected dataChanged(): void {
            let item: Item = this.data
            let itemName = item.getName()
            let quality = item.getProperty("quality")
            let entryId = item.entryId
            let fontColor = "#" + GetQualityColorStr(quality, false)
            let fontGUIColor = GetQualityColorGui(quality, false)
            this.mElemList["item_name"].textColor = fontGUIColor
            this.mElemList["item_name"].text = itemName
            this.mElemList["itemBox"].updateByItem(item)

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
            }else{
                source = "sh_zhongZu04"
            }
            image.source = source

            let effectCofnig = GameConfig.ShenHunEquipEffectConfig[entryId][quality]
            if (effectCofnig == null) return

            let effect = table_effect(effectCofnig.effects)

            let maxLevel = optionShenHun.maxLevel
            let upConfig = GameConfig.ShenHunEquipUpConfig[quality][maxLevel]
            if (upConfig == null) return
            let percent = upConfig.percentage

            let temp: any = {}
            for (let k in effect) {
                temp[k] = effect[k]
            }

            let maxEffect = table_effect_mul(temp, percent)
            let force = GetForceMath(maxEffect) || 0
            AddRdContent(this.mElemList["item_force"], Localize_cns("SHENHUN_TXT20") + "#green" + force, "ht_22_lc", "ublack")

            let base_str = "#darkgoldenrod" + Localize_cns("SHENHUN_TXT21") + "#br#br#rf"
            for (let k in effect) {
                let pro = effect[k]
                let max_pro = maxEffect[k]
                let isFloat = pro < 1
                base_str += GetPropertyName(k) + "#green"
                if (isFloat) {
                    base_str += FormatNumber2f(pro * 100) + /*"%#space_10~" + FormatNumber2f(max_pro * 100) +*/ "%#rf" + String.format(Localize_cns("SHENHUN_TXT22"), FormatNumber2f(max_pro * 100) + "%")
                } else {
                    base_str += FormatNumberInt(pro) + /*"#space_10~" + FormatNumberInt(max_pro) +*/ "#rf" + String.format(Localize_cns("SHENHUN_TXT22"), FormatNumberInt(max_pro) + "")
                }
                base_str += "#br#br#rf"
            }

            AddRdContent(this.mElemList["rd_base"], base_str, "ht_20_lc", "ublack")

            let skil_str = "#darkgoldenrod" + Localize_cns("SHENHUN_TXT23") + "#br#br#rf"

            let skilltips = effectCofnig.skillTips

            skil_str += skilltips
            AddRdContent(this.mElemList["rd_skill"], skil_str, "ht_20_lc", "ublack")
        }


    }

}