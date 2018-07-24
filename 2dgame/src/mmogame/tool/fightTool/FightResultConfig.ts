//添加测试角色
module FightResultSpace{
  export var testFighterList = []
  export let count = 16
  export let entryList:any = [18000, 18000]//18001}
  export let caster = 1
  export let fightFormation:any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  export var STAY_IN_DEFALUT_POSITION = true
  export let curCount = 0


}

  let TOOL_MY_SIDE = fightSide.FIGHT_RIGHT
  let TOOL_ENEMEY_SIDE = fightSide.FIGHT_LEFT

  var TEST_ATTACK_TYPE:any = {}




function initFightResultConfig(){
    TEST_ATTACK_TYPE = {
      [Localize_cns("FIGHT_ONCE_ATTACK")] : [test_once_fight],
      //[Localize_cns("FIGHT_CHASE_ATTACK")] = {test_chase_fight},
      [Localize_cns("FIGHT_LIST_ATTACK")] : [test_list_fight],
      //
      [Localize_cns("FIGHT_PREPARE_ATTACK")] : test_skill_prepare_list,//吟唱
      [Localize_cns("FIGHT_INTERVAL_ATTACK")] : test_skill_interval_list,//持续施法
    }
}

for(let i = 0; i <  FightResultSpace.count;i++){
  let fighterPlayer:any = {}
  fighterPlayer.type_id = objectType.OBJECT_TYPE_PET
  fighterPlayer.id = i
  fighterPlayer.side = TOOL_MY_SIDE
  fighterPlayer.pos = FightResultSpace.fightFormation[i]
  fighterPlayer.maxHp = 300
  fighterPlayer.hp = 280
  fighterPlayer.maxRp = 300
  fighterPlayer.rp = 280
  fighterPlayer.name = tostring(FightResultSpace.fightFormation[i])
  fighterPlayer.entry = 20001//entryList[fighterPlayer.id % 2 + 1]
	
  FightResultSpace.curCount = FightResultSpace.curCount + 1
  JsUtil.arrayInstert(FightResultSpace.testFighterList, fighterPlayer)
}

for(let i = 0; i <  FightResultSpace.count;i++){
  let fighterPlayer:any = {}
  
  FightResultSpace.curCount = FightResultSpace.curCount + 1
  fighterPlayer.type_id = objectType.OBJECT_TYPE_PET//OBJECT_TYPE_MONSTER
  fighterPlayer.id = FightResultSpace.curCount
  fighterPlayer.side = TOOL_ENEMEY_SIDE
  fighterPlayer.pos = FightResultSpace.fightFormation[i]
  fighterPlayer.maxHp = 300
  fighterPlayer.hp = 280
  fighterPlayer.maxRp = 300
  fighterPlayer.rp = 280
  fighterPlayer.name = tostring(FightResultSpace.fightFormation[i])
  fighterPlayer.entry = 20001//10024001//entryList[fighterPlayer.id % 2 + 1]
	
  JsUtil.arrayInstert(FightResultSpace.testFighterList, fighterPlayer)
}

//for(let i = 1; i <=  1;i++){
//	let var fighterPlayer:any = {}
//	
//	FightResultSpace.curCount = FightResultSpace.curCount + 1
//  fighterPlayer.type_id = objectType.OBJECT_TYPE_FUNNAL//OBJECT_TYPE_MONSTER
//  fighterPlayer.id = FightResultSpace.curCount
//  fighterPlayer.side = TOOL_MY_SIDE//TOOL_ENEMEY_SIDE
//  fighterPlayer.pos = FUNNAL_ACTOR_POS
//  fighterPlayer.maxHp = 300
//  fighterPlayer.hp = 280
//  fighterPlayer.maxRp = 300
//  fighterPlayer.rp = 280
//  fighterPlayer.name = "player" +FightResultSpace.count + i
//  fighterPlayer.entry = 9057//10024001//entryList[fighterPlayer.id % 2 + 1]
//	
//	if(i % 2 == 0 ){
//	//	fighterPlayer.side = TOOL_MY_SIDE
//	}
//  JsUtil.arrayInstert(FightResultSpace.testFighterList, fighterPlayer)
//}

