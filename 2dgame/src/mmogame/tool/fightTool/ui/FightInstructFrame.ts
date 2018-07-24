module tool {
	export class FightInstructFrame extends BaseWnd{
		mFightEditor:FightEditor;

		public initObj(...params:any[]){
			this.mLayoutPaths = ["resource/layouts/tool/FightInstructLayout.exml"]
			this.mFightEditor = params[0];
		}

		public onLoad():void{
			this.mLayoutNode.skinName = this.mLayoutPaths[0];
			this.mLayoutNode.right = 0
			this.mLayoutNode.top = 0;
			this.mLayoutNode.setCanDrag(true)

			var elemInfo =[
				
				{["name"] : "btn_refresh",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onRefresh},
				{["name"] : "btn_casterMode",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onCasterMode},
				{["name"] : "btn_exchangeSide",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onExchangeSide},

				{["name"] : "combox_attacktype",  ["title"] : null,  ["event_name"] : gui.ComboBox.onClick, ["fun_index"] : this.onAttackTypeChange},
				{["name"] : "combox_seattype",  ["title"] : null,  ["event_name"] : gui.ComboBox.onClick, ["fun_index"] : this.onSeatTypeChange},
				{["name"] : "combox_modeltype",  ["title"] : null,  ["event_name"] : gui.ComboBox.onClick, ["fun_index"] : this.onModelTypeChange},
				{["name"] : "combox_posttype",  ["title"] : null,  ["event_name"] : gui.ComboBox.onClick, ["fun_index"] : this.onPosTypeChange},
				
			];
			UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);


			this.initCombox(this.mElemList["combox_attacktype"])
			this.initCombox(this.mElemList["combox_seattype"])
			this.initCombox(this.mElemList["combox_modeltype"])
			this.initCombox(this.mElemList["combox_posttype"])


			this.initAttackTypeCombox();
			this.initSeatTypeCombox();
			this.initModelTypeCombox();
			this.initPostTypeCombox();
		}


		initCombox( cb:gui.ComboBox ){
			//设置标题
			cb.setTitleHeight(20)
			cb.setTitleBackground("titleBackground");
			cb.setTitleFontSize(20)

			cb.setItemWidth(cb.width);
			cb.setItemHeight(25)
			cb.setItemFontSize(18)
		}

		initAttackTypeCombox(){
			var data = [];
			JsUtil.objectForEach(TEST_ATTACK_TYPE, (v,i)=>{
				data.push({bg:"itemBg4",content:i});
			})

			var cb:gui.ComboBox = this.mElemList["combox_attacktype"];
			cb.data = data;
			cb.setTitle( Localize_cns("FIGHT_ONCE_ATTACK"))

			this.mFightEditor.setShowResult(Localize_cns("FIGHT_ONCE_ATTACK"));

		}


		initSeatTypeCombox(){
			var data = [
				{bg:"itemBg4",content:Localize_cns("FIGHT_SEAT_WHOLE")},
				{bg:"itemBg4",content:Localize_cns("FIGHT_SEAT_FRONT_FRONT")},
				{bg:"itemBg4",content:Localize_cns("FIGHT_SEAT_BACK_BACK")},

			];

			var cb:gui.ComboBox = this.mElemList["combox_seattype"];
			cb.data = data;
			cb.setTitle( data[0].content);
		}

		initModelTypeCombox(){
			
			//角色表
			var sortRoleList = [];
			JsUtil.objectForEach(GameConfig.ProfessionModelConfig, list=>{
				JsUtil.objectForEach(list, v=>{
					let name = "undefine"
					if (GameConfig.ActorRoleConfig[v.entryId]) {
						name = GameConfig.ActorRoleConfig[v.entryId].name
					}
					sortRoleList.push({bg:"itemBg4",content:v.entryId+"_"+name, id:v.entryId});
				})
			})
			sortRoleList.sort((a, b)=>{
				return a.id - b.id
			})
			
			//部下表
			var sortPetList = [];
			JsUtil.objectForEach(GameConfig.PetConfig, v=>{
				sortPetList.push({bg:"itemBg4",content:v.Id+"_"+v.name, id:v.Id});
			})
			sortPetList.sort((a, b)=>{
				return a.id - b.id
			})

			//怪物表
			var sortMonsterList = [];
			JsUtil.objectForEach(GameConfig.MonsterScopeConfig, v=>{
				sortMonsterList.push({bg:"itemBg4",content:v.Id+"_"+v.Name, id:v.Id});
			})
			sortMonsterList.sort((a, b)=>{
				return a.id - b.id
			})

			//仙侣表
			var sortXianLvList = [];
			JsUtil.objectForEach(GameConfig.ActorXianLvConfig, v=>{
				sortXianLvList.push({bg:"itemBg4",content:v.Id+"_"+v.Name, id:v.Id});
			})
			sortXianLvList.sort((a, b)=>{
				return a.id - b.id
			})

			var data = sortRoleList.concat(sortPetList, sortMonsterList, sortXianLvList);
			var cb:gui.ComboBox = this.mElemList["combox_modeltype"];
			cb.data = data;
			cb.setTitle( "模型选择");

		}

		initPostTypeCombox(){
			var data = [
				{bg:"itemBg4",content:1},
				{bg:"itemBg4",content:2},
				{bg:"itemBg4",content:3},
				{bg:"itemBg4",content:4},
				{bg:"itemBg4",content:5},
				{bg:"itemBg4",content:6},
				{bg:"itemBg4",content:FUNNAL_ACTOR_POS},

			];

			var cb:gui.ComboBox = this.mElemList["combox_posttype"];
			cb.data = data;
			cb.setTitle( "位置选择");
		}


		public onUnLoad():void{

		}

		public onShow():void{
			this.mLayoutNode.visible = true;
		}

		public onHide():void{
			this.mLayoutNode.visible = false;
		}


		public onRefresh(){
			this.mFightEditor.refreshCombat();
		}

		public onCasterMode(){
			if(this.mFightEditor.heroFlag == true){
				this.mFightEditor.heroFlag = false
				this.mElemList["btn_casterMode"].label = "翅膀发动"
			}else{
				this.mFightEditor.heroFlag = true
				this.mElemList["btn_casterMode"].label = "角色发动"
			}
		}

		public onExchangeSide(){
			//交换位置
			if(TOOL_MY_SIDE == fightSide.FIGHT_LEFT){
				TOOL_MY_SIDE = fightSide.FIGHT_RIGHT
				TOOL_ENEMEY_SIDE = fightSide.FIGHT_LEFT
			}else{
				TOOL_MY_SIDE = fightSide.FIGHT_LEFT
				TOOL_ENEMEY_SIDE = fightSide.FIGHT_RIGHT
			}


			FightResultSpace.testFighterList.forEach(v=>{
				if(v.side == fightSide.FIGHT_LEFT){
					v.side = fightSide.FIGHT_RIGHT
				}else{
					v.side = fightSide.FIGHT_LEFT
				}
			})
			
			this.mFightEditor.refreshCombat()
		}


		private onAttackTypeChange(event:egret.Event){
			var cb = this.mElemList["combox_attacktype"];
			var data = cb.data;
			cb.setTitle(data[event.data.itemIndex].content ) ;
			cb.hide();

			this.mFightEditor.setShowResult(data[event.data.itemIndex].content );
		}

		private onSeatTypeChange(event:egret.Event){
			var cb = this.mElemList["combox_seattype"];
			var data = cb.data;
			cb.setTitle(data[event.data.itemIndex].content ) ;
			cb.hide();

			this.mFightEditor.setSeatType(data[event.data.itemIndex].content)
			this.mFightEditor.refreshCombat();
		}

		private onModelTypeChange(event){
			var cb = this.mElemList["combox_modeltype"];
			var data = cb.data;

			var content:string = data[event.data.itemIndex].content
			cb.setTitle(content ) ;
			cb.hide();

			var modelEntryStr = StringUtil.stringMatch(content, /(\d+)_.+/)[0];
			var modelEntry = tonumber(modelEntryStr);

			this.mFightEditor.setCasterEntry(modelEntry);
			this.mFightEditor.refreshCombat();
		}

		private onPosTypeChange(event){
			var cb = this.mElemList["combox_posttype"];
			var data = cb.data;
			cb.setTitle(data[event.data.itemIndex].content ) ;
			cb.hide();


			this.mFightEditor.setCasterPos(data[event.data.itemIndex].content)
			this.mFightEditor.refreshCombat();
		}
		
	}
}