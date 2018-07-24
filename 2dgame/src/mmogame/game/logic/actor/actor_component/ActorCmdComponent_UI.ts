//测试矩形区域
var TEST_UI_RECT = false;
var MaxBoundHeight = 200
var MinBoundHeight = 120

class ActorCmdComponent_UI extends ActorCmdComponent {

    guiNode: eui.Group;//UI容器，便于子节点自动布局
    mFrameList: any;


    public initObj(...params: any[]): void {
        this.mFrameList = {};

        // this.addCommandHandler(ActorCommand.SetName, this.onHandleCommand_SetName)
        // this.addCommandHandler(ActorCommand.ShowCombatNumber, this.onHandleCommand_ShowCombatNumber)
        // this.addCommandHandler(ActorCommand.ShowCombatAutoHpSlot, this.onHandleCommand_ShowCombatAutoHpSlot)


        this.addCommandHandler(ActorCommand.AddChatBubble, this.onHandleCommand_AddChatBubble)
        this.addCommandHandler(ActorCommand.HideChatBubble, this.onHandleCommand_HideChatBubble)
        //this.addCommandHandler(ActorCommand.SetHourGlassVisible, this.onHandleCommand_SetHourGlassVisible)

        this.addCommandHandler(ActorCommand.SetFactionName, this.onHandleCommand_SetFactionName)
        this.addCommandHandler(ActorCommand.SetName, this.onHandleCommand_SetName)
        this.addCommandHandler(ActorCommand.SetNameColor, this.onHandleCommand_SetNameColor)
        this.addCommandHandler(ActorCommand.SetNameFont, this.onHandleCommand_SetNameFont)
        this.addCommandHandler(ActorCommand.SetHpSlot, this.onHandleCommand_SetHpSlot)
        this.addCommandHandler(ActorCommand.SetHpSlotVisible, this.onHandleCommand_SetHpSlotVisible)
        this.addCommandHandler(ActorCommand.SetFightStateVisible, this.onHandleComman_SetFightStateVisible)
        // this.addCommandHandler(ActorCommand.SetCaptainIconVisible, this.onHandleCommand_SetCaptainIconVisible)
        // this.addCommandHandler(ActorCommand.SetTeammateIconVisible, this.onHandleCommand_SetTeammateIconVisible)
        this.addCommandHandler(ActorCommand.SetMoreIcon, this.onHandleCommand_SetMoreVisible)
        this.addCommandHandler(ActorCommand.SetStateIcon, this.onHandleCommand_SetStateIcon)
        this.addCommandHandler(ActorCommand.SetChengHaoTitle, this.onHandleCommand_SetChengHaoTitle)


        //this.addCommandHandler(ActorCommand.showSkillName, this.onHandleCommand_showSkillName)

        this.addCommandHandler(ActorCommand.SetCombatMarkVisible, this.onHandleCommand_SetCombatMarkVisible)
        this.addCommandHandler(ActorCommand.ShowCombatNumber, this.onHandleCommand_ShowCombatNumber)
        this.addCommandHandler(ActorCommand.ShowCombatAutoHpSlot, this.onHandleCommand_ShowCombatAutoHpSlot)
        this.addCommandHandler(ActorCommand.ShowFloatText, this.onHandleCommand_ShowFloatText)
        this.addCommandHandler(ActorCommand.ShowFighterCharater, this.onHandleCommand_ShowFighterCharater)

        //跨服争霸
        this.addCommandHandler(ActorCommand.SetGlobalMiningVisible, this.onHandleCommand_SetGlobalMiningVisible)
	    this.addCommandHandler(ActorCommand.SetGlobalMiningInfoBtn, this.onHandleCommand_SetGlobalMiningInfoBtn)		//跨服争霸矿信息按钮
	    this.addCommandHandler(ActorCommand.SetGlobalMiningTeam, this.onHandleCommand_SetGlobalMiningTeam)				 //跨服争霸队伍信息
	    this.addCommandHandler(ActorCommand.SetGlobalMiningTips, this.onHandleCommand_SetGlobalMiningTips)				 //跨服争霸文字信息
	    this.addCommandHandler(ActorCommand.SetGlobalMiningCollect, this.onHandleCommand_SetGlobalMiningCollect)		 //跨服争霸采集倒计时
        //this.addCommandHandler(ActorCommand.ShowAwardModel, this.onHandleCommand_ShowAwardModel)

        //设置武林大会挑战
        this.addCommandHandler(ActorCommand.SetWuLinChange, this.onHandleCommand_SetWuLinChange)

        //////设置头顶倒计时
        this.addCommandHandler(ActorCommand.setTimeCountDown, this.onHandleCommand_setTimeCountDown)
        //据点
        this.addCommandHandler(ActorCommand.SetStrongholdName, this.onHandleCommand_SetStrongholdName)    //名字
        this.addCommandHandler(ActorCommand.SetStrongholdOccupying, this.onHandleCommand_SetStrongholdOccupying)  //占领中
        this.addCommandHandler(ActorCommand.SetStrongholdOccupyNum, this.onHandleCommand_SetStrongholdOccupyNum)  //人数
        this.addCommandHandler(ActorCommand.SetStrongholdKeyStatus, this.onHandleCommand_SetStrongholdKeyStatus)  //人数

    }
    //子类复写 析构函数
    protected destory(): void {
        for (var k in this.mFrameList) {
            var v = this.mFrameList[k];
            v.deleteObj();
        }
        this.releaseGuiNode();
    }


