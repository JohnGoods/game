class LuckyPrizeFrame extends BaseWnd {
	tabWndList: UITabWndList
	tabIndex: number

	scroll: UIScrollList

	wndListDefine

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/activity/LuckyPrizeLayout.exml"]
		this.tabIndex = -1
	}
	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList)

		let group: eui.Group = this.mElemList["top_scroll"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_HORIZON)

		this.wndListDefine = {
			[PayActivityIndex.Fallen_Good_Gift_Recharge]: {wnd : HeavenGiftWindow.newObj(this.mLayoutNode, this), image : "xyhl_Bt01"},
			[PayActivityIndex.Fallen_Good_Gift_SHOP]: {wnd : LimitedSaleWindow.newObj(this.mLayoutNode, this), image : "xyhl_Bt02"},
			//[2]: {wnd : HeavenGiftWindow.newObj(this.mLayoutNode, this), image : "xyhl_Bt03"}
		}

	}
	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.updateWnd, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.checkHeroUpdatte, this)
		this.mLayoutNode.visible = true;
		this.refreshActList()

		/*if (this.tabIndex != -1) {
			this.tabWndList.changeTabWithIndex(this.tabIndex)
		}*/
		this.tabWndList.setWndVisible(true);

		RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.Fallen_Good_Gift_Recharge)
		RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.Fallen_Good_Gift_SHOP)
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.updateWnd, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.checkHeroUpdatte, this)
		this.mLayoutNode.visible = false;
		this.tabWndList.setWndVisible(false);

	}

	checkHeroUpdatte(args: ActorUpdateEvent) {
		if (!args) return
		let wnd = this.tabWndList.getCurrentWnd()
		let opKey = wnd.activityIndex == PayActivityIndex.Fallen_Good_Gift_Recharge ? opSaveRecordKey.FallenGoodGiftRecharge　:opSaveRecordKey.FallenGoodGiftShop 
		let old_pro = args.oldProperty.saveRecord[opKey] || {}
		let new_pro = args.newProperty.saveRecord[opKey] || {}

		let oldVal = old_pro[0]
		let newVal = new_pro[0]

		let refresh = false
		if(newVal != null){
			for(let k in newVal){
				if(oldVal[k] == null || oldVal[k] != newVal[k]){
					refresh = true
					break
				}
			}
		}
		
        if(wnd && refresh){
            wnd.onRefresh()
        }
	}

	updateWnd(args?) {
		let wnd = this.tabWndList.getCurrentWnd()
		if (args && args.actIndex) {
			let index = args.actIndex
			if (index != wnd.activityIndex) return
		}
		if (wnd) {
			wnd.onRefresh()
		}
	}

	refreshActList() {
		let actList = GetActivity(ActivityDefine.LuckyPrize).getLuckyPrizeOpenActivity()
		table_sort(actList, function (a, b) { return a - b })
		let list = []
		for (let i = 0; i < actList.length; i++) {
			let actIndex = actList[i]
			let imageIcon = this.wndListDefine[actIndex].image
			table_insert(list, { index: actIndex, imageName: imageIcon })
		}

		let scroll = this.scroll
		for (let k = 0; k < list.length; k++) {
			let v = list[k]
			let [window, flag] = scroll.getItemWindow(k, 100, 106, 3, 0, 0)

			if (flag == true) {
				this.initRadioItemWindow(window, v)
			}
			this.refreshRadioItemWindow(window, v)
		}
	}

	initRadioItemWindow(window, config) {
		let name = window.name

		let mElemInfo: any = [
			{ ["index_type"]: eui.RadioButton, ["name"]: name + "_btn", ["image"]: config.imageName + "_up", ["font"]: "ht_20_cc_stroke", ["shortSelected"]: true, ["image_down"]: config.imageName + "_down", ["x"]: 0, ["y"]: 0, ["w"]: 0, ["h"]: 0, ["event_name"]: null, ["fun_index"]: null },

		]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)
		//ui_util.CreateDrawRectPtr(this.mElemList[name +"_dec"], gui.Color32Half.green)
		//AddRdContent(this.mElemList[name + "_dec"], Localize_cns("CHAT_ERROE_JINYAN"), "ht_20_cc", "zongse")

		// if (this.tabWndList == null) {
		//     this.tabWndList = UITabWndList.newObj(this.mLayoutNode, this.mElemList, [{name: name + "_btn", wnd: BaseCtrlWnd.newObj(this.mLayoutNode, this)}])
		// }

		// this.tabWndList.insertTabWnd(name + "_btn", this.wndListDefine[config.index])
	}
	refreshRadioItemWindow(window, config) {
		let name = window.name

		this.tabWndList.insertTabWnd(name + "_btn", this.wndListDefine[config.index].wnd)
	}

	//////////////-----
	showWithIndex(index) {
		this.tabIndex = index
		this.showWnd()
	}
}