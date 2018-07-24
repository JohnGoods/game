class ForgeLevelFrame extends BaseWnd {
    index;
    
    public initObj(...params: any[]) {
	   
        
	}
    public onLoad(): void {
		
       this.mLayoutNode.width = 560
       this.mLayoutNode.height = 450
       this.setAlignCenter(true, true)

        let mElemInfo: any = [

            { ["index_type"]: eui.Group, ["name"]: "group_dashi", ["title"]: null, ["font"]: null, ["image"]: "", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"] : 560, ["h"] : 450},
            { ["index_type"]: gui.Grid9Image, ["name"]: "bg", ["title"]: null, ["font"]: null, ["image"]: "ty_tipsDi", ["color"]: gui.Color.white, ["x"]: 0, ["y"]: 0, ["w"] : 560, ["h"] : 450},
            { ["index_type"]: eui.Image, ["name"]: "sprite", ["title"]: null, ["font"]: null, ["image"]: "", ["color"]: gui.Color.white, ["x"]: 20, ["y"]: 15, ["w"] : 100, ["h"] : 96},
            { ["index_type"]: eui.Label, ["name"]: "label_jie", ["title"]: "", ["font"]: "ht_22_cc", ["image"]: "", ["color"]: gui.Color.orange, ["x"]: 22, ["y"]: 26, ["w"] : 35, ["h"] : 22},
            { ["index_type"]: gui.RichDisplayer, ["name"]: "rd_exp", ["title"]: null, ["font"]: "ht_24_lc", ["image"]: "", ["color"]: gui.Color.lime, ["x"]: 8, ["y"]: 113, ["w"]: 120, ["h"]: 24, },
            { ["index_type"]: gui.RichDisplayer, ["name"]: "rd_des", ["title"]: null, ["font"]: "ht_24_lc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 145, ["y"]: 30, ["w"]: 380, ["h"]: 80},
            { ["index_type"]: gui.Grid9Image, ["name"]: "line", ["title"]: null, ["font"]: null, ["image"]: "cz_uiLine01", ["color"]: gui.Color.white, ["x"]: 10, ["y"]: 145, ["w"] : 540, ["h"] : 16},
            { ["index_type"]: gui.RichDisplayer, ["name"]: "rd_effect", ["title"]: null, ["font"]: "ht_24_lc", ["image"]: "", ["color"]: gui.Color.white, ["x"]: 40, ["y"]: 170, ["w"]: 480, ["h"]: 280 },
            
        ]
        UiUtil.createElem(mElemInfo, this.mLayoutNode, this.mElemList, this)

        this.mElemList["rd_exp"].setAlignFlag(gui.Flag.CENTER_CENTER);
        this.mElemList["rd_des"].setAlignFlag(gui.Flag.LEFT_CENTER);
        this.mElemList["rd_effect"].setAlignFlag(gui.Flag.LEFT_TOP);
		
       
		
	}
    public onUnLoad(): void {

	}

	public onShow(): void {
        RegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.hideWnd, this)
		this.mLayoutNode.visible = true;
        this.mLayoutNode.setDoModal(true);
        this.onRefresh();

	}

	public onHide(): void {
        UnRegisterEvent(EventDefine.ROOTWINDOW_MOUSE_UP, this.hideWnd, this)
		this.mLayoutNode.visible = false;
        this.mLayoutNode.setDoModal(false);
    }

    onRefresh(){
        //common
        let imageName = "dz_Bt0"
        imageName = imageName + (this.index + 1)
        this.mElemList["sprite"].source = imageName;
       // let forgeTypeInfo = ForgeSystem.getInstance().getForgeInfo("forgeType")
        let typeName = elemForgeNames[this.index]
        let forgeType = ForgeSystem.getInstance().getForgeClassType(typeName)
        let forgeLevel = ForgeSystem.getInstance().getForgeTypeLevel(typeName)
        let needLevel = ForgeSystem.getInstance().getDaShiNeedLevel(typeName, this.index)

        let tempConfig = GameConfig.FunForgeMasterConfig[typeName][needLevel]

        let expStr = "#lime(" + forgeLevel + "/" + needLevel + ")"
        if(forgeLevel == needLevel){
            expStr = "#lime" + Localize_cns("ROLE_TXT31")
        }
        AddRdContent(this.mElemList["rd_exp"], expStr, "ht_24_cc_stroke")

        this.mElemList["label_jie"].text = forgeType + Localize_cns("PET_TXT10")

        let quanShenlist = [
            Localize_cns("FORGE_TXT6"),Localize_cns("FORGE_TXT7"),
            Localize_cns("FORGE_TXT8"),Localize_cns("FORGE_TXT8"),
        ]

        let desStr = ""
        let effectStr = ""
        let height = 0

        if(forgeType == 0){
            this.mElemList["label_jie"].visible = false
            UiUtil.grayComponent(this.mElemList["sprite"], true)
            desStr += Localize_cns("FORGE_LEVEL_DES_FALSE") + "#br#br" + Localize_cns("FORGE_LEVEL_FALSE")

            let nextConfig = table_effect(tempConfig.effects)
            let nextStr = tempConfig.explain
            
            let zhanLiStr = String.format(Localize_cns("FORGE_LEVEL_ZHANLI"), GetForceMath(nextConfig))

            effectStr += "#gray" + Localize_cns("FORGE_LEVEL_EFFECT_NEXT") + quanShenlist[this.index] + "+" + needLevel + "#br#br#space" + nextStr + "#br#br#br#lime" + zhanLiStr

            height = 350 
        }else{
            this.mElemList["label_jie"].visible = true
            UiUtil.grayComponent(this.mElemList["sprite"], false)

           
            let masterHadConfig = GameConfig.FunForgeMasterConfig[typeName]
            let hadLevel = ForgeSystem.getInstance().getNowForgeLevel(masterHadConfig, forgeType)
            desStr = quanShenlist[this.index] + "+" + hadLevel + "#br#br" + Localize_cns("FORGE_LEVEL_TRUE")

            let effects = masterHadConfig[hadLevel].effects
            let hadConfig = table_effect(effects)
            let hadStr = masterHadConfig[hadLevel].explain
            let hadForce = GetForceMath(hadConfig)

            effectStr +=  Localize_cns("FORGE_LEVEL_EFFECT") + "#orange" + quanShenlist[this.index] + "+" + hadLevel +"#rf#br#br#space" + hadStr +"#br#br"
            height = 350
            if(forgeLevel != needLevel){ //不是最后 
                let nextConfig = table_effect(tempConfig.effects)
                let nextStr = tempConfig.explain
              
                let nextForce = GetForceMath(nextConfig)
                let forceStr = String.format(Localize_cns("FORGE_LEVEL_ZHANLI"), nextForce - hadForce)

                effectStr += "#gray" + Localize_cns("FORGE_LEVEL_EFFECT_NEXT") + quanShenlist[this.index] + "+" + needLevel + "#br#br#space"+ nextStr + "#br#br#br#lime" + forceStr
                height = 450
            }

            
        }
        AddRdContent(this.mElemList["rd_des"], desStr, "ht_24_lc_stroke")
        AddRdContent(this.mElemList["rd_effect"], effectStr, "ht_24_lc_stroke")
        
        this.mLayoutNode.height = height
        this.mElemList["group_dashi"].height = height
        this.mElemList["bg"].height = height
    }

    onShowWnd(index){
        this.index = index;
        this.showWnd()
    }
   
}// TypeScript file