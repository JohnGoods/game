/*
作者:
    yangguiming
	
创建时间：
   2017.02.24(周五)

意图：
   商店显示的物品
公共接口：
   
*/
// ImportType(ConfigZhenYing)

let ShopScoreType: any = {
	SHILIAN: 1, //试炼场
	JINGJI: 2, //竞技场
	// DOUJI: 3, //斗技
	JUNTUAN: 7, //军团商店
	TIANTI: 13, //天梯
	//ZHONGSHEN : ConfigZhenYing.npcItemEntry, //众神之战
	XINSHOU : 4,  //新手包
	CHAOZHI : 5,  //超值大礼包
	SLSHENMI : 6,  //试练场神秘商人
}


let ShopDealType: any = {
	JINGYAN: 1,  //经验
	SHENSHI: 2,  //神石
	DAOJU: 3,		//道具
	JINENG: 4,		//技能书
}


class ShopItem extends TClass {

	entryId: number
	count: number

	priceType: number
	price: number

	limitCount: number
	limitWeekCount: number

	buyDescribe: string
	data: any;
	refPropertyInfo: any;

	public initObj(...args: any[]): void {
		this.entryId = args[0]  //物品ID
		this.count = args[1]		//剩余数量

		this.priceType = args[2] //价格类型   opItemUnit
		this.price = args[3]		//价格


		this.limitCount = -1		//每天限购
		this.limitWeekCount = -1		//每周限购

		this.buyDescribe = ""
		this.data = null

		this.refPropertyInfo = ItemSystem.getInstance().getItemTemplateInfo(this.entryId) //获得引用数据
	}

	destory() {

	}

	setLimitCount(limitCount, weekLimitCount) {
		let resultLimit = -1
		let resultWeekLimit = -1

		if (limitCount && limitCount > 0) {
			resultLimit = limitCount
		}

		if (weekLimitCount && weekLimitCount > 0) {
			resultWeekLimit = weekLimitCount
		}

		this.limitCount = resultLimit		//每天限购
		this.limitWeekCount = resultWeekLimit		//每周限购
	}


	setBuyDescrib(str) {
		this.buyDescribe = str
	}

	//自定义信息
	setData(data) {
		this.data = data
	}

	getRefProperty(key) {
		if (this.refPropertyInfo == null) {
			return null
		}
		return this.refPropertyInfo[key]
	}

}