    initWithReuse(owner:Actor){
        this.owner = owner
	    this.realActor = this.owner.realActor
    }

    onAttach(){
        this.realActor.addDisplayeNode(map.SpriteDisplayNodeType.eDisplayNode_UI, this.guiNode);
        if(this.guiNode)
            this.guiNode.touchEnabled = this.owner.isTouchEnable()

         for (var k in this.mFrameList) {
            var v = this.mFrameList[k];
            if(v.setOwner){
                v.setOwner(this.owner)
            }
        }
    }

    onDeattach(){
        for (var k in this.mFrameList) {
            var v = this.mFrameList[k];
            if(v.onReset){
                v.onReset()
            }
            v.hideWnd()
        }
        this.realActor.removeDisplayeNode(this.guiNode);
        this.realActor = null;
    }

    onAppearChange() {
        var boundRect = this.owner.getContentSize();
        if (this.guiNode && boundRect.width != 0 && boundRect.height != 0) {
            let height = boundRect.height
            if(height > MaxBoundHeight){
                height = MaxBoundHeight
            }

             if(height < MinBoundHeight){
                height = MinBoundHeight
            }

            this.guiNode.width = boundRect.width;
            this.guiNode.height = height;

            //锚点在底部中心
            this.guiNode.anchorOffsetX = this.guiNode.width / 2;
            this.guiNode.anchorOffsetY = this.guiNode.height;

            //更新跨服争霸界面框
            if (this.mFrameList.gbMiningFrame) {
                this.mFrameList.gbMiningFrame.updateLayeroutRect()
            }
        }
    }

    //---------------------------------------------------------------------------

    getGuiNode() {
        if (this.guiNode == null) {
            this.guiNode = new eui.Group;
            this.guiNode.width = 100;
            this.guiNode.height = 100;

            this.guiNode.anchorOffsetX = this.guiNode.width / 2;
            this.guiNode.anchorOffsetY = this.guiNode.height;

            this.realActor.addDisplayeNode(map.SpriteDisplayNodeType.eDisplayNode_UI, this.guiNode);

            this.guiNode.touchEnabled = this.owner.isTouchEnable()

            if(TEST_UI_RECT){
                UiUtil.forTestDrawBg(this.guiNode, gui.Color.black);
            }
        }
        return this.guiNode;
    }

    releaseGuiNode() {
        if (this.guiNode && this.guiNode.parent) {
            this.realActor.removeDisplayeNode(this.guiNode);
        }
        this.guiNode = null;
    }

    setFrameRootLayer(logicFrame: BaseWnd, node: egret.DisplayObjectContainer) {
        //获取头顶rootWindow
        logicFrame.setRootLayer(node);
        //logicFrame.doCommand("setTestUIRect", TEST_UI_RECT)

    }


    getUpperFrame(): any {
        if (this.mFrameList.upperFrame == null) {
            this.mFrameList.upperFrame = WngMrg.getInstance().createWindow("CharacterUpperFrame")
            this.setFrameRootLayer(this.mFrameList.upperFrame, this.getGuiNode())
        }
        this.mFrameList.upperFrame.showWnd()
        return this.mFrameList.upperFrame
    }

     getFightFrame(): any {
        if (this.mFrameList.fightFrame == null) {
            this.mFrameList.fightFrame = WngMrg.getInstance().createWindow("CharacterFightFrame")
            this.setFrameRootLayer(this.mFrameList.fightFrame, this.getGuiNode())
            this.mFrameList.fightFrame.setOwner(this.owner);
        }
        return this.mFrameList.fightFrame
    }

    getGlobalMiningtFrame(): any {
        if (this.mFrameList.gbMiningFrame == null) {
            this.mFrameList.gbMiningFrame = WngMrg.getInstance().createWindow("CharacterGlobalMiningFrame")
            this.setFrameRootLayer(this.mFrameList.gbMiningFrame, this.getGuiNode())
            this.mFrameList.gbMiningFrame.setOwner(this.owner);
        }
        return this.mFrameList.gbMiningFrame
    }

