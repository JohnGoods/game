class FaBaoFenJieWindow extends BaseCtrlWnd {
	mElemList;
	fenjieScroll
	controlData

	sendList

	typeList

	public initObj(...params: any[]) {
	}
	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;

		var elemInfo = [
			{ ["name"]: "btn_fenjie", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onFenJieClick },

		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let group: eui.Group = this.mElemList["fenjie_scroll"]
		this.fenjieScroll = UIScrollList.newObj(this.mLayoutNode, "fenjieScroll", 0, 0, group.width, group.height, group)

		for (let k = 1; k <= 6; k++) {
			let cBox: eui.CheckBox = this.mElemList["cBox_fenjie_" + k]
			cBox.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cBoxClick, this)
			if (k <= 4) {
				cBox.selected = true
			}
		}
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		this.mElemList["group_fenjie"].visible = true;
		this.mElemList["title"].text = Localize_cns("FABAO_TITLE_TXT4");
		this.mElemList["btn_quality"].visible = false
		this.mElemList['btn_tips'].visible = false
		this.onRefresh();
	}

	public onHide(): void {
		this.mElemList["group_fenjie"].visible = false;
		this.mElemList["btn_quality"].visible = true
		this.mElemList['btn_tips'].visible = true

	}

	onRefresh() {
		//huode 
		let list = ItemSystem.getInstance().getFaBaoItemList()
		let count = 0
		let meltConfig = GameConfig.TalismanEquipMeltConfig
		
		this.typeList = []
		this.controlData = {}
		for (let k = 1; k <= 6; k++) {
			let cBox: eui.CheckBox = this.mElemList["cBox_fenjie_" + k]
			if (cBox.selected) {
				table_insert(this.typeList, k)
			}
		}
		//刷新分解数量
		this.sendList = []
		for (let k in list) {
			let item: Item = list[k]
			if (item.getProperty("talisman_lock") != 0) continue
			let quality = item.getProperty("quality")
			if(!table_isExist(this.typeList, quality)) continue
			let tempConfig = meltConfig[quality]
			count += tempConfig.wardNum
			table_insert(this.sendList, item.id)
		}

		this.mElemList["label_count"].text = tostring(count)

		//刷新scroll
		let scroll = this.fenjieScroll
		scroll.clearItemList()

		let handlelist = []
		for (let k in list) {
			let item: Item = list[k]
			let quality = item.getProperty("quality")
			if(table_isExist(this.typeList, quality)) {
				table_insert(handlelist, item)
			}
		}
		let showList = splitListByCount(handlelist, 5)
		for (let k = 0; k < size_t(showList); k++) {
			let v = showList[k]
			let [window, flag] = scroll.getItemWindow(k, 578, 100, 0, 0)
			if (flag == true) {
				this.onInitWindow(window)
			}
			this.refreshWidow(window, v, k)
		}
		scroll.refreshScroll(true, true)
		scroll.restoreViewXY()

		this.checkTips()
	}

	onInitWindow(window) {
		let name = window.name
		let w = 100
		let height = window.height


		for (let k = 1; k <= 5; k++) {
			let x = 120 * (k - 1)
			let windName = "_fenjie" + k
			let mElemInfo: any = [
				{ ["index_type"]: eui.Group, ["name"]: name + windName + "_group", ["title"]: "", ["x"]: x, ["y"]: 0, ["w"]: w, ["h"]: height, },
				{ ["index_type"]: eui.Group, ["name"]: name + windName + "fabaoItem", ["parent"]: name + windName + "_group", ["image"]: "ty_jiNengDi03", ["x"]: -14, ["y"]: -30, ["w"]: 128, ["h"]: 128 },
				{ ["index_type"]: gui.Button, ["name"]: name + windName + "_suo", ["parent"]: name + windName + "_group", ["title"]: "", ["font"]: "", ["image"]: "cw_jiNengSuo02", ["x"]: 70, ["y"]: 0, ["w"]: 32, ["h"]: 41, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onSuoClick },
				{ ["index_type"]: eui.Image, ["name"]: name + windName + "_name_bg", ["parent"]: name + windName + "_group", ["title"]: "", ["font"]: "", ["image"]: "fb_faBaoTextDi01", ["color"]: null, ["x"]: 4, ["y"]: 75, ["w"]: 94, ["h"]: 34, ["messageFlag"]: true },
				{ ["index_type"]: eui.Label, ["name"]: name + windName + "_name", ["parent"]: name + windName + "_group", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 70, ["w"]: w, ["h"]: 20, ["messageFlag"]: true },

			];
			UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window);

			this.mElemList[name + windName + "fabaoBox"] = UIFaBaoBox.newObj(this.mLayoutNode, name + windName + "fabaoBox", 0, 0, this.mElemList[name + windName + "fabaoItem"])
			this.mElemList[name + windName + "fabaoBox"].setItemTipsListner(this.onOpenTipsClick, this, k)
		}

	}

	refreshWidow(window, config, index) {
		let name = window.name

		for (let k = 1; k <= 5; k++) {
			let windName = "_fenjie" + k
			let item: Item = config[k - 1]
			if (item) {
				let dataKey = tostring(index) + k
				this.controlData[dataKey] = item
				this.mElemList[name + windName + "_group"].visible = true
				let itemName = item.getRefProperty("name")
				let image = item.getProperty("talisman_lock") == 0 ? "cw_jiNengSuo02" : "cw_jiNengSuo03"

				let fontColor = GetQualityColorGui(item.getProperty("quality"))
				this.mElemList[name + windName + "fabaoBox"].updateByItem(item)
				this.mElemList[name + windName + "_name"].textColor = fontColor
				this.mElemList[name + windName + "_name"].text = itemName

				this.mElemList[name + windName + "_suo"].source = image

			} else {
				this.mElemList[name + windName + "_group"].visible = false
			}
		}
	}

	///------------响应
	cBoxClick(args: egret.Event) {
		let name = args.target.name
		let index = name.replace(/[^0-9]/ig, "")
		this.onRefresh()
	}

	onFenJieClick() {
		if(this.sendList == null) return 
		if(size_t(this.sendList) == 0){
			MsgSystem.addTagTips(Localize_cns("FABAO_FENJIE_TXT4"))
			return
		}
		RpcProxy.call("C2G_EquipTalismanResolve", this.sendList)
	}

	onSuoClick(args) {
		let name = args.target.name
		let index = name.replace(/[^0-9]/ig, "")

		let item: Item = this.controlData[index]
		let sendNumber = this.mElemList[name].source == "cw_jiNengSuo02" ? 1 : 0
		RpcProxy.call("C2G_EquipTalismanLock", item.id, sendNumber)
	}

	onOpenTipsClick(logicitem) {
		if (logicitem == null) return false
		let wnd: FaBaoItemTipsFrame = WngMrg.getInstance().getWindow("FaBaoItemTipsFrame")
		wnd.onShowWnd(logicitem, true)
		return true
	}

	checkTips(){
		FireEvent(EventDefine.ACTOR_FABAO_FENJIE_UPDATE, null)
	}

}