/*
作者:
    yangguiming
	
创建时间：
   2013.6.20(周四)

意图：
   物品系统消息

公共接口：
   
*/


module MessageLogic{

// export class Message_C2G_ITEM_USE extends MessageBase{
// id
// count
// public initObj(...args:any[]):void {
// 	this.id = 0
// 	this.count = 0
// }

// pack( writer){
// 	writer.writeUInt(this.id)
// 	writer.writeUInt(this.count)
// }

// unpack( reader){

// }

// }

// //物品列表
// //////////////////////////////////////////////////////////////////-
// // export class Message_G2C_ITEM_LIST extends MessageBase{
// // 	ItemList:ItemInfo[]

// // public initObj(...args:any[]):void {
// // 	this.ItemList = null
// // 	//this.fireEvent=true
// // 	//this.isdump = true 
// // }

// // pack( writer){
	
// // }

// // unpack( reader){
// // 	this.ItemList = []
	
// // 	let num = reader.readUInt()
// // 	for(let i = 1; i <=  num;i++){
// // 		let info = ItemInfo.newObj()
// // 		info.read(reader)
// // 		table_insert(this.ItemList, info)
// // 	}
// // }
// //}

// //物品更新
// //////////////////////////////////////////////////////////////////-


// // export class Message_G2C_ITEM_UPDATE extends MessageBase{
// // 	ItemList:ItemInfo[]
// // public initObj(...args:any[]):void {
// // 	this.ItemList = []
// // 	//this.fireEvent=true 
// // }

// // pack( writer){
	
// // }

// // unpack( reader){
// // 	this.ItemList = []
// // 	let num = reader.readUShort()
// // 	for(let i = 1; i <=  num;i++){
// // 		let info = ItemInfo.newObj()
// // 		info.read(reader)
// // 		table_insert(this.ItemList, info)
// // 	}
// // }

// // }


// //伙伴进化
// export class Message_C2G_PET_DEVELOP_QUALITY extends MessageBase{
// id
// entryid
// public initObj(...args:any[]):void {
// 	this.id = 0
// 	this.entryid = 0
// }

// pack( writer){
// 	TLog.Debug("this.id..............." + this.id)
// 	TLog.Debug("this.entryid..............."+ this.entryid)
// 	writer.writeUInt(this.id)
// 	writer.writeUShort(this.entryid)
// }

// unpack( reader){

// }


// //伙伴进化返回
// }

// export class Message_G2C_PET_DEVELOP_QUALITY extends MessageBase{
// petentryid
// level
// public initObj(...args:any[]):void {
// 	this.petentryid = 0
// 	this.level = 0
// }

// pack( writer){

// }

// unpack( reader){
// 	this.petentryid = reader.readUShort()	
// 	this.level = 	reader.readUChar()
// }

// }

// //物品丢弃回应
// //////////////////////////////////////////////////////////////////-
// // export class Message_G2C_ITEM_DROP extends MessageBase{
// // 	id
// // public initObj(...args:any[]):void {
// // 	this.id = 0
// // }

// // pack( writer){
	
// // }

// // unpack( reader){
// // 	this.id = reader.readUInt()
// // }




// // }

// ////////////////////////////////////////////////////////////////////////////////////-
// // 查看商品列表
// export class Message_C2G_ITEM_TRADE_LIST extends MessageBase{
// 	first_type
// public initObj(...args:any[]):void {
// 	this.first_type = 0
// 	//this.second_type = 0
// }

// pack( writer){
// 	writer.writeUInt(this.first_type)
// 	//writer.writeUInt(this.second_type)
// }

// unpack( reader){

// }


// }

// // 获取商品列表
// export class Message_G2C_ITEM_TRADE_LIST extends MessageBase{
// 	first_type
// 	second_type
// 	itemList:any[]
// public initObj(...args:any[]):void {
// 	this.first_type = 0
// 	this.second_type = 0
// 	this.itemList = []
// }

// pack( writer){
	
// }

// unpack( reader){
// 	this.first_type = reader.readUInt()
// 	//this.second_type = reader.readUInt()
// 	let count = reader.readUInt()
// 	this.itemList = []
// 	for(let i = 1; i <=  count;i++){
// 		let item:any = {}
// 		item.entryId = reader.readUInt()     //物品ID
// 		item.sell_price =	table_load(reader.readString())	 //卖出价格				//服务器买
// 		item.buy_price = table_load(reader.readString())	 //买进价格					//服务器卖
		
// 		item.sell_count = reader.readInt()  //我卖数量					//服务器收购
// 		item.sell_max = reader.readInt()	 	 //我卖上限					//服务器收购总数
		
// 		item.buy_max = reader.readInt()	 		//我可买总数量				//服务器出售总数
// 		let buy_count  = reader.readInt()	   //我可买数量 		//服务器出售数量
// 		item.buy_count = item.buy_max - buy_count
		
		
// 		JsUtil.arrayInstert(this.itemList, item)
// 	}
// }


// ////交易所限购
// }



// //商城单个物品信息
// export class Message_C2G_ITEM_TRADE_ITEM_INFO extends MessageBase{
// entryId
// public initObj(...args:any[]):void {
// 	this.entryId = 0
// }

// pack( writer){
// 	writer.writeUInt(this.entryId)
// }

// unpack( reader){

// }

// // 获取商品列表
// }

// export class Message_G2C_ITEM_TRADE_ITEM_INFO extends MessageBase{
// 	dealItemInfo
// 	first_type
// public initObj(...args:any[]):void {
// 	this.first_type = 0
// 	this.dealItemInfo = {}
// }

// pack( writer){
	
// }

// unpack( reader){
// 	this.first_type = reader.readUInt()
// 	let item:any = {}
// 	item.entryId = reader.readUInt()     //物品ID
// 	item.sell_price =	table_load(reader.readString())	 //卖出价格				//服务器买
// 	item.buy_price = table_load(reader.readString())	 //买进价格					//服务器卖
// 	item.sell_count = reader.readInt()  //我卖数量					//服务器收购
// 	item.sell_max = reader.readInt()	 	 //我卖上限					//服务器收购总数
// 	item.buy_max = reader.readInt()	 		//我可买总数量				//服务器出售总数
// 	let buy_count  = reader.readInt()	   //我可买数量 		//服务器出售数量
// 	item.buy_count = item.buy_max - buy_count
	
// 	this.dealItemInfo = item
// }

// }

// export class Message_G2C_ITEM_TRADE_LIMIT extends MessageBase{
// 	limitList
// public initObj(...args:any[]):void {
// 		this.limitList = {}
// }

// pack( writer){
		
// }

// unpack( reader){
// 	this.limitList = {}
// 	this.limitList = table_load(reader.readString())
	
// }


// //积分商城列表
// }

// export class Message_C2G_ITEM_SELL_LIST extends MessageBase{
// static NPC_TYPE = 1
// static PLAYER_TYPE = 2

// seller
// entryId

// public initObj(...args:any[]):void {
// 	this.seller = Message_C2G_ITEM_SELL_LIST.NPC_TYPE	// 0代表玩家，1代表NPC
// 	this.entryId = 0   // 玩家或者NPC的ID
// }

// pack( writer){
// 	 writer.writeUChar(this.seller)
// 	 writer.writeUInt(this.entryId)
// }

// unpack( reader){

// }

// // 商店物品列表更新
// }

// // export class Message_G2C_ITEM_SELL_LIST extends MessageBase{
// // 	itemList:ItemInfo[]
// // 	shopIndex
// // public initObj(...args:any[]):void {
// // 	this.itemList = []
// // 	this.shopIndex = 0
// // }

// // pack( writer){

// // }

// // unpack( reader){
// // 	this.itemList = []
// //   this.shopIndex = reader.readUInt()   
// //   let number = reader.readUInt()
// //   for(let i = 1; i <= number;i++){
// //     let info = ItemInfo.newObj()
// // 		info.read(reader)
// // 		let logicItem = Item.newObj(info)
// //     table_insert(this.itemList, logicItem)   
// //   }   
// // }
// // }
// // 购买物品(积分商城使用)


// export class Message_C2G_ITEM_BUY extends MessageBase{
// 	npc_id
// 	id
// 	count
// 	priceType
// public initObj(...args:any[]):void {
// 	this.npc_id = 0
// 	this.id = 0
// 	this.count = 0
// 	this.priceType = 0
// }

// pack( writer){
// 	 writer.writeUInt(this.npc_id)
// 	 writer.writeUInt(this.id)
// 	 writer.writeUInt(this.count)
// 	 writer.writeUInt(this.priceType)
// }

// unpack( reader){

// }



// }

// // 晶石购买物品
// export class Message_C2G_ITEM_TRADE_SALE extends MessageBase{
// id
// count
// public initObj(...args:any[]):void {
// 	this.id = 0
// 	this.count=0
// }

// pack( writer){
// 	writer.writeUInt(this.id)
// 	writer.writeUInt(this.count)
// }

// unpack( reader){

// }


// }

// ////////////////////////////////////////////////////////////////////////////////////-
// ////使用王者英魂
// export class Message_C2G_FETE_PLAYER extends MessageBase{
// 	itemList
// public initObj(...args:any[]):void {
// 		this.itemList = {}
// }

// pack( writer){
// 		writer.writeString(table_save(this.itemList))
// }

// unpack( reader){
	
// }


// }

// ////晶石兑换金币或者体力剩余次数
// export class Message_C2G_ACTIVE_DUIHUAN_SELECT extends MessageBase{
// 	index
// public initObj(...args:any[]):void {
// 		this.index = null
// }

// pack( writer){
// 		writer.writeUInt(this.index)
// }

// unpack( reader){
	
// }

// }

// export class Message_G2C_ACTIVE_DUIHUAN_SELECT extends MessageBase{
// 	count
// 	cost
// public initObj(...args:any[]):void {
// 		this.count = null
// 		this.cost = null
// }

// pack( writer){
	
// }

// unpack( reader){
// 	this.count = reader.readUInt()
// 	this.cost = reader.readUInt()
// }

// }

// export class Message_C2G_ACTIVE_DUIHUAN extends MessageBase{
// 	index
// public initObj(...args:any[]):void {
// 		this.index = null
// }

// pack( writer){
// 		writer.writeUInt(this.index)
// }

// unpack( reader){

// }


// }
// ////////////////////////////////////////////////////////////////////////////////////////////////////////-
// //溶解物品
// export class Message_C2G_ITEM_EQUIP_SPLIT extends MessageBase{
// list
// public initObj(...args:any[]):void {
// 			this.list = {}
// }

// pack( writer){
// 		writer.writeString(table_save(this.list))
// }

// unpack( reader){

// }


// }

// ////////////////////////-装备重铸//////////////////
// export class Message_C2G_EQUIP_CAST extends MessageBase{
// 	itemId
// public initObj(...args:any[]):void {
// 		this.itemId = null
// }

// pack( writer){
// 		writer.writeUInt(this.itemId)
// }

// unpack( reader){
	
// }


// }

// //装备重铸选择
// export class Message_C2G_EQUIP_CAST_CHOOSE extends MessageBase{
// 	itemId
// public initObj(...args:any[]):void {
// 	this.itemId = null
// }

// pack( writer){
// 	writer.writeUInt(this.itemId)
// }

// unpack( reader){

// }

// //装备重铸取消
// }

// export class Message_C2G_EQUIP_CAST_CANCEL extends MessageBase{
// 	itemId
// public initObj(...args:any[]):void {
// 	this.itemId = null
// }

// pack( writer){
// 	writer.writeUInt(this.itemId)
// }

// unpack( reader){

// }

// }

// //初始化物品库
// export class Message_C2G_ITEM_ENTER_LOTTERY extends MessageBase{

// public initObj(...args:any[]):void {
		
// }

// pack( writer){
		
// }

// unpack( reader){

// }


// }

// //初始化结果
// export class Message_G2C_ITEM_ENTER_LOTTERY extends MessageBase{

// public initObj(...args:any[]):void {
		
// }

// pack( writer){
		
// }

// unpack(  reader){

// }

// }


// //获取物品库
// export class Message_G2C_ITEM_LOTTERY_LIB extends MessageBase{
// 	ItemList
// public initObj(...args:any[]):void {
// 		this.ItemList = null
// }

// pack( writer){
	
// }

// unpack( reader){
//   	this.ItemList = {}
// 	  this.ItemList = table_load(reader.readString())
// }

// //刷新奖励库
// }

// export class Message_C2G_ITEM_LOTTERY_REFRESH extends MessageBase{

// public initObj(...args:any[]):void {
		
// }

// pack( writer){
		
// }

// unpack(  reader){

// }


// }
// //发送抽奖 一次和十次
// export class Message_C2G_ITEM_LOTTERY extends MessageBase{
// 	index
// public initObj(...args:any[]):void {
// 		this.index = null
// }

// pack( writer){
// 	  writer.writeUInt(this.index)
// }

// unpack( reader){
	
// }

// //抽奖结果
// }

// // export class Message_G2C_ITEM_LOTTERY extends MessageBase{
// // 	num
// // 	ItemList:ItemInfo[]
// // public initObj(...args:any[]):void {
// // 	  this.num = null
// // 		this.ItemList = null
// // }

// // pack( writer){
	
// // }

// // unpack( reader){
// // 	this.ItemList = []
	
// // 	this.num = reader.readUInt()
// // 	for(let i = 1; i <=  this.num;i++){
// // 		let pos = reader.readUInt()
// // 		let info = ItemInfo.newObj()
// // 		info.lottoPos = pos
// // 		info.read(reader)
// // 		JsUtil.arrayInstert(this.ItemList,info)
// // 	}
// // }
// //}

}