let targetList = 0
for(let i = 0; i <  FightResultSpace.count;i++){
	targetList = targetList + Math.pow(2, (FightResultSpace.fightFormation[i] - 1) )
}
//单次攻击的result
var test_once_fight:any = {}
test_once_fight.code = resultOptions.RCODE_SPELL_HIT
test_once_fight.spellId = 9999
test_once_fight.caster = 1001//caster
test_once_fight.casterList = 0
test_once_fight.target = FightResultSpace.caster + FightResultSpace.count
test_once_fight.targetList = targetList
test_once_fight.protector = 0
test_once_fight.fail = 0
test_once_fight.castCount = 1
test_once_fight.powerCount = 3
test_once_fight.round = 1
test_once_fight.fightPowers = []
test_once_fight.fightPowers[0] = {}
test_once_fight.fightPowers[0].caster = 0
test_once_fight.fightPowers[0].target = FightResultSpace.caster + FightResultSpace.count 
test_once_fight.fightPowers[0].effect = powerEffects.EFFECT_HP_LESS
test_once_fight.fightPowers[0].status = 0
test_once_fight.fightPowers[0].point = 100
test_once_fight.fightPowers[0].times = 1   
test_once_fight.fightPowers[0].buffLevel = 1
test_once_fight.fightPowers[0].buffSpecial = 25
test_once_fight.fightPowers[0].flag = 2

test_once_fight.fightPowers[1] = {}
test_once_fight.fightPowers[1].caster = 0
test_once_fight.fightPowers[1].target = FightResultSpace.caster + FightResultSpace.count
test_once_fight.fightPowers[1].effect = powerEffects.EFFECT_ATTACKED//powerEffects.EFFECT_DODGE
test_once_fight.fightPowers[1].status = 0
test_once_fight.fightPowers[1].point = 0
test_once_fight.fightPowers[1].times = 1

//test_once_fight.fightPowers[3] = {}
//test_once_fight.fightPowers[3].caster = 0
//test_once_fight.fightPowers[3].target = caster + FightResultSpace.count
//test_once_fight.fightPowers[3].effect = powerEffects.EFFECT_DROP_ITEM
//test_once_fight.fightPowers[3].itemId = 1001
//test_once_fight.fightPowers[3].quality = 103
//test_once_fight.fightPowers[3].times = 1
//
//test_once_fight.fightPowers[4] = {}
//test_once_fight.fightPowers[4].caster = 0
//test_once_fight.fightPowers[4].target = caster + FightResultSpace.count
//test_once_fight.fightPowers[4].effect = powerEffects.EFFECT_STATUS
//test_once_fight.fightPowers[4].status = 1
//test_once_fight.fightPowers[4].times = 1
//test_once_fight.fightPowers[2] = {}
//test_once_fight.fightPowers[2].target = 2
//test_once_fight.fightPowers[2].effect = powerEffects.EFFECT_STATUS//powerEffects.EFFECT_DODGE
//test_once_fight.fightPowers[2].status = powerStatus.PSTATUS_TARGET_DIE
//test_once_fight.fightPowers[2].times = 1

//let var power_result:any = {}
//power_result.code = resultOptions.RCODE_SPELL_HIT
//power_result.spellId = 1
//power_result.caster = 2
//power_result.casterList = 0
//power_result.target = 1
//power_result.targetList = 0x00000000+2^(1-1)
//power_result.protector = 0
//power_result.fail = 0
//power_result.castCount = 1
//power_result.powerCount = 1
//power_result.time = 0
//power_result.var fightPowers:any = {}
//power_result.fightPowers[1] = {}
//power_result.fightPowers[1].caster = 0
//power_result.fightPowers[1].target = 1 
//power_result.fightPowers[1].effect = powerEffects.EFFECT_HP_LESS 
//power_result.fightPowers[1].status = 0
//power_result.fightPowers[1].point = 100
//power_result.fightPowers[1].times = 1   
//power_result.fightPowers[1].buffLevel = 1
//power_result.fightPowers[1].buffSpecial = 25

//test_once_fight.fightPowers[3] = {}
//test_once_fight.fightPowers[3].caster = 0
//test_once_fight.fightPowers[3].target = 2
//test_once_fight.fightPowers[3].effect = powerEffects.EFFECT_RESULT
//test_once_fight.fightPowers[3].result = power_result
//test_once_fight.fightPowers[3].status = 0
//test_once_fight.fightPowers[3].point = 0
//test_once_fight.fightPowers[3].times = 1

