class LoginCreateRoleFrame extends BaseWnd {
	lastCreateTime: number;
	vocation: number;
	sex: number;

	vocationList:number[];
	//imagePath:any;

	vocGroup:eui.RadioButtonGroup;

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/login/LoginCreateRoleLayout.exml"];

		this.vocation = 10001
		this.sex = genderOptions.MALE

		//10001	人族
		//10002	仙族
		//10003	妖族
		this.vocationList = [10001, 10002, 10003]

		// this.imagePath = {
		// 	[10001]:{//人族
		// 		[genderOptions.MALE] : "dl_renTu01",
		// 		[genderOptions.FEMALE] : "dl_renTu02",
		// 	},
		// 	[10002]:{//仙族
		// 		[genderOptions.MALE] : "dl_xianTu01",
		// 		[genderOptions.FEMALE] : "dl_xianTu02",
		// 	},
		// 	[10003]:{//妖族
		// 		[genderOptions.MALE] : "dl_moTu01",
		// 		[genderOptions.FEMALE] : "dl_moTu02",
		// 	},
		// }
	}

	public onLoad(): void {
		//this.createLayerNode();
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		//this.setDoModal(true);
		this.initSkinElemList()
		this.setFullScreenRaw(true)

		var elemInfo = [
			{ ["name"]: "btn_ensure", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onEnsureTap },
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_random", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRandomNameTap },

			{ ["name"]: "btn_next", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onVocNext },
			{ ["name"]: "btn_pre", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onVocPre },

			{ ["name"]: "edit_name", ["title"]: null, ["event_name"]: null, ["fun_index"]: null },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		this.mLayoutNode.horizontalCenter = 0;
		this.mLayoutNode.verticalCenter = 0;

		
		
		this.vocGroup = new eui.RadioButtonGroup()
		//for (let i in GameConfig.ActorRoleConfig) {
		for(let id of this.vocationList){
			//let id = GameConfig.ActorRoleConfig[i].Id
			let tab = <eui.RadioButton>this.mElemList["tab_voc_" + id]
			tab.group = this.vocGroup
			tab.value = id

			tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectVoctation, this)
		}

		let sexGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup()
		for (let i in genderOptions) {
			let sex = genderOptions[i]
			let tab = <eui.RadioButton>this.mElemList["tab_sex_" + sex]
			tab.group = sexGroup
			tab.value = sex

			tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectsex, this)
		}


		this.mElemList["tab_voc_" + this.vocation].selected = true
		this.mElemList["tab_sex_" + this.sex].selected = true

		//this.mElemList["label_tips"].text = String.format(Localize_cns("LOGIN_INPUT_NAME_TIPS2"), NAME_LENGTH_LIMIT)

	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.onRandomNameTap()
		this.refreshFrame()
		this.lastCreateTime = -1;
		this.mLayoutNode.visible = true;

	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
	}

	onSelectVoctation(event: egret.TouchEvent) {
		this.vocation = event.target.value
		this.refreshFrame()
	}

	onSelectsex(event: egret.TouchEvent) {
		this.sex = event.target.value
		this.refreshFrame()
	}


	public refreshFrame(): void {
		
		this.mElemList["image_actor"].source = GetProfessionImage(this.vocation, this.sex)
		let tab = <eui.RadioButton>this.mElemList["tab_voc_" + this.vocation]
		this.vocGroup.selection = tab
	}

	onEnsureTap(event: egret.TouchEvent): void {
		var name: string = this.mElemList["edit_name"].text;
		if (StringUtil.isEmpty(name)) {
			MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_NAME_CFM1"))
			return
		}

		//不可使用标点符号，不可使用纯数字，不可使用敏感字
		//if(string.match(name, "[%p]+") != null ||
		if (StringUtil.isNumber(name)) {
			MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_NAME_CFM2"))
			return
		}

		if (WordFilter.checkword(name) == false) {//TODO:敏感字检测
			MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_NAME_CFM4"))
			return
		}


		if (name.length > NAME_LENGTH_LIMIT) {
			MsgSystem.confirmDialog_YES(String.format(Localize_cns("LOGIN_NAME_CFM3"), NAME_LENGTH_LIMIT))
			return
		}

		if (this.lastCreateTime > 0) {
			let currentTime = core.getCpuTime()
			if (currentTime - this.lastCreateTime < 2000) {
				return
			}
		}
		this.lastCreateTime = core.getCpuTime()


		//10001	人族
		//10002	仙族
		//10003	妖族
		//genderOptions = 
		//{
		//	MALE   = 1, -- 男
		//	FEMALE = 2, -- 女
		//}
		let groupIndex = LoginSystem.getInstance().getSelectServerGroupIndex()

		var message = GetMessage(LoginOpcodes.C2L_ROLE_CREATE)
		message.name = name
		message.vocation = this.vocation
		message.sex = this.sex
		message.groupIndex = groupIndex + 1
		
		SendLoginMessage(message)
	}

	onRandomNameTap(): void {

		let randomName = RandomRobotName();
		this.mElemList["edit_name"].text = randomName
	}


	onVocNext(): void {
		let index = this.vocationList.indexOf(this.vocation)
		index++
		if(index > 2)
			index = 0
		this.vocation = this.vocationList[index];
		this.refreshFrame()

		

	}
	
	onVocPre(): void {
		let index = this.vocationList.indexOf(this.vocation)
		index--
		if(index < 0){
			index = 2
		}
		this.vocation = this.vocationList[index];
		this.refreshFrame()
	}
}