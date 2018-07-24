// TypeScript file

class CommandFactory extends TClass{

    public createCommandMove( mapId:number, cellx:number, celly:number, scope:number, args?:any){
        scope = scope || 0
        return CommandMove.newObj(mapId, cellx, celly, scope, args)
    }

    public createCommandFindWay( mapId:number, cellx:number, celly:number, scope, args?:any){
        scope = scope || 0
        args = args || {}
        return CommandFindWay.newObj(mapId, cellx, celly, scope, args)
    }

    public createCommandTalkNpc( npcEntryId:number, npcId:number){
        return CommandTalkNpc.newObj(npcEntryId, npcId)
    }

    public createCommandAutoRun = function(){
        return CommandAutoRun.newObj()
    }

    public createCommandJumpMap( mapId:number, x:number, y:number, op:number){
        return CommandJumpMap.newObj(mapId, x, y, op)
    }

    public createCommandDelayTime( delayTime:number){
        return CommandDelayTime.newObj(delayTime)
    }

    createCommandCallBack( handle, obj, param){
        return CommandCallBack.newObj(handle, obj, param)
    }
}