
module tool{
	export class FightEditor extends ToolEnterMap{

		seatType:string;
		casterPos:number;
		casterEntry:number;
		heroFlag:boolean;
		showResultName:string;

		public triggerEditor:FightTriggerFrame;
		public instructEditor:FightInstructFrame;
		public actionEditor:FightActionFrame;
		public effectEditor:FightEffectFrame;

		public constructor() {
			super();

			//--不显示主UI
			WngMrg.getInstance().setShowStateWindow(false)


			egret.TextField.default_size = 20;
			
		}

		
		onEnterGame(){
			this.casterPos = 1
			this.heroFlag = true

			this.showResultName = Localize_cns("FIGHT_ONCE_ATTACK")


			initFightResultConfig();
			initFightTooConfig();

			//战斗开始，添加角色
			this.refreshCombat()

			this.triggerEditor = FightTriggerFrame.newObj(this)
			this.triggerEditor.showWnd()

			this.instructEditor = FightInstructFrame.newObj(this)
			this.instructEditor.showWnd()

			this.actionEditor = FightActionFrame.newObj(this)
			//this.actionEditor.showWnd()

			this.effectEditor = FightEffectFrame.newObj(this)
			//this.effectEditor.showWnd();

			MapSystem.getInstance().enterMap(50014, 100, 100)
		}


		testSkillShow(skillShow){
			FightSystem.getInstance().getConfigSystem().readActionConfig(skillShow)
			FightSystem.getInstance().getShowSystem().onClear()
			var result_list:any[] = TEST_ATTACK_TYPE[this.showResultName] //or TEST_ATTACK_TYPE[varize_cns["FIGHT_ONCE_ATTACK"]] 
			TLog.Debug(this.showResultName, "cccccccccccccc")
			//for _, result in ipairs(result_list) do
			for(var i =0; i < result_list.length; i++){
				var result = result_list[i]
				var tempResult = JsUtil.objectCopy(result)
				tempResult.spellId = skillShow.index
				
				if(this.seatType){
					
					//bit.bor(tempResult.targetList)
					var pos = SeatMap[this.seatType][0]
					
					tempResult.targetList = bit.bor(tempResult.targetList, Math.pow(2, pos-1) )
					//for _, power in ipairs(tempResult.fightPowers) do
					for(var j =0; j < tempResult.fightPowers.length; j++){
						var power = tempResult.fightPowers[j];
						var actor = GetFightActorByPos(TOOL_ENEMEY_SIDE, pos)
						power.target = actor.getCombatId()
					}
				}
					
				if(this.heroFlag == true){
					var actor = GetFightActorByPos(TOOL_MY_SIDE, this.casterPos)
					if(actor){
						tempResult.caster = actor.getCombatId()
					}
				}else{
					tempResult.caster = FIGHT_FUNNAL_ID[TOOL_MY_SIDE]
				}
				
				FightSystem.getInstance().addResult(tempResult)
			}
		}

		refreshCombat(){

			var figherList = this.getToolFightList()
	
			FightSystem.getInstance().endFight()
			
			var timer = null
			function tick(delay){
				//再开始战斗
				FightSystem.getInstance().beginFight()
				FightSystem.getInstance().addFighterList(figherList)
				if(timer){
					KillTimer(timer)
					timer = null
				}
			}
			timer = SetTimer(tick, this, 1, false)
		}

		setShowResult(resultName){
			this.showResultName = resultName
		}

		setSeatType(seatType){
			this.seatType = seatType
		}

		setCasterEntry(entryId){
			this.casterEntry = entryId
		}


		setCasterPos(pos){
			this.casterPos = pos
		}

		getToolFightList(){
			var index = 0
	
			var tempFighterList:any[] = JsUtil.objectCopy(FightResultSpace.testFighterList)
			var fighterList = []
			
			//设置敌方位置
			if(this.seatType){
				//for i, v in pairs(tempFighterList) do
				tempFighterList.forEach(v=>{
					if(v.side == TOOL_ENEMEY_SIDE){
						if(SeatMap[this.seatType][index]){
							v.pos = SeatMap[this.seatType][index]
							index = index + 1
						}
					}
				})
					
			}//
			
			
			//for _, v in pairs(tempFighterList) do
			tempFighterList.forEach(v=>{
				if(v.side == TOOL_MY_SIDE){
					if(v.pos == this.casterPos || v.pos == FUNNAL_ACTOR_POS){
						//table.insert(fighterList, v)
						fighterList.push(v);
					}
				}else{
					fighterList.push(v);
				}
			})
				
			
			//设置自方模型
			if(this.casterEntry){
				//for i, v in pairs(fighterList) do
				fighterList.forEach(v=>{
					if(v.side == TOOL_MY_SIDE){
						v.entry = this.casterEntry
						//v.type_id = objectType.OBJECT_TYPE_PET
						
						if(GameConfig.MonsterScopeConfig[this.casterEntry]) {
							v.entry = 100101
							v.type_id = objectType.OBJECT_TYPE_MONSTER
							v.image = this.casterEntry
						} else if (GameConfig.ActorXianLvConfig[this.casterEntry]){//这是仙侣
							v.type_id = objectType.OBJECT_TYPE_MONSTER
						} else if (GameConfig.PetConfig[this.casterEntry]) {
							v.type_id = objectType.OBJECT_TYPE_PET
						} else if (GameConfig.ActorRoleConfig[this.casterEntry]) {
							v.type_id = objectType.OBJECT_TYPE_PLAYER
						}
						
					}
				})
					
			}
			return fighterList
		}

		
	}
}
