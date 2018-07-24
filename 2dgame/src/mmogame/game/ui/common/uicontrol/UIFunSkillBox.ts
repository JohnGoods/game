// TypeScript file
/*
作者:
    
	
创建时间：
   

意图：
   FUN技能框通用控件
   
公共接口：
   
*/
class UIFunSkillBox extends TClass {
    mParentNode: eui.Component;
    name: string;
    funType: number;
    posIndex: number;

    rootWnd: eui.Component;

    callback: Function;
    obj: any;
    userData: any;

    mElemList: any;

    public initObj(...args: any[]): void {
        this.mParentNode = args[0]
        this.name = args[1]
        let x = args[2]
        let y = args[3]
        let w = 100
        let h = 99

        let parentWnd = args[4]

        let scale = args[5] || 1.0
        w = w * scale
        h = h * scale

        this.funType = args[6]
        this.posIndex = args[7] || 0

        this.mElemList = {}

        let mElemInfo = [
            { ["index_type"]: eui.Group, ["name"]: "group_" + this.name, ["x"]: x, ["y"]: y, ["w"]: w, ["h"]: h, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSkill },
            { ["index_type"]: eui.Image, ["name"]: "iconBg_" + this.name, ["parent"]: "group_" + this.name, ["image"]: "ty_jiNengDi01", ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["messageFlag"]: true },
            { ["index_type"]: eui.Image, ["name"]: "icon_" + this.name, ["parent"]: "iconBg_" + this.name, ["image"]: "", ["x"]: 9 * scale, ["y"]: 8 * scale, ["w"]: 82 * scale, ["h"]: 82 * scale, ["messageFlag"]: true },
            { ["index_type"]: gui.Grid9Image, ["name"]: "lockBg_" + this.name, ["parent"]: "group_" + this.name, ["image"]: "zjm_shuRuDi01", ["x"]: 0, ["y"]: (h - 30) / 2, ["w"]: w, ["h"]: 30, ["messageFlag"]: true },
            { ["index_type"]: eui.Label, ["name"]: "lock_" + this.name, ["parent"]: "lockBg_" + this.name, ["title"]: "", ["font"]: "ht_18_cc", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: 30, ["messageFlag"]: true },
            { ["index_type"]: eui.Image, ["name"]: "select_" + this.name, ["parent"]: "group_" + this.name, ["image"]: "hb_jiNengXuanZhong", ["x"]: (w - 133) / 2, ["y"]: (h - 133) / 2, ["w"]: 133, ["h"]: 133, ["messageFlag"]: true },
            { ["index_type"]: eui.Image, ["name"]: "levelBg_" + this.name, ["parent"]: "group_" + this.name, ["image"]: "ty_daoJuLvDi01", ["x"]: 0, ["y"]: 0, ["w"]: 34 * scale, ["h"]: 34 * scale, ["messageFlag"]: true },
            { ["index_type"]: eui.Label, ["name"]: "level_" + this.name, ["parent"]: "levelBg_" + this.name, ["title"]: "", ["font"]: "ht_18_cc_stroke", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 34 * scale, ["h"]: 34 * scale, ["messageFlag"]: true },
        ]
        UiUtil.createElem(mElemInfo, this.mParentNode, this.mElemList, this, parentWnd)

        this.mElemList["lockBg_" + this.name].visible = false
        this.mElemList["lock_" + this.name].visible = false
        this.mElemList["levelBg_" + this.name].visible = false
        this.mElemList["level_" + this.name].visible = false
        this.mElemList["select_" + this.name].visible = false

        this.rootWnd = this.mElemList["group_" + this.name]

        //this.updateFunSkill()
    }

    updateFunSkill(_type?, _pos?) {
        if (_type) this.funType = _type;
        if (_pos) this.posIndex = _pos;

        let funInfo = FunSystem.getInstance().getFunInfoWithType(this.funType) || {}
        //if (funInfo == null) return;

        let skillInfo = FunSystem.getInstance().getFunSkillConfigWithPos(this.funType, this.posIndex + 1)
        this.mElemList["icon_" + this.name].source = GetSkillIcon(skillInfo.SkillId)

        let skillList = funInfo.skilllevellist || []
        let skillLevel = skillList[this.posIndex] || 0

        //天女体验
        let tastList = [cellOptionsIndex.TianNv, cellOptionsIndex.TianNvXianQi, cellOptionsIndex.TianNvHuaNian, cellOptionsIndex.TianNvLingQi]
        let endTime = getSaveRecord(opSaveRecordKey.firstRechareTiannv) || 0
        if (table_isExist(tastList, this.funType) && endTime > GetServerTime()) {
            skillLevel = size_t(GameConfig.FunUpgradeStageConfig["TianNv"])
            for (let i = 0; i < 4; i++) {
                skillList[i] = size_t(GameConfig.FunLevelNumConfig["TianNv"] + 1)
            }
        }

        if (skillLevel == 0) { //未解锁
            this.mElemList["lockBg_" + this.name].visible = true
            this.mElemList["lock_" + this.name].visible = true
            this.mElemList["levelBg_" + this.name].visible = false
            this.mElemList["level_" + this.name].visible = false

            let unlockLv = GameConfig.FunSkillCaseConfig[cellOptionsName[this.funType - 1]][this.posIndex + 1].UnlockLevel
            this.mElemList["lock_" + this.name].text = unlockLv + Localize_cns("PET_TXT12")
        } else { //已解锁
            this.mElemList["lockBg_" + this.name].visible = false
            this.mElemList["lock_" + this.name].visible = false
            this.mElemList["levelBg_" + this.name].visible = true
            this.mElemList["level_" + this.name].visible = true

            this.mElemList["level_" + this.name].text = skillLevel
        }
    }

    setClickCallBack(func: Function, obj, data) {
        this.callback = func
        this.obj = obj
        this.userData = data
    }

    select(_bool: boolean) {
        this.mElemList["select_" + this.name].visible = _bool
    }

    onClickSkill() {
        if (this.callback && this.obj) {
            this.callback.call(this.obj, this.userData)
        } else {
            let wnd = WngMrg.getInstance().getWindow("FunSkillFrame")
            wnd.showWithTypeAndIndex(this.funType, this.posIndex)
        }
    }
}