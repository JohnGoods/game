/*
作者:
    yangguiming
	
创建时间：
   2013.6.20(周四)

意图：
   物品,分为 【网络数据Property】 和 【引用数据RefProperty】

公共接口：
   
*/
class Item extends TClass{
	propertyInfo:any;
	entryId:number;
	id:number;
	refPropertyInfo:any;
	privateFlag:boolean;

public initObj(...args:any[]):void {
	this.propertyInfo = args[0]
	if(this.propertyInfo ==null ){
		return 
	}
	this.entryId = this.propertyInfo.entry
	this.id 	 = this.propertyInfo.id
	this.refPropertyInfo = ItemSystem.getInstance().getItemTemplateInfo(this.entryId) //获得引用数据
	
	this.privateFlag = false
}

destory( ){
	
}

getId(){
	return this.id
}

getEntryId(){
	return this.entryId
}

initWithRef( refInfo){
	this.propertyInfo = {}
	this.entryId = refInfo.ItemEntry
	this.refPropertyInfo = refInfo
	this.id 	 = -1
}

//updatePropertyInfo( info){ //info会被修改，更新属性
//	let old = this.propertyInfo
//	
//	table_union(info, old)	//合并信息
//	
//	this.propertyInfo = info
//	return old
//}


getPropertyInfo(){
	return this.propertyInfo
}

getProperty( key){
	if(this.propertyInfo ==null ){
		return null
	}

	return this.propertyInfo[key]
}


getRefPropertyInfo(){
	return this.refPropertyInfo
}


getRefProperty( key){
	if(this.refPropertyInfo == null ){ 
		return null 
	}
	return this.refPropertyInfo[key]
}


//得到物品的预览
// getEquipPreviewInfo(enhanceLevel?,starLevel?){
// 	let info:any = {}
// 	//let str1,str2 = GetNoEquipAttributeRangeByKeywork(this.entryId,enhanceLevel || 1,starLevel)
	
// 	//本身有基础值和附加的预览
// 	if(this.id > 0 ){
// 		let [fixedValueList, appendValueList] = GetPreviewEquipAttributeByItem(this, enhanceLevel,starLevel)	
		
// 		//基础属性文本列表
// 		let previewFixedValue:any = {}
// 		for(let _ = 0; _ < fixedValueList.length; _++){
// 			let v = fixedValueList[_]
	
// 			previewFixedValue[v.index]  = v.value
// 		}
// 		let info = this.getFixedValueInfo(previewFixedValue)
// 		let showStrList = info.fixedValueStrList
// 		//let showStrList:any = {}
// 		//for(let _ in fixedValueList){
// 		//	let info = fixedValueList[_]
// 		//
// 		//	let labelName = GetFiledFormatName(info.index, info.value)
// 		//	JsUtil.arrayInstert(showStrList, labelName)
// 		//}
// 		info.fixedValueStr = table_concat(showStrList,"#br")
// 		info.fixedValueStrList = showStrList
		
// 		//附加属性文本列表
// 		showStrList = []
// 		for(let _ in appendValueList){
// 			let info = appendValueList[_]
	
// 			let labelName = GetFiledFormatName(info.index, info.value, "+")
// 			JsUtil.arrayInstert(showStrList, labelName)
// 		}
// 		info.appendValueStr = table_concat(showStrList,"#br")
// 		info.appendValueStrList = showStrList
		
// 		return info
// 	}
	
// 	//生成装备的预览属性范围
// 	let [fixedValueList, appendValueList] = GetPreviewEquipAttribute(this.entryId, enhanceLevel || 0,starLevel)
// 	info = {}
// 	//固定属性文本
// 	let showStrList = []
// 	for(let _ = 0; _ < fixedValueList.length; _++){
// 			let v = fixedValueList[_]
	
// 		let index = v.index
// 		let minValue = v.min
// 		let maxValue = v.max
// 		let nameStr = GetFieldName(index)
		
// 		minValue = TransferItemConfigValue(IndexToabilityName[index], minValue)
// 		maxValue = TransferItemConfigValue(IndexToabilityName[index], maxValue)
		
// 		JsUtil.arrayInstert(showStrList, nameStr+":("+minValue+"~"+maxValue+")")	
// 	}
// 	info.fixedValueStr = table_concat(showStrList,"#br")
// 	info.fixedValueStrList = showStrList
	
// 	//附加属性文本
// 	showStrList = []
// 	for(let _ = 0; _ < appendValueList.length; _++){
// 			let v = appendValueList[_]
	
// 		let index = v.index
// 		let minValue = v.min
// 		let maxValue = v.max
// 		let nameStr = GetFieldName(index)
		
// 		minValue = TransferItemConfigValue(IndexToabilityName[index], minValue)
// 		maxValue = TransferItemConfigValue(IndexToabilityName[index], maxValue)
			
// 		JsUtil.arrayInstert(showStrList, nameStr+":("+minValue+"~"+maxValue+")")	
// 	}
// 	info.appendValueStrList = showStrList
// 	info.appendValueStr = table_concat(showStrList,"#br")
// 	info.appendMaxPropertyCount = appendValueList.maxPropertyCount
	
// 	return info	
// }

// getFixedValueInfoEx( previewValue){
// 	let info:any = {}
// 	let addInfoList = []
// 	let strList = []
	
// 	let fixedValue = previewValue || this.getProperty("fixedValue")
// 	if(fixedValue ){
// 		//let enhanceLevel = this.getProperty("enhance_level") || 0
// 		let [orginalValueList, _] = GetPreviewEquipAttributeByItem(this, 0)	 //原来的基础属性
// 		for(let _ = 0; _ < orginalValueList.length; _++){
// 			let v = orginalValueList[_]
	
			
// 			let finalValue = fixedValue[v.index]
// 			let addValue = finalValue - v.value
// 			//强化
// 			addInfoList[v.index] = {["final"]: finalValue, ["orginal"] : v.value, ["enhance"] : addValue}
// 		}
		
// 		let sortFieldList = GetSortEquipFieldList()
// 		for(let _ in sortFieldList){
// 			let index = sortFieldList[_]
	
// 			let finalValue = fixedValue[index]
// 			if(finalValue ){
// 				let indexName = IndexToabilityName[index]
// 				finalValue = TransferItemConfigValue(indexName, finalValue)
			
// 				let addInfo = addInfoList[index]
				
// 				if(addInfo && addInfo.orginal < addInfo.final ){
// 					let orginalValue = addInfo.orginal//原始值
// 					let enhanceValue = addInfo.enhance //强化增值
					
// 					let name = GetFieldName(index)
// 					let value1 = TransferItemConfigValue(indexName, orginalValue)
// 					let value2 = TransferItemConfigValue(indexName, enhanceValue)
					
// 					let txt = String.format(Localize_cns("ITEM_TXT28"),  value1, value2)
// 					JsUtil.arrayInstert(strList, String.format("%s:%s(%s)", name, finalValue, txt) )
// 				}else{
// 					JsUtil.arrayInstert(strList, GetFiledFormatName(index, finalValue) )
// 				}
				
// 			}
// 		}
		
// 	}
	
// 	info.addInfoList = addInfoList
// 	info.addStrList = strList		
	
// 	return info
// }




getFixedValueInfo( previewValue?){

	let info:any = {}
	let strList = []
	let infoList = []
	
	let fixedValue = previewValue || this.getProperty("fixedValue")
	if(fixedValue ){
		let sortFieldList = GetSortEquipFieldList()
		for(let _ in sortFieldList){
			let index = sortFieldList[_]
	
			let value = fixedValue[index]
			if(value ){
				let labelName = GetFiledFormatName(index, value)
				JsUtil.arrayInstert(strList, labelName)
				JsUtil.arrayInstert(infoList, {index, value})
			}
		}
	}
	
	info.fixedValueStrList = strList
	info.fixedValueInfoList = infoList
	
	return info
}

getAppendValueInfo( previewValue?){
	let info:any = {}
	
	let strList = []
	let infoList = []
	let appendValue = previewValue || this.getProperty("appendValue")
	if(appendValue ){
		for(let _ in appendValue){
			let info = appendValue[_]
	
			let index = info[0]
			let value = info[1]
			
			let labelName = GetFiledFormatName(index, value, "+")
			JsUtil.arrayInstert(strList, labelName)
			JsUtil.arrayInstert(infoList, info)
		}
	}
	
	info.appendValueStrList = strList
	info.appendValueInfoList = infoList
	
	
	return info
}

// getNewAppendValueInfo(){
// 	let info:any = {}
// 	let strList = []
// 	let infoList = []
	
// 	let appendValue = this.getProperty("newAppendValue")
	
// 	if(appendValue ){
// 		for(let _ in appendValue){
// 			let info = appendValue[_]
	
// 			let index = info[0]
// 			let value = info[1]
// 			let level = info[2]

// 			let [fixedValueList, appendValueList] = GetPreviewEquipAttribute(this.entryId, level)
// 			for(let k = 0; k < appendValueList.length; k++){
// 			let v = appendValueList[k]
	
// 				if(index == v.index ){
// 					value = v.min//v.max
// 					break
// 				}
// 			}
			
// 			let labelName = GetFiledFormatName(index, value, "+")
// 			JsUtil.arrayInstert(strList, labelName)
// 			JsUtil.arrayInstert(infoList, info)
// 		}
// 	}
	
// 	info.appendValueStrList = strList
// 	info.appendValueInfoList = infoList
	
// 	return info
// }

isUseLevelIgnore(){
	let special = this.getProperty("equip_special") 
	
	return special == 1
}


// getSpecialSkillInfo(){
	
// 	let strList = []
// 	let specialSkill = this.getProperty("special_skill")
// 	if(specialSkill == null ){
// 		return strList
// 	}
	
	
// 	//属性
// 	let atrriInfo = specialSkill[opSpecialEffectIndex.attri -1]//2
// 	for(let _ = 0; _ < atrriInfo.length; _++){
// 			let v = atrriInfo[_]
	
// 		let index = v[0]
// 		let value= v[1]
// 		let labelName = GetFiledFormatName(index, value)
// 		JsUtil.arrayInstert(strList, labelName)
// 	}
	
	
// 	//特效
// 	let skillInfo = specialSkill[opSpecialEffectIndex.skill - 1]//1
// 	for(let _ = 0; _ < skillInfo.length; _++){
// 			let v = skillInfo[_]
	
// 		let skillId = v[0]
// 		let value = v[1]
// 		let value1 = v[2]
		
// 		let specialEffectInfo = GameConfig.EquipSpecialSkillEffectConfig[skillId+""]
// 		if(specialEffectInfo ){
// 			let desc = specialEffectInfo.description.tip
// 			let ispercent = specialEffectInfo.description.percent
			
// 			let strValue = value
// 			if(ispercent == 1 ){
// 				strValue = value*100 +"%"
// 			}
// 			let labelName = String.format(desc, strValue)
// 			JsUtil.arrayInstert(strList, labelName)
// 		}
// 	}
	
// 	return strList
// }

//得到简短的提示（固定值）
GetShortTips(){
	//这堆属性要客户端处理下显示百分数，可能出现在任何装备上
	//TLog.Debug("===========GetShortTips============")
	let itemTypeId = this.refPropertyInfo["type"]
	
	if(this.isEquip() == true ){
		let value = this.propertyInfo["fixed_value"] || {}
		let str = ""
		
		let index = 0
		for(let k in value){
			let v = value[k]
	
			let name = ItemSystem.getInstance().getName(k)
			let an = IndexToabilityName[k]
			str = str+name//+"+"+v
			index = index + 1		
			if(index < size_t(value) ){
				str = str +Localize_cns("DUN_HAO")
			}
			if(index == size_t(value) ){
				let strV = TransferItemConfigValue(an, v)
				str = str +"+" +strV
			}
		}
		return str
	// }else if(itemTypeId == opItemType.ITEM_TYPE_ACTIVE_ITEM ){	
	// 	let str = this.getRefProperty("readme") || this.getRefProperty("readme") || ""
		
	//   return str
	}else{
	//}else if(itemTypeId == opItemType.ITEM_TYPE_MAGIC_STONE ){
	//	//TLog.Debug(this.refPropertyInfo["ItemEntry"],this.propertyInfo["stone_level"])
	//	if(!  GemConfigEffects[this.refPropertyInfo["ItemEntry"*/[this.propertyInfo["stone_level"*/ ){
	//			return ""
	//	}
	//
	//	let Effect = GemConfigEffects[this.refPropertyInfo["ItemEntry"*/[this.propertyInfo["stone_level"*/["effect"]
	//	 
	//	return Effect || ""
	//	//let index = abilityNameToIndex[Effect[0][1*/
	//	//
	//	//if(index == null && Effect[0][0]=="buff" ){
	//	//	return ""
	//	//}
	//	////TLog.Debug(Effect[0][0],this.entryId)
	//	////TLog.Debug_r(Effect[0])
	//	//let txt = ItemSystem.getInstance().getName(index) || ""
	//	//let value = Effect[0][1]
	//	//let quzhen = Math.floor(tonumber(value))
	//	//			if(value<1 || quzhen < value  ){
	//	//						value  = value*100
	//	//						value = value+"%"
	//	//			}
	//	//return 	txt+":+"+value	
	//}else{
		return this.refPropertyInfo["summary"]
	}
	
	//return ""
}

//查询物品属性
////////////////////////////////////////////////////////////////////////////////////////////////////////

isEquip(){
	//TLog.Debug(this.gerRefProperty("type"))
	let itemtype = this.refPropertyInfo.type
	
	if((itemtype >= opItemType.PLAYER_EQUIP_START && itemtype <= opItemType.PLAYER_EQUIP_END ) ){
		return true
	}
	
	if((itemtype >= opItemType.ITEM_TYPE_FAIRY_START && itemtype <= opItemType.ITEM_TYPE_FAIRY_END) ){
		return true
	}
	
	if((itemtype >= opItemType.ITEM_TYPE_RIDE_START && itemtype <= opItemType.ITEM_TYPE_RIDE_END) ){
		return true
	}

    //通用和角色装备
	if((itemtype >= opItemType.COMMON_EQUIP && itemtype <= opItemType.ROLE_EQUIP) ){
		return true
	}

	return false
}


setPrivateFlag( bPriv){
	this.privateFlag = bPriv
}

getPrivateFlag(){
	return this.privateFlag
}



getName(){
	//非装备
	// if(! this.isEquip() ){
	// 	return this.getRefProperty("name")
	// }
	
	// //非彩装
	// if(this.refPropertyInfo["equipStar"] < opLegendEquipStar.Precious ){
	// 	return this.getRefProperty("name")
	// }
	
	// //没有改造属性
	// if(this.propertyInfo["finalPromote"]==null ){
	// 	return this.getRefProperty("name")
	// }
	
	// let grade = this.getGrade()
	// if(grade == 0 ){
	// 	return this.getRefProperty("name")
	// }
	
	// return (Localize_cns("GRADE_"+grade)+Localize_cns("CONNECT_SIGN")+this.getRefProperty("name"))
	return this.getRefProperty("name")
}

getOwnerId(){
	return checkNull(this.getProperty("equip_owner") , -1)
}

getOwner(){
	let ownerId = this.getOwnerId()
	if(ownerId < 0 ){
		return null
	}
	
	let owner = null
	
	if(ownerId == GetHeroProperty("id") ){
		owner = GetHeroPropertyInfo()
	}else{
		owner = PetSystem.getInstance().getPetInfoEntry(ownerId)
	}
	
	return owner
}

//拥有者名字
getOwnerName(){
	let ownerId = this.getProperty("equip_owner")
	
	if(ownerId == null ){
		return ""
	}
	
	let petInfo = PetSystem.getInstance().getPetEntryInfo(ownerId)
	if(petInfo ){
		return petInfo.Name
	}
	
	return Localize_cns("EQUIP_OWNER_MYSELF")
}

}