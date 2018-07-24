/*
作者:
	ljq
	
创建时间：
	2018.3.16(周四)

意图： 
	仙侣系统

公共接口：

*/

class TianXianSystem extends BaseSystem {
    tianxianlist

	public initObj(...args: any[]): void {
		this.onClear()
		
	}

	onClear() {
       this.tianxianlist = {}
	}

	destory() {
		this.onClear()
	}

	prepareResource(workQueue) {
		GameConfig.initTianXianSystemCsv(workQueue);
	}


    initTianXianList(info){
        for(let k in info){
            let v = info[k]
            this.tianxianlist[v.entryid] = v    
        }
    }

    //更新消息
   updateTianXianInfoField(id, info){
       if(!this.tianxianlist[id]){
           return ;
           
       }
       for(let k in info){
           this.tianxianlist[id][k] = info[k]
       }
    
        FireEvent(EventDefine.TIANXIAN_UPDATE, null)
   }

   getTianXianInfo(_type:number){
        if(!this.tianxianlist[_type]){
            return null
        }
        return this.tianxianlist[_type]
    }


    //获取总属性
    getToTalConfig(chong, index){
        let config = {
            maxhp: 0,
            demage: 0,
            hujia: 0,
            hitrate: 0,
            dodge: 0,
            critrate: 0,
            critratedec: 0,
            speed: 0,
        }
        for(let i = 1; i < chong; i++){
            let typenum = GameConfig.FunTianXianJingMaiTypeConfig["TianXianJingMai"][i].itemnum
            for(let j = 1; j <= 11; j++){
                let tempEffects = GameConfig.FunTianXianJingMaiConfig["TianXianJingMai"][j].effects
                let tempConfig = table_effect(tempEffects)
                tempConfig = table_effect_mul(tempConfig, typenum)
                config = table_effect_add(config, tempConfig)
            }
        }

        for(let i = 1; i <= index; i++){
            let typenum = GameConfig.FunTianXianJingMaiTypeConfig["TianXianJingMai"][chong].itemnum
            let tempEffects = GameConfig.FunTianXianJingMaiConfig["TianXianJingMai"][i].effects
            let tempConfig = table_effect(tempEffects)
            tempConfig = table_effect_mul(tempConfig, typenum)
            config = table_effect_add(config, tempConfig)
        }
        return config
    }

}