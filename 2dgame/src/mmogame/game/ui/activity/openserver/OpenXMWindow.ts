// TypeScript file
class OpenXMWindow extends BaseCtrlWnd {
    controlDataTable: any;
    name: string;
    mLayoutPath: any;
    scroll: any
    timerList: any
    actIndex: number
    batchIndex: number                  //当前关卡批次，从0开始，5关一批
    curIndex: number                    //当前批次下的选中项的索引，0 ~ 4
    batchInfo: any                      //当前批次活动（表）数据
    maxIndex: number                       //通关的最大索引
    actConfigTable: any
    
    static BATCH_COUNT: number = 5

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.name = params[2] || "xm"                  //熊猫大侠
        this.mLayoutPath = params[3]
        this.actConfigTable = params[4] || GameConfig.NewServerInstZonesConfig          //表单
        this.actIndex = params[5] || PayActivityIndex.NEW_SERVER_INST_ZONES
        this.timerList = {}
        this.batchIndex = -1
        this.curIndex = 0
        this.maxIndex = -1
    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mElemList["group_wnd"])

        var elemInfo = [
            {["name"]: this.name + "fight_btn",     ["title"]: Localize_cns("OPENSERVER_TXT14"), ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFight },
            {["name"]: this.name + "pre_btn",       ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPre },
            {["name"]: this.name + "next_btn",      ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNext },
            

            {["name"]: this.name + "video_group"  },
            {["name"]: this.name + "video_btn",      ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.videoClick },
            {["name"]: this.name + "passpower" },
            {["name"]: this.name + "passname" },

		]
		UiUtil.initElem(elemInfo, this.mElemList[this.name], this.mElemList, this)

        var elemInfo1 = [
            // {["name"]: this.name + "go_tl",     ["title"]: Localize_cns("OPENSERVER_TXT5"), ["color"]: gui.Color.lime, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGo },
            // {["name"]: this.name + "my_rank",   ["title"]: String.format(Localize_cns("OPENSERVER_TXT10"), Localize_cns("OPENSERVER_TXT11")),},
            {["index_type"]: gui.ProgressBar,   ["name"]: this.name + "_pro", ["parent"]: this.name + "pro_group", ["font"]: null, ["image"]: "kfhd_loadingDi01", ["thumbImage"]: "kfhd_loading01", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 464, ["h"]: 30, },
             
		]
		UiUtil.createElem(elemInfo1, this.mElemList[this.name], this.mElemList, this)
        let imb = this.mElemList[this.name + "_pro"]
        UiUtil.updateProgress(imb, 50, 100)

        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)

        // this.mElemList[this.name + "time_rd"].setAlignFlag(gui.Flag.RIGHT)
        // this.mElemList["name_txt"].textColor = gui.Color.ublack;
        // this.mElemList["go_tl"].textColor = gui.Color.ublack;

        AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + "00:00:00"), "ht_22_cc_stroke", "gold")

        for (let i = 0; i < 5; i++) {
            this.mElemList[this.name + "itemBoxUp" + i] = UIItemBox.newObj(this.mLayoutNode, this.name + "itemBox" + i, 95 + 93 * i, 8, this.mElemList[this.name])
            this.mElemList[this.name + "itemBoxUp" + i].setItemTipsListner(this.onClickItem, this, i)
            this.mElemList[this.name + "camp" + i].text = String.format(Localize_cns("OPENSERVER_TXT13"), i + 1)
        }
        for (let i = 0; i < 4; i++) {
            this.mElemList[this.name + "itemBoxDown" + i] = UIItemBox.newObj(this.mLayoutNode, this.name + "itemBox" + i, 155 + 85 * i, 495, this.mElemList[this.name])
        }
        this.mElemList[this.name + "_view"] = UIActorView.newObj(this.mLayoutNode, this.name + "_view", 0, 0, this.mElemList[this.name + "view_group"])
        this.mElemList[this.name + "_view"].setActorScale(1.2)
        //this.mElemList[this.name + "_view"].updateByPlayer(20001)

        // let posList = [
        //                     [0, 115],
        //                     [102, 209],
        //                     [197, 304],
        //                     [282, 393],
        //                     [372, 489],
        //                     [464, 489],
        // ]
        // let count = 0
        // let _this = this
        // let tick = function(delay) {
        //     count = count % posList.length
        //     _this.mElemList[_this.name + "arr_icon"].x = posList[count][1]
        //     let imb = _this.mElemList[_this.name + "_pro"]
        //     UiUtil.updateProgress(imb, posList[count][0], 464)

        //     count = count + 1
        // }
        // let timer = SetTimer(tick, this, 2000, true)

        //通关记录
        this.mElemList[this.name + "_link_record"] = UILinkView.newObj(this.mLayoutNode, this.name + "_link_record", -10, 15, this.mElemList[this.name + "video_group"])
        // this.mElemList[this.name + "_link_record"].setContent(Localize_cns("BOSS_TXT76"))
        // this.mElemList[this.name + "_link_record"].setCallBack(this.onClickRecord, this)
        this.mElemList[this.name + "_link_record"].setDefaultFont("ht_22_cc_stroke")
        this.mElemList[this.name + "_link_record"].setLine(true, gui.Color.ublack)
        
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)

        this.mElemList[this.name].visible = true
        this.onRefresh()

        this.applyActInfo()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onActivityUpdate, this)
        this.mElemList[this.name + "_view"].clearView()
        this.mElemList[this.name].visible = false
        
        for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}
        this.maxIndex = -1
    }

    onRefresh() {
        let info = ActivitySystem.getInstance().getOperateActivityInfo(this.actIndex) || []             //[serverDay/typeIndex, utils.getTomorrow()]
        let overTime = info[1] || GetServerTime()
        
        for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}

        //活动时间
        let tick = function(delay) {
            let leftTime = overTime - GetServerTime()
            if (leftTime < 0) {
                if (this.timerList["tick"]) {
                    KillTimer(this.timerList["tick"])
                    delete this.timerList["tick"] 
                }

                leftTime = 0
            }
            let day = Math.floor(leftTime / opTime.Day)
            let t = simple_transform_time1(leftTime % opTime.Day)
            let timeStr = String.format(Localize_cns("OPENSERVER_TXT35"), t.hours, t.mins)
            // getFormatDiffTime(leftTime % opTime.Day)
            if (day > 0) {
                timeStr = String.format(Localize_cns("OPENSERVER_TXT34"), day) + timeStr
            }
            AddRdContent(this.mElemList[this.name + "time_rd"], String.format(Localize_cns("OPENSERVER_TXT2"), "#nor#little_space" + timeStr), "ht_22_cc_stroke", "gold")
        }
        if (this.timerList["tick"] == null) {
            this.timerList["tick"] = SetTimer(tick, this, 200, true)
        }

        //初始化批次等
        let list = []
        for (let k in this.actConfigTable) {
            let v = this.actConfigTable[k]
            table_insert(list, v)
        }
        table_sort(list, function(a, b) {return a.index - b.index})

        this.batchInfo = []
        this.batchIndex = (this.batchIndex) < 0 ? 0 : this.batchIndex
        for (let i = 0; i < list.length; i++) {
            let v = list[i]
            if (Math.floor(i / OpenXMWindow.BATCH_COUNT) == this.batchIndex) {
                table_insert(this.batchInfo, v)
            }
        }
        //刷新批次（简略，主要）奖励
        for (let i = 0; i < OpenXMWindow.BATCH_COUNT; i++) {
            let v = this.batchInfo[i]
            if (v == null) {
                this.mElemList[this.name + "itemBoxUp" + i].setVisible(false)
                this.mElemList[this.name + "camp" + i].text = ""
            } else {
                this.mElemList[this.name + "itemBoxUp" + i].setVisible(true)

                let prize = AnalyPrizeFormat(v.mainPrizeShow)
                let [entryId, count, quality] = prize[0] || [null, null, null]
                this.mElemList[this.name + "itemBoxUp" + i].updateByEntry(entryId, count, quality)
                this.mElemList[this.name + "camp" + i].text = v.indexName//String.format(Localize_cns("OPENSERVER_TXT13"), v.index)
            }
        }

        this.refreshCampInfo()

    }

    refreshCampInfo() {
        if (this.curIndex < 0) {
            let maxIndex = this.maxIndex
            if (this.actConfigTable[this.maxIndex + 1] != null) {
                maxIndex = this.maxIndex + 1
            }
            
            if (this.batchIndex != Math.floor(maxIndex / OpenXMWindow.BATCH_COUNT)) {
                this.curIndex = 0
            } else {
                this.curIndex = MathUtil.clamp(maxIndex - this.batchIndex * OpenXMWindow.BATCH_COUNT, 0, OpenXMWindow.BATCH_COUNT - 1)
            }
        }
        this.curIndex = this.curIndex % OpenXMWindow.BATCH_COUNT
        let config = this.batchInfo[this.curIndex]
        this.controlDataTable = {}
        //通过这步运算后，maxCount表示通过的关卡数——对于当前批次而言
        let maxCount = MathUtil.clamp(this.maxIndex - (this.batchIndex * OpenXMWindow.BATCH_COUNT - 1), 0, OpenXMWindow.BATCH_COUNT)

        //刷新进度条部分
        let posList = [
                            [0, 115],
                            [102, 209],
                            [197, 304],
                            [282, 393],
                            [372, 489],
                            [464, 489],
        ]
        this.mElemList[this.name + "arr_icon"].x = posList[this.curIndex][1]
        let imb = this.mElemList[this.name + "_pro"]
        UiUtil.updateProgress(imb, posList[maxCount][0], 464)

        if (config == null) {
            this.mElemList[this.name + "_view"].clearView()
            this.mElemList[this.name + "title"].text = ""
            for (let i = 0; i < 4; i++) {
                this.mElemList[this.name + "itemBoxDown" + i].setVisible(false)
            }
            this.mElemList[this.name + "fight_btn"].visible = false
            this.mElemList[this.name + "killed_icon"].visible = false
        } else {
            this.mElemList[this.name + "_view"].updateByPlayer(config.monModelId)
            this.mElemList[this.name + "title"].text = config.tips

            let itemShow = AnalyPrizeFormat(config.prize)
            for (let i = 0; i < 4; i++) {
                if (itemShow[i] == null) {
                    this.mElemList[this.name + "itemBoxDown" + i].setVisible(false)
                } else {
                    let [entryId, count, quality] = itemShow[i]
                    this.mElemList[this.name + "itemBoxDown" + i].setVisible(true)
                    this.mElemList[this.name + "itemBoxDown" + i].updateByEntry(entryId, count, quality)
                }
            }
            this.mElemList[this.name + "killed_icon"].visible = config.index <= this.maxIndex
            this.mElemList[this.name + "fight_btn"].visible = (config.index == this.maxIndex + 1)
            this.controlDataTable[this.name + "fight_btn"] = config
        }

        let info = ActivitySystem.getInstance().getOperateActivityInfo(this.actIndex) || [] 
        let minStageClearForce = info[2] //通关录像
        this.mElemList[this.name + "video_group"].visible = false
        if(minStageClearForce && minStageClearForce[config.index]){
            let minStageClearForceData = minStageClearForce[config.index]
            this.mElemList[this.name+"video_group"].visible = true
            this.mElemList[this.name+"video_btn"].text = minStageClearForceData[0]
            this.mElemList[this.name+"passpower"].text = String.format(Localize_cns("FIGHT_TXT13"),MakeLongNumberShort(minStageClearForceData[1]))
            // this.mElemList[this.name+"passname"].text = String.format(Localize_cns("FIGHT_TXT14"), minStageClearForceData[0])
            this.mElemList[this.name + "_link_record"].setContent("#nor" + String.format(Localize_cns("FIGHT_TXT14"), minStageClearForceData[0]))
            this.mElemList[this.name + "_link_record"].setCallBack(this.onClickRecord, this, [minStageClearForceData[2], minStageClearForceData[3]])
        }
    }
    

    applyActInfo() {
        RpcProxy.call("C2G_SendOperateAndPlayerData", this.actIndex)
    }
    
    onActivityUpdate(args) {
        if (args.actIndex != this.actIndex) {
            return
        }

        if (this.maxIndex < 0) {
            //[[关卡索引]=是否通关]   1已通关，没有这个index，表示没有通关
            let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.actIndex) || []          //玩家信息
            this.maxIndex = -1                       //通关的最大索引
            for (let k in playerInfo) {
                if (playerInfo[k] == 1) {               //已通关
                    if (this.maxIndex < tonumber(k)) {
                        this.maxIndex = tonumber(k)
                    }
                }
            }
            if (this.maxIndex >= 0) {
                let maxIndex = this.maxIndex
                if (this.actConfigTable[this.maxIndex + 1] != null) {
                    maxIndex = this.maxIndex + 1
                }
                
                this.batchIndex = Math.floor(maxIndex / OpenXMWindow.BATCH_COUNT)
                this.curIndex = MathUtil.clamp(maxIndex - this.batchIndex * OpenXMWindow.BATCH_COUNT, 0, OpenXMWindow.BATCH_COUNT - 1)
            } else {
                this.curIndex = 0
            }
        }
        this.onRefresh()
    }
    ////////////////////////////////////////////////
    onClickFight(args) {
        if (CheckActivityState() == false) {
            return
        }
        
        if (CheckFightState() == true) {
            return
        }
        
        if (CheckBeiBaoEquipWillFull()) {
            return
        }
        
        let name = args.target.name

        if (this.controlDataTable[name] == null) {
            return
        }

        let config = this.controlDataTable[name]
        //战斗协议
        RpcProxy.call("C2G_DoOperateActivity", this.actIndex, [config.index])
    }

    onClickPre(args) {
        let raw = Math.ceil((size_t(this.actConfigTable) - 1) / OpenXMWindow.BATCH_COUNT)
        this.batchIndex = (this.batchIndex - 1) % raw
        this.curIndex = -1

        this.onRefresh()
    }
    
    onClickNext(args) {
        let raw = Math.ceil((size_t(this.actConfigTable) - 1) / OpenXMWindow.BATCH_COUNT)
        this.batchIndex = (this.batchIndex + 1) % raw
        this.curIndex = -1

        this.onRefresh()
    }

    onClickItem(logicItem, data) {
        if (this.curIndex == data) {
            return true
        }
        this.curIndex = data
        this.refreshCampInfo()

        return true
    }

    videoClick(){

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