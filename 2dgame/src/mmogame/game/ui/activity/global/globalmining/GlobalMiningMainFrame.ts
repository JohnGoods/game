// TypeScript file

class GlobalMiningMainFrame extends BaseWnd {
    timerList: any

	public initObj(...params: any[]) {
        this.timerList = {}
		this.mLayoutPaths = ["resource/layouts/activity/global/globalmining/GlobalMiningMainLayout.exml"]

	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreenRaw(true)
		this.initSkinElemList();

		this.mLayoutNode.setLayer(gui.GuiLayer.Bottom)
		this.mLayoutNode.touchEnabled = false;

		var elemInfo = [
			{ ["name"]: "team_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickTeam },

			{ ["name"]: "teamInfo_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickTeamInfo },
			{ ["name"]: "rule_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRule },

			{ ["name"]: "follow_check", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickFollowCheck },

			{ ["name"]: "btn_close", ["event_name"]: egret.TouchEvent.TOUCH_BEGIN, ["fun_index"]: this.onClickClose },
			{ ["name"]: "backCamp_btn", ["event_name"]: egret.TouchEvent.TOUCH_BEGIN, ["fun_index"]: this.onClickBackToBase },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		// this.taskWnd = ClubMapTaskWindow.newObj(this.mLayoutNode, this)

		// this.mElemList["map_name"].setAlignFlag(gui.Flag.H_CENTER)
		// this.mElemList["map_xy"].setAlignFlag(gui.Flag.H_CENTER)
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		this.mLayoutNode.moveToBack()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		
        for (let _ in this.timerList) {
            let timer = this.timerList[_]
            KillTimer(timer)
        }
        this.timerList = {}
	}

	refreshFrame() {
        for (let _ in this.timerList) {
            let timer = this.timerList[_]
            KillTimer(timer)
        }
        this.timerList = {}

		let act = GetActivity(ActivityDefine.GlobalMining)
		let info = act.getActivityInfo()

		if (info == null) {
			return
		}

		this.mElemList["follow_check"].selected = act.isFollowCamera()

		//排名数据
		let t = []
		table_insert(t, [opGlobalMineCampInfoIndex.ren, checkNull(info.renPoint, 0)])	//人营分数
		table_insert(t, [opGlobalMineCampInfoIndex.xian, checkNull(info.xianPoint, 0)])	//仙营分数
		table_insert(t, [opGlobalMineCampInfoIndex.yao, checkNull(info.yaoPoint, 0)])	//妖营分数
		table_sort(t, function(a, b) {return b[1] - a[1]})

		let colorFont = {
			[opGlobalMineCampInfoIndex.ren]: gui.Color.red,
			[opGlobalMineCampInfoIndex.xian]: gui.Color.deepskyblue,
			[opGlobalMineCampInfoIndex.yao]: gui.Color.fuchsia,
		}
		let titleFont = {
			[opGlobalMineCampInfoIndex.ren]: Localize_cns("GLOBAL_MINING_TXT6"),
			[opGlobalMineCampInfoIndex.xian]: Localize_cns("GLOBAL_MINING_TXT7"),
			[opGlobalMineCampInfoIndex.yao]: Localize_cns("GLOBAL_MINING_TXT8"),
		}
		for (let i = 0; i < 3; i++) {
			let v = t[i]
			if (v) {
				this.mElemList["rank_group" + i].visible = true

				let color = checkNull(colorFont[v[0]], gui.Color.white)
				this.mElemList["rank_name" + i].textColor = color
				this.mElemList["rank_name" + i].text = checkNull(titleFont[v[0]], "")
				this.mElemList["rank_point" + i].text = MakeLongNumberShort(v[1])
			} else {
				this.mElemList["rank_group" + i].visible = false
			}
		}
		this.updateMyPoint()

		if (info.actStage == opGlobalMineStatus.prepare) {
			let tick = function(delay) {
				let leftTime = info.endTime - GetServerTime()
				if (leftTime < 0) {
					leftTime = 0

					if (this.timerList["prepare"]) {
						KillTimer(this.timerList["prepare"])
						delete this.timerList["prepare"] 
					}
				}
				this.mElemList["tips_tl0"].text = Localize_cns("GLOBAL_MINING_TXT32")
				this.mElemList["tips_tl1"].text = getFormatDiffTimeSimple(leftTime)
			}
			if (!this.timerList["prepare"]) {
				this.timerList["prepare"] = SetTimer(tick, this, 200, true)
			}
		} else if (info.actStage == opGlobalMineStatus.active) {
			let tick = function(delay) {
				let leftTime = info.endTime - GetServerTime()
				if (leftTime < 0) {
					leftTime = 0

					if (this.timerList["open"]) {
						KillTimer(this.timerList["open"])
						delete this.timerList["open"] 
					}
				}
				this.mElemList["tips_tl0"].text = Localize_cns("GLOBAL_MINING_TXT9")
				this.mElemList["tips_tl1"].text = getFormatDiffTimeSimple(leftTime)
			}
			if (!this.timerList["open"]) {
				this.timerList["open"] = SetTimer(tick, this, 200, true)
			}
		} else {
			this.mElemList["tips_tl0"].text = Localize_cns("GLOBAL_MINING_TXT33")
			this.mElemList["tips_tl1"].text = ""
		}

		//
		this.updateTeamBtn()
	}

	updateWnd() {
		this.refreshFrame()
	}

	updateMyPoint() {
		this.mElemList["tips_tl3"].text = Localize_cns("GLOBAL_MINING_TXT11") + " " + MakeLongNumberShort(GetActivity(ActivityDefine.GlobalMining).getMyPoint())
	}

	updateTeamBtn() {
		this.mElemList["follow_check"].selected = GetActivity(ActivityDefine.GlobalMining).isFollowCamera()
		this.mElemList["teamInfo_btn"].visible = GetActivity(ActivityDefine.GlobalMining).isInMiningTeam()

		let robot = GetActivity(ActivityDefine.GlobalMining).getHeroMiningRobot()
		if (robot == null) {
			this.mElemList["team_btn"].visible = false
			return
		}

		let info = robot.getMiningInfo()
		if (info.status == opGlobalMineActTeamStatus.nothing && robot.isState(characterState.actionState_idle)) {
			this.mElemList["team_btn"].visible = !GetActivity(ActivityDefine.GlobalMining).isInMiningTeam()
		} else {
			this.mElemList["team_btn"].visible = false
		}
	}

	updateFollowBtn() {
		this.mElemList["follow_check"].selected = GetActivity(ActivityDefine.GlobalMining).isFollowCamera()
	}
	//////////////////////////////////////////////////////
	onClickClose(args) {
		let a = GetActivity(ActivityDefine.GlobalMining)
		a.requestStop()
	}

	onClickFollowCheck(args) {
		GetActivity(ActivityDefine.GlobalMining).setFollowCamera(args.target.selected)
	}

	onClickTeam(args) {
		WngMrg.getInstance().showWindow("GlobalMiningJoinFrame")
	}

	onClickTeamInfo(args) {
		if (GetActivity(ActivityDefine.GlobalMining).isInMiningTeam() == false) {
			return MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT39"))
		}

		// WngMrg.getInstance().showWindow("GlobalMiningTeamFrame")
		RpcProxy.call("C2G_MineActTeamDetailInfo")
	}

	onClickRule(args) {
		let wnd  = WngMrg.getInstance().getWindow("RuleDescribeFrame")
        wnd.showWithActivity("GlobalMine")
	}

	onClickBackToBase(args) {
		if (GetActivity(ActivityDefine.GlobalMining).isMiningLeader() == false) {
			return MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT34"))
		}

		let act = GetActivity(ActivityDefine.GlobalMining)
		let heroRobot = act.getHeroMiningRobot()
		if (heroRobot) {
			let info = heroRobot.getMiningInfo()
			if (info.status == opGlobalMineActTeamStatus.nothing && heroRobot.isState(characterState.actionState_idle)) {
				return MsgSystem.addTagTips(Localize_cns("GLOBAL_MINING_TXT52"))
			}
		}
		RpcProxy.call("C2G_MineReturnCamp")
	}
}