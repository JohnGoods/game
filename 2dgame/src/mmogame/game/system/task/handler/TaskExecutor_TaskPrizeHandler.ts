// /*
// 作者:
//     yangguiming
	
// 创建时间：
//    2013.7.02(周二)

// 意图：
//    任务奖励

// 公共接口：
   
// */


// let prize_handle:any = {}


// //function giveMoney(taskId, param, buf){//现金
// //TLog.Debug("giveMoney ", taskId, param)
// //	let XML = TaskTraceTips[taskField.FIELD_PRIZE_MONEY].XMLContent
// //	if(param ){
// //		buf.xml = buf.xml +String.format(XML, param)
// //	}	
// //}
// //prize_handle[taskField.FIELD_PRIZE_MONEY] = giveMoney
// //
// //
// //function giveBindCurrency(taskId, param, buf){//现金
// //TLog.Debug("giveBindCurrency ", taskId, param)
// //	let XML = TaskTraceTips[taskField.FIELD_PRIZE_BINDCURRENCY].XMLContent
// //	if(param ){
// //		buf.xml = buf.xml +String.format(XML, param)
// //	}	
// //}
// //prize_handle[taskField.FIELD_PRIZE_BINDCURRENCY] = giveBindCurrency
// //
// //function giveBindMoney(taskId, param, buf){//储备金
// //	TLog.Debug("giveBindMoney ", taskId, param)
// //	let XML = TaskTraceTips[taskField.FIELD_PRIZE_BINDMONEY].XMLContent
// //	if(param ){
// //		buf.xml = buf.xml +String.format(XML, param)
// //	}	
// //}
// //prize_handle[taskField.FIELD_PRIZE_BINDMONEY] = giveBindMoney
// //
// //function giveExp(taskId, param, buf){//人物经验
// //	TLog.Debug("giveExp ", taskId, param)
// //	let XML = TaskTraceTips[taskField.FIELD_PRIZE_EXP].XMLContent
// //	if(param ){
// //		buf.xml = buf.xml +String.format(XML, param)
// //	}	
// //}
// //prize_handle[taskField.FIELD_PRIZE_EXP] = giveExp
// //
// //
// //function givePetExp(taskId, param, buf){//宠物经验
// //	TLog.Debug("givePetExp ", taskId, param)
// //	let XML = TaskTraceTips[taskField.FIELD_PRIZE_PETEXP].XMLContent
// //	if(param ){
// //		buf.xml = buf.xml +String.format(XML, param)
// //	}	
// //}
// //prize_handle[taskField.FIELD_PRIZE_PETEXP] = givePetExp


// //function givePractice(taskId, param, buf){//奖励修为
// //	TLog.Debug("givePetExp ", taskId, param, taskField.FIELD_PRIZE_PRACTICE)
// //	let XML = TaskTraceTips[taskField.FIELD_PRIZE_PRACTICE].XMLContent
// //	if(param ){
// //		buf.xml = buf.xml +String.format(XML, param)
// //	}	
// //}
// //prize_handle[taskField.FIELD_PRIZE_PRACTICE] = givePractice


// //function giveItem(taskId, param, buf){//得到物品
// //	//TLog.Debug("giveItem ", taskId, param)
// //	let itemCountPetRow = 6
// //	
// //	let spaceX = 0
// //	let index = 1
// //	for(let itemId in param){
// //			let count = param[itemId]
// //	
// //		let itemData = ItemSystem.getInstance().getItemTemplateInfo(itemId)
// //		let img = "error"
// //		if(itemData ){ img = "item_" +itemData.image }
// //		 //TLog.Debug("211111111111111111111111", count)
// //		//let T = String.format("<hor_blank value=%d/><image name=%s value=%d></image><hor_blank value=10/><text style=normal>X  %.2d</text>", spaceX, img, itemId, count)
// //		let T = String.format("<hor_blank value=%d/><image name=%s value=%d />%d</image>", spaceX, img, itemId, 2)//count)
// //		//TLog.Debug(index, itemCountPetRow, Math.fmod(index, itemCountPetRow))
// //		spaceX = 1
// //		if(Math.fmod(index, itemCountPetRow) == 0 ){
// //			T = T +"<br /><ver_blank value=3/>"
// //			spaceX = 0
// //		}
// //		
// //		buf.xml = buf.xml +T
// //		index = index + 1
// //	}
// //	buf.xml = buf.xml .."<br />"
// //	//TLog.Debug(buf.xml)
// //}
// //prize_handle[taskField.FIELD_PRIZE_ITEM] = giveItem
// //
// //
// //function giveBindItem(taskId, param, buf){//得到物品
// //	TLog.Debug("giveItem ", taskId, param)
// //	giveItem(taskId, param, buf)
// //}
// //prize_handle[taskField.FIELD_PRIZE_BINDITEM] = giveBindItem


// _executeTracePrize( taskId, listener){
// 	let taskInfo = TaskSystem.getInstance().getTask(taskId):getPropertyInfo()
// 	if(! taskInfo ){ return }
// 	if(! taskInfo.prize ){ return  }//没有奖励
	
