class PeerlessStakeTipsFrame extends BaseWnd {

    winPrizeInfo
    losePrizeInfo

    public initObj(...params: any[]) {
    }

    public onLoad(): void {
        
        let h = 180
        let w = 600
        this.mLayoutNode.width = w
        this.mLayoutNode.height = h
        this.setAlignCenter(true, true)

        var elemInfo = [
            { ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["title"]: null, ["font"]: null, ["image"]: "ty_tipsDi", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"] :w , ["h"] : h},
           { ["index_type"]: gui.RichDisplayer, ["name"]: "rd_des", ["title"]: null, ["font"]: "ht_20_lc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 30, ["y"]: 20, ["w"]: 540, ["h"]: 140},
        ];
        UiUtil.createElem(elemInfo, this.mLayoutNode, this.mElemList, this);


    }

    public onUnLoad(): void {

    }

    public onShow(): void {
        RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.hideWnd, this)
        this.mLayoutNode.visible = true;
        this.onRefresh()
    }

    public onHide(): void {
        UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.hideWnd, this)
        this.mLayoutNode.visible = false;

        this.winPrizeInfo = null
        this.winPrizeInfo = null
    }

    onRefresh(){
        if(this.winPrizeInfo == null || this.losePrizeInfo == null) return
        let prizeWin = this.winPrizeInfo
        let prizeLose = this.losePrizeInfo
        let itemConfig = GameConfig.itemConfig
        let prizeStr = "#yellow" + Localize_cns("JJC_TXT19") + "#br#br#space#rf" + Localize_cns("JJC_TXT21")
        
        for(let k in prizeWin){
            let v = prizeWin[k]
            let itemInfo = itemConfig[v[0]]
            prizeStr += "#" + GetQualityColorStr(itemInfo.quality) + itemInfo.name + "*" + v[1]
            if(tonumber(k) < (prizeWin.length - 1)){
                prizeStr += "、"
            }
        }

        prizeStr += "#br#br#yellow" + Localize_cns("JJC_TXT20") + "#br#br#space#rf" + Localize_cns("JJC_TXT21")
    
        for(let k in prizeLose){
            let v = prizeLose[k]
            let itemInfo = itemConfig[v[0]]
            prizeStr += "#" + GetQualityColorStr(itemInfo.quality) + itemInfo.name + "*" + v[1]
            if(tonumber(k) < (prizeLose.length - 1)){
                prizeStr += "、"
            }
        }

        AddRdContent(this.mElemList["rd_des"], prizeStr, "ht_20_lc_stroke", "aliceblue")
    }


    ////////////////------
    onShowWnd(prizeWin, prizeLose){
        this.winPrizeInfo = prizeWin
        this.losePrizeInfo = prizeLose
        this.showWnd()
    }
}