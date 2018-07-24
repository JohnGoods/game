class MarryWindow extends BaseCtrlWnd {
	mElemList;
	name:string
	checkBoxIndex:number
	friendList;
	public initObj(...params: any[]) {
		
	}

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
			var elemInfo =[
				{["name"] : "combox_name",  ["title"] : null,  ["event_name"] : gui.ComboBox.onClick, ["fun_index"] : this.onPosTypeChange},
				{ ["name"]: "marry_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.marryClick },
				{ ["name"]: "checkBtn1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCheck },
				{ ["name"]: "checkBtn2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClickCheck },
				{ ["name"]: "divorce_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.divorceClick },
				{ ["name"]: "marry_rule", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.MarryRuleClick },
				{ ["name"]: "select_name_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onSelectCick },
				
			];
			UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);
	}

	initPostTypeCombox(){
			let friendList = this.friendList
			var data = [

			];


			for(let k in friendList){
				let info = this.friendList[k]
				let color = gui.Color.lime
				if(info.isOnline == 0){
					color = gui.Color.gray
				}
				let config = {bg:"ty_uiDi02",content:info.roleName, textColor:color, autoScale9Grid:true,fontSize:20}
				table_insert(data,config)
			}


			//let id = GetHeroProperty("id")
			var cb:gui.ComboBox = this.mElemList["combox_name"];			
			cb.setTitleHeight(48)
			cb.setItemWidth(250)
			cb.setItemHeight(55)
			cb.setItemTextAlign("center");	//middle
			cb.setTitle("");
			cb.data = data;
	}


	public onUnLoad(): void {
		
	}

	public onShow(): void {
		RegisterEvent(EventDefine.MARRY_UPDATE, this.onRefresh, this)
		RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		
		
		this.mElemList["group1"].visible = true;
		this.mElemList["title"].text = Localize_cns("SANSHENG_TXT7")
		this.mElemList["marry_rule"].visible = true;
		this.name = ""
		this.checkBoxIndex = -1
		for (let i = 1; i < 2; i++) {
			this.mElemList["checkSelect" + i].visible = false
		}
		this.onRefresh()
	}

	public onHide(): void {
		this.mElemList["group1"].visible = false;
		this.mElemList["marry_rule"].visible = false;
		UnRegisterEvent(EventDefine.MARRY_UPDATE, this.onRefresh, this)
		UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
	}
	
	onRefresh() {
		let isMarry = false	//是否结婚
		if((GetHeroProperty("spouseId")>0) && GetHeroProperty("spouseId")!=null){
			isMarry = true
		}
		this.mElemList["notMarried_group"].visible = (isMarry == false)
		this.mElemList["marry_group"].visible = (isMarry)

		var cb:gui.ComboBox = this.mElemList["combox_name"];
		cb.setTitle("");
		this.friendList = []
		let friendList = FriendSystem.getInstance().getFriendInfoList()
		let list = []
		for(let k in friendList){
			table_insert(list,friendList[k])
		}
		table_sort(list, function(a, b) {
			return b["isOnline"] - a["isOnline"]
		})

		this.friendList = list
		this.initPostTypeCombox();

		
		this.mElemList["select_name_btn"].visible = ((this.friendList) <= 0)
    }

	private onPosTypeChange(event){
		
		var cb = this.mElemList["combox_name"];
		var data = cb.data;
		cb.hide();
		this.mElemList["name_text"].text = data[event.data.itemIndex].content
		this.name = data[event.data.itemIndex].content
	}

	marryClick(){
		
		let name = this.name
		if(name == ""){
			MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT1"))
			return
		}
		if(this.checkBoxIndex == -1){
			MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT2"))
			return
		}

		let id = 0
		let isOnline = 0
		for(let k in this.friendList){
			let info = this.friendList[k]
			if(info.roleName == name){
				id = info.roleId
				isOnline = info.isOnline
				break
			}
		}

		if(id == 0){
			MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT36"))
			return
		}

		if(isOnline == 0){
			MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT37"))
			return
		}
		let roleId = id	//设置
		let roleSex = this.checkBoxIndex
		RpcProxy.call("C2G_CanMarry",roleId,roleSex)	//发协议判断是否可以结婚
	}

	onClickCheck(args){
		let name = args.target.name
		let index = name.replace(/[^0-9]/ig, "")
		for (let i = 1; i < 3; i++) {
			this.mElemList["checkSelect"+i].visible = (i == tonumber(index))
		}
		this.checkBoxIndex = tonumber(index)
	}

	divorceClick(){
		let msg = Localize_cns("SANSHENG_TXT4")
		var callback: IDialogCallback = {
		onDialogCallback(result: boolean, userData): void {
				if (result) {
                	RpcProxy.call("C2G_EndMarriage")	//离婚
					let wnd = WngMrg.getInstance().getWindow("SanShengSanShiFrame")
					if (wnd.isVisible()) {
            			wnd.hideWnd()
					}
				}
	    	}
        }
        MsgSystem.confirmDialog(msg, callback, null)
	}

	MarryRuleClick(){
		let wnd = WngMrg.getInstance().getWindow("RuleDescribeFrame")
        wnd.showWithActivity("marryRule")
	}

	onSelectCick(){
		if(size_t(this.friendList)<=0){
			MsgSystem.addTagTips(Localize_cns("SANSHENG_TXT41"))
			return
		}
	}
 }