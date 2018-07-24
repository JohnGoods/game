/*
作者:
    LiRong
	
创建时间：
    2014.01.28(星期三) 

意图：
  	贵族考试

公共接口：
	
*/

class Activity_AnswerQuestion extends ActivityBase {

	public initObj(...args: any[]): void {
		//this.TimeLimit = true
		//RegisterEvent(EventDefine.ACTIVITY_QUESTION_ENTER, this.start, this)
		//RegisterEvent(EventDefine.ACTIVITY_QUESTION_LEAVE, this.stop,this)
		//RegisterEvent(EventDefine.ACTIVITY_QUESTION_STATE, this.onRecvActivityState,this)
	}

	onClear() {
	}

	destory() {
		//UnRegisterEvent(EventDefine.ACTIVITY_QUESTION_ENTER, this.start, this)
		//UnRegisterEvent(EventDefine.ACTIVITY_QUESTION_LEAVE, this.stop,this)

	}

	onPrepareResource() {
	}


	requestStart() {
		let heroInfo = GetHeroPropertyInfo()
		//if(heroInfo["level"]<20 ){
		//		MsgSystem.AddTagTips(String.format(Localize_cns("FINAL_BOSS_TIPS23"),20))			
		//		return					
		//}
		let message = GetMessage(opCodes.C2G_WORLDQUESTION_ENTER)
		SendGameMessage(message)
	}


	requestStop() {
		let message = GetMessage(opCodes.C2G_WORLDQUESTION_LEAVE)
		SendGameMessage(message)
	}




	onStart() {
		//UnRegisterEvent(EventDefine.ACTIVITY_QUESTION_STATE,this.onRecvActivityState,this)
		RegisterEvent(EventDefine.HERO_ENTER_MAP, this.onHeroEnterMap, this)

		PushUIShow(null, ["MainFrame"])
		StateManager.getInstance().ActiveSubState(state_type.LIVE_ACTIVITY_STATE)

		let wnd = WngMrg.getInstance().getWindow("AnswerQuestionFrame")
		wnd.showWnd()
		// wnd = WngMrg.getInstance().getWindow("MainFrame")
		// wnd.doCommand("setHeadGroupVisible", false)
		
	}


	onStop() {
		if (FightSystem.getInstance().isFight() == true) {
			FightSystem.getInstance().addEndFightHandler(this._Stop, this, null)
		} else {
			GetHero().restoreFollowAppear()
			this._Stop()
		}
	}

	_Stop() {
		UnRegisterEvent(EventDefine.HERO_ENTER_MAP, this.onHeroEnterMap, this)
		//UnRegisterEvent(EventDefine.ACTIVITY_QUESTION_STATE,this.onRecvActivityState,this)

		//this.removeNpc()
		//SceneManager.getInstance().cameraLinkActor(GetHero())
		//SceneManager.getInstance().lookAtCenter( GetHero().getMapXY() )

		PopUIShow()
		StateManager.getInstance().DeactiveSubState(state_type.LIVE_ACTIVITY_STATE)

		// let wnd = WngMrg.getInstance().getWindow("MainFrame")
		// wnd.doCommand("setHeadGroupVisible", true)

		//WngMrg.getInstance().hideWindow("AnswerQuestionEntryFrame")
	}

	////////////////////////////////////////////////////////////////////////
	//-进入活动关闭窗口
	onHeroEnterMap(index) {
		GetHero().clearFollowAppear()
		let mapId = MapSystem.getInstance().getMapId()
		if (mapId != 50035) {
			return
		}
		//this.createNpc()
		//GetHero().setCellXY(20, 24)
	}

}