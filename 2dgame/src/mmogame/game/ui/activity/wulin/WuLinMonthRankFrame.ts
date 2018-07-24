// TypeScript file
class WuLinMonthRankFrame extends BaseWnd {
	curIndex :number
	disposeList:any[]
	rankInfo
	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/activity/wulinmengzhu/WuLinMonthRankLayout.exml"]
		this.curIndex = 0
		this.rankInfo = null
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList()
        this.setFullScreen(true)

		var elemInfo = [
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLeftClick },
			{ ["name"]: "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRightClick },
			
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
		
		this.mElemList["my_rank"].setAlignFlag((gui.Flag.LEFT_CENTER))
		this.mElemList["my_rank"].setRowDistance(4)
		this.mElemList["tip_rd"].setAlignFlag((gui.Flag.LEFT_CENTER))
		AddRdContent(this.mElemList["tip_rd"], Localize_cns("WULIN_TXT24"), "ht_20_cc", "lime")
		
		for(let i = 0;i<4;i++){
			this.mElemList["rank_rd"+i].setAlignFlag(gui.Flag.CENTER_CENTER)
			this.mElemList["name_rd"+i].setAlignFlag(gui.Flag.CENTER_CENTER)
			let x = 0+80*i
			let y = 5
			let scale = 0.8
			this.mElemList["item_0_"+i] = UIItemBox.newObj(this.mElemList, "item_0_"+i, x  ,y,this.mElemList["reward_item_group0"],scale)
			this.mElemList["item_1_"+i] = UIItemBox.newObj(this.mElemList, "item_1_"+i, x ,y,this.mElemList["reward_item_group1"],scale)
			this.mElemList["item_2_"+i] = UIItemBox.newObj(this.mElemList, "item_2_"+i, x ,y,this.mElemList["reward_item_group2"],scale)
			this.mElemList["item_3_"+i] = UIItemBox.newObj(this.mElemList, "item_3_"+i, x ,y,this.mElemList["reward_item_group3"],scale)
		}

		this.mElemList["actorview"] = UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["player_view"])
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		RegisterEvent(EventDefine.WULIN_RANK_INFO, this.refreshFrame, this)
		this.mLayoutNode.visible = true;
		RpcProxy.call("C2G_WuLinMengZhuMonthRank")	//申请月排行数据
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.WULIN_RANK_INFO, this.refreshFrame, this)
		this.mLayoutNode.visible = false;
		this.curIndex = 0
		let actorView:UIActorView = this.mElemList["actorview"]
		actorView.clearView()
	}

	refreshFrame(){
		let rankInfo = ActivitySystem.getInstance().getWulinMonthRankInfo()
		this.disposeList = null
		if(rankInfo == null){
			return
		}
		this.rankInfo = rankInfo

		let config = GameConfig.WuLinMengZhuMonthRankPrizeConfig
		let configInfo = []
		for(let v in config){
			let info = config[v]
			table_insert(configInfo,info)
		}

		let playerInfo = rankInfo.playerInfo
		let playerList = []
		

		for(let i = 0; i<size_t(configInfo);i++){
			let cInfo = configInfo[i]
			if(playerInfo && playerInfo[i]){
				let info = playerInfo[i]
				cInfo.playerInfo = info
				table_insert(playerList,cInfo)
			}else{
				table_insert(playerList,cInfo)
			}
		}

		let disposeList = []
		let ro = 0
		let t = []

		for (let k in playerList) {
			let info = playerList[k]
			if(ro == 4){
				table_insert(disposeList,t)
				t = []
				ro = 0
			}
			ro = ro + 1
			
			table_insert(t,info)
		}

		let arrayLength = t.length;
		if(arrayLength > 0){
			table_insert(disposeList,t)
		}

		this.disposeList = disposeList
		this.refreshRewardInfo()
		this.refreshMyInfo()
		this.updateActor()
	}

	refreshRewardInfo(){
		if(this.disposeList == null){
			return
		}
		let disposeList = this.disposeList
		this.mElemList["cur_pro"].text = (this.curIndex + 1) + "/" + (size_t(disposeList))
		let curIndex = this.curIndex
		if(curIndex<0 || curIndex > size_t(disposeList)){
			return
		}
		let curInfo = disposeList[curIndex]
		for(let i = 0;i<4;i++){
			let info = curInfo[i]
			if(info){
				this.mElemList["item_group_"+i].visible = true
				let prize = info.prize
				let iindex = info.index
				let playerInfo = info.playerInfo

				let nameRd = this.mElemList["name_rd"+i]
				// this.mElemList["score"+i].text = ""
				// AddRdContent(nameRd, "", "ht_20_cc_stroke", "lime")	
				if(playerInfo){
					AddRdContent(nameRd, playerInfo.name, "ht_20_cc_stroke", "lime")
					this.mElemList["score"+i].text = String.format(Localize_cns("WULIN_TXT19"),playerInfo.score)
				}else{
					AddRdContent(nameRd, Localize_cns("WULIN_TXT25"), "ht_20_cc_stroke", "lime")	
					this.mElemList["score"+i].text = Localize_cns("WULIN_TXT25")
				}
				let itemList = AnalyPrizeFormat(prize)
				for(let k = 0;k<4;k++){
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

				let rankRd = this.mElemList["rank_rd"+i]
				if(info.index!=51){
					AddRdContent(rankRd, String.format(Localize_cns("WULIN_TXT18"),info.index), "ht_20_cc", "white")
				}else{
					AddRdContent(rankRd, String.format(Localize_cns("WULIN_TXT26"),info.index), "ht_20_cc", "white")
				}
			}else{
				this.mElemList["item_group_"+i].visible = false
			}
		}
	}

	refreshMyInfo(){
		let myInfo = this.rankInfo.myInfo
		let score = myInfo.score || 0
		let rank = myInfo.rank || 0
		let rd =  this.mElemList["my_rank"]
		AddRdContent(rd, String.format(Localize_cns("WULIN_TXT23"),rank,score), "ht_20_cc_stroke", "white")
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
		if(this.curIndex<= 0){
			return
		}
		this.curIndex = this.curIndex - 1
		this.refreshRewardInfo()
	}

	onRightClick(){
		if(this.curIndex>=12){
			return
		}
		this.curIndex = this.curIndex + 1
		this.refreshRewardInfo()
	}

}
