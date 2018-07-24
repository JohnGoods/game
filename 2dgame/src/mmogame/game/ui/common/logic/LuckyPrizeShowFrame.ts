// TypeScript file

class LuckyPrizeShowFrame extends BaseWnd {
    controlDataTable: any
    actorList: any;
    itemList;
    scroll: UIScrollList;
    number;
    singleTicker;
    maxDelayTime
    activityIndex:number
    index;
    radioConfig;

    public initObj(...params: any[]) {
        // this.actorList = {}
        this.mLayoutPaths = ["resource/layouts/item/LuckyPrizeShowLayout.exml"]
        this.singleTicker = null
        this.maxDelayTime = 5 * 1000
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setAlignCenter(true, true)
        this.initSkinElemList();
        // this.mLayoutNode.setLayer(gui.GuiLayer.Top)

        this.mLayoutNode.verticalCenter = -100

        var elemInfo: any[] = [
            { ["name"]: "return_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onHideClick },
            { ["name"]: "again_btn", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onLuckyClick },
        ];

        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        let group = <eui.Group>this.mElemList["scroll_group"]
        this.scroll = UIScrollList.newObj(this.mLayoutNode, "scroll", 0, 0, group.width, group.height, group)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        //super.onShow();
        RegisterEvent(EventDefine.UI_SHOW, this.onUIShowEvent, this)
        RegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)
        RegisterEvent(EventDefine.XUNBAO_UPDATE, this.onUpdate, this)
        this.mLayoutNode.visible = true;
        this.refreshFrame()
    }

