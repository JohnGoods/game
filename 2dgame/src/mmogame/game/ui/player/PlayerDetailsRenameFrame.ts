// TypeScript file
class PlayerDetailsRenameFrame extends BaseWnd {

	static RENAME_MONEYCOUNT = 200
	static PLAYER_NAME_LENGTH = 6

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/role/PlayerDetailsReNameLayout.exml"]
        
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.mLayoutNode.width= 500
		this.mLayoutNode.height = 300
		this.setAlignCenter(true, true)
		this.initSkinElemList();

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			{ ["name"]: "btn_sure", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSureClick },
            { ["name"]: "btn_cancel", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onCancelClick},
			{ ["name"]: "input_name", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: null},
           	];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

		
	}
    public onUnLoad(): void {

	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
      //  this.mLayoutNode.setDoModal(true);
		this.onRefresh();
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
	//	this.mLayoutNode.setDoModal(false);
	}

	onRefresh(){
		let name = GetHeroProperty("name")
		this.mElemList["input_name"].text = name ;
		
		let oldName = getSaveRecord(opSaveRecordKey.oldName) || ""
		let costStr = Localize_cns("RENAME_TXT1")
		if(oldName != "" && oldName != null){
			costStr = GetMoneyIcon(opItemUnit.CURRENCY) +  "X200"
		}
		AddRdContent(this.mElemList["rd_cost"], costStr, "ht_24_lc","ublack")
	}
    public onSureClick():void{
		let name = GetHeroProperty("name")
		let textName : string = this.mElemList["input_name"].text
		
		if( name == textName){
			MsgSystem.addTagTips(Localize_cns("PLAYER_DETAILS_TXT8"))
			return 
		}

		
		if (StringUtil.isEmpty(textName)) {
			MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_NAME_CFM1"))
			return
		}

		//不可使用标点符号，不可使用纯数字，不可使用敏感字
		//if(string.match(name, "[%p]+") != null ||
		if (StringUtil.isNumber(textName)) {
			MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_NAME_CFM2"))
			return
		}

		if (WordFilter.checkword(textName) == false) {//TODO:敏感字检测
			MsgSystem.confirmDialog_YES(Localize_cns("LOGIN_NAME_CFM4"))
			return
		}


		if (textName.length > NAME_LENGTH_LIMIT) {
			MsgSystem.confirmDialog_YES(String.format(Localize_cns("LOGIN_NAME_CFM3"), NAME_LENGTH_LIMIT))
			return
		}


		let oldName = getSaveRecord(opSaveRecordKey.oldName) || ""
		if(oldName != ""){
			let unit = opItemUnit.CURRENCY
			let money = GetHeroMoney(unit)
			if(money < PlayerDetailsRenameFrame.RENAME_MONEYCOUNT){
				let formatStr = Localize_cns(ItemUnitName[unit]) 
                MsgSystem.addTagTips(String.format(Localize_cns("SHOP_TIPS_TXT1"),formatStr))
				return 
			}
		}
		let id = GetHeroProperty("id")
		let message = GetMessage(opCodes.C2G_ROLE_CHANGE_NAME)
		message.itemID = id
		message.newName = textName
		SendGameMessage(message)
		this.hideWnd()
    }
    public onCancelClick():void{
		this.hideWnd()
    }
}