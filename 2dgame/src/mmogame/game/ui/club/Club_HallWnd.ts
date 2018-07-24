// TypeScript file
class Club_HallWnd extends BaseCtrlWnd {
    mElemList;

    public initObj(...params: any[]) {

    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList

        var elemInfo = [
            //{ ["name"]: "notice_change_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.changeNotice },
            //{ ["name"]: "event_record_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.eventRecord },
            { ["name"]: "apply_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.applyClcked },
            { ["name"]: "juanxian_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.juanxianClicked },
            { ["name"]: "people_info_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.peopleInfoClicked },
            { ["name"]: "club_store_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.showClubStore },
            { ["name"]: "activity_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.activityClicked },
            { ["name"]: "shop_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.shopClicked },
            { ["name"]: "map_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.mapClicked },
            { ["name"]: "club_war_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.clubWarClicked },

            { ["name"]: "btn_change", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.clubChangeClicked },
            { ["name"]: "btn_zhao", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.clubZhaoClicked },
        ]
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        //this.mElemList["notice_change_btn"].visible = false

        this.mElemList["event_record_link"] = UILinkView.newObj(this.mLayoutNode, "event_record_link", 0, 0, this.mElemList["event_record"])
        this.mElemList["event_record_link"].setContent(Localize_cns("CLUB_TXT112"))
        this.mElemList["event_record_link"].setCallBack(this.eventRecord, this)

        this.mElemList["notice_change_link"] = UILinkView.newObj(this.mLayoutNode, "notice_change_link", 0, 0, this.mElemList["notice_change"])
        this.mElemList["notice_change_link"].setContent(Localize_cns("CLUB_TXT22"))
        this.mElemList["notice_change_link"].setCallBack(this.changeNotice, this)

        this.mElemList["club_list_link"] = UILinkView.newObj(this.mLayoutNode, "notice_change_link", 0, 0, this.mElemList["club_list_bg"])
        this.mElemList["club_list_link"].setContent(Localize_cns("CLUB_TXT21"))
        this.mElemList["club_list_link"].setCallBack(this.clubListClicked, this)

        this.mElemList["notice_change_link"].setVisible(false)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.GET_CLUB_INFO, this.refreshFrame, this)
        RegisterEvent(EventDefine.UPDATE_CLUB_NOTICE, this.refreshNotice, this)
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        RegisterEvent(EventDefine.CLUB_RENQI_INFO, this.refreshFrame, this)
        this.mElemList["group1"].visible = true
        this.mElemList["title"].text = Localize_cns("CLUB_TXT4")
        this.mElemList["btn_tips"].visible = true

        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.GET_CLUB_INFO, this.refreshFrame, this)
        UnRegisterEvent(EventDefine.UPDATE_CLUB_NOTICE, this.refreshNotice, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        UnRegisterEvent(EventDefine.CLUB_RENQI_INFO, this.refreshFrame, this)
        this.mElemList["group1"].visible = false
        this.mElemList["btn_tips"].visible = false
    }

    refreshFrame() {
        let clubInfo = ClubSystem.getInstance().getCurClubInfo()
        if (clubInfo == null) {
            return
        }

        let power = ClubSystem.getInstance().isHaveClubJurisdiction()
        //this.mElemList["notice_change_btn"].visible = power
        this.mElemList["notice_change_link"].setVisible(power)

        let bangzhu_name = clubInfo.leader
        this.mElemList["bangzhu_name"].text = String.format(Localize_cns("CLUB_TXT14"), bangzhu_name)
        let zijinNum = clubInfo.exp	//资金
        let needZiJin = ClubSystem.getInstance().getClubZiJinLimit()
        this.mElemList["zijin"].text = String.format(Localize_cns("CLUB_TXT16"), zijinNum, needZiJin)
        let clubLevle = clubInfo.level
        this.mElemList["level"].text = String.format(Localize_cns("CLUB_TXT17"), clubLevle)

        let mingzi_text = clubInfo.name
        this.mElemList["mingci_text"].text = mingzi_text

        let renshu_num = clubInfo.menberCount
        let renshu_limit = ClubSystem.getInstance().getClubRenShuLimit()
        this.mElemList["renshu_num_text"].text = renshu_num + "/" + renshu_limit

        let notice_text = clubInfo.notice
        AddRdContent(this.mElemList["notice_rd"], "#br" + notice_text, "ht_24_cc", "saddlebrown", 3)
    }

    //更新公告用
    refreshNotice() {
        let notice_text = ClubSystem.getInstance().getNotice()
        AddRdContent(this.mElemList["notice_rd"], "#br" + notice_text, "ht_24_cc", "saddlebrown", 3)
    }

    changeNotice() {
        WngMrg.getInstance().showWindow("ClubChangeNoticeFrame");
    }

    eventRecord() {
        WngMrg.getInstance().showWindow("ClubEventRecordFrame");
    }

    applyClcked() {
        let power = ClubSystem.getInstance().isHaveClubJurisdiction()
        if (power) {
            WngMrg.getInstance().showWindow("ClubPeopleApplyFrame");
        } else {
            MsgSystem.addTagTips(Localize_cns("CLUB_TXT42"))
        }
    }

    juanxianClicked() {
        WngMrg.getInstance().showWindow("ClubDonateFrame");
    }

    peopleInfoClicked() {
        WngMrg.getInstance().showWindow("ClubPeopleInfoFrame");
    }

    clubListClicked() {
        let wnd = WngMrg.getInstance().getWindow("ClubListFrame")
        wnd.showAndSetData();
    }

    activityClicked() {
        WngMrg.getInstance().showWindow("ClubActiveFrame");
    }

    shopClicked() {
        let wnd = WngMrg.getInstance().getWindow("ShopEquipFrame");
        wnd.showWithIndex(2);
    }

    mapClicked() {
        let a = GetActivity(ActivityDefine.ClubMap)
        a.requestStart()
    }

    clubWarClicked() {
        MsgSystem.addTagTips(Localize_cns("CLUB_TXT57"))
        //WngMrg.getInstance().showWindow("ClubWarFrame");
    }

    //帮派改名
    clubChangeClicked() {
        let power = ClubSystem.getInstance().isHaveClubJurisdiction()
        if (power) {
            WngMrg.getInstance().showWindow("ClubChangeNameFrame")
        } else {
            MsgSystem.addTagTips(Localize_cns("CLUB_TXT42"))
        }
    }

    //招人
    clubZhaoClicked() {
        let power = ClubSystem.getInstance().isHaveClubJurisdiction()
        if (power) {
            // let clubInfo = ClubSystem.getInstance().getCurClubInfo()
            // let str = String.format(Localize_cns("CLUB_TXT100"), clubInfo.name, XmlConverter.LinkSign, GetHeroProperty("id"), clubInfo.id, XmlConverter.LinkSign)

            // let message = GetMessage(opCodes.C2G_CHANNEL_SEND)
            // message.channel = channelType.WORLD
            // message.data = str
            // SendGameMessage(message)
            this.sendHyperLinkText()
        } else {
            MsgSystem.addTagTips(Localize_cns("CLUB_TXT42"))
        }
    }

    showClubStore() {
        WngMrg.getInstance().showWindow("ClubStoreFrame")
    }

    sendHyperLinkText(){
        let clubInfo = ClubSystem.getInstance().getCurClubInfo()
        let str =  GameConfig.HyperLinkConfig[channelOption.C_CLUB_APPLY].des
        if(str){
             let myId = GetHeroProperty("id")
             let targetId = clubInfo.id
             let hyperLinkText = String.format(str,clubInfo.name,XmlConverter.LinkSign, myId, targetId, XmlConverter.LinkSign)
             ChannelHyperlinkMrg.getInstance().sendHyperLinkMessage(hyperLinkText)
        }
    }

    //红点提示
    refreshClubDotTips() {
        //帮会福利商店可购买
        if (GuideFuncSystem.getInstance().checkShopUnlock(19)) {
			this.mParentWnd.createDotTipsUI(this.mElemList["shop_btn"])
		}
        //帮会地图任务完成未领奖
        for (let i in opFactionMapTaskType) {
			let taskType = opFactionMapTaskType[i]
			if (GuideFuncSystem.getInstance().checkClubTaskFinish(taskType)) {
				this.mParentWnd.createDotTipsUI(this.mElemList["map_btn"])
                break
			}
		}
        //帮会地图可兑换
        for (let i = 0; i < 4; i++) {
			if (GuideFuncSystem.getInstance().checkClubExchange(i)) {
                this.mParentWnd.createDotTipsUI(this.mElemList["map_btn"])
				break
			}
		}
        //帮会活跃可升级
        if (GuideFuncSystem.getInstance().checkClubActiveUpgrade()) {
            this.mParentWnd.createDotTipsUI(this.mElemList["activity_btn"])
		}
        //帮会活跃每日奖励达成未领取
        for (let i in GameConfig.FactionActiveDailyiPrizeConfig) {
			if (GuideFuncSystem.getInstance().checkClubActivePrize(i)) {
				this.mParentWnd.createDotTipsUI(this.mElemList["activity_btn"])
                break
			}
		}
        //帮会捐献有天工木
        if (GuideFuncSystem.getInstance().checkClubDonate()) {
			this.mParentWnd.createDotTipsUI(this.mElemList["juanxian_btn"])
		}
        //帮会有人申请进入
        if (GuideFuncSystem.getInstance().checkClubApply()) {
			this.mParentWnd.createDotTipsUI(this.mElemList["apply_btn"])
		}
    }
}