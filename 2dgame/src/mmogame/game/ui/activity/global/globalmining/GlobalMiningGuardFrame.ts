// TypeScript file
class GlobalMiningGuardFrame extends BaseWnd {
    miningRobotId: number
    contrlDatatList: any;
    mineId: any;

    public initObj(...params: any[]) {
        this.miningRobotId = -1
        this.contrlDatatList = {}
        this.mLayoutPaths = ["resource/layouts/activity/global/globalmining/GlobalMiningGuardLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        // this.setFullScreen(true)
        this.initSkinElemList();
        this.setAlignCenter(true, true);

        var elemInfo = [
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "hp_pro0",  ["image"]: "kfzb_xueTiaoDi01", ["thumbImage"]: "kfzb_xueTiao01", ["title"]: null, ["font"]: "ht_18_cc_stroke", ["color"]: gui.Color.white, },
            { ["name"]: "hp_pro1",  ["image"]: "kfzb_xueTiaoDi01", ["thumbImage"]: "kfzb_xueTiao01", ["title"]: null, ["font"]: "ht_18_cc_stroke", ["color"]: gui.Color.white, },
            { ["name"]: "hp_pro2",  ["image"]: "kfzb_xueTiaoDi01", ["thumbImage"]: "kfzb_xueTiao01", ["title"]: null, ["font"]: "ht_18_cc_stroke", ["color"]: gui.Color.white, },
             
            { ["name"]: "fight_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFight },
            { ["name"]: "cancel_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["label_wndName"].text = Localize_cns("GLOBAL_MINING_TXT13")
        for (let i = 0; i < 3; i++) {
            let imb = this.mElemList["hp_pro" + i]
            UiUtil.updateProgress(imb, 50, 100)
        }
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.refreshFrame();
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
        this.mineId = null
    }

    refreshFrame() {
        let act = GetActivity(ActivityDefine.GlobalMining)
        let robot = act.getMiningRobot(this.miningRobotId)
        this.contrlDatatList = {}
        
        if (robot == null) {
            this.mElemList["team_group0"].visible = false
            this.mElemList["team_group1"].visible = false
            this.mElemList["team_group2"].visible = false
            
            this.mElemList["cancel_btn"].enabled = false
            this.mElemList["fight_btn"].enabled = false
        } else {
            this.mElemList["cancel_btn"].enabled = true
            this.mElemList["fight_btn"].enabled = true

            let info = robot.getMiningInfo()

            this.contrlDatatList["fight_btn"] = info.mineIndex
            let members = table_copy(info.members)
            table_sort(members, function(a, b) {return b.captain - a.captain})
            for (let i = 0; i < 3; i++) {
                let v = members[i]
                if (v) {
                    this.mElemList["team_group" + i].visible = true

                    let imageName = GetActorImageName(v.vocation, v.sex)
                    this.mElemList["team_icon" + i].source = imageName
                    let imb = this.mElemList["hp_pro" + i]
                    UiUtil.updateProgress(imb, v.hpPer, 100)
                    this.mElemList["team_name" + i].text = v.name
                    this.mElemList["team_level" + i].text = String.format(Localize_cns("GLOBAL_MINING_TXT37"), v.level)
                    this.mElemList["team_force" + i].text = String.format(Localize_cns("GLOBAL_MINING_TXT26"), MakeLongNumberShort(v.force))

                    //队长标识
                    if (i == 0 && v.captain != 1) {
                        this.mElemList["team_leader_icon"].visible = false
                        this.mElemList["team_leader_tl"].visible = false
                    } else {
                        this.mElemList["team_leader_icon"].visible = true
                        this.mElemList["team_leader_tl"].visible = true
                    }
                } else {
                    this.mElemList["team_group" + i].visible = false
                }
            }
        }
    }

    /////////////////////////////////////////////////
    onClickFight(args) {
        GetActivity(ActivityDefine.GlobalMining).genEnterMineTicker(this.mineId)
        FireEvent(EventDefine.MSG_WAIT_BEGIN, null)
    }

    ////////////////////////////////////////////////////////
    showMiningGuardFrame(miningRobotId, mineId) {
        this.miningRobotId = miningRobotId
        this.mineId = mineId
        this.showWnd()
        this.doCommand("refreshFrame")
    }
}