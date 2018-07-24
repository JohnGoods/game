/**
 * 超链接
 * 1.第一种 系统直接通过G2C_GLOBAL_SERVER_EVENT 发送event来通知客户端处理超链接文本并添加到世界聊天
 * 2.第二种 客户端自己处理超链接文本 然后发送到C2G_CHANNEL_SEND
 * linkType->事件type handle->点击回调 disposeTextFun->处理文本 disposeColor->设置颜色
 */
class ChannelHyperlinkMrg extends TClass {
    linkTypeConfig;
    advanceConfig;

    public initObj(...args: any[]): void {
        //超链接
        this.linkTypeConfig = [
            //系统
            { ["linkType"]: channelOption.FACTION_MAP_CREATE, ["handle"]: this.onHandleClubDungeonUI, ["param"]: "", ["disposeTextFun"]: this.onDisposeClubDungeon, ["disposeColor"]: null },	//帮会副本，当同一个帮会成员创建帮会副本成功就有提示，提示：玩家名开启帮会副本Lv几。【点击加入】。
            { ["linkType"]: channelOption.FACTION_PVE_BOSS_OPEN, ["handle"]: this.onHandleActivityMainUI, ["param"]: "", ["disposeTextFun"]: this.onDisposeActivityMain, ["disposeColor"]: null },	//帮会妖怪，帮会妖怪出现，提示：帮会妖怪已出现，请各位上仙前往击杀。【前往挑战】
            { ["linkType"]: channelOption.WILD_BOSS_REFRESH, ["handle"]: this.onHandleBossUI, ["param"]: 2, ["disposeTextFun"]: this.onDisposeBoss1, ["disposeColor"]: null },	//野外BOSS，当打死野外BOSS获得“神装碎片”就有系统提示。提示：福星高照！玩家名字挑战野外BOSS-打死那个BOSS名称时，获得了神装碎片！【前往挑战】
            { ["linkType"]: channelOption.WILD_BOSS_KILL, ["handle"]: this.onHandleBossUI, ["param"]: 2, ["disposeTextFun"]: this.onDisposeBoss2, ["disposeColor"]: null },	//野外BOSS刷新【点击前往】
            { ["linkType"]: channelOption.FRIEND_SHOP, ["handle"]: this.onHandleShopUI, ["param"]: 2, ["disposeTextFun"]: this.onDisposeShop, ["disposeColor"]: null }, //友情币商城	在好友中相互关注送友情币，【点击兑换】，可获得【巨灵】宝宝。（点击点击兑换就前往友情商店，点击巨灵就显示巨灵初始属性）
            { ["linkType"]: channelOption.TEMP_CELL_STAGE_UP, ["handle"]: this.onHandleAdvanceUI, ["param"]: "", ["disposeTextFun"]: this.onDisposeAdvance, ["disposeColor"]: null },	//通用进阶，通用进阶到8阶以上包括6阶都会有提示，提示：恭喜玩家名字，成功将通用进阶名称到几阶，战力飙升【我要进阶】
            { ["linkType"]: channelOption.LOTTERY_LUCKY, ["handle"]: this.onHandleLuckyUI, ["param"]: "", ["disposeTextFun"]: this.onDisposeLucky, ["disposeColor"]: null },	//寻宝或者幸运抽奖(玩家名字在幸运转盘中抽中道具名。【前往】)
            { ["linkType"]: channelOption.MARRY_SUCCESS, ["handle"]: this.onHandleSanShengUI, ["param"]: 0, ["disposeTextFun"]: this.onDisposeMarry, ["disposeColor"]: null },	//结婚成功
            { ["linkType"]: channelOption.WILD_BOSS_RUN, ["handle"]: null, ["param"]: 0, ["disposeTextFun"]: this.onDisposeBossRun, ["disposeColor"]: null },	//BOSS逃跑
            { ["linkType"]: channelOption.SHITU, ["handle"]: this.onHandleSanShengUI, ["param"]: 2, ["disposeTextFun"]: this.onDisposeShitu, ["disposeColor"]: null },	//15.师徒，当玩家点击师徒页面寻求名师喇叭。提示：玩家名字正在寻找一名良师，师徒双方可获得大量经验和突破丹，仙君赶紧寻高徒吧【前往收徒】。
            { ["linkType"]: channelOption.ESCORT_ORANGE, ["handle"]: this.onHandleHuSongUI, ["param"]: "", ["disposeTextFun"]: this.onDisposeHuSong, ["disposeColor"]: null },	//2.护送，当玩家镖车是橙色，开始护送后。提示：玩家名字在西游护送活动中护送了橙色镖车，各路的神仙妖怪赶紧来抢【速去拦截】
            // { ["linkType"]: channelOption.ACTIVITY_TEAM, ["handle"]: this.onHandleGlobalBossUI, ["param"]:0,["checkFun"]:false},	//8.跨服组队，当玩家创建跨服组队副本成功就有提示，提示：玩家名开启组队副本Lv几。【点击加入】。
            { ["linkType"]: channelOption.CREATE_TEAM, ["handle"]: this.onHandleTeamUI, ["param"]: 3, ["disposeTextFun"]: this.onDisposeShengSiJie, ["disposeColor"]: null },	//9.生死劫，当玩家创建生死劫副本成功就有提示，提示：玩家名生死劫副本副本名称招募打手【加入】
            { ["linkType"]: channelOption.SERVER_INST_ZONES, ["handle"]: this.onHandleActivityDungeonUI, ["param"]: 3, ["disposeTextFun"]: this.onDisposeActivityDungeon, ["disposeColor"]: null },	//开服副本
            { ["linkType"]: channelOption.CAMPAIGN_HELP_SUCCESS, ["handle"]: null, ["param"]: "", ["disposeTextFun"]: this.onDisposeCmpaignHelp, ["disposeColor"]: null },	//关卡协助
            { ["linkType"]: channelOption.ESCORT_REVENGE, ["handle"]: null, ["param"]: "", ["disposeTextFun"]: this.onDisposeRevenge, ["disposeColor"]: null },	//复仇成功
            { ["linkType"]: channelOption.COLOREGG, ["handle"]: null, ["param"]: "", ["disposeTextFun"]: this.onDisposeEgg, ["disposeColor"]: null },	//彩蛋
            { ["linkType"]: channelOption.GLOBALMINE_JOIN, ["handle"]: this.onHandelGlobalMineJoin, ["param"]: "", ["disposeTextFun"]: this.onDisposeGlobalMinejoin, ["disposeColor"]: null },	//跨服争霸队伍招募
            { ["linkType"]: channelOption.GLOBALMINE_ENTER_MINE, ["handle"]: this.onHandelGlobalMineEnter, ["param"]: "", ["disposeTextFun"]: this.onDisposeGlobalMineEnter, ["disposeColor"]: null },	//跨服争霸前往矿藏
            { ["linkType"]: channelOption.NORMAL_INST_ZONES, ["handle"]: this.onHandelNormalInstZones, ["param"]: "", ["disposeTextFun"]: this.onDisposeNormalInstZones, ["disposeColor"]: null },	//日常副本
            { ["linkType"]: channelOption.MENG_ZHU, ["handle"]: null, ["param"]: "", ["disposeTextFun"]: this.onDisposeWulinMengZhuText1, ["disposeColor"]: null },	//成为武林盟主
            { ["linkType"]: channelOption.NEW_MENG_ZHU, ["handle"]: null, ["param"]: "", ["disposeTextFun"]: this.onDisposeWulinMengZhuText2, ["disposeColor"]: null },	//击败盟主，成为新的盟主
            { ["linkType"]: channelOption.CAMPAIGN_PASS, ["handle"]: this.onHandleCampaignPass, ["param"]: "", ["disposeTextFun"]: this.onPassCampaignText, ["disposeColor"]: null },	//击败盟主，成为新的盟主
            { ["linkType"]: channelOption.STRONGHOLD_BE_ROB, ["handle"]: this.onHandleStrongholdBeRob, ["param"]: "", ["disposeTextFun"]: this.onStrongholdBeRobText, ["disposeColor"]: null },	//据点被掠夺
            { ["linkType"]: channelOption.SHENHUN_SHOW, ["handle"]: this.onHandelShenHun, ["param"]: "", ["disposeTextFun"]: this.onShenhunText, ["disposeColor"]: null },	//神魂展示
            { ["linkType"]: channelOption.GOD_PET_LOTTERY, ["handle"]: this.onHandleMiLuUI, ["param"]: "", ["disposeTextFun"]: this.onDisposeMiLuText, ["disposeColor"]: null },	//寻宝或者幸运抽奖(玩家名字在幸运转盘中抽中道具名。【前往】)


            //客户端自己定义的
            { ["linkType"]: channelOption.C_ITEM, ["handle"]: this.onHandleItemUI, ["param"]: "", ["disposeTextFun"]: null, ["disposeColor"]: this.onDisposeItemColor },	//物品展示
            { ["linkType"]: channelOption.C_CLUB_APPLY, ["handle"]: this.onHandleClubApplyUI, ["param"]: "", ["disposeTextFun"]: null, ["disposeColor"]: null },	//17.帮会招人，帮会正在招兵买马，老大带领兄弟姐妹们吃香喝辣【点击申请】。
            { ["linkType"]: channelOption.C_QIUZHU, ["handle"]: this.onHandleQiuZhuUI, ["param"]: "", ["disposeTextFun"]: null, ["disposeColor"]: null },	//10.关卡求助，当玩家求助选择发送频道后，提示：玩家名字江湖救急，求大神帮忙过关卡名称【进入】
            { ["linkType"]: channelOption.C_PET_SHOW, ["handle"]: this.onHandlePetUI, ["param"]: "", ["disposeTextFun"]: null, ["disposeColor"]: this.onDisposePetColor },	//宠物展示
            { ["linkType"]: channelOption.C_FABAO_SHOW, ["handle"]: this.onHandelFaBaoUI, ["param"]: "", ["disposeTextFun"]: null, ["disposeColor"]: this.onDisposeFaBaoColor },	//法宝展示
            { ["linkType"]: channelOption.C_ROLE_SHOW, ["handle"]: this.onHandelRoleUI, ["param"]: "", ["disposeTextFun"]: null, ["disposeColor"]: this.onDisposeRoleColor },	//角色展示

            { ["linkType"]: channelOption.C_BASE_PET_SHOW, ["handle"]: this.onHandelBasePetUI, ["param"]: "", ["disposeTextFun"]: null, ["disposeColor"]: this.onDisposeBasePetColor },	//宠物基础展示  

            { ["linkType"]: channelOption.C_SHENHUN_SHOW, ["handle"]: this.onHandelShenHun_C, ["param"]: "", ["disposeTextFun"]: null, ["disposeColor"]: this.onDisposeBasePetColor },	//宠物基础展示   
            { ["linkType"]: channelOption.C_GODPET_MILU, ["handle"]: this.onHandelGodPetMilu, ["param"]: "", ["disposeTextFun"]: null, ["disposeColor"]: null },	//宠物基础展示                    
        ]

        //进阶配置
        this.advanceConfig = [
            { index: cellOptionsIndex.HeroRide, handle: this.onGoRideAdvanceUI, param: "" },
            { index: cellOptionsIndex.HeroWing, handle: this.onGoWingAdvanceUI, param: "" },
            { index: cellOptionsIndex.PetTongLin, handle: this.onGoTongLingAdvanceUI, param: "" },
            { index: cellOptionsIndex.PetSouHun, handle: this.onGoShouHunAdvanceUI, param: "" },
            { index: cellOptionsIndex.XianLvFaZhen, handle: this.onGoFaZhenAdvanceUI, param: "" },
            { index: cellOptionsIndex.XianLvXianWei, handle: this.onGoXianWeiAdvanceUI, param: "" },
            { index: cellOptionsIndex.TianXian, handle: this.onGoTianXianAdvanceUI, param: "" },
            { index: cellOptionsIndex.TianXianWeapon, handle: this.onGoTianXianWeaponAdvanceUI, param: "" },
            { index: cellOptionsIndex.TianNv, handle: this.onGoTianNvAdvanceUI, param: "" },
            { index: cellOptionsIndex.TianNvXianQi, handle: this.onGoTianNvXianQiAdvanceUI, param: "" },
            { index: cellOptionsIndex.TianNvHuaNian, handle: this.onGoTianNvHuaNianAdvanceUI, param: "" },
            { index: cellOptionsIndex.TianNvLingQi, handle: this.onGoTianNvLingQiAdvanceUI, param: "" },
        ]

    }