// 	////先经验，再储备再现银
// 	//let buf:any = {}
// 	//buf.xml = ""
// 	//
// 	//let markT:any = {}
// 	//if(taskInfo.prize[taskField.FIELD_PRIZE_EXP] ){ // 经验
// 	//	let param = taskInfo.prize[taskField.FIELD_PRIZE_EXP]
// 	//	prize_handle[taskField.FIELD_PRIZE_EXP](taskId, param, buf)
// 	//	markT[taskField.FIELD_PRIZE_EXP] = true
// 	//}
// 	//
// 	//if(taskInfo.prize[taskField.FIELD_PRIZE_PETEXP] ){ //宠物经验
// 	//	let param = taskInfo.prize[taskField.FIELD_PRIZE_PETEXP]
// 	//	prize_handle[taskField.FIELD_PRIZE_PETEXP](taskId, param, buf)
// 	//	markT[taskField.FIELD_PRIZE_PETEXP] = true
// 	//}
// 	//
// 	//if(buf.xml != "" ){
// 	//	buf.xml = buf.xml +"br.length    space.lengthbr.length"
// 	//}
// 	//
// 	//if(taskInfo.prize[taskField.FIELD_PRIZE_BINDMONEY] ){ // 储备
// 	//	let param = taskInfo.prize[taskField.FIELD_PRIZE_BINDMONEY]
// 	//	prize_handle[taskField.FIELD_PRIZE_BINDMONEY](taskId, param, buf)
// 	//	markT[taskField.FIELD_PRIZE_BINDMONEY] = true
// 	//}
// 	//
// 	//if(taskInfo.prize[taskField.FIELD_PRIZE_MONEY] ){ // 现银
// 	//	let param = taskInfo.prize[taskField.FIELD_PRIZE_MONEY]
// 	//	prize_handle[taskField.FIELD_PRIZE_MONEY](taskId, param, buf)
// 	//	markT[taskField.FIELD_PRIZE_MONEY] = true
// 	//}
// 	//
// 	//if(buf.xml != "" ){
// 	//	buf.xml = buf.xml +"br.length     space.lengthbr.length"
// 	//}
// 	//
// 	//if(taskInfo.prize[taskField.FIELD_PRIZE_PRACTICE] ){ //奖励修为
// 	//	let param = taskInfo.prize[taskField.FIELD_PRIZE_PRACTICE]
// 	//	prize_handle[taskField.FIELD_PRIZE_PRACTICE](taskId, param, buf)
// 	//	markT[taskField.FIELD_PRIZE_PRACTICE] = true
// 	//}
// 	//
// 	//if(taskInfo.prize[taskField.FIELD_PRIZE_BINDCURRENCY] ){ // 现银
// 	//	let param = taskInfo.prize[taskField.FIELD_PRIZE_BINDCURRENCY]
// 	//	prize_handle[taskField.FIELD_PRIZE_BINDCURRENCY](taskId, param, buf)
// 	//	markT[taskField.FIELD_PRIZE_BINDCURRENCY] = true
// 	//}
// 	//listener.func(listener.this_index, buf, listener.userData)
// 	//
// 	//buf = {}
// 	//buf.xml = ""
// 	//buf.isXml = true
// 	//
// 	//for(let deal in taskInfo.prize){
// 	//		let v = taskInfo.prize[deal]
// 	//
// 	//	if(prize_handle[deal] && ! markT[deal] ){
// 	//		prize_handle[deal](taskId, v, buf)
// 	//	}
// 	//}
// 	//
	
// 	//物品、金币、经验
// 	let buf:any = {}
// 	buf.xml = ""
// 	buf.isXml = true
// 	let str = ""
// 	if(taskInfo.prize["ITEM"] || taskInfo.prize["BINDITEM"] ){
// 		let param = taskInfo.prize["ITEM"] || taskInfo.prize["BINDITEM"]
// 		//只显示第一个物品
// 		let info = param[1]
// 		let entryId = info[1]
// 		let num = info[2]
		
// 		buf.xml = "ublack_ul.length|6;" +entryId +"|" +ItemSystem.getInstance().getItemName(entryId)
// 		if(num > 1 ){
// 			buf.xml = buf.xml +"ublack.length x" +num
// 		}
		
// 		buf.xml = buf.xml +"space.length"
// 	}
	
// 	if(taskInfo.prize["FUNDS"] ){
// 		let param = taskInfo.prize["FUNDS"]
// 		buf.xml = buf.xml +"PRIZE_JINBI.lengthublack.length" +param +"space.length"
// 	}
	
// 	if(taskInfo.prize["PLREXP"] ){
// 		let param = taskInfo.prize["PLREXP"]
// 		buf.xml = buf.xml +"PRIZE_JINGYAN.lengthublack.length" +param
// 	}
// 	listener.func(listener.this_index, buf, listener.userData)
// }