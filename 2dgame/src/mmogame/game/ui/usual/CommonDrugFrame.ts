// TypeScript file
class CommonDrugFrame extends BaseWnd {
    used;
    num;
	type;
	had;

	realMaxCount

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/usual/CommonDrugLayout.exml"]
      
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.mLayoutNode.width = 560
		this.mLayoutNode.height = 660
		this.setAlignCenter(true, true)
		//UiUtil.setFrameSize(this.mLayoutNode, 560, 660, 40, 120)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_use", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUseClick },
			{ ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
				
			{ ["name"]: "btn_plus", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPlusClick },
			{ ["name"]: "btn_plus10", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onPlus10Click },
			{ ["name"]: "btn_cut", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onCutClick },
			{ ["name"]: "btn_cut10", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onCut10Click },

			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		this.mElemList["itemBox"] = UIItemBox.newObj(this.mLayoutNode, "itemBox",8, 7, this.mElemList["group_top"])

		this.mElemList["rd_1"].setAlignFlag(gui.Flag.LEFT_CENTER);
        this.mElemList["rd_2"].setAlignFlag(gui.Flag.CENTER_CENTER);
        this.mElemList["rd_3"].setAlignFlag(gui.Flag.CENTER_CENTER);
		this.mElemList["rd_4"].setAlignFlag(gui.Flag.CENTER_CENTER);
	}
    public onUnLoad(): void {

	}

	public onShow(): void {
		RegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true);
        
		this.onRefresh();
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.PET_FUN_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.visible = false;
		//this.mLayoutNode.setDoModal(false);
		this.type = null
		this.num = -1
	}
    
	onRefresh(){
		
		if(this.num == -1){
			this.num = 0
		}
			
		let drugName = cellOptionsName[this.type-1]
		let drugConfig = GameConfig.FunAbilityDrugConfig[drugName];
		let id = drugConfig["itemid"]
		this.mElemList["itemBox"].updateByEntry(id,1);
		let name = GameConfig.itemConfig[id].name
		this.mElemList["label_wndName"].text = name

		this.mElemList["label_name"].text = name
		this.mElemList["label_name"].textColor = GetItemFontGUIColor(id, false)

		let funInfo = FunSystem.getInstance().getFunInfoWithType(this.type)
		this.used = funInfo.drugnum
		let str = String.format(Localize_cns("ROLE_MOUNT_DAN_TXT1"), this.used);
		let text = str;
		AddRdContent(this.mElemList["rd_1"],text, "ht_22_lc","ublack");
		
		let attrList = GetDrugProperty(this.type)
        let text2  = ""
		for(let k in attrList){
			text2 +=  GetPropertyName(lastAbilityNameToIdOptions[k]) + "#green" + attrList[k] + "#rf#space"
		}
        AddRdContent( this.mElemList["rd_2"],text2,"ht_22_lc","ublack");
        
		this.had = ItemSystem.getInstance().getItemCount(id); //检查背包
		
		let text3 = String.format(Localize_cns("ROLE_MOUNT_DAN_TXT3"),this.had);
		
        AddRdContent( this.mElemList["rd_3"],text3,"ht_24_lc_stroke","white");

	    
		AddRdContent( this.mElemList["rd_4"],Localize_cns("ROLE_MOUNT_DAN_TXT5"),"ht_24_lc","white");
		//label_num
		this.num = this.had
		let max = elemAbilityDrugOptions.def.MaxLevel
		let realMaxCount = max - this.used
		this.realMaxCount = realMaxCount
		if(this.num > realMaxCount){
			this.num = realMaxCount
		}
		this.mElemList["label_num"].text = this.num
	}

    onShowWnd(type){
		this.type = type
        this.showWnd()
	}
	
    public onUseClick():void{
		if(this.had == 0){
			MsgSystem.addTagTips(Localize_cns("ROLE_ADD_tips_4"))
		}
		RpcProxy.call("C2G_TEMPCELLFUN_DRUG_USE", this.type,this.num)
	//	"C2G_TEMPCELLFUN_DRUG_USE":"uint16,uint16 ",--entryid 哪个玩法使用属性丹 num 使用多少个
    }

	private onPlusClick(){
		if(this.had == 0) return 
		this.num = this.num + 1;
		if(this.num > this.had ) this.num = this.had
		if(this.num > this.realMaxCount) this.num = this.realMaxCount
		this.mElemList["label_num"].text = this.num
	}
	private onPlus10Click(){
		if(this.had == 0) return 
		this.num = this.num + 10;
		if(this.num > this.had ) this.num = this.had
		if(this.num > this.realMaxCount) this.num = this.realMaxCount
		this.mElemList["label_num"].text = this.num
	}
	private onCutClick(){
		if(this.had == 0) return 
		this.num = this.num -1 ;
		if(this.num <= 0) this.num = 0;
		this.mElemList["label_num"].text = this.num
	}
	private onCut10Click(){
		if(this.had == 0) return 
		this.num = this.num -10;
		if(this.num <= 0) this.num = 0;
		this.mElemList["label_num"].text = this.num
	}

}