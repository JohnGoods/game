// TypeScript file


class LaunchHelper extends TClass{

    checkUpdate:boolean;
    checkServerList:boolean;

   initObj(...params:any[]){
        

        this.checkUpdate = IGlobal.config.getBoolean("checkUpdate", true);
        this.checkServerList = IGlobal.config.getBoolean("serverlist", true);
    }

    isCheckUpdate():boolean{
        return this.checkUpdate;
    }

    isCheckServerList():boolean{
        return this.checkServerList;
    }

    
}