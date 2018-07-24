// TypeScript file
class WuLinRankFrame extends BaseWnd {
	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/activity/wulinmengzhu/WuLinRankLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList()
        this.setFullScreen(true)

		var elemInfo = [
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let list: eui.List = this.mElemList["reward_list"]
        list.itemRenderer = itemRender.WuLinRankReawrdItem

		this.mElemList["my_rank"].setAlignFlag(gui.Flag.CENTER_CENTER)
		
		
		for(let i = 0;i<4;i++){
			this.mElemList["my_itemBox"+i] = UIItemBox.newObj(this.mElemList, "my_itemBox"+i,  50+80*i ,5,this.mElemList["my_reward_group"],0.8)
		}
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		RegisterEvent(EventDefine.WULIN_RANK_INFO, this.refreshFrame, this)
		this.mLayoutNode.visible = true;
		RpcProxy.call("C2G_WuLinMengZhuRankScore")	//申请排行数据
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.WULIN_RANK_INFO, this.refreshFrame, this)
		this.mLayoutNode.visible = false;
	}

	refreshFrame(){
		let rankInfo = ActivitySystem.getInstance().getWulinRankInfo()
		if(rankInfo == null){
			return
		}

		let jifenInfo = rankInfo.myInfo
		let myRankNum = jifenInfo.rank
		let myReward = []

		let config = GameConfig.WuLinMengZhuActivityRankPrizeConfig
		let configInfo = []
		for(let v in config){
			let info = config[v]
			table_insert(configInfo,info)
		}

		let playerInfo = rankInfo.playerInfo
		let playerList = []
		

		for(let i = 0; i<size_t(configInfo);i++){
			let cInfo = configInfo[i]
			let info = playerInfo[i]
			if(info){
				cInfo.playerInfo = info
				table_insert(playerList,cInfo)
				if(cInfo.index == myRankNum){
					myReward = cInfo.prize
				}
			}else{
				if(cInfo.index <= 20){
					table_insert(playerList,cInfo)
				}
			}
		}

		let list: eui.List = this.mElemList["reward_list"]
        UiUtil.updateList(list, playerList);	
		
		if(myRankNum > 20){
			myReward = configInfo[size_t(configInfo)-1].prize
		}
		let text = String.format(Localize_cns("WULIN_TXT8"),myRankNum)
		AddRdContent(this.mElemList["my_rank"],text , "ht_20_cc_stroke", "lime")
		let itemList = AnalyPrizeFormat(myReward)
		for(let i = 0;i<4;i++){
			let itemInfo = itemList[i]
				this.mElemList["my_itemBox"+i].setVisible(false)
				if(itemInfo){
					this.mElemList["my_itemBox"+i].setVisible(true)
					if(itemInfo[2]){
						this.mElemList["my_itemBox"+i].updateByEntry(itemInfo[0],itemInfo[1],itemInfo[2])
					}else{
						this.mElemList["my_itemBox"+i].updateByEntry(itemInfo[0],itemInfo[1])
					}
				}
		}
	}

}