    // getWulinChallengeFrame(): any {
    //     if (this.mFrameList.wulinChallengeFrame == null) {
    //         this.mFrameList.wulinChallengeFrame = WngMrg.getInstance().createWindow("WuLinChallengeFrame")
    //         this.setFrameRootLayer(this.mFrameList.wulinChallengeFrame, this.getGuiNode())
    //         this.mFrameList.wulinChallengeFrame.setOwner(this.owner);
    //     }
    //     return this.mFrameList.wulinChallengeFrame
    // }

     getStrongholdInfoFrame(): any {
        if (this.mFrameList.strongholdFrame == null) {
            this.mFrameList.strongholdFrame = WngMrg.getInstance().createWindow("StrongholdInfoFrame")
            this.setFrameRootLayer(this.mFrameList.strongholdFrame, this.getGuiNode())
        }
        this.mFrameList.strongholdFrame.showWnd()
        return this.mFrameList.strongholdFrame
     }

    //---------------------------------------------------------------------------

    onHandleCommand_SetName(param1, param2) {
        var name = param1
        if (StringUtil.isEmpty(name) && this.mFrameList.updateFrame == null)
            return;
        this.getUpperFrame().setNameTitle( name, param2)
    }


    onHandleCommand_ShowCombatNumber(param1, param2) {
        var number_info = param1
        var all_time = param2 / 1000

        // if (this.mFrameList.fightFrame == null) {
        //     this.mFrameList.fightFrame = WngMrg.getInstance().createWindow("CharacterFightFrame")
        //     this.setFrameRootLayer(this.mFrameList.fightFrame, this.getGuiNode())
        // }
        let fightFrame = this.getFightFrame();
        fightFrame.setOwner(this.owner);
        fightFrame.showWnd()
        fightFrame.showCombatInfo(number_info, all_time)
    }

