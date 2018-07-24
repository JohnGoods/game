// TypeScript file
class GodEquipXiLianWindow extends BaseCtrlWnd {
    needItemList;
	oldValueList;
	xilianIsMax;
	public initObj(...params: any[]) {
		 this.oldValueList = []
	}

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		var elemInfo = [
			{ ["name"]: "zhonglei_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onZhongLeiClick },
			{ ["name"]: "shuxing_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onShuxingClick },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
		// this.mElemList["world_level_rd"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["equipItem"] = UIItemBox.newObj(this.mLayoutNode, "equipItem", 0, 0, this.mElemList["xilian_item_group"]);
		
		this.mElemList["zhonglei_xilian_rd"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["shuxing_xilian_rd"].setAlignFlag(gui.Flag.H_CENTER)
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefreshNeedItem, this)
		// RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		RegisterEvent(EventDefine.EQUIP_XILIAN, this.onRefresh, this)
        this.mElemList["xilian_group"].visible = true;
		this.refreshIndex()
		this.onResetData()
        this.onRefresh()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefreshNeedItem, this)
		// UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		UnRegisterEvent(EventDefine.EQUIP_XILIAN, this.onRefresh, this)
		this.mElemList["xilian_group"].visible = false;
	}

	//
	refreshIndex(){
		let arr = RoleSystem.getInstance().getRoleEquipItemList()
		let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype
		for(let i = 0 ; i<size_t(subtypeList);i++){
			let subtype = subtypeList[i]
			let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
			if(roleItem && roleItem.propertyInfo.quality >= 6){
				this.mParentWnd.selectIndex = i
				return
			}
		}
	}

    onRefresh(){
		this.mElemList["title"].text = Localize_cns("GOD_EQUIP_TXT15")
		this.mElemList["not_max_xilian_group"].visible = true
		this.mElemList["max_xilian_tip"].visible = false
		this.xilianIsMax = false
		this.needItemList = null
		this.mParentWnd.onRefreshEquip()	//更新equip
		this.mParentWnd.onRefreshEquipRedPoint()
		let curEquipIndex = this.mParentWnd.selectIndex
		if(curEquipIndex<0){
			return
		}
		let arr = RoleSystem.getInstance().getRoleEquipItemList()
		let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype

		let subtype = subtypeList[curEquipIndex]
		let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)

		for(let i = 1;i<4; i++){
			AddRdContent(this.mElemList["xilian_rd"+i], "", "ht_20_cc", "white")
			AddRdContent(this.mElemList["xilian_add_rd"+i], "", "ht_20_cc", "white")
		}
		AddRdContent(this.mElemList["zhonglei_xilian_rd"], "", "ht_20_cc", "white")
		AddRdContent(this.mElemList["shuxing_xilian_rd"], "", "ht_20_cc", "white")

		if(roleItem && roleItem.propertyInfo.quality >= 6){
			let equipName = roleItem.getRefProperty("name")
			this.mElemList["xilian_item_name"].text = String.format(Localize_cns("GOD_EQUIP_TXT17"),equipName) 

			let level = roleItem.getRefProperty("uselevel")
			let str = String.format(Localize_cns("ROLE_TXT34"),level)
			this.mElemList["xilian_level_text"].text = str;

			this.mElemList["equipItem"].updateByItem(roleItem);

			//进度条和文本
			let jpPro = roleItem.propertyInfo.best_attribute
			let suit = roleItem.refPropertyInfo.suit
			let subtype = roleItem.refPropertyInfo.subtype
			let config = GameConfig.RoleEquipRefineConfig	//属性消耗等
			let equipJpInfo = null
			for(let _ in config){
				let info = config[_]
				if(info.Suit == suit && info.subtype == subtype){
					equipJpInfo = info
					break
				}
			}

			let maxNum = 0
			for(let i = 0;i<3; i++){
				// if(jpPro == null){
				// 	break
				// }
				let	info = jpPro[i]
				if(info == null){
					break
				}
				let strType = info[0]
				let curBaseValue = info[1]
				let percent = info[2]
				let proName = GetPropertyName(strType)
				let wordBaseMaxValue = 0	//对应的最大值
				let wordBaseList = equipJpInfo.wordBase
				for(let k in wordBaseList){
					let wordBase =  wordBaseList[k]
					if(strType == k){
						wordBaseMaxValue = wordBase
						break
					}
				}
				let addValue = 0
				let newValue = Math.ceil(curBaseValue * percent)
				if(this.oldValueList && this.oldValueList[i]){
					let oldValue = this.oldValueList[i]
					if(oldValue != newValue && oldValue < newValue){
						//属性有更新
						addValue = newValue - oldValue
						let text = "+" + addValue
						AddRdContent(this.mElemList["xilian_add_rd"+(i+1)], text, "ht_20_cc", "saddlebrown")
					}
				}
				this.oldValueList[i] = newValue	//添加到数组 为了以后看看有没有检测到洗炼更新
				let str = proName + "#green" + newValue + "#rf"
				AddRdContent(this.mElemList["xilian_rd"+(i+1)], str, "ht_20_cc", "saddlebrown")
				
				let progress =  CastType<eui.ProgressBar>(this.mElemList["exp_progress"+(i+1)]);
				let addProgress =  CastType<eui.ProgressBar>(this.mElemList["exp_add_progress"+(i+1)]);
				if(addValue == 0){
					UiUtil.updateProgress(progress, newValue, wordBaseMaxValue)
				}else{
					UiUtil.updateProgress(progress, newValue-addValue, wordBaseMaxValue)
				}
				UiUtil.updateProgress(addProgress, newValue, wordBaseMaxValue)	
				
				//洗炼满了
				if(newValue>=wordBaseMaxValue){
					maxNum = maxNum +1
				}	
			}

			//全部都满级了
			if(maxNum >= 3){
				// this.mElemList["not_max_xilian_group"].visible = false
				// this.mElemList["max_xilian_tip"].visible = true
				this.xilianIsMax = true
			}
			
			
			let typeId = equipJpInfo.typeId	//种类洗炼消耗
			let ownItemCount1 = ItemSystem.getInstance().getItemCount(typeId)
			let propertyId = equipJpInfo.propertyId	//属性洗炼消耗
			let ownItemCount2 = ItemSystem.getInstance().getItemCount(propertyId)

			this.needItemList = {"ownItemCount1":ownItemCount1,"ownItemCount2":ownItemCount2,
			}

			let color1 = "#green"
			let color2 = "#green"
			if(ownItemCount1 < 3){
				color1 = "#red"
			}

			if(ownItemCount2 < 3){
				color2 = "#red"
			}

			let text1 = color1 +  ownItemCount1 + "/" + 3
			let text2 = color2 + ownItemCount2 + "/" + 3
			AddRdContent(this.mElemList["zhonglei_xilian_rd"], String.format(Localize_cns("GOD_EQUIP_TXT4"),text1), "ht_24_cc", "saddlebrown")
			AddRdContent(this.mElemList["shuxing_xilian_rd"], String.format(Localize_cns("GOD_EQUIP_TXT5"),text2), "ht_24_cc", "saddlebrown")
			
		}else{	//没有神装就是逻辑错误了

		}
	}

