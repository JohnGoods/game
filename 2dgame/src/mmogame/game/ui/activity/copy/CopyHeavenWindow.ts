class CopyHeavenWindow extends BaseCtrlWnd {
    controlDataTable: any;
    curIndex: number
    boxConfigList: any[]                        //记录有宝箱奖励的层级属性
    curBoxGroupIndex: number
    curBoxIndex: number                         //当前领过的宝箱所在的索引的最大值
    maxIndex: number                            //历史通关最高层
    timerList: any
    dotWndList: any

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.curIndex = 11                      //当前通关的层数
        this.boxConfigList = []
        this.curBoxGroupIndex = -1
        this.curBoxIndex = -1
        this.maxIndex = 10
        this.timerList = {}
        this.dotWndList = {}
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        var elemInfo = [
            { ["name"]: "tianting_onekey",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickOneKey },
            { ["name"]: "tianting_fight",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFight },
            
            { ["name"]: "tianting_pre",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPre },
            { ["name"]: "tianting_next",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNext },

            { ["name"]: "tianting_baotu_btn0",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBaotu },
            { ["name"]: "tianting_baotu_gained0",   ["messageFlag"]: true },
            { ["name"]: "tianting_baotu_btn1",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBaotu },
            { ["name"]: "tianting_baotu_gained1",   ["messageFlag"]: true },
            { ["name"]: "tianting_baotu_btn2",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickBaotu },
            { ["name"]: "tianting_baotu_gained2",   ["messageFlag"]: true },
            
            { ["name"]: "tianting_baotu_bam", ["image"]: "fb_loadingDi01", ["thumbImage"]: "fb_loading01", },

            { ["name"]: "tianting_rank",   ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRank },
            { ["name"]: "tianting_auto_check",   ["event_name"]: egret.TouchEvent.CHANGE, ["fun_index"]: this.onAutoChange },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let txt = ""
        let colorList = ["#orange", "#magenta", "#cyan"]
        //通关奖励
        for (let i = 0; i < 3; i++) {
            this.mElemList["tianting_icon" + i] = UIActorView.newObj(this.mLayoutNode, "tianting_icon" + i, 40, 80, this.mElemList["tianting_mon_group" + i])
            //this.mElemList["tianting_icon" + i].updateByPlayer(20001)
        }

        
        //通关记录
        this.mElemList["tianting_link_record"] = UILinkView.newObj(this.mLayoutNode, "tianting_link_record", -10, 15, this.mElemList["video_group3"])
        // this.mElemList["tianting_link_record"].setContent(Localize_cns("BOSS_TXT76"))
        // this.mElemList["tianting_link_record"].setCallBack(this.onClickRecord, this)
        this.mElemList["tianting_link_record"].setDefaultFont("ht_22_cc_stroke")
        this.mElemList["tianting_link_record"].setLine(true, gui.Color.ublack)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        // RegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        // RegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["tianting_group"].visible = true
        this.mElemList["label_wndName"].text = Localize_cns("COPY_TXT23")

        let wnd = WngMrg.getInstance().getWindow("FightPrizeFrame")
        if (wnd.isVisible() == true) {
            this.mElemList["tianting_auto_check"].selected = true
        }

        this.refreshFrame()
        this.applyActInfo()
        this.refreshAutoFight()
    }

    public onHide(): void {
        // UnRegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        // UnRegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["tianting_group"].visible = false
        
        this.curBoxGroupIndex = -1
        this.curBoxIndex = -1

        for (let _ in this.timerList) {
            let v = this.timerList[_]
            KillTimer(v)
        }
        this.timerList = {}

         for (let i = 0; i < 3; i++) {
            this.mElemList["tianting_icon" + i].clearView()
         }

         this.mElemList["tianting_auto_check"].selected = false
    }
    
    refreshFrame() {
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.HeavenTrial)
        // {
        //         currentIndex: 当前进度（已通关的）
        //         maxIndex: 历史最大进度
        //         boxIndex: 宝箱领取进度（已领取的）
        // }
        let curIndex = 10
        if (actInfo && actInfo.currentIndex != null && actInfo.currentIndex > curIndex) {
            curIndex = actInfo.currentIndex
        }
        this.curIndex = curIndex
        
        let curBoxIndex = 10
        if (actInfo && actInfo.boxIndex != null && actInfo.boxIndex > curBoxIndex) {
            curBoxIndex = actInfo.boxIndex
        }
        this.curBoxIndex = curBoxIndex
        
        let maxIndex = 10
        if (actInfo && actInfo.maxIndex != null && actInfo.maxIndex > maxIndex) {
            maxIndex = actInfo.maxIndex
        }
        this.maxIndex = maxIndex

        if (GameConfig.CopyHeavenConfig[maxIndex]) {
            this.mElemList["tianting_max_layer"].text = String.format(Localize_cns("COPY_TXT24"), GameConfig.CopyHeavenConfig[maxIndex].layerIndex)
        } else {
            this.mElemList["tianting_max_layer"].text = String.format(Localize_cns("COPY_TXT24"), 0)
        }

        this.controlDataTable = {}
        let list = []
        for (let k in GameConfig.CopyHeavenConfig){
            let v = GameConfig.CopyHeavenConfig[k]
            table_insert(list, v)
        }
        table_sort(list, function(a, b) {return a.layerIndex - b.layerIndex})
        let flag = false
        let t = []
        for (let i = 0; i < list.length; i++) {
            table_insert(t, list[i])

            if (GameConfig.CopyHeavenConfig[curIndex + 1]) {
                if (list[i].index == curIndex + 1) {
                    flag = true
                }
            } else {
                if (list[i].index == curIndex) {
                    flag = true
                }
            }

            if (t.length == 3) {
                if (flag == true) {
                    break
                }
                t = []
            }
        }
        this.mElemList["tianting_all_pass"].visible = false
        if (flag == false) {                                //已经通过所有层
            this.curIndex = -1
            this.mElemList["tianting_fight"].visible = false
            this.mElemList["tianting_auto_check"].selected = false
            this.mElemList["tianting_auto_check"].enabled = false
        } else {
            if (GameConfig.CopyHeavenConfig[curIndex + 1] == null) {
                this.mElemList["tianting_fight"].visible = false
                this.mElemList["tianting_all_pass"].visible = true
                
                this.mElemList["tianting_auto_check"].selected = false
                this.mElemList["tianting_auto_check"].enabled = false
            } else {
                this.mElemList["tianting_fight"].visible = true

                this.mElemList["tianting_auto_check"].enabled = true
            }
            
        }

        //刷新层级显示
        for (let i = 0; i < 3; i++){
            if (t[i]) {
                this.mElemList["tianting_layer_group" + i].visible = true

                let config = t[i]
                let monsterModelId = GetMonsterModel(config.entryId)
                this.mElemList["tianting_icon" + i].updateByPlayer(monsterModelId)

                this.mElemList["tianting_layer_name" + i].text = config.layerName
                this.mElemList["tianting_layer_pass" + i].visible = config.index <= curIndex
                this.mElemList["tianting_layer_cur" + i].visible = config.index == curIndex + 1
                this.mElemList["tianting_icon" + i].setVisible(config.index > curIndex)

                if (config.lines && config.lines != "") {
                    this.mElemList["tianting_content_group" + i].visible = true
                    AddRdContent(this.mElemList["tianting_centent_rd" + i], config.lines, "ht_18_cc", "ublack", 5)
                    let h = AdjustRdContentViewH(this.mElemList["tianting_centent_rd" + i], 60)
                    this.mElemList["tianting_centent_bg" + i].height = 91 + (h - 60)
                    this.mElemList["tianting_centent_bg" + i].y = 60 - h
                    this.mElemList["tianting_centent_rd" + i].height = h
                    this.mElemList["tianting_centent_rd" + i].y = 60 - h + 9
                } else {
                    this.mElemList["tianting_content_group" + i].visible = false
                }
            } else {
                this.mElemList["tianting_layer_group" + i].visible = false
            }
        }

        //初始化this.boxConfigList
        this.boxConfigList = []
        t = []
        for (let i = 0; i < list.length; i++) {
            let v = list[i]
            if (size_t(v.box) > 0) {
                table_insert(t, v)
                if (this.curBoxGroupIndex < 0) {                        //未初始化过
                    let boxIndex = curBoxIndex
                    if (v.index >= boxIndex) {
                        for (let m = 1; m < list.length; m++) {
                            if (GameConfig.CopyHeavenConfig[boxIndex + 1]) { //自动跳到下一个
                                boxIndex = boxIndex + 1
                            }

                            if (boxIndex == v.index) {
                                this.curBoxGroupIndex = this.boxConfigList.length
                                break
                            }
                        }
                    }
                }

                if (t.length >= 3) {
                    table_insert(this.boxConfigList, t)
                    t = []
                }
            }
        }
        if (t.length > 0) {
            table_insert(this.boxConfigList, t)
        }

        this.mElemList["video_group3"].visible = false
        if (actInfo) {
            let minStageClearForce = actInfo.minStageClearForce //通关录像
            if(minStageClearForce && size_t(minStageClearForce) != 0){
                let minStageClearForceData = minStageClearForce
                this.mElemList["video_group3"].visible = true
                this.mElemList["tianting_video_btn"].text = minStageClearForceData[0]
                this.mElemList["tianting_power"].text = String.format(Localize_cns("FIGHT_TXT13"),MakeLongNumberShort(minStageClearForceData[1]))
                // this.mElemList["tianting_name"].text = String.format(Localize_cns("FIGHT_TXT14"), minStageClearForceData[0])
                this.mElemList["tianting_link_record"].setContent("#nor" + String.format(Localize_cns("FIGHT_TXT14"), minStageClearForceData[0]))
                this.mElemList["tianting_link_record"].setCallBack(this.onClickRecord, this, [minStageClearForceData[2], minStageClearForceData[3]])
            }
        }

        this.refreshBoxPro()
    }

    refreshBoxPro() {
        this.curBoxGroupIndex = MathUtil.clamp(this.curBoxGroupIndex, 0, this.boxConfigList.length - 1)
        this.dotWndList = {}

        //进度条相关数据
        let layerDot = []
        if (this.curBoxGroupIndex > 0) {
            let lastList = this.boxConfigList[this.curBoxGroupIndex - 1]
            table_insert(layerDot, lastList[2].layerIndex + 1)
        } else {
            table_insert(layerDot, 0)
        }

        let list = this.boxConfigList[this.curBoxGroupIndex]
        let flag = false
        for (let i = 0; i < 3; i++) {
            let v = list[i]
            if (v) {
                this.mElemList["tianting_baotu_group" + i].visible = true
                this.mElemList["tianting_baotu_layer" + i].text = String.format(Localize_cns("COPY_TXT24"), v.layerIndex)
                if (v.index <= this.curBoxIndex) {
                    this.mElemList["tianting_baotu_gained" + i].visible = true
                    this.controlDataTable["tianting_baotu_btn" + i] = [0, v.index]                          //0表示已领取
                } else {
                    if (v.index <= this.maxIndex) {                                                         //可领取
                        if (flag == false) {
                            this.controlDataTable["tianting_baotu_btn" + i] = [1, v.index]                  //1表示可领取未领取
                            this.dotWndList["tianting_baotu_btn" + i] = this.mElemList["tianting_baotu_btn" + i]

                            flag = true
                        } else {
                            this.controlDataTable["tianting_baotu_btn" + i] = [2, v.index]                  //2表示未可领取
                            this.dotWndList["tianting_baotu_btn" + i] = this.mElemList["tianting_baotu_btn" + i]
                        }
                    } else {
                        this.controlDataTable["tianting_baotu_btn" + i] = [3, v.index]                      //3表示不可领取
                    }
                    
                    this.mElemList["tianting_baotu_gained" + i].visible = false
                }

                table_insert(layerDot, v.layerIndex)
            } else {
                this.mElemList["tianting_baotu_group" + i].visible = false
            }
        }
        table_insert(layerDot, layerDot[layerDot.length - 1] + 1)                                    //[0, l1, l2, l3, l3 + 1]

        // let proMaxLayer = 9 * (this.curBoxGroupIndex + 1) + 2                                        //当前进度条表示的最大值
        let dot = [0, 2, 5, 8, 10]
        let layerIndex = 0
        if (GameConfig.CopyHeavenConfig[this.maxIndex]) {
            layerIndex = GameConfig.CopyHeavenConfig[this.maxIndex].layerIndex
        }
        //找出区间索引
        let dotIndex = 0
        for (let i = 0; i < layerDot.length - 1; i++) {
            let v = layerDot[i]
            let nextv = layerDot[i + 1]
            if (layerIndex < nextv) {
                if (layerIndex >= v) {
                    dotIndex = i
                    break
                }
            } else if (i == layerDot.length - 2) {                      //最后一个
                dotIndex = i
            }
        }
        let proNum = dot[dotIndex] + (layerIndex - layerDot[dotIndex]) / (layerDot[dotIndex + 1] - layerDot[dotIndex]) * (dot[dotIndex + 1] - dot[dotIndex])
        //能关最大关卡
        if (GameConfig.CopyHeavenConfig[this.maxIndex + 1] == null) {
            proNum = 10
        }

        let imb = this.mElemList["tianting_baotu_bam"]
        UiUtil.updateProgress(imb, MathUtil.clamp(proNum, 0, 10), 10)
        
        //左右切换按钮的红点
        for (let i = 0; i < this.boxConfigList.length; i++) {
            let list = this.boxConfigList[i]
            for (let k = 0; k < list.length; k++) {
                let v = list[k]
                if (v.index > this.curBoxIndex) {
                    if (v.index <= this.maxIndex) {
                        if (i < this.curBoxGroupIndex) {
                            if (this.dotWndList["tianting_pre"] == null) {
                                this.dotWndList["tianting_pre"] = this.mElemList["tianting_pre"]
                            }
                        } else if (i > this.curBoxGroupIndex) {
                            if (this.dotWndList["tianting_next"] == null) {
                                this.dotWndList["tianting_next"] = this.mElemList["tianting_next"]
                            }
                        }
                    }
                }
            }
        }
        this.mParentWnd.refreshDotTips()
    }

    updateWnd() {
        this.curBoxGroupIndex = -1
        this.refreshFrame()
    }

    applyActInfo() {
        RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.HeavenTrial)
    }

    refreshAutoFight() {
        if (this.mElemList["tianting_auto_check"].selected == true) {                       //勾选了自动挑战
            if (!this.timerList["autoFight"]) {                                              //自动挑战
                let endTime = GetServerTime() + 10

                let tick = function(delay) {
                    //结算界面还在时不倒计时
                    let wnd = WngMrg.getInstance().getWindow("FightPrizeFrame")
                    if (wnd.isVisible() == true) {
                        endTime = GetServerTime() + 10
                        return
                    }

                    let leftTime = endTime - GetServerTime()
                    if (leftTime < 0) {
                        this.onClickFight()
                        leftTime = 0

                        if (this.timerList["autoFight"]) {
                            KillTimer(this.timerList["autoFight"])
                            delete this.timerList["autoFight"]
                        }
                    }

                    this.mElemList["tianting_auto_tl"].text = String.format(Localize_cns("COPY_TXT34"), leftTime)
                }
                this.timerList["autoFight"] = SetTimer(tick, this, 200, true)
            }
        } else {
            if (this.timerList["autoFight"]) {
                KillTimer(this.timerList["autoFight"])
                delete this.timerList["autoFight"]
            }
            this.mElemList["tianting_auto_tl"].text = Localize_cns("COPY_TXT33")
        }
    }

    //红点提示
    refreshDotTipsImp() {
        for (let k in this.dotWndList) {
            let wnd = this.dotWndList[k]
            this.mParentWnd.createDotTipsUI(wnd, true)//有一个开启红点就够
        }
    }
    ///////////////////////////////////////////////////////////////////////
    onClickOneKey(args) {
        if (CheckActivityState() == false) {
            return
        }
        
        if (CheckFightState() == true) {
            return
        }
        
        if (CheckBeiBaoEquipWillFull()) {
            return
        }
        
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.HeavenTrial)
        // {
        //         currentIndex: 当前进度（已通关的）
        //         maxIndex: 历史最大进度
        //         boxIndex: 宝箱领取进度（已领取的）
        // }
        if (actInfo && actInfo.currentIndex != null) {
            if (actInfo.maxIndex <= actInfo.currentIndex) {
                MsgSystem.addTagTips(Localize_cns("COPY_TXT45"))
                return
            }
        }
        RpcProxy.call("C2G_SweepBossActivityEx", OrdinaryActivityIndex.HeavenTrial, [])
    }
    
    onClickFight(args?) {
        if (CheckActivityState() == false) {
            return
        }

        if (CheckFightState() == true) {
            return
        }
        
        if (CheckBeiBaoEquipWillFull()) {
            return
        }

        RpcProxy.call("C2G_CreateBossFight", OrdinaryActivityIndex.HeavenTrial, this.curIndex + 1)
    }

    onClickPre(args) {
        this.curBoxGroupIndex = this.curBoxGroupIndex - 1
        this.refreshBoxPro()
    }

    onClickNext(args) {
        this.curBoxGroupIndex = this.curBoxGroupIndex + 1
        this.refreshBoxPro()
    }

    onClickBaotu(args) {
        let name = args.target.name

        if (this.controlDataTable[name] == null) {
            return
        }

        let [oType, index] = this.controlDataTable[name]

        if (oType == 0) {
            return
        } else if (oType == 1) {
            let _this = this
            let callback = function () {
                RpcProxy.call("C2G_GetActivityStagePrize", OrdinaryActivityIndex.HeavenTrial, [index])
                return false
            }
            
            //弹出奖励预览界面
            let list = AnalyPrizeFormat(GameConfig.CopyHeavenConfig[index].box)
            let wnd = WngMrg.getInstance().getWindow("NotifyPrizeGainFrame")
            wnd.showPrizeGainFrame(callback, this, list, Localize_cns("COPY_TXT31"), String.format(Localize_cns("COPY_TXT44"), GameConfig.CopyHeavenConfig[index].layerName), Localize_cns("FIGHT_TXT9"))
        } else {
            if (oType == 2) {
                MsgSystem.addTagTips(Localize_cns("COPY_TXT41"))
            }
            //弹出奖励预览界面
            let list = AnalyPrizeFormat(GameConfig.CopyHeavenConfig[index].box)
            let wnd = WngMrg.getInstance().getWindow("NotifyPrizeGainFrame")
            wnd.showPrizeGainFrame(null, null, list, Localize_cns("COPY_TXT31"), String.format(Localize_cns("COPY_TXT44"), GameConfig.CopyHeavenConfig[index].layerName), Localize_cns("CONFIRM_INFO"))
        }
    }
    
    onClickRank(args) {
        WngMrg.getInstance().showWindow("CopyHeavenRankFrame")
    }

    onAutoChange(args) {
        this.refreshAutoFight()
    }

    onClickRecord(data) {
        let [roleId, videoId] = data || [null, null]
        if (videoId == null) {
            RpcProxy.call("C2G_GetPlayerInfoByID", roleId)
            return// MsgSystem.addTagTips(Localize_cns("FIGHT_TXT16"))
        }
        GetFightVideo(videoId, roleId)
    }
}