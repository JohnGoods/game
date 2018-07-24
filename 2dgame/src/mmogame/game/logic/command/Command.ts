
/*
作者:
    yangguiming
	
创建时间：
   2013.7.23(周二)

意图：
   Hero命令

公共接口：
   start(){
   finish(){
   
   
   //子类实现
   onStart(){
   onFinish(){
*/

class CommandBase extends TClass {
	queue: CommandQueue;
	bFinish: boolean;
	bStart: boolean;

	public initObj(...args: any[]): void {
		this.queue = null
		this.bFinish = false
		this.bStart = false
	}

	destory() {

	}

	setOwnerQueue(queue) {
		this.queue = queue
	}

	start() {

		if (this.bStart == false) {
			this.bStart = true
			//TLog.Debug("Command:", this.classname, "start")
			this.onStart()
		}
	}

	restart() {
		//命令已经开始而且还没结束，就重新启动。
		if (!this.bStart || this.bFinish) {
			return
		}

		this.onFinish()
		this.onStart()
	}

	finish(bNotify?) {
		bNotify = bNotify != false

		//TLog.Debug("Command:", this.classname, "finish")
		if (this.bStart == true && this.bFinish == false && this.queue) {
			this.bFinish = true
			this.onFinish()

			if (bNotify) {
				this.queue.onCommandFinish(this)
			}
		}
	}

	isFinish() {
		return this.bFinish
	}

	onStart() {

	}

	onFinish() {

	}


	////////////////////////////////////////////////////////////////////////
	//移动命令基类
}

class CommandMoveBase extends CommandBase {
	mapId: number;
	cellx: number;
	celly: number;

	scope: number;
	args: any;

	public initObj(...params: any[]): void {
		this.mapId = params[0];
		this.cellx = params[1];
		this.celly = params[2];
		this.scope = params[3];
		this.args = params[4];
	}

	destory() {
		this.finish(false)
	}


	onStart() {
		let hero = GetHero()
		var pointCell = hero.getCellXY();
		var heroCellX = pointCell.x;
		var heroCellY = pointCell.y;

		if (MapSystem.getInstance().getMapId() == this.mapId && MathUtil.checkScope(heroCellX, heroCellY, this.cellx, this.celly, this.scope)) {
			this.finish()
		} else {
			//无法走到当前点，直接完成
			let canmove = this.moveStart()
			if (canmove == false) {
				this.finish()
			} else {
				RegisterEvent(EventDefine.HERO_MOVE, this.onHeroMove, this) //注册主角移动事件
				//RegisterEvent(EventDefine.HERO_MOVE_STOP, this.onHeroMoveStop, this) //注册主角移动事件
			}

		}
	}

	onFinish() {
		UnRegisterEvent(EventDefine.HERO_MOVE, this.onHeroMove, this) //注册主角移动事件
	}

	onHeroMove(args) {
		//PROFILE_START("CommandMoveBase.onHeroMove")
		var currentMapId = MapSystem.getInstance().getMapId()

		if (this.mapId == currentMapId) {
			var hero = GetHero()
			var heroPoint = hero.getCellXY()

			if (MathUtil.checkScope(heroPoint.x, heroPoint.y, this.cellx, this.celly, this.scope)) {
				this.finish()
			}
		}
		//PROFILE_STOP("CommandMoveBase.onHeroMove")
	}


	moveStart() {
		return false
	}

	//移动命令
	////////////////////////////////////////////////////////////////////////
}

class CommandMove extends CommandMoveBase {
	moveStart() {
		return HeroMoveTo(this.cellx, this.celly)
	}

	//寻路命令
	////////////////////////////////////////////////////////////////////////
}

class CommandFindWay extends CommandMoveBase {
	moveStart(): boolean {
		FireEvent(EventDefine.HERO_AUTOFINDWAY, AutoFindWayEvent.newObj(this.args))
		MapSystem.getInstance().setFindWay(true)
		return FindWayToGo(this.mapId, this.cellx, this.celly)
	}

	onFinish() {
		HeroMoveStop() //主角停止
		MapSystem.getInstance().setFindWay(false)
		FireEvent(EventDefine.HERO_AUTOFINDWAY, AutoFindWayEvent.newObj([AutoActionType.NULL, null, null, null]))
		super.onFinish()
	}


	////////////////////////////////////////////////////////////////////////
	//npc对话命令
}

class CommandTalkNpc extends CommandBase {
	npcEntryId: number;
	npcId: number;

	public initObj(...params: any[]): void {
		this.npcEntryId = params[0];
		this.npcId = params[1];
	}

	destory() {

	}

