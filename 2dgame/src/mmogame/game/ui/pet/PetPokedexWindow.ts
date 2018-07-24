class PetPokedexWindow extends BaseCtrlWnd {
    mElemList;
    scroll: UIScrollList;

    public initObj(...params: any[]) {

    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList

        let group = <eui.Group>this.mElemList["pet_wnd1"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 40, 52, group.width - 80, group.height - 168, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mElemList["pet_wnd1"].visible = true
        this.refreshFrame()
    }

    public onHide(): void {
        this.mElemList["pet_wnd1"].visible = false
    }


    refreshFrame() {
        let group = <eui.Group>this.mElemList["pet_wnd1"]

        let titleH = 75
        let column = 5

        let list = []
        for (let i in GameConfig.PetFunTipsConfig) {
            let v = GameConfig.PetFunTipsConfig[i]
            let t = []
            for (let _ in v.petList) {
                let petId = v.petList[_]
                if (!CheckPetIsShield(petId)) {
                    table_insert(t, petId)
                }
            }
            v.petList = t
            list[i] = v
        }

        for (let i in list) {
            let v = list[i]
            let row = Math.ceil(size_t(v.petList) / column)
            let w = group.width - 80
            let h = titleH + 120 * row

            let [window, flag] = this.scroll.getItemWindow(tonumber(i), w, h, 0, 0, 0)
            if (flag == true) {
                this.initItemWindow(window, row, column)
            }
            this.refreshItemWindow(window, v, i, row, column)
        }
    }

    initItemWindow(window, row, column) {
        let name = window.name

        let ElemInfo = [
            { ["index_type"]: gui.Grid9Image, ["name"]: "wndBg_" + name, ["image"]: "ty_uiDi02", ["x"]: 0, ["y"]: 0, ["w"]: window.width, ["h"]: window.height, ["messageFlag"]: true },
            { ["index_type"]: gui.Grid9Image, ["name"]: "titleBg_" + name, ["image"]: "ty_textDi02", ["x"]: 15, ["y"]: 15, ["w"]: window.width - 30, ["h"]: 50, ["messageFlag"]: true },
            { ["index_type"]: eui.Label, ["name"]: "title_" + name, ["parent"]: "titleBg_" + name, ["title"]: "", ["font"]: "ht_24_lc", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 8, ["w"]: window.width - 50, ["h"]: 30, ["messageFlag"]: true },
            { ["index_type"]: gui.RichDisplayer, ["name"]: "obtain_" + name, ["parent"]: "titleBg_" + name, ["x"]: 10, ["y"]: 10, ["w"]: window.width - 50, ["h"]: 30 },
            { ["index_type"]: eui.Group, ["name"]: "petGroup_" + name, ["x"]: 25, ["y"]: 75, ["w"]: 500, ["h"]: window.height - 75 },
        ]
        UiUtil.createElem(ElemInfo, this.mLayoutNode, this.mElemList, this, window)

        this.mElemList["obtain_" + name].setAlignFlag(gui.Flag.RIGHT)

        let Info = []
        let w = 100
        let h = 120
        for (let i = 0; i < row * column; i++) {
            JsUtil.arrayInstert(Info, { ["index_type"]: eui.Group, ["name"]: "pet_" + name + i, ["parent"]: "petGroup_" + name, ["x"]: i % column * 100, ["y"]: Math.floor(i / column) * h, ["w"]: w, ["h"]: h })
            //JsUtil.arrayInstert(Info, { ["index_type"]: gui.Grid9Image, ["name"]: "petIconBg_" + name + i, ["parent"]: "pet_" + name + i, ["image"]: "ty_zhuangBeiBg01", ["x"]: 10, ["y"]: 0, ["w"]: 80, ["h"]: 80, ["messageFlag"]: true })
            //JsUtil.arrayInstert(Info, { ["index_type"]: gui.Grid9Image, ["name"]: "petIcon_" + name + i, ["parent"]: "petIconBg_" + name + i, ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: 80, ["h"]: 80 })
            JsUtil.arrayInstert(Info, { ["index_type"]: gui.RichDisplayer, ["name"]: "petName_" + name + i, ["parent"]: "pet_" + name + i, ["title"]: "", ["font"]: "", ["color"]: gui.Color.white, ["x"]: -10, ["y"]: h - 35, ["w"]: w + 20, ["h"]: 30 })
        }
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)

        for (let i = 0; i < row * column; i++) {
            UiUtil.moveToBack(this.mElemList["petName_" + name + i])
            this.mElemList["petBox_" + name + i] = UIPetBox.newObj(this.mLayoutNode, "petBox_" + name + i, 10, 0, this.mElemList["pet_" + name + i])
        }
    }

    refreshItemWindow(window, data, index, row, column) {
        let name = window.name

        this.mElemList["title_" + name].text = data.showTips

        //更新获取途径

        let petList = data.petList
        for (let i = 0; i < row * column; i++) {
            if (petList[i]) {
                let petId = petList[i]
                let petConfigInfo = PetSystem.getInstance().getPetEntryInfo(petId)
                let quality = petConfigInfo.quality
                let petName = petConfigInfo.name

                this.mElemList["pet_" + name + i].visible = true
                //更新petbox
                this.mElemList["petBox_" + name + i].updateByEntry(petId)
                this.mElemList["petBox_" + name + i].clear()
                //更新名字和颜色
                let color = GetQualityColorStr(quality)
                this.mElemList["petName_" + name + i].setAlignFlag(gui.Flag.H_CENTER)
                AddRdContent(this.mElemList["petName_" + name + i], petName, "ht_20_cc_stroke", color)
            } else {
                this.mElemList["pet_" + name + i].visible = false
            }
        }
    }
}