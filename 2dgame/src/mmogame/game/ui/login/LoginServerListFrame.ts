

class LoginServerListFrame extends BaseWnd{

    static STATE_LOGO:number = 0;//背景图
    static STATE_AUTH:number = 1;//授权信息
    static STATE_RENCENT:number = 2;//最近登陆
    static STATE_REGISTER:number = 3;//注册
	lastSelectRegionIndex = -1;
    public initObj(...params:any[]){
        this.mLayoutPaths = ["resource/layouts/login/LoginServerListLayout.exml",];
                             //"resource/layouts/itemRender/LoginServerItemLayout.exml"];
    }

    public onLoad():void{
        //this.createLayerNode();
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList()
        // this.mLayoutNode.bottom = 0
        // this.mLayoutNode.horizontalCenter = 0;
        this.setAlignCenter(true, true)

        var elemInfo =[
            // {["name"] : "icon_serverStat",  ["title"] : null,  ["event_name"] : null, ["fun_index"] : null},
            // {["name"] : "label_serverStat",  ["title"] : null,  ["event_name"] : null, ["fun_index"] : null},
            // {["name"] : "icon_serverNew",  ["title"] : null,  ["event_name"] : null, ["fun_index"] : null},
            //{["name"] : "label_serverName",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onRecentServerTap},

            //{["name"] : "list_serverlist",  ["title"] : null,  ["event_name"] : null, ["fun_index"] : null},
            {["name"] : "btn_close",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.hideWnd},
            {["name"] : "btn_close_top",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.hideWnd},
            //{["name"] : "btn_refresh",  ["title"] : null,  ["event_name"] : egret.TouchEvent.TOUCH_TAP, ["fun_index"] : this.onServerListRefresh},
        ];
        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        //this.mElemList["btn_refresh"].visible = false;

        var listBox:eui.List = this.mElemList["list_regionlist"];
         listBox.itemRenderer = itemRender.LoginServerRegionItem;

         var listBox:eui.List = this.mElemList["list_serverlist"];
         listBox.itemRenderer = itemRender.LoginServerItem;
        
	}

	public onUnLoad():void{
		
	}

    public onShow():void{
		 this.mLayoutNode.visible = true;
         RegisterEvent(EventDefine.LOGIN_SERVERLIST_UPDATE,	this.refreshUI,this);
         this.refreshUI();
	}

	public onHide():void{
        this.mLayoutNode.visible = false;
        UnRegisterEvent(EventDefine.LOGIN_SERVERLIST_UPDATE,	this.refreshUI,this);
	}


    refreshUI():void{
        // var loginSystem:LoginSystem = LoginSystem.getInstance();
        // var recentServerInfo = loginSystem.getRecentLoginServerInfo();
        // if(recentServerInfo == null)
        //     return;

        // var textInfo = loginSystem.getServerStateText(recentServerInfo);
        // this.mElemList["label_serverStat"].textColor = textInfo.color;
        // this.mElemList["label_serverStat"].text = textInfo.text;
        
        
        // this.mElemList["label_serverName"].textColor = gui.Color.cyan;
        // this.mElemList["label_serverName"].text = recentServerInfo.ServerName;

        // this.mElemList["icon_serverStat"].source = textInfo.image;
        // this.mElemList["icon_serverNew"].visible = !!recentServerInfo.IsNew;
        var loginSystem:LoginSystem = LoginSystem.getInstance();


        let regionList = []

        let v:any = {}
        v.index = 0
        v.start = -1
        v.end = -1
        v.select = false
        v.regionName = Localize_cns("LAST_LOGIN_ROLE")
        v.parent = this
        regionList.push(v)

        let regionPerCount = loginSystem.getServerNumEachRegion()
        let regionCount = loginSystem.getServerRegionNum()
        let regionId = regionCount - 1
        for(let i = 0; i < regionCount; i++){
        //for (let i = regionCount - 1; i >= 0; --i){
            let v:any = {}
            v.index = i + 1
            v.start = regionId * regionPerCount
            v.end = v.start + regionPerCount
            v.select = false
            v.regionName = loginSystem.getServerRegionName(regionId)
            v.parent = this
            regionId = regionId - 1
            regionList.push(v)
        }
        let selectRegion = null;
        if (this.lastSelectRegionIndex == -1 || this.lastSelectRegionIndex > regionCount){
            let recentList = loginSystem.getRecentServerInfoList()
            if (recentList != null && recentList.length > 0){
                 this.lastSelectRegionIndex = 0
            }else if (regionCount > 0){
                this.lastSelectRegionIndex = 1
            }else{
                this.lastSelectRegionIndex = 0
            }
        }
        selectRegion = regionList[this.lastSelectRegionIndex]
        //index==1的，是最新开服的区
        
        //if(regionCount == 0){
        //    selectRegion = regionList[0]
        //}else{
        //    selectRegion = regionList[1]
        //}
        selectRegion.select = true

        //regionList = regionList.reverse()

        this.refreshRegion(selectRegion.start, selectRegion.end, regionList)

    }

    refreshRegion(start, end, regionList?):void{
        //刷新区服列表
        var listBox:eui.List = this.mElemList["list_regionlist"];
        if(regionList == null){
            regionList = UiUtil.getListDataSouce(listBox)
            for(let i = 0; i < regionList.length; i++){
                let regionInfo = regionList[i]
                if(regionInfo.start == start && regionInfo.end == end){
                    regionInfo.select = true
                }else{
                    regionInfo.select = false
                }
            }
        }
        UiUtil.updateList(listBox, regionList);


        //刷新服务器列表
        var loginSystem:LoginSystem = LoginSystem.getInstance();
        let serverList = []
        if(start < 0){
            let recentList = loginSystem.getRecentServerInfoList();
            for (let i in recentList){
                serverList.push(recentList[i])
            }
        }else{
            for(let i = start; i < end; i ++){
                let gamegroup = loginSystem.getGameGroupByIndex(i)
                if (gamegroup != null){
                    serverList.push(gamegroup)
                }
                //let serverInfo = ServerConfig[i]
                //if(serverInfo != null)
                //    serverList.push(serverInfo)
            }
            serverList = serverList.reverse()
        }
        
        var listBox:eui.List = this.mElemList["list_serverlist"];
        UiUtil.updateList(listBox, serverList);
        
    }
    



