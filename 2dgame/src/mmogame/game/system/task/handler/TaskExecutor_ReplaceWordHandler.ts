/*
作者:
    yangguiming
	
创建时间：
   2013.7.02(周二)

意图：
   替换一对"##"之间的内容.
   如“#rname.length##，你好” -> “主角名，你好”。检测rname替换hero.getProperty("name")

公共接口：
   
*/
// function getSchoolOrSchoolMap(entryId, keyName){
// 	let school = tostring(entryId)
// 	if(! GameConfig.npcConfig[entryId] ){
// 		return school
// 	}

// 	mapId = GameConfig.npcConfig[entryId]["map"]

// 	let flag, i = table_isExist(opSchoolMap, mapId)
// 	if(flag ){
// 		if(keyName == "name" ){
// 			school = GetStringSplitBySchool(Localize_cns("TASK_YUNBIAO_SCHOOL"), i, 12)
// 		}else if(keyName == "map" ){
// 			school = GameConfig.MapConfig[mapId].mapName
// 		}
// 	}

// 	return school
// }

module TaskReplaceWordSpace {
	////////////////////////////////////////////////////////////////////////////////////////////////
	// function getHeroName(word, taskId, argStr) {
	// 	let hero = GetHero()
	// 	return hero.getProperty("name")
	// }

	// function getHeroSex(word, taskId, argStr) {
	// 	let [female, male] = StringUtil.stringMatch(argStr, /{(.+),(.+)}/)
	// 	let hero = GetHero()
	// 	let sex = hero.getProperty("sexId")

	// 	if (sex == genderOptions.FEMALE) {
	// 		return female
	// 	} else if (sex == genderOptions.MALE) {
	// 		return male
	// 	}
	// }

	// // function getHeroSchool(word, taskId, argStr){
	// // 	let left = string.find(argStr, "{")
	// // 	let right : string.find(argStr, "}")

	// // 	return GetStringSplitBySchool(string.sub(argStr, left+1, right-1))
	// // }

	// // function getYunBiaoNpc(word, taskId, argStr){
	// // 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// // 	let entryId = taskInfo.finish[taskField.FIELD_FINISH_ARRIVE_NPC]

	// // 	return ActorManager.getInstance().getNpcNameWithEntryId(entryId)
	// // }

	// // function getYunBiaoMap(word, taskId, argStr){
	// // 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// // 	let entryId = taskInfo.finish[taskField.FIELD_FINISH_ARRIVE_NPC]

	// // 	return getSchoolOrSchoolMap(entryId, "map")
	// // }

	// function getFindNpcName(word, taskId, argStr) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let entryId = taskInfo.finish[taskField.FIELD_FINISH_FINDNPC][0]

	// 	if (taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC] && taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC][entryId]) {
	// 		return taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC][entryId][6]
	// 	}

	// 	return ActorManager.getInstance().getNpcNameWithEntryId(entryId)
	// }

	// function getItemName(word, taskId) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let finishList = taskInfo.finish[taskField.FIELD_FINISH_COLLECTITEM]
	// 	let dataList = taskInfo.data[taskField.FIELD_FINISH_COLLECTITEM] || {}

	// 	let str = ""
	// 	for (let itemId in finishList) {
	// 		let count = finishList[itemId]

	// 		let dataCount = dataList[itemId] || 0
	// 		if (dataList[taskField.FIELD_FINISH_GIVE_RES]) {
	// 			dataCount = count
	// 		}

	// 		str = str + ItemSystem.getInstance().getItemName(itemId) + "(" + dataCount + "/" + count + ")" + " "
	// 	}

	// 	return str
	// }

	// function getPetName(word, taskId) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let finishList = taskInfo.finish[taskField.FIELD_FINISH_COLLECTPET]
	// 	let dataList = taskInfo.data[taskField.FIELD_FINISH_COLLECTPET] || {}

