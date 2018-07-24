// TypeScript file
class Wonder_SixWorldWnd extends BaseCtrlWnd {
	name: string;
	mLayoutPath: any;

	controlData
	select
	endSelect
	activityIndex
	count
	timer
	scroll: UIScrollList

	time_timer

	quanshu
	watting

	oldPos
	

	public initObj(...params: any[]) {
		this.name = params[2]
		this.mLayoutPath = params[3]
		this.activityIndex = PayActivityIndex.SIX_LOOK_PRECIOUS
		this.count = 0
		this.select = 1
		this.watting = false
		this.oldPos = -1
	}

	public onLoad(): void {

		this.mElemList = this.mParentWnd.mElemList;
		UiUtil.initElemWithSkinPath(this.name, this.mLayoutPath, this.mLayoutNode, this.mElemList, this, this.mElemList["group_wnd"])

		var elemInfo = [
			{ ["name"]: this.name + "btn_1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onOneClick },
			{ ["name"]: this.name + "btn_10", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTenClick },

			{ ["name"]: this.name + "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickPre },
			{ ["name"]: this.name + "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickNext },
			{ ["name"]: this.name + "label_tips", ["title"]: Localize_cns("WONDER_LIUJIE_TIPS"), ["color"]: gui.Color.aliceblue },

			{ ["name"]: this.name + "image_select", ["messageFlag"]: true }
		];
		UiUtil.initElem(elemInfo, this.mElemList[this.name], this.mElemList, this)

		this.initFrame(8, 9)
		let group: eui.Group = this.mElemList[this.name + "group_prize"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, this.name + "prize_scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_HORIZON)

	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.XUNBAO_UPDATE, this.onRegisterUpdate, this)
		this.scroll.scroller.addEventListener(egret.Event.CHANGE, this.refreshBtn, this)
		this.mElemList[this.name].visible = true
		this.onRefresh()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.XUNBAO_UPDATE, this.onRegisterUpdate, this)
		this.scroll.scroller.removeEventListener(egret.Event.CHANGE, this.refreshBtn, this)
		this.mElemList[this.name].visible = false

		if (this.timer != null) {
			KillTimer(this.timer)
			this.timer = null
		}

		if (this.time_timer != null) {
			KillTimer(this.time_timer)
			this.time_timer = null
		}

		this.quanshu = 0
		this.watting = false

		this.oldPos = - 1
	}

	onRegisterUpdate() {
		let result = ActivitySystem.getInstance().getOperateLotteryResultInfo(this.activityIndex)
		if (result == null) return

		let wnd: WonderSixWorldTipsFrame = WngMrg.getInstance().getWindow("WonderSixWorldTipsFrame")
		let isReturn = wnd.isVisible()
		let count = 0
		let lastCount = 0
		let prizeCofig = []
		let posConfig = GameConfig.LiuJieTouZiPosConfig
		let prizeSelet = this.select + 0
		for (let k = 0; k < result.length; k++) {
			let v = result[k]
			count += v
			lastCount = v
			if (isReturn) {
				prizeSelet += v
				if (prizeSelet > this.count) prizeSelet -= this.count
				let tempPrize = AnalyPrizeFormat(posConfig[prizeSelet].prize)
				table_insert(prizeCofig, tempPrize[0])
			}

		}

		if (isReturn) {
			wnd.updateWnd(prizeCofig)
			return
		}

		this.quanshu = 0
		this.endSelect = this.select + count
		while (this.endSelect > 30) {
			this.quanshu += 1
			this.endSelect -= 30
		}

		this.updateWnd(lastCount)

	}

	updateWnd(index) {
		if(index < 0 || index > 6) index = 1

		this.mElemList[this.name + "image_touzi"].source = "jchd_touzi0" + index
		if (this.timer == null) {
			this.oldPos = this.select + 0
			this.timer = SetTimer(this.onTick, this, 100)
		}
	}


	onRefresh() {
		if (this.watting) return

		let netInfo: any = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex) || {}
		let actInfo: any = ActivitySystem.getInstance().getOperateActivityInfo(this.activityIndex) || {}
		if (netInfo == null || actInfo == null) return
		//{value=消费数量，getPrize={100:1,101:1,102:2}, pos=走到的位置, curRockNum=摇骰子次数,remainNum=剩余摇骰子次数}
		let pos = 0
		/*if (pos > 0) {
			this.endSelect = this.select + pos
			if (this.endSelect > this.count) this.endSelect -= this.count
			this.updateWnd(pos)
		}*/
		this.select = netInfo.pos || 1

		this.mElemList[this.name + "label_times"].text = Localize_cns("WONDER_LIUJIE_TXT1") + (netInfo["curRockNum"] || 0)

		this.mElemList[this.name + "label_yuanbao"].text = Localize_cns("WONDER_LIUJIE_TXT2") + (netInfo.value || 0)

		let remainNum = netInfo.remainNum || 0
		let visible = remainNum >= 10
		this.mElemList[this.name + "btn_10"].enabled = visible

		//DrawNumberStringImage(this.mElemList[this.name + "bImage"], "yuanBao_", remainNum, 0, 0, -3)
		let bImage: gui.BatchImage = this.mElemList[this.name + "bImage"]
		bImage.beginDraw();
		let w = bImage.drawNumberString("yuanBao_", remainNum, 0, 0, -3);
		bImage.endDraw();

		this.showSelect()
		this.onRefreshScroll()

		if (this.time_timer == null) {
			this.time_timer = SetTimer(this.onTimeTick, this, 1000, true)
		}

		let prizeInfo = netInfo.getPrize
		let prizeSelet = 0
		for (let k in prizeInfo) {
			let v = prizeInfo[k]
			if (v == 1) {
				prizeSelet = tonumber(k) - 100
				break
			}
			prizeSelet = tonumber(k) - 100 + 1
		}
		let liujieConfig = GameConfig.LiuJieTouZiNumConfig
		let count = size_t(liujieConfig)
		if (prizeSelet > count - 1) {
			prizeSelet = count - 1
		}

		this.scroll.moveToScrollIndex(prizeSelet)

		this.refreshBtn()

		let entryid = RoleSystem.getInstance().getRoleInfo("entryid")
		let sex = GetHeroProperty("sexId")
		let icon = GetProfessionIcon(entryid, sex)
		this.mElemList[this.name + "image_hero"].source = icon

		//刷新骰子
		let index = -1 
		let result = ActivitySystem.getInstance().getOperateLotteryResultInfo(this.activityIndex) || []
		index = result[size_t(result) - 1] || 1
		if(index < 0 || index > 6) index = 1

		this.mElemList[this.name + "image_touzi"].source = "jchd_touzi0" + index
	}

	onRefreshScroll() {
		let scroll = this.scroll

		let prizeInfo = GameConfig.LiuJieTouZiNumConfig
		let list = []
		for (let k in prizeInfo) {
			let v = prizeInfo[k]
			table_insert(list, v)
		}
		this.controlData = {}
		for (let k = 0; k <= list.length; k++) {
			let v = list[k]
			if (v != null) {
				this.controlData[k] = v
			}
			let [window, flag] = scroll.getItemWindow(k, 157, 160, 0, 0, 3)
			if (flag == true) {
				this.initItemWindow(window)
			}
			this.refreshItemWindow(window, v)
		}
	}

	initItemWindow(window) {
		let name = this.name + window.name

		let mElemInfo: any = [
			{ ["index_type"]: eui.Group, ["name"]: name + "_group", ["image"]: "", ["font"]: "ht_24_cc_stroke", ["x"]: 0, ["y"]: 0, ["w"]: 157, ["h"]: 160, },
			{ ["index_type"]: eui.Image, ["name"]: name + "_bg", ["parent"]: name + "_group", ["image"]: "jchd_liBaoDi01", ["font"]: "ht_24_cc_stroke", ["x"]: 0, ["y"]: 0, ["w"]: 157, ["h"]: 160, },
			{ ["index_type"]: eui.Label, ["name"]: name + "_title", ["parent"]: name + "_group", ["image"]: "", ["font"]: "ht_20_cc_stroke", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 8, ["w"]: 157, ["h"]: 20, },
			{ ["index_type"]: gui.Button, ["name"]: name + "_get", ["parent"]: name + "_group", ["title"]: Localize_cns("CLUB_TXT50"), ["image"]: "ty_tongYongBt6", ["color"]: gui.Color.white, ["font"]: "ht_24_cc_stroke", ["x"]: 34, ["y"]: 107, ["w"]: 86, ["h"]: 41, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onGetClick },

		]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)

		this.mElemList[name + "_itemBox1"] = UIItemBox.newObj(this.mLayoutNode, name + "_itemBox", 10, 37, this.mElemList[name + "_group"], 0.8)
		this.mElemList[name + "_itemBox2"] = UIItemBox.newObj(this.mLayoutNode, name + "_itemBox", 75, 37, this.mElemList[name + "_group"], 0.8)
	}

