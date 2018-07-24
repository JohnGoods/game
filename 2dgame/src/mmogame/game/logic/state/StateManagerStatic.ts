/*//[[
作者:
    yangguiming
	
创建时间：
   2013.6.18(周二)

意图：
   注册状态机

公共接口：
   
]]//*/


function StateManagerStaticInit(stateMgr:StateManager){

	//注册主状态
	stateMgr.registerMainState(state_type.LIVE_BASE_STATE, LiveBaseState.newObj())
	stateMgr.registerMainState(state_type.COMBAT_BASE_STATE, CombatBaseState.newObj())
	
	//生活子状态
	stateMgr.registerSubState(state_type.LIVE_STORY_STATE, StoryState.newObj())
	stateMgr.registerSubState(state_type.LIVE_DRAMA_STATE, DummyState.newObj())

	// stateMgr.registerSubState(state_type.LIVE_ACTIVITY_BROKENHISTORY, LiveBaseState.newObj())
	// stateMgr.registerSubState(state_type.LIVE_ACTIVITY_SINGLE_BOSS, LiveBaseState.newObj())
	// stateMgr.registerSubState(state_type.LIVE_ACTIVITY_ANSWER_QUESTION, LiveBaseState.newObj())
	// stateMgr.registerSubState(state_type.LIVE_ACTIVITY_WARFARE, LiveBaseState.newObj())
	// stateMgr.registerSubState(state_type.LIVE_ACTIVITY_SEALED_GROUND_QUESTION, LiveBaseState.newObj())
	// stateMgr.registerSubState(state_type.LIVE_ACTIVITY_LIGHT_TEMPLE, LiveBaseState.newObj())
	// stateMgr.registerSubState(state_type.LIVE_ACTIVITY_LEGION_WAR, LiveBaseState.newObj())
	// stateMgr.registerSubState(state_type.LIVE_ACTIVITY_MON_AGGRESS, LiveBaseState.newObj())
	// stateMgr.registerSubState(state_type.LIVE_ACTIVITY_MIWU_SEN_LIN, LiveBaseState.newObj())
	
	stateMgr.registerSubState(state_type.LIVE_ACTIVITY_STATE, LiveBaseState.newObj())//活动通用状态
	stateMgr.registerSubState(state_type.LIVE_ACTIVITY_MSG_STATE, LiveBaseState.newObj())//活动带消息盒状态
	stateMgr.registerSubState(state_type.LIVE_ACTIVITY_GLOBALMINING, GlobalMiningState.newObj())//跨服争霸活动
	
		
	//战斗子状态
	stateMgr.registerSubState(state_type.COMBAT_STORY_STATE, StoryState.newObj())
	
}