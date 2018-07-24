/*
作者:
    panjunhua   
	
创建时间：
   2015.8.6(周四)

意图：
   

公共接口：
   
*/
let FastJumpTypeList:any = {}
FastJumpTypeList.FIELD_CAMPAIGN 									= "guanka"				//关卡通用，不指定关卡ID	{"guanka"}
FastJumpTypeList.FIELD_APPOIN_CAMPAIGN 						= "zhidingguanka"	//指定关卡 {"zhidingguanka", campaignId}
FastJumpTypeList.FIELD_BROKENHISTORY							= "shengdi"				//圣地 {"shengdi"}
FastJumpTypeList.FIELD_INTEGRATION 								= "jifen"					//积分商城 {"jifen", 积分索引} 11 12
FastJumpTypeList.FIELD_SHOP 											= "shangcheng"		//商城购买{"shangcheng", entryId}
//FastJumpTypeList.FIELD_WORLDBOSS 									= "boss"					//世界boss {"boss"}
FastJumpTypeList.FIELD_ANSWERQUESTION 						= "dati"					//贵族答题 {"dati"}
FastJumpTypeList.FIELD_DECOMPOSE 									= "rongjie"				//溶解 {"rongjie"}
FastJumpTypeList.FIELD_SUMMON 										= "choujiang"			//抽将 {"choujiang"}
FastJumpTypeList.FIELD_SEALEDGROUND 							= "juntuan"				//军团副本 {"juntuan"}
FastJumpTypeList.FIELD_BUYJINBI										= "maijinbi"			//金币购买 {"maijinbi"}
FastJumpTypeList.FIELD_CHONGZHI										= "chongzhi"			//钻石购买 {"chongzhi"}
FastJumpTypeList.FIELD_SHOUTONG_GUANKA 						= "stguanka"			//关卡首通 {"stguanka"}
FastJumpTypeList.FIELD_SHOUTONG_SHILIANCHANG			= "stshilian"			//试练场首通 {"stshilian"}
FastJumpTypeList.FIELD_LIANSHENG_JINGJI						= "lsjingji"			//竞技场连胜 {"lsjingji"}
FastJumpTypeList.FIELD_SHOUTONG_JINGJI						= "stjingji"			//竞技场首次排名 {"stjingji"}
FastJumpTypeList.FIELD_GONGHUIRUZHU								= "ruzhu"					//公会入驻 {"ruzhu"}
FastJumpTypeList.FIELD_LIAOTIAN										= "liaotian"			//聊天 {"liaotian"}
FastJumpTypeList.FIELD_MESSAGETIPS								= "tips"					//弹出文字提示 {"tips", "文字XXX"}
FastJumpTypeList.FIELD_FENXIANG										= "fenxiang"			//分享 {"fenxiang"}
FastJumpTypeList.FIELD_SONGTILI										= "songtili"			//赠送好友体力 {"songtili"}
FastJumpTypeList.FIELD_MAITILI										= "maitili"				//购买体力 {"maitili"}
FastJumpTypeList.FIELD_YANGCHENG									= "yangcheng"			//养成 {"yangcheng"}
FastJumpTypeList.FIELD_QIANDAO										= "qiandao"				//签到 {"qiandao"}
FastJumpTypeList.FIELD_ZHUJUEDENGJI								= "zhujuedengji"	//主角等级 {"zhujuedengji"}
FastJumpTypeList.FIELD_ZHIYE											= "zhiye"					//职业 {"zhiye"}
FastJumpTypeList.FIELD_ZHUANGBEI									= "zhuangbei"			//装备 {"zhuangbei"}
FastJumpTypeList.FIELD_YULING											= "yuling"				//御灵 {"yuling"}
FastJumpTypeList.FIELD_SHILIANCHANG								= "shilian"				//试练场 {"shilian"}
FastJumpTypeList.FIELD_JINGJI											= "jingji"				//竞技场 {"jingji"}
FastJumpTypeList.FIELD_QUICKUSE										= "shiyong"				//消耗道具 {"shiyong"}
FastJumpTypeList.FIELD_YUNYINGHUODONG								= "yunyinghuodong"				//运营活动中产出 {"yunyinghuodong"}
FastJumpTypeList.FIELD_MAIHUOLI										= "maihuoli"				//购买互动活力 {"maihuoli"}
FastJumpTypeList.FIELD_DIAMOND_SHANGCHENG					= "diashangcheng"	//晶石商城 {"diashangcheng", tabId}
FastJumpTypeList.FIELD_GONGHUI_CANGKU							= "gonghuicangku"	//公会仓库分配 {"gonghuicangku"}
FastJumpTypeList.FIELD_HANGHAI										= "hanghai"				//航海 {"hanghai"}
FastJumpTypeList.FIELD_XUEMENG										= "xuemeng"				//血盟 {"xuemeng"}
FastJumpTypeList.FIELD_HOMEPAGE										= "homepage"			//个人主页 {"homepage"}
FastJumpTypeList.FIELD_TIANTI										= "tianti"				//天梯 {"tianti"}
FastJumpTypeList.FIELD_ZHENYING										= "zhenying"			//众神之战 {"zhenying"}
FastJumpTypeList.FIELD_SDBOSS										= "sdboss"				//圣地boss {"sdboss"}


