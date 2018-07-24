let opCodes:any = {
    CMSG_REGION_NOTICE              : 9,
    SMSG_RESULT                     : 40, //
    SMSG_RESULT_STRING              : 41, //字符串消息
    SMSG_RESULT_LOGOUT              : 42, //通知客户端下线

    C2G_RPC_CALL               :45,  //RPC调用
    G2C_RPC_CALL               :46,
    G2C_RPC_CALL_UPDATE        :47,

    GAME_MSG_ROLE_BEGIN             : 50,
    GAME_MSG_PET_BEGIN              : 200,
    GAME_MSG_FIGHT_BEGIN            : 400,
    GAME_MSG_TASK_BENGN             : 600,
    GAME_MSG_ITEM_BEGIN             : 800,
    GAME_MSG_TEAM_BEGIN             : 1000,
    GAME_MSG_BUFF_BEGIN             : 1100,
    GAME_MSG_CHANNEL_BEGIN          : 1200,
    //GAME_MSG_SKILL_BEGIN            : 1400,
    //GAME_MSG_FACTION_BEGIN          : 1600,
    // GAME_MSG_ROBBER_BEGIN           : 1800,
    // GAME_MSG_LOSTTEMPLE_BEGIN       : 1900,
    GAME_MSG_FRIEND_BEGIN           : 2000,
    //GAME_MSG_PLAYER_TALK_BEGIN      : 2200,
    GAME_MSG_PLAYER_CARD_BEGIN      : 2400,
    GAME_MSG_EXCITE_BEGIN           : 2600,
    GAME_MSG_VERIFY_BEGIN           : 3200,
    GAME_MSG_ACTIVITY_BEGIN         : 3400,
    //GAME_MSG_SHOP_BEGIN             : 3600,
    //GAME_MSG_WORLDBOSS_BEGIN        : 3800,
    GAME_MSG_WORLDQUESTION_BEGIN    : 3900,
    GAME_MSG_WUDOU_BEGIN            : 4000,
    //GAME_MSG_FACTIONMAP_BEGIN       : 4100,
    //GAME_MSG_MALL_BEGIN             : 4200,
    // GAME_MSG_WUDOUTEAM_BEGIN        : 4300,
    // GAME_MSG_WUDOUSERVER_BEGIN      : 4400,
    // GAME_MSG_UNION_MATRIX_BEGIN     : 4500,
    // GAME_MSG_EQUIP_BEGIN            : 5600,
    GAME_MSG_EMAIL_BEGIN            : 5700,
    //GAME_MSG_STONE_BEGIN            : 5800,
    // GAME_MSG_RELIC_MINE_BEGIN       : 5900,
    // GAME_MSG_ZHENXING_BEGIN         : 6000,
    // GAME_MSG_FACTIONWAR_BEGIN       : 6100,
    // GAME_MSG_FAIRY_BEGIN            : 6200,
    // GAME_MSG_SIEGE_BEGIN            : 6400,
    // GAME_MSG_UNION_BEGIN            : 6500,
    // GAME_MSG_BATTLEFEILD_BEGIN      : 6600,
    // GAME_MSG_FOG_FOREST_BEGIN       : 6700,
    // GAME_MSG_COMBATTEAM             : 6800,
    // GAME_MSG_FACTIONWARSERVER_BEGIN : 6900,
    // GAME_MSG_RUNMAN_BEGIN           : 7000,
    // GAME_MSG_WING_BEGIN             : 7100,
    // GAME_MSG_FESTIVAL_BEGIN         : 7200,
    // GAME_MSG_DEAD_FIELD_BEGIN       : 7400,
    // GAME_MSG_SECRET_LAND_BEGIN      : 7500,
    // GAME_MSG_LEAGUE_MATCH_BEGIN     : 7600,
    // GAME_MSG_LEAGUE_BEGIN           : 7670,
    // GAME_MSG_GUOZHAN_BEGIN          : 7700,
    // GAME_MSG_WARFORMATION_BEGIN     : 7800,
    // GAME_MSG_NEWS_PAPER_BEGIN       : 7900,
    // GAME_MSG_ACTIVITY_V2_BEGIN      : 8000,
    // GAME_MSG_OPERATE_BEGIN          : 8100,
    // GAME_MSG_RIDE_BEGIN             : 8200,
    // GAME_MSG_UNIONSERVER_BEGIN      : 8300,
    // GAME_MSG_GUOZHANCST_BEGIN       : 8400,
    // GAME_MSG_MARRY_BEGIN            : 8500, //结婚
    // GAME_MSG_ROLE_BEGIN_V2          : 8600, //角色信息
     GAME_MSG_GLOBAL_BEGIN           : 9000,
    // GAME_MSG_VOCATION_BEGIN         : 9200, //和职业相关//
    // GAME_MSG_PARTNER_VOCATION_BEGIN : 9400, //部下职业共同协议//
    // GMAE_MSG_EMPLOY_BEGIN           : 9500, //雇佣
    // GMAE_MSG_ROLE_BEGIN				: 9600, 
	// GMAE_MSG_RPX_BEGIN				: 9700, 
    GAME_MSG_COUNT                  : 10000,
}

//role
opCodes.G2C_HERO_INFO                    = opCodes.GAME_MSG_ROLE_BEGIN + 1   //英雄角色信息
opCodes.C2G_MAP_ENTER                    = opCodes.GAME_MSG_ROLE_BEGIN + 2   //进入地图
opCodes.G2C_MAP_ENTER                    = opCodes.GAME_MSG_ROLE_BEGIN + 3   //跳转地图
opCodes.C2G_MOVE                         = opCodes.GAME_MSG_ROLE_BEGIN + 4   //角色移动
opCodes.G2C_MOVE                         = opCodes.GAME_MSG_ROLE_BEGIN + 5   //角色移动数据
opCodes.G2C_ROLE_ADD                     = opCodes.GAME_MSG_ROLE_BEGIN + 6   //角色出现
opCodes.G2C_DISAPPEAR                    = opCodes.GAME_MSG_ROLE_BEGIN + 7   //对象消失 (注意引擎修改了自动触发的对象消失,不交给脚本处理, G2C_DISAPPEAR=57不要修改)
opCodes.G2C_ROLE_CHANGE                  = opCodes.GAME_MSG_ROLE_BEGIN + 8   //角色外形变化
opCodes.G2C_OBJECT_ADD                   = opCodes.GAME_MSG_ROLE_BEGIN + 9   //对象出现
opCodes.G2C_OBJECT_UPDATE                = opCodes.GAME_MSG_ROLE_BEGIN + 10  //对象属性更新
//opCodes.G2C_ROLE_EQUIPS                  = opCodes.GAME_MSG_ROLE_BEGIN + 11  //角色装备
opCodes.C2G_ROLE_APPEAR                  = opCodes.GAME_MSG_ROLE_BEGIN + 12  //角色换装
opCodes.C2G_ROLE_REFRESH_NPC             = opCodes.GAME_MSG_ROLE_BEGIN + 13	 //更新NPC
opCodes.C2G_ROLE_SETTING                 = opCodes.GAME_MSG_ROLE_BEGIN + 14	 //个人设置
opCodes.C2G_ROLE_RANK                    = opCodes.GAME_MSG_ROLE_BEGIN + 15  //请求排行信息
opCodes.G2C_ROLE_RANK_REFRESH            = opCodes.GAME_MSG_ROLE_BEGIN + 16	 //排行更新
opCodes.C2G_ROLE_CHANGE_NAME             = opCodes.GAME_MSG_ROLE_BEGIN + 17	 //改名
opCodes.C2G_ROLE_CHECK                   = opCodes.GAME_MSG_ROLE_BEGIN + 18  //角色检查
opCodes.C2G_ROLE_NEWBIE_SETTING_RECORD   = opCodes.GAME_MSG_ROLE_BEGIN + 19  //设置功能按钮状态
opCodes.G2C_ROLE_APPLY_FACTION_LIST      = opCodes.GAME_MSG_ROLE_BEGIN + 20  //角色军团申请列表
opCodes.C2G_ROLE_RANK_INFO               = opCodes.GAME_MSG_ROLE_BEGIN + 21  //查询人物信息
opCodes.G2C_ROLE_RANK_INFO               = opCodes.GAME_MSG_ROLE_BEGIN + 22  //查询人物信息
// opCodes.C2G_LEARN_EQUIP_ENCHANT          = opCodes.GAME_MSG_ROLE_BEGIN + 23  //学习装备加持
// opCodes.C2G_ROLE_ENTER_SPACE             = opCodes.GAME_MSG_ROLE_BEGIN + 24  //进入个人空间
// opCodes.G2C_ROLE_ENTER_SPACE             = opCodes.GAME_MSG_ROLE_BEGIN + 25  //进入个人空间
// opCodes.C2G_ROLE_LEAVE_SPACE             = opCodes.GAME_MSG_ROLE_BEGIN + 26  //离开个人空间
// opCodes.G2C_ROLE_LEAVE_SPACE             = opCodes.GAME_MSG_ROLE_BEGIN + 27  //离开个人空间
// opCodes.G2C_ROLE_ALL_PET                 = opCodes.GAME_MSG_ROLE_BEGIN + 28  //所有宠物的Id包括已经删除的宠物
// opCodes.C2G_ROLE_SPECIAL_EVENT         	 = opCodes.GAME_MSG_ROLE_BEGIN + 29  //惊喜设定领取奖励
// opCodes.G2C_LEARN_EQUIP_ENCHANT          = opCodes.GAME_MSG_ROLE_BEGIN + 30  //学习装备加持
// opCodes.G2C_OUT_TIME_ACTIVITIES          = opCodes.GAME_MSG_ROLE_BEGIN + 31  //失效的活动列表
// opCodes.G2C_ROLE_SPECIAL_EVENT           = opCodes.GAME_MSG_ROLE_BEGIN + 32  //惊喜设定奖励列表
opCodes.C2G_PAY                          = opCodes.GAME_MSG_ROLE_BEGIN + 33  //支付
opCodes.G2C_PAY                          = opCodes.GAME_MSG_ROLE_BEGIN + 34  //支付
opCodes.C2G_PAY_CHEAT                    = opCodes.GAME_MSG_ROLE_BEGIN + 35  //支付 假的只为了PC版本测试用。正式版本要去掉
opCodes.G2C_ROLE_NEW_ERRANTRY            = opCodes.GAME_MSG_ROLE_BEGIN + 36  //新手指引进度
// opCodes.C2G_GET_SKY_TOWER_INFO           = opCodes.GAME_MSG_ROLE_BEGIN + 37  //获取天空之塔信息
// opCodes.G2C_GET_SKY_TOWER_INFO           = opCodes.GAME_MSG_ROLE_BEGIN + 38  //获取天空之塔信息
// opCodes.G2C_ROLE_SPECIAL_EVENT_RECORD    = opCodes.GAME_MSG_ROLE_BEGIN + 39  //惊喜系统记录
opCodes.C2G_ROLE_NEWBIE_CHANGE           = opCodes.GAME_MSG_ROLE_BEGIN + 40  //新手功能按钮开启(改变)
// opCodes.C2G_ROLE_DETAILED_INFO           = opCodes.GAME_MSG_ROLE_BEGIN + 41  //个人的详细信息
// opCodes.G2C_ROLE_DETAILED_INFO           = opCodes.GAME_MSG_ROLE_BEGIN + 42  //个人的详细信息
// opCodes.G2C_ROLE_PET_LIST_INFO           = opCodes.GAME_MSG_ROLE_BEGIN + 43  //查看其他人宠物列表
// opCodes.C2G_ROLE_PET_LIST_INFO           = opCodes.GAME_MSG_ROLE_BEGIN + 44  //查看其他人宠物列表
// opCodes.G2C_ROLE_HONOR_TITLE_LIST        = opCodes.GAME_MSG_ROLE_BEGIN + 45  //荣誉列表
// opCodes.C2G_ROLE_HONOR_TITLE_LIST        = opCodes.GAME_MSG_ROLE_BEGIN + 46  //荣誉列表
// opCodes.C2G_ROLE_HONOR_TITLE             = opCodes.GAME_MSG_ROLE_BEGIN + 47  //荣誉称号
// opCodes.G2C_ROLE_HONOR_TITLE             = opCodes.GAME_MSG_ROLE_BEGIN + 48  //荣誉称号
opCodes.G2C_ROLE_CHAMPION_RANK           = opCodes.GAME_MSG_ROLE_BEGIN + 49  //排行榜排名
opCodes.C2G_ROLE_CHAMPION_RANK           = opCodes.GAME_MSG_ROLE_BEGIN + 50  //排行榜排名
// opCodes.G2C_ROLE_WUDOU_RANK              = opCodes.GAME_MSG_ROLE_BEGIN + 51  //斗技大赛排名
// opCodes.C2G_ROLE_WUDOU_RANK              = opCodes.GAME_MSG_ROLE_BEGIN + 52  //斗技大赛排名
opCodes.G2C_ROLE_CREATE_TIME             = opCodes.GAME_MSG_ROLE_BEGIN + 53  //角色创建时间
// opCodes.C2G_ROLE_GET_POWER               = opCodes.GAME_MSG_ROLE_BEGIN + 54  //领取体力
opCodes.C2G_ROLE_OPER_NODE               = opCodes.GAME_MSG_ROLE_BEGIN + 55  //记录玩家的操作节点
opCodes.C2G_ROLE_BIND_ACCOUNT            = opCodes.GAME_MSG_ROLE_BEGIN + 56  //绑定账号奖励
// opCodes.C2G_ROLE_LEVEL_FUND              = opCodes.GAME_MSG_ROLE_BEGIN + 57  //购买等级基金
// opCodes.G2C_ROLE_LEVEL_FUND              = opCodes.GAME_MSG_ROLE_BEGIN + 58  //购买等级基金
// opCodes.C2G_ROLE_LEVEL_FUND_REWARD       = opCodes.GAME_MSG_ROLE_BEGIN + 59  //购买等级基金奖励
opCodes.G2C_ROLE_BAN_STATUS              = opCodes.GAME_MSG_ROLE_BEGIN + 60  //封禁状态
opCodes.C2G_ROLE_ADD_BLACK_ROLE          = opCodes.GAME_MSG_ROLE_BEGIN + 61  //把某个ＩＤ加入黑名单
opCodes.C2G_ROLE_REMOVE_BLACK_ROLE       = opCodes.GAME_MSG_ROLE_BEGIN + 62  //把某个ＩＤ从黑名单中移除
opCodes.C2G_ROLE_REQUEST_BLACK_ROLE      = opCodes.GAME_MSG_ROLE_BEGIN + 63  //请求黑名单列表
opCodes.G2C_ROLE_RESONPD_BLACK_ROLE      = opCodes.GAME_MSG_ROLE_BEGIN + 64  //返回黑名单列表
// opCodes.G2C_ROLE_HONOR_HINT              = opCodes.GAME_MSG_ROLE_BEGIN + 65  //荣誉红点提醒
// opCodes.C2G_ROLE_HONOR_POINT             = opCodes.GAME_MSG_ROLE_BEGIN + 66  //称号积分
// opCodes.G2C_ROLE_HONOR_POINT             = opCodes.GAME_MSG_ROLE_BEGIN + 67  //称号积分
// opCodes.G2C_ROLE_HONOR_POINT_PRIZE       = opCodes.GAME_MSG_ROLE_BEGIN + 68  //领取成就奖励
// opCodes.C2G_ROLE_HONOR_POINT_PRIZE       = opCodes.GAME_MSG_ROLE_BEGIN + 69  //领取成就奖励
// opCodes.G2C_ROLE_VIP_ENTER_MAP           = opCodes.GAME_MSG_ROLE_BEGIN + 70  //vip进入地图提示
opCodes.G2C_ROLE_CHANGE_NAME             = opCodes.GAME_MSG_ROLE_BEGIN + 71  //改名
opCodes.C2G_ROLE_PET_SOUL_POINT          = opCodes.GAME_MSG_ROLE_BEGIN + 72  //碎魂数量
opCodes.G2C_ROLE_PET_SOUL_POINT          = opCodes.GAME_MSG_ROLE_BEGIN + 73  //碎魂数量
// opCodes.C2G_SET_SEX                      = opCodes.GAME_MSG_ROLE_BEGIN + 74  //设置性别
// opCodes.C2G_CHANGE_SEX                   = opCodes.GAME_MSG_ROLE_BEGIN + 75  //更改性别
// opCodes.G2C_ALL_EQUIP_LIST               = opCodes.GAME_MSG_ROLE_BEGIN + 76  //所有装备列表
opCodes.G2C_ROLE_RANK                    = opCodes.GAME_MSG_ROLE_BEGIN + 77  //请求排行信息
// opCodes.C2G_ROLE_HOME_PAGE_INFO          = opCodes.GAME_MSG_ROLE_BEGIN + 78  //主页信息
// opCodes.G2C_ROLE_HOMOE_PAGE_INFO         = opCodes.GAME_MSG_ROLE_BEGIN + 79  //主页信息
// opCodes.C2G_ROLE_HOME_PAGE_PRAISE        = opCodes.GAME_MSG_ROLE_BEGIN + 80  //主页点赞
// opCodes.C2G_ROLE_HOME_PAGE_FLOWERS       = opCodes.GAME_MSG_ROLE_BEGIN + 81  //主页送花
// opCodes.C2G_ROLE_HOME_PAGE_INTRODUCE     = opCodes.GAME_MSG_ROLE_BEGIN + 82  //主页修改介绍
// opCodes.C2G_ROLE_HOME_PAGE_ITEM_LIST     = opCodes.GAME_MSG_ROLE_BEGIN + 83  //主页放置礼物
// opCodes.C2G_ROLE_HOME_PAGE_MESSAGE       = opCodes.GAME_MSG_ROLE_BEGIN + 84  //查看主页留言
// opCodes.G2C_ROLE_HOME_PAGE_MESSAGE       = opCodes.GAME_MSG_ROLE_BEGIN + 85  //查看主页留言
// opCodes.C2G_ROLE_HOME_PAGE_PICK_FLOWER   = opCodes.GAME_MSG_ROLE_BEGIN + 86  //捡取鲜花
// opCodes.G2C_ROLE_HOME_PAGE_ITEM_LIST     = opCodes.GAME_MSG_ROLE_BEGIN + 87  //主页放置礼物
// opCodes.C2G_ROLE_HOME_PAGE_SET_ICON      = opCodes.GAME_MSG_ROLE_BEGIN + 88  //设置头像
// opCodes.C2G_ROLE_HOME_PAGE_REMOVE_ICON   = opCodes.GAME_MSG_ROLE_BEGIN + 89  //删除头像
// opCodes.C2G_ROLE_HOME_PAGE_LEAVE_MESSAGE = opCodes.GAME_MSG_ROLE_BEGIN + 90  //主页留言
// opCodes.C2G_ROLE_HOME_PAGE_LEAVE         = opCodes.GAME_MSG_ROLE_BEGIN + 91  //离开主页
opCodes.C2G_ROLE_MONEY_UNIT_POINT        = opCodes.GAME_MSG_ROLE_BEGIN + 92  //获取货币
opCodes.G2C_ROLE_MONEY_UNIT_POINT        = opCodes.GAME_MSG_ROLE_BEGIN + 93  //获取货币
// opCodes.C2G_ROLE_GET_NEW_SUMMON_STONE    = opCodes.GAME_MSG_ROLE_BEGIN + 94  //获取/使用新手召唤石
// opCodes.C2G_ROLE_HOME_PAGE_MESSAGE_CLEAR = opCodes.GAME_MSG_ROLE_BEGIN + 95  //清空留言
opCodes.G2C_ROLE_FUNCTION_NOTICE         = opCodes.GAME_MSG_ROLE_BEGIN + 96  //功能红点提醒
// opCodes.G2C_ROLE_MAP_NPC_LIST            = opCodes.GAME_MSG_ROLE_BEGIN + 97  //地图npc查询
// opCodes.C2G_ROLE_MAP_NPC_LIST            = opCodes.GAME_MSG_ROLE_BEGIN + 98  //地图npc查询
// opCodes.C2G_ROLE_HOME_PAGE_POUND_EGG     = opCodes.GAME_MSG_ROLE_BEGIN + 99  //砸鸡蛋
// opCodes.G2C_ROLE_CHAT_WINDOW_LIST        = opCodes.GAME_MSG_ROLE_BEGIN + 100 //设置功能按钮状态
opCodes.C2G_ROLE_NEWBIE_SAVE_RECORD      = opCodes.GAME_MSG_ROLE_BEGIN + 101 //保存指引记录
opCodes.G2C_ROLE_NEWBIE_SETTING_RECORD   = opCodes.GAME_MSG_ROLE_BEGIN + 102 //设置功能按钮状态
// opCodes.C2G_ROLE_RECHARGE_BUY_PET        = opCodes.GAME_MSG_ROLE_BEGIN + 103 //充值购买伙伴
// opCodes.G2C_ROLE_RECHARGE_BUY_PET        = opCodes.GAME_MSG_ROLE_BEGIN + 104 //充值购买伙伴
// opCodes.C2G_ROLE_REMOVE_TIMER            = opCodes.GAME_MSG_ROLE_BEGIN + 105 //倒计时过期,移除key
//////////////////////////////////已满////////////////////////////////////

// //pet
// opCodes.G2C_PET_LIST                    = opCodes.GAME_MSG_PET_BEGIN + 1    //发送宠物列表信息
// opCodes.C2G_PET_USEITEM                 = opCodes.GAME_MSG_PET_BEGIN + 2    //使用物品
// opCodes.G2C_PET_UPDATE                  = opCodes.GAME_MSG_PET_BEGIN + 3    //对象属性更新
// opCodes.C2G_PET_ADD                     = opCodes.GAME_MSG_PET_BEGIN + 4    //加入一只宠物
// opCodes.G2C_PET_ADD                     = opCodes.GAME_MSG_PET_BEGIN + 5    //加宠物
// opCodes.G2C_PET_UPDATE_FIELD            = opCodes.GAME_MSG_PET_BEGIN + 6    //更新宠物域
// opCodes.C2G_PET_SOUL_FETE               = opCodes.GAME_MSG_PET_BEGIN + 7    //宠物英魂献祭
// opCodes.G2C_PET_BIND                    = opCodes.GAME_MSG_PET_BEGIN + 8    //伙伴状态
// opCodes.C2G_ENTER_PET_RECRUIT_HOOP      = opCodes.GAME_MSG_PET_BEGIN + 9    //宠物快速邀请刷环
// opCodes.G2C_ENTER_PET_RECRUIT_HOOP      = opCodes.GAME_MSG_PET_BEGIN + 10   //宠物快速邀请刷环
// opCodes.C2G_PET_RECRUIT_HOOP            = opCodes.GAME_MSG_PET_BEGIN + 11   //宠物快速邀请刷环
// //opCodes.G2C_PET_RECRUIT_HOOP            = opCodes.GAME_MSG_PET_BEGIN + 12   //宠物快速邀请刷环
// //opCodes.G2C_PET_RECRUIT_BATE_CONSUME    = opCodes.GAME_MSG_PET_BEGIN + 13   //宠物快速邀请挑战刷新次数与晶石
// //opCodes.G2C_PET_CAMPAIGN_INTIMATE       = opCodes.GAME_MSG_PET_BEGIN + 14   //关卡战斗亲密度奖励
// //opCodes.C2G_PET_RECRUIT_BATE_CONSUME    = opCodes.GAME_MSG_PET_BEGIN + 15   //宠物快速邀请挑战刷新次数与晶石
// ////opCodes.C2G_PET_BREAK_THROUGH           = opCodes.GAME_MSG_PET_BEGIN + 16   //宠物突破
// ////opCodes.G2C_PET_BREAK_THROUGH           = opCodes.GAME_MSG_PET_BEGIN + 17   //宠物突破
// opCodes.G2C_PET_COMBAT_FORCE_CHNAGE     = opCodes.GAME_MSG_PET_BEGIN + 18   //宠物总战力变化
// //opCodes.G2C_PET_ADVANCEEX               = opCodes.GAME_MSG_PET_BEGIN + 19   //异界邀请
// //opCodes.C2G_PET_ADVANCEEX               = opCodes.GAME_MSG_PET_BEGIN + 20   //异界邀请
// //opCodes.C2G_PET_ADVANCEEX_RECORD        = opCodes.GAME_MSG_PET_BEGIN + 21   //异界邀请攻略
// //opCodes.G2C_PET_ADVANCEEX_RECORD        = opCodes.GAME_MSG_PET_BEGIN + 22   //异界邀请攻略
// //opCodes.C2G_PET_ADVANCEEX_RECORD_PRAISE = opCodes.GAME_MSG_PET_BEGIN + 23   //异界邀请攻略赞/拍砖
// //opCodes.G2C_PET_ADVANCEEX_RECORD_PRAISE = opCodes.GAME_MSG_PET_BEGIN + 24   //异界邀请攻略赞/拍砖
// //opCodes.G2C_PET_REPLACE_SKILL           = opCodes.GAME_MSG_PET_BEGIN + 25   //替换技能
// //opCodes.G2C_PRAISE_RECORD               = opCodes.GAME_MSG_PET_BEGIN + 26   //异界邀请攻略赞/拍砖记录(个人)
// //opCodes.C2G_PRAISE_RECORD               = opCodes.GAME_MSG_PET_BEGIN + 27   //异界邀请攻略赞/拍砖记录(个人)
// //opCodes.C2G_PRAISE_CHANGE_RECORD        = opCodes.GAME_MSG_PET_BEGIN + 28   //修改异界邀请攻略赞/拍砖记录(个人)
// //opCodes.C2G_PET_COURAGE_LEVEL           = opCodes.GAME_MSG_PET_BEGIN + 29   //提升魄力等级
// //opCodes.C2G_PET_COURAGE_QUALITY         = opCodes.GAME_MSG_PET_BEGIN + 30   //提升魄力品阶
// //opCodes.G2C_ROLE_PET_COURAGE_QUALITY    = opCodes.GAME_MSG_PET_BEGIN + 31   //魄力品阶
// //opCodes.C2G_PET_INHERIT                 = opCodes.GAME_MSG_PET_BEGIN + 32   //部下传承
// //opCodes.G2C_PET_INHERIT                 = opCodes.GAME_MSG_PET_BEGIN + 33   //部下传承
// //opCodes.G2C_PET_ESSENCE_INFO            = opCodes.GAME_MSG_PET_BEGIN + 34   //部下专精信息
// //opCodes.C2G_PET_ESSENCE_INFO            = opCodes.GAME_MSG_PET_BEGIN + 35   //部下专精信息
// //opCodes.G2C_PET_ESSENCE_ABILITY         = opCodes.GAME_MSG_PET_BEGIN + 36   //部下专精属性
// //opCodes.C2G_PET_ESSENCE_ABILITY         = opCodes.GAME_MSG_PET_BEGIN + 37   //部下专精属性
// //opCodes.C2G_PET_ESSENCE                 = opCodes.GAME_MSG_PET_BEGIN + 38   //部下专精操作
// //opCodes.G2C_PET_ESSENCE                 = opCodes.GAME_MSG_PET_BEGIN + 39   //部下专精操作
// //opCodes.G2C_PET_ESSENCE_RESET           = opCodes.GAME_MSG_PET_BEGIN + 40   //部下专精重置
// //opCodes.C2G_PET_ESSENCE_RESET           = opCodes.GAME_MSG_PET_BEGIN + 41   //部下专精重置

// opCodes.C2G_PET_RECRUIT_RECORD_LIST     = opCodes.GAME_MSG_PET_BEGIN + 41   //部下召集记录
// opCodes.G2C_PET_RECRUIT_RECORD_LIST     = opCodes.GAME_MSG_PET_BEGIN + 42   //部下召集记录
// //opCodes.C2G_PET_ACTIVE_ADVANCE          = opCodes.GAME_MSG_PET_BEGIN + 43   //觉醒
// opCodes.C2G_PET_AWAKE					          = opCodes.GAME_MSG_PET_BEGIN + 44   //觉醒
// opCodes.G2C_PET_AWAKE          					= opCodes.GAME_MSG_PET_BEGIN + 45   //觉醒
// opCodes.C2G_PET_BREAK 				          = opCodes.GAME_MSG_PET_BEGIN + 46   //突破
// opCodes.G2C_PET_BREAK 				          = opCodes.GAME_MSG_PET_BEGIN + 47   //突破
// opCodes.C2G_PET_UPGRADE_SKILL 				  = opCodes.GAME_MSG_PET_BEGIN + 48  //技能升级
// opCodes.G2C_PET_UPGRADE_SKILL 				  = opCodes.GAME_MSG_PET_BEGIN + 49   //技能升级
// opCodes.G2C_PET_QUALITY_PET_LIST        = opCodes.GAME_MSG_PET_BEGIN + 50   //品质替换列表
// opCodes.C2G_PET_SELECT_QUALITY          = opCodes.GAME_MSG_PET_BEGIN + 51   //选择品质
// opCodes.C2G_PET_ONE_KEY_SKILL_UP        = opCodes.GAME_MSG_PET_BEGIN + 52   //一键升级技能
// opCodes.C2G_PET_DEVELOP_QUALITY         = opCodes.GAME_MSG_PET_BEGIN + 53   //伙伴进化
// opCodes.G2C_PET_DEVELOP_QUALITY         = opCodes.GAME_MSG_PET_BEGIN + 54   //伙伴进化返回
// opCodes.G2C_PET_FORCE_PREVIEW           = opCodes.GAME_MSG_PET_BEGIN + 55   //伙伴战力预览


//fight
opCodes.G2C_FIGHT_BEGIN               = opCodes.GAME_MSG_FIGHT_BEGIN + 1  // 战斗开始
opCodes.G2C_FIGHT_ADD                 = opCodes.GAME_MSG_FIGHT_BEGIN + 2  // 战斗成员
opCodes.G2C_FIGHT_SEQUENCE            = opCodes.GAME_MSG_FIGHT_BEGIN + 3  // 战斗出手队列
opCodes.C2G_FIGHT_CMD                 = opCodes.GAME_MSG_FIGHT_BEGIN + 4  // 战斗指令
opCodes.G2C_FIGHT_RESULT              = opCodes.GAME_MSG_FIGHT_BEGIN + 5  // 战斗结果
opCodes.C2G_FIGHT_DRAWDONE            = opCodes.GAME_MSG_FIGHT_BEGIN + 6  // 回合结束客户端反馈
opCodes.G2C_FIGHT_END                 = opCodes.GAME_MSG_FIGHT_BEGIN + 7  // 战斗结束
opCodes.G2C_FIGHT_REBEGIN             = opCodes.GAME_MSG_FIGHT_BEGIN + 8  // 战斗重连
//opCodes.C2G_FIGHT_FPK                 = opCodes.GAME_MSG_FIGHT_BEGIN + 9  // 强制pk战
//opCodes.C2G_FIGHT_PK                  = opCodes.GAME_MSG_FIGHT_BEGIN + 10 // pk请求
//opCodes.C2G_FIGHT_PK_SWITCH           = opCodes.GAME_MSG_FIGHT_BEGIN + 11 // 切换pk开关 0关闭 1普通pk 2强制pk
//opCodes.C2G_FIGHT_PK_ACCEPT           = opCodes.GAME_MSG_FIGHT_BEGIN + 12 // 同意pk请求
//opCodes.C2G_FIGHT_PK_REJECT           = opCodes.GAME_MSG_FIGHT_BEGIN + 13 // 拒绝pk请求
//opCodes.G2C_FIGHT_PK_REJECT           = opCodes.GAME_MSG_FIGHT_BEGIN + 14 // 拒绝pk请求
//opCodes.G2C_FIGHT_FPK                 = opCodes.GAME_MSG_FIGHT_BEGIN + 15 // 收到别人的强制PK
//opCodes.C2G_FIGHT_FPK_START           = opCodes.GAME_MSG_FIGHT_BEGIN + 16 // 强制PK开始
//opCodes.C2G_FIGHT_TEST_PK             = opCodes.GAME_MSG_FIGHT_BEGIN + 29 // PK测试
opCodes.C2G_FIGHT_ENTER_CAMPAIGN      = opCodes.GAME_MSG_FIGHT_BEGIN + 30 // 关卡战斗
opCodes.C2G_FIGHT_RESTART             = opCodes.GAME_MSG_FIGHT_BEGIN + 31 // 战斗开始
opCodes.G2C_FIGHT_FIGHTER_CALL        = opCodes.GAME_MSG_FIGHT_BEGIN + 32 // 战斗召唤成员
opCodes.G2C_FIGHT_FIGHTER_DISAPPEAR   = opCodes.GAME_MSG_FIGHT_BEGIN + 33 // 战斗成员消失
opCodes.C2G_FIGHT_BATTLE_QUEUE        = opCodes.GAME_MSG_FIGHT_BEGIN + 34 // 设置出战列表
opCodes.C2G_FIGHT_GET_BATTLE_QUEUE    = opCodes.GAME_MSG_FIGHT_BEGIN + 35 // 获取出战列表
opCodes.G2C_FIGHT_GET_BATTLE_QUEUE    = opCodes.GAME_MSG_FIGHT_BEGIN + 36 // 获取出战列表
opCodes.G2C_FIGHT_WIN                 = opCodes.GAME_MSG_FIGHT_BEGIN + 37 // 关卡战斗奖励
opCodes.C2G_FIGHT_CAMPAIGN_RECORD     = opCodes.GAME_MSG_FIGHT_BEGIN + 38 // 关卡记录
opCodes.G2C_FIGHT_CAMPAIGN_RECORD     = opCodes.GAME_MSG_FIGHT_BEGIN + 39 // 关卡记录
opCodes.C2G_FIGHT_CHAMPION_TOP_RANK   = opCodes.GAME_MSG_FIGHT_BEGIN + 40 // 竞技场查询
opCodes.G2C_FIGHT_CHAMPION_TOP_RANK   = opCodes.GAME_MSG_FIGHT_BEGIN + 41 // 竞技场查询
opCodes.C2G_FIGHT_CHAMPION_BATTLE     = opCodes.GAME_MSG_FIGHT_BEGIN + 42 // 竞技场挑战
opCodes.G2C_FIGHT_LOST                = opCodes.GAME_MSG_FIGHT_BEGIN + 43 // 战斗失败
opCodes.C2G_FIGHT_CHAMPION_REFRESH    = opCodes.GAME_MSG_FIGHT_BEGIN + 44 // 竞技场刷新
opCodes.G2C_FIGHT_CHAMPION_REFRESH    = opCodes.GAME_MSG_FIGHT_BEGIN + 45 // 竞技场对手信息
opCodes.G2C_FIGHT_CAMPAIGN_LOCK       = opCodes.GAME_MSG_FIGHT_BEGIN + 46 // 解锁关卡
opCodes.C2G_FIGHT_CHAMPION_RECORD     = opCodes.GAME_MSG_FIGHT_BEGIN + 47 // 对战记录
opCodes.G2C_FIGHT_CHAMPION_RECORD     = opCodes.GAME_MSG_FIGHT_BEGIN + 48 // 对战记录
opCodes.C2G_FIGHT_CHAMPION_VIEDO      = opCodes.GAME_MSG_FIGHT_BEGIN + 49 // 观看录像
opCodes.G2C_FIGHT_VIEDO               = opCodes.GAME_MSG_FIGHT_BEGIN + 50 // 录像
opCodes.G2C_FIGHT_FORCE_END           = opCodes.GAME_MSG_FIGHT_BEGIN + 51 // 强制战斗结束
opCodes.C2G_FIGHT_SYNC_TICKTIME       = opCodes.GAME_MSG_FIGHT_BEGIN + 52 // 同步战斗时间
opCodes.G2C_FIGHT_SYNC_TICKTIME       = opCodes.GAME_MSG_FIGHT_BEGIN + 53 // 同步战斗时间
opCodes.C2G_FIGHT_SYNC_SHOWEND        = opCodes.GAME_MSG_FIGHT_BEGIN + 54 // 剧情表演结束同步血量
opCodes.C2G_FIGHT_CHAMPION_CLEAR      = opCodes.GAME_MSG_FIGHT_BEGIN + 55 // 竞技场清空等待时间
opCodes.C2G_FIGHT_CHAMPION_INCREASE   = opCodes.GAME_MSG_FIGHT_BEGIN + 56 // 竞技场增加挑战次数
opCodes.G2C_FIGHT_CHAMPION_REFRESH_EX = opCodes.GAME_MSG_FIGHT_BEGIN + 57 // 竞技场刷新
opCodes.G2C_CHAMPION_WEAP             = opCodes.GAME_MSG_FIGHT_BEGIN + 58 // 关卡扫荡
opCodes.C2G_CHAMPION_WEAP             = opCodes.GAME_MSG_FIGHT_BEGIN + 59 // 关卡扫荡
opCodes.C2G_FIGHT_GLOBAL_VIEDO        = opCodes.GAME_MSG_FIGHT_BEGIN + 60 // 观看全服录像
opCodes.C2G_FIGHT_SPIRIT_SKILL        = opCodes.GAME_MSG_FIGHT_BEGIN + 61 // 翅膀技能
opCodes.G2C_FIGHT_SPIRIT_POINT        = opCodes.GAME_MSG_FIGHT_BEGIN + 62 // 翅膀技能CD,资源
opCodes.C2G_FIGHT_FAST_END            = opCodes.GAME_MSG_FIGHT_BEGIN + 63 // 快速结束战斗
opCodes.C2G_FIGHT_ASSIST_SKILL        = opCodes.GAME_MSG_FIGHT_BEGIN + 64 // 援助技能
opCodes.G2C_FIGHT_ASSIST_SKILL        = opCodes.GAME_MSG_FIGHT_BEGIN + 65 // 援助技能
opCodes.G2C_FIGHT_RESERVE_LINE_UP     = opCodes.GAME_MSG_FIGHT_BEGIN + 66 // 设置替补阵容
opCodes.C2G_FIGHT_RESERVE_LINE_UP     = opCodes.GAME_MSG_FIGHT_BEGIN + 67 // 返回替补阵容
opCodes.C2G_FIGHT_LINE_UP_INFO        = opCodes.GAME_MSG_FIGHT_BEGIN + 68 // 查询替补阵容
opCodes.G2C_FIGHT_LINE_UP_DATA        = opCodes.GAME_MSG_FIGHT_BEGIN + 69 // 发送替补阵容
opCodes.G2C_FIGHT_DAMAGE              = opCodes.GAME_MSG_FIGHT_BEGIN + 70 // 战斗伤害
opCodes.C2G_ASSIST_SKILL_INFO         = opCodes.GAME_MSG_FIGHT_BEGIN + 71 // 援助技能信息
opCodes.G2C_ASSIST_SKILL_INFO         = opCodes.GAME_MSG_FIGHT_BEGIN + 72 // 援助技能信息
opCodes.C2G_ASSIST_SKILL_LEVEL_UP     = opCodes.GAME_MSG_FIGHT_BEGIN + 73 // 援助技能升级
opCodes.C2G_ASSIST_SKILL_REDU_CD      = opCodes.GAME_MSG_FIGHT_BEGIN + 74 // 援助技能升级减少冷却时间
opCodes.C2G_ASSIST_SKILL_LV_LIST      = opCodes.GAME_MSG_FIGHT_BEGIN + 75 // 援助技能等级列表
opCodes.G2C_ASSIST_SKILL_LV_LIST      = opCodes.GAME_MSG_FIGHT_BEGIN + 76 // 援助技能等级列表
opCodes.G2C_FIGHT_VIEDO_PAGE          = opCodes.GAME_MSG_FIGHT_BEGIN + 77 // 录像分页
opCodes.G2C_FIGHT_ESOTERIC_POWER      = opCodes.GAME_MSG_FIGHT_BEGIN + 78 // 奥义能量MP
opCodes.C2G_FIGHT_CHAMPION_REFRESH_EX = opCodes.GAME_MSG_FIGHT_BEGIN + 79 // 竞技场刷新
opCodes.G2C_FIGHT_CHAMPION_EX_PRIZE   = opCodes.GAME_MSG_FIGHT_BEGIN + 80 // 竞技场首次排名奖励
//虚拟战斗
opCodes.G2C_EMPTY_FIGHT_WIN           = opCodes.GAME_MSG_FIGHT_BEGIN + 81 // 虚拟战斗结算
opCodes.C2G_FIGHT_ENTER_CAMPAIGN_INFO = opCodes.GAME_MSG_FIGHT_BEGIN + 82 // 进入关卡
opCodes.G2C_FIGHT_ENTER_CAMPAIGN_INFO = opCodes.GAME_MSG_FIGHT_BEGIN + 83 // 进入关卡
opCodes.C2G_FIGHT_SET_CAMPAIGN        = opCodes.GAME_MSG_FIGHT_BEGIN + 84 // 设置当前打的关卡
opCodes.G2C_FIGHT_QUEUE_BREAK_LIST    = opCodes.GAME_MSG_FIGHT_BEGIN + 85 // 获取当前阵列突破等级
opCodes.C2G_FIGHT_QUEUE_BREAK_LIST    = opCodes.GAME_MSG_FIGHT_BEGIN + 86 // 获取当前阵列突破等级
opCodes.G2C_FIGHT_RECONNECT_NOTICE    = opCodes.GAME_MSG_FIGHT_BEGIN + 87 // 预先通知当前正在战斗中RoleInfo之前
opCodes.G2C_FIGHT_QUEUE_QUALITY_LIST  = opCodes.GAME_MSG_FIGHT_BEGIN + 88 // 获取当前阵列品质等级
opCodes.C2G_FIGHT_QUEUE_QUALITY_LIST  = opCodes.GAME_MSG_FIGHT_BEGIN + 89 // 获取当前阵列品质等级

