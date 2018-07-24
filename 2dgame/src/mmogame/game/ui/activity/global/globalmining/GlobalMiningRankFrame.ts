// TypeScript file
class GlobalMiningRankFrame extends BaseWnd {
	curIndex :number
	disposeList:any[]
	rankInfo
	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/activity/global/globalmining/GlobalMiningRankLayout.exml"]
		this.curIndex = 0
		this.rankInfo = null
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList()
        this.setFullScreen(true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLeftClick },
			{ ["name"]: "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRightClick },
			{ ["name"]: "btn_rule", ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickRule },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
		
		this.mElemList["my_rank"].setAlignFlag((gui.Flag.LEFT_CENTER))
		this.mElemList["my_rank"].setRowDistance(4)
		this.mElemList["tip_rd"].setAlignFlag((gui.Flag.LEFT_CENTER))
		AddRdContent(this.mElemList["tip_rd"], Localize_cns("WULIN_TXT24"), "ht_20_cc_stroke", "lime")
		
		for(let i = 0;i<4;i++){
			this.mElemList["rank_rd"+i].setAlignFlag(gui.Flag.CENTER_CENTER)
			this.mElemList["name_rd"+i].setAlignFlag(gui.Flag.CENTER_CENTER)
			let x = 0+80*i
			let y = 0
			let scale = 1
			this.mElemList["item_0_"+i] = UIItemBox.newObj(this.mElemList, "item_0_"+i, x  ,y,this.mElemList["reward_item_group0"],scale)
			this.mElemList["item_1_"+i] = UIItemBox.newObj(this.mElemList, "item_1_"+i, x ,y,this.mElemList["reward_item_group1"],scale)
			this.mElemList["item_2_"+i] = UIItemBox.newObj(this.mElemList, "item_2_"+i, x ,y,this.mElemList["reward_item_group2"],scale)
			this.mElemList["item_3_"+i] = UIItemBox.newObj(this.mElemList, "item_3_"+i, x ,y,this.mElemList["reward_item_group3"],scale)
		}

		this.mElemList["actorview"] = UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["player_view"])

