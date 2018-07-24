// TypeScript file
class PlayerDetailsFrame extends BaseWnd {
    recvList;
	actorView : UIActorView

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/role/PlayerDetailsLayout.exml"]
        
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		//UiUtil.setFrameSize(this.mLayoutNode,564,710,38,141);
		this.mLayoutNode.setLayer(gui.GuiLayer.Top)
		this.setAlignCenter(true,true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_back", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_changeHead", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onChangeHeadClick },
            { ["name"]: "btn_changeName", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onChangeNameClick},
            { ["name"]: "btn_settings", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSettingClick },
			{ ["name"]: "btn_VIP", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onVIPClick},
			{ ["name"]: "btn_yueKa", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onYueKaClick },

			{ ["name"]: "rd_copyname", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["touchChildren"]:false, ["fun_index"]: this.onCopyName },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
        
		this.mElemList["rd_copyname"].setAlignFlag(gui.Flag.RIGHT_BOTTOM)

		this.actorView = UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["actor"])
	}
    public onUnLoad(): void {
		

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
        this.onRefresh()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		let actorView:UIActorView = this.actorView
		actorView.clearView()
		
	}
	onRefresh(){
		
		let name = GetHeroProperty("name")
		let sex =  GetHeroProperty("sexId")
		let sexStr = (sex == 1)?Localize_cns("GUIDE_TXT5"):Localize_cns("GUIDE_TXT6");
		let level = GetHeroProperty("level")
		let bangHui = GetHeroProperty("factionName") || Localize_cns("PLAYER_DETAILS_TXT7")
		let force = GetHeroProperty("force")

		this.mElemList["label_nickname"].text = name;

		let str = String.format(Localize_cns("PALYER_DETAILS_TXT5"), name, sexStr, level, bangHui);
		AddRdContent(this.mElemList["rd_des"], str,"ht_20_cc", "ublack");

		AddRdContent(this.mElemList["rd_copyname"], Localize_cns("PALYER_DETAILS_TXT4"),"ht_20_cc_stroke");
		this.mElemList["rect_name"].width = 80
		
		//zhanLi
		DrawNumberStringImage(this.mElemList["bImage"], "zhanLi_", "z" + force, 0, 0, -3)

		let entryid  = RoleSystem.getInstance().getRoleInfo("entryid")
		let playerInfo = GetHeroPropertyInfo()
		let actorView:UIActorView = this.actorView	
		actorView.updateByPlayerAppearInfo(playerInfo)
		
		//头像
		let icon = GetProfessionIcon(entryid, sex)
		this.mElemList["image_player"].source = icon

	}
	////////////btn_
    public onChangeNameClick():void{
		 let name = GetHeroProperty("name")
         let wnd = WngMrg.getInstance().getWindow("PlayerDetailsRenameFrame");
		 this.hideWnd();
		 wnd.showWnd();
    }

	public onChangeHeadClick():void{
		 MsgSystem.addTagTips(Localize_cns("PLAYER_DETAILS_TXT9"))
		// this.hideWnd();	 
    }
    public onSettingClick():void{
        let wnd = WngMrg.getInstance().getWindow("SettingFrame");
		this.hideWnd();
		wnd.showWnd();
    } 
	onVIPClick(){
		ExecuteMainFrameFunction("VIP")
		this.hideWnd()
	}

	onYueKaClick(){
		let wnd : WelfareFrame = WngMrg.getInstance().getWindow("WelfareFrame")
		wnd.showWndWithTabName(2)
		this.hideWnd()
	}

	onCopyName(){
		let name = GetHeroProperty("name")
		ClipBoardCopy(name)
	}
}