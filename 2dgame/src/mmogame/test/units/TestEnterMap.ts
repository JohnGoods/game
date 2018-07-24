module test {
	export class TestEnterMap extends TestUnit {

		mConfigList: Object;

		precedure: number;
		heroMapId: number;
		heroX: number;
		heroY: number;
		heroShow: boolean;

		public constructor() {
			super();
			this.precedure = PRECEDURE_GAME
			this.setHeroEnterMap(50023, 50, 32)
			this.setHeroShow(true)

			RegisterEvent(EventDefine.PRECEDURE_ACTIVE, this.onGamePrecedure, this);

			//IGlobal.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageMouseDown, this);
		}


		setHeroEnterMap(mapId: number, x: number, y: number) {
			this.heroMapId = mapId
			this.heroX = x
			this.heroY = y
		}

		setHeroShow(show: boolean) {
			this.heroShow = show;
		}


		onStart(): void {
			//WngMrg.getInstance().setShowStateWindow(false);
			IGlobal.setting.setRoleName("test")
			PrecedureManager.getInstance().changePrecedure(this.precedure);

		}


		onExit(): void {

		}


		onStageMouseDown(event: egret.TouchEvent): void {

		}



		onGamePrecedure(event: PrecedureEvent) {
			if (event.state != PRECEDURE_GAME)
				return;
			if (this.heroShow) {
				var message = GetMessage(opCodes.G2C_MAP_ENTER)
				message.mapId = this.heroMapId
				message.cellx = this.heroX
				message.celly = this.heroY
				GameNetDispatcher.getInstance().dispatchMessage(message)

				//var message = GetMessage(opCodes.G2C_HERO_INFO)
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
				info.sexId = 1
				info.vocation = 10001
				info.rideShapeId = 15001
				info.heroShapeId = 90010
				info.heroTitleId = 80002
				info.tianxianShapeId = 11001

				info.petShapeId = 20002
				info.petTLShapeId = 18001//通灵
				info.petSHShapeId = 22001//兽魂

				info.xianlvShapeId = 17001
				info.xlFZShapeId = 18002//法阵
				info.xlXWShapeId = 19001//仙位
				RpcLogic.G2C_HeroInfoInit(info)
				// message.info = info
				// GameNetDispatcher.getInstance().dispatchMessage(message)

			}

			let hero:Hero = GetHero()
			// hero.doCommand(ActorCommand.SetHpSlotVisible, true, null)
			// hero.doCommand(ActorCommand.ShowCombatAutoHpSlot, 0, fightSide.FIGHT_RIGHT)
			// hero.doCommand(ActorCommand.SetFactionName, "factionStr")
			// hero.loadModel(31001)
			// hero.setWing(103001)
			// hero.setRide(105001)
			// hero.setWeaponId(102001)

			ChangePatrolState(false)

			//hero.loadModel(100037)

			// let hero:Hero = GetHero()
			// hero.setFootBindEffect(GetShapeEffectId(18001))


			// let timerId = 0;
			// let onTimerCallback = function(dt){
			// 	KillTimer(timerId);
			// 	hero.loadModel(90011)
			// }

			// timerId = SetTimer(onTimerCallback, this, 1000);

			//SceneManager.getInstance().setBgImage("ui/image/daTi/dt_ztBg01.png", 0, 200)

			//this.testPerform()
			// var boneParam:any = {}
			// boneParam.name = "wing_point"
			// boneParam.order = -1
			// let actor = GetHero();
			// var effect:Effect = EffectManager.getInstance().createBindEffect(90056, actor, boneParam)
			//effect = EffectManager.getInstance().createBindEffect(90057, actor, boneParam)

			// boneParam.order = 1
			// var effect:Effect = EffectManager.getInstance().createBindEffect(90058, actor, boneParam)
			//effect = EffectManager.getInstance().createBindEffect(90057, actor, boneParam)

		}

		testPerform() {
			TLog.Debug("TestEnterMap.testPerform")
			let timerId = 0

			//let modelIdList:any = {10003, 40001, 10002, 30002}
			//let modelIdList:any = {10001}
			let modelIdList = [ 21001, 21003, 21004, 21005,21006,21013,21017,21018]
		
			let all = 300



			function moveActorRandom(_) {
				let objList = ActorManager.getInstance().getNpcList()
				let scope = 100
				//for(let i = 1; i <=  100;i++){
				//	let ri = MathUtil.random(1, all)
				//	let obj = objList[ri]
				//	if(obj &&  obj.isState(characterState.actionState_idle) ){
				//		let cellx, celly = obj.getCellXY()
				//		
				//		let dx = MathUtil.random(1, scope*2) - scope
				//		let dy = MathUtil.random(1, scope*2) - scope
				//		
				//		obj.wantToGoByCell(cellx+dx, celly + dy, true)
				//	}
				//}
				for (let id in objList) {
					let obj = objList[id]

					if (obj.isState(characterState.actionState_idle)) {
						let cellPos = obj.getCellXY()

						let dx = MathUtil.random(1, scope * 2) - scope
						let dy = MathUtil.random(1, scope * 2) - scope

						obj.wantToGoByCell(cellPos.x + dx, cellPos.y + dy, true)
					}

				}

			}

			function addNpcFunction(dt) {
				for (let i = 1; i <= all; i++) {
					let index = MathUtil.random(1, modelIdList.length)

					// let message = GetMessage(opCodes.G2C_ROLE_ADD)
					// let info = PlayerInfo.newObj()
					// info.id = i
					// info.body = modelIdList[modelIdx - 1]
					// info.name = "name_"+i
					// info.level = 0
					// info.Icon = 0
					// message.info = info
					// message.cellx = this.heroX + (i % 10) * 3
					// message.celly = this.heroY + (i / 10)
					// message.mapId = this.heroMapId

					// GameNetDispatcher.getInstance().onTcpRecv(message)
					let entryId = modelIdList[index - 1]

					let npcInfo:any = {}
					npcInfo.cellx = this.heroX - (i % 10) * 3;
					npcInfo.celly = this.heroY + (i / 10);
					npcInfo.dir = 1;
					npcInfo.entryId = GameConfig.npcConfig[entryId].id;
					npcInfo.id = i;
					npcInfo.image = GameConfig.npcConfig[entryId].model;
					npcInfo.name = "";
					npcInfo.param = [];
					npcInfo.taskInfo = {};
					let npc:Npc = ActorManager.getInstance().createNpc(npcInfo)
					npc.setTouchEnable(false)
				}
				KillTimer(timerId)

				//SetTimer(moveActorRandom, this, 1000)
			}
			timerId = SetTimer(addNpcFunction, this, 3000)//延时3秒，为了可以正常加载地图

		}

	}
}