// TypeScript file


class AnswerQuestionFrame extends BaseWnd {


    questionIndex: number
    questionTime: number
    index: number
    leftAnswer: string;
    rightAnswer: string;
    correctAnswer: string;


    score: number
    rank: number
    followTimes: number
    doubleScoreTimes: number;

    lastIndex: number
    currentSide: number

    timer: number;

    useDoubleScore: boolean;
    useHelpme: boolean;
    bStart: boolean;

    //mChatViewr: UIChatViewer

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/activity/AnswerQuestionLayout.exml"]


        this.clearQuestion()

        //因为进入活动时候，消息就发来了，有可能窗口还没床架
        RegisterEvent(EventDefine.ACTIVITY_QUESTION, this.onRecvQuestion, this)
        RegisterEvent(EventDefine.ACTIVITY_QUESTION_INFO, this.onRecvPlayerInfo, this)
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setFullScreenRaw(true)
        this.initSkinElemList();

        var elemInfo = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLeave },

            { ["name"]: "btn_double", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUseDoubleScore },
            { ["name"]: "btn_helpme", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUseFollow },
            { ["name"]: "btn_help", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickHelp },

            {["name"] : "chooseATitle", 	["title"] : Localize_cns("CHAT_VOICE_TIPS8") ,   	["font"] : "ht_24_lc",   ["scale_image"] : null,			["color"] : gui.Color.saddlebrown,			["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : null, ["messageFlag"] : true},
			{["name"] : "chooseBTitle",  	["title"] : Localize_cns("CHAT_VOICE_TIPS8") ,   	["font"] : "ht_24_lc",   ["scale_image"] : null,			["color"] : gui.Color.saddlebrown,			["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : null, ["messageFlag"] : true},

        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);


        this.mElemList["myInfo"].setAlignFlag(gui.Flag.CENTER_CENTER)
        this.mElemList["activityinfo"].setAlignFlag(gui.Flag.CENTER_CENTER)

        //this.mElemList["rdtips"].setAlignFlag(gui.Flag.H_CENTER)
        
        
        //this.mChatViewr = UIChatViewer.newObj(this, this.mLayoutNode, "chatviewer", 0, 0, this.mElemList["group_chat"]);


        var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
        radioGroup.addEventListener(eui.UIEvent.CHANGE, this.onTabSelected, this);

        this.mElemList["checkA"].group = radioGroup;
        this.mElemList["checkA"].value = "A";

        this.mElemList["checkB"].group = radioGroup;
        this.mElemList["checkB"].value = "B";

        this.mLayoutNode.setLayer(gui.GuiLayer.Bottom)

        this.setCountDown(20)
        
        
    }

    public onUnLoad(): void {

    }

    public onShow(): void {


        RegisterEvent(EventDefine.ACTIVITY_QUESTION_RESULT, this.onRecvAnswer, this)
        RegisterEvent(EventDefine.ACTIVITY_STATE_LIST, this.onActivityChange, this)


        this.mLayoutNode.visible = true;
        //this.mChatViewr.setVisible(true)

        this.refreshFrame()
        this.updateState()
    }

    public onHide(): void {


        UnRegisterEvent(EventDefine.ACTIVITY_QUESTION_RESULT, this.onRecvAnswer, this)
        UnRegisterEvent(EventDefine.ACTIVITY_STATE_LIST, this.onActivityChange, this)
        this.mLayoutNode.visible = false;
        //this.mChatViewr.setVisible(false)
        this.bStart = false
        this.clearQuestion()
    }




    ////////////////////////////////////////////////////////////////////////////////////-


    clearQuestion() {
        this.questionIndex = 0  //剩余题目
        this.questionTime = 0
        this.index = -1//题目索引
        this.leftAnswer = ""
        this.rightAnswer = ""
        this.correctAnswer = ""

        this.score = 0
        this.rank = 0
        this.followTimes = 0
        this.doubleScoreTimes = 0

        this.lastIndex = -1 //上次的题目
        this.currentSide = -1 //左边0 右边1

        this.useDoubleScore = false
        this.useHelpme = false
        this.killTimer()
    }



    setCountDown(num) {

        let imageBox:gui.BatchImage = this.mElemList["countdown"]

        imageBox.beginDraw();
		imageBox.drawNumberString("dt_daoJiShi", num, 0, 0)
		imageBox.endDraw();
    }


    startTimer() {
        function timeOut(dt) {
            let curTime = GetServerTime()
            let interval = this.questionTime - curTime
            if (interval < 0) {
                interval = 0
            }
            this.setCountDown(interval)

            if (interval <= 0) {
                this.killTimer()
                if(this.questionIndex == 0){   //没有题目马上刷新界面
                    //手动刷新
                    this.index = -1
                    this.refreshFrame()
                }
            }
        }

        if (!this.timer) {
            this.timer = SetTimer(timeOut, this, 1000, true)
        }
    }

    killTimer() {
        if (this.timer) {
            KillTimer(this.timer)
            this.timer = null
        }
    }

    heroRandomMove(targetX, targetY) {
        let randomX = MathUtil.random(5) - 3
        let randomY = MathUtil.random(5) - 3
        GetHero().wantToGoByCell(targetX + randomX, targetY + randomY)//主角移动
    }


    setChooseA() {
        if (this.currentSide == 0) {
            return
        }

        this.currentSide = 0
        this.heroRandomMove(12, 21)

        let message = GetMessage(opCodes.C2G_WORLDQUESTION_ANSWER)
        message.side = this.currentSide
        SendGameMessage(message)	//选择左侧
    }


    setChooseB() {
        if (this.currentSide == 1) {
            return
        }

        this.currentSide = 1
        this.heroRandomMove(38, 21)

        let message = GetMessage(opCodes.C2G_WORLDQUESTION_ANSWER)
        message.side = this.currentSide
        SendGameMessage(message)	//选择左侧
    }





    onNewQuestion() {
        this.mElemList["checkA"].selected = (false)
        this.mElemList["checkB"].selected = (false)
        this.startTimer()

        if (this.currentSide != -1) {
            this.heroRandomMove(25, 10)
            this.currentSide = -1
        }
        this.useDoubleScore = false
        this.useHelpme = false

    }


    refreshFrame() {
        this.mElemList["group_question_scroe"].visible = (this.index != -1)
        this.mElemList["group_question"].visible = (this.index != -1)
        this.mElemList["group_activityinfo"].visible = (this.index == -1)
        //this.mElemList["group_tips"].visible = (this.index == -1)
        this.mElemList["btn_double"].enabled = (this.index != -1)
        this.mElemList["btn_helpme"].enabled = (this.index != -1)
        this.mElemList["checkA"].enabled = (this.index != -1)
        this.mElemList["checkB"].enabled = (this.index != -1)

        let closeBtn:gui.Button = this.mElemList["btn_close"]
        if (this.index == -1) {
            // this.mElemList["btn_close"].bottom = 195
            //UiUtil.setXY(closeBtn, 554, 640)    //195
            closeBtn.y = 640
            AddRdContent(this.mElemList["activityinfo"], "#HONGDIAN" +Localize_cns("ACTIVITY_TXT1"), "ht_24_cc_stroke", "white")
            this.setCountDown(0)
            return
        }
        // this.mElemList["btn_close"].bottom = 380
        //UiUtil.setXY(closeBtn, 554, 470)
        closeBtn.y = 470

        //题目不一样，刷新
        if (this.lastIndex == -1 || this.lastIndex != this.index) {
            this.onNewQuestion()
        }

        this.lastIndex = this.index

        let questionConfig = GameConfig.WorldQuestionConfig[this.index]
        let question = ""
        if (questionConfig) {
            question = questionConfig.readme
        }

        let questr = String.format(Localize_cns("ACTIVITY_QUESTION_TXT10"), this.questionIndex) + "#br" + question

        AddRdContent(this.mElemList["content"], questr, "ht_24_cc", "ublack")

        this.mElemList["chooseATitle"].text = ("A. " + this.leftAnswer)
        this.mElemList["chooseBTitle"].text = ("B. " + this.rightAnswer)

        //剩余题目
        AddRdContent(this.mElemList["myInfo"], String.format(Localize_cns("ACTIVITY_QUESTION_TXT2"), this.score), "ht_24_cc_stroke", "white")

        this.mElemList["btn_double"].enabled = (this.doubleScoreTimes > 0 && this.useDoubleScore == false)
        this.mElemList["doubleNum"].text = (this.doubleScoreTimes)

        this.mElemList["btn_helpme"].enabled = (this.followTimes > 0 && this.useHelpme == false)
        this.mElemList["helpmeNum"].text = (this.followTimes)

        //if(this.useHelpme ){
        //	this.mElemList["checkA"].enabled = (false)
        //	this.mElemList["checkB"].enabled = (false)
        //}

    }


    ////////////////////////////////////////////////////////////////////////////////////////

    onTabSelected(event: egret.Event) {
		var radioGroup: eui.RadioButtonGroup = event.target;
		let radiobtn = radioGroup.selection

        if(radiobtn.value == "A"){
            this.setChooseA()
        }else{
             this.setChooseB()
        }

	}


    onUseDoubleScore(args) {

        let message = GetMessage(opCodes.C2G_WORLDQUESTION_SKILL)
        message.skillToUse = "double"
        SendGameMessage(message)	//选择左侧

        MsgSystem.addTagTips(Localize_cns("ACTIVITY_QUESTION_TXT7"))

        this.useDoubleScore = true
        this.refreshFrame()
    }

    onUseFollow(args) {

        let message = GetMessage(opCodes.C2G_WORLDQUESTION_SKILL)
        message.skillToUse = "follow"
        SendGameMessage(message)	//选择左侧
        this.useHelpme = true
        MsgSystem.addTagTips(Localize_cns("ACTIVITY_QUESTION_TXT8"))

        this.refreshFrame()

        if (this.leftAnswer == this.correctAnswer) {
            this.setChooseA()
        } else {
            this.setChooseB()
        }

    }

    ////-退出活动
    onLeave() {
        let t: IDialogCallback = {
            onDialogCallback(result: boolean, userData): void {
                if (result == true) {
                    let a = GetActivity(ActivityDefine.AnswerQuestion)
                    a.requestStop()
                }
            }
        }
        MsgSystem.confirmDialog(Localize_cns("ACTIVITY_QUESTION_TXT9"), t, null)
    }

    ////////////////////////////////////////////////////////////////////////////////////////

    onRecvPlayerInfo(event) {
        let args = event.msg
        this.score = args.score
        this.rank = args.rank
        this.followTimes = args.followTimes
        this.doubleScoreTimes = args.doubleScoreTimes

     
        this.doCommand("refreshFrame")
    }


    onRecvQuestion(event) {
        let args = event.msg

        this.questionIndex = args.questionIndex  //剩余题目
        this.questionTime = args.questionTime
        this.index = args.index
        this.leftAnswer = args.leftAnswer
        this.rightAnswer = args.rightAnswer
        this.correctAnswer = args.correctAnswer
        this.useDoubleScore = false

        //this.loopTime = this.loopTime + 1
        this.doCommand("refreshFrame")
    }

    onRecvAnswer(args) {
        let isCorrect = args.msg.isCorrect
        //0:fail 1:success
        let tips = ""
        if (isCorrect == 0) {
            tips = Localize_cns("ACTIVITY_QUESTION_TXT6") + "+1"
        } else {
            let scroeStr = this.useDoubleScore && "+6" || "+3"
            tips = Localize_cns("ACTIVITY_QUESTION_TXT5") + scroeStr
        }
        MsgSystem.addTagTips(tips)
    }

    onClickHelp(args) {
        let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
        wnd.showWithActivity("AnswerQusetionRule")
    }


    updateState() {
        let timeState = GetActivityTimeState(OrdinaryActivityIndex.DATI)
        if (timeState.state != ActivityTimeState.ONGOING) {
            //this.mRootFrame.SetMessagePass(true)
            this.mElemList["group_block"].touchEnabled = false;
            //this.mElemList["bgTips"].visible = (true)
            this.clearQuestion()
        } else {
            this.mElemList["group_block"].touchEnabled = true;
            this.heroRandomMove(25, 10)
            //this.mElemList["bgTips"].visible = (false)
        }

        this.refreshFrame()
        this.bStart = timeState.state == ActivityTimeState.ONGOING
    }

    onActivityChange(args) {
        let timeState = GetActivityTimeState(OrdinaryActivityIndex.DATI)
        if (timeState.state == ActivityTimeState.FINISHED) {
            if (this.bStart) {
                let t: IDialogCallback = {
                    onDialogCallback(result: boolean, userData): void {
                        if (result == true) {
                            let a = GetActivity(ActivityDefine.AnswerQuestion)
                            a.requestStop()
                        }
                    }
                }
                MsgSystem.confirmDialog(Localize_cns("ACTIVITY_TXT7"), t, null)
            }
        } else if (timeState.state == ActivityTimeState.ONGOING) {

        }

        this.updateState()
    }
}