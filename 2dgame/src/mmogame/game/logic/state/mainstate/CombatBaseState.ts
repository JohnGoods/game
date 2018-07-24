class CombatBaseState extends BaseState {

	mouseDown: boolean;
	lastBackGroundMusic: string;
	//子类复写 初始化函数
	public initObj(...params: any[]): void {


		this.mouseDown = false

		this.lastBackGroundMusic = null
	}
	//子类复写 析构函数
	protected destory(): void {

	}


	Activate() {
		this.lastBackGroundMusic = GameSound.getInstance().getCurMusicName() || null

		GameSound.getInstance().playEffect(SystemSound.effect_kaizhan)


		let [fightType,_] = FightSystem.getInstance().getCurFightType()
		if(fightType != opFightResultType.PATROL){
			GameSound.getInstance().playMusic(SystemSound.music_combat, true)
		}else{
			this.lastBackGroundMusic = null;
		}
		
		

		//SceneManager.getInstance().setScenePersScale(SCENE_PERS_SCALE_FIGHT)//精灵缩放比例
	}

	Deactive() {
		GameSound.getInstance().unloadAllEffect()//卸载所有音响

		if(this.lastBackGroundMusic != null)
			GameSound.getInstance().playMusic(this.lastBackGroundMusic, true)
	}




	EnableSubState(statetype) {
		return (statetype >= state_type.COMBAT_BASE_STATE && statetype <= state_type.COMBAT_BASE_STATE_END)
	}


	onClickActor(actor, args) {
		//TLog.Debug("combat_base_state.OnClickActor")

		if (actor.getActorType() == actor_Type.ACTOR_TYPE_AWARD) {
			actor.onClickActor(args)
		} else {
			FireEvent(EventDefine.COMBAT_FIGHTER_CLICK, ActorEvent.newObj(actor))
		}

	}
	//
	onMouseDown(args:egret.TouchEvent) {
		let hitActorList = SceneManager.getInstance().findHitActorListWithSceenXY(args.stageX, args.stageY)
		let hitActor = null

		if (size_t(hitActorList)) {
			let [flag, _] = FightSystem.getInstance().isDefendSkillPicking()
			if (flag == true) {
				for (let _ in hitActorList) {
					let actor = hitActorList[_]

					if (actor.getActorType() != actor_Type.ACTOR_TYPE_AWARD) {
						hitActor = actor
						break
					}
				}
			} else {
				for (let _ in hitActorList) {
					let actor = hitActorList[_]

					if (actor.getActorType() == actor_Type.ACTOR_TYPE_AWARD) {
						hitActor = actor
						break
					}
				}
			}
		}

		if (hitActor) {
			this.onClickActor(hitActor, args)
		} else {
			FireEvent(EventDefine.COMBAT_FIGHT_CLICK_MAP, null)
		}
		this.mouseDown = true
		return true
	}

	onMouseMove(args) {
		if (this.mouseDown == false) {
			return
		}

		let hitActor = SceneManager.getInstance().findHitActorWithSceenXY(args.x, args.y)
		if (hitActor) {
			this.onClickActor(hitActor, args)
		}
		return true
	}

	onMouseUp(args) {
		this.mouseDown = false
		return true;
	}

}