    //把系统发的事件event 处理数据并显示到世界上
    runSystemChat(config, data) {
        if (data == null || data[0] == null) {
            // if (config.event != channelOption.WILD_BOSS_RUN && config.event != channelOption.WILD_BOSS_REFRESH) {
            //     return
            // }
            // if (config.event == channelOption.COLOREGG){
            // let inde = 1
            // }
            return
        }

        //跨服副本 不够等级 跳过
        if (config.event == channelOption.CREATE_TEAM) {
            let activityIndex = data[3] || 0
            if (activityIndex == OrdinaryActivityIndex.ServerTeam) {
                let level = GetHeroProperty("level")
                let campaignId = data[4]
                let campaignLevel = GameConfig.GlobalTeamConfig[campaignId].level
                if (level < campaignLevel) {
                    return
                }
            }
        }

        let myId = GetHeroProperty("id")
        let packet = MessageLogic.ChannelMsgPacket.newObj()
        packet.roleId = -1


        // packet.channel = channelType.WORLD
        packet.sexId = GetHeroProperty("sexId")
        packet.vocation = GetHeroProperty("vocation")
        packet.icon = 10001
        let [str, chatType] = this.disposeText(config, data) //处理超链接文字
        // let test1 = str
        // let test2 = chatType
        packet.data = str
        packet.timestamp = GetServerTime()
        packet.channel = chatType

        //公会副本特殊处理
        if (config.event == channelOption.CREATE_TEAM && data[3] == OrdinaryActivityIndex.FactInstZones) {
            packet.name = data[1]
            packet.sexId = data[5] || 1
            packet.vocation = data[6] || 10001
            packet.roleId = data[1]
        }

        //据点信息特殊处理
        if (config.event == channelOption.STRONGHOLD_BE_ROB) {
            packet.name = ""
        }

        if (data[0] == myId) {
            packet.roleId = myId
            packet.name = GetHeroProperty("name")
        }

        // packet.linkData = data
        ChannelMrg.getInstance().addChannelMsg(chatType, packet)
        if (chatType == 3) {
            ChannelMrg.getInstance().addChannelMsg(channelType.SYSTEM, packet)
        }
    }

