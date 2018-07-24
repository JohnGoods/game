/*
作者:
    liuziming
	
创建时间：
   2014.7.22(周二)

意图：
   处理退出战斗的流程控制

公共接口：
   
*/
class FightFinishHandler extends TClass {
	mOnAir: boolean;
	passCampaign: number;
	fightSystem: FightSystem;
	endFightCallBack: Function;

	externalHandlerList: any[];
	hangUp: number;

	nowTime: number;
	win: boolean;
	timeId: number;
	cacheTime: number;

	lastBgm: string;
	
	MAX_WAIT_TIME: number;
	accountSettle: any;

	public initObj(...args: any[]): void {
		this.mOnAir = false
		//记录战斗完后通过的关卡ID
		this.passCampaign = null

		this.fightSystem = args[0]
		this.endFightCallBack = args[1]

		this.externalHandlerList = []
		this.accountSettle = []
		//this.saveExternalHandler = {}

		RegisterEvent(EventDefine.COMBAT_FIGHT_WIN, this.onStartWinHandle, this)
		RegisterEvent(EventDefine.COMBAT_FIGHT_LOST, this.onStartLostHandle, this)
	}

	onClear() {
		this.mOnAir = false
		this.externalHandlerList = []
		//elf.win = null
		this.hangUp = 0
		this.accountSettle = []

		if (this.timeId) {
			KillTimer(this.timeId)
			this.timeId = null
		}
	}

	startProcess() {
		if (this.mOnAir) {
			return
		}
		this.mOnAir = true
		//this.externalHandlerList = {}
		this.win = null
		this.hangUp = 0

		//可扩展部分
		this.MAX_WAIT_TIME = 400
		if (FightSystem.getInstance().isForceEnding() == true) {
			this.MAX_WAIT_TIME = 0
		}
		// if (this.fightSystem.isClientFighting() == true) {
		// 	this.MAX_WAIT_TIME = 500
		// }
		// } else if (this.fightSystem.getCurFightType() != opFightType.FIGHT_TYPE_COMMON) {
		// 	this.MAX_WAIT_TIME = 1500
		// }

		if (!this.timeId) {
			this.timeId = SetTimer(this.tick, this, 0, false)
			this.nowTime = 0
			this.cacheTime = 0
		}

		FireEvent(EventDefine.COMBAT_SHOW_END, null)
	}

	tick(delay) {
		this.nowTime = this.nowTime + delay
		this.cacheTime = this.cacheTime + delay
		if (this.hangUp > 0) {									//表示还有掉落物
			if (this.cacheTime < 7000) {
				this.nowTime = this.nowTime - delay
			}
		}

		if (this.nowTime > this.MAX_WAIT_TIME) {
			let [fightType, _] = FightSystem.getInstance().getCurFightType()
			if (fightType == opFightResultType.CAPTURE) {							//捕捉要等客户端表演完毕再结算
				if (this.nowTime < this.MAX_WAIT_TIME + 1000 && this.accountSettle[0] == null) {
					let message = GetMessage(opCodes.C2G_FIGHT_DRAWDONE)
					SendGameMessage(message)

					return
				}
			}

			if (this.timeId) {
				KillTimer(this.timeId)
				this.timeId = null
			}

			//通知服务器已经完成战斗表演
			if (this.fightSystem.fightVideo == true || this.fightSystem.isClientFighting() == true) {
				//if(this.fightSystem.fightVideo == true ){
				//	let wnd = WngMrg.getInstance().getWindow("FightRecordFrame")
				//	wnd.showWnd()
				//}

				this.callBack()
			} else {
				let winParam = this.accountSettle[0]				//只处理第一个结算数据
				if (winParam) {
					let win = winParam.result
					let param = winParam.prize
					this.fightEndResult(win, param)
				}
				// let message = GetMessage(opCodes.C2G_FIGHT_DRAWDONE)
				// SendGameMessage(message)
			}
		} else if (this.nowTime > 1000) {
			this.fightSystem.recycleAward = true
		}
	}

