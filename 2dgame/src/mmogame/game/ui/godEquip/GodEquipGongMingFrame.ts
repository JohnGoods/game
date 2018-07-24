// TypeScript file
class GodEquipGongMingFrame extends BaseWnd {
    public initObj(...params: any[]) {
        this.mLayoutPaths = ["resource/layouts/godEquip/GodEquipGongMingLayout.exml"]
    }

    public onLoad(): void {
        this.mLayoutNode.skinName = this.mLayoutPaths[0];
        this.initSkinElemList();
        this.setAlignCenter(true, true)

        // var elemInfo = [
        //     { ["name"]: "btn_close", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },   { ["name"]: "btn_close_top", ["title"]: null, ["event_name"]: egret.TouchEvent.TOUCH_TAP, ["fun_index"]: this.hideWnd },
        // ]
        let t = <eui.Button>this.mElemList["btn_close"]
        t.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hideWnd, this)

        //god_rd_tip1
        //god_rd_tip2
        //god_rd_tip3
        this.mElemList["god_rd_tip1"].setAlignFlag(gui.Flag.H_CENTER)
		this.mElemList["god_rd_tip2"].setAlignFlag(gui.Flag.H_CENTER)
        this.mElemList["god_rd_tip3"].setAlignFlag(gui.Flag.H_CENTER)
        this.mElemList["level_gongming_rd"].setAlignFlag(gui.Flag.H_CENTER)
        
   }


    public onUnLoad(): void {

    }

    public onShow(): void {
        this.mLayoutNode.visible = true;
        this.onRefresh()
    }

    public onHide(): void {
        this.mLayoutNode.visible = false;
    }

    onRefresh(){
        AddRdContent(this.mElemList["god_rd_tip2"], Localize_cns("GOD_EQUIP_TXT11"), "ht_18_cc_stroke", "white")
        AddRdContent(this.mElemList["god_rd_tip3"], Localize_cns("GOD_EQUIP_TXT12"), "ht_18_cc_stroke", "white")
    
        let config = GameConfig.RoleEquipResonateConfig
        let LianSuoconfig = config["GodEquip"]    //连锁共鸣
        let levelConfig = config["GodEquipLevel"]    //等级

        let list1 = []  //等级
        for(let _ in levelConfig){
            table_insert(list1,levelConfig[_])
        }

        let equipNum = 0
        let cueGodEquipAllLevel = 0
        let arr = RoleSystem.getInstance().getRoleEquipItemList()
		let subtypeList = GameConfig.FunEquipCaseConfig["Hero"].subtype
		for(let i = 0; i < 10; i++){
			let subtype = subtypeList[i]
			let roleItem = RoleSystem.getInstance().getRoleEquipItem(subtype)
			if(roleItem && roleItem.propertyInfo.quality >= 6){
                equipNum = equipNum + 1 //穿戴了神装数量+1
                let level = roleItem.getRefProperty("uselevel")
                cueGodEquipAllLevel = cueGodEquipAllLevel + level
			}
		}

        let levelRd = String.format(Localize_cns("GOD_EQUIP_TXT10"),cueGodEquipAllLevel)
        AddRdContent(this.mElemList["god_rd_tip1"], levelRd, "ht_18_cc_stroke", "white")

        let isHaveGodEquip = false  //是否拥有神装
        if(equipNum>0){
            isHaveGodEquip = true
        }        

        this.mElemList["have_god_equip_tip1"].visible = (isHaveGodEquip == false)
        this.mElemList["have_god_equip_tip2"].visible = (isHaveGodEquip == false)
        this.mElemList["level_tip"].visible = false
        AddRdContent(this.mElemList["level_gongming_rd"], "", "ht_18_cc_stroke", "white")
        AddRdContent(this.mElemList["god_liansuo_rd1"], "", "ht_18_cc_stroke", "white")
        AddRdContent(this.mElemList["god_liansuo_rd2"], "", "ht_18_cc_stroke", "white")

        if(isHaveGodEquip){
            //神装等级
            let levelInfo = null
            for(let i = 0;i<size_t(list1);i++){
                if(cueGodEquipAllLevel >= list1[i].maxLevel){
                    levelInfo = list1[i]
                }else{
                    break
                }
            }
            
            if(levelInfo!=null){
                let effects = levelInfo.effects //属性
                let index = 0
                let str = ""
                for(let _ in effects){
                    let proName = GetPropertyName(effects[_][0])
					let proValue = effects[_][1]
                    if(index == 2){
                        str = str + "#br" + proName + proValue + "#space"
                        index = 0
                    }else{
                        str = str + proName + proValue + "#space"
                        index = index + 1
                    }
                }
                AddRdContent(this.mElemList["level_gongming_rd"], str, "ht_20_cc_stroke", "lime",3)
            }else{  //神装等级不够共鸣
                this.mElemList["level_tip"].visible = true
            }

            //连锁属性
            let isMaxLianSuo = false
            if(equipNum>=10){
                isMaxLianSuo = true
            }
            let liansuoInfo = null
            let nextLianSuoInfo = null
            if(LianSuoconfig[equipNum]){
                liansuoInfo = LianSuoconfig[equipNum]
            }
            if(isMaxLianSuo == false){
                nextLianSuoInfo = LianSuoconfig[equipNum+1]
            }

            //当前的
            if(liansuoInfo!=null){
                let effects = liansuoInfo.effects //属性
                let str = String.format(Localize_cns("GOD_EQUIP_TXT13"),equipNum) + "#br"
                for(let _ in effects){
                    let proName = GetPropertyName(effects[_][0])
					let proValue = effects[_][1]
                    str = str + "#lime" + proName + proValue + "#rf#br"
                }
                AddRdContent(this.mElemList["god_liansuo_rd1"], str, "ht_20_cc_stroke", "white",3)
            }

            if(nextLianSuoInfo != null){  //没有超过十件
                let effects = nextLianSuoInfo.effects //属性
                let str = String.format(Localize_cns("GOD_EQUIP_TXT13"),equipNum+1) + "#br"
                for(let _ in effects){
                    let proName = GetPropertyName(effects[_][0])
					let proValue = effects[_][1]
                    str = str + proName + proValue + "#br"
                }
                AddRdContent(this.mElemList["god_liansuo_rd2"], str, "ht_20_cc_stroke", "white",3)
            }
        }

        let index = 1
    }
}