// TypeScript file
class ShareSystem extends BaseSystem {
    mShowInviteBtn:boolean = false
    mAttentionStatus:number = core.GameSdk.NOT_SUPPORT_ATTENTION
    mHeroEnter:boolean = false
    mBtnList:any
    public initObj(...args: any[]): void {
        RegisterEvent(EventDefine.HERO_ENTER_GAME, this.onHeroEnterGame, this)
        //RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.checkShareStatus, this)
        
        IGlobal.gameSdk.addEventListener(core.GameSdk.SHARE_STATUS_CHANGE, this.checkShareStatus, this)
        IGlobal.gameSdk.addEventListener(core.GameSdk.SHARE_RETURN, this.onClientShareReturn, this)
        IGlobal.gameSdk.addEventListener(core.GameSdk.ATTENTION_STATUS_CHANGE, this.checkAttentionStatus, this)
        
        this.mShowInviteBtn = (IGlobal.gameSdk.canInvite())
        this.mAttentionStatus = (IGlobal.gameSdk.getAttentionStatus())

        this.mBtnList = [//主界面
            { index:1000, name: "share", image: "zjm_Bt48" , check:this._onCheckShare, func: this._onClickShare},//分享
            { index:1001, name: "attention", image: "zjm_Bt47" , check:this._onCheckAttention, func: this._onClickAttention},//关注
        ]
    }
			//{ index: -1, image: "zjm_Bt29", check: this.checkBag, func: this.bagClick, name: "dynamic_beibao" },//背包
			//{ index: -2, image: "zjm_Bt36", check: this.daily, func: this.dailyClick, name: "dynamic_richang" },//日常 
    destory() {

    }

    prepareResource(workQueue) {

    }

    onClear() {

    }
    
    getBtnList(){
        return this.mBtnList
    }

    _onCheckAttention(){
        return ShareSystem.getInstance().onCheckAttention()
    }

    _onCheckShare(){
        return ShareSystem.getInstance().onCheckShare()
    }

    _onClickAttention(){
        ShareSystem.getInstance().onClickAttention()
    }

    _onClickShare(){
        ShareSystem.getInstance().onClickShare()
    }

    onCheckAttention(){
        if (this.mHeroEnter != true){
            return false
        }

        if (this.mAttentionStatus != core.GameSdk.NOT_ATTENTION){
            return false
        }

        let attentionprize = getSaveRecord("h5Attention")
        if (attentionprize != null && attentionprize == 1){//已经关注了。返回 false不显示关注按钮
            return false
        } 
        return true
    }

    onCheckShare(){
        return this.mShowInviteBtn && this.mHeroEnter
    }

    onClickAttention(){
        IGlobal.gameSdk.callShowAttention("");
    }

    onClickShare(){
        IGlobal.gameSdk.callShowShare("")
		let wnd = WngMrg.getInstance().getWindow("ActivityShareFrame")
		wnd.showWnd()
    }

    onHeroEnterGame(args){
        TLog.Debug("ShareSystem.onHeroEnterGame")
        this.refreshInviteAttentionStatus()
        this.mHeroEnter = true;
    }

    refreshInviteAttentionStatus(){
        TLog.Debug("ShareSystem.refreshInviteAttentionStatus", this.mShowInviteBtn, this.mAttentionStatus)
        //this.setInviteBtnVisible(this.mShowInviteBtn);
        //let show = (this.mAttentionStatus == core.GameSdk.NOT_ATTENTION)
        //this.setAttentionBtnVisible(show)
        //let attentionprize2 = getSaveRecord("h5Attention") || 0
        FireEvent(EventDefine.SHARE_SYS_UPDATE, null)
        if (this.mAttentionStatus == core.GameSdk.AREADY_ATTENTION){
            let attentionprize = getSaveRecord("h5Attention")
            if (attentionprize == null || attentionprize != 1){
                RpcProxy.call("C2G_PLAT_DAILY_SHARE","h5Attention")
            }
        }
    }

    onClientShareReturn(args){
        TLog.Debug("ShareSystem.onClientShareReturn")
        RpcProxy.call("C2G_PLAT_DAILY_SHARE","h5DailyShare")
    }
    
    checkAttentionStatus(args){
        let value = IGlobal.gameSdk.getAttentionStatus()
        this.mAttentionStatus = value
        TLog.Debug("ShareSystem.checkAttentionStatus", this.mAttentionStatus)
        if (this.mHeroEnter){
            this.refreshInviteAttentionStatus()
        }
        //let show = (value == core.GameSdk.NOT_ATTENTION)
        //this.setInviteBtnVisible(show)       
    }

    checkShareStatus(args){
        let support = IGlobal.gameSdk.canInvite()
        this.mShowInviteBtn = support
        TLog.Debug("ShareSystem.checkShareStatus", this.mShowInviteBtn)
        if (this.mHeroEnter){
            this.refreshInviteAttentionStatus()
        }
        //this.setInviteBtnVisible(support)
        //let shareinfo = getSaveRecord("h5DailyShare")
        //let showcd = false
        //let count = 0//今天已经分享了多少次
        //if (shareinfo != null){
        //    let curtime = GetServerTime()
        //    if (curtime < shareinfo[0]){
        //        showcd = true
        //    }
        //    count = shareinfo[1]
        //}
    }

    /*setInviteBtnVisible(show:boolean){
        TLog.Debug("ShareSystem.setInviteBtnVisible", show)
        //if (this.mShowInviteBtn == show){
        //    return
        //}
        //this.mShowInviteBtn = show
        let wnd:MainFrame = WngMrg.getInstance().getWindow("MainFrame");
        //wnd.setShowInviteBtn(show)
    }

    setAttentionBtnVisible(show:boolean){
        TLog.Debug("ShareSystem.setAttentionBtnVisible", show)

        let wnd:MainFrame = WngMrg.getInstance().getWindow("MainFrame");
        //wnd.setShowAttentionBtn(show)
    }    */
}
