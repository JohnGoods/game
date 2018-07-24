//好友系统
let friendOptions:any = {
	maxFriendCount   : 50,  // 最大的好友数量
	maxBlackFriend	 : 50,  // 最大黑名单好友数量
	maxFGcount       : 10,  // 最大的联系组数量（不包含默认的两个联系组）
	addFriendOK      : 0,   // 允许任何添加好友
	addFriendAgree   : 1,   // 需要验证才能添加做为好友
	addFriendRefuse  : 2,   // 拒绝任何人添加好友
	acceptMessage    : 0,   // 接受别人的信息
	refuseMessage    : 1,   // 拒绝陌生人的信息
	maxFGNameLength  : 21,  // 组名最大是14
	canShow					 : 22,	// 是否显示			// 删除的好友不发送到客户端，但存在
	FINDFRIENDBYID   : 23,  // 用ID查找朋友
	FINDFRIENDBYNAME : 24,  // 用名字查找朋友
}

let friendTableOption:any = {
	NAME       : 1,   // 名字
	//ICON     : 2,   // 头像
	GROUPID    : 3,   // 联系组ID		PS: 1好友 2陌生人
	FRIENDSHIP : 4,   // 缘分值
	SEX        : 5,   // 性别
	ONLINE     : 6,   // 线上时间
	LOGIN      : 7,   // 上线时间(不保存数据库)
	//COMMENT    : 8,   // 好友备注
	FACTION    : 9,   // 帮派
	//SCHOOL   : 10,  // 门派
	ISONLINE   : 11,  // 是否在线   PS: 1 在线 0不在线
	LEVEL      : 12,  // 等级
	//SHOW     : 13,  // 是否显示		PS: 1 显示，0 不显示	// 删除的好友不发送到客户端，但存在
	VOCATION   : 14,  // 模型
	RELATION   : 15,  // 对方与你的关系			0 无 1 好友 2 陌生人
	//MOVETIME : 16,  // 移组的时间 名单排序
	STATE      : 17,  //添加好友状态
	FORCE      : 18,  //战力
	VIPLEVEL   : 19,  //vip
	ICON       : 20,  //头像
}

// 好友组的属性
let friendGroupOption:any = {
	ID 						: 1,		// Id
	NAME 					: 2,		// 名字
}

// 默认好友组
let friendGroupId:any = {
	FRIEND	: 1,					// 好友
	TEMP		: 2,					// 临时
	BLACK		: 3,					//黑名单
}

//离线消息种类 
let messageOption:any = {
	TALKIM       : 1,  // 对话
	SYSTEMIM     : 2,  // 系统消息
	OPCODE       : 3,  // 系统留言更新(不需要发送到客户端)
	MAXTALKCOUNT : 50, // 离线留言不能超过这个数字
}

// 增加好友度类型
let addFriendShipType:any = {
	FLOWER	: 1 ,		//送花方式
	COMBAT	: 2	,		//组队作战
	TASK		: 3 ,		//任务方式
}

////////////////////////////new////////////////////////////
let RelationShip:any = {
	Stranger 						:	1,				//陌生人
	BestFriend					: 2,				//挚友
	Lover								: 3,				//情人
	Couple							: 4,				//夫妻
}

let opCard:any = {
	show 						: 1,		//是否可见 1可见0不可见
	qq							: 2, 		//qq
	weixin					: 3,		//微信
	phone           : 4,    //手机
}

//邀请列表类型
let opInviteType:any = {
	faceBook      : 1,   //faceBook
	qq            : 2,   //qq
	weiXin        : 3,   //微信
}

let opInviteFriendConfig:any = {
	interval   : 10*24*3600,
}

//////////////////////-

//增加缘分值类型
let opFriendShipType:any = {
	Team        : 1,
	Online      : 2,
	Faction     : 3,
	Chat        : 4,
}

//缘分值增加量
let opFriendShipAddValue:any = {
	Team        : 1,
	Online      : 3,
	Faction     : 10,
	Chat        : 1, 
}

