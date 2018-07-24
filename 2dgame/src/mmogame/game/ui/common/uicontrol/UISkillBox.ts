// TypeScript file
/*
作者:
    
	
创建时间：
   2017.02.24

意图：
   技能框通用控件
   
公共接口：
   
*/
class UISkillBox extends TClass {
    mParentNode: eui.Component;
    name: string;
    mElemList: any;
    rootWnd: eui.Group;
    skillId: number;
    skillType: number;
    skillLv: number;

    tipsFunc: Function;
    tipsObj: any;
    userData: any;

    bEnable: boolean;

    public initObj(...args: any[]): void {
        this.mParentNode = args[0]
        this.name = args[1]
        let x = args[2]
        let y = args[3]

        let parentWnd = args[4]
        let scale = args[5] || 1.0

        let w = 100 * scale
        let h = 99 * scale

        this.bEnable = true

        this.mElemList = {}

        let mElemInfo: any = [
            { ["index_type"]: eui.Group, ["name"]: "group_" + this.name, ["x"]: x, ["y"]: y, ["w"]: w, ["h"]: h, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onClickSkill },
            { ["index_type"]: eui.Image, ["name"]: "iconBg_" + this.name, ["parent"]: "group_" + this.name, ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["messageFlag"]: true },
            { ["index_type"]: eui.Image, ["name"]: "icon_" + this.name, ["parent"]: "iconBg_" + this.name, ["image"]: "", ["x"]: 9 * scale, ["y"]: 8 * scale, ["w"]: 82 * scale, ["h"]: 82 * scale, ["messageFlag"]: true },
            { ["index_type"]: gui.Grid9Image, ["name"]: "selectIcon_" + this.name, ["parent"]: "group_" + this.name, ["image"]: "hb_jiNengXuanZhong", ["x"]: -16 * scale, ["y"]: -17 * scale, ["w"]: 133 * scale, ["h"]: 133 * scale, ["messageFlag"]: true },
            //仙侣星级
            { ["index_type"]: gui.RichDisplayer, ["name"]: "star_wnd_" + this.name, ["parent"]: "group_" + this.name, ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: 20, ["messageFlag"]: true },

            //解锁
            { ["index_type"]: gui.Grid9Image, ["name"]: "lockBg_" + this.name, ["parent"]: "group_" + this.name, ["image"]: "zjm_shuRuDi01", ["x"]: 0, ["y"]: (h - 30) / 2, ["w"]: w, ["h"]: 30, ["messageFlag"]: true },
            { ["index_type"]: eui.Label, ["name"]: "lock_" + this.name, ["parent"]: "lockBg_" + this.name, ["title"]: "", ["font"]: "ht_18_cc", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: 30, ["messageFlag"]: true },
        ]
        UiUtil.createElem(mElemInfo, this.mParentNode, this.mElemList, this, parentWnd)

        this.rootWnd = this.mElemList["group_" + this.name]
        this.mElemList["selectIcon_" + this.name].visible = false
        this.mElemList["star_wnd_" + this.name].visible = false
        this.mElemList["star_wnd_" + this.name].setAlignFlag(gui.Flag.CENTER_TOP)

        this.mElemList["lockBg_" + this.name].visible = false
        this.mElemList["lock_" + this.name].visible = false
    }

    setLock(b: boolean, content) {
        this.mElemList["lock_" + this.name].text = content

        this.mElemList["lockBg_" + this.name].visible = b
        this.mElemList["lock_" + this.name].visible = b
    }

    _updatePetSkill() {
        let skillInfo = SkillSystem.getInstance().getPetSkillInfo(this.skillId)
        if (skillInfo == null) {
            TLog.Debug("PetSkill info is null")
            return
        }

        this._updateIcon(GetSkillQualityIcon(this.skillId), GetSkillIcon(this.skillId))
    }

    _updateRoleSkill() {
        let skillInfo = SkillSystem.getInstance().getRoleSkillInfo(this.skillId)
        if (skillInfo == null) {
            TLog.Debug("RoleSkill info is null")
            return
        }

        this._updateIcon(GetSkillQualityIcon(this.skillId), GetSkillIcon(this.skillId))
    }

    _updateXianLvSkill() {
        let skillInfo = SkillSystem.getInstance().getXianLvSkillInfo(this.skillId, this.skillLv)
        if (skillInfo == null) {
            TLog.Debug("XianLvSkill info is null")
            return
        }

        let star = this.skillLv

        let xingStr = ""
        if (star > 3) {
            xingStr += "#yellow" + star + "#STAR"
        } else {
            for (let i = 0; i < star; i++) {
                xingStr += "#STAR"
            }
        }

        AddRdContent(this.mElemList["star_wnd_" + this.name], xingStr, "ht_24_cc")
        this.mElemList["star_wnd_" + this.name].visible = true
        this._updateIcon(GetSkillQualityIcon(this.skillId, this.skillLv), GetSkillIcon(this.skillId, this.skillLv))
    }

    _updateIcon(bgIcon, icon) {
        this.bEnable = true
        this.mElemList["iconBg_" + this.name].source = bgIcon
        this.mElemList["icon_" + this.name].source = icon
    }

    onClickSkill(args) {

        if (!this.bEnable) {
            return
        }

        if (this.tipsFunc) {
            //返回true，表示拦截不查看技能信息
            if (this.tipsFunc.call(this.tipsObj, this.skillId, this.skillLv, this.userData, args)) {
                return
            }
        } else {
            let wnd = WngMrg.getInstance().getWindow("CommonTipsFrame")
            wnd.showCommonTips(this.skillType, this.skillId, this.skillLv)
        }

    }



    //////////////////////通用接口////////////////////////
    setVisible(b) {
        this.rootWnd.visible = (b)
    }

    clear() {
        this.setVisible(false)
    }

    lock() {
        this.mElemList["iconBg_" + this.name].source = "cw_jiNengSuo"
        this.mElemList["icon_" + this.name].source = ""
        this.select()
        this.setHintEnable()
    }

    select(b?) {
        this.mElemList["selectIcon_" + this.name].visible = b
    }

    setHintEnable(b?) {
        this.bEnable = b
    }

    setTipsListner(func, obj, userData) {
        this.tipsFunc = func
        this.tipsObj = obj
        this.userData = userData
    }

    updatePetSkill(skillId) {
        this.skillId = skillId
        this.skillType = cellOptionsIndex.Pet
        this._updatePetSkill()
    }

    updateRoleSkill(skillId, level) {
        this.skillId = skillId
        this.skillType = cellOptionsIndex.Hero
        this.skillLv = level
        this._updateRoleSkill()
    }

    updateXianLvSkill(skillId, level) {
        this.skillId = skillId
        this.skillType = cellOptionsIndex.XianLv
        this.skillLv = level
        this._updateXianLvSkill()
    }
}