	// 	let str = ""
	// 	for (let petId in finishList) {
	// 		let count = finishList[petId]

	// 		let dataCount = dataList[petId] || 0
	// 		if (dataList[taskField.FIELD_FINISH_GIVE_PET]) {
	// 			dataCount = count
	// 		}

	// 		str = str + (GameConfig.PetConfig[petId].name || petId) + "(" + dataCount + "/" + count + ")" + " "
	// 	}

	// 	return str
	// }

	// // function getDynamicSchoolName(word, taskId){
	// // 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// // 	let entryId = taskInfo.finish[taskField.FIELD_FINISH_PVE_SCHOOL]
	// // 	let mapId = taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC][entryId][0]

	// // 	let flag, i = table_isExist(opSchoolMap, mapId)
	// // 	let school = taskId
	// // 	if(flag ){
	// // 		school = GetStringSplitBySchool(Localize_cns("TASK_YUNBIAO_SCHOOL"), i, 12)
	// // 	}

	// // 	return school
	// // }

	// function getShiMenNpcName(word, taskId) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let entryId = taskInfo.finish[taskField.FIELD_FINISH_PVE_SCHOOL]
	// 	let name = taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC][entryId][6]

	// 	return name
	// }

	// function getShiMenMonName(word, taskId) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let info = taskInfo.finish[taskField.FIELD_FINISH_KILL_NPC_MONSTER]

	// 	let monsterId = info[0]

	// 	let name = ""
	// 	if (GameConfig.npcConfig[monsterId]) {
	// 		name = GameConfig.npcConfig[monsterId].name
	// 	}

	// 	return name
	// }

	// function getShiMenNpcMapName(word, taskId) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let entryId = taskInfo.finish[taskField.FIELD_FINISH_FINDNPC][0]
	// 	let [_, mapId] = TaskSystem.getInstance().getDynamicNpcName(taskId, entryId)
	// 	//let mapId = taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC][entryId][0]

	// 	let mapName = GameConfig.MapConfig[mapId].mapName

	// 	return mapName
	// }

	// function getNpcNameWithEntry(word, taskId, argStr) {

	// 	let entryId = StringUtil.stringMatch(argStr, /{\d+}/)[0]
	// 	if (entryId == null) {
	// 		return word;
	// 	}

	// 	// let left = string.find(argStr, "{")
	// 	// let right : string.find(argStr, "}")
	// 	// if(! left || ! right ){
	// 	// 	return word
	// 	// }

	// 	// let entryId = tonumber(string.sub(argStr, left+1, right-1))
	// 	if (!GameConfig.npcConfig[entryId]) {
	// 		return word
	// 	}

	// 	return GameConfig.npcConfig[entryId].name
	// }

	// // function getNpcNameOnSchool(word, taskId, argStr){
	// // 	let left = string.find(word, "{")
	// // 	let right : string.find(word, "}")
	// // 	if(! left || ! right || GetHeroProperty("school") == 0 ){
	// // 		return word
	// // 	}

	// // 	let entryId = tonumber(GetStringSplitBySchool(string.sub(word, left+1, right-1), GetHeroProperty("school")))
	// // 	if(! GameConfig.npcConfig[entryId] ){
	// // 		return word
	// // 	}

	// // 	return GameConfig.npcConfig[entryId].name
	// // }

	// // function getChallengeNpcMap(word, taskId){
	// // 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// // 	let entryId = taskInfo.finish[taskField.FIELD_FINISH_PVE_SCHOOL]
	// // 	let mapId = taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC][entryId][0]

	// // 	let mapName = GameConfig.MapConfig[mapId].mapName

	// // 	return mapName
	// // }

	// // function getShiMenMonMapName(word, taskId){
	// // 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// // 	let entryId = taskInfo.finish[taskField.FIELD_FINISH_KILL_NPC_MONSTER][0]
	// // 	let mapId = taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC][entryId][0]

