// TypeScript file
class ClubChangeNameFrame extends BaseWnd {
    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/club/ClubChangeNameLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();
        this.setAlignCenter(true, true)

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

            { ["name"]: "btn_ok", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickOk },
            { ["name"]: "btn_cancel", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCancel },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["cost_rd"].setAlignFlag(gui.Flag.H_CENTER)
        AddRdContent(this.mElemList["cost_rd"], "#YUANBAO#space_10" + opFactionBaseOptions.CHANGE_NAME_MONEY, "ht_24_cc", "lime")
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.mLayoutNode.setDoModal(true)
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        this.mLayoutNode.setDoModal(false)
    }

    onClickOk() {
        let content = this.mElemList["input_box"].text
        if (content == null || content == "") {
            MsgSystem.addTagTips("CHAT_ERROR_NEIRONGBUNENGWEIKONG")
            return
        }

        RpcProxy.call("C2G_FactionName", content)
        this.hideWnd()
    }

    onClickCancel() {
        this.hideWnd()
    }
}