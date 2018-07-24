// TypeScript file

ImportType(IGlobal)

var LOAD_ALWAYS = 0;//-- 第一次使用时加载，流程切换不卸载
var LOAD_RECYCLE = 1;//-- 每次使用时才加载，每次关闭窗口卸载 （调用 ..._Unload()函数）
var LOAD_RECYCLE_STATE = 2;//-- 每次使用时才加载，流程切换回收资源 （调用 ..._Unload()函数）


var WndsMap = {

    ["Common"]: {
        //["TapTipsFrame"]:{mode:LOAD_ALWAYS, clazz:"", autoshow:false, init:false},

        ["CommonTipsFrame"]: { mode: LOAD_ALWAYS, clazz: CommonTipsFrame, autoshow: false, init: false, common: true, uievent: false },
        ["MsgWaitingFrame"]: { mode: LOAD_RECYCLE, clazz: MsgWaitingFrame, autoshow: false, init: true, common: true, uievent: false },
        ["IconMsgFrame"]: { mode: LOAD_RECYCLE, clazz: IconMsgFrame, autoshow: false, init: false, common: true },
        ["ScreenEffectTipsFrame"]: { mode: LOAD_RECYCLE, clazz: ScreenEffectTipsFrame, autoshow: false, init: false, common: true, uievent: false },

        ["ConfirmFrame"]: { mode: LOAD_ALWAYS, clazz: ConfirmFrame, autoshow: false, init: false, common: true },

        ["LoginFrame"]: { mode: LOAD_RECYCLE, clazz: LoginFrame, autoshow: false, init: false, common: true },
    },

    [PRECEDURE_LOGIN]: {

        ["LoginServerListFrame"]: { mode: LOAD_RECYCLE, clazz: LoginServerListFrame, autoshow: false, init: false },
        ["LoginRegisterFrame"]: { mode: LOAD_RECYCLE, clazz: LoginRegisterFrame, autoshow: false, init: false },
        ["LoginCreateRoleFrame"]: { mode: LOAD_RECYCLE, clazz: LoginCreateRoleFrame, autoshow: false, init: false },
        ["LoginRoleListFrame"]: { mode: LOAD_RECYCLE, clazz: LoginRoleListFrame, autoshow: false, init: false },
    },

    [PRECEDURE_GAME]: {

        //主界面
        ["MainFrame"]: { mode: LOAD_RECYCLE_STATE, clazz: MainFrame, autoshow: true, init: false },
        ["MainContentFrame"]: { mode: LOAD_RECYCLE_STATE, clazz: MainContentFrame, autoshow: true, init: false },
        ["MainCityFrame"]: { mode: LOAD_ALWAYS, clazz: MainCityFrame, autoshow: false, init: false },
        //["PublicNoticeFrame"]: { mode: LOAD_ALWAYS, clazz: PublicNoticeFrame, autoshow: false, init: false },

        //战力变化
        ["CombatForceTipsFrame"]: { mode: LOAD_ALWAYS, clazz: CombatForceTipsFrame, autoshow: false, init: true },
        ["SettingFrame"]: { mode: LOAD_RECYCLE, clazz: SettingFrame, autoshow: false, init: false },
        
        ["ChatFrame"]: { mode: LOAD_ALWAYS, clazz: ChatFrame, autoshow: false, init: true },

        ["ChatInsertFaceFrame"]: { mode: LOAD_RECYCLE, clazz: ChatInsertFaceFrame, autoshow: false, init: false },


        //角色绑定的窗口
        ["CharacterUpperFrame"]: { mode: LOAD_ALWAYS, clazz: CharacterUpperFrame, autoshow: false, init: false, uievent: false },
        ["CharacterFightFrame"]: { mode: LOAD_ALWAYS, clazz: CharacterFightFrame, autoshow: false, init: false, uievent: false },
        ["CharacterAwardFrame"]: { mode: LOAD_ALWAYS, clazz: CharacterAwardFrame, autoshow: false, init: false, uievent: false },
        ["ChatBubbleFrame"]: { mode: LOAD_ALWAYS, clazz: ChatBubbleFrame, autoshow: false, init: false, uievent: false },
        ["CharacterGlobalMiningFrame"]: { mode: LOAD_ALWAYS, clazz: CharacterGlobalMiningFrame, autoshow: false, init: false, uievent: false },
        
        //背包
        ["ItemBeiBaoFrame"]: { mode: LOAD_ALWAYS, clazz: ItemBeiBaoFrame, autoshow: false, init: false },
        ["BeiBaoAddCapacityFrame"]: { mode: LOAD_ALWAYS, clazz: BeiBaoAddCapacityFrame, autoshow: false, init: false },
        ["BeiBaoSmelteFrame"]: { mode: LOAD_ALWAYS, clazz: BeiBaoSmelteFrame, autoshow: false, init: false },
        ["BeiBaoSmeltEquipFrame"]: { mode: LOAD_ALWAYS, clazz: BeiBaoSmeltEquipFrame, autoshow: false, init: false },
        ["ItemGoldEquipFrame"]: { mode: LOAD_ALWAYS, clazz: ItemGoldEquipFrame, autoshow: false, init: false },
        //物品
        ["ItemHintFrame"]: { mode: LOAD_RECYCLE, clazz: ItemHintFrame, autoshow: false, init: false },

        ["ShopGoldSmeltFrame"]: { mode: LOAD_ALWAYS, clazz: ShopGoldSmeltFrame, autoshow: false, init: false },

        ["ShopFunFrame"]: { mode: LOAD_ALWAYS, clazz: ShopFunFrame, autoshow: false, init: false },
        ["ShopShenChongFrame"]: { mode: LOAD_ALWAYS, clazz: ShopShenChongFrame, autoshow: false, init: false },
        ["ShopYuanBaoFrame"]: { mode: LOAD_ALWAYS, clazz: ShopYuanBaoFrame, autoshow: false, init: false },
        ["ShopEquipFrame"]: { mode: LOAD_ALWAYS, clazz: ShopEquipFrame, autoshow: false, init: false },
        ["ShopZhuangBanFrame"]: { mode: LOAD_ALWAYS, clazz: ShopZhuangBanFrame, autoshow: false, init: false },
        ["ShopJingJiFrame"]: { mode: LOAD_ALWAYS, clazz: ShopJingJiFrame, autoshow: false, init: false },

        ["ShopPeerlessFrame"]: { mode: LOAD_ALWAYS, clazz: ShopPeerlessFrame, autoshow: false, init: false },

        ["ShopItemBuyFrame"]: { mode: LOAD_RECYCLE, clazz: ShopItemBuyFrame, autoshow: false, init: false },

        //关卡界面
        ["CampaignBossFrame"]: { mode: LOAD_ALWAYS, clazz: CampaignBossFrame, autoshow: false, init: false },
        ["CampaignRankFrame"]: { mode: LOAD_RECYCLE, clazz: CampaignRankFrame, autoshow: false, init: false },
        ["CampaginPrizeFrame"]: { mode: LOAD_RECYCLE, clazz: CampaginPrizeFrame, autoshow: false, init: false },
        ["CampaignBossQiuZhuFrame"]: { mode: LOAD_ALWAYS, clazz: CampaignBossQiuZhuFrame, autoshow: false, init: false },
        ["CampaignRecordFrame"]: { mode: LOAD_ALWAYS, clazz: CampaignRecordFrame, autoshow: false, init: false },
        

        //通用
        ["NotifyPrizeGainFrame"]: { mode: LOAD_ALWAYS, clazz: NotifyPrizeGainFrame, autoshow: false, init: false },
        ["PrizeShowFrame"]: { mode: LOAD_RECYCLE, clazz: PrizeShowFrame, autoshow: false, init: false },
        ["LuckyPrizeShowFrame"]: { mode: LOAD_RECYCLE, clazz: LuckyPrizeShowFrame, autoshow: false, init: false },
        ["HousePrizeShowFrame"]: { mode: LOAD_RECYCLE, clazz: HousePrizeShowFrame, autoshow: false, init: false },
        ["RuleDescribeFrame"]: { mode: LOAD_RECYCLE, clazz: RuleDescribeFrame, autoshow: false, init: false },



        // //战斗
        ["FightFrame"]: { mode: LOAD_ALWAYS, clazz: FightFrame, autoshow: false, init: true },
        ["FightPrizeFrame"]: { mode: LOAD_RECYCLE, clazz: FightPrizeFrame, autoshow: false, init: false },
        ["FightDragonPrizeFrame"]: { mode: LOAD_RECYCLE, clazz: FightDragonPrizeFrame, autoshow: false, init: false },
        ["FightCapturePrizeFrame"]: { mode: LOAD_RECYCLE, clazz: FightCapturePrizeFrame, autoshow: false, init: false },
        ["FightCaptureLostFrame"]: { mode: LOAD_RECYCLE, clazz: FightCaptureLostFrame, autoshow: false, init: false },
        ["FightLostFrame"]: { mode: LOAD_RECYCLE, clazz: FightLostFrame, autoshow: false, init: false },
        ["FightJJCPrizeFrame"]: { mode: LOAD_RECYCLE, clazz: FightJJCPrizeFrame, autoshow: false, init: false },
        ["FightRecordFrame"]: { mode: LOAD_RECYCLE, clazz: FightRecordFrame, autoshow: false, init: false, common: true},
        

        //宠物--
        ["PetFrame"]: { mode: LOAD_ALWAYS, clazz: PetFrame, autoshow: false, init: false },
        ["PetListFrame"]: { mode: LOAD_ALWAYS, clazz: PetListFrame, autoshow: false, init: false },
        ["PetPreviewFrame"]: { mode: LOAD_ALWAYS, clazz: PetPreviewFrame, autoshow: false, init: false },
        ["PetClearFrame"]: { mode: LOAD_RECYCLE, clazz: PetClearFrame, autoshow: false, init: false },
        ["PetAttributeFrame"]: { mode: LOAD_RECYCLE, clazz: PetAttributeFrame, autoshow: false, init: false },
        ["PetAttrAddFrame"]: { mode: LOAD_RECYCLE, clazz: PetAttrAddFrame, autoshow: false, init: false },
        ["PetChangeNameFrame"]: { mode: LOAD_RECYCLE, clazz: PetChangeNameFrame, autoshow: false, init: false },
        ["PetNaturlFrame"]: { mode: LOAD_RECYCLE, clazz: PetNaturlFrame, autoshow: false, init: false },
        ["PetEmbattleFrame"]: { mode: LOAD_RECYCLE, clazz: PetEmbattleFrame, autoshow: false, init: false },
        ["PetUnionFrame"]: { mode: LOAD_ALWAYS, clazz: PetUnionFrame, autoshow: false, init: false },
        ["PetUnionSuccessFrame"]: { mode: LOAD_RECYCLE, clazz: PetUnionSuccessFrame, autoshow: false, init: false },
        ["PetUnionLostFrame"]: { mode: LOAD_RECYCLE, clazz: PetUnionLostFrame, autoshow: false, init: false },
        ["PetUnionTreeFrame"]: { mode: LOAD_ALWAYS, clazz: PetUnionTreeFrame, autoshow: false, init: false },

        ["PetFlyFrame"]: { mode: LOAD_ALWAYS, clazz: PetFlyFrame, autoshow: false, init: false },
        ["PetFlyPropertyFrame"]: { mode: LOAD_RECYCLE, clazz: PetFlyPropertyFrame, autoshow: false, init: false },
        

        ["TaskDialogFrame"]: { mode: LOAD_ALWAYS, clazz: TaskDialogFrame, autoshow: false, init: false },


        //剧情电影
        //["MovieDramaFrame"]: { mode: LOAD_RECYCLE, clazz: , autoshow: false, init: true },
        //modify:movie
        // ["FullBalckFrame"]: { mode: LOAD_RECYCLE, clazz: FullBalckFrame, autoshow: false, init: false },
        // ["FastEndMoiveFrame"]: { mode: LOAD_RECYCLE, clazz: FastEndMoiveFrame, autoshow: false, init: true },
        // ["MovieBackGroundFrame"]: { mode: LOAD_RECYCLE, clazz: MovieBackGroundFrame, autoshow: false, init: false },
        // ["FullImageFrame"]: { mode: LOAD_RECYCLE, clazz: FullImageFrame, autoshow: false, init: false },
        


        //好友
        //["DeleteFriendFrame"]: { mode: LOAD_RECYCLE, clazz: DeleteFriendFrame, autoshow: false, init: false },
        //["FriendChatFrame"]: { mode: LOAD_ALWAYS, clazz: , autoshow: false, init: false },
        ["FriendFindResultFrame"]: { mode: LOAD_RECYCLE, clazz: FriendFindResultFrame, autoshow: false, init: false },
        ["FriendsFrame"]: { mode: LOAD_ALWAYS, clazz: FriendsFrame, autoshow: false, init: false },
        ["FindFriendFrame"]: { mode: LOAD_RECYCLE, clazz:FindFriendFrame , autoshow: false, init: false },
        ["FriendSDetailsFrame"]: { mode: LOAD_RECYCLE, clazz:FriendSDetailsFrame , autoshow: false, init: false },

        //帮会
        
        ["ClubFrame"]: { mode: LOAD_ALWAYS, clazz: ClubFrame, autoshow: false, init: false },
        ["ClubListFrame"]: { mode: LOAD_RECYCLE, clazz: ClubListFrame, autoshow: false, init: false },
        ["ClubCreatFrame"]: { mode: LOAD_RECYCLE, clazz: ClubCreatFrame, autoshow: false, init: false },

        ["ClubActiveFrame"]: { mode: LOAD_ALWAYS, clazz: ClubActiveFrame, autoshow: false, init: false },
        //["ClubBuyFrame"]: { mode: LOAD_RECYCLE, clazz: ClubBuyFrame, autoshow: false, init: false },
        ["ClubChangeNoticeFrame"]: { mode: LOAD_RECYCLE, clazz:ClubChangeNoticeFrame , autoshow: false, init: false },
        ["ClubDonateFrame"]: { mode: LOAD_RECYCLE, clazz: ClubDonateFrame, autoshow: false, init: false },
        ["ClubMapFrame"]: { mode: LOAD_RECYCLE_STATE, clazz: ClubMapFrame, autoshow: false, init: false },
        ["ClubPeopleApplyFrame"]: { mode: LOAD_RECYCLE, clazz:ClubPeopleApplyFrame, autoshow: false, init: false },
        ["ClubPeopleInfoFrame"]: { mode: LOAD_RECYCLE, clazz: ClubPeopleInfoFrame, autoshow: false, init: false },
        ["ClubAppointFrame"]: { mode: LOAD_RECYCLE, clazz: ClubAppointFrame, autoshow: false, init: false },
        ["ClubChangeNameFrame"]: { mode: LOAD_RECYCLE, clazz: ClubChangeNameFrame, autoshow: false, init: false },
        ["ClubActivePrizeFrame"]: { mode: LOAD_RECYCLE, clazz: ClubActivePrizeFrame, autoshow: false, init: false },
        ["ClubExchangeFrame"]: { mode: LOAD_RECYCLE, clazz: ClubExchangeFrame, autoshow: false, init: false },
        ["ClubEventRecordFrame"]: { mode: LOAD_RECYCLE, clazz:ClubEventRecordFrame , autoshow: false, init: false },
        ["ClubStoreFrame"]: { mode: LOAD_RECYCLE, clazz: ClubStoreFrame, autoshow: false, init: false },
        ["ClubPartFrame"]: { mode: LOAD_RECYCLE, clazz: ClubPartFrame, autoshow: false, init: false },
        ["PartComputeFrame"]: { mode: LOAD_RECYCLE, clazz: PartComputeFrame, autoshow: false, init: false },
        ["ClubPartRecordFrame"]: { mode: LOAD_RECYCLE, clazz: ClubPartRecordFrame, autoshow: false, init: false },

        //邮件
        ["MailListFrame"]: { mode: LOAD_RECYCLE, clazz: MailListFrame, autoshow: false, init: false },
        ["MailFrame"]: { mode: LOAD_RECYCLE, clazz: MailFrame, autoshow: false, init: true },

        //竞技场
        ["ChampionFrame"]: { mode: LOAD_ALWAYS, clazz: ChampionFrame, autoshow: false, init: false },
        ["ChampionRankFrame"]: { mode: LOAD_RECYCLE, clazz: ChampionRankFrame, autoshow: false, init: false },
        ["ChampionRecordFrame"]: { mode: LOAD_RECYCLE, clazz: ChampionRecordFrame, autoshow: false, init: false },
        ["PeerlessStakeFrame"]: { mode: LOAD_ALWAYS, clazz: PeerlessStakeFrame, autoshow: false, init: false },
        ["PeerlessStakeTipsFrame"]: { mode: LOAD_ALWAYS, clazz: PeerlessStakeTipsFrame, autoshow: false, init: false },
        ["PeerlessCombatTipsFrame"]: { mode: LOAD_RECYCLE, clazz: PeerlessCombatTipsFrame, autoshow: false, init: false },
        //活动
        ["ActivityRankBaseFrame"]: { mode: LOAD_ALWAYS, clazz: ActivityRankBaseFrame, autoshow: false, init: true },
        ["ActivityListFrame"]: { mode: LOAD_RECYCLE_STATE, clazz: ActivityListFrame, autoshow: false, init: true },
        ["AnswerQuestionFrame"]: { mode: LOAD_RECYCLE, clazz: AnswerQuestionFrame, autoshow: false, init: true },
        ["ActivityShareFrame"]: { mode: LOAD_RECYCLE_STATE, clazz: ActivityShareFrame, autoshow: false, init: true },
        ["ActivityRemindFrame"]: { mode: LOAD_RECYCLE_STATE, clazz: ActivityRemindFrame, autoshow: false, init: false },
        ["WonderFrame"]: { mode: LOAD_RECYCLE_STATE, clazz: WonderFrame, autoshow: false, init: false },
        ["WonderBuyFrame"]: { mode: LOAD_RECYCLE, clazz: WonderBuyFrame, autoshow: false, init: false },
        ["WonderSixWorldTipsFrame"]: { mode: LOAD_RECYCLE, clazz: WonderSixWorldTipsFrame, autoshow: false, init: false },
        //储值
        ["PayFrame"]: { mode: LOAD_RECYCLE, clazz: PayFrame, autoshow: false, init: false },
        //["GoldBuyFrame"]: { mode: LOAD_RECYCLE, clazz: , autoshow: false, init: true },
        ["VIPFrame"]: { mode: LOAD_RECYCLE, clazz: VIPFrame, autoshow: false, init: false },
        
        //狂欢活动
        ["CarnivalFrame"]: { mode: LOAD_ALWAYS, clazz: CarnivalFrame, autoshow: false, init: true },

        //幸运好礼
        ["LuckyPrizeFrame"]: { mode: LOAD_RECYCLE, clazz: LuckyPrizeFrame, autoshow: false, init: true },
        ["HeavenGiftTipsFrame"]: { mode: LOAD_RECYCLE, clazz: HeavenGiftTipsFrame, autoshow: false, init: true },
        ["LimitedSaleTipsFrame"]: { mode: LOAD_RECYCLE, clazz: LimitedSaleTipsFrame, autoshow: false, init: true },
         //投资
        ["TouZiFrame"]: { mode: LOAD_RECYCLE, clazz: TouZiFrame, autoshow: false, init: false },

        //天女
        ["TianNvFrame"]: { mode: LOAD_ALWAYS, clazz: TianNvFrame, autoshow: false, init: false },

        //天仙
        ["TianXianFrame"]: { mode: LOAD_ALWAYS, clazz:TianXianFrame , autoshow: false, init: false },
        //仙侣
        ["XianLvFrame"]: { mode: LOAD_ALWAYS, clazz: XianLvFrame, autoshow: false, init: false },
        ["XianLvAttributeFrame"]: { mode: LOAD_ALWAYS, clazz:XianLvAttributeFrame , autoshow: false, init: false },
        ["XianLvPropertyFrame"]: { mode: LOAD_ALWAYS, clazz: XianLvPropertyFrame, autoshow: false, init: false },
        ["XianLvQiYuanFrame"]: { mode: LOAD_ALWAYS, clazz: XianLvQiYuanFrame, autoshow: false, init: false },
        ["XianLvFightFrame"]: { mode: LOAD_ALWAYS, clazz: XianLvFightFrame, autoshow: false, init: false },
        ["XianLvSkillDesFrame"]: { mode: LOAD_ALWAYS, clazz: XianLvSkillDesFrame, autoshow: false, init: false },

        //日常
        ["DailyFrame"]: { mode: LOAD_ALWAYS, clazz: DailyFrame, autoshow: false, init: false },
        ["DailyGhostFrame"]: { mode: LOAD_RECYCLE, clazz: DailyGhostFrame, autoshow: false, init: false },
        ["DailyPrizeTipsFrame"]: { mode: LOAD_RECYCLE, clazz: DailyPrizeTipsFrame, autoshow: false, init: false },
        ["DailyFindBackFrame"]: { mode: LOAD_RECYCLE, clazz: DailyFindBackFrame, autoshow: false, init: false },
        //["DailyFindBackTipsFrame"]: { mode: LOAD_RECYCLE, clazz: DailyFindBackTipsFrame, autoshow: false, init: false },

        //通用
        ["CommonDrugFrame"]: { mode: LOAD_RECYCLE, clazz: CommonDrugFrame, autoshow: false, init: false },
        ["CommonSkinsFrame"]: { mode: LOAD_RECYCLE, clazz: CommonSkinsFrame, autoshow: false, init: false },
        ["CommonSkinPropertyFrame"]: { mode: LOAD_RECYCLE, clazz:CommonSkinPropertyFrame , autoshow: false, init: false },
        ["CommonFunPropertyFrame"]: { mode: LOAD_RECYCLE, clazz:CommonFunPropertyFrame, autoshow: false, init: false },
        ["CommonOpenTipsFrame"]: { mode: LOAD_RECYCLE, clazz: CommonOpenTipsFrame, autoshow: false, init: false },
        ["FullScreenBgFrame"]: { mode: LOAD_ALWAYS, clazz:FullScreenBgFrame , autoshow: false, init: true },
        ["ItemBoxPreviewFrame"]: { mode: LOAD_RECYCLE, clazz:ItemBoxPreviewFrame , autoshow: false, init: false },
        ["DeblockingItemFrame"]: { mode: LOAD_RECYCLE, clazz:DeblockingItemFrame , autoshow: false, init: false },
        ["EasterEggPetFrame"]: { mode: LOAD_RECYCLE, clazz:EasterEggPetFrame , autoshow: false, init: false },
        
        
        //角色
        ["RoleFrame"]: { mode: LOAD_ALWAYS, clazz: RoleFrame, autoshow: false, init: false },
        //["RoleMountsDanFrame"]: { mode: LOAD_ALWAYS, clazz: RoleMountsDanFrame, autoshow: false, init: false },
       // ["RoleMountsSkinsFrame"]: { mode: LOAD_ALWAYS, clazz: , autoshow: false, init: false },
        ["RoleSkillsSettingFrame"]: { mode: LOAD_RECYCLE, clazz: RoleSkillsSettingFrame, autoshow: false, init: false },
        ["RoleFATFrame"]: { mode: LOAD_ALWAYS, clazz: RoleFATFrame, autoshow: false, init: false },
        ["RoleFashionPeopleFrame"]: { mode: LOAD_ALWAYS, clazz: RoleFashionPeopleFrame, autoshow: false, init: false },
        ["RolePropertyFrame"]: { mode: LOAD_RECYCLE, clazz: RolePropertyFrame, autoshow: false, init: false },
        ["RoleSuitFrame"]: { mode: LOAD_ALWAYS, clazz: RoleSuitFrame, autoshow: false, init: false },
        
        ["RoleFaBaoFrame"]: { mode: LOAD_ALWAYS, clazz: RoleFaBaoFrame, autoshow: false, init: false },
        ["RoleFaBaoQualityFrame"]: { mode: LOAD_ALWAYS, clazz: RoleFaBaoQualityFrame, autoshow: false, init: false },
        ["FaBaoItemTipsFrame"]: { mode: LOAD_ALWAYS, clazz: FaBaoItemTipsFrame, autoshow: false, init: false },
        
        ["ShenHunFrame"]: { mode: LOAD_ALWAYS, clazz: ShenHunFrame, autoshow: false, init: false },
        ["ShenHunStrongFrame"]: { mode: LOAD_RECYCLE, clazz: ShenHunStrongFrame, autoshow: false, init: false },
        ["ShenHunItemTipsFrame"]: { mode: LOAD_ALWAYS, clazz: ShenHunItemTipsFrame, autoshow: false, init: false },
        ["ShenHunQualityFrame"]: { mode: LOAD_ALWAYS, clazz: ShenHunQualityFrame, autoshow: false, init: false },
        ["LieHunFrame"]: { mode: LOAD_ALWAYS, clazz: LieHunFrame, autoshow: false, init: false },
        //锻造
        ["ForgeFrame"]: { mode: LOAD_ALWAYS, clazz: ForgeFrame, autoshow: false, init: false },
        ["ForgeLevelFrame"]: { mode: LOAD_ALWAYS, clazz: ForgeLevelFrame, autoshow: false, init: false },
            
        //离线收益
        ["PlayerOffLineFrame"]: { mode: LOAD_ALWAYS, clazz: PlayerOffLineFrame, autoshow: false, init: false },
        //西游护送
        ["OdysseyEscortFrame"]: { mode: LOAD_ALWAYS, clazz:OdysseyEscortFrame , autoshow: false, init: false },
        ["EscortPrizeFrame"]: { mode: LOAD_ALWAYS, clazz:EscortPrizeFrame , autoshow: false, init: false },
        ["EscortFrame"]: { mode: LOAD_ALWAYS, clazz:EscortFrame , autoshow: false, init: false },
        ["InterceptRecordFrame"]: { mode: LOAD_RECYCLE, clazz: InterceptRecordFrame, autoshow: false, init: false },
        ["InterceptTipsFrame"]: { mode: LOAD_RECYCLE, clazz:InterceptTipsFrame , autoshow: false, init: false },
        //["EscortTipsFrame"]: { mode: LOAD_RECYCLE, clazz: EscortTipsFrame, autoshow: false, init: false },
        ["RevengeTipsFrame"]: { mode: LOAD_RECYCLE, clazz: RevengeTipsFrame, autoshow: false, init: false },
        //玩家详情
        ["PlayerDetailsFrame"]: { mode: LOAD_ALWAYS, clazz:PlayerDetailsFrame , autoshow: false, init: false },
        ["PlayerDetailsRenameFrame"]: { mode: LOAD_ALWAYS, clazz:PlayerDetailsRenameFrame , autoshow: false, init: false },
        //获取途径
        ["GoodsAsseceFrame"]: { mode: LOAD_RECYCLE, clazz: GoodsAsseceFrame, autoshow: false, init: false },
        ["MoneyChargeFrame"]: { mode: LOAD_ALWAYS, clazz: MoneyChargeFrame, autoshow: false, init: false },
        //排行榜
        ["RankFrame"]: { mode: LOAD_RECYCLE, clazz: RankFrame, autoshow: false, init: false },
        

        //星灵
        ["XingLingFrame"]: { mode: LOAD_RECYCLE, clazz: XingLingFrame, autoshow: false, init: false },

        ["AnimTipsFrame"]: { mode: LOAD_RECYCLE, clazz: AnimTipsFrame, autoshow: false, init: false },
        ["MovableAnimTipsFrame"]: { mode: LOAD_RECYCLE, clazz: MovableAnimTipsFrame, autoshow: false, init: false },
        ["DramaTipsFrame"]: { mode: LOAD_RECYCLE, clazz: DramaTipsFrame, autoshow: false, init: false },
        ["GuideMaskFrame"]: { mode: LOAD_RECYCLE, clazz: GuideMaskFrame, autoshow: false, init: false },
        ["GuideTipsFrame"]: { mode: LOAD_RECYCLE, clazz: GuideTipsFrame, autoshow: false, init: false },
        ["FuncPreviewFrame"]: { mode: LOAD_RECYCLE, clazz: FuncPreviewFrame, autoshow: false, init: false },

        //公告
        ["NoticeListFrame"]: { mode: LOAD_RECYCLE, clazz: NoticeListFrame, autoshow: false, init: true },
        ["UpdateNoticeFrame"]: { mode: LOAD_RECYCLE, clazz: UpdateNoticeFrame, autoshow: false, init: false },
        ["NoticeDetailFrame"]: { mode: LOAD_RECYCLE, clazz: NoticeDetailFrame, autoshow: false, init: false },

        //通用系统页面
        ["FunSkillFrame"]: { mode: LOAD_RECYCLE, clazz: FunSkillFrame, autoshow: false, init: false },
        ["FunPrizeFrame"]: { mode: LOAD_ALWAYS, clazz: FunPrizeFrame, autoshow: false, init: false },
       
        //BOSS、副本
        ["BossMainFrame"]: { mode: LOAD_ALWAYS, clazz:BossMainFrame, autoshow: false, init: false },
        ["BossGlobalRemindFrame"]: { mode: LOAD_RECYCLE, clazz: BossGlobalRemindFrame, autoshow: false, init: false },
        ["BossWildFrame"]: { mode: LOAD_RECYCLE, clazz: BossWildFrame, autoshow: false, init: false },
        ["BossBefallFrame"]: { mode: LOAD_ALWAYS, clazz: BossBefallFrame, autoshow: false, init: false },
        ["BossGlobalHarmRankFrame"]: { mode: LOAD_ALWAYS, clazz: BossGlobalHarmRankFrame, autoshow: false, init: false },
        ["BossGlobalKillRankFrame"]: { mode: LOAD_ALWAYS, clazz: BossGlobalKillRankFrame, autoshow: false, init: false },
        
        ["CopyMainFrame"]: { mode: LOAD_ALWAYS, clazz: CopyMainFrame, autoshow: false, init: false },
        ["CopyStarRankFrame"]: { mode: LOAD_RECYCLE, clazz: CopyStarRankFrame, autoshow: false, init: false },
        ["CopyTempleRankFrame"]: { mode: LOAD_RECYCLE, clazz: CopyTempleRankFrame, autoshow: false, init: false },
        ["CopyHeavenRankFrame"]: { mode: LOAD_RECYCLE, clazz: CopyHeavenRankFrame, autoshow: false, init: false },
       

        //关卡大地图
        ["MapFrame"]: { mode: LOAD_RECYCLE, clazz: MapFrame, autoshow: false, init: false },

        //充值活动
        ["DailyLoginFrame"]: { mode: LOAD_ALWAYS, clazz: DailyLoginFrame, autoshow: false, init: false },
        ["PayStageUpFrame"]: { mode: LOAD_ALWAYS, clazz: PayStageUpFrame, autoshow: false, init: false },
        ["DailyPayFrame"]: { mode: LOAD_ALWAYS, clazz: DailyPayFrame, autoshow: false, init: false },
        ["TodayGiftsFrame"]: { mode: LOAD_ALWAYS, clazz: TodayGiftsFrame, autoshow: false, init: false },
        ["TenGiftFrame"]: { mode: LOAD_ALWAYS, clazz: TenGiftFrame, autoshow: false, init: false },

        //福利大厅
        ["WelfareFrame"]: { mode: LOAD_RECYCLE, clazz: WelfareFrame, autoshow: false, init: false },
        
        //寻宝
        ["LuckyFrame"]: { mode: LOAD_RECYCLE, clazz: LuckyFrame, autoshow: false, init: false },
        // ["XunbaoBonusFrame"]: { mode: LOAD_RECYCLE, clazz: XunbaoBonusFrame, autoshow: false, init: false },

        ["LianYaoAccessPathFrame"]: { mode: LOAD_RECYCLE, clazz: LianYaoAccessPathFrame, autoshow: false, init: false },
        ["LianYaoBonusFrame"]: { mode: LOAD_RECYCLE, clazz: LianYaoBonusFrame, autoshow: false, init: false },
        ["LianYaoRecordFrame"]: { mode: LOAD_RECYCLE, clazz: LianYaoRecordFrame, autoshow: false, init: false },


        //三生三世
        ["SanShengSanShiFrame"]: { mode: LOAD_ALWAYS, clazz: SanShengSanShiFrame, autoshow: false, init: false },
        ["ProposeFrame"]: { mode: LOAD_RECYCLE, clazz: ProposeFrame, autoshow: false, init: false },
        ["ProposingFrame"]: { mode: LOAD_RECYCLE, clazz: ProposingFrame, autoshow: false, init: false },
        ["HousePowerInfoFrame"]: { mode: LOAD_RECYCLE, clazz: HousePowerInfoFrame, autoshow: false, init: false },
        ["MarryTipFrame"]: { mode: LOAD_RECYCLE, clazz: MarryTipFrame, autoshow: false, init: false },
        ["MarryInformFrame"]: { mode: LOAD_ALWAYS, clazz: MarryInformFrame, autoshow: false, init: false },
        

        //跨服
        ["GlobalMainFrame"]: { mode: LOAD_ALWAYS, clazz: GlobalMainFrame, autoshow: false, init: false },

        //跨服争霸（挖矿）
        ["GlobalMiningMainFrame"]: { mode: LOAD_ALWAYS, clazz: GlobalMiningMainFrame, autoshow: false, init: false },
        ["GlobalMiningGuardFrame"]: { mode: LOAD_RECYCLE, clazz: GlobalMiningGuardFrame, autoshow: false, init: false },
        ["GlobalMiningTeamFrame"]: { mode: LOAD_RECYCLE, clazz: GlobalMiningTeamFrame, autoshow: false, init: false },
        ["GlobalMiningJoinFrame"]: { mode: LOAD_RECYCLE, clazz: GlobalMiningJoinFrame, autoshow: false, init: false },
        ["GlobalMiningInfoFrame"]: { mode: LOAD_RECYCLE, clazz: GlobalMiningInfoFrame, autoshow: false, init: false },
        ["GlobalMiningRankFrame"]: { mode: LOAD_RECYCLE, clazz: GlobalMiningRankFrame, autoshow: false, init: false },

        //开服活动
        ["OpenServerMainFrame"]: { mode: LOAD_ALWAYS, clazz: OpenServerMainFrame, autoshow: false, init: false },
             
        //第一次进入游戏
        ["FirstLoginFrame"]: { mode: LOAD_RECYCLE, clazz: FirstLoginFrame, autoshow: false, init: false },

        //神装
        ["GodEquipFrame"]: { mode: LOAD_ALWAYS, clazz: GodEquipFrame, autoshow: false, init: false },
        ["GodEquipGongMingFrame"]: { mode: LOAD_ALWAYS, clazz: GodEquipGongMingFrame, autoshow: false, init: false },
        ["GoldSmeltFrame"]: { mode: LOAD_ALWAYS, clazz: GoldSmeltFrame, autoshow: false, init: false },
      
        //武林大会
        ["WuLinMapFrame"]: { mode: LOAD_ALWAYS, clazz: WuLinMapFrame, autoshow: false, init: false },
        ["WuLinRankFrame"]: { mode: LOAD_RECYCLE, clazz: WuLinRankFrame, autoshow: false, init: false },
        ["WuLinMonthRankFrame"]: { mode: LOAD_RECYCLE, clazz: WuLinMonthRankFrame, autoshow: false, init: false },
        //据点
        ["StrongholdFrame"]: { mode: LOAD_ALWAYS, clazz: StrongholdFrame, autoshow: false, init: false },
        ["StrongholdMapFrame"]: { mode: LOAD_RECYCLE, clazz: StrongholdMapFrame, autoshow: false, init: false },
        ["StrongholdResChooseFrame"]: { mode: LOAD_RECYCLE, clazz: StrongholdResChooseFrame, autoshow: false, init: false },
        ["StrongholdRecordFrame"]: { mode: LOAD_RECYCLE, clazz: StrongholdRecordFrame, autoshow: false, init: false },
        ["StrongholdResFrame"]: { mode: LOAD_RECYCLE, clazz: StrongholdResFrame, autoshow: false, init: false },
        ["StrongholdInfoFrame"]: { mode: LOAD_ALWAYS, clazz: StrongholdInfoFrame, autoshow: false, init: false, uievent: false },
        ["StrongholdWaitFrame"]: { mode: LOAD_ALWAYS, clazz: StrongholdWaitFrame, autoshow: false, init: false, uievent: false },
        
        //开服排行活动
        ["ActivityRankFrame"]: { mode: LOAD_RECYCLE, clazz: ActivityRankFrame, autoshow: false, init: false },

        //秘录
        ["MiLuFrame"]: { mode: LOAD_RECYCLE, clazz: MiLuFrame, autoshow: false, init: false },
        ["MiLuRewardShowFrame"]: { mode: LOAD_RECYCLE, clazz: MiLuRewardShowFrame, autoshow: false, init: false },
        },

        
        

}


