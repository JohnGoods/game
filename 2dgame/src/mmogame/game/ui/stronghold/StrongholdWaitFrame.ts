// TypeScript file

class StrongholdWaitFrame extends BaseWnd {
	timer: number

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/stronghold/StrongholdWaitLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0]
		this.initSkinElemList()
		this.setAlignCenter(true, true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_clear", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickClear },
		]
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		this.mElemList["rd_needGold"].setAlignFlag(gui.Flag.CENTER_CENTER)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = true
		this.refreshFrame()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.refreshFrame, this)
		this.mLayoutNode.visible = false
		KillTimer(this.timer)
	}

	refreshFrame() {
		let info = getSaveRecord(opSaveRecordKey.strongholdDieWait) || []
		if (info[1]) {
			let leftTime = info[1] - GetServerTime()
			if (leftTime <= 0) {
				return this.hideWnd()
			}

			KillTimer(this.timer)
			this.timer = SetTimer(this.timerCallback, this, 1000, true)
		}
	}

	timerCallback() {
		let info = getSaveRecord(opSaveRecordKey.strongholdDieWait) || []
		if (info[1]) {
			let leftTime = info[1] - GetServerTime()
			if (leftTime <= 0) {
				KillTimer(this.timer)
				this.hideWnd()
				ExecuteMainFrameFunction("judian")
				return
			}

			let mins = Math.floor(leftTime / 60)
			let secs = leftTime - mins * 60
			//this.mElemList["lab_time"].text = String.format("%02d:%02d", mins, secs)
			DrawNumberStringImage(this.mElemList["img_time"], "zd_baoJi", String.format("%02d", mins) + "m" + String.format("%02d", secs), 0, 0, 0)
			AddRdContent(this.mElemList["rd_needGold"], "#YUANBAO" + leftTime * StrongholdConfig.clearWaitCost, "ht_22_cc", "ublack")
		} else {
			KillTimer(this.timer)
			this.hideWnd()
		}
	}

	onClickClear(args: egret.Event) {
		let info = getSaveRecord(opSaveRecordKey.strongholdDieWait) || []
		if (info[1]) {
			let leftTime = info[1] - GetServerTime()
			if (leftTime > 0) {
				let cost = leftTime * StrongholdConfig.clearWaitCost
				if (GetHeroProperty("bindGold") < cost && GetHeroProperty("gold") < cost) {
					MsgSystem.addTagTips(Localize_cns("DIAMAND_NOENGOUGH"))
					//ExecuteMainFrameFunction("chongzhi")
					return
				}
				RpcProxy.call("C2G_StrongholdClearDieWait")
				this.hideWnd()
				//ExecuteMainFrameFunction("judian")
			}
		}
	}
}