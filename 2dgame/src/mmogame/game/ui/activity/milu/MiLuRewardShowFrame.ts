class MiLuRewardShowFrame extends BaseWnd {
	scroll:UIScrollList

	public initObj(...params: any[]) {
		this.mLayoutPaths = ["resource/layouts/activity/milu/MiLuRewardShowLayout.exml"]
	}

	public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
		this.setFullScreen(true)
		this.initSkinElemList();
		// this.mLayoutNode.setDoModal(true)
		let group : eui.Group = this.mElemList["reward_group"]
		this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
	
		var elemInfo = [
			{ ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onHideClick },
			{ ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onHideClick },
		];
		UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this)

	}

	public onUnLoad(): void {

	}

	public onShow(): void {
		// RegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.setDoModal(true);
		this.mLayoutNode.visible = true;
		this.onRefresh()
	}

	public onHide(): void {
		// UnRegisterEvent(EventDefine.HERO_INFO_UPDATE, this.onRefresh, this)
		this.mLayoutNode.setDoModal(false);
		this.mLayoutNode.visible = false;
	}

	onRefresh() {
		 let list = GameConfig.GodPetTurnConfig

		let disposeList = []
		let ro = 0
		let t = []

		for (let k in list) {
			let info = list[k]
			if(info.petEntryId > 0){
				if(ro == 5){
					table_insert(disposeList,t)
					t = []
					ro = 0
				}
				ro = ro + 1
				table_insert(t,info)
			}
		}

		let arrayLength = t.length;
		if(arrayLength > 0){
			table_insert(disposeList,t)
		}

		for (let i = 0; i < size_t(disposeList); i++) {
            let v = disposeList[i]
            let [window, flag] = this.scroll.getItemWindow(i, 550, 105, 5, 5, 0)
			if (flag == true) {
            	this.initItemWindow(window)
			}
            this.refreshItemWindow(window, v)
        }
	}

	initItemWindow(window){
		let name = window.name
		let width = window.width
		let height = window.height
		let Info: any = [
               //背景
			   	{ ["index_type"]: eui.Group, ["name"]: name+"bg" , ["image"]: "", ["x"]: 5, ["y"]: 0, ["w"]: width, ["h"]: height},
                ]	
       	UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)

		for(let i = 0;i<5;i++){
			let x = i*100+15
			let y = 0
			let Info: any = [
               //背景
			   	//{ ["index_type"]: eui.Group, ["name"]: name+"bg" , ["image"]: "", ["x"]: 5, ["y"]: 0, ["w"]: width, ["h"]: height},
				{ ["index_type"]: gui.RichDisplayer, ["name"]: name + "petBoxText_rd"+ i, ["parent"]: name + "bg", ["title"]: "", ["font"]: "ht_16_lc", ["color"]: gui.Color.white, ["x"]: x, ["y"]: 80, ["w"]: 120, ["h"]: 25, },

				]	
       	 	UiUtil.createElem(Info, this.mLayoutNode, this.mElemList, this, window)
			this.mElemList[name + "petBoxText_rd" + i].setAlignFlag(gui.Flag.CENTER_CENTER)
		}

		for(let i = 0;i<5;i++){
			UiUtil.moveToBack(this.mElemList[name + "petBoxText_rd"+ i])
			this.mElemList[name + "petBox" + i] = UIPetBox.newObj(this.mLayoutNode, name+"petBox"+i, 18 , -80, this.mElemList[name + "petBoxText_rd"+ i])
		}
	}

	refreshItemWindow(window,data){
		let name = window.name
		
		for(let i = 0;i<5;i++){
			this.mElemList[name + "petBoxText_rd" + i].clear()
			AddRdContent(this.mElemList[name + "petBoxText_rd" + i], "", "ht_18_cc", "white")
			if(data[i]){
				let petEntryId = data[i].petEntryId
				this.mElemList[name + "petBox" + i].setVisible(true)
				this.mElemList[name + "petBox" + i].updateByEntry(petEntryId)
				let petName = PetSystem.getInstance().getPetName(petEntryId)
				let quality = PetSystem.getInstance().getPetQuality(petEntryId)
				let color = GetQualityColorStr(quality)
				AddRdContent(this.mElemList[name + "petBoxText_rd" + i], petName, "ht_18_cc_stroke", color)
			}else{
				this.mElemList[name + "petBox" + i].setVisible(false)
			}
		}
	}

	onHideClick(){
        FireEvent(EventDefine.ACTIVITY_RESET, null);
        this.hideWnd()
    }

}