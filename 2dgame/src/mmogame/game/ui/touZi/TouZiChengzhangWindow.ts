class TouZiChengzhangWindow extends BaseCtrlWnd {
	mElemList;
    //scroll2 : UIScrollList
    //isBuy :boolean
    //heroLevel : number
    //chengZhangInfo : any
    nameToIndex : any[]
    timer

	public initObj(...params: any[]) {
		
	}
    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
        
        var elemInfo = [
			{ ["name"]: "btn_chengzhang", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onTouziClick },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		//let group : eui.Group = this.mElemList["scroll_chengzhang"]
		//this.scroll2 = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_VERTICAL)

        let list: eui.List = this.mElemList["list_chengzhang"]      
        list.itemRenderer = itemRender.TouZiChengzhangItem

	
        this.mElemList["chengzhang_rd_time"].setAlignFlag(gui.Flag.CENTER_CENTER)
        
        this.timer = null
    }

	public onUnLoad(): void {
		if(this.timer != null){
            KillTimer(this.timer)
            this.timer = null
        }
	}

	public onShow(): void {
        //RegisterEvent(EventDefine.PAY_TOUZI_CHENGZHANG, this.onRefresh, this)
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this)
       
        this.mElemList["group_tab_2"].visible = true;
        RpcProxy.call("C2G_SendOperatePlayerData",PayActivityIndex.LEVEL_FUNDS)
        // if(this.timer == null){
        //     this.timer = SetTimer(this.onRefreshTime , this, 1000)
        // }
        this.mElemList["title"].text = Localize_cns("INVEST_TXT24")
		this.onRefresh();
	}

	public onHide(): void {
        //UnRegisterEvent(EventDefine.PAY_TOUZI_CHENGZHANG, this.onRefresh, this)
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this)
       

		this.mElemList["group_tab_2"].visible = false;
	}

    onRefreshTime(){
        //rd_jihua_time
        //let time = getFormatDiffTime(1522166400)

        let openTime =  ActivitySystem.getInstance().getOpenTime()
        //let openTime = 1522289110
        
        let serverTime = GetServerTime()
        let time = openTime + 8*86400

        let shengyuTime = time - serverTime 
        if(shengyuTime<0){
            shengyuTime = 0
        }

        let timeRd = String.format(Localize_cns("INVEST_TXT14"),getFormatDiffTime(shengyuTime))
        AddRdContent(this.mElemList["chengzhang_rd_time"], timeRd, "ht_20_cc_stroke", "blue")

        if(serverTime>=time){
            if (this.timer) {
            KillTimer(this.timer)
            this.timer = null
            }
        }else{
           if(this.timer == null){
                this.timer = SetTimer(this.onRefreshTime , this, 1000)
           }
        }
    }

    onRefresh(){
        //this.onRefreshTime()
        this.mParentWnd.checkRedPoint()
        
        let heroLevel = GetHeroProperty("level")
        //this.heroLevel =heroLevel

        // let chengZhangInfo = PaySystem.getInstance().getPayChengZhangInfo();
        let chengZhangInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.LEVEL_FUNDS)
        //this.chengZhangInfo = chengZhangInfo

        //if(chengZhangInfo == null){
        let isBuy = false
        if(chengZhangInfo == -1){
             isBuy = false
             this.mElemList["btn_chengzhang"].text = Localize_cns("INVEST_TXT9")
        }else{
            isBuy = true
            this.mElemList["btn_chengzhang"].text = Localize_cns("INVEST_TXT8")
        }

        this.mElemList["btn_chengzhang"].enabled = (isBuy==false)

        let config = GameConfig.LevelFundsConfig
        let list = []
        let list1 = []
        let list2 = []

        for(let _ in GameConfig.LevelFundsConfig){
			let v = GameConfig.LevelFundsConfig[_]
			if (chengZhangInfo && chengZhangInfo[_]) {
				v.isGet = true
                v.index = _
                table_insert(list2,v)   //已领取的
			}else{
                v.isGet = false
                v.index = _
                table_insert(list1,v)
            }
		}



        // for (let i = 0; i < size_t(config); i++) {
        //     let v = config[i+100]
        //     if(chengZhangInfo && chengZhangInfo[i+100]){
        //         v.isGet = true
        //         v.index = i+100
        //         table_insert(list2,v)   //已领取的
        //     }else{
        //         v.isGet = false
        //         v.index = i+100
        //         table_insert(list1,v)
        //     }
        // }

        for(let i = 0; i < size_t(list1); i++){
            let v = list1[i]
            table_insert(list,v)
        }

        for(let i = 0; i < size_t(list2); i++){
            let v = list2[i]
            table_insert(list,v)
        }

        let scrolllist: eui.List = this.mElemList["list_chengzhang"]
        UiUtil.updateList(scrolllist, list);
        
        // let scroll = this.scroll2
		// scroll.clearItemList();

        // this.nameToIndex = []
		// let height = 70
        // for (let i = 0; i < size_t(list); i++) {
        //     let v = list[i]
        //     let [window, flag] = this.scroll2.getItemWindow(i, 550, height, 5, 5, 0)
        //     if (flag == true) {
        //         this.initItemWindow(window)
        //     }
        //     this.refreshItemWindow(window, v)
        // }
        // this.scroll2.refreshScroll()
        // this.scroll2.restoreViewXY() 
    }

	// initItemWindow(window) {
    //     let name = window.name
	// 	let width = 550, height = 70

	// 	let Info: any = [
    //            //背景
	// 		   	{ ["index_type"]: eui.Group, ["name"]: name+"bg" , ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["messageFlag"]: true },
    //             { ["index_type"]: gui.Grid9Image, ["name"]: name+"bg1", ["parent"]: name+"bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, },
    //             { ["index_type"]: gui.Grid9Image, ["name"]: name+"levelbg", ["parent"]: name+"bg", ["title"]: null, ["font"]: null, ["image"]: "sc_biaoTiDi01", ["color"]: null, ["x"]: 10, ["y"]: 20, ["w"]: 159, ["h"]: 32, },
    //             { ["index_type"]: eui.Label, ["name"]: name + "level", ["parent"]: name + "levelbg", ["title"]: "", ["font"]: "ht_24_cc", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 159, ["h"]: 32, ["messageFlag"]: true },
                
    //             { ["index_type"]: gui.RichDisplayer, ["name"]: name + "reward_rd", ["parent"]: name + "_group", ["x"]: 185, ["y"]: 20, ["w"]: 200, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null, },

    //             { ["index_type"]: gui.Button, ["name"]: name + "getBtn", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 420, ["y"]: 10, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick},
    //             { ["index_type"]: eui.Image,  ["name"]: name + "btnTips", ["parent"]: name + "getBtn", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 77, ["y"]: 0, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
    //             ]	
    //     UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
    //     this.mElemList[name+"btnTips"].visible = false
    // }

    // refreshItemWindow(window, data) {
    //   let name = window.name
        
    //   this.mElemList[name+"level"].text  = String.format(Localize_cns("INVEST_TXT4"),data.level)  
    //   let rmbNum = data.prize[0][1]
    //   let bindNum = data.prize[1][1]
    //   let str = String.format(Localize_cns("INVEST_TXT3"),rmbNum,bindNum)
      
    //   AddRdContent(this.mElemList[name+"reward_rd"], str, "ht_20_cc_stroke", "white")

    //   this.mElemList[name+"getBtn"].enabled = true
    //   this.mElemList[name+"btnTips"].visible = false
    //   if(this.isBuy && this.heroLevel >= data.level && data.isGet == false){
    //       this.mElemList[name+"btnTips"].visible = true
    //   }
      
    //   if(this.heroLevel >= data.level){  //可领取
    //      this.mElemList[name+"getBtn"].text = Localize_cns("INVEST_TXT6") 
    //      }else{
    //      this.mElemList[name+"getBtn"].text = Localize_cns("INVEST_TXT5") 
    //      this.mElemList[name+"getBtn"].enabled = false
    //   }

    //   if(data.isGet == true){
    //       this.mElemList[name+"getBtn"].text = Localize_cns("INVEST_TXT7") 
    //       this.mElemList[name+"getBtn"].enabled = false
    //   }

    //   this.nameToIndex[name+"getBtn"] = data.index
    // }



    ///-------------响应事件
	onTouziClick(){
        //记得判断元宝
        let needGold = opLimitTimeActive.levelFunds
        let curGold= GetHeroProperty("gold")
        // curGold = opLimitTimeActive.levelFunds
        if(curGold>=needGold){
            //是否购买
            var t: IDialogCallback = {
				onDialogCallback(result: boolean, userData): void {
					if (result) {
                        //1201
                        // PaySystem.getInstance().payFromId(1201)
						 RpcProxy.call("C2G_DoOperateActivity",PayActivityIndex.LEVEL_FUNDS,[])
					}
				}
			}
			MsgSystem.confirmDialog(Localize_cns("INVEST_TXT17"), t, null)
        }else{
            MsgSystem.addTagTips(Localize_cns("INVEST_TXT15"))
        }
    }

    // onClick(args){
    //     let name = args.target.name
    //     if(this.nameToIndex[name]==null){
    //         return
    //     }
    //     if(this.isBuy == false){
    //         MsgSystem.addTagTips(Localize_cns("INVEST_TXT27"))
    //         return
    //     }
    //     let index = this.nameToIndex[name]
    //     RpcProxy.call("C2G_GetOperateActivityPrize",PayActivityIndex.LEVEL_FUNDS,[index])
    //     //PayActivityIndex
    // }

}




