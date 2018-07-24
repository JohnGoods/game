/*
作者:
    yangguiming
	
创建时间：
   2013.6.18(周二)

意图：
   人物动作的有限状态机，只是为了控制角色动作
   状态机暂时有3层子状态，全局，动作，姿态。

公共接口：
    
	//public initObj(...args:any[]):void {
	//isState( statetype){//检查当前状态
	//setState( statetype){//设置状态，不会检查
	//canToState( statetype){//检查是否可以状态转移
	//isBlock( curState, toState){//检查curState是否阻挡toState


*/


ImportType(characterState)
//状态阻挡规则
//[当前状态]不能跳转到{目标状态列表}
let characterStateBlockRule: any = {
	[characterState.globalState_live]: [],
	[characterState.globalState_combat]: [],

	[characterState.actionState_idle]: [],
	[characterState.actionState_move]: [],
	[characterState.actionState_attack]: [characterState.actionState_attacked,
	//characterState.actionState_rush,
	characterState.actionState_move,
	characterState.actionState_dodge,
	characterState.actionState_knockfly,
	characterState.actionState_beatback,],
	[characterState.actionState_attacked]: [],
	[characterState.actionState_dodge]: [],
	[characterState.actionState_rush]: [characterState.actionState_move,
	//characterState.actionState_attack,
	characterState.actionState_attacked,
	characterState.actionState_jump,
	characterState.actionState_dodge,
	characterState.actionState_knockfly,
	characterState.actionState_beatback,],

	[characterState.actionState_jump]: [],
	[characterState.actionState_dead]: [characterState.actionState_idle,
	characterState.actionState_move,
	characterState.actionState_attack,
	characterState.actionState_attacked,
	characterState.actionState_rush,
	characterState.actionState_jump,
	characterState.actionState_dodge,
	characterState.actionState_knockfly,
	characterState.actionState_beatback,],

	[characterState.actionState_knockfly]: [characterState.actionState_move,
	characterState.actionState_attack,
	characterState.actionState_attacked,
	characterState.actionState_jump,
	characterState.actionState_dodge,
	characterState.actionState_beatback,],
	[characterState.actionState_beatback]: [characterState.actionState_move,
	characterState.actionState_attack,
	characterState.actionState_attacked,
	characterState.actionState_jump,
	characterState.actionState_dodge,
	characterState.actionState_knockfly,],

	[characterState.postureState_normal]: [],
	[characterState.postureState_shape]: [],
	[characterState.postureState_ride]: [],
}



class CharacterFSM extends TClass {
	mCharacter: Character;
	mGlobalState: number;
	mActionState: number;
	mPostureState: number;

	public initObj(...args: any[]): void {
		this.mCharacter = args[0]

		this.mGlobalState = characterState.nullState
		this.mActionState = characterState.nullState
		this.mPostureState = characterState.nullState
	}

	isGlobalState(statetype) {
		return statetype > characterState.globalState_Begin && statetype < characterState.globalState_End
	}

	isActionState(statetype) {
		return statetype > characterState.actionState_Begin && statetype < characterState.actionState_End
	}

	isPostureState(statetype) {
		return statetype > characterState.postureState_Begin && statetype < characterState.postureState_End
	}

	isState(statetype) {

		if (this.isGlobalState(statetype)) {//全局
			return this.mGlobalState == statetype

		} else if (this.isActionState(statetype)) {//动作
			return this.mActionState == statetype

		} else if (this.isPostureState(statetype)) {//姿态
			return this.mPostureState == statetype

		}
		return false

	}

	setState(statetype) {

		//if(characterState[statetype] == null ){
		//	TLog.Error("CharacterFSM.setState %s ! exsit", tostring(statetype))
		//	return
		//}

		let oldState = -1

		if (statetype > characterState.globalState_Begin && statetype < characterState.globalState_End) {//全局
			oldState = this.mGlobalState
			this.mGlobalState = statetype

		} else if (statetype > characterState.actionState_Begin && statetype < characterState.actionState_End) {//动作
			oldState = this.mActionState
			this.mActionState = statetype

		} else if (statetype > characterState.postureState_Begin && statetype < characterState.postureState_End) {//姿态
			oldState = this.mPostureState
			this.mPostureState = statetype
		} else {
			TLog.Error("CharacterFSM.setState %s ! scope in characterState", tostring(statetype))
		}

		if (oldState != -1 && oldState != statetype) {
			this.mCharacter.onStateChange(oldState, statetype)
		}

	}


	canToState(statetype) {
		if (this.isBlock(this.mGlobalState, statetype)) {
			return false
		} else if (this.isBlock(this.mActionState, statetype)) {
			return false
		} else if (this.isBlock(this.mPostureState, statetype)) {
			return false
		}
		return true
	}


	isBlock(curState, toState) {
		let stateRule = characterStateBlockRule[curState]

		//没有定义规则，则不阻挡
		if (stateRule == null) {
			return false
		}

		for (let _ = 0; _ < stateRule.length; _++) {
			let v = stateRule[_]

			if (v == toState) {
				return true
			}
		}
		return false
	}
}