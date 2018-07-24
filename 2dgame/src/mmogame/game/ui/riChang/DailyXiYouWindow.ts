class DailyXiYouWindow extends BaseCtrlWnd {
    mElemList
    scroll: UIScrollList;
    select
    endIndex
    maxCount
    taskConfig
    actor: UIActorView

    public initObj(...params: any[]) {
        this.select = -1
        this.endIndex = -1
        this.maxCount = -1

        let config = {
            [100]: { eventName : "jingyanyaomo"},  //经验妖魔
            [101]: { eventName : "zuduifuben", param: 0 },//组队副本	
            [102]: { eventName : "boss", param: 0 },	//个人BOSS
            [103]: { eventName : "boss", param: 1 },	//全民BOSS
            [104]: { eventName : "champion", param: 0 },	//武林擂台
            [105]: { eventName : "mat_copy", param: 0 },	//材料副本
            [106]: { eventName : "escort" },	//西游护送
            [107]: { eventName : "ronglian"},	//装备熔炼
            [108]: {},
        }
        this.taskConfig = config
    }
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        var elemInfo = [
            { ["name"]: "btn_upgrade", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUpClick },
            { ["name"]: "btn_find", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onFindBack },
            { ["name"]: "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLeftClick },
            { ["name"]: "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRightClick },
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        let group = <eui.Group>this.mElemList["group_scroll"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)

        this.mElemList["rd_hp"].setAlignFlag(gui.Flag.LEFT_CENTER)
        this.mElemList["rd_att"].setAlignFlag(gui.Flag.LEFT_CENTER)
        this.mElemList["rd_def"].setAlignFlag(gui.Flag.LEFT_CENTER)
       // this.mElemList["rd_judge"].setAlignFlag(gui.Flag.CENTER_CENTER)

        this.actor = UIActorView.newObj(this.mLayoutNode, "model", 0, 0, this.mElemList["actor"])
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mElemList["group_xiYou"].visible = true;
        //  this.mElemList["group_pro"].visible = false
        this.mElemList["title"].text = Localize_cns("DAILY_TXT4")
        this.onRefresh()

    }

    public onHide(): void {
        this.mElemList["group_xiYou"].visible = false;
        this.actor.clearView()
    }

    updateWnd() {
        this.onRefresh()
    }

    onRefresh() {

        let actInfo = GetActivity(ActivityDefine.Boss).getXiyouInfo()

        if (size_t(actInfo) == 0) return

        let level = actInfo.level || 0
        this.mElemList["label_lv"].text = "Lv." + level


        let xiyouConfig = GameConfig.EveryDayLiLianUpConfig[level]
        let config = table_effect(xiyouConfig.effects)

        //属性显示 测试数据
        let hp = config.maxhp
        let att = config.demage
        let def = config.hujia
        let hpStr = String.format(Localize_cns("DAILY_TXT5"), hp)
        AddRdContent(this.mElemList["rd_hp"], hpStr, "ht_20_cc")
        let attStr = String.format(Localize_cns("DAILY_TXT6"), att)
        AddRdContent(this.mElemList["rd_att"], attStr, "ht_20_cc")
        let defStr = String.format(Localize_cns("DAILY_TXT7"), def)
        AddRdContent(this.mElemList["rd_def"], defStr, "ht_20_cc")

        //战力
        let force = actInfo.force
        DrawNumberStringImage(this.mElemList["bImage"], "zhanLi_", "z" + force, 0, 0, -3)

        let curexp = actInfo.curexp || 0
        let maxexp = xiyouConfig.exp
        //奖励
        let prizeFormat = xiyouConfig.prize
        if (prizeFormat != null && size_t(prizeFormat) != 0) {
            let prizeList = AnalyPrizeFormat(prizeFormat)
            this.onRefreshPrize(prizeList)
            this.mElemList["group_prize"].visible = true
            // this.mElemList["label_jiesuo"].visible = isShow
            this.mElemList["label_progress"].text = curexp + "/" + maxexp
            this.mElemList["btn_upgrade"].enabled = true
        } else {
            this.mElemList["group_prize"].visible = false
            curexp = 1
            maxexp = 1
            this.mElemList["label_progress"].text = Localize_cns("ROLE_TXT31")
            this.mElemList["btn_upgrade"].enabled = false
        }


        UiUtil.updateProgress(this.mElemList["xiyou_pro"], curexp, maxexp)

        let shapeConfig = GameConfig.DailyLiLianShapeConfig
        this.endIndex = -1
        for (let k in shapeConfig) {
            let shape = shapeConfig[k]
            let dataKey = tonumber(k)
            if (shape.level > level) {
                if (this.endIndex == -1) {
                    this.endIndex = dataKey
                }
            } else {
                this.select = dataKey
            }
            if (this.maxCount <= dataKey) {
                this.maxCount = dataKey
            }
        }

        if (this.select == -1) {
            this.select = 1
        }
        this.onRefreshChose()
        //
        this.refreshFrame()

    }

    onRefreshPrize(list) {
        for (let i = 1; i <= size_t(list); i++) {
            if (!this.mElemList["xiYouPrizeBox" + i]) {
                this.mElemList["xiYouPrizeBox" + i] = UIItemBox.newObj(this.mLayoutNode, "xiYouPrizeBox" + i, 0, 0, this.mElemList["group_prize"])
            }
            let item = list[i - 1]
            this.mElemList["xiYouPrizeBox" + i].updateByEntry(item[0], item[1])
        }
    }

    refreshFrame() {

        let taskList = GetActivity(ActivityDefine.Boss).getXiYouTaskList() //|| GameConfig.EveryDayLiLianTaskConfig

        if (size_t(taskList) == 0) return

        let group = <eui.Group>this.mElemList["group_scroll"]
        this.scroll.clearItemList()
        ///	let list = []
        for (let i = 0; i < size_t(taskList); i++) {
            let v = taskList[i]
            let [window, flag] = this.scroll.getItemWindow(i, group.width, 61, 0, 0)
            if (flag == true) {
                this.initItemWindow(window)
            }
            this.refreshItemWindow(window, v, i)
        }
        this.scroll.refreshScroll()
    }

    initItemWindow(window) {
        let name = window.name
        let w = window.width
        let h = window.height

        let elemInfo = [
            { ["index_type"]: eui.Group, ["name"]: "groupTask_" + name, ["title"]: null, ["x"]: 0, ["y"]: 7, ["w"]: w, ["h"]: h, },
            { ["index_type"]: gui.Grid9Image, ["name"]: "bg_" + name, ["parent"]: "groupTask_" + name, ["title"]: null, ["image"]: "ty_uiDi03", ["x"]: 10, ["y"]: 0, ["w"]: w - 20, ["h"]: h, ["messageFlag"]: true },
            { ["index_type"]: eui.Label, ["name"]: "name_" + name, ["parent"]: "groupTask_" + name, ["title"]: "", ["font"]: "ht_24_lc", ["color"]: gui.Color.ublack, ["image"]: "", ["x"]: 20, ["y"]: 0, ["w"]: 147, ["h"]: h },
            { ["index_type"]: gui.RichDisplayer, ["name"]: "twice_" + name, ["parent"]: "groupTask_" + name, ["title"]: null, ["image"]: "", ["x"]: 147, ["y"]: 0, ["w"]: 123, ["h"]: h },
            { ["index_type"]: eui.Label, ["name"]: "exp_" + name, ["parent"]: "groupTask_" + name, ["title"]: "", ["font"]: "ht_20_cc", ["color"]: gui.Color.deepskyblue, ["image"]: "", ["x"]: 270, ["y"]: 0, ["w"]: 147, ["h"]: h },
            { ["index_type"]: gui.Button, ["name"]: "btn_" + name, ["parent"]: "groupTask_" + name, ["title"]: Localize_cns("TASK_PANEL_QIANWANG"), ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["image"]: "ty_tongYongBt2", ["x"]: 450, ["y"]: 6, ["w"]: 94, ["h"]: 49, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGotoClick },
            { ["index_type"]: eui.Label, ["name"]: "finish_" + name, ["parent"]: "groupTask_" + name, ["title"]: Localize_cns("FINISHED"), ["color"]: gui.Color.ublack, ["font"]: "ht_20_cc", ["image"]: "", ["x"]: 450, ["y"]: 15, ["w"]: 94, ["h"]: 30 },
        ]
        UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this, window)

        this.mElemList["twice_" + name].setAlignFlag(gui.Flag.CENTER_CENTER)
        this.mElemList["finish_" + name].visible = false
        this.mElemList["btn_" + name].visible = false

    }

    refreshItemWindow(window, data, index) {
        let name = window.name
        //任务名字
        this.mElemList["name_" + name].text = data.name
        //任务次数
        let twiceColor = "#red"
        this.mElemList["finish_" + name].visible = false
        this.mElemList["btn_" + name].visible = false
        if (data.curTwice >= data.maxCount) {
            twiceColor = "#darkgreen" 
            this.mElemList["finish_" + name].visible = true
        } else {
            this.mElemList["btn_" + name].visible = true
        }
        let twice = data.curTwice || 0
        AddRdContent(this.mElemList["twice_" + name], twiceColor + twice + "/" + data.maxCount, "ht_20_cc")

        //单次经验
        this.mElemList["exp_" + name].text = data.exp + Localize_cns("DAILY_LILIAN_TXT1")
    }

    ///换模型
    onRefreshChose() {
        this.mElemList["btn_left"].visible = true
        this.mElemList["btn_right"].visible = true
        this.mElemList["image_yulan"].visible = false
        this.mElemList["image_jiHuo"].visible = true
        this.mElemList["rd_judge"].visible = false

        let tempConfig = GameConfig.DailyLiLianShapeConfig[this.select]

        if (this.select == 1) {
            this.mElemList["btn_left"].visible = false
        }

        if (this.endIndex != -1) {

            if (this.select == (this.endIndex - 1)) {
                this.mElemList["image_yulan"].visible = true
            }
            if (this.select == this.endIndex) {
                this.mElemList["btn_right"].visible = false
                this.mElemList["image_jiHuo"].visible = false
                this.mElemList["rd_judge"].visible = true
                let str = String.format(Localize_cns("DAILY_JIHUO"), tempConfig.level)
                this.mElemList["label_jie_lock"].text = str

                let totalExp = 0  //今日剩余的
                let everyDayExp = 0 //每日的经验
                let taskList = GetActivity(ActivityDefine.Boss).getXiYouTaskList()
                let actInfo = GetActivity(ActivityDefine.Boss).getXiyouInfo()
                let nowLevel = tempConfig.level
                //let xiyouConfig = GameConfig.EveryDayLiLianUpConfig[nowLevel]   //下一个等级的
                //let nowXiyouConfig = GameConfig.EveryDayLiLianUpConfig[actInfo.level] //当前等级的信息
                let taskConfig = GameConfig.EveryDayLiLianTaskConfig

                for (let k in taskList) {
                    let taskInfo = taskList[k]
                    let curTwice = taskInfo.curTwice || 0
                    totalExp += taskInfo.exp * (taskInfo.maxCount - curTwice)
                }

                let needExp = totalExp
                for (let k = actInfo.level + 1; k < nowLevel; k++) {
                    let tempUpConfig = GameConfig.EveryDayLiLianUpConfig[k]
                    needExp += tempUpConfig.exp
                }

                for (let k in taskConfig) {
                    let taskInfo = taskConfig[k]
                    everyDayExp += taskInfo.exp * taskInfo.maxCount
                }

                //今天解锁 -- 剩余的足够升级
                let lockStr = ""
                if (totalExp != 0 && totalExp >= needExp) {
                    lockStr += Localize_cns("DAILY_UNLOCK_TODAY")
                } else {
                    let count = 1
                    needExp -= totalExp
                    while (needExp > 0) {
                        count += 1
                        needExp -= everyDayExp
                    }
                    if (count == 2) {
                        lockStr += Localize_cns("DAILY_UNLOCK_TOMORROW")
                    } else {
                        lockStr += String.format(Localize_cns("DAILY_UNLOCK_DAYS"), count)
                    }
                }

                this.mElemList["label_day_lock"].text = lockStr

               // AddRdContent(this.mElemList["rd_judge"], lockStr, "ht_20_cc_stroke", "lime")
            }

        } else {
            if (this.select == this.maxCount) {
                this.mElemList["btn_right"].visible = false
            }
        }

        this.mElemList["shape_name"].text = tempConfig.name

        //更新模型
        this.actor.updateByPlayer(tempConfig.shape)

    }

    ///------------响应事件
    onUpClick() {
        let actInfo = GetActivity(ActivityDefine.Boss).getXiyouInfo()
        let xiyouConfig = GameConfig.EveryDayLiLianUpConfig[actInfo.level]
        if (xiyouConfig == null) return
        if (actInfo.curexp < xiyouConfig.exp) return
        //发送升级协议
        RpcProxy.call("C2G_XiyouLilian_ActiveLevelUp")
    }

    onGotoClick(args) {
        let name = args.target.name;
        let index = name.replace(/[^0-9]/ig, "");

        let taskList = GetActivity(ActivityDefine.Boss).getXiYouTaskList()
        let task = taskList[index]
        if (task == null) return
        let v = this.taskConfig[task.ID]
        if (v) {
            FastJumpSystem.getInstance().gotoFastJump(v.eventName, v.param)
        }


        /*let wnd = WngMrg.getInstance().getWindow(task.finish[0])
        let tabIndex = task.finish[1]
 
        wnd.showWithIndex(tabIndex)*/

    }

    onFindBack() {
        let creatTime = RoleSystem.getInstance().getRoleCreateTime()
        
        let showTime = GetTomorrowTime(creatTime)
        let osTime = GetServerTime()
        let isShow = osTime >= showTime
        if(!isShow){
            MsgSystem.addTagTips(Localize_cns("DAILY_NO_FINDBACK"))
            return
        }
        let wnd: DailyFindBackFrame = WngMrg.getInstance().getWindow("DailyFindBackFrame")
        wnd.showWnd()
    }


    onLeftClick() {
        if (this.select <= 1) return
        this.select -= 1
        this.onRefreshChose()
    }

    onRightClick() {
        let endIndex = this.endIndex
        if (endIndex == -1)
            endIndex = this.maxCount
        if (this.select >= endIndex) return
        this.select += 1
        this.onRefreshChose()
    }

} // TypeScript file