//task
opCodes.C2G_NPC_TALK               = opCodes.GAME_MSG_TASK_BENGN + 1   // 与NPC对话(客户端)
opCodes.G2C_NPC_TALK               = opCodes.GAME_MSG_TASK_BENGN + 2   // 与NPC对话(服务端)
opCodes.G2C_TASK_ACCEPT            = opCodes.GAME_MSG_TASK_BENGN + 3   // 接受任务返回(服务端)
opCodes.G2C_TASK_INFO              = opCodes.GAME_MSG_TASK_BENGN + 4   // 任务列表信息(服务端)
opCodes.G2C_TASK_SUCCEED           = opCodes.GAME_MSG_TASK_BENGN + 5   // 任务完成(服务端)
opCodes.G2C_TASK_FAIL              = opCodes.GAME_MSG_TASK_BENGN + 6   // 任务失败(服务端)
opCodes.C2G_TASK_CANCEL            = opCodes.GAME_MSG_TASK_BENGN + 7   // 任务取消(客户端)
opCodes.G2C_TASK_CANCEL            = opCodes.GAME_MSG_TASK_BENGN + 8   // 返回任务取消(服务端)
opCodes.G2C_TASK_PRIZE             = opCodes.GAME_MSG_TASK_BENGN + 9   // 任务奖励消息(服务端)
opCodes.C2G_TASK_GIVE_RES          = opCodes.GAME_MSG_TASK_BENGN + 10  // 上交资源给npc(客户端)
opCodes.C2G_TASK_COMMIT            = opCodes.GAME_MSG_TASK_BENGN + 12  // 提交任务(客户端)
opCodes.C2G_TASK_NODE              = opCodes.GAME_MSG_TASK_BENGN + 13  // 保存节点(客户端)
opCodes.C2G_TASK_NPC               = opCodes.GAME_MSG_TASK_BENGN + 14  // 保存找到npc(客户端)
opCodes.C2G_TASK_FIGHT             = opCodes.GAME_MSG_TASK_BENGN + 15  // 触发战斗(客户端)
opCodes.C2G_TASK_ARRIVE            = opCodes.GAME_MSG_TASK_BENGN + 16  // 到达目标点(客户端)
opCodes.C2G_TASK_APPLY             = opCodes.GAME_MSG_TASK_BENGN + 17  // 请求任务(客户端)
opCodes.G2C_TASK_NEXT_TASK         = opCodes.GAME_MSG_TASK_BENGN + 18  // 下一条任务(服务端)
opCodes.G2C_TASK_OTHER_INFO        = opCodes.GAME_MSG_TASK_BENGN + 19  // 任务系统初始化数据(服务端)
opCodes.C2G_TASK_ACCEPT            = opCodes.GAME_MSG_TASK_BENGN + 20  // 接受任务返回(客户端)
//opCodes.C2G_TASK_GIVE_PET          = opCodes.GAME_MSG_TASK_BENGN + 21  // 上交宠物给npc(客户端)
//opCodes.C2G_TASK_ITEMAPPLY         = opCodes.GAME_MSG_TASK_BENGN + 22  // 物品请求任务(客户端)
//opCodes.C2G_TASK_ITEMNODE          = opCodes.GAME_MSG_TASK_BENGN + 23  // 物品保存节点(客户端)
opCodes.C2G_TASK_ITEMCOMMIT        = opCodes.GAME_MSG_TASK_BENGN + 24  // 物品提交任务(客户端)
//opCodes.C2G_TASK_SERVER_TIME       = opCodes.GAME_MSG_TASK_BENGN + 25  // 请求服务器时间
//opCodes.G2C_TASK_SERVER_TIME       = opCodes.GAME_MSG_TASK_BENGN + 26  // 返回服务器时间
//opCodes.C2G_TASK_NPC_CASH          = opCodes.GAME_MSG_TASK_BENGN + 27  // 查询聚宝悬赏金(NPC携带现银)
//opCodes.C2G_TASK_ANSWER            = opCodes.GAME_MSG_TASK_BENGN + 28  // 回答问题(taskId,id,answer)
//opCodes.C2G_TASK_APPLY_ACTIVITY    = opCodes.GAME_MSG_TASK_BENGN + 29  // 请求活动类任务
//opCodes.C2G_TASK_TIPS              = opCodes.GAME_MSG_TASK_BENGN + 30  // 任务提示(藏宝图)
//opCodes.C2G_TASK_NPC_PRIZE         = opCodes.GAME_MSG_TASK_BENGN + 31  // 向NPC领取奖励
//opCodes.G2C_TASK_NPC_CASH          = opCodes.GAME_MSG_TASK_BENGN + 32  // 返回聚宝悬赏金(NPC携带现银)
//opCodes.G2C_ONLINE_LOTTERY         = opCodes.GAME_MSG_TASK_BENGN + 33  // 返回上线抽奖信息
//opCodes.C2G_ONLINE_LOTTERY_RESULT  = opCodes.GAME_MSG_TASK_BENGN + 34  // 请求结果
//opCodes.G2C_ONLINE_LOTTERY_RESULT  = opCodes.GAME_MSG_TASK_BENGN + 35  // 请求结果返回
//opCodes.C2G_ONLINE_LOTTERY_PRIZE   = opCodes.GAME_MSG_TASK_BENGN + 36  // 领取奖品
//opCodes.G2C_ONLINE_SIGNIN          = opCodes.GAME_MSG_TASK_BENGN + 37  // 上线签到礼品
//opCodes.C2G_ONLINE_SIGN_GET        = opCodes.GAME_MSG_TASK_BENGN + 38  // 领取签到礼品
//opCodes.C2G_ONLINE_LOTTERY_GET     = opCodes.GAME_MSG_TASK_BENGN + 39  // 获取抽奖列表
//opCodes.G2C_ONLINE_LOGGER_TIME     = opCodes.GAME_MSG_TASK_BENGN + 40  // 获取抽奖时间
//opCodes.C2G_TASK_APPLY_HIDDEN_TASK = opCodes.GAME_MSG_TASK_BENGN + 41  // 申请隐藏任务
//opCodes.C2G_ONLINE_SIGNIN          = opCodes.GAME_MSG_TASK_BENGN + 42  // 申请
//opCodes.C2G_TASK_HIDDEN            = opCodes.GAME_MSG_TASK_BENGN + 47  // 隐藏任务相关()
opCodes.G2C_TASK_FINISH_LIST       = opCodes.GAME_MSG_TASK_BENGN + 48  // 完成任务列表
//opCodes.C2G_NEW_PALYER_TRANSCRIPT  = opCodes.GAME_MSG_TASK_BENGN + 49  // 新手副本
//opCodes.C2G_TASK_FEIXINGQI_ANSWER  = opCodes.GAME_MSG_TASK_BENGN + 50  // 飞行器答题
//opCodes.G2C_TASK_FIGHT_LOST        = opCodes.GAME_MSG_TASK_BENGN + 51  // 任务战斗失败消息
//opCodes.C2G_TASK_TEAM_TALK         = opCodes.GAME_MSG_TASK_BENGN + 52  // 整队与NPC对话
//opCodes.G2C_TASK_TEAM_TALK         = opCodes.GAME_MSG_TASK_BENGN + 53  // 整队与NPC对话返回
opCodes.C2G_TASK_GUIDE_JUMP        = opCodes.GAME_MSG_TASK_BENGN + 54  // 任务导航跳转
//opCodes.C2G_MAP_NPC_COMBAT         = opCodes.GAME_MSG_TASK_BENGN + 55  // 明雷战斗
//opCodes.C2G_HELP_JUMP              = opCodes.GAME_MSG_TASK_BENGN + 56  // 明雷战斗
opCodes.C2G_TASK_GIVE_SOMETHING    = opCodes.GAME_MSG_TASK_BENGN + 57  // 任务提交金钱/体力/物品
opCodes.C2G_TASK_PET_OPTION        = opCodes.GAME_MSG_TASK_BENGN + 58  // 亲密度任务选择
opCodes.G2C_TASK_PET_OPTION        = opCodes.GAME_MSG_TASK_BENGN + 59  // 亲密度任务选择
opCodes.C2G_TASK_SELECT_OPTION     = opCodes.GAME_MSG_TASK_BENGN + 60  // 分支任务选择
opCodes.G2C_TASK_SELECT_OPTION     = opCodes.GAME_MSG_TASK_BENGN + 61  // 分支任务选择
opCodes.C2G_TASK_GIVE_EQUIP        = opCodes.GAME_MSG_TASK_BENGN + 62  // 任务上交装备
opCodes.C2G_TASK_FACTION_FIGHT_NPC = opCodes.GAME_MSG_TASK_BENGN + 63  // 军团任务NPC战斗
opCodes.C2G_TASK_FACTION_COMMIT    = opCodes.GAME_MSG_TASK_BENGN + 64  // 军团任务上交物品
opCodes.C2G_NPC_ENTRYID_TALK       = opCodes.GAME_MSG_TASK_BENGN + 65  // 与客户端自己创建的npc对话

//item
// opCodes.G2C_ITEM_LIST                    = opCodes.GAME_MSG_ITEM_BEGIN + 1   // 物品列表
// opCodes.G2C_ITEM_UPDATE                  = opCodes.GAME_MSG_ITEM_BEGIN + 2   // 物品更新
// opCodes.G2C_ITEM_DROP                    = opCodes.GAME_MSG_ITEM_BEGIN + 3   // 物品丢弃
// opCodes.C2G_ITEM_DROP                    = opCodes.GAME_MSG_ITEM_BEGIN + 4   // 物品丢弃
// opCodes.C2G_ITEM_PILE                    = opCodes.GAME_MSG_ITEM_BEGIN + 5   // 物品堆叠
// opCodes.C2G_ITEM_SPLIT                   = opCodes.GAME_MSG_ITEM_BEGIN + 6   // 物品拆分
// opCodes.C2G_ITEM_EXCHANGE                = opCodes.GAME_MSG_ITEM_BEGIN + 7   // 物品替换
// opCodes.C2G_ITEM_MOVE                    = opCodes.GAME_MSG_ITEM_BEGIN + 8   // 物品移动
//opCodes.C2G_ITEM_USE                     = opCodes.GAME_MSG_ITEM_BEGIN + 9  // 物品使用
// opCodes.C2G_ITEM_SELL                    = opCodes.GAME_MSG_ITEM_BEGIN + 10  // 物品出售
// opCodes.C2G_ITEM_BUY                     = opCodes.GAME_MSG_ITEM_BEGIN + 11  // 买入物品
// opCodes.C2G_ITEM_EQUIP_STRENGTHEN        = opCodes.GAME_MSG_ITEM_BEGIN + 12  // 装备强化
// opCodes.C2G_ITEM_RECYCLE_LIST            = opCodes.GAME_MSG_ITEM_BEGIN + 13  // 物品回收列表
// opCodes.G2C_ITEM_RECYCLE_LIST            = opCodes.GAME_MSG_ITEM_BEGIN + 14  // 物品回收列表
// opCodes.C2G_ITEM_SELL_LIST               = opCodes.GAME_MSG_ITEM_BEGIN + 15  // 物品出售列表
// opCodes.G2C_ITEM_SELL_LIST               = opCodes.GAME_MSG_ITEM_BEGIN + 16  // 物品出售列表
// opCodes.C2G_ITEM_EQUIP_GETOFF            = opCodes.GAME_MSG_ITEM_BEGIN + 17  // 脱下装备
// opCodes.C2G_ITEM_GIVE                    = opCodes.GAME_MSG_ITEM_BEGIN + 18  // 物品给予
// opCodes.C2G_ITEM_TRADE                   = opCodes.GAME_MSG_ITEM_BEGIN + 19  // 物品交易
// opCodes.G2C_ITEM_TRADE                   = opCodes.GAME_MSG_ITEM_BEGIN + 20  // 物品交易
// opCodes.C2G_ITEM_UNBIND                  = opCodes.GAME_MSG_ITEM_BEGIN + 21  // 物品解绑
// opCodes.C2G_ITEM_EQUIP_PUTON             = opCodes.GAME_MSG_ITEM_BEGIN + 22 // 穿上装备
// opCodes.C2G_ITEM_TRADE_LIST              = opCodes.GAME_MSG_ITEM_BEGIN + 23 // 查看交易中心列表
// opCodes.G2C_ITEM_TRADE_LIST              = opCodes.GAME_MSG_ITEM_BEGIN + 24 // 查看交易中心列表
// opCodes.C2G_ITEM_TRADE_BUY               = opCodes.GAME_MSG_ITEM_BEGIN + 25 // NPC购买玩家物品
// opCodes.C2G_ITEM_TRADE_SALE              = opCodes.GAME_MSG_ITEM_BEGIN + 26 // NPC出售物品给玩家
// opCodes.C2G_ITEM_EQUIP_MAKE              = opCodes.GAME_MSG_ITEM_BEGIN + 27 // 装备打造
// opCodes.C2G_ITEM_EQUIP_SPLIT             = opCodes.GAME_MSG_ITEM_BEGIN + 28 // 装备分解
// opCodes.G2C_ITEM_EQUIP_MAKE              = opCodes.GAME_MSG_ITEM_BEGIN + 29 // 装备打造
// opCodes.C2G_BUY_VIP_GIFTS                = opCodes.GAME_MSG_ITEM_BEGIN + 30 // 购买vip礼包
// opCodes.C2G_FETE_PLAYER                  = opCodes.GAME_MSG_ITEM_BEGIN + 31 // 使用王者英魂，升级主角经验
// opCodes.G2C_ITEM_TRADE_LIMIT             = opCodes.GAME_MSG_ITEM_BEGIN + 32 // 商城限购/限卖
// opCodes.C2G_ITEM_TRADE_LIMIT             = opCodes.GAME_MSG_ITEM_BEGIN + 33 // 商城限购/限卖
// opCodes.G2C_ITEM_BLACK_MARKET_LIMIT      = opCodes.GAME_MSG_ITEM_BEGIN + 34 // 黑市限购
// opCodes.C2G_ITEM_BLACK_MARKET_LIMIT      = opCodes.GAME_MSG_ITEM_BEGIN + 35 // 黑市限购
// opCodes.C2G_ITEM_BLACK_MARKET_LIST       = opCodes.GAME_MSG_ITEM_BEGIN + 36 // 黑市列表
// opCodes.G2C_ITEM_BLACK_MARKET_LIST       = opCodes.GAME_MSG_ITEM_BEGIN + 37 // 黑市列表
// opCodes.C2G_ITEM_BLACK_MARKET_SALE       = opCodes.GAME_MSG_ITEM_BEGIN + 38 // 黑市出售物品
// opCodes.G2C_ITEM_BLACK_MARKET_SALE       = opCodes.GAME_MSG_ITEM_BEGIN + 39 // 黑市出售物品
// opCodes.C2G_ITEM_TRADE_DISCOUNT_INFO     = opCodes.GAME_MSG_ITEM_BEGIN + 40 // 商城打折信息
// opCodes.G2C_ITEM_TRADE_DISCOUNT_INFO     = opCodes.GAME_MSG_ITEM_BEGIN + 41 // 商城打折信息
// opCodes.C2G_ITEM_TRADE_DISCOUNT_BUY      = opCodes.GAME_MSG_ITEM_BEGIN + 42 // 购买商城打折物品
// opCodes.C2G_ITEM_USE_EX                  = opCodes.GAME_MSG_ITEM_BEGIN + 43 // 使用物品
// opCodes.C2G_PET_SOUL_TRADE               = opCodes.GAME_MSG_ITEM_BEGIN + 44 // 出售碎魂
// opCodes.C2G_AUCTION_ITEM_LIST            = opCodes.GAME_MSG_ITEM_BEGIN + 45 // 拍卖行列表
// opCodes.G2C_AUCTION_ITEM_LIST            = opCodes.GAME_MSG_ITEM_BEGIN + 46 // 拍卖行列表
// opCodes.C2G_AUCTION_ON_SHELF             = opCodes.GAME_MSG_ITEM_BEGIN + 47 // 物品上架
// opCodes.C2G_AUCTION_ITEM_PRIZE           = opCodes.GAME_MSG_ITEM_BEGIN + 48 // 物品竞价
// opCodes.C2G_AUCTION_QUERY_ITEM           = opCodes.GAME_MSG_ITEM_BEGIN + 49 // 查询单个物品
// opCodes.G2C_AUCTION_QUERY_ITEM           = opCodes.GAME_MSG_ITEM_BEGIN + 50 // 查询单个物品
// opCodes.C2G_AUCTION_QUERY_MY_BUY_LIST    = opCodes.GAME_MSG_ITEM_BEGIN + 51 // 我竞价的物品
// opCodes.G2C_AUCTION_QUERY_MY_BUY_LIST    = opCodes.GAME_MSG_ITEM_BEGIN + 52 // 我竞价的物品
// opCodes.C2G_AUCTION_RECORD_LIST          = opCodes.GAME_MSG_ITEM_BEGIN + 53 // 交易记录
// opCodes.G2C_AUCTION_RECORD_LIST          = opCodes.GAME_MSG_ITEM_BEGIN + 54 // 交易记录
// opCodes.G2C_AUCTION_ADD_PRIZE_RECORD     = opCodes.GAME_MSG_ITEM_BEGIN + 55 // 加价记录
// opCodes.C2G_AUCTION_ADD_PRIZE_RECORD     = opCodes.GAME_MSG_ITEM_BEGIN + 56 // 加价记录
// opCodes.G2C_COMMON_PRIZE_LIST            = opCodes.GAME_MSG_ITEM_BEGIN + 57 // 通用奖励列表
// opCodes.G2C_ITEM_TRADE_ITEM_INFO         = opCodes.GAME_MSG_ITEM_BEGIN + 58 // 商城单个物品信息
// opCodes.C2G_ITEM_TRADE_ITEM_INFO         = opCodes.GAME_MSG_ITEM_BEGIN + 59 // 商城单个物品信息
// opCodes.C2G_ITEM_ENTER_LOTTERY           = opCodes.GAME_MSG_ITEM_BEGIN + 60 // 进入抽奖
// opCodes.G2C_ITEM_ENTER_LOTTERY           = opCodes.GAME_MSG_ITEM_BEGIN + 61 // 进入抽奖返回
// opCodes.C2G_ITEM_LOTTERY_REFRESH         = opCodes.GAME_MSG_ITEM_BEGIN + 62 // 抽奖库刷新
// opCodes.G2C_ITEM_LOTTERY_LIB             = opCodes.GAME_MSG_ITEM_BEGIN + 63 // 抽奖库返回
// opCodes.G2C_ITEM_LOTTERY                 = opCodes.GAME_MSG_ITEM_BEGIN + 64 // 抽奖返回
// opCodes.C2G_ITEM_LOTTERY                 = opCodes.GAME_MSG_ITEM_BEGIN + 65 // 抽奖
//opCodes.C2G_ITEM_CAMPAGIN_GIFT_BUY       = opCodes.GAME_MSG_ITEM_BEGIN + 66 // 新手关卡礼包
// opCodes.C2G_RECHARGE_SERVERS_PRICE       = opCodes.GAME_MSG_ITEM_BEGIN + 67 // 跨服冲值
// opCodes.G2C_RECHARGE_SERVERS_PRICE       = opCodes.GAME_MSG_ITEM_BEGIN + 68 // 
// opCodes.C2G_PLAYER_RECHARGE_SERVERS_PRICE	= opCodes.GAME_MSG_ITEM_BEGIN + 69 // 跨服冲值 玩家信息
// opCodes.G2C_PLAYER_RECHARGE_SERVERS_PRICE	= opCodes.GAME_MSG_ITEM_BEGIN + 70 // 


//
// opCodes.C2G_TEAM_CREATE                  = opCodes.GAME_MSG_TEAM_BEGIN + 1  // 创建队伍
// opCodes.G2C_TEAM_UPDATE                  = opCodes.GAME_MSG_TEAM_BEGIN + 2  // 队伍更新信息
// opCodes.C2G_TEAM_INVITE                  = opCodes.GAME_MSG_TEAM_BEGIN + 3  // 发送邀请组队
// opCodes.G2C_TEAM_INVITE                  = opCodes.GAME_MSG_TEAM_BEGIN + 4  // 收到邀请组队
// opCodes.C2G_TEAM_REPLY_INVITE            = opCodes.GAME_MSG_TEAM_BEGIN + 5  // 接受/拒绝邀请
// opCodes.C2G_TEAM_APPLY                   = opCodes.GAME_MSG_TEAM_BEGIN + 6  // 发送申请入队
// opCodes.G2C_TEAM_APPLY                   = opCodes.GAME_MSG_TEAM_BEGIN + 7  // 收到申请入队
// opCodes.C2G_TEAM_REPLY_APPLY             = opCodes.GAME_MSG_TEAM_BEGIN + 8  // 接受/拒绝入队
// opCodes.C2G_TEAM_KICK                    = opCodes.GAME_MSG_TEAM_BEGIN + 9  // 请离队伍
// opCodes.C2G_TEAM_LEAVE                   = opCodes.GAME_MSG_TEAM_BEGIN + 10 // 退出队伍
// opCodes.G2C_TEAM_LEAVE                   = opCodes.GAME_MSG_TEAM_BEGIN + 11 // 退出队伍
// opCodes.C2G_TEAM_CAPTAIN                 = opCodes.GAME_MSG_TEAM_BEGIN + 12 // 提升队长
// opCodes.C2G_TEAM_RANK                    = opCodes.GAME_MSG_TEAM_BEGIN + 13 // 更改队员位置
// opCodes.C2G_TEAM_DISBAND                 = opCodes.GAME_MSG_TEAM_BEGIN + 14 // 解散队伍
// opCodes.G2C_TEAM_DISBAND                 = opCodes.GAME_MSG_TEAM_BEGIN + 15 // 解散队伍
// opCodes.C2G_TEAM_CLEAR_APPLY             = opCodes.GAME_MSG_TEAM_BEGIN + 16 // 清空申请列表
// opCodes.G2C_TEAM_MEMBER_OFFLINE          = opCodes.GAME_MSG_TEAM_BEGIN + 17 // 队员离线
// opCodes.G2C_TEAM_MEMBER_ONLINE           = opCodes.GAME_MSG_TEAM_BEGIN + 18 // 队员上线
// opCodes.G2C_TEAM_APPEAR                  = opCodes.GAME_MSG_TEAM_BEGIN + 19 // 队伍出现(走路)
// opCodes.G2C_TEAM_DISAPPEAR               = opCodes.GAME_MSG_TEAM_BEGIN + 20 // 队伍消失(走路)
// opCodes.C2G_TEAM_ACTIVITY_QUERY          = opCodes.GAME_MSG_TEAM_BEGIN + 21 // 活动队伍列表
// opCodes.G2C_TEAM_ACTIVITY_QUERY          = opCodes.GAME_MSG_TEAM_BEGIN + 22 // 活动队伍列表
// opCodes.C2G_TEAM_QUEUE                   = opCodes.GAME_MSG_TEAM_BEGIN + 23 // 设置阵型
// opCodes.G2C_TEAM_QUEUE                   = opCodes.GAME_MSG_TEAM_BEGIN + 24 //
// //opCodes.C2G_TEAM_SPACE_MOVE            = opCodes.GAME_MSG_TEAM_BEGIN + 25 // 场景移动
// opCodes.G2C_TEAM_SPACE_MOVE              = opCodes.GAME_MSG_TEAM_BEGIN + 26 // 场景移动
// opCodes.C2G_TEAM_SET_STATUS              = opCodes.GAME_MSG_TEAM_BEGIN + 27 // 组队状态
// opCodes.C2G_TEAM_MEMBER_NOTICE           = opCodes.GAME_MSG_TEAM_BEGIN + 28 // 通知队员改变状态
// opCodes.G2C_TEAM_MEMBER_NOTICE           = opCodes.GAME_MSG_TEAM_BEGIN + 29 // 通知队员改变状态
// opCodes.G2C_TEAM_ACTIVITY_DATA           = opCodes.GAME_MSG_TEAM_BEGIN + 30 // 通知队员活动数据
// opCodes.C2G_TEAM_ACTIVITY_DATA           = opCodes.GAME_MSG_TEAM_BEGIN + 31 // 通知队员活动数据
// opCodes.C2G_TEAM_ALL_INVITE              = opCodes.GAME_MSG_TEAM_BEGIN + 32 // 一键号召
// opCodes.C2G_TEAM_ALL_APPLY               = opCodes.GAME_MSG_TEAM_BEGIN + 33 // 一键申请
// opCodes.C2G_TEAM_SET_MEMBER_STATUS       = opCodes.GAME_MSG_TEAM_BEGIN + 34 // 设置队员的状态
// //组队意愿
// opCodes.C2G_TEAM_CREATE_WILL_TEAM        = opCodes.GAME_MSG_TEAM_BEGIN + 35 // 创建组队意愿
// opCodes.G2C_TEAM_WILL_TEAM_LIST          = opCodes.GAME_MSG_TEAM_BEGIN + 36 // 组队意愿列表
// opCodes.C2G_TEAM_WILL_TEAM_LIST          = opCodes.GAME_MSG_TEAM_BEGIN + 37 // 组队意愿列表
// opCodes.C2G_TEAM_SET_WILL_TEAM           = opCodes.GAME_MSG_TEAM_BEGIN + 38 // 设置组队意愿

// //buff
opCodes.G2C_BUFF_UPDATE           = opCodes.GAME_MSG_BUFF_BEGIN + 1 // 状态更新/改变
opCodes.G2C_BUFF_REMOVE           = opCodes.GAME_MSG_BUFF_BEGIN + 2 // 状态移除

// channel
opCodes.C2G_CHANNEL_SEND        = opCodes.GAME_MSG_CHANNEL_BEGIN + 1  // 发送频道消息
opCodes.G2C_CHANNEL_SEND        = opCodes.GAME_MSG_CHANNEL_BEGIN + 2  // 接收频道信息
// opCodes.C2G_CHANNEL_PLAYER      = opCodes.GAME_MSG_CHANNEL_BEGIN + 3  // 接收频道信息
// opCodes.G2C_CHANNEL_PLAYER      = opCodes.GAME_MSG_CHANNEL_BEGIN + 4  // 接收频道信息
opCodes.G2C_CHANNEL_SYSTEM      = opCodes.GAME_MSG_CHANNEL_BEGIN + 5  // 系统公告 发给全局的
//opCodes.C2G_CHANNEL_PET_ITEM    = opCodes.GAME_MSG_CHANNEL_BEGIN + 6  // 查看宠物道具
// opCodes.G2C_CHANNEL_PET_ITEM    = opCodes.GAME_MSG_CHANNEL_BEGIN + 7  // 查看宠物道具

// opCodes.C2G_CHANNEL_VOICE       = opCodes.GAME_MSG_CHANNEL_BEGIN + 8  //发送语音
// opCodes.G2C_CHANNEL_VOICE       = opCodes.GAME_MSG_CHANNEL_BEGIN + 9  //发送语音返回
// opCodes.G2C_CHANNEL_VOICE_UID   = opCodes.GAME_MSG_CHANNEL_BEGIN + 10 //返回语音Uid
// opCodes.C2G_CHANNEL_GET_VOICE   = opCodes.GAME_MSG_CHANNEL_BEGIN + 11 //获取语音内容
// opCodes.G2C_CHANNEL_GET_VOICE   = opCodes.GAME_MSG_CHANNEL_BEGIN + 12 //发送语音内容
opCodes.G2C_CHANNEL_RECARD_SEND = opCodes.GAME_MSG_CHANNEL_BEGIN + 13 //聊天记录
opCodes.C2G_CHANNEL_RECARD_SEND = opCodes.GAME_MSG_CHANNEL_BEGIN + 14 //聊天记录
 opCodes.C2G_CHANNEL_WINDOW_TYPE = opCodes.GAME_MSG_CHANNEL_BEGIN + 15 //聊天框类型

//skill
//opCodes.C2G_SKILL_SERIES_UPGRADE      = opCodes.GAME_MSG_SKILL_BEGIN + 1  // 洗练祭祀技能
//opCodes.C2G_UPDATE_SKILLSERIES_INFO   = opCodes.GAME_MSG_SKILL_BEGIN + 2  // 祭祀技能信息
//opCodes.G2C_UPDATE_SKILLSERIES_INFO   = opCodes.GAME_MSG_SKILL_BEGIN + 3  // 祭祀技能信息
//opCodes.C2G_UNLOCK_SACRIFICE_SKILL    = opCodes.GAME_MSG_SKILL_BEGIN + 4  // 解锁祭祀技能
//opCodes.C2G_BIND_SACRIFICE_SKILL      = opCodes.GAME_MSG_SKILL_BEGIN + 5  // 绑定祭祀技能
//opCodes.C2G_UNBIND_SACRIFICE_SKILL    = opCodes.GAME_MSG_SKILL_BEGIN + 6  // 解绑祭祀技能
//opCodes.G2C_UPDATE_LIVEBUFFS_INFO     = opCodes.GAME_MSG_SKILL_BEGIN + 11 // 更新生活buff
//opCodes.C2G_CANCEL_LIVEBUFFS          = opCodes.GAME_MSG_SKILL_BEGIN + 12 // 取消生活buff
//opCodes.G2C_UPDATE_LIVEBUFF           = opCodes.GAME_MSG_SKILL_BEGIN + 13 // 更新单个生活buff
//opCodes.G2C_REMOVE_LIVEBUFF           = opCodes.GAME_MSG_SKILL_BEGIN + 14 // 移除buff
//opCodes.C2G_USE_SKILL                 = opCodes.GAME_MSG_SKILL_BEGIN + 15 // 生活场景使用技能
//opCodes.C2G_USE_COOKING_SKILL         = opCodes.GAME_MSG_SKILL_BEGIN + 16 // 烹饪
//opCodes.C2G_LIVEBUFF_FREEZE           = opCodes.GAME_MSG_SKILL_BEGIN + 17 // 生活buff冻结
//opCodes.C2G_LIVEBUFF_UNFREEZE         = opCodes.GAME_MSG_SKILL_BEGIN + 18 // 生活buff解冻
//opCodes.C2G_LIVEBUFF_GET              = opCodes.GAME_MSG_SKILL_BEGIN + 19 // 领取生活buff
//opCodes.G2C_LIVEBUFF_REMIND           = opCodes.GAME_MSG_SKILL_BEGIN + 20 // 生活buff剩余时间
//opCodes.G2C_LIVESKILL_COOKING_GET     = opCodes.GAME_MSG_SKILL_BEGIN + 22 // 烹饪产物
//opCodes.G2C_USE_SKILL_RESULT          = opCodes.GAME_MSG_SKILL_BEGIN + 23 // 使用仙术是否成功
//opCodes.G2C_PLOT_SKILL_UPDATE         = opCodes.GAME_MSG_SKILL_BEGIN + 29 // 更新单个剧情技能
//opCodes.G2C_PLOT_SKILLLIST_INFO       = opCodes.GAME_MSG_SKILL_BEGIN + 30 // 发送剧情技能列表
//opCodes.C2G_PLOT_LEARN_SKILL          = opCodes.GAME_MSG_SKILL_BEGIN + 31 // 请求学习剧情技能
//opCodes.C2G_PLOT_FORGET_SKILL         = opCodes.GAME_MSG_SKILL_BEGIN + 32 // 请求遗忘剧情技能
//opCodes.C2G_PLOT_SHOP                 = opCodes.GAME_MSG_SKILL_BEGIN + 33 // 请求剧情仙灵商店
//opCodes.G2C_PLOT_SHOP                 = opCodes.GAME_MSG_SKILL_BEGIN + 34 // 发送剧情仙灵商店
// opCodes.C2G_ROLE_USE_COMBINED_SKILL   = opCodes.GAME_MSG_SKILL_BEGIN + 35 //激活/取消合体技
// opCodes.G2C_ROLE_CHECK_COMBINED_SKILL = opCodes.GAME_MSG_SKILL_BEGIN + 36 //合体技使用返回
// opCodes.C2G_ROLE_CHECK_COMBINED_SKILL = opCodes.GAME_MSG_SKILL_BEGIN + 37 //查询合体技