    onHandleCommand_ShowCombatAutoHpSlot(param1, param2) {
        var percent = param1
        var combat_side = param2

        var upperFrame = this.getUpperFrame()
        upperFrame.showCombatAutoHpSlot( percent, combat_side)
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////-

   

    onHandleCommand_AddChatBubble(param1, param2) {
        let content = param1
        if (this.mFrameList.chatBubbleFrame == null) {
            this.mFrameList.chatBubbleFrame = WngMrg.getInstance().createWindow("ChatBubbleFrame")

            this.setFrameRootLayer(this.mFrameList.chatBubbleFrame, this.getGuiNode())
        }
        //this.mFrameList.chatBubbleFrame.setPlayerOwner(this.owner)

        this.mFrameList.chatBubbleFrame.setShowMsg(content, this.owner, param2)
        //this.mFrameList.chatBubbleFrame.showWnd()
    }

    onHandleCommand_HideChatBubble(param1, param2) {
        if (this.mFrameList.chatBubbleFrame) {
            this.mFrameList.chatBubbleFrame.hideWnd()
        }
    }

    // onHandleCommand_SetHourGlassVisible(param1, param2) {
    //     let visible = param1
    //     if (this.mFrameList.hourGlassFrame == null) {
    //         this.mFrameList.hourGlassFrame = WngMrg.getInstance().createWindow("HourGlassFrame")
    //         this.setFrameRootLayer(this.mFrameList.hourGlassFrame, this.getGuiNode())
    //     }

    //     if (visible) {
    //         this.mFrameList.hourGlassFrame.setOwner(this.owner)
    //         this.mFrameList.hourGlassFrame.showWnd()
    //     } else {
    //         this.mFrameList.hourGlassFrame.hideWnd()
    //     }

    // }


    onHandleCommand_SetFactionName(name, font) {
        if (this.mFrameList.upperFrame == null) {
            return
        }
        let bottomFrame = this.getUpperFrame()
        bottomFrame.setFactionNameTitle(name, font)
    }



    onHandleCommand_SetNameColor(param1, param2) {
        let bottomFrame = this.getUpperFrame()
        bottomFrame.setNameColor(param1, param2)
    }

    onHandleCommand_SetNameFont(param1, param2) {
        let bottomFrame = this.getUpperFrame()
        bottomFrame.setNameFont(param1)
    }

    onHandleCommand_SetHpSlot(param1, param2) {
        let upperFrame = this.getUpperFrame()
        upperFrame.setHpSlot(param1)
    }

    onHandleCommand_SetHpSlotVisible(param1, param2) {
        let upperFrame = this.getUpperFrame()
        upperFrame.setHpSlotVisible(param1)
    }

    onHandleComman_SetFightStateVisible(param1, param2) {
        let upperFrame = this.getUpperFrame()
        let [imageName, remainTime] = param2 || [null, null]
        upperFrame.setFightStateVisible(param1, imageName, remainTime)
    }

    // onHandleCommand_SetCaptainIconVisible(param1, param2) {
    //     let upperFrame = this.getUpperFrame()
    //     upperFrame.setCaptainIconVisible(param1, param2)
    // }


    // onHandleCommand_SetTeammateIconVisible(param1, param2) {
    //     let upperFrame = this.getUpperFrame()
    //     upperFrame.setTeammateIconVisible(param1, param2)
    // }

    onHandleCommand_SetMoreVisible(param1, param2) {
        let upperFrame = this.getUpperFrame()
        upperFrame.setMoreIcon(param1, param2)
    }

    onHandleCommand_SetStateIcon(param1, param2) {
        let upperFrame = this.getUpperFrame()
        upperFrame.setStateIcon(param1, param2)
    }


    onHandleCommand_SetChengHaoTitle(chengHaoId) {
        let upperFrame = this.getUpperFrame()
        upperFrame.setChengHaoTitle(chengHaoId)
    }


    onHandleCommand_setTimeCountDown(param1, param2) {
        let upperFrame = this.getUpperFrame()
        upperFrame.setTimeCountDown(param1, param2)
    }

    

    // onHandleCommand_showSkillName(param1, param2) {
    //     let skillId = param1
    //     if (this.mFrameList.skillNameFrame == null) {
    //         this.mFrameList.skillNameFrame = WngMrg.getInstance().createWindow("CombatUseSkillFrame")

    //         this.setFrameRootLayer(this.mFrameList.skillNameFrame, this.getGuiNode())
    //     }
    //     this.mFrameList.skillNameFrame.setSkillId(skillId)
    //     this.mFrameList.skillNameFrame.showWnd()
    // }

    onHandleCommand_SetCombatMarkVisible(param1, param2) {
        let upperFrame = this.getUpperFrame()
        upperFrame.setCombatMaikVisible(param1, param2)
    }




    onHandleCommand_ShowFloatText(param1, param2) {
        let text_info = param1

        let fightFrame = this.getFightFrame();
        fightFrame.setOwner(this.owner);
        fightFrame.showWnd()
        fightFrame.showFloatText(text_info, -1)
    }

    onHandleCommand_ShowFighterCharater(param1, param2) {
        let fightFrame = this.getFightFrame();
        fightFrame.setOwner(this.owner);
        fightFrame.showWnd()
        fightFrame.showFighterCharater(param1)
    }
    // onHandleCommand_ShowAwardModel(param1, param2) {
    //     let frame = this.getBottomFrame()

    //     frame.showFightAward(this.owner, param1, param2)
    // }

    onHandleCommand_SetGlobalMiningVisible(param1, param2) {
        let visible = param1 != null ? param1 : false
        let frame = this.getGlobalMiningtFrame()
        if (param1 == true) {
            frame.showWnd()
        } else {
            frame.hideWnd()
        }
    }

    onHandleCommand_SetGlobalMiningInfoBtn(param1, param2) {
        let visible = param1 != null ? param1 : false
        let frame = this.getGlobalMiningtFrame()
        frame.updateInfoBtn(visible, param2)
    }

    onHandleCommand_SetGlobalMiningTeam(param1, param2) {
        let visible = param1 != null ? param1 : false
        let frame = this.getGlobalMiningtFrame()
        frame.updateTeamInfo(visible, param2)
    }

    onHandleCommand_SetGlobalMiningTips(param1, param2) {
        let visible = param1 != null ? param1 : false
        let frame = this.getGlobalMiningtFrame()
        frame.updateMineInfo(visible, param2)
    }

    onHandleCommand_SetGlobalMiningCollect(param1, param2) {
        let visible = param1 != null ? param1 : false
        let frame = this.getGlobalMiningtFrame()
        frame.updateCollectTick(visible, param2)
    }

    // onHandleCommand_SetWuLinChange(param1, param2){
    //     let visible = param1 != null ? param1 : false
    //     let frame = this.getWulinChallengeFrame()
    //     frame.updateCollectTick(visible, param2)
    // }

    onHandleCommand_SetWuLinChange(param1, param2){
        let visible = param1 != null ? param1 : false

        var upperFrame = this.getUpperFrame()
        upperFrame.updateChallengeTick(visible, param2)
    }

    onHandleCommand_SetStrongholdName(param1) {
        let upperFrame = this.getStrongholdInfoFrame()
        upperFrame.setStrongholdName(param1)
    }
    
    onHandleCommand_SetStrongholdOccupying(param1) {
        let upperFrame = this.getStrongholdInfoFrame()
        upperFrame.setStrongholdState(param1)
    }
    
    onHandleCommand_SetStrongholdOccupyNum(param1, param2) {
        let upperFrame = this.getStrongholdInfoFrame()
        upperFrame.setStrongholdOccupyNum(param1, param2)
    }

    onHandleCommand_SetStrongholdKeyStatus(param1, param2) {
        let upperFrame = this.getUpperFrame()
        upperFrame.setStrongholdKeyVisible(param1, param2)
    }

}