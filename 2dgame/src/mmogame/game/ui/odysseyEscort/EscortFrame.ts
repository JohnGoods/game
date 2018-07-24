// TypeScript file
class EscortFrame extends BaseWnd {
	isIn
	timer
	windowList: EscortActionBox[]
	select
	refreshTime

	oldList
	endIndex

	//static NEED_MONEYCOUNT = 300

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/xiyouhusong/EscortLayout.exml"]
		this.isIn = false
		this.select = -1
		this.oldList = []
		this.windowList = []
	}
	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_escort", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onEscortClick },
			{ ["name"]: "btn_intercept", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onInterceptClick },

			{ ["name"]: "image_kuang", ["messageFlag"]: true },
			{ ["name"]: "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLeftClick },
			{ ["name"]: "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRightClick },
			{ ["name"]: "btn_tips", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRuleClick },

		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		this.mElemList["group_time"].visible = false;
		this.mElemList["rd_quickFinish"].setAlignFlag(gui.Flag.LEFT_BOTTOM)

		this.mElemList["rd_quickFinish"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuickClick, this)


	}
	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		//this.mLayoutNode.setDoModal(true);
		this.onRefresh()

		RpcProxy.call("C2G_EnterEscortActivity")

	}

	updateWnd() {
		this.onRefresh()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		//this.mLayoutNode.setDoModal(false);

		if (this.timer != null) {
			KillTimer(this.timer)
			this.timer = null
		}


		for (let k in this.windowList) {
			if (this.windowList[k] != null) {
				this.windowList[k].setVisibleFalse()
			}
		}
	}

	onRefresh() {

		let actInfo = GetActivity(ActivityDefine.HuSong).getActInfo()
		let list = GetActivity(ActivityDefine.HuSong).getHuSongList()

		if (size_t(actInfo) == 0) return
		
		//if(size_t(list) == 0) return
		if (this.select == -1) {
			this.select = 0
		}

		let isDouble = actInfo.isDouble || 1
		if (isDouble == 2) {
			this.mElemList["image_double"].visible = true
		} else {
			this.mElemList["image_double"].visible = false
		}

		//rd_intercept  rd_escort
		let hadHusong = actInfo.husongTwice || 0
		let hadLanjie = actInfo.lanjieTwice || 0

		AddRdContent(this.mElemList["rd_escort"], Localize_cns("ESCORT_TXT1") + hadHusong + "/" + 3, "ht_20_cc_stroke")

		AddRdContent(this.mElemList["rd_intercept"], Localize_cns("ESCORT_TXT2") + hadLanjie + "/" + 5, "ht_20_cc_stroke")


		if (actInfo.time != 0 && actInfo.time - GetServerTime() < 0) {
			RpcProxy.call("C2G_GetEscortPrizeInfo")
			//RpcProxy.call("C2G_EnterEscortActivity")
			return
		}

		if (actInfo.time != 0) {
			this.refreshTime = actInfo.time
			this.isIn = true
		} else if (actInfo.time == 0) {
			this.isIn = false
			this.refreshTime = null
		}

		if (this.isIn) {
			this.mElemList["group_btn"].visible = false
			this.mElemList["group_time"].visible = true
			//rd_quickFinish
			let str = Localize_cns("ESCORT_TXT3")
			AddRdContent(this.mElemList["rd_quickFinish"], str, "ht_20_cc", "lime")

			//if(this.refreshTime - GetServerTime() == 0) return			
			if (this.timer == null) {
				this.timer = SetTimer(this.onRefreshTimer, this, 1000, true)
			}
			this.onRefreshTimer()
		} else {
			this.mElemList["group_btn"].visible = true
			this.mElemList["group_time"].visible = false

		}

		this.mElemList["btn_left"].visible = false
		this.mElemList["btn_right"].visible = false

		if (size_t(list) == 0 /*|| size_t(list) == size_t(this.oldList)*/) {
			if (this.windowList[this.select] != null) {
				this.windowList[this.select].onShowAction(list)
			}
			return
		}


		let showListArray = splitListByCount(list, 6)
		this.endIndex = size_t(showListArray) 


		for (let k in showListArray) {
			if (this.windowList[k] == null) {
				let group : eui.Group = this.mElemList["group_action"]
				this.windowList[k] = <EscortActionBox>EscortActionBox.newObj(this.mLayoutNode, "escortWidnow" + k, 0, 0, group.width, group. height, group)
			}
			this.windowList[k].onShowAction(showListArray[k])
			this.windowList[k].setVisible(false)
		}


		if (this.windowList[this.select] != null) {
			this.windowList[this.select].setVisible(true)
		}

		if (this.endIndex > 1) {
			if (this.select == this.endIndex - 1) {
				this.mElemList["btn_left"].visible = true
			} else if (this.select == 0) {
				this.mElemList["btn_right"].visible = true
			} else {
				this.mElemList["btn_left"].visible = true
				this.mElemList["btn_right"].visible = true
			}

		}

		this.oldList = list
	}

	//////////响应
	public onInterceptClick(): void {
		let wnd = WngMrg.getInstance().getWindow("InterceptRecordFrame")
		wnd.showWnd()
	}

	public onEscortClick(): void {
		let actInfo = GetActivity(ActivityDefine.HuSong).getActInfo()
		if (actInfo.husongTwice == 0) {
			MsgSystem.addTagTips(Localize_cns("ESCORT_TIPS_TXT7"))
			return
		}

		let wnd = WngMrg.getInstance().getWindow("OdysseyEscortFrame")
		this.hideWnd()
		wnd.showWnd()
	}

	onRightClick() {
		if (this.select >= this.endIndex) return
		this.select += 1
		this.onRefresh()
	}

	onLeftClick() {
		if (this.select <= 0) return
		this.select -= 1
		this.onRefresh()
	}

	onQuickClick() {
		let _this = this
		let t: IDialogCallback = {
			onDialogCallback(result: boolean, userdata): void {
				if (result == true) {
					let unit = opItemUnit.BIND_CURRENCY
					let had = GetHeroMoney(unit)
					if (had <= opEscort.quickOverNum)
						unit = opItemUnit.CURRENCY
					if (GetHeroMoney(unit) < opEscort.quickOverNum) {
						let formatStr = Localize_cns(ItemUnitName[unit])
						MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"), formatStr))
						return
					}
					RpcProxy.call("C2G_QuickOverEscort")
					if (_this.timer != null) {
						KillTimer(_this.timer)
						_this.timer = null
						_this.refreshTime = null
					}

					for (let k in this.windowList) {
						let v: EscortActionBox = this.windowList[k]
						v.setVisibleFalse()
					}
					RpcProxy.call("C2G_GetEscortPrizeInfo")
				}
			}
		}
		MsgSystem.confirmDialog(Localize_cns("ESCORT_TIPS_TXT6") + "#br" + Localize_cns("ESCORT_TIPS_TXT2"), t, null)
	}

	//-----------刷新Timer
	onRefreshTimer() {
		let time = this.refreshTime
		if (time == null) return
		let nowtime = GetServerTime()
		let diffTime = time - nowtime
		if (diffTime <= 0) {
			if (this.timer != null) {
				KillTimer(this.timer)
				this.timer = null
			}
			for (let k in this.windowList) {
				let v: EscortActionBox = this.windowList[k]
				v.setVisibleFalse()
			}
			RpcProxy.call("C2G_GetEscortPrizeInfo")
			//RpcProxy.call("C2G_EnterEscortActivity")
		}
		let timeStr = getFormatDiffTimeSimple(diffTime)
		AddRdContent(this.mElemList["rd_time"], Localize_cns("ESCORT_TXT4") + timeStr, "ht_20_cc")
	}

	onRuleClick() {
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
		wnd.showWithActivity("yabiaoRule")
	}


	/////////////----------响应更新
	onShowPrize() {
		let wnd = WngMrg.getInstance().getWindow("EscortPrizeFrame")
		wnd.showWnd()
	}
}