class LoginRegisterFrame extends BaseWnd {


	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/login/LoginRegisterLayout.exml"];
	}

	public onLoad(): void {
		//this.createLayerNode();
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.mLayoutNode.setDoModal(true);
		this.initSkinElemList();

		this.mElemList["btn_close"] = this.mLayoutNode.getComponent("btn_close");
		this.mElemList["btn_close_top"] = this.mLayoutNode.getComponent("btn_close_top");
		this.mElemList["btn_register"] = this.mLayoutNode.getComponent("btn_register");

		this.mElemList["btn_close"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReturn, this);
		this.mElemList["btn_close_top"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReturn, this);
		this.mElemList["btn_register"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRegisterBtnClick, this);


		this.mLayoutNode.horizontalCenter = 0;
		this.mLayoutNode.verticalCenter = 0;

	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		RegisterEvent(EventDefine.LOGIN_ACCOUNT_AUTH_SUCC,this.hideWnd,this)

	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		UnRegisterEvent(EventDefine.LOGIN_ACCOUNT_AUTH_SUCC,this.hideWnd,this)
	}

	onRegisterBtnClick(event: egret.TouchEvent) {
		var btn: eui.Button = <eui.Button>event.target;

		var info = LoginSystem.getInstance().getInputUser()
		var acc_string: string = info.username;
		var pwd_string: string = info.password;

		if (StringUtil.isEmpty(acc_string) ||
			StringUtil.isEmpty(pwd_string)) {
			MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_USER_CFM"));
			return;
		}

		//todo:yangguiming
		if (!GAME_DEBUG) {
			//账号或密码只能包含6-20位的字母或数字
			if (!StringUtil.isAlphaNumber(acc_string) ||
				acc_string.length < 6 || acc_string.length > 20) {
				MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_USER_FORMAT_CFM"))
				return
			}

			if (!StringUtil.isAlphaNumber(pwd_string) ||
				pwd_string.length < 6 || pwd_string.length > 20) {
				MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_PSW_FORMAT_CFM"))
				return
			}
		}

		var newAccInfo = { ["ACC"]: acc_string, ["PWD"]: pwd_string, };
		var loginSystem: LoginSystem = LoginSystem.getInstance();
		loginSystem.startOfficiailRegister(newAccInfo);

	}


	onReturn(){
		let loginFrame:LoginFrame = WngMrg.getInstance().getWindow("LoginFrame")
		loginFrame.doCommand("command_switchState", LoginFrame.STATE_AUTH);
		this.hideWnd();
	}


}