//////////////////////////////////////////////////////////------------西游------------//////////////////////////////////////////////
FastJumpTypeList.FIELD_SHOP_EQUIP                                   = "shop_equip"              //装备商城（装备、皇城福利、帮会、帮会福利）
FastJumpTypeList.FIELD_SHOP_YUANBAO                                 = "shop_yuanbao"            //元宝商城(元宝、绑元、宠物、仙侣)
FastJumpTypeList.FIELD_SHOP_ZHUANGBAN                               = "shop_zhuangban"          //装扮商城(装扮、皮肤、友情、威望)
FastJumpTypeList.FIELD_SHOP_JINGJI                                  = "shop_jingji"             //竞技（竞技、竞技福利、护送、答题）
FastJumpTypeList.FIELD_SHOP_GOBAL                                   = "shop_gobal"              //全民BOSS商店
FastJumpTypeList.FIELD_SHOP_SINGLE                                  = "shop_single"             //个人BOSS商店
FastJumpTypeList.FIELD_SHOP_DELINE                                  = "shop_deline"             //生死劫商店
FastJumpTypeList.FIELD_SHOP_MAT                                     = "shop_mat"                //材料商店
FastJumpTypeList.FIELD_MAT_COPY                                     = "mat_copy"                //材料副本（材料、秘境、皇城、三界）
FastJumpTypeList.FIELD_BOSS                                         = "boss"                    //BOSS（个人、全民、野外、生死劫）
FastJumpTypeList.FIELD_LUCKY                                        = "lucky"                   //寻宝（寻宝、幸运转盘）
FastJumpTypeList.FIELD_VIP                                          = "vip"                     //vip
FastJumpTypeList.FIELD_DAILY                                        = "daily"                   //日常
FastJumpTypeList.FIELD_SHITU                                        = "shitu"                   //师徒（）
FastJumpTypeList.FIELD_ACTIVITYLIST                                 = "activitylist"            //活动列表
FastJumpTypeList.FIELD_JINGYANYAOMO                                 = "jingyanyaomo"             //经验妖魔
FastJumpTypeList.FIELD_ZUDUIFUBEN                                   = "zuduifuben"               //组队副本
FastJumpTypeList.FIELD_BEIBAO                                       = "beibao"                   //背包
FastJumpTypeList.FIELD_RONGLIAN                                     = "ronglian"                 //背包熔炼
FastJumpTypeList.FIELD_CHAMPION                                     = "champion"                 //竞技场
FastJumpTypeList.FIELD_ESCORT                                       = "escort"                   //护送
FastJumpTypeList.FIELD_ROLE                                         = "role"                     //角色
FastJumpTypeList.FIELD_XIANLV                                       = "xianlv"                   //仙侣
FastJumpTypeList.FIELD_TIANXIAN                                     = "tianxian"                 //天仙
FastJumpTypeList.FIELD_PET                                          = "pet"                      //宠物
FastJumpTypeList.FIELD_TIANNV                                       = "tiannv"                   //天女
FastJumpTypeList.FIELD_SHOUCHONG                                    = "shouchong"                //首充(首充  = 1， 成长基金 = 23，投资计划 = 24，累计充值 = 9， 神宠来些 ： 44)
FastJumpTypeList.FIELD_KAIFU                                        = "kaifu"                    //开服
FastJumpTypeList.FIELD_CAIKUANG                                     = "caikuang"                //采矿
FastJumpTypeList.FIELD_HECHENG                                      = "hecheng"                 //合成
FastJumpTypeList.FIELD_HEISHI                                       = "shop_lianyaohu"                  //元宝黑市
FastJumpTypeList.FIELD_JUDIAN                                       = "judian"                  //据点
FastJumpTypeList.FIELD_PETMILV                                      = "pet_milu"