// TypeScript file

class ClubChangeNoticeFrame extends BaseWnd{

    // subWndList:any;
    // tabIndex:string;
    // emptyView:UIEmptyView;
	//curNotice:any;


	public initObj(...params:any[]){
		this.mLayoutPaths = ["resource/layouts/club/ClubChangeNoticeLayout.exml"]
	}

	public onLoad():void{
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true, true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
            { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.changeNoticeClick },


			{ ["name"]: "edit_input", ["font"]: "ht_22_cc", ["color"]: gui.Color.saddlebrown, ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
		let edit = <eui.EditableText>this.mElemList["edit_input"]
		edit.text = ""
		edit.multiline = true
	}

	public onUnLoad():void{

	}

	public onShow():void{
		RegisterEvent(EventDefine.UPDATE_CLUB_NOTICE, this.refreshnoticeText, this)
		this.mLayoutNode.visible = true;
		this.mLayoutNode.setDoModal(true);
        this.refreshFrame();
	}

	public onHide():void{
		UnRegisterEvent(EventDefine.UPDATE_CLUB_NOTICE, this.refreshnoticeText, this)
		this.mLayoutNode.visible = false;
		this.mLayoutNode.setDoModal(false);
	}

    refreshFrame() {
		let edit = <eui.EditableText>this.mElemList["edit_input"]
		let clubInfo = ClubSystem.getInstance().getCurClubInfo()
		if(clubInfo == null){
			return
		}
		edit.text = clubInfo.notice
	}

	refreshnoticeText(){
		let edit = <eui.EditableText>this.mElemList["edit_input"]
		let noticeText = ClubSystem.getInstance().getNotice()
		if(noticeText == null){
			return
		}
		edit.text = ClubSystem.getInstance().getNotice()
	}


	changeNoticeClick() {
		let content = this.mElemList["edit_input"].text
		if (content.length == 0) {
			// MsgSystem.addTagTips(Localize_cns("CLUB_TXT53"))
		}else if(content.length > 50)  {
			MsgSystem.addTagTips(Localize_cns("CLUB_TXT77"))
		}else{
			//发协议
			let isHaveClubJurisdiction = ClubSystem.getInstance().isHaveClubJurisdiction()
			if(isHaveClubJurisdiction){
				let noticeString = content
        		RpcProxy.call("C2G_FactionNotice",noticeString)
				this.hideWnd()
			}
		}
	}
}