////////////////////////////////////////////////////////////////////////////////
//fight result config
////////////////////////////////////////////////////////////////////////////////

var resultOptions:any = {
	RCODE_POWER              : 1, //只包含power      {code, powerCount}
	RCODE_SPELL_HIT          : 2, //攻击             {code, skillId, caster, target, targetList, powerCount}
	RCODE_SPELL_PREPARE      : 3, //技能开始吟唱     {code, skillId, caster}
	RCODE_SPELL_PREPARE_HIT  : 4, //技能结束吟唱     {code, skillId, caster, target, targetList, powerCount}
	RCODE_SPELL_INTERVAL     : 5, //技能开始持续施法 {code, skillId, caster}
	RCODE_SPELL_INTERVAL_HIT : 6, //技能持续施法     {code, skillId, caster, target, targetList, powerCount}
	RCODE_SPELL_INTERVAL_END : 7, //技能结束持续施法 {code, skillId, caster}
	RCODE_ADD_MONSTER        : 8, //召唤             {code, caster, powerCount}
	RCODE_SPELL_SPIRIT_HIT   : 9, //翅膀攻击         {code, skillId, caster, target, targetList, powerCount}
}

//FightResult = 
//{
//	code : 0,         //指令代码
//	spellId : 0,      //技能ID / AI_WORD索引
//	caster : 0,       //行动者ID
//	target : 0,       //目标ID 
//	targetList : 0,   //目标列表
//	fail : 0,         //成功或失败 (0成功1失败)
//	castCount : 1,    //施放总次数
//	powerCount : 0,   //指令产生的效果个数
//	fightPowers : null,//power列表
//}

// function setTagList(result, attackerSide, targetList){
// 	for(let _ in targetList){
// 			let target = targetList[_]
	
// 		result.targetList = bit.bor(result.targetList, tagList[target.pos])
// 		if(target.side == attackerSide ){
// 			result.targetList = bit.bor(result.targetList, opBattleSideTag)
// 		}
// 	}
// }

// target list
// 使用位操作检测群技能目标,后20位定位,第一位判断是自方还是对方。
var tagList:any = {
	[1]  : 0x00000001,
	[2]  : 0x00000002,
	[3]  : 0x00000004,
	[4]  : 0x00000008,
	[5]  : 0x00000010,
	[6]  : 0x00000020,
	[7]  : 0x00000040,
	[8]  : 0x00000080,
	[9]  : 0x00000100,
	[10] : 0x00000200,
	[11] : 0x00000400,
	[12] : 0x00000800, 
	[13] : 0x00001000,
	[14] : 0x00002000,
	[15] : 0x00004000,
	[16] : 0x00008000,
	[17] : 0x00010000,
	[18] : 0x00020000,
	[19] : 0x00040000,
	[20] : 0x00080000,
	[21] : 0x00100000,
	[22] : 0x00200000,
	[23] : 0x00400000,
	[24] : 0x00800000,
	[25] : 0x01000000,
	[26] : 0x02000000,
	[27] : 0x04000000,
	[28] : 0x08000000,
	[29] : 0x10000000,
	[30] : 0x20000000,
	[31] : 0x40000000,
	[32] : 0x80000000,
}

var opBattleSideTag = 0x20000000