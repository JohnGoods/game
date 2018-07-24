class GlobalMiningState extends BaseState {
	mouseDownFlag: boolean
	curTouchPoint: { x: number, y: number };
	lastTouchPoint: { x: number, y: number };
	registerFlag: boolean
	targetActor: any

	//子类复写 初始化函数
	public initObj(...params: any[]): void {
		this.mStateType = params[0];

		this.curTouchPoint = newPos(-1, -1)
		this.lastTouchPoint = newPos(-1, -1)
		this.mouseDownFlag = false
		this.registerFlag = false
		this.targetActor = null
	}
	//子类复写 析构函数
	protected destory(): void {

	}


	Activate() {
		if (this.registerFlag == false) {
			this.registerFlag = true
			RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.onRootWindowMouseUp, this)
		}
		super.Activate()
		SceneManager.getInstance().cameraUnLinkActor()
		//SceneManager.getInstance().setScenePersScale(SCENE_PERS_SCALE_LIVE)//精灵缩放比例

		//IGlobal.resGroupManager.loadGroup(ResourceGroupDefine.Group_LiveCommon)
	}

	Deactive() {
		if (this.registerFlag == true) {
			this.registerFlag = false
			UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.onRootWindowMouseUp, this)
		}
		super.Deactive()
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
		this.curTouchPoint = newPos(args.stageX, args.stageY)

		var hitActor = this.getLogicHitActor(args.stageX, args.stageY);
		//点击玩家同时，可以点击地图
		if (hitActor) {
			this.targetActor = hitActor
		}

		this.mouseDownFlag = true
		return true
	}

	onMouseMove(args: egret.TouchEvent): boolean {
		this.targetActor = null
		if (this.mouseDownFlag == false) {
			return true
		}

		if (GetActivity(ActivityDefine.GlobalMining).isFollowCamera() == true) {
			GetActivity(ActivityDefine.GlobalMining).setFollowCamera(false)
			let wnd = WngMrg.getInstance().getWindow("GlobalMiningMainFrame")
			wnd.doCommand("updateFollowBtn")
			return true
		}

		let lastTouchPoint = this.curTouchPoint || {x:0, y:0}
		this.curTouchPoint = newPos(args.stageX, args.stageY)

		// FireEvent(EventDefine.MAP_TOUCH_MOVE, MapTouchMoveEvent.createObj(lastTouchPoint.x, lastTouchPoint.y, this.curTouchPoint.x, this.curTouchPoint.y));
		let centerPoint = SceneManager.getInstance().getCameraXY()
		SceneManager.getInstance().lookAtCenter(centerPoint.x - (this.curTouchPoint.x - lastTouchPoint.x), centerPoint.y - (this.curTouchPoint.y - lastTouchPoint.y))
		return true;
	}

	onMouseUp(args: egret.TouchEvent): boolean {
		this.mouseDownFlag = false

		var hitActor = this.getLogicHitActor(args.stageX, args.stageY);
		if (hitActor && this.targetActor == hitActor) {
			this.onClickActor(hitActor, args)
		}

		this.targetActor = null
		return true;
	}


	onClickActor(actor: Actor, args: egret.TouchEvent) {
		var actorType = actor.getActorType()

		GetActivity(ActivityDefine.GlobalMining).onClickActor(actor)
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

	onRootWindowMouseUp(args) {
		this.mouseDownFlag = false
	}
}