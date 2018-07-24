// TypeScript file
class GodEquipLevelWindow extends BaseCtrlWnd {
   needItemList;
   nextEquipLevel;

   public initObj(...params: any[]) {
		 
   }

    public onLoad(): void {
		this.mElemList = this.mParentWnd.mElemList;
		var elemInfo = [
			{ ["name"]: "upgrade_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onUpgradeClick },
			{ ["name"]: "btn_gongming", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGongMingClick },
			{ ["name"]: "not_equip_tip2", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGoVipClick },
			{ ["name"]: "have_equip_sui_tip", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onGodSemltClick },
			];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)
		// this.mElemList["world_level_rd"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["cur_equip"] = UIItemBox.newObj(this.mLayoutNode, "cur_equip", 0, 0, this.mElemList["cur_equip_group"]);
		this.mElemList["next_equip"] = UIItemBox.newObj(this.mLayoutNode, "next_equip", 0, 0, this.mElemList["next_equip_group"]);
		this.mElemList["not_equip"] = UIItemBox.newObj(this.mLayoutNode, "not_equip", 0, 0, this.mElemList["not_equip_group"]);
		this.mElemList["max_equip"] = UIItemBox.newObj(this.mLayoutNode, "max_equip", 0, 0, this.mElemList["max_equip_group"]);

		// this.mElemList["cur_equip"].setVisible = false
		// this.mElemList["next_equip"].setVisible = false
		// this.mElemList["not_equip"].setVisible = false
		// this.mElemList["max_equip"].setVisible = false	
		this.mElemList["cur_equip_group"].visible = false
		this.mElemList["next_equip_group"].visible = false
		this.mElemList["not_equip_group"].visible = false
		this.mElemList["max_equip_group"].visible = false	

		this.mElemList["cur_next_rd"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["jp_cur_next_rd"].setAlignFlag(gui.Flag.H_CENTER)
	}

	public onUnLoad(): void {
		
	}

	public onShow(): void {
		RegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		RegisterEvent(EventDefine.EQUIP_XILIAN, this.onRefresh, this)
        this.mElemList["upgrade_group"].visible = true;  
		this.onRefresh()
	}

	public onHide(): void {
		UnRegisterEvent(EventDefine.ITEM_UPDATE, this.onRefresh, this)
		UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		UnRegisterEvent(EventDefine.EQUIP_XILIAN, this.onRefresh, this)
		this.mElemList["upgrade_group"].visible = false;
		
	}

	onResetData(){

	}

	onRefresh(){
		this.mParentWnd.onRefreshEquip()
		this.mParentWnd.onRefreshEquipRedPoint()
		this.mElemList["title"].text = Localize_cns("GOD_EQUIP_TXT14")
		
		this.needItemList = null
		this.nextEquipLevel = 0
		let curEquipIndex = this.mParentWnd.selectIndex
		if(curEquipIndex<0){
			return
		}
		let arr = RoleSystem.getInstance().getRoleEquipItemList()
		let name = "equip"
		let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype

		let subtype = subtypeList[curEquipIndex]
		let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)

		this.mElemList["cur_equip_group"].visible = false
		this.mElemList["next_equip_group"].visible = false
		this.mElemList["not_equip_group"].visible = false
		this.mElemList["max_equip_group"].visible = false

		//下面的
		this.mElemList["not_level_equip_group"].visible = false
		this.mElemList["have_equip_group"].visible = false
		this.mElemList["have_equip_sui_tip_group"].visible = false
		this.mElemList["cur_god_equip_max"].visible = false
		//有神装
		if(roleItem && roleItem.propertyInfo.quality >= 6){
			//更新当前神装信息 和 下档的
			//如果这个装备满阶了(特殊处理),可能把not_equip显示,然后把cur和next隐藏
			
			let equipIsMax = true
			let suit  = roleItem.refPropertyInfo.suit
			if(GameConfig.RoleEquipSuit && GameConfig.RoleEquipSuit[suit] &&suit<113){
				equipIsMax = false
			}

			let equipName = roleItem.getRefProperty("name")
			this.mElemList["cur_equip_name"].text =  String.format(Localize_cns("GOD_EQUIP_TXT17"),equipName) 

			let level = roleItem.getRefProperty("uselevel")
			let str = String.format(Localize_cns("ROLE_TXT34"),level)

			// let rdTeXT = "12312312"+ "#JIANTOU" + "123123123"
			// AddRdContent(this.mElemList["cur_next_rd"], rdTeXT, "ht_20_cc", "green")
			// let rdTeXT1 = "123112"+ "#JIANTOU" + "1223123"
			// AddRdContent(this.mElemList["jp_cur_next_rd"], rdTeXT1, "ht_20_cc", "green")
			
			AddRdContent(this.mElemList["xiaohao_rd"], "", "ht_20_cc", "white")
			this.mElemList["have_equip_sui_tip_group"].visible = true
			
			//神装是否满级
			if(equipIsMax){
				this.mElemList["max_equip_group"].visible = true
				this.mElemList["max_equip"].updateByItem(roleItem);
				this.mElemList["max_equip_lv"].text = str;
				this.mElemList["cur_god_equip_max"].visible = true
				

				let effectStr1List = []
				let effect1 = GetRoleEquipBaseProperty(roleItem.refPropertyInfo.ItemEntry, 6)
				for (let k in effect1) {
					let proName = GetPropertyName(abilityNameToIndex[k])
					let proValue = effect1[k]
					let str = "#green" + proName + proValue + "#rf"
					table_insert(effectStr1List,str)
					// baseStr = baseStr  + "#green" + proName + proValue + "#br"
				}

				let baseStr = ""
				for (let i = 0 ;i<size_t(effect1);i++ ) {
					let str1 = effectStr1List[i]
					baseStr = baseStr + str1 + "#br"
				}
				AddRdContent(this.mElemList["cur_next_rd"], baseStr, "ht_20_cc", "green", 7)

				let jpPro = roleItem.propertyInfo.best_attribute
				let baseJpStr = ""

				for(let _ in jpPro){
					let	info = jpPro[_]
					let strType = info[0]
					let curBaseValue = info[1]
					let percent = info[2]
					let wordBaseValue = 0	//对应的最大值
					let proName = GetPropertyName(strType)
					baseJpStr = baseJpStr + "#green" + proName + Math.ceil(curBaseValue*percent) + "#br"

				}
				AddRdContent(this.mElemList["jp_cur_next_rd"], baseJpStr, "ht_20_cc", "green")


			}else{	//不满级的处理方式
				this.mElemList["cur_equip_group"].visible = true
		    	this.mElemList["next_equip_group"].visible = true
				this.mElemList["have_equip_group"].visible = true
				this.mElemList["cur_equip"].updateByItem(roleItem);
				this.mElemList["cur_equip_lv"].text = str;
				

				//下阶装备
				let nextRoleItem = RoleSystem.getInstance().getRoleEquipNextItem(roleItem)
				let nextStr = String.format(Localize_cns("ROLE_TXT34"),level+20)
				this.mElemList["next_equip"].updateByItem(nextRoleItem);
				this.mElemList["next_equip_lv"].text = nextStr;

				this.nextEquipLevel = nextRoleItem.getRefProperty("uselevel")

				//当前&下阶属性
				let effectStr1List = []
				let effect1 = GetRoleEquipBaseProperty(roleItem.refPropertyInfo.ItemEntry, 6)
				for (let k in effect1) {
					let proName = GetPropertyName(abilityNameToIndex[k])
					let proValue = effect1[k]
					let str = "#green" + proName + proValue + "#rf"
					table_insert(effectStr1List,str)
					// baseStr = baseStr  + "#green" + proName + proValue + "#br"
				}

				let effectStr2List = []
				let effect2 = GetRoleEquipBaseProperty(nextRoleItem.refPropertyInfo.ItemEntry, 6)
				for (let k in effect2) {
					let proName = GetPropertyName(abilityNameToIndex[k])
					let proValue = effect2[k]
					let str = "#red" + proValue + "#rf"
					table_insert(effectStr2List,str)
					// baseStr = baseStr  + "#green" + proName + proValue + "#br"
				}

				let baseStr = ""
				for (let i = 0 ;i<size_t(effect1);i++ ) {
					let str1 = effectStr1List[i]
					let str2 = effectStr2List[i]
					baseStr = baseStr + str1 + " #JIANTOU " + str2 + "#br"
				}
				AddRdContent(this.mElemList["cur_next_rd"], baseStr, "ht_20_cc", "green", 7)

				//当前&下阶属性(极品属性)
				let jpPro = roleItem.propertyInfo.best_attribute
				let baseJpStr = ""

				let nextSuit = nextRoleItem.refPropertyInfo.suit
				let nextSubtype = nextRoleItem.refPropertyInfo.subtype
				let config = GameConfig.RoleEquipRefineConfig
				let nextEquipJpInfo = null
				for(let _ in config){
					let info = config[_]
					if(info.Suit == nextSuit && info.subtype == nextSubtype){
						nextEquipJpInfo = info
						break
					}
				}
				let nextJpInfo = []

				for(let _ in jpPro){
					let	info = jpPro[_]
					let strType = info[0]
					let curBaseValue = info[1]
					let percent = info[2]
					let wordBaseValue = 0	//对应的最大值
					let proName = GetPropertyName(strType)
					let wordBaseList = nextEquipJpInfo.wordBase
					for(let k in wordBaseList){
						let wordBase =  wordBaseList[k]
						if(strType == k){
							wordBaseValue = wordBase
							break
						}
					}
					// let value = Math.ceil(curBaseValue*percent)
					let info1 = []
					info1[0] = strType
					info1[1] = wordBaseValue
					info1[2] = percent
					table_insert(nextJpInfo,info1)
					baseJpStr = baseJpStr + "#green" + proName + Math.ceil(curBaseValue*percent) + "#rf" + " #JIANTOU " + "#red" + Math.ceil(wordBaseValue*percent) + "#rf" + "#br"

				}
				AddRdContent(this.mElemList["jp_cur_next_rd"], baseJpStr, "ht_20_cc", "green")

				nextRoleItem.propertyInfo.best_attribute = nextJpInfo	//手动赋值...坑...

				//升级材料
				let consumeConfig =  GameConfig.RoleEquipUpConfig
				let configInfo = consumeConfig[suit]
				let curConsume = null
				// for(let _ in configInfo){
				// 	if(_ == subtype){
				// 		curConsume = configInfo[_]
				// 		break
				// 	}
				// }

				for(let _ in configInfo){
                    let type = tonumber(_)
					if(type == subtype){
						curConsume = configInfo[type]
						break
					}
				}

				if(curConsume == null){
					return
				}
				
				let need = curConsume.fragment
       			let itemId = curConsume.entryId
        		let ownItemCount = ItemSystem.getInstance().getItemCount(itemId)
				let colorText = "#red"
				let needMoney = curConsume.funds
				let ownMoney =  GetHeroProperty("funds")
				let moneyColorText = "#red"
				if(ownItemCount >= need){
					colorText = "#green"
				}
				if(ownMoney>=needMoney){
					moneyColorText = "#green"
				}

			this.needItemList = {"needItemCount":need,"ownItemCount":ownItemCount,
			"needMoney":needMoney,"ownMoney":ownMoney}  
				let rdStr = colorText + ownItemCount + "/" + need  + "#rf" + " #JINBI" + moneyColorText + MakeLongNumberShort(needMoney)
				let consumeText = String.format(Localize_cns("GOD_EQUIP_TXT2"),rdStr)

				AddRdContent(this.mElemList["xiaohao_rd"], consumeText, "ht_24_cc", "saddlebrown")
			}
		}else{
			//更新第一个神装信息
			this.mElemList["not_level_equip_group"].visible = true
			this.mElemList["not_equip_group"].visible = true
			let entryId = this.mParentWnd.godEquipFirstEntryIDList[curEquipIndex]
			let itemInfo: any = {}
			itemInfo.entry = entryId
			itemInfo.quality = 6
			let item = Item.newObj(itemInfo)
			this.mElemList["not_equip"].updateByItem(item);
			let level = item.refPropertyInfo.level
			let str = String.format(Localize_cns("ROLE_TXT34"),level)
			this.mElemList["not_equip_lv"].text = str

			let suit = item.refPropertyInfo.suit
			let subtype = item.refPropertyInfo.subtype

			// let config = GameConfig.RoleEquipRefineConfig
			// let equipInfo = null
			// for(let _ in config){
			// 	let info = config[_]
			// 	if(info.Suit == suit && info.subtype == subtype){
			// 		equipInfo = info
			// 		break
			// 	}
			// }

			let equipName = item.refPropertyInfo.name
			this.mElemList["cur_equip_name"].text = String.format(Localize_cns("GOD_EQUIP_TXT17"),equipName) 

			//let baseStr = "#yellow" + Localize_cns("ITEM_BASE_ATTR")
			let baseStr = ""
			let effects = GetRoleEquipBaseProperty(entryId, 6)
			for (let k in effects) {
				let proName = GetPropertyName(abilityNameToIndex[k])
				let proValue = effects[k]
				baseStr = baseStr  + "#green" + proName + proValue + "#br"
			}

			AddRdContent(this.mElemList["cur_next_rd"], baseStr, "ht_20_cc", "green", 7)
			AddRdContent(this.mElemList["jp_cur_next_rd"], Localize_cns("GOD_EQUIP_TXT1"), "ht_20_cc", "green")
		}


	}

