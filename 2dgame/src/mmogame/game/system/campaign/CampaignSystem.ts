/*
作者:
    liuziming
	
创建时间：
   2014.6.17(周二)

意图：
   战役相关的数据处理（关卡、竞技场）

公共接口：

*/
//PET_COUNT = 18
//let CAMPAIGN_BEGIN_ID = 1

class CampaignSystem extends BaseSystem {

	recordList
	campaignId
	mine

	isAuto
	videoInfo

	singlePassInfo
	firstPassInfo
	//serverPassInfo

	public initObj(...args: any[]): void {

	}

	destory() {

	}

	//准备资源，把自己的workunit加载队列里
	prepareResource(workQueue) {
		GameConfig.initCampaignSystemCsv(workQueue);
		// workQueue.addWorkUnit(CallbackWorkUnit.newObj(this.initChapterList, this));
	}


	onClear() {

	}

	sendCampaignBattle(campaignId) {
		RpcProxy.call("C2G_CampaginFight", campaignId, 0)
	}

	//////////////////////////////////////////////////////////////////////////////-
	setCampaignInfo(campaignId, mine) {
		let oldCampaign = this.campaignId
		this.campaignId = campaignId
		this.mine = mine

		//通关胜利
		if (oldCampaign < this.campaignId) {
			if (IsFightState()) {
				FightSystem.getInstance().addEndFightHandler(function () {
					FireEvent(EventDefine.CAMPAIGN_PASS, null)
				}, this)
			}
		}
	}

	setVideoInfo(videoInfo) {
		this.videoInfo = videoInfo
	}

	getVideoInfo() {
		return this.videoInfo
	}

	initFinishCampaignList(recordList) {
		this.recordList = recordList
	}

	////////////////////////////////////////////////
	isCampaignPass(campId) {
		return campId < this.campaignId
	}

	getCampaignName(campId) {
		if (GameConfig.CampaignConfig[campId]) {
			return GameConfig.CampaignConfig[campId].name
		}
		return ""
	}

	getFinishedCampaignList() {
		return this.recordList
	}

	getCurOpenCampaign() {
		return this.campaignId
	}

	getCurMine() {
		return this.mine
	}

	getNeedMine(campId?) {
		if (GameConfig.CampaignConfig[campId]) {
			return GameConfig.CampaignConfig[campId].autoFightNum
		}
		if (GameConfig.CampaignConfig[this.campaignId]) {
			return GameConfig.CampaignConfig[this.campaignId].autoFightNum
		}
		return 1
	}

	getCampaignPrize(campId) {
		if (GameConfig.CampaignConfig[campId]) {
			return GameConfig.CampaignConfig[campId].basePrize
		}
		return {}
	}

	getCampaignGift(campId) {
		if (GameConfig.CampaignConfig[campId]) {
			return GameConfig.CampaignConfig[campId].gift
		}
		return {}
	}

	//是否可以挑战boss
	bossCampaitnBattle() {
		if (GameConfig.CampaignConfig[this.campaignId]) {
			let needMine = GameConfig.CampaignConfig[this.campaignId].autoFightNum
			// let fightSystem: FightSystem = FightSystem.getInstance()
			// return ((this.mine >= needMine) && !fightSystem.isFight())
			return (this.mine >= needMine)
		} else {
			return false
		}
	}

	//当前可以挑战的关卡应该在哪个地图
	shouldGotoMapId() {
		if (GameConfig.CampaignConfig[this.campaignId]) {
			let mapId = GameConfig.CampaignConfig[this.campaignId].mapId
			return mapId
		} else {
			return 50001
		}
	}

	setAutoSelect(isAuto) {
		this.isAuto = isAuto
		let param = this.isAuto ? 1 : 0
		RpcProxy.call("C2G_CampaginSetAuto", param)
	}

	getAutoSelect() {
		return this.isAuto
	}

	////////////////////////////////////////////////////////////////////
	//个人首通
	getSinglePassConfig() {
		let list = []
		for (let i in GameConfig.CampaignSingleConfig) {
			table_insert(list, GameConfig.CampaignSingleConfig[i])
		}

		table_sort(list, function (a, b) {
			return a.campaignId - b.campaignId
		})

		return list
	}

	//个人限时首通记录
	updateLimitPassData(info) {
		this.singlePassInfo = info
	}

	getLimitPassData(info) {
		return this.singlePassInfo
	}

    //个人首通记录
	updateFirstPassData(info) {
		this.firstPassInfo = info
	}

	getFirstPassData() {
		return this.firstPassInfo
	}


	// //全服首通
	// getServerPassConfig() {
	// 	let list = []
	// 	for (let i in GameConfig.CampaignServerConfig) {
	// 		table_insert(list, GameConfig.CampaignServerConfig[i])
	// 	}

	// 	table_sort(list, function (a, b) {
	// 		return a.campaignId - b.campaignId
	// 	})

	// 	return list
	// }

	// //全服首通记录
	// updateServerPassData(info) {
	// 	this.serverPassInfo = info
	// }

	// getServerPassData() {
	// 	return this.serverPassInfo
	// }
}