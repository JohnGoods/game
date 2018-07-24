class HousePowerInfoFrame extends BaseWnd {
	houseInfo
    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/sanshengsanshi/HousePowerInfoLayout.exml"]
	}

    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		this.setAlignCenter(true, true)

		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
			// { ["name"]: "giveGiftBtn1", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			// { ["name"]: "giveGiftBtn2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			// { ["name"]: "giveGiftBtn3", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onClick },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
		for(let i=1;i<4;i++){
			// this.mElemList["item_Box"+ i] = UIItemBox.newObj(this.mLayoutNode, "item_Box"+ i, 0, 0, this.mElemList["item_group"+i], 0.9)
			this.mElemList["show_rd"+i].setAlignFlag(gui.Flag.CENTER_CENTER)
		}
		this.mElemList["actor_view"] = UIActorView.newObj(this.mLayoutNode, "actor_view", 0, 0, this.mElemList["actor_wnd"])
		this.setCountDown(0)
	}

    public onUnLoad(): void {    
		
	}

	public onShow(): void {
		this.mLayoutNode.visible = true;
		this.onRefresh()
	}

	public onHide(): void {
		this.mLayoutNode.visible = false;
		let actorview = <UIActorView>this.mElemList["actor_view"]
         actorview.clearView()
	}

	onRefresh(){
		let houseInfo = ActivitySystem.getInstance().getHouseInfo()
		if(houseInfo == null){
			return
		}
		
		let level = houseInfo.houseData.stage || 1
		let curExp = houseInfo.houseData.stageexp
		let _type = houseInfo.houseData.type
		let powerAdd = curExp * 4	//战力加成 = exp/10 * 40
		

		let houseProConfig = GameConfig.FunUpgradeEffectConfig["Hourse"]
		let housePro = houseProConfig[level].effects
		let houseNextPro = houseProConfig[level].effects

		if(level >= size_t(houseProConfig)){
			powerAdd = 0
		}else{
			houseNextPro = houseProConfig[level+1].effects
		}

		for(let i = 0;i<size_t(houseNextPro);i++){
			let node = this.mElemList["pro_text"+(i+1)]
			let typeS = housePro[i][0]
			let proName = GetPropertyName(typeS)
			let value = housePro[i][1] + powerAdd
			let str = proName + value
			node.text = str

			//next
			let rdTypeS = houseNextPro[i][0]
			let rdProName = GetPropertyName(rdTypeS)
			let rdValue = houseNextPro[i][1] - value + powerAdd
			let rdStr = rdProName + rdValue

			let rdNode = this.mElemList["show_rd"+(i+1)]
			let rdIcon = "#TISHENG"
			let rdColor = "green"
			if(i != 0 && (i+100) > _type){	//没开启了
				rdIcon = ""
				rdColor = "ublack"
			}

			AddRdContent(rdNode,rdStr+"#space"+rdIcon, "ht_20_cc", rdColor)
		}

		this.mElemList["tip2"].visible = true
		this.mElemList["tip3"].visible = true
		UiUtil.setXY(this.mElemList["pro_text2"], 15, 5)
		UiUtil.setXY(this.mElemList["pro_text2"], 15, 5)

		//中档房子
		if(_type>=101){
			this.mElemList["tip2"].visible = false
			UiUtil.setXY(this.mElemList["pro_text2"], 15, 25)
		}

		//高档房子
		if(_type>=102){
			this.mElemList["tip3"].visible = false
			UiUtil.setXY(this.mElemList["pro_text3"], 15, 25)
		}

		let actorView:UIActorView = this.mElemList["actor_view"]
		let playerInfo = GetHeroPropertyInfo()
		actorView.updateByPlayerAppearInfo(playerInfo)
		
		this.setCountDown(houseInfo.power)
	}

	setCountDown(num) {
        let imageBox:gui.BatchImage = this.mElemList["countdown"]
        imageBox.beginDraw();
		imageBox.drawNumberString("zhanLi_", num, 0, 0)
		imageBox.endDraw();
    }

	onClick(args){
		
	}

	// showAndSetData(houseInfo){
	// 	this.houseInfo = houseInfo
	// 	this.showWnd()
	// }
}