class DailyPrizeTipsFrame extends BaseWnd {
    tabWndList: UITabWndList
    index

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/DailyPrizeTipsLayout.exml"]
       
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.width = 640
        this.mLayoutNode.height = 500
		this.setAlignCenter(true, true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

	}
    public onUnLoad(): void {
	
	}


	public onShow(): void {
		this.mLayoutNode.visible = true;
		this.mLayoutNode.setDoModal(true)
       
		this.onRefresh()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		this.mLayoutNode.setDoModal(false)
		
	}

    onRefresh(){
        let level = GetHeroProperty("level")
        let tempConfig = GetActivity(ActivityDefine.Boss).getDataConfigByLevel(level, GameConfig.EveryDaySanBaiConfig)
        if(tempConfig == null) return
        let config = tempConfig[this.index]
        if(config == null) return

        let formatStr = Localize_cns("DAILY_PRIZE_TIPS")
        let desStr = String.format(formatStr, this.index * 100)
        this.mElemList["label_des"].text = desStr

        let prizeList = AnalyPrizeFormat(config.prize)

        for(let k in prizeList){
            let prize = prizeList[k]
            if(this.mElemList["prize_" + k ] == null){
                this.mElemList["prize_" + k] = <UIItemBox>UIItemBox.newObj(this.mLayoutNode, "prize_" + k, 0 , 0, this.mElemList["group_prize"])
            }

            this.mElemList["prize_" + k].updateByEntry(prize[0], prize[1])
        }
        
    }

    onShowWnd(index){
        this.index = index
        this.showWnd()
    }
}