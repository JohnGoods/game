// TypeScript file
class RevengeTipsFrame extends BaseWnd {
    config 
    
    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/xiyouhusong/RevengeTipsLayout.exml"]
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.mLayoutNode.width = 640
        this.mLayoutNode.height = 430
        this.setAlignCenter(true, true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_goto", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGotoClick },
            ];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
        


	}
    public onUnLoad(): void {

	}

	public onShow(): void {
        UiUtil.registerTouchOutsideEvent(this.hideWnd, this, [this.mLayoutNode])
		this.mLayoutNode.visible = true;
        this.mLayoutNode.setDoModal(true);
        this.onRefresh();
    
	}

	public onHide(): void {
        UiUtil.unRegisterTouchOutsideEvent(this.hideWnd, this)
		this.mLayoutNode.visible = false;
		this.mLayoutNode.setDoModal(false);
	}

    onRefresh(){
        let config = this.config
        if(config == null) return

        let name = config.name 
        let banghui = config.banghui || Localize_cns("PLAYER_DETAILS_TXT7")
        let force = config.force || 0
        let desStr = Localize_cns("ESCORT_ROBBER_TXT1") + name + "#br" + Localize_cns("ESCORT_ROBBER_TXT2") + banghui + "#br" + Localize_cns("ESCORT_ROBBER_TXT3") + force + "#br"
        //rd_des
        AddRdContent(this.mElemList["rd_des"],desStr, "ht_20_cc", "ublack")

        let index = config.index
        let refConfig = GameConfig.EscortConfig[index]


        let prize = refConfig.revengePrize

        let prizeList = AnalyPrizeFormat(prize)
        
        let icon =  GetProfessionIcon(config.id, 1)
        this.mElemList["image_player"].source = icon
        //GetProfessionModel  image_player
        for(let k in prizeList){
            let item = prizeList[k]
            if(this.mElemList["prizeBox" + k] == null){
                this.mElemList["prizeBox" + k]  = UIItemBox.newObj(this.mLayoutNode, "prizeBox" + k, 0, 0, this.mElemList["group_prize"])
            }
            this.mElemList["prizeBox" + k].updateByEntry(item[0], item[1])
        }

        //rd_twice
        AddRdContent(this.mElemList["rd_twice"], Localize_cns("ESCORT_RECORD_TXT7"), "ht_20_cc")
    }

    ///--------------响应事件
    onGotoClick(){
        if(CheckFightState()) return

        if (CheckActivityState() == false) {
            return
        }
        RpcProxy.call("C2G_RevengeEscort", this.config.revengIndex)
        this.hideWnd()
    }

    ///接口
    onShowWnd(config){
        this.config = config
        //this.index = index
        this.showWnd()
    }
}