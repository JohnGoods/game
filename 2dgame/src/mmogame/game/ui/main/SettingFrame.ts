// TypeScript file

class SettingFrame extends BaseWnd {

    serverTimer:number

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/SettingLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        //this.setFullScreen(true)
        this.initSkinElemList();
        this.setAlignCenter(true, true)

        var elemInfo = [
            { ["name"]: "label_title", ["title"]: Localize_cns("PALYER_DETAILS_TXT3"), ["event_name"]: null, ["fun_index"]: null },
            { ["name"]: "label_music", ["title"]: Localize_cns("SETTING_TXT1"), ["event_name"]: null, ["fun_index"]: null },
            { ["name"]: "label_effect", ["title"]: Localize_cns("SETTING_TXT2"), ["event_name"]: null, ["fun_index"]: null },
            { ["name"]: "label_player", ["title"]: Localize_cns("SETTING_TXT3"), ["event_name"]: null, ["fun_index"]: null },


            { ["name"]: "check_music", ["title"]: null, ["event_name"]: egret.Event.CHANGE, ["fun_index"]: this.onMusicCheck },
            { ["name"]: "check_effect", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSoundCheck },
            { ["name"]: "check_player", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onHidePlayerCheck },

            { ["name"]: "btn_relogin", ["title"]: Localize_cns("SETTING_RETURN_LOGIN"), ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onReturnLogin },
            //{ ["name"]: "btn_handbook", ["title"]: Localize_cns("HANDBOOK_TEXT3"), ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickHandbook },

            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.LOGIN_GUEST_BIND_STATE_UPDATE, this.refreshUI, this)
        RegisterEvent(EventDefine.SERVER_APPLY_STATUS, this.refreshUI, this)
        //RegisterEvent(SdkFunctionDefine.FBShare, this.onShareReturn, this)
        this.refreshUI()
        this.SetSeverTime()
        this.mLayoutNode.visible = true;
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.LOGIN_GUEST_BIND_STATE_UPDATE, this.refreshUI, this)
        UnRegisterEvent(EventDefine.SERVER_APPLY_STATUS, this.refreshUI, this)
        //UnRegisterEvent(SdkFunctionDefine.FBShare, this.onShareReturn, this)
        this.mLayoutNode.visible = false;

        this.resetTimer()
    }



    refreshUI() {
        let bCheck = GameSound.getInstance().getMusicStatus()
        this.mElemList["check_music"].selected = (bCheck)
        //this.mElemList["music_mark"].visible = (false)


        bCheck = GameSound.getInstance().getEffectStatus()
        this.mElemList["check_effect"].selected = (bCheck)
        //this.mElemList["sound_mark"].visible = (false)

        bCheck = ActorManager.getInstance().getShowPlayerStatus()
        this.mElemList["check_player"].selected = (!bCheck)
        //this.mElemList["hideplayer_mark"].visible = (false)

        //let bCheck = GameSound.getInstance().getAutoVoicStatus()	
        //this.mElemList["autoVoice"]:SetCheck(bCheck)
        //
        //
        //刷新屏蔽申请
        //let status = FriendSystem.getInstance().getApplyStatue() 
        //if(status == 0 ){
        //	this.mElemList["refusefriend"]:SetCheck(false)
        //}else{
        //	this.mElemList["refusefriend"]:SetCheck(true)
        //}



        //隐藏所有按钮
        //this.hideAllBtn()
        //this.showBtnList = {}
        //判断需要显示哪些按钮，逐个加入this.showBtnList
        //JsUtil.arrayInstert(this.showBtnList,showBtnList["return_login"])

        //JsUtil.arrayInstert(this.showBtnList,showBtnList["update"])	
        //let showService = SdkHelper.getInstance().getStringConfigDef("ShowOfficialUrl", "1")
        //if(false && showService != "0" && ! GAME_FRESH == true ){
        //	JsUtil.arrayInstert(this.showBtnList,showBtnList["offical_web"])
        //}
        //JsUtil.arrayInstert(this.showBtnList,showBtnList["return_login"])
        ////如果是可以绑定，但是还没绑定的，就显示绑定按钮
        //if(! LoginSystem.getInstance().isBindAccount() ){
        //	JsUtil.arrayInstert(this.showBtnList,showBtnList["roleBingAccount"])
        //}
        //JsUtil.arrayInstert(this.showBtnList,showBtnList["noticeConfig"])
        //let showService = SdkHelper.getInstance().getStringConfigDef("ShowServiceInSetting", "0")
        //if(showService != "0" ){
        //	JsUtil.arrayInstert(this.showBtnList,showBtnList["showService"])
        //}
        //判断需要显示哪些按钮 }
        //排序按钮 根据index
        //function sortFunc(a,b){
        //	return a.index > b.index
        //}
        //table_sort(this.showBtnList,sortFunc)
        ////排序按钮 }
        //for(let i = 1; i <=  this.showBtnList.length,1;i++){
        //	let info = this.showBtnList[i]
        //	let btn = this.mElemList["btn"..i]
        //	let btnName = Localize_cns(info.btnName)
        //	btn.text = (btnName)
        //	btn.visible = (true)
        //}
    }

    //hideAllBtn( args){
    //	for(let i = 1; i <=  6 , 1;i++){
    //		let btn = this.mElemList["btn"..i]
    //		if(btn ){
    //			btn.visible = (false)
    //		}
    //	}	
    //}

    onMusicCheck(args:egret.Event) {
        let btn:eui.ToggleButton = args.target;
        
        GameSound.getInstance().setMusicStatus(btn.selected)
    }
    //
    onSoundCheck(args:egret.Event) {
        let btn:eui.ToggleButton = args.target;
        GameSound.getInstance().setEffectStatus(btn.selected)
    }
    //
    onHidePlayerCheck(args:egret.Event) {
        let btn:eui.ToggleButton = args.target;
       
        ActorManager.getInstance().setShowPlayerStatus(!btn.selected)
    }
    //
    // onRefuseFriendCheck(args) {
    //     let check = this.mElemList["refusefriend"]:GetCheck()
    //     //Config.getInstance().setRoleSetting("bool","refusefriend",check)
    //     let setStatus = 0
    //     if (check) {
    //         setStatus = 1
    //     }
    //     let getStatus = FriendSystem.getInstance().getApplyStatue()
    //     if (getStatus != setStatus) {
    //         FriendSystem.getInstance().setMsgToSetApplyStatue(setStatus)
    //     }
    // }

    onReturnLogin(args) {
        ConfirmRetryLogin(Localize_cns("RETURN_LOGIN_CONFIRM"), false)
    }

    onClickHandbook(args) {
        WngMrg.getInstance().showWindow("HandbookFrame")
    }

    SetSeverTime() {
        function TimeRun() {
            let time1 = GetServerTime()
            let text = getFormatTimeSec(time1)
            this.mElemList["severTime"].text = (Localize_cns("SETTING_SERVER_TIME")+"  "+text)
        }
        if (!this.serverTimer) {
            this.serverTimer = SetTimer(TimeRun, this, 1000, true)//延时3秒，为了可以正常加载地图
        }
    }

    resetTimer() {
        if (this.serverTimer) {
            KillTimer(this.serverTimer)
            this.serverTimer = null
        }
    }

    onUpdateCheck( args){
        let wnd = WngMrg.getInstance().getWindow("UpdateNoticeFrame")
        wnd.showWnd()
    }
}