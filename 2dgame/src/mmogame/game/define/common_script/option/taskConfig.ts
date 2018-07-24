////////////////////////////////////////////////////////////////////////////////
//任务配置
////////////////////////////////////////////////////////////////////////////////

//record 是否记录 默认false
//acceptCount  可接数量 默认1
//hoopLimit 环段限制

//见taskType定义
var taskConfig:any = {

	//taskType.Main
	[1] :
	{
		record : true,
	},
	
	//taskType.Branch
	[2] :
	{
		//record : true,
		acceptCount : 5,     //可以接5个
	},
	
	//taskType.School
	//[3] : 
	//{
	//	internalTips : "SHIMEM_INTERNAL",
	//	dayTimesTips : "SHIMEM_DAY",
	//},
	
	//taskType.HuSong
	//[7] : 
	//{
	//	failTips : "HUSONG_FAILED",
	//	accpetCountTips : "YABIAO_ACCEPT_COUNT",
	//},
	
	//taskType.TianShi
	//[8] : 
	//{
	//},
	
	//taskType.Cangbaotu
	//[10] : 
	//{
	//	dayTimesTips : "CANBAOTU_DAY",
	//	weekTimesTips : "CANBAOTU_WEEK",
	//},
	
	//taskType.XiuWeiPuTong
	//[14] :
	//{
	//	unAutoSetLoop : true, //不自动更新环数
	//},
	
	//taskType.FeiXingQi
	//[28] :
	//{
	//	
	//},
	
	//taskType.Special
	[100] : 
	{
		//record : true,
		acceptCount : 100,
	},
	
	//taskType.FactionJianZhu
	[25] :
	{
	},
	
	//taskType.FactionXuanWu
	[26] :
	{
	},
	[29] : 
	{
		acceptCount : 10,     //可以接10个
	},
	//taskType.FactionTask
	[30] : 
	{
	    //record : true,      //记录完成
		acceptCount : 1,    //可以接1个
	},
    //taskType.FactionItemTask 道具类军团任务
	[31] : 
	{
	    //record : true,      //记录完成
		acceptCount : 1,    //可以接1个
	},
	//taskType.FactionPubTask 道具类军团任务
	[32] : 
	{
	    //record : true,      //记录完成
		acceptCount : 1,    //可以接1个
	},
	//taskType.Fengmo      //封魔任务
	[33] :
	{
		//record = true,
		maxPrizeCount : 20,  //最大完成数量
		acceptCount : 1,    //可以接1个
	},
}

 
