module tool {
	export class ToolEnterMap extends ToolUnit{

		mConfigList:Object;

		precedure:number;
		heroMapId:number;
		heroX:number;
		heroY:number;
		heroShow:boolean;

		public constructor() {
			super();
			this.precedure = PRECEDURE_GAME
			this.setHeroEnterMap(50002, 70, 32)
			this.setHeroShow(true)

			RegisterEvent(EventDefine.PRECEDURE_ACTIVE, this.onGamePrecedure, this);
			RegisterEvent(EventDefine.HERO_ENTER_GAME, this.onEnterGame, this);
		}


		setHeroEnterMap(mapId:number, x:number, y:number){
			this.heroMapId = mapId
			this.heroX = x
			this.heroY = y
		}

		setHeroShow(show:boolean){
			this.heroShow = show;
		}


		onStart():void{

			IGlobal.setting.setRoleName("test")
			PrecedureManager.getInstance().changePrecedure(this.precedure);

		}
		
		
		onExit():void{

		}



		onGamePrecedure(event:PrecedureEvent){
			if(event.state != PRECEDURE_GAME)
				return;
			if(this.heroShow){
				var message = GetMessage(opCodes.G2C_MAP_ENTER)
				message.mapId = this.heroMapId 
				message.cellx = this.heroX
				message.celly = this.heroY
				GameNetDispatcher.getInstance().dispatchMessage(message)
				
				var message = GetMessage(opCodes.G2C_HERO_INFO)
				var info:any = {}
				info.id = 10
				info.name = "test"
				info.followTip = 0
				info.sex = 0
				info.race = 0
				info.icon = 101
				info.body = 0
				info.level = 10;
				info.experience = 0;
				info.funds = 0;
				info.gold = 0;
				info.power = 0;
				info.saveRecord = {};
				// message.info = info
				// GameNetDispatcher.getInstance().dispatchMessage(message)
				RpcLogic.G2C_HeroInfoInit.call(this, info)

				//GetHero().loadModel(3012)
				
			}
		}

	

		onEnterGame(){

		}


	}
}