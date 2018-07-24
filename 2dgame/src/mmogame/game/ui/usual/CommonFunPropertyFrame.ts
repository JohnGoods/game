// TypeScript file
class CommonFunPropertyFrame extends BaseWnd {
    type
    actor: UIActorView

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/usual/CommonFunPropertyLayout.exml"]

    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.width = 560
        this.mLayoutNode.height = 720

        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["rd_1"].setAlignFlag(gui.Flag.CENTER_CENTER);
        this.mElemList["rd_2"].setAlignFlag(gui.Flag.CENTER_CENTER);
        this.mElemList["rd_3"].setAlignFlag(gui.Flag.CENTER_CENTER);
        this.mElemList["rd_4"].setAlignFlag(gui.Flag.CENTER_CENTER);

        this.actor = UIActorView.newObj(this.mLayoutNode, "actor_view", 0, 0, this.mElemList["actor"])
    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.mLayoutNode.setDoModal(true);

        this.onRefresh();
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        this.mLayoutNode.setDoModal(false);
        this.actor.clearView()
    }

    onRefresh() {
        this.mElemList["label_title"].text = String.format(Localize_cns("PET_TXT42"), Localize_cns(cellOptionsName[this.type - 1]))

        let funInfo = FunSystem.getInstance().getFunInfoWithType(this.type)
        let force = GetTemCellTotalForce(this.type) //funInfo.force
        this.refreshForceNum(force)

        let skinList = {
            [cellOptionsIndex.HeroRide]: 1,
            [cellOptionsIndex.HeroWing]: 1,
            [cellOptionsIndex.TianNv]: 1,
            [cellOptionsIndex.TianXian]: 1,
            [cellOptionsIndex.TianXianWeapon]: 1,
        }


        let configList = GetTemCellTotalProperty(this.type)
        //let strlist = []
        for (let k = 1; k <= size_t(configList); k++) {
            let tempConfig = configList[k - 1]
            let tempStr = ""
            for (let k in tempConfig) {
                tempStr += GetPropertyName(lastAbilityNameToIdOptions[k]) + "#green" + tempConfig[k] + "#rf#space"
            }
            AddRdContent(this.mElemList["rd_" + k], tempStr, "ht_20_cc", "ublack");
        }

        if (!skinList[this.type]) {
            this.mElemList["group_property"].height = 228
            this.mElemList["group_skin"].visible = false
        } else {
            this.mElemList["group_property"].height = 304
            this.mElemList["group_skin"].visible = true
        }
        let modelid = GetFunShapeModel(this.type, funInfo.stage)
        if (this.type == cellOptionsIndex.XianLvXianWei || this.type == cellOptionsIndex.TianNvXianQi) {
            let icon = GetShapeImage(modelid)
            this.mElemList["xianwei_icon"].source = icon
            this.mElemList["xianwei_icon"].visible = true
        } else {
            this.mElemList["xianwei_icon"].visible = false
            this.actor.updateByPlayer(modelid)
        }


    }

    onShowWnd(cellOptionsIndex) {
        this.type = cellOptionsIndex
        this.showWnd()
    }

    refreshForceNum(force) {

        this.mElemList["bImage"].beginDraw();
        this.mElemList["bImage"].drawNumberString("zhanLi_", "z" + force, 0, 0, -3)
        this.mElemList["bImage"].endDraw();
    }

}