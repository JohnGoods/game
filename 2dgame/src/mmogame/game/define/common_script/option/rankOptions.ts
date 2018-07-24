////////////////////////////////////////////////////////////////////////////////
//排行
////////////////////////////////////////////////////////////////////////////////

//排行榜
let configRankType = {
	RANK_PLR_LEVEL                     : 1,  //等级排行
	RANK_DRAGON_BOSS                   : 2,   //龙王宝藏星排行
	RANK_PLR_FORCE                     : 3,   //战力排行
	RANK_HEAVEN_TRIAL                  : 4,   //天庭试炼排行榜
	RANK_SMALL_THUNDER                 : 5,   //小雷音寺排行榜
	RANK_PET_FORCE                     : 6,   //宠物最高战力排行
	//RANK_FACT_LEVEL                    : 7,  //军团等级排行
	//RANK_FACT_POINT                    : 8,	 //军团任务积分排行
	//RANK_FACT_FORCE                    : 9,	 //军团总战力排行
	//RANK_EQUIP_FORCE                   : 10, //装备最高战力
	//RANK_SKY_TOWER                     : 11, //天空之塔
	//RANK_PLR_CHARM                     : 12, //魅力值
	RANK_PLR_IMMORTALS                 : 13, //神兵等级
	RANK_XIAN_LV					   : 15,	//仙侣
	RANK_RIDE						   : 16,	//坐骑
	RANK_WING						   : 17,	//翅膀
	RANK_TIAN_XIAN					   : 18,	//天仙
	RANK_JJC						   :19,	//竞技场

	RANK_FA_ZHEN                       : 20,  //法阵
	RANK_XIAN_WEI                      : 21,  //仙位
	RANK_TONG_LING                     : 22,  //通灵
	RANK_SHOU_HUN                      : 23,  //兽魂
	RANK_TIAN_NV                       : 24,  //天女
	RANK_XIAN_QI                       : 25,  //仙器
	RANK_HUAN_NIAN                     : 26,  //花辇
	RANK_LING_QI                       : 27,  //灵气
	RANK_CAMPAIGN                      : 28,  //关卡进度
}

//冲服排行榜索引
let configPrizeRankKey:any = {
	RANK_PLR_LEVEL      : 1,
	RANK_PLR_FORCE      : 2,
	RANK_PLR_CHARM      : 4,
	RANK_CHAMPION       : 5,
	RANK_SKY_TOWER      : 6,
	RANK_FACT_LEVEL     : 7,
	RANK_PLR_IMMORTALS  : 9,
}