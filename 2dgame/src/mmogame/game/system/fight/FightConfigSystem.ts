var STAY_IN_DEFALUT_POSITION = true

function SortFightActionList(actionList:any[]){
    actionList.sort( (t1:any, t2:any)=>{
       if(t1.startTime != t2.startTime){
            return t1.startTime - t2.startTime
       }else{	
            //优先级越大，越靠前
            var p1 = FIGHT_ACTION_PRIORITY[t1.action] || 0
            var p2 = FIGHT_ACTION_PRIORITY[t2.action] || 0
            return p2 - p1
        }
    });
}

class FightConfigSystem extends TClass{
    clientConfig:any;

    config:any;

	//子类复写 初始化函数
    public initObj(...params:any[]):void{
        this.clientConfig = {};
        this.clientConfig.playerList = {};
        this.clientConfig.powersList = {};
        this.clientConfig.resultList = {};
        this.clientConfig.dialogList = {};


        this.config = {};
    }
    //子类复写 析构函数
    protected destory(): void{
        
    }

	onClear(){

	}


    initFightActonConfig(){
        JsUtil.objectForEach(GameConfig.FightActionConfig, v=>{
            this.readActionConfig(v)
        });
    }

    //获取配置表
    getConfig(result:any){
        var code = result.code
        var spellId = result.spellId
        var spellFail = result.fail
        if(GAME_DEBUG && spellId && !this.config[spellId]){
            var combatId = result.caster
            var actor = GetFightActor(combatId)
            var entryId = actor.getProperty("entry")
            TLog.Error(String.format(Localize_cns("FIGHT_NOT_EXSIT_SKILL"), spellId, entryId))
            //暂时屏蔽
            //MsgSystem.confirmDialog_YES(String.format(Localize_cns("FIGHT_NOT_EXSIT_SKILL"), spellId, entryId))
        }
        return this.config[spellId] || this.config[0]
    }


    readActionStartCondition(condition, v){
        if(v.startEvent){
            var elemName = v.startEvent[0]
            var eventName = v.startEvent[1]
            
            if(! StringUtil.isEmpty(elemName) && ! StringUtil.isEmpty(eventName)){
                condition.push({["elem_name"]:elemName, ["event_name"]:eventName})
            }
        }
    }


    readActionFinishCondition(condition, v){
        if(v.finishEvent){
            var elemName = v.finishEvent[0]
            var eventName = v.finishEvent[1]
            
            if(! StringUtil.isEmpty(elemName) && ! StringUtil.isEmpty(eventName)){
               condition.push({["elem_name"]:elemName, ["event_name"]:eventName})
            }
        }
    }


    readParam(param):any{
        if(param == "" || param == null){
            return null
        }

        if(typeof param == "string"){
            var lpstr = StringUtil.lower(param)
            if(lpstr == "false"){
                return false
            }else if(lpstr == "true"){
                return true
            }
        }
        
        return tonumber(param) || param
    }


    readActionContent(content, v){
        content.code = v.action
	
        //for i = 1, ACTION_PARAM_COUNT do
        for(var i = 1; i <= ACTION_PARAM_COUNT; i++){
            content["param" + i] = this.readParam(v["param"+i] )
        }
    }

    //因为保存的问题，空表都用{}表示了，这里要转成[]
    transformEmptyObjToArray(obj){
        if(Array.isArray(obj) == false && size_t(obj) == 0){
            return [];
        }
        return obj;
    }


