class RoleEquipsWindow extends BaseCtrlWnd {
	mElemList;
	isEnough

	public initObj(...params: any[]) {

	}
	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;

		var elemInfo = [
			{ ["name"]: "shizhuang", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onFashionClick },
			{ ["name"]: "chenghao", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onFashionClick },
			{ ["name"]: "btn_fman", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onFmanClick },
			{ ["name"]: "btn_shenzhuang", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGodEquipClick },
			{ ["name"]: "btn_shenhun", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onShenHunClick },
			{ ["name"]: "fabao1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onFaBaoClick },
			{ ["name"]: "btn_Echange", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onEquipClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);


		this.mElemList["rd_lv"].setAlignFlag(gui.Flag.LEFT_CENTER);
		this.mElemList["rd_exp"].setAlignFlag(gui.Flag.RIGHT_CENTER);
		this.onInitEquip(this.mElemList["equip"]);
		this.isEnough = false;

		let image: eui.Image = this.mElemList["hero_icon"]
		image.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickIcon, this)

		this.mElemList["bt_E_levelUp"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpClick, this)

	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onUpdateForceAndExp, this)
		RegisterEvent(EventDefine.ACTOR_ROLE_UPDATE, this.onRefresh, this)
		RegisterEvent(EventDefine.ACTOR_ROLE_EQUIP_UPDATE, this.onRefreshEquip, this)
		this.mElemList["group_equips"].visible = true;
		this.mElemList["label_wndName"].text = Localize_cns("ROLE_TXT11");
		this.onRefreshEquip()
		this.onRefresh();
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onUpdateForceAndExp, this)
		UnRegisterEvent(EventDefine.ACTOR_ROLE_UPDATE, this.onRefresh, this)
		UnRegisterEvent(EventDefine.ACTOR_ROLE_EQUIP_UPDATE, this.onRefreshEquip, this)
		this.mElemList["group_equips"].visible = false;

	}

	onUpdateForceAndExp(args?) {
		let force = GetHeroProperty("force")
		DrawNumberStringImage(this.mElemList["bImage"], "zhanLi_", "z" + force, 0, 0, -3)


		let info = RoleSystem.getInstance().getRecvList()
		if (size_t(info) == 0) return

		let heroInfo = GetHeroPropertyInfo()
		if (heroInfo == null) return;
		let stage = heroInfo.level;
		if (stage > playerOptions.maxLevel) return

		let curExp = heroInfo.exp
		let maxExp = RoleSystem.getInstance().getLevelupExp()
		this.mElemList["bt_E_levelUp"].visible = true
		this.mElemList["bt_E_levelUp"].enabled = false
		let autoLevel = elemExpCaseOptions[cellOptionsIndex.Hero].AutoLevel
		if (stage >= autoLevel && stage < playerOptions.maxLevel) {
			this.isEnough = (curExp >= maxExp) ? true : false;
			this.mElemList["bt_E_levelUp"].enabled = this.isEnough
		}

		if(curExp >= 10 * maxExp){
			this.mElemList["text_exp"].visible = true
		}else{
			this.mElemList["text_exp"].visible = false
		}

		let curExpStr = RoleSystem.getInstance().getExpStr(curExp)
		let maxExpStr = RoleSystem.getInstance().getExpStr(maxExp)

		let strlv = Localize_cns("ROLE_TXT28") + "#greenyellow" + stage
		let strexp = String.format(Localize_cns("ROLE_EXP"), curExpStr, maxExpStr)
		if (stage >= playerOptions.maxLevel) {
			strlv = "#greenyellow#space_10" + Localize_cns("FORGE_MANJI")
			strexp = String.format(Localize_cns("ROLE_EXP"), "-", "-")
			this.mElemList["bt_E_levelUp"].visible = false
		}
		AddRdContent(this.mElemList["rd_lv"], strlv, "ht_20_cc_stroke", "ublack");
		AddRdContent(this.mElemList["rd_exp"], strexp, "ht_20_cc_stroke", "ublack");
		if (args) {
			let oldVal = args.oldProperty
			let newVal = args.newProperty
			if(oldVal.level != newVal.level){
				this.checkEquip()
			}
		}

	}

	onRefresh() {
		let level = RoleSystem.getInstance().getRoleInfo("stage")//GetHeroProperty("level")
		if (level == null || level <= 0) return
		let vip = GetHeroProperty("VIP_level")
		let VIPUnLockList = opTailsmanPosLimit.VIPUnLockList

		let levelUnLockList = opTailsmanPosLimit.levelUnLockList
		let isShowFaBao = false
		if (level >= levelUnLockList[0]) {
			isShowFaBao = true
		}
		if (isShowFaBao) {
			//vip >= VIPUnLockList[0]
			for (let k = 1; k <= 4; k++) {
				this.mElemList["fabao_" + k].visible = true
			}
			this.mElemList["fabao1"].visible = true
			this.refreshFaBaoItem()
		} else {
			for (let k = 1; k <= 4; k++) {
				this.mElemList["fabao_" + k].visible = false
			}
			this.mElemList["fabao1"].visible = false
		}

		if (level >= playerOptions.shenzhuang) {
			this.mElemList["btn_shenzhuang"].visible = true
		} else {
			this.mElemList["btn_shenzhuang"].visible = false
		}

		this.mElemList["btn_shenhun"].visible = level >= playerOptions.shenhun

		this.onUpdate()
	}
	onUpdate() {

		//人物图片
		let id = GetHeroProperty("vocation")
		let sex = GetHeroProperty("sexId")
		this.mElemList["hero_icon"].source = GetProfessionImage(id, sex)

		let btnList = [
			this.mElemList["shizhuang"], this.mElemList["chenghao"], this.mElemList["fabao1"],
			this.mElemList["btn_shenzhuang"], this.mElemList["btn_fman"], this.mElemList["btn_shenhun"]
		]
		let top: eui.Group = this.mElemList["group_Etop"]

		let childNum = top.numElements
		for (let k = 0; k < top.numElements; k++) {
			let child = top.getChildAt(k)
			top.removeChild(child)
		}

		for (let k = 0; k < size_t(btnList); k++) {
			let btn: gui.Button = btnList[k]
			if (btn.visible == true) {
				top.addChildAt(btn, k)
			}
		}

		this.onUpdateForceAndExp()
		this.checkEquip()
	}

	checkEquip() {
		//如果可以换装备-->显示换装按钮
		let equiplist = RoleSystem.getInstance().getRoleEquipList()
		if (size_t(equiplist) == 0) {
			this.mElemList["btn_Echange"].visible = false;
		} else {
			this.mElemList["btn_Echange"].visible = true
			let name = "equip"
			let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype
			for (let k = 1; k <= 10; k++) {
				let subtype = subtypeList[k - 1]
				let item = RoleSystem.getInstance().getRoleEquipItemBySubtype(subtype)
				this.mElemList[name + "_up" + k].visible = false
				if (item != null) {
					this.mElemList[name + "_up" + k].visible = true
				}
			}
		}
	}

	onInitEquip(window) {
		let name = "equip"
		for (let i = 1; i <= 10; i++) {
			if (this.mElemList[name + "_bg" + i] == null) {
				let x = 0;
				let y = 110 * (i - 1);
				let parent = "role_equip_left"
				if (i >= 6) {
					parent = "role_equip_right"
					y = 110 * (i - 6);
				}
				let icon = RoleSystem.getInstance().getZhuangBeiIcon(i - 1)
				let mElemInfo: any = [
					{ ["index_type"]: eui.Group, ["name"]: name + "_bg" + i, ["parent"]: parent, ["image"]: "", ["x"]: x, ["y"]: y, ["w"]: 100, ["h"]: 100, },
					{ ["index_type"]: eui.Image, ["name"]: name + "_initsprite" + i, ["parent"]: name + "_bg" + i, ["title"]: "", ["image"]: icon, ["x"]: 10, ["y"]: 0, ["w"]: 80, ["h"]: 80, },
					{ ["index_type"]: eui.Group, ["name"]: name + "_item" + i, ["parent"]: name + "_bg" + i, ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: 80, ["h"]: 80, },
					{ ["index_type"]: eui.Image, ["name"]: name + "_up" + i, ["parent"]: name + "_bg" + i, ["title"]: "", ["image"]: "hb_bt_jingSheng01", ["x"]: 55, ["y"]: -7, ["w"]: 42, ["h"]: 48, },
					{ ["index_type"]: eui.Label, ["name"]: name + "_lv" + i, ["parent"]: name + "_bg" + i, ["title"]: "", ["font"]: "ht_20_cc", ["image"]: null, ["color"]: gui.Color.ublack, ["x"]: 0, ["y"]: 80, ["w"]: 100, ["h"]: 20, },
				];
				UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window);
				this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox" + i, 10, 0, this.mElemList[name + "_item" + i]);
				this.mElemList[name + "_item" + i].visible = false
				this.mElemList[name + "_lv" + i].visible = false;
				this.mElemList[name + "_up" + i].visible = false
			}
		}
	}
	onRefreshEquip() {
		let arr = RoleSystem.getInstance().getRoleEquipItemList()
		let count = size_t(arr)
		let name = "equip"
		let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype

		for (let i = 1; i <= 10; i++) {
			let subtype = subtypeList[i - 1]
			let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
			this.mElemList[name + "_up" + i].visible = false
			if (roleItem == null) {
				this.mElemList[name + "_item" + i].visible = false
				this.mElemList[name + "_lv" + i].visible = false;
			} else {
				this.mElemList[name + "_item" + i].visible = true
				this.mElemList[name + "_lv" + i].visible = true
				this.mElemList[name + "itemBox" + i].updateByItem(roleItem);
				let level = roleItem.getRefProperty("uselevel")
				let str = String.format(Localize_cns("ROLE_TXT34"), level)
				this.mElemList[name + "_lv" + i].text = str;
			}
		}

	}

	////--------刷新元宝显示
	refreshFaBaoItem() {
		let fabaoInfo = RoleSystem.getInstance().getFaBaoInfo()
		if (fabaoInfo == null) return
		let levelList = fabaoInfo["talismanLevelList"]

		for (let k = 1; k <= 4; k++) {
			let item: Item = RoleSystem.getInstance().getFaBaoItem(k)
			this.mElemList["fabao_sprite_" + k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.faBaoItemClick, this)
			let source = ""
			let name = ""
			let qualityImage = ""
			if (item == null) {
				let level = GetHeroProperty("level")
				let vip = GetHeroProperty("VIP_level")
				let VIPUnLockList = opTailsmanPosLimit.VIPUnLockList

				let levelUnLockList = opTailsmanPosLimit.levelUnLockList
				let unLock = false

				source = "ty_faBaoDi_suo0" + k
				name = ""
				if (level >= levelUnLockList[k - 1] || vip >= VIPUnLockList[k - 1]) {
					source = "ty_faBaoDi_weizhuangbei"
					name = Localize_cns("FABAO_NAME")
				}
				this.mElemList["fabao_sprite_" + k].source = source
				this.mElemList["label_level_" + k].visible = false
				this.mElemList["level_bg_" + k].visible = false
				if (name != "") {
					this.mElemList["name_" + k].textColor = gui.Color.white
					this.mElemList["name_" + k].text = name
					this.mElemList["name_" + k].visible = true
					this.mElemList["name_bg_" + k].visible = true
				} else {
					this.mElemList["name_" + k].visible = false
					this.mElemList["name_bg_" + k].visible = false
				}
				continue
			}
			source = GetFaBaoIcon(item.entryId)
			name = item.getName()
			qualityImage = GetFaBaoQualutyImage(item.getProperty("quality") || 1)
			this.mElemList["image_di_" + k].source = qualityImage
			this.mElemList["fabao_sprite_" + k].source = source
			this.mElemList["label_level_" + k].visible = true
			this.mElemList["level_bg_" + k].visible = true
			this.mElemList["label_level_" + k].text = levelList[k + opTalismanEquipPos.begin - 1]
			let fontColor = GetQualityColorGui(item.getProperty("quality"))
			this.mElemList["name_" + k].textColor = fontColor
			this.mElemList["name_" + k].text = name
		}
	}

	onFashionClick(event: egret.TouchEvent) {
		let name = event.target.name;
		let checkList = CheckMainFrameFunction(name)
		if (!checkList[0]) {
			MsgSystem.addTagTips(checkList[1])
			return
		}
		let index = (name == "shizhuang") ? 0 : 1;
		let wnd = WngMrg.getInstance().getWindow("RoleFATFrame");
		wnd.showWithIndex(index);
		//this.mParentWnd.hideWnd()

	}
	onUpClick(event: egret.TouchEvent) {
		let level = RoleSystem.getInstance().getRoleInfo("stage")
		if (!level || level + 1 >= playerOptions.maxLevel) return
		let t: IDialogCallback = {
			onDialogCallback(result: boolean, userdata): void {
				if (result == true) {
					if (this.isEnough == false) return
					RpcProxy.call("C2G_ACTOR_ROLE_UPGRADE")
				}
			}
		}
		let tips = String.format(Localize_cns("ROLE_UPGRADE_TIPS"), level + 1)
		MsgSystem.confirmDialog(tips, t, null)
	}
	public onFmanClick(): void {
		let wnd = WngMrg.getInstance().getWindow("RoleFashionPeopleFrame");
		wnd.showWnd()
	}

	onEquipClick() {
		let stage = RoleSystem.getInstance().getRoleInfo("stage")
		let equiplist = RoleSystem.getInstance().getRoleEquipList(stage)
		if (size_t(equiplist) == 0) return
		let gidList = []
		for (let k in equiplist) {
			let item = <Item>equiplist[k]
			JsUtil.arrayInstert(gidList, item.id)
		}
		RpcProxy.call("C2G_ACTOR_ROLE_INFO_EQUIP_SET", gidList)
	}

	onFaBaoClick(event: egret.Event) {
		let wnd: RoleFaBaoFrame = WngMrg.getInstance().getWindow("RoleFaBaoFrame");
		wnd.showWithIndex(0);
		//this.mParentWnd.hideWnd()
	}

	/*onTaoZhuangClick() {
		let wnd: RoleSuitFrame = WngMrg.getInstance().getWindow("RoleSuitFrame")
		wnd.showWnd()
		//this.mParentWnd.hideWnd()
	}*/

	faBaoItemClick(event: egret.Event) {
		let name = event.target.name
		let index = name.replace(/[^0-9]/ig, "")
		let wnd: RoleFaBaoFrame = WngMrg.getInstance().getWindow("RoleFaBaoFrame");
		wnd.showWithIndex(0, tonumber(index));

	}

	onClickIcon() {
		let wnd: RolePropertyFrame = WngMrg.getInstance().getWindow("RolePropertyFrame")
		wnd.showWnd()
	}

	onGodEquipClick() {
		ExecuteMainFrameFunction("shenzhuang")
	}

	onShenHunClick(){
		let wnd : ShenHunFrame = WngMrg.getInstance().getWindow("ShenHunFrame")
		wnd.showWnd()
	}
}

