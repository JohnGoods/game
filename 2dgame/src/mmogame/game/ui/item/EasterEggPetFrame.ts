// TypeScript file
//宠物获得通用界面
class EasterEggPetFrame extends BaseWnd {
    deblockConfig;
    actorView: UIActorView;
    other_actorView:UIActorView;
    effectView: UIActorView;
    maxDelayTime:number
    data;
    singleTicker;
    petEntry:number
    xianLvEntry;

    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/item/EasterEggPetLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.setAlignCenter(true, true)
        this.initSkinElemList();
        this.maxDelayTime = 5 * 1000
        this.mLayoutNode.verticalCenter = -100

        var elemInfo: any[] = [
            { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.onHideClick },  
        ];

        UiUtil.initElem(elemInfo, this.mLayoutNode, this.mElemList, this);

        this.effectView= UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["group_bg_view"])

        this.actorView = UIActorView.newObj(this.mLayoutNode, "actorview", 0, 0, this.mElemList["group_actorview"])
        this.actorView.setActorScale(1)

        // this.other_actorView = UIActorView.newObj(this.mLayoutNode, "actor_wnd", 0, 0, this.mElemList["actor_wnd"])
        // this.other_actorView.setActorScale(1)
        
        // this.mElemList["rd_gain"].setAlignFlag(gui.Flag.H_CENTER)
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
        // this.other_actorView.clearView()
        this.effectView.clearView()
        if (this.singleTicker) {
            KillTimer(this.singleTicker)
            this.singleTicker = null
        }
    }

    refreshFrame() {
        this.effectView.updateByEffect(effectIndex.BuZhuo)
        if(this.xianLvEntry != null){
            //17001
            this.actorView.updateByPlayer(GetXianlvModel(this.xianLvEntry))
            let quality = XianLvSystem.getInstance().getXianLvQuality(this.xianLvEntry)
            let color = GetQualityColorStr(quality, true)
            let xianLvName = XianLvSystem.getInstance().getXianLvName(this.xianLvEntry)
            AddRdContent(this.mElemList["rd_gain"], String.format(Localize_cns("FIGHT_TXT11"), "#"+color +xianLvName), "ht_20_cc_stroke", "white")
        }else{
            let itemId = 0
            let petEntry = 0
            if(this.petEntry){
                petEntry = this.petEntry
            }else{
                itemId = this.data[3]
                petEntry = ItemSystem.getInstance().getPetIdByItemId(itemId)
            }
            this.actorView.updateByPlayer(GetPetModel(petEntry))
            let quality = PetSystem.getInstance().getPetQuality(petEntry)
            let color = GetQualityColorStr(quality, true)
            AddRdContent(this.mElemList["rd_gain"], String.format(Localize_cns("FIGHT_TXT11"), "#"+color + PetSystem.getInstance().getPetName(petEntry)), "ht_20_cc_stroke", "white")
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

    autoHideTick(leftTime) {
        this.mElemList["btn_close"].text = Localize_cns("SURE") + "(" + Math.floor(leftTime / 1000) + ")"
    }

    onHideClick(){
        FireEvent(EventDefine.ACTIVITY_RESET, null);
        this.hideWnd()
    }

    onShowAndSetData(data,petEntry,xianLvEntry) {
        this.data = null
        if(data){
            this.data = data
        }  
        this.petEntry = null
        if(petEntry){
            this.petEntry = petEntry
        }
        this.xianLvEntry = null
        if(xianLvEntry){
            this.xianLvEntry = xianLvEntry
        }
        // this.data = dataTest
        this.showWnd()
    }
}