	// // 	let mapName = GameConfig.MapConfig[mapId].mapName

	// // 	return mapName
	// // }

	// function getFightWinNpc(word, taskId) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let entryId = taskInfo.finish["FIGHTWIN_NPC"][0]

	// 	if (taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC] && taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC][entryId]) {
	// 		return taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC][entryId][6]
	// 	}

	// 	return ActorManager.getInstance().getNpcNameWithEntryId(entryId)
	// }

	// function getFightNpcMap(word, taskId) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let entryId = taskInfo.finish["FIGHTWIN_NPC"][0]
	// 	let mapId = GameConfig.npcConfig[entryId]["map"]

	// 	if (taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC] && taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC][entryId]) {
	// 		mapId = taskInfo.init[taskField.FIELD_INIT_GENERATE_NPC][entryId][0]
	// 	}

	// 	let mapName = GameConfig.MapConfig[mapId].mapName

	// 	return mapName
	// }

	// // function getTeamMemNotInLevel(word, taskId, argStr){
	// // 	let left = string.find(argStr, "{")
	// // 	let right : string.find(argStr, "}")

	// // 	if(! left || ! right || ! HeroIsInTeam() ){
	// // 		return word
	// // 	}

	// // 	let limitStr = string.sub(argStr, left+1, right-1)
	// // 	let low, upper = string.match(limitStr, "(%d+),(%d+)")
	// // 	let color = string.sub(argStr, right + 1, -1)
	// // 	color = (color == "") && "red" || color
	// // 	let nameList = ""

	// // 	low = tonumber(low)
	// // 	upper = tonumber(upper)

	// // 	let teamInfo = TeamSystem.getInstance().getTeamInfo()
	// // 	for(let id in teamInfo.membersList){
	// // 			let mem = teamInfo.membersList[id]

	// // 		if(low != 0 ){
	// // 			if(mem.level < low ){
	// // 				nameList = nameList +"#" +color +mem.name +"#rf,"
	// // 			}
	// // 		}

	// // 		if(upper != 0 ){
	// // 			if(mem.level > upper ){
	// // 				nameList = nameList +"#" +color +mem.name +"#rf,"
	// // 			}
	// // 		}
	// // 	}

	// // 	return nameList
	// // }

	// // function getdynamicPosLink(word, taskId, argStr){
	// // 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// // 	let entryId = 0
	// // 	if(taskInfo.finish[taskField.FIELD_FINISH_FINDNPC] ){
	// // 		entryId = taskInfo.finish[taskField.FIELD_FINISH_FINDNPC][0]
	// // 	}else if(taskInfo.finish[taskField.FIELD_FINISH_PVE_SCHOOL] ){
	// // 		entryId = taskInfo.finish[taskField.FIELD_FINISH_PVE_SCHOOL]
	// // 	}else if(taskInfo.finish[taskField.FIELD_FINISH_KILL_NPC_MONSTER] ){
	// // 		entryId = taskInfo.finish[taskField.FIELD_FINISH_KILL_NPC_MONSTER][0]
	// // 	}else if(taskInfo.finish["FIGHTWIN_NPC"] ){
	// // 		entryId = taskInfo.finish["FIGHTWIN_NPC"][0]
	// // 	}

	// // 	if(entryId == 0 ){
	// // 		return word
	// // 	}

	// // 	return TaskLinkType.FIND_NPC +";{" +entryId +"," +0 +"}"
	// // }

	// // function getcurrentNpc(word, taskId, argStr){
	// // 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// // 	if(! taskInfo.finish[taskField.FIELD_FINISH_FINDNPC] || ! taskInfo.finish[taskField.FIELD_FINISH_FINDNPC]["isonebyone"] ){
	// // 		return word
	// // 	}

	// // 	let finishList = taskInfo.finish[taskField.FIELD_FINISH_FINDNPC]
	// // 	let dataList = taskInfo.data[taskField.FIELD_FINISH_FINDNPC] || {}

