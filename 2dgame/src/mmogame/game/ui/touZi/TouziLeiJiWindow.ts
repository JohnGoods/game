class TouziLeiJiWindow extends BaseCtrlWnd {
	mElemList;
    select:any;
    scroll4:UIScrollList
    index:number
	nameToIndex:any [];
    state:number
    prizeList:any [];
    initIndex:number;
    getList;
    overTime:number;
    ticker;
    
	
	public initObj(...params: any[]) {
		
	}
    public onLoad(): void {
        this.index = 0
        
		this.mElemList = this.mParentWnd.mElemList;
        let group : eui.Group = this.mElemList["leichong_scroll"]
		this.scroll4 = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_HORIZON)
        
        var elemInfo = [
			{ ["name"]: "btn_left", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLeftClick },
            { ["name"]: "btn_right", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onRightClick },
            { ["name"]: "btn_leiji_charge", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onChargeClick },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
        
        //奖励
        for (let i = 0; i < 6; i++) {
            let x = 72 * (i%3) + 10
            let y = 5
            if(i >= 3){
                y = 72 + 5
            }
            this.mElemList["leiji_itemBox_" + i] = UIItemBox.newObj(this.mLayoutNode, "leiji_itemBox_" + i, x, y, this.mElemList["group_leiji_prize"], 0.9)
            //this.mElemList["itemBox_" + i].updateByEntry(20001)
         }

        //  this.setCountDown(5800)
         this.mElemList["countdown_rd"].setAlignFlag(gui.Flag.H_CENTER)
         this.mElemList["rd_leiji_time"].setAlignFlag(gui.Flag.CENTER_CENTER) 
    }

	public onUnLoad(): void {
		
	}

	public onShow(): void {
        this.initIndex = -1
        this.mElemList["group_tab_4"].visible = true;
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this)  
        RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
        RpcProxy.call("C2G_SendOperateAndPlayerData",PayActivityIndex.ACCUM_PAY_PRIZE)    //获取活动信息和玩家数据
        this.mElemList["title"].text = Localize_cns("INVEST_TXT26")
        this.onRefresh()
	}

	public onHide(): void {
		this.mElemList["group_tab_4"].visible = false;
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this)
        UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
        if(this.ticker){
            KillTimer(this.ticker)
            this.ticker = null
        }
	}

    onRefresh(){
        this.mParentWnd.checkRedPoint()
        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.ACCUM_PAY_PRIZE)
        let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.ACCUM_PAY_PRIZE)

        if(playerInfo == undefined || activityInfo == undefined){
            return
        }
        this.overTime = activityInfo[1]
        let getList = playerInfo.getPrize
        this.getList = getList
        if(this.initIndex == -1){
            let index = 0
            for(let _ in getList){
                let state = getList[_]
                if(state == 2){
                    index = index + 1
                }
            }
            // if(index<size_t(getList)){
            //     this.initIndex = index + 1
            // }else{
                if(index >= size_t(getList)){
                    this.initIndex = index - 1
                }else{
                    this.initIndex = index
                }
                
            // } 
        }
        if(this.initIndex != -1 && this.initIndex != -2 && this.initIndex != -3){
            this.index = this.initIndex
            this.initIndex = -2
        }
    

        let _type = activityInfo[0]
        let overTime = activityInfo[1]

        // _type = 200
        let config = []
        if(_type >= 200){
            //非循环表
            config = GameConfig.AccuRechargePrizeConfig2[_type]
        }else{
            config = GameConfig.AccuRechargePrizeConfig[_type]
        }

        if(config == null){
            return
        }

        let prizeList = []
        for(let _ in config){
            let v = config[_]
            table_insert(prizeList,v)
        }
        
        // let prizeList = activityInfo.prizeList
        this.prizeList = prizeList
        this.nameToIndex = []
        this.creatRadioBtn(prizeList)

        //this.index
        let curShowReward = prizeList[this.index].prize   
        let itemList = AnalyPrizeFormat(curShowReward)
        for (let i = 0; i < 6; i++) {
            let itemInfo = itemList[i]
            if(itemInfo){
                this.mElemList["leiji_itemBox_" + i].setVisible(true)
                if(itemInfo[2]){
					this.mElemList["leiji_itemBox_" + i].updateByEntry(itemInfo[0], itemInfo[1], itemInfo[2])
				}else{
                    this.mElemList["leiji_itemBox_" + i].updateByEntry(itemInfo[0],itemInfo[1])
                }
            }else{
                this.mElemList["leiji_itemBox_" + i].updateByEntry(-1)
                this.mElemList["leiji_itemBox_" + i].setVisible(false)
            }
         }

         let getIndex = prizeList[this.index].index
         this.state = 0
         let getPrize = playerInfo.getPrize
         if(getPrize && getPrize[getIndex]){
             if(getPrize[getIndex] == 1){
                 this.state = 1
             }else if(getPrize[getIndex] == 2){
                 this.state = 2
             }
         }

         this.mElemList["btn_leiji_charge"].enabled = true
         if(this.state == 0){
             this.mElemList["btn_leiji_charge"].text =  Localize_cns("INVEST_TXT19")
         }else if(this.state == 1){
             this.mElemList["btn_leiji_charge"].text =  Localize_cns("INVEST_TXT20")
         }else{
             this.mElemList["btn_leiji_charge"].text =  Localize_cns("INVEST_TXT21")
             this.mElemList["btn_leiji_charge"].enabled = false
         }

        //  let heroInfo = GetHeroPropertyInfo()
        //  let exp = heroInfo.VIP_exp
        //  let vip = VipSystem.getInstance().GetVipLevel()
        //  let curVipExp = VipSystem.getInstance().getVipSum(vip)
        //  let sum = curVipExp + exp
         let sum = playerInfo.value
         let rmb = GetRmbFromGold(sum)
         let rdStr = String.format(Localize_cns("INVEST_TXT13"),rmb)
         AddRdContent(this.mElemList["rd_leiji_charge"], rdStr, "ht_20_cc", "white")

         //let curCount = this.prizeList[this.index].potin?
         let curCount = prizeList[this.index].value
         this.setCountDown(curCount)
         if(this.initIndex == -2){
             this.scroll4.moveToScrollIndex(this.index,true)
             this.initIndex = -3
         }
         this.creatTimer()
    }
    
    creatRadioBtn(prizeList){
        var radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
        radioGroup.addEventListener(eui.UIEvent.CHANGE, this.onClick, this);
        // for (let i = 0; i < size_t(prizeList); i++) {
            
        // }

        if (this.index == -1) {
            this.index = 0
        }

        this.scroll4.clearItemList();

        for (let i = 0; i < size_t(prizeList); i++) {
            let v = prizeList[i]
            let [window, flag] = this.scroll4.getItemWindow(i, 131, 69, 5, 5, 0)
            if (flag == true) {
                this.initItemWindow(window,radioGroup,i)
            }
            this.refreshItemWindow(window, v ,i)
        }
        this.scroll4.refreshScroll() 
    }

    initItemWindow(window,radioGroup,i) {
        // let name = window.name
		// let width = 131, height = 69
		// let Info: any = [
		// 	   	{ ["index_type"]: eui.Group, ["name"]: name+"bg" , ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["messageFlag"]: true },
        //         { ["index_type"]: gui.Grid9Image, ["name"]: name+"btn_bg", ["title"]: null, ["font"]: null, ["image"]: "", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: 131, ["h"]: 69, },
        //         { ["index_type"]: gui.Button, ["name"]: name + "btn", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 131, ["h"]: 69, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick}, 
        //         { ["index_type"]: eui.Label, ["name"]: name + "text", ["parent"]: name + "btn", ["title"]: "", ["font"]: "ht_18_cc", ["color"]: gui.Color.black, ["x"]: 0, ["y"]: 0, ["w"]: 131, ["h"]: 69, ["messageFlag"]: true },
        //         { ["index_type"]: eui.Image,  ["name"]: name + "btnTips", ["parent"]: name + "btn", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 77, ["y"]: 0, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
        //         ]
        // UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
        let name = window.name
		let width = 131, height = 69
		let Info: any = [
			   	{ ["index_type"]: eui.Group, ["name"]: name+"bg" , ["image"]: "", ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["messageFlag"]: true },
                // { ["index_type"]: gui.Grid9Image, ["name"]: name+"btn_bg", ["title"]: null, ["font"]: null, ["image"]: "", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: 131, ["h"]: 69, },
                { ["index_type"]: eui.RadioButton, ["name"]: "group" + i + "_radio", ["image"]: "ty_tongYongBt4", ["font"]: "ht_22_cc_stroke", ["image_down"]:"ty_tongYongBt3", ["color"]:gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 131, ["h"]: 69, }, 
                // { ["index_type"]: eui.Label, ["name"]: name + "text", ["parent"]: name + "btn", ["title"]: "", ["font"]: "ht_18_cc", ["color"]: gui.Color.black, ["x"]: 0, ["y"]: 0, ["w"]: 131, ["h"]: 69, ["messageFlag"]: true },
                { ["index_type"]: eui.Image,  ["name"]: name + "btnTips", ["parent"]: name + "btn", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 77, ["y"]: 0, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
                ]
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
        let radioBtn = <eui.RadioButton>this.mElemList["group" + i + "_radio"]
        radioBtn.group = radioGroup;
        radioBtn.value = i
    }

    refreshItemWindow(window, data , i) {
        let name = window.name
        this.mElemList[name + "btnTips"].visible = false
        if(this.getList && this.getList[data.index] == 1){
           this.mElemList[name + "btnTips"].visible = true
        }
        let rmb = GetRmbFromGold(data.point)
        this.mElemList["group" + i + "_radio"].label = String.format(Localize_cns("INVEST_TXT22"),rmb)
        let radioBtn: eui.RadioButton = this.mElemList["group" + i + "_radio"]
        radioBtn.selected = (this.index == i)
        this.nameToIndex[name+"btn"] = i
    }

    
    creatTimer(){
        let overTime = this.overTime
        let curTime = GetServerTime()
        let time = overTime - curTime
        let rd = this.mElemList["rd_leiji_time"]
        if(time < 0){
            time = 0
        }
        if(time > 0){
            let timeText =  String.format(Localize_cns("INVEST_TXT32"),getFormatDiffTime(time)) 
            AddRdContent(rd, timeText ,"ht_20_cc", "white")
            if(this.ticker == null){
                this.ticker = SetTimer(this.creatTimer, this, 1000, false)
            }
        }else{
            KillTimer(this.ticker)
            this.ticker = null
        }
    }
    

    setCountDown(num) {
        let numLenght = num.toString().length   //4-1   5-1
        let offx = 50 - (numLenght - 1)*10
        let imageBox:gui.BatchImage = this.mElemList["countdown"]
        imageBox.beginDraw();
		imageBox.drawNumberString("yuanBao_", num.toString(),offx,0)
		imageBox.endDraw();
        // AddRdContent(this.mElemList["countdown_rd"], "" ,"ht_24_cc_stroke", "white")
        // AddRdContent(this.mElemList["countdown_rd"], tostring(num) ,"ht_24_cc_stroke", "white")
    }


    onClick(event) {
        var radioGroup: eui.RadioButtonGroup = event.target;
        let radiobtn = radioGroup.selection
        this.select = radiobtn.value
        this.index = this.select
        this.onRefresh()
        // let name = args.target.name
        // if(this.nameToIndex[name]==null){
        //     return
        // }
        // let index = this.nameToIndex[name]
        // this.index = index
        // this.onRefresh()
    }

    onLeftClick(args) {
        this.index = 0
        this.onRefresh()
        this.scroll4.moveToScrollIndex(this.index,true)
    }

    onRightClick(args) {
        this.index = size_t(this.prizeList) - 1
        this.onRefresh()
        this.scroll4.moveToScrollIndex(this.index,true)
    }

    onChargeClick(args) {
        let index = this.index
        let config = this.prizeList[index]
        let getIndex = config.index
        if(this.state == 0){
             ExecuteMainFrameFunction("chongzhi")
         }else if(this.state == 1){
             RpcProxy.call("C2G_GetOperateActivityPrize",PayActivityIndex.ACCUM_PAY_PRIZE,[getIndex])
         }else{
             MsgSystem.addTagTips(Localize_cns("INVEST_TXT21"))
         }
    }
}