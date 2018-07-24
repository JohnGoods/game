//开服活动
class Activity_OpenServer extends ActivityBase {
	relatetionActIndex: any;
	
	public initObj(...args: any[]): void {
		this.relatetionActIndex = [
										PayActivityIndex.NEW_SERVER_STAGE_LEVEL_UP,									//天仙进阶
										PayActivityIndex.NEW_SERVER_STAGE_UP_RANK,									//进阶排行
										PayActivityIndex.NEW_SERVER_INST_ZONES,										//熊猫副本（开服副本）
										PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT,									//折扣商店
										PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE,								//累积充值
										PayActivityIndex.NEW_SERVER_MISSION,										//龙宫星级
										PayActivityIndex.NEW_SERVER_ALL_BUY,										//首充团购
										PayActivityIndex.NEW_SERVER_ALL_STAGE_UP,									//全民进阶
										PayActivityIndex.NEW_SERVER_ALL_LEVEL_UP,									//全民冲级
		]
		this.onClear()
	}

	destory() {
		
	}

	onPrepareResource() {
		
	}

	onClear() {
		
	}

	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	getOpenServerOpenActivity() {
		let list = []
		let openList = ActivitySystem.getInstance().getOperateActivityOpenList()
		for (let i = 0; i < openList.length; i++) {
			let index = openList[i]
			if (table_isExist(this.relatetionActIndex, index) == true) {
				table_insert(list, index)
			}
		}
		
		return list
	}

	getActivityRadioIcon(actIndex, defaultIcon?) {
		let iconList = {
		    [PayActivityIndex.NEW_SERVER_STAGE_LEVEL_UP]: 		["kfhd_Bt10", "kfhd_Bt01", "kfhd_Bt12", "kfhd_Bt14", "kfhd_Bt16", "kfhd_Bt18", "kfhd_Bt20", "kfhd_Bt22", "kfhd_Bt24", "kfhd_Bt25", "kfhd_Bt26", "kfhd_Bt27"],
																//坐骑 天仙 神兵 翅膀 法阵 仙位 通灵 兽魂 天女 仙器 花辇 灵气
            [PayActivityIndex.NEW_SERVER_STAGE_UP_RANK]: 		["kfhd_Bt11", "kfhd_Bt02", "kfhd_Bt13", "kfhd_Bt15", "kfhd_Bt17", "kfhd_Bt19", "kfhd_Bt21", "kfhd_Bt23"],      //进阶排行
																//坐骑 天仙 神兵 翅膀 法阵 仙位 通灵 兽魂
            [PayActivityIndex.NEW_SERVER_INST_ZONES]: 			["kfhd_Bt03"],      //熊猫副本（开服副本）
            [PayActivityIndex.NEW_SERVER_SHOP_DISCOUNT]: 		["kfhd_Bt04"],      //折扣商店
            [PayActivityIndex.NEW_SERVER_MIXACCU_RECHARGE]: 	["kfhd_Bt05"],    	//累积充值
            [PayActivityIndex.NEW_SERVER_MISSION]: 				["kfhd_Bt29", "kfhd_Bt06", "kfhd_Bt30", "kfhd_Bt31", "kfhd_Bt32", "kfhd_Bt06", "kfhd_Bt33", "kfhd_Bt34"],
														        //关卡 秘境宝藏 竞技场 皇城天塔 材料副本 秘境星级 三界试炼 仙君
            [PayActivityIndex.NEW_SERVER_ALL_BUY]: 				["kfhd_Bt07"],      //首充团购
            [PayActivityIndex.NEW_SERVER_ALL_STAGE_UP]: 		["kfhd_Bt08"],      //全民进阶
            [PayActivityIndex.NEW_SERVER_ALL_LEVEL_UP]: 		["kfhd_Bt09"],      //全民冲级
		}

		let dayIndex = GetServerDay()
		let info = ActivitySystem.getInstance().getOperateActivityInfo(actIndex)
		if (info != null && size_t(info) != 0) {
			//通过info活动信息里获取当前活动的日期索引
			if (actIndex == PayActivityIndex.NEW_SERVER_STAGE_LEVEL_UP) {					//[哪天的记录， {[奖励档次]=是否领取}]
				dayIndex = info[0]
			} else if (actIndex == PayActivityIndex.NEW_SERVER_STAGE_UP_RANK) {				//[哪天的记录， {[奖励档次]=是否领取}]
				dayIndex = info[0]
			} else if (actIndex == PayActivityIndex.NEW_SERVER_MISSION) {					//[哪天的记录， {[奖励档次]=是否领取}]
				dayIndex = info[0]
			} else {
				dayIndex = 1
			}
		}

		if (iconList[actIndex][dayIndex - 1]) {
			return iconList[actIndex][dayIndex - 1]
		} else if (defaultIcon) {
			return defaultIcon
		} else {
			return iconList[actIndex][0]
		}
	}
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////

	

}