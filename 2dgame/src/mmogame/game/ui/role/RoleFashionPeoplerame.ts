// TypeScript file
class RoleFashionPeopleFrame extends BaseWnd {
   
    GOLDEQUIP_ADD_LEVEL = 200

    public initObj(...params: any[]) {
	    this.mLayoutPaths = ["resource/layouts/role/RoleFashionPeopleLayout.exml"]
	}
    public onLoad(): void {
		this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.mLayoutNode.width = 500
        this.mLayoutNode.height = 456
        this.setAlignCenter(true, true)
		//UiUtil.setFrameSize(this.mLayoutNode, 470, 400, 85, 225)
		this.initSkinElemList();

        let t = <eui.Group>this.mElemList["group_1"]
        t.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hideWnd, this)
		
        this.mElemList["rd_now"].setAlignFlag(gui.Flag.LEFT_TOP);
		this.mElemList["rd_next"].setAlignFlag(gui.Flag.LEFT_TOP);
	}
    public onUnLoad(): void {

	}

	public onShow(): void {
        UiUtil.registerTouchOutsideEvent(this.hideWnd, this, [this.mLayoutNode])
		this.mLayoutNode.visible = true;
        //this.mLayoutNode.setDoModal(true);
		this.onRefresh();
	}

	public onHide(): void {
        UiUtil.unRegisterTouchOutsideEvent(this.hideWnd, this)
		this.mLayoutNode.visible = false;
		//this.mLayoutNode.setDoModal(false);
	}
    onRefresh(){
        //装备
        let equiplist = RoleSystem.getInstance().getRoleEquipItemList()
        let goldList = []
        for(let k in equiplist){
            let item : Item = equiplist[k]
            if(item.getProperty("quality") >= 5 ){
                table_insert(goldList, item)
            }
        }
        
        let state = 0
        let dataKey = -1
        let nextKey = -1
        let h = 456
        let resonateConfig = GameConfig.RoleEquipResonateConfig["GoldEquip"]
        for(let k in resonateConfig){
            if(nextKey == -1){
                nextKey = tonumber(k)
            }
            let tempInfo = resonateConfig[k]
            let count = 0
            for(let i in goldList){
                let item : Item = goldList[i]
                let level = item.getRefProperty("level")
                let quality = item.getProperty("quality") 
                if(quality > opEquipQuality.gold) level += 200
                if( level >= tempInfo.greater){
                    count += 1
                }
            }
            if(count >= tempInfo.wear){
                dataKey = tonumber(k)
            }
        }
        let nowConfig = resonateConfig[dataKey]
        let nextConfig = resonateConfig[dataKey + 1]
        if(nextConfig == null && nowConfig == null){
            nextConfig = resonateConfig[nextKey]
        }
        if(nowConfig == null ){  //未激活
            this.mElemList["group_next"].visible = false
            let nextStr = "#yellow" + Localize_cns("FORGE_LEVEL_EFFECT_NEXT") + String.format(Localize_cns("FASHION_EFFECT_TIPS"), nextConfig.wear, nextConfig.greater) + "#br#br"
            let tempNextConfig = table_effect(nextConfig.effects) 
            for(let k in tempNextConfig){
               nextStr += "#rf#space" + GetPropertyName(k) + "+" + tempNextConfig[k] 
            }
            nextStr += "#br#br#lime" + Localize_cns("FORGE_LEVEL_FALSE")
            AddRdContent(this.mElemList["rd_now"], nextStr, "ht_20_cc_stroke")
            this.mElemList["image_jiHuo"].visible = false
            h = 278
        }else{
            this.mElemList["group_next"].visible = true
            let nowStr = "#yellow" + Localize_cns("FORGE_LEVEL_EFFECT") + String.format(Localize_cns("FASHION_EFFECT_TIPS"), nowConfig.wear, nowConfig.greater) + "#br#br"
            let tempNowConfig = table_effect(nowConfig.effects) 
            for(let k in tempNowConfig){
               nowStr += "#rf#space" + GetPropertyName(k) + "+" + tempNowConfig[k] 
            }

            this.mElemList["image_jiHuo"].visible = true
            //如果不是最后
            if(nextConfig != null){
                let nextStr = "#yellow" + Localize_cns("FORGE_LEVEL_EFFECT_NEXT") + String.format(Localize_cns("FASHION_EFFECT_TIPS"), nextConfig.wear, nextConfig.greater) + "#br#br"
                let tempNextConfig = table_effect(nextConfig.effects) 
                for(let k in tempNextConfig){
                    nextStr += "#rf#space" + GetPropertyName(k) + "+" + tempNextConfig[k] 
                }
                let nowForce = GetForceMath(tempNowConfig)
                let nextForce = GetForceMath(tempNextConfig)
                nextStr += "#lime#br#br" + String.format(Localize_cns("FORGE_LEVEL_ZHANLI"), nextForce - nowForce) + "#br#br" +Localize_cns("FASHION_MAN_TIPS")

                AddRdContent(this.mElemList["rd_next"], nextStr, "ht_20_cc_stroke")
                h = 456
            }else{
                this.mElemList["group_next"].visible = false
                this.mElemList["image_jiHuo"].visible = true
                nowStr += "#br#br#lime" + Localize_cns("ROLE_TXT31")
                this.mElemList["image_jiHuo"].visible = false
                h = 278
            }

            AddRdContent(this.mElemList["rd_now"], nowStr, "ht_20_cc_stroke")
        }
        this.mLayoutNode.height = h
    }
}
