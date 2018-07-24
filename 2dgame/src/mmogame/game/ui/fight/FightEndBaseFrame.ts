/*
作者:
    liuziming
	
创建时间：
   2017.03.31(周五)

意图：
   结算界面的基类，提供基本的战斗流程相关的接入处理
公共接口：
   FightEndBaseFrame.starShowCombatEnd					实现接口，子类自己根据自身判断执行showwnd
   FightEndBaseFrame.endShowCombatEnd									要关闭界面时，可直接调用这个接口
   this.param																	为结算时服务器返回的相关数据，不同活动可能结构不一样table
*/
class FightEndBaseFrame extends BaseWnd {

    callBack: Function;
    param
    obj

    teamTicker
    singleTicker
    bAutoHide: boolean
    maxDelayTime: number

    public initObj(...args: any[]): void {
        this.teamTicker = null
        this.singleTicker = null
        this.bAutoHide = true
        this.maxDelayTime = 5 * 1000

        RegisterEvent(EventDefine.UI_SHOW, this.onUIShowEvent, this)
        RegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)
    }

    destory() {
        UnRegisterEvent(EventDefine.UI_SHOW, this.onUIShowEvent, this)
        UnRegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)
    }


    onUIShowEvent(args) {
        if (args.window != this) {
            return
        }

        if (HeroIsInTeam()) {
            let tick = function (delay) {
                if (this.teamTicker) {
                    KillTimer(this.teamTicker)
                    this.teamTicker = null
                }

                if (this.isVisible() == true) {
                    this.endShowCombatEnd()
                }
            }
            this.teamTicker = SetTimer(tick, this, 20 * 1000, false)
        } else {
            if (this.bAutoHide == true) {
                let maxTime = this.maxDelayTime
                let tick = function (delay) {
                    maxTime = maxTime - delay
                    if (maxTime < 0 ) {
                        if (this.singleTicker) {
                            KillTimer(this.singleTicker)
                            this.singleTicker = null
                        }

                        if (this.isVisible() == true) {
                            this.endShowCombatEnd()
                        }
                    } else {
                        this.autoHideTick(maxTime)
                    }
                }
                this.singleTicker = SetTimer(tick, this, 100, true)
            }
        }
    }

    onUIHideEvent(args) {
        if (args.window != this) {
            return
        }

        if (this.teamTicker) {
            KillTimer(this.teamTicker)
            this.teamTicker = null
        }
        
        if (this.singleTicker) {
            KillTimer(this.singleTicker)
            this.singleTicker = null
        }
    }

    public onShow() {
        WngMrg.getInstance().hideWindow("FightFrame")
        IGlobal.resGroupManager.loadGroup(ResourceGroupDefine.Group_LiveState)
    }

    public onHide() {
        this.callBack = null;
        this.param = null
        this.obj = null

		FightSystem.getInstance().setFightResultState(FightSystem.FIGHT_RESULT_STATE_NULL)
    }


    ////////////////////////////////////////////////-实现接口////////////////////////////
    starShowCombatEnd() {

    }

    autoHideTick(leftTime) {

    }
    ////////////////////////////////////////////////////////////-响应函数//////////////////////////////////////////////////////////////////////
    endShowCombatEnd(args?) {
        // if (this.callBack && this.obj) {
        //     this.callBack.call(this.obj)
        // }

        this.hideWnd()
    }

    onCombatEnd(args) {
        this.callBack = args.callBack
        this.param = args.param
        this.obj = args.obj

        this.starShowCombatEnd()
    }
}