	onStart() {
		let npcObject = ActorManager.getInstance().getNpcWithEntryId(this.npcEntryId)
		if (this.npcId) {
			npcObject = ActorManager.getInstance().getNpc(this.npcId)
		}

		//如果超过了谈话最大距离，则跑过去
		if (npcObject) {
			var npcPoint = npcObject.getCellXY()
			var heroPoint = GetHero().getCellXY()

			if (MathUtil.checkScope(heroPoint.x, heroPoint.y, npcPoint.x, npcPoint.y, NPCTALK_MAX_SCOPE) == true) {
				Task_ShowNpcDialogWithNpc(npcObject.getId())
			}
		}
		this.finish()
	}

	////////////////////////////////////////////////////////////////////////
	//自动行走遇敌
}

class CommandAutoRun extends CommandBase {

	startPoint: any;
	endPoint: any;
	timer: any;

	fightDuring: number;

	public initObj(...args: any[]): void {
		this.fightDuring = 0;
	}

	destory() {

	}

	genEndPoint() {
		let hero = GetHero()
		let heroPos = hero.getCellXY()

		let currentMapId = MapSystem.getInstance().getMapId()
		let mapSize = MapSystem.getInstance().getMapSize(currentMapId)
		let mapSizeCell = SceneManager.getInstance().mapXYtoCellXY(mapSize.w, mapSize.h)


		// let heroCellX = heroPos.x
		// let heroCellY = heroPos.y
		let mapCellW = mapSizeCell.x
		let mapCellH = mapSizeCell.y
		let centerX = Math.floor(mapCellW / 2)
		let centerY = Math.floor(mapCellH / 2)
		

		//let AUTORUN_SCOPE = 30

		let randomX = (MathUtil.random() - 0.5) * mapCellW
		let randomY = (MathUtil.random() - 0.5) * mapCellH
		let endPoint: any = {}
		endPoint.x = centerX + randomX
		endPoint.y = centerY + randomY

		if (endPoint.x < 0 || endPoint.y < 0 || endPoint.x > mapCellW || endPoint.y > mapCellH) {
			endPoint.x = mapCellW / 2 + randomX
			endPoint.y = mapCellH / 2 + randomY
		}


		endPoint.x = Math.floor(endPoint.x)
		endPoint.y = Math.floor(endPoint.y)

		// let dirR1 = MathUtil.random(100000) % 3 - 1
		// let dirR2 = MathUtil.random(100000) % 3 - 1
		// if (dirR1 == 0 && dirR2 == 0) {
		// 	dirR2 = 1
		// }

		// let startPoint: any = { x: heroCellX, y: heroCellY }
		// let endPoint: any = { x: (heroCellX + mapCellW * dirR1 / 2) % mapCellW, y: (heroCellY + mapCellH * dirR2 / 2) % mapCellH }

		// let w = mapCellW / 2 - heroCellX, h = mapCellH / 2 - heroCellY
		// let kx = w / (Math.abs(w) + Math.abs(h)), ky = h / (Math.abs(w) + Math.abs(h))
		// let AUTORUN_SCOPE = 10

		// let maxStep = 0
		// while (SceneManager.getInstance().isBlock(endPoint.x, endPoint.y)) {
		// 	endPoint.x = endPoint.x + AUTORUN_SCOPE * kx
		// 	endPoint.y = endPoint.y + AUTORUN_SCOPE * ky

		// 	if (endPoint.x <= 0 || endPoint.x >= mapCellW || endPoint.y <= 0 || endPoint.y >= mapCellH) {
		// 		endPoint.x = mapCellW / 2 + (kx < 0 && -1 || 1) * mapCellW / 2
		// 		endPoint.y = mapCellH / 2 + (ky < 0 && -1 || 1) * mapCellH / 2

		// 		kx = 1 * (kx < 0 && 1 || -1)
		// 		ky = 1 * (ky < 0 && 1 || -1)
		// 	}
		// 	maxStep++;

		// 	if(maxStep > 30)
		// 		break;
		// }

		//this.startPoint = startPoint
		this.endPoint = endPoint
	}
	onStart() {
		//MapSystem.getInstance().setAutoRun(true)

		this.fightDuring = 0;

		//RegisterEvent(EventDefine.HERO_MOVE, this.onHeroMove, this)
		//RegisterEvent(EventDefine.HERO_STOP, this.onHeroStop, this)
		RegisterEvent(EventDefine.MAP_CLICK, this.onClickMap, this)

		this.genEndPoint()
		this.startToRun()
		FireEvent(EventDefine.HERO_AUTOFINDWAY, AutoFindWayEvent.newObj([AutoActionType.AUTORAN, null, null, null]))

		if (!this.timer) {
			this.timer = SetTimer(this.tick, this, 500, false)
		}
	}