    //targetId = 0 就是不用参数并打开默认配置的路径，要设置参数等特殊处理才设置targetId
    disposeText(config, data) {
        let chatType = channelType.SYSTEM
        let str = config.des
        let event = config.event
        let linkTypeConfig = this.linkTypeConfig
        let _config = config
        for (let _ in linkTypeConfig) {
            let config = linkTypeConfig[_]
            if (config.linkType == event) {   //对应的事件
                let func: Function = config.disposeTextFun
                if (func) {
                    [str, chatType] = func.call(this, _config, data)
                }
                break
            }
        }
        return [str, chatType]
    }

    ////////////////////////////////响应处理////////////////////////////////
    onHandleItemUI(data) {
        let quality = data.playerId || 2
        let itemId = data.targetId

        let itemRefInfo = ItemSystem.getInstance().getItemTemplateInfo(itemId)
        let item = Item.newObj()
        item.initWithRef(itemRefInfo)
        item.propertyInfo.quality = quality

        if (itemRefInfo.type == 4) {
            let wnd: FaBaoItemTipsFrame = WngMrg.getInstance().getWindow("FaBaoItemTipsFrame")
            wnd.onShowWnd(item, false)
        } else {
            let window = WngMrg.getInstance().getWindow("ItemHintFrame")
            window.showItemHint(item)
        }
    }

