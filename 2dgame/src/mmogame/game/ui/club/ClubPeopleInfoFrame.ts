// TypeScript file

class ClubPeopleInfoFrame extends BaseWnd {

	subWndList: any;
	tabIndex: string;
	myInfo: any;

	scroll: UIScrollList;
	list: any[];

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/club/ClubPeopleInfoLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_exit", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onExitClicked },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let group = <eui.Group>this.mElemList["scroll_wnd"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 5, 5, group.width - 10, group.height - 10, group)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		RegisterEvent(EventDefine.GET_CLUB_MENBER_LIST, this.refreshFrame, this)
		this.refreshFrame();
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		UnRegisterEvent(EventDefine.GET_CLUB_MENBER_LIST, this.refreshFrame, this)
	}

	refreshFrame() {
		let list = ClubSystem.getInstance().getClubMemberList()
		// console.log("clubPeopleInfo=========")
		// table_print(list)

		this.list = list
		this.scroll.clearItemList()
		let group = <eui.Group>this.mElemList["scroll_wnd"]

		let myInfo = null
		for (let i = 0; i < size_t(list); i++) {
			if (list[i].id == GetHeroProperty("id")) {
				myInfo = list[i]
			}
		}
		this.myInfo = myInfo

		for (let i = 0; i < size_t(list); i++) {
			let v = list[i]
			let [window, flag] = this.scroll.getItemWindow(i, group.width - 10, 130, 0, 0, 0)
			if (flag == true) {
				this.initItemWindow(window)
			}
			this.refreshItemWindow(window, v)
		}
		this.scroll.refreshScroll()

		if (myInfo == null) {
			return
		}

		let myJob = ClubSystem.getInstance().getPosName(myInfo.post)
		let colorText = ClubSystem.getInstance().getPosNameColor(myInfo.post)
		let postText = Localize_cns("CLUB_TXT48") + colorText + myJob
		let contributeNum = myInfo.contribute
		let contributeText = Localize_cns("CLUB_TXT49") + "#green" + contributeNum
		AddRdContent(this.mElemList["my_rd"], postText + "#space_10#ublack" + contributeText, "ht_22_cc", "ublack")
	}

	initItemWindow(window) {
		let name = window.name
		let w = window.width
		let h = window.height

		let Info: any = [
			//背景
			{ ["index_type"]: gui.Grid9Image, ["name"]: name + "bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h },

			//头像
			{ ["index_type"]: gui.Grid9Image, ["name"]: name + "_icon_bg", ["parent"]: name + "bg", ["image"]: "ty_renWuKuang01", ["x"]: 0, ["y"]: -10, ["w"]: 140, ["h"]: 140, ["messageFlag"]: true },
			{ ["index_type"]: gui.Grid9Image, ["name"]: name + "_icon", ["parent"]: name + "_icon_bg", ["image"]: "zctx_90001", ["x"]: 0, ["y"]: 0, ["w"]: 140, ["h"]: 140, ["messageFlag"]: true },

			//名字and帮贡and战力
			{ ["index_type"]: gui.RichDisplayer, ["name"]: name + "_name_rd", ["parent"]: name + "_bg", ["x"]: 145, ["y"]: 20, ["w"]: 300, ["h"]: 90, ["event_name"]: null, ["fun_index"]: null, },

			//在线状态
			{ ["index_type"]: eui.Label, ["name"]: name + "online", ["parent"]: name + "bg", ["title"]: Localize_cns("CLUB_TXT45"), ["font"]: "ht_24_cc", ["image"]: null, ["color"]: gui.Color.green, ["x"]: 355, ["y"]: 45, ["w"]: 100, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },

			//任命
			{ ["index_type"]: gui.Button, ["name"]: name + "_appoint_btn", ["parent"]: name + "_bg", ["title"]: Localize_cns("CLUB_TXT88"), ["font"]: "ht_22_cc_stroke", ["image"]: "ty_tongYongBt2", ["color"]: gui.Color.white, ["x"]: 450, ["y"]: 12, ["w"]: 94, ["h"]: 49, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onAppointClick },
			//踢出
			{ ["index_type"]: gui.Button, ["name"]: name + "_out_btn", ["parent"]: name + "_bg", ["title"]: Localize_cns("CLUB_TXT89"), ["font"]: "ht_22_cc_stroke", ["image"]: "ty_tongYongBt2", ["color"]: gui.Color.white, ["x"]: 450, ["y"]: 69, ["w"]: 94, ["h"]: 49, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onOutClick },
		]
		UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)

		this.mElemList[name + "_appoint_btn"].visible = false
		this.mElemList[name + "_out_btn"].visible = false
	}

	refreshItemWindow(window, data) {
		let name = window.name

		let colorText = ClubSystem.getInstance().getPosNameColor(data.post)
		let posName = ClubSystem.getInstance().getPosName(data.post)
		let roleName = data.name

		let rd_text = String.format(Localize_cns("CLUB_TXT62"), colorText, posName, roleName, data.contribute, data.force)

		AddRdContent(this.mElemList[name + "_name_rd"], rd_text, "ht_24_cc", "ublack", 8)

		this.mElemList[name + "_icon"].source = GetProfessionIcon(data.vocation, data.sexId)

		let isLive = false
		if (data.online == 1) {
			isLive = true
		}
		if (isLive) {
			this.mElemList[name + "online"].textColor = gui.Color.green
			this.mElemList[name + "online"].text = Localize_cns("CLUB_TXT46")
		} else {
			if (data.logout == 0) {
				this.mElemList[name + "online"].textColor = gui.Color.ublack
				this.mElemList[name + "online"].text = Localize_cns("CLUB_TXT65")
			} else {
				let timeRd = GetLastLogoutTimeStr(data.logout)
				this.mElemList[name + "online"].textColor = gui.Color.red
				this.mElemList[name + "online"].text = timeRd
			}
		}

		//屏蔽自己和权力大的玩家
		if (this.myInfo && this.myInfo.id != data.id && this.myInfo.post < data.post) {
			let post = this.myInfo.post
			this.mElemList[name + "_appoint_btn"].visible = (post == opFactionOfficeOptions.LEADER)
			this.mElemList[name + "_out_btn"].visible = !(post == opFactionOfficeOptions.MEMBER)
		}
	}

	onAppointClick(event: egret.TouchEvent) {
		let name = event.target.name
		let index = name.replace(/[^0-9]/ig, "")
		let data = this.list[index]
		if (data) {
			let wnd = WngMrg.getInstance().getWindow("ClubAppointFrame")
			wnd.onShowAndSetData(data)
		}
	}

	//踢出
	onOutClick(event: egret.TouchEvent) {
		let name = event.target.name
		let index = name.replace(/[^0-9]/ig, "")
		let data = this.list[index]
		if (data) {
			RpcProxy.call("C2G_FactionFire", data.id)
		}
	}

	onExitClicked() {
		let text = ""
		if (this.myInfo.post == 1 && size_t(this.list) != 1) {
			text = Localize_cns("CLUB_TXT64")
			MsgSystem.confirmDialog_YES(text)
		} else {
			text = Localize_cns("CLUB_TXT63")

			let t: IDialogCallback = {
				onDialogCallback(result: boolean, userData): void {
					if (result == true) {
						RpcProxy.call("C2G_FactionLeave")
						let wnd = WngMrg.getInstance().getWindow("ClubFrame")
						if (wnd.isVisible()) {
							wnd.hideWnd()
						}
						let wnd1 = WngMrg.getInstance().getWindow("ClubPeopleInfoFrame")
						if (wnd1.isVisible()) {
							wnd1.hideWnd()
						}
					}
				}
			}
			MsgSystem.confirmDialog(text, t, null)
		}
	}
}