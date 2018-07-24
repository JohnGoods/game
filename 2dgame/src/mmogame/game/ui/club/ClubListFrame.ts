// TypeScript file

class ClubListFrame extends BaseWnd {
	isHaveClub: any;
	tabIndex: string;
	scroll: UIScrollList;
	list: any[];

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/club/ClubListLayout.exml"]

		this.list = []
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_creat", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.creatClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let group = <eui.Group>this.mElemList["scroll_wnd"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 10, 5, group.width - 20, group.height - 10, group)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.ALL_CLUB_LIST, this.refreshFrame, this)
		RegisterEvent(EventDefine.GET_CLUB_MYAPPLY_LIST, this.refreshFrame, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.checkListFrame, this)
		this.mLayoutNode.visible = true;
		//帮会列表申请
		RpcProxy.call("C2G_FactionInfoList")

		this.refreshFrame();
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ALL_CLUB_LIST, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.GET_CLUB_MYAPPLY_LIST, this.refreshFrame, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.checkListFrame, this)
		this.mLayoutNode.visible = false;
	}

	refreshFrame() {
		let heroInfo = GetHeroPropertyInfo()
		this.isHaveClub = true
		if (heroInfo == null || heroInfo["faction"] == 0) {
			this.isHaveClub = false
		}

		this.mElemList["btn_creat"].visible = !this.isHaveClub

		let list = ClubSystem.getInstance().getClubInfoList()
		this.list = list

		this.scroll.clearItemList()

		let group = <eui.Group>this.mElemList["scroll_wnd"]
		for (let i = 0; i < size_t(list); i++) {
			let v = list[i]
			let [window, flag] = this.scroll.getItemWindow(i, group.width - 20, 110, 0, 0, 0)
			if (flag == true) {
				this.initItemWindow(window)
			}
			this.refreshItemWindow(window, v, i)
		}
		this.scroll.refreshScroll()
	}

	initItemWindow(window) {
		let name = window.name

		let width = window.width
		let height = window.height

		let Info: any = [
			//背景
			{ ["index_type"]: gui.Grid9Image, ["name"]: name + "bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["event_name"]: null, ["fun_index"]: null, },
			{ ["index_type"]: gui.Grid9Image, ["name"]: name + "num_bg", ["title"]: null, ["font"]: null, ["image"]: "bh_textDi01", ["color"]: null, ["x"]: 15, ["y"]: 30, ["w"]: 45, ["h"]: 46, ["event_name"]: null, ["fun_index"]: null, },

			{ ["index_type"]: eui.Label, ["name"]: name + "num", ["parent"]: name + "num_bg", ["title"]: "1", ["font"]: "ht_26_cc", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 45, ["h"]: 46, ["messageFlag"]: true },
			{ ["index_type"]: eui.Label, ["name"]: name + "nameAndLevel", ["parent"]: name + "bg", ["title"]: "", ["font"]: "ht_26_lc", ["color"]: gui.Color.saddlebrown, ["x"]: 80, ["y"]: 20, ["w"]: 300, ["h"]: 25, ["messageFlag"]: true },
			{ ["index_type"]: eui.Label, ["name"]: name + "bossName", ["parent"]: name + "bg", ["title"]: "", ["font"]: "ht_22_lc", ["color"]: gui.Color.ublack, ["x"]: 80, ["y"]: 60, ["w"]: 300, ["h"]: 25, ["messageFlag"]: true },
			{ ["index_type"]: gui.RichDisplayer, ["name"]: name + "curCount", ["parent"]: name + "bg", ["title"]: "", ["font"]: "ht_22_lc", ["color"]: gui.Color.ublack, ["x"]: 270, ["y"]: 60, ["w"]: 150, ["h"]: 25, ["messageFlag"]: true },

			{ ["index_type"]: gui.RichDisplayer, ["name"]: name + "enterForce", ["title"]: "", ["font"]: "ht_22_rc", ["color"]: gui.Color.saddlebrown, ["x"]: 240, ["y"]: 12, ["w"]: 285, ["h"]: 30, ["messageFlag"]: true },

			{ ["index_type"]: gui.Button, ["name"]: name + "btn", ["title"]: Localize_cns("CLUB_TXT55"), ["font"]: "ht_22_cc_stroke", ["image"]: "ty_tongYongBt2", ["color"]: gui.Color.white, ["x"]: 425, ["y"]: 42, ["w"]: 94, ["h"]: 49, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onApplyClick, },
		]
		UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)

		this.mElemList[name + "enterForce"].setAlignFlag(gui.Flag.RIGHT)
	}

	refreshItemWindow(window, data, index) {
		let name = window.name

		let myApplyList = ClubSystem.getInstance().getLegionApplyList()
		//到时候在这里获取是否拥有俱乐部而现实按钮
		if (data == null || data.level == null) {
			return
		}
		let id = data.id
		let level = data.level
		let leaderName = data.leader
		let clubName = data.name
		let memberNum = data.menberCount
		let maxmenberCount = data.maxmenberCount
		let logo = data.logo

		let colorList = [gui.Color.orange, gui.Color.fuchsia, gui.Color.deepskyblue]
		this.mElemList[name + "num"].text = index + 1
		this.mElemList[name + "num"].textColor = colorList[index] || gui.Color.white

		let nameAndLevelText = String.format(Localize_cns("CLUB_TXT58"), clubName, level)
		this.mElemList[name + "nameAndLevel"].text = nameAndLevelText

		let bossName = String.format(Localize_cns("CLUB_TXT59"), leaderName)
		this.mElemList[name + "bossName"].text = bossName

		let menberText = memberNum + "/" + maxmenberCount
		let curCountText = String.format(Localize_cns("CLUB_TXT99"), menberText)
		AddRdContent(this.mElemList[name + "curCount"], curCountText, "ht_22_lc", "ublack")

		let heroInfo = GetHeroPropertyInfo()
		let forceElem = <gui.RichDisplayer>this.mElemList[name + "enterForce"]
		if (heroInfo == null || heroInfo["faction"] == 0) {
			this.mElemList[name + "btn"].visible = true
			forceElem.visible = true
		} else {
			this.mElemList[name + "btn"].visible = false
			forceElem.visible = false
		}

		let facSet = bit.band(data.facSet, opFactionSet.autoAddMember)
		let needForce = MakeLongNumberShort(data.force || defaultValue.CLUB_JOIN_FORCE_MIN)
		let myForce = GetHeroProperty("force") || 0

		let applyText = ""
		if (!facSet) { //需审核
			if (myApplyList != null && myApplyList[id]) { //申请中
				this.mElemList[name + "btn"].source = "ty_tongYongBt6"
				applyText = Localize_cns("RENAME_TXT5")
			} else {
				this.mElemList[name + "btn"].source = "ty_tongYongBt2"
				applyText = Localize_cns("CLUB_TXT55")
			}

			AddRdContent(forceElem, Localize_cns("CLUB_TXT75") + "#space", "ht_22_cc", "saddlebrown")
		} else { //自动加入
			if (myApplyList != null && myApplyList[id]) { //申请中
				this.mElemList[name + "btn"].source = "ty_tongYongBt6"
				applyText = Localize_cns("RENAME_TXT5")
			} else {
				this.mElemList[name + "btn"].source = "ty_tongYongBt2"
				applyText = Localize_cns("CLUB_TXT55")
			}

			AddRdContent(forceElem, Localize_cns("CLUB_TXT74") + "#darkgoldenrod" + needForce, "ht_22_cc", "saddlebrown")
		}
		this.mElemList[name + "btn"].text = applyText
	}

	checkListFrame() {
		if (GetHeroProperty("faction") == 0) {
			return
		} else {
			if (this.mElemList["btn_creat"].visible) {
				this.hideWnd()
				ExecuteMainFrameFunction("gonghui")
			}
		}
	}

	/////////////////////////////////////////////////////////////
	onApplyClick(args) {
		let name = args.target.name
		let index = name.replace(/[^0-9]/ig, "")

		let data = this.list[index]
		let clubId = data.id
		let applyReason = ""	//申请描述
		//首先判断是否能够申请
		let myApplyList = ClubSystem.getInstance().getLegionApplyList()
		if (myApplyList != null && myApplyList[clubId]) {  //取消
			RpcProxy.call("C2G_FactionCancelApply", clubId)
		} else {
			let facSet = bit.band(data.facSet, opFactionSet.autoAddMember)
			if (!facSet) { //需审核
				RpcProxy.call("C2G_FactionApply", clubId, applyReason)
			} else {
				let needForce = data.force || defaultValue.CLUB_JOIN_FORCE_MIN
				let myForce = GetHeroProperty("force") || 0
				if (myForce < needForce) {
					MsgSystem.addTagTips(Localize_cns("CLUB_TXT119"))
				} else {
					RpcProxy.call("C2G_FactionApply", clubId, applyReason)
				}
			}
		}
	}

	creatClick() {
		WngMrg.getInstance().showWindow("ClubCreatFrame");
	}

	////////////////////////////////////////////////////////////
	showAndSetData() {
		this.showWnd()
	}
}