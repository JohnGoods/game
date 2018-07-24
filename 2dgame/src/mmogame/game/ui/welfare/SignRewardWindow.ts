class SignRewardWindow extends BaseCtrlWnd {
	mElemList;
	scroll : UIScrollList
	nameToIndex : any[]
	getPrize;
	isCreatScrollList :boolean

	public initObj(...params: any[]) {
		this.isCreatScrollList = false
	}

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;

		var elemInfo = [
			{ ["name"]: "btn_sign_get", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSignGetClick },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		let group : eui.Group = this.mElemList["reward_list"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group, UIScrollList.DIR_VERTICAL)
		
		this.mElemList["sign_itemBox"] = UIItemBox.newObj(this.mElemList, "sign_itemBox", 0, 0, this.mElemList["sign_reward_item_group"],0.9)
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
        this.mElemList["group_tab1"].visible = true;  
		// RpcProxy.call("C2G_SendOperatePlayerData",PayActivityIndex.INVEST_PLAN)
		this.onRefresh()
		
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mElemList["group_tab1"].visible = false;
	}

	
	 onRefresh() {
		let meiRiInfo = getSaveRecord(opSaveRecordKey.meiRiQianDao)
		// if(meiRiInfo == null){
		// 	return
		// }

		//let startTime = meiRiInfo.starttime
		let day = checkNull(meiRiInfo.times, 0)	//个人登陆
		if(day == 0){
			day = 1
		}

		let trueDay = day
		let getPrize = meiRiInfo.getPrize
		this.getPrize = getPrize

		let serverDay = GetServerDay() || 0	//开服多少天

		if(serverDay == 0){
			serverDay = 1
		}

		let meiriConfig = GameConfig.meiRiQianDaoConfig
		let gerenConfig = meiriConfig[1]
		let gerenLength = size_t(gerenConfig)

		let quanfuConfig = meiriConfig[2]
		let quanfuLength = size_t(quanfuConfig)
		
		if(day != gerenLength && day>gerenLength){
			// let num = Math.floor(day / gerenLength)
			// day = day - (gerenLength * num)
			// day = gerenLength % day
			day = (day - 1) % gerenLength + 1
		}

		if(serverDay != quanfuLength && serverDay>quanfuLength){
			// let testNum = quanfuLength % serverDay
			// let num = Math.floor(serverDay / quanfuLength)
			// serverDay = serverDay - (quanfuLength * num)
			serverDay = (serverDay - 1) % quanfuLength + 1
		}

		let quanfuInfo = quanfuConfig[serverDay]

		let rewardInfo = [
		{["index"] : dailyPrizeType.dailyLogin,	},
		{["index"] : dailyPrizeType.vipLogin, 	},
		{["index"] : dailyPrizeType.rechangeLogin,	},
		]

        this.nameToIndex = []

		for (let i = 0; i < size_t(rewardInfo); i++) {
           	let v = quanfuInfo
			let index = rewardInfo[i].index
            let [window, flag] = this.scroll.getItemWindow(i, 565, 145, 0, 0, 5)
			if (flag == true) {
				this.initItemWindow(window)
			}
			this.refreshItemWindow(window, v ,index)
        }	
		
        this.scroll.refreshScroll()
        this.scroll.restoreViewXY() 

		let signCanGet = false
		if(getPrize[dailyPrizeType.accumulateLogin] == 0){
			signCanGet = true
		}else{	//已经领取了

			//fix:yangguiming 修复30天领取奖励后，times变成了31,day是0报错
			if(day > 1){
				day = day - 1
			}			
			trueDay = trueDay - 1
		}

		let gerenInfo = gerenConfig[day]

		let prizeList = gerenInfo.award
		let itemList = AnalyPrizeFormat(prizeList)[0]
		this.mElemList["sign_itemBox"].updateByEntry(itemList[0], itemList[1])
		
		this.mElemList["btn_sign_get"].enabled = false
		if(signCanGet){
			this.mElemList["btn_sign_get"].text = Localize_cns("WELFARE_TXT4")
			this.mElemList["btn_sign_get"].enabled = true
		}else{
			this.mElemList["btn_sign_get"].text = Localize_cns("WELFARE_TXT5")
		}

		let curSignDay = trueDay
		// if(signCanGet){
		// 	curSignDay = curSignDay - 1
		// }
		this.mElemList["sign_day_text"].text = String.format(Localize_cns("WELFARE_TXT2"),curSignDay)
		this.mElemList["sign_day_git_text"].text = String.format(Localize_cns("WELFARE_TXT2"),curSignDay)
    }

	initItemWindow(window){
		let name = window.name
		let width = 555, height = 135

		let Info: any = [
               //背景
			   	{ ["index_type"]: eui.Group, ["name"]: name+"bg" , ["image"]: "", ["x"]: 5, ["y"]: 5, ["w"]: width, ["h"]: height},
                { ["index_type"]: gui.Grid9Image, ["name"]: name+"bg1", ["parent"]: name+"bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: width, ["h"]: height, },
                { ["index_type"]: gui.Grid9Image, ["name"]: name+"tip_bg", ["parent"]: name+"bg", ["title"]: null, ["font"]: null, ["image"]: "fldt_biaoTiDi01", ["color"]: null, ["x"]: 10, ["y"]: 10, ["w"]: 336, ["h"]: 32, },
                { ["index_type"]: eui.Label, ["name"]: name + "tip", ["parent"]: name + "tip_bg", ["title"]: "", ["font"]: "ht_24_cc", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 336, ["h"]: 32, ["messageFlag"]: true },
                
                // { ["index_type"]: gui.RichDisplayer, ["name"]: name + "reward_rd", ["parent"]: name + "_group", ["x"]: 185, ["y"]: 20, ["w"]: 200, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null, },

                { ["index_type"]: gui.Button, ["name"]: name + "sign_getBtn", ["title"]: "", ["font"]: "ht_20_cc_stroke", ["image"]: "ty_tongYongBt3", ["color"]: gui.Color.white, ["x"]: 395, ["y"]: 40, ["w"]: 117, ["h"]: 51, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick},
				{ ["index_type"]: eui.Image,  ["name"]: name + "btnTips", ["parent"]: name + "sign_getBtn", ["title"]: "", ["font"]: "ht_20_lc", ["image"]: "zjm_hongDian01", ["color"]: gui.Color.white, ["x"]: 77, ["y"]: 0, ["w"] : 40,["h"] : 40, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
                ]	
        UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)

		for(let i = 0;i<4;i++){
			this.mElemList[name+"sign_itemBox"+i] = UIItemBox.newObj(this.mElemList, name+"sign_itemBox"+i, i*85+15 ,50,this.mElemList[name+"bg"],0.9)
		}
	}

	refreshItemWindow(window, data ,index){
		let name = window.name
		let itemList = AnalyPrizeFormat(data.award)
		for(let i = 0;i<4;i++){
			let itemInfo = itemList[i]
			if(itemInfo){
				this.mElemList[name+"sign_itemBox"+i].updateByEntry(itemInfo[0], itemInfo[1])
			}else{
				this.mElemList[name+"sign_itemBox"+i].updateByEntry(-1)
			}
		}
		
		let canGet = false
		if(index == dailyPrizeType.dailyLogin){
			this.mElemList[name+"tip"].text = Localize_cns("WELFARE_TXT6")
			canGet = this.checkSignReward()
		}else if(index == dailyPrizeType.vipLogin){
			this.mElemList[name+"tip"].text = Localize_cns("WELFARE_TXT20")
			canGet = this.checkVipReward()
		}else if(index == dailyPrizeType.rechangeLogin){
			this.mElemList[name+"tip"].text = Localize_cns("WELFARE_TXT21")
			canGet = this.checkPayReward()
		}
		
		let isGet = false
		if(this.getPrize[index] == 1){
			isGet = true
		}

		this.mElemList[name+"sign_getBtn"].enabled = false
		this.mElemList[name + "btnTips"].visible = false
		if(isGet){
			this.mElemList[name+"sign_getBtn"].text = Localize_cns("WELFARE_TXT5")
		}else{
			this.mElemList[name+"sign_getBtn"].text = Localize_cns("WELFARE_TXT4")
			if(canGet){	
				this.mElemList[name+"sign_getBtn"].enabled = true
				this.mElemList[name + "btnTips"].visible = true
			}
		}

		this.nameToIndex[name+"sign_getBtn"] = index
	}

	checkSignReward(){
		return true
	}

	checkVipReward(){
		let curVip = VipSystem.getInstance().GetVipLevel()
		if(curVip >= 4 ){
			return true
		}
		return false
	}

	checkPayReward(){
		let dailyPayCount = getSaveRecord(opSaveRecordKey.dailyRecharge) || 0
		if(dailyPayCount > 0){
			return true
		}
		return false
	}

	//个人的
	onSignGetClick(){
		RpcProxy.call("C2G_DailySignPrize",dailyPrizeType.accumulateLogin)
	}

	onClick(args){
		let name = args.target.name
        if(this.nameToIndex[name]==null){
            return
        }
		let index = this.nameToIndex[name]
		let num = tonumber(index)
		RpcProxy.call("C2G_DailySignPrize",num)
	}
}