class TouZiJiHuaWindow extends BaseCtrlWnd {
	mElemList;
    scroll3 : UIScrollList
	list: any[];
	isBuy:boolean
	timer
	planInfo:any
	day:number
	canGetDay:number

	public initObj(...params: any[]) {
		
	}

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
        
        var elemInfo = [
		
			{ ["name"]: "btn_touzi", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.touziClick },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        let group : eui.Group = this.mElemList["scroll_touzi"]
		this.scroll3 = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_VERTICAL)
        
		this.mElemList["rd_jihua_time"].setAlignFlag(gui.Flag.CENTER_CENTER)

		this.timer = null
	}

	public onUnLoad(): void {
		if(this.timer != null){
            KillTimer(this.timer)
            this.timer = null
        }
	}

	public onShow(): void {
		//RegisterEvent(EventDefine.PAY_TOUZI_JIHUA, this.onRefresh, this)
		RegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this)
		
        this.mElemList["group_tab_3"].visible = true;  
		//RpcProxy.call("C2G_GetOperateData",24)
		RpcProxy.call("C2G_SendOperatePlayerData",PayActivityIndex.INVEST_PLAN)
		// if(this.timer == null){
        //     this.timer = SetTimer(this.onRefreshTime , this, 1000)
        // }
		this.mElemList["title"].text = Localize_cns("INVEST_TXT25")
		this.onRefresh()
	}

	public onHide(): void {
		//UnRegisterEvent(EventDefine.PAY_TOUZI_JIHUA, this.onRefresh, this)
		UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this)
		
		this.mElemList["group_tab_3"].visible = false;
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
        AddRdContent(this.mElemList["rd_jihua_time"], timeRd, "ht_20_cc_stroke", "blue")

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

	 onRefresh() {
		 this.mParentWnd.checkRedPoint()
		// let time = getFormatDiffTime(1522166400)
        // AddRdContent(this.mElemList["rd_time"], time, "ht_20_cc_stroke", "blue")
		//let planInfo = PaySystem.getInstance().getTouziJihuaInfo();	//计划信息
		let planInfo = ActivitySystem.getInstance().getOperatePlayerInfo(PayActivityIndex.INVEST_PLAN)
		this.planInfo = planInfo
		this.mElemList["btn_touzi_red_tip"].visible = false
		
        if(planInfo == -1){
             this.isBuy = false
             //this.mElemList["btn_touzi"].text = Localize_cns("INVEST_TXT9")
        }else{
            this.isBuy = true
            //this.mElemList["btn_touzi"].text = Localize_cns("INVEST_TXT8")
        }

		//this.isBuy = true
		let day = 0 //day = 当前已经领取的天数+1
		if(this.isBuy){
			//this.mElemList["btn_touzi"].enabled = false
			day = size_t(planInfo) + 1
			this.mElemList["btn_touzi"].text = String.format(Localize_cns("INVEST_TXT11"),day)
			this.mElemList["btn_touzi"].enabled = true
			if(day>8){
				this.mElemList["btn_touzi"].enabled = false
			}
		}else{
			//this.mElemList["btn_touzi"].enabled = true
			this.mElemList["btn_touzi"].text = Localize_cns("INVEST_TXT12")
		}

		this.day = day

		let openTime = ActivitySystem.getInstance().getOpenTime()
		//let openTime = 1522289110
		let time = GetTodayTime(openTime)	//1522252800 开服当天0点 
		let serverTime = GetServerTime()	//
		this.canGetDay = Math.floor((serverTime - time) / 86400) + 1

        this.scroll3.clearItemList()
        let list = GameConfig.InvestPlanConfig

		let disposeList = []
		let ro = 0
		let t = []

		for (let k in list) {
			let info = list[k]
			if(ro == 2){
				table_insert(disposeList,t)
				t = []
				ro = 0
			}
			ro = ro + 1
			
			table_insert(t,info)
		}

		let arrayLength = t.length;
		if(arrayLength > 0){
			table_insert(disposeList,t)
		}

		this.list = disposeList

		let height = 125
        for (let i = 0; i < size_t(disposeList); i++) {
            let v = disposeList[i]
            let [window, flag] = this.scroll3.getItemWindow(i, 550, height, 5, 5, 0)
			if (flag == true) {
            	this.initItemWindow(window)
			}
            this.refreshItemWindow(window, v)
        }
        this.scroll3.refreshScroll()
        this.scroll3.restoreViewXY()

		if(this.isBuy){
			if(this.canGetDay>=this.day){
				this.mElemList["btn_touzi_red_tip"].visible = true
			}
		}
    }

	initItemWindow(window) {
        let name = window.name
        // let w = window.width
        // let h = window.height
		let width = 270, height = 125

		for(let i = 0;i<2;i++){
				let x = i*278 + 2
				let y = 0
				let Info: any = [
               //背景
			   	{ ["index_type"]: eui.Group, ["name"]: name+"bg" + i, ["image"]: "", ["x"]: x, ["y"]: y, ["w"]: width, ["h"]: height},
				{ ["index_type"]: gui.Grid9Image, ["name"]: name+"bg1"+i, ["parent"]: name+"bg"+i, ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBuyClick},
				{ ["index_type"]: gui.Grid9Image, ["name"]: name+"daybg"+i, ["parent"]: name+"bg"+i, ["title"]: null, ["font"]: null, ["image"]: "sc_biaoTiDi01", ["color"]: null, ["x"]: 55, ["y"]: 2, ["w"]: 159, ["h"]: 32, },
                { ["index_type"]: eui.Label, ["name"]: name + "day"+i, ["parent"]: name + "daybg"+i, ["title"]: "", ["font"]: "ht_24_cc", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 159, ["h"]: 32, ["messageFlag"]: true },

				// { ["index_type"]: eui.Label, ["name"]: name+"itemName"+i,["parent"]: "bg"+i,  ["title"]: "ItemName", ["font"]: "ht_24_cc",  ["color"]: gui.Color.ublack, ["x"]: 0, ["y"]: 10, ["w"]: 270, ["h"]: 25, ["messageFlag"]: true },
				 { ["index_type"]: gui.Grid9Image, ["name"]: name+"yilingqu"+i, ["title"]: null, ["font"]: null, ["image"]: "bh_text02", ["color"]: null, ["x"]: x+80, ["y"]: 55, ["w"]: 120, ["h"]: 39, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
				// { ["index_type"]: gui.RichDisplayer, ["name"]: "item_need_rd"+i, ["parent"]: "bg"+i, ["title"]: "", ["font"]: "ht_24_lc", ["color"]: gui.Color.saddlebrown, ["x"]: 100, ["y"]: 65, ["w"]: 400, ["h"]: 25, ["messageFlag"]: true },
				// { ["index_type"]: eui.Label, ["name"]: "item_can_buy_count"+i,["parent"]: "bg"+i,  ["title"]: Localize_cns("CLUB_TXT51"), ["font"]: "ht_24_lc",  ["color"]: gui.Color.green, ["x"]: 100, ["y"]: 105, ["w"]: 120, ["h"]: 25, ["messageFlag"]: true },
		    ]
		UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)

		for(let j = 0;j<3;j++){
			this.mElemList[name+"itemBox"+j+i] = UIItemBox.newObj(this.mElemList, name+"itemBox"+j+i, 85 *j+10, 35, this.mElemList[name+"bg1"+i],)
		}
		}
    }

    refreshItemWindow(window, data) {
        let name = window.name
		for(let i = 0;i<2;i++){
			let info = data[i]
			let prize = info.prize
			let day = info.day

			this.mElemList[name+"yilingqu"+i].visible = false
			if(this.isBuy){
				if((this.day - 1) >= day){
					this.mElemList[name+"yilingqu"+i].visible = true
				}
			}

			for(let j = 0;j<3;j++){
				//let prizeInfo = prize[j]
				let itemList = AnalyPrizeFormat(prize)
				let v = itemList[j]
				if (v) {
					this.mElemList[name+"itemBox"+j+i].setVisible(true)
                	this.mElemList[name+"itemBox"+j+i].updateByEntry(v[0], v[1])
           		}else{
               		this.mElemList[name+"itemBox"+j+i].updateByEntry(-1)
					this.mElemList[name+"itemBox"+j+i].setVisible(false)
            	}
			}
			this.mElemList[name + "day" + i].text = String.format(Localize_cns("INVEST_TXT10"),day)
		}
    }

    ///-------------响应事件
    touziClick(){
		if(this.isBuy){
			//this.mElemList["btn_touzi"].enabled = false
			//let openTime =  ActivitySystem.getInstance().getOpenTime()
       		
			if(this.canGetDay>=this.day){
				RpcProxy.call("C2G_GetOperateActivityPrize",PayActivityIndex.INVEST_PLAN,[this.day])	//拿1-9
			}else{
				MsgSystem.addTagTips(Localize_cns("INVEST_TXT18"))
			} 
		}else{
        	let needGold = opLimitTimeActive.investPlan
        	let curGold= GetHeroProperty("gold")
       		if(curGold>=needGold){
            //是否购买
            	var t: IDialogCallback = {
					onDialogCallback(result: boolean, userData): void {
						if (result) {
						 	RpcProxy.call("C2G_DoOperateActivity",PayActivityIndex.INVEST_PLAN,[])
						}
					}
				}
				MsgSystem.confirmDialog(Localize_cns("INVEST_TXT16"), t, null)
       		}else{
            MsgSystem.addTagTips(Localize_cns("INVEST_TXT15"))
       		}
			   PayActivityIndex
		}
    }

	onBuyClick(){

	}
}