//连击result
//var test_chase_fight:any = {}
//test_chase_fight.code = resultOptions.RCODE_SPELL_HIT
//test_chase_fight.spellId = 9999
//test_chase_fight.caster = caster
//test_chase_fight.casterList = 0
//test_chase_fight.target = caster + FightResultSpace.count
//test_chase_fight.targetList = 0x00000000+2^(1-1)
//test_chase_fight.protector = 0
//test_chase_fight.fail = 0
//test_chase_fight.castCount = 3
//test_chase_fight.powerCount = 6
//test_chase_fight.time = 0
//test_chase_fight.var fightPowers:any = {}
//test_chase_fight.fightPowers[1] = {}
//test_chase_fight.fightPowers[1].caster = 0
//test_chase_fight.fightPowers[1].target = caster + FightResultSpace.count 
//test_chase_fight.fightPowers[1].effect = powerEffects.EFFECT_HP_LESS 
//test_chase_fight.fightPowers[1].status = 0
//test_chase_fight.fightPowers[1].point = 100
//test_chase_fight.fightPowers[1].times = 1   
//test_chase_fight.fightPowers[1].buffLevel = 1
//test_chase_fight.fightPowers[1].buffSpecial = 25
//
//test_chase_fight.fightPowers[2] = {}
//test_chase_fight.fightPowers[2].caster = 0
//test_chase_fight.fightPowers[2].target = caster + FightResultSpace.count
//test_chase_fight.fightPowers[2].effect = powerEffects.EFFECT_ATTACKED
//test_chase_fight.fightPowers[2].status = 0
//test_chase_fight.fightPowers[2].point = 0
//test_chase_fight.fightPowers[2].times = 1
//
//test_chase_fight.fightPowers[3] = {}
//test_chase_fight.fightPowers[3].caster = 0
//test_chase_fight.fightPowers[3].target = caster + FightResultSpace.count 
//test_chase_fight.fightPowers[3].effect = powerEffects.EFFECT_HP_LESS 
//test_chase_fight.fightPowers[3].status = 0
//test_chase_fight.fightPowers[3].point = 100
//test_chase_fight.fightPowers[3].times = 2   
//test_chase_fight.fightPowers[3].buffLevel = 1
//test_chase_fight.fightPowers[3].buffSpecial = 25
//
//test_chase_fight.fightPowers[4] = {}
//test_chase_fight.fightPowers[4].caster = 0
//test_chase_fight.fightPowers[4].target = caster + FightResultSpace.count
//test_chase_fight.fightPowers[4].effect = powerEffects.EFFECT_ATTACKED
//test_chase_fight.fightPowers[4].status = 0
//test_chase_fight.fightPowers[4].point = 0
//test_chase_fight.fightPowers[4].times = 2
//
//test_chase_fight.fightPowers[5] = {}
//test_chase_fight.fightPowers[5].caster = 0
//test_chase_fight.fightPowers[5].target = caster + FightResultSpace.count 
//test_chase_fight.fightPowers[5].effect = powerEffects.EFFECT_HP_LESS 
//test_chase_fight.fightPowers[5].status = 0
//test_chase_fight.fightPowers[5].point = 100
//test_chase_fight.fightPowers[5].times = 3   
//test_chase_fight.fightPowers[5].buffLevel = 1
//test_chase_fight.fightPowers[5].buffSpecial = 25
//
//test_chase_fight.fightPowers[6] = {}
//test_chase_fight.fightPowers[6].caster = 0
//test_chase_fight.fightPowers[6].target = caster + FightResultSpace.count
//test_chase_fight.fightPowers[6].effect = powerEffects.EFFECT_ATTACKED
//test_chase_fight.fightPowers[6].status = 0//powerStatus.PSTATUS_TARGET_DIE
//test_chase_fight.fightPowers[6].point = 0
//test_chase_fight.fightPowers[6].times = 3

//群攻
var test_list_fight:any = {}
test_list_fight.code = resultOptions.RCODE_SPELL_HIT
test_list_fight.spellId = 9999
test_list_fight.caster = FightResultSpace.caster
test_list_fight.casterList = 0
test_list_fight.target = FightResultSpace.caster + FightResultSpace.count
test_list_fight.targetList = targetList
test_list_fight.protector = 0
test_list_fight.fail = 0
test_list_fight.castCount = 1
test_list_fight.powerCount = 6
test_list_fight.round = 1
test_list_fight.fightPowers = []
test_list_fight.fightPowers[0] = {}
test_list_fight.fightPowers[0].caster = 0
test_list_fight.fightPowers[0].target = FightResultSpace.count + 1
test_list_fight.fightPowers[0].effect = powerEffects.EFFECT_HP_LESS 
test_list_fight.fightPowers[0].status = 0
test_list_fight.fightPowers[0].point = 100
test_list_fight.fightPowers[0].times = 1   
test_list_fight.fightPowers[0].buffLevel = 1
test_list_fight.fightPowers[0].buffSpecial = 25

