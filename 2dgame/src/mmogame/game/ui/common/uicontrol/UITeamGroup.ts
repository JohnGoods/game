// TypeScript file
/*
作者:
	lqx

创建时间：
	2017.03.17(星期五)

意图：
	空提示

公共接口：

*/
class UITeamGroup extends BaseCtrlWnd {
    controlDataTable: any;
	mParentGroup: any;
	mLayoutPath: any;
	name: string;
    autoJoinDelay: number;
    autoFightDelay: number;
    timerList: any;
    activityData: any;
    handlerList: any;
    bJoinRobotMember: boolean;
    bJoinFunc: boolean;                     //是否显示自动快速加入功能

    static AUTO_JOIN_TIME: number = 10 * 1000

    static CHECK_QUICK_JOIN: number = 1                       //快速加入队伍
    static CHECK_CREATE_TEAM: number = 2                      //创建队伍

    public initObj(...params: any[]) {
        this.controlDataTable = {};
        this.autoJoinDelay = UITeamGroup.AUTO_JOIN_TIME;
        this.autoFightDelay = 60;
        this.timerList = {}
        this.activityData = null
        this.handlerList = {}
        this.bJoinRobotMember = true
        this.bJoinFunc = true

		this.mParentGroup = params[2]
		this.mLayoutPath = params[3]
		this.name = params[4]
    }

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;

        // var elemInfo = [
		// 	//组队控件皮肤
		// 	{ ["index_type"] : eui.Component,		["name"]: this.name, ["image"]: "", ["skinName"]: this.mLayoutPath, },

