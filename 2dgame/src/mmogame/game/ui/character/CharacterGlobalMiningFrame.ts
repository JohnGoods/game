class CharacterGlobalMiningFrame extends BaseWnd {
	owner: any
	modeType: number
	modeParam: any
	infoParam: any
	timerList: any

	static MODE_INFO_BTN: number =  0x1				//矿藏按钮
	static MODE_TEAM_MEMBER: number =  0x2			//队伍成员

	public initObj(...params: any[]) {
		this.owner = null
		this.modeType = 0
		this.modeParam = {}
		this.infoParam = {}
		this.timerList = {}
		this.mLayoutPaths = ["resource/layouts/character/CharacterGlobalMiningLayout.exml"]
	}

	public onLoad(): void {
		var width = 250, height = 120 ;
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();

		// this.mLayoutNode.touchChildren = false;
		// this.mLayoutNode.touchEnabled = false;
		this.mLayoutNode.horizontalCenter = 0
		this.mLayoutNode.verticalCenter = 50;

		let info: any = [
			{ ["name"]: "group0", ["messageFlag"]: true },
			{ ["name"]: "group1", ["messageFlag"]: true },
			{ ["name"]: "group2", ["messageFlag"]: true },
			{ ["name"]: "info_btn", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickInfo },
			{ ["name"]: "info_btn", ["event_name"]: egret.TouchEvent.TOUCH_BEGIN, ["fun_index"]: this.onClickInfoBegin },
			{["name"]: "collect_pro", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: "kfzb_xueTiaoDi01", ["thumbImage"]: "kfzb_xueTiao01", ["color"]: gui.Color.white, },
		]
		UiUtil.initElem(info, this.mLayoutNode, this.mElemList, this)
		if (TEST_UI_RECT) {
			// UiUtil.forTestDrawBg(this.mLayoutNode);
		}
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		this.refreshFrame()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		
        for (let _ in this.timerList) {
            KillTimer(this.timerList[_])
        }
        this.timerList = {}

		this.mElemList["group0"].visible = false
		this.mElemList["group1"].visible = false
		this.mElemList["group2"].visible = false
		this.mElemList["info_group"].visible = false
		this.mElemList["bottomTips_group"].visible = false
		this.mElemList["collect_group"].visible = false
	}

	refreshFrame() {
		this.updateLayeroutRect()

		// this.mElemList["group0"].visible = false
		// this.mElemList["group1"].visible = false
		// this.mElemList["group2"].visible = false
		// this.mElemList["info_group"].visible = false
		// if ((this.modeType & CharacterGlobalMiningFrame.MODE_INFO_BTN) == CharacterGlobalMiningFrame.MODE_INFO_BTN) {
		// 	this.mElemList["info_group"].visible = true
		// 	this.refreshInfoBtn()
		// }

		// if ((this.modeType & CharacterGlobalMiningFrame.MODE_TEAM_MEMBER) == CharacterGlobalMiningFrame.MODE_TEAM_MEMBER) {
		// 	this.mElemList["group0"].visible = true
		// 	this.mElemList["group1"].visible = true
		// 	this.mElemList["group2"].visible = true
		// 	this.refreshInfoTeamMember()
		// }
	}

	refreshInfoBtn() {
		
	}

	refreshInfoTeamMember() {
		
	}

	updateLayeroutRect() {
		if (this.owner != null) {
			var boundRect = this.owner.getContentSize();
        	if (boundRect.width != 0 && boundRect.height != 0) {
				this.mLayoutNode.width = boundRect.width
				this.mLayoutNode.height = boundRect.height + 35
			}
		}
	}

	////////////////////////////////////////////////////////////////////////
	onClickInfo(args) {
		args.$isPropagationImmediateStopped = true


		if (this.infoParam == null) {
			return
		}
		let title = this.infoParam.title || ""
		let content = this.infoParam.content || ""
		let wnd = WngMrg.getInstance().getWindow("GlobalMiningInfoFrame")
		wnd.showMiningInfo(title, content)
	}

	onClickInfoBegin(args) {
		args.$isPropagationImmediateStopped = true
	}
	////////////////////////////////////////////////////////////////////////
	setOwner(owner) {
		this.owner = owner
	}

	showGlobalMiningFrame(modeType?, modeParam?) {
		this.modeType = modeType
		this.modeParam = modeParam

		if (this.isVisible() == false) {
			this.showWnd()
		} else {
			this.refreshFrame()
		}
	}

	//点击信息按钮
	_updateInfoBtn(visible) {
		this.mElemList["info_group"].visible = visible
	}

	updateInfoBtn(visible, infoParam?) {
		this.infoParam = infoParam						//{title:, content:,}
		this.doCommand("_updateInfoBtn", visible)
	}

	//跨服争霸队伍信息
	_updateTeamInfo(param) {
		let miningInfo = param
		let act = GetActivity(ActivityDefine.GlobalMining)

		let members = table_copy(miningInfo.members)
		table_sort(members, function(a, b) {return b.captain - a.captain})

		for (let i = 0; i < 3; i++) {
			let v = members[i]

			if (i > 0) {
				if (miningInfo.status == opGlobalMineActTeamStatus.guard) {				//占领中只显示队长
						v = null
					}
			}
			if (v) {
				this.mElemList["group" + i].visible = true

				this.mElemList["memberBg" + i].source = act.getActCampIcon(miningInfo.campInfoIndex)
				this.mElemList["member" + i].source = act.getProfessionActIcon(v.vocation, v.sex)

				let colorFont = {
					[opGlobalMineCampInfoIndex.ren]: gui.Color.red,
					[opGlobalMineCampInfoIndex.xian]: gui.Color.deepskyblue,
					[opGlobalMineCampInfoIndex.yao]: gui.Color.fuchsia,
				}
				this.mElemList["memberName" + i].textColor = colorFont[miningInfo.campInfoIndex]
				
				this.mElemList["memberName" + i].text = v.name
			} else {
				this.mElemList["group" + i].visible = false
			}
		}

		this.mElemList["captureIcon"].visible = false
		if (miningInfo.status == opGlobalMineActTeamStatus.guard){				//占领中
				this.mElemList["captureIcon"].visible = true
			}
	}

	updateTeamInfo(visible, param?) {
		if (visible == true) {
			this.doCommand("_updateTeamInfo", param)
		} else {
			if (this.mElemList["group0"]) {
				this.mElemList["group0"].visible = false
				this.mElemList["group1"].visible = false
				this.mElemList["group2"].visible = false
			}
		}
	}

	//跨服争霸文字信息
	_updateMineInfo(param?) {
		this.mElemList["bottomTips_group"].visible = (this.mElemList["collect_group"].visible != true)
		let txt = param || ""
		
		this.mElemList["bottomTips"].text = txt
	}

	updateMineInfo(visible, param?) {
		if (visible == true) {
			this.doCommand("_updateMineInfo", param)
		} else {
			if (this.mElemList["bottomTips_group"]) {
				this.mElemList["bottomTips_group"].visible = false
			}
		}
	}

	//跨服争霸采集计时
	_updateCollectTick(param?) {
		this.mElemList["collect_group"].visible = true

		let tipsVisible = this.mElemList["bottomTips_group"].visible
		this.mElemList["bottomTips_group"].visible = false
		let endTime = param || GetServerTime()
		
		if (this.timerList["collect"]) {
			KillTimer(this.timerList["collect"])
			delete this.timerList["collect"]
		}

		let tick = function(delay) {
			let leftTime = endTime - GetServerTime()

			if (leftTime >= 0) {
				let func = function(num, maxNum) {
					return num + "s"
				}
				UiUtil.updateProgress(this.mElemList["collect_pro"], leftTime, 30, func)
			} else {
				// if (this.timerList["collect"]) {
				// 	KillTimer(this.timerList["collect"])
				// 	delete this.timerList["collect"]
				// }

				this.mElemList["collect_group"].visible = false
				GetActivity(ActivityDefine.GlobalMining).getMinePrize()

				// this.mElemList["bottomTips_group"].visible = tipsVisible
			}
		}
		this.timerList["collect"] = SetTimer(tick, this, 200, true)
	}

	updateCollectTick(visible, param?) {
		if (visible == true) {
			this.doCommand("_updateCollectTick", param)
		} else {
			if (this.mElemList["collect_group"]) {
				this.mElemList["collect_group"].visible = false
				if (this.timerList["collect"]) {
					KillTimer(this.timerList["collect"])
					delete this.timerList["collect"]
				}
			}
		}
	}
}