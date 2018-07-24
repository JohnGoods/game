// TypeScript file
class PetUnionSuccessFrame extends BaseWnd {
    entryId: number;
    actorView: UIActorView;
    effectView: UIActorView;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/pet/PetUnionSuccessLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        this.mLayoutNode.verticalCenter = -100

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.effectView = UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["group_bg_view"])

        this.actorView = UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["group_actorview"])
        //this.actorView.setActorScale(1.0)

        this.mElemList["rd_gain"].setAlignFlag(gui.Flag.H_CENTER)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;

        this.refreshFrame()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;

        this.actorView.clearView()
        this.effectView.clearView()
    }

    refreshFrame() {
        this.effectView.updateByEffect(effectIndex.BuZhuo)

        this.actorView.updateByPlayer(GetPetModel(this.entryId))

        AddRdContent(this.mElemList["rd_gain"], String.format(Localize_cns("PET_UNION_TXT8"), "#cyan" + PetSystem.getInstance().getPetName(this.entryId)), "ht_20_cc_stroke", "white")
    }

    showWithEntryId(entryId) {
        this.entryId = entryId
        this.showWnd()
    }
}