	onRefreshNeedItem(){
		let curEquipIndex = this.mParentWnd.selectIndex
		if(curEquipIndex<0){
			return
		}
		let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype
		let subtype = subtypeList[curEquipIndex]
		let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
		let suit = roleItem.refPropertyInfo.suit
		let config = GameConfig.RoleEquipRefineConfig	//属性消耗等
		let equipJpInfo = null
		for(let _ in config){
			let info = config[_]
			if(info.Suit == suit && info.subtype == subtype){
				equipJpInfo = info
				break
			}
		}
		let typeId = equipJpInfo.typeId	//种类洗炼消耗
		let ownItemCount1 = ItemSystem.getInstance().getItemCount(typeId)
		let propertyId = equipJpInfo.propertyId	//属性洗炼消耗
		let ownItemCount2 = ItemSystem.getInstance().getItemCount(propertyId)

		this.needItemList = {"ownItemCount1":ownItemCount1,"ownItemCount2":ownItemCount2,}

		let color1 = "#green"
		let color2 = "#green"
		if(ownItemCount1 < 3){
			color1 = "#red"
		}

		if(ownItemCount2 < 3){
			color2 = "#red"
		}

		let text1 = color1 +  ownItemCount1 + "/" + 3
		let text2 = color2 + ownItemCount2 + "/" + 3
		AddRdContent(this.mElemList["zhonglei_xilian_rd"], String.format(Localize_cns("GOD_EQUIP_TXT4"),text1), "ht_24_cc", "saddlebrown")
		AddRdContent(this.mElemList["shuxing_xilian_rd"], String.format(Localize_cns("GOD_EQUIP_TXT5"),text2), "ht_24_cc", "saddlebrown")
	}

	//加消耗判断
    onZhongLeiClick(){
		let needItemList = this.needItemList
		if(needItemList.ownItemCount1 < 3){
			// MsgSystem.addTagTips(Localize_cns("GOD_EQUIP_TXT8"))
			let quickWnd : GoodsAsseceFrame = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
            quickWnd.onShowWnd(60010, 1);
			return
		}
		let curEquipIndex = this.mParentWnd.selectIndex
		let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype
		let subtype = subtypeList[curEquipIndex]
		let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
		let equipIndex = tonumber(roleItem.propertyInfo.index)
		//这里需要洗炼的新旧属性了
		this.oldValueList = []
		RpcProxy.call("C2G_GOD_EQUIP_REFINE",equipIndex+1,1)
    }

	//加消耗判断
    onShuxingClick(){
		let needItemList = this.needItemList
		if(this.xilianIsMax){
			MsgSystem.addTagTips(Localize_cns("GOD_EQUIP_TXT16"))
			return
		}

		if(needItemList.ownItemCount2 < 3){
			let quickWnd : GoodsAsseceFrame = WngMrg.getInstance().getWindow("GoodsAsseceFrame")
            quickWnd.onShowWnd(60009, 1);
			// MsgSystem.addTagTips(Localize_cns("GOD_EQUIP_TXT8"))
			return
		}
		let curEquipIndex = this.mParentWnd.selectIndex
		let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype
		let subtype = subtypeList[curEquipIndex]
		let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
		let equipIndex = tonumber(roleItem.propertyInfo.index)
		RpcProxy.call("C2G_GOD_EQUIP_REFINE",equipIndex+1,2)
    }

	onResetData(){
		this.oldValueList = []
	}
}