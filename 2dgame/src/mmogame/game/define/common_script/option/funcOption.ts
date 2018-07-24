//功能NPC对话跳转判断

// taskField.FIELD_CHECK_SCHOOL = taskField.FUNCTION_FIELD_BEGIN + 1	//100001
// taskField.FIELD_SHOE_SKILL = taskField.FUNCTION_FIELD_BEGIN + 2		//100002
// taskField.FIELD_LIVING_SKILL = taskField.FUNCTION_FIELD_BEGIN + 3	//100003
//角色功能类型
let GuideFuncDefine:any = {}
GuideFuncDefine.FIELD_FUNC_JINGJICHANG 											= "jingjichang"					//竞技场
GuideFuncDefine.FIELD_FUNC_ZUOQI												= "zuoqi"															//坐骑    
GuideFuncDefine.FIELD_FUNC_CAILIAOFUNBEN										= "cailiaofuben"                  //材料副本  
GuideFuncDefine.FIELD_FUNC_XIANLV												= "xianlv"                        //仙侣    
GuideFuncDefine.FIELD_FUNC_ZHUCHENG												= "zhucheng"                      //主城    
GuideFuncDefine.FIELD_FUNC_CHENGHAO												= "chenghao"                      //称号    
GuideFuncDefine.FIELD_FUNC_DOHAILONGGONG										= "longwangbaozang"               //东海龙宫  
GuideFuncDefine.FIELD_FUNC_XIAOLEIYINSI											= "xiaoleiyinsi"                  //小雷音寺  
GuideFuncDefine.FIELD_FUNC_KUAFU												= "global"                        //跨服    
GuideFuncDefine.FIELD_FUNC_SHIZHUANG											= "shizhuang"                     //时装    
GuideFuncDefine.FIELD_FUNC_XIYOULILIAN											= "xiyoulilian"                   //西游历练  
GuideFuncDefine.FIELD_FUNC_HUODONG												= "huodong"                       //活动    
GuideFuncDefine.FIELD_FUNC_TIANXIAN												= "tianxian"                      //天仙    
GuideFuncDefine.FIELD_FUNC_BANGHUI												= "gonghui"                       //帮会    
GuideFuncDefine.FIELD_FUNC_TIANTINGSHILIAN										= "tiantingshilian"               //天庭试炼  
GuideFuncDefine.FIELD_FUNC_SANSHENGSANSHI										= "sanshengsanshi"                //三生三世  
GuideFuncDefine.FIELD_FUNC_PAIHANGBANG											= "paihangbang"                   //排行帮   
GuideFuncDefine.FIELD_FUNC_DANYAO												= "danyao"                        //丹药    
GuideFuncDefine.FIELD_FUNC_SHENBING												= "shenbing"                      //神兵    
GuideFuncDefine.FIELD_FUNC_YEWAIBOSS											= "yewaiBOSS"                     //野外BOSS
GuideFuncDefine.FIELD_FUNC_CHIBANG												= "chibang"                       //翅膀    
GuideFuncDefine.FIELD_FUNC_FAZHEN												= "fazhen"                        //法阵    
GuideFuncDefine.FIELD_FUNC_XIANWEI												= "xianwei"                       //仙位    
GuideFuncDefine.FIELD_FUNC_TONGLING												= "tongling"                      //通灵    
GuideFuncDefine.FIELD_FUNC_SHOUHUN												= "shouhun"                       //兽魂    
GuideFuncDefine.FIELD_FUNC_JINGMAI												= "jingmai"                       //经脉    
GuideFuncDefine.FIELD_FUNC_TIANNV												= "tiannv"                        //天女    
GuideFuncDefine.FIELD_FUNC_SHENGSIJIE											= "shengsijie"                    //生死劫   
GuideFuncDefine.FIELD_FUNC_XIANQI												= "xianqi"                        //仙器    
GuideFuncDefine.FIELD_FUNC_HUANIAN												= "huanian"                       //花辇    
GuideFuncDefine.FIELD_FUNC_LINGQI												= "lingqi"                        //灵气    
GuideFuncDefine.FIELD_FUNC_FABAO1												= "fabao1"                        //法宝槽位1 
GuideFuncDefine.FIELD_FUNC_FABAO2												= "fabao2"                        //法宝槽位2 
GuideFuncDefine.FIELD_FUNC_FABAO3												= "fabao3"                        //法宝槽位3 
GuideFuncDefine.FIELD_FUNC_FABAO4												= "fabao4"     					  //法宝槽位4
GuideFuncDefine.FIELD_FUNC_XIYOUXIANGYAO                                        = "xiyouxiangyao" 
GuideFuncDefine.FIELD_FUNC_SHENZHUANG                                        	= "shenzhuang"                //西游降妖
GuideFuncDefine.FIELD_FUNC_JUDIAN                                               = "judian"                        //据点
GuideFuncDefine.FIELD_FUNC_XINGLING                                             = "xingling"                	  //星灵
// //角色功能设置（0为关闭状态；1为开启状态）
// let RoleFunctionSetting:any = {
// 		[GuideFuncDefine.FIELD_FUNC_HUODONG]					: 1,						//主菜单活动
// 		[GuideFuncDefine.FIELD_FUNC_JINGJICHANG] 				: 2,						//竞技场
// }

//功能红点提示
let OpFunctionNotice:any = {
	ChampionRecord                         :  1,                 //竞技场战斗记录
	HomePageFlower                         :  2,                 //主页送花
	HomePagePraise                         :  3,                 //主页点赞
	HomePageMessage                        :  4,                 //主页留言
	HomePageLog                            :  5,                 //主页日志
	HomePageEgg                            :  6,                 //主页砸鸡蛋
	CombatTeamApply                        :  7,                 //血盟申请
	//客户端用
	TeamApply                              :  100,               //组队申请
	LadderTeamApply                        :  101,               //天梯组队申请
}