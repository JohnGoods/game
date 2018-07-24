/*
作者:
    ljq
	
创建时间：
   2018.03.21(周三)

意图：
   商店框通用控件
   
公共接口：
   
*/
class UIShopBox extends TClass {

	mParentNode: eui.Component;
	name: string;
	mElemList: any;
	parentWnd: any;

	rootWnd: any;

	bEnable: boolean;
	logicItem: Item;
	enableIcon: boolean

	needCount: number
	frameList: any;
	isShowFrontFrame: boolean;

	bgImage: any;

	itemTipsFunc: Function;
	itemTipsObj: any;
	userData: any;

	shopEntry: number
	index: number

	public initObj(...args: any[]): void {
		this.mParentNode = args[0]
		this.name = args[1]
		let x = args[2]
		let y = args[3]

		let parentWnd = args[4]
		let scale = 1
		let w = 270
		let h = 150
		if (args[5]) {
			scale = args[5]
			w = w * scale
			h = h * scale
		}
		this.rootWnd = null
		let bgImg = "ty_uiDi03"


		this.mElemList = {}
		let itemBoxName = this.name;
		let mElemInfo = [
			{ ["index_type"]: eui.Group, ["name"]: itemBoxName, ["x"]: x, ["y"]: y, ["w"]: w, ["h"]: h, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
			{ ["index_type"]: gui.Grid9Image, ["name"]: this.name + "_bg", ["parent"]: itemBoxName, ["title"]: "", ["font"]: "ht_20_cc", ["image"]: bgImg, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onClickBox },
			{ ["index_type"]: gui.RichDisplayer, ["name"]: this.name + "_rd_name", ["parent"]: itemBoxName, ["titile"]: "", ["font"]: "ht_20_cc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 8, ["w"]: w, ["h"]: 20, ["messageFlag"]: true },
			{ ["index_type"]: gui.Grid9Image, ["name"]: this.name + "_line", ["parent"]: itemBoxName, ["title"]: "", ["font"]: "ht_20_cc", ["image"]: "cz_uiLine01", ["color"]: gui.Color.white, ["x"]: 14, ["y"]: 30, ["w"]: 232, ["h"]: 16, ["messageFlag"]: true },
			{ ["index_type"]: gui.Button, ["name"]: this.name + "_btn_suit", ["parent"]: itemBoxName, ["title"]: Localize_cns("ROLE_SUIT_TXT4"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_biaoShiDi", ["color"]: gui.Color.aliceblue, ["x"]: 10, ["y"]: 0, ["w"]: 40, ["h"]: 52, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickSuit },
			//折扣的
			{ ["index_type"]: eui.Group, ["name"]: this.name + "_discout", ["parent"]: itemBoxName, ["x"]: 0, ["y"]: 0, ["w"]: 43, ["h"]: 60, },
			{ ["index_type"]: eui.Image, ["name"]: this.name + "_discout_bg", ["parent"]: this.name + "_discout", ["image"]: "ty_zheKouDi", ["x"]: 0, ["y"]: 0, ["w"]: 43, ["h"]: 60, },
			{ ["index_type"]: eui.Label, ["name"]: this.name + "_discout_label", ["parent"]: this.name + "_discout", ["title"]: "", ["font"]: "ht_24_cc_stroke", ["color"]: gui.Color.aliceblue, ["x"]: 10, ["y"]: 0, ["w"]: 24, ["h"]: 40, },

			{ ["index_type"]: eui.Group, ["name"]: this.name + "_item", ["parent"]: itemBoxName, ["title"]: "", ["font"]: "ht_20_cc", ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 53, ["w"]: 80, ["h"]: 80, ["messageFlag"]: true },
			{ ["index_type"]: gui.RichDisplayer, ["name"]: this.name + "_rd_cost", ["parent"]: itemBoxName, ["titile"]: "", ["font"]: "ht_20_cc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 122, ["y"]: 58, ["w"]: 300, ["h"]: 20, ["messageFlag"]: true },
			{ ["index_type"]: eui.Rect, ["name"]: this.name + "_rect", ["parent"]: itemBoxName, ["titile"]: "", ["font"]: "ht_20_cc", ["image"]: "", ["color"]: gui.Color.ublack, ["x"]: 122, ["y"]: 67, ["w"]: 300, ["h"]: 2, ["messageFlag"]: true },
			{ ["index_type"]: gui.RichDisplayer, ["name"]: this.name + "_rd_discout", ["parent"]: itemBoxName, ["title"]: "", ["font"]: "ht_18_cc_stroke", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 122, ["y"]: 88, ["w"]: 300, ["h"]: 20, ["messageFlag"]: true },
			{ ["index_type"]: gui.RichDisplayer, ["name"]: this.name + "_rd_limit", ["parent"]: itemBoxName, ["title"]: "", ["font"]: "ht_18_cc_stroke", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 122, ["y"]: 118, ["w"]: 300, ["h"]: 20, ["messageFlag"]: true },

			//来源
			{ ["index_type"]: eui.Group, ["name"]: this.name + "_link_group", ["parent"]: itemBoxName, ["title"]: "", ["font"]: "ht_20_cc", ["color"]: gui.Color.white, ["x"]: 120, ["y"]: 93, ["w"]: 200, ["h"]: 20, },
		]
		UiUtil.createElem(mElemInfo, this.mParentNode, this.mElemList, this, parentWnd)

		this.mElemList[this.name + "_itemBox"] = UIItemBox.newObj(this.mParentNode, this.name + "_itemBox", 0, 0, this.mElemList[this.name + "_item"])

		this.mElemList[this.name + "_linkView"] = UILinkView.newObj(this.mParentNode, this.name + "_linkView", 0, 0, this.mElemList[this.name + "_link_group"])

		this.rootWnd = this.mElemList[itemBoxName]

		this.mElemList[this.name + "_rd_name"].setAlignFlag(gui.Flag.CENTER_CENTER)
		this.mElemList[this.name + "_rd_cost"].setAlignFlag(gui.Flag.LEFT_CENTER)
		this.mElemList[this.name + "_rd_limit"].setAlignFlag(gui.Flag.LEFT_CENTER)

		//逻辑数据
		this.bEnable = true
		this.logicItem = null
		this.enableIcon = true

		this.needCount = null
		this.frameList = null
		this.isShowFrontFrame = false
	}

	destory() {

	}


	setVisible(b) {
		this.rootWnd.visible = (b)
	}

	setXY(x, y) {
		this.rootWnd.x = x;
		this.rootWnd.y = y;
	}

	createElem(mElemInfo, mElemList, obj, parent?) {
		UiUtil.createElem(mElemInfo, this.mParentNode, mElemList, obj, parent || this.rootWnd)
	}

	updateByEntry(shopEntry, index) {

		this.shopEntry = shopEntry
		this.index = index

		let tempConfig = GameConfig.ShopCommodityConfig[shopEntry][index]

		let id = tempConfig.itemEntry
		let quality = tempConfig.quality
		if (quality == 0) {
			quality = GameConfig.itemConfig[id].quality
		}
		let count = tempConfig.buyNumber
		let nameColor = "#" + GetQualityColorStr(quality, false)
		let name = GameConfig.itemConfig[id].name
		//名字
		AddRdContent(this.mElemList[this.name + "_rd_name"], nameColor + name, "ht_20_cc", "ublack")
		this.mElemList[this.name + "_itemBox"].updateByEntry(id, count, quality)

		//消耗物品
		let costStr = ShopSystem.getInstance().getShopCostStr(shopEntry, index)
		AddRdContent(this.mElemList[this.name + "_rd_cost"], costStr, "ht_20_cc", "ublack")

		//打折
		let isDiscount = tempConfig.discount != 1
		this.mElemList[this.name + "_rd_discout"].visible = isDiscount
		this.mElemList[this.name + "_discout"].visible = isDiscount
		this.mElemList[this.name + "_rect"].visible = isDiscount
		if (isDiscount) {
			let icon = ""
			if (tempConfig.money != 0) {
				icon += GetMoneyIcon(tempConfig.money)
			} else if (tempConfig.unit != 0) {
				icon += GetTagIcon(tempConfig.unit)
			}
			AddRdContent(this.mElemList[this.name + "_rd_discout"], String.format(Localize_cns("OPENSERVER_TXT17"), tempConfig.price * tempConfig.discount + icon), "ht_20_cc", "ublack")

			this.mElemList[this.name + "_discout_label"].text = (tempConfig.discount) * 10 + Localize_cns("CARNIVAL_DISCOUNT")
			this.mElemList[this.name + "_rect"].width = this.mElemList[this.name + "_rd_discout"].getLogicWidth()
		}
		let x = 10
		let y = 118
		if (!isDiscount) {
			y = 118 - 30
		}

		if (tempConfig.suit != 0) {
			x = 55
		}
		this.mElemList[this.name + "_discout"].x = x

		//解锁条件
		let checkHuoqu = tempConfig.approachName == ""

		this.mElemList[this.name + "_link_group"].visible = !checkHuoqu
		this.mElemList[this.name + "_rd_limit"].visible = checkHuoqu
		//this.mElemList[this.name + "_linkView"].setVisible(!checkHuoqu)
		if (checkHuoqu) {
			let jieSuoStr = ShopSystem.getInstance().getShopJudgeStr(shopEntry, index)
			AddRdContent(this.mElemList[this.name + "_rd_limit"], jieSuoStr, "ht_18_cc", "ublack")
			this.mElemList[this.name + "_rd_limit"].y = y
		} else {
			let checkIsExit = ShopSystem.getInstance().checkIsExitSkin(tempConfig.itemEntry, tempConfig.suit)
			let tipInfo: any = {}
			if (checkIsExit == false) {
				tipInfo.showTips = tempConfig.approachName
				tipInfo.approach = tempConfig.approach
			} else {
				tipInfo.showTips = Localize_cns("SHOP_HAD")
				tipInfo.approach = []
			}
			this.mElemList[this.name + "_linkView"].updateByTips(tipInfo)
			this.mElemList[this.name + "_link_group"].y = y
			this.mElemList[this.name + "_linkView"].setLeft()

		}

		this.mElemList[this.name + "_btn_suit"].visible = (tempConfig.suit || 0) != 0
	}


	//点击事件
	onClickBox(args: egret.Event) {
		let tempConfig = GameConfig.ShopCommodityConfig[this.shopEntry][this.index]
		if (tempConfig == null || tempConfig.price == 0) return
		let skin = tempConfig.skin
		let isSkin = size_t(skin) != 0
		if (isSkin) {
			let check = RoleSystem.getInstance().checkSkinExist(skin[0], skin[1])
			let count = ItemSystem.getInstance().getItemCount(tempConfig.itemEntry)
			if (check || count >= 1) {
				return
			}
		}

		//如果拥有仙侣
		let xianlvId = tempConfig.xianlvId || 0
		if (xianlvId != 0) {
			let itemEntry = tempConfig.itemEntry
			let count = ItemSystem.getInstance().getItemCount(tempConfig.itemEntry)
			let check = XianLvSystem.getInstance().isExit(xianlvId)
			if (check || count >= 1) {
				return
			}
		}


		let limitTimes = ShopSystem.getInstance().getLimitTwice(this.shopEntry, this.index)
		if (limitTimes != 0) {
			let hadBuy = 0
			let buyInfo = ShopSystem.getInstance().getShopPosInfo(this.shopEntry, this.index)
			if (buyInfo != null) {
				hadBuy = buyInfo.count || 0
			}
			if (hadBuy >= limitTimes) {
				MsgSystem.addTagTips(Localize_cns("SHOP_TIPS_TXT4"))
				return
			}
		}
		let wnd = WngMrg.getInstance().getWindow("ShopItemBuyFrame")
		wnd.onShowWnd(this.shopEntry, this.index)
	}

	//点击套装
	onClickSuit() {
		let tempConfig = GameConfig.ShopCommodityConfig[this.shopEntry][this.index]
		if (tempConfig == null) return
		let suit = tempConfig.suit || 0
		if (suit != 0) {
			let wnd: RoleSuitFrame = WngMrg.getInstance().getWindow("RoleSuitFrame")
			wnd.onShowWnd(suit)
		}
	}

}