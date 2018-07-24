// TypeScript file
class XianLvPropertyFrame extends BaseWnd {
	id;
    actor : UIActorView
    
    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/xianlv/XianLvPropertyLayout.exml"]
      
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		//UiUtil.setFrameSize(this.mLayoutNode, 520, 700, 20, 85)
		this.initSkinElemList();
        this.setAlignCenter(true, true)

		var elemInfo = [
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)


		this.mElemList["rd_1"].setAlignFlag(gui.Flag.CENTER_CENTER);
        this.mElemList["rd_2"].setAlignFlag(gui.Flag.CENTER_TOP);
        
        this.actor = UIActorView.newObj(this.mLayoutNode, "actor_view", 0, 0, this.mElemList["actor"])
	}
    public onUnLoad(): void {
        this.actor.clearView()
	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
        this.mLayoutNode.setDoModal(true);
        this.mElemList["label_wndName"].text = Localize_cns("XIANLV_TXT8")
    
        this.onRefresh()
	}

    public onHide(): void {
		this.mLayoutNode.visible = false;
		this.mLayoutNode.setDoModal(false);
        this.actor.clearView()
	}

    onRefresh(){
        let totalList = GetSumXianLvProperty()
	
        let att = totalList["demage"] || 0
        let hp = totalList["maxhp"] || 0
        let def = totalList["hujia"] || 0
        
        let str1 = String.format(Localize_cns("ROLE_MOUNT_DAN_TXT2"), hp, att, def)
        AddRdContent(this.mElemList["rd_1"],str1, "ht_24_cc","ublack")

        
        let str2 = ""
        let qiYuanCofig = XianLvSystem.getInstance().getQiYuanProperty()
        let count = 0
        for(let k in qiYuanCofig){
            str2 += GetPropertyName(k) + "#darkgreen" + qiYuanCofig[k] +"#space#rf"
            count += 1
            if(count == 3){
                str2 += "#br#br"
            }
        }
        AddRdContent(this.mElemList["rd_2"],str2, "ht_24_cc", "ublack")
        //战力
        let force = XianLvSystem.getInstance().getTotalForce()
        DrawNumberStringImage(this.mElemList["bImage"], "zhanLi_", "z" + force, 0, 0, -3)

        let model = GetXianlvModel(this.id)
        this.actor.updateByPlayer(model)
    }

    onShowWnd(id){ //id 更新模型
		this.id = id
        this.showWnd()
	}

}