// TypeScript file


class CommonTipsFrame extends BaseWnd {
    skillType: number;
    skillId: number;
    skillLv: number;

    public initObj(...params: any[]) {

    }

    public onLoad(): void {
        let w = 450
        let h = 600
        this.mLayoutNode.width = w
        this.mLayoutNode.height = h
        this.setAlignCenter(true, true)

        var mElemInfo = [
            { ["index_type"]: eui.Group, ["name"]: "group", ["title"]: null, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["messageFlag"]: true },
            { ["index_type"]: gui.Grid9Image, ["name"]: "bgImage", ["parent"]: "group", ["title"]: null, ["image"]: "ty_tipsDi", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h },
            { ["index_type"]: gui.RichDisplayer, ["name"]: "nameRd", ["parent"]: "group", ["title"]: null, ["x"]: 148, ["y"]: 40, ["w"]: 250, ["h"]: 30 },
            { ["index_type"]: gui.RichDisplayer, ["name"]: "typeRd", ["parent"]: "group", ["title"]: null, ["x"]: 148, ["y"]: 80, ["w"]: 250, ["h"]: 30 },
            { ["index_type"]: gui.Grid9Image, ["name"]: "line", ["parent"]: "group", ["title"]: null, ["image"]: "cz_uiLine01", ["x"]: 20, ["y"]: 120, ["w"]: w - 40, ["h"]: "16" },
            { ["index_type"]: gui.RichDisplayer, ["name"]: "desRd", ["parent"]: "group", ["title"]: null, ["x"]: 30, ["y"]: 150, ["w"]: w - 60, ["h"]: 400 },
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["skillBox"] = UISkillBox.newObj(this.mLayoutNode, "skillBox", 30, 20, this.mElemList["group"])
    }

    public onUnLoad(): void {

    }

    onShow() {
        RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.onMouseUp, this)

        this.mLayoutNode.visible = true
        this.mLayoutNode.setDoModal(true)
        this.refreshFrame()
    }

    onHide() {
        UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.onMouseUp, this)
        this.mLayoutNode.visible = false
        this.mLayoutNode.setDoModal(false)
    }

    refreshFrame() {
        let h = 0
        let rdH = 0

        let skillInfo = null
        let sName = ""
        let sType = 0
        let sdes = ""

        if (this.skillType == cellOptionsIndex.Pet) {
            h = 280
            rdH = 100

            skillInfo = SkillSystem.getInstance().getPetSkillInfo(this.skillId)
            sName = SkillSystem.getInstance().getSkillName(this.skillId)
            sType = skillInfo.fixed || 0
            sdes = Localize_cns("SKILL_TXT1")
            if (sType) {
                //sdes = sdes + Localize_cns("PET_SKILL_TYPE_" + sType)
            }
            sdes = sdes + SkillSystem.getInstance().getSkillDes(this.skillId)

            this.mElemList["skillBox"].updatePetSkill(this.skillId)
        } else if (this.skillType == cellOptionsIndex.XianLv) {
            h = 280
            rdH = 100

            this.mElemList["skillBox"].updateXianLvSkill(this.skillId, this.skillLv)
            skillInfo = SkillSystem.getInstance().getPetSkillInfo(this.skillId)
            sName = SkillSystem.getInstance().getSkillName(this.skillId)
            sdes = Localize_cns("SKILL_TXT1") + SkillSystem.getInstance().getSkillDes(this.skillId)
        }

        this.mLayoutNode.height = h
        this.mElemList["group"].height = h
        this.mElemList["bgImage"].height = h
        this.mElemList["typeRd"].height = rdH


        this.mElemList["skillBox"].setHintEnable()

        let config = GameConfig.SkillDescribeConfig[this.skillId]
        let color = "white"
        if (config && config[this.skillLv]) {
            let quality = config[this.skillLv].Quality
            color = GetQualityColorStr(quality, true)
        }

        AddRdContent(this.mElemList["nameRd"], sName, "ht_30_lc_stroke", color)

        AddRdContent(this.mElemList["typeRd"], Localize_cns("SKILL_TYPE" + sType), "ht_24_lc", "white")

        AddRdContent(this.mElemList["desRd"], sdes, "ht_24_lc", "white", 5)

        let rd: gui.RichDisplayer = this.mElemList["desRd"]
        let offH = rd.getLogicHeight() - (h - 170)
        if (offH > 0) {
            UiUtil.setWH(this.mElemList["bgImage"], this.mElemList["bgImage"].width, this.mElemList["bgImage"].height + offH)
            UiUtil.setWH(this.mLayoutNode, this.mElemList["bgImage"].width, this.mElemList["bgImage"].height)
        }
    }

    getXianLvDes() {
        //当前
        let curStr = SkillSystem.getInstance().getSkillDes(this.skillId, this.skillLv)

        if (this.skillLv == 7) { //满级
            return Localize_cns("SKILL_TXT2") + curStr
        } else {
            //下一级
            let nextStr = SkillSystem.getInstance().getSkillDes(this.skillId, this.skillLv + 1)
            //升级条件
            let condStr = Localize_cns("SKILL_TXT4") + String.format(Localize_cns("SKILL_TXT5"), this.skillLv + 1)

            return curStr + "#br" + nextStr + "#br" + condStr
        }

    }

    ////////////////////////////////-响应函数////////////////////////////////////////
    onMouseUp(args) {
        return this.hideWnd()
    }

    ////////////////////////////公共接口////////////////////////////////////-
    showCommonTips(skillType, skillId, skillLv) {
        this.skillType = skillType
        this.skillId = skillId
        this.skillLv = skillLv || 1
        this.showWnd()
    }
}