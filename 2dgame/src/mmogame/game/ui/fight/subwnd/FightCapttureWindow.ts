// TypeScript file
class FightCapttureWindow extends BaseCtrlWnd {
    controlDataTable: any;

    public initObj(...params: any[]) {
        this.controlDataTable = {};
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        var elemInfo = [
			{["name"]: "btn_captrue",     ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCaptrue },
            
		]
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)

    }

    public onUnLoad(): void {

    }

    public onShow(): void {
		RegisterEvent(EventDefine.COMBAT_FIGHT_ROUND_UPDATE, this.onFightRoundUpdate, this)

        this.mElemList["captrue_group"].visible = true
        
    }

    public onHide(): void {
		UnRegisterEvent(EventDefine.COMBAT_FIGHT_ROUND_UPDATE, this.onFightRoundUpdate, this)

        this.mElemList["captrue_group"].visible = false
    }

    

    onFightRoundUpdate(args) {
        //this.refreshFrame()
    }

    onClickCaptrue(args) {
        // RpcProxy.call("C2G_CreateBossFight", OrdinaryActivityIndex.CapturePet, 0)
        let message = GetMessage(opCodes.C2G_FIGHT_CMD)
		message.fightId = fightSide.FIGHT_RIGHT                       //哪一边（默认右边）
        message.skillType = skillSuperType.CAPTURE

        SendGameMessage(message)
    }

    ////////////////////////////////////////////////
}