	// onServerListRefresh(event:egret.TouchEvent):void{
    //     LoginSystem.getInstance().requestServerList();
	// }

    // onRecentServerTap(event:egret.TouchEvent):void{
    //     var recentServerId = LoginSystem.getInstance().getLastSelectedServerIndex();
	//     LoginSystem.getInstance().setSelectedServerIndex(recentServerId)
    //     this.hideWnd();
    // }
}



module itemRender{

    
    export class LoginServerRegionItem extends eui.ItemRenderer{
        mElemList: any;

		constructor() {
			super();
			this.mElemList = {}

            let Info: any = [
				//背景
				{ ["index_type"]: gui.Button, ["name"]: "btn_region", ["title"]: "", ["font"]: "ht_24_cc", ["color"]: gui.Color.ublack, ["image"]: "dl_fuWuQiDi03", ["x"]: 0, ["y"]: 10, ["w"]: null, ["h"]: null, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onClickBtn },

				//{ ["index_type"]: gui.Grid9Image, ["name"]: name + "touch", ["title"]: null, ["font"]: null, ["image"]: "", ["x"]: 10, ["y"]: 0, ["w"]: w - 20, ["h"]: h, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSetpost },
			]
			UiUtil.createElem(Info, this, this.mElemList, this)
        }


        protected dataChanged(): void {
			let v = this.data

            let btn:gui.Button = this.mElemList["btn_region"]
            if(v.select == true){
                btn.source = "dl_fuWuQiDi03"
            }else{
                btn.source = "dl_fuWuQiDi01"
            }
            btn.text = v.regionName
            //if(v.start < 0){
            //    btn.text = Localize_cns("LAST_LOGIN_ROLE")
            //}else{
            //    btn.text = String.format("S%d-%d", v.start+1, v.end+1)
            //}
        }

        onClickBtn(args:egret.TouchEvent) {
            let v = this.data
            v.parent.lastSelectRegionIndex = v.index
            v.parent.refreshRegion(v.start, v.end)
        }
        
    }







    export class LoginServerItem extends eui.ItemRenderer{

         mElemList: any;

        

        constructor(){
            super();
            this.mElemList = {}

            let Info: any = [
				//背景
				{ ["index_type"]: gui.Button, ["name"]: "btn_server", ["title"]: "", ["font"]: "ht_24_cc", ["color"]: gui.Color.ublack,  ["image"]: "dl_fuWuQiDi02", ["x"]: 0, ["y"]: 10, ["w"]: 260, ["h"]: 62, ["event_name"]: gui.TouchEvent.TOUCH_SHORT, ["fun_index"]: this.onServerItemTap },
                { ["index_type"]: eui.Image, ["name"]: "serverIcon", ["image"]: "dl_biaoQian01", ["parent"]:"btn_server", ["x"]: 0, ["y"]: 0, ["w"]: null, ["h"]: null,  ["messageFlag"]: true,  ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },

				//{ ["index_type"]: gui.Grid9Image, ["name"]: name + "touch", ["title"]: null, ["font"]: null, ["image"]: "", ["x"]: 10, ["y"]: 0, ["w"]: w - 20, ["h"]: h, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSetpost },
			]
			UiUtil.createElem(Info, this, this.mElemList, this)
        }

        

        protected dataChanged():void{
            // let listbox = <eui.List>this.parent;
            // let param = listbox.dataProvider["param"];
            
            var gamegroup = this.data;
            var gameId = gamegroup[0]
            var groupIndex = gamegroup[1]
            
            var loginSystem:LoginSystem = LoginSystem.getInstance();
            //var textInfo = loginSystem.getServerStateText(serverInfo);
            let serverInfo = loginSystem.getServerInfoByGameGroup(gameId, groupIndex)
            let text = ""
            let color = gui.Color.ublack
            if(serverInfo.maintain == true){
                text = String.format("(%s)", Localize_cns("WEIHU"))
                color = gui.Color.gray;
            }

            this.mElemList["btn_server"].text = text + loginSystem.getServerNameByGameGroup(gameId, groupIndex)
            this.mElemList["btn_server"].textColor = color
            
            this.mElemList["serverIcon"].visible = !serverInfo.maintain && serverInfo.isnew;//!!serverInfo.IsNew;

            // this.label_serverStat.textColor = textInfo.color;
            // this.label_serverStat.text = textInfo.text;
            
            // this.label_serverName.textColor = gui.Color.cyan
            // this.label_serverName.text = serverInfo.ServerName;

            // this.icon_serverStat.source = textInfo.image;
            // this.icon_serverNew.visible = !!serverInfo.IsNew;

        }

        onServerItemTap(event:egret.TouchEvent):void{
            //TLog.Debug("onServerItemTap index:", this.itemIndex); 
            //LoginSystem.getInstance().setSelectedServerIndex(this.itemIndex);
            var gamegroup = this.data;
            var gameId = gamegroup[0]
            var groupIndex = gamegroup[1]
            //let index = ServerConfig.indexOf(serverInfo)

            LoginSystem.getInstance().setSelectedGameGroup(gameId, groupIndex);
            WngMrg.getInstance().hideWindow("LoginServerListFrame");
        }
    }

}
