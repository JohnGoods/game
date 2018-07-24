////////////////////////////////////////////////////////////////////////////////
//fight power config
////////////////////////////////////////////////////////////////////////////////

//
var powerXPFlag:any = {
	NOT_SHOW  : 0, //不显示
	NORMAL    : 1, //普通
	CRITICAL  : 2, //暴击
}

//
var powerEffects:any = {
	EFFECT_HP_PLUS      : 1,  //HP+      {effect, targetId, value, flag} flag:0:不显示1:普通2:暴击
	EFFECT_HP_LESS      : 2,  //HP-      {effect, targetId, value, flag} flag:0:不显示1:普通2:暴击
	EFFECT_MAXHP_PLUS   : 3,  //MAXHP+   {effect, targetId, value, flag} flag:0:不显示1:普通2:暴击
	EFFECT_MAXHP_LESS   : 4,  //MAXHP-   {effect, targetId, value, flag} flag:0:不显示1:普通2:暴击
	EFFECT_RP_PLUS      : 5,  //RP+      {effect, targetId, value, flag} flag:0:不显示1:普通2:暴击
	EFFECT_RP_LESS      : 6,  //RP-      {effect, targetId, value, flag} flag:0:不显示1:普通2:暴击
	EFFECT_MISS         : 7,  //不命中   {effect, targetId}
	EFFECT_DODGE        : 8,  //躲闪     {effect, targetId}
	EFFECT_ATTACKED     : 9,  //受击     {effect, targetId}
	EFFECT_ADD_BUFF     : 10, //BUFF+    {effect, targetId, buffId, life, count}
	EFFECT_DEL_BUFF     : 11, //BUFF-    {effect, targetId, buffId, life, count}
	EFFECT_UPDATE_BUFF  : 12, //update   {effect, targetId, buffId, life, count}
	EFFECT_IMMUNIZE     : 13, //免疫buff {effect, targetId}
	EFFECT_RESIST       : 14, //抵抗buff {effect, targetId}
	EFFECT_BREAK        : 15, //打断     {effect, targetId}
	EFFECT_MOVE         : 16, //移动     {effect, targetId, dir}
	EFFECT_STATUS       : 17, //状态     {effect, targetId, status}
	EFFECT_DROP_GOLD    : 18, //掉落金币 {effect, targetId, value}
	EFFECT_DROP_ITEM    : 19, //掉落物品 {effect, targetId, itemId, quality}
	EFFECT_ABSORB       : 20, //吸收伤害 {effect, targetId}
	EFFECT_SPIRIT_CD    : 21, //翅膀技能CD {effect, side, time}
	EFFECT_FIGHTER_ADD  : 22, //召唤     {effect, roleId, objectType, id, side, pos, hp, maxHp, rp, maxRp, name, entryId, manualSkill, esotericSkill, manualCast, sex, quality}
	EFFECT_FIGHTER_DISAPPEAR : 23, //召唤消失 {effect, id}
	EFFECT_NOTARGET     : 24, //没有目标 {effect, targetId}
	EFFECT_REBOUND      : 25, //反弹     {effect, casterId, targetId, buffId}
	EFFECT_RESERVE      : 26, //替补     {effect, roleId, objectType, id, side, pos, hp, maxHp, rp, maxRp, name, entryId, manualSkill, esotericSkill, manualCast, sex, quality}
	EFFECT_MP_PLUS      : 27, //MP+      {effect, roleId, value, flag}   flag:0:不显示1:普通2:暴击
	EFFECT_MP_LESS      : 28, //MP-      {effect, roleId, value, flag}   flag:0:不显示1:普通2:暴击
	EFFECT_SKILL_CD     : 29, //手动技能CD {effect, casterId, skillId, cdTime}

	EFFECT_MP_VALUE     : 30, //MP       {effect, roleId, value, flag}   flag:0:不显示1:普通2:暴击 
	EFFECT_RP_VALUE     : 31, //RP       {effect, targetId, value, flag} flag:0:不显示1:普通2:暴击 
	EFFECT_SET_ROUND    : 32, //回合数   {effect, round}

}

//表现状态
var powerStatus:any = {
	PSTATUS_TARGET_DIE          : 1, //目标死亡
	PSTATUS_DEATH_NOT_DISAPPEAR : 2, //死亡不出场
}