test_list_fight.fightPowers[1] = {}
test_list_fight.fightPowers[1].caster = 0
test_list_fight.fightPowers[1].target = FightResultSpace.count + 1
test_list_fight.fightPowers[1].effect = powerEffects.EFFECT_ATTACKED
test_list_fight.fightPowers[1].status = 0
test_list_fight.fightPowers[1].point = 0
test_list_fight.fightPowers[1].times = 1

test_list_fight.fightPowers[2] = {}
test_list_fight.fightPowers[2].caster = 0
test_list_fight.fightPowers[2].target = FightResultSpace.count + 2
test_list_fight.fightPowers[2].effect = powerEffects.EFFECT_HP_LESS 
test_list_fight.fightPowers[2].status = 0
test_list_fight.fightPowers[2].point = 100
test_list_fight.fightPowers[2].times = 1   
test_list_fight.fightPowers[2].buffLevel = 1
test_list_fight.fightPowers[2].buffSpecial = 25

test_list_fight.fightPowers[3] = {}
test_list_fight.fightPowers[3].caster = 0
test_list_fight.fightPowers[3].target = FightResultSpace.count + 2
test_list_fight.fightPowers[3].effect = powerEffects.EFFECT_ATTACKED
test_list_fight.fightPowers[3].status = 0
test_list_fight.fightPowers[3].point = 0
test_list_fight.fightPowers[3].times = 1

test_list_fight.fightPowers[4] = {}
test_list_fight.fightPowers[4].caster = 0
test_list_fight.fightPowers[4].target = FightResultSpace.count + 3
test_list_fight.fightPowers[4].effect = powerEffects.EFFECT_HP_LESS 
test_list_fight.fightPowers[4].status = 0
test_list_fight.fightPowers[4].point = 100
test_list_fight.fightPowers[4].times = 1   
test_list_fight.fightPowers[4].buffLevel = 1
test_list_fight.fightPowers[4].buffSpecial = 25

test_list_fight.fightPowers[5] = {}
test_list_fight.fightPowers[5].caster = 0
test_list_fight.fightPowers[5].target = FightResultSpace.count + 3
test_list_fight.fightPowers[5].effect = powerEffects.EFFECT_ATTACKED
test_list_fight.fightPowers[5].status = 0
test_list_fight.fightPowers[5].point = 0
test_list_fight.fightPowers[5].times = 1





//吟唱开始
var test_skill_prepare_1:any = {}
test_skill_prepare_1.code = resultOptions.RCODE_SPELL_PREPARE
test_skill_prepare_1.spellId = 9999
test_skill_prepare_1.caster = FightResultSpace.caster
test_skill_prepare_1.casterList = 0
test_skill_prepare_1.target = FightResultSpace.caster + FightResultSpace.count
test_skill_prepare_1.targetList = targetList
test_skill_prepare_1.protector = 0
test_skill_prepare_1.fail = 0
test_skill_prepare_1.castCount = 1
test_skill_prepare_1.powerCount = 0
test_skill_prepare_1.round = 1
test_skill_prepare_1.fightPowers = []

//吟唱结束
var test_skill_prepare_2:any = {}
test_skill_prepare_2.code = resultOptions.RCODE_SPELL_PREPARE_HIT
test_skill_prepare_2.spellId = 9999
test_skill_prepare_2.caster = FightResultSpace.caster
test_skill_prepare_2.casterList = 0
test_skill_prepare_2.target = FightResultSpace.caster + FightResultSpace.count
test_skill_prepare_2.targetList = targetList
test_skill_prepare_2.protector = 0
test_skill_prepare_2.fail = 0
test_skill_prepare_2.castCount = 1
test_skill_prepare_2.powerCount = 1
test_skill_prepare_2.round = 1
test_skill_prepare_2.fightPowers = []
test_skill_prepare_2.fightPowers[0] = {}
test_skill_prepare_2.fightPowers[0].caster = 0
test_skill_prepare_2.fightPowers[0].target = FightResultSpace.caster + FightResultSpace.count 
test_skill_prepare_2.fightPowers[0].effect = powerEffects.EFFECT_HP_LESS 
test_skill_prepare_2.fightPowers[0].status = 0
test_skill_prepare_2.fightPowers[0].point = 100
test_skill_prepare_2.fightPowers[0].times = 1   
test_skill_prepare_2.fightPowers[0].buffLevel = 1
test_skill_prepare_2.fightPowers[0].buffSpecial = 25

