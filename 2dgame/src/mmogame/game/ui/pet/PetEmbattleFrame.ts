class PetEmbattleFrame extends BaseWnd {
    petId: number;
    posList: any;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/pet/PetEmbattleLayout.exml"]

        this.posList = {}
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        //this.setFullScreen(true)
        this.initSkinElemList();
        this.setAlignCenter(true, true)

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

            { ["name"]: "btnBattle", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBattle },
            { ["name"]: "btnPrepare1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickParpare1 },
            { ["name"]: "btnPrepare2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickParpare2 },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        var mElemInfo = []
        for (let i = 0; i < 3; i++) {
            this.mElemList["petBox_" + i] = UIPetBox.newObj(this.mLayoutNode, "petBox_" + i, 19, 5, this.mElemList["pos_wnd" + i])
            this.mElemList["petBox_" + i].setClickEnable(false)
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.mLayoutNode.setDoModal(true)
        this.refreshFrame()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        this.mLayoutNode.setDoModal(false)
    }

    refreshFrame() {
        //0代表没有出战，1代表出战 2代表备战1 3代表备战2
        let posList = PetSystem.getInstance().getEmbattlePosList()
        this.posList = posList

        for (let i = 0; i < 3; i++) {
            let petInfo = posList[i + 1]
            if (petInfo) { //有宠物
                this.mElemList["petBox_" + i].setVisible(true)
                this.mElemList["petBox_" + i].updateByEntry(petInfo.entryid)
                let namelab = <eui.Label>this.mElemList["name" + i]
                if (petInfo.name == null || petInfo.name == "") {
                    namelab.text = PetSystem.getInstance().getPetName(petInfo.entryid)
                } else {
                    namelab.text = petInfo.name
                }
                
                namelab.textColor = GetQualityColorStr(petInfo.quality)
                this.mElemList["lv" + i].text = "Lv." + petInfo.stage
            } else { //位置空
                this.mElemList["petBox_" + i].setVisible(false)
                this.mElemList["name" + i].text = ""
                this.mElemList["lv" + i].text = ""
            }
        }
    }

    onClickBattle() {
        RpcProxy.call("C2G_ACTOR_PET_COMBAT_SET", this.petId, opPetCombatPos.Battle)
        this.hideWnd()
    }

    onClickParpare1() {
        RpcProxy.call("C2G_ACTOR_PET_COMBAT_SET", this.petId, opPetCombatPos.Prepare1)
        this.hideWnd()
    }

    onClickParpare2() {
        RpcProxy.call("C2G_ACTOR_PET_COMBAT_SET", this.petId, opPetCombatPos.Prepare2)
        this.hideWnd()
    }

    ///////////////////////////////////
    showWithPetId(petId) {
        this.petId = petId
        this.showWnd()
    }
}