//faction
// opCodes.C2G_FACTION_CREATE                = opCodes.GAME_MSG_FACTION_BEGIN + 1    // 宗族创建
// opCodes.C2G_FACTION_NOTICE_REFRESH        = opCodes.GAME_MSG_FACTION_BEGIN + 2    // 刷新公告内容
// opCodes.G2C_FACTION_NOTICE_REFRESH        = opCodes.GAME_MSG_FACTION_BEGIN + 3    // 返回公告内容
// opCodes.C2G_FACTION_INFO_REFRESH          = opCodes.GAME_MSG_FACTION_BEGIN + 4    // 刷新宗族信息
// opCodes.G2C_FACTION_INFO_REFRESH          = opCodes.GAME_MSG_FACTION_BEGIN + 5    // 返回宗族信息
// opCodes.C2G_FACTION_MEMBER_REFRESH        = opCodes.GAME_MSG_FACTION_BEGIN + 6    // 刷新成员数据
// opCodes.G2C_FACTION_MEMBER_REFRESH        = opCodes.GAME_MSG_FACTION_BEGIN + 7    // 返回成员数据
// opCodes.C2G_FACTION_BUILD_REFRESH         = opCodes.GAME_MSG_FACTION_BEGIN + 8    // 刷新建筑数据
// opCodes.G2C_FACTION_BUILD_REFRESH         = opCodes.GAME_MSG_FACTION_BEGIN + 9    // 返回建筑数据
// opCodes.C2G_FACTION_APPLY_REFRESH         = opCodes.GAME_MSG_FACTION_BEGIN + 10   // 刷新申请数据
// opCodes.G2C_FACTION_APPLY_REFRESH         = opCodes.GAME_MSG_FACTION_BEGIN + 11   // 返回申请数据
// opCodes.C2G_FACTION_INFO                  = opCodes.GAME_MSG_FACTION_BEGIN + 12   // 查询所有帮会信息
// opCodes.G2C_FACTION_INFO                  = opCodes.GAME_MSG_FACTION_BEGIN + 13   // 返回所有帮会信息
// opCodes.C2G_FACTION_SINGLE_INFO           = opCodes.GAME_MSG_FACTION_BEGIN + 14   // 查询单个宗族的信息
// opCodes.G2C_FACTION_SINGLE_INFO           = opCodes.GAME_MSG_FACTION_BEGIN + 15   // 返回宗族的查询信息
// opCodes.C2G_FACTION_LEAVE                 = opCodes.GAME_MSG_FACTION_BEGIN + 16   // 主动离开宗族
// opCodes.C2G_FACTION_APPAY                 = opCodes.GAME_MSG_FACTION_BEGIN + 17   // 申请进入宗族
// opCodes.G2C_FACTION_APPAY                 = opCodes.GAME_MSG_FACTION_BEGIN + 18   // 发送申请给管理层
// opCodes.C2G_FACTION_CHECK                 = opCodes.GAME_MSG_FACTION_BEGIN + 19   // 宗族审核申请
// opCodes.C2G_FACTION_ENTER_MAP             = opCodes.GAME_MSG_FACTION_BEGIN + 20   // 进入宗族地图
// opCodes.G2C_FACTION_SELF_UPDATE           = opCodes.GAME_MSG_FACTION_BEGIN + 21   // 自身宗族信息更新
// opCodes.G2C_FACTION_UPDATE                = opCodes.GAME_MSG_FACTION_BEGIN + 22   // 宗族信息更新
// opCodes.C2G_FACTION_POST                  = opCodes.GAME_MSG_FACTION_BEGIN + 23   // 设置职位
// opCodes.C2G_FACTION_MERCHANT              = opCodes.GAME_MSG_FACTION_BEGIN + 24   // 任命商人
// opCodes.C2G_FACTION_FIRE                  = opCodes.GAME_MSG_FACTION_BEGIN + 25   // 请离宗族
// opCodes.G2C_FACTION_FIRE                  = opCodes.GAME_MSG_FACTION_BEGIN + 26   // 请离成功返回
// opCodes.C2G_FACTION_INVITE                = opCodes.GAME_MSG_FACTION_BEGIN + 27   // 邀请加入帮派
// opCodes.G2C_FACTION_INVITE                = opCodes.GAME_MSG_FACTION_BEGIN + 28   // 邀请加入帮派
// opCodes.C2G_FACTION_INVITE_RET            = opCodes.GAME_MSG_FACTION_BEGIN + 29   // 邀请加入帮派返回
// opCodes.C2G_FACTION_RECOMMEND_LEADER      = opCodes.GAME_MSG_FACTION_BEGIN + 30   // 自荐帮主
// opCodes.C2G_FACTION_RECOMMEND_LEADER_VOTE = opCodes.GAME_MSG_FACTION_BEGIN + 31   // 竞选帮主投票
// opCodes.G2C_FACTION_REWARD                = opCodes.GAME_MSG_FACTION_BEGIN + 32   // 设置赏赐成功
// opCodes.C2G_FACTION_NOTE                  = opCodes.GAME_MSG_FACTION_BEGIN + 33   // 请求宗族记录
// opCodes.G2C_FACTION_NOTE                  = opCodes.GAME_MSG_FACTION_BEGIN + 34   // 返回宗族记录
// opCodes.C2G_FACTION_NOTICE                = opCodes.GAME_MSG_FACTION_BEGIN + 35   // 修改公告内容
// opCodes.G2C_FACTION_NOTICE                = opCodes.GAME_MSG_FACTION_BEGIN + 36   // 刷新公告信息
// opCodes.C2G_FACTION_INTRODUCTION          = opCodes.GAME_MSG_FACTION_BEGIN + 37   // 修改介绍内容
// opCodes.G2C_FACTION_INTRODUCTION          = opCodes.GAME_MSG_FACTION_BEGIN + 38   // 刷新介绍内容
// opCodes.C2G_FACTION_REWARD_QUERY          = opCodes.GAME_MSG_FACTION_BEGIN + 41   // 普通成员查询赏赐管理信息
// opCodes.G2C_FACTION_REWARD_QUERY          = opCodes.GAME_MSG_FACTION_BEGIN + 42   // 返回查询信息
// opCodes.G2C_FACTION_FLAG_LIST             = opCodes.GAME_MSG_FACTION_BEGIN + 46   // 访问宗族旗帜
// opCodes.G2C_FACTION_NPC_LIST              = opCodes.GAME_MSG_FACTION_BEGIN + 47   // 访问帮会内的npc
// opCodes.G2C_FACTION_DEL_APPLY             = opCodes.GAME_MSG_FACTION_BEGIN + 48   // 删除申请信息
// opCodes.C2G_FACTION_ACK_BUILD             = opCodes.GAME_MSG_FACTION_BEGIN + 51   // 确认开启建设
// opCodes.C2G_FACTION_ACK_STOP_BUILD        = opCodes.GAME_MSG_FACTION_BEGIN + 54   // 停止建设
// opCodes.C2G_FACTION_RESEARCH_SKILL        = opCodes.GAME_MSG_FACTION_BEGIN + 55   // 研究技能
// opCodes.G2C_FACTION_TIPS                  = opCodes.GAME_MSG_FACTION_BEGIN + 61   // 宗族频道提示信息
// opCodes.G2C_FACTION_DESTROY_FACTION       = opCodes.GAME_MSG_FACTION_BEGIN + 63   // 解散帮派
// opCodes.C2G_FACTION_DESTROY_FACTION       = opCodes.GAME_MSG_FACTION_BEGIN + 64   // 解散帮派
// opCodes.G2C_FACTION_SINGLE_MEMBER_REFRESH = opCodes.GAME_MSG_FACTION_BEGIN + 65   // 刷新单个成员数据
// opCodes.C2G_FACTION_SINGLE_MEMBER_REFRESH = opCodes.GAME_MSG_FACTION_BEGIN + 66   // 返回单个成员数据
// opCodes.C2G_FACTION_ME                    = opCodes.GAME_MSG_FACTION_BEGIN + 67   // 请求验证是否在自己帮派
// opCodes.G2C_FACTION_ME                    = opCodes.GAME_MSG_FACTION_BEGIN + 68   // 返回验证是否在自己帮派
// opCodes.C2G_FACTION_CHANGE_LOGO           = opCodes.GAME_MSG_FACTION_BEGIN + 70   // 修改宗族标志
// opCodes.C2G_FACTION_CLEAR_APPLY           = opCodes.GAME_MSG_FACTION_BEGIN + 71   // 清空申请列表
// opCodes.C2G_FACTION_CHANGE_NAME           = opCodes.GAME_MSG_FACTION_BEGIN + 72   // 改名
// opCodes.C2G_FACTION_ENTER_OTHER_MAP       = opCodes.GAME_MSG_FACTION_BEGIN + 73   // 进入其他帮派地图
// opCodes.C2G_FACTION_SKILLS_REFRESH        = opCodes.GAME_MSG_FACTION_BEGIN + 74   // 刷新帮派技能
// opCodes.G2C_FACTION_SKILLS_REFRESH        = opCodes.GAME_MSG_FACTION_BEGIN + 75   // 刷新帮派技能
// opCodes.C2G_FACTION_ATTENDANCE            = opCodes.GAME_MSG_FACTION_BEGIN + 77   // 帮派签到
// opCodes.C2G_FACTION_MEMBER_INFO           = opCodes.GAME_MSG_FACTION_BEGIN + 78   // 单个成员信息
// opCodes.C2G_FACTION_CANCLE_APPLY          = opCodes.GAME_MSG_FACTION_BEGIN + 79   // 取消申请
// opCodes.G2C_FACTION_CANCLE_APPLY          = opCodes.GAME_MSG_FACTION_BEGIN + 80   // 取消申请

// opCodes.G2C_FACTION_WAREHOUSE_LIST        = opCodes.GAME_MSG_FACTION_BEGIN + 81 //军团仓库列表
// opCodes.C2G_FACTION_WAREHOUSE_LIST        = opCodes.GAME_MSG_FACTION_BEGIN + 82 //军团仓库列表
// opCodes.C2G_FACTION_ITEM_CHOOSE           = opCodes.GAME_MSG_FACTION_BEGIN + 83 //团长分配
// opCodes.G2C_FACTION_ITEM_CHOOSE           = opCodes.GAME_MSG_FACTION_BEGIN + 84 //团长分配返回
// opCodes.C2G_FACTION_WAREHOUSE_APPLY       = opCodes.GAME_MSG_FACTION_BEGIN + 85 //申请物品
// opCodes.G2C_FACTION_WAREHOUSE_APPLY       = opCodes.GAME_MSG_FACTION_BEGIN + 86 //申请物品返回
// opCodes.C2G_FACTION_WAREHOUSE_CANCEL      = opCodes.GAME_MSG_FACTION_BEGIN + 87 //取消申请物品
// opCodes.G2C_FACTION_WAREHOUSE_CANCEL      = opCodes.GAME_MSG_FACTION_BEGIN + 88 //取消申请物品
// opCodes.G2C_FACTION_ALLOCA_RECORD         = opCodes.GAME_MSG_FACTION_BEGIN + 89 //军团分配记录
// opCodes.C2G_FACTION_ALLOCA_RECORD         = opCodes.GAME_MSG_FACTION_BEGIN + 90 //军团分配记录
// opCodes.C2G_FACTION_BUY_RECORD            = opCodes.GAME_MSG_FACTION_BEGIN + 91 //军团购买记录
// opCodes.G2C_FACTION_BUY_RECORD            = opCodes.GAME_MSG_FACTION_BEGIN + 92 //军团购买记录
// opCodes.C2G_FACTION_QUERY_INTRODUCT       = opCodes.GAME_MSG_FACTION_BEGIN + 93 //查询军团介绍
// //军团pve
// opCodes.C2G_FACTION_PVE_INFO              = opCodes.GAME_MSG_FACTION_BEGIN + 94 //军团pve信息
// opCodes.G2C_FACTION_PVE_INFO              = opCodes.GAME_MSG_FACTION_BEGIN + 95 //军团pve信息
// opCodes.G2C_FACTION_PVE_FIGHT_RECORD      = opCodes.GAME_MSG_FACTION_BEGIN + 96 //军团战斗记录
// opCodes.C2G_FACTION_PVE_FIGHT_RECORD      = opCodes.GAME_MSG_FACTION_BEGIN + 97 //军团战斗记录
// opCodes.G2C_FACTION_PVE_DAMAGE_RANK       = opCodes.GAME_MSG_FACTION_BEGIN + 98 //军团战斗伤害排名
// opCodes.C2G_FACTION_PVE_DAMAGE_RANK       = opCodes.GAME_MSG_FACTION_BEGIN + 99 //军团战斗伤害排名
// opCodes.C2G_FACTION_PVE_CREATE_FIGHT      = opCodes.GAME_MSG_FACTION_BEGIN + 100 //战斗
// opCodes.C2G_FACTION_PVE_OPEN              = opCodes.GAME_MSG_FACTION_BEGIN + 101 //开启pve
// //军团建筑
// opCodes.C2G_FACTION_BUILD_INFO            = opCodes.GAME_MSG_FACTION_BEGIN + 102 //查询军团建筑信息
// opCodes.G2C_FACTION_BUILD_INFO            = opCodes.GAME_MSG_FACTION_BEGIN + 103 //查询军团建筑信息返回
// opCodes.C2G_FACTION_BUILD_DONATE          = opCodes.GAME_MSG_FACTION_BEGIN + 104 //贡献某个建筑
// opCodes.C2G_FACTION_BUILD_POINT           = opCodes.GAME_MSG_FACTION_BEGIN + 105 //申请军团建筑积分
// opCodes.G2C_FACTION_BUILD_POINT           = opCodes.GAME_MSG_FACTION_BEGIN + 106 //军团建筑积分返回
// //军团技能
// opCodes.C2G_FACTION_SKILL_INFO            = opCodes.GAME_MSG_FACTION_BEGIN + 107 //申请军团技能等级信息
// opCodes.G2C_FACTION_SKILL_INFO            = opCodes.GAME_MSG_FACTION_BEGIN + 108 //返回军团技能等级信息
// opCodes.C2G_FACTION_SKILL_LEVEL_UP        = opCodes.GAME_MSG_FACTION_BEGIN + 109 //申请军团技能升级
// //opCodes.G2C_FACTION_ATTENDANCE          = opCodes.GAME_MSG_FACTION_BEGIN + 110 //军团签到返回

// //军团任务
// opCodes.C2G_FACTION_TASK_REQUEST        = opCodes.GAME_MSG_FACTION_BEGIN + 111 //申请军团任务
// opCodes.G2C_FACTION_TASK_REQUEST        = opCodes.GAME_MSG_FACTION_BEGIN + 112 //申请军团返回
// opCodes.C2G_FACTION_ITEM_TASK_REQUEST   = opCodes.GAME_MSG_FACTION_BEGIN + 113 //申请军团道具类任务
// opCodes.G2C_FACTION_ITEM_TASK_REQUEST   = opCodes.GAME_MSG_FACTION_BEGIN + 114 //申请军团道具类返回
// opCodes.C2G_FACTION_TASK_COUNT_RANK     = opCodes.GAME_MSG_FACTION_BEGIN + 115 //申请军团任务排行
// opCodes.G2C_FACTION_TASK_COUNT_RANK     = opCodes.GAME_MSG_FACTION_BEGIN + 116 //申请军团返回排行
// opCodes.C2G_FACTION_PUB_TASK_REQUEST    = opCodes.GAME_MSG_FACTION_BEGIN + 117 //申请军团发布类任务
// opCodes.G2C_FACTION_PUB_TASK_REQUEST    = opCodes.GAME_MSG_FACTION_BEGIN + 118 //申请军团发布类返回
// opCodes.C2G_FACTION_PUB_POOL            = opCodes.GAME_MSG_FACTION_BEGIN + 119 //申请军团任务任务池
// opCodes.G2C_FACTION_PUB_POOL            = opCodes.GAME_MSG_FACTION_BEGIN + 120 //申请军团任务任务池
// opCodes.C2G_FACTION_PUB_TASK            = opCodes.GAME_MSG_FACTION_BEGIN + 121 //发布军团任务
// opCodes.C2G_TAKE_FACTION_PUB_TASK       = opCodes.GAME_MSG_FACTION_BEGIN + 122 //领取军团任务
// opCodes.C2G_FACTION_PUB_TASK_COUNT      = opCodes.GAME_MSG_FACTION_BEGIN + 123 //申请可发布次数
// opCodes.G2C_FACTION_PUB_TASK_COUNT      = opCodes.GAME_MSG_FACTION_BEGIN + 124 //返回可发布次数

// //公会任务
// opCodes.C2G_FACTION_TASK_POINT_RANK     = opCodes.GAME_MSG_FACTION_BEGIN + 125 //公会任务积分排行
// opCodes.G2C_FACTION_TASK_POINT_RANK     = opCodes.GAME_MSG_FACTION_BEGIN + 126 //公会任务积分排行
// opCodes.C2G_FACTION_TASK_INFO_UPDATA    = opCodes.GAME_MSG_FACTION_BEGIN + 127 //公会任务单条更新
// opCodes.G2C_FACTION_TASK_INFO_UPDATA    = opCodes.GAME_MSG_FACTION_BEGIN + 128 //公会任务单条更新
// opCodes.C2G_FACTION_TASK_INFO_LIST      = opCodes.GAME_MSG_FACTION_BEGIN + 129 //公会任务列表
// opCodes.G2C_FACTION_TASK_INFO_LIST      = opCodes.GAME_MSG_FACTION_BEGIN + 130 //公会任务列表
// opCodes.C2G_FACTION_TASK_GET_POINT      = opCodes.GAME_MSG_FACTION_BEGIN + 131 //公会任务积分
// opCodes.G2C_FACTION_TASK_POINT_UPDATA   = opCodes.GAME_MSG_FACTION_BEGIN + 132 //公会任务积分
// opCodes.C2G_FACTION_TASK_POINT_PRIZE    = opCodes.GAME_MSG_FACTION_BEGIN + 133 //公会任务积分奖励
// opCodes.C2G_FACTION_TASK_RANK_PRIZE    = opCodes.GAME_MSG_FACTION_BEGIN + 134 //公会任务结算排行
// opCodes.G2C_FACTION_TASK_RANK_PRIZE       = opCodes.GAME_MSG_FACTION_BEGIN + 135 //公会任务结算排行
// opCodes.C2G_FACTION_TREA_HOUSE_RECORD   = opCodes.GAME_MSG_FACTION_BEGIN + 136 //分配记录
// opCodes.G2C_FACTION_TREA_HOUSE_RECORD   = opCodes.GAME_MSG_FACTION_BEGIN + 137 //分配记录
// opCodes.C2G_FACTION_TREA_HOUSE_ALLOCA   = opCodes.GAME_MSG_FACTION_BEGIN + 138 //宝藏分配
// opCodes.C2G_FACTION_TASK_RANK_INFO      = opCodes.GAME_MSG_FACTION_BEGIN + 139 //全服排行页面信息
// opCodes.G2C_FACTION_TASK_RANK_INFO      = opCodes.GAME_MSG_FACTION_BEGIN + 140 //全服排行页面信息
// //Treasure

// //混沌时空
// opCodes.C2G_ROBBER_ENTER                = opCodes.GAME_MSG_ROBBER_BEGIN + 1 //进入
// opCodes.C2G_ROBBER_LEAVE                = opCodes.GAME_MSG_ROBBER_BEGIN + 2 //离开
// //opCodes.C2G_ROBBER_NEXT_ROOM            = opCodes.GAME_MSG_ROBBER_BEGIN + 3 //下一场景
// //opCodes.C2G_ROBBER_PRE_ROOM             = opCodes.GAME_MSG_ROBBER_BEGIN + 4 //上一场景
// opCodes.C2G_ROBBER_FIGHT_NPC            = opCodes.GAME_MSG_ROBBER_BEGIN + 5 //挑战怪物
// opCodes.C2G_ROBBER_FIGHT_PLAYER         = opCodes.GAME_MSG_ROBBER_BEGIN + 6 //挑战玩家
// opCodes.G2C_ROBBER_ENTER                = opCodes.GAME_MSG_ROBBER_BEGIN + 7 //进入
// opCodes.G2C_ROBBER_LEAVE                = opCodes.GAME_MSG_ROBBER_BEGIN + 8 //离开
// opCodes.C2G_ROBBER_CLEAR_PUNISH         = opCodes.GAME_MSG_ROBBER_BEGIN + 9 //清除死亡惩罚
// opCodes.G2C_ROBBER_ENTER_ROOM           = opCodes.GAME_MSG_ROBBER_BEGIN + 10 //进入房间
// opCodes.G2C_ROBBER_UPDATE_MSG           = opCodes.GAME_MSG_ROBBER_BEGIN + 11 //更新信息
// opCodes.C2G_ROBBER_PICK_TICKET          = opCodes.GAME_MSG_ROBBER_BEGIN + 12 //拾取挑战令牌
// opCodes.C2G_ROBBER_KILLER_LIST          = opCodes.GAME_MSG_ROBBER_BEGIN + 13 //复仇名单
// opCodes.G2C_ROBBER_KILLER_LIST          = opCodes.GAME_MSG_ROBBER_BEGIN + 14 //复仇名单
// //opCodes.C2G_ROBBER_PICK_BOSSBOX         = opCodes.GAME_MSG_ROBBER_BEGIN + 15 //拾取头目宝箱
// opCodes.C2G_ROBBER_KILLER_POS           = opCodes.GAME_MSG_ROBBER_BEGIN + 16 //复仇名单位置
// opCodes.G2C_ROBBER_KILLER_POS           = opCodes.GAME_MSG_ROBBER_BEGIN + 17 //复仇名单位置
// //opCodes.C2G_ROBBER_LOTTERY              = opCodes.GAME_MSG_ROBBER_BEGIN + 18 //碎片宝箱
// //opCodes.G2C_ROBBER_LOTTERY              = opCodes.GAME_MSG_ROBBER_BEGIN + 19 //碎片宝箱
// opCodes.C2G_ROBBER_TEST_ENTER           = opCodes.GAME_MSG_ROBBER_BEGIN + 20 //测试进入
// opCodes.G2C_ROBBER_TEST_ENTER           = opCodes.GAME_MSG_ROBBER_BEGIN + 21 //测试进入返回
// opCodes.C2G_ROBBER_UPDATE_MSG           = opCodes.GAME_MSG_ROBBER_BEGIN + 22 //更新信息
// //opCodes.C2G_ROBBER_SIMULATIVE_ENTE    R = opCodes.GAME_MSG_ROBBER_BEGIN + 23 //进入模拟场景
// //opCodes.C2G_ROBBER_SIMULATIVE_LEAV    E = opCodes.GAME_MSG_ROBBER_BEGIN + 24 //离开模拟场景
// //opCodes.C2G_ROBBER_SIMULATIVE_FIGH    T = opCodes.GAME_MSG_ROBBER_BEGIN + 25 //模拟战斗
// //opCodes.C2G_ROBBER_SPECIAL_EVENT        = opCodes.GAME_MSG_ROBBER_BEGIN + 26 //触发神像事件
// opCodes.C2G_ROBBER_PICK_EVENT_BOX       = opCodes.GAME_MSG_ROBBER_BEGIN + 27 //触发神像事件
// opCodes.C2G_ROBBER_REFRESH_TIME         = opCodes.GAME_MSG_ROBBER_BEGIN + 28 //怪物刷新时间
// opCodes.G2C_ROBBER_REFRESH_TIME         = opCodes.GAME_MSG_ROBBER_BEGIN + 29 //怪物刷新时间
// opCodes.C2G_ROBBER_QUERY_COPYMAP        = opCodes.GAME_MSG_ROBBER_BEGIN + 30 //副本情况
// opCodes.G2C_ROBBER_QUERY_COPYMAP        = opCodes.GAME_MSG_ROBBER_BEGIN + 31 //副本情况
// //opCodes.G2C_ROBBER_QUERY_CONDITION      = opCodes.GAME_MSG_ROBBER_BEGIN + 32 //查询是否可以挑战
// //opCodes.C2G_ROBBER_QUERY_CONDITION      = opCodes.GAME_MSG_ROBBER_BEGIN + 33 //查询是否可以挑战
// opCodes.C2G_ROBBER_PICK_BOSS_BOX        = opCodes.GAME_MSG_ROBBER_BEGIN + 34 //捡boss宝箱
// //opCodes.C2G_USE_SKILL_ITEM              = opCodes.GAME_MSG_ROBBER_BEGIN + 35 //使用技能道具
// //opCodes.C2G_SEND_ITEM_COLD_TIME         = opCodes.GAME_MSG_ROBBER_BEGIN + 36 //申请道具冷却时间
// //opCodes.G2C_SEND_ITEM_COLD_TIME         = opCodes.GAME_MSG_ROBBER_BEGIN + 37 //返回道具冷却时间
// //opCodes.C2G_ROBBER_MUTIL_INCOME         = opCodes.GAME_MSG_ROBBER_BEGIN + 38 //混沌多倍收入
// opCodes.C2G_ROBBER_OFFLINE         	    = opCodes.GAME_MSG_ROBBER_BEGIN + 39 //混沌离线挂机
// opCodes.G2C_ROBBER_OFFLINE         	    = opCodes.GAME_MSG_ROBBER_BEGIN + 40 //混沌离线挂机
// opCodes.C2G_ROBBER_CAN_OFFLINE          = opCodes.GAME_MSG_ROBBER_BEGIN + 41 //查询是否可挂机
// opCodes.G2C_ROBBER_CAN_OFFLINE          = opCodes.GAME_MSG_ROBBER_BEGIN + 42 //查询是否可挂机
// //opCodes.G2C_ROBBER_LOTTERY_COUNT        = opCodes.GAME_MSG_ROBBER_BEGIN + 43 //查询当天剩余抽奖次数
// //opCodes.C2G_ROBBER_LOTTERY_COUNT        = opCodes.GAME_MSG_ROBBER_BEGIN + 44 //查询当天剩余抽奖次数
// opCodes.C2G_ROBBER_SET_PRIZE_POWER      = opCodes.GAME_MSG_ROBBER_BEGIN + 45 //奖励类型与体力消耗
// opCodes.C2G_ROBBER_GET_PRIZE_POWER      = opCodes.GAME_MSG_ROBBER_BEGIN + 46 //奖励类型与体力消耗
// opCodes.G2C_ROBBER_GET_PRIZE_POWER      = opCodes.GAME_MSG_ROBBER_BEGIN + 47 //奖励类型与体力消耗
// //opCodes.C2G_ROBBER_ENTER_LOTTERY        = opCodes.GAME_MSG_ROBBER_BEGIN + 48 //进入抽奖界面
// //opCodes.G2C_ROBBER_ENTER_LOTTERY        = opCodes.GAME_MSG_ROBBER_BEGIN + 49 //进入抽奖界面
// //opCodes.G2C_ROBBER_LOTTERY_LIB          = opCodes.GAME_MSG_ROBBER_BEGIN + 50 //抽奖库内容
// //opCodes.C2G_ROBBER_LOTTERY_REFRESH      = opCodes.GAME_MSG_ROBBER_BEGIN + 51 //抽奖库刷新
// opCodes.G2C_ROBBER_HANG_LIST            = opCodes.GAME_MSG_ROBBER_BEGIN + 52 //挂机列表
// opCodes.G2C_ROBBER_FIGHT_GRADE          = opCodes.GAME_MSG_ROBBER_BEGIN + 53 //战斗评级
// opCodes.C2G_ROBBER_FIGHT_RESULT         = opCodes.GAME_MSG_ROBBER_BEGIN + 55 //挂机结算
// opCodes.G2C_ROBBER_FIGHT_RESULT         = opCodes.GAME_MSG_ROBBER_BEGIN + 56 //挂机结算
// opCodes.C2G_ROBBER_HANG_STATUS          = opCodes.GAME_MSG_ROBBER_BEGIN + 57 //确认是否挂机(configRobber.hangStatus,configRobber.leisure)
// opCodes.C2G_ROBBER_USE_SKILL            = opCodes.GAME_MSG_ROBBER_BEGIN + 58 //使用技能
// opCodes.G2C_ROBBER_HANG_LIST_REMOVE     = opCodes.GAME_MSG_ROBBER_BEGIN + 59 //移除虚拟挂机玩家
// opCodes.G2C_ROBBER_HANG_LIST_ADD        = opCodes.GAME_MSG_ROBBER_BEGIN + 60 //增加虚拟挂机玩家
// opCodes.G2C_ROBBER_ROLE_APPEAR          = opCodes.GAME_MSG_ROBBER_BEGIN + 61 //发送外观协议
// opCodes.G2C_ROBBER_INCOME_LIST          = opCodes.GAME_MSG_ROBBER_BEGIN + 62 //发送收益列表
// opCodes.C2G_ROBBER_INCOME_LIST          = opCodes.GAME_MSG_ROBBER_BEGIN + 63 //请求收益列表
// opCodes.C2G_ROBBER_HOLD_ITME_NPC        = opCodes.GAME_MSG_ROBBER_BEGIN + 64 //占据物品奖励npc
// opCodes.C2G_ROBBER_LEAVE_ITEM_NPC       = opCodes.GAME_MSG_ROBBER_BEGIN + 65 //离开物品奖励npc
// opCodes.C2G_ROBBER_PRIZE_ITEM_NPC       = opCodes.GAME_MSG_ROBBER_BEGIN + 66 //获取物品奖励npc奖励
// opCodes.C2G_ROBBER_REQUEST_INCOME       = opCodes.GAME_MSG_ROBBER_BEGIN + 67 //获取收益列表里的东西
// opCodes.G2C_ROBBER_INCOME_TIPS          = opCodes.GAME_MSG_ROBBER_BEGIN + 68 //收益列表有东西来了
// opCodes.G2C_ROBBER_RECORD_PRIZE_INFO    = opCodes.GAME_MSG_ROBBER_BEGIN + 69 //圣地奖励排行收益信息
// opCodes.C2G_ROBBER_RECORD_PRIZE_INFO    = opCodes.GAME_MSG_ROBBER_BEGIN + 70 //圣地奖励排行收益信息
// opCodes.C2G_ROBBER_BOSS_INFO            = opCodes.GAME_MSG_ROBBER_BEGIN + 71 //圣地boss信息
// opCodes.G2C_ROBBER_BOSS_INFO            = opCodes.GAME_MSG_ROBBER_BEGIN + 72 //圣地boss信息
// opCodes.C2G_ROBBER_SET_OFFLINE_HANG	    = opCodes.GAME_MSG_ROBBER_BEGIN + 73 //圣地离线挂机体力设置
// opCodes.C2G_ROBBER_OFFLINE_HANG_INFO    = opCodes.GAME_MSG_ROBBER_BEGIN + 74 //圣地离线挂机设置信息
// opCodes.G2C_ROBBER_OFFLINE_HANG_INFO    = opCodes.GAME_MSG_ROBBER_BEGIN + 75 //圣地离线挂机设置信息
// opCodes.G2C_ROBBER_OFFLINE_INCOME_TIPS  = opCodes.GAME_MSG_ROBBER_BEGIN + 76 //圣地离线挂机收益提示
// opCodes.C2G_ROBBER_REQUEST_OFFLINE_INCOME = opCodes.GAME_MSG_ROBBER_BEGIN + 77 //获取离线收益列表里的东西
// opCodes.G2C_ROBBER_TICKET_POSITION      = opCodes.GAME_MSG_ROBBER_BEGIN + 78 //钥匙位置


// //光明神殿
// //opCodes.C2G_LOSTTEMPLE_ENTER            = opCodes.GAME_MSG_LOSTTEMPLE_BEGIN + 1 //进入
// //opCodes.G2C_LOSTTEMPLE_ENTER            = opCodes.GAME_MSG_LOSTTEMPLE_BEGIN + 2 //进入
// //opCodes.C2G_LOSTTEMPLE_LEAVE            = opCodes.GAME_MSG_LOSTTEMPLE_BEGIN + 3 //离开
// //opCodes.G2C_LOSTTEMPLE_LEAVE            = opCodes.GAME_MSG_LOSTTEMPLE_BEGIN + 4 //离开
// //opCodes.C2G_LOSTTEMPLE_FIGHT            = opCodes.GAME_MSG_LOSTTEMPLE_BEGIN + 5 //战斗
// opCodes.C2G_LOSTTEMPLE_PICK             = opCodes.GAME_MSG_LOSTTEMPLE_BEGIN + 6 //拾取
// opCodes.C2G_LOSTTEMPLE_OPEN             = opCodes.GAME_MSG_LOSTTEMPLE_BEGIN + 7 //打开
// //opCodes.C2G_LOSTTEMPLE_CLEAR_CD         = opCodes.GAME_MSG_LOSTTEMPLE_BEGIN + 8 //清空CD
// opCodes.G2C_LOSTTEMPLE_PALYER_MSG       = opCodes.GAME_MSG_LOSTTEMPLE_BEGIN + 9 //玩家信息
// opCodes.G2C_LOSTTEMPLE_MAP_MSG          = opCodes.GAME_MSG_LOSTTEMPLE_BEGIN + 10 //地图信息
// opCodes.G2C_LOSTTEMPLE_ROLE_APPEAR      = opCodes.GAME_MSG_LOSTTEMPLE_BEGIN + 11 //玩家外观信息
// opCodes.G2C_LOSTTEMPLE_NPC_MSG          = opCodes.GAME_MSG_LOSTTEMPLE_BEGIN + 12 //当前神像数量

//friend
opCodes.C2G_APPLY_FRIEND_ADD             = opCodes.GAME_MSG_FRIEND_BEGIN + 1 //添加好友//
opCodes.G2C_APPLY_FRIEND_ADD             = opCodes.GAME_MSG_FRIEND_BEGIN + 2
opCodes.C2G_FRIEND_DEL                   = opCodes.GAME_MSG_FRIEND_BEGIN + 3 //删除好友
opCodes.G2C_FRIEND_DEL                   = opCodes.GAME_MSG_FRIEND_BEGIN + 4
opCodes.C2G_FRIEND_FIND                  = opCodes.GAME_MSG_FRIEND_BEGIN + 5
opCodes.G2C_FRIEND_FIND                  = opCodes.GAME_MSG_FRIEND_BEGIN + 6
opCodes.C2G_FRIEND_GROUP_ADD             = opCodes.GAME_MSG_FRIEND_BEGIN + 7 //添加好友组
opCodes.G2C_FRIEND_GROUP_ADD             = opCodes.GAME_MSG_FRIEND_BEGIN + 8
opCodes.C2G_FRIEND_GROUP_CHANGE_NAME     = opCodes.GAME_MSG_FRIEND_BEGIN + 9
opCodes.G2C_FRIEND_GROUP_CHANGE_NAME     = opCodes.GAME_MSG_FRIEND_BEGIN + 10
opCodes.C2G_FRIEND_GROUP_DEL             = opCodes.GAME_MSG_FRIEND_BEGIN + 11
opCodes.G2C_FRIEND_GROUP_DEL             = opCodes.GAME_MSG_FRIEND_BEGIN + 12
opCodes.C2G_FRIEND_MOVE                  = opCodes.GAME_MSG_FRIEND_BEGIN + 13 //移动好友
opCodes.G2C_FRIEND_MOVE                  = opCodes.GAME_MSG_FRIEND_BEGIN + 14 //移动好友
opCodes.C2G_FRIEND_IM_SETTING            = opCodes.GAME_MSG_FRIEND_BEGIN + 15
opCodes.G2C_FRIEND_IM_SETTING            = opCodes.GAME_MSG_FRIEND_BEGIN + 16
opCodes.C2G_APPLY_FRIEND_ADD_AGREE       = opCodes.GAME_MSG_FRIEND_BEGIN + 17
opCodes.G2C_APPLY_FRIEND_ADD_AGREE       = opCodes.GAME_MSG_FRIEND_BEGIN + 18
opCodes.C2G_FRIEND_LIST                  = opCodes.GAME_MSG_FRIEND_BEGIN + 19 //发送列表
opCodes.G2C_FRIEND_LIST                  = opCodes.GAME_MSG_FRIEND_BEGIN + 20
opCodes.C2G_FRIEND_SETTING               = opCodes.GAME_MSG_FRIEND_BEGIN + 21
opCodes.G2C_FRIEND_SETTING               = opCodes.GAME_MSG_FRIEND_BEGIN + 22
opCodes.C2G_FRIEND_FIND_BY_CONDITION     = opCodes.GAME_MSG_FRIEND_BEGIN + 23
opCodes.G2C_FRIEND_FIND_BY_CONDITION     = opCodes.GAME_MSG_FRIEND_BEGIN + 24
opCodes.G2C_FRIEND_VERIFY                = opCodes.GAME_MSG_FRIEND_BEGIN + 25
opCodes.G2C_FRIEND_ONLINE                = opCodes.GAME_MSG_FRIEND_BEGIN + 26
opCodes.G2C_FRIEND_OFFLINE               = opCodes.GAME_MSG_FRIEND_BEGIN + 27
//opCodes.G2C_FRIEND_REFRESH             = opCodes.GAME_MSG_FRIEND_BEGIN + 28 //更新好友度
opCodes.C2G_FRIEND_UPDATE_COMMENT        = opCodes.GAME_MSG_FRIEND_BEGIN + 29 //更新备注
opCodes.C2G_FRIEND_SEND_MESSAGE_ONE      = opCodes.GAME_MSG_FRIEND_BEGIN + 30 //客户端发送单个消息
opCodes.G2C_FRIEND_SEND_MESSAGE_ONE      = opCodes.GAME_MSG_FRIEND_BEGIN + 31 //客户端发送单个消息
opCodes.C2G_FRIEND_SEND_MESSAGE_GROUP    = opCodes.GAME_MSG_FRIEND_BEGIN + 32 //服务器转发群体消息
opCodes.G2C_FRIEND_SEND_MESSAGE_GROUP    = opCodes.GAME_MSG_FRIEND_BEGIN + 33 //服务器转发群体消息
opCodes.C2G_FRIEND_UPPDATE_INFO          = opCodes.GAME_MSG_FRIEND_BEGIN + 34 //更新信息
opCodes.G2C_FRIEND_UPPDATE_INFO          = opCodes.GAME_MSG_FRIEND_BEGIN + 35 //更新信息
opCodes.G2C_FRIEND_SEND_MESSAGE_SUCCESS  = opCodes.GAME_MSG_FRIEND_BEGIN + 36 //信息是否发送成功
opCodes.G2C_FRIEND_SINGLE_INFO           = opCodes.GAME_MSG_FRIEND_BEGIN + 37 //发送单个玩家信息
opCodes.G2C_FRIEND_UPDATE_FRIENDSHIP     = opCodes.GAME_MSG_FRIEND_BEGIN + 38 //更新好有度
opCodes.G2C_FRIEND_RECOMMEND_FRIENDS     = opCodes.GAME_MSG_FRIEND_BEGIN + 41 //推荐好友列表
opCodes.G2C_APPLY_FRIEND_INFO            = opCodes.GAME_MSG_FRIEND_BEGIN + 42 //申请好友列表
opCodes.G2C_STRANGER_INFO                = opCodes.GAME_MSG_FRIEND_BEGIN + 43 //陌生人信息
opCodes.G2C_FRIEND_OFFLINE_MESSAGE_COUNT = opCodes.GAME_MSG_FRIEND_BEGIN + 44 //留言信息数量
opCodes.C2G_DELETE_RECOMMEND_FRIEND      = opCodes.GAME_MSG_FRIEND_BEGIN + 45 //删除推荐好友
opCodes.G2C_DELETE_RECOMMEND_FRIEND      = opCodes.GAME_MSG_FRIEND_BEGIN + 46 //删除推荐好友
opCodes.C2G_FRIEND_RECOMMEND_FRIENDS     = opCodes.GAME_MSG_FRIEND_BEGIN + 47 //推荐好友列表
opCodes.C2G_FRIEND_FIND_ONLINE           = opCodes.GAME_MSG_FRIEND_BEGIN + 48 //查询在线玩家
opCodes.C2G_REJECT_FRIEND_ADD            = opCodes.GAME_MSG_FRIEND_BEGIN + 49 //客户端设置拒绝好友申请
opCodes.C2G_REJECT_FRIEND_ADD_STATE      = opCodes.GAME_MSG_FRIEND_BEGIN + 50 //查询是否拒绝好友申请
opCodes.G2C_REJECT_FRIEND_ADD            = opCodes.GAME_MSG_FRIEND_BEGIN + 51 //返回是否拒绝好友申请
opCodes.C2G_FRIEND_SEND_YOUQINGBI        = opCodes.GAME_MSG_FRIEND_BEGIN + 52 //赠送友情币
opCodes.C2G_FRIEND_GET_YOUQINGBI         = opCodes.GAME_MSG_FRIEND_BEGIN + 53 //接收友情币
//
// opCodes.G2C_NO_TROUBLE_SETTING           = opCodes.GAME_MSG_FRIEND_BEGIN + 52 //免打扰模式
// opCodes.C2G_NO_TROUBLE_SETTING           = opCodes.GAME_MSG_FRIEND_BEGIN + 53 //免打扰模式
// opCodes.C2G_CHAT_GROUP_CREATE            = opCodes.GAME_MSG_FRIEND_BEGIN + 54 //创建聊天组
// opCodes.G2C_CHAT_GROUP_UPDATE_INFO       = opCodes.GAME_MSG_FRIEND_BEGIN + 55 //更新聊天组信息
// opCodes.C2G_CHAT_GROUP_QUERY_MEMBERS     = opCodes.GAME_MSG_FRIEND_BEGIN + 56 //获取所有成员
// opCodes.G2C_CHAT_GROUP_QUERY_MEMBERS     = opCodes.GAME_MSG_FRIEND_BEGIN + 57 //获取所有成员
// opCodes.C2G_CHAT_GROUP_INVITE_JOIN       = opCodes.GAME_MSG_FRIEND_BEGIN + 58 //邀请XX加入
// opCodes.G2C_CHAT_GROUP_INVITE_JOIN       = opCodes.GAME_MSG_FRIEND_BEGIN + 59 //邀请XX加入
// opCodes.G2C_CHAT_GROUP_AGREE_JOIN        = opCodes.GAME_MSG_FRIEND_BEGIN + 60 //是否同意加入
// opCodes.C2G_CHAT_GROUP_AGREE_JOIN        = opCodes.GAME_MSG_FRIEND_BEGIN + 61 //是否同意加入
// opCodes.C2G_CHAT_GROUP_QUIT              = opCodes.GAME_MSG_FRIEND_BEGIN + 62 //退出
// opCodes.G2C_CHAT_GROUP_QUIT              = opCodes.GAME_MSG_FRIEND_BEGIN + 63 //退出
// opCodes.G2C_CHAT_GROUP_EXPELEE           = opCodes.GAME_MSG_FRIEND_BEGIN + 64 //开除
// opCodes.C2G_CHAT_GROUP_EXPELEE           = opCodes.GAME_MSG_FRIEND_BEGIN + 65 //被开除接受消息
// opCodes.C2G_CHAT_GROUP_CHAT              = opCodes.GAME_MSG_FRIEND_BEGIN + 66 //聊天
// opCodes.G2C_CHAT_GROUP_CHAT              = opCodes.GAME_MSG_FRIEND_BEGIN + 67 //聊天
// opCodes.C2G_CHAT_GROUP_LIST              = opCodes.GAME_MSG_FRIEND_BEGIN + 68 //聊天组列表
// opCodes.G2C_CHAT_GROUP_LIST              = opCodes.GAME_MSG_FRIEND_BEGIN + 69 //聊天组列表
// opCodes.G2C_CHAT_GROUP_CREATE            = opCodes.GAME_MSG_FRIEND_BEGIN + 70 //创建聊天组
// opCodes.C2G_CHAT_GROUP_REALSE            = opCodes.GAME_MSG_FRIEND_BEGIN + 71 //解散聊天组
// opCodes.G2C_CHAT_GROUP_REALSE            = opCodes.GAME_MSG_FRIEND_BEGIN + 72 //解散聊天组
// opCodes.G2C_SELECT_NO_TROUBLE_SETTING    = opCodes.GAME_MSG_FRIEND_BEGIN + 73 //查询免扰模式
// opCodes.C2G_SELECT_NO_TROUBLE_SETTING    = opCodes.GAME_MSG_FRIEND_BEGIN + 74 //查询免扰模式
// opCodes.C2G_CHAT_GROUP_INVITE_LIST       = opCodes.GAME_MSG_FRIEND_BEGIN + 75 //聊天组邀请列表
// opCodes.G2C_CHAT_GROUP_INVITE_LIST       = opCodes.GAME_MSG_FRIEND_BEGIN + 76 //聊天组邀请列表
// opCodes.C2G_FRIEND_INFO_REQUEST          = opCodes.GAME_MSG_FRIEND_BEGIN + 77 //申请好友消息
// opCodes.C2G_FRIEND_USE_ITEM              = opCodes.GAME_MSG_FRIEND_BEGIN + 78 //使用增加缘分值道具
// opCodes.C2G_FRIEND_GIVE_ITEM             = opCodes.GAME_MSG_FRIEND_BEGIN + 79 //赠送物品(货币)
// opCodes.C2G_ROLE_INVITE_FRIEND           = opCodes.GAME_MSG_FRIEND_BEGIN + 80 //渠道邀请
// opCodes.C2G_ROLE_INVITE_FRIEND_LIST      = opCodes.GAME_MSG_FRIEND_BEGIN + 81 //渠道邀请
// opCodes.G2C_ROLE_INVITE_FRIEND_LIST      = opCodes.GAME_MSG_FRIEND_BEGIN + 82 //渠道邀请
// opCodes.C2G_ROLE_INVITE_FRIEND_PRIZE     = opCodes.GAME_MSG_FRIEND_BEGIN + 83 //渠道邀请
// opCodes.G2C_FRIEND_GIVE_ITEM             = opCodes.GAME_MSG_FRIEND_BEGIN + 84 //赠送物品(货币)
// opCodes.C2G_FRIEND_GIVE_ITEM_RECORD      = opCodes.GAME_MSG_FRIEND_BEGIN + 85 //赠送物品(货币)记录