//在FullScreenBgFrame后层
let BackToFullScreenUI = [
    "MainContentFrame", 
    "ClubMapFrame",
    "FightFrame",
    "WuLinMapFrame",
    "GlobalMiningMainFrame",
    "StrongholdFrame"
]

let GlobalForbidMap: any = {
    ["click"]: [
        "MainMenuFrame",
    ],
    ["exclude"]: [							//排除是指对于"click"列表里的窗口进行处理排除

    ],
    ["show"]: [
        //"MapNameTipsFrame",
        "DailySignInFrame",
        "NoticeListFrame",
        "IconMsgFrame",
    ],
}

let MainAutoHideUI: any = {
    ["RoleFrame"]: true,
    ["ForgeFrame"]: true,
    ["XianLvFrame"]: true,
    ["PetFrame"]: true,
    ["TianNvFrame"] : true,
    ["MainCityFrame"]: true,
    ["TianXianFrame"] : true,

    ["ClubFrame"]: true,
    ["ClubActiveFrame"]: true,
    ["ClubPeopleApplyFrame"]: true,
    ["ClubPeopleInfoFrame"]: true,
    ["ClubListFrame"]: true,
    ["CampaignBossFrame"]: true,
    


    ["ChampionFrame"]: true,
    ["ActivityListFrame"]: true,
    ["CopyMainFrame"]: true,
    ["GlobalMainFrame"]: true,
    ["BossMainFrame"]: true,

    ["RoleSuitFrame"] : true,
    ["RoleFaBaoFrame"] : true,
    ["RoleFATFrame"] : true,
    ["GodEquipFrame"] : true,

    ["ShopEquipFrame"] : true,
    ["ShopYuanBaoFrame"] : true,
    ["ShopZhuangBanFrame"] : true,
    ["ShopJingJiFrame"] : true,
    ["ShopFunFrame"] : true,

    ["EscortFrame"] : true,
    ["OdysseyEscortFrame"] : true,
    ["DailyFrame"] : true,
    ["DailyGhostFrame"] : true,

    ["LuckyFrame"] : true,
    ["WelfareFrame"] : true,


    ["BeiBaoSmelteFrame"] : true,
    ["ItemBeiBaoFrame"] : true,
    ["MailListFrame"] : true,
    ["PayFrame"] : true,
    ["VIPFrame"] : true,
    
    ["RoleFaBaoQualityFrame"] : true,
    ["RoleSkillsSettingFrame"] : true,
    ["SanShengSanShiFrame"] : true,
    ["DailyLoginFrame"] : true,

    ["RankFrame"] : true,
    //["ChatInChannelFrame"] : true,
    ["ChatFrame"] : true,
    
    
    ["CommonSkinsFrame"] : true,
    ["CarnivalFrame"] : true,
    ["OpenServerMainFrame"] : true,
    
    ["LuckyPrizeFrame"] : true,

    ["WonderFrame"] : true,
    ["TouZiFrame"] : true,

    ["CampaignRecordFrame"] : true,

    ["PetUnionFrame"] : true,
    ["PetUnionTreeFrame"] : true,

    ["ClubStoreFrame"] : true,

    ["XingLingFrame"] : true,
    ["StrongholdRecordFrame"] : true,
    ["StrongholdResFrame"] : true,
    
    ["ShenHunFrame"] : true,
    ["ShenHunStrongFrame"] : true,
    ["LieHunFrame"] : true,
    ["ShenHunQualityFrame"] : true,
    ["FightRecordFrame"]: true,
    ["ShopShenChongFrame"] : true,
    ["MiLuFrame"] : true,
    
}

let CheckMainAutoHideUI: any = {
    ["CommonOpenTipsFrame"] : true,
}