var test_skill_prepare_list:any[] = []
JsUtil.arrayInstert(test_skill_prepare_list, test_skill_prepare_1)
JsUtil.arrayInstert(test_skill_prepare_list, test_skill_prepare_2)


//持续技能
var test_skill_interval_1:any = {}
test_skill_interval_1.code = resultOptions.RCODE_SPELL_INTERVAL
test_skill_interval_1.spellId = 9999
test_skill_interval_1.caster = FightResultSpace.caster
test_skill_interval_1.casterList = 0
test_skill_interval_1.target = FightResultSpace.caster + FightResultSpace.count
test_skill_interval_1.targetList = targetList
test_skill_interval_1.protector = 0
test_skill_interval_1.fail = 0
test_skill_interval_1.castCount = 1
test_skill_interval_1.powerCount = 0
test_skill_interval_1.round = 1
test_skill_interval_1.fightPowers = []

var test_skill_interval_2:any = {}
test_skill_interval_2.code = resultOptions.RCODE_SPELL_INTERVAL_HIT
test_skill_interval_2.spellId = 9999
test_skill_interval_2.caster = FightResultSpace.caster
test_skill_interval_2.casterList = 0
test_skill_interval_2.target = FightResultSpace.caster + FightResultSpace.count
test_skill_interval_2.targetList = Math.pow(2, (FightResultSpace.fightFormation[FightResultSpace.caster - 1] - 1) )
test_skill_interval_2.protector = 0
test_skill_interval_2.fail = 0
test_skill_interval_2.castCount = 1
test_skill_interval_2.powerCount = 1
test_skill_interval_2.round = 1
test_skill_interval_2.fightPowers = []
test_skill_interval_2.fightPowers[0] = {}
test_skill_interval_2.fightPowers[0].caster = 0
test_skill_interval_2.fightPowers[0].target = FightResultSpace.caster + FightResultSpace.count
test_skill_interval_2.fightPowers[0].effect = powerEffects.EFFECT_HP_LESS 
test_skill_interval_2.fightPowers[0].status = 0
test_skill_interval_2.fightPowers[0].point = 100
test_skill_interval_2.fightPowers[0].times = 1   
test_skill_interval_2.fightPowers[0].buffLevel = 1
test_skill_interval_2.fightPowers[0].buffSpecial = 25

test_skill_interval_2.fightPowers[1] = {}
test_skill_interval_2.fightPowers[1].caster = 0
test_skill_interval_2.fightPowers[1].target = FightResultSpace.caster + FightResultSpace.count
test_skill_interval_2.fightPowers[1].effect = powerEffects.EFFECT_ATTACKED//powerEffects.EFFECT_DODGE
test_skill_interval_2.fightPowers[1].status = 0
test_skill_interval_2.fightPowers[1].point = 0
test_skill_interval_2.fightPowers[1].times = 1

var test_skill_interval_3:any = {}
test_skill_interval_3.code = resultOptions.RCODE_SPELL_INTERVAL_HIT
test_skill_interval_3.spellId = 9999
test_skill_interval_3.caster = FightResultSpace.caster
test_skill_interval_3.casterList = 0
test_skill_interval_3.target = FightResultSpace.caster + FightResultSpace.count + 1
test_skill_interval_3.targetList = Math.pow(2, (FightResultSpace.fightFormation[FightResultSpace.caster] - 1) )
test_skill_interval_3.protector = 0
test_skill_interval_3.fail = 0
test_skill_interval_3.castCount = 1
test_skill_interval_3.powerCount = 1
test_skill_interval_3.round = 1
test_skill_interval_3.fightPowers = []
test_skill_interval_3.fightPowers[0] = {}
test_skill_interval_3.fightPowers[0].caster = 0
test_skill_interval_3.fightPowers[0].target = FightResultSpace.caster + FightResultSpace.count + 1
test_skill_interval_3.fightPowers[0].effect = powerEffects.EFFECT_HP_LESS 
test_skill_interval_3.fightPowers[0].status = 0
test_skill_interval_3.fightPowers[0].point = 200
test_skill_interval_3.fightPowers[0].times = 1   
test_skill_interval_3.fightPowers[0].buffLevel = 1
test_skill_interval_3.fightPowers[0].buffSpecial = 25