//talk && IM
// opCodes.C2G_PLAYER_TALK                 = opCodes.GAME_MSG_PLAYER_TALK_BEGIN + 1 //玩家之间聊天
// opCodes.G2C_PLAYER_TALK                 = opCodes.GAME_MSG_PLAYER_TALK_BEGIN + 2 //聊天发送
// opCodes.C2G_PLAYER_IM                   = opCodes.GAME_MSG_PLAYER_TALK_BEGIN + 3 //请求下线后的IM信息
// opCodes.G2C_PLAYER_IM                   = opCodes.GAME_MSG_PLAYER_TALK_BEGIN + 4 //返回下线后的IM信息
// opCodes.G2C_PLAYER_SYSTEM_MSG           = opCodes.GAME_MSG_PLAYER_TALK_BEGIN + 5 //发送系统消息
// opCodes.G2C_IM_COUNT                    = opCodes.GAME_MSG_PLAYER_TALK_BEGIN + 6 //发送IM数量

//card
// opCodes.C2G_PLAYER_SET_CARD             = opCodes.GAME_MSG_PLAYER_CARD_BEGIN + 1 //设置名片信息
// opCodes.G2C_PLAYER_SET_CARD             = opCodes.GAME_MSG_PLAYER_CARD_BEGIN + 2 //设置返回
// opCodes.C2G_PLAYER_GET_CARD             = opCodes.GAME_MSG_PLAYER_CARD_BEGIN + 3 //获取玩家名片信息
// opCodes.G2C_PLAYER_GET_CARD             = opCodes.GAME_MSG_PLAYER_CARD_BEGIN + 4 //名片信息返回
// opCodes.C2G_PLAYER_SET_CARD_LOG         = opCodes.GAME_MSG_PLAYER_CARD_BEGIN + 5 //打开名片设置界面
// opCodes.G2C_PLAYER_SET_CARD_LOG         = opCodes.GAME_MSG_PLAYER_CARD_BEGIN + 6 //返回名片设置界面
// opCodes.C2G_PLAYER_SET_USE_SACHOOP_LV   = opCodes.GAME_MSG_PLAYER_CARD_BEGIN + 7 //设置使用法阵等级
// opCodes.G2C_PLAYER_SET_USE_SACHOOP_LV   = opCodes.GAME_MSG_PLAYER_CARD_BEGIN + 8 //返回使用法阵等级
// opCodes.C2G_PLAYER_MASK_UNBLOCK_LIST    = opCodes.GAME_MSG_PLAYER_CARD_BEGIN + 9 //面具解锁列表
// opCodes.G2C_PLAYER_MASK_UNBLOCK_LIST    = opCodes.GAME_MSG_PLAYER_CARD_BEGIN + 10 //面具解锁列表
// opCodes.C2G_PLAYER_MASK_SET_MASK        = opCodes.GAME_MSG_PLAYER_CARD_BEGIN + 11 //设置面具

//强化刺激点
opCodes.G2C_EXCITE_LIMIT_CAMPAIGN        = opCodes.GAME_MSG_EXCITE_BEGIN + 1 //限时通关信息
opCodes.C2G_EXCITE_SERVER_FIRST_CAMPAIGN = opCodes.GAME_MSG_EXCITE_BEGIN + 2 //服务器通关信息
opCodes.G2C_EXCITE_SERVER_FIRST_CAMPAIGN = opCodes.GAME_MSG_EXCITE_BEGIN + 3 //服务器通关信息
opCodes.C2G_EXCITE_DATA                  = opCodes.GAME_MSG_EXCITE_BEGIN + 4 //强化刺激点信息
opCodes.G2C_EXCITE_DATA                  = opCodes.GAME_MSG_EXCITE_BEGIN + 5 //强化刺激点信息
opCodes.C2G_EXCITE_GET_PRIZE             = opCodes.GAME_MSG_EXCITE_BEGIN + 6 //领取奖励
opCodes.C2G_EXCITE_NOT_SERVER_FIRST_CAMP = opCodes.GAME_MSG_EXCITE_BEGIN + 7 //获取服务器关卡最近未通关
opCodes.G2C_EXCITE_NOT_SERVER_FIRST_CAMP = opCodes.GAME_MSG_EXCITE_BEGIN + 8 //获取服务器关卡最近未通关
opCodes.G2C_EXCITE_ALL_SERVER_FIRST_CAMP = opCodes.GAME_MSG_EXCITE_BEGIN + 9 //获取服务器所有关卡通关记录
opCodes.C2G_EXCITE_ALL_SERVER_FIRST_CAMP = opCodes.GAME_MSG_EXCITE_BEGIN + 10 //获取服务器所有关卡通关记录
opCodes.G2C_EXCITE_TIPS                  = opCodes.GAME_MSG_EXCITE_BEGIN + 11 //刺激点获取通知
// opCodes.C2G_STATISTICS_PET_DATA          = opCodes.GAME_MSG_EXCITE_BEGIN + 12 //部下数据
// opCodes.G2C_STATISTICS_PET_DATA          = opCodes.GAME_MSG_EXCITE_BEGIN + 13 //部下数据
// opCodes.C2G_STATISTICS_FAIRY_DATA        = opCodes.GAME_MSG_EXCITE_BEGIN + 14 //精灵数据
// opCodes.G2C_STATISTICS_FAIRY_DATA        = opCodes.GAME_MSG_EXCITE_BEGIN + 15 //精灵数据
// opCodes.C2G_STATISTICS_WING_DATA         = opCodes.GAME_MSG_EXCITE_BEGIN + 16 //翅膀数据
// opCodes.G2C_STATISTICS_WING_DATA         = opCodes.GAME_MSG_EXCITE_BEGIN + 17 //翅膀数据
// opCodes.C2G_STATISTICS_COMBAIND_DATA     = opCodes.GAME_MSG_EXCITE_BEGIN + 18 //援助数据
// opCodes.G2C_STATISTICS_COMBAIND_DATA     = opCodes.GAME_MSG_EXCITE_BEGIN + 19 //援助数据
// opCodes.C2G_STATISTICS_STONE_DATA        = opCodes.GAME_MSG_EXCITE_BEGIN + 20 //天赋石
// opCodes.G2C_STATISTICS_STONE_DATA        = opCodes.GAME_MSG_EXCITE_BEGIN + 21 //天赋石


// verify
opCodes.G2C_VERIFY_CODE        = opCodes.GAME_MSG_VERIFY_BEGIN	+ 1 //验证码图片	ushort,binary,ushort
opCodes.C2G_VERIFY_CODE        = opCodes.GAME_MSG_VERIFY_BEGIN	+ 2 //提交验证码	string
opCodes.C2G_VERIFY_CODE_CHANGE = opCodes.GAME_MSG_VERIFY_BEGIN	+ 3 //更换验证码
opCodes.G2C_VERIFY_LOGOUT      = opCodes.GAME_MSG_VERIFY_BEGIN	+ 4 //被踢下线

//activity
// opCodes.C2G_ACTIVE_DUIHUAN                   = opCodes.GAME_MSG_ACTIVITY_BEGIN + 1  //晶石兑换金币或者体力
// opCodes.G2C_QIANDAO_TIME                     = opCodes.GAME_MSG_ACTIVITY_BEGIN + 2  //发送签到信息
// opCodes.C2G_QIANDAO_AWARD                    = opCodes.GAME_MSG_ACTIVITY_BEGIN + 3  //领取签到奖励
// opCodes.C2G_SELECT_DAILY                     = opCodes.GAME_MSG_ACTIVITY_BEGIN + 4  //选择日常
// opCodes.G2C_SELECT_DAILY                     = opCodes.GAME_MSG_ACTIVITY_BEGIN + 5  //选择日常
// opCodes.G2C_DAILY_TEAM                       = opCodes.GAME_MSG_ACTIVITY_BEGIN + 6  //日常活动队伍信息
// opCodes.C2G_DAILY_ADD_ABILITY                = opCodes.GAME_MSG_ACTIVITY_BEGIN + 7  //增加属性
// opCodes.C2G_DAILY_COMBAT_START               = opCodes.GAME_MSG_ACTIVITY_BEGIN + 8  //开始战斗
// opCodes.C2G_DAILY_RESET_RECORD               = opCodes.GAME_MSG_ACTIVITY_BEGIN + 9  //重置记录
// opCodes.C2G_GET_DAILY_RANK                   = opCodes.GAME_MSG_ACTIVITY_BEGIN + 10 //获取排行榜
// opCodes.G2C_GET_DAILY_RANK                   = opCodes.GAME_MSG_ACTIVITY_BEGIN + 11 //获取排行榜
// opCodes.C2G_EXIT_DAILY                       = opCodes.GAME_MSG_ACTIVITY_BEGIN + 12 //退出日常活动
// opCodes.G2C_EXIT_DAILY                       = opCodes.GAME_MSG_ACTIVITY_BEGIN + 13 //退出日常活动返回
// opCodes.G2C_DAILY_RECORD_UPDATE              = opCodes.GAME_MSG_ACTIVITY_BEGIN + 14 //日常记录更新
// opCodes.G2C_DAILY_ENTER_NOTICE               = opCodes.GAME_MSG_ACTIVITY_BEGIN + 15 //队长广播进入活动
// opCodes.C2G_DAILY_ENTER_NOTICE               = opCodes.GAME_MSG_ACTIVITY_BEGIN + 16 //队长广播进入活动
// opCodes.C2G_DAILY_ENTER_NOTICE_RET           = opCodes.GAME_MSG_ACTIVITY_BEGIN + 17 //队员确认进入活动
// opCodes.G2C_DAILY_ENTER_NOTICE_RET           = opCodes.GAME_MSG_ACTIVITY_BEGIN + 18 //队员确认进入活动
// opCodes.C2G_RECHARGE_REWARD_INFO             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 19 //获取充值奖励信息
// opCodes.G2C_RECHARGE_REWARD_INFO             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 20 //返回充值奖励信息
// opCodes.C2G_RECHARGE_REWARD_AWARD            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 21 //领取充值奖励
// opCodes.C2G_WAR_HORN_REWARD_INFO             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 22 //战争号角领奖信息
// opCodes.C2G_GET_WAR_HORN_REWARD              = opCodes.GAME_MSG_ACTIVITY_BEGIN + 23 //领取战争号角
// opCodes.G2C_WAR_HORN_REWARD_INFO             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 24 //战争号角领奖信息
// opCodes.C2G_UPDATE_QUICK_RECRUIT             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 25 //快速招募列表信息
// opCodes.G2C_UPDATE_QUICK_RECRUIT             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 26 //快速招募列表信息
// opCodes.C2G_PET_QUICK_RECRUIT                = opCodes.GAME_MSG_ACTIVITY_BEGIN + 27 //快速招募请求
// opCodes.G2C_PET_QUICK_RECRUIT                = opCodes.GAME_MSG_ACTIVITY_BEGIN + 28 //快速招募请求
// opCodes.C2G_ACTIVE_DUIHUAN_SELECT            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 29 //晶石兑换金币或者体力次数查询
// opCodes.G2C_ACTIVE_DUIHUAN_SELECT            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 30 //晶石兑换金币或者体力次数查询
// opCodes.G2C_ATTENDANCE_FLAG                  = opCodes.GAME_MSG_ACTIVITY_BEGIN + 31 //女王祷告是否结束
// opCodes.C2G_SKYTOWER_INVITE_LIST             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 32 //天空之塔邀请列表
// opCodes.G2C_SKYTOWER_INVITE_LIST             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 33 //天空之塔邀请列表
// opCodes.G2C_SKYTOWER_REWARD_CHOOSE           = opCodes.GAME_MSG_ACTIVITY_BEGIN + 34 //天空之塔奖励选择
// opCodes.C2G_SKYTOWER_REWARD_CHOOSE           = opCodes.GAME_MSG_ACTIVITY_BEGIN + 35 //天空之塔奖励选择
// opCodes.G2C_ACTIVE_REFRESH                   = opCodes.GAME_MSG_ACTIVITY_BEGIN + 36 //活动重刷
// opCodes.G2C_PET_QUICK_RECRUIT_EX             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 37 //快速招募十连抽
// opCodes.C2G_PET_RECRUIT_HOOP_EX              = opCodes.GAME_MSG_ACTIVITY_BEGIN + 38//快速招募一键刷环
// opCodes.G2C_PET_RECRUIT_HOOP_EX              = opCodes.GAME_MSG_ACTIVITY_BEGIN + 39//快速招募一键刷环
// opCodes.G2C_QIANGDA_QUESTION                 = opCodes.GAME_MSG_ACTIVITY_BEGIN + 40//在线抢答题目
// opCodes.C2G_PLAT_FORM_CODE                   = opCodes.GAME_MSG_ACTIVITY_BEGIN + 41//渠道码
// opCodes.C2G_PLAT_DAILY_SHARE                 = opCodes.GAME_MSG_ACTIVITY_BEGIN + 42//每日分享
// opCodes.C2G_PLAY_NEW_BIE_CODE                = opCodes.GAME_MSG_ACTIVITY_BEGIN + 43//新手礼包码
// opCodes.G2C_AMBASSADOR_ACHIEVE_LIST          = opCodes.GAME_MSG_ACTIVITY_BEGIN + 44//邀请大使成就列表
// opCodes.G2C_ACTIVITY_MUTIL_INCOME            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 45//多倍收益
// opCodes.C2G_ACTIVITY_MUTIL_INCOME            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 46//多倍收益
// opCodes.C2G_ACTIVITY_WELFARE_LOTTERY         = opCodes.GAME_MSG_ACTIVITY_BEGIN + 47//福利活动抽奖
// opCodes.G2C_ACTIVITY_WELFARE_LOTTERY         = opCodes.GAME_MSG_ACTIVITY_BEGIN + 48//福利活动抽奖
// opCodes.C2G_SEVEN_DAY_PRIZE_INFO             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 49 //七日任务信息
// opCodes.G2C_SEVEN_DAY_PRIZE_INFO             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 50 //七日任务信息
// opCodes.C2G_SEVEN_DAY_GET_PRIZE              = opCodes.GAME_MSG_ACTIVITY_BEGIN + 51 //七日任务领取奖励
// opCodes.G2C_SEVEN_DAY_GET_PRIZE              = opCodes.GAME_MSG_ACTIVITY_BEGIN + 52 //七日任务领取奖励
// opCodes.C2G_HERO_DISCOUNT_QUERY              = opCodes.GAME_MSG_ACTIVITY_BEGIN + 53 //部下打折
// opCodes.G2C_HERO_DISCOUNT_QUERY              = opCodes.GAME_MSG_ACTIVITY_BEGIN + 54 //部下打折
// opCodes.C2G_WELFARE_LOTTERY_INFO             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 55 //福利活动抽奖信息
// opCodes.G2C_WELFARE_LOTTERY_INFO             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 56 //福利活动抽奖信息
// opCodes.C2G_ACTIVITY_TIME_INFO               = opCodes.GAME_MSG_ACTIVITY_BEGIN + 57 //活动时间详细
opCodes.G2C_ACTIVITY_TIME_INFO               = opCodes.GAME_MSG_ACTIVITY_BEGIN + 58 //活动时间详细

// opCodes.C2G_RECHARGE_EVE_DAY_ACCU_PAY        = opCodes.GAME_MSG_ACTIVITY_BEGIN + 59 //查询每日累计冲值活动
// opCodes.G2C_RECHARGE_EVE_DAY_ACCU_PAY        = opCodes.GAME_MSG_ACTIVITY_BEGIN + 60
// opCodes.C2G_PLAYER_EVE_DAY_ACCU_PAY          = opCodes.GAME_MSG_ACTIVITY_BEGIN + 61 //查询玩家在每日累计冲值活动中的信息比如哪些是达成了没有领取的
// opCodes.G2C_PLAYER_EVE_DAY_ACCU_PAY          = opCodes.GAME_MSG_ACTIVITY_BEGIN + 62
// opCodes.C2G_PLAYER_GIVE_EVE_DAY_ACCU_PAY     = opCodes.GAME_MSG_ACTIVITY_BEGIN + 63 //玩家领取每日累计冲值活动中的奖励

// opCodes.C2G_RECHARGE_EVE_DAY_ACCU_CONSUME    = opCodes.GAME_MSG_ACTIVITY_BEGIN + 64 //查询每日累计冲值活动
// opCodes.G2C_RECHARGE_EVE_DAY_ACCU_CONSUME    = opCodes.GAME_MSG_ACTIVITY_BEGIN + 65
// opCodes.C2G_PLAYER_EVE_DAY_ACCU_CONSUME      = opCodes.GAME_MSG_ACTIVITY_BEGIN + 66 //查询玩家在每日累计冲值活动中的信息比如哪些是达成了没有领取的
// opCodes.G2C_PLAYER_EVE_DAY_ACCU_CONSUME      = opCodes.GAME_MSG_ACTIVITY_BEGIN + 67
// opCodes.C2G_PLAYER_GIVE_EVE_DAY_ACCU_CONSUME = opCodes.GAME_MSG_ACTIVITY_BEGIN + 68 //玩家领取每日累计冲值活动中的奖励

// opCodes.C2G_WELFARE_SERVERS_LOTTERY_INFO     = opCodes.GAME_MSG_ACTIVITY_BEGIN + 69 //福利抽奖跨服通知
// opCodes.G2C_WELFARE_SERVERS_LOTTERY_INFO     = opCodes.GAME_MSG_ACTIVITY_BEGIN + 70 //福利抽奖跨服通知
// //老用户回归
// opCodes.C2G_PLAYER_RETURN_ACTIVITY           = opCodes.GAME_MSG_ACTIVITY_BEGIN + 71 //申请玩家回归活动信息
// opCodes.G2C_PLAYER_RETURN_ACTIVITY           = opCodes.GAME_MSG_ACTIVITY_BEGIN + 72 //玩家回归活动信息
// opCodes.C2G_PLAYER_RETURN_GET_DATA           = opCodes.GAME_MSG_ACTIVITY_BEGIN + 73 //申请玩家回归活动领取信息
// opCodes.G2C_PLAYER_RETURN_GET_DATA           = opCodes.GAME_MSG_ACTIVITY_BEGIN + 74 //玩家回归活动领取信息
// opCodes.C2G_PLAYER_RETURN_GET_PRIZE          = opCodes.GAME_MSG_ACTIVITY_BEGIN + 75 //领取某一天奖励
// //连续登陆活动
// opCodes.C2G_CONTINUOUS_LOGIN_ACTIVITY        = opCodes.GAME_MSG_ACTIVITY_BEGIN + 76 //申请连续登陆活动信息
// opCodes.G2C_CONTINUOUS_LOGIN_ACTIVITY        = opCodes.GAME_MSG_ACTIVITY_BEGIN + 77 //返回连续登陆活动信息
// opCodes.C2G_CONTINUOUS_LOGIN_GET_DATA        = opCodes.GAME_MSG_ACTIVITY_BEGIN + 78 //申请连续登陆活动领取信息
// opCodes.G2C_CONTINUOUS_LOGIN_GET_DATA        = opCodes.GAME_MSG_ACTIVITY_BEGIN + 79 //返回连续登陆活动领取信息
// opCodes.C2G_CONTINUOUS_LOGIN_GET_PRIZE       = opCodes.GAME_MSG_ACTIVITY_BEGIN + 80 //领取某一天奖励
// //豪华签到活动
// opCodes.C2G_VIP_SING_IN_ACTIVITY             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 81 //申请豪华签到活动信息
// opCodes.G2C_VIP_SING_IN_ACTIVITY             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 82 //返回豪华签到活动信息
// opCodes.C2G_VIP_SING_IN_GET_DATA             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 83 //申请豪华签到活动领取信息
// opCodes.G2C_VIP_SING_IN_GET_DATA             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 84 //返回豪华签到领取信息
// opCodes.C2G_VIP_SING_IN_GET_PRIZE            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 85 //领取豪华签到奖励
// //天空之塔一键通关
// opCodes.C2G_SKY_GET_ALL_PRIZE                = opCodes.GAME_MSG_ACTIVITY_BEGIN + 86 //天空之塔一键通关
// //女仆转转乐
// opCodes.C2G_SOLT_MACHINE_ACTIVITY            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 87 //申请女仆转转乐活动信息
// opCodes.G2C_SOLT_MACHINE_ACTIVITY            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 88 //返回女仆转转乐活动信息
// opCodes.C2G_SOLT_MACHINE_GET_DATA            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 89 //申请女仆转转乐抽奖
// opCodes.G2C_SOLT_MACHINE_GET_DATA            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 90 //返回女仆转转乐抽奖结果
// opCodes.C2G_SOLT_MACHINE_GET_TENS            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 91 //申请女仆转转乐十连抽
// opCodes.G2C_SOLT_MACHINE_GET_TENS            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 92 //返回女仆转转乐十连抽结果
// //砸金蛋
// opCodes.C2G_GOLDEN_EGGS_ACTIVITY             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 92 //申请砸金蛋活动信息
// opCodes.G2C_GOLDEN_EGGS_ACTIVITY             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 93 //返回砸金蛋活动信息
// opCodes.C2G_GOLDEN_EGGS_GET_DATA             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 94 //申请砸金蛋抽奖
// opCodes.G2C_GOLDEN_EGGS_GET_DATA             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 95 //返回砸金蛋抽奖结果
// //招财猫
// opCodes.C2G_FORTUNE_CAT_ACTIVITY             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 96 //申请招财猫活动信息
// opCodes.G2C_FORTUNE_CAT_ACTIVITY             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 97 //返回招财猫活动信息
// opCodes.C2G_FORTUNE_CAT_GET_DATA             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 98 //申请招财猫抽奖
// opCodes.G2C_FORTUNE_CAT_GET_DATA             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 99 //返回招财猫抽奖结果
// //在线抢答
// opCodes.C2G_ONLINE_ANSWER                    = opCodes.GAME_MSG_ACTIVITY_BEGIN + 100 //在线抢答
// //统一冲值活动//
// opCodes.G2C_QUERY_ACTIVITY_LIST              = opCodes.GAME_MSG_ACTIVITY_BEGIN + 101 //活动列表
// opCodes.G2C_QUERY_ACTIVITY_UPDATE            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 102 //活动更新列表
// opCodes.C2G_QUERY_ACTIVITY_INFO              = opCodes.GAME_MSG_ACTIVITY_BEGIN + 103 //查询具体的活动信息
// opCodes.G2C_QUERY_ACTIVITY_INFO              = opCodes.GAME_MSG_ACTIVITY_BEGIN + 104 //返回具体的活动信息
// opCodes.C2G_QUERY_ACTIVITY_PLAYER            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 105 //查询玩家与这个活动相关的信息
// opCodes.G2C_QUERY_ACTIVITY_PLAYER            = opCodes.GAME_MSG_ACTIVITY_BEGIN + 106 //返回玩家与这个活动相关的信息
// opCodes.C2G_QUERY_ACTIVITY_PRIZE             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 107 //玩家领取奖励
// opCodes.C2G_QUERY_ACTIVITY_PLAYER_INFO       = opCodes.GAME_MSG_ACTIVITY_BEGIN + 108 //查询具体的活动和玩家信息
// opCodes.G2C_QUERY_ACTIVITY_PLAYER_INFO       = opCodes.GAME_MSG_ACTIVITY_BEGIN + 109 //查询具体的活动和玩家信息
// opCodes.C2G_SKY_TOWER_REVIVE                 = opCodes.GAME_MSG_ACTIVITY_BEGIN + 110 //天空之塔复活
// opCodes.G2C_SKY_TOWER_DISCOUNT_EVENT         = opCodes.GAME_MSG_ACTIVITY_BEGIN + 111 //天空之塔打折事件
 opCodes.G2C_NEW_SERVER_RANK_INFO             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 112 //冲榜活动
// opCodes.C2G_NEW_SERVER_RANK_INFO             = opCodes.GAME_MSG_ACTIVITY_BEGIN + 113 //冲榜活动

//招财猫
// opCodes.C2G_FORTUNE_CAT_PRIZE_LIST = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 1 //申请招财猫全服中奖信息
// opCodes.G2C_FORTUNE_CAT_PRIZE_LIST = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 2 //返回招财猫全服中奖信息
// //春分活动
// opCodes.C2G_SPRING_EQUINOX_ACTIVITY = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 3 //申请春分活动信息
// opCodes.G2C_SPRING_EQUINOX_ACTIVITY = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 4 //返回春分活动信息
// opCodes.C2G_SPRING_EQUINOX_GET_KITE = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 5 //申请捡风筝
// opCodes.C2G_SPRING_EQUINOX_KITE_RES = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 6 //申请兑换风筝
// opCodes.C2G_SPRING_EQUINOX_CARD_STR = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 7 //申请翻牌子
// opCodes.G2C_SPRING_EQUINOX_CARD_STR = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 8 //返回翻牌子申请结果
// opCodes.C2G_SPRING_EQUINOX_CARD_RES = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 9 //客户端返回翻牌是否中奖
// opCodes.G2C_SPRING_EQUINOX_CARD_RES = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 10 //服务器确认翻牌子结果
// //儿童节活动
// opCodes.C2G_CHILDREN_DAY_ACTIVITY = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 11 //申请儿童节活动信息
// opCodes.G2C_CHILDREN_DAY_ACTIVITY = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 12 //返回儿童节活动信息
// opCodes.C2G_CHILDREN_DAY_ONLINE   = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 13 //申请在线时间奖励
// opCodes.C2G_CHILDREN_DAY_CARD_STR = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 14 //申请翻牌子
// opCodes.G2C_CHILDREN_DAY_CARD_STR = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 15 //返回翻牌子申请结果
// opCodes.C2G_CHILDREN_DAY_CARD_RES = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 16 //客户端返回翻牌是否中奖
// opCodes.G2C_CHILDREN_DAY_CARD_RES = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 17 //服务器确认翻牌子结果
// //韩国月卡
// //opCodes.G2C_MONTH_CARD_OPENFLAG   = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 18 //韩国月卡
// //友情邀请码
// opCodes.G2C_FRIEND_INVITE_CODE_INFO   = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 19 //友情邀请码信息
// opCodes.G2C_INVITE_PRIZE_INFO         = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 20 //奖励信息
// opCodes.C2G_GET_INVITE_PRIZE          = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 21 //获取奖励
// //opCodes.G2C_RETURN_CODE_INFO          = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 22 //回归激活码信息(活动信息,个人信息)
// opCodes.C2G_INVITE_FILL_OUT_CODE      = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 23 //填写激活码
// opCodes.C2G_FRIEND_INVITE_CODE_INFO   = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 24 //友情邀请码信息
// //opCodes.C2G_RETURN_CODE_INFO          = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 25 //回归激活码信息(活动信息,个人信息)
// //opCodes.C2G_RETURN_PLAYER_FLAG        = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 26 //回归标记
// //opCodes.G2C_RETURN_PLAYER_FLAG        = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 27 //回归标记
// //红包
// opCodes.C2G_RED_ENVELOPE_LIST         = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 28 //查询红包列表
// opCodes.G2C_RED_ENVELOPE_LIST         = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 29 //查询红包列表
// opCodes.C2G_RED_ENVELOPE_RECORD       = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 30 //查询红包记录
// opCodes.G2C_RED_ENVELOPE_RECORD       = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 31 //查询红包记录
// opCodes.C2G_RED_ENVELOPE_SEND         = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 32 //发红包
// opCodes.C2G_RED_ENVELOPE_GET          = opCodes.GAME_MSG_ACTIVITY_V2_BEGIN + 33 //抢红包

// //world boss
// opCodes.C2G_BIGBOSS_ENTER          = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 1 //参加
// opCodes.G2C_BIGBOSS_BOSS_HP        = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 2 //BOSS血量
// opCodes.C2G_BIGBOSS_LEAVE          = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 3 //离开
// opCodes.G2C_BIGBOSS_PLAYER_DAMAGE  = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 4 //玩家个人伤害
// opCodes.G2C_BIGBOSS_DAMAGE_RANK    = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 5 //伤害排名
// opCodes.C2G_BIGBOSS_FIGHT          = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 6 //创建奖励
// opCodes.C2G_BIGBOSS_REVIVE         = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 7 //快速复活
// opCodes.C2G_BIGBOSS_INSPIRE        = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 8 //鼓舞
// opCodes.C2G_BIGBOSS_DAMAGE_RANK    = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 9 //获取伤害排名
// opCodes.C2G_BIGBOSS_PICK_BOX       = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 10//拾取宝箱
// opCodes.G2C_BIGBOSS_LEAVE          = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 11 //离开
// opCodes.G2C_BIGBOSS_REVIVE         = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 12 //快速复活
// opCodes.G2C_BIGBOSS_INSPIRE        = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 13 //鼓舞返回
// opCodes.G2C_BIGBOSS_ENTER          = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 14 //参加返回
// opCodes.G2C_BIGBOSS_FIGHTING_RANK  = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 15 //战时伤害排名
// opCodes.C2G_BIGBOSS_QUERY   		   = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 16 //查询活动
// opCodes.G2C_BIGBOSS_QUERY   		   = opCodes.GAME_MSG_WORLDBOSS_BEGIN + 17 //查询活动

opCodes.C2G_WORLDQUESTION_ENTER      = opCodes.GAME_MSG_WORLDQUESTION_BEGIN + 1 //参加
opCodes.G2C_WORLDQUESTION_ENTER      = opCodes.GAME_MSG_WORLDQUESTION_BEGIN + 2 //参加返回
opCodes.C2G_WORLDQUESTION_LEAVE      = opCodes.GAME_MSG_WORLDQUESTION_BEGIN + 3 //离开
opCodes.G2C_WORLDQUESTION_LEAVE      = opCodes.GAME_MSG_WORLDQUESTION_BEGIN + 4 //离开返回
opCodes.G2C_WORLDQUESTION_QUESTION   = opCodes.GAME_MSG_WORLDQUESTION_BEGIN + 5 //题目
opCodes.G2C_WORLDQUESTION_INFO       = opCodes.GAME_MSG_WORLDQUESTION_BEGIN + 6 //答题信息
opCodes.C2G_WORLDQUESTION_ANSWER     = opCodes.GAME_MSG_WORLDQUESTION_BEGIN + 7 //选择答案
opCodes.G2C_WORLDQUESTION_ANSWER     = opCodes.GAME_MSG_WORLDQUESTION_BEGIN + 8 //选择答案返回
opCodes.C2G_WORLDQUESTION_SKILL      = opCodes.GAME_MSG_WORLDQUESTION_BEGIN + 9 //使用技能1跟随大众，2双倍积分
opCodes.C2G_WORLDQUESTION_QUERY      = opCodes.GAME_MSG_WORLDQUESTION_BEGIN + 10 //查询活动状态
opCodes.G2C_WORLDQUESTION_QUERY      = opCodes.GAME_MSG_WORLDQUESTION_BEGIN + 11 //查询活动状态

