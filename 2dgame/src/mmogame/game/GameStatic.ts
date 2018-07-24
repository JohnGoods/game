// TypeScript file


function initInstances() {
    var StaticInstanceMap = [

    SceneManager,
    ActorManager,

    //system
    MapSystem,
    ActivitySystem,
    BuffSystem,
    CampaignSystem,
    ClubSystem,
    FriendSystem,
    ItemSystem,
    LoginSystem,
    MailSystem,
    //modify:movie
    //MovieSystem,
    PetSystem,

    RoleSystem,
    SkillSystem,
    TeamSystem,
    PaySystem,
    VipSystem,
    FightSystem,
    TaskSystem,
    TaskListener,
    FastJumpSystem,
    GuideSystem,
    GuideFuncSystem,
    ShareSystem,

    FunSystem,
    XianLvSystem,
    ForgeSystem,

    TianXianSystem,
    ShopSystem,
    AntiCheatSystem,

];

    StaticInstanceMap.forEach(clazz => {
        if (clazz == null) {
            //TLog.Error("initInstances _G[%s] == nil ", name)
        } else {
            clazz.getInstance();
        }

    });
}



function _loadMessage(opDefs: any, startOp?: number, endOp?: number) {
    var factory: MessageFactory = MessageFactory.getInstance();
    startOp = startOp || -999999;
    endOp = endOp || 999999;

    let muduleName = "MessageLogic."
    for (var name in opDefs) {
        var id = opDefs[name];
        if (id >= startOp && id <= endOp) {
            var classname = "Message_" + name;
            var clazz = egret.getDefinitionByName(muduleName + classname);
            if (clazz) {
                factory.addMessage(clazz.newObj(id));
            }
        }
    }
}


function initMessages() {
    _loadMessage(ServerOpcodes);
    _loadMessage(LoginOpcodes);
    _loadMessage(opCodes);

    if( DEBUG ){
        let all = 0
        let prefix = "Message_"
        for(let name in MessageLogic){
            if(name.indexOf(prefix) != -1){
                all++
                let codeName = name.substring(prefix.length)
                if(ServerOpcodes[codeName] == null && LoginOpcodes[codeName] == null && opCodes[codeName] == null){
                    TLog.Error("deprecated code:%s", codeName)
                }
            }
        }
    }
    
}


function initMessageDispatches(){

	//登陆连接
	let loginDispatcher = LoginNetDispatcher.getInstance()
	loginDispatcher.addMessageHandle(LoginMessageHandler.newObj())
	
	//游戏连接
	let gameDispatcher = GameNetDispatcher.getInstance()
	gameDispatcher.addMessageHandle(GameWorldMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(ItemMessageHandler.newObj())
	gameDispatcher.addMessageHandle(ChatMessageHandler.newObj())
	gameDispatcher.addMessageHandle(TaskMessageHandler.newObj())
	gameDispatcher.addMessageHandle(FightMessageHandler.newObj())
	// gameDispatcher.addMessageHandle(SkillMessageHandler.newObj())
	// gameDispatcher.addMessageHandle(SoldierMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(PetMessageHandler.newObj())
   // gameDispatcher.addMessageHandle(XianLvMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(FairyMessageHandler.newObj())
	// gameDispatcher.addMessageHandle(MountsMessageHandler.newObj())
	// gameDispatcher.addMessageHandle(DefendMessageHandler.newObj())
	// gameDispatcher.addMessageHandle(FactionWarMessageHandler.newObj())
	// gameDispatcher.addMessageHandle(TeamMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(MateMessageHandler.newObj())
	
	//gameDispatcher.addMessageHandle(TradeCenterMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(BuffMessageHandler.newObj())
	// gameDispatcher.addMessageHandle(ActivityMessageHandler.newObj())
	gameDispatcher.addMessageHandle(RoleMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(ProfessionMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(GrowMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(ShopMessageHandler.newObj())
	gameDispatcher.addMessageHandle(FriendMessageHandler.newObj())
    // gameDispatcher.addMessageHandle(ImmortalsMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(PracticeMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(ClubMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(CampaignMessageHandler.newObj())
	gameDispatcher.addMessageHandle(ActivityMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(EquipRebuildAbilityMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(DailyMessageHandler.newObj())
	gameDispatcher.addMessageHandle(MailMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(PayActivityMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(OtherMessageHandler.newObj())
	//gameDispatcher.addMessageHandle(GlobalActivityMessageHandler.newObj())
	// gameDispatcher.addMessageHandle(HomepageMessageHandler.newObj())
    gameDispatcher.addMessageHandle(ChampionMessageHandler.newObj())
    // gameDispatcher.addMessageHandle(GodsWarMessageHandler.newObj())

    //gameDispatcher.addMessageHandle(FunMessageHandler.newObj())
    
}

function initMessageMapping() {
    initMessages();
    initMessageDispatches();
}



function gameStaticInit() {
    initInstances();
    initMessageMapping();
}