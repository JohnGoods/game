class CampaignServerWindow extends BaseCtrlWnd {
	record: any

	public initObj(...params: any[]) {

	}

	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList

		let list: eui.List = this.mElemList["server_scroll"]
		list.itemRenderer = itemRender.CampaignServerItem
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.TOLLGATE_FIRSTPASS_LIST, this.onRefresh, this)
		this.mElemList["server_group"].visible = true
		this.sendRequest()
		this.onRefresh()
	}

	sendRequest() {
		RpcProxy.call("C2G_ExciteAllServerFirstCamp")
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.TOLLGATE_FIRSTPASS_LIST, this.onRefresh, this)
		this.mElemList["server_group"].visible = false
	}

	onRefresh() {
		this.record = CampaignSystem.getInstance().getServerPassData() || {}

		let rd: gui.RichDisplayer = this.mElemList["my_pass_rd1"]
		let campaignId = CampaignSystem.getInstance().getCurOpenCampaign()
		let campaignName = CampaignSystem.getInstance().getCampaignName(campaignId)
		AddRdContent(rd, Localize_cns("CAMPAIGN_TXT21") + "#lime" + campaignName, "ht_20_cc_stroke", "white")

		let configList = CampaignSystem.getInstance().getServerPassConfig()
		let dataList = []
		for (let i in configList) {
			let t: any = {}
			t.data = configList[i]
			t.self = this
			table_insert(dataList, t)
		}

		let list: eui.List = this.mElemList["server_scroll"]
		UiUtil.updateList(list, dataList)
	}
}

module itemRender {
	export class CampaignServerItem extends eui.ItemRenderer {
		mElemList: any;
		constructor() {
			super();
			this.mElemList = {}

			let mElemInfo = [
				{ ["index_type"]: eui.Group, ["name"]: "group", ["x"]: 0, ["y"]: 0, ["w"]: 555, ["h"]: 185 },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["parent"]: "group", ["image"]: "ty_uiDi03", ["x"]: 0, ["y"]: 0, ["w"]: 555, ["h"]: 180, ["messageFlag"]: true },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "title_bg", ["parent"]: "group", ["image"]: "fldt_biaoTiDi01", ["x"]: 10, ["y"]: 6, ["w"]: 420, ["h"]: 32, ["messageFlag"]: true },
				{ ["index_type"]: gui.RichDisplayer, ["name"]: "title_rd", ["parent"]: "group", ["x"]: 10, ["y"]: 10, ["w"]: 420, ["h"]: 30 },

				{ ["index_type"]: eui.Group, ["name"]: "player_group", ["x"]: 10, ["y"]: 130, ["w"]: 535, ["h"]: 36 },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "player_bg", ["parent"]: "player_group", ["image"]: "ty_textDi09", ["x"]: 0, ["y"]: 0, ["w"]: 535, ["h"]: 36 },
				{ ["index_type"]: eui.Label, ["name"]: "player_name", ["parent"]: "player_group", ["title"]: "", ["font"]: "ht_24_cc", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 3, ["w"]: 255, ["h"]: 30 },
				{ ["index_type"]: eui.Group, ["name"]: "batch_bg", ["parent"]: "player_group", ["x"]: 230, ["y"]: 3, ["w"]: 305, ["h"]: 30 },
				{ ["index_type"]: gui.BatchImage, ["name"]: "force_batch", ["parent"]: "batch_bg", ["x"]: 0, ["y"]: 0, ["w"]: 305, ["h"]: 30 },
			]
			UiUtil.createElem(mElemInfo, this, this.mElemList, this)

			for (let i = 0; i < 5; i++) {
				this.mElemList["itemBox" + i] = UIItemBox.newObj(this, "itemBox" + i, 10 + 82 * i, 43, this.mElemList["group"])
				this.mElemList["itemBox" + i].setVisible(false)
			}

			this.mElemList["title_rd"].setAlignFlag(gui.Flag.H_CENTER)
		}

		protected dataChanged(): void {
			let config = this.data.data
			let self = this.data.self

			let campaignName = CampaignSystem.getInstance().getCampaignName(config.campaignId)
			let rd: gui.RichDisplayer = this.mElemList["title_rd"]
			AddRdContent(rd, Localize_cns("CAMPAIGN_TXT26") + campaignName, "ht_22_cc_stroke", "white")

			let itemList = AnalyPrizeFormat(config.prize)
			for (let i = 0; i < 5; i++) {
				if (itemList[i]) {
					this.mElemList["itemBox" + i].updateByEntry(itemList[i][0], itemList[i][1])
					this.mElemList["itemBox" + i].setVisible(true)
				} else {
					this.mElemList["itemBox" + i].setVisible(false)
				}
			}

			let info = self.record[config.campaignId] || []
			if (size_t(info) == 0) {
				this.mElemList["player_name"].text = Localize_cns("CAMPAIGN_TXT29")
				this.mElemList["force_batch"].visible = false
			} else {
				this.mElemList["player_name"].text = info[1] + " Lv." + info[3]
				this.mElemList["force_batch"].visible = true

				DrawNumberStringImage(this.mElemList["force_batch"], "zhanLi_", "l" + info[2], 0, 0, 0)
			}
		}
	}
}