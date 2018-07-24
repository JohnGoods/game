// TypeScript file
class InterceptTipsFrame extends BaseWnd {
    config 

    actor : UIActorView

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/xiyouhusong/InterceptTipsLayout.exml"]
      
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.mLayoutNode.width = 640
        this.mLayoutNode.height = 400
        this.setAlignCenter(true, true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_lanjie", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLanjieClick },
            ];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
        
        this.actor = UIActorView.newObj(this.mLayoutNode, "actorView", 0, 0, this.mElemList["actor"])

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

        this.actor.clearView()
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

        let colorList = [
            gui.Color.ublack, gui.Color.green, gui.Color.blue, gui.Color.purple, gui.Color.orange
        ]
        this.mElemList["label_mache"].textColor = colorList[index- 1]
        this.mElemList["label_mache"].text = refConfig.tip
        this.actor.updateByPlayer(refConfig.model)
        let prize =refConfig.robberPrize

        let prizeList = AnalyPrizeFormat(prize)
        

        //GetProfessionModel
        for(let k in prizeList){
            let item = prizeList[k]
            if(this.mElemList["prizeBox" + k] == null){
                this.mElemList["prizeBox" + k]  = UIItemBox.newObj(this.mLayoutNode, "prizeBox" + k, 0, 0, this.mElemList["group_prize"])
            }
            this.mElemList["prizeBox" + k].updateByEntry(item[0], item[1])
        }

        //拦截次数
       let actInfo = GetActivity(ActivityDefine.HuSong).getActInfo()

       let lanjie = Localize_cns("ESCORT_TXT2") + actInfo.lanjieTwice + "/" + 5
       
       AddRdContent(this.mElemList["rd_lanjie"], lanjie, "ht_20_cc", "ublack")
    }


    onLanjieClick(){
        if(CheckFightState()) return

        if (CheckActivityState() == false) {
            return
        }
        RpcProxy.call("C2G_RobberEscort", this.config.id)
        this.hideWnd()
    }

    ///接口
    onShowWnd(config){
        this.config = config
        this.showWnd()
    }
}