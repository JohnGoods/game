/*
作者:
    panjunhua
	
创建时间：
   2015.8.6(周四)

意图：
		快速跳转系统
   

公共接口：

*/


class FastJumpSystem extends BaseSystem {

    public initObj(...args: any[]): void {
        //RegisterEvent(EventDefine.UI_SHOW, this.showWndAndCheckFinish, this)
        this.onClear()
    }

    destory() {
        //UnRegisterEvent(EventDefine.UI_SHOW, this.showWndAndCheckFinish, this)
    }

    prepareResource(workQueue) {
        GameConfig.initFastJumpSystemCsv(workQueue);
    }

    onClear() {

    }

    getFunTipsConfig(fType, fid) {
        fType = fType || ""
        fid = fid || 0

        let config = null
        for (let _ in GameConfig.FunTipsConfig) {
            let v = GameConfig.FunTipsConfig[_]

            if (fType == v.type) {
                if (fid == v.entryId) {
                    config = v

                    TLog.Debug("FastJumpSystem.getGameConfig.FunTipsConfig", fid)
                    break
                }
            }
        }

        return config
    }

    getFunTipsInfo(config) :[string, string ,string]{
       let imageName = ""
        let name = "ERROR"
        let des = ""
        if (config.type == "item") {
            imageName = GetItemIcon(config.entryId)
            name = ItemSystem.getInstance().getItemName(config.entryId)
            des = config.showTips || ""
        } else if (config.type == "jinbi") {						//金币
            imageName = GetItemIcon(SpecailItemId.FUNDS)
            name = Localize_cns("JINBI")
            des = config.showTips || ""
        } else if (config.type == "zuanshi") {					//钻石
            imageName = GetItemIcon(SpecailItemId.GOLD)
            name = Localize_cns("GUIDE_TXT2")
            des = config.showTips || ""
        } else if (config.type == "shengji") {					//升级途径

        } else if (config.type == "tili") {							//行动力（体力）
            imageName = GetItemIcon(SpecailItemId.POWER)
            name = Localize_cns("CAMPAIGN_TXT18")
            des = config.showTips || ""
        } else if (config.type == "stone") {							//行动力（体力）
            imageName = GetItemIcon(SpecailItemId.STONE)
	    	name = Localize_cns("PET_STONE_NAME")
	
        }

        return [imageName, name, des]
    }

    
    doFastJump(eventName,param,args):string{
        TLog.Debug("FastJumpSystem.doFastJump",eventName)
        if(FastJumpSpace.doEventHandler[eventName] ){
            return FastJumpSpace.doEventHandler[eventName].call(this, param,args)
        }else{
            TLog.Error("FastJumpSystem.doFastJump eventName %s is null!!!", eventName)
        }
    }

    checkFastJump( eventName, param, args):[boolean, string, string]{
        //TLog.Debug("FastJumpSystem.checkFastJump",eventName)
        if(FastJumpSpace.checkEventHandler[eventName] ){
            let [enable, title, str] = FastJumpSpace.checkEventHandler[eventName].call(this, param,args)
            if(HeroIsInTeam() == true ){
                enable = false
                str = Localize_cns("TEAM_TXT51")
            }
            
            return [enable, title, str || ""]
        }else{
            //TLog.Error("FastJumpSystem.checkFastJump eventName is null!!!")
            return [true, "ERROR", ""]
        }
    }

    doQuickAccess(eventName, param, args){
        if(FastJumpSpace.doEventHandler[eventName]){
            let fun : Function = FastJumpSpace.doEventHandler[eventName]
            return fun.call(this, param)
        }
        return false
    }

    checkQuickAccess(eventName, param, args){
        if(FastJumpSpace.checkEventHandler[eventName]){
            let fun : Function = FastJumpSpace.checkEventHandler[eventName]
            return fun.call(this, param)
        }
        return [false, ""]
    }

    gotoFastJump(eventName, param, args){
        let check = this.checkQuickAccess(eventName, param, args)
        if(check == null) return
        if(check[0]){
            this.doQuickAccess(eventName, param, args)
        }else if (!check[0] && check[1].length != 0){
            MsgSystem.addTagTips(check[1])
        }
    }
}