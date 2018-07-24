// TypeScript file

class ClubPeopleApplyFrame extends BaseWnd {
	subWndList: any;
	tabIndex: string;
	scroll: UIScrollList;
	list: any[];

	emptyView: UIEmptyView;


	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/club/ClubPeopleApplyLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },

			{ ["name"]: "btn_change", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickForceLimit },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let checkBox = <eui.CheckBox>this.mElemList["select_check"]
		checkBox.addEventListener(egret.TouchEvent.CHANGE, this.onClickCheckBox, this)

		let group = <eui.Group>this.mElemList["apply_wnd"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 5, group.width, group.height - 10, group)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.GET_CLUB_INFO, this.refreshFrame, this)
		RegisterEvent(EventDefine.GET_CLUB_APPLY_LIST, this.refreshFrame, this)
		this.mLayoutNode.visible = true;
		//帮会申请列表
		RpcProxy.call("C2G_FactionApplyRefresh")

		this.refreshFrame();
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.GET_CLUB_INFO, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.GET_CLUB_APPLY_LIST, this.refreshFrame, this)
		this.mLayoutNode.visible = false
	}

	refreshFrame() {
		let list = ClubSystem.getInstance().getApplyList()
		//更新申请列表
		this.list = list
		this.scroll.clearItemList()
		let group = <eui.Group>this.mElemList["apply_wnd"]
		for (let i = 0; i < size_t(list); i++) {
			let v = list[i]
			let [window, flag] = this.scroll.getItemWindow(i, group.width, 130)
			if (flag == true) {
				this.initItemWindow(window)
			}
			this.refreshItemWindow(window, v)
		}
		this.scroll.refreshScroll()

		//设置自动加入
		let clubInfo = ClubSystem.getInstance().getCurClubInfo()
		let facSet = bit.band(clubInfo.facSet, opFactionSet.autoAddMember)
		let needForce = clubInfo.force || defaultValue.CLUB_JOIN_FORCE_MIN
		let checkBox = <eui.CheckBox>this.mElemList["select_check"]
		if (!facSet) {
			checkBox.selected = false
		} else {
			checkBox.selected = true
		}
		this.mElemList["edit_input"].text = needForce
	}

	initItemWindow(window) {
		let name = window.name
		let w = window.width
		let h = window.height

		let Info: any = [
			//背景
			{ ["index_type"]: gui.Grid9Image, ["name"]: name + "bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["event_name"]: null, ["fun_index"]: null, },

			//头像
			{ ["index_type"]: gui.Grid9Image, ["name"]: name + "_icon_bg", ["parent"]: name + "bg", ["image"]: "ty_renWuKuang01", ["x"]: 0, ["y"]: h - 128, ["w"]: 140, ["h"]: 140, ["messageFlag"]: true },
			{ ["index_type"]: gui.Grid9Image, ["name"]: name + "_icon", ["parent"]: name + "_icon_bg", ["image"]: "zctx_90001", ["x"]: 4, ["y"]: 0, ["w"]: 140, ["h"]: 140, ["messageFlag"]: true },

			//名字and战力
			{ ["index_type"]: gui.RichDisplayer, ["name"]: name + "_name_rd", ["parent"]: name + "_group", ["x"]: 135, ["y"]: 35, ["w"]: 250, ["h"]: 60, ["event_name"]: null, ["fun_index"]: null, },

			{ ["index_type"]: gui.Button, ["name"]: name + "okBtn", ["title"]: Localize_cns("CLUB_TXT43"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 310, ["y"]: 40, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onConsentClick, },
			{ ["index_type"]: gui.Button, ["name"]: name + "not_ok_btn", ["title"]: Localize_cns("CLUB_TXT44"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 430, ["y"]: 40, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRejectClick, },
		]
		UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
	}

	refreshItemWindow(window, data) {
		let name = window.name

		this.mElemList[name + "_icon"].source = GetProfessionIcon(data.vocation, data.sexId)

		let str = "#saddlebrown" + data.name + "#space_10Lv." + data.level + "#br#ublack" + String.format(Localize_cns("CLUB_TXT61"), (data.force || 0))
		AddRdContent(this.mElemList[name + "_name_rd"], str, "ht_24_cc", "ublack", 5)
	}

	onClickCheckBox(event: egret.TouchEvent) {
		let select = event.target.selected
		if (select) {
			let input = <eui.EditableText>this.mElemList["edit_input"]
			let force = defaultValue.CLUB_JOIN_FORCE_MIN
			if (tonumber(input.text) >= defaultValue.CLUB_JOIN_FORCE_MIN) {
				force = tonumber(input.text)
				if (tonumber(input.text) > defaultValue.CLUB_JOIN_FORCE_MAX) {
					force = defaultValue.CLUB_JOIN_FORCE_MAX
					let str = String.format(Localize_cns("CLUB_TXT121"), defaultValue.CLUB_JOIN_FORCE_MAX)
					MsgSystem.addTagTips(str)
				}
			} else {
				let str = String.format(Localize_cns("CLUB_TXT120"), defaultValue.CLUB_JOIN_FORCE_MIN)
				MsgSystem.addTagTips(str)
			}
			input.text = force
			RpcProxy.call("C2G_FactionEnterForce", force)
		} else {
			RpcProxy.call("C2G_FactionEnterForce", 0)
		}
	}

	onConsentClick(args) {
		let name = args.target.name
		let index = name.replace(/[^0-9]/ig, "")
		let data = this.list[index]
		let roleId = data.id
		RpcProxy.call("C2G_FactionCheck", roleId, 1)
	}

	onRejectClick(args) {
		let name = args.target.name
		let index = name.replace(/[^0-9]/ig, "")
		let data = this.list[index]
		let roleId = data.id
		RpcProxy.call("C2G_FactionCheck", roleId, 0)
	}

	//刷新战力
	onClickForceLimit() {
		let input = <eui.EditableText>this.mElemList["edit_input"]
		if (tonumber(input.text) >= defaultValue.CLUB_JOIN_FORCE_MIN) {
			if (tonumber(input.text) > defaultValue.CLUB_JOIN_FORCE_MAX) {
				input.text = defaultValue.CLUB_JOIN_FORCE_MAX
				let str = String.format(Localize_cns("CLUB_TXT121"), defaultValue.CLUB_JOIN_FORCE_MAX)
				MsgSystem.addTagTips(str)
				if (this.mElemList["select_check"].selected) {
					RpcProxy.call("C2G_FactionEnterForce", defaultValue.CLUB_JOIN_FORCE_MAX)
				}
				return
			}

			this.mElemList["select_check"].selected = true
			RpcProxy.call("C2G_FactionEnterForce", tonumber(input.text))
		} else {
			input.text = defaultValue.CLUB_JOIN_FORCE_MIN
			let str = String.format(Localize_cns("CLUB_TXT120"), defaultValue.CLUB_JOIN_FORCE_MIN)
			MsgSystem.addTagTips(str)
			if (this.mElemList["select_check"].selected) {
				RpcProxy.call("C2G_FactionEnterForce", defaultValue.CLUB_JOIN_FORCE_MIN)
			}
		}
	}
}