class XianLvSkillDesFrame extends BaseWnd {
    id;
    level;


    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/xianlv/XianLvSkillDesLayout.exml"]

    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];

        //UiUtil.setFrameSize(this.mLayoutNode, 470, 442, 85, 229)
        this.initSkinElemList();
        let w = 470
        let h = 442
        this.mLayoutNode.width = w
        this.mLayoutNode.height = h
        this.setAlignCenter(true, true)

        this.mElemList["skillBox"] = UISkillBox.newObj(this.mLayoutNode, "skillBox", 35, 10, this.mElemList["group_1"])

        this.mElemList["rd_name"].setAlignFlag(gui.Flag.CENTER_CENTER)
        this.mElemList["rd_now"].setAlignFlag(gui.Flag.H_CENTER)
        this.mElemList["rd_next"].setAlignFlag(gui.Flag.H_CENTER)
        this.mElemList["rd_need"].setAlignFlag(gui.Flag.H_CENTER)
        this.mElemList["rd_level"].setAlignFlag(gui.Flag.RIGHT_CENTER)


    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.onMouseUp, this)
        this.mLayoutNode.visible = true;
        this.mLayoutNode.setDoModal(true)
        this.onRefresh()

    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.onMouseUp, this)
        this.mLayoutNode.visible = false;
        this.mLayoutNode.setDoModal(false)
    }

    onRefresh() {

        this.mElemList["skillBox"].updateXianLvSkill(this.id, this.level)
        //rd_name
        let name = SkillSystem.getInstance().getSkillName(this.id, this.level)
        let fontColor = "#" + GetQualityColorStr(this.level)
        let nameStr = fontColor + name
        if (this.level == opEquipQuality.color) {
            let colorList = ["#red", "#orange", "#magenta", "#cyan"]
            nameStr = ""
            for (let k = 0; k < name.length; k++) {
                let font_str = colorList[k] || colorList[k - colorList.length]
                nameStr += font_str + name[k]
            }
        }
        // let str1 = String.format(Localize_cns("XIANLV_TXT9"), name )
        AddRdContent(this.mElemList["rd_name"], nameStr, "ht_24_cc_stroke")
        //rd_level
        let str1 = String.format(Localize_cns("XIANLV_TXT9"), this.level)
        AddRdContent(this.mElemList["rd_level"], str1, "ht_24_cc_stroke", "lime")
        //rd_now
        let nowStr = SkillSystem.getInstance().getXianLvSkillDes(this.id, this.level)
        AddRdContent(this.mElemList["rd_now"], nowStr, "ht_24_cc_stroke")
        if (this.level == 7) {
            this.mLayoutNode.height = 280
            this.mElemList["group_1"].height = 280
            this.mElemList["image_2"].visible = false
            this.mElemList["image_3"].visible = false
            this.mElemList["rd_next"].visible = false
            this.mElemList["rd_need"].visible = false

        } else {
            this.mLayoutNode.height = 442
            this.mElemList["group_1"].height = 442
            this.mElemList["image_2"].visible = true
            this.mElemList["image_3"].visible = true
            this.mElemList["rd_next"].visible = true
            this.mElemList["rd_need"].visible = true
            //rd_next
            let nextStr = SkillSystem.getInstance().getXianLvSkillDes(this.id, this.level + 1)
            AddRdContent(this.mElemList["rd_next"], nextStr, "ht_24_cc_stroke")
            //rd_need
            let needStr = String.format(Localize_cns("XIANLV_TXT10"), this.level + 1)
            AddRdContent(this.mElemList["rd_need"], needStr, "ht_24_cc_stroke")

        }
    }

    onMouseUp(args) {
        return this.hideWnd()
    }

    onShowWnd(id, level) {
        this.id = id
        this.level = level
        this.showWnd()
    }
}