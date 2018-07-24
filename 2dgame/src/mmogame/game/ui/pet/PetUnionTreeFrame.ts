// TypeScript file
class PetUnionTreeFrame extends BaseWnd {
    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/pet/PetUnionTreeLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let list: eui.List = this.mElemList["scroll"]
        list.itemRenderer = itemRender.PetUnionTreeItem
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;

        this.refreshFrame()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
    }

    refreshFrame() {
        let configList = GameConfig.PetUnionTreeConfig
        let dataList = []
        for (let i = 1; i <= 10; i++) {
            if (configList[i]) {
                let t: any = {}
                t.data = configList[i] //数组
                t.self = this
                table_insert(dataList, t)
            }
        }

        let list: eui.List = this.mElemList["scroll"]
        UiUtil.updateList(list, dataList)
    }
}

//合成组
module itemRender {
    export class PetUnionTreeItem extends eui.ItemRenderer {
        mElemList: any;
        nameToInfo: any
        constructor() {
            super();
            this.mElemList = {}
            this.nameToInfo = {}

            let mElemInfo = [
                { ["index_type"]: eui.Group, ["name"]: "group", ["x"]: 0, ["y"]: 0, ["w"]: 570, ["h"]: 355 },
                { ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["parent"]: "group", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 570, ["h"]: 350 },

                //根
                { ["index_type"]: eui.Group, ["name"]: "group1", ["parent"]: "group", ["x"]: 240, ["y"]: 246, ["w"]: 91, ["h"]: 91 },
                { ["index_type"]: gui.Grid9Image, ["name"]: "group1_bg", ["parent"]: "group1", ["image"]: "pf_roleDi01", ["x"]: 0, ["y"]: 0, ["w"]: 91, ["h"]: 91, ["messageFlag"]: true },
                { ["index_type"]: eui.Group, ["name"]: "group2", ["parent"]: "group", ["x"]: 101, ["y"]: 127, ["w"]: 91, ["h"]: 91 },
                { ["index_type"]: gui.Grid9Image, ["name"]: "group2_bg", ["parent"]: "group2", ["image"]: "pf_roleDi01", ["x"]: 0, ["y"]: 0, ["w"]: 91, ["h"]: 91, ["messageFlag"]: true },
                { ["index_type"]: eui.Group, ["name"]: "group3", ["parent"]: "group", ["x"]: 378, ["y"]: 127, ["w"]: 91, ["h"]: 91 },
                { ["index_type"]: gui.Grid9Image, ["name"]: "group3_bg", ["parent"]: "group3", ["image"]: "pf_roleDi01", ["x"]: 0, ["y"]: 0, ["w"]: 91, ["h"]: 91, ["messageFlag"]: true },
                { ["index_type"]: eui.Group, ["name"]: "group4", ["parent"]: "group", ["x"]: 12, ["y"]: 10, ["w"]: 520, ["h"]: 91 },
                { ["index_type"]: gui.Grid9Image, ["name"]: "group4_bg", ["parent"]: "group4", ["image"]: "pf_roleDi01", ["x"]: 0, ["y"]: 0, ["w"]: 520, ["h"]: 91, ["messageFlag"]: true },
                { ["index_type"]: eui.Group, ["name"]: "group5", ["parent"]: "group", ["x"]: 12, ["y"]: 10, ["w"]: 520, ["h"]: 91 },
                { ["index_type"]: gui.Grid9Image, ["name"]: "group5_bg", ["parent"]: "group5", ["image"]: "pf_roleDi01", ["x"]: 0, ["y"]: 0, ["w"]: 520, ["h"]: 91, ["messageFlag"]: true },

                { ["index_type"]: gui.Grid9Image, ["name"]: "left_arrow", ["parent"]: "group", ["image"]: "pf_jianTou01", ["x"]: 135, ["y"]: 100, ["w"]: 19, ["h"]: 30, ["messageFlag"]: true },
                { ["index_type"]: gui.Grid9Image, ["name"]: "right_arrow", ["parent"]: "group", ["image"]: "pf_jianTou01", ["x"]: 405, ["y"]: 100, ["w"]: 19, ["h"]: 30, ["messageFlag"]: true },
                { ["index_type"]: gui.Grid9Image, ["name"]: "union_arrow", ["parent"]: "group", ["image"]: "pf_jianTou02", ["x"]: 147, ["y"]: 216, ["w"]: 276, ["h"]: 36, ["messageFlag"]: true },
            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)

            this.mElemList["left_arrow"].visible = false
            this.mElemList["right_arrow"].visible = false
            //this.mElemList["union_arrow"].visible = false

            //this.mElemList["group1"].visible = false
            //this.mElemList["group2"].visible = false
            //this.mElemList["group3"].visible = false
            this.mElemList["group4"].visible = false
            this.mElemList["group5"].visible = false

            this.mElemList["petBox_1"] = UIPetBox.newObj(this, "petBox_1", 5, 5, this.mElemList["group1"])
            this.mElemList["petBox_2"] = UIPetBox.newObj(this, "petBox_2", 5, 5, this.mElemList["group2"])
            this.mElemList["petBox_3"] = UIPetBox.newObj(this, "petBox_3", 5, 5, this.mElemList["group3"])
            this.mElemList["petBox_1"].setClickListner(this.onClickIcon, this)
            this.mElemList["petBox_2"].setClickListner(this.onClickIcon, this)
            this.mElemList["petBox_3"].setClickListner(this.onClickIcon, this)

            for (let i = 1; i <= 6; i++) {
                this.mElemList["petBox_4" + i] = UIPetBox.newObj(this, "petBox_4" + i, 5 + 86 * (i - 1), 5, this.mElemList["group4"])
                this.mElemList["petBox_4" + i].setVisible(false)
                this.mElemList["petBox_4" + i].setClickListner(this.onClickIcon, this)
            }

            for (let i = 1; i <= 6; i++) {
                this.mElemList["petBox_5" + i] = UIPetBox.newObj(this, "petBox_5" + i, 5 + 86 * (i - 1), 5, this.mElemList["group5"])
                this.mElemList["petBox_5" + i].setVisible(false)
                this.mElemList["petBox_5" + i].setClickListner(this.onClickIcon, this)
            }
        }