    public onHide(): void {
        //super.onHide();
        this.mLayoutNode.visible = false;
        let list = []
        // for (let name in this.actorList) {
        //     let actor = this.actorList[name]
        //     JsUtil.arrayInstert(list, name)
        // }
        UnRegisterEvent(EventDefine.UI_SHOW, this.onUIShowEvent, this)
        UnRegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)
        UnRegisterEvent(EventDefine.XUNBAO_UPDATE, this.onUpdate, this)
        if (this.singleTicker) {
            KillTimer(this.singleTicker)
            this.singleTicker = null
        }

    }

    refreshFrame() {
        let list =  AnalyPrizeFormat(this.itemList)
        if(this.activityIndex == PayActivityIndex.GOD_PET_TURN){
            table_sort(list, function(a, b) {
                let itemConfigA = ItemSystem.getInstance().getItemTemplateInfo(a[0])
                let itemConfigB = ItemSystem.getInstance().getItemTemplateInfo(b[0])
                return itemConfigB.quality - itemConfigA.quality
            })
        }

        let list1 = []
        var t = []
        list.forEach(v=>{
            table_insert(t, v)
            if (size_t(t) == 4) {
                table_insert(list1, t)
                t = []
            }
        })
        if (t.length > 0) {
            table_insert(list1, t)
        }
   
        let group = <eui.Group>this.mElemList["scroll_group"]
        let scroll = this.scroll
		scroll.clearItemList();
		this.controlDataTable = {}
		for (let k = 0; k < list1.length; k++) {
			let v = list1[k]
			let [window, flag] = scroll.getItemWindow(k, group.width - 3, 100, 3, 5, 0)

            if (flag == true) {
			    this.initItemWindow(window)
            }
			this.refreshItemWindow(window, v)
		}

        //更新按钮位置
        let ten = false
        if(size_t(this.itemList)>1){
            ten = true
        }
        this.mElemList["again_btn"].visible = false
        UiUtil.setXY(this.mElemList["return_btn"], 247, 520)
        if(ten){
            this.mElemList["again_btn"].visible = true
            UiUtil.setXY(this.mElemList["return_btn"],330, 520)
        }

        if(this.activityIndex == PayActivityIndex.PET_LOTTERY_A){
			this.mElemList["again_btn"].text = Localize_cns("LUCKY_TXT6")
		}else if(this.activityIndex == PayActivityIndex.PET_LOTTERY){
			this.mElemList["again_btn"].text = Localize_cns("LUCKY_TXT8")
		}else if(this.activityIndex == PayActivityIndex.GOD_PET_TURN){
            this.mElemList["again_btn"].text = Localize_cns("LUCKY_TXT22")
        }

        ItemSystem.getInstance().showEasterEgg()

        let wnd = WngMrg.getInstance().getWindow("EasterEggPetFrame")
        //如果没抽到彩蛋宠物 且当前界面是寻宝再抽十次
        if(wnd.isVisible() == false && this.activityIndex == PayActivityIndex.PET_LOTTERY_A){
             //寻宝再抽十次判断是否有抽到宠物或者仙君
            for(let i = 0 ;i<size_t(this.itemList);i++){
			    let v = this.itemList[i]
			    let itemId = v[1]
			    let petId =  ItemSystem.getInstance().getPetIdByItemId(itemId)
			    let xianlvId =  ItemSystem.getInstance().getXianLvIdByItemId(itemId)
			    if(petId != 0 || xianlvId!=0){
				    let petWnd = WngMrg.getInstance().getWindow("EasterEggPetFrame")
				    if(petId != 0){
					    petWnd.onShowAndSetData(null,petId)
				    }else{
					    petWnd.onShowAndSetData(null,null,xianlvId)
				    }
				    return
			    }
		    }
        }
        
    }

    initItemWindow(window) {
		let name = window.name
        for (let i = 0; i < 4; i++) {
            this.mElemList[name + "itemBox" + i] = UIItemBox.newObj(this.mLayoutNode, name + "itemBox" + i, 40 + 110 * i, 10, window)
              let ElemInfo = [
                { ["index_type"]: gui.AnimBox, ["name"]: name +"item_anim_box" + i, ["x"]: -13, ["y"]: -13, ["w"]: 99, ["h"]: 99, ["messageFlag"]: true }
                // { ["index_type"]: gui.AnimBox, ["name"]: name +"item_anim_box" + i, ["parent"]: name + "itemBox"+ i, ["x"]: 0, ["y"]: 0, ["w"]: 99, ["h"]: 99, ["messageFlag"]: true }
            ]
            this.mElemList[name+"itemBox" + i].createElem(ElemInfo, this.mElemList, this)
            this.mElemList[name+"item_anim_box" + i].setAnimName("daoJuGuang")
            this.mElemList[name+"item_anim_box" + i].visible = false
        }
	}

	refreshItemWindow(window, config) {
		let name = window.name
        for (let i = 0; i < 4; i++) {
            this.mElemList[name+"item_anim_box" + i].visible = false
            if (config[i]) {
                let v = config[i]
                this.mElemList[name + "itemBox" + i].setVisible(true)

                let itemConfig = ItemSystem.getInstance().getItemTemplateInfo(v[0])
                let petId =  ItemSystem.getInstance().getPetIdByItemId(v[0])
                if(petId > 0 && itemConfig.quality >= 4){
                    this.mElemList[name+"item_anim_box" + i].visible = true
                }

                if(v[2]){
                    this.mElemList[name + "itemBox" + i].updateByEntry(v[0], v[1],v[2])
                }else{
                    this.mElemList[name + "itemBox" + i].updateByEntry(v[0], v[1])
                }
            } else {
                this.mElemList[name + "itemBox" + i].setVisible(false)
            }
        }
	}

    onUpdate(){
        let resultInfo = ActivitySystem.getInstance().getOperateLotteryResultInfo(this.activityIndex)
        let itemList = []
        for(let i = 0; i<size_t(resultInfo); i++){
			let itemInfo =  resultInfo[i]
			table_insert(itemList,itemInfo[0])
		}
        this.itemList = []
        this.itemList = itemList
		this.number = size_t(resultInfo)
        if (this.singleTicker) {
            KillTimer(this.singleTicker)
            this.singleTicker = null
        }
        this.maxDelayTime = 5*1000
        this.refreshFrame()
        this.onCreatTimer()
     }

    onCreatTimer(){
        let maxTime = this.maxDelayTime
        let tick = function (delay) {
            maxTime = maxTime - delay
            if (maxTime < 0 ) {
                if (this.singleTicker) {
                    KillTimer(this.singleTicker)
                    this.singleTicker = null
                }

                if (this.isVisible() == true) {
                    this.onHideClick()
                }
            } else {
                 this.autoHideTick(maxTime)
            }
        }
        this.singleTicker = SetTimer(tick, this, 100, true)
    }

    onUIShowEvent(args){
       if (args.window != this) {
            return
       }

        let maxTime = this.maxDelayTime
        let tick = function (delay) {
            maxTime = maxTime - delay
            if (maxTime < 0 ) {
                if (this.singleTicker) {
                    KillTimer(this.singleTicker)
                    this.singleTicker = null
                }

                if (this.isVisible() == true) {
                    this.onHideClick()
                }
            } else {
                 this.autoHideTick(maxTime)
            }
        }
        this.singleTicker = SetTimer(tick, this, 100, true)
    }

    onUIHideEvent(args) {
        if (args.window != this) {
            return
        }
        if (this.singleTicker) {
            KillTimer(this.singleTicker)
            this.singleTicker = null
        }
    }

    autoHideTick(leftTime){
        this.mElemList["time"].text = String.format(Localize_cns("LUCKY_TXT10"),Math.floor(leftTime / 1000))
    }

    //抽奖
    onLuckyClick(){
        let index = this.index
        let info = this.radioConfig[index-1] || null
		if(info == null){
			return
		}

		let bindGold = GetHeroProperty("bindGold")
		let curGold= GetHeroProperty("gold")
		// let config = info.config[index]
		let typeS =  info[1]
		let needNum = info[2]
		if(typeS == opItemUnit.BIND_CURRENCY){
			if(needNum > bindGold){
				MsgSystem.addTagTips(Localize_cns("LUCKY_TXT3"))
				return
			}
		}else if(typeS == opItemUnit.CURRENCY){
			if(needNum > curGold){
				MsgSystem.addTagTips(Localize_cns("LUCKY_TXT4"))
				return
			}
		}
        if (this.singleTicker) {
            KillTimer(this.singleTicker)
            this.singleTicker = null
        }
        RpcProxy.call("C2G_DoOperateActivity",this.activityIndex,[this.index])	//抽奖
    }

    onHideClick(){
        FireEvent(EventDefine.ACTIVITY_RESET, null);
        this.hideWnd()
    }

    //物品列表,多少个物品,活动索引,抽奖索引
    showAndSetData(itemList,activityIndex,index,radioConfig){
        this.itemList = itemList
        this.activityIndex = activityIndex
        this.index = index
        this.radioConfig = radioConfig
        this.showWnd()
    }
}