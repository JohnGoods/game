// TypeScript file
class ActivityShareFrame extends BaseWnd {
    isShow: any;
    isget: any;
    yuekaInfo: any;
    times: any;
    itemList: any;
    cdtimerid:number;
    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/active/ActivityShareLayout.exml"]
        this.isShow = false
        this.cdtimerid = null
    }

    public onLoad(): void {
        this.createFrame()
    }

    public onUnLoad(): void {
        this.isShow = false
    }

    public createFrame():void{
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreenRaw(true)
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickClose },
            //{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickClose },
            { ["name"]: "group_bg", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBg },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
        let info = GameConfig.DailyShareConfig['h5DailyShare']
        let itemlist = info.reward
        
        let list = AnalyPrizeFormat(info.reward)
        for (let i = 0; i < 3; i++) {
            let iteminfo = list[i]
            if (iteminfo != null){
                let itembox:UIItemBox = UIItemBox.newObj(this, "itembox"+i, 0, 0, this.mElemList["group_"+i])
                itembox.updateByEntry(iteminfo[0], iteminfo[1], iteminfo[2])
                this.mElemList['itembox'+ i] = itembox
            }
        }

        
        this.mElemList["group_sign"].visible = (false)
    }
    onClickClose(args){
        this.hideWnd()
    }

    onClickBg(args){
        this.hideWnd()
    }
    
    public onShow(): void {
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        this.mLayoutNode.visible = true;

        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
        this.mLayoutNode.visible = false;
        this.killCDTimer()
    }

    refreshFrame() {
        let shareinfo = getSaveRecord("h5DailyShare")
        let showcd = false
        let count = 0//今天已经分享了多少次
        if (shareinfo != null){
            let curtime = GetServerTime()
            if (curtime < shareinfo[0]){
                showcd = true
            }
            count = shareinfo[1]
        }
        this.mElemList["group_cd"].visible = (showcd)
        if (showcd){
            this.setupCDTimer()
        }


        //if (count > 0){
        //    AddRdContent(this.mElemList["title"], String.format(Localize_cns("SHARE_TO_WX_GAIN_TIMES"), count), "ht_22_cc_stroke", "white")
        //}else{
        //    AddRdContent(this.mElemList["title"], Localize_cns("SHARE_TO_WX_GAIN"), "ht_22_cc_stroke", "white")     
        //}

    }
    //时间倒数//
    onCDTimeTick(delay){
        TLog.Debug("onCDTimeTick")
        let shareinfo = getSaveRecord("h5DailyShare")
        let curtime = GetServerTime()
        let showcd = false
        if (shareinfo != null){
            let curtime = GetServerTime()
            if (curtime < shareinfo[0]){
                showcd = true
                let lefttime = shareinfo[0] - curtime
                let t = simple_transform_time(lefttime)
                let time1 = t.hours + ":" + t.mins +":" +t.secs
                this.mElemList["cd_time"].text = (time1)                
            }
        }
        this.mElemList["group_cd"].visible = (showcd)
        if (!showcd){
            this.killCDTimer()
        }
    }

    //启动倒数//
    setupCDTimer(){
        TLog.Debug("setupReviveTimer")
        if(this.cdtimerid ){
            return
        }
        this.cdtimerid = SetTimer(this.onCDTimeTick, this, 1000, true)
    }

    //取消倒数//
    killCDTimer(){
        TLog.Debug("this.reviveTime")
        if(this.cdtimerid ){
            KillTimer(this.cdtimerid)
            this.cdtimerid = null
        }
    }
}