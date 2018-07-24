// TypeScript file
class PetUnionLostFrame extends BaseWnd {
    entryId: number;
    actorView: UIActorView;
    effectView: UIActorView;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/pet/PetUnionLostLayout.exml"]
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
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
    }
}