// TypeScript file


//资源组定义
let ResGroupDisposeTime = 1000 * 300


module GameConfig {




    //==========================================资源组预加载=================================================
    class ResGroupkUnit extends WorkUnit {
        groupName: string;
        public initObj(...params: any[]): void {
            this.groupName = params[0]
        }

        protected destory(): void {

        }

        //返回true表示完成
        //返回false，则在完成后回调notifyComplete
        public onExcute(): boolean {
            //IGlobal.resGroupManager.loadGroup(this.groupName, this)
            IGlobal.resGroupManager.loadGroup(this.groupName)
            return true;
        }

        // onResGroupLoad(groupName: string): void {
        //     this.notifyExcuteComplete()
        // }
    }







    function _initResouceGroupConfig(data, workQueue: WorkQueue) {
        let groupConfig = readCSV(data)

        let groupNameInfo = {};

        for (let k in groupConfig) {
            let v = groupConfig[k]
            IGlobal.resGroupManager.addGroupConfig(v.groupName, v.path, v.type)
            if (groupNameInfo[v.groupName] == null) {
                groupNameInfo[v.groupName] = true;
            }
        }

        //资源析构时间，毫秒单位

        for (let groupName in groupNameInfo) {
            let group = IGlobal.resGroupManager.getGroup(groupName)
            group.setDisposeTime(ResGroupDisposeTime);
        }
        //静态的不析构
        let group = IGlobal.resGroupManager.getGroup(ResourceGroupDefine.Group_Static)
        if (group)
            group.setDisposeTime(-1)

        //预加载资源
        workQueue.addWorkUnitFirst(ResGroupkUnit.newObj(ResourceGroupDefine.Group_Static));
        workQueue.addWorkUnitFirst(ResGroupkUnit.newObj(ResourceGroupDefine.Group_EnterGame));
    }

    function _initGameImageSetList(workQueue) {
        for (var k in ImageSetListConfig) {
            var v = ImageSetListConfig[k];
            if (v.type != "login") {
                workQueue.addWorkUnit(ImageSetWorkUnit.newObj(v.filename));
            }
        }
    }


    export function initResourceFirst(workQueue: WorkQueue) {

        workQueue.addWorkUnit(ZipWorkUnit.newObj(ZipFileListDefine.ConfigZip, true))
        workQueue.addWorkUnit(ZipWorkUnit.newObj(ZipFileListDefine.ConfigUIZip, true))
        workQueue.addWorkUnit(ZipWorkUnit.newObj(ZipFileListDefine.ConfigMapZip, false))


        _initGameImageSetList(workQueue)

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\resource_group.csv", _initResouceGroupConfig, this, workQueue));
    }

    export function initGuideResourceGroupConfig(workQueue: WorkQueue) {
        // let guideGroup = IGlobal.resGroupManager.getGroup(ResourceGroupDefine.Group_Guide, true)
        // if (guideGroup)
        //     guideGroup.setDisposeTime(ResGroupDisposeTime);

        // let addModelResPath = function (modelId: number) {
        //     let v = ModelConfig[modelId]
        //     if (v == null)
        //         return;
        //     let isbin = v.dbbin == 1;

        //     let tex_path = v.modelpath + "/" + v.model + "_tex.png";
        //     let tex_json = v.modelpath + "/" + v.model + "_tex.json";
        //     let ske_path = v.modelpath + "/" + v.model + "_ske.json";
        //     if (isbin) {
        //         ske_path = v.modelpath + "/" + v.model + "_ske.dbbin";
        //     }

        //     guideGroup.addResItemConfig(tex_path, core.ResourceType.TYPE_IMAGE)
        //     guideGroup.addResItemConfig(tex_json, core.ResourceType.TYPE_JSON)
        //     guideGroup.addResItemConfig(ske_path, core.ResourceType.TYPE_BIN)
        // }

        // workQueue.addWorkUnit(CallbackWorkUnit.newObj(function () {
        //     //预加载NPC
        //     let preloadNpcIds = [21001, 21003, 21004] //圣地新手怪
        //     for (let entryId of preloadNpcIds) {
        //         let npcRef = npcConfig[entryId]
        //         if (npcRef == null)
        //             continue;

        //         addModelResPath(npcRef.model)
        //     }

        //     //预加载模型
        //     let preloadModelIds = [7000, 3010]
        //     for (let preModelId of preloadModelIds) {
        //         addModelResPath(preModelId)
        //     }

        //     //动态创建新手组资源
        //     //guideGroup.addResItemConfig()
        //     workQueue.addWorkUnitFirst(ResGroupkUnit.newObj(guideGroup.name));
        // }));



    }
    ////////////////////////////////////////////////////////////////////////////////

    export var npcConfig: any = {};
    export var MonsterConfig: any = {};
    export var ModelConfig: any = {};
    export var MonsterScopeConfig: any = {};
    export var EffectConfig: any = {};
    export var ModelShapeConfig: any = {};

    //地图图片信息
    function _initMapStaticConfig(data) {
        //var tileMap = IGlobal.mapManager.getTileMap();
        var static_set = readCSVEx(data, 3, false);
        for (var k in static_set) {
            var info = static_set[k];

            var id = parseInt(info[1]);
            var path = info[2];
            var width = parseInt(info[3]);
            var height = parseInt(info[4]);
            IGlobal.mapManager.setStaticImage(id, path, width, height);
        }
    }

    function _initMapFrameAnimConfig(data) {
        let frame_anim_info_list = readCSV(data);
        for (var k in frame_anim_info_list) {
            var v = frame_anim_info_list[k];
            IGlobal.mapManager.addAreaAnimConfig(v.name, v.path, v.delay, v.scale);
        }
    }

    function _initMapParticleConfig(data) {
        let outside_particle_info_list = readCSV(data);
        for (var k in outside_particle_info_list) {
            var v = outside_particle_info_list[k];
            IGlobal.mapManager.addAreaParticleConfig(v.name, v.path);
        }
    }


    //模型信息
    function _initModelDeine(data) {
        ModelConfig = readCSV(data);

        for (var k in ModelConfig) {
            var v = ModelConfig[k];
            v.model = null;
            var path: string = v.modelpath;

            if (path == "") {
                //TLog.Error("ModelDefine: %s modelpath=%s", v.entryId, v.modelpath);
                continue;
            }
            var strList = path.split("/");

            var texturename: string = v.texturename;
            var modelname = strList[strList.length - 1];

            v.model = modelname;
            let isbin = v.dbbin == 1;
            IGlobal.spriteMangaer.defineModelPath(modelname, path, isbin);
        }
    }