	getDelayHandle(waitTime, handle, obj, param) {
		var time = 0
		var timeId = null
		
		function tickDelay(delay){
			time = time + delay
			if(time > waitTime){
				if(timeId){
					KillTimer(timeId)
					timeId = null
				}
				
				handle(obj, param)
			}
		}
		
		timeId = SetTimer(tickDelay, this, 500)
		return tickDelay
	}

	addFightAccountSettle(win, param) {
		if (this.fightSystem.isFight() == false) {
			this.fireFightResult(win, param)
			return
		} else {
			let [fightType, _] = FightSystem.getInstance().getCurFightType()
			if(fightType != param.fightType) {
				this.fireFightResult(win, param)
				return
			}
		}
		table_insert(this.accountSettle, {result: win, prize: param})
	}
	// delayShow(args) {
	// 	let win = args[0]
	// 	let param = args[1]
	// 	this.fightSystem.forceEndFight(param)

	// 	if (win) {
	// 		FireEvent(EventDefine.COMBAT_FIGHT_WIN, CombatEndEvent.newObj(table_copy(param), this.callBack, this))
	// 	} else {
	// 		FireEvent(EventDefine.COMBAT_FIGHT_LOST, CombatEndEvent.newObj(table_copy(param), this.callBack, this))
	// 	}
	// }
	////////////////////////////////////////////////////////////////-
	//外部接口
	fightEndResult(win, param, passCampaign?) {
		if (this.fightSystem.isFight() == false) {
			return
		}

		TLog.Debug("FightFinishHandler.fightEndResult", win)
		if (!this.mOnAir) {
			this.mOnAir = true
			//this.externalHandlerList = {}
			this.hangUp = 0
			//TLog.Debug("222222222222222222", this.fightSystem.getCurFightTime())
			//return this.getDelayHandle(this.fightSystem.suspendDelay, this.delayShow, this, {win, param})
			this.fightSystem.forceEndFight()
		}

		this.passCampaign = passCampaign || null
		//如果是自动战斗模式（且战胜了），则直接返回
		if (this.isFinishAtOnce(win, param)) {
			this.win = win
			return this.callBack()
		}

		this.fireFightResult(win, param)
	}

	fireFightResult(win, param) {
		FightSystem.getInstance().refreshNearPlayer()
		if (win) {
			this.win = true
			//战胜特效
			//MsgSystem.showScreenEffect(effectIndex.FightWin)
			FireEvent(EventDefine.COMBAT_FIGHT_WIN, CombatEndEvent.newObj(table_copy(param), this.callBack, this))
		} else {
			this.win = false
			FireEvent(EventDefine.COMBAT_FIGHT_LOST, CombatEndEvent.newObj(table_copy(param), this.callBack, this))
		}
	}

	//自动结束战斗状态
	isFinishAtOnce(win, param) {
		let [fightType, _] = FightSystem.getInstance().getCurFightType()
	//
		let flag = false
		//圣地，非PK类型，都直接结束
		// if(GetActivity(ActivityDefine.Robber).isStart() ){
		// 	flag = GetActivity(ActivityDefine.Robber).isShowFightPrize(fightType, table_copy(param), win)
		// }
		
		
		return flag
	}

	clearUpFightState() {
		if (this.fightSystem.isFight() == false) {
			return
		}

		this.mOnAir = true
		this.fightSystem.forceEndFight()
		return this.callBack()
	}

	addEndFightHandler(callBack, obj, param) {
		let t = []
		JsUtil.arrayInstert(t, callBack)
		JsUtil.arrayInstert(t, obj)
		JsUtil.arrayInstert(t, param)
		JsUtil.arrayInstert(this.externalHandlerList, t)

		//this.externalHandler = callBack
		//this.externalObj		 = obj
		//this.externalParam	 = param
	}

	isOnAir() {
		return this.mOnAir
	}

	// sweepAwayFight(param, campaignId) {
	// 	if (this.fightSystem.isFight() == true) {
	// 		return this.fightEndResult(true, param, campaignId)
	// 	}

	// 	this.mOnAir = true
	// 	//this.externalHandlerList = {}
	// 	this.passCampaign =  null
	// 	this.win = true
	// 	FireEvent(EventDefine.COMBAT_FIGHT_WIN, CombatEndEvent.newObj(table_copy(param), this.sweepAwayFightCallBack, this))
	// }

