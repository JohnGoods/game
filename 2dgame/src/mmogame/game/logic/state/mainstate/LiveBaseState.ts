class LiveBaseState extends BaseState {



	timer: number;
	time: number;
	max_time: number;
	begin: number;
	begin_max: number;
	curTouchPoint: { x: number, y: number };
	lastTouchPoint: { x: number, y: number };


	//子类复写 初始化函数
	public initObj(...params: any[]): void {
		this.mStateType = params[0];

		this.time = 0					// 按住鼠标间隔
		this.max_time = 200		// 按住鼠标间隔多少秒自动移动一次
		this.begin = 0				// 按住鼠标开始移动计算时间
		this.begin_max = 500		// 按住鼠标,begin到多少毫秒才开始自动移动

		this.curTouchPoint = newPos(-1, -1)
		this.lastTouchPoint = newPos(-1, -1)
	}
	//子类复写 析构函数
	protected destory(): void {

	}


	Activate() {
		super.Activate()
		//SceneManager.getInstance().setScenePersScale(SCENE_PERS_SCALE_LIVE)//精灵缩放比例

		//IGlobal.resGroupManager.loadGroup(ResourceGroupDefine.Group_LiveCommon)
	}

	Deactive() {
		super.Deactive()
		this.endAuto()
	}

	EnableSubState(statetype: number): boolean {
		return (statetype >= state_type.LIVE_BASE_STATE && statetype <= state_type.LIVE_BASE_STATE_END);
	}

	getLogicHitActor(x: number, y: number) {
		var actorList: any[] = SceneManager.getInstance().findHitActorListWithSceenXY(x, y);

		var hitActor = null;
		var hitNpcActor = null;

		//var hitActorList = {}

		function sortFunc(a: any, b: any): number {
			if (a.getActorType() == b.getActorType()) {
				if (a.getActorType() != actor_Type.ACTOR_TYPE_NPC) {
					var pa = a.getMapXY()
					var pb = b.getMapXY()

					return pb.y - pa.y ;
				} else {

					var configA = GameConfig.npcConfig[a.getEntryId()] || { touch: 0 }
					var configB = GameConfig.npcConfig[b.getEntryId()] || { touch: 0 }

					if (configA.touch == configB.touch) {
						pa = a.getMapXY()
						pb = b.getMapXY()

						return pb.y - pa.y
					} else {
						return configB.touch - configA.touch
					}
				}
			} else {
				//npc的属性值比player的属性值要小
				return a.getActorType() - b.getActorType()
			}
		}

		actorList.sort(sortFunc)

		return actorList[0]
	}


	onMouseDown(args: egret.TouchEvent): boolean {

		if (CheckHeroCanGo()) {
			this.curTouchPoint = newPos(args.stageX, args.stageY)

			this.onClickMap(this.curTouchPoint);
			//end

			// 定时器
			if (!this.timer) {
				this.timer = SetTimer(this.beginAuto, this, 10)
			}
		}


		var hitActor = this.getLogicHitActor(args.stageX, args.stageY);
		//点击玩家同时，可以点击地图
		if (hitActor) {
			this.onClickActor(hitActor, args)
		}


		return true
	}

	onMouseMove(args: egret.TouchEvent): boolean {
		this.curTouchPoint = newPos(args.stageX, args.stageY)
		return true;
	}

	onMouseUp(args: egret.TouchEvent): boolean {
		this.endAuto()
		return true;
	}


	onClickActor(actor: Actor, args: egret.TouchEvent) {
		var actorType = actor.getActorType()

		ActorManager.getInstance().setTargetActor(actor)
	}

	onClickMap(stagePoint: { x: number, y: number }) {
		if (stagePoint.x == this.lastTouchPoint.x && stagePoint.y == this.lastTouchPoint.y)
			return;
		this.lastTouchPoint.x = stagePoint.x;
		this.lastTouchPoint.y = stagePoint.y;

		var sceneMrg: SceneManager = SceneManager.getInstance()
		var point: any = sceneMrg.screenXYtoMapXY(stagePoint.x, stagePoint.y)

		point = sceneMrg.mapXYtoCellXY(point.x, point.y);
		Command_Move(point.x, point.y)
		//var effect = EffectManager.getInstance():createSceneEffect(effectIndex.ClickMap, cellx, celly, true)
		FireEvent(EventDefine.MAP_CLICK, MapClickEvent.createObj(point.cellx, point.celly));

	}


	beginAuto(delay) {
		this.time = this.time + delay
		this.begin = this.begin + delay

		if (this.begin < this.begin_max) {
			return
		}
		if (this.time < this.max_time) {
			return
		}
		this.time = 0
		this.onClickMap(this.curTouchPoint)
	}

	endAuto() {
		if (this.timer) {
			KillTimer(this.timer)
			this.timer = null
		}
		this.time = 0
		this.curTouchPoint.x = -1
		this.curTouchPoint.y = -1

		this.lastTouchPoint.x = -1
		this.lastTouchPoint.y = -1

		this.begin = 0

	}

}