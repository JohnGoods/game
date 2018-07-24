class CopyDragonWindow extends BaseCtrlWnd {
    controlDataTable: any;
    curChapter: number
    curIndex: number
    curOpenChapter: number
    beginIndex: number
    beginIndexEx: number
    timerList: any
    curConfig: any
    nextRewardConfig:any

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.curChapter = -1
        this.curOpenChapter = 12
        this.curIndex = -1                                  //打开界面时第一默认选中当前关
        this.curConfig = null
        this.nextRewardConfig = null
        this.beginIndex = 11
        this.beginIndexEx = 10
        this.timerList = {}

    }

    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;

        var elemInfo = [
            //     { ["name"]: "ug_pokedex_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPokedex }, //图鉴
            //     { ["name"]: "ug_force_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickForceBtn },
            //     { ["name"]: "ug_btn_show", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickShow },
            //     { ["name"]: "ug_btn_embattle", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickEmbattle },
            //     { ["name"]: "ug_btn_natural", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNatural },
            //     { ["name"]: "ug_btn_changename", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickChangeName },
            //     { ["name"]: "up_add_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAddition },
            //     { ["name"]: "upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickUpgrade },
            //     { ["name"]: "auto_upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickAutoUpgrade }, //自动升级
            { ["name"]: "longwang_rank", ["title"]: Localize_cns("COPY_TXT28"), ["color"]: gui.Color.lime, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRank },

            { ["name"]: "longwang_copy1_gained", ["messageFlag"]: true, },
            { ["name"]: "longwang_copy2_gained", ["messageFlag"]: true, },
            { ["name"]: "longwang_copy3_gained", ["messageFlag"]: true, },
            { ["name"]: "longwang_copy4_gained", ["messageFlag"]: true, },
            { ["name"]: "longwang_copy5_gained", ["messageFlag"]: true, },
            { ["name"]: "longwang_copy6_gained", ["messageFlag"]: true, },
            { ["name"]: "longwang__baotu_gained1", ["messageFlag"]: true, },
            { ["name"]: "longwang__baotu_gained2", ["messageFlag"]: true, },
            { ["name"]: "longwang__baotu_gained3", ["messageFlag"]: true, },

            { ["name"]: "longwang_copy1_img", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCamp },
            { ["name"]: "longwang_copy2_img", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCamp },
            { ["name"]: "longwang_copy3_img", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCamp },
            { ["name"]: "longwang_copy4_img", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCamp },
            { ["name"]: "longwang_copy5_img", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCamp },
            { ["name"]: "longwang_copy6_img", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCamp },

            { ["name"]: "longwang_pre", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPre },
            { ["name"]: "longwang_next", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNext },
            { ["name"]: "longwang_onekey", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickOnekey },
            { ["name"]: "longwang_wabao", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFight },

            { ["name"]: "longwang_baotu_btn1", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickStarPrize },
            { ["name"]: "longwang_baotu_btn2", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickStarPrize },
            { ["name"]: "longwang_baotu_btn3", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickStarPrize },

            { ["name"]: "longwang_auto_check", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAutoChange },

        ];
        for (let i = 1; i < 7; i++) {
            for (let j = 1; j < 3; j++) {
                table_insert(elemInfo, { ["name"]: "longwang_copy" + i + "_starBg" + j, ["messageFlag"]: true, })
                table_insert(elemInfo, { ["name"]: "longwang_copy" + i + "_star" + j, ["messageFlag"]: true, })
            }
        }
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        //首通奖励(特殊显示)
        this.mElemList["firstItem"] = UIItemBox.newObj(this.mLayoutNode, "firstItem", 0, 0, this.mElemList["first_item_group"],0.9)
        
        //首通奖励
        for (let i = 0; i < 2; i++) {
            this.mElemList["firstPassItemBox" + i] = UIItemBox.newObj(this.mLayoutNode, "firstPassItemBox" + i, 70 + 85 * i, 10, this.mElemList["longwang_pirze_group"])
            let elemInfo = [
                { ["index_type"]: eui.Image, ["name"]: "firstPass_gained" + i, ["title"]: null, ["font"]: null, ["image"]: "ty_text02", ["autoScale"]: true, ["color"]: gui.Color.white, ["x"]: -5, ["y"]: 50, ["w"]: 0, ["h"]: 0, ["messageFlag"]: true }, //图鉴
            ];
            this.mElemList["firstPassItemBox" + i].createElem(elemInfo, this.mElemList, this)
        }
        //通关奖励
        for (let i = 0; i < 3; i++) {
            this.mElemList["passItemBox" + i] = UIItemBox.newObj(this.mLayoutNode, "passItemBox" + i, 310 + 82 * i, 10, this.mElemList["longwang_pirze_group"])
            let elemInfo = [
                { ["index_type"]: eui.Image, ["name"]: "pass_gained" + i, ["title"]: null, ["font"]: null, ["image"]: "ty_text02", ["autoScale"]: true, ["color"]: gui.Color.white, ["x"]: -5, ["y"]: 50, ["w"]: 0, ["h"]: 0, ["messageFlag"]: true }, //图鉴
            ];
            this.mElemList["passItemBox" + i].createElem(elemInfo, this.mElemList, this)
        }

        let elemInfo1 = [
            { ["index_type"]: gui.ProgressBar, ["name"]: "longwang_star_imb", ["parent"]: "longwang_pro_group", ["font"]: null, ["image"]: "fb_loadingDi01", ["thumbImage"]: "fb_loading01", ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 10, ["w"]: 402, ["h"]: 30, },
        ];
        UiUtil.createElem(elemInfo1, this.mLayoutNode, this.mElemList, this)
        let imb = this.mElemList["longwang_star_imb"]
        UiUtil.updateProgress(imb, 50, 100)

        //通关记录
        this.mElemList["longwang_link_record"] = UILinkView.newObj(this.mLayoutNode, "longwang_link_record", -10, 15, this.mElemList["video_group1"])
        // this.mElemList["longwang_link_record"].setContent(Localize_cns("BOSS_TXT76"))
        // this.mElemList["longwang_link_record"].setCallBack(this.onClickRecord, this)
        this.mElemList["longwang_link_record"].setDefaultFont("ht_22_cc_stroke")
        this.mElemList["longwang_link_record"].setLine(true, gui.Color.ublack)

        this.mElemList["first_tip_rd"].setAlignFlag(gui.Flag.CENTER_CENTER)
        
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        // RegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        // RegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["longwang_group"].visible = true
        this.mElemList["label_wndName"].text = Localize_cns("COPY_TXT2")

        let wnd = WngMrg.getInstance().getWindow("FightDragonPrizeFrame")
        if (wnd.isVisible() == true) {
            this.mElemList["longwang_auto_check"].selected = true
        }

        // this.refreshFrame()
        this.applyActInfo()
        this.refreshAutoFight()

        this.checkGuideAuto() //新手奖励自动
    }

    public onHide(): void {
        // UnRegisterEvent(EventDefine.PET_UPDATE, this.refreshFrame, this)
        // UnRegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        this.mElemList["longwang_group"].visible = false

        for (let _ in this.timerList) {
            let v = this.timerList[_]
            KillTimer(v)
        }
        this.timerList = {}
        this.curIndex = -1
        this.curChapter = -1
        this.mElemList["longwang_auto_check"].selected = false
    }

    refreshFrame() {
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.DragonBoss)
        // {
        //         maxIndex: 最新通关关卡
        //         npcList: {[npcIndex]=value}  --这个是每一关的情况（是否领取奖励，评星） opDragonBossIndexConfig
        //         stageList: {[charpterIndex] = value}  --这个是每章节的情况，领取了那种累星奖励 opDragonBossChapterConfig
        //         minStageClearForce: {[npcIndex]=[名字, 战力, prlId, videoId or null]}
        // }
        this.curConfig = null
        if (!actInfo || !actInfo.npcList) {
            return
        }

        let list = []
        if (this.curChapter < 0) {                                                                                            //默认是第一个能打的
            for (let k in GameConfig.CopyDragonConfig) {
                let v = GameConfig.CopyDragonConfig[k]
                table_insert(list, v)
            }
            table_sort(list, function(a, b) {return a.index - b.index})
            for (let i = 0; i < list.length; i++) {
                let config = list[i]
                if (actInfo.npcList[config.index] == null || (actInfo.npcList[config.index] & opDragonBossIndexConfig.getPrize) != opDragonBossIndexConfig.getPrize) {
                    this.curChapter = config.chapter
                    break
                }
            }
        }

        if (this.curChapter < 0) {
            let curIndex = MathUtil.clamp(actInfo.maxIndex + 1, 11, actInfo.maxIndex + 1)                                     //索引，不是序号
            if (GameConfig.CopyDragonConfig[curIndex]) {
                this.curChapter = GameConfig.CopyDragonConfig[curIndex].chapter
            } else if (GameConfig.CopyDragonConfig[actInfo.maxIndex]) {
                this.curChapter = GameConfig.CopyDragonConfig[actInfo.maxIndex].chapter
            } else {
                this.curChapter = 11
            }
        }

        //下次首通特殊的奖励
        let list1 = []                                                                                          //默认是第一个能打的
        for (let k in GameConfig.CopyDragonConfig) {
             let v = GameConfig.CopyDragonConfig[k]
            table_insert(list1, v)
        }
        table_sort(list1, function(a, b) {return a.index - b.index})


        let startIndex = actInfo.maxIndex  - 10
        if(startIndex < 0){
            startIndex = 0
        }

        for(let i = startIndex;i<size_t(list1);i++){
            let v = list1[i]
            let showFirstItem = v.showFirstItem
            if(showFirstItem && size_t(showFirstItem)>1){
                this.nextRewardConfig = v
                break
            }
        }
   
        if(this.nextRewardConfig != null){
            let [entryId, count] = this.nextRewardConfig.showFirstItem[1]
            this.mElemList["first_item_group"].visible = true
            this.mElemList["firstItem"].updateByEntry(entryId, count)
            let nextRewardIndex = this.nextRewardConfig.index - 10
            let itemName = ItemSystem.getInstance().getItemName(entryId)
            let rdStr = String.format(Localize_cns("COPY_TXT48"),nextRewardIndex,itemName)
            AddRdContent(this.mElemList["first_tip_rd"], rdStr, "ht_20_cc_stroke", "white")
        }else{
            this.mElemList["first_item_group"].visible = false
        }
        //下次首通特殊的奖励end
        
        list = []
        this.curOpenChapter = this.curChapter

        let lastOpenChatper = true                  //可预览的最新章节是否已互到最后一章
        for (let _ in GameConfig.CopyDragonConfig) {
            let config = GameConfig.CopyDragonConfig[_]
            if (config.chapter == this.curChapter) {
                table_insert(list, config)
            }

            let maxIndex = actInfo.maxIndex == 0 ? this.beginIndex : actInfo.maxIndex
            if (config.index <= maxIndex + 6) {
                if (config.chapter > this.curOpenChapter) {
                    this.curOpenChapter = config.chapter
                }
            } else {
                lastOpenChatper = false
            }
        }
        table_sort(list, function (a, b) { return a.index - b.index })
        if (this.curIndex == -1) {
            for (let i = 0; i < list.length; i++) {
                let v = list[i]
                if (actInfo.npcList[v.index] == null || (actInfo.npcList[v.index] & opDragonBossIndexConfig.getPrize) != opDragonBossIndexConfig.getPrize) {
                    this.curIndex = i
                    break
                } else if (i == list.length - 1) {                               //当前章最高关卡
                    this.curIndex = i
                }
            }
            this.curIndex = MathUtil.clamp(this.curIndex, 0, list.length - 1)
        }

        this.controlDataTable = {}

        let config = list[this.curIndex]
        let sumStar = 0
        for (let i = 0; i < 6; i++) {
            if (list[i]) {
                this.mElemList["longwang_copy" + (i + 1)].visible = true
                this.mElemList["longwang_copy" + (i + 1) + "_check"].visible = (this.curIndex == i)

                this.mElemList["longwang_copy" + (i + 1) + "_gained"].visible = false
                for (let j = 0; j < 3; j++) {
                    this.mElemList["longwang_copy" + (i + 1) + "_star" + (j + 1)].visible = false
                }

                let v = list[i]
                if (actInfo.npcList[v.index]) {
                    if ((actInfo.npcList[v.index] & opDragonBossIndexConfig.getPrize) == opDragonBossIndexConfig.getPrize) {
                        this.mElemList["longwang_copy" + (i + 1) + "_gained"].visible = true
                    }
                    let starCount = 0
                    if ((actInfo.npcList[v.index] & opDragonBossIndexConfig.threeStar) == opDragonBossIndexConfig.threeStar) {
                        starCount = 3
                    } else if ((actInfo.npcList[v.index] & opDragonBossIndexConfig.twoStar) == opDragonBossIndexConfig.twoStar) {
                        starCount = 2
                    } else if ((actInfo.npcList[v.index] & opDragonBossIndexConfig.oneStar) == opDragonBossIndexConfig.oneStar) {
                        starCount = 1
                    }
                    for (let j = 0; j < starCount; j++) {
                        this.mElemList["longwang_copy" + (i + 1) + "_star" + (j + 1)].visible = true
                    }
                    sumStar = sumStar + starCount
                }

                this.controlDataTable["longwang_copy" + (i + 1) + "_img"] = i
            } else {
                this.mElemList["longwang_copy" + (i + 1)].visible = false
            }
        }

        if (!config) {
            return
        }

        this.controlDataTable["longwang_wabao"] = config
        //章节名称
        this.mElemList["longwang_copy_name"].text = config.chapterName
        AddRdContent(this.mElemList["longwang_copy_starRd"], "#STAR" + sumStar + "/" + 3 * list.length, "ht_20_cc_stroke", "white")
        this.mElemList["longwang_cur"].text = String.format(Localize_cns("COPY_TXT17"), config.campaign)

        //首通奖励
        for (let i = 0; i < 2; i++) {
            if (config.showFirstItem[i] == null) {
                this.mElemList["firstPassItemBox" + i].setVisible(false)
            } else {
                let [entryId, count] = config.showFirstItem[i]
                this.mElemList["firstPassItemBox" + i].setVisible(true)
                this.mElemList["firstPassItemBox" + i].updateByEntry(entryId, count)

                this.mElemList["firstPass_gained" + i].visible = false
                if (actInfo.npcList[config.index]) {
                    if ((actInfo.npcList[config.index] & opDragonBossIndexConfig.oneStar) == opDragonBossIndexConfig.oneStar
                        || (actInfo.npcList[config.index] & opDragonBossIndexConfig.twoStar) == opDragonBossIndexConfig.twoStar
                        || (actInfo.npcList[config.index] & opDragonBossIndexConfig.threeStar) == opDragonBossIndexConfig.threeStar) {

                        this.mElemList["firstPass_gained" + i].visible = true
                    }
                }
            }
        }
        //通关奖励
        for (let i = 0; i < 3; i++) {
            if (config.showPassItem[i] == null) {
                this.mElemList["passItemBox" + i].setVisible(false)
            } else {
                let [entryId, count] = config.showPassItem[i]
                this.mElemList["passItemBox" + i].setVisible(true)
                this.mElemList["passItemBox" + i].updateByEntry(entryId, count)

                this.mElemList["pass_gained" + i].visible = false
                if (actInfo.npcList[config.index]) {
                    if ((actInfo.npcList[config.index] & opDragonBossIndexConfig.getPrize) == opDragonBossIndexConfig.getPrize) {

                        this.mElemList["pass_gained" + i].visible = true
                    }
                }
            }
        }
        //星级宝图
        for (let i = 1; i <= 3; i++) {
            this.mElemList["longwang_baotu_group" + i].visible = false
        }
        let index = 0
        let l = ["sixStar", "twelve", "eighteen"]
        let minStar = 0
        for (let i = 1; i <= 3 * list.length; i++) {
            if (config.starPrize[i]) {
                index = index + 1
                if (this.mElemList["longwang_baotu_group" + index]) {
                    this.mElemList["longwang_baotu_group" + index].visible = true
                    // this.mElemList["longwang_baotu_group" + index].x = 86 + 394 / (3 * list.length) * (i - 1)
                    this.mElemList["longwang_baotu_star" + index].text = i
                    this.mElemList["longwang__baotu_gained" + index].visible = false

                    this.controlDataTable["longwang_baotu_btn" + index] = [false, i, sumStar, config.starPrize[i]]                  //false表示未领取

                    if (actInfo.stageList[this.curChapter]) {
                        if ((actInfo.stageList[this.curChapter] & opDragonBossChapterConfig[l[index - 1]]) == opDragonBossChapterConfig[l[index - 1]]) {

                            this.mElemList["longwang__baotu_gained" + index].visible = true
                            this.controlDataTable["longwang_baotu_btn" + index] = [true, i, sumStar, config.starPrize[i]]                  //true表示已领取
                        }
                    }

                    if (index == 1) {
                        minStar = i
                    }
                }
            }
        }
        let imb = this.mElemList["longwang_star_imb"]
        UiUtil.updateProgress(imb, sumStar - minStar, 3 * list.length - minStar)

        //刷新箭头部分
        //章节索引从11开始
        this.mElemList["longwang_pre"].visible = false
        this.mElemList["longwang_next"].visible = false
        this.mElemList["longwang_next"].enabled = false
        if (this.curChapter > this.beginIndex) {
            this.mElemList["longwang_pre"].visible = true
        }

        if (lastOpenChatper == false) {
            this.mElemList["longwang_next"].visible = true

            this.mElemList["longwang_next"].enabled = this.curChapter != this.curOpenChapter
        } else {
            this.mElemList["longwang_next"].visible = false
        }

        this.curConfig = config
        this.updatePassRecord()
        RpcProxy.call("C2G_GetBossActivityRecInfo", OrdinaryActivityIndex.DragonBoss, config.index)
    }

    updateWnd() {
        this.refreshFrame()
        this.mParentWnd.refreshDotTips()
    }

    updatePassRecord() {
        this.mElemList["video_group1"].visible = false
        if (this.curConfig == null) {
            return
        }
        let minStageClearForce =  GetActivity(ActivityDefine.Boss).getRecInfo(OrdinaryActivityIndex.DragonBoss, this.curConfig.index) //通关录像
        if(minStageClearForce && size_t(minStageClearForce) != 0){
            let minStageClearForceData = minStageClearForce
            this.mElemList["video_group1"].visible = true
            this.mElemList["longwang_video_btn"].text = minStageClearForceData[0]
            this.mElemList["longwang_power"].text = String.format(Localize_cns("FIGHT_TXT13"),MakeLongNumberShort(minStageClearForceData[1]))
            // this.mElemList["longwang_name"].text = String.format(Localize_cns("FIGHT_TXT14"), minStageClearForceData[0])
            this.mElemList["longwang_link_record"].setContent("#nor" + String.format(Localize_cns("FIGHT_TXT14"), minStageClearForceData[0]))
            this.mElemList["longwang_link_record"].setCallBack(this.onClickRecord, this, [minStageClearForceData[2], minStageClearForceData[3]])
        }
    }

    applyActInfo() {
        RpcProxy.call("C2G_GetBossActivityInfo", OrdinaryActivityIndex.DragonBoss)
    }

    refreshAutoFight() {
        if (this.mElemList["longwang_auto_check"].selected == true) {                       //勾选了自动挑战
            if (!this.timerList["autoFight"]) {                                              //自动挑战
                let endTime = GetServerTime() + 10

                let tick = function (delay) {
                    //结算界面还在时不倒计时
                    let wnd = WngMrg.getInstance().getWindow("FightDragonPrizeFrame")
                    if (wnd.isVisible() == true) {
                        endTime = GetServerTime() + 10
                        return
                    }

                    let leftTime = endTime - GetServerTime()
                    let reset = false
                    if (leftTime < 0) {
                        reset = this.onClickFight({ target: { name: "longwang_wabao" } })
                        leftTime = 0

                        if (this.timerList["autoFight"]) {
                            KillTimer(this.timerList["autoFight"])
                            delete this.timerList["autoFight"]
                        }
                    }

                    if (reset) {
                        this.mElemList["longwang_auto_check"].selected = false
                        this.mElemList["longwang_auto_tl"].text = Localize_cns("COPY_TXT35")
                    } else {
                        this.mElemList["longwang_auto_tl"].text = String.format(Localize_cns("COPY_TXT36"), leftTime)
                    }
                }
                this.timerList["autoFight"] = SetTimer(tick, this, 200, true)
            }
        } else {
            if (this.timerList["autoFight"]) {
                KillTimer(this.timerList["autoFight"])
                delete this.timerList["autoFight"]
            }
            this.mElemList["longwang_auto_tl"].text = Localize_cns("COPY_TXT35")
        }
    }

    //刷新红点
    refreshDotTipsImp() {
        if (size_t(this.controlDataTable) == 0) {
            return
        }
        for (let i = 1; i <= 3; i++) {
            // this.controlDataTable["longwang_baotu_btn" + index] = [false, i, sumStar, config.starPrize[i]]
            let [flag, star, sumStar, _] = this.controlDataTable["longwang_baotu_btn" + i]
            if (flag == false) {                            //未领取
                if (star <= sumStar) {
                    this.mParentWnd.createDotTipsUI(this.mElemList["longwang_baotu_btn" + i])
                }
            }
        }

        //左侧可领取红点
        this.checkDotTipsPre()

        //右侧可领取红点
        this.checkDotTipsNext()
    }

    checkDotTipsPre() {
        for (let i = this.curChapter - 1; i >= this.beginIndex; i--) {
            if (this.checkDotTips(i)) {
                this.mParentWnd.createDotTipsUI(this.mElemList["longwang_pre"])
            }
        }
    }

    checkDotTipsNext() {
        for (let i = this.curChapter + 1; i <= this.curOpenChapter; i++) {
            if (this.checkDotTips(i)) {
                this.mParentWnd.createDotTipsUI(this.mElemList["longwang_next"])
            }
        }
    }

    checkDotTips(chapterId) {
        let l = ["sixStar", "twelve", "eighteen"]
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.DragonBoss)
        if (!actInfo) {
            return false
        }

        let list = []
        for (let i in GameConfig.CopyDragonConfig) {
            if (GameConfig.CopyDragonConfig[i].chapter == chapterId) {
                table_insert(list, GameConfig.CopyDragonConfig[i])
            }

            if (size_t(list) >= 6) {
                break
            }
        }

        table_sort(list, function (a, b) {
            return a.index - b.index
        })

        if (size_t(list) == 0) {
            return false
        }

        let sumStar = 0
        let isPass = true
        for (let i = 0; i < 6; i++) {
            let config = list[i]
            if (config) {
                if (actInfo.npcList[config.index]) {
                    let starCount = 0
                    if ((actInfo.npcList[config.index] & opDragonBossIndexConfig.threeStar) == opDragonBossIndexConfig.threeStar) {
                        starCount = 3
                    } else if ((actInfo.npcList[config.index] & opDragonBossIndexConfig.twoStar) == opDragonBossIndexConfig.twoStar) {
                        starCount = 2
                    } else if ((actInfo.npcList[config.index] & opDragonBossIndexConfig.oneStar) == opDragonBossIndexConfig.oneStar) {
                        starCount = 1
                    }
                    if (starCount == 0) {
                        isPass = false
                    }
                    sumStar = sumStar + starCount
                }
            }
        }

        let prize = list[0].starPrize || {}
        let index = 0
        let hadGet = false
        for (let i in prize) {
            index = index + 1
            if (actInfo.stageList[chapterId]) {
                if ((actInfo.stageList[chapterId] & opDragonBossChapterConfig[l[index - 1]]) == opDragonBossChapterConfig[l[index - 1]]) {
                    //已领取
                    hadGet = true
                } else {
                    hadGet = false
                }
            }

            if (!hadGet) {
                if (tonumber(i) <= sumStar) {
                    return [prize[i], tonumber(i), isPass]
                }
            }
        }

        return false
    }

    checkGuideAuto() {
        if (!TaskSystem.getInstance().isTaskTypeExsit(taskFinishId.COPY_DRAGON_START_PRIZE)) {
            return
        }

        var info = this.checkDotTips(this.beginIndex)
        if (info && info[2]) {
            let callback = function () {
                RpcProxy.call("C2G_GetActivityStagePrize", OrdinaryActivityIndex.DragonBoss, [this.beginIndex, info[1]])
                this.applyActInfo()
                return false
            }

            let list = AnalyPrizeFormat(info[0])
            let wnd = WngMrg.getInstance().getWindow("NotifyPrizeGainFrame")
            wnd.showPrizeGainFrame(callback, this, list, Localize_cns("COPY_TXT31"), String.format(Localize_cns("COPY_TXT32"), info[1]), Localize_cns("FIGHT_TXT9"))

            //切页
            // this.curChapter = this.beginIndex
            // this.curIndex = 0
            // this.refreshFrame()
        }
    }

    ///////////////////////////////////////////////////////////////////////
    onClickCamp(args) {
        let name = args.target.name

        if (this.controlDataTable[name] == null) {
            return
        }

        let index = this.controlDataTable[name]
        if (index == this.curIndex) {
            return
        }

        this.curIndex = index
        this.refreshFrame()
    }

    onClickPre(args) {
        if (this.curChapter - 1 < this.beginIndex) {
            return
        }
        this.curChapter = this.curChapter - 1

        this.curIndex = -1
        this.refreshFrame()
        this.mParentWnd.refreshDotTips()
    }

    onClickNext(args) {
        if (this.curChapter + 1 > this.curOpenChapter) {
            return
        }
        this.curChapter = this.curChapter + 1

        this.curIndex = -1
        this.refreshFrame()
        this.mParentWnd.refreshDotTips()
    }

    onClickOnekey(args) {
        if (GetHeroProperty("VIP_level") < opDragonBossBaseConfig.sweepVipLevel) {
            MsgSystem.addTagTips(String.format(Localize_cns("COMMON_TXT10"), opDragonBossBaseConfig.sweepVipLevel))
            return
        }
        
        if (CheckActivityState() == false) {
            return
        }
        
        if (CheckFightState() == true) {
            return
        }
        
        if (CheckBeiBaoEquipWillFull()) {
            return
        }

        let flag = false                            //是否可一键扫荡
        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.DragonBoss)
        if (actInfo && (actInfo.npcList)) {
            for (let _ in actInfo.npcList) {
                let v = actInfo.npcList[_]
                if ((v & opDragonBossIndexConfig.threeStar) == opDragonBossIndexConfig.threeStar && (v & opDragonBossIndexConfig.getPrize) != opDragonBossIndexConfig.getPrize) {
                    flag = true
                    break
                }
            }
        }

        if (flag == false) {
            MsgSystem.addTagTips(Localize_cns("COPY_TXT38"))
            return
        } else {
            this.curChapter = -1
            this.curIndex = -1
            RpcProxy.call("C2G_SweepBossActivityEx", OrdinaryActivityIndex.DragonBoss, [])
        }

    }

    onClickFight(args) {
        let name = args.target.name

        if (this.controlDataTable[name] == null) {
            return
        }

        let config = this.controlDataTable[name]

        let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.DragonBoss)
        // {
        //         maxIndex: 最新通关关卡
        //         npcList: {[npcIndex]=value}  --这个是每一关的情况（是否领取奖励，评星） opDragonBossIndexConfig
        //         stageList: {[charpterIndex] = value}  --这个是每章节的情况，领取了那种累星奖励 opDragonBossChapterConfig
        // }
        if (!actInfo || !actInfo.npcList) {
            return
        }

        if (CheckActivityState() == false) {
            return
        }

        if (CheckFightState() == true) {
            return
        }

        let heroLv = GetHeroProperty("level")
        let needLv = config.level
        if (heroLv < needLv) {
            MsgSystem.addTagTips(String.format(Localize_cns("COPY_TXT43"), needLv))
            return true
        }

        if (actInfo.maxIndex == 0) {
            if (config.index == this.beginIndex) {
                RpcProxy.call("C2G_CreateBossFight", OrdinaryActivityIndex.DragonBoss, config.index)
            } else {
                MsgSystem.addTagTips(String.format(Localize_cns("COPY_TXT18"), 1))
                return true
            }
        } else if (config.index > actInfo.maxIndex + 1) {
            MsgSystem.addTagTips(String.format(Localize_cns("COPY_TXT18"), actInfo.maxIndex + 1 - this.beginIndexEx))
            return true
        } else {
            RpcProxy.call("C2G_CreateBossFight", OrdinaryActivityIndex.DragonBoss, config.index)
        }
    }

    onClickStarPrize(args) {
        let name = args.target.name

        if (this.controlDataTable[name] == null) {
            return
        }

        let [bGained, star, sumStar, itemList] = this.controlDataTable[name]                         //[true, i, sumStar, config.starPrize[i]]
        if (bGained == false && star <= sumStar) {
            let _this = this
            let callback = function () {
                RpcProxy.call("C2G_GetActivityStagePrize", OrdinaryActivityIndex.DragonBoss, [_this.curChapter, star])
                return false
            }
            let list = AnalyPrizeFormat(itemList)
            let wnd = WngMrg.getInstance().getWindow("NotifyPrizeGainFrame")
            wnd.showPrizeGainFrame(callback, this, list, Localize_cns("COPY_TXT31"), String.format(Localize_cns("COPY_TXT32"), star), Localize_cns("FIGHT_TXT9"))

        } else {
            //弹出奖励预览界面
            let list = AnalyPrizeFormat(itemList)
            let wnd = WngMrg.getInstance().getWindow("NotifyPrizeGainFrame")
            wnd.showPrizeGainFrame(null, null, list, Localize_cns("COPY_TXT31"), String.format(Localize_cns("COPY_TXT32"), star), Localize_cns("CONFIRM_INFO"))
        }

    }

    onClickRank(args) {
        WngMrg.getInstance().showWindow("CopyStarRankFrame")
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