    onHandleHuSongUI(param) {
        let [flag, str] = CheckMainFrameFunction("huodong")
        if (flag) {
            WngMrg.getInstance().showWindow("EscortFrame");
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    onHandleBossUI(index) {
        let wnd = WngMrg.getInstance().getWindow("BossMainFrame")
        let curLevel = GetHeroProperty("level") || 0
        if (index == 2) {
            let [flag, str] = CheckMainFrameFunction("yewaiBOSS")
            if (flag) {
                wnd.showBossFrame(index)
            } else {
                MsgSystem.addTagTips(str)
            }
        } else if (index == 3) {
            let [flag, str] = CheckMainFrameFunction("shengsijie")
            if (flag) {
                wnd.showBossFrame(index)
            } else {
                MsgSystem.addTagTips(str)
            }
        } else {
            wnd.showBossFrame(index)
        }
    }

    onHandleShopUI(index) {
        let wnd = WngMrg.getInstance().getWindow("ShopZhuangBanFrame")
        wnd.showWithIndex(index)
    }

    onHandleClubDungeonUI(data) {
        // let factionId = GetHeroProperty("faction") || 0
        // if(factionId == 0)
        let wnd = WngMrg.getInstance().getWindow("ClubFrame")
        wnd.showWithIndex(2)
        //SendGameMessage
    }

    // onHandleGlobalBossUI(index){
    //     let [flag,str] = CheckMainFrameFunction("global")
    //     if(flag){
    //         let wnd = WngMrg.getInstance().getWindow("global") 
    //         wnd.showGlobalFrame(index)
    //     }else{
    //         MsgSystem.addTagTips(str)
    //     }  
    // }

    onHandleQiuZhuUI(data) {
        let help = defaultValue.CAMPAIGN_HELP - (getSaveRecord(opSaveRecordKey.campaignHelpCount))
        if (help == defaultValue.CAMPAIGN_HELP) {
            MsgSystem.addTagTips(Localize_cns("CAMPAIGN_TXT17"))
            return
        }
        let playerId = data.playerId
        let targetId = data.targetId
        let campaignId = CampaignSystem.getInstance().getCurOpenCampaign()
        if (targetId >= campaignId) {
            MsgSystem.addTagTips(Localize_cns("CAMPAIGN_TXT12"))
            return
        }
        let myId = GetHeroProperty("id")
        if (myId != playerId) {
            RpcProxy.call("C2G_CampaginFight", targetId, playerId)
        } else {
            MsgSystem.addTagTips(Localize_cns("CAMPAIGN_TXT13"))
        }
    }

    onHandleLuckyUI(data) {
        let acticityIndex = data.targetId
        // let index = 0
        // if(acticityIndex == PayActivityIndex.PET_LOTTERY){
        // 	index = 1
        // }
        let wnd = WngMrg.getInstance().getWindow("LuckyFrame")
        wnd.showWithIndex(acticityIndex)
    }

    onHandleActivityMainUI(param) {
        WngMrg.getInstance().showWindow("ActivityListFrame")
    }

    onHandleSanShengUI(index) {
        let [flag, str] = CheckMainFrameFunction("sanshengsanshi")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("SanShengSanShiFrame")
            if (index == 2) {
                wnd.showWithIndex(index, 2)
            } else {
                wnd.showWithIndex(index)
            }
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    onHandelGodPetMilu(){
        FastJumpSystem.getInstance().gotoFastJump("pet_milu")
    }

    //组队
    onHandleTeamUI(data) {
        let acticityIndex = data.playerId   //活动ID
        let targetId = data.targetId    //人物ID
        let campaignId = tonumber(data.campaignId)
        let curLevel = GetHeroProperty("level") || 0
        let myId = GetHeroProperty("id")
        if (targetId == myId) {      //不能进入自己的请求
            MsgSystem.addTagTips(Localize_cns("HyperLink_TXT6"))
            return
        }
        if (CheckFightState() == true) {
            return
        }

        if (CheckActivityState() == false) {
            return
        }
        //判断是否在活动
        let cur_state_type = StateManager.getInstance().GetCurrentStateType()
        let state_type1 = state_type.LIVE_BASE_STATE
        let mapId = MapSystem.getInstance().getMapId()
        if (cur_state_type != state_type1 || mapId == 50100) {
            MsgSystem.addTagTips(Localize_cns("HyperLink_TXT8"))
            return
        }

        if (acticityIndex == OrdinaryActivityIndex.LifeAndDeathBoss) {  //生死劫
            let wnd = WngMrg.getInstance().getWindow("BossBefallFrame")
            let [flag, str] = CheckMainFrameFunction("shengsijie")
            if (flag) {
                let actInfo = GetActivity(ActivityDefine.Boss).getActInfo(OrdinaryActivityIndex.LifeAndDeathBoss)
                let maxIndex = -1
                if (actInfo) {
                    maxIndex = actInfo.maxIndex
                }

                if (maxIndex + 1 >= campaignId) {
                    wnd.showWidthCampId(campaignId)
                } else {
                    MsgSystem.addTagTips(Localize_cns("HyperLink_TXT5"))
                    return
                }
            } else {
                MsgSystem.addTagTips(str)
                return
            }
        } else if (acticityIndex == OrdinaryActivityIndex.FactInstZones) { //公会副本
            let wnd = WngMrg.getInstance().getWindow("ClubFrame")
            wnd.showWithIndex(2, campaignId - 100)
        } else if (acticityIndex == OrdinaryActivityIndex.ServerTeam) {  //跨服
            let [flag, str] = CheckMainFrameFunction("global")
            if (flag) {
                let level = GameConfig.GlobalTeamConfig[campaignId].level
                if (curLevel >= level) {
                    let wnd = WngMrg.getInstance().getWindow("GlobalMainFrame")
                    wnd.showWidthCampId(GlobalMainFrame.GLOBALMAIN_TAB_TEAM, campaignId)
                } else {
                    MsgSystem.addTagTips(Localize_cns("HyperLink_TXT4"))
                    return
                }

            } else {
                MsgSystem.addTagTips(str)
                return
            }
        }
        //判断是否在答题
        RpcProxy.call("C2G_ApplyTeam", targetId, acticityIndex, campaignId)
    }

    onHandleClubApplyUI(param) {
        let factionId = GetHeroProperty("faction") || 0
        let level = GetHeroProperty("level") || 0
        if (level < 52) {
            MsgSystem.addTagTips(Localize_cns("CLUB_TXT131"))
            return
        }
        if (factionId == 0) {
            let clubId = tonumber(param.targetId) || 0
            // let message = GetMessage(opCodes.C2G_FACTION_APPAY)
            // message.clubId = clubId
            // message.applyReason = " "
            // SendGameMessage(message)	//-申请加入军团
            RpcProxy.call("C2G_FactionApply", clubId, "")
            MsgSystem.addTagTips(Localize_cns("CLUB_TXT124"))   //提示成功把
        } else {
            MsgSystem.addTagTips(Localize_cns("CHAT_TXT8"))
        }
    }

    onHandlePetUI(data) {
        let playerId = data.playerId    //人物
        let entryId = data.targetId    //宠物ID
        RpcProxy.call("C2G_ChannelPetItem", playerId, 1, entryId)
        // let wnd = WngMrg.getInstance().getWindow("PetPreviewFrame")
        // wnd.showWithPetEntry(entryId)
    }

    onHandelFaBaoUI(data) {
        let playerId = data.playerId    //法宝
        let entryId = data.targetId
        RpcProxy.call("C2G_ChannelPetItem", playerId, 3, entryId)
    }

    onHandelRoleUI(data) {
        let playerId = data.playerId
        let targetId = data.targetId
        if (targetId && targetId > 100000) {
            RpcProxy.call("C2G_GetPlayerInfoByID", targetId)
        }
        // else{
        // MsgSystem.addTagTips(Localize_cns("CHAT_TXT3"))
        // }     
    }

    onHandelShenHun_C(data) {
        let itemId = data.playerId
        let quality = data.targetId
        let enhanceLevel = tonumber(data.campaignId)
        let item = Item.newObj({ entry: itemId, quality: quality, enhanceLevel: enhanceLevel })
        let wnd: ShenHunItemTipsFrame = WngMrg.getInstance().getWindow("ShenHunItemTipsFrame")
        wnd.onShowWnd(item)
    }

    //基础宠物展示
    onHandelBasePetUI(data) {
        let itemId = data.playerId
        let quality = data.targetId
        let petId = ItemSystem.getInstance().getPetIdByItemId(itemId)
        let wnd = WngMrg.getInstance().getWindow("PetPreviewFrame");
        wnd.showWithPetEntry(petId)
    }

    onHandleActivityDungeonUI(data) {
        if (ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.NEW_SERVER_INST_ZONES)) {
            let wnd = WngMrg.getInstance().getWindow("OpenServerMainFrame");
            wnd.showActFrame(PayActivityIndex.NEW_SERVER_INST_ZONES)
        }
    }

    //跨服争霸队伍招募
    onHandelGlobalMineJoin(data) {
        let actTeamId = data.playerId
        let targetId = data.targetId

        if (GetActivity(ActivityDefine.GlobalMining).isStart() == false) {
            ExecuteMainFrameFunction("wakuang")

            let func = function () {
                let mapId = MapSystem.getInstance().getMapId()
                if (mapId != Activity_GlobalMining.MAPID) {
                    return
                }

                RpcProxy.call("C2G_MineApplyActTeam", actTeamId)
            }
            DelayEventEvecuteFunc(EventDefine.HERO_ENTER_MAP, func, this)
        } else {
            RpcProxy.call("C2G_MineApplyActTeam", actTeamId)
        }
    }

    //跨服争霸进入某矿
    onHandelGlobalMineEnter(data) {
        let mineId = data.playerId
        let targetId = data.targetId

        if (GetActivity(ActivityDefine.GlobalMining).isStart() == false) {
            ExecuteMainFrameFunction("wakuang")

            // let func = function() {
            //     let mapId = MapSystem.getInstance().getMapId()
            //     if (mapId != Activity_GlobalMining.MAPID) {
            //         return
            //     }

            //     RpcProxy.call("C2G_MineApplyActTeam", actTeamId)
            // }
            // DelayEventEvecuteFunc(EventDefine.HERO_ENTER_MAP, func, this)
            // MsgSystem.addTagTips(Localize_cns(""))
        } else {
            RpcProxy.call("C2G_MineApplyActTeam", mineId)
            let npc = ActorManager.getInstance().getNpc(mineId)
            if (npc) {
                GetActivity(ActivityDefine.GlobalMining).onClickActor(npc)
            }
        }
    }

    onHandelNormalInstZones(data) {
        if (ActivitySystem.getInstance().checkActivityIsOpen(PayActivityIndex.NORMAL_INST_ZONES)) {
            let wnd = WngMrg.getInstance().getWindow("CarnivalFrame");
            wnd.showActFrame(PayActivityIndex.NORMAL_INST_ZONES)
        }
    }

    onHandelShenHun(data) {
        let level = playerOptions.shenhun
        if (GetHeroProperty("level") < level) {
            let msg = String.format(Localize_cns("GUIDE_TXT3"), level)
            MsgSystem.addTagTips(msg)
            return
        }
        let wnd: ShenHunFrame = WngMrg.getInstance().getWindow("ShenHunFrame")
        wnd.showWnd()
    }

    onHandleMiLuUI(data){
        let level = 25
        if (GetHeroProperty("level") < level) {
            let msg = String.format(Localize_cns("GUIDE_TXT3"), level)
            MsgSystem.addTagTips(msg)
            return
        }
        WngMrg.getInstance().showWindow("MiLuFrame");
    }

    //////////////////////////////各种进阶玩法start////////////////////////////
    onHandleAdvanceUI(data) {
        let index = data.targetId
        let advanceConfig = ChannelHyperlinkMrg.getInstance().getAdvanceConfig()
        for (let _ in advanceConfig) {
            let config = advanceConfig[_]
            if (config.index == index) {
                let func: Function = config.handle
                if (func) {
                    func.call(this, config.param)
                }
                break
            }
        }
    }

    onGoRideAdvanceUI(param) {
        let [flag, str] = CheckMainFrameFunction("zuoqi")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("RoleFrame")
            wnd.showWithIndex(2)
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    onGoWingAdvanceUI(wndName) {
        let [flag, str] = CheckMainFrameFunction("chibang")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("RoleFrame")
            wnd.showWithIndex(3)
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    onGoTongLingAdvanceUI(wndName) {
        let [flag, str] = CheckMainFrameFunction("tongling")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("PetFrame")
            wnd.showWithIndex(2)
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    onGoShouHunAdvanceUI(wndName) {
        let [flag, str] = CheckMainFrameFunction("shouhun")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("PetFrame")
            wnd.showWithIndex(3)
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    onGoFaZhenAdvanceUI(wndName) {
        let [flag, str] = CheckMainFrameFunction("fazhen")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("XianLvFrame")
            wnd.showWithIndex(1)
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    onGoXianWeiAdvanceUI(wndName) {
        let [flag, str] = CheckMainFrameFunction("xianwei")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("XianLvFrame")
            wnd.showWithIndex(2)
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    onGoTianXianAdvanceUI(wndName) {
        let [flag, str] = CheckMainFrameFunction("tianxian")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("TianXianFrame")
            wnd.showWithIndex(0)
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    onGoTianXianWeaponAdvanceUI(wndName) {
        let [flag, str] = CheckMainFrameFunction("shenbing")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("TianXianFrame")
            wnd.showWithIndex(1)
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    onGoTianNvAdvanceUI(wndName) {
        let [flag, str] = CheckMainFrameFunction("tiannv")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("TianNvFrame")
            wnd.showWithIndex(0)
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    onGoTianNvXianQiAdvanceUI(wndName) {
        let [flag, str] = CheckMainFrameFunction("xianqi")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("TianNvFrame")
            wnd.showWithIndex(1)
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    onGoTianNvHuaNianAdvanceUI(wndName) {
        let [flag, str] = CheckMainFrameFunction("huanian")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("TianNvFrame")
            wnd.showWithIndex(2)
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    onGoTianNvLingQiAdvanceUI(wndName) {
        let [flag, str] = CheckMainFrameFunction("lingqi")
        if (flag) {
            let wnd = WngMrg.getInstance().getWindow("TianNvFrame")
            wnd.showWithIndex(3)
        } else {
            MsgSystem.addTagTips(str)
        }
    }

    /////////////////////////////各种进阶玩法end/////////////////////////////
    ////////////////////////////////响应处理//////////////////////////////// 


    //////////////////////////////处理文本star//////////////////////////////
    onDisposeClubDungeon(config, data) {
        return ""
    }

    //妖怪开启
    onDisposeActivityMain(config, data) {
        let myId = GetHeroProperty("id")
        let chatType = channelType.SYSTEM
        let targetId = 0
        let str = String.format(config.des, XmlConverter.LinkSign, myId, targetId, XmlConverter.LinkSign)
        return [str, chatType]
    }

    //野外BOSS神装
    onDisposeBoss1(config, data) {
        let chatType = channelType.SYSTEM
        let myId = GetHeroProperty("id")
        let targetId = 0
        let str = String.format(config.des, XmlConverter.LinkSign, myId, targetId, XmlConverter.LinkSign)
        return [str, chatType]
    }

    //野外BOSS刷新
    onDisposeBoss2(config, data) {
        let myId = GetHeroProperty("id")
        let targetId = 0
        let name = data[0]
        let cc = GameConfig.BossWildConfig
        let entryId = cc[data[1]].entryId
        let bossName = GetMonsterName(entryId)
        let str = String.format(config.des, name, bossName, XmlConverter.LinkSign, myId, targetId, XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //友情币商店
    onDisposeShop(config, data) {
        let myId = GetHeroProperty("id")
        let targetId = 0
        // let entryId = data[0]
        let entryId = 40014
        let itemInfo = ItemSystem.getInstance().getItemTemplateInfo(entryId)
        let itemName = itemInfo.name
        let itemQuality = itemInfo.quality
        let str = String.format(config.des, XmlConverter.LinkSign, myId, targetId, XmlConverter.LinkSign, XmlConverter.LinkSign, itemQuality, entryId, itemName, XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //通用进阶
    onDisposeAdvance(config, data) {
        let myId = GetHeroProperty("id")
        let playerName = data[0]
        let advanceLevel = data[2]
        let id = data[1]
        let text = this.getFunctionName(id)
        let str = String.format(config.des, playerName, text, advanceLevel, XmlConverter.LinkSign, myId, id, XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //抽奖
    onDisposeLucky(config, data) {
        let myId = GetHeroProperty("id")
        let text = Localize_cns("LUCKY_TXT1")
        if (data[0] == PayActivityIndex.PET_LOTTERY) {
            text = Localize_cns("LUCKY_TXT2")
        }
        let name = data[1]
        let item = data[2][0]
        let entryId = item[1]
        let itemInfo = ItemSystem.getInstance().getItemTemplateInfo(entryId)
        let itemName = itemInfo.name
        let itemQuality = itemInfo.quality
        let quality = item[3] || itemQuality
        let str = String.format(config.des, name, text, XmlConverter.LinkSign, quality, entryId, itemName, XmlConverter.LinkSign, XmlConverter.LinkSign, myId, data[0], XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //BOSS逃跑
    onDisposeBossRun(config, data) {
        let str = config.des
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //结婚
    onDisposeMarry(config, data) {
        let myId = GetHeroProperty("id")
        let targetId = 0
        let playerName1 = data[0]
        let playerName2 = data[1]
        let str = String.format(config.des, playerName1, playerName2, XmlConverter.LinkSign, myId, targetId, XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //师徒
    onDisposeShitu(config, data) {
        let myId = GetHeroProperty("id")
        let targetId = 0
        let playerName = data[0]
        let str = String.format(config.des, playerName, XmlConverter.LinkSign, myId, targetId, XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //护送
    onDisposeHuSong(config, data) {
        let myId = GetHeroProperty("id")
        let targetId = 0
        let playerName = data[1]
        let str = String.format(config.des, playerName, XmlConverter.LinkSign, myId, targetId, XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //组队副本
    onDisposeShengSiJie(config, data) {
        // let str = ""
        // let chatType = ""
        let des = config.des
        let chatType = channelType.SYSTEM
        let id = data[0]
        let name = data[1]
        let uid = data[2]
        let activityIndex = data[3]
        let str = "OrdinaryActivityIndex" + activityIndex
        let campaignId = data[4]
        if (activityIndex == OrdinaryActivityIndex.LifeAndDeathBoss) {  //生死劫
            let DungeonName = Localize_cns("HyperLink_TXT1")
            let campaignName = GameConfig.BossBefallConfig[campaignId].read
            str = String.format(des, name, DungeonName, campaignName, XmlConverter.LinkSign, activityIndex, id, campaignId, XmlConverter.LinkSign)
        } else if (activityIndex == OrdinaryActivityIndex.FactInstZones) { //公会副本
            chatType = channelType.FACTION
            let DungeonName = Localize_cns("HyperLink_TXT2")
            let campaignName = String.format(Localize_cns("ROLE_TXT34"), (campaignId - 99)) //等级索引从100开始的
            str = String.format(Localize_cns("CLUB_TXT129"), DungeonName, campaignName, XmlConverter.LinkSign, activityIndex, id, campaignId, XmlConverter.LinkSign)
            // str = String.format(des,name,DungeonName,campaignName,XmlConverter.LinkSign,activityIndex, id,campaignId, XmlConverter.LinkSign)
        } else if (activityIndex == OrdinaryActivityIndex.ServerTeam) {  //跨服
            let DungeonName = Localize_cns("HyperLink_TXT3")

            let campaignName = String.format(Localize_cns("ROLE_TXT34"), GameConfig.GlobalTeamConfig[campaignId].level)
            str = String.format(des, name, DungeonName, campaignName, XmlConverter.LinkSign, activityIndex, id, campaignId, XmlConverter.LinkSign)
        }
        return [str, chatType]
    }

    //开服副本
    onDisposeActivityDungeon(config, data) {
        let myId = GetHeroProperty("id")
        let targetId = 0
        let playerName = data[0]
        let index = data[1]
        let campianName = GameConfig.NewServerInstZonesConfig[index].indexName
        let str = String.format(config.des, playerName, campianName, XmlConverter.LinkSign, myId, targetId, XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //关卡求助
    onDisposeCmpaignHelp(config, data) {
        let helpName = data[0]
        let beHelpedName = data[1]
        let campaignId = data[2]
        let campaignName = CampaignSystem.getInstance().getCampaignName(campaignId)
        let str = String.format(config.des, helpName, beHelpedName, campaignName)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //护送复仇
    onDisposeRevenge(config, data) {
        let myId = GetHeroProperty("id")
        let targetId = 0
        let playerName1 = data[0]
        let playerName2 = data[1]
        let str = String.format(config.des, playerName1, playerName2, XmlConverter.LinkSign, myId, targetId, XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    onDisposeEgg(config, data) {
        let myId = GetHeroProperty("id")
        let targetId = 0
        let roleId = data[0]
        let roleName = data[1]
        let index = data[2]
        let itemId = data[3]
        let petConfig = ItemSystem.getInstance().getPetConfigByItemId(itemId)
        let petName = petConfig.name
        let quality = petConfig.quality
        let str = ""
        let des = ""
        let luckyGoIndex = PayActivityIndex.PET_LOTTERY_A
        if (index == 1) {
            des = GameConfig.HyperLinkConfig[channelOption.C_COLOREGG_XUNBAO].des
            str = String.format(des, roleName, XmlConverter.LinkSign, itemId, quality, petName, XmlConverter.LinkSign,
                XmlConverter.LinkSign, myId, luckyGoIndex, XmlConverter.LinkSign)
        } else if (index == 2) {
            des = GameConfig.HyperLinkConfig[channelOption.C_COLOREGG_BUZHUA].des
            str = String.format(des, roleName, XmlConverter.LinkSign, itemId, quality, petName, XmlConverter.LinkSign)
        } else if (index == 3) {
            des = GameConfig.HyperLinkConfig[channelOption.C_COLOREGG_XIEZHU].des
            str = String.format(des, roleName, XmlConverter.LinkSign, itemId, quality, petName, XmlConverter.LinkSign)
        }
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    onDisposeGlobalMinejoin(config, data) {
        let id = data[0]
        let name = data[1]
        let actTeamId = data[2]

        let str = String.format(config.des, name, XmlConverter.LinkSign, actTeamId, XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    onDisposeGlobalMineEnter(config, data) {
        let id = data[0]
        let name = data[1]
        let mineId = data[2]

        let font = ""
        let mineName = ""
        if (GameConfig.GlobalMiningConfig[mineId]) {
            mineName = GameConfig.GlobalMiningConfig[mineId].title

            let fontXml = {
                [1]: "#lime",
                [2]: "#cyan",
                [3]: "#magenta",
                [4]: "#lightsalmon",
            }
            if (fontXml[GameConfig.GlobalMiningConfig[mineId].mType]) {
                font = fontXml[GameConfig.GlobalMiningConfig[mineId].mType]
            }
        }

        let str = String.format(config.des, name, font + mineName + "#rf", XmlConverter.LinkSign, mineId, XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //狂欢副本
    onDisposeNormalInstZones(config, data) {
        let myId = GetHeroProperty("id")
        let targetId = 0
        let playerName = data[0]
        let index = data[1]
        let typeIndex = checkNull(data[2], 1)
        let campianName = GameConfig.NormalInstZonesConfig[typeIndex][index].indexName
        let str = String.format(config.des, playerName, campianName, XmlConverter.LinkSign, myId, targetId, XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //成为武林盟主
    onDisposeWulinMengZhuText1(config, data) {
        let playerName = data[0]
        let playerServer = data[1]
        let playerGroup = data[2]
        let text = playerName
        let str = String.format(config.des, text)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //击败盟主，成为新的盟主
    onDisposeWulinMengZhuText2(config, data) {
        let oldPlayerName = data[0]
        let oldPlayerServer = data[1]
        let oldPlayerGroup = data[2]
        let newPlayerName = data[3]
        let newPlayerServer = data[4]
        let newPlayerGroup = data[5]
        let str = String.format(config.des, newPlayerName, oldPlayerName)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    onPassCampaignText(config, data) {
        //{campaignId, limitCount, entry.rank-limitCount}  --{关卡Id, 当前排名, 剩余名额}
        let playerName = data[0]
        let campaignId = data[1]
        let curRank = data[2]
        let leftCount = data[3]
        let campaignName = CampaignSystem.getInstance().getCampaignName(campaignId)
        let str = String.format(config.des, )
        let des = GameConfig.HyperLinkConfig[channelOption.CAMPAIGN_PASS].des
        str = String.format(des, playerName, curRank, campaignName, leftCount, XmlConverter.LinkSign, campaignId, curRank, XmlConverter.LinkSign)
        if (curRank > 35) {
            str = String.format(Localize_cns("CAMPAIGN_TXT32"), playerName, campaignName, XmlConverter.LinkSign, campaignId, curRank, XmlConverter.LinkSign)
        }
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    onStrongholdBeRobText(config, data) {
        let beRobbedTime = data[0]
        let playerId1 = data[1]
        let playerName1 = data[2]
        let playerId2 = data[3]
        let playerName2 = data[4]

        let str = String.format(config.des, playerName1, playerName2, XmlConverter.LinkSign, playerId1, playerId2, beRobbedTime, XmlConverter.LinkSign)

        let chatType = channelType.FACTION
        return [str, chatType]
    }

    onShenhunText(config, data) {
        let id = GetHeroProperty("id")
        let playerName = data[1]
        let itemInfo = data[2][0]
        let quality = itemInfo.quality
        let enhanceLevel = itemInfo.enhanceLevel
        let entry = itemInfo.itemId
        let name = GameConfig.itemConfig[entry].name
        let str = String.format(config.des, playerName, XmlConverter.LinkSign, entry, quality, enhanceLevel, name, XmlConverter.LinkSign, XmlConverter.LinkSign, id, 0, XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    onDisposeMiLuText(config, data){
        let myId = GetHeroProperty("id")
        let name = data[1]
        let item = data[2][0]
        let entryId = item[1]
        let itemInfo = ItemSystem.getInstance().getItemTemplateInfo(entryId)
        let itemName = itemInfo.name
        let itemQuality = itemInfo.quality
        let quality = item[3] || itemQuality
        let str = String.format(config.des, name, XmlConverter.LinkSign, quality, entryId, itemName, XmlConverter.LinkSign, XmlConverter.LinkSign, myId, data[0], XmlConverter.LinkSign)
        let chatType = channelType.SYSTEM
        return [str, chatType]
    }

    //////////////////////////////处理文本end//////////////////////////////

    //////////////////////////////处理点击文本颜色start//////////////////////////////
    //物品颜色处理
    onDisposeItemColor(data) {
        let quality = data.playerId
        let entryId = data.targetId
        let itemInfo = ItemSystem.getInstance().getItemTemplateInfo(entryId)
        let itemName = itemInfo.name
        // let quality = itemInfo.quality || 2
        let color = GetQualityColorStr(quality, true)
        return color
    }

    onDisposePetColor(data) {
        let quality = data.campId
        let color = GetQualityColorStr(quality, true)
        return color
    }


    onDisposeFaBaoColor(data) {
        let quality = data.campId
        let color = GetQualityColorStr(quality, true)
        return color
    }


    onDisposeRoleColor(data) {
        let sexId = data.playerId
        let color = GetQualityColorStr(3, true)
        if (sexId > 0) {
            if (sexId == 1) {
                color = "cyan"
            } else {
                color = "pink"
            }
        }

        return color
    }

    onDisposeBasePetColor(data) {
        let quality = data.targetId
        let color = GetQualityColorStr(quality, true)
        return color
    }


    onHandleCampaignPass() {
        let wnd = WngMrg.getInstance().getWindow("CampaignRecordFrame")
        wnd.showWithIndex(0)
    }

    onHandleStrongholdBeRob(data) {
        if (CheckEndFightNow() == false)
            return

        if (GetHeroProperty("level") < StrongholdConfig.openLevel) {
            return MsgSystem.addTagTips(String.format(Localize_cns("STRONGHOLD_TEXT28"), StrongholdConfig.openLevel))
        }
        let playerId1 = data.playerId
        let playerId2 = data.targetId
        let beRobbedTime = tonumber(data.campaignId)
        if (playerId2 == GetHeroProperty("id")) {
            return MsgSystem.addTagTips(Localize_cns("STRONGHOLD_TEXT51"))
        }
        RpcProxy.call("C2G_StrongholdRevenge", playerId1, playerId2, beRobbedTime)
    }

    //////////////////////////////处理点击文本颜色end//////////////////////////////

    //将约定格式组装成超链接xml
    analyzeHyperLink(content, contentColor, linkColor, defalut_font) {
        let color = contentColor || "white"
        let _linkColor = "lime" || linkColor
        let _defalut_font = defalut_font || "ht_20_cc_stroke"
        function parseLinkHandler(linkContent) {
            let info: any = {}
            info.link = null
            info.name = null
            info.color = null
            let _linkType = tonumber(StringUtil.stringMatch(linkContent, /(\d+)/))

            let linkType, playerId, targetId, campId, content = null
            if (_linkType == channelOption.CREATE_TEAM || _linkType == channelOption.C_PET_SHOW
                || _linkType == channelOption.C_FABAO_SHOW || _linkType == channelOption.STRONGHOLD_BE_ROB ||  _linkType == channelOption.C_SHENHUN_SHOW) {	//特殊处理
                [linkType, playerId, targetId, campId, content] = StringUtil.stringMatch(linkContent, /(\d+);(\d+);(\d+);(\d+);(.+)/)
            } else {
                [linkType, playerId, targetId, content] = StringUtil.stringMatch(linkContent, /(\d+);(\d+);(\d+);(.+)/)
            }
            if (!linkType || !playerId || !targetId || !content) {
                return null
            }
            let data = { "linkType": linkType, "playerId": playerId, "targetId": targetId, "campId": campId }

            info.name = content
            info.link = StringUtil.stringReplace(linkContent, " ", "-")
            info.color = _linkColor
            let linkTypeConfig = ChannelHyperlinkMrg.getInstance().getLinkConfig()
            for (let _ in linkTypeConfig) {
                let config = linkTypeConfig[_]
                if (config.linkType == _linkType) {
                    let func: Function = config.disposeColor
                    if (func != null) {
                        info.color = func.call(this, data)
                    }
                    break
                }
            }
            return info
        }

        let param: any = {}
        param.no_change_font = true
        param.default_color = color
        param.defalut_font = _defalut_font
        param.link_parser = parseLinkHandler
        return XmlConverter.parseText(content, param)
    }

    //超链接点击
    hyperLinkClick(linkContent) {
        // let wnd = WngMrg.getInstance().getWindow("ChatInChannelFrame")
        // let mCurSendChannel = wnd.mCurSendChannel
        // //跨服不响应超链接
        // if (mCurSendChannel == channelType.SERVER) {
        // 	return
        // }

        let _linkType = tonumber(StringUtil.stringMatch(linkContent, /(\d+)/))
        let linkType, playerId, targetId, campaignId, content = null
        if (_linkType == channelOption.CREATE_TEAM || _linkType == channelOption.STRONGHOLD_BE_ROB || _linkType == channelOption.C_SHENHUN_SHOW) {	//特殊处理
            [linkType, playerId, targetId, campaignId, content] = StringUtil.stringMatch(linkContent, /(\d+);(\d+);(\d+);(\d+);(.+)/)
        } else {
            [linkType, playerId, targetId, content] = StringUtil.stringMatch(linkContent, /(\d+);(\d+);(\d+);(.+)/)
        }
        if (!linkType || !playerId || !targetId || !content) {
            return null
        }

        linkType = tonumber(linkType)
        let _playerId = tonumber(playerId)	//日常操作 都是自己的ID
        let _targetId = tonumber(targetId)	//主要是根据这个判断 需要传值进去打开界面不
        let _data = { "playerId": _playerId, "targetId": _targetId, "campaignId": campaignId }
        let linkTypeConfig = ChannelHyperlinkMrg.getInstance().getLinkConfig()
        for (let _ in linkTypeConfig) {
            let config = linkTypeConfig[_]
            if (config.linkType == linkType) {
                let func: Function = config.handle
                if (func) {
                    if (_targetId > 0) {
                        func.call(this, _data)
                        //没有传值 就默认配置直接打开吧
                    } else {
                        func.call(this, config.param)
                    }
                }
                break
            }
        }
    }


    //获取超链接配置
    getLinkConfig() {
        return this.linkTypeConfig
    }

    //获取进阶配置
    getAdvanceConfig() {
        return this.advanceConfig
    }

    //根据功能ID获取队友的名字
    getFunctionName(functionId) {
        return Localize_cns(("Function_TXT" + functionId))
    }

    //发送超链接
    sendHyperLinkMessage(hyperLinkText) {
        let message = GetMessage(opCodes.C2G_CHANNEL_SEND)
        message.channel = channelType.WORLD
        message.data = hyperLinkText
        SendGameMessage(message)
    }
}