        protected dataChanged(): void {
            let self = this.data.data
            let config = this.data.data

            this.mElemList["left_arrow"].visible = false
            this.mElemList["right_arrow"].visible = false
            //this.mElemList["union_arrow"].visible = false

            //this.mElemList["group1"].visible = false
            //this.mElemList["group2"].visible = false
            //this.mElemList["group3"].visible = false
            this.mElemList["group4"].visible = false
            this.mElemList["group5"].visible = false

            this.mElemList["petBox_1"].updateByEntry(config.Pos1)
            this.mElemList["petBox_2"].updateByEntry(config.Pos2)
            this.mElemList["petBox_3"].updateByEntry(config.Pos3)

            this.mElemList["petBox_1"].setFightFlag(false)
            this.mElemList["petBox_2"].setFightFlag(false)
            this.mElemList["petBox_3"].setFightFlag(false)

            this.nameToInfo["petBox_1"] = config.Pos1
            this.nameToInfo["petBox_2"] = config.Pos2
            this.nameToInfo["petBox_3"] = config.Pos3

            let unLockList = PetSystem.getInstance().getPetUnionRecordList()
            //是否解锁
            for (let i = 1; i <= 3; i++) {
                let lockState = CheckPetIsUnLock(config["Pos" + i]) || 0
                this.mElemList["petBox_" + i].setEnable(lockState == 2)
                this.mElemList["petBox_" + i].setLock(lockState)
            }

            if (size_t(config.Pos4) > 0) {
                let width = 5 + 86 * size_t(config.Pos4)
                UiUtil.setWH(this.mElemList["group4"], width, 91)
                UiUtil.setWH(this.mElemList["group4_bg"], width, 91)
                let x = (size_t(config.Pos4) > 3) ? 12 : (150 - width / 2)
                UiUtil.setXY(this.mElemList["group4"], x, 10)

                for (let i = 1; i <= 6; i++) {
                    if (config.Pos4[i - 1]) {
                        this.mElemList["petBox_4" + i].updateByEntry(config.Pos4[i - 1])
                        this.mElemList["petBox_4" + i].setFightFlag(false)

                        let lockState = CheckPetIsUnLock(config.Pos4[i - 1]) || 0
                        this.mElemList["petBox_4" + i].setEnable(lockState == 2)
                        this.mElemList["petBox_4" + i].setLock(lockState)

                        this.mElemList["petBox_4" + i].setVisible(true)
                        this.nameToInfo["petBox_4" + i] = config.Pos4[i - 1]
                    } else {
                        this.mElemList["petBox_4" + i].setVisible(false)
                    }
                }
                this.mElemList["group4"].visible = true
                this.mElemList["left_arrow"].visible = true
            }

            if (size_t(config.Pos5) > 0) {
                let width = 5 + 86 * size_t(config.Pos5)
                UiUtil.setWH(this.mElemList["group5"], width, 91)
                UiUtil.setWH(this.mElemList["group5_bg"], width, 91)
                let x = (size_t(config.Pos4) > 3) ? 558 : (420 - width / 2)
                UiUtil.setXY(this.mElemList["group5"], x, 10)
                for (let i = 1; i <= 6; i++) {
                    if (config.Pos5[i - 1]) {
                        this.mElemList["petBox_5" + i].updateByEntry(config.Pos5[i - 1])
                        this.mElemList["petBox_5" + i].setFightFlag(false)

                        let lockState = CheckPetIsUnLock(config.Pos5[i - 1]) || 0
                        this.mElemList["petBox_5" + i].setEnable(lockState == 2)
                        this.mElemList["petBox_5" + i].setLock(lockState)

                        this.mElemList["petBox_5" + i].setVisible(true)
                        this.nameToInfo["petBox_5" + i] = config.Pos5[i - 1]
                    } else {
                        this.mElemList["petBox_5" + i].setVisible(false)
                    }
                }
                this.mElemList["group5"].visible = true
                this.mElemList["right_arrow"].visible = true
            }

            if (size_t(config.Pos4) == 0 && size_t(config.Pos5) == 0) {
                UiUtil.setWH(this.mElemList["group"], 570, 235)
                UiUtil.setWH(this.mElemList["bg"], 570, 230)

                UiUtil.setXY(this.mElemList["union_arrow"], 147, 100)
                UiUtil.setXY(this.mElemList["group1"], 240, 130)
                UiUtil.setXY(this.mElemList["group2"], 101, 11)
                UiUtil.setXY(this.mElemList["group3"], 378, 11)
            } else {
                UiUtil.setXY(this.mElemList["union_arrow"], 147, 216)
                UiUtil.setXY(this.mElemList["group1"], 240, 246)
                UiUtil.setXY(this.mElemList["group2"], 101, 127)
                UiUtil.setXY(this.mElemList["group3"], 378, 127)
            }
        }

        onClickIcon(entryId) {
            let wnd = WngMrg.getInstance().getWindow("PetUnionFrame")
            wnd.showWithSelectedEntryId(entryId)

            let self = this.data.self
            self.hideWnd()

            return true
        }

    }
}