		// for (let i = 0; i < 4; i++) {
		// 	this.mElemList["item_group_"+i].visible = false
		// 	this.mElemList["cur_pro"].text = 0 + "/" + 0
		// }
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		// RegisterEvent(EventDefine.WULIN_RANK_INFO, this.refreshFrame, this)
		this.mLayoutNode.visible = true;
		this.refreshFrame()
		RpcProxy.call("C2G_MineMonthRank")	//申请月排行数据
	}

	public onHide(): void {
		// UnRegisterEvent(EventDefine.WULIN_RANK_INFO, this.refreshFrame, this)
		this.mLayoutNode.visible = false;
		this.curIndex = 0
		let actorView:UIActorView = this.mElemList["actorview"]
		actorView.clearView()
	}

	refreshFrame(){
		let rankInfo = GetActivity(ActivityDefine.GlobalMining).getMineMonthRank() || {}
		
		this.disposeList = null
		// if(rankInfo == null){
		// 	return
		// }
		this.rankInfo = table_copy(rankInfo)

		let config = GameConfig.GlobalMineMonthRankConfig
		let configInfo = []
		for(let v in config){
			let info = config[v]
			table_insert(configInfo,info)
		}
		table_sort(configInfo, function(a, b) {return a.index - b.index})

		let rankList = rankInfo.rankList || []
		this.rankInfo.rankList = []
		let list = []

		let rankIndex = 0
		for(let i = 0; i < configInfo.length; i++) {
			let cInfo = configInfo[i]
			if(rankList[i]){
				let rank = rankList[i]

				let gameInfo = ServerConfig.gameList[rank[0]]
				if (gameInfo != null) {					//只显示已开放服务器
					table_insert(list, [cInfo, rankIndex, rank])
					rankIndex = rankIndex + 1
				} else {
					table_insert(list, [cInfo, rankIndex, null])
					rankIndex = rankIndex + 1
				}
				table_insert(this.rankInfo.rankList, rank)
			}else{
				table_insert(list, [cInfo, rankIndex, null])
				rankIndex = rankIndex + 1
			}
		}

		this.disposeList = splitListByCount(list, 4)
		this.refreshRewardInfo()
		this.refreshMyInfo()
		// this.updateActor()
	}

	refreshRewardInfo(){
		if(size_t(this.disposeList) == 0) {
			for (let i = 0; i < 4; i++) {
				this.mElemList["item_group_"+i].visible = false
				this.mElemList["cur_pro"].text = 0 + "/" + 0
			}
			return
		}
		let disposeList = this.disposeList
		// this.curIndex = MathUtil.clamp(this.curIndex, 0, size_t(disposeList))
		this.curIndex = (this.curIndex + size_t(this.disposeList)) % size_t(this.disposeList)

		this.mElemList["cur_pro"].text = (this.curIndex + 1) + "/" + (size_t(disposeList))
		let curIndex = this.curIndex
		
		let curInfo = disposeList[curIndex]
		for(let i = 0; i < 4; i++) {
			let [info, rankIndex, rank] = curInfo[i] || [null, null, null]
			if(info){
				this.mElemList["item_group_"+i].visible = true
				let prize = info.prize
				let iindex = info.index

				let nameRd = this.mElemList["name_rd"+i]
				// this.mElemList["score"+i].text = ""
				// AddRdContent(nameRd, "", "ht_20_cc_stroke", "lime")	
				if(rank){					//[regionId, groupIndex, score]
					AddRdContent(nameRd, LoginSystem.getInstance().getServerNameByGameGroup(rank[0], rank[1]), "ht_20_cc_stroke", "lime")
					this.mElemList["score"+i].text = String.format(Localize_cns("WULIN_TXT19"), rank[2])
				}else{
					AddRdContent(nameRd, Localize_cns("WULIN_TXT25"), "ht_20_cc_stroke", "lime")	
					this.mElemList["score"+i].text = Localize_cns("WULIN_TXT25")
				}
				let itemList = AnalyPrizeFormat(prize)
				for(let k = 0; k < 4; k++) {
					let itemInfo = itemList[k]
					this.mElemList["item_"+ i + "_" + k].setVisible(false)
					if(itemInfo){
						this.mElemList["item_"+ i + "_" + k].setVisible(true)
						if(itemInfo[2]){
							this.mElemList["item_"+ i + "_" + k].updateByEntry(itemInfo[0],itemInfo[1],itemInfo[2])
						}else{
							this.mElemList["item_"+ i + "_" + k].updateByEntry(itemInfo[0],itemInfo[1])
						}
					}
				}

				let colorFont = {
					[1]: "gold",
					[2]: "fuchsia",
					[3]: "deepskyblue",
				}

				let rankRd = this.mElemList["rank_rd"+i]
				AddRdContent(rankRd, String.format(Localize_cns("WULIN_TXT18"), rankIndex + 1), "ht_20_cc_stroke", checkNull(colorFont[rankIndex + 1], "white"))
			}else{
				this.mElemList["item_group_"+i].visible = false
			}
		}
	}

	refreshMyInfo(){
		let rankList = this.rankInfo.rankList || []
		
		let rank = null
		for (let i = 0; i < rankList.length; i++) {
			let info = rankList[i]
			if (info[0] == this.rankInfo.regionId && info[1] == this.rankInfo.groupIndex) {
				rank = i + 1
				break
			}
		}
		let rd =  this.mElemList["my_rank"]
		if (rank) {
			AddRdContent(rd, String.format(Localize_cns("GLOBAL_MINING_TXT54"), rank), "ht_20_cc_stroke", "white")
		} else {
			AddRdContent(rd, Localize_cns("GLOBAL_MINING_TXT55"), "ht_20_cc_stroke", "white")
		}
	}

	updateActor(){
		let firstPlayerInfo = this.rankInfo.firstInfo
		this.mElemList["first_name"].text = Localize_cns("WULIN_TXT25")
		if(firstPlayerInfo == null){
			return
		}
		let name = firstPlayerInfo.name
		this.mElemList["first_name"].text = name
		if(firstPlayerInfo){
			let model = GetProfessionModel(firstPlayerInfo.vocation,firstPlayerInfo.sexId)
			let actorView:UIActorView = this.mElemList["actorview"]
			actorView.updateByPlayerAppearInfo(firstPlayerInfo)
		}
	}

	onLeftClick(){
		// if(this.curIndex<= 0){
		// 	return
		// }
		this.curIndex = this.curIndex - 1
		this.refreshRewardInfo()
	}

	onRightClick(){
		// if(this.curIndex>=12){
		// 	return
		// }
		this.curIndex = this.curIndex + 1
		this.refreshRewardInfo()
	}

	onClickRule(args) {
		let wnd  = WngMrg.getInstance().getWindow("RuleDescribeFrame")
        wnd.showWithActivity("GlobalMineRank")
	}
}
