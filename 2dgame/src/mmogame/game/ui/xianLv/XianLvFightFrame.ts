class XianLvFightFrame extends BaseWnd {
    fightList;
    id;

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/xianlv/XianLvFightLayout.exml"]
      
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		//UiUtil.setFrameSize(this.mLayoutNode, 640, 400, 0, 215)
		this.initSkinElemList();
        this.setAlignCenter(true, true)
        
        var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBtn1Click },
            { ["name"]: "btn_2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onBtn2Click },
				];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

        this.fightList = {}
        
        for(let index = 1 ; index <= 2; index++){
            this.mElemList["rd_star_" + index].setAlignFlag(gui.Flag.CENTER_CENTER)
            this.mElemList["rd_name_" + index].setAlignFlag(gui.Flag.CENTER_CENTER)
        }
	}
    public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true);
		this.onRefresh();
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		//this.mLayoutNode.setDoModal(false);
	}
    onRefresh(){
        this.fightList = XianLvSystem.getInstance().getFightList()
        //let controlList = XianLvSystem.getInstance().getControlList()

        for(let i = 1; i <= 2; i++){
            this.mElemList["group_" + i].visible = false
        }
        for(let k in this.fightList){
            if(this.fightList[k] != 0){
                this.onRefreshGroup(tonumber(k), this.fightList[k] )
            }  
        }
    }

    onRefreshGroup(id, index){
        let config = GameConfig.ActorXianLvConfig[id]

        let bgIcon = GetPetQualityIconIamge(id)
        let icon = GetXianlvIconImage(id)
        
        this.mElemList["group_" + index].visible = true
        
        this.mElemList["sprite_" +  index].source = icon
        this.mElemList["bg_" +  index].source = bgIcon
        //星级
        let star = XianLvSystem.getInstance().getStar(id)
        let xingStr = ""
		if(star >3){
			xingStr += "#yellow" + star + "#STAR"
		}else{
            for(let i = 0; i < star; i++){
			    xingStr += "#STAR"
		    }
        }
        AddRdContent(this.mElemList["rd_star_" + index], xingStr, "ht_20_cc")
        //name
        let name = config.name
        let color = GetQualityColorStr(config.quality)
        AddRdContent(this.mElemList["rd_name_" + index], name , "ht_20_cc_stroke", color)
        //阶数
        let level = XianLvSystem.getInstance().getLevel(id)
        let jieStr = String.format(Localize_cns("ROLE_TXT39"), level)
        this.mElemList["lv_"+ index].text = jieStr

    }
    
    onBtn1Click(){
        RpcProxy.call("C2G_ACTOR_XIANLV_COMBAT_SET", this.id, 1)
        this.hideWnd()
    }

    onBtn2Click(){
        RpcProxy.call("C2G_ACTOR_XIANLV_COMBAT_SET", this.id, 2)
        this.hideWnd()
    }

    onShowWnd(id){
        this.id = id
        this.showWnd()
    }
}
// TypeScript file