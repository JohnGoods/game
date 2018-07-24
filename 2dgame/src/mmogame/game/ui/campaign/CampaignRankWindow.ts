class CampaignRankWindow extends BaseCtrlWnd {
	rankList: any[]
	scroll: UIScrollList
	myRank: number

	public initObj(...params: any[]) {
		this.rankList = []
	}

	public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList

		let group = <eui.Group>this.mElemList["scroll_group"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.refresh, this)
		this.mElemList["rank_group"].visible = true
		this.sendRankRequire()
		this.refreshInfo()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ACTIVITY_RANK_UPDATE, this.refresh, this)
		this.mElemList["rank_group"].visible = false
	}

	refresh(info) {
		this.rankList = info.ranklist
		this.refreshFrame()
	}

	refreshFrame() {
		let list = this.rankList
		let group = <eui.Group>this.mElemList["scroll_group"]
		let scroll = this.scroll
		scroll.clearItemList();

		for (let k = 0; k < list.length; k++) {
			let v = list[k]
			let [window, flag] = scroll.getItemWindow(k, group.width - 3, 60, 3, 5, 0)

			if (flag == true) {
				this.initItemWindow(window)
			}
			this.refreshItemWindow(window, v, k)
		}

		this.refreshHeroRank()
	}

	refreshHeroRank() {
        if (!this.myRank) {
            this.mElemList["my_rank"].text = String.format(Localize_cns("OPENSERVER_TXT10"), Localize_cns("OPENSERVER_TXT11"))

            return
        }
        
        this.mElemList["my_rank"].text = String.format(Localize_cns("OPENSERVER_TXT10"), this.myRank)
        return
    }

	initItemWindow(window) {
		let name = window.name

		let mElemInfo: any = [
			{ ["index_type"]: gui.Grid9Image, ["name"]: name + "_bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["autoScale"]: true, ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: window.width, ["h"]: window.height, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },

			{ ["index_type"]: eui.Label, ["name"]: name + "_rank", ["title"]: "", ["font"]: "ht_22_cc", ["color"]: gui.Color.ublack, ["x"]: 0, ["y"]: 15, ["w"]: 80, ["h"]: 25, ["fun_index"]: null, ["messageFlag"]: true, },
			{ ["index_type"]: eui.Label, ["name"]: name + "_name", ["title"]: Localize_cns("BOSS_TXT12"), ["font"]: "ht_22_cc", ["color"]: gui.Color.ublack, ["x"]: 80, ["y"]: 15, ["w"]: 140, ["h"]: 25, ["fun_index"]: null, ["messageFlag"]: true, },
			{ ["index_type"]: eui.Label, ["name"]: name + "_force", ["title"]: "", ["font"]: "ht_22_cc", ["color"]: gui.Color.orange, ["x"]: 220, ["y"]: 15, ["w"]: 120, ["h"]: 25, ["fun_index"]: null, ["messageFlag"]: true, },
			{ ["index_type"]: gui.RichDisplayer, ["name"]: name + "_pass", ["font"]: "ht_20_cc", ["color"]: gui.Color.white, ["x"]: 370, ["y"]: 15, ["w"]: 180, ["h"]: 25, ["fun_index"]: null, ["messageFlag"]: true, },
		]
		UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this, window)

		this.mElemList[name + "_pass"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList[name + "_pass"].visible = false
	}

	refreshItemWindow(window, config, index) {
		let name = window.name
		let info = config

		this.mElemList[name + "_pass"].visible = true

		let rankNum = tonumber(index) + 1
		this.mElemList[name + "_rank"].text = rankNum
		this.mElemList[name + "_name"].text = info[3] || ""
		this.mElemList[name + "_force"].text = Math.round(info[1]) || 0

		let pass = info[0] || 0
		AddRdContent(this.mElemList[name + "_pass"], pass + Localize_cns("CAMPAIGN_TXT10"), "ht_22_cc", "green")

		if (config[2] == GetHeroProperty("id")) {
            this.myRank = index + 1
        }
	}

	refreshInfo() { //更新自己的数据
		let campId = CampaignSystem.getInstance().getCurOpenCampaign()
		let pass = GameConfig.CampaignConfig[campId].next - 1 - 1
		this.mElemList["my_pass"].text = Localize_cns("COPY_TXT27") + pass + Localize_cns("CAMPAIGN_TXT10")
		this.mElemList["my_pass"].textColor = gui.Color.lime
	}

	///////////////////////////////////////////////////////
	//发送协议获取排行数据
	sendRankRequire() {
		RpcProxy.call("C2G_RoleRank", configRankType.RANK_CAMPAIGN,1)
		// let message = GetMessage(opCodes.C2G_ROLE_RANK)
		// message.rankType = configRankType.RANK_CAMPAIGN
		// message.index = 1
		// SendGameMessage(message)
	}
}