// opCodes.C2G_WUDOU_QUERY_STAGE        = opCodes.GAME_MSG_WUDOU_BEGIN + 1 //查询阶段
// opCodes.G2C_WUDOU_QUERY_STAGE        = opCodes.GAME_MSG_WUDOU_BEGIN + 2 //查询阶段返回
// opCodes.C2G_WUDOU_QUERY_DETAIL       = opCodes.GAME_MSG_WUDOU_BEGIN + 3 //查询详细信息
// opCodes.G2C_WUDOU_QUERY_DETAIL       = opCodes.GAME_MSG_WUDOU_BEGIN + 4 //查询详细信息返回
// opCodes.C2G_WUDOU_APPLY              = opCodes.GAME_MSG_WUDOU_BEGIN + 5 //报名
// opCodes.G2C_WUDOU_APPLY              = opCodes.GAME_MSG_WUDOU_BEGIN + 6 //报名返回
// opCodes.C2G_WUDOU_SET_READY          = opCodes.GAME_MSG_WUDOU_BEGIN + 7 //准备
// opCodes.G2C_WUDOU_SET_READY          = opCodes.GAME_MSG_WUDOU_BEGIN + 8 //准备返回
// opCodes.C2G_WUDOU_QUERY_APPLYLIST    = opCodes.GAME_MSG_WUDOU_BEGIN + 9 //查询报名列表
// opCodes.G2C_WUDOU_QUERY_APPLYLIST    = opCodes.GAME_MSG_WUDOU_BEGIN + 10 //报名列表返回
// opCodes.C2G_WUDOU_GET_PREPARE        = opCodes.GAME_MSG_WUDOU_BEGIN + 11 //准备状态
// opCodes.G2C_WUDOU_GET_PREPARE        = opCodes.GAME_MSG_WUDOU_BEGIN + 12 //准备状态返回
// opCodes.C2G_WUDOU_RANKLIST           = opCodes.GAME_MSG_WUDOU_BEGIN + 13 //排行列表
// opCodes.G2C_WUDOU_RANKLIST           = opCodes.GAME_MSG_WUDOU_BEGIN + 14 //排行列表
// opCodes.C2G_WUDOU_VIEDOLIST          = opCodes.GAME_MSG_WUDOU_BEGIN + 15 //录像列表
// opCodes.G2C_WUDOU_VIEDOLIST          = opCodes.GAME_MSG_WUDOU_BEGIN + 16 //录像列表
// opCodes.C2G_WUDOU_QUERY_PLAYER       = opCodes.GAME_MSG_WUDOU_BEGIN + 17 //查询比赛玩家
// opCodes.G2C_WUDOU_QUERY_PLAYER       = opCodes.GAME_MSG_WUDOU_BEGIN + 18 //查询比赛玩家返回
// opCodes.C2G_WUDOU_BET_PLAYER         = opCodes.GAME_MSG_WUDOU_BEGIN + 19 //押注比赛玩家
// opCodes.G2C_WUDOU_BET_PLAYER         = opCodes.GAME_MSG_WUDOU_BEGIN + 20 //押注比赛玩家返回
// opCodes.G2C_WUDOU_FIGHT_RESULT       = opCodes.GAME_MSG_WUDOU_BEGIN + 21 //轮空晋级，出局，等待下一场
// opCodes.C2G_WUDOU_QUERY_POINT        = opCodes.GAME_MSG_WUDOU_BEGIN + 22 //查询积分
// opCodes.G2C_WUDOU_QUERY_POINT        = opCodes.GAME_MSG_WUDOU_BEGIN + 23 //查询积分返回

// opCodes.C2G_WUDOUTEAM_QUERY_STAGE     = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 1 //查询阶段
// opCodes.G2C_WUDOUTEAM_QUERY_STAGE     = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 2 //查询阶段返回
// opCodes.C2G_WUDOUTEAM_QUERY_DETAIL    = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 3 //查询详细信息
// opCodes.G2C_WUDOUTEAM_QUERY_DETAIL    = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 4 //查询详细信息返回
// opCodes.C2G_WUDOUTEAM_APPLY           = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 5 //报名
// opCodes.G2C_WUDOUTEAM_APPLY           = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 6 //报名返回
// opCodes.C2G_WUDOUTEAM_SET_READY       = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 7 //准备
// opCodes.G2C_WUDOUTEAM_SET_READY       = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 8 //准备返回
// opCodes.C2G_WUDOUTEAM_QUERY_APPLYLIST = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 9 //查询报名列表
// opCodes.G2C_WUDOUTEAM_QUERY_APPLYLIST = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 10 //报名列表返回
// opCodes.C2G_WUDOUTEAM_GET_PREPARE     = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 11 //准备状态
// opCodes.G2C_WUDOUTEAM_GET_PREPARE     = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 12 //准备状态返回
// opCodes.C2G_WUDOUTEAM_RANKLIST        = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 13 //排行列表
// opCodes.G2C_WUDOUTEAM_RANKLIST        = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 14 //排行列表
// opCodes.C2G_WUDOUTEAM_VIEDOLIST       = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 15 //录像列表
// opCodes.G2C_WUDOUTEAM_VIEDOLIST       = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 16 //录像列表
// opCodes.C2G_WUDOUTEAM_QUERY_PLAYER    = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 17 //查询比赛玩家
// opCodes.G2C_WUDOUTEAM_QUERY_PLAYER    = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 18 //查询比赛玩家返回
// opCodes.C2G_WUDOUTEAM_BET_PLAYER      = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 19 //押注比赛玩家
// opCodes.G2C_WUDOUTEAM_BET_PLAYER      = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 20 //押注比赛玩家返回
// opCodes.G2C_WUDOUTEAM_FIGHT_RESULT    = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 21 //轮空晋级，出局，等待下一场
// opCodes.C2G_WUDOUTEAM_QUERY_POINT     = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 22 //查询积分
// opCodes.G2C_WUDOUTEAM_QUERY_POINT     = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 23 //查询积分返回
// opCodes.C2G_WUDOUTEAM_QUERY_HPRP      = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 24 //
// opCodes.G2C_WUDOUTEAM_QUERY_HPRP      = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 25 //
// opCodes.C2G_WUDOUTEAM_START_APPLY     = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 26 //发起报名
// opCodes.G2C_WUDOUTEAM_START_APPLY     = opCodes.GAME_MSG_WUDOUTEAM_BEGIN + 27 //发起报名


// opCodes.C2G_WUDOUSERVER_QUERY_STAGE       = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 1 //查询阶段
// opCodes.G2C_WUDOUSERVER_QUERY_STAGE       = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 2 //查询阶段返回
// opCodes.C2G_WUDOUSERVER_QUERY_DETAIL      = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 3 //查询详细信息
// opCodes.G2C_WUDOUSERVER_QUERY_DETAIL      = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 4 //查询详细信息返回
// opCodes.C2G_WUDOUSERVER_SET_READY         = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 7 //准备
// opCodes.G2C_WUDOUSERVER_SET_READY         = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 8 //准备返回
// opCodes.C2G_WUDOUSERVER_QUERY_APPLYLIST   = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 9 //查询报名列表
// opCodes.G2C_WUDOUSERVER_QUERY_APPLYLIST   = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 10 //报名列表返回
// opCodes.C2G_WUDOUSERVER_GET_PREPARE       = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 11 //准备状态
// opCodes.G2C_WUDOUSERVER_GET_PREPARE       = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 12 //准备状态返回
// opCodes.C2G_WUDOUSERVER_RANKLIST          = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 13 //排行列表
// opCodes.G2C_WUDOUSERVER_RANKLIST          = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 14 //排行列表
// opCodes.C2G_WUDOUSERVER_VIEDOLIST         = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 15 //录像列表
// opCodes.G2C_WUDOUSERVER_VIEDOLIST         = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 16 //录像列表
// opCodes.C2G_WUDOUSERVER_BET_PLAYER        = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 19 //押注比赛玩家
// opCodes.G2C_WUDOUSERVER_BET_PLAYER        = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 20 //押注比赛玩家返回
// opCodes.G2C_WUDOUSERVER_FIGHT_RESULT      = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 21 //轮空晋级，出局，等待下一场
// opCodes.C2G_WUDOUSERVER_QUERY_POINT       = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 22 //查询积分
// opCodes.G2C_WUDOUSERVER_QUERY_POINT       = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 23 //查询积分返回
// opCodes.G2C_WUDOUSERVER_NOT_PLAYER_ACTIVE = opCodes.GAME_MSG_WUDOUSERVER_BEGIN + 24 //非活跃玩家

// //军团副本
// opCodes.C2G_FACTIONMAP_CREATE        = opCodes.GAME_MSG_FACTIONMAP_BEGIN + 1 //开启副本
// opCodes.G2C_FACTIONMAP_CREATE        = opCodes.GAME_MSG_FACTIONMAP_BEGIN + 2 //开启副本返回
// opCodes.C2G_FACTIONMAP_ENTER         = opCodes.GAME_MSG_FACTIONMAP_BEGIN + 3 //进入副本
// opCodes.G2C_FACTIONMAP_ENTER         = opCodes.GAME_MSG_FACTIONMAP_BEGIN + 4 //进入副本返回
// opCodes.C2G_FACTIONMAP_LEAVE         = opCodes.GAME_MSG_FACTIONMAP_BEGIN + 5 //离开副本
// opCodes.G2C_FACTIONMAP_LEAVE         = opCodes.GAME_MSG_FACTIONMAP_BEGIN + 6 //离开副本返回
// opCodes.C2G_FACTIONMAP_FIGHT         = opCodes.GAME_MSG_FACTIONMAP_BEGIN + 7 //开始战斗
// opCodes.C2G_FACTIONMAP_QUERY         = opCodes.GAME_MSG_FACTIONMAP_BEGIN + 8 //查询开启状态
// opCodes.G2C_FACTIONMAP_QUERY         = opCodes.GAME_MSG_FACTIONMAP_BEGIN + 9 //查询开启状态
// opCodes.C2G_FACTIONMAP_REVIVE        = opCodes.GAME_MSG_FACTIONMAP_BEGIN + 10 //快速复活
// opCodes.C2G_FACTIONMAP_RANKDATA      = opCodes.GAME_MSG_FACTIONMAP_BEGIN + 11 //军团副本排行信息
// opCodes.G2C_FACTIONMAP_RANKDATA      = opCodes.GAME_MSG_FACTIONMAP_BEGIN + 12 //军团副本排行信息返回

// //联盟PVE灵阵守卫
// opCodes.C2G_UNIONMTX_CREATE        = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 1 //开启灵阵
// opCodes.G2C_UNIONMTX_CREATE        = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 2 //开启灵阵返回
// opCodes.C2G_UNIONMTX_ENTER         = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 3 //进入阵眼
// opCodes.G2C_UNIONMTX_ENTER         = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 4 //进入阵眼返回
// opCodes.C2G_UNIONMTX_LEAVE         = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 5 //离开阵眼
// opCodes.G2C_UNIONMTX_LEAVE         = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 6 //离开阵眼返回
// opCodes.C2G_UNIONMTX_FIGHT         = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 7 //开始战斗
// opCodes.C2G_UNIONMTX_QUERY         = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 8 //查询灵阵活动开启状态
// opCodes.G2C_UNIONMTX_QUERY         = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 9 //查询灵阵活动开启状态
// opCodes.C2G_UNIONMTX_QUERY_MTX     = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 10 //查询阵眼开启状态
// opCodes.G2C_UNIONMTX_QUERY_MTX     = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 11 //查询阵眼开启状态
// opCodes.C2G_UNIONMTX_QUERY_TCH     = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 12 //查询强化师状态
// opCodes.G2C_UNIONMTX_QUERY_TCH     = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 13 //查询强化师状态
// opCodes.C2G_UNIONMTX_QUERY_BOSS    = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 14 //查询BOSS状态
// opCodes.G2C_UNIONMTX_QUERY_BOSS    = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 15 //查询BOSS状态
// opCodes.C2G_UNIONMTX_RANKDATA      = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 16 //排行信息
// opCodes.G2C_UNIONMTX_RANKDATA      = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 17 //排行信息返回
// opCodes.C2G_UNIONMTX_BOSS_FIGHT    = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 18 //开始打BOSS
// opCodes.C2G_UNIONMTX_TEACHER_FIGHT = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 19 //开始打 强化师
// opCodes.C2G_UNIONMTX_REGISTER      = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 20 //注册通知事件
// opCodes.C2G_UNIONMTX_UNREGISTER    = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 21 //取消通知事件
// opCodes.C2G_UNIONMTX_PROMOTE_MCH   = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 22 //提升福利机器
// opCodes.G2C_UNIONMTX_PROMOTE_MCH   = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 23 //提升福利机器
// opCodes.C2G_UNIONMTX_QUERY_MCH     = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 24 //查询福利机器
// opCodes.G2C_UNIONMTX_QUERY_MCH     = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 25 //查询福利机器
// opCodes.C2G_UNIONMTX_QUERY_SRANK   = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 26 //查询全服联盟排行
// opCodes.G2C_UNIONMTX_QUERY_SRANK   = opCodes.GAME_MSG_UNION_MATRIX_BEGIN + 27 //查询全服联盟排行

//Shop
//opCodes.C2G_MALL_BUY     = opCodes.GAME_MSG_MALL_BEGIN + 1 //购买
//opCodes.G2C_MALL_BUY     = opCodes.GAME_MSG_MALL_BEGIN + 2 //购买
//opCodes.C2G_MALL_SELL    = opCodes.GAME_MSG_MALL_BEGIN + 3 //出售
//opCodes.G2C_MALL_SELL    = opCodes.GAME_MSG_MALL_BEGIN + 4 //出售
//opCodes.C2G_MALL_LIST    = opCodes.GAME_MSG_MALL_BEGIN + 5 //列表
//opCodes.G2C_MALL_LIST    = opCodes.GAME_MSG_MALL_BEGIN + 6 //列表
//opCodes.C2G_MALL_MYLIST  = opCodes.GAME_MSG_MALL_BEGIN + 7 //我的交易
//opCodes.G2C_MALL_MYLIST  = opCodes.GAME_MSG_MALL_BEGIN + 8 //我的交易
//opCodes.C2G_MALL_OFFLIST = opCodes.GAME_MSG_MALL_BEGIN + 9 //撤销
//opCodes.G2C_MALL_OFFLIST = opCodes.GAME_MSG_MALL_BEGIN + 10 //撤销
//opCodes.C2G_MALL_GET     = opCodes.GAME_MSG_MALL_BEGIN + 11 //领取
//opCodes.G2C_MALL_GET     = opCodes.GAME_MSG_MALL_BEGIN + 12 //领取
//opCodes.C2G_MALL_PURSE   = opCodes.GAME_MSG_MALL_BEGIN + 13 //取钱包
//opCodes.G2C_MALL_PURSE   = opCodes.GAME_MSG_MALL_BEGIN + 14 //取钱包

//opCodes.C2G_SHOP_GET_HISTORY       = opCodes.GAME_MSG_SHOP_BEGIN + 1 //购买历史记录
//opCodes.G2C_SHOP_GET_HISTORY       = opCodes.GAME_MSG_SHOP_BEGIN + 2 //购买历史记录
//opCodes.C2G_SHOP_BUY_CURRENCY_MSG  = opCodes.GAME_MSG_SHOP_BEGIN + 3 //获取/更新元宝求购信息
//opCodes.C2G_SHOP_SELL_CURRENCY_MSG = opCodes.GAME_MSG_SHOP_BEGIN + 4 //获取/更新元宝售卖信息
//opCodes.G2C_SHOP_BUY_CURRENCY_MSG  = opCodes.GAME_MSG_SHOP_BEGIN + 5 //元宝求购信息
//opCodes.G2C_SHOP_SELL_CURRENCY_MSG = opCodes.GAME_MSG_SHOP_BEGIN + 6 //元宝售卖信息
//opCodes.C2G_SHOP_BUY_CURRENCY      = opCodes.GAME_MSG_SHOP_BEGIN + 7 //现银购买元宝
//opCodes.C2G_SHOP_SELL_CURRENCY     = opCodes.GAME_MSG_SHOP_BEGIN + 8 //元宝购买现银
//opCodes.C2G_SHOP_MONEY_ORDER       = opCodes.GAME_MSG_SHOP_BEGIN + 9 //寄售现银
//opCodes.C2G_SHOP_CURRENCY_ORDER    = opCodes.GAME_MSG_SHOP_BEGIN + 10//寄售元宝
//opCodes.C2G_SHOP_TRADE_RECORD      = opCodes.GAME_MSG_SHOP_BEGIN + 11//所有记录
//opCodes.G2C_UPDATE_IBSHOP_INFO     = opCodes.GAME_MSG_SHOP_BEGIN + 12 //商城更新单个物品

// opCodes.C2G_EQUIP_IDENTIFY             = opCodes.GAME_MSG_EQUIP_BEGIN + 1 //装备鉴定
// //opCodes.C2G_EQUIP_REPAIR               = opCodes.GAME_MSG_EQUIP_BEGIN + 4 //装备修理
// //opCodes.C2G_EQUIP_RECYCLE              = opCodes.GAME_MSG_EQUIP_BEGIN + 5 //装备回收
// //opCodes.C2G_EQUIP_FUMO                 = opCodes.GAME_MSG_EQUIP_BEGIN + 6 //装备附魔
// opCodes.G2C_EQUIP_IDENTIFY_SUCCESS     = opCodes.GAME_MSG_EQUIP_BEGIN + 7 //鉴定成功
// //opCodes.C2G_EQUIP_REPAIR_QUERY_GOLD    = opCodes.GAME_MSG_EQUIP_BEGIN + 8 //装备修理查询消耗金币
// //opCodes.G2C_EQUIP_REPAIR_QUERY_GOLD    = opCodes.GAME_MSG_EQUIP_BEGIN + 9 //装备修理查询消耗金币
// opCodes.C2G_EQUIP_XI_LIAN              = opCodes.GAME_MSG_EQUIP_BEGIN + 10 //装备洗炼
// opCodes.G2C_EQUIP_XI_LIAN              = opCodes.GAME_MSG_EQUIP_BEGIN + 11 //装备洗炼
// opCodes.C2G_EQUIP_XI_LIAN_CHOOSE       = opCodes.GAME_MSG_EQUIP_BEGIN + 12 //装备洗炼属性结果选择
// opCodes.G2C_EQUIP_XI_LIAN_CHOOSE       = opCodes.GAME_MSG_EQUIP_BEGIN + 13 //装备洗炼属性结果选择
// opCodes.C2G_EQUIP_CAST                 = opCodes.GAME_MSG_EQUIP_BEGIN + 14 //装备重铸
// opCodes.C2G_EQUIP_CAST_CHOOSE          = opCodes.GAME_MSG_EQUIP_BEGIN + 15 //装备重铸选择
// opCodes.C2G_EQUIP_CAST_CANCEL          = opCodes.GAME_MSG_EQUIP_BEGIN + 16 //装备重铸取消
// opCodes.C2G_EQUIP_XI_LIAN_CANCEL       = opCodes.GAME_MSG_EQUIP_BEGIN + 17 //装备洗练取消
// opCodes.G2C_EQUIP_CAST                 = opCodes.GAME_MSG_EQUIP_BEGIN + 18 //装备重铸
// opCodes.G2C_EQUIP_CAST_CHOOSE          = opCodes.GAME_MSG_EQUIP_BEGIN + 19 //装备重铸选择
// opCodes.G2C_EQUIP_CAST_CANCEL          = opCodes.GAME_MSG_EQUIP_BEGIN + 20 //装备重铸取消
// opCodes.G2C_EQUIP_XI_LIAN_CANCEL       = opCodes.GAME_MSG_EQUIP_BEGIN + 21 //装备洗练取消
// opCodes.C2G_EQUIP_ITEM_BASE_ABILITY    = opCodes.GAME_MSG_EQUIP_BEGIN + 22 //使用道具改变装备主属性
// opCodes.C2G_EQUIP_ITEM_LAST_ABILITY    = opCodes.GAME_MSG_EQUIP_BEGIN + 23 //使用道具改变装备附加属性
// opCodes.C2G_EQUIP_ALL_EQUIPS_ON        = opCodes.GAME_MSG_EQUIP_BEGIN + 24 //一键穿装
// opCodes.C2G_EQUIP_ALL_EQUIPS_OFF       = opCodes.GAME_MSG_EQUIP_BEGIN + 25 //一键卸装
// opCodes.C2G_EQUIP_ALL_ENHANCE          = opCodes.GAME_MSG_EQUIP_BEGIN + 26 //一键强化
// opCodes.G2C_EQUIP_ALL_ENHANCE          = opCodes.GAME_MSG_EQUIP_BEGIN + 27 //一键强化
// opCodes.G2C_EQUIP_ADD_STAR             = opCodes.GAME_MSG_EQUIP_BEGIN + 28 //装备加星
// opCodes.C2G_EQUIP_ADD_STAR             = opCodes.GAME_MSG_EQUIP_BEGIN + 29 //装备加星
// opCodes.C2G_EQUIP_SET_STONE            = opCodes.GAME_MSG_EQUIP_BEGIN + 30 //装备镶嵌宝石
// opCodes.G2C_EQUIP_SET_STONE            = opCodes.GAME_MSG_EQUIP_BEGIN + 31 //装备镶嵌宝石
// opCodes.C2G_EQUIP_OFF_STONE            = opCodes.GAME_MSG_EQUIP_BEGIN + 32 //装备卸载宝石
// opCodes.G2C_EQUIP_OFF_STONE            = opCodes.GAME_MSG_EQUIP_BEGIN + 33 //装备卸载宝石
// opCodes.C2G_EQUIP_STONE_COMPOUNDS      = opCodes.GAME_MSG_EQUIP_BEGIN + 34 //宝石合成
// opCodes.G2C_EQUIP_STONE_COMPOUNDS      = opCodes.GAME_MSG_EQUIP_BEGIN + 35 //宝石合成
// opCodes.C2G_EQUIP_OFF_STONE_ALL        = opCodes.GAME_MSG_EQUIP_BEGIN + 36 //装备全部卸载宝石
// opCodes.G2C_EQUIP_OFF_STONE_ALL        = opCodes.GAME_MSG_EQUIP_BEGIN + 37 //装备全部卸载宝石
// opCodes.C2G_EQUIP_STONE_COMPOUNDS_ALL  = opCodes.GAME_MSG_EQUIP_BEGIN + 38 //一键宝石合成
// opCodes.G2C_EQUIP_STONE_COMPOUNDS_ALL  = opCodes.GAME_MSG_EQUIP_BEGIN + 39 //一键宝石合成
// opCodes.C2G_EQUIP_PROMATE              = opCodes.GAME_MSG_EQUIP_BEGIN + 40 //精炼
// opCodes.C2G_EQUIP_PROMATE_CHOOSE       = opCodes.GAME_MSG_EQUIP_BEGIN + 41 //确认精炼
// opCodes.C2G_EQUIP_PROMATE_CANCEL       = opCodes.GAME_MSG_EQUIP_BEGIN + 42 //取消精炼
// opCodes.C2G_EQUIP_ADVANCE              = opCodes.GAME_MSG_EQUIP_BEGIN + 43 //装备晋升
// opCodes.G2C_EQUIP_ADVANCE              = opCodes.GAME_MSG_EQUIP_BEGIN + 44 //装备晋升
// opCodes.G2C_EQUIP_FUSE                 = opCodes.GAME_MSG_EQUIP_BEGIN + 45 //装备融合
// opCodes.C2G_EQUIP_FUSE                 = opCodes.GAME_MSG_EQUIP_BEGIN + 46 //装备融合
// opCodes.C2G_EQUIP_SPECIAL_SKILL_REFINE = opCodes.GAME_MSG_EQUIP_BEGIN + 47 //装备特技重铸
// opCodes.G2C_EQUIP_SPECIAL_SKILL_REFINE = opCodes.GAME_MSG_EQUIP_BEGIN + 48 //装备特技重铸
// opCodes.G2C_EQUIP_SKILL_REFINE_CONFIRM = opCodes.GAME_MSG_EQUIP_BEGIN + 49 //装备特技确认
// opCodes.C2G_EQUIP_SKILL_REFINE_CONFIRM = opCodes.GAME_MSG_EQUIP_BEGIN + 50 //特技重铸确认
// opCodes.C2G_EQUIP_SKILL_REFINE_CANCEL  = opCodes.GAME_MSG_EQUIP_BEGIN + 51 //特技重铸取消
// opCodes.C2G_EQUIP_INHERIT              = opCodes.GAME_MSG_EQUIP_BEGIN + 52 //装备继承
// opCodes.C2G_EQUIP_ALL_CAST             = opCodes.GAME_MSG_EQUIP_BEGIN + 53 //一键装备重塑
// opCodes.G2C_EQUIP_ALL_CAST             = opCodes.GAME_MSG_EQUIP_BEGIN + 54 //一键装备重塑


// 邮件系统
opCodes.G2C_EMAIL_RECV              = opCodes.GAME_MSG_EMAIL_BEGIN + 12 //客户端邮件接收协议
opCodes.C2G_EMAIL_SEND              = opCodes.GAME_MSG_EMAIL_BEGIN + 13 //客户端发送邮件协议
opCodes.G2C_EMAIL_HAVE_EMAIL_UNREAD = opCodes.GAME_MSG_EMAIL_BEGIN + 14	//通知客户端有未读邮件
opCodes.C2G_EMAIL_GET               = opCodes.GAME_MSG_EMAIL_BEGIN + 15 //客户端请求获取邮件
opCodes.C2G_EMAIL_READ              = opCodes.GAME_MSG_EMAIL_BEGIN + 16 //客户端请求阅读邮件
opCodes.G2C_EMAIL_READ              = opCodes.GAME_MSG_EMAIL_BEGIN + 17 //返回请求阅读邮件
opCodes.C2G_EMAIL_GET_ANNEX         = opCodes.GAME_MSG_EMAIL_BEGIN + 18 //客户端请求领取附件
opCodes.C2G_EMAIL_REMOVE            = opCodes.GAME_MSG_EMAIL_BEGIN + 19 //客户端请求删除邮件
opCodes.G2C_EMAIL_REMOVE            = opCodes.GAME_MSG_EMAIL_BEGIN + 20 //客户端请求删除邮件
opCodes.C2G_EMAIL_ALL               = opCodes.GAME_MSG_EMAIL_BEGIN + 21 //一键领取所有邮件

//魔导石
//opCodes.G2C_MAGIC_STONE_FORGE      = opCodes.GAME_MSG_STONE_BEGIN + 1	//魔导石炼金
//opCodes.C2G_MAGIC_STONE_FORGE      = opCodes.GAME_MSG_STONE_BEGIN + 2	//魔导石炼金
//opCodes.C2G_MAGIC_STONE_ENERGY     = opCodes.GAME_MSG_STONE_BEGIN + 3	//查询魔导石能量
//opCodes.G2C_MAGIC_STONE_ENERGY     = opCodes.GAME_MSG_STONE_BEGIN + 4	//发送魔导石能量
//opCodes.G2C_MAGIC_STONE_ACTIVE     = opCodes.GAME_MSG_STONE_BEGIN + 5	//激活魔导石效果
//opCodes.C2G_MAGIC_STONE_ACTIVE     = opCodes.GAME_MSG_STONE_BEGIN + 6	//激活魔导石效果
//opCodes.C2G_MAGIC_STONE_UNACTIVE   = opCodes.GAME_MSG_STONE_BEGIN + 7	//去掉魔导石效果
//opCodes.G2C_MAGIC_STONE_UNACTIVE   = opCodes.GAME_MSG_STONE_BEGIN + 8	//去掉魔导石效果
//opCodes.G2C_MAGIC_STONE_ADD_ENERGY = opCodes.GAME_MSG_STONE_BEGIN + 9	//获取魔导石能量
//opCodes.C2G_MAGIC_STONE_ADD_ENERGY = opCodes.GAME_MSG_STONE_BEGIN + 10	//获取魔导石能量
//opCodes.G2C_MAGIC_STONE_INSTRUCT   = opCodes.GAME_MSG_STONE_BEGIN + 11	//查看魔导仪
//opCodes.C2G_MAGIC_STONE_INSTRUCT   = opCodes.GAME_MSG_STONE_BEGIN + 12	//查看魔导仪
//opCodes.C2G_MAGIC_STONE_LIST       = opCodes.GAME_MSG_STONE_BEGIN + 13	//魔导石列表
//opCodes.G2C_MAGIC_STONE_LIST       = opCodes.GAME_MSG_STONE_BEGIN + 14	//魔导石列表
//opCodes.C2G_MAGIC_STONE_SMELT      = opCodes.GAME_MSG_STONE_BEGIN + 15	//魔导石熔炼
//opCodes.G2C_MAGIC_STONE_SMELT      = opCodes.GAME_MSG_STONE_BEGIN + 16	//魔导石熔炼

//遗迹矿洞
// opCodes.C2G_RELIC_MINE_LOCK           = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 1 //锁定矿洞(准备战斗)
// opCodes.G2C_RELIC_MINE_LOCK           = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 2 //锁定矿洞(准备战斗)
// opCodes.C2G_RELIC_MINE_LIST           = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 3 //矿洞列表
// opCodes.G2C_RELIC_MINE_LIST           = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 4 //矿洞列表
// opCodes.C2G_RELIC_MINE_FIGHT          = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 5 //开始战斗
// opCodes.G2C_RELIC_MINE_MY_MINE        = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 6 //玩家的矿洞列表
// opCodes.C2G_RELIC_MINE_MY_MINE        = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 7 //玩家的矿洞列表
// opCodes.C2G_RELIC_MINE_INFO           = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 8 //单个矿洞信息
// opCodes.G2C_RELIC_MINE_INFO           = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 9 //单个矿洞信息
// opCodes.G2C_RELIC_MINE_DEFENCE        = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 10 //设置防守阵型
// opCodes.C2G_RELIC_MINE_DEFENCE        = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 11 //设置防守阵型
// opCodes.C2G_RELIC_MINE_PRODUCE        = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 12 //设置产出类型
// opCodes.C2G_RELIC_MINE_INVITE         = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 13 //邀请好友
// opCodes.G2C_RELIC_MINE_INVITE         = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 14 //邀请好友
// opCodes.C2G_RELIC_MINE_LEAVE          = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 15 //离开矿洞
// opCodes.C2G_RELIC_MINE_FAILED_RECORD  = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 16 //击败记录
// opCodes.G2C_RELIC_MINE_FAILED_RECORD  = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 17 //击败记录
// opCodes.G2C_RELIC_MINE_REGION_COUNT   = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 18 //大区数量
// opCodes.G2C_RELIC_MINE_PRODUCE_LIST   = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 19 //收入列表
// opCodes.C2G_RELIC_MINE_PRODUCE_LIST   = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 20 //收入列表
// opCodes.G2C_RELIC_MINE_GET_HELP_QUEUE = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 21 //得到帮服我的阵形
// opCodes.C2G_RELIC_MINE_GET_HELP_QUEUE = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 22 //获取帮服我的阵形
// opCodes.C2G_RELIC_MINE_BUY_ROB_COUNT  = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 23 //购买掠夺次数
// opCodes.C2G_RELIC_MINE_ENTER_ACTIVITY = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 24 //进入矿洞活动
// opCodes.C2G_RELIC_MINE_LEAVE_ACTIVITY = opCodes.GAME_MSG_RELIC_MINE_BEGIN + 25 //退出矿洞活动

// opCodes.C2G_ZHENXING_QUERY_INFO       = opCodes.GAME_MSG_ZHENXING_BEGIN + 1 //查询信息
// opCodes.G2C_ZHENXING_QUERY_INFO       = opCodes.GAME_MSG_ZHENXING_BEGIN + 2 //查询信息返回
// opCodes.C2G_ZHENXING_ENTER            = opCodes.GAME_MSG_ZHENXING_BEGIN + 3 //进入
// opCodes.G2C_ZHENXING_ENTER            = opCodes.GAME_MSG_ZHENXING_BEGIN + 4 //进入
// opCodes.C2G_ZHENXING_LEAVE            = opCodes.GAME_MSG_ZHENXING_BEGIN + 5 //离开
// opCodes.G2C_ZHENXING_LEAVE            = opCodes.GAME_MSG_ZHENXING_BEGIN + 6 //离开
// opCodes.C2G_ZHENXING_UPDATE           = opCodes.GAME_MSG_ZHENXING_BEGIN + 7 //更新信息
// opCodes.G2C_ZHENXING_UPDATE           = opCodes.GAME_MSG_ZHENXING_BEGIN + 8 //更新信息
// opCodes.C2G_ZHENXING_READY            = opCodes.GAME_MSG_ZHENXING_BEGIN + 9  //参战
// opCodes.C2G_ZHENXING_INSPIRE          = opCodes.GAME_MSG_ZHENXING_BEGIN + 10 //鼓舞
// opCodes.C2G_ZHENXING_UPDATE_POINT     = opCodes.GAME_MSG_ZHENXING_BEGIN + 11 //阵型积分
// opCodes.G2C_ZHENXING_UPDATE_POINT     = opCodes.GAME_MSG_ZHENXING_BEGIN + 12 //阵型积分
// opCodes.G2C_ZHENXING_BATTLE_RECORD    = opCodes.GAME_MSG_ZHENXING_BEGIN + 13 //对战记录
// opCodes.G2C_ZHENXING_INSPIRE          = opCodes.GAME_MSG_ZHENXING_BEGIN + 14 //鼓舞
// opCodes.C2G_ZHENXING_HISTORY          = opCodes.GAME_MSG_ZHENXING_BEGIN + 15 //历史记录
// opCodes.G2C_ZHENXING_HISTORY          = opCodes.GAME_MSG_ZHENXING_BEGIN + 16 //历史记录
// opCodes.G2C_ZHENXING_QUEUE_HPRP       = opCodes.GAME_MSG_ZHENXING_BEGIN + 17 //hprp记录
// opCodes.G2C_ZHENXING_RANK             = opCodes.GAME_MSG_ZHENXING_BEGIN + 18 //排行榜
// opCodes.C2G_ZHENXING_RANK             = opCodes.GAME_MSG_ZHENXING_BEGIN + 19 //排行榜
// opCodes.G2C_ZHENXING_TARGET_INFO      = opCodes.GAME_MSG_ZHENXING_BEGIN + 20 //对方的信息

// opCodes.C2G_FACTIONWAR_APPLY            = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 1 //报名
// opCodes.G2C_FACTIONWAR_APPLY            = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 2 //报名返回
// opCodes.C2G_FACTIONWAR_QUEUE_APPLY      = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 3 //报名列表
// opCodes.G2C_FACTIONWAR_QUEUE_APPLY      = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 4 //报名列表
// opCodes.C2G_FACTIONWAR_QUEUE_READY      = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 5 //准备界面
// opCodes.G2C_FACTIONWAR_QUEUE_READY      = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 6 //准备界面返回
// opCodes.C2G_FACTIONWAR_ENTER            = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 7 //进入
// opCodes.G2C_FACTIONWAR_ENTER            = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 8 //进入返回
// opCodes.C2G_FACTIONWAR_LEAVE            = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 9 //离开
// opCodes.G2C_FACTIONWAR_LEAVE            = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 10 //离开返回
// opCodes.C2G_FACTIONWAR_QUERY_STAGE      = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 11 //查询状态
// opCodes.G2C_FACTIONWAR_QUERY_STAGE      = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 12 //查询状态返回
// opCodes.C2G_FACTIONWAR_PICK_TICKET      = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 13 //拾取令牌
// opCodes.C2G_FACTIONWAR_OPEN_TICKET      = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 14 //打开令牌获得积分
// opCodes.C2G_FACTIONWAR_QUERY_SCORES     = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 15 //积分列表
// opCodes.G2C_FACTIONWAR_QUERY_SCORES     = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 16 //积分列表
// opCodes.C2G_FACTIONWAR_QUERY_TREE      	= opCodes.GAME_MSG_FACTIONWAR_BEGIN + 17 //对战表
// opCodes.G2C_FACTIONWAR_QUERY_TREE      	= opCodes.GAME_MSG_FACTIONWAR_BEGIN + 18 //对战表
// opCodes.C2G_FACTIONWAR_FIGHT            = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 19 //对战
// opCodes.C2G_FACTIONWAR_CLEAR_WAIT       = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 20 //消除复活时间
// opCodes.C2G_FACTIONWAR_QUERY_ALL_SCORES = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 21 //军团积分
// opCodes.G2C_FACTIONWAR_QUERY_ALL_SCORES = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 22 //军团积分
// opCodes.C2G_FACTIONWAR_FLAG             = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 23 //军团旗帜
// opCodes.G2C_FACTIONWAR_FLAG             = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 24 //军团旗帜
// opCodes.C2G_FACTIONWAR_QUERY_FLAG       = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 25 //军团旗帜
// opCodes.G2C_FACTIONWAR_QUERY_FLAG       = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 26 //军团旗帜
// opCodes.G2C_FACTIONWAR_SENIOR_START     = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 27 //精英赛开始
// opCodes.C2G_FACTIONWAR_QUEUE_SENIOR     = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 28 //设置精英赛参战成员
// opCodes.G2C_FACTIONWAR_QUEUE_SENIOR     = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 29 //设置精英赛参战成员
// opCodes.C2G_FACTIONWAR_QUERY_SENIOR     = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 30 //设置精英赛参战成员
// opCodes.C2G_FACTIONWAR_SENIOR_READY     = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 31 //进入精英赛
// opCodes.G2C_FACTIONWAR_SENIOR_READY     = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 32 //进入精英赛
// opCodes.C2G_FACTIONWAR_QUERY_SEN_RED    = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 33 //查询精英赛
// opCodes.G2C_FACTIONWAR_QUERY_SEN_RED    = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 34 //查询精英赛
// opCodes.C2G_FACTIONWAR_AUTO_APPLY    		= opCodes.GAME_MSG_FACTIONWAR_BEGIN + 35 //公会战自动报名
// opCodes.G2C_FACTIONWAR_AUTO_APPLY    		= opCodes.GAME_MSG_FACTIONWAR_BEGIN + 36 //公会战自动报名
// opCodes.C2G_FACTIONWAR_SENIOR_RESULT  	= opCodes.GAME_MSG_FACTIONWAR_BEGIN + 37 //公会战精英赛结果
// opCodes.G2C_FACTIONWAR_SENIOR_RESULT  	= opCodes.GAME_MSG_FACTIONWAR_BEGIN + 38 //公会战精英赛结果
// opCodes.C2G_FACTIONWAR_FLAG_NUMBER      = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 39 //公会战抢战旗子数量
// opCodes.G2C_FACTIONWAR_FLAG_NUMBER      = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 40 //公会战抢战旗子数量
// opCodes.C2G_FACTIONWAR_SENIOR_CALL      = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 41 //精英赛队友召集
// opCodes.G2C_FACTIONWAR_SENIOR_CALL      = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 42 //精英赛队友召集
// opCodes.G2C_FACTIONWAR_SENIOR_ABORT	    = opCodes.GAME_MSG_FACTIONWAR_BEGIN + 43 //精英赛没有举行



