class TouZiGodPetWindow extends BaseCtrlWnd {
    activityIndex:number
    playerInfo;
    timer;

	public initObj(...params: any[]) {
		this.activityIndex = PayActivityIndex.GOD_PET_INCOME
	}
    
    public onLoad(): void {
        this.mElemList = this.mParentWnd.mElemList;
        
        var elemInfo = [
			    { ["name"]: "god_pet_go_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGoClick },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        let list: eui.List = this.mElemList["list_task"]
        list.itemRenderer = itemRender.GodPetItemTask

        this.mElemList["god_pet_value_rd"].setAlignFlag(gui.Flag.CENTER_CENTER)
        this.mElemList["god_pet_time_rd"].setAlignFlag(gui.Flag.CENTER_CENTER)
    }

	public onUnLoad(): void {
		
	}

	public onShow(): void {
        RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this)
        this.mElemList["group_tab_5"].visible = true;
        this.mElemList["title"].text = Localize_cns("INVEST_TXT28")
        RpcProxy.call("C2G_SendOperateAndPlayerData",this.activityIndex)
        this.onRefresh()
	}

	public onHide(): void {
        UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this)
        this.mElemList["group_tab_5"].visible = false;
        this.TimerKill()
	}

    onRefresh(){
        this.mParentWnd.checkRedPoint()
        let playerInfo = ActivitySystem.getInstance().getOperatePlayerInfo(this.activityIndex)
        // this.playerInfo = playerInfo
        let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(this.activityIndex)
        if(playerInfo == null || activityInfo == null){
            return
        }
        let value = playerInfo.value
        let overTime = activityInfo[0]

        let rdStr = String.format(Localize_cns("INVEST_TXT30"),value)
        AddRdContent(this.mElemList["god_pet_value_rd"], rdStr, "ht_20_cc", "orange")

        AddRdContent(this.mElemList["god_pet_time_rd"], "", "ht_20_cc", "white")

        let time = GetServerTime()
        if(time < overTime && this.timer == null ){
            this.onCreatTimer()
        }

        // 
        // god_pet_time_rd

        let config = GameConfig.GodPetInComeConfig

        let getList = []
        let notGetList = []
        let incompleteList = []
        let list = []


        let getPrize = playerInfo.getPrize
        let chuliList = []
        //为了把index当key
         for(let _ in getPrize){
           table_insert(chuliList,getPrize[_])
        }

        for(let _ in config){
            let info = config[_]
            let index = info.Index - 100
            if(chuliList && chuliList[index] == 2){
                table_insert(getList,info)
            }else if(chuliList && chuliList[index] == 1){
                table_insert(notGetList,info)
            }else{
                table_insert(incompleteList,info)
            }
            // table_insert(list,info)
        }

        for(let i = 0; i<size_t(notGetList);i++){
            let info = notGetList[i]
            info.state = 2
            table_insert(list,info)
        }

        for(let i = 0; i<size_t(incompleteList);i++){
            let info = incompleteList[i]
            info.state = 1
            table_insert(list,info)
        }

        for(let i = 0; i<size_t(getList);i++){
            let info = getList[i]
            info.state = 3
            table_insert(list,info)
        }

        let list_task: eui.List = this.mElemList["list_task"]
        UiUtil.updateList(list_task, list);
    }

    onCreatTimer(){
        this.TimerKill()
        let tick = function (delay) {
            let time = GetServerTime()
            let activityInfo = ActivitySystem.getInstance().getOperateActivityInfo(PayActivityIndex.GOD_PET_INCOME)
            let overTime = 0
            if(activityInfo != null && activityInfo[0]){
                overTime = activityInfo[0]
            }
            let diffTime = overTime - time
            if(diffTime<0){
                diffTime = 0
            }
            if (diffTime <= 0) {
                if (this.timer) {
                    KillTimer(this.timer)
                    this.timer = null
                }
            } else {
                 this.autoHideTick(diffTime)
            }
        }
        this.timer = SetTimer(tick, this, 1000, true)
    }

    TimerKill(){
        if (this.timer) {
            KillTimer(this.timer)
            this.timer = null
        }
    }

    autoHideTick(diffTime){
        let timeText = getFormatDiffTimDayHour(diffTime)
        let str = String.format(Localize_cns("INVEST_TXT31"),timeText)
        AddRdContent(this.mElemList["god_pet_time_rd"], str, "ht_20_cc", "lime")
    }
    
    //神宠转盘跳转
    onGoClick(){
        FastJumpSystem.getInstance().gotoFastJump("shop_lianyaohu", 0)
    }
}

module itemRender {
    export class GodPetItemTask extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}
            let name = this.name
            let w = 550
            let h = 140

            let mElemInfo: any = [
                { ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 5, ["y"]: 0, ["w"]: w, ["h"]: h, },
                { ["index_type"]: gui.Grid9Image, ["name"]:  "biaoti", ["image"]: "fldt_biaoTiDi01", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 10, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
                { ["index_type"]: eui.Label, ["name"]: "lable", ["title"]: "", ["font"]: "ht_22_cc", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 10, ["w"]: 336, ["h"]: 32, ["fun_index"]: null, ["messageFlag"]: true, },
                { ["index_type"]: gui.Button, ["name"]: "btn", ["title"]: Localize_cns("ACTIVITY_PAY_TXT6"), ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt3", ["autoScale"]: true, ["color"]: gui.Color.white, ["x"]: 405, ["y"]: 45, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickGetPrize, },
                { ["index_type"]: eui.Image,  ["name"]: "btnTips", ["parent"]: "btn", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 77, ["y"]: 0, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)

            for (let i = 0; i < 4; i++) {
                this.mElemList["itemBox" + i] = UIItemBox.newObj(this.mElemList, "itemBox" + i, 20 + 80 * i, 50, this.mElemList["bg"],0.9)
            }
        }

        protected dataChanged(): void {
            let v = this.data;
            let needPoint = v.needPoint
            let prize = v.prize //需处理
            this.mElemList["lable" ].text = String.format(Localize_cns("INVEST_TXT29"),needPoint)
            let list = AnalyPrizeFormat(prize)
            for (let i = 0; i < 4; i++) {
                let item = list[i]
                if(item){
                    this.mElemList["itemBox" + i].setVisible(true)
                    if(item[2]){
                        this.mElemList["itemBox" + i].updateByEntry(item[0], item[1],item[2])
                    }else{
                        this.mElemList["itemBox" + i].updateByEntry(item[0], item[1])
                    }
                }else{
                    this.mElemList["itemBox" + i].updateByEntry(-1)
                    this.mElemList["itemBox" + i].setVisible(false)
                }
            }

            let state = v.state
            this.mElemList["btn"].enabled = true
            this.mElemList["btnTips"].visible = false
            if(state == 1){
                this.mElemList["btn"].enabled = false
                this.mElemList["btn"].text = Localize_cns("INVEST_TXT5")
            }else if(state == 2){  
                this.mElemList["btn"].text = Localize_cns("INVEST_TXT20")
                this.mElemList["btnTips"].visible = true
            }else if(state == 3){
                this.mElemList["btn"].text = Localize_cns("INVEST_TXT21")
                this.mElemList["btn"].enabled = false
            }  
        }

        onClickGetPrize(args) {
            let v = this.data;
            let index = v.Index
            if(v.state == 1){
                ExecuteMainFrameFunction("chongzhi")
            }else if(v.state = 2){
                 RpcProxy.call("C2G_GetOperateActivityPrize",PayActivityIndex.GOD_PET_INCOME,[index])
            }
        }

    }
}