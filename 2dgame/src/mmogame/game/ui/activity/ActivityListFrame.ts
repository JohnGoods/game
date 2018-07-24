// TypeScript file
class ActivityListFrame extends BaseWnd {
    scroll: UIScrollList;
    activityInfoList: any[];
    activityDataList: any;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/active/ActivityListLayout.exml"]

        this.activityDataList = {}
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreen(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let group = <eui.Group>this.mElemList["scroll_wnd"]
        this.mElemList["scroll"] = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
        this.scroll = this.mElemList["scroll"]

        this.activityInfoList = [
            //帮会入侵
            { ["index"]: OrdinaryActivityIndex.FactionMonster, ["bgpic"]: "hd_huoDongIcon01", ["progress"]: true, ["refresh"]: this.refreshRuQin, ["func"]: this.enterRuQin, ["dot"]: this.refreshRuQinDotTips },
            //西游护送
            { ["index"]: OrdinaryActivityIndex.HUSONG, ["bgpic"]: "hd_huoDongIcon02", ["progress"]: false, ["prize"]: [60055, 60006, 20016], ["refresh"]: this.refreshHuSong, ["openIcon"]: "hd_Bt01", ["openFunc"]: this.onOpenHuSongShop, ["func"]: this.enterHuSong, ["dot"]: this.refreshHuSongDoubleTips },
            //答题比赛
            { ["index"]: OrdinaryActivityIndex.DATI, ["bgpic"]: "hd_huoDongIcon03", ["progress"]: false, ["prize"]: [60055, 60057, 60064], ["refresh"]: this.refreshDaTi, ["openIcon"]: "hd_Bt02", ["openFunc"]: this.onOpenDaTiShop, ["func"]: this.enterDaTi, ["dot"]: this.refreshDaTiDotTips },
            //跨服争霸
            { ["index"]: OrdinaryActivityIndex.ZHENGBA, ["bgpic"]: "hd_huoDongIcon04", ["progress"]: false, ["prize"]: [60057, 60065, 60066], ["refresh"]: this.refreshMining, ["openIcon"]: "hd_Bt03", ["openFunc"]: this.onOpenMiningRank, ["func"]: this.enterMining, ["dot"]: this.refreshDaTiDotTips, ["explain"]: "GlobalMine"},

            //武林大会
            { ["index"]: OrdinaryActivityIndex.WuLin, ["bgpic"]: "hd_huoDongIcon05", ["progress"]: false, ["prize"]: [60016,60056,60002], ["refresh"]: this.refreshWulin, ["openIcon"]: "hd_Bt03", ["openFunc"]: this.onOpenWuLinMonthRank, ["func"]: this.enterWuLin, ["dot"]: this.refreshDaTiDotTips, ["explain"]: "wulinRule"},
            //天宫
            { ["index"]: OrdinaryActivityIndex.Stronghold, ["bgpic"]: "hd_huoDongIcon06", ["progress"]: false, ["prize"]: [60185,60186,60187], ["refresh"]: this.refreshTiangongBoss, ["func"]: this.enterTiangong, ["dot"]: this.refreshTiangongDotTips },
        ]
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.FactionMonster)
        this.updateWnd()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
    }

    refreshFrame() {
        let list = this.activityInfoList

        this.scroll.saveViewXY();
        //更新拥有
        for (let i = 0; i < size_t(list); i++) {
            let v = list[i]
            let [window, flag] = this.scroll.getItemWindow(i, 561, 187, 0, 0, 0)
            if (flag == true) {
                this.initItemWindow(window)
            }

            this.refreshItemWindow(window, v, i)
        }
        this.scroll.refreshScroll()
        this.scroll.restoreViewXY()
    }

    initItemWindow(window) {
        let name = window.name

        let ElemInfo = [
            { ["index_type"]: eui.Group, ["name"]: name + "_group", ["title"]: null, ["x"]: 0, ["y"]: 0, ["w"]: 561, ["h"]: 187 },
            { ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["parent"]: name + "_group", ["title"]: null, ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: 561, ["h"]: 187, ["messageFlag"]: true },
            { ["index_type"]: gui.RichDisplayer, ["name"]: name + "_des_rd", ["parent"]: name + "_group", ["x"]: 25, ["y"]: 50, ["w"]: 400, ["h"]: 60, ["messageFlag"]: true },
            { ["index_type"]: eui.Group, ["name"]: name + "_item_wnd", ["parent"]: name + "_group", ["x"]: 25, ["y"]: 108, ["w"]: 216, ["h"]: 72 },
            //商店和排行
            { ["index_type"]: gui.Button, ["name"]: name + "_open_btn", ["parent"]: name + "_group", ["title"]: null, ["image"]: "", ["x"]: 422, ["y"]: 25, ["w"]: 101, ["h"]: 88, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onOpenClick },
            //领取和前往
            { ["index_type"]: gui.Button, ["name"]: name + "_go_btn", ["parent"]: name + "_group", ["title"]: Localize_cns("ACTIVITY_GO"), ["font"]: "ht_24_cc_stroke", ["image"]: "ty_tongYongBt1", ["color"]: gui.Color.white, ["x"]: 399, ["y"]: 118, ["w"]: 147, ["h"]: 55, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTurnClick },
            //文字提示
            { ["index_type"]: eui.Label, ["name"]: name + "_tips_txt", ["parent"]: name + "_group", ["title"]: Localize_cns("ACTIVITY_TXT18"), ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.red, ["x"]: 325, ["y"]: 120, ["w"]: 200, ["h"]: 30, ["messageFlag"]: true},
            //双倍
            { ["index_type"]: gui.Button, ["name"]: name + "_double", ["parent"]: name + "_go_btn", ["image"]: "ty_shuangBeiTiShi", ["x"]: 0, ["y"]: 0, ["w"]: 40, ["h"]: 40, ["messageFlag"]: true },
            //生命百分比
            { ["index_type"]: gui.ProgressBar, ["name"]: name + "_imb", ["parent"]: name + "_group", ["title"]: "", ["font"]: null, ["image"]: "hd_loadingDi01", ["thumbImage"]: "hd_loading01", ["color"]: gui.Color.white, ["x"]: 145, ["y"]: 75, ["w"]: 195, ["h"]: 30 },
            { ["index_type"]: eui.Label, ["name"]: name + "_hp_percent", ["parent"]: name + "_imb", ["title"]: "", ["font"]: "ht_18_cc_stroke", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 195, ["h"]: 30, ["messageFlag"]: true },
            //说明
            { ["index_type"]: eui.Group, ["name"]: name + "_tips_wnd", ["parent"]: name + "_group", ["x"]: 245, ["y"]: 5, ["w"]: 100, ["h"]: 40, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRuleClick },
            // { ["index_type"]: gui.Grid9Image, ["name"]: name + "_tipsIcon", ["parent"]: name + "_tips_wnd", ["title"]: null, ["image"]: "zjm_hongDian01", ["x"]: 0, ["y"]: 0, ["w"]: 33, ["h"]: 40, ["messageFlag"]: true },
            { ["index_type"]: eui.Label, ["name"]: name + "_tipsLab", ["parent"]: name + "_tips_wnd", ["title"]: Localize_cns("NOTICE_TXT4"), ["font"]: "ht_22_cc_stroke", ["color"]: gui.Color.lime, ["x"]: 30, ["y"]: 5, ["w"]: 50, ["h"]: 25, },
            { ["index_type"]: eui.Rect, ["name"]: name + "_line", ["parent"]: name + "_tips_wnd", ["color"]: gui.Color.lime, ["x"]: 36, ["y"]: 30, ["w"]: 42, ["h"]: 2, ["messageFlag"]: true },
        ]

        UiUtil.createElem(ElemInfo, this.mLayoutNode, this.mElemList, this, window)

        for (let i = 0; i < 3; i++) {
            this.mElemList[name + "_itemBox_" + i] = UIItemBox.newObj(this.mLayoutNode, name + "_itemBox_" + i, 72 * i, 0, this.mElemList[name + "_item_wnd"], 0.9)
        }

        this.mElemList[name + "_imb"].visible = false
        this.mElemList[name + "_hp_percent"].visible = false
        this.mElemList[name + "_tips_wnd"].visible = false
        this.mElemList[name + "_open_btn"].visible = false

        this.mElemList[name + "_double"].visible = false
        this.mElemList[name + "_tips_txt"].visible = false
    }

    refreshItemWindow(window, data, index) {
        let name = window.name

        this.mElemList[name + "_bg"].source = data.bgpic

        if (data.openIcon && data.openFunc) {
            this.mElemList[name + "_open_btn"].source = data.openIcon
            this.mElemList[name + "_open_btn"].visible = true
        }

        if (data.explain) {
            this.mElemList[name + "_tips_wnd"].visible = true
        }

        if (data.progress) {
            this.mElemList[name + "_imb"].visible = true
            this.mElemList[name + "_hp_percent"].visible = true
        }

        //动态更新
        data.refresh.call(this, window, data)
    }

    //打开
    onOpenClick(event: egret.TouchEvent) {
        let name = event.target.name
        let index = name.replace(/[^0-9]/ig, "");
        let data = this.activityInfoList[index]
        if (data) {
            data.openFunc.call(this)
        }
    }

    //快速进入
    onTurnClick(event: egret.TouchEvent) {
        let name = event.target.name
        let index = name.replace(/[^0-9]/ig, "");
        let data = this.activityInfoList[index]
        if (data) {
            data.func.call(this)
        }
    }

    //玩法说明
    onRuleClick(event: egret.TouchEvent) {
        let name = event.target.name
        let index = name.replace(/[^0-9]/ig, "");
        let data = this.activityInfoList[index]
        if (data) {
            let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
            wnd.showWithActivity(data.explain)
        }
    }

    /////////更新数据//////////////////////////////////////////////////////////////////////
    updateWnd() {
        if (!this.isVisible()) {
            return
        }

        this.updateRuQin()
        this.updateHuSong()

        this.refreshFrame()

        this.refreshDotTips()
    }

    //帮会入侵
    updateRuQin() {
        let info = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.FactionMonster)
        this.activityDataList[OrdinaryActivityIndex.FactionMonster] = info
    }

    //更新西游护送次数
    updateHuSong() {
        let act = GetActivity(ActivityDefine.HuSong)
        let info = act.getActInfo()
        this.activityDataList[OrdinaryActivityIndex.HUSONG] = info
    }

    //更新答题
    updateDaTi() {
        this.activityDataList[OrdinaryActivityIndex.DATI] = {}
    }

    //////更新界面////////////////////////////////////////////////////////////
    refreshRuQin(window, data) {
        let name = window.name

        let clubInfo = ClubSystem.getInstance().getCurClubInfo() || {}
        let clubLv = clubInfo.level || 1

        //物品奖励
        let prizeList = AnalyPrizeFormat(GameConfig.FactionMonsterConfig[clubLv].prize)
        for (let i = 0; i < 3; i++) {
            if (prizeList[i]) {
                let itemId = prizeList[i][0]
                let itemCount = prizeList[i][1]
                this.mElemList[name + "_itemBox_" + i].updateByEntry(itemId)
            }
        }

        //更新活动时间
        let timeConfig = GameConfig.FactionMonsterConfig[clubLv].activeTime
        let timeSolt1 = timeConfig[0]
        let timeSolt2 = timeConfig[1]

        let serverTime = GetServerTime()

        let timeStart1 = GetTodayTime(serverTime, timeSolt1[0], timeSolt1[1])
        let timeEnd1 = GetTodayTime(serverTime, timeSolt1[2], timeSolt1[3])

        let timeStart2 = GetTodayTime(serverTime, timeSolt2[0], timeSolt2[1])
        let timeEnd2 = GetTodayTime(serverTime, timeSolt2[2], timeSolt2[3])

        let str = ""
        if (serverTime >= timeEnd1 && serverTime <= timeEnd2) {
            str = String.format(Localize_cns("ACTIVITY_TXT11"), timeSolt2[0] + ":" + String.format("%02d", timeSolt2[1]) + "~" + timeSolt2[2] + ":" + String.format("%02d", timeSolt2[3]))
        } else {
            str = String.format(Localize_cns("ACTIVITY_TXT11"), timeSolt1[0] + ":" + String.format("%02d", timeSolt1[1]) + "~" + timeSolt1[2] + ":" + String.format("%02d", timeSolt1[3]))
        }
        AddRdContent(this.mElemList[name + "_des_rd"], str, "ht_22_cc_stroke", "white", 6)

        //是否进帮
        this.mElemList[name + "_tips_txt"].visible = false
        this.mElemList[name + "_go_btn"].visible = true
        if (!ClubSystem.getInstance().isJoinClub()) {
            //this.mElemList[name + "_go_btn"].text = Localize_cns("CLUB_TXT110")
            this.mElemList[name + "_go_btn"].visible = false
            this.mElemList[name + "_tips_txt"].visible = true
            UiUtil.updateProgress(this.mElemList[name + "_imb"], 1, 1)
            this.mElemList[name + "_hp_percent"].text = "100%"
            return
        }

        //更新
        let info = this.activityDataList[data.index]
        if (!info) {
            return
        }
        let hpPercent = info.hpPercent || 0
        let isLinQu = info.prize || 0

        //活动是否开启
        let isOpen = false
        if (serverTime >= timeStart1 && serverTime <= timeEnd1) {
            isOpen = true
        } else if (serverTime >= timeStart2 && serverTime <= timeEnd2) {
            isOpen = true
        }

        if (isOpen) {
            if (hpPercent > 0) { //未死亡
                this.mElemList[name + "_go_btn"].text = Localize_cns("ACTIVITY_GO")
            } else {
                if (isLinQu > 0) { //已领取
                    this.mElemList[name + "_go_btn"].text = Localize_cns("ACTIVITY_NOT_REFRESH")
                } else {
                    this.mElemList[name + "_go_btn"].text = Localize_cns("ACTIVITY_PAY_TXT6")
                }
            }
        } else {
            this.mElemList[name + "_go_btn"].text = Localize_cns("ACTIVITY_NOT_REFRESH")
            // if (isLinQu > 0) { //已领取
            //     this.mElemList[name + "_go_btn"].text = Localize_cns("ACTIVITY_NOT_REFRESH")
            // } else {
            //     this.mElemList[name + "_go_btn"].text = Localize_cns("ACTIVITY_PAY_TXT6")
            // }
        }

        //boss气血
        UiUtil.updateProgress(this.mElemList[name + "_imb"], hpPercent * 100, 100)
        this.mElemList[name + "_hp_percent"].text = String.format("%d", hpPercent * 100) + "%"
    }

    refreshHuSong(window, data, index) {
        let name = window.name

        let prizeList = data.prize
        for (let i = 0; i < 3; i++) {
            let itemId = prizeList[i]
            let itemCount = 1
            this.mElemList[name + "_itemBox_" + i].updateByEntry(itemId)
        }

        let serverTime = GetServerTime()
        let time = simple_transform_time(serverTime)
        let timeStr = ""
        if ((time.hours >= 13 && time <= 24) || (time.hours >= 0 && time <= 1)) {
            timeStr = "23:00~01:00"
        } else {
            timeStr = "11:00~13:00"
        }

        let actInfo = GetActivity(ActivityDefine.HuSong).getActInfo() || {}
        let hadHusong = actInfo.husongTwice || 0
        let str = String.format(Localize_cns("ACTIVITY_TXT12"), timeStr, hadHusong + "/" + 3)
        AddRdContent(this.mElemList[name + "_des_rd"], str, "ht_22_cc_stroke", "white", 6)
    }

    refreshDaTi(window, data, index) {
        let name = window.name

        let prizeList = data.prize
        for (let i = 0; i < 3; i++) {
            let itemId = prizeList[i]
            let itemCount = 1
            this.mElemList[name + "_itemBox_" + i].updateByEntry(itemId)
        }

        AddRdContent(this.mElemList[name + "_des_rd"], Localize_cns("ACTIVITY_TXT13"), "ht_22_cc_stroke", "white", 6)
    }

    refreshMining(window, data, index) {
        let name = window.name

        let prizeList = data.prize
        for (let i = 0; i < 3; i++) {
            let itemId = prizeList[i]
            let itemCount = 1
            this.mElemList[name + "_itemBox_" + i].updateByEntry(itemId)
        }

        AddRdContent(this.mElemList[name + "_des_rd"], Localize_cns("ACTIVITY_TXT28"), "ht_22_cc_stroke", "white", 6)
    }

    refreshWulin(window, data, index) {
        let name = window.name

        let prizeList = data.prize
        for (let i = 0; i < 3; i++) {
            let itemBox = this.mElemList[name + "_itemBox_" + i]
            if(prizeList && prizeList[i]){
                let itemId = prizeList[i]
                let itemCount = 1
                itemBox.updateByEntry(itemId)
            }else{
                itemBox.updateByEntry(-1)
            }   
        }

        AddRdContent(this.mElemList[name + "_des_rd"], Localize_cns("ACTIVITY_TXT30"), "ht_22_cc_stroke", "white", 6)
    }

    refreshTiangongBoss(window, data) {
        let name = window.name

        let prizeList = data.prize
        for (let i = 0; i < 3; i++) {
            let itemId = prizeList[i]
            //let itemCount = 1
            this.mElemList[name + "_itemBox_" + i].updateByEntry(itemId)
        }

        AddRdContent(this.mElemList[name + "_des_rd"], Localize_cns("ACTIVITY_TXT32"), "ht_22_cc_stroke", "white", 6)
    }

    //////商店和排行////////////////////////////////////////////////////////////////////////////////
    onOpenHuSongShop() {
        let wnd = WngMrg.getInstance().getWindow("ShopJingJiFrame");
        wnd.showWithIndex(2);
    }

    onOpenDaTiShop() {
        let wnd = WngMrg.getInstance().getWindow("ShopJingJiFrame");
        wnd.showWithIndex(3);
    }

    onOpenMiningRank() {
        WngMrg.getInstance().showWindow("GlobalMiningRankFrame")
    }

    onOpenWuLinMonthRank(){
        WngMrg.getInstance().showWindow("WuLinMonthRankFrame")
    }

    /////进入和领奖/////////////////////////////////////////////////////////////////////////////
    enterRuQin() {
        //加入帮会
        if (!ClubSystem.getInstance().isJoinClub()) {
            ExecuteMainFrameFunction("gonghui")
            return
        }

        let info = this.activityDataList[OrdinaryActivityIndex.FactionMonster]
        if (!info) {
            return
        }

        let clubInfo = ClubSystem.getInstance().getCurClubInfo() || {}
        let clubLv = clubInfo.level || 1

        //更新活动时间
        let timeConfig = GameConfig.FactionMonsterConfig[clubLv].activeTime
        let timeSolt1 = timeConfig[0]
        let timeSolt2 = timeConfig[1]

        let serverTime = GetServerTime()

        let timeStart1 = GetTodayTime(serverTime, timeSolt1[0], timeSolt1[1])
        let timeEnd1 = GetTodayTime(serverTime, timeSolt1[2], timeSolt1[3])

        let timeStart2 = GetTodayTime(serverTime, timeSolt2[0], timeSolt2[1])
        let timeEnd2 = GetTodayTime(serverTime, timeSolt2[2], timeSolt2[3])

        let hpPercent = info.hpPercent || 0
        let isLinQu = info.prize || 0

        //活动是否开启
        let isOpen = false
        if (serverTime >= timeStart1 && serverTime <= timeEnd1) {
            isOpen = true
        } else if (serverTime >= timeStart2 && serverTime <= timeEnd2) {
            isOpen = true
        }

        if (isOpen) {
            if (CheckActivityState() == false) {
                return
            }
            
            if (CheckFightState() == true) {
                return
            }
            
            if (CheckBeiBaoEquipWillFull()) {
                return
            }
            
            if (hpPercent > 0) { //未死亡
                //PushUIShow(null, ["MainFrame", "ActivityListFrame"])
                RpcProxy.call("C2G_CreateBossFight", OrdinaryActivityIndex.FactionMonster, {})
            } else {
                if (isLinQu > 0) { //已领取

                } else {
                    RpcProxy.call("C2G_GetActivityStagePrize", OrdinaryActivityIndex.FactionMonster, 0)
                }
            }
        } else {
            if (isLinQu > 0) { //已领取

            } else {
                RpcProxy.call("C2G_GetActivityStagePrize", OrdinaryActivityIndex.FactionMonster, 0)
            }
        }
    }

    enterHuSong() {
        let wnd = WngMrg.getInstance().getWindow("EscortFrame")
        wnd.showWnd()
    }

    enterDaTi() {
        ExecuteMainFrameFunction("dati")
    }

    enterMining() {
        ExecuteMainFrameFunction("wakuang")
    }

    enterWuLin(){
        ExecuteMainFrameFunction("wulin")
    }

    enterTiangong() {
        if ((GetHeroProperty("level") || 0) < StrongholdConfig.openLevel) {
            return MsgSystem.addTagTips(Localize_cns("ROLE_SKIN_TXT14"))
        }
        if (IsActivityTimeOpened(OrdinaryActivityIndex.Stronghold) == false) {
            return MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT40"))
        }
        // let serverTime = GetServerTime()
        // let startTime = GetTodayTime(serverTime, 12, 30)
        // if (serverTime < startTime) {
        //     return MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT40"))
        // }
        ExecuteMainFrameFunction("judian")
    }

    /////////////////////////////////////////////////////////////////
    //更新红点提示
    refreshDotTipsImp() {
        let list = this.activityInfoList
        for (let i = 0; i < size_t(list); i++) {
            let info = list[i]
            if (IsActivityTimeOpened(info.index)) {
                let [window, flag] = this.scroll.getItemWindow(i, 561, 187, 0, 0, 0)
                this.activityInfoList[i].dot.call(this, info, window.name)
            } else {
                if (info.index == OrdinaryActivityIndex.HUSONG) {
                    this.refreshHuSongDotTips()
                }
            }
        }

    }

    refreshRuQinDotTips(info, name) {
         //是否进帮
        if (!ClubSystem.getInstance().isJoinClub()) {
            return
        }

        let fmInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.FactionMonster)
        if (!fmInfo) {
            return
        }

        let hpPercent = fmInfo.hpPercent || 0
        let isLinQu = fmInfo.prize || 0
        if (hpPercent == 0 && isLinQu > 0) { //已领取
            return
        }

        this.createDotTipsUI(this.mElemList[name + "_go_btn"])
    }

    refreshHuSongDoubleTips(info, name) {
        this.mElemList[name + "_double"].visible = true
    }

    refreshDaTiDotTips(info, name) {
        this.createDotTipsUI(this.mElemList[name + "_go_btn"])
    }

    refreshHuSongDotTips() {
        let check = GuideFuncSystem.getInstance().checkHuSong()
        if (check) {
            let [window, flag] = this.scroll.getItemWindow(1, 561, 187, 0, 0, 0)
            this.createDotTipsUI(this.mElemList[window.name + "_go_btn"])
        }
    }

    refreshTiangongDotTips(info, name) {
        if ((GetHeroProperty("level") || 0) < StrongholdConfig.openLevel) {
            return
        }

        if (IsActivityTimeOpened(OrdinaryActivityIndex.Stronghold) == false) {
            return
        }

        // let serverTime = GetServerTime()
        // let startTime = GetTodayTime(serverTime, 12, 30)
        // if (serverTime < startTime) {
        //     return
        // }
        this.createDotTipsUI(this.mElemList[name + "_go_btn"])
    }
}