// opCodes.C2G_FACTIONWARSERVER_QUEUE_APPLY      = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 3 //报名列表
// opCodes.G2C_FACTIONWARSERVER_QUEUE_APPLY      = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 4 //报名列表
// opCodes.C2G_FACTIONWARSERVER_QUEUE_READY      = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 5 //准备界面
// opCodes.G2C_FACTIONWARSERVER_QUEUE_READY      = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 6 //准备界面返回
// opCodes.C2G_FACTIONWARSERVER_ENTER            = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 7 //进入
// opCodes.G2C_FACTIONWARSERVER_ENTER            = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 8 //进入返回
// opCodes.C2G_FACTIONWARSERVER_LEAVE            = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 9 //离开
// opCodes.G2C_FACTIONWARSERVER_LEAVE            = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 10 //离开返回
// opCodes.C2G_FACTIONWARSERVER_QUERY_STAGE      = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 11 //查询状态
// opCodes.G2C_FACTIONWARSERVER_QUERY_STAGE      = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 12 //查询状态返回
// opCodes.C2G_FACTIONWARSERVER_PICK_TICKET      = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 13 //拾取令牌
// opCodes.C2G_FACTIONWARSERVER_OPEN_TICKET      = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 14 //打开令牌获得积分
// opCodes.C2G_FACTIONWARSERVER_QUERY_SCORES     = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 15 //积分列表
// opCodes.G2C_FACTIONWARSERVER_QUERY_SCORES     = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 16 //积分列表
// opCodes.C2G_FACTIONWARSERVER_QUERY_FINAL      = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 17 //冠军赛对战表
// opCodes.G2C_FACTIONWARSERVER_QUERY_FINAL      = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 18 //冠军赛对战表
// opCodes.C2G_FACTIONWARSERVER_FIGHT            = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 19 //对战
// opCodes.C2G_FACTIONWARSERVER_CLEAR_WAIT       = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 20 //消除复活时间
// opCodes.C2G_FACTIONWARSERVER_QUERY_ALL_SCORES = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 21 //军团积分
// opCodes.G2C_FACTIONWARSERVER_QUERY_ALL_SCORES = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 22 //军团积分
// opCodes.G2C_FACTIONWARSERVER_SENIOR_START     = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 27 //精英赛开始
// opCodes.C2G_FACTIONWARSERVER_SERVERINFO       = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 28 //跨服信息
// opCodes.G2C_FACTIONWARSERVER_SERVERINFO       = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 29 //跨服信息返回
// opCodes.C2G_FACTIONWARSERVER_MATCHTREE        = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 30 //比赛进程
// opCodes.G2C_FACTIONWARSERVER_MATCHTREE        = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 31 //比赛进程
// opCodes.C2G_FACTIONWARSERVER_QUERY_STAGEEX    = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 32 //跨服信息
// opCodes.G2C_FACTIONWARSERVER_QUERY_STAGEEX    = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 33 //跨服信息返回
// opCodes.G2C_FACTIONWARSERVER_OUT              = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 34 //淘汰
// opCodes.C2G_FACTIONWARSERVER_FLAG             = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 35 //领取冠军服奖励
// opCodes.C2G_FACTIONWARSERVER_QUERY_FLAG       = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 36 //军团旗帜
// opCodes.G2C_FACTIONWARSERVER_QUERY_FLAG       = opCodes.GAME_MSG_FACTIONWARSERVER_BEGIN + 37 //军团旗帜

// opCodes.G2C_FAIRY_UPDATE_FIELD           = opCodes.GAME_MSG_FAIRY_BEGIN + 1   //精灵更新
// opCodes.C2G_FAITY_LIST_INFO              = opCodes.GAME_MSG_FAIRY_BEGIN + 2   //精灵列表
// opCodes.G2C_FAIRY_LIST_INFO              = opCodes.GAME_MSG_FAIRY_BEGIN + 3   //精灵列表
// opCodes.C2G_FAIRY_SET_STATE              = opCodes.GAME_MSG_FAIRY_BEGIN + 4   //精灵状态
// opCodes.G2C_FAIRY_SET_STATE              = opCodes.GAME_MSG_FAIRY_BEGIN + 5   //精灵状态
// opCodes.G2C_FAIRY_ADD                    = opCodes.GAME_MSG_FAIRY_BEGIN + 6   //增加
// opCodes.G2C_FAIRY_SET_SKILL              = opCodes.GAME_MSG_FAIRY_BEGIN + 7   //设置技能
// opCodes.C2G_FAIRY_SET_SKILL              = opCodes.GAME_MSG_FAIRY_BEGIN + 8   //设置技能
// opCodes.C2G_FAIRY_DEVELOP                = opCodes.GAME_MSG_FAIRY_BEGIN + 9   //培养
// opCodes.G2C_FAIRY_REFORM                 = opCodes.GAME_MSG_FAIRY_BEGIN + 10  //改造
// opCodes.C2G_FAIRY_REFORM                 = opCodes.GAME_MSG_FAIRY_BEGIN + 11  //改造
// opCodes.C2G_FAIRY_REFORM_SURE            = opCodes.GAME_MSG_FAIRY_BEGIN + 12  //确定改造
// opCodes.C2G_FAIRY_REFORM_CANCEL          = opCodes.GAME_MSG_FAIRY_BEGIN + 13  //取消改造
// opCodes.C2G_FAIRY_ON_EQUIP               = opCodes.GAME_MSG_FAIRY_BEGIN + 14  //穿装备
// opCodes.C2G_FAIRY_OFF_EQUIP              = opCodes.GAME_MSG_FAIRY_BEGIN + 15  //脱装备
// opCodes.G2C_FAIRY_UPDATE                 = opCodes.GAME_MSG_FAIRY_BEGIN + 16  //精灵更新全部属性
// opCodes.C2G_FAIRY_EQUIP_EXCHANGE         = opCodes.GAME_MSG_FAIRY_BEGIN + 17  //精灵裝備兌換
// opCodes.C2G_FAIRY_PEARL_LEVEL            = opCodes.GAME_MSG_FAIRY_BEGIN + 18  //精灵灵珠升级
// opCodes.C2G_FAIRY_PEARL_RECAST           = opCodes.GAME_MSG_FAIRY_BEGIN + 19  //精灵灵珠重塑申请
// opCodes.G2C_FAIRY_PEARL_RECAST           = opCodes.GAME_MSG_FAIRY_BEGIN + 20  //精灵灵珠重塑返回
// opCodes.C2G_FAIRY_PEARL_RECAST_CONFIRM   = opCodes.GAME_MSG_FAIRY_BEGIN + 21  //精灵灵珠重塑确认
// //神兵
// opCodes.C2G_IMMORTALS_INFO               = opCodes.GAME_MSG_FAIRY_BEGIN + 22  //神兵信息
// opCodes.G2C_IMMORTALS_INFO               = opCodes.GAME_MSG_FAIRY_BEGIN + 23  //神兵信息
// opCodes.G2C_IMMORTALS_UPDATE             = opCodes.GAME_MSG_FAIRY_BEGIN + 24  //神兵全部更新
// opCodes.G2C_IMMORTALS_UPDATE_FIELD       = opCodes.GAME_MSG_FAIRY_BEGIN + 25  //神兵部分更新
// opCodes.C2G_IMMORTALS_SET_STATE          = opCodes.GAME_MSG_FAIRY_BEGIN + 26  //神兵信息
// opCodes.G2C_IMMORTALS_EXP_START          = opCodes.GAME_MSG_FAIRY_BEGIN + 27  //神兵体验
// opCodes.C2G_IMMORTALS_LEVEL_UP           = opCodes.GAME_MSG_FAIRY_BEGIN + 28  //神兵升级
// opCodes.G2C_IMMORTALS_PREVIEW_FORCE      = opCodes.GAME_MSG_FAIRY_BEGIN + 29  //神兵战力预览


// opCodes.C2G_MONSTER_SIEGE_ENTER              = opCodes.GAME_MSG_SIEGE_BEGIN + 1  //进入活动
// opCodes.G2C_MONSTER_SIEGE_ENTER              = opCodes.GAME_MSG_SIEGE_BEGIN + 2  //进入活动
// opCodes.C2G_MONSTER_SIEGE_LEAVE              = opCodes.GAME_MSG_SIEGE_BEGIN + 3  //离开活动
// opCodes.G2C_MONSTER_SIEGE_LEAVE              = opCodes.GAME_MSG_SIEGE_BEGIN + 4  //离开活动
// opCodes.C2G_MONSTER_SIEGE_FIGHT              = opCodes.GAME_MSG_SIEGE_BEGIN + 5  //战斗
// opCodes.C2G_MONSTER_SIEGE_REVIVE             = opCodes.GAME_MSG_SIEGE_BEGIN + 6  //复活
// opCodes.G2C_MONSTER_SIEGE_REVIVE             = opCodes.GAME_MSG_SIEGE_BEGIN + 7  //复活
// opCodes.C2G_MONSTER_SIEGE_INSPIRE            = opCodes.GAME_MSG_SIEGE_BEGIN + 8  //鼓舞
// opCodes.G2C_MONSTER_SIEGE_INSPIRE            = opCodes.GAME_MSG_SIEGE_BEGIN + 9  //鼓舞
// opCodes.C2G_MONSTER_SIEGE_DAMAGE_RANK        = opCodes.GAME_MSG_SIEGE_BEGIN + 10 //伤害排名
// opCodes.G2C_MONSTER_SIEGE_DAMAGE_RANK        = opCodes.GAME_MSG_SIEGE_BEGIN + 11 //伤害排名
// opCodes.C2G_MONSTER_SIEGE_PICK_BOX           = opCodes.GAME_MSG_SIEGE_BEGIN + 12 //捡Buff
// opCodes.G2C_MONSTER_SIEGE_BOSS_HP            = opCodes.GAME_MSG_SIEGE_BEGIN + 13 //boss血量
// opCodes.G2C_MONSTER_SIEGE_SUM_DAMAGE         = opCodes.GAME_MSG_SIEGE_BEGIN + 14 //个人伤害
// opCodes.C2G_MONSTER_SIEGE_INFO               = opCodes.GAME_MSG_SIEGE_BEGIN + 15 //活动信息
// opCodes.G2C_MONSTER_SIEGE_INFO               = opCodes.GAME_MSG_SIEGE_BEGIN + 16 //活动信息
// opCodes.G2C_MONSTER_SIEGE_NEXT_ROUND         = opCodes.GAME_MSG_SIEGE_BEGIN + 17 //下波怪物来临时间
// opCodes.G2C_MONSTER_SIEGE_DAMAGE_RANK2       = opCodes.GAME_MSG_SIEGE_BEGIN + 18 //及时排名
// opCodes.G2C_MONSTER_SIEGE_BOSS_POS           = opCodes.GAME_MSG_SIEGE_BEGIN + 19 //boss坐标位置
// opCodes.G2C_MONSTER_SIEGE_BOSS_ID            = opCodes.GAME_MSG_SIEGE_BEGIN + 20 //bossId

// opCodes.G2C_APPLY_ADD_UNION                  = opCodes.GAME_MSG_UNION_BEGIN + 1  //申请加入联盟
// opCodes.C2G_APPLY_ADD_UNION                  = opCodes.GAME_MSG_UNION_BEGIN + 2  //申请加入联盟
// opCodes.C2G_AGREEN_ADD_UNION                 = opCodes.GAME_MSG_UNION_BEGIN + 3  //同意加入联盟
// opCodes.G2C_AGREEN_ADD_UNION                 = opCodes.GAME_MSG_UNION_BEGIN + 4  //同意加入联盟
// opCodes.G2C_REFUSE_ADD_UNION                 = opCodes.GAME_MSG_UNION_BEGIN + 5  //拒绝加入联盟
// opCodes.C2G_REFUSE_ADD_UNION                 = opCodes.GAME_MSG_UNION_BEGIN + 6  //拒绝加入联盟
// opCodes.C2G_LEAVE_UNION                      = opCodes.GAME_MSG_UNION_BEGIN + 7  //离开联盟
// opCodes.G2C_LEAVE_UNION                      = opCodes.GAME_MSG_UNION_BEGIN + 8  //离开联盟
// opCodes.C2G_UNION_INFO                       = opCodes.GAME_MSG_UNION_BEGIN + 9  //联盟信息
// opCodes.G2C_UNION_INFO                       = opCodes.GAME_MSG_UNION_BEGIN + 10 //联盟信息
// opCodes.G2C_UNION_TIPS                       = opCodes.GAME_MSG_UNION_BEGIN + 11 //联盟系统消息
// //联盟pvp
// opCodes.G2C_UNIONPVP_GROUP_INFO              = opCodes.GAME_MSG_UNION_BEGIN + 12 //联盟PVP信息
// opCodes.C2G_UNIONPVP_GROUP_INFO              = opCodes.GAME_MSG_UNION_BEGIN + 13 //联盟PVP信息
// opCodes.C2G_UNIONPVP_MY_NODE_SCORE_LIST      = opCodes.GAME_MSG_UNION_BEGIN + 14 //我方成员积分列表
// opCodes.G2C_UNIONPVP_MY_NODE_SCORE_LIST      = opCodes.GAME_MSG_UNION_BEGIN + 15 //我方成员积分列表
// opCodes.C2G_UNIONPVP_BOTH_NODE_SCORE_LIST    = opCodes.GAME_MSG_UNION_BEGIN + 16 //双方成员积分列表
// opCodes.G2C_UNIONPVP_BOTH_NODE_SCORE_LIST    = opCodes.GAME_MSG_UNION_BEGIN + 17 //双方成员积分列表
// opCodes.G2C_UNIONPVP_SCORE                   = opCodes.GAME_MSG_UNION_BEGIN + 18 //双方积分情况
// opCodes.G2C_UNIONPVP_ENTER                   = opCodes.GAME_MSG_UNION_BEGIN + 19 //进入活动地图
// opCodes.C2G_UNIONPVP_ENTER                   = opCodes.GAME_MSG_UNION_BEGIN + 20 //进入活动地图
// opCodes.C2G_UNIONPVP_PICK_FLAG               = opCodes.GAME_MSG_UNION_BEGIN + 21 //拾取旗帜
// opCodes.C2G_UNIONPVP_OPEN_FLAG               = opCodes.GAME_MSG_UNION_BEGIN + 22 //打开旗帜
// opCodes.C2G_UNIONPVP_CREATE_FIGHT            = opCodes.GAME_MSG_UNION_BEGIN + 23 //创建战斗
// opCodes.C2G_UNIONPVP_GAME_STAGE              = opCodes.GAME_MSG_UNION_BEGIN + 24 //比赛阶段
// opCodes.G2C_UNIONPVP_GAME_STAGE              = opCodes.GAME_MSG_UNION_BEGIN + 25 //比赛阶段
// opCodes.C2G_UNIONPVP_LEAVE                   = opCodes.GAME_MSG_UNION_BEGIN + 26 //离开
// opCodes.G2C_UNIONPVP_LEAVE                   = opCodes.GAME_MSG_UNION_BEGIN + 27 //离开
// opCodes.C2G_UNIONPVP_CHANGE_MAP              = opCodes.GAME_MSG_UNION_BEGIN + 28 //跳转地图
// opCodes.C2G_UNIONPVP_FLAG_INFO               = opCodes.GAME_MSG_UNION_BEGIN + 29 //查看旗帜分布
// opCodes.G2C_UNIONPVP_FLAG_INFO               = opCodes.GAME_MSG_UNION_BEGIN + 30 //查看旗帜分布
// opCodes.C2G_UNIONPVP_SECOND_FIGHT_INFO       = opCodes.GAME_MSG_UNION_BEGIN + 31 //决赛布阵信息
// opCodes.G2C_UNIONPVP_SECOND_FIGHT_INFO       = opCodes.GAME_MSG_UNION_BEGIN + 32 //决赛布阵信息
// opCodes.C2G_UNIONPVP_SET_MEMBER              = opCodes.GAME_MSG_UNION_BEGIN + 33 //设置成员
// opCodes.C2G_UNIONPVP_SET_STATUS              = opCodes.GAME_MSG_UNION_BEGIN + 34 //设置比赛状态(准备/取消)
// opCodes.C2G_UNIONPVP_LEAVE_SECOND_FIGHT      = opCodes.GAME_MSG_UNION_BEGIN + 35 //离开比赛
// opCodes.G2C_UNIONPVP_FAIRY_GUARD_LIST        = opCodes.GAME_MSG_UNION_BEGIN + 36 //精灵守卫列表
// opCodes.G2C_UNIONPVP_ROOM_INDEX              = opCodes.GAME_MSG_UNION_BEGIN + 37 //当前层
// opCodes.C2G_UNIONPVP_CANCEL_SET_MEMBER       = opCodes.GAME_MSG_UNION_BEGIN + 38 //取消设置成员
// opCodes.C2G_UNIONPVP_SECOND_ALL_INFO         = opCodes.GAME_MSG_UNION_BEGIN + 39 //查看决赛所有信息
// opCodes.G2C_UNIONPVP_SECOND_ALL_INFO         = opCodes.GAME_MSG_UNION_BEGIN + 40 //查看决赛所有信息
// opCodes.C2G_UNIONPVP_APPLY_LIST_INFO         = opCodes.GAME_MSG_UNION_BEGIN + 41 //查看报名信息
// opCodes.G2C_UNIONPVP_APPLY_LIST_INFO         = opCodes.GAME_MSG_UNION_BEGIN + 42 //查看报名信息
// opCodes.G2C_UNIONPVP_BUFF_LIST               = opCodes.GAME_MSG_UNION_BEGIN + 43 //buff列表
// opCodes.C2G_UNIONPVP_USE_ITEM                = opCodes.GAME_MSG_UNION_BEGIN + 44 //使用道具
// opCodes.C2G_UNIONPVP_APPLY                   = opCodes.GAME_MSG_UNION_BEGIN + 45 //报名

// //跨服联盟战
// opCodes.C2G_UNIONSERVER_MATCHTREE            = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 1 //跨服联盟战对战列表
// opCodes.G2C_UNIONSERVER_MATCHTREE            = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 2 //跨服联盟战对战列表
// opCodes.C2G_UNIONSERVER_SERVERINFO           = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 3 //跨服服务器信息
// opCodes.G2C_UNIONSERVER_SERVERINFO           = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 4 //跨服服务器信息
// opCodes.C2G_UNIONSERVER_GAME_INFO            = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 5 //普通服显示比赛信息
// opCodes.G2C_UNIONSERVER_GAME_INFO            = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 6 //普通服显示比赛信息
// opCodes.C2G_UNIONSERVER_GROUP_INFO           = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 7 //跨服服务器比赛信息
// opCodes.G2C_UNIONSERVER_FIRST_GAME_INFO      = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 8 //混战比赛信息
// opCodes.G2C_UNIONSERVER_SECOND_GAME_INFO     = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 9 //单打比赛信息
// opCodes.C2G_UNIONSERVER_ENTER                = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 10 //进入地图
// opCodes.G2C_UNIONSERVER_ENTER                = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 11 //进入地图
// opCodes.C2G_UNIONSERVER_GAME_STAGE           = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 12 //比赛阶段
// opCodes.G2C_UNIONSERVER_GAME_STAGE           = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 13 //比赛阶段
// opCodes.G2C_UNIONSERVER_SCORE                = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 14 //双方积分情况
// opCodes.C2G_UNIONSERVER_LEAVE                = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 15 //离开混战地图
// opCodes.G2C_UNIONSERVER_LEAVE                = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 16 //离开混战地图
// opCodes.G2C_UNIONSERVER_LEAVE                = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 17 //当前房间编号
// opCodes.G2C_UNIONSERVER_FAIRY_GUARD_LIST     = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 18 //精灵守卫列表
// opCodes.G2C_UNIONSERVER_ROOM_INDEX           = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 19 //当前层
// opCodes.C2G_UNIONSERVER_CHANGE_MAP           = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 20 //跳转地图
// opCodes.C2G_UNIONSERVER_SET_MEMBER           = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 21 //设置成员
// opCodes.C2G_UNIONSERVER_SET_STATUS           = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 22 //设置比赛状态(准备/取消)
// opCodes.C2G_UNIONSERVER_LEAVE_SECOND_FIGHT   = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 23 //离开比赛
// opCodes.C2G_UNIONSERVER_PICK_FLAG            = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 24 //拾取旗帜
// opCodes.C2G_UNIONSERVER_OPEN_FLAG            = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 25 //打开旗帜
// opCodes.C2G_UNIONSERVER_CREATE_FIGHT         = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 26 //创建战斗
// opCodes.C2G_UNIONSERVER_FLAG_INFO            = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 27 //查看旗帜分布
// opCodes.G2C_UNIONSERVER_FLAG_INFO            = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 28 //查看旗帜分布
// opCodes.G2C_UNIONSERVER_BUFF_LIST            = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 29 //buff列表
// opCodes.C2G_UNIONSERVER_USE_ITEM             = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 30 //使用道具
// opCodes.C2G_UNIONSERVER_MY_NODE_SCORE_LIST   = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 31 //我方成员积分列表
// opCodes.G2C_UNIONSERVER_MY_NODE_SCORE_LIST   = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 32 //我方成员积分列表
// opCodes.C2G_UNIONSERVER_BOTH_NODE_SCORE_LIST = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 33 //双方成员积分列表
// opCodes.G2C_UNIONSERVER_BOTH_NODE_SCORE_LIST = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 34 //双方成员积分列表
// opCodes.C2G_UNIONSERVER_SECOND_ALL_INFO      = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 35 //查看决赛所有信息
// opCodes.G2C_UNIONSERVER_SECOND_ALL_INFO      = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 36 //查看决赛所有信息
// opCodes.C2G_UNIONSERVER_ITEMUSE_INFO         = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 37 //道具使用情况
// opCodes.G2C_UNIONSERVER_ITEMUSE_INFO         = opCodes.GAME_MSG_UNIONSERVER_BEGIN + 38 //道具使用情况

// //国战争霸赛
// opCodes.C2G_GUOZHANCST_ENTER_MSG         = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 1 //准备界面
// opCodes.G2C_GUOZHANCST_ENTER_MSG         = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 2 //准备界面
// opCodes.C2G_GUOZHANCST_WALL_INFO         = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 3 //城墙情况
// opCodes.G2C_GUOZHANCST_WALL_INFO         = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 4 //城墙情况
// opCodes.G2C_GUOZHANCST_SINGLE_WALL_INFO  = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 5 //单个城墙情况
// opCodes.C2G_GUOZHANCST_SINGLE_SCORE      = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 6 //本服积分
// opCodes.G2C_GUOZHANCST_SINGLE_SCORE      = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 7 //本服积分
// opCodes.C2G_GUOZHANCST_ALL_SCORE         = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 8 //全服积分
// opCodes.G2C_GUOZHANCST_ALL_SCORE         = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 9 //全服积分
// opCodes.C2G_GUOZHANCST_WALL_DETAIL       = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 10 //城墙信息
// opCodes.G2C_GUOZHANCST_WALL_DETAIL       = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 11 //城墙信息
// opCodes.C2G_GUOZHANCST_PLAYER_ARMY       = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 12 //玩家的部队
// opCodes.G2C_GUOZHANCST_PLAYER_ARMY       = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 13 //玩家的部队
// opCodes.C2G_GUOZHANCST_PLAYER_RECORD     = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 14 //玩家记录
// opCodes.G2C_GUOZHANCST_PLAYER_RECORD     = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 15 //玩家记录
// opCodes.C2G_GUOZHANCST_SET_DEFENCE       = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 16 //设置防守
// opCodes.C2G_GUOZHANCST_SET_ATTACK        = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 17 //设置进攻
// opCodes.C2G_GUOZHANCST_ATTACK_WALL       = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 18 //攻击城墙
// opCodes.G2C_GUOZHANCST_CLOSE             = opCodes.GAME_MSG_GUOZHANCST_BEGIN + 19 //活动结束

// //跨服
// opCodes.C2G_BATTLEFEILD_INFO   = opCodes.GAME_MSG_BATTLEFEILD_BEGIN + 1 //查跨服竞技信息
// opCodes.G2C_BATTLEFEILD_INFO   = opCodes.GAME_MSG_BATTLEFEILD_BEGIN + 2 //
// opCodes.C2G_CENTERSERVER_WUDOU = opCodes.GAME_MSG_BATTLEFEILD_BEGIN + 3 //跨服斗技
// opCodes.G2C_CENTERSERVER_WUDOU = opCodes.GAME_MSG_BATTLEFEILD_BEGIN + 4 //跨服斗技

// //迷雾森林
// opCodes.C2G_FOG_FOREST_ENTER          = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 1  //进入迷雾森林
// opCodes.G2C_FOG_FOREST_ENTER          = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 2  //进入迷雾森林
// opCodes.C2G_FOG_FOREST_LEAVE          = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 3  //离开迷雾森林
// opCodes.G2C_FOG_FOREST_LEAVE          = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 4  //离开迷雾森林
// opCodes.C2G_FOG_FOREST_FIGHT          = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 5  //开始战斗
// opCodes.C2G_FOG_FOREST_USE_SKILL      = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 6  //使用技能
// opCodes.G2C_FOG_FOREST_DATA           = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 7  //个人数据
// opCodes.G2C_FOG_FOREST_FIGHT_DATE     = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 8  //部下气血信息
// opCodes.C2G_FOG_FOREST_OPEN_TRANSFER  = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 9  //点击传送门
// opCodes.G2C_FOG_FOREST_OPEN_TRANSFER  = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 10 //点击传送门
// opCodes.G2C_FOG_FOREST_QUESTION       = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 11 //题目
// opCodes.C2G_FOG_FOREST_QUESTION       = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 12 //题目
// opCodes.G2C_FOG_FOREST_NEXT_LAYER     = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 13 //进入下一层
// opCodes.C2G_FOG_FOREST_POINT          = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 15 //积分
// opCodes.G2C_FOG_FOREST_POINT          = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 16 //积分
// opCodes.G2C_FOG_FOREST_ADD_TASK       = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 17 //特殊任务
// opCodes.G2C_FOG_FOREST_REMOVE_TASK    = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 18 //特殊任务
// opCodes.C2G_FOG_FOREST_REMOVE_TASK    = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 19 //特殊任务
// opCodes.G2C_FOG_FOREST_FINISH_TASK    = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 20 //特殊任务
// opCodes.C2G_FOG_FOREST_GET_PRIZE      = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 21 //领取奖励
// opCodes.G2C_FOG_FOREST_GET_PRIZE      = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 22 //领取奖励
// opCodes.G2C_FOG_FOREST_PRIZE_INFO     = opCodes.GAME_MSG_FOG_FOREST_BEGIN + 23 //领取奖励信息


// //combatTeam 战队相关
// opCodes.G2C_COMBATTEAM_QUERY_ALL        = opCodes.GAME_MSG_COMBATTEAM + 1 //获取所有战队
// opCodes.G2C_COMBATTEAM_QUERY_MEMBERS    = opCodes.GAME_MSG_COMBATTEAM + 2 //获取某个战队所有成员
// opCodes.G2C_COMBATTEAM_UPDATE_INFO      = opCodes.GAME_MSG_COMBATTEAM + 3	//更新战队信息
// opCodes.C2G_COMBATTEAM_CREATE           = opCodes.GAME_MSG_COMBATTEAM + 4 //创建战队
// opCodes.C2G_COMBATTEAM_JOIN             = opCodes.GAME_MSG_COMBATTEAM + 5 //申请加入战队
// opCodes.C2G_COMBATTEAM_DEAL             = opCodes.GAME_MSG_COMBATTEAM + 6 //申请处理
// opCodes.C2G_COMBATTEAM_INVITE           = opCodes.GAME_MSG_COMBATTEAM + 7 //邀请入队
// opCodes.C2G_COMBATTEAM_DEAL_INVITE      = opCodes.GAME_MSG_COMBATTEAM + 8 //处理邀请
// opCodes.C2G_COMBATTEAM_QUIT             = opCodes.GAME_MSG_COMBATTEAM + 9 //退出
// opCodes.C2G_COMBATTEAM_ABDICATE         = opCodes.GAME_MSG_COMBATTEAM + 10 //转让职位（队长）
// //opCodes.C2G_COMBATTEAM_RECEIVER         = opCodes.GAME_MSG_COMBATTEAM + 11 //被转让者接收消息
// opCodes.C2G_COMBATTEAM_EXPEL            = opCodes.GAME_MSG_COMBATTEAM + 12 //开除
// //opCodes.C2G_COMBATTEAM_EXPELEE          = opCodes.GAME_MSG_COMBATTEAM + 13 //被开除接受消息
// opCodes.G2C_COMBATTEAM_NOVITE           = opCodes.GAME_MSG_COMBATTEAM + 14 //通知队长申请者消息
// opCodes.C2G_COMBATTEAM_APPLY_LIST       = opCodes.GAME_MSG_COMBATTEAM + 15 //更新申请者列表
// opCodes.G2C_COMBATTEAM_DEAL_INVITE      = opCodes.GAME_MSG_COMBATTEAM + 16 //接受邀请消息
// opCodes.C2G_COMBATTEAM_QUERY_ALL        = opCodes.GAME_MSG_COMBATTEAM + 17 //获取所有战队(客户端请求)
// opCodes.C2G_COMBATTEAM_QUERY_MEMBERS    = opCodes.GAME_MSG_COMBATTEAM + 18 //获取战队成员（客户端请求）
// opCodes.G2C_COMBATTEAM_APPLY_LIST       = opCodes.GAME_MSG_COMBATTEAM + 19 //获取战队申请者列表
// opCodes.C2G_COMBATTEAM_HELP_QUEUE       = opCodes.GAME_MSG_COMBATTEAM + 20 //获取战队帮助阵形
// opCodes.G2C_COMBATTEAM_HELP_QUEUE       = opCodes.GAME_MSG_COMBATTEAM + 21 //获取战队帮助阵形
// opCodes.G2C_COMBATTEAM_EXPELEE          = opCodes.GAME_MSG_COMBATTEAM + 22 //被开除
// opCodes.C2G_COMBATTEAM_FETTERPRIZE		  = opCodes.GAME_MSG_COMBATTEAM + 23	//血盟奖励
// opCodes.G2C_COMBATTEAM_FETTERPRIZE_QUERY = opCodes.GAME_MSG_COMBATTEAM + 24	//血盟奖励列表
// opCodes.C2G_COMBATTEAM_FETTERPRIZE_QUERY = opCodes.GAME_MSG_COMBATTEAM + 25 //血盟奖励列表
// opCodes.C2G_ENTER_COMBATTEAM_PVE        = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 30 //进入活动
// opCodes.G2C_ENTER_COMBATTEAM_PVE        = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 31 //进入活动
// opCodes.C2G_EXIT_COMBATTEAM_PVE         = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 32 //退出活动
// opCodes.G2C_EXIT_COMBATTEAM_PVE         = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 33 //退出活动
// opCodes.C2G_USE_SKILL_COMBATTEAM_PVE    = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 34 //使用技能
// opCodes.G2C_USE_SKILL_COMBATTEAM_PVE    = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 35 //使用技能
// opCodes.C2G_CREATE_FIGHT_COMBATTEAM_PVE = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 36 //创建战斗
// opCodes.G2C_COMBATTEAM_PVE_INFO         = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 37 //血盟pve信息
// opCodes.C2G_COMBATTEAM_PVE_INFO         = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 38 //血盟pve信息
// opCodes.C2G_COMBATTEAM_PVE_LAYER        = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 39 //血盟pve信息(进入前)
// opCodes.G2C_COMBATTEAM_PVE_LAYER        = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 40 //血盟pve信息(进入前)
// opCodes.C2G_COMBATTEAM_PVE_INVITE_LIST  = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 41 //血盟pve邀请列表
// opCodes.G2C_COMBATTEAM_PVE_INVITE_LIST  = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 42 //血盟pve邀请列表


// //结婚
// opCodes.C2G_MARRY_REQUEST_NORMAL_WEDDING = opCodes.GAME_MSG_MARRY_BEGIN + 1 //申请结婚
// opCodes.G2C_MARRY_REQUEST_NORMAL_WEDDING = opCodes.GAME_MSG_MARRY_BEGIN + 2 //申请结婚返回
// opCodes.C2G_MARRY_RETURN_COUPLE_INFO     = opCodes.GAME_MSG_MARRY_BEGIN + 3 //结婚信息申请
// opCodes.G2C_MARRY_RETURN_COUPLE_INFO     = opCodes.GAME_MSG_MARRY_BEGIN + 4 //结婚信息返回
// opCodes.C2G_MARRY_WEDDING_IS_OVER        = opCodes.GAME_MSG_MARRY_BEGIN + 5 //婚礼结束
// opCodes.C2G_UNCONTESTED_DIVORCE          = opCodes.GAME_MSG_MARRY_BEGIN + 6 //自愿离婚
// opCodes.G2C_UNCONTESTED_DIVORCE          = opCodes.GAME_MSG_MARRY_BEGIN + 7 //自愿离婚
// opCodes.C2G_UNCONTESTED_DIVORCE_REPLY    = opCodes.GAME_MSG_MARRY_BEGIN + 8 //自愿离婚回复
// opCodes.C2G_FORCE_DIVORCE                = opCodes.GAME_MSG_MARRY_BEGIN + 9 //强制离婚
// opCodes.C2G_GET_TEAM_SEX                 = opCodes.GAME_MSG_MARRY_BEGIN + 10 //申请队伍中玩家的性别
// opCodes.G2C_GET_TEAM_SEX                 = opCodes.GAME_MSG_MARRY_BEGIN + 11 //返回队伍中玩家的性别
// opCodes.C2G_MARRY_GET_TEAM_REL           = opCodes.GAME_MSG_MARRY_BEGIN + 12 //申请是否同步界面
// opCodes.G2C_MARRY_GET_TEAM_REL           = opCodes.GAME_MSG_MARRY_BEGIN + 13 //返回是否同步界面
// opCodes.C2G_LONELY_DIVORCE               = opCodes.GAME_MSG_MARRY_BEGIN + 14 //失踪离婚
// opCodes.G2C_MARRY_WEDDING_START          = opCodes.GAME_MSG_MARRY_BEGIN + 15 //婚礼开始
// opCodes.G2C_MARRY_CONFIRM_MSG            = opCodes.GAME_MSG_MARRY_BEGIN + 16 //确认结婚提示框
// opCodes.C2G_MARRY_CONFIRM_MSG            = opCodes.GAME_MSG_MARRY_BEGIN + 17 //提示框选择结果
// opCodes.C2G_MARRY_WEDDING_PAUSE          = opCodes.GAME_MSG_MARRY_BEGIN + 18 //马车停顿的处理
// opCodes.C2G_MARRY_WEDDING_PICK_CANDY     = opCodes.GAME_MSG_MARRY_BEGIN + 19 //捡糖果

// opCodes.C2G_RUNMAN_ENTER              = opCodes.GAME_MSG_RUNMAN_BEGIN + 1 //进入
// opCodes.C2G_RUNMAN_LEAVE              = opCodes.GAME_MSG_RUNMAN_BEGIN + 2 //离开
// opCodes.C2G_RUNMAN_SELECT             = opCodes.GAME_MSG_RUNMAN_BEGIN + 3 //选择
// opCodes.C2G_RUNMAN_FIGHT_BOSS         = opCodes.GAME_MSG_RUNMAN_BEGIN + 4 //挑战boss
// opCodes.C2G_RUNMAN_FIGHT_PLAYER       = opCodes.GAME_MSG_RUNMAN_BEGIN + 5 //挑战玩家
// opCodes.C2G_RUNMAN_PICK_BOX           = opCodes.GAME_MSG_RUNMAN_BEGIN + 6 //拾取宝箱
// opCodes.C2G_RUNMAN_USE_TICKET         = opCodes.GAME_MSG_RUNMAN_BEGIN + 8 //使用道具
// opCodes.G2C_RUNMAN_ROOM_MSG           = opCodes.GAME_MSG_RUNMAN_BEGIN + 9 //活动信息
// opCodes.C2G_RUNMAN_BEST_RECORD        = opCodes.GAME_MSG_RUNMAN_BEGIN + 10 //最高纪录
// opCodes.G2C_RUNMAN_BEST_RECORD        = opCodes.GAME_MSG_RUNMAN_BEGIN + 11 //最高纪录
// opCodes.G2C_RUNMAN_LEAVE              = opCodes.GAME_MSG_RUNMAN_BEGIN + 12 //离开
// opCodes.C2G_RUNMAN_GET_PRIZE          = opCodes.GAME_MSG_RUNMAN_BEGIN + 13 //领取奖励
// opCodes.C2G_RUNMAN_CLEAR_DEADWAIT     = opCodes.GAME_MSG_RUNMAN_BEGIN + 14 //清除死亡等待
// opCodes.G2C_RUNMAN_GET_PRIZE          = opCodes.GAME_MSG_RUNMAN_BEGIN + 15 //领取奖励