	// // 	let entryId = finishList[dataList.length + 1]
	// // 	let npcRef = ActorManager.getInstance().getNpcRefWithEntryId(entryId)
	// // 	return npcRef.name
	// // }

	// // function getBuffLive(word, taskId, argStr){
	// // 	let left = string.find(argStr, "{")
	// // 	let right : string.find(argStr, "}")
	// // 	let buffId = string.sub(argStr, left+1, right-2)
	// // 	buffId = tonumber(buffId) || 0
	// // 	let buff = BuffSystem.getInstance().getHeroBuff(buffId)
	// // 	if(buff ){
	// // 		return Math.floor(buff.getAlive()/60+0.5)
	// // 	}
	// // 	return 0
	// // }

	// // function getBuffSpareLive(word, taskId, argStr){
	// // 	let left = string.find(argStr, "{")
	// // 	let right : string.find(argStr, "}")
	// // 	let buffId = string.sub(argStr, left+1, right-2)
	// // 	buffId = tonumber(buffId) || 0
	// // 	let spareTime = BuffSystem.getInstance().getSpareTime(buffId)
	// // 	return spareTime
	// // }

	// // function getRenqi(word, taskId, argStr){
	// // 	return GetHeroProperty("popularity") || 0
	// // }

	// // function getYinde(word, taskId, argStr){
	// // 	return GetHeroProperty("virtue") || 0
	// // }

	// // function getGivePet(word, taskId, argStr){
	// // 	let list = PetSystem.getInstance().getGivePetList()
	// // 	let name = ""
	// // 	let pet = list[0]
	// // 	if(pet ){
	// // 		name = pet.name
	// // 	}
	// // 	return name
	// // }

	// // function getPetYinde(word, taskId, argStr){
	// // 	let list = PetSystem.getInstance().getGivePetList()
	// // 	let yinde = 0
	// // 	let pet = list[0]
	// // 	if(pet ){
	// // 		if(pet.carry_level >= 125 ){
	// // 			yinde = 9
	// // 		}else if(pet.carry_level >= 115 ){
	// // 			yinde = 8
	// // 		}else if(pet.carry_level >= 105 ){
	// // 			yinde = 7
	// // 		}else if(pet.carry_level >= 95 ){
	// // 			yinde = 6
	// // 		}else if(pet.carry_level >= 85 ){
	// // 			yinde = 5
	// // 		}else if(pet.carry_level >= 75 ){
	// // 			yinde = 4
	// // 		}else if(pet.carry_level >= 65 ){
	// // 			yinde = 3
	// // 		}else if(pet.carry_level >= 55 ){
	// // 			yinde = 2
	// // 		}else if(pet.carry_level >= 45 ){
	// // 			yinde = 1
	// // 		}else if(pet.carry_level >= 35 ){
	// // 			yinde = 0
	// // 		}else if(pet.carry_level >= 25 ){
	// // 			yinde = 0
	// // 		}else if(pet.carry_level >= 15 ){
	// // 			yinde = 0
	// // 		}else if(pet.carry_level >= 5 ){
	// // 			yinde = 0
	// // 		}else{
	// // 			yinde = 0
	// // 		}
	// // 	}
	// // 	TLog.Debug(pet.carry_level, yinde)
	// // 	return yinde
	// // }