module itemRender {
    export class WuLinRankReawrdItem extends eui.ItemRenderer {
        mElemList: any;
        constructor() {
            super();
            this.mElemList = {}
            let name = this.name
            let w = 560
            let h = 130

            let mElemInfo: any = [
                { ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["title"]: null, ["font"]: null, ["image"]: "ty_uiDi03", ["color"]: null, ["x"]: 0, ["y"]: 0, ["w"]: w, ["h"]: h, },
				{ ["index_type"]: gui.Grid9Image, ["name"]: "rankBg", ["bAdapteWindow"]: true,["title"]: "",["autoScale"]:true, ["image"]: "ty_textDi09", ["x"]: 5, ["y"]: 5, ["w"]: 550, ["h"]: 30,  ["messageFlag"]: true },
				{ ["index_type"]: eui.Label, ["name"]: "rankText", ["parent"]: "rankBg", ["title"]: "di1ming", ["font"]: "ht_24_cc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 550, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },

				
                { ["index_type"]: gui.Grid9Image, ["name"]: "playerNameBg", ["bAdapteWindow"]: true,["title"]: "",["autoScale"]:true, ["image"]: "ty_textDi08", ["x"]: 10, ["y"]: 45, ["w"]: 215, ["h"]: 30,  ["messageFlag"]: true },
                // { ["index_type"]: eui.Label, ["name"]: "playerName", ["parent"]: "playerNameBg", ["title"]: "123", ["font"]: "ht_24_cc", ["image"]: "", ["color"]: gui.Color.saddlebrown, ["x"]: 0, ["y"]: 0, ["w"]: 215, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
				{ ["index_type"]: gui.RichDisplayer, ["name"]: "playerName", ["parent"]: "playerNameBg", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"]: 215, ["h"]: 30, ["messageFlag"]: true },

				{ ["index_type"]: gui.Grid9Image, ["name"]: "scoreBg", ["bAdapteWindow"]: true,["title"]: "", ["autoScale"]:true,["image"]: "ty_textDi08", ["x"]: 10, ["y"]: 80, ["w"]: 215, ["h"]: 30,  ["messageFlag"]: true },
                { ["index_type"]: eui.Label, ["name"]: "score", ["parent"]: "scoreBg", ["title"]: "123", ["font"]: "ht_24_cc", ["image"]: "", ["color"]: gui.Color.green, ["x"]: 0, ["y"]: 0, ["w"]: 215, ["h"]: 30, ["event_name"]: null, ["fun_index"]: null, ["messageFlag"]: true },
            ]
            UiUtil.createElem(mElemInfo, this, this.mElemList, this)

			for(let i = 0;i<4;i++){
				this.mElemList["itemBox"+i] = UIItemBox.newObj(this.mElemList, "itemBox"+i, 235 + 80*i ,45,this,0.8)
				// this.mElemList["itemBox"+i].updateByEntry(20001,99)
			}

			this.mElemList["playerName"].setAlignFlag(gui.Flag.CENTER_CENTER)
			// this.mElemList["playerName"].setRowDistance(4)
			
        }

        protected dataChanged(): void {
            let v = this.data;
			
			let itemList = AnalyPrizeFormat(v.prize)
			for(let i = 0;i<4;i++){
				let itemInfo = itemList[i]
				this.mElemList["itemBox"+i].setVisible(false)
				// this.mElemList["itemBox"+i] = UIItemBox.newObj(this.mElemList, "itemBox"+i, 235 + 80*i ,45,this,0.8)
				if(itemInfo){
					this.mElemList["itemBox"+i].setVisible(true)
					if(itemInfo[2]){
						this.mElemList["itemBox"+i].updateByEntry(itemInfo[0],itemInfo[1],itemInfo[2])
					}else{
						this.mElemList["itemBox"+i].updateByEntry(itemInfo[0],itemInfo[1])
					}
				}
				
			}
			this.mElemList["score"].text = Localize_cns("WULIN_TXT25")
			// this.mElemList["playerName"].text = ""
			AddRdContent(this.mElemList["playerName"], Localize_cns("WULIN_TXT25"), "ht_20_cc", "darkgoldenrod")		
			let playerInfo = v.playerInfo || null
			if(playerInfo){
				let isMengZhu = playerInfo.mengZhu || 0
				this.mElemList["score"].text = String.format(Localize_cns("WULIN_TXT19"),playerInfo.score)
				// this.mElemList["playerName"].text = playerInfo.name
				let str = playerInfo.name
				if(isMengZhu == 1){
					str = playerInfo.name + Localize_cns("WULIN_TXT22")
				}
				AddRdContent(this.mElemList["playerName"], str, "ht_20_cc", "darkgoldenrod")
			}
			this.mElemList["rankText"].text = String.format(Localize_cns("WULIN_TXT18"),v.index)
        }

    }
}