// opCodes.G2C_WING_INFO                 = opCodes.GAME_MSG_WING_BEGIN + 1 //翅膀信息
// opCodes.G2C_WING_ADD                  = opCodes.GAME_MSG_WING_BEGIN + 2 //添加翅膀
// opCodes.G2C_WING_UPDATE_FIELD         = opCodes.GAME_MSG_WING_BEGIN + 3 //翅膀更新
// opCodes.C2G_WING_SET_STATE            = opCodes.GAME_MSG_WING_BEGIN + 4 //翅膀状态
// opCodes.C2G_WING_DEVELOP              = opCodes.GAME_MSG_WING_BEGIN + 5 //翅膀升级
// opCodes.C2G_WING_SKILL_LEVEL          = opCodes.GAME_MSG_WING_BEGIN + 6 //翅膀技能升级
// opCodes.G2C_WING_UPDATE               = opCodes.GAME_MSG_WING_BEGIN + 7 //翅膀全部更新
// opCodes.C2G_WING_SET_SKILL            = opCodes.GAME_MSG_WING_BEGIN + 8 //设置技能
// opCodes.C2G_WING_SET_IMAGE            = opCodes.GAME_MSG_WING_BEGIN + 9 //设置外观
// opCodes.C2G_WING_UNLOCK_SKILL         = opCodes.GAME_MSG_WING_BEGIN + 10 //解锁技能
// opCodes.C2G_WING_UNLOCK_IMAGE         = opCodes.GAME_MSG_WING_BEGIN + 11 //解锁形象
// opCodes.C2G_WING_ACTIVE               = opCodes.GAME_MSG_WING_BEGIN + 12 //激活
// opCodes.C2G_WING_OPEN_HOLE            = opCodes.GAME_MSG_WING_BEGIN + 13 //打孔
// opCodes.C2G_WING_IMPLANT_SKILL        = opCodes.GAME_MSG_WING_BEGIN + 14 //植入技能
// opCodes.C2G_WING_SKILL_BOOK_ENERGY    = opCodes.GAME_MSG_WING_BEGIN + 15 //技能书转化为能量
// opCodes.C2G_WING_SKILL_LOTTERY        = opCodes.GAME_MSG_WING_BEGIN + 16 //技能书转盘
// opCodes.G2C_WING_SKILL_LOTTERY        = opCodes.GAME_MSG_WING_BEGIN + 17 //技能书转盘
// opCodes.C2G_WING_SKILL_LOTTERY_LIB    = opCodes.GAME_MSG_WING_BEGIN + 18 //查看技能书库
// opCodes.G2C_WING_SKILL_LOTTERY_LIB    = opCodes.GAME_MSG_WING_BEGIN + 19 //查看技能书库
// opCodes.C2G_WING_ENTER_SKILL_LOTTERY  = opCodes.GAME_MSG_WING_BEGIN + 20 //进入技能书抽奖
// opCodes.G2C_WING_ENTER_SKILL_LOTTERY  = opCodes.GAME_MSG_WING_BEGIN + 21 //进入技能书抽奖
// opCodes.C2G_WING_LOCK_IMPLANT_SKILL   = opCodes.GAME_MSG_WING_BEGIN + 22 //锁定植入技能
// opCodes.C2G_WING_TOTEM_LEVEL_UP       = opCodes.GAME_MSG_WING_BEGIN + 23 //翅膀图腾升级
// opCodes.C2G_WING_TOTEM_QUALITY_UP     = opCodes.GAME_MSG_WING_BEGIN + 24 //翅膀图腾升品质
// opCodes.C2G_WING_TOTEM_RESET          = opCodes.GAME_MSG_WING_BEGIN + 25 //翅膀图腾重置
// opCodes.C2G_WING_REFINING             = opCodes.GAME_MSG_WING_BEGIN + 26 //翅膀炼化
// opCodes.G2C_WING_REFINING             = opCodes.GAME_MSG_WING_BEGIN + 27 //翅膀炼化
// opCodes.C2G_WING_AUTO_REFINING        = opCodes.GAME_MSG_WING_BEGIN + 28 //翅膀一键炼化

// opCodes.C2G_FESTIVAL_MIDAUTUMN_EXCHANGE   = opCodes.GAME_MSG_FESTIVAL_BEGIN + 1 //兑换月饼
// opCodes.C2G_FESTIVAL_MIDAUTUMN_QUERY      = opCodes.GAME_MSG_FESTIVAL_BEGIN + 2 //查询兑换信息
// opCodes.G2C_FESTIVAL_MIDAUTUMN_QUERY      = opCodes.GAME_MSG_FESTIVAL_BEGIN + 3 //查询兑换信息
// opCodes.C2G_FESTIVAL_NATIONALDAY_EXCHANGE = opCodes.GAME_MSG_FESTIVAL_BEGIN + 4 //兑换(国庆)
// opCodes.C2G_FESTIVAL_NATIONALDAY_QUERY    = opCodes.GAME_MSG_FESTIVAL_BEGIN + 5 //查询兑换信息(国庆)
// opCodes.G2C_FESTIVAL_NATIONALDAY_QUERY    = opCodes.GAME_MSG_FESTIVAL_BEGIN + 6 //查询兑换信息(国庆)
// opCodes.C2G_FESTIVAL_HALLOWEEN_BODY       = opCodes.GAME_MSG_FESTIVAL_BEGIN + 7 //领取变身(万圣节)
// opCodes.C2G_FESTIVAL_HALLOWEEN_BODY_PRIZE = opCodes.GAME_MSG_FESTIVAL_BEGIN + 8 //领取变身奖励(万圣节)
// opCodes.C2G_FESTIVAL_HALLOWEEN_EXCHANGE   = opCodes.GAME_MSG_FESTIVAL_BEGIN + 9 //兑换道具(万圣节)
// opCodes.C2G_FESTIVAL_HALLOWEEN_EXCHANGE2  = opCodes.GAME_MSG_FESTIVAL_BEGIN + 10 //兑换全服道具(万圣节)
// opCodes.C2G_FESTIVAL_HALLOWEEN_FIGHT      = opCodes.GAME_MSG_FESTIVAL_BEGIN + 11 //打怪(万圣节)
// opCodes.C2G_FESTIVAL_HALLOWEEN_QUERY      = opCodes.GAME_MSG_FESTIVAL_BEGIN + 12 //界面信息(万圣节)
// opCodes.G2C_FESTIVAL_HALLOWEEN_QUERY      = opCodes.GAME_MSG_FESTIVAL_BEGIN + 13 //界面信息(万圣节)
// opCodes.C2G_FESTIVAL_HALLOWEEN_BUY        = opCodes.GAME_MSG_FESTIVAL_BEGIN + 14 //晶石购买巧克力(万圣节)
// opCodes.C2G_FESTIVAL_HALLOWEEN_PET        = opCodes.GAME_MSG_FESTIVAL_BEGIN + 15 //谁得到了宠物(万圣节)
// opCodes.G2C_FESTIVAL_HALLOWEEN_PET        = opCodes.GAME_MSG_FESTIVAL_BEGIN + 16 //谁得到了宠物(万圣节)
// opCodes.C2G_FESTIVAL_SINGLEDAY_ENCOUNTER  = opCodes.GAME_MSG_FESTIVAL_BEGIN + 17 //邂逅女神(光棍节)
// opCodes.C2G_FESTIVAL_SINGLEDAY_QUESTION   = opCodes.GAME_MSG_FESTIVAL_BEGIN + 18 //答题(光棍节)
// opCodes.C2G_FESTIVAL_SINGLEDAY_FLOWER     = opCodes.GAME_MSG_FESTIVAL_BEGIN + 19 //送花(光棍节)
// opCodes.C2G_FESTIVAL_SINGLEDAY_REWARD     = opCodes.GAME_MSG_FESTIVAL_BEGIN + 20 //领取阶段奖励(光棍节)
// opCodes.C2G_FESTIVAL_SINGLEDAY_FIGHT      = opCodes.GAME_MSG_FESTIVAL_BEGIN + 21 //战斗(光棍节)
// opCodes.C2G_FESTIVAL_SINGLEDAY_RANK       = opCodes.GAME_MSG_FESTIVAL_BEGIN + 22 //排行榜(光棍节)
// opCodes.G2C_FESTIVAL_SINGLEDAY_RANK       = opCodes.GAME_MSG_FESTIVAL_BEGIN + 23 //排行榜(光棍节)
// opCodes.G2C_FESTIVAL_SINGLEDAY_INFO       = opCodes.GAME_MSG_FESTIVAL_BEGIN + 24 //光棍节信息(光棍节)
// opCodes.C2G_FESTIVAL_SINGLEDAY_INFO       = opCodes.GAME_MSG_FESTIVAL_BEGIN + 25 //光棍节信息(光棍节)
// opCodes.C2G_FESTIVAL_SINGLEDAY_NOWAIT     = opCodes.GAME_MSG_FESTIVAL_BEGIN + 26 //清除等待(光棍节)
// //圣诞节日协议
// opCodes.C2G_FESTIVAL_CHRISTMAS_GET      = opCodes.GAME_MSG_FESTIVAL_BEGIN + 27 //领取当天捡到奖励
// opCodes.C2G_FESTIVAL_CHRISTMAS_PICK     = opCodes.GAME_MSG_FESTIVAL_BEGIN + 28 //捡雪花
// opCodes.C2G_FESTIVAL_CHRISTMAS_EXCHANGE = opCodes.GAME_MSG_FESTIVAL_BEGIN + 29 //兑换
// opCodes.C2G_FESTIVAL_CHRISTMAS_GET_INFO = opCodes.GAME_MSG_FESTIVAL_BEGIN + 30 //获取活动信息
// opCodes.G2C_FESTIVAL_CHRISTMAS_GET_INFO = opCodes.GAME_MSG_FESTIVAL_BEGIN + 31 //活动信息返回
// //元旦节日协议
// opCodes.C2G_FESTIVAL_NEWYEAR_GET      = opCodes.GAME_MSG_FESTIVAL_BEGIN + 32 //领取当天捡到奖励
// opCodes.C2G_FESTIVAL_NEWYEAR_FIGHT    = opCodes.GAME_MSG_FESTIVAL_BEGIN + 33 //挑战npc
// opCodes.C2G_FESTIVAL_NEWYEAR_EXCHANGE = opCodes.GAME_MSG_FESTIVAL_BEGIN + 34 //兑换
// opCodes.C2G_FESTIVAL_NEWYEAR_GET_INFO = opCodes.GAME_MSG_FESTIVAL_BEGIN + 35 //获取活动信息
// opCodes.G2C_FESTIVAL_NEWYEAR_GET_INFO = opCodes.GAME_MSG_FESTIVAL_BEGIN + 36 //活动信息返回
// //春节
// opCodes.C2G_FESTIVAL_ONLINE_GIFT      = opCodes.GAME_MSG_FESTIVAL_BEGIN + 37 //领取当天在线奖励
// opCodes.C2G_FESTIVAL_SPRING_FIGHT     = opCodes.GAME_MSG_FESTIVAL_BEGIN + 38 //挑战年兽npc
// opCodes.C2G_FESTIVAL_SPRING_INFO      = opCodes.GAME_MSG_FESTIVAL_BEGIN + 39 //获取活动信息
// opCodes.G2C_FESTIVAL_SPRING_INFO      = opCodes.GAME_MSG_FESTIVAL_BEGIN + 40 //活动信息返回
// opCodes.C2G_FESTIVAL_SPRING_VOW_NPC   = opCodes.GAME_MSG_FESTIVAL_BEGIN + 41 //占领许愿盒
// opCodes.C2G_FESTIVAL_SPRING_VOW       = opCodes.GAME_MSG_FESTIVAL_BEGIN + 42 //活动许愿
// opCodes.C2G_FESTIVAL_SPRING_SEND_RED  = opCodes.GAME_MSG_FESTIVAL_BEGIN + 43 //种摇钱树(发红包)
// opCodes.C2G_FESTIVAL_SPRING_GET_RED   = opCodes.GAME_MSG_FESTIVAL_BEGIN + 44 //抢红包
// opCodes.C2G_FESTIVAL_SPRING_TREE_INFO = opCodes.GAME_MSG_FESTIVAL_BEGIN + 45 //摇钱树信息
// opCodes.G2C_FESTIVAL_SPRING_TREE_INFO = opCodes.GAME_MSG_FESTIVAL_BEGIN + 46 //摇钱树信息
// //独立日
// opCodes.C2G_FESTIVAL_INDEPENDENCE_INFO	  = opCodes.GAME_MSG_FESTIVAL_BEGIN + 47 //获取活动信息
// opCodes.G2C_FESTIVAL_INDEPENDENCE_INFO		= opCodes.GAME_MSG_FESTIVAL_BEGIN + 48 //活动信息返回
// opCodes.C2G_FESTIVAL_INDEPENDENCE_GIFT	  = opCodes.GAME_MSG_FESTIVAL_BEGIN + 49 //兑换奖励
// opCodes.C2G_FESTIVAL_INDEPENDENCE_MEAT	  = opCodes.GAME_MSG_FESTIVAL_BEGIN + 50 //拾取烤肉
// opCodes.G2C_FESTIVAL_INDEPENDENCE_MEAT	  = opCodes.GAME_MSG_FESTIVAL_BEGIN + 51 //拾取烤肉

// opCodes.C2G_ENTER_DEAD_FIELD             = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 1 //进入活动
// opCodes.G2C_ENTER_DEAD_FIELD             = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 2 //进入活动
// opCodes.C2G_EXIT_DEAD_FIELD              = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 3 //退出活动
// opCodes.G2C_EXIT_DEAD_FIELD              = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 4 //退出活动
// opCodes.C2G_USE_SKILL_DEAD_FIELD         = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 5 //使用技能
// opCodes.G2C_USE_SKILL_DEAD_FIELD         = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 6 //使用技能
// opCodes.C2G_RESET_DEAD_FIELD             = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 7 //重置信息
// //opCodes.G2C_RESET_DEAD_FIELD             = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 8 //重置信息
// opCodes.C2G_TIME_OVER_DEAD_FIELD         = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 9 //活动超时(客户端通知服务器已经超时,服务器验证)
// opCodes.G2C_TIME_OVER_DEAD_FIELD         = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 10 //活动超时(服务器通知客户端超时,强制退出)
// opCodes.C2G_CREATE_FIGHT_DEAD_FIELD      = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 11 //创建战斗
// opCodes.G2C_DEAD_FIELD_INFO              = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 12 //死亡领域信息
// opCodes.C2G_DEAD_FIELD_INFO              = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 13 //死亡领域信息
// opCodes.C2G_DEAD_FIELD_LAYER_INFO        = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 14 //死亡领域层信息(进入活动之前查看)
// opCodes.G2C_DEAD_FIELD_LAYER_INFO        = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 15 //死亡领域层信息(进入活动之前查看)
// //个人日常版
// opCodes.C2G_ENTER_DEAD_FIELD_PERSONAL             = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 16 //进入活动
// opCodes.G2C_ENTER_DEAD_FIELD_PERSONAL             = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 17 //进入活动
// opCodes.C2G_EXIT_DEAD_FIELD_PERSONAL              = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 18 //退出活动
// opCodes.G2C_EXIT_DEAD_FIELD_PERSONAL              = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 19 //退出活动
// opCodes.C2G_USE_SKILL_DEAD_FIELD_PERSONAL         = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 20 //使用技能
// opCodes.G2C_USE_SKILL_DEAD_FIELD_PERSONAL         = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 21 //使用技能
// opCodes.C2G_CREATE_FIGHT_DEAD_FIELD_PERSONAL      = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 22 //创建战斗
// opCodes.G2C_DEAD_FIELD_INFO_PERSONAL              = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 23 //死亡领域信息
// opCodes.C2G_DEAD_FIELD_INFO_PERSONAL              = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 24 //死亡领域信息
// opCodes.C2G_DEAD_FIELD_PERSONAL_LAYER             = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 25 //死亡领域信息(进入前)
// opCodes.G2C_DEAD_FIELD_PERSONAL_LAYER             = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 26 //死亡领域信息(进入前)
// opCodes.C2G_DEAD_FIELD_PERSONAL_INVITE_LIST       = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 27 //死亡领域邀请列表
// opCodes.G2C_DEAD_FIELD_PERSONAL_INVITE_LIST       = opCodes.GAME_MSG_DEAD_FIELD_BEGIN + 28 //死亡领域邀请列表


// opCodes.C2G_ENTER_SECRET_LAND_FIELD      = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 1 //进入
// opCodes.G2C_ENTER_SECRET_LAND_FIELD      = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 2 //进入
// opCodes.G2C_LEAVE_SECRET_LAND_FIELD      = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 3 //退出
// opCodes.C2G_LEAVE_SECRET_LAND_FIELD      = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 4 //退出
// opCodes.G2C_SECRET_LAND_DATA             = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 5 //活动数据
// opCodes.G2C_SECRET_LAND_PLR_DATA         = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 6 //个人数据
// opCodes.C2G_SECRET_LAND_PLR_DATA         = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 7 //个人数据
// opCodes.C2G_CLEAR_SECRET_DEAD_WAIT       = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 8 //清除死亡等待
// opCodes.C2G_SECRET_LAND_INSPIRE          = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 9 //鼓舞
// opCodes.C2G_SECRET_LAND_CREATE_FIGHT     = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 10 //战斗
// opCodes.C2G_SECRET_LAND_PICK_BOX         = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 11 //捡取宝箱
// opCodes.C2G_SECRET_LAND_PRODUCE          = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 12 //当前活动进度
// opCodes.G2C_SECRET_LAND_PRODUCE          = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 13 //当前活动进度
// opCodes.C2G_SECRET_LAND_RANK             = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 14 //活动排名
// opCodes.G2C_SECRET_LAND_RANK             = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 15 //活动排名
// opCodes.G2C_SECRET_LAND_REFRESH_TIME     = opCodes.GAME_MSG_SECRET_LAND_BEGIN + 16 //题目刷新倒计时

// //opCodes.C2G_LEAGUE_SERVER_INFO           = opCodes.GAME_MSG_LEAGUE_BEGIN + 1 //跨服信息
// //opCodes.G2C_LEAGUE_SERVER_INFO           = opCodes.GAME_MSG_LEAGUE_BEGIN + 2 //跨服信息
// //opCodes.C2G_LEAGUE_READY_MSG             = opCodes.GAME_MSG_LEAGUE_BEGIN + 3 //玩家信息
// //opCodes.G2C_LEAGUE_READY_MSG             = opCodes.GAME_MSG_LEAGUE_BEGIN + 4 //玩家信息
// //opCodes.C2G_LEAGUE_SET_READY             = opCodes.GAME_MSG_LEAGUE_BEGIN + 5 //准备
// //opCodes.C2G_LEAGUE_UNSET_READY           = opCodes.GAME_MSG_LEAGUE_BEGIN + 6 //取消准备
// //opCodes.C2G_LEAGUE_START_BATTLE          = opCodes.GAME_MSG_LEAGUE_BEGIN + 7 //开始战斗
// //opCodes.C2G_LEAGUE_QUERY_VIEDO           = opCodes.GAME_MSG_LEAGUE_BEGIN + 8 //录像
// //opCodes.G2C_LEAGUE_QUERY_VIEDO           = opCodes.GAME_MSG_LEAGUE_BEGIN + 9 //录像
// //opCodes.C2G_LEAGUE_QUERY_RANK            = opCodes.GAME_MSG_LEAGUE_BEGIN + 10 //排行
// //opCodes.G2C_LEAGUE_QUERY_RANK            = opCodes.GAME_MSG_LEAGUE_BEGIN + 11 //排行
// //opCodes.C2G_LEAGUE_POINT                 = opCodes.GAME_MSG_LEAGUE_BEGIN + 12 //荣誉点
// //opCodes.G2C_LEAGUE_POINT                 = opCodes.GAME_MSG_LEAGUE_BEGIN + 13 //荣誉点
// //opCodes.G2C_LEAGUE_NO_COUNT              = opCodes.GAME_MSG_LEAGUE_BEGIN + 14 //次数不够
// //opCodes.C2G_LEAGUE_BUY_COUNT             = opCodes.GAME_MSG_LEAGUE_BEGIN + 15 //购买次数
// //opCodes.G2C_LEAGUE_UPDATE_COUNT          = opCodes.GAME_MSG_LEAGUE_BEGIN + 16 //更新次数
// //opCodes.C2G_LEAGUE_UPDATE_COUNT          = opCodes.GAME_MSG_LEAGUE_BEGIN + 17 //更新次数


// //游戏服协议//
// opCodes.C2G_LEAGUE_MATCH_LINK           = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 1 //跨服信息
// opCodes.G2C_LEAGUE_MATCH_LINK           = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 2 //跨服信息
// opCodes.C2G_LEAGUE_MATCH_LEFT_COUNT     = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 3 //更新次数
// opCodes.G2C_LEAGUE_MATCH_LEFT_COUNT     = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 4 //更新次数
// opCodes.C2G_LEAGUE_MATCH_BUY_COUNT      = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 5 //购买次数
// opCodes.C2G_LEAGUE_MATCH_VIEDO          = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 6 //录像
// opCodes.G2C_LEAGUE_MATCH_VIEDO          = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 7 //录像
// opCodes.C2G_LEAGUE_MATCH_POINT          = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 8 //荣誉点
// opCodes.G2C_LEAGUE_MATCH_POINT          = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 9 //荣誉点
// opCodes.C2G_LEAGUE_MATCH_QUERY_RANK     = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 10 //排行
// opCodes.G2C_LEAGUE_MATCH_QUERY_RANK     = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 11 //排行

// //跨服协议//
// opCodes.G2C_LEAGUE_MATCH_LOGIN           = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 12 //玩家信息
// opCodes.C2G_LEAGUE_MATCH_PLYLIST         = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 13 //请求与之相关的玩家列表
// opCodes.G2C_LEAGUE_MATCH_PLYLIST         = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 14 //

// opCodes.C2G_LEAGUE_MATCH_INVITE          = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 15 //邀请别的玩家加入
// opCodes.G2C_LEAGUE_MATCH_INVITE          = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 16 //
// opCodes.G2C_LEAGUE_MATCH_INVITE_INFO     = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 17 //
// opCodes.C2G_LEAGUE_MATCH_INVITE_RSP      = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 18 //回复邀请
// opCodes.G2C_LEAGUE_MATCH_INVITE_RSP      = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 19 //

// opCodes.C2G_LEAGUE_MATCH_CREATE_TEAM      = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 20 //创建队伍
// opCodes.G2C_LEAGUE_MATCH_CREATE_TEAM      = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 21 //
// opCodes.G2C_LEAGUE_MATCH_TEAM_INFO        = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 22 //队伍信息//

// opCodes.C2G_LEAGUE_MATCH_DISBAND_TEAM      = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 23 //队长解散队伍
// opCodes.G2C_LEAGUE_MATCH_DISBAND_TEAM      = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 24 //
// opCodes.G2C_LEAGUE_MATCH_DISBAND_NOTIFY    = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 25 // 队伍解散通知

// opCodes.C2G_LEAGUE_MATCH_LEAVE_TEAM      = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 26 //队员离开队伍
// opCodes.G2C_LEAGUE_MATCH_LEAVE_TEAM      = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 27 //
// opCodes.G2C_LEAGUE_MATCH_LEAVE_NOTIFY    = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 28 //队员离开队伍　通知

// opCodes.C2G_LEAGUE_MATCH_KICK_TEAM      = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 29 //队员离开队伍
// opCodes.G2C_LEAGUE_MATCH_KICK_TEAM      = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 30 //
// opCodes.G2C_LEAGUE_MATCH_KICK_NOTIFY    = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 31 //队员离开队伍　通知


// opCodes.C2G_LEAGUE_MATCH_BEGIN_MATCH    = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 32 //开始匹配
// opCodes.G2C_LEAGUE_MATCH_BEGIN_MATCH    = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 33 //
// opCodes.C2G_LEAGUE_MATCH_CANCEL_MATCH   = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 34 //匹配中，取消掉
// opCodes.G2C_LEAGUE_MATCH_CANCEL_MATCH   = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 35 //

// opCodes.G2C_LEAGUE_MATCH_FAIL      		= opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 36 //匹配失败
// opCodes.G2C_LEAGUE_MATCH_FINISH      	= opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 37 //匹配成功
// opCodes.G2C_LEAGUE_MATCH_ABORT      	= opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 38 //有人退出，中断了     

// opCodes.C2G_LEAGUE_MATCH_QUIT_BATTLE    = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 39 //匹配成功后，准备战斗中退出
// opCodes.G2C_LEAGUE_MATCH_QUIT_BATTLE    = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 40 //

// opCodes.C2G_LEAGUE_MATCH_RETURN    		= opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 41 //战斗结束后，从战斗结算界面返回
// opCodes.G2C_LEAGUE_MATCH_RETURN    		= opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 42 //

// //
// //opCodes.C2G_LEAGUE_READY_MSG             = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 3 //玩家信息
// //opCodes.G2C_LEAGUE_READY_MSG             = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 4 //玩家信息
// //opCodes.C2G_LEAGUE_SET_READY             = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 5 //准备
// //opCodes.C2G_LEAGUE_UNSET_READY           = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 6 //取消准备
// //opCodes.C2G_LEAGUE_START_BATTLE          = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 7 //开始战斗
// //
// //opCodes.C2G_LEAGUE_QUERY_RANK            = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 10 //排行
// //opCodes.G2C_LEAGUE_QUERY_RANK            = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 11 //排行
// //
// //opCodes.G2C_LEAGUE_NO_COUNT              = opCodes.GAME_MSG_LEAGUE_MATCH_BEGIN + 14 //次数不够
// //
// opCodes.C2G_GUOZHAN_MAP_INFO             = opCodes.GAME_MSG_GUOZHAN_BEGIN + 1 //大地图信息
// opCodes.G2C_GUOZHAN_MAP_INFO             = opCodes.GAME_MSG_GUOZHAN_BEGIN + 2 //大地图信息
// opCodes.C2G_GUOZHAN_TERRAIN_INFO         = opCodes.GAME_MSG_GUOZHAN_BEGIN + 3 //地图信息
// opCodes.G2C_GUOZHAN_TERRAIN_INFO         = opCodes.GAME_MSG_GUOZHAN_BEGIN + 4 //地图信息
// opCodes.C2G_GUOZHAN_CITY_INFO            = opCodes.GAME_MSG_GUOZHAN_BEGIN + 5 //城池信息
// opCodes.G2C_GUOZHAN_CITY_INFO            = opCodes.GAME_MSG_GUOZHAN_BEGIN + 6 //城池信息
// opCodes.G2C_GUOZHAN_PLAYER_INFO          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 7 //我的信息
// opCodes.C2G_GUOZHAN_HOUSE_INFO           = opCodes.GAME_MSG_GUOZHAN_BEGIN + 8 //城内资源点信息
// opCodes.G2C_GUOZHAN_HOUSE_INFO           = opCodes.GAME_MSG_GUOZHAN_BEGIN + 9 //城内资源点信息
// opCodes.C2G_GUOZHAN_MINE_INFO            = opCodes.GAME_MSG_GUOZHAN_BEGIN + 10 //城外资源点信息
// opCodes.G2C_GUOZHAN_MINE_INFO            = opCodes.GAME_MSG_GUOZHAN_BEGIN + 11 //城外资源点信息
// opCodes.C2G_GUOZHAN_ATTACK_HOUSE         = opCodes.GAME_MSG_GUOZHAN_BEGIN + 12 //进攻城内资源点
// opCodes.C2G_GUOZHAN_ATTACK_MINE          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 13 //进攻城外资源点
// opCodes.C2G_GUOZHAN_QUERY_RESOURCE       = opCodes.GAME_MSG_GUOZHAN_BEGIN + 14 //我的资源点
// opCodes.G2C_GUOZHAN_QUERY_RESOURCE       = opCodes.GAME_MSG_GUOZHAN_BEGIN + 15 //我的资源点
// opCodes.C2G_GUOZHAN_ENTER_WORLD          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 16 //进入
// opCodes.C2G_GUOZHAN_GAIN_HOUSE_RESOURCE  = opCodes.GAME_MSG_GUOZHAN_BEGIN + 17 //收割城内资源
// opCodes.C2G_GUOZHAN_GAIN_MINE_RESOURCE   = opCodes.GAME_MSG_GUOZHAN_BEGIN + 18 //收割城外资源
// opCodes.C2G_GUOZHAN_QUERY_GATHER         = opCodes.GAME_MSG_GUOZHAN_BEGIN + 19 //集结信息
// opCodes.G2C_GUOZHAN_QUERY_GATHER         = opCodes.GAME_MSG_GUOZHAN_BEGIN + 20 //集结信息
// opCodes.C2G_GUOZHAN_ASSIST_ATTACK        = opCodes.GAME_MSG_GUOZHAN_BEGIN + 21 //协助进攻
// opCodes.C2G_GUOZHAN_ASSIST_DEFENCE       = opCodes.GAME_MSG_GUOZHAN_BEGIN + 22 //协助防守
// opCodes.C2G_GUOZHAN_BUILD_STRONGHOLD     = opCodes.GAME_MSG_GUOZHAN_BEGIN + 23 //设置据点
// opCodes.C2G_GUOZHAN_QUERY_COST           = opCodes.GAME_MSG_GUOZHAN_BEGIN + 24 //查询消耗
// opCodes.G2C_GUOZHAN_QUERY_COST           = opCodes.GAME_MSG_GUOZHAN_BEGIN + 25 //查询消耗
// opCodes.C2G_GUOZHAN_PLAYER_ASSIST_ARMY   = opCodes.GAME_MSG_GUOZHAN_BEGIN + 26 //协助部队信息
// opCodes.G2C_GUOZHAN_PLAYER_ASSIST_ARMY   = opCodes.GAME_MSG_GUOZHAN_BEGIN + 27 //协助部队信息
// opCodes.C2G_GUOZHAN_PLAYER_MARCH_ARMY    = opCodes.GAME_MSG_GUOZHAN_BEGIN + 28 //行军部队信息
// opCodes.G2C_GUOZHAN_PLAYER_MARCH_ARMY    = opCodes.GAME_MSG_GUOZHAN_BEGIN + 29 //行军部队信息
// opCodes.C2G_GUOZHAN_PLAYER_GATHER_ARMY   = opCodes.GAME_MSG_GUOZHAN_BEGIN + 30 //集结部队信息
// opCodes.G2C_GUOZHAN_PLAYER_GATHER_ARMY   = opCodes.GAME_MSG_GUOZHAN_BEGIN + 31 //集结部队信息
// opCodes.C2G_GUOZHAN_PLAYER_ARMY          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 32 //部队信息
// opCodes.G2C_GUOZHAN_PLAYER_ARMY          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 33 //部队信息
// opCodes.C2G_GUOZHAN_MINE_CALLBACK        = opCodes.GAME_MSG_GUOZHAN_BEGIN + 34 //召回资源点部队
// opCodes.C2G_GUOZHAN_ARMY_CALLBACK        = opCodes.GAME_MSG_GUOZHAN_BEGIN + 35 //召回行军部队
// opCodes.C2G_GUOZHAN_QUERY_CITY           = opCodes.GAME_MSG_GUOZHAN_BEGIN + 36 //查看城池信息
// opCodes.G2C_GUOZHAN_QUERY_CITY           = opCodes.GAME_MSG_GUOZHAN_BEGIN + 37 //查看城池信息
// opCodes.G2C_GUOZHAN_FIGHT_RECORD         = opCodes.GAME_MSG_GUOZHAN_BEGIN + 38 //一条战斗记录
// opCodes.C2G_GUOZHAN_SERVER_INFO          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 39 //跨服信息
// opCodes.G2C_GUOZHAN_SERVER_INFO          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 40 //跨服信息
// opCodes.C2G_GUOZHAN_QUERY_GOLD           = opCodes.GAME_MSG_GUOZHAN_BEGIN + 41 //国战资源
// opCodes.G2C_GUOZHAN_QUERY_GOLD           = opCodes.GAME_MSG_GUOZHAN_BEGIN + 42 //国战资源
// opCodes.C2G_GUOZHAN_BUY_POINT            = opCodes.GAME_MSG_GUOZHAN_BEGIN + 43 //购买行动力
// opCodes.C2G_GUOZHAN_REFRESH_POINT        = opCodes.GAME_MSG_GUOZHAN_BEGIN + 44 //刷新行动力
// opCodes.C2G_GUOZHAN_QUERY_VIEDO          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 45 //查询录像信息
// opCodes.G2C_GUOZHAN_QUERY_VIEDO          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 46 //查询录像信息
// opCodes.C2G_GUOZHAN_REPEAL_STRONGHOLD    = opCodes.GAME_MSG_GUOZHAN_BEGIN + 47 //取消据点
// opCodes.C2G_GUOZHAN_QUERY_STRONGHOLD     = opCodes.GAME_MSG_GUOZHAN_BEGIN + 48 //据点部队
// opCodes.G2C_GUOZHAN_QUERY_STRONGHOLD     = opCodes.GAME_MSG_GUOZHAN_BEGIN + 49 //据点部队
// opCodes.C2G_GUOZHAN_ATTACK_FROM_HOLD     = opCodes.GAME_MSG_GUOZHAN_BEGIN + 50 //据点出发
// opCodes.C2G_GUOZHAN_QUERY_FIGHTDATA      = opCodes.GAME_MSG_GUOZHAN_BEGIN + 51 //查询部队信息
// opCodes.G2C_GUOZHAN_QUERY_FIGHTDATA      = opCodes.GAME_MSG_GUOZHAN_BEGIN + 52 //查询部队信息
// opCodes.C2G_GUOZHAN_QUERY_BUILD          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 53 //查询建筑信息
// opCodes.G2C_GUOZHAN_QUERY_BUILD          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 54 //查询建筑信息
// opCodes.C2G_GUOZHAN_START_BUILD          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 55 //开启建设
// opCodes.C2G_GUOZHAN_LEVELUP_BUILD        = opCodes.GAME_MSG_GUOZHAN_BEGIN + 56 //升级建筑
// opCodes.C2G_GUOZHAN_DESTROY_BUILD        = opCodes.GAME_MSG_GUOZHAN_BEGIN + 57 //销毁建筑
// opCodes.C2G_GUOZHAN_QUERY_SINGLE_BUILD   = opCodes.GAME_MSG_GUOZHAN_BEGIN + 58 //查询单个建筑信息
// opCodes.G2C_GUOZHAN_QUERY_SINGLE_BUILD   = opCodes.GAME_MSG_GUOZHAN_BEGIN + 59 //查询单个建筑信息
// opCodes.C2G_GUOZHAN_COLLECT_RESOURCE     = opCodes.GAME_MSG_GUOZHAN_BEGIN + 60 //收获资源
// opCodes.G2C_GUOZHAN_UPDATE_RESOURCE      = opCodes.GAME_MSG_GUOZHAN_BEGIN + 61 //资源信息
// opCodes.C2G_GUOZHAN_UPDATE_BUILD         = opCodes.GAME_MSG_GUOZHAN_BEGIN + 62 //更新建筑进度
// opCodes.C2G_GUOZHAN_RECRUIT_ARMY         = opCodes.GAME_MSG_GUOZHAN_BEGIN + 63 //招募士兵
// opCodes.C2G_GUOZHAN_RESEARCH_AECHNOLOGY  = opCodes.GAME_MSG_GUOZHAN_BEGIN + 64 //研究兵符
// opCodes.C2G_GUOZHAN_PRODUCE_BINGFU       = opCodes.GAME_MSG_GUOZHAN_BEGIN + 65 //制作兵符
// opCodes.C2G_GUOZHAN_ASSIGN_BINGFU        = opCodes.GAME_MSG_GUOZHAN_BEGIN + 66 //配置兵符
// opCodes.C2G_GUOZHAN_LEVELUP_TRAIN        = opCodes.GAME_MSG_GUOZHAN_BEGIN + 67 //开启/升级训练项目
// opCodes.C2G_GUOZHAN_UPGRADE_CROPS        = opCodes.GAME_MSG_GUOZHAN_BEGIN + 68 //兵种进阶
// opCodes.C2G_GUOZHAN_QUERY_RESEARCH       = opCodes.GAME_MSG_GUOZHAN_BEGIN + 69 //查询研究等级
// opCodes.G2C_GUOZHAN_QUERY_RESEARCH       = opCodes.GAME_MSG_GUOZHAN_BEGIN + 70 //查询研究等级
// opCodes.C2G_GUOZHAN_QUERY_BINGFU         = opCodes.GAME_MSG_GUOZHAN_BEGIN + 71 //查询兵符数量
// opCodes.G2C_GUOZHAN_QUERY_BINGFU         = opCodes.GAME_MSG_GUOZHAN_BEGIN + 72 //查询兵符数量
// opCodes.G2C_GUOZHAN_HERO_BINGFU          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 73 //部下兵符配置
// opCodes.G2C_GUOZHAN_QUERY_TRAIN          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 74 //训练信息
// opCodes.C2G_GUOZHAN_QUERY_TRAIN          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 75 //训练信息
// opCodes.G2C_GUOZHAN_QUERY_UPGRADE        = opCodes.GAME_MSG_GUOZHAN_BEGIN + 76 //进阶信息
// opCodes.C2G_GUOZHAN_QUERY_UPGRADE        = opCodes.GAME_MSG_GUOZHAN_BEGIN + 77 //进阶信息
// opCodes.C2G_GUOZHAN_QUERY_BINGYING       = opCodes.GAME_MSG_GUOZHAN_BEGIN + 78 //兵营信息
// opCodes.G2C_GUOZHAN_QUERY_BINGYING       = opCodes.GAME_MSG_GUOZHAN_BEGIN + 79 //兵营信息
// opCodes.C2G_GUOZHAN_TRANSPORT_ARMY       = opCodes.GAME_MSG_GUOZHAN_BEGIN + 80 //运输兵力
// opCodes.C2G_GUOZHAN_FAST_BUILD           = opCodes.GAME_MSG_GUOZHAN_BEGIN + 81 //快速建造
// opCodes.C2G_GUOZHAN_EXCHANGE_DIAMOND     = opCodes.GAME_MSG_GUOZHAN_BEGIN + 82 //兑换晶石
// opCodes.C2G_GUOZHAN_BUY_RESOURCE         = opCodes.GAME_MSG_GUOZHAN_BEGIN + 83 //购买资源
// opCodes.C2G_GUOZHAN_EXPANSION_BUILD      = opCodes.GAME_MSG_GUOZHAN_BEGIN + 84 //购买队列
// opCodes.C2G_GUOZHAN_MAKE_WEAPON          = opCodes.GAME_MSG_GUOZHAN_BEGIN + 85 //制作武器
// opCodes.C2G_GUOZHAN_QUERY_WEAPON         = opCodes.GAME_MSG_GUOZHAN_BEGIN + 86 //查询武器数量
// opCodes.G2C_GUOZHAN_QUERY_WEAPON         = opCodes.GAME_MSG_GUOZHAN_BEGIN + 87 //查询武器数量
// opCodes.C2G_GUOZHAN_QUERY_MAKE_WEAPON    = opCodes.GAME_MSG_GUOZHAN_BEGIN + 88 //查询武器制作
// opCodes.G2C_GUOZHAN_QUERY_MAKE_WEAPON    = opCodes.GAME_MSG_GUOZHAN_BEGIN + 89 //查询武器制作

// //战阵
// opCodes.C2G_WAR_FORMATION_INFO           = opCodes.GAME_MSG_WARFORMATION_BEGIN + 1 //战阵信息
// opCodes.G2C_WAR_FORMATION_INFO           = opCodes.GAME_MSG_WARFORMATION_BEGIN + 2 //战阵信息
// opCodes.C2G_WAR_FORMATION_LEVEL          = opCodes.GAME_MSG_WARFORMATION_BEGIN + 4 //战阵升级
// opCodes.C2G_WAR_FORMATION_SET            = opCodes.GAME_MSG_WARFORMATION_BEGIN + 5 //设置战阵