	setHangUp(b) {
		if (!this.mOnAir) {
			return
		}

		if (b == true) {
			this.hangUp = this.hangUp + 1
		} else {
			this.hangUp = this.hangUp - 1
		}
	}
	////////////////////////////////////////////////////////////
	//
	callBack() {
		if (!this.mOnAir || !this.endFightCallBack) {
			return
		}

		this.mOnAir = false
		if (this.timeId) {
			KillTimer(this.timeId)
			this.timeId = null
		}

		//以防由于卡帧而误触
		SetGlobalInputStatus(false, "FightFrame")

		let externalHandlerList = this.externalHandlerList
		let fightType = this.endFightCallBack.call(this.fightSystem)
		FireEvent(EventDefine.COMBAT_END, CombatEvent.newObj(fightType, this.win))

		for (let _ in externalHandlerList) {
			let v = externalHandlerList[_]

			let callBack = v[0]
			let obj = v[1]
			let param = v[2]

			callBack.call(obj, param)
		}
		this.externalHandlerList = []

		if (this.passCampaign) {//第一次通过才会触发
			FireEvent(EventDefine.CAMPAIGN_FINISH, CampaignEvent.newObj(this.passCampaign))
		} else {

		}

		//以防由于卡帧而误触
		SetGlobalInputStatus(true, "FightFrame")
	}

	// sweepAwayFightCallBack() {
	// 	if (this.mOnAir == false) {
	// 		return
	// 	}

	// 	this.mOnAir = false
	// 	if (this.timeId) {
	// 		KillTimer(this.timeId)
	// 		this.timeId = null
	// 	}
	// 	if (this.lastBgm) {
	// 		GameSound.getInstance().playMusic(this.lastBgm)
	// 		this.lastBgm = null
	// 	}

	// 	FireEvent(EventDefine.COMBAT_END, CombatEvent.newObj(opFightType.FIGHT_TYPE_COMMON, this.win))
	// 	for (let _ in this.externalHandlerList) {
	// 		let v = this.externalHandlerList[_]

	// 		let callBack = v[0]
	// 		let obj = v[1]
	// 		let param = v[2]

	// 		callBack(obj, param)
	// 	}
	// 	this.externalHandlerList = []
	// 	this.win = null

	// 	if (this.passCampaign) {
	// 		return FireEvent(EventDefine.CAMPAIGN_FINISH, CampaignEvent.newObj(this.passCampaign))
	// 	}
	// }

	onStartWinHandle(args?) {
		this._onStartFinishHandle()

		if (args.param.fightType) {
			if (FightFinishWndDefend["win"][args.param.fightType]) {
				let wndName = FightFinishWndDefend["win"][args.param.fightType]
				let wnd = WngMrg.getInstance().getWindow(wndName)
				wnd.onCombatEnd(args)

				//设置结算状态，界面关闭时会自动重置
				if (wnd.isVisible() == true) {
					FightSystem.getInstance().setFightResultState(FightSystem.FIGHT_RESULT_STATE_WIN)
				}
			}
		}
		
		this.callBack()
	}

	onStartLostHandle(args?) {
		this._onStartFinishHandle()

		if (args.param.fightType) {
			if (FightFinishWndDefend["lost"][args.param.fightType]) {
				let wndName = FightFinishWndDefend["lost"][args.param.fightType]
				let wnd = WngMrg.getInstance().getWindow(wndName)
				wnd.onCombatEnd(args)

				//设置结算状态，界面关闭时会自动重置
				if (wnd.isVisible() == true) {
					FightSystem.getInstance().setFightResultState(FightSystem.FIGHT_RESULT_STATE_LOST)
				}
			}
			
			this.callBack()
		}
	}

	_onStartFinishHandle(args?) {
		this.lastBgm = GameSound.getInstance().getCurMusicName() || null

		if (GAME_DEBUG == true && GAME_FRCORD == true) {
			if (IsFightState() == true) {
				WngMrg.getInstance().showWindow("FightRecordFrame")
			}
		}
		//GameSound.getInstance().stopMusic()

		//清除战斗里的引导遮罩
		//GuideSystem.getInstance().clearWindowAction()
	}
}