	onFinish() {
		//UnRegisterEvent(EventDefine.HERO_STOP, this.onHeroStop, this)
		UnRegisterEvent(EventDefine.MAP_CLICK, this.onClickMap, this)

		// let tick = function () {
		// 	if (CommandManager.getInstance().isCommandQueueEmpty() == true) {
		// 		HeroMoveStop()
		// 	}
		// 	MapSystem.getInstance().setAutoRun(false)
		// 	FireEvent(EventDefine.HERO_AUTOFINDWAY, AutoFindWayEvent.newObj([AutoActionType.NULL, null, null, null]))
		// }
		//DelayEvecuteFunc(0, tick, this)

		if (this.timer) {
			KillTimer(this.timer)
			this.timer = null
		}
	}

	tick(delay) {
		this.fightDuring = this.fightDuring + delay

		if (this.fightDuring > 4500) {
			let curmapid = MapSystem.getInstance().getMapId()
			let timeup = (curmapid == 50001) || (this.fightDuring > 6000)

			if (StateManager.getInstance().GetCurrentStateType() != state_type.LIVE_BASE_STATE)
				timeup = false;

			if (timeup){
				let canFight = CampaignSystem.getInstance().bossCampaitnBattle()
				let autoSelect = CampaignSystem.getInstance().getAutoSelect()
				if (autoSelect && canFight) {
					let campaignId = CampaignSystem.getInstance().getCurOpenCampaign()
					RpcProxy.call("C2G_CampaginFight", campaignId, 0)
				} else {
					RpcProxy.call("C2G_CreateBossFight", OrdinaryActivityIndex.AutoFightMonster, 0)
					this.fightDuring = 0
				}
			}
		}


		let hero: Hero = GetHero()
		if (hero.isState(characterState.actionState_idle)) {
			this.genEndPoint()
			this.startToRun()
		}
	}

	onClickMap() {
		this.finish()
	}

	startToRun() {
		HeroMoveTo(this.endPoint.x, this.endPoint.y)
	}

	// onHeroStop(args) {
	// 	// let hero = GetHero()
	// 	// let heroPos = hero.getCellXY()
	// 	// if (MathUtil.checkScope(heroPos.x, heroPos.y, this.endPoint.x, this.endPoint.y, 3)) {
	// 	// 	this.genEndPoint()
	// 	// 	this.startToRun()
	// 	// } else {
	// 	// 	//this.finish()
	// 	// }

	// 	this.genEndPoint()
	// 	this.startToRun()

	// }

	////////////////////////////////////////////////////////////////////////
	//拜师跳转地图后自动寻找NPC
}

class CommandJumpMap extends CommandBase {
	targetMapId: number;
	targetX: number;
	targetY: number;
	opCodes: number;
	public initObj(...params: any[]): void {
		this.targetMapId = JsUtil.toNumber(params[0]);
		this.targetX = JsUtil.toNumber(params[1])
		this.targetY = JsUtil.toNumber(params[2])
		this.opCodes = params[3]
	}

	onStart() {
		if (MapSystem.getInstance().getMapId() != this.targetMapId) {
			let message = GetMessage(this.opCodes)
			message.mapId = this.targetMapId
			message.cellX = this.targetX
			message.cellY = this.targetY

			SendGameMessage(message)
			RegisterEvent(EventDefine.HERO_ENTER_MAP, this.onHeroEnterMap, this)
			return
		}

		this.finish()
	}

	onFinish() {
		UnRegisterEvent(EventDefine.HERO_ENTER_MAP, this.onHeroEnterMap, this)
	}

	onHeroEnterMap(args) {
		var hero = GetHero()
		var heroPoint = hero.getCellXY()

		if (MapSystem.getInstance().getMapId() == this.targetMapId && MathUtil.checkScope(heroPoint.x, heroPoint.y, this.targetX, this.targetY, 5)) {
			this.finish()
		}
	}


	////////////////////////////////////////////////////////////////////////
	//延时N毫秒
}

class CommandDelayTime extends CommandBase {
	delayTime: number;
	timerId: number;

	public initObj(...args: any[]): void {
		this.delayTime = args[0]
		this.timerId = null
	}

	onStart() {
		function callback(dt) {
			this.finish()
		}
		this.timerId = SetTimer(callback, this, this.delayTime)
	}

	onFinish() {
		if (this.timerId) {
			KillTimer(this.timerId)
			this.timerId = null
		}
	}

	////////////////////////////////-提供回调操作的command////////////////////-
}

class CommandCallBack extends CommandBase {
	callBack: Function;
	obj: any;
	param: any;
	public initObj(...args: any[]): void {
		this.callBack = args[0]
		this.obj = args[1]
		this.param = args[2]
	}

	onStart() {
		if (this.callBack) {
			this.callBack.call(this.obj, this.param)
		}

		this.finish()
	}

	onFinish() {

	}

}