    export function initGameWorldCommonCsv(workQueue: WorkQueue) {

        workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/MapClient/static.csv", _initMapStaticConfig, this));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/MapClient/sprite_frame_anim.csv", _initMapFrameAnimConfig, this));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/MapClient/sprite_outside_particle.csv", _initMapParticleConfig, this));


        workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/npc.csv", readCSV, this, npcConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/ModelMonster.csv", readCSV, this, MonsterConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/ModelMonsterScope.csv", readCSV, this, MonsterScopeConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/ModelDefine.csv", _initModelDeine, this, ModelConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/ModelShape.csv", readCSV, this, ModelShapeConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data/config/ModelEffect.csv", readCSV, this, EffectConfig));
    }






    //==========================================地图系统=================================================
    export var MapConfig = {};
    //export var MapTipsConfig = {};
    export var MapLinkConfig = {};
    export var MapEnterList = {};
    //export var MapCampaignList = {};
    //export var MapTransferList = {};


    function _loadMapJumpCsv(data) {
        //var MapLinkConfig = GameConfig.MapLinkConfig;
        var MapLinkTable = readCSV(data)

        for (var index in MapLinkTable) {
            var record = MapLinkTable[index];
            if (MapLinkConfig[record.outMapId] == null) {
                //formerMapId = record.outMapId
                MapLinkConfig[record.outMapId] = []
            }

            //if record.type == 1 then //普通跳转
            //	record.outX = npcConfig[record.npcId].x
            //	record.outY = npcConfig[record.npcId].y
            //end
            MapLinkConfig[record.outMapId].push(record);
        }
        MapLinkTable = null
    }

    export function initMapSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Map\\map.csv", readCSV, this, MapConfig));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Map\\mapJumpTips.csv", readCSV, this, MapTipsConfig));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\map_jump.csv", _loadMapJumpCsv, this));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\map_enter.csv", readCSV, this, MapEnterList));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\map_campaign.csv", readCSV, this, MapCampaignList));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\map_transfer.csv", readCSV, this, MapTransferList));
    }


    //==========================================战斗系统=================================================
    export var FightActionConfig = {}


    function _loadFightActionConfig(data: string) {
        FightActionConfig = JsUtil.JsonDecode(data);

        let fightSystem: FightSystem = FightSystem.getInstance();
        fightSystem.getConfigSystem().initFightActonConfig();
    }

    function initPositionDefine(data) {
        //var positionConfig = readCSV(data);
        POS_MAPPING_DEFINE = {}
        //for _, v in pairs(positionConfig) do
        //for (var i in positionConfig) {
        //    var v = positionConfig[i];
        //
        //    var lx = v.x > 320 ? 320 : v.x;
        //    var ly = v.y
        //      var rx = 640 - lx
        //
        //    POS_MAPPING_DEFINE[fightSide.FIGHT_LEFT] = POS_MAPPING_DEFINE[fightSide.FIGHT_LEFT] || {}
        //    POS_MAPPING_DEFINE[fightSide.FIGHT_LEFT][v.pos] = [lx, ly]
        //
        //    POS_MAPPING_DEFINE[fightSide.FIGHT_RIGHT] = POS_MAPPING_DEFINE[fightSide.FIGHT_RIGHT] || {}
        //    POS_MAPPING_DEFINE[fightSide.FIGHT_RIGHT][v.pos] = [rx, ly]
        //}
        //positionConfig = null;
        let indexToPos = [4, 5, 3, 6, 2, 7, 1, 10, 11, 9, 12, 8, 14, 15, 13, 16]
        let [centerX, centerY] = [FIGHT_CENTER_X, FIGHT_CENTER_Y]
        //	let deepV, deepH = 3, 4
        let cRow = 100               //左右-敌我距离
        let rawcenter = -Math.PI / 2.5
        let [cRowX, cRowY] = [cRow * Math.cos(Math.abs(rawcenter)), cRow * Math.sin(Math.abs(rawcenter))]

        let row = 100                //同排的距离
        let raw = -Math.PI / 6//FIGHT_MAP_ANGLE 同排角度
        let [rowX, rowY] = [row * Math.cos(Math.abs(raw)), row * Math.sin(Math.abs(raw))]
        let pRow = 80               //同向两排间的距离
        let [pRowX, pRowY] = [pRow * Math.cos(Math.abs(raw)), pRow * Math.sin(Math.abs(raw))]
        let list: any = {}

        function genPosHandler(r, cenX, cenY, index, side) {
            for (let i = 1; i <= 4; i++) {
                let [cX, cY] = [cenX + (i - 1) * pRowX * r + r * cRowX, cenY + (i - 1) * pRowY * r + r * cRowY]
                index = index + 1
                //JsUtil.arrayInstert(list, {cX, cY, index})
                POS_MAPPING_DEFINE[side] = checkNull(POS_MAPPING_DEFINE[side], {})
                POS_MAPPING_DEFINE[side][indexToPos[index - 1]] = [cX, cY]

                for (let j = 1; j <= 4 - i; j++) {
                    var [ex, ey] = [cX + j * rowX, cY - j * rowY]
                    index = index + 1
                    POS_MAPPING_DEFINE[side][indexToPos[index - 1]] = [ex, ey]

                    ex = cX - j * rowX
                    ey = cY + j * rowY
                    index = index + 1
                    POS_MAPPING_DEFINE[side][indexToPos[index - 1]] = [ex, ey]
                }
            }
        }
        genPosHandler(1, centerX, centerY, 0, fightSide.FIGHT_RIGHT)
        genPosHandler(-1, centerX, centerY, 0, fightSide.FIGHT_LEFT)
    }


    export function initFightSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Combat\\fighterPosition.csv", initPositionDefine, this));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Combat\\fightAction.json", _loadFightActionConfig, this, FightActionConfig))


        let fightSystem: FightSystem = FightSystem.getInstance();
        var clientConfig = fightSystem.getConfigSystem().clientConfig;
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Combat\\clientCombatPlayer.csv", readCSV, this, clientConfig.playerList));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Combat\\clientCombatPower.csv", readCSV, this, clientConfig.powersList));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Combat\\clientCombatResult.csv", readCSV, this, clientConfig.resultList));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Combat\\clientCombatDialog.csv", readCSV, this, clientConfig.dialogFileList));
    }


    //==========================================技能系统=================================================
    export var SkillClientConfig = {};
    //export var SkillUpgradeCondition = {};
    // export var SkillCommonDefineConfig = {};
    // export var SkillDefineConfig = {};
    // export var SkillLevelDefineConfig = {};

    export var SkillDescribeConfig = {};
    // export var SkillExtraDescribeConfig = {};

    export var SkillPetActiveConfig = {};
    export var SkillPetPassiveConfig = {}

    export function initSkillSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Skill\\Skill.csv", readCSV, this, SkillClientConfig));
        // //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorSkillUp.csv", readCSV, this, SkillUpgradeCondition));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\SkillCommonDefine.csv", readCSV, this, SkillCommonDefineConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\SkillDefine.csv", readCSV, this, SkillDefineConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\SkillLevelDefine.csv", readCSV, this, SkillLevelDefineConfig));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Skill\\SkillDescribe.csv", readCSV, this, SkillDescribeConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Skill\\SkillExtraDescribe.csv", readCSV, this, SkillExtraDescribeConfig));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorPetSkill.csv", readCSV, this, SkillPetActiveConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorPetPassiveSkill.csv", readCSV, this, SkillPetPassiveConfig));
    }


    //==========================================Buff系统=================================================
    export var BuffConfig = {};
    export function initBuffSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Skill\\buff.csv", readCSV, this, BuffConfig));
    }


    //==========================================伙伴系统=================================================
    export var PetConfig = {};
    export var PartnerAwakeConfig = {}
    export var PartnerEvolutionConfig = {}
    //export var PartnerSkillConfig = {}
    export var PartnerBreakConfig = {}
    export var PartnerSpiritConfig = {}
    export var PartnerOrVocationLinkConfig = {}
    // export var UpgradeItemConfig = {}
    // export var NaturalStoneConfig = {}
    // export var NaturalStoneUpgradeConfig = {}
    //export var PetModelConfig = {}

    // export var SoulEntrtIdToPartnerId = {};
    // export var PetSummonConfig = {}

    //export var PetMagicCircleConfig = {};
    //export var GrowAbilityLevelRatioConfig = {}

    export var PetFunTipsConfig = {};

    export var PetComPoundConfig = {};
    export var PetUnionTreeConfig = {};

    // function _intSpirtConfig(data) {
    //     readCSV(data, PartnerSpiritConfig)

    //     for (let partnerid in PartnerSpiritConfig) {
    //         let v = PartnerSpiritConfig[partnerid]
    //         SoulEntrtIdToPartnerId[v.soulEntryId] = partnerid
    //     }
    // }

    // function _initPartnerAwakeConfig(data) {
    //     readCSV(data, PartnerAwakeConfig)

    //     for (let index in PartnerAwakeConfig) {
    //         let levellist = PartnerAwakeConfig[index]
    //         for (let leve in levellist) {
    //             let v = levellist[leve]

    //             if (Array.isArray(v.ConGrow) == false) {
    //                 let valuelist = [0, 0, 0, 0, 0]
    //                 for (let i = 1; i <= 5; i++) {
    //                     let val = v.ConGrow[i]
    //                     if (val != null) {
    //                         valuelist[i - 1] = val
    //                     }
    //                 }
    //                 v.ConGrow = valuelist  //转换成数组
    //             }
    //         }
    //     }
    // }

    // function _initPartnerModel(data) {
    //     PetModelConfig = {}
    //     let list = readCSV(data)

    //     for (let _ in list) {
    //         let t = list[_]

    //         let entryId = t.entryId
    //         let breakLevel = t.breakLevel
    //         let qualityLevel = t.qualityLevel
    //         PetModelConfig[entryId] = checkNull(PetModelConfig[entryId] , {})
    //         PetModelConfig[entryId][breakLevel] = checkNull(PetModelConfig[entryId][breakLevel] , {})
    //         PetModelConfig[entryId][breakLevel][qualityLevel] = t															//[entryId][breakLevel][qualityLevel]
    //     }
    // }

    export function initPetSystemCsv(workQueue: WorkQueue) {
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\Partner.csv", readCSV, this, PetConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\PartnerAwake.csv", _initPartnerAwakeConfig, this, PartnerAwakeConfig));
        // //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\PartnerSkill.csv", readCSV, this, PartnerSkillConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\PartnerBreak.csv", readCSV, this, PartnerBreakConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\PartnerEvolution.csv", readCSV, this, PartnerEvolutionConfig));

        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\PartnerSpirit.csv", _intSpirtConfig, this, PartnerSpiritConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\PartnerOrVocationLink.csv", readCSV, this, PartnerOrVocationLinkConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\UpgradeItem.csv", readCSV, this, UpgradeItemConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\NaturalStone.csv", readCSV, this, NaturalStoneConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\NaturalStoneUpgrade.csv", readCSV, this, NaturalStoneUpgradeConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\PartnerModel.csv", _initPartnerModel, this, PetModelConfig));

        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Monster\\PetQuickRecruit.csv", readCSV, this, PetSummonConfig));

        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\PetMagicCircle.csv", readCSV, this, PetMagicCircleConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\LevelToAbilityGrowRatio.csv", readCSV, this, GrowAbilityLevelRatioConfig));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorPet.csv", readCSV, this, PetConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorPetFunTips.csv", readCSV, this, PetFunTipsConfig));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorPetCompound.csv", readCSV, this, PetComPoundConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorPetUnion.csv", readCSV, this, PetUnionTreeConfig));

    }

    export var FakeChatConfig = {}
    export var GroupCmdConfig = {}
    //export var AnimalConfig = {}
    export var RoleHonorConfig = {}
    export var FakeChatConfig = {}//新手机器人对白
    export var FakeBoxWorldChatConfig = {}//新手假宝箱（世界频道）
    export var FakeBoxChatConfig = {}//新手假宝箱
    export var EasterEggChatConfig = {}//彩蛋

    export var ProfessionModelConfig = {};
    export var ActorRoleSkillConfig = {};
    export var ActorRoleConfig = {};


    function _initFakeChat(data) {

        let list = readCSV(data)

        FakeChatConfig = {}									//新手机器人对白
        for (let i = FakeChatId.SPROG_BEGIN; i <= FakeChatId.SPROG_END - 1; i++) {
            if (list[i]) {
                FakeChatConfig[i] = list[i]
            }
        }

        FakeBoxWorldChatConfig = {}									//新手假宝箱（世界频道）
        for (let i = FakeChatId.SPROG_BOX_WORLD_BEGIN; i <= FakeChatId.SPROG_BOX_WORLD_End - 1; i++) {
            if (list[i]) {
                FakeBoxWorldChatConfig[i] = list[i]
            }
        }

        FakeBoxChatConfig = {}									//新手假宝箱
        for (let i = FakeChatId.SPROG_BOX_BEGIN; i <= FakeChatId.SPROG_BOX_End - 1; i++) {
            if (list[i]) {
                FakeBoxChatConfig[i] = list[i]
            }
        }

        EasterEggChatConfig = {}    //彩蛋系统
        for (let i = FakeChatId.EGG_BOX_BEGIN; i <= FakeChatId.EGG_BOX_End - 1; i++) {
            if (list[i]) {
                EasterEggChatConfig[i] = list[i]
            }
        }
    }
    //  export var HeroAwakeConfig = {}
    // export var HeroBreakConfig = {}
    export function initRoleSystemCsv(workQueue: WorkQueue) {

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\FakeChat.csv", _initFakeChat, this, FakeChatConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\groupcmd.csv", readCSV, this, GroupCmdConfig));

        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\GodAnimal.csv", readCSV, this, AnimalConfig));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\PlrAwake.csv", readCSV, this, HeroAwakeConfig));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\PlrBreak.csv", readCSV, this, HeroBreakConfig));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\honor.csv", readCSV, this, RoleHonorConfig));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\ProfessionModel.csv", readCSV, this, ProfessionModelConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorRoleSkill.csv", readCSV, this, ActorRoleSkillConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorRole.csv", readCSV, this, ActorRoleConfig));
    }



    //==========================================守护系统=================================================
    // export var SpiritSkillConfig = {};
    // export var DefendExpConfig = {};
    // export var DefendImageUnlockConfig = {};
    // export var DefendSkillHoleConfig = {};
    // export var DefendSkillUnlockConfig = {};
    // export var DefendSkillLockConfig = {};

    export function initDefendSystemCsv(workQueue: WorkQueue) {
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Wing\\SpiritSkill.csv", readCSV, this, SpiritSkillConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Wing\\WingExp.csv", readCSV, this, DefendExpConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Wing\\WingImageUnlock.csv", readCSV, this, DefendImageUnlockConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Wing\\WingSkillHole.csv", readCSV, this, DefendSkillHoleConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Wing\\WingSkillUnlock.csv", readCSV, this, DefendSkillUnlockConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Wing\\WingSkillLock.csv", readCSV, this, DefendSkillLockConfig));
    }


    //==========================================物品系统=================================================
    export var itemConfig = {};
    export var EquipConfigNew2 = {};
    export var Legendequip = {};

    export var CommonEquip = {};
    export var CommonEquipEffect = {};
    export var CommonEquipMelt = {};
    export var RoleEquipSuit = {};
    export var RoleEquip = {};
    export var RoleEquipEffect = {};
    export var RoleEquipMelt = {};
    export var RoleEquipRefineConfig = {};
    export var RoleEquipUpConfig = {};


    export var TalismanEquip = {};
    export var TalismanEquipEffectConfig = {};
    export var TalismanEquipUpConfig = {};
    export var TalismanEquipMeltConfig = {};

    export var RoleEquipResonateConfig = {};

    export var RoleEquipSkillConfig = {};

    export var ShenHunEquipConfig = {};
    export var ShenHunEquipEffectConfig = {};
    export var ShenHunEquipUpConfig = {};
    export var ShenHunLieHunConfig = {};
    export var ShenHunEquipMeltConfig = {};
    // export var EquipEnhance = {};
    // export var EquipmakeConfig = {};
    // export var EquipSpecialSkillEffectConfig = {};
    // export var EquipInheritConfig = {};
    //export var MaterialListConfig = {};
    // export var EquipResonateEffectConfig = {};

    // export var SacrificeConfig = {};
    // export var SacrificeImageUnlockConfig = {};


    // function _initLegendEquip(data) {
    //     readCSV(data, Legendequip)

    //     for (let i in Legendequip) {
    //         let v = Legendequip[i]
    //         itemConfig[i] = v;
    //         //JsUtil.arrayInstert(itemConfig,i,v) 
    //     }
    // }


    export function initItemSystemCsv(workQueue: WorkQueue) {

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\item.csv", readCSV, this, itemConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\equipConfigNew2.csv", readCSV, this, EquipConfigNew2));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\LegendEquip.csv", readCSV, this, Legendequip));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\CommonEquip.csv", readCSV, this, CommonEquip));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\CommonEquipEffect.csv", readCSV, this, CommonEquipEffect));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\CommonEquipMelt.csv", readCSV, this, CommonEquipMelt));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\RoleEquipSuit.csv", readCSV, this, RoleEquipSuit));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\RoleEquip.csv", readCSV, this, RoleEquip));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\RoleEquipEffect.csv", readCSV, this, RoleEquipEffect));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\RoleEquipMelt.csv", readCSV, this, RoleEquipMelt));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\RoleEquipRefine.csv", readCSV, this, RoleEquipRefineConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\RoleEquipUp.csv", readCSV, this, RoleEquipUpConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\RoleEquipSkill.csv", readCSV, this, RoleEquipSkillConfig));



        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\TalismanEquip.csv", readCSV, this, TalismanEquip));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\TalismanEquipEffect.csv", readCSV, this, TalismanEquipEffectConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\TalismanEquipUp.csv", readCSV, this, TalismanEquipUpConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\TalismanEquipMelt.csv", readCSV, this, TalismanEquipMeltConfig));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\RoleEquipResonate.csv", readCSV, this, RoleEquipResonateConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\EquipEnhance.csv", readCSV, this, EquipEnhance));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\equipMake.csv", readCSV, this, EquipmakeConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\EquipSpecialSkillEffect.csv", readCSV, this, EquipSpecialSkillEffectConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\EquipInherit.csv", readCSV, this, EquipInheritConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\MaterialList.csv", readCSV, this, MaterialListConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\EquipResonateEffect.csv", readCSV, this, EquipResonateEffectConfig));

        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Sacrifice.csv", readCSV, this, SacrificeConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\SacrificeImageUnlock.csv", readCSV, this, SacrificeImageUnlockConfig))

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\ShenHunEquip.csv", readCSV, this, ShenHunEquipConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\ShenHunEquipEffect.csv", readCSV, this, ShenHunEquipEffectConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\ShenHunEquipUp.csv", readCSV, this, ShenHunEquipUpConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\ShenHunLieHun.csv", readCSV, this, ShenHunLieHunConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\ShenHunEquipMelt.csv", readCSV, this, ShenHunEquipMeltConfig));

        workQueue.addWorkUnit(CallbackWorkUnit.newObj(function () {
            let neweffect = {};
            for (let i in CommonEquipEffect) {
                let v = CommonEquipEffect[i]
                if (neweffect[v.Pos] == null) {
                    neweffect[v.Pos] = {}
                }
                if (neweffect[v.Pos][v.Stage] == null) {
                    neweffect[v.Pos][v.Stage] = {}
                }
                neweffect[v.Pos][v.Stage][v.Quality] = v
            }
            CommonEquipEffect = neweffect
            //for (let i in CommonEquipEffect){
            //   let v = CommonEquipEffect[i]
            //}

            let eeffect = {};
            for (let i in RoleEquipEffect) {
                let v = RoleEquipEffect[i]
                if (eeffect[v.Suit] == null) {
                    eeffect[v.Suit] = {}
                }
                if (eeffect[v.Suit][v.Quality] == null) {
                    eeffect[v.Suit][v.Quality] = {}
                }
                eeffect[v.Suit][v.Quality][v.subtype] = v
            }
            RoleEquipEffect = eeffect
            //for (let i in RoleEquipEffect){
            //   let v = RoleEquipEffect[i]
            //}
            for (let i in CommonEquip) {
                let v = CommonEquip[i]
                itemConfig[i] = v;
            }
            for (let i in RoleEquip) {
                let v = RoleEquip[i]
                itemConfig[i] = v;
            }
        }));

        workQueue.addWorkUnit(CallbackWorkUnit.newObj(function () {
            for (let i in TalismanEquip) {
                let v = TalismanEquip[i]
                itemConfig[i] = v;
            }
        }));

        workQueue.addWorkUnit(CallbackWorkUnit.newObj(function () {
            for (let i in ShenHunEquipConfig) {
                let v = ShenHunEquipConfig[i]
                itemConfig[i] = v;
            }
        }));
    }

    //==========================================职业系统=================================================
    // export var ProfessionConfig = {};
    // export var ProfessionListConfig = {};
    //export var ProfessionSkillConfig = {};
    // export var VocationTypeConfig = {};
    // export var NaturalStoneConfig = {};


    // export function initProfessionSystemCsv(workQueue: WorkQueue) {
    //     // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\Vocation.csv", _initVocationConfig, this, ProfessionConfig));
    //     // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\VocationList.csv", readCSV, this, ProfessionListConfig));
    //     //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\VocationSkill.csv", readCSV, this, ProfessionSkillConfig));
    //     // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\VocationType.csv", readCSV, this, VocationTypeConfig));
    //     //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\NaturalStone.csv", readCSV, this, NaturalStoneConfig));
    //     workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\ProfessionModel.csv", readCSV, this, ProfessionModelConfig));
    //     workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorRoleSkill.csv", readCSV, this, ActorRoleSkillConfig));
    //     workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorRole.csv", readCSV, this, ActorRoleConfig));
    // }

    // function _initVocationConfig(data) {
    //     readCSV(data, ProfessionConfig)

    //     for (let index in ProfessionConfig) {
    //         let v = ProfessionConfig[index]
    //         if (Array.isArray(v.ConGrow) == false) {
    //             let valuelist = [0, 0, 0, 0, 0]
    //             for (let i = 1; i <= 5; i++) {
    //                 let val = v.ConGrow[i]
    //                 if (val != null) {
    //                     valuelist[i - 1] = val
    //                 }
    //             }
    //             v.ConGrow = valuelist  //转换成数组
    //         }
    //     }
    // }
    //==========================================成长系统=================================================
    // export var GrowEventTips = {};
    // export var GrowSelectTips = {};
    // export var GrowActionTips = {};
    // export var GrowLivePrice = {};
    // export var GrowSoonFinish = {};
    // export var GrowFeelPrize = {}
    export var PlayerExpConfig = {};


    export function initGrowSystemCsv(workQueue: WorkQueue) {
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\GrowEventTips.csv", readCSV, this, GrowEventTips));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\GrowSelectTips.csv", readCSV, this, GrowSelectTips));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\GrowActionTips.csv", readCSV, this, GrowActionTips));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\GrowLivePrice.csv", readCSV, this, GrowLivePrice));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\GrowSoonFinish.csv", readCSV, this, GrowSoonFinish));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\GrowFeelingPrize.csv", readCSV, this, GrowFeelPrize));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\PlayerExp.csv", readCSV, this, PlayerExpConfig));

    }




    //==========================================任务系统=================================================

    //export var TaskHeroConfig = {};
    //export var NPCMask = {};
    //export var GoddessKissConfig = {};
    export var DynamicTipsConfig = {};

    export var TaskAcceptNpcConfig = {};
    export var TaskTraceLib = {};
    export var TaskDescribe = {};
    export var TaskTraceTips = {};

    export var TaskConfig = {};
    export var DialogBoxConfig = {};
    export var TaskKeyMapping = {};


    class TaskWorkUnit extends WorkUnit {
        taskFileList: string[];
        dialogFileList: string[];
        taskKeyFileMapping: string[];


        taskList: any[];
        dialogList: any[];
        taskKeyMapping: any[];

        progress: number;

        public initObj(...params: any[]): void {

            this.taskFileList = params[0];
            this.dialogFileList = params[1];
            this.taskKeyFileMapping = params[2];

            this.taskList = []
            this.dialogList = []
            this.taskKeyMapping = []

            this.progress = 0;

        }

        protected destory(): void {

        }


        public loadConfig(configList: string[], OneCompleteFunc: (data, path, userData?) => void, allCompleteFunc: (userData?) => void, userData?: any) {
            if (configList.length == 0) {
                allCompleteFunc.call(this);
                return;
            }

            var count = 0;
            var all = configList.length;

            var callback: core.ResItemCallback = {
                onResItemLoad: (res: core.ResItem): void => {
                    OneCompleteFunc.call(this, res.getData(), res.getKey(), userData);
                    count++;
                    if (count >= all) {
                        allCompleteFunc.call(this, userData);
                    }
                },
                onResItemError: (key: string): void => {
                    count++;//表单出错
                    if (count >= all) {
                        allCompleteFunc.call(this, userData);
                    }
                }
            }

            for (var k in configList) {
                var path = configList[k];
                IGlobal.resManager.loadResAsyn(path, callback, core.ResourceType.TYPE_TEXT);
            }
        }


        private mergeTaskConfig(taskList) {
            let new_t = taskList[0]
            if (taskList.length < 2) {
                return new_t
            }

            for (let i = 1; i < taskList.length; i++) {
                for (let taskId in taskList[i]) {
                    let v = taskList[i][taskId]

                    new_t[taskId] = v
                }
            }

            return new_t
        }

        private mergeDialogConfig(dialogList) {
            let new_t: any = {}

            for (let i = 0; i < dialogList.length; i++) {
                let dialog = dialogList[i]

                for (let k in dialog) {
                    let v = dialog[k]

                    if (new_t[v.TalkId] == null) {
                        new_t[v.TalkId] = {}
                    }
                    new_t[v.TalkId][v.NodeId] = v
                }

            }

            return new_t
        }

        private mergeKeyMapping(taskKeyMapping) {
            let new_t: any = {}

            for (let i = 0; i < taskKeyMapping.length; i++) {
                let keyMapping = taskKeyMapping[i]

                for (let k in keyMapping) {
                    let v = keyMapping[k]

                    if (new_t[v.kType] == null) {
                        new_t[v.kType] = {}
                    }
                    new_t[v.kType][v.key] = v
                }

            }

            return new_t
        }



        private _completeOneConfig(data, path, userData) {
            let t = readCSV(data)
            JsUtil.arrayInstert(userData, t)
        }

        private _completeConfig(userData) {
            if (this.taskList == userData) {
                TaskConfig = this.mergeTaskConfig(this.taskList) 							//生成任务配置
            } else if (this.dialogList == userData) {
                DialogBoxConfig = this.mergeDialogConfig(this.dialogList)	    //生成对话配置
            } else if (this.taskKeyMapping == userData) {
                TaskKeyMapping = this.mergeKeyMapping(this.taskKeyMapping)
            }
            this._updateProgress()
        }

        private _updateProgress() {
            this.progress++;
            if (this.progress >= 3) {
                this.notifyExcuteComplete();
            }
        }


        public onExcute(): boolean {
            this.loadConfig(this.taskFileList, this._completeOneConfig, this._completeConfig, this.taskList)
            this.loadConfig(this.dialogFileList, this._completeOneConfig, this._completeConfig, this.dialogList)
            this.loadConfig(this.taskKeyFileMapping, this._completeOneConfig, this._completeConfig, this.taskKeyMapping)

            return false;
        }

    }




    function _initTaskFileList(data, workQueue: WorkQueue) {
        let fileList = readCSV(data)


        let taskList = []
        let dialogFileList = []
        let taskKeyMapping = []

        let taskPre = "task_"
        let actPre = "activity_"
        let dialogPre = "dialog_"
        let cnDefPre = "key_translate_"

        for (let _ in fileList) {
            let v = fileList[_]

            let file_name = v.filename
            let path = StringUtil.stringReplace(v.path, "\\\\", "/")

            if (file_name.substring(0, taskPre.length) == taskPre || file_name.substring(0, actPre.length) == actPre) {

                //let t = readCSV(path+file_name)
                JsUtil.arrayInstert(taskList, path + file_name)

            } else if (file_name.substring(0, dialogPre.length) == dialogPre) {
                //let t = readCSV(path+file_name)
                JsUtil.arrayInstert(dialogFileList, path + file_name)

                //mergeDialogFileIndex(file_name, t)		//保存文件与talkId的索引关系
            } else if (file_name.substring(0, cnDefPre.length) == cnDefPre) {
                //let t = readCSV(path+file_name)
                JsUtil.arrayInstert(taskKeyMapping, path + file_name)
            }

        }


        workQueue.addWorkUnit(TaskWorkUnit.newObj(taskList, dialogFileList, taskKeyMapping));
    }




    export function initTaskSystemCsv(workQueue: WorkQueue) {
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\task_hero_config.csv", readCSV, this, TaskHeroConfig));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\NPCMask.csv", readCSV, this, NPCMask));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\GoddessKiss.csv", readCSV, this, GoddessKissConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\auxiliary\\DynamicTips.csv", readCSV, this, DynamicTipsConfig));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\task_accpet_npc.csv", readCSV, this, TaskAcceptNpcConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\task_trace_lib.csv", readCSV, this, TaskTraceLib));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\explore_point.csv", readCSV, this, ExplorePoint));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\task_describe.csv", readCSV, this, TaskDescribe));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\task_trace_info.csv", readCSV, this, TaskTraceTips));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\task_file_list.csv", _initTaskFileList, this, workQueue));

    }






    //==========================================关卡系统=================================================
    export var CampaignConfig = {};
    export var FuncInfoConfig = {};
    // export var CampaignExciteConfig = {};
    // export var FirstCampaignPrizeConfig = {};
    // export var ExciteServerFirstConfig = {};
    // export var CampaignGiftsConfig = {}
    export var CampaignSingleConfig = {};
    export var CampaignServerConfig = {};


    export function initCampaignSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\auxiliary\\Campaign.csv", readCSV, this, CampaignConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\auxiliary\\FuncInformation.csv", readCSV, this, FuncInfoConfig));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\CampaignGifts.csv", readCSV, this, CampaignGiftsConfig));

        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\ExcitingPoint\\ExciteLimitCampaign.csv", readCSV, this, CampaignExciteConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\ExcitingPoint\\ExciteFirstCampaign.csv", readCSV, this, FirstCampaignPrizeConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\ExcitingPoint\\ExciteServerFirst.csv", readCSV, this, ExciteServerFirstConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\CampaignSinglePass.csv", readCSV, this, CampaignSingleConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\CampaignServerPass.csv", readCSV, this, CampaignServerConfig));
    }



    //==========================================活动系统=================================================
    export var RuleDescriptionConfig = {};
    export var WorldQuestionConfig = {};
    export var OnLineQuestionConfig = {};

    // export var RobberMonsterConfig = {};
    // export var RobberSkillConfig = {};
    // export var RobberSkillViewConfig = {};
    // export var RobberSkillNormalConfig = {};
    // export var RobberBossConfig = {}


    //export var SealedGroundConfig = {};


    // export var SkyTowerEnemyConfig = {};
    // export var SkyTowerExciteConfig = {};
    // export var SkyTowerServerExciteConfig = {};

    //export var FakeChatConfig = {}
    export var ChampionPrizeConfig = {}
    export var ChampionRankPrizeConfig = {}
    export var ChampionServerRankPrizeConfig = {}

    export var MeiRiQianDaoConfig = {}

    // export var SevenDayDetailPrizeConfig = {}
    // export var SevenDayPrizeConfig = {}
    // export var StartOperationConfig = {}
    // export var StartOperatePrizeConfig = {}

    //export var UnionPrizeConfig = {}
    //export var CampaginRobberConfig = {}
    export var InviteCodePrize = {}
    export var BossSingleConfig = {}
    export var BossGlobalConfig = {}
    export var BossWildConfig = {}
    export var BossBefallConfig = {}
    export var CopyMaterialConfig = {}
    export var CopyDragonConfig = {}
    export var CopyTempleConfig = {}
    export var CopyHeavenConfig = {}

    //跨服
    export var GlobalTeamConfig = {}
    export var GlobalMiningConfig = {}
    export var GlobalMineMonthRankConfig = {}

    //export var LevelFundConfig = {}

    //export var LadderConfig = {}

    //export var SystemImgConfig = {}


    export var ActivityPrizeClientConfig = {}
    export var AutoFightMonsterConfig = {}

    export var CharmRankPrizeConfig = {}

    export var OpenRankConfig = {}
    export var OpenRankPrizeConfig = {}

    //export var TeamWillConfig = {}
    export var DailyShareConfig = {}

    export var ZhongKuiDemonConfig = {}
    export var ZhongKuiGetItemConfig = {}
    export var ZhongKuiMonsterConfig = {}
    export var EveryDayLiLianUpConfig = {}
    export var EveryDayLiLianTaskConfig = {}
    export var DailyLiLianShapeConfig = {}
    export var EveryDaySanBaiConfig = {}

    export var AutoFightMonsterConfig = {}

    export var EscortConfig = {}

    export var DailyLoginConfig = {}
    export var StageUpConfig = {}
    export var DailyExpensiveGiftConfig = {}
    export var LevelRewardConfig = {}
    export var XiyouWelfareConfig = {}
    export var FactionMonsterConfig = {}

    export var TeamaDventureConfig = {}
    export var MarriageConfig = {}
    export var MarriageGiftConfig = {}
    export var FightPrizePreviewConfig = {}

    export var ShiTuPrizeConfig = {}
    export var ShiTuTaskConfig = {}

    export var NewServerAccRechargeConfig = {}                      //开服累计充值
    export var NewServerShopDiscountConfig = {}                     //开服折扣商店
    export var NewServerAllBuyConfig = {}                           //开服团购
    export var NewServerAllStageUpConfig = {}                       //全民进阶
    export var NewServerStageUpConfig = {}                          //天仙进阶
    export var NewServerAllLevelUpConfig = {}                       //全民冲级
    export var NewServerRankConfig = {}                             //天仙排行
    export var NewServerInstZonesConfig = {}                        //熊猫大侠
    export var NewServerMissionConfig = {}                          //龙宫章节

    export var StageLevelUpAConfig = {}
    export var StageLevelUpBConfig = {}
    export var ShopDiscountAConfig = {}
    export var ShopDiscountBConfig = {}
    export var AccuBuyRechargeConfig = {}
    export var NormalInstZonesConfig = {}
    export var SpecialRechargeConfig = {}
    export var AccuRechargePrizeConfig = {}
    export var AccuRechargePrizeConfig2 = {}
    export var GodPetTurnConfig = {}
    export var GodPetInComeConfig = {}
    export var ProbabilityConfig = {}

    export var ShopsplendidConfig = {}
    export var AccRechargeGiftConfig = {}
    export var FestivalRebateConfig = {}
    export var SkillWashActivityConfig = {}


    export var FallenRechargeConfig = {}
    export var ShopfallenGoodGiftConfig = {}

    export var LiuJieTouZiNumConfig = {}
    export var LiuJieTouZiPosConfig = {}

    export var WolrdOneBetPrizeConfig = {}
    export var WolrdOneCombatPrizeConfig = {}
    //function _initShare(data) {
    //    DailyShareConfig = readCSV(data);

    export var WuLinMengZhuConfig = {}
    export var WuLinMengZhuActivityRankPrizeConfig = {}
    export var WuLinMengZhuMonthRankPrizeConfig = {}
    export var WuLinMengZhuScorePrizeConfig = {}

    export var StrongholdConfig = {}
    export var StrongholdItemConfig = {}

    //}
    export function initActivitySystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\RuleDescription.csv", readCSV, this, RuleDescriptionConfig));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\ActivityPrizeClient.csv", readCSV, this, ActivityPrizeClientConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\CharmRankPrize.csv", readCSV, this, CharmRankPrizeConfig));



        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\WorldQuestion.csv", readCSV, this, WorldQuestionConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\OnlineQuestion.csv", readCSV, this, OnLineQuestionConfig));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionMap.csv", readCSV, this, SealedGroundConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\ChampionPrize.csv", readCSV, this, ChampionPrizeConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\ExcitingPoint\\ExciteJJCRank.csv", readCSV, this, ChampionRankPrizeConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\ExcitingPoint\\ExciteServerJJCRank.csv", readCSV, this, ChampionServerRankPrizeConfig));


        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\meiRiQianDao.csv", readCSV, this, MeiRiQianDaoConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\inviteCodePrize.csv", readCSV, this, InviteCodePrize));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\OpenRank.csv", readCSV, this, OpenRankConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\OpenRankPrize.csv", readCSV, this, OpenRankPrizeConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Escort.csv", readCSV, this, EscortConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\TeamaDventure.csv", readCSV, this, TeamaDventureConfig));

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\ActivationCode\\dailyShare.csv", readCSV, this, DailyShareConfig))

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\BossSingle.csv", readCSV, this, BossSingleConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\BossWorld.csv", readCSV, this, BossGlobalConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\WildBoss.csv", readCSV, this, BossWildConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\LifeAndDeathBoss.csv", readCSV, this, BossBefallConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\MaterialBoss.csv", readCSV, this, CopyMaterialConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\DragonBoss.csv", readCSV, this, CopyDragonConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\SmallThunderTemple.csv", readCSV, this, CopyTempleConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\HeavenTrial.csv", readCSV, this, CopyHeavenConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\ZhongKuiDemon.csv", readCSV, this, ZhongKuiDemonConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\ZhongKuiMonster.csv", readCSV, this, ZhongKuiMonsterConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\ZhongKuiGetItem.csv", readCSV, this, ZhongKuiGetItemConfig))
        //跨服
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Global\\GlobalTeam.csv", readCSV, this, GlobalTeamConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Global\\GlobalMine.csv", readCSV, this, GlobalMiningConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Global\\GlobalMineMonthRank.csv", readCSV, this, GlobalMineMonthRankConfig))

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\EveryDayLiLianTask.csv", readCSV, this, EveryDayLiLianTaskConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\EveryDayLilianUp.csv", readCSV, this, EveryDayLiLianUpConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\DailyLiLianShape.csv", readCSV, this, DailyLiLianShapeConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\EveryDaySanBai.csv", readCSV, this, EveryDaySanBaiConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Boss\\AutoFightMonster.csv", readCSV, this, AutoFightMonsterConfig))

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\DailyLogin.csv", readCSV, this, DailyLoginConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\StageUp.csv", readCSV, this, StageUpConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\DailyExpensiveGift.csv", readCSV, this, DailyExpensiveGiftConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\LevelReward.csv", readCSV, this, LevelRewardConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\XiyouWelfare.csv", readCSV, this, XiyouWelfareConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\FightPrizePreview.csv", readCSV, this, FightPrizePreviewConfig))

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionMonster.csv", readCSV, this, FactionMonsterConfig))

        //三生三世
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Social\\Marriage.csv", readCSV, this, MarriageConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Social\\MarriageGift.csv", readCSV, this, MarriageGiftConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Social\\ShiTuPrize.csv", readCSV, this, ShiTuPrizeConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Social\\ShiTuTask.csv", readCSV, this, ShiTuTaskConfig))

        //狂欢
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\stageLevelUpA.csv", readCSV, this, StageLevelUpAConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\stageLevelUpB.csv", readCSV, this, StageLevelUpBConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\shopDiscountA.csv", readCSV, this, ShopDiscountAConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\shopDiscountB.csv", readCSV, this, ShopDiscountBConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\AccuBuyRecharge.csv", readCSV, this, AccuBuyRechargeConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\NormalInstZones.csv", readCSV, this, NormalInstZonesConfig))
        //开服活动
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\NewServerAccuBuyRecharge.csv", readCSV, this, NewServerAccRechargeConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\AccuRechargePrize.csv", readCSV, this, AccuRechargePrizeConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\AccuRechargePrize2.csv", readCSV, this, AccuRechargePrizeConfig2))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\GodPetTurn.csv", readCSV, this, GodPetTurnConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\GodPetInCome.csv", readCSV, this, GodPetInComeConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\NewServerShopDiscount.csv", readCSV, this, NewServerShopDiscountConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\NewServerAllBuy.csv", readCSV, this, NewServerAllBuyConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\NewServerAllStageUp.csv", readCSV, this, NewServerAllStageUpConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\NewServerStageLevelUp.csv", readCSV, this, NewServerStageUpConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\NewServerAllLevelUp.csv", readCSV, this, NewServerAllLevelUpConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\NewServerRank.csv", readCSV, this, NewServerRankConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\NewServerInstZones.csv", readCSV, this, NewServerInstZonesConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\NewServerMission.csv", readCSV, this, NewServerMissionConfig))
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FightPrizePreview.csv", readCSV, this, FightPrizePreviewConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\Probability.csv", readCSV, this, ProbabilityConfig))


        //精彩活动
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\AccRechargeGift.csv", readCSV, this, AccRechargeGiftConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\FestivalRebate.csv", readCSV, this, FestivalRebateConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\Shopsplendid.csv", readCSV, this, ShopsplendidConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\SkillWashActivity.csv", readCSV, this, SkillWashActivityConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\LiuJieTouZiNum.csv", readCSV, this, LiuJieTouZiNumConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\LiuJieTouZiPos.csv", readCSV, this, LiuJieTouZiPosConfig))

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\SpecialRecharge.csv", readCSV, this, SpecialRechargeConfig))

        //幸运好礼
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\FallenRecharge.csv", readCSV, this, FallenRechargeConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\ShopfallenGoodGift.csv", readCSV, this, ShopfallenGoodGiftConfig))

        //天下第一
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\WolrdOneBetPrize.csv", readCSV, this, WolrdOneBetPrizeConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\WolrdOneCombatPrize.csv", readCSV, this, WolrdOneCombatPrizeConfig))

        //武林盟主
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\WuLinMengZhu.csv", readCSV, this, WuLinMengZhuConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\WuLinMengZhuActivityRankPrize.csv", readCSV, this, WuLinMengZhuActivityRankPrizeConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\WuLinMengZhuMonthRankPrize.csv", readCSV, this, WuLinMengZhuMonthRankPrizeConfig))
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\WuLinMengZhuScorePrize.csv", readCSV, this, WuLinMengZhuScorePrizeConfig))

        //据点
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Stronghold.csv", readCSV, this, StrongholdConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\StrongholdItem.csv", readCSV, this, StrongholdItemConfig));
    }

    //==========================================跳转系统=================================================
    export var FunTipsConfig = {};

    export function initFastJumpSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Funtips.csv", readCSV, this, FunTipsConfig));
    }
    //==========================================新手系统=================================================
    export var GuideConfig = {};
    export var FuncDefineConfig = {};
    export var FuncPreviewConfig = {};
    export var GuideChatConfig = {};

    export function initGuideSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\guide.csv", readCSV, this, GuideConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\auxiliary\\FuncDefine.csv", readCSV, this, FuncDefineConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Task\\auxiliary\\FuncPreview.csv", readCSV, this, FuncPreviewConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\GuideChat.csv", readCSV, this, GuideChatConfig));

    }



    //==========================================新手红点+超链接系统=================================================
    export var ButtonTipsConfig = {};
    export function initGuideFuncSystem(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\buttonTips.csv", readCSV, this, ButtonTipsConfig));
    }

    //==========================================VIP系统=================================================
    export var VIPExplain = {};
    export var VipEXP = {};
    export var VipPrivilege = {};
    //export var VipBuffConfig = {};
    export var VipGiftsConfig = {};
    export var VipChatBubbleConfig = {};


    export function initVipSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\VIPExplain.csv", readCSV, this, VIPExplain));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\vip.csv", readCSV, this, VipEXP));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\VipPrivilege.csv", readCSV, this, VipPrivilege));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\VipBuffEffect.csv", readCSV, this, VipBuffConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\VipGifts.csv", readCSV, this, VipGiftsConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\VipChatBubble.csv", readCSV, this, VipChatBubbleConfig));

    }


    //==========================================付费系统=================================================
    export var RechargeConfig = {};
    //export var PaySellPetConfig = {};
    export var FirstRechargeConfig = {};
    export var LevelFundsConfig = {};
    export var InvestPlanConfig = {};
    export var meiRiQianDaoConfig = {};


    export function initPaySystemCsv(workQueue: WorkQueue) {
        if (g_isExaming == true){
             workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Recharge_ios.csv", readCSV, this, RechargeConfig));
        }else{
            workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Recharge.csv", readCSV, this, RechargeConfig));
        }

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\FirstRecharge.csv", readCSV, this, FirstRechargeConfig));
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\PaySellPet.csv", readCSV, this, PaySellPetConfig));

        //成长基金
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\LevelFunds.csv", readCSV, this, LevelFundsConfig));
        //投资计划
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\Operate\\InvestPlan.csv", readCSV, this, InvestPlanConfig));
        //投资计划
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\meiRiQianDao.csv", readCSV, this, meiRiQianDaoConfig));
    }
    ////////
    // export var RelicTimeRatioConfig = {}
    // export var RelicMineConfig = {}



    //==========================================公会系统=================================================
    export var FactionActiveLevelConfig = {};
    export var FactionActiveDailyiPrizeConfig = {};
    export var FactionActiveTaskConfig = {};
    export var FactionExpConfig = {};
    export var FactionMapConfig = {};
    export var FactionMapTaskConfig = {};
    export var FactionMapTaskNpcConfig = {};
    export var FactionRenqiCondConfig = {};
    export var FactionRenqiPrizeConfig = {};
    export var FactionSkillConfig = {};
    export var FactionExchangeConfig = {};
    export var FactionRecordConfig = {};

    export function initClubSystemCsv(workQueue: WorkQueue) {

        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionActiveDailyiPrize.csv", readCSV, this, FactionActiveDailyiPrizeConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionActiveLevel.csv", readCSV, this, FactionActiveLevelConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionActiveTask.csv", readCSV, this, FactionActiveTaskConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionExp.csv", readCSV, this, FactionExpConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionInstanceZones.csv", readCSV, this, FactionMapConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionMapTask.csv", readCSV, this, FactionMapTaskConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionMapTaskNpc.csv", readCSV, this, FactionMapTaskNpcConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionRenqiCond.csv", readCSV, this, FactionRenqiCondConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionRenqiPrize.csv", readCSV, this, FactionRenqiPrizeConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionSkill.csv", readCSV, this, FactionSkillConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionExchangeItem.csv", readCSV, this, FactionExchangeConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionRecord.csv", readCSV, this, FactionRecordConfig));


        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FactionTask.csv", readCSV, this, FactionTaskConfig));
        // workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Faction\\FacTaskPointPrize.csv", readCSV, this, FacTaskPointPrizeConfig));


    }

    //==========================================坐骑系统=================================================
    //export var RideListConfig = {};

    export function initMountsSystemCsv(workQueue: WorkQueue) {
        //workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Ride\\Ride.csv", readCSV, this, RideListConfig));

    }

    //==========================================商店系统=================================================
    export var ShopCommodityConfig = {};

    export function initShopSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\shopCommodity.csv", readCSV, this, ShopCommodityConfig));
    }
    /*
        function readShopConfig(data){
            let csvConfig = readCSV(data)
    
            for(let k in csvConfig){
                let tempConfig = csvConfig[k]
                let key = shopOptionName[k]
                ShopCommodityConfig[key] = tempConfig
            }
        }*/

    //==========================================天仙系统=================================================
    export var FunTianXianDanYaoConfig = {};
    export var FunTianXianJingMaiConfig = {};
    export var FunTianXianJingMaiTypeConfig = {};
    export var ShopCommodityConfig = {};

    export function initTianXianSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunTianxianDanyao.csv", readCSV, this, FunTianXianDanYaoConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunTianxianJingmai.csv", readCSV, this, FunTianXianJingMaiConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunTianxianJingmaiType.csv", readCSV, this, FunTianXianJingMaiTypeConfig));
    }

    //==========================================锻造系统=================================================
    export var FunForgeConfig = {};
    export var FunForgeAbilityConfig = {};
    export var FunForgeMasterConfig = {};

    export function initForgeSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunForge.csv", readCSV, this, FunForgeConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunForgeAbility.csv", readCSV, this, FunForgeAbilityConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunForgeMaster.csv", readCSV, this, FunForgeMasterConfig));
    }

    //==========================================仙侣系统=================================================
    export var ActorXianLvConfig = {};
    export var ActorXianLvSkillConfig = {};
    export var ActorXianLvQiYuanConfig = {};

    export function initXianLvSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorXianlvSkill.csv", readCSV, this, ActorXianLvSkillConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorXianlv.csv", readCSV, this, ActorXianLvConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\ActorXianlvQiYuan.csv", readCSV, this, ActorXianLvQiYuanConfig));
    }


    //==========================================神兵系统=================================================
    export var ImmortalsExpConfig = {};
    export var ImmortalsViewConfig = {};

    export function initImmortalsSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\ImmortalsExp.csv", readCSV, this, ImmortalsExpConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Item\\ImmortalsView.csv", readCSV, this, ImmortalsViewConfig));

    }
    //==========================================星灵系统=================================================
    export var XingLingConfig = {}
    export function initXingLingSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\XingLing.csv", readCSV, this, XingLingConfig));

    }

    //==========================================彩蛋系统=================================================
    export var EasterEggConfig = {};

    export function initEasterEggSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Activity\\SpecialPrize.csv", readCSV, this, EasterEggConfig));
    }

    //==========================================通用界面=================================================
    export var FunUpgradeStageConfig = {};
    export var FunSkinConfig = {};
    export var FunSkillCaseConfig = {};
    export var FunShapeConfig = {};
    export var FunEquipCaseConfig = {};
    export var FunEquipCaseList = {};
    export var FunEquipCaseSubType = {};
    export var FunAbilityDrugConfig = {};
    export var FunGrowAddConfig = {}
    export var FunSpendMoneyItemConfig = {};
    export var FunUpgradeEffectConfig = {};
    export var FunUpStarConfig = {};
    export var FunSkillWashConfig = {};
    export var FunLevelNumConfig = {};
    export var FashionSuitConfig = {};
    export var TaoZhuangConfig = {};

    export function initFunSystemCsv(workQueue: WorkQueue) {
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunUpgradeStage.csv", readCSV, this, FunUpgradeStageConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunSkin.csv", readCSV, this, FunSkinConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunSkillCase.csv", readCSV, this, FunSkillCaseConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunShape.csv", readCSV, this, FunShapeConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunEquipCase.csv", readCSV, this, FunEquipCaseConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunAbilityDrug.csv", readCSV, this, FunAbilityDrugConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunGrowAdd.csv", readCSV, this, FunGrowAddConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunSpendMoneyItem.csv", readCSV, this, FunSpendMoneyItemConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunUpgradeEffect.csv", readCSV, this, FunUpgradeEffectConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunUpStart.csv", readCSV, this, FunUpStarConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunSkillWash.csv", readCSV, this, FunSkillWashConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FunLevelNum.csv", readCSV, this, FunLevelNumConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\FashionSuit.csv", readCSV, this, FashionSuitConfig));
        workQueue.addWorkUnit(ResWorkUnit.newObj("data\\config\\Actor\\TaoZhuang.csv", readCSV, this, TaoZhuangConfig));
        workQueue.addWorkUnit(CallbackWorkUnit.newObj(function () {

            for (let i in FunEquipCaseConfig) {
                let config = FunEquipCaseConfig[i].subtype
                for (let _ in config) {
                    FunEquipCaseList[config[_]] = FunEquipCaseConfig[i].title
                }
            }
            FunEquipCaseSubType = {}
            for (let typename in FunEquipCaseConfig) {
                let config = FunEquipCaseConfig[typename]
                let index = tonumber(table_getIndex(cellOptionsName, typename)) + 1
                for (let pos in config.subtype) {
                    let subtype = config.subtype[pos]
                    FunEquipCaseSubType[subtype] = [index, tonumber(pos)]
                }
            }
        }));
    }

}