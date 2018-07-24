// TypeScript file
class CommonSkinPropertyFrame extends BaseWnd {
	cellIndex
    name;
	actor : UIActorView
    skinIndex
	
    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/usual/CommonSkinPropertyLayout.exml"]
      
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		//UiUtil.setFrameSize(this.mLayoutNode, 520, 700, 20, 85)
		this.setAlignCenter(true, true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
		
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)


		this.mElemList["rd_1"].setAlignFlag(gui.Flag.CENTER_CENTER);
        this.actor = UIActorView.newObj(this.mLayoutNode, "actor_view", 0, 0, this.mElemList["actor"])
        
	}
    public onUnLoad(): void {
        
	}

	public onShow(): void {

		this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true);
        this.mElemList["title"].text = this.name
        
		let typeName = cellOptionsName[this.cellIndex - 1]
		let skinInfo = GameConfig.FunSkinConfig[typeName][this.skinIndex]
		if(!skinInfo) return 
		let configStr = ""
		let skin_config = GetSingleSkinProperty(this.cellIndex, this.skinIndex)
		for (let k in skin_config) {
            configStr += GetPropertyName(lastAbilityNameToIdOptions[k]) + "#darkgreen" + skin_config[k] + "#rf#space"
        }
		AddRdContent(this.mElemList["rd_1"],configStr,"ht_24_cc","ublack") 

		let force = GetForceMath(skin_config)
		DrawNumberStringImage(this.mElemList["bImage"], "zhanLi_", "z" + force, 0, 0, -3)

		this.mElemList["actor"].visible = false
		this.mElemList["title_icon"].visible = false
		let skinid = skinInfo.skin
		if(this.cellIndex == cellOptionsIndex.HeroEquip){
			this.mElemList["title_icon"].visible = false
			this.mElemList["actor"].visible = true
			let modelList = {}
			let playerInfo = GetHeroPropertyInfo()
			modelList["vocation"] = playerInfo.vocation
            modelList["sexId"] = playerInfo.sexId
            modelList["rideShapeId"] = playerInfo.rideShapeId
            modelList["heroShapeId"] = skinid
            this.actor.updateByPlayerAppearInfo(modelList)
		}else if(this.cellIndex == cellOptionsIndex.Hero){
			this.mElemList["title_icon"].visible = true
			let icon = GetShapeImage(skinid)
			this.mElemList["title_icon"].source = icon
		}else{
			this.mElemList["actor"].visible = true
			this.actor.updateByPlayer(skinid)
		}

		
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		//this.mLayoutNode.setDoModal(false);
        
        this.actor.clearView()
	}

    onShowWnd(cellIndex, skinIndex , name){
		this.cellIndex = cellIndex || 1
		this.skinIndex = skinIndex || 1
        this.name = name
        this.showWnd()
	}

}