	refreshItemWindow(window, v) {
		let name = this.name + window.name
		if (v == null) {
			this.mElemList[name + "_group"].visible = false
		} else {
			this.mElemList[name + "_group"].visible = true

			this.mElemList[name + "_title"].text = v.RockNum + Localize_cns("WONDER_LIUJIE_TXT3")

			let prize = AnalyPrizeFormat(v.prize)

			for (let k = 0; k < prize.length; k++) {
				let prizeInfo = prize[k]
				this.mElemList[name + "_itemBox" + (k + 1)].updateByEntry(prizeInfo[0], prizeInfo[1])
			}
			let netInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex) || {}
			let playerInfo = netInfo.getPrize || {}
			if (playerInfo[v.index] == 1) {
				this.mElemList[name + "_get"].enabled = true
			} else {
				this.mElemList[name + "_get"].enabled = false
			}
		}

	}

	//刷新左右按钮
	refreshBtn() {
		let elem = <eui.Scroller>this.scroll.scroller
		let moveDis = elem.viewport.scrollH
		let index = (Math.floor(moveDis / 157)) || 0
		let liujieConfig = GameConfig.LiuJieTouZiNumConfig
		let count = size_t(liujieConfig)

		this.mElemList[this.name + "btn_left"].enabled = true
		this.mElemList[this.name + "btn_right"].enabled = true
		if (index == 0) {
			this.mElemList[this.name + "btn_left"].enabled = false
		}
		if (index >= count - 1) {
			this.mElemList[this.name + "btn_right"].enabled = false
		}
	}

	initFrame(max_l, max_h) {
		let x = 0
		let y = 0

		let count = 0


		let parent = this.mElemList[this.name + "group_item"]

		for (let k = 0; k < max_l; k++) { //顶部
			x = 72 * k
			count += 1
			this.mElemList[this.name + "itemBox_" + count] = UIItemBox.newObj(this.mLayoutNode, this.name + "itemBox_" + count, x, y, parent, 0.8)
		}

		for (let k = 1; k < max_h; k++) { //右边
			x = (max_l - 1) * 72
			y = 70 * k
			count += 1
			this.mElemList[this.name + "itemBox_" + count] = UIItemBox.newObj(this.mLayoutNode, this.name + "itemBox_" + count, x, y, parent, 0.8)

		}

		for (let k = max_l - 1; k > 0; k--) {//底部
			x = 72 * (k - 1)
			y = (max_h - 1) * 70
			count += 1
			this.mElemList[this.name + "itemBox_" + count] = UIItemBox.newObj(this.mLayoutNode, this.name + "itemBox_" + count, x, y, parent, 0.8)

		}

		for (let k = max_h - 2; k > 0; k--) {//左边
			let y = 70 * k
			x = 0
			count += 1
			this.mElemList[this.name + "itemBox_" + count] = UIItemBox.newObj(this.mLayoutNode, this.name + "itemBox_" + count, x, y, parent, 0.8)

		}

		let config = GameConfig.LiuJieTouZiPosConfig
		for (let k = 1; k <= count; k++) {
			let v = config[k]
			if (v) {
				let prizeInfo = AnalyPrizeFormat(v.prize)
				this.mElemList[this.name + "itemBox_" + k].setVisible(true)
				this.mElemList[this.name + "itemBox_" + k].updateByEntry(prizeInfo[0][0], prizeInfo[0][1])
			} else {
				this.mElemList[this.name + "itemBox_" + k].setVisible(false)
			}

		}

		this.count = count
	}

	onTick() {
		this.select += 1
		if (this.select > this.count) {
			this.quanshu -= 1
			this.select = 1
		}
		//-14
		this.showSelect()
		//表演完
		if (this.select == this.endSelect && this.quanshu == 0) {
			if (this.timer != null) {
				KillTimer(this.timer)
				this.timer = null
				let netInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex) || {}
				let result = ActivitySystem.getInstance().getOperateLotteryResultInfo(this.activityIndex)
				if (result == null) return

				let count = 0 + this.oldPos
				let prizeCofig = []
				let posConfig = GameConfig.LiuJieTouZiPosConfig
				for (let k = 0; k < result.length; k++) {
					let v = result[k]
					count += v
					if (count > this.count) count -= this.count
					let prize = AnalyPrizeFormat(posConfig[count].prize)
					table_insert(prizeCofig, prize[0])
				}

				if (size_t(prizeCofig) != 0) {
					let wnd = WngMrg.getInstance().getWindow("WonderSixWorldTipsFrame")
					let index = result.length < 10 ? 1 : 10
					wnd.onShowWnd(prizeCofig, index)
				}
				this.watting = false
				this.onRefresh()
			}
		}
	}

	showSelect() {
		let itemBox: UIItemBox = this.mElemList[this.name + "itemBox_" + this.select]
		let x = itemBox.rootWnd.x
		let y = itemBox.rootWnd.y
		this.mElemList[this.name + "image_select"].x = x - 14
		this.mElemList[this.name + "image_select"].y = y - 14
	}

	/////////////////
	onGetClick(args) {
		let name = args.target.name
		let index = name.replace(/[^0-9]/ig, "");
		let config = this.controlData[index]
		if (!config) return
		RpcProxy.call("C2G_GetOperateActivityPrize", this.activityIndex, [config.index])
	}

	onOneClick() {
		let netInfo: any = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex) || {}
		if (netInfo == null) return
		let times = netInfo.remainNum || 0
		if (times <= 0) {
			MsgSystem.addTagTips(Localize_cns("WONDER_LIUJIE_TXT4"))
			return
		}
		if (this.timer != null) return
		this.watting = true
		RpcProxy.call("C2G_DoOperateActivity", this.activityIndex, [1])


	}

	onTenClick() {
		let netInfo: any = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex) || {}
		if (netInfo == null) return
		let times = netInfo.remainNum || 0
		if (times <= 0) {
			MsgSystem.addTagTips(Localize_cns("WONDER_LIUJIE_TXT4"))
			return
		}
		if (this.timer != null) return
		this.watting = true
		RpcProxy.call("C2G_DoOperateActivity", this.activityIndex, [10])
	}

	onClickPre(args) {
		this.scroll.moveRelativeItemWindow(-2, true)
	}

	onClickNext(args) {
		this.scroll.moveRelativeItemWindow(2, true)
	}


	onTimeTick() {
		let actInfo: any = ActivitySystem.getInstance().getOperateActivityInfo(this.activityIndex) || {}
		let endTime = actInfo[0] || 0
		let osTime = GetServerTime()
		let diffTime = endTime - osTime
		if (diffTime <= 0) {
			if (this.time_timer != null) {
				KillTimer(this.time_timer)
				this.time_timer = null
			}
			RpcProxy.call("C2G_SendOperateAndPlayerData", PayActivityIndex.SIX_LOOK_PRECIOUS)
			return
		}
		let dateTime = simple_transform_time1(diffTime)
		let str = ""
		if (diffTime < 86400) {
			str = String.format(Localize_cns("LUCKY_PRIZE_SEC"), dateTime.hours, dateTime.mins, dateTime.secs)
		} else {
			str = String.format(Localize_cns("LUCKY_PRIZE_DAY"), dateTime.day, dateTime.hours, dateTime.mins)
		}

		this.mElemList[this.name + "label_time"].text = str
	}

}