	//加消耗判断
	onUpgradeClick(){
		let needItemList = this.needItemList	//消耗
		if(needItemList == null){
			return
		}

		let level = GetHeroProperty("level") || 0
		
		if(this.nextEquipLevel > level){
			MsgSystem.addTagTips(Localize_cns("GOD_EQUIP_TXT9"))
			return
		}

		if(needItemList.needMoney > needItemList.ownMoney){
			MsgSystem.addTagTips(Localize_cns("GOD_EQUIP_TXT7"))
			return
		}

		if(needItemList.needItemCount > needItemList.ownItemCount){
			MsgSystem.addTagTips(Localize_cns("GOD_EQUIP_TXT8"))
			return
		}

		let curEquipIndex = this.mParentWnd.selectIndex
		let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype
		let subtype = subtypeList[curEquipIndex]
		let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
		let index = 0
		if(this.mElemList["upgrade_checkBox"].selected){
			index = 1
		}
		let equipIndex = tonumber(roleItem.propertyInfo.index)
		RpcProxy.call("C2G_GOD_EQUIP_UP",equipIndex+1,index)
		// "":"uint32,uint32",	--神装升级, 神装的GUID, 是否勾选重新生成 0没勾选 
	}

	//共鸣
	onGongMingClick(){
		WngMrg.getInstance().showWindow("GodEquipGongMingFrame");
	}

	onGoVipClick(){
		ExecuteMainFrameFunction("VIP")
	}

	onGodSemltClick(){
		WngMrg.getInstance().showWindow("GoldSmeltFrame");
	}
}