module itemRender {
    export class TouZiChengzhangItem extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}
            //let name = window.name
            let name = "touzi"
            let width = 550, height = 70

            let Info: any = [
                //背景
                    { ["index_type"]: eui.Group, ["name"]: name+"bg" , ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["messageFlag"]: true },
                    { ["index_type"]: gui.Grid9Image, ["name"]: name+"bg1", ["parent"]: name+"bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, },
                    { ["index_type"]: gui.Grid9Image, ["name"]: name+"levelbg", ["parent"]: name+"bg", ["title"]: null, ["font"]: null, ["image"]: "sc_biaoTiDi01", ["color"]: null, ["x"]: 10, ["y"]: 20, ["w"]: 159, ["h"]: 32, },
                    { ["index_type"]: eui.Label, ["name"]: name + "level", ["parent"]: name + "levelbg", ["title"]: "", ["font"]: "ht_24_cc", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 159, ["h"]: 32, ["messageFlag"]: true },
                    
                    { ["index_type"]: gui.RichDisplayer, ["name"]: name + "reward_rd", ["parent"]: name + "_group", ["x"]: 185, ["y"]: 20, ["w"]: 200, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null, },

                    { ["index_type"]: gui.Button, ["name"]: name + "getBtn", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 420, ["y"]: 10, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick},
                    { ["index_type"]: eui.Image,  ["name"]: name + "btnTips", ["parent"]: name + "getBtn", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 77, ["y"]: 0, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
                    ]	
            UiUtil.createElem(Info, this, this.mElemList, this)
            this.mElemList[name+"btnTips"].visible = false
        }

        isBuy(){
            let chengZhangInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.LEVEL_FUNDS)
            let isBuy = (chengZhangInfo != -1)
            return isBuy
        }

        protected dataChanged(): void {
            let data = this.data;
            let name = "touzi"

            let heroLevel = GetHeroProperty("level")
            
        
            this.mElemList[name+"level"].text  = String.format(Localize_cns("INVEST_TXT4"),data.level)  
            let rmbNum = data.prize[0][1]
            let bindNum = data.prize[1][1]
            let str = String.format(Localize_cns("INVEST_TXT3"),rmbNum,bindNum)
            
            AddRdContent(this.mElemList[name+"reward_rd"], str, "ht_20_cc_stroke", "white")

            this.mElemList[name+"getBtn"].enabled = true
            this.mElemList[name+"btnTips"].visible = false
            if(this.isBuy() && heroLevel >= data.level && data.isGet == false){
                this.mElemList[name+"btnTips"].visible = true
            }
            
            if(heroLevel >= data.level){  //可领取
                this.mElemList[name+"getBtn"].text = Localize_cns("INVEST_TXT6") 
                }else{
                this.mElemList[name+"getBtn"].text = Localize_cns("INVEST_TXT5") 
                this.mElemList[name+"getBtn"].enabled = false
            }

            if(data.isGet == true){
                this.mElemList[name+"getBtn"].text = Localize_cns("INVEST_TXT7") 
                this.mElemList[name+"getBtn"].enabled = false
            }

        }

        onClick(args){
            
            if(this.isBuy() == false){
                MsgSystem.addTagTips(Localize_cns("INVEST_TXT27"))
                return
            }
            let index = tonumber(this.data.index)
            RpcProxy.call("C2G_GetOperateActivityPrize",PayActivityIndex.LEVEL_FUNDS,[index])
            //PayActivityIndex
        }

    }
}