    readActionConfig(config){
        //var cur_config = table_copy(fight_action_template)
        var cur_config = {["elem_list_ready"]:[], ["elem_list_show"]:[], ["elem_list_end"]:[], }

        config.action_1 = this.transformEmptyObjToArray(config.action_1);
        config.action_2 = this.transformEmptyObjToArray(config.action_2);
        config.action_3 = this.transformEmptyObjToArray(config.action_3);

        
        SortFightActionList(config.action_1)
        SortFightActionList(config.action_2)
        SortFightActionList(config.action_3)
        
        //起手
        //var startCondition = {["elem_name"]="show_parent", ["event_name"]="begin"}
        //for i, v in ipairs(config.action_1) do
        for(var i = 0; i < config.action_1.length; i++){
            var v = config.action_1[i]
            var elem:any = {}
            elem.name = v.name
            elem.during = v.during
            elem.startTime = v.startTime
            elem.startCondition = []
            elem.finishCondition = []
            elem.content = {}
            
            this.readActionStartCondition(elem.startCondition, v)
            this.readActionFinishCondition(elem.finishCondition , v)
            this.readActionContent(elem.content, v)
            
            cur_config.elem_list_ready.push(elem);
        }
        
        //出手
        //var startCondition = {["elem_name"]="ready_anim", ["event_name"]="finish"}
        for(var i = 0; i < config.action_2.length; i++){
            var v = config.action_2[i]
            var elem:any = {}
            elem.name = v.name
            elem.during = v.during
            elem.startTime = v.startTime
            elem.startCondition = []
            elem.finishCondition = []
            elem.content = {}
            
            this.readActionStartCondition(elem.startCondition, v)
            this.readActionFinishCondition(elem.finishCondition , v)
            this.readActionContent(elem.content, v)
            
            cur_config.elem_list_show.push(elem);
        }
        
        //收手
        //var startCondition = {["elem_name"]="show_anim", ["event_name"]="finish"}
       for(var i = 0; i < config.action_3.length; i++){
            var v = config.action_3[i]
            var elem:any = {}
            elem.name = v.name
            elem.during = v.during
            elem.startTime = v.startTime
            elem.startCondition = []
            elem.finishCondition = []
            elem.content = {}
            
            this.readActionStartCondition(elem.startCondition, v)
            this.readActionFinishCondition(elem.finishCondition , v)
            this.readActionContent(elem.content, v)
            
            cur_config.elem_list_end.push(elem)
        }
        
        this.config[config.index] = cur_config
    }


    getFightPlayerList(fightID){
        if(! this.clientConfig){
            //this.initClientFightConfig()
            //this.configMark = {}
        }
        var playerList = JsUtil.objectCopy(this.clientConfig.playerList[fightID]) || []
        return playerList
    }


    getClientFightConfig(index) {
        if (!this.clientConfig) {
            //this.initClientFightConfig()
            //this.configMark = {}
        }

        var playerList = JsUtil.objectCopy(this.clientConfig.playerList[index]) || {}
        var resultList = JsUtil.objectCopy(this.clientConfig.resultList[index]) || {}
        var powersList = this.clientConfig.powersList

        var pl = []												//战斗角色列表
        var rl = []												//战斗result列表
        //for _, playerInfo in pairs(playerList) do
        JsUtil.objectForEach(playerList, playerInfo => {
            var info = JsUtil.objectCopy(playerInfo)
            pl.push(info);
        });

        //for _, result in pairs(resultList) do
        JsUtil.objectForEach(resultList, result => {
            if (result.code == resultOptions.RCODE_SPELL_HIT && result.caster == 0) {
                TLog.Error("FightConfigSystem.getClientFightConfig there is ! caster in the result %d", result.index)
            }

            //if(! this.configMark[index]){
            if (result.fightPowers) {
                var list: any[] = JsUtil.objectCopy(result.fightPowers)
                result.fightPowers = []
                //for _, powerIndex in pairs(list) do
                for (var i = 0; i < list.length; i++) {
                    var powerIndex = list[i];
                    var power = JsUtil.objectCopy(powersList[powerIndex])

                    //特殊处理转化一下召唤power的结构		targetid对应player表的index,对应Player表的id
                    if (power.effect == powerEffects.EFFECT_FIGHTER_ADD
                        || power.effect == powerEffects.EFFECT_RESERVE) {

                        var playerInfo = this.clientConfig.playerList[power.target][power.target]
                        var indexList = [
                            "id", "type_id", "side", "pos", "hp", "maxHp", "rp",
                            "maxRp", "name", "entry",
                        ]

                        for (var j = 0; j < indexList.length; j++) {
                            var v = indexList[j];
                            power[v] = playerInfo[v]
                        }
                    }

                    power.times = 1
                    result.fightPowers.push(power)
                }
            }

            result.castCount = 1
            //table.insert(rl, result)
            rl.push(result);
        });
        //this.configMark[index] = true

        rl.sort((a, b) => {
            return a.time - b.time
        })

        return [pl, rl]
    }


    getClientFightDialog(index){
        if(! this.clientConfig.dialogList[index]){
            return []
        }
        
        return this.clientConfig.dialogList[index].dialogList || []
    }
}