		// ];
		// UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this, this.mParentGroup);
		// UiUtil.initElemWithComponent( this.mElemList[this.name], this.mElemList, this, this.name)
        UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mParentGroup)
        
        var elemInfo1 = [
			{ ["name"]: this.name + "team_tick1", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickKick},
			{ ["name"]: this.name + "team_tick2", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickKick},
            { ["name"]: this.name + "team_leave_btn", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickLeave},
            { ["name"]: this.name + "fight_btn", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFight},
            { ["name"]: this.name + "team_create_btn", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCreate},
            { ["name"]: this.name + "team_join_btn", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickJoin},

            
            { ["name"]: this.name + "join_counter_check", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClicJoinCheck},
            { ["name"]: this.name + "team_counter_check", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClicTeamCheck},
            { ["name"]: this.name + "fight_counter_check", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClicFightCheck},

		];
		UiUtil.initElem(elemInfo1, this.mElemList[this.name], this.mElemList, this);
        // let group = <eui.Group>this.mElemList["jie_scroll_group"]
        // this.scroll = UIScrollList.newObj(this.mLayoutNode, "jie_scroll", 0, 0, group.width, group.height, group)
        this.mElemList[this.name + "team_counter_check"].selected = true
        this.mElemList[this.name + "fight_counter_check"].selected = true

    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.TEAM_INFO_UPDATE, this.refreshFrame, this)
        RegisterEvent(EventDefine.TEAM_CREATE, this.onTeamCreate, this)
        // RegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        // this.mElemList["jie_group"].visible = true
        // this.mElemList["label_wndName"].text = Localize_cns("BOSS_TXT16")

        if (this.mParentGroup) {
            this.mParentGroup.visible = true
        } else {
    		this.mElemList[this.name].visible = true
        }
        this.mElemList[this.name + "join_counter_check"].selected = (TeamSystem.getInstance().isAutoJoinTeam() == true)
        this.mElemList[this.name + "join_counter"].text = String.format(Localize_cns("TEAM_TXT1"), UITeamGroup.AUTO_JOIN_TIME / 1000)
        this.autoJoinDelay = UITeamGroup.AUTO_JOIN_TIME

        //清除系统内部计时
        TeamSystem.getInstance().setFullTeamFight(false)
        this.refreshFrame()
        // if (!this.timerList["second"]) {
        //     this.timerList["second"] = SetTimer(this.oneSecondTick, this, 100, true)
        // }
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.TEAM_INFO_UPDATE, this.refreshFrame, this)
        UnRegisterEvent(EventDefine.TEAM_CREATE, this.onTeamCreate, this)
        // UnRegisterEvent(EventDefine.PET_LIST_UPDATE, this.refreshFrame, this)
        // this.mElemList["jie_group"].visible = false

        //关闭界面后组队系统内继续计时
        if (this.activityData && TeamIsState(this.activityData[0]) == true) {
            if (this.mElemList[this.name + "fight_counter_check"].selected == true) {                        //倒计时结束后战斗
                // TeamSystem.getInstance().setFullTeamFight(true)

                let func = function() {
                    TeamSystem.getInstance().beginTeamFight()
                }
                TeamSystem.getInstance().setInteriorTeamTimer("autofight", func, this)

                let func1 = function() {
                    if (this.bJoinRobotMember == true) {
                        TeamSystem.getInstance().joinRobotMember()
                    }
                }
                TeamSystem.getInstance().setInteriorTeamTimer("joinRobot", func1, this)
            }
            if (this.mElemList[this.name + "team_counter_check"].selected == true) {                        //队满时战斗
                TeamSystem.getInstance().setFullTeamFight(true)

                // let func = function() {
                //     TeamSystem.getInstance().beginTeamFight()
                // }
                // TeamSystem.getInstance().setInteriorTeamTimer("fullFight", func, this)
            }
        }
		
        if (this.mParentGroup) {
            this.mParentGroup.visible = false
        } else {
    		this.mElemList[this.name].visible = false
        }

        for (let k in this.timerList) {
            let timer = this.timerList[k]
            KillTimer(timer)
        }
        this.timerList = {}
    }

    refreshFrame() {
        for (let k in this.timerList) {
            let timer = this.timerList[k]
            KillTimer(timer)
        }
        this.timerList = {}

        if (!this.activityData || TeamIsState(this.activityData[0]) == false) {
            this.mElemList[this.name + "team_leave_btn"].visible = false
            this.mElemList[this.name + "fight_btn"].visible = false
            this.mElemList[this.name + "team_counter_group"].visible = false
            this.mElemList[this.name + "fight_counter_group"].visible = false
            
            this.mElemList[this.name + "join_counter_group"].visible = (this.activityData != null && this.bJoinFunc == true)
            this.mElemList[this.name + "team_create_btn"].visible = (this.activityData != null)
            this.mElemList[this.name + "team_join_btn"].visible = (this.activityData != null)

            //快速申请加入队伍倒计时
            this.refreshAutoJoin()
        } else {
            this.mElemList[this.name + "team_leave_btn"].visible = true
            this.mElemList[this.name + "fight_btn"].visible = HeroIsCaptain() == true//true
            this.mElemList[this.name + "team_counter_group"].visible = HeroIsCaptain() == true//true
            this.mElemList[this.name + "fight_counter_group"].visible = HeroIsCaptain() == true//true
            
            this.mElemList[this.name + "join_counter_group"].visible = false
            this.mElemList[this.name + "team_create_btn"].visible = false
            this.mElemList[this.name + "team_join_btn"].visible = false

            this.refreshAutoFight()
        }

        this.refreshTeamCounter()

        this.refreshMembers()
    }

    refreshTeamCounter() {
        this.mElemList[this.name + "team_counter"].text = Localize_cns("TEAM_TXT2")
        if (this.mElemList[this.name + "team_counter_group"].visible == true) {
            if (this.mElemList[this.name + "team_counter_check"].selected == true) {
                if (TeamSystem.getInstance().getMemberCount() >= 3) {                       //刚满员后倒计时5秒
                    if (!TeamSystem.getInstance().getTimerTime("fullFight")) {              //0或空
                        TeamSystem.getInstance().setTimerTime("fullFight", GetServerTime() + 5)
                    }

                    let deadline = TeamSystem.getInstance().getTimerTime("fullFight")
                    let tick = function(delay) {
                        let leftTime = Math.ceil(deadline - GetServerTime())
                        if (leftTime <= 0) {
                            TeamSystem.getInstance().beginTeamFight()

                            leftTime = 0
                            if (this.timerList["fullFight"]) {
                                KillTimer(this.timerList["fullFight"])
                                delete this.timerList["fullFight"]
                            }
                        }
                        this.mElemList[this.name + "team_counter"].text = String.format(Localize_cns("TEAM_TXT5"), leftTime)
                    }
                    if (!this.timerList["fullFight"]) {
                        this.timerList["fullFight"] = SetTimer(tick, this, 100, true)
                    }
                } else {
                    TeamSystem.getInstance().setTimerTime("fullFight", 0)
                }
            }
        }
    }

    refreshMembers() {
        for (let i = 0; i < 3; i++) {
            this.mElemList[this.name + "team_group" + i].visible = false
        }

        if (!this.activityData || TeamIsState(this.activityData[0]) == false) {
            return
        }

        let list = []
        let t = TeamSystem.getInstance().getTeamMemberList()
        for (let _ in t) {
            table_insert(list, t[_])
        }
        table_sort(list, function(a, b) {return a["position"] - b["position"]})

        for (let i = 0; i < list.length; i++) {
            let memberInfo = list[i]

            this.mElemList[this.name + "team_group" + i].visible = true
            
            let imageName = GetActorImageName(memberInfo.vocation, memberInfo.sex)
            this.mElemList[this.name + "team_icon" + i].source = imageName
            this.mElemList[this.name + "team_name" + i].text = memberInfo.plrName
            this.mElemList[this.name + "team_level" + i].text = Localize_cns("TEAM_TXT6") + memberInfo.level
            this.mElemList[this.name + "team_force" + i].text = Localize_cns("TEAM_TXT7") + MakeLongNumberShort(memberInfo.force)

            if (i > 0) {
                this.mElemList[this.name + "team_tick" + i].visible = HeroIsCaptain() == true
            }

            this.controlDataTable[this.name + "team_tick" + i] = memberInfo.plrId
        }
    }

    refreshAutoJoin() {
        if (this.mElemList[this.name + "join_counter_group"].visible == false) {
            return
        }

        if (this.mElemList[this.name + "join_counter_check"].selected == true) {
            let tick = function(delay) {
                let leftTime = Math.ceil((this.autoJoinDelay - delay) / 1000)
                //正在结算中（界面显示中）不计时
                if (FightSystem.getInstance().getFightResultState() != FightSystem.FIGHT_RESULT_STATE_NULL) {
                    return
                }

                this.autoJoinDelay = this.autoJoinDelay - delay
                if (leftTime <= 0) {
                    //这里发送快速加入队伍的申请
                    this.onClickJoin()

                    leftTime = 0
                    if (this.timerList["autoJoin"]) {
                        KillTimer(this.timerList["autoJoin"])
                        delete this.timerList["autoJoin"]
                    }
                }
                this.mElemList[this.name + "join_counter"].text = String.format(Localize_cns("TEAM_TXT1"), leftTime)
            }
            if (!this.timerList["autoJoin"]) {
                this.timerList["autoJoin"] = SetTimer(tick, this, 100, true)
            }
        } else {
            if (this.timerList["autoJoin"]) {
                KillTimer(this.timerList["autoJoin"])
                delete this.timerList["autoJoin"] 
            }
        }
    }

    refreshAutoFight() {
        if (this.mElemList[this.name + "fight_counter_group"].visible == false) {
            return
        }

        let deadline = TeamSystem.getInstance().getTimerTime("autofight")
        if (deadline == 0) {
            return
        }

        let robotDeadLine = TeamSystem.getInstance().getTimerTime("joinRobot")

        if (this.mElemList[this.name + "fight_counter_check"].selected == true) {
            let tick = function(delay) {
                let leftTime = Math.ceil(deadline - GetServerTime())
                if (leftTime <= 0) {
                    //这里发送战斗的申请
                    TeamSystem.getInstance().beginTeamFight()

                    leftTime = 0
                    if (this.timerList["autoFight"]) {
                        KillTimer(this.timerList["autoFight"])
                        delete this.timerList["autoFight"]
                    }
                }
                this.mElemList[this.name + "fight_counter"].text = String.format(Localize_cns("TEAM_TXT3"), leftTime)

                if (GetServerTime() == robotDeadLine) {
                    if (this.bJoinRobotMember == true) {
                        TeamSystem.getInstance().joinRobotMember()
                    }
                }
            }
            if (!this.timerList["autoFight"]) {
                this.timerList["autoFight"] = SetTimer(tick, this, 100, true)
            }
        } else {
            if (this.timerList["autoFight"]) {
                KillTimer(this.timerList["autoFight"])
                delete this.timerList["autoFight"]
            }
        }
    }

    onTeamCreate(args) {
        TeamSystem.getInstance().setTimerTime("autofight", GetServerTime() + 60)                //自动开始战斗
        TeamSystem.getInstance().setTimerTime("joinRobot", GetServerTime() + 5)                 //加入机器人
        this.autoJoinDelay = UITeamGroup.AUTO_JOIN_TIME
    }

    ////////////////////////////////////////////////////////////
    onClickKick(args) {
        let name = args.target.name
        if (!this.controlDataTable[name]) {
            return
        }

        let plrId = this.controlDataTable[name]
        RpcProxy.call("C2G_KickMember", plrId)
    }

    onClickLeave(args) {
        RpcProxy.call("C2G_LeaveTeam")
    }

    onClickFight(args) {
        TeamSystem.getInstance().beginTeamFight()
    }

    onClickCreate(args) {
        let [flag, str] = CheckMainFrameFunction("formalfight")
        if (flag == true) {
            return MsgSystem.addTagTips(str)
        }

        if (CheckActivityState() == false) {
            return
        }
        
        if (CheckBeiBaoEquipWillFull()) {
            return
        }

        if (this.handlerList[UITeamGroup.CHECK_CREATE_TEAM]) {
            let func = this.handlerList[UITeamGroup.CHECK_CREATE_TEAM][0]
            let obj = this.handlerList[UITeamGroup.CHECK_CREATE_TEAM][1]
            let param = this.handlerList[UITeamGroup.CHECK_CREATE_TEAM][2]

            if (func.call(obj, param) == false) {
                return
            }
        }
        if (this.activityData) {
            RpcProxy.call("C2G_CreateTeam", this.activityData[0], this.activityData[1])
        }
    }

    onClickJoin(args) {
        let [flag, str] = CheckMainFrameFunction("formalfight")
        if (flag == true) {
            return MsgSystem.addTagTips(str)
        }
        
        if (CheckBeiBaoEquipWillFull() || CheckActivityState() == false) {
            let delayFuc = function() {
                this.mElemList[this.name + "join_counter_check"].selected = false
                this.onClicJoinCheck({target:{selected: false}})
            }
            DelayEvecuteFunc(0, delayFuc, this)
            return
        }

        if (this.handlerList[UITeamGroup.CHECK_QUICK_JOIN]) {
            let func = this.handlerList[UITeamGroup.CHECK_QUICK_JOIN][0]
            let obj = this.handlerList[UITeamGroup.CHECK_QUICK_JOIN][1]
            let param = this.handlerList[UITeamGroup.CHECK_QUICK_JOIN][2]

            if (func.call(obj, param) == false) {
                let delayFuc = function() {
                    this.mElemList[this.name + "join_counter_check"].selected = false
                    this.onClicJoinCheck({target:{selected: false}})
                }
                DelayEvecuteFunc(0, delayFuc, this)
                return
            }
        }

        if (this.activityData) {
            RpcProxy.call("C2G_ApplyAllTeam", this.activityData[0], this.activityData[1])
        }
    }

    onClicJoinCheck(args) {
        this.autoJoinDelay = 10 * 1000
        if (args.target.selected == false) {
            this.mElemList[this.name + "join_counter"].text = String.format(Localize_cns("TEAM_TXT1"), this.autoJoinDelay / 1000)
            TeamSystem.getInstance().setAutoJoinTeam(false)
        } else {
            TeamSystem.getInstance().setAutoJoinTeam(true)
        }
        this.refreshAutoJoin()
    }

    onClicTeamCheck(args) {
        if (args.target.selected == false) {
            this.mElemList[this.name + "team_counter"].text = Localize_cns("TEAM_TXT2")
            TeamSystem.getInstance().setTimerTime("fullFight", 0)
            if (this.timerList["fullFight"]) {
                KillTimer(this.timerList["fullFight"])
                delete this.timerList["fullFight"]
            }
        } else {
            this.refreshTeamCounter()
        }
    }

    onClicFightCheck(args) {
        TeamSystem.getInstance().setTimerTime("autofight", GetServerTime() + 60)                //自动开始战斗
        TeamSystem.getInstance().setTimerTime("joinRobot", GetServerTime() + 5)                 //加入机器人
        if (args.target.selected == false) {
            this.mElemList[this.name + "fight_counter"].text = String.format(Localize_cns("TEAM_TXT3"), 60)
        }

        this.refreshAutoFight()
    }
    ////////////////////////////////////////////////////////////////////
    setTeamActivityData(info) {
        if (this.activityData && TeamIsState(this.activityData[0]) == true) {                           //已在活动中
            return
        }

        this.activityData = info                            //[actIndex, id]
        this.refreshFrame()
    }

    setHandler(name, func, obj, param?) {
        this.handlerList[name] = [func, obj, param]
        // UITeamGroup.CHECK_QUICK_JOIN
    }

    setJoinRobot(b: boolean) {
        this.bJoinRobotMember == b
    }

    setJoinTeam(b: boolean) {
        this.bJoinFunc = b
    }
}