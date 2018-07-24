// TypeScript file
class GlobalMiningTeamFrame extends BaseWnd {
    contrlDataTable: any

    public initObj(...params: any[]) {
        this.contrlDataTable = {}
        this.mLayoutPaths = ["resource/layouts/activity/global/globalmining/GlobalMiningTeamLayout.exml"]
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
            { ["name"]: "pick_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickOk },

            { ["name"]: "cancel_btn", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickLeaveTeam },
            { ["name"]: "call_btn",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCall },
            { ["name"]: "team_tick1", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickKick },
            { ["name"]: "team_tick2", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickKick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.mElemList["label_wndName"].text = Localize_cns("GLOBAL_MINING_TXT20")
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

        // RpcProxy.call("C2G_MineActTeamDetailInfo")
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
    }

    refreshFrame() {
        let act = GetActivity(ActivityDefine.GlobalMining)
        let detailInfo = act.getActTeamDetailInfo()

        //检查有没有队伍
        if (detailInfo == null || detailInfo.members == null ||detailInfo.members.length == 1) {
            let v = detailInfo.members[0]
            if (v.captain != 1) {
                return this.hideWnd()
            }
        }

        let list = table_copy(detailInfo.members)
        table_sort(list, function(a, b) {return b.captain - a.captain})

        let isLeader = false
        this.contrlDataTable = {}
        this.contrlDataTable["call_btn"] = detailInfo.actTeamId
        for (let i = 0; i < 3; i++) {
            let v = list[i]
            if (v) {
                this.mElemList["team_group" + i].visible = true

                if (v.captain == 1 && v.plrId == GetHeroProperty("id")) {
                    isLeader = true
                }
                if (i == 0) {
                    this.mElemList["captain_icon"].visible = v.captain == 1
                }
                let imageName = GetActorImageName(v.vocation, v.sex)
                this.mElemList["team_icon" + i].source = imageName
                let imb = this.mElemList["hp_pro" + i]
                UiUtil.updateProgress(imb, v.hpPer, 100)
                this.mElemList["team_name" + i].text = v.name
                this.mElemList["team_level" + i].text = String.format(Localize_cns("GLOBAL_MINING_TXT37"), v.level)
                this.mElemList["team_force" + i].text = String.format(Localize_cns("GLOBAL_MINING_TXT26"), MakeLongNumberShort(v.force))

                if (this.mElemList["team_tick" + i]) {
                    this.mElemList["team_tick" + i].visible = isLeader

                    this.contrlDataTable["team_tick" + i] = v.plrId
                }
            } else {
                this.mElemList["team_group" + i].visible = false
            }
        }

        this.mElemList["edit_input"].text = tostring(detailInfo.needForce)

        this.mElemList["edit_input"].enabled = isLeader
        this.mElemList["pick_btn"].enabled = isLeader
        this.mElemList["call_btn"].enabled = isLeader
    }

    updateWnd() {
        if (this.isVisible() == false) {
            this.showWnd()
        } else if(this.isLoadComplete()){
            this.refreshFrame()
        }
    }

    /////////////////////////////////////////////////
    onClickKick(args) {        
        let name = args.target.name
        if (this.contrlDataTable[name] == null) {
            return
        }

        let id = this.contrlDataTable[name]
        RpcProxy.call("C2G_MineTickActTeamMember", id)
        //
    }

    onClickOk() {
        let content = this.mElemList["edit_input"].text
        if (content == null || content == "") {
            MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT30"))
            return
        }

        let num = tonumber(content, -1)
        if (num == null || num < 0) {
            MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT31"))
            return
        }

        RpcProxy.call("C2G_MineSetActTeamForce", num)
        // this.hideWnd()
    }
    
    onClickLeaveTeam(args) {
        RpcProxy.call("C2G_MineLeaveActTeam")
    }

    onClickCall(args) {
        let name = args.target.name
        if (this.contrlDataTable[name] == null) {
            return
        }

        let id = this.contrlDataTable[name]

        // let txt = String.format(Localize_cns("GLOBAL_MINING_TXT41"), GetHeroProperty("name"), XmlConverter.LinkSign + 110 + ";" + id + ";" + 1 + ";" + Localize_cns("GLOBAL_MINING_TXT42") + XmlConverter.LinkSign)
        // ChannelHyperlinkMrg.getInstance().sendHyperLinkMessage(txt)
        RpcProxy.call("C2G_MineRecruitMember")
    }
    
    ////////////////////////////////////////////////////////////////////
}