//缘分值增加最大量
let opFriendShipAddMaxValue:any = {
	[opFriendShipType.Team]        : 20,  //组队
	[opFriendShipType.Online]      : 144,  //在线
	[opFriendShipType.Faction]     : 10,  //军团
	[opFriendShipType.Chat]        : 10,  //聊天
}
////////////////////////////////

//////////////聊天组////////////////
let opChatGroupPost:any = {
	leader : 1,
	member : 2,
}

let opChatGroupConfig:any = {
	maxCount        : 500,
	level           : 20,
	createCount     : 5,
	realseTime      : 3*24*3600,
	friendShipTime  : 1800,
	plrCount        : 10,
	memberCount     : 10,
}

//////////////////////////////-结婚//////////////////////////////////
//婚礼条件
let opMarryCondition:any = {
    level          : 50,         //等级限制
    friendship     : 500,        //情缘值限制
	normalNeedItem :[40508, 1], //普通结婚需要消耗的物品
	luxuryNeedItem : [40509, 1], //豪华结婚需要消耗的物品
}

//爱慕值
let opValueOfLove:any = {
    dailyLimit : 25,   //每天增加的上限
    totalLimit : 2500, //爱慕值上限
}

//婚礼类型
let opWeddingType:any = {
    normalWedding : 1, //普通婚礼
    luxuryWedding : 2, //豪华婚礼
}

//离婚答复
let opDivorceReply:any = {
    agree  : 1, //同意
    reject : 2, //拒绝
}

//离婚条件常量
let opDivorceLimit:any = {
    rmbLimit      : 100, //强制离婚消耗晶石
    decFriendShip : 200, //离婚扣除的情缘值
}

//婚礼常量
let opWedding:any = {
    mapId              : defaultValue.DEFAULT_MAP2, //婚礼举行的地图
    candyEntryId       : 70021, //糖果ID
    carriagePauseCount : 8,     //马车停顿次数
    candyCreateCount   : 9,     //糖果创建个数
    candyPickLimit     : 5,     //每人每天可拾取的糖果数量
}

let opHomePageConfig:any = {
	MaxMessageLen : 150,
	MaxMessageCount : 20,
 LogEvent : {
		VISIT       : 0x0001,  //拜访
		PRAISE      : 0x0002,  //点赞
		FLOWERS     : 0x0008,  //送花
		MESSAGE     : 0x0010,  //留言
		POUND_EGG   : 0x0020,  //砸鸡蛋
	},
	MaxPraiseCount : 20,//每天点赞上限
	FlowerEntryId  : 20001, //鲜花ID
	EggEntryId     : 40026, //鸡蛋ID
	//FlowerAddCharm : 1, //增加魅力值
	//broadCount     : 99, //可以发送公告
	//CreateNpcCount : 999, //可以创建鲜花npc的数量
	//NpcCount       : 20, //鲜花npc数量
	//NpcLife        : 5*60, //鲜花存在时间
	//NpcEntryId     : 22004, //npcEntryId
	AnimationTime  : 5,    //动画表演时间
	IconDataStrLen : 1024, //头像二进制最大长度
	MaxLogFileCount : 10,  //日志条数
	//MaxItemCount   : 5,   //最多可以放置5种礼物
	ItemPrize      : 10,  //礼物的价格
	ItemEntryId    : 20002, //礼物EntryId
	EggToCharm     : 1,    //一个鸡蛋减少的魅力值
	AutoRecoverCharm : 5,  //自动恢复魅力值点数
	CharmMinValue : -1000,  //魅力最小值
}

//鲜花对应魅力值
let opFlowerCountToCharm:any = {
	[1]         : [0,    1],
	[11]        : [2,    11],
	[99]        : [20,   99],
	[999]       : [200,  999],
}

//好友赠送体力
let opFriendSendGift:any = {
	sendCount    : 15,   //赠送上限
	receiveCount : 10,   //接收上限
	veryCount    : 1,    //单人上限
	count        : 5,    //赠送体力点数
}