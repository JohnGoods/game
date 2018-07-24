// TypeScript file
//解锁物品界面
class DeblockingItemFrame extends BaseWnd {
    deblockConfig;
    actorView: UIActorView;
    other_actorView:UIActorView;
    effectView: UIActorView;
    maxDelayTime:number
    data;
    singleTicker;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/item/DeblockingItemLayout.exml"]
        this.singleTicker = null
        this.maxDelayTime = 5 * 1000
        this.deblockConfig = [
            {funType: cellOptionsIndex.Hero, handle: this.onRefreshHeroModel, param:""},
			{funType: cellOptionsIndex.HeroEquip, handle: this.onRefreshHeroEquipModel, param:""},
			{funType: cellOptionsIndex.HeroRide, handle: this.onRefreshRideModel, param:""},
			{funType: cellOptionsIndex.HeroWing, handle: this.onRefreshWingModel, param:""},
			{funType: cellOptionsIndex.PetTongLin, handle: this.onRefreshTongLingModel, param:""},
			{funType: cellOptionsIndex.PetSouHun, handle: this.onRefreshShouHunModel, param:""},
			{funType: cellOptionsIndex.XianLvFaZhen, handle: this.onRefreshFaZhenModel, param:""},
			{funType: cellOptionsIndex.XianLvXianWei, handle: this.onRefreshXianWeiModel, param:""},
			{funType: cellOptionsIndex.TianXian, handle: this.onRefreshTianXianAdvanceModel, param:""},
			{funType: cellOptionsIndex.TianXianWeapon, handle: this.onRefreshTianXianWeaponModel, param:""},
			{funType: cellOptionsIndex.TianNv, handle: this.onRefreshTianNvModel, param:""},
			{funType: cellOptionsIndex.TianNvXianQi, handle: this.onRefreshTianNvXianQiModel, param:""},
			{funType: cellOptionsIndex.TianNvHuaNian, handle: this.onRefreshTianNvHuaNianModel, param:""},
			{funType: cellOptionsIndex.TianNvLingQi, handle: this.onRefreshTianNvLingQiModel, param:""},
		]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setAlignCenter(true, true)
        this.initSkinElemList();

        this.mLayoutNode.verticalCenter = -100

