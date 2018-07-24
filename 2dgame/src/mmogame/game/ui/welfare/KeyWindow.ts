class KeyWindow extends BaseCtrlWnd {
	mElemList;

	public initObj(...params: any[]) {
		
	}

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;

		
		var elemInfo = [
			{ ["name"]: "key_get_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onKeyGetClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

		let edit = <eui.EditableText>this.mElemList["edit_input"]
		edit.prompt = Localize_cns("WELFARE_TXT23")
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		//RegisterEvent(EventDefine.PAY_TOUZI_JIHUA, this.onRefresh, this)
        this.mElemList["group_tab5"].visible = true;  
		// RpcProxy.call("C2G_SendOperatePlayerData",PayActivityIndex.INVEST_PLAN)
		this.onRefresh()
	}

	public onHide(): void {
		//UnRegisterEvent(EventDefine.PAY_ACTIVITY_INFO, this.onRefresh, this)
		this.mElemList["group_tab5"].visible = false;
	}

	
	onRefresh() {
		 
    }

	onKeyGetClick(){
		let text = this.mElemList["edit_input"].text
		if (text == "") {
			MsgSystem.confirmDialog_YES(Localize_cns("WELFARE_TXT24"))
			return
		}


		let reg1 = new RegExp("[\\u4E00-\\u9FFF]+","g");
		if(reg1.test(text)){
			MsgSystem.confirmDialog_YES(Localize_cns("WELFARE_TXT25"))
			return
		}

		// let reg = /(\d|[a-zA-Z])/g;
		// if (reg.test(text)) {
    		
		// }

		let len = text.length
		if(len != 20){
			//return 
		}
		RpcProxy.call("C2G_PlatFormCode",text)
	}

}