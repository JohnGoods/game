// TypeScript file
class FuncPreviewFrame extends BaseWnd {
    funcIndex: string

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/FuncPreviewLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();
        this.setAlignCenter(true, true)
        //this.setFullScreen(true)

        let mElemInfo: any = [

            //     { ["index_type"]: gui.Grid9Image, ["name"]: "bg_", ["title"]: null, ["font"]: null, ["image"]: "ty_UIDi01", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["percentWidth"]: 100, ["percentHeight"]: 100, ["event_name"]: null, ["fun_index"]: null },
            //     { ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["title"]: null, ["font"]: null, ["image"]: "ty_UIBg02", ["color"]: gui.Color.white, ["x"]: 30, ["y"]: 30, ["w"]: 540, ["h"]: 376, ["event_name"]: null, ["fun_index"]: null },
            //     { ["index_type"]: gui.RichDisplayer, ["name"]: "emailMsg", ["title"]: null, ["font"]: "ht_24_lc_stroke", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 44, ["y"]: 40, ["w"]: 480, ["h"]: 200, ["event_name"]: null, ["fun_index"]: null },
            //     { ["index_type"]: gui.RichDisplayer, ["name"]: "prizePoint_rd", ["title"]: null, ["font"]: "ht_24_lc_stroke", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 64, ["y"]: 260, ["w"]: 522, ["h"]: 60, ["event_name"]: null, ["fun_index"]: null },
            //     { ["index_type"]: gui.Button, ["name"]: "confirmBtn", ["title"]: Localize_cns("SURE"), ["font"]: "ht_24_cc_stroke_saddlebrown", ["image"]: "ty_tongYongBt1", ["color"]: gui.Color.white, ["x"]: 215, ["y"]: 432, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickConfirmBtn },
            { ["name"]: "btn_close_top", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_back", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "confirm_btn", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ]
        UiUtil.initElem(mElemInfo, this.mLayoutNode, this.mElemList, this);

        for (let i = 0; i < 3; i++) {
            this.mElemList["itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, "itemBox" + i, 140 + 100 * i, 525)
        }

        this.mElemList["mon_veiw"] = UIActorView.newObj(this.mLayoutNode, "mon_veiw", 60, 111, this.mElemList["mon_group"])
        //this.mElemList["mon_veiw"].updateByPlayer(20001)

        this.mElemList["open_gain_rd"].setAlignFlag(gui.Flag.RIGHT);
        AddRdContent(this.mElemList["open_gain_rd"], Localize_cns("BOSS_TXT28"), "ht_24_cc", "ublack")
        AddRdContent(this.mElemList["open_con_rd"], Localize_cns("BOSS_TXT28"), "ht_24_cc", "ublack")

        this.mElemList["label_wndName"].text = Localize_cns("GUIDE_TXT9")
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        //RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)

        this.mLayoutNode.visible = (true)
        this.refreshFrame()
    }

    public onHide(): void {
        //UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_DOWN, this.onMouseDown, this)
        this.mLayoutNode.visible = (false)
        this.mElemList["mon_veiw"].clearView()
    }

    refreshFrame() {
        if (!this.funcIndex) {
            return
        }

        let config = GameConfig.FuncPreviewConfig[this.funcIndex]
        if (!config) {
            return
        }

        let actorElem = <UIActorView>this.mElemList["mon_veiw"]
        actorElem.clearView()
        let modelID = config.monModelId

        this.mElemList["mon_anim_box"].visible = false

        if (modelID) {
            let modelShape = ""
            let modelType = ""
            if (config.shape && size_t(config.shape) > 0) {
                modelType = config.shape[0][0]
                modelShape = config.shape[0][1]

                if (modelType == "role") {
                    let playerInfo = GetHeroPropertyInfo()
                    let modelList: any = {}
                    modelList["vocation"] = playerInfo.vocation
                    modelList["sexId"] = playerInfo.sexId
                    modelList["rideShapeId"] = playerInfo.rideShapeId
                    modelList["weaponShapeId"] = playerInfo.weaponShapeId
                    modelList["wingShapeId"] = playerInfo.wingShapeId

                    modelList[modelShape] = modelID

                    actorElem.updateByPlayerAppearInfo(modelList)
                } else if (modelType == "xianlv") {
                    let modelList: any = {}
                    modelList[modelShape] = modelID

                    let xlId = XianLvSystem.getInstance().getFirstFightId()
                    actorElem.updateByXianLvAppearInfo(xlId, modelList)
                } else if (modelType == "pet") {
                    let modelList: any = {}
                    modelList[modelShape] = modelID

                    let activeList = PetSystem.getInstance().getPetActiveList()
                    actorElem.updateByPetAppearInfo(activeList[0], modelList)
                }
            } else {
                let actor = actorElem.updateByPlayer(modelID)
                actor.doCommand(ActorCommand.SetShadowVisible, false, null)
            }
        } else {
            actorElem.clearView()
            let info = IGlobal.animSet.getAnimInfo(config.effect)
            UiUtil.setWH(this.mElemList["mon_anim_box"], info.w, info.h)
            UiUtil.setXY(this.mElemList["mon_anim_box"], 285 + (150 - info.w) / 2, 220 + (100 - info.h) / 2)
            this.mElemList["mon_anim_box"].setAnimName(config.effect)
            this.mElemList["mon_anim_box"].visible = true
        }

        this.mElemList["func_name"].text = config.name
        AddRdContent(this.mElemList["open_con_rd"], Localize_cns("GUIDE_TXT10") + "#red" + config.conditionDes, "ht_24_cc", "ublack")
        AddRdContent(this.mElemList["open_gain_rd"], config.prizeDes, "ht_24_cc", "ublack")

        let list = AnalyPrizeFormat(config.showItem)
        for (let i = 0; i < 3; i++) {
            let v = list[i]
            if (v) {
                this.mElemList["itemBox" + i].setVisible(true)
                this.mElemList["itemBox" + i].updateByEntry(v[0], v[1])
            } else {
                this.mElemList["itemBox" + i].setVisible(false)
            }
        }
    }
    //////////////////////////////////////////


    /////////////////////////////////////////////公共接口//////////////////////////////
    showFuncPreviewFrame(funcIndex) {
        this.funcIndex = funcIndex
        this.showWnd()
    }
}