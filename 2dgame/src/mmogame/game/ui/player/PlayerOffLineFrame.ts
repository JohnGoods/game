// TypeScript file
class PlayerOffLineFrame extends BaseWnd {

    MAX_OFFLINE_TIME = 21600
    LEIJI_MAX_TIME = 6
    LETIJI_YUEKA_TIME = 12

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/role/OffLineLayout.exml"]

    }
    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        //UiUtil.setFrameSize(this.mLayoutNode, 617, 824, 12, 38);
        this.initSkinElemList();
        this.setAlignCenter(true, true)
        this.mLayoutNode.verticalCenter = -40;


        var elemInfo = [
            //	{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_awake", ["title"]: null, ["color"] : gui.Color.aliceblue, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAwakeClick },
            { ["name"]: "btn_sure", ["title"]: null, ["color"] : gui.Color.aliceblue, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["yueka_money"].textColor = gui.Color.lime
        this.mElemList["yueka_exp"].textColor = gui.Color.lime
        //this.mLayoutNode.setDoModal(true)

    }
    public onUnLoad(): void {

    }

    public onShow(): void {
        UiUtil.registerTouchOutsideEvent(this.hideWnd, this, [this.mLayoutNode])
        this.mLayoutNode.visible = true;
        this.onRefresh()

    }

    public onHide(): void {
        UiUtil.unRegisterTouchOutsideEvent(this.hideWnd, this,)
        this.mLayoutNode.visible = false;

    }
    onRefresh() {
        //离线收获
        let info = RoleSystem.getInstance().getOfflineInfo()
        if (size_t(info) == 0) {
            return
        }
        //rd_time
        let offTime = info.time
        let timeStr = ""
        if (offTime > this.MAX_OFFLINE_TIME) {
            offTime = this.MAX_OFFLINE_TIME
        }
        if (offTime > 3600) {
            timeStr = getFormatDiffTime(offTime)
        } else {
            timeStr = getFormatDiffTimeSimple(offTime)
        }

        AddRdContent(this.mElemList["rd_time"], Localize_cns("PLAYER_OFFLINE_TIME") + timeStr, "ht_20_cc", "ublack")
        let time = this.LEIJI_MAX_TIME
        let yuekaTime = getSaveRecord(opSaveRecordKey.monthCard) || 0
        if(yuekaTime > GetServerTime()){
            time = this.LETIJI_YUEKA_TIME
        }
        let leijiStr = String.format(Localize_cns("ROLE_LEIJI_TIME"), time)
        this.mElemList["label_instruc"].text = leijiStr
        
        //label_m_resource
        let money = info.funds
        let exp = info.exp
        let cloth = info.equip

        let str = String.format(Localize_cns("ROLE_OFFLINE_DES"), info.equipsell)
        AddRdContent(this.mElemList["rd_des"], str, "ht_24_cc", "ublack")
        //rd_des //

        this.mElemList["resource_money"].text = tostring(money)
        this.mElemList["resource_exp"].text = tostring(exp)
        this.mElemList["resource_cloth"].text = tostring(cloth)

        ///月卡
        let yuekamoney = info.fundsadd
        let yuekaexp = info.expadd

        this.mElemList["yueka_money"].text = tostring(yuekamoney)
        this.mElemList["yueka_exp"].text = tostring(yuekaexp)
    }

    onAwakeClick(){
        this.hideWnd();
        let  wnd : WelfareFrame = WngMrg.getInstance().getWindow("WelfareFrame")
        wnd.showWndWithTabName(2)
    }
}