        var elemInfo: any[] = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },  
        ];

        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.effectView= UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["group_bg_view"])

        this.actorView = UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["group_actorview"])
        // this.actorView.setActorScale(1)

        this.other_actorView = UIActorView.newObj(this.mLayoutNode, "actor_wnd", 0, 0, this.mElemList["actor_wnd"])
        // this.other_actorView.setActorScale(1)
        
        this.mElemList["rd_gain"].setAlignFlag(gui.Flag.H_CENTER)
    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.UI_SHOW, this.onUIShowEvent, this)
        RegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)
        this.mLayoutNode.visible = true;
        GameSound.getInstance().playEffect(SystemSound.effect_win)
        this.refreshFrame()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.UI_SHOW, this.onUIShowEvent, this)
        UnRegisterEvent(EventDefine.UI_HIDE, this.onUIHideEvent, this)

        this.mLayoutNode.visible = false;
        this.actorView.clearView()
        this.other_actorView.clearView()
        this.effectView.clearView()
        if (this.singleTicker) {
            KillTimer(this.singleTicker)
            this.singleTicker = null
        }
    }

    refreshFrame() {
        this.mElemList["title_icon"].visible = false
        this.effectView.updateByEffect(effectIndex.BuZhuo)
        //param:{commonPrize: {funds=0, bindCurrency=0, currency=0, plrExp=0, itemList={}, star=3, campaignId=0, petEntry=0}
        //         fightType: }
        // let funType = this.data.funType
        // let funcName = cellOptionsName[funType - 1]
        // let petEntry = 20001
        // if (this.param && this.param.commonPrize) {
        //     petEntry = this.param.commonPrize.petEntry
        // }
        // this.actorView.updateByPlayer(GetPetModel(petEntry))

        for(let _ in this.deblockConfig){
            let config = this.deblockConfig[_]
            if(this.data.funType == config.funType){
                let func:Function = config.handle
                if(func){
					func.call(this)
                }
                break
            }
        }
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
                    this.hideWnd()
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
    
    // starShowCombatEnd() {
    //     return this.showWnd()
    // }

    autoHideTick(leftTime) {
        this.mElemList["btn_close"].text = Localize_cns("SURE") + "(" + Math.floor(leftTime / 1000) + ")"
    }

    //各种刷新model
    //称号
    onRefreshHeroModel(){ 
        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        let funType = this.data.funType
        let funcName = cellOptionsName[funType - 1]
        let config = GameConfig.FunSkinConfig[funcName]
        let info = config[this.data.index]
        let skinid = info.skin
        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			rideShapeId : playerInfo.rideShapeId,
			wingShapeId : playerInfo.wingShapeId,
			weaponShapeId : playerInfo.weaponShapeId,
		}
		modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId
		this.actorView.updateByPlayerAppearInfo(modelList)
        this.actorView.setXY(0,0)
        let image = GetShapeImage(skinid)
        this.mElemList["title_icon"].visible = true
        this.mElemList["title_icon"].source = image

        let deblockName = info.nameStr
        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }

    //时装
    onRefreshHeroEquipModel(){
        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        let funType = this.data.funType
        let funcName = cellOptionsName[funType - 1]
        
        let modelId = 0
        let playerInfo = GetHeroPropertyInfo()

        let config = GameConfig.FunSkinConfig[funcName]
        let info = config[this.data.index]
        modelId = info.skin
        
		let modelList = {
			rideShapeId : playerInfo.rideShapeId,
			wingShapeId : playerInfo.wingShapeId,
			weaponShapeId : playerInfo.weaponShapeId,
            heroShapeId : modelId
		}
		modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId
		this.actorView.updateByPlayerAppearInfo(modelList)
        this.actorView.setXY(0,0)

        let deblockName = info.nameStr
        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }

    //坐骑
    onRefreshRideModel(){
        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        let deblockName = ""
        let unlockType = this.data.unlockType
        let funType = this.data.funType
        let funcName = cellOptionsName[funType - 1]
        
        let modelId = 0
        if(unlockType == 1){
            let config = GameConfig.FunShapeConfig[funcName]
            let info = config[this.data.index]
            modelId = info.Shape
            deblockName = info.nameStr
            text = Localize_cns("ITEM_DEBLOCK_GET")
        }else if(unlockType == 0){
           let config = GameConfig.FunSkinConfig[funcName]
            let info = config[this.data.index]
            deblockName = info.nameStr
            modelId = info.skin
        }

        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			rideShapeId : modelId,
			wingShapeId : playerInfo.wingShapeId,
			weaponShapeId : playerInfo.weaponShapeId,
		}
		modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId
		this.actorView.updateByPlayerAppearInfo(modelList)
        this.actorView.setXY(0,0)

        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }

    //翅膀
    onRefreshWingModel(){
        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        let deblockName = ""
        let unlockType = this.data.unlockType
        let funType = this.data.funType
        let funcName = cellOptionsName[funType - 1]
        
        let modelId = 0
        if(unlockType == 1){
            let config = GameConfig.FunShapeConfig[funcName]
            let info = config[this.data.index]
            modelId = info.Shape
            deblockName = info.nameStr
        }else if(unlockType == 0){
           let config = GameConfig.FunSkinConfig[funcName]
            let info = config[this.data.index]
            modelId = info.skin
            deblockName = info.nameStr
        }

        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			rideShapeId : playerInfo.rideShapeId,
			wingShapeId : modelId,
			weaponShapeId : playerInfo.weaponShapeId,
		}

        modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId
		this.actorView.updateByPlayerAppearInfo(modelList)
        this.actorView.setXY(0,0)
        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }

    //通灵(X阶)
    onRefreshTongLingModel(){
        let funType = this.data.funType
        let strName = ChannelHyperlinkMrg.getInstance().getFunctionName(funType)
        let funcName = cellOptionsName[funType - 1]  
        let modelId = 0
        let config = GameConfig.FunShapeConfig[funcName]
        let info = config[this.data.index]
        modelId = info.Shape

        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			petTLShapeId : modelId,
		}

        let activeList = PetSystem.getInstance().getPetActiveList()
        let petShapeId = activeList[0] //playerInfo.petShapeId
		this.actorView.updateByPetAppearInfo(petShapeId,modelList)
        this.actorView.setXY(0,0)

        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        let deblockName = strName + String.format(Localize_cns("OPENSERVER_TXT4"),this.data.index)
        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }

    //兽魂
    onRefreshShouHunModel(){
        let funType = this.data.funType
        let funcName = cellOptionsName[funType - 1]
        
        let modelId = 0
        let config = GameConfig.FunShapeConfig[funcName]
        let info = config[this.data.index]
        modelId = info.Shape

        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			petSHShapeId : modelId,
		}

        let activeList = PetSystem.getInstance().getPetActiveList()
        let petShapeId = activeList[0] //playerInfo.petShapeId
		this.actorView.updateByPetAppearInfo(petShapeId,modelList)
        this.actorView.setXY(0,0)

        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        let deblockName = info.nameStr
        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }

    //法阵(X阶)
    onRefreshFaZhenModel(){
        let funType = this.data.funType
        let funcName = cellOptionsName[funType - 1]
        let strName = ChannelHyperlinkMrg.getInstance().getFunctionName(funType)
        let modelId = 0
        let config = GameConfig.FunShapeConfig[funcName]
        let info = config[this.data.index]
        modelId = info.Shape

        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			xlFZShapeId : modelId,
		}

        let xianlvShapeId = playerInfo.xianlvShapeId
		this.actorView.updateByXianLvAppearInfo(xianlvShapeId,modelList)
        this.actorView.setXY(0,0)

        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        let deblockName = strName + String.format(Localize_cns("OPENSERVER_TXT4"),this.data.index)
        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }

    //仙位(X阶)
    onRefreshXianWeiModel(){
        let funType = this.data.funType
        let funcName = cellOptionsName[funType - 1]
        let strName = ChannelHyperlinkMrg.getInstance().getFunctionName(funType)
        let modelId = 0
        let config = GameConfig.FunShapeConfig[funcName]
        let info = config[this.data.index]
        modelId = info.Shape

        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			xlXWShapeId : modelId,
		}

        let xianlvShapeId = playerInfo.xianlvShapeId
		this.actorView.updateByXianLvAppearInfo(xianlvShapeId,modelList)
        this.actorView.setXY(0,0)

        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        let deblockName = strName + String.format(Localize_cns("OPENSERVER_TXT4"),this.data.index)
        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }

    //14天仙
    onRefreshTianXianAdvanceModel(){
        let unlockType = this.data.unlockType
        let funType = this.data.funType
        let funcName = cellOptionsName[funType - 1]
        let deblockName = ""
        
        let tianxianShapeId = 0
        let modelId = 0
        if(unlockType == 1){
            let config = GameConfig.FunShapeConfig[funcName]
            let info = config[this.data.index]
            tianxianShapeId = info.Shape
            modelId = tianxianShapeId
            deblockName = info.nameStr
        }else if(unlockType == 0){
           let config = GameConfig.FunSkinConfig[funcName]
            let info = config[this.data.index]
            tianxianShapeId = info.skin
            modelId = GetShapeModelId(tianxianShapeId)
            deblockName = info.nameStr
        }

        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			rideShapeId : playerInfo.rideShapeId,
			wingShapeId : playerInfo.wingShapeId,
			weaponShapeId : playerInfo.weaponShapeId,
            // heroShapeId : skinid
			//tianxianShapeId : this.list[this.select].Shape
		}
		modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId
		this.actorView.updateByPlayerAppearInfo(modelList)
        this.actorView.setXY(0,0)
        
        this.other_actorView.updateByPlayer(modelId)
        this.other_actorView.setXY(0,0)

        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }

    //神兵
    onRefreshTianXianWeaponModel(){
        let unlockType = this.data.unlockType
        let funType = this.data.funType
        let funcName = cellOptionsName[funType - 1]
        let deblockName = ""
        let modelId = 0
        if(unlockType == 1){
            let config = GameConfig.FunShapeConfig[funcName]
            let info = config[this.data.index]
            modelId = info.Shape
            deblockName = info.nameStr
        }else if(unlockType == 0){
           let config = GameConfig.FunSkinConfig[funcName]
            let info = config[this.data.index]
            modelId = info.skin
            deblockName = info.nameStr
        }

        let playerInfo = GetHeroPropertyInfo()
		let modelList = {
			rideShapeId : playerInfo.rideShapeId,
			wingShapeId : playerInfo.wingShapeId,
			weaponShapeId : modelId,
		}
		modelList["vocation"] = playerInfo.vocation
        modelList["sexId"] = playerInfo.sexId
		this.actorView.updateByPlayerAppearInfo(modelList)
        this.actorView.setXY(0,0)

        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }

    onRefreshTianNvModel(){
        let funType = this.data.funType
        let funcName = cellOptionsName[funType - 1]
        let strName = ChannelHyperlinkMrg.getInstance().getFunctionName(funType)
        let modelId = 0
        let config = GameConfig.FunShapeConfig[funcName]
        let info = config[this.data.index]
        modelId = info.Shape

        this.actorView.updateByPlayer(modelId)
        this.actorView.setXY(0,0)

        let deblockName = strName + String.format(Localize_cns("OPENSERVER_TXT4"),this.data.index)
        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }

    onRefreshTianNvXianQiModel(){
        let funType = this.data.funType
        let funcName = cellOptionsName[funType - 1]
        let strName = ChannelHyperlinkMrg.getInstance().getFunctionName(funType)

        let modelId = 0
        let arr = FunSystem.getInstance().getFunInfoWithType(cellOptionsIndex.TianNv)
		let stage = arr["stage"]
		if(arr.curshape != 0){
			modelId = GetFunShapeModel(cellOptionsIndex.TianNv, stage)
		}else{
			modelId = GetFunSkinModel(cellOptionsIndex.TianNv, arr.curskin)
		}

        this.actorView.updateByPlayer(modelId)
        this.actorView.setXY(0,0)

        let config = GameConfig.FunShapeConfig[funcName]
        let info = config[this.data.index]
        let imageId = info.Shape
        let image = GetShapeImage(imageId)
        this.mElemList["title_icon"].visible = true
		this.mElemList["title_icon"].source = image

        let deblockName = strName + String.format(Localize_cns("OPENSERVER_TXT4"),this.data.index)
        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }

    onRefreshTianNvHuaNianModel(){
        let funType = this.data.funType
        let funcName = cellOptionsName[funType - 1]
        let strName = ChannelHyperlinkMrg.getInstance().getFunctionName(funType)
        let modelId = 0
        let config = GameConfig.FunShapeConfig[funcName]
        let info = config[this.data.index]
        modelId = info.Shape

        this.actorView.updateByPlayer(modelId)
        this.actorView.setXY(0,0)

        let deblockName = strName + String.format(Localize_cns("OPENSERVER_TXT4"),this.data.index)
        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }

    onRefreshTianNvLingQiModel(){
        let funType = this.data.funType
        let funcName = cellOptionsName[funType - 1]
        let strName = ChannelHyperlinkMrg.getInstance().getFunctionName(funType)
        let modelId = 0
        let config = GameConfig.FunShapeConfig[funcName]
        let info = config[this.data.index]
        modelId = info.Shape

        this.actorView.updateByPlayer(modelId)
        this.actorView.setXY(0,0)

        let deblockName = strName + String.format(Localize_cns("OPENSERVER_TXT4"),this.data.index)
        let text = Localize_cns("ITEM_DEBLOCK_UNLOCK")
        AddRdContent(this.mElemList["rd_gain"], String.format(text, "#cyan" + deblockName), "ht_20_cc_stroke", "white")
    }


    onShowAndSetData(data) {
        // let dataTest = {"funType":19,"index":1,"unlockType":0}
        this.data = data
        // this.data = dataTest
        this.showWnd()
    }
}