	// function getCommitNpcMap(word, taskId, argStr) {
	// 	let taskRef = GameConfig.TaskConfig[taskId]
	// 	if (!taskRef) {
	// 		TLog.Error("TaskReplaceWordHandler the taskRef is ! exsit! taskId:%d", taskId)
	// 		return word
	// 	}
	// 	let entryId = tonumber(GetStringSplitBySchool(taskRef.NpcIds))

	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	if (taskInfo.data["COMMIT_NPC"]) {
	// 		entryId = taskInfo.data["COMMIT_NPC"]
	// 	}

	// 	let [_, mapId] = TaskSystem.getInstance().getDynamicNpcName(taskId, entryId)
	// 	return GameConfig.MapConfig[mapId].mapName
	// }

	// function getCommitNpcName(word, taskId, argStr) {
	// 	let taskRef = GameConfig.TaskConfig[taskId]
	// 	if (!taskRef) {
	// 		TLog.Error("TaskReplaceWordHandler the taskRef is ! exsit! taskId:%d", taskId)
	// 		return word
	// 	}
	// 	let entryId = tonumber(GetStringSplitBySchool(taskRef.NpcIds))

	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	if (taskInfo.data["COMMIT_NPC"]) {
	// 		entryId = taskInfo.data["COMMIT_NPC"]
	// 	}

	// 	let [name] = TaskSystem.getInstance().getDynamicNpcName(taskId, entryId)
	// 	return name
	// }

	// function getFindMap(word, taskId) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let entryId = taskInfo.finish[taskField.FIELD_FINISH_FINDNPC][0]

	// 	let [_, mapId] = TaskSystem.getInstance().getDynamicNpcName(taskId, entryId)
	// 	return GameConfig.MapConfig[mapId].mapName
	// }

	// // function getCampaignName(word, taskId) {
	// // 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// // 	let campId = taskInfo.finish[ClientTaskField.FIELD_FINISH_DUOCITONGGUAN][0]

	// // 	return CampaignSystem.getInstance().getCampaignName(campId)
	// // }

	// function getItemNpc(word, taskId) {
	// 	let taskInfo = TaskSystem.getInstance().getTask(taskId).getPropertyInfo()
	// 	let entryId = taskInfo.finish[taskField.FIELD_FINISH_FINDNPC_COUNT][0]

	// 	let [_, mapId] = TaskSystem.getInstance().getDynamicNpcName(taskId, entryId)
	// 	return GameConfig.MapConfig[mapId].mapName
	// }

	export let TaskReplaceWordHandler: any = {																									//下面注释中“对应数值”表示对应完成条件的任务
		// ["rname"]: getHeroName,									//rname;{}
		// ["sex"]: getHeroSex,										//sex;{femal,male}
		
		// ["findNpc"]: getFindNpcName,								//findNpc;{}_taskId				对应4005，获取寻找npc的名字
		// ["getItem"]: getItemName,									//getItem;{}_taskId				对应4002，获取物品列表
		// ["getPet"]: getPetName,										//getPet:{}_taskId				对应4003，获取宠物列表
		
		// ["smTaskNpc"]: getShiMenNpcName,							//smTaskNpc;{}_taskId			对应4032，获取npc名字
		// ["smMonster"]: getShiMenMonName,							//smMonster;{}_taskId			对应4034，获取明雷名字
		// ["smNpcMap"]: getShiMenNpcMapName,					//smNpcMap;{}_taskId			对应4005，获取npc所在地图名
		// ["npcName"]: getNpcNameWithEntry,					//npcName;{npcEntryId}		获取npcEntryId对应的npc名字
		
		// ["fightWinNpc"]: getFightWinNpc,						//fightWinNpc;{}_taskId		对应"FIGHTWIN_NPC"，获取npc名字
		// ["fightNpcMap"]: getFightNpcMap,						//fightNpcMap;{}_taskId		对应"FIGHTWIN_NPC"，获取npc所在地图名
		
		// ["commitNpcName"]: getCommitNpcName, 					//commitNpcName;{}_taskId 	提交任务的npc的名字
		// ["findMap"]: getFindMap, 											//findMap;{}_taskId 			对应4005，获取npc所在地图名

		// ["getCommitNpcMap"]: getCommitNpcMap,					//getCommitNpcMap;{}_taskId 提交任务的npc的地图名
		// ["itemNpc"]: getItemNpc,												//itemNpc;{}_taskId					对应4053
	}



	////////////////////////////////////////////////////////////////////////////////////////////
}