// //报纸
// opCodes.C2G_NEWS_PAPER_INFO              = opCodes.GAME_MSG_NEWS_PAPER_BEGIN + 1 //报纸信息
// opCodes.G2C_NEWS_PAPER_INFO              = opCodes.GAME_MSG_NEWS_PAPER_BEGIN + 2 //报纸信息
// opCodes.C2G_NEWS_PAPER_LIST              = opCodes.GAME_MSG_NEWS_PAPER_BEGIN + 3 //报纸列表
// opCodes.G2C_NEWS_PAPER_LIST              = opCodes.GAME_MSG_NEWS_PAPER_BEGIN + 4 //报纸列表
// opCodes.C2G_NEWS_PAPER_SUBSCRIBE         = opCodes.GAME_MSG_NEWS_PAPER_BEGIN + 5 //报纸订阅
// opCodes.G2C_NEWS_PAPER_SUBSCRIBE         = opCodes.GAME_MSG_NEWS_PAPER_BEGIN + 6 //报纸订阅
// opCodes.C2G_NEWS_PAPER_SUBSCRIBE_RECORD  = opCodes.GAME_MSG_NEWS_PAPER_BEGIN + 7 //订阅记录
// opCodes.G2C_NEWS_PAPER_SUBSCRIBE_RECORD  = opCodes.GAME_MSG_NEWS_PAPER_BEGIN + 8 //订阅记录
// opCodes.C2G_NEWS_PAPER_ALMANAC           = opCodes.GAME_MSG_NEWS_PAPER_BEGIN + 9 //黄历
// opCodes.G2C_NEWS_PAPER_ALMANAC           = opCodes.GAME_MSG_NEWS_PAPER_BEGIN + 10 //黄历

// //每日任务
// opCodes.C2G_OPERATE_INFO_LIST            = opCodes.GAME_MSG_OPERATE_BEGIN + 1 //每日任务列表
// opCodes.G2C_OPERATE_INFO_LIST            = opCodes.GAME_MSG_OPERATE_BEGIN + 2 //每日任务列表
// opCodes.G2C_OPERATE_INFO_UPDATE          = opCodes.GAME_MSG_OPERATE_BEGIN + 3 //单条信息更新
// opCodes.C2G_OPERATE_INFO_PRIZE           = opCodes.GAME_MSG_OPERATE_BEGIN + 4 //领取奖励
// opCodes.C2G_OPERATE_ACTIVE_PRIZE         = opCodes.GAME_MSG_OPERATE_BEGIN + 5 //领取活跃度奖励
// opCodes.G2C_OPERATE_ACTIVE_PRIZE         = opCodes.GAME_MSG_OPERATE_BEGIN + 6 //领取活跃度奖励

// //坐骑
// opCodes.C2G_RIDE_ACTIVE                  = opCodes.GAME_MSG_RIDE_BEGIN + 1 //激活
// opCodes.C2G_RIDE_ACTIVE_ATTR             = opCodes.GAME_MSG_RIDE_BEGIN + 2 //激活属性加成
// opCodes.C2G_RIDE_UNACTIVE_ATTR           = opCodes.GAME_MSG_RIDE_BEGIN + 3 //取消属性加成
// opCodes.C2G_RIDE_ON                      = opCodes.GAME_MSG_RIDE_BEGIN + 4 //骑乘
// opCodes.C2G_RIDE_OFF                     = opCodes.GAME_MSG_RIDE_BEGIN + 5 //取消骑乘
// opCodes.C2G_RIDE_INFO                    = opCodes.GAME_MSG_RIDE_BEGIN + 6 //坐骑信息
// opCodes.G2C_RIDE_INFO                    = opCodes.GAME_MSG_RIDE_BEGIN + 7 //坐骑信息
// opCodes.C2G_RIDE_TRY                     = opCodes.GAME_MSG_RIDE_BEGIN + 8 //坐骑试骑
// opCodes.C2G_RIDE_UNTRY                   = opCodes.GAME_MSG_RIDE_BEGIN + 9 //取消坐骑试骑
// opCodes.C2G_RIDE_ON_EQUIP                = opCodes.GAME_MSG_RIDE_BEGIN + 10 //坐骑穿装备
// opCodes.C2G_RIDE_OFF_EQUIP               = opCodes.GAME_MSG_RIDE_BEGIN + 11 //坐骑取下装备
// opCodes.C2G_RIDE_EQUIP_EXCHANGE          = opCodes.GAME_MSG_RIDE_BEGIN + 12 //坐骑装备兑换
// opCodes.C2G_RIDE_EQUIP_REQUEST           = opCodes.GAME_MSG_RIDE_BEGIN + 13 //坐骑装备申请
// opCodes.G2C_RIDE_EQUIP_REQUEST           = opCodes.GAME_MSG_RIDE_BEGIN + 14 //坐骑装备返回
// opCodes.C2G_RIDE_FEED_REQUEST            = opCodes.GAME_MSG_RIDE_BEGIN + 15 //坐骑喂养信息申请
// opCodes.G2C_RIDE_FEED_REQUEST            = opCodes.GAME_MSG_RIDE_BEGIN + 16 //坐骑喂养信息返回
// opCodes.C2G_RIDE_FEED                    = opCodes.GAME_MSG_RIDE_BEGIN + 17 //坐骑喂养
// opCodes.G2C_RIDE_ADVANCEEX               = opCodes.GAME_MSG_RIDE_BEGIN + 18	//坐骑邀请
// opCodes.C2G_RIDE_ADVANCEEX               = opCodes.GAME_MSG_RIDE_BEGIN + 19	//坐骑邀请
// opCodes.C2G_RIDE_ADVANCEEX_RECORD        = opCodes.GAME_MSG_RIDE_BEGIN + 20	//坐骑邀请攻略
// opCodes.G2C_RIDE_ADVANCEEX_RECORD        = opCodes.GAME_MSG_RIDE_BEGIN + 21	//坐骑邀请攻略
// opCodes.C2G_RIDE_ADVANCEEX_RECORD_PRAISE = opCodes.GAME_MSG_RIDE_BEGIN + 22	//坐骑邀请攻略赞/拍砖
// opCodes.G2C_RIDE_ADVANCEEX_RECORD_PRAISE = opCodes.GAME_MSG_RIDE_BEGIN + 23	//坐骑邀请攻略赞/拍砖
// opCodes.C2G_RIDE_PRAISE_RECORD           = opCodes.GAME_MSG_RIDE_BEGIN + 24	//坐骑邀请攻略赞/拍砖记录(个人)
// opCodes.G2C_RIDE_PRAISE_RECORD           = opCodes.GAME_MSG_RIDE_BEGIN + 25	//坐骑邀请攻略赞/拍砖记录(个人)
// opCodes.C2G_RIDE_PRAISE_CHANGE_RECORD    = opCodes.GAME_MSG_RIDE_BEGIN + 26	//修改坐骑邀请攻略赞/拍砖记录(个人)
// opCodes.C2G_RIDE_SKILL_LIST              = opCodes.GAME_MSG_RIDE_BEGIN + 27	//申请使用中的坐骑技能列表
// opCodes.G2C_RIDE_SKILL_LIST              = opCodes.GAME_MSG_RIDE_BEGIN + 28	//返回使用中的坐骑技能列表
// opCodes.C2G_CHANGE_RIDE_SKILL            = opCodes.GAME_MSG_RIDE_BEGIN + 29	//修改使用中的坐骑技能列表
// opCodes.C2G_RIDE_AUTO_FEED               = opCodes.GAME_MSG_RIDE_BEGIN + 30 //坐骑自动喂养
// opCodes.C2G_RIDE_AUTO_FEED_INFO          = opCodes.GAME_MSG_RIDE_BEGIN + 31 //坐骑自动喂养返回
// opCodes.G2C_RIDE_AUTO_FEED_INFO          = opCodes.GAME_MSG_RIDE_BEGIN + 32 //坐骑自动喂养返回
// opCodes.C2G_RIDE_CANCEL_AUTO_FEED        = opCodes.GAME_MSG_RIDE_BEGIN + 33 //取消坐骑自动喂养
// opCodes.G2C_RIDE_PLAYER_SET              = opCodes.GAME_MSG_RIDE_BEGIN + 34 //乘坐更新主角信息
// opCodes.G2C_RIDE_UPDATE_INFO             = opCodes.GAME_MSG_RIDE_BEGIN + 35 //更新单个坐骑信息
// opCodes.G2C_RIDE_ADD                     = opCodes.GAME_MSG_RIDE_BEGIN + 36 //增加坐骑
// opCodes.G2C_RIDE_DROP                    = opCodes.GAME_MSG_RIDE_BEGIN + 37 //删除坐骑

// //职业
// opCodes.G2C_VOCATIONERS_LIST             = opCodes.GAME_MSG_VOCATION_BEGIN + 1  //职业列表
// //opCodes.G2C_VOCATIONER_ADD               = opCodes.GAME_MSG_VOCATION_BEGIN + 2  //添加职业
// opCodes.C2G_VOCATIONER_SET               = opCodes.GAME_MSG_VOCATION_BEGIN + 3  //设置当前使用的职业
// opCodes.G2C_VOCATIONER_SET               = opCodes.GAME_MSG_VOCATION_BEGIN + 4  //设置当前使用的职业
// opCodes.G2C_VOCATIONER_UNLOCK            = opCodes.GAME_MSG_VOCATION_BEGIN + 5  //职业解锁
// opCodes.C2G_VOCATIONER_UNLOCK            = opCodes.GAME_MSG_VOCATION_BEGIN + 6  //职业解锁
// opCodes.G2C_VOCATIONER_UPGRADE_SKILL     = opCodes.GAME_MSG_VOCATION_BEGIN + 7  //升级技能
// opCodes.C2G_VOCATIONER_UPGRADE_SKILL     = opCodes.GAME_MSG_VOCATION_BEGIN + 8  //升级技能
// opCodes.G2C_VOCATIONER_SET_SKILL         = opCodes.GAME_MSG_VOCATION_BEGIN + 9  //设置技能
// opCodes.C2G_VOCATIONER_SET_SKILL         = opCodes.GAME_MSG_VOCATION_BEGIN + 10 //设置技能
// opCodes.G2C_VOCATION_UPDATE_FIELD        = opCodes.GAME_MSG_VOCATION_BEGIN + 11 //职业属性部分更新
// opCodes.G2C_VOCATION_UPDATE              = opCodes.GAME_MSG_VOCATION_BEGIN + 12 //职业属性全部更新
// opCodes.G2C_VOCATIONER_INFO              = opCodes.GAME_MSG_VOCATION_BEGIN + 13 //职业信息
// opCodes.C2G_VOCATIONER_INFO              = opCodes.GAME_MSG_VOCATION_BEGIN + 14 //职业信息
// opCodes.G2C_SET_VOCATIONER_INFO          = opCodes.GAME_MSG_VOCATION_BEGIN + 15 //当前设置的职业信息
// opCodes.G2C_SET_VOCATIONER_COOLDOWN      = opCodes.GAME_MSG_VOCATION_BEGIN + 16 //设置的职业冷切时间
// opCodes.C2G_SET_DOG_QUALITY_LEVLE        = opCodes.GAME_MSG_VOCATION_BEGIN + 17 //设置狗模型
// opCodes.C2G_VOCATION_ONE_KEY_SKILL_UP    = opCodes.GAME_MSG_VOCATION_BEGIN + 18 //一键升级技能


// //partner vocation common
// //opCodes.C2G_ACTOR_NATRUAL_STONE_UP       = opCodes.GAME_MSG_ACTOR_BEGIN + 2 //天赋石升级
// //opCodes.C2G_ACTOR_SET_EQUIP              = opCodes.GAME_MSG_ACTOR_BEGIN + 3 //脱装备
// //opCodes.C2G_ACTOR_OFF_EQUIP              = opCodes.GAME_MSG_ACTOR_BEGIN + 4 //穿装备
// //opCodes.C2G_ACTOR_SET_NATRUAL_STONE      = opCodes.GAME_MSG_ACTOR_BEGIN + 5 //镶嵌天赋石
// //opCodes.C2G_ACTOR_OFF_NATRUAL_STONE      = opCodes.GAME_MSG_ACTOR_BEGIN + 6 //卸下天赋石
// //opCodes.G2C_ACTOR_EQUIP_LIST             = opCodes.GAME_MSG_ACTOR_BEGIN + 7 //装备列表
// //opCodes.C2G_ACTOR_GROW_SIMPLE            = opCodes.GAME_MSG_ACTOR_BEGIN + 8 //成长系统的信息//
// //opCodes.G2C_ACTOR_GROW_SIMPLE            = opCodes.GAME_MSG_ACTOR_BEGIN + 9 //成长系统的信息//
// //opCodes.C2G_ACTOR_GROW_CHANNELS          = opCodes.GAME_MSG_ACTOR_BEGIN +	10//所有正在进行的交互//
// //opCodes.G2C_ACTOR_GROW_CHANNELS          = opCodes.GAME_MSG_ACTOR_BEGIN +	11//所有正在进行的交互//
// ////opCodes.G2C_ACTOR_GROW_NEW_CHANNEL
// //opCodes.C2G_ACTOR_GROW_SELECT_ACTION     = opCodes.GAME_MSG_ACTOR_BEGIN + 12//选择一个互动的结果
// //opCodes.G2C_ACTOR_GROW_SELECT_ACTION     = opCodes.GAME_MSG_ACTOR_BEGIN + 13//选择一个互动的结果
// //opCodes.C2G_ACTOR_GROW_FINISH_SELECT     = opCodes.GAME_MSG_ACTOR_BEGIN + 14//完成了某个交互
// //opCodes.G2C_ACTOR_GROW_FINISH_SELECT     = opCodes.GAME_MSG_ACTOR_BEGIN + 15//完成了某个交互
// //opCodes.C2G_ACTOR_GROW_EVENTS            = opCodes.GAME_MSG_ACTOR_BEGIN + 16//所有正在进行的事件//
// //opCodes.G2C_ACTOR_GROW_EVENTS            = opCodes.GAME_MSG_ACTOR_BEGIN + 17//所有正在进行的事件//
// //opCodes.C2G_ACTOR_GROW_HANDLE_EVENT      = opCodes.GAME_MSG_ACTOR_BEGIN + 18//处理一个事件的结果
// //opCodes.G2C_ACTOR_GROW_HANDLE_EVENT      = opCodes.GAME_MSG_ACTOR_BEGIN + 19//处理一个事件的结果
// //opCodes.C2G_ACTOR_GROW_NEW_EVENT         = opCodes.GAME_MSG_ACTOR_BEGIN + 20//得到一个新的事件
// //opCodes.G2C_ACTOR_GROW_NEW_EVENT         = opCodes.GAME_MSG_ACTOR_BEGIN + 21//得到一个新的事件
// //opCodes.C2G_ACTOR_LAST_SELECT_ID         = opCodes.GAME_MSG_ACTOR_BEGIN + 22//上一次的互动提示id
// //opCodes.G2C_ACTOR_LAST_SELECT_ID         = opCodes.GAME_MSG_ACTOR_BEGIN + 23//上一次的互动提示id
// //opCodes.C2G_ACTOR_GROW_VALUE             = opCodes.GAME_MSG_ACTOR_BEGIN + 24//发送某个伙伴或主角的成性属性
// //opCodes.G2C_ACTOR_GROW_VALUE             = opCodes.GAME_MSG_ACTOR_BEGIN + 25//发送某个伙伴或主角的成性属性
// //opCodes.C2G_ACTOR_All_GROW_VALUE         = opCodes.GAME_MSG_ACTOR_BEGIN + 26//发送所有伙伴和主角的成性属性
// //opCodes.G2C_ACTOR_All_GROW_VALUE         = opCodes.GAME_MSG_ACTOR_BEGIN + 27//发送所有伙伴和主角的成性属性


// //partner vocation common
// opCodes.C2G_NATRUAL_STONE_UP                = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 1 //天赋石升级
// opCodes.G2C_NATRUAL_STONE_UP                = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 2 //天赋石升级
// opCodes.C2G_SET_NATRUAL_STONE               = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 3 //镶嵌天赋石
// opCodes.G2C_SET_NATRUAL_STONE               = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 4 //镶嵌天赋石
// opCodes.C2G_OFF_NATRUAL_STONE               = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 5 //卸下天赋石
// opCodes.G2C_OFF_NATRUAL_STONE               = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 6 //卸下天赋石
// opCodes.C2G_SET_EQUIP                       = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 7 //穿装备
// opCodes.C2G_OFF_EQUIP                       = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 8 //脱装备
// opCodes.G2C_EQUIP_LIST                      = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 9 //装备列表
// opCodes.G2C_GROW_SYS_INFO                   = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 10 //成长系统的信息//
// opCodes.G2C_GROW_INFO_LIST                  = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 11 //所有伙伴或主角的成长的信息//
// opCodes.G2C_GROW_INFO                       = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 12 //某个伙伴或主角的成长的信息//
// opCodes.C2G_GROW_SELECT_ACTION              = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 13//选择一个互动的结果
// opCodes.G2C_GROW_SELECT_ACTION              = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 14//选择一个互动的结果
// opCodes.C2G_GROW_SOON_FINISH                = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 15//买断完成交互的时间
// opCodes.G2C_GROW_SOON_FINISH                = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 16//买断完成交互的时间
// opCodes.G2C_GROW_FINISH_CHANNEL             = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 17//自然完成了某个交互
// opCodes.C2G_GROW_HANDLE_EVENT               = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 18//处理一个事件的结果
// opCodes.G2C_GROW_HANDLE_EVENT               = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 19//处理一个事件的结果
// opCodes.G2C_GROW_NEW_EVENT                  = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 20//得到一个新的事件
// opCodes.C2G_GROW_BUY_LIVE                   = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 21//买体力值
// opCodes.G2C_GROW_BUY_LIVE                   = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 22//买体力值返回
// opCodes.G2C_GROW_AUTO_ADD_LIVE              = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 23//自动增加体力值
// opCodes.G2C_GROW_FINISH_ACTION              = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 24//完成互动
// opCodes.G2C_DROP_PARTNER_OR_VOCATION        = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 25//丢掉伙伴或者职业
// opCodes.G2C_DELETE_GROW_INFO                = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 26//删除某个伙伴或者职业的成长信息
// opCodes.C2G_GROW_CAN_FINISH_CHANNEL         = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 27//是否可以完成某个交互
// opCodes.C2G_GROW_GET_FEELING_GIFT           = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 28//领取心情奖励
// opCodes.C2G_GROW_FEELING_GIFT               = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 29//申请心情奖励记录
// opCodes.G2C_GROW_FEELING_GIFT               = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 30//心情奖励记录
// //神兽
// opCodes.C2G_GODANIMAL_LEVEL_UP              = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 31//神兽信息申请
// opCodes.C2G_GODANIMAL_INFO                  = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 32//神兽信息申请
// opCodes.G2C_GODANIMAL_INFO                  = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 33//神兽信息申请
// opCodes.G2C_GODANIMAL_PREVIEW_FORCE         = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 34//神兽战力预览
// opCodes.G2C_GODANIMAL_EXPER                 = opCodes.GAME_MSG_PARTNER_VOCATION_BEGIN + 35//神兽体验

// //雇佣
// opCodes.C2G_SELF_EMPLOIES_LIST           = opCodes.GMAE_MSG_EMPLOY_BEGIN + 1  //自己的租入列表
// opCodes.G2C_SELF_EMPLOIES_LIST           = opCodes.GMAE_MSG_EMPLOY_BEGIN + 2  //自己的租入列表
// opCodes.C2G_SELF_EMPLOIES_INFO           = opCodes.GMAE_MSG_EMPLOY_BEGIN + 3  //自己的租入列表详细
// opCodes.G2C_SELF_EMPLOIES_INFO           = opCodes.GMAE_MSG_EMPLOY_BEGIN + 4  //自己的租入列表详细
// opCodes.G2C_SYS_EMPLOIES_LIST            = opCodes.GMAE_MSG_EMPLOY_BEGIN + 5  //所有出租列表
// opCodes.C2G_SYS_EMPLOIES_LIST            = opCodes.GMAE_MSG_EMPLOY_BEGIN + 6  //所有出租列表
// opCodes.C2G_RENT_EMPLOIES_INFO           = opCodes.GMAE_MSG_EMPLOY_BEGIN + 7  //出租伙伴/角色详细
// opCodes.G2C_RENT_EMPLOIES_INFO            = opCodes.GMAE_MSG_EMPLOY_BEGIN + 8  //所有出租列表详细
// opCodes.C2G_RENT_OUT_EMPLOIES            = opCodes.GMAE_MSG_EMPLOY_BEGIN + 9  //出租
// //opCodes.G2C_RENT_OUT_EMPLOIES            = opCodes.GMAE_MSG_EMPLOY_BEGIN + 10 //出租
// opCodes.C2G_RENT_IN_EMPLOIES             = opCodes.GMAE_MSG_EMPLOY_BEGIN + 11 //租入
// opCodes.C2G_RENT_EMPLOIES_CHEAK 				 = opCodes.GMAE_MSG_EMPLOY_BEGIN + 12 //公会雇佣租入核准
// opCodes.C2G_RENT_EMPLOIES_APPLY				   = opCodes.GMAE_MSG_EMPLOY_BEGIN + 13 //雇佣申请
// opCodes.C2G_CANCEL_OUT_EMPLOIES          = opCodes.GMAE_MSG_EMPLOY_BEGIN + 14 //取消出租
// opCodes.C2G_CANCEL_EMPLOIES_APPLY  			 = opCodes.GMAE_MSG_EMPLOY_BEGIN + 15 //取消雇佣申请
// opCodes.C2G_CANCEL_IN_EMPLOIES           = opCodes.GMAE_MSG_EMPLOY_BEGIN + 16 //取消租入
// opCodes.C2G_SELF_EMPLOIES_OUT_LIST       = opCodes.GMAE_MSG_EMPLOY_BEGIN + 17 //自己的出租列表
// opCodes.G2C_SELF_EMPLOIES_OUT_LIST       = opCodes.GMAE_MSG_EMPLOY_BEGIN + 18 //自己的出租列表
// opCodes.G2C_RENT_EMPLOIES_APPLY_LIST  	 = opCodes.GMAE_MSG_EMPLOY_BEGIN + 19 //会长审核雇佣申请列表
// opCodes.C2G_RENT_EMPLOIES_APPLY_LIST 		 = opCodes.GMAE_MSG_EMPLOY_BEGIN + 20 //会长主动雇佣请求申请列表
// opCodes.G2C_SELF_EMPLOIES_APPLY_LIST		 = opCodes.GMAE_MSG_EMPLOY_BEGIN + 21 //自己申请列表
// opCodes.C2G_SELF_EMPLOIES_APPLY_LIST		 = opCodes.GMAE_MSG_EMPLOY_BEGIN + 22 //客户端请求自己申请列表
// opCodes.G2C_RENT_EMPLOIES_APPLY				   = opCodes.GMAE_MSG_EMPLOY_BEGIN + 23 //雇佣申请返回


// opCodes.G2C_ACTOR_ROLE_INFO_LIST					= opCodes.GMAE_MSG_ROLE_BEGIN + 1 //角色装备列表
// opCodes.G2C_ACTOR_ROLE_INFO							= opCodes.GMAE_MSG_ROLE_BEGIN + 2 //角色装备列表
// opCodes.G2C_ACTOR_ROLE_UPDATE					    = opCodes.GMAE_MSG_ROLE_BEGIN + 3 //角色信息
// opCodes.C2G_ACTOR_ROLE_UPGRADE						= opCodes.GMAE_MSG_ROLE_BEGIN + 4 //升级

// //opCodes.G2C_ACTOR_ROLE_SKILL_LEVEL_LIST				= opCodes.GMAE_MSG_ROLE_BEGIN + 21 //角色技能等级
// opCodes.C2G_ACTOR_ROLE_SKILL_UPGRADE_ONE			= opCodes.GMAE_MSG_ROLE_BEGIN + 21 //升级一个
// opCodes.C2G_ACTOR_ROLE_SKILL_UPGRADE_MUCH			= opCodes.GMAE_MSG_ROLE_BEGIN + 22 //升级多个
// opCodes.C2G_ACTOR_ROLE_SKILL_ORDER_UP				= opCodes.GMAE_MSG_ROLE_BEGIN + 23 //角色技能次序上升一个位
// opCodes.C2G_ACTOR_ROLE_TITLE_UNLOCK					= opCodes.GMAE_MSG_ROLE_BEGIN + 24 //解锁称号
// opCodes.C2G_ACTOR_ROLE_TITLE_SET					= opCodes.GMAE_MSG_ROLE_BEGIN + 25 //设置当前称号
// opCodes.C2G_ACTOR_ROLE_FASHION_UNLOCK				= opCodes.GMAE_MSG_ROLE_BEGIN + 26 //解锁时装
// opCodes.C2G_ACTOR_ROLE_FASHION_SET					= opCodes.GMAE_MSG_ROLE_BEGIN + 27 //设置当前时装


// //opCodes.G2C_ACTOR_ROLE_EQUIP_LIST					= opCodes.GMAE_MSG_ROLE_BEGIN + 1 //角色装备列表
// //opCodes.C2G_ACTOR_ROLE_INFO_EQUIP_SET				= opCodes.GMAE_MSG_ROLE_BEGIN + 2 //换装备
// //opCodes.G2C_ACTOR_ROLE_INFO_EQUIP_SET				= opCodes.GMAE_MSG_ROLE_BEGIN + 3 //
// //opCodes.G2C_ACTOR_ROLE_INFO_UPDATE					= opCodes.GMAE_MSG_ROLE_BEGIN + 4 //角色信息
// //opCodes.C2G_ACTOR_ROLE_INFO_UPGRADE					= opCodes.GMAE_MSG_ROLE_BEGIN + 5 //升级

// //opCodes.G2C_ACTOR_ROLE_SKILL_LEVEL_LIST				= opCodes.GMAE_MSG_ROLE_BEGIN + 21 //角色技能等级
// //opCodes.C2G_ACTOR_ROLE_SKILL_UPGRADE_ONE			= opCodes.GMAE_MSG_ROLE_BEGIN + 22 //升级一个
// //opCodes.C2G_ACTOR_ROLE_SKILL_UPGRADE_MUCH			= opCodes.GMAE_MSG_ROLE_BEGIN + 23 //升级多个
// //opCodes.G2C_ACTOR_ROLE_SKILL_LEVEL_UPGRADE			= opCodes.GMAE_MSG_ROLE_BEGIN + 24 //
// //pCodes.C2G_ACTOR_ROLE_SKILL_ORDER_LIST				= opCodes.GMAE_MSG_ROLE_BEGIN + 25 //角色技能次序
// //opCodes.G2C_ACTOR_ROLE_SKILL_ORDER_LIST				= opCodes.GMAE_MSG_ROLE_BEGIN + 26 //
// //opCodes.C2G_ACTOR_ROLE_SKILL_ORDER_UP				= opCodes.GMAE_MSG_ROLE_BEGIN + 27 //角色技能次序上升一个
// //opCodes.G2C_ACTOR_ROLE_SKILL_ORDER_UP				= opCodes.GMAE_MSG_ROLE_BEGIN + 28 //


// opCodes.G2C_ACTOR_PET_INFO_LIST						= opCodes.GMAE_MSG_ROLE_BEGIN + 41 //宠物列表
// opCodes.G2C_ACTOR_PET_INFO							= opCodes.GMAE_MSG_ROLE_BEGIN + 42 //更新
// opCodes.G2C_ACTOR_PET_UPDATE						= opCodes.GMAE_MSG_ROLE_BEGIN + 43 //更新
// opCodes.C2G_ACTOR_PET_UNLOCK						= opCodes.GMAE_MSG_ROLE_BEGIN + 44 //升级
// opCodes.C2G_ACTOR_PET_UPGRADE						= opCodes.GMAE_MSG_ROLE_BEGIN + 45 //升级
// opCodes.C2G_ACTOR_PET_COMBAT_SET					= opCodes.GMAE_MSG_ROLE_BEGIN + 46 //上战
// opCodes.C2G_ACTOR_PET_SHOW							= opCodes.GMAE_MSG_ROLE_BEGIN + 47 //展示到世界聊天
// opCodes.C2G_ACTOR_PET_GROW_UP						= opCodes.GMAE_MSG_ROLE_BEGIN + 48 //资质升级
// opCodes.C2G_ACTOR_PET_RENAME						= opCodes.GMAE_MSG_ROLE_BEGIN + 49 //改名
// opCodes.G2C_ACTOR_PET_SKILL_LIST					= opCodes.GMAE_MSG_ROLE_BEGIN + 50 //技能列表
// opCodes.C2G_ACTOR_PET_SKILL_WASH					= opCodes.GMAE_MSG_ROLE_BEGIN + 51 //洗技能
// opCodes.G2C_ACTOR_PET_SKILL_WASH					= opCodes.GMAE_MSG_ROLE_BEGIN + 52 //
// opCodes.C2G_ACTOR_PET_SKILL_ACCEPT					= opCodes.GMAE_MSG_ROLE_BEGIN + 53 //接受洗出来的技能
                                                                                     
// opCodes.G2C_ACTOR_XIANLV_INFO_LIST					= opCodes.GMAE_MSG_ROLE_BEGIN + 61 //宠物列表
// opCodes.G2C_ACTOR_XIANLV_ADD						= opCodes.GMAE_MSG_ROLE_BEGIN + 62 //更新
// opCodes.G2C_ACTOR_XIANLV_UPDATE						= opCodes.GMAE_MSG_ROLE_BEGIN + 63 //更新
// opCodes.C2G_ACTOR_XIANLV_UPGRADE					= opCodes.GMAE_MSG_ROLE_BEGIN + 64 //升级
// opCodes.C2G_ACTOR_XIANLV_COMBAT_SET					= opCodes.GMAE_MSG_ROLE_BEGIN + 65 //上战
// opCodes.C2G_ACTOR_XIANLV_UP_START					= opCodes.GMAE_MSG_ROLE_BEGIN + 66 //升星


// //角色宠物仙侣模板通用协议 这些协议和玩法有关，和具体的某一个宠物或仙侣无关
// opCodes.C2G_TEMPCELLFUN_STAGE_UP				= opCodes.GMAE_MSG_RPX_BEGIN + 1 //升阶
// opCodes.C2G_TEMPCELLFUN_SKIN_UNLOCK				= opCodes.GMAE_MSG_RPX_BEGIN + 2 //皮肤解锁
// opCodes.C2G_TEMPCELLFUN_SKIN_SET				= opCodes.GMAE_MSG_RPX_BEGIN + 3 //皮肤设置(幻化)
// opCodes.C2G_TEMPCELLFUN_SHAPE_SET				= opCodes.GMAE_MSG_RPX_BEGIN + 4 //外形设置(幻化)
// opCodes.C2G_TEMPCELLFUN_SKILL_UP				= opCodes.GMAE_MSG_RPX_BEGIN + 5 //技能升级
// opCodes.C2G_TEMPCELLFUN_EQUIP_SET				= opCodes.GMAE_MSG_RPX_BEGIN + 6 //换装备
// opCodes.C2G_TEMPCELLFUN_DRUG_USE				= opCodes.GMAE_MSG_RPX_BEGIN + 7 //使用属性丹
                                                                               
// opCodes.G2C_TEMP_CELL_LIST						= opCodes.GMAE_MSG_RPX_BEGIN + 20 //所有的模板单元

// opCodes.C2G_ROLE_RIDE_INFO						= opCodes.GMAE_MSG_RPX_BEGIN + 21 //角色坐骑
// opCodes.G2C_ROLE_RIDE_INFO						= opCodes.GMAE_MSG_RPX_BEGIN + 22 //
// opCodes.G2C_ROLE_RIDE_INFO_UPDATE				= opCodes.GMAE_MSG_RPX_BEGIN + 23 //
// opCodes.C2G_ROLE_WING_INFO						= opCodes.GMAE_MSG_RPX_BEGIN + 24 //角色翅膀
// opCodes.G2C_ROLE_WING_INFO						= opCodes.GMAE_MSG_RPX_BEGIN + 25 //
// opCodes.G2C_ROLE_WING_INFO_UPDATE				= opCodes.GMAE_MSG_RPX_BEGIN + 26 //
                                                                   
// opCodes.C2G_PET_TONGLIN_INFO					= opCodes.GMAE_MSG_RPX_BEGIN + 41 //宠物通灵
// opCodes.G2C_PET_TONGLIN_INFO					= opCodes.GMAE_MSG_RPX_BEGIN + 42 //
// opCodes.G2C_PET_TONGLIN_INFO_UPDATE				= opCodes.GMAE_MSG_RPX_BEGIN + 43 //
// opCodes.C2G_PET_SOUHUN_INFO						= opCodes.GMAE_MSG_RPX_BEGIN + 44 //宠物兽魂
// opCodes.G2C_PET_SOUHUN_INFO						= opCodes.GMAE_MSG_RPX_BEGIN + 45 //
// opCodes.G2C_PET_SOUHUN_INFO_UPDATE				= opCodes.GMAE_MSG_RPX_BEGIN + 46 //

// opCodes.C2G_XIANLV_FAZHEN_INFO					= opCodes.GMAE_MSG_RPX_BEGIN + 61 //仙侣法阵
// opCodes.G2C_XIANLV_FAZHEN_INFO					= opCodes.GMAE_MSG_RPX_BEGIN + 62 //
// opCodes.G2C_XIANLV_FAZHEN_INFO_UPDATE			= opCodes.GMAE_MSG_RPX_BEGIN + 63 //
// opCodes.C2G_XIANLV_XIANWEI_INFO					= opCodes.GMAE_MSG_RPX_BEGIN + 64 //仙侣仙位
// opCodes.G2C_XIANLV_XIANWEI_INFO					= opCodes.GMAE_MSG_RPX_BEGIN + 65 //
// opCodes.G2C_XIANLV_XIANWEI_INFO_UPDATE			= opCodes.GMAE_MSG_RPX_BEGIN + 66 //

// opCodes.C2G_TIANXIAN_INFO						= opCodes.GMAE_MSG_RPX_BEGIN + 81 //天仙
// opCodes.G2C_TIANXIAN_INFO						= opCodes.GMAE_MSG_RPX_BEGIN + 82 //
// opCodes.G2C_TIANXIAN_INFO_UPDATE				= opCodes.GMAE_MSG_RPX_BEGIN + 83 //
// opCodes.C2G_TIANXIAN_WEAPON_INFO				= opCodes.GMAE_MSG_RPX_BEGIN + 84 //天仙神兵
// opCodes.G2C_TIANXIAN_WEAPON_INFO				= opCodes.GMAE_MSG_RPX_BEGIN + 85 //
// opCodes.G2C_TIANXIAN_WEAPON_INFO_UPDATE			= opCodes.GMAE_MSG_RPX_BEGIN + 86 //

// opCodes.C2G_TIANV_HUANIAN_INFO					= opCodes.GMAE_MSG_RPX_BEGIN + 101 //天女花辇
// opCodes.G2C_TIANV_HUANIAN_INFO					= opCodes.GMAE_MSG_RPX_BEGIN + 102 //
// opCodes.G2C_TIANV_HUANIAN_INFO_UPDATE			= opCodes.GMAE_MSG_RPX_BEGIN + 103 //
// opCodes.C2G_TIANV_LINGQI_INFO					= opCodes.GMAE_MSG_RPX_BEGIN + 104 //天女灵气
// opCodes.G2C_TIANV_LINGQI_INFO					= opCodes.GMAE_MSG_RPX_BEGIN + 105 //
// opCodes.G2C_TIANV_LINGQI_INFO_UPDATE			= opCodes.GMAE_MSG_RPX_BEGIN + 106 //

// global
opCodes.G2C_GLOBAL_SERVERLEVEL           = opCodes.GAME_MSG_GLOBAL_BEGIN + 1 //服务器卡等级信息
opCodes.C2G_GLOBAL_CAMPAIGN_FORCE        = opCodes.GAME_MSG_GLOBAL_BEGIN + 2 //关卡信息
opCodes.G2C_GLOBAL_CAMPAIGN_FORCE        = opCodes.GAME_MSG_GLOBAL_BEGIN + 3 //关卡信息
opCodes.G2C_GLOBAL_SERVER_EVENT          = opCodes.GAME_MSG_GLOBAL_BEGIN + 4 //服务器事件
opCodes.G2C_GLOBAL_GROUP_EVENT           = opCodes.GAME_MSG_GLOBAL_BEGIN + 5 //组内事件
opCodes.G2C_GLOBAL_SERVER_STAR_TIME      = opCodes.GAME_MSG_GLOBAL_BEGIN + 6 //开服时间
opCodes.G2C_GLOBAL_SERVER_PET_ADVANCEEX  = opCodes.GAME_MSG_GLOBAL_BEGIN + 7 //攻略提醒
opCodes.G2C_GLOBAL_LOGOUT_CENTER         = opCodes.GAME_MSG_GLOBAL_BEGIN + 8 //强制退出跨服
opCodes.G2C_GLOBAL_SERVER_RIDE_ADVANCEEX = opCodes.GAME_MSG_GLOBAL_BEGIN + 9 //坐骑邀请攻略提醒
opCodes.C2G_GLOBAL_CELEBRATE_ONE_YEAR    = opCodes.GAME_MSG_GLOBAL_BEGIN + 10 //周年庆活动
opCodes.G2C_GLOBAL_CELEBRATE_ONE_YEAR    = opCodes.GAME_MSG_GLOBAL_BEGIN + 11 //周年庆活动
opCodes.C2G_GLOBAL_CELEBRATE_ONE_YEAR2   = opCodes.GAME_MSG_GLOBAL_BEGIN + 12 //周年庆活动
opCodes.G2C_GLOBAL_CELEBRATE_ONE_YEAR2   = opCodes.GAME_MSG_GLOBAL_BEGIN + 13 //周年庆活动

let packetHandler:any = {}
let opCodesName:any = {}
for(let k in opCodes){
			let v = opCodes[k]
	
	opCodesName[v] = k
}