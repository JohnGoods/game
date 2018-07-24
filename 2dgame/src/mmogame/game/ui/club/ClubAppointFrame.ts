// TypeScript file

class ClubAppointFrame extends BaseWnd {

	curIndex: number;
	roleInfo: any;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/club/ClubAppointLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true, true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "appoint_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAppointClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
		radioGroup.addEventListener(egret.TouchEvent.CHANGE, this.changeCurIndex, this)
		for (let i = 0; i < 3; i++) {
			let radioBtn = <eui.RadioButton>this.mElemList["radio" + i]
			radioBtn.group = radioGroup;
			radioBtn.value = i;
			radioBtn.selected = false

			let elem = <eui.Label>this.mElemList["text" + i]
			elem.textColor = gui.Color.ublack
		}
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		this.mLayoutNode.setDoModal(true);
		this.refreshFrame();
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		this.mLayoutNode.setDoModal(false);
	}

	refreshFrame() {
		let PosConfig: any = {
			[opFactionOfficeOptions.LEADER]: 0,
			[opFactionOfficeOptions.SUB_LEADER]: 1,
			[opFactionOfficeOptions.MEMBER]: 2,
		}
		let radioBtn = <eui.RadioButton>this.mElemList["radio" + PosConfig[this.roleInfo.post]]
		radioBtn.selected = true

		this.curIndex = PosConfig[this.roleInfo.post]

		let postName = ClubSystem.getInstance().getPosName(this.curIndex)
		let text = String.format(Localize_cns("CLUB_TXT66"), this.roleInfo.name, postName)
		this.mElemList["title"].text = text
	}

	onAppointClick() {
		let PosConfig: any[] = [
			opFactionOfficeOptions.LEADER,
			opFactionOfficeOptions.SUB_LEADER,
			opFactionOfficeOptions.MEMBER,
		]

		if (this.roleInfo) {
			if (this.roleInfo.post == PosConfig[this.curIndex]) {
				return
			}
			// let postName = ClubSystem.getInstance().getPosName(this.curIndex)
			// let text = String.format(Localize_cns("CLUB_TXT66"), this.roleInfo.name, postName)
			// let _this = this
			// let t: IDialogCallback = {
			// 	onDialogCallback(result: boolean, userData): void {
			// 		if (result == true) {
						RpcProxy.call("C2G_FactionPost", this.roleInfo.id, PosConfig[this.curIndex])
						if (this.isVisible()) {
							this.hideWnd()
						}
			// 		}
			// 	}
			// }
			// MsgSystem.confirmDialog(text, t, null)
		}
	}

	changeCurIndex(event: egret.TouchEvent) {
		let tabGroup = <eui.RadioButtonGroup>event.target
		this.curIndex = tabGroup.selectedValue
	}

	onShowAndSetData(info) {
		this.roleInfo = info
		this.showWnd()
	}
}