test_skill_interval_3.fightPowers[1] = {}
test_skill_interval_3.fightPowers[1].caster = 0
test_skill_interval_3.fightPowers[1].target = FightResultSpace.caster + FightResultSpace.count + 1
test_skill_interval_3.fightPowers[1].effect = powerEffects.EFFECT_ATTACKED//powerEffects.EFFECT_DODGE
test_skill_interval_3.fightPowers[1].status = 0
test_skill_interval_3.fightPowers[1].point = 0
test_skill_interval_3.fightPowers[1].times = 1

var test_skill_interval_4:any = {}
test_skill_interval_4.code = resultOptions.RCODE_SPELL_INTERVAL_HIT
test_skill_interval_4.spellId = 9999
test_skill_interval_4.caster = FightResultSpace.caster
test_skill_interval_4.casterList = 0
test_skill_interval_4.target = FightResultSpace.caster + FightResultSpace.count + 2
test_skill_interval_4.targetList = Math.pow(2, (FightResultSpace.fightFormation[FightResultSpace.caster + 1] - 1) )
test_skill_interval_4.protector = 0
test_skill_interval_4.fail = 0
test_skill_interval_4.castCount = 1
test_skill_interval_4.powerCount = 1
test_skill_interval_4.round = 1
test_skill_interval_4.fightPowers = []
test_skill_interval_4.fightPowers[0] = {}
test_skill_interval_4.fightPowers[0].caster = 0
test_skill_interval_4.fightPowers[0].target = FightResultSpace.caster + FightResultSpace.count + 2
test_skill_interval_4.fightPowers[0].effect = powerEffects.EFFECT_HP_LESS 
test_skill_interval_4.fightPowers[0].status = 0
test_skill_interval_4.fightPowers[0].point = 200
test_skill_interval_4.fightPowers[0].times = 1   
test_skill_interval_4.fightPowers[0].buffLevel = 1
test_skill_interval_4.fightPowers[0].buffSpecial = 25

test_skill_interval_4.fightPowers[1] = {}
test_skill_interval_4.fightPowers[1].caster = 0
test_skill_interval_4.fightPowers[1].target = FightResultSpace.caster + FightResultSpace.count + 2
test_skill_interval_4.fightPowers[1].effect = powerEffects.EFFECT_ATTACKED//powerEffects.EFFECT_DODGE
test_skill_interval_4.fightPowers[1].status = 0
test_skill_interval_4.fightPowers[1].point = 0
test_skill_interval_4.fightPowers[1].times = 1

var test_skill_interval_5:any = {}
test_skill_interval_5.code = resultOptions.RCODE_SPELL_INTERVAL_END
test_skill_interval_5.spellId = 9999
test_skill_interval_5.caster = FightResultSpace.caster
test_skill_interval_5.casterList = 0
test_skill_interval_5.target = FightResultSpace.caster + FightResultSpace.count
test_skill_interval_5.targetList = targetList
test_skill_interval_5.protector = 0
test_skill_interval_5.fail = 0
test_skill_interval_5.castCount = 1
test_skill_interval_5.powerCount = 0
test_skill_interval_5.round = 1
test_skill_interval_5.fightPowers = []

var test_skill_interval_list:any[] = []
JsUtil.arrayInstert(test_skill_interval_list, test_skill_interval_1)
JsUtil.arrayInstert(test_skill_interval_list, test_skill_interval_2)
JsUtil.arrayInstert(test_skill_interval_list, test_skill_interval_3)
JsUtil.arrayInstert(test_skill_interval_list, test_skill_interval_4)
JsUtil.arrayInstert(test_skill_interval_list, test_skill_interval_5)



//只有power的result
var test_power_result_buff:any = {}
test_power_result_buff.code = resultOptions.RCODE_POWER
test_power_result_buff.round = 1
test_power_result_buff.powerCount = 1
test_power_result_buff.caster = 100
test_power_result_buff.castCount = 1
test_power_result_buff.fightPowers = []
test_power_result_buff.fightPowers[0] = {}
test_power_result_buff.fightPowers[0].target = FightResultSpace.caster
test_power_result_buff.fightPowers[0].effect = powerEffects.EFFECT_ADD_BUFF
test_power_result_buff.fightPowers[0].buff = 10002
test_power_result_buff.fightPowers[0].times = 1

