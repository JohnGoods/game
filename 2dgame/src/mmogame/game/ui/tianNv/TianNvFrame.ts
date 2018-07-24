class TianNvFrame extends BaseWnd {
	tabWndList: UITabWndList
	tabIndex: number
	tastTimer: number


	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/TianNvLayout.exml"]
		this.tabIndex = -1


	}
	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();


		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_tips", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTipsClick },
			{ ["name"]: "anim_wnd", ["messageFlag"]: true }
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let tabInfoList = [
			{ name: "tiannv", wnd: TianNvTianNvWindow.newObj(this.mLayoutNode, this), check: this.onTab0Click, obj: this },
			{ name: "xianqi", wnd: TianNvXianQiWindow.newObj(this.mLayoutNode, this), check: this.onTab1Click, obj: this },
			{ name: "huanian", wnd: TianNvHuaNianWindow.newObj(this.mLayoutNode, this), check: this.onTab2Click, obj: this },
			{ name: "lingqi", wnd: TianNvLingQiWindow.newObj(this.mLayoutNode, this), check: this.onTab3Click, obj: this },
		]
		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, tabInfoList)

		this.tabWndList.setSelectedCallback(this.refreshDotTips, this)

		this.mElemList["tiannv_actorView"] = UIActorView.newObj(this.mLayoutNode, "tiannv_actorView", 0, 0, this.mElemList["tiannv_actor"])

		this.mElemList["tast_txt"].visible = false
		this.mElemList["tast_txt"].textColor = gui.Color.lime
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.refreshDotTips, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateMartiral, this)
		this.mLayoutNode.visible = true;
		this.tabWndList.setWndVisible(true);

		if (this.tabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}

		this.mElemList["tast_txt"].visible = false

		let endTime1 = getSaveRecord(opSaveRecordKey.firstRechareTiannv) || 0
		if (endTime1 > GetServerTime()) {
			if (this.tastTimer) {
				return
			}

			let callback = function () {
				let diffTime = endTime1 - GetServerTime()
				if (diffTime >= 0) {
					this.mElemList["tast_txt"].text = Localize_cns("TIANNV_TXT1") + getFormatDiffTimeSimple(diffTime)
					this.mElemList["tast_txt"].visible = true
				} else {
					RpcProxy.call("C2G_RemoveLimitTianNv")

					let endTime2 = getSaveRecord(opSaveRecordKey.firstRechareTiannv) || 0
					if (endTime2 == 0) {
						if (this.tastTimer) {
							KillTimer(this.tastTimer)
							this.tastTimer = null
						}
						this.mElemList["tast_txt"].text = ""
						this.mElemList["tast_txt"].visible = false
					}
				}
			}
			this.tastTimer = SetTimer(callback, this, 1000, true)
		}
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.refreshDotTips, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.updateMartiral, this)
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);

		let actorView: UIActorView = this.mElemList["fun_model"]
		if (actorView) {
			actorView.clearView()
		}
		FunUITools.clearActorData(this)

		this.mElemList["tiannv_actorView"].clearView()

		if (this.tastTimer) {
			KillTimer(this.tastTimer)
			this.tastTimer = null
		}
	}

	updateMartiral() {
		let wnd = this.tabWndList.getCurrentWnd()
		if (wnd) {
			FunUITools.updateNeedMaterial(wnd.type, wnd)
		}

	}

	////接口
	showWithIndex(index) {
		this.tabIndex = index
		this.showWnd()
	}


	///////////////// ///响应事件
	onTab0Click() {
		return true
	}
	onTab1Click() {
		return true
	}
	onTab2Click() {
		return true
	}
	onTab3Click() {
		return true
	}

	////////////////////红点提示/////////////////////
	//自定义红点继承实现
	refreshDotTipsImp() {
		FunUITools.refreshDanDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshEquipDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshTianNvSkillDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshUpgradeDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshSkinDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
		FunUITools.refreshFunPrizeDotTips(this.tabWndList.getCurrentWnd().type, this.tabWndList.getCurrentWnd())
	}

	getDotTipsArgsImp(checkParam) {
		let args: any = {}
		args.index = this.tabWndList.getTabIndex()
		args.type = this.tabWndList.getCurrentWnd().type
		return args
	}

	onTipsClick() {
		let wnd = this.tabWndList.getCurrentWnd()
		if (wnd) {
			wnd.onTipsClick()
		}
	}
}