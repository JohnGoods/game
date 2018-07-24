// TypeScript file
class FightPrizePrevieWindow extends BaseCtrlWnd {
    controlDataTable: any;
    name: string;
    bShowStar: boolean;

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.name = params[2] || ""
        this.bShowStar = checkNull(params[3], true)
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        UiUtil.initElemWithSkinPath(this.name + "prize", this.mParentWnd.mLayoutPaths[1], this.mLayoutNode, this.mElemList, this, this.mElemList["prize_preview_group"])

        // var elemInfo = [
		// 	{["name"]: "btn_captrue",     ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCaptrue },
            
		// ]
		// UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)

        this.mElemList[this.name + "prize" + "title_rd"].setAlignFlag(gui.Flag.H_CENTER)
        // this.mElemList["campBoss_fight_view"] = UIActorView.newObj(this.mLayoutNode, name + "_icon", 90, 150, this.mElemList[name + "_iconGroup"])
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
		// RegisterEvent(EventDefine.COMBAT_FIGHT_ROUND_UPDATE, this.onFightRoundUpdate, this)

        this.mElemList["prize_preview_group"].visible = true
        this.mElemList[this.name + "prize"].visible = true
        // this.mElemList["campBoss_fight_view"].updateByOnceEffect()
        this.onRefresh()

        if (this.bShowStar == true) {
            this.mParentWnd.showStarAnim()
        }
    }

    public onHide(): void {
		// UnRegisterEvent(EventDefine.COMBAT_FIGHT_ROUND_UPDATE, this.onFightRoundUpdate, this)

        this.mElemList["prize_preview_group"].visible = false
        this.mElemList[this.name + "prize"].visible = false
        // this.mElemList["campBoss_fight_view"].clearView()
    }

    onRefresh() {
        let titleTips = []                      //[标题 奖励说明]
        let [fightType, index] = FightSystem.getInstance().getCurFightType()
        titleTips = this.getTitleTips(fightType, index)

        AddRdContent(this.mElemList[this.name + "prize" + "title_rd"], checkNull(titleTips[0], ""), "ht_20_cc_stroke", "white")
        AddRdContent(this.mElemList[this.name + "prize" + "tips_rd"], checkNull(titleTips[1], ""), "ht_20_cc_stroke", "orange")
    }

    getTitleTips(fightType, index) {

        if(fightType == opFightResultType.CAMPAGINBOSS || fightType == opFightResultType.CAMPAGIN){
            let campName = CampaignSystem.getInstance().getCampaignName(index)
            let prizeTips = Localize_cns("CAMPAIGN_TXT15")
            return [campName, prizeTips]
        }

        let actList = GameConfig.FightPrizePreviewConfig[fightType]
        if (actList) {
            let config = actList[index]
            if (config) {
                return [config.actName, config.prizeTips]
            } else {
                let defaultConfig = actList[0]
                if (defaultConfig) {
                    return [defaultConfig.actName, defaultConfig.prizeTips]
                }
            }
        } else {

        